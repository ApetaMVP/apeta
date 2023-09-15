import { createEmotionCache, MantineProvider } from "@mantine/core";
import { StylesPlaceholder } from "@mantine/remix";
import { Notifications } from "@mantine/notifications";
import type { MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Apeta",
  viewport: "width=device-width,initial-scale=1",
});

createEmotionCache({ key: "mantine" });

export default function App() {
  return (
    <MantineProvider
      theme={{
        colors: {
          brand: [
            "#ffe3e3",
            "#ffb4b4",
            "#fb8585",
            "#f75454",
            "#f42525",
            "#d40b0b",
            "#d40b0b",
            "#d40b0b",
            "#d40b0b",
          ],
        },
        primaryColor: "brand",
        components: {
          Button: {
            defaultProps: {
              radius: "md",
            },
          },
          Card: {
            defaultProps: {
              shadow: "lg",
              withBorder: true,
              radius: "md",
            },
          },
        },
      }}
      withGlobalStyles
      withNormalizeCSS
    >
      <Notifications />
      <html lang="en">
        <head>
          <StylesPlaceholder />
          <Meta />
          <meta name="apple-itunes-app" content="app-id=6461686797"></meta>
          <Links />
        </head>
        <body>
          <Outlet />
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </body>
      </html>
    </MantineProvider>
  );
}
