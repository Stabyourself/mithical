<template>
  <!-- One pill like a media player: play, time, seek bar, speed, then whatever goes in the slot -->
  <div class="playfield-toolbar">
    <v-btn
      icon
      variant="text"
      size="small"
      :aria-label="paused ? 'Play preview' : 'Pause preview'"
      :title="paused ? 'Play' : 'Pause'"
      @click="controller.togglePause"
    >
      <v-icon>{{ paused ? "mdi-play" : "mdi-pause" }}</v-icon>
    </v-btn>

    <button
      type="button"
      class="playfield-time"
      title="Toggle remaining time"
      @click="chartFeatures.timeRemaining = !chartFeatures.timeRemaining"
    >
      {{
        chartFeatures.timeRemaining
          ? "-" + formatTime(songLength - position)
          : formatTime(position)
      }}
      / {{ formatTime(songLength) }}
    </button>
    <v-slider
      class="playfield-scrub"
      :model-value="position"
      :max="songLength"
      color="white"
      track-color="white"
      density="compact"
      hide-details
      aria-label="Song position"
      @start="controller.scrubStart"
      @update:model-value="controller.scrub"
      @end="controller.scrubEnd"
    ></v-slider>

    <v-menu
      v-model="speedMenuOpen"
      location="top center"
      origin="bottom center"
      :z-index="2500"
      :close-on-content-click="false"
      :open-on-click="false"
    >
      <template v-slot:activator="{ props: menuProps }">
        <v-btn
          v-bind="menuProps"
          variant="text"
          size="small"
          rounded="pill"
          class="playfield-speed"
          :class="{ 'playfield-speed--dragging': speedDragging }"
          aria-label="Playback speed"
          title="Speed"
          @click="speedClick"
          @pointerdown="speedDragStart"
          @pointermove="speedDragMove"
          @pointerup="speedDragEnd"
          @pointercancel="speedDragEnd"
          @contextmenu="speedContextMenu"
        >
          {{ speed.toFixed(2) }}x
        </v-btn>
      </template>
      <v-card class="speed-panel" rounded="lg">
        <div class="speed-value">{{ speed.toFixed(2) }}x</div>
        <div class="speed-fine">
          <v-btn
            icon
            variant="text"
            size="x-small"
            aria-label="Slower"
            :disabled="speed <= SPEED_MIN"
            @click="setSpeed(speed - SPEED_STEP)"
          >
            <v-icon>mdi-minus</v-icon>
          </v-btn>
          <v-slider
            :model-value="speed"
            :min="SPEED_MIN"
            :max="SPEED_MAX"
            :step="SPEED_STEP"
            density="compact"
            hide-details
            color="primary"
            aria-label="Playback speed"
            @update:model-value="setSpeed"
          ></v-slider>
          <v-btn
            icon
            variant="text"
            size="x-small"
            aria-label="Faster"
            :disabled="speed >= SPEED_MAX"
            @click="setSpeed(speed + SPEED_STEP)"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </div>
        <div class="speed-presets">
          <v-btn
            v-for="option in controller.SPEEDS"
            :key="option"
            size="x-small"
            rounded="pill"
            :variant="option === speed ? 'flat' : 'tonal'"
            :color="option === speed ? 'primary' : undefined"
            class="speed-preset"
            @click="pickPreset(option)"
          >
            {{ option }}x
          </v-btn>
        </div>
      </v-card>
    </v-menu>
    <slot></slot>
  </div>
</template>

<style scoped>
.playfield-toolbar {
  display: flex;
  align-items: center;
  gap: 0;
  height: 44px;
  margin-top: 8px;
  padding: 0 4px;
  border-radius: 999px;
  background: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-on-primary));
}

.playfield-scrub {
  flex: 1;
  min-width: 0;
  margin: 0;
  padding: 0;
}

/* pan-y makes browsers hold back the first few pixels of a touch drag */
.playfield-scrub,
.playfield-scrub :deep(.v-slider-track) {
  touch-action: none;
}

.playfield-speed {
  text-transform: none;
  min-width: 0;
  padding: 0 6px;
  font-variant-numeric: tabular-nums;
  /* the sideways drag is ours, not the page's */
  touch-action: none;
}

.playfield-speed--dragging {
  cursor: ew-resize;
}

.speed-panel {
  width: min(280px, calc(100vw - 32px));
  padding: 8px 10px 10px;
}

.speed-value {
  text-align: center;
  font-size: 15px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.speed-fine {
  display: flex;
  align-items: center;
  gap: 2px;
}

.speed-presets {
  display: flex;
  gap: 4px;
}

.speed-preset {
  flex: 1 1 0;
  min-width: 0;
  padding: 0;
  letter-spacing: normal;
  text-transform: none;
}

.playfield-time {
  font-size: 13px;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  padding: 0 6px 0 2px;
  cursor: pointer;
}
</style>

<script setup>
// Play, seek and speed for a song from usePlayfieldSession
const props = defineProps({
  // What usePlayfieldSession returned
  controller: {
    type: Object,
    required: true
  }
});

const { paused, position, songLength, speed } = props.controller;

const chartFeatures = useState("chartViewFeatures");
const speedMenuOpen = ref(false);

function pickPreset(value) {
  setSpeed(value);
  speedMenuOpen.value = false;
}

const SPEED_MIN = 0.1;
const SPEED_MAX = 2;
const SPEED_STEP = 0.05;

function setSpeed(value) {
  // avoids float drift from the 0.05 steps
  speed.value = Math.min(
    SPEED_MAX,
    Math.max(SPEED_MIN, Math.round(value * 100) / 100)
  );
}

// Holding the speed button and moving sideways changes the speed, a tap opens the menu
const SPEED_DRAG_PIXELS = 8; // per step
const SPEED_DRAG_SLOP = 4;
const SPEED_HOLD_MS = 300;

const speedDragging = ref(false);
let speedDrag = null;
let speedHoldTimer = null;
// The click after a drag is not a tap
let speedDragged = false;

function speedDragStart(event) {
  if (event.button !== 0) return;
  event.currentTarget.setPointerCapture(event.pointerId);
  speedDrag = {
    pointerId: event.pointerId,
    startX: event.clientX,
    startSpeed: speed.value
  };
  speedDragged = false;
  clearTimeout(speedHoldTimer);
  speedHoldTimer = setTimeout(beginSpeedDrag, SPEED_HOLD_MS);
}

function beginSpeedDrag() {
  clearTimeout(speedHoldTimer);
  speedDragging.value = true;
  speedDragged = true;
}

function speedDragMove(event) {
  if (!speedDrag || event.pointerId !== speedDrag.pointerId) return;
  const distance = event.clientX - speedDrag.startX;
  if (!speedDragging.value) {
    if (Math.abs(distance) < SPEED_DRAG_SLOP) return;
    beginSpeedDrag();
  }
  setSpeed(
    speedDrag.startSpeed + Math.round(distance / SPEED_DRAG_PIXELS) * SPEED_STEP
  );
}

function speedDragEnd(event) {
  if (!speedDrag || event.pointerId !== speedDrag.pointerId) return;
  clearTimeout(speedHoldTimer);
  speedDrag = null;
  speedDragging.value = false;
  // the click comes right after, keyboard clicks later on have no drag before them
  setTimeout(() => (speedDragged = false));
}

function speedClick() {
  if (speedDragged) return;
  speedMenuOpen.value = !speedMenuOpen.value;
}

// Holding a finger down would otherwise bring up the long press menu
function speedContextMenu(event) {
  if (speedDrag) event.preventDefault();
}

onBeforeUnmount(() => clearTimeout(speedHoldTimer));

function formatTime(ms) {
  const seconds = Math.floor(ms / 1000);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}
</script>
