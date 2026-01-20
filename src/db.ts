import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";

const db = process.env.DATABASE_URL || "./dev.db";
const adapter = new PrismaBetterSqlite3({ url: db });
export const prisma = new PrismaClient({ adapter });
