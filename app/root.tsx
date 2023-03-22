import { createEmotionCache, MantineProvider } from "@mantine/core";
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
          Card: {
            defaultProps: {
              shadow: "lg",
              withBorder: true,
            },
          },
        },
      }}
      withGlobalStyles
      withNormalizeCSS
    >
      <html lang="en">
        <head>
          <Meta />
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
