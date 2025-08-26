<template>
  <div
    v-if="props.rank > 0 && props.danRank > 0"
    class="stage-up"
    :class="`medal-${medalDesign}`"
  >
    <div>
      <img :src="urlBack" class="stage-up-medal" />
      <img :src="urlNumber" class="stage-up-number" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.stage-up {
  position: relative;

  div {
    position: absolute;
    width: 150px;
    height: 150px;
    min-width: 150px;
    margin-top: -75px;
  }

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}

.medal-3 {
  .stage-up-medal {
    margin-top: -5px;
  }
}

.medal-5 {
  margin-top: -40px;
  .stage-up-number {
    width: 80%;
    height: 80%;
    bottom: -5px;
    top: auto;
    margin-left: auto;
    margin-right: auto;
    left: 0;
    right: 0;
    text-align: center;
  }
}

.stage-up-number {
  filter: brightness(0);
}
</style>

<script setup>
const props = defineProps({
  rank: Number,
  danRank: Number,
});

const medalDesigns = [1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 4, 4, 5, 5];
const medalDesign = medalDesigns[props.rank - 1];
const urlBack = computed(
  () => `/wacca/img/stageup/level_${medalDesign}_${props.danRank}.png`
);
const urlNumber = computed(() => `/wacca/img/stageup/number_${props.rank}.png`);
</script>
