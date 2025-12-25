import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import type { NextAuthConfig } from "next-auth";

// Base config shared between Edge and Node.js runtime
const authConfig: NextAuthConfig = {
  session: {
    strategy: "jwt",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

export default authConfig;

// Full auth with adapter - only used in Node.js runtime (API routes)
export const { handlers, auth, signIn, signOut } = NextAuth(async () => {
  const { MongoDBAdapter } = await import("@auth/mongodb-adapter");
  const clientPromise = (await import("./db/mongodb-client")).default;

  return {
    ...authConfig,
    adapter: MongoDBAdapter(clientPromise),
  };
});
