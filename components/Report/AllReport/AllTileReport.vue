<template>
  <v-card class="fullscreen">
    <div>
      <p class="ml-3 pt-4"><b style="color: #01579b">- {{$t("report")}}</b></p>
    </div>
    <v-tabs v-model="tab" fixed-tabs color="primary" stacked >
      <v-tab value="one">{{ $t("reportfees") }}</v-tab>
      <v-tab value="two">{{$t("searchreport")}}</v-tab>
      <v-tab value="three">{{ $t("transmissionreport") }}</v-tab>
      <v-tab value="four">{{ $t("portpolio") }}</v-tab>
      <v-tab value="five">{{ $t("reportlogin") }}</v-tab> 
    </v-tabs>
    <v-card-text >
      <v-window v-model="tab">
        <v-window-item value="one">
          <FeesReport />
        </v-window-item>

        <v-window-item value="two">
          <SearchReport />
        </v-window-item>

        <v-window-item value="three">
          <DeveliveryReport />
        </v-window-item>
        <v-window-item value="four">
          <PortpolioReport />
        </v-window-item>
        <v-window-item value="five">
          <LoginReport />
        </v-window-item>
      </v-window>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import PortpolioReport from "./PortpolioReport.vue";
import DeveliveryReport from "./DeveliveryReport.vue";
import SearchReport from "./SearchReport.vue";
import FeesReport from "./FeesReport.vue";
import LoginReport from "./LoginReport.vue";

const tab = ref(null);
</script>
<style scoped lang="scss">
.fullscreen {
  background-image: url("@/assets/images/feed/logo.png");
  height: 100;
  position: relative;
  background-size: cover;
  background-position: center;
}
.fullscreen::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: #ffffffec;
  z-index: 0;
}
</style>
