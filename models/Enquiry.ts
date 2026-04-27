import { DataTypes } from "sequelize";
import { sequelize } from "@/lib/sequelize";

const Enquiry = sequelize.define(
  "Enquiry",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    enquiry: DataTypes.TEXT(),
    connote_no: DataTypes.STRING(100),
    customer_code: DataTypes.STRING(100),
    company_name: DataTypes.STRING(100),
    pic_name: DataTypes.STRING(100),
  },
  {
    tableName: "enquiry",
    timestamps: true,
    freezeTableName: true,
  },
);

export default Enquiry;
