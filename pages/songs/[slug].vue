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
              'url(/wacca/img/games/' + song.gameVersion + '.webp)'
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
      <h2 class="container-heading chartview-heading">
        Chart View

        <div class="chartview-controls">
          <v-btn-toggle
            v-model="chartView"
            mandatory
            density="compact"
            divided
            class="chartview-toggle chartview-difficulties"
          >
            <v-btn
              v-for="(difficulty, i) in chartDifficulties"
              :key="i"
              :value="i"
              :color="difficulty.color"
              :base-color="difficulty.color"
              variant="flat"
              size="small"
              class="toggle-option chartview-difficulty"
              >{{ difficulty.name
              }}<span class="chartview-level"
                ><span class="chartview-level-prefix">/Lv.</span
                >{{ difficulty.level }}</span
              ></v-btn
            >
          </v-btn-toggle>

          <v-btn-toggle
            v-model="chartFeatures.type"
            mandatory
            density="compact"
            divided
            class="chartview-toggle"
          >
            <v-btn
              v-for="skill in CHART_TYPES"
              :key="skill.value"
              :value="skill.value"
              :title="skill.description"
              color="primary"
              base-color="primary"
              variant="flat"
              size="small"
              class="toggle-option"
              >{{ skill.title }}</v-btn
            >
          </v-btn-toggle>

          <v-btn-toggle
            v-model="chartOptionsOpen"
            density="compact"
            class="chartview-toggle"
          >
            <v-btn
              :value="true"
              color="primary"
              base-color="primary"
              variant="flat"
              size="small"
              class="toggle-option"
              aria-label="Chart view options"
              title="Options"
            >
              <v-icon>mdi-cog</v-icon>
            </v-btn>
          </v-btn-toggle>
        </div>
      </h2>

      <Collapse :when="!!chartOptionsOpen">
        <div class="chartview-options">
          <div class="chartview-options-row">
            <span class="chartview-options-label">Judgements</span>
            <v-btn-toggle
              v-model="chartFeatures.judging"
              mandatory
              density="compact"
              divided
              class="chartview-toggle"
            >
              <v-btn
                v-for="skill in JUDGEMENT_TYPES"
                :key="skill.value"
                :value="skill.value"
                :title="skill.description"
                color="primary"
                base-color="primary"
                variant="flat"
                size="small"
                class="toggle-option"
                >{{ skill.title }}</v-btn
              >
            </v-btn-toggle>
          </div>
        </div>
        
        <div class="chartview-options">
          <div
            v-for="group in CHART_TOGGLE_GROUPS"
            :key="group.label"
            class="chartview-options-row"
          >
            <span class="chartview-options-label">{{ group.label }}</span>
            <v-btn-toggle
              :model-value="enabledToggles(group)"
              multiple
              density="compact"
              divided
              class="chartview-toggle"
              @update:model-value="(keys) => setEnabledToggles(group, keys)"
            >
              <v-btn
                v-for="toggle in group.toggles"
                :key="toggle.key"
                :value="toggle.key"
                :title="toggle.title"
                color="primary"
                base-color="primary"
                variant="flat"
                size="small"
                class="toggle-option"
                >{{ toggle.label }}</v-btn
              >
            </v-btn-toggle>
          </div>

          <div class="chartview-options-row">
            <span class="chartview-options-label">Bot</span>
            <v-btn-toggle
              v-model="chartFeatures.bot"
              mandatory
              density="compact"
              divided
              class="chartview-toggle"
            >
              <v-btn
                v-for="skill in BOT_SKILLS"
                :key="skill.value"
                :value="skill.value"
                :title="skill.description"
                color="primary"
                base-color="primary"
                variant="flat"
                size="small"
                class="toggle-option"
                >{{ skill.title }}</v-btn
              >
            </v-btn-toggle>
          </div>

          <div class="chartview-options-row">
            <span class="chartview-options-label">Display</span>
            <v-btn-toggle
              v-model="chartFeatures.display"
              mandatory
              density="compact"
              divided
              class="chartview-toggle"
            >
              <v-btn
                v-for="skill in DISPLAY_TYPES"
                :key="skill.value"
                :value="skill.value"
                :title="skill.description"
                color="primary"
                base-color="primary"
                variant="flat"
                size="small"
                class="toggle-option"
                >{{ skill.title }}</v-btn
              >
            </v-btn-toggle>
          </div>

          <div class="chartview-scroll-options-row">
            <span class="chartview-options-label">Scroll</span>
            <v-slider
              v-model="noteSpeed"
              :min="0"
              :max="50"
              :step="1"
              :label="`${formatSpeed(noteSpeed)}`"
              density="compact"
              hide-details
              thumb-label
              class="lab-speed"
              >
                <template #thumb-label="{ modelValue }">{{ formatSpeed(modelValue) }}</template>
            </v-slider>
          </div>
        </div>
      </Collapse>

      <div class="chart-preview">
        <WaccaPlayfieldPreview
          :view="chartFeatures.type"
          :options="options"
          :chart-url="chartData?.url ?? null"
          :chart-info="chartData?.info ?? null"
          :ring="chartFeatures.ring"
          :song-count="chartFeatures.songCount"
          :score="chartFeatures.score"
          :progress-bar="chartFeatures.progressBar"
          :judging="judging"
          :autoplay="chartFeatures.bot != 'none'"
          :bot-skill="
            chartFeatures.bot == 'none' ? undefined : chartFeatures.bot
          "
          start-paused
        />
      </div>
    </v-container>

    <v-container class="elevation-1 mt-4">
      <h2 class="container-heading">Your scores</h2>

      <WaccaSongSheets :song="song" :player-data="profile.songs[song.id]" />
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
          divided
          class="histogram-toggle"
        >
          <v-btn
            v-for="view in ['distribution', 'cumulative']"
            :key="view"
            :value="view"
            color="primary"
            base-color="primary"
            variant="flat"
            size="small"
            class="toggle-option"
            >{{ view == "distribution" ? "Distribution" : "Cumulative" }}</v-btn
          >
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
            v-for="(histogram, i) in shownHistograms"
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
      <h2 class="container-heading">Leaderboards</h2>
      <WaccaLeaderboard
        :song="song"
        :sheets="filteredSheets"
        :start-difficulty="startDifficulty + 1"
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

.chartview-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-left: auto;
}

.chartview-toggle {
  height: 30px !important;
  .v-btn {
    text-transform: none;
    letter-spacing: normal;
  }
}

// On phones four difficulties don't fit as "INFERNO/Lv.13+", so they show as
// "INFERNO 13+" (the level light like on the difficulty pills) across the
// whole width
@media (max-width: 600px) {
  .chartview-difficulties {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    margin-left: auto;
  }

  .chartview-difficulty {
    flex: 1 1 auto;
    padding: 0 6px !important;
  }

  .chartview-level {
    margin-left: 4px;
    font-weight: 400;
  }

  .chartview-level-prefix {
    display: none;
  }

  .chartview-controls {
    width: 100%;
    justify-content: flex-end;
    display: flex;
    flex-wrap: wrap;
    margin-left: auto;
  }
}

.chartview-heading {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-left: auto;
  gap: 6px;
}

// Chart view options: one row per group under the heading's controls, lined
// up on the right like them
.chartview-options {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
  padding: 0 10px 6px;

  // the heading's controls wrap to the left on phones, so follow them
  @media (max-width: 600px) {
    align-items: flex-end;
    flex-wrap: wrap;
    margin-left: auto;
  }
}

.chartview-options-row {
  display: flex;
  align-items: center;
  gap: 8px;

  // labels above the groups on phones, the Bot group needs the whole width
  // Moving this to right side of mobile
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-end;
    gap: 2px;
  }
}

// same width for both, so the groups line up
.chartview-options-label {
  min-width: 2.5em;
  text-align: right;
  font-size: 0.875rem;
  font-weight: 500;
  opacity: 0.7;

  @media (max-width: 600px) {
    min-width: 0;
  }
}

.chartview-scroll-options-row {
  display: flex;
  align-items: center;
  gap: 8px;
  width: min(100%, 400px);
}

// Mobile scroll bar
@media (max-width: 600px) {
  .chartview-scroll-options-row {
    flex-direction: column;
    align-items: flex-end;
    gap: 2px;
    width: min(100%, 400px);
  }

  .chartview-scroll-options-row .chartview-options-label {
    align-self: flex-end;
  }
}

// Font and margins for scroll speed bar
.lab-speed {
  width: 100%;
}

.lab-speed :deep(.v-label) {
  font-size: 0.875rem;
  font-weight: 500;
  opacity: 0.7;
  margin: 0 0 2px
}

.chart-preview {
  display: flex;
  justify-content: center;
  padding: 0.5rem 0.5rem 16px;

  :deep(.playfield-preview) {
    width: min(100%, 825px);
  }
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
import { formatDifficulty } from "~/assets/js/util";
import { chartPath } from "~/assets/wacca/playfield/merChart.js";
import { Collapse } from "vue-collapsed";

const profile = useState("profile");
definePageMeta({
  middleware: ["auth"]
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
    (sheet) => sheet.gameVersion <= version.value
  );
});

// The API has histograms for every difficulty anyone played, only show the ones in this version
const shownHistograms = computed(() =>
  histograms.value.filter(
    (histogram) => filteredSheets.value[histogram.music_difficulty - 1]
  )
);

// Where the chart view and leaderboard start: the difficulty you've played the most
// (the harder one on a tie), the highest if you haven't played it
const startDifficulty = computed(() => {
  const scores = profile.value?.songs[song.value.id]?.scores ?? [];
  let start = filteredSheets.value.length - 1;
  let mostPlays = 0;
  filteredSheets.value.forEach((sheet, i) => {
    const plays = scores[i]?.play_count ?? 0;
    if (plays > 0 && plays >= mostPlays) {
      start = i;
      mostPlays = plays;
    }
  });
  return start;
});

const yourScoreDifficulty = ref(null);
const histograms = shallowRef([]);
const histogramsLoading = ref(false);
const histogramsLoadingError = ref();
const histogramView = ref("distribution");
const chartView = ref(startDifficulty.value);
watch(
  () => song.value.id,
  () => (chartView.value = startDifficulty.value)
);

const judging = computed(() => {
  return chartFeatures.value.judging === "on";
});
// Chart view options: what the preview shows and whether a bot plays
const chartOptionsOpen = ref();
const CHART_TOGGLE_GROUPS = [
  {
    label: "Cosmetics",
    toggles: [
      {
        key: "ring",
        label: "Ring",
        title:
          "The console's LED ring around the view. Off, the lanes fill the space"
      },
      { key: "songCount", label: "Song no.", title: '"1/3 Song" on the ring' },
      { key: "score", label: "Score", title: "The score on the ring" },
      {
        key: "progressBar",
        label: "Gauge",
        title: "The clear gauge in the round view"
      }
    ]
  }
];
// Note speed (option 1, 0-50 for x1.0 to x6.0) when not using your options:
// x2.0 for Normal up to x3.5 for Inferno. Everything else at its default
const DEFAULT_NOTE_SPEEDS = [10, 15, 20, 25];
// Named after the worst judgement the bot gets. Off leaves the playing to you
const BOT_SKILLS = [
  {
    title: "Off",
    value: "none",
    description: "No bot"
  },
  { title: "Miss+", value: "miss-up", description: "Misses now and then" },
  { title: "Good+", value: "good-up", description: "Goods at worst" },
  { title: "Great+", value: "great-up", description: "Greats at worst" },
  {
    title: "All Marvelous",
    value: "all-marvelous",
    description: "Hits everything perfectly"
  },
];

const DISPLAY_TYPES = [
  {
    title: "Use default display settings",
    value: "defaultColor",
    description: "Use the default WACCA customization settings"
  },
  {
    title: "Use my display settings",
    value: "userColor",
    description: "Use your current WACCA customization settings"
  }
];

const CHART_TYPES = [
  {
    title: "3D",
    value: "circle",
    description: "Render playback in full 360 degrees"
  },
  {
    title: "2D",
    value: "unrolled",
    description: "Render playback unrolled and flat. You like chuni right?"
  }
];

const JUDGEMENT_TYPES = [
  {
    title: "Off",
    value: "off",
    description: "Playback will have judgements disabled"
  },
  {
    title: "On",
    value: "on",
    description: "Playback will show judgements"
  }
];
// Remembered for every song, see plugins/preferences.js
const chartFeatures = useState("chartViewFeatures");
// A group's toggles as the list of what's on, for its button group
function enabledToggles(group) {
  return group.toggles
    .map(({ key }) => key)
    .filter((key) => chartFeatures.value[key]);
}

function setEnabledToggles(group, keys) {
  group.toggles.forEach(({ key }) => {
    chartFeatures.value[key] = keys.includes(key);
  });
}

const playerHistory = shallowRef([]);

function loadHistograms() {
  histogramsLoading.value = true;
  $fetch(
    `${runtimeConfig.public.apiUrl}/wacca/music/${song.value.id}/histogram`
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
    `${runtimeConfig.public.apiUrl}/wacca/user/${activeCard.value}/music/${song.value.id}`
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
    (category) => category.ja === song.value.category
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
    `Charted by ${chartedBy.value}`
  ]
    .filter(Boolean)
    .join(" · ");
});

const chartDifficulties = computed(() =>
  filteredSheets.value.map((sheet, i) => ({
    name: waccaDifficulties[i].name.toUpperCase(),
    color: `difficulty-${i + 1}`,
    level: String(formatDifficulty(sheet.difficulty, false))
  }))
);

const chartData = computed(() => {
  const difficulty = chartDifficulties.value[chartView.value];
  if (!difficulty) return null;
  return {
    url: chartPath(song.value.id, chartView.value),
    info: {
      title: song.value.title,
      difficulty: chartView.value + 1,
      level: difficulty.level
    }
  };
});

const noteSpeed = ref(profile.value?.options?.[1]);

// Checks which option is picked and updates the note speed bar accodringly based on diff
// tldr will either pick speed based off current diff if default display
// or will use the users current scroll speed setting
watch(
  [() => chartFeatures.value.display, chartView, () => profile.value?.options?.[1]],
  ([display, diff, speed]) => {
    noteSpeed.value = display === "defaultColor" ? DEFAULT_NOTE_SPEEDS[diff] : speed;
  },
  { immediate: true },
);

// Sets the cosmetic display options, respects scroll speed changes after first set
const options = computed(() => {
  if (chartFeatures.value.display === "defaultColor"){
    return { 
      ...{}, 
      1: noteSpeed.value,
    };
  }
  if (chartFeatures.value.display === "userColor"){
    return { 
      ...profile.value?.options, 
      1: noteSpeed.value,
    };
  }
});

// Like in game (and on the settings page): option 0-50 shows as ×1.0 to ×6.0
function formatSpeed(value) {
  return `×${(value / 10 + 1).toFixed(1)}`;
}

useSeoMeta({
  title: `Mithical | ${getTitle.value}`,
  ogTitle: `Mithical | ${getTitle.value}`,
  ogSiteName: "Mithical",
  description: ogDescription,
  ogDescription,
  ogImage: () => `${useRequestURL().origin}${fullUrl.value}`,
  ogUrl: () => useRequestURL().href,
  twitterCard: "summary_large_image"
});
</script>
