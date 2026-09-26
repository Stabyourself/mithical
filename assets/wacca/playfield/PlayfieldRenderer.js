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
import { parseMer, buildChart } from "./merChart.js";
import waccaSymbolColors from "../waccaSymbolColors.js";

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
// Score displays have no label
const CENTER_LABELS = {
  1: "COMBO",
  4: "S BORDER",
  5: "SS BORDER",
  6: "SSS BORDER",
  7: "PERSONAL BEST",
};

// Same font and gradients as the recent plays judgement labels
// Fonts the game uses, see wacca.scss
const JUDGEMENT_FONT = '"judgement_font", sans-serif';
const SCORE_FONT = '"score_font", "ring_font", sans-serif';
const LABEL_FONT = '"label_font", "ring_font", sans-serif';
const JUDGEMENT_STYLES = {
  marvelous: { text: "Marvelous", top: "#ff1e8c", bottom: "#fe8e34" },
  great: { text: "Great", top: "#ffff88", bottom: "#c2e67b" },
  good: { text: "Good", top: "#98edff", bottom: "#72a6f1" },
  miss: { text: "Miss", top: "#8b8b8b", bottom: "#dadada" },
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

// Judging, the same for the autoplay bot and people
const FRAME_MS = 1000 / 60;
// Hit windows in 60fps frames, [early, late] for marvelous/great/good, from SaturnEdit
const HIT_WINDOWS = {
  touch: [[-3, 3], [-5, 5], [-6, 6]],
  hold: [[-3, 3], [-5, 5], [-6, 6]],
  snapIn: [[-5, 7], [-8, 10], [-10, 10]],
  snapOut: [[-7, 5], [-10, 8], [-10, 10]],
  slideCW: [[-5, 5], [-8, 10], [-10, 10]],
  slideCCW: [[-5, 5], [-8, 10], [-10, 10]],
  // Chains are marvelous or miss
  chain: [[-4, 4]],
};
const HIT_GRADES = ["marvelous", "great", "good"];
const MAX_LATE_MS = 10 * FRAME_MS;
// Letting go of a hold for longer than this drops it for good
const HOLD_DROP_MS = 200;
// Back to autoplay after this long without touching anything
const PLAY_IDLE_MS = 6000;
// Touch ring around the screen, lit like the cabinet. Sizes are fractions of the canvas radius
const RING_WIDTH = 0.13;
const RING_BEZEL = 0.01;
// Gap between the judgement line and the ring, the screen edge hides under the ring
const RING_GAP = 0.043;
const RING_ROWS = 4;
// The judgement line flashes white where a finger lands, fading this fast
const LINE_FLASH_MS = 150;
// Touched lanes light up whole columns, the cell you touch splashes white and spreads out
const SPLASH_MS = 250;
// How far the splash spreads, in lane widths
const SPLASH_WAVE_REACH = 5;
const SPLASH_WAVE_OPACITY = 0.35;
// Slight dimming between beats
const BEAT_DIM = 0.08;
// R notes: rainbow around the whole ring, spreading from the note (Traveller hand cam)
const RING_R_MS = 650;
const RING_R_SPREAD_MS = 150;
const RING_R_FADE_MS = 90;
// Plus two diagonal white lines running both ways, half way around in ~190ms
const RING_R_SWEEP_LANES_PER_MS = 30 / 190;
const RING_R_SWEEP_MS = 320;
const RING_R_SWEEP_WIDTH = 1.5;
// How far each row lags behind the one outside it, in lanes
const RING_R_SWEEP_SLANT = 2;

// The bot plans notes this far ahead
const BOT_LOOKAHEAD_MS = 150;
// Missed holds turn grey-ish
const MISSED_HOLD_COLORS = ["#ececf0", "#dcdce2", "#cbcbd2", "#bdbdc5", "#b0b0b8", "#a4a4ad"];
// Snaps need a swipe this far (fraction of the radius) within SWIPE_MS
const SNAP_SWIPE = 0.06;
const SWIPE_MS = 200;
const MAX_BUBBLES = 240;
const BUBBLE_LIFE_MS = 460;

// Ring text styles, from direct feed videos
// Ring text, measured off an in-game screenshot. Sizes and radii are in Rj,
// radii are where the baseline sits, angles are where the text starts (or its center)
// Pitch is a fixed cell width per char, the game lays these out monospaced
const RING_TEXT = {
  baseline: 0.9844,
  count: { angle: -132.4, pitch: 0.0587, color: "#f769bd" },
  countWord: { angle: -125, size: 0.042, pitch: 0.0341 },
  label: { angle: -103.7, size: 0.0311, color: "#b45121" },
  score: { baseline: 0.9829, size: 0.0456, pitch: 0.0422, color: "#f8a12a" },
  difficulty: {
    angle: -77.4,
    size: 0.0427,
    namePitch: 0.0338,
    levelPitch: 0.0299,
    dotPitch: 0.0234,
    digitSize: 0.0543,
    color: "#e01864",
  },
  title: { angle: -49.6, end: -5, size: 0.042, pitch: 0.041, color: "#f567b9" },
};

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

// See wacca.scss
const FONT = '"ring_font", "Roboto", "Helvetica Neue", Arial, sans-serif';

// Farthest past the judgement line anything draws, that's under the ring already
const PAST_LINE = 1.03;

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
    // 100 = 0.0, one step on the display = one frame, positive = hit later
    judgementOffset: (clamp(option(options, 108, 100), 0, 200) / 10 - 10) * FRAME_MS,
    touchEffectPop: option(options, 1006, 312001),
    // Three colors plus their dark versions
    ringColors: (
      waccaSymbolColors.find((scheme) => scheme.id === option(options, 4, 103001)) ??
      waccaSymbolColors[0]
    ).colors,
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
    // Not opaque, Firefox draws garbage behind the rounded corners otherwise
    this.ctx = canvas.getContext("2d");
    // Plain background, also used for masked lanes
    this.backgroundLayer = document.createElement("canvas");
    // Everything static under the notes, copied at the start of each frame
    this.baseLayer = document.createElement("canvas");
    this.ringTextLayer = document.createElement("canvas");
    this.beamLayer = document.createElement("canvas");
    // Touch ring: idle colors for the current mask, and all cells lit
    this.ringIdleLayer = document.createElement("canvas");
    this.ringLitLayer = document.createElement("canvas");
    // For composing the judgement line
    this.judgementLineLayer = document.createElement("canvas");
    this.songTitle = SONG_TITLES[Math.floor(Math.random() * SONG_TITLES.length)];
    this.laneHidden = new Uint8Array(60);

    this.settings = resolveSettings({});
    // Canvas text doesn't redraw by itself once fonts arrive, so rebuild the text layers then
    this.fontsReady = Promise.all([
      document.fonts?.load(`40px ${JUDGEMENT_FONT}`),
      document.fonts?.load(`40px ${FONT}`),
      document.fonts?.load(`40px ${SCORE_FONT}`, "0123456789"),
      document.fonts?.load(`40px ${LABEL_FONT}`, "SCORE"),
    ])
      .catch(() => { })
      .then(() => {
        this.dirty = true;
      });
    this.cache = new Map();
    // Full rebuild on resize, partial ones on option changes
    this.dirty = true;
    this.dirtyBackground = false;
    this.dirtyBase = false;
    this.dirtyThickness = false;

    this.beamUntil = new Float64Array(60);
    // Touches from people (pointer ids) and the autoplay bot ("bot" ids)
    this.fingers = new Map();
    // Demo ms per real ms, set by whoever drives render()
    this.playbackRate = 1;
    this.judgedNotes = new Set();
    this.missedHolds = new Set();
    this.activeHolds = [];
    this.bot = { actions: [], holds: [], planned: new Set(), fingerCount: 0 };
    this.bonusSweeps = [];
    this.splashes = [];
    // When each lane's judgement line was last pressed
    this.lineFlash = new Float64Array(60).fill(-Infinity);
    // When each ring cell was last touched (lane * RING_ROWS + row)
    this.cellTouched = new Float64Array(60 * RING_ROWS).fill(-Infinity);
    this.flashes = [];
    this.bubbles = [];
    this.shots = [];
    this.particles = [];
    for (let i = 0; i < MAX_PARTICLES; i++) {
      this.particles.push({ alive: false });
    }
    // Empty until a chart is loaded
    this.loadChart("");

    this.items = [];
    this.itemCount = 0;
    this.holdSurfaces = [];
    this.textWidths = new Map();
  }

  // Only rebuilds what changed so settings don't hitch
  setOptions(options) {
    const settings = resolveSettings(options);
    const previous = this.settings;
    this.settings = settings;

    if (settings.mirror !== previous.mirror) {
      this.setChart(buildChart(this.source, settings.mirror));
    }
    if (settings.mask !== previous.mask) this.dirtyBackground = true;
    if (settings.ringColors !== previous.ringColors) this.dirtyRing = true;
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
      this.ringIdleLayer,
      this.ringLitLayer,
      this.judgementLineLayer,
    ]) {
      layer.width = size;
      layer.height = size;
    }
    this.dirty = true;
  }

  // Load a MER chart (its text) and start over from the top. The chart loops,
  // every loop is a fresh play
  loadChart(text) {
    this.source = parseMer(text);
    this.loopMs = this.source.lengthMs;
    this.bpm = this.source.bpm;
    this.setChart(buildChart(this.source, this.settings.mirror));
    this.reset();
  }

  // How far the notes have scrolled at a demo time (speed changes and stops), over loops
  scaledAt(time) {
    const loop = Math.floor(time / this.loopMs);
    return loop * this.source.scaledLength + this.source.scaledAt(time - loop * this.loopMs);
  }

  // Demo state at the start
  reset() {
    // Start a measure early so notes are already coming in
    this.time = -this.source.msAt(1920);
    this.loopIndex = Math.floor(this.time / this.loopMs);
    this.resetStats();
    this.playing = false;
    this.fingers.clear();
    this.resetJudging();
    this.clearEffects();
  }

  clearEffects() {
    this.beamUntil.fill(-Infinity);
    this.cellTouched.fill(-Infinity);
    this.lineFlash.fill(-Infinity);
    this.bonusSweeps.length = 0;
    this.splashes.length = 0;
    this.flashes.length = 0;
    this.bubbles.length = 0;
    this.shots.length = 0;
    for (const particle of this.particles) particle.alive = false;
    this.judgement = null;
    this.rEffectStart = -Infinity;
  }

  // Scrubbing through the chart (ms), the lead-in before it counts as 0
  get songLength() {
    return this.loopMs;
  }

  get songTime() {
    return this.time < 0 ? 0 : this.time % this.loopMs;
  }

  // Jump to a point in the current loop, like scrubbing a video. The bot takes over
  // from there and the score is as if it played everything before
  seek(songTime) {
    const start = this.time < 0 ? 0 : this.loopIndex * this.loopMs;
    this.time = start + clamp(songTime, 0, this.loopMs - 1);
    this.loopIndex = Math.floor(this.time / this.loopMs);
    this.playing = false;
    this.fingers.clear();
    this.resetJudging();
    this.clearEffects();

    this.resetStats();
    let passed = 0;
    for (const note of this.chart.notes) {
      if (start + note.time < this.time) passed++;
      if (note.type === "hold" && start + note.endTime < this.time) passed++;
    }
    this.combo = passed;
    this.judged = passed;
    this.earned = (1000000 / this.noteCount()) * passed;
  }

  resetStats() {
    this.combo = 0;
    this.earned = 0;
    this.lost = 0;
    this.judged = 0;
  }

  // Advance by dt ms and draw a frame
  render(dt) {
    this.applyPendingRebuilds();

    const previous = this.time;
    // Clamp so coming back from a hidden tab doesn't skip ahead
    this.time += clamp(dt, 0, 100);

    // New loop, new score
    const loopIndex = Math.floor(this.time / this.loopMs);
    if (loopIndex !== this.loopIndex) {
      this.loopIndex = loopIndex;
      this.resetStats();
    }

    if (this.playing && this.fingers.size === 0 && this.time - this.lastInput > PLAY_IDLE_MS) {
      this.handBack();
    }
    if (!this.playing) this.runBot();
    this.updateJudging(this.time - previous);
    this.renderClock = performance.now();
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

  // Radius as a fraction of the canvas radius
  radiusAt(x, y) {
    return Math.hypot(x - this.cx, y - this.cy) / this.R;
  }

  // Demo time of an input, including the time since the last frame
  inputTime() {
    const sinceFrame = this.renderClock ? performance.now() - this.renderClock : 0;
    return this.time + clamp(sinceFrame, 0, 50) * this.playbackRate;
  }

  // Any click takes over from the bot and counts as a hit, so people find it by accident
  pointerDown(id, x, y) {
    this.takeOver();
    this.fingerDown(id, this.laneAt(x, y), this.radiusAt(x, y), this.inputTime());
  }

  pointerMove(id, x, y) {
    if (!this.fingers.has(id)) return;
    this.lastInput = this.time;
    this.fingerMove(id, this.laneAt(x, y), this.radiusAt(x, y), this.inputTime());
  }

  pointerUp(id) {
    this.fingers.delete(id);
    this.lastInput = this.time;
  }

  // Fingers: people's pointers and the bot's, judged the same

  // Ring row under a finger, the screen area counts as the innermost row
  rowAt(radius) {
    const rowHeight = (this.ringOuter - this.ringInner) / RING_ROWS;
    return clamp(Math.floor((radius * this.R - this.ringInner) / rowHeight), 0, RING_ROWS - 1);
  }

  // Radius (fraction of R) of the middle of a ring row
  rowRadius(row) {
    const rowHeight = (this.ringOuter - this.ringInner) / RING_ROWS;
    return (this.ringInner + (row + 0.5) * rowHeight) / this.R;
  }

  // The bot's fingers have a target note and only hit that one
  fingerDown(id, lane, radius, time, target = null) {
    const row = this.rowAt(radius);
    this.fingers.set(id, { lane, row, target, swipeFrom: radius, swipeStart: time });
    this.splashes.push({ lane, row, start: this.time });
    this.flashLine(lane);
    this.hitNote(this.closestNote(["touch", "hold"], lane, time, target));
  }

  fingerMove(id, lane, radius, time) {
    const finger = this.fingers.get(id);
    const row = this.rowAt(radius);
    if (lane !== finger.lane || row !== finger.row) this.splashes.push({ lane, row, start: this.time });
    finger.row = row;

    // Moving into another lane counts as a new touch there
    if (lane !== finger.lane) {
      const from = finger.lane;
      finger.lane = lane;
      this.flashLine(lane);

      // Slides: moving at least one lane in their direction (lanes count counterclockwise)
      let moved = lane - from;
      if (moved > 30) moved -= 60;
      if (moved < -30) moved += 60;
      const type = moved > 0 ? "slideCCW" : "slideCW";
      const { target } = finger;
      this.hitNote(
        this.closestNote([type], from, time, target) ?? this.closestNote([type], lane, time, target),
      );

      // Touch notes, hold starts and slides you move into from outside
      for (const found of [
        this.closestNote(["touch", "hold"], lane, time, target),
        this.closestNote(["slideCW", "slideCCW"], lane, time, target),
      ]) {
        if (found && !this.covers(found.note.pos, found.note.size, from)) this.hitNote(found);
      }
    }

    // Snaps: a quick swipe in or out
    if (time - finger.swipeStart > SWIPE_MS) {
      finger.swipeFrom = radius;
      finger.swipeStart = time;
    }
    const swiped = radius - finger.swipeFrom;
    if (Math.abs(swiped) >= SNAP_SWIPE) {
      this.hitNote(
        this.closestNote([swiped < 0 ? "snapIn" : "snapOut"], finger.lane, time, finger.target),
      );
      finger.swipeFrom = radius;
      finger.swipeStart = time;
    }
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
    if (this.dirtyRing) this.buildRingLayers();

    this.dirtyBackground = false;
    this.dirtyRing = false;
    this.dirtyThickness = false;
    this.dirtyBase = false;
  }

  rebuild() {
    const size = this.canvas.width;
    const outer = size / 2;
    this.size = size;
    this.cx = outer;
    this.cy = outer;
    this.ringOuter = outer * 0.995;
    this.ringInner = outer * (1 - RING_WIDTH);
    this.ringBezel = this.ringInner - outer * RING_BEZEL;
    this.Rj = this.ringInner - outer * RING_GAP;
    this.R = this.Rj / 0.913;
    this.s3 = (this.R * 2) / 1060;
    this.noteWidth = STROKE_WIDTHS[this.settings.thickness] * this.s3;

    this.cache.clear();
    this.textWidths.clear();
    this.buildBackgroundLayer();
    this.buildBaseLayer();
    this.buildRingTextLayer();
    this.buildBeamLayer();
    this.buildRingLayers();
    this.dirty = false;
    this.dirtyBackground = false;
    this.dirtyThickness = false;
    this.dirtyBase = false;
    this.dirtyRing = false;
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
    ctx.fillRect(0, 0, this.size, this.size);

    const dim = MASK_ALPHAS[this.settings.mask];
    if (dim > 0) {
      ctx.fillStyle = `rgba(0, 0, 0, ${dim})`;
      ctx.fillRect(0, 0, this.size, this.size);
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
    ctx.fillRect(0, 0, this.size, this.size);

    this.drawGuidelines(ctx);

    // Judgement line: two color sweep, shaded across its width
    const width = (STROKE_WIDTHS[settings.thickness] + 2) * s3;
    const lineCtx = this.judgementLineLayer.getContext("2d");
    lineCtx.globalCompositeOperation = "source-over";
    lineCtx.clearRect(0, 0, this.size, this.size);
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

    ctx.drawImage(this.judgementLineLayer, 0, 0);

    // Drawn again on top of the notes each frame (see drawJudgementLine)
    this.judgementLinePattern = this.ctx.createPattern(this.judgementLineLayer, "no-repeat");
    this.judgementLineBand = [inner, outer];
    this.judgementLineWidth = width;
    this.lineMask = null;
  }

  // Judgement line on top of the notes, left out on masked lanes. Flashes white where
  // fingers land, holding doesn't keep it white
  drawJudgementLine(now) {
    const { ctx, cx, cy, Rj, laneHidden } = this;
    const mask = laneHidden.join("");
    if (mask !== this.lineMask) {
      this.lineMask = mask;
      const [inner, outer] = this.judgementLineBand;
      this.linePath = new Path2D();
      for (let lane = 0; lane < 60; lane++) {
        if (laneHidden[lane]) continue;
        const start = -(lane + 1) * 6 * DEG;
        const end = -lane * 6 * DEG;
        this.linePath.moveTo(cx + outer * Math.cos(start), cy + outer * Math.sin(start));
        this.linePath.arc(cx, cy, outer, start, end);
        this.linePath.arc(cx, cy, inner, end, start, true);
        this.linePath.closePath();
      }
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.fillStyle = this.judgementLinePattern;
    ctx.fill(this.linePath);

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = this.judgementLineWidth;
    for (let lane = 0; lane < 60; lane++) {
      const age = now - this.lineFlash[lane];
      if (age < 0 || age >= LINE_FLASH_MS || laneHidden[lane]) continue;
      ctx.globalAlpha = 0.9 * (1 - age / LINE_FLASH_MS);
      ctx.beginPath();
      ctx.arc(cx, cy, Rj, -(lane + 1) * 6 * DEG, -lane * 6 * DEG);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
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
    const { Rj } = this;
    const { baseline, count, countWord, label, difficulty: diff, title } = RING_TEXT;
    const at = (value) => Rj * value;
    ctx.clearRect(0, 0, this.size, this.size);

    const bounds = [
      // "1/₃ Song", the total is small and sits low
      this.drawArcRuns(ctx, [
        { text: "1", size: at(0.0472), family: FONT, color: count.color, pitch: at(count.pitch) },
        { text: "/", size: at(0.038), family: FONT, color: count.color },
        { text: "3", size: at(0.0228), family: FONT, color: count.color, pitch: at(0.0226), rise: at(-0.0085) },
      ], at(baseline), count.angle),
      this.drawArcRuns(ctx, [
        { text: "Song", size: at(countWord.size), family: FONT, color: count.color, pitch: at(countWord.pitch) },
      ], at(baseline), countWord.angle),
      this.drawArcRuns(ctx, [
        { text: "SCORE", size: at(label.size), family: LABEL_FONT, color: label.color },
      ], at(baseline), label.angle, { align: "center" }),
      // Name, then a tighter "/Lv", then a bigger level number
      this.drawArcRuns(ctx, [
        { text: "EXPERT", size: at(diff.size), family: FONT, color: diff.color, pitch: at(diff.namePitch) },
        { text: "/Lv", size: at(diff.size), family: FONT, color: diff.color, pitch: at(diff.levelPitch) },
        { text: ".", size: at(diff.size), family: FONT, color: diff.color, pitch: at(diff.dotPitch) },
        { text: "12", size: at(diff.digitSize), family: FONT, color: diff.color },
      ], at(baseline), diff.angle),
      // Titles are spread wide, long ones get squeezed to fit
      this.drawArcRuns(ctx, [
        { text: this.songTitle, size: at(title.size), family: FONT, color: title.color, pitch: at(title.pitch) },
      ], at(baseline), title.angle, { maxAngle: title.end - title.angle }),
    ];

    // Only this part gets copied each frame
    const size = this.canvas.width;
    const left = Math.max(0, Math.floor(Math.min(...bounds.map((b) => b.left))));
    const top = Math.max(0, Math.floor(Math.min(...bounds.map((b) => b.top))));
    const right = Math.min(size, Math.ceil(Math.max(...bounds.map((b) => b.right))));
    const bottom = Math.min(size, Math.ceil(Math.max(...bounds.map((b) => b.bottom))));
    this.ringTextRects = [[left, top, right - left, bottom - top]];
  }

  // Judging

  setChart(chart) {
    chart.notes.forEach((note, index) => (note.index = index));
    this.cutHitWindows(chart.notes);
    this.chart = chart;
    if (this.judgedNotes) this.resetJudging();
  }

  // Each note's hit windows in ms, [early, late] for marvelous/great/good. Like SaturnEdit:
  // notes that share lanes cut each other's windows in the middle, and notes on a hold
  // end lose their early great/good
  cutHitWindows(notes) {
    const base = (note) => HIT_WINDOWS[note.type].map(([early, late]) => [early * FRAME_MS, late * FRAME_MS]);
    const overlaps = (a, b) => mod60(b.pos - a.pos) < a.size || mod60(a.pos - b.pos) < b.size;
    const earliest = (windows) => Math.min(...windows.map(([early]) => early));
    const latest = (windows) => Math.max(...windows.map(([, late]) => late));
    const holdEnds = notes
      .filter((note) => note.type === "hold")
      .map((note) => ({ ...note.points.at(-1), time: note.endTime }));

    for (const note of notes) {
      note.windows = base(note);
      if (holdEnds.some((end) => end.time === note.time && overlaps(note, end))) {
        const marvelousEarly = note.windows[0][0];
        for (const window of note.windows) window[0] = marvelousEarly;
      }
    }

    // Notes are in time order
    notes.forEach((note, i) => {
      const from = note.time + earliest(note.windows);
      const to = note.time + latest(note.windows);

      for (let j = i + 1; j < notes.length; j++) {
        const next = notes[j];
        if (next.time === note.time || !overlaps(note, next)) continue;
        if (next.time + earliest(base(next)) >= to) break;
        const middle = (next.time - note.time) / 2;
        for (const window of note.windows) window[1] = Math.min(window[1], middle);
      }

      for (let j = i - 1; j >= 0; j--) {
        const previous = notes[j];
        if (previous.time === note.time || !overlaps(note, previous)) continue;
        if (previous.time + latest(base(previous)) <= from) break;
        const middle = (previous.time - note.time) / 2;
        for (const window of note.windows) window[0] = Math.max(window[0], middle);
      }

      note.lateLimit = latest(note.windows);
    });
  }

  // Start judging fresh from now, earlier notes are left alone
  resetJudging() {
    this.judgeFrom = this.time;
    this.judgedNotes.clear();
    this.missedHolds.clear();
    this.activeHolds.length = 0;
    this.resetBot();
  }

  noteKey(note, base) {
    return base * 1000 + note.index;
  }

  // Unjudged notes near the given time, with their timing (negative = early)
  *playableNotes(time) {
    const loopIndex = Math.floor(time / this.loopMs);
    for (let k = -1; k <= 1; k++) {
      const base = (loopIndex + k) * this.loopMs;
      for (const note of this.chart.notes) {
        const t = base + note.time;
        if (t < this.judgeFrom || Math.abs(time - t) > 400) continue;
        const key = this.noteKey(note, base);
        if (this.judgedNotes.has(key)) continue;
        yield { note, base, key, t, delta: time - this.settings.judgementOffset - t };
      }
    }
  }

  gradeFor(note, delta) {
    for (let i = 0; i < note.windows.length; i++) {
      const [early, late] = note.windows[i];
      if (delta >= early && delta <= late) return HIT_GRADES[i];
    }
    return null;
  }

  // Closest note of the given types under the finger that's in its window
  closestNote(types, lane, time, target = null) {
    let best = null;
    for (const candidate of this.playableNotes(time)) {
      if (!types.includes(candidate.note.type)) continue;
      if (!this.covers(candidate.note.pos, candidate.note.size, lane)) continue;
      if (!this.gradeFor(candidate.note, candidate.delta)) continue;
      if (!best || Math.abs(candidate.delta) < Math.abs(best.delta)) best = candidate;
    }
    return best;
  }

  flashLine(lane) {
    for (let d = -1; d <= 1; d++) this.lineFlash[mod60(lane + d)] = this.time;
  }

  // A finger covers its lane and one on each side
  covers(pos, size, lane) {
    for (let offset = -1; offset <= 1; offset++) {
      if (mod60(lane + offset - pos) < size) return true;
    }
    return false;
  }

  touching(pos, size) {
    for (const finger of this.fingers.values()) {
      if (this.covers(pos, size, finger.lane)) return true;
    }
    return false;
  }

  hitNote(found, kind = found && this.gradeFor(found.note, found.delta)) {
    if (!found) return;
    const { note, base, key, delta } = found;
    this.judgedNotes.add(key);
    const detail = kind === "marvelous" ? null : delta < 0 ? "FAST" : "LATE";
    this.judge(kind, detail);

    this.spawnTouchEffects(note.pos, note.size);

    if (note.rNote && this.settings.rNoteEffect) {
      this.rEffectStart = this.time;
      this.rEffectLane = note.pos + note.size / 2;
    }

    if (note.bonus && this.settings.bonusEffect && note.type.startsWith("slide")) {
      this.bonusSweeps.push({
        start: this.time,
        duration: this.bpm >= 200 ? 480000 / this.bpm : 240000 / this.bpm,
        lane: note.pos + Math.floor(note.size / 2),
        counterclockwise: note.type === "slideCCW",
      });
    }

    if (note.type === "hold") {
      this.activeHolds.push({ note, base, key, kind, detail, held: true, releasedFor: 0 });
    }
  }

  updateJudging(dt) {
    const now = this.time;

    for (const candidate of this.playableNotes(now)) {
      const { note, delta } = candidate;

      // Chains have no attack judgement, touching them is enough
      const contact = note.type === "chain" && delta >= note.windows[0][0];
      if (contact && this.touching(note.pos, note.size)) {
        this.hitNote(candidate, "marvelous");
        continue;
      }

      if (delta > note.lateLimit) {
        this.judgedNotes.add(candidate.key);
        this.judge("miss", null);
        // Missed hold start means the whole hold is gone
        if (note.type === "hold") {
          this.missedHolds.add(candidate.key);
          this.activeHolds.push({ ...candidate, kind: "miss", detail: null, held: false });
        }
      }
    }

    // Holds end with the start's rating. Let go too long and they're dropped: grey, end is a miss
    for (let i = this.activeHolds.length - 1; i >= 0; i--) {
      const hold = this.activeHolds[i];
      const local = now - hold.base;
      const shape = this.holdShapeAt(hold.note, local);
      hold.held = hold.kind !== "miss" && this.touching(Math.round(shape.pos), Math.round(shape.size));
      if (hold.kind !== "miss") {
        hold.releasedFor = hold.held ? 0 : hold.releasedFor + dt;
        if (hold.releasedFor > HOLD_DROP_MS) {
          hold.kind = "miss";
          hold.detail = null;
          this.missedHolds.add(hold.key);
        }
      }
      if (local >= hold.note.endTime) {
        this.activeHolds.splice(i, 1);
        this.endHold(hold);
      }
    }

    // Forget notes from old loops
    if (this.judgedNotes.size > 400) {
      const oldest = (Math.floor(now / this.loopMs) - 1) * this.loopMs * 1000;
      for (const set of [this.judgedNotes, this.missedHolds]) {
        for (const key of set) if (key < oldest) set.delete(key);
      }
    }
  }

  judge(kind, detail) {
    const perNote = 1000000 / this.noteCount();
    const value = perNote * { marvelous: 1, great: 0.7, good: 0.5, miss: 0 }[kind];

    this.combo = kind === "miss" ? 0 : this.combo + 1;
    this.judged++;
    this.earned += value;
    this.lost += perNote - value;
    this.judgement = { kind, detail, start: this.time };
  }

  // Judged notes in the chart, hold ends count too
  noteCount() {
    this.chart.noteCount ??= this.chart.notes.reduce(
      (sum, note) => sum + (note.type === "hold" ? 2 : 1),
      0,
    );
    return this.chart.noteCount;
  }

  endHold(hold) {
    this.judge(hold.kind, hold.detail);
    if (hold.kind === "miss") return;

    const last = hold.note.points[hold.note.points.length - 1];
    this.spawnTouchEffects(last.pos, last.size, false);
  }

  // Autoplay: a bot plays with its own fingers until someone clicks in

  takeOver() {
    this.lastInput = this.time;
    if (this.playing) return;

    this.playing = true;
    this.resetBot();
    this.resetStats();
    this.judgement = null;
  }

  // Back to the bot, skipping whatever is already at the line
  handBack() {
    this.playing = false;
    this.judgeFrom = this.time;
  }

  resetBot() {
    const bot = this.bot;
    for (const id of this.fingers.keys()) {
      if (typeof id === "string" && id.startsWith("bot")) this.fingers.delete(id);
    }
    bot.actions.length = 0;
    bot.holds.length = 0;
    bot.planned.clear();
  }

  runBot() {
    const { bot } = this;
    const now = this.time;

    for (const candidate of this.playableNotes(now)) {
      // A frame or two late is still a Marvelous
      if (candidate.t < now - 30 || candidate.t > now + BOT_LOOKAHEAD_MS) continue;
      if (bot.planned.has(candidate.key)) continue;
      bot.planned.add(candidate.key);
      this.planBotNote(candidate);
    }

    bot.actions.sort((a, b) => a.time - b.time);
    while (bot.actions.length > 0 && bot.actions[0].time <= now) {
      const action = bot.actions.shift();
      action.run(action.time);
    }

    // Follow held holds
    for (let i = bot.holds.length - 1; i >= 0; i--) {
      const { id, note, base, radius } = bot.holds[i];
      if (now - base >= note.endTime) {
        this.fingers.delete(id);
        bot.holds.splice(i, 1);
        continue;
      }
      const shape = this.holdShapeAt(note, now - base);
      this.fingerMove(id, mod60(Math.round(shape.pos + shape.size / 2)), radius, now);
    }

    if (bot.planned.size > 400) {
      const oldest = (Math.floor(now / this.loopMs) - 1) * this.loopMs * 1000;
      for (const key of bot.planned) if (key < oldest) bot.planned.delete(key);
    }
  }

  planBotNote({ note, base, t }) {
    const { bot } = this;
    const id = `bot${bot.fingerCount++}`;
    // Somewhere around the middle, like a hand would
    const jitter = note.size >= 4 ? Math.floor(Math.random() * 3) - 1 : 0;
    const lane = mod60(note.pos + Math.floor(note.size / 2) + jitter);
    const at = (time, run) => bot.actions.push({ time, run });

    // Always Marvelous for now, while testing the window cuts
    const time = t + this.settings.judgementOffset;

    const radius = this.rowRadius(1 + Math.floor(Math.random() * 2));

    if (note.type === "slideCW" || note.type === "slideCCW") {
      // Drag across it a bit, like a hand would
      const direction = note.type === "slideCCW" ? 1 : -1;
      at(time - 40, (t) => this.fingerDown(id, mod60(lane - direction), radius, t));
      for (let step = 0; step < 3; step++) {
        at(time + step * 40, (t) => this.fingerMove(id, mod60(lane + step * direction), radius, t));
      }
      at(time + 110, () => this.fingers.delete(id));
    } else if (note.type === "snapIn" || note.type === "snapOut") {
      // Swipe across the rows, towards the screen for snap in
      const [from, to] = note.type === "snapIn" ? [RING_ROWS - 1, 0] : [0, RING_ROWS - 1];
      at(time - 40, (t) => this.fingerDown(id, lane, this.rowRadius(from), t));
      at(time, (t) => this.fingerMove(id, lane, this.rowRadius(to), t));
      at(time + 40, () => this.fingers.delete(id));
    } else if (note.type === "hold") {
      at(time, (t) => {
        this.fingerDown(id, lane, radius, t);
        bot.holds.push({ id, note, base, radius });
      });
    } else {
      at(time, (t) => this.fingerDown(id, lane, radius, t));
      at(time + 60, () => this.fingers.delete(id));
    }
  }

  lightLanes(pos, size) {
    for (let i = 0; i < size; i++) {
      const lane = mod60(pos + i);
      this.beamUntil[lane] = Math.max(this.beamUntil[lane], this.time);
    }
  }

  // Key beams only light where fingers are, not the whole note
  updateKeyBeams() {
    for (const { lane } of this.fingers.values()) {
      this.lightLanes(lane - 1, 3);
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

  spawnTouchEffects(pos, size, shoot = true) {
    const { settings } = this;

    if (settings.touchEffectPop === 312001) {
      this.flashes.push({ start: this.time, pos, size });

      // Sparkles are part of the default pop, not the shoot
      const count = Math.min(40, size * 3);
      for (let i = 0; i < count; i++) {
        const roll = Math.random();
        const kind = roll < 0.35 ? "triangle" : roll < 0.8 ? "dot" : "streak";
        this.spawnParticle(kind, pos + Math.random() * size, 0.35 + Math.random() * 0.65);
      }
    } else if (settings.touchEffectPop === 312002) {
      // One bubble per hit lane
      for (let i = 0; i < size; i++) {
        this.bubbles.push({ start: this.time, angle: -(pos + i + 0.5) * 6 * DEG });
      }
      if (this.bubbles.length > MAX_BUBBLES) {
        this.bubbles.splice(0, this.bubbles.length - MAX_BUBBLES);
      }
    }

    if (settings.touchEffectShoot && shoot) {
      this.shots.push({ start: this.time, pos, size });
    }
  }

  // Held holds grind dashes off the judgement line
  updateGrind(dt) {
    for (const { note, base, held } of this.activeHolds) {
      if (held === false) continue;
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
    for (const hold of this.holdSurfaces) this.drawHoldSurface(hold.note, hold.base, now, hold.missed);
    this.drawObjects();

    // Hold glow under the judgement line, the line stays pink while holding
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = "lighter";
    this.drawGrindGlow();
    ctx.globalCompositeOperation = "source-over";
    this.drawJudgementLine(now);
    this.drawBonusSweeps(now);
    this.drawTouchEffects(now);
    this.drawInterface();
    this.drawJudgement(now);
    this.drawRing(now);
  }

  // Which lanes are hidden right now, including the sweep animations
  updateLaneMasks(now) {
    // Everything's masked until the chart shows it
    const hidden = this.laneHidden;
    hidden.fill(1);

    const local = ((now % this.loopMs) + this.loopMs) % this.loopMs;
    for (const toggle of this.chart.laneToggles) {
      if (toggle.time > local) break;

      const progress = toggle.duration > 0 ? clamp((local - toggle.time) / toggle.duration, 0, 1) : 1;
      const value = toggle.show ? 0 : 1;
      const { pos, size } = toggle;

      if (toggle.direction === "center" && !toggle.show) {
        // Hiding closes in from both edges
        const steps = Math.floor(Math.ceil(size / 2) * progress);
        for (let i = 0; i < steps; i++) {
          hidden[mod60(pos + i)] = value;
          hidden[mod60(pos + size - 1 - i)] = value;
        }
      } else if (toggle.direction === "center") {
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

  // Touch ring

  // Cells for some lanes, with seams (wider between the 12 panel segments)
  ringCellsPath(lanes, rows = [0, 1, 2, 3]) {
    const { cx, cy, ringInner, ringOuter, size } = this;
    const path = new Path2D();
    const rowHeight = (ringOuter - ringInner) / RING_ROWS;
    const gap = Math.max(1, size * 0.0025);

    for (const lane of lanes) {
      // Half a seam on each side, a full one at segment edges (every 5 lanes)
      const startGap = (lane + 1) % 5 === 0 ? gap : gap / 2;
      const endGap = lane % 5 === 0 ? gap : gap / 2;
      for (const row of rows) {
        const inner = ringInner + row * rowHeight + gap / 2;
        const outer = inner + rowHeight - gap;
        const start = -(lane + 1) * 6 * DEG + startGap / inner;
        const end = -lane * 6 * DEG - endGap / inner;
        path.moveTo(cx + outer * Math.cos(start), cy + outer * Math.sin(start));
        path.arc(cx, cy, outer, start, end);
        path.arc(cx, cy, inner, end, start, true);
        path.closePath();
      }
    }
    return path;
  }

  // Dark version near the screen, bright at the outer edge
  ringGradient(ctx, index) {
    const { cx, cy, ringInner, ringOuter, settings } = this;
    const bright = settings.ringColors[index];
    const dark = settings.ringColors[index + 3];
    const mix = (a, b, t) => `rgb(${a.map((value, i) => Math.round(value + (b[i] - value) * t))})`;
    const white = [255, 255, 255];

    const gradient = ctx.createRadialGradient(cx, cy, ringInner, cx, cy, ringOuter);
    gradient.addColorStop(0, mix(dark, bright, 0.35));
    gradient.addColorStop(0.45, mix(dark, bright, 0.85));
    gradient.addColorStop(1, mix(bright, white, 0.12));
    return gradient;
  }

  // Cell paths and the lit ring (third color), redone with the size or colors
  buildRingLayers() {
    const all = Array.from({ length: 60 }, (_, lane) => lane);
    this.ringAllCells = this.ringCellsPath(all);
    this.ringLanePaths = all.map((lane) => this.ringCellsPath([lane]));
    this.ringCellPaths = all.map((lane) =>
      Array.from({ length: RING_ROWS }, (_, row) => this.ringCellsPath([lane], [row])),
    );

    const ctx = this.ringLitLayer.getContext("2d");
    ctx.clearRect(0, 0, this.size, this.size);
    ctx.fillStyle = this.ringGradient(ctx, 2);
    ctx.fill(this.ringAllCells);
    this.ringLitPattern = this.ctx.createPattern(this.ringLitLayer, "no-repeat");
    this.ringMask = null;
  }

  // Idle ring: masked lanes in the first color, open ones in the second (official
  // tutorial video). Only redrawn when the mask changes
  updateRingIdle() {
    const mask = this.laneHidden.join("");
    if (mask === this.ringMask) return;
    this.ringMask = mask;

    const { cx, cy, size, laneHidden } = this;
    const ctx = this.ringIdleLayer.getContext("2d");
    ctx.clearRect(0, 0, size, size);
    // Bezel and seams, out to the canvas edge
    ctx.fillStyle = "#08070d";
    ctx.beginPath();
    ctx.arc(cx, cy, size / 2, 0, Math.PI * 2);
    ctx.arc(cx, cy, this.ringBezel, 0, Math.PI * 2, true);
    ctx.fill();

    const open = [];
    const masked = [];
    for (let lane = 0; lane < 60; lane++) (laneHidden[lane] ? masked : open).push(lane);
    for (const [lanes, index] of [
      [open, 1],
      [masked, 0],
    ]) {
      if (lanes.length === 0) continue;
      ctx.fillStyle = this.ringGradient(ctx, index);
      ctx.fill(lanes.length === 60 ? this.ringAllCells : this.ringCellsPath(lanes));
    }
    this.ringIdlePattern = this.ctx.createPattern(this.ringIdleLayer, "no-repeat");
  }

  drawRing(now) {
    const { ctx, cx, cy, ringInner, ringOuter } = this;
    ctx.globalAlpha = 1;

    // Idle ring out to the canvas edge, covers anything flying past the screen
    this.updateRingIdle();
    ctx.fillStyle = this.ringIdlePattern;
    ctx.beginPath();
    ctx.arc(cx, cy, this.size / 2, 0, Math.PI * 2);
    ctx.arc(cx, cy, this.ringBezel, 0, Math.PI * 2, true);
    ctx.fill();

    // Pulses with the beat
    const beatMs = 60000 / this.bpm;
    const sinceBeat = ((now % beatMs) + beatMs) % beatMs;
    const dim = BEAT_DIM * (1 - Math.exp(-sinceBeat / 140));
    if (dim > 0.01) {
      ctx.fillStyle = `rgba(0, 0, 0, ${dim})`;
      ctx.beginPath();
      ctx.arc(cx, cy, ringOuter, 0, Math.PI * 2);
      ctx.arc(cx, cy, ringInner, 0, Math.PI * 2, true);
      ctx.fill();
    }

    // Touched lanes light up whole columns in the third color, held holds their whole width
    const touchLane = (lane) => {
      for (let row = 0; row < RING_ROWS; row++) this.cellTouched[mod60(lane) * RING_ROWS + row] = now;
    };
    for (const { lane } of this.fingers.values()) {
      for (let d = -1; d <= 1; d++) touchLane(lane + d);
    }
    for (const { note, base, held } of this.activeHolds) {
      if (!held) continue;
      const shape = this.holdShapeAt(note, now - base);
      const start = Math.round(shape.pos);
      for (let i = 0; i < Math.round(shape.size); i++) touchLane(start + i);
    }
    const touched = this.ringCellLight ?? (this.ringCellLight = new Float32Array(60 * RING_ROWS));
    for (let cell = 0; cell < touched.length; cell++) {
      touched[cell] = clamp(1 - (now - this.cellTouched[cell]) / KEY_BEAM_FADE_MS, 0, 1);
    }
    ctx.fillStyle = this.ringLitPattern;
    this.fillRingCells(touched);

    this.drawRingREffect(now);

    // Splashes: white on the touched cell, plus a fainter ring spreading out from it
    const white = this.ringCellWhite ?? (this.ringCellWhite = new Float32Array(60 * RING_ROWS));
    white.fill(0);
    const rowHeight = (ringOuter - ringInner) / RING_ROWS;
    const laneWidth = ((ringInner + ringOuter) / 2) * 6 * DEG;
    for (let i = this.splashes.length - 1; i >= 0; i--) {
      const splash = this.splashes[i];
      const progress = (now - splash.start) / SPLASH_MS;
      if (progress >= 1) {
        this.splashes.splice(i, 1);
        continue;
      }
      const fade = 1 - progress;
      const front = SPLASH_WAVE_REACH * (1 - fade * fade);
      const reach = Math.ceil(front + 1.5);
      for (let d = -reach; d <= reach; d++) {
        for (let row = 0; row < RING_ROWS; row++) {
          // Distance in lane widths
          const distance = Math.hypot(d, ((row - splash.row) * rowHeight) / laneWidth);
          const core = distance < 0.5 ? 0.95 * fade * fade : 0;
          const wave = SPLASH_WAVE_OPACITY * fade * Math.max(0, 1 - Math.abs(distance - front) / 1.2);
          const cell = mod60(splash.lane + d) * RING_ROWS + row;
          white[cell] = Math.max(white[cell], core, wave);
        }
      }
    }
    ctx.fillStyle = "#ffffff";
    this.fillRingCells(white);
    ctx.globalAlpha = 1;
  }

  // Fill cells at their brightness (0-1), grouped into a few levels so it's a handful of fills
  fillRingCells(values) {
    const { ctx } = this;
    const levels = 8;
    const paths = [];
    for (let cell = 0; cell < values.length; cell++) {
      if (values[cell] <= 0.01) continue;
      const level = Math.ceil(values[cell] * levels);
      (paths[level] ??= new Path2D()).addPath(
        this.ringCellPaths[Math.floor(cell / RING_ROWS)][cell % RING_ROWS],
      );
    }
    paths.forEach((path, level) => {
      ctx.globalAlpha = level / levels;
      ctx.fill(path);
    });
    ctx.globalAlpha = 1;
  }

  // Rainbow around the whole ring after an R note
  drawRingREffect(now) {
    const elapsed = now - this.rEffectStart;
    if (elapsed < 0 || elapsed > RING_R_MS || !this.ctx.createConicGradient) return;

    const { ctx, cx, cy } = this;

    // Turns about 45° early on, then holds
    const turn = 1 - Math.pow(1 - Math.min(1, elapsed / 300), 3);
    const start = (-this.rEffectLane * 6 + 135 + turn * 45) * DEG;
    const gradient = ctx.createConicGradient(start, cx, cy);
    for (let i = 0; i <= 6; i++) gradient.addColorStop(i / 6, `hsl(${i * 60}, 100%, 58%)`);

    // Spreads from the note with a soft edge, fades out at the end
    const spread = 1 - Math.pow(1 - Math.min(1, elapsed / RING_R_SPREAD_MS), 2);
    const reach = 32 * spread;
    const fadeOut = clamp((RING_R_MS - elapsed) / RING_R_FADE_MS, 0, 1);
    ctx.fillStyle = gradient;
    if (reach >= 32) {
      ctx.globalAlpha = fadeOut;
      ctx.fill(this.ringAllCells);
    } else {
      const center = Math.floor(this.rEffectLane);
      const full = new Path2D();
      for (let d = -30; d < 30; d++) {
        const alpha = clamp((reach - Math.abs(d)) / 2, 0, 1);
        if (alpha <= 0) continue;
        const lane = this.ringLanePaths[mod60(center + d)];
        if (alpha >= 1) {
          full.addPath(lane);
          continue;
        }
        ctx.globalAlpha = alpha * fadeOut;
        ctx.fill(lane);
      }
      ctx.globalAlpha = fadeOut;
      ctx.fill(full);
    }
    ctx.globalAlpha = 1;

    // White lines both ways, outer row ahead so they're diagonal
    const progress = elapsed / RING_R_SWEEP_MS;
    if (progress >= 1) return;
    const fade = progress < 0.6 ? 1 : 1 - (progress - 0.6) / 0.4;
    const travelled = elapsed * RING_R_SWEEP_LANES_PER_MS;
    ctx.fillStyle = "#ffffff";
    for (const direction of [-1, 1]) {
      for (let row = 0; row < RING_ROWS; row++) {
        const distance = travelled - (RING_ROWS - 1 - row) * RING_R_SWEEP_SLANT;
        // Each line stops half way around, where it meets the other one
        if (distance < 0 || distance > 31) continue;
        const center = this.rEffectLane + direction * distance;
        const reach = Math.ceil(RING_R_SWEEP_WIDTH + 1);
        for (let d = -reach; d <= reach; d++) {
          const lane = Math.round(center) + d;
          const strength = clamp(RING_R_SWEEP_WIDTH + 0.5 - Math.abs(lane - center), 0, 1);
          if (strength <= 0) continue;
          ctx.globalAlpha = strength * fade;
          ctx.fill(this.ringCellPaths[mod60(lane)][row]);
        }
      }
    }
    ctx.globalAlpha = 1;
  }

  // Pre-rendered key beam light for all lanes
  buildBeamLayer() {
    const ctx = this.beamLayer.getContext("2d");
    const { cx, cy, R } = this;
    ctx.clearRect(0, 0, this.size, this.size);

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
    const loopIndex = Math.floor(now / this.loopMs);

    this.itemCount = 0;
    this.holdSurfaces.length = 0;

    // Positions go by how far things have scrolled, so speed changes show
    const nowScaled = this.scaledAt(now);

    // During a reverse only its own notes show, and only in this loop
    const songNow = now - loopIndex * this.loopMs;
    const reverse = chart.reverses.findIndex((r) => songNow > r.start && songNow <= r.middle);
    const hidden = (object, k) => reverse !== -1 && (k !== 0 || object.reverse !== reverse);

    for (let k = -1; k <= 1; k++) {
      const base = (loopIndex + k) * this.loopMs;
      const baseScaled = (loopIndex + k) * this.source.scaledLength;
      const progressOf = (scaled) => 1 - (baseScaled + scaled - nowScaled) / view;

      for (const note of chart.notes) {
        if (hidden(note, k)) continue;
        const t = base + note.time;
        const key = this.noteKey(note, base);

        if (note.type === "hold") {
          if (progressOf(note.points.at(-1).scaled) > PAST_LINE || progressOf(note.scaled) < 0) continue;
          this.holdSurfaces.push({ note, base, missed: this.missedHolds.has(key) });
        }

        // Hit notes are gone, unhit ones keep going a bit past the line
        if (this.judgedNotes.has(key) || t < now - (t >= this.judgeFrom ? MAX_LATE_MS : 0)) continue;
        const progress = progressOf(note.scaled);
        if (progress < 0 || progress > PAST_LINE) continue;
        this.pushItem(0, note, progress, note.size);
      }

      for (const connector of chart.syncConnectors) {
        const progress = progressOf(connector.scaled);
        if (hidden(connector, k) || base + connector.time < now || progress < 0 || progress > PAST_LINE) continue;
        this.pushItem(1, connector, progress, 60);
      }

      if (settings.barlines) {
        for (const line of chart.measureLines) {
          const progress = progressOf(line.scaled);
          if (hidden(line, k) || base + line.time < now || progress < 0 || progress > PAST_LINE) continue;
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

  // Note previews for the settings dropdowns

  // One note at the bottom of the ring, like the icons in game.
  // Holds get a short body going in. Returns a cropped image as a data url
  drawNotePreview(type, colorIndex) {
    this.resize(480);
    this.applyPendingRebuilds();
    this.settings.colors = { ...this.settings.colors, [type]: colorIndex };
    const { ctx, cx, cy, Rj, noteWidth } = this;

    const left = cx - Rj * 0.46;
    const top = cy + Rj * 0.62;
    const width = Rj * 0.92;
    const height = Rj * 0.38 + noteWidth;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(left, top, width, height);

    // Centered at the bottom (lane 45 is straight down)
    const size = 8;
    const pos = 45 - size / 2;
    const note = { type, pos, size, time: 0, rNote: false, bonus: false, sync: false };
    if (type === "hold") {
      const end = this.settings.viewDistance * 0.1;
      note.endTime = end;
      note.points = [
        { time: 0, pos, size },
        { time: end, pos, size },
      ];
      this.drawHoldSurface(note, 0, 0, false);
    }
    this.setScale(1);
    this.drawNote(note, 1);
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    const crop = document.createElement("canvas");
    crop.width = Math.round(width);
    crop.height = Math.round(height);
    crop.getContext("2d").drawImage(this.canvas, left, top, width, height, 0, 0, crop.width, crop.height);
    return crop.toDataURL();
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

  drawHoldSurface(note, base, now, missed) {
    const { ctx, cx, cy, Rj, R, settings } = this;
    const view = settings.viewDistance;
    const startTime = base + note.time;
    const endTime = base + note.endTime;

    // Held holds get eaten at the judgement line
    const from = Math.max(startTime, now);
    const nowScaled = this.scaledAt(now);

    // Cut off where it leaves the view (in scrolled distance, so speed changes count)
    let to = endTime;
    if (this.scaledAt(to) - nowScaled > view) {
      let low = from;
      for (let i = 0; i < 20; i++) {
        const middle = (low + to) / 2;
        if (this.scaledAt(middle) - nowScaled > view) to = middle;
        else low = middle;
      }
    }
    if (from >= to) return;

    const radiusAt = (t) =>
      Rj * perspective(clamp(1 - (this.scaledAt(t) - nowScaled) / view, 0, PAST_LINE));
    // Vertices at the hold's own points, plus every 20ms between them (4 steps on straight
    // parts). Fixed in chart time like SaturnView, so they don't shift from frame to frame
    const times = [from];
    const points = note.points;
    for (let i = 0; i < points.length - 1; i++) {
      const a = base + points[i].time;
      const b = base + points[i + 1].time;
      if (b <= from || a >= to) continue;
      const straight = points[i].pos === points[i + 1].pos && points[i].size === points[i + 1].size;
      const step = straight ? (b - a) / 4 : 20;
      for (let t = a + step; t < b; t += step) if (t > from && t < to) times.push(t);
      if (b > from && b < to) times.push(b);
    }
    times.push(to);

    const edgeA = [];
    const edgeB = [];
    for (const t of times) {
      const shape = this.holdShapeAt(note, t - base);
      const radius = radiusAt(t);
      const full = shape.size >= 60;
      const a = full ? shape.pos * -6 : shape.pos * -6 - 4.2;
      const b = full ? a - 360 : (shape.pos + shape.size) * -6 + 4.2;
      edgeA.push([radius, a]);
      edgeB.push([radius, b]);
    }

    // Outline: along one edge, across the far end, back along the other edge
    const last = times.length - 1;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.beginPath();
    ctx.moveTo(...this.pointAt(...edgeA[0]));
    for (let i = 1; i <= last; i++) ctx.lineTo(...this.pointAt(...edgeA[i]));
    this.arc(ctx, edgeA[last][0], edgeA[last][1], edgeB[last][1] - edgeA[last][1]);
    for (let i = last; i >= 0; i--) ctx.lineTo(...this.pointAt(...edgeB[i]));
    this.arc(ctx, edgeA[0][0], edgeB[0][1], edgeA[0][1] - edgeB[0][1]);
    ctx.closePath();

    // Color runs along the hold, radial gradient maps it onto the screen
    const active = now > startTime && now < endTime;
    const colors = missed
      ? MISSED_HOLD_COLORS
      : (active ? holdGradientsActive : holdGradients)[settings.colors.hold];
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

        const left = cx - R + x * cell + (cell - width) / 2;
        const top = cy - R + y * cell + (cell - width) / 2;
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

    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
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
        Rj * (0.12 * (1 - creep * creep * (3 - 2 * creep)) + 0.88 * Math.exp(-t / 8));
      const outer = Rj;
      const span = outer - front;
      if (span < 2) continue;

      // Bright head at the front, the tail towards the rim dims as it goes. Everything only
      // ever gets darker once the front has passed, no stops that pop back up
      const u = clamp(t / 140, 0, 1);
      const dim = u * u * (3 - 2 * u);

      // Own fade, it used to borrow the oldest pop flash's globalAlpha by accident, which
      // jumped up whenever that flash ran out
      const fade = 0.8 * (1 - t / 240);
      const alpha = fade * 0.85 * (t < 80 ? 1 : Math.max(0, 1 - (t - 80) / (SHOT_MS - 80)));
      const purple = clamp((t - 30) / 120, 0, 1);
      const mix = (a, b) => Math.round(a + (b - a) * purple);
      const rgba = (r, g, b, a) => `rgba(${mix(r, 150)}, ${mix(g, 70)}, ${mix(b, 190)}, ${a})`;

      const gradient = ctx.createRadialGradient(cx, cy, front, cx, cy, outer);
      gradient.addColorStop(0, rgba(255, 90, 210, alpha));
      gradient.addColorStop(0.05, rgba(250, 120, 225, alpha));
      gradient.addColorStop(0.2, rgba(245, 150, 230, alpha * (0.95 - 0.25 * dim)));
      gradient.addColorStop(1, rgba(245, 175, 238, alpha * (0.9 - 0.55 * dim)));

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

    for (const { note, base, held } of this.activeHolds) {
      if (held === false) continue;
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
    const { score: scoreText } = RING_TEXT;
    this.drawArcRuns(ctx, [
      {
        text: score,
        size: this.Rj * scoreText.size,
        family: SCORE_FONT,
        color: scoreText.color,
        pitch: this.Rj * scoreText.pitch,
      },
    ], this.Rj * scoreText.baseline, -90, { align: "center" });

    // Info opacity only fades the progress bar and the judgement (with fast/late), like in game
    if (settings.infoOpacity > 0) {
      ctx.globalAlpha = settings.infoOpacity;
      this.drawClearGauge(this.judged / this.noteCount());
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
      ctx.font = `${R * 0.085}px ${JUDGEMENT_FONT}`;
      ctx.fillText(String(value), cx, cy - R * 0.125);

      if (CENTER_LABELS[mode]) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
        ctx.font = `600 ${R * 0.03}px ${FONT}`;
        ctx.fillText(CENTER_LABELS[mode], cx, cy - R * 0.06);
      }
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

  // Text along a circle, clockwise, with its baseline on the radius. Runs set font, size,
  // color and rise, chars take their own width or a fixed pitch (glyph centered in it).
  // Angle is the start, or the center with align: "center". Returns the bounds
  drawArcRuns(ctx, runs, radius, angle, options = {}) {
    const { align = "start", maxAngle = Infinity } = options;
    const { cx, cy } = this;

    // Lay out first, widths are cached per font and char
    const chars = [];
    let total = 0;
    for (const run of runs) {
      const font = `${run.size}px ${run.family}`;
      for (const char of run.text) {
        const key = `${font}|${char}`;
        let width = this.textWidths.get(key);
        if (width === undefined) {
          ctx.font = font;
          width = ctx.measureText(char).width;
          this.textWidths.set(key, width);
        }
        const cell = run.pitch ?? width;
        chars.push({ char, run, font, cell });
        total += cell;
      }
    }

    // Too long, squeeze everything to fit
    const limit = maxAngle * DEG * radius;
    const squeeze = total > limit ? limit / total : 1;
    let current = angle * DEG - (align === "center" ? (total * squeeze) / radius / 2 : 0);

    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    const bounds = { left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity };
    for (const { char, run, font, cell } of chars) {
      const middle = current + (cell * squeeze) / 2 / radius;
      const r = radius + (run.rise ?? 0);
      const x = cx + r * Math.cos(middle);
      const y = cy + r * Math.sin(middle);
      ctx.setTransform(1, 0, 0, 1, x, y);
      ctx.rotate(middle + Math.PI / 2);
      if (squeeze !== 1) ctx.scale(squeeze, 1);
      ctx.font = font;
      ctx.fillStyle = run.color;
      ctx.fillText(char, 0, 0);
      current += (cell * squeeze) / radius;

      const extent = run.size * 1.2;
      bounds.left = Math.min(bounds.left, x - extent);
      bounds.top = Math.min(bounds.top, y - extent);
      bounds.right = Math.max(bounds.right, x + extent);
      bounds.bottom = Math.max(bounds.bottom, y + extent);
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0);
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

// Note previews are drawn once per type and color with a shared renderer
let previewRenderer = null;
const previews = new Map();

export function notePreview(type, colorIndex) {
  const key = `${type}:${colorIndex}`;
  if (!previews.has(key)) {
    previewRenderer ??= new PlayfieldRenderer(document.createElement("canvas"));
    previews.set(key, previewRenderer.drawNotePreview(type, colorIndex));
  }
  return previews.get(key);
}
