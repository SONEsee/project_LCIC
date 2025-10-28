// composables/useWaterSupplyApi.ts

export const useWaterSupplyApi = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBase || 'http://localhost:8000/api'

  // Get auth token from wherever you store it
  const token = useCookie('access_token')

  const headers = {
    'Authorization': `Bearer ${token.value}`,
    'Content-Type': 'application/json'
  }

  /**
   * Initialize tracking for a month
   */
  const initializeTracking = async (data: {
    upload_month: string
    pro_id?: string
    dis_id?: string
    user_upload?: string
  }) => {
    try {
      const response = await $fetch(`${baseURL}/water-supply/initialize/`, {
        method: 'POST',
        headers,
        body: data
      })
      return { success: true, data: response }
    } catch (error: any) {
      return { 
        success: false, 
        error: error.data?.error || error.message || 'Failed to initialize tracking'
      }
    }
  }

  /**
   * Upload water supply data for a month
   */
  const uploadWaterData = async (data: {
    upload_month: string
    pro_id?: string
    dis_id?: string
    user_upload?: string
    force_reupload?: boolean
  }) => {
    try {
      const response = await $fetch(`${baseURL}/water-supply/upload/`, {
        method: 'POST',
        headers,
        body: data
      })
      return { success: true, data: response }
    } catch (error: any) {
      return { 
        success: false, 
        error: error.data?.error || error.message || 'Failed to upload data'
      }
    }
  }

  /**
   * Get list of tracking records
   */
  const getTrackingList = async (params?: {
    upload_month?: string
    status?: string
    pro_id?: string
    dis_id?: string
  }) => {
    try {
      const queryString = params ? '?' + new URLSearchParams(params as any).toString() : ''
      const response = await $fetch(`${baseURL}/water-supply/tracking/${queryString}`, {
        method: 'GET',
        headers
      })
      return { success: true, data: response }
    } catch (error: any) {
      return { 
        success: false, 
        error: error.message || 'Failed to fetch tracking list'
      }
    }
  }

  /**
   * Get detailed tracking information
   */
  const getTrackingDetail = async (trackingId: number) => {
    try {
      const response = await $fetch(`${baseURL}/water-supply/tracking/${trackingId}/`, {
        method: 'GET',
        headers
      })
      return { success: true, data: response }
    } catch (error: any) {
      return { 
        success: false, 
        error: error.message || 'Failed to fetch tracking detail'
      }
    }
  }

  /**
   * Get district statistics
   */
  const getDistrictStatistics = async (params?: {
    upload_month?: string
    pro_id?: string
  }) => {
    try {
      const queryString = params ? '?' + new URLSearchParams(params as any).toString() : ''
      const response = await $fetch(`${baseURL}/water-supply/statistics/districts/${queryString}`, {
        method: 'GET',
        headers
      })
      return { success: true, data: response }
    } catch (error: any) {
      return { 
        success: false, 
        error: error.message || 'Failed to fetch district statistics'
      }
    }
  }

  /**
   * Get upload summary
   */
  const getUploadSummary = async (params?: {
    start_month?: string
    end_month?: string
  }) => {
    try {
      const queryString = params ? '?' + new URLSearchParams(params as any).toString() : ''
      const response = await $fetch(`${baseURL}/water-supply/statistics/summary/${queryString}`, {
        method: 'GET',
        headers
      })
      return { success: true, data: response }
    } catch (error: any) {
      return { 
        success: false, 
        error: error.message || 'Failed to fetch upload summary'
      }
    }
  }

  return {
    initializeTracking,
    uploadWaterData,
    getTrackingList,
    getTrackingDetail,
    getDistrictStatistics,
    getUploadSummary
  }
}