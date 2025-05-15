// app/admin/page.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectToDB } from "@/app/lib/mongodb";
import { getUserRole } from "@/app/lib/getUserRole";
import { redirect } from "next/navigation";
import UserTable from "../components/UserTable";

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
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4 text-slate-700">
        Admin Dashboard
      </h1>
      <UserTable users={users} /> {/* ✅ React UI for interactivity */}
      <h2 className="text-xl font-semibold mb-2">Allowed Sign-In Emails</h2>
      <ul className="list-disc ml-6 mb-4 space-y-1">
        {allowed.map((entry) => (
          <li key={entry._id} className="flex items-center justify-between">
            <span>{entry.email}</span>
            <form action="/api/allowedUsers/delete" method="POST">
              <input type="hidden" name="email" value={entry.email} />
              <button
                type="submit"
                className="ml-4 text-sm text-red-600 hover:underline"
              >
                Delete
              </button>
            </form>
          </li>
        ))}
      </ul>
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
          className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Add
        </button>
      </form>
    </div>
  );
}
