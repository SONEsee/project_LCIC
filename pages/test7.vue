<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ApexCharts from 'vue3-apexcharts';

const series = ref([
  {
    data: data.slice()
  }
]);

const chartOptions = ref({
  chart: {
    id: 'realtime',
    height: 350,
    type: 'line',
    animations: {
      enabled: true,
      easing: 'linear',
      dynamicAnimation: {
        speed: 1000
      }
    },
    toolbar: {
      show: false
    },
    zoom: {
      enabled: false
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth'
  },
  title: {
    text: 'Dynamic Updating Chart',
    align: 'left'
  },
  markers: {
    size: 0
  },
  xaxis: {
    type: 'datetime',
    range: XAXISRANGE,
  },
  yaxis: {
    max: 100
  },
  legend: {
    show: false
  }
});

const chartRef = ref();

onMounted(() => {
  // Function to update the series data
  const updateChartData = () => {
    getNewSeries(lastDate, {
      min: 10,
      max: 90
    });
    chartRef.value?.updateSeries([
      {
        data: data
      }
    ]);
  };

  // Function to reset data to prevent memory leaks
  const resetChartData = () => {
    resetData();
    chartRef.value?.updateSeries([
      {
        data
      }
    ], false, true);
  };

  // Update data every second
  setInterval(updateChartData, 1000);

  // Reset data every 60 seconds
  setInterval(resetChartData, 60000);
});
</script>

<template>
  <div id="chart">
    <ApexCharts
      type="line"
      height="350"
      ref="chartRef"
      :options="chartOptions"
      :series="series"
    />
  </div>
</template>
