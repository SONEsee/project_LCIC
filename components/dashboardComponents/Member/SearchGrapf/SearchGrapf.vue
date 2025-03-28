<template>
  <div>
    <v-select
      width="40%"
      variant="outlined"
      density="compact"
      v-model="selectedYear"
      :items="years"
      label="ເລືອກປີ"
      @change="fetchMonthlyData"
    />
    <div id="chart3"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";
import ApexCharts from "apexcharts";
import axios from "axios";

interface YearlyData {
  year: number;
  total_fee: number;
}

interface MonthlyData {
  year_month: string;
  total_fee: number;
}

const chart = ref<ApexCharts | null>(null);
const loading = ref(true);
const selectedYear = ref<number | null>(null);
const years = ref<number[]>([]);
const User = localStorage.getItem("user_data") || "{}";
const bnk_code = JSON.parse(User).MID?.id ?? "";
const fetchYears = async () => {
  try {
    const config = useRuntimeConfig();
    const response = await axios.get(
      `${config.public.strapi.url}api/dashboard/fee_count-by-date/?bnk_code=${bnk_code}`
    );
    const data: YearlyData[] = response.data;
    years.value = data.map((item) => item.year).sort((a, b) => b - a);
    if (years.value.length > 0) {
      selectedYear.value = years.value[0];
    }
  } catch (error) {
    console.error("Error fetching years:", error);
  }
};

const fetchMonthlyData = async () => {
  if (!selectedYear.value) return;

  try {
    const config = useRuntimeConfig();
    loading.value = true;
    const response = await axios.get(
      `${config.public.strapi.url}api/dashboard/fee_count-by-date/?bnk_code=${bnk_code}&year=${selectedYear.value}`
    );
    const data: MonthlyData[] = response.data;

    const allMonths = Array.from({ length: 12 }, (_, i) => {
      const month = (i + 1).toString().padStart(2, "0");
      return `${selectedYear.value}-${month}`;
    });

    const completeData = allMonths.map((monthKey) => {
      const foundData = data.find((item) => item.year_month === monthKey);
      return {
        year_month: monthKey,
        total_fee: foundData ? foundData.total_fee : 0,
      };
    });

    updateChart(completeData);
  } catch (error) {
    console.error("Error fetching monthly data:", error);
  } finally {
    loading.value = false;
  }
};

watch(selectedYear, async (newYear) => {
  if (newYear) {
    await fetchMonthlyData();
  }
});

const updateChart = (data: MonthlyData[]) => {
  const months = data.map((item) => {
    const [_, month] = item.year_month.split("-");
    return getMonthName(parseInt(month));
  });
  const fees = data.map((item) => item.total_fee);

  const options: ChartOptions = {
    series: [
      {
        name: "ຄ່າທຳນຽມ",
        data: fees,
      },
    ],
    chart: {
      height: 350,
      type: "bar",
    },
    plotOptions: {
      bar: {
        borderRadius: 10,
        dataLabels: {
          position: "top",
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `${numberWithCommas(val)} ກີບ`,
      offsetY: -20,
      style: {
        fontSize: "12px",
        colors: ["#304758"],
      },
    },
    xaxis: {
      categories: months,
      position: "top",
      axisBorder: { show: false },
      axisTicks: { show: false },
      crosshairs: {
        fill: {
          type: "gradient",
          gradient: {
            colorFrom: "#D8E3F0",
            colorTo: "#BED1E6",
            stops: [0, 100],
            opacityFrom: 0.4,
            opacityTo: 0.5,
          },
        },
      },
      tooltip: { enabled: true },
    },
    yaxis: {
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        show: true,
        formatter: (val) => `${numberWithCommas(val)} ກີບ`,
      },
    },
    title: {
      text: `ຄ່າທຳນຽມປະຈຳ ປີ ${selectedYear.value}`,
      floating: true,
      offsetY: 330,
      align: "center",
      style: { color: "#444" },
    },
  };

  if (chart.value) {
    chart.value.destroy();
  }
  chart.value = new ApexCharts(document.querySelector("#chart3"), options);
  chart.value.render();
};

const getMonthName = (month: number): string => {
  const months = [
    "ມັງກອນ",
    "ກຸມພາ",
    "ມີນາ",
    "ເມສາ",
    "ພຶດສະພາ",
    "ມິຖຸນາ",
    "ກໍລະກົດ",
    "ສິງຫາ",
    "ກັນຍາ",
    "ຕຸລາ",
    "ພະຈິກ",
    "ທັນວາ",
  ];
  return months[month - 1];
};

const numberWithCommas = (x: number): string => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

onMounted(async () => {
  await fetchYears();
  if (selectedYear.value) {
    await fetchMonthlyData();
  }
});

onUnmounted(() => {
  if (chart.value) {
    chart.value.destroy();
  }
});
</script>
