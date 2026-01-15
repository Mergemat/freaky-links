import { createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHost, getRequestUrl } from "@tanstack/start-server-core";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";

const SHORT_ID_REGEX = /^[A-Za-z0-9]{6}$/;

function parseShortIdFromPath(path: string): string | null {
  const withoutSlash = path.startsWith("/") ? path.slice(1) : path;

  // Try old format first: prefix_SHORTID_suffix (backwards compatibility)
  if (withoutSlash.includes("_")) {
    const parts = withoutSlash.split("_");
    if (parts.length >= 2) {
      return parts[1]; // shortId is the middle part
    }
  }

  // New format: {freaky-phrase}-{shortId}
  // shortId is always 6 alphanumeric chars at the end after last hyphen
  const lastHyphenIndex = withoutSlash.lastIndexOf("-");
  if (lastHyphenIndex !== -1) {
    const potentialShortId = withoutSlash.slice(lastHyphenIndex + 1);
    // Validate it's a 6-char alphanumeric shortId
    if (SHORT_ID_REGEX.test(potentialShortId)) {
      return potentialShortId;
    }
  }

  return null;
}

const getRedirectUrl = createServerFn({ method: "GET" }).handler(async () => {
  const host = getRequestHost();
  const url = getRequestUrl();

  console.log("[DEBUG] host:", host);
  console.log("[DEBUG] url:", url);

  // Only handle redirects for fr34ky.link domain
  if (!host.includes("fr34ky.link")) {
    console.log("[DEBUG] Not fr34ky.link domain, skipping");
    return null;
  }

  const parsedUrl = new URL(url);
  console.log("[DEBUG] pathname:", parsedUrl.pathname);

  // If root path on fr34ky.link, redirect to main site
  if (parsedUrl.pathname === "/" || parsedUrl.pathname === "") {
    return "https://freakylinks.sh";
  }

  const shortId = parseShortIdFromPath(parsedUrl.pathname);
  console.log("[DEBUG] shortId:", shortId);

  if (!shortId) {
    console.log("[DEBUG] No shortId found");
    return null;
  }

  const convexUrl = process.env.CONVEX_URL || import.meta.env.VITE_CONVEX_URL;
  console.log("[DEBUG] convexUrl:", convexUrl ? "set" : "NOT SET");

  if (!convexUrl) {
    return null;
  }

  const client = new ConvexHttpClient(convexUrl);
  const link = await client.query(api.links.getLink, { shortId });
  console.log("[DEBUG] link:", link);

  return link?.originalUrl || null;
});

export const Route = createFileRoute("/$")({
  beforeLoad: async () => {
    const redirectUrl = await getRedirectUrl();
    if (redirectUrl) {
      throw redirect({ href: redirectUrl });
    }
  },
  component: NotFound,
});

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="font-bold text-4xl">404</h1>
        <p className="mt-2 text-muted-foreground">Link not found</p>
      </div>
    </div>
  );
}
