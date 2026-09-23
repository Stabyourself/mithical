<template>
  <img :src="fullUrl" class="jacket" loading="lazy" decoding="async" alt="" />
</template>

<style scoped>
.jacket {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  background-color: #888;
}
</style>

<script setup>
const props = defineProps({
  url: String,
});

const fullUrl = computed(() => {
  return `/wacca/img/covers/${props.url}`;
});
</script>
