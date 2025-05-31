import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import AuthButtons from "./components/AuthButtons";
import ForceRefresh from "./components/ForceRefresh";
import ErrorBoundary from "./components/ErrorBoundary"; // optional

export const dynamic = "force-dynamic"; // ✅ only once

export default async function Home() {
  let session = null;
  try {
    session = await getServerSession(authOptions);
  } catch (error) {
    console.error("❌ Error retrieving session:", error);
  }

  return (
    <main className="flex flex-col items-center justify-start py-3 px-4 text-center">
      {/* Wrap with ErrorBoundary if desired */}
      <ErrorBoundary>
        <AuthButtons
          isAuthenticated={!!session}
          userName={session?.user?.name || ""}
        />
        {!session && <ForceRefresh />}
      </ErrorBoundary>
    </main>
  );
}
