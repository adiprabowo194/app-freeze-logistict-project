import { NextResponse } from "next/server";
import { customerSchema } from "@/lib/validation/customerCandidate";
import { emailTemplate } from "@/lib/emailTemplate";
import CustomerCandidates from "@/models/CustomerCandidates";
import { Resend } from "resend";

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

    // ========================
    // VALIDATION
    // ========================
    const validated = customerSchema.parse(body);

    // ========================
    // FORMAT FORM DATA
    // ========================
    const formData = {
      company_name: validated.companyName,
      email: validated.email,
      website: validated.website,
      contact_name: validated.contactName,
      contact_no: validated.contactNo,
      suburb: validated.suburb,
      street_address: validated.companyAddress,
      input_type: validated.inputType,
    };

    // ========================
    // INSERT DB
    // ========================
    const data = await CustomerCandidates.create(formData as any);

    // ✅ ambil raw data biar TS aman
    const raw = data.get();

    // ========================
    // SEND EMAIL (tidak blocking)
    // ========================
    resend.emails
      .send({
        from: "Freeze Logistics <no-reply@freezelogistics.com.au>",
        to: ["adiprabowo194@gmail.com"],
        subject: "New Contact Message",
        html: emailTemplate(validated),
      })
      .catch(console.error);

    // ========================
    // FORMAT RESPONSE
    // ========================
    const responseData = {
      id: raw.id,
      company_name: raw.company_name,
      email: raw.email,
      website: raw.website,
      contact_name: raw.contact_name,
      contact_no: raw.contact_no,
      suburb: raw.suburb,
      street_address: raw.street_address,
      input_type: raw.input_type,

      // 🔥 timezone aman
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
      { status: 400 }
    );
  }
}