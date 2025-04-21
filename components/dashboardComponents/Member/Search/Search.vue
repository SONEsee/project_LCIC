<template>
    <div class="p-4">
      <div class="mb-4 flex gap-4 mt-8">
        <v-row>
        <v-col cols="4">
        <v-select
        density="compact"
        variant="outlined"
          v-model="selectedYear"
          :items="yearData"
          label="ເລືອກປີ"
          @update:modelValue="handleYearChange"
          dense
        ></v-select>
  </v-col>
  <v-col cols="4">
        <v-select
        density="compact"
        variant="outlined"
          v-if="selectedYear"
          v-model="selectedMonth"
          :items="availableMonths"
          item-title="label"
          item-value="value"
          label="ເລືອກເດືອນ"
          @update:modelValue="handleMonthChange"
          dense
        ></v-select>
  </v-col>
  <v-col cols="4">
        <v-select
        density="compact"
        variant="outlined"
          v-if="selectedMonth"
          v-model="selectedDay"
          :items="dayData"
          item-title="day_of_month"
          item-value="day_of_month"
          label="ເລືອກວັນ"
          @update:modelValue="handleDayChange"
          dense
        ></v-select>
        </v-col>
    </v-row>
      </div>
  
      <div id="chart" class="w-full h-[400px]"></div>
    </div>
  </template>
  
  <script>
  import { defineComponent, ref, onMounted } from 'vue'
  import ApexCharts from 'apexcharts'
  
  export default defineComponent({
    name: 'StatsChart',
    setup() {
      const config = useRuntimeConfig()
      const User = localStorage.getItem("user_data") || "{}";
      const baseUrl = `${config.public.strapi.url}api/dashboard/search-count-by-date`
      const bankCode = JSON.parse(User).MID?.id ?? "";
  
      let chart = null
      const yearData = ref([])
      const dayData = ref([])
      const availableMonths = ref([])
  
      const selectedYear = ref('')
      const selectedMonth = ref('')
      const selectedDay = ref('')
  
      const monthNames = {
        '01': 'ມັງກອນ', '02': 'ກຸມພາ', '03': 'ມີນາ',
        '04': 'ເມສາ', '05': 'ພຶດສະພາ', '06': 'ມິຖຸນາ',
        '07': 'ກໍລະກົດ', '08': 'ສິງຫາ', '09': 'ກັນຍາ',
        '10': 'ຕຸລາ', '11': 'ພະຈິກ', '12': 'ທັນວາ'
      }
  
      const createChart = (data, options = {}) => {
        const defaultOptions = {
          series: [{ name: "ຈຳນວນການຄົ້ນຫາ", data: data }],
          chart: { type: 'bar', height: 400, width: '100%', zoom: { enabled: true } },
          dataLabels: { enabled: true },
          stroke: { curve: 'smooth', width: 2 },
          title: { text: 'ສະຖິຕິການຄົ້ນຫາ', align: 'left' },
          xaxis: { type: 'category', labels: { rotate: 0 } },
          yaxis: { title: { text: 'ຈຳນວນການຄົ້ນຫາ' }, min: 0 },
          ...options
        }
  
        if (chart) chart.destroy()
  
        const chartElement = document.querySelector("#chart")
        if (chartElement) {
          chart = new ApexCharts(chartElement, defaultOptions)
          chart.render()
        }
      }
  
      const fetchMonthlyData = async (year) => {
        try {
          const response = await fetch(`${baseUrl}/?bnk_code=${bankCode}&year=${year}`)
          const data = await response.json()
  
          availableMonths.value = data.map(item => ({
            value: item.year_month.split('-')[1],
            label: monthNames[item.year_month.split('-')[1]],
            count: item.search_count
          }))
  
          createChart(availableMonths.value.map(month => ({
            x: month.label, y: month.count
          })), { title: { text: `ສະຖິຕິການຄົ້ນຫາ ປີ ${year}` }, xaxis: { title: { text: 'ເດືອນ' } } })
        } catch (error) {
          console.error('Error fetching monthly data:', error)
        }
      }
  
      const fetchDayData = async () => {
        if (!selectedYear.value || !selectedMonth.value) return
        try {
          const response = await fetch(`${baseUrl}/?bnk_code=${bankCode}&year=${selectedYear.value}&month=${selectedMonth.value}`)
          const data = await response.json()
          dayData.value = data
          createChart(data.map(item => ({ x: item.day_of_month, y: item.search_count })), {
            title: { text: `ສະຖິຕິການຄົ້ນຫາ ${monthNames[selectedMonth.value]} ${selectedYear.value}` },
            xaxis: { title: { text: 'ວັນທີ' } }
          })
        } catch (error) {
          console.error('Error fetching day data:', error)
        }
      }
  
      const fetchHourData = async () => {
        if (!selectedYear.value || !selectedMonth.value || !selectedDay.value) return
        try {
          const response = await fetch(`${baseUrl}/?bnk_code=${bankCode}&year=${selectedYear.value}&month=${selectedMonth.value}&day=${selectedDay.value}`)
          const data = await response.json()
          createChart(data.map(item => ({ x: `${item.hour_of_day}:00`, y: item.search_count })), {
            title: { text: `ສະຖິຕິການຄົ້ນຫາ ວັນທີ ${selectedDay.value}/${selectedMonth.value}/${selectedYear.value}` },
            xaxis: { title: { text: 'ເວລາ' } }
          })
        } catch (error) {
          console.error('Error fetching hour data:', error)
        }
      }
  
      const handleYearChange = () => {
        selectedMonth.value = ''
        selectedDay.value = ''
        if (selectedYear.value) fetchMonthlyData(selectedYear.value)
      }
  
      const handleMonthChange = () => {
        selectedDay.value = ''
        if (selectedMonth.value) fetchDayData()
      }
  
      const handleDayChange = () => {
        if (selectedDay.value) fetchHourData()
      }
  
      const fetchYearData = async () => {
        try {
          const response = await fetch(`${baseUrl}/?bnk_code=${bankCode}`)
          const data = await response.json()
          yearData.value = data.map(item => item.year)
          if (yearData.value.length > 0) {
            selectedYear.value = Math.max(...yearData.value)
            fetchMonthlyData(selectedYear.value)
          }
        } catch (error) {
          console.error('Error fetching year data:', error)
        }
      }
  
      onMounted(fetchYearData)
  
      return { yearData, dayData, availableMonths, selectedYear, selectedMonth, selectedDay, handleYearChange, handleMonthChange, handleDayChange }
    }
  })
  </script>
  