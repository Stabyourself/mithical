<template>
  <span :class="[`rating-${ratingColor}`, { simple }, 'rating']">
    {{ realRateFormatted }}
  </span>
</template>

<style scoped lang="scss">
@keyframes rate_animation {
  0% {
    background-position: 0px;
  }

  100% {
    background-position: -100px, 0px;
  }
}

.rating {
  -webkit-text-stroke: 0.02em #454743;
  background-clip: text !important;
  color: transparent;
  text-shadow: none;
  font-weight: 800;
  background-size: 100% 60%;
  background-position: center center;
}

@mixin animated {
  background-repeat: repeat;
  background-size: 100px auto, 100% auto;
  animation: rate_animation 4s linear infinite;
}

.rating-white {
  background-color: grey;
}

.rating-darkblue {
  background-color: #4948ff;
}

.rating-yellow {
  background-image: linear-gradient(180deg, #fda901, #fee105);
}

.rating-red {
  background-image: linear-gradient(180deg, #ff639f, #e7307d);
}

.rating-purple {
  background-color: #a000ac;
  background-image: url("/wacca/img/RatePattern2.png");
  @include animated;
}

.rating-blue {
  background-color: #8be0ff;
  background-image: url("/wacca/img/RatePattern2.png");
  @include animated;
}

.rating-silver {
  background-color: #f8f8f8;
  background-image: url("/wacca/img/RatePattern2.png");
  @include animated;
}

.rating-gold {
  background-color: #fddb2f;
  background-image: url("/wacca/img/uT_PRate_Sparkles.png");
  @include animated;
}

.rating-rainbow {
  background-image: url("/wacca/img/uT_PRate_Sparkles.png"),
    url("/wacca/img/rainbow.png");
  @include animated;
}

.rating-rainbow2 {
  background-image: url("/wacca/img/uT_PRate_Sparkles.png"),
    url("/wacca/img/rainbow2.png");
  @include animated;
}

.rating-rainbow3 {
  background-image: url("/wacca/img/uT_PRate_Sparkles.png"),
    url("/wacca/img/rainbow3.png");
  @include animated;
}

.rating-rainbow4 {
  background-image: url("/wacca/img/uT_PRate_Sparkles.png"),
    url("/wacca/img/rainbow4.png");
  @include animated;
}
</style>

<script setup>
const ratingColors = [
  { from: 2800, color: "rainbow4" },
  { from: 2700, color: "rainbow3" },
  { from: 2600, color: "rainbow2" },
  { from: 2500, color: "rainbow" },
  { from: 2200, color: "gold" },
  { from: 1900, color: "silver" },
  { from: 1600, color: "blue" },
  { from: 1300, color: "purple" },
  { from: 1000, color: "red" },
  { from: 600, color: "yellow" },
  { from: 300, color: "darkblue" },
  { from: 0, color: "white" },
];

const props = defineProps({
  rating: Number,
  divide: Number,
  simple: Boolean,
  decimals: Number,
});

const realRate = computed(() => {
  return (props.rating ?? 0) / 10;
});

const realRateFormatted = computed(() => {
  return realRate.value.toFixed(props.decimals ?? 1);
});

const ratingColor = computed(() => {
  return ratingColors.find(
    (color) => realRate.value >= color.from / (props.divide ?? 1)
  ).color;
});
</script>
