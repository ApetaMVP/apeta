import { AppShell, Box } from "@mantine/core";
import { Outlet } from "@remix-run/react";
// import { useState } from "react";
// import LeftNav from "~/components/LeftNav";
// import WelcomeModal from "~/components/popup/WelcomeModal";
// import TopHeader from "~/components/TopHeader";
// import { getUserId } from "~/server/cookie.server";
// import { getTags } from "~/server/tags.server";
// import { getUser } from "~/server/user.server";
// import { Tag, User } from "@prisma/client";
// import { LoaderArgs } from "@remix-run/node";

// export const loader = async ({ request }: LoaderArgs) => {
//   const userId = await getUserId(request);
//   let user;
//   if (userId) {
//     user = await getUser(userId);
//   }
//   const tags = await getTags(5);
//   return { loggedIn: userId ? true : false, user, tags };
// };

export default function Site() {
  // const [opened, setOpened] = useState(false);
  // const data = useLoaderData<typeof loader>();
  // const loggedIn = data.loggedIn;
  // const user = data.user as unknown as User;
  // const tags = data.tags as unknown as Tag[];

  return (
    <AppShell
      padding={0}
      // navbarOffsetBreakpoint="sm"
      // asideOffsetBreakpoint="sm"
    >
      <Box>
        <Outlet />
      </Box>
    </AppShell>
  );
}
