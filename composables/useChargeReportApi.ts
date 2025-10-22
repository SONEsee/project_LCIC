// composables/useChargeReportApi.ts
import { ref } from 'vue'
import axios from 'axios'

export const useChargeReportApi = () => {
  const config = useRuntimeConfig()
  
  // Loading states
  const loadingSummary = ref(false)
  const loadingDetail = ref(false)
  const loadingLogin = ref(false)
  
  // Data states
  const summaryData = ref<any>(null)
  const detailData = ref<any[]>([])
  const userInfo = ref<any>(null)

  // Notification helper (optional - customize based on your notification system)
  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    // You can integrate with your existing notification system
    console.log(`[${type.toUpperCase()}] ${message}`)
  }

  // Fetch Summary Report
  const fetchSummaryReport = async (filters: {
    year?: string
    month?: string
    bank?: string
    fromDate?: string
    toDate?: string
  }) => {
    loadingSummary.value = true
    try {
      const response = await axios.get(
        `${config.public.strapi.url}api/charge_report_main/`,
        {
          params: filters,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
          }
        }
      )
      
      summaryData.value = response.data
      showNotification('ໂຫຼດຂໍ້ມູນສະຫຼຸບສຳເລັດແລ້ວ', 'success')
      return response.data
    } catch (error: any) {
      console.error('Error fetching summary report:', error)
      showNotification(
        error.response?.data?.error || 'ການໂຫຼດຂໍ້ມູນສະຫຼຸບລົ້ມເຫຼວ',
        'error'
      )
      throw error
    } finally {
      loadingSummary.value = false
    }
  }

  // Fetch Detail Report
  const fetchDetailReport = async (filters: {
    year?: string
    month?: string
    bank?: string
    fromDate?: string
    toDate?: string
    status?: string
    limit?: number
  }) => {
    loadingDetail.value = true
    try {
      const response = await axios.get(
        `${config.public.strapi.url}api/charge_report_detail/`,
        {
          params: filters,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
          }
        }
      )
      
      detailData.value = response.data.data || []
      showNotification('ໂຫຼດລາຍລະອຽດສຳເລັດແລ້ວ', 'success')
      return response.data
    } catch (error: any) {
      console.error('Error fetching detail report:', error)
      showNotification(
        error.response?.data?.error || 'ການໂຫຼດລາຍລະອຽດລົ້ມເຫຼວ',
        'error'
      )
      throw error
    } finally {
      loadingDetail.value = false
    }
  }

  // Login
  const login = async (username: string, password: string) => {
    loadingLogin.value = true
    try {
      const response = await axios.post(
        `${config.public.strapi.url}api/login/`,
        { username, password }
      )
      
      const data = response.data
      
      // Store tokens
      localStorage.setItem('access_token', data.access)
      localStorage.setItem('refresh_token', data.refresh)
      localStorage.setItem('user_info', JSON.stringify(data.user))
      
      userInfo.value = data.user
      showNotification('ເຂົ້າສູ່ລະບົບສຳເລັດ', 'success')
      
      return data
    } catch (error: any) {
      console.error('Error logging in:', error)
      showNotification(
        error.response?.data?.error || 'ການເຂົ້າສູ່ລະບົບລົ້ມເຫຼວ',
        'error'
      )
      throw error
    } finally {
      loadingLogin.value = false
    }
  }

  // Logout
  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user_info')
    userInfo.value = null
    summaryData.value = null
    detailData.value = []
    showNotification('ອອກຈາກລະບົບສຳເລັດ', 'info')
  }

  // Get current user info from localStorage
  const getCurrentUser = () => {
    const userStr = localStorage.getItem('user_info')
    if (userStr) {
      userInfo.value = JSON.parse(userStr)
      return userInfo.value
    }
    return null
  }

  return {
    // Loading states
    loadingSummary,
    loadingDetail,
    loadingLogin,
    
    // Data states
    summaryData,
    detailData,
    userInfo,
    
    // Methods
    fetchSummaryReport,
    fetchDetailReport,
    login,
    logout,
    getCurrentUser
  }
}

