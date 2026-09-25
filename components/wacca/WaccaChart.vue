<template>
  <div class="player-chart-wrapper">
    <div class="player-chart-toolbar">
      <div class="player-chart-legend">
        <button
          v-for="d in legendItems"
          :key="d.id"
          type="button"
          class="legend-item"
          :class="{ dimmed: props.difficultyFilter && props.difficultyFilter !== d.id }"
          @click="emit('select-difficulty', d.id)"
        >
          <span class="legend-swatch" :style="{ background: d.color }"></span>
          {{ d.name }}
        </button>
      </div>

      <div class="player-chart-controls">
        <Transition name="fade">
          <v-btn
            v-if="isZoomed"
            size="small"
            variant="text"
            prepend-icon="mdi-magnify-minus-outline"
            @click="resetZoom"
          >
            Reset zoom
          </v-btn>
        </Transition>
        <v-btn-toggle
          v-model="xMode"
          mandatory
          density="compact"
          variant="outlined"
          divided
          class="mode-toggle"
        >
          <v-btn value="time" size="small">By date</v-btn>
          <v-btn value="play" size="small">By play</v-btn>
        </v-btn-toggle>
      </div>
    </div>

    <div
      ref="chartContainer"
      class="player-chart"
      :class="{ zoomed: isZoomed }"
      @wheel="onWheel"
    >
      <canvas ref="playerChart"></canvas>

      <div ref="tooltipEl" class="player-chart-tooltip">
        <template v-if="tooltipPoint">
          <div class="tt-head">
            <span
              class="legend-swatch"
              :style="{ background: tooltipPoint.color }"
            ></span>
            {{ tooltipPoint.difficulty }}
            <span class="tt-playno">· play #{{ tooltipPoint.playNumber }}</span>
          </div>
          <div class="tt-score">
            <WaccaGrade class="tt-grade" :grade="tooltipPoint.grade" />
            {{ tooltipPoint.score.toLocaleString("en-US") }}
          </div>
          <div class="tt-tags">
            <span class="tt-tag" :class="tooltipPoint.clear.cls">
              {{ tooltipPoint.clear.label }}
            </span>
            <span v-if="tooltipPoint.isBest" class="tt-tag pb">
              Personal best
            </span>
          </div>
          <div class="tt-date">{{ tooltipPoint.dateLabel }}</div>
        </template>
      </div>

      <Transition name="fade">
        <div v-if="showWheelHint" class="player-chart-text hint">
          <div>Hold Ctrl to zoom</div>
        </div>
      </Transition>

      <Transition name="fade">
        <div v-if="props.loading" class="player-chart-text">
          <v-progress-circular indeterminate color="primary" />
        </div>
        <div v-else-if="!hasPoints" class="player-chart-text">
          <div>No plays yet. Go for it!</div>
        </div>
      </Transition>
    </div>

    <div v-if="hasPoints" class="player-chart-footer">
      <span class="key">
        <svg width="18" height="8" aria-hidden="true">
          <path d="M1 7 H8 V1 H17" fill="none" stroke="currentColor" stroke-width="2" />
        </svg>
        Personal best
      </span>
      <span class="key">
        <svg width="8" height="8" aria-hidden="true">
          <circle cx="4" cy="4" r="3.5" fill="currentColor" />
        </svg>
        Play
      </span>
      <span v-if="clippedCount" class="key">
        <svg width="10" height="8" aria-hidden="true">
          <path d="M1 1 H9 L5 7 Z" fill="currentColor" />
        </svg>
        Below chart range
      </span>
      <span v-if="xMode === 'time' && undatedCount" class="key">
        {{ undatedCount }} undated play{{ undatedCount == 1 ? "" : "s" }} not
        shown
      </span>
      <span class="spacer"></span>
      <span class="help">
        Ctrl + scroll to zoom · drag to pan · click a play for details
      </span>
    </div>

    <Collapse :when="!!selectedDetail" class="play-detail-collapse">
      <WaccaPlayDetail
        v-if="shownDetail"
        :play="props.playerHistory[shownDetail.play.historyIndex]"
        :difficulty="shownDetail.difficulty"
        :color="shownDetail.color"
        :play-number="shownDetail.playNumber"
        :grade="shownDetail.play.grade"
        :is-best="shownDetail.play.isBest"
        :has-prev="!!shownDetail.prev"
        :has-next="!!shownDetail.next"
        @prev="selectPlay(shownDetail.prev)"
        @next="selectPlay(shownDetail.next)"
        @close="selectPlay(null)"
      />
    </Collapse>
  </div>

</template>

<style scoped lang="scss">
.player-chart-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 4px 10px 8px;
}

.player-chart-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.legend-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 2px 10px;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 600;
  color: rgba(var(--v-theme-on-surface), 0.85);
  transition: opacity 0.2s, background-color 0.2s;

  &:hover {
    background: rgba(var(--v-theme-on-surface), 0.06);
  }

  &.dimmed {
    opacity: 0.4;
  }
}

.legend-swatch {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.player-chart-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}

.mode-toggle {
  height: 30px !important;

  .v-btn {
    text-transform: none;
    letter-spacing: normal;
  }
}

.player-chart {
  height: 320px;
  position: relative;
  touch-action: pan-y;

  &.zoomed canvas {
    cursor: grab;
  }

  @media (max-width: 600px) {
    height: 260px;
  }
}

.player-chart-text {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(var(--v-theme-surface), 0.6);
  backdrop-filter: blur(2px);
  pointer-events: none;

  div {
    font-size: 1.2rem;
    font-weight: bold;
  }

  &.hint {
    background: rgba(var(--v-theme-surface), 0.35);
    backdrop-filter: none;

    div {
      padding: 6px 14px;
      border-radius: 8px;
      background: rgba(var(--v-theme-on-surface), 0.8);
      color: rgb(var(--v-theme-surface));
      font-size: 0.95rem;
    }
  }
}

.player-chart-tooltip {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  min-width: 150px;
  padding: 8px 10px;
  border-radius: 8px;
  background: rgb(var(--v-theme-surface));
  color: rgb(var(--v-theme-on-surface));
  border: 1px solid rgba(var(--v-theme-on-surface), 0.12);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.15s ease;
  white-space: nowrap;

  .tt-head {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.8rem;
    font-weight: 600;
    opacity: 0.85;
  }

  .tt-playno {
    font-weight: 400;
    opacity: 0.7;
  }

  .tt-score {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 1.25rem;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    margin: 2px 0;
  }

  .tt-grade {
    height: 26px;
  }

  .tt-tags {
    display: flex;
    gap: 4px;
  }

  .tt-tag {
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    padding: 1px 6px;
    border-radius: 4px;
    background: rgba(var(--v-theme-on-surface), 0.08);

    &.failed {
      opacity: 0.6;
    }

    &.pb {
      background: rgba(var(--v-theme-primary), 0.15);
      color: rgb(var(--v-theme-primary));
    }
  }

  .tt-date {
    margin-top: 4px;
    font-size: 0.75rem;
    opacity: 0.65;
  }
}

.player-chart-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 14px;
  padding: 6px 10px 10px;
  font-size: 0.75rem;
  color: rgba(var(--v-theme-on-surface), 0.6);

  .key {
    display: inline-flex;
    align-items: center;
    gap: 5px;
  }

  .spacer {
    flex-grow: 1;
  }

  @media (hover: none) {
    .help {
      display: none;
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

<script setup>
import { Chart, Interaction } from "chart.js";
import { getRelativePosition } from "chart.js/helpers";
import { Collapse } from "vue-collapsed";
import waccaDifficulties from "~/assets/wacca/waccaDifficulties";

const props = defineProps({
  playerHistory: Array,
  song: Object,
  loading: Boolean,
  difficultyFilter: Number,
});

const emit = defineEmits(["select-difficulty"]);

const version = useState("version");
const { themeName, isDark, surfaceColor, inkColor, difficultyColor } =
  useChartTheme();

// server's date for plays with no timestamp
const UNDATED = "1970-01-01T00:00:00+00:00";

const GRADE_LINES = [
  { min: 1000000, name: "MASTER" },
  { min: 990000, name: "SSS+" },
  { min: 980000, name: "SSS" },
  { min: 970000, name: "SS+" },
  { min: 950000, name: "SS" },
  { min: 930000, name: "S+" },
  { min: 900000, name: "S" },
  { min: 850000, name: "AAA" },
  { min: 800000, name: "AA" },
  { min: 700000, name: "A" },
  { min: 600000, name: "B" },
  { min: 500000, name: "C" },
  { min: 400000, name: "C" },
  { min: 300000, name: "C" },
  { min: 200000, name: "C" },
  { min: 100000, name: "C" },
  { min: 0, name: "" },
];

const GRADE_NUMBERS = [
  [1000000, 13],
  [990000, 12],
  [980000, 11],
  [970000, 10],
  [950000, 9],
  [930000, 8],
  [900000, 7],
  [850000, 6],
  [800000, 5],
  [700000, 4],
  [600000, 3],
  [1, 2],
];

const playerChart = ref(null);
const chartContainer = ref(null);
const tooltipEl = ref(null);
const tooltipPoint = ref(null);
const selectedIndex = ref(null);
const isZoomed = ref(false);
const showWheelHint = ref(false);

const xMode = ref(readStoredMode());

function readStoredMode() {
  try {
    return localStorage.getItem("chartXMode") === "play" ? "play" : "time";
  } catch {
    return "time";
  }
}

watch(xMode, (mode) => {
  try {
    localStorage.setItem("chartXMode", mode);
  } catch {}
});

const sheetCount = computed(
  () =>
    props.song.sheets.filter((sheet) => sheet.gameVersion <= version.value)
      .length,
);

function gradeFromScore(score) {
  const entry = GRADE_NUMBERS.find(([min]) => score >= min);
  return entry ? entry[1] : 0;
}

function clearStatus(status) {
  if (status.is_all_marvelous) return { label: "All Marvelous", cls: "am" };
  if (status.is_full_combo) return { label: "Full Combo", cls: "fc" };
  if (status.is_missless) return { label: "Missless", cls: "ml" };
  if (status.is_clear) return { label: "Clear", cls: "clear" };
  return { label: "Failed", cls: "failed" };
}

// completed plays, oldest first
const plays = computed(() => {
  const list = [];

  props.playerHistory.forEach((play, historyIndex) => {
    const info = play.info;
    if (info.clear_status.is_give_up) return;
    if (info.music_difficulty < 1 || info.music_difficulty > sheetCount.value)
      return;

    const undated = info.user_play_date == UNDATED;
    list.push({
      historyIndex,
      difficulty: info.music_difficulty,
      score: info.score,
      grade: info.grade || gradeFromScore(info.score),
      clear: clearStatus(info.clear_status),
      undated,
      time: undated ? -Infinity : new Date(info.user_play_date).getTime(),
    });
  });

  list.sort((a, b) => a.time - b.time || b.historyIndex - a.historyIndex);

  const best = {};
  for (const p of list) {
    p.isBest = p.score > (best[p.difficulty] ?? -1);
    if (p.isBest) best[p.difficulty] = p.score;
  }

  return list;
});

const hasPoints = computed(() => plays.value.length > 0);

const legendItems = computed(() => {
  const played = new Set(plays.value.map((p) => p.difficulty));
  return waccaDifficulties
    .filter((d) => played.has(d.id))
    .map((d) => ({ ...d, color: difficultyColor(d.id) }));
});

const visiblePlays = computed(() => {
  let list = plays.value;
  if (props.difficultyFilter) {
    list = list.filter((p) => p.difficulty === props.difficultyFilter);
  }
  if (xMode.value === "time") {
    list = list.filter((p) => !p.undated);
  }
  return list;
});

const undatedCount = computed(
  () =>
    plays.value.filter(
      (p) =>
        p.undated &&
        (!props.difficultyFilter || p.difficulty === props.difficultyFilter),
    ).length,
);

// ignore low outliers so one bad play doesn't squish the chart
const yRange = computed(() => {
  const scores = visiblePlays.value.map((p) => p.score).sort((a, b) => a - b);
  if (!scores.length) return { min: 900000, max: 1000000, floor: 900000 };

  const q = (f) => scores[Math.floor((scores.length - 1) * f)];
  const fence = q(0.25) - 1.5 * (q(0.75) - q(0.25));
  const inliers = scores.filter((s) => s >= fence);
  const low = inliers[0];
  const high = scores[scores.length - 1];

  let lo = GRADE_LINES.find((g) => g.min <= low)?.min ?? 0;
  let hi = [...GRADE_LINES].reverse().find((g) => g.min >= high)?.min ?? 1000000;
  if (hi === lo) {
    hi = [...GRADE_LINES].reverse().find((g) => g.min > hi)?.min ?? 1000000;
  }
  while (hi - lo < 20000 && lo > 0) {
    lo = GRADE_LINES.find((g) => g.min < lo)?.min ?? 0;
  }

  const pad = (hi - lo) * 0.05;
  return { min: lo - pad, max: hi + pad, floor: lo };
});

const clippedCount = computed(
  () => visiblePlays.value.filter((p) => p.score < yRange.value.floor).length,
);

function buildDatasets() {
  const { min, floor } = yRange.value;
  const clippedY = min + (floor - min) * 0.35;
  const timeline = xMode.value === "time";
  const firstTime = visiblePlays.value[0]?.time ?? 0;

  // keep undated plays as hidden points so the indexes match for the animation
  const visible = props.difficultyFilter
    ? plays.value.filter((p) => p.difficulty === props.difficultyFilter)
    : plays.value;

  return waccaDifficulties.slice(0, 4).map((d) => {
    const color = difficultyColor(d.id);
    const data = [];

    // numbered per difficulty
    visible
      .filter((p) => p.difficulty === d.id)
      .forEach((p, i) => {
        const hiddenOnTimeline = timeline && p.undated;
        data.push({
          x: timeline ? (p.undated ? firstTime : p.time) : i + 1,
          y: hiddenOnTimeline ? null : p.score < floor ? clippedY : p.score,
          play: p,
          playNumber: i + 1,
          clipped: p.score < floor,
        });
      });

    return {
      label: d.name,
      data,
      color,
      hidden: !data.length,
      showLine: false,
      clip: false,
      backgroundColor: color,
      borderColor: surfaceColor(),
      borderWidth: 2,
      pointStyle: (ctx) => (ctx.raw?.clipped ? "triangle" : "circle"),
      pointRotation: (ctx) => (ctx.raw?.clipped ? 180 : 0),
      pointRadius: (ctx) =>
        isSelected(ctx) ? 8 : ctx.raw?.clipped || ctx.raw?.play.isBest ? 6 : 4.5,
      pointHoverRadius: (ctx) =>
        isSelected(ctx) ? 9 : ctx.raw?.play.isBest ? 8 : 7,
      pointBorderColor: (ctx) =>
        isSelected(ctx) ? inkColor(0.9) : surfaceColor(),
      pointBorderWidth: (ctx) => (isSelected(ctx) ? 3 : 2),
      pointHoverBorderColor: (ctx) =>
        isSelected(ctx) ? inkColor(0.9) : surfaceColor(),
      pointHoverBorderWidth: (ctx) => (isSelected(ctx) ? 3 : 2),
    };
  });
}

function maxPlaysPerDifficulty(list) {
  const counts = {};
  for (const p of list) counts[p.difficulty] = (counts[p.difficulty] ?? 0) + 1;
  return Math.max(0, ...Object.values(counts));
}

function xScaleOptions() {
  const visible = visiblePlays.value;
  const base = {
    grid: { display: false },
    border: { color: inkColor(0.2) },
    ticks: {
      color: inkColor(0.6),
      maxRotation: 0,
      autoSkipPadding: 24,
      font: { size: 11 },
    },
  };

  if (xMode.value === "play") {
    return {
      ...base,
      type: "linear",
      min: 0.5,
      max: Math.max(maxPlaysPerDifficulty(visible), 1) + 0.5,
      ticks: {
        ...base.ticks,
        precision: 0,
        callback: (v) => (Number.isInteger(v) && v > 0 ? `#${v}` : ""),
      },
    };
  }

  const times = visible.map((p) => p.time);
  let first = times.length ? times[0] : Date.now();
  let last = times.length ? times[times.length - 1] : Date.now();
  const day = 24 * 3600 * 1000;
  const pad = Math.max((last - first) * 0.03, 2 * day);

  return {
    ...base,
    type: "time",
    min: first - pad,
    max: last + pad,
    time: {
      tooltipFormat: "LL",
      displayFormats: {
        hour: "MMM D, HH:mm",
        day: "MMM D",
        week: "MMM D",
        month: "MMM 'YY",
        quarter: "MMM 'YY",
        year: "YYYY",
      },
    },
    ticks: { ...base.ticks, maxTicksLimit: 8 },
  };
}

function yScaleOptions() {
  const { min, max } = yRange.value;
  return {
    min,
    max,
    // gridlines on grade borders
    afterBuildTicks: (scale) => {
      scale.ticks = GRADE_LINES.filter(
        (g, i, all) =>
          g.min >= scale.min &&
          g.min <= scale.max &&
          all.findIndex((o) => o.min === g.min) === i,
      ).map((g) => ({ value: g.min }));
    },
    grid: {
      color: (ctx) =>
        ctx.tick?.value === 1000000 ? inkColor(0.22) : inkColor(0.09),
      drawTicks: false,
    },
    border: { display: false },
    ticks: { display: false },
  };
}

// score + grade labels next to the gridlines
const gradeLabels = {
  id: "gradeLabels",
  afterDraw(chart) {
    const { ctx, chartArea, scales } = chart;
    const y = scales.y;
    if (!y) return;

    ctx.save();
    ctx.font = "11px Roboto, sans-serif";
    ctx.textBaseline = "middle";

    let lastPixel = -Infinity;
    const lines = GRADE_LINES.filter(
      (g, i, all) =>
        g.name &&
        g.min >= y.min &&
        g.min <= y.max &&
        all.findIndex((o) => o.min === g.min) === i,
    );

    for (const g of lines) {
      const py = y.getPixelForValue(g.min);
      if (py - lastPixel < 13) continue;
      lastPixel = py;

      ctx.fillStyle = inkColor(0.55);
      ctx.textAlign = "right";
      ctx.fillText(
        g.min >= 1000000 ? "1M" : `${g.min / 1000}k`,
        chartArea.left - 8,
        py,
      );

      ctx.fillStyle = inkColor(0.75);
      ctx.font = "bold 10px Roboto, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(g.name, chartArea.right + 8, py);
      ctx.font = "11px Roboto, sans-serif";
    }

    ctx.restore();
  },
};

// PB line, drawn from the points so it animates with them
const personalBest = {
  id: "personalBest",
  beforeDatasetsDraw(chart) {
    const { ctx, chartArea } = chart;
    ctx.save();
    ctx.beginPath();
    ctx.rect(chartArea.left, chartArea.top, chartArea.width, chartArea.height);
    ctx.clip();

    chart.data.datasets.forEach((dataset, i) => {
      const meta = chart.getDatasetMeta(i);
      if (!chart.isDatasetVisible(i) || !meta.data.length) return;

      const bests = meta.data.filter(
        (el, j) => dataset.data[j]?.play.isBest && dataset.data[j].y !== null,
      );
      if (!bests.length) return;

      ctx.beginPath();
      ctx.moveTo(bests[0].x, bests[0].y);
      for (let j = 1; j < bests.length; j++) {
        ctx.lineTo(bests[j].x, bests[j - 1].y);
        ctx.lineTo(bests[j].x, bests[j].y);
      }
      ctx.lineTo(chartArea.right, bests[bests.length - 1].y);

      ctx.strokeStyle = dataset.color;
      ctx.lineWidth = 2;
      ctx.lineJoin = "round";
      ctx.globalAlpha = 0.9;
      ctx.stroke();
    });

    ctx.restore();
  },
};

const crosshair = {
  id: "crosshair",
  beforeDatasetsDraw(chart) {
    const active = chart.tooltip?.getActiveElements?.() ?? [];
    if (!active.length) return;

    const { ctx, chartArea } = chart;
    const x = active[0].element.x;
    ctx.save();
    ctx.strokeStyle = inkColor(0.25);
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(x, chartArea.top);
    ctx.lineTo(x, chartArea.bottom);
    ctx.stroke();
    ctx.restore();
  },
};

// like nearest, but only if you're actually close to a point
Interaction.modes.nearestPlay = function (chart, e, options, useFinalPosition) {
  const items = Interaction.modes.nearest(
    chart,
    e,
    { intersect: false, axis: "xy" },
    useFinalPosition,
  );
  const pos = getRelativePosition(e, chart);
  return items
    .filter(
      ({ element }) => Math.hypot(element.x - pos.x, element.y - pos.y) < 28,
    )
    .slice(0, 1);
};

function externalTooltip({ chart, tooltip }) {
  const el = tooltipEl.value;
  if (!el) return;

  if (tooltip.opacity === 0 || !tooltip.dataPoints?.length) {
    el.style.opacity = 0;
    return;
  }

  const point = tooltip.dataPoints[0];
  const raw = point.raw;
  const play = raw.play;
  if (tooltipPoint.value?.historyIndex !== play.historyIndex) {
    tooltipPoint.value = {
      historyIndex: play.historyIndex,
      difficulty: point.dataset.label,
      color: point.dataset.color,
      score: play.score,
      grade: play.grade,
      clear: play.clear,
      isBest: play.isBest,
      playNumber: raw.playNumber,
      dateLabel: play.undated
        ? "Date unknown"
        : new Date(play.time).toLocaleString(undefined, {
            dateStyle: "medium",
            timeStyle: "short",
          }),
    };
  }

  // flip to the other side near the edge
  const width = el.offsetWidth || 170;
  const height = el.offsetHeight || 90;
  const gap = 14;
  let left = tooltip.caretX + gap;
  if (left + width > chart.width) left = tooltip.caretX - gap - width;
  let top = tooltip.caretY - height / 2;
  top = Math.max(0, Math.min(top, chart.height - height));

  el.style.opacity = 1;
  el.style.transform = `translate(${Math.round(left)}px, ${Math.round(top)}px)`;
}

let chart;
let lastActiveChange = 0;
let lastActiveKey = null;

function chartOptions() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 450, easing: "easeOutQuart" },
    layout: { padding: { left: 36, right: 58, top: 10, bottom: 4 } },
    interaction: { mode: "nearestPlay", intersect: false },
    scales: { x: xScaleOptions(), y: yScaleOptions() },
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: false,
        external: externalTooltip,
        animation: { duration: 120 },
      },
      zoom: {
        limits: {
          x: {
            min: "original",
            max: "original",
            minRange: xMode.value === "time" ? 3 * 24 * 3600 * 1000 : 3,
          },
        },
        pan: {
          enabled: true,
          mode: "x",
          threshold: 8,
          onPanComplete: () => (isZoomed.value = chart.isZoomedOrPanned()),
        },
        zoom: {
          wheel: { enabled: true, modifierKey: "ctrl", speed: 0.15 },
          pinch: { enabled: true },
          mode: "x",
          onZoomComplete: () => (isZoomed.value = chart.isZoomedOrPanned()),
        },
      },
    },

    onHover: (event, elements) => {
      const key = elements.length
        ? `${elements[0].datasetIndex}:${elements[0].index}`
        : null;
      if (key !== lastActiveKey) {
        lastActiveKey = key;
        lastActiveChange = performance.now();
      }
      event.native.target.style.cursor = elements.length ? "pointer" : "";
    },

    onClick: (event, elements) => {
      if (!elements.length) return;
      // on touch, first tap just shows the tooltip
      if (performance.now() - lastActiveChange < 250) return;

      const { datasetIndex, index } = elements[0];
      const historyIndex =
        chart.data.datasets[datasetIndex].data[index].play.historyIndex;
      // click the same play again to close
      selectPlay(selectedIndex.value === historyIndex ? null : historyIndex);
    },
  };
}

function render() {
  if (!chart) return;

  if (chart.isZoomedOrPanned()) chart.resetZoom("none");
  isZoomed.value = false;

  // update in place, otherwise chart.js redraws everything from scratch
  buildDatasets().forEach((dataset, i) => {
    const existing = chart.data.datasets[i];
    if (existing) Object.assign(existing, dataset);
    else chart.data.datasets[i] = dataset;
  });
  chart.options = chartOptions();
  chart.update();
}

onMounted(() => {
  chart = new Chart(playerChart.value, {
    type: "line",
    data: { datasets: buildDatasets() },
    options: chartOptions(),
    plugins: [gradeLabels, personalBest, crosshair],
  });
});

onBeforeUnmount(() => {
  chart?.destroy();
  chart = null;
  clearTimeout(wheelHintTimer);
});

watch(
  [() => props.playerHistory, () => props.difficultyFilter, xMode],
  render,
);
watch(
  themeName,
  () => nextTick(render),
);

let wheelHintTimer;
function onWheel(event) {
  if (event.ctrlKey || !hasPoints.value) return;
  showWheelHint.value = true;
  clearTimeout(wheelHintTimer);
  wheelHintTimer = setTimeout(() => (showWheelHint.value = false), 900);
}

function resetZoom() {
  chart?.resetZoom();
  isZoomed.value = false;
}

function isSelected(ctx) {
  return (
    selectedIndex.value !== null &&
    ctx.raw?.play.historyIndex === selectedIndex.value
  );
}

const selectedDetail = computed(() => {
  if (selectedIndex.value === null) return null;
  const play = plays.value.find((p) => p.historyIndex === selectedIndex.value);
  if (!play) return null;
  if (props.difficultyFilter && play.difficulty !== props.difficultyFilter)
    return null;

  const same = plays.value.filter((p) => p.difficulty === play.difficulty);
  const i = same.indexOf(play);
  return {
    play,
    difficulty: waccaDifficulties[play.difficulty - 1].name,
    color: difficultyColor(play.difficulty),
    playNumber: i + 1,
    prev: same[i - 1]?.historyIndex ?? null,
    next: same[i + 1]?.historyIndex ?? null,
  };
});

// keep the old one around while it collapses
const shownDetail = ref(null);
watch(selectedDetail, (detail) => {
  if (detail) shownDetail.value = detail;
});

function selectPlay(historyIndex) {
  selectedIndex.value = historyIndex;
  chart?.update();
}

watch(
  () => props.playerHistory,
  () => (selectedIndex.value = null),
);

function onKeydown(event) {
  if (selectedIndex.value === null) return;
  if (event.key === "Escape") selectPlay(null);
}

onMounted(() => window.addEventListener("keydown", onKeydown));
onBeforeUnmount(() => window.removeEventListener("keydown", onKeydown));
</script>
