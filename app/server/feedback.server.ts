import { VoteDirection, FeedbackVote } from "@prisma/client";
import { json } from "@remix-run/node";
import { Feedback } from "~/utils/types";
import { prisma } from "./prisma.server";
import { addField } from "./script";

export async function getFeedback(feedbackId: string, userId?: string) {
  const dbFeedback = await prisma.feedback.findUnique({
    where: {
      id: feedbackId,
    },
    include: {
      post: true,
      user: true,
      votes: true,
      comments: { include: { user: true, votes: true } },
    },
  });

  if (!userId || !dbFeedback) {
    return dbFeedback;
  }

  dbFeedback.comments = dbFeedback.comments.map((comment, index) => {
    return {
      ...comment,
      myVote: comment.votes.find((vote) => vote.userId === userId)?.direction,
      mostHelpful: index === 0,
    };
  });
  return dbFeedback;
}

export async function voteOnFeedback(
  feedbackId: string,
  userId: string,
  direction: VoteDirection,
) {
  const alreadyVoted = await prisma.feedbackVote.findFirst({
    where: {
      userId,
      feedbackId,
    },
  });
  if (!alreadyVoted) {
    await newVote(userId, feedbackId, direction);
  } else {
    await updateVote({
      feedbackId,
      existingVote: alreadyVoted,
      newDirection: direction,
    });
  }
  return json({ success: true });
}

async function newVote(
  userId: string,
  feedbackId: string,
  direction: VoteDirection,
) {
  const createVote = prisma.feedbackVote.create({
    data: {
      userId,
      feedbackId,
      direction,
    },
  });

  const updateFeedback = prisma.feedback.update({
    where: {
      id: feedbackId,
    },
    data: {
      [direction === "UP" ? "upvoteCount" : "downvoteCount"]: { increment: 1 },
      voteSum: { increment: direction === "UP" ? 1 : -1 },
    },
  });
  await prisma.$transaction([createVote, updateFeedback]);
}

async function updateVote({
  feedbackId,
  existingVote,
  newDirection,
}: {
  feedbackId: string;
  existingVote: FeedbackVote;
  newDirection: VoteDirection;
}) {
  if (existingVote.direction === newDirection) {
    const updateFeedback = prisma.feedback.update({
      where: {
        id: feedbackId,
      },
      data: {
        [newDirection === "UP" ? "upvoteCount" : "downvoteCount"]: {
          decrement: 1,
        },
        voteSum: {
          decrement: newDirection === "UP" ? 1 : -1,
        },
      },
    });
    const deleteVote = prisma.feedbackVote.delete({
      where: {
        id: existingVote.id,
      },
    });
    await prisma.$transaction([updateFeedback, deleteVote]);
  } else {
    const updateFeedback = prisma.feedback.update({
      where: {
        id: feedbackId,
      },
      data: {
        [existingVote.direction === "UP" ? "upvoteCount" : "downvoteCount"]: {
          decrement: 1,
        },
        [newDirection === "UP" ? "upvoteCount" : "downvoteCount"]: {
          increment: 1,
        },
        voteSum: {
          increment: newDirection === "UP" ? 2 : -2,
        },
      },
    });
    const updateVote = prisma.feedbackVote.update({
      where: {
        id: existingVote.id,
      },
      data: {
        direction: newDirection,
      },
    });
    await prisma.$transaction([updateFeedback, updateVote]);
  }
}
