import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      level: number;
      score: number;
    } & DefaultSession["user"];
  }

  interface User {
    username?: string;
    level?: number;
    score?: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
    level: number;
    score: number;
  }
}
