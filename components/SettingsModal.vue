<template>
  <v-theme-provider :theme="`wacca${themeModded}`">
    <div class="modal" :class="{ on: settingsVisible }" @click="hideSettings">
      <div class="modal-content" @click.stop>
        <v-card>
          <v-card-title>
            <div class="d-flex justify-space-between align-center">
              Mithical Settings
              <v-btn icon variant="plain" @click="hideSettings">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </div>
          </v-card-title>

          <v-card-text>
            <div class="settings">
              <div class="settings-setting">
                <p>Version</p>
                <v-btn-toggle v-model="version" shaped mandatory>
                  <v-btn color="primary" :value="300">Reverse</v-btn>
                  <v-btn color="primary" :value="400">Plus</v-btn>
                </v-btn-toggle>
              </div>

              <div class="settings-setting">
                <p>Theme</p>
                <v-btn-toggle v-model="theme" shaped mandatory>
                  <v-btn
                    color="primary"
                    v-for="t in themes"
                    :key="t.value"
                    :value="t.value"
                  >
                    {{ t.name }}
                  </v-btn>
                </v-btn-toggle>
              </div>

              <div class="settings-setting">
                <p>Language</p>
                <v-select
                  class="nav-select language-select"
                  v-model="language"
                  :items="languages"
                  item-title="name"
                  item-value="code"
                  hide-details
                  single-line
                  prepend-inner-icon="mdi-translate"
                />
              </div>

              <div class="settings-setting">
                <p>Show internal difficulty numbers</p>
                <v-switch
                  hide-details
                  v-model="difficultyInternal"
                  color="primary"
                  class="settings-rounding wacca"
                >
                  <template v-slot:label>
                    <WaccaDifficultyPill
                      style="width: 152px"
                      :i="3"
                      :difficulty="13.7"
                      class="active"
                    />
                  </template>
                </v-switch>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </div>
    </div>
  </v-theme-provider>
</template>

<script setup>
const settingsVisible = useState("settingsVisible", () => false);
const storageVersion = localStorage.getItem("version");
const version = useState("version", () => parseInt(storageVersion) || 400);

if (version.value != 300 && version.value != 400) {
  version.value = 400;
}

function hideSettings() {
  settingsVisible.value = false;
}

// Language
const languages = [
  { name: "English", code: "en" },
  { name: "日本語", code: "ja" },
];

const language = useState("language");
const storagelanguage = localStorage.getItem("language");

if (storagelanguage) {
  language.value = storagelanguage;
} else {
  language.value = "en";
}

watch(language, (newVal) => {
  localStorage.setItem("language", newVal);
});

// Theme
const themes = [
  { name: "Light", value: "Light" },
  { name: "Dark", value: "Dark" },
  { name: "OLED", value: "Oled" },
];
const theme = useState("theme");

const themeModded = computed(() => {
  let out = theme.value;

  if (version.value == 400) {
    out += "Plus";
  }

  return out;
});

watch(theme, (newVal) => {
  localStorage.setItem("theme", newVal);
});

// Version

watch(version, (newVal) => {
  localStorage.setItem("version", newVal);
});

// Difficulty rounding
const storageDifficultyInternal =
  localStorage.getItem("difficultyInternal") == null ||
  localStorage.getItem("difficultyInternal") == "true"
    ? true
    : false;
const difficultyInternal = useState(
  "difficultyInternal",
  () => storageDifficultyInternal
);
const difficultyLabel = computed(() =>
  difficultyInternal.value ? "14.7" : "14+"
);

watch(difficultyInternal, (newVal) => {
  localStorage.setItem("difficultyInternal", newVal);
});
</script>
