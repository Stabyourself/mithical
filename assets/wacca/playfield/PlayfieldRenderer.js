// WACCA playfield preview renderer, the round 3D view of a PlayfieldSession
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
  holdColorsAt,
  holdGradientStops,
  missedHoldColors,
  paletteIndex,
  ledColor,
  capColors,
  syncColors
} from "./noteColors.js";
import PlayfieldSession, {
  RING_ROWS,
  PAST_LINE,
  clamp,
  mod60,
  option,
  ringLayout
} from "./PlayfieldSession.js";
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
  [0.1, 0.183, 0.666, 0.783, 0.916]
];

// Sync outline radii per thickness setting
const SYNC_OUTLINE_RADII = [
  [0.971, 0.983, 1.014, 1.026, 0.977, 1.02],
  [0.963, 0.975, 1.025, 1.037, 0.969, 1.031],
  [0.946, 0.958, 1.043, 1.055, 0.952, 1.049],
  [0.926, 0.938, 1.063, 1.075, 0.932, 1.069],
  [0.91, 0.922, 1.08, 1.092, 0.915, 1.086]
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
  (i) => i % 15 === 0
];

const JUDGEMENT_LINE_COLORS = ["#f11a9b", "#bd01fa"];
// Lane stripe colors
const LANE_COLORS = [
  [22, 24, 44],
  [27, 28, 47]
];

// Background behind the lanes, shows through their center
const BACKGROUND_STOPS = [
  [0, [53, 32, 122]],
  [0.35, [29, 20, 80]],
  [1, [10, 8, 24]]
];

// Center display = max possible score minus this
const CENTER_BORDERS = { 4: 900000, 5: 950000, 6: 990000, 7: 985000 };
// Score displays have no label
const CENTER_LABELS = {
  1: "COMBO",
  4: "S BORDER",
  5: "SS BORDER",
  6: "SSS BORDER",
  7: "PERSONAL BEST"
};

// Fonts the game uses, see wacca.scss
const JUDGEMENT_FONT = '"judgement_font", sans-serif';
const SCORE_FONT = '"score_font", "ring_font", sans-serif';
const LABEL_FONT = '"label_font", "ring_font", sans-serif';
// Same gradients as the recent plays judgement labels
const JUDGEMENT_STYLES = {
  marvelous: { text: "Marvelous", top: "#ff1e8c", bottom: "#fe8e34" },
  great: { text: "Great", top: "#ffff88", bottom: "#c2e67b" },
  good: { text: "Good", top: "#98edff", bottom: "#72a6f1" },
  miss: { text: "Miss", top: "#8b8b8b", bottom: "#dadada" },
  FAST: { text: "Fast", top: "#fd6d1e", bottom: "#ad093f" },
  LATE: { text: "Late", top: "#8872fe", bottom: "#1e1eff" }
};

const JUDGEMENT_OFFSETS = [0.185, 0.47, -0.45];

// Key beams go out the moment the finger lifts, like in game. 0 = instant
const KEY_BEAM_FADE_MS = 0;
// Console ring cells fade out after a touch
const RING_TOUCH_FADE_MS = 180;
// Key beam brightness by radius (times the judgement line radius), measured off the SGDQ 2024
// direct feed. Starts halfway out, the pink line covers it, then solid white outside the line
// up to the edge of the screen
const KEY_BEAM_STOPS = [
  [0.55, 0],
  [0.6, 0.05],
  [0.65, 0.13],
  [0.7, 0.2],
  [0.75, 0.28],
  [0.8, 0.36],
  [0.85, 0.48],
  [0.9, 0.6],
  [0.95, 0.76],
  [0.965, 0.83],
  [1.035, 1]
];
const R_EFFECT_MS = 550;
// Sparkle colors over their lifetime: white -> yellow -> dim pink
const SPARKLE_WHITE = [
  [255, 255, 255],
  [255, 250, 200],
  [255, 130, 180]
];
const SPARKLE_YELLOW = [
  [255, 255, 235],
  [235, 255, 110],
  [255, 100, 110]
];
// Sparkle color over its life (first to middle color by 30%, middle to last by 70%) in steps,
// made once so there's no new color string to parse per particle per frame
const SPARKLE_STEPS = 32;
function sparkleRamp([first, middle, last]) {
  return Array.from({ length: SPARKLE_STEPS }, (_, step) => {
    const t = step / (SPARKLE_STEPS - 1);
    const [from, to, k] =
      t < 0.3
        ? [first, middle, t / 0.3]
        : [middle, last, Math.min(1, (t - 0.3) / 0.4)];
    return `rgb(${from.map((value, i) => Math.round(value + (to[i] - value) * k)).join(", ")})`;
  });
}
const SPARKLE_RAMPS = new Map(
  [SPARKLE_WHITE, SPARKLE_YELLOW].map((colors) => [colors, sparkleRamp(colors)])
);
const SHOT_MS = 170;
const GRIND_PER_LANE_MS = 0.012;
const MAX_PARTICLES = 256;

// The judgement line flashes white where a finger lands, fading this fast
const LINE_FLASH_MS = 150;
// Touched lanes light up whole columns, the cell you touch splashes white and spreads out
const SPLASH_MS = 250;
// How far the splash spreads, in lane widths
const SPLASH_WAVE_REACH = 5;
const SPLASH_WAVE_OPACITY = 0.35;
// White overlay on the touched panels, and the glow right around them. The glow is
// full strength on direct neighbours, then fades out over this many lane widths
const SPLASH_CORE_OPACITY = 0.7;
const SPLASH_HALO_OPACITY = 0.5;
const SPLASH_HALO_FALLOFF = 1.5;
// How long a pressed panel takes to fade after letting go
const RELEASE_FADE_MS = 150;
// Touches inside the ring pick a row by distance from the center (see rowAt). Higher = the inner
// rows take more of the screen: at 1.5 the rows split it about 42% / 25% / 18% / 14%, center out
const SCREEN_ROW_CURVE = 1.5;
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

const MAX_BUBBLES = 240;
// Touch effect (pop) option values
const POP_DEFAULT = 312001;
const POP_BUBBLE = 312002;
const BUBBLE_LIFE_MS = 460;

// Song title on the ring, the unrolled view uses it too
export const TITLE_COLOR = "#f567b9";

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
    digitSize: 0.0543
  },
  title: {
    angle: -49.6,
    end: -5,
    size: 0.042,
    pitch: 0.041,
    color: TITLE_COLOR
  }
};

// Ring colors per difficulty (1-4). Normal is measured off a screenshot, the rest are guesses
export const DIFFICULTY_LABELS = {
  1: { name: "NORMAL", color: "#2775f6" },
  2: { name: "HARD", color: "#f2b51c" },
  3: { name: "EXPERT", color: "#e01864" },
  4: { name: "INFERNO", color: "#a13cd8" }
};

// Where the clear line sits on the gauge per difficulty (1-4), from the game's
// MusicParameterTable: every song uses these
const CLEAR_RATES = { 1: 0.45, 2: 0.55, 3: 0.8, 4: 0.8 };

// What the demo chart shows, with a random title
const DEMO_LABEL = { difficulty: 3, level: "12" };
const SONG_TITLES = [
  "Nearl the Radiant Knight",
  "Big Blast Sonic",
  "Fhqwhgads",
  "Ground Pound",
  "Pop on Rocks",
  "Chug Jug With You",
  "Mogu Mogu Yummy"
];

// See wacca.scss
export const FONT =
  '"ring_font", "Roboto", "Helvetica Neue", Arial, sans-serif';

// Something drawn once and then copied a lot. Copies from an ImageBitmap cost less than from a
// canvas (same pixels), so where the browser can make one right away that's what this returns
function sprite(width, height, draw) {
  if (typeof OffscreenCanvas !== "undefined") {
    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext("2d");
    if (ctx && canvas.transferToImageBitmap) {
      draw(ctx);
      return canvas.transferToImageBitmap();
    }
  }
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  draw(canvas.getContext("2d"));
  return canvas;
}

function perspective(x) {
  x = Math.min(1.316, x);
  return (3.325 * x) / (13.825 - 10.5 * x);
}

// Lane opacity by distance from the center, see-through in the middle
function laneAlphaAt(position) {
  if (position <= 0.1) return 0;
  if (position <= 0.25) return ((position - 0.1) / 0.15) * (0x60 / 255);
  if (position <= 0.75)
    return 0x60 / 255 + ((position - 0.25) / 0.5) * ((0xee - 0x60) / 255);
  return 0xee / 255;
}

// Options for how things look. Mirror and judgement timing change the song, the session has those
export function resolveSettings(options) {
  return {
    viewDistance: 3333.333 / ((option(options, 1, 5) + 10) * 0.1),
    mask: clamp(option(options, 2, 0), 0, 4),
    judgementPosition: option(options, 102, 0),
    judgementDetail: option(options, 103, 0) === 1,
    barlines: option(options, 105, 1) === 1,
    guidelineIntensity: clamp(option(options, 106, 5), 0, 5) / 5,
    thickness: clamp(option(options, 110, 3), 1, 5) - 1,
    scoreMinus: option(options, 116, 0) === 1,
    guidelineType: clamp(option(options, 118, 1), 0, 7),
    centerDisplay: option(options, 119, 1),
    keyBeam: option(options, 133, 1) === 1,
    slideInvert: option(options, 136, 0) === 1,
    touchEffectShoot: option(options, 138, 1) === 1,
    rNoteEffect: option(options, 139, 1) === 1,
    infoOpacity: clamp(option(options, 140, 5), 0, 5) / 5,
    touchEffectPop: option(options, 1006, POP_DEFAULT),
    // Three colors plus their dark versions
    ringColors: (
      waccaSymbolColors.find(
        (scheme) => scheme.id === option(options, 4, 103001)
      ) ?? waccaSymbolColors[0]
    ).colors,
    colors: {
      slideCW: paletteIndex(option(options, 201, 4), 4),
      slideCCW: paletteIndex(option(options, 202, 3), 3),
      snapIn: paletteIndex(option(options, 203, 1), 1),
      snapOut: paletteIndex(option(options, 204, 2), 2),
      touch: paletteIndex(option(options, 205, 5), 5),
      chain: paletteIndex(option(options, 206, 6), 6),
      hold: paletteIndex(option(options, 207, 7), 7)
    }
  };
}

export default class PlayfieldRenderer {
  // Draws the session it's given, whoever owns the session steps it. Text goes on textCanvas
  // if there is one, see createTextView
  constructor(canvas, session = new PlayfieldSession(), textCanvas = null) {
    this.canvas = canvas;
    this.session = session;
    // Not opaque, Firefox draws garbage behind the rounded corners otherwise
    this.ctx = canvas.getContext("2d");
    // Plain background, also used for masked lanes
    this.backgroundLayer = document.createElement("canvas");
    // Everything static under the notes, copied at the start of each frame
    this.baseLayer = document.createElement("canvas");
    this.ringTextLayer = document.createElement("canvas");
    // The ring score, only redrawn when it changes
    this.scoreLayer = document.createElement("canvas");
    this.scoreText = null;
    this.beamLayer = document.createElement("canvas");
    // Touch ring in its idle colors for the current mask
    this.ringIdleLayer = document.createElement("canvas");
    // For composing the judgement line, and the line with masked lanes cut out
    this.judgementLineLayer = document.createElement("canvas");
    this.judgementLineMaskedLayer = document.createElement("canvas");
    // Masked lanes once they've settled, see drawLaneMasks
    this.maskLayer = document.createElement("canvas");
    this.setChartInfo(null);

    this.settings = resolveSettings({});
    this.setFeatures({});
    // Canvas text doesn't redraw by itself once fonts arrive, so rebuild the text layers then
    this.fontsReady = Promise.all([
      document.fonts?.load(`40px ${JUDGEMENT_FONT}`),
      document.fonts?.load(`40px ${FONT}`),
      document.fonts?.load(`40px ${SCORE_FONT}`, "0123456789"),
      document.fonts?.load(`40px ${LABEL_FONT}`, "SCORE")
    ])
      .catch(() => {})
      .then(() => {
        this.dirtyText = true;
      });
    this.cache = new Map();
    // Full rebuild on resize, partial ones on option changes
    this.dirty = true;
    this.dirtyBackground = false;
    this.dirtyBase = false;
    this.dirtyThickness = false;

    this.beamUntil = new Float64Array(60);
    this.bonusSweeps = [];
    this.splashes = [];
    // When each lane's judgement line was last pressed
    this.lineFlash = new Float64Array(60).fill(-Infinity);
    // When each ring cell was last touched (lane * RING_ROWS + row)
    this.cellTouched = new Float64Array(60 * RING_ROWS).fill(-Infinity);
    // When each panel was last pressed, the white fades out after letting go
    this.cellPressed = new Float64Array(60 * RING_ROWS).fill(-Infinity);
    this.flashes = [];
    this.bubbles = [];
    this.shots = [];
    this.particles = [];
    for (let i = 0; i < MAX_PARTICLES; i++) {
      this.particles.push({ alive: false });
    }
    this.clearEffects();
    // Song time of the last frame drawn, for effects that go by how much time passed
    this.drawnTime = session.time;
    this.unsubscribe = session.subscribe((type, detail) =>
      this.onSessionEvent(type, detail)
    );

    // What's on screen this frame, see PlayfieldSession.visibleObjects
    this.visible = null;
    this.textWidths = new Map();
    this.text = textCanvas ? this.createTextView(textCanvas) : null;
  }

  // Text on its own canvas over this one: ring text, score, center display and judgements. It
  // only redraws when the text changes, not every frame, and can have its own resolution. It's
  // this renderer with its own canvas, sizes and caches, so the same text code draws it
  createTextView(canvas) {
    const view = Object.create(this);
    Object.assign(view, {
      canvas,
      ctx: canvas.getContext("2d"),
      ringTextLayer: document.createElement("canvas"),
      scoreLayer: document.createElement("canvas"),
      cache: new Map(),
      textWidths: new Map(),
      scoreText: null,
      textDirty: true,
      drawnKey: null
    });
    return view;
  }

  // Size of the text canvas, in device pixels
  resizeText(pixelSize) {
    const { text } = this;
    if (!text) return;
    const size = Math.max(1, Math.round(pixelSize));
    if (size === text.canvas.width) return;
    for (const layer of [text.canvas, text.ringTextLayer, text.scoreLayer]) {
      layer.width = size;
      layer.height = size;
    }
    text.textDirty = true;
  }

  // Everything the text shows, so it only redraws when that changes. Judgements animate while
  // popping in and fading out, so those frames always redraw
  textKey(now) {
    const { settings, session } = this;
    const { judgement } = session;
    let phase = "none";
    if (judgement) {
      const elapsed = now - judgement.start;
      phase =
        elapsed > 450
          ? "gone"
          : elapsed < 80 || elapsed > 350
            ? Math.round(elapsed)
            : "shown";
    }
    const { plus, minus } = session.score();
    return [
      plus,
      minus,
      session.combo,
      judgement?.kind,
      judgement?.detail,
      judgement?.start,
      phase,
      settings.centerDisplay,
      settings.scoreMinus,
      settings.infoOpacity,
      settings.judgementPosition,
      settings.judgementDetail
    ].join("|");
  }

  drawText(now) {
    const { text } = this;
    if (text.textDirty) {
      text.setGeometry(text.canvas.width);
      text.cache.clear();
      text.textWidths.clear();
      text.buildRingTextLayer();
      text.scoreText = null;
      text.drawnKey = null;
      text.textDirty = false;
    }
    const key = this.textKey(now);
    if (key === text.drawnKey) return;
    text.drawnKey = key;

    const { ctx } = text;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.clearRect(0, 0, text.size, text.size);
    text.drawHudText();
    text.drawJudgement(now);
  }

  // Stop listening to the session
  destroy() {
    this.unsubscribe();
  }

  // Effects for what happens in the session
  onSessionEvent(type, detail) {
    const { settings, session } = this;

    if (type === "reset") {
      this.clearEffects();
      this.drawnTime = session.time;
    } else if (type === "touch") {
      const { lane, row, spread, laneChanged } = detail;
      this.splashes.push({ lane, row, spread, start: session.time });
      if (laneChanged) this.flashLine(lane);
    } else if (type === "hit") {
      const { note } = detail;
      this.spawnTouchEffects(note.pos, note.size);

      if (note.rNote && settings.rNoteEffect) {
        this.rEffectStart = session.time;
        this.rEffectLane = note.pos + note.size / 2;
      }

      // Not tied to the bonus effect option, that only changes the gauge
      if (note.bonus && note.type.startsWith("slide")) {
        const { bpm } = session;
        this.bonusSweeps.push({
          start: session.time,
          duration: bpm >= 200 ? 480000 / bpm : 240000 / bpm,
          lane: note.pos + Math.floor(note.size / 2),
          counterclockwise: note.type === "slideCCW"
        });
      }
    } else if (type === "holdEnd") {
      const last = detail.note.points.at(-1);
      this.spawnTouchEffects(last.pos, last.size, false);
    }
  }

  // What the view shows besides the chart:
  //   ring: the console LEDs around the screen, without it the screen fills the canvas
  //   songCount: "1/3 Song" on the ring
  //   score: the ring score and its "SCORE" label
  //   progressBar: the clear gauge
  //   drawHiddenHolds: holds as they're judged (hidden points included) in red over the drawn
  //     ones, where they differ
  // Other keys are for the session and get ignored
  setFeatures(features) {
    const next = {
      ring: features.ring ?? true,
      songCount: features.songCount ?? true,
      score: features.score ?? true,
      progressBar: features.progressBar ?? true,
      drawHiddenHolds: features.drawHiddenHolds ?? false
    };
    const previous = this.features;
    this.features = next;
    if (!previous) return;
    if (next.ring !== previous.ring) this.dirty = true;
    if (next.songCount !== previous.songCount || next.score !== previous.score)
      this.dirtyText = true;
  }

  // Only rebuilds what changed so settings don't hitch
  setOptions(options) {
    const settings = resolveSettings(options);
    const previous = this.settings;
    this.settings = settings;

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
      this.scoreLayer,
      this.beamLayer,
      this.ringIdleLayer,
      this.judgementLineLayer,
      this.judgementLineMaskedLayer,
      this.maskLayer
    ]) {
      layer.width = size;
      layer.height = size;
    }
    this.dirty = true;
  }

  clearEffects() {
    this.beamUntil.fill(-Infinity);
    this.cellTouched.fill(-Infinity);
    this.cellPressed.fill(-Infinity);
    this.lineFlash.fill(-Infinity);
    this.bonusSweeps.length = 0;
    this.splashes.length = 0;
    this.flashes.length = 0;
    this.bubbles.length = 0;
    this.shots.length = 0;
    for (const particle of this.particles) particle.alive = false;
    this.rEffectStart = -Infinity;
  }

  // Input: pointer positions on the canvas go to the session as lane, radius and ring row

  laneAt(x, y) {
    this.applyPendingRebuilds();
    const angle = Math.atan2(y - this.cy, x - this.cx) / DEG;
    return mod60(Math.floor(-angle / 6));
  }

  // Radius as a fraction of the screen radius (R)
  radiusAt(x, y) {
    return Math.hypot(x - this.cx, y - this.cy) / this.R;
  }

  // Ring row under a finger. On the ring it's the row you're on. Inside it the screen reads like
  // a tunnel into the machine: the closer to the center, the deeper (more inner) the row. The curve
  // is exponential so the deep rows, which the view squeezes toward the center, get more room
  rowAt(radius) {
    const distance = radius * this.R;
    if (distance < this.ringInner) {
      const outward =
        (Math.exp((SCREEN_ROW_CURVE * distance) / this.ringInner) - 1) /
        (Math.exp(SCREEN_ROW_CURVE) - 1);
      return clamp(Math.floor(outward * RING_ROWS), 0, RING_ROWS - 1);
    }
    const rowHeight = (this.ringOuter - this.ringInner) / RING_ROWS;
    return clamp(
      Math.floor((distance - this.ringInner) / rowHeight),
      0,
      RING_ROWS - 1
    );
  }

  touchAt(x, y) {
    const radius = this.radiusAt(x, y);
    return [this.laneAt(x, y), radius, this.rowAt(radius)];
  }

  pointerDown(id, x, y) {
    this.session.pointerDown(id, ...this.touchAt(x, y));
  }

  pointerMove(id, x, y) {
    this.session.pointerMove(id, ...this.touchAt(x, y));
  }

  pointerUp(id) {
    this.session.pointerUp(id);
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
    if (this.dirtyText) {
      // Widths measured before the fonts were in are wrong
      this.textWidths.clear();
      if (this.text) this.text.textDirty = true;
      else this.buildRingTextLayer();
      this.scoreText = null;
    }

    this.dirtyBackground = false;
    this.dirtyRing = false;
    this.dirtyText = false;
    this.dirtyThickness = false;
    this.dirtyBase = false;
  }

  // Screen and ring sizes for a canvas size. Also run on the text view, at its size
  setGeometry(size) {
    const outer = size / 2;
    this.size = size;
    this.cx = outer;
    this.cy = outer;
    // No console: the screen grows to fill the canvas
    const layout = ringLayout(this.features.ring);
    this.ringOuter = outer * layout.ringOuter;
    this.ringInner = outer * layout.ringInner;
    this.screen = outer * layout.screen;
    this.Rj = outer * layout.Rj;
    this.R = outer * layout.R;
    this.s3 = (this.R * 2) / 1060;
    this.noteWidth = STROKE_WIDTHS[this.settings.thickness] * this.s3;
  }

  rebuild() {
    this.setGeometry(this.canvas.width);

    this.cache.clear();
    this.textWidths.clear();
    this.buildBackgroundLayer();
    this.buildBaseLayer();
    if (this.text) this.text.textDirty = true;
    else this.buildRingTextLayer();
    this.scoreText = null;
    this.buildBeamLayer();
    this.buildRingLayers();
    this.dirty = false;
    this.dirtyBackground = false;
    this.dirtyThickness = false;
    this.dirtyBase = false;
    this.dirtyRing = false;
    this.dirtyText = false;
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

    // The same background for masked lanes, with the dim mixed in so it's a single gradient.
    // Filling with that is way faster than with the layer as a pattern, and within 2/255 of it
    this.maskGradient = this.ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
    for (const [position, color] of BACKGROUND_STOPS) {
      const [r, g, b] = color.map((value) => value * (1 - dim));
      this.maskGradient.addColorStop(position, `rgb(${r}, ${g}, ${b})`);
    }
    this.maskLayerVersion = null;
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
      lanes.addColorStop(
        position,
        `rgba(${laneColor}, ${laneAlphaAt(position)})`
      );
    }
    ctx.fillStyle = lanes;
    ctx.fillRect(0, 0, this.size, this.size);

    this.drawGuidelines(ctx);

    // Judgement line: two color sweep, shaded across its width. The glow fades in inside it, and
    // outside fades out to a bit past the edge of the screen, where the canvas edge or the
    // console's margin cuts it off
    const width = (STROKE_WIDTHS[settings.thickness] + 2) * s3;
    const lineCtx = this.judgementLineLayer.getContext("2d");
    lineCtx.globalCompositeOperation = "source-over";
    lineCtx.clearRect(0, 0, this.size, this.size);

    const r = (offset) => Rj + width * offset;
    const inner = r(-0.875);
    const outer = Math.max(r(0.875), this.screen + width * 0.1875);
    const at = (radius) => (radius - inner) / (outer - inner);

    lineCtx.lineWidth = outer - inner;
    lineCtx.beginPath();
    lineCtx.arc(cx, cy, (inner + outer) / 2, 0, Math.PI * 2);

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

    ctx.drawImage(this.judgementLineLayer, 0, 0);

    // The outer glow is opaque: what's under it gets baked in, so it looks the same but covers
    // everything going past the line, like the solid part does. That's the base with the line
    // already on it, since the line gets drawn over it again every frame
    lineCtx.save();
    lineCtx.beginPath();
    lineCtx.arc(cx, cy, outer, 0, Math.PI * 2);
    lineCtx.arc(cx, cy, r(0.5) - 1, 0, Math.PI * 2, true);
    lineCtx.clip();
    lineCtx.globalCompositeOperation = "destination-over";
    lineCtx.drawImage(this.baseLayer, 0, 0);
    lineCtx.restore();
    lineCtx.globalCompositeOperation = "source-over";

    // Drawn again on top of the notes each frame (see drawJudgementLine)
    this.judgementLineBand = [inner, outer];
    // The only parts of the line's layers with anything on them
    this.lineRects = this.annulusRects(inner - 2, outer + 2);
    // Where the solid part of the line ends and only its glow is left
    this.judgementLineEdge = r(0.5);
    this.judgementLineWidth = width;
    this.lineMask = null;
  }

  // Judgement line on top of the notes, left out on masked lanes. Flashes white where
  // fingers land, holding doesn't keep it white
  drawJudgementLine(now) {
    const { ctx, cx, cy, Rj } = this;
    const { laneHidden } = this.session;
    // The line as a layer with the masked lanes cut out, only redone when the masks change.
    // Copying it is much cheaper than filling its lanes as paths every frame
    if (this.session.laneMaskVersion !== this.lineMask) {
      this.lineMask = this.session.laneMaskVersion;
      if (!laneHidden.includes(1)) {
        this.lineImage = this.judgementLineLayer;
      } else {
        // Only where the line is, the rest of both layers is empty
        const layer = this.judgementLineMaskedLayer.getContext("2d");
        const [inner, outer] = this.judgementLineBand;
        layer.globalCompositeOperation = "source-over";
        for (const [x, y, width, height] of this.lineRects) {
          layer.clearRect(x, y, width, height);
        }
        this.drawLayerRects(this.judgementLineLayer, this.lineRects, layer);
        // Cut out just the line's ring of each masked lane, erasing whole wedges from the center
        // is way slower. Anti-aliasing along the lane edges comes out a bit different
        layer.globalCompositeOperation = "destination-out";
        layer.beginPath();
        for (let lane = 0; lane < 60; lane++) {
          if (!laneHidden[lane]) continue;
          const start = -(lane + 1) * 6 * DEG;
          const end = -lane * 6 * DEG;
          layer.moveTo(
            cx + (outer + 1) * Math.cos(start),
            cy + (outer + 1) * Math.sin(start)
          );
          layer.arc(cx, cy, outer + 1, start, end);
          layer.arc(cx, cy, inner - 2, end, start, true);
          layer.closePath();
        }
        layer.fill();
        layer.globalCompositeOperation = "source-over";
        this.lineImage = this.judgementLineMaskedLayer;
      }
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    this.drawLayerRects(this.lineImage, this.lineRects);

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
  drawLayerRects(layer, rects, ctx = this.ctx) {
    for (const [x, y, width, height] of rects) {
      if (width > 0 && height > 0) {
        ctx.drawImage(layer, x, y, width, height, x, y, width, height);
      }
    }
  }

  // Whole pixel rects covering the ring between two radii (clipped to the canvas), so layers
  // that only have something on a ring get copied without all the empty space around it.
  // Horizontal bands, split in two where the hole in the middle reaches all the way across
  annulusRects(inner, outer) {
    const { cx, cy, size } = this;
    const bands = 32;
    const rects = [];
    for (let band = 0; band < bands; band++) {
      const top = Math.floor((band * size) / bands);
      const bottom = Math.floor(((band + 1) * size) / bands);
      if (bottom <= top) continue;
      // Closest to and farthest from the center anything in the band gets, vertically
      const near =
        top <= cy && bottom >= cy
          ? 0
          : Math.min(Math.abs(top - cy), Math.abs(bottom - cy));
      const far = Math.max(Math.abs(top - cy), Math.abs(bottom - cy));
      if (near >= outer) continue;

      const reach = Math.sqrt(outer * outer - near * near);
      const left = clamp(Math.floor(cx - reach), 0, size);
      const right = clamp(Math.ceil(cx + reach), 0, size);
      const hole = far < inner ? Math.sqrt(inner * inner - far * far) : 0;
      const holeLeft = clamp(Math.ceil(cx - hole), left, right);
      const holeRight = clamp(Math.floor(cx + hole), left, right);
      const height = bottom - top;
      if (holeRight <= holeLeft) {
        rects.push([left, top, right - left, height]);
      } else {
        rects.push([left, top, holeLeft - left, height]);
        rects.push([holeRight, top, right - holeRight, height]);
      }
    }
    return rects;
  }

  // Guidelines, part of the base layer
  drawGuidelines(ctx) {
    const { Rj, cx, cy, s3, settings } = this;
    if (settings.guidelineIntensity <= 0 || settings.guidelineType === 0)
      return;

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
      ctx.lineTo(
        cx + Rj * Math.cos(-i * 6 * DEG),
        cy + Rj * Math.sin(-i * 6 * DEG)
      );
    }
    ctx.stroke();
  }

  // Static ring text, laid out like an in-game screenshot
  buildRingTextLayer() {
    const ctx = this.ringTextLayer.getContext("2d");
    const { Rj } = this;
    const {
      baseline,
      count,
      countWord,
      label: scoreLabel,
      difficulty: diff,
      title
    } = RING_TEXT;
    const label = DIFFICULTY_LABELS[this.difficulty] ?? DIFFICULTY_LABELS[3];
    const at = (value) => Rj * value;
    ctx.clearRect(0, 0, this.size, this.size);

    const bounds = [];
    if (this.features.songCount) {
      bounds.push(
        // "1/₃ Song", the total is small and sits low
        this.drawArcRuns(
          ctx,
          [
            {
              text: "1",
              size: at(0.0472),
              family: FONT,
              color: count.color,
              pitch: at(count.pitch)
            },
            { text: "/", size: at(0.038), family: FONT, color: count.color },
            {
              text: "3",
              size: at(0.0228),
              family: FONT,
              color: count.color,
              pitch: at(0.0226),
              rise: at(-0.0085)
            }
          ],
          at(baseline),
          count.angle
        ),
        this.drawArcRuns(
          ctx,
          [
            {
              text: "Song",
              size: at(countWord.size),
              family: FONT,
              color: count.color,
              pitch: at(countWord.pitch)
            }
          ],
          at(baseline),
          countWord.angle
        )
      );
    }
    if (this.features.score) {
      bounds.push(
        this.drawArcRuns(
          ctx,
          [
            {
              text: "SCORE",
              size: at(scoreLabel.size),
              family: LABEL_FONT,
              color: scoreLabel.color
            }
          ],
          at(baseline),
          scoreLabel.angle,
          { align: "center" }
        )
      );
    }
    bounds.push(
      // Name, then a tighter "/Lv", then a bigger level number
      this.drawArcRuns(
        ctx,
        [
          {
            text: label.name,
            size: at(diff.size),
            family: FONT,
            color: label.color,
            pitch: at(diff.namePitch)
          },
          {
            text: "/Lv",
            size: at(diff.size),
            family: FONT,
            color: label.color,
            pitch: at(diff.levelPitch)
          },
          {
            text: ".",
            size: at(diff.size),
            family: FONT,
            color: label.color,
            pitch: at(diff.dotPitch)
          },
          {
            text: this.level,
            size: at(diff.digitSize),
            family: FONT,
            color: label.color
          }
        ],
        at(baseline),
        diff.angle
      ),
      // Titles are spread wide, long ones get squeezed to fit
      this.drawArcRuns(
        ctx,
        [
          {
            text: this.songTitle,
            size: at(title.size),
            family: FONT,
            color: title.color,
            pitch: at(title.pitch)
          }
        ],
        at(baseline),
        title.angle,
        { maxAngle: title.end - title.angle }
      )
    );

    // Only this part gets copied each frame
    const size = this.canvas.width;
    const left = Math.max(
      0,
      Math.floor(Math.min(...bounds.map((b) => b.left)))
    );
    const top = Math.max(0, Math.floor(Math.min(...bounds.map((b) => b.top))));
    const right = Math.min(
      size,
      Math.ceil(Math.max(...bounds.map((b) => b.right)))
    );
    const bottom = Math.min(
      size,
      Math.ceil(Math.max(...bounds.map((b) => b.bottom)))
    );
    this.ringTextRects = [[left, top, right - left, bottom - top]];
  }

  // Song title and difficulty on the ring. Null is the demo: random title, expert 12.
  // Difficulty is 1-4 (normal to inferno), level is the text after "Lv."
  setChartInfo(info) {
    const { title, difficulty, level } = info ?? {
      ...DEMO_LABEL,
      title: SONG_TITLES[Math.floor(Math.random() * SONG_TITLES.length)]
    };
    if (
      title === this.songTitle &&
      difficulty === this.difficulty &&
      level === this.level
    )
      return;
    this.songTitle = title;
    this.difficulty = difficulty;
    this.level = level;
    this.dirtyText = true;
  }

  // Effects

  flashLine(lane) {
    for (let d = -1; d <= 1; d++)
      this.lineFlash[mod60(lane + d)] = this.session.time;
  }

  lightLanes(pos, size) {
    for (let i = 0; i < size; i++) {
      const lane = mod60(pos + i);
      this.beamUntil[lane] = Math.max(this.beamUntil[lane], this.session.time);
    }
  }

  // Key beams only light where fingers are, not the whole note
  updateKeyBeams() {
    for (const { lane, spread } of this.session.fingers.values()) {
      this.lightLanes(lane - 1, spread.lanes + 2);
    }
  }

  spawnTouchEffects(pos, size, shoot = true) {
    const { settings } = this;
    const now = this.session.time;

    if (settings.touchEffectPop === POP_DEFAULT) {
      this.flashes.push({ start: now, pos, size });

      // Sparkles are part of the default pop, not the shoot
      const count = Math.min(40, size * 3);
      for (let i = 0; i < count; i++) {
        const roll = Math.random();
        const kind = roll < 0.35 ? "triangle" : roll < 0.8 ? "dot" : "streak";
        this.spawnParticle(
          kind,
          pos + Math.random() * size,
          0.35 + Math.random() * 0.65
        );
      }
    } else if (settings.touchEffectPop === POP_BUBBLE) {
      // One bubble per hit lane
      for (let i = 0; i < size; i++) {
        this.bubbles.push({ start: now, angle: -(pos + i + 0.5) * 6 * DEG });
      }
      if (this.bubbles.length > MAX_BUBBLES) {
        this.bubbles.splice(0, this.bubbles.length - MAX_BUBBLES);
      }
    }

    if (settings.touchEffectShoot && shoot) {
      this.shots.push({ start: now, pos, size });
    }
  }

  // Held holds grind dashes off the judgement line
  updateGrind(dt) {
    const { session } = this;
    for (const { note, base, held } of session.activeHolds) {
      if (held === false) continue;
      const shape = session.holdShapeAt(note, session.time - base);
      this.grindCarry =
        (this.grindCarry ?? 0) + dt * shape.size * GRIND_PER_LANE_MS;

      while (this.grindCarry >= 1) {
        this.grindCarry--;
        this.spawnParticle(
          "grind",
          shape.pos + Math.random() * shape.size,
          0.86 + Math.random() * 0.1
        );
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
    particle.start = this.session.time;
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
        kind === "triangle" || Math.random() < 0.3
          ? SPARKLE_WHITE
          : SPARKLE_YELLOW;
    }
  }

  // Drawing

  // Draw the session as it is now. Step it first, this only catches effects up
  draw() {
    const { ctx, settings } = this;
    const now = this.session.time;

    this.applyPendingRebuilds();
    this.updateKeyBeams();
    // Could be drawn more than once per step, or after a seek
    this.updateGrind(clamp(now - this.drawnTime, 0, 100));
    this.drawnTime = now;

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
    this.drawLaneMasks();
    if (settings.keyBeam) this.drawKeyBeams(now);

    this.visible = this.session.visibleObjects(settings.viewDistance, {
      barlines: settings.barlines
    });
    // Nothing's cut off at the judgement line: everything goes on under it out to the edge,
    // where its opaque outer glow covers it
    for (const hold of this.visible.holds)
      this.drawHoldSurface(hold.note, hold.base, now, hold.missed, hold.active);
    if (this.features.drawHiddenHolds) {
      for (const hold of this.visible.holds) {
        const hidden = this.session.hiddenHoldView(hold.note);
        if (hidden)
          this.drawHoldSurface(hidden, hold.base, now, false, 0, true);
      }
    }
    this.drawObjects();

    // Hold glow under the judgement line, the line stays pink while holding
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = "lighter";
    this.drawGrindGlow();
    ctx.globalCompositeOperation = "source-over";
    this.drawJudgementLine(now);
    // Outside the line the beam is solid white over the line's glow, like in game
    if (settings.keyBeam) this.drawKeyBeams(now, this.judgementLineEdge);
    // Bonus sweeps light whole lanes out to the screen edge, the ring covers what's under it
    this.drawBonusSweeps(now);
    if (this.features.ring) this.drawRing(now);
    // Hit effects over the ring, so it doesn't cut off the parts that reach past the line
    this.drawTouchEffects(now);
    this.drawInterface();
    if (!this.text) this.drawJudgement(now);
    if (this.text) this.drawText(now);
  }

  // Masked lanes show the plain background. Filling big wedges is slow, so once the masks settle
  // they're filled once into a layer, and copying that is way cheaper. While they're changing
  // (sweeping) that would just be extra work, so they get filled directly
  drawLaneMasks() {
    const { laneHidden, laneMaskVersion } = this.session;
    if (!laneHidden.includes(1)) return;

    if (laneMaskVersion !== this.maskSeen) {
      this.maskSeen = laneMaskVersion;
      this.fillLaneMasks(this.ctx);
      return;
    }
    if (laneMaskVersion !== this.maskLayerVersion) {
      this.maskLayerVersion = laneMaskVersion;
      const layer = this.maskLayer.getContext("2d");
      layer.clearRect(0, 0, this.size, this.size);
      this.fillLaneMasks(layer);
      this.maskRects = this.laneMaskRects();
    }
    this.drawLayerRects(this.maskLayer, this.maskRects);
  }

  // Bounding boxes of the runs of masked lanes, where the mask layer has something on it
  laneMaskRects() {
    const { cx, cy, R, size } = this;
    const { laneHidden } = this.session;
    const rects = [];
    const box = (from, to) => {
      // From lane `from` counterclockwise through lane `to`, like fillLaneMasks' wedges
      const start = -(to + 1) * 6 - 0.1;
      const end = -from * 6 + 0.1;
      let [left, top, right, bottom] = [cx, cy, cx, cy];
      const add = (degrees) => {
        const x = cx + R * Math.cos(degrees * DEG);
        const y = cy + R * Math.sin(degrees * DEG);
        left = Math.min(left, x);
        top = Math.min(top, y);
        right = Math.max(right, x);
        bottom = Math.max(bottom, y);
      };
      add(start);
      add(end);
      // Where the arc passes the circle's left, right, top and bottom
      for (let d = Math.ceil(start / 90) * 90; d < end; d += 90) add(d);
      const x = clamp(Math.floor(left) - 2, 0, size);
      const y = clamp(Math.floor(top) - 2, 0, size);
      rects.push([
        x,
        y,
        clamp(Math.ceil(right) + 2, 0, size) - x,
        clamp(Math.ceil(bottom) + 2, 0, size) - y
      ]);
    };

    if (!laneHidden.includes(0)) {
      box(0, 59);
      return rects;
    }
    // Start right after an open lane so runs don't wrap around the start
    const first = laneHidden.indexOf(0);
    let runStart = null;
    for (let i = 1; i <= 60; i++) {
      const lane = first + i;
      const hidden = laneHidden[mod60(lane)] === 1;
      if (hidden && runStart === null) runStart = lane;
      if (!hidden && runStart !== null) {
        box(runStart, lane - 1);
        runStart = null;
      }
    }
    return rects;
  }

  fillLaneMasks(ctx) {
    const { cx, cy, R } = this;
    const { laneHidden } = this.session;

    ctx.beginPath();
    for (let lane = 0; lane < 60; lane++) {
      if (!laneHidden[lane]) continue;
      ctx.moveTo(cx, cy);
      ctx.arc(
        cx,
        cy,
        R,
        (-(lane + 1) * 6 - 0.1) * DEG,
        (-lane * 6 + 0.1) * DEG
      );
      ctx.closePath();
    }
    ctx.fillStyle = this.maskGradient;
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
    const headroom = Math.max(
      ...a.map((value, i) => (b[i] - value) / (255 - value))
    );

    // Even stripes get the second color
    for (let i = 0; i < stripes; i += 2) {
      const inner = clamp(perspective((i - 1) * interval + offset), 0, 1);
      const outer = clamp(perspective(i * interval + offset), 0, 1);
      const alpha = laneAlphaAt((inner + outer) / 2);
      if (outer <= inner || alpha <= 0) continue;

      const steps = Math.ceil(alpha * headroom * 255);
      const opacity = steps / 255;
      const [red, green, blue] = a.map((value, j) =>
        Math.round(value + (alpha * (b[j] - value)) / opacity)
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
    // What the LED shows for the mix, see ledColor
    const mix = (a, b, t) =>
      `rgb(${ledColor(a.map((value, i) => value + (b[i] - value) * t))})`;
    const white = [255, 255, 255];

    const gradient = ctx.createRadialGradient(
      cx,
      cy,
      ringInner,
      cx,
      cy,
      ringOuter
    );
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
      Array.from({ length: RING_ROWS }, (_, row) =>
        this.ringCellsPath([lane], [row])
      )
    );

    this.ringSprites = this.buildCellSprites();
    this.ringMask = null;
  }

  // Every ring cell drawn once as a small sprite, lit (third color) and white. Lighting cells
  // each frame is then a few small copies instead of filling curved paths, which is slow
  buildCellSprites() {
    const { cx, cy, ringInner, ringOuter } = this;
    const rowHeight = (ringOuter - ringInner) / RING_ROWS;

    // Where each cell sits on the canvas, in whole pixels so the copies land exactly
    const boxes = [];
    let slotWidth = 0;
    let slotHeight = 0;
    for (let lane = 0; lane < 60; lane++) {
      for (let row = 0; row < RING_ROWS; row++) {
        let [left, top, right, bottom] = [
          Infinity,
          Infinity,
          -Infinity,
          -Infinity
        ];
        for (let step = 0; step <= 6; step++) {
          const angle = -(lane + step / 6) * 6 * DEG;
          for (const radius of [
            ringInner + row * rowHeight,
            ringInner + (row + 1) * rowHeight
          ]) {
            const x = cx + radius * Math.cos(angle);
            const y = cy + radius * Math.sin(angle);
            left = Math.min(left, x);
            top = Math.min(top, y);
            right = Math.max(right, x);
            bottom = Math.max(bottom, y);
          }
        }
        const x = Math.floor(left) - 1;
        const y = Math.floor(top) - 1;
        const box = [x, y, Math.ceil(right) + 1 - x, Math.ceil(bottom) + 1 - y];
        boxes.push(box);
        slotWidth = Math.max(slotWidth, box[2]);
        slotHeight = Math.max(slotHeight, box[3]);
      }
    }

    // One sheet per look, cells in a grid of slots
    const columns = 16;
    const sheet = (fill) =>
      sprite(
        columns * slotWidth,
        Math.ceil(boxes.length / columns) * slotHeight,
        (ctx) => {
          const style = fill(ctx);
          boxes.forEach(([x, y], cell) => {
            ctx.setTransform(
              1,
              0,
              0,
              1,
              (cell % columns) * slotWidth - x,
              Math.floor(cell / columns) * slotHeight - y
            );
            ctx.fillStyle = style;
            ctx.fill(
              this.ringCellPaths[Math.floor(cell / RING_ROWS)][cell % RING_ROWS]
            );
          });
        }
      );

    return {
      boxes,
      slotWidth,
      slotHeight,
      columns,
      lit: sheet((ctx) => this.ringGradient(ctx, 2)),
      white: sheet(() => "#ffffff")
    };
  }

  // One cell (lane * RING_ROWS + row) from a sprite sheet, at some opacity
  drawRingCell(cell, sheet, alpha) {
    const { boxes, slotWidth, slotHeight, columns } = this.ringSprites;
    const [x, y, width, height] = boxes[cell];
    this.ctx.globalAlpha = alpha;
    this.ctx.drawImage(
      sheet,
      (cell % columns) * slotWidth,
      Math.floor(cell / columns) * slotHeight,
      width,
      height,
      x,
      y,
      width,
      height
    );
  }

  // Cells at their brightness (0-1)
  drawRingCells(values, sheet) {
    for (let cell = 0; cell < values.length; cell++) {
      if (values[cell] > 0.01)
        this.drawRingCell(cell, sheet, Math.min(1, values[cell]));
    }
    this.ctx.globalAlpha = 1;
  }

  // Idle ring: masked lanes in the first color, open ones in the second (official
  // tutorial video). Only redrawn when the mask changes
  updateRingIdle() {
    if (this.session.laneMaskVersion === this.ringMask) return;
    this.ringMask = this.session.laneMaskVersion;

    const { cx, cy, size } = this;
    const { laneHidden } = this.session;
    const ctx = this.ringIdleLayer.getContext("2d");
    ctx.clearRect(0, 0, size, size);
    // Black margin around the screen and the seams, out to the canvas edge
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(cx, cy, size / 2, 0, Math.PI * 2);
    ctx.arc(cx, cy, this.screen, 0, Math.PI * 2, true);
    ctx.fill();

    const open = [];
    const masked = [];
    for (let lane = 0; lane < 60; lane++)
      (laneHidden[lane] ? masked : open).push(lane);
    for (const [lanes, index] of [
      [open, 1],
      [masked, 0]
    ]) {
      if (lanes.length === 0) continue;
      ctx.fillStyle = this.ringGradient(ctx, index);
      ctx.fill(
        lanes.length === 60 ? this.ringAllCells : this.ringCellsPath(lanes)
      );
    }
  }

  drawRing(now) {
    const { ctx, cx, cy, ringInner, ringOuter } = this;
    ctx.globalAlpha = 1;

    // Idle ring out to the canvas edge, covers anything flying past the screen. The layer is
    // see-through inside the ring, so copying all of it is the same as filling the ring with it
    this.updateRingIdle();
    ctx.drawImage(this.ringIdleLayer, 0, 0);

    // Pulses with the beat
    const beatMs = 60000 / this.session.bpm;
    const sinceBeat = ((now % beatMs) + beatMs) % beatMs;
    const dim = BEAT_DIM * (1 - Math.exp(-sinceBeat / 140));
    if (dim > 0.01) {
      ctx.fillStyle = `rgba(0, 0, 0, ${dim})`;
      ctx.beginPath();
      ctx.arc(cx, cy, ringOuter, 0, Math.PI * 2);
      ctx.arc(cx, cy, ringInner, 0, Math.PI * 2, true);
      ctx.fill();
    }

    // Held holds light their whole width in the third color (the only thing that uses it,
    // touches are just white)
    const touchLane = (lane) => {
      for (let row = 0; row < RING_ROWS; row++)
        this.cellTouched[mod60(lane) * RING_ROWS + row] = now;
    };
    for (const { note, base, held } of this.session.activeHolds) {
      if (!held) continue;
      const shape = this.session.holdShapeAt(note, now - base);
      const start = Math.round(shape.pos);
      for (let i = 0; i < Math.round(shape.size); i++) touchLane(start + i);
    }
    const touched =
      this.ringCellLight ??
      (this.ringCellLight = new Float32Array(60 * RING_ROWS));
    for (let cell = 0; cell < touched.length; cell++) {
      touched[cell] = clamp(
        1 - (now - this.cellTouched[cell]) / RING_TOUCH_FADE_MS,
        0,
        1
      );
    }
    this.drawRingCells(touched, this.ringSprites.lit);

    this.drawRingREffect(now);

    // Splashes: white on the touched cell, a glow right around it, and a fainter ring spreading out
    const white =
      this.ringCellWhite ??
      (this.ringCellWhite = new Float32Array(60 * RING_ROWS));
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
      const { lanes = 1, rows = 1 } = splash.spread ?? {};
      const first = this.session.patchRow(splash.row, rows);
      // Far enough for the wave and for the glow on both sides of the patch
      const glow = Math.ceil(1 + SPLASH_HALO_FALLOFF);
      const reach = Math.ceil(front + 1.5);
      for (
        let d = -Math.max(reach, glow);
        d <= Math.max(reach, lanes - 1 + glow);
        d++
      ) {
        for (let row = 0; row < RING_ROWS; row++) {
          // Distance in lane widths
          const distance = Math.hypot(
            d,
            ((row - splash.row) * rowHeight) / laneWidth
          );
          const inPatch =
            d >= 0 && d < lanes && row >= first && row < first + rows;
          // Solid white only on the pressed panels, rows are too short to go by distance
          const core = inPatch ? SPLASH_CORE_OPACITY * fade * fade : 0;
          // Halo: bright right next to the patch, by distance from its edge
          const laneGap = d < 0 ? -d : Math.max(0, d - lanes + 1);
          const rowGap =
            row < first ? first - row : Math.max(0, row - (first + rows - 1));
          const edge = Math.hypot(laneGap, (rowGap * rowHeight) / laneWidth);
          const halo = inPatch
            ? 0
            : SPLASH_HALO_OPACITY *
              fade *
              fade *
              clamp(1 - (edge - 1) / SPLASH_HALO_FALLOFF, 0, 1);
          const wave =
            SPLASH_WAVE_OPACITY *
            fade *
            Math.max(0, 1 - Math.abs(distance - front) / 1.2);
          const cell = mod60(splash.lane + d) * RING_ROWS + row;
          white[cell] = Math.max(white[cell], core, halo, wave);
        }
      }
    }
    // Pressed panels stay white while held, then fade out after letting go
    for (const finger of this.session.fingers.values()) {
      this.session.eachFingerCell(finger, (lane, row) => {
        this.cellPressed[lane * RING_ROWS + row] = now;
      });
    }
    for (let cell = 0; cell < white.length; cell++) {
      const since = now - this.cellPressed[cell];
      if (since < RELEASE_FADE_MS) {
        white[cell] = Math.max(
          white[cell],
          SPLASH_CORE_OPACITY * (1 - since / RELEASE_FADE_MS)
        );
      }
    }
    this.drawRingCells(white, this.ringSprites.white);
  }

  // Rainbow around the whole ring after an R note
  drawRingREffect(now) {
    const elapsed = now - this.rEffectStart;
    if (elapsed < 0 || elapsed > RING_R_MS || !this.ctx.createConicGradient)
      return;

    const { ctx, cx, cy } = this;

    // Turns about 45° early on, then holds
    const turn = 1 - Math.pow(1 - Math.min(1, elapsed / 300), 3);
    const start = (-this.rEffectLane * 6 + 135 + turn * 45) * DEG;
    const gradient = ctx.createConicGradient(start, cx, cy);
    for (let i = 0; i <= 6; i++)
      gradient.addColorStop(i / 6, `hsl(${i * 60}, 100%, 58%)`);

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
    for (const direction of [-1, 1]) {
      for (let row = 0; row < RING_ROWS; row++) {
        const distance = travelled - (RING_ROWS - 1 - row) * RING_R_SWEEP_SLANT;
        // Each line stops half way around, where it meets the other one
        if (distance < 0 || distance > 31) continue;
        const center = this.rEffectLane + direction * distance;
        const reach = Math.ceil(RING_R_SWEEP_WIDTH + 1);
        for (let d = -reach; d <= reach; d++) {
          const lane = Math.round(center) + d;
          const strength = clamp(
            RING_R_SWEEP_WIDTH + 0.5 - Math.abs(lane - center),
            0,
            1
          );
          if (strength <= 0) continue;
          this.drawRingCell(
            mod60(lane) * RING_ROWS + row,
            this.ringSprites.white,
            strength * fade
          );
        }
      }
    }
    ctx.globalAlpha = 1;
  }

  // Pre-rendered key beam light for all lanes
  buildBeamLayer() {
    const ctx = this.beamLayer.getContext("2d");
    const { cx, cy, R, Rj } = this;
    ctx.clearRect(0, 0, this.size, this.size);

    const inner = Rj * KEY_BEAM_STOPS[0][0];
    const gradient = ctx.createRadialGradient(cx, cy, inner, cx, cy, R);
    for (const [radius, alpha] of KEY_BEAM_STOPS) {
      gradient.addColorStop(
        (Rj * radius - inner) / (R - inner),
        `rgba(255, 255, 255, ${alpha})`
      );
    }
    gradient.addColorStop(1, "rgba(255, 255, 255, 1)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.arc(cx, cy, inner, 0, Math.PI * 2, true);
    ctx.fill();

    this.beamPattern = this.ctx.createPattern(this.beamLayer, "no-repeat");
  }

  // Lit lanes grouped by brightness, one pattern fill per group.
  // With an inner radius, only the part of the beams outside it
  drawKeyBeams(now, inner = 0) {
    const { ctx, cx, cy, R } = this;
    const levels = 12;
    const groups =
      this.beamGroups ??
      (this.beamGroups = Array.from({ length: levels }, () => []));
    for (const group of groups) group.length = 0;

    for (let lane = 0; lane < 60; lane++) {
      if (this.session.laneHidden[lane]) continue;
      const until = this.beamUntil[lane];
      const intensity =
        now <= until
          ? 1
          : KEY_BEAM_FADE_MS > 0
            ? 1 - (now - until) / KEY_BEAM_FADE_MS
            : 0;
      if (intensity <= 0) continue;
      groups[Math.min(levels - 1, Math.floor(intensity * levels))].push(lane);
    }

    for (let level = 0; level < levels; level++) {
      const lanes = groups[level];
      if (lanes.length === 0) continue;

      ctx.beginPath();
      for (const lane of lanes) {
        // Slight overlap so there's no seams
        const start = (-(lane + 1) * 6 - 0.2) * DEG;
        const end = (-lane * 6 + 0.2) * DEG;
        if (inner > 0) {
          ctx.moveTo(cx + R * Math.cos(start), cy + R * Math.sin(start));
          ctx.arc(cx, cy, R, start, end);
          ctx.arc(cx, cy, inner, end, start, true);
        } else {
          ctx.moveTo(cx, cy);
          ctx.arc(cx, cy, R, start, end);
        }
        ctx.closePath();
      }
      ctx.globalAlpha = (level + 1) / levels;
      ctx.fillStyle = this.beamPattern;
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  // Everything in depth order (notes, sync connectors, measure lines)
  drawObjects() {
    // Far stuff first, lines under notes, big notes under small ones
    const { sorted } = this.visible;

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
  drawNotePreview(type, colorIndex, slideInvert = false) {
    this.resize(480);
    this.applyPendingRebuilds();
    this.settings.colors = { ...this.settings.colors, [type]: colorIndex };
    this.settings.slideInvert = slideInvert;
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
    const note = {
      type,
      pos,
      size,
      time: 0,
      rNote: false,
      bonus: false,
      sync: false
    };
    if (type === "hold") {
      const end = this.settings.viewDistance * 0.1;
      note.endTime = end;
      note.points = [
        { time: 0, pos, size },
        { time: end, pos, size }
      ];
      this.drawHoldSurface(note, 0, 0, false);
    }
    this.setScale(1);
    this.drawNote(note, 1);
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    const crop = document.createElement("canvas");
    crop.width = Math.round(width);
    crop.height = Math.round(height);
    crop
      .getContext("2d")
      .drawImage(
        this.canvas,
        left,
        top,
        width,
        height,
        0,
        0,
        crop.width,
        crop.height
      );
    return crop.toDataURL();
  }

  // Scale judgement line sized drawing down to the perspective scale
  setScale(scale) {
    this.ctx.setTransform(
      scale,
      0,
      0,
      scale,
      this.cx * (1 - scale),
      this.cy * (1 - scale)
    );
  }

  pointAt(radius, angle) {
    return [
      this.cx + radius * Math.cos(angle * DEG),
      this.cy + radius * Math.sin(angle * DEG)
    ];
  }

  // Arc in degrees, negative sweep goes counterclockwise
  arc(path, radius, start, sweep, newSubpath = false) {
    if (newSubpath) path.moveTo(...this.pointAt(radius, start));
    path.arc(
      this.cx,
      this.cy,
      radius,
      start * DEG,
      (start + sweep) * DEG,
      sweep < 0
    );
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
      const [p1, p2, p3, p4, p5] =
        BODY_GRADIENT_POSITIONS[this.settings.thickness];
      return this.bandGradient(
        [
          [-0.1, colors.light],
          [p1, colors.base],
          [p2, colors.dark],
          [p3, colors.dark],
          [p4, colors.base],
          [p5, colors.base],
          [1.1, colors.light]
        ],
        this.noteWidth,
        0.1
      );
    });
  }

  drawNote(note, progress) {
    const { ctx, settings, Rj, s3, noteWidth } = this;
    const colorIndex = settings.colors[note.type];
    const { pos, size } = note;
    const full = size === 60;

    if (note.rNote && this.drawRGlow(note)) {
      // Drawn from a blurred sprite
    } else if (note.rNote) {
      // No canvas blur in this browser: a gradient across the note instead
      const glow = this.cached("rGlow", () =>
        this.bandGradient(
          [
            [0, "rgba(255, 255, 192, 0)"],
            [0.3, "rgba(255, 255, 192, 0.5)"],
            [0.5, "rgba(255, 255, 192, 0.95)"],
            [0.7, "rgba(255, 255, 192, 0.5)"],
            [1, "rgba(255, 255, 192, 0)"]
          ],
          70 * s3
        )
      );
      ctx.globalCompositeOperation = "lighter";
      ctx.strokeStyle = glow;
      ctx.lineWidth = 70 * s3;
      ctx.beginPath();
      if (full) ctx.arc(this.cx, this.cy, Rj, 0, Math.PI * 2);
      else
        this.arc(ctx, Rj, (pos + 1) * -6 + 3, Math.min(0, (size - 2) * -6) - 6);
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
          [0.95, capColors.light]
        ])
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

  // R notes glow like SaturnView: a 70 wide stroke in #ffffc0, blurred by 10, added on top of
  // what's under it, half a lane longer than the note on both ends. Blurring each frame is slow,
  // so the glow is blurred once per note size into a sprite and turned into place. Returns false
  // when the browser can't blur on a canvas
  drawRGlow(note) {
    const { ctx, cx, cy, Rj, s3 } = this;
    const full = note.size >= 60;
    const sprite = this.cached(`rGlowSprite${full ? 60 : note.size}`, () => {
      const canvas = document.createElement("canvas");
      const layer = canvas.getContext("2d");
      if (typeof layer.filter !== "string") return null;

      // Glow for this size starting at lane 0, in a box around it (blur reaches ~3x its radius)
      const reach = (35 + 30) * s3;
      const start = -6 + 3;
      const sweep = Math.min(0, (note.size - 2) * -6) - 6;
      let [left, top, right, bottom] = [
        Infinity,
        Infinity,
        -Infinity,
        -Infinity
      ];
      const steps = full ? 64 : Math.max(2, Math.ceil(-sweep / 3));
      for (let step = 0; step <= steps; step++) {
        const angle =
          (full ? (step / steps) * 360 : start + (sweep * step) / steps) * DEG;
        for (const radius of [Rj - reach, Rj + reach]) {
          left = Math.min(left, cx + radius * Math.cos(angle));
          right = Math.max(right, cx + radius * Math.cos(angle));
          top = Math.min(top, cy + radius * Math.sin(angle));
          bottom = Math.max(bottom, cy + radius * Math.sin(angle));
        }
      }
      const x = Math.floor(left - reach);
      const y = Math.floor(top - reach);
      canvas.width = Math.ceil(right + reach) - x;
      canvas.height = Math.ceil(bottom + reach) - y;

      layer.filter = `blur(${10 * s3}px)`;
      layer.strokeStyle = "#ffffc0";
      layer.lineWidth = 70 * s3;
      layer.translate(-x, -y);
      layer.beginPath();
      if (full) layer.arc(cx, cy, Rj, 0, Math.PI * 2);
      else this.arc(layer, Rj, start, sweep, true);
      layer.stroke();
      return { canvas, x, y };
    });
    if (!sprite) return false;

    // The transform already scales it to the note's depth, turn it to the note's lanes
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    if (!full) {
      ctx.translate(cx, cy);
      ctx.rotate(-note.pos * 6 * DEG);
      ctx.translate(-cx, -cy);
    }
    ctx.drawImage(sprite.canvas, sprite.x, sprite.y);
    ctx.restore();
    return true;
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
      p.quadraticCurveTo(
        ...this.pointAt(Rj, end + 0.25),
        ...this.pointAt(r3, end + 2.5)
      );
      this.arc(p, r3, end + 2.5, -sweep - 5);
      p.quadraticCurveTo(
        ...this.pointAt(Rj, start - 0.25),
        ...this.pointAt(r0, start - 2.5)
      );
      p.closePath();

      this.arc(p, r1, end + 2.55, -sweep - 5.1, true);
      p.quadraticCurveTo(
        ...this.pointAt(Rj, start - 1.1),
        ...this.pointAt(r2, start - 2.55)
      );
      this.arc(p, r2, start - 2.55, sweep + 5.1);
      p.quadraticCurveTo(
        ...this.pointAt(Rj, end + 1.1),
        ...this.pointAt(r1, end + 2.55)
      );
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
          [0.95, syncColors.light]
        ],
        10 * s3
      )
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
          [1.1, colors.light]
        ],
        this.noteWidth,
        0.1
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
      const gradient = ctx.createRadialGradient(
        cx,
        cy,
        Rj * 0.73,
        cx,
        cy,
        Rj * 0.9
      );
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

    const mask = this.cached(
      `slideMask${pos}|${size}|${counterclockwise}`,
      () => {
        const arrowMask = (x) =>
          x < 0.88 ? (0.653 * x + 0.175) / 0.75 : (-6.25 * x + 6.25) / 0.75;
        const along = (i) => (counterclockwise ? i / size : 1 - i / size);

        const p = new Path2D();
        for (let i = 0; i <= size; i++) {
          const point = this.pointAt(
            r1 + (r2 - r1) * arrowMask(along(i)),
            startAngle - i * 6
          );
          if (i === 0) p.moveTo(...point);
          else p.lineTo(...point);
        }
        p.lineTo(...this.pointAt(r1, startAngle - size * 6));
        for (let i = size; i >= 0; i--) {
          p.lineTo(
            ...this.pointAt(
              r1 + (r0 - r1) * arrowMask(along(i)),
              startAngle - i * 6
            )
          );
        }
        p.closePath();
        return p;
      }
    );

    const scroll = counterclockwise
      ? 1 - ((progress * 6) % 1)
      : (progress * 6) % 1;
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
    ctx.fillStyle = this.cached(
      `slideFill${colorIndex}|${pos}|${size}|${flipColors}`,
      () => {
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
      }
    );
    ctx.fill();
    ctx.strokeStyle = colors.dark;
    ctx.lineWidth = 5 * s3;
    ctx.stroke();
    ctx.restore();
  }

  // red: the hold as it's judged, flat red (drawHiddenHolds)
  drawHoldSurface(note, base, now, missed, active = 0, red = false) {
    const { ctx, cx, cy, Rj, R, settings } = this;
    const view = settings.viewDistance;
    const startTime = base + note.time;
    const endTime = base + note.endTime;

    // Holds go on past the judgement line out to the edge, like everything else
    const from = this.session.holdShownFrom(note, base, view);
    if (from === null) return;
    const nowScaled = this.session.scaledAt(now);

    // Cut off where it leaves the view (in scrolled distance, so speed changes count)
    let to = endTime;
    if (this.session.scaledAt(to) - nowScaled > view) {
      let low = from;
      for (let i = 0; i < 20; i++) {
        const middle = (low + to) / 2;
        if (this.session.scaledAt(middle) - nowScaled > view) to = middle;
        else low = middle;
      }
    }
    if (from >= to) return;

    const radiusAt = (t) =>
      Rj *
      perspective(
        clamp(1 - (this.session.scaledAt(t) - nowScaled) / view, 0, PAST_LINE)
      );
    // Vertices at the hold's own points, plus every 20ms between them (4 steps on straight
    // parts), and at least once per lane an edge moves, see PlayfieldSession.holdSamples.
    // Straight lines between far apart vertices would cut across the circle
    const samples = this.session.holdSamples(note, base, from, to);

    const edgeA = [];
    const edgeB = [];
    for (const [t, pos, size] of samples) {
      const radius = radiusAt(t);
      const full = size >= 60;
      const a = full ? pos * -6 : pos * -6 - 4.2;
      const b = full ? a - 360 : (pos + size) * -6 + 4.2;
      edgeA.push([radius, a]);
      edgeB.push([radius, b]);
    }

    // Outline: along one edge, across the far end, back along the other edge
    const last = samples.length - 1;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.beginPath();
    ctx.moveTo(...this.pointAt(...edgeA[0]));
    for (let i = 1; i <= last; i++) ctx.lineTo(...this.pointAt(...edgeA[i]));
    this.arc(
      ctx,
      edgeA[last][0],
      edgeA[last][1],
      edgeB[last][1] - edgeA[last][1]
    );
    for (let i = last; i >= 0; i--) ctx.lineTo(...this.pointAt(...edgeB[i]));
    this.arc(ctx, edgeA[0][0], edgeB[0][1], edgeA[0][1] - edgeB[0][1]);
    ctx.closePath();

    // Color runs along the hold, radial gradient maps it onto the screen.
    // Active colors while it's held, see PlayfieldSession.visibleObjects
    const colors = missed
      ? missedHoldColors
      : holdColorsAt(settings.colors.hold, active);
    const duration = endTime - startTime;
    const inner = radiusAt(endTime);
    const outer = Math.min(radiusAt(startTime), R * 1.2);

    if (red) {
      ctx.fillStyle = "#ff0000";
    } else if (outer - inner > 1) {
      const gradient = ctx.createRadialGradient(cx, cy, inner, cx, cy, outer);
      for (let i = holdGradientStops.length - 1; i >= 0; i--) {
        const radius = radiusAt(startTime + holdGradientStops[i] * duration);
        gradient.addColorStop(
          clamp((radius - inner) / (outer - inner), 0, 1),
          colors[i]
        );
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

    // Rounded squares pulsing in a ring. There used to be a glow band under them too, dropped
    // because it was the most expensive thing to draw (~4ms a frame in software while it played)
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

        const scale =
          Math.sin((Math.PI * (distance - inner)) / (outer - inner)) * strength;
        const width = cell * scale;
        if (width < 0.5) continue;

        const left = cx - R + x * cell + (cell - width) / 2;
        const top = cy - R + y * cell + (cell - width) / 2;
        if (ctx.roundRect)
          ctx.roundRect(left, top, width, width, corner * scale);
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
      }
    };
    const bubbleSprite = (...names) =>
      this.cached(`bubble:${names}`, () =>
        sprite(center * 2, center * 2, (spriteCtx) => {
          spriteCtx.setTransform(unit, 0, 0, unit, center, center);
          spriteCtx.globalCompositeOperation = "lighter";
          for (const name of names) parts[name](spriteCtx);
        })
      );
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
        drawSprite(bubbleSprite("body", "rim", "core"), 1, x, y, radius);
      } else if (bodyAlpha === 1 && rimAlpha === 1) {
        drawSprite(bubbleSprite("body", "rim"), 1, x, y, radius);
        drawSprite(bubbleSprite("core"), coreAlpha, x, y, radius);
      } else {
        drawSprite(bubbleSprite("body"), bodyAlpha, x, y, radius);
        drawSprite(bubbleSprite("rim"), rimAlpha, x, y, radius);
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

      const distance =
        Rj * (particle.radius - (particle.speed * elapsed) / 1000);
      if (distance <= 0) {
        particle.alive = false;
        continue;
      }

      const angle = particle.angle + (particle.drift * elapsed) / 1000;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const x = cx + distance * cos;
      const y = cy + distance * sin;

      const color = SPARKLE_RAMPS.get(particle.colors)[
        Math.max(0, Math.floor(t * SPARKLE_STEPS))
      ];
      ctx.globalAlpha =
        (t < 0.5 ? 1 : 1 - (t - 0.5) / 0.5) * Math.min(1, elapsed / 30);

      if (particle.kind === "streak" || particle.kind === "grind") {
        const length =
          Rj * (particle.kind === "streak" ? 0.08 : 0.035) * particle.size;
        ctx.strokeStyle = color;
        ctx.lineWidth =
          R * (particle.kind === "streak" ? 0.0025 : 0.005) * particle.size;
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

  // Shoot: a pink segment shooting from the rim towards the center, turning purple
  // and fading as it goes
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
        Rj *
        (0.12 * (1 - creep * creep * (3 - 2 * creep)) +
          0.88 * Math.exp(-t / 8));
      // The tail leaves the rim too and chases the head, so a segment shoots inward
      const chase = clamp(t / (SHOT_MS * 0.85), 0, 1);
      const outer = Rj - (Rj - front) * (1 - (1 - chase) * (1 - chase));
      const span = outer - front;
      if (span < 2) continue;

      // Bright head at the front, the tail dims as it goes. Everything only
      // ever gets darker once the front has passed, no stops that pop back up
      const u = clamp(t / 140, 0, 1);
      const dim = u * u * (3 - 2 * u);

      const fade = 0.8 * (1 - t / 240);
      const alpha =
        fade * 0.85 * (t < 80 ? 1 : Math.max(0, 1 - (t - 80) / (SHOT_MS - 80)));
      const purple = clamp((t - 30) / 120, 0, 1);
      const mix = (a, b) => Math.round(a + (b - a) * purple);
      const rgba = (r, g, b, a) =>
        `rgba(${mix(r, 150)}, ${mix(g, 70)}, ${mix(b, 190)}, ${a})`;

      const gradient = ctx.createRadialGradient(cx, cy, front, cx, cy, outer);
      gradient.addColorStop(0, rgba(255, 90, 210, alpha));
      gradient.addColorStop(0.05, rgba(250, 120, 225, alpha));
      gradient.addColorStop(
        0.2,
        rgba(245, 150, 230, alpha * (0.95 - 0.25 * dim))
      );
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
    if (this.session.activeHolds.length === 0) return;

    const { ctx, cx, cy, Rj } = this;
    ctx.fillStyle = this.cached("grindGlow", () => {
      const gradient = ctx.createRadialGradient(
        cx,
        cy,
        Rj * 0.84,
        cx,
        cy,
        Rj * 1.02
      );
      gradient.addColorStop(0, "rgba(255, 220, 160, 0)");
      gradient.addColorStop(0.8, "rgba(255, 235, 200, 0.55)");
      gradient.addColorStop(1, "rgba(255, 235, 200, 0)");
      return gradient;
    });

    for (const { note, base, held } of this.session.activeHolds) {
      if (held === false) continue;
      const shape = this.session.holdShapeAt(note, this.session.time - base);
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

  drawInterface() {
    const { ctx, settings } = this;

    // Info opacity only fades the progress bar and the judgement (with fast/late), like in game
    if (settings.infoOpacity > 0 && this.features.progressBar) {
      ctx.globalAlpha = settings.infoOpacity;
      this.drawClearGauge(this.session.gaugeFill());
      ctx.globalAlpha = 1;
    }

    if (!this.text) this.drawHudText();
  }

  // Ring text, the ring score and the center display
  drawHudText() {
    const { ctx, cx, cy, R, settings } = this;
    const { plus, minus } = this.session.score();

    // Ring text, only the score changes
    this.drawLayerRects(this.ringTextLayer, this.ringTextRects);
    if (this.features.score) {
      const score = String(settings.scoreMinus ? minus : plus).padStart(7, "0");
      if (score !== this.scoreText) {
        this.scoreText = score;
        const { score: scoreText } = RING_TEXT;
        const layer = this.scoreLayer.getContext("2d");
        layer.clearRect(0, 0, this.size, this.size);
        const bounds = this.drawArcRuns(
          layer,
          [
            {
              text: score,
              size: this.Rj * scoreText.size,
              family: SCORE_FONT,
              color: scoreText.color,
              pitch: this.Rj * scoreText.pitch
            }
          ],
          this.Rj * scoreText.baseline,
          -90,
          { align: "center" }
        );
        const left = Math.max(0, Math.floor(bounds.left));
        const top = Math.max(0, Math.floor(bounds.top));
        this.scoreRects = [
          [
            left,
            top,
            Math.min(this.size, Math.ceil(bounds.right)) - left,
            Math.min(this.size, Math.ceil(bounds.bottom)) - top
          ]
        ];
      }
      this.drawLayerRects(this.scoreLayer, this.scoreRects);
    }

    // Center display
    const mode = settings.centerDisplay;
    let value = null;
    if (mode === 1 && this.session.combo > 0) value = this.session.combo;
    else if (mode === 2) value = plus;
    else if (mode === 3) value = minus;
    else if (CENTER_BORDERS[mode])
      value = Math.max(0, minus - CENTER_BORDERS[mode]);

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

    // Clear border, under the fill. Its solid edge is where the fill has to reach to clear
    const inset = height * 0.18;
    const clearRate = CLEAR_RATES[this.difficulty] ?? CLEAR_RATES[3];
    const borderStart = left + inset + clearRate * (width - inset * 2);
    const borderEnd = borderStart + width * 0.06;
    bar(borderStart, borderEnd);
    ctx.fillStyle = this.cached(`gaugeBorder${clearRate}`, () => {
      const gradient = ctx.createLinearGradient(
        borderStart,
        0,
        borderEnd + slant,
        0
      );
      gradient.addColorStop(0, "rgba(255, 42, 127, 1)");
      gradient.addColorStop(1, "rgba(255, 42, 127, 0)");
      return gradient;
    });
    ctx.fill();

    // Fill, a bit inset and brighter on top
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
        // Full width chars (kanji etc) get more room than the pitch, like in game
        const cell = run.pitch ? Math.max(run.pitch, width * 1.22) : width;
        chars.push({ char, run, font, cell });
        total += cell;
      }
    }

    // Too long, squeeze everything to fit
    const limit = maxAngle * DEG * radius;
    const squeeze = total > limit ? limit / total : 1;
    let current =
      angle * DEG - (align === "center" ? (total * squeeze) / radius / 2 : 0);

    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    const bounds = {
      left: Infinity,
      top: Infinity,
      right: -Infinity,
      bottom: -Infinity
    };
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
      const gradient = ctx.createLinearGradient(
        0,
        y - size / 2,
        0,
        y + size / 2
      );
      gradient.addColorStop(0, style.top);
      gradient.addColorStop(1, style.bottom);
      return gradient;
    });
    ctx.fillText(style.text, 0, y);

    if ("letterSpacing" in ctx) ctx.letterSpacing = "0px";
  }

  drawJudgement(now) {
    const { ctx, cx, cy, R, settings } = this;
    const { judgement } = this.session;
    if (!judgement || settings.judgementPosition === 3) return;

    const elapsed = now - judgement.start;
    if (elapsed > 450) return;

    const alpha =
      (elapsed < 350 ? 1 : 1 - (elapsed - 350) / 100) * settings.infoOpacity;
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
      this.drawJudgementText(
        JUDGEMENT_STYLES[judgement.detail],
        size * 0.55,
        size * 0.9
      );
    }

    ctx.lineJoin = "miter";
    ctx.globalAlpha = 1;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
}

// Note previews are drawn once per type and color with a shared renderer
let previewRenderer = null;
const previews = new Map();

// Slides follow the invert slide colors option, the other notes don't have one
export function notePreview(type, colorIndex, slideInvert = false) {
  const invert = type.startsWith("slide") && slideInvert;
  const key = `${type}:${colorIndex}:${invert}`;
  if (!previews.has(key)) {
    previewRenderer ??= new PlayfieldRenderer(document.createElement("canvas"));
    previews.set(
      key,
      previewRenderer.drawNotePreview(type, colorIndex, invert)
    );
  }
  return previews.get(key);
}
