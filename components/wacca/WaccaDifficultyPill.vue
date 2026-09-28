<template>
  <div class="song-difficulty-pill" :class="`song-difficulty-${i}`">
    <div class="song-difficulty-name">
      {{ waccaDifficulties.find((d) => d.id === i).name }}
    </div>

    <div class="song-difficulty-level">
      {{ formatDifficulty(difficulty, difficultyInternal) }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.song-difficulty-pill {
  font-weight: bold;
  color: white;
  background-color: #888;
  transition: background-color 0.2s;

  // The difficulty's theme color (see plugins/vuetify.ts) when picked or hovered
  &.active,
  &:hover {
    @for $i from 1 through 4 {
      &.song-difficulty-#{$i} {
        background-color: rgb(var(--v-theme-difficulty-#{$i}));
        color: rgb(var(--v-theme-on-difficulty-#{$i}));
      }
    }
  }

  display: flex;
  justify-content: space-between;
  font-size: 1.3rem;
  text-transform: uppercase;
  padding: 3px 15px;
  padding-right: 0px;

  border-radius: 100px;
  background-image: linear-gradient(
    290deg,
    rgba(0, 0, 0, 0.3) 55px,
    transparent 55px
  );
  .song-difficulty-level {
    width: 55px;
    font-weight: 300;
    text-align: center;
  }
}
</style>

<script setup>
import { formatDifficulty } from "~/assets/js/util";
const difficultyInternal = useState("difficultyInternal");
import waccaDifficulties from "~/assets/wacca/waccaDifficulties";

const props = defineProps({
  i: Number,
  difficulty: Number
});
</script>
