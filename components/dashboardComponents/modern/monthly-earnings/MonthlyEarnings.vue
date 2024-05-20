<script setup lang="ts">

import { MonthlyChart } from "./MonthlyEarningsData"

const select = ref("March");
const items = ref(["March", "April", "May", "June"])

const elementVisible = ref(false)

onMounted(() => {
  setTimeout(() => (elementVisible.value = true), 30)
})

</script>

<template>
  <v-card class="mb-7 bg-secondary" style="font-family: Noto Sans Lao;">
    <v-card-text>
      <h3 class="title text-h6 " style="font-family: Noto Sans Lao;">
        <p>ສະຖິການເກັບຄ່າທຳນຽມຂອງແຕ່ລະເດືອນ</p>
      </h3>
      <div class="mt-4" v-if="elementVisible">
        <apexchart
          type="bar"
          height="100px"
          :options="MonthlyChart.chartOptions"
          :series="MonthlyChart.series"
        ></apexchart>
      </div>
      <!-- <h2
        class="title text-h5 text-white mt-6 font-weight-medium d-flex align-items-end"
      >
        $39,358
        <span
          class="text-subtitle-1 ml-2 d-flex align-center font-weight-medium"
          ><v-icon icon="mdi-arrow-top-left" size="18"></v-icon>+9 <p style="font-family: Noto Sans Lao;">ອັ</p></span
        >
      </h2> -->
    </v-card-text>
  </v-card>
</template>
