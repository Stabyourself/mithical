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
  font-weight: 700;
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
  background: rgba(var(--v-theme-boxcolor), 0.65);
  backdrop-filter: blur(8px);
  transform: skew(-20deg);
  z-index: -1;
}

.v-theme--waccaOled .profile-box:after {
  border: 1px solid white;
}
</style>
