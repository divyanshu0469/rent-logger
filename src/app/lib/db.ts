import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "";
const dbName = process.env.MONGODB_DB || ""; // Fetch database name from env

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!uri || !dbName) {
  throw new Error("Please add your MongoDB URI and DB name to .env.local");
}
if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default async function getDb() {
  const client = await clientPromise;
  return client.db(dbName); // Automatically use the configured database
}
