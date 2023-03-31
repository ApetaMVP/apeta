import {
  AspectRatio,
  Button,
  Card,
  Group,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { ActionArgs, json, LoaderArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { useState } from "react";

import { z } from "zod";
import AvatarName from "~/components/AvatarName";
import PhotoEditor from "~/components/editor/PhotoEditor";
import FeedbackCard from "~/components/FeedbackCard";
import Video from "~/components/ui/Video";
import { getUserId } from "~/server/cookie.server";
import { feedbackOnPost, getFullPost } from "~/server/post.server";
import { FullPost } from "~/utils/types";

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
  const { feedback, img, timestamp } = Object.fromEntries(
    (await request.formData()).entries(),
  );
  const userId = await getUserId(request);
  const postId = params.id;
  return await feedbackOnPost(
    userId!,
    postId!,
    feedback as string,
    Number(timestamp),
    img as string,
  );
}

export default function Post() {
  const data = useLoaderData<typeof loader>();
  const post = data.post as unknown as FullPost;
  const loggedIn = data.loggedIn;

  const [writingFeedback, setWritingFeedback] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [paused, setPaused] = useState(true);
  const [timestamp, setTimestamp] = useState(0.0);
  const [frame, setFrame] = useState("");
  const [img, setImg] = useState("");

  const feedbackForm = useForm({
    validate: zodResolver(feedbackSchema),
    initialValues: {
      msg: "",
    },
  });

  const optimisticClear = () => {
    feedbackForm.setValues({ msg: "" });
    feedbackForm.reset();
    setWritingFeedback(false);
  };

  const onLoaded = () => {
    setVideoLoaded(true);
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
    <Stack align="center" spacing="xl">
      <Card w="75%">
        <Stack>
          <AvatarName
            name={post.author.username}
            avatarUrl={post.author.avatarUrl}
          />
          <Text>{post.content}</Text>
        </Stack>
        {!writingFeedback && (
          <Card.Section mt="xs">
            <AspectRatio ratio={16 / 9}>
              <Video
                src={post.mediaUrl}
                timestamp={timestamp}
                onLoaded={onLoaded}
                onTimestamp={onTimestamp}
                onFrame={onFrame}
                onPause={() => setPaused(true)}
                onPlay={() => setPaused(false)}
              />
            </AspectRatio>
          </Card.Section>
        )}
        {writingFeedback && (
          <>
            <Card.Section>
              <PhotoEditor frame={frame} onImg={onImg} />
            </Card.Section>
            <Form method="post" onSubmit={optimisticClear}>
              <Textarea
                name="feedback"
                label="Feedback"
                {...feedbackForm.getInputProps("msg")}
              />
              <TextInput name="timestamp" value={timestamp} type="hidden" />
              <TextInput name="img" value={img} type="hidden" />
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
            </Form>
          </>
        )}
        {loggedIn && !writingFeedback && (
          <Stack mt="xs">
            <Button
              onClick={(_e) => setWritingFeedback(!writingFeedback)}
              disabled={!videoLoaded}
            >
              Draw Feedback
            </Button>
          </Stack>
        )}
      </Card>
      <SimpleGrid cols={3} spacing="xs">
        {post.feedback?.map((f) => (
          <FeedbackCard
            key={f.id}
            feedback={f}
            loggedIn={loggedIn}
            handleTimestamp={onTimestamp}
          />
        ))}
      </SimpleGrid>
    </Stack>
  );
}
