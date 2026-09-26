<template>
  <div class="option">
    <h2>{{ option.title[language] }}</h2>
    <p>{{ option.description[language] }}</p>

    <div v-if="option.type == 'slider'">
      <v-slider
        color="primary"
        v-model="options[option.id]"
        :min="option.min"
        :max="option.max"
        :step="option.step"
        thumb-label
        hide-details
      >
        <template v-slot:thumb-label="{ modelValue }">
          {{ option.format(modelValue) }}
        </template>

        <template v-slot:prepend>
          <span class="slider-value" :style="{ minWidth: valueWidth }">
            {{ option.format(options[option.id]) }}
          </span>
        </template>
      </v-slider>
    </div>

    <div v-if="option.type == 'options'">
      <v-select
        v-model="options[option.id]"
        :items="items"
        color="primary"
        variant="outlined"
        density="comfortable"
        hide-details
        @update:menu="(open) => !open && preview(null)"
      >
        <template v-slot:selection="{ item }">
          <WaccaConsoleSwatch
            v-if="item.raw?.consoleColors"
            class="field-swatch"
            :colors="item.raw.consoleColors"
          />
          <img
            v-else-if="item.raw?.palette !== undefined"
            class="note-preview"
            :src="notePreview(option.noteType, item.raw.palette)"
            alt=""
          />
          {{ item.title }}
        </template>

        <template v-slot:item="{ props: itemProps, item }">
          <v-list-item
            v-bind="itemProps"
            @mouseenter="preview(item.value)"
            @focus="preview(item.value)"
            @mouseleave="preview(null)"
          >
            <template v-if="item.raw?.consoleColors" v-slot:prepend>
              <WaccaConsoleSwatch class="list-swatch" :colors="item.raw.consoleColors" />
            </template>
            <template v-else-if="item.raw?.palette !== undefined" v-slot:prepend>
              <img
                class="note-preview list-preview"
                :src="notePreview(option.noteType, item.raw.palette)"
                alt=""
              />
            </template>
          </v-list-item>
        </template>
      </v-select>
    </div>

    <div v-if="option.type == 'toggle'">
      <v-switch
        v-model="options[option.id]"
        color="primary"
        hide-details
        :true-value="1"
        :false-value="0"
      ></v-switch>
    </div>
  </div>
</template>

<style scoped lang="scss">
.option {
  margin-bottom: 32px;

  h2 {
    font-size: 20px;
  }

  p {
    opacity: 0.6;
  }
}

.slider-value {
  display: inline-block;
  text-align: right;
  font-variant-numeric: tabular-nums;
}

// Previews for the design dropdowns, bigger in the selected box without making it taller
.note-preview {
  flex: none;
  height: 36px;
  margin: -8px 10px -8px 0;
  vertical-align: middle;
}

.console-swatch.field-swatch {
  width: 36px;
  height: 36px;
  margin: -8px 10px -8px 0;
}

// Bigger in the list, nearly touching the ones above and below
.console-swatch.list-swatch {
  width: 44px;
  height: 44px;
  margin: -4px 12px -4px 0;
}

.note-preview.list-preview {
  height: 40px;
  margin: -2px 12px -2px 0;
}
</style>

<script setup>
import { notePreview } from "~/assets/wacca/playfield/PlayfieldRenderer.js";
import { paletteIndex } from "~/assets/wacca/playfield/noteColors.js";

// One settings row. Reads/writes its own value so only this row re-renders
const props = defineProps({
  option: { type: Object, required: true },
  // Profile options by id
  options: { type: Object, required: true },
  language: { type: String, required: true },
});

// { id, value } while a dropdown entry is hovered, so the preview can show it
const emit = defineEmits(["preview"]);

function preview(value) {
  emit("preview", value === null ? null : { id: props.option.id, value });
}

// Room for the longest value so the slider doesn't resize (and jump) while dragging
const valueWidth = computed(() => {
  const { type, min, max, step, format } = props.option;
  if (type !== "slider") return undefined;
  let longest = 0;
  for (let value = min; value <= max; value += step) {
    longest = Math.max(longest, String(format(value)).length);
  }
  // Plus a bit for symbols wider than a digit, like % and ×
  return `${longest + 1}ch`;
});

// Plain title/value items so unknown saved values don't break the page
const items = computed(() =>
  (props.option.choices ?? []).map((choice) => ({
    title: choice.text[props.language] ?? choice.text.en,
    value: choice.value,
    consoleColors: choice.consoleColors,
    // Note color options draw the note type they're for, like in game
    palette: props.option.noteType ? paletteIndex(choice.value, 0) : undefined,
  })),
);
</script>
