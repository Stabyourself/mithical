// https://v3.nuxtjs.org/api/configuration/nuxt.config
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

export default defineNuxtConfig({
  css: [
    "~/assets/app.scss",
    "@mdi/font/scss/materialdesignicons.scss",
    "vuetify/_styles.scss",
    "~/assets/roboto.scss",
  ],

  app: {
    pageTransition: { name: "page", mode: "out-in" },
    layoutTransition: { name: "layout", mode: "out-in" },
    keepalive: true,
  },

  build: {
    transpile: ["vuetify"],
  },

  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        config.plugins!.push(vuetify({ autoImport: true }));
      });
    },
  ],

  runtimeConfig: {
    public: {
      apiUrl: process.env.MITHICAL_BACKEND_URL || "http://localhost:3001",
    },
  },

  ssr: false,

  compatibilityDate: "2024-09-23",

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler", // or "modern"
          silenceDeprecations: ["import", "global-builtin"],
        },
      },
    },
    vue: {
      template: { transformAssetUrls },
    },
  },
});
