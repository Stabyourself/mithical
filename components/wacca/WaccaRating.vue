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

@keyframes rainbow_rate_animation {
  0% {
    background-position: 0 0, 0 0;
  }

  100% {
    background-position: -100px 0, 200px 0;
  }
}

.rating {
  -webkit-text-stroke: 0.02em #454743;
  background-clip: text !important;
  color: transparent;
  text-shadow: none;
  font-family: "TT_UDKakugoC60-B", sans-serif ;
  font-weight: 700;
  font-stretch: 200%;
  letter-spacing: -0.18rem;
  background-size: 100% 60%;
  background-position: center center;
  padding-inline: 0.1em;
  margin-inline: -0.1em;
}

@mixin animated {
  background-repeat: repeat;
  background-size: 100px auto, 100% auto;
  animation: rate_animation 6s linear infinite;
}

@mixin rainbnow-animated {
  background-repeat: repeat;
  background-size: 100px auto, 200px auto;
  animation: rainbow_rate_animation 6s linear infinite;
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
  background-image: url("/wacca/img/RatePattern2.webp");
  @include animated;
}

.rating-blue {
  background-color: #8be0ff;
  background-image: url("/wacca/img/RatePattern2.webp");
  @include animated;
}

.rating-silver {
  background-color: #f8f8f8;
  background-image: url("/wacca/img/RatePattern2.webp");
  @include animated;
}

.rating-gold {
  background-color: #fddb2f;
  background-image: url("/wacca/img/uT_PRate_Sparkles.webp");
  @include animated;
}

.rating-rainbow {
  background-image: url("/wacca/img/uT_PRate_Sparkles.webp"),
    url("/wacca/img/rainbow.webp");
  @include rainbnow-animated;
}

.rating-rainbow2 {
  background-image: url("/wacca/img/uT_PRate_Sparkles.webp"),
    url("/wacca/img/rainbow2.webp");
  @include rainbnow-animated;
}

.rating-rainbow3 {
  background-image: url("/wacca/img/uT_PRate_Sparkles.webp"),
    url("/wacca/img/rainbow3.webp");
  @include rainbnow-animated;
}

.rating-rainbow4 {
  background-image: url("/wacca/img/uT_PRate_Sparkles.webp"),
    url("/wacca/img/rainbow4.webp");
  @include rainbnow-animated;
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
