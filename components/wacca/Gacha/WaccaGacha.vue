<template>
  <v-container
    class="box-container mb-16 elevation-1 rounded-xl"
    :style="{ 'background-color': box.color }"
  >
    <div class="polka-dots"></div>

    <div
      class="box-image"
      :style="{
        'background-image': `url(${box.image})`,
      }"
    ></div>

    <div class="pa-4">
      <h1 class="text-h1">{{ boxName(box) }}</h1>
    </div>

    <div class="gacha-border">
      <div class="gacha-holder">
        <div class="gacha-roulette" ref="rouletteRef">
          <WaccaGachaItem
            v-for="(item, i) in itemList"
            :rarity="item.rarity"
            :kind="item.kind"
            :id="item.id"
            ref="itemsRefs"
            :class="{ highlight: i === currentRouletteItem }"
          />
        </div>
      </div>
      <div class="gacha-line"></div>
    </div>

    <div class="pa-4">
      <div class="gamba-buttons">
        <v-btn
          class="elevation-3"
          @click="spin(1)"
          color="primary"
          size="x-large"
          :disabled="!spinReady || !enoughRP"
          :loading="spinLoading"
        >
          <span class="gamba-button-text">
            Gamba
            <div class="gamba-button-cost">{{ box.price }} RP per spin</div>
          </span>
        </v-btn>

        <v-btn
          v-if="props.tenspin"
          class="elevation-3"
          @click="spin(10)"
          color="primary"
          size="x-large"
          :disabled="!spinReady || !enoughRPten"
          :loading="spinLoading"
        >
          <span class="gamba-button-text">
            Gamba&times;10
            <div class="gamba-button-cost">
              {{ box.price * 10 }} RP per spin
            </div>
          </span>
        </v-btn>
      </div>
      <v-expansion-panels class="mt-4">
        <v-expansion-panel title="Available items">
          <v-expansion-panel-text>
            <div class="box-items">
              <div v-for="item in box.items" class="box-item">
                <WaccaGachaItem
                  :kind="item.kind"
                  :id="item.id"
                  :rarity="item.rarity"
                />
              </div>
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>

    <div
      class="item-popup"
      :class="{ active: resultOpen }"
      @click="closeResult"
    >
      <div class="item-popup-inner">
        <div class="item-popup-congrats">
          Item{{ receivedItems.length > 1 ? "s" : "" }} get!
        </div>
        <div class="item-popup-items">
          <div
            class="item-popup-item"
            v-for="(receivedItem, index) in receivedItems"
          >
            <WaccaGachaItem
              :kind="receivedItem.kind"
              :id="receivedItem.id"
              :rarity="receivedItem.rarity"
            />
            <div class="item-popup-new">
              {{ isNew(receivedItem) ? "New!" : "&nbsp;" }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </v-container>
</template>

<style scoped lang="scss">
.box-container {
  color: white;
  position: relative;
  overflow: hidden;
}

.polka-dots {
  position: absolute;
  top: -300px;
  left: -300px;

  width: 2000px;
  height: 2000px;

  background: url("/wacca/img/gacha-background.png") repeat no-repeat;
  background-size: 40px;
  transform: rotate(-20deg);
  opacity: 0.4;
  z-index: 0;
}

.box-image {
  position: absolute;
  top: 10px;
  right: -650px;

  width: 1000px;
  height: 100%;

  background-size: auto 1000px;
  background-position: top left;
}

h1 {
  position: relative;
  text-shadow: black 0px 0px 10px;
}

.gacha-border {
  background: rgba(0, 0, 0, 0.5);
  position: relative;
  overflow: hidden;

  width: 100%;
  padding: 10px;

  mask-image: linear-gradient(
    to right,
    rgba(0, 0, 0, 0),
    rgba(0, 0, 0, 1) 10%,
    rgba(0, 0, 0, 1) 90%,
    rgba(0, 0, 0, 0)
  );
}

.gacha-holder {
  height: 120px;
  width: 100%;
  transform: translateX(50%);
}

.gacha-roulette {
  display: flex;
  gap: 10px;
  padding-left: 5px;
  padding-right: 5px;
  height: 100%;
  width: 100%;
}

.gacha-line {
  position: absolute;
  top: 0px;
  left: 50%;
  width: 3px;
  height: 100%;
  transform: translateX(-50%);
  background: white;
  opacity: 0.8;
}

.container-heading {
  padding: 5px 10px;
}

.gamba-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;

  .v-btn.v-btn--density-default {
    height: auto;
    border-radius: 15px;
    padding: 0.7em 1.3em;
    border: 3px solid rgba(255, 255, 255, 1);
  }

  .gamba-button-text {
    font-size: 3rem;
    font-weight: 500;
    text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
  }

  .gamba-button-cost {
    font-size: 0.3em;
    font-weight: 400;
  }
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

.item-popup {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 1;
  font-size: 2em;

  opacity: 0;
  transition: all 0.3s;
  z-index: -1;

  &.active {
    z-index: 1000;
    opacity: 1;

    .item-popup-inner {
      transform: translateY(0);
    }
  }

  .item-popup-inner {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    transform: translateY(-30px);
    transition: transform 0.3s;
  }

  .item-popup-items {
    display: flex;
    gap: 0.5em;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
  }

  .item-popup-item {
    transform: scale(1);
  }

  .item-popup-congrats {
    font-weight: bold;
  }

  .item-popup-new {
    text-align: center;
    font-size: 1.2em;
    font-weight: bold;
    color: rgb(255, 255, 122);
    text-shadow: 0px 0px 10px gold;
    text-transform: uppercase;
  }
}
</style>

<script setup>
import { Howl } from "howler";

const runtimeConfig = useRuntimeConfig();
const language = useState("language");
const profile = useState("profile");
const activeCard = useState("activeCard");

const props = defineProps({
  box: Object,
  tenspin: Boolean,
});

const itemList = ref([]);
const featuredItem = ref(props.box.items[0]);
const receivedItems = ref([]);

const position = 40;
const itemWidth = 160;

function updateItemList() {
  // clone the box.items
  itemList.value = props.box.items.map((item) => ({ ...item }));
  // randomize order
  itemList.value.sort(() => Math.random() - 0.5);
  // remove received item from list
  itemList.value.splice(
    itemList.value.findIndex((item) => item.id === featuredItem.value.id),
    1
  );

  // insert random items until we have at least 45
  while (itemList.value.length < 45) {
    const randomItem =
      props.box.items[Math.floor(Math.random() * props.box.items.length)];
    itemList.value.push({ ...randomItem });
  }

  // insert received item at position
  itemList.value.splice(position, 0, featuredItem.value);
}

let scrollDistance;

const offset = ref(0);
const rouletteRef = ref(null);
let spinTimer;
let spinStartTime;
const spinTime = 6;
const spinReady = ref(true);
const spinLoading = ref(false);

function spin(amount) {
  spinReady.value = false;
  spinLoading.value = true;

  let gachaUrl = `${runtimeConfig.public.apiUrl}/wacca/user/${activeCard.value}/gacha/${props.box.id}/${amount}`;
  $fetch(gachaUrl, {
    method: "POST",
  })
    .then((data) => {
      spinLoading.value = false;
      receivedItems.value = data.items;

      // find the rarest item that is new
      let newItems = data.items.filter((item) => isNew(item));
      if (newItems.length > 0) {
        newItems.sort((a, b) => b.rarity - a.rarity);
        featuredItem.value = newItems[0];
      } else {
        // if no new items, just show the rarest item
        data.items.sort((a, b) => b.rarity - a.rarity);
        featuredItem.value = data.items[0];
      }

      updateItemList();

      // reset offset in css
      offset.value = 0;

      scrollDistance = position * itemWidth + Math.random() * 130;

      spinTimer = 0;
      spinStartTime = null;

      profile.value.points = data.points;

      requestAnimationFrame(animateSpin);
    })
    .catch((err) => {
      console.error(err);
      spinLoading.value = false;
      spinReady.value = true;
    });
}

const currentRouletteItem = ref(0);
let lastRouletteItem = 0;

const rouletteClickSound = new Howl({
  src: "/wacca/sound/rouletteclick.wav",
  volume: 0.5,
});

const rouletteGetSound = new Howl({
  src: "/wacca/sound/rouletteget.wav",
  volume: 0.5,
});

function animateSpin(currentTime) {
  if (spinTimer < spinTime) {
    if (!spinStartTime) {
      spinStartTime = currentTime;
    }

    spinTimer = (currentTime - spinStartTime) / 1000;

    if (spinTimer >= spinTime) {
      finishSpin();
    }

    const progress = spinTimer / spinTime;

    const progressEased = 1 - Math.pow(1 - progress, 4);

    offset.value = (scrollDistance + 1000) * progressEased - 1000;

    rouletteRef.value.style.transform = `translateX(${-offset.value}px)`;

    const currentItem = Math.floor(offset.value / itemWidth);
    currentRouletteItem.value = currentItem;

    // play clicking noise if the item switched
    if (currentItem >= 0 && currentItem !== lastRouletteItem) {
      lastRouletteItem = currentItem;

      // play sound
      rouletteClickSound.play();
    }

    if (spinTimer < spinTime) {
      requestAnimationFrame(animateSpin);
    }
  }
}

defineExpose({ spin });

function boxName(box) {
  if (language.value === "ja") {
    return box.name;
  } else {
    return box.nameEnglish ?? box.name;
  }
}

function finishSpin() {
  rouletteGetSound.play();
  spinTimer = spinTime;
  resultOpen.value = true;
}

function isNew(item) {
  return !profile.value.items.some((i) => i.item_id === item.id);
}

const resultOpen = ref(false);

function closeResult() {
  resultOpen.value = false;
  spinReady.value = true;
  // add a copy of receiveditems (localside)
  receivedItems.value.forEach((item) => {
    profile.value.items.push({
      item_kind: item.kind,
      item_id: item.id,
    });
  });
}

const enoughRP = computed(() => {
  return profile.value.points >= props.box.price;
});

const enoughRPten = computed(() => {
  return profile.value.points >= props.box.price * 10;
});
</script>
