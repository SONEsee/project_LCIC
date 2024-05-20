<script setup lang="ts">

import { CustomerChart } from "./CustomersData"

const elementVisible = ref(false)

onMounted(() => {
  setTimeout(() => (elementVisible.value = true), 30)
})

</script>

<template>
  <v-card class="position-relative bg-primary">
    <v-card-text>
      <h2 class="title text-h6 font-weight-medium text-white"><p style="font-family: Noto Sans Lao;">ສະຖິຕິການຄົ້ນຫາສະມາຊິກໄລຍະ 1 ປີ</p></h2>
      <div class="mt-4" v-if="elementVisible">
        <apexchart
          type="line"
          height="55px"
          :options="CustomerChart.chartOptions"
          :series="CustomerChart.series"
        ></apexchart>
      </div>
      <h2
        class="title text-h5 text-white mt-6 font-weight-medium d-flex align-end"
      >
       <p> 39,358 ຄັ້ງ</p>
        <span
          class="text-subtitle-1 ml-2 d-flex align-center font-weight-medium"
          ><v-icon icon="mdi-arrow-top-left" size="18"></v-icon>+248 <p style="font-family: Noto Sans Lao;">ພາຍໃຍອາທິດ</p></span
        >
      </h2>
    </v-card-text>
  </v-card>
</template>
