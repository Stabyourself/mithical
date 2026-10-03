<template>
  <div class="option">
    <div class="option-label">
      <v-tooltip location="top start" max-width="320" open-on-click>
        <template v-slot:activator="{ props: tooltipProps }">
          <span class="option-name" v-bind="tooltipProps">
            {{ option.label[language] }}
          </span>
        </template>
        <strong>{{ option.title[language] }}</strong>
        <br />
        {{ option.description[language] }}
      </v-tooltip>

      <v-btn
        v-if="options[option.id] !== saved[option.id]"
        class="option-reset"
        icon
        variant="text"
        size="x-small"
        color="primary"
        aria-label="Reset to saved value"
        title="Reset to saved value"
        @click="reset"
      >
        <v-icon>mdi-restore</v-icon>
      </v-btn>
    </div>

    <template v-if="option.type == 'slider'">
      <span class="slider-value">{{ option.format(value) }}</span>

      <v-slider
        class="option-slider"
        color="primary"
        v-model="value"
        :min="option.min"
        :max="option.max"
        :step="option.step"
        :aria-label="option.title[language]"
        thumb-label
        hide-details
      >
        <template v-slot:thumb-label="{ modelValue }">
          {{ option.format(modelValue) }}
        </template>
      </v-slider>
    </template>

    <v-btn-toggle
      v-if="option.type == 'buttons'"
      v-model="value"
      class="option-buttons"
      color="primary"
      variant="outlined"
      density="compact"
      divided
      mandatory
    >
      <v-btn
        v-for="item in items"
        :key="item.value"
        :value="item.value"
        size="small"
        @mouseenter="preview(item.value)"
        @focus="preview(item.value)"
        @mouseleave="preview(null)"
        @blur="preview(null)"
      >
        {{ item.title }}
      </v-btn>
    </v-btn-toggle>

    <v-select
      v-if="option.type == 'options'"
      v-model="value"
      class="option-select"
      :class="{ 'option-select-preview': option.noteType }"
      :items="items"
      :aria-label="option.title[language]"
      color="primary"
      variant="outlined"
      density="comfortable"
      hide-details
      @update:menu="(open) => !open && preview(null)"
    >
      <template v-slot:selection="{ internalItem: item }">
        <WaccaConsoleSwatch
          v-if="item.raw?.consoleColors"
          class="field-swatch"
          :colors="item.raw.consoleColors"
        />
        <!-- Note colors only show the note, the name is in the list -->
        <img
          v-if="item.raw?.palette !== undefined"
          class="note-preview"
          :src="notePreview(option.noteType, item.raw.palette, slideInvert)"
          :alt="item.title"
          :title="item.title"
        />
        <span v-else class="selection-text">{{ item.title }}</span>
      </template>

      <template v-slot:item="{ props: itemProps, internalItem: item }">
        <v-list-item
          v-bind="itemProps"
          @mouseenter="preview(item.value)"
          @focus="preview(item.value)"
          @mouseleave="preview(null)"
        >
          <template v-if="item.raw?.consoleColors" v-slot:prepend>
            <WaccaConsoleSwatch
              class="list-swatch"
              :colors="item.raw.consoleColors"
            />
          </template>
          <template v-else-if="item.raw?.palette !== undefined" v-slot:prepend>
            <img
              class="note-preview list-preview"
              :src="notePreview(option.noteType, item.raw.palette, slideInvert)"
              alt=""
            />
          </template>
        </v-list-item>
      </template>
    </v-select>

    <v-switch
      v-if="option.type == 'toggle'"
      v-model="value"
      class="option-switch"
      color="primary"
      density="compact"
      hide-details
      :aria-label="option.title[language]"
      :true-value="1"
      :false-value="0"
      @mouseenter="preview(value === 1 ? 0 : 1)"
      @mouseleave="preview(null)"
    ></v-switch>
  </div>
</template>

<style scoped lang="scss">
// Label on the left, control on the right. Controls that don't fit go below the label
.option {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 12px;
  min-height: 56px;
  padding: 8px 12px;

  & + & {
    border-top: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
  }
}

.option-label {
  position: relative;
  // Pushes the control to the right
  margin-right: auto;
}

// Right after the label, without taking up room: showing up must not make the row
// taller or push the control to the next line. Small enough for the gap before the
// control in the fullest rows
.option-reset {
  position: absolute;
  top: 50%;
  left: 100%;
  width: 16px;
  height: 16px;
  transform: translateY(-50%);

  // Easier to hit than it looks
  &::before {
    content: "";
    position: absolute;
    inset: -8px 0 -8px -4px;
  }
}

.option-name {
  font-weight: 500;
  cursor: help;
}

.slider-value {
  opacity: var(--v-medium-emphasis-opacity);
  font-variant-numeric: tabular-nums;
}

// Sliders get their own line below the label and value
.option-slider {
  flex: 0 0 100%;
}

.option-buttons {
  max-width: 100%;

  // Only as wide as their text, so a row of them fits next to the label
  .v-btn {
    min-width: 28px;
    padding: 0 6px;
    border-color: rgba(var(--v-theme-on-surface), 0.38);
  }
}

// As wide as the label and its reset button leave room for
.option-select {
  flex: 1 1 180px;
  max-width: min(270px, 100%);
  margin-left: 4px;
}

// Just a note preview in these
.option-select-preview {
  flex: none;
  width: 150px;
}

// Long names get cut off instead of making the row taller
.selection-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.option-switch {
  flex: none;
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
  // The options as saved in the profile, what the reset button goes back to
  saved: { type: Object, required: true },
  language: { type: String, required: true }
});

// Options the profile doesn't have yet show the in-game default
const value = computed({
  get: () => props.options[props.option.id] ?? props.option.default,
  set: (newValue) => {
    props.options[props.option.id] = newValue;
    // Picked, so show the real thing. A touch never leaves what it tapped, and a
    // switch's preview would be stuck on the other state
    preview(null);
  }
});

function reset() {
  const id = props.option.id;
  if (id in props.saved) props.options[id] = props.saved[id];
  else delete props.options[id];
  preview(null);
}

// Slide previews follow the "Invert Slide Colors" option (136)
const slideInvert = computed(() => props.options[136] === 1);

// { id, value } while a dropdown entry, button or switch is hovered, so the preview
// can show it. Switches preview the state a click would give
const emit = defineEmits(["preview"]);

function preview(choice) {
  emit(
    "preview",
    choice === null ? null : { id: props.option.id, value: choice }
  );
}

// Plain title/value items so unknown saved values don't break the page
const items = computed(() =>
  (props.option.choices ?? []).map((choice) => ({
    title: choice.text[props.language] ?? choice.text.en,
    value: choice.value,
    consoleColors: choice.consoleColors,
    // Note color options draw the note type they're for, like in game
    palette: props.option.noteType ? paletteIndex(choice.value, 0) : undefined
  }))
);
</script>
