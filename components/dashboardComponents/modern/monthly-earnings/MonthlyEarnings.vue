<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import { series, chartOptions, fetchData } from './MonthlyEarningsData';

onMounted(() => {
  fetchData();
});
</script>

<template>
  <div >
    <VueApexCharts
      type="line"
      height="350"
      :options="chartOptions"
      :series="series"
    />
  </div>
</template>
<style scoped>
.custom-border {
  border: 2px solid #1A237E; 
}
</style>