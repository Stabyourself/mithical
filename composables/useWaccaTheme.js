// Name of the Vuetify theme for the site (see plugins/vuetify.ts): the picked theme
// (Light, Dark or Oled), in its Plus colors when showing WACCA Plus
export function useWaccaTheme() {
  const theme = useState("theme");
  const version = useState("version");
  return computed(
    () => `wacca${theme.value}${version.value == 400 ? "Plus" : ""}`
  );
}
