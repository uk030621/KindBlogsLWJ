import { connectToDB } from "@/app/lib/mongodb";

export async function getUserRole(email) {
  if (!email) return null;

  const client = await connectToDB();
  const db = client.db();

  const user = await db.collection("users").findOne({ email });

  return user?.role || "user"; // default to "user" if not found
}
