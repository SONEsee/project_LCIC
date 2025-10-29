<template>
  <div class="water-upload-minimal">
    <!-- 1. HEADER -->
    <header class="minimal-header">
      <div class="container">
        <div class="header-content">
          <div class="title-section">
            <v-icon color="primary" size="32">mdi-water</v-icon>
            <div class="title-text">
              <h1>ລະບົບອັບໂຫຼດນໍ້າປະປາ</h1>
              <p>Electric Upload System</p>
            </div>
          </div>

          <div class="header-controls">
            <v-select
              v-model="selectedMonth"
              :items="monthOptions"
              item-title="label"
              item-value="value"
              label="ເລືອກເດືອນ"
              variant="outlined"
              density="compact"
              hide-details
              style="min-width: 200px;"
            />

            <v-btn
              color="primary"
              variant="flat"
              :loading="loading"
              @click="handleLoadData"
            >
              <v-icon start size="18">mdi-refresh</v-icon>
              ໂຫຼດຂໍ້ມູນ
            </v-btn>

            <v-btn
              color="success"
              variant="flat"
              :loading="uploading"
              :disabled="!selectedMonth"
              @click="handleUploadAll"
            >
              <v-icon start size="18">mdi-upload</v-icon>
              ອັບໂຫຼດທຸກແຂວງ
            </v-btn>
            <v-btn 
              color="warning"
              variant="flat"
              @click="downloadutility">
              <v-icon start size="16">mdi-download</v-icon>
              ດາວໂຫຼດ Manual
             </v-btn>

            <v-btn
              variant="text"
              icon
              @click="toggleView"
            >
              <v-icon>{{ viewIcon }}</v-icon>
            </v-btn>

          </div>
        </div>
      </div>
    </header>

    <!-- 2. SUMMARY CARDS -->
    <section class="summary-section" v-show="!isMinimalView">
      <div class="container">
        <h2 class="section-title">ສະຫຼຸບລວມ - {{ formatMonth(selectedMonth) }}</h2>

        <div class="summary-grid">
          <div class="summary-card stat-blue">
            <v-icon size="40" color="#3b82f6">mdi-map-marker-multiple</v-icon>
            <div class="card-content">
              <div class="card-value">{{ stats.totalProvinces }}</div>
              <div class="card-label">ແຂວງທັງໝົດ</div>
            </div>
          </div>

          <div class="summary-card stat-green">
            <v-icon size="40" color="#22c55e">mdi-check-circle</v-icon>
            <div class="card-content">
              <div class="card-value">{{ stats.completedDistricts }} / {{ stats.totalDistricts }}</div>
              <div class="card-label">ເມືອງສຳເລັດ</div>
            </div>
          </div>

          <div class="summary-card stat-purple">
            <v-icon size="40" color="#a855f7">mdi-file-document-multiple</v-icon>
            <div class="card-content">
              <div class="card-value">{{ formatNumber(stats.totalRecords) }}</div>
              <div class="card-label">ບັນທຶກທັງໝົດ</div>
            </div>
          </div>

          <div class="summary-card stat-orange">
            <v-icon size="40" color="#f97316">mdi-clock-outline</v-icon>
            <div class="card-content">
              <div class="card-value-small">{{ currentDateTime }}</div>
              <div class="card-label">ອັບເດດລ່າສຸດ</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 3. PROVINCE/DISTRICT TREE VIEW -->
    <section class="results-section">
      <div class="container">
        <div v-if="provinceData.length === 0" class="empty-state">
          <v-icon size="80" color="grey-lighten-1">mdi-database-outline</v-icon>
          <h3>ບໍ່ມີຂໍ້ມູນ</h3>
          <p>ກະລຸນາເລືອກເດືອນ ແລະ ກົດປຸ່ມ "ໂຫຼດຂໍ້ມູນ"</p>
          <v-btn
            color="primary"
            variant="flat"
            size="large"
            :loading="loading"
            @click="handleLoadData"
            class="mt-4"
          >
            <v-icon start size="20">mdi-refresh</v-icon>
            ໂຫຼດຂໍ້ມູນ
          </v-btn>

        </div>

        <div v-else class="tree-view">
          <v-card flat class="tree-card">
            <v-card-title class="tree-header">
              <span>ລາຍລະອຽດແຂວງ ແລະ ເມືອງ</span>
              <v-chip size="small" color="primary" variant="tonal">
                {{ formatMonth(selectedMonth) }}
              </v-chip>
            </v-card-title>
            
            <v-card-text class="tree-content">
              <div 
                v-for="province in provinceData" 
                :key="province.id"
                class="province-item"
              >
                <div 
                  class="province-header"
                  @click="toggleProvince(province.id)"
                >
                  <div class="province-info">
                    <v-icon size="20">
                      {{ province.expanded ? 'mdi-chevron-down' : 'mdi-chevron-right' }}
                    </v-icon>
                    <v-icon size="20" color="primary">mdi-map</v-icon>
                    <span class="province-name">
                      Province {{ province.name }} ({{ province.code }})
                    </span>
                  </div>
                  <div class="province-stats">
                    <v-chip size="small" color="info" variant="flat">
                      {{ province.districts.length }} ເມືອງ
                    </v-chip>
                  </div>
                </div>

                <v-expand-transition>
                  <div v-show="province.expanded" class="districts-container">
                    <div 
                      v-for="district in province.districts" 
                      :key="district.dis_id"
                      class="district-item"
                    >
                      <div class="district-info">
                        <v-icon size="16" color="success">mdi-arrow-right</v-icon>
                        <span class="district-name">
                          District {{ district.dis_name }} ({{ district.dis_id }})
                        </span>
                      </div>
                      <div class="district-stats">
                        <v-chip size="small" color="primary" variant="tonal" class="mr-2 stat-chip">
                          Bills: {{ formatNumber(district.total_bills) }}
                        </v-chip>
                        <v-chip size="small" color="success" variant="tonal" class="stat-chip">
                          Customers: {{ formatNumber(district.total_customers) }}
                        </v-chip>
                      </div>
                    </div>
                  </div>
                </v-expand-transition>
              </div>
            </v-card-text>
          </v-card>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useApi } from '~/composables/usewatersupplyApi'
import Swal from 'sweetalert2'

// Page Meta
definePageMeta({
  middleware: 'auth',
  layout: 'backend',
})

// ============================================================================
// INTERFACES
// ============================================================================
interface MonthOption {
  label: string
  value: string
}

interface District {
  dis_id: string
  dis_name: string
  pro_id: string
  pro_name: string
  total_bills: number
  total_customers: number
  status: string
  upload_month?: string
  last_updated?: string
}

interface Province {
  id: string
  code: string
  name: string
  expanded: boolean
  districts: District[]
}

interface Stats {
  totalProvinces: number
  totalDistricts: number
  completedDistricts: number
  totalRecords: number
}

// ============================================================================
// COMPOSABLES
// ============================================================================
const api = useApi()

// ============================================================================
// STATE
// ============================================================================
const selectedMonth = ref<string>('')
const loading = ref<boolean>(false)
const uploading = ref<boolean>(false)
const currentDateTime = ref<string>('')
const dateTimeInterval = ref<ReturnType<typeof setInterval> | null>(null)
const isMinimalView = ref<boolean>(false)

const stats = ref<Stats>({
  totalProvinces: 0,
  totalDistricts: 0,
  completedDistricts: 0,
  totalRecords: 0,
})

const districtStats = ref<District[]>([])
const provinceData = ref<Province[]>([])

// ============================================================================
// COMPUTED
// ============================================================================
const viewIcon = computed(() => isMinimalView.value ? 'mdi-eye' : 'mdi-eye-off')

const monthOptions = computed<MonthOption[]>(() => {
  const options: MonthOption[] = []
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1

  const monthNames: Record<string, string> = {
    '01': 'ມັງກອນ',
    '02': 'ກຸມພາ',
    '03': 'ມີນາ',
    '04': 'ເມສາ',
    '05': 'ພຶດສະພາ',
    '06': 'ມິຖຸນາ',
    '07': 'ກໍລະກົດ',
    '08': 'ສິງຫາ',
    '09': 'ກັນຍາ',
    '10': 'ຕຸລາ',
    '11': 'ພະຈິກ',
    '12': 'ທັນວາ',
  }

  for (let i = 0; i < 24; i++) {
    let month = currentMonth - i
    let year = currentYear
    
    while (month <= 0) {
      month += 12
      year -= 1
    }
    
    const monthStr = String(month).padStart(2, '0')
    const value = `${monthStr}${year}`
    const label = `${monthNames[monthStr]} ${year}`
    options.push({ label, value })
  }

  return options
})

// ============================================================================
// LIFECYCLE
// ============================================================================
onMounted(() => {
  updateDateTime()
  dateTimeInterval.value = setInterval(updateDateTime, 1000)

  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const year = now.getFullYear()
  selectedMonth.value = `${month}${year}`
  
  // Auto-load data on mount
  handleLoadData()
})

onUnmounted(() => {
  if (dateTimeInterval.value) {
    clearInterval(dateTimeInterval.value)
  }
})

// ============================================================================
// METHODS
// ============================================================================
const showNotification = (text: string, color: string = 'success'): void => {
  const iconMap: Record<string, 'success' | 'error' | 'warning' | 'info'> = {
    success: 'success',
    error: 'error',
    warning: 'warning',
    info: 'info'
  }
  
  Swal.fire({
    icon: iconMap[color] || 'info',
    title: text,
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    customClass: {
      popup: 'minimal-toast'
    }
  })
}

const updateDateTime = (): void => {
  const now = new Date()
  const options: Intl.DateTimeFormatOptions = {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }
  currentDateTime.value = now.toLocaleString('en-US', options)
}

const handleLoadData = async (): Promise<void> => {
  if (!selectedMonth.value) {
    showNotification('ກະລຸນາເລືອກເດືອນກ່ອນ', 'warning')
    return
  }
  
  loading.value = true

  try {
    const { data, error } = await api.waterSupply.getDistrictStatistics(selectedMonth.value)
    
    if (error) {
      throw error
    }

    districtStats.value = Array.isArray(data) ? data : []
    organizeDataByProvince()
    calculateStats()
    showNotification('ໂຫຼດຂໍ້ມູນສຳເລັດ', 'success')
  } catch (error) {
    console.error('Error loading data:', error)
    districtStats.value = []
    provinceData.value = []
    showNotification(
      `ຜິດພາດໃນການໂຫຼດຂໍ້ມູນ: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'error'
    )
  } finally {
    loading.value = false
  }
}

const handleUploadAll = async (): Promise<void> => {
  if (!selectedMonth.value) {
    showNotification('ກະລຸນາເລືອກເດືອນກ່ອນ', 'warning')
    return
  }
  
  // Show loading with Sweetalert2
  Swal.fire({
    title: 'ກຳລັງອັບໂຫຼດ...',
    html: 'ກະລຸນາລໍຖ້າ ກຳລັງປະມວນຜົນຂໍ້ມູນ',
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => {
      Swal.showLoading()
    },
    customClass: {
      popup: 'minimal-loading'
    }
  })

  try {
    const { data, error } = await api.waterSupply.upload(selectedMonth.value, 'system')
    
    if (error) {
      throw error
    }

    Swal.fire({
      icon: 'success',
      title: 'ສຳເລັດ!',
      text: 'ອັບໂຫຼດຂໍ້ມູນສຳເລັດແລ້ວ',
      confirmButtonText: 'ຕົກລົງ',
      customClass: {
        popup: 'minimal-success',
        confirmButton: 'minimal-btn'
      }
    })
    
    await handleLoadData()
  } catch (error) {
    console.error('Error uploading:', error)
    Swal.fire({
      icon: 'error',
      title: 'ຜິດພາດ!',
      text: `ບໍ່ສາມາດອັບໂຫຼດໄດ້: ${error instanceof Error ? error.message : 'Unknown error'}`,
      confirmButtonText: 'ຕົກລົງ',
      customClass: {
        popup: 'minimal-error',
        confirmButton: 'minimal-btn'
      }
    })
  }
}

const organizeDataByProvince = (): void => {
  const provinceMap = new Map<string, Province>()
  
  districtStats.value.forEach((district) => {
    const provinceId = district.pro_id
    
    if (!provinceMap.has(provinceId)) {
      provinceMap.set(provinceId, {
        id: provinceId,
        code: provinceId,
        name: district.pro_name,
        expanded: false,
        districts: []
      })
    }
    
    provinceMap.get(provinceId)?.districts.push(district)
  })
  
  provinceData.value = Array.from(provinceMap.values()).sort((a, b) => 
    a.code.localeCompare(b.code)
  )
}
const downloadutility = () => {
   window.location.href = '/test10'
}
const toggleProvince = (provinceId: string): void => {
  const province = provinceData.value.find(p => p.id === provinceId)
  if (province) {
    province.expanded = !province.expanded
  }
}

const calculateStats = (): void => {
  if (!districtStats.value || districtStats.value.length === 0) {
    stats.value = {
      totalProvinces: 0,
      totalDistricts: 0,
      completedDistricts: 0,
      totalRecords: 0
    }
    return
  }

  const provinces = new Set(districtStats.value.map(d => d.pro_id))
  const completedDistricts = districtStats.value.filter(
    d => d.status === 'completed'
  ).length
  const totalBills = districtStats.value.reduce(
    (sum, d) => sum + (d.total_bills || 0), 0
  )
  const totalCustomers = districtStats.value.reduce(
    (sum, d) => sum + (d.total_customers || 0), 0
  )

  stats.value = {
    totalProvinces: provinces.size,
    totalDistricts: districtStats.value.length,
    completedDistricts,
    totalRecords: totalBills + totalCustomers,
  }
}

const formatNumber = (num?: number): string => {
  return (num || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const formatMonth = (month: string): string => {
  if (!month || month.length < 4) return ''
  
  const monthMap: Record<string, string> = {
    '01': 'ມັງກອນ',
    '02': 'ກຸມພາ',
    '03': 'ມີນາ',
    '04': 'ເມສາ',
    '05': 'ພຶດສະພາ',
    '06': 'ມິຖຸນາ',
    '07': 'ກໍລະກົດ',
    '08': 'ສິງຫາ',
    '09': 'ກັນຍາ',
    '10': 'ຕຸລາ',
    '11': 'ພະຈິກ',
    '12': 'ທັນວາ',
  }
  
  const monthStr = month.substring(0, 2)
  const yearStr = month.substring(2)
  return `${monthMap[monthStr] || monthStr} ${yearStr}`
}

const toggleView = (): void => {
  isMinimalView.value = !isMinimalView.value
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.water-upload-minimal {
  min-height: 100vh;
  background: #f5f7fa;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
}

/* ============================================================================ */
/* HEADER */
/* ============================================================================ */
.minimal-header {
  background: white;
  border-bottom: 1px solid #e0e4e8;
  padding: 16px 0;
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}

.title-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.title-text h1 {
  font-size: 20px;
  font-weight: 600;
  color: #1a202c;
  margin: 0;
  line-height: 1.2;
}

.title-text p {
  font-size: 13px;
  color: #718096;
  margin: 0;
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  flex-wrap: wrap;
}

/* ============================================================================ */
/* SUMMARY SECTION */
/* ============================================================================ */
.summary-section {
  padding: 32px 0;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 20px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
}

.summary-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 1px solid #e5e7eb;
}

.summary-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
}

.stat-blue {
  background: #eff6ff;
  border-left: 4px solid #3b82f6;
}

.stat-green {
  background: #f0fdf4;
  border-left: 4px solid #22c55e;
}

.stat-purple {
  background: #faf5ff;
  border-left: 4px solid #a855f7;
}

.stat-orange {
  background: #fff7ed;
  border-left: 4px solid #f97316;
}

.card-content {
  flex: 1;
}

.card-value {
  font-size: 32px;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 8px;
  color: #1f2937;
}

.card-value-small {
  font-size: 16px;
  font-weight: 600;
  line-height: 1.2;
  margin-bottom: 8px;
  word-break: break-all;
  color: #1f2937;
}

.card-label {
  font-size: 14px;
  opacity: 0.8;
  font-weight: 500;
  color: #6b7280;
}

/* ============================================================================ */
/* TREE VIEW SECTION */
/* ============================================================================ */
.results-section {
  padding: 0 0 48px 0;
}

.empty-state {
  background: white;
  border-radius: 12px;
  padding: 80px 40px;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.empty-state h3 {
  font-size: 24px;
  color: #2d3748;
  margin: 16px 0 8px 0;
  font-weight: 600;
}

.empty-state p {
  font-size: 14px;
  color: #718096;
  margin: 0 0 24px 0;
}

.tree-card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  background: white;
}

.tree-header {
  background: white;
  border-bottom: 1px solid #e0e4e8;
  padding: 16px 24px !important;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px !important;
  font-weight: 600 !important;
  color: #2d3748;
}

.tree-content {
  padding: 24px !important;
  background: #fafafa;
  max-height: 600px;
  overflow-y: auto;
}

/* ============================================================================ */
/* PROVINCE AND DISTRICT ITEMS */
/* ============================================================================ */
.province-item {
  margin-bottom: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  overflow: hidden;
}

.province-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: linear-gradient(to right, #f7fafc, #fff);
  cursor: pointer;
  transition: background 0.2s ease;
}

.province-header:hover {
  background: linear-gradient(to right, #e6f2ff, #f7fafc);
}

.province-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.province-name {
  font-weight: 600;
  color: #2d3748;
  font-size: 15px;
}

.province-stats {
  display: flex;
  gap: 8px;
}

.districts-container {
  padding: 8px 16px 16px 48px;
  background: #f8f9fa;
  border-top: 1px solid #e2e8f0;
}

.district-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  margin: 8px 0;
  background: white;
  border-radius: 6px;
  border-left: 3px solid #48bb78;
  transition: all 0.2s ease;
}

.district-item:hover {
  background: #f0f9ff;
  transform: translateX(4px);
}

.district-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.district-name {
  font-size: 14px;
  color: #4a5568;
}

.district-stats {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Increased text size for bill and customer counts */
.stat-chip {
  font-size: 13px !important;
  font-weight: 600 !important;
  padding: 6px 12px !important;
  height: auto !important;
}

/* ============================================================================ */
/* SWEETALERT2 CUSTOM STYLES */
/* ============================================================================ */
:global(.minimal-toast) {
  font-family: inherit;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

:global(.minimal-loading),
:global(.minimal-success),
:global(.minimal-error) {
  font-family: inherit;
  border-radius: 12px;
  padding: 24px;
}

:global(.minimal-btn) {
  background: #3b82f6 !important;
  border-radius: 8px;
  padding: 10px 24px;
  font-weight: 500;
  text-transform: none;
  color: white !important;
}

:global(.minimal-btn:hover) {
  background: #2563eb !important;
}

/* ============================================================================ */
/* VUETIFY OVERRIDES */
/* ============================================================================ */
:deep(.v-btn) {
  text-transform: none !important;
  font-weight: 500;
  letter-spacing: 0;
}

:deep(.v-chip) {
  font-weight: 500;
}

:deep(.v-select .v-field) {
  background: white;
}

/* ============================================================================ */
/* SCROLLBAR STYLING */
/* ============================================================================ */
.tree-content::-webkit-scrollbar {
  width: 8px;
}

.tree-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.tree-content::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 4px;
}

.tree-content::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}

/* ============================================================================ */
/* RESPONSIVE */
/* ============================================================================ */
@media (max-width: 768px) {
  .container {
    padding: 0 16px;
  }

  .header-content {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }

  .title-section {
    justify-content: center;
  }

  .header-controls {
    justify-content: flex-start;
  }

  .summary-grid {
    grid-template-columns: 1fr;
  }

  .card-value {
    font-size: 28px;
  }

  .districts-container {
    padding-left: 32px;
  }
}

@media (max-width: 480px) {
  .header-controls {
    flex-direction: column;
    width: 100%;
  }
  
  .header-controls > * {
    width: 100%;
  }
  
  .title-text h1 {
    font-size: 18px;
  }
  
  .card-value {
    font-size: 24px;
  }

  .district-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .district-stats {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
  }
  
  .stat-chip {
    width: 100%;
    justify-content: center;
  }
}
</style>