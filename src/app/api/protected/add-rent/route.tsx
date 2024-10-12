import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { signToken } from "../../../lib/auth";
import getDb from "../../../lib/db";

export async function POST(req: Request) {
  try {
    const {
      email,
      name,
      rent,
      reading,
      waterBill,
      notes,
    }: {
      email: string;
      name: string;
      rent: number;
      reading: number;
      waterBill: number | null;
      notes: string | null;
    } = await req.json();

    const db = await getDb();

    const date = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    const exist = await db.collection("rents").findOne({ date, name, reading });
    if (exist) {
      return NextResponse.json({
        message: "Entry already exists",
        status: 409,
      });
    }

    const response = await db.collection("rents").insertOne({
      createdBy: email,
      date,
      name,
      rent,
      reading,
      waterBill: waterBill,
      notes: notes,
    });
    if (response.insertedId) {
      return NextResponse.json({
        message: "Entry added",
        status: 201,
      });
    } else {
      return NextResponse.json({
        message: "Unable to add at the moment",
        status: 201,
      });
    }
  } catch (error) {
    console.error("Error in POST:add-rent", error);
    return NextResponse.json({ message: "Internal Server Error", status: 500 });
  }
}
