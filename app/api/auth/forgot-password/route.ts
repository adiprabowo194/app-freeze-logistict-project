import { NextResponse } from "next/server";
import crypto from "crypto";
import { Resend } from "resend";
import "@/models";
import { Users, ResetTokens } from "@/models";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email wajib diisi" }, { status: 400 });
    }

    // ========================
    // CHECK EMAIL
    // ========================
    const user = await Users.findOne({ where: { email } });

    if (!user) {
      return NextResponse.json(
        { error: "Email tidak ditemukan" },
        { status: 404 },
      );
    }

    // ========================
    // GENERATE TOKEN
    // ========================
    const token = crypto.randomBytes(32).toString("hex");
    // const expired = new Date(Date.now() + 1000 * 60 * 15);
    // 🔥 FIX EXPIRED (15 menit dari sekarang)
    const expired = new Date();
    expired.setMinutes(expired.getMinutes() + 15);

    const expiredFormatted = expired
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    // ========================
    // NONAKTIFKAN TOKEN LAMA
    // ========================
    await ResetTokens.update({ is_active: false }, { where: { email } });

    // ========================
    // INSERT TOKEN BARU
    // ========================
    await ResetTokens.create({
      email,
      token,
      is_active: true,
    });

    // ========================
    // UPDATE USER
    // ========================
    await user.update({
      reset_token: token,
      reset_token_expired: expiredFormatted,
    });

    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/forgot-password/${token}?email=${email}`;

    // ========================
    // SEND EMAIL
    // ========================
    resend.emails
      .send({
        from: "Freeze Logistics <no-reply@freezelogistics.com.au>",
        to: [email],
        subject: "Reset Password",
        html: `
         <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2 style="color: #333;">Password Reset Request</h2>
            <p>Dear User,</p>
            <p>
                We received a request to reset your password for your account.
                Click the button below to proceed:
            </p>
            <p style="margin: 20px 0;">
                <a href="${resetLink}"
                style="background-color: #2563eb; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                Reset Password
                </a>
            </p>
       
            <p>
                If you did not request this, you can safely ignore this email.
            </p>
            <br/>
            <p>
                Best regards,<br/>
                <strong>Freeze Logistics Team</strong>
            </p>
            </div>
        `,
      })
      .catch(console.error);

    return NextResponse.json({
      message: "Link reset berhasil dikirim",
      time: expired,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
