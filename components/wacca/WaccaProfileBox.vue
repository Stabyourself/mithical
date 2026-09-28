<template>
  <div class="profile-box-wrapper">
    <div class="profile-box slanted">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
.profile-box-wrapper {
  display: inline-block;
}

.profile-box {
  position: relative;
  font-weight: 500;
  font-size: 2rem;
  color: white;
  padding: 10px 40px;
  z-index: 0;
  display: flex;
  flex-wrap: wrap;
}

.profile-box:after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgb(var(--v-theme-box-glass));
  backdrop-filter: blur(8px);
  transform: skew(-20deg);
  z-index: -1;
}

// Outlined on OLED, see plugins/vuetify.ts
.profile-box:after {
  border: var(--v-box-border);
}
</style>
