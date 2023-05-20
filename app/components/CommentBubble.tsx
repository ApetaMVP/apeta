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

  const optimisticUpdate = async () => {
    if (comment.myVote === "UP") {
      comment.myVote = "DOWN";
    } else {
      comment.myVote = "UP";
    }
  };

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

        <Form
          method="post"
          action={`/site/post/${postId}/${feedbackId}`}
          onClick={optimisticUpdate}
        >
          <VoteButtons comment={comment} myVote={comment.myVote} />
        </Form>
      </Group>
      <Text>{parse(comment.content)}</Text>
    </Paper>
  );
}

function VoteButtons({
  comment,
  myVote,
}: {
  comment: Comment;
  myVote?: VoteDirection;
}) {
  const style = (direction: VoteDirection) => {
    if (myVote === direction) {
      return "black";
    } else {
      return "grey";
    }
  };

  console.log({ comment });

  return (
    <>
      <ActionIcon type="submit" name="upVote" value={comment.id}>
        <IconArrowUpCircle size={20} strokeWidth={2} color={style("UP")} />
      </ActionIcon>
      <Text fz="sm" c="gray" align="center">
        {comment.upvoteCount}
      </Text>

      <ActionIcon type="submit" name="downVote" value={comment.id}>
        <IconArrowDownCircle size={20} strokeWidth={2} color={style("DOWN")} />
      </ActionIcon>
      <Text fz="sm" c="gray" align="center">
        {comment.downvoteCount}
      </Text>
    </>
  );
}
