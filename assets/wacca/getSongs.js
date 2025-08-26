import songsReverse from "./waccaSongsReverse.js";
import songsPlus from "./waccaSongsPlus.js";

function getSongs(version) {
  if (version <= 300) {
    return songsReverse;
  } else {
    return songsPlus;
  }
}

export default getSongs;