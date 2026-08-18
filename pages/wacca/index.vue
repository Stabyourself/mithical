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
      <div class="profile-name">
        <div class="profile-icon">
          <WaccaIcon :icon="iconId" />
        </div>
        <WaccaProfileBox>
          <div>
            <span class="light">Welcome back</span>
            {{ profile.user_name }}
          </div>
        </WaccaProfileBox>
      </div>

      <div class="profile-stats">
        <WaccaProfileBox>
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
        </WaccaProfileBox>
        <WaccaStageUp
          :rank="selectedVersionData.rank"
          :danRank="selectedVersionData.dan_rank"
        />
      </div>

      <NuxtLink to="/wacca/gacha" style="text-decoration: none">
        <div
          class="gacha-link elevation-3"
          v-ripple="{ class: 'text-secondary' }"
        >
          <div class="gacha-link-background"></div>
          <div class="gacha-link-text">Play Wacca Gacha</div>
        </div>
      </NuxtLink>
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

.profile-name {
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  .profile-icon {
    height: 150px;
    width: 150px;
    margin-right: -40px;
    z-index: 2;

    img {
      height: 100%;
    }
  }

  :deep(.profile-box) {
    padding-left: 50px;
  }
}

.profile-stats {
  display: flex;
  align-items: center;
  margin-bottom: 41px;
}

.gacha-link {
  font-weight: bold;
  text-align: center;
  margin-top: 20px;
  border-radius: 15px;
  max-width: 750px;
  overflow: hidden;

  background: linear-gradient(90deg, #575afc, #090293);

  position: relative;
  display: inline-block;
  &:after {
    position: absolute;
    content: "";
    display: block;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0);
    transition: background 0.3s;
    z-index: 3;
  }

  &:hover:after {
    background: rgba(255, 255, 255, 0.2);
  }
}

.gacha-link-text {
  margin-left: 150px;
  z-index: 2;
  position: relative;
  text-shadow: 2px 2px 0px rgba(0, 0, 0, 1);
  font-weight: 300;
  color: white;
  font-size: 2.5em;
  padding: 23px;
}

.gacha-link-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("/wacca/img/gacha-button-background.webp");
  background-size: auto 100%;
  background-repeat: no-repeat;
  background-position-y: 50%;
  z-index: 1;
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
