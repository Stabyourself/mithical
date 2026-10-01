// WACCA playfield unrolled into a flat strip, the second view of a PlayfieldSession.
// Lanes run left to right, time runs top to bottom into the judgement line near the bottom,
// with the touch ring's four rows under it
//
// The circle is cut at the top (12 o'clock) and read counterclockwise, so the bottom where the
// hands are is in the middle, left and right the way you see them: 9 o'clock is a quarter in,
// 6 o'clock in the middle, 3 o'clock three quarters in.
// Notes move straight down at a constant speed, no perspective, so spacing reads like a chart editor

import {
  palettes,
  holdColorsAt,
  holdGradientStops,
  missedHoldColors,
  capColors,
  syncColors
} from "./noteColors.js";
import { RING_ROWS, clamp, mod60, ringLayout } from "./PlayfieldSession.js";
import {
  resolveSettings,
  DIFFICULTY_LABELS,
  FONT,
  TITLE_COLOR
} from "./PlayfieldRenderer.js";

// Lane in the first column: lane 15 starts at 12 o'clock, lanes count counterclockwise from there
const CUT = 15;
// Note height per thickness setting, in units (a 500px view is 500 units)
const NOTE_HEIGHTS = [4, 5.5, 7, 8.5, 10];
// Gap at each end of a note, in lanes. Notes don't touch like in game
const NOTE_INSET = 0.3;
const JUDGEMENT_LINE_COLORS = ["#f11a9b", "#bd01fa"];
const BACKGROUND = ["#1d1450", "#0a0818"];
// Song info in the top right, in units
const INFO_MARGIN = 8;
const INFO_SIZE = 15;
const LINE_FLASH_MS = 150;
const HIT_FLASH_MS = 180;

// Touches go by the same radii as on the cabinet
const LAYOUT = ringLayout(true);

export default class UnrolledRenderer {
  // Draws the session it's given, whoever owns the session steps it
  constructor(canvas, session) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.session = session;
    this.settings = resolveSettings({});
    this.setFeatures({});
    this.setChartInfo(null);
    // Canvas text doesn't redraw by itself once the font arrives, so rebuild the info then
    this.fontsReady = Promise.resolve(document.fonts?.load(`40px ${FONT}`))
      .catch(() => {})
      .then(() => {
        this.infoKey = null;
      });

    this.lineFlash = new Float64Array(60).fill(-Infinity);
    this.hitFlashes = [];
    // What's on screen this frame, see PlayfieldSession.visibleObjects
    this.visible = null;
    // Background, guidelines and the idle ring, see updateStaticLayer
    this.staticLayer = document.createElement("canvas");
    this.staticKey = null;
    // Judgement line with its glow, see buildLineLayer
    this.lineLayer = document.createElement("canvas");
    // Song title and difficulty, see updateInfoLayer
    this.infoLayer = document.createElement("canvas");
    this.ringLit = new Uint8Array(60);
    this.resize(canvas.width || 1, canvas.height || 1);
    this.unsubscribe = session.subscribe((type, detail) =>
      this.onSessionEvent(type, detail)
    );
  }

  destroy() {
    this.unsubscribe();
  }

  onSessionEvent(type, detail) {
    const now = this.session.time;
    if (type === "reset") {
      this.lineFlash.fill(-Infinity);
      this.hitFlashes.length = 0;
    } else if (type === "touch") {
      if (detail.laneChanged) {
        for (let d = -1; d <= 1; d++)
          this.lineFlash[mod60(detail.lane + d)] = now;
      }
    } else if (type === "hit") {
      this.hitFlashes.push({
        start: now,
        pos: detail.note.pos,
        size: detail.note.size
      });
    } else if (type === "holdEnd") {
      const last = detail.note.points.at(-1);
      this.hitFlashes.push({ start: now, pos: last.pos, size: last.size });
    }
  }

  // What the view shows besides the chart:
  //   linear: place things by plain time instead of how far they've scrolled, so speed
  //     changes, stops and reverses show up as spacing instead of motion
  // Other keys are for the session or the round view and get ignored
  setFeatures(features) {
    this.features = {
      linear: features.linear ?? false,
      ring: features.ring ?? true,
      drawHiddenHolds: features.drawHiddenHolds ?? false
    };
    if (this.width) this.layout();
  }

  setOptions(options) {
    this.settings = resolveSettings(options);
    if (this.width) this.layout();
  }

  // { title, difficulty (1-4), level }, null shows nothing
  setChartInfo(info) {
    this.chartInfo = info;
    this.infoKey = null;
  }

  resize(width, height = width) {
    const w = Math.max(1, Math.round(width));
    const h = Math.max(1, Math.round(height));
    if (this.canvas.width !== w) this.canvas.width = w;
    if (this.canvas.height !== h) this.canvas.height = h;
    this.width = w;
    this.height = h;
    this.layout();
  }

  // Same layout as the round view (see ringLayout), its radii as fractions of the height: the
  // screen, and with the ring a black margin and the ring's rows under it. The line sits right at
  // the bottom of the screen though, with no glow under it
  layout() {
    const { width: w, height: h } = this;
    this.unit = Math.min(w, h) / 500;
    this.laneWidth = w / 60;
    this.noteHeight = NOTE_HEIGHTS[this.settings.thickness] * this.unit;
    this.lineHeight = this.noteHeight * 1.2;
    const layout = ringLayout(this.features.ring);
    this.screenBottom = Math.round(h * layout.screen);
    this.lineY = this.screenBottom - this.lineHeight / 2;
    this.ringTop = h * layout.ringInner;
    this.ringBottom = h * layout.ringOuter;

    // Gradients that only depend on the layout
    const { ctx } = this;
    this.keyBeamGradient = ctx.createLinearGradient(
      0,
      this.lineY * 0.45,
      0,
      this.lineY
    );
    this.keyBeamGradient.addColorStop(0, "rgba(255, 255, 255, 0)");
    this.keyBeamGradient.addColorStop(1, "rgba(255, 255, 255, 0.35)");
    this.lineGradient = ctx.createLinearGradient(0, 0, w, 0);
    const [a, b] = JUDGEMENT_LINE_COLORS;
    [a, b, a, b, a].forEach((color, i) =>
      this.lineGradient.addColorStop(i / 4, color)
    );
  }

  // Geometry

  // Left edge (in lanes from the left of the canvas) of something starting at lane pos.
  // Not wrapped, so a hold's edge moves smoothly
  columnOf(pos) {
    return pos - CUT;
  }

  // Calls fn(x, width) for each piece of a lane range, twice when it wraps around the edges
  eachSpan(pos, size, fn, inset = 0) {
    const { laneWidth, width } = this;
    if (size >= 60) {
      fn(0, width);
      return;
    }
    const column = mod60(this.columnOf(pos));
    const x = column * laneWidth + inset * laneWidth;
    const w = (size - 2 * inset) * laneWidth;
    fn(x, w);
    if (column + size > 60) fn(x - width, w);
  }

  // Progress 0 is where things appear (the top), 1 is the judgement line
  yOf(progress) {
    return progress * this.lineY;
  }

  // Input: x picks the lane, y the radius. Above the line is the screen, below it the ring rows

  touchAt(x, y) {
    const { Rj, R, ringInner, ringOuter } = LAYOUT;
    const lane = mod60(CUT + Math.floor(x / this.laneWidth));
    const rowHeight = (this.ringBottom - this.ringTop) / RING_ROWS;
    let radius;
    if (y <= this.lineY) radius = (y / this.lineY) * Rj;
    else if (y <= this.ringTop)
      radius =
        Rj +
        ((y - this.lineY) / (this.ringTop - this.lineY)) * (ringInner - Rj);
    else
      radius =
        ringInner +
        ((y - this.ringTop) / (this.ringBottom - this.ringTop)) *
          (ringOuter - ringInner);
    // Above the ring (or anywhere without it) the whole area splits evenly into the rows,
    // top is the innermost. On the ring it's the row you're on
    const top = this.features.ring ? this.ringTop : this.height;
    const row =
      y < top
        ? clamp(Math.floor((y / top) * RING_ROWS), 0, RING_ROWS - 1)
        : clamp(Math.floor((y - this.ringTop) / rowHeight), 0, RING_ROWS - 1);
    return [lane, radius / R, row];
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

  // Drawing

  // Draw the session as it is now. Step it first
  draw() {
    const { ctx, settings, session, features } = this;
    const now = session.time;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";

    // Static layer is opaque, so this is a plain copy
    this.updateStaticLayer();
    ctx.drawImage(this.staticLayer, 0, 0);
    // Under everything that moves, so notes pass over it
    this.updateInfoLayer();
    ctx.drawImage(this.infoLayer, 0, 0);
    if (settings.keyBeam) this.drawKeyBeams();

    this.visible = session.visibleObjects(settings.viewDistance, {
      barlines: settings.barlines,
      linear: features.linear
    });

    // Nothing's cut off at the judgement line: everything goes on under it to the bottom of the
    // screen, where the line covers it
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, this.width, this.screenBottom);
    ctx.clip();
    for (const hold of this.visible.holds) this.drawHold(hold, now);
    if (features.drawHiddenHolds) {
      for (const hold of this.visible.holds) {
        const note = session.hiddenHoldView(hold.note);
        if (note) this.drawHold({ ...hold, note }, now, true);
      }
    }
    this.drawObjects();
    ctx.restore();

    this.drawJudgementLine(now);
    if (features.ring) this.drawRingLights();
    // Hit effects over the ring, so it doesn't cut off the parts that reach past the line
    this.drawHitFlashes(now);
  }

  // Everything that only changes with the size, options, the ring or the lane masks, drawn
  // once into a layer: background, dim, masked lanes, guidelines, bezel and the idle ring
  updateStaticLayer() {
    const { width, height, settings, features, session } = this;
    const key = this.staticKey;
    if (
      key &&
      key.width === width &&
      key.height === height &&
      key.lineY === this.lineY &&
      key.thickness === settings.thickness &&
      key.mask === settings.mask &&
      key.ringColors === settings.ringColors &&
      key.ring === features.ring &&
      key.laneMask === session.laneMaskVersion
    ) {
      return;
    }
    this.staticKey = {
      width,
      height,
      lineY: this.lineY,
      thickness: settings.thickness,
      mask: settings.mask,
      ringColors: settings.ringColors,
      ring: features.ring,
      laneMask: session.laneMaskVersion
    };

    const layer = this.staticLayer;
    if (layer.width !== width) layer.width = width;
    if (layer.height !== height) layer.height = height;
    const ctx = layer.getContext("2d", { alpha: false });
    this.drawBackground(ctx);
    this.drawGuidelines(ctx);
    if (features.ring) this.drawIdleRing(ctx);
    this.buildLineLayer(ctx);
  }

  // Judgement line like the round view's (see its buildBaseLayer), on the open lanes: the glow
  // fades in above it, and the solid part goes down to the bottom of the screen. It goes into the
  // static layer, and over the notes again each frame, covering everything going past the line
  buildLineLayer(staticCtx) {
    const { width, height, lineY, lineHeight: size, screenBottom } = this;
    const { laneHidden } = this.session;
    const layer = this.lineLayer;
    if (layer.width !== width) layer.width = width;
    if (layer.height !== height) layer.height = height;
    const ctx = layer.getContext("2d");
    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, width, height);

    const y = (offset) => lineY + size * offset;
    const top = y(-0.875);
    const bottom = screenBottom;
    const at = (value) => (value - top) / (bottom - top);

    ctx.beginPath();
    for (let lane = 0; lane < 60; lane++) {
      if (!laneHidden[lane])
        this.eachSpan(lane, 1, (x, w) =>
          ctx.rect(x, top, w + 0.5, bottom - top)
        );
    }
    ctx.fillStyle = this.lineGradient;
    ctx.fill();

    const shade = ctx.createLinearGradient(0, top, 0, bottom);
    shade.addColorStop(0, "rgba(0, 0, 0, 0)");
    shade.addColorStop(at(y(-0.5)), "rgba(0, 0, 0, 0.31)");
    shade.addColorStop(at(y(-0.5) + 1), "rgba(0, 0, 0, 1)");
    shade.addColorStop(1, "rgba(0, 0, 0, 1)");
    ctx.globalCompositeOperation = "destination-in";
    ctx.fillStyle = shade;
    ctx.fillRect(0, top, width, bottom - top);

    const darken = ctx.createLinearGradient(0, top, 0, bottom);
    darken.addColorStop(at(y(-0.5) + 1), "rgba(0, 0, 0, 0)");
    darken.addColorStop(at(y(-0.08)), "rgba(0, 0, 0, 0.33)");
    darken.addColorStop(at(y(0.08)), "rgba(0, 0, 0, 0.33)");
    darken.addColorStop(at(y(0.5) - 1), "rgba(0, 0, 0, 0)");
    ctx.globalCompositeOperation = "source-atop";
    ctx.fillStyle = darken;
    ctx.fillRect(0, top, width, bottom - top);
    ctx.globalCompositeOperation = "source-over";

    staticCtx.drawImage(layer, 0, 0);
  }

  // Difficulty and song title turned 90° clockwise in the top right, like on a spine:
  // the difficulty on the outside, the title next to it. Both stop above the line
  updateInfoLayer() {
    const { width, height, unit, lineY, chartInfo } = this;
    const key = this.infoKey;
    if (
      key &&
      key.width === width &&
      key.height === height &&
      key.lineY === lineY
    )
      return;
    this.infoKey = { width, height, lineY };

    const layer = this.infoLayer;
    if (layer.width !== width) layer.width = width;
    if (layer.height !== height) layer.height = height;
    const ctx = layer.getContext("2d");
    ctx.clearRect(0, 0, width, height);
    if (!chartInfo) return;

    const label =
      DIFFICULTY_LABELS[chartInfo.difficulty] ?? DIFFICULTY_LABELS[3];
    const margin = INFO_MARGIN * unit;
    const size = INFO_SIZE * unit;
    // Long titles get squeezed to fit
    const length = lineY - 2 * margin;

    ctx.save();
    // Turned clockwise, lines run down the screen and stack leftwards
    ctx.translate(width - margin, margin);
    ctx.rotate(Math.PI / 2);
    ctx.textBaseline = "top";
    ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
    ctx.shadowBlur = 3 * unit;
    ctx.font = `${size}px ${FONT}`;
    ctx.fillStyle = label.color;
    ctx.fillText(`${label.name}/Lv.${chartInfo.level}`, 0, 0, length);
    ctx.fillStyle = TITLE_COLOR;
    ctx.fillText(chartInfo.title, 0, size * 1.25, length);
    ctx.restore();
  }

  drawBackground(ctx) {
    const { width, height, lineY, screenBottom, settings } = this;
    const { laneHidden } = this.session;

    const gradient = ctx.createLinearGradient(0, lineY, 0, 0);
    gradient.addColorStop(0, BACKGROUND[0]);
    gradient.addColorStop(1, BACKGROUND[1]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, screenBottom);
    // Black margin and the backing of the ring rows
    if (screenBottom < height) {
      ctx.fillStyle = "#000";
      ctx.fillRect(0, screenBottom, width, height - screenBottom);
    }

    // Background dim setting, then masked lanes go darker still
    const dim = [0, 0.33, 0.62, 0.71, 0.87][settings.mask] ?? 0;
    if (dim > 0) {
      ctx.fillStyle = `rgba(0, 0, 0, ${dim})`;
      ctx.fillRect(0, 0, width, screenBottom);
    }
    if (laneHidden.includes(1)) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.65)";
      for (let lane = 0; lane < 60; lane++) {
        if (laneHidden[lane])
          this.eachSpan(lane, 1, (x, w) => ctx.fillRect(x, 0, w, screenBottom));
      }
    }
  }

  // Every lane faintly, every 5 a bit more, every 15 (the clock positions) clearly
  drawGuidelines(ctx) {
    const { laneWidth, lineY, unit } = this;
    ctx.lineWidth = Math.max(1, unit);
    for (const [every, alpha] of [
      [1, 0.05],
      [5, 0.14],
      [15, 0.35]
    ]) {
      ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.beginPath();
      for (let column = 1; column < 60; column++) {
        // Each line gets only its strongest color
        const strongest = column % 15 === 0 ? 15 : column % 5 === 0 ? 5 : 1;
        if (strongest !== every) continue;
        const x = Math.round(column * laneWidth) + 0.5;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, lineY);
      }
      ctx.stroke();
    }
  }

  // Ring cell rectangle for a lane and row
  ringCell(lane, row) {
    const { laneWidth, ringTop, ringBottom, unit } = this;
    const rowHeight = (ringBottom - ringTop) / RING_ROWS;
    const gap = Math.max(1, unit);
    const x = mod60(lane - CUT) * laneWidth;
    return [
      x + gap / 2,
      ringTop + row * rowHeight + gap / 2,
      laneWidth - gap,
      rowHeight - gap
    ];
  }

  // Idle ring: open lanes in the second color, masked ones in the first (dark versions)
  drawIdleRing(ctx) {
    const { settings, session } = this;
    for (const [masked, index] of [
      [0, 4],
      [1, 3]
    ]) {
      ctx.fillStyle = `rgb(${settings.ringColors[index].join(", ")})`;
      ctx.beginPath();
      for (let lane = 0; lane < 60; lane++) {
        if (session.laneHidden[lane] !== masked) continue;
        for (let row = 0; row < RING_ROWS; row++)
          ctx.rect(...this.ringCell(lane, row));
      }
      ctx.fill();
    }
  }

  // Light going up from where fingers are
  drawKeyBeams() {
    const { ctx, lineY } = this;
    ctx.fillStyle = this.keyBeamGradient;
    for (const { lane, spread } of this.session.fingers.values()) {
      this.eachSpan(lane - 1, spread.lanes + 2, (x, w) =>
        ctx.fillRect(x, 0, w, lineY)
      );
    }
  }

  // red: the hold as it's judged, flat red (drawHiddenHolds)
  drawHold({ note, base, missed, active }, now, red = false) {
    const { ctx, session, settings, features, laneWidth, width } = this;
    const view = settings.viewDistance;
    const linear = features.linear;
    const startTime = base + note.time;
    const endTime = base + note.endTime;

    // Scroll distance (or plain time) of a moment, and of now
    const at = linear ? (t) => t : (t) => session.scaledAt(t);
    const nowAt = at(now);

    // Holds go on past the line to the bottom of the screen, like everything else
    const from = session.holdShownFrom(note, base, view, linear);
    if (from === null) return;
    // Cut off where it leaves the view
    let to = endTime;
    if (at(to) - nowAt > view) {
      let low = from;
      for (let i = 0; i < 20; i++) {
        const middle = (low + to) / 2;
        if (at(middle) - nowAt > view) to = middle;
        else low = middle;
      }
    }
    if (from >= to) return;

    const yAt = (t) => this.yOf(1 - (at(t) - nowAt) / view);
    // Same vertices as the round view, see PlayfieldSession.holdSamples
    const samples = session.holdSamples(note, base, from, to);

    // Left and right edges in pixels. Unwrapped: each sample takes the copy of its column closest to the one before, so holds
    // that spiral across the cut (or around more than once) stay one piece. Every hold point
    // starts from its own 0-59 position, so this has to go sample by sample
    const left = [];
    const right = [];
    let previous = null;
    let lowest = Infinity;
    let highest = -Infinity;
    for (const [t, pos, size] of samples) {
      const y = yAt(t);
      if (size >= 60) {
        const from = previous ?? 0;
        left.push([from * laneWidth, y]);
        right.push([(from + 60) * laneWidth, y]);
        lowest = Math.min(lowest, from);
        highest = Math.max(highest, from + 60);
        continue;
      }
      let column =
        previous === null ? mod60(this.columnOf(pos)) : this.columnOf(pos);
      if (previous !== null)
        column += Math.round((previous - column) / 60) * 60;
      previous = column;
      left.push([(column + NOTE_INSET) * laneWidth, y]);
      right.push([(column + size - NOTE_INSET) * laneWidth, y]);
      lowest = Math.min(lowest, column);
      highest = Math.max(highest, column + size);
    }

    const path = new Path2D();
    path.moveTo(...left[0]);
    for (let i = 1; i < left.length; i++) path.lineTo(...left[i]);
    for (let i = right.length - 1; i >= 0; i--) path.lineTo(...right[i]);
    path.closePath();

    // Color runs along the hold, start to end
    const colors = missed
      ? missedHoldColors
      : holdColorsAt(settings.colors.hold, active);
    const top = yAt(Math.min(endTime, to));
    const bottom = yAt(startTime);
    if (red) {
      ctx.fillStyle = "#ff0000";
    } else if (bottom - top > 1) {
      const gradient = ctx.createLinearGradient(0, bottom, 0, top);
      const span = endTime - startTime;
      for (let i = 0; i < holdGradientStops.length; i++) {
        const y = yAt(startTime + holdGradientStops[i] * span);
        gradient.addColorStop(
          clamp((bottom - y) / (bottom - top), 0, 1),
          colors[i]
        );
      }
      ctx.fillStyle = gradient;
    } else {
      ctx.fillStyle = colors.at(-1);
    }

    ctx.globalAlpha = 207 / 255;
    // Again a strip over for every time it goes past an edge
    for (let k = Math.ceil(-highest / 60); k * 60 + lowest < 60; k++) {
      ctx.setTransform(1, 0, 0, 1, k * width, 0);
      ctx.fill(path);
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
  }

  drawObjects() {
    // Far stuff first, lines under notes, big notes under small ones
    for (const item of this.visible.sorted) {
      const y = this.yOf(item.progress);
      if (item.kind === 0) this.drawNote(item.object, y);
      else if (item.kind === 1) this.drawSyncConnector(item.object, y);
      else this.drawMeasureLine(y);
    }
  }

  drawMeasureLine(y) {
    const { ctx, width, unit } = this;
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    ctx.fillRect(0, y - unit / 2, width, Math.max(1, unit));
  }

  drawSyncConnector(connector, y) {
    const { ctx } = this;
    const h = this.noteHeight * 0.4;
    ctx.fillStyle = syncColors.base;
    ctx.globalAlpha = 0.8;
    // The connector spans the gap between the notes, their ends overlap it by a lane
    this.eachSpan(
      connector.pos,
      connector.size,
      (x, w) => ctx.fillRect(x, y - h / 2, w, h),
      0.5
    );
    ctx.globalAlpha = 1;
  }

  drawNote(note, y) {
    const { ctx, settings, noteHeight: h, laneWidth, unit } = this;
    const colors = palettes[settings.colors[note.type]];
    const top = y - h / 2;
    const inset = note.size >= 60 ? 0 : NOTE_INSET;

    this.eachSpan(
      note.pos,
      note.size,
      (x, w) => {
        if (note.rNote) this.drawRGlow(x, w, y);

        // Body: light top edge, dark bottom edge
        ctx.fillStyle = colors.base;
        ctx.fillRect(x, top, w, h);
        ctx.fillStyle = colors.light;
        ctx.fillRect(x, top, w, h * 0.25);
        ctx.fillStyle = colors.dark;
        ctx.fillRect(x, top + h * 0.75, w, h * 0.25);

        if (note.type === "chain") this.drawChainStripes(x, w, top);

        // Caps like the blue ends in game
        if (note.size < 60) {
          const cap = Math.min(laneWidth * 0.3, w / 4);
          ctx.fillStyle = capColors.base;
          ctx.fillRect(x, top, cap, h);
          ctx.fillRect(x + w - cap, top, cap, h);
        }

        if (note.sync) {
          ctx.strokeStyle = syncColors.outline;
          ctx.lineWidth = Math.max(1, 1.5 * unit);
          ctx.strokeRect(
            x - ctx.lineWidth,
            top - ctx.lineWidth,
            w + 2 * ctx.lineWidth,
            h + 2 * ctx.lineWidth
          );
        }
        if (note.bonus)
          this.drawBonusTriangles(note, x - inset * laneWidth, top, colors);

        if (note.type === "snapIn" || note.type === "snapOut")
          this.drawSnapArrows(note, x, w, top, colors);
        if (note.type === "slideCW" || note.type === "slideCCW")
          this.drawSlideArrows(note, x, w, top, colors);
      },
      inset
    );
  }

  // Soft pale yellow glow behind R notes, like the round view: brightest on the note, fading
  // out above and below it and half a lane past its ends
  drawRGlow(x, w, y) {
    const { ctx, noteHeight: h, laneWidth } = this;
    const reach = h * 1.6;
    const gradient = ctx.createLinearGradient(0, y - reach, 0, y + reach);
    gradient.addColorStop(0, "rgba(255, 255, 192, 0)");
    gradient.addColorStop(0.3, "rgba(255, 255, 192, 0.45)");
    gradient.addColorStop(0.5, "rgba(255, 255, 192, 0.9)");
    gradient.addColorStop(0.7, "rgba(255, 255, 192, 0.45)");
    gradient.addColorStop(1, "rgba(255, 255, 192, 0)");
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.fillStyle = gradient;
    ctx.fillRect(x - laneWidth * 0.5, y - reach, w + laneWidth, reach * 2);
    ctx.restore();
  }

  // Zigzag of triangles across the note like the round view: one per lane, flipping every
  // lane, leaving out the lane at each end (full circle notes go all the way). x is the note's
  // left edge without the inset
  drawBonusTriangles(note, x, top, colors) {
    const { ctx, noteHeight: h, laneWidth } = this;
    const full = note.size >= 60;
    const count = full ? 60 : note.size - 2;
    const start = full ? x : x + laneWidth;

    const gradient = ctx.createLinearGradient(
      0,
      top - h * 0.1,
      0,
      top + h * 1.1
    );
    gradient.addColorStop(0, colors.light);
    gradient.addColorStop(0.4, colors.base);
    gradient.addColorStop(0.6, colors.base);
    gradient.addColorStop(1, colors.light);
    ctx.fillStyle = gradient;
    ctx.beginPath();
    for (let i = 0; i < count; i++) {
      const a = start + i * laneWidth;
      const b = a + laneWidth;
      const [first, second] = i % 2 === 0 ? [a, b] : [b, a];
      // Upright side at first, point at the top of second
      ctx.moveTo(first, top);
      ctx.lineTo(first, top + h);
      ctx.lineTo(second, top);
      ctx.closePath();
    }
    ctx.fill();
  }

  // Dark stripes leaning slightly to the right, cut off at the note's edges
  drawChainStripes(x, w, top) {
    const { ctx, noteHeight: h, laneWidth } = this;
    const width = laneWidth * 0.25;
    const lean = h * 0.6;
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, top, w, h);
    ctx.clip();
    ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
    ctx.beginPath();
    // Start a lean early so the first stripe's bottom still reaches into the note
    for (
      let stripe = x - lean + laneWidth * 0.3;
      stripe < x + w;
      stripe += laneWidth * 0.7
    ) {
      ctx.moveTo(stripe + lean, top);
      ctx.lineTo(stripe + lean + width, top);
      ctx.lineTo(stripe + width, top + h);
      ctx.lineTo(stripe, top + h);
      ctx.closePath();
    }
    ctx.fill();
    ctx.restore();
  }

  // Chevrons above the note: up (to the center) for snap in, down for snap out
  drawSnapArrows(note, x, w, top, colors) {
    const { ctx, noteHeight: h, laneWidth } = this;
    const up = note.type === "snapIn";
    const count = Math.max(1, Math.ceil(note.size / 4));
    const size = Math.min(laneWidth * 1.2, h * 1.3);
    const baseY = top - h * 0.4;
    ctx.fillStyle = colors.light;
    for (let i = 0; i < count; i++) {
      const cx = x + (w * (i + 0.5)) / count;
      ctx.beginPath();
      if (up) {
        ctx.moveTo(cx - size / 2, baseY);
        ctx.lineTo(cx, baseY - size * 0.7);
        ctx.lineTo(cx + size / 2, baseY);
      } else {
        ctx.moveTo(cx - size / 2, baseY - size * 0.7);
        ctx.lineTo(cx, baseY);
        ctx.lineTo(cx + size / 2, baseY - size * 0.7);
      }
      ctx.closePath();
      ctx.fill();
    }
  }

  // Arrows above the note the way the slide goes. Counterclockwise is to the right here
  drawSlideArrows(note, x, w, top, colors) {
    const { ctx, noteHeight: h, laneWidth } = this;
    const left = note.type === "slideCW";
    const size = Math.min(laneWidth * 0.9, h * 1.2);
    const y = top - h * 0.3 - size / 2;
    ctx.fillStyle = colors.light;
    const count = Math.max(1, Math.round(w / (laneWidth * 2)));
    for (let i = 0; i < count; i++) {
      const cx = x + (w * (i + 0.5)) / count;
      ctx.beginPath();
      if (left) {
        ctx.moveTo(cx + size / 3, y - size / 2);
        ctx.lineTo(cx - size / 3, y);
        ctx.lineTo(cx + size / 3, y + size / 2);
      } else {
        ctx.moveTo(cx - size / 3, y - size / 2);
        ctx.lineTo(cx + size / 3, y);
        ctx.lineTo(cx - size / 3, y + size / 2);
      }
      ctx.closePath();
      ctx.fill();
    }
  }

  // Two color sweep like the round line, left out on masked lanes, white where fingers land
  drawJudgementLine(now) {
    const { ctx, lineY, lineHeight: h } = this;
    const { laneHidden } = this.session;

    ctx.drawImage(this.lineLayer, 0, 0);

    ctx.fillStyle = "#ffffff";
    for (let lane = 0; lane < 60; lane++) {
      const age = now - this.lineFlash[lane];
      if (age < 0 || age >= LINE_FLASH_MS || laneHidden[lane]) continue;
      ctx.globalAlpha = 0.9 * (1 - age / LINE_FLASH_MS);
      this.eachSpan(lane, 1, (x, w) => ctx.fillRect(x, lineY - h / 2, w, h));
    }
    ctx.globalAlpha = 1;
  }

  // Hits flash where they landed, held holds glow
  drawHitFlashes(now) {
    const { ctx, lineY, noteHeight: h, session } = this;
    ctx.globalCompositeOperation = "lighter";

    ctx.fillStyle = "rgb(255, 240, 250)";
    for (let i = this.hitFlashes.length - 1; i >= 0; i--) {
      const flash = this.hitFlashes[i];
      const progress = (now - flash.start) / HIT_FLASH_MS;
      if (progress >= 1 || progress < 0) {
        this.hitFlashes.splice(i, 1);
        continue;
      }
      const grow = 1 + progress * 1.5;
      ctx.globalAlpha = 0.8 * (1 - progress);
      this.eachSpan(
        flash.pos,
        flash.size,
        (x, w) => ctx.fillRect(x, lineY - h * grow, w, h * grow * 2),
        NOTE_INSET
      );
    }
    ctx.globalAlpha = 1;

    ctx.fillStyle = "rgba(255, 235, 200, 0.45)";
    for (const { note, base, held } of session.activeHolds) {
      if (!held) continue;
      const shape = session.holdShapeAt(note, session.time - base);
      this.eachSpan(
        Math.round(shape.pos),
        Math.round(shape.size),
        (x, w) => ctx.fillRect(x, lineY - h * 2, w, h * 4),
        NOTE_INSET
      );
    }
    ctx.globalCompositeOperation = "source-over";
  }

  // What changes on the ring each frame, over the idle cells in the static layer: held holds
  // light their lanes in the third color, pressed panels are white
  drawRingLights() {
    const { ctx, session, settings } = this;
    const lit = this.ringLit.fill(0);
    let anyLit = false;
    for (const { note, base, held } of session.activeHolds) {
      if (!held) continue;
      const shape = session.holdShapeAt(note, session.time - base);
      for (let i = 0; i < Math.round(shape.size); i++)
        lit[mod60(Math.round(shape.pos) + i)] = 1;
      anyLit = true;
    }
    if (anyLit) {
      ctx.fillStyle = `rgb(${settings.ringColors[2].join(", ")})`;
      ctx.beginPath();
      for (let lane = 0; lane < 60; lane++) {
        if (!lit[lane]) continue;
        for (let row = 0; row < RING_ROWS; row++)
          ctx.rect(...this.ringCell(lane, row));
      }
      ctx.fill();
    }

    if (session.fingers.size === 0) return;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    for (const finger of session.fingers.values()) {
      session.eachFingerCell(finger, (lane, row) =>
        ctx.rect(...this.ringCell(lane, row))
      );
    }
    ctx.fill();
  }
}
