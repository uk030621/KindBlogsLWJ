// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
//import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
//import clientPromise from "@/app/lib/mongodb";
import { connectToDB } from "@/app/lib/mongodb";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        try {
          const client = await connectToDB();
          const db = client.db();
          const usersCollection = db.collection("users");

          let dbUser = await usersCollection.findOne({ email: token.email });

          if (!dbUser) {
            await usersCollection.insertOne({
              email: token.email,
              role: "user",
            });
            dbUser = { role: "user" };
          }

          token.role = dbUser.role;
        } catch (error) {
          console.error("JWT Callback DB error:", error);
          // Fallback to default role if DB call fails
          token.role = "user";
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (!session.user) session.user = {};
      if (token?.role) {
        session.user.role = token.role;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
