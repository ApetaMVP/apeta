import { Badge, Card, Group, ScrollArea, Stack, Text } from "@mantine/core";
import { Feedback, FullPost } from "~/utils/types";

export default function TimestampedFeedback({
  feedback,
  duration,
  setTimestamp,
}: {
  feedback: Feedback[];
  duration: number;
  setTimestamp: (timestamp: number) => void;
}) {
  const handleClick = (timestamp: number) => () => setTimestamp(timestamp);

  return (
    <Stack spacing="md">
      <Card>
        <Text fw="bold" ta="center">Timestamped Comments</Text>
        <ScrollArea h={100}>
          <Stack spacing="xs">
            {feedback?.map((f) => (
              <Badge
                key={f.id}
                style={{ cursor: "pointer" }}
                onClick={handleClick(f.timestamp)}
              >
                <Group spacing={"xs"}>
                  <Text>{formatSeconds(f.timestamp)}</Text>/
                  <Text>{formatSeconds(duration)}</Text>
                </Group>
              </Badge>
            ))}
          </Stack>
        </ScrollArea>
      </Card>
    </Stack>
  );
}

function formatSeconds(seconds: number) {
  var date = new Date(1970, 0, 1);
  date.setSeconds(seconds);
  return date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
}
