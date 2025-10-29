<template>
  <div class="water-supply-summary-dashboard">
    <!-- Header Section -->
    <div class="dashboard-header">
      <div class="container">
        <div class="header-content">
          <div class="header-title">
            <v-icon class="header-icon" size="24">mdi-water</v-icon>
            <div>
              <h1 class="title-text">ສະຫຼຸບການໂຫຼດນ້ຳປະປາ</h1>
              <p class="subtitle-text">ແດັຊບອດການວິເຄາະ ແລະ ລາຍງານລະບົບນ້ຳປະປາ</p>
            </div>
          </div>
          
          <!-- Export Actions -->
          <div class="header-actions">
            <v-btn
              color="success"
              variant="flat"
              prepend-icon="mdi-file-excel"
              @click="exportData"
              :loading="exporting"
              size="small"
            >
              ສົ່ງອອກລາຍງານ
            </v-btn>
            <v-btn
              color="primary"
              variant="tonal"
              prepend-icon="mdi-refresh"
              @click="refreshAllData"
              :loading="loading"
              size="small"
            >
              ໂຫຼດໃໝ່
            </v-btn>
          </div>
        </div>
      </div>
    </div>

    <!-- Debug Panel (Remove in production) -->
    <div v-if="debugMode" class="debug-panel">
      <div class="container">
        <v-card class="mb-4">
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-2">mdi-bug</v-icon>
            Debug Information
            <v-spacer />
            <v-btn 
              size="small" 
              @click="debugMode = false" 
              icon="mdi-close"
              variant="text"
            />
          </v-card-title>
          <v-card-text>
            <v-tabs v-model="debugTab">
              <v-tab value="api">API Info</v-tab>
              <v-tab value="data">Data State</v-tab>
              <v-tab value="computed">Computed Values</v-tab>
            </v-tabs>
            
            <v-tabs-window v-model="debugTab">
              <v-tabs-window-item value="api">
                <pre class="debug-content">{{ JSON.stringify(debugInfo, null, 2) }}</pre>
              </v-tabs-window-item>
              
              <v-tabs-window-item value="data">
                <div class="debug-content">
                  <h4>summaryData.value:</h4>
                  <pre>{{ JSON.stringify(summaryData, null, 2) }}</pre>
                  
                  <h4>monthDetail.value:</h4>
                  <pre>{{ JSON.stringify(monthDetail, null, 2) }}</pre>
                </div>
              </v-tabs-window-item>
              
              <v-tabs-window-item value="computed">
                <div class="debug-content">
                  <h4>overviewMetrics:</h4>
                  <pre>{{ JSON.stringify(overviewMetrics, null, 2) }}</pre>
                  
                  <h4>Monthly Breakdown Count:</h4>
                  <p>{{ summaryData.monthly_breakdown?.length || 0 }} items</p>
                  
                  <h4>Recent Activity Count:</h4>
                  <p>{{ summaryData.recent_activity?.length || 0 }} items</p>
                </div>
              </v-tabs-window-item>
            </v-tabs-window>
          </v-card-text>
        </v-card>
      </div>
    </div>

    <!-- Filters Section -->
    <div class="filters-section">
      <div class="container">
        <v-card class="filter-card">
          <v-card-title class="filter-title">
            <v-icon class="mr-2" size="18">mdi-filter-variant</v-icon>
            ຕົວກອງ ແລະ ໄລຍະເວລາ
          </v-card-title>
          <v-card-text class="filter-content">
            <v-row dense>
              <v-col cols="12" md="3">
                <v-select
                  v-model="filters.viewType"
                  :items="viewTypes"
                  item-title="title"
                  item-value="value"
                  label="ມຸມມອງສະຫຼຸບ"
                  variant="outlined"
                  density="compact"
                  prepend-inner-icon="mdi-view-dashboard"
                  @update:model-value="onViewTypeChange"
                />
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  v-model="filters.startMonth"
                  label="ເດືອນເລີ່ມຕົ້ນ"
                  placeholder="012024"
                  variant="outlined"
                  density="compact"
                  prepend-inner-icon="mdi-calendar-start"
                  :rules="monthRules"
                />
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  v-model="filters.endMonth"
                  label="ເດືອນສິ້ນສຸດ"
                  placeholder="122024"
                  variant="outlined"
                  density="compact"
                  prepend-inner-icon="mdi-calendar-end"
                  :rules="monthRules"
                />
              </v-col>
              <v-col cols="12" md="2">
                <v-text-field
                  v-model="filters.specificMonth"
                  label="ເດືອນສະເພາະ"
                  placeholder="122024"
                  variant="outlined"
                  density="compact"
                  prepend-inner-icon="mdi-calendar-month"
                  :rules="monthRules"
                  :disabled="filters.viewType === 'overview'"
                />
              </v-col>
              <v-col cols="12" md="1">
                <div class="action-buttons">
                  <v-btn
                    color="primary"
                    size="small"
                    block
                    @click="applyFilters"
                    :loading="loading"
                    class="mb-1"
                  >
                    ນຳໃຊ້
                  </v-btn>
                  <v-btn
                    color="grey"
                    variant="outlined"
                    size="small"
                    block
                    @click="resetFilters"
                    :disabled="loading"
                  >
                    ລ້າງ
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </div>
    </div>

    <!-- Error Alert -->
    <div v-if="error" class="container">
      <v-alert type="error" variant="tonal" class="mb-4">
        {{ error }}
      </v-alert>
    </div>

    <!-- Main Dashboard Content -->
    <div class="dashboard-content">
      <div class="container">
        <!-- Overview Section -->
        <div v-if="filters.viewType === 'overview'" class="overview-section">
          <!-- Metrics Cards -->
          <v-row class="mb-4" dense>
            <v-col cols="12" md="3" v-for="metric in overviewMetrics" :key="metric.title">
              <v-card class="metric-card" :class="`metric-${metric.color}`">
                <v-card-text class="metric-card-content">
                  <div class="metric-content">
                    <v-icon :color="metric.color" size="20" class="metric-icon">{{ metric.icon }}</v-icon>
                    <div class="metric-details">
                      <div class="metric-value">{{ metric.value }}</div>
                      <div class="metric-title">{{ metric.title }}</div>
                      <div v-if="metric.subtitle" class="metric-subtitle">{{ metric.subtitle }}</div>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <!-- Charts Row -->
          <v-row class="mb-4" dense>
            <v-col cols="12" md="8">
              <v-card class="chart-card">
                <v-card-title class="chart-title">
                  <v-icon class="mr-2" size="18">mdi-chart-line</v-icon>
                  ແນວໂນ້ມການອັບໂຫຼດລາຍເດືອນ
                </v-card-title>
                <v-card-text class="chart-content">
                  <div class="chart-container">
                    <canvas ref="trendsChart" height="280"></canvas>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" md="4">
              <v-card class="chart-card">
                <v-card-title class="chart-title">
                  <v-icon class="mr-2" size="18">mdi-chart-donut</v-icon>
                  ການແຈກຢາຍສະຖານະການອັບໂຫຼດ
                </v-card-title>
                <v-card-text class="chart-content">
                  <div class="chart-container">
                    <canvas ref="statusChart" height="280"></canvas>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <!-- Monthly Breakdown Table -->
          <v-card class="data-table-card">
            <v-card-title class="table-title">
              <v-icon class="mr-2" size="18">mdi-calendar-month</v-icon>
              ການແບ່ງແຍກຕາມເດືອນ
            </v-card-title>
            <v-data-table
              :headers="monthlyHeaders"
              :items="summaryData.monthly_breakdown || []"
              :loading="loading"
              class="elevation-0 custom-table"
              density="compact"
              :items-per-page="12"
            >
              <template v-slot:item.total_records="{ item }">
                <span class="font-weight-bold">{{ formatNumber(item.total_records) }}</span>
              </template>
              <template v-slot:item.total_data_size_mb="{ item }">
                <span>{{ formatFileSize(item.total_data_size_mb) }}</span>
              </template>
              <template v-slot:item.avg_success_rate="{ item }">
                <v-chip
                  :color="getSuccessColor(item.avg_success_rate)"
                  size="small"
                  variant="flat"
                  class="success-chip"
                >
                  {{ item.avg_success_rate }}%
                </v-chip>
              </template>
              <template v-slot:item.latest_upload="{ item }">
                <span v-if="item.latest_upload">{{ formatDateTime(item.latest_upload) }}</span>
                <span v-else class="text-medium-emphasis">-</span>
              </template>
              <template v-slot:item.actions="{ item }">
                <v-btn
                  icon="mdi-eye"
                  size="x-small"
                  variant="text"
                  @click="viewMonthDetail(item.upload_month)"
                />
              </template>
            </v-data-table>
          </v-card>

          <!-- Recent Activity -->
          <v-card class="data-table-card">
            <v-card-title class="table-title">
              <v-icon class="mr-2" size="18">mdi-clock-outline</v-icon>
              ກິດຈະກຳການອັບໂຫຼດລ່າສຸດ
            </v-card-title>
            <v-data-table
              :headers="activityHeaders"
              :items="summaryData.recent_activity || []"
              :loading="loading"
              class="elevation-0 custom-table"
              :items-per-page="10"
              density="compact"
            >
              <template v-slot:item.total_records="{ item }">
                <span class="font-weight-bold">{{ formatNumber(item.total_records) }}</span>
              </template>
              <template v-slot:item.data_size_mb="{ item }">
                <span>{{ formatFileSize(item.data_size_mb) }}</span>
              </template>
              <template v-slot:item.success_rate="{ item }">
                <v-chip
                  :color="getSuccessColor(item.success_rate)"
                  size="small"
                  variant="flat"
                  class="success-chip"
                >
                  {{ item.success_rate }}%
                </v-chip>
              </template>
              <template v-slot:item.status="{ item }">
                <v-chip
                  :color="getStatusColor(item.status)"
                  size="small"
                  variant="flat"
                  class="status-chip"
                >
                  {{ formatStatus(item.status) }}
                </v-chip>
              </template>
              <template v-slot:item.upload_completed="{ item }">
                <span v-if="item.upload_completed">{{ formatDateTime(item.upload_completed) }}</span>
                <span v-else class="text-medium-emphasis">-</span>
              </template>
              <template v-slot:item.upload_duration="{ item }">
                <span v-if="item.upload_duration">{{ formatDuration(item.upload_duration) }}</span>
                <span v-else class="text-medium-emphasis">-</span>
              </template>
            </v-data-table>
          </v-card>
        </div>

        <!-- Month Detail View -->
        <div v-if="filters.viewType === 'month'" class="month-section">
          <div v-if="monthDetail">
            <!-- Month Summary Header -->
            <v-row class="mb-4" dense>
              <v-col cols="12">
                <v-card class="month-header-card">
                  <v-card-text class="header-card-content">
                    <div class="d-flex align-center justify-space-between">
                      <div class="d-flex align-center">
                        <v-icon color="primary" size="24" class="mr-3">mdi-calendar-month</v-icon>
                        <div>
                          <h2 class="month-title">{{ monthDetail.month_info?.month_name }}</h2>
                          <p class="month-subtitle">
                            ລະຫັດເດືອນ: {{ monthDetail.month_info?.upload_month }} | 
                            {{ monthDetail.month_info?.description }}
                          </p>
                        </div>
                      </div>
                      <v-chip
                        :color="getStatusColor(monthDetail.summary?.status)"
                        size="large"
                        variant="flat"
                      >
                        {{ formatStatus(monthDetail.summary?.status) }}
                      </v-chip>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <!-- Month Metrics -->
            <v-row class="mb-4" dense>
              <v-col cols="12" md="3" v-for="metric in monthMetrics" :key="metric.title">
                <v-card class="metric-card" :class="`metric-${metric.color}`">
                  <v-card-text class="metric-card-content">
                    <div class="metric-content">
                      <v-icon :color="metric.color" size="20" class="metric-icon">{{ metric.icon }}</v-icon>
                      <div class="metric-details">
                        <div class="metric-value">{{ metric.value }}</div>
                        <div class="metric-title">{{ metric.title }}</div>
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <!-- Processing Details -->
            <v-row class="mb-4" dense>
              <v-col cols="12" md="4">
                <v-card class="info-card">
                  <v-card-title class="info-card-title">
                    <v-icon class="mr-2" size="18">mdi-speedometer</v-icon>
                    ປະສິດທິພາບການປະມວນຜົນ
                  </v-card-title>
                  <v-card-text class="info-card-content">
                    <div class="info-row">
                      <span class="info-label">ໄລຍະເວລາການອັບໂຫຼດ:</span>
                      <span class="info-value">{{ monthDetail.processing_stats?.upload_duration_minutes || 0 }} ນາທີ</span>
                    </div>
                    <div class="info-row">
                      <span class="info-label">ອັດຕາການປະມວນຜົນ:</span>
                      <span class="info-value">{{ monthDetail.processing_stats?.records_per_second || 0 }} ບັນທຶກ/ວິນາທີ</span>
                    </div>
                    <div class="info-row">
                      <span class="info-label">ອັດຕາການນຳສົ່ງຂໍ້ມູນ:</span>
                      <span class="info-value">{{ monthDetail.processing_stats?.data_processing_rate_mb_per_min || 0 }} MB/ນາທີ</span>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12" md="4">
                <v-card class="info-card">
                  <v-card-title class="info-card-title">
                    <v-icon class="mr-2" size="18">mdi-api</v-icon>
                    ຂໍ້ມູນ API
                  </v-card-title>
                  <v-card-text class="info-card-content">
                    <div class="info-row">
                      <span class="info-label">API Response Code:</span>
                      <v-chip 
                        :color="monthDetail.summary?.api_response_code === 200 ? 'success' : 'error'"
                        size="small"
                      >
                        {{ monthDetail.summary?.api_response_code || 'N/A' }}
                      </v-chip>
                    </div>
                    <div class="info-row">
                      <span class="info-label">ເລີ່ມຕົ້ນ:</span>
                      <span class="info-value">{{ formatDateTime(monthDetail.summary?.upload_started) }}</span>
                    </div>
                    <div class="info-row">
                      <span class="info-label">ສຳເລັດ:</span>
                      <span class="info-value">{{ formatDateTime(monthDetail.summary?.upload_completed) }}</span>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12" md="4">
                <v-card class="info-card">
                  <v-card-title class="info-card-title">
                    <v-icon class="mr-2" size="18">mdi-database</v-icon>
                    ສະຖິຕິຖານຂໍ້ມູນ
                  </v-card-title>
                  <v-card-text class="info-card-content">
                    <div class="info-row">
                      <span class="info-label">ບັນທຶກໃນຖານຂໍ້ມູນ:</span>
                      <span class="info-value">{{ formatNumber(monthDetail.database_stats?.utility_bills_count || 0) }}</span>
                    </div>
                    <div class="info-row">
                      <span class="info-label">ຜູ້ອັບໂຫຼດ:</span>
                      <span class="info-value">{{ monthDetail.summary?.user_upload || 'N/A' }}</span>
                    </div>
                    <div class="info-row">
                      <span class="info-label">ຂະໜາດຂໍ້ມູນທັງໝົດ:</span>
                      <span class="info-value">{{ formatFileSize(monthDetail.summary?.data_size_mb || 0) }}</span>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <!-- Error Message -->
            <v-alert
              v-if="monthDetail.summary?.error_message"
              type="error"
              variant="tonal"
              class="mb-4"
              :text="monthDetail.summary.error_message"
            />

            <!-- Processing Logs -->
            <v-card class="data-table-card">
              <v-card-title class="table-title">
                <v-icon class="mr-2" size="18">mdi-text-box-outline</v-icon>
                ບັນທຶກການປະມວນຜົນ ({{ monthDetail.logs?.length || 0 }} ລາຍການ)
              </v-card-title>
              <v-data-table
                :headers="logsHeaders"
                :items="monthDetail.logs || []"
                :loading="loading"
                class="elevation-0 custom-table"
                density="compact"
                :items-per-page="15"
              >
                <template v-slot:item.timestamp="{ item }">
                  <span>{{ formatDateTime(item.timestamp) }}</span>
                </template>
                <template v-slot:item.log_level="{ item }">
                  <v-chip
                    :color="getLogColor(item.log_level)"
                    size="small"
                    variant="flat"
                    class="log-chip"
                  >
                    {{ item.log_level }}
                  </v-chip>
                </template>
                <template v-slot:item.message="{ item }">
                  <div class="log-message">{{ item.message }}</div>
                </template>
              </v-data-table>
            </v-card>
          </div>
          
          <!-- No Month Selected -->
          <div v-else class="text-center py-8">
            <v-icon size="64" color="grey-lighten-2" class="mb-4">mdi-calendar-month</v-icon>
            <h3 class="text-medium-emphasis mb-2">ກະລຸນາເລືອກເດືອນ</h3>
            <p class="text-medium-emphasis mb-4">ໃສ່ເດືອນສະເພາະໃນຮູບແບບ MMYYYY ແລ້ວກົດ "ນຳໃຊ້"</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Export Dialog -->
    <v-dialog v-model="exportDialog" max-width="500">
      <v-card>
        <v-card-title>ສົ່ງອອກລາຍງານສະຫຼຸບນ້ຳປະປາ</v-card-title>
        <v-card-text>
          <v-select
            v-model="exportOptions.type"
            :items="exportTypes"
            item-title="title"
            item-value="value"
            label="ປະເພດການສົ່ງອອກ"
            variant="outlined"
            class="mb-4"
            density="compact"
          />
          <v-select
            v-model="exportOptions.format"
            :items="exportFormats"
            item-title="title"
            item-value="value"
            label="ຮູບແບບ"
            variant="outlined"
            density="compact"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="exportDialog = false">ຍົກເລີກ</v-btn>
          <v-btn color="primary" @click="confirmExport" :loading="exporting">ສົ່ງອອກ</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Notifications -->
    <v-snackbar
      v-model="notification.show"
      :color="notification.color"
      :timeout="notification.timeout"
      location="top"
    >
      {{ notification.message }}
      <template v-slot:actions>
        <v-btn variant="text" @click="notification.show = false">ປິດ</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup>
// Nuxt.js 3 composables and imports
const config = useRuntimeConfig()

// Define page meta
definePageMeta({
  middleware: "auth",
  layout: "backend",
});

// Head management
useHead({
  title: 'ສະຫຼຸບການໂຫຼດນ້ຳປະປາ - ລະບົບການຕິດຕາມຂໍ້ມູນນ້ຳປະປາ',
  meta: [
    { name: 'description', content: 'ແດັຊບອດການວິເຄາະ ແລະ ລາຍງານລະບົບນ້ຳປະປາ' }
  ]
})

// ✅ Fixed API URL configuration - Use the correct backend URL
const apiBaseUrl = computed(() => {
  // Replace with your actual Django backend URL
  return config.public.apiUrl || 'http://192.168.45.56:8000'
})

// Reactive state
const loading = ref(false)
const exporting = ref(false)
const exportDialog = ref(false)
const error = ref('')
const debugMode = ref(process.env.NODE_ENV === 'development') // Enable debug in development
const debugTab = ref('api') // Add debug tab state

// Data refs
const summaryData = ref({})
const monthDetail = ref(null)
const debugInfo = ref({})

// Chart refs - will be populated client-side
const trendsChart = ref(null)
const statusChart = ref(null)
let trendsChartInstance = null
let statusChartInstance = null

// Reactive filters
const filters = reactive({
  viewType: 'overview',
  startMonth: '',
  endMonth: '',
  specificMonth: ''
})

// Export options
const exportOptions = reactive({
  type: 'overview',
  format: 'json'
})

// Notification state
const notification = reactive({
  show: false,
  message: '',
  color: 'success',
  timeout: 5000
})

// Configuration arrays
const viewTypes = [
  { title: 'ພາບລວມ', value: 'overview' },
  { title: 'ຕາມເດືອນ', value: 'month' }
]

const exportTypes = [
  { title: 'ລາຍງານພາບລວມ', value: 'overview' },
  { title: 'ລາຍງານເດືອນ', value: 'month' }
]

const exportFormats = [
  { title: 'JSON', value: 'json' },
  { title: 'CSV', value: 'csv' }
]

// Validation rules
const monthRules = [
  v => !v || /^\d{6}$/.test(v) || 'ຮູບແບບຕ້ອງເປັນ MMYYYY (ເຊັ່ນ: 122024)'
]

// Table headers
const monthlyHeaders = [
  { title: 'ເດືອນ', value: 'month_name', sortable: true, class: 'table-header' },
  { title: 'ຈຳນວນບັນທຶກທັງໝົດ', value: 'total_records', sortable: true, class: 'table-header' },
  { title: 'ຈຳນວນການອັບໂຫຼດ', value: 'total_uploads', sortable: true, class: 'table-header' },
  { title: 'ຂະໜາດຂໍ້ມູນ', value: 'total_data_size_mb', sortable: true, class: 'table-header' },
  { title: 'ອັດຕາສຳເລັດສະເລ່ຍ', value: 'avg_success_rate', sortable: true, class: 'table-header' },
  { title: 'ອັບໂຫຼດລ່າສຸດ', value: 'latest_upload', sortable: true, class: 'table-header' },
  { title: 'ການກະທຳ', value: 'actions', sortable: false, align: 'center', class: 'table-header' }
]

const activityHeaders = [
  { title: 'ເດືອນ', value: 'month_name', sortable: true, class: 'table-header' },
  { title: 'ບັນທຶກ', value: 'total_records', sortable: true, class: 'table-header' },
  { title: 'ຂະໜາດຂໍ້ມູນ', value: 'data_size_mb', sortable: true, class: 'table-header' },
  { title: 'ອັດຕາສຳເລັດ', value: 'success_rate', sortable: true, class: 'table-header' },
  { title: 'ສະຖານະ', value: 'status', sortable: true, class: 'table-header' },
  { title: 'ສຳເລັດແລ້ວ', value: 'upload_completed', sortable: true, class: 'table-header' },
  { title: 'ໄລຍະເວລາ', value: 'upload_duration', sortable: true, class: 'table-header' },
  { title: 'ຜູ້ໃຊ້', value: 'user_upload', sortable: false, class: 'table-header' }
]

const logsHeaders = [
  { title: 'ເວລາ', value: 'timestamp', sortable: true, class: 'table-header' },
  { title: 'ລະດັບ', value: 'log_level', sortable: true, class: 'table-header' },
  { title: 'ຂໍ້ຄວາມ', value: 'message', sortable: false, class: 'table-header' }
]

// Computed properties
const overviewMetrics = computed(() => {
  const overview = summaryData.value.overview || {}
  return [
    {
      title: 'ຈຳນວນບັນທຶກທັງໝົດ',
      value: formatNumber(overview.total_records || 0),
      subtitle: `${formatNumber(overview.total_processed || 0)} ປະມວນຜົນແລ້ວ`,
      icon: 'mdi-database',
      color: 'primary'
    },
    {
      title: 'ຈຳນວນການອັບໂຫຼດ',
      value: formatNumber(overview.total_uploads || 0),
      subtitle: `${overview.completed_uploads || 0} ສຳເລັດແລ້ວ`,
      icon: 'mdi-cloud-upload',
      color: 'success'
    },
    {
      title: 'ອັດຕາສຳເລັດ',
      value: `${overview.overall_success_rate || 0}%`,
      subtitle: `${overview.completion_rate || 0}% ສຳເລັດ`,
      icon: 'mdi-chart-line',
      color: 'info'
    },
    {
      title: 'ຂະໜາດຂໍ້ມູນທັງໝົດ',
      value: formatFileSize(overview.total_data_size_mb || 0),
      subtitle: `${overview.partial_uploads || 0} ບາງສ່ວນ`,
      icon: 'mdi-harddisk',
      color: 'warning'
    }
  ]
})

const monthMetrics = computed(() => {
  const summary = monthDetail.value?.summary || {}
  return [
    {
      title: 'ຈຳນວນບັນທຶກທັງໝົດ',
      value: formatNumber(summary.total_records || 0),
      icon: 'mdi-database',
      color: 'primary'
    },
    {
      title: 'ປະມວນຜົນແລ້ວ',
      value: formatNumber(summary.processed_records || 0),
      icon: 'mdi-check-circle',
      color: 'success'
    },
    {
      title: 'ອັດຕາສຳເລັດ',
      value: `${summary.success_rate || 0}%`,
      icon: 'mdi-chart-line',
      color: 'info'
    },
    {
      title: 'ຂະໜາດຂໍ້ມູນ',
      value: formatFileSize(summary.data_size_mb || 0),
      icon: 'mdi-harddisk',
      color: 'warning'
    }
  ]
})

// ✅ Fixed helper function to get access token
const getAccessToken = async () => {
  if (process.client) {
    return localStorage.getItem('access_token') || ''
  }
  return ''
}

// ✅ Enhanced API methods with better debugging and error handling
const loadSummaryData = async () => {
  loading.value = true
  error.value = ''
  
  try {
    // Build query parameters
    const params = new URLSearchParams()
    if (filters.startMonth) params.append('start_month', filters.startMonth)
    if (filters.endMonth) params.append('end_month', filters.endMonth)
    
    // ✅ Fixed API URL construction
    const url = `${apiBaseUrl.value}/api/water-summary/overview/`
    const queryString = params.toString()
    const fullUrl = queryString ? `${url}?${queryString}` : url
    
    // Get access token
    const token = await getAccessToken()
    
    console.log('🔄 Loading summary data from:', fullUrl)
    console.log('🔑 Using token:', token ? `${token.substring(0, 10)}...` : 'No token')
    
    debugInfo.value = {
      ...debugInfo.value,
      loadSummaryData: {
        url: fullUrl,
        hasToken: !!token,
        timestamp: new Date().toISOString()
      }
    }
    
    // Try multiple approaches to handle potential auth issues
    let response
    
    if (token) {
      // Try with authentication first
      try {
        response = await $fetch(fullUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        console.log('✅ Success with authentication')
      } catch (authError) {
        console.warn('⚠️ Failed with auth, trying without:', authError.message)
        // Fallback: try without authentication
        response = await $fetch(fullUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        console.log('✅ Success without authentication')
      }
    } else {
      // No token available, try without authentication
      response = await $fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      console.log('✅ Success without authentication (no token)')
    }
    
    console.log('📊 API Response:', response)
    console.log('📈 Overview data:', response?.overview)
    console.log('📅 Monthly breakdown count:', response?.monthly_breakdown?.length)
    console.log('⏰ Recent activity count:', response?.recent_activity?.length)
    
    // ✅ Assign the response data
    summaryData.value = response
    
    // Force reactivity update
    await nextTick()
    
    debugInfo.value = {
      ...debugInfo.value,
      summaryDataResponse: {
        hasData: !!response,
        dataKeys: Object.keys(response || {}),
        overview: response?.overview || null,
        monthly_breakdown_count: response?.monthly_breakdown?.length || 0,
        recent_activity_count: response?.recent_activity?.length || 0,
        rawResponse: response // Include full response for debugging
      }
    }
    
    // Update charts on next tick
    await nextTick()
    if (process.client) {
      createCharts()
    }
    
    showNotification('ໂຫຼດຂໍ້ມູນສະຫຼຸບສຳເລັດແລ້ວ', 'success')
    
    // Double-check that data is actually assigned
    console.log('🔍 summaryData.value after assignment:', summaryData.value)
    console.log('🔍 overviewMetrics computed:', overviewMetrics.value)
    
  } catch (err) {
    console.error('❌ Error loading summary data:', err)
    error.value = `ການໂຫຼດຂໍ້ມູນສະຫຼຸບລົ້ມເຫຼວ: ${err.message || err}`
    
    debugInfo.value = {
      ...debugInfo.value,
      loadSummaryError: {
        error: err.message || String(err),
        stack: err.stack,
        timestamp: new Date().toISOString()
      }
    }
    
    showNotification('ການໂຫຼດຂໍ້ມູນສະຫຼຸບລົ້ມເຫຼວ', 'error')
  } finally {
    loading.value = false
  }
}

const loadMonthDetail = async (month) => {
  loading.value = true
  error.value = ''
  
  try {
    // ✅ Fixed API URL construction
    const url = `${apiBaseUrl.value}/api/water-summary/month/?month=${month}`
    
    debugInfo.value = {
      ...debugInfo.value,
      loadMonthDetail: {
        url,
        month,
        timestamp: new Date().toISOString()
      }
    }
    
    // ✅ Fixed using $fetch with proper error handling
    const response = await $fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${await getAccessToken()}`,
        'Content-Type': 'application/json'
      }
    })
    
    // ✅ The response from $fetch is already the data
    monthDetail.value = response
    
    debugInfo.value = {
      ...debugInfo.value,
      monthDetailResponse: {
        hasData: !!response,
        dataKeys: Object.keys(response || {}),
        month_info: response?.month_info || null,
        summary: response?.summary || null,
        logs_count: response?.logs?.length || 0
      }
    }
    
    showNotification('ໂຫຼດລາຍລະອຽດເດືອນສຳເລັດແລ້ວ', 'success')
  } catch (err) {
    console.error('Error loading month detail:', err)
    error.value = `ການໂຫຼດລາຍລະອຽດເດືອນລົ້ມເຫຼວ: ${err.message || err}`
    
    debugInfo.value = {
      ...debugInfo.value,
      loadMonthError: {
        error: err.message || String(err),
        month,
        timestamp: new Date().toISOString()
      }
    }
    
    showNotification('ການໂຫຼດລາຍລະອຽດເດືອນລົ້ມເຫຼວ', 'error')
  } finally {
    loading.value = false
  }
}

// Event handlers
const onViewTypeChange = async () => {
  if (filters.viewType === 'overview') {
    await loadSummaryData()
  } else if (filters.viewType === 'month' && filters.specificMonth) {
    await loadMonthDetail(filters.specificMonth)
  }
}

const applyFilters = async () => {
  if (filters.viewType === 'overview') {
    await loadSummaryData()
  } else if (filters.viewType === 'month' && filters.specificMonth) {
    await loadMonthDetail(filters.specificMonth)
  }
}

const resetFilters = () => {
  filters.startMonth = ''
  filters.endMonth = ''
  filters.specificMonth = ''
  
  if (filters.viewType === 'overview') {
    loadSummaryData()
  }
  
  showNotification('ລ້າງຕົວກອງສຳເລັດແລ້ວ', 'info')
}

const viewMonthDetail = (month) => {
  filters.specificMonth = month
  filters.viewType = 'month'
  loadMonthDetail(month)
}

const refreshAllData = async () => {
  await applyFilters()
}

const exportData = () => {
  exportDialog.value = true
}

const confirmExport = async () => {
  exporting.value = true
  try {
    // ✅ Fixed export API call
    const url = `${apiBaseUrl.value}/api/water-summary/export/`
    
    const response = await $fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${await getAccessToken()}`,
        'Content-Type': 'application/json'
      },
      body: {
        export_type: exportOptions.type,
        format: exportOptions.format,
        filters: {
          start_month: filters.startMonth,
          end_month: filters.endMonth,
          month: filters.specificMonth
        }
      }
    })
    
    // Download the data (client-side only)
    if (process.client) {
      const blob = new Blob([JSON.stringify(response, null, 2)], {
        type: 'application/json'
      })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = `water-summary-${exportOptions.type}-${new Date().toISOString().slice(0, 10)}.json`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
    }
    
    exportDialog.value = false
    showNotification('ສົ່ງອອກລາຍງານສຳເລັດແລ້ວ', 'success')
  } catch (err) {
    console.error('Export error:', err)
    showNotification('ການສົ່ງອອກລາຍງານລົ້ມເຫຼວ', 'error')
  } finally {
    exporting.value = false
  }
}

// Chart methods (client-side only)
const createCharts = async () => {
  if (!process.client) return
  
  try {
    // Dynamically import Chart.js
    const { Chart, registerables } = await import('chart.js')
    Chart.register(...registerables)
    
    createTrendsChart(Chart)
    createStatusChart(Chart)
  } catch (err) {
    console.error('Error creating charts:', err)
  }
}

const createTrendsChart = (Chart) => {
  if (trendsChartInstance) {
    trendsChartInstance.destroy()
  }
  
  const ctx = trendsChart.value?.getContext('2d')
  if (!ctx) return
  
  const monthlyData = summaryData.value.monthly_trends || []
  
  trendsChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: monthlyData.map(item => item.month_name),
      datasets: [
        {
          label: 'ຈຳນວນບັນທຶກທັງໝົດ',
          data: monthlyData.map(item => item.total_records),
          borderColor: '#0277BD',
          backgroundColor: 'rgba(2, 119, 189, 0.1)',
          tension: 0.4,
          borderWidth: 2
        },
        {
          label: 'ຂະໜາດຂໍ້ມູນ (MB)',
          data: monthlyData.map(item => item.total_data_size_mb),
          borderColor: '#FF9800',
          backgroundColor: 'rgba(255, 152, 0, 0.1)',
          tension: 0.4,
          borderWidth: 2,
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            usePointStyle: true,
            padding: 15
          }
        }
      },
      scales: {
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          grid: {
            color: '#f5f5f5'
          }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          grid: {
            drawOnChartArea: false,
          }
        },
        x: {
          grid: {
            color: '#f5f5f5'
          }
        }
      }
    }
  })
}

const createStatusChart = (Chart) => {
  if (statusChartInstance) {
    statusChartInstance.destroy()
  }
  
  const ctx = statusChart.value?.getContext('2d')
  if (!ctx) return
  
  const overview = summaryData.value.overview || {}
  
  statusChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['ສຳເລັດແລ້ວ', 'ລົ້ມເຫຼວ', 'ກຳລັງດຳເນີນການ', 'ບາງສ່ວນ'],
      datasets: [{
        data: [
          overview.completed_uploads || 0,
          overview.failed_uploads || 0,
          overview.in_progress_uploads || 0,
          overview.partial_uploads || 0
        ],
        backgroundColor: [
          '#4CAF50',
          '#F44336',
          '#FF9800',
          '#9C27B0'
        ],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            padding: 15
          }
        }
      }
    }
  })
}

// Utility methods
const getSuccessColor = (rate) => {
  if (rate >= 95) return 'success'
  if (rate >= 80) return 'warning'
  return 'error'
}

const getStatusColor = (status) => {
  const colors = {
    completed: 'success',
    pending: 'warning',
    in_progress: 'info',
    failed: 'error',
    partial: 'orange'
  }
  return colors[status] || 'grey'
}

const getLogColor = (level) => {
  const colors = {
    INFO: 'info',
    WARNING: 'warning',
    ERROR: 'error',
    DEBUG: 'grey',
    CRITICAL: 'error'
  }
  return colors[level] || 'grey'
}

const formatStatus = (status) => {
  const statusMap = {
    completed: 'ສຳເລັດແລ້ວ',
    pending: 'ລໍຖ້າ',
    in_progress: 'ກຳລັງດຳເນີນການ',
    failed: 'ລົ້ມເຫຼວ',
    partial: 'ບາງສ່ວນ'
  }
  return statusMap[status] || status
}

const formatNumber = (num) => {
  return num?.toLocaleString() || '0'
}

const formatFileSize = (sizeMb) => {
  if (!sizeMb || sizeMb === 0) return '0 KB'
  if (sizeMb < 1) {
    return `${(sizeMb * 1024).toFixed(1)} KB`
  } else if (sizeMb < 1024) {
    return `${sizeMb.toFixed(1)} MB`
  } else {
    return `${(sizeMb / 1024).toFixed(1)} GB`
  }
}

const formatDateTime = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleString()
}

const formatDuration = (seconds) => {
  if (!seconds) return ''
  if (seconds < 60) return `${seconds.toFixed(0)}ວິ`
  if (seconds < 3600) return `${(seconds / 60).toFixed(1)}ນທ`
  return `${(seconds / 3600).toFixed(1)}ຊມ`
}

const showNotification = (message, color = 'success') => {
  notification.message = message
  notification.color = color
  notification.show = true
}

// Lifecycle hooks
onMounted(async () => {
  await loadSummaryData()
})

// Cleanup charts on unmount
onUnmounted(() => {
  if (trendsChartInstance) {
    trendsChartInstance.destroy()
  }
  if (statusChartInstance) {
    statusChartInstance.destroy()
  }
})
</script>

<style scoped>
.water-supply-summary-dashboard {
  min-height: 100vh;
  background: #fafafa;
}

/* Debug Panel */
.debug-panel {
  background: #fff3cd;
  border-bottom: 1px solid #ffeaa7;
  padding: 1rem 0;
}

.debug-panel pre {
  font-size: 0.75rem;
  max-height: 300px;
  overflow-y: auto;
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 4px;
}

/* Header Styles */
.dashboard-header {
  background: linear-gradient(135deg, #0277BD 0%, #01579B 100%);
  color: white;
  padding: 1.5rem 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.header-icon {
  color: #ffffff;
}

.title-text {
  font-size: 1.75rem;
  font-weight: 600;
  margin: 0;
  color: white;
}

.subtitle-text {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

/* Filter Styles */
.filters-section {
  padding: 1rem 0;
  background: #fafafa;
}

.filter-card {
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  border: 1px solid #e0e0e0;
}

.filter-title {
  padding: 1rem 1.5rem 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  color: #333;
}

.filter-content {
  padding: 0.5rem 1.5rem 1.5rem;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* Dashboard Content */
.dashboard-content {
  padding: 1.5rem 0;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Metric Cards */
.metric-card {
  height: 100%;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  border: 1px solid #e0e0e0;
  transition: transform 0.2s ease;
  background: #ffffff;
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

.metric-card-content {
  padding: 1rem !important;
}

.metric-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.metric-icon {
  flex-shrink: 0;
}

.metric-value {
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.2;
  color: #333;
}

.metric-title {
  font-size: 0.75rem;
  color: #666;
  margin-top: 0.25rem;
  font-weight: 500;
}

.metric-subtitle {
  font-size: 0.7rem;
  color: #999;
  margin-top: 0.125rem;
}

/* Chart Cards */
.chart-card {
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  border: 1px solid #e0e0e0;
  height: 100%;
  background: #ffffff;
}

.chart-title {
  padding: 1rem 1.5rem 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  color: #333;
}

.chart-content {
  padding: 0.5rem 1.5rem 1.5rem;
}

.chart-container {
  position: relative;
  height: 280px;
}

/* Info Cards for Month Detail */
.info-card {
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  border: 1px solid #e0e0e0;
  height: 100%;
  background: #ffffff;
}

.info-card-title {
  padding: 1rem 1.5rem 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #333;
}

.info-card-content {
  padding: 0.5rem 1.5rem 1.5rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.info-label {
  font-size: 0.75rem;
  color: #666;
  flex: 1;
}

.info-value {
  font-size: 0.875rem;
  font-weight: 500;
  color: #333;
  text-align: right;
}

/* Data Table Cards */
.data-table-card {
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  border: 1px solid #e0e0e0;
  margin-bottom: 1.5rem;
  background: #ffffff;
}

.table-title {
  padding: 1rem 1.5rem 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  color: #333;
  border-bottom: 1px solid #f0f0f0;
}

/* Month Header Cards */
.month-header-card {
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  border: 1px solid #e0e0e0;
  background: #ffffff;
}

.header-card-content {
  padding: 1.5rem !important;
}

.month-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  color: #333;
}

.month-subtitle {
  color: #666;
  margin: 0;
  font-size: 0.875rem;
}

/* Table Styling */
:deep(.custom-table) {
  border-radius: 0 0 8px 8px;
}

:deep(.custom-table .v-data-table__thead) {
  background: #f8f9fa;
}

:deep(.custom-table .table-header) {
  background: #f8f9fa !important;
  color: #495057 !important;
  font-weight: 600 !important;
  border-bottom: 2px solid #dee2e6 !important;
}

:deep(.custom-table .v-data-table-header__content) {
  font-weight: 600;
  color: #495057;
}

:deep(.custom-table .v-data-table__tr) {
  border-bottom: 1px solid #f0f0f0;
}

:deep(.custom-table .v-data-table__tr:hover) {
  background: #f8f9fa;
}

:deep(.custom-table .v-data-table__td) {
  padding: 8px 16px !important;
  border-bottom: 1px solid #f0f0f0;
}

/* Log message styling */
.log-message {
  font-family: 'Courier New', monospace;
  font-size: 0.75rem;
  line-height: 1.3;
  max-width: 600px;
  word-break: break-word;
}

/* Chips */
.success-chip, .status-chip, .log-chip {
  font-size: 0.75rem;
  font-weight: 500;
}

/* Responsive Design */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .header-actions {
    width: 100%;
    justify-content: center;
  }
  
  .title-text {
    font-size: 1.5rem;
  }
  
  .chart-container {
    height: 250px;
  }
  
  .action-buttons {
    flex-direction: row;
  }
  
  .info-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
  
  .info-value {
    text-align: left;
  }
}

/* Vuetify Overrides */
:deep(.v-card-title) {
  font-weight: 500;
  font-size: 1rem;
}

:deep(.v-btn) {
  text-transform: none;
  border-radius: 6px;
  font-weight: 500;
}

:deep(.v-text-field .v-field) {
  font-size: 0.875rem;
}

:deep(.v-select .v-field) {
  font-size: 0.875rem;
}

:deep(.v-data-table) {
  font-size: 0.875rem;
}

:deep(.v-chip) {
  border-radius: 4px;
}

:deep(.v-row.dense) {
  margin: -4px;
}

:deep(.v-row.dense > .v-col) {
  padding: 4px;
}
</style>