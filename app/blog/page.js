// app/blog/page.js
import BlogList from "./BlogList";
import { connectToDB } from "@/app/lib/mongodb";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const client = await connectToDB();
  const db = client.db();

  const blogs = await db
    .collection("blogs")
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  const blogData = blogs.map((blog) => ({
    _id: blog._id.toString(),
    title: blog.title,
    content: blog.content,
    userName: blog.userName,
    userEmail: blog.userEmail,
    createdAt: blog.createdAt,
  }));

  return <BlogList blogs={blogData} />;
}
