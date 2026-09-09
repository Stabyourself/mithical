<template>
  <WaccaProfileRequired>
    <v-container class="pa-0 waifu-holder">
      <div
        class="waifu"
        :style="{
          backgroundImage: `url(/wacca/img/navigators/${navigator.path}.webp)`,
        }"
      ></div>
    </v-container>
    <v-container>
      <div class="profile-header">
        <div class="profile-icon">
          <WaccaIcon :icon="iconId" />
        </div>
        <WaccaProfileBox>
          <div class="profile-box-column">
            <div>
              <span class="light">Welcome back</span>
              {{ profile.user_name }}
            </div>
            <div class="profile-stats-row">
              <div class="profile-stat mr-5">
                <span class="light">Level</span> {{ level }}
              </div>
              <div class="profile-stat mr-5">
                <span class="light">RP</span> {{ profile.points }}
              </div>
              <div class="profile-stat">
                <span class="light">Rate</span>&nbsp;<WaccaRating
                  :rating="selectedVersionData.rating"
                />
              </div>
            </div>
          </div>
        </WaccaProfileBox>
        <WaccaStageUp
          :rank="selectedVersionData.rank"
          :danRank="selectedVersionData.dan_rank"
        />
      </div>
    </v-container>
  </WaccaProfileRequired>
</template>

<style scoped lang="scss">
.waifu-holder {
  position: relative;
  pointer-events: none;
}

.waifu {
  position: absolute;
  $size: 0.7;

  width: 2048px * $size;
  height: 2048px * $size;
  background-size: contain;
  background-position: 40% top;
  overflow: hidden;
  top: 0px;
  right: -600px;
}

.profile-header {
  display: flex;
  align-items: center;
  margin-bottom: 41px;

  .profile-icon {
    height: 150px;
    width: 150px;
    margin-right: -60px;
    z-index: 2;

    img {
      height: 100%;
    }
  }

  :deep(.profile-box) {
    padding-left: 70px;
  }
}

.profile-box-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.profile-stats-row {
  display: flex;
  align-items: center;
}

.light {
  font-weight: 200;
}

.stage-up {
  margin-left: -40px;
  width: 150px;
}
</style>

<script setup>
import waccaNavigators from "~/assets/wacca/waccaNavigators.js";

definePageMeta({
  middleware: ["auth"],
});

const profile = useState("profile");

const level = computed(() => {
  return Math.floor(profile.value.exp / 100) + 1;
});

const navigator = computed(() => {
  let navigatorId = profile.value.options[1004] || 310001;

  return waccaNavigators.find((n) => n.id === navigatorId);
});

const iconId = computed(() => {
  let iconId = profile.value.options[1003] ?? 102001;

  return iconId;
});

const version = useState("version");

const selectedVersionData = computed(() => {
  if (profile.value.version_data[version.value]) {
    return profile.value.version_data[version.value];
  }

  return profile.value.version_data[300];
});
</script>
