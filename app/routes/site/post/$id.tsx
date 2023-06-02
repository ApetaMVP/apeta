import {
  AspectRatio,
  Button,
  Card,
  Grid,
  Group,
  MediaQuery,
  ScrollArea,
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
import FeedbackEntry from "~/components/FeedbackEntry";
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
  const [drawing, setIsDrawing] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0.0);
  const [paused, setPaused] = useState(true);
  const [timestamp, setTimestamp] = useState(0.0);
  const [frame, setFrame] = useState("");
  const [img, setImg] = useState("");
  const [progress, setProgress] = useState(0);
  const [highlightedFeedback, setHighlightedFeedback] = useState<Feedback[]>(
    post.feedback ? [post.feedback?.[0]] : [],
  );
  const [hasMarkedImg, setHasMarkedImg] = useState(false);

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

  const onClickTimeline = (f: Feedback[]) => {
    setTimestamp(f[0].timestamp);
    setHighlightedFeedback(f);
  };

  const onSubmit = () => {
    setIsDrawing(false);
    const mostHelpful = post.feedback?.filter((f) => f.mostHelpful);
    setHighlightedFeedback(mostHelpful || []);
  };

  const sortedFeedback =
    [...post.feedback!].sort((a, b) => a.timestamp - b.timestamp) || [];

  return (
    <Grid grow={true} w="100%">
      <Grid.Col span={12} lg={12} order={2} orderLg={3}>
        <MediaQuery
          smallerThan={"lg"}
          styles={{ marginBottom: 20, marginTop: 20 }}
        >
          <VideoProgress
            percentage={progress}
            duration={videoDuration}
            feedback={sortedFeedback}
            onClickTimeline={onClickTimeline}
          />
        </MediaQuery>
      </Grid.Col>
      <Grid.Col span={7} lg={7} order={1} orderLg={1}>
        <Card h="100%">
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
        </Card>
      </Grid.Col>
      <Grid.Col span={5} lg={5} order={3} orderLg={2}>
        <Stack
          h="100%"
          w="100%"
          spacing="md"
          align="flex-end"
          justify="space-between"
        >
          <div style={{ width: "100%" }}>
            {loggedIn && (
              <FeedbackEntry
                timestamp={timestamp}
                img={img}
                onImg={onImg}
                frame={frame}
                isDrawing={drawing}
                hasMarkedImg={hasMarkedImg}
                onPencilClick={() => setIsDrawing(!drawing)}
                onSubmit={onSubmit}
              />
            )}
          </div>

          {highlightedFeedback.length > 0 && !drawing && (
            <div style={{ width: "100%", height: "100%" }}>
              <ScrollArea h={500}>
                <Stack spacing={"md"}>
                  {highlightedFeedback.map((f) => (
                    <FeedbackCard
                      customStyles={{ height: "100%" }}
                      key={f.id}
                      feedback={f}
                      loggedIn={loggedIn}
                      handleTimestamp={onTimestamp}
                    />
                  ))}
                </Stack>
              </ScrollArea>
            </div>
          )}

          {drawing && (
            <div style={{ width: "100%", height: "100%" }}>
              <PhotoEditor
                frame={frame}
                onImg={onImg}
                setHasMarkedImg={setHasMarkedImg}
              />
            </div>
          )}
        </Stack>
      </Grid.Col>
    </Grid>
  );
}
