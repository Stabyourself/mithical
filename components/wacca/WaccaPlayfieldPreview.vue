<template>
  <div class="playfield-preview">
    <!-- Holds the spot in the layout while in the lightbox -->
    <div v-if="expanded" class="playfield-placeholder"></div>

    <!-- Moves the same elements so the demo keeps running -->
    <Teleport to="body" :disabled="!expanded">
      <div
        :class="{ 'playfield-lightbox': expanded }"
        @click.self="expanded = false"
      >
        <div class="playfield-stage">
          <WaccaPlayfieldCanvas
            :key="view"
            :view="view"
            :controller="controller"
            :options="options"
            :features="features"
            :chart-info="chartInfo"
          />

          <WaccaPlayfieldControls :controller="controller">
            <v-btn
              icon
              variant="text"
              size="small"
              :aria-label="expanded ? 'Exit fullscreen' : 'Fullscreen preview'"
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
  </div>
</template>

<style scoped>
.playfield-preview {
  width: min(100%, 825px);
  margin: 0 auto 32px;
}

/* Same size as the preview plus the toolbar */
.playfield-placeholder {
  aspect-ratio: 1 / 1;
  margin-bottom: 52px;
}

/* Lightbox: as big as the window allows */
.playfield-lightbox {
  position: fixed;
  inset: 0;
  z-index: 2400;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.85);
}

.playfield-lightbox .playfield-stage {
  width: min(100vw - 32px, 100vh - 32px - 52px);
}

</style>

<script setup>
// The round playfield preview with its controls, a song with one view
const props = defineProps({
  // Profile options by id
  options: {
    type: Object,
    default: () => ({}),
  },
  // MER chart to play, fetched from public/
  chartUrl: {
    type: String,
    default: null,
  },
  // { title, difficulty (1-4), level } for the ring, null for the demo
  chartInfo: {
    type: Object,
    default: null,
  },
  // Console LEDs around the screen. Off, the screen grows to fill the space
  ring: {
    type: Boolean,
    default: true,
  },
  // Bot plays when nobody else is
  autoplay: {
    type: Boolean,
    default: true,
  },
  // Ratings, misses and dropped holds. Off, unhit notes just pass by
  judging: {
    type: Boolean,
    default: true,
  },
  // "1/3 Song" on the ring
  songCount: {
    type: Boolean,
    default: true,
  },
  // Ring score and its "SCORE" label
  score: {
    type: Boolean,
    default: true,
  },
  // Clear gauge
  progressBar: {
    type: Boolean,
    default: true,
  },
  // How well the bot plays, named after the worst grade it gets
  botSkill: {
    type: String,
    default: "all-marvelous",
    validator: (value) => ["miss-up", "good-up", "great-up", "all-marvelous"].includes(value),
  },
  view: {
    type: String,
    default: "circle",
    validator: (value) => ["circle", "unrolled"].includes(value),
  },
});
const features = computed(() => ({
  ring: props.ring,
  autoplay: props.autoplay,
  judging: props.judging,
  songCount: props.songCount,
  score: props.score,
  progressBar: props.progressBar,
  botSkill: props.botSkill,
}));

const controller = usePlayfieldSession({
  chartUrl: () => props.chartUrl,
  options: () => props.options,
  features: () => features.value,
});

const expanded = useLightbox();
</script>
