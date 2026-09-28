<template>
  <div class="song-difficulty-pill" :class="`song-difficulty-${i}`">
    {{ text }}
  </div>
</template>

<style scoped lang="scss">
.song-difficulty-pill {
  font-weight: bold;
  color: white;

  // The difficulty's theme color, see plugins/vuetify.ts
  @for $i from 1 through 4 {
    &.song-difficulty-#{$i} {
      background-color: rgb(var(--v-theme-difficulty-#{$i}));
      color: rgb(var(--v-theme-on-difficulty-#{$i}));
    }
  }

  font-size: 1rem;
  text-transform: uppercase;
  padding: 2px 7px;
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

const text = computed(() => {
  return `${waccaDifficulties
    .find((d) => d.id === props.i)
    .name.toUpperCase()
    .slice(0, 3)} ${formatDifficulty(
    props.difficulty,
    difficultyInternal.value,
    true
  )}`;
});
</script>
