<template>
  <div class="container mx-auto px-4 py-8 bg-white custom-border
 mt-7 rounded-lg">
    <v-col cols="12" class="mt-10 mb-9">
      <v-row>
        <v-col cols="12" md="8"><p>ຈຳນວນສະມາຊິກທັງໝົດ</p></v-col>
        <v-col cols="12" md="4"><p>{{  }}</p></v-col>
      </v-row>
    </v-col>
    
    <apexchart 
      width="500" 
      type="pie" 
      :series="series"
      :options="chartOptions" 
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import ApexCharts from 'vue3-apexcharts';
import { fetchTotalSalesData } from './TotalSalesData';
import type { MemberData } from './TotalSalesData';  

export default defineComponent({
  components: {
    apexchart: ApexCharts
  },
  setup() {
    const series = ref<number[]>([]);
    const chartData = ref<MemberData[]>([]);
    const totalMembers = ref<number>(0);

    const chartOptions = ref({
      chart: {
        width: 380,
        type: 'pie'
      },
      labels: ['ບຸກຄົນ-ນິຕິບຸກຄົນ & ອົງການອື່ນ', 'ທະນາຄານທຸລະກິດ', 'ບໍລິສັດເຊົ່າສິນເຊື່ອ', 'ສະຖາບັນການເງິນຈຸລະພາກຮັບຝາກ', 'ສະຫະກອນສິນເຊື່ອ', 'ໂຮງຊວດຈຳ', 'ສະຖາບັນການເງິນບໍ່ຮັບຝາກ'],
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
      ],
      dataLabels: {
        enabled: true,
        formatter: function (val: number, opts: any) {
          const count = series.value[opts.seriesIndex];
          const percentage = Math.floor((val / 100) * totalMembers.value); 
          return `${count} (${percentage}%)`;
        }
      },
      tooltip: {
        y: {
          formatter: function (val: number, opts: any) {
            const count = series.value[opts.seriesIndex];
            const percentage = Math.floor((val / totalMembers.value) * 100); 
            return `${count} ສະມາຊິກ (${percentage}%)`;
          }
        }
      }
    });

    const fetchData = async () => {
      const data = await fetchTotalSalesData();
      chartData.value = data;
      series.value = data.map((item: { count: number }) => item.count);
      totalMembers.value = data.reduce((acc, item) => acc + item.count, 0);
    };

    onMounted(() => {
      fetchData();
    });

    return {
      series,
      chartOptions,
      chartData
    };
  }
});
</script>
<style scoped>
.custom-border {
  border: 2px solid #1A237E; 
}
</style>