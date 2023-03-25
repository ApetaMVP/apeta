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
  Overlay,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { ActionArgs, json, LoaderArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { IconHeart } from "@tabler/icons";
import { useState } from "react";

import { z } from "zod";
import CommentBubble from "~/components/CommentBubble";
import FeedbackCard from "~/components/FeedbackCard";
import TextEditor from "~/components/ui/TextEditor";
import Video from "~/components/ui/Video";
import { getUserId } from "~/server/cookie";
import { commentOnPost, getFullPost, leaveFeedbackOnPost } from "~/server/post";
import { FullPost } from "~/utils/types";

const commentSchema = z.object({
  comment: z.string().nonempty({ message: "Comment cannot be empty" }),
});

const feedbackSchema = z.object({
  msg: z.string().nonempty({ message: "Feedback cannot be empty" }),
});

export const loader = async ({ request, params }: LoaderArgs) => {
  const userId = await getUserId(request);
  const postId = params.id;
  const post = await getFullPost(postId!);
  return json({ post, loggedIn: userId ? true : false });
};

export async function action({ request, params }: ActionArgs) {
  const { target, comment, feedback, timestamp } = Object.fromEntries(
    (await request.formData()).entries()
  );
  const userId = await getUserId(request);
  const postId = params.id;
  if (target === "comment") {
    return await commentOnPost(userId!, postId!, comment as string);
  } else if (target === "feedback") {
    return await leaveFeedbackOnPost(
      userId!,
      postId!,
      feedback as string,
      Number(timestamp)
    );
  } else {
    return null;
  }
}

export default function Post() {
  const data = useLoaderData<typeof loader>();
  const post = data.post as unknown as FullPost;
  const loggedIn = data.loggedIn;
  const [timestamp, setTimestamp] = useState(0.0);
  const [paused, setPaused] = useState(true);
  const [comment, setComment] = useState("");

  const commentForm = useForm({
    validate: zodResolver(commentSchema),
    initialValues: {
      comment: "",
    },
  });

  const feedbackForm = useForm({
    validate: zodResolver(feedbackSchema),
    initialValues: {
      msg: "",
    },
  });

  const handleCommentChange = (c: string) => {
    setComment(c);
    commentForm.setValues({ comment: c });
  };

  const optimisticCommentClear = () => {
    setComment("");
    commentForm.setValues({ comment: "" });
    commentForm.reset();
  };

  const optimisticFeedbackClear = () => {
    feedbackForm.setValues({ msg: "" });
    feedbackForm.reset();
  };

  const onTimestamp = (t: number) => {
    setTimestamp(t);
  };

  const onPause = () => {
    setPaused(true);
  };

  const onPlay = () => {
    setPaused(false);
  };

  return (
    <Group position="apart" align="start" grow>
      <Card>
        <Card.Section>
          <AspectRatio ratio={16 / 9}>
            <Video
              src={post.mediaUrl}
              timestamp={timestamp}
              onTimestamp={onTimestamp}
              onPause={onPause}
              onPlay={onPlay}
            />
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
            <CommentBubble comment={c} key={c.id} />
          ))}
          {loggedIn && (
            <Form method="post" onSubmit={optimisticCommentClear}>
              <TextEditor
                comment={comment}
                handleChange={handleCommentChange}
              />
              <TextInput
                name="comment"
                {...commentForm.getInputProps("comment")}
                type="hidden"
              />
              <TextInput name="target" value="comment" type="hidden" />
              <Button
                type="submit"
                disabled={!commentForm.isValid()}
                fullWidth
                mt="md"
              >
                Submit Comment
              </Button>
            </Form>
          )}
        </Stack>
      </Card>
      <Box>
        {loggedIn && (
          <Card mb="sm">
            <Form method="post" onSubmit={optimisticFeedbackClear}>
              <Textarea
                name="feedback"
                label="Feedback"
                {...feedbackForm.getInputProps("msg")}
              />
              {!paused && <Overlay></Overlay>}
              <TextInput name="timestamp" value={timestamp} type="hidden" />
              <TextInput name="target" value="feedback" type="hidden" />
              <Button
                type="submit"
                disabled={!feedbackForm.isValid()}
                fullWidth
                mt="md"
              >
                Submit Feedback
              </Button>
            </Form>
          </Card>
        )}
        <Stack>
          {post.feedback?.map((f) => (
            <FeedbackCard key={f.id} feedback={f} onTimestamp={onTimestamp} />
          ))}
        </Stack>
      </Box>
    </Group>
  );
}
