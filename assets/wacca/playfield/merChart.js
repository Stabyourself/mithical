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
const HOLD_END_ID = 11;
const MASK_ADD_ID = 12;
const MASK_REMOVE_ID = 13;
const END_OF_CHART_ID = 14;
const MASK_DIRECTIONS = ["ccw", "cw", "center"];

// Gimmick ids
const BPM_CHANGE = 2;
const TIME_SIG_CHANGE = 3;

// Raw chart: gimmicks and objects in ticks, holds linked up
function parseMer(text) {
  const lines = text.split(/\r?\n/);
  const body = lines.indexOf("#BODY");
  const chart = { gimmicks: [], notes: [], masks: [], endTick: null };
  const objects = new Map();

  for (const line of lines.slice(body + 1)) {
    const fields = line.trim().split(/\s+/);
    if (fields.length < 3) continue;

    const tick = Number(fields[0]) * TICKS_PER_MEASURE + Number(fields[1]);
    const objectId = Number(fields[2]);

    if (objectId !== 1) {
      if (objectId === BPM_CHANGE) chart.gimmicks.push({ tick, bpm: Number(fields[3]) });
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
  chart.endTick ??= Math.ceil((chart.notes.at(-1)?.tick ?? 0) / TICKS_PER_MEASURE + 1) * TICKS_PER_MEASURE;
  chart.bpm = chart.gimmicks.find((gimmick) => gimmick.bpm)?.bpm ?? 120;
  chart.msAt = timing(chart.gimmicks);
  chart.lengthMs = chart.msAt(chart.endTick);
  return chart;
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
    let segment = segments[0];
    for (const next of segments) if (next.tick <= target) segment = next;
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

  const notes = chart.notes.map((source) => {
    const note = flip({
      type: mirror ? (MIRRORED_TYPES[source.type] ?? source.type) : source.type,
      time: chart.msAt(source.tick),
      pos: source.pos,
      size: source.size,
      rNote: source.rNote,
      bonus: source.bonus,
      sync: false,
    });

    if (source.points) {
      note.points = source.points.map((point) =>
        flip({ time: chart.msAt(point.tick), pos: point.pos, size: point.size }),
      );
      note.endTime = note.points.at(-1).time;
    }
    return note;
  });

  // Same timestamp = sync outline + connector. Chains don't count
  const syncConnectors = [];
  const byTime = new Map();

  for (const note of notes) {
    if (note.type === "chain") continue;
    if (!byTime.has(note.time)) byTime.set(note.time, []);
    byTime.get(note.time).push(note);
  }

  for (const [time, group] of byTime) {
    if (group.length < 2) continue;

    group.sort((a, b) => a.pos - b.pos);

    for (let i = 0; i < group.length; i++) {
      group[i].sync = true;
      if (i === 0) continue;

      const current = group[i];
      const previous = group[i - 1];

      const position0 = mod60(current.pos + current.size - 1);
      const size0 = mod60(previous.pos - position0) + 1;
      const position1 = mod60(previous.pos + previous.size - 1);
      const size1 = mod60(current.pos - position1) + 1;

      const size = Math.min(size0, size1);
      if (size > 30) continue;

      syncConnectors.push({
        time,
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

    // Sweep speed from SaturnView: 8ms per lane, 4ms from the center. Right at the start
    // it's instant, so looping doesn't replay the reveal
    toggle.duration = toggle.time <= 0 ? 0 : toggle.size * (toggle.direction === "center" ? 4 : 8);
    return toggle;
  });

  const measureLines = [];
  for (let tick = 0; tick < chart.endTick; tick += TICKS_PER_MEASURE) {
    measureLines.push(chart.msAt(tick));
  }

  return { notes, syncConnectors, measureLines, laneToggles };
}

export { parseMer, buildChart };
