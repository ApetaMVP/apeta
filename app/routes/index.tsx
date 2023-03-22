import { LoaderFunction, redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { requireAuth } from "~/server/auth";

export default function Index() {
  return <Outlet />;
}

export const loader: LoaderFunction = async ({ request }) => {
  return (await requireAuth(request)) ? redirect("/home") : null;
};
