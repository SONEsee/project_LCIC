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
                  placeholder="122024"
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
  
      <!-- Upload Status Section -->
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
                  :loading="loading"
                  class="mr-2"
                >
                  <v-icon class="mr-1" size="16">mdi-refresh</v-icon>
                  ໂຫຼດສະຖານະ
                </v-btn>
              </div>
            </v-card-title>
            
            <!-- Status Display -->
            <v-card-text class="status-content">
              <div v-if="currentTracking">
                <!-- Status Overview -->
                <v-row class="mb-4" dense>
                  <v-col cols="12" md="3">
                    <v-card variant="outlined" class="stats-card">
                      <v-card-text class="text-center pa-3">
                        <div class="d-flex align-center justify-center mb-2">
                          <v-chip
                            :color="getStatusColor(currentTracking.status)"
                            size="small"
                            variant="flat"
                          >
                            <v-icon class="mr-1" size="12">{{ getStatusIcon(currentTracking.status) }}</v-icon>
                            {{ formatStatus(currentTracking.status) }}
                          </v-chip>
                        </div>
                        <div class="text-caption">ສະຖານະປະຈຸບັນ</div>
                      </v-card-text>
                    </v-card>
                  </v-col>
                  
                  <v-col cols="12" md="3">
                    <v-card variant="outlined" class="stats-card">
                      <v-card-text class="text-center pa-3">
                        <div class="text-h6 font-weight-bold text-primary">{{ formatNumber(currentTracking.total_records) }}</div>
                        <div class="text-caption">ຈຳນວນບັນທຶກທັງໝົດ</div>
                      </v-card-text>
                    </v-card>
                  </v-col>
                  
                  <v-col cols="12" md="3">
                    <v-card variant="outlined" class="stats-card">
                      <v-card-text class="text-center pa-3">
                        <div class="text-h6 font-weight-bold text-success">{{ formatNumber(currentTracking.processed_records) }}</div>
                        <div class="text-caption">ປະມວນຜົນແລ້ວ</div>
                      </v-card-text>
                    </v-card>
                  </v-col>
                  
                  <v-col cols="12" md="3">
                    <v-card variant="outlined" class="stats-card">
                      <v-card-text class="text-center pa-3">
                        <div class="text-h6 font-weight-bold text-info">{{ currentTracking.formatted_size || 'N/A' }}</div>
                        <div class="text-caption">ຂະໜາດຂໍ້ມູນ</div>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
  
                <!-- Progress and Timing -->
                <v-row class="mb-4" dense>
                  <v-col cols="12" md="6">
                    <v-card variant="outlined" class="stats-card">
                      <v-card-text class="pa-3">
                        <div class="d-flex align-center justify-space-between mb-2">
                          <span class="text-caption">ອັດຕາສຳເລັດ</span>
                          <span class="font-weight-bold">{{ currentTracking.success_rate_formatted || '0.0' }}%</span>
                        </div>
                        <v-progress-linear
                          :model-value="parseFloat(currentTracking.success_rate_formatted || 0)"
                          :color="getSuccessColor(parseFloat(currentTracking.success_rate_formatted || 0))"
                          height="6"
                          rounded
                        />
                      </v-card-text>
                    </v-card>
                  </v-col>
                  
                  <v-col cols="12" md="6">
                    <v-card variant="outlined" class="stats-card">
                      <v-card-text class="pa-3">
                        <div class="text-caption mb-1">ເວລາອັບໂຫຼດ</div>
                        <div v-if="currentTracking.upload_completed" class="font-weight-medium">
                          {{ formatDateTime(currentTracking.upload_completed) }}
                          <div class="text-caption text-medium-emphasis" v-if="currentTracking.upload_duration">
                            ໃຊ້ເວລາ: {{ formatDuration(currentTracking.upload_duration) }}
                          </div>
                        </div>
                        <div v-else-if="currentTracking.upload_started && currentTracking.status === 'in_progress'" class="text-warning">
                          ກຳລັງດຳເນີນການ...
                          <div class="text-caption">ເລີ່ມຕົ້ນ: {{ formatDateTime(currentTracking.upload_started) }}</div>
                        </div>
                        <span v-else class="text-medium-emphasis">ຍັງບໍ່ໄດ້ເລີ່ມຕົ້ນ</span>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
  
                <!-- Background Processing Notice -->
                <v-alert
                  v-if="currentTracking.status === 'in_progress'"
                  type="info"
                  variant="tonal"
                  class="mb-4"
                  text="ການປະມວນຜົນຂໍ້ມູນຂະໜາດໃຫຍ່ກຳລັງດຳເນີນການໃນພື້ນຫຼັງ ກະລຸນາລໍຖ້າ..."
                  prominent
                >
                  <template v-slot:prepend>
                    <v-progress-circular
                      indeterminate
                      size="20"
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
                  class="mb-4"
                  :text="currentTracking.error_message"
                />
  
                <!-- Action Buttons -->
                <div class="d-flex gap-2 justify-center">
                  <v-btn
                    color="info"
                    variant="outlined"
                    size="small"
                    @click="showDetails"
                    :disabled="!currentTracking.id"
                  >
                    <v-icon class="mr-1" size="16">mdi-information-outline</v-icon>
                    ຂໍ້ມູນລາຍລະອຽດ
                  </v-btn>
                  
                  <v-btn
                    v-if="currentTracking.status === 'completed' || currentTracking.status === 'failed'"
                    color="orange"
                    variant="outlined"
                    size="small"
                    @click="reuploadData"
                    :loading="uploading"
                  >
                    <v-icon class="mr-1" size="16">mdi-refresh</v-icon>
                    ອັບໂຫຼດໃໝ່
                  </v-btn>
                </div>
              </div>
  
              <!-- No Tracking Found -->
              <div v-else class="text-center py-8">
                <v-icon size="64" color="grey-lighten-2" class="mb-4">mdi-water-off</v-icon>
                <h3 class="text-medium-emphasis mb-2">ບໍ່ມີການຕິດຕາມສຳລັບເດືອນນີ້</h3>
                <p class="text-medium-emphasis mb-4">ກະລຸນາເລີ່ມຕົ້ນການຕິດຕາມກ່ອນອັບໂຫຼດຂໍ້ມູນ</p>
              </div>
            </v-card-text>
          </v-card>
        </div>
      </div>
  
      <!-- Details Dialog -->
      <v-dialog v-model="detailsDialog" max-width="700">
        <v-card v-if="currentTracking" class="details-card">
          <v-card-title class="details-title">
            <v-icon class="mr-2" size="20">mdi-information</v-icon>
            ລາຍລະອຽດການອັບໂຫຼດນ້ຳປະປາ - {{ formatMonth(currentTracking.upload_month) }}
          </v-card-title>
          <v-card-text class="details-content">
            <div class="mb-4">
              <h4>{{ currentTracking.description || `ການອັບໂຫຼດເດືອນ ${formatMonth(currentTracking.upload_month)}` }}</h4>
              <p class="text-medium-emphasis">ຜູ້ອັບໂຫຼດ: {{ currentTracking.user_upload }}</p>
            </div>
            
            <!-- Activity Logs -->
            <div v-if="detailLogs.length" class="mt-4">
              <h4 class="mb-3">ບັນທຶກກິດຈະກຳ</h4>
              <v-timeline density="compact" side="end" class="activity-timeline">
                <v-timeline-item
                  v-for="log in detailLogs"
                  :key="log.id"
                  :dot-color="getLogColor(log.log_level)"
                  size="small"
                >
                  <div>
                    <div class="font-weight-medium">{{ log.message }}</div>
                    <div class="text-caption text-medium-emphasis">
                      {{ formatDateTime(log.timestamp) }}
                    </div>
                    <v-chip
                      :color="getLogColor(log.log_level)"
                      size="x-small"
                      class="mt-1"
                    >
                      {{ log.log_level }}
                    </v-chip>
                  </div>
                </v-timeline-item>
              </v-timeline>
            </div>
            <div v-else class="text-center text-medium-emphasis py-4">
              ບໍ່ມີບັນທຶກກິດຈະກຳ
            </div>
          </v-card-text>
          <v-card-actions class="details-actions">
            <v-spacer />
            <v-btn variant="text" @click="detailsDialog = false">ປິດ</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  
      <!-- Upload Progress Dialog -->
      <v-dialog 
        v-model="uploadProgressDialog" 
        max-width="400" 
        :persistent="uploading"
      >
        <v-card class="upload-progress-card">
          <v-card-title class="upload-progress-title">
            <v-icon class="mr-2" size="20">mdi-water</v-icon>
            ການອັບໂຫຼດຂໍ້ມູນນ້ຳປະປາ
          </v-card-title>
          <v-card-text class="upload-progress-content">
            <div class="text-center mb-4">
              <v-progress-circular
                v-if="uploading"
                indeterminate
                size="60"
                width="6"
                color="primary"
              />
              <v-icon v-else-if="uploadResult && !uploadResult.error" size="60" color="success">
                mdi-check-circle
              </v-icon>
              <v-icon v-else-if="uploadResult && uploadResult.error" size="60" color="error">
                mdi-alert-circle
              </v-icon>
            </div>
            
            <p class="text-center mb-2">
              <span v-if="uploading">ກຳລັງເລີ່ມຕົ້ນການອັບໂຫຼດ...</span>
              <span v-else-if="uploadResult && !uploadResult.error">ເລີ່ມຕົ້ນສຳເລັດແລ້ວ!</span>
              <span v-else-if="uploadResult && uploadResult.error">ການເລີ່ມຕົ້ນລົ້ມເຫຼວ</span>
            </p>
            
            <div v-if="uploadResult" class="text-center text-caption">
              <div v-if="uploadResult.status === 'in_progress'" class="text-info">
                ການປະມວນຜົນຂະໜາດໃຫຍ່ເລີ່ມແລ້ວໃນພື້ນຫຼັງ
              </div>
              <div v-if="uploadResult.total_records">
                ຈຳນວນບັນທຶກ: {{ formatNumber(uploadResult.total_records) }}
              </div>
              <div v-if="uploadResult.processed_records">
                ປະມວນຜົນ: {{ formatNumber(uploadResult.processed_records) }}
              </div>
              <div v-if="uploadResult.error" class="text-error mt-2">
                {{ uploadResult.error }}
              </div>
            </div>
          </v-card-text>
          <v-card-actions class="upload-progress-actions">
            <v-spacer />
            <v-btn 
              variant="text" 
              @click="closeUploadDialog"
              :disabled="uploading"
              size="small"
            >
              {{ uploading ? 'ກຳລັງເລີ່ມຕົ້ນ...' : 'ປິດ' }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  
      <!-- Notification -->
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
  import { ref, computed, onMounted, reactive, watch } from 'vue'
  import axios from 'axios'

  definePageMeta({
    title: 'ການຕິດຕາມການອັບໂຫຼດນ້ຳປະປາ',
    meta: [
      {
        name: 'description',
        content: 'ຫນ້ານີ້ໃຫ້ທ່ານສາมາດຕິດຕາມສະຖານະການອັບໂຫຼດແລະຈໍາໜ່າຍນ້ຳປະປາ'
      }
    ],
    middleware: "auth",
    layout: "backend",

  })
  
  // Configuration
  const config = useRuntimeConfig()
  
  // Reactive Data - API token removed, now handled in backend
  const username = ref('system')
  const selectedMonth = ref('')
  const loading = ref(false)
  const initializing = ref(false)
  const uploading = ref(false)
  const detailsDialog = ref(false)
  const uploadProgressDialog = ref(false)
  
  // Data
  const currentTracking = ref(null)
  const detailLogs = ref([])
  const uploadResult = ref(null)
  
  // Notification
  const notification = reactive({
    show: false,
    message: '',
    color: 'success',
    timeout: 5000
  })
  
  // Validation Rules
  const monthRules = [
    v => !!v || 'ເດືອນແມ່ນຈຳເປັນ',
    v => /^\d{6}$/.test(v) || 'ຮູບແບບຕ້ອງເປັນ MMYYYY (ເຊັ່ນ: 122024)',
    v => {
      if (!/^\d{6}$/.test(v)) return true // Skip if format is wrong
      const month = parseInt(v.substring(0, 2))
      return (month >= 1 && month <= 12) || 'ເດືອນຕ້ອງຢູ່ລະຫວ່າງ 01-12'
    }
  ]
  
  // Computed Properties
  const canUpload = computed(() => {
    return currentTracking.value && (
      !currentTracking.value.status || 
      currentTracking.value.status === 'pending' || 
      currentTracking.value.status === 'failed' ||
      currentTracking.value.status === 'completed'
    )
  })
  
  // Initialize default month (current month in MMYYYY format)
  const initializeDefaultMonth = () => {
    const now = new Date()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const year = String(now.getFullYear())
    selectedMonth.value = month + year
  }
  
  // API Methods
  const initializeTracking = async () => {
    if (!selectedMonth.value || !username.value) {
      showNotification('ກະລຸນາຕື່ມຂໍ້ມູນໃຫ້ຄົບຖ້ວນ', 'error')
      return
    }
  
    initializing.value = true
    try {
      const response = await axios.post(`${config.public.strapi.url}api/water/initialize/`, {
        month: selectedMonth.value,
        username: username.value
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      })
  
      showNotification(response.data.message, 'success')
      await loadTrackingStatus()
    } catch (error) {
      console.error('Error initializing tracking:', error)
      showNotification(error.response?.data?.error || 'ການເລີ່ມຕົ້ນລົ້ມເຫຼວ', 'error')
    } finally {
      initializing.value = false
    }
  }
  
  const uploadWaterData = async () => {
    if (!selectedMonth.value || !username.value) {
      showNotification('ກະລຸນາຕື່ມຂໍ້ມູນໃຫ້ຄົບຖ້ວນ', 'error')
      return
    }
  
    uploading.value = true
    uploadProgressDialog.value = true
    uploadResult.value = null
  
    try {
      const response = await axios.post(`${config.public.strapi.url}api/water/upload/`, {
        month: selectedMonth.value,
        username: username.value
        // API token removed - now handled automatically in backend
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      })
  
      uploadResult.value = response.data
      
      if (response.data && !response.data.error) {
        const message = response.data.processed_records 
          ? `ອັບໂຫຼດສຳເລັດ: ${response.data.processed_records}/${response.data.total_records} ບັນທຶກ`
          : response.data.message || 'ການອັບໂຫຼດເລີ່ມແລ້ວ'
        
        showNotification(message, 'success')
        
        // Auto-refresh status every 5 seconds if processing in background
        if (response.data.status === 'in_progress') {
          startStatusPolling()
        }
        
        await loadTrackingStatus()
      } else {
        showNotification(response.data.error || 'ການອັບໂຫຼດລົ້ມເຫຼວ', 'error')
      }
    } catch (error) {
      console.error('Upload error:', error)
      uploadResult.value = { error: error.response?.data?.error || 'ການອັບໂຫຼດລົ້ມເຫຼວ' }
      showNotification(error.response?.data?.error || 'ການອັບໂຫຼດລົ້ມເຫຼວ', 'error')
    } finally {
      uploading.value = false
    }
  }
  
  // Status polling for background processing
  let statusPollingInterval = null
  
  const startStatusPolling = () => {
    if (statusPollingInterval) {
      clearInterval(statusPollingInterval)
    }
    
    statusPollingInterval = setInterval(async () => {
      await loadTrackingStatus()
      
      // Stop polling if completed or failed
      if (currentTracking.value && 
          ['completed', 'failed', 'partial'].includes(currentTracking.value.status)) {
        clearInterval(statusPollingInterval)
        statusPollingInterval = null
      }
    }, 5000) // Poll every 5 seconds
  }
  
  const loadTrackingStatus = async () => {
    if (!selectedMonth.value) return
  
    loading.value = true
    try {
      const response = await axios.get(`${config.public.strapi.url}api/water/tracking/`, {
        params: { month: selectedMonth.value },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      })
  
      const trackingData = response.data.data || []
      currentTracking.value = trackingData.length > 0 ? trackingData[0] : null
      
      // Add formatted size if missing
      if (currentTracking.value && !currentTracking.value.formatted_size && currentTracking.value.data_size_mb) {
        currentTracking.value.formatted_size = formatFileSize(currentTracking.value.data_size_mb)
      }
      
    } catch (error) {
      console.error('Error loading tracking status:', error)
      currentTracking.value = null
    } finally {
      loading.value = false
    }
  }
  
  const showDetails = async () => {
    if (!currentTracking.value?.id) {
      showNotification('ບໍ່ມີຂໍ້ມູນການຕິດຕາມ', 'info')
      return
    }
    
    try {
      const response = await axios.get(`${config.public.strapi.url}api/water/tracking/${currentTracking.value.id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      })
      if (response.data && response.data.logs) {
        detailLogs.value = response.data.logs
      }
      
    } catch (error) {
      console.error('Error loading details:', error)
      detailLogs.value = []
    }
    
    detailsDialog.value = true
  }
  
  const reuploadData = async () => {
    await uploadWaterData()
  }
  
  const closeUploadDialog = () => {
    uploadProgressDialog.value = false
    uploadResult.value = null
  }
  
  const resetForm = () => {
    selectedMonth.value = ''
    username.value = 'system'
    currentTracking.value = null
    detailLogs.value = []
    
    // Clear status polling
    if (statusPollingInterval) {
      clearInterval(statusPollingInterval)
      statusPollingInterval = null
    }
    
    initializeDefaultMonth()
    
    showNotification('ລ້າງຂໍ້ມູນສຳເລັດແລ້ວ', 'info')
  }
  
  // Utility Methods
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
  
  const getStatusIcon = (status) => {
    const icons = {
      completed: 'mdi-check-circle',
      pending: 'mdi-clock-outline',
      in_progress: 'mdi-loading',
      failed: 'mdi-alert-circle',
      partial: 'mdi-alert-circle-outline'
    }
    return icons[status] || 'mdi-help-circle'
  }
  
  const getSuccessColor = (rate) => {
    if (rate >= 95) return 'success'
    if (rate >= 80) return 'warning'
    return 'error'
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
    return new Date(date).toLocaleString()
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
  
  const formatFileSize = (size_mb) => {
    if (!size_mb || size_mb < 1) {
      return `${(size_mb * 1024).toFixed(1)} KB`
    } else if (size_mb < 1024) {
      return `${size_mb.toFixed(1)} MB`
    } else {
      return `${(size_mb / 1024).toFixed(1)} GB`
    }
  }
  
  const showNotification = (message, color = 'success') => {
    notification.message = message
    notification.color = color
    notification.show = true
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
    color: rgb(58, 58, 58);
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
  
  .stats-card {
    border: 1px solid #e3f2fd;
    border-radius: 8px;
    background: #fafafa;
    transition: all 0.3s ease;
  }
  
  .stats-card:hover {
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    transform: translateY(-1px);
  }
  
  /* Dialog Styling */
  .details-card, .upload-progress-card {
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  }
  
  .details-title, .upload-progress-title {
    padding: 1.5rem 2rem 1rem;
    font-size: 1.1rem;
    font-weight: 500;
    color: #1565c0;
    border-bottom: 1px solid #e3f2fd;
  }
  
  .details-content, .upload-progress-content {
    padding: 2rem;
  }
  
  .details-actions, .upload-progress-actions {
    padding: 1rem 2rem 1.5rem;
  }
  
  .activity-timeline {
    max-height: 300px;
    overflow-y: auto;
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
    
    .details-content, .upload-progress-content {
      padding: 1rem;
    }
  }
  
  /* Custom scrollbar for timeline */
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
  
  .activity-timeline::-webkit-scrollbar-thumb:hover {
    background: #a1a1a1;
  }
  
  /* Vuetify Overrides */
  :deep(.v-card-title) {
    font-weight: 500;
  }
  
  :deep(.v-btn) {
    text-transform: none;
    border-radius: 8px;
    font-weight: 500;
  }
  
  :deep(.v-text-field .v-field) {
    border-radius: 8px;
  }
  
  :deep(.v-select .v-field) {
    border-radius: 8px;
  }
  
  :deep(.v-chip) {
    border-radius: 6px;
  }
  
  :deep(.v-progress-linear) {
    border-radius: 3px;
  }
  
  :deep(.v-progress-circular) {
    font-size: 0.75rem;
  }
  </style>