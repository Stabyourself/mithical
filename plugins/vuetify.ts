// plugins/vuetify.js
import { createVuetify } from "vuetify";
import type { ThemeDefinition } from "vuetify";

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
    "surface-variant": "#777777",
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
    "surface-variant": "#777777",
  },
};

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    theme: {
      themes: {
        waccaLight: waccaLightTheme,
        waccaDark: waccaDarkTheme,
        waccaOled: waccaOledTheme,
        waccaLightPlus: waccaLightPlusTheme,
        waccaDarkPlus: waccaDarkPlusTheme,
        waccaOledPlus: waccaOledPlusTheme,
      },
    },
  });

  nuxtApp.vueApp.use(vuetify);
});
