// app/api/alloweduserlist/route.js
import clientPromise from "@/app/lib/mongodb";

export const dynamic = "force-dynamic"; // Ensures no cache

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(); // Defaults to database from URI
    const collection = db.collection("allowedUsers");
    const users = await collection
      .find({}, { projection: { _id: 0, name: 1, email: 1 } })
      .toArray();

    return new Response(JSON.stringify(users), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch users" }), {
      status: 500,
    });
  }
}
