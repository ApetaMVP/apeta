import { Group, Paper, Text, useMantineTheme } from "@mantine/core";
import { Form } from "@remix-run/react";
import parse from "html-react-parser";
import TimeAgo from "react-timeago";
import { formatTimeAgo } from "~/utils/helpers";
import { Comment } from "~/utils/types";
import AvatarName from "./AvatarName";
import VoteButtons from "./VoteButtons";

interface CommentBubbleProps {
  comment: Comment;
  postId: string;
  feedbackId: string;
  loggedIn: boolean;
}

export default function CommentBubble(props: CommentBubbleProps) {
  const { comment, postId, feedbackId, loggedIn } = props;

  return (
    <Paper bg={useMantineTheme().colors.gray[0]} radius="md" p="sm">
      <Group>
        <AvatarName
          name={comment.user.username}
          avatarUrl={comment.user.avatarUrl}
        />
        <Text c="dimmed" fz="sm">
          <TimeAgo
            formatter={formatTimeAgo}
            live={false}
            date={comment.createdAt}
          />
        </Text>
      </Group>
      <Text>{parse(comment.content)}</Text>
      <Form method="post" action={`/site/post/${postId}/${feedbackId}`}>
        <VoteButtons votable={comment} disabled={!loggedIn} />
      </Form>
    </Paper>
  );
}
