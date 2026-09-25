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
          {{ option.format(options[option.id]) }}
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
      >
        <template v-slot:selection="{ item }">
          <span
            v-if="item.raw?.swatch"
            class="color-swatch"
            :class="{ 'note-swatch': item.raw.noteCaps }"
            :style="{ background: item.raw.swatch }"
          ></span>
          {{ item.title }}
        </template>

        <template v-slot:item="{ props: itemProps, item }">
          <v-list-item v-bind="itemProps">
            <template v-if="item.raw?.swatch" v-slot:prepend>
              <span
                class="color-swatch"
                :class="{ 'note-swatch': item.raw.noteCaps }"
                :style="{ background: item.raw.swatch }"
              ></span>
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

// Color previews for the design dropdowns
.color-swatch {
  display: inline-block;
  flex: none;
  width: 36px;
  height: 14px;
  margin-right: 10px;
  border-radius: 3px;
  vertical-align: middle;
  box-shadow: 0 0 0 1px rgba(128, 128, 128, 0.4);
}

// Note colors look like a note: body plus the blue caps
.note-swatch {
  border-left: 4px solid #4eacf7;
  border-right: 4px solid #4eacf7;
  border-radius: 1px;
}
</style>

<script setup>
// One settings row. Reads/writes its own value so only this row re-renders
const props = defineProps({
  option: { type: Object, required: true },
  // Profile options by id
  options: { type: Object, required: true },
  language: { type: String, required: true },
});

// Plain title/value items so unknown saved values don't break the page
const items = computed(() =>
  (props.option.choices ?? []).map((choice) => ({
    title: choice.text[props.language] ?? choice.text.en,
    value: choice.value,
    swatch: choice.swatch,
    noteCaps: choice.noteCaps,
  })),
);
</script>
