<template>
  <div class="electric-upload-system">
    <!-- Header with Period Selection -->
    <v-card class="header-card mb-6" elevation="3">
      <v-card-text class="pa-8">
        <v-row align="center" dense>
          <v-col cols="12" md="2">
            <div class="d-flex align-center">
              <v-icon color="primary" size="36" class="mr-3">mdi-lightning-bolt</v-icon>
              <div>
                <h1 class="text-h5 font-weight-bold">ລະບົບອັບໂຫຼດໄຟຟ້າ</h1>
                <div class="text-caption text-medium-emphasis">Electric Upload System</div>
              </div>
            </div>
          </v-col>
          
          <v-col cols="12" md="3">
            <v-select
              v-model="selectedPeriod"
              :items="periodOptions"
              label="ເລືອກເດືອນ-ປີ"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-calendar-month"
              hide-details
            />
          </v-col>
          
          <v-col cols="12" md="2">
            <v-text-field
              v-model="username"
              label="ຊື່ຜູ້ໃຊ້"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-account-circle"
              hide-details
            />
          </v-col>
          
          <v-col cols="12" md="2">
            <v-btn
              color="primary"
              size="large"
              block
              :loading="loadingData"
              :disabled="!selectedPeriod"
              @click="fetchData"
            >
              <v-icon class="mr-2" size="20">mdi-sync</v-icon>
              ໂຫຼດຂໍ້ມູນ
            </v-btn>
          </v-col>
          
          <v-col cols="12" md="2">
            <v-btn
              color="success"
              variant="tonal"
              size="large"
              block
              @click="showSummary = !showSummary"
            >
              <v-icon class="mr-2" size="20">mdi-chart-box-outline</v-icon>
              {{ showSummary ? 'ເຊື່ອງສະຫຼຸບ' : 'ສະຫຼຸບ' }}
            </v-btn>
          </v-col>
          
          <v-col cols="12" md="1">
            <v-btn
              icon
              variant="text"
              size="large"
              @click="fetchData"
              :loading="loadingData"
            >
              <v-icon size="24">mdi-refresh</v-icon>
              <v-tooltip activator="parent" location="bottom">ໂຫຼດໃໝ່</v-tooltip>
            </v-btn>
          </v-col>
        </v-row>
        
        <v-progress-linear
          v-if="loadingData"
          indeterminate
          color="primary"
          class="mt-4"
          height="4"
        />
      </v-card-text>
    </v-card>

    <!-- Summary Section -->
    <v-expand-transition>
      <v-card v-if="showSummary" class="summary-card mb-6" elevation="3">
        <v-card-title class="bg-gradient-primary text-white pa-6">
          <v-icon class="mr-3" size="28">mdi-chart-box</v-icon>
          <span class="text-h6">ສະຫຼຸບລວມ - {{ formatPeriod(selectedPeriod) }}</span>
        </v-card-title>
        <v-card-text class="pa-6">
          <v-row dense>
            <v-col cols="6" md="3">
              <v-card class="stat-card pa-6" elevation="2">
                <div class="text-center">
                  <v-avatar color="primary" size="64" class="mb-3">
                    <v-icon size="32" color="white">mdi-map-marker-multiple</v-icon>
                  </v-avatar>
                  <div class="text-h3 font-weight-bold text-primary">{{ summary.totalProvinces }}</div>
                  <div class="text-subtitle-1 text-medium-emphasis mt-2">ແຂວງທັງໝົດ</div>
                </div>
              </v-card>
            </v-col>
            
            <v-col cols="6" md="3">
              <v-card class="stat-card pa-6" elevation="2">
                <div class="text-center">
                  <v-avatar color="success" size="64" class="mb-3">
                    <v-icon size="32" color="white">mdi-check-circle</v-icon>
                  </v-avatar>
                  <div class="text-h3 font-weight-bold text-success">
                    {{ summary.processedDistricts }}
                  </div>
                  <div class="text-subtitle-1 text-medium-emphasis mt-2">
                    ເມືອງສຳເລັດ / {{ summary.totalDistricts }}
                  </div>
                </div>
              </v-card>
            </v-col>
            
            <v-col cols="6" md="3">
              <v-card class="stat-card pa-6" elevation="2">
                <div class="text-center">
                  <v-avatar color="info" size="64" class="mb-3">
                    <v-icon size="32" color="white">mdi-database</v-icon>
                  </v-avatar>
                  <div class="text-h3 font-weight-bold text-info">{{ formatNumber(summary.totalRecords) }}</div>
                  <div class="text-subtitle-1 text-medium-emphasis mt-2">ບັນທຶກທັງໝົດ</div>
                </div>
              </v-card>
            </v-col>
            
            <v-col cols="6" md="3">
              <v-card class="stat-card pa-6" elevation="2">
                <div class="text-center">
                  <v-avatar color="purple" size="64" class="mb-3">
                    <v-icon size="32" color="white">mdi-clock-outline</v-icon>
                  </v-avatar>
                  <div class="text-subtitle-1 font-weight-bold text-purple mt-2">{{ summary.lastUpdated }}</div>
                  <div class="text-subtitle-1 text-medium-emphasis mt-2">ອັບເດດລ່າສຸດ</div>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-expand-transition>

    <!-- Province Cards with Districts -->
    <div v-if="provinces.length > 0">
      <v-card
        v-for="province in provinces"
        :key="province.pro_id"
        class="province-card mb-6"
        elevation="3"
      >
        <!-- Province Header -->
        <v-card-title
          class="province-header pa-6"
          :class="getProvinceStatusClass(province)"
          @click="toggleProvince(province.pro_id)"
        >
          <v-row align="center" dense>
            <v-col cols="12" md="5">
              <div class="d-flex align-center">
                <v-btn
                  icon
                  variant="flat"
                  size="large"
                  class="mr-3"
                  color="white"
                >
                  <v-icon size="28">
                    {{ expandedProvinces[province.pro_id] ? 'mdi-chevron-down' : 'mdi-chevron-right' }}
                  </v-icon>
                </v-btn>
                
                <v-avatar color="white" size="56" class="mr-4">
                  <v-icon size="32" :color="getProvinceIconColor(province.status)">
                    mdi-map-marker
                  </v-icon>
                </v-avatar>
                
                <div>
                  <div class="text-h5 font-weight-bold text-white mb-1">{{ province.pro_name }}</div>
                  <div class="text-subtitle-2 text-white opacity-90">
                    <v-icon size="18" class="mr-1">mdi-map-marker-outline</v-icon>
                    {{ province.districts.length }} ເມືອງ
                  </div>
                </div>
              </div>
            </v-col>
            
            <v-col cols="12" md="3" class="text-center">
              <v-chip
                :color="getStatusChipColor(province.status)"
                size="large"
                variant="elevated"
                class="font-weight-bold px-6 py-6"
              >
                <v-icon size="20" class="mr-2">{{ getStatusIcon(province.status) }}</v-icon>
                {{ getStatusText(province.status) }}
              </v-chip>
            </v-col>
            
            <v-col cols="12" md="4" class="text-right">
              <v-btn
                color="white"
                variant="elevated"
                size="x-large"
                class="mr-2"
                :loading="province.uploading"
                :disabled="!username"
                @click.stop="uploadAllDistricts(province)"
              >
                <v-icon class="mr-2" size="24">mdi-upload-multiple</v-icon>
                <span class="text-h6">ອັບໂຫຼດທັງໝົດ</span>
              </v-btn>
              
              <v-btn
                color="white"
                variant="outlined"
                size="x-large"
                :loading="province.initializing"
                :disabled="!username"
                @click.stop="initializeProvince(province)"
              >
                <v-icon class="mr-2" size="24">mdi-plus-circle</v-icon>
                <span class="text-h6">ເລີ່ມຕົ້ນ</span>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-title>

        <!-- Districts Table -->
        <v-expand-transition>
          <div v-if="expandedProvinces[province.pro_id]">
            <v-divider />
            
            <v-card-text class="pa-0">
              <v-table class="districts-table">
                <thead>
                  <tr>
                    <th class="text-left pa-4">
                      <v-icon class="mr-2" size="20">mdi-map-marker-outline</v-icon>
                      ເມືອງ
                    </th>
                    <th class="text-center pa-4">
                      <v-icon class="mr-2" size="20">mdi-information-outline</v-icon>
                      ສະຖານະ
                    </th>
                    <th class="text-center pa-4">
                      <v-icon class="mr-2" size="20">mdi-credit-card-check</v-icon>
                      ການຊຳລະ
                    </th>
                    <th class="text-center pa-4">
                      <v-icon class="mr-2" size="20">mdi-account-group</v-icon>
                      ລູກຄ້າ
                    </th>
                    <th class="text-center pa-4">
                      <v-icon class="mr-2" size="20">mdi-clock-outline</v-icon>
                      ວັນທີອັບໂຫຼດ
                    </th>
                    <th class="text-center pa-4">
                      <v-icon class="mr-2" size="20">mdi-cog-outline</v-icon>
                      ການກະທຳ
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="district in province.districts"
                    :key="district.dis_id"
                    class="district-row"
                  >
                    <td class="pa-4">
                      <div class="d-flex align-center">
                        <v-avatar color="primary" size="40" class="mr-3">
                          <v-icon size="20" color="white">mdi-map</v-icon>
                        </v-avatar>
                        <div>
                          <div class="text-subtitle-1 font-weight-bold">{{ district.dis_name }}</div>
                          <div class="text-caption text-medium-emphasis">
                            <v-icon size="14">mdi-identifier</v-icon>
                            {{ district.dis_id }}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td class="text-center pa-4">
                      <v-chip
                        :color="getStatusColor(district.status)"
                        size="default"
                        variant="flat"
                        class="px-4 py-5"
                      >
                        <v-icon size="16" class="mr-1">{{ getStatusIcon(district.status) }}</v-icon>
                        <span class="font-weight-medium">{{ getStatusText(district.status) }}</span>
                      </v-chip>
                    </td>
                    
                    <td class="text-center pa-4">
                      <div class="d-flex align-center justify-center">
                        <v-icon size="20" color="success" class="mr-2">mdi-cash-check</v-icon>
                        <span class="text-h6 font-weight-bold">{{ formatNumber(district.payment_count) }}</span>
                      </div>
                    </td>
                    
                    <td class="text-center pa-4">
                      <div class="d-flex align-center justify-center">
                        <v-icon size="20" color="info" class="mr-2">mdi-account-multiple</v-icon>
                        <span class="text-h6 font-weight-bold">{{ formatNumber(district.customer_count) }}</span>
                      </div>
                    </td>
                    
                    <td class="text-center pa-4">
                      <div v-if="district.upload_completed">
                        <div class="text-subtitle-1 font-weight-medium">{{ formatDate(district.upload_completed) }}</div>
                        <div class="text-caption text-medium-emphasis">{{ formatTime(district.upload_completed) }}</div>
                      </div>
                      <span v-else class="text-medium-emphasis">—</span>
                    </td>
                    
                    <td class="text-center pa-4">
                      <v-btn-group density="comfortable" divided>
                        <v-btn
                          color="primary"
                          :loading="district.loading"
                          :disabled="!username"
                          @click="syncDistrict(province, district)"
                          class="px-4"
                        >
                          <v-icon class="mr-2" size="20">mdi-sync</v-icon>
                          ດຶງຂໍ້ມູນ
                        </v-btn>
                        
                        <v-btn
                          color="info"
                          :disabled="!district.payment_count && !district.customer_count"
                          @click="viewDistrictData(province, district)"
                          class="px-4"
                        >
                          <v-icon class="mr-2" size="20">mdi-eye</v-icon>
                          ເບິ່ງ
                        </v-btn>
                      </v-btn-group>
                    </td>
                  </tr>
                  
                  <tr v-if="province.districts.length === 0">
                    <td colspan="6" class="text-center pa-8">
                      <v-icon size="48" color="grey-lighten-1">mdi-inbox</v-icon>
                      <div class="text-subtitle-1 text-medium-emphasis mt-3">
                        ບໍ່ມີຂໍ້ມູນເມືອງ - ກະລຸນາກົດ "ເລີ່ມຕົ້ນ" ກ່ອນ
                      </div>
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-card-text>
          </div>
        </v-expand-transition>
      </v-card>
    </div>

    <!-- Empty State -->
    <v-card v-else class="empty-state text-center pa-16" elevation="3">
      <v-avatar color="grey-lighten-3" size="120">
        <v-icon size="64" color="grey">mdi-database-off-outline</v-icon>
      </v-avatar>
      <h2 class="text-h5 mt-6 mb-3">ບໍ່ມີຂໍ້ມູນ</h2>
      <p class="text-subtitle-1 text-medium-emphasis mb-6">
        ກະລຸນາເລືອກເດືອນ-ປີ ແລະ ກົດປຸ່ມ "ໂຫຼດຂໍ້ມູນ"
      </p>
      <v-btn
        color="primary"
        size="large"
        :disabled="!selectedPeriod"
        @click="fetchData"
      >
        <v-icon class="mr-2">mdi-sync</v-icon>
        ໂຫຼດຂໍ້ມູນ
      </v-btn>
    </v-card>

    <!-- Detail Dialog -->
    <v-dialog v-model="detailDialog" max-width="1400" scrollable>
      <v-card v-if="selectedDistrict">
        <v-card-title class="bg-primary text-white d-flex align-center justify-space-between pa-6">
          <div class="d-flex align-center">
            <v-icon class="mr-3" size="32">mdi-file-document</v-icon>
            <div>
              <div class="text-h5">ລາຍລະອຽດຂໍ້ມູນ</div>
              <div class="text-subtitle-2 opacity-90">
                {{ selectedProvince?.pro_name }} - {{ selectedDistrict.dis_name }}
              </div>
            </div>
          </div>
          <v-btn
            icon
            variant="text"
            size="large"
            @click="detailDialog = false"
          >
            <v-icon size="28">mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        
        <v-tabs v-model="activeTab" bg-color="grey-lighten-4" height="64">
          <v-tab value="payment" class="text-h6">
            <v-icon class="mr-2" size="24">mdi-credit-card-check</v-icon>
            ການຊຳລະ ({{ formatNumber(paymentData.length) }})
          </v-tab>
          <v-tab value="customer" class="text-h6">
            <v-icon class="mr-2" size="24">mdi-account-group</v-icon>
            ລູກຄ້າ ({{ formatNumber(customerData.length) }})
          </v-tab>
        </v-tabs>
        
        <v-card-text class="pa-0" style="height: 600px;">
          <v-window v-model="activeTab">
            <v-window-item value="payment">
              <div class="pa-6">
                <v-text-field
                  v-model="paymentSearch"
                  prepend-inner-icon="mdi-magnify"
                  label="ຄົ້ນຫາ..."
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  class="mb-4"
                  clearable
                />
                
                <div class="text-caption text-medium-emphasis mb-2">
                  ສະແດງຜົນ {{ paymentData.length }} ລາຍການ
                </div>
              </div>
            </v-window-item>
            
            <v-window-item value="customer">
              <div class="pa-6">
                <v-text-field
                  v-model="customerSearch"
                  prepend-inner-icon="mdi-magnify"
                  label="ຄົ້ນຫາ..."
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  class="mb-4"
                  clearable
                />
                
                <div class="text-caption text-medium-emphasis mb-2">
                  ສະແດງຜົນ {{ customerData.length }} ລາຍການ
                </div>
              </div>
            </v-window-item>
          </v-window>
        </v-card-text>
        
        <v-divider />
        
        <v-card-actions class="pa-6">
          <v-btn
            color="primary"
            variant="elevated"
            size="large"
            @click="refreshDetailData"
            :loading="loadingDetails"
          >
            <v-icon class="mr-2" size="20">mdi-refresh</v-icon>
            ໂຫຼດໃໝ່
          </v-btn>
          
          <v-btn
            color="success"
            variant="tonal"
            size="large"
            @click="downloadCSV"
          >
            <v-icon class="mr-2" size="20">mdi-download</v-icon>
            ດາວໂຫຼດ CSV
          </v-btn>
          
          <v-spacer />
          
          <v-btn
            variant="elevated"
            size="large"
            @click="detailDialog = false"
          >
            ປິດ
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Notification -->
    <v-snackbar
      v-model="notification.show"
      :color="notification.color"
      :timeout="notification.timeout"
      location="top right"
      elevation="24"
    >
      <div class="d-flex align-center">
        <v-icon class="mr-3" size="24">
          {{ notification.color === 'success' ? 'mdi-check-circle' : notification.color === 'error' ? 'mdi-alert-circle' : 'mdi-information' }}
        </v-icon>
        <div>{{ notification.message }}</div>
      </div>
      <template v-slot:actions>
        <v-btn variant="text" @click="notification.show = false">ປິດ</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import axios from 'axios'

const config = useRuntimeConfig()

// State
const selectedPeriod = ref(new Date().toISOString().slice(0, 7).replace('-', ''))
const username = ref('system')
const loadingData = ref(false)
const showSummary = ref(true)
const provinces = ref([])
const expandedProvinces = ref({})

const detailDialog = ref(false)
const selectedDistrict = ref(null)
const selectedProvince = ref(null)
const activeTab = ref('payment')
const paymentSearch = ref('')
const customerSearch = ref('')
const paymentData = ref([])
const customerData = ref([])
const loadingDetails = ref(false)

// Notification
const notification = reactive({
  show: false,
  message: '',
  color: 'success',
  timeout: 5000
})

// Period Options
const periodOptions = computed(() => {
  const options = []
  const currentDate = new Date()
  for (let i = 0; i < 24; i++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    options.push({
      title: `${month}/${year}`,
      value: `${year}${month}`
    })
  }
  return options
})

// Summary
const summary = computed(() => {
  const totalProvinces = provinces.value.length
  const totalDistricts = provinces.value.reduce((sum, p) => sum + p.districts.length, 0)
  const processedDistricts = provinces.value.reduce((sum, p) => 
    sum + p.districts.filter(d => d.status === 'completed').length, 0
  )
  const totalRecords = provinces.value.reduce((sum, p) =>
    sum + p.districts.reduce((s, d) => s + (d.payment_count || 0) + (d.customer_count || 0), 0), 0
  )
  
  const lastUpdatedDistrict = provinces.value
    .flatMap(p => p.districts)
    .filter(d => d.upload_completed)
    .sort((a, b) => new Date(b.upload_completed) - new Date(a.upload_completed))[0]
  
  return {
    totalProvinces,
    totalDistricts,
    processedDistricts,
    totalRecords,
    lastUpdated: lastUpdatedDistrict ? formatDateTime(lastUpdatedDistrict.upload_completed) : 'N/A'
  }
})

// Methods
const fetchData = async () => {
  if (!selectedPeriod.value) {
    showNotification('ກະລຸນາເລືອກເດືອນ-ປີ', 'error')
    return
  }
  
  loadingData.value = true
  try {
    // Load provinces
    const provincesResponse = await axios.get(`${config.public.strapi.url}api/provinces/`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
    })
    
    // Load tracking data for each province
    const provincesData = await Promise.all(
      provincesResponse.data.map(async (province) => {
        const trackingResponse = await axios.get(
          `${config.public.strapi.url}api/upload-tracking/`,
          {
            params: {
              province_id: province.pro_id,
              month: selectedPeriod.value
            },
            headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
          }
        )
        
        const districts = trackingResponse.data.data || []
        
        // Calculate province status
        let provinceStatus = 'not_started'
        if (districts.length > 0) {
          const completedCount = districts.filter(d => d.status === 'completed').length
          if (completedCount === districts.length) {
            provinceStatus = 'done'
          } else if (completedCount > 0) {
            provinceStatus = 'partial'
          } else {
            provinceStatus = 'pending'
          }
        }
        
        return {
          ...province,
          status: provinceStatus,
          districts: districts.map(d => ({
            ...d,
            payment_count: d.processed_records || 0,
            customer_count: d.customer_records || 0,
            loading: false
          })),
          uploading: false,
          initializing: false
        }
      })
    )
    
    provinces.value = provincesData
    
    // Auto-expand first province or provinces with data
    if (provincesData.length > 0) {
      expandedProvinces.value[provincesData[0].pro_id] = true
    }
    
    showNotification('ໂຫຼດຂໍ້ມູນສຳເລັດ', 'success')
  } catch (error) {
    console.error('Error fetching data:', error)
    showNotification('ການໂຫຼດຂໍ້ມູນລົ້ມເຫຼວ', 'error')
  } finally {
    loadingData.value = false
  }
}

const toggleProvince = (provinceId) => {
  expandedProvinces.value[provinceId] = !expandedProvinces.value[provinceId]
}

const initializeProvince = async (province) => {
  if (!username.value) {
    showNotification('ກະລຸນາໃສ່ຊື່ຜູ້ໃຊ້', 'error')
    return
  }
  
  province.initializing = true
  try {
    const response = await axios.post(
      `${config.public.strapi.url}api/initialize-districts/`,
      {
        province_id: province.pro_id,
        month: selectedPeriod.value,
        username: username.value
      },
      {
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        }
      }
    )
    
    showNotification(response.data.message, 'success')
    await fetchData()
  } catch (error) {
    console.error('Initialize error:', error)
    showNotification(error.response?.data?.error || 'ການເລີ່ມຕົ້ນລົ້ມເຫຼວ', 'error')
  } finally {
    province.initializing = false
  }
}

const syncDistrict = async (province, district) => {
  if (!username.value) {
    showNotification('ກະລຸນາໃສ່ຊື່ຜູ້ໃຊ້', 'error')
    return
  }
  
  district.loading = true
  try {
    const response = await axios.post(
      `${config.public.strapi.url}api/upload-data/`,
      {
        province_code: province.pro_id,
        district_code: district.dis_id,
        dateRequest: selectedPeriod.value,
        username: username.value
      },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
      }
    )
    
    if (response.data && !response.data.error) {
      const paymentRecords = response.data.payment_records || {}
      const customerRecords = response.data.customer_records || {}
      
      showNotification(
        `${district.dis_name}: ສຳເລັດ\nການຊຳລະ: ${paymentRecords.processed}/${paymentRecords.total}\nລູກຄ້າ: ${customerRecords.processed}/${customerRecords.total}`,
        'success'
      )
      
      await fetchData()
    }
  } catch (error) {
    console.error('Sync error:', error)
    showNotification(`${district.dis_name}: ການດຶງຂໍ້ມູນລົ້ມເຫຼວ`, 'error')
  } finally {
    district.loading = false
  }
}

const uploadAllDistricts = async (province) => {
  if (!username.value) {
    showNotification('ກະລຸນາໃສ່ຊື່ຜູ້ໃຊ້', 'error')
    return
  }
  
  // First, ensure districts are initialized
  if (province.districts.length === 0) {
    showNotification('ກຳລັງເລີ່ມຕົ້ນເມືອງ...', 'info')
    await initializeProvince(province)
    // Reload data after initialization
    await fetchData()
    province = provinces.value.find(p => p.pro_id === province.pro_id)
  }
  
  const pendingDistricts = province.districts.filter(d => 
    !d.status || d.status === 'pending' || d.status === 'failed'
  )
  
  if (pendingDistricts.length === 0) {
    showNotification('ທຸກເມືອງອັບໂຫຼດແລ້ວ', 'info')
    return
  }
  
  province.uploading = true
  let completed = 0
  let failed = 0
  
  for (const district of pendingDistricts) {
    try {
      await axios.post(
        `${config.public.strapi.url}api/upload-data/`,
        {
          province_code: province.pro_id,
          district_code: district.dis_id,
          dateRequest: selectedPeriod.value,
          username: username.value
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        }
      )
      completed++
    } catch (error) {
      failed++
    }
    
    await new Promise(resolve => setTimeout(resolve, 2000))
  }
  
  province.uploading = false
  await fetchData()
  
  showNotification(
    `${province.pro_name}:\nສຳເລັດ: ${completed}/${pendingDistricts.length}\nລົ້ມເຫຼວ: ${failed}`,
    failed > 0 ? 'warning' : 'success'
  )
}

const viewDistrictData = async (province, district) => {
  selectedProvince.value = province
  selectedDistrict.value = district
  detailDialog.value = true
  
  // Mock data - replace with your API calls
  paymentData.value = []
  customerData.value = []
}

const refreshDetailData = async () => {
  showNotification('ໂຫຼດຂໍ້ມູນໃໝ່ສຳເລັດ', 'success')
}

const downloadCSV = () => {
  showNotification('ກຳລັງດາວໂຫຼດ...', 'info')
}

// Helper Functions
const getProvinceStatusClass = (province) => {
  const status = province.status
  if (status === 'done') return 'status-done'
  if (status === 'partial') return 'status-partial'
  if (status === 'pending') return 'status-pending'
  return 'status-not-started'
}

const getProvinceIconColor = (status) => {
  if (status === 'done') return 'success'
  if (status === 'partial') return 'warning'
  return 'grey'
}

const getStatusColor = (status) => {
  const colors = {
    completed: 'success',
    done: 'success',
    pending: 'warning',
    partial: 'orange',
    in_progress: 'info',
    failed: 'error',
    not_started: 'grey'
  }
  return colors[status] || 'grey'
}

const getStatusChipColor = (status) => {
  if (status === 'done') return 'success'
  if (status === 'partial') return 'warning'
  if (status === 'pending') return 'info'
  return 'grey-lighten-1'
}

const getStatusIcon = (status) => {
  const icons = {
    completed: 'mdi-check-circle',
    done: 'mdi-check-circle',
    pending: 'mdi-clock-alert',
    partial: 'mdi-alert-circle',
    in_progress: 'mdi-loading mdi-spin',
    failed: 'mdi-close-circle',
    not_started: 'mdi-help-circle'
  }
  return icons[status] || 'mdi-help-circle'
}

const getStatusText = (status) => {
  const texts = {
    completed: 'ສຳເລັດ',
    done: 'ສຳເລັດ',
    pending: 'ລໍຖ້າ',
    partial: 'ບາງສ່ວນ',
    in_progress: 'ກຳລັງດຳເນີນການ',
    failed: 'ລົ້ມເຫຼວ',
    not_started: 'ຍັງບໍ່ໄດ້ເລີ່ມ'
  }
  return texts[status] || 'ບໍ່ຮູ້ຈັກ'
}

const formatNumber = (num) => {
  return num?.toLocaleString() || '0'
}

const formatPeriod = (period) => {
  if (!period || period.length !== 6) return period
  const year = period.substring(0, 4)
  const month = period.substring(4, 6)
  return `${month}/${year}`
}

const formatDate = (date) => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('lo-LA')
}

const formatTime = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleTimeString('lo-LA', { hour: '2-digit', minute: '2-digit' })
}

const formatDateTime = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleString('lo-LA')
}

const showNotification = (message, color = 'success') => {
  notification.message = message
  notification.color = color
  notification.show = true
}

// Lifecycle
onMounted(() => {
  if (selectedPeriod.value) {
    fetchData()
  }
})
</script>

<style scoped>
.electric-upload-system {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 24px;
}

.header-card {
  background: white;
  border-radius: 16px;
}

.summary-card {
  background: white;
  border-radius: 16px;
}

.bg-gradient-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-card {
  transition: all 0.3s ease;
  border-radius: 12px;
}

.stat-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.15);
}

.province-card {
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.province-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
}

.province-header {
  cursor: pointer;
  transition: all 0.3s ease;
}

.status-done {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  color: white;
}

.status-partial {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.status-pending {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.status-not-started {
  background: linear-gradient(135deg, #e0e0e0 0%, #bdbdbd 100%);
  color: #424242;
}

.districts-table {
  background: white;
}

.districts-table thead tr th {
  background: #f8f9fa !important;
  font-weight: 700 !important;
  color: #424242 !important;
  font-size: 0.95rem !important;
  text-transform: none !important;
  border-bottom: 2px solid #e0e0e0 !important;
}

.district-row {
  transition: all 0.2s ease;
}

.district-row:hover {
  background: #f8f9fa;
}

.empty-state {
  background: white;
  border-radius: 16px;
}

:deep(.v-snackbar__content) {
  white-space: pre-line;
  line-height: 1.8;
  font-size: 1rem;
}

:deep(.v-btn-group) {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

@media (max-width: 960px) {
  .electric-upload-system {
    padding: 16px;
  }
  
  .province-header {
    padding: 16px !important;
  }
  
  .stat-card {
    margin-bottom: 16px;
  }
}
</style>