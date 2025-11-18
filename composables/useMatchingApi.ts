// composables/useMatchingApi.ts
export const useMatchingApi = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBase || config.public.strapi.url

  // Helper function for API calls with error handling
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
      console.error('API Error:', error)
      throw error
    }
  }

  return {
    // Statistics
    getStatistics: async () => {
      return await fetchApi('/api/statistics/')
    },

    // Find matching candidates (POST)
    findMatchingCandidates: async (params: {
      limit?: number
      min_score?: number
      save?: boolean
    }) => {
      return await fetchApi('/api/find-candidates/', {
        method: 'POST',
        body: params,
      })
    },

    // List matching candidates (GET)
    listMatchingCandidates: async (params: {
      status?: string
      min_score?: number
      max_score?: number
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
      
      return await fetchApi(`/api/candidates/${queryString ? '?' + queryString : ''}`)
    },

    // Review candidate (approve or reject)
    reviewCandidate: async (data: {
      candidate_id: number
      action: 'approve' | 'reject'
      notes?: string
      merge_reason?: string
    }) => {
      return await fetchApi('/api/review/', {
        method: 'POST',
        body: data,
      })
    },

    // List merged customers
    listMergedCustomers: async (params: {
      search?: string
      has_multiple_ids?: boolean
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
      
      return await fetchApi(`/api/merged-customers/${queryString ? '?' + queryString : ''}`)
    },

    // Get customer details
    getCustomerDetails: async (lcicId: string) => {
      return await fetchApi(`/customer/${lcicId}/`)
    },

    // List approved matches
    listApprovedMatches: async (params: {
      reviewed_by?: string
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
      
      return await fetchApi(`/api/approved-matches/${queryString ? '?' + queryString : ''}`)
    },

    // Manual merge
    manualMerge: async (data: {
      ind_sys_ids: number[]
      master_record_id?: number
      reason: string
    }) => {
      return await fetchApi('/api/merge/', {
        method: 'POST',
        body: data,
      })
    },

    // Unmerge customer
    unmergeCustomer: async (data: {
      ind_sys_id: number
      reason: string
    }) => {
      return await fetchApi('/api/unmerge/', {
        method: 'POST',
        body: data,
      })
    },
  }
}