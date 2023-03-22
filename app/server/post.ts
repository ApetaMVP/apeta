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
