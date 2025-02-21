<template>
    <div class="w-full mt-5 ml-5 mr-5 mb-5" style="width: 90%;">
      <select v-model="selectedYear" @change="updateChart" class="mb-4 p-2 border rounded">
        <option value="all">ທັງໝົດ (ການເຄືອນໄຫວສິນເຊືອທັງໝົດ)</option>
        <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
      </select>
      <div id="chart5" class="w-full h-96"></div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import ApexCharts from 'apexcharts'

interface LoanStats {
  year?: number
  total_count: number
  percentage: number
  sumtotals?: {
    total_count: number
    [key: string]: number | undefined 
  }
  [key: string]: any 
}

interface ChartOptions {
  series: number[]
  chart: {
    width: string
    height: string
    type: 'pie'
  }
  labels: string[]
  theme: {
    monochrome: {
      enabled: boolean
    }
  }
  plotOptions: {
    pie: {
      dataLabels: {
        offset: number
      }
    }
  }
  grid: {
    padding: {
      top: number
      bottom: number
      left: number
      right: number
    }
  }
  dataLabels: {
    formatter: (val: number, opts: any) => [string, string]
  }
  legend: {
    show: boolean
  }
}

const chart = ref<ApexCharts | null>(null)
const selectedYear = ref<string | number>('all')
const loanData = ref<LoanStats[]>([])
const years = ref<number[]>([])
const bankField = ref<string>('') 
const User = localStorage.getItem("user_data") || "{}";
const bnk_code = JSON.parse(User).MID?.id ?? "02";

const fetchLoanStats = async () => {
  try {
    const config = useRuntimeConfig();
    const response = await fetch(`${config.public.strapi.url}api/dashboard/LoanStatsView/?bnk_code=${bnk_code}`);
    const data: LoanStats[] = await response.json();
    loanData.value = data;
    console.log('Fetched data:', data);

   
    if (data.length > 0) {
      const firstItem = data[0];
      bankField.value = Object.keys(firstItem).find(
        key => key !== 'year' && key !== 'total_count' && key !== 'percentage' && key !== 'sumtotals'
      ) || '';
      console.log('Detected bank field:', bankField.value);
    }

    years.value = data
      .filter(item => item.year !== undefined)
      .map(item => item.year as number)
      .sort((a, b) => a - b);
  } catch (error) {
    console.error('Error fetching loan stats:', error);
  }
}

const getChartOptions = (data: LoanStats): ChartOptions => {
  const isSummary = data.sumtotals !== undefined;
  const bankCount = isSummary ? data.sumtotals![bankField.value] : data[bankField.value];
  const totalCount = isSummary ? data.sumtotals!.total_count : data.total_count;
  const nonBankCount = totalCount - (bankCount || 0);

  console.log('Bank Field:', bankField.value, 'Bank Count:', bankCount, 'Total Count:', totalCount, 'Non-Bank Count:', nonBankCount);

  return {
    series: [bankCount || 0, nonBankCount || 0],
    chart: {
      width: '100%',
      height: '100%',
      type: 'pie'
    },
    // labels: [`${bankField.value} Count`, `ຍອດທີ່ບໍ່ແມ່ນ ${bankField.value}`],
    labels: [`${bankField.value} `, `ການເຄືອນໄຫວສິນເຊືອທັງໝົດທົວລະບົບ`],
    theme: {
      monochrome: {
        enabled: true
      }
    },
    plotOptions: {
      pie: {
        dataLabels: {
          offset: -5
        }
      }
    },
    grid: {
      padding: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
      }
    },
    dataLabels: {
      formatter(val: number, opts: any) {
        const name = opts.w.globals.labels[opts.seriesIndex];
        return [name, `${val.toFixed(1)}%`];
      }
    },
    legend: {
      show: true
    }
  };
}

const updateChart = () => {
  if (!loanData.value.length || !bankField.value) {
    console.log('No loan data or bank field available');
    return;
  }

  let selectedData: LoanStats;
  if (selectedYear.value === 'all') {
    selectedData = loanData.value.find(item => item.sumtotals !== undefined) || loanData.value[0];
  } else {
    selectedData = loanData.value.find(item => item.year === Number(selectedYear.value)) || loanData.value[0];
  }

  console.log('Selected Data:', selectedData);

  const options = getChartOptions(selectedData);

  if (chart.value) {
    chart.value.updateOptions(options);
  } else if (process.client) {
    chart.value = new ApexCharts(document.querySelector('#chart5'), options);
    chart.value.render()
      .then(() => console.log('Chart rendered'))
      .catch(err => console.error('Chart render error:', err));
  }
}

onMounted(async () => {
  await fetchLoanStats();
  updateChart();
})

onUnmounted(() => {
  if (chart.value) {
    chart.value.destroy();
    chart.value = null;
  }
})
</script>

<style scoped>
.h-96 {
  height: 24rem;
}
</style>