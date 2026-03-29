import { NextResponse } from "next/server";
import { Op } from "sequelize";
import { connectDB } from "@/lib/sequelize";
import { getSessionUser } from "@/lib/auth";

// 🔥 WAJIB: load relation
import "@/models";
import { Quotes as Booking, CoverageAreas } from "@/models";

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

    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 5);
    const offset = (page - 1) * limit;

    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

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

    // 📌 STATUS (FIX ONPROCESS)
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

    // 📅 DATE (FIX TIMEZONE SAFE)
    if (startDate && endDate) {
      where.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate + "T23:59:59")],
      };
    }

    console.log("WHERE:", where);

    // 🔥 QUERY
    const result = await Booking.findAndCountAll({
      where,
      limit,
      offset,
      order: [["createdAt", "DESC"]],

      include: [
        {
          model: CoverageAreas,
          as: "originArea",
          attributes: ["suburb", "state"],
          required: false,
        },
        {
          model: CoverageAreas,
          as: "destinationArea",
          attributes: ["suburb", "state"],
          required: false,
        },
      ],
    });

    console.log("ROWS:", result.rows.length);

    return NextResponse.json({
      data: result.rows,
      total: result.count,
      page,
      totalPages: Math.ceil(result.count / limit),
    });
  } catch (error: any) {
    console.error("🔥 API ERROR FULL:", error);

    return NextResponse.json(
      {
        error: error.message,
        stack: error.stack, // 🔥 biar kelihatan jelass
      },
      { status: 500 },
    );
  }
}
