<template>
  <div
    class="gacha-item"
    :class="[`rarity-${props.rarity}`, owned || !greyunowned ? 'owned' : '']"
  >
    <div v-if="[5, 11].includes(props.kind)" class="gacha-item-preview">
      <div class="gacha-item-preview-kind">
        {{ waccaItemKinds[props.kind] }}
      </div>
      <div class="gacha-item-preview-item">
        {{ itemName(props.kind, props.id) }}
      </div>
    </div>

    <WaccaIcon
      v-else-if="props.kind == 6"
      :icon="props.id"
      class="gacha-item-preview"
    />

    <div v-else-if="props.kind == 16" class="gacha-item-plate">
      <img :src="`/wacca/img/plates/${item.path}.webp`" />
    </div>

    <div v-else-if="props.kind == 15" class="gacha-item-navigator">
      <img :src="`/wacca/img/navigators/${item.path}.webp`" />

      <div class="gacha-item-preview-item">
        {{ itemName(props.kind, props.id) }}
      </div>
    </div>

    <div v-else-if="props.kind == 10" class="gacha-item-colorscheme">
      <div class="gacha-item-preview-kind">
        {{ waccaItemKinds[props.kind] }}
      </div>
      <div class="gacha-item-preview-item">
        {{ itemName(props.kind, props.id) }}
      </div>

      <div class="colorscheme-wrapper">
        <div
          v-for="i in [0, 1, 2]"
          :key="i"
          :style="{ backgroundColor: `rgb(${item.colors[i].join(',')})` }"
        ></div>
      </div>
    </div>

    <div class="gacha-item-rarity">
      <v-icon v-for="i in props.rarity" :key="i">mdi-star</v-icon>
    </div>

    <div class="gacha-item-unowned" :class="{ owned }">Owned</div>
  </div>
</template>

<style scoped lang="scss">
.gacha-item {
  overflow: hidden;
  flex-grow: 0;
  flex-shrink: 0;
  padding: 0px 5px;
  box-sizing: border-box;
  position: relative;
  font-size: 16px;
  border-radius: 5px;
  color: white;

  background-color: #f0f0f0;
  width: 150px;
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;

  transition: box-shadow 0.1s;

  &.highlight {
    // box-shadow: 0px 0px 10px 2px rgba(var(--v-theme-primary), 0.5);
    transform: scale(1.1);
  }
}

.gacha-item-preview-kind {
  color: rgba(255, 255, 255, 0.7);
}

.gacha-item-preview {
  height: 80%;
  overflow: hidden;
}

.gacha-item-preview-item {
  font-weight: 700;
}

.gacha-item-plate {
  width: 100%;
  height: 100%;
  position: relative;

  img {
    width: 600px;
    position: absolute;
    top: -15px;
    left: 20%;
    height: auto;
    transform: translateX(-50%);
  }
}

.gacha-item-navigator {
  width: 100%;
  height: 100%;
  position: relative;

  img {
    padding-top: 5px;
    width: 100%;
    height: 70%;
    object-fit: contain;
  }

  .gacha-item-preview-item {
    margin-top: -7px;
  }
}

.gacha-item-rarity {
  position: absolute;
  bottom: 2px;

  font-size: 0.7em;
  color: #fff;
  text-shadow: 0px 1px 1px rgba(0, 0, 0, 0.5);

  display: flex;
}

.gacha-item-unowned {
  $w: 100px;
  position: absolute;
  top: 7px;
  left: 1px;
  transform: rotate(-30deg);
  background: red;
  font-weight: 800;
  color: white;
  padding-left: $w;
  margin-left: -$w;
  padding-right: $w;
  margin-right: -$w;

  opacity: 0;
  transition: opacity 1s;

  &.owned {
    opacity: 1;
  }
}

.gacha-item:not(.owned) {
  color: rgba(0, 0, 0, 0.7);
  .gacha-item-preview-kind {
    color: rgba(0, 0, 0, 0.7);
  }
}

.owned {
  &.rarity-0 {
    background-color: #009de6;
  }

  &.rarity-1 {
    background-color: #009de6;
  }

  &.rarity-2 {
    background-color: #fed131;
    color: #000;
  }

  &.rarity-3 {
    background-color: #fc06a3;
  }

  &.rarity-4 {
    background-color: #4a004f;
  }

  &.rarity-5 {
    // muted rainbow
    background: linear-gradient(
      120deg,
      #ff4e50,
      #fc913a,
      #f9d423,
      #ede574,
      #e1f5c4,
      #b3f3f1,
      #54d3c2,
      #3b9bbb,
      #5c6bc0,
      #5d4c51
    );

    text-shadow: 0px 1px 1px rgba(0, 0, 0, 0.5);
  }
}

.gacha-item-colorscheme {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.colorscheme-wrapper {
  width: 90%;
  display: grid;
  height: 50px;
  grid-template-columns: 1fr 1fr 1fr;
  column-gap: 4px;

  div {
    height: 100%;
  }
}
</style>

<script setup>
import waccaIcons from "~/assets/wacca/waccaIcons.js";
import waccaSoundEffects from "~/assets/wacca/waccaSoundEffects.js";
import waccaTitles from "~/assets/wacca/waccaTitles.js";
import waccaSymbolColors from "~/assets/wacca/waccaSymbolColors.js";
import waccaUserPlates from "~/assets/wacca/waccaUserPlates.js";
import waccaNavigators from "~/assets/wacca/waccaNavigators";
import waccaItemKinds from "~/assets/wacca/waccaItemKinds.js";

const language = useState("language");
const profile = useState("profile");

const props = defineProps({
  rarity: Number,
  kind: Number,
  id: Number,
  greyunowned: Boolean,
});

function findItem(kind, id) {
  if (kind == 5) {
    return waccaTitles.find((title) => title.id == id);
  } else if (kind == 6) {
    return waccaIcons.find((icon) => icon.id == id);
  } else if (kind == 10) {
    return waccaSymbolColors.find((symbolColor) => symbolColor.id == id);
  } else if (kind == 11) {
    return waccaSoundEffects.find((soundEffect) => soundEffect.id == id);
  } else if (kind == 15) {
    return waccaNavigators.find((navigator) => navigator.id == id);
  } else if (kind == 16) {
    return waccaUserPlates.find((userPlate) => userPlate.id == id);
  }
}

function itemName(kind, id) {
  if (language.value === "ja") {
    return findItem(kind, id).name;
  } else {
    let item = findItem(kind, id);
    return item.nameEnglish ?? item.name;
  }
}

const item = computed(() => {
  return findItem(props.kind, props.id);
});

const owned = computed(() => {
  return profile.value.items.some((item) => item.item_id == props.id);
});
</script>
