import { SimpleGrid, Grid, Stack, TextInput, Group, Flex, Container, Center, Space } from "@mantine/core";
import { ActionArgs, json, LoaderArgs } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { IconSearch } from "@tabler/icons";
import { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import FypPostCard from "~/components/FypPostCard";
import { getUserId } from "~/server/cookie.server";
import { getPosts, likePost } from "~/server/post.server";
import sanitizedSearch from "~/utils/helpers";
import { Post } from "~/utils/types";
import ReputationCard from "~/components/ux/ReputationCard";

const BATCH = 20;

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await getUserId(request);
  const { searchParams } = new URL(request.url);
  const start = Number(searchParams.get("start") || "0");
  const searchTerm = searchParams.get("searchTerm") || undefined;
  return json({
    loggedIn: userId ? true : false,
    posts: await getPosts(userId as string, start, BATCH, searchTerm),
    searchTerm,
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
  const [searchTerm, setSearchTerm] = useState(data.searchTerm);
  const [posts, setPosts] = useState<Post[]>(data.posts as unknown as Post[]);
  const [page, setPage] = useState(0);
  const [end, setEnd] = useState(false);

  const getPosts = async () => {
    let url = `/site/for-you?start=${page + BATCH}`;
    if (searchTerm) {
      url += `&searchTerm=${sanitizedSearch(searchTerm)}`;
    }
    fetcher.load(url);
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

  const onSearchChange = async (st: string) => {
    setSearchTerm(st);
  };

  const onSearchEnter = async (e: any) => {
    if (e.key === "Enter") {
      window.location.href = `/site/for-you?&searchTerm=${searchTerm}`;
    }
  };

  return (
    <Grid grow justify="center" gutter="lg">
    <Group mb="xs">
      

      {/* <Group align="center">
      <Stack align="center">

      
      <Container size="sm" px="sm">
      <Flex justify="center"
      align="center"
      wrap="wrap-reverse">
      


      <TextInput
        label="Search"
        value={searchTerm}
        icon={<IconSearch />}
        onChange={(e) => onSearchChange(e.target.value)}
        onKeyDown={onSearchEnter}
        autoFocus={searchTerm ? true : false}
      />
      
      </Flex>
      </Container>
      </Stack>
      </Group> */}
    {/* <Stack px="md"> */}
    <Grid.Col span={9}>
      <InfiniteScroll
      
        dataLength={page * 1}
        next={getPosts}
        hasMore={!end}
        loader={""}
        endMessage={
          <h3 style={{ textAlign: "center" }}>
            No more posts for now. Come back later!
          </h3>
        }
        refreshFunction={getPosts}
        // pullDownToRefresh
        // pullDownToRefreshThreshold={20}
        // pullDownToRefreshContent={
        //   <h3 style={{ textAlign: "center" }}>&#8595; Pull down to refresh</h3>
        // }
        // releaseToRefreshContent={
        //   <h3 style={{ textAlign: "center" }}>&#8593; Release to refresh</h3>
        // }
      >
        
      
          {posts.map((p) => (
            <FypPostCard key={p.id} post={p} loggedIn={data.loggedIn} />
            
          ))}
        
      </InfiniteScroll>
      {/* <Center>
      <ReputationCard
    
      />
      </Center> */}
      </Grid.Col>
      <Grid.Col>
      <TextInput
        label="Search"
        value={searchTerm}
        icon={<IconSearch />}
        onChange={(e) => onSearchChange(e.target.value)}
        onKeyDown={onSearchEnter}
        autoFocus={searchTerm ? true : false}
      />
      </Grid.Col>
    {/* </Stack> */}
    </Group>
    </Grid>
  );
}
