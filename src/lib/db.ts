import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL no configurado");
}

declare global {
  var prisma: PrismaClient | undefined;
  var prismaPool: Pool | undefined;
}

const pool = global.prismaPool || new Pool({ connectionString });
const adapter = new PrismaPg(pool);

export const db =
  global.prisma ||
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = db;
  global.prismaPool = pool;
}
