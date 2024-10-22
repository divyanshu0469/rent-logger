import { NextResponse } from "next/server";
import { verifyToken } from "../../../lib/auth";
import getDb from "../../../lib/db";
import { Rent, Tenant } from "@/app/lib/schema";

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

      const tenants = (await db
        .collection("tenants")
        .find({ createdBy: email })
        .toArray()) as Tenant[];
      const tenantIds = tenants.map((tenant) => tenant._id);
      const rents = (await db
        .collection("rents")
        .find({ tenantId: { $in: tenantIds } })
        .toArray()) as Rent[];
      if (tenants.length > 0) {
        if (rents.length > 0) {
          return NextResponse.json({
            tenants: tenants,
            rents: rents,
            message: "Rents found",
            status: 201,
          });
        } else {
          return NextResponse.json({
            tenants: tenants,
            message: "Rents not found",
            status: 201,
          });
        }
      } else {
        return NextResponse.json({
          message: "Tenants not found",
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
    console.error("Error in POST:get-rents", error);
    return NextResponse.json({ message: "Internal Server Error", status: 500 });
  }
}
