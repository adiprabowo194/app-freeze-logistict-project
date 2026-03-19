import { DataTypes, Model } from "sequelize";
import { sequelize } from "@/lib/sequelize";

interface CustomerCandidatesAttributes {
  id?: number;
  email: string;
  website: string;
  company_name: string;
  contact_name: string;
  contact_no: string;
  street_address: string;
  suburb: string;
  input_type: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const CustomerCandidates = sequelize.define<Model<CustomerCandidatesAttributes>>(
  "customer_candidates",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: DataTypes.STRING,
    company_name: DataTypes.STRING,
    website: DataTypes.STRING,
    contact_name: DataTypes.STRING,
    contact_no: DataTypes.STRING,
    street_address: DataTypes.STRING,
    suburb: DataTypes.STRING,
    input_type: DataTypes.INTEGER,
  },
  {
    tableName: "customer_candidates",
    timestamps: true,
  }
);

export default CustomerCandidates;