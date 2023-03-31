import { AppShell, Box, useMantineTheme } from "@mantine/core";
import { Tag, User } from "@prisma/client";
import { LoaderArgs } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import LeftNav from "~/components/LeftNav";
import TopHeader from "~/components/TopHeader";
import { getUserId } from "~/server/cookie.server";
import { getTags } from "~/server/tags.server";
import { getUser } from "~/server/user.server";

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await getUserId(request);
  let user;
  if (userId) {
    user = await getUser(userId);
  }
  const tags = await getTags(5);
  return { loggedIn: userId ? true : false, user, tags };
};

export default function Site() {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const data = useLoaderData<typeof loader>();
  const loggedIn = data.loggedIn;
  const user = data.user as unknown as User;
  const tags = data.tags as unknown as Tag[];

  return (
    <AppShell
      styles={{
        main: {
          background: theme.colors.gray[1],
        },
      }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      navbar={<LeftNav opened={opened} loggedIn={loggedIn} tags={tags} />}
      header={
        <TopHeader
          opened={opened}
          setOpened={setOpened}
          theme={theme}
          loggedIn={loggedIn}
          user={user}
        />
      }
    >
      <Box>
        <Outlet />
      </Box>
    </AppShell>
  );
}
