// /app/api/cargo-quote/route.ts
import { NextRequest, NextResponse } from "next/server";
import Quotes from "@/models/Quotes";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validasi sederhana
    const requiredFields = [
      "cargo_type",
      "unit",
      "qty",
      "weight",
      "pickup_date",
      "receiver_name",
      "receiver_phone",
      "cargo_category",
      "suburb_origin",
      "suburb_destination",
      "pickup_address",
      "delivery_address",
      "customer_code",
      "user_inp",
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { message: `Field ${field} is required` },
          { status: 400 }
        );
      }
    }

    // Generate connote_no di server
    const connote_no = `CN${Date.now()}${Math.floor(Math.random() * 1000)}`;

    // Simpan ke database
    const newQuote = await Quotes.create({
      ...body,
      connote_no,
      status: "Booking", // default status
    });

    return NextResponse.json(
      { message: "Quote successfully created", data: newQuote },
      { status: 201 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}