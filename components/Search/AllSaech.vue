<template>
  <v-card class="background image-background" :style="backgroundStyle">
    <div>
      <p class="ml-3 pt-4"><b style="color: #01579b">- {{ $t("search1") }}</b></p>
    </div>
    <v-tabs v-model="tab" fixed-tabs color="primary" stacked>
      <v-tab value="one">{{ $t("creditloans")  }}</v-tab>
      <v-tab value="two">{{ $t("utilities") }}</v-tab>
      <v-tab value="three">{{ $t("creditscores") }}</v-tab>
    </v-tabs>
    <v-card-text>
      <v-window v-model="tab">
        <v-window-item value="one">
          <Credit />
        </v-window-item>

        <v-window-item value="two">
          <Consumption />
        </v-window-item>

        <v-window-item value="three">
          <CreditScore />
        </v-window-item>
      </v-window>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Consumption from "./Consumption.vue";
import Credit from "./Credit.vue";
import CreditScore from "./CreditScore.vue";
import backgroundImage from "@/assets/images/feed/logo.png";

const tab = ref(null);

const backgroundStyle = `background-image: url('${backgroundImage}'); background-size: cover; background-position: center;`;
</script>

<style scoped>
.image-background {
  min-height: 780px;
  border-radius: 12px;
  background-color: rgba(245, 248, 248, 0.89);
}
</style>
