// app/api/users/route.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectToDB } from "@/app/lib/mongodb";
import { getUserRole } from "@/app/lib/getUserRole";

export async function GET() {
  const session = await getServerSession(authOptions);
  const role = await getUserRole(session?.user?.email);

  if (role !== "admin") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 403,
    });
  }

  const client = await connectToDB();
  const db = client.db();
  const users = await db
    .collection("users")
    .find({}, { projection: { password: 0 } })
    .toArray();

  return new Response(JSON.stringify(users));
}
