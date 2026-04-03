import { DataTypes } from "sequelize";
import { sequelize } from "@/lib/sequelize";

const Customers = sequelize.define(
  "Customers",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    customer_code: DataTypes.STRING(100),
    abn: DataTypes.STRING(50),
    company_name: DataTypes.STRING(100),
    email: DataTypes.STRING(100),
    website: DataTypes.STRING(50),
    phone: DataTypes.STRING(50),

    pic_name: DataTypes.STRING(50),
    pic_phone: DataTypes.STRING(27),

    pickup_suburb_code: DataTypes.STRING(50),
    pickup_address: DataTypes.STRING(250),

    office_suburb_code: DataTypes.STRING(50),
    office_address: DataTypes.STRING(250),

    approve_date: DataTypes.DATEONLY,
    pic_approve: DataTypes.STRING(50),
  },
  {
    tableName: "customers",
    timestamps: true,
    freezeTableName: true,
  },
);

export default Customers;
