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
        <WaccaProfileBox ref="profileBoxRef"
        :class="{ 'has-emblem': selectedVersionData?.dan_rank > 0 }">
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

      <WaccaNews
        v-for="(post, index) in sortedNews"
        :key="post.date + post.title"
        class="news-section"
        :style="boxWidth ? { maxWidth: boxWidth + 'px' } : undefined"
        :title="post.title"
        :date="post.date"
        :body="post.body"
        :accent-color="newsColors[index % newsColors.length]"
      />
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
    align-items: center;
    padding-left: 70px;
    box-sizing: border-box;
  }

  :deep(.profile-box-wrapper.has-emblem .profile-box) {
    padding-right: 160px;
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
  margin-left: -160px;
  width: 150px;
}

@media (max-width: 600px) {
  .profile-header {
    flex-direction: column;
    justify-content: center;
    text-align: center;
    margin-bottom: 24px;
    gap: 0;
  }

  .profile-header .profile-icon {
    height: 100px;
    width: 100px;
    margin-right: 0;
  }

  .profile-header :deep(.profile-box) {
    padding: 8px 20px;
    font-size: 1.2rem;
  }

  .profile-stats-row {
    justify-content: center;
    flex-wrap: wrap;
    row-gap: 4px;
  }

  .stage-up {
    margin-left: 0;
    margin-top: 55px;
    height: 45px;
    transform: scale(0.6);
    transform-origin: top;
  }
}

.news-section {
  width: 100%;
  max-width: 600px;
  margin-bottom: 24px;

  &:last-of-type {
    margin-bottom: 0;
  }
}
</style>

<script setup>
import waccaNavigators from "~/assets/wacca/waccaNavigators.js";
import waccaNews from "~/assets/wacca/waccaNews.js";

definePageMeta({
  middleware: ["auth"],
});

const profile = useState("profile");

const newsColors = ["#009de6", "#fed131", "#fc06a3"];

const sortedNews = computed(() => {
  return [...waccaNews].sort((a, b) => new Date(b.date) - new Date(a.date));
});

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
