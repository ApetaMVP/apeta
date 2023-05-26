import { prisma } from "./prisma.server";

// add voteSum field to all feedback
export async function addField() {
  await prisma.feedback.updateMany({
    data: {
      voteSum: {
        set: 0,
      },
      upvoteCount: {
        set: 0,
      },
      downvoteCount: {
        set: 0,
      },
    },
  });
  return prisma.comment.updateMany({
    data: {
      voteSum: {
        set: 0,
      },
      upvoteCount: {
        set: 0,
      },
      downvoteCount: {
        set: 0,
      },
    },
  });
}
