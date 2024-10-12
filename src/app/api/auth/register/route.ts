import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { signToken } from "../../../lib/auth";
import getDb from "../../../lib/db";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const hashedPassword = await bcrypt.hash(password, 10);

    const db = await getDb();

    const exist = await db.collection("users").findOne({ email });
    if (exist) {
      return NextResponse.json({ message: "User Already Exists", status: 409 });
    }

    await db.collection("users").insertOne({
      email,
      password: hashedPassword,
    });
    const token = signToken({ email });
    return NextResponse.json({
      token,
      message: "User created successfully",
      status: 201,
    });
  } catch (error) {
    console.error("Error in POST:register", error);
    return NextResponse.json({ message: "Internal Server Error", status: 500 });
  }
}
