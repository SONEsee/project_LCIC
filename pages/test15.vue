<template>
  <div class="utility-tracker">
    <!-- Header -->
    <div class="header-section">
      <div class="container">
        <h1 class="page-title">
          <v-icon class="mr-2" size="24">mdi-database-sync</v-icon>
          ການຕິດຕາມການອັບໂຫຼດຂໍ້ມູນໄຟຟ້າ
        </h1>
        
        <!-- Step 1: Province Selection -->
        <div class="controls-section">
          <v-row dense>
            <v-col cols="12" md="3">
              <v-text-field
                v-model="username"
                label="ຊື່ຜູ້ໃຊ້"
                variant="outlined"
                density="compact"
                prepend-inner-icon="mdi-account"
                required
              />
            </v-col>
            
            <v-col cols="12" md="3">
              <v-select
                v-model="selectedProvince"
                :items="provinces"
                item-title="pro_name"
                item-value="pro_id"
                label="ເລືອກແຂວງ"
                variant="outlined"
                density="compact"
                prepend-inner-icon="mdi-map-marker"
                @update:model-value="onProvinceChange"
                :loading="loadingProvinces"
                required
              />
            </v-col>
            
            <v-col cols="12" md="2">
              <v-text-field
                v-model="selectedMonth"
                label="ເດືອນ (YYYYMM)"
                variant="outlined"
                density="compact"
                prepend-inner-icon="mdi-calendar"
                placeholder="202509"
                :rules="monthRules"
                required
              />
            </v-col>
            
            <v-col cols="12" md="2">
              <v-btn
                color="primary"
                size="small"
                block
                :loading="initializing"
                :disabled="!selectedProvince || !selectedMonth || !username"
                @click="initializeDistricts"
              >
                <v-icon class="mr-1" size="16">mdi-plus</v-icon>
                ເລີ່ມຕົ້ນເມືອງ
              </v-btn>
            </v-col>
            
            <v-col cols="12" md="2">
              <v-btn
                color="grey"
                variant="outlined"
                size="small"
                block
                @click="resetForm"
                :disabled="loading || initializing"
              >
                <v-icon class="mr-1" size="16">mdi-refresh</v-icon>
                ລ້າງຂໍ້ມູນ
              </v-btn>
            </v-col>
          </v-row>
        </div>
      </div>
    </div>

    <!-- Step 2: Districts Display -->
    <div v-if="selectedProvince" class="districts-section">
      <div class="container">
        <v-card class="districts-card">
          <v-card-title class="districts-title">
            <span>ເມືອງໃນ {{ getProvinceName() }} - {{ formatMonth(selectedMonth) }}</span>
            <div class="title-actions">
              <v-btn
                color="success"
                variant="tonal"
                size="small"
                @click="loadDistrictsStatus"
                :loading="loading"
                class="mr-2"
              >
                <v-icon class="mr-1" size="16">mdi-refresh</v-icon>
                ໂຫຼດໃໝ່
              </v-btn>
              <v-btn
                color="warning"
                variant="tonal"
                size="small"
                @click="loadAllDistricts"
                :loading="bulkLoading"
                :disabled="!pendingDistricts.length || !username"
              >
                <v-icon class="mr-1" size="16">mdi-upload-multiple</v-icon>
                ໂຫຼດທັງໝົດ ({{ pendingDistricts.length }})
              </v-btn>
            </div>
          </v-card-title>
          
          <!-- Districts Table -->
          <v-data-table
            :headers="headers"
            :items="districts"
            :loading="loading"
            class="elevation-0 custom-table"
            item-key="dis_id"
            density="compact"
          >
            <!-- District Name -->
            <template v-slot:item.district="{ item }">
              <div>
                <div class="font-weight-medium">{{ item.dis_name }}</div>
                <div class="text-caption text-medium-emphasis">ລະຫັດເມືອງ: {{ item.dis_id }}</div>
              </div>
            </template>
            
            <!-- Status -->
            <template v-slot:item.status="{ item }">
              <v-chip
                :color="getStatusColor(item.status || 'not_initialized')"
                size="small"
                variant="flat"
                class="status-chip"
              >
                <v-icon class="mr-1" size="12">{{ getStatusIcon(item.status || 'not_initialized') }}</v-icon>
                {{ formatStatus(item.status || 'not_initialized') }}
              </v-chip>
            </template>
            
            <!-- Records Info -->
            <template v-slot:item.records="{ item }">
              <div v-if="item.total_records">
                <div class="font-weight-medium">{{ formatNumber(item.total_records) }} ທັງໝົດ</div>
                <div class="text-caption" v-if="item.processed_records">
                  <span class="text-success">{{ formatNumber(item.processed_records) }} ປະມວນຜົນແລ້ວ</span>
                  <span v-if="item.failed_records" class="text-error ml-1">
                    • {{ formatNumber(item.failed_records) }} ລົ້ມເຫຼວ
                  </span>
                </div>
              </div>
              <span v-else class="text-medium-emphasis">ບໍ່ມີຂໍ້ມູນ</span>
            </template>
            
            <!-- Success Rate -->
            <template v-slot:item.success_rate="{ item }">
              <div class="d-flex align-center" v-if="item.total_records > 0">
                <v-progress-circular
                  :model-value="parseFloat(item.success_rate_formatted || 0)"
                  :color="getSuccessColor(parseFloat(item.success_rate_formatted || 0))"
                  size="24"
                  width="2"
                  class="mr-2"
                >
                  <span class="text-caption">{{ Math.round(parseFloat(item.success_rate_formatted || 0)) }}%</span>
                </v-progress-circular>
              </div>
              <span v-else class="text-medium-emphasis">-</span>
            </template>

            <!-- Data Size -->
            <template v-slot:item.data_size="{ item }">
              <div v-if="item.formatted_size">
                <div class="font-weight-medium">{{ item.formatted_size }}</div>
                <div class="text-caption text-medium-emphasis" v-if="item.data_size_mb">
                  {{ item.data_size_mb.toFixed(2) }} MB
                </div>
              </div>
              <div v-else-if="item.upload_started && item.status === 'in_progress'">
                <div class="text-warning font-weight-medium">ກຳລັງປະມວນຜົນ...</div>
                <div class="text-caption">ເລີ່ມຕົ້ນ: {{ formatTime(item.upload_started) }}</div>
              </div>
              <span v-else class="text-medium-emphasis">ບໍ່ມີຂໍ້ມູນ</span>
            </template>
            
            <!-- Upload Time -->
            <template v-slot:item.upload_time="{ item }">
              <div v-if="item.upload_completed">
                <div class="font-weight-medium">{{ formatDate(item.upload_completed) }}</div>
                <div class="text-caption text-medium-emphasis">
                  {{ formatTime(item.upload_completed) }}
                  <span v-if="item.upload_duration" class="ml-1">({{ item.upload_duration }})</span>
                </div>
              </div>
              <div v-else-if="item.upload_started && item.status === 'in_progress'">
                <div class="text-warning font-weight-medium">ກຳລັງດຳເນີນການ</div>
                <div class="text-caption">ເລີ່ມຕົ້ນ: {{ formatTime(item.upload_started) }}</div>
              </div>
              <span v-else class="text-medium-emphasis">ຍັງບໍ່ໄດ້ເລີ່ມຕົ້ນ</span>
            </template>
            
            <!-- Actions -->
            <template v-slot:item.actions="{ item }">
              <div class="d-flex gap-1">
                <v-btn
                  :color="getActionColor(item.status)"
                  size="x-small"
                  variant="flat"
                  :loading="item.loading"
                  :disabled="!username || item.status === 'in_progress'"
                  @click="loadDistrictData(item)"
                >
                  <v-icon class="mr-1" size="12">{{ getActionIcon(item.status) }}</v-icon>
                  {{ getActionText(item.status) }}
                </v-btn>
                <v-btn
                  icon="mdi-information-outline"
                  size="x-small"
                  variant="text"
                  @click="showDetails(item)"
                  :disabled="!item.id"
                />
              </div>
            </template>
          </v-data-table>
        </v-card>
      </div>
    </div>

    <!-- Step 3: Progress Monitoring - Details Dialog -->
    <v-dialog v-model="detailsDialog" max-width="700">
      <v-card v-if="selectedItem" class="details-card">
        <v-card-title class="details-title">
          <v-icon class="mr-2" size="20">mdi-information</v-icon>
          ລາຍລະອຽດການອັບໂຫຼດ - {{ selectedItem.dis_name }}
        </v-card-title>
        <v-card-text class="details-content">
          <div class="mb-3">
            <h4>{{ selectedItem.pro_name }} - {{ selectedItem.dis_name }}</h4>
            <p class="text-medium-emphasis">ເດືອນ: {{ formatMonth(selectedItem.upload_month) }}</p>
          </div>
          
          <!-- Progress Stats -->
          <v-row class="mb-3" dense>
            <v-col cols="4">
              <v-card variant="outlined" class="stats-card">
                <v-card-text class="text-center pa-3">
                  <div class="text-h6 font-weight-bold text-primary">{{ formatNumber(selectedItem.total_records) }}</div>
                  <div class="text-caption">ຈຳນວນບັນທຶກທັງໝົດ</div>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="4">
              <v-card variant="outlined" class="stats-card">
                <v-card-text class="text-center pa-3">
                  <div class="text-h6 font-weight-bold text-success">{{ formatNumber(selectedItem.processed_records) }}</div>
                  <div class="text-caption">ປະມວນຜົນແລ້ວ</div>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="4">
              <v-card variant="outlined" class="stats-card">
                <v-card-text class="text-center pa-3">
                  <div class="text-h6 font-weight-bold text-info">{{ selectedItem.formatted_size || 'N/A' }}</div>
                  <div class="text-caption">ຂະໜາດຂໍ້ມູນ</div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
          
          <!-- Activity Logs -->
          <div v-if="detailLogs.length" class="mt-3">
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
          <div v-else class="text-center text-medium-emphasis py-3">
            ບໍ່ມີບັນທຶກກິດຈະກຳ
          </div>
        </v-card-text>
        <v-card-actions class="details-actions">
          <v-spacer />
          <v-btn variant="text" @click="detailsDialog = false">ປິດ</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Bulk Progress Dialog -->
    <v-dialog 
      v-model="bulkProgressDialog" 
      max-width="500" 
      :persistent="!bulkProgress.isComplete"
    >
      <v-card class="bulk-progress-card">
        <v-card-title class="bulk-progress-title">
          <v-icon class="mr-2" size="20">mdi-upload-multiple</v-icon>
          ຄວາມຄືບໜ້າການອັບໂຫຼດທັງໝົດ
        </v-card-title>
        <v-card-text class="bulk-progress-content">
          <div class="text-center mb-3">
            <v-progress-circular
              :model-value="bulkProgress.percentage"
              size="60"
              width="6"
              color="primary"
            >
              {{ bulkProgress.percentage }}%
            </v-progress-circular>
          </div>
          <p class="text-center">
            ກຳລັງປະມວນຜົນ {{ bulkProgress.current }} ຈາກ {{ bulkProgress.total }} ເມືອງ
          </p>
          <div class="text-center text-caption mb-2">
            <span class="text-success">✓ {{ bulkProgress.completed }} ສຳເລັດແລ້ວ</span> | 
            <span class="text-error">✗ {{ bulkProgress.failed }} ລົ້ມເຫຼວ</span>
          </div>
          <v-progress-linear
            :model-value="bulkProgress.percentage"
            color="primary"
            height="6"
            rounded
            class="mt-2"
          />
          
          <!-- Current District -->
          <div v-if="bulkProgress.currentDistrict" class="mt-2 text-center">
            <v-chip size="small" color="info">
              ກຳລັງປະມວນຜົນ: {{ bulkProgress.currentDistrict }}
            </v-chip>
          </div>
        </v-card-text>
        <v-card-actions class="bulk-progress-actions">
          <v-spacer />
          <v-btn 
            variant="text" 
            @click="cancelBulkUpload"
            size="small"
          >
            {{ bulkProgress.isComplete ? 'ປິດ' : 'ຍົກເລີກ' }}
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
import { ref, computed, onMounted, reactive } from 'vue'
import axios from 'axios'

// Configuration
const config = useRuntimeConfig()
const apiUrl = computed(() => config.public.apiUrl || 'http://192.168.45.56:8000/')

// Reactive Data
const username = ref('system')
const selectedProvince = ref(null)
const selectedMonth = ref(new Date().toISOString().slice(0, 7).replace('-', ''))
const loading = ref(false)
const loadingProvinces = ref(false)
const initializing = ref(false)
const bulkLoading = ref(false)
const detailsDialog = ref(false)
const bulkProgressDialog = ref(false)

// Data
const provinces = ref([])
const districts = ref([])
const selectedItem = ref(null)
const detailLogs = ref([])

// Bulk Progress
const bulkProgress = reactive({
  total: 0,
  current: 0,
  completed: 0,
  failed: 0,
  percentage: 0,
  isComplete: false,
  currentDistrict: ''
})

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
  v => /^\d{6}$/.test(v) || 'ຮູບແບບຕ້ອງເປັນ YYYYMM (ເຊັ່ນ: 202509)'
]

// Table Headers - Updated to Lao with styling class
const headers = [
  { title: 'ເມືອງ', value: 'district', sortable: false, class: 'table-header' },
  { title: 'ສະຖານະ', value: 'status', sortable: true, class: 'table-header' },
  { title: 'ຂໍ້ມູນ', value: 'records', sortable: false, class: 'table-header' },
  { title: 'ອັດຕາສຳເລັດ', value: 'success_rate', sortable: false, class: 'table-header' },
  { title: 'ຂະໜາດຂໍ້ມູນ', value: 'data_size', sortable: false, class: 'table-header' },
  { title: 'ວັນເວລາການນຳສົ່ງ', value: 'upload_time', sortable: false, class: 'table-header' },
  { title: 'ການກະທຳ', value: 'actions', sortable: false, align: 'center', class: 'table-header' },
]

// Computed Properties
const pendingDistricts = computed(() => 
  districts.value.filter(item => 
    !item.status || item.status === 'pending' || item.status === 'failed'
  )
)

// Reset Form Function
const resetForm = () => {
  selectedProvince.value = null
  selectedMonth.value = new Date().toISOString().slice(0, 7).replace('-', '')
  username.value = 'system'
  districts.value = []
  
  showNotification('ລ້າງຂໍ້ມູນສຳເລັດແລ້ວ', 'info')
}

// API Methods
const loadProvinces = async () => {
  loadingProvinces.value = true
  try {
    const response = await axios.get(`${apiUrl.value}api/provinces/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    })
    provinces.value = response.data
    console.log('Loaded provinces:', provinces.value)
    showNotification('ໂຫຼດຂໍ້ມູນແຂວງສຳເລັດແລ້ວ', 'success')
  } catch (error) {
    console.error('Error loading provinces:', error)
    showNotification('ການໂຫຼດຂໍ້ມູນແຂວງລົ້ມເຫຼວ', 'error')
  } finally {
    loadingProvinces.value = false
  }
}

const onProvinceChange = async () => {
  console.log('Province changed to:', selectedProvince.value)
  if (selectedProvince.value) {
    await loadDistrictsForProvince()
    await loadDistrictsStatus()
  } else {
    districts.value = []
  }
}

const loadDistrictsForProvince = async () => {
  if (!selectedProvince.value) return
  
  loading.value = true
  try {
    const response = await axios.get(`${apiUrl.value}api/districts/`, {
      params: { province_id: selectedProvince.value },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    })
    
    // Initialize districts with empty tracking data
    districts.value = response.data.map(district => ({
      ...district,
      status: null,
      total_records: 0,
      processed_records: 0,
      failed_records: 0,
      success_rate_formatted: '0',
      formatted_size: null,
      data_size_mb: 0,
      upload_started: null,
      upload_completed: null,
      upload_duration: null,
      created_at: null,
      updated_at: null,
      upload_month: null,
      user_upload: null,
      status_color: null,
      id: null,
      loading: false
    }))
    
    showNotification(`ໂຫຼດ ${districts.value.length} ເມືອງແລ້ວ`, 'success')
  } catch (error) {
    console.error('Error loading districts:', error)
    showNotification('ການໂຫຼດຂໍ້ມູນເມືອງລົ້ມເຫຼວ', 'error')
  } finally {
    loading.value = false
  }
}

const loadDistrictsStatus = async () => {
  if (!selectedProvince.value || !selectedMonth.value) return
  
  loading.value = true
  try {
    const response = await axios.get(`${apiUrl.value}api/upload-tracking/`, {
      params: {
        province_id: selectedProvince.value,
        month: selectedMonth.value
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    })
    
    const trackingData = response.data.data || []
    console.log('Tracking data received:', trackingData)
    
    // Log individual items to debug data structure
    if (trackingData.length > 0) {
      console.log('Sample tracking item:', trackingData[0])
      console.log('Available fields:', Object.keys(trackingData[0]))
    }
    
    // Merge tracking data with districts
    districts.value = districts.value.map(district => {
      const tracking = trackingData.find(t => t.dis_id === district.dis_id)
      
      if (tracking) {
        console.log(`District ${district.dis_name} (${district.dis_id}):`)
        console.log('- Raw tracking data:', tracking)
        console.log('- success_rate_formatted:', tracking.success_rate_formatted)
        console.log('- formatted_size:', tracking.formatted_size)
        console.log('- data_size_mb:', tracking.data_size_mb)
        
        // Merge all tracking data with district data
        return {
          ...district,
          ...tracking, // This includes all fields from your tracking data
          // Ensure key fields are properly set
          success_rate_formatted: tracking.success_rate_formatted || '0',
          formatted_size: tracking.formatted_size || null,
          data_size_mb: tracking.data_size_mb || 0
        }
      }
      return district
    })
    
    console.log('Final districts data:', districts.value)
    
  } catch (error) {
    console.error('Error loading districts status:', error)
    // Don't show error here as it's expected when no tracking data exists
  } finally {
    loading.value = false
  }
}

const initializeDistricts = async () => {
  if (!selectedProvince.value || !selectedMonth.value || !username.value) {
    showNotification('ກະລຸນາຕື່ມຂໍ້ມູນໃຫ້ຄົບຖ້ວນ', 'error')
    return
  }

  initializing.value = true
  try {
    const response = await axios.post(`${apiUrl.value}api/initialize-districts/`, {
      province_id: selectedProvince.value,
      month: selectedMonth.value,
      username: username.value
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    })

    showNotification(response.data.message, 'success')
    await loadDistrictsStatus()
  } catch (error) {
    console.error('Error initializing districts:', error)
    showNotification(error.response?.data?.error || 'ການເລີ່ມຕົ້ນລົ້ມເຫຼວ', 'error')
  } finally {
    initializing.value = false
  }
}

const loadDistrictData = async (district) => {
  if (!username.value) {
    showNotification('ກະລຸນາໃສ່ຊື່ຜູ້ໃຊ້', 'error')
    return
  }

  district.loading = true
  try {
    const response = await axios.post(`${apiUrl.value}api/upload-data/`, {
      province_code: district.pro_id,
      district_code: district.dis_id,
      dateRequest: selectedMonth.value,
      username: username.value
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    })

    if (response.data && !response.data.error) {
      showNotification(
        `${district.dis_name}: ${response.data.processed_records}/${response.data.total_records} ບັນທຶກອັບໂຫຼດແລ້ວ`,
        'success'
      )
      await loadDistrictsStatus()
    } else {
      showNotification(response.data.error || 'ການອັບໂຫຼດລົ້ມເຫຼວ', 'error')
    }
  } catch (error) {
    console.error('Upload error:', error)
    showNotification(error.response?.data?.error || 'ການອັບໂຫຼດລົ້ມເຫຼວ', 'error')
  } finally {
    district.loading = false
  }
}

const loadAllDistricts = async () => {
  if (!username.value) {
    showNotification('ກະລຸນາໃສ່ຊື່ຜູ້ໃຊ້', 'error')
    return
  }

  const pending = pendingDistricts.value
  if (pending.length === 0) {
    showNotification('ບໍ່ມີເມືອງທີ່ລໍຖ້າການປະມວນຜົນ', 'info')
    return
  }

  // Initialize bulk progress
  bulkProgress.total = pending.length
  bulkProgress.current = 0
  bulkProgress.completed = 0
  bulkProgress.failed = 0
  bulkProgress.percentage = 0
  bulkProgress.isComplete = false
  bulkProgress.currentDistrict = ''
  
  bulkLoading.value = true
  bulkProgressDialog.value = true

  try {
    for (let i = 0; i < pending.length; i++) {
      const district = pending[i]
      bulkProgress.current = i + 1
      bulkProgress.currentDistrict = district.dis_name
      
      try {
        const response = await axios.post(`${apiUrl.value}api/upload-data/`, {
          province_code: district.pro_id,
          district_code: district.dis_id,
          dateRequest: selectedMonth.value,
          username: username.value
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
          }
        })

        if (response.data && !response.data.error) {
          bulkProgress.completed++
        } else {
          bulkProgress.failed++
        }
      } catch (error) {
        console.error(`Failed to upload ${district.dis_name}:`, error)
        bulkProgress.failed++
      }

      bulkProgress.percentage = Math.round(((bulkProgress.completed + bulkProgress.failed) / bulkProgress.total) * 100)
      
      // Small delay between requests
      if (i < pending.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
    }

    bulkProgress.isComplete = true
    bulkProgress.currentDistrict = 'ສຳເລັດແລ້ວ'
    await loadDistrictsStatus()
    
    showNotification(
      `ການອັບໂຫຼດທັງໝົດສຳເລັດແລ້ວ: ${bulkProgress.completed} ສຳເລັດ, ${bulkProgress.failed} ລົ້ມເຫຼວ`,
      bulkProgress.failed > 0 ? 'warning' : 'success'
    )
  } catch (error) {
    console.error('Bulk upload error:', error)
    showNotification('ການອັບໂຫຼດທັງໝົດລົ້ມເຫຼວ', 'error')
  } finally {
    bulkLoading.value = false
  }
}

const showDetails = async (district) => {
  if (!district.id) {
    showNotification('ບໍ່ມີຂໍ້ມູນການຕິດຕາມສຳລັບເມືອງນີ້', 'info')
    return
  }
  
  selectedItem.value = district
  
  try {
    const response = await axios.get(`${apiUrl.value}api/upload-tracking/${district.id}/`, {
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

const cancelBulkUpload = () => {
  if (bulkProgress.isComplete) {
    bulkProgressDialog.value = false
  } else {
    bulkLoading.value = false
    bulkProgressDialog.value = false
    
    // Clear all individual loading states
    districts.value.forEach(d => {
      if (d.loading) d.loading = false
    })
    
    showNotification('ຍົກເລີກການອັບໂຫຼດທັງໝົດແລ້ວ', 'warning')
  }
}

// Add a utility function to clear all loading states
const clearAllLoadingStates = () => {
  districts.value.forEach(d => {
    if (d.loading) d.loading = false
  })
  loading.value = false
  bulkLoading.value = false
  initializing.value = false
}

// Utility Methods
const getProvinceName = () => {
  const province = provinces.value.find(p => p.pro_id === selectedProvince.value)
  return province ? province.pro_name : 'ແຂວງທີ່ເລືອກ'
}

const getStatusColor = (status) => {
  const colors = {
    completed: 'success',
    pending: 'warning',
    in_progress: 'info',
    failed: 'error',
    partial: 'orange',
    not_initialized: 'grey'
  }
  return colors[status] || 'grey'
}

const getStatusIcon = (status) => {
  const icons = {
    completed: 'mdi-check-circle',
    pending: 'mdi-clock-outline',
    in_progress: 'mdi-loading',
    failed: 'mdi-alert-circle',
    partial: 'mdi-alert-circle-outline',
    not_initialized: 'mdi-help-circle'
  }
  return icons[status] || 'mdi-help-circle'
}

const getActionColor = (status) => {
  if (!status || status === 'not_initialized') return 'grey'
  return status === 'completed' ? 'orange' : 'primary'
}

const getActionIcon = (status) => {
  if (!status || status === 'not_initialized') return 'mdi-plus'
  return status === 'completed' ? 'mdi-refresh' : 'mdi-upload'
}

const getActionText = (status) => {
  if (!status || status === 'not_initialized') return 'ເລີ່ມຕົ້ນ'
  return status === 'completed' ? 'ໂຫຼດໃໝ່' : 'ໂຫຼດ'
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
    ERROR: 'error'
  }
  return colors[level] || 'grey'
}

// Formatting Methods
const formatStatus = (status) => {
  const statusMap = {
    not_initialized: 'ຍັງບໍ່ໄດ້ເລີ່ມຕົ້ນ',
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

const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}

const formatTime = (date) => {
  return new Date(date).toLocaleTimeString()
}

const formatDateTime = (date) => {
  return new Date(date).toLocaleString()
}

const formatMonth = (month) => {
  if (!month || month.length !== 6) return month
  const year = month.substring(0, 4)
  const mon = month.substring(4, 6)
  const date = new Date(year, mon - 1)
  return date.toLocaleDateString('lo-LA', { month: 'long', year: 'numeric' })
}

const showNotification = (message, color = 'success') => {
  notification.message = message
  notification.color = color
  notification.show = true
}

// Lifecycle
onMounted(async () => {
  await loadProvinces()
})
</script>

<style scoped>
.utility-tracker {
  min-height: 100vh;
  background: #fafafa;
}

.header-section {
  background: #ffffff;
  color: #333;
  padding: 1.5rem 0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  border-bottom: 1px solid #e0e0e0;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  color: #333;
}

.controls-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid #e0e0e0;
}

.districts-section {
  padding: 1.5rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.districts-card {
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  border: 1px solid #e0e0e0;
  background: #ffffff;
}

.districts-title {
  padding: 1rem 1.5rem 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  color: #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
}

.title-actions {
  display: flex;
  gap: 0.5rem;
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
  padding: 8px 12px !important;
}

:deep(.custom-table .v-data-table-header__content) {
  font-weight: 600;
  color: #495057;
  font-size: 0.875rem;
}

:deep(.custom-table .v-data-table__tr) {
  border-bottom: 1px solid #f0f0f0;
}

:deep(.custom-table .v-data-table__tr:hover) {
  background: #f8f9fa;
}

:deep(.custom-table .v-data-table__td) {
  padding: 6px 12px !important;
  border-bottom: 1px solid #f0f0f0;
  font-size: 0.875rem;
}

/* Chips */
.status-chip {
  font-size: 0.75rem;
  font-weight: 500;
}

/* Details Dialog */
.details-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

.details-title {
  padding: 1rem 1.5rem 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  color: #333;
  border-bottom: 1px solid #f0f0f0;
}

.details-content {
  padding: 1rem 1.5rem;
}

.details-actions {
  padding: 0.5rem 1.5rem 1rem;
}

.stats-card {
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background: #ffffff;
}

.activity-timeline {
  max-height: 300px;
  overflow-y: auto;
}

/* Bulk Progress Dialog */
.bulk-progress-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

.bulk-progress-title {
  padding: 1rem 1.5rem 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  color: #333;
  border-bottom: 1px solid #f0f0f0;
}

.bulk-progress-content {
  padding: 1rem 1.5rem;
}

.bulk-progress-actions {
  padding: 0.5rem 1.5rem 1rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .page-title {
    font-size: 1.5rem;
    flex-direction: column;
    text-align: center;
  }
  
  .controls-section {
    padding: 0.75rem;
  }
  
  .districts-title {
    flex-direction: column;
    gap: 0.75rem;
    align-items: flex-start;
  }
  
  .title-actions {
    width: 100%;
    justify-content: flex-end;
  }
  
  .details-content {
    padding: 0.75rem 1rem;
  }
  
  .bulk-progress-content {
    padding: 0.75rem 1rem;
  }
}

/* Vuetify Overrides */
:deep(.v-card-title) {
  font-weight: 500;
  font-size: 1rem;
}

:deep(.v-card-text) {
  padding: 1rem 1.5rem;
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

/* Progress circular sizing */
:deep(.v-progress-circular) {
  font-size: 0.7rem;
}

/* Timeline styling */
:deep(.v-timeline-item__body) {
  padding-bottom: 0.5rem;
}
</style>