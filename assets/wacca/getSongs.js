import songsReverse from "./waccaSongsReverse.js";
import songsPlus from "./waccaSongsPlus.js";

function getSongs(version) {
  if (version <= 300) {
    return songsReverse;
  } else {
    return songsPlus;
  }
}

const byIdCache = new WeakMap();

// id -> song, built once per song list
export function getSongById(version, id) {
  const songs = getSongs(version);
  let byId = byIdCache.get(songs);
  if (!byId) {
    byId = new Map(songs.map((song) => [song.id, song]));
    byIdCache.set(songs, byId);
  }
  return byId.get(id);
}

export default getSongs;