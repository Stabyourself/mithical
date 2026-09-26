<template>
  <svg class="console-swatch" viewBox="0 0 32 32" aria-hidden="true">
    <defs>
      <radialGradient
        v-for="section in sections"
        :id="`${id}-${section.name}`"
        :key="section.name"
        gradientUnits="userSpaceOnUse"
        cx="16"
        cy="16"
        :r="OUTER"
      >
        <stop :offset="INNER / OUTER" :stop-color="rgb(colors[section.index + 3])" />
        <stop offset="1" :stop-color="rgb(colors[section.index])" />
      </radialGradient>
    </defs>

    <!-- The screen in the middle -->
    <circle cx="16" cy="16" :r="INNER" fill="#150f2e" />

    <path
      v-for="section in sections"
      :key="section.name"
      :d="sector(section.from, section.to)"
      :fill="`url(#${id}-${section.name})`"
    />

    <!-- Seams between the 12 panel segments -->
    <path :d="seams" stroke="#08070d" stroke-width="0.8" />
  </svg>
</template>

<style scoped>
.console-swatch {
  flex: none;
  width: 28px;
  height: 28px;
  margin-right: 10px;
  vertical-align: middle;
}
</style>

<script setup>
import { ledColor } from "~/assets/wacca/playfield/noteColors.js";

// Mini touch ring for the "Customize Colors" dropdown, like the icon in the official
// tutorial: masked lanes (top) in the first color, open lanes in the second and a
// touched spot in the third. Dark version inside, bright outside, like the real cells
const props = defineProps({
  // Three colors plus their dark versions, as [r, g, b]
  colors: {
    type: Array,
    required: true,
  },
});

const INNER = 8;
const OUTER = 15.5;

// Unique gradient ids, the dropdown shows lots of these at once
const id = `console-swatch-${Math.random().toString(36).slice(2, 9)}`;

// Angles in degrees, 0 = right, clockwise
const sections = [
  { name: "masked", index: 0, from: 180, to: 360 },
  { name: "open", index: 1, from: 0, to: 180 },
  { name: "touched", index: 2, from: 65, to: 115 },
];

// Like the LEDs show it, see ledColor
const rgb = (color) => `rgb(${ledColor(color).join(", ")})`;

function point(radius, angle) {
  const radians = (angle * Math.PI) / 180;
  return `${16 + radius * Math.cos(radians)} ${16 + radius * Math.sin(radians)}`;
}

function sector(from, to) {
  const large = to - from > 180 ? 1 : 0;
  return [
    `M ${point(OUTER, from)}`,
    `A ${OUTER} ${OUTER} 0 ${large} 1 ${point(OUTER, to)}`,
    `L ${point(INNER, to)}`,
    `A ${INNER} ${INNER} 0 ${large} 0 ${point(INNER, from)}`,
    "Z",
  ].join(" ");
}

const seams = Array.from(
  { length: 12 },
  (_, i) => `M ${point(INNER, i * 30)} L ${point(OUTER, i * 30)}`,
).join(" ");
</script>
