import {
  ActionIcon,
  AspectRatio,
  Box,
  Card,
  Center,
  Group,
  Stack,
  Text,
} from "@mantine/core";
import { Form } from "@remix-run/react";
import { IconHeart, IconMessage } from "@tabler/icons";
import { FypPost } from "~/utils/types";
import AvatarName from "./AvatarName";

interface FypPostCardProps {
  post: FypPost;
  loggedIn: boolean;
}

export default function FypPostCard(props: FypPostCardProps) {
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
    <Group w="100%" noWrap position="center">
      <Card w="80%">
        <Card.Section>
          <AspectRatio ratio={16 / 9}>
            <video controls src={post.mediaUrl} />
          </AspectRatio>
        </Card.Section>
        <Group mt="xs">
          <AvatarName
            name={post.author.username}
            avatarUrl={post.author.avatarUrl}
          />
          <Text>{post.content}</Text>
        </Group>
      </Card>
      <Stack align="end">
        {loggedIn && (
          <Box>
            <Form
              method="post"
              action="/site/for-you"
              onClick={optimisticUpdate}
            >
              <ActionIcon type="submit" name="postId" value={post.id}>
                <IconHeart color="red" fill={post.iLiked ? "red" : "white"} />
              </ActionIcon>
            </Form>
            <Center>
              <Text fz="sm" c="gray">
                {post.likeCount}
              </Text>
            </Center>
            <Form method="get" action={`/site/post/${post.id}`}>
              <ActionIcon type="submit">
                <IconMessage color="black" />
              </ActionIcon>
              <Center>
                <Text fz="sm" c="gray">
                  {post.feedbackCount}
                </Text>
              </Center>
            </Form>
          </Box>
        )}
        {!loggedIn && (
          <Box>
            <ActionIcon disabled>
              <IconHeart />
            </ActionIcon>
            <Center>
              <Text fz="sm" c="gray">
                {post.likeCount}
              </Text>
            </Center>
            <Form method="get" action={`/site/post/${post.id}`}>
              <ActionIcon type="submit">
                <IconMessage color="black" />
              </ActionIcon>
              <Center>
                <Text fz="sm" c="gray">
                  {post.feedbackCount}
                </Text>
              </Center>
            </Form>
          </Box>
        )}
      </Stack>
    </Group>
  );
}
