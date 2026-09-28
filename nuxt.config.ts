// https://v3.nuxtjs.org/api/configuration/nuxt.config
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

export default defineNuxtConfig({
  css: [
    "~/assets/app.scss",
    "@mdi/font/scss/materialdesignicons.scss",
    "vuetify/_styles.scss",
    "~/assets/vuetify.scss",
    "~/assets/roboto.scss",
    "glightbox/dist/css/glightbox.min.css"
  ],

  app: {
    pageTransition: { name: "page", mode: "out-in" }
  },

  build: {
    transpile: ["vuetify"]
  },

  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        config.plugins!.push(vuetify({ autoImport: true }));
      });
    }
  ],

  runtimeConfig: {
    public: {
      apiUrl: process.env.MITHICAL_BACKEND_URL || "http://localhost:3001"
    }
  },

  ssr: false,

  // No Nuxt DevTools overlay in dev
  devtools: { enabled: false },

  routeRules: {
    // "/wacca" moved to the site root - keep old links working. Listed
    // explicitly (rather than a "/wacca/**" wildcard) so this doesn't also
    // catch the real static assets still served from public/wacca/*.
    "/wacca": { redirect: { to: "/", statusCode: 301 } },
    "/wacca/inventory": { redirect: { to: "/inventory", statusCode: 301 } },
    "/wacca/recent": { redirect: { to: "/recent", statusCode: 301 } },
    "/wacca/rating": { redirect: { to: "/rating", statusCode: 301 } },
    "/wacca/leaderboards": {
      redirect: { to: "/leaderboards", statusCode: 301 }
    },
    "/wacca/gacha": { redirect: { to: "/gacha", statusCode: 301 } },
    "/wacca/settings": { redirect: { to: "/settings", statusCode: 301 } },
    "/wacca/songs": { redirect: { to: "/songs", statusCode: 301 } },
    "/wacca/songs/**": { redirect: { to: "/songs/**", statusCode: 301 } }
  },

  compatibilityDate: "2024-09-23",

  vite: {
    // Vuetify 4: overlays inside dialogs only stack right when these share one module
    // instance, which Vite's dev pre-bundling can split. Production isn't affected
    optimizeDeps: {
      include: [
        "vuetify/components/VOverlay",
        "vuetify/components/VDialog",
        "vuetify/components/VMenu",
        "vuetify/components/VSelect",
        "vuetify/components/VTooltip"
      ]
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler", // or "modern"
          silenceDeprecations: ["import", "global-builtin"]
        }
      }
    },
    vue: {
      template: { transformAssetUrls }
    }
  }
});
