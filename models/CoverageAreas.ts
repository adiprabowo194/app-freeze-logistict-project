import { DataTypes } from "sequelize";
import { sequelize } from "@/lib/sequelize";

const CoverageAreas = sequelize.define(
  "CoverageAreas",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    area_code: DataTypes.STRING(50),
    suburb: DataTypes.STRING(50),
    postcode: DataTypes.STRING(50),
    state: DataTypes.STRING(50),
    zone_type: DataTypes.STRING(50),
  },
  {
    tableName: "coverage_areas",
    timestamps: false,
    freezeTableName: true,
  },
);

export default CoverageAreas;
