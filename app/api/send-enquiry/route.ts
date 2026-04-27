import { NextResponse } from "next/server";
import { enquirySchema } from "@/lib/validation/sendEnquiry";
import { getSessionUser } from "@/lib/auth";
import Enquiry from "@/models/Enquiry";
import { Resend } from "resend";
import "@/models";
import { Customers, Users } from "@/models";

const resend = new Resend(process.env.RESEND_API_KEY);

// ========================
// HELPER TIMEZONE
// ========================
function toWIB(date: Date) {
  return new Date(date).toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta",
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // ================= SESSION =================
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const customerCode = user.customer_code;

    if (!customerCode) {
      return NextResponse.json(
        { error: "customer_code not found in session" },
        { status: 400 },
      );
    }

    // ================= GET USER + CUSTOMER =================
    const userLogin = await Users.findOne({
      where: { customer_code: customerCode },
      include: [
        {
          model: Customers,
          as: "customer",
          attributes: [
            "pic_name",
            "pic_phone",
            "company_name",
            "customer_code",
          ],
          required: false,
        },
      ],
    });

    if (!userLogin) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 🔥 IMPORTANT: convert ke plain object
    const userPlain = userLogin.get({ plain: true });

    // ================= VALIDATION =================
    const validated = enquirySchema.parse(body);

    // ================= INSERT DB =================
    const formData = {
      enquiry: validated.enquiry,
      connote_no: body.connote_no,
      customer_code: customerCode,
      company_name: userPlain.customer?.company_name,
      pic_name: userPlain.customer?.pic_name,
    };

    const newEnquiry = await Enquiry.create(formData as any);
    const raw = newEnquiry.get({ plain: true });

    // ================= SEND EMAIL =================
    const sendEmail = async () => {
      try {
        await resend.emails.send({
          from: "Freeze Logistics <no-reply@freezelogistics.com.au>",
          to: process.env.EMAIL_REGISTER_SENDING
            ? [process.env.EMAIL_REGISTER_SENDING]
            : ["admin@freezelogistics.com.au"],
          subject: `New Enquiry - ${raw.connote_no}`,
          html: `
            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e5e7eb; border-radius: 10px;">
              <h2 style="color:#3b82f6; margin-bottom: 20px;">New Enquiry Customer 🚀</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; font-weight: bold;">Company Name</td><td>: ${userPlain.customer?.company_name || "-"}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold;">Contact Name</td><td>: ${userPlain.customer?.pic_name || "-"}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold;">Phone</td><td>: ${userPlain.customer?.pic_phone || "-"}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold;">Connote No</td><td style="color: #3b82f6; font-weight: bold;">: ${raw.connote_no}</td></tr>
                  </table>
              <div style="margin-top: 20px; padding: 15px; bg-color: #f9fafb; border-radius: 8px;">
                <strong>Message:</strong><br/>
                <p style="white-space: pre-wrap;">${raw.enquiry}</p>
              </div>
            </div>
          `,
        });
      } catch (error) {
        console.error("Failed to send email:", error);
      }
    };

    // non-blocking
    sendEmail();

    // ================= RESPONSE =================
    const responseData = {
      id: raw.id,
      enquiry: raw.enquiry,
      createdAt: raw.createdAt ? toWIB(raw.createdAt) : null,
      updatedAt: raw.updatedAt ? toWIB(raw.updatedAt) : null,
    };

    return NextResponse.json({
      success: true,
      data: responseData,
    });
  } catch (error: any) {
    console.error("API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error?.errors || error?.message || "Something went wrong",
      },
      { status: 400 },
    );
  }
}
