<!-- components/PieChart.vue -->
<template>
  <div class="w-full">
    <!-- Dropdown ສຳລັບເລືອກປີ -->
    <select v-model="selectedYear" @change="updateChart" class="mb-4 p-2 border rounded">
      <option value="all">ທັງໝົດ (ການເຄືອນໄຫວສິນເຊືອທັງໝົດ)</option>
      <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
    </select>
    <!-- Chart Container -->
    <div id="chart" class="w-full h-96"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import ApexCharts from 'apexcharts'

// Interface ສຳລັບຂໍ້ມູນ API
interface LoanStats {
  year?: number
  loan_count: number
  total_count: number
  percentage: number
  sumtotals?: {
    loan_count: number
    total_count: number
  }
}

// Interface ສຳລັບ Chart Options
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

// ຕົວແປ Reactive
const chart = ref<ApexCharts | null>(null)
const selectedYear = ref<string | number>('all') // ຄ່າເລີ່ມຕົ້ນແມ່ນ "ທັງໝົດ"
const loanData = ref<LoanStats[]>([])
const years = ref<number[]>([])
  const User = localStorage.getItem("user_data") || "{}";
  const bnk_code = JSON.parse(User).MID?.id ?? "";

// ຟັງຊັນເອົາຂໍ້ມູນຈາກ API
const fetchLoanStats = async () => {
  try {
    const config = useRuntimeConfig();

    const response = await fetch(`${config.public.strapi.url}api/dashboard/LoanStatsView/?bnk_code=${bnk_code}`)
    const data: LoanStats[] = await response.json()
    loanData.value = data
    // ດຶງປີທັງໝົດຈາກຂໍ້ມູນ (ບໍ່ລວມ sumtotals)
    years.value = data
      .filter(item => item.year !== undefined)
      .map(item => item.year as number)
      .sort((a, b) => a - b)
  } catch (error) {
    console.error('Error fetching loan stats:', error)
    // ຖ້າ API ບໍ່ເຮັດວຽກ, ໃຊ້ຄ່າພື້ນຖານ
 
  }
}

// ຟັງຊັນກຳນົດ Chart Options
const getChartOptions = (data: LoanStats): ChartOptions => {
  const isSummary = data.sumtotals !== undefined
  const loanCount = isSummary ? data.sumtotals!.loan_count : data.loan_count
  const totalCount = isSummary ? data.sumtotals!.total_count : data.total_count
  const nonLoanCount = totalCount - loanCount

  return {
    series: [loanCount, nonLoanCount],
    chart: {
      width: '100%',
      height: '100%',
      type: 'pie'
    },
    labels: ['Loan Count', 'ອັດຕາສິນເຊືອທັງໝົດ'],
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
        const name = opts.w.globals.labels[opts.seriesIndex]
        return [name, `${val.toFixed(1)}%`]
      }
    },
    legend: {
      show: false
    }
  }
}

// ຟັງຊັນອັບເດດ Chart
const updateChart = () => {
  if (!loanData.value.length) return

  let selectedData: LoanStats
  if (selectedYear.value === 'all') {
    selectedData = loanData.value.find(item => item.sumtotals !== undefined) || loanData.value[0]
  } else {
    selectedData = loanData.value.find(item => item.year === Number(selectedYear.value)) || loanData.value[0]
  }

  const options = getChartOptions(selectedData)

  if (chart.value) {
    chart.value.updateOptions(options)
  } else if (process.client) {
    chart.value = new ApexCharts(document.querySelector('#chart'), options)
    chart.value.render()
  }
}

// Lifecycle Hooks
onMounted(async () => {
  await fetchLoanStats()
  updateChart()
})

onUnmounted(() => {
  if (chart.value) {
    chart.value.destroy()
    chart.value = null
  }
})
</script>

<style scoped>
/* ປັບຂະໜາດ Chart Container */
.h-96 {
  height: 24rem; /* ປັບຄວາມສູງຕາມຕ້ອງການ */
}
</style>