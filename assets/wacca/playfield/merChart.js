// Loads MER charts (the format MercuryMapper and the game use) and turns them into
// what the preview draws. Format reference: MercuryMapper's FormatHandler.cs
// Lane 0 is at 3 o'clock, counterclockwise (15 = top, 30 = left, 45 = bottom)

const TICKS_PER_MEASURE = 1920;

// MER note ids -> preview note types
const NOTE_TYPES = {
  1: "touch",
  2: "touch",
  20: "touch",
  3: "snapIn",
  21: "snapIn",
  4: "snapOut",
  22: "snapOut",
  5: "slideCW",
  6: "slideCW",
  23: "slideCW",
  7: "slideCCW",
  8: "slideCCW",
  24: "slideCCW",
  16: "chain",
  26: "chain",
};
const BONUS_IDS = new Set([2, 6, 8]);
const R_NOTE_IDS = new Set([20, 21, 22, 23, 24, 25, 26]);
const HOLD_START_IDS = new Set([9, 25]);
const HOLD_POINT_ID = 10;
const MASK_ADD_ID = 12;
const MASK_REMOVE_ID = 13;
const END_OF_CHART_ID = 14;
const MASK_DIRECTIONS = ["ccw", "cw", "center"];

// Gimmick ids
const BPM_CHANGE = 2;
const TIME_SIG_CHANGE = 3;
const SPEED_CHANGE = 5;
const STOP_START = 9;
const STOP_END = 10;
const REVERSE_START = 6;
const REVERSE_MIDDLE = 7;
const REVERSE_END = 8;

// Raw chart: gimmicks and objects in ticks, holds linked up
function parseMer(text) {
  const lines = text.split(/\r?\n/);
  const body = lines.findIndex((line) => line.trim() === "#BODY");
  const chart = { gimmicks: [], speedEvents: [], reverses: [], notes: [], masks: [], endTick: null };
  let reverse = null;
  const objects = new Map();

  for (const line of lines.slice(body + 1)) {
    const fields = line.trim().split(/\s+/);
    if (fields.length < 3) continue;

    const tick = Number(fields[0]) * TICKS_PER_MEASURE + Number(fields[1]);
    const objectId = Number(fields[2]);

    if (objectId !== 1) {
      if (objectId === BPM_CHANGE) chart.gimmicks.push({ tick, bpm: Number(fields[3]) });
      if (objectId === SPEED_CHANGE) chart.speedEvents.push({ tick, speed: Number(fields[3]) });
      if (objectId === STOP_START) chart.speedEvents.push({ tick, stop: true });
      if (objectId === STOP_END) chart.speedEvents.push({ tick, stop: false });

      // Reverse comes in three parts, broken ones get skipped like SaturnData does
      if (objectId === REVERSE_START) reverse = { start: tick };
      if (objectId === REVERSE_MIDDLE && reverse && reverse.start <= tick) reverse.middle = tick;
      if (objectId === REVERSE_END && reverse?.middle !== undefined && reverse.middle <= tick) {
        reverse.end = tick;
        chart.reverses.push(reverse);
        reverse = null;
      }
      if (objectId === TIME_SIG_CHANGE) {
        // Some old charts only have the numerator
        chart.gimmicks.push({ tick, upper: Number(fields[3]), lower: Number(fields[4] ?? 4) });
      }
      continue;
    }

    const [id, index, pos, size] = fields.slice(3, 7).map(Number);
    if (id === END_OF_CHART_ID) {
      chart.endTick = tick;
    } else if (id === MASK_ADD_ID || id === MASK_REMOVE_ID) {
      chart.masks.push({
        tick,
        show: id === MASK_ADD_ID,
        pos,
        size,
        direction: MASK_DIRECTIONS[Number(fields[8])] ?? "center",
      });
    } else {
      objects.set(index, {
        tick,
        id,
        pos,
        size,
        next: HOLD_START_IDS.has(id) || id === HOLD_POINT_ID ? Number(fields[8]) : null,
      });
    }
  }

  for (const object of objects.values()) {
    if (HOLD_START_IDS.has(object.id)) {
      // Follow the links through the hold points to its end
      const points = [object];
      for (let point = object; point.next !== null && objects.has(point.next); ) {
        point = objects.get(point.next);
        points.push(point);
      }
      // Hidden points (render flag 0) still count. SaturnView skips them, but the game puts one
      // per lane on fast sweeps so they come out curved instead of as straight chords
      points.sort((a, b) => a.tick - b.tick);

      chart.notes.push({
        type: "hold",
        tick: object.tick,
        pos: object.pos,
        size: object.size,
        rNote: R_NOTE_IDS.has(object.id),
        bonus: false,
        points: points.map(({ tick, pos, size }) => ({ tick, pos, size })),
      });
    } else if (NOTE_TYPES[object.id]) {
      chart.notes.push({
        type: NOTE_TYPES[object.id],
        tick: object.tick,
        pos: object.pos,
        size: object.size,
        rNote: R_NOTE_IDS.has(object.id),
        bonus: BONUS_IDS.has(object.id),
      });
    }
  }

  chart.notes.sort((a, b) => a.tick - b.tick);
  chart.masks.sort((a, b) => a.tick - b.tick);
  chart.gimmicks.sort((a, b) => a.tick - b.tick);
  // No end marker: a measure after the last thing, hold ends included
  const lastTick = Math.max(0, ...chart.notes.map((note) => note.points?.at(-1).tick ?? note.tick));
  chart.endTick ??= Math.ceil(lastTick / TICKS_PER_MEASURE + 1) * TICKS_PER_MEASURE;
  chart.bpm = chart.gimmicks.find((gimmick) => gimmick.bpm)?.bpm ?? 120;
  chart.msAt = timing(chart.gimmicks);
  chart.lengthMs = chart.msAt(chart.endTick);
  chart.scaledAt = reversing(chart.reverses, chart.msAt, scrolling(chart.speedEvents, chart.msAt));
  chart.scaledLength = chart.scaledAt(chart.lengthMs);
  return chart;
}

// Last segment starting at or before value (segments sorted by key)
function segmentAt(segments, key, value) {
  let low = 0;
  let high = segments.length - 1;
  while (low < high) {
    const middle = (low + high + 1) >> 1;
    if (segments[middle][key] <= value) low = middle;
    else high = middle - 1;
  }
  return segments[low];
}

// Ms -> "scaled" ms, how far the notes have scrolled. Like SaturnData: speed changes
// scale the scroll speed, stops pause it (and speed changes during a stop wait for it)
function scrolling(events, msAt) {
  const segments = [{ time: 0, scaled: 0, speed: 1 }];
  let speed = 1;
  let stopped = false;

  for (const event of [...events].sort((a, b) => a.tick - b.tick)) {
    const time = msAt(event.tick);
    const last = segments.at(-1);
    const scaled = last.scaled + (time - last.time) * last.speed;
    if (event.speed !== undefined) speed = event.speed;
    if (event.stop !== undefined) stopped = event.stop;
    segments.push({ time, scaled, speed: stopped ? 0 : speed });
  }

  return (time) => {
    const segment = segmentAt(segments, "time", time);
    return segment.scaled + (time - segment.time) * segment.speed;
  };
}

// Reverse, like SaturnData: from start to middle the scroll runs backwards from end to
// middle on an eased curve, so the notes in there fly back out. Everything else scrolls normally
function reversing(reverses, msAt, scaledAt) {
  const sections = reverses.map((reverse) => ({
    start: msAt(reverse.start),
    middle: msAt(reverse.middle),
    middleScaled: scaledAt(msAt(reverse.middle)),
    endScaled: scaledAt(msAt(reverse.end)),
  }));
  if (sections.length === 0) return scaledAt;

  return (time) => {
    for (const section of sections) {
      if (time <= section.start || time > section.middle) continue;
      const t = reverseEase((time - section.start) / (section.middle - section.start));
      return section.endScaled + t * (section.middleScaled - section.endScaled);
    }
    return scaledAt(time);
  };
}

// SaturnData's reverse curve, fast at first and settling in at the end
function reverseEase(t) {
  if (t >= 1) return t;
  if (t >= 0.965) return (t - 0.965) * 0.23162 + 0.991893;
  if (t >= 0.93) return (t - 0.93) * 0.233 + 0.983738;
  if (t >= 0.91) return (t - 0.91) * 0.311 + 0.977518;
  if (t >= 0.893) return (t - 0.893) * 0.467 + 0.969579;
  if (t >= 0.875) return (t - 0.875) * 0.623 + 0.958365;
  if (t >= 0.855) return (t - 0.855) * 0.791 + 0.942545;
  if (t >= 0.715) return (t - 0.715) * 0.934 + 0.811785;
  if (t >= 0.57) return (t - 0.57) * 1.011 + 0.66519;
  if (t >= 0) return t * 1.167;
  return t;
}

// Tick -> ms, going through the BPM and time signature changes.
// A measure is (upper / lower) whole notes, BPM counts quarter notes
function timing(gimmicks) {
  const segments = [];
  let bpm = 120;
  let measureQuarters = 4;
  let ms = 0;
  let tick = 0;

  const msPerTick = () => (60000 / bpm) * measureQuarters / TICKS_PER_MEASURE;
  for (const gimmick of gimmicks) {
    ms += (gimmick.tick - tick) * msPerTick();
    tick = gimmick.tick;
    if (gimmick.bpm) bpm = gimmick.bpm;
    if (gimmick.upper) measureQuarters = (gimmick.upper * 4) / gimmick.lower;
    segments.push({ tick, ms, msPerTick: msPerTick() });
  }
  if (segments.length === 0) segments.push({ tick: 0, ms: 0, msPerTick: msPerTick() });

  return (target) => {
    const segment = segmentAt(segments, "tick", target);
    return segment.ms + (target - segment.tick) * segment.msPerTick;
  };
}

function mod60(value) {
  return ((value % 60) + 60) % 60;
}

function mirrorPosition(pos, size) {
  return size === 60 ? pos : mod60(30 - pos - size);
}

const MIRRORED_TYPES = {
  slideCW: "slideCCW",
  slideCCW: "slideCW",
};

// What the preview draws, times in ms. Mirror flips left/right and swaps slide directions
function buildChart(chart, mirror) {
  const flip = (item) => {
    if (mirror) item.pos = mirrorPosition(item.pos, item.size);
    return item;
  };

  // Which reverse something shows in. Only the notes between middle and end show during one,
  // holds have to end in there too. Measure lines count on the edges, SaturnData does that too
  const reverses = chart.reverses.map((reverse) => ({
    start: chart.msAt(reverse.start),
    middle: chart.msAt(reverse.middle),
    middleTick: reverse.middle,
    endTick: reverse.end,
  }));
  const reverseOf = (tick, lastTick = tick, edges = false) =>
    reverses.findIndex((reverse) =>
      edges
        ? tick >= reverse.middleTick && tick <= reverse.endTick
        : tick > reverse.middleTick && tick < reverse.endTick && lastTick < reverse.endTick,
    );

  const notes = chart.notes.map((source) => {
    const note = flip({
      type: mirror ? (MIRRORED_TYPES[source.type] ?? source.type) : source.type,
      time: chart.msAt(source.tick),
      scaled: chart.scaledAt(chart.msAt(source.tick)),
      pos: source.pos,
      size: source.size,
      rNote: source.rNote,
      bonus: source.bonus,
      sync: false,
      reverse: reverseOf(source.tick, source.points?.at(-1).tick),
    });

    if (source.points) {
      note.points = source.points.map((point) =>
        flip({
          time: chart.msAt(point.tick),
          scaled: chart.scaledAt(chart.msAt(point.tick)),
          pos: point.pos,
          size: point.size,
        }),
      );
      note.endTime = note.points.at(-1).time;
    }
    return note;
  });

  // Same timestamp = sync outline + connector. Chains only count when they're R,
  // two notes in the exact same spot don't count (SaturnData)
  const syncConnectors = [];
  const byTime = new Map();

  for (const note of notes) {
    if (note.type === "chain" && !note.rNote) continue;
    if (!byTime.has(note.time)) byTime.set(note.time, []);
    byTime.get(note.time).push(note);
  }

  for (const [time, group] of byTime) {
    if (group.length < 2) continue;

    group.sort((a, b) => a.pos - b.pos);

    for (let i = 1; i < group.length; i++) {
      const current = group[i];
      const previous = group[i - 1];
      if (current.pos === previous.pos && current.size === previous.size) continue;
      current.sync = true;
      previous.sync = true;

      const position0 = mod60(current.pos + current.size - 1);
      const size0 = mod60(previous.pos - position0) + 1;
      const position1 = mod60(previous.pos + previous.size - 1);
      const size1 = mod60(current.pos - position1) + 1;

      const size = Math.min(size0, size1);
      if (size > 30) continue;

      syncConnectors.push({
        scaled: chart.scaledAt(time),
        time,
        reverse: current.reverse === previous.reverse ? current.reverse : -1,
        pos: size0 > size1 ? position1 : position0,
        size,
      });
    }
  }

  const laneToggles = chart.masks.map((mask) => {
    const toggle = flip({
      time: chart.msAt(mask.tick),
      show: mask.show,
      pos: mask.pos,
      size: mask.size,
      direction: mask.direction,
    });
    if (mirror && toggle.direction !== "center") {
      toggle.direction = toggle.direction === "cw" ? "ccw" : "cw";
    }

    // Sweep speed from SaturnData: half a frame per lane, a quarter from/to the center.
    // Right at the start it's instant, so looping doesn't replay the reveal
    toggle.duration = toggle.time <= 0 ? 0 : (toggle.size * (toggle.direction === "center" ? 1 : 2) * 1000) / 240;
    return toggle;
  });

  const measureLines = [];
  for (let tick = 0; tick < chart.endTick; tick += TICKS_PER_MEASURE) {
    measureLines.push({
      time: chart.msAt(tick),
      scaled: chart.scaledAt(chart.msAt(tick)),
      reverse: reverseOf(tick, tick, true),
    });
  }

  return { notes, syncConnectors, measureLines, laneToggles, reverses };
}

// Where a song's chart lives in public/wacca/MusicData, e.g. 3011/3011_03.mer.
// Difficulty 0-3 is normal/hard/expert/inferno
function chartPath(songId, difficulty) {
  return `/wacca/MusicData/${songId}/${songId}_${String(difficulty).padStart(2, "0")}.mer`;
}

export { parseMer, buildChart, chartPath };
