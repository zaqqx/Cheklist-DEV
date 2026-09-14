import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Identifiants",
      credentials: {
        login: { label: "Identifiant", type: "text" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        const login = credentials?.login?.trim();
        const password = credentials?.password;
        const expectedLogin = process.env.APP_LOGIN;
        const expectedPassword = process.env.APP_PASSWORD;

        if (!login || !password || !expectedLogin || !expectedPassword) {
          return null;
        }
        if (login !== expectedLogin || password !== expectedPassword) {
          return null;
        }

        return { id: "app-user", name: "Équipe" };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};

