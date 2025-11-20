// composables/useChargeReportApi.ts
import { ref } from 'vue'

// ==================== TYPES ====================
interface FilterParams {
  month?: number | string
  year?: number | string
  fromDate?: string
  toDate?: string
  status?: string
  chg_code?: string
  bank?: string
  limit?: number | string
}

interface BankInfo {
  id: string
  code: string
  nameL: string
  nameE?: string
}

interface ChargeCode {
  chg_sys_id: string
  chg_code: string
  chg_lao_type: string
  chg_eng_type?: string
}

interface UserRole {
  isAdmin: boolean
  bankId: string
  gid: number | null
}

interface ApiResponse<T> {
  status: string
  message?: string
  data: T
  user_info?: any
}

// ==================== COMPOSABLE ====================
export const useChargeReportApi = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBase

  // ==================== STATE ====================
  const summaryData = ref<any>(null)
  const mainReportData = ref<any[]>([])
  const detailData = ref<any[]>([])
  const bankList = ref<BankInfo[]>([])
  const chargeCodeList = ref<ChargeCode[]>([])
  const userInfo = ref<any>(null)
  
  const loadingSummary = ref(false)
  const loadingMain = ref(false)
  const loadingDetail = ref(false)
  const loadingBankList = ref(false)
  const loadingChargeCodeList = ref(false)
  
  const error = ref<string | null>(null)
  const isAdmin = ref(false)

  // ==================== HELPERS ====================
  
  /**
   * Get authentication token from localStorage
   */
  const getAuthToken = (): string | null => {
    if (process.client) {
      return localStorage.getItem('access_token') || null
    }
    return null
  }

  /**
   * Get user role information
   */
  const getUserRole = (): UserRole => {
    try {
      if (process.client) {
        const userDataStr = localStorage.getItem('user_data')
        if (userDataStr) {
          const userData = JSON.parse(userDataStr)
          const gid = userData?.GID?.GID || null
          return {
            isAdmin: [1, 2, 3, 4, 5].includes(gid),
            bankId: userData?.MID?.id ? String(userData.MID.id).padStart(2, '0') : '',
            gid: gid
          }
        }
      }
    } catch (err) {
      console.error('Error getting user role:', err)
    }
    return { isAdmin: false, bankId: '', gid: null }
  }

  /**
   * Check if user has access to specific bank data
   */
  const checkUserAccess = (bankId: string): boolean => {
    const roleInfo = getUserRole()
    if (roleInfo.isAdmin) return true
    return roleInfo.bankId === bankId
  }

  /**
   * Build query parameters from filters
   */
  const buildQueryParams = (filters: FilterParams): URLSearchParams => {
    const params = new URLSearchParams()
    
    if (filters.month) params.append('month', filters.month.toString())
    if (filters.year) params.append('year', filters.year.toString())
    if (filters.fromDate) params.append('fromDate', filters.fromDate)
    if (filters.toDate) params.append('toDate', filters.toDate)
    if (filters.status) params.append('status', filters.status)
    if (filters.bank) params.append('bank', filters.bank)
    if (filters.chg_code) params.append('chg_code', filters.chg_code)
    if (filters.limit) params.append('limit', filters.limit.toString())
    
    return params
  }

  /**
   * Generic fetch wrapper with error handling
   */
  const fetchWithAuth = async <T>(url: string): Promise<T> => {
    const token = getAuthToken()
    
    if (!token) {
      throw new Error('ບໍ່ພົບ Token ການເຂົ້າສູ່ລະບົບ')
    }
    
    try {
      const response = await $fetch<T>(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      return response
    } catch (err: any) {
      console.error('API Error:', err)
      throw new Error(err.data?.message || err.message || 'ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນ')
    }
  }

  // ==================== API METHODS ====================

  /**
   * Fetch summary statistics
   */
  const fetchSummaryStats = async (filters: FilterParams = {}) => {
    loadingSummary.value = true
    error.value = null
    
    try {
      const params = buildQueryParams(filters)
      const response = await fetchWithAuth<ApiResponse<any>>(
        `${baseURL}api/charge_report_summary/?${params.toString()}`
      )
      
      if (response.status === 'success') {
        summaryData.value = response.data
        userInfo.value = response.data?.user_info
        isAdmin.value = response.data?.user_info?.is_admin || false
      } else {
        throw new Error('Invalid response format')
      }
      
      return response
    } catch (err: any) {
      error.value = err.message
      summaryData.value = null
      throw err
    } finally {
      loadingSummary.value = false
    }
  }

  /**
   * Fetch main report (grouped by charge code)
   */
  const fetchMainReport = async (filters: FilterParams = {}) => {
    loadingMain.value = true
    error.value = null
    
    try {
      const params = buildQueryParams(filters)
      const response = await fetchWithAuth<ApiResponse<any[]>>(
        `${baseURL}api/charge_report_main/?${params.toString()}`
      )
      
      if (response.status === 'success') {
        mainReportData.value = response.data || []
      } else {
        throw new Error('Invalid response format')
      }
      
      return response
    } catch (err: any) {
      error.value = err.message
      mainReportData.value = []
      throw err
    } finally {
      loadingMain.value = false
    }
  }

  /**
   * Fetch detail report (transaction level)
   */
  const fetchDetailReport = async (filters: FilterParams = {}) => {
    loadingDetail.value = true
    error.value = null
    
    try {
      const params = buildQueryParams(filters)
      const response = await fetchWithAuth<ApiResponse<any[]>>(
        `${baseURL}api/charge_report_detail/?${params.toString()}`
      )
      
      if (response.status === 'success') {
        detailData.value = response.data || []
      } else {
        throw new Error('Invalid response format')
      }
      
      return response
    } catch (err: any) {
      error.value = err.message
      detailData.value = []
      throw err
    } finally {
      loadingDetail.value = false
    }
  }

  /**
   * Fetch bank list (for admin users)
   */
  const fetchBankList = async () => {
    loadingBankList.value = true
    error.value = null
    
    try {
      const response = await fetchWithAuth<any>(
        `${baseURL}/api/memberinfo/`
      )
      
      // Handle different response formats
      if (Array.isArray(response)) {
        bankList.value = response
      } else if (response?.status === 'success' && Array.isArray(response.data)) {
        bankList.value = response.data
      } else if (response?.data && Array.isArray(response.data)) {
        bankList.value = response.data
      } else {
        bankList.value = []
      }
      
      return response
    } catch (err: any) {
      error.value = err.message
      bankList.value = []
      console.error('Error fetching bank list:', err)
    } finally {
      loadingBankList.value = false
    }
  }

  /**
   * Fetch charge code list
   */
  const fetchChargeCodeList = async () => {
    loadingChargeCodeList.value = true
    error.value = null
    
    try {
      const response = await fetchWithAuth<any>(
        `${baseURL}/api/charge-matrix/`
      )
      
      // Handle different response formats
      if (Array.isArray(response)) {
        chargeCodeList.value = response
      } else if (response?.status === 'success' && Array.isArray(response.data)) {
        chargeCodeList.value = response.data
      } else if (response?.data && Array.isArray(response.data)) {
        chargeCodeList.value = response.data
      } else {
        chargeCodeList.value = []
      }
      
      return response
    } catch (err: any) {
      error.value = err.message
      chargeCodeList.value = []
      console.error('Error fetching charge codes:', err)
    } finally {
      loadingChargeCodeList.value = false
    }
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Format number with thousand separators
   */
  const formatNumber = (value: number | string | null | undefined): string => {
    if (!value || value === 0) return '0'
    const numValue = typeof value === 'string' ? parseFloat(value) : value
    if (isNaN(numValue)) return '0'
    return new Intl.NumberFormat('lo-LA').format(numValue)
  }

  /**
   * Format currency with Lao Kip symbol
   */
  const formatCurrency = (value: number | string | null | undefined): string => {
    if (!value || value === 0) return '0 ₭'
    const numValue = typeof value === 'string' ? parseFloat(value) : value
    if (isNaN(numValue)) return '0 ₭'
    return `${new Intl.NumberFormat('lo-LA').format(numValue)} ₭`
  }

  /**
   * Clear all data (useful for logout)
   */
  const clearAllData = () => {
    summaryData.value = null
    mainReportData.value = []
    detailData.value = []
    bankList.value = []
    chargeCodeList.value = []
    userInfo.value = null
    error.value = null
    isAdmin.value = false
  }

  /**
   * Refresh all data with current filters
   */
  const refreshAllData = async (filters: FilterParams = {}) => {
    await Promise.all([
      fetchSummaryStats(filters),
      fetchMainReport(filters),
      fetchDetailReport(filters)
    ])
  }

  // ==================== RETURN ====================
  return {
    // State
    summaryData,
    mainReportData,
    detailData,
    bankList,
    chargeCodeList,
    userInfo,
    error,
    
    // Loading States
    loadingSummary,
    loadingMain,
    loadingDetail,
    loadingBankList,
    loadingChargeCodeList,
    
    // User Info
    isAdmin,
    
    // API Methods
    fetchSummaryStats,
    fetchMainReport,
    fetchDetailReport,
    fetchBankList,
    fetchChargeCodeList,
    
    // Helper Methods
    getUserRole,
    checkUserAccess,
    formatNumber,
    formatCurrency,
    
    // Utility Methods
    clearAllData,
    refreshAllData
  }
}