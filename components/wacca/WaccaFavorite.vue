<template>
  <!-- <v-tooltip location="start">
    <template v-slot:activator="{ props }"> -->
  <button
    type="button"
    class="favorite-btn"
    :aria-label="profileSong.favorite ? 'Remove favorite' : 'Add favorite'"
    @click.prevent="toggleFavorite"
  >
    <i
      class="mdi"
      :class="profileSong.favorite ? 'mdi-star' : 'mdi-star-outline'"
    ></i>
  </button>
  <!-- </template>
    <span>{{ profileSong.favorite ? "Remove favorite" : "Add favorite" }}</span>
  </v-tooltip> -->
</template>

<style scoped>
.favorite-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  font-size: 50px;
  line-height: 1;
  color: #ffeb3b;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.favorite-btn:hover {
  opacity: 1;
}
</style>

<script setup>
const runtimeConfig = useRuntimeConfig();

const props = defineProps({
  songId: Number,
});

const activeCard = useState("activeCard");
const profile = useState("profile");

const profileSong = computed(() => {
  if (!profile.value) {
    return {
      favorite: false,
    };
  }
  return profile.value.songs[props.songId];
});

async function toggleFavorite() {
  profile.value.songs[props.songId].favorite =
    !profile.value.songs[props.songId].favorite;

  await $fetch(
    `${runtimeConfig.public.apiUrl}/wacca/user/${activeCard.value}/favorites/${props.songId}/toggle`,
    {
      method: "POST",
    }
  );
}
</script>
