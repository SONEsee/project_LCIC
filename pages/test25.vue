<template>
  <div class="charge-details-page">
    <!-- Page Header -->
    <div class="page-header no-print">
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
    <div class="filters-section no-print">
      <div class="filter-row">
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

        <div class="filter-group">
          <label class="filter-label">ປີ</label>
          <select v-model="filters.year" class="filter-select">
            <option value="">ທັງໝົດ</option>
            <option v-for="year in availableYears" :key="year" :value="year">
              {{ year }}
            </option>
          </select>
        </div>

        <div class="filter-group">
          <label class="filter-label">ຊ່ວງວັນທີ</label>
          <div class="date-range">
            <input 
              v-model="filters.fromDate" 
              type="date" 
              class="date-input"
              placeholder="ເລີ່ມຕົ້ນ"
              @change="handleDateChange"
            />
            <span class="separator">-</span>
            <input 
              v-model="filters.toDate" 
              type="date" 
              class="date-input"
              placeholder="ສິ້ນສຸດ"
              @change="handleDateChange"
            />
          </div>
        </div>

        <div class="filter-group">
          <label class="filter-label">ປະເພດຄ່າທຳນຽມ</label>
          <select v-model="filters.chg_code" class="filter-select">
            <option value="">ທັງໝົດ</option>
            <option
              v-for="item in chargeCodeList"
              :key="item.chg_sys_id"
              :value="item.chg_code"
            >
              {{ item.chg_code }} - {{ item.chg_lao_type }}
            </option>
          </select>
        </div>

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

        <div class="filter-group">
          <label class="filter-label">ຈຳນວນແຖວ</label>
          <select v-model="filters.limit" class="filter-select">
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="200">200</option>
            <option value="500">500</option>
          </select>
        </div>

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
    <div class="summary-stats no-print">
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

    <!-- Print Header (Only visible when printing) -->
    <div class="print-header">
      <div class="report-title">
        <h1>ລາຍງານຄ່າທຳນຽມລາຍລະອຽດ</h1>
        <div class="report-info">
          <div class="info-row">
            <span class="label">ທະນາຄານ:</span>
            <span class="value">{{ selectedBankInfo?.name || 'ທັງໝົດ' }}</span>
          </div>
          <div class="info-row">
            <span class="label">ວັນທີອອກລາຍງານ:</span>
            <span class="value">{{ formatDate(new Date()) }}</span>
          </div>
          <div class="info-row">
            <span class="label">ຈຳນວນທຸລະກຳທັງໝົດ:</span>
            <span class="value">{{ totalRecords }} ລາຍການ</span>
          </div>
          <div class="info-row">
            <span class="label">ຍອດເງິນລວມ:</span>
            <span class="value">{{ formatCurrency(totalAmount) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Data Table -->
    <div class="table-section">
      <div class="table-header no-print">
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
          <button @click="printReport" class="btn btn-export print">
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
              <th class="text-center">ລຳດັບ</th>
              <th>ທະນາຄານ</th>
              <th>ລະຫັດຄ່າທຳນຽມ</th>
              <th>ລະຫັດວິສາຫະກິດ</th>
              <th>ຜູ້ໃຊ້ລະບົບ</th>
              <th>ວັນທີບັນທຶກ</th>
              <th class="text-right">ຈຳນວນເງິນ</th>
              <th class="text-center">ສະຖານະ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in filteredData" :key="item.rec_charge_ID">
              <td class="text-center">{{ index + 1 }}</td>
              <td>
                <div class="bank-cell">
                  <span class="bank-code">{{ item.bnk_code }}</span>
                  <span class="bank-name">{{ item.bank_name }}</span>
                </div>
              </td>
              <td>
                <div class="charge-code-cell">
                  <span class="code">{{ item.chg_code }}</span>
                  <span class="desc">{{ item.chg_lao_desc }}</span>
                </div>
              </td>
              <td class="text-center">{{ item.LCIC_code || '-' }}</td>
              <td>{{ item.user_sys_id || '-' }}</td>
              <td>{{ formatDate(item.rec_insert_date) }}</td>
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
            </tr>
          </tbody>
          <tfoot>
            <tr class="total-row">
              <td colspan="6" class="text-right">ລວມທັງໝົດ:</td>
              <td class="text-right">{{ formatCurrency(totalAmount) }}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <Icon name="mdi:database-search" class="empty-icon" />
        <h3>ບໍ່ພົບຂໍ້ມູນທຸລະກຳ</h3>
        <p>ກະລຸນາປ່ຽນເງື່ອນໄຂການຄົ້ນຫາ</p>
      </div>
    </div>

    <!-- Print Footer (Only visible when printing) -->
    <div class="print-footer">
      <div class="footer-content">
        <div class="footer-row">
          <span>ພິມວັນທີ: {{ formatDate(new Date()) }}</span>
          <span>ໜ້າທີ່: 1</span>
        </div>
        <div class="footer-signature">
          <div class="signature-box">
            <p>ຜູ້ກະກຽມ</p>
            <p class="signature-line">______________________</p>
            <p class="signature-date">ວັນທີ: ____/____/____</p>
          </div>
          <div class="signature-box">
            <p>ຜູ້ກວດສອບ</p>
            <p class="signature-line">______________________</p>
            <p class="signature-date">ວັນທີ: ____/____/____</p>
          </div>
          <div class="signature-box">
            <p>ຜູ້ອະນຸມັດ</p>
            <p class="signature-line">______________________</p>
            <p class="signature-date">ວັນທີ: ____/____/____</p>
          </div>
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
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useChargeReportApi } from '~/composables/useChargeReportApi'

definePageMeta({
  middleware: "auth",
  layout: "backend",
})

const router = useRouter()
const route = useRoute()
const { 
  fetchDetailReport, 
  fetchBankList,
  fetchChargeCodeList,
  formatCurrency: formatCurrencyUtil, 
  detailData, 
  loadingDetail,
  bankList: apiBankList,
  chargeCodeList,
  checkUserAccess,
  getUserRole
} = useChargeReportApi()

const loading = ref(false)
const showAccessDenied = ref(false)
const searchQuery = ref('')
const selectedBankInfo = ref<any>(null)
const bankList = ref<any[]>([])
const isAdmin = ref(false)
const userBankId = ref('')
// helper to produce local YYYY-MM-DD for <input type="date">
const formatToDateInput = (d: Date) => {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
const today = formatToDateInput(new Date())

// ✅ FIX: Initialize filters with empty values, no defaults
const filters = ref({
  month: '',
  year: '',
  fromDate: today,
  toDate: today,
  status: '',
  limit: '100',
  bank: '',
  chg_code: ''
})


const availableYears = computed(() => {
  const currentYear = new Date().getFullYear()
  const years = []
  for (let i = 0; i <= 5; i++) {
    years.push(currentYear - i)
  }
  return years
})

// ✅ FIX: Initialize filters from URL parameters FIRST
const initializeFiltersFromURL = () => {
  const monthFromUrl = route.query.month as string
  const yearFromUrl = route.query.year as string
  const fromDateFromUrl = route.query.fromDate as string
  const toDateFromUrl = route.query.toDate as string
  const chgCodeFromUrl = route.query.chg_code as string
  const bankFromUrl = route.query.bank as string
  
  // Set filters from URL
  if (monthFromUrl) filters.value.month = monthFromUrl
  if (yearFromUrl) filters.value.year = yearFromUrl
  if (fromDateFromUrl) filters.value.fromDate = fromDateFromUrl
  if (toDateFromUrl) filters.value.toDate = toDateFromUrl
  if (chgCodeFromUrl) filters.value.chg_code = chgCodeFromUrl
  
  // Handle bank parameter
  if (bankFromUrl) {
    if (isAdmin.value) {
      // Admin can access any bank
      filters.value.bank = bankFromUrl
    } else {
      // Regular user: check access
      const hasAccess = checkUserAccess(bankFromUrl)
      if (!hasAccess) {
        showAccessDenied.value = true
        return false
      }
      filters.value.bank = bankFromUrl
    }
  } else {
    // No bank in URL: use user's bank if not admin
    if (!isAdmin.value) {
      filters.value.bank = userBankId.value
    }
  }
  
  return true
}

const filteredData = computed(() => {
  if (!searchQuery.value) return detailData.value
  
  const query = searchQuery.value.toLowerCase()
  return detailData.value.filter((item: any) => {
    return (
      item.rec_charge_ID?.toString().toLowerCase().includes(query) ||
      item.LCIC_code?.toLowerCase().includes(query) ||
      item.enterprise_name?.toLowerCase().includes(query) ||
      item.chg_code?.toLowerCase().includes(query) ||
      item.user_sys_id?.toLowerCase().includes(query)
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

const loadData = async () => {
  loading.value = true
  try {
    // ✅ FIX: Build filter params properly
    const filterParams: any = {
      limit: parseInt(filters.value.limit)
    }
    
    if (filters.value.month) filterParams.month = parseInt(filters.value.month)
    if (filters.value.year) filterParams.year = parseInt(filters.value.year)
    if (filters.value.fromDate) filterParams.fromDate = filters.value.fromDate
    if (filters.value.toDate) filterParams.toDate = filters.value.toDate
    if (filters.value.status) filterParams.status = filters.value.status
    if (filters.value.chg_code) filterParams.chg_code = filters.value.chg_code
    if (filters.value.bank) filterParams.bank = filters.value.bank
    
    await fetchDetailReport(filterParams)
  } catch (error) {
    console.error('Error loading data:', error)
  } finally {
    loading.value = false
  }
}

const setBankInfo = () => {
  try {
    const userDataStr = localStorage.getItem('user_data')
    if (userDataStr) {
      const userData = JSON.parse(userDataStr)
      
      if (isAdmin.value && filters.value.bank) {
        const selectedBank = bankList.value.find(b => b.id === filters.value.bank)
        if (selectedBank) {
          selectedBankInfo.value = {
            id: selectedBank.id,
            code: selectedBank.code,
            name: selectedBank.nameL
          }
        }
      } else {
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

const onBankChange = () => {
  setBankInfo()
  loadData()
}

const applyFilters = () => {
  loadData()
}

const handleDateChange = () => {
  // If date range is used, clear month/year
  if (filters.value.fromDate || filters.value.toDate) {
    filters.value.month = ''
    filters.value.year = ''
  }
}

const handleMonthYearChange = () => {
  // If month/year is used, clear date range
  if (filters.value.month || filters.value.year) {
    filters.value.fromDate = ''
    filters.value.toDate = ''
  }
}

const resetFilters = () => {
  filters.value = {
    month: '',
    year: '',
    fromDate: today,
    toDate: today,
    status: '',
    chg_code: '',
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

const formatDate = (dateString: string | Date) => {
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

const printReport = () => {
  window.print()
}

const exportToExcel = () => {
  console.log('Export to Excel')
}

const exportToPDF = () => {
  console.log('Export to PDF')
}

// ✅ FIX: Improved onMounted with proper initialization order
onMounted(async () => {
  // 1. Get user role first
  const roleInfo = getUserRole()
  isAdmin.value = roleInfo.isAdmin
  userBankId.value = roleInfo.bankId
  
  // 2. Fetch bank list if admin
  if (isAdmin.value) {
    await fetchBankList()
    bankList.value = apiBankList.value
  }
  
  // 3. Fetch charge code list
  await fetchChargeCodeList()
  
  // 4. Initialize filters from URL
  const hasAccess = initializeFiltersFromURL()
  if (!hasAccess) {
    // User doesn't have access to requested bank
    return
  }
  
  // 5. Set bank info for display
  setBankInfo()
  
  // 6. Load data with URL parameters
  await loadData()
})
</script>

<style scoped>
/* ... (keep all your existing styles) ... */
.charge-details-page {
  min-height: 100vh;
  background: #f8f9fa;
  padding: 20px;
}

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

/* Print Header (Hidden by default) */
.print-header {
  display: none;
}

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

.bank-cell,
.charge-code-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.bank-code,
.code {
  font-weight: 600;
  color: #1f2937;
  font-size: 13px;
}

.bank-name,
.desc {
  font-size: 12px;
  color: #6b7280;
}

.amount-cell {
  font-weight: 600;
  color: #059669;
}

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

.total-row {
  background: linear-gradient(to right, #f3f4f6, #e5e7eb);
  font-weight: 700;
}

.total-row td {
  padding: 16px 12px;
  font-size: 15px;
  color: #1f2937;
  border-bottom: none;
}

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

/* Print Footer (Hidden by default) */
.print-footer {
  display: none;
}

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
  color: #dc2626;
  margin: 0;
}

.access-denied .modal-header svg {
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

.modal-footer {
  display: flex;
  justify-content: center;
  gap: 10px;
  padding: 20px;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
}

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

/* Print Styles */
@media print {
  @page {
    margin: 1.5cm;
    size: A4 landscape;
  }

  .charge-details-page {
    background: white;
    padding: 0;
  }

  .no-print {
    display: none !important;
  }

  .print-header {
    display: block;
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 2px solid #000;
  }

  .report-title h1 {
    text-align: center;
    font-size: 24px;
    font-weight: bold;
    margin: 0 0 20px 0;
    color: #000;
  }

  .report-info {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-top: 15px;
  }

  .info-row {
    display: flex;
    gap: 10px;
  }

  .info-row .label {
    font-weight: 600;
    color: #000;
  }

  .info-row .value {
    color: #000;
  }

  .table-section {
    box-shadow: none;
    border: none;
    padding: 0;
  }

  .detail-table {
    font-size: 10px;
    page-break-inside: auto;
  }

  .detail-table tr {
    page-break-inside: avoid;
    page-break-after: auto;
  }

  .detail-table thead {
    display: table-header-group;
    background: #f0f0f0 !important;
  }

  .detail-table th,
  .detail-table td {
    padding: 6px 4px;
    border: 1px solid #000;
  }

  .bank-cell,
  .charge-code-cell {
    gap: 1px;
  }

  .bank-code,
  .code {
    font-size: 10px;
  }

  .bank-name,
  .desc {
    font-size: 8px;
  }

  .status-badge {
    border: 1px solid #000;
    background: none !important;
    color: #000 !important;
  }

  .print-footer {
    display: block;
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px solid #000;
  }

  .footer-content {
    page-break-inside: avoid;
  }

  .footer-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 30px;
    font-size: 11px;
  }

  .footer-signature {
    display: flex;
    justify-content: space-around;
    margin-top: 40px;
  }

  .signature-box {
    text-align: center;
  }

  .signature-box p {
    margin: 5px 0;
    font-size: 11px;
  }

  .signature-line {
    margin-top: 40px;
    font-weight: normal;
  }

  .signature-date {
    margin-top: 5px;
    font-size: 10px;
  }
}

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
}
</style>