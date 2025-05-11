// app/lib/isAdmin.js
import { connectToDB } from "@/app/lib/mongodb";

export const isAdmin = async (email) => {
  const client = await connectToDB();
  const db = client.db();
  const user = await db.collection("users").findOne({ email });
  return user?.role === "admin";
};
