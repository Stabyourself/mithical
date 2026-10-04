<template>
  <WaccaProfileRequired>
    <v-container>
      <div class="rating-folders">
        <button
          v-for="(folder, i) in sheetFolders"
          :key="i"
          type="button"
          class="rating-folder"
          :class="{ active: tab == i }"
          @click="tab = i"
        >
          <div class="rating-folder-name">{{ folder.name }}</div>
          <div class="rating-folder-rating">
            {{ folder.rating.toFixed(3) }}
          </div>
          <div class="rating-folder-count">Top {{ folder.count }} songs</div>
        </button>
      </div>

      <v-window v-model="tab">
        <div v-for="(folder, i) in sheetFolders" :key="i" v-show="tab == i">
          <div class="rating-holder">
            <div v-for="(sheet, j) in folder.sheets" :key="sheet">
              <div class="rating-entry">
                <div class="rating-song" role="button" @click="toggle(sheet)">
                  <div class="rating-cover">
                    <div class="rating-jacket">
                      <WaccaJacket :url="sheet.song.imageName" />
                    </div>
                    <div
                      class="rating-level"
                      :class="`difficulty-${sheet.difficulty}`"
                    >
                      {{
                        formatDifficulty(
                          sheet.song.sheets[sheet.difficulty].difficulty,
                          difficultyInternal,
                          true
                        )
                      }}
                    </div>
                  </div>

                  <div class="rating-info">
                    <div class="rating-title">
                      {{ getTitle(sheet.song) }}
                    </div>

                    <div class="rating-rating" v-if="sheet.rating">
                      <v-icon
                        v-if="sheet.nextScore === undefined"
                        class="rating-star"
                        color="amber"
                        size="x-small"
                      >
                        mdi-star
                      </v-icon>
                      <WaccaRating
                        :rating="sheet.rating"
                        :divide="50"
                        :simple="true"
                        :decimals="3"
                      />
                    </div>

                    <v-icon>
                      {{
                        isExpanded(sheet)
                          ? "mdi-chevron-up"
                          : "mdi-chevron-down"
                      }}
                    </v-icon>
                  </div>
                </div>

                <div v-if="isExpanded(sheet)" class="rating-details">
                  <table v-if="nextBorders(sheet, folder).length">
                    <thead>
                      <tr>
                        <th>Score</th>
                        <th>
                          Needed
                          <v-tooltip activator="parent" location="top">
                            How much you need to PB by
                          </v-tooltip>
                        </th>
                        <th>
                          Song
                          <v-tooltip activator="parent" location="top">
                            How much rating this song will gain
                          </v-tooltip>
                        </th>
                        <th>
                          Profile
                          <v-tooltip activator="parent" location="top">
                            How much rating your profile will gain
                          </v-tooltip>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="border in nextBorders(sheet, folder)"
                        :key="border.score"
                      >
                        <td>{{ border.score.toLocaleString("en-US") }}</td>
                        <td>+{{ border.needed.toLocaleString("en-US") }}</td>
                        <td>+{{ border.songGain.toFixed(3) }}</td>
                        <td>+{{ border.profileGain.toFixed(3) }}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div v-else class="rating-max">
                    Highest possible rating already achieved. Yay!
                  </div>

                  <v-btn
                    class="rating-link"
                    color="primary"
                    rounded="pill"
                    variant="flat"
                    :to="`/songs/${getSlug(sheet.song)}`"
                  >
                    Go to song
                  </v-btn>
                </div>
              </div>
              <div v-if="j == folder.count - 1" class="cutoff">
                <v-icon>mdi-content-cut</v-icon>
                Cutoff
                <v-icon>mdi-content-cut mdi-rotate-180</v-icon>
              </div>
            </div>
          </div>
        </div>
      </v-window>
    </v-container>
  </WaccaProfileRequired>
</template>

<style scoped lang="scss">
.rating-folders {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.rating-folder {
  padding: 10px;
  border-radius: 5px;
  border: 2px solid #333;
  background: rgb(var(--v-theme-surface));
  color: rgb(var(--v-theme-on-surface));
  text-align: center;
  opacity: 0.6;
  transition:
    opacity 0.2s,
    border-color 0.2s;

  &:hover {
    opacity: 0.85;
  }

  &.active {
    opacity: 1;
    border-color: rgb(var(--v-theme-primary));
  }
}

.rating-folder-name {
  font-weight: 700;
  overflow-wrap: anywhere;
}

.rating-folder-rating {
  font-size: 1.5em;
  font-weight: 700;
  color: rgb(var(--v-theme-primary));
}

.rating-folder-count {
  font-size: 0.8em;
  opacity: 0.7;
}

.rating-holder {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin: 10px 0;
}

.rating-entry {
  border-radius: 5px;
  border: 1px solid #333;
  background: rgb(var(--v-theme-surface));
  overflow: hidden;
}

.rating-song {
  color: var(--v-text-primary);
  display: flex;
  cursor: pointer;
}

.rating-details {
  padding: 10px;
  border-top: 1px solid #333;
  display: flex;
  flex-direction: column;
  gap: 10px;

  table {
    border-collapse: collapse;
    width: 100%;
  }

  th,
  td {
    padding: 4px 8px;
    text-align: right;
  }

  th:not(:first-child) {
    cursor: help;
  }

  th:first-child,
  td:first-child {
    text-align: left;
  }

  tbody tr:nth-child(odd) {
    background: color-mix(
      in srgb,
      rgb(var(--v-theme-on-surface)) 5%,
      transparent
    );
  }
}

.rating-info {
  flex-grow: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-width: 0;
  padding: 10px;
  gap: 10px;

  > * {
    flex-shrink: 0;
  }
}

.rating-cover {
  display: flex;
  height: 60px;
  flex-shrink: 0;
}

.rating-jacket {
  height: 100%;
  aspect-ratio: 1;
  flex-shrink: 1;
}

.rating-level {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  font-weight: bold;
  font-size: 1rem;

  // The difficulty's theme color (these count from 0), see plugins/vuetify.ts
  @for $i from 0 through 3 {
    &.difficulty-#{$i} {
      background-color: rgb(var(--v-theme-difficulty-#{$i + 1}));
      color: rgb(var(--v-theme-on-difficulty-#{$i + 1}));
    }
  }
}

.rating-title {
  flex: 1 1 0;
  min-width: 0;
  overflow-wrap: anywhere;

  // at most 2 lines, so the title never gets taller than the jacket
  line-height: 20px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
}

.rating-max {
  text-align: center;
}

.rating-link {
  align-self: center;
}

.rating-rating {
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 700;
  font-size: 1.5em;
}

.rating-star {
  color: #ffc107;
}

.cutoff {
  display: flex;
  align-items: center;
  color: color-mix(in srgb, rgb(var(--v-theme-on-background)) 50%, transparent);
  gap: 10px;
  margin: 20px 0;
  font-size: 1.5em;
  font-weight: 400;

  &:before,
  &:after {
    content: "";
    flex-grow: 1;
    background: color-mix(
      in srgb,
      rgb(var(--v-theme-on-background)) 50%,
      transparent
    );
    height: 1px;
    font-size: 0px;
    line-height: 0px;
  }
}

.rating-suggestion {
  font-size: 0.8em;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  // The difficulty's theme color (these count from 0), see plugins/vuetify.ts
  @for $i from 0 through 3 {
    &.difficulty-#{$i} {
      color: rgb(var(--v-theme-difficulty-#{$i + 1}));
    }
  }
}
</style>

<script setup>
import { formatDifficulty } from "~/assets/js/util";
import getSongs from "~/assets/wacca/getSongs.js";
import waccaDifficulties from "~/assets/wacca/waccaDifficulties";
import getRatingBorders from "~/assets/wacca/waccaRateMulBorders";
import { getSongSlug } from "~/assets/wacca/songSlug.js";

const profile = useState("profile");
const version = useState("version");
const difficultyInternal = useState("difficultyInternal");

definePageMeta({
  middleware: ["auth"]
});

const ratingBorders = computed(() => {
  return getRatingBorders(version.value);
});

function getRating(difficulty, score) {
  for (let i = 0; i < ratingBorders.value.length; i++) {
    const border = ratingBorders.value[i];

    if (score >= border.min) {
      return border.multiplier * difficulty * 10;
    }
  }

  return 0;
}

const tab = ref(0);

const sheetFolders = computed(() => {
  const folders = [];

  folders.push({
    name: "Previous versions",
    sheets: [],
    count: 35
  });

  if (version.value <= 300) {
    folders.push({
      name: "Wacca Reverse",
      sheets: [],
      count: 15
    });
  } else {
    folders.push({
      name: "Wacca Plus",
      sheets: [],
      count: 15
    });
  }

  // calculate rating potentials
  for (const music of profile.value.music) {
    let sheet = {};
    sheet.difficulty = music.music_difficulty - 1;
    sheet.score = music.score;
    sheet.song = getSongs(version.value).find(
      (song) => song.id == music.music_id
    );

    if (
      sheet.song &&
      sheet.song.sheets[sheet.difficulty] &&
      sheet.song.sheets[sheet.difficulty].gameVersion <= version.value
    ) {
      sheet.rating = getRating(
        sheet.song.sheets[sheet.difficulty].difficulty,
        sheet.score
      );

      if (sheet.song.sheets[sheet.difficulty].gameVersion < version.value) {
        folders[0].sheets.push(sheet);
      } else {
        folders[1].sheets.push(sheet);
      }
    }
  }

  // sort by rating
  for (const folder of folders) {
    folder.sheets.sort((a, b) => {
      return b.rating - a.rating;
    });

    for (const sheet of folder.sheets) {
      // find next rating border
      let nextBorder;

      for (let i = ratingBorders.value.length - 1; i >= 0; i--) {
        const border = ratingBorders.value[i];

        if (border.min > sheet.score) {
          nextBorder = border;
          break;
        }
      }

      if (nextBorder) {
        const sheetDifficulty = sheet.song.sheets[sheet.difficulty].difficulty;

        let lowestRating = 0;
        if (folder.sheets.length >= folder.count) {
          lowestRating = folder.sheets[folder.count - 1].rating / 10;
        }

        const ratingDiff =
          nextBorder.multiplier * sheetDifficulty - sheet.rating / 10;

        let ratingGain = nextBorder.multiplier * sheetDifficulty - lowestRating;

        if (sheet.rating / 10 >= lowestRating) {
          ratingGain = ratingDiff;
        }

        sheet.nextScore = nextBorder.min;
        sheet.nextScoreDiff = nextBorder.min - sheet.score;
        sheet.nextRating = nextBorder.multiplier * sheetDifficulty;
        sheet.ratingDiff = ratingDiff;
        sheet.ratingGain = ratingGain;
      }
    }
  }

  // calculate rating for each folder
  for (const folder of folders) {
    let rating = 0;

    for (let i = 0; i < folder.count; i++) {
      if (!folder.sheets[i]) {
        break;
      }

      rating += folder.sheets[i].rating;
    }

    folder.rating = rating / 10;
  }

  return folders;
});

const getTitle = useSongTitle();

const expanded = ref({});

function sheetKey(sheet) {
  return `${sheet.song.id}-${sheet.difficulty}`;
}

function isExpanded(sheet) {
  return !!expanded.value[sheetKey(sheet)];
}

function toggle(sheet) {
  expanded.value[sheetKey(sheet)] = !isExpanded(sheet);
}

// Every rating border above the sheet's score, with the rating gained
// on the song and on the whole profile (same units as the folder rating)
function nextBorders(sheet, folder) {
  const difficulty = sheet.song.sheets[sheet.difficulty].difficulty;
  const current = sheet.rating / 10;

  let lowestRating = 0;
  if (folder.sheets.length >= folder.count) {
    lowestRating = folder.sheets[folder.count - 1].rating / 10;
  }

  return ratingBorders.value
    .filter((border) => border.min > sheet.score)
    .reverse()
    .map((border) => {
      const rating = border.multiplier * difficulty;
      const songGain = rating - current;

      return {
        score: border.min,
        needed: border.min - sheet.score,
        songGain,
        profileGain:
          current >= lowestRating
            ? songGain
            : Math.max(0, rating - lowestRating)
      };
    });
}

function getSlug(song) {
  return getSongSlug(song, getSongs(version.value));
}
</script>
