import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { Users, Customers, CoverageAreas } from "@/models";

export async function GET() {
  try {
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const customerCode = user.customer_code;

    if (!customerCode) {
      return NextResponse.json(
        { error: "customer_code not found" },
        { status: 400 },
      );
    }

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
            "pickup_suburb_code",
            "pickup_address",
          ],
          include: [
            {
              model: CoverageAreas,
              as: "pickupArea",
              attributes: ["area_code", "suburb"],
            },
          ],
        },
      ],
    });

    // 🔥 FIX DISINI
    const customer = (userLogin as any).customer;

    if (!userLogin) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      pickup_suburb_code: customer?.pickup_suburb_code,
      pickup_suburb_name: customer?.pickupArea?.suburb, // 🔥 ini yang kamu butuh
      pickup_address: customer?.pickup_address,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
