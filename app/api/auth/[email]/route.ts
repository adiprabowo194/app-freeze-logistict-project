import { NextResponse } from "next/server";
import "@/models";
import { Customers, CoverageAreas, Users } from "@/models";

// ================= GET =================
export async function GET(
  req: Request,
  { params }: { params: Promise<{ email: string }> }
) {
  try {
    const { email } = await params;

    if (!email) {
      return NextResponse.json(
        { error: "email is required" },
        { status: 400 }
      );
    }

    // 🔥 1. ambil user
    const user = await Users.findOne({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const customerCode = user.getDataValue("customer_code");

    // 🔥 2. ambil customer
    const customer = await Customers.findOne({
      where: { customer_code: customerCode },
      include: [
        {
          model: CoverageAreas,
          as: "pickupArea",
        },
        {
          model: CoverageAreas,
          as: "officeArea",
        },
      ],
    });

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    // 🔥 3. return gabungan
    return NextResponse.json({
      ...customer.toJSON(),
      email: user.getDataValue("email"),
      username: user.getDataValue("username"),
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}