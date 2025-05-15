import { connectToDB } from "@/app/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
  const formData = await req.formData();
  const email = formData.get("email");

  if (!email)
    return NextResponse.json({ error: "Email is required" }, { status: 400 });

  const client = await connectToDB();
  const db = client.db();

  await db
    .collection("allowedUsers")
    .updateOne({ email }, { $setOnInsert: { email } }, { upsert: true });

  return NextResponse.redirect(new URL("/admin", req.url));
}
