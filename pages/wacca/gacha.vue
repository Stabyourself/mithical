<template>
  <WaccaProfileRequired>
    <v-container>
      <div class="current-rp">
        Your current balance: {{ profile.points }} RP
        <div class="gamba-responsibly">Gamba responsibly.</div>
      </div>

      <WaccaGacha
        v-for="box of waccaBoxes"
        class="mt-4"
        ref="waccaGacha"
        :box="box"
        :tenspin="box.price * 10 <= 99999"
      />
    </v-container>
  </WaccaProfileRequired>
</template>

<style scoped lang="scss">
.current-rp {
  font-size: 1.5em;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
  background: rgba(var(--v-theme-primary));
  color: white;
  padding: 10px;
  border-radius: 10px;

  .gamba-responsibly {
    font-size: 0.7em;
    line-height: 0.8;
    font-weight: normal;
    color: rgba(255, 255, 255, 0.7);
  }
}
</style>

<script setup>
import waccaBoxes from "~/assets/wacca/waccaBoxes.js";

definePageMeta({
  middleware: ["auth"],
});

const profile = useState("profile");
</script>
