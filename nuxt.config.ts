// https://v3.nuxtjs.org/api/configuration/nuxt.config
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

export default defineNuxtConfig({
  css: [
    "~/assets/app.scss",
    "@mdi/font/scss/materialdesignicons.scss",
    "vuetify/_styles.scss",
    "~/assets/roboto.scss",
    "glightbox/dist/css/glightbox.min.css",
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

  routeRules: {
    // "/wacca" moved to the site root - keep old links working. Listed
    // explicitly (rather than a "/wacca/**" wildcard) so this doesn't also
    // catch the real static assets still served from public/wacca/*.
    "/wacca": { redirect: { to: "/", statusCode: 301 } },
    "/wacca/inventory": { redirect: { to: "/inventory", statusCode: 301 } },
    "/wacca/recent": { redirect: { to: "/recent", statusCode: 301 } },
    "/wacca/rating": { redirect: { to: "/rating", statusCode: 301 } },
    "/wacca/leaderboards": {
      redirect: { to: "/leaderboards", statusCode: 301 },
    },
    "/wacca/gacha": { redirect: { to: "/gacha", statusCode: 301 } },
    "/wacca/settings": { redirect: { to: "/settings", statusCode: 301 } },
    "/wacca/songs": { redirect: { to: "/songs", statusCode: 301 } },
    "/wacca/songs/**": { redirect: { to: "/songs/**", statusCode: 301 } },
  },

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
