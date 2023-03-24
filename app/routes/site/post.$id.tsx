import {
  ActionIcon,
  AspectRatio,
  Box,
  Button,
  Card,
  Center,
  Divider,
  Grid,
  Group,
  Paper,
  Stack,
  Text,
  Textarea,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { ActionArgs, json, LoaderArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { IconHeart } from "@tabler/icons";
import { z } from "zod";
import { getUserId } from "~/server/cookie";
import { commentOnPost, getFullPost } from "~/server/post";
import { timeAgo } from "~/utils/time";
import { FullPost } from "~/utils/types";

const schema = z.object({
  comment: z.string().nonempty({ message: "Comment cannot be empty" }),
});

export const loader = async ({ request, params }: LoaderArgs) => {
  const postId = params.id;
  const post = await getFullPost(postId!);
  return json({ post });
};

export async function action({ request, params }: ActionArgs) {
  const { comment } = Object.fromEntries((await request.formData()).entries());
  const userId = await getUserId(request);
  const postId = params.id;
  return await commentOnPost(userId!, postId!, comment as string);
}

export default function Post() {
  const data = useLoaderData<typeof loader>();
  const post = data.post as unknown as FullPost;

  const form = useForm({
    validate: zodResolver(schema),
    initialValues: {
      comment: "",
    },
  });

  const optimisticClear = () => {
    form.reset();
  };

  return (
    <Center>
      <Card w="50%">
        <Card.Section>
          <AspectRatio ratio={16 / 9}>
            <video controls src={post.mediaUrl}></video>
          </AspectRatio>
        </Card.Section>
        <Grid p="md">
          <Grid.Col span={9}>
            <Title order={3}>{post.author.username}</Title>
            <Text>{post.caption}</Text>
          </Grid.Col>
          <Grid.Col span={3}>
            <Stack align="end">
              <Box>
                <ActionIcon type="submit" name="postId" value={post.id}>
                  <IconHeart color="red" fill={post.iLiked ? "red" : "white"} />
                </ActionIcon>
                <Center>
                  <Text fz="sm" c="gray">
                    {post.likeCount}
                  </Text>
                </Center>
              </Box>
            </Stack>
          </Grid.Col>
        </Grid>
        <Divider my="sm" />
        <Stack>
          <Title order={5}>Comments</Title>
          {post.comments?.map((c) => (
            <Paper bg={useMantineTheme().colors.gray[0]} radius="md" p="sm">
              <Stack>
                <Group>
                  <Text fw={700}>{c.user.username}</Text>
                  <Text c="dimmed" fz="sm">
                    {timeAgo.format(new Date(c.createdAt))}
                  </Text>
                </Group>
                <Text>{c.content}</Text>
              </Stack>
            </Paper>
          ))}
          <Form method="post" onSubmit={optimisticClear}>
            <Textarea
              name="comment"
              {...form.getInputProps("comment")}
              minRows={4}
              mb="xs"
            />
            <Button type="submit" fullWidth disabled={!form.isValid()}>
              Submit Comment
            </Button>
          </Form>
        </Stack>
      </Card>
    </Center>
  );
}
