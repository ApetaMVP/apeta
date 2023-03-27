import {
  Accordion,
  Anchor,
  AspectRatio,
  Box,
  Button,
  Card,
  Divider,
  Group,
  Image,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { ActionArgs, json, LoaderArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { useState } from "react";

import { z } from "zod";
import CommentBubble from "~/components/CommentBubble";
import PhotoEditor from "~/components/editor/PhotoEditor";
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
  const { target, comment, feedback, img, timestamp } = Object.fromEntries(
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
      Number(timestamp),
      img as string
    );
  } else {
    return null;
  }
}

export default function Post() {
  const data = useLoaderData<typeof loader>();
  const post = data.post as unknown as FullPost;
  const loggedIn = data.loggedIn;

  const [writingFeedback, setWritingFeedback] = useState(false);
  const [comment, setComment] = useState("");
  const [paused, setPaused] = useState(true);
  const [timestamp, setTimestamp] = useState(0.0);
  const [frame, setFrame] = useState("");
  const [img, setImg] = useState("");

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
    setWritingFeedback(false);
  };

  const onTimestamp = (t: number) => {
    setTimestamp(t);
  };

  const onFrame = (f: string) => {
    setFrame(f);
  };

  const onImg = (i: string) => {
    setImg(i);
  };

  return (
    <Group position="apart" align="start">
      <Card w="66%">
        {!writingFeedback && (
          <Card.Section>
            <AspectRatio ratio={16 / 9}>
              <Video
                src={post.mediaUrl}
                timestamp={timestamp}
                onTimestamp={onTimestamp}
                onFrame={onFrame}
                onPause={() => setPaused(true)}
                onPlay={() => setPaused(false)}
              />
            </AspectRatio>
          </Card.Section>
        )}
        {writingFeedback && (
          <Card.Section>
            <PhotoEditor frame={frame} onImg={onImg} />
            <Form method="post" onSubmit={optimisticFeedbackClear}>
              <Box mx="md">
                <Textarea
                  name="feedback"
                  label="Feedback"
                  {...feedbackForm.getInputProps("msg")}
                />
                <TextInput name="timestamp" value={timestamp} type="hidden" />
                <TextInput name="img" value={img} type="hidden" />
                <TextInput name="target" value="feedback" type="hidden" />
                <Group mt="sm" grow>
                  <Button
                    variant="default"
                    onClick={(e) => setWritingFeedback(false)}
                  >
                    Discard
                  </Button>
                  <Button type="submit" disabled={!feedbackForm.isValid()}>
                    Submit Feedback
                  </Button>
                </Group>
              </Box>
            </Form>
          </Card.Section>
        )}
        <Stack mt="xs">
          {!writingFeedback && (
            <Button onClick={(e) => setWritingFeedback(!writingFeedback)}>
              Draw Feedback
            </Button>
          )}
          <Title order={3}>{post.author.username}</Title>
          <Text>{post.caption}</Text>
        </Stack>
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
      <Card w="30%">
        <Stack>
          <Title order={5}>Timestamped Comments</Title>
          <Accordion defaultValue="Timestamped Comments">
            {post.feedback?.map((f) => (
              <Accordion.Item
                key={f.id}
                value={f.id}
                onClick={(e) => onTimestamp(f.timestamp)}
              >
                <Accordion.Control>
                  <Anchor>@{f.timestamp.toFixed(2)}</Anchor>
                </Accordion.Control>
                <Accordion.Panel>
                  <Card withBorder={false} shadow="false">
                    <Card.Section>
                      <Image src={f.img} />
                    </Card.Section>
                  </Card>
                  <Text>{f.msg}</Text>
                </Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion>
        </Stack>
      </Card>
    </Group>
  );
}
