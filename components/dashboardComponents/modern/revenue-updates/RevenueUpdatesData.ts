import axios from "axios";
import { ref } from "vue";

interface SeriesData {
  x: string;
  y: number;
}

export const series = ref<{ data: SeriesData[] }[]>([{ data: [] }]);
export const selectedMonth = ref<string>("");
export const chartData = ref<any[]>([]);
export const availableMonths = ref<string[]>([]);

export const chartOptions = {
  chart: {
    id: "barYear",
    height: 400,
    type: "bar",
  },
  plotOptions: {
    bar: {
      distributed: true,
      horizontal: true,
      barHeight: "75%",
    },
  },
  dataLabels: {
    enabled: true,
    style: { colors: ["#fff"] },
    formatter: (val: any, opt: any) => {
      return opt.w.globals.series[0][opt.dataPointIndex].toLocaleString();
    },
  },
  colors: [
    "#00B0FF",
    "#0288D1",
    "#2979FF",
    "#F50057",
    "#FFCA28",
    "#37474F",
    "#1B5E20",
    "#D32F2F",
    "#8E24AA",
    "#00C853",
  ],
  yaxis: {
    labels: {
      show: true,
      formatter: (value: number) => value.toLocaleString(),
    },
  },
};

export const fetchData = async () => {
  try {
    const config = useRuntimeConfig();

    const response = await axios.get(
      `${config.public.strapi.url}api/searchlog_chart/`
    );
    chartData.value = response.data.chart_data;

    const monthsSet = new Set<string>();
    chartData.value.forEach((item: any) => {
      Object.keys(item).forEach((key: string) => {
        if (key !== "bnk_code") {
          monthsSet.add(key);
        }
      });
    });

    availableMonths.value = Array.from(monthsSet).sort();
    const lastMonthIndex = availableMonths.value.length - 2; 
    selectedMonth.value = availableMonths.value[lastMonthIndex] || "";

    updateChart();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const updateChart = () => {
  if (!selectedMonth.value) return;

  const filteredData = chartData.value
    .filter((item: any) => selectedMonth.value in item)
    .sort((a: any, b: any) => b[selectedMonth.value] - a[selectedMonth.value])
    .slice(0, 10);

  series.value[0].data = filteredData.map((item: any) => ({
    x: item.bank_name,
    y: item[selectedMonth.value],
  }));
};

export const updateQuarterChart = (chart: any, chartType: string) => {
  console.log("Update quarter chart logic here...");
};