import { CommentVote, VoteDirection } from "@prisma/client";
import { json } from "@remix-run/node";
import { prisma } from "./prisma.server";

export async function voteOnComment(
  commentId: string,
  userId: string,
  direction: VoteDirection,
) {
  const alreadyVoted = await prisma.commentVote.findFirst({
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
  const createVote = prisma.commentVote.create({
    data: {
      userId,
      commentId,
      direction,
    },
  });

  const updateComment = prisma.comment.update({
    where: {
      id: commentId,
    },
    data: {
      [direction === "UP" ? "upvoteCount" : "downvoteCount"]: { increment: 1 },
    },
  });
  await prisma.$transaction([createVote, updateComment]);
}

async function updateVote({
  commentId,
  existingVote,
  newDirection,
}: {
  commentId: string;
  existingVote: CommentVote;
  newDirection: VoteDirection;
}) {
  const updateCount: any = {};

  if (existingVote.direction === newDirection) {
    const updateComment = prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        [newDirection === "UP" ? "upvoteCount" : "downvoteCount"]: {
          decrement: 1,
        },
      },
    });
    const deleteVote = prisma.commentVote.delete({
      where: {
        id: existingVote.id,
      },
    });
    await prisma.$transaction([updateComment, deleteVote]);
  } else {
    const updateComment = prisma.comment.update({
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
    const updateVote = prisma.commentVote.update({
      where: {
        id: existingVote.id,
      },
      data: {
        direction: newDirection,
      },
    });
    await prisma.$transaction([updateComment, updateVote]);
  }
}
