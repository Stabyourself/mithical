import { useTheme } from "vuetify";
import waccaDifficulties from "~/assets/wacca/waccaDifficulties";

// colors for chart.js since it can't read the vuetify css vars
export function useChartTheme() {
  const theme = useTheme();

  // theme.current is empty for some reason, computedThemes works
  const themeDef = computed(
    () =>
      theme.computedThemes?.value?.[theme.global.name.value] ??
      theme.current.value,
  );
  const themeName = computed(() => theme.global.name.value);
  const isDark = computed(() => !!themeDef.value.dark);

  function surfaceColor() {
    return (
      themeDef.value.colors?.surface ?? (isDark.value ? "#333333" : "#ffffff")
    );
  }

  function inkColor(alpha) {
    const hex = (
      themeDef.value.colors?.["on-surface"] ??
      (isDark.value ? "#ffffff" : "#000000")
    ).replace("#", "");
    const n = parseInt(hex.length === 3 ? hex.replace(/./g, "$&$&") : hex, 16);
    return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
  }

  // tweaked so hard/inferno stay visible on light/dark
  function difficultyColor(id) {
    if (id === 2 && !isDark.value) return "#f0bf00";
    if (id === 4 && isDark.value) return "#b43cc2";
    return waccaDifficulties[id - 1].color;
  }

  return { themeName, isDark, surfaceColor, inkColor, difficultyColor };
}

export function withAlpha(hex, alpha) {
  const n = parseInt(hex.replace("#", ""), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}
