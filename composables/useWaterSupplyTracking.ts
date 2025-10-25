// composables/useWaterSupplyTracking.ts

import { ref, computed, type Ref } from 'vue'
import type { AxiosInstance, AxiosRequestConfig } from 'axios'
import axios from 'axios'

interface TrackingData {
  id: number
  pro_id: string
  pro_name: string
  dis_id: string
  dis_name: string
  upload_month: string
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'partial'
  total_records: number
  processed_records: number
  payment_records: number
  customer_records: number
  data_size_mb: number
  success_rates: number
  upload_duration: number | null
  user_upload: string | null
  error_message: string | null
  created_at: string
  updated_at: string
}

interface Statistics {
  totalUploads: number
  successfulUploads: number
  failedUploads: number
  pendingUploads: number
  totalRecords: number
  totalDataSize: number
  averageSuccessRate: number
}

interface DistrictStat {
  pro_id: string
  pro_name: string
  total_districts: number
  processed_districts: number
  districts: Array<{
    dis_id: string
    dis_name: string
    dis_code: string
    total_customers: number
    status: string
  }>
}

interface UploadSummary {
  // Define as needed
  [key: string]: any
}

interface BatchResult {
  successful: Array<{
    provinceCode: string
    districtCode: string
    response: any
  }>
  failed: Array<{
    provinceCode: string
    districtCode: string
    error: string
  }>
  total: number
}

interface ProgressCallback {
  current: number
  total: number
  percentage: number
  currentItem: { provinceCode: string; districtCode: string }
}

interface ApiResponse<T = any> {
  data?: T
  statistics?: any
  message?: string
  error?: string
}

export const useWaterSupplyTracking = () => {
  // Month names in Lao
  const getMonthName = (month: number): string => {
    const months = [
      'ມັງກອນ', 'ກຸມພາ', 'ມີນາ', 'ເມສາ', 'ພຶດສະພາ', 'ມິຖຸນາ',
      'ກໍລະກົດ', 'ສິງຫາ', 'ກັນຍາ', 'ຕຸລາ', 'ພະຈິກ', 'ທັນວາ',
    ]
    return months[month - 1] || ''
  }

  // Export period generator utility
  const generatePeriodOptions = (yearsBack: number = 2): Array<{ value: string; label: string }> => {
    const options: Array<{ value: string; label: string }> = []
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth() + 1

    for (let year = currentYear; year >= currentYear - yearsBack; year--) {
      for (let month = 12; month >= 1; month--) {
        if (year === currentYear && month > currentMonth) continue

        const value = month.toString().padStart(2, '0') + year
        const label = `${getMonthName(month)} ${year}`
        options.push({ value, label })
      }
    }

    return options
  }

  // Format period display
  const formatPeriod = (period: string | null): string => {
    if (!period) return ''
    const month = parseInt(period.substring(0, 2))
    const year = period.substring(2)
    return `${getMonthName(month)} ${year}`
  }

  // Number formatter
  const formatNumber = (num: number | null | undefined): string => {
    if (!num) return '0'
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  // Status text mapper
  const getStatusText = (status: string): string => {
    const statusMap: Record<string, string> = {
      pending: 'ລໍຖ້າ',
      processing: 'ກຳລັງດຳເນີນການ',
      completed: 'ສຳເລັດ',
      failed: 'ລົ້ມເຫຼວ',
      partial: 'ບາງສ່ວນ',
    }
    return statusMap[status] || 'ບໍ່ຮູ້'
  }

  // Runtime config
  const config = useRuntimeConfig()
  const API_BASE_URL = `${config.public.apiBase}/api/water`
  const token: Ref<string | null> = useCookie('access_token')

  // Axios instance
  const api: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 60000,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  // Request interceptor for auth
  api.interceptors.request.use((request: AxiosRequestConfig) => {
    if (token.value) {
      request.headers = request.headers || {}
      request.headers.Authorization = `Bearer ${token.value}`
    }
    return request
  })

  // State
  const loading: Ref<boolean> = ref(false)
  const error: Ref<string | null> = ref(null)
  const trackingData: Ref<TrackingData[]> = ref([])
  const statistics: Ref<any> = ref({})
  const districtStatistics: Ref<DistrictStat[]> = ref([])
  const uploadSummary: Ref<UploadSummary[]> = ref([])

  // Helper function for API calls with error handling
  const apiCall = async <T = any>(endpoint: string, options: AxiosRequestConfig = {}): Promise<ApiResponse<T>> => {
    try {
      loading.value = true
      error.value = null
      const response = await api<T>(`${endpoint}`, options)
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.error || err.message || 'An error occurred'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Initialize tracking for a specific month
  const initializeTracking = async (month: string, username: string = 'system'): Promise<ApiResponse<{ tracking_id: number }>> => {
    return await apiCall('/initialize/', {
      method: 'POST',
      data: { month, username },
    } as AxiosRequestConfig)
  }

  // Upload water supply data for a specific district
  const uploadWaterData = async (month: string, provinceCode: string, districtCode: string, username: string = 'system'): Promise<ApiResponse<any>> => {
    return await apiCall('/upload/', {
      method: 'POST',
      data: {
        month,
        province_code: provinceCode,
        district_code: districtCode,
        username,
      },
    } as AxiosRequestConfig)
  }

  // Get tracking list for a specific month
  const getTrackingList = async (month: string): Promise<ApiResponse<{ data: TrackingData[]; statistics: any }>> => {
    const response = await apiCall<{ data: TrackingData[]; statistics: any }>('/tracking/', {
      params: { month },
    })
    trackingData.value = response.data || []
    statistics.value = response.statistics || {}
    return response
  }

  // Get detailed tracking information
  const getTrackingDetail = async (trackingId: number): Promise<ApiResponse<TrackingData>> => {
    return await apiCall(`/tracking/${trackingId}/`)
  }

  // Get district statistics grouped by province
  const getDistrictStatistics = async (month: string): Promise<ApiResponse<{ provinces: DistrictStat[] }>> => {
    const response = await apiCall<{ provinces: DistrictStat[] }>('/statistics/districts/', {
      params: { month },
    })
    districtStatistics.value = response.provinces || []
    return response
  }

  // Get upload summary for all periods
  const getUploadSummary = async (): Promise<ApiResponse<{ data: UploadSummary[] }>> => {
    const response = await apiCall<{ data: UploadSummary[] }>('/statistics/summary/')
    uploadSummary.value = response.data || []
    return response
  }

  // Batch upload for multiple districts
  const batchUpload = async (
    districts: Array<{ provinceCode: string; districtCode: string }>,
    month: string,
    username: string,
    onProgress?: (progress: ProgressCallback) => void
  ): Promise<BatchResult> => {
    const results: BatchResult = {
      successful: [],
      failed: [],
      total: districts.length,
    }

    for (let i = 0; i < districts.length; i++) {
      const district = districts[i]

      try {
        // Update progress callback
        if (onProgress) {
          onProgress({
            current: i + 1,
            total: results.total,
            percentage: Math.round(((i + 1) / results.total) * 100),
            currentItem: district,
          })
        }

        // Upload district data
        const response = await uploadWaterData(month, district.provinceCode, district.districtCode, username)

        results.successful.push({
          ...district,
          response,
        })

        // Add small delay between requests to avoid overwhelming the server
        await new Promise((resolve) => setTimeout(resolve, 200))

      } catch (err: any) {
        results.failed.push({
          ...district,
          error: err.message,
        })
      }
    }

    return results
  }

  // Calculate upload statistics
  const calculateStatistics = computed((): Statistics => {
    const stats: Statistics = {
      totalUploads: trackingData.value.length,
      successfulUploads: 0,
      failedUploads: 0,
      pendingUploads: 0,
      totalRecords: 0,
      totalDataSize: 0,
      averageSuccessRate: 0,
    }

    trackingData.value.forEach((item) => {
      if (item.status === 'completed') stats.successfulUploads++
      else if (item.status === 'failed') stats.failedUploads++
      else if (item.status === 'pending') stats.pendingUploads++

      stats.totalRecords += item.total_records || 0
      stats.totalDataSize += item.data_size_mb || 0
      stats.averageSuccessRate += item.success_rates || 0
    })

    if (stats.totalUploads > 0) {
      stats.averageSuccessRate = stats.averageSuccessRate / stats.totalUploads
    }

    return stats
  })

  // Format file size for display
  const formatFileSize = (sizeMB: number): string => {
    if (!sizeMB || sizeMB < 1) {
      return `${(sizeMB || 0) * 1024} KB`
    } else if (sizeMB < 1024) {
      return `${sizeMB.toFixed(1)} MB`
    } else {
      return `${(sizeMB / 1024).toFixed(1)} GB`
    }
  }

  // Format duration for display
  const formatDuration = (seconds: number | null): string | null => {
    if (!seconds) return null

    if (seconds < 60) {
      return `${Math.round(seconds)}s`
    } else if (seconds < 3600) {
      return `${(seconds / 60).toFixed(1)}m`
    } else {
      return `${(seconds / 3600).toFixed(1)}h`
    }
  }

  // Check if upload is allowed for a district
  const canUploadDistrict = (district: { status: string }): boolean => {
    return district.status !== 'completed' && district.status !== 'processing'
  }

  // Get status color class
  const getStatusClass = (status: string): string => {
    const statusClasses: Record<string, string> = {
      pending: 'status-pending',
      processing: 'status-processing',
      completed: 'status-completed',
      failed: 'status-failed',
      partial: 'status-partial',
    }
    return statusClasses[status] || 'status-pending'
  }

  // Reset all state
  const resetState = (): void => {
    loading.value = false
    error.value = null
    trackingData.value = []
    statistics.value = {}
    districtStatistics.value = []
    uploadSummary.value = []
  }

  return {
    // State
    loading,
    error,
    trackingData,
    statistics,
    districtStatistics,
    uploadSummary,

    // API methods
    initializeTracking,
    uploadWaterData,
    getTrackingList,
    getTrackingDetail,
    getDistrictStatistics,
    getUploadSummary,
    batchUpload,

    // Computed
    calculateStatistics,

    // Utilities
    formatFileSize,
    formatDuration,
    canUploadDistrict,
    getStatusClass,
    resetState,
    generatePeriodOptions,
    formatPeriod,
    formatNumber,
    getStatusText,
    getMonthName,
  }
}

// Validation utilities
export const validateMonth = (month: string): boolean => {
  // Check format MMYYYY
  const regex = /^(0[1-9]|1[0-2])\d{4}$/
  return regex.test(month)
}

export const validateUsername = (username: string): boolean => {
  // Username should be at least 3 characters
  return username && username.trim().length >= 3
}