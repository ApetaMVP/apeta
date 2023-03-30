import { Anchor, Card, Image, Stack, Text } from "@mantine/core";
import { Feedback } from "~/utils/types";
import AvatarName from "./AvatarName";

interface FeedbackCardProps {
  feedback: Feedback;
  loggedIn: boolean;
  handleTimestamp: (timestamp: number) => void;
}

export default function FeedbackCard(props: FeedbackCardProps) {
  const { feedback, handleTimestamp } = props;
  return (
    <Card
      onClick={(_e) => {
        window.location.href = `/site/post/${feedback.postId}/${feedback.id}`;
      }}
      style={{ cursor: "pointer" }}
    >
      <Card.Section>
        <Image src={feedback.mediaUrl} />
      </Card.Section>
      <Stack mt="xs">
        <AvatarName
          name={feedback.user.username}
          avatarUrl={feedback.user.avatarUrl}
        />
        <Anchor
          onClick={(e) => {
            e.stopPropagation();
            handleTimestamp(feedback.timestamp);
          }}
        >
          {formatDuration(feedback.timestamp)}
        </Anchor>
        <Text lineClamp={3}>{feedback.content}</Text>
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
