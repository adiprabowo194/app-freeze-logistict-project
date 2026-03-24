import { DataTypes } from "sequelize";
import { sequelize } from "@/lib/sequelize";

const TrackingHistory = sequelize.define(
  "TrackingHistory",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    connote_no: { type: DataTypes.STRING(100), allowNull: false },
    status: DataTypes.STRING(50),
    description: DataTypes.TEXT,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    user_inp: DataTypes.STRING(100),
  },
  {
    tableName: "tracking_histories",
    timestamps: false,
  }
);

export default TrackingHistory;