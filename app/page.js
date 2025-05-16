import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import AuthButtons from "./components/AuthButtons";
import ForceRefresh from "./components/ForceRefresh"; // 👈 new

export const dynamic = "force-dynamic";

export default async function Home() {
  //const pageStart = Date.now();
  //console.log("🔄 Page load started");

  //const sessionStart = Date.now();
  let session;
  try {
    session = await getServerSession(authOptions);
    //console.log("✅ Session retrieved:", session);
  } catch (error) {
    //console.error("❌ Error fetching session:", error);
  }
  //console.log(`⏱️ getServerSession() took ${Date.now() - sessionStart} ms`);
  //console.log(`🚀 Total page load time: ${Date.now() - pageStart} ms`);

  return (
    <main className="flex flex-col items-center justify-start  py-3 px-4 text-center ">
      <AuthButtons
        isAuthenticated={!!session}
        userName={session?.user?.name || ""}
      />
      {!session && <ForceRefresh />} {/* 👈 Only auto-refresh if no session */}
    </main>
  );
}
