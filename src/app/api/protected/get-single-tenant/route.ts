import { NextResponse } from "next/server";
import { verifyToken } from "../../../lib/auth";
import getDb from "../../../lib/db";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
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
      verifyToken(token);

      const { tenantId } = await req.json();

      if (!tenantId) {
        return NextResponse.json({
          message: "No id found",
          status: 403,
        });
      }

      const id = new ObjectId(tenantId);

      const db = await getDb();

      const tenant = await db.collection("tenants").findOne({ _id: id });

      if (tenant) {
        return NextResponse.json({
          tenant: tenant,
          message: "User found",
          status: 201,
        });
      }

      return NextResponse.json({
        message: "Tenants not found",
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
