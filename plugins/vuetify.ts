import { createVuetify } from "vuetify";
import type { ThemeDefinition } from "vuetify";
import waccaDifficulties from "~/assets/wacca/waccaDifficulties";

// The site's themes: a Light, Dark and Oled base, each in Reverse (pink) and Plus (blue),
// named like "waccaDarkPlus" (see useWaccaTheme)
const BASES: Record<string, ThemeDefinition> = {
  Light: {
    dark: false,
    colors: { boxcolor: "#333333" }
  },
  Dark: {
    dark: true,
    colors: { surface: "#333333", boxcolor: "#333333" }
  },
  Oled: {
    dark: true,
    colors: {
      navbar: "#000000",
      surface: "#000000",
      boxcolor: "#000000",
      "surface-variant": "#777777"
    },
    // Boxes get a white outline on the black
    variables: { "box-border": "1px solid white" }
  }
};
const ACCENTS: Record<string, string> = { "": "#e50065", Plus: "#00a9fd" };

// The difficulty colors, as difficulty-1 (normal) to difficulty-4 (inferno), with the text
// color that goes on them
const DIFFICULTY_COLORS = Object.fromEntries(
  waccaDifficulties.flatMap((difficulty) => [
    [`difficulty-${difficulty.id}`, difficulty.color],
    [`on-difficulty-${difficulty.id}`, difficulty.onColor]
  ])
);

function buildTheme(base: ThemeDefinition, accent: string): ThemeDefinition {
  const colors: Record<string, string> = {
    primary: accent,
    navbar: accent,
    ...DIFFICULTY_COLORS,
    ...base.colors
  };
  // See-through boxes over the page background, 65% opaque
  colors["box-glass"] = `${colors.boxcolor}a6`;

  return {
    dark: base.dark,
    colors,
    variables: { "box-border": "none", ...base.variables }
  };
}

const themes = Object.fromEntries(
  Object.entries(BASES).flatMap(([baseName, base]) =>
    Object.entries(ACCENTS).map(([version, accent]) => [
      `wacca${baseName}${version}`,
      buildTheme(base, accent)
    ])
  )
);

export default defineNuxtPlugin({
  name: "vuetify",
  dependsOn: ["preferences"],
  setup(nuxtApp) {
    // Starts in the picked theme and follows it, see useWaccaTheme
    const themeName = useWaccaTheme();
    const vuetify = createVuetify({
      theme: { defaultTheme: themeName.value, themes }
    });
    watch(themeName, (name) => vuetify.theme.change(name));

    nuxtApp.vueApp.use(vuetify);
  }
});
