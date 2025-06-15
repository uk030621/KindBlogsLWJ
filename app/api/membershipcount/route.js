import { connectToDB } from "@/app/lib/mongodb";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // 🔥 Forces fresh API response

export async function GET() {
  const client = await connectToDB();
  const db = client.db();

  const memberCounts = await db
    .collection("allowedUsers")
    .aggregate([
      { $group: { _id: "$name", count: { $sum: 1 } } }, // ✅ Count members
    ])
    .toArray();

  return NextResponse.json(memberCounts);
}
