import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {};

// Ensure the environment variable is set
if (!process.env.MONGODB_URI) {
  throw new Error("Please add your MONGODB_URI to .env.local");
}

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  // Use a global variable in development to preserve the value across module reloads
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, it's fine to instantiate a new client
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Optional helper function if you want to use async/await in other endpoints
export async function connectToDB() {
  return clientPromise;
}

// Export default for NextAuth adapter compatibility
export default clientPromise;
