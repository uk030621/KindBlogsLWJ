import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectToDB } from "@/app/lib/mongodb";
import { redirect } from "next/navigation";
import { getUserRole } from "@/app/lib/getUserRole";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  const role = await getUserRole(session?.user?.email);

  if (role !== "admin") redirect("/");

  const client = await connectToDB();
  const db = client.db();
  const users = await db.collection("users").find().toArray();

  return (
    <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-8 ">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-left text-slate-700">
        Admin Dashboard
      </h1>

      <div className="overflow-x-auto mr-3">
        <table className="min-w-full border text-sm sm:text-base">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Email</th>
              <th className="p-2">Role</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-t">
                <td className="p-2">{user.email}</td>
                <td className="p-2 capitalize">{user.role}</td>
                <td className="p-2">
                  <form
                    action={`/api/users/${user._id}/role`}
                    method="POST"
                    className="inline"
                  >
                    <input
                      type="hidden"
                      name="role"
                      value={user.role === "admin" ? "user" : "admin"}
                    />
                    <button
                      type="submit"
                      className="px-3 py-1 text-xs sm:text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                      Make {user.role === "admin" ? "User" : "Admin"}
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
