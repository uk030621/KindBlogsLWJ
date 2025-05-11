// app/api/user/role/route.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectToDB } from "@/app/lib/mongodb";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return new Response(JSON.stringify({ role: "guest" }), { status: 200 });
  }

  const client = await connectToDB();
  const db = client.db();
  const user = await db
    .collection("users")
    .findOne({ email: session.user.email });

  return new Response(JSON.stringify({ role: user?.role || "user" }), {
    status: 200,
  });
}
