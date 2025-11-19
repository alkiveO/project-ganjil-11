// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { query } from "@/lib/db";
import bcrypt from "bcryptjs";

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
          if (users.length === 0) {
            console.log("User not found:", credentials.email);
            return null;
          }

          const user = users[0];

          if (!user.password) {
            console.log("Password field kosong untuk:", user.email);
            return null;
          }

          const valid = await bcrypt.compare(credentials.password, user.password);
          if (!valid) {
            console.log("Password salah untuk:", user.email);
            return null;
          }

          console.log("Login berhasil:", user.name, user.role);

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          console.error("Auth error:", error.message);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role;
      session.user.id = token.id;
      return session;
    },
    // HAPUS redirect callback — GAK PERLU!
    // async redirect({ url, baseUrl }) {
    //   return `${baseUrl}/dashboard`;
    // },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };