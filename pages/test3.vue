<template>
  <div id="chart">
    <apexchart type="area" height="350" :options="chartOptions" :series="series" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

export default defineComponent({
  name: 'StockPriceChart',
  components: {
    apexchart: VueApexCharts,
  },
  setup() {
    const series = ref([{ name: 'Charge Count', data: [] as { x: string; y: number }[] }]);
    const chartOptions = ref({
      chart: {
        type: 'area',
        stacked: false,
        height: 350,
        zoom: {
          type: 'x',
          enabled: true,
          autoScaleYaxis: true,
        },
        toolbar: {
          autoSelected: 'zoom',
        },
      },
      dataLabels: { enabled: false },
      markers: { size: 0 },
      title: { text: 'Hourly Charge Count', align: 'left' },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          inverseColors: false,
          opacityFrom: 0.5,
          opacityTo: 0,
          stops: [0, 90, 100],
        },
      },
      yaxis: {
        labels: {
          formatter: (val: number) => val.toFixed(0),
        },
        title: { text: 'Count' },
      },
      xaxis: { type: 'category' },
      tooltip: {
        shared: false,
        y: {
          formatter: (val: number) => val.toFixed(0),
        },
      },
    });

  
    onMounted(async () => {
      try {
        const response = await fetch('http://192.168.45.56:8000/api/charge-count/');
        const data = await response.json();

       
        series.value[0].data = Object.entries(data).map(([hour, count]) => ({
          x: hour,
          y: count as number,
        }));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    });

    return { series, chartOptions };
  },
});
</script>

<style scoped>
#chart {
  max-width: 100%;
}
</style>
