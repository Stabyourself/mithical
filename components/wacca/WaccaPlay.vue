<template>
  <component
    :is="forceExpand ? 'v-fragment' : NuxtLink"
    :to="`/wacca/songs/${song.id}`"
    style="text-decoration: none"
  >
    <div
      class="play"
      :class="{ expanded, 'is-record': play.info.is_new_record }"
      v-ripple="{ class: 'text-white' }"
    >
      <div class="player-header">
        <div class="play-cover">
          <v-img :src="fullUrl" />
        </div>
        <div class="play-info">
          <div class="play-header">
            <div class="play-header-left">
              <span class="play-title">
                {{ getTitle }}
              </span>

              <span class="play-artist">
                {{ song.artist }}
              </span>
            </div>

            <div class="play-header-right">
              {{ formatDate(play.info.user_play_date) }}
            </div>
          </div>

          <div class="play-stats">
            <div
              class="play-difficulty"
              :class="`difficulty-${play.info.music_difficulty}`"
            >
              <span class="play-difficulty-number">{{
                formatDifficulty(
                  song.sheets[play.info.music_difficulty - 1].difficulty,
                  difficultyInternal
                )
              }}</span>
              {{ difficulties[play.info.music_difficulty] }}
            </div>

            <div class="play-grade">
              <WaccaGrade :grade="play.info.grade" />
            </div>

            <div class="play-score">
              {{ play.info.score }}
            </div>

            <WaccaMedal :medal="medal" class="play-medal" />
          </div>
        </div>
      </div>

      <Collapse :when="expanded">
        <div :class="{ collapsible: !props.forceExpand }">
          <div class="play-detail">
            <div class="play-judgements">
              <div
                class="play-judgement"
                :class="`judgement-${judgement}`"
                v-for="judgement in judgements"
                :key="judgement"
              >
                <div class="play-judgement-label">{{ judgement }}</div>
                <div class="play-judgement-value">
                  {{ play.info.judge[judgement.toLowerCase()] }}
                </div>
              </div>
            </div>

            <div class="play-judgements">
              <div
                class="play-judgement play-pb"
                v-if="play.info.is_new_record"
              >
                <div class="play-judgement-label">New Record!</div>
              </div>

              <div class="play-judgement judgement-Fast">
                <div class="play-judgement-label">Fast</div>
                <div class="play-judgement-value">
                  {{ play.info.fast }}
                </div>
              </div>

              <div class="play-judgement judgement-Late">
                <div class="play-judgement-label">Late</div>
                <div class="play-judgement-value">
                  {{ play.info.late }}
                </div>
              </div>

              <div class="play-judgement judgement-Combo">
                <div class="play-judgement-label">Combo</div>
                <div class="play-judgement-value">
                  {{ play.info.combo }}
                </div>
              </div>
            </div>
          </div>

          <!-- <div class="timing-bar">
            <div class="fast" :style="{ width: fastPercentage + '%' }">
              Fast
            </div>
            <div class="perfect"></div>
            <div class="late" :style="{ width: `${latePercentage}%` }">
              Late
            </div>
          </div> -->
        </div>
      </Collapse>

      <div class="play-expand" v-if="!props.forceExpand">
        <v-btn rounded @click.prevent="expand" color="primary">
          <div v-if="!expanded">
            <v-icon>mdi-chevron-down</v-icon>
            More
          </div>
          <div v-if="expanded">
            <v-icon>mdi-chevron-up</v-icon>
            Less
          </div>
        </v-btn>
      </div>
    </div>
  </component>
</template>

<style scoped lang="scss">
$paddings: 10px;
$cover-size: 100px;

@mixin slanted($dist) {
  clip-path: polygon($dist 0, 100% 0, calc(100% - $dist) 100%, 0 100%);
  padding-left: $dist;
  padding-right: $dist;
}

.play {
  position: relative;

  padding-bottom: 0;

  border-radius: $paddings;

  background-color: rgb(var(--v-theme-boxcolor));
  overflow: hidden;
  transition: background-color 0.2s, box-shadow 0.2s;

  &.is-record {
    box-shadow: 0px 0px 5px orange, 0px 0px 10px orange;
  }

  &:hover {
    background-color: #444;
    box-shadow: 0 0 10px rgb(var(--v-theme-primary));
  }
}

.player-header {
  display: flex;
  gap: $paddings;
}

.play-cover {
  flex-shrink: 0;
  width: $cover-size;
  height: $cover-size;

  transition: width 0.5s, height 0.5s;

  img {
    width: 100%;
    height: 100%;
  }
}

.play-info {
  flex-grow: 1;
  color: white;
  font-weight: bold;
  min-width: 0;
  padding: $paddings;
}

.play-header {
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  line-height: 1.4;

  .play-header-left {
    flex-grow: 1;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;

    .play-title {
      font-size: 1.5rem;
      margin-bottom: -10px;
      margin-right: 10px;
    }

    .play-artist {
      font-size: 1rem;
      color: rgb(var(--v-theme-primary));
    }
  }

  .play-header-right {
    flex-shrink: 0;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
}

.play-stats {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;

  background: white;
  color: black;
  @include slanted(15px);
  padding-left: 0;
}

.play-difficulty {
  font-size: 1.5rem;
  color: white;
  @include slanted(15px);
  padding: 0 25px;
  margin-right: -10px;

  &.difficulty-1 {
    background-color: #009de6;
  }

  &.difficulty-2 {
    background-color: #fed131;
  }

  &.difficulty-3 {
    background-color: #fc06a3;
  }

  &.difficulty-4 {
    background-color: #4a004f;
  }

  .play-difficulty-number {
    font-weight: 300;
  }
}

.play-grade {
  padding-left: 10px;
  height: 32px;

  img {
    height: 100%;
  }
}

.play-score {
  font-size: 1.5rem;
  font-weight: 600;
  padding-left: 10px;
  flex-grow: 1;
}

.play-medal {
  padding-left: 10px;

  span {
    padding-right: 2px; // weird cutoff otherwise
  }
}

.collapsible {
  padding-bottom: 30px;
}

.play-detail {
  margin-bottom: 10px 0;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  // margin-top: $paddings;
  line-height: 1;
  font-size: 1.5rem;
  font-family: "SHINBI", sans-serif;
  color: white;
  flex-wrap: wrap;
  justify-content: space-around;
  line-height: 1.4;
}

.play-judgement {
  display: flex;
  justify-content: space-between;
  gap: 10px;

  .play-judgement-label {
    letter-spacing: -2px;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  &.judgement-Marvelous .play-judgement-label {
    background-image: -webkit-linear-gradient(#ff1e8c, #fe8e34);
  }

  &.judgement-Great .play-judgement-label {
    background-image: -webkit-linear-gradient(#ffff88, #c2e67b);
  }

  &.judgement-Good .play-judgement-label {
    background-image: -webkit-linear-gradient(#98edff, #72a6f1);
  }

  &.judgement-Miss .play-judgement-label {
    background-image: -webkit-linear-gradient(#8b8b8b, #dadada);
  }

  &.judgement-Fast .play-judgement-label {
    background-image: -webkit-linear-gradient(#fd6d1e, #ad093f);
  }

  &.judgement-Late .play-judgement-label {
    background-image: -webkit-linear-gradient(#8872fe, #1e1eff);
  }

  &.judgement-Combo .play-judgement-label {
    background-image: -webkit-linear-gradient(#fff, #ccc);
  }

  &.play-pb .play-judgement-label {
    background-image: -webkit-linear-gradient(#ffe868, #ffd700);
  }
}

.timing-bar {
  color: white;
  display: flex;
  align-items: center;
  height: 40px;
  padding: 0 10px;
  margin-top: 10px;
  font-size: 0.8em;

  .perfect,
  .fast,
  .late {
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    // margin-left: -7.5px;
    // margin-right: -7.5px;
    // @include slanted(15px);
  }

  .perfect {
    color: black;
    height: 100%;
    background: white;
    flex-grow: 1;
    text-align: center;
  }

  .fast {
    height: 100%;
    background: #d63c2e;
  }

  .late {
    height: 100%;
    background: #5247fe;
  }
}

.play-expand {
  position: absolute;
  bottom: 0px;
  left: 50%;
  transform: translate(-50%, 13px);

  :deep(.v-btn__content) {
    transform: translateY(-6px);
  }
}

.v-theme--waccaOled .play {
  outline: solid 1px white;
}
</style>

<script setup>
import { Collapse } from "vue-collapsed";
import { formatDifficulty } from "~/assets/js/util";
import { NuxtLink } from "#components";
const difficultyInternal = useState("difficultyInternal");

const version = useState("version");
import getSongs from "~~/assets/wacca/getSongs.js";

const props = defineProps({
  play: Object,
  forceExpand: Boolean,
});

const song = computed(() => {
  let song = getSongs(version).find(
    (song) => song.id === props.play.info.music_id
  );

  return song;
});

const fullUrl = computed(() => {
  return `/wacca/img/covers/${song.value.imageName}`;
});

function formatDate(date) {
  return new Date(date).toLocaleString();
}

const expanded = ref(props.forceExpand || false);
function expand() {
  expanded.value = !expanded.value;
}

const difficulties = {
  1: "Normal",
  2: "Hard",
  3: "Expert",
  4: "Inferno",
};

const judgements = ["Marvelous", "Great", "Good", "Miss"];

const medal = computed(() => {
  if (props.play.info.clear_status.is_all_marvelous) {
    return "allmarvelous";
  } else if (props.play.info.clear_status.is_full_combo) {
    return "fullcombo";
  } else if (props.play.info.clear_status.is_missless) {
    return "missless";
  } else if (props.play.info.clear_status.is_clear) {
    return "clear";
  } else {
    return "failed";
  }
});

const language = useState("language");

const getTitle = computed(() => {
  if (language.value === "ja") {
    return song.value.title;
  } else {
    return song.value.titleEnglish || song.value.title;
  }
});

const totalNotesHit = computed(() => {
  return (
    props.play.info.judge.marvelous +
    props.play.info.judge.great +
    props.play.info.judge.good
  );
});

const fastPercentage = computed(() => {
  return (props.play.info.fast / totalNotesHit.value) * 100;
});

const latePercentage = computed(() => {
  return (props.play.info.late / totalNotesHit.value) * 100;
});
</script>
