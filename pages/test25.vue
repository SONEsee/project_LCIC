<template>
  <div class="charge-details-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <button @click="goBack" class="btn-back">
          <Icon name="mdi:arrow-left" />
          <span>ກັບຄືນ</span>
        </button>
        <h1 class="page-title">
          <Icon name="mdi:file-document-outline" />
          <span>ລາຍລະອຽດຄ່າທຳນຽມ</span>
        </h1>
      </div>
      
      <!-- Bank Info -->
      <div class="bank-info-header" v-if="selectedBankInfo">
        <div class="bank-badge">
          <Icon name="mdi:bank" />
          <span>{{ selectedBankInfo.name }}</span>
          <span v-if="isAdmin" class="bank-code-admin">({{ selectedBankInfo.code }})</span>
        </div>
        <div v-if="isAdmin" class="admin-badge">
          <Icon name="mdi:shield-account" />
          <span>ຜູ້ເບິ່ງແຍງລະບົບ</span>
        </div>
      </div>
    </div>

    <!-- Filters Section -->
    <div class="filters-section">
      <div class="filter-row">
        <!-- Bank Selection (Admin Only) -->
        <div v-if="isAdmin" class="filter-group">
          <label class="filter-label">
            <Icon name="mdi:bank" class="label-icon" />
            ທະນາຄານ
          </label>
          <select v-model="filters.bank" class="filter-select" @change="onBankChange">
            <option value="">ທັງໝົດ</option>
            <option v-for="bank in bankList" :key="bank.id" :value="bank.id">
              {{ bank.nameL }} ({{ bank.code }})
            </option>
          </select>
        </div>

        <!-- Month Filter -->
        <div class="filter-group">
          <label class="filter-label">ເດືອນ</label>
          <select v-model="filters.month" class="filter-select" @change="handleMonthYearChange">
            <option value="">ທັງໝົດ</option>
            <option value="1">ມັງກອນ</option>
            <option value="2">ກຸມພາ</option>
            <option value="3">ມີນາ</option>
            <option value="4">ເມສາ</option>
            <option value="5">ພຶດສະພາ</option>
            <option value="6">ມິຖຸນາ</option>
            <option value="7">ກໍລະກົດ</option>
            <option value="8">ສິງຫາ</option>
            <option value="9">ກັນຍາ</option>
            <option value="10">ຕຸລາ</option>
            <option value="11">ພະຈິກ</option>
            <option value="12">ທັນວາ</option>
          </select>
        </div>

        <!-- Year Filter -->
        <div class="filter-group">
          <label class="filter-label">ປີ</label>
          <select v-model="filters.year" class="filter-select">
            <option value="">ທັງໝົດ</option>
            <option v-for="year in availableYears" :key="year" :value="year">
              {{ year }}
            </option>
          </select>
        </div>

        <!-- Date Range -->
        <div class="filter-group">
          <label class="filter-label">ຊ່ວງວັນທີ</label>
          <div class="date-range">
            <input 
              v-model="filters.fromDate" 
              type="date" 
              class="date-input"
              placeholder="ເລີ່ມຕົ້ນ"
            />
            <span class="separator">-</span>
            <input 
              v-model="filters.toDate" 
              type="date" 
              class="date-input"
              placeholder="ສິ້ນສຸດ"
            />
          </div>
        </div>

        <!-- Status Filter -->
        <div class="filter-group">
          <label class="filter-label">ສະຖານະ</label>
          <select v-model="filters.status" class="filter-select">
            <option value="">ທັງໝົດ</option>
            <option value="pending">ລໍຖ້າດຳເນີນການ</option>
            <option value="completed">ສຳເລັດແລ້ວ</option>
            <option value="approved">ອະນຸມັດແລ້ວ</option>
            <option value="rejected">ປະຕິເສດ</option>
            <option value="cancelled">ຍົກເລີກ</option>
            <option value="failed">ລົ້ມເຫຼວ</option>
          </select>
        </div>

        <!-- Limit Filter -->
        <div class="filter-group">
          <label class="filter-label">ຈຳນວນແຖວ</label>
          <select v-model="filters.limit" class="filter-select">
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="200">200</option>
            <option value="500">500</option>
          </select>
        </div>

        <!-- Search Box -->
        <div class="filter-group flex-2">
          <label class="filter-label">ຄົ້ນຫາ</label>
          <input 
            v-model="searchQuery" 
            type="text" 
            class="search-input"
            placeholder="ຄົ້ນຫາດ້ວຍລະຫັດ, ຊື່ວິສາຫະກິດ..."
            @keyup.enter="applyFilters"
          />
        </div>

        <!-- Action Buttons -->
        <div class="filter-actions">
          <button @click="applyFilters" class="btn btn-primary" :disabled="loading">
            <Icon name="mdi:magnify" />
            <span>ຄົ້ນຫາ</span>
          </button>
          <button @click="resetFilters" class="btn btn-secondary">
            <Icon name="mdi:refresh" />
            <span>ລ້າງ</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Summary Stats -->
    <div class="summary-stats">
      <div class="stat-card">
        <div class="stat-icon">
          <Icon name="mdi:file-document-multiple" />
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ totalRecords }}</span>
          <span class="stat-label">ທຸລະກຳທັງໝົດ</span>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon amount">
          <Icon name="mdi:cash" />
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ formatCurrency(totalAmount) }}</span>
          <span class="stat-label">ຍອດເງິນລວມ</span>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon success">
          <Icon name="mdi:check-circle" />
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ completedCount }}</span>
          <span class="stat-label">ສຳເລັດແລ້ວ</span>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon pending">
          <Icon name="mdi:clock-outline" />
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ pendingCount }}</span>
          <span class="stat-label">ລໍຖ້າດຳເນີນການ</span>
        </div>
      </div>
    </div>

    <!-- Data Table -->
    <div class="table-section">
      <div class="table-header">
        <h2 class="section-title">ລາຍການທຸລະກຳ</h2>
        <div class="table-actions">
          <button @click="exportToExcel" class="btn btn-export">
            <Icon name="mdi:microsoft-excel" />
            <span>Excel</span>
          </button>
          <button @click="exportToPDF" class="btn btn-export pdf">
            <Icon name="mdi:file-pdf-box" />
            <span>PDF</span>
          </button>
          <button @click="printTable" class="btn btn-export print">
            <Icon name="mdi:printer" />
            <span>ພິມ</span>
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-container">
        <div class="spinner"></div>
        <p>ກຳລັງໂຫຼດຂໍ້ມູນ...</p>
      </div>

      <!-- Data Table -->
      <div v-else-if="detailData.length > 0" class="table-container">
        <table class="detail-table">
          <thead>
            <tr>
              <th class="text-center">#</th>
              <th>ລະຫັດທຸລະກຳ</th>
              <th>ວັນທີ</th>
              <th>ລະຫັດວິສາຫະກິດ</th>
              <th>ຊື່ວິສາຫະກິດ</th>
              <th>ຈຸດປະສົງ</th>
              <th class="text-right">ຈຳນວນເງິນ</th>
              <th class="text-center">ສະຖານະ</th>
              <th class="text-center">ການດຳເນີນການ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in filteredData" :key="item.rec_charge_ID">
              <td class="text-center">{{ index + 1 }}</td>
              <td class="charge-id">
                <span class="id-badge">{{ item.rec_charge_ID }}</span>
              </td>
              <td>{{ formatDate(item.insert_date) }}</td>
              <td class="text-center">{{ item.LCIC_code }}</td>
              <td>{{ item.enterprise_name || '-' }}</td>
              <td>{{ item.lon_purpose || '-' }}</td>
              <td class="text-right amount-cell">
                {{ formatCurrency(item.chg_amount) }}
              </td>
              <td class="text-center">
                <span 
                  class="status-badge" 
                  :class="getStatusClass(item.status)"
                >
                  {{ item.status_lao || item.status }}
                </span>
              </td>
              <td class="text-center">
                <div class="action-buttons">
                  <button 
                    @click="viewTransaction(item)" 
                    class="btn-action view"
                    title="ເບິ່ງລາຍລະອຽດ"
                  >
                    <Icon name="mdi:eye" />
                  </button>
                  <button 
                    @click="printTransaction(item)" 
                    class="btn-action print"
                    title="ພິມ"
                  >
                    <Icon name="mdi:printer" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <Icon name="mdi:database-search" class="empty-icon" />
        <h3>ບໍ່ພົບຂໍ້ມູນທຸລະກຳ</h3>
        <p>ກະລຸນາປ່ຽນເງື່ອນໄຂການຄົ້ນຫາ</p>
      </div>
    </div>

    <!-- Transaction Detail Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>ລາຍລະອຽດທຸລະກຳ #{{ selectedTransaction.rec_charge_ID }}</h3>
          <button @click="closeModal" class="btn-close">
            <Icon name="mdi:close" />
          </button>
        </div>
        <div class="modal-body">
          <div class="detail-grid">
            <div class="detail-item">
              <label>ລະຫັດທຸລະກຳ:</label>
              <span>{{ selectedTransaction.rec_charge_ID }}</span>
            </div>
            <div class="detail-item">
              <label>ທະນາຄານ:</label>
              <span>{{ selectedTransaction.bank_display }}</span>
            </div>
            <div class="detail-item">
              <label>ວັນທີທຸລະກຳ:</label>
              <span>{{ formatDate(selectedTransaction.insert_date) }}</span>
            </div>
            <div class="detail-item">
              <label>ວັນທີອັບເດດ:</label>
              <span>{{ formatDate(selectedTransaction.update_date) }}</span>
            </div>
            <div class="detail-item">
              <label>ລະຫັດວິສາຫະກິດ:</label>
              <span>{{ selectedTransaction.LCIC_code }}</span>
            </div>
            <div class="detail-item">
              <label>ຊື່ວິສາຫະກິດ:</label>
              <span>{{ selectedTransaction.enterprise_name || '-' }}</span>
            </div>
            <div class="detail-item">
              <label>ຈຸດປະສົງສິນເຊື່ອ:</label>
              <span>{{ selectedTransaction.lon_purpose || '-' }}</span>
            </div>
            <div class="detail-item">
              <label>ປະເພດລູກຄ້າ:</label>
              <span>{{ selectedTransaction.cusType || '-' }}</span>
            </div>
            <div class="detail-item full-width">
              <label>ຈຳນວນເງິນ:</label>
              <span class="amount-large">{{ formatCurrency(selectedTransaction.chg_amount) }}</span>
            </div>
            <div class="detail-item">
              <label>ສະກຸນເງິນ:</label>
              <span>{{ selectedTransaction.chg_unit }}</span>
            </div>
            <div class="detail-item">
              <label>ສະຖານະ:</label>
              <span class="status-badge" :class="getStatusClass(selectedTransaction.status)">
                {{ selectedTransaction.status_lao }}
              </span>
            </div>
            <div class="detail-item">
              <label>ລະຫັດອ້າງອີງ:</label>
              <span>{{ selectedTransaction.rec_reference_code || '-' }}</span>
            </div>
            <div class="detail-item">
              <label>RTP Code:</label>
              <span>{{ selectedTransaction.rtp_code || '-' }}</span>
            </div>
            <div class="detail-item">
              <label>User ID:</label>
              <span>{{ selectedTransaction.user_sys_id || '-' }}</span>
            </div>
            <div class="detail-item">
              <label>Session ID:</label>
              <span>{{ selectedTransaction.user_session_id || '-' }}</span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="printTransaction(selectedTransaction)" class="btn btn-primary">
            <Icon name="mdi:printer" />
            <span>ພິມ</span>
          </button>
          <button @click="closeModal" class="btn btn-secondary">
            <Icon name="mdi:close" />
            <span>ປິດ</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Access Denied Modal -->
    <div v-if="showAccessDenied" class="modal-overlay">
      <div class="modal-content access-denied">
        <div class="modal-header">
          <h3>
            <Icon name="mdi:alert-circle" />
            ການເຂົ້າເຖິງຖືກປະຕິເສດ
          </h3>
        </div>
        <div class="modal-body">
          <p class="access-denied-message">
            ທ່ານບໍ່ມີສິດເຂົ້າເຖິງຂໍ້ມູນທະນາຄານນີ້. ທ່ານສາມາດເຂົ້າເຖິງໄດ້ສະເພາະຂໍ້ມູນທະນາຄານຂອງທ່ານເທົ່ານັ້ນ.
          </p>
        </div>
        <div class="modal-footer">
          <button @click="handleAccessDenied" class="btn btn-primary">
            <Icon name="mdi:arrow-left" />
            <span>ກັບຄືນໜ້າຫຼັກ</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useChargeReportApi } from '~/composables/useChargeReportApi'

definePageMeta({
  middleware: "auth",
  layout: "backend",
});

const router = useRouter()
const route = useRoute()
const { 
  fetchDetailReport, 
  fetchBankList,
  formatCurrency: formatCurrencyUtil, 
  detailData, 
  loadingDetail,
  bankList: apiBankList,
  checkUserAccess,
  getUserRole
} = useChargeReportApi()

// State
const loading = ref(false)
const showModal = ref(false)
const showAccessDenied = ref(false)
const selectedTransaction = ref<any>({})
const searchQuery = ref('')
const selectedBankInfo = ref<any>(null)
const bankList = ref<any[]>([])
const isAdmin = ref(false)
const userBankId = ref('')

// Get current date for default filters
const getCurrentDate = () => {
  const now = new Date()
  return {
    month: now.getMonth() + 1,
    year: now.getFullYear(),
    day: now.getDate()
  }
}

// Generate available years
const availableYears = computed(() => {
  const currentYear = new Date().getFullYear()
  const years = []
  for (let i = 0; i <= 5; i++) {
    years.push(currentYear - i)
  }
  return years
})

const currentDate = getCurrentDate()
// compute today's date in YYYY-MM-DD
const pad = (n: number) => String(n).padStart(2, '0')
const now = new Date()
const todayISO = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
// Filters with default values
const filters = ref({
//   month: String(currentDate.month),
//   year: String(currentDate.year),
  month: '',
  year: '',
  fromDate: todayISO,
  toDate: todayISO,
  status: '',
  limit: '100',
  bank: ''
})

// Initialize on mount
onMounted(async () => {
  // Get user role and bank info
  const roleInfo = getUserRole()
  isAdmin.value = roleInfo.isAdmin
  userBankId.value = roleInfo.bankId

// Read date filters from URL query parameters
  const monthFromUrl = route.query.month as string
  const yearFromUrl = route.query.year as string
  const fromDateFromUrl = route.query.fromDate as string
  const toDateFromUrl = route.query.toDate as string

// Set date filters from URL if provided, otherwise use defaults
  if (monthFromUrl) {
    filters.value.month = monthFromUrl
    filters.value.fromDate = '' // Clear date range when month is set
    filters.value.toDate = ''
  }
  
  if (yearFromUrl) {
    filters.value.year = yearFromUrl
  }
  
  if (fromDateFromUrl && toDateFromUrl) {
    filters.value.fromDate = fromDateFromUrl
    filters.value.toDate = toDateFromUrl
    filters.value.month = '' // Clear month when date range is set
    filters.value.year = ''
  }
// For admin, load bank list
  if (isAdmin.value) {
    await fetchBankList()
    bankList.value = apiBankList.value
    
    // Check if bank parameter in URL
    const bankFromUrl = route.query.bank as string
    if (bankFromUrl) {
      // Admin can access any bank via URL
      filters.value.bank = bankFromUrl
    }
  } else {
    // For members, check access permission
    const bankFromUrl = route.query.bank as string
    
    if (bankFromUrl) {
      // Member trying to access via URL - check if it's their bank
      const hasAccess = checkUserAccess(bankFromUrl)
      if (!hasAccess) {
        showAccessDenied.value = true
        return
      }
      filters.value.bank = bankFromUrl
    } else {
      // No bank in URL, use their own bank
      filters.value.bank = userBankId.value
    }
  }
  
  // Set bank info for display
  setBankInfo()
  
  // Load initial data
  await loadData()
})

// Set bank info based on current bank filter
const setBankInfo = () => {
  try {
    const userDataStr = localStorage.getItem('user_data')
    if (userDataStr) {
      const userData = JSON.parse(userDataStr)
      
      if (isAdmin.value && filters.value.bank) {
        // Admin viewing specific bank
        const selectedBank = bankList.value.find(b => b.id === filters.value.bank)
        if (selectedBank) {
          selectedBankInfo.value = {
            id: selectedBank.id,
            code: selectedBank.code,
            name: selectedBank.nameL
          }
        }
      } else {
        // Member or admin without specific bank
        selectedBankInfo.value = {
          id: userData?.MID?.id,
          code: userData?.MID?.code,
          name: userData?.nameL || userData?.MID?.code
        }
      }
    }
  } catch (error) {
    console.error('Error setting bank info:', error)
  }
}

// Computed properties
const filteredData = computed(() => {
  if (!searchQuery.value) return detailData.value
  
  const query = searchQuery.value.toLowerCase()
  return detailData.value.filter((item: any) => {
    return (
      item.rec_charge_ID?.toString().toLowerCase().includes(query) ||
      item.LCIC_code?.toLowerCase().includes(query) ||
      item.enterprise_name?.toLowerCase().includes(query) ||
      item.lon_purpose?.toLowerCase().includes(query)
    )
  })
})

const totalRecords = computed(() => filteredData.value.length)
const totalAmount = computed(() => {
  return filteredData.value.reduce((sum: number, item: any) => {
    return sum + (parseFloat(item.chg_amount) || 0)
  }, 0)
})

const completedCount = computed(() => {
  return filteredData.value.filter((item: any) => 
    item.status === 'completed' || item.status === 'approved'
  ).length
})

const pendingCount = computed(() => {
  return filteredData.value.filter((item: any) => 
    item.status === 'pending'
  ).length
})

// Methods
const loadData = async () => {
  loading.value = true
  try {
    await fetchDetailReport({
      month: filters.value.month ? parseInt(filters.value.month) : undefined,
      year: filters.value.year ? parseInt(filters.value.year) : undefined,
      fromDate: filters.value.fromDate || undefined,
      toDate: filters.value.toDate || undefined,
      status: filters.value.status || undefined,
      limit: parseInt(filters.value.limit),
      bank: filters.value.bank || undefined
    })
  } catch (error) {
    console.error('Error loading data:', error)
  } finally {
    loading.value = false
  }
}

const onBankChange = () => {
  // Update bank info when admin changes bank selection
  setBankInfo()
  // Reload data with new bank
  loadData()
}

const applyFilters = () => {
  loadData()
}
// Handle month/year change (clear date range when month/year is selected)
const handleMonthYearChange = () => {
  if (filters.value.month || filters.value.year) {
    filters.value.fromDate = ''
    filters.value.toDate = ''
  }
}
const resetFilters = () => {
  const currentDate = getCurrentDate()
  filters.value = {
    month: String(currentDate.month),
    year: String(currentDate.year),
    fromDate: '',
    toDate: '',
    status: '',
    limit: '100',
    bank: isAdmin.value ? '' : userBankId.value
  }
  searchQuery.value = ''
  setBankInfo()
  loadData()
}

const goBack = () => {
  router.back()
}

const handleAccessDenied = () => {
  router.push('/')
}

const formatDate = (dateString: string) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('lo-LA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatCurrency = (amount: number) => {
  if (!amount) return '0 ₭'
  return formatCurrencyUtil(amount)
}

const getStatusClass = (status: string) => {
  const statusMap: any = {
    'completed': 'success',
    'approved': 'success',
    'pending': 'pending',
    'rejected': 'danger',
    'cancelled': 'warning',
    'failed': 'danger'
  }
  return statusMap[status] || 'default'
}

const viewTransaction = (transaction: any) => {
  selectedTransaction.value = transaction
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedTransaction.value = {}
}

const printTransaction = (transaction: any) => {
  console.log('Print transaction:', transaction)
  // Implement print functionality
}

const exportToExcel = () => {
  console.log('Export to Excel')
  // Implement Excel export
}

const exportToPDF = () => {
  console.log('Export to PDF')
  // Implement PDF export
}

const printTable = () => {
  window.print()
}
</script>

<style scoped>
/* Base Styles */
.charge-details-page {
  min-height: 100vh;
  background: #f8f9fa;
  padding: 20px;
}

/* Page Header */
.page-header {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.btn-back {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
}

.btn-back:hover {
  background: #e5e7eb;
}

.btn-back svg {
  font-size: 20px;
}

.page-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.page-title svg {
  font-size: 28px;
  color: #3b82f6;
}

.bank-info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #e5e7eb;
  padding-top: 16px;
  flex-wrap: wrap;
  gap: 12px;
}

.bank-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
}

.bank-badge svg {
  font-size: 20px;
}

.bank-code-admin {
  opacity: 0.9;
  font-size: 14px;
}

.admin-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  border-radius: 6px;
  font-weight: 600;
  font-size: 13px;
}

.admin-badge svg {
  font-size: 16px;
}

/* Filters Section */
.filters-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: flex-end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 150px;
}

.filter-group.flex-2 {
  flex: 2;
  min-width: 250px;
}

.filter-label {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
}

.label-icon {
  font-size: 14px;
  color: #3b82f6;
}

.date-range {
  display: flex;
  align-items: center;
  gap: 8px;
}

.date-input,
.filter-select,
.search-input {
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;
}

.date-input:focus,
.filter-select:focus,
.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.separator {
  color: #9ca3af;
  font-weight: 600;
}

.filter-actions {
  display: flex;
  gap: 8px;
  margin-left: auto;
}

.btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn svg {
  font-size: 18px;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f3f4f6;
  color: #6b7280;
  border: 1px solid #e5e7eb;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

/* Summary Stats */
.summary-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: #eff6ff;
  color: #3b82f6;
  border-radius: 10px;
}

.stat-icon.amount {
  background: #d1fae5;
  color: #059669;
}

.stat-icon.success {
  background: #d1fae5;
  color: #059669;
}

.stat-icon.pending {
  background: #fed7aa;
  color: #f59e0b;
}

.stat-icon svg {
  font-size: 24px;
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
}

.stat-label {
  font-size: 13px;
  color: #6b7280;
  font-weight: 500;
}

/* Table Section */
.table-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 16px;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.table-actions {
  display: flex;
  gap: 8px;
}

.btn-export {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: #059669;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-export:hover {
  background: #047857;
}

.btn-export.pdf {
  background: #dc2626;
}

.btn-export.pdf:hover {
  background: #b91c1c;
}

.btn-export.print {
  background: #6b7280;
}

.btn-export.print:hover {
  background: #4b5563;
}

.btn-export svg {
  font-size: 16px;
}

/* Loading */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 16px;
}

.loading-container p {
  color: #6b7280;
  font-size: 14px;
}

/* Table */
.table-container {
  overflow-x: auto;
}

.detail-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.detail-table thead {
  background: #f9fafb;
}

.detail-table th {
  padding: 12px;
  text-align: left;
  font-weight: 700;
  color: #374151;
  border-bottom: 2px solid #e5e7eb;
  white-space: nowrap;
}

.detail-table td {
  padding: 12px;
  border-bottom: 1px solid #f3f4f6;
  color: #1f2937;
}

.detail-table tbody tr:hover {
  background: #f9fafb;
}

.text-center {
  text-align: center !important;
}

.text-right {
  text-align: right !important;
}

.charge-id {
  font-weight: 600;
}

.id-badge {
  display: inline-block;
  padding: 2px 8px;
  background: #eff6ff;
  color: #3b82f6;
  border-radius: 4px;
  font-size: 13px;
}

.amount-cell {
  font-weight: 600;
  color: #059669;
}

/* Status Badge */
.status-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.status-badge.success {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.pending {
  background: #fed7aa;
  color: #92400e;
}

.status-badge.danger {
  background: #fee2e2;
  color: #991b1b;
}

.status-badge.warning {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.default {
  background: #f3f4f6;
  color: #4b5563;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 6px;
  justify-content: center;
}

.btn-action {
  padding: 6px;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  color: #6b7280;
}

.btn-action:hover {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.btn-action svg {
  font-size: 16px;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: #9ca3af;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  color: #d1d5db;
}

.empty-state h3 {
  font-size: 18px;
  font-weight: 600;
  color: #6b7280;
  margin: 0 0 8px 0;
}

.empty-state p {
  font-size: 14px;
  margin: 0;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow: auto;
  animation: slideUp 0.3s;
}

.modal-content.access-denied {
  max-width: 500px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.access-denied .modal-header h3 {
  color: #dc2626;
}

.access-denied .modal-header svg {
  font-size: 24px;
}

.btn-close {
  padding: 8px;
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  transition: color 0.2s;
}

.btn-close:hover {
  color: #1f2937;
}

.btn-close svg {
  font-size: 24px;
}

.modal-body {
  padding: 20px;
}

.access-denied-message {
  font-size: 15px;
  line-height: 1.6;
  color: #4b5563;
  text-align: center;
  margin: 0;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.detail-item.full-width {
  grid-column: 1 / -1;
}

.detail-item label {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-item span {
  font-size: 14px;
  color: #1f2937;
  font-weight: 500;
}

.amount-large {
  font-size: 24px;
  font-weight: 700;
  color: #059669;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 20px;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
}

.access-denied .modal-footer {
  justify-content: center;
}

/* Animations */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .charge-details-page {
    padding: 12px;
  }
  
  .filter-row {
    flex-direction: column;
  }
  
  .filter-group {
    width: 100%;
  }
  
  .date-range {
    flex-direction: column;
    gap: 8px;
  }
  
  .date-input {
    width: 100%;
  }
  
  .summary-stats {
    grid-template-columns: 1fr;
  }
  
  .table-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .btn-export {
    width: 100%;
    justify-content: center;
  }
  
  .modal-content {
    width: 95%;
    margin: 10px;
  }
  
  .detail-grid {
    grid-template-columns: 1fr;
  }
}

/* Print Styles */
@media print {
  .btn-back,
  .filters-section,
  .table-actions,
  .action-buttons,
  .modal-overlay {
    display: none !important;
  }
  
  .charge-details-page {
    background: white;
    padding: 0;
  }
  
  .page-header,
  .table-section {
    box-shadow: none;
    border: 1px solid #e5e7eb;
  }
  
  .detail-table {
    font-size: 10px;
  }
  
  .detail-table th,
  .detail-table td {
    padding: 6px;
  }
}
</style>