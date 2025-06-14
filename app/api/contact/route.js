import { NextResponse } from "next/server";
import { connectToDB } from "@/app/lib/mongodb";

export async function POST(req) {
  const { fullname, email, message } = await req.json();

  const errors = [];
  if (!fullname) errors.push("Full name is required.");
  if (!email || !email.includes("@")) errors.push("Valid email is required.");
  if (!message) errors.push("Message cannot be empty.");

  if (errors.length > 0) {
    return NextResponse.json({ msg: errors, success: false });
  }

  try {
    const client = await connectToDB();
    const db = client.db();
    const collection = db.collection("contacts");

    await collection.insertOne({
      fullname,
      email,
      message,
      date: new Date(),
    });

    return NextResponse.json({
      msg: ["Message sent successfully."],
      success: true,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      msg: ["Something went wrong."],
      success: false,
    });
  }
}

export async function GET() {
  try {
    const client = await connectToDB();
    const db = client.db();
    const messages = await db
      .collection("contacts")
      .find({})
      .sort({ date: -1 })
      .toArray();

    return NextResponse.json(messages);
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      msg: ["Unable to fetch messages."],
      success: false,
    });
  }
}
