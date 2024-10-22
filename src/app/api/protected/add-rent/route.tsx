import { NextResponse } from "next/server";
import getDb from "../../../lib/db";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  try {
    const {
      tenantId,
      totalBill,
      notes,
      reading,
      readingDifference,
    }: {
      tenantId: string;
      totalBill: number;
      notes: string | null;
      reading: number;
      readingDifference: number;
    } = await req.json();

    const db = await getDb();

    const date = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    const exist = await db
      .collection("rents")
      .findOne({ tenantId: new ObjectId(tenantId), date, reading });
    if (exist) {
      return NextResponse.json({
        message: "Entry already exists",
        status: 409,
      });
    }

    const response = await db.collection("rents").insertOne({
      date,
      tenantId: new ObjectId(tenantId),
      totalBill,
      reading,
      readingDifference,
      notes: notes,
    });
    const updateResponse = await db
      .collection("tenants")
      .findOneAndUpdate(
        { _id: new ObjectId(tenantId) },
        { $set: { lastNotes: notes, lastReading: reading } },
        { returnDocument: "after" }
      );

    if (response.insertedId && updateResponse?._id) {
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
