<template>
  <WaccaProfileRequired>
    <v-container>
      <div v-if="hasVersionData" class="profile-plate-wrapper">
        <div
          class="profile-plate"
          :style="{ backgroundImage: `url(${plateUrl})` }"
          @click="openPicker('plate')"
        >
          <div class="profile-plate-icon" @click.stop="openPicker('icon')">
            <WaccaIcon :icon="iconId" />
          </div>

          <div class="profile-plate-title" @click.stop="openPicker('title')">
            {{ titleText }}
          </div>

          <span class="stat-label profile-plate-lv-label">Lv.</span>
          <span class="stat-value profile-plate-lv-value">{{ level }}</span>
          <span class="stat-label profile-plate-bp-label">BP</span>
          <span class="stat-value profile-plate-bp-value">{{
            profile.points
          }}</span>

          <div class="profile-plate-name" @click.stop="openNameDialog">
            {{ profile.user_name }}
          </div>

          <div
            v-if="
              selectedVersionData.rank > 0 && selectedVersionData.dan_rank > 0
            "
            class="profile-plate-stageup"
          >
            <img :src="stageupMedalUrl" class="stageup-medal" />
            <img :src="stageupNumberUrl" class="stageup-number" />
          </div>

          <div class="profile-plate-rate" @click.stop="openRatingDialog">
            <WaccaRating
              class="rate-value"
              :rating="selectedVersionData.rating"
            />
          </div>
        </div>
      </div>

      <WaccaOptionPickerModal
        v-if="activePicker"
        :title="pickerConfigs[activePicker].title"
        :item-kind="pickerConfigs[activePicker].itemKind"
        :option-id="pickerConfigs[activePicker].optionId"
        :items="pickerConfigs[activePicker].items"
        @closeModal="activePicker = null"
      />

      <v-dialog v-model="isEditNameDialogOpen" max-width="420">
        <v-card>
          <v-card-title>
            <div class="d-flex justify-space-between align-center">
              Change name
              <v-btn
                icon
                variant="plain"
                aria-label="Close"
                @click="isEditNameDialogOpen = false"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </div>
          </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="editedName"
              label="Name"
              maxlength="8"
              counter="8"
              :error-messages="nameErrors"
              @keydown.enter="saveName"
            ></v-text-field>
            <div v-if="nameSaveError" class="name-save-error">
              {{ nameSaveError }}
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="primary"
              :disabled="!canSaveName || isSavingName"
              :loading="isSavingName"
              @click="saveName"
              >Save</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="isEditRatingDialogOpen" max-width="420">
        <v-card>
          <v-card-title>
            <div class="d-flex justify-space-between align-center">
              Change rating
              <v-btn
                icon
                variant="plain"
                aria-label="Close"
                @click="isEditRatingDialogOpen = false"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </div>
          </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="editedRating"
              label="Rating"
              type="number"
              step="0.1"
              min="0"
              :disabled="isRatingTaunted"
              @keydown.enter="saveRating"
            ></v-text-field>
            <div
              v-if="ratingSaveError"
              :class="[
                'name-save-error',
                { 'font-weight-bold': isRatingTaunted }
              ]"
            >
              {{ ratingSaveError }}
            </div>
          </v-card-text>
          <v-card-actions v-if="!isRatingTaunted">
            <v-btn
              color="primary"
              :disabled="isSavingRating"
              :loading="isSavingRating"
              @click="saveRating"
              >Save</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-btn-toggle
        v-if="hasVersionData"
        v-model="activeCategory"
        class="settings-nav mb-6"
        shaped
        mandatory
      >
        <v-btn
          color="primary"
          v-for="category of optionCategories"
          :key="category.name"
        >
          {{ category.name }}
        </v-btn>
      </v-btn-toggle>

      <v-alert v-if="!hasVersionData" type="info" variant="tonal" class="mb-6">
        Looks like you have never played this version of Wacca. Go log in on a
        cab running it to view your settings.
      </v-alert>

      <div v-else class="settings-layout">
        <div ref="previewColumn" class="settings-preview">
          <WaccaPlayfieldPreview
            :options="previewOptions"
            :chart-url="previewChart?.url ?? '/wacca/demo.mer'"
            :chart-info="previewChart?.info ?? null"
            bot-skill="good-up"
          />
        </div>

        <div class="settings-options">
          <template
            v-for="group in optionCategories[activeCategory].groups"
            :key="group.name.en"
          >
            <h2 class="settings-group-name">{{ group.name[language] }}</h2>
            <v-card class="settings-group">
              <WaccaSettingsOption
                v-for="option in group.options"
                :key="option.id"
                :option="option"
                :options="profile.options"
                :saved="savedOptions"
                :language="language"
                @preview="previewChoice = $event"
              />
            </v-card>
          </template>
        </div>
      </div>

      <v-snackbar
        :model-value="hasVersionData && hasChanges"
        :timeout="-1"
        location="bottom"
        multi-line
      >
        You have unsaved changes
        <template v-slot:actions>
          <v-btn :disabled="isSavingOptions" @click="discardOptions"
            >Discard</v-btn
          >
          <v-btn
            color="primary"
            variant="flat"
            :loading="isSavingOptions"
            @click="saveOptions"
            >Save</v-btn
          >
        </template>
      </v-snackbar>

      <v-snackbar
        :model-value="!!saveError"
        :timeout="6000"
        color="error"
        multi-line
        @update:model-value="saveError = ''"
      >
        <div class="save-error">{{ saveError }}</div>
      </v-snackbar>
    </v-container>
  </WaccaProfileRequired>
</template>

<style scoped lang="scss">
// Preview on top on small screens, sticky on the right on big ones
.settings-layout {
  display: grid;
  grid-template-areas:
    "preview"
    "options";
  row-gap: 24px;

  @media (min-width: 960px) {
    grid-template-areas: "options preview";
    grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
    column-gap: 32px;
    align-items: start;
  }
}

.save-error {
  white-space: pre-line;
}

.settings-options {
  grid-area: options;
  min-width: 0;
}

.settings-group-name {
  margin: 0 4px 6px;
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: var(--v-medium-emphasis-opacity);
}

.settings-group {
  margin-bottom: 20px;
  // Outlined on OLED, see plugins/vuetify.ts
  border: var(--v-box-border);
}

.settings-preview {
  grid-area: preview;

  @media (min-width: 960px) {
    position: sticky;
    // Keep the preview centered while scrolling
    top: v-bind(previewTop);

    // Fill the column but keep the circle and controls (48px) on screen
    :deep(.playfield-preview) {
      width: min(100%, calc(100vh - 32px - 48px));
    }
  }
}

.v-btn-toggle {
  flex-wrap: wrap;
  justify-content: center;
}

.settings-nav {
  display: flex;
  width: 100%;

  .v-btn {
    flex: 1 1 auto;
  }
}

.v-btn-group--density-default.v-btn-group {
  height: auto;
}

.v-btn-group .v-btn {
  min-height: 40px;
}

// The plate is scaled past its box, only the dome above it may stick out
.profile-plate-wrapper {
  overflow-x: clip;
  display: flow-root;
}

.profile-plate {
  position: relative;
  width: 100%;
  aspect-ratio: 1024 / 256;
  background-size: cover;
  background-position: center;
  // Every plate image is 1024x256 with transparent sides, the art spans x=58..965 at
  // the bottom. Scale up from the bottom center so that part fills the width. The
  // margin makes room for the dome growing upward (art top is at y=11)
  --plate-scale: 1.129;
  margin-top: 2.1%;
  margin-bottom: 32px;
  transform: scale(var(--plate-scale));
  transform-origin: 50% 100%;
  clip-path: circle(73% at 50% 218%);
  container-type: inline-size;
  cursor: pointer;

  &:hover:not(
      :has(
        .profile-plate-icon:hover,
        .profile-plate-title:hover,
        .profile-plate-name:hover,
        .profile-plate-rate:hover
      )
    ) {
    filter: brightness(1.05);
  }
}

.profile-plate-icon {
  position: absolute;
  left: 19%;
  bottom: 2.6%;
  height: 50%;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;

  &:hover {
    filter: brightness(1.15);
  }

  :deep(img) {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.profile-plate-title {
  position: absolute;
  left: 31%;
  top: 27.2%;
  max-width: 32%;
  font-size: 1.9cqw;
  font-weight: 600;
  color: #574e4e;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}

.stat-label {
  position: absolute;
  font-size: 1.8cqw;
  font-weight: 500;
  opacity: 0.75;
  color: #bbb;
}

.stat-value {
  position: absolute;
  font-size: 2.5cqw;
  font-weight: 700;
  color: #574e4e;
}

.profile-plate-lv-label {
  left: 31%;
  bottom: 43%;
}

.profile-plate-lv-value {
  left: 35.5%;
  bottom: 41.5%;
}

.profile-plate-bp-label {
  left: 41.7%;
  bottom: 43%;
}

.profile-plate-bp-value {
  left: 45.5%;
  bottom: 41.5%;
}

.profile-plate-name {
  position: absolute;
  left: 34%;
  bottom: 15%;
  max-width: 32%;
  font-size: 3cqw;
  font-weight: 600;
  color: #1a1a2e;
  paint-order: stroke fill;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}

.name-save-error {
  color: rgb(var(--v-theme-error));
  font-size: 0.8rem;
  line-height: 1.2;
  margin-top: -4px;
}

.profile-plate-stageup {
  position: absolute;
  right: 22%;
  bottom: 7%;
  width: 8%;
  aspect-ratio: 1 / 1;

  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }

  .stageup-number {
    filter: brightness(0);
  }
}

.profile-plate-rate {
  position: absolute;
  right: 15%;
  bottom: 3.5%;
  text-align: center;
  color: white;
  text-shadow: 0 0.15cqw 0.4cqw rgba(0, 0, 0, 0.9);
  cursor: pointer;

  &:hover {
    filter: brightness(1.15);
  }

  .rate-value {
    display: block;
    font-size: 2.3cqw;
  }
}
</style>

<script setup>
definePageMeta({
  middleware: ["auth"]
});

import waccaUserPlates from "~/assets/wacca/waccaUserPlates.js";
import waccaTitles from "~/assets/wacca/waccaTitles.js";
import waccaIcons from "~/assets/wacca/waccaIcons.js";
import waccaSymbolColors from "~/assets/wacca/waccaSymbolColors.js";
import waccaSoundEffects from "~/assets/wacca/waccaSoundEffects.js";
import { getSongById } from "~/assets/wacca/getSongs.js";
import { chartPath } from "~/assets/wacca/playfield/merChart.js";
import { formatDifficulty } from "~/assets/js/util";

const runtimeConfig = useRuntimeConfig();
const language = useState("language");
const profile = useState("profile");
const version = useState("version");
const activeCard = useState("activeCard");

const activePicker = ref(null);
const pickerConfigs = {
  icon: {
    title: "Choose Icon",
    itemKind: 6,
    optionId: 1003,
    items: waccaIcons
  },
  title: {
    title: "Choose Title",
    itemKind: 5,
    optionId: 1002,
    items: waccaTitles
  },
  plate: {
    title: "Choose Plate",
    itemKind: 16,
    optionId: 1005,
    items: waccaUserPlates
  }
};

function openPicker(kind) {
  activePicker.value = kind;
}

const isEditNameDialogOpen = ref(false);
const editedName = ref("");
const isSavingName = ref(false);
const nameSaveError = ref("");

const trimmedEditedName = computed(() => editedName.value.trim());

const canSaveName = computed(() => {
  const length = trimmedEditedName.value.length;
  return length >= 1 && length <= 8;
});

const nameErrors = computed(() => {
  if (
    trimmedEditedName.value.length === 0 ||
    trimmedEditedName.value.length > 8
  ) {
    return ["Name must be 1-8 characters."];
  }

  return [];
});

watch(editedName, () => {
  nameSaveError.value = "";
});

function openNameDialog() {
  editedName.value = profile.value.user_name ?? "";
  nameSaveError.value = "";
  isEditNameDialogOpen.value = true;
}

async function saveName() {
  if (!canSaveName.value || isSavingName.value) {
    return;
  }

  isSavingName.value = true;
  nameSaveError.value = "";

  try {
    const data = await $fetch(
      `${runtimeConfig.public.apiUrl}/wacca/user/${activeCard.value}/changename`,
      {
        method: "POST",
        body: { name: trimmedEditedName.value }
      }
    );

    profile.value.user_name = data.user_name ?? trimmedEditedName.value;
    isEditNameDialogOpen.value = false;
  } catch {
    nameSaveError.value = "Failed to change name.";
  } finally {
    isSavingName.value = false;
  }
}

// Rating looks editable but never saves
const isEditRatingDialogOpen = ref(false);
const editedRating = ref("");
const isSavingRating = ref(false);
const ratingSaveError = ref("");
// Second try at a rating above the real one gets a taunt and no more saving
const inflatedRatingAttempts = ref(0);
const isRatingTaunted = ref(false);

watch(editedRating, () => {
  if (!isRatingTaunted.value) ratingSaveError.value = "";
});

function openRatingDialog() {
  editedRating.value = ((selectedVersionData.value.rating ?? 0) / 10).toFixed(
    1
  );
  if (!isRatingTaunted.value) ratingSaveError.value = "";
  isEditRatingDialogOpen.value = true;
}

async function saveRating() {
  if (isSavingRating.value || isRatingTaunted.value) {
    return;
  }

  isSavingRating.value = true;
  ratingSaveError.value = "";

  await new Promise((resolve) => setTimeout(resolve, 1000));

  const realRating = (selectedVersionData.value.rating ?? 0) / 10;
  if (Number(editedRating.value) > realRating) {
    inflatedRatingAttempts.value++;
  }

  if (inflatedRatingAttempts.value >= 2) {
    isRatingTaunted.value = true;
    editedRating.value = realRating.toFixed(1);
    ratingSaveError.value = "ズルしようってワケ？レートはちゃんと稼いでね。";
  } else {
    ratingSaveError.value = "Error saving new rating. Try again.";
  }
  isSavingRating.value = false;
}

const level = computed(() => Math.floor(profile.value.exp / 100) + 1);
const iconId = computed(() => profile.value.options[1003] ?? 102001);
const plateId = computed(() => profile.value.options[1005] ?? 211001);
const plateUrl = computed(() => {
  const plate = waccaUserPlates.find((p) => p.id === plateId.value);
  return `/wacca/img/plates/${plate?.path ?? "uT_US_1"}.webp`;
});

// Options are saved per version, a version that was never played has none
const hasVersionData = computed(
  () => !!profile.value.version_data[version.value]
);

const selectedVersionData = computed(() => {
  return (
    profile.value.version_data[version.value] ?? profile.value.version_data[300]
  );
});

const titleText = computed(() => {
  const titleId = profile.value.options[1002];
  return waccaTitles.find((t) => t.id === titleId)?.name ?? "";
});

const stageupMedalDesigns = [1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 4, 4, 5, 5];
const stageupMedalUrl = computed(() => {
  const design = stageupMedalDesigns[selectedVersionData.value.rank - 1];
  return `/wacca/img/stageup/level_${design}_${selectedVersionData.value.dan_rank}.webp`;
});
const stageupNumberUrl = computed(
  () => `/wacca/img/stageup/number_${selectedVersionData.value.rank}.webp`
);

const ownsItem = useOwnedItems();

// Color schemes ("My Color") are items, only owned ones can be picked.
// The current one stays listed even if it's not owned so it still shows
const colorSchemeOptions = computed(() =>
  waccaSymbolColors
    .filter(
      (scheme) => ownsItem(scheme.id) || scheme.id === profile.value.options[4]
    )
    .map((scheme) => ({
      text: {
        ja: scheme.name,
        en: scheme.nameEnglish
      },
      value: scheme.id,
      consoleColors: scheme.colors
    }))
);

// Note touch sounds ("入力SE") work the same way
const noteSoundOptions = computed(() =>
  waccaSoundEffects
    .filter(
      (sound) => ownsItem(sound.id) || sound.id === profile.value.options[3]
    )
    .map((sound) => ({
      text: {
        ja: sound.name,
        en: sound.nameEnglish
      },
      value: sound.id
    }))
);

const colorOptions = [
  {
    text: {
      ja: "ライトマゼンタ",
      en: "Light Magenta"
    },
    value: 5
  },
  {
    text: {
      ja: "ライトイエロー",
      en: "Light Yellow"
    },
    value: 6
  },
  {
    text: {
      ja: "オレンジ",
      en: "Orange"
    },
    value: 4
  },
  {
    text: {
      ja: "ライム",
      en: "Lime"
    },
    value: 3
  },
  {
    text: {
      ja: "レッド",
      en: "Red"
    },
    value: 1
  },
  {
    text: {
      ja: "スカイブルー",
      en: "Sky Blue"
    },
    value: 2
  },
  {
    text: {
      ja: "ダークイエロー",
      en: "Dark Yellow"
    },
    value: 7
  },
  {
    text: {
      ja: "ライトレッド",
      en: "Dark Orange"
    },
    value: 1001
  },
  {
    text: {
      ja: "イエロー",
      en: "Yellow"
    },
    value: 1002
  },
  {
    text: {
      ja: "ピュアグリーン",
      en: "Pure Green"
    },
    value: 1003
  },
  {
    text: {
      ja: "ブライトブルー",
      en: "Bright Blue"
    },
    value: 1004
  },
  {
    text: {
      ja: "ライトブルー",
      en: "Light Blue"
    },
    value: 1005
  },
  {
    text: {
      ja: "ライトグレー",
      en: "Light Gray"
    },
    value: 1006
  }
];

// Short ranges get a button per value instead of a slider
const numberChoices = (min, max) =>
  Array.from({ length: max - min + 1 }, (_, index) => ({
    text: { en: String(min + index) },
    value: min + index
  }));

// Same tabs and order as the in-game option menus (MusicSelectOption* tables), split
// into groups. Labels are short for the rows, the in-game title is in the tooltip
const optionCategories = [
  {
    name: "Game Settings",
    groups: [
      {
        name: {
          en: "Timing",
          ja: "タイミング"
        },
        options: [
          {
            id: 1,
            label: {
              en: "Speed",
              ja: "スピード"
            },
            type: "slider",
            title: {
              en: "Speed Settings",
              ja: "スピード調整"
            },
            description: {
              en: "Adjust how fast notes travel.",
              ja: "ノーツのスピードの設定を調整します。"
            },
            default: 5,
            min: 0,
            max: 50,
            step: 1,
            format: (value) => `×${(value / 10 + 1).toFixed(1)}`
          },

          {
            id: 108,
            label: {
              en: "Audio Offset",
              ja: "判定調整"
            },
            title: {
              en: "Audio Offset Settings",
              ja: "判定調整設定"
            },
            description: {
              en: "Adjust the audio offset.",
              ja: "入力判定タイミングを調整できます。"
            },
            type: "slider",
            default: 100,
            min: 0,
            max: 200,
            step: 1,
            format: (value) => {
              const offset = (value - 100) / 10;
              return offset > 0 ? `+${offset}` : `${offset}`;
            }
          }
        ]
      },
      {
        name: {
          en: "Screen",
          ja: "画面"
        },
        options: [
          {
            id: 2,
            label: {
              en: "Mask Opacity",
              ja: "マスク濃度"
            },
            title: {
              en: "Mask Opacity",
              ja: "マスク濃度"
            },
            description: {
              en: "Adjust the background mask opacity.",
              ja: "マスク濃度の設定を調整します。"
            },
            type: "buttons",
            default: 0,
            choices: numberChoices(0, 4)
          },

          {
            id: 7,
            label: {
              en: "Background Video",
              ja: "背景動画"
            },
            title: {
              en: "Background Video Settings",
              ja: "背景動画設定"
            },
            description: {
              en: "Choose how songs with videos are displayed before playing them.",
              ja: "動画再生対応楽曲をプレイする前に動画再生を確認するか設定を変更します。"
            },
            type: "buttons",
            default: 0,
            choices: [
              {
                text: {
                  ja: "毎回確認",
                  en: "Ask"
                },
                value: 0
              },
              {
                text: {
                  ja: "OFF",
                  en: "OFF"
                },
                value: 1
              },
              {
                text: {
                  ja: "ON",
                  en: "ON"
                },
                value: 2
              }
            ]
          }
        ]
      },
      {
        name: {
          en: "Play",
          ja: "プレイ"
        },
        options: [
          {
            id: 114,
            label: {
              en: "Bonus Effect",
              ja: "ボーナス効果"
            },
            title: {
              en: "Bonus Effect",
              ja: "ボーナス効果"
            },
            description: {
              en: "Choose whether bonus notes have their bonus effect.",
              ja: "ボーナス効果の設定を行います。"
            },
            type: "toggle",
            default: 1
          },

          {
            id: 101,
            label: {
              en: "Mirror",
              ja: "ミラー"
            },
            title: {
              en: "Mirror Settings",
              ja: "ミラー設定"
            },
            description: {
              en: "Choose how to mirror the notes.",
              ja: "プレイ中のノーツ配置を入れ替えます。"
            },
            type: "options",
            default: 0,
            choices: [
              { text: { en: "None", ja: "なし" }, value: 0 },
              { text: { en: "L/R Mirror", ja: "左右ミラー" }, value: 1 },
              { text: { en: "U/D Mirror", ja: "上下ミラー" }, value: 2 },
              {
                text: { en: "U/D + L/R Mirror", ja: "上下＋左右ミラー" },
                value: 3
              }
            ]
          },

          {
            id: 117,
            label: {
              en: "Give Up",
              ja: "ギブアップ"
            },
            title: {
              en: "Give Up Settings",
              ja: "ギブアップ設定"
            },
            description: {
              en: "Set the ability to give-up a song mid-game.",
              ja: "プレイ中の「途中終了」を設定できます。"
            },
            type: "options",
            default: 0,
            choices: [
              {
                text: {
                  ja: "なし",
                  en: "OFF"
                },
                value: 0
              },
              {
                text: {
                  ja: "ノータッチ",
                  en: "No-Touch"
                },
                value: 1
              },
              {
                text: {
                  ja: "Sボーダー",
                  en: "S Border"
                },
                value: 2
              },
              {
                text: {
                  ja: "SSボーダー",
                  en: "SS Border"
                },
                value: 3
              },
              {
                text: {
                  ja: "SSSボーダー",
                  en: "SSS Border"
                },
                value: 4
              },
              {
                text: {
                  ja: "自己ベストボーダー",
                  en: "Personal Best Border"
                },
                value: 5
              }
            ]
          }
        ]
      }
    ]
  },
  {
    name: "Display Info Settings",
    groups: [
      {
        name: {
          en: "Judgment",
          ja: "判定"
        },
        options: [
          {
            id: 102,
            label: {
              en: "Position",
              ja: "位置"
            },
            title: {
              en: "Judgment Display Position",
              ja: "判定表示位置"
            },
            description: {
              en: 'Adjust the display position of judgments such as "Marvelous".',
              ja: "「Ｍａｒｖｅｌｏｕｓ」などの判定の表示位置を調整します。"
            },
            type: "buttons",
            default: 0,
            choices: [
              {
                text: {
                  ja: "センター",
                  en: "CENTER"
                },
                value: 0
              },
              {
                text: {
                  ja: "アンダー",
                  en: "LOW"
                },
                value: 1
              },
              {
                text: {
                  ja: "トップ",
                  en: "HIGH"
                },
                value: 2
              },
              {
                text: {
                  ja: "OFF",
                  en: "OFF"
                },
                value: 3
              }
            ]
          },

          {
            id: 103,
            label: {
              en: "Fast / Late",
              ja: "詳細表示"
            },
            title: {
              en: "Judgment Detail Display",
              ja: "判定詳細表示"
            },
            description: {
              en: 'Choose whether to display "FAST/LATE" for non-Marvelous hits.',
              ja: "「Ｍａｒｖｅｌｏｕｓ」以外の判定の時に「ＦＡＳＴ／ＬＡＴＥ」の表示を追加できます。"
            },
            type: "toggle",
            default: 0
          }
        ]
      },
      {
        name: {
          en: "Guidelines",
          ja: "ガイドライン"
        },
        options: [
          {
            id: 118,
            label: {
              en: "Lines",
              ja: "本数"
            },
            title: {
              en: "Guideline Interval",
              ja: "ガイドライン間隔線表示"
            },
            description: {
              en: "Choose how many guidelines are displayed.",
              ja: "ガイドラインの間隔線を設定できます。"
            },
            type: "buttons",
            default: 1,
            // The in-game types A to G (1-7), named by how many lines they draw, then
            // none (0) at the end
            choices: [60, 30, 20, 15, 12, 6, 4, 0].map((lines, index) => ({
              text: { en: String(lines) },
              value: lines ? index + 1 : 0
            }))
          },

          {
            id: 106,
            label: {
              en: "Intensity",
              ja: "濃度"
            },
            title: {
              en: "Guideline Intensity",
              ja: "ガイドラインの濃度"
            },
            description: {
              en: "You can adjust the intensity of the guidelines.",
              ja: "ガイドラインの濃度を調整できます。"
            },
            type: "buttons",
            default: 5,
            choices: numberChoices(0, 5)
          }
        ]
      },
      {
        name: {
          en: "On Screen",
          ja: "表示情報"
        },
        options: [
          {
            id: 140,
            label: {
              en: "Info Opacity",
              ja: "情報の濃度"
            },
            title: {
              en: "Display Information Opacity",
              ja: "表示情報の濃度"
            },
            description: {
              en: "You can make the displayed information transparent.",
              ja: "表示情報の濃度を調整できます。"
            },
            type: "buttons",
            default: 5,
            choices: numberChoices(0, 5)
          },

          {
            id: 105,
            label: {
              en: "Barlines",
              ja: "小節線"
            },
            title: {
              en: "Barline Display",
              ja: "小節線表示"
            },
            description: {
              en: "You can show or hide barlines.",
              ja: "小節線の表示を設定できます。"
            },
            type: "toggle",
            default: 1
          },

          {
            id: 119,
            label: {
              en: "Center",
              ja: "中央表示"
            },
            title: {
              en: "Center Display",
              ja: "中央表示"
            },
            description: {
              en: "Adjust information displayed in the screen center.",
              ja: "画面中央表示を設定できます。"
            },
            type: "options",
            default: 1,
            choices: [
              {
                text: {
                  ja: "なし",
                  en: "None"
                },
                value: 0
              },
              {
                text: {
                  ja: "COMBO",
                  en: "COMBO"
                },
                value: 1
              },
              {
                text: {
                  ja: "SCORE(プラス方式)",
                  en: "Score (Plus Method)"
                },
                value: 2
              },
              {
                text: {
                  ja: "SCORE(マイナス方式タイプ)",
                  en: "Score (Minus Method)"
                },
                value: 3
              },
              {
                text: {
                  ja: "Sボーダー",
                  en: "S Border"
                },
                value: 4
              },
              {
                text: {
                  ja: "SSボーダー",
                  en: "SS Border"
                },
                value: 5
              },
              {
                text: {
                  ja: "SSSボーダー",
                  en: "SSS Border"
                },
                value: 6
              },
              {
                text: {
                  ja: "自己ベストボーダー",
                  en: "Personal Best Border"
                },
                value: 7
              }
            ]
          },

          {
            id: 116,
            label: {
              en: "Score",
              ja: "スコア"
            },
            title: {
              en: "Score Display",
              ja: "スコア表示方式"
            },
            description: {
              en: "Choose which method to display your score.",
              ja: "ゲーム中のスコアの表示方式を変更できます。"
            },
            type: "buttons",
            default: 0,
            choices: [
              {
                text: {
                  ja: "プラス方式",
                  en: "Plus Method"
                },
                value: 0
              },
              {
                text: {
                  ja: "マイナス方式",
                  en: "Minus Method"
                },
                value: 1
              }
            ]
          },

          {
            id: 120,
            label: {
              en: "Ranking",
              ja: "順位"
            },
            title: {
              en: "Ranking Display",
              ja: "順位表示"
            },
            description: {
              en: "Adjust how rankings are shown in multiplayer.",
              ja: "マルチプレイ中の順位の表示を設定できます。"
            },
            type: "toggle",
            default: 1
          },

          {
            id: 121,
            label: {
              en: "Emblem",
              ja: "エンブレム"
            },
            title: {
              en: "Emblem Display",
              ja: "エンブレム表示"
            },
            description: {
              en: "Adjust the display of Stage Up Emblems.",
              ja: "ステージアップエンブレムの表示を設定できます。"
            },
            type: "toggle",
            default: 1
          },

          {
            id: 122,
            label: {
              en: "Rate",
              ja: "レート"
            },
            title: {
              en: "Rate Display",
              ja: "レート表示"
            },
            description: {
              en: "Adjust the display of ratings.",
              ja: "レーティングの表示を設定できます。"
            },
            type: "toggle",
            default: 1
          },

          {
            id: 123,
            label: {
              en: "Player Level",
              ja: "プレイヤーレベル"
            },
            title: {
              en: "Player Level Display",
              ja: "プレイヤーレベル表示"
            },
            description: {
              en: "Adjust player level display.",
              ja: "プレイヤーレベルの表示を設定できます。"
            },
            type: "toggle",
            default: 1
          }
        ]
      },
      {
        name: {
          en: "Skip Animations",
          ja: "簡易演出"
        },
        options: [
          {
            id: 132,
            label: {
              en: "Gate Progress",
              ja: "ゲート進行"
            },
            title: {
              en: "Gate Skip",
              ja: "ゲート簡易演出"
            },
            description: {
              en: "Choose whether to shorten the Gate progress animations.",
              ja: "ゲート進行の簡易演出を設定できます。"
            },
            type: "toggle",
            default: 0
          },

          {
            id: 141,
            label: {
              en: "WACCA Bingo",
              ja: "WACCA BINGO"
            },
            title: {
              en: "WACCA Bingo Skip",
              ja: "WACCA BINGO簡易演出"
            },
            description: {
              en: "Choose whether to shorten the WACCA Bingo animations.",
              ja: "WACCA BINGOの簡易演出を設定できます。"
            },
            type: "toggle",
            default: 0
          }
        ]
      }
    ]
  },
  {
    name: "Design Settings",
    groups: [
      {
        name: {
          en: "Console",
          ja: "コンソール"
        },
        options: [
          {
            id: 4,
            label: {
              en: "Colors",
              ja: "マイカラー"
            },
            title: {
              en: "Customize Colors",
              ja: "マイカラー"
            },
            description: {
              en: "Change the color pattern of the WACCA console.",
              ja: "ＷＡＣＣＡコンソールのカラーパターンを変更します。"
            },
            type: "options",
            default: 103001,
            // Getter so the list follows the owned items
            get choices() {
              return colorSchemeOptions.value;
            }
          }
        ]
      },
      {
        name: {
          en: "Notes",
          ja: "ノーツ"
        },
        options: [
          {
            id: 110,
            label: {
              en: "Thickness",
              ja: "ノーツ幅"
            },
            title: {
              en: "Note Thickness",
              ja: "ノーツ幅設定"
            },
            description: {
              en: "Adjust how thick notes are displayed.",
              ja: "ノーツの幅を設定できます。"
            },
            type: "buttons",
            default: 3,
            choices: numberChoices(1, 5)
          },

          {
            id: 205,
            label: {
              en: "Touch",
              ja: "タッチ"
            },
            title: {
              en: "Touch Note Color",
              ja: "タッチノーツの色"
            },
            description: {
              en: "Set the color of Touch Notes.",
              ja: "タッチノーツの色を設定します。"
            },
            type: "options",
            default: 5,
            choices: colorOptions,
            noteType: "touch"
          },

          {
            id: 206,
            label: {
              en: "Chain",
              ja: "チェイン"
            },
            title: {
              en: "Chain Note Color",
              ja: "チェインノーツの色"
            },
            description: {
              en: "Set the color of Chain Notes.",
              ja: "チェインノーツの色を設定します。"
            },
            type: "options",
            default: 6,
            choices: colorOptions,
            noteType: "chain"
          },

          {
            id: 201,
            label: {
              en: "← Slide",
              ja: "←スライド"
            },
            title: {
              en: "← Slide Note Color",
              ja: "←スライドノーツの色"
            },
            description: {
              en: "Set the color of ← Slide Notes.",
              ja: "←スライドノーツの色を設定します。"
            },
            type: "options",
            default: 4,
            choices: colorOptions,
            noteType: "slideCW"
          },

          {
            id: 202,
            label: {
              en: "→ Slide",
              ja: "→スライド"
            },
            title: {
              en: "→ Slide Note Color",
              ja: "→スライドノーツの色"
            },
            description: {
              en: "Set the color of → Slide Notes.",
              ja: "→スライドノーツの色を設定します。"
            },
            type: "options",
            default: 3,
            choices: colorOptions,
            noteType: "slideCCW"
          },

          {
            id: 203,
            label: {
              en: "↑ Snap",
              ja: "↑スナップ"
            },
            title: {
              en: "↑ Snap Note Color",
              ja: "↑スナップノーツの色"
            },
            description: {
              en: "Set the color of ↑ Snap Notes.",
              ja: "↑スナップノーツの色を設定します。"
            },
            type: "options",
            default: 1,
            choices: colorOptions,
            noteType: "snapIn"
          },

          {
            id: 204,
            label: {
              en: "↓ Snap",
              ja: "↓スナップ"
            },
            title: {
              en: "↓ Snap Note Color",
              ja: "↓スナップノーツの色"
            },
            description: {
              en: "Set the color of ↓ Snap Notes.",
              ja: "↓スナップノーツの色を設定します。"
            },
            type: "options",
            default: 2,
            choices: colorOptions,
            noteType: "snapOut"
          },

          {
            id: 207,
            label: {
              en: "Hold",
              ja: "ホールド"
            },
            title: {
              en: "Hold Note Color",
              ja: "ホールドノーツの色"
            },
            description: {
              en: "Set the color of Hold Notes.",
              ja: "ホールドノーツの色を設定します。"
            },
            type: "options",
            default: 7,
            choices: colorOptions,
            noteType: "hold"
          },

          {
            id: 136,
            label: {
              en: "Invert Slides",
              ja: "スライド反転"
            },
            title: {
              en: "Invert Slide Colors",
              ja: "スライドカラー反転"
            },
            description: {
              en: "Inverts the slide color gradient.",
              ja: "スライドのグラデーションを反転します。"
            },
            type: "toggle",
            default: 0
          }
        ]
      },
      {
        name: {
          en: "Effects",
          ja: "エフェクト"
        },
        options: [
          {
            id: 1006,
            label: {
              en: "Touch Pop",
              ja: "ポップ"
            },
            title: {
              en: "Touch Effect (Pop)",
              ja: "タッチエフェクト(ポップ)"
            },
            description: {
              en: "Choose which popping touch effects are shown.",
              ja: "タッチエフェクト(ポップ)の表示を設定できます。"
            },
            type: "buttons",
            default: 312001,
            choices: [
              {
                text: {
                  ja: "OFF",
                  en: "OFF"
                },
                value: 312000
              },
              {
                text: {
                  ja: "デフォルト",
                  en: "Default"
                },
                value: 312001
              },
              {
                text: {
                  ja: "バブル",
                  en: "Bubble"
                },
                value: 312002
              }
            ]
          },

          {
            id: 138,
            label: {
              en: "Touch Shoot",
              ja: "シュート"
            },
            title: {
              en: "Touch Effect (Shoot)",
              ja: "タッチエフェクト(シュート)"
            },
            description: {
              en: "Choose whether to show shooting touch effects.",
              ja: "タッチエフェクト(シュート)の表示を設定できます。"
            },
            type: "toggle",
            default: 1
          },

          {
            id: 133,
            label: {
              en: "Key Beam",
              ja: "キービーム"
            },
            title: {
              en: "Key Beam",
              ja: "キービーム"
            },
            description: {
              en: "Choose whether to show the key beam effect.",
              ja: "キービームの表示を設定できます。"
            },
            type: "toggle",
            default: 1
          },

          {
            id: 139,
            label: {
              en: "R Note",
              ja: "Ｒノーツ"
            },
            title: {
              en: "R Note Effect",
              ja: "Ｒノーツエフェクト"
            },
            description: {
              en: "Choose whether to show R note effects.",
              ja: "Ｒノーツエフェクトの表示を設定できます。"
            },
            type: "toggle",
            default: 1
          }
        ]
      }
    ]
  },
  {
    name: "Sound Settings",
    groups: [
      {
        name: {
          en: "Sound Effects",
          ja: "ＳＥ"
        },
        options: [
          {
            id: 3,
            label: {
              en: "Touch",
              ja: "タッチ"
            },
            title: {
              en: "Note Touch SFX",
              ja: "ノーツタッチＳＥ"
            },
            description: {
              en: "Change the sound effect when notes are touched.",
              ja: "ノーツをタッチしたときのＳＥを変更します。"
            },
            type: "options",
            default: 105001,
            // Getter so the list follows the owned items
            get choices() {
              return noteSoundOptions.value;
            }
          },

          {
            id: 115,
            label: {
              en: "Character Voices",
              ja: "キャラクター音声"
            },
            title: {
              en: "Character Voices",
              ja: "キャラクター音声"
            },
            description: {
              en: "You can turn character voices on or off.",
              ja: "プレイ中（演奏中）のキャラクター音声をＯＮ／ＯＦＦできます"
            },
            type: "toggle",
            default: 1
          }
        ]
      },
      {
        name: {
          en: "Volume",
          ja: "ボリューム"
        },
        options: [
          {
            id: 1001,
            label: {
              en: "Headphone Volume",
              ja: "ヘッドホンボリューム"
            },
            title: {
              en: "Headphone Volume",
              ja: "ヘッドホンボリューム"
            },
            description: {
              en: "Set with the volume buttons on the cabinet, saved to your profile.",
              ja: "筐体のボリュームボタンで調整した音量です。"
            },
            type: "slider",
            default: 0,
            min: 0,
            max: 20,
            step: 1,
            format: (value) => value
          },

          {
            id: 5,
            label: {
              en: "BGM",
              ja: "ＢＧＭ"
            },
            title: {
              en: "BGM Volume",
              ja: "ＢＧＭボリューム"
            },
            description: {
              en: "Adjust the volume of the music that plays during gameplay.",
              ja: "プレイ中(演奏中)のＢＧＭの音量を調整します。"
            },
            type: "slider",
            default: 10,
            min: 0,
            max: 10,
            step: 1,
            format: (value) => `${value * 10}%`
          },

          {
            id: 125,
            label: {
              en: "Guide Sound",
              ja: "ガイド音"
            },
            title: {
              en: "Guide Sound Volume",
              ja: "ガイド音ボリューム"
            },
            description: {
              en: "Adjust the volume of the guide sounds that occur during gameplay.",
              ja: "プレイ中(演奏中)のガイド音の音量を調整します。"
            },
            type: "slider",
            default: 3,
            min: 0,
            max: 10,
            step: 1,
            format: (value) => `${value * 10}%`
          }
        ]
      },
      {
        name: {
          en: "Note Volume",
          ja: "ノーツボリューム"
        },
        options: [
          {
            id: 126,
            label: {
              en: "Touch",
              ja: "タッチ"
            },
            title: {
              en: "Touch Note Volume",
              ja: "タッチノーツボリューム"
            },
            description: {
              en: "Adjust the volume of touch note sounds that occur during gameplay.",
              ja: "プレイ中(演奏中)のタッチノーツ音の音量を調整します。"
            },
            type: "slider",
            default: 8,
            min: 0,
            max: 10,
            step: 1,
            format: (value) => `${value * 10}%`
          },

          {
            id: 127,
            label: {
              en: "Hold",
              ja: "ホールド"
            },
            title: {
              en: "Hold Note Volume",
              ja: "ホールドノーツボリューム"
            },
            description: {
              en: "Adjust the volume of hold note sounds that occur during gameplay.",
              ja: "プレイ中(演奏中)のホールドノーツ音の音量を調整します。"
            },
            type: "slider",
            default: 8,
            min: 0,
            max: 10,
            step: 1,
            format: (value) => `${value * 10}%`
          },

          {
            id: 128,
            label: {
              en: "Slide",
              ja: "スライド"
            },
            title: {
              en: "Slide Note Volume",
              ja: "スライドノーツボリューム"
            },
            description: {
              en: "Adjust the volume of slide note sounds that occur during gameplay.",
              ja: "プレイ中(演奏中)のスライドノーツ音の音量を調整します。"
            },
            type: "slider",
            default: 8,
            min: 0,
            max: 10,
            step: 1,
            format: (value) => `${value * 10}%`
          },

          {
            id: 129,
            label: {
              en: "Snap",
              ja: "スナップ"
            },
            title: {
              en: "Snap Note Volume",
              ja: "スナップノーツボリューム"
            },
            description: {
              en: "Adjust the volume of snap note sounds that occur during gameplay.",
              ja: "プレイ中(演奏中)のスナップノーツ音の音量を調整します。"
            },
            type: "slider",
            default: 8,
            min: 0,
            max: 10,
            step: 1,
            format: (value) => `${value * 10}%`
          },

          {
            id: 130,
            label: {
              en: "Chain",
              ja: "チェイン"
            },
            title: {
              en: "Chain Note Volume",
              ja: "チェインノーツボリューム"
            },
            description: {
              en: "Adjust the volume of chain note sounds that occur during gameplay.",
              ja: "プレイ中(演奏中)のチェインノーツ音の音量を調整します。"
            },
            type: "slider",
            default: 8,
            min: 0,
            max: 10,
            step: 1,
            format: (value) => `${value * 10}%`
          },

          {
            id: 131,
            label: {
              en: "Bonus",
              ja: "ボーナス"
            },
            title: {
              en: "Bonus Note Volume",
              ja: "ボーナスノーツボリューム"
            },
            description: {
              en: "Adjust the volume of bonus note sounds that occur during gameplay.",
              ja: "プレイ中(演奏中)のボーナスノーツ音の音量を調整します。"
            },
            type: "slider",
            default: 8,
            min: 0,
            max: 10,
            step: 1,
            format: (value) => `${value * 10}%`
          },

          {
            id: 135,
            label: {
              en: "R Note",
              ja: "Ｒノーツ"
            },
            title: {
              en: "R Note Volume",
              ja: "Ｒノーツボリューム"
            },
            description: {
              en: "Adjust the volume of R note sounds that occur during gameplay.",
              ja: "プレイ中(演奏中)のＲノーツ音の音量を調整します。"
            },
            type: "slider",
            default: 8,
            min: 0,
            max: 10,
            step: 1,
            format: (value) => `${value * 10}%`
          }
        ]
      }
    ]
  }
];

const activeCategory = ref(0);

// The options as they came with the profile. Nothing's saved yet, so changed rows can
// go back to these
const savedOptions = ref({});
watch(profile, (loaded) => (savedOptions.value = { ...loaded?.options }), {
  immediate: true
});

const hasChanges = computed(() => {
  const current = profile.value?.options ?? {};
  const saved = savedOptions.value;
  const ids = new Set([...Object.keys(current), ...Object.keys(saved)]);
  return [...ids].some((id) => current[id] !== saved[id]);
});

const isSavingOptions = ref(false);
const saveError = ref("");

function discardOptions() {
  const current = profile.value.options;
  for (const id of Object.keys(current)) {
    if (!(id in savedOptions.value)) delete current[id];
  }
  Object.assign(current, savedOptions.value);
}

// Edits live in the shared profile (the home page shows the icon, the picker reads it),
// so leaving with unsaved ones would show them elsewhere and come back as "saved"
onBeforeUnmount(discardOptions);

// Sends only the changed options. The server rejects the whole request if any option
// is invalid, so on a violation those go back to their saved values and the rest stay
// as unsaved changes
async function saveOptions() {
  if (isSavingOptions.value) return;

  const changed = {};
  for (const [id, value] of Object.entries(profile.value.options)) {
    if (value !== savedOptions.value[id]) changed[id] = value;
  }
  if (Object.keys(changed).length === 0) return;

  isSavingOptions.value = true;
  saveError.value = "";

  try {
    await $fetch(
      `${runtimeConfig.public.apiUrl}/wacca/user/${activeCard.value}/options/${version.value}`,
      { method: "POST", body: { options: changed } }
    );
    Object.assign(savedOptions.value, changed);
  } catch (error) {
    const body = error.data;

    // Validation errors come back as an array with only the first bad option. Put it
    // back to its saved value, the rest stay as unsaved changes to resave
    if (Array.isArray(body)) {
      const messages = [];
      for (const failure of body) {
        const id = /option ID (-?\d+)/.exec(failure.msg)?.[1];
        if (id !== undefined) {
          if (id in savedOptions.value) {
            profile.value.options[id] = savedOptions.value[id];
          } else {
            delete profile.value.options[id];
          }
        }
        messages.push(failure.msg);
      }
      saveError.value = messages.join("\n") || "Some options were invalid.";
      return;
    }

    const violations = Array.isArray(body?.violations) ? body.violations : [];

    for (const violation of violations) {
      const id = /^options\[(\d+)\]$/.exec(violation.subject)?.[1];
      if (id === undefined) continue;
      if (id in savedOptions.value) {
        profile.value.options[id] = savedOptions.value[id];
      } else {
        delete profile.value.options[id];
      }
    }

    if (violations.length > 0) {
      saveError.value = violations.map((v) => v.description).join("\n");
    } else if (error.statusCode === 429) {
      saveError.value = "Too many saves, wait a moment and try again.";
    } else if (error.statusCode === 400) {
      saveError.value = "Some options were invalid.";
    } else {
      saveError.value = "Failed to save options.";
    }
  } finally {
    isSavingOptions.value = false;
  }
}

// Demo chart, or a song's chart with ?song=2082&difficulty=3 (1-4, normal to inferno).
// Unknown songs or difficulties fall back to the demo
const route = useRoute();
const songTitle = useSongTitle();
const previewChart = computed(() => {
  const id = Number(route.query.song);
  const difficulty = Number(route.query.difficulty);
  const song = Number.isInteger(id) ? getSongById(version.value, id) : null;
  const sheet = song?.sheets[difficulty - 1];
  if (!sheet) return null;
  return {
    url: chartPath(song.id, difficulty - 1),
    info: {
      title: songTitle(song),
      difficulty,
      level: String(formatDifficulty(sheet.difficulty, false))
    }
  };
});

// Hovering a dropdown entry shows it on the preview without picking it
const previewChoice = ref(null);
const previewOptions = computed(() =>
  previewChoice.value
    ? {
        ...profile.value.options,
        [previewChoice.value.id]: previewChoice.value.value
      }
    : profile.value.options
);
watch(activeCategory, () => (previewChoice.value = null));

// Sticky offset that centers the preview
const previewColumn = ref(null);
const previewTop = ref("16px");
let previewResizeObserver = null;

function updatePreviewTop() {
  if (!previewColumn.value) return;
  const height = previewColumn.value.offsetHeight;
  previewTop.value = `${Math.max(16, (window.innerHeight - height) / 2)}px`;
}

onMounted(() => {
  previewResizeObserver = new ResizeObserver(updatePreviewTop);
  if (previewColumn.value) previewResizeObserver.observe(previewColumn.value);
  window.addEventListener("resize", updatePreviewTop);
});

// Column only exists once the profile's loaded
watch(previewColumn, (element, previous) => {
  if (previous) previewResizeObserver?.unobserve(previous);
  if (element) previewResizeObserver?.observe(element);
});

onBeforeUnmount(() => {
  previewResizeObserver?.disconnect();
  window.removeEventListener("resize", updatePreviewTop);
});
</script>
