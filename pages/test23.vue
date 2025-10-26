// pages/searchlog-report.vue
<template>
  <div class="dashboard-container">
    <div class="header">
      <h1>ລາຍງານການຄົ້ນຫາ</h1>
      <p class="subtitle">{{ userInfo.is_admin ? 'ທະນາຄານທັງໝົດ' : `ທະນາຄານ ${userInfo.bank_code}` }}</p>
    </div>

    <!-- Summary Cards -->
    <div class="summary-grid">
      <div class="card card-primary">
        <div class="card-icon">🔍</div>
        <div class="card-content">
          <p class="card-label">ການຄົ້ນຫາເດືອນນີ້</p>
          <h2 class="card-value">{{ summaryStats.monthlySearches.toLocaleString() }}</h2>
        </div>
      </div>

      <div class="card card-success">
        <div class="card-icon">📅</div>
        <div class="card-content">
          <p class="card-label">ການຄົ້ນຫາມື້ນີ້</p>
          <h2 class="card-value">{{ summaryStats.dailySearches.toLocaleString() }}</h2>
        </div>
      </div>

      <div class="card card-info">
        <div class="card-icon">🏢</div>
        <div class="card-content">
          <p class="card-label">ວິສາຫະກິດທີ່ຄົ້ນຫາ</p>
          <h2 class="card-value">{{ summaryStats.totalEnterprises.toLocaleString() }}</h2>
        </div>
      </div>

      <div class="card card-warning">
        <div class="card-icon">💰</div>
        <div class="card-content">
          <p class="card-label">ມູນຄ່າສິນເຊື່ອລວມ</p>
          <h2 class="card-value-small">{{ formatCurrency(summaryStats.totalLoanAmount) }}</h2>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-section">
      <div class="filters-row">
        <div class="filter-group">
          <label>ປີ</label>
          <select v-model="filters.year" @change="fetchData">
            <option value="">ທັງໝົດ</option>
            <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
          </select>
        </div>

        <div class="filter-group">
          <label>ເດືອນ</label>
          <select v-model="filters.month" @change="fetchData">
            <option value="">ທັງໝົດ</option>
            <option v-for="month in months" :key="month.value" :value="month.value">
              {{ month.label }}
            </option>
          </select>
        </div>

        <div class="filter-group" v-if="userInfo.is_admin">
          <label>ທະນາຄານ</label>
          <select v-model="filters.bank" @change="fetchData">
            <option value="">ທັງໝົດ</option>
            <option v-for="bank in uniqueBanks" :key="bank.code" :value="bank.code">
              {{ bank.display }}
            </option>
          </select>
        </div>

        <button @click="clearFilters" class="btn-clear">ລ້າງຕົວກອງ</button>
      </div>
    </div>

    <!-- Monthly Report by Bank -->
    <div class="report-section">
      <h2>ລາຍງານປະຈຳເດືອນແຍກຕາມທະນາຄານ</h2>
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>ທະນາຄານ</th>
              <th>ປີ</th>
              <th>ເດືອນ</th>
              <th>ການຄົ້ນຫາ</th>
              <th>ວິສາຫະກິດ</th>
              <th>ມູນຄ່າສິນເຊື່ອ</th>
              <th>ສະເລ່ຍຕໍ່ລາຍການ</th>
              <th>ການດຳເນີນການ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="reportData.length === 0">
              <td colspan="8" class="text-center">ບໍ່ມີຂໍ້ມູນ</td>
            </tr>
            <tr v-for="item in reportData" :key="`${item.bank_code}-${item.year}-${item.month}`">
              <td><span class="badge">{{ item.bank_display }}</span></td>
              <td>{{ item.year }}</td>
              <td>{{ item.month_name }}</td>
              <td>{{ item.total_searches.toLocaleString() }}</td>
              <td>{{ item.unique_enterprises.toLocaleString() }}</td>
              <td class="amount">{{ formatCurrency(item.total_loan_amount) }}</td>
              <td>{{ formatCurrency(item.avg_loan_amount) }}</td>
              <td>
                <button 
                  @click="viewDetails(item)" 
                  class="btn-detail"
                >
                  ເບິ່ງລາຍລະອຽດ
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Detail Modal -->
    <div v-if="showDetailModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>ລາຍລະອຽດການຄົ້ນຫາ - {{ selectedBank?.bank_display }}</h2>
          <button @click="closeModal" class="btn-close">&times;</button>
        </div>

        <div class="modal-body">
          <div class="detail-info">
            <p><strong>ໄລຍະເວລາ:</strong> {{ selectedBank?.month_name }} {{ selectedBank?.year }}</p>
            <p><strong>ການຄົ້ນຫາ:</strong> {{ selectedBank?.total_searches }} ລາຍການ</p>
            <p><strong>ວິສາຫະກິດ:</strong> {{ selectedBank?.unique_enterprises }} ແຫ່ງ</p>
            <p><strong>ມູນຄ່າລວມ:</strong> {{ formatCurrency(selectedBank?.total_loan_amount) }}</p>
          </div>

          <div class="table-container">
            <table class="detail-table">
              <thead>
                <tr>
                  <th>ລະຫັດ</th>
                  <th>ວິສາຫະກິດ</th>
                  <th>ປະເພດສິນເຊື່ອ</th>
                  <th>ມູນຄ່າສິນເຊື່ອ</th>
                  <th>ຈຸດປະສົງ</th>
                  <th>ວັນທີ</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="detailData.length === 0">
                  <td colspan="6" class="text-center">ບໍ່ມີຂໍ້ມູນ</td>
                </tr>
                <tr v-for="detail in detailData" :key="detail.search_ID">
                  <td>{{ detail.search_ID }}</td>
                  <td class="text-left">{{ detail.enterprise_display || detail.LCIC_code }}</td>
                  <td>{{ detail.credit_type_lao || detail.credit_type }}</td>
                  <td class="amount">{{ formatCurrency(detail.rec_loan_amount) }} {{ detail.rec_loan_amount_currency }}</td>
                  <td>{{ detail.rec_loan_purpose }}</td>
                  <td>{{ formatDate(detail.inquiry_date) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading-overlay">
      <div class="spinner"></div>
      <p class="loading-text">ກຳລັງໂຫຼດຂໍ້ມູນ...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

definePageMeta({
  middleware: "auth",
  layout: "backend",
});

interface SearchLogReport {
  bank_code: string
  bank_name: string
  bank_display: string
  year: number
  month: number
  month_name: string
  total_searches: number
  unique_enterprises: number
  total_loan_amount: number
  avg_loan_amount: number
  currency: string
}

interface SearchLogDetail {
  search_ID: number
  bnk_code: string
  bank_display: string
  LCIC_code: string
  enterprise_display: string
  credit_type: string
  credit_type_lao: string
  rec_loan_amount: number
  rec_loan_amount_currency: string
  rec_loan_purpose: string
  inquiry_date: string
}

// Use the composable
const { 
  fetchSearchLogSummary, 
  fetchSearchLogDetail, 
  loadingSearchLogSummary, 
  loadingSearchLogDetail,
  getCurrentUser 
} = useSearchLogReportApi()

const reportData = ref<SearchLogReport[]>([])
const detailData = ref<SearchLogDetail[]>([])
const showDetailModal = ref(false)
const selectedBank = ref<SearchLogReport | null>(null)

const userInfo = ref({
  role_id: 0,
  is_admin: false,
  bank_code: ''
})

const filters = ref({
  year: new Date().getFullYear().toString(),
  month: (new Date().getMonth() + 1).toString(),
  bank: ''
})

const summaryStats = ref({
  monthlySearches: 0,
  dailySearches: 0,
  totalEnterprises: 0,
  totalLoanAmount: 0
})

const years = computed(() => {
  const currentYear = new Date().getFullYear()
  return Array.from({ length: 5 }, (_, i) => currentYear - i)
})

const months = [
  { value: '1', label: 'ມັງກອນ' },
  { value: '2', label: 'ກຸມພາ' },
  { value: '3', label: 'ມີນາ' },
  { value: '4', label: 'ເມສາ' },
  { value: '5', label: 'ພຶດສະພາ' },
  { value: '6', label: 'ມິຖຸນາ' },
  { value: '7', label: 'ກໍລະກົດ' },
  { value: '8', label: 'ສິງຫາ' },
  { value: '9', label: 'ກັນຍາ' },
  { value: '10', label: 'ຕຸລາ' },
  { value: '11', label: 'ພະຈິກ' },
  { value: '12', label: 'ທັນວາ' }
]

const uniqueBanks = computed(() => {
  const banksMap = new Map()
  reportData.value.forEach(item => {
    if (!banksMap.has(item.bank_code)) {
      banksMap.set(item.bank_code, {
        code: item.bank_code,
        display: item.bank_display
      })
    }
  })
  return Array.from(banksMap.values())
})

const fetchData = async () => {
  try {
    const data = await fetchSearchLogSummary({
      year: filters.value.year,
      month: filters.value.month,
      bank: filters.value.bank
    })
    
    if (data.status === 'success') {
      reportData.value = data.data
      userInfo.value = data.user_info
      
      // Calculate summary stats
      summaryStats.value.monthlySearches = data.summary.total_searches
      summaryStats.value.totalEnterprises = data.summary.total_enterprises
      summaryStats.value.totalLoanAmount = data.summary.total_loan_amount
      
      // Get today's searches
      await fetchDailySearches()
    }
  } catch (error) {
    console.error('ຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນ:', error)
  }
}

const fetchDailySearches = async () => {
  try {
    const today = new Date().toISOString().split('T')[0]
    const data = await fetchSearchLogDetail({
      fromDate: today,
      toDate: today
    })
    
    if (data.status === 'success') {
      summaryStats.value.dailySearches = data.total_records
    }
  } catch (error) {
    console.error('ຂໍ້ຜິດພາດໃນການດຶງການຄົ້ນຫາປະຈຳວັນ:', error)
  }
}

const viewDetails = async (item: SearchLogReport) => {
  selectedBank.value = item
  
  try {
    const data = await fetchSearchLogDetail({
      bank: item.bank_code,
      year: item.year.toString(),
      month: item.month.toString(),
      limit: 1000
    })
    
    if (data.status === 'success') {
      detailData.value = data.data
      showDetailModal.value = true
    }
  } catch (error) {
    console.error('ຂໍ້ຜິດພາດໃນການດຶງລາຍລະອຽດ:', error)
  }
}

const closeModal = () => {
  showDetailModal.value = false
  selectedBank.value = null
  detailData.value = []
}

const clearFilters = () => {
  filters.value = {
    year: '',
    month: '',
    bank: ''
  }
  fetchData()
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount) + ' ກີບ'
}

const formatDate = (date: string) => {
  const d = new Date(date)
  const day = d.getDate().toString().padStart(2, '0')
  const month = (d.getMonth() + 1).toString().padStart(2, '0')
  const year = d.getFullYear()
  return `${day}/${month}/${year}`
}

const loading = computed(() => loadingSearchLogSummary.value || loadingSearchLogDetail.value)

onMounted(() => {
  // Get user info from localStorage
  const user = getCurrentUser()
  if (user) {
    userInfo.value = {
      role_id: user.GID?.GID || 0,
      is_admin: [1, 2, 3, 4, 5].includes(user.GID?.GID || 0),
      bank_code: user.MID?.id || ''
    }
  }
  
  fetchData()
})
</script>

<style scoped>
/* Same styles as charge-report.vue */
.dashboard-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Noto Sans Lao', 'Phetsarath OT', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #f8f9fa;
  min-height: 100vh;
}

.header {
  margin-bottom: 2rem;
}

.header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #666;
  font-size: 1rem;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  gap: 1rem;
  transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.card-primary {
  border-top: 4px solid #8b5cf6;
}

.card-success {
  border-top: 4px solid #10b981;
}

.card-info {
  border-top: 4px solid #3b82f6;
}

.card-warning {
  border-top: 4px solid #f59e0b;
}

.card-icon {
  font-size: 2.5rem;
  line-height: 1;
}

.card-content {
  flex: 1;
}

.card-label {
  color: #666;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.card-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

.card-value-small {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
  line-height: 1.3;
}

.filters-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.filters-row {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: flex-end;
}

.filter-group {
  flex: 1;
  min-width: 150px;
}

.filter-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}

.filter-group select {
  width: 100%;
  padding: 0.625rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.875rem;
  background: white;
  cursor: pointer;
  transition: border-color 0.2s;
  font-family: 'Noto Sans Lao', 'Phetsarath OT', sans-serif;
}

.filter-group select:focus {
  outline: none;
  border-color: #8b5cf6;
}

.btn-clear {
  padding: 0.625rem 1.25rem;
  background: #f3f4f6;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  transition: background 0.2s;
  font-family: 'Noto Sans Lao', 'Phetsarath OT', sans-serif;
}

.btn-clear:hover {
  background: #e5e7eb;
}

.report-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.report-section h2 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 1.5rem;
}

.table-container {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  background: #f9fafb;
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  border-bottom: 2px solid #e5e7eb;
  white-space: nowrap;
}

.data-table td {
  padding: 1rem;
  border-bottom: 1px solid #f3f4f6;
  font-size: 0.875rem;
  color: #1a1a1a;
  text-align: left;
}

.data-table tr:hover {
  background: #f9fafb;
}

.text-center {
  text-align: center !important;
  color: #999;
  font-style: italic;
}

.text-left {
  text-align: left !important;
}

.amount {
  font-weight: 600;
  color: #10b981;
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: #dbeafe;
  color: #1e40af;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
}

.btn-detail {
  padding: 0.5rem 1rem;
  background: #8b5cf6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  font-family: 'Noto Sans Lao', 'Phetsarath OT', sans-serif;
}

.btn-detail:hover {
  background: #7c3aed;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 1200px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h2 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

.btn-close {
  background: none;
  border: none;
  font-size: 2rem;
  color: #9ca3af;
  cursor: pointer;
  line-height: 1;
  padding: 0;
  width: 2rem;
  height: 2rem;
}

.btn-close:hover {
  color: #374151;
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
}

.detail-info {
  display: flex;
  gap: 2rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
  flex-wrap: wrap;
}

.detail-info p {
  margin: 0;
  font-size: 0.875rem;
}

.detail-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.detail-table th {
  background: #f9fafb;
  padding: 0.75rem;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 2px solid #e5e7eb;
  white-space: nowrap;
}

.detail-table td {
  padding: 0.75rem;
  border-bottom: 1px solid #f3f4f6;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f4f6;
  border-top-color: #8b5cf6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-text {
  margin-top: 1rem;
  font-size: 1rem;
  color: #8b5cf6;
  font-weight: 600;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 1rem;
  }
  
  .summary-grid {
    grid-template-columns: 1fr;
  }
  
  .filters-row {
    flex-direction: column;
  }
  
  .filter-group {
    width: 100%;
  }
  
  .detail-info {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .data-table, .detail-table {
    font-size: 0.75rem;
  }
  
  .data-table th, .data-table td,
  .detail-table th, .detail-table td {
    padding: 0.5rem;
  }
}
</style>