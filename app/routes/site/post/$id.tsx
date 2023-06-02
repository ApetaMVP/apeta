import {
  AspectRatio,
  Button,
  Card,
  Grid,
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
import TimestampedFeedback from "~/components/TimestampedComments";
import Video from "~/components/ui/Video";
import VideoProgress from "~/components/ui/VideoProgress";
import { getUserId } from "~/server/cookie.server";
import { voteOnFeedback } from "~/server/feedback.server";
import { feedbackOnPost, getFullPost } from "~/server/post.server";
import { Feedback, FullPost } from "~/utils/types";

const feedbackSchema = z.object({
  msg: z.string().nonempty({ message: "Feedback cannot be empty" }),
});

export const loader = async ({ request, params }: LoaderArgs) => {
  const userId = await getUserId(request);
  const postId = params.id;
  const post = await getFullPost(postId!, userId!);
  return json({ post, loggedIn: userId ? true : false });
};

export async function action({ request, params }: ActionArgs) {
  const { feedback, img, timestamp, upVote, downVote } = Object.fromEntries(
    (await request.formData()).entries(),
  );
  const userId = await getUserId(request);
  const postId = params.id;

  if (upVote) {
    return await voteOnFeedback(upVote as string, userId!, "UP");
  }

  if (downVote) {
    return await voteOnFeedback(downVote as string, userId!, "DOWN");
  }

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
  const [videoDuration, setVideoDuration] = useState(0.0);
  const [paused, setPaused] = useState(true);
  const [timestamp, setTimestamp] = useState(0.0);
  const [frame, setFrame] = useState("");
  const [img, setImg] = useState("");
  const [progress, setProgress] = useState(0);
  const [highlightedFeedback, setHighlightedFeedback] = useState<
    Feedback | undefined
  >(post.feedback?.[0]);

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

  const onLoaded = (duration: number) => {
    setVideoLoaded(true);
    setVideoDuration(duration);
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

  const onClickTimeline = (f: Feedback) => {
    setTimestamp(f.timestamp);
    setHighlightedFeedback(f);
  };

  const sortedFeedback =
    [...post.feedback!].sort((a, b) => a.timestamp - b.timestamp) || [];

  const filteredFeedback =
    post.feedback?.filter((f) => f.id !== highlightedFeedback?.id) || [];

  return (
    <Group align="flex-start">
      <TimestampedFeedback
        setTimestamp={onTimestamp}
        feedback={sortedFeedback}
        duration={videoDuration}
      />
      <Stack align="center" spacing="xl">
        <Grid grow={true} w="100%">
          <Grid.Col span={12} lg={12} order={2} orderLg={3}>
            <VideoProgress
              percentage={progress}
              duration={videoDuration}
              feedback={sortedFeedback}
              onClickTimeline={onClickTimeline}
            />
          </Grid.Col>
          <Grid.Col span={6} lg={6} order={1} orderLg={1}>
            <Card>
              <Stack mb="xs">
                <AvatarName
                  name={post.author.username}
                  avatarUrl={post.author.avatarUrl}
                />
                <Text>{post.content}</Text>
                <Group>
                  {post.tags.map((t) => (
                    <Text key={t} fw={700} style={{ cursor: "default" }}>
                      <Text truncate>{t}</Text>
                    </Text>
                  ))}
                </Group>
              </Stack>
              {!writingFeedback && (
                <Card.Section>
                  <AspectRatio ratio={16 / 9}>
                    <Video
                      src={post.mediaUrl}
                      timestamp={timestamp}
                      onLoaded={onLoaded}
                      onTimestamp={onTimestamp}
                      onFrame={onFrame}
                      onPause={() => setPaused(true)}
                      onPlay={() => setPaused(false)}
                      onProgress={setProgress}
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
                    <TextInput
                      name="timestamp"
                      value={timestamp}
                      type="hidden"
                    />
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
          </Grid.Col>
          <Grid.Col span={6} lg={6} order={3} orderLg={2}>
            {highlightedFeedback && (
              <FeedbackCard
                customStyles={{ height: "100%" }}
                feedback={highlightedFeedback}
                loggedIn={loggedIn}
                handleTimestamp={onTimestamp}
              />
            )}
          </Grid.Col>
        </Grid>

        <SimpleGrid cols={1} spacing="xl">
          {filteredFeedback.map((f) => (
            <FeedbackCard
              key={f.id}
              feedback={f}
              loggedIn={loggedIn}
              handleTimestamp={onTimestamp}
            />
          ))}
        </SimpleGrid>
      </Stack>
    </Group>
  );
}
