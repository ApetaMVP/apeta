import { Avatar, Group, Paper, Text, useMantineTheme } from "@mantine/core";
import parse from "html-react-parser";
import TimeAgo from "react-timeago";
import { Comment } from "~/utils/types";

interface CommentBubbleProps {
  comment: Comment;
}

export default function CommentBubble(props: CommentBubbleProps) {
  const { comment } = props;

  return (
    <Paper bg={useMantineTheme().colors.gray[0]} radius="md" p="sm">
      <Group>
        <Group spacing="xs">
          <Avatar
            src={comment.user.avatarUrl}
            size="sm"
            bg="white"
            radius="xl"
          />
          <Text fw={700}>{comment.user.username}</Text>
        </Group>
        <Text c="dimmed" fz="sm">
          <TimeAgo date={comment.createdAt} />
        </Text>
      </Group>
      <Text>{parse(comment.content)}</Text>
    </Paper>
  );
}
