<template>
    <div>
      <div>
        <v-col cols="12" md="12">
          <v-row>
            <v-col cols="12" md="4">
              <v-select
                variant="outlined"
                density="compact"
                v-model="selectedYear"
                :items="years"
                label="ປີ"
                @update:modelValue="handleYearChange"
                clearable
              ></v-select>
            </v-col>
            <v-col cols="12" md="4">
              <v-select
                variant="outlined"
                density="compact"
                v-model="selectedMonth"
                :items="months"
                label="ເດືອນ"
                @update:modelValue="handleMonthChange"
                :disabled="!selectedYear"
                clearable
              ></v-select>
            </v-col>
            <v-col cols="12" md="4">
              <v-select
                variant="outlined"
                density="compact"
                v-model="selectedDay"
                :items="days"
                label="ວັນ"
                @update:modelValue="fetchData"
                :disabled="!selectedMonth"
                clearable
              ></v-select>
            </v-col>
          </v-row>
        </v-col>
      </div>
  
      <div v-if="pending">ກຳລັງໂຫຼດຂໍ້ມູນ...</div>
      <div v-else-if="error">ເກີດຂໍ້ຜິດພາດໃນການໂຫຼດຂໍ້ມູນ</div>
      <div v-else id="chart"></div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, nextTick, watch } from "vue";
  import ApexCharts from "apexcharts";
  import axios from "axios";
  
  interface User {
    MID?: {
      id: string;
    };
  }
  
  const userData = localStorage.getItem("user_data") || "{}";
  const user = JSON.parse(userData) as User;
  const bnk_code = user?.MID?.id ?? "02";
  
  const selectedYear = ref<string>("");
  const selectedMonth = ref<string>("");
  const selectedDay = ref<string>("");
  const years = ref<string[]>([]);
  const months = ref<string[]>([]);
  const days = ref<string[]>([]);
  
  const data = ref<any[]>([]);
  const pending = ref(true);
  const error = ref<string | null>(null);
  let chart: ApexCharts | null = null;
  
  const fetchYears = async () => {
    try {
      const config = useRuntimeConfig();
      const response = await axios.get(
        `${config.public.strapi.url}api/dashboard/loan-count-by-month/?bnk_code=${bnk_code}`
      );
      years.value = [...new Set(response.data.map((item: any) => item.year))];
      console.log(years.value);
    } catch (err) {
      console.error("Failed to fetch years:", err);
      error.value = "ເກີດຂໍ້ຜິດພາດໃນການໂຫຼດຂໍ້ມູນປີ";
    }
  };
  
  const handleYearChange = async () => {
    selectedMonth.value = "";
    selectedDay.value = "";
    if (selectedYear.value) {
      await fetchMonths();
    }
    fetchData();
  };
  
  const fetchMonths = async () => {
    try {
      const config = useRuntimeConfig();

      const response = await axios.get(
        `${config.public.strapi.url}api/dashboard/loan-count-by-month/?year=${selectedYear.value}&bnk_code=${bnk_code}`
      );
      months.value = [
        ...new Set(
          response.data.map((item: any) => item.year_month.split("-")[1])
        ),

      ];
      console.log("ເດອືອນ",months.value);
    } catch (err) {
      console.error("Failed to fetch months:", err);
      error.value = "ເກີດຂໍ້ຜິດພາດໃນການໂຫຼດຂໍ້ມູນເດືອນ";
    }
  };
  
  const handleMonthChange = async () => {
    selectedDay.value = "";
    if (selectedMonth.value) {
      await fetchDays();
    }
    fetchData();
  };
  
  const fetchDays = async () => {
    try {
      const config = useRuntimeConfig();
      const response = await axios.get(
        `${config.public.strapi.url}api/dashboard/loan-count-by-month/?year=${selectedYear.value}&month=${selectedMonth.value}&bnk_code=${bnk_code}`
      );
      days.value = [
        ...new Set(response.data.map((item: any) => item.day_of_month)),
      ];
    } catch (err) {
      console.error("Failed to fetch days:", err);
      error.value = "ເກີດຂໍ້ຜິດພາດໃນການໂຫຼດຂໍ້ມູນວັນ";
    }
  };
  
  const fetchData = async () => {
    try {
        const config = useRuntimeConfig();
      pending.value = true;
      error.value = null;
  
      let url = `${config.public.strapi.url}api/dashboard/loan-count-by-month/?bnk_code=${bnk_code}`;
      if (selectedYear.value) {
        url += `&year=${selectedYear.value}`;
      }
      if (selectedMonth.value) {
        url += `&month=${selectedMonth.value}`;
      }
      if (selectedDay.value) {
        url += `&day=${selectedDay.value}`;
      }
  
      const response = await axios.get(url);
      data.value = response.data;
      pending.value = false;
      
      await nextTick();
      renderChart();
    } catch (err) {
      error.value = "ເກີດຂໍ້ຜິດພາດໃນການໂຫຼດຂໍ້ມູນ";
      pending.value = false;
      console.error(err);
    }
  };
  
  const renderChart = () => {
    const chartElement = document.querySelector("#chart");
    if (!chartElement) {
      console.error("Element #chart not found!");
      return;
    }
  
  
    if (chart) {
      chart.destroy();
    }
  
    const chartOptions = {
      series: [
        {
          name: "ຈຳນວນຂໍ້ມູນ",
          data: data.value.map((item) => item.loan_count),
        },
      ],
      chart: {
        height: 350,
        type: "line",
      },
      xaxis: {
        categories: data.value.map((item) => {
          if (selectedDay.value) {
            return item.day_of_month;
          } else if (selectedMonth.value) {
            return item.year_month;
          } else {
            return item.year;
          }
        }),
        title: {
          text: "Time",
        },
      },
      title: {
        text: "ການນຳສົ່ງຂໍ້ມູນເງິນກູ້",
        align: "left",
      },
      stroke: {
        width: 5,
        curve: "smooth",
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          gradientToColors: ["#FDD835"],
          shadeIntensity: 1,
          type: "horizontal",
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100, 100, 100],
        },
      },
    };
  
    chart = new ApexCharts(chartElement, chartOptions);
    chart.render();
  };
  
  onMounted(async () => {
    await fetchYears();
    await fetchData(); 
  });
  
  
  onUnmounted(() => {
    if (chart) {
      chart.destroy();
    }
  });
  </script>
  
  <style scoped></style>