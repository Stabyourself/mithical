// WACCA playfield song state: the loaded chart, the clock, judging, the autoplay bot and
// fingers. No drawing, views (PlayfieldRenderer) read from it and listen for its events
// to spawn their own effects. One session can feed several views at once
//
// Judging and bot timing are ported from SaturnEdit/SaturnView, see SATURNVIEW_LICENSE
//
// Events (listener(type, detail)):
//   reset: jumped somewhere (seek, new chart), clear effects
//   touch { lane, row, spread, laneChanged }: a finger landed on or moved to a panel
//   hit { note }: a note got hit
//   holdEnd { note }: a hold was held to the end

import { parseMer, buildChart } from "./merChart.js";

// Judging, the same for the autoplay bot and people
export const FRAME_MS = 1000 / 60;
// Hit windows in 60fps frames, [early, late] for marvelous/great/good, from SaturnEdit
const HIT_WINDOWS = {
  touch: [
    [-3, 3],
    [-5, 5],
    [-6, 6]
  ],
  hold: [
    [-3, 3],
    [-5, 5],
    [-6, 6]
  ],
  snapIn: [
    [-5, 7],
    [-8, 10],
    [-10, 10]
  ],
  snapOut: [
    [-7, 5],
    [-10, 8],
    [-10, 10]
  ],
  slideCW: [
    [-5, 5],
    [-8, 10],
    [-10, 10]
  ],
  slideCCW: [
    [-5, 5],
    [-8, 10],
    [-10, 10]
  ],
  // Chains are marvelous or miss
  chain: [[-4, 4]]
};
const HIT_GRADES = ["marvelous", "great", "good"];
// Score per grade as a share of a note's value, from the game's GameScoreTable.
// R notes are worth double, hold ends count as notes of their own
const SCORE_RATES = { marvelous: 1, great: 0.7, good: 0.5, miss: 0 };
// Clear gauge per grade by note type, from the game's NormaTable. Only touches and slides have
// bonus versions, which fill more with the bonus effect option on. The gauge is full when
// everything is Marvelous
const NORMA = {
  normal: { marvelous: 10, great: 7, good: 4, miss: -5 },
  normalBonus: { marvelous: 15, great: 10, good: 7, miss: -5 },
  hold: { marvelous: 10, great: 7, good: 4, miss: -5 },
  chain: { marvelous: 2, great: 1, good: 1, miss: -5 },
  slide: { marvelous: 10, great: 7, good: 4, miss: -5 },
  slideBonus: { marvelous: 15, great: 10, good: 7, miss: -5 },
  snap: { marvelous: 10, great: 7, good: 4, miss: -5 }
};
// Letting go of a hold for longer than this drops it for good
const HOLD_DROP_MS = 200;
// Back to autoplay after this long without touching anything
const PLAY_IDLE_MS = 3000;
// Touch ring around the screen, lit like the cabinet, and the black margin between them.
// Fractions of the canvas radius
const RING_WIDTH = 0.13;
const RING_MARGIN = 0.01;
// Judgement line radius as a fraction of the screen's
const JUDGEMENT_RADIUS = 0.9506;
export const RING_ROWS = 4;

// Bot presses the middle two rows (its patch is 2 rows tall), snaps swipe across instead
const BOT_ROW = 1;
// The bot plans notes this far ahead
const BOT_LOOKAHEAD_MS = 150;
// How often the bot gets each grade per skill level, the name is the worst it gets
const BOT_SKILLS = {
  "all-marvelous": { marvelous: 1 },
  "great-up": { marvelous: 0.85, great: 0.15 },
  "good-up": { marvelous: 0.75, great: 0.17, good: 0.08 },
  "miss-up": { marvelous: 0.7, great: 0.16, good: 0.08, miss: 0.06 }
};
// Snaps need a swipe this far (fraction of the radius) within SWIPE_MS
const SNAP_SWIPE = 0.06;
const SWIPE_MS = 200;

// Farthest past the judgement line anything shows (in progress, 1 = on the line). A bit past
// the edge of the screen in either view, where the line's glow and the margin cover it
export const PAST_LINE = 1.06;
// Notes keep going further so their arrows scroll out under the mask instead of popping
export const NOTE_PAST_LINE = 1.1;
// Without judging, holds take on their held colors this fast once they reach the line
const HOLD_ACTIVE_FADE_MS = 100;

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function mod60(value) {
  return ((value % 60) + 60) % 60;
}

export function option(options, id, fallback) {
  const value = options?.[id];
  return value === undefined || value === null ? fallback : Number(value);
}

// Screen, judgement line and touch ring radii as fractions of the canvas radius (the unrolled
// view uses them as fractions of its height). The screen fills the canvas, or with the ring it
// shrinks to make room for a thin black margin and the ring around it. Everything on the screen
// scales with it, so it looks the same either way
export function ringLayout(ring) {
  const ringInner = 1 - RING_WIDTH;
  const screen = ring ? ringInner - RING_MARGIN : 1;
  const Rj = screen * JUDGEMENT_RADIUS;
  return { ringOuter: 0.995, ringInner, screen, Rj, R: Rj / 0.913 };
}

// Where the bot's fingers go, on the cabinet (with the ring)
const BOT_LAYOUT = ringLayout(true);

// Radius (fraction of R) of the middle of a ring row
function rowRadius(row) {
  const { ringInner, ringOuter, R } = BOT_LAYOUT;
  const rowHeight = (ringOuter - ringInner) / RING_ROWS;
  return (ringInner + (row + 0.5) * rowHeight) / R;
}

export default class PlayfieldSession {
  constructor() {
    this.listeners = new Set();
    this.mirror = false;
    this.judgementOffset = 0;
    this.setFeatures({});

    this.laneHidden = new Uint8Array(60);
    this.previousLaneHidden = new Uint8Array(60);
    // Goes up whenever laneHidden changes, so views know when to redo what they built from it
    this.laneMaskVersion = 0;
    // Goes up whenever anything views draw could have changed, see visibleObjects
    this.version = 0;
    this.visibleCache = new Map();

    // Touches from people (pointer ids) and the autoplay bot ("bot" ids)
    this.fingers = new Map();
    // Demo ms per real ms, set by whoever drives step()
    this.playbackRate = 1;
    // Set while someone drags the scrub bar, the bot stays out of it until they let go
    this.scrubbing = false;
    this.judgedNotes = new Set();
    this.missedHolds = new Set();
    // Missed notes keep scrolling out, hit ones are gone
    this.missedNotes = new Set();
    this.activeHolds = [];
    this.bot = { actions: [], holds: [], planned: new Set(), fingerCount: 0 };
    // Empty until a chart is loaded
    this.loadChart("");
  }

  // Calls listener(type, detail) for every event, returns a function that stops it
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  emit(type, detail) {
    for (const listener of this.listeners) listener(type, detail);
  }

  // What the session does besides moving the chart along:
  //   autoplay: the bot plays whenever nobody else is. Off, notes nobody hits are misses
  //   judging: ratings, misses and dropped holds. Off, unhit notes just pass by
  //   botSkill: how well the bot plays, see BOT_SKILLS
  // Other keys are for the views and get ignored
  setFeatures(features) {
    const next = {
      autoplay: features.autoplay ?? true,
      judging: features.judging ?? true,
      botSkill: features.botSkill ?? "all-marvelous"
    };
    const previous = this.features;
    this.features = next;
    if (!previous) return;
    if (!next.autoplay && previous.autoplay) {
      this.resetBot();
      // The bot's score isn't anyone's
      if (!this.playing) this.resetStats();
    }
    // Picking a bot hands control back to it right away
    if (
      next.autoplay &&
      (!previous.autoplay || next.botSkill !== previous.botSkill) &&
      this.playing &&
      this.fingers.size === 0
    ) {
      this.handBack();
    }
    // Turned on: judge from here, notes that just went by aren't misses
    if (next.judging && !previous.judging) this.judgeFrom = this.time;
    if (!this.isJudging()) this.judgement = null;
  }

  // Judging counts: whoever plays, the bot, a person or nobody (all misses)
  isJudging() {
    return this.features.judging;
  }

  // Profile options that change the song itself: mirror and judgement timing
  setOptions(options) {
    // 100 = 0.0, one step on the display = one frame, positive = hit later
    this.judgementOffset =
      (clamp(option(options, 108, 100), 0, 200) / 10 - 10) * FRAME_MS;
    // Bonus notes fill the clear gauge more
    this.bonusEffect = option(options, 114, 1) === 1;

    const mirror = option(options, 101, 0) === 1;
    if (mirror !== this.mirror) {
      this.mirror = mirror;
      this.setChart(buildChart(this.source, mirror));
    }
  }

  // Load a MER chart (its text) and start over from the top. The chart loops,
  // every loop is a fresh play
  // keepTime: stay at this point of the song
  loadChart(text, keepTime = null) {
    this.source = parseMer(text);
    this.loopMs = this.source.lengthMs;
    this.bpm = this.source.bpm;
    this.setChart(buildChart(this.source, this.mirror));
    this.reset();
    if (keepTime !== null)
      this.time = clamp(keepTime, 0, Math.max(0, this.loopMs - 1));
  }

  // How far the notes have scrolled at a demo time (speed changes and stops), over loops
  scaledAt(time) {
    const loop = Math.floor(time / this.loopMs);
    return (
      loop * this.source.scaledLength +
      this.source.scaledAt(time - loop * this.loopMs)
    );
  }

  // Demo state at the start
  reset() {
    this.version++;
    this.time = 0;
    this.loopIndex = 0;
    // Played from the start the chart's opening reveal sweeps in, like in game
    this.revealLoop = 0;
    this.resetStats();
    this.playing = false;
    this.fingers.clear();
    this.resetJudging();
    this.judgement = null;
    this.emit("reset");
  }

  // Scrubbing through the chart (ms)
  get songLength() {
    return this.loopMs;
  }

  get songTime() {
    return this.time % this.loopMs;
  }

  // Jump to a point in the current loop, like scrubbing a video. The bot takes over
  // from there and the score is as if it played everything before
  seek(songTime) {
    this.version++;
    const start = this.loopIndex * this.loopMs;
    this.time = start + clamp(songTime, 0, this.loopMs - 1);
    this.loopIndex = Math.floor(this.time / this.loopMs);
    // Jumping to the start plays the opening reveal, anywhere else it's just there
    this.revealLoop = songTime <= 0 ? this.loopIndex : null;
    this.playing = false;
    this.fingers.clear();
    this.resetJudging();
    this.judgement = null;
    this.emit("reset");

    this.resetStats();
    // Without the bot nobody played the skipped part: nothing to credit, no holds to grab
    if (!this.features.autoplay) return;

    // Hold ends right at the seek point count too, the bot only grabs holds that are still going
    let passed = 0;
    let earned = 0;
    let gauge = 0;
    const credit = (note) => {
      passed++;
      earned += this.noteValue(note);
      gauge += this.normaFor(note).marvelous;
    };
    for (const note of this.chart.notes) {
      if (start + note.time < this.time) credit(note);
      if (note.type === "hold" && start + note.endTime <= this.time)
        credit(note);
    }
    if (this.isJudging()) {
      this.combo = passed;
      this.judged = passed;
      this.earned = earned;
      this.gauge = gauge;
    }

    // Landed in the middle of holds: the bot grabs them right away instead of
    // leaving them unheld until they end
    if (this.scrubbing) return;
    for (const note of this.chart.notes) {
      if (note.type !== "hold") continue;
      if (start + note.time >= this.time || start + note.endTime <= this.time)
        continue;
      const key = this.noteKey(note, start);
      this.judgedNotes.add(key);
      this.activeHolds.push({
        note,
        base: start,
        key,
        kind: "marvelous",
        detail: null,
        held: true,
        releasedFor: 0
      });
      this.grabHold(note, start);
    }
  }

  // Bot finger on a hold that's already going, no new touch or hit
  grabHold(note, base) {
    const { bot } = this;
    const id = `bot${bot.fingerCount++}`;
    const shape = this.holdShapeAt(note, this.time - base);
    const lane = this.botLane(shape.pos, shape.size);
    const radius = rowRadius(BOT_ROW);
    this.fingers.set(id, {
      lane,
      row: BOT_ROW,
      target: this.noteKey(note, base),
      swipeFrom: radius,
      swipeStart: this.time,
      since: this.time,
      spread: this.fingerSpread(id)
    });
    bot.holds.push({ id, note, base, row: BOT_ROW });
  }

  resetStats() {
    this.combo = 0;
    this.earned = 0;
    this.lost = 0;
    this.judged = 0;
    this.gauge = 0;
  }

  score() {
    const plus = Math.round(this.earned);
    const minus = Math.round(1000000 - this.lost);
    return { plus, minus };
  }

  // Advance by dt ms: bot, judging, lane masks. Views draw after
  step(dt) {
    this.version++;
    const previous = this.time;
    // Clamp so coming back from a hidden tab doesn't skip ahead
    this.time += clamp(dt, 0, 100);

    // New loop, new score
    const loopIndex = Math.floor(this.time / this.loopMs);
    if (loopIndex !== this.loopIndex) {
      this.loopIndex = loopIndex;
      this.resetStats();
    }

    if (!this.scrubbing) {
      // Nobody touched anything for a while: back to the bot, or to just watching without one
      if (
        this.playing &&
        this.fingers.size === 0 &&
        this.time - this.lastInput > PLAY_IDLE_MS
      ) {
        this.handBack();
      }
      if (this.features.autoplay && !this.playing) this.runBot();
    }
    this.updateJudging(this.time - previous);
    this.stepClock = performance.now();
    this.updateLaneMasks();
  }

  // Input. Views turn their pointer positions into a lane, a radius (fraction of the
  // screen radius R, for swipes) and a ring row

  // Demo time of an input, including the time since the last step
  inputTime() {
    const sinceStep = this.stepClock ? performance.now() - this.stepClock : 0;
    return this.time + clamp(sinceStep, 0, 50) * this.playbackRate;
  }

  // Any click takes over from the bot and counts as a hit, so people find it by accident
  pointerDown(id, lane, radius, row) {
    this.version++;
    this.takeOver();
    this.fingerDown(id, lane, radius, row, this.inputTime());
  }

  pointerMove(id, lane, radius, row) {
    if (!this.fingers.has(id)) return;
    this.version++;
    this.lastInput = this.time;
    this.fingerMove(id, lane, radius, row, this.inputTime());
  }

  pointerUp(id) {
    this.version++;
    this.fingers.delete(id);
    this.lastInput = this.time;
  }

  // Fingers: people's pointers and the bot's, judged the same

  // Bot fingers have a target (the note key they're for) and only hit that one, so
  // aiming early or late can't hit a neighbour instead. People's fingers hit anything
  fingerDown(id, lane, radius, row, time, target = null) {
    // since: when it got to this lane, chains care about that
    const spread = this.fingerSpread(id);
    this.fingers.set(id, {
      lane,
      row,
      target,
      swipeFrom: radius,
      swipeStart: time,
      since: time,
      spread
    });
    this.emit("touch", { lane, row, spread, laneChanged: true });
    this.hitNotes(this.closestNotes(["touch", "hold"], lane, time, target));
  }

  fingerMove(id, lane, radius, row, time) {
    const finger = this.fingers.get(id);
    if (lane !== finger.lane || row !== finger.row) {
      this.emit("touch", {
        lane,
        row,
        spread: finger.spread,
        laneChanged: lane !== finger.lane
      });
    }
    finger.row = row;

    // Moving into another lane counts as a new touch there
    if (lane !== finger.lane) {
      const from = finger.lane;
      finger.lane = lane;
      finger.since = time;

      // Slides: moving at least one lane in their direction (lanes count counterclockwise)
      let moved = lane - from;
      if (moved > 30) moved -= 60;
      if (moved < -30) moved += 60;
      const type = moved > 0 ? "slideCCW" : "slideCW";
      const { target } = finger;
      const slides = this.closestNotes([type], from, time, target);
      this.hitNotes(
        slides.length ? slides : this.closestNotes([type], lane, time, target)
      );

      // Touch notes, hold starts and slides you move into from outside
      for (const found of [
        ...this.closestNotes(["touch", "hold"], lane, time, target),
        ...this.closestNotes(["slideCW", "slideCCW"], lane, time, target)
      ]) {
        if (!this.covers(found.note.pos, found.note.size, from))
          this.hitNote(found);
      }
    }

    // Snaps: a quick swipe in or out
    if (time - finger.swipeStart > SWIPE_MS) {
      finger.swipeFrom = radius;
      finger.swipeStart = time;
    }
    const swiped = radius - finger.swipeFrom;
    if (Math.abs(swiped) >= SNAP_SWIPE) {
      this.hitNotes(
        this.closestNotes(
          [swiped < 0 ? "snapIn" : "snapOut"],
          finger.lane,
          time,
          finger.target
        )
      );
      finger.swipeFrom = radius;
      finger.swipeStart = time;
    }
  }

  // Judging

  setChart(chart) {
    chart.notes.forEach((note, index) => (note.index = index));
    // Note times in order, to find the ones near a time quickly
    this.noteTimes = Float64Array.from(chart.notes, (note) => note.time);
    this.cutHitWindows(chart.notes);
    // Where the chart's objects sit in scroll distance and in time, so visibleObjects can skip
    // loops with nothing on screen. Not always in order (reverses, negative speeds)
    chart.scaledRange = [Infinity, -Infinity];
    chart.timeRange = [Infinity, -Infinity];
    const include = ({ scaled, time }) => {
      chart.scaledRange[0] = Math.min(chart.scaledRange[0], scaled);
      chart.scaledRange[1] = Math.max(chart.scaledRange[1], scaled);
      chart.timeRange[0] = Math.min(chart.timeRange[0], time);
      chart.timeRange[1] = Math.max(chart.timeRange[1], time);
    };
    for (const note of chart.notes) {
      include(note);
      note.points?.forEach(include);
    }
    chart.syncConnectors.forEach(include);
    chart.measureLines.forEach(include);
    this.chart = chart;
    this.version++;
    if (this.judgedNotes) this.resetJudging();
  }

  // Each note's hit windows in ms, [early, late] for marvelous/great/good. Like SaturnEdit:
  // notes that share lanes cut each other's windows in the middle, and notes on a hold
  // end lose their early great/good
  cutHitWindows(notes) {
    const base = (note) =>
      HIT_WINDOWS[note.type].map(([early, late]) => [
        early * FRAME_MS,
        late * FRAME_MS
      ]);
    const overlaps = (a, b) =>
      mod60(b.pos - a.pos) < a.size || mod60(a.pos - b.pos) < b.size;
    const earliest = (windows) => Math.min(...windows.map(([early]) => early));
    const latest = (windows) => Math.max(...windows.map(([, late]) => late));
    const holdEnds = notes
      .filter((note) => note.type === "hold")
      .map((note) => ({ ...note.points.at(-1), time: note.endTime }));

    for (const note of notes) {
      note.windows = base(note);
      if (
        holdEnds.some((end) => end.time === note.time && overlaps(note, end))
      ) {
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
        for (const window of note.windows)
          window[1] = Math.min(window[1], middle);
      }

      for (let j = i - 1; j >= 0; j--) {
        const previous = notes[j];
        if (previous.time === note.time || !overlaps(note, previous)) continue;
        if (previous.time + latest(base(previous)) <= from) break;
        const middle = (previous.time - note.time) / 2;
        for (const window of note.windows)
          window[0] = Math.max(window[0], middle);
      }

      note.lateLimit = latest(note.windows);
    });
  }

  // Start judging fresh from now, earlier notes are left alone
  resetJudging() {
    this.judgeFrom = this.time;
    this.judgedNotes.clear();
    this.missedHolds.clear();
    this.missedNotes.clear();
    this.activeHolds.length = 0;
    this.resetBot();
  }

  noteKey(note, base) {
    return base * 1000 + note.index;
  }

  // First note at or after a chart time
  noteIndexAt(time) {
    const times = this.noteTimes;
    let low = 0;
    let high = times.length;
    while (low < high) {
      const middle = (low + high) >> 1;
      if (times[middle] < time) low = middle + 1;
      else high = middle;
    }
    return low;
  }

  // Unjudged notes near the given time, with their timing (negative = early)
  *playableNotes(time) {
    const loopIndex = Math.floor(time / this.loopMs);
    const notes = this.chart.notes;
    for (let k = -1; k <= 1; k++) {
      const base = (loopIndex + k) * this.loopMs;
      for (let i = this.noteIndexAt(time - 400 - base); i < notes.length; i++) {
        const note = notes[i];
        const t = base + note.time;
        if (t > time + 400) break;
        if (t < this.judgeFrom) continue;
        const key = this.noteKey(note, base);
        if (this.judgedNotes.has(key)) continue;
        yield { note, base, key, t, delta: time - this.judgementOffset - t };
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

  // Closest note of the given types under the finger that's in its window, and any
  // others with it at the same time (overlapping holds start together)
  closestNotes(types, lane, time, target = null) {
    let best = null;
    const all = [];
    for (const candidate of this.playableNotes(time)) {
      if (target !== null && candidate.key !== target) continue;
      if (!types.includes(candidate.note.type)) continue;
      if (!this.covers(candidate.note.pos, candidate.note.size, lane)) continue;
      if (!this.gradeFor(candidate.note, candidate.delta)) continue;
      all.push(candidate);
      if (!best || Math.abs(candidate.delta) < Math.abs(best.delta))
        best = candidate;
    }
    return best ? all.filter(({ t }) => t === best.t) : [];
  }

  hitNotes(found) {
    for (const candidate of found) this.hitNote(candidate);
  }

  // Panels a finger presses, lanes x rows starting at its cell. The bot has big
  // fingers, it always presses a 2x2 patch, never a single panel
  fingerSpread(id) {
    if (typeof id === "string" && id.startsWith("bot"))
      return { lanes: 2, rows: 2 };
    return { lanes: 1, rows: 1 };
  }

  // Where the bot puts its finger so its 2 lane patch lands on the middle of a note
  botLane(pos, size) {
    return mod60(Math.round(pos + size / 2) - 1);
  }

  // First row of a finger's patch, kept on the ring
  patchRow(row, rows) {
    return Math.max(0, Math.min(row, RING_ROWS - rows));
  }

  // Calls fn(lane, row) for every panel a finger presses
  eachFingerCell(finger, fn) {
    const { lanes, rows } = finger.spread;
    const first = this.patchRow(finger.row, rows);
    for (let d = 0; d < lanes; d++) {
      for (let row = first; row < first + rows; row++)
        fn(mod60(finger.lane + d), row);
    }
  }

  // A finger covers its lane and one on each side (more for wide fingers)
  covers(pos, size, lane, reach = 1) {
    for (let offset = -reach; offset <= reach; offset++) {
      if (mod60(lane + offset - pos) < size) return true;
    }
    return false;
  }

  chainTouched(note, noteTime, delta) {
    const opened = noteTime + note.windows[0][0];
    for (const finger of this.fingers.values()) {
      if (!this.covers(note.pos, note.size, finger.lane, finger.spread.lanes))
        continue;
      if (delta >= 0 || finger.since >= opened) return true;
    }
    return false;
  }

  touching(pos, size) {
    for (const finger of this.fingers.values()) {
      if (this.covers(pos, size, finger.lane, finger.spread.lanes)) return true;
    }
    return false;
  }

  hitNote(found, kind = found && this.gradeFor(found.note, found.delta)) {
    if (!found) return;
    const { note, base, key, delta } = found;
    this.judgedNotes.add(key);
    const detail = kind === "marvelous" ? null : delta < 0 ? "FAST" : "LATE";
    this.judge(kind, detail, note);
    this.emit("hit", { note });

    if (note.type === "hold") {
      this.activeHolds.push({
        note,
        base,
        key,
        kind,
        detail,
        held: true,
        releasedFor: 0
      });
    }
  }

  updateJudging(dt) {
    const now = this.time;

    for (const candidate of this.playableNotes(now)) {
      const { note, delta } = candidate;

      // Chains have no attack judgement, touching them is enough. Touched inside the window
      // hits right away, already held from before hits right on time
      if (
        note.type === "chain" &&
        delta >= note.windows[0][0] &&
        this.chainTouched(note, now - delta, delta)
      ) {
        this.hitNote(candidate, "marvelous");
        continue;
      }

      if (delta > note.lateLimit && this.isJudging()) {
        this.judgedNotes.add(candidate.key);
        this.missedNotes.add(candidate.key);
        this.judge("miss", null, note);
        // Missed hold start means the whole hold is gone
        if (note.type === "hold") {
          this.missedHolds.add(candidate.key);
          this.activeHolds.push({
            ...candidate,
            kind: "miss",
            detail: null,
            held: false
          });
        }
      }
    }

    // Holds end with the start's rating. Let go too long and they're dropped: grey, end is a miss
    for (let i = this.activeHolds.length - 1; i >= 0; i--) {
      const hold = this.activeHolds[i];
      const local = now - hold.base;
      const shape = this.holdShapeAt(hold.note, local);
      hold.held =
        hold.kind !== "miss" &&
        this.touching(Math.round(shape.pos), Math.round(shape.size));
      if (hold.kind !== "miss" && this.isJudging()) {
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
      for (const set of [
        this.judgedNotes,
        this.missedHolds,
        this.missedNotes
      ]) {
        for (const key of set) if (key < oldest) set.delete(key);
      }
    }
  }

  judge(kind, detail, note) {
    // No judging: hits still clear notes, but nothing counts
    if (!this.isJudging()) return;
    const value = this.noteValue(note);
    const rate = SCORE_RATES[kind];

    this.combo = kind === "miss" ? 0 : this.combo + 1;
    this.judged++;
    // Misses drain the clear gauge, it doesn't go below empty
    this.gauge = Math.max(0, this.gauge + this.normaFor(note)[kind]);
    this.earned += value * rate;
    this.lost += value * (1 - rate);
    this.judgement = { kind, detail, start: this.time };
  }

  // Score a note (or a hold's start or end) is worth at Marvelous: an even share of 1,000,000,
  // R notes get two shares
  noteValue(note) {
    return (1000000 * (note.rNote ? 2 : 1)) / this.totals().shares;
  }

  // What a note (or a hold's start or end) does to the clear gauge per grade, see NORMA
  normaFor(note) {
    const bonus = note.bonus && this.bonusEffect !== false;
    switch (note.type) {
      case "hold":
        return NORMA.hold;
      case "chain":
        return NORMA.chain;
      case "slideCW":
      case "slideCCW":
        return bonus ? NORMA.slideBonus : NORMA.slide;
      case "snapIn":
      case "snapOut":
        return NORMA.snap;
      default:
        return bonus ? NORMA.normalBonus : NORMA.normal;
    }
  }

  // Score shares in the whole chart and the clear gauge All Marvelous ends up at. Hold ends
  // count as notes too
  totals() {
    const bonusEffect = this.bonusEffect !== false;
    if (this.chart.totals?.bonusEffect !== bonusEffect) {
      let shares = 0;
      let gauge = 0;
      for (const note of this.chart.notes) {
        const parts = note.type === "hold" ? 2 : 1;
        shares += (note.rNote ? 2 : 1) * parts;
        gauge += this.normaFor(note).marvelous * parts;
      }
      this.chart.totals = { bonusEffect, shares, gauge };
    }
    return this.chart.totals;
  }

  // How full the clear gauge is, 0-1
  gaugeFill() {
    const { gauge } = this.totals();
    return gauge > 0 ? Math.min(1, this.gauge / gauge) : 0;
  }

  endHold(hold) {
    this.judge(hold.kind, hold.detail, hold.note);
    if (hold.kind === "miss") return;
    this.emit("holdEnd", { note: hold.note });
  }

  // Autoplay: a bot plays with its own fingers until someone clicks in

  takeOver() {
    this.lastInput = this.time;
    if (this.playing) return;

    this.playing = true;
    this.resetBot();
    // Your play starts fresh, what the bot (or nobody) did before isn't yours
    this.resetStats();
    this.judgement = null;
  }

  // Back to the bot (or to nobody), skipping whatever is already at the line
  handBack() {
    this.playing = false;
    this.judgeFrom = this.time;
  }

  resetBot() {
    const bot = this.bot;
    for (const id of this.fingers.keys()) {
      if (typeof id === "string" && id.startsWith("bot"))
        this.fingers.delete(id);
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
      if (candidate.t < now - 30 || candidate.t > now + BOT_LOOKAHEAD_MS)
        continue;
      if (bot.planned.has(candidate.key)) continue;
      bot.planned.add(candidate.key);
      this.planBotNote(candidate);
    }

    bot.actions.sort((a, b) => a.time - b.time);
    while (bot.actions.length > 0 && bot.actions[0].time <= now) {
      const action = bot.actions.shift();
      action.run(action.time);
    }

    // Follow held holds, staying on their middle
    for (let i = bot.holds.length - 1; i >= 0; i--) {
      const { id, note, base, row } = bot.holds[i];
      if (!this.fingers.has(id) || now - base >= note.endTime) {
        this.fingers.delete(id);
        bot.holds.splice(i, 1);
        continue;
      }
      const shape = this.holdShapeAt(note, now - base);
      this.fingerMove(
        id,
        this.botLane(shape.pos, shape.size),
        rowRadius(row),
        row,
        now
      );
    }

    if (bot.planned.size > 400) {
      const oldest = (Math.floor(now / this.loopMs) - 1) * this.loopMs * 1000;
      for (const key of bot.planned) if (key < oldest) bot.planned.delete(key);
    }
  }

  planBotNote({ note, base, key, t }) {
    const { bot } = this;
    const id = `bot${bot.fingerCount++}`;
    // Right on the middle of the note
    const lane = this.botLane(note.pos, note.size);
    const at = (time, run) => bot.actions.push({ time, run });

    // Roll a grade for the skill level, then aim for that grade's part of the window.
    // A miss is just not pressing
    const offset = this.botOffset(note);
    if (offset === null) return;
    const time = t + this.judgementOffset + offset;

    const row = BOT_ROW;
    const radius = rowRadius(row);

    if (note.type === "slideCW" || note.type === "slideCCW") {
      // Drag across it a bit, like a hand would
      const direction = note.type === "slideCCW" ? 1 : -1;
      at(time - 40, (t) =>
        this.fingerDown(id, mod60(lane - direction), radius, row, t, key)
      );
      for (let step = 0; step < 3; step++) {
        at(time + step * 40, (t) =>
          this.fingerMove(id, mod60(lane + step * direction), radius, row, t)
        );
      }
      at(time + 170, () => this.fingers.delete(id));
    } else if (note.type === "snapIn" || note.type === "snapOut") {
      // Swipe across the rows, towards the screen for snap in
      const [from, to] =
        note.type === "snapIn" ? [RING_ROWS - 1, 0] : [0, RING_ROWS - 1];
      at(time - 40, (t) =>
        this.fingerDown(id, lane, rowRadius(from), from, t, key)
      );
      at(time, (t) => this.fingerMove(id, lane, rowRadius(to), to, t));
      at(time + 80, () => this.fingers.delete(id));
    } else if (note.type === "hold") {
      at(time, (t) => {
        this.fingerDown(id, lane, radius, row, t, key);
        bot.holds.push({ id, note, base, row });
      });
    } else {
      at(time, (t) => this.fingerDown(id, lane, radius, row, t, key));
      at(time + 110, () => this.fingers.delete(id));
    }
  }

  // Timing offset (ms) that lands the grade the bot rolled, null for a miss
  botOffset(note) {
    const odds =
      BOT_SKILLS[this.features.botSkill] ?? BOT_SKILLS["all-marvelous"];
    let roll = Math.random();
    let grade = "marvelous";
    for (const [name, chance] of Object.entries(odds)) {
      grade = name;
      if ((roll -= chance) < 0) break;
    }
    if (grade === "miss") return null;

    // Chains are marvelous or miss. Otherwise the part of the grade's window that's outside
    // the better grade's, early or late. Cut windows can leave nothing, then it goes up a grade
    let index = note.type === "chain" ? 0 : HIT_GRADES.indexOf(grade);
    while (index > 0) {
      const [early, late] = note.windows[index];
      const [betterEarly, betterLate] = note.windows[index - 1];
      const sides = [
        [early, betterEarly],
        [betterLate, late]
      ].filter(([from, to]) => to - from > 2);
      if (sides.length > 0) {
        const [from, to] = sides[Math.floor(Math.random() * sides.length)];
        // Away from the edges so the frame it lands on doesn't matter
        return from + (to - from) * (0.25 + Math.random() * 0.5);
      }
      index--;
    }
    return 0;
  }

  // How far the left and right edge of a hold move between two of its points, in lanes
  // (counterclockwise is positive). Like SaturnData (FlipHoldInterpolation, BakeHoldNote): both
  // edges go the same way around, the short way for the middle of the hold
  holdSegment(a, b) {
    const flip = Math.abs(a.pos + a.size / 2 - (b.pos + b.size / 2)) > 30;
    const turn = (delta) => (flip ? delta - 60 * Math.sign(delta) : delta);
    return [turn(b.pos - a.pos), turn(b.pos + b.size - (a.pos + a.size))];
  }

  // Where to put a hold's edges when drawing it between two times (base + chart time), as
  // [time, pos, size]. At the hold's own points, every 20ms on curves (4 steps on straight
  // parts, for the perspective), and at least once per lane an edge moves, so edges follow the
  // circle even when a hold jumps many lanes at once. Fixed in chart time like SaturnView, so
  // they don't shift from frame to frame. Shapes come from each segment's own two points, so
  // two points at the same time (an instant jump) come out as a jump along the circle
  holdSamples(note, base, from, to) {
    const samples = [];
    const shapeAt = (time) => {
      const shape = this.holdShapeAt(note, time - base);
      samples.push([time, shape.pos, shape.size]);
    };

    shapeAt(from);
    const points = note.points;
    for (let i = 0; i < points.length - 1; i++) {
      const start = points[i];
      const a = base + start.time;
      const b = base + points[i + 1].time;
      if (b <= from || a >= to) continue;
      const [left, right] = this.holdSegment(start, points[i + 1]);
      const straight = left === 0 && right === 0;
      const steps = Math.max(
        straight ? 4 : Math.ceil((b - a) / 20),
        Math.ceil(Math.max(Math.abs(left), Math.abs(right)))
      );
      for (let step = 1; step <= steps; step++) {
        const f = step / steps;
        const t = a + (b - a) * f;
        if (t > from && t < to)
          samples.push([
            t,
            start.pos + left * f,
            start.size + (right - left) * f
          ]);
      }
    }
    shapeAt(to);
    return samples;
  }

  holdShapeAt(note, localTime) {
    const points = note.points;
    let i = 0;
    while (i < points.length - 2 && points[i + 1].time <= localTime) i++;

    const a = points[i];
    const b = points[i + 1];
    const t =
      b.time === a.time
        ? 1
        : clamp((localTime - a.time) / (b.time - a.time), 0, 1);
    const [left, right] = this.holdSegment(a, b);

    return {
      pos: a.pos + left * t,
      size: a.size + (right - left) * t
    };
  }

  // What's on screen, for views to draw

  // Everything within view (scroll distance from now to where things appear):
  //   items: { kind, object, progress, size }, kind 0 = note, 1 = sync connector, 2 = measure line
  //   count: how many items are used (the array is reused across frames)
  //   sorted: the used items in drawing order, far first, lines under notes, holds under other
  //     notes, big notes under small
  //   holds: { note, base, missed, held } hold bodies
  // Progress is 0 where things appear and 1 at the judgement line. Views with the same settings
  // share the result until the session changes, so treat it as read only
  visibleObjects(view, { barlines = true, linear = false } = {}) {
    const cacheKey = `${view}|${barlines}|${linear}`;
    let out = this.visibleCache.get(cacheKey);
    if (!out) {
      // Speed changes make new keys, don't keep old ones around
      if (this.visibleCache.size >= 8) this.visibleCache.clear();
      out = { version: -1, items: [], count: 0, sorted: [], holds: [] };
      this.visibleCache.set(cacheKey, out);
    }
    if (out.version === this.version) return out;
    out.version = this.version;

    const { chart, loopMs, time: now } = this;
    const loopIndex = Math.floor(now / loopMs);

    out.count = 0;
    out.holds.length = 0;
    const push = (kind, object, progress, size) => {
      let item = out.items[out.count];
      if (!item) {
        item = {};
        out.items.push(item);
      }
      item.kind = kind;
      item.object = object;
      item.progress = progress;
      item.size = size;
      out.count++;
    };

    // Positions go by how far things have scrolled, so speed changes show
    const nowScaled = linear ? now : this.scaledAt(now);
    const [lowest, highest] = linear ? chart.timeRange : chart.scaledRange;

    // During a reverse only its own notes show, and only in this loop
    const songNow = now - loopIndex * loopMs;
    const reverse = linear
      ? -1
      : chart.reverses.findIndex(
          (r) => songNow > r.start && songNow <= r.middle
        );
    const hidden = (object, k) =>
      reverse !== -1 && (k !== 0 || object.reverse !== reverse);

    // This loop, and the ones before and after when they reach into view
    for (let k = -1; k <= 1; k++) {
      // Nothing from before the song, the start would show the end of it
      if (loopIndex + k < 0) continue;
      const base = (loopIndex + k) * loopMs;
      const baseScaled = linear
        ? base
        : (loopIndex + k) * this.source.scaledLength;
      if (
        baseScaled + highest < nowScaled - view * (NOTE_PAST_LINE - 1) ||
        baseScaled + lowest > nowScaled + view
      ) {
        continue;
      }
      const progressOf = (object) =>
        1 -
        (baseScaled + (linear ? object.time : object.scaled) - nowScaled) /
          view;

      for (const note of chart.notes) {
        if (hidden(note, k)) continue;
        const key = this.noteKey(note, base);

        if (note.type === "hold") {
          if (
            progressOf(note.points.at(-1)) > PAST_LINE ||
            progressOf(note) < 0
          )
            continue;
          const held = this.activeHolds.some(
            (hold) => hold.key === key && hold.held
          );
          // How held it looks, 0-1. With nobody judging, as if held once it reaches the line
          const active = held
            ? 1
            : this.isJudging()
              ? 0
              : clamp((now - (base + note.time)) / HOLD_ACTIVE_FADE_MS, 0, 1);
          out.holds.push({
            note,
            base,
            missed: this.missedHolds.has(key),
            held,
            active
          });
        }

        // Hit notes are gone. The rest keep going until they've scrolled past the line, notes
        // from before a seek or while scrubbing too, so their arrows scroll out instead of popping
        if (this.judgedNotes.has(key) && !this.missedNotes.has(key)) continue;
        const progress = progressOf(note);
        if (progress < 0 || progress > NOTE_PAST_LINE) continue;
        push(0, note, progress, note.size);
      }

      for (const connector of chart.syncConnectors) {
        const progress = progressOf(connector);
        if (
          hidden(connector, k) ||
          base + connector.time < now ||
          progress < 0 ||
          progress > PAST_LINE
        )
          continue;
        push(1, connector, progress, 60);
      }

      // Measure lines keep going past the judgement line, out to the edge of the screen.
      // The one at the very start only shows when the song loops back into it,
      // the first time through it would sit on the line at 0:00
      if (barlines) {
        const lines = chart.measureLines;
        for (let i = loopIndex + k === 0 ? 1 : 0; i < lines.length; i++) {
          const line = lines[i];
          const progress = progressOf(line);
          if (hidden(line, k) || progress < 0 || progress > PAST_LINE) continue;
          push(2, line, progress, 60);
        }
      }
    }

    out.sorted.length = 0;
    for (let i = 0; i < out.count; i++) out.sorted.push(out.items[i]);
    out.sorted.sort((a, b) => {
      if (a.progress !== b.progress) return a.progress - b.progress;
      if (a.kind !== b.kind) return b.kind - a.kind;
      // Holds under the notes they share a timing with
      const aHold = a.object?.type === "hold";
      if (aHold !== (b.object?.type === "hold")) return aHold ? -1 : 1;
      return b.size - a.size;
    });
    return out;
  }

  // Earliest moment of a hold that's still shown: holds go past the judgement line until they're
  // PAST_LINE out, what's further gets left off. Null when all of it is. Linear goes by plain
  // time instead of scroll distance, like visibleObjects
  holdShownFrom(note, base, view, linear = false) {
    const at = linear ? (t) => t : (t) => this.scaledAt(t);
    const nowAt = at(this.time);
    const gone = (t) => nowAt - at(t) > view * (PAST_LINE - 1);
    const end = base + note.endTime;
    if (gone(end)) return null;
    let from = base + note.time;
    if (!gone(from)) return from;
    let shown = end;
    for (let i = 0; i < 20; i++) {
      const middle = (from + shown) / 2;
      if (gone(middle)) from = middle;
      else shown = middle;
    }
    return shown;
  }

  // Which lanes are hidden right now, including the sweep animations
  updateLaneMasks() {
    const previous = this.previousLaneHidden;
    previous.set(this.laneHidden);
    // Everything's masked until the chart shows it
    const hidden = this.laneHidden;
    hidden.fill(1);

    const local = this.time % this.loopMs;
    // Reveals right at the start only sweep in when the song is played from its start,
    // after seeking past it or when the song loops they're instant
    const sweepStart = Math.floor(this.time / this.loopMs) === this.revealLoop;
    for (const toggle of this.chart.laneToggles) {
      if (toggle.time > local) break;

      const duration = toggle.time > 0 || sweepStart ? toggle.duration : 0;
      const progress =
        duration > 0 ? clamp((local - toggle.time) / duration, 0, 1) : 1;
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

    for (let lane = 0; lane < 60; lane++) {
      if (hidden[lane] !== previous[lane]) {
        this.laneMaskVersion++;
        break;
      }
    }
  }
}
