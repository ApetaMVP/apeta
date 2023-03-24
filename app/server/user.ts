import { prisma } from "./prisma";

export async function getUser(userId: string) {
  return await prisma.user.findUnique({ where: { id: userId } });
}

export async function getUserWithLikes(userId: string) {
  return await prisma.user.findUnique({
    where: { id: userId },
    include: { likes: true },
  });
}
