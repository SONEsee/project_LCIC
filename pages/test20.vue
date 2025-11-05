<template>
  <div class="charge-report-dashboard">
    <!-- Header with Filters -->
    <div class="dashboard-header">
      <h1 class="dashboard-title">
        <Icon name="mdi:chart-line" />
        <span>ລາຍງານຄ່າທຳນຽມ</span>
      </h1>
      
      <!-- Filter Section -->
      <div class="filter-section">
        <div class="filter-row">
          <!-- Date Range Filter -->
          <div class="filter-group">
            <label class="filter-label">ຊ່ວງວັນທີ</label>
            <div class="date-range">
              <input 
                v-model="filters.fromDate" 
                type="date" 
                class="date-input"
                placeholder="ວັນທີເລີ່ມຕົ້ນ"
                @change="handleDateChange"
              />
              <span class="date-separator">ຫາ</span>
              <input 
                v-model="filters.toDate" 
                type="date" 
                class="date-input"
                placeholder="ວັນທີສິ້ນສຸດ"
                @change="handleDateChange"
              />
            </div>
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
            <select v-model="filters.year" class="filter-select" @change="handleMonthYearChange">
              <option value="">ທັງໝົດ</option>
              <option v-for="year in yearOptions" :key="year" :value="year">
                {{ year }}
              </option>
            </select>
          </div>
          
          <!-- Bank Filter (Admin only) -->
          <div class="filter-group" v-if="isAdmin">
            <label class="filter-label">ທະນາຄານ</label>
            <select v-model="filters.bank" class="filter-select">
              <option value="all">ທັງໝົດ</option>
              <option v-for="bank in bankList" :key="bank.bnk_code" :value="bank.bnk_code">
                {{ bank.bnk_code }} - {{ bank.nameL || bank.nameE }}
              </option>
            </select>
          </div>
          
          <!-- Charge Code Filter -->
          <div class="filter-group">
            <label class="filter-label">ປະເພດຄ່າທຳນຽມ</label>
            <select v-model="filters.chg_code" class="filter-select">
              <option value="all">ທັງໝົດ</option>
              <option
                v-for="item in chargeCodeList"
                :key="item.chg_sys_id"
                :value="item.chg_code"
              >
                {{ item.chg_code }} - {{ item.chg_lao_type }}
              </option>
            </select>
          </div>
          
          <!-- Action Buttons -->
          <div class="filter-actions">
            <button 
              @click="applyFilters" 
              class="btn btn-primary" 
              :disabled="loading"
            >
              <Icon name="mdi:magnify" />
              <span>ຄົ້ນຫາ</span>
            </button>
            <button @click="resetFilters" class="btn btn-secondary">
              <Icon name="mdi:refresh" />
              <span>ລ້າງຄ່າ</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Summary Cards -->
    <div class="summary-cards">
      <div class="summary-card">
        <div class="card-header">
          <Icon name="mdi:receipt-text-outline" class="card-icon" />
          <span class="card-title">ທຸລະກຳລວມ</span>
        </div>
        <div class="card-body">
          <div class="main-value">
            <span class="month-label">{{ currentMonthLabel }}</span>
            <span class="value">{{ formatNumber(monthlyTransactions) }}</span>
          </div>
          <div class="today-value" :class="{ positive: todayTransactions > 0 }">
            <Icon name="mdi:trending-up" v-if="todayTransactions > 0" />
            <span>+{{ todayTransactions }} ວັນນີ້</span>
          </div>
        </div>
      </div>
      
      <div class="summary-card">
        <div class="card-header">
          <Icon name="mdi:cash-multiple" class="card-icon amount-icon" />
          <span class="card-title">ຍອດເງິນລວມ</span>
        </div>
        <div class="card-body">
          <div class="main-value">
            <span class="month-label">{{ currentMonthLabel }}</span>
            <span class="value amount-value">{{ formatCurrency(monthlyAmount) }}</span>
          </div>
          <div class="today-value" :class="{ positive: todayAmount > 0 }">
            <Icon name="mdi:trending-up" v-if="todayAmount > 0" />
            <span>+{{ formatCurrency(todayAmount) }} ວັນນີ້</span>
          </div>
        </div>
      </div>
      
      <div class="summary-card top-bank-card" v-if="isAdmin && topBankByAmount">
        <div class="card-header">
          <Icon name="mdi:bank" class="card-icon bank-icon" />
          <span class="card-title">ທະນາຄານຍອດເງິນສູງສຸດ</span>
        </div>
        <div class="card-body">
          <div class="bank-info">
            <span class="bank-name">{{ topBankByAmount.bank_name }}</span>
            <span class="bank-code">({{ topBankByAmount.bank_code }})</span>
          </div>
          <div class="main-value">
            <span class="value">{{ formatCurrency(topBankByAmount.total_amount) }}</span>
          </div>
          <div class="today-value" :class="{ positive: topBankByAmount.today_amount > 0 }">
            <Icon name="mdi:trending-up" v-if="topBankByAmount.today_amount > 0" />
            <span>+{{ formatCurrency(topBankByAmount.today_amount) }} ວັນນີ້</span>
          </div>
        </div>
      </div>
      
      <div class="summary-card top-bank-card" v-if="isAdmin && topBankByTransactions">
        <div class="card-header">
          <Icon name="mdi:bank-transfer" class="card-icon transaction-icon" />
          <span class="card-title">ທະນາຄານທຸລະກຳສູງສຸດ</span>
        </div>
        <div class="card-body">
          <div class="bank-info">
            <span class="bank-name">{{ topBankByTransactions.bank_name }}</span>
            <span class="bank-code">({{ topBankByTransactions.bank_code }})</span>
          </div>
          <div class="main-value">
            <span class="value">{{ formatNumber(topBankByTransactions.total_transactions) }} ລາຍການ</span>
          </div>
          <div class="today-value" :class="{ positive: topBankByTransactions.today_transactions > 0 }">
            <Icon name="mdi:trending-up" v-if="topBankByTransactions.today_transactions > 0" />
            <span>+{{ topBankByTransactions.today_transactions }} ວັນນີ້</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Data Table Section -->
    <div class="data-section">
      <div class="section-header">
        <h2 class="section-title">ຂໍ້ມູນທະນາຄານ</h2>
        <button @click="exportData" class="btn btn-export">
          <Icon name="mdi:download" />
          <span>ສົ່ງອອກ</span>
        </button>
      </div>
      
      <!-- Loading State -->
      <div v-if="loading" class="loading-container">
        <div class="spinner"></div>
        <p>ກຳລັງໂຫຼດຂໍ້ມູນ...</p>
      </div>
      
      <!-- Grouped Data (Year/Month) -->
      <div v-else-if="isGroupedData" class="table-container">
        <div v-for="group in mainReportData" :key="group.period" class="group-section">
          <h3 class="group-header">{{ group.period }}</h3>
          <table class="data-table">
            <thead>
              <tr>
                <th>ລະຫັດທະນາຄານ</th>
                <th>ຊື່ທະນາຄານ</th>
                <th class="text-right">ຈຳນວນທຸລະກຳ</th>
                <th class="text-right">ຍອດເງິນລວມ</th>
                <th class="text-right">ຄ່າສະເລ່ຍ</th>
                <th class="text-center">ການດຳເນີນການ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="bank in group.banks" :key="bank.bank_code">
                <td class="text-center">{{ bank.bank_code }}</td>
                <td>{{ bank.bank_name }}</td>
                <td class="text-right">{{ formatNumber(bank.transaction_count) }}</td>
                <td class="text-right">{{ formatCurrency(bank.total_charge_amount) }}</td>
                <td class="text-right">
                  {{ formatCurrency(bank.total_charge_amount / (bank.transaction_count || 1)) }}
                </td>
                <td class="text-center">
                  <!-- ✅ FIX: Pass period to viewDetails -->
                  <button 
                    @click="viewDetails(bank.bank_code, group.period)" 
                    class="btn-view-details" 
                    title="ເບິ່ງລາຍລະອຽດ"
                  >
                    <Icon name="mdi:eye" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Normal Bank Data -->
      <div v-else-if="mainReportData.length > 0" class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>ລະຫັດທະນາຄານ</th>
              <th>ຊື່ທະນາຄານ</th>
              <th class="text-right">ຈຳນວນທຸລະກຳ</th>
              <th class="text-right">ຍອດເງິນລວມ</th>
              <th class="text-right">ຄ່າສະເລ່ຍ</th>
              <th class="text-center">ການດຳເນີນການ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="bank in mainReportData" :key="bank.bank_code">
              <td class="text-center">{{ bank.bank_code }}</td>
              <td>{{ bank.bank_name }}</td>
              <td class="text-right">{{ formatNumber(bank.transaction_count) }}</td>
              <td class="text-right">{{ formatCurrency(bank.total_charge_amount) }}</td>
              <td class="text-right">
                {{ formatCurrency(bank.total_charge_amount / (bank.transaction_count || 1)) }}
              </td>
              <td class="text-center">
                <!-- ✅ No period for non-grouped data -->
                <button 
                  @click="viewDetails(bank.bank_code)" 
                  class="btn-view-details" 
                  title="ເບິ່ງລາຍລະອຽດ"
                >
                  <Icon name="mdi:eye" />
                </button>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="total-row">
              <td colspan="2" class="text-right">ລວມທັງໝົດ:</td>
              <td class="text-right">{{ formatNumber(totalTransactions) }}</td>
              <td class="text-right">{{ formatCurrency(totalAmount) }}</td>
              <td></td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
      
      <!-- Empty State -->
      <div v-else class="empty-state">
        <Icon name="mdi:database-off" class="empty-icon" />
        <h3>ບໍ່ພົບຂໍ້ມູນ</h3>
        <p>ກະລຸນາເລືອກເງື່ອນໄຂການຄົ້ນຫາ</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useChargeReportApi } from '~/composables/useChargeReportApi'

definePageMeta({
  middleware: 'auth',
  layout: 'backend'
})

const {
  summaryData,
  mainReportData,
  bankList,
  chargeCodeList,
  userInfo,
  loadingSummary,
  loadingMain,
  isAdmin,
  fetchSummaryStats,
  fetchMainReport,
  fetchBankList,
  fetchChargeCodeList,
  formatNumber,
  formatCurrency
} = useChargeReportApi()

const filters = ref({
  fromDate: '',
  toDate: '',
  month: '',
  year: new Date().getFullYear().toString(),
  bank: 'all',
  chg_code: 'all'
})

const loading = computed(() => loadingSummary.value || loadingMain.value)

const yearOptions = computed(() => {
  const currentYear = new Date().getFullYear()
  const years = []
  for (let i = 0; i < 5; i++) {
    years.push(currentYear - i)
  }
  return years
})

const currentMonthLabel = computed(() => {
  if (summaryData.value?.current_month_stats?.month_label) {
    return summaryData.value.current_month_stats.month_label
  }
  const now = new Date()
  return `${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()}`
})

const monthlyTransactions = computed(() => {
  return summaryData.value?.current_month_stats?.total_transactions || 0
})

const monthlyAmount = computed(() => {
  return summaryData.value?.current_month_stats?.total_amount || 0
})

const todayTransactions = computed(() => {
  return summaryData.value?.current_month_stats?.today_transactions || 0
})

const todayAmount = computed(() => {
  return summaryData.value?.current_month_stats?.today_amount || 0
})

const topBankByAmount = computed(() => {
  return summaryData.value?.top_banks?.by_amount || null
})

const topBankByTransactions = computed(() => {
  return summaryData.value?.top_banks?.by_transactions || null
})

const isGroupedData = computed(() => {
  return mainReportData.value.length > 0 && 
         mainReportData.value[0].hasOwnProperty('period') &&
         mainReportData.value[0].hasOwnProperty('banks')
})

const totalTransactions = computed(() => {
  if (isGroupedData.value) {
    return mainReportData.value.reduce((sum, group) => {
      return sum + group.banks.reduce((bankSum: number, bank: any) => bankSum + bank.transaction_count, 0)
    }, 0)
  }
  return mainReportData.value.reduce((sum, bank) => sum + bank.transaction_count, 0)
})

const totalAmount = computed(() => {
  if (isGroupedData.value) {
    return mainReportData.value.reduce((sum, group) => {
      return sum + group.banks.reduce((bankSum: number, bank: any) => bankSum + bank.total_charge_amount, 0)
    }, 0)
  }
  return mainReportData.value.reduce((sum, bank) => sum + bank.total_charge_amount, 0)
})

const handleDateChange = () => {
  if (filters.value.fromDate || filters.value.toDate) {
    filters.value.month = ''
    filters.value.year = ''
  }
}

const handleMonthYearChange = () => {
  if (filters.value.month || filters.value.year) {
    filters.value.fromDate = ''
    filters.value.toDate = ''
  }
}

const applyFilters = async () => {
  const filterParams: any = {}
  
  if (filters.value.fromDate) filterParams.fromDate = filters.value.fromDate
  if (filters.value.toDate) filterParams.toDate = filters.value.toDate
  if (filters.value.month) filterParams.month = filters.value.month
  if (filters.value.year) filterParams.year = filters.value.year
  if (filters.value.bank && filters.value.bank !== 'all') filterParams.bank = filters.value.bank
  if (filters.value.chg_code && filters.value.chg_code !== 'all') filterParams.chg_code = filters.value.chg_code
  
  await Promise.all([
    fetchSummaryStats(filterParams),
    fetchMainReport(filterParams)
  ])
}

const resetFilters = () => {
  const now = new Date()
  filters.value = {
    fromDate: '',
    toDate: '',
    month: '',
    year: now.getFullYear().toString(),
    bank: 'all',
    chg_code: 'all'
  }
  applyFilters()
}

/**
 * ✅ FIXED: Extract month and year from period when grouped data
 * @param bankCode - Bank code to view details for
 * @param period - Optional period string (e.g., "09-2025" or "2025")
 */
const viewDetails = (bankCode: string, period?: string) => {
  const queryParams: any = { bank: bankCode }
  
  // ✅ FIX: If period is provided (from grouped data), extract month and year from it
  if (period) {
    const periodParts = period.split('-')
    
    if (periodParts.length === 2) {
      // Format: "09-2025" (month-year)
      const month = periodParts[0]
      const year = periodParts[1]
      queryParams.month = parseInt(month).toString()  // Remove leading zero
      queryParams.year = year
    } else if (periodParts.length === 1) {
      // Format: "2025" (year only)
      queryParams.year = periodParts[0]
    }
  } else {
    // ✅ No period provided, use current filter values
    if (filters.value.month) queryParams.month = filters.value.month
    if (filters.value.year) queryParams.year = filters.value.year
    if (filters.value.fromDate) queryParams.fromDate = filters.value.fromDate
    if (filters.value.toDate) queryParams.toDate = filters.value.toDate
  }
  
  // Add charge code if it's set and not 'all'
  if (filters.value.chg_code && filters.value.chg_code !== 'all') {
    queryParams.chg_code = filters.value.chg_code
  }
  
  // Navigate to detail page
  navigateTo({
    path: '/test25',
    query: queryParams
  })
}

const exportData = () => {
  console.log('Export data')
}

onMounted(async () => {
  await Promise.all([
    fetchBankList(),
    fetchChargeCodeList(),
    applyFilters()
  ])
})
</script>

<style scoped>
/* ... (keep all your existing styles) ... */
.group-section {
  margin-bottom: 32px;
}

.group-header {
  font-size: 16px;
  font-weight: 700;
  color: white;
  padding: 12px 20px;
  background: linear-gradient(to right, #3b82f6, #2563eb);
  border-radius: 8px 8px 0 0;
  margin: 0;
}

.group-section .data-table {
  border-radius: 0 0 8px 8px;
  overflow: hidden;
}

.group-section:last-child {
  margin-bottom: 0;
}

.charge-report-dashboard {
  padding: 24px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);
  min-height: 100vh;
  font-family: 'Phetsarath OT', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.dashboard-header {
  margin-bottom: 24px;
  animation: slideDown 0.3s ease-out;
}

.dashboard-title {
  font-size: 28px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.dashboard-title svg {
  font-size: 32px;
  color: #3b82f6;
}

.filter-section {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 20px;
  border: 1px solid #e5e7eb;
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
  min-width: 0;
  flex: 1 1 auto;
}

.filter-label {
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.date-range {
  display: flex;
  align-items: center;
  gap: 8px;
}

.date-input,
.filter-select {
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;
  background: #ffffff;
  color: #374151;
  min-width: 140px;
}

.date-input:focus,
.filter-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.date-input:hover,
.filter-select:hover {
  border-color: #9ca3af;
}

.date-separator {
  color: #9ca3af;
  font-weight: 500;
}

.filter-actions {
  display: flex;
  gap: 10px;
  flex: 0 0 auto;
}

.btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: #ffffff;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
}

.btn-secondary {
  background: #f3f4f6;
  color: #4b5563;
  border: 1px solid #e5e7eb;
}

.btn-secondary:hover {
  background: #e5e7eb;
  border-color: #d1d5db;
}

.btn-export {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #ffffff;
  font-size: 13px;
  padding: 8px 16px;
}

.btn-export:hover {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(16, 185, 129, 0.3);
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
  animation: fadeInUp 0.4s ease-out;
}

.summary-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #e5e7eb;
  transition: all 0.3s;
}

.summary-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.card-icon {
  font-size: 28px;
  margin-right: 10px;
  color: #3b82f6;
}

.card-icon.amount-icon {
  color: #10b981;
}

.card-icon.bank-icon {
  color: #f59e0b;
}

.card-icon.transaction-icon {
  color: #8b5cf6;
}

.card-title {
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.main-value {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.month-label {
  font-size: 12px;
  color: #9ca3af;
  font-weight: 500;
}

.value {
  font-size: 26px;
  font-weight: 700;
  color: #1f2937;
  line-height: 1.2;
}

.amount-value {
  color: #059669;
}

.today-value {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #6b7280;
  padding-top: 8px;
  border-top: 1px solid #f3f4f6;
}

.today-value.positive {
  color: #10b981;
  font-weight: 600;
}

.today-value svg {
  font-size: 16px;
}

.bank-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.bank-name {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.bank-code {
  font-size: 12px;
  color: #9ca3af;
}

.data-section {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #e5e7eb;
  overflow: hidden;
  animation: fadeInUp 0.5s ease-out;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
  background: linear-gradient(to right, #fafbfc, #f9fafb);
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #6b7280;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

.table-container {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table thead {
  background: linear-gradient(to right, #f9fafb, #f3f4f6);
}

.data-table th {
  padding: 14px 16px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: #4b5563;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #e5e7eb;
}

.data-table td {
  padding: 14px 16px;
  font-size: 14px;
  color: #374151;
  border-bottom: 1px solid #f3f4f6;
}

.data-table tbody tr {
  transition: background-color 0.2s;
}

.data-table tbody tr:hover {
  background-color: #f9fafb;
}

.data-table tbody tr:nth-child(even) {
  background-color: #fafbfc;
}

.total-row {
  background: linear-gradient(to right, #f3f4f6, #e5e7eb);
  font-weight: 700;
}

.total-row td {
  padding: 16px;
  font-size: 15px;
  color: #1f2937;
  border-bottom: none;
}

.text-center {
  text-align: center;
}

.text-right {
  text-align: right;
}

.btn-view-details {
  padding: 6px 10px;
  background: #eff6ff;
  color: #3b82f6;
  border: 1px solid #dbeafe;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-view-details:hover {
  background: #3b82f6;
  color: #ffffff;
  transform: scale(1.05);
}

.btn-view-details svg {
  font-size: 18px;
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
  margin-bottom: 8px;
}

.empty-state p {
  font-size: 14px;
  color: #9ca3af;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .charge-report-dashboard {
    padding: 16px;
  }

  .dashboard-title {
    font-size: 24px;
  }

  .filter-row {
    flex-direction: column;
  }

  .filter-group {
    width: 100%;
  }

  .date-range {
    flex-direction: column;
    gap: 10px;
  }

  .date-input,
  .filter-select {
    width: 100%;
  }

  .filter-actions {
    width: 100%;
    flex-direction: column;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }

  .summary-cards {
    grid-template-columns: 1fr;
  }

  .data-table {
    font-size: 12px;
  }

  .data-table th,
  .data-table td {
    padding: 10px 8px;
  }

  .value {
    font-size: 22px;
  }
}

@media print {
  .filter-section,
  .filter-actions,
  .btn-export,
  .btn-view-details {
    display: none !important;
  }

  .charge-report-dashboard {
    background: #ffffff;
    padding: 0;
  }

  .summary-card,
  .data-section {
    box-shadow: none;
    border: 1px solid #e5e7eb;
    page-break-inside: avoid;
  }
}
</style>