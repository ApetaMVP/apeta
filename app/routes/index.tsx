import { LoaderArgs, redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { requireAuth } from "~/server/auth";

export const loader = async ({ request }: LoaderArgs) => {
  return (await requireAuth(request)) ? redirect("/site") : null;
};

export default function Index() {
  return <Outlet />;
}
