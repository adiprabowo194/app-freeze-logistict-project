import { NextResponse } from "next/server";
import CoverageAreas from "@/models/CoverageAreas";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");

    const data = await CoverageAreas.findAll({
      attributes: ["id", "suburb", "state", "postcode"],
      where: search
        ? {
            suburb: {
              // LIKE '%search%'
              [require("sequelize").Op.like]: `%${search}%`,
            },
          }
        : undefined,
      limit: 20,
    });

    return NextResponse.json(data);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}