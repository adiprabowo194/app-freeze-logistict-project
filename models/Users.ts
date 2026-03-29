import { DataTypes, Model } from "sequelize";
import { sequelize } from "@/lib/sequelize";

interface UserAttributes {
  id?: number;
  customer_code: string;
  username?: string;
  email?: string;
  full_name?: string;
  password?: string;
  status: number;
}

const Users = sequelize.define<Model<UserAttributes>>(
  "users",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    customer_code: DataTypes.STRING,
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    full_name: DataTypes.STRING,
    status: DataTypes.INTEGER,
  },
  {
    tableName: "users",
    timestamps: true,
  }
);

export default Users;