import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createPrismaClient() {
  const connectionString = process.env.POSTGRES_PRISMA_URL!;
  // Remove pgbouncer param and set sslmode=require for TLS without cert verification
  const cleanUrl = connectionString
    .replace(/[?&]pgbouncer=true/, "")
    .replace("sslmode=require", "sslmode=no-verify");
  const adapter = new PrismaPg(cleanUrl);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
