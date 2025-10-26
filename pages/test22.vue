<template>
  <div class="water-supply-tracker">
    <!-- Header -->
    <div class="header-section">
      <div class="container">
        <h1 class="page-title">
          <v-icon class="mr-2" size="24">mdi-water</v-icon>
          ການຕິດຕາມການອັບໂຫຼດຂໍ້ມູນນ້ຳປະປາ
        </h1>
        
        <!-- Controls Section -->
        <div class="controls-section">
          <v-row dense>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="username"
                label="ຊື່ຜູ້ໃຊ້"
                variant="outlined"
                density="compact"
                prepend-inner-icon="mdi-account"
                required
              />
            </v-col>
            
            <v-col cols="12" md="4">
              <v-text-field
                v-model="selectedMonth"
                label="ເດືອນ (MMYYYY)"
                variant="outlined"
                density="compact"
                prepend-inner-icon="mdi-calendar"
                placeholder="102025"
                :rules="monthRules"
                required
              />
            </v-col>
            
            <v-col cols="12" md="1">
              <v-btn
                color="primary"
                size="small"
                block
                :loading="initializing"
                :disabled="!selectedMonth || !username"
                @click="initializeTracking"
              >
                <v-icon class="mr-1" size="16">mdi-plus</v-icon>
                ເລີ່ມ
              </v-btn>
            </v-col>
            
            <v-col cols="12" md="2">
              <v-btn
                color="success"
                size="small"
                block
                :loading="uploading"
                :disabled="!selectedMonth || !username || !canUpload"
                @click="uploadWaterData"
              >
                <v-icon class="mr-1" size="16">mdi-upload</v-icon>
                ອັບໂຫຼດ
              </v-btn>
            </v-col>
            
            <v-col cols="12" md="1">
              <v-btn
                color="grey"
                variant="outlined"
                size="small"
                block
                @click="resetForm"
                :disabled="loading || uploading || initializing"
              >
                <v-icon class="mr-1" size="16">mdi-refresh</v-icon>
                ລ້າງ
              </v-btn>
            </v-col>
          </v-row>
        </div>
      </div>
    </div>

    <!-- COMBINED: Upload Status & District Statistics Section -->
    <div v-if="selectedMonth" class="status-section">
      <div class="container">
        <v-card class="status-card">
          <v-card-title class="status-title">
            <span>ສະຖານະການອັບໂຫຼດ - {{ formatMonth(selectedMonth) }}</span>
            <div class="title-actions">
              <v-btn
                color="info"
                variant="tonal"
                size="small"
                @click="loadTrackingStatus"
                :loading="loading || loadingStats"
                class="mr-2"
              >
                <v-icon class="mr-1" size="16">mdi-refresh</v-icon>
                ໂຫຼດຂໍ້ມູນ
              </v-btn>
            </div>
          </v-card-title>
          
          <!-- Status Display -->
          <v-card-text class="status-content">
            <div v-if="currentTracking">
              <!-- Status Overview Grid - Minimal Style -->
              <v-row class="mb-4" dense>
                <!-- Status Badge -->
                <v-col cols="12" md="2">
                  <div class="stat-item">
                    <div class="stat-label">ສະຖານະ</div>
                    <v-chip
                      :color="getStatusColor(currentTracking.status)"
                      size="small"
                      variant="flat"
                    >
                      {{ formatStatus(currentTracking.status) }}
                    </v-chip>
                  </div>
                </v-col>

                <!-- Total Bills (from District Stats if available) -->
                <v-col cols="12" md="2">
                  <div class="stat-item">
                    <div class="stat-label">ຈຳນວນບິນທັງໝົດ</div>
                    <div class="stat-value text-primary">{{ formatNumber(districtStats?.total_bills || currentTracking.total_records) }}</div>
                  </div>
                </v-col>

                <!-- Customers -->
                <v-col cols="12" md="2">
                  <div class="stat-item">
                    <div class="stat-label">ຈຳນວນລູກຄ້າ</div>
                    <div class="stat-value text-success">{{ formatNumber(districtStats?.total_customers || 0) }}</div>
                  </div>
                </v-col>

                <!-- Provinces -->
                <v-col cols="12" md="2">
                  <div class="stat-item">
                    <div class="stat-label">ຈຳນວນແຂວງ</div>
                    <div class="stat-value text-info">{{ districtStats?.provinces?.length || 0 }}</div>
                  </div>
                </v-col>
                
                <!-- Success Rate -->
                <v-col cols="12" md="2">
                  <div class="stat-item">
                    <div class="stat-label">ອັດຕາສຳເລັດ</div>
                    <div class="stat-value" :class="getSuccessRateClass(currentTracking.success_rate_formatted)">
                      {{ currentTracking.success_rate_formatted || '0.0' }}%
                    </div>
                  </div>
                </v-col>
                
                <!-- Data Size -->
                <v-col cols="12" md="2">
                  <div class="stat-item">
                    <div class="stat-label">ຂະໜາດຂໍ້ມູນ</div>
                    <div class="stat-value">{{ currentTracking.formatted_size || 'N/A' }}</div>
                  </div>
                </v-col>
              </v-row>

              <!-- Upload Time Info - Minimal -->
              <v-row class="mb-4" dense>
                <v-col cols="12">
                  <div class="time-info">
                    <span class="time-label">ເວລາອັບໂຫຼດ:</span>
                    <span v-if="currentTracking.upload_completed" class="time-value">
                      {{ formatDateTime(currentTracking.upload_completed) }}
                      <span v-if="currentTracking.upload_duration" class="duration-badge">
                        ({{ formatDuration(currentTracking.upload_duration) }})
                      </span>
                    </span>
                    <span v-else-if="currentTracking.upload_started && currentTracking.status === 'in_progress'" class="time-value text-warning">
                      ກຳລັງດຳເນີນການ... (ເລີ່ມ: {{ formatDateTime(currentTracking.upload_started) }})
                    </span>
                    <span v-else class="time-value text-medium-emphasis">ຍັງບໍ່ໄດ້ເລີ່ມຕົ້ນ</span>
                  </div>
                </v-col>
              </v-row>

              <!-- Background Processing Notice -->
              <v-alert
                v-if="currentTracking.status === 'in_progress'"
                type="info"
                variant="tonal"
                density="compact"
                class="mb-4"
                text="ການປະມວນຜົນຂໍ້ມູນຂະໜາດໃຫຍ່ກຳລັງດຳເນີນການໃນພື້ນຫຼັງ ກະລຸນາລໍຖ້າ..."
              >
                <template v-slot:prepend>
                  <v-progress-circular
                    indeterminate
                    size="18"
                    width="2"
                    color="info"
                  />
                </template>
              </v-alert>

              <!-- Error Message -->
              <v-alert
                v-if="currentTracking.error_message"
                type="error"
                variant="tonal"
                density="compact"
                class="mb-4"
                :text="currentTracking.error_message"
              />

              <!-- District Statistics Display - Minimal Style -->
              <div v-if="districtStats && districtStats.provinces && districtStats.provinces.length > 0" class="district-section">
                <v-divider class="my-4" />
                
                <h3 class="section-subtitle mb-3">ລາຍລະອຽດຕາມເຂດ</h3>

                <v-expansion-panels variant="accordion" class="district-panels-minimal">
                  <v-expansion-panel
                    v-for="province in districtStats.provinces"
                    :key="province.pro_id"
                    class="province-panel-minimal"
                  >
                    <v-expansion-panel-title class="province-header-minimal">
                      <div class="province-title-container">
                        <span class="province-name">{{ province.pro_name }}</span>
                        <span class="province-code">({{ province.pro_id }})</span>
                        <v-spacer />
                        <v-chip size="x-small" color="primary" variant="flat" class="bill-count-chip">
                          {{ formatNumber(province.total_bills) }} ບິນ
                        </v-chip>
                      </div>
                    </v-expansion-panel-title>

                    <v-expansion-panel-text class="district-content-minimal">
                      <div class="district-list-minimal">
                        <div
                          v-for="district in province.districts"
                          :key="district.dis_id"
                          class="district-item-minimal"
                        >
                          <div class="district-info">
                            <span class="district-name">{{ district.dis_name }}</span>
                            <span class="district-code">({{ district.dis_id }})</span>
                          </div>
                          <div class="district-count">
                            {{ formatNumber(district.total_bills) }} ບິນ
                          </div>
                        </div>
                      </div>
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>
              </div>

              <!-- Action Buttons -->
              <div class="action-buttons mt-4">
                <v-btn
                  color="info"
                  variant="outlined"
                  size="small"
                  @click="showDetails"
                  :disabled="!currentTracking.id"
                >
                  <v-icon class="mr-1" size="16">mdi-information-outline</v-icon>
                  ລາຍລະອຽດ
                </v-btn>
                
                <v-btn
                  v-if="currentTracking.status === 'completed' || currentTracking.status === 'failed'"
                  color="orange"
                  variant="outlined"
                  size="small"
                  @click="reuploadData"
                  :loading="uploading"
                  class="ml-2"
                >
                  <v-icon class="mr-1" size="16">mdi-refresh</v-icon>
                  ອັບໂຫຼດໃໝ່
                </v-btn>
              </div>
            </div>

            <div v-else class="text-center py-6">
              <v-icon size="48" color="grey-lighten-1" class="mb-2">mdi-database-off-outline</v-icon>
              <p class="text-medium-emphasis">ບໍ່ມີຂໍ້ມູນສຳລັບເດືອນນີ້</p>
              <p class="text-caption text-medium-emphasis">ກົດປຸ່ມ "ເລີ່ມ" ເພື່ອສ້າງການຕິດຕາມໃໝ່</p>
            </div>
          </v-card-text>
        </v-card>
      </div>
    </div>

    <!-- Details Dialog -->
    <v-dialog v-model="detailsDialog" max-width="800" scrollable>
      <v-card class="details-card">
        <v-card-title class="details-title">
          <span>ລາຍລະອຽດການອັບໂຫຼດ</span>
          <v-btn icon size="small" variant="text" @click="detailsDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="details-content">
          <v-progress-linear v-if="loadingDetails" indeterminate color="primary" class="mb-4" />
          
          <div v-if="trackingDetails && !loadingDetails">
            <!-- Overview -->
            <v-row class="mb-4" dense>
              <v-col cols="12" md="6">
                <div class="detail-item">
                  <div class="detail-label">ເດືອນ</div>
                  <div class="detail-value">{{ formatMonth(trackingDetails.upload_month) }}</div>
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="detail-item">
                  <div class="detail-label">ຜູ້ອັບໂຫຼດ</div>
                  <div class="detail-value">{{ trackingDetails.user_upload }}</div>
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="detail-item">
                  <div class="detail-label">ສະຖານະ</div>
                  <v-chip :color="getStatusColor(trackingDetails.status)" size="small">
                    {{ formatStatus(trackingDetails.status) }}
                  </v-chip>
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="detail-item">
                  <div class="detail-label">ເວລາສຳເລັດ</div>
                  <div class="detail-value">{{ trackingDetails.upload_completed ? formatDateTime(trackingDetails.upload_completed) : 'N/A' }}</div>
                </div>
              </v-col>
            </v-row>

            <v-divider class="my-4" />

            <!-- Activity Timeline -->
            <div class="activity-section">
              <h3 class="text-subtitle-1 font-weight-bold mb-3">ປະຫວັດການດຳເນີນການ</h3>
              <div class="activity-timeline">
                <v-timeline side="end" density="compact" class="mt-2">
                  <v-timeline-item
                    v-for="(log, index) in trackingDetails.logs"
                    :key="index"
                    :dot-color="getLogColor(log.log_level)"
                    size="small"
                  >
                    <div class="log-item">
                      <div class="log-message">{{ log.message }}</div>
                      <div class="log-time text-caption">{{ formatDateTime(log.created_at) }}</div>
                    </div>
                  </v-timeline-item>
                </v-timeline>
              </div>
            </div>
          </div>
        </v-card-text>

        <v-card-actions class="details-actions">
          <v-spacer />
          <v-btn color="primary" variant="text" @click="detailsDialog = false">
            ປິດ
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Notification Snackbar -->
    <v-snackbar
      v-model="notification.show"
      :color="notification.color"
      :timeout="3000"
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
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import axios from 'axios'

// Runtime Config
const config = useRuntimeConfig()

// API Base URL from runtime config
const API_BASE = computed(() => `${config.public.strapi.url}api/water`)

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token')
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
}

// State
const username = ref('')
const selectedMonth = ref('')
const currentTracking = ref(null)
const trackingDetails = ref(null)
const districtStats = ref(null)

// Loading States
const loading = ref(false)
const initializing = ref(false)
const uploading = ref(false)
const loadingDetails = ref(false)
const loadingStats = ref(false)

// Dialog States
const detailsDialog = ref(false)

// Notification
const notification = ref({
  show: false,
  message: '',
  color: 'success'
})

// Polling
let statusPollingInterval = null

// Month Validation
const monthRules = [
  (v) => !!v || 'ກະລຸນາປ້ອນເດືອນ',
  (v) => /^\d{6}$/.test(v) || 'ຮູບແບບບໍ່ຖືກຕ້ອງ (MMYYYY)'
]

// Computed
const canUpload = computed(() => {
  return currentTracking.value && 
         (currentTracking.value.status === 'pending' || 
          currentTracking.value.status === 'failed' ||
          currentTracking.value.status === 'completed')
})

// Initialize Default Month
const initializeDefaultMonth = () => {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const year = String(now.getFullYear())
  selectedMonth.value = `${month}${year}`
}

// API Functions with Axios
const initializeTracking = async () => {
  if (!selectedMonth.value || !username.value) {
    showNotification('ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບຖ້ວນ', 'error')
    return
  }

  initializing.value = true
  try {
    const response = await axios.post(`${API_BASE.value}/initialize/`, {
      month: selectedMonth.value,
      username: username.value
    }, {
      headers: getAuthHeaders()
    })

    if (response.data) {
      showNotification(response.data.message, 'success')
      await loadTrackingStatus()
    }
  } catch (error) {
    console.error('Initialize error:', error)
    const errorMessage = error.response?.data?.error || error.response?.data?.message || 'ການເລີ່ມຕົ້ນລົ້ມເຫຼວ'
    showNotification(errorMessage, 'error')
  } finally {
    initializing.value = false
  }
}

const uploadWaterData = async () => {
  if (!selectedMonth.value || !username.value) {
    showNotification('ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບຖ້ວນ', 'error')
    return
  }

  uploading.value = true
  try {
    const response = await axios.post(`${API_BASE.value}/upload/`, {
      month: selectedMonth.value,
      username: username.value
    }, {
      headers: getAuthHeaders()
    })

    if (response.data) {
      showNotification(response.data.message, 'success')
      await loadTrackingStatus()
      
      // Start polling for status updates
      startStatusPolling()
    }
  } catch (error) {
    console.error('Upload error:', error)
    const errorMessage = error.response?.data?.error || error.response?.data?.message || 'ການອັບໂຫຼດລົ້ມເຫຼວ'
    showNotification(errorMessage, 'error')
  } finally {
    uploading.value = false
  }
}

const loadTrackingStatus = async () => {
  if (!selectedMonth.value) return

  loading.value = true
  try {
    const response = await axios.get(`${API_BASE.value}/tracking/`, {
      params: { month: selectedMonth.value },
      headers: getAuthHeaders()
    })

    if (response.data?.data && response.data.data.length > 0) {
      currentTracking.value = response.data.data[0]
      
      // Auto-load district statistics if upload is completed
      if (currentTracking.value.status === 'completed') {
        await loadDistrictStatistics()
      }
    } else {
      currentTracking.value = null
      districtStats.value = null
    }
  } catch (error) {
    console.error('Load tracking error:', error)
    if (error.response?.status === 401) {
      showNotification('ກະລຸນາເຂົ້າສູ່ລະບົບກ່ອນ', 'error')
    }
  } finally {
    loading.value = false
  }
}

const loadDistrictStatistics = async () => {
  if (!selectedMonth.value) return

  loadingStats.value = true
  try {
    const response = await axios.get(`${API_BASE.value}/statistics/districts/`, {
      params: { month: selectedMonth.value },
      headers: getAuthHeaders()
    })

    if (response.data) {
      districtStats.value = response.data
    }
  } catch (error) {
    console.error('Load district statistics error:', error)
    if (error.response?.status !== 401) {
      showNotification('ບໍ່ສາມາດໂຫຼດສະຖິຕິໄດ້', 'warning')
    }
    districtStats.value = null
  } finally {
    loadingStats.value = false
  }
}

const showDetails = async () => {
  if (!currentTracking.value?.id) return

  detailsDialog.value = true
  loadingDetails.value = true

  try {
    const response = await axios.get(`${API_BASE.value}/tracking/${currentTracking.value.id}/`, {
      headers: getAuthHeaders()
    })

    if (response.data) {
      trackingDetails.value = response.data
    }
  } catch (error) {
    console.error('Load details error:', error)
    showNotification('ບໍ່ສາມາດໂຫຼດລາຍລະອຽດໄດ້', 'error')
  } finally {
    loadingDetails.value = false
  }
}

const reuploadData = async () => {
  await uploadWaterData()
}

const resetForm = () => {
  username.value = ''
  initializeDefaultMonth()
  currentTracking.value = null
  districtStats.value = null
  if (statusPollingInterval) {
    clearInterval(statusPollingInterval)
    statusPollingInterval = null
  }
}

// Polling Functions
const startStatusPolling = () => {
  if (statusPollingInterval) {
    clearInterval(statusPollingInterval)
  }

  statusPollingInterval = setInterval(async () => {
    if (currentTracking.value && currentTracking.value.status === 'in_progress') {
      await loadTrackingStatus()
    } else {
      clearInterval(statusPollingInterval)
      statusPollingInterval = null
    }
  }, 5000)
}

// Helper Functions
const getStatusColor = (status) => {
  const colors = {
    pending: 'orange',
    in_progress: 'blue',
    completed: 'success',
    failed: 'error',
    partial: 'warning'
  }
  return colors[status] || 'grey'
}

const getStatusIcon = (status) => {
  const icons = {
    pending: 'mdi-clock-outline',
    in_progress: 'mdi-loading',
    completed: 'mdi-check-circle',
    failed: 'mdi-alert-circle',
    partial: 'mdi-alert'
  }
  return icons[status] || 'mdi-help-circle'
}

const getSuccessRateClass = (rate) => {
  const numRate = parseFloat(rate)
  if (numRate >= 90) return 'text-success'
  if (numRate >= 70) return 'text-warning'
  return 'text-error'
}

const getLogColor = (level) => {
  const colors = {
    INFO: 'primary',
    WARNING: 'warning',
    ERROR: 'error',
    SUCCESS: 'success'
  }
  return colors[level] || 'grey'
}

// Formatting Methods
const formatStatus = (status) => {
  const statusMap = {
    pending: 'ລໍຖ້າ',
    in_progress: 'ກຳລັງດຳເນີນການ',
    completed: 'ສຳເລັດແລ້ວ',
    failed: 'ລົ້ມເຫຼວ',
    partial: 'ບາງສ່ວນ'
  }
  return statusMap[status] || status
}

const formatNumber = (num) => {
  return num?.toLocaleString() || '0'
}

const formatDateTime = (date) => {
  return new Date(date).toLocaleString('lo-LA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatDuration = (seconds) => {
  if (!seconds) return ''
  if (seconds < 60) return `${seconds.toFixed(0)}ວິນາທີ`
  if (seconds < 3600) return `${(seconds / 60).toFixed(1)}ນາທີ`
  return `${(seconds / 3600).toFixed(1)}ຊົ່ວໂມງ`
}

const formatMonth = (month) => {
  if (!month || month.length !== 6) return month
  const monthPart = month.substring(0, 2)
  const yearPart = month.substring(2, 6)
  
  const monthNames = [
    'ມັງກອນ', 'ກຸມພາ', 'ມີນາ', 'ເມສາ', 'ພຶດສະພາ', 'ມິຖຸນາ',
    'ກໍລະກົດ', 'ສິງຫາ', 'ກັນຍາ', 'ຕຸລາ', 'ພະຈິກ', 'ທັນວາ'
  ]
  
  const monthIndex = parseInt(monthPart) - 1
  return `${monthNames[monthIndex] || monthPart} ${yearPart}`
}

const showNotification = (message, color = 'success') => {
  notification.value.message = message
  notification.value.color = color
  notification.value.show = true
}

// Watch for month changes to auto-load status
watch(selectedMonth, async (newMonth) => {
  if (newMonth && newMonth.length === 6) {
    await loadTrackingStatus()
  }
})

// Lifecycle
onMounted(async () => {
  initializeDefaultMonth()
})

// Cleanup on unmount
onUnmounted(() => {
  if (statusPollingInterval) {
    clearInterval(statusPollingInterval)
  }
})
</script>

<style scoped>
.water-supply-tracker {
  min-height: 100vh;
  background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
}

.header-section {
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
  padding: 2rem 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

.page-title {
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  color: white;
}

.controls-section {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.status-section {
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.status-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  border: 1px solid #e3f2fd;
  background: white;
}

.status-title {
  padding: 1.5rem 2rem 1rem;
  font-size: 1.1rem;
  font-weight: 500;
  color: #1565c0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e3f2fd;
}

.status-content {
  padding: 2rem;
}

/* Minimal Stat Items */
.stat-item {
  padding: 0.5rem;
  text-align: center;
}

.stat-label {
  font-size: 0.75rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1;
}

/* Time Info */
.time-info {
  padding: 0.75rem 1rem;
  background: #f5f5f5;
  border-radius: 8px;
  font-size: 0.875rem;
}

.time-label {
  font-weight: 500;
  color: #666;
  margin-right: 0.5rem;
}

.time-value {
  color: #333;
}

.duration-badge {
  color: #1976d2;
  font-weight: 500;
}

/* District Section - Minimal */
.district-section {
  margin-top: 1.5rem;
}

.section-subtitle {
  font-size: 1rem;
  font-weight: 600;
  color: #1565c0;
}

.district-panels-minimal {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.province-panel-minimal {
  border-bottom: 1px solid #e0e0e0;
}

.province-panel-minimal:last-child {
  border-bottom: none;
}

.province-header-minimal {
  padding: 0.75rem 1rem;
  min-height: auto !important;
}

.province-title-container {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 0.5rem;
}

.province-name {
  font-weight: 500;
  font-size: 0.95rem;
}

.province-code {
  color: #666;
  font-size: 0.85rem;
}

.bill-count-chip {
  font-size: 0.75rem !important;
}

.district-content-minimal {
  padding: 0 !important;
}

.district-list-minimal {
  border-top: 1px solid #e0e0e0;
}

.district-item-minimal {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.625rem 1rem;
  border-bottom: 1px solid #f5f5f5;
  font-size: 0.875rem;
}

.district-item-minimal:last-child {
  border-bottom: none;
}

.district-item-minimal:hover {
  background: #fafafa;
}

.district-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.district-name {
  font-weight: 400;
}

.district-code {
  color: #999;
  font-size: 0.8rem;
}

.district-count {
  color: #1976d2;
  font-weight: 500;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 0.5rem;
}

/* Dialog Styling */
.details-card {
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
}

.details-title {
  padding: 1.5rem 2rem 1rem;
  font-size: 1.1rem;
  font-weight: 500;
  color: #1565c0;
  border-bottom: 1px solid #e3f2fd;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.details-content {
  padding: 2rem;
}

.details-actions {
  padding: 1rem 2rem 1.5rem;
}

.detail-item {
  margin-bottom: 1rem;
}

.detail-label {
  font-size: 0.75rem;
  color: #666;
  margin-bottom: 0.25rem;
}

.detail-value {
  font-size: 0.95rem;
  font-weight: 500;
}

.activity-timeline {
  max-height: 400px;
  overflow-y: auto;
}

.log-item {
  padding: 0.5rem 0;
}

.log-message {
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.log-time {
  color: #999;
}

/* Responsive Design */
@media (max-width: 768px) {
  .page-title {
    font-size: 1.5rem;
    text-align: center;
  }
  
  .controls-section {
    padding: 1rem;
  }
  
  .status-content {
    padding: 1rem;
  }
  
  .details-content {
    padding: 1rem;
  }

  .stat-value {
    font-size: 1.25rem;
  }
}

/* Custom scrollbar */
.activity-timeline::-webkit-scrollbar {
  width: 4px;
}

.activity-timeline::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.activity-timeline::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

/* Vuetify Overrides */
:deep(.v-btn) {
  text-transform: none;
  border-radius: 8px;
  font-weight: 500;
}

:deep(.v-text-field .v-field) {
  border-radius: 8px;
}

:deep(.v-chip) {
  border-radius: 6px;
}

:deep(.v-expansion-panel-title) {
  font-weight: 400;
}

:deep(.v-expansion-panel-text__wrapper) {
  padding: 0 !important;
}
</style>