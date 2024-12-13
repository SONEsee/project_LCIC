<template>
  <div  >
    <div class="d-flex align-center mb-1">
      <div class="ml-auto mt-5 mr-4">
        <select
          v-model="selectedMonth"
          @change="updateChart"
          hide-details="auto"
          variant="outlined"
          density="compact"
          icon="mdi-arrow-down-drop-circle-outline"
          single-line
          style="border: 1px solid #263238; border-radius: 5px; padding: 5px"
        >
          <option v-for="month in availableMonths" :key="month" :value="month">
            {{ month }}
          </option>
        </select>
      </div>
    </div>
    <v-divider></v-divider>

    <div id="chart-year">
      <p class="ml-2">  {{ $t("top10") }}</p>
      
    
      <ApexCharts
        type="bar"
        height="400"
        :options="chartOptions"
        :series="series"
      ></ApexCharts>
    </div>

    <div id="chart-quarter"></div>
  </div>
</template>

<script setup lang="ts">
import ApexCharts from "vue3-apexcharts";
import { onMounted } from "vue";
import {
  selectedMonth,
  chartData,
  series,
  availableMonths,
  chartOptions,
  fetchData,
  updateChart,
} from "./RevenueUpdatesData";

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.custom-border {
  border: 2px solid #1A237E; 
}
</style>

