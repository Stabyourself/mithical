// Settings and cards remembered in localStorage, as state for the whole app: the theme
// (Light, Dark or Oled), the WACCA version, the cards and which one is active.
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

    watch(theme, (value) => localStorage.setItem("theme", value));
    watch(version, (value) => localStorage.setItem("version", value));
    watch(activeCard, (value) => {
      if (value) localStorage.setItem("activeCard", value);
    });
  }
});
