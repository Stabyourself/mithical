<template>
  <img :src="url" />
</template>

<script setup>
import waccaIcons from "~/assets/wacca/waccaIcons.js";

const props = defineProps({
  icon: Number,
});

const url = computed(() => {
  let icon = waccaIcons.find((i) => i.id === props.icon);

  if (icon) {
    return `/wacca/img/icons/${icon.path}.webp`;
  }

  return "/wacca/img/icons/S01/uT_UICN_S01_00_001.webp";
});
</script>
