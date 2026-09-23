<template>
  <div class="leaderboard">
    <div ref="pillsEl" class="song-sheets difficulty-selection mt-4">
      <div
        v-for="(difficulty, i) in props.sheets"
        :key="i"
        class="song-difficulty"
      >
        <WaccaDifficultyPill
          v-ripple
          :i="i + 1"
          :difficulty="difficulty.difficulty"
          :class="{ active: i + 1 == selectedDifficulty }"
          @click="selectDifficulty(i + 1)"
        />
        <div v-if="ranks[i]" class="pill-rank">
          <div class="pill-rank-label">Your rank</div>
          <div class="pill-rank-value">
            <span class="pill-rank-number">
              {{ ranks[i].rank.toLocaleString("en-US") }}
            </span>
            <span class="pill-rank-total">
              / {{ ranks[i].total.toLocaleString("en-US") }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading && !highscores.length" class="d-flex justify-center py-5">
      <v-progress-circular
        indeterminate
        color="primary"
        :size="80"
        :width="10"
        class="mt-4"
      ></v-progress-circular>
    </div>

    <template v-else>
      <v-alert v-if="error" type="error" class="mt-4 mx-4">{{ error }}</v-alert>

      <!-- not "loading", wacca.scss has a global .loading -->
      <div
        ref="tableEl"
        class="leaderboard-table"
        :class="{ 'is-loading': loading }"
      >
        <v-progress-linear
          v-if="loading"
          indeterminate
          color="primary"
          height="2"
          class="leaderboard-progress"
        />
        <v-table>
          <thead>
            <tr>
              <th width="1%">Rank</th>
              <th>Name</th>
              <th>Score</th>
              <th class="col-date">Date</th>
            </tr>
          </thead>

          <TransitionGroup tag="tbody" name="lb-row">
            <tr
              v-for="entry in ranked"
              :key="entry.key"
              :class="{ highlight: entry.isMe }"
            >
              <td class="text-right rank">{{ entry.rankLabel }}</td>
              <td>
                <div class="player">
                  <WaccaIcon
                    class="highscore-icon"
                    :icon="entry.score.user_icon_id"
                  />
                  <span class="player-name">{{ entry.score.user_name }}</span>
                </div>
              </td>
              <td>
                <div class="score">
                  <WaccaGrade
                    class="highscore-grade"
                    :grade="fillGrade(entry.score.grade, entry.score.score)"
                  />
                  {{ entry.score.score }}
                </div>
              </td>
              <td class="col-date">
                {{ formatDate(entry.score.user_play_date) }}
              </td>
            </tr>

            <tr v-if="!ranked.length && !loading" key="empty">
              <td colspan="4" class="text-center">No scores yet!</td>
            </tr>
          </TransitionGroup>

          <!-- you, if outside top 100 -->
          <tbody v-if="outsideRow" class="you-body">
            <tr class="highlight">
              <td class="text-right rank">{{ outsideRow.rankLabel }}</td>
              <td>
                <div class="player">
                  <WaccaIcon class="highscore-icon" :icon="yourIcon" />
                  <span class="player-name">{{ profile.user_name }}</span>
                </div>
              </td>
              <td>
                <div class="score">
                  <WaccaGrade
                    class="highscore-grade"
                    :grade="fillGrade(outsideRow.grade, outsideRow.score)"
                  />
                  {{ outsideRow.score }}
                </div>
              </td>
              <td class="col-date">
                {{ outsideRow.date ? formatDate(outsideRow.date) : "—" }}
              </td>
            </tr>
          </tbody>
        </v-table>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.pill-rank {
  margin: -12px 12px 0;
  padding: 14px 8px 6px;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.15);
  border-top: none;
  border-bottom-left-radius: 14px;
  border-bottom-right-radius: 14px;
  background: rgba(var(--v-theme-on-surface), 0.03);
  // the pill row sets white text
  color: rgb(var(--v-theme-on-surface));
  text-align: center;
}

.pill-rank-label {
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(var(--v-theme-on-surface), 0.5);
}

.pill-rank-value {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 4px;
  margin-top: 1px;
  font-variant-numeric: tabular-nums;
}

.pill-rank-number {
  font-size: 1.4rem;
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.pill-rank-total {
  font-size: 0.8rem;
  font-weight: 500;
  color: rgba(var(--v-theme-on-surface), 0.55);
}

.difficulty-selection {
  :deep(.song-difficulty-pill) {
    cursor: pointer;
    // rank box tucks under it
    position: relative;
    z-index: 1;
  }
}

.leaderboard-table {
  position: relative;
  // or the page jumps when the rows get swapped
  overflow-anchor: none;

  :deep(tbody) {
    transition: opacity 0.2s ease;
  }

  &.is-loading :deep(tbody) {
    opacity: 0.45;
  }
}

.leaderboard-progress {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
}

.rank {
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.player,
.score {
  display: flex;
  align-items: center;
  gap: 6px;
}

.score {
  font-variant-numeric: tabular-nums;
}

.player-name {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.highscore-grade,
.highscore-icon {
  height: 40px;
  flex-shrink: 0;
}

tr.highlight {
  background-color: rgba(var(--v-theme-primary), 0.1);
}

.you-body tr td {
  border-top: 2px dashed rgba(var(--v-theme-on-surface), 0.2);
}

// no leave animation, it made the table jump
.lb-row-move,
.lb-row-enter-active {
  transition:
    transform 0.4s ease,
    opacity 0.4s ease;
}

.lb-row-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.lb-row-leave-active {
  display: none;
}

@media (max-width: 600px) {
  .col-date {
    display: none;
  }

  .v-table :deep(th),
  .v-table :deep(td) {
    padding: 0 6px !important;
    font-size: 0.85rem;
  }

  .v-table :deep(td) {
    height: 40px !important;
  }

  .highscore-grade,
  .highscore-icon {
    height: 28px;
  }

  .player-name {
    max-width: 32vw;
  }
}
</style>

<script setup>
import waccaGradeBorders from "~/assets/wacca/waccaGradeBorders";

const props = defineProps({
  song: Object,
  sheets: Array,
  histograms: Array,
  playerHistory: Array,
});

const runtimeConfig = useRuntimeConfig();
const profile = useState("profile");

// server's date for scores with no timestamp
const UNDATED = "1970-01-01T00:00:00+00:00";

const selectedDifficulty = ref(props.sheets.length);
const highscores = shallowRef([]);
const loading = ref(false);
const error = ref(null);

function sortScores(scores) {
  return scores.sort((a, b) => {
    // When score is identical, prefer the user who achieved it first
    if (a.score === b.score) {
      return new Date(a.user_play_date) - new Date(b.user_play_date);
    }
    return b.score - a.score;
  });
}

let requestSeq = 0;

function loadData() {
  // ignore responses from older requests
  const seq = ++requestSeq;
  loading.value = true;

  $fetch(
    `${runtimeConfig.public.apiUrl}/wacca/music/${props.song.id}/highscores/${selectedDifficulty.value}`,
  )
    .then((data) => {
      if (seq !== requestSeq) return;
      highscores.value = sortScores(data);
      error.value = null;
    })
    .catch(() => {
      if (seq !== requestSeq) return;
      error.value = "Couldn't reach the API. Please try again later.";
    })
    .finally(() => {
      if (seq === requestSeq) loading.value = false;
    });
}

const pillsEl = ref(null);
const tableEl = ref(null);
let unpin = null;

// keep the pills in place while the rows swap
function pinScroll() {
  unpin?.();
  const pills = pillsEl.value;
  const table = tableEl.value;
  if (!pills) return;

  const top = pills.getBoundingClientRect().top;
  if (table) table.style.minHeight = `${table.offsetHeight}px`;

  let frame;
  const hold = () => {
    const drift = pills.getBoundingClientRect().top - top;
    if (Math.abs(drift) > 1) window.scrollBy(0, drift);
    frame = requestAnimationFrame(hold);
  };
  // let go if the user scrolls
  const release = () => unpin?.();
  window.addEventListener("wheel", release, { passive: true });
  window.addEventListener("touchmove", release, { passive: true });
  window.addEventListener("keydown", release);
  hold();

  unpin = () => {
    cancelAnimationFrame(frame);
    if (table) table.style.minHeight = "";
    window.removeEventListener("wheel", release);
    window.removeEventListener("touchmove", release);
    window.removeEventListener("keydown", release);
    unpin = null;
  };
}

watch(loading, (isLoading) => {
  if (!isLoading && unpin) {
    const done = unpin;
    setTimeout(() => done === unpin && unpin?.(), 500);
  }
});

onBeforeUnmount(() => unpin?.());

function selectDifficulty(difficulty) {
  if (difficulty === selectedDifficulty.value && !error.value) return;
  pinScroll();
  selectedDifficulty.value = difficulty;
  loadData();
}

loadData();

watch(
  () => props.song.id,
  () => {
    selectedDifficulty.value = props.sheets.length;
    highscores.value = [];
    loadData();
  },
);

const yourBest = computed(
  () =>
    profile.value?.songs[props.song.id]?.scores[selectedDifficulty.value - 1]
      ?.score ?? 0,
);

const yourBestPlays = computed(() =>
  (props.playerHistory ?? [])
    .filter(
      (p) =>
        p.info.music_difficulty === selectedDifficulty.value &&
        p.info.score === yourBest.value &&
        !p.info.clear_status.is_give_up,
    )
    .sort(
      (a, b) => new Date(a.info.user_play_date) - new Date(b.info.user_play_date),
    ),
);

// api doesn't give us our own api_id, so match score + play date
// (undated ones fall back to the name)
function isYou(entry) {
  if (!yourBest.value || entry.score !== yourBest.value) return false;
  if (entry.user_play_date === UNDATED) {
    return entry.user_name === profile.value?.user_name;
  }
  const time = new Date(entry.user_play_date).getTime();
  return yourBestPlays.value.some(
    (p) => new Date(p.info.user_play_date).getTime() === time,
  );
}

// ties share a rank
const ranked = computed(() => {
  const list = highscores.value;
  const tieCounts = {};
  for (const s of list) tieCounts[s.score] = (tieCounts[s.score] ?? 0) + 1;

  let rank = 0;
  return list.map((score, i) => {
    if (i === 0 || list[i - 1].score !== score.score) rank = i + 1;
    return {
      score,
      key: `${score.api_id}-${score.user_play_date}`,
      rank,
      rankLabel: tieCounts[score.score] > 1 ? `=${rank}` : `${rank}`,
      isMe: isYou(score),
    };
  });
});

const yourEntry = computed(() => ranked.value.find((e) => e.isMe));

// histogram has everyone's best, so this is the exact rank
function histogramRank(difficulty) {
  const best =
    profile.value?.songs[props.song.id]?.scores[difficulty - 1]?.score ?? 0;
  const entries =
    props.histograms?.find((h) => h.music_difficulty === difficulty)
      ?.score_entries ?? [];
  if (!best || !entries.length) return null;

  let total = 0;
  let above = 0;
  let same = 0;
  for (const e of entries) {
    const score = Number(e.score);
    const count = parseInt(e.count) || 0;
    total += count;
    if (score > best) above += count;
    else if (score === best) same += count;
  }
  return { rank: above + 1, total, tied: same > 1 };
}

const ranks = computed(() => props.sheets.map((_, i) => histogramRank(i + 1)));

const outsideRow = computed(() => {
  if (!yourBest.value || yourEntry.value || loading.value) return null;
  if (!highscores.value.length) return null;

  const rank = ranks.value[selectedDifficulty.value - 1];
  const play = yourBestPlays.value[0];
  const date = play?.info.user_play_date;
  return {
    rankLabel: rank ? `${rank.tied ? "=" : ""}${rank.rank}` : "—",
    score: yourBest.value,
    grade: play?.info.grade ?? 0,
    date: date && date !== UNDATED ? date : null,
  };
});

const yourIcon = computed(() => profile.value?.options?.[1003] ?? 102001);

function formatDate(date) {
  if (date == UNDATED) {
    return new Date("2022-09-01T00:00:00+09:00").toLocaleString();
  }
  return new Date(date).toLocaleString();
}

function fillGrade(grade, score) {
  if (grade > 0) {
    return grade;
  }

  // infer the grade from score
  for (let i = 0; i < waccaGradeBorders.length; i++) {
    if (score >= waccaGradeBorders[i].min) {
      return waccaGradeBorders[i].grade;
    }
  }
}
</script>
