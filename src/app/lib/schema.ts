import { ObjectId } from "mongodb";

export interface User {
  _id: ObjectId;
  email: string;
  password: string;
}

export interface Tenant {
  _id: ObjectId;
  createdBy: string;
  name: string;
  rent: number | null;
  lastReading: number | null;
  waterBill: number | null;
  lastNotes: string | null;
  isArchived: boolean;
}

export interface Rent {
  _id: ObjectId;
  tenantId: ObjectId;
  date: string;
  totalBill: number;
  reading: number | null;
  readingDifference: number | null;
  notes: string | null;
}
