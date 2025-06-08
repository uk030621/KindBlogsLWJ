import { connectToDB } from "@/app/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { email } = await req.json(); // Fix: Parse JSON instead of formData

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const client = await connectToDB();
  const db = client.db();

  await db
    .collection("allowedUsers")
    .updateOne({ email }, { $setOnInsert: { email } }, { upsert: true });

  return NextResponse.json(
    { message: "User added successfully!" },
    { status: 201 }
  );
}
