<template>
  <WaccaProfileRequired>
    <v-container>
      <div class="play-log">
        <div v-for="group in playlogGrouped" class="play-log-day">
          <div class="playlog-hr">{{ group.date }}</div>
          <WaccaPlay v-for="play in group.plays" :play="play" />
        </div>

        <div v-if="profile.playlog.length === 0">
          <v-alert type="info" border="left" prominent>
            Looks like you haven't played anything yet!
          </v-alert>
        </div>

        <div v-if="profile.playlog.length == 100">
          <p class="text-grey-darken-2 text-center">
            Only the most recent 100 plays are shown.
          </p>
        </div>
      </div>
    </v-container>
  </WaccaProfileRequired>
</template>

<style scoped lang="scss">
.play-log {
  display: flex;
  flex-direction: column;
  gap: 4em;
}

.play-log-day {
  display: flex;
  flex-direction: column;
  gap: 2em;
}
.playlog-hr {
  display: flex;
  align-items: center;
  color: rgba(var(--v-theme-on-background), 0.5);
  gap: 10px;
}
.playlog-hr:before,
.playlog-hr:after {
  content: "";
  flex-grow: 1;
  background: rgba(var(--v-theme-on-background), 0.5);
  height: 1px;
  font-size: 0px;
  line-height: 0px;
}
</style>

<script setup>
definePageMeta({
  middleware: ["auth"],
});

import getSongs from "~~/assets/wacca/getSongs.js";

const profile = useState("profile");
const version = useState("version");

const playlogFiltered = computed(() => {
  return profile.value.playlog.filter((play) => {
    let song = getSongs(version.value).find(
      (song) => song.id === play.info.music_id
    );
    if (!song) {
      return false;
    }

    if (!song.sheets[play.info.music_difficulty - 1]) {
      return false;
    }

    return (
      song.sheets[play.info.music_difficulty - 1].gameVersion <= version.value
    );
  });
});

const playlogGrouped = computed(() => {
  const grouped = [];

  playlogFiltered.value.forEach((play) => {
    const date = new Date(play.info.user_play_date);
    const dateStr = date.toLocaleDateString();

    const group = grouped.find((group) => group.date === dateStr);

    if (group) {
      group.plays.push(play);
    } else {
      grouped.push({
        date: dateStr,
        plays: [play],
      });
    }
  });

  return grouped;
});
</script>
