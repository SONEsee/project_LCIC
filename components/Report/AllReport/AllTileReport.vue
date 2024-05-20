<template>
  <v-card>
    <div>
      <p class="ml-3 pt-4"> <b style="color:#01579B ;">- ລາຍງານ</b></p>
    </div>
    <v-tabs v-model="tab" fixed-tabs color="primary" stacked>
      <v-tab value="one">ລາຍງານຄ່າທຳນຽມ</v-tab>
      <v-tab value="two">ລາຍງານຄົ້ນຫາ</v-tab>
      <v-tab value="three">ລາຍງານການນຳສົ່ງ</v-tab>
      <v-tab value="four">ພອດໂພລີໂອ</v-tab>
      <v-tab value="five">ລາຍງານການເຂົ້ານຳໃຊ້</v-tab>
    </v-tabs>
    <v-card-text>
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
          <PortpolioReport/>
        </v-window-item>
        <v-window-item value="five">
          <LoginReport/>
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
