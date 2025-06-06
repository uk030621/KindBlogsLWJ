import { connectToDB } from "@/app/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  const client = await connectToDB();
  const db = client.db();

  const postCounts = await db
    .collection("blogs")
    .aggregate([
      { $group: { _id: "$authorName", count: { $sum: 1 } } }, // ✅ Count posts per user
    ])
    .toArray();

  return NextResponse.json(postCounts);
}
