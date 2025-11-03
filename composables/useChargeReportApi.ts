// composables/useChargeReportApi.ts
import { ref } from 'vue'

export const useChargeReportApi = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBase

  // State
  const summaryData = ref<any>(null)
  const mainReportData = ref<any[]>([])
  const detailData = ref<any[]>([])
  const bankList = ref<any[]>([])
  const chargeCodeList = ref<any[]>([])
  const userInfo = ref<any>(null)
  
  const loadingSummary = ref(false)
  const loadingMain = ref(false)
  const loadingDetail = ref(false)
  
  const isAdmin = ref(false)

  // Helper to get auth token
  const getAuthToken = () => {
    if (process.client) {
      return localStorage.getItem('access_token') || null
    }
    return null
  }

  // Helper to get user role
  const getUserRole = () => {
    try {
      if (process.client) {
        const userDataStr = localStorage.getItem('user_data')
        if (userDataStr) {
          const userData = JSON.parse(userDataStr)
          const gid = userData?.GID?.GID
          return {
            isAdmin: [1, 2, 3, 4, 5].includes(gid),
            bankId: userData?.MID?.id ? String(userData.MID.id).padStart(2, '0') : '',
            gid: gid
          }
        }
      }
    } catch (error) {
      console.error('Error getting user role:', error)
    }
    return { isAdmin: false, bankId: '', gid: null }
  }

  // Check user access to bank data
  const checkUserAccess = (bankId: string) => {
    const roleInfo = getUserRole()
    if (roleInfo.isAdmin) return true
    return roleInfo.bankId === bankId
  }

  // Fetch charge code list
  const fetchChargeCodeList = async () => {
    try {
      const token = getAuthToken()
      const response = await $fetch(`${baseURL}/api/charge-matrix/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.status === 'success') {
        chargeCodeList.value = response.data || []
      }
    } catch (error) {
      console.error('Error fetching charge codes:', error)
      chargeCodeList.value = []
    }
  }

  // Fetch summary statistics
  const fetchSummaryStats = async (filters: any = {}) => {
    loadingSummary.value = true
    try {
      const token = getAuthToken()
      const params = new URLSearchParams()
      
      if (filters.fromDate) params.append('fromDate', filters.fromDate)
      if (filters.toDate) params.append('toDate', filters.toDate)
      if (filters.month) params.append('month', filters.month)
      if (filters.year) params.append('year', filters.year)
      if (filters.bank) params.append('bank', filters.bank)
      if (filters.chg_code) params.append('chg_code', filters.chg_code)
      
      const response = await $fetch(`${baseURL}/api/charge_report_summary/?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${Bearer}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.status === 'success') {
        summaryData.value = response.data
        userInfo.value = response.data.user_info
        isAdmin.value = response.data.user_info.is_admin
      }
    } catch (error) {
      console.error('Error fetching summary stats:', error)
      summaryData.value = null
    } finally {
      loadingSummary.value = false
    }
  }

  // Fetch main report
  const fetchMainReport = async (filters: any = {}) => {
    loadingMain.value = true
    try {
      const token = getAuthToken()
      const params = new URLSearchParams()
      
      if (filters.fromDate) params.append('fromDate', filters.fromDate)
      if (filters.toDate) params.append('toDate', filters.toDate)
      if (filters.month) params.append('month', filters.month)
      if (filters.year) params.append('year', filters.year)
      if (filters.bank) params.append('bank', filters.bank)
      if (filters.chg_code) params.append('chg_code', filters.chg_code)
      
      const response = await $fetch(`${baseURL}/api/charge_report_main/?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.status === 'success') {
        mainReportData.value = response.data || []
      }
    } catch (error) {
      console.error('Error fetching main report:', error)
      mainReportData.value = []
    } finally {
      loadingMain.value = false
    }
  }

  // Fetch detail report
  const fetchDetailReport = async (filters: any = {}) => {
    loadingDetail.value = true
    try {
      const token = getAuthToken()
      const params = new URLSearchParams()
      
      if (filters.month) params.append('month', filters.month.toString())
      if (filters.year) params.append('year', filters.year.toString())
      if (filters.fromDate) params.append('fromDate', filters.fromDate)
      if (filters.toDate) params.append('toDate', filters.toDate)
      if (filters.status) params.append('status', filters.status)
      if (filters.bank) params.append('bank', filters.bank)
      if (filters.chg_code) params.append('chg_code', filters.chg_code)
      if (filters.limit) params.append('limit', filters.limit.toString())
      
      const response = await $fetch(`${baseURL}/api/charge_report_detail/?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.status === 'success') {
        detailData.value = response.data || []
      }
    } catch (error) {
      console.error('Error fetching detail report:', error)
      detailData.value = []
    } finally {
      loadingDetail.value = false
    }
  }

  // Fetch bank list
  const fetchBankList = async () => {
    try {
      const token = getAuthToken()
      const response = await $fetch(`${baseURL}/api/memberinfo/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.status === 'success') {
        bankList.value = response.data || []
      }
    } catch (error) {
      console.error('Error fetching bank list:', error)
      bankList.value = []
    }
  }

  // Format number with thousand separators
  const formatNumber = (value: number) => {
    if (!value) return '0'
    return new Intl.NumberFormat('lo-LA').format(value)
  }

  // Format currency
  const formatCurrency = (value: number) => {
    if (!value) return '0 ₭'
    return `${new Intl.NumberFormat('lo-LA').format(value)} ₭`
  }

  return {
    // State
    summaryData,
    mainReportData,
    detailData,
    bankList,
    chargeCodeList,
    userInfo,
    loadingSummary,
    loadingMain,
    loadingDetail,
    isAdmin,
    
    // Methods
    fetchSummaryStats,
    fetchMainReport,
    fetchDetailReport,
    fetchBankList,
    fetchChargeCodeList,
    getUserRole,
    checkUserAccess,
    formatNumber,
    formatCurrency
  }
}