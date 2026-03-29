import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import "@/models";
import { Users } from "@/models";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ customerCode: string }> },
) {
  try {
    const { customerCode } = await params;
    const body = await req.json();

    const { currentPassword, newPassword } = body;

    // ✅ VALIDASI INPUT
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    // ✅ AMBIL USER + pastikan password ikut
    const user = await Users.findOne({
      where: { customer_code: customerCode },
      attributes: ["id", "password"], // 🔥 penting
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const hashedPassword = user.getDataValue("password");

    // ✅ FIX TYPE ERROR + GUARD
    if (!hashedPassword) {
      return NextResponse.json({ error: "Password not set" }, { status: 400 });
    }

    // ✅ COMPARE PASSWORD
    const isMatch = await bcrypt.compare(currentPassword, hashedPassword);

    if (!isMatch) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 },
      );
    }

    // ✅ HASH PASSWORD BARU
    const newHashedPassword = await bcrypt.hash(newPassword, 10);

    // ✅ UPDATE
    await user.update({
      password: newHashedPassword,
    });

    return NextResponse.json({
      message: "Password updated successfully",
    });
  } catch (err: any) {
    console.error("CHANGE PASSWORD ERROR:", err);

    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
