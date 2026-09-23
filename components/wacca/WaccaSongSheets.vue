<template>
  <div class="song-sheets">
    <div
      v-for="(difficulty, i) in filteredSheets"
      :key="i"
      class="song-difficulty"
    >
      <WaccaMedal :medal="medal(i)" />

      <WaccaDifficultyPill
        :i="i + 1"
        :difficulty="difficulty.difficulty"
        class="active"
      />

      <div
        class="song-difficulty-bottom"
        v-if="playerData && playerData.scores[i]"
      >
        <div class="song-score">
          <WaccaGrade :grade="getHighestGrade(playerData.scores[i])" />
          {{ playerData.scores[i].score }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.song-difficulty {
  margin-bottom: 5px;
}

.song-difficulty-bottom {
  background-color: white;
  color: black;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  margin-left: 20px;
  margin-right: 20px;
  font-size: 1rem;
  text-align: center;
}

.song-medal {
  transform: rotate(-10deg);
  height: 40px;
  margin-bottom: -20px;
  text-align: center;
}

.song-score {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;

  img {
    height: 22px;
  }
}
</style>

<script setup>
const props = defineProps({
  song: Object,
  playerData: Object,
});

const version = useState("version");

const grades = [
  "grade_d_count",
  "grade_c_count",
  "grade_b_count",
  "grade_a_count",
  "grade_aa_count",
  "grade_aaa_count",
  "grade_s_count",
  "grade_s_plus_count",
  "grade_ss_count",
  "grade_ss_plus_count",
  "grade_sss_count",
  "grade_sss_plus_count",
  "grade_master_count",
];
function getHighestGrade(music) {
  for (let i = grades.length - 1; i >= 0; i--) {
    if (music[grades[i]] > 0) {
      return i + 1;
    }
  }

  return 0;
}

function medal(difficulty) {
  if (!props.playerData || !props.playerData.scores[difficulty]) {
    return "none";
  }

  if (props.playerData.scores[difficulty].all_marvelous_count > 0) {
    return "allmarvelous";
  } else if (props.playerData.scores[difficulty].full_combo_count > 0) {
    return "fullcombo";
  } else if (props.playerData.scores[difficulty].missless_count > 0) {
    return "missless";
  } else if (props.playerData.scores[difficulty].clear_count > 0) {
    return "clear";
  }

  return "none";
}

const filteredSheets = computed(() => {
  return props.song.sheets.filter(
    (sheet) => sheet.gameVersion <= version.value
  );
});
</script>
