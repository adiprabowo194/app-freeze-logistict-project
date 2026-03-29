import { NextResponse } from "next/server";
import "@/models";
import { Customers, CoverageAreas } from "@/models";

// ================= GET =================
export async function GET(
  req: Request,
  { params }: { params: Promise<{ customerCode: string }> }
) {
  try {
    const { customerCode } = await params; // 🔥 WAJIB await

    console.log("GET PARAM:", customerCode);

    if (!customerCode) {
      return NextResponse.json(
        { error: "customerCode is required" },
        { status: 400 }
      );
    }

    const data = await Customers.findOne({
      where: { customer_code: customerCode },
      include: [
        { model: CoverageAreas, as: "pickupArea" },
        { model: CoverageAreas, as: "officeArea" },
      ],
    });

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ================= PUT =================
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ customerCode: string }> }
) {
  try {
    const { customerCode } = await params; // 🔥 WAJIB

    const body = await req.json();

    console.log("PUT PARAM:", customerCode);

    if (!customerCode) {
      return NextResponse.json(
        { error: "customerCode is required" },
        { status: 400 }
      );
    }

    const customer = await Customers.findOne({
      where: { customer_code: customerCode },
    });

    if (!customer) {
      return NextResponse.json(
        { message: "Customer not found" },
        { status: 404 }
      );
    }

    await customer.update({
      pic_name: body.pic_name,
      pic_phone: body.pic_phone,
      company_name: body.company_name,
      phone: body.phone,
      website: body.website,

      pickup_suburb_code: body.pickup_area_code,
      pickup_address: body.pickup_address,

      office_suburb_code: body.office_area_code,
      office_address: body.office_address,
    });

    return NextResponse.json({ message: "Updated successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}