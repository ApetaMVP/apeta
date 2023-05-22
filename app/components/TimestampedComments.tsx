import { Badge, Card, Group, Stack, Text } from "@mantine/core";
import { FullPost } from "~/utils/types";

export default function TimestampedFeedback({
  post,
  duration,
}: {
  post: FullPost;
  duration: number;
}) {
  return (
    <Stack spacing="md">
      <Card>
        <Text>Timestamped Comments</Text>
        <Stack spacing="xs">
          {post.feedback?.map((f) => (
            <Badge key={f.id}>
              <Group spacing={"xs"}>
                <Text>{formatSeconds(f.timestamp)}</Text>/
                <Text>{formatSeconds(duration)}</Text>
              </Group>
            </Badge>
          ))}
        </Stack>
      </Card>
    </Stack>
  );
}

function formatSeconds(seconds: number) {
  var date = new Date(1970, 0, 1);
  date.setSeconds(seconds);
  return date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
}
