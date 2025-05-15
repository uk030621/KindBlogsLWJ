import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectToDB } from "@/app/lib/mongodb";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      const client = await connectToDB();
      const db = client.db();

      const allowed = await db
        .collection("allowedUsers")
        .findOne({ email: user.email });

      if (!allowed) {
        console.log(`❌ Access denied for: ${user.email}`);
        return false;
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        const client = await connectToDB();
        const db = client.db();
        const usersCollection = db.collection("users");

        let dbUser = await usersCollection.findOne({ email: token.email });

        if (!dbUser) {
          await usersCollection.insertOne({ email: token.email, role: "user" });
          dbUser = { role: "user" };
        }

        token.role = dbUser.role;
      }
      return token;
    },

    async session({ session, token }) {
      if (token?.role) {
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    error: "/auth/error", // Custom error page
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
