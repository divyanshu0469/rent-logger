export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { verifyToken } from "../../../lib/auth";
import getDb from "../../../lib/db";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");
    const token = authHeader ? authHeader.split(" ")[1] : null;

    if (!token) {
      return NextResponse.json({
        message: "No session found",
        status: 401,
      });
    }
    try {
      const payload = verifyToken(token) as {
        email: string;
        iat: number;
        exp: number;
      };

      const email = payload.email;

      const db = await getDb();

      const exist = await db.collection("users").findOne({ email });
      if (exist) {
        return NextResponse.json({
          email: exist?.email,
          message: "User Found",
          status: 201,
        });
      }

      return NextResponse.json({
        message: "User Not Found",
        status: 404,
      });
    } catch (err) {
      console.error("Token verification failed:", err);
      return NextResponse.json({
        message: "Session expired",
        status: 401,
      });
    }
  } catch (error) {
    console.error("Error in POST:register", error);
    return NextResponse.json({ message: "Internal Server Error", status: 500 });
  }
}
