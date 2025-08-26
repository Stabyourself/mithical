<template>
  <WaccaProfileRequired>
    <v-container>
      <v-alert type="info" class="mb-2">
        <p>
          This page shows you your total rating for your top 35 and 15 songs in
          the relevant Wacca versions.
        </p>
        <p>
          Each song shows you the achieved rating, as well as a guide on how
          much rating you will gain by improving your PB to the next rating
          border.
        </p>
        <p>
          The left number shows the improvement for the song, the right number
          shows how much rating your whole profile will gain.
        </p>
      </v-alert>

      <v-tabs fixed-tabs v-model="tab" bg-color="primary">
        <v-tab v-for="(folder, i) in sheetFolders" :key="i">
          {{ folder.name }}
          <v-chip>{{ folder.count }}</v-chip>

          {{ folder.rating.toFixed(3) }}
        </v-tab>
      </v-tabs>

      <v-window v-model="tab">
        <div v-for="(folder, i) in sheetFolders" :key="i" v-show="tab == i">
          <div class="rating-holder">
            <div v-for="(sheet, j) in folder.sheets" :key="sheet">
              <NuxtLink
                style="text-decoration: none"
                :to="`/wacca/songs/${sheet.song.id}`"
                class="rating-song"
              >
                <div class="rating-jacket">
                  <WaccaJacket :url="sheet.song.imageName" />
                </div>

                <div class="rating-info">
                  <div class="rating-title">
                    {{ getTitle(sheet.song) }}
                  </div>

                  <div
                    v-if="sheet.nextScore"
                    class="rating-suggestion"
                    :class="`difficulty-${sheet.difficulty}`"
                  >
                    <div>
                      {{
                        waccaDifficulties[sheet.difficulty].name
                          .toUpperCase()
                          .slice(0, 3)
                      }}
                      +{{ sheet.nextScoreDiff }}
                    </div>
                    <div>
                      R +{{ sheet.ratingDiff.toFixed(3) }} / +{{
                        Math.max(0, sheet.ratingGain).toFixed(3)
                      }}
                    </div>
                  </div>

                  <div class="rating-difficulty" v-if="sheet.rating">
                    <WaccaDifficultyPillSmall
                      :i="sheet.difficulty + 1"
                      :difficulty="
                        sheet.song.sheets[sheet.difficulty].difficulty
                      "
                    />
                  </div>
                  <div class="rating-rating" v-if="sheet.rating">
                    <WaccaRating
                      :rating="sheet.rating"
                      :divide="50"
                      :simple="true"
                      :decimals="3"
                    />
                  </div>
                </div>
              </NuxtLink>
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
.rating-holder {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin: 10px 0;
}

.rating-song {
  color: var(--v-text-primary);
  display: flex;
  border-radius: 5px;
  border: 1px solid #333;
  background: rgb(var(--v-theme-surface));
  overflow: hidden;
}

.rating-info {
  flex-grow: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  padding: 10px;
  gap: 10px;
}

.rating-jacket {
  height: 60px;
  aspect-ratio: 1;
  flex-shrink: 1;
}

.rating-title {
  flex-grow: 1;
}

.rating-rating {
  font-weight: 700;
  font-size: 1.5em;
}

.cutoff {
  display: flex;
  align-items: center;
  color: rgba(var(--v-theme-on-background), 0.5);
  gap: 10px;
  margin: 20px 0;
  font-size: 1.5em;
  font-weight: 400;

  &:before,
  &:after {
    content: "";
    flex-grow: 1;
    background: rgba(var(--v-theme-on-background), 0.5);
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

  &.difficulty-0 {
    color: #009de6;
  }

  &.difficulty-1 {
    color: #fed131;
  }

  &.difficulty-2 {
    color: #fc06a3;
  }

  &.difficulty-3 {
    color: #4a004f;
  }
}
</style>

<script setup>
import getSongs from "~/assets/wacca/getSongs.js";
import waccaDifficulties from "~/assets/wacca/waccaDifficulties";
import getRatingBorders from "~/assets/wacca/waccaRateMulBorders";

const language = useState("language");
const profile = useState("profile");
const version = useState("version");

definePageMeta({
  middleware: ["auth"],
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
    count: 35,
  });

  if (version.value <= 300) {
    folders.push({
      name: "Wacca Reverse",
      sheets: [],
      count: 15,
    });
  } else {
    folders.push({
      name: "Wacca Plus",
      sheets: [],
      count: 15,
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

function getTitle(song) {
  if (language.value === "ja") {
    return song.title;
  }

  return song.titleEnglish || song.title;
}
</script>
