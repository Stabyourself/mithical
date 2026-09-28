<template>
  <v-container class="playfield-lab">
    <div class="lab-controls">
      <v-autocomplete
        v-model="songId"
        :items="songs"
        item-title="title"
        item-value="id"
        label="Song"
        density="compact"
        variant="outlined"
        hide-details
        clearable
        placeholder="Demo chart"
        :loading="loading"
        class="lab-song"
      ></v-autocomplete>
      <v-btn-toggle
        v-if="!song"
        v-model="demo"
        mandatory
        density="compact"
        variant="outlined"
        divided
      >
        <v-btn
          v-for="(entry, index) in DEMOS"
          :key="entry.url"
          :value="index"
          >{{ entry.label }}</v-btn
        >
      </v-btn-toggle>
      <v-btn-toggle
        v-else
        v-model="difficulty"
        mandatory
        density="compact"
        variant="outlined"
        divided
      >
        <v-btn
          v-for="(label, index) in DIFFICULTIES"
          :key="label"
          :value="index + 1"
          :disabled="!song?.sheets[index]"
        >
          {{ label }}
        </v-btn>
      </v-btn-toggle>
    </div>

    <div class="lab-controls">
      <v-slider
        v-model="noteSpeed"
        :min="0"
        :max="50"
        :step="1"
        :label="`Speed ${formatSpeed(noteSpeed)}`"
        density="compact"
        hide-details
        thumb-label
        class="lab-speed"
      >
        <template #thumb-label="{ modelValue }">{{
          formatSpeed(modelValue)
        }}</template>
      </v-slider>
      <v-switch
        v-model="mirror"
        label="Mirror"
        density="compact"
        hide-details
        color="primary"
      ></v-switch>
      <v-switch
        v-model="linear"
        label="Plain time on the strip"
        density="compact"
        hide-details
        color="primary"
        title="Place notes by time instead of scroll distance, so speed changes, stops and reverses show as spacing"
      ></v-switch>
      <v-select
        v-model="botSkill"
        :items="BOT_SKILLS"
        label="Bot"
        density="compact"
        variant="outlined"
        hide-details
        class="lab-bot"
      ></v-select>
    </div>

    <!-- What the preview component can turn on and off -->
    <div class="lab-controls lab-toggles">
      <v-switch
        v-for="toggle in TOGGLES"
        :key="toggle.key"
        v-model="toggles[toggle.key]"
        :label="toggle.label"
        :title="toggle.title"
        density="compact"
        hide-details
        color="primary"
      ></v-switch>
    </div>

    <!-- Moves the same elements into the lightbox so the song keeps running -->
    <Teleport to="body" :disabled="!expanded">
      <div :class="{ 'lab-lightbox': expanded }" @click.self="expanded = false">
        <div class="lab-stage">
          <div class="lab-views">
            <WaccaPlayfieldCanvas
              :controller="controller"
              view="unrolled"
              :options="options"
              :features="stripFeatures"
            />
            <WaccaPlayfieldCanvas
              :controller="controller"
              :options="options"
              :features="toggles"
              :chart-info="chart?.info ?? null"
            />
          </div>

          <WaccaPlayfieldControls :controller="controller">
            <v-btn
              icon
              variant="text"
              size="small"
              :aria-label="expanded ? 'Exit fullscreen' : 'Fullscreen'"
              :title="expanded ? 'Exit fullscreen' : 'Fullscreen'"
              @click="expanded = !expanded"
            >
              <v-icon>{{
                expanded ? "mdi-fullscreen-exit" : "mdi-fullscreen"
              }}</v-icon>
            </v-btn>
          </WaccaPlayfieldControls>
        </div>
      </div>
    </Teleport>
  </v-container>
</template>

<style scoped>
.playfield-lab {
  max-width: 1400px;
}

.lab-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px 24px;
  margin-bottom: 12px;
}

.lab-song {
  flex: 1 1 280px;
}

.lab-speed {
  flex: 1 1 200px;
}

.lab-bot {
  flex: 0 1 180px;
}

.lab-toggles {
  gap: 0 24px;
}

/* Strip and circle side by side, the same height. Stacked on phones */
.lab-views {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  align-items: start;
}

@media (max-width: 700px) {
  .lab-views {
    grid-template-columns: 1fr;
  }
}

/* Lightbox: both views as big as the window allows, with the bar (52px) under them */
.lab-lightbox {
  position: fixed;
  inset: 0;
  z-index: 2400;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.85);
}

.lab-lightbox .lab-stage {
  width: min(100vw - 32px, (100vh - 32px - 52px) * 2 + 16px);
}

/* Stacked, so they share the height */
@media (max-width: 700px) {
  .lab-lightbox .lab-stage {
    width: min(100vw - 32px, (100vh - 32px - 52px - 16px) / 2);
  }
}
</style>

<script setup>
// Test page: one song shown both as the round playfield and unrolled into a strip.
// Pick a chart with ?song=2082&difficulty=3 (1-4, normal to inferno), a demo otherwise (?demo=1)
import getSongs, { getSongById } from "~/assets/wacca/getSongs.js";
import { chartPath } from "~/assets/wacca/playfield/merChart.js";
import { formatDifficulty } from "~/assets/js/util";

const DIFFICULTIES = ["Normal", "Hard", "Expert", "Inferno"];
// Charts for when no song is picked. The second is the same with only the right half unmasked
const DEMOS = [
  { label: "Demo", url: "/wacca/demo.mer" },
  { label: "Half masked", url: "/wacca/demo-half-mask.mer" }
];
// Bot skills are named after the worst grade the bot gets. No bot leaves the playing to you
const BOT_SKILLS = [
  { title: "No bot", value: "none" },
  ...["all-marvelous", "great-up", "good-up", "miss-up"].map((value) => ({
    title: value,
    value
  }))
];

const version = useState("version");
const songVersion = computed(() => version.value ?? 400);
const songs = computed(() => getSongs(songVersion.value));

// Song and difficulty live in the url, so a chart can be linked
const route = useRoute();
const router = useRouter();
const songId = computed({
  get: () => (route.query.song ? Number(route.query.song) : null),
  set: (id) => {
    const next = getSongById(songVersion.value, id);
    // Keep the difficulty if the new song has it, else its hardest
    const keep = next?.sheets[difficulty.value - 1]
      ? difficulty.value
      : next?.sheets.length;
    router.replace({
      query: {
        ...route.query,
        song: id ?? undefined,
        difficulty: id ? keep : undefined
      }
    });
  }
});
const song = computed(() =>
  songId.value ? getSongById(songVersion.value, songId.value) : null
);
const difficulty = computed({
  get: () => Number(route.query.difficulty) || song.value?.sheets.length || 3,
  set: (value) =>
    router.replace({ query: { ...route.query, difficulty: value } })
});

const demo = computed({
  get: () => (DEMOS[Number(route.query.demo)] ? Number(route.query.demo) : 0),
  set: (value) =>
    router.replace({ query: { ...route.query, demo: value || undefined } })
});

const chart = computed(() => {
  const sheet = song.value?.sheets[difficulty.value - 1];
  if (!sheet) return null;
  return {
    url: chartPath(song.value.id, difficulty.value - 1),
    info: {
      title: song.value.title,
      difficulty: difficulty.value,
      level: String(formatDifficulty(sheet.difficulty, false))
    }
  };
});

const noteSpeed = ref(5);
// Like in game (and on the settings page): option 0-50 shows as ×1.0 to ×6.0
function formatSpeed(value) {
  return `×${(value / 10 + 1).toFixed(1)}`;
}
const mirror = ref(false);
const linear = ref(false);
const botSkill = ref("good-up");

// Profile options by id: note speed and mirror, the rest at their defaults
const options = computed(() => ({
  1: noteSpeed.value,
  101: mirror.value ? 1 : 0
}));
// Features of the preview, see WaccaPlayfieldPreview. Judging is the song's, the rest the views'
const TOGGLES = [
  {
    key: "judging",
    label: "Judging",
    title: "Ratings, misses and dropped holds. Off, unhit notes just pass by"
  },
  {
    key: "ring",
    label: "Console ring",
    title:
      "The LEDs around the round view and under the strip. Off, the lanes fill the space"
  },
  { key: "songCount", label: "Song count", title: '"1/3 Song" on the ring' },
  { key: "score", label: "Score", title: "The score on the ring" },
  {
    key: "progressBar",
    label: "Clear gauge",
    title: "The bar in the round view"
  }
];
const toggles = reactive(
  Object.fromEntries(TOGGLES.map(({ key }) => [key, true]))
);
const stripFeatures = computed(() => ({
  linear: linear.value,
  ring: toggles.ring
}));

const controller = usePlayfieldSession({
  chartUrl: () => chart.value?.url ?? DEMOS[demo.value].url,
  options: () => options.value,
  features: () => ({
    judging: toggles.judging,
    ...(botSkill.value === "none"
      ? { autoplay: false }
      : { autoplay: true, botSkill: botSkill.value })
  })
});
const { loading } = controller;
const expanded = useLightbox();
</script>
