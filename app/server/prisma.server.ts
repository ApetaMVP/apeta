import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;
declare global {
  var db: PrismaClient | undefined;
}

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
  prisma.$connect();
} else {
  if (!global.db) {
    global.db = new PrismaClient();
    global.db.$connect();
  }
  prisma = global.db;
}

export { prisma };
