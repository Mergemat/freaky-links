import type { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  redirect,
  Scripts,
} from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHost, getRequestUrl } from "@tanstack/start-server-core";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";

import appCss from "../styles.css?url";

function parseShortIdFromPath(path: string): string | null {
  const withoutSlash = path.startsWith("/") ? path.slice(1) : path;
  const parts = withoutSlash.split("_");
  if (parts.length >= 2) {
    return parts[1];
  }
  return null;
}

const checkFreakyRedirect = createServerFn({ method: "GET" }).handler(
  async () => {
    const host = getRequestHost();
    const url = getRequestUrl();

    console.log("[ROOT] host:", host);
    console.log("[ROOT] url:", url);

    if (!host.includes("fr34ky.link")) {
      console.log("[ROOT] Not fr34ky.link, serving normally");
      return null;
    }

    const parsedUrl = new URL(url);
    console.log("[ROOT] pathname:", parsedUrl.pathname);

    if (parsedUrl.pathname === "/" || parsedUrl.pathname === "") {
      console.log("[ROOT] Root path, redirecting to freakylinks.sh");
      return "https://freakylinks.sh";
    }

    const shortId = parseShortIdFromPath(parsedUrl.pathname);
    console.log("[ROOT] shortId:", shortId);

    if (!shortId) {
      console.log("[ROOT] No shortId found");
      return null;
    }

    const convexUrl = process.env.CONVEX_URL || import.meta.env.VITE_CONVEX_URL;
    console.log("[ROOT] CONVEX_URL:", convexUrl ? "SET" : "NOT SET");

    if (!convexUrl) {
      return null;
    }

    const client = new ConvexHttpClient(convexUrl);
    const link = await client.query(api.links.getLink, { shortId });
    console.log("[ROOT] link result:", link);

    return link?.originalUrl || null;
  }
);

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  beforeLoad: async () => {
    const redirectUrl = await checkFreakyRedirect();
    if (redirectUrl) {
      throw redirect({ href: redirectUrl });
    }
  },
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "FreakyLinks - Make your links look freaky",
      },
      {
        name: "description",
        content:
          "The URL shortener that makes your links look freaky",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),

  component: RootComponent,
});

function RootComponent() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="dark">
        <Outlet />
        <Scripts />
      </body>
    </html>
  );
}
