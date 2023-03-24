import {
  ActionIcon,
  AspectRatio,
  Card,
  Center,
  Grid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { Form } from "@remix-run/react";
import { IconHeart, IconMessage } from "@tabler/icons";
import { FypPost } from "~/utils/types";

interface PostCardProps {
  post: FypPost;
  loggedIn: boolean;
}

export default function PostCard(props: PostCardProps) {
  const { post, loggedIn } = props;
  const optimisticUpdate = async () => {
    if (!post.iLiked) {
      post.iLiked = true;
      post.likeCount++;
    } else {
      post.iLiked = false;
      post.likeCount--;
    }
  };

  return (
    <Card w="50%">
      <Card.Section>
        <AspectRatio ratio={16 / 9}>
          <video controls src={post.mediaUrl}></video>
        </AspectRatio>
      </Card.Section>
      <Grid p="md">
        <Grid.Col span={9}>
          <Title order={3}>{post.author.username}</Title>
          <Text>{props.post.caption}</Text>
        </Grid.Col>
        <Grid.Col span={3}>
          <Stack align="end">
            {loggedIn && (
              <Form
                method="post"
                action="/site/for-you"
                onClick={optimisticUpdate}
              >
                <ActionIcon type="submit" name="postId" value={post.id}>
                  <IconHeart color="red" fill={post.iLiked ? "red" : "white"} />
                </ActionIcon>
                <Center>
                  <Text fz="sm" c="gray">
                    {post.likeCount}
                  </Text>
                </Center>
                <ActionIcon>
                  <IconMessage color="black" />
                </ActionIcon>
              </Form>
            )}
            {!loggedIn && (
              <Form>
                <ActionIcon disabled>
                  <IconHeart />
                </ActionIcon>
                <Center>
                  <Text fz="sm" c="gray">
                    {post.likeCount}
                  </Text>
                </Center>
                <ActionIcon disabled>
                  <IconMessage />
                </ActionIcon>
              </Form>
            )}
          </Stack>
        </Grid.Col>
      </Grid>
    </Card>
  );
}
