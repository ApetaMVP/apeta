import { AppShell, Box, useMantineTheme } from "@mantine/core";
import { User } from "@prisma/client";
import { json, LoaderArgs } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import LeftNav from "~/components/LeftNav";
import TopHeader from "~/components/TopHeader";
import { getUserId } from "~/server/cookie.server";
import { getUser } from "~/server/user.server";

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await getUserId(request);
  let user;
  if (userId) {
    user = await getUser(userId);
  }
  return json({ loggedIn: userId ? true : false, user });
};

export default function Site() {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const data = useLoaderData<typeof loader>();
  const loggedIn = data.loggedIn;
  const user = data.user as unknown as User;

  return (
    <AppShell
      styles={{
        main: {
          background: theme.colors.gray[1],
        },
      }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      navbar={
        <LeftNav opened={opened} setOpened={setOpened} loggedIn={loggedIn} />
      }
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
