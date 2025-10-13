// pages/charge-report.vue
<template>
  <div class="dashboard-container">
    <div class="header">
      <h1>Fee Report Dashboard</h1>
      <p class="subtitle">{{ userInfo.is_admin ? 'All Banks' : `Bank ${userInfo.bank_code}` }}</p>
    </div>

    <!-- Summary Cards -->
    <div class="summary-grid">
      <div class="card card-primary">
        <div class="card-icon">💰</div>
        <div class="card-content">
          <p class="card-label">Total Fee This Month</p>
          <h2 class="card-value">{{ formatCurrency(summaryStats.monthlyFee) }}</h2>
        </div>
      </div>

      <div class="card card-success">
        <div class="card-icon">📅</div>
        <div class="card-content">
          <p class="card-label">Fee Today</p>
          <h2 class="card-value">{{ formatCurrency(summaryStats.dailyFee) }}</h2>
        </div>
      </div>

      <div class="card card-info">
        <div class="card-icon">📊</div>
        <div class="card-content">
          <p class="card-label">Total Transactions</p>
          <h2 class="card-value">{{ summaryStats.totalTransactions.toLocaleString() }}</h2>
        </div>
      </div>

      <div class="card card-warning">
        <div class="card-icon">🏦</div>
        <div class="card-content">
          <p class="card-label">Most Active Bank</p>
          <h2 class="card-value">{{ summaryStats.topBank.bank }}</h2>
          <p class="card-subtext">{{ summaryStats.topBank.count }} transactions</p>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-section">
      <div class="filters-row">
        <div class="filter-group">
          <label>Year</label>
          <select v-model="filters.year" @change="fetchData">
            <option value="">All Years</option>
            <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
          </select>
        </div>

        <div class="filter-group">
          <label>Month</label>
          <select v-model="filters.month" @change="fetchData">
            <option value="">All Months</option>
            <option v-for="month in months" :key="month.value" :value="month.value">
              {{ month.label }}
            </option>
          </select>
        </div>

        <div class="filter-group" v-if="userInfo.is_admin">
          <label>Bank</label>
          <select v-model="filters.bank" @change="fetchData">
            <option value="">All Banks</option>
            <option v-for="bank in uniqueBanks" :key="bank" :value="bank">{{ bank }}</option>
          </select>
        </div>

        <button @click="clearFilters" class="btn-clear">Clear Filters</button>
      </div>
    </div>

    <!-- Monthly Report by Bank -->
    <div class="report-section">
      <h2>Monthly Report by Bank</h2>
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Bank</th>
              <th>Year</th>
              <th>Month</th>
              <th>Total Amount</th>
              <th>Transactions</th>
              <th>Avg Amount</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in reportData" :key="`${item.bank_code}-${item.year}-${item.month}`">
              <td><span class="badge">{{ item.bank_code }}</span></td>
              <td>{{ item.year }}</td>
              <td>{{ item.month_name }}</td>
              <td class="amount">{{ formatCurrency(item.total_charge_amount) }}</td>
              <td>{{ item.transaction_count }}</td>
              <td>{{ formatCurrency(item.avg_charge_amount) }}</td>
              <td>
                <button 
                  @click="viewDetails(item)" 
                  class="btn-detail"
                >
                  View Details
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
          <h2>Transaction Details - {{ selectedBank?.bank_code }}</h2>
          <button @click="closeModal" class="btn-close">&times;</button>
        </div>

        <div class="modal-body">
          <div class="detail-info">
            <p><strong>Period:</strong> {{ selectedBank?.month_name }} {{ selectedBank?.year }}</p>
            <p><strong>Total:</strong> {{ formatCurrency(selectedBank?.total_charge_amount) }}</p>
            <p><strong>Transactions:</strong> {{ selectedBank?.transaction_count }}</p>
          </div>

          <div class="table-container">
            <table class="detail-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Enterprise</th>
                  <th>Loan Purpose</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="detail in detailData" :key="detail.rec_charge_ID">
                  <td>{{ detail.rec_charge_ID }}</td>
                  <td class="text-left">{{ detail.LCIC_ID }}</td>
                  <td>{{ detail.lon_purpose }}</td>
                  <td class="amount">{{ formatCurrency(detail.chg_amount) }}</td>
                  <td>
                    <span :class="['status-badge', `status-${detail.status}`]">
                      {{ detail.status }}
                    </span>
                  </td>
                  <td>{{ formatDate(detail.insert_date) }}</td>
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface ChargeReport {
  bank_code: string
  year: number
  month: number
  month_name: string
  total_charge_amount: number
  transaction_count: number
  avg_charge_amount: number
}

interface ChargeDetail {
  rec_charge_ID: number
  bnk_code: string
  LCIC_ID: string
  lon_purpose: string
  chg_amount: number
  status: string
  insert_date: string
  chg_unit: string
}

const loading = ref(false)
const reportData = ref<ChargeReport[]>([])
const detailData = ref<ChargeDetail[]>([])
const showDetailModal = ref(false)
const selectedBank = ref<ChargeReport | null>(null)

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
  monthlyFee: 0,
  dailyFee: 0,
  totalTransactions: 0,
  topBank: { bank: '-', count: 0 }
})

const years = computed(() => {
  const currentYear = new Date().getFullYear()
  return Array.from({ length: 5 }, (_, i) => currentYear - i)
})

const months = [
  { value: '1', label: 'January' },
  { value: '2', label: 'February' },
  { value: '3', label: 'March' },
  { value: '4', label: 'April' },
  { value: '5', label: 'May' },
  { value: '6', label: 'June' },
  { value: '7', label: 'July' },
  { value: '8', label: 'August' },
  { value: '9', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' }
]

const uniqueBanks = computed(() => {
  return [...new Set(reportData.value.map(item => item.bank_code))]
})

const { fetchSummaryReport, fetchDetailReport } = useChargeReportApi()

const fetchData = async () => {
  loading.value = true
  try {
    const data = await fetchSummaryReport({
      year: filters.value.year,
      month: filters.value.month,
      bank: filters.value.bank
    })
    
    if (data.status === 'success') {
      reportData.value = data.data
      userInfo.value = data.user_info
      
      // Calculate summary stats
      summaryStats.value.monthlyFee = data.summary.total_amount
      summaryStats.value.totalTransactions = data.summary.total_transactions
      
      // Find top bank
      if (data.data.length > 0) {
        const topBankData = data.data.reduce((max: ChargeReport, item: ChargeReport) => 
          item.transaction_count > max.transaction_count ? item : max
        )
        summaryStats.value.topBank = {
          bank: topBankData.bank_code,
          count: topBankData.transaction_count
        }
      }
      
      // Get today's fee
      await fetchDailyFee()
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    loading.value = false
  }
}

const fetchDailyFee = async () => {
  try {
    const today = new Date().toISOString().split('T')[0]
    const data = await fetchDetailReport({
      fromDate: today,
      toDate: today
    })
    if (data.status === 'success') {
      summaryStats.value.dailyFee = data.data.reduce((sum: number, item: ChargeDetail) => 
        sum + item.chg_amount, 0
      )
    }
  } catch (error) {
    console.error('Error fetching daily fee:', error)
  }
}

const viewDetails = async (item: ChargeReport) => {
  loading.value = true
  selectedBank.value = item
  
  try {
    const data = await fetchDetailReport({
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
    console.error('Error fetching details:', error)
  } finally {
    loading.value = false
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
  }).format(amount) + ' LAK'
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.dashboard-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
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

.card-subtext {
  color: #999;
  font-size: 0.875rem;
  margin-top: 0.25rem;
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
}

.filter-group select:focus {
  outline: none;
  border-color: #4f46e5;
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
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-detail:hover {
  background: #4338ca;
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
}

.detail-table td {
  padding: 0.75rem;
  border-bottom: 1px solid #f3f4f6;
}

.text-left {
  text-align: left !important;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
}

.status-pending {
  background: #fef3c7;
  color: #92400e;
}

.status-completed {
  background: #d1fae5;
  color: #065f46;
}

.status-failed {
  background: #fee2e2;
  color: #991b1b;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f4f6;
  border-top-color: #4f46e5;
  border-radius: 50%;
  animation: spin 1s linear infinite;
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
}
</style>