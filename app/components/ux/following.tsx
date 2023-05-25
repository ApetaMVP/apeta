import { SimpleGrid, Stack, TextInput, Group, Flex, Container } from "@mantine/core";
import { ActionArgs, json, LoaderArgs } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { IconSearch } from "@tabler/icons";
import { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import FypPostCard from "~/components/FypPostCard";
import { getUserId } from "~/server/cookie.server";
import { getPosts, likePost } from "~/server/post.server";
import {getUser} from "~/server/user.server";
import sanitizedSearch from "~/utils/helpers";
import { Post } from "~/utils/types";

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
    const [user, setUser] = useState<User[]>(data.users as unknown as User[]);
    const [end, setEnd] = useState(false);
  
    const getPosts = async () => {
      let url = `/site/for-you?start=${page + BATCH}`;
      if (searchTerm) {
        url += `&searchTerm=${sanitizedSearch(searchTerm)}`;
      }
      fetcher.load(url);
      setPage(page + BATCH);
      if (fetcher.data) {
        setUser((prevUser) => [...prevUser, ...fetcher.data.User]);
        const newUser = [...User, ...fetcher.data.User];
        if (User.length === newUser.length) {
          setEnd(true);
        } else {
          setEnd(false);
        }
      }
    };