import { Anchor, Chip, Group } from "@mantine/core";
import { Feedback } from "~/utils/types";

interface FeedbackChipProps {
  feedback: Feedback;
  frame: string;
  onTimestamp: (timestamp: number) => void;
}

export default function FeedbackChip(props: FeedbackChipProps) {
  const { feedback, frame, onTimestamp } = props;

  return (
    <Chip
      checked={false}
      onClick={(e) => onTimestamp(feedback.timestamp)}
      {...props}
    >
      <Group>
        {/* <Title order={5}>{feedback.user.username}</Title> */}
        <Anchor>@ {feedback.timestamp.toFixed(2)}</Anchor>
      </Group>
    </Chip>
  );
}
