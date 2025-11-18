<template>
  <div class="report-container">
    <v-container fluid class="pa-0">
      <!-- Print Button - Fixed Position -->
      <v-btn
        v-if="!isPrinting && hasAnyResults"
        @click="printReport"
        color="primary"
        fab
        fixed
        bottom
        right
        elevation="6"
        class="print-fab d-print-none"
      >
        <v-icon>mdi-printer</v-icon>
      </v-btn>

      <v-row class="ma-0">
        <v-col cols="12" class="pa-2">
          <!-- Header Section -->
          <v-card class="report-header mb-4 d-print-none" elevation="4">
            <v-card-title class="header-section">
              <div class="d-flex align-center justify-space-between">
                <div class="d-flex align-center">
                  <v-icon class="mr-3" size="28">mdi-file-document-outline</v-icon>
                  <div>
                    <h2 class="header-title">ລາຍງານຜົນການຄົ້ນຫາ</h2>
                    <p class="header-subtitle">{{ reportDate }}</p>
                  </div>
                </div>
                <div class="d-flex gap-2">
                  <v-btn
                    @click="printReport"
                    variant="outlined"
                    color="white"
                    size="small"
                    class="mr-2"
                  >
                    <v-icon left class="mr-2" size="18">mdi-printer</v-icon>
                    ພິມລາຍງານ
                  </v-btn>
                  <v-btn
                    @click="goBack"
                    variant="outlined"
                    color="white"
                    size="small"
                  >
                    <v-icon left class="mr-2" size="18">mdi-arrow-left</v-icon>
                    ກັບຄືນ
                  </v-btn>
                </div>
              </div>
            </v-card-title>
          </v-card>

          <!-- Print Header (Hidden on Screen) -->
          <div class="print-header d-print-block">
            <div class="print-header-content">
              <div class="print-company-section">
                <img  
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQguq0YjU42M_ijrBwnE9IpgFAFeMZQCDDJVi3yrfOCog&s"
                  class="print-logo"
                  alt="Company Logo"
                />
                <div class="print-company-info">
                  <h2 class="print-company-name-lao">ບໍລິສັດ ຂໍ້ມູນຂ່າວສານສິນເຊື່ອແຫ່ງ ສປປ ລາວ</h2>
                  <h3 class="print-company-name-eng">LAO CREDIT INFORMATION COMPANY</h3>
                </div>
              </div>
              <div class="print-reference-section">
                <div class="print-reference-item">
                  <strong>Reference:</strong> {{ getReferenceCode() || 'REF-' + generateRefCode() }}
                </div>
                <div class="print-reference-item">
                  <strong>Date:</strong> {{ reportDate }} {{ currentTime }}
                </div>
                <div class="print-reference-item">
                  <strong>Type:</strong> {{ getReportTypes() }}
                </div>
              </div>
            </div>
          </div>

          <!-- Loading State -->
          <v-card v-if="isLoading" class="text-center pa-8 d-print-none" elevation="2">
            <v-progress-circular
              :size="70"
              :width="7"
              color="primary"
              indeterminate
            ></v-progress-circular>
            <p class="mt-4 text-h6">ກໍາລັງໂຫລດຂໍ້ມູນ...</p>
          </v-card>

          <!-- Error State -->
          <v-alert
            v-if="hasErrors && !isLoading"
            type="error"
            variant="tonal"
            class="mb-6 d-print-none"
          >
            <v-alert-title>ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນ</v-alert-title>
            <div v-for="error in errors" :key="error.type" class="mt-2">
              {{ getServiceName(error.type) }}: {{ error.message }}
            </div>
          </v-alert>

          <!-- Water Report Section -->
          <v-card
            v-if="waterReport && !isLoading"
            class="report-section mb-3"
            elevation="2"
          >
            <v-card-title class="section-header water-header">
              <div class="d-flex align-center justify-space-between w-100">
                <div class="d-flex align-center">
                  <v-icon class="mr-2" size="18">mdi-water</v-icon>
                  ລາຍງານນໍ້າປະປາ / Water Supply Report
                </div>
                <v-btn
                  @click="refreshSpecificReport('water')"
                  variant="text"
                  size="small"
                  color="white"
                  :loading="isLoading"
                  class="d-print-none"
                >
                  <v-icon size="16">mdi-refresh</v-icon>
                </v-btn>
              </div>
            </v-card-title>
            <v-card-text class="report-content">
              <!-- Customer Information -->
              <div class="info-section">
                <h4 class="info-title">ຂໍ້ມູນລູກຄ້າ / Customer Information</h4>
                <div class="info-grid" v-if="waterReport.customer && waterReport.customer[0]">
                  <div class="info-row">
                    <span class="info-label">ລະຫັດລູກຄ້າ / Customer ID:</span>
                    <span class="info-value">{{ waterReport.customer[0].Customer_ID }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">ຊື່ລູກຄ້າ / Customer Name:</span>
                    <span class="info-value">{{ getFullName(waterReport.customer[0]) }}</span>
                  </div>
                  <div class="info-row" v-if="waterReport.customer[0].Company_name">
                    <span class="info-label">ບໍລິສັດ / Company:</span>
                    <span class="info-value">{{ waterReport.customer[0].Company_name }}</span>
                  </div>
                  <div class="info-row" v-if="waterReport.customer[0].Tel">
                    <span class="info-label">ເບີໂທລະສັບ / Telephone:</span>
                    <span class="info-value">{{ waterReport.customer[0].Tel }}</span>
                  </div>
                  <div class="info-row full-width" v-if="waterReport.customer[0].Address">
                    <span class="info-label">ທີ່ຢູ່ / Address:</span>
                    <span class="info-value">{{ waterReport.customer[0].Address }}</span>
                  </div>
                </div>
              </div>

              <!-- Transaction History Table -->
              <div class="table-section" v-if="waterReport.bill && waterReport.bill.length > 0">
                <h4 class="table-title">ປະຫວັດການຊໍາລະ / Payment History</h4>
                <div class="professional-table">
                  <table class="data-table">
                    <thead>
                      <tr>
                        <th class="header-cell">ລໍາດັບ<br/>No.</th>
                        <th class="header-cell">ເດືອນ<br/>Month</th>
                        <th class="header-cell">ລະຫັດການຊໍາລະ<br/>Payment ID</th>
                        <th class="header-cell text-right">ຄ້າງຊໍາລະ<br/>Outstanding</th>
                        <th class="header-cell text-right">ພາສີພື້ນຖານ<br/>Basic Tax</th>
                        <th class="header-cell text-right">ລວມທັງໝົດ<br/>Total</th>
                        <th class="header-cell text-center">ສະຖານະ<br/>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(bill, index) in getProcessedBills(waterReport.bill)" :key="index">
                        <td class="data-cell text-center">{{ index + 1 }}</td>
                        <td class="data-cell">{{ bill.InvoiceMonth }}</td>
                        <td class="data-cell">{{ bill.Payment_ID || '-' }}</td>
                        <td class="data-cell text-right" :class="bill.Outstanding > 0 ? 'text-danger' : ''">
                          {{ formatCurrency(bill.Outstanding) }}
                        </td>
                        <td class="data-cell text-right">{{ formatCurrency(bill.Basic_Tax) }}</td>
                        <td class="data-cell text-right font-weight-bold">
                          {{ formatCurrency(bill.totalAmount) }}
                        </td>
                        <td class="data-cell text-center">
                          <span :class="bill.status === 'ຊໍາລະເເລ້ວ' ? 'status-paid' : 'status-unpaid'">
                            {{ bill.status }}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Chart Section - Screen Display -->
              <div class="chart-section d-screen-block d-none" v-if="waterReport.bill && waterReport.bill.length > 0">
                <h4 class="chart-title">ກາຟິກສະແດງຂໍ້ມູນການໃຊ້ນໍ້າປະປາ</h4>
                <div class="chart-container">
                  <VueApexCharts
                    type="bar"
                    height="320"
                    :options="waterChartOptions"
                    :series="waterChartSeries"
                  />
                </div>
              </div>

              <!-- Print Chart Section -->
              <div class="print-chart-section" v-if="waterReport.bill && waterReport.bill.length > 0">
                <h4 class="print-chart-title">ກາຟິກການໃຊ້ນໍ້າປະປາ - 12 ເດືອນຫຼ້າສຸດ</h4>
                <div class="print-chart-container">
                  <VueApexCharts
                    type="bar"
                    height="220"
                    :options="printWaterChartOptions"
                    :series="waterChartSeries"
                  />
                </div>
              </div>
            </v-card-text>
          </v-card>

          <!-- Electric Report Section -->
          <v-card
            v-if="electricReport && !isLoading"
            class="report-section mb-3"
            elevation="2"
          >
            <v-card-title class="section-header electric-header">
              <div class="d-flex align-center justify-space-between w-100">
                <div class="d-flex align-center">
                  <v-icon class="mr-2" size="18">mdi-flash</v-icon>
                  ລາຍງານໄຟຟ້າ / Electricity Report
                </div>
                <v-btn
                  @click="refreshSpecificReport('electric')"
                  variant="text"
                  size="small"
                  color="white"
                  :loading="isLoading"
                  class="d-print-none"
                >
                  <v-icon size="16">mdi-refresh</v-icon>
                </v-btn>
              </div>
            </v-card-title>
            <v-card-text class="report-content">
              <!-- Customer Information -->
              <div class="info-section">
                <h4 class="info-title">ຂໍ້ມູນລູກຄ້າ / Customer Information</h4>
                <div class="info-grid" v-if="electricReport.customer && electricReport.customer[0]">
                  <div class="info-row">
                    <span class="info-label">ລະຫັດລູກຄ້າ / Customer ID:</span>
                    <span class="info-value">{{ electricReport.customer[0].Customer_ID }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">ຊື່ລູກຄ້າ / Customer Name:</span>
                    <span class="info-value">{{ getFullName(electricReport.customer[0]) }}</span>
                  </div>
                  <div class="info-row" v-if="electricReport.customer[0].Company_name">
                    <span class="info-label">ບໍລິສັດ / Company:</span>
                    <span class="info-value">{{ electricReport.customer[0].Company_name }}</span>
                  </div>
                  <div class="info-row" v-if="electricReport.customer[0].Tel">
                    <span class="info-label">ເບີໂທລະສັບ / Telephone:</span>
                    <span class="info-value">{{ electricReport.customer[0].Tel }}</span>
                  </div>
                  <div class="info-row full-width" v-if="electricReport.customer[0].Address">
                    <span class="info-label">ທີ່ຢູ່ / Address:</span>
                    <span class="info-value">{{ electricReport.customer[0].Address }}</span>
                  </div>
                </div>
              </div>

              <!-- Transaction History Table -->
              <div class="table-section" v-if="electricReport.bill && electricReport.bill.length > 0">
                <h4 class="table-title">ປະຫວັດການຊໍາລະ / Payment History</h4>
                <div class="professional-table">
                  <table class="data-table">
                    <thead>
                      <tr>
                        <th class="header-cell">ລໍາດັບ<br/>No.</th>
                        <th class="header-cell">ເດືອນ<br/>Month</th>
                        <th class="header-cell">ລະຫັດການຊໍາລະ<br/>Payment ID</th>
                        <th class="header-cell text-right">ຄ້າງຊໍາລະ<br/>Outstanding</th>
                        <th class="header-cell text-right">ພາສີພື້ນຖານ<br/>Basic Tax</th>
                        <th class="header-cell text-right">ລວມທັງໝົດ<br/>Total</th>
                        <th class="header-cell text-center">ສະຖານະ<br/>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(bill, index) in getProcessedBills(electricReport.bill)" :key="index">
                        <td class="data-cell text-center">{{ index + 1 }}</td>
                        <td class="data-cell">{{ bill.InvoiceMonth }}</td>
                        <td class="data-cell">{{ bill.Payment_ID || '-' }}</td>
                        <td class="data-cell text-right" :class="bill.Outstanding > 0 ? 'text-danger' : ''">
                          {{ formatCurrency(bill.Outstanding) }}
                        </td>
                        <td class="data-cell text-right">{{ formatCurrency(bill.Basic_Tax) }}</td>
                        <td class="data-cell text-right font-weight-bold">
                          {{ formatCurrency(bill.totalAmount) }}
                        </td>
                        <td class="data-cell text-center">
                          <span :class="bill.status === 'ຊໍາລະເເລ້ວ' ? 'status-paid' : 'status-unpaid'">
                            {{ bill.status }}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Chart Section - Screen Display -->
              <div class="chart-section d-screen-block d-none" v-if="electricReport.bill && electricReport.bill.length > 0">
                <h4 class="chart-title">ກາຟິກສະແດງຂໍ້ມູນການໃຊ້ໄຟຟ້າ</h4>
                <div class="chart-container">
                  <VueApexCharts
                    type="bar"
                    height="320"
                    :options="electricChartOptions"
                    :series="electricChartSeries"
                  />
                </div>
              </div>

              <!-- Print Chart Section -->
              <div class="print-chart-section" v-if="electricReport.bill && electricReport.bill.length > 0">
                <h4 class="print-chart-title">ກາຟິກການໃຊ້ໄຟຟ້າ - 12 ເດືອນຫຼ້າສຸດ</h4>
                <div class="print-chart-container">
                  <VueApexCharts
                    type="bar"
                    height="220"
                    :options="printElectricChartOptions"
                    :series="electricChartSeries"
                  />
                </div>
              </div>
            </v-card-text>
          </v-card>

          <!-- Professional Footer -->
          <v-card v-if="hasAnyResults && !isLoading" class="footer-section" elevation="2">
            <v-card-text class="footer-content">
              <div class="footer-grid">
                <div class="footer-column">
                  <h5 class="footer-heading">ສໍານັກງານໃຫຍ່ / Head Office</h5>
                  <div class="footer-info">
                    <p class="footer-text">
                      <v-icon size="16" class="mr-1">mdi-map-marker</v-icon>
                      2nd Floor, Lao Securities Exchange Building
                    </p>
                    <p class="footer-text">
                      Phonthan Village, Xaysettha District
                    </p>
                    <p class="footer-text">
                      Vientiane Capital, Lao PDR
                    </p>
                  </div>
                </div>
                <div class="footer-column">
                  <h5 class="footer-heading">ຂໍ້ມູນການຕິດຕໍ່ / Contact Details</h5>
                  <div class="footer-info">
                    <p class="footer-text">
                      <v-icon size="16" class="mr-1">mdi-phone</v-icon>
                      Tel: (856) 21-254290
                    </p>
                    <p class="footer-text">
                      <v-icon size="16" class="mr-1">mdi-fax</v-icon>
                      Fax: (856) 21-254291
                    </p>
                    <p class="footer-text">
                      <v-icon size="16" class="mr-1">mdi-email</v-icon>
                      Email: info@lcic.com.la
                    </p>
                  </div>
                </div>
                <div class="footer-column">
                  <h5 class="footer-heading">ໝາຍເຫດ / Disclaimer</h5>
                  <div class="footer-info">
                    <p class="footer-disclaimer-text">
                      ຂໍ້ມູນໃນລາຍງານນີ້ແມ່ນຖືກຕ້ອງຕາມຂໍ້ມູນທີ່ມີໃນລະບົບ ໃນເວລາທີ່ສ້າງລາຍງານ.
                    </p>
                    <p class="footer-disclaimer-text">
                      This report contains information accurate as per system records at the time of generation.
                    </p>
                  </div>
                </div>
              </div>
              <div class="footer-bottom">
                <div class="footer-signature">
                  <p class="signature-text">© {{ currentYear }} Lao Credit Information Company. All Rights Reserved.</p>
                </div>
              </div>
            </v-card-text>
          </v-card>

          <!-- No Results -->
          <v-card v-if="!hasAnyResults && !isLoading && !hasErrors" class="text-center pa-8 d-print-none" elevation="2">
            <v-icon size="80" color="grey-lighten-1" class="mb-4">mdi-file-search-outline</v-icon>
            <h3 class="text-h5 mb-2 text-grey-darken-1">ບໍ່ພົບຂໍ້ມູນ</h3>
            <p class="text-body-1 text-grey-darken-1 mb-4">ບໍ່ມີຂໍ້ມູນສໍາລັບເງື່ອນໄຂການຄົ້ນຫາທີ່ລະບຸ</p>
            <v-btn @click="goBack" color="primary" variant="outlined">
              ລອງຄົ້ນຫາໃໝ່
            </v-btn>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import VueApexCharts from 'vue3-apexcharts'

// Router
const router = useRouter()

// State
const isLoading = ref(true)
const isPrinting = ref(false)
const waterReport = ref(null)
const electricReport = ref(null)
const telecomReport = ref(null)
const errors = ref([])
const searchCriteria = ref(null)

// Chart data
const waterChartOptions = ref({})
const waterChartSeries = ref([])
const electricChartOptions = ref({})
const electricChartSeries = ref([])
const printWaterChartOptions = ref({})
const printElectricChartOptions = ref({})

// Computed
const hasErrors = computed(() => errors.value.length > 0)
const hasAnyResults = computed(() => waterReport.value || electricReport.value || telecomReport.value)
const currentTime = computed(() => new Date().toLocaleTimeString('lo-LA'))
const currentYear = computed(() => new Date().getFullYear())
const reportDate = computed(() => {
  if (waterReport.value?.reference_data?.[2]) {
    return waterReport.value.reference_data[2]
  }
  if (electricReport.value?.reference_data?.[2]) {
    return electricReport.value.reference_data[2]
  }
  return new Date().toLocaleDateString('lo-LA')
})

// Methods
const generateRefCode = () => {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `${year}${month}${day}${random}`
}

const getReportTypes = () => {
  const types = []
  if (waterReport.value) types.push('ນໍ້າປະປາ')
  if (electricReport.value) types.push('ໄຟຟ້າ')
  if (telecomReport.value) types.push('ໂທລະຄົມ')
  return types.join(', ') || 'N/A'
}

const getReferenceCode = () => {
  if (waterReport.value?.reference_data?.[0]) {
    return waterReport.value.reference_data[0]
  }
  if (electricReport.value?.reference_data?.[0]) {
    return electricReport.value.reference_data[0]
  }
  return null
}

const getFullName = (customer: any) => {
  const name = customer.Name || ''
  const surname = customer.Surname || ''
  const company = customer.Company_name || ''
  
  if (company) return company
  return `${name} ${surname}`.trim() || 'N/A'
}

const formatCurrency = (amount: number | string) => {
  if (!amount || amount === '0.00') return '0 ກີບ'
  const num = parseFloat(amount.toString())
  return new Intl.NumberFormat('lo-LA', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(num) + ' ກີບ'
}

const getServiceName = (type: string) => {
  const names = {
    water: 'ນໍ້າປະປາ',
    electric: 'ໄຟຟ້າ',
    telecom: 'ໂທລະຄົມ'
  }
  return names[type] || type
}

const getProcessedBills = (bills: any[]) => {
  if (!bills || bills.length === 0) return []

  return bills.map(bill => {
    const outstanding = parseFloat(bill.Outstanding || '0')
    return {
      ...bill,
      totalAmount: (outstanding + parseFloat(bill.Basic_Tax || '0')).toString(),
      status: outstanding > 0 ? 'ບໍ່ທັນຊໍາລະ' : 'ຊໍາລະເເລ້ວ'
    }
  }).sort((a, b) => {
    const dateA = new Date(a.InvoiceMonth.split('-').reverse().join('-'))
    const dateB = new Date(b.InvoiceMonth.split('-').reverse().join('-'))
    return dateB.getTime() - dateA.getTime()
  }).slice(0, 12) // Show last 12 months
}

const printReport = () => {
  isPrinting.value = true
  nextTick(() => {
    setTimeout(() => {
      window.print()
      setTimeout(() => {
        isPrinting.value = false
      }, 1000)
    }, 500)
  })
}

const goBack = () => {
  router.push('/backend/search/utility_search')
}

const refreshSpecificReport = async (type: string) => {
  console.log(`Refreshing ${type} report...`)
}

// Chart preparation - Enhanced for 12 months display
const prepareApexChartData = (bills: any[]) => {
  if (!bills || bills.length === 0) return { categories: [], series: [] }
  
  const processedBills = getProcessedBills(bills).slice(0, 12).reverse()
  const categories = processedBills.map(bill => bill.InvoiceMonth)
  const outstandingData = processedBills.map(bill => parseFloat(bill.Outstanding || '0'))
  const basicTaxData = processedBills.map(bill => parseFloat(bill.Basic_Tax || '0'))
  const totalData = processedBills.map(bill => parseFloat(bill.totalAmount || '0'))
  
  return {
    categories,
    series: [
      {
        name: 'ຄ້າງຊໍາລະ',
        data: outstandingData,
        color: '#ef4444'
      },
      {
        name: 'ພາສີພື້ນຖານ',
        data: basicTaxData,
        color: '#3b82f6'
      },
      {
        name: 'ລວມທັງໝົດ',
        data: totalData,
        color: '#10b981'
      }
    ]
  }
}

const createChartOptions = (title: string, isPrint = false) => ({
  chart: {
    type: 'bar',
    height: isPrint ? 220 : 320,
    toolbar: { 
      show: !isPrint,
      tools: {
        download: true,
        zoom: false,
        zoomin: false,
        zoomout: false,
        pan: false,
        reset: false
      }
    },
    background: '#ffffff',
    fontFamily: 'Noto Sans Lao, Arial, sans-serif',
    animations: {
      enabled: !isPrint,
      speed: 800
    }
  },
  title: {
    text: title,
    align: 'center',
    style: {
      fontSize: isPrint ? '11px' : '15px',
      fontWeight: '600',
      color: '#1e40af',
      fontFamily: 'Noto Sans Lao, Arial, sans-serif'
    }
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: isPrint ? '75%' : '70%',
      borderRadius: 3,
      borderRadiusApplication: 'end',
      dataLabels: {
        position: 'top'
      }
    }
  },
  dataLabels: { 
    enabled: false
  },
  stroke: {
    show: true,
    width: 2,
    colors: ['transparent']
  },
  xaxis: {
    categories: [],
    title: {
      text: 'ເດືອນ / Month',
      offsetY: 0,
      style: { 
        fontSize: isPrint ? '10px' : '12px', 
        fontWeight: '500',
        color: '#6b7280'
      }
    },
    labels: {
      rotate: -45,
      rotateAlways: true,
      style: { 
        fontSize: isPrint ? '8px' : '10px',
        colors: '#374151'
      },
      trim: false
    },
    axisBorder: {
      show: true,
      color: '#d1d5db'
    },
    axisTicks: {
      show: true,
      color: '#d1d5db'
    }
  },
  yaxis: {
    title: {
      text: 'ຈໍານວນເງິນ (ກີບ) / Amount (LAK)',
      style: { 
        fontSize: isPrint ? '10px' : '12px', 
        fontWeight: '500',
        color: '#6b7280'
      }
    },
    labels: {
      style: { 
        fontSize: isPrint ? '8px' : '10px',
        colors: '#374151'
      },
      formatter: (val) => {
        if (val >= 1000000) {
          return (val / 1000000).toFixed(1) + 'M'
        } else if (val >= 1000) {
          return (val / 1000).toFixed(0) + 'K'
        }
        return val.toFixed(0)
      }
    }
  },
  tooltip: {
    enabled: !isPrint,
    theme: 'light',
    y: {
      formatter: (val) => formatCurrency(val.toString())
    },
    style: {
      fontSize: '12px',
      fontFamily: 'Noto Sans Lao, Arial, sans-serif'
    }
  },
  legend: { 
    position: 'top',
    horizontalAlign: 'center',
    fontSize: isPrint ? '9px' : '12px',
    fontWeight: 500,
    labels: {
      colors: '#374151'
    },
    markers: {
      width: 10,
      height: 10,
      radius: 2
    },
    itemMargin: {
      horizontal: 10,
      vertical: 5
    }
  },
  grid: { 
    show: true,
    borderColor: '#e5e7eb',
    strokeDashArray: 3,
    position: 'back',
    xaxis: {
      lines: { show: false }
    },
    yaxis: {
      lines: { show: true }
    },
    padding: {
      top: 0,
      right: 10,
      bottom: 0,
      left: 10
    }
  },
  colors: ['#ef4444', '#3b82f6', '#10b981'],
  states: {
    hover: {
      filter: {
        type: 'lighten',
        value: 0.15
      }
    },
    active: {
      filter: {
        type: 'darken',
        value: 0.15
      }
    }
  }
})

const updateCharts = () => {
  if (waterReport.value?.bill?.length) {
    const chartData = prepareApexChartData(waterReport.value.bill)
    
    // Screen chart
    waterChartOptions.value = {
      ...createChartOptions('ກາຟິກການໃຊ້ນໍ້າປະປາ'),
      xaxis: {
        ...createChartOptions('').xaxis,
        categories: chartData.categories
      }
    }
    
    // Print chart
    printWaterChartOptions.value = {
      ...createChartOptions('', true),
      xaxis: {
        ...createChartOptions('', true).xaxis,
        categories: chartData.categories
      }
    }
    
    waterChartSeries.value = chartData.series
  }
  
  if (electricReport.value?.bill?.length) {
    const chartData = prepareApexChartData(electricReport.value.bill)
    
    // Screen chart
    electricChartOptions.value = {
      ...createChartOptions('ກາຟິກການໃຊ້ໄຟຟ້າ'),
      xaxis: {
        ...createChartOptions('').xaxis,
        categories: chartData.categories
      }
    }
    
    // Print chart
    printElectricChartOptions.value = {
      ...createChartOptions('', true),
      xaxis: {
        ...createChartOptions('', true).xaxis,
        categories: chartData.categories
      }
    }
    
    electricChartSeries.value = chartData.series
  }
}

// Lifecycle
onMounted(() => {
  try {
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token')
    if (!token) {
      router.push('/auth/login')
      return
    }

    const resultsData = sessionStorage.getItem('utilitySearchResults')
    const criteriaData = sessionStorage.getItem('searchCriteria')
    
    if (resultsData) {
      const results = JSON.parse(resultsData)
      waterReport.value = results.water
      electricReport.value = results.electric
      telecomReport.value = results.telecom
      
      if (results.hasErrors) {
        errors.value = results.errors
      }
    }
    
    if (criteriaData) {
      searchCriteria.value = JSON.parse(criteriaData)
    }
    
    if (!resultsData) {
      router.push('/backend/reportutility')
      return
    }
    
    nextTick(() => {
      updateCharts()
    })
    
  } catch (error) {
    console.error('Error loading report data:', error)
    router.push('/backend/reportutility')
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
/* Base Styles */
.report-container {
  min-height: 100vh;
  background: #f8fafc;
  padding: 1rem 0;
}

/* Header Styles */
.report-header {
  border-radius: 12px !important;
  overflow: hidden;
}

.header-section {
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  color: white;
  padding: 1.5rem;
}

.header-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0;
}

.header-subtitle {
  font-size: 0.9rem;
  opacity: 0.9;
  margin-bottom: 0;
}

/* Report Sections */
.report-section {
  border-radius: 8px !important;
  background: white;
  overflow: hidden;
  margin-bottom: 1rem !important;
}

.section-header {
  padding: 1rem 1.2rem;
  font-size: 1rem;
  font-weight: 600;
  color: white;
}

.water-header {
  background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%);
}

.electric-header {
  background: linear-gradient(135deg, #ea580c 0%, #f97316 100%);
}

.report-content {
  padding: 1.2rem;
}

/* Info Section */
.info-section {
  background: #f9fafb;
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1.2rem;
}

.info-title {
  color: #1e40af;
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 0.8rem;
  padding-bottom: 0.4rem;
  border-bottom: 2px solid #e5e7eb;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.8rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 0.4rem 0;
  border-bottom: 1px dotted #e5e7eb;
}

.info-row.full-width {
  grid-column: 1 / -1;
}

.info-label {
  font-size: 0.8rem;
  color: #6b7280;
  font-weight: 500;
}

.info-value {
  font-size: 0.8rem;
  color: #1f2937;
  font-weight: 600;
  text-align: right;
}

/* Table Section */
.table-section {
  margin-top: 1.2rem;
}

.table-title {
  color: #1e40af;
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 0.8rem;
  padding-bottom: 0.4rem;
  border-bottom: 2px solid #e5e7eb;
}

.professional-table {
  overflow-x: auto;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  background: white;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8rem;
}

.data-table thead {
  background: linear-gradient(to bottom, #f9fafb, #f3f4f6);
}

.header-cell {
  padding: 0.6rem;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 2px solid #d1d5db;
  white-space: nowrap;
  font-size: 0.75rem;
}

.data-cell {
  padding: 0.5rem 0.6rem;
  border-bottom: 1px solid #e5e7eb;
  color: #374151;
  font-size: 0.75rem;
}

.data-table tbody tr:hover {
  background: #f9fafb;
}

.text-center {
  text-align: center !important;
}

.text-right {
  text-align: right !important;
}

.text-danger {
  color: #dc2626 !important;
  font-weight: 600;
}

.font-weight-bold {
  font-weight: 700 !important;
}

.status-paid {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  background: #1bc554;
  color: white;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 600;
}

.status-unpaid {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  background: #ff5555;
  color: white;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 600;
}

/* Chart Section - Screen Display */
.chart-section {
  background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%);
  border-radius: 8px;
  padding: 1.2rem;
  margin-top: 1.5rem;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.chart-title {
  color: #1e40af;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e5e7eb;
}

.chart-title::before {
  content: '';
  width: 4px;
  height: 20px;
  background: linear-gradient(to bottom, #1e40af, #3b82f6);
  border-radius: 2px;
}

.chart-container {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border: 1px solid #f0f0f0;
}

/* Print Chart Section */
.print-chart-section {
  margin-top: 12px;
  background: white;
  padding: 8px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  page-break-inside: avoid;
}

.print-chart-title {
  color: #1e40af;
  font-size: 11pt;
  font-weight: 600;
  margin-bottom: 8px;
  text-align: center;
  padding-bottom: 4px;
  border-bottom: 2px solid #e5e7eb;
}

.print-chart-container {
  background: white;
  padding: 6px;
  height: 240px;
  overflow: hidden;
}

/* ApexCharts Custom Styling */
.apexcharts-canvas {
  margin: 0 auto;
}

.apexcharts-legend {
  padding: 8px 0 !important;
}

.apexcharts-legend-series {
  margin: 0 8px !important;
}

.apexcharts-tooltip {
  border-radius: 6px !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}

.apexcharts-tooltip-title {
  background: #f8fafc !important;
  border-bottom: 1px solid #e5e7eb !important;
  font-weight: 600 !important;
}

.apexcharts-xaxis-label,
.apexcharts-yaxis-label {
  fill: #374151 !important;
  font-family: 'Noto Sans Lao', Arial, sans-serif !important;
}

.apexcharts-gridline {
  stroke: #e5e7eb !important;
}

/* Display Control */
.d-screen-block {
  display: block;
}

.d-print-block {
  display: none;
}

/* Footer Section */
.footer-section {
  border-radius: 8px !important;
  background: white;
  margin-top: 1.5rem;
}

.footer-content {
  background: linear-gradient(to bottom, #1f2937, #111827);
  color: white;
  padding: 1.5rem;
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.footer-column {
  padding: 0 0.8rem;
}

.footer-heading {
  font-size: 0.9rem;
  font-weight: 600;
  color: #f3f4f6;
  margin-bottom: 0.8rem;
  padding-bottom: 0.4rem;
  border-bottom: 2px solid #374151;
}

.footer-info {
  font-size: 0.8rem;
}

.footer-text {
  margin-bottom: 0.4rem;
  color: #d1d5db;
  display: flex;
  align-items: center;
}

.footer-disclaimer-text {
  font-size: 0.75rem;
  color: #9ca3af;
  line-height: 1.4;
  margin-bottom: 0.4rem;
  text-align: justify;
}

.footer-bottom {
  border-top: 1px solid #374151;
  padding-top: 0.8rem;
  text-align: center;
}

.signature-text {
  font-size: 0.8rem;
  color: #9ca3af;
  margin: 0;
}

/* Print Button */
.print-fab {
  position: fixed !important;
  bottom: 24px !important;
  right: 24px !important;
  z-index: 100;
}

/* Print Header */
.print-header {
  display: none;
  margin-bottom: 15px;
  border-bottom: 2px solid #1e40af;
  padding-bottom: 10px;
}

.print-header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.print-company-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.print-logo {
  width: 50px;
  height: 50px;
  border-radius: 4px;
}

.print-company-name-lao {
  font-size: 12pt;
  font-weight: bold;
  color: #1e40af;
  margin: 0;
  line-height: 1.2;
}

.print-company-name-eng {
  font-size: 9pt;
  color: #374151;
  margin: 0;
}

.print-reference-section {
  text-align: right;
  font-size: 8pt;
  color: #6b7280;
}

.print-reference-item {
  margin-bottom: 3px;
}

.print-reference-item strong {
  color: #374151;
}

/* Responsive Design */
@media (max-width: 960px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .footer-grid {
    grid-template-columns: 1fr;
  }

  .chart-section {
    padding: 1rem;
  }
  
  .chart-container {
    padding: 0.8rem;
  }
}

@media (max-width: 600px) {
  .header-title {
    font-size: 1.1rem;
  }
  
  .professional-table {
    font-size: 0.7rem;
  }
  
  .header-cell,
  .data-cell {
    padding: 0.4rem;
  }

  .chart-section {
    padding: 0.8rem;
    margin-top: 1rem;
  }
  
  .chart-title {
    font-size: 0.9rem;
  }
  
  .chart-container {
    padding: 0.6rem;
  }
}

/* Print Styles - Major Optimizations */
@media print {
  @page {
    size: A4 landscape;
    margin: 8mm;
  }
  
  body {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }
  
  .report-container {
    background: white !important;
    padding: 0 !important;
  }
  
  .v-container {
    padding: 0 !important;
    max-width: 100% !important;
  }
  
  .d-print-none {
    display: none !important;
  }
  
  .d-print-block {
    display: block !important;
  }

  .d-screen-block {
    display: none !important;
  }
  
  /* Print Header */
  .print-header {
    display: block;
    margin-bottom: 12px;
  }
  
  /* Reduce spacing throughout */
  .report-section {
    margin-bottom: 8px !important;
    box-shadow: none !important;
    border: 1px solid #d1d5db !important;
  }
  
  .section-header {
    background: #f8fafc !important;
    color: #1e40af !important;
    font-size: 10pt !important;
    padding: 6px 10px !important;
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }
  
  .water-header {
    background: #f0f9ff !important;
    color: #075985 !important;
  }
  
  .electric-header {
    background: #fef3c7 !important;
    color: #92400e !important;
  }
  
  .report-content {
    padding: 10px !important;
  }
  
  /* Info Section Optimization */
  .info-section {
    background: #fafafa !important;
    padding: 8px !important;
    margin-bottom: 8px !important;
  }
  
  .info-title {
    font-size: 9pt !important;
    margin-bottom: 6px !important;
    padding-bottom: 3px !important;
  }
  
  .info-row {
    padding: 2px 0 !important;
  }
  
  .info-label,
  .info-value {
    font-size: 8pt !important;
  }
  
  /* Table Optimization */
  .table-section {
    margin-top: 8px !important;
  }
  
  .table-title {
    font-size: 9pt !important;
    margin-bottom: 6px !important;
    padding-bottom: 3px !important;
  }
  
  .professional-table {
    page-break-inside: avoid;
    font-size: 7pt !important;
  }
  
  .data-table {
    font-size: 7pt !important;
  }
  
  .header-cell {
    background: #f8fafc !important;
    font-size: 7pt !important;
    padding: 4px !important;
    line-height: 1.2;
  }
  
  .data-cell {
    font-size: 7pt !important;
    padding: 3px 4px !important;
    line-height: 1.3;
  }

  /* Print Chart Section */
  .print-chart-section {
    margin-top: 10px !important;
    background: white !important;
    padding: 6px !important;
    border: 1px solid #d1d5db !important;
    page-break-inside: avoid !important;
  }

  .print-chart-title {
    font-size: 10pt !important;
    margin-bottom: 6px !important;
    color: #1e40af !important;
    padding-bottom: 3px !important;
    border-bottom: 1.5px solid #d1d5db !important;
  }

  .print-chart-container {
    padding: 4px !important;
    border: none !important;
    height: 240px !important;
    overflow: visible !important;
  }

  /* ApexCharts Print Adjustments */
  .apexcharts-svg {
    max-height: 230px !important;
    width: 100% !important;
  }

  .apexcharts-canvas {
    background: white !important;
  }

  .apexcharts-title-text {
    font-size: 9px !important;
    fill: #1e40af !important;
  }

  .apexcharts-legend {
    padding: 4px 0 !important;
  }

  .apexcharts-legend-text {
    font-size: 8px !important;
    fill: #374151 !important;
  }

  .apexcharts-xaxis-label,
  .apexcharts-yaxis-label {
    font-size: 7px !important;
    fill: #374151 !important;
  }

  .apexcharts-xaxis-title-text,
  .apexcharts-yaxis-title-text {
    font-size: 8px !important;
    fill: #6b7280 !important;
  }

  .apexcharts-gridline {
    stroke: #e5e7eb !important;
    stroke-dasharray: 3 !important;
  }

  /* Ensure colors print correctly */
  .apexcharts-bar-area,
  .apexcharts-series path {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  
  /* Status Badges */
  .status-paid,
  .status-unpaid {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
    font-size: 6pt !important;
    padding: 1px 4px !important;
  }
  
  /* Footer Optimization */
  .footer-section {
    margin-top: 10px !important;
    page-break-inside: avoid;
  }
  
  .footer-content {
    background: white !important;
    color: #374151 !important;
    border: 1px solid #d1d5db !important;
    padding: 10px !important;
  }
  
  .footer-grid {
    gap: 10px !important;
    margin-bottom: 8px !important;
  }
  
  .footer-heading {
    color: #1e40af !important;
    font-size: 8pt !important;
    margin-bottom: 5px !important;
    padding-bottom: 2px !important;
    border-bottom: 1px solid #d1d5db !important;
  }
  
  .footer-text {
    color: #374151 !important;
    font-size: 7pt !important;
    margin-bottom: 2px !important;
  }
  
  .footer-disclaimer-text {
    color: #6b7280 !important;
    font-size: 6pt !important;
    line-height: 1.3;
    margin-bottom: 2px !important;
  }
  
  .footer-bottom {
    padding-top: 5px !important;
  }
  
  .signature-text {
    color: #6b7280 !important;
    font-size: 7pt !important;
  }
  
  /* Remove card shadows and unnecessary styling */
  .v-card {
    box-shadow: none !important;
  }
  
  /* Ensure proper text rendering */
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
}

/* Utility Classes */
.gap-2 {
  gap: 0.5rem;
}

.d-none {
  display: none !important;
}
</style>