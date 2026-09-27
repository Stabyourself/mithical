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

    <span class="playfield-time">{{ formatTime(position) }}</span>
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
    <span class="playfield-time">{{ formatTime(songLength) }}</span>

    <v-menu location="top" :z-index="2500">
      <template v-slot:activator="{ props: menuProps }">
        <v-btn
          v-bind="menuProps"
          variant="text"
          size="small"
          rounded="pill"
          class="playfield-speed"
          aria-label="Playback speed"
          title="Speed"
        >
          {{ speed }}x
        </v-btn>
      </template>
      <v-list density="compact">
        <v-list-item
          v-for="option in controller.SPEEDS"
          :key="option"
          :active="option === speed"
          color="primary"
          @click="setSpeed(option)"
        >
          {{ option }}x
        </v-list-item>
      </v-list>
    </v-menu>
    <slot></slot>
  </div>
</template>

<style scoped>
.playfield-toolbar {
  display: flex;
  align-items: center;
  gap: 2px;
  height: 44px;
  margin-top: 8px;
  padding: 0 4px;
  border-radius: 999px;
  background: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-on-primary));
}

.playfield-scrub {
  flex: 1;
  margin: 0 6px;
}

.playfield-speed {
  text-transform: none;
  min-width: 44px;
  padding: 0 8px;
}

.playfield-time {
  font-size: 13px;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  padding: 0 2px;
}
</style>

<script setup>
// Play, seek and speed for a song from usePlayfieldSession
const props = defineProps({
  // What usePlayfieldSession returned
  controller: {
    type: Object,
    required: true,
  },
});

const { paused, position, songLength, speed } = props.controller;

function setSpeed(value) {
  speed.value = value;
}

function formatTime(ms) {
  const seconds = Math.floor(ms / 1000);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}
</script>
