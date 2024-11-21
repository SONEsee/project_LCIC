<template>
  <v-card class="background image-background" :style="backgroundStyle">
    <div>
      <p class="ml-3 pt-4"><b style="color: #01579b">- ການຄົ້ນຫາ</b></p>
    </div>
    <v-tabs v-model="tab" fixed-tabs color="primary" stacked>
      <v-tab value="one">ສິນເຊື້ອ</v-tab>
      <v-tab value="two">ສາທານຸປະໂພກ</v-tab>
      <v-tab value="three">ຄະແນນສິນເຊືອ</v-tab>
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
