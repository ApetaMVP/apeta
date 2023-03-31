import { prisma } from "./prisma.server";

export async function getFeedback(feedbackId: string) {
  return await prisma.feedback.findUnique({
    where: {
      id: feedbackId,
    },
    include: {
      post: true,
      user: true,
      comments: { include: { user: true } },
    },
  });
}
