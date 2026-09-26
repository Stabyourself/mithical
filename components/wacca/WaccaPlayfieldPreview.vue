<template>
  <div class="playfield-preview">
    <!-- Holds the spot in the layout while in the lightbox -->
    <div v-if="expanded" class="playfield-placeholder"></div>

    <!-- Moves the same elements so the demo keeps running -->
    <Teleport to="body" :disabled="!expanded">
      <div
        :class="{ 'playfield-lightbox': expanded }"
        @click.self="expanded = false"
      >
        <div class="playfield-stage">
          <div ref="container" class="playfield-canvas">
            <canvas
              ref="canvas"
              :class="{ playing }"
              @pointerdown="onPointerDown"
              @pointermove="onPointerMove"
              @pointerup="onPointerUp"
              @pointercancel="onPointerUp"
            ></canvas>
          </div>

          <div class="playfield-controls">
            <v-btn-group
              color="primary"
              density="comfortable"
              rounded="pill"
              divided
            >
              <v-btn
                :aria-label="paused ? 'Play preview' : 'Pause preview'"
                :title="paused ? 'Play' : 'Pause'"
                @click="togglePause"
              >
                <v-icon>{{ paused ? "mdi-play" : "mdi-pause" }}</v-icon>
              </v-btn>
              <v-btn
                :aria-label="expanded ? 'Exit fullscreen' : 'Fullscreen preview'"
                :title="expanded ? 'Exit fullscreen' : 'Fullscreen'"
                @click="expanded = !expanded"
              >
                <v-icon>{{
                  expanded ? "mdi-fullscreen-exit" : "mdi-fullscreen"
                }}</v-icon>
              </v-btn>
            </v-btn-group>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.playfield-preview {
  width: min(100%, 560px);
  margin: 0 auto 32px;
}

/* Same size as the preview plus controls */
.playfield-placeholder {
  aspect-ratio: 1 / 1;
  margin-bottom: 48px;
}

.playfield-canvas {
  aspect-ratio: 1 / 1;
}

.playfield-controls {
  display: flex;
  justify-content: center;
  margin-top: 8px;
}

/* Lightbox: as big as the window allows */
.playfield-lightbox {
  position: fixed;
  inset: 0;
  z-index: 2400;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.85);
}

.playfield-lightbox .playfield-stage {
  width: min(100vw - 32px, 100vh - 32px - 48px);
}

canvas {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

/* Swipes shouldn't scroll the page while playing */
canvas.playing {
  touch-action: none;
}
</style>

<script setup>
import PlayfieldRenderer from "~/assets/wacca/playfield/PlayfieldRenderer.js";

const props = defineProps({
  // Profile options by id
  options: {
    type: Object,
    default: () => ({}),
  },
});

const container = ref(null);
const canvas = ref(null);
const expanded = ref(false);

let renderer = null;
let resizeObserver = null;
let intersectionObserver = null;

let frame = null;
let lastFrameTime = null;
let onScreen = false;
let active = true;

// Start paused for reduced motion
const paused = ref(
  typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
);

// Easter egg: clicking the preview lets you play it yourself
const playing = ref(false);

// Real pixel density (up to 3x) so it's sharp on high DPI, capped so fullscreen doesn't get too expensive
const MAX_PIXEL_RATIO = 3;
// Firefox can draw in its GPU process where lag doesn't show up in frame timing,
// so it gets a lower cap
const IS_FIREFOX = typeof navigator !== "undefined" && /firefox/i.test(navigator.userAgent);
const MAX_CANVAS_SIZE = IS_FIREFOX ? 1400 : 2000;
// Lowest density the fallback drops to
const MIN_PIXEL_RATIO = 1.5;

let cssSize = 0;
// Exact device pixel size, if the browser tells us
let devicePixelSize = 0;
let resolutionScale = 1;
let pixelRatioQuery = null;

function pixelRatio() {
  return window.devicePixelRatio || 1;
}

// Canvas size before the fallback scales it down
function fullCanvasSize() {
  // Match device pixels exactly so it doesn't get resampled,
  // unless it disagrees with the pixel ratio (device emulation)
  const estimated = Math.round(cssSize * pixelRatio());
  const exact =
    devicePixelSize && Math.abs(devicePixelSize - estimated) <= 2 ? devicePixelSize : estimated;
  return Math.min(exact, Math.round(cssSize * MAX_PIXEL_RATIO), MAX_CANVAS_SIZE);
}

function minResolutionScale() {
  return Math.min(1, (cssSize * MIN_PIXEL_RATIO) / fullCanvasSize());
}

function applySize() {
  if (!renderer || cssSize === 0) return;

  renderer.resize(fullCanvasSize() * resolutionScale);
  frameCount = 0;
  windowsSinceResize = 0;
}

// Fallback: drop resolution when frames get missed or drawing eats most of a frame.
// Need both since some browsers queue the drawing elsewhere
const FRAME_WINDOW = 30;
const frameTimes = new Float32Array(FRAME_WINDOW);
const drawTimes = new Float32Array(FRAME_WINDOW);
let frameCount = 0;
let windowsSinceResize = 0;

function adaptResolution(dt, drawTime) {
  // Skip the first frame and big gaps (tab switches etc)
  if (dt <= 0 || dt > 250) return;

  frameTimes[frameCount] = dt;
  drawTimes[frameCount] = drawTime;
  if (++frameCount < FRAME_WINDOW) return;
  frameCount = 0;

  // First window after a resize includes the layer rebuild
  if (++windowsSinceResize < 2) return;

  // Frame interval from the faster frames, at least 60Hz
  const sorted = Array.from(frameTimes).sort((a, b) => a - b);
  const interval = Math.min(sorted[Math.floor(FRAME_WINDOW * 0.2)], 1000 / 60);
  const missed = sorted.filter((time) => time > interval * 1.6).length / FRAME_WINDOW;
  const averageDraw = drawTimes.reduce((sum, time) => sum + time, 0) / FRAME_WINDOW;
  const tooSlow = missed > 0.2 || averageDraw > interval * 0.7;

  const minScale = minResolutionScale();
  if (tooSlow && resolutionScale > minScale) {
    // Bigger steps when most frames are missed
    const step = missed > 0.5 ? 0.3 : 0.15;
    resolutionScale = Math.max(minScale, resolutionScale - step);
    applySize();
  }
}

// Re-render when moving to another screen or zooming
function watchPixelRatio() {
  pixelRatioQuery?.removeEventListener("change", onPixelRatioChange);
  pixelRatioQuery = window.matchMedia(`(resolution: ${pixelRatio()}dppx)`);
  pixelRatioQuery.addEventListener("change", onPixelRatioChange);
}

function onPixelRatioChange() {
  resolutionScale = Math.max(resolutionScale, minResolutionScale());
  applySize();
  updateLoop();
  watchPixelRatio();
}

function tick(now) {
  frame = requestAnimationFrame(tick);

  const dt = lastFrameTime === null ? 0 : now - lastFrameTime;
  lastFrameTime = now;

  const start = performance.now();
  renderer.render(dt);
  playing.value = renderer.playing;
  adaptResolution(dt, performance.now() - start);
}

function updateLoop() {
  const canDraw = renderer && onScreen && active && cssSize > 0;
  const shouldRun = canDraw && !paused.value;

  if (shouldRun && frame === null) {
    lastFrameTime = null;
    frame = requestAnimationFrame(tick);
  } else if (!shouldRun && frame !== null) {
    cancelAnimationFrame(frame);
    frame = null;
  }

  // Paused: still redraw so option changes show
  if (canDraw && !shouldRun) {
    renderer.render(0);
  }
}

function togglePause() {
  paused.value = !paused.value;
  updateLoop();
}

function canvasPoint(event) {
  const rect = canvas.value.getBoundingClientRect();
  const scale = canvas.value.width / rect.width;
  return [(event.clientX - rect.left) * scale, (event.clientY - rect.top) * scale];
}

function onPointerDown(event) {
  if (!renderer) return;
  // Clicking in means you want to play, so unpause
  if (paused.value) togglePause();
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

function onKeyDown(event) {
  if (event.key === "Escape") expanded.value = false;
}

// Lightbox: Escape closes, page doesn't scroll behind it
watch(expanded, (isExpanded) => {
  // Very different sizes, so start again at full res
  resolutionScale = 1;

  document.documentElement.style.overflow = isExpanded ? "hidden" : "";
  if (isExpanded) window.addEventListener("keydown", onKeyDown);
  else window.removeEventListener("keydown", onKeyDown);
});

watch(
  () => props.options,
  (options) => {
    if (!renderer) return;
    renderer.setOptions(options);
    updateLoop();
  },
  { deep: true },
);

onMounted(() => {
  renderer = new PlayfieldRenderer(canvas.value);
  renderer.setOptions(props.options);

  resizeObserver = new ResizeObserver(([entry]) => {
    cssSize = entry.contentRect.width;
    devicePixelSize = entry.devicePixelContentBoxSize?.[0]?.inlineSize ?? 0;
    applySize();
    updateLoop();
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
    updateLoop();
  });
  intersectionObserver.observe(container.value);
});

// Pages are kept alive, stop drawing when navigated away
onActivated(() => {
  active = true;
  updateLoop();
});

onDeactivated(() => {
  expanded.value = false;
  active = false;
  updateLoop();
});

onBeforeUnmount(() => {
  expanded.value = false;
  document.documentElement.style.overflow = "";
  window.removeEventListener("keydown", onKeyDown);
  active = false;
  updateLoop();
  resizeObserver?.disconnect();
  intersectionObserver?.disconnect();
  pixelRatioQuery?.removeEventListener("change", onPixelRatioChange);
  renderer = null;
});
</script>
