<template>
  <div class="song">
    <div class="song-cover">
      <WaccaJacket :url="song.imageName" />
    </div>
    <div class="song-header">
      <div class="song-header-left">
        <div class="song-title">
          {{ getTitle }}
        </div>

        <div class="song-artist">
          {{ song.artist }}
        </div>
        <!-- <div class="player-stats">
          <div>Plays: {{ playerData.playCount }}</div>
          <div>Rating: {{ playerData.rating }}</div>
        </div> -->
      </div>

      <div class="song-header-right">
        <WaccaFavorite :song-id="song.id" />
      </div>
    </div>

    <WaccaSongSheets
      class="song-card-sheets"
      :song="song"
      :player-data="playerData"
    />
  </div>
</template>

<style scoped lang="scss">
$song-paddings: 10px;

// Cover on the left, title and pills next to it. On phones the cover shrinks down next to the
// title and the pills get the whole width under them
.song {
  display: grid;
  grid-template-columns: 160px minmax(0, 1fr);
  grid-template-rows: auto 1fr;
  grid-template-areas:
    "cover header"
    "cover sheets";
  color: white;
  font-weight: bold;

  margin-bottom: 1rem;

  border-radius: $song-paddings;
  overflow: hidden;

  background-color: rgb(var(--v-theme-boxcolor));
  transition:
    background-color 0.2s,
    box-shadow 0.2s;

  &:hover {
    background-color: #444;
    box-shadow: 0 0 10px rgb(var(--v-theme-primary));
  }
}

.song-cover {
  grid-area: cover;
  width: 160px;
  height: 160px;

  .v-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .v-img--booting {
    background-color: #888;
  }
}

.song-header {
  grid-area: header;
  min-width: 0;
  padding-left: $song-paddings;
  display: flex;
  justify-content: space-between;
  gap: $song-paddings;
}

.song-header-left {
  flex-grow: 1;

  .song-title {
    font-size: 1.5rem;
    margin-bottom: -10px;
  }

  .song-artist {
    font-size: 1rem;
    color: rgb(var(--v-theme-primary));
  }
}

.song-header-right {
  flex-shrink: 0;
}

.song-card-sheets {
  grid-area: sheets;
  padding-bottom: $song-paddings;
}

@media (max-width: 600px) {
  .song {
    grid-template-columns: 72px minmax(0, 1fr);
    grid-template-areas:
      "cover header"
      "sheets sheets";
  }

  .song-cover {
    width: 72px;
    height: 72px;
  }

  .song-header-left .song-title {
    font-size: 1.2rem;
    margin-bottom: 0;
  }

  // Two pills a row, smaller to fit
  .song-card-sheets {
    grid-template-columns: repeat(2, minmax(0, 1fr));

    :deep(.song-difficulty-pill) {
      font-size: 1.05rem;
      padding-left: 10px;
    }

    :deep(.song-difficulty-level) {
      width: 42px;
    }
  }
}

.player-stats {
  display: flex;
  gap: 20px;
}

// Outlined on OLED, see plugins/vuetify.ts
.song {
  outline: var(--v-box-border);
}
</style>

<script setup>
const props = defineProps({
  song: Object,
  playerData: Object
});

const songTitle = useSongTitle();
const getTitle = computed(() => songTitle(props.song));
</script>
