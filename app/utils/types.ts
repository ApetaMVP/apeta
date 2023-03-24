import {
  Comment as PrismaComment,
  Post as PrismaPost,
  User,
} from "@prisma/client";

export type Post = PrismaPost & { author: User };
export type FypPost = Post & { iLiked?: boolean };
export type FullPost = FypPost & { comments?: Comment[] };

export type Comment = PrismaComment & { user: User };
