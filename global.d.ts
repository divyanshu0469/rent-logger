// global.d.ts
import { MongoClient } from "mongodb";

declare global {
  // Extend the global object with a custom property
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

// To allow this file to be treated as a module
export {};
