// Slugs are derived from the English title (falling back to the native
// title when there's no English one). A tiny handful of songs share the
// same English title as a different song (e.g. two different charts both
// called "How is the Progress Going!?"), so we detect that collision
// against the given song list and only then suffix the id to disambiguate,
// keeping the common case a clean, id-free slug.

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function baseSlugFor(song) {
  return slugify(song.titleEnglish || song.title);
}

const collisionCountsCache = new WeakMap();

function collisionCountsFor(songs) {
  let counts = collisionCountsCache.get(songs);

  if (!counts) {
    counts = new Map();
    for (const song of songs) {
      const base = baseSlugFor(song);
      counts.set(base, (counts.get(base) || 0) + 1);
    }
    collisionCountsCache.set(songs, counts);
  }

  return counts;
}

export function getSongSlug(song, songs) {
  const base = baseSlugFor(song);

  if (songs && collisionCountsFor(songs).get(base) > 1) {
    return `${base}-${song.id}`;
  }

  return base;
}

export function findSongBySlug(slug, songs) {
  return songs.find((song) => getSongSlug(song, songs) === slug);
}
