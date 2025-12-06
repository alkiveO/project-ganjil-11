// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { query } from "@/lib/db";
import bcrypt from "bcryptjs"; // <-- pake ini aja

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const users = await query("SELECT * FROM users WHERE email = ?", [credentials.email]);
          if (users.length === 0) return null;

          const user = users[0];

          // Kalo password null (misal admin pertama), bolehin login tanpa cek password
          if (!user.password_hash && !user.password) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role || "siswa",
            };
          }

          const valid = await bcrypt.compare(credentials.password, user.password_hash || user.password);
          if (!valid) return null;

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-ganti-di-production",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };