import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import "@/models";
import { Users } from "@/models";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ customerCode: string }> }
) {
  try {
    const { customerCode } = await params;
    const body = await req.json();

    const { currentPassword, newPassword } = body;

    const user = await Users.findOne({
      where: { customer_code: customerCode },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const isMatch = await bcrypt.compare(
      currentPassword,
      user.getDataValue("password")
    );

    if (!isMatch) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await user.update({
      password: hashedPassword,
    });

    return NextResponse.json({ message: "Password updated" });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}