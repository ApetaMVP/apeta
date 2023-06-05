import { SimpleGrid, Stack, TextInput, Group, Flex, Container } from "@mantine/core";
import { ActionArgs, json, LoaderArgs } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { IconSearch } from "@tabler/icons";
import { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
// import FypPostCard from "~/components/FypPostCard";
import FollowingCard from "~/components/FollowingCard";
import { getUserId } from "~/server/cookie.server";
import { getPosts, likePost } from "~/server/post.server";
import {getUser} from "~/server/user.server";
import sanitizedSearch from "~/utils/helpers";
import { Post, User } from "~/utils/types";


const BATCH = 20;

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await getUserId(request);
  const { searchParams } = new URL(request.url);
  const start = Number(searchParams.get("start") || "0");
  const searchTerm = searchParams.get("searchTerm") || undefined;
  return json({
    loggedIn: userId ? true : false,
    // posts: await getPosts(userId as string, start, BATCH, searchTerm),
    user: await getUser(userId as string,),
    searchTerm,
  });
};

export async function action({ request }: ActionArgs) {
    const userId = await getUserId(request);
    const { postId } = Object.fromEntries((await request.formData()).entries());
    return await likePost(userId!, postId as string);
  }
  
  export default function Following() {
    const data = useLoaderData<typeof loader>();
    const fetcher = useFetcher();
    const [searchTerm, setSearchTerm] = useState(data.searchTerm);
    // const [posts, setPosts] = useState<Post[]>(data.posts as unknown as Post[]);
    const [page, setPage] = useState(0);
    const [user, setUser] = useState<User[]>(data.user as unknown as User[]);
    const [end, setEnd] = useState(false);
  
    const getUsers = async () => {
      let url = `/site/following?start=${page + BATCH}`;
      if (searchTerm) {
        url += `&searchTerm=${sanitizedSearch(searchTerm)}`;
      }
      fetcher.load(url);
      setPage(page + BATCH);
      if (fetcher.data) {
        setUser((prevUser) => [...prevUser, ...fetcher.data.User]);
        // const newUser = [...User, ...fetcher.data.User];
        // if (User.length === newUser.length) {
        //   setEnd(true);
        // } else {
        //   setEnd(false);
        // }
      }
    };

    return (
      <Group>
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
      <Stack px="md">
        
        <InfiniteScroll
        
          dataLength={page * 1}
          next={getUsers}
          hasMore={!end}
          loader={""}
          endMessage={
            <h3 style={{ textAlign: "center" }}>
              No more posts for now. Come back later!
            </h3>
          }
          refreshFunction={getUsers}
          // pullDownToRefresh
          // pullDownToRefreshThreshold={20}
          // pullDownToRefreshContent={
          //   <h3 style={{ textAlign: "center" }}>&#8595; Pull down to refresh</h3>
          // }
          // releaseToRefreshContent={
          //   <h3 style={{ textAlign: "center" }}>&#8593; Release to refresh</h3>
          // }
        >
          <SimpleGrid  breakpoints={[
          { maxWidth: 'xl', cols: 3, spacing: 'md' },
          { maxWidth: 'lg', cols: 3, spacing: 'sm'},
          { maxWidth: 'md', cols: 2, spacing: 'sm' },
          { maxWidth: 'sm', cols: 1, spacing: 'sm' },
        ]}>
            {user.map((p) => (
              <FollowingCard key={u.id} user={u} loggedIn={data.loggedIn} />
            ))}
          </SimpleGrid>
        </InfiniteScroll>
        {/* <TextInput
          label="Search"
          value={searchTerm}
          icon={<IconSearch />}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={onSearchEnter}
          autoFocus={searchTerm ? true : false}
        /> */}
      </Stack>
      </Group>
    );



};