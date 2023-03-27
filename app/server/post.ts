import { json } from "@remix-run/node";
import { FypPost } from "~/utils/types";
import { prisma } from "./prisma";
import { getUserWithLikes } from "./user";

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
      likeCount: 0,
      commentCount: 0,
    },
  });
}

export async function getFypPosts(
  userId: string,
  start: number,
  limit: number
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
  let posts: FypPost[] = [];
  for (const dbp of dbPosts) {
    let post: FypPost = dbp;
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
      comments: { include: { user: true } },
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

export async function commentOnPost(
  userId: string,
  postId: string,
  content: string
) {
  await prisma.comment.create({
    data: {
      content,
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
    where: { id: postId },
    data: {
      commentCount: {
        increment: 1,
      },
    },
  });
  return json({ success: true });
}

export async function leaveFeedbackOnPost(
  userId: string,
  postId: string,
  msg: string,
  timestamp: number,
  img: string
) {
  await prisma.feedback.create({
    data: {
      msg,
      timestamp,
      img,
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
  return json({ success: true });
}
