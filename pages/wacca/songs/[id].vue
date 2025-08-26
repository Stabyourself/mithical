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
              'url(/wacca/img/games/' + song.gameVersion + '.png)',
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
        :selected-difficulty="yourScoreDifficulty"
        :on-difficulty-click="selectYourScoreDifficulty"
      />
      <WaccaChart
        ref="chart"
        :player-history="playerHistory"
        :loading="playerHistoryLoading"
        :song="song"
        :difficulty-filter="yourScoreDifficulty"
      />
    </v-container>

    <v-container class="elevation-1 mt-4">
      <h2 class="container-heading">
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
            :color="waccaDifficulties[histogram.music_difficulty - 1].color"
            :label="waccaDifficulties[histogram.music_difficulty - 1].name"
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
      <div class="song-sheets difficulty-selection mt-4">
        <div
          v-for="(difficulty, i) in filteredSheets"
          :key="i"
          class="song-difficulty"
        >
          <WaccaDifficultyPill
            v-ripple
            :i="i + 1"
            :difficulty="difficulty.difficulty"
            :class="{ active: i + 1 == selectedDifficulty }"
            @click="selectDifficulty(i + 1)"
          />
        </div>
      </div>

      <div v-if="leaderboardsLoading" class="d-flex justify-center py-5">
        <v-progress-circular
          indeterminate
          color="primary"
          :size="80"
          :width="10"
          class="mt-4"
        ></v-progress-circular>
      </div>

      <div v-else>
        <v-alert v-if="leaderboardsLoadingError" type="error" class="mt-4">{{
          leaderboardsLoadingError
        }}</v-alert>

        <div v-else>
          <h3 class="your-rank">
            Your Rank: {{ getRankDescription(profile.user_name) }}
          </h3>
          <v-table>
            <thead>
              <tr>
                <th width="1%">Rank</th>
                <th>Name</th>
                <th>Score</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="(score, i) in highscores"
                :key="i"
                :class="{ highlight: score.user_name == profile.user_name }"
              >
                <td class="text-right">
                  <span v-if="i == 0 || highscores[i - 1].score != score.score">
                    {{ i + 1 }}
                  </span>
                </td>
                <td>
                  <WaccaIcon
                    class="highscore-icon"
                    :icon="score.user_icon_id"
                  />
                  {{ score.user_name }}
                </td>
                <td>
                  <WaccaGrade
                    class="highscore-grade"
                    :grade="fillGrade(score.grade, score.score)"
                  />
                  {{ score.score }}
                </td>
                <td>{{ formatDateLeaderboard(score.user_play_date) }}</td>
              </tr>

              <tr v-if="highscores.length === 0">
                <td colspan="5" class="text-center">No scores yet!</td>
              </tr>
            </tbody>
          </v-table>
        </div>
      </div>
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
}

.single-song-details {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  background-size: 150px;
  background-position: bottom 10px right 10px;
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

.highscore-grade,
.highscore-icon {
  height: 40px;
  vertical-align: middle;
}

.histograms {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 300px 300px;
  gap: 10px;

  .histogram {
    width: 100%;
    height: 100%;
  }

  @media (max-width: 600px) {
    grid-template-columns: 100%;
    grid-template-rows: 300px 300px 300px 300px;
  }
}

.difficulty-selection {
  :deep(.song-difficulty-pill) {
    cursor: pointer;
  }
}

tr.highlight {
  background-color: rgba(var(--v-theme-primary), 0.1);
}

.your-rank {
  margin-top: 16px;
  margin-left: 16px;
}
</style>

<script setup>
import { Chart, registerables } from "chart.js";
import "chartjs-adapter-moment";
import zoomPlugin from "chartjs-plugin-zoom";
import annotationPlugin from "chartjs-plugin-annotation";

Chart.register(zoomPlugin);
Chart.register(...registerables);
Chart.register(annotationPlugin);

import getSongs from "~/assets/wacca/getSongs.js";
import waccaDifficulties from "~/assets/wacca/waccaDifficulties";
import waccaGradeBorders from "~/assets/wacca/waccaGradeBorders";
import waccaCategories from "~/assets/wacca/waccaCategories";

const profile = useState("profile");

definePageMeta({
  middleware: ["auth"],
});

const runtimeConfig = useRuntimeConfig();
const route = useRoute();
const activeCard = useState("activeCard");
const version = useState("version");

const song = computed(() => {
  return getSongs(version.value).find(
    (song) => song.id === parseInt(route.params.id)
  );
});

const fullUrl = computed(() => {
  return `/wacca/img/covers/${song.value.imageName}`;
});

const filteredSheets = computed(() => {
  return song.value.sheets.filter(
    (sheet) => sheet.gameVersion <= version.value
  );
});

const yourScoreDifficulty = ref(null);
const selectedDifficulty = ref(filteredSheets.value.length);
const highscores = ref([]);
const leaderboardsLoading = ref(false);
const leaderboardsLoadingError = ref();
const histograms = ref([]);
const histogramsLoading = ref(false);
const histogramsLoadingError = ref();

const playerHistory = ref([]);

function sortScores(scores) {
  return scores.sort((a, b) => {
    // When score is identical, prefer the user who achieved it first
    if (a.score === b.score) {
      return new Date(a.user_play_date) - new Date(b.user_play_date);
    }
    return b.score - a.score;
  });
}

function getRankDescription(username) {
  if (!highscores.value) {
    return "Unknown";
  }

  // If there is more than one user with the same score, the displayed rank is equal to the first listed player with that score
  let playerRank;
  let currentRanking;
  let currentScore;
  for (let i = 0; i < highscores.value.length; i++) {
    if (!currentScore || highscores.value[i].score < currentScore) {
      currentScore = highscores.value[i].score;
      currentRanking = i + 1;
    }
    if (highscores.value[i].user_name === username) {
      playerRank = currentRanking;
      break;
    }
  }

  const scoreCount =
    highscores.value.length === 100 ? "100+" : highscores.value.length;

  return !playerRank ? "Unranked" : `${playerRank} / ${scoreCount}`;
}

function loadData() {
  leaderboardsLoading.value = ref(true);
  $fetch(
    `${runtimeConfig.public.apiUrl}/wacca/music/${song.value.id}/highscores/${selectedDifficulty.value}`
  )
    .then((data) => {
      leaderboardsLoading.value = false;
      highscores.value = sortScores(data);
      leaderboardsLoadingError.value = null;
    })
    .catch((err) => {
      leaderboardsLoading.value = false;
      leaderboardsLoadingError.value =
        "Couldn't reach the API. Please try again later.";
    });
}

function loadHistograms() {
  histogramsLoading.value = ref(true);
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
  // setTimeout is necessary so the chart reloads on the next update cycle, after yourScoreDifficulty is updated.
  setTimeout(() => {
    if (chart.value) {
      chart.value.difficultyFilter(filterValue);
    }
  }, 0);
}

function selectDifficulty(difficulty) {
  selectedDifficulty.value = difficulty;
  loadData();
}
loadData();
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

const chart = ref(null);

watch(playerHistory, () => {
  setTimeout(() => {
    if (chart.value) {
      chart.value.updateChart();
    }
  }, 0); //?
});
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

function formatDateLeaderboard(date) {
  if (date == "1970-01-01T00:00:00+00:00") {
    return new Date("2022-09-01T00:00:00+09:00").toLocaleString();
  }

  return new Date(date).toLocaleString();
}

function fillGrade(grade, score) {
  if (grade > 0) {
    return grade;
  }

  // infer the grade from score
  for (let i = 0; i < waccaGradeBorders.length; i++) {
    if (score >= waccaGradeBorders[i].min) {
      return waccaGradeBorders[i].grade;
    }
  }
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

useSeoMeta({
  title: `Mithical | ${getTitle.value}`,
  ogTitle: `Mithical | ${getTitle.value}`,
  description: "View your scores and the leaderboards for this song!",
  ogDescription: "View your scores and the leaderboards for this song!",
  ogImage: fullUrl.value,
  twitterCard: "summary",
});
</script>
