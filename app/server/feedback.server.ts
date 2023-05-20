import { prisma } from "./prisma.server";

export async function getFeedback(feedbackId: string, userId?: string) {
  const dbFeedbacks = await prisma.feedback.findUnique({
    where: {
      id: feedbackId,
    },
    include: {
      post: true,
      user: true,
      comments: { include: { user: true, votes: true } },
    },
  });

  if (!userId || !dbFeedbacks) {
    return dbFeedbacks;
  }

  dbFeedbacks.comments = dbFeedbacks.comments.map((comment) => {
    return {
      ...comment,
      myVote: comment.votes.find((vote) => vote.userId === userId)?.direction,
    };
  });
  return dbFeedbacks;
}
