import {
  ActionIcon,
  Anchor,
  Box,
  Card,
  Center,
  Group,
  Image,
  Stack,
  Text,
} from "@mantine/core";
import { Form } from "@remix-run/react";
import { IconMessage } from "@tabler/icons";
import { Feedback } from "~/utils/types";
import AvatarName from "./AvatarName";
import VoteButtons from "./VoteButtons";

interface FeedbackCardProps {
  feedback: Feedback;
  loggedIn: boolean;
  handleTimestamp: (timestamp: number) => void;
}

export default function FeedbackCard(props: FeedbackCardProps) {
  const { feedback, handleTimestamp, loggedIn } = props;
  return (
    <Card>
      {feedback.mostHelpful && (
        <Text c="purple" fw="bold" fz="sm">
          Voted Most Helpful
        </Text>
      )}
      <Stack mt="xs" align="center">
        <AvatarName
          name={feedback.user.username}
          avatarUrl={feedback.user.avatarUrl}
        />
        <Text align="center" lineClamp={3}>
          {feedback.content}
        </Text>
        <Card.Section>
          <Image src={feedback.mediaUrl} />
        </Card.Section>

        <Group position="apart">
          <Anchor
            onClick={(e) => {
              e.stopPropagation();
              handleTimestamp(feedback.timestamp);
            }}
          >
            {formatDuration(feedback.timestamp)}
          </Anchor>
          <Box>
            <ActionIcon
              onClick={(_e) => {
                window.location.href = `/site/post/${feedback.postId}/${feedback.id}`;
              }}
            >
              <IconMessage color="black" />
            </ActionIcon>
            <Center>
              <Text fz="sm" c="gray">
                {feedback.commentCount}
              </Text>
              <Form method="post" action={`/site/post/${feedback.postId}`}>
                <VoteButtons votable={feedback} disabled={!loggedIn} />
              </Form>
            </Center>
          </Box>
        </Group>
      </Stack>
    </Card>
  );
}

export function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60).toFixed(0);
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");
  return `${formattedMinutes}:${formattedSeconds}`;
}
