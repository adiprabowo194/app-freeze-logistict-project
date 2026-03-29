import { NextResponse } from "next/server";
import { connectDB } from "@/lib/sequelize";
import Quotes from "@/models/Quotes";
import { Op } from "sequelize";
import { getSessionUser } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    await connectDB();

    // cek session
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

    const { searchParams } = new URL(req.url);

    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const status = searchParams.get("status") || "";
    const search = searchParams.get("search") || "";

    const where: any = {
      customer_code: customerCode, // 🔥 WAJIB FILTER
    };

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
      } else if (status === "confirm") {
        where.status = {
          [Op.in]: ["approve"],
        };
      } else if (status === "transit") {
        where.status = {
          [Op.in]: ["transit"],
        };
      } else if (status === "booking") {
        where.status = {
          [Op.in]: ["booking"],
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

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
