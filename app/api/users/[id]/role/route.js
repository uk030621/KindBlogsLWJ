// app/api/users/[id]/role/route.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectToDB } from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";
import { getUserRole } from "@/app/lib/getUserRole";

export async function POST(req, { params }) {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;
  const role = await getUserRole(userEmail);

  if (role !== "admin") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 403,
    });
  }

  const body = await req.json();
  const newRole = body.role;
  const validRoles = ["admin", "user"];
  if (!validRoles.includes(newRole)) {
    return new Response(JSON.stringify({ error: "Invalid role" }), {
      status: 400,
    });
  }

  const client = await connectToDB();
  const db = client.db();

  await db
    .collection("users")
    .updateOne({ _id: new ObjectId(params.id) }, { $set: { role: newRole } });

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
