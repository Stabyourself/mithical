// plugins/vuetify.js
import { createVuetify } from "vuetify";
import type { ThemeDefinition } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

const waccaLightTheme: ThemeDefinition = {
  dark: false,
  colors: {
    primary: "#e50065",
    navbar: "#e50065",
    boxcolor: "#333",
  },
};

const waccaDarkTheme: ThemeDefinition = {
  dark: true,
  colors: {
    primary: "#e50065",
    navbar: "#e50065",
    surface: "#333",
    boxcolor: "#333",
  },
};

const waccaOledTheme: ThemeDefinition = {
  dark: true,
  colors: {
    primary: "#e50065",
    navbar: "#000",
    surface: "#000",
    boxcolor: "#000",
    "surface-variant": "#000",
  },
};
const waccaLightPlusTheme: ThemeDefinition = {
  dark: false,
  colors: {
    primary: "#00a9fd",
    navbar: "#00a9fd",
    boxcolor: "#333",
  },
};

const waccaDarkPlusTheme: ThemeDefinition = {
  dark: true,
  colors: {
    primary: "#00a9fd",
    navbar: "#00a9fd",
    surface: "#333",
    boxcolor: "#333",
  },
};

const waccaOledPlusTheme: ThemeDefinition = {
  dark: true,
  colors: {
    primary: "#00a9fd",
    navbar: "#000",
    surface: "#000",
    boxcolor: "#000",
    "surface-variant": "#000",
  },
};

// const mithicalLightTheme: ThemeDefinition = {
//   dark: false,
//   colors: {
//     primary: "#bb86fc",
//   },
// };

const mithicalDarkTheme: ThemeDefinition = {
  dark: true,
  colors: {
    primary: "#bb86fc",
    navbar: "#bb86fc",
  },
};

const mithicalOledTheme: ThemeDefinition = {
  dark: true,
  colors: {
    primary: "#bb86fc",
    navbar: "#000",
    background: "#000",
    surface: "#000",
    "surface-variant": "#000",
  },
};

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components,
    directives,
    theme: {
      themes: {
        waccaLight: waccaLightTheme,
        waccaDark: waccaDarkTheme,
        waccaOled: waccaOledTheme,
        mithicalLight: mithicalDarkTheme, // no light mithical theme
        mithicalDark: mithicalDarkTheme,
        mithicalOled: mithicalOledTheme,
        waccaLightPlus: waccaLightPlusTheme,
        waccaDarkPlus: waccaDarkPlusTheme,
        waccaOledPlus: waccaOledPlusTheme,
      },
    },
  });

  nuxtApp.vueApp.use(vuetify);
});
