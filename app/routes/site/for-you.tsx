import { SimpleGrid } from "@mantine/core";
import { ActionArgs, json, LoaderArgs } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import FypPostCard from "~/components/FypPostCard";
import { getUserId } from "~/server/cookie.server";
import { getFypPosts, likePost } from "~/server/post.server";
import { Post } from "~/utils/types";

const BATCH = 20;

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await getUserId(request);
  const { searchParams } = new URL(request.url);
  const start = Number(searchParams.get("start") || "0");
  return json({
    loggedIn: userId ? true : false,
    posts: await getFypPosts(userId as string, start, BATCH),
  });
};

export async function action({ request }: ActionArgs) {
  const userId = await getUserId(request);
  const { postId } = Object.fromEntries((await request.formData()).entries());
  return await likePost(userId!, postId as string);
}

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
      dataLength={page * 3}
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
      <SimpleGrid cols={2} spacing="xs">
        {posts.map((p) => (
          <FypPostCard post={p} loggedIn={data.loggedIn} />
        ))}
      </SimpleGrid>
    </InfiniteScroll>
  );
}
