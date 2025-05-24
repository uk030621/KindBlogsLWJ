// app/api/allowed-users/route.js
import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  let client;
  try {
    client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db();
    const users = await db.collection("allowedUsers").find({}).toArray();
    const emails = users.map((u) => u.email).filter(Boolean);
    return NextResponse.json({ emails });
  } catch (err) {
    console.error("Failed to fetch allowed users:", err);
    return NextResponse.json(
      { error: "Failed to fetch allowed users" },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}
