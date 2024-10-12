import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { signToken } from "../../../lib/auth"; // JWT utility
import getDb from "../../../lib/db";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const db = await getDb();
  const user = await db.collection("users").findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return NextResponse.json({
      message: "Invalid credentials",
      exists: false,
      status: 401,
    });
  }

  const token = signToken({ email });
  return NextResponse.json({
    token,
    exists: true,
    message: "User Found",
    status: 201,
  });
}
