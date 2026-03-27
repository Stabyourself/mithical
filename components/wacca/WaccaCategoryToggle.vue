<template>
  <div class="song-category" v-ripple :class="{ active }">
    <div
      class="song-category-image"
      :style="{
        backgroundImage: `url(/wacca/img/categories/${category.img})`,
        backgroundColor: category.color,
      }"
    ></div>
    <div class="song-category-info">
      <div class="song-category-title">
        {{
          category.hideText ? "" : language == "ja" ? category.ja : category.en
        }}
      </div>
      <!-- <div class="song-category-count">
        {{ category.count }}
      </div> -->
    </div>
  </div>
</template>

<style scoped lang="scss">
.song-category {
  position: relative;
  width: 200px;
  height: 80px;
  color: white;
  font-size: 1.7em;
  font-weight: 700;
  text-shadow: 0px 0px 5px rgba(0, 0, 0, 1);
  -webkit-text-stroke: 1px black;
  cursor: pointer;
  border-radius: inherit;
  line-height: 1;
  text-align: center;

  .song-category-image {
    position: absolute;
    width: 100%;
    height: 100%;
    background-size: 80%;
    background-position: 50% 60%;
    filter: grayscale(1);
    transition: all 0.1s;
  }

  &:hover .song-category-image {
    filter: grayscale(0.5);
    // background-size: 120%;
  }

  &.active {
    text-shadow: 0px 0px 5px rgb(var(--v-theme-primary));
    -webkit-text-stroke: 1px rgb(var(--v-theme-primary));
    .song-category-image {
      filter: grayscale(0);
      background-size: 120%;
    }
  }

  .song-category-title {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>

<script setup>
const props = defineProps({
  category: Object,
  activeCategories: Array,
  language: String,
});

const active = computed(() => {
  return props.activeCategories.includes(props.category.ja);
});
</script>
