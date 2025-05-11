// app/layout.js
import "./globals.css";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import Providers from "./components/Providers";

export const metadata = {
  title: "Community Blog",
  description: "A collaborative blog platform",
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className="pt-20">
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}
