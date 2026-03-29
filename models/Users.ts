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
  // 🔥 TAMBAH INI
  reset_token?: string | null;
  reset_token_expired?: Date | null;
}

const Users = sequelize.define(
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
    reset_token: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    reset_token_expired: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
  },
  {
    tableName: "users",
    timestamps: true,
  },
);

export default Users;
