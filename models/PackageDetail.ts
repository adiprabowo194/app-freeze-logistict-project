import { DataTypes } from "sequelize";
import { sequelize } from "@/lib/sequelize";

const PackageDetails = sequelize.define(
  "PackageDetails",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    connote_no: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    temperature: DataTypes.STRING(15),
    unit: DataTypes.STRING(15),

    weight: {
      type: DataTypes.INTEGER(),
      allowNull: false,
    },

    qty: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },

    length: DataTypes.DOUBLE(8, 2),
    width: DataTypes.DOUBLE(8, 2),
    height: DataTypes.DOUBLE(8, 2),

    user_inp: DataTypes.STRING(50),

    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "package_details", // sesuaikan nama tabel kamu
    timestamps: true,
    freezeTableName: true,

    indexes: [
      {
        name: "idx_connote_no",
        fields: ["connote_no"], // 🔥 index untuk join
      },
    ],
  },
);

export default PackageDetails;
