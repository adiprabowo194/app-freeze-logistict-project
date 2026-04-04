import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/sequelize";
import Quotes from "@/models/Quotes";
import { getSessionUser } from "@/lib/auth";

export async function PUT(req: NextRequest) {
  try {
    await connectDB();

    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { connote_no } = await req.json();

    if (!connote_no) {
      return NextResponse.json(
        { error: "connote_no is required" },
        { status: 400 },
      );
    }

    await Quotes.update(
      { is_active: 0 },
      {
        where: {
          connote_no,
          customer_code: user.customer_code, // 🔥 keamanan
        },
      },
    );

    return NextResponse.json({ message: "Quote deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
