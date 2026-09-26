// Note color palettes from SaturnView (https://github.com/Yasu3D/SaturnView)
// MIT licensed, see SATURNVIEW_LICENSE. Same order as SaturnView's NoteColorOption
const palettes = [
  // Light Magenta
  {
    base: "#ff4aee",
    light: "#ffc4ff",
    dark: "#d10ab7",
  },
  // Light Yellow
  {
    base: "#ffe452",
    light: "#ffffcc",
    dark: "#d1a60f",
  },
  // Orange
  {
    base: "#ff9a00",
    light: "#ffffa0",
    dark: "#d14a00",
  },
  // Lime
  {
    base: "#39d234",
    light: "#b7ffb4",
    dark: "#028d01",
  },
  // Red
  {
    base: "#d10d0d",
    light: "#ffaeae",
    dark: "#970707",
  },
  // Sky Blue
  {
    base: "#34adff",
    light: "#b4ffff",
    dark: "#015ed1",
  },
  // Dark Yellow
  {
    base: "#9c8d00",
    light: "#ffffa0",
    dark: "#4b3c00",
  },
  // Light Red ("Dark Orange" in the English UI)
  {
    base: "#ff5800",
    light: "#ffd2a0",
    dark: "#d11200",
  },
  // Yellow
  {
    base: "#fff100",
    light: "#ffffa0",
    dark: "#d1ba00",
  },
  // Pure Green
  {
    base: "#4aa170",
    light: "#c4ffec",
    dark: "#0a5123",
  },
  // Bright Blue
  {
    base: "#0051ff",
    light: "#a0cbff",
    dark: "#000ed1",
  },
  // Light Blue
  {
    base: "#6dcbff",
    light: "#e8ffff",
    dark: "#2184d1",
  },
  // Light Gray
  {
    base: "#c7c7ca",
    light: "#ffffff",
    dark: "#7e7e82",
  },
];

// Hold body colors sampled from SaturnView's hold_gradient(_active).png, start to end
const holdGradients = [
  ["#ffa9f9", "#ff89f5", "#ff77e6", "#ff64d7", "#ff57cd", "#ff51c8"],
  ["#fff296", "#ffeb72", "#ffd459", "#ffbd3f", "#ffab2b", "#ffa423"],
  ["#ffc051", "#ffa729", "#ffa020", "#ff9611", "#ff8d05", "#ff8a00"],
  ["#9beb98", "#78e276", "#5cd668", "#3fca59", "#2ac14e", "#23be4a"],
  ["#ff9394", "#fd6e71", "#ed5062", "#db2e51", "#cf1845", "#cb1041"],
  ["#34c2ff", "#18aaff", "#189dff", "#1889ff", "#1881ff", "#187eff"],
  ["#fff296", "#ffeb72", "#ffd459", "#ffbd3f", "#ffab2b", "#ffa423"],
  ["#ff9662", "#ff7239", "#ff5f27", "#ff4b15", "#ff3b06", "#ff3400"],
  ["#fff71f", "#fff10c", "#ffdf09", "#ffcc04", "#ffbf02", "#ffba00"],
  ["#68d7a3", "#42c784", "#3eb89b", "#39abab", "#38a5b6", "#37a2ba"],
  ["#6f97ff", "#4974fe", "#435ff2", "#3c47e4", "#393bde", "#3736db"],
  ["#88daff", "#64c9ff", "#61b7ff", "#5ca4ff", "#5a98ff", "#5892ff"],
  ["#d9d9d9", "#c8c8c8", "#b1b1b1", "#9d9d9d", "#8e8e8e", "#888888"],
];

const holdGradientsActive = [
  ["#ffd7fe", "#ffbbfd", "#ffa8f9", "#ff92f3", "#ff82ee", "#ff7aeb"],
  ["#fffcc7", "#fffaa2", "#fff284", "#ffe561", "#ffd844", "#ffd338"],
  ["#ffe77a", "#ffd541", "#ffd033", "#ffc71c", "#ffbf08", "#ffbc00"],
  ["#cbfbc9", "#a9f8a7", "#88f397", "#61ee84", "#43e976", "#38e771"],
  ["#ffc4c5", "#ff9ea1", "#fb788f", "#f5497a", "#f0276a", "#ee1a64"],
  ["#51e8ff", "#27d8ff", "#27cdff", "#27bbff", "#27b2ff", "#27afff"],
  ["#fffcc7", "#fffaa2", "#fff284", "#ffe561", "#ffd844", "#ffd338"],
  ["#ffc78f", "#ffa259", "#ff8c3e", "#ff7222", "#ff5b0a", "#ff5100"],
  ["#fffd32", "#fffc14", "#fff60f", "#ffee07", "#ffe603", "#ffe300"],
  ["#97f4d3", "#66ecb6", "#60e3cd", "#59dbdb", "#57d5e2", "#56d3e5"],
  ["#9fc8ff", "#6fa4ff", "#678cfc", "#5d6cf8", "#595cf6", "#5654f5"],
  ["#baf4ff", "#92ecff", "#8ee1ff", "#88d3ff", "#85c9ff", "#83c3ff"],
  ["#f4f4f4", "#ededed", "#dfdfdf", "#d0d0d0", "#c3c3c3", "#bebebe"],
];

// Where each gradient sample sits along the hold (0 = start, 1 = end)
const holdGradientStops = [0.006, 0.082, 0.25, 0.5, 0.75, 0.996];

// Profile option value (see etc/option.ts) -> palette index
const optionValueToIndex = {
  5: 0,
  6: 1,
  4: 2,
  3: 3,
  1: 4,
  2: 5,
  7: 6,
  1001: 7,
  1002: 8,
  1003: 9,
  1004: 10,
  1005: 11,
  1006: 12,
};

function paletteIndex(optionValue, fallback) {
  return optionValueToIndex[optionValue] ?? optionValueToIndex[fallback];
}

const capColors = {
  light: "#79e5ff",
  base: "#4eacf7",
  dark: "#0093e7",
};

const syncColors = {
  outline: "#3cffff",
  light: "#efffff",
  base: "#18efff",
  dark: "#003260",
};

// Console LEDs don't dim like screen pixels, dark scheme colors still show their color
// (Deep Purple's near black one is visibly purple, Darkness stays about black). Lifts the
// brightness on a gentle curve and keeps the hue: every channel scales by the same factor
const LED_CURVE = 0.7;

function ledColor([r, g, b]) {
  const max = Math.max(r, g, b);
  if (max === 0) return [0, 0, 0];
  const scale = (255 * Math.pow(max / 255, LED_CURVE)) / max;
  return [r, g, b].map((value) => Math.round(value * scale));
}

export {
  ledColor,
  palettes,
  holdGradients,
  holdGradientsActive,
  holdGradientStops,
  paletteIndex,
  capColors,
  syncColors,
};
