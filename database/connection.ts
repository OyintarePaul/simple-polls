// lib/dbConnect.ts
import * as env from "@/env";
import mongoose from "mongoose";

/**
 * Strict TypeScript definition of our global cache object.
 * Eliminates 'any' type pollution.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Attach cache cleanly to the Node/Bun global runtime scope
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

if (!global.mongooseCache) {
  global.mongooseCache = { conn: null, promise: null };
}

// TypeScript now guarantees this variable is a fully formed MongooseCache object
const cached: MongooseCache = global.mongooseCache;

async function connectToDb(): Promise<typeof mongoose> {
  const MONGODB_URI: string = env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error(
      "Critical Architecture Failure: Please define the MONGODB_URI environment variable.",
    );
  }

  // 1. Safe condition check - compiler knows 'cached' exists
  if (cached.conn) {
    return cached.conn;
  }

  // 2. Safe promise check
  if (!cached.promise) {
    const opts = {
      bufferCommands: true,
      dbName: "polls-db",
      maxPoolSize: 10,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => m);
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null; // Reset promise state on failure
    throw error;
  }

  return cached.conn;
}

export default connectToDb;