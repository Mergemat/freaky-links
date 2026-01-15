// Freaky URL generator - makes links look like adult video titles / kink names

const FREAKY_PHRASES = [
  // Porn tropes & memes
  "step-bro-help-im-stuck",
  "step-sis-what-are-you-doing",
  "stuck-in-the-dryer",
  "pizza-delivery-special",
  "casting-couch-audition",
  "pool-boy-summer",
  "milf-next-door",
  "caught-in-4k",
  "wrong-hole-oops",
  "lost-the-bet",
  "truth-or-dare-gone-wild",
  "spin-the-bottle",
  "seven-minutes-in-heaven",
  "massage-got-handsy",
  "yoga-instructor-stretches",
  "personal-trainer-session",
  "roommate-walked-in",
  "forgot-to-lock-door",
  "camera-was-on",
  "didnt-know-you-were-home",
  "caught-masturbating",
  "shower-surprise",
  "skinny-dipping",
  "hot-tub-time",
  "netflix-and-chill",
  "just-the-tip",
  "it-slipped-in",
  "accidental-creampie",
  "morning-wood-situation",

  // Kinks & fetishes (toned down)
  "bondage-curious",
  "rope-bunny",
  "daddy-issues",
  "mommy-issues",
  "brat-energy",
  "brat-tamer",
  "praise-kink",
  "degradation-kink",
  "choking-enthusiast",
  "hair-pulling-fan",
  "spanking-enthusiast",
  "collar-me-please",
  "leash-me",
  "dom-energy",
  "sub-energy",
  "switch-vibes",
  "edging-expert",
  "denial-kink",
  "free-use-fantasy",
  "role-play-addict",
  "costume-kink",
  "lingerie-lover",
  "feet-pics",
  "foot-worship",
  "thicc-thighs",
  "ass-worship",
  "titty-enjoyer",
  "size-queen",
  "size-king",

  // Slang & meme terms
  "throat-goat",
  "down-bad",
  "down-horrendous",
  "downbad-posting",
  "breedable",
  "submissive-and-breedable",
  "dumptruck-certified",
  "caked-up",
  "mommy-milkers",
  "rail-me",
  "ruin-me",
  "wreck-me",
  "choke-me-daddy",
  "pull-my-hair",
  "call-me-daddy",
  "good-girl",
  "good-boy",
  "bad-girl",
  "bad-boy",
  "dirty-talk",
  "spit-on-me",
  "make-me-cry",
  "use-me",

  // Suggestive phrases
  "getting-freaky",
  "feeling-frisky",
  "hot-and-bothered",
  "wet-and-ready",
  "hard-and-ready",
  "dripping-wet",
  "soaking-wet",
  "throbbing",
  "edging-session",
  "multiple-rounds",
  "all-night-long",
  "cant-walk-tomorrow",
  "legs-shaking",
  "eyes-rolling-back",
  "toe-curling",
  "back-scratches",
  "bite-marks",
  "hickey-collection",
  "walk-of-shame",
  "bed-squeaking",
  "neighbors-heard",
  "noise-complaint",
] as const;

const BASE_DOMAIN = "fr34ky.link";
const SHORT_ID_REGEX = /^[A-Za-z0-9]{6}$/;

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
  phrase: string;
  path: string;
  fullUrl: string;
} {
  const phrase = randomElement(FREAKY_PHRASES);

  // Format: {freaky-phrase}-{shortId}
  const path = `${phrase}-${shortId}`;
  const fullUrl = `https://${BASE_DOMAIN}/${path}`;

  return {
    phrase,
    path,
    fullUrl,
  };
}

export function parseShortIdFromPath(path: string): string | null {
  const withoutSlash = path.startsWith("/") ? path.slice(1) : path;

  // Format 1 (oldest): prefix_SHORTID_suffix
  // e.g. /leaked_Ab3xYz_pics
  if (withoutSlash.includes("_")) {
    const parts = withoutSlash.split("_");
    if (parts.length >= 2) {
      return parts[1]; // shortId is the middle part
    }
  }

  // Format 2 (subdomain era): path IS the shortId
  // e.g. https://it-slipped-in.fr34ky.link/pDgnsH -> path is just /pDgnsH
  if (SHORT_ID_REGEX.test(withoutSlash)) {
    return withoutSlash;
  }

  // Format 3 (current): {freaky-phrase}-{shortId}
  // e.g. /throat-goat-Ab3xYz
  const lastHyphenIndex = withoutSlash.lastIndexOf("-");
  if (lastHyphenIndex !== -1) {
    const potentialShortId = withoutSlash.slice(lastHyphenIndex + 1);
    if (SHORT_ID_REGEX.test(potentialShortId)) {
      return potentialShortId;
    }
  }

  return null;
}
