import { AppShell, Box, useMantineTheme } from "@mantine/core";
import { LoaderFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { useState } from "react";
import LeftNav from "~/components/LeftNav";
import TopHeader from "~/components/TopHeader";
import { requireAuth } from "~/server/auth";

export default function Home() {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);

  return (
    <AppShell
      styles={{
        main: {
          background: theme.colors.gray[1],
        },
      }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      navbar={<LeftNav opened={opened} setOpened={setOpened} />}
      header={<TopHeader opened={opened} setOpened={setOpened} theme={theme} />}
    >
      <Box>
        <Outlet />
      </Box>
    </AppShell>
  );
}

export const loader: LoaderFunction = async ({ request }) => {
  return await requireAuth(request);
};
