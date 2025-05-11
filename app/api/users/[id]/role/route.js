import { connectToDB } from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req, { params }) {
  const session = await getServerSession(authOptions);

  // 1. Ensure user is authenticated
  if (!session?.user?.email) {
    return new Response("Unauthorized", { status: 401 });
  }

  // 2. Check if the user making the request is an admin
  const client = await connectToDB();
  const db = client.db();

  const currentUser = await db
    .collection("users")
    .findOne({ email: session.user.email });

  if (!currentUser || currentUser.role !== "admin") {
    return new Response("Forbidden", { status: 403 });
  }

  // 3. Proceed with updating the user's role
  const { id } = params;
  const formData = await req.formData();
  const role = formData.get("role");

  await db
    .collection("users")
    .updateOne({ _id: new ObjectId(id) }, { $set: { role } });

  return new Response("Role updated", { status: 200 });
}
