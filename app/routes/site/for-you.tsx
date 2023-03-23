import { Center, Stack } from "@mantine/core";
import { json, LoaderArgs } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import PostCard from "~/components/PostCard";
import { getPosts } from "~/server/post";
import { Post } from "~/utils/types";

const BATCH = 4;

export const loader = async ({ request }: LoaderArgs) => {
  const { searchParams } = new URL(request.url);
  const start = Number(searchParams.get("start") || "0");
  return json({ posts: await getPosts(start, BATCH) });
};

export default function ForYou() {
  const data = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const [posts, setPosts] = useState<Post[]>(data.posts as unknown as Post[]);
  const [page, setPage] = useState(0);
  const [end, setEnd] = useState(false);

  const getPosts = async () => {
    fetcher.load(`/site/for-you?start=${page + BATCH}`);
    setPage(page + BATCH);
    if (fetcher.data) {
      setPosts((prevPosts) => [...prevPosts, ...fetcher.data.posts]);
      const newPosts = [...posts, ...fetcher.data.posts];
      if (posts.length === newPosts.length) {
        setEnd(true);
      } else {
        setEnd(false);
      }
    }
  };

  return (
    <InfiniteScroll
      dataLength={posts.length}
      next={getPosts}
      hasMore={!end}
      loader={""}
      endMessage={
        <h3 style={{ textAlign: "center" }}>
          No more posts for now. Come back later!
        </h3>
      }
      refreshFunction={getPosts}
      pullDownToRefresh
      pullDownToRefreshThreshold={20}
      pullDownToRefreshContent={
        <h3 style={{ textAlign: "center" }}>&#8595; Pull down to refresh</h3>
      }
      releaseToRefreshContent={
        <h3 style={{ textAlign: "center" }}>&#8593; Release to refresh</h3>
      }
    >
      <Stack>
        {posts.map((p) => (
          <Center key={p.id}>
            <PostCard post={p} />
          </Center>
        ))}
      </Stack>
    </InfiniteScroll>
  );
}
