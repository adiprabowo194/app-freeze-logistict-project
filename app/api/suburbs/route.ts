import { NextResponse } from "next/server";
import { sequelize } from "@/lib/sequelize";
import { DataTypes } from "sequelize";

const CoverageAreas = sequelize.define(
  "CoverageAreas",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    suburb: DataTypes.STRING(100),
    state: DataTypes.STRING(50),
    area_code: DataTypes.STRING(50),
  },
  { tableName: "coverage_areas", timestamps: false }
);

export async function GET() {
  try {
    const areas = await CoverageAreas.findAll();
    const formatted = areas.map((a: any) => ({
      label: `${a.suburb}, ${a.state}`,
      value: a.suburb,
      area_code: a.area_code, // tambahkan ini
    }));
    return NextResponse.json(formatted);
  } catch (err) {
    return NextResponse.json({ message: "Failed to fetch suburbs" }, { status: 500 });
  }
}