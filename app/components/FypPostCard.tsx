import {
  ActionIcon,
  AspectRatio,
  Box,
  Card,
  Center,
  Grid,
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
    <Card w="50%">
      <Card.Section>
        <AspectRatio ratio={16 / 9}>
          <video controls src={post.mediaUrl}></video>
        </AspectRatio>
      </Card.Section>
      <Grid p="md">
        <Grid.Col span={9}>
          <AvatarName
            name={post.author.username}
            avatarUrl={post.author.avatarUrl}
          />
          <Text>{post.caption}</Text>
        </Grid.Col>
        <Grid.Col span={3}>
          <Stack align="end">
            {loggedIn && (
              <Box>
                <Form
                  method="post"
                  action="/site/for-you"
                  onClick={optimisticUpdate}
                >
                  <ActionIcon type="submit" name="postId" value={post.id}>
                    <IconHeart
                      color="red"
                      fill={post.iLiked ? "red" : "white"}
                    />
                  </ActionIcon>
                </Form>
                <Center>
                  <Text fz="sm" c="gray">
                    {post.likeCount}
                  </Text>
                </Center>
                <Form
                  method="get"
                  action={`/site/post/${post.id}`}
                  onClick={optimisticUpdate}
                >
                  <ActionIcon type="submit">
                    <IconMessage color="black" />
                  </ActionIcon>
                  <Center>
                    <Text fz="sm" c="gray">
                      {post.commentCount}
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
                <Form
                  method="get"
                  action={`/site/post/${post.id}`}
                  onClick={optimisticUpdate}
                >
                  <ActionIcon type="submit">
                    <IconMessage color="black" />
                  </ActionIcon>
                  <Center>
                    <Text fz="sm" c="gray">
                      {post.commentCount}
                    </Text>
                  </Center>
                </Form>
              </Box>
            )}
          </Stack>
        </Grid.Col>
      </Grid>
    </Card>
  );
}
