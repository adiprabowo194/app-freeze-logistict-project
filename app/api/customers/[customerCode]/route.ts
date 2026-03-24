import { NextResponse } from "next/server";
import "@/models";
import { Customers, CoverageAreas } from "@/models";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ customerCode: string }> } // ✅ FIX
) {
  try {
    // 🔥 WAJIB await
    const { customerCode } = await params;

    console.log("PARAM:", customerCode);

    if (!customerCode) {
      return NextResponse.json(
        { error: "customerCode is required" },
        { status: 400 }
      );
    }

    const data = await Customers.findOne({
      where: {
        customer_code: customerCode,
      },
      include: [
        {
          model: CoverageAreas,
          as: "pickupArea",
          attributes: ["suburb", "state", "area_code"],
        },
        {
          model: CoverageAreas,
          as: "officeArea",
          attributes: ["suburb", "state", "area_code"],
        },
      ],
    });

    if (!data) {
      return NextResponse.json(
        { message: "Customer not found", customerCode },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}