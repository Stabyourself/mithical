<template>
  <div class="histogram">
    <div class="histogram-header">
      <div class="histogram-title">
        <span class="swatch" :style="{ background: color }"></span>
        {{ props.label }}
      </div>
      <div class="histogram-subtitle">
        <template v-if="stats.total">
          {{ stats.total.toLocaleString("en-US") }} score{{
            stats.total == 1 ? "" : "s"
          }}
          · median {{ formatShort(stats.median) }}
        </template>
        <template v-else>No scores yet</template>
      </div>
    </div>

    <div class="histogram-canvas">
      <canvas ref="histogramChart"></canvas>

      <div ref="tooltipEl" class="histogram-tooltip">
        <template v-if="tooltipBucket">
          <div class="tt-range">{{ tooltipBucket.range }}</div>
          <div v-if="tooltipBucket.grade" class="tt-grade">
            {{ tooltipBucket.grade }}
          </div>
          <div class="tt-main">{{ tooltipBucket.main }}</div>
          <div v-if="tooltipBucket.sub" class="tt-sub">
            {{ tooltipBucket.sub }}
          </div>
          <div v-if="tooltipBucket.isYours" class="tt-you">You're here</div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.histogram {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.histogram-header {
  padding: 4px 10px 0;
}

.histogram-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 1rem;
  font-weight: 700;

  .swatch {
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }
}

.histogram-subtitle {
  font-size: 0.78rem;
  color: rgba(var(--v-theme-on-surface), 0.65);
  font-variant-numeric: tabular-nums;
}

.histogram-canvas {
  position: relative;
  flex: 1;
  min-height: 0;
}

.histogram-tooltip {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  padding: 7px 10px;
  border-radius: 8px;
  background: rgb(var(--v-theme-surface));
  color: rgb(var(--v-theme-on-surface));
  border: 1px solid rgba(var(--v-theme-on-surface), 0.12);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.15s ease;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;

  .tt-range {
    font-size: 0.75rem;
    opacity: 0.7;
  }

  .tt-grade {
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.04em;
  }

  .tt-main {
    font-size: 1rem;
    font-weight: 700;
  }

  .tt-sub {
    font-size: 0.75rem;
    opacity: 0.7;
  }

  .tt-you {
    margin-top: 3px;
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: rgb(var(--v-theme-primary));
  }
}
</style>

<script setup>
import { Chart } from "chart.js";

const props = defineProps({
  score: Number,
  scores: Array,
  difficulty: Number,
  label: String,
  // "distribution" or "cumulative"
  view: { type: String, default: "distribution" },
});

const { themeName, inkColor, surfaceColor, difficultyColor } = useChartTheme();

const BUCKET = 10000;
const MASTER = 1000000;

const GRADES = [
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
  { min: 1, name: "C" },
];

const histogramChart = ref(null);
const tooltipEl = ref(null);
const tooltipBucket = ref(null);

const color = computed(() => difficultyColor(props.difficulty));

function gradeName(score) {
  return GRADES.find((g) => score >= g.min)?.name ?? "";
}

function formatShort(score) {
  if (score >= MASTER) return "1M";
  return `${Math.floor(score / 1000)}k`;
}

// don't rely on the api order
const entries = computed(() =>
  (props.scores ?? [])
    .map((e) => ({ score: Number(e.score), count: parseInt(e.count) || 0 }))
    .filter((e) => e.count > 0)
    .sort((a, b) => a.score - b.score),
);

const stats = computed(() => {
  const list = entries.value;
  const total = list.reduce((sum, e) => sum + e.count, 0);

  const scoreAt = (fraction) => {
    let seen = 0;
    for (const e of list) {
      seen += e.count;
      if (seen >= total * fraction) return e.score;
    }
    return 0;
  };

  return { total, median: scoreAt(0.5), p10: scoreAt(0.1) };
});

function countAtLeast(value) {
  return entries.value.reduce((n, e) => (e.score >= value ? n + e.count : n), 0);
}

const you = computed(() => {
  if (!props.score || !stats.value.total) return null;
  const atLeast = countAtLeast(props.score);
  return {
    top: Math.max(0.1, Math.round((atLeast / stats.value.total) * 1000) / 10),
  };
});

// <start, 10k buckets, then 1M on its own
const buckets = computed(() => {
  const start = Math.min(
    900000,
    Math.max(500000, Math.floor(stats.value.p10 / 50000) * 50000),
  );

  const list = [{ kind: "below", lo: 0, hi: start - 1 }, { kind: "gap" }];
  for (let lo = start; lo < MASTER; lo += BUCKET) {
    list.push({ kind: "range", lo, hi: lo + BUCKET - 1 });
  }
  list.push({ kind: "gap" }, { kind: "master", lo: MASTER, hi: MASTER });

  const total = stats.value.total || 1;
  for (const b of list) {
    if (b.kind === "gap") continue;
    b.count = entries.value.reduce(
      (n, e) => (e.score >= b.lo && e.score <= b.hi ? n + e.count : n),
      0,
    );
    b.pct = (b.count / total) * 100;
    b.pctAtLeast = (countAtLeast(b.lo) / total) * 100;
    b.pctAbove = (countAtLeast(b.hi + 1) / total) * 100;
  }

  return { start, list };
});

function bucketIndexFor(score) {
  return buckets.value.list.findIndex(
    (b) => b.kind !== "gap" && score >= b.lo && score <= b.hi,
  );
}

function positionFor(score) {
  const i = bucketIndexFor(score);
  if (i < 0) return null;
  const b = buckets.value.list[i];
  if (b.kind !== "range") return i;
  return i - 0.5 + (score - b.lo) / BUCKET;
}

const yourIndex = computed(() =>
  props.score ? bucketIndexFor(props.score) : -1,
);

function bucketLabel(b) {
  if (b.kind === "below") return `<${formatShort(b.hi + 1)}`;
  if (b.kind === "master") return "MASTER";
  if (b.kind === "range") return formatShort(b.lo);
  return "";
}

function buildDatasets() {
  const list = buckets.value.list;
  const played = yourIndex.value >= 0;
  const base = color.value;

  return [
    {
      type: "bar",
      data: list.map((b) => (b.kind === "gap" ? null : b.pct)),
      backgroundColor: list.map((b, i) =>
        !played || i === yourIndex.value ? base : withAlpha(base, 0.55),
      ),
      hoverBackgroundColor: base,
      borderRadius: 3,
      borderSkipped: "bottom",
      categoryPercentage: 0.88,
      barPercentage: 1,
      hidden: props.view !== "distribution",
    },
    {
      type: "line",
      data: list.map((b) => (b.kind === "gap" ? null : b.pctAtLeast)),
      borderColor: base,
      backgroundColor: withAlpha(base, 0.18),
      fill: "origin",
      borderWidth: 2,
      tension: 0.25,
      spanGaps: true,
      pointRadius: 0,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: base,
      pointHoverBorderColor: surfaceColor(),
      pointHoverBorderWidth: 2,
      hidden: props.view !== "cumulative",
    },
  ];
}

function niceMax(value) {
  const padded = value * 1.3;
  const step = padded > 20 ? 5 : padded > 8 ? 2 : 1;
  return Math.max(step, Math.ceil(padded / step) * step);
}

function chartOptions() {
  const list = buckets.value.list;
  const distribution = props.view === "distribution";
  const maxPct = Math.max(0, ...list.map((b) => b.pct ?? 0));

  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 450, easing: "easeOutQuart" },
    layout: { padding: { top: 18, right: 10, left: 2 } },
    interaction: { mode: "index", intersect: false },
    scales: {
      x: {
        grid: { display: false },
        border: { color: inkColor(0.2) },
        ticks: {
          autoSkip: false,
          maxRotation: 0,
          color: inkColor(0.6),
          font: { size: 11 },
          callback(value) {
            const b = list[value];
            if (!b || b.kind === "gap") return "";
            if (b.kind !== "range") return bucketLabel(b);
            const step = this.chart.width < 420 ? 100000 : 50000;
            // would overlap the <start label
            return b.lo % step === 0 && b.lo !== buckets.value.start
              ? bucketLabel(b)
              : "";
          },
        },
      },
      y: {
        min: 0,
        max: distribution ? niceMax(maxPct) : 118,
        border: { display: false },
        grid: { color: inkColor(0.08), drawTicks: false },
        ticks: {
          color: inkColor(0.55),
          font: { size: 11 },
          padding: 6,
          maxTicksLimit: 5,
          stepSize: distribution ? undefined : 25,
          callback: (v) => (v > 100 ? "" : `${v}%`),
        },
      },
    },
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: {
        enabled: false,
        external: externalTooltip,
        filter: (item) => item.datasetIndex === (distribution ? 0 : 1),
      },
    },
  };
}

const gradeMarkers = {
  id: "gradeMarkers",
  beforeDatasetsDraw(chart) {
    const { ctx, chartArea, scales } = chart;
    const placed = [];

    ctx.save();
    ctx.font = "bold 10px Roboto, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";

    for (const g of GRADES) {
      if (g.min >= MASTER || g.min <= buckets.value.start) continue;
      const pos = positionFor(g.min);
      if (pos === null) continue;

      const x = scales.x.getPixelForValue(pos);
      const width = ctx.measureText(g.name).width;

      ctx.strokeStyle = inkColor(0.12);
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 3]);
      ctx.beginPath();
      ctx.moveTo(x, chartArea.top);
      ctx.lineTo(x, chartArea.bottom);
      ctx.stroke();

      if (placed.some((p) => Math.abs(p - x) < width + 6)) continue;
      placed.push(x);
      ctx.fillStyle = inkColor(0.5);
      ctx.fillText(g.name, x, chartArea.top - 4);
    }

    ctx.restore();
  },
};

const yourMarker = {
  id: "yourMarker",
  afterDatasetsDraw(chart) {
    if (!props.score || !you.value) return;
    const pos = positionFor(props.score);
    if (pos === null) return;

    const { ctx, chartArea, scales } = chart;
    const x = scales.x.getPixelForValue(pos);
    const text = `You · Top ${you.value.top}%`;

    ctx.save();
    ctx.strokeStyle = inkColor(0.85);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, chartArea.top + 8);
    ctx.lineTo(x, chartArea.bottom);
    ctx.stroke();

    ctx.font = "bold 11px Roboto, sans-serif";
    const w = ctx.measureText(text).width + 12;
    const h = 18;
    const left = Math.min(
      Math.max(x - w / 2, chartArea.left),
      chartArea.right - w,
    );
    const top = chartArea.top + 4;

    ctx.fillStyle = inkColor(0.85);
    ctx.beginPath();
    ctx.roundRect(left, top, w, h, 9);
    ctx.fill();

    ctx.fillStyle = surfaceColor();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, left + w / 2, top + h / 2 + 0.5);
    ctx.restore();
  },
};

let tooltipKey = null;
let tooltipSize = { width: 0, height: 0 };

function externalTooltip({ chart, tooltip }) {
  const el = tooltipEl.value;
  if (!el) return;

  const point = tooltip.dataPoints?.[0];
  const b = point && buckets.value.list[point.dataIndex];
  if (tooltip.opacity === 0 || !b || b.kind === "gap") {
    el.style.opacity = 0;
    return;
  }

  const place = () => {
    const { width, height } = tooltipSize;
    const gap = 12;
    let left = tooltip.caretX + gap;
    if (left + width > chart.width) left = tooltip.caretX - gap - width;
    left = Math.max(0, left);
    const top = Math.max(
      0,
      Math.min(tooltip.caretY - height / 2, chart.height - height),
    );

    el.style.opacity = 1;
    el.style.transform = `translate(${Math.round(left)}px, ${Math.round(top)}px)`;
  };

  // same bar as last time, just move it
  const key = `${props.view}:${point.dataIndex}`;
  if (key === tooltipKey) {
    place();
    return;
  }
  tooltipKey = key;

  const fmt = (n) => n.toLocaleString("en-US");
  const pct = (n) => `${n < 10 ? n.toFixed(1) : Math.round(n)}%`;
  const range =
    b.kind === "below"
      ? `Below ${fmt(b.hi + 1)}`
      : b.kind === "master"
        ? fmt(MASTER)
        : `${fmt(b.lo)} – ${fmt(b.hi)}`;

  tooltipBucket.value =
    props.view === "distribution"
      ? {
          range,
          grade: b.kind === "below" ? "" : gradeName(b.lo),
          main: `${fmt(b.count)} score${b.count == 1 ? "" : "s"} · ${pct(b.pct)}`,
          sub: b.kind === "master" ? "" : `${pct(b.pctAbove)} scored higher`,
          isYours: point.dataIndex === yourIndex.value,
        }
      : {
          range: b.kind === "below" ? "Any score" : `${fmt(b.lo)} or more`,
          grade: b.kind === "below" ? "" : gradeName(b.lo),
          main: `${pct(b.kind === "below" ? 100 : b.pctAtLeast)} of scores`,
          sub: "",
          isYours: point.dataIndex === yourIndex.value,
        };

  // only measure when the content changed
  nextTick(() => {
    tooltipSize = { width: el.offsetWidth, height: el.offsetHeight };
    place();
  });
}

let chart;
let lastView = props.view;

function render() {
  if (!chart) return;
  tooltipKey = null;

  const datasets = buildDatasets();
  chart.data.labels = buckets.value.list.map((_, i) => i);
  chart.options = chartOptions();

  // hidden datasets fly in from the top otherwise, so start them at 0
  if (props.view !== lastView) {
    lastView = props.view;
    datasets.forEach((dataset, i) => {
      Object.assign(chart.data.datasets[i], dataset, {
        data: dataset.hidden
          ? dataset.data
          : dataset.data.map((v) => (v === null ? null : 0)),
      });
    });
    chart.update("none");
  }

  datasets.forEach((dataset, i) => {
    Object.assign(chart.data.datasets[i], dataset);
  });
  chart.update();
}

onMounted(() => {
  chart = new Chart(histogramChart.value, {
    data: {
      labels: buckets.value.list.map((_, i) => i),
      datasets: buildDatasets(),
    },
    options: chartOptions(),
    plugins: [gradeMarkers, yourMarker],
  });
});

onBeforeUnmount(() => {
  chart?.destroy();
  chart = null;
});

watch(
  [() => props.scores, () => props.score, () => props.view, () => props.difficulty],
  render,
);
watch(themeName, () => nextTick(render));
</script>
