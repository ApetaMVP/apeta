import bcrypt from "bcryptjs";
import { generateFromString } from "generate-avatar";
import { prisma } from "./prisma.server";

export async function createUser(
  email: string,
  password: string,
  name: string,
  username: string,
  avatar = `data:image/svg+xml;utf8,${generateFromString(email)}`,
) {
  return await prisma.user.create({
    data: {
      email,
      password: await bcrypt.hash(password, 10),
      name,
      username,
      avatarUrl: avatar,
    },
  });
}

export async function getUser(userId: string) {
  return await prisma.user.findUnique({ where: { id: userId } });
}

export async function getUserWithLikes(userId: string) {
  return await prisma.user.findUnique({
    where: { id: userId },
    include: { likes: true },
  });
}

export async function updateUserPfp(userId: string, pfp: string) {
  return await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      avatarUrl: pfp,
    },
  });
}
