import {
  AspectRatio,
  Card,
  Grid,
  Group,
  MediaQuery,
  Stack,
  Text,
} from "@mantine/core";
import { ActionArgs, json, LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { memo, useState } from "react";
import { z } from "zod";
import AvatarName from "~/components/AvatarName";
import PhotoEditor from "~/components/editor/PhotoEditor";

import FeedbackCardList from "~/components/FeedbackCardList";
import FeedbackEntry from "~/components/FeedbackEntry";
import Video from "~/components/ui/Video";
import VideoProgress from "~/components/ui/VideoProgress";
import { voteOnComment } from "~/server/comment.server";
import { getUserId } from "~/server/cookie.server";
import { voteOnFeedback } from "~/server/feedback.server";
import {
  commentOnFeedback,
  feedbackOnPost,
  getFullPost,
} from "~/server/post.server";
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
  const {
    feedback,
    feedbackId,
    img,
    comment,
    timestamp,
    upVote,
    downVote,
    _action,
  } = Object.fromEntries((await request.formData()).entries());
  const userId = await getUserId(request);
  const postId = params.id;

  if (_action === "COMMENT_VOTE") {
    if (upVote) {
      return await voteOnComment(upVote as string, userId!, "UP");
    }

    if (downVote) {
      return await voteOnComment(downVote as string, userId!, "DOWN");
    }
  }

  if (_action === "FEEDBACK_VOTE") {
    if (upVote) {
      return await voteOnFeedback(upVote as string, userId!, "UP");
    }

    if (downVote) {
      return await voteOnFeedback(downVote as string, userId!, "DOWN");
    }
  }

  if (_action === "COMMENT_REPLY") {
    return await commentOnFeedback(
      userId!,
      feedbackId as string,
      comment as string,
    );
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

  const [drawing, setIsDrawing] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0.0);
  const [timestamp, setTimestamp] = useState(0.0);
  const [frame, setFrame] = useState("");
  const [img, setImg] = useState("");
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [highlightedFeedback, setHighlightedFeedback] = useState<Feedback[]>(
    [],
  );
  const [hasMarkedImg, setHasMarkedImg] = useState(false);

  const onLoaded = (duration: number) => {
    console.log("loaded");
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
    setPaused(true);
  };

  const onSubmit = () => {
    setIsDrawing(false);
  };

  const sortedFeedback =
    [...post.feedback!].sort((a, b) => a.timestamp - b.timestamp) || [];

  return (
    <Grid grow={true} w="100%">
      {/* timeline */}
      <Grid.Col lg={12} xl={12} order={2} orderLg={3}>
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
      {/* video */}
      <Grid.Col lg={7} xl={7} order={1} orderLg={1}>
        {drawing && (
          <div style={{ width: "100%", height: "100%" }}>
            <PhotoEditor
              frame={frame}
              onImg={onImg}
              setHasMarkedImg={setHasMarkedImg}
            />
          </div>
        )}

        <Card h="100%" style={{ display: drawing ? "none" : "block" }}>
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
                paused={paused}
                timestamp={timestamp}
                loaded={videoLoaded}
                onLoaded={onLoaded}
                onTimestamp={onTimestamp}
                onFrame={onFrame}
                onProgress={setProgress}
              />
            </AspectRatio>
          </Card.Section>
        </Card>
      </Grid.Col>
      {/* comments/ new comment */}
      <Grid.Col lg={5} xl={5} order={3} orderLg={2}>
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
                isDrawing={drawing}
                hasMarkedImg={hasMarkedImg}
                onPencilClick={() => {
                  setIsDrawing(!drawing);
                  setPaused(true);
                }}
                onSubmit={onSubmit}
              />
            )}
          </div>

          {post.feedback?.length && (
            <div style={{ width: "100%", height: "100%" }}>
              <FeedbackCardList
                post={post}
                feedback={sortedFeedback}
                onTimestamp={onTimestamp}
                loggedIn={loggedIn}
                highlightedFeedback={highlightedFeedback}
              />
            </div>
          )}
        </Stack>
      </Grid.Col>
    </Grid>
  );
}
