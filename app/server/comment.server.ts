import { Vote, VoteDirection } from "@prisma/client";
import { json } from "@remix-run/node";
import { prisma } from "./prisma.server";

export async function voteOnComment(
  commentId: string,
  userId: string,
  direction: VoteDirection,
) {
  const alreadyVoted = await prisma.vote.findFirst({
    where: {
      userId,
      commentId,
    },
  });
  if (!alreadyVoted) {
    await newVote(userId, commentId, direction);
  } else {
    await updateVote({
      commentId,
      existingVote: alreadyVoted,
      newDirection: direction,
    });
  }
  return json({ success: true });
}

async function newVote(
  userId: string,
  commentId: string,
  direction: VoteDirection,
) {
  await prisma.vote.create({
    data: {
      userId,
      commentId,
      direction,
    },
  });

  await prisma.comment.update({
    where: {
      id: commentId,
    },
    data: {
      [direction === "UP" ? "upvoteCount" : "downvoteCount"]: { increment: 1 },
    },
  });
}

async function updateVote({
  commentId,
  existingVote,
  newDirection,
}: {
  commentId: string;
  existingVote: Vote;
  newDirection: VoteDirection;
}) {
  const updateCount: any = {};

  if (existingVote.direction === newDirection) {
    await prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        [newDirection === "UP" ? "upvoteCount" : "downvoteCount"]: {
          decrement: 1,
        },
      },
    });
    await prisma.vote.delete({
      where: {
        id: existingVote.id,
      },
    });
  } else {
    const res = await prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        [existingVote.direction === "UP" ? "upvoteCount" : "downvoteCount"]: {
          decrement: 1,
        },
        [newDirection === "UP" ? "upvoteCount" : "downvoteCount"]: {
          increment: 1,
        },
      },
    });
    await prisma.vote.update({
      where: {
        id: existingVote.id,
      },
      data: {
        direction: newDirection,
      },
    });
  }
}
