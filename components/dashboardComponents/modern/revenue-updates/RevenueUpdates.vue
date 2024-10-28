<script setup lang="ts">
import { ref, onMounted } from "vue";
import ApexCharts from "vue3-apexcharts";
import axios from "axios";

const selectedMonth = ref("2024-10");
const chartData = ref<any[]>([]);
const series = ref([{ data: [] }]);
const availableMonths = ref<string[]>([]);
const chartOptions = ref({
  chart: {
    id: "barYear",
    height: 400,
    type: "bar",
    events: {
      dataPointSelection: (e: any, chart: any, opts: any) => {
        const quarterChartEl = document.querySelector("#chart-quarter");
        const yearChartEl = document.querySelector("#chart-year");

        if (opts.selectedDataPoints[0].length === 1) {
          if (quarterChartEl?.classList.contains("active")) {
            updateQuarterChart(chart, "barQuarter");
          } else {
            yearChartEl?.classList.add("chart-quarter-activated");
            quarterChartEl?.classList.add("active");
            updateQuarterChart(chart, "barQuarter");
          }
        } else {
          updateQuarterChart(chart, "barQuarter");
        }

        if (opts.selectedDataPoints[0].length === 0) {
          yearChartEl?.classList.remove("chart-quarter-activated");
          quarterChartEl?.classList.remove("active");
        }
      },
    },
  },
  plotOptions: {
    bar: {
      distributed: true,
      horizontal: true,
      barHeight: "75%",
      dataLabels: {
        position: "bottom",
      },
    },
  },
  dataLabels: {
    enabled: true,
    style: {
      colors: ["#fff"],
    },
    formatter: (val: any, opt: any) => {
      return opt.w.globals.labels[opt.dataPointIndex];
    },
  },
  colors: ["#00B0FF", "#0288D1", "#2979FF"],
  title: {
    text: "10 ການຄົ້ນຫາຫຼາຍສຸດພາຍໃນເດືອນ",
  },
  subtitle: {
    text: "(ສະເພາະລາຍເດືອນ)",
  },
  yaxis: {
    labels: {
      show: false,
    },
  },
});

const fetchData = async () => {
  try {
    const response = await axios.get(
      "http://127.0.0.1:35729/api/searchlog_chart/"
    );
    chartData.value = response.data.chart_data;
    updateChart();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
  const monthsSet = new Set<string>();
  chartData.value.forEach((item: any) => {
    Object.keys(item).forEach((key: string) => {
      if (key !== "bnk_code") {
        monthsSet.add(key);
      }
    });
  });

  availableMonths.value = Array.from(monthsSet).sort();

  selectedMonth.value = availableMonths.value[0] || "";
};

const updateChart = () => {
  const filteredData = chartData.value.filter(
    (item: any) => selectedMonth.value in item
  );
  series.value[0].data = filteredData.map((item: any) => ({
    x: item.bnk_code,
    y: item[selectedMonth.value],
  }));
};

onMounted(() => {
  fetchData();
});

const updateQuarterChart = (chart: any, chartType: string) => {
  console.log("Update quarter chart logic here...");
};
</script>
<template>
  <div id="wrap" style="width: 100%" class="bg-white mt-10 rounded-lg">
    <div class="d-flex align-center mb-1">
      <div class="ml-auto mt-5 mr-4">
        <select
          v-model="selectedMonth"
          @change="updateChart"
          hide-details="auto"
          variant="outlined"
          density="compact"
          icon="mdi-arrow-down-drop-circle-outline"
          single-line
          style="border: 1px solid #263238; border-radius: 5px; padding: 5px"
        >
          <option v-for="month in availableMonths" :key="month" :value="month">
            {{ month }}
          </option>
        </select>
      </div>
    </div>
    <v-divider></v-divider>

    <div id="chart-year">
      <ApexCharts
        type="bar"
        height="400"
        :options="chartOptions"
        :series="series"
      ></ApexCharts>
    </div>

    <div id="chart-quarter"></div>
  </div>
</template>
