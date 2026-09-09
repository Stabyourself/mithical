<template>
  <WaccaProfileRequired>
    <v-container>
      <div class="d-flex justify-center">
        <NuxtLink to="/wacca/gacha" style="text-decoration: none">
          <div
            class="gacha-link elevation-3"
            v-ripple="{ class: 'text-secondary' }"
          >
            <div class="gacha-link-background"></div>
            <div class="gacha-link-text">Play Wacca Gacha</div>
          </div>
        </NuxtLink>
      </div>

      <div class="d-flex ga-10 justify-center mb-6">
        <v-btn-toggle v-model="activeCategory" shaped mandatory>
          <v-btn
            color="primary"
            v-for="category of categories"
            :key="category.id"
          >
            {{ category.name }}
          </v-btn>
        </v-btn-toggle>

        <v-btn-toggle v-model="toggleOwneds" multiple color="primary">
          <v-btn
            >Owned
            <v-icon>mdi-check</v-icon>
          </v-btn>

          <v-btn
            >Unowned
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-btn-toggle>
      </div>

      <div>
        <div class="box-items">
          <div v-for="item in filteredItems" :key="item.id" class="box-item">
            <tippy
              placement="bottom"
              max-width="none"
              :content="getTooltip(categories[activeCategory], item)"
            >
              <WaccaGachaItem
                :kind="categories[activeCategory].id"
                :id="item.id"
                :rarity="0"
                greyunowned
              />
            </tippy>
          </div>
        </div>
      </div>
    </v-container>
  </WaccaProfileRequired>
</template>

<style scoped lang="scss">
.gacha-link {
  font-weight: bold;
  text-align: center;
  margin-top: 20px;
  margin-bottom: 20px;
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

.box-items {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  width: 100%;
  justify-content: center;
}

.box-item {
  height: 120px;
  width: 150px;
}

.v-btn-toggle {
  flex-wrap: wrap;
  justify-content: center;
}

.v-btn-group--density-default.v-btn-group {
  height: auto;
}

.v-btn-group .v-btn {
  min-height: 40px;
}
</style>

<script setup>
import waccaIcons from "~/assets/wacca/waccaIcons.js";
import waccaSoundEffects from "~/assets/wacca/waccaSoundEffects.js";
import waccaTitles from "~/assets/wacca/waccaTitles.js";
import waccaSymbolColors from "~/assets/wacca/waccaSymbolColors.js";
import waccaUserPlates from "~/assets/wacca/waccaUserPlates.js";
import waccaNavigators from "~/assets/wacca/waccaNavigators";

const categories = [
  {
    name: "Navigators",
    items: waccaNavigators,
    id: 15,
  },
  {
    name: "Colors",
    items: waccaSymbolColors,
    id: 10,
  },
  {
    name: "Icons",
    items: waccaIcons,
    id: 6,
  },
  {
    name: "Sounds",
    items: waccaSoundEffects,
    id: 11,
  },
  {
    name: "Plates",
    items: waccaUserPlates,
    id: 16,
  },
  {
    name: "Titles",
    items: waccaTitles,
    id: 5,
  },
];

definePageMeta({
  middleware: ["auth"],
});

const profile = useState("profile");
const activeCategory = ref(0);
const lang = useState("language");
const toggleOwneds = ref([0, 1]);

function getTooltip(category, item) {
  const name = (lang.value === "en" && item.nameEnglish) || item.name;
  const acquisition =
    (lang.value === "en" && item.acquisitionEnglish) || item.acquisition || "";

  let out = `<h2>${name}</h2>`;

  if (category.id === 16) {
    out += `<img src="/wacca/img/plates/${item.path}.webp" />`;
  }

  out += `<p>${acquisition}</p>`;

  return out;
}

const filteredItems = computed(() => {
  return categories[activeCategory.value].items.filter((item) => {
    let owned = isOwned(item);
    if (owned && toggleOwneds.value.includes(0)) {
      return true;
    }
    if (!owned && toggleOwneds.value.includes(1)) {
      return true;
    }
    return false;
  });
});

function isOwned(check_item) {
  return profile.value.items.some((item) => item.item_id == check_item.id);
}
</script>
