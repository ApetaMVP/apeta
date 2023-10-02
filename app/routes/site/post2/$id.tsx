import {
  Avatar,
  Box,
  Button,
  Center,
  Container,
  Flex,
  Text,
} from "@mantine/core";
import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  IconHeart,
  IconMessageCircle2,
  IconVolume,
  IconVolumeOff,
} from "@tabler/icons";
import { useMemo, useRef, useState } from "react";
import { getFullPost } from "~/server/post.server";
import { formatPostContent } from "~/utils/helpers";
import type { FullPost } from "~/utils/types";

export const loader = async ({ request, params }: LoaderArgs) => {
  const postId = params.id;
  const post = await getFullPost(postId!);
  return json({ post });
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return {
    charSet: "utf-8",
    title: data.post?.content,
    "og:title": data.post?.content,
    "og:img": data.post?.thumbnailUrl,
    "og:video": data.post?.mediaUrl,
    "og:video:secure_url": data.post?.mediaUrl,
    "og:img:secure_url": data.post?.thumbnailUrl,
    "og:img:width": "500",
    "og:img:height": "500",
  };
};

export default function Post() {
  const data = useLoaderData<typeof loader>();
  const post = data.post as unknown as FullPost;

  const [isMuted, setIsMuted] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  const onVideoClick = () => {
    if (isPaused) {
      videoRef.current?.play();
    } else {
      videoRef.current?.pause();
    }
    setIsPaused(!isPaused);
  };

  return (
    <div
      style={{
        padding: 0,
        width: "100vw",
        height: "100vh",
        overflow: "hidden", // Ensures no overflow from the videos
      }}
    >
      {/* Play/Pause video control */}
      <Box
        pos="absolute"
        top={20}
        left={0}
        w="80%"
        h="60%"
        onClick={onVideoClick}
        style={{
          zIndex: 10,
        }}
      />

      <OverlayedElements
        post={post}
        isPaused={isPaused}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
      />
      {/* Background Blurred Video */}
      <video
        muted
        autoPlay={false}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)", // Centers the video
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "blur(10px)",
          zIndex: 1,
        }}
        src={post.mediaUrl}
      />

      {/* Main Video */}
      <Center w="100%" h="100%" style={{ zIndex: 1 }}>
        <video
          ref={videoRef}
          autoPlay
          loop
          muted={isMuted}
          style={{ maxWidth: "100%", maxHeight: "100%", zIndex: 2 }}
          src={post.mediaUrl}
          controls={false}
          onClick={(e) => e.preventDefault()}
          playsInline
        />
        {isPaused && (
          <svg
            color="white"
            style={{
              zIndex: 100,
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
            xmlns="http://www.w3.org/2000/svg"
            className="icon icon-tabler icon-tabler-player-pause-filled"
            width="100"
            height="100"
            viewBox="0 0 24 24"
            stroke-width="1"
            stroke="currentColor"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path
              d="M9 4h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h2a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2z"
              stroke-width="0"
              fill="currentColor"
            ></path>
            <path
              d="M17 4h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h2a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2z"
              stroke-width="0"
              fill="currentColor"
            ></path>
          </svg>
        )}
      </Center>
    </div>
  );
}

const OverlayedElements = ({
  post,
  isPaused,
  isMuted,
  setIsMuted,
}: {
  post: FullPost;
  isPaused: boolean;
  isMuted: boolean;
  setIsMuted: (isMuted: boolean) => void;
}) => {
  const bgOpacity = useMemo(() => {
    if (isPaused) return "rgba(0,0,0,0.5)";
    return "rgba(0,0,0,0.2)";
  }, [isPaused]);

  return (
    <Flex
      w="100%"
      h="100vh"
      pos="absolute"
      bg={bgOpacity}
      style={{ zIndex: 5 }}
    >
      <Box pos="absolute" bottom={24} left={0} p={2} w="80%">
        <BottomSection
          username={post.author.username}
          description={post.content}
          tags={post.tags}
        />
      </Box>
      <Box pos="absolute" bottom={36} right={24} p={2}>
        <RightSection post={post} isMuted={isMuted} setIsMuted={setIsMuted} />
      </Box>
    </Flex>
  );
};

const BottomSection = ({
  username,
  description,
  tags,
}: {
  username: string;
  description: string;
  tags: string[];
}) => {
  const [showFullDesc, setShowFullDesc] = useState(false);
  const { formattedContent, isLongContent } = formatPostContent(
    description,
    showFullDesc,
  );
  return (
    <Container dir="column">
      <Container dir="column">
        <Text style={{ color: "white", fontSize: "1rem", fontWeight: "bold" }}>
          @ {username}
        </Text>
        <Text style={{ color: "white" }}>{formattedContent}</Text>
        {isLongContent && (
          <Button
            onClick={() => setShowFullDesc((truncated) => !truncated)}
            style={{ color: "blue", fontSize: "0.75rem", fontWeight: "bold" }}
          >
            {showFullDesc ? "Show less" : "Show more"}
          </Button>
        )}
      </Container>
      <Container dir="row">
        {tags?.map((tag: string) => {
          return (
            <Text
              key={tag}
              style={{
                fontSize: "0.75rem",
                color: "lightblue",
                fontWeight: "bold",
              }}
            >
              {tag}
            </Text>
          );
        })}
      </Container>
    </Container>
  );
};

const RightSection = ({
  post,
  isMuted,
  setIsMuted,
}: {
  post: FullPost;
  isMuted: boolean;
  setIsMuted: (isMuted: boolean) => void;
}) => {
  return (
    <Flex gap={12} justify="center" align="center" direction="column">
      {isMuted ? (
        <Button
          style={{ background: "transparent" }}
          onClick={(e) => {
            e.stopPropagation();
            setIsMuted(false);
          }}
        >
          <IconVolumeOff size={24} />
        </Button>
      ) : (
        <Button
          style={{ background: "transparent" }}
          onClick={(e) => {
            e.stopPropagation();
            setIsMuted(true);
          }}
        >
          <IconVolume size={24} />
        </Button>
      )}
      <Avatar mb={12} radius="xl" src={post.author.avatarUrl} size={40} />
      <Flex direction="column" align="center">
        <IconHeart size={32} color="white" />
        <Text color="white">{post.likeCount}</Text>
      </Flex>
      <Flex direction="column" align="center">
        <IconMessageCircle2 size={32} color="white" />
        <Text color="white">{post.feedbackCount}</Text>
      </Flex>
    </Flex>
  );
};
