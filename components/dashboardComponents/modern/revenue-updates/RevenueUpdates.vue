<template>
  
 <v-container><div>
    <p> ອັດຕາການຄົ້ນຫາ </p>
  </div>
  <div style="" class="mt-5 ">
    <apexchart type="bar" 
    :options="chartOptions" 
    :width="'100%'"  
    :series="series">

    </apexchart>
  </div></v-container>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import ApexCharts from 'vue3-apexcharts';
import { fetchChartData } from './RevenueUpdatesData';

export default defineComponent({
  name: 'RevenueUpdates',
  components: {
    apexchart: ApexCharts
  },
  setup() {
    const chartOptions = ref({});
    const series = ref([]);

    onMounted(async () => {
      const { categories, data } = await fetchChartData();

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
