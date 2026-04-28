import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const cleanUrl = process.env.POSTGRES_PRISMA_URL!
  .replace(/[?&]pgbouncer=true/, "")
  .replace("sslmode=require", "sslmode=no-verify");

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma || new PrismaClient({ adapter: new PrismaPg(cleanUrl) });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
