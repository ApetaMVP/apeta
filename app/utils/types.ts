import { Post as PrismaPost, User } from "@prisma/client";

export type Post = PrismaPost & { author: User };
export type FypPost = Post & { iLiked?: boolean };
