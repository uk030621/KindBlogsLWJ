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
    authorName: blog.authorName,
    userEmail: blog.userEmail,
    createdAt: blog.createdAt,
    imageUrl: blog.imageUrl || "", // 👈 Add this line
  }));

  return <BlogList blogs={blogData} />;
}
