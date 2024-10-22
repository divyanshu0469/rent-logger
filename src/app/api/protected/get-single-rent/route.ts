import { NextResponse } from "next/server";
import { verifyToken } from "../../../lib/auth";
import getDb from "../../../lib/db";
import { ObjectId } from "mongodb";
import { Rent, Tenant } from "@/app/lib/schema";

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

      const { rentId } = await req.json();

      if (!rentId) {
        return NextResponse.json({
          message: "No id found",
          status: 403,
        });
      }

      const db = await getDb();

      const rent = (await db
        .collection("rents")
        .findOne({ _id: new ObjectId(rentId) })) as Rent | null;

      const tenant = (await db
        .collection("tenants")
        .findOne({ _id: new ObjectId(rent?.tenantId) })) as Tenant | null;

      if (tenant) {
        if (rent) {
          return NextResponse.json({
            rent: rent,
            tenant: tenant,
            message: "Rent found",
            status: 201,
          });
        } else {
          return NextResponse.json({
            message: "Rent not found",
            status: 404,
          });
        }
      } else {
        return NextResponse.json({
          message: "Tenant not found",
          status: 404,
        });
      }
    } catch (err) {
      console.error("Token verification failed:", err);
      return NextResponse.json({
        message: "Session expired",
        status: 401,
      });
    }
  } catch (error) {
    console.error("Error in POST:get-single-rent", error);
    return NextResponse.json({ message: "Internal Server Error", status: 500 });
  }
}
