import { prisma } from "./prisma.server";

export async function getTags(count = 25) {
  return await prisma.tag.findMany({
    take: count,
    orderBy: {
      count: "desc",
    },
  });
}
