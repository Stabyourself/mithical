<template>
  <v-app :style="{ background }">
    <div id="modals"></div>
    <MainNav />
    <NuxtLayout :name="layout"></NuxtLayout>
    <SettingsModal />
  </v-app>
</template>

<style>
.layout-enter-active,
.layout-leave-active {
  transition: all 0.2s;
}
.layout-enter-from,
.layout-leave-to {
  opacity: 0;
  filter: blur(0.5rem);
}
</style>

<script setup>
import { useTheme } from "vuetify";

const layout = ref("wacca");
const theme = useState("theme");
const version = useState("version");

let defaultDark =
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches;

// defualt to light for now...
defaultDark = false;

const storageTheme = localStorage.getItem("theme");
if (storageTheme) {
  theme.value = storageTheme;
} else {
  theme.value = defaultDark ? "Dark" : "Light";
}

useHead({
  title: "Mithical",
});

useSeoMeta({
  title: "Mithical",
  description: "Web UI for Wacca",
  ogSiteName: "Mithical",
  ogTitle: "Mithical",
  ogDescription: "Web UI for Wacca",
  ogImage: () => `${useRequestURL().origin}/logo.png`,
  ogUrl: () => useRequestURL().href,
  twitterCard: "summary_large_image",
});

const vuetifyTheme = useTheme();
const route = useRoute();

function updateTheme() {
  // get the first part of the url
  let nuxtTheme = route.path.split("/")[1];

  if (!["wacca"].includes(nuxtTheme)) {
    nuxtTheme = "mithical";
  }

  layout.value = nuxtTheme;

  let themeModded = theme.value;
  if (nuxtTheme != "mithical" && version.value == 400) {
    themeModded += "Plus";
  }

  vuetifyTheme.global.name.value = nuxtTheme + themeModded;
}

watch(theme, updateTheme);
watch(version, updateTheme);
watch(() => route.path, updateTheme);
updateTheme();

// load cards from localStorage

const cards = useState("cards", () => []);
const storageCards = localStorage.getItem("cards");

if (storageCards) {
  cards.value = JSON.parse(storageCards);
}

// set default card from localStorage
const activeCard = useState("activeCard");
const storageActiveCard = localStorage.getItem("activeCard");

if (storageActiveCard) {
  activeCard.value = storageActiveCard;
} else {
  activeCard.value = cards.value[0]?.luid;
}

const background = computed(() => {
  return vuetifyTheme.current.value.colors.background;
});
</script>
