<template>
  <div class="song-medal" :class="`medal-${medal}`">
    <span>{{ medalNames[medal] }}</span>
  </div>
</template>

<style scoped lang="scss">
@keyframes marvelous {
  from {
    background-position: 0 0px;
  }
  to {
    background-position: 0 30px;
  }
}

.song-medal {
  white-space: nowrap;
  font-family: "judgement_font", sans-serif;
  letter-spacing: -2px;
  font-size: 1.3rem;
}

.medal-clear {
  text-transform: uppercase;
  font-weight: 300;

  span {
    padding: 0 2px;
    background-image: linear-gradient(
      90deg,
      #057bd0,
      20%,
      #47fee7,
      40%,
      #fd44a0,
      60%,
      #47fee7,
      80%,
      #057bd0
    );
    background-clip: text;

    // evil vendor prefix stuff
    -webkit-background-clip: text;
    -moz-background-clip: text;
    -webkit-text-stroke: 3px transparent;
    -moz-text-stroke: 3px transparent;
    color: white;
  }
}

.medal-missless {
  span {
    color: #dfff01;
    -webkit-text-stroke: #7eb301 0.1px;
    background: linear-gradient(180deg, #fffc00, #b2fb03);
    background-clip: text;
    // evil vendor prefix stuff
    -webkit-text-fill-color: transparent;
    -moz-text-fill-color: transparent;
  }
}

.medal-failed {
  span {
    text-transform: uppercase;
    color: #e80e69;
    background: linear-gradient(180deg, #e80e69, #29257c);
    background-clip: text;
    // evil vendor prefix stuff
    -webkit-text-fill-color: transparent;
    -moz-text-fill-color: transparent;
  }
}

.medal-fullcombo {
  span {
    color: #dfff01;
    -webkit-text-stroke: #190b32 0.1px;
    background: linear-gradient(180deg, #fb0298, 33%, #fb0298, 66%, #530bc8);
    background-clip: text;
    // evil vendor prefix stuff
    -webkit-text-fill-color: transparent;
    -moz-text-fill-color: transparent;
  }
}

.medal-allmarvelous {
  span {
    height: 30px;
    display: block;
    font-weight: 900;
    color: #dfff01;
    background: repeating-linear-gradient(
      169deg,
      #c323d3,
      5%,
      #eccd1b,
      15%,
      #eca41b,
      25%,
      #e43a3d,
      33%,
      #c323d3,
      50%,
      #c323d3,
      55%,
      #eccd1b,
      65%,
      #eca41b,
      75%,
      #e43a3d,
      83%,
      #c323d3
    );
    background-clip: text;
    // evil vendor prefix stuff
    -webkit-text-fill-color: transparent;
    -moz-text-fill-color: transparent;

    animation: 2s linear infinite marvelous;
  }
}
</style>

<script setup>
const props = defineProps({
  medal: String,
});

const medalNames = {
  allmarvelous: "All Marvelous!!",
  fullcombo: "Full Combo!",
  missless: "Missless!",
  clear: "Clear!",
  failed: "Failed",
};
</script>
