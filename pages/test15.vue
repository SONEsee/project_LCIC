<template>
  <div class="electric-upload-system">
    <!-- Header -->
    <div class="header-card">
      <div class="header-content">
        <div class="header-left">
          <div class="header-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
          </div>
          <div>
            <h1 class="header-title">ລະບົບອັບໂຫຼດໄຟຟ້າ</h1>
            <div class="header-subtitle">Electric Upload System</div>
          </div>
        </div>

        <div class="header-controls">
          <select v-model="selectedPeriod" class="input-field">
            <option value="">ເລືອກເດືອນ-ປີ</option>
            <option v-for="opt in periodOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
          <input
            v-model="username"
            type="text"
            placeholder="ຊື່ຜູ້ໃຊ້"
            class="input-field"
          />

          <button
            @click="fetchData"
            :disabled="!selectedPeriod || loadingData"
            class="btn btn-primary"
          >
            <svg v-if="!loadingData" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
            </svg>
            <svg v-else class="animate-spin" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            </svg>
            ໂຫຼດຂໍ້ມູນ
          </button>

          <!-- NEW: Bulk Upload Button -->
          <button
            @click="startBulkUpload"
            :disabled="!selectedPeriod || !username || bulkUploadProgress.active"
            class="btn btn-success"
          >
            <svg v-if="!bulkUploadProgress.active" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            <svg v-else class="animate-spin" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            </svg>
            {{ bulkUploadProgress.active ? 'ກຳລັງອັບໂຫຼດ...' : 'ອັບໂຫຼດທຸກແຂວງ' }}
          </button>

          <button @click="showSummary = !showSummary" class="btn btn-secondary">
            {{ showSummary ? 'ເຊື່ອງ' : 'ສະຫຼຸບ' }}
          </button>
        </div>
      </div>

      <div v-if="loadingData" class="progress-bar">
        <div class="progress-fill"></div>
      </div>
    </div>

    <!-- Bulk Upload Progress Modal -->
    <div v-if="bulkUploadProgress.show" class="progress-modal-overlay">
      <div class="progress-modal bulk-progress-modal">
        <div class="progress-modal-header bulk-header">
          <h3>🚀 ກຳລັງອັບໂຫຼດທຸກແຂວງ</h3>
          <div class="progress-modal-subtitle">{{ formatPeriod(selectedPeriod) }}</div>
        </div>
        
        <div class="progress-modal-body">
          <div class="progress-circle-container">
            <svg class="progress-circle" viewBox="0 0 120 120">
              <circle class="progress-circle-bg" cx="60" cy="60" r="54" />
              <circle 
                class="progress-circle-fill bulk-circle-fill" 
                cx="60" 
                cy="60" 
                r="54"
                :style="{ strokeDashoffset: bulkProgressCircleOffset }"
              />
            </svg>
            <div class="progress-percentage">{{ bulkUploadProgress.percentage }}%</div>
          </div>

          <div class="progress-details">
            <div class="progress-step">
              <div class="progress-step-label">ທັງໝົດ:</div>
              <div class="progress-step-value">{{ bulkUploadProgress.total }} ເມືອງ</div>
            </div>
            <div class="progress-step">
              <div class="progress-step-label">ສຳເລັດ:</div>
              <div class="progress-step-value success-text">{{ bulkUploadProgress.completed }}</div>
            </div>
            <div class="progress-step">
              <div class="progress-step-label">ກຳລັງດຳເນີນການ:</div>
              <div class="progress-step-value info-text">{{ bulkUploadProgress.inProgress }}</div>
            </div>
            <div class="progress-step">
              <div class="progress-step-label">ລໍຖ້າ:</div>
              <div class="progress-step-value">{{ bulkUploadProgress.pending }}</div>
            </div>
            <div class="progress-step">
              <div class="progress-step-label">ລົ້ມເຫຼວ:</div>
              <div class="progress-step-value error-text">{{ bulkUploadProgress.failed }}</div>
            </div>
          </div>

          <div class="progress-bar-linear">
            <div class="progress-bar-linear-fill bulk-bar-fill" :style="{ width: bulkUploadProgress.percentage + '%' }"></div>
          </div>

          <div class="bulk-upload-note">
            💡 ກະລຸນາຢ່າປິດໜ້າຕ່າງນີ້ ການອັບໂຫຼດກຳລັງດຳເນີນການຢູ່ພາຍຫຼັງ
          </div>
        </div>

        <div class="progress-modal-footer">
          <button 
            @click="closeBulkProgress" 
            class="btn btn-secondary"
            :disabled="bulkUploadProgress.percentage < 100"
          >
            {{ bulkUploadProgress.percentage >= 100 ? 'ປິດ' : 'ເຊື່ອງ (ຍັງດຳເນີນການຢູ່)' }}
          </button>
        </div>
      </div>
    </div>

    

    <!-- Summary -->
    <div v-if="showSummary" class="summary-card">
      <h2 class="summary-title">ສະຫຼຸບລວມ - {{ formatPeriod(selectedPeriod) }}</h2>
      <div class="summary-grid">
        <div class="stat-card stat-blue">
          <div class="stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
          <div class="stat-value">{{ summary.totalProvinces }}</div>
          <div class="stat-label">ແຂວງທັງໝົດ</div>
        </div>

        <div class="stat-card stat-green">
          <div class="stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <div class="stat-value">{{ summary.processedDistricts }}</div>
          <div class="stat-label">ເມືອງສຳເລັດ / {{ summary.totalDistricts }}</div>
        </div>

        <div class="stat-card stat-purple">
          <div class="stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <ellipse cx="12" cy="5" rx="9" ry="3"/>
              <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
            </svg>
          </div>
          <div class="stat-value">{{ formatNumber(summary.totalRecords) }}</div>
          <div class="stat-label">ບັນທຶກທັງໝົດ</div>
        </div>

        <div class="stat-card stat-orange">
          <div class="stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <div class="stat-value" style="font-size: 13px;">{{ currentTime }}</div>
          <div class="stat-label">ອັບເດດລ່າສຸດ</div>
        </div>
      </div>
    </div>

    <!-- Progress Modal -->
    <div v-if="uploadProgress.show" class="progress-modal-overlay">
      <div class="progress-modal">
        <div class="progress-modal-header">
          <h3>ກຳລັັງອັບໂຫຼດຂໍ້ມູນ</h3>
          <div class="progress-modal-subtitle">{{ uploadProgress.provinceName }} - {{ uploadProgress.districtName }}</div>
        </div>
        
        <div class="progress-modal-body">
          <div class="progress-circle-container">
            <svg class="progress-circle" viewBox="0 0 120 120">
              <circle class="progress-circle-bg" cx="60" cy="60" r="54" />
              <circle 
                class="progress-circle-fill" 
                cx="60" 
                cy="60" 
                r="54"
                :style="{ strokeDashoffset: progressCircleOffset }"
              />
            </svg>
            <div class="progress-percentage">{{ uploadProgress.percentage }}%</div>
          </div>

          <div class="progress-details">
            <div class="progress-step">
              <div class="progress-step-label">ການຊຳລະ:</div>
              <div class="progress-step-value">{{ uploadProgress.paymentProcessed }} / {{ uploadProgress.paymentTotal }}</div>
            </div>
            <div class="progress-step">
              <div class="progress-step-label">ລູກຄ້າ:</div>
              <div class="progress-step-value">{{ uploadProgress.customerProcessed }} / {{ uploadProgress.customerTotal }}</div>
            </div>
            <div class="progress-step">
              <div class="progress-step-label">ສະຖານະ:</div>
              <div class="progress-step-value">{{ uploadProgress.status }}</div>
            </div>
          </div>

          <div class="progress-bar-linear">
            <div class="progress-bar-linear-fill" :style="{ width: uploadProgress.percentage + '%' }"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Provinces -->
    <div v-if="provinces.length > 0">
      <div v-for="province in provinces" :key="province.pro_id" class="province-card">
        <!-- Province Header -->
        <div
          @click="toggleProvince(province.pro_id)"
          :class="['province-header', getProvinceHeaderClass(province.status)]"
        >
          <div class="province-header-left">
            <button class="toggle-btn">
              <svg v-if="expandedProvinces[province.pro_id]" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
            
            <div class="province-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>

            <div>
              <div class="province-name">{{ province.pro_name }}</div>
              <div class="province-subtitle">{{ province.districts.length }} ເມືອງ</div>
            </div>
          </div>

          <div class="province-header-right">
            <span :class="['status-badge', getStatusColor(province.status)]">
              <component :is="getStatusIcon(province.status)" />
              {{ getStatusText(province.status) }}
            </span>

            <button
              @click.stop="uploadAllDistricts(province)"
              :disabled="!username || province.uploading"
              class="btn btn-white btn-sm"
            >
              <svg v-if="!province.uploading" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              <svg v-else class="animate-spin" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
              ອັບໂຫຼດທັງໝົດ
            </button>

            <button
              @click.stop="initializeProvince(province)"
              :disabled="!username || province.initializing"
              class="btn btn-white btn-sm"
            >
              <svg v-if="!province.initializing" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="16"/>
                <line x1="8" y1="12" x2="16" y2="12"/>
              </svg>
              <svg v-else class="animate-spin" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
              ເລີ່ມຕົ້ນ
            </button>
          </div>
        </div>

        <!-- Districts Table -->
        <div v-if="expandedProvinces[province.pro_id]" class="districts-table-container">
          <table class="districts-table">
            <thead>
              <tr>
                <th style="width: 25%">ເມືອງ</th>
                <th style="width: 12%">ສະຖານະ</th>
                <th style="width: 10%">ການຊຳລະ</th>
                <th style="width: 10%">ລູກຄ້າ</th>
                <th style="width: 15%">ວັນທີ</th>
                <th style="width: 28%">ການກະທຳ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="province.districts.length === 0">
                <td colspan="6" class="empty-row">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <ellipse cx="12" cy="5" rx="9" ry="3"/>
                    <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/>
                    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
                  </svg>
                  <div>ບໍ່ມີຂໍ້ມູນເມືອງ - ກະລຸນາກົດ "ເລີ່ມຕົ້ນ" ກ່ອນ</div>
                </td>
              </tr>
              <tr v-for="district in province.districts" :key="district.dis_id" class="district-row">
                <td>
                  <div class="district-cell">
                    <div class="district-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                    </div>
                    <div>
                      <div class="district-name">{{ district.dis_name }}</div>
                      <div class="district-id">ID: {{ district.dis_id }}</div>
                    </div>
                  </div>
                </td>
                <td class="text-center">
                  <span :class="['status-chip', getStatusColor(district.status)]">
                    <component :is="getStatusIcon(district.status)" />
                    {{ getStatusText(district.status) }}
                  </span>
                </td>
                <td class="text-center">
                  <span class="count-badge">{{ formatNumber(district.payment_count) }}</span>
                </td>
                <td class="text-center">
                  <span class="count-badge">{{ formatNumber(district.customer_count) }}</span>
                </td>
                <td class="text-center">
                  <div v-if="district.upload_completed" class="date-container">
                    <div class="date-text">{{ formatDate(district.upload_completed) }}</div>
                    <div class="time-text">{{ formatTime(district.upload_completed) }}</div>
                  </div>
                  <span v-else class="empty-text">—</span>
                </td>
                <td class="text-center">
                  <div class="action-buttons">
                    <!-- Hide "ດຶງຂໍ້ມູນ" button if status is completed -->
                    <button
                      v-if="district.status !== 'completed'"
                      @click="syncDistrict(province, district)"
                      :disabled="!username || district.loading"
                      class="btn btn-xs btn-primary"
                    >
                      <svg v-if="!district.loading" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
                      </svg>
                      <svg v-else class="animate-spin" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                      </svg>
                      ດຶງຂໍ້ມູນ
                    </button>
                    <!-- Hide "ເບິ່ງ" button if status is completed -->
                    <button
                      v-if="district.status !== 'completed'"
                      :disabled="!district.payment_count && !district.customer_count"
                      class="btn btn-xs btn-secondary"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                      ເບິ່ງ
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <ellipse cx="12" cy="5" rx="9" ry="3"/>
        <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/>
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
      </svg>
      <h3>ບໍ່ມີຂໍ້ມູນ</h3>
      <p>ກະລຸນາເລືອກເດືອນ-ປີ ແລະ ກົດປຸ່ມ "ໂຫຼດຂໍ້ມູນ"</p>
      <button @click="fetchData" :disabled="!selectedPeriod" class="btn btn-primary">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
        </svg>
        ໂຫຼດຂໍ້ມູນ
      </button>
    </div>

    <!-- Notification -->
    <Transition name="slide">
      <div v-if="notification.show" :class="['notification', `notification-${notification.color}`]">
        <component :is="getNotificationIcon(notification.color)" />
        <div class="notification-content">{{ notification.message }}</div>
        <button @click="notification.show = false" class="notification-close">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, h } from 'vue'
definePageMeta({
  middleware: "auth",
  layout: "backend",
});
const config = useRuntimeConfig()


// State
const selectedPeriod = ref('')
const username = ref('system')
const loadingData = ref(false)
const showSummary = ref(true)
const provinces = ref([])
const expandedProvinces = ref({})
const currentTime = ref('')

// Progress tracking
const uploadProgress = ref({
  show: false,
  percentage: 0,
  provinceName: '',
  districtName: '',
  status: '',
  paymentTotal: 0,
  paymentProcessed: 0,
  customerTotal: 0,
  customerProcessed: 0,
  trackingId: null
})

let progressInterval = null

// Notification
const notification = ref({
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
      label: `${month}/${year}`,
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

  return {
    totalProvinces,
    totalDistricts,
    processedDistricts,
    totalRecords
  }
})

// Progress circle calculation
const progressCircleOffset = computed(() => {
  const circumference = 2 * Math.PI * 54
  const offset = circumference - (uploadProgress.value.percentage / 100) * circumference
  return offset
})

// FIXED: Fetch Data
const fetchData = async () => {
  if (!selectedPeriod.value) {
    showNotification('ກະລຸນາເລືອກເດືອນ-ປີ', 'error')
    return
  }

  loadingData.value = true
  try {
    const provincesResponse = await $fetch(`${config.public.strapi.url}api/provinces/`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
    })

    const provincesData = await Promise.all(
      provincesResponse.map(async (province) => {
        try {
          const trackingResponse = await $fetch(
            `${config.public.strapi.url}api/upload-tracking/`,
            {
              params: {
                province_id: province.pro_id,
                month: selectedPeriod.value
              },
              headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
            }
          )

          const districts = trackingResponse.data || []

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
              // FIX: Properly map customer_count from customer_records field
              payment_count: d.payment_records || d.processed_records || 0,
              customer_count: d.customer_records || 0,
              loading: false
            })),
            uploading: false,
            initializing: false
          }
        } catch (error) {
          console.warn(`Failed to fetch tracking for province ${province.pro_id}:`, error)
          return {
            ...province,
            status: 'not_started',
            districts: [],
            uploading: false,
            initializing: false
          }
        }
      })
    )

    provinces.value = provincesData

    if (provincesData.length > 0) {
      expandedProvinces.value = { [provincesData[0].pro_id]: true }
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
    const response = await $fetch(
      `${config.public.strapi.url}api/initialize-districts/`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        },
        body: {
          province_id: province.pro_id,
          month: selectedPeriod.value,
          username: username.value
        }
      }
    )

    showNotification(response.message, 'success')
    await fetchData()
  } catch (error) {
    console.error('Initialize error:', error)
    showNotification(error.data?.error || 'ການເລີ່ມຕົ້ນລົ້ມເຫຼວ', 'error')
  } finally {
    province.initializing = false
  }
}

// Add to state section
const bulkUploadProgress = ref({
  show: false,
  active: false,
  percentage: 0,
  total: 0,
  completed: 0,
  inProgress: 0,
  pending: 0,
  failed: 0,
  taskId: null
})

let bulkProgressInterval = null

// Add computed for bulk progress circle
const bulkProgressCircleOffset = computed(() => {
  const circumference = 2 * Math.PI * 54
  const offset = circumference - (bulkUploadProgress.value.percentage / 100) * circumference
  return offset
})

// Add these functions
const startBulkUpload = async () => {
  if (!selectedPeriod.value || !username.value) {
    showNotification('ກະລຸນາເລືອກເດືອນ-ປີ ແລະ ຊື່ຜູ້ໃຊ້', 'error')
    return
  }

  const confirmed = confirm(
    `ທ່ານຕ້ອງການອັບໂຫຼດທຸກແຂວງ ແລະ ທຸກເມືອງສຳລັບເດືອນ ${formatPeriod(selectedPeriod.value)} ບໍ່?\n\nນີ້ອາດໃຊ້ເວລາດົນ (30-60 ນາທີ)`
  )

  if (!confirmed) return

  bulkUploadProgress.value = {
    show: true,
    active: true,
    percentage: 0,
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0,
    failed: 0,
    taskId: null
  }

  try {
    const response = await $fetch(
      `${config.public.strapi.url}api/bulk-upload-all/`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        },
        body: {
          month: selectedPeriod.value,
          username: username.value
        }
      }
    )

    bulkUploadProgress.value.taskId = response.task_id
    
    showNotification('ເລີ່ມອັບໂຫຼດທຸກແຂວງແລ້ວ!', 'success')

    // Start polling for progress
    startBulkProgressPolling()

  } catch (error) {
    console.error('Bulk upload error:', error)
    showNotification('ເລີ່ມອັບໂຫຼດລົ້ມເຫຼວ', 'error')
    bulkUploadProgress.value.show = false
    bulkUploadProgress.value.active = false
  }
}

const startBulkProgressPolling = () => {
  bulkProgressInterval = setInterval(async () => {
    try {
      const response = await $fetch(
        `${config.public.strapi.url}api/bulk-upload-status/`,
        {
          params: { month: selectedPeriod.value },
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        }
      )

      bulkUploadProgress.value.total = response.total
      bulkUploadProgress.value.completed = response.completed
      bulkUploadProgress.value.inProgress = response.in_progress
      bulkUploadProgress.value.pending = response.pending
      bulkUploadProgress.value.failed = response.failed
      bulkUploadProgress.value.percentage = response.percentage

      // If completed, stop polling
      if (response.status === 'completed' || response.percentage >= 100) {
        stopBulkProgressPolling()
        bulkUploadProgress.value.active = false
        
        showNotification(
          `ອັບໂຫຼດສຳເລັດ!\nສຳເລັດ: ${response.completed}/${response.total}\nລົ້ມເຫຼວ: ${response.failed}`,
          response.failed > 0 ? 'warning' : 'success'
        )

        // Refresh data
        await fetchData()
      }

    } catch (error) {
      console.error('Bulk progress polling error:', error)
    }
  }, 3000) // Poll every 3 seconds
}

const stopBulkProgressPolling = () => {
  if (bulkProgressInterval) {
    clearInterval(bulkProgressInterval)
    bulkProgressInterval = null
  }
}

const closeBulkProgress = () => {
  bulkUploadProgress.value.show = false
  if (bulkUploadProgress.value.percentage >= 100) {
    bulkUploadProgress.value.active = false
  }
}

// FIX: Sync district with progress monitoring
const syncDistrict = async (province, district) => {
  if (!username.value) {
    showNotification('ກະລຸນາໃສ່ຊື່ຜູ້ໃຊ້', 'error')
    return
  }

  district.loading = true
  
  // Show progress modal
  uploadProgress.value = {
    show: true,
    percentage: 0,
    provinceName: province.pro_name,
    districtName: district.dis_name,
    status: 'ກຳລັງເລີ່ມຕົ້ນ...',
    paymentTotal: 0,
    paymentProcessed: 0,
    customerTotal: 0,
    customerProcessed: 0,
    trackingId: district.id
  }

  try {
    // Start upload
    const uploadPromise = $fetch(
      `${config.public.strapi.url}api/upload-data/`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
        body: {
          province_code: province.pro_id,
          district_code: district.dis_id,
          dateRequest: selectedPeriod.value,
          username: username.value
        }
      }
    )

    // Start progress polling
    startProgressPolling(district.id)

    const response = await uploadPromise

    // Stop polling
    stopProgressPolling()

    if (response && !response.error) {
      // Update final progress
      uploadProgress.value.percentage = 100
      uploadProgress.value.status = 'ສຳເລັດ'
      
      const paymentRecords = response.payment_records || {}
      const customerRecords = response.customer_records || {}

      uploadProgress.value.paymentTotal = paymentRecords.total || 0
      uploadProgress.value.paymentProcessed = paymentRecords.processed || 0
      uploadProgress.value.customerTotal = customerRecords.total || 0
      uploadProgress.value.customerProcessed = customerRecords.processed || 0

      showNotification(
        `${district.dis_name}: ສຳເລັດ\nການຊຳລະ: ${paymentRecords.processed}/${paymentRecords.total}\nລູກຄ້າ: ${customerRecords.processed}/${customerRecords.total}`,
        'success'
      )

      // Wait a bit to show 100% before closing
      await new Promise(resolve => setTimeout(resolve, 1500))
      uploadProgress.value.show = false

      await fetchData()
    }
  } catch (error) {
    stopProgressPolling()
    uploadProgress.value.show = false
    console.error('Sync error:', error)
    showNotification(`${district.dis_name}: ການດຶງຂໍ້ມູນລົ້ມເຫຼວ`, 'error')
  } finally {
    district.loading = false
  }
}

// Progress polling
const startProgressPolling = (trackingId) => {
  progressInterval = setInterval(async () => {
    try {
      const response = await $fetch(
        `${config.public.strapi.url}api/upload-tracking/${trackingId}/`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        }
      )

      if (response) {
        // Calculate progress based on processed records
        const total = (response.payment_records || 0) + (response.customer_records || 0)
        const processed = response.processed_records || 0
        const percentage = total > 0 ? Math.round((processed / total) * 100) : 0

        uploadProgress.value.percentage = Math.min(percentage, 95) // Cap at 95% until complete
        uploadProgress.value.status = getStatusText(response.status)
        uploadProgress.value.paymentTotal = response.payment_records || 0
        uploadProgress.value.paymentProcessed = Math.min(processed, response.payment_records || 0)
        uploadProgress.value.customerTotal = response.customer_records || 0
        uploadProgress.value.customerProcessed = Math.max(0, processed - (response.payment_records || 0))
      }
    } catch (error) {
      console.error('Progress polling error:', error)
    }
  }, 2000) // Poll every 2 seconds
}

const stopProgressPolling = () => {
  if (progressInterval) {
    clearInterval(progressInterval)
    progressInterval = null
  }
}

// FIX: Upload all districts sequentially
const uploadAllDistricts = async (province) => {
  if (!username.value) {
    showNotification('ກະລຸນາໃສ່ຊື່ຜູ້ໃຊ້', 'error')
    return
  }

  if (province.districts.length === 0) {
    showNotification('ກຳລັັງເລີ່ມຕົ້ນເມືອງ...', 'info')
    await initializeProvince(province)
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

  // Process each district sequentially
  for (const district of pendingDistricts) {
    try {
      await syncDistrict(province, district)
      completed++
    } catch (error) {
      failed++
    }
  }

  province.uploading = false
  await fetchData()

  showNotification(
    `${province.pro_name}:\nສຳເລັດ: ${completed}/${pendingDistricts.length}\nລົ້ມເຫຼວ: ${failed}`,
    failed > 0 ? 'warning' : 'success'
  )
}

// Helper Functions
const getProvinceHeaderClass = (status) => {
  const classes = {
    done: 'province-header-done',
    partial: 'province-header-partial',
    pending: 'province-header-pending',
    not_started: 'province-header-not-started'
  }
  return classes[status] || 'province-header-not-started'
}

const getStatusColor = (status) => {
  const colors = {
    completed: 'status-success',
    done: 'status-success',
    pending: 'status-warning',
    partial: 'status-warning',
    in_progress: 'status-info',
    failed: 'status-error',
    not_started: 'status-gray'
  }
  return colors[status] || 'status-gray'
}

const getStatusIcon = (status) => {
  const CheckIcon = () => h('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    width: '14',
    height: '14',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '2'
  }, [
    h('path', { d: 'M22 11.08V12a10 10 0 1 1-5.93-9.14' }),
    h('polyline', { points: '22 4 12 14.01 9 11.01' })
  ])

  const ClockIcon = () => h('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    width: '14',
    height: '14',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '2'
  }, [
    h('circle', { cx: '12', cy: '12', r: '10' }),
    h('polyline', { points: '12 6 12 12 16 14' })
  ])

  const AlertIcon = () => h('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    width: '14',
    height: '14',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '2'
  }, [
    h('circle', { cx: '12', cy: '12', r: '10' }),
    h('line', { x1: '12', y1: '8', x2: '12', y2: '12' }),
    h('line', { x1: '12', y1: '16', x2: '12.01', y2: '16' })
  ])

  const XIcon = () => h('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    width: '14',
    height: '14',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '2'
  }, [
    h('circle', { cx: '12', cy: '12', r: '10' }),
    h('line', { x1: '15', y1: '9', x2: '9', y2: '15' }),
    h('line', { x1: '9', y1: '9', x2: '15', y2: '15' })
  ])

  const icons = {
    completed: CheckIcon,
    done: CheckIcon,
    pending: ClockIcon,
    partial: AlertIcon,
    in_progress: ClockIcon,
    failed: XIcon,
    not_started: AlertIcon
  }
  return icons[status] || AlertIcon
}

const getNotificationIcon = (color) => {
  const CheckIcon = () => h('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    width: '20',
    height: '20',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '2',
    class: 'notification-icon'
  }, [
    h('path', { d: 'M22 11.08V12a10 10 0 1 1-5.93-9.14' }),
    h('polyline', { points: '22 4 12 14.01 9 11.01' })
  ])

  const AlertIcon = () => h('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    width: '20',
    height: '20',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '2',
    class: 'notification-icon'
  }, [
    h('circle', { cx: '12', cy: '12', r: '10' }),
    h('line', { x1: '12', y1: '8', x2: '12', y2: '12' }),
    h('line', { x1: '12', y1: '16', x2: '12.01', y2: '16' })
  ])

  const XIcon = () => h('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    width: '20',
    height: '20',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '2',
    class: 'notification-icon'
  }, [
    h('circle', { cx: '12', cy: '12', r: '10' }),
    h('line', { x1: '15', y1: '9', x2: '9', y2: '15' }),
    h('line', { x1: '9', y1: '9', x2: '15', y2: '15' })
  ])

  const icons = {
    success: CheckIcon,
    error: XIcon,
    warning: AlertIcon,
    info: AlertIcon
  }
  return icons[color] || AlertIcon
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

const formatNumber = (num) => num?.toLocaleString() || '0'

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

const showNotification = (message, color = 'success') => {
  notification.value = {
    show: true,
    message,
    color,
    timeout: 5000
  }
  setTimeout(() => {
    notification.value.show = false
  }, 5000)
}

const updateTime = () => {
  currentTime.value = new Date().toLocaleString('lo-LA')
}

// Lifecycle
onMounted(() => {
  const currentPeriod = new Date().toISOString().slice(0, 7).replace('-', '')
  selectedPeriod.value = currentPeriod
  updateTime()
  setInterval(updateTime, 1000)
})

onUnmounted(() => {
  stopProgressPolling()
  stopBulkProgressPolling()

})
</script>

<style scoped>


.electric-upload-system {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20px;
}

/* Header */
.header-card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  margin-bottom: 20px;
  overflow: hidden;
}

.header-content {
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon {
  width: 44px;
  height: 44px;
  background: #3b82f6;
  color: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-title {
  font-size: 22px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.header-subtitle {
  font-size: 13px;
  color: #6b7280;
}

.header-controls {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

.input-field {
  padding: 8px 14px;
  border: 1px solid #d1d5db;
  border-radius: 7px;
  font-size: 13px;
  min-width: 150px;
  outline: none;
  transition: all 0.2s;
  height: 36px;
}

.input-field:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.progress-bar {
  height: 2px;
  background: #e5e7eb;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #3b82f6;
  animation: progress 1.5s infinite;
}

@keyframes progress {
  0% { width: 0; margin-left: 0; }
  50% { width: 50%; margin-left: 25%; }
  100% { width: 0; margin-left: 100%; }
}

/* Buttons */
.btn {
  padding: 8px 16px;
  border-radius: 7px;
  font-size: 13px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
  white-space: nowrap;
  height: 36px;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
}

.btn-secondary:hover:not(:disabled) {
  background: #e5e7eb;
}

.btn-white {
  background: white;
  color: #374151;
  border: 1px solid rgba(255,255,255,0.3);
}

.btn-white:hover:not(:disabled) {
  background: rgba(255,255,255,0.9);
}

.btn-sm {
  padding: 6px 12px;
  font-size: 12px;
  height: 32px;
}

.btn-xs {
  padding: 5px 10px;
  font-size: 12px;
  height: 28px;
}

/* Progress Modal */
.progress-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
}

.progress-modal {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  max-width: 480px;
  width: 90%;
  overflow: hidden;
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.progress-modal-header {
  padding: 20px 24px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
}

.progress-modal-header h3 {
  margin: 0 0 4px 0;
  font-size: 18px;
  font-weight: 600;
}

.progress-modal-subtitle {
  font-size: 13px;
  opacity: 0.9;
}

.progress-modal-body {
  padding: 32px 24px;
}

.progress-circle-container {
  position: relative;
  width: 140px;
  height: 140px;
  margin: 0 auto 24px;
}

.progress-circle {
  transform: rotate(-90deg);
  width: 100%;
  height: 100%;
}

.progress-circle-bg {
  fill: none;
  stroke: #e5e7eb;
  stroke-width: 8;
}

.progress-circle-fill {
  fill: none;
  stroke: #3b82f6;
  stroke-width: 8;
  stroke-linecap: round;
  stroke-dasharray: 339.292;
  stroke-dashoffset: 339.292;
  transition: stroke-dashoffset 0.5s ease;
}

.progress-percentage {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
}

.progress-details {
  margin-bottom: 20px;
}

.progress-step {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f3f4f6;
}

.progress-step:last-child {
  border-bottom: none;
}

.progress-step-label {
  font-size: 13px;
  color: #6b7280;
  font-weight: 500;
}

.progress-step-value {
  font-size: 13px;
  color: #1f2937;
  font-weight: 600;
}

.progress-bar-linear {
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
}

.progress-bar-linear-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #2563eb);
  border-radius: 3px;
  transition: width 0.5s ease;
}

/* Summary */
.summary-card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  padding: 20px;
  margin-bottom: 20px;
}

.summary-title {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 16px 0;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
}

.stat-card {
  padding: 18px;
  border-radius: 8px;
  text-align: center;
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-blue { background: #eff6ff; }
.stat-green { background: #f0fdf4; }
.stat-purple { background: #faf5ff; }
.stat-orange { background: #fff7ed; }

.stat-icon {
  color: #3b82f6;
  margin-bottom: 10px;
}

.stat-green .stat-icon { color: #10b981; }
.stat-purple .stat-icon { color: #8b5cf6; }
.stat-orange .stat-icon { color: #f97316; }

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
}

.stat-label {
  font-size: 12px;
  color: #6b7280;
  margin-top: 6px;
}

/* Province Card */
.province-card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  margin-bottom: 12px;
  overflow: hidden;
}

.province-header {
  padding: 16px 18px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  transition: opacity 0.2s;
}

.province-header:hover {
  opacity: 0.92;
}

.province-header-done { background: #10b981; }
.province-header-partial { background: #f97316; }
.province-header-pending { background: #3b82f6; }
.province-header-not-started { background: #6b7280; }

.province-header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.toggle-btn {
  padding: 6px;
  background: rgba(255,255,255,0.15);
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  display: flex;
}

.province-icon {
  width: 40px;
  height: 40px;
  background: rgba(255,255,255,0.15);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.province-name {
  font-size: 17px;
  font-weight: 700;
}

.province-subtitle {
  font-size: 12px;
  opacity: 0.9;
}

.province-header-right {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.status-success { background: #d1fae5; color: #065f46; }
.status-warning { background: #fef3c7; color: #92400e; }
.status-info { background: #dbeafe; color: #1e40af; }
.status-error { background: #fee2e2; color: #991b1b; }
.status-gray { background: #f3f4f6; color: #374151; }

/* Districts Table */
.districts-table-container {
  overflow-x: auto;
}

.districts-table {
  width: 100%;
  border-collapse: collapse;
}

.districts-table thead {
  background: #f9fafb;
  border-bottom: 2px solid #e5e7eb;
}

.districts-table th {
  padding: 10px 12px;
  text-align: left;
  font-size: 11px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.districts-table td {
  padding: 10px 12px;
  border-bottom: 1px solid #f3f4f6;
  font-size: 13px;
}

.district-row {
  transition: background 0.15s;
}

.district-row:hover {
  background: #f9fafb;
}

.district-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.district-icon {
  width: 34px;
  height: 34px;
  background: #eff6ff;
  color: #3b82f6;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.district-name {
  font-size: 13px;
  font-weight: 600;
  color: #1f2937;
}

.district-id {
  font-size: 11px;
  color: #9ca3af;
}

.status-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 5px;
  font-size: 11px;
  font-weight: 500;
}

.count-badge {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
}

.date-container {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.date-text {
  font-size: 12px;
  color: #1f2937;
  font-weight: 500;
}

.time-text {
  font-size: 11px;
  color: #6b7280;
}

.empty-text {
  color: #9ca3af;
}

.text-center {
  text-align: center;
}

.action-buttons {
  display: flex;
  gap: 6px;
  justify-content: center;
}

.empty-row {
  padding: 40px !important;
  text-align: center;
  color: #9ca3af;
}

.empty-row svg {
  color: #d1d5db;
  margin-bottom: 10px;
}

.empty-row div {
  font-size: 13px;
}

/* Empty State */
.empty-state {
  background: white;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  padding: 56px 20px;
  text-align: center;
}

.empty-state svg {
  color: #d1d5db;
  margin-bottom: 14px;
}

.empty-state h3 {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 6px 0;
}

.empty-state p {
  color: #6b7280;
  margin: 0 0 20px 0;
  font-size: 13px;
}

/* Notification */
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  max-width: 380px;
  padding: 14px 16px;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
  display: flex;
  align-items: flex-start;
  gap: 10px;
  color: white;
  z-index: 9999;
}

.notification-success { background: #10b981; }
.notification-error { background: #ef4444; }
.notification-warning { background: #f97316; }
.notification-info { background: #3b82f6; }

.notification-icon {
  flex-shrink: 0;
}

.notification-content {
  flex: 1;
  white-space: pre-line;
  line-height: 1.5;
  font-size: 13px;
}

.notification-close {
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0;
  display: flex;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.notification-close:hover {
  opacity: 1;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

/* Animations */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 768px) {
  .electric-upload-system {
    padding: 12px;
  }

  .header-content {
    flex-direction: column;
    align-items: stretch;
  }

  .header-controls {
    flex-direction: column;
  }

  .input-field {
    width: 100%;
  }

  .summary-grid {
    grid-template-columns: 1fr;
  }

  .province-header {
    flex-direction: column;
    gap: 12px;
  }

  .province-header-right {
    width: 100%;
    flex-direction: column;
  }

  .btn-white {
    width: 100%;
  }

  .districts-table {
    font-size: 11px;
  }

  .districts-table th,
  .districts-table td {
    padding: 8px 6px;
  }

  .action-buttons {
    flex-direction: column;
  }

  .notification {
    left: 12px;
    right: 12px;
    max-width: none;
  }

}
/* Button Success Style */
.btn-success {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(16, 185, 129, 0.2);
}

.btn-success:hover:not(:disabled) {
  background: linear-gradient(135deg, #059669, #047857);
  box-shadow: 0 4px 8px rgba(16, 185, 129, 0.3);
  transform: translateY(-1px);
}

.btn-success:disabled {
  background: #9ca3af;
  box-shadow: none;
}


/* Bulk Progress Modal Styles */
.bulk-header {
  background: linear-gradient(135deg, #10b981, #059669) !important;
}

.bulk-circle-fill {
  stroke: #10b981 !important;
}

.bulk-bar-fill {
  background: linear-gradient(90deg, #10b981, #059669) !important;
}

.bulk-progress-modal {
  max-width: 550px;
}

.bulk-upload-note {
  margin-top: 20px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  border-left: 4px solid #f59e0b;
  border-radius: 8px;
  text-align: center;
  font-size: 13px;
  color: #92400e;
  font-weight: 500;
}

.success-text { 
  color: #10b981; 
  font-weight: 700; 
}

.error-text { 
  color: #ef4444; 
  font-weight: 700; 
}

.info-text { 
  color: #3b82f6; 
  font-weight: 700; 
}

.progress-modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .header-controls {
    width: 100%;
  }
  
  .btn-success {
    width: 100%;
  }
}

</style>