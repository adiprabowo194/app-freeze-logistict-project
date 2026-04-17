import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/sequelize";
import { getSessionUser } from "@/lib/auth";

// 🔥 load relation
import "@/models";
import { Quotes, CoverageAreas, PackageDetails, Carriers } from "@/models";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ connoteNo: string }> },
) {
  try {
    await connectDB();

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

    // 🔥 WAJIB: await params
    const { connoteNo } = await context.params;

    if (!connoteNo) {
      return NextResponse.json(
        { error: "connoteNo is required" },
        { status: 400 },
      );
    }

    console.log("🔥 PARAM connoteNo:", connoteNo);

    // ================= QUERY =================
    const quote = await Quotes.findOne({
      where: {
        connote_no: connoteNo,
        customer_code: customerCode,
        is_active: 1,
      },
      include: [
        {
          model: CoverageAreas,
          as: "originArea",
          attributes: ["suburb", "state", "postcode", "zone_type"],
          required: false,
        },
        {
          model: Carriers,
          as: "carrierDetail",
          attributes: ["carrier_name", "carrier_code"],
          required: false,
        },
        {
          model: CoverageAreas,
          as: "destinationArea",
          attributes: ["suburb", "state", "postcode", "zone_type"],
          required: false,
        },
        {
          model: PackageDetails,
          as: "packageDetails",
          attributes: [
            "temperature",
            "unit",
            "qty",
            "weight",
            "length",
            "width",
            "height",
          ],
          required: false,
        },
      ],
    });

    if (!quote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    return NextResponse.json({
      data: quote,
    });
  } catch (error: any) {
    console.error("🔥 DETAIL QUOTE ERROR:", error);

    return NextResponse.json(
      {
        error: error.message,
        stack: error.stack,
      },
      { status: 500 },
    );
  }
}
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ connoteNo: string }> },
) {
  try {
    await connectDB();

    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 🔥 WAJIB: await params
    const { connoteNo } = await context.params;

    if (!connoteNo) {
      return NextResponse.json(
        { error: "connoteNo is required" },
        { status: 400 },
      );
    }

    const body = await req.json();

    // ================= UPDATE QUOTE =================
    const quote = await Quotes.findOne({
      where: {
        connote_no: connoteNo,
        customer_code: user.customer_code,
      },
    });

    if (!quote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    await quote.update({
      suburb_origin: body.suburb_origin,
      suburb_destination: body.suburb_destination,
      pickup_address: body.pickup_address,
      pickup_date: body.pickup_date,
      delivery_address: body.delivery_address,

      receiver_name: body.receiver_name,
      receiver_phone: body.receiver_phone,

      carrier: body.carrier,
      price: body.price,

      status: body.status,

      total_qty: body.total_qty,
      total_weight: body.total_weight,
      total_cbm: body.total_cbm,
    });

    // ================= UPDATE PACKAGE DETAILS =================

    const newConnoteNo = connoteNo + "X";
    await PackageDetails.update(
      { connote_no: newConnoteNo },
      {
        where: {
          connote_no: connoteNo,
        },
      },
    );
    // 🔥 INSERT const
    const newDetails = body.cargos.map((c: any) => ({
      connote_no: connoteNo,
      temperature: c.temperature,
      unit: c.unit,
      qty: c.qty,
      weight: c.weight,
      length: c.length,
      width: c.width,
      height: c.height,
    }));

    await PackageDetails.bulkCreate(newDetails);

    return NextResponse.json({
      message: "Quote updated successfully",
    });
  } catch (error: any) {
    console.error("🔥 UPDATE ERROR:", error);

    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 500 },
    );
  }
}
