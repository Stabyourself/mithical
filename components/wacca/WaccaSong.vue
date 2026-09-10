<template>
  <div class="song">
    <div class="song-cover">
      <WaccaJacket :url="song.imageName" />
    </div>
    <div class="song-info">
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

      <WaccaSongSheets :song="song" :player-data="playerData" />
    </div>
  </div>
</template>

<style scoped lang="scss">
$song-paddings: 10px;

.song {
  display: flex;

  margin-bottom: 1rem;

  border-radius: $song-paddings;
  overflow: hidden;

  background-color: rgb(var(--v-theme-boxcolor));
  transition: background-color 0.2s, box-shadow 0.2s;

  &:hover {
    background-color: #444;
    box-shadow: 0 0 10px rgb(var(--v-theme-primary));
  }
}

.song-cover {
  flex-shrink: 0;
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

.song-info {
  flex-grow: 1;
  color: white;
  font-weight: bold;
  min-width: 0;
}

.song-header {
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

.player-stats {
  display: flex;
  gap: 20px;
}

.v-theme--waccaOled .song,
.v-theme--waccaOledPlus .song {
  outline: solid 1px white;
}
</style>

<script setup>
const props = defineProps({
  song: Object,
  playerData: Object,
});

const language = useState("language");

const getTitle = computed(() => {
  if (language.value === "ja") {
    return props.song.title;
  }

  return props.song.titleEnglish || props.song.title;
});
</script>
