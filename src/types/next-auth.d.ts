import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      level: string | null;
      score: number;
    } & DefaultSession["user"];
  }

  interface User {
    username?: string;
    level?: string;
    score?: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
    level: string | undefined;
    score: number;
  }
}
