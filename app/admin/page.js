// app/admin/page.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectToDB } from "@/app/lib/mongodb";
import { getUserRole } from "@/app/lib/getUserRole";
import { redirect } from "next/navigation";
import UserTable from "../components/UserTable";
import AllowedUsersList from "../components/AllowedUserList";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  const role = await getUserRole(session?.user?.email);

  if (role !== "admin") redirect("/");

  const client = await connectToDB();
  const db = client.db();

  const users = (await db.collection("users").find().toArray()).map((user) => ({
    ...user,
    _id: user._id.toString(), // 👈 Fix here
  }));
  const allowed = (await db.collection("allowedUsers").find().toArray()).map(
    (entry) => ({
      ...entry,
      _id: entry._id.toString(), // 👈 Fix here too
    })
  );

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20 ">
      <h1 className="text-2xl font-bold mb-4 text-black text-center">
        Admin Dashboard
      </h1>
      <h2 className="text-lg text-slate-800 font-semibold mb-2 ">
        Allowed Sign-In Emails
      </h2>
      <AllowedUsersList initialAllowed={allowed} />
      {/* Add new email */}
      <form
        action="/api/allowedUsers/add"
        method="POST"
        className="mt-4 flex gap-2"
      >
        <input
          type="email"
          name="email"
          placeholder="Add allowed email"
          required
          className="border rounded px-3 py-1 w-full"
        />
        <button
          type="submit"
          className="text-xs px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Add
        </button>
      </form>
      <UserTable users={users} /> {/* ✅ React UI for interactivity */}
    </div>
  );
}
