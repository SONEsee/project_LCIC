<!-- <script setup lang="ts">
import { TotalSales } from "./TotalSalesData";

const select = ref("March");
const items = ref(["March", "April", "May", "June"]);
const elementVisible = ref(false);

onMounted(() => {
  setTimeout(() => (elementVisible.value = true), 30);
});
</script>

<template>
  <v-container>
<<<<<<< HEAD
  
=======
>>>>>>> 8b48fd2a1696bc13a6659c284560aa69db42d491
  <v-card class="bg-blue-lighten-3 mt-3"> 
    <v-card-text>
      <div class="d-flex align-center mb-1">
        <h2 class="title text-h6 font-weight-medium"><p>ສະມາຊິກທັງໝົດ</p></h2>

        <div class="ml-auto">
          <v-select
            v-model="select"
            :items="items"
            hide-details="auto"
            variant="outlined"
            density="compact"
            single-line
          ></v-select>
        </div>
      </div>
      <v-divider></v-divider>
      <div class="border-top mt-1 d-flex align-center">
        <h6 class="text-subtitle-1 text-grey-darken-1 font-weight-regular">
          <p style="font-family: Noto Sans Lao">ຈຳນວນທັວໝົດ</p>
        </h6>
        <div class="ml-auto">
          <h3 class="h3 title font-weight-bold">8,364,398</h3>
        </div>
      </div>
      <div class="mt-1 pt-1 position-relative mr-10" v-if="elementVisible">
        <apexchart
          type="donut"
          height="280px"
          :options="TotalSales.chartOptions"
          :series="TotalSales.series"
        ></apexchart>
        <v-icon
          icon="mdi-account-outline"
          class="text-grey-darken-1 total-sales-icon"
          size="50"
        ></v-icon>
      </div>
      <div class="d-flex align-center justify-space-between  " style="font-size: 60%;">
        <div class="d-flex align-center px-2">
          <span>
            <span class="text-overline">
              <i class="mdi mdi-brightness-1 text-cyan mx-1"></i>
            </span>
            <span class="text-grey-darken-1 font-weight-medium mr-1"
              >ທະນາຄານ</span
            >
          </span>
        </div>
       
        <div class="d-flex align-center px-2">
          <span>
            <span class="text-overline">
              <i class="mdi mdi-brightness-1 text-light-blue mx-1"></i>
            </span>
            <span class="text-grey-darken-1 font-weight-medium mr-1"
              >ສະຖາບັນ
            </span>
          </span>
        </div>
        <div class="d-flex align-center px-2">
          <span>
            <span class="text-overline">
              <i class="mdi mdi-brightness-1 text-pink-accent-4 mx-1"></i>
            </span>
            <span class="text-grey-darken-1 font-weight-medium mr-1"
              >ໂຮງຊວດຈຳ
            </span>
          </span>
        </div>
        <div class="d-flex align-center px-2">
          <span>
            <span class="text-overline">
              <i class="mdi mdi-brightness-1 text-deep-purple-darken-3 mx-1"></i>
            </span>
            <span class="text-grey-darken-1 font-weight-medium mr-1"
              >ສະຫະກອນ
            </span>
          </span>
        </div>
        
      </div>
    </v-card-text>
  </v-card></v-container>
</template>

<style scoped>
.total-sales-icon {
  position: absolute;
  left: 46%;
  top: 45%;
}
</style> -->
<template>
  <div style="width: 80%; height: 500px;">
    <canvas id="doughnutChart" style="width: 100%; height: 100%;"></canvas>
  </div>
</template>

<script>
import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js';

// Register the components you need
Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

export default {
  data() {
    return {
      chartData: null,
    };
  },
  mounted() {
    this.fetchChartData();
  },
  methods: {
    async fetchChartData() {
      try {
        const config = useRuntimeConfig();
        const response = await fetch(`${config.public.strapi.url}api/searchlog_doughnutchart/`);
        const data = await response.json();

        this.renderChart(data.labels, data.datasets[0].data, data.datasets[0].backgroundColor);
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    },
    renderChart(labels, dataset, backgroundColor) {
      const ctx = document.getElementById('doughnutChart').getContext('2d');
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            label: 'Search Logs by Bank',
            data: dataset,
            backgroundColor: backgroundColor,
          }]
        },
        options: {
          responsive: true,
        }
      });
    }
  }
};
</script>

<style scoped>
canvas {
  width: 30%;
  height: 100px;
}
</style>
