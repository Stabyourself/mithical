// Settings and cards remembered in localStorage, as state for the whole app: the theme
// (Light, Dark or Oled), the WACCA version, the cards and which one is active, and the
// options of the chart view on song pages.
// Light and Plus unless picked otherwise. Other plugins use these, so they depend on this one
export default defineNuxtPlugin({
  name: "preferences",
  setup() {
    const theme = useState(
      "theme",
      () => localStorage.getItem("theme") || "Light"
    );
    const version = useState("version", () => {
      const stored = parseInt(localStorage.getItem("version"));
      return stored === 300 || stored === 400 ? stored : 400;
    });
    const cards = useState("cards", () =>
      JSON.parse(localStorage.getItem("cards") || "[]")
    );
    const activeCard = useState(
      "activeCard",
      () => localStorage.getItem("activeCard") || cards.value[0]?.luid
    );

    // What the song pages' chart view shows and whether a bot plays, see pages/songs/[slug].vue
    const chartViewFeatures = useState("chartViewFeatures", () => {
      let stored = {};
      try {
        stored = JSON.parse(localStorage.getItem("chartViewFeatures")) ?? {};
      } catch {
        // Broken value, start over
      }
      return {
        judging: "off",
        // Your profile's options instead of the defaults
        userOptions: true,
        ring: false,
        songCount: false,
        score: false,
        progressBar: false,
        bot: "none",
        display: "defaultColor",
        type: "circle",
        ...stored
      };
    });

    watch(theme, (value) => localStorage.setItem("theme", value));
    watch(version, (value) => localStorage.setItem("version", value));
    watch(
      chartViewFeatures,
      (value) =>
        localStorage.setItem("chartViewFeatures", JSON.stringify(value)),
      { deep: true }
    );
    watch(activeCard, (value) => {
      if (value) localStorage.setItem("activeCard", value);
    });
  }
});
