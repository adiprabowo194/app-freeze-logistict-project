import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "@/lib/sequelize"; // ✅ pastikan ini default export

// ========================
interface ResetTokensAttributes {
  id: number;
  email: string;
  token: string | null; // 🔥 FIX (karena DB allow NULL)
  is_active: boolean;
  createdAt: Date;
}

type ResetTokensCreationAttributes = Optional<
  ResetTokensAttributes,
  "id" | "is_active" | "createdAt"
>;

export class ResetTokens
  extends Model<ResetTokensAttributes, ResetTokensCreationAttributes>
  implements ResetTokensAttributes
{
  public id!: number;
  public email!: string;
  public token!: string | null; // 🔥 FIX
  public is_active!: boolean;
  public createdAt!: Date;
}

ResetTokens.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: true, // 🔥 FIX (match DB)
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    createdAt: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "reset_tokens",
    timestamps: true, // ✅ karena kamu pakai manual
  },
);

export default ResetTokens; // ✅ TAMBAH INI
