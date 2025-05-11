// app/api/blogs/[id]/route.js
import { connectToDB } from "@/app/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ObjectId } from "mongodb";
import { isAdmin } from "@/app/lib/isAdmin";

export async function GET(_req, { params }) {
  const { id } = params;
  const client = await connectToDB();
  const db = client.db();

  try {
    const blog = await db
      .collection("blogs")
      .findOne({ _id: new ObjectId(id) });

    if (!blog) {
      return new Response(JSON.stringify({ error: "Blog not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(blog), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch blog" }), {
      status: 500,
    });
  }
}

export async function PATCH(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { id } = params;
  const { title, content } = await req.json();

  const client = await connectToDB();
  const db = client.db();
  const blog = await db.collection("blogs").findOne({ _id: new ObjectId(id) });

  if (!blog) return new Response("Blog not found", { status: 404 });
  if (blog.userEmail !== session.user.email)
    return new Response("Forbidden", { status: 403 });

  await db
    .collection("blogs")
    .updateOne({ _id: new ObjectId(id) }, { $set: { title, content } });

  return new Response("Updated", { status: 200 });
}

export async function DELETE(_req, { params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const blogId = params.id;
  const userEmail = session.user.email;

  const client = await connectToDB();
  const db = client.db();
  const blog = await db
    .collection("blogs")
    .findOne({ _id: new ObjectId(blogId) });

  if (!blog) {
    return new Response("Not Found", { status: 404 });
  }

  const isOwner = blog.userEmail === userEmail;
  const isMod = isAdmin(userEmail);

  if (!isOwner && !isMod) {
    return new Response("Forbidden", { status: 403 });
  }

  await db.collection("blogs").deleteOne({ _id: new ObjectId(blogId) });

  return new Response("Deleted", { status: 200 });
}
