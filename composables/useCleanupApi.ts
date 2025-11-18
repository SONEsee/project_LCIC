// composables/useCleanupApi.ts - FIXED VERSION
// Forces cache bypass after merge operations
export const useCleanupApi = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBase || 'http://192.168.45.55:8000/api/matching'

  // Helper function for API calls
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
      console.error('Cleanup API Error:', error)
      throw error
    }
  }

  return {
    // List duplicate records with advanced filtering
    listDuplicateInfoRecords: async (params: {
      search?: string
      min_similarity?: number
      birth_date?: string
      name_starts_with?: string
      page?: number
      page_size?: number
      use_cache?: boolean
      force_refresh?: boolean  // NEW: Force bypass cache
    } = {}) => {
      const queryString = new URLSearchParams(
        Object.entries(params).reduce((acc, [key, value]) => {
          if (value !== undefined && value !== null) {
            acc[key] = String(value)
          }
          return acc
        }, {} as Record<string, string>)
      ).toString()
      
      return await fetchApi(`api/cleanup/duplicates/${queryString ? '?' + queryString : ''}`)
    },

    // Merge multiple info records
    mergeInfoRecords: async (data: {
      ind_sys_ids: number[]
      master_ind_sys_id?: number
      reason: string
    }) => {
      return await fetchApi('/api/cleanup/merge/', {
        method: 'POST',
        body: data,
      })
    },

    // Get cleanup statistics
    getCleanupStatistics: async (forceRefresh: boolean = false) => {
      const query = forceRefresh ? '?force_refresh=true' : ''
      return await fetchApi(`api/cleanup/statistics/${query}`)
    },

    // Clear cache (admin function)
    clearCache: async () => {
      return await fetchApi('api/cleanup/clear-cache/', {
        method: 'POST',
      })
    },

    // Helper: Get birth years for filtering
    getBirthYears: () => {
      const currentYear = new Date().getFullYear()
      const years = []
      for (let year = currentYear - 18; year >= currentYear - 80; year--) {
        years.push(year)
      }
      return years
    },

    // Helper: Get alphabet for name filtering
    getAlphabet: () => {
      return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
    },
  }
}