import { useTheme } from "vuetify";

// Theme colors for chart.js, which can't read the CSS variables
export function useChartTheme() {
  const theme = useTheme();
  const themeName = computed(() => theme.global.name.value);
  const colors = computed(() => theme.current.value.colors);
  const isDark = computed(() => theme.current.value.dark);

  function surfaceColor() {
    return colors.value.surface;
  }

  function inkColor(alpha) {
    return withAlpha(colors.value["on-surface"], alpha);
  }

  // The difficulty's theme color (see plugins/vuetify.ts), with hard and inferno tweaked
  // so their lines stay visible on light and dark backgrounds
  function difficultyColor(id) {
    if (id === 2 && !isDark.value) return "#f0bf00";
    if (id === 4 && isDark.value) return "#b43cc2";
    return colors.value[`difficulty-${id}`];
  }

  return { themeName, isDark, surfaceColor, inkColor, difficultyColor };
}

export function withAlpha(hex, alpha) {
  const digits = hex.replace("#", "");
  const n = parseInt(
    digits.length === 3 ? digits.replace(/./g, "$&$&") : digits,
    16
  );
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}
