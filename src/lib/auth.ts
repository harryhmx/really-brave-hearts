import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { toDbUsername } from "@/lib/utils";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      id: "credentials",
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { username: toDbUsername(credentials.username as string) },
        });

        if (!user) return null;

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) return null;

        return {
          id: user.id,
          name: user.username,
          username: user.username,
          level: user.level ?? undefined,
          score: user.score,
        };
      },
    }),
    Credentials({
      id: "sms",
      name: "sms",
      credentials: {
        username: { label: "Username", type: "text" },
        phone_number: { label: "Phone Number", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.phone_number) {
          return null;
        }

        const dbUsername = toDbUsername(credentials.username as string);
        const phoneNumber = credentials.phone_number as string;

        const existing = await prisma.user.findUnique({
          where: { username: dbUsername },
        });

        let user;
        if (existing) {
          user = await prisma.user.update({
            where: { username: dbUsername },
            data: { phoneNumber },
          });
        } else {
          const placeholderPw = await bcrypt.hash(
            `sms_${Date.now()}_${Math.random()}`,
            10
          );
          user = await prisma.user.create({
            data: { username: dbUsername, phoneNumber, password: placeholderPw },
          });
        }

        return {
          id: user.id,
          name: user.username,
          username: user.username,
          level: user.level ?? undefined,
          score: user.score,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.level = user.level;
        token.score = user.score;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.level = token.level as string;
        session.user.score = token.score as number;
      }
      return session;
    },
  },
});
