// Short looping pattern with every note type
// Lane 0 is at 3 o'clock, counterclockwise (15 = top, 30 = left, 45 = bottom). Times in beats

const bpm = 150;
const beatsPerMeasure = 4;
const measures = 4;
const loopsPerSong = 4;

const beatMs = 60000 / bpm;
const loopMs = beatMs * beatsPerMeasure * measures;

// type: touch | chain | hold | slideCW | slideCCW | snapIn | snapOut
const pattern = [
  // Measure 1
  { type: "touch", beat: 0, pos: 40, size: 6 },
  { type: "touch", beat: 0, pos: 50, size: 6 },
  { type: "touch", beat: 1, pos: 20, size: 5 },
  { type: "touch", beat: 1.5, pos: 8, size: 5 },
  { type: "snapIn", beat: 2, pos: 41, size: 9 },
  { type: "chain", beat: 3, pos: 0, size: 5 },
  { type: "chain", beat: 3.25, pos: 3, size: 5 },
  { type: "chain", beat: 3.5, pos: 6, size: 5 },
  { type: "chain", beat: 3.75, pos: 9, size: 5 },

  // Measure 2
  {
    type: "hold",
    beat: 4,
    pos: 44,
    size: 6,
    points: [
      { beat: 4, pos: 44, size: 6 },
      { beat: 5, pos: 44, size: 6 },
      { beat: 6.5, pos: 36, size: 6 },
    ],
  },
  { type: "touch", beat: 5, pos: 11, size: 8, rNote: true },
  { type: "slideCW", beat: 5.5, pos: 20, size: 10 },
  { type: "slideCCW", beat: 7, pos: 52, size: 10 },
  { type: "snapOut", beat: 7.5, pos: 25, size: 9 },

  // Measure 3: lanes 16-44 masked until the bonus slide at the bottom flips it to the right
  { type: "touch", beat: 8, pos: 4, size: 8 },
  { type: "touch", beat: 8, pos: 46, size: 8 },
  { type: "chain", beat: 9, pos: 45, size: 4 },
  { type: "chain", beat: 9.25, pos: 48, size: 4 },
  { type: "chain", beat: 9.5, pos: 51, size: 4 },
  { type: "chain", beat: 9.75, pos: 54, size: 4 },
  { type: "chain", beat: 10, pos: 57, size: 4 },
  { type: "slideCCW", beat: 10.5, pos: 46, size: 12, bonus: true },
  {
    type: "hold",
    beat: 11,
    pos: 18,
    size: 8,
    points: [
      { beat: 11, pos: 18, size: 8 },
      { beat: 12, pos: 18, size: 8 },
    ],
  },

  // Measure 4: right side is masked so everything's on the left
  { type: "slideCW", beat: 12, pos: 28, size: 12 },
  { type: "touch", beat: 12.5, pos: 18, size: 6 },
  { type: "touch", beat: 13, pos: 28, size: 6 },
  { type: "touch", beat: 13.5, pos: 38, size: 6 },
  { type: "snapIn", beat: 14, pos: 20, size: 12 },
  { type: "slideCCW", beat: 15, pos: 16, size: 12 },
  { type: "slideCW", beat: 15, pos: 32, size: 12 },
];

// Lane masks, sweep in/out like the game does. direction: "cw" | "ccw" | "center"
const laneToggles = [
  // Left side hides after the snap
  { beat: 7.75, show: false, pos: 16, size: 29, direction: "center" },
  // Bonus slide at the bottom mirrors it
  { beat: 10.75, show: true, pos: 16, size: 29, direction: "ccw" },
  { beat: 10.75, show: false, pos: 45, size: 29, direction: "center" },
  // Right side comes back after the last slides
  { beat: 15.25, show: true, pos: 45, size: 29, direction: "cw" },
];

function mod60(value) {
  return ((value % 60) + 60) % 60;
}

function mirrorPosition(pos, size) {
  return size === 60 ? pos : mod60(30 - pos - size);
}

const mirroredType = {
  slideCW: "slideCCW",
  slideCCW: "slideCW",
};

// Build the note list for one loop. Mirror flips left/right and swaps slide directions
function buildChart(mirror) {
  const notes = pattern.map((source) => {
    const note = {
      type: source.type,
      time: source.beat * beatMs,
      pos: source.pos,
      size: source.size,
      rNote: !!source.rNote,
      bonus: !!source.bonus,
      sync: false,
    };

    if (source.points) {
      note.points = source.points.map((point) => ({
        time: point.beat * beatMs,
        pos: point.pos,
        size: point.size,
      }));
      note.endTime = note.points[note.points.length - 1].time;
    }

    if (mirror) {
      note.type = mirroredType[note.type] ?? note.type;
      note.pos = mirrorPosition(note.pos, note.size);

      if (note.points) {
        for (const point of note.points) {
          point.pos = mirrorPosition(point.pos, point.size);
        }
      }
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

  const toggles = laneToggles.map((source) => {
    const toggle = {
      time: source.beat * beatMs,
      show: source.show,
      pos: source.pos,
      size: source.size,
      direction: source.direction,
    };

    if (mirror) {
      toggle.pos = mirrorPosition(toggle.pos, toggle.size);
      if (toggle.direction !== "center") {
        toggle.direction = toggle.direction === "cw" ? "ccw" : "cw";
      }
    }

    // Sweep speed from SaturnView: 8ms per lane, 4ms from the center
    toggle.duration = toggle.size * (toggle.direction === "center" ? 4 : 8);
    return toggle;
  });

  const measureLines = [];
  for (let i = 0; i < measures; i++) {
    measureLines.push(i * beatsPerMeasure * beatMs);
  }

  return { notes, syncConnectors, measureLines, laneToggles: toggles };
}

export { buildChart, bpm, beatMs, loopMs, loopsPerSong };
