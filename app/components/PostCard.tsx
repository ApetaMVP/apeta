import { AspectRatio, Card, Grid, Stack, Text, Title } from "@mantine/core";
import { Post, User } from "@prisma/client";
import { IconHeart, IconMessage } from "@tabler/icons";

interface PostCardProps {
  post: Post & { author: User };
}

export default function PostCard(props: PostCardProps) {
  return (
    <Card w="50%">
      <Card.Section>
        <AspectRatio ratio={16 / 9}>
          <video controls src={props.post.mediaUrl}></video>
        </AspectRatio>
      </Card.Section>
      <Grid p="md">
        <Grid.Col span={9}>
          <Title order={3}>{props.post.author.username}</Title>
          <Text>{props.post.caption}</Text>
        </Grid.Col>
        <Grid.Col span={3}>
          <Stack align="end">
            <IconHeart />
            <IconMessage />
          </Stack>
        </Grid.Col>
      </Grid>
    </Card>
  );
}
