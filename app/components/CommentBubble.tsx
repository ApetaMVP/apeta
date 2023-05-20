import { ActionIcon, Group, Paper, Text, useMantineTheme } from "@mantine/core";
import { VoteDirection } from "@prisma/client";
import { Form } from "@remix-run/react";
import { IconArrowUpCircle, IconArrowDownCircle } from "@tabler/icons";
import parse from "html-react-parser";
import TimeAgo from "react-timeago";
import { Comment } from "~/utils/types";
import AvatarName from "./AvatarName";

interface CommentBubbleProps {
  comment: Comment;
  postId: string;
  feedbackId: string;
}

export default function CommentBubble(props: CommentBubbleProps) {
  const { comment, postId, feedbackId } = props;

  return (
    <Paper bg={useMantineTheme().colors.gray[0]} radius="md" p="sm">
      <Group>
        <AvatarName
          name={comment.user.username}
          avatarUrl={comment.user.avatarUrl}
        />
        <Text c="dimmed" fz="sm">
          <TimeAgo date={comment.createdAt} />
        </Text>
      </Group>
      <Text>{parse(comment.content)}</Text>
      <Form method="post" action={`/site/post/${postId}/${feedbackId}`}>
        <VoteButtons comment={comment} />
      </Form>
    </Paper>
  );
}

function VoteButtons({ comment }: { comment: Comment }) {
  const styleForArrow = (direction: VoteDirection) => {
    if (!comment.myVote || comment.myVote !== direction) {
      return "gray";
    } else {
      return "black";
    }
  };

  const optimisticUpdate = (clicked: VoteDirection) => async () => {
    const isUpvote = clicked === "UP";
    const isDownvote = clicked === "DOWN";
    const isCurrentUpvote = comment.myVote === "UP";
    const isCurrentDownvote = comment.myVote === "DOWN";

    if (isUpvote && isCurrentUpvote) {
      comment.upvoteCount--;
      comment.myVote = undefined;
    } else if (isDownvote && isCurrentDownvote) {
      comment.downvoteCount--;
      comment.myVote = undefined;
    } else if (isUpvote && isCurrentDownvote) {
      comment.upvoteCount++;
      comment.downvoteCount--;
      comment.myVote = "UP";
    } else if (isDownvote && isCurrentUpvote) {
      comment.downvoteCount++;
      comment.upvoteCount--;
      comment.myVote = "DOWN";
    } else if (isUpvote && !comment.myVote) {
      comment.upvoteCount++;
      comment.myVote = "UP";
    } else if (isDownvote && !comment.myVote) {
      comment.downvoteCount++;
      comment.myVote = "DOWN";
    }
  };

  return (
    <Group>
      <ActionIcon
        type="submit"
        name="upVote"
        value={comment.id}
        onClick={optimisticUpdate("UP")}
      >
        <IconArrowUpCircle
          size={20}
          strokeWidth={2}
          color={styleForArrow("UP")}
        />
      </ActionIcon>
      <Text fz="sm" c="gray" align="center">
        {comment.upvoteCount}
      </Text>

      <ActionIcon
        type="submit"
        name="downVote"
        value={comment.id}
        onClick={optimisticUpdate("DOWN")}
      >
        <IconArrowDownCircle
          size={20}
          strokeWidth={2}
          color={styleForArrow("DOWN")}
        />
      </ActionIcon>
      <Text fz="sm" c="gray" align="center">
        {comment.downvoteCount}
      </Text>
    </Group>
  );
}
