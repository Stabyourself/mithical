<template>
  <WaccaProfileRequired>
    <v-container class="elevation-1 mt-4">
      <div class="single-song">
        <div class="single-song-cover">
          <v-img :src="fullUrl" />
        </div>

        <div
          class="single-song-details"
          :style="{
            'background-image':
              'url(/wacca/img/games/' + song.gameVersion + '.webp)',
          }"
        >
          <div class="single-song-header">
            <div class="single-song-header-left">
              <h1 class="title">{{ getTitle }}</h1>
              <h2 class="artist">{{ song.artist }}</h2>
            </div>
            <div class="single-song-header-right">
              <WaccaFavorite :song-id="song.id" />
            </div>
          </div>

          <div class="single-song-pills">
            <v-chip prepend-icon="mdi-album">
              {{ categoryName }}
            </v-chip>
            <v-chip prepend-icon="mdi-pulse">{{ song.bpm }} bpm</v-chip>
            <v-chip prepend-icon="mdi-plus">
              {{ formatDate(song.dateAdded) }}</v-chip
            >
            <v-chip v-if="song.dateRemoved != 0" prepend-icon="mdi-minus">
              {{ formatDate(song.dateRemoved) }}</v-chip
            >
            <v-chip v-if="profile" prepend-icon="mdi-pound">
              {{ profile.songs[song.id].playCount }}
              play{{ profile.songs[song.id].playCount == 1 ? "" : "s" }}
            </v-chip>
            <v-chip
              v-if="profile && profile.songs[song.id].favorite"
              prepend-icon="mdi-star"
            >
              Favorite
            </v-chip>
            <v-chip
              v-if="profile.songs[song.id].rating != 0"
              prepend-icon="mdi-arrow-up-bold"
            >
              {{ profile.songs[song.id].rating / 10 }}
              Rating
            </v-chip>
            <v-chip prepend-icon="mdi-account">
              Charted by {{ chartedBy }}
            </v-chip>
          </div>

          <!-- <v-btn
            class="mt-4"
            color="primary"
            block
            @click="goToSong"
            :loading="loadingGoToSong"
          >
            Jump to this song on next login
          </v-btn>

          <div class="text-center mt-4">{{ goToSongMessage }}</div> -->
        </div>
      </div>
    </v-container>

    <v-container class="elevation-1 mt-4">
      <h2 class="container-heading">Your scores</h2>

      <WaccaSongSheets
        :song="song"
        :player-data="profile.songs[song.id]"
      />
      <WaccaChart
        :player-history="playerHistory"
        :loading="playerHistoryLoading"
        :song="song"
        :difficulty-filter="yourScoreDifficulty"
        @select-difficulty="selectYourScoreDifficulty"
      />
    </v-container>

    <v-container class="elevation-1 mt-4">
      <h2 class="container-heading histograms-heading">
        Histograms

        <v-tooltip location="end">
          <template v-slot:activator="{ props }">
            <v-icon v-bind="props" color="primary"
              >mdi-information-outline</v-icon
            >
          </template>
          <span
            >Histograms show the distribution of scores of everyone on the
            network.</span
          >
        </v-tooltip>

        <v-btn-toggle
          v-model="histogramView"
          mandatory
          density="compact"
          variant="outlined"
          divided
          class="histogram-toggle"
        >
          <v-btn value="distribution" size="small">Distribution</v-btn>
          <v-btn value="cumulative" size="small">Cumulative</v-btn>
        </v-btn-toggle>
      </h2>
      <div v-if="histogramsLoading" class="d-flex justify-center">
        <v-progress-circular
          indeterminate
          color="primary"
          :size="80"
          :width="10"
          class="mt-4"
        ></v-progress-circular>
      </div>

      <div v-else>
        <v-alert v-if="histogramsLoadingError" type="error" class="mt-4">{{
          histogramsLoadingError
        }}</v-alert>

        <div v-else class="histograms">
          <WaccaHistogram
            v-for="(histogram, i) in histograms"
            :key="i"
            :scores="histogram.score_entries"
            :difficulty="histogram.music_difficulty"
            :label="waccaDifficulties[histogram.music_difficulty - 1].name"
            :view="histogramView"
            :score="
              profile.songs[song.id]?.scores[histogram.music_difficulty - 1]
                ?.score
            "
          />
        </div>
      </div>
    </v-container>

        <v-container class="elevation-1 mt-4">
      <h2 class="container-heading chartview-heading">
        Chart View

        <v-btn-toggle
          v-model="chartView"
          mandatory
          density="compact"
          variant="outlined"
          divided
          class="chartview-toggle"
        >
          <v-btn value="0" size="small">Normal</v-btn>
          <v-btn value="1" size="small">Hard</v-btn>
          <v-btn value="2" size="small">Expert</v-btn>
          <v-btn v-if="song.sheets.length > 3" value="3" size="small">Inferno</v-btn>
        </v-btn-toggle>
      </h2>
      <div ref="previewColumn" class="settings-preview">
        <WaccaPlayfieldPreview :options="profile.options" :chart-url="previewChart" :diff="chartView" />
      </div>
    </v-container>
    
    <v-container class="elevation-1 mt-4">
      <h2 class="container-heading">Leaderboards</h2>
      <WaccaLeaderboard
        :song="song"
        :sheets="filteredSheets"
        :histograms="histograms"
        :player-history="playerHistory"
      />
    </v-container>

    <v-container class="elevation-1 mt-4">
      <h2 class="container-heading">Leaderboards</h2>
      <WaccaLeaderboard
        :song="song"
        :sheets="filteredSheets"
        :histograms="histograms"
        :player-history="playerHistory"
      />
    </v-container>
  </WaccaProfileRequired>
</template>

<style scoped lang="scss">
.v-container {
  padding: 0;
  background: rgb(var(--v-theme-surface));
}

.container-heading {
  padding: 5px 10px;
}

.single-song {
  position: relative;
  display: flex;
  gap: 10px;
}

.artist {
  color: rgb(var(--v-theme-primary));
}

.single-song-cover {
  width: 320px;
  flex-shrink: 0;
}

.single-song-details {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  background-size: 150px;
  background-position: bottom 10px right 10px;
}

@media (max-width: 800px) {
  .single-song {
    flex-direction: column;
  }

  .single-song-cover {
    width: 100%;
    max-width: 320px;
    margin: 0 auto;
  }

  .single-song-details {
    padding-left: 10px;
    padding-right: 10px;
    padding-bottom: 80px;
  }
}

.single-song-header {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.single-song-pills {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 10px;
}

.single-song-pill {
  border-radius: 50px;
  padding: 5px 10px;
  background-color: rgb(var(--v-theme-surface-variant));
  color: white;
  font-weight: 700;
}

.histograms {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 300px 300px;
  gap: 10px;
  padding-bottom: 10px;

  .histogram {
    width: 100%;
    height: 100%;
  }

  @media (max-width: 600px) {
    grid-template-columns: 100%;
    grid-template-rows: 300px 300px 300px 300px;
  }
}

.histograms-heading {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
}

.histogram-toggle {
  height: 30px !important;
  margin-left: auto;

  .v-btn {
    text-transform: none;
    letter-spacing: normal;
  }
}

.chartview-toggle {
  height: 30px !important;
  margin-left: auto;
  .v-btn {
    text-transform: none;
    letter-spacing: normal;
  }
}
.playfield-preview {
  width: min(100%, 560px);
  margin: 0 auto 32px;
}

.chartview-heading {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
}

</style>

<script setup>
import { Chart, registerables } from "chart.js";
import "chartjs-adapter-moment";
import zoomPlugin from "chartjs-plugin-zoom";

Chart.register(zoomPlugin);
Chart.register(...registerables);

import getSongs from "~/assets/wacca/getSongs.js";
import waccaDifficulties from "~/assets/wacca/waccaDifficulties";
import waccaCategories from "~/assets/wacca/waccaCategories";
import { getSongSlug, findSongBySlug } from "~/assets/wacca/songSlug.js";

const profile = useState("profile");
definePageMeta({
  middleware: ["auth"],
});

const runtimeConfig = useRuntimeConfig();
const route = useRoute();
const activeCard = useState("activeCard");
const version = useState("version");

const song = computed(() => {
  const songs = getSongs(version.value);
  const param = route.params.slug;

  if (/^\d+$/.test(param)) {
    const byId = songs.find((song) => song.id === parseInt(param));
    if (byId) {
      return byId;
    }
  }

  return findSongBySlug(param, songs);
});

// Legacy id links (and any slug that's gone stale) get normalized to the
// canonical slug URL so slugs are always what ends up in the address bar.
watchEffect(() => {
  if (!song.value) {
    return;
  }

  const canonicalSlug = getSongSlug(song.value, getSongs(version.value));
  if (route.params.slug !== canonicalSlug) {
    navigateTo(`/songs/${canonicalSlug}`, { replace: true });
  }
});

const fullUrl = computed(() => {
  return `/wacca/img/covers/${song.value.imageName}`;
});

const filteredSheets = computed(() => {
  return song.value.sheets.filter(
    (sheet) => sheet.gameVersion <= version.value,
  );
});

const yourScoreDifficulty = ref(null);
const histograms = shallowRef([]);
const histogramsLoading = ref(false);
const histogramsLoadingError = ref();
const histogramView = ref("distribution");
const chartView = ref("0");


const playerHistory = shallowRef([]);

const previewChart = computed(() => {
  const chart = `/wacca/MusicData/${song.value.id}/${song.value.id}_0`;
  return chart;
});
function loadHistograms() {
  histogramsLoading.value = true;
  $fetch(
    `${runtimeConfig.public.apiUrl}/wacca/music/${song.value.id}/histogram`,
  )
    .then((data) => {
      histogramsLoading.value = false;
      histograms.value = data;
      histogramsLoadingError.value = null;
    })
    .catch((err) => {
      histogramsLoading.value = false;
      histogramsLoadingError.value =
        "Couldn't reach the API. Please try again later.";
    });
}

function selectYourScoreDifficulty(difficulty) {
  // Make it a toggle. Set to null if the difficulty is already selected.
  const filterValue =
    yourScoreDifficulty.value === difficulty ? null : difficulty;
  yourScoreDifficulty.value = filterValue;
}

loadHistograms();

const playerHistoryLoading = ref(true);

function loadPlayerHistory() {
  playerHistoryLoading.value = true;

  $fetch(
    `${runtimeConfig.public.apiUrl}/wacca/user/${activeCard.value}/music/${song.value.id}`,
  ).then((data) => {
    playerHistoryLoading.value = false;
    playerHistory.value = data;
  });
}

watch(activeCard, loadPlayerHistory);
loadPlayerHistory();

// Jump to song on next login

// const loadingGoToSong = ref(false);
// const goToSongMessage = ref("");

// function goToSong() {
//   goToSongMessage.value = null;
//   loadingGoToSong.value = true;
//   $fetch(`${runtimeConfig.public.apiUrl}/wacca/user/${activeCard.value}/gotomusic`, {
//     method: "POST",
//     body: JSON.stringify({
//       music_id: song.value.id,
//       difficulty: selectedDifficulty.value,
//     }),
//   })
//     .then((data) => {
//       loadingGoToSong.value = false;
//       goToSongMessage.value =
//         "Song set! Wacca will jump to this song on your next login. Good luck!";
//     })
//     .catch((err) => {
//       loadingGoToSong.value = false;
//       goToSongMessage.value = "Couldn't reach the API. Please try again later.";
//     });
// }

const language = useState("language");

const getTitle = computed(() => {
  if (language.value === "ja") {
    return song.value.title;
  }

  return song.value.titleEnglish || song.value.title;
});

function formatDate(date) {
  if (date == 0) {
    date = 20190718;
  }
  const strDate = date.toString();

  let year = strDate.slice(0, 4);
  let month = strDate.slice(4, 6);
  let day = strDate.slice(6, 8);
  return new Date(`${year}-${month}-${day}`).toLocaleDateString();
}

const chartedBy = computed(() => {
  let charters = [];

  for (const sheet of song.value.sheets) {
    if (sheet.gameVersion <= version.value) {
      charters.push(sheet.charter);
    }
  }

  return [...new Set(charters)].join(" + ");
});

const category = computed(() => {
  return waccaCategories.find(
    (category) => category.ja === song.value.category,
  );
});

const categoryName = computed(() => {
  if (language.value === "ja") {
    return category.value.ja;
  }
  return category.value.en;
});

const ogDescription = computed(() => {
  return [
    `by ${song.value.artist}`,
    categoryName.value,
    `Charted by ${chartedBy.value}`,
  ]
    .filter(Boolean)
    .join(" · ");
});

useSeoMeta({
  title: `Mithical | ${getTitle.value}`,
  ogTitle: `Mithical | ${getTitle.value}`,
  ogSiteName: "Mithical",
  description: ogDescription,
  ogDescription,
  ogImage: () => `${useRequestURL().origin}${fullUrl.value}`,
  ogUrl: () => useRequestURL().href,
  twitterCard: "summary_large_image",
});
</script>
