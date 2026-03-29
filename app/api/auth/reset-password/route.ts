import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import "@/models";
import { Users, ResetTokens } from "@/models";

export async function POST(req: Request) {
  const { token, email, password } = await req.json();

  const user = await Users.findOne({
    where: { email, reset_token: token },
  });

  if (!user) {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  }

  const expired = user.getDataValue("reset_token_expired");

  // if (!expired || new Date() > new Date(expired)) {
  //   return NextResponse.json({ error: "Token expired" }, { status: 400 });
  // }

  const hashed = await bcrypt.hash(password, 10);

  await user.update({
    password: hashed,
    reset_token: null,
    reset_token_expired: null,
  });

  // nonaktifkan token
  await ResetTokens.update({ is_active: false }, { where: { email, token } });

  return NextResponse.json({ message: "Success" });
}
