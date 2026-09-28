<template>
  <v-app :style="{ background }">
    <div id="modals"></div>
    <MainNav />
    <NuxtLayout name="wacca"></NuxtLayout>
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

// Theme (Light, Dark or Oled) and WACCA version, remembered in localStorage.
// Light and Plus unless picked otherwise in the settings
const theme = useState("theme", () => localStorage.getItem("theme") || "Light");
const version = useState("version", () => {
  const stored = parseInt(localStorage.getItem("version"));
  return stored === 300 || stored === 400 ? stored : 400;
});
watch(theme, (value) => localStorage.setItem("theme", value));
watch(version, (value) => localStorage.setItem("version", value));

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
const themeName = useWaccaTheme();
watchEffect(() => {
  vuetifyTheme.global.name.value = themeName.value;
});

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
