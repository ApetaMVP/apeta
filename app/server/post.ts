import { prisma } from "./prisma";

export async function createPost(
  userId: string,
  mediaUrl: string,
  caption: string
) {
  return await prisma.post.create({
    data: {
      authorId: userId,
      mediaUrl,
      caption,
    },
  });
}

export async function getPosts(start: number, limit: number) {
  return await prisma.post.findMany({
    skip: start,
    take: limit,
    include: { author: true },
  });
}
