import {
  Comment as PrismaComment,
  Feedback as PrismaFeedback,
  Post as PrismaPost,
  User,
} from "@prisma/client";

export type Post = PrismaPost & { author: User };
export type FypPost = Post & { iLiked?: boolean };
export type FullPost = FypPost & { feedback?: Feedback[] };

export type Comment = PrismaComment & { user: User };
export type Feedback = PrismaFeedback & { user: User; comments: Comment[] };
