<template>
  <img :src="url" v-if="props.grade != 0" />
</template>

<script setup>
const props = defineProps({
  grade: Number,
});

const url = computed(() => `/wacca/img/grades/${props.grade}.webp`);
</script>
