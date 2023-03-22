import { AppShell, Box, useMantineTheme } from "@mantine/core";
import { LoaderFunction } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import LeftNav from "~/components/LeftNav";
import TopHeader from "~/components/TopHeader";
import { getUserId } from "~/server/cookie";

export default function Site() {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);

  const { loggedIn } = useLoaderData<typeof loader>();

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
        />
      }
    >
      <Box>
        <Outlet />
      </Box>
    </AppShell>
  );
}

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  return { loggedIn: userId ? true : false };
};
