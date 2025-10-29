<template>
  <div class="utility-summary-dashboard">
    <!-- Header Section -->
    <div class="dashboard-header">
      <div class="container">
        <div class="header-content">
          <div class="header-title">
            <v-icon class="header-icon" size="24">mdi-chart-box-multiple</v-icon>
            <div>
              <h1 class="title-text">ສະຫຼຸບການໂຫຼດ EDL Utility</h1>
              <p class="subtitle-text">ແດັຊບອດການວິເຄາະ ແລະ ລາຍງານຂັ້ນສູງ</p>
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
              <v-col cols="12" md="2">
                <v-text-field
                  v-model="filters.startMonth"
                  label="ເດືອນເລີ່ມຕົ້ນ"
                  placeholder="202501"
                  variant="outlined"
                  density="compact"
                  prepend-inner-icon="mdi-calendar-start"
                  :rules="monthRules"
                />
              </v-col>
              <v-col cols="12" md="2">
                <v-text-field
                  v-model="filters.endMonth"
                  label="ເດືອນສິ້ນສຸດ"
                  placeholder="202512"
                  variant="outlined"
                  density="compact"
                  prepend-inner-icon="mdi-calendar-end"
                  :rules="monthRules"
                />
              </v-col>
              <v-col cols="12" md="2">
                <v-select
                  v-model="filters.provinceId"
                  :items="provinces"
                  item-title="pro_name"
                  item-value="pro_id"
                  label="ແຂວງ"
                  variant="outlined"
                  density="compact"
                  prepend-inner-icon="mdi-map-marker"
                  clearable
                  @update:model-value="onProvinceChange"
                />
              </v-col>
              <v-col cols="12" md="2">
                <v-select
                  v-model="filters.districtId"
                  :items="districts"
                  item-title="dis_name"
                  item-value="dis_id"
                  label="ເມືອງ"
                  variant="outlined"
                  density="compact"
                  prepend-inner-icon="mdi-map"
                  clearable
                  :disabled="!filters.provinceId"
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

    <!-- Main Dashboard Content -->
    <div class="dashboard-content">
      <div class="container">
        <!-- Overview Cards -->
        <div v-if="filters.viewType === 'overview'" class="overview-section">
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

          <!-- Province Breakdown Table -->
          <v-card class="data-table-card">
            <v-card-title class="table-title">
              <v-icon class="mr-2" size="18">mdi-table</v-icon>
              ການແບ່ງແຍກຕາມແຂວງ
            </v-card-title>
            <v-data-table
              :headers="provinceHeaders"
              :items="summaryData.province_breakdown || []"
              :loading="loading"
              class="elevation-0 custom-table"
              density="compact"
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
              <template v-slot:item.actions="{ item }">
                <v-btn
                  icon="mdi-eye"
                  size="x-small"
                  variant="text"
                  @click="viewProvinceDetail(item.pro_id)"
                />
              </template>
            </v-data-table>
          </v-card>
        </div>

        <!-- Province Detail View -->
        <div v-if="filters.viewType === 'province'" class="province-section">
          <div v-if="provinceDetail">
            <!-- Province Summary Cards -->
            <v-row class="mb-4" dense>
              <v-col cols="12">
                <v-card class="province-header-card">
                  <v-card-text class="header-card-content">
                    <div class="d-flex align-center">
                      <v-icon color="primary" size="24" class="mr-3">mdi-map-marker</v-icon>
                      <div>
                        <h2 class="province-title">{{ provinceDetail.province_info?.pro_name }}</h2>
                        <p class="province-subtitle">ລະຫັດແຂວງ: {{ provinceDetail.province_info?.pro_id }}</p>
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <v-row class="mb-4" dense>
              <v-col cols="12" md="3" v-for="metric in provinceMetrics" :key="metric.title">
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

            <!-- District Breakdown -->
            <v-card class="data-table-card">
              <v-card-title class="table-title">
                <v-icon class="mr-2" size="18">mdi-map</v-icon>
                ການແບ່ງແຍກຕາມເມືອງ
              </v-card-title>
              <v-data-table
                :headers="districtHeaders"
                :items="provinceDetail.district_breakdown || []"
                :loading="loading"
                class="elevation-0 custom-table"
                density="compact"
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
                <template v-slot:item.actions="{ item }">
                  <v-btn
                    icon="mdi-eye"
                    size="x-small"
                    variant="text"
                    @click="viewDistrictDetail(item.dis_id)"
                  />
                </template>
              </v-data-table>
            </v-card>
          </div>
        </div>

        <!-- District Detail View -->
        <div v-if="filters.viewType === 'district'" class="district-section">
          <div v-if="districtDetail">
            <!-- District Summary -->
            <v-row class="mb-4" dense>
              <v-col cols="12">
                <v-card class="district-header-card">
                  <v-card-text class="header-card-content">
                    <div class="d-flex align-center">
                      <v-icon color="primary" size="24" class="mr-3">mdi-map</v-icon>
                      <div>
                        <h2 class="district-title">{{ districtDetail.district_info?.dis_name }}</h2>
                        <p class="district-subtitle">ລະຫັດເມືອງ: {{ districtDetail.district_info?.dis_id }} | ແຂວງ: {{ districtDetail.district_info?.pro_id }}</p>
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <v-row class="mb-4" dense>
              <v-col cols="12" md="3" v-for="metric in districtMetrics" :key="metric.title">
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

            <!-- Upload History -->
            <v-card class="data-table-card">
              <v-card-title class="table-title">
                <v-icon class="mr-2" size="18">mdi-history</v-icon>
                ປະຫວັດການອັບໂຫຼດ
              </v-card-title>
              <v-data-table
                :headers="historyHeaders"
                :items="districtDetail.upload_history || []"
                :loading="loading"
                class="elevation-0 custom-table"
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
              </v-data-table>
            </v-card>
          </div>
        </div>

        <!-- Recent Activity -->
        <div v-if="filters.viewType === 'overview'" class="recent-activity-section">
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
            </v-data-table>
          </v-card>
        </div>
      </div>
    </div>

    <!-- Export Dialog -->
    <v-dialog v-model="exportDialog" max-width="500">
      <v-card>
        <v-card-title>ສົ່ງອອກລາຍງານສະຫຼຸບ</v-card-title>
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
import { ref, computed, onMounted, reactive, nextTick, watch } from 'vue'
import axios from 'axios'
import Chart from 'chart.js/auto'

definePageMeta({
  middleware: "auth",
  layout: "backend",
});
// Configuration
const config = useRuntimeConfig()
const apiUrl = computed(() => config.public.apiUrl || 'http://192.168.45.56:8000/')

// Reactive Data
const loading = ref(false)
const exporting = ref(false)
const exportDialog = ref(false)

// Data
const provinces = ref([])
const districts = ref([])
const summaryData = ref({})
const provinceDetail = ref(null)
const districtDetail = ref(null)

// Charts
const trendsChart = ref(null)
const statusChart = ref(null)
let trendsChartInstance = null
let statusChartInstance = null

// Filters
const filters = reactive({
  viewType: 'overview',
  startMonth: '',
  endMonth: '',
  provinceId: null,
  districtId: null
})

// Export Options
const exportOptions = reactive({
  type: 'overview',
  format: 'json'
})

// Notification
const notification = reactive({
  show: false,
  message: '',
  color: 'success',
  timeout: 5000
})

// Configuration Arrays
const viewTypes = [
  { title: 'ພາບລວມ', value: 'overview' },
  { title: 'ຕາມແຂວງ', value: 'province' },
  { title: 'ຕາມເມືອງ', value: 'district' }
]

const exportTypes = [
  { title: 'ລາຍງານພາບລວມ', value: 'overview' },
  { title: 'ລາຍງານແຂວງ', value: 'province' },
  { title: 'ລາຍງານເມືອງ', value: 'district' }
]

const exportFormats = [
  { title: 'JSON', value: 'json' },
  { title: 'CSV', value: 'csv' }
]

// Validation Rules
const monthRules = [
  v => !v || /^\d{6}$/.test(v) || 'ຮູບແບບຕ້ອງເປັນ YYYYMM (ເຊັ່ນ: 202501)'
]

// Table Headers
const provinceHeaders = [
  { title: 'ແຂວງ', value: 'pro_name', sortable: true, class: 'table-header' },
  { title: 'ຈຳນວນບັນທຶກທັງໝົດ', value: 'total_records', sortable: true, class: 'table-header' },
  { title: 'ຈຳນວນການອັບໂຫຼດ', value: 'total_uploads', sortable: true, class: 'table-header' },
  { title: 'ຂະໜາດຂໍ້ມູນ', value: 'total_data_size_mb', sortable: true, class: 'table-header' },
  { title: 'ອັດຕາສຳເລັດສະເລ່ຍ', value: 'avg_success_rate', sortable: true, class: 'table-header' },
  { title: 'ການກະທຳ', value: 'actions', sortable: false, align: 'center', class: 'table-header' }
]

const districtHeaders = [
  { title: 'ເມືອງ', value: 'dis_name', sortable: true, class: 'table-header' },
  { title: 'ຈຳນວນບັນທຶກທັງໝົດ', value: 'total_records', sortable: true, class: 'table-header' },
  { title: 'ຈຳນວນການອັບໂຫຼດ', value: 'total_uploads', sortable: true, class: 'table-header' },
  { title: 'ຂະໜາດຂໍ້ມູນ', value: 'total_data_size_mb', sortable: true, class: 'table-header' },
  { title: 'ອັດຕາສຳເລັດສະເລ່ຍ', value: 'avg_success_rate', sortable: true, class: 'table-header' },
  { title: 'ການກະທຳ', value: 'actions', sortable: false, align: 'center', class: 'table-header' }
]

const historyHeaders = [
  { title: 'ເດືອນ', value: 'upload_month', sortable: true, class: 'table-header' },
  { title: 'ບັນທຶກ', value: 'total_records', sortable: true, class: 'table-header' },
  { title: 'ຂະໜາດຂໍ້ມູນ', value: 'data_size_mb', sortable: true, class: 'table-header' },
  { title: 'ອັດຕາສຳເລັດ', value: 'success_rate', sortable: true, class: 'table-header' },
  { title: 'ສະຖານະ', value: 'status', sortable: true, class: 'table-header' },
  { title: 'ສຳເລັດແລ້ວ', value: 'upload_completed', sortable: true, class: 'table-header' },
  { title: 'ຜູ້ໃຊ້', value: 'user_upload', sortable: false, class: 'table-header' }
]

const activityHeaders = [
  { title: 'ແຂວງ', value: 'pro_name', sortable: false, class: 'table-header' },
  { title: 'ເມືອງ', value: 'dis_name', sortable: false, class: 'table-header' },
  { title: 'ເດືອນ', value: 'upload_month', sortable: true, class: 'table-header' },
  { title: 'ບັນທຶກ', value: 'total_records', sortable: true, class: 'table-header' },
  { title: 'ຂະໜາດຂໍ້ມູນ', value: 'data_size_mb', sortable: true, class: 'table-header' },
  { title: 'ອັດຕາສຳເລັດ', value: 'success_rate', sortable: true, class: 'table-header' },
  { title: 'ສະຖານະ', value: 'status', sortable: true, class: 'table-header' },
  { title: 'ສຳເລັດແລ້ວ', value: 'upload_completed', sortable: true, class: 'table-header' }
]

// Computed Properties
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
      subtitle: `${overview.failed_uploads || 0} ອັບໂຫຼດລົ້ມເຫຼວ`,
      icon: 'mdi-harddisk',
      color: 'warning'
    }
  ]
})

const provinceMetrics = computed(() => {
  const summary = provinceDetail.value?.summary || {}
  return [
    {
      title: 'ຈຳນວນບັນທຶກທັງໝົດ',
      value: formatNumber(summary.total_records || 0),
      icon: 'mdi-database',
      color: 'primary'
    },
    {
      title: 'ຈຳນວນການອັບໂຫຼດ',
      value: formatNumber(summary.total_uploads || 0),
      icon: 'mdi-cloud-upload',
      color: 'success'
    },
    {
      title: 'ອັດຕາສຳເລັດ',
      value: `${summary.avg_success_rate || 0}%`,
      icon: 'mdi-chart-line',
      color: 'info'
    },
    {
      title: 'ຂະໜາດຂໍ້ມູນ',
      value: formatFileSize(summary.total_data_size_mb || 0),
      icon: 'mdi-harddisk',
      color: 'warning'
    }
  ]
})

const districtMetrics = computed(() => {
  const summary = districtDetail.value?.summary || {}
  return [
    {
      title: 'ຈຳນວນບັນທຶກທັງໝົດ',
      value: formatNumber(summary.total_records || 0),
      icon: 'mdi-database',
      color: 'primary'
    },
    {
      title: 'ຈຳນວນການອັບໂຫຼດ',
      value: formatNumber(summary.total_uploads || 0),
      icon: 'mdi-cloud-upload',
      color: 'success'
    },
    {
      title: 'ອັດຕາສຳເລັດ',
      value: `${summary.avg_success_rate || 0}%`,
      icon: 'mdi-chart-line',
      color: 'info'
    },
    {
      title: 'ຂະໜາດຂໍ້ມູນ',
      value: formatFileSize(summary.total_data_size_mb || 0),
      icon: 'mdi-harddisk',
      color: 'warning'
    }
  ]
})

// API Methods
const loadProvinces = async () => {
  try {
    const response = await axios.get(`${apiUrl.value}api/provinces/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    })
    provinces.value = response.data
  } catch (error) {
    console.error('Error loading provinces:', error)
    showNotification('ການໂຫຼດຂໍ້ມູນແຂວງລົ້ມເຫຼວ', 'error')
  }
}

const loadDistricts = async (provinceId) => {
  try {
    const response = await axios.get(`${apiUrl.value}api/districts/`, {
      params: { province_id: provinceId },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    })
    districts.value = response.data
  } catch (error) {
    console.error('Error loading districts:', error)
    showNotification('ການໂຫຼດຂໍ້ມູນເມືອງລົ້ມເຫຼວ', 'error')
  }
}

const loadSummaryData = async () => {
  loading.value = true
  try {
    const params = {}
    if (filters.startMonth) params.start_month = filters.startMonth
    if (filters.endMonth) params.end_month = filters.endMonth
    if (filters.provinceId) params.province_id = filters.provinceId
    if (filters.districtId) params.district_id = filters.districtId

    const response = await axios.get(`${apiUrl.value}api/edl-summary/overview/`, {
      params,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    })
    
    summaryData.value = response.data
    
    // Update charts
    await nextTick()
    createCharts()
    
    showNotification('ໂຫຼດຂໍ້ມູນສະຫຼຸບສຳເລັດແລ້ວ', 'success')
  } catch (error) {
    console.error('Error loading summary data:', error)
    showNotification('ການໂຫຼດຂໍ້ມູນສະຫຼຸບລົ້ມເຫຼວ', 'error')
  } finally {
    loading.value = false
  }
}

const loadProvinceDetail = async (provinceId) => {
  loading.value = true
  try {
    const params = { province_id: provinceId }
    if (filters.startMonth) params.start_month = filters.startMonth
    if (filters.endMonth) params.end_month = filters.endMonth

    const response = await axios.get(`${apiUrl.value}api/edl-summary/province/`, {
      params,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    })
    
    provinceDetail.value = response.data
    showNotification('ໂຫຼດລາຍລະອຽດແຂວງສຳເລັດແລ້ວ', 'success')
  } catch (error) {
    console.error('Error loading province detail:', error)
    showNotification('ການໂຫຼດລາຍລະອຽດແຂວງລົ້ມເຫຼວ', 'error')
  } finally {
    loading.value = false
  }
}

const loadDistrictDetail = async (districtId) => {
  loading.value = true
  try {
    const params = { district_id: districtId }
    if (filters.startMonth) params.start_month = filters.startMonth
    if (filters.endMonth) params.end_month = filters.endMonth
    if (filters.provinceId) params.province_id = filters.provinceId

    const response = await axios.get(`${apiUrl.value}api/edl-summary/district/`, {
      params,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    })
    
    districtDetail.value = response.data
    showNotification('ໂຫຼດລາຍລະອຽດເມືອງສຳເລັດແລ້ວ', 'success')
  } catch (error) {
    console.error('Error loading district detail:', error)
    showNotification('ການໂຫຼດລາຍລະອຽດເມືອງລົ້ມເຫຼວ', 'error')
  } finally {
    loading.value = false
  }
}

// Event Handlers
const onViewTypeChange = async () => {
  if (filters.viewType === 'overview') {
    await loadSummaryData()
  } else if (filters.viewType === 'province' && filters.provinceId) {
    await loadProvinceDetail(filters.provinceId)
  } else if (filters.viewType === 'district' && filters.districtId) {
    await loadDistrictDetail(filters.districtId)
  }
}

const onProvinceChange = async () => {
  if (filters.provinceId) {
    await loadDistricts(filters.provinceId)
    filters.districtId = null
    
    if (filters.viewType === 'province') {
      await loadProvinceDetail(filters.provinceId)
    }
  } else {
    districts.value = []
    filters.districtId = null
  }
}

const applyFilters = async () => {
  if (filters.viewType === 'overview') {
    await loadSummaryData()
  } else if (filters.viewType === 'province' && filters.provinceId) {
    await loadProvinceDetail(filters.provinceId)
  } else if (filters.viewType === 'district' && filters.districtId) {
    await loadDistrictDetail(filters.districtId)
  }
}

// Reset Filters Function
const resetFilters = () => {
  filters.startMonth = ''
  filters.endMonth = ''
  filters.provinceId = null
  filters.districtId = null
  districts.value = []
  
  // Reload data with reset filters
  if (filters.viewType === 'overview') {
    loadSummaryData()
  }
  
  showNotification('ລ້າງຕົວກອງສຳເລັດແລ້ວ', 'info')
}

const viewProvinceDetail = (provinceId) => {
  filters.provinceId = provinceId
  filters.viewType = 'province'
  loadProvinceDetail(provinceId)
}

const viewDistrictDetail = (districtId) => {
  filters.districtId = districtId
  filters.viewType = 'district'
  loadDistrictDetail(districtId)
}

const refreshAllData = async () => {
  await loadProvinces()
  await applyFilters()
}

const exportData = () => {
  exportDialog.value = true
}

const confirmExport = async () => {
  exporting.value = true
  try {
    const response = await axios.post(`${apiUrl.value}api/edl-summary/export/`, {
      export_type: exportOptions.type,
      format: exportOptions.format,
      filters: {
        start_month: filters.startMonth,
        end_month: filters.endMonth,
        province_id: filters.provinceId,
        district_id: filters.districtId
      }
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    })
    
    // Download the data
    const blob = new Blob([JSON.stringify(response.data, null, 2)], {
      type: 'application/json'
    })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.style.display = 'none'
    a.href = url
    a.download = `edl-summary-${exportOptions.type}-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    
    exportDialog.value = false
    showNotification('ສົ່ງອອກລາຍງານສຳເລັດແລ້ວ', 'success')
  } catch (error) {
    console.error('Export error:', error)
    showNotification('ການສົ່ງອອກລາຍງານລົ້ມເຫຼວ', 'error')
  } finally {
    exporting.value = false
  }
}

// Chart Methods
const createCharts = () => {
  createTrendsChart()
  createStatusChart()
}

const createTrendsChart = () => {
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
          borderColor: '#2196F3',
          backgroundColor: 'rgba(33, 150, 243, 0.1)',
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

const createStatusChart = () => {
  if (statusChartInstance) {
    statusChartInstance.destroy()
  }
  
  const ctx = statusChart.value?.getContext('2d')
  if (!ctx) return
  
  const overview = summaryData.value.overview || {}
  
  statusChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['ສຳເລັດແລ້ວ', 'ລົ້ມເຫຼວ', 'ກຳລັງດຳເນີນການ'],
      datasets: [{
        data: [
          overview.completed_uploads || 0,
          overview.failed_uploads || 0,
          overview.in_progress_uploads || 0
        ],
        backgroundColor: [
          '#4CAF50',
          '#F44336',
          '#FF9800'
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

// Utility Methods
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
  return new Date(date).toLocaleString()
}

const showNotification = (message, color = 'success') => {
  notification.message = message
  notification.color = color
  notification.show = true
}

// Lifecycle
onMounted(async () => {
  await loadProvinces()
  await loadSummaryData()
})
</script>

<style scoped>
.utility-summary-dashboard {
  min-height: 100vh;
  background: #fafafa;
}

/* Header Styles */
.dashboard-header {
  background: #ffffff;
  color: #333;
  padding: 1.5rem 0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  border-bottom: 1px solid #e0e0e0;
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
  color: #1976d2;
}

.title-text {
  font-size: 1.75rem;
  font-weight: 600;
  margin: 0;
  color: #333;
}

.subtitle-text {
  font-size: 0.875rem;
  color: #666;
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

/* Province/District Header Cards */
.province-header-card,
.district-header-card {
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  border: 1px solid #e0e0e0;
  background: #ffffff;
}

.header-card-content {
  padding: 1.5rem !important;
}

.province-title,
.district-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  color: #333;
}

.province-subtitle,
.district-subtitle {
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

/* Chips */
.success-chip {
  font-size: 0.75rem;
  font-weight: 500;
}

.status-chip {
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
}

/* Vuetify Overrides */
:deep(.v-card-title) {
  font-weight: 500;
  font-size: 1rem;
  padding: 1rem 1.5rem 0.5rem;
}

:deep(.v-card-text) {
  padding: 0.5rem 1.5rem 1.5rem;
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

/* Dense spacing */
:deep(.v-row.dense) {
  margin: -4px;
}

:deep(.v-row.dense > .v-col) {
  padding: 4px;
}
</style>