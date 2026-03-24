import { NextResponse } from "next/server";
import { connectDB } from "@/lib/sequelize";
import Quotes from "@/models/Quotes";
import { Op } from "sequelize";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const status = searchParams.get("status") || "";
    const search = searchParams.get("search") || "";

    const where: any = {};

    // 🔍 SEARCH
    if (search) {
      where[Op.or] = [
        { connote_no: { [Op.like]: `%${search}%` } },
        { suburb_origin: { [Op.like]: `%${search}%` } },
        { suburb_destination: { [Op.like]: `%${search}%` } },
      ];
    }

    // 📌 STATUS
if (status) {
  if (status === "onprocess") {
    where.status = {
      [Op.in]: ["booking", "transit", "approve"],
    };
  } else {
    where.status = status;
  }
}

    // 📅 DATE
    if (startDate && endDate) {
      where.createdAt = {
        [Op.between]: [
          new Date(`${startDate}T00:00:00`),
          new Date(`${endDate}T23:59:59`),
        ],
      };
    }

    // 🔥 SUMMARY (pakai where yg sama)
    const total = await Quotes.count({ where });

    const delivered = await Quotes.count({
      where: {
        ...where,
        status: "delivered", // ⚠️ sesuaikan DB
      },
    });

    const onprocess = await Quotes.count({
      where: {  
        ...where,
        status: {
          [Op.in]: ["booking", "transit", "approve"],
        },
      },
    });

    return NextResponse.json({
      active: total,
      delivered,
      onprocess,
    });
  } catch (error: any) {
    console.error("Summary API Error:", error);

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}