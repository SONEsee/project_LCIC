<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import { series, chartOptions, fetchData } from './MonthlyEarningsData';

onMounted(() => {
  fetchData();
});
</script>

<template>
  <div class="chart bg-indigo-accent-2 rounded-lg text-black">
    <VueApexCharts
      type="line"
      height="350"
      :options="chartOptions"
      :series="series"
    />
  </div>
</template>
