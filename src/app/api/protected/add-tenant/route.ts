import { NextResponse } from "next/server";
import getDb from "../../../lib/db";

export async function POST(req: Request) {
  try {
    const {
      email,
      name,
      rent,
      lastReading,
      waterBill,
      lastNotes,
    }: {
      email: string;
      name: string;
      rent: number;
      lastReading: number | null;
      waterBill: number | null;
      lastNotes: string | null;
    } = await req.json();

    const db = await getDb();

    const exist = await db.collection("rents").findOne({ email, name });
    if (exist) {
      return NextResponse.json({
        message: "Tenant already exists",
        status: 409,
      });
    }

    const response = await db.collection("tenants").insertOne({
      createdBy: email,
      name,
      rent,
      lastReading: lastReading,
      waterBill: waterBill,
      lastNotes: lastNotes,
    });
    if (response.insertedId) {
      return NextResponse.json({
        message: "Tenant added",
        status: 201,
      });
    } else {
      return NextResponse.json({
        message: "Unable to add at the moment",
        status: 401,
      });
    }
  } catch (error) {
    console.error("Error in POST:add-tenant", error);
    return NextResponse.json({ message: "Internal Server Error", status: 500 });
  }
}
