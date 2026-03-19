import { Sequelize } from "sequelize";
import mysql2 from "mysql2";

declare global {
  var sequelize: Sequelize | undefined;
}

export const sequelize =
  global.sequelize ??
  new Sequelize(
    process.env.DB_NAME || "",
    process.env.DB_USER || "",
    process.env.DB_PASSWORD || "",
    {
      host: process.env.DB_HOST || "localhost",
      dialect: "mysql",
      dialectModule: mysql2,
      logging: false,

      // ✅ simpan UTC
      timezone: "+00:00",

      dialectOptions: {
        useUTC: true, // baca sebagai UTC
      },
    }
  );

if (process.env.NODE_ENV !== "production") {
  global.sequelize = sequelize;
}

export async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
}