import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { connectToDB } from "@/app/lib/mongodb";

export async function PATCH(req, { params }) {
  const { id } = params;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json(
      { msg: "Invalid ID", success: false },
      { status: 400 }
    );
  }

  try {
    const client = await connectToDB();
    const db = client.db(process.env.MONGODB_DB);
    const collection = db.collection("contacts");

    const { done } = await req.json();

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { done } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { msg: "Message not found or not updated", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json({ msg: "Message updated", success: true });
  } catch (err) {
    console.error("PATCH /api/contact/[id] error:", err);
    return NextResponse.json(
      { msg: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
