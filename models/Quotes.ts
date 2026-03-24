import { DataTypes } from "sequelize";
import { sequelize } from "@/lib/sequelize";

const Quotes = sequelize.define(
  "Quotes",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    connote_no: DataTypes.STRING(100),
    cargo_type: DataTypes.STRING(50),
    unit: DataTypes.STRING(50),
    qty: { type: DataTypes.INTEGER, defaultValue: 1 },
    weight: { type: DataTypes.INTEGER, defaultValue: 1 },
    pickup_date: DataTypes.DATE,
    receiver_name: DataTypes.STRING(100),
    receiver_phone: DataTypes.STRING(50),
    cargo_category: DataTypes.STRING(50),
    suburb_origin: DataTypes.STRING(100),
    suburb_destination: DataTypes.STRING(100),
    pickup_address: DataTypes.STRING(255),
    delivery_address: DataTypes.STRING(255),
    status: { type: DataTypes.STRING(50), defaultValue: "pending" },
    customer_code: DataTypes.STRING(100),
    user_inp: DataTypes.STRING(100),
  },
  {
    tableName: "quotes",
    timestamps: true,
    freezeTableName: true,
  }
);

export default Quotes;