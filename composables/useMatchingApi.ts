// composables/useMatchingApi.ts
export const useMatchingApi = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBase || 'http://192.168.45.56:8000/api'

  // Helper function for API calls
  const fetchApi = async (endpoint: string, options: any = {}) => {
    const token = useCookie('access_token')
    
    return await $fetch(`${baseURL}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': token.value ? `Bearer ${token.value}` : '',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })
  }

  return {
    // Get statistics
    getStatistics: async () => {
      return await fetchApi('/api/matching/statistics/')
    },

    // Get unmatched records
    getUnmatched: async (page: number = 1, pageSize: number = 20) => {
      return await fetchApi(`/api/matching/unmatched/?page=${page}&page_size=${pageSize}`)
    },

    // Get match candidates for a record
    getCandidates: async (recordId: number, minScore: number = 80, type: string = 'fuzzy') => {
      return await fetchApi(
        `/api/matching/${recordId}/candidates/?min_score=${minScore}&type=${type}`
      )
    },

    // Get match groups
    getMatchGroups: async (page: number = 1, pageSize: number = 10, minScore: number = 80) => {
      return await fetchApi(
        `/api/matching/match_groups/?page=${page}&page_size=${pageSize}&min_score=${minScore}`
      )
    },

    // Confirm match
    confirmMatch: async (data: {
      primary_id: number
      matched_ids: number[]
      comment?: string
      lcic_id?: string
    }) => {
      return await fetchApi('/api/matching/confirm_match/', {
        method: 'POST',
        body: data,
      })
    },

    // Reject match
    rejectMatch: async (data: {
      primary_id: number
      rejected_ids: number[]
      reason: string
    }) => {
      return await fetchApi('/api/matching/reject_match/', {
        method: 'POST',
        body: data,
      })
    },

    // Get single record
    getRecord: async (recordId: number) => {
      return await fetchApi(`/api/records/${recordId}/`)
    },

    // Search records
    searchRecords: async (params: any = {}) => {
      const queryString = new URLSearchParams(params).toString()
      return await fetchApi(`/api/records/?${queryString}`)
    },
  }
}