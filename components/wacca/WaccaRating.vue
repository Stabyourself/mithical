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
    background-position: 0px, 0px;
  }
}

@keyframes rainbow_rate_animation {
  0% {
    background-position:
      0 0,
      0 0;
  }

  100% {
    background-position:
      -3em 0,
      6em 0;
  }
}

.rating {
  background-clip: text !important;
  color: transparent;
  text-shadow: none;
  font-family: "RateFont", sans-serif;
  font-weight: 800;
}

@mixin animated {
  background-repeat: repeat;
  background-size:
    2.5em auto,
    2em auto;
}

@mixin rainbnow-animated {
  background-repeat: repeat;
  background-size:
    3em auto,
    6em auto;
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
  background-image: url("/wacca/img/RatePattern2.webp"), url("/wacca/img/gold1.webp");
  @include animated;
}

.rating-rainbow {
  background-image:
    url("/wacca/img/uT_PRate_Sparkles.webp"), url("/wacca/img/rainbow.webp");
  @include rainbnow-animated;
}

.rating-rainbow2 {
  background-image:
    url("/wacca/img/uT_PRate_Sparkles.webp"), url("/wacca/img/rainbow2.webp");
  @include rainbnow-animated;
}

.rating-rainbow3 {
  background-image:
    url("/wacca/img/uT_PRate_Sparkles.webp"), url("/wacca/img/rainbow3.webp");
  @include rainbnow-animated;
}

.rating-rainbow4 {
  background-image:
    url("/wacca/img/uT_PRate_Sparkles.webp"), url("/wacca/img/rainbow4.webp");
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
    (color) => realRate.value >= color.from / (props.divide ?? 1),
  ).color;
});
</script>
