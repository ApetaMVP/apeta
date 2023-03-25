import { Anchor, Card, Text, Title } from "@mantine/core";
import { Feedback } from "~/utils/types";

interface FeedbackCardProps {
  feedback: Feedback;
  onTimestamp: (timestamp: number) => void;
}

export default function FeedbackCard(props: FeedbackCardProps) {
  const { feedback, onTimestamp } = props;

  return (
    <Card>
      <Anchor onClick={(e) => onTimestamp(feedback.timestamp)}>
        @ {feedback.timestamp.toFixed(2)}
      </Anchor>
      <Title order={5}>{feedback.user.username}</Title>
      <Text>{feedback.msg}</Text>
    </Card>
  );
}
