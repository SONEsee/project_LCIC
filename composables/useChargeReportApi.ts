// composables/useChargeReportApi.ts
import { ref, computed } from 'vue'
import type { Ref } from 'vue'

// Types
interface BankInfo {
  id: number
  code: string
  bnk_code: string
  bnk_type: string
  nameL: string
  nameE: string
}

interface UserInfo {
  role_id: number
  is_admin: boolean
  bank_code: string
  role_name: string
  username?: string
  email?: string
}

interface UserData {
  UID: number
  MID: {
    id: string
    code: string
  }
  GID: {
    GID: number
    nameL: string
  }
  username: string
  nameL: string
  nameE: string
  surnameL: string
  surnameE: string
  profile_image: string | null
  is_active: boolean
  last_login: string
  is_staff: boolean
  is_superuser: boolean
}

interface SummaryStats {
  month_label: string
  total_transactions: number
  total_amount: number
  today_transactions: number
  today_amount: number
  formatted_amount: string
  formatted_today_amount: string
}

interface TodayStats {
  date: string
  transactions: number
  amount: number
  formatted_amount: string
}

interface TopBankStats {
  bank_code: string
  bank_name: string
  total_amount: number
  total_transactions: number
  today_amount: number
  today_transactions: number
  formatted_amount: string
  formatted_today_amount: string
}

interface TopBanks {
  by_amount: TopBankStats | null
  by_transactions: TopBankStats | null
}

interface SummaryData {
  current_month_stats: SummaryStats
  today_stats: TodayStats
  top_banks: TopBanks | null
  filter_applied: Record<string, any>
  user_info: UserInfo
}

interface BankReportData {
  bank_code: string
  bank_name: string
  bank_display: string
  total_charge_amount: number
  transaction_count: number
  formatted_amount: string
}

interface DetailReportData {
  rec_charge_ID: string
  bank_code: string
  bank_display: string
  insert_date: string
  update_date: string
  LCIC_code: string
  enterprise_name: string
  lon_purpose: string
  cusType: string
  chg_amount: number
  chg_unit: string
  status: string
  status_lao: string
  rec_reference_code: string
  rtp_code: string
  user_sys_id: string
  user_session_id: string
}

interface FilterOptions {
  month?: number
  year?: number
  fromDate?: string
  toDate?: string
  bank?: string
  status?: string
  limit?: number
}

interface RoleInfo {
  isAdmin: boolean
  gid: number
  bankId: string
  bankCode: string
}

export const useChargeReportApi = () => {
  const config = useRuntimeConfig()
  
  // Loading states
  const loadingSummary = ref(false)
  const loadingMain = ref(false)
  const loadingDetail = ref(false)
  const loadingLogin = ref(false)
  const loadingBankList = ref(false)
  
  // Data states
  const summaryData = ref<SummaryData | null>(null)
  const mainReportData = ref<BankReportData[]>([])
  const detailData = ref<DetailReportData[]>([])
  const bankList = ref<BankInfo[]>([])
  const userInfo = ref<UserInfo | null>(null)
  const error = ref<string | null>(null)
  
  // Computed properties
  const isAdmin = computed(() => userInfo.value?.is_admin || false)
  const currentMonthStats = computed(() => summaryData.value?.current_month_stats)
  const todayStats = computed(() => summaryData.value?.today_stats)
  const topBanks = computed(() => summaryData.value?.top_banks)
  
  // Helper: Get user data from localStorage
  const getUserData = (): UserData | null => {
    try {
      const userDataStr = localStorage.getItem('user_data')
      if (userDataStr) {
        return JSON.parse(userDataStr)
      }
    } catch (error) {
      console.error('Error parsing user_data from localStorage:', error)
    }
    return null
  }
  
  // Helper: Check if user is admin (GID 1-5)
  const isUserAdmin = (): boolean => {
    const userData = getUserData()
    if (userData && userData.GID) {
      const gid = userData.GID.GID
      return gid >= 1 && gid <= 5
    }
    return false
  }
  
  // Helper: Check if user is member (GID 6-7)
  const isUserMember = (): boolean => {
    const userData = getUserData()
    if (userData && userData.GID) {
      const gid = userData.GID.GID
      return gid >= 6 && gid <= 7
    }
    return false
  }
  
  // Helper: Get bank ID from localStorage
  const getBankIdFromStorage = (): string => {
    const userData = getUserData()
    return userData?.MID?.id || ''
  }
  
  // Helper: Get user role info
  const getUserRole = (): RoleInfo => {
    const userData = getUserData()
    return {
      isAdmin: isUserAdmin(),
      gid: userData?.GID?.GID || 0,
      bankId: userData?.MID?.id || '',
      bankCode: userData?.MID?.code || ''
    }
  }
  
  // Helper: Check if user has access to specific bank
  const checkUserAccess = (requestedBankId: string): boolean => {
    const roleInfo = getUserRole()
    
    // Admin (GID 1-5) can access any bank
    if (roleInfo.isAdmin) {
      return true
    }
    
    // Member (GID 6-7) can only access their own bank
    if (roleInfo.gid >= 6 && roleInfo.gid <= 7) {
      return requestedBankId === roleInfo.bankId
    }
    
    // Default: no access
    return false
  }
  
  // Notification helper
  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    console.log(`[${type.toUpperCase()}] ${message}`)
    // Integrate with your notification system
  }
  
  // Format date for API
  const formatDateForAPI = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }
  
  // Get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token')
    return {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    }
  }
  
  // Fetch Bank List
  const fetchBankList = async (): Promise<BankInfo[]> => {
    loadingBankList.value = true
    error.value = null
    
    try {
      const response = await $fetch<BankInfo[]>(
        `${config.public.strapi.url}api/memberinfo/`,
        {
          headers: getAuthHeaders()
        }
      )
      
      bankList.value = response.map((bank: any) => ({
        id: bank.id,
        code: bank.code || bank.bnk_code,
        bnk_code: bank.bnk_code,
        bnk_type: bank.bnk_type,
        nameL: bank.nameL,
        nameE: bank.nameE
      }))
      
      return bankList.value
    } catch (err: any) {
      const errorMessage = err.data?.error || 'ການໂຫຼດລາຍຊື່ທະນາຄານລົ້ມເຫຼວ'
      error.value = errorMessage
      showNotification(errorMessage, 'error')
      return []
    } finally {
      loadingBankList.value = false
    }
  }
  
  // Fetch Summary Statistics
  const fetchSummaryStats = async (filters: FilterOptions = {}): Promise<SummaryData | null> => {
    loadingSummary.value = true
    error.value = null
    
    try {
      // Determine bank ID based on user role
      let bankId = filters.bank
      
      if (!bankId) {
        const roleInfo = getUserRole()
        if (roleInfo.isAdmin) {
          // Admin without specified bank - can see all
          bankId = ''
        } else {
          // Member must use their own bank
          bankId = roleInfo.bankId
        }
      } else {
        // Bank ID provided - check access
        if (!checkUserAccess(bankId)) {
          throw new Error('ທ່ານບໍ່ມີສິດເຂົ້າເຖິງຂໍ້ມູນທະນາຄານນີ້')
        }
      }
      
      // Build query params
      const params = new URLSearchParams()
      if (filters.fromDate) params.append('fromDate', filters.fromDate)
      if (filters.toDate) params.append('toDate', filters.toDate)
      if (filters.month) params.append('month', String(filters.month))
      if (filters.year) params.append('year', String(filters.year))
      if (bankId && bankId !== 'all') params.append('bank', bankId)
      
      const response = await $fetch<any>(
        `${config.public.strapi.url}api/charge_report_summary/?${params.toString()}`,
        {
          headers: getAuthHeaders()
        }
      )
      
      if (response.status === 'success') {
        summaryData.value = response.data
        return response.data
      }
      
      throw new Error(response.message || 'Failed to fetch summary')
    } catch (err: any) {
      const errorMessage = err.data?.error || err.message || 'ການໂຫຼດຂໍ້ມູນສະຫຼຸບລົ້ມເຫຼວ'
      error.value = errorMessage
      showNotification(errorMessage, 'error')
      return null
    } finally {
      loadingSummary.value = false
    }
  }
  
  // Fetch Main Report (Bank Summary)
  const fetchMainReport = async (filters: FilterOptions = {}): Promise<BankReportData[]> => {
    loadingMain.value = true
    error.value = null
    
    try {
      // Determine bank ID based on user role
      let bankId = filters.bank
      
      if (!bankId) {
        const roleInfo = getUserRole()
        if (roleInfo.isAdmin) {
          // Admin without specified bank - can see all
          bankId = ''
        } else {
          // Member must use their own bank
          bankId = roleInfo.bankId
        }
      } else {
        // Bank ID provided - check access
        if (!checkUserAccess(bankId)) {
          throw new Error('ທ່ານບໍ່ມີສິດເຂົ້າເຖິງຂໍ້ມູນທະນາຄານນີ້')
        }
      }
      
      // Build query params
      const params = new URLSearchParams()
      if (filters.fromDate) params.append('fromDate', filters.fromDate)
      if (filters.toDate) params.append('toDate', filters.toDate)
      if (filters.month) params.append('month', String(filters.month))
      if (filters.year) params.append('year', String(filters.year))
      if (bankId && bankId !== 'all') params.append('bank', bankId)
      
      const response = await $fetch<any>(
        `${config.public.strapi.url}api/charge_report_main/?${params.toString()}`,
        {
          headers: getAuthHeaders()
        }
      )
      
      if (response.status === 'success') {
        mainReportData.value = response.data || []
        userInfo.value = response.user_info
        showNotification('ໂຫຼດຂໍ້ມູນສະຫຼຸບສຳເລັດແລ້ວ', 'success')
        return mainReportData.value
      }
      
      throw new Error(response.message || 'Failed to fetch main report')
    } catch (err: any) {
      const errorMessage = err.data?.error || err.message || 'ການໂຫຼດຂໍ້ມູນສະຫຼຸບລົ້ມເຫຼວ'
      error.value = errorMessage
      showNotification(errorMessage, 'error')
      return []
    } finally {
      loadingMain.value = false
    }
  }
  
  // Fetch Detail Report
  const fetchDetailReport = async (filters: FilterOptions = {}): Promise<DetailReportData[]> => {
    loadingDetail.value = true
    error.value = null
    
    try {
      // Determine bank ID based on user role
      let bankId = filters.bank
      
      if (!bankId) {
        const roleInfo = getUserRole()
        if (roleInfo.isAdmin) {
          // Admin without specified bank - can see all
          bankId = ''
        } else {
          // Member must use their own bank
          bankId = roleInfo.bankId
        }
      } else {
        // Bank ID provided - check access
        if (!checkUserAccess(bankId)) {
          throw new Error('ທ່ານບໍ່ມີສິດເຂົ້າເຖິງຂໍ້ມູນທະນາຄານນີ້')
        }
      }
      
      // Build query params
      const params = new URLSearchParams()
      if (filters.fromDate) params.append('fromDate', filters.fromDate)
      if (filters.toDate) params.append('toDate', filters.toDate)
      if (filters.month) params.append('month', String(filters.month))
      if (filters.year) params.append('year', String(filters.year))
      if (bankId && bankId !== 'all') params.append('bank', bankId)
      if (filters.status) params.append('status', filters.status)
      if (filters.limit) params.append('limit', String(filters.limit))
      
      const response = await $fetch<any>(
        `${config.public.strapi.url}api/charge_report_detail/?${params.toString()}`,
        {
          headers: getAuthHeaders()
        }
      )
      
      if (response.status === 'success') {
        detailData.value = response.data || []
        userInfo.value = response.user_info
        showNotification('ໂຫຼດລາຍລະອຽດສຳເລັດແລ້ວ', 'success')
        return detailData.value
      }
      
      throw new Error(response.message || 'Failed to fetch detail report')
    } catch (err: any) {
      const errorMessage = err.data?.error || err.message || 'ການໂຫຼດລາຍລະອຽດລົ້ມເຫຼວ'
      error.value = errorMessage
      showNotification(errorMessage, 'error')
      return []
    } finally {
      loadingDetail.value = false
    }
  }
  
  // Combined fetch for dashboard
  const fetchDashboardData = async (filters: FilterOptions = {}) => {
    // Fetch all data in parallel
    const promises = [
      fetchSummaryStats(filters),
      fetchMainReport(filters)
    ]
    
    // Add bank list if not already loaded and user is admin
    if (isUserAdmin() && bankList.value.length === 0) {
      promises.push(fetchBankList())
    }
    
    await Promise.all(promises)
  }
  
  // Login
  const login = async (username: string, password: string) => {
    loadingLogin.value = true
    error.value = null
    
    try {
      const response = await $fetch<any>(
        `${config.public.strapi.url}api/login/`,
        {
          method: 'POST',
          body: { username, password }
        }
      )
      
      // Store tokens and user data
      localStorage.setItem('access_token', response.access)
      localStorage.setItem('refresh_token', response.refresh)
      localStorage.setItem('user_info', JSON.stringify(response.user))
      localStorage.setItem('user_data', JSON.stringify(response.user))
      
      userInfo.value = response.user
      showNotification('ເຂົ້າສູ່ລະບົບສຳເລັດ', 'success')
      
      return response
    } catch (err: any) {
      const errorMessage = err.data?.error || 'ການເຂົ້າສູ່ລະບົບລົ້ມເຫຼວ'
      error.value = errorMessage
      showNotification(errorMessage, 'error')
      throw err
    } finally {
      loadingLogin.value = false
    }
  }
  
  // Logout
  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user_info')
    localStorage.removeItem('user_data')
    userInfo.value = null
    summaryData.value = null
    mainReportData.value = []
    detailData.value = []
    showNotification('ອອກຈາກລະບົບສຳເລັດ', 'info')
  }
  
  // Get current user
  const getCurrentUser = (): UserInfo | null => {
    const userStr = localStorage.getItem('user_info')
    if (userStr) {
      try {
        userInfo.value = JSON.parse(userStr)
        return userInfo.value
      } catch (e) {
        console.error('Failed to parse user info:', e)
        return null
      }
    }
    return null
  }
  
  // Check authentication
  const isAuthenticated = (): boolean => {
    return !!localStorage.getItem('access_token')
  }
  
  // Format number with commas
  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('lo-LA').format(num)
  }
  
  // Format currency
  const formatCurrency = (amount: number, currency: string = 'LAK'): string => {
    const formatted = formatNumber(amount)
    const currencySymbol = currency === 'LAK' ? '₭' : currency
    return `${formatted} ${currencySymbol}`
  }
  
  return {
    // States
    loadingSummary,
    loadingMain,
    loadingDetail,
    loadingLogin,
    loadingBankList,
    summaryData,
    mainReportData,
    detailData,
    bankList,
    userInfo,
    error,
    
    // Computed
    isAdmin,
    currentMonthStats,
    todayStats,
    topBanks,
    
    // Methods
    fetchSummaryStats,
    fetchMainReport,
    fetchDetailReport,
    fetchDashboardData,
    fetchBankList,
    login,
    logout,
    getCurrentUser,
    isAuthenticated,
    
    // Role-based access methods
    getUserRole,
    checkUserAccess,
    isUserAdmin,
    isUserMember,
    getBankIdFromStorage,
    getUserData,
    
    // Utilities
    formatNumber,
    formatCurrency,
    formatDateForAPI,
    showNotification
  }
}