// WACCA playfield preview renderer
//
// Geometry, colors and timing are ported from SaturnView (https://github.com/Yasu3D/SaturnView),
// MIT licensed, see SATURNVIEW_LICENSE. HUD layout is eyeballed from gameplay videos
//
// Perf stuff:
// - notes are drawn once at judgement line size and scaled with a transform,
//   so gradients and paths can be built once and reused
// - background, guidelines and judgement line only change with options/size,
//   so they're pre-rendered into layers

import {
  palettes,
  holdGradients,
  holdGradientsActive,
  holdGradientStops,
  paletteIndex,
  capColors,
  syncColors,
} from "./noteColors.js";
import { buildChart, bpm, loopMs, loopsPerSong } from "./demoChart.js";

const DEG = Math.PI / 180;

// Note widths per thickness setting, in 1060px canvas units
const STROKE_WIDTHS = [16, 22, 34, 46, 58];

// Gradient positions across the note body per thickness setting
const BODY_GRADIENT_POSITIONS = [
  [0.2, 0.5, 0.5, 0.8, 0.8],
  [0.25, 0.333, 0.458, 0.58, 0.791],
  [0.194, 0.333, 0.444, 0.638, 0.861],
  [0.145, 0.25, 0.604, 0.708, 0.875],
  [0.1, 0.183, 0.666, 0.783, 0.916],
];

// Sync outline radii per thickness setting
const SYNC_OUTLINE_RADII = [
  [0.971, 0.983, 1.014, 1.026, 0.977, 1.02],
  [0.963, 0.975, 1.025, 1.037, 0.969, 1.031],
  [0.946, 0.958, 1.043, 1.055, 0.952, 1.049],
  [0.926, 0.938, 1.063, 1.075, 0.932, 1.069],
  [0.91, 0.922, 1.08, 1.092, 0.915, 1.086],
];

// Background dim per mask setting
const MASK_ALPHAS = [0, 0x55, 0x9d, 0xb6, 0xdd].map((value) => value / 255);

// Which lanes get a guideline for types A-G
const GUIDELINE_RULES = [
  () => false,
  () => true,
  (i) => (i + 1) % 2 === 0,
  (i) => i % 3 === 0,
  (i) => (i + 1) % 4 === 0,
  (i) => i % 5 === 0,
  (i) => (i + 5) % 10 === 0,
  (i) => i % 15 === 0,
];

const JUDGEMENT_LINE_COLORS = ["#f11a9b", "#bd01fa"];
// Lane stripe colors
const LANE_COLORS = [
  [22, 24, 44],
  [27, 28, 47],
];

// Background behind the lanes, shows through their center
const BACKGROUND_STOPS = [
  [0, [53, 32, 122]],
  [0.35, [29, 20, 80]],
  [1, [10, 8, 24]],
];

// Center display = max possible score minus this
const CENTER_BORDERS = { 4: 900000, 5: 950000, 6: 990000, 7: 985000 };
const CENTER_LABELS = {
  1: "COMBO",
  2: "SCORE",
  3: "SCORE",
  4: "S BORDER",
  5: "SS BORDER",
  6: "SSS BORDER",
  7: "PERSONAL BEST",
};

// Same font and gradients as the recent plays judgement labels
const JUDGEMENT_FONT = '"SHINBI", sans-serif';
const JUDGEMENT_STYLES = {
  marvelous: { text: "Marvelous", top: "#ff1e8c", bottom: "#fe8e34" },
  great: { text: "Great", top: "#ffff88", bottom: "#c2e67b" },
  FAST: { text: "Fast", top: "#fd6d1e", bottom: "#ad093f" },
  LATE: { text: "Late", top: "#8872fe", bottom: "#1e1eff" },
};

const JUDGEMENT_OFFSETS = [0.185, 0.47, -0.45];

const KEY_BEAM_FADE_MS = 180;
const R_EFFECT_MS = 550;
// Sparkle colors over their lifetime: white -> yellow -> dim pink
const SPARKLE_WHITE = [
  [255, 255, 255],
  [255, 250, 200],
  [255, 130, 180],
];
const SPARKLE_YELLOW = [
  [255, 255, 235],
  [235, 255, 110],
  [255, 100, 110],
];
const SHOT_MS = 170;
const GRIND_PER_LANE_MS = 0.012;
const MAX_PARTICLES = 256;
const MAX_BUBBLES = 240;
const BUBBLE_LIFE_MS = 460;

// Ring text styles, from direct feed videos
const SONG_COUNT_COLOR = "#f9a3ad";
const SONG_TITLE_COLOR = "#f0c8ee";

// Random title for the demo song
const SONG_TITLES = [
  "Nearl the Radiant Knight",
  "Big Blast Sonic",
  "Fhqwhgads",
  "Ground Pound",
  "Pop on Rocks",
  "Chug Jug With You",
  "Mogu Mogu Yummy",
];

const FONT ='"Roboto", "Helvetica Neue", Arial, sans-serif';

function perspective(x) {
  x = Math.min(1.316, x);
  return (3.325 * x) / (13.825 - 10.5 * x);
}

// Lane opacity by distance from the center, see-through in the middle
function laneAlphaAt(position) {
  if (position <= 0.1) return 0;
  if (position <= 0.25) return ((position - 0.1) / 0.15) * (0x60 / 255);
  if (position <= 0.75) return 0x60 / 255 + ((position - 0.25) / 0.5) * ((0xee - 0x60) / 255);
  return 0xee / 255;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function mod60(value) {
  return ((value % 60) + 60) % 60;
}

function option(options, id, fallback) {
  const value = options?.[id];
  return value === undefined || value === null ? fallback : Number(value);
}

function resolveSettings(options) {
  return {
    viewDistance: 3333.333 / ((option(options, 1, 5) + 10) * 0.1),
    mask: clamp(option(options, 2, 0), 0, 4),
    mirror: option(options, 101, 0) === 1,
    judgementPosition: option(options, 102, 0),
    judgementDetail: option(options, 103, 0) === 1,
    barlines: option(options, 105, 1) === 1,
    guidelineIntensity: clamp(option(options, 106, 5), 0, 5) / 5,
    thickness: clamp(option(options, 110, 3), 1, 5) - 1,
    bonusEffect: option(options, 114, 1) === 1,
    scoreMinus: option(options, 116, 0) === 1,
    guidelineType: clamp(option(options, 118, 1), 0, 7),
    centerDisplay: option(options, 119, 1),
    keyBeam: option(options, 133, 1) === 1,
    slideInvert: option(options, 136, 0) === 1,
    touchEffectShoot: option(options, 138, 1) === 1,
    rNoteEffect: option(options, 139, 1) === 1,
    infoOpacity: clamp(option(options, 140, 5), 0, 5) / 5,
    touchEffectPop: option(options, 1006, 312001),
    colors: {
      slideCW: paletteIndex(option(options, 201, 4), 4),
      slideCCW: paletteIndex(option(options, 202, 3), 3),
      snapIn: paletteIndex(option(options, 203, 1), 1),
      snapOut: paletteIndex(option(options, 204, 2), 2),
      touch: paletteIndex(option(options, 205, 5), 5),
      chain: paletteIndex(option(options, 206, 6), 6),
      hold: paletteIndex(option(options, 207, 7), 7),
    },
  };
}

export default class PlayfieldRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    // Not alpha: false, Firefox shows garbage behind the rounded corners of an opaque canvas
    this.ctx = canvas.getContext("2d");
    // Plain background, also used for masked lanes
    this.backgroundLayer = document.createElement("canvas");
    // Everything static under the notes, copied at the start of each frame
    this.baseLayer = document.createElement("canvas");
    this.ringTextLayer = document.createElement("canvas");
    this.beamLayer = document.createElement("canvas");
    // For composing the judgement line
    this.scratch = document.createElement("canvas");
    this.songTitle = SONG_TITLES[Math.floor(Math.random() * SONG_TITLES.length)];
    this.laneHidden = new Uint8Array(60);

    this.settings = resolveSettings({});
    document.fonts?.load(`40px ${JUDGEMENT_FONT}`).catch(() => {});
    this.chart = buildChart(false);
    this.cache = new Map();
    // Full rebuild on resize, partial ones on option changes
    this.dirty = true;
    this.dirtyBackground = false;
    this.dirtyBase = false;
    this.dirtyThickness = false;

    this.beamUntil = new Float64Array(60);
    this.pointers = new Map();
    this.activeHolds = [];
    this.bonusSweeps = [];
    this.flashes = [];
    this.bubbles = [];
    this.shots = [];
    this.particles = [];
    for (let i = 0; i < MAX_PARTICLES; i++) {
      this.particles.push({ alive: false });
    }
    this.reset();

    this.items = [];
    this.itemCount = 0;
    this.holdSurfaces = [];
    this.holdEnds = [];
    this.textWidths = new Map();
  }

  // Only rebuilds what changed so settings don't hitch
  setOptions(options) {
    const settings = resolveSettings(options);
    const previous = this.settings;
    this.settings = settings;

    if (settings.mirror !== previous.mirror) {
      this.chart = buildChart(settings.mirror);
      this.activeHolds.length = 0;
    }
    if (settings.mask !== previous.mask) this.dirtyBackground = true;
    if (settings.thickness !== previous.thickness) this.dirtyThickness = true;
    if (
      settings.guidelineType !== previous.guidelineType ||
      settings.guidelineIntensity !== previous.guidelineIntensity
    ) {
      this.dirtyBase = true;
    }
  }

  resize(pixelSize) {
    const size = Math.max(1, Math.round(pixelSize));
    if (size === this.canvas.width) return;

    this.canvas.width = size;
    this.canvas.height = size;
    for (const layer of [
      this.backgroundLayer,
      this.baseLayer,
      this.ringTextLayer,
      this.beamLayer,
      this.scratch,
    ]) {
      layer.width = size;
      layer.height = size;
    }
    this.dirty = true;
  }

  // Restart the demo
  reset() {
    // Start a measure early so notes are already coming in
    this.time = -loopMs / 4;
    this.songIndex = Math.floor(this.time / (loopMs * loopsPerSong));
    this.resetStats();

    this.beamUntil.fill(-Infinity);
    this.activeHolds.length = 0;
    this.bonusSweeps.length = 0;
    this.flashes.length = 0;
    this.bubbles.length = 0;
    this.shots.length = 0;
    for (const particle of this.particles) particle.alive = false;
    this.judgement = null;
    this.rEffectStart = -Infinity;
  }

  resetStats() {
    this.combo = 0;
    this.earned = 0;
    this.lost = 0;
    this.judged = 0;
    this.hitCount = 0;
  }

  // Advance by dt ms and draw a frame
  render(dt) {
    this.applyPendingRebuilds();

    const previous = this.time;
    // Clamp so coming back from a hidden tab doesn't skip ahead
    this.time += clamp(dt, 0, 100);

    const songIndex = Math.floor(this.time / (loopMs * loopsPerSong));
    if (songIndex !== this.songIndex) {
      this.songIndex = songIndex;
      this.resetStats();
    }

    this.processHits(previous, this.time);
    this.updateKeyBeams();
    this.updateGrind(this.time - previous);
    this.draw();
  }

  // Input

  laneAt(x, y) {
    this.applyPendingRebuilds();
    const angle = Math.atan2(y - this.cy, x - this.cx) / DEG;
    return mod60(Math.floor(-angle / 6));
  }

  pointerDown(id, x, y) {
    const lane = this.laneAt(x, y);
    this.pointers.set(id, lane);
    this.spawnTouchEffects(mod60(lane - 1), 3);
  }

  pointerMove(id, x, y) {
    if (this.pointers.has(id)) {
      this.pointers.set(id, this.laneAt(x, y));
    }
  }

  pointerUp(id) {
    this.pointers.delete(id);
  }

  // Layers & caches

  applyPendingRebuilds() {
    if (this.dirty) {
      this.rebuild();
      return;
    }
    if (this.dirtyBackground) {
      this.buildBackgroundLayer();
      this.dirtyBase = true;
    }
    if (this.dirtyThickness) {
      // Note widths and the judgement line depend on it, the rest is cached by key
      this.noteWidth = STROKE_WIDTHS[this.settings.thickness] * this.s3;
      this.cache.clear();
      this.dirtyBase = true;
    }
    if (this.dirtyBase) this.buildBaseLayer();

    this.dirtyBackground = false;
    this.dirtyThickness = false;
    this.dirtyBase = false;
  }

  rebuild() {
    const size = this.canvas.width;
    this.R = size / 2;
    this.cx = this.R;
    this.cy = this.R;
    this.Rj = this.R * 0.913;
    this.s3 = size / 1060;
    this.noteWidth = STROKE_WIDTHS[this.settings.thickness] * this.s3;

    this.cache.clear();
    this.textWidths.clear();
    this.buildBackgroundLayer();
    this.buildBaseLayer();
    this.buildRingTextLayer();
    this.buildBeamLayer();
    this.dirty = false;
    this.dirtyBackground = false;
    this.dirtyThickness = false;
    this.dirtyBase = false;
  }

  cached(key, create) {
    let value = this.cache.get(key);
    if (value === undefined) {
      value = create();
      this.cache.set(key, value);
    }
    return value;
  }

  buildBackgroundLayer() {
    // Opaque so it can be blitted without blending
    const ctx = this.backgroundLayer.getContext("2d", { alpha: false });
    const { R, cx, cy } = this;

    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
    for (const [position, [r, g, b]] of BACKGROUND_STOPS) {
      gradient.addColorStop(position, `rgb(${r}, ${g}, ${b})`);
    }
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, R * 2, R * 2);

    const dim = MASK_ALPHAS[this.settings.mask];
    if (dim > 0) {
      ctx.fillStyle = `rgba(0, 0, 0, ${dim})`;
      ctx.fillRect(0, 0, R * 2, R * 2);
    }

    // Pattern for masked lanes, has to be made after drawing
    this.backgroundPattern = this.ctx.createPattern(this.backgroundLayer, "no-repeat");
  }

  // Static stuff under the notes: background, lanes, guidelines, judgement line.
  // Stripes get added on top per frame
  buildBaseLayer() {
    const ctx = this.baseLayer.getContext("2d", { alpha: false });
    const { R, Rj, cx, cy, s3, settings } = this;
    ctx.globalCompositeOperation = "source-over";
    ctx.drawImage(this.backgroundLayer, 0, 0);

    // Lanes in the base stripe color, see-through in the middle
    const laneColor = LANE_COLORS[0].join(", ");
    const lanes = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
    for (const position of [0, 0.1, 0.25, 0.75, 1]) {
      lanes.addColorStop(position, `rgba(${laneColor}, ${laneAlphaAt(position)})`);
    }
    ctx.fillStyle = lanes;
    ctx.fillRect(0, 0, R * 2, R * 2);

    this.drawGuidelines(ctx);

    // Judgement line: two color sweep, shaded across its width
    const width = (STROKE_WIDTHS[settings.thickness] + 2) * s3;
    const lineCtx = this.scratch.getContext("2d");
    lineCtx.globalCompositeOperation = "source-over";
    lineCtx.clearRect(0, 0, R * 2, R * 2);
    lineCtx.lineWidth = width * 1.75;
    lineCtx.beginPath();
    lineCtx.arc(cx, cy, Rj, 0, Math.PI * 2);

    if (lineCtx.createConicGradient) {
      const sweep = lineCtx.createConicGradient(0, cx, cy);
      const [a, b] = JUDGEMENT_LINE_COLORS;
      sweep.addColorStop(0, a);
      sweep.addColorStop(0.25, b);
      sweep.addColorStop(0.5, a);
      sweep.addColorStop(0.75, b);
      sweep.addColorStop(1, a);
      lineCtx.strokeStyle = sweep;
    } else {
      lineCtx.strokeStyle = JUDGEMENT_LINE_COLORS[0];
    }
    lineCtx.stroke();

    const r = (offset) => Rj + width * offset;
    const inner = r(-0.875);
    const outer = r(0.875);
    const at = (radius) => (radius - inner) / (outer - inner);

    const shade = lineCtx.createRadialGradient(cx, cy, inner, cx, cy, outer);
    shade.addColorStop(0, "rgba(0, 0, 0, 0)");
    shade.addColorStop(at(r(-0.5)), "rgba(0, 0, 0, 0.31)");
    shade.addColorStop(at(r(-0.5) + 1), "rgba(0, 0, 0, 1)");
    shade.addColorStop(at(r(0.5) - 1), "rgba(0, 0, 0, 1)");
    shade.addColorStop(at(r(0.5)), "rgba(0, 0, 0, 0.31)");
    shade.addColorStop(1, "rgba(0, 0, 0, 0)");
    lineCtx.globalCompositeOperation = "destination-in";
    lineCtx.strokeStyle = shade;
    lineCtx.stroke();

    const darken = lineCtx.createRadialGradient(cx, cy, inner, cx, cy, outer);
    darken.addColorStop(at(r(-0.5) + 1), "rgba(0, 0, 0, 0)");
    darken.addColorStop(at(r(-0.08)), "rgba(0, 0, 0, 0.33)");
    darken.addColorStop(at(r(0.08)), "rgba(0, 0, 0, 0.33)");
    darken.addColorStop(at(r(0.5) - 1), "rgba(0, 0, 0, 0)");
    lineCtx.globalCompositeOperation = "source-atop";
    lineCtx.strokeStyle = darken;
    lineCtx.stroke();
    lineCtx.globalCompositeOperation = "source-over";

    ctx.drawImage(this.scratch, 0, 0);
  }

  // Copy some rects from a same-size layer
  drawLayerRects(layer, rects) {
    for (const [x, y, width, height] of rects) {
      if (width > 0 && height > 0) {
        this.ctx.drawImage(layer, x, y, width, height, x, y, width, height);
      }
    }
  }

  // Guidelines, part of the base layer
  drawGuidelines(ctx) {
    const { Rj, cx, cy, s3, settings } = this;
    if (settings.guidelineIntensity <= 0 || settings.guidelineType === 0) return;

    const rule = GUIDELINE_RULES[settings.guidelineType];
    const alpha = settings.guidelineIntensity;
    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, Rj);
    gradient.addColorStop(0.15, `rgba(142, 142, 166, 0)`);
    gradient.addColorStop(0.2, `rgba(142, 142, 166, ${(0x10 / 255) * alpha})`);
    gradient.addColorStop(0.7, `rgba(142, 142, 166, ${(0x50 / 255) * alpha})`);
    gradient.addColorStop(1, `rgba(142, 142, 166, ${(0x50 / 255) * alpha})`);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 1.5 * s3;
    ctx.beginPath();
    for (let i = 0; i < 60; i++) {
      if (!rule(i)) continue;
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Rj * Math.cos(-i * 6 * DEG), cy + Rj * Math.sin(-i * 6 * DEG));
    }
    ctx.stroke();
  }

  // Static ring text, laid out like the direct feed videos
  buildRingTextLayer() {
    const ctx = this.ringTextLayer.getContext("2d");
    const { R, Rj } = this;
    ctx.clearRect(0, 0, R * 2, R * 2);

    const bounds = [
      this.drawTextOnArc(ctx, "1/3 Song", Rj, -126, R * 0.032, SONG_COUNT_COLOR),
      this.drawTextOnArc(ctx, "SCORE", Rj, -104, R * 0.026, "#f08a28"),
      this.drawTextOnArc(ctx, "EXPERT/Lv.12", Rj, -73, R * 0.032, "#e01864"),
      this.drawTextOnArc(ctx, this.songTitle, Rj, -57, R * 0.032, SONG_TITLE_COLOR, {
        outline: "rgba(90, 0, 55, 0.6)",
        align: "start",
        spacing: 1.15,
      }),
    ];

    // Only this part gets copied each frame
    const size = this.canvas.width;
    const left = Math.max(0, Math.floor(Math.min(...bounds.map((b) => b.left))));
    const top = Math.max(0, Math.floor(Math.min(...bounds.map((b) => b.top))));
    const right = Math.min(size, Math.ceil(Math.max(...bounds.map((b) => b.right))));
    const bottom = Math.min(size, Math.ceil(Math.max(...bounds.map((b) => b.bottom))));
    this.ringTextRects = [[left, top, right - left, bottom - top]];
  }

  // Autoplay

  processHits(previous, now) {
    const loopIndex = Math.floor(now / loopMs);

    for (let k = -1; k <= 0; k++) {
      const base = (loopIndex + k) * loopMs;

      for (const note of this.chart.notes) {
        const t = base + note.time;
        if (t > previous && t <= now) this.hit(note, base);

        if (note.type === "hold") {
          const end = base + note.endTime;
          if (end > previous && end <= now) this.releaseHold(note, base);
        }
      }
    }
  }

  judge(kind, detail) {
    const perNote = 1000000 / this.notesPerSong();
    const value = kind === "marvelous" ? perNote : perNote * 0.75;

    this.combo++;
    this.judged++;
    this.earned += value;
    this.lost += perNote - value;
    this.judgement = { kind, detail, start: this.time };
  }

  notesPerSong() {
    if (!this.chart.notesPerLoop) {
      this.chart.notesPerLoop = this.chart.notes.reduce(
        (sum, note) => sum + (note.type === "hold" ? 2 : 1),
        0,
      );
    }
    return this.chart.notesPerLoop * loopsPerSong;
  }

  hit(note, base) {
    this.hitCount++;

    // Mostly Marvelous, with an occasional Great so FAST/LATE shows up
    if (note.type !== "chain" && this.hitCount % 11 === 6) {
      this.judge("great", this.hitCount % 22 === 6 ? "FAST" : "LATE");
    } else {
      this.judge("marvelous", null);
    }

    this.lightLanes(note.pos, note.size, 100);
    this.spawnTouchEffects(note.pos, note.size);

    if (note.rNote && this.settings.rNoteEffect) {
      this.rEffectStart = this.time;
    }

    if (note.bonus && this.settings.bonusEffect && note.type.startsWith("slide")) {
      this.bonusSweeps.push({
        start: this.time,
        duration: bpm >= 200 ? 480000 / bpm : 240000 / bpm,
        lane: note.pos + Math.floor(note.size / 2),
        counterclockwise: note.type === "slideCCW",
      });
    }

    if (note.type === "hold") {
      this.activeHolds.push({ note, base });
    }
  }

  releaseHold(note, base) {
    const index = this.activeHolds.findIndex(
      (hold) => hold.note === note && hold.base === base,
    );
    if (index !== -1) this.activeHolds.splice(index, 1);

    const last = note.points[note.points.length - 1];
    this.judge("marvelous", null);
    this.lightLanes(last.pos, last.size, 100);
    this.spawnTouchEffects(last.pos, last.size);
  }

  lightLanes(pos, size, duration) {
    const until = this.time + duration;
    for (let i = 0; i < size; i++) {
      const lane = mod60(pos + i);
      this.beamUntil[lane] = Math.max(this.beamUntil[lane], until);
    }
  }

  updateKeyBeams() {
    for (const lane of this.pointers.values()) {
      this.lightLanes(lane - 1, 3, 0);
    }

    for (const { note, base } of this.activeHolds) {
      const shape = this.holdShapeAt(note, this.time - base);
      this.lightLanes(Math.round(shape.pos), shape.size, 0);
    }
  }

  holdShapeAt(note, localTime) {
    const points = note.points;
    let i = 0;
    while (i < points.length - 2 && points[i + 1].time <= localTime) i++;

    const a = points[i];
    const b = points[i + 1];
    const t = b.time === a.time ? 1 : clamp((localTime - a.time) / (b.time - a.time), 0, 1);

    let delta = b.pos - a.pos;
    if (delta > 30) delta -= 60;
    if (delta < -30) delta += 60;

    return {
      pos: a.pos + delta * t,
      size: a.size + (b.size - a.size) * t,
    };
  }

  spawnTouchEffects(pos, size) {
    const { settings } = this;

    if (settings.touchEffectPop === 312001) {
      this.flashes.push({ start: this.time, pos, size });
    } else if (settings.touchEffectPop === 312002) {
      // One bubble per hit lane
      for (let i = 0; i < size; i++) {
        this.bubbles.push({ start: this.time, angle: -(pos + i + 0.5) * 6 * DEG });
      }
      if (this.bubbles.length > MAX_BUBBLES) {
        this.bubbles.splice(0, this.bubbles.length - MAX_BUBBLES);
      }
    }

    if (settings.touchEffectShoot) {
      this.shots.push({ start: this.time, pos, size });

      const count = Math.min(40, size * 3);
      for (let i = 0; i < count; i++) {
        const roll = Math.random();
        const kind = roll < 0.35 ? "triangle" : roll < 0.8 ? "dot" : "streak";
        this.spawnParticle(kind, pos + Math.random() * size, 0.35 + Math.random() * 0.65);
      }
    }
  }

  // Held holds grind dashes off the judgement line
  updateGrind(dt) {
    for (const { note, base } of this.activeHolds) {
      const shape = this.holdShapeAt(note, this.time - base);
      this.grindCarry = (this.grindCarry ?? 0) + dt * shape.size * GRIND_PER_LANE_MS;

      while (this.grindCarry >= 1) {
        this.grindCarry--;
        this.spawnParticle("grind", shape.pos + Math.random() * shape.size, 0.86 + Math.random() * 0.1);
      }
    }
  }

  // Sparkles from the direct feed: white triangles, yellow dots and streaks,
  // flying to the center and fading to pink (~150-250ms)
  spawnParticle(kind, lane, radius) {
    const particle = this.particles.find((p) => !p.alive);
    if (!particle) return;

    particle.alive = true;
    particle.kind = kind;
    particle.start = this.time;
    particle.angle = -lane * 6 * DEG;
    particle.radius = radius;
    particle.spin = Math.random() * Math.PI * 2;
    particle.drift = kind === "grind" ? 0 : (Math.random() - 0.5) * 0.7;

    if (kind === "grind") {
      particle.life = 120 + Math.random() * 100;
      particle.speed = 0.6 + Math.random() * 0.5;
      particle.size = 0.7 + Math.random() * 0.6;
      particle.colors = Math.random() < 0.5 ? SPARKLE_WHITE : SPARKLE_YELLOW;
    } else if (kind === "streak") {
      particle.life = 90 + Math.random() * 80;
      particle.speed = 1.8 + Math.random() * 1.2;
      particle.size = 0.7 + Math.random() * 0.6;
      particle.colors = SPARKLE_WHITE;
    } else {
      particle.life = 150 + Math.random() * 110;
      particle.speed = 0.5 + Math.random() * 0.9;
      particle.size = 0.6 + Math.random() * 0.8;
      particle.colors =
        kind === "triangle" || Math.random() < 0.3 ? SPARKLE_WHITE : SPARKLE_YELLOW;
    }
  }

  // Drawing

  draw() {
    const { ctx, settings } = this;
    const now = this.time;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
    ctx.lineCap = "butt";
    ctx.lineJoin = "miter";

    // Static base, then the stripes. Base is opaque so this is a plain blit
    // ("copy" composite is way slower on CPU canvases)
    ctx.drawImage(this.baseLayer, 0, 0);
    this.drawLaneStripes(now);
    this.drawREffect(now);
    this.updateLaneMasks(now);
    this.drawLaneMasks();
    if (settings.keyBeam) this.drawKeyBeams(now);

    this.collectObjects(now);
    for (const end of this.holdEnds) this.drawHoldEnd(end.point, end.progress);
    for (const hold of this.holdSurfaces) this.drawHoldSurface(hold.note, hold.base, now);
    this.drawObjects();

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.drawBonusSweeps(now);
    this.drawTouchEffects(now);
    this.drawInterface();
    this.drawJudgement(now);
  }

  // Which lanes are hidden right now, including the sweep animations
  updateLaneMasks(now) {
    const hidden = this.laneHidden;
    hidden.fill(0);

    const local = ((now % loopMs) + loopMs) % loopMs;
    for (const toggle of this.chart.laneToggles) {
      if (toggle.time > local) break;

      const progress = clamp((local - toggle.time) / toggle.duration, 0, 1);
      const value = toggle.show ? 0 : 1;
      const { pos, size } = toggle;

      if (toggle.direction === "center") {
        const middle = pos + (size - 1) / 2;
        const steps = Math.floor(Math.ceil(size / 2) * progress);
        for (let i = 0; i < steps; i++) {
          hidden[mod60(Math.floor(middle) - i)] = value;
          hidden[mod60(Math.ceil(middle) + i)] = value;
        }
      } else {
        const steps = Math.floor(size * progress);
        for (let i = 0; i < steps; i++) {
          const lane = toggle.direction === "cw" ? pos + size - 1 - i : pos + i;
          hidden[mod60(lane)] = value;
        }
      }
    }
  }

  // Masked lanes show the plain background. Pattern fill cause clipping is slow in Firefox
  drawLaneMasks() {
    const { ctx, cx, cy, R, laneHidden } = this;
    if (!laneHidden.includes(1)) return;

    ctx.beginPath();
    for (let lane = 0; lane < 60; lane++) {
      if (!laneHidden[lane]) continue;
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, R, (-(lane + 1) * 6 - 0.1) * DEG, (-lane * 6 + 0.1) * DEG);
      ctx.closePath();
    }
    ctx.fillStyle = this.backgroundPattern;
    ctx.fill();
  }

  // Scrolling lane stripes. The base already has the first stripe color,
  // every other ring just gets a bit brighter
  drawLaneStripes(now) {
    const { ctx, cx, cy, R } = this;
    const stripes = 9;
    const interval = 1 / stripes;
    const offset = ((now * 0.0004) % interval) * 2;
    const [a, b] = LANE_COLORS;

    // Faint wash of a much lighter color instead of "lighter" (way slower in Firefox).
    // Opacity as low as possible so the guidelines barely get touched
    const headroom = Math.max(...a.map((value, i) => (b[i] - value) / (255 - value)));

    // Even stripes get the second color
    for (let i = 0; i < stripes; i += 2) {
      const inner = clamp(perspective((i - 1) * interval + offset), 0, 1);
      const outer = clamp(perspective(i * interval + offset), 0, 1);
      const alpha = laneAlphaAt((inner + outer) / 2);
      if (outer <= inner || alpha <= 0) continue;

      const steps = Math.ceil(alpha * headroom * 255);
      const opacity = steps / 255;
      const [red, green, blue] = a.map((value, j) =>
        Math.round(value + (alpha * (b[j] - value)) / opacity),
      );
      ctx.strokeStyle = `rgba(${red}, ${green}, ${blue}, ${opacity})`;
      ctx.lineWidth = (outer - inner) * R;
      ctx.beginPath();
      ctx.arc(cx, cy, ((inner + outer) / 2) * R, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  // Pre-rendered key beam light for all lanes
  buildBeamLayer() {
    const ctx = this.beamLayer.getContext("2d");
    const { cx, cy, R } = this;
    ctx.clearRect(0, 0, R * 2, R * 2);

    // White to gray to transparent towards the center
    const gradient = ctx.createRadialGradient(cx, cy, R * 0.42, cx, cy, R);
    gradient.addColorStop(0, "rgba(200, 200, 210, 0)");
    gradient.addColorStop(0.45, "rgba(215, 215, 225, 0.3)");
    gradient.addColorStop(0.83, "rgba(240, 240, 245, 0.75)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0.95)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.arc(cx, cy, R * 0.42, 0, Math.PI * 2, true);
    ctx.fill();

    this.beamPattern = this.ctx.createPattern(this.beamLayer, "no-repeat");
  }

  // Lit lanes grouped by brightness, one pattern fill per group
  drawKeyBeams(now) {
    const { ctx, cx, cy, R } = this;
    const levels = 12;
    const groups = this.beamGroups ?? (this.beamGroups = Array.from({ length: levels }, () => []));
    for (const group of groups) group.length = 0;

    for (let lane = 0; lane < 60; lane++) {
      if (this.laneHidden[lane]) continue;
      const until = this.beamUntil[lane];
      const intensity = now <= until ? 1 : 1 - (now - until) / KEY_BEAM_FADE_MS;
      if (intensity <= 0) continue;
      groups[Math.min(levels - 1, Math.floor(intensity * levels))].push(lane);
    }

    for (let level = 0; level < levels; level++) {
      const lanes = groups[level];
      if (lanes.length === 0) continue;

      ctx.beginPath();
      for (const lane of lanes) {
        // Slight overlap so there's no seams
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, R, (-(lane + 1) * 6 - 0.2) * DEG, (-lane * 6 + 0.2) * DEG);
        ctx.closePath();
      }
      ctx.globalAlpha = (level + 1) / levels;
      ctx.fillStyle = this.beamPattern;
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  // Everything in depth order (notes, sync connectors, measure lines)
  collectObjects(now) {
    const { settings, chart } = this;
    const view = settings.viewDistance;
    const loopIndex = Math.floor(now / loopMs);

    this.itemCount = 0;
    this.holdSurfaces.length = 0;
    this.holdEnds.length = 0;

    const progressOf = (t) => 1 - (t - now) / view;

    for (let k = 0; k <= 1; k++) {
      const base = (loopIndex + k) * loopMs;

      for (const note of chart.notes) {
        const t = base + note.time;

        if (note.type === "hold") {
          const end = base + note.endTime;
          if (progressOf(end) > 1.05 || progressOf(t) < 0) continue;

          this.holdSurfaces.push({ note, base });

          const last = note.points[note.points.length - 1];
          if (end >= now && progressOf(end) >= 0) {
            this.holdEnds.push({ point: last, progress: progressOf(end) });
          }
        }

        if (t < now) continue;
        const progress = progressOf(t);
        if (progress < 0) continue;
        this.pushItem(0, note, progress, note.size);
      }

      for (const connector of chart.syncConnectors) {
        const t = base + connector.time;
        const progress = progressOf(t);
        if (t < now || progress < 0) continue;
        this.pushItem(1, connector, progress, 60);
      }

      if (settings.barlines) {
        for (const time of chart.measureLines) {
          const t = base + time;
          const progress = progressOf(t);
          if (t < now || progress < 0) continue;
          this.pushItem(2, null, progress, 60);
        }
      }
    }
  }

  pushItem(kind, object, progress, size) {
    let item = this.items[this.itemCount];
    if (!item) {
      item = {};
      this.items.push(item);
    }
    item.kind = kind;
    item.object = object;
    item.progress = progress;
    item.size = size;
    this.itemCount++;
  }

  drawObjects() {
    const items = this.items;
    const count = this.itemCount;

    // Far stuff first, lines under notes, big notes under small ones
    const sorted = items.slice(0, count).sort((a, b) => {
      if (a.progress !== b.progress) return a.progress - b.progress;
      if (a.kind !== b.kind) return b.kind - a.kind;
      return b.size - a.size;
    });

    for (const item of sorted) {
      const scale = perspective(item.progress);
      if (scale <= 0.002) continue;

      this.setScale(scale);
      if (item.kind === 0) this.drawNote(item.object, item.progress);
      else if (item.kind === 1) this.drawSyncConnector(item.object);
      else this.drawMeasureLine(item.progress, scale);
    }
  }

  // Scale judgement line sized drawing down to the perspective scale
  setScale(scale) {
    this.ctx.setTransform(scale, 0, 0, scale, this.cx * (1 - scale), this.cy * (1 - scale));
  }

  pointAt(radius, angle) {
    return [this.cx + radius * Math.cos(angle * DEG), this.cy + radius * Math.sin(angle * DEG)];
  }

  // Arc in degrees, negative sweep goes counterclockwise
  arc(path, radius, start, sweep, newSubpath = false) {
    if (newSubpath) path.moveTo(...this.pointAt(radius, start));
    path.arc(this.cx, this.cy, radius, start * DEG, (start + sweep) * DEG, sweep < 0);
  }

  // Gradient across the note body, inner to outer edge
  bandGradient(stops, width = this.noteWidth, overshoot = 0) {
    const { ctx, cx, cy, Rj } = this;
    const inner = Rj - width / 2 - width * overshoot;
    const outer = Rj + width / 2 + width * overshoot;
    const gradient = ctx.createRadialGradient(cx, cy, inner, cx, cy, outer);
    const span = 1 + overshoot * 2;
    for (const [position, color] of stops) {
      gradient.addColorStop(clamp((position + overshoot) / span, 0, 1), color);
    }
    return gradient;
  }

  bodyGradient(colorIndex) {
    return this.cached(`body${colorIndex}`, () => {
      const colors = palettes[colorIndex];
      const [p1, p2, p3, p4, p5] = BODY_GRADIENT_POSITIONS[this.settings.thickness];
      return this.bandGradient(
        [
          [-0.1, colors.light],
          [p1, colors.base],
          [p2, colors.dark],
          [p3, colors.dark],
          [p4, colors.base],
          [p5, colors.base],
          [1.1, colors.light],
        ],
        this.noteWidth,
        0.1,
      );
    });
  }

  drawNote(note, progress) {
    const { ctx, settings, Rj, s3, noteWidth } = this;
    const colorIndex = settings.colors[note.type];
    const { pos, size } = note;
    const full = size === 60;

    if (note.rNote) {
      const glow = this.cached("rGlow", () =>
        this.bandGradient(
          [
            [0, "rgba(255, 255, 192, 0)"],
            [0.3, "rgba(255, 255, 192, 0.5)"],
            [0.5, "rgba(255, 255, 192, 0.95)"],
            [0.7, "rgba(255, 255, 192, 0.5)"],
            [1, "rgba(255, 255, 192, 0)"],
          ],
          70 * s3,
        ),
      );
      ctx.globalCompositeOperation = "lighter";
      ctx.strokeStyle = glow;
      ctx.lineWidth = 70 * s3;
      ctx.beginPath();
      if (full) ctx.arc(this.cx, this.cy, Rj, 0, Math.PI * 2);
      else this.arc(ctx, Rj, (pos + 1) * -6 + 3, Math.min(0, (size - 2) * -6) - 6);
      ctx.stroke();
      ctx.globalCompositeOperation = "source-over";
    }

    // Body
    ctx.strokeStyle = this.bodyGradient(colorIndex);
    ctx.lineWidth = noteWidth;
    ctx.beginPath();
    if (full) ctx.arc(this.cx, this.cy, Rj, 0, Math.PI * 2);
    else this.arc(ctx, Rj, (pos + 1) * -6, Math.min(0, (size - 2) * -6));
    ctx.stroke();

    // Caps
    if (!full) {
      ctx.strokeStyle = this.cached("cap", () =>
        this.bandGradient([
          [0.05, capColors.light],
          [0.25, capColors.base],
          [0.5, capColors.dark],
          [0.75, capColors.base],
          [0.95, capColors.light],
        ]),
      );
      // Separate paths per cap, otherwise Firefox draws a miter spike across the note
      ctx.beginPath();
      this.arc(ctx, Rj, pos * -6 - 4.5, -1.5);
      ctx.stroke();
      if (size > 1) {
        ctx.beginPath();
        this.arc(ctx, Rj, (pos + size - 1) * -6, -1.5);
        ctx.stroke();
      }
    }

    if (note.sync) this.drawSyncOutline(note);
    if (note.type === "chain") this.drawChainStripes(note);
    if (note.bonus) this.drawBonusTriangles(note, colorIndex);
    if ((note.type === "snapIn" || note.type === "snapOut") && size > 2) {
      this.drawSnapArrows(note, colorIndex);
    }
    if (note.type === "slideCW" || note.type === "slideCCW") {
      this.drawSlideArrows(note, colorIndex, progress);
    }
  }

  drawSyncOutline(note) {
    const { ctx, Rj, s3, settings } = this;
    const radii = SYNC_OUTLINE_RADII[settings.thickness];
    ctx.fillStyle = syncColors.outline;

    if (note.size === 60) {
      ctx.strokeStyle = syncColors.outline;
      ctx.lineWidth = 6.36 * s3;
      ctx.beginPath();
      ctx.arc(this.cx, this.cy, Rj * radii[4], 0, Math.PI * 2);
      ctx.moveTo(this.cx + Rj * radii[5], this.cy);
      ctx.arc(this.cx, this.cy, Rj * radii[5], 0, Math.PI * 2);
      ctx.stroke();
      return;
    }

    const path = this.cached(`sync${note.pos}|${note.size}`, () => {
      const [r0, r1, r2, r3] = radii.map((value) => value * Rj);
      const start = note.pos * -6;
      const sweep = note.size * -6;
      const end = start + sweep;
      const p = new Path2D();

      this.arc(p, r0, start - 2.5, sweep + 5, true);
      p.quadraticCurveTo(...this.pointAt(Rj, end + 0.25), ...this.pointAt(r3, end + 2.5));
      this.arc(p, r3, end + 2.5, -sweep - 5);
      p.quadraticCurveTo(...this.pointAt(Rj, start - 0.25), ...this.pointAt(r0, start - 2.5));
      p.closePath();

      this.arc(p, r1, end + 2.55, -sweep - 5.1, true);
      p.quadraticCurveTo(...this.pointAt(Rj, start - 1.1), ...this.pointAt(r2, start - 2.55));
      this.arc(p, r2, start - 2.55, sweep + 5.1);
      p.quadraticCurveTo(...this.pointAt(Rj, end + 1.1), ...this.pointAt(r1, end + 2.55));
      p.closePath();
      return p;
    });

    ctx.fill(path, "evenodd");
  }

  drawSyncConnector(connector) {
    const { ctx, Rj, s3 } = this;
    ctx.strokeStyle = this.cached("syncConnector", () =>
      this.bandGradient(
        [
          [0.05, syncColors.light],
          [0.15, syncColors.base],
          [0.45, syncColors.dark],
          [0.55, syncColors.dark],
          [0.85, syncColors.base],
          [0.95, syncColors.light],
        ],
        10 * s3,
      ),
    );
    ctx.lineWidth = 10 * s3;
    ctx.beginPath();
    this.arc(ctx, Rj, connector.pos * -6, connector.size * -6);
    ctx.stroke();
  }

  drawMeasureLine(progress, scale) {
    const { ctx, Rj, s3 } = this;
    ctx.strokeStyle = "#b6b6bc";
    // Keep the line width the same on screen
    ctx.lineWidth = (3 * s3 * Math.min(1, progress * 1.5)) / scale;
    ctx.beginPath();
    ctx.arc(this.cx, this.cy, Rj, 0, Math.PI * 2);
    ctx.stroke();
  }

  drawChainStripes(note) {
    const { ctx, Rj, noteWidth } = this;
    const path = this.cached(`chain${note.pos}|${note.size}`, () => {
      const p = new Path2D();
      const stripes = note.size * 2;
      const inner = Rj - noteWidth / 2;
      const outer = Rj + noteWidth / 2;
      const start = (note.pos + 1) * -6;
      const full = note.size === 60;

      for (let i = 0; i < stripes; i++) {
        const a = start + i * -3;

        if (!full) {
          if (i === 0 || i >= stripes - 3) continue;

          if (i === 1) {
            p.moveTo(...this.pointAt(inner, a + 3));
            p.lineTo(...this.pointAt(inner, a + 1.5));
            p.lineTo(...this.pointAt(outer, a + 3));
            p.closePath();
          }

          if (i === stripes - 4) {
            p.moveTo(...this.pointAt(inner, a));
            p.lineTo(...this.pointAt(outer, a));
            p.lineTo(...this.pointAt(outer, a + 1.5));
            p.closePath();
            continue;
          }
        }

        p.moveTo(...this.pointAt(inner, a));
        p.lineTo(...this.pointAt(inner, a - 1.5));
        p.lineTo(...this.pointAt(outer, a));
        p.lineTo(...this.pointAt(outer, a + 1.5));
        p.closePath();
      }
      return p;
    });

    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fill(path);
  }

  drawBonusTriangles(note, colorIndex) {
    const { ctx, Rj, noteWidth } = this;
    const path = this.cached(`bonus${note.pos}|${note.size}`, () => {
      const p = new Path2D();
      const inner = Rj - noteWidth / 2;
      const outer = Rj + noteWidth / 2;
      const full = note.size === 60;
      const count = full ? 60 : note.size - 2;
      const start = full ? note.pos * -6 : note.pos * -6 - 6;

      for (let i = 0; i < count; i++) {
        const a = start + i * -6;
        const b = start + (i + 1) * -6;
        const [first, second] = i % 2 === 0 ? [a, b] : [b, a];
        p.moveTo(...this.pointAt(inner, first));
        p.lineTo(...this.pointAt(outer, first));
        p.lineTo(...this.pointAt(inner, second));
        p.closePath();
      }
      return p;
    });

    ctx.fillStyle = this.cached(`bonusFill${colorIndex}`, () => {
      const colors = palettes[colorIndex];
      return this.bandGradient(
        [
          [-0.1, colors.light],
          [0.4, colors.base],
          [0.6, colors.base],
          [1.1, colors.light],
        ],
        this.noteWidth,
        0.1,
      );
    });
    ctx.fill(path);
  }

  drawSnapArrows(note, colorIndex) {
    const { ctx, cx, cy, Rj, s3 } = this;
    const outward = note.type === "snapOut";

    const path = this.cached(`snap${note.pos}|${note.size}|${outward}`, () => {
      const f = (inward, out) => Rj * (outward ? out : inward);
      const r0 = f(0.725, 0.96);
      const r1 = f(0.775, 0.899);
      const r2 = f(0.83, 0.844);
      const r3 = f(0.891, 0.794);
      const r4 = f(0.802, 0.878);
      const r5 = Rj * 0.84;
      const r6 = f(0.92, 0.766);
      const r7 = f(0.96, 0.725);

      const count = Math.floor(note.size / 3);
      const remainder = note.size % 3;
      const startPosition = note.pos * -6 - [9, 12, 15][remainder];
      const width = 4;
      const k = (inward, out) => (outward ? out : inward);

      const p = new Path2D();
      for (let i = 0; i < count; i++) {
        const center = startPosition - 18 * i;

        p.moveTo(...this.pointAt(r0, center));
        p.lineTo(...this.pointAt(r2, center - width));
        p.lineTo(...this.pointAt(r3, center - width * k(0.97, 1.01)));
        p.lineTo(...this.pointAt(r1, center));
        p.lineTo(...this.pointAt(r3, center + width * k(0.97, 1.01)));
        p.lineTo(...this.pointAt(r2, center + width));
        p.closePath();

        p.moveTo(...this.pointAt(r4, center));
        p.lineTo(...this.pointAt(r6, center - width * k(0.94, 1.04)));
        p.lineTo(...this.pointAt(r7, center - width * k(0.93, 1.07)));
        p.lineTo(...this.pointAt(r5, center));
        p.lineTo(...this.pointAt(r7, center + width * k(0.93, 1.07)));
        p.lineTo(...this.pointAt(r6, center + width * k(0.94, 1.04)));
        p.closePath();
      }
      return p;
    });

    ctx.fillStyle = this.cached(`snapFill${colorIndex}|${outward}`, () => {
      const colors = palettes[colorIndex];
      const gradient = ctx.createRadialGradient(cx, cy, Rj * 0.73, cx, cy, Rj * 0.9);
      const middle = ((outward ? 0.86 : 0.77) - 0.73) / (0.9 - 0.73);
      gradient.addColorStop(0, outward ? colors.base : "#ffffff");
      gradient.addColorStop(middle, colors.light);
      gradient.addColorStop(1, outward ? "#ffffff" : colors.base);
      return gradient;
    });
    ctx.fill(path);

    ctx.strokeStyle = palettes[colorIndex].dark;
    ctx.lineWidth = 2.5 * s3;
    ctx.stroke(path);
  }

  drawSlideArrows(note, colorIndex, progress) {
    const { ctx, cx, cy, Rj, s3, settings } = this;
    const counterclockwise = note.type === "slideCCW";
    const { pos, size } = note;

    // SaturnView draws slides rotated into place, the rotation is baked into the angles here
    const rotation = (pos + size) * -6;
    const startAngle = size * 6 + rotation;

    const r0 = Rj * 0.79;
    const r1 = Rj * 0.864;
    const r2 = Rj * 0.938;

    const mask = this.cached(`slideMask${pos}|${size}|${counterclockwise}`, () => {
      const arrowMask = (x) =>
        x < 0.88 ? (0.653 * x + 0.175) / 0.75 : (-6.25 * x + 6.25) / 0.75;
      const along = (i) => (counterclockwise ? i / size : 1 - i / size);

      const p = new Path2D();
      for (let i = 0; i <= size; i++) {
        const point = this.pointAt(r1 + (r2 - r1) * arrowMask(along(i)), startAngle - i * 6);
        if (i === 0) p.moveTo(...point);
        else p.lineTo(...point);
      }
      p.lineTo(...this.pointAt(r1, startAngle - size * 6));
      for (let i = size; i >= 0; i--) {
        p.lineTo(...this.pointAt(r1 + (r0 - r1) * arrowMask(along(i)), startAngle - i * 6));
      }
      p.closePath();
      return p;
    });

    const scroll = counterclockwise ? 1 - ((progress * 6) % 1) : (progress * 6) % 1;
    const offset = counterclockwise ? -6 : 6;
    const arrowCount = size * 0.5 + 1;

    ctx.beginPath();
    for (let i = 0; i < arrowCount; i++) {
      const angle = startAngle + (scroll - i - 0.5) * 12;
      ctx.moveTo(...this.pointAt(r0, angle));
      ctx.lineTo(...this.pointAt(r0, angle - offset));
      ctx.lineTo(...this.pointAt(r1, angle));
      ctx.lineTo(...this.pointAt(r2, angle - offset));
      ctx.lineTo(...this.pointAt(r2, angle));
      ctx.lineTo(...this.pointAt(r1, angle + offset));
      ctx.closePath();
    }

    const colors = palettes[colorIndex];
    const flipColors = counterclockwise !== settings.slideInvert;

    ctx.save();
    ctx.clip(mask);
    ctx.fillStyle = this.cached(`slideFill${colorIndex}|${pos}|${size}|${flipColors}`, () => {
      if (!ctx.createConicGradient) return colors.base;

      const gradient = ctx.createConicGradient(rotation * DEG, cx, cy);
      const span = (size * 6) / 360;
      if (flipColors) {
        gradient.addColorStop(0, colors.light);
        gradient.addColorStop(0.4 * span, colors.base);
      } else {
        gradient.addColorStop(0.6 * span, colors.base);
        gradient.addColorStop(span, colors.light);
      }
      return gradient;
    });
    ctx.fill();
    ctx.strokeStyle = colors.dark;
    ctx.lineWidth = 5 * s3;
    ctx.stroke();
    ctx.restore();
  }

  drawHoldEnd(point, progress) {
    const scale = perspective(progress);
    if (scale <= 0.002) return;

    const { ctx, Rj, s3, settings } = this;
    const colors = palettes[settings.colors.hold];
    this.setScale(scale);

    const path = this.cached(`holdEnd${point.pos}|${point.size}`, () => {
      const p = new Path2D();
      const { pos, size } = point;

      if (size === 60) {
        p.arc(this.cx, this.cy, Rj * 0.984, 0, Math.PI * 2);
        p.moveTo(this.cx + Rj * 1.016, this.cy);
        p.arc(this.cx, this.cy, Rj * 1.016, 0, Math.PI * 2, true);
        return p;
      }

      p.moveTo(...this.pointAt(Rj, (pos + 0.35) * -6));
      this.arc(p, Rj * 0.984, (pos + 0.6) * -6, (size - 1.2) * -6);
      p.lineTo(...this.pointAt(Rj, (pos + size - 0.35) * -6));
      this.arc(p, Rj * 1.016, (pos + size - 0.6) * -6, (size - 1.2) * 6);
      p.closePath();
      return p;
    });

    ctx.fillStyle = colors.holdEndLight;
    ctx.fill(path, "evenodd");
    ctx.strokeStyle = colors.holdEndDark;
    ctx.lineWidth = 3.5 * s3;
    ctx.stroke(path);
  }

  drawHoldSurface(note, base, now) {
    const { ctx, cx, cy, Rj, R, settings } = this;
    const view = settings.viewDistance;
    const startTime = base + note.time;
    const endTime = base + note.endTime;

    // Held holds get eaten at the judgement line
    const from = Math.max(startTime, now);
    const to = Math.min(endTime, now + view);
    if (from >= to) return;

    const radiusAt = (t) => Rj * perspective(clamp(1 - (t - now) / view, 0, 1.03));
    const straight = note.points.every(
      (point) => point.pos === note.points[0].pos && point.size === note.points[0].size,
    );
    const samples = straight ? 2 : clamp(Math.ceil((to - from) / 20), 2, 48);

    const edgeA = [];
    const edgeB = [];
    for (let i = 0; i < samples; i++) {
      const t = from + ((to - from) * i) / (samples - 1);
      const shape = this.holdShapeAt(note, t - base);
      const radius = radiusAt(t);
      const full = shape.size >= 60;
      const a = full ? shape.pos * -6 : shape.pos * -6 - 4.2;
      const b = full ? a - 360 : (shape.pos + shape.size) * -6 + 4.2;
      edgeA.push([radius, a]);
      edgeB.push([radius, b]);
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.beginPath();
    const [firstRadius, firstA] = edgeA[0];
    ctx.moveTo(...this.pointAt(firstRadius, firstA));
    for (let i = 1; i < samples; i++) ctx.lineTo(...this.pointAt(...edgeA[i]));
    const [lastRadius, lastA] = edgeA[samples - 1];
    this.arc(ctx, lastRadius, lastA, edgeB[samples - 1][1] - lastA);
    for (let i = samples - 1; i >= 0; i--) ctx.lineTo(...this.pointAt(...edgeB[i]));
    this.arc(ctx, firstRadius, edgeB[0][1], firstA - edgeB[0][1]);
    ctx.closePath();

    // Color runs along the hold, radial gradient maps it onto the screen
    const active = now > startTime && now < endTime;
    const colors = (active ? holdGradientsActive : holdGradients)[settings.colors.hold];
    const duration = endTime - startTime;
    const inner = radiusAt(endTime);
    const outer = Math.min(radiusAt(startTime), R * 1.2);

    if (outer - inner > 1) {
      const gradient = ctx.createRadialGradient(cx, cy, inner, cx, cy, outer);
      for (let i = holdGradientStops.length - 1; i >= 0; i--) {
        const radius = radiusAt(startTime + holdGradientStops[i] * duration);
        gradient.addColorStop(clamp((radius - inner) / (outer - inner), 0, 1), colors[i]);
      }
      ctx.fillStyle = gradient;
    } else {
      ctx.fillStyle = colors[colors.length - 1];
    }

    ctx.globalAlpha = 207 / 255;
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  drawREffect(now) {
    const elapsed = now - this.rEffectStart;
    if (elapsed < 0 || elapsed > R_EFFECT_MS) return;

    const { ctx, cx, cy, R, s3 } = this;

    let t = clamp(elapsed / R_EFFECT_MS, 0, 1);
    t = 1 - Math.pow(1 - t, 3);

    const strength = clamp(1 - Math.pow(2 * t - 1, 2), 0, 1);
    const inner = clamp(0.5 * t + 0.2, 0.3, 0.8);
    const outer = 0.3 * t + 0.7;
    const angle = (180 + t * 180) * DEG;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.translate(cx, cy);
    ctx.rotate(-12 * DEG);
    ctx.translate(-cx, -cy);
    ctx.globalCompositeOperation = "lighter";
    // Dimmed so it looks like it's behind the lanes
    const dim = 0.45;

    let fill = "#ff1d8c";
    if (ctx.createConicGradient) {
      fill = ctx.createConicGradient(angle, cx, cy);
      fill.addColorStop(0, "#18bbff");
      fill.addColorStop(0.25, "#ff1d8c");
      fill.addColorStop(0.5, "#ffcb00");
      fill.addColorStop(0.75, "#ff1d8c");
      fill.addColorStop(1, "#18bbff");
    }

    // Glow band, brightest in the middle. Rings side by side instead of stacked
    // so every pixel only gets drawn once
    ctx.strokeStyle = fill;
    const middle = ((inner + outer) / 2) * R;
    const band = (outer - inner) * R;
    for (const [from, to, alpha] of [
      [0, 0.125, 0.9],
      [0.125, 0.3, 0.55],
      [0.3, 0.5, 0.25],
    ]) {
      ctx.globalAlpha = alpha * strength * dim;
      ctx.lineWidth = band * (to - from) * (from === 0 ? 2 : 1);
      ctx.beginPath();
      if (from === 0) {
        ctx.arc(cx, cy, middle, 0, Math.PI * 2);
      } else {
        const offset = band * ((from + to) / 2);
        ctx.arc(cx, cy, middle + offset, 0, Math.PI * 2);
        ctx.moveTo(cx + middle - offset, cy);
        ctx.arc(cx, cy, middle - offset, 0, Math.PI * 2);
      }
      ctx.stroke();
    }

    // Rounded squares pulsing in a ring
    const squares = 21;
    const cell = (R * 2) / squares;
    const corner = 10 * s3;
    ctx.globalAlpha = dim;
    ctx.fillStyle = fill;
    ctx.beginPath();
    for (let x = 0; x < squares; x++) {
      for (let y = 0; y < squares; y++) {
        const tx = (2 * (x + 0.5)) / squares - 1;
        const ty = (2 * (y + 0.5)) / squares - 1;
        const distance = Math.sqrt(tx * tx + ty * ty);
        if (distance < inner || distance > outer) continue;

        const scale = Math.sin((Math.PI * (distance - inner)) / (outer - inner)) * strength;
        const width = cell * scale;
        if (width < 0.5) continue;

        const left = x * cell + (cell - width) / 2;
        const top = y * cell + (cell - width) / 2;
        if (ctx.roundRect) ctx.roundRect(left, top, width, width, corner * scale);
        else ctx.rect(left, top, width, width);
      }
    }
    ctx.fill();

    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  drawBonusSweeps(now) {
    if (this.bonusSweeps.length === 0) return;

    const { ctx, cx, cy, R } = this;
    const gradient = this.cached("bonusSweep", () => {
      const g = ctx.createRadialGradient(cx, cy, R * 0.1, cx, cy, R);
      g.addColorStop(0, "rgba(238, 61, 156, 0)");
      g.addColorStop(1, "rgba(238, 61, 156, 1)");
      return g;
    });
    ctx.fillStyle = gradient;

    for (let i = this.bonusSweeps.length - 1; i >= 0; i--) {
      const sweep = this.bonusSweeps[i];
      const elapsed = now - sweep.start;
      if (elapsed > sweep.duration) {
        this.bonusSweeps.splice(i, 1);
        continue;
      }

      // One lane every ~16ms, trailing up to 15 lanes. Tail catches up in the last 250ms
      const step = Math.ceil(elapsed * 0.06);
      const length = Math.min(15, step);
      const cut = Math.max(0, Math.ceil(step - (sweep.duration - 250) * 0.06));
      const direction = sweep.counterclockwise ? 1 : -1;
      const head = sweep.lane + direction * step;

      for (let d = cut; d < length; d++) {
        const lane = mod60(head - direction * d);
        ctx.globalAlpha = ((15 - d) * 0x11) / 255;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, R, -(lane + 1) * 6 * DEG, -lane * 6 * DEG);
        ctx.closePath();
        ctx.fill();
      }
    }

    ctx.globalAlpha = 1;
  }

  // Bubble timing from the direct feed (60fps):
  //   0ms    small bright dot
  //   ~50ms  ~70% size, pale pink, white core, lighter rim
  //   ~300ms ~85%, core fades out
  //   ~380ms full size, fill fades
  //   ~460ms rim fades, gone
  drawBubbles(now) {
    if (this.bubbles.length === 0) return;

    const { ctx, cx, cy, Rj } = this;
    const fullRadius = Rj * 6 * DEG * 0.47;

    // Pre-rendered sprites, way cheaper than drawing each bubble.
    // Parts are additive so same-strength ones can share a sprite
    const unit = Math.ceil(fullRadius * 1.05);
    const center = Math.ceil(unit * 1.06) + 1;
    const parts = {
      body: (spriteCtx) => {
        const gradient = spriteCtx.createRadialGradient(0, 0, 0, 0, 0, 1);
        gradient.addColorStop(0, "rgba(255, 175, 240, 0.18)");
        gradient.addColorStop(0.75, "rgba(255, 130, 228, 0.3)");
        gradient.addColorStop(1, "rgba(255, 150, 235, 0.42)");
        spriteCtx.fillStyle = gradient;
        spriteCtx.beginPath();
        spriteCtx.arc(0, 0, 1, 0, Math.PI * 2);
        spriteCtx.fill();
      },
      rim: (spriteCtx) => {
        spriteCtx.globalAlpha = 0.6;
        spriteCtx.strokeStyle = "#ffd4f6";
        spriteCtx.lineWidth = 0.12;
        spriteCtx.beginPath();
        spriteCtx.arc(0, 0, 1, 0, Math.PI * 2);
        spriteCtx.stroke();
        spriteCtx.globalAlpha = 1;
      },
      core: (spriteCtx) => {
        const gradient = spriteCtx.createRadialGradient(0, 0, 0, 0, 0, 1);
        gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
        gradient.addColorStop(0.14, "rgba(255, 255, 255, 0.9)");
        gradient.addColorStop(0.32, "rgba(255, 220, 250, 0.2)");
        gradient.addColorStop(0.5, "rgba(255, 220, 250, 0)");
        spriteCtx.fillStyle = gradient;
        spriteCtx.beginPath();
        spriteCtx.arc(0, 0, 0.5, 0, Math.PI * 2);
        spriteCtx.fill();
      },
    };
    const sprite = (...names) =>
      this.cached(`bubble:${names}`, () => {
        const canvas = document.createElement("canvas");
        canvas.width = canvas.height = center * 2;
        const spriteCtx = canvas.getContext("2d");
        spriteCtx.setTransform(unit, 0, 0, unit, center, center);
        spriteCtx.globalCompositeOperation = "lighter";
        for (const name of names) parts[name](spriteCtx);
        return canvas;
      });
    const drawSprite = (image, alpha, x, y, radius) => {
      if (alpha <= 0) return;
      const half = (radius / unit) * center;
      ctx.globalAlpha = alpha;
      ctx.drawImage(image, x - half, y - half, half * 2, half * 2);
    };

    const ease = (x) => 1 - Math.pow(1 - clamp(x, 0, 1), 3);
    const fadeOut = (t, from, to) => 1 - clamp((t - from) / (to - from), 0, 1);

    let expired = 0;
    for (const bubble of this.bubbles) {
      const t = now - bubble.start;
      if (t >= BUBBLE_LIFE_MS) {
        expired++;
        continue;
      }

      let size;
      if (t < 50) size = 0.2 + 0.5 * ease(t / 50);
      else if (t < 300) size = 0.7 + 0.15 * ((t - 50) / 250);
      else size = 0.85 + 0.2 * ease((t - 300) / 80);
      const radius = fullRadius * size;
      const x = cx + Rj * Math.cos(bubble.angle);
      const y = cy + Rj * Math.sin(bubble.angle);

      // Core fades first, then body, then rim
      const coreAlpha = fadeOut(t, 200, 350);
      const bodyAlpha = fadeOut(t, 370, 420);
      const rimAlpha = fadeOut(t, 380, BUBBLE_LIFE_MS);

      if (coreAlpha === 1) {
        drawSprite(sprite("body", "rim", "core"), 1, x, y, radius);
      } else if (bodyAlpha === 1 && rimAlpha === 1) {
        drawSprite(sprite("body", "rim"), 1, x, y, radius);
        drawSprite(sprite("core"), coreAlpha, x, y, radius);
      } else {
        drawSprite(sprite("body"), bodyAlpha, x, y, radius);
        drawSprite(sprite("rim"), rimAlpha, x, y, radius);
      }
    }

    ctx.globalAlpha = 1;

    // Expired bubbles are at the front
    if (expired > 0) this.bubbles.splice(0, expired);
  }

  drawTouchEffects(now) {
    const { ctx, cx, cy, Rj, R, noteWidth } = this;
    ctx.globalCompositeOperation = "lighter";

    // Pop: flash along the hit lanes
    for (let i = this.flashes.length - 1; i >= 0; i--) {
      const flash = this.flashes[i];
      const t = (now - flash.start) / 240;
      if (t >= 1) {
        this.flashes.splice(i, 1);
        continue;
      }

      ctx.globalAlpha = (1 - t) * 0.8;
      ctx.strokeStyle = "#fff4fb";
      ctx.lineWidth = noteWidth * (1 + t * 1.4);
      ctx.beginPath();
      this.arc(ctx, Rj * (1 + t * 0.025), flash.pos * -6, flash.size * -6);
      ctx.stroke();
    }

    this.drawBubbles(now);
    this.drawGrindGlow();

    ctx.globalCompositeOperation = "source-over";
    this.drawShots(now);
    ctx.globalCompositeOperation = "lighter";

    // Sparkles and grind dashes flying to the center
    for (const particle of this.particles) {
      if (!particle.alive) continue;

      const elapsed = now - particle.start;
      const t = elapsed / particle.life;
      if (t >= 1) {
        particle.alive = false;
        continue;
      }

      const distance = Rj * (particle.radius - (particle.speed * elapsed) / 1000);
      if (distance <= 0) {
        particle.alive = false;
        continue;
      }

      const angle = particle.angle + (particle.drift * elapsed) / 1000;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const x = cx + distance * cos;
      const y = cy + distance * sin;

      const [first, middle, last] = particle.colors;
      const [from, to, k] =
        t < 0.3 ? [first, middle, t / 0.3] : [middle, last, Math.min(1, (t - 0.3) / 0.4)];
      const color = `rgb(${from[0] + (to[0] - from[0]) * k}, ${from[1] + (to[1] - from[1]) * k}, ${from[2] + (to[2] - from[2]) * k})`;
      ctx.globalAlpha = (t < 0.5 ? 1 : 1 - (t - 0.5) / 0.5) * Math.min(1, elapsed / 30);

      if (particle.kind === "streak" || particle.kind === "grind") {
        const length = Rj * (particle.kind === "streak" ? 0.08 : 0.035) * particle.size;
        ctx.strokeStyle = color;
        ctx.lineWidth = R * (particle.kind === "streak" ? 0.0025 : 0.005) * particle.size;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + length * cos, y + length * sin);
        ctx.stroke();
      } else if (particle.kind === "triangle") {
        const size = R * 0.011 * particle.size;
        ctx.fillStyle = color;
        ctx.beginPath();
        for (let corner = 0; corner < 3; corner++) {
          const a = particle.spin + (corner * Math.PI * 2) / 3;
          const stretch = corner === 0 ? 1.4 : 0.8;
          const px = x + size * stretch * Math.cos(a);
          const py = y + size * stretch * Math.sin(a);
          if (corner === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
      } else {
        // Glowing dot: soft halo plus solid core
        const size = R * 0.006 * particle.size;
        ctx.fillStyle = color;
        ctx.globalAlpha *= 0.3;
        ctx.beginPath();
        ctx.arc(x, y, size * 2.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha /= 0.3;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
  }

  // Shoot wave, frame by frame from the direct feed (30fps):
  //   first frame  pink wedge from the rim to ~0.2 of the radius
  //   +33ms        outer part dimmed to purple
  //   +67ms        faint purple bit near the front
  //   +100ms       gone
  drawShots(now) {
    const { ctx, cx, cy, Rj } = this;

    for (let i = this.shots.length - 1; i >= 0; i--) {
      const shot = this.shots[i];
      const t = now - shot.start;
      if (t >= SHOT_MS) {
        this.shots.splice(i, 1);
        continue;
      }

      // Rushes in, then keeps creeping to the center
      const creep = clamp(t / SHOT_MS, 0, 1);
      const front =
        Rj * (0.06 + 0.2 * (1 - creep * creep * (3 - 2 * creep)) + 0.74 * Math.exp(-t / 8));
      const outer = Rj;
      const span = outer - front;
      if (span < 2) continue;

      // Where the bright part ends, moves from the rim to the front
      const u = clamp(t / 140, 0, 1);
      const fadeEdge = Rj * (1.1 - 0.95 * u * u * (3 - 2 * u));
      const edge = clamp((fadeEdge - front) / span, 0.25, 1);

      const alpha = 0.85 * (t < 80 ? 1 : Math.max(0, 1 - (t - 80) / (SHOT_MS - 80)));
      const purple = clamp((t - 30) / 120, 0, 1);
      const mix = (a, b) => Math.round(a + (b - a) * purple);
      const rgba = (r, g, b, a) => `rgba(${mix(r, 150)}, ${mix(g, 70)}, ${mix(b, 190)}, ${a})`;

      const gradient = ctx.createRadialGradient(cx, cy, front, cx, cy, outer);
      gradient.addColorStop(0, `rgba(255, 90, 210, ${alpha})`);
      gradient.addColorStop(0.05, rgba(250, 120, 225, alpha));
      gradient.addColorStop(0.2, rgba(245, 150, 230, alpha * 0.95));
      gradient.addColorStop(Math.max(0.21, edge - 0.12), rgba(245, 175, 238, alpha * 0.9));
      gradient.addColorStop(Math.min(1, edge + 0.12), `rgba(130, 60, 170, ${alpha * 0.45})`);
      gradient.addColorStop(1, `rgba(120, 50, 160, ${alpha * 0.35})`);

      const start = -shot.pos * 6 * DEG;
      const end = -(shot.pos + shot.size) * 6 * DEG;
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(cx, cy, outer, start, end, true);
      ctx.arc(cx, cy, front, end, start);
      ctx.closePath();
      ctx.fill();
    }
  }

  // Warm glow where a hold is held
  drawGrindGlow() {
    if (this.activeHolds.length === 0) return;

    const { ctx, cx, cy, Rj } = this;
    ctx.fillStyle = this.cached("grindGlow", () => {
      const gradient = ctx.createRadialGradient(cx, cy, Rj * 0.84, cx, cy, Rj * 1.02);
      gradient.addColorStop(0, "rgba(255, 220, 160, 0)");
      gradient.addColorStop(0.8, "rgba(255, 235, 200, 0.55)");
      gradient.addColorStop(1, "rgba(255, 235, 200, 0)");
      return gradient;
    });

    for (const { note, base } of this.activeHolds) {
      const shape = this.holdShapeAt(note, this.time - base);
      const start = -shape.pos * 6 * DEG;
      const end = -(shape.pos + shape.size) * 6 * DEG;
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, Rj * 1.02, start, end, true);
      ctx.arc(cx, cy, Rj * 0.84, end, start);
      ctx.closePath();
      ctx.fill();
    }
  }

  // HUD

  score() {
    const plus = Math.round(this.earned);
    const minus = Math.round(1000000 - this.lost);
    return { plus, minus };
  }

  drawInterface() {
    const { ctx, cx, cy, R, settings } = this;
    const { plus, minus } = this.score();

    // Ring text, only the score changes
    this.drawLayerRects(this.ringTextLayer, this.ringTextRects);
    const score = String(settings.scoreMinus ? minus : plus).padStart(7, "0");
    this.drawTextOnArc(ctx, score, this.Rj, -90, R * 0.058, "#ffb52e", { weight: 500 });

    // Info opacity only fades the gauge and judgement text, like in game
    if (settings.infoOpacity > 0) {
      ctx.globalAlpha = settings.infoOpacity;
      this.drawClearGauge(this.judged / this.notesPerSong());
      ctx.globalAlpha = 1;
    }

    // Center display
    const mode = settings.centerDisplay;
    let value = null;
    if (mode === 1 && this.combo > 0) value = this.combo;
    else if (mode === 2) value = plus;
    else if (mode === 3) value = minus;
    else if (CENTER_BORDERS[mode]) value = Math.max(0, minus - CENTER_BORDERS[mode]);

    if (value !== null) {
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#ffffff";
      ctx.font = `600 ${R * 0.085}px ${FONT}`;
      ctx.fillText(String(value), cx, cy - R * 0.125);

      ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
      ctx.font = `600 ${R * 0.03}px ${FONT}`;
      ctx.fillText(CENTER_LABELS[mode], cx, cy - R * 0.06);
    }

    ctx.globalAlpha = 1;
  }

  // Clear gauge: slanted dark track, pink fill, hot pink clear border at ~3/4
  drawClearGauge(progress) {
    const { ctx, cx, cy, R } = this;
    const width = R * 0.84;
    const height = Math.max(3, R * 0.017);
    const slant = height * 0.7;
    const left = cx - width / 2;
    const top = cy - R * 0.28;

    // Parallelogram leaning right, optionally inset
    const bar = (x0, x1, inset = 0) => {
      const y0 = top + inset;
      const y1 = top + height - inset;
      const lean = (slant * (height - 2 * inset)) / height;
      const shift = (slant * inset) / height;
      ctx.beginPath();
      ctx.moveTo(x0 + shift + lean, y0);
      ctx.lineTo(x1 + shift + lean, y0);
      ctx.lineTo(x1 + shift, y1);
      ctx.lineTo(x0 + shift, y1);
      ctx.closePath();
    };

    bar(left, left + width);
    ctx.fillStyle = "rgba(58, 36, 80, 0.85)";
    ctx.fill();

    // Clear border, under the fill
    const borderStart = left + width * 0.77;
    const borderEnd = borderStart + width * 0.06;
    bar(borderStart, borderEnd);
    ctx.fillStyle = this.cached("gaugeBorder", () => {
      const gradient = ctx.createLinearGradient(borderStart, 0, borderEnd + slant, 0);
      gradient.addColorStop(0, "rgba(255, 42, 127, 1)");
      gradient.addColorStop(1, "rgba(255, 42, 127, 0)");
      return gradient;
    });
    ctx.fill();

    // Fill, a bit inset and brighter on top
    const inset = height * 0.18;
    const filled = clamp(progress, 0, 1) * (width - inset * 2);
    if (filled > 0) {
      bar(left + inset, left + inset + filled, inset);
      ctx.fillStyle = this.cached("gaugeFill", () => {
        const gradient = ctx.createLinearGradient(0, top, 0, top + height);
        gradient.addColorStop(0, "#ffb8ec");
        gradient.addColorStop(1, "#ee7bcf");
        return gradient;
      });
      ctx.fill();
    }
  }

  // Text along a circle, clockwise, glyphs centered on the circle.
  // Angle is the center, or the start with align: "start". Returns the bounds
  drawTextOnArc(ctx, text, radius, angle, size, color, options = {}) {
    const {
      align = "center",
      spacing = 1.08,
      weight = 700,
      family = FONT,
      outline = null,
    } = options;
    const { cx, cy } = this;
    ctx.font = `${weight} ${size}px ${family}`;
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";

    const widthOf = (char) => {
      const key = `${family}|${weight}|${size}|${char}`;
      let width = this.textWidths.get(key);
      if (width === undefined) {
        width = ctx.measureText(char).width;
        this.textWidths.set(key, width);
      }
      return width * spacing;
    };

    // Center the actual glyphs on the circle, not the em box
    const baselineKey = `${family}|${weight}|${size}|baseline|${text}`;
    let baseline = this.textWidths.get(baselineKey);
    if (baseline === undefined) {
      const metrics = ctx.measureText(text);
      baseline = (metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent) / 2;
      this.textWidths.set(baselineKey, baseline);
    }

    if (outline) {
      ctx.strokeStyle = outline;
      ctx.lineWidth = size * 0.16;
      ctx.lineJoin = "round";
    }

    let total = 0;
    for (const char of text) total += widthOf(char);

    const bounds = { left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity };
    let current = angle * DEG - (align === "center" ? total / radius / 2 : 0);
    for (const char of text) {
      const width = widthOf(char);
      const middle = current + width / radius / 2;
      const x = cx + radius * Math.cos(middle);
      const y = cy + radius * Math.sin(middle);
      ctx.setTransform(1, 0, 0, 1, x, y);
      ctx.rotate(middle + Math.PI / 2);
      if (outline) ctx.strokeText(char, 0, baseline);
      ctx.fillText(char, 0, baseline);
      current += width / radius;

      bounds.left = Math.min(bounds.left, x - size);
      bounds.top = Math.min(bounds.top, y - size);
      bounds.right = Math.max(bounds.right, x + size);
      bounds.bottom = Math.max(bounds.bottom, y + size);
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.lineJoin = "miter";
    return bounds;
  }

  // Gradient label with a dark outline, centered at (0, y)
  drawJudgementText(style, size, y) {
    const { ctx } = this;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `${size}px ${JUDGEMENT_FONT}`;
    if ("letterSpacing" in ctx) ctx.letterSpacing = `${-size * 0.08}px`;

    ctx.lineJoin = "round";
    ctx.lineWidth = size * 0.14;
    ctx.strokeStyle = "rgba(40, 0, 30, 0.85)";
    ctx.strokeText(style.text, 0, y);

    ctx.fillStyle = this.cached(`judgement${style.text}${size}`, () => {
      const gradient = ctx.createLinearGradient(0, y - size / 2, 0, y + size / 2);
      gradient.addColorStop(0, style.top);
      gradient.addColorStop(1, style.bottom);
      return gradient;
    });
    ctx.fillText(style.text, 0, y);

    if ("letterSpacing" in ctx) ctx.letterSpacing = "0px";
  }

  drawJudgement(now) {
    const { ctx, cx, cy, R, settings, judgement } = this;
    if (!judgement || settings.judgementPosition === 3) return;

    const elapsed = now - judgement.start;
    if (elapsed > 450) return;

    const alpha = (elapsed < 350 ? 1 : 1 - (elapsed - 350) / 100) * settings.infoOpacity;
    if (alpha <= 0) return;
    const pop = 1 + 0.18 * (1 - Math.min(1, elapsed / 80));
    const style = JUDGEMENT_STYLES[judgement.kind];
    const y = cy + R * JUDGEMENT_OFFSETS[settings.judgementPosition];
    // "Marvelous" is ~0.41x the judgement radius wide, like in the videos
    const size = R * 0.069;

    ctx.globalAlpha = alpha;
    ctx.setTransform(pop, 0, 0, pop, cx, y);
    this.drawJudgementText(style, size, 0);

    if (settings.judgementDetail && judgement.detail) {
      this.drawJudgementText(JUDGEMENT_STYLES[judgement.detail], size * 0.55, size * 0.9);
    }

    ctx.lineJoin = "miter";
    ctx.globalAlpha = 1;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
}
