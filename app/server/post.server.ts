import { json } from "@remix-run/node";
import { FypPost } from "~/utils/types";
import { prisma } from "./prisma.server";
import { getUserWithLikes } from "./user.server";

export async function createPost(
  userId: string,
  mediaUrl: string,
  content: string,
) {
  return await prisma.post.create({
    data: {
      authorId: userId,
      mediaUrl,
      content,
      likeCount: 0,
      feedbackCount: 0,
    },
  });
}

export async function getFypPosts(
  userId: string,
  start: number,
  limit: number,
) {
  const dbPosts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    skip: start,
    take: limit,
    include: { author: true },
  });
  if (!userId) {
    return dbPosts;
  }
  const user = await getUserWithLikes(userId);
  const posts: FypPost[] = [];
  for (const dbp of dbPosts) {
    const post: FypPost = dbp;
    if (user?.likes?.some((l) => l.postId === dbp.id)) {
      post.iLiked = true;
    } else {
      post.iLiked = false;
    }
    posts.push(post);
  }
  return posts;
}

export async function getFullPost(postId: string) {
  return await prisma.post.findUnique({
    where: { id: postId },
    include: {
      author: true,
      feedback: { include: { user: true }, orderBy: { timestamp: "asc" } },
    },
  });
}

export async function likePost(userId: string, postId: string) {
  const alreadyLiked = await prisma.like.findFirst({
    where: {
      userId,
      postId,
    },
  });
  if (!alreadyLiked) {
    await prisma.like.create({
      data: {
        userId,
        postId,
      },
    });
    await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        likeCount: {
          increment: 1,
        },
      },
    });
  } else {
    await prisma.like.deleteMany({ where: { userId, postId } });
    await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        likeCount: {
          decrement: 1,
        },
      },
    });
  }
  return json({ success: true });
}

export async function feedbackOnPost(
  userId: string,
  postId: string,
  content: string,
  timestamp: number,
  mediaUrl: string,
) {
  await prisma.feedback.create({
    data: {
      content,
      timestamp,
      mediaUrl,
      commentCount: 0,
      user: {
        connect: {
          id: userId,
        },
      },
      post: {
        connect: {
          id: postId,
        },
      },
    },
  });
  await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      feedbackCount: {
        increment: 1,
      },
    },
  });
  return json({ success: true });
}

export async function commentOnFeedback(
  userId: string,
  feedbackId: string,
  content: string,
) {
  await prisma.comment.create({
    data: {
      content,
      user: {
        connect: {
          id: userId,
        },
      },
      feedback: {
        connect: {
          id: feedbackId,
        },
      },
    },
  });
  await prisma.feedback.update({
    where: {
      id: feedbackId,
    },
    data: {
      commentCount: {
        increment: 1,
      },
    },
  });
  return json({ success: true });
}