<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="4">
          <v-select
            variant="outlined"
            density="compact"
            v-model="selectedYear"
            :items="years"
            label="ເລືອກປີ"
            @update:modelValue="handleYearChange"
          ></v-select>
        </v-col>
        <v-col cols="4" v-if="selectedYear">
          <v-select
            variant="outlined"
            density="compact"
            v-model="selectedMonth"
            :items="months"
            label="ເລືອກເດືອນ"
            @update:modelValue="handleMonthChange"
          ></v-select>
        </v-col>
      </v-row>
    </v-container>

    <div id="chart1" class="w-full"></div>
  </div>

  
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import ApexCharts from "apexcharts";
import axios from "axios";

const User = localStorage.getItem("user_data") || "{}";
const bnk_code = JSON.parse(User).MID?.id ?? "";
const item = ref([]);
const config = useRuntimeConfig();
const apiBase = `${config.public.strapi.url}api/dashboard/loan-count-by-month/`;
const selectedYear = ref<string | null>(null);
const selectedMonth = ref<string | null>(null);
const years = ref<string[]>([]);
const months = ref<string[]>([]);
const chart = ref<ApexCharts | null>(null);
const Getdata = async () => {
  try {
    const res = await axios.get(`${apiBase}?bnk_code=${bnk_code}`);
    if (res.status === 200) {
      item.value = res.data;
      
    }
  } catch (error) {}
};
onMounted(Getdata);
const chartOptions = ref({
  series: [{ name: "ຈຳນວນສິນເຊື່ອ", data: [] }],
  chart: {
    type: "area",
    height: 350,
    zoom: { enabled: false },
    toolbar: {
      show: true,
      tools: {
        download: true,
        selection: true,
        zoom: true,
        zoomin: true,
        zoomout: true,
        pan: true,
        reset: true,
      },
    },
  },
  dataLabels: {
    enabled: true,
    formatter: function (val: number) {
      return val.toLocaleString();
    },
  },
  stroke: {
    curve: "smooth",
    width: 2,
  },
  title: {
    text: "ການເຄື່ອນໄຫວສິນເຊື່ອ",
    align: "left",
    style: {
      fontSize: "16px",
      fontWeight: "bold",
    },
  },
  xaxis: {
    type: "category",
    categories: [],
    labels: {
      rotate: -45,
      style: {
        fontSize: "12px",
      },
    },
  },
  yaxis: {
    labels: {
      formatter: function (val: number) {
        return val.toLocaleString();
      },
    },
  },
  tooltip: {
    y: {
      formatter: function (val: number) {
        return val.toLocaleString() + " ລາຍການ";
      },
    },
  },
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0.3,
    },
  },
});

const fetchInitialData = async () => {
  try {
    const response = await axios.get(`${apiBase}?bnk_code=${bnk_code}`);
    const data = response.data;

    const uniqueYears = [...new Set(data.map((item: any) => item.year))];
    years.value = uniqueYears.sort((a, b) => b.localeCompare(a));

    const yearlyData = uniqueYears.map((year) => {
      const yearData = data.filter((item: any) => item.year === year);
      return {
        year: year,
        total: yearData.reduce(
          (sum: number, item: any) => sum + item.loan_count,
          0
        ),
      };
    });

    chartOptions.value.series[0].data = yearlyData.map((item) => item.total);
    chartOptions.value.xaxis.categories = yearlyData.map((item) => item.year);
    chartOptions.value.title.text = "ການເຄື່ອນໄຫວສິນເຊື່ອປະຈຳປີ";

    if (chart.value) {
      chart.value.updateOptions(chartOptions.value);
    }
  } catch (error) {
    console.error("Error fetching initial data:", error);
  }
};

const handleYearChange = async () => {
  selectedMonth.value = null;
  if (!selectedYear.value) {
    await fetchInitialData();
    return;
  }

  try {
    const response = await axios.get(
      `${apiBase}?bnk_code=${bnk_code}&year=${selectedYear.value}`
    );
    const data = response.data;

    months.value = [
      ...new Set(data.map((item: any) => item.year_month.split("-")[1])),
    ].sort();

    const monthlyData = data.sort((a: any, b: any) =>
      a.year_month.localeCompare(b.year_month)
    );
    chartOptions.value.series[0].data = monthlyData.map(
      (item: any) => item.loan_count
    );
    chartOptions.value.xaxis.categories = monthlyData.map(
      (item: any) => `ເດືອນ ${item.year_month.split("-")[1]}`
    );
    chartOptions.value.title.text = `ການເຄື່ອນໄຫວສິນເຊື່ອປະຈຳປີ ${selectedYear.value}`;

    if (chart.value) {
      chart.value.updateOptions(chartOptions.value);
    }
  } catch (error) {
    console.error("Error fetching year data:", error);
  }
};

const handleMonthChange = async () => {
  if (!selectedYear.value || !selectedMonth.value) return;

  try {
    const response = await axios.get(
      `${apiBase}?bnk_code=${bnk_code}&year=${selectedYear.value}&month=${selectedMonth.value}`
    );
    const data = response.data;

    chartOptions.value.series[0].data = data.map(
      (item: any) => item.loan_count
    );
    chartOptions.value.xaxis.categories = data.map(
      (item: any) => item.day_of_month
    );
    chartOptions.value.title.text = `ການເຄື່ອນໄຫວສິນເຊື່ອ ເດືອນ ${selectedMonth.value} ປີ ${selectedYear.value}`;

    if (chart.value) {
      chart.value.updateOptions(chartOptions.value);
    }
  } catch (error) {
    console.error("Error fetching month data:", error);
  }
};

onMounted(() => {
  chart.value = new ApexCharts(
    document.querySelector("#chart1"),
    chartOptions.value
  );
  chart.value.render();
  fetchInitialData();
});
</script>
