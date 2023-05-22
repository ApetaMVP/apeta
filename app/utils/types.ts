import {
  Comment as PrismaComment,
  Feedback as PrismaFeedback,
  Post as PrismaPost,
  User,
  VoteDirection,
} from "@prisma/client";

export type Post = PrismaPost & { author: User };
export type FypPost = Post & { iLiked?: boolean };
export type FullPost = FypPost & { feedback?: Feedback[] };

export type Comment = PrismaComment & { myVote?: VoteDirection; user: User };
export type Feedback = PrismaFeedback & {
  myVote?: VoteDirection;
  user: User;
  comments: Comment[];
};

export type Votable = Feedback | Comment;
