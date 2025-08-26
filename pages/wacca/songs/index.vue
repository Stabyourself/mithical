<template>
  <WaccaProfileRequired>
    <v-container>
      <div class="song-options">
        <v-btn-group>
          <v-btn color="primary">
            {{ activeSort.text == "Default" ? "Sorting" : activeSort.text }}

            <v-menu activator="parent">
              <v-card class="sort-menu">
                <v-btn
                  variant="plain"
                  v-for="sortOption in sortOptions"
                  :id="sortOption.text"
                  @click="clickSort(sortOption)"
                  :color="
                    activeSort.text.includes(sortOption.text) ? 'primary' : ''
                  "
                >
                  {{ sortOption.text }}

                  <v-icon v-if="sortOption.subItems">mdi-chevron-right</v-icon>

                  <v-menu
                    v-if="sortOption.subItems"
                    location="end"
                    activator="parent"
                    transition="slide-x-transition"
                  >
                    <v-card class="sort-menu">
                      <v-btn
                        variant="plain"
                        v-for="sortOptionSub in sortOption.subItems"
                        :id="sortOptionSub.text"
                        @click="clickSort(sortOptionSub)"
                        :color="
                          sortOptionSub.text == activeSort.text ? 'primary' : ''
                        "
                      >
                        {{ sortOptionSub.subText }}
                      </v-btn>
                    </v-card>
                  </v-menu>
                </v-btn>
              </v-card>
            </v-menu>
          </v-btn>

          <v-btn
            color="primary"
            @click="toggleSortDirection"
            class="sort-order-button"
          >
            <div v-if="sortOrder == 'asc'">
              <v-icon>mdi-arrow-expand-up</v-icon>
            </div>
            <div v-else>
              <v-icon>mdi-arrow-expand-down</v-icon>
            </div>
          </v-btn>
        </v-btn-group>

        <v-btn-group>
          <v-btn color="primary">
            Filters

            <v-menu activator="parent">
              <div class="song-filters" @click.stop>
                <div v-for="filter in filters" class="song-filter-row">
                  <div class="song-filter-help">
                    <div
                      v-if="filter.type == 'help'"
                      v-for="help in filter.help"
                    >
                      {{ help }}
                    </div>
                  </div>

                  <div v-if="filter.type == 'heading'">
                    <div class="song-filter-heading">{{ filter.text }}</div>
                  </div>

                  <div
                    class="song-filter-buttons"
                    v-if="filter.type == 'buttons'"
                  >
                    <div class="song-filter-label" v-if="filter.text">
                      {{ filter.text }}
                    </div>

                    <v-btn-group rounded="0" v-if="filter.subItems">
                      <v-btn
                        variant="text"
                        v-for="filterSub in filter.subItems"
                        @click="clickFilter(filter, filterSub)"
                        :color="filterSub.active ? 'primary' : ''"
                      >
                        <v-icon>{{
                          filterSub.active
                            ? filterSub.iconActive
                            : filterSub.icon
                        }}</v-icon>
                      </v-btn>
                    </v-btn-group>
                  </div>

                  <div
                    v-if="filter.type == 'range-slider'"
                    class="song-filter-range-slider"
                  >
                    <div>
                      {{ filter.text }}
                    </div>
                    <v-range-slider
                      v-model="filter.model"
                      :min="filter.min"
                      :max="filter.max"
                      :step="filter.step"
                      thumb-label
                      color="primary"
                      hide-details
                    />
                  </div>
                </div>
              </div>
            </v-menu>
          </v-btn>
        </v-btn-group>

        <v-btn-group>
          <v-btn color="primary"> Categories </v-btn>

          <v-menu activator="parent">
            <div class="song-categories" @click.stop>
              <WaccaCategoryToggle
                v-for="category in waccaCategoriesFiltered"
                :key="category.ja"
                :category="category"
                :active-categories="activeCategories"
                @click="toggleCategory(category)"
                :language="language"
              />
            </div>
          </v-menu>
        </v-btn-group>

        <v-text-field
          class="song-search"
          v-model="search"
          label="Find a Song"
          prepend-inner-icon="mdi-magnify"
          variant="solo"
          single-line
          hide-details
          clearable
          height="40"
        ></v-text-field>
      </div>

      <div class="songs-result-count">
        Showing {{ songsFiltered.length }} of {{ getSongs().length }} songs
      </div>

      <div class="songs">
        <div v-for="song in songsPaginated" :key="song.id">
          <NuxtLink
            :to="`/wacca/songs/${song.id}`"
            style="text-decoration: none"
          >
            <WaccaSong
              v-ripple="{ class: 'text-white' }"
              :song="song"
              :player-data="profile.songs[song.id]"
            />
          </NuxtLink>
        </div>

        <div v-if="songsPaginated.length == 0">
          <v-alert type="info" color="primary"
            >No songs found, try changing your search or filters!</v-alert
          >
        </div>
      </div>

      <v-pagination
        v-model="page"
        :length="Math.ceil(songsFiltered.length / perPage)"
      ></v-pagination>
    </v-container>
  </WaccaProfileRequired>
</template>

<style scoped lang="scss">
.song-options {
  display: flex;
  flex-direction: row;
  gap: 10px;
  flex-wrap: wrap;
  margin: 1em 0;
  align-items: stretch;

  > .v-btn-group {
    display: flex;
    height: auto;
    min-height: 56px;
  }
}

.sort-menu {
  display: flex;
  flex-direction: column;

  .v-btn {
    justify-content: left;
  }
}

.sort-order-button {
  border-left: 2px solid rgba(var(--v-theme-background), 0.7) !important;
}

.song-filters {
  padding: 0.5em;
  background: rgb(var(--v-theme-surface));
  overflow: auto;
  border-radius: inherit;

  box-shadow: 0px 5px 5px -3px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, 0.2)),
    0px 8px 10px 1px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.14)),
    0px 3px 14px 2px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.12));
}

.song-filter-row {
  .song-filter-buttons {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    width: 100%;
  }

  .song-filter-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    width: 100%;
    font-weight: 700;
    text-transform: uppercase;

    &:not(:first-child) {
      margin-top: 1em;
    }
    color: rgb(var(--v-theme-primary));

    &:before,
    &:after {
      content: "";
      flex-grow: 1;
      background: rgb(var(--v-theme-primary));
      height: 1px;
      font-size: 0px;
      line-height: 0px;
    }
  }

  .song-filter-help {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    opacity: 0.7;
    font-size: 0.8em;
    gap: 0;
    text-align: center;

    > div {
      width: 64px;
      display: flex;
      justify-content: center;
    }
  }

  .song-filter-range-slider {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 7px 0;

    .v-slider {
      width: 100%;
      max-width: calc(100% - 126px);
      margin-right: 32px;
    }
  }
}

.song-categories {
  background: rgb(var(--v-theme-surface));
  padding: 0.5em;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-radius: inherit;
  user-select: none;
  overflow: auto;
}

.songs-result-count {
  width: 100%;
  text-align: center;
  margin-bottom: 1em;
  opacity: 0.7;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 3px;
  margin-bottom: 20px;
  justify-content: center;
}

.option {
  margin-bottom: 1rem;

  .option-heading {
    font-weight: bold;
  }
}

@media (max-width: 500px) {
  .song-filter-buttons {
    gap: 2px !important;
  }

  .song-filter-buttons button {
    padding: 0 12px !important;
    min-width: 0 !important;
  }

  .song-filter-help > div {
    width: 42px !important;
    font-size: 0.8em;
  }
}
</style>

<script setup>
import fuzzysort from "fuzzysort";
import getSongs from "~/assets/wacca/getSongs.js";
import waccaDifficulties from "~/assets/wacca/waccaDifficulties";
import waccaCategories from "~/assets/wacca/waccaCategories";

const language = useState("language");
const profile = useState("profile");
const version = useState("version");

definePageMeta({
  middleware: ["auth"],
  keepalive: true,
});

const sortOptions = [
  {
    text: "Default",
    sortFunction: () => {
      return sortOrder.value == "asc" ? 1 : -1;
    },
  },
  {
    text: "Title",
    sortFunction: (a, b) => {
      let aTitle = a.titleEnglish || a.title;
      let bTitle = b.titleEnglish || b.title;

      if (language.value == "ja") {
        aTitle = a.title;
        bTitle = b.title;
      }

      if (sortOrder.value == "asc") {
        return aTitle.localeCompare(bTitle);
      } else {
        return bTitle.localeCompare(aTitle);
      }
    },
  },
  {
    text: "Artist",
    sortFunction: (a, b) => {
      if (sortOrder.value == "asc") {
        return a.artist.localeCompare(b.artist);
      } else {
        return b.artist.localeCompare(a.artist);
      }
    },
  },
  {
    text: "Play Count",
    defaultSort: "desc",
    sortFunction(a, b) {
      if (sortOrder.value == "asc") {
        return (
          (profile.value.songs[a.id]?.playCount ?? 0) -
          (profile.value.songs[b.id]?.playCount ?? 0)
        );
      } else {
        return (
          (profile.value.songs[b.id]?.playCount ?? 0) -
          (profile.value.songs[a.id]?.playCount ?? 0)
        );
      }
    },
  },
  {
    text: "Rating",
    defaultSort: "desc",
    sortFunction(a, b) {
      if (sortOrder.value == "asc") {
        return (
          (profile.value.songs[a.id]?.rating ?? 0) -
          (profile.value.songs[b.id]?.rating ?? 0)
        );
      } else {
        return (
          (profile.value.songs[b.id]?.rating ?? 0) -
          (profile.value.songs[a.id]?.rating ?? 0)
        );
      }
    },
  },
  {
    text: "Difficulty",
    subItems: [
      {
        text: "Normal Difficulty",
        subText: "Normal",
        sortFunction(a, b) {
          if (sortOrder.value == "asc") {
            return a.sheets[0].difficulty - b.sheets[0].difficulty;
          } else {
            return b.sheets[0].difficulty - a.sheets[0].difficulty;
          }
        },
      },
      {
        text: "Hard Difficulty",
        subText: "Hard",
        sortFunction(a, b) {
          if (sortOrder.value == "asc") {
            return a.sheets[1].difficulty - b.sheets[1].difficulty;
          } else {
            return b.sheets[1].difficulty - a.sheets[1].difficulty;
          }
        },
      },
      {
        text: "Expert Difficulty",
        subText: "Expert",
        sortFunction(a, b) {
          if (sortOrder.value == "asc") {
            return a.sheets[2].difficulty - b.sheets[2].difficulty;
          } else {
            return b.sheets[2].difficulty - a.sheets[2].difficulty;
          }
        },
      },
      {
        text: "Inferno Difficulty",
        subText: "Inferno",
        sortFunction(a, b) {
          let aDiff = 16;
          let bDiff = 16;

          if (a.sheets[3] && a.sheets[3].gameVersion <= version.value) {
            aDiff = a.sheets[3].difficulty;
          }

          if (b.sheets[3] && b.sheets[3].gameVersion <= version.value) {
            bDiff = b.sheets[3].difficulty;
          }

          if (sortOrder.value == "asc") {
            return aDiff - bDiff;
          } else {
            return bDiff - aDiff;
          }
        },
      },
    ],
  },
  {
    text: "Score",
    subItems: [
      {
        text: "Normal Score",
        subText: "Normal",
        sortFunction(a, b) {
          if (sortOrder.value == "asc") {
            return (
              (profile.value.songs[a.id]?.scores[0]?.score ?? 1000001) -
              (profile.value.songs[b.id]?.scores[0]?.score ?? 1000001)
            );
          } else {
            return (
              (profile.value.songs[b.id]?.scores[0]?.score ?? 0) -
              (profile.value.songs[a.id]?.scores[0]?.score ?? 0)
            );
          }
        },
      },
      {
        text: "Hard Score",
        subText: "Hard",
        sortFunction(a, b) {
          if (sortOrder.value == "asc") {
            return (
              (profile.value.songs[a.id]?.scores[1]?.score ?? 1000001) -
              (profile.value.songs[b.id]?.scores[1]?.score ?? 1000001)
            );
          } else {
            return (
              (profile.value.songs[b.id]?.scores[1]?.score ?? 0) -
              (profile.value.songs[a.id]?.scores[1]?.score ?? 0)
            );
          }
        },
      },
      {
        text: "Expert Score",
        subText: "Expert",
        sortFunction(a, b) {
          if (sortOrder.value == "asc") {
            return (
              (profile.value.songs[a.id]?.scores[2]?.score ?? 1000001) -
              (profile.value.songs[b.id]?.scores[2]?.score ?? 1000001)
            );
          } else {
            return (
              (profile.value.songs[b.id]?.scores[2]?.score ?? 0) -
              (profile.value.songs[a.id]?.scores[2]?.score ?? 0)
            );
          }
        },
      },
      {
        text: "Inferno Score",
        subText: "Inferno",
        sortFunction(a, b) {
          if (sortOrder.value == "asc") {
            return (
              (profile.value.songs[a.id]?.scores[3]?.score ?? 1000001) -
              (profile.value.songs[b.id]?.scores[3]?.score ?? 1000001)
            );
          } else {
            return (
              (profile.value.songs[b.id]?.scores[3]?.score ?? 0) -
              (profile.value.songs[a.id]?.scores[3]?.score ?? 0)
            );
          }
        },
      },
    ],
  },
];

const filters = ref([
  {
    type: "help",
    help: ["All", "No", "Yes"],
  },
  {
    type: "buttons",
    text: "Played",
    subItems: [
      {
        text: "All",
        icon: "mdi-circle-outline",
        iconActive: "mdi-circle",
        filterFunction() {
          return true;
        },
        active: true,
      },
      {
        text: "Not Played",
        icon: "mdi-close-circle-outline",
        iconActive: "mdi-close-circle",
        filterFunction(song) {
          return profile.value.songs[song.id]?.playCount == 0;
        },
      },
      {
        text: "Played",
        icon: "mdi-check-circle-outline",
        iconActive: "mdi-check-circle",
        filterFunction(song) {
          return profile.value.songs[song.id]?.playCount > 0;
        },
      },
    ],
  },
  {
    type: "buttons",
    text: "Favorite",
    subItems: [
      {
        text: "All",
        icon: "mdi-circle-outline",
        iconActive: "mdi-circle",
        filterFunction() {
          return true;
        },
        active: true,
      },
      {
        text: "Not a favorite",
        icon: "mdi-close-circle-outline",
        iconActive: "mdi-close-circle",
        filterFunction(song) {
          return !profile.value.songs[song.id]?.favorite;
        },
      },
      {
        text: "Is a favorite",
        icon: "mdi-check-circle-outline",
        iconActive: "mdi-check-circle",
        filterFunction(song) {
          return profile.value.songs[song.id]?.favorite;
        },
      },
    ],
  },
  {
    type: "buttons",
    text: "Has Inferno",
    subItems: [
      {
        text: "All",
        icon: "mdi-circle-outline",
        iconActive: "mdi-circle",
        filterFunction() {
          return true;
        },
        active: true,
      },
      {
        text: "No",
        icon: "mdi-close-circle-outline",
        iconActive: "mdi-close-circle",
        filterFunction(song) {
          return (
            song.sheets.filter((sheet) => sheet.gameVersion <= version.value)
              .length <= 3
          );
        },
      },
      {
        text: "Yes",
        icon: "mdi-check-circle-outline",
        iconActive: "mdi-check-circle",
        filterFunction(song) {
          return (
            song.sheets.filter((sheet) => sheet.gameVersion <= version.value)
              .length > 3
          );
        },
      },
    ],
  },
  // {
  //   type: "buttons",
  //   text: "Contributes to rating",
  //   subItems: [
  //     {
  //       text: "All",
  //       icon: "mdi-circle-outline",
  //       iconActive: "mdi-circle",
  //       filterFunction() {
  //         return true;
  //       },
  //       active: true,
  //     },
  //     {
  //       text: "No",
  //       icon: "mdi-close-circle-outline",
  //       iconActive: "mdi-close-circle",
  //       filterFunction(song) {
  //         return true;
  //       },
  //     },
  //     {
  //       text: "Yes",
  //       icon: "mdi-check-circle-outline",
  //       iconActive: "mdi-check-circle",
  //       filterFunction(song) {
  //         return true;
  //       },
  //     },
  //   ],
  // },
  {
    type: "heading",
    text: "Clear Status",
  },
  {
    type: "help",
    help: [
      "All",
      "Uncleared",
      "Clear",
      "Missless",
      "Full Combo",
      "All Marvelous",
    ],
  },
]);

for (let i = 0; i < waccaDifficulties.length; i++) {
  filters.value.push({
    type: "buttons",
    text: waccaDifficulties[i].name,
    subItems: [
      {
        text: "All",
        icon: "mdi-circle-outline",
        iconActive: "mdi-circle",
        filterFunction() {
          return true;
        },
        active: true,
      },
      {
        text: "Uncleared",
        icon: "mdi-close-circle-outline",
        iconActive: "mdi-close-circle",
        filterFunction(song) {
          return (
            !profile.value.songs[song.id].scores[i] ||
            profile.value.songs[song.id].scores[i].clear_count == 0
          );
        },
      },
      {
        text: "Clear",
        icon: "mdi-alpha-c-circle-outline",
        iconActive: "mdi-alpha-c-circle",
        filterFunction(song) {
          return profile.value.songs[song.id]?.scores[i]?.clear_count > 0;
        },
      },
      {
        text: "Missless",
        icon: "mdi-alpha-m-circle-outline",
        iconActive: "mdi-alpha-m-circle",
        filterFunction(song) {
          return profile.value.songs[song.id]?.scores[i]?.missless_count > 0;
        },
      },
      {
        text: "Full Combo",
        icon: "mdi-alpha-f-circle-outline",
        iconActive: "mdi-alpha-f-circle",
        filterFunction(song) {
          return profile.value.songs[song.id]?.scores[i]?.full_combo_count > 0;
        },
      },
      {
        text: "All Marvelous",
        icon: "mdi-alpha-a-circle-outline",
        iconActive: "mdi-alpha-a-circle",
        filterFunction(song) {
          return (
            profile.value.songs[song.id]?.scores[i]?.all_marvelous_count > 0
          );
        },
      },
    ],
  });
}

filters.value.push({
  type: "heading",
  text: "Score",
});

// leaving this here in case it turns out I need to debounce it
// function debounce(fn, wait) {
//   let timer;
//   return function (...args) {
//     if (timer) {
//       clearTimeout(timer); // clear any pre-existing timer
//     }
//     const context = this; // get the current context
//     timer = setTimeout(() => {
//       fn.apply(context, args); // call the function if time expires
//     }, wait);
//   };
// }

for (let i = 0; i < waccaDifficulties.length; i++) {
  let model = ref([0, 1000000]);
  // let modelDebounced = ref([0, 1000000]);

  // let debounced = debounce(() => {
  //   modelDebounced.value = model.value;
  // }, 0);

  // watch(model, () => {
  //   debounced();
  // });

  filters.value.push({
    type: "range-slider",
    text: waccaDifficulties[i].name,
    min: 0,
    max: 1000000,
    model: model,
    step: 10000,
    filterFunction(song) {
      if (!profile.value) {
        return true;
      }

      let score = profile.value.songs[song.id]?.scores[i]?.score ?? 0;

      return score >= model.value[0] && score <= model.value[1];
    },
  });
}

const perPage = 50;
const page = ref(1);
const search = ref(null);
const activeSort = ref(sortOptions[0]);
const sortOrder = ref("asc");
const activeCategories = ref([]);

function toggleCategory(category) {
  if (activeCategories.value.includes(category.ja)) {
    activeCategories.value = activeCategories.value.filter(
      (c) => c != category.ja
    );
  } else {
    activeCategories.value.push(category.ja);
  }
}

const waccaCategoriesFiltered = computed(() => {
  return waccaCategories.filter((category) => {
    return !category.hidden;
  });
});

const songsFiltered = computed(() => {
  let results = [...getSongs(version.value)];

  // filter out songs based on selected version (reverse or plus)
  results = results.filter((song) => {
    return song.gameVersion <= version.value;
  });

  // category
  // no category = all categories
  let compareCategories = [...activeCategories.value];

  if (compareCategories.length == 0) {
    compareCategories = waccaCategories.map((category) => category.ja);
  }

  // Tanoc original doesn't exist in game, so this code adds it to the cats
  if (compareCategories.includes("TANO*C")) {
    compareCategories.push("TANO*C（オリジナル）");
  }

  results = results.filter((song) => {
    return compareCategories.includes(song.category);
  });

  // filters
  filters.value.forEach((filter) => {
    if (filter.type == "buttons") {
      filter.subItems.forEach((filterSub) => {
        if (filterSub.active) {
          results = results.filter(filterSub.filterFunction);
        }
      });
    } else if (filter.type == "range-slider") {
      results = results.filter(filter.filterFunction);
    }
  });

  // search
  if (search.value && search.value.length > 2) {
    // perform search
    results = fuzzysort
      .go(search.value, results, {
        keys: ["title", "artist", "titleEnglish"],
      })
      .map((result) => result.obj);
  }

  // sort
  results = results.sort(activeSort.value.sortFunction);

  return results;
});

function clickSort(sortOption) {
  if (activeSort.value.text == sortOption.text) {
    // clicked the same
    if (sortOrder.value == "asc") {
      sortOrder.value = "desc";
    } else {
      sortOrder.value = "asc";
    }
  } else {
    // new sort
    if (!sortOption.subItems) {
      sortOrder.value = sortOption.defaultSort ?? "asc";
      activeSort.value = sortOption;
    }
  }
}

function toggleSortDirection() {
  if (sortOrder.value == "asc") {
    sortOrder.value = "desc";
  } else {
    sortOrder.value = "asc";
  }
}

function clickFilter(coFilter, coFilterSub) {
  let filter = filters.value.find((filter) => filter.text == coFilter.text);
  let filterSub = filter.subItems.find(
    (filterSub) => filterSub.text == coFilterSub.text
  );

  filter.subItems.forEach((filterSub) => {
    filterSub.active = false;
  });
  filterSub.active = true;
}

const songsPaginated = computed(() => {
  return songsFiltered.value.slice(
    (page.value - 1) * perPage,
    page.value * perPage
  );
});

// reset page to 1 if the song list changes
watch(songsFiltered, () => {
  page.value = 1;
});
</script>
