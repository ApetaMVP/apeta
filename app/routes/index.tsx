import { LoaderArgs, redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { requireAuth } from "~/server/auth.server";

export const loader = async ({ request }: LoaderArgs) => {
  return (await requireAuth(request)) ? redirect("/site/for-you") : null;
};

export default function Index() {
  return <Outlet />;
}
