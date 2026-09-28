import { toRaw } from "vue";
import getSongs from "~/assets/wacca/getSongs.js";

// The active card's profile for the picked version, loaded again when either changes
export default defineNuxtPlugin({
  name: "profile",
  dependsOn: ["preferences"],
  setup() {
    const runtimeConfig = useRuntimeConfig();
    const activeCard = useState("activeCard");
    const version = useState("version");
    const profile = useState("profile");
    const profileLoading = useState("profileLoading", () => false);
    const profileError = useState("profileError");

    async function loadProfile() {
      profileLoading.value = true;
      profileError.value = null;

      if (activeCard.value) {
        let profileUrl = `${runtimeConfig.public.apiUrl}/wacca/user/${activeCard.value}/${version.value}`;

        $fetch(profileUrl)
          .then((data) => {
            profile.value = data;
            profileLoading.value = false;

            cachePlayerSongs();
          })
          .catch((err) => {
            console.error(err);
            profileLoading.value = false;
            profileError.value =
              "Couldn't reach the API. Please try again later.";
          });
      }
    }

    // getting the song and sheet data by id/difficulty
    // is a lot of lookups so we cache them in playerData
    function cacheSongInfo(song, musicByKey, favorites) {
      let favorite = favorites.has(song.id);
      let playCount = 0;
      let rating = 0;
      let scores = [];

      for (let difficulty = 1; difficulty <= song.sheets.length; difficulty++) {
        let music = musicByKey.get(`${song.id}-${difficulty}`);

        if (music) {
          playCount += music.play_count;
          scores.push(music);
          rating = Math.max(rating, music.rating);
        } else {
          scores.push(null);
        }
      }

      return {
        favorite,
        scores,
        playCount,
        rating
      };
    }

    function cachePlayerSongs() {
      // raw data so we're not going through vue's proxies for every lookup
      const raw = toRaw(profile.value);
      const musicByKey = new Map(
        raw.music.map((music) => [
          `${music.music_id}-${music.music_difficulty}`,
          music
        ])
      );
      const favorites = new Set(raw.favorite_music_entries);

      const songs = [];
      for (const song of getSongs(version.value)) {
        songs[song.id] = cacheSongInfo(song, musicByKey, favorites);
      }
      profile.value.songs = songs;
    }

    loadProfile();
    watch(activeCard, loadProfile);
    watch(version, loadProfile);
  }
});
