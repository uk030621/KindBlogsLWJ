import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {};

// Throw clearly if the env is missing
if (!uri) {
  throw new Error(
    "❌ MONGODB_URI environment variable not found in .env.local"
  );
}

let client;
let clientPromise;

// Reuse client in development to prevent multiple connections on hot reload
if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client
      .connect()
      .then((connectedClient) => {
        console.log("✅ Connected to MongoDB (development)");
        return connectedClient;
      })
      .catch((err) => {
        console.error("❌ MongoDB connection error (development):", err);
        throw err;
      });
  }
  clientPromise = global._mongoClientPromise;
} else {
  // Production: create new client (usually one per Lambda in Vercel)
  clientPromise = new MongoClient(uri, options)
    .connect()
    .then((connectedClient) => {
      console.log("✅ Connected to MongoDB (production)");
      return connectedClient;
    })
    .catch((err) => {
      console.error("❌ MongoDB connection error (production):", err);
      throw err;
    });
}

/**
 * Get a connected MongoClient instance.
 * @returns {Promise<MongoClient>}
 */
export async function connectToDB() {
  return clientPromise;
}

// Compatibility for adapters
export default clientPromise;
