<template>
  <div>
    <apexchart 
      width="380" 
      type="pie" 
      :options="chartOptions" 
      :series="series"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import axios from 'axios';
import ApexCharts from 'vue3-apexcharts';

export default defineComponent({
  components: {
    apexchart: ApexCharts
  },
  setup() {
    const series = ref<number[]>([]);
    const chartOptions = ref({
      chart: {
        width: 380,
        type: 'pie'
      },
      labels: ['Type 1', 'Type 2', 'Type 3', 'Type 4', 'Type 5', 'Type 6', 'Type 7'],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'bottom'
            }
          }
        }
      ]
    });

    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:35729/api/member-count/');
        const data = response.data.member_count;
        series.value = data.map((item: { count: number }) => item.count);
       
        
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    onMounted(() => {
      fetchData();
    });

    return {
      series,
      chartOptions
    };
  }
});
</script>
