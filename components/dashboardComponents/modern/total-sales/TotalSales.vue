<template>
  <div class="ml-auto mt-5 mr-4 align-end justify-end">
    <div v-if="total"></div>
    <v-col cols="12">
      <v-row>
        <v-col cols="12" md="9">
          <p>
            ຈຳນວນສະມາຊິກທັງໝົດ <b>{{ total }}</b> ແຫ່ງ
          </p>
        </v-col>
        <v-col cols="12" md="3">
          <v-autocomplete
            label="ເລືອກປີ"
            density="compact"
            width="100%"
            rounded="lg"
            variant="outlined"
            :items="['2023', '2024', '2025']"
          >
          </v-autocomplete>
        </v-col>
      </v-row>
    </v-col>
  </div>
  <div id="chart" class="chart-container">
    <apexchart
      type="pie"
      :options="chartOptions"
      :series="series"
      height="200%"
      width="100%"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import VueApexCharts from "vue3-apexcharts";
import { fetchTotalSalesData } from './TotalSalesData';
import type { MemberData } from './TotalSalesData';

const total = ref<number>(0);
const series = ref<number[]>([]);
const chartOptions = ref({
  chart: {
    width: "100%",
    responsive: true,
    type: "pie",
  },
  labels: [
    "ບຸກຄົນ-ນິຕິບຸກຄົນ & ອົງການຈັດຕັ້ງອື່ນ",
    "ທະນາຄານທຸລະກິດ",
    "ບໍລິສັດເຊົ່າສິນເຊື່ອ",
    "ສະຖາບັນການເງິນຈຸລະພາກຮັບຝາກ",
    "ສະຫະກອນສິນເຊື່ອ ແລະ ເງິນຝາກປະຢັດ",
    "ໂຮງຊວດຈຳ",
    "ສະຖາບັນການເງິນຈຸລະພາກບໍ່ຮັບຝາກ",
  ],
  colors: [
    "#6200EA",
    "#01579B",
    "#0091EA",
    "#FF33A1",
    "#FFC733",
    "#57FFC7",
    "#F57F17",
  ],
  legend: {
    position: "bottom",
    horizontalAlign: "center",
    floating: false,
    fontSize: "10px",
    markers: {
      width: 12,
      height: 12,
      radius: 12,
    },
    labels: {
      useSeriesColors: true,
    },
  },
  responsive: [
    {
      breakpoint: 1200,
      options: {
        chart: {
          width: "100%",
        },
        legend: {
          position: "bottom",
          horizontalAlign: "center",
        },
      },
    },
    {
      breakpoint: 1000,
      options: {
        chart: {
          width: "100%",
        },
        legend: {
          position: "bottom",
          horizontalAlign: "center",
        },
      },
    },
    {
      breakpoint: 480,
      options: {
        chart: {
          width: "100%",
        },
        legend: {
          position: "bottom",
          horizontalAlign: "center",
        },
      },
    },
  ],
  dataLabels: {
    enabled: true,
    formatter: (val: number, opts: any) => {
      const seriesIndex = opts.seriesIndex;
      return opts.w.globals.series[seriesIndex];
    },
    style: {
      fontSize: "12px",
      colors: ["white"],
    },
  },
  tooltip: {
    enabled: true,
    y: {
      formatter: (val: number) => `${val}`,
    },
  },
});

const fetchData = async () => {
  try {
    const data: MemberData[] = await fetchTotalSalesData();
    series.value = data.map((item: any) => item.count);
    total.value = series.value.reduce((acc, count) => acc + count, 0);

    chartOptions.value.labels = data.map(
      (item: any) => `Member Type ${item.memberType_id}`
    );
  } catch (error) {
    console.error("Error fetching data from API:", error);
  }
};

onMounted(() => {
  fetchData();
  setInterval(() => {
    location.reload();
  }, 15000);
});
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: auto;
  max-width: 100%;
  padding: 0 15px;
}

:deep(.apexcharts-legend) {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

:deep(.apexcharts-legend-text) {
  white-space: normal;
  max-width: 200px;
  text-align: left;
}
</style>