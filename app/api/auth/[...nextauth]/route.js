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
      //console.log("🔐 JWT callback called. Token:", token);
      if (user) {
        //console.log("👤 New user logging in:", user.email);
        const client = await connectToDB();
        const db = client.db();
        const usersCollection = db.collection("users");

        let dbUser = await usersCollection.findOne({ email: token.email });
        if (!dbUser) {
          //console.log("➕ New user added to DB");
          await usersCollection.insertOne({ email: token.email, role: "user" });
          dbUser = { role: "user" };
        }
        token.role = dbUser.role;
      }
      return token;
    },

    async session({ session, token }) {
      //console.log("📦 Session callback called. Token:", token);
      if (token?.role) session.user.role = token.role;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
