<template>
  <div id="nav">
    <NuxtLink to="/">
      <MithicalLogo color="white" />
    </NuxtLink>

    <v-btn @click="openSettings" icon variant="plain">
      <v-icon>mdi-cog</v-icon>
    </v-btn>

    <v-select
      class="nav-select"
      v-model="activeCard"
      :items="cards"
      item-title="user_name"
      item-value="luid"
      hide-details
      single-line
      prepend-inner-icon="mdi-card-account-details-outline"
      no-data-text="No cards added yet"
    />
    <div class="nav-spacer"></div>
    <NuxtLink to="/wacca">Wacca</NuxtLink>
  </div>
</template>

<script setup>
const cards = useState("cards");
const activeCard = useState("activeCard");

watch(activeCard, (newVal) => {
  if (newVal) {
    localStorage.setItem("activeCard", newVal);
  }
});

const settingsVisible = useState("settingsVisible");

function openSettings() {
  settingsVisible.value = true;
}
</script>
