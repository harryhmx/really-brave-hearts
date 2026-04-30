import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      level: string | null;
      score: number;
      usertype: string;
    } & DefaultSession["user"];
  }

  interface User {
    username?: string;
    level?: string;
    score?: number;
    usertype?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
    level: string | undefined;
    score: number;
    usertype: string;
  }
}
