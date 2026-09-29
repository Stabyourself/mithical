<template>
  <div
    ref="container"
    class="playfield-canvas"
    :class="view"
    :style="{ aspectRatio: aspect }"
  >
    <canvas
      ref="canvas"
      :class="{ paused }"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
      @contextmenu="onContextMenu"
    ></canvas>
    <!-- Text over the round view, always at full resolution -->
    <canvas
      v-if="view === 'circle'"
      ref="textCanvas"
      class="text-layer"
    ></canvas>

    <!-- Started paused: say what a click does. Clicks go through to the canvas, which starts it -->
    <div
      v-if="waitingToStart && !loading"
      class="playfield-hint"
      aria-hidden="true"
    >
      <span class="hint-click">Click to play</span>
      <span class="hint-tap">Tap to play</span>
    </div>

    <!-- The previous chart keeps playing underneath until the new one is in -->
    <div
      class="playfield-status"
      :class="{ visible: loading || loadError, error: loadError && !loading }"
      role="status"
      aria-live="polite"
    >
      <template v-if="loading">
        <v-progress-circular
          indeterminate
          size="28"
          width="3"
        ></v-progress-circular>
        <span>Loading chart…</span>
      </template>
      <template v-else-if="loadError">
        <v-icon>mdi-alert-circle-outline</v-icon>
        <span>{{ loadError }}</span>
      </template>
    </div>
  </div>
</template>

<style scoped>
.playfield-canvas {
  position: relative;
}

canvas {
  display: block;
  width: 100%;
  height: 100%;
  cursor: pointer;
  user-select: none;
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;
}

.circle canvas {
  border-radius: 50%;
}

.text-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.unrolled canvas {
  border-radius: 8px;
}

canvas {
  touch-action: none;
}

canvas.paused {
  touch-action: pan-y;
}

/* Click to play: Expert pink in the game's judgement font, with a shine of slashes sweeping across now and then */
.playfield-hint {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  /* Text sized to the view. On the overlay, which the view sizes, not on the view itself */
  container-type: inline-size;
}

.playfield-hint span {
  font-family: "judgement_font", sans-serif;
  font-size: clamp(22px, 9cqi, 56px);
  letter-spacing: -0.04em;
  white-space: nowrap;
  /* The Expert difficulty color (plugins/vuetify.ts), with a white shine over it: a band of
     slashes of different widths on a layer three times as wide as the text, starting off to the
     right, and sliding over to off the left */
  background:
    linear-gradient(
        115deg,
        transparent 0 40%,
        #fff 40% 41.5%,
        transparent 41.5% 43%,
        #fff 43% 46.5%,
        transparent 46.5% 48%,
        #fff 48% 48.6%,
        transparent 48.6% 50.5%,
        #fff 50.5% 52.5%,
        transparent 52.5%
      )
      0 0 / 300% 100% no-repeat,
    rgb(var(--v-theme-difficulty-3));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  /* Just enough to read it on bright notes */
  filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.7));
  animation: hint-shine 7s ease-in-out infinite;
}

/* Tap on touch screens */
.hint-tap {
  display: none;
}

@media (hover: none) {
  .hint-click {
    display: none;
  }

  .hint-tap {
    display: inline;
  }
}

/* Sweep right to left (~2.5s), then rest until the next one */
@keyframes hint-shine {
  0% {
    background-position: 0% 0;
  }
  35%,
  100% {
    background-position: 100% 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .playfield-hint span {
    animation: none;
  }
}

/* Loading and errors over the view. Fades in late so quick loads don't flash it */
.playfield-status {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #fff;
  font-size: 14px;
  background: rgba(0, 0, 0, 0.55);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s;
}

.playfield-status.visible {
  opacity: 1;
  transition-delay: 0.15s;
}

/* Errors stay up until the next load, dimmed less since the old chart keeps going */
.playfield-status.error {
  background: rgba(0, 0, 0, 0.4);
}

.circle .playfield-status {
  border-radius: 50%;
}

.unrolled .playfield-status {
  border-radius: 8px;
}
</style>

<script setup>
import PlayfieldRenderer from "~/assets/wacca/playfield/PlayfieldRenderer.js";
import UnrolledRenderer from "~/assets/wacca/playfield/UnrolledRenderer.js";

// One view of a song from usePlayfieldSession. Several can share one song
const props = defineProps({
  // What usePlayfieldSession returned
  controller: {
    type: Object,
    required: true
  },
  // circle: the round screen like in game, unrolled: the same lanes flattened into a strip
  view: {
    type: String,
    default: "circle",
    validator: (value) => ["circle", "unrolled"].includes(value)
  },
  // Width / height
  aspect: {
    type: Number,
    default: 1
  },
  // Profile options by id
  options: {
    type: Object,
    default: () => ({})
  },
  // What the view shows, see the renderers' setFeatures
  features: {
    type: Object,
    default: () => ({})
  },
  // { title, difficulty (1-4), level } for the ring, null for the demo
  chartInfo: {
    type: Object,
    default: null
  }
});

const { session, paused, loading, loadError, waitingToStart } =
  props.controller;
const container = ref(null);
const canvas = ref(null);
const textCanvas = ref(null);

let renderer = null;
let removeView = null;
let resizeObserver = null;
let intersectionObserver = null;
let onScreen = false;

// Real pixel density (up to 3x) so it's sharp on high DPI, capped so fullscreen doesn't get too expensive
const MAX_PIXEL_RATIO = 3;
// Firefox can draw in its GPU process where lag doesn't show up in frame timing,
// so it gets a lower cap
const IS_FIREFOX =
  typeof navigator !== "undefined" && /firefox/i.test(navigator.userAgent);
const MAX_CANVAS_SIZE = IS_FIREFOX ? 1400 : 2000;

let cssWidth = 0;
let cssHeight = 0;
// Exact device pixel width, if the browser tells us
let deviceWidth = 0;
let pixelRatioQuery = null;

function pixelRatio() {
  return window.devicePixelRatio || 1;
}

// Canvas pixels per CSS pixel
function canvasPixelRatio() {
  // Match device pixels exactly so it doesn't get resampled,
  // unless it disagrees with the pixel ratio (device emulation)
  const estimated = cssWidth * pixelRatio();
  const exact =
    deviceWidth && Math.abs(deviceWidth - estimated) <= 2
      ? deviceWidth / cssWidth
      : pixelRatio();
  return Math.min(
    exact,
    MAX_PIXEL_RATIO,
    MAX_CANVAS_SIZE / Math.max(cssWidth, cssHeight)
  );
}

function applySize() {
  if (!renderer || cssWidth === 0) return;

  const ratio = canvasPixelRatio();
  renderer.resize(Math.round(cssWidth * ratio), Math.round(cssHeight * ratio));
  renderer.resizeText?.(Math.round(cssWidth * ratio));
}

// Re-render when moving to another screen or zooming
function watchPixelRatio() {
  pixelRatioQuery?.removeEventListener("change", onPixelRatioChange);
  pixelRatioQuery = window.matchMedia(`(resolution: ${pixelRatio()}dppx)`);
  pixelRatioQuery.addEventListener("change", onPixelRatioChange);
}

function onPixelRatioChange() {
  applySize();
  props.controller.updateLoop();
  watchPixelRatio();
}

// What the frame loop in usePlayfieldSession calls
const loopHooks = {
  canDraw: () => renderer !== null && onScreen && cssWidth > 0,
  draw() {
    renderer.draw();
  }
};

function canvasPoint(event) {
  const rect = canvas.value.getBoundingClientRect();
  return [
    (event.clientX - rect.left) * (canvas.value.width / rect.width),
    (event.clientY - rect.top) * (canvas.value.height / rect.height)
  ];
}

// Easter egg: clicking a view lets you play it yourself
let lastPointerType = "mouse";

// Long presses on phones open the context menu, right clicks are left alone
function onContextMenu(event) {
  if (lastPointerType === "touch" || lastPointerType === "pen")
    event.preventDefault();
}

function onPointerDown(event) {
  lastPointerType = event.pointerType;
  if (!renderer) return;
  // Clicking a paused view only starts it, so the bot keeps playing. Clicking
  // again once it runs is what takes over
  if (props.controller.paused.value) {
    props.controller.play();
    return;
  }
  renderer.pointerDown(event.pointerId, ...canvasPoint(event));

  // Keep getting moves when dragging off the canvas
  try {
    canvas.value.setPointerCapture(event.pointerId);
  } catch {
    // Pointer already gone
  }
}

function onPointerMove(event) {
  renderer?.pointerMove(event.pointerId, ...canvasPoint(event));
}

function onPointerUp(event) {
  renderer?.pointerUp(event.pointerId);
}

watch(
  () => props.options,
  (options) => {
    if (!renderer) return;
    renderer.setOptions(options);
    props.controller.updateLoop();
  },
  { deep: true }
);

watch(
  () => props.features,
  (features) => {
    if (!renderer) return;
    renderer.setFeatures(features);
    props.controller.updateLoop();
  },
  { deep: true }
);

watch(
  () => props.chartInfo,
  (info) => {
    if (!renderer) return;
    renderer.setChartInfo(info);
    props.controller.updateLoop();
  }
);

onMounted(() => {
  renderer =
    props.view === "unrolled"
      ? new UnrolledRenderer(canvas.value, session)
      : new PlayfieldRenderer(canvas.value, session, textCanvas.value);
  renderer.setOptions(props.options);
  renderer.setFeatures(props.features);
  renderer.setChartInfo(props.chartInfo);
  // Redraw a paused view once the game font is in
  renderer.fontsReady.then(() => renderer && props.controller.updateLoop());

  resizeObserver = new ResizeObserver(([entry]) => {
    cssWidth = entry.contentRect.width;
    cssHeight = entry.contentRect.height;
    deviceWidth = entry.devicePixelContentBoxSize?.[0]?.inlineSize ?? 0;
    applySize();
    props.controller.updateLoop();
  });
  try {
    resizeObserver.observe(canvas.value, { box: "device-pixel-content-box" });
  } catch {
    // Not supported (Safari), fall back to CSS size × devicePixelRatio
    resizeObserver.observe(canvas.value);
  }
  watchPixelRatio();

  intersectionObserver = new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
    props.controller.updateLoop();
  });
  intersectionObserver.observe(container.value);

  // The observers only report after the first paint, which would show a blank canvas for a
  // frame (switching views flashes). Measure now so adding the view draws before that
  const rect = canvas.value.getBoundingClientRect();
  cssWidth = rect.width;
  cssHeight = rect.height;
  onScreen = rect.bottom > 0 && rect.top < window.innerHeight;
  applySize();

  removeView = props.controller.addView(loopHooks);
});

onBeforeUnmount(() => {
  removeView?.();
  resizeObserver?.disconnect();
  intersectionObserver?.disconnect();
  pixelRatioQuery?.removeEventListener("change", onPixelRatioChange);
  renderer?.destroy();
  renderer = null;
});
</script>
