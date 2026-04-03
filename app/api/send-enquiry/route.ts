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
      customer_code: customerCode,
      company_name: userPlain.customer?.company_name,
      pic_name: userPlain.customer?.pic_name,
    };
    const data = await Enquiry.create(formData as any);

    // ✅ ambil raw data biar TS aman
    const raw = data.get();

    // ================= SEND EMAIL =================
    const sendEmail = async () => {
      try {
        await resend.emails.send({
          from: "Freeze Logistics <no-reply@freezelogistics.com.au>",
          to: process.env.EMAIL_REGISTER_SENDING
            ? [process.env.EMAIL_REGISTER_SENDING]
            : ["admin@freezelogistics.com.au"],
          subject: "New Enquiry",
          html: `
            <div style="font-family:sans-serif">
              <h2 style="color:#3b82f6;">New Enquiry Customer 🚀 from dashboard page</h2>

              <p><strong>Company Name:</strong> ${
                userPlain?.customer?.company_name ?? "-"
              }</p>

              <p><strong>Contact Name:</strong> ${
                userPlain?.customer?.pic_name ?? "-"
              }</p>

              <p><strong>Phone:</strong> ${
                userPlain?.customer?.pic_phone ?? "-"
              }</p>

              <p><strong>Enquiry:</strong> ${validated.enquiry}</p>
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
