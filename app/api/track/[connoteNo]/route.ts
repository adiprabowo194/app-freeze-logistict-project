import { NextResponse } from "next/server";
import "@/models"; // 🔥 init relations

import TrackingHistory from "@/models/TrackingHistory";
import Quotes from "@/models/Quotes";
import CoverageAreas from "@/models/CoverageAreas";

export async function GET(
  req: Request,
  context: { params: Promise<{ connoteNo: string }> }
) {
  try {
    const { connoteNo } = await context.params;

    const rows = await TrackingHistory.findAll({
      where: { connote_no: connoteNo },
      order: [["createdAt", "ASC"]],
      include: [
        {
          model: Quotes,
          as: "quote",
          include: [
            {
              model: CoverageAreas,
              as: "originArea",
              attributes: ["suburb", "state"],
            },
            {
              model: CoverageAreas,
              as: "destinationArea",
              attributes: ["suburb", "state"],
            },
          ],
        },
      ],
    });

    if (!rows || rows.length === 0) {
      return NextResponse.json(null);
    }

    const last = rows[rows.length - 1];
    const quote = last.get("quote") as any;

    const result = {
      connote_no: connoteNo,
      status: last.get("status"),

      origin: quote?.originArea
        ? `${quote.originArea.suburb}, ${quote.originArea.state}`
        : "-",

      destination: quote?.destinationArea
        ? `${quote.destinationArea.suburb}, ${quote.destinationArea.state}`
        : "-",

      // 🔥 NEW DATA
      weight: quote?.weight || 0,
      qty: quote?.qty || 0,
      unit: quote?.unit || "-",

      history: rows.map((row: any) => ({
        connote_no: row.get("connote_no"),
        status: row.get("status"),
        description: row.get("description"),
        createdAt: row.get("createdAt"),
        updatedAt: row.get("updatedAt"),
        user_inp: row.get("user_inp"),
      })),
    };

    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Failed to fetch tracking data" },
      { status: 500 }
    );
  }
}