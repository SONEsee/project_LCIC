// composables/useCustomerMergeApi.ts - UPDATED
export const useCustomerMergeApi = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBase || 'http://192.168.45.55:8000/api/matching'

  const fetchApi = async (endpoint: string, options: any = {}) => {
    try {
      const token = useCookie('access_token')
      
      const response = await $fetch(`${baseURL}${endpoint}`, {
        ...options,
        headers: {
          'Authorization': token.value ? `Bearer ${token.value}` : '',
          'Content-Type': 'application/json',
          ...options.headers,
        },
      })
      
      return response
    } catch (error: any) {
      console.error('Customer Merge API Error:', error)
      throw error
    }
  }

  return {
    // NEW: List all merged customers with optional filters
    listMergedCustomers: async (params: {
      search?: string
      performed_by?: string
      date_from?: string
      date_to?: string
      has_multiple_ids?: boolean
      identifier_type?: 'NATIONAL_ID' | 'PASSPORT' | 'FAMILY_BOOK'
      sort_by?: 'name' | 'lcic_id' | 'merge_date' | 'identifier_count'
      sort_order?: 'asc' | 'desc'
      page?: number
      page_size?: number
    } = {}) => {
      const queryString = new URLSearchParams(
        Object.entries(params).reduce((acc, [key, value]) => {
          if (value !== undefined && value !== null) {
            acc[key] = String(value)
          }
          return acc
        }, {} as Record<string, string>)
      ).toString()
      
      return await fetchApi(`api/customers/merged/${queryString ? '?' + queryString : ''}`)
    },

    // NEW: Get merge statistics
    getMergeStatistics: async () => {
      return await fetchApi('api/customers/merged/statistics/')
    },

    // Get detailed merge information for a specific customer
    getCustomerMergeInfo: async (lcicId: string) => {
      return await fetchApi(`api/customer/${lcicId}/merge-info/`)
    },

    // Search customers by LCIC ID, name, or identifier
    searchCustomers: async (params: {
      q: string
      merged_only?: boolean
      page?: number
      page_size?: number
    }) => {
      const queryString = new URLSearchParams(
        Object.entries(params).reduce((acc, [key, value]) => {
          if (value !== undefined && value !== null) {
            acc[key] = String(value)
          }
          return acc
        }, {} as Record<string, string>)
      ).toString()
      
      return await fetchApi(`api/customers/search/?${queryString}`)
    },

    // List all merge operations
    listAllMerges: async (params: {
      performed_by?: string
      date_from?: string
      date_to?: string
      page?: number
      page_size?: number
    } = {}) => {
      const queryString = new URLSearchParams(
        Object.entries(params).reduce((acc, [key, value]) => {
          if (value !== undefined && value !== null) {
            acc[key] = String(value)
          }
          return acc
        }, {} as Record<string, string>)
      ).toString()
      
      return await fetchApi(`api/merges/history/${queryString ? '?' + queryString : ''}`)
    },
  }
}