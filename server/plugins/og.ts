// Mithical is a client-only SPA (ssr: false), so the per-page titles/images
// set via useSeoMeta in the Vue components never make it into the HTML
// that's actually sent over the wire - they only apply after the browser
// downloads and runs the JS bundle. That's invisible to anything that
// doesn't execute JavaScript: search engines, and most social-media link
// unfurlers (Discord, Slack, Twitter/X, etc), including OG debugging tools.
//
// Sniffing the User-Agent for known bots and serving them a special page
// (the previous approach) is fragile - it silently produces nothing for
// any crawler/tool not on the list. Instead this hooks directly into
// Nuxt's HTML rendering pipeline (the same one used for every request,
// SPA or not) and rewrites the <head> tags for the requested route before
// the response is sent, for every request. Real users get the exact same
// app, just with the right tags already in place instead of waiting on
// client-side JS to set them.

import { getHeader, getRequestURL } from "h3";
import getSongs from "../../assets/wacca/getSongs.js";
import waccaCategories from "../../assets/wacca/waccaCategories.js";
import { getSongSlug, findSongBySlug } from "../../assets/wacca/songSlug.js";

const SITE_NAME = "Mithical";
const DEFAULT_TITLE = "Mithical";
const DEFAULT_DESCRIPTION = "Web UI for Wacca";
const DEFAULT_IMAGE_PATH = "/logo.png";

const ROUTE_META: Record<string, { title: string; description: string }> = {
  "/": {
    title: "Mithical",
    description: "Web UI for Wacca",
  },
  "/cards": {
    title: `${SITE_NAME} | Manage Your Cards`,
    description: "Add or manage the Wacca cards linked to your profile.",
  },
  "/wacca": {
    title: `${SITE_NAME} | Wacca`,
    description: "Track your Wacca scores, songs, and profile.",
  },
  "/wacca/inventory": {
    title: `${SITE_NAME} | Inventory`,
    description: "Browse your Wacca item inventory.",
  },
  "/wacca/recent": {
    title: `${SITE_NAME} | Recent Plays`,
    description: "See your most recent Wacca plays.",
  },
  "/wacca/rating": {
    title: `${SITE_NAME} | Rating`,
    description: "View your Wacca rating breakdown.",
  },
  "/wacca/leaderboards": {
    title: `${SITE_NAME} | Leaderboards`,
    description: "Check the Wacca leaderboards.",
  },
  "/wacca/gacha": {
    title: `${SITE_NAME} | Gacha`,
    description: "Check out the Wacca gacha.",
  },
  "/wacca/settings": {
    title: `${SITE_NAME} | Wacca Settings`,
    description: "Configure your Wacca settings.",
  },
  "/wacca/songs": {
    title: `${SITE_NAME} | All Songs`,
    description: "Browse every song available in Wacca.",
  },
};

function escapeHtml(value: string): string {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Songs are looked up by slug first (the canonical form), falling back to
// the legacy numeric id so old links keep working. The Plus catalog (400)
// is a superset of Reverse, so it's the only one we need to check.
function resolveSong(param: string) {
  const songs = getSongs(400);

  if (/^\d+$/.test(param)) {
    const id = parseInt(param, 10);
    const song = songs.find((song) => song.id === id);
    if (song) {
      return { song, songs };
    }
  }

  const song = findSongBySlug(param, songs);
  return song ? { song, songs } : null;
}

function categoryName(categoryJa: string) {
  return (
    waccaCategories.find((category) => category.ja === categoryJa)?.en ||
    categoryJa
  );
}

function difficultyRange(sheets: { difficulty: number }[]) {
  const difficulties = sheets.map((sheet) => sheet.difficulty);
  const min = Math.min(...difficulties).toFixed(1);
  const max = Math.max(...difficulties).toFixed(1);
  return min === max ? min : `${min}-${max}`;
}

function chartedBy(sheets: { charter: string }[]) {
  return [...new Set(sheets.map((sheet) => sheet.charter))].join(" + ");
}

// Strip any default/placeholder tags Nuxt already rendered for these
// so our versions are the only ones present, instead of relying on
// crawlers picking the "right" one out of duplicates.
function stripExistingTags(head: string) {
  return head
    .replace(/<title>[\s\S]*?<\/title>/gi, "")
    .replace(/<meta[^>]*\bname=["']description["'][^>]*>/gi, "")
    .replace(/<meta[^>]*\bproperty=["']og:[^"']*["'][^>]*>/gi, "")
    .replace(/<meta[^>]*\bname=["']twitter:[^"']*["'][^>]*>/gi, "")
    .replace(/<link[^>]*\brel=["']canonical["'][^>]*>/gi, "");
}

function buildTags(options: {
  title: string;
  description: string;
  image: string;
  url: string;
}) {
  const { title, description, image, url } = options;
  const safeTitle = escapeHtml(title);
  const safeDescription = escapeHtml(description);

  return `<title>${safeTitle}</title>
<meta name="description" content="${safeDescription}">
<link rel="canonical" href="${url}">
<meta property="og:site_name" content="${SITE_NAME}">
<meta property="og:type" content="website">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${safeTitle}">
<meta property="og:description" content="${safeDescription}">
<meta property="og:image" content="${image}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${safeTitle}">
<meta name="twitter:description" content="${safeDescription}">
<meta name="twitter:image" content="${image}">`;
}

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook("render:html", (html, { event }) => {
    if (!event || event.method !== "GET") {
      return;
    }

    const path = event.path.split("?")[0];

    // Only page routes: skip API calls, static assets, and build output.
    if (
      path.startsWith("/api/") ||
      path.startsWith("/_nuxt/") ||
      /\.[a-z0-9]+$/i.test(path)
    ) {
      return;
    }

    // Behind the nginx reverse proxy, the connection Nitro sees is plain
    // http even though the public site is https-only, and nginx isn't
    // forwarding X-Forwarded-Proto for us to detect that. Since this app
    // is never legitimately served over plain http outside of local dev,
    // just force https for any non-local host rather than depending on
    // proxy headers.
    const requestUrl = getRequestURL(event, {
      xForwardedProto: true,
      xForwardedHost: true,
    });
    const isLocalHost = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(
      requestUrl.hostname
    );
    const origin = isLocalHost ? requestUrl.origin : `https://${requestUrl.host}`;
    const url = `${origin}${path}`;

    let title = DEFAULT_TITLE;
    let description = DEFAULT_DESCRIPTION;
    let image = `${origin}${DEFAULT_IMAGE_PATH}`;
    let canonicalUrl = url;

    const songMatch = path.match(/^\/wacca\/songs\/([^/]+)$/);

    if (songMatch) {
      const resolved = resolveSong(decodeURIComponent(songMatch[1]));

      if (resolved) {
        const { song, songs } = resolved;
        canonicalUrl = `${origin}/wacca/songs/${getSongSlug(song, songs)}`;
        title = `${SITE_NAME} | ${song.title}`;
        description = [
          `by ${song.artist}`,
          categoryName(song.category),
          `Difficulty ${difficultyRange(song.sheets)}`,
          chartedBy(song.sheets) && `Charted by ${chartedBy(song.sheets)}`,
        ]
          .filter(Boolean)
          .join(" · ");
        image = `${origin}/wacca/img/covers/${song.imageName}`;
      }
    } else {
      const meta = ROUTE_META[path];
      if (meta) {
        title = meta.title;
        description = meta.description;
      }
    }

    html.head = html.head.map(stripExistingTags);
    html.head.push(
      buildTags({ title, description, image, url: canonicalUrl })
    );
  });
});
