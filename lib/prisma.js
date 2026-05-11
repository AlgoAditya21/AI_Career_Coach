import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

function normalizeDatabaseUrl(connectionString) {
  if (!connectionString) return connectionString;

  try {
    const url = new URL(connectionString);
    const sslMode = url.searchParams.get("sslmode");

    if (["require", "prefer", "verify-ca"].includes(sslMode)) {
      url.searchParams.set("sslmode", "require");
      url.searchParams.set("uselibpqcompat", "true");
      return url.toString();
    }
  } catch (error) {
    console.warn("Unable to normalize DATABASE_URL SSL params:", error);
  }

  return connectionString;
}

const adapter = new PrismaPg({ connectionString: normalizeDatabaseUrl(process.env.DATABASE_URL) });

export const db = globalThis.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;