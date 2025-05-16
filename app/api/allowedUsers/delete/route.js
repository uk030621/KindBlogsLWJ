// app/api/allowedUsers/delete/route.js
import { connectToDB } from "@/app/lib/mongodb";

export async function POST(req) {
  const { email } = await req.json();

  const client = await connectToDB();
  const db = client.db();

  const result = await db.collection("allowedUsers").deleteOne({ email });

  if (result.deletedCount === 1) {
    return Response.json({ success: true });
  } else {
    return Response.json(
      { success: false, error: "Email not found" },
      { status: 404 }
    );
  }
}
