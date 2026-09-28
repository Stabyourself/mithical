<template>
  <v-app>
    <MainNav />
    <div class="wacca wacca-page">
      <div id="site-logo">
        <NuxtLink to="/">
          <img src="/wacca/img/logo.svg" />
        </NuxtLink>
      </div>

      <WaccaNav />
      <NuxtPage :keepalive="keepalive" style="padding-bottom: 200px" />
    </div>
    <SettingsModal />
  </v-app>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>

<script setup>
// Theme, version and cards are set up in plugins/preferences.js, the profile in plugins/profile.js

useSeoMeta({
  title: "Mithical | Wacca",
  description: "Web UI for Wacca",
  ogSiteName: "Mithical",
  ogTitle: "Mithical",
  ogDescription: "Web UI for Wacca",
  ogImage: () => `${useRequestURL().origin}/logo.png`,
  ogUrl: () => useRequestURL().href,
  twitterCard: "summary_large_image"
});

// The song list stays alive while going into a song and back, so its filters and scroll
// position are still there. Going anywhere else lets it go
const route = useRoute();
const keepalive = computed(() => ({
  include:
    route.name === "songs" || route.name === "songs-slug" ? ["SongsPage"] : []
}));
</script>
