import { Anchor, Card, Text, Title } from "@mantine/core";
import { Feedback } from "~/utils/types";
import VideoEditor from "./editor/VideoEditor";

interface FeedbackCardProps {
  feedback: Feedback;
  frame: string;
  onTimestamp: (timestamp: number) => void;
}

export default function FeedbackCard(props: FeedbackCardProps) {
  const { feedback, frame, onTimestamp } = props;

  return (
    <Card>
      <Anchor onClick={(e) => onTimestamp(feedback.timestamp)}>
        @ {feedback.timestamp.toFixed(2)}
      </Anchor>
      <Title order={5}>{feedback.user.username}</Title>
      <Text>{feedback.msg}</Text>
      <VideoEditor />
    </Card>
  );
}
