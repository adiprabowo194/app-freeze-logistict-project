import { DataTypes, Model, InferAttributes, InferCreationAttributes } from "sequelize";
import { sequelize } from "@/lib/sequelize";

class CoverageAreas extends Model<
  InferAttributes<CoverageAreas>,
  InferCreationAttributes<CoverageAreas>
> {
  declare id: number;
  declare area_code: string;
  declare suburb: string;
  declare postcode: number;
  declare state: string;
  declare state_code: string;
}

CoverageAreas.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    area_code: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },

    suburb: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },

    postcode: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    state: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },

    state_code: {
      type: DataTypes.STRING(5),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "CoverageAreas",
    tableName: "coverage_areas",
    timestamps: false,
  }
);

export default CoverageAreas;