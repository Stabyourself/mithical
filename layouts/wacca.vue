<template>
  <v-theme-provider
    :theme="`wacca${themeModded}`"
    class="wacca"
    with-background
  >
    <div id="site-logo">
      <NuxtLink to="/wacca">
        <img src="/wacca/img/logo.svg" />
      </NuxtLink>
    </div>

    <WaccaNav />
    <NuxtPage style="padding-bottom: 200px" />
  </v-theme-provider>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>

<script setup>
import { toRaw } from "vue";
import getSongs from "~/assets/wacca/getSongs.js";

const theme = useState("theme");
const runtimeConfig = useRuntimeConfig();
const activeCard = useState("activeCard");

useHead({
  title: "Mithical | Wacca",
});

const profile = useState("profile");
const profileLoading = useState("profileLoading", () => false);
const profileError = useState("profileError");
const version = useState("version");

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
        selectVersion();
      })
      .catch((err) => {
        console.error(err);
        profileLoading.value = false;
        profileError.value = "Couldn't reach the API. Please try again later.";
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
    rating,
  };
}

function selectVersion() {
  if (localStorage.getItem("version")) {
    return;
  }

  if (profile.value.version_data[300]) {
    version.value = 400;
  } else {
    version.value = 300;
  }
}

function cachePlayerSongs() {
  // raw data so we're not going through vue's proxies for every lookup
  const raw = toRaw(profile.value);
  const musicByKey = new Map(
    raw.music.map((music) => [
      `${music.music_id}-${music.music_difficulty}`,
      music,
    ]),
  );
  const favorites = new Set(raw.favorite_music_entries);

  const songs = [];
  for (const song of getSongs(version.value)) {
    songs[song.id] = cacheSongInfo(song, musicByKey, favorites);
  }
  profile.value.songs = songs;
}

const themeModded = computed(() => {
  let out = theme.value;

  if (version.value == 400) {
    out += "Plus";
  }

  return out;
});

loadProfile();
watch(activeCard, loadProfile);
watch(version, loadProfile);
</script>
