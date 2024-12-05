<template>
  <div class="chart text-red">
    <apexchart type="bar" :options="chartOptions" :series="series"></apexchart>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import ApexCharts from 'vue3-apexcharts';
import axios from 'axios';

export default defineComponent({
  name: 'ChartComponent',
  components: {
    apexchart: ApexCharts
  },
  setup() {
    const chartOptions = ref({});
    const series = ref([]);

    onMounted(async () => {
      try {
        const response = await axios.get('http://192.168.45.56:8000/api/charge_chart/month/');
        let chartData = response.data.chart_data;

        
        chartData.sort((a: any, b: any) => b["10-2024"] - a["10-2024"]);

        
        const top10Data = chartData.slice(0, 10);

       
        const categories = top10Data.map((item: any) => item.bnk_code);
        const data = top10Data.map((item: any) => item["10-2024"]);

       
        chartOptions.value = {
          chart: {
            type: 'bar',
            height: 350,
            toolbar: {
              show: false
            }
          },
          plotOptions: {
            bar: {
              horizontal: true,
              dataLabels: {
                position: 'center'
              }
            }
          },
          xaxis: {
            categories: categories
          },
          dataLabels: {
            enabled: true,
            formatter: function (val: any) {
              return val.toLocaleString(); // Format numbers with commas
            }
          }
        };

        series.value = [
          {
            name: '10-2024',
            data: data
          }
        ];
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    });

    return { chartOptions, series };
  }
});
</script>

<style scoped>
#chart {
  max-width: 600px;
  margin: auto;
}
</style>
