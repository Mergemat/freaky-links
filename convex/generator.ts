// Freaky URL generator - makes links look suspiciously sexual/sketchy

export const FREAKY_SUBDOMAINS = [
  "onlyfans",
  "private-album",
  "leaked-pics",
  "hotsingles",
  "secret-hookup",
  "adult-verify",
  "meetlocals",
  "your-crush",
  "nudes-leaked",
  "private-snap",
  "tinder-leak",
  "dating-verify",
  "cam-access",
  "vip-content",
  "unlock-premium",
] as const;

const FREAKY_PREFIXES = [
  "private",
  "leaked",
  "secret",
  "exclusive",
  "unlock",
  "verify",
  "confirm",
  "access",
  "vip",
  "premium",
  "hot",
  "spicy",
  "naughty",
  "intimate",
  "personal",
] as const;

const FREAKY_SUFFIXES = [
  "pics",
  "album",
  "content",
  "video",
  "profile",
  "match",
  "hookup",
  "meetup",
  "chat",
  "verify",
  "access",
  "unlock",
  "premium",
  "vip",
  "exclusive",
] as const;

const BASE_DOMAIN = "fr34ky.link";

function randomElement<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateShortId(): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function generateFreakyUrl(shortId: string): {
  subdomain: string;
  path: string;
  fullUrl: string;
} {
  const subdomain = randomElement(FREAKY_SUBDOMAINS);
  const prefix = randomElement(FREAKY_PREFIXES);
  const suffix = randomElement(FREAKY_SUFFIXES);

  // Format: prefix_shortId_suffix
  const path = `${prefix}_${shortId}_${suffix}`;
  const fullUrl = `https://${subdomain}.${BASE_DOMAIN}/${path}`;

  return {
    subdomain,
    path,
    fullUrl,
  };
}

export function parseShortIdFromPath(path: string): string | null {
  // Path format: /prefix_SHORTID_suffix
  const withoutSlash = path.startsWith("/") ? path.slice(1) : path;

  // Split by underscore: [prefix, shortId, suffix]
  const parts = withoutSlash.split("_");
  if (parts.length >= 2) {
    return parts[1]; // shortId is the middle part
  }
  return null;
}
