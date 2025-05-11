import { NextResponse } from "next/server";
import { connectToDB } from "@/app/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const client = await connectToDB();
    const db = client.db();
    const blogs = await db
      .collection("blogs")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { message: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { title, content } = await req.json();

  if (!title || !content) {
    return new Response("Title and content are required.", { status: 400 });
  }

  const client = await connectToDB();
  const db = client.db();

  const result = await db.collection("blogs").insertOne({
    title,
    content,
    userName: session.user.name,
    userEmail: session.user.email,
    createdAt: new Date(),
  });

  return new Response(
    JSON.stringify({ message: "Blog created", id: result.insertedId }),
    {
      status: 201,
    }
  );
}
