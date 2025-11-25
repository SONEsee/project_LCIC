import { ref, readonly } from 'vue'

interface LcicSample {
  ind_sys_id: number
  name: string
  gender: string
  bnk_code: string
}

interface LcicGroup {
  lcic_id: string
  count: number
  bnk_codes: string[]
  sample: LcicSample[]
}

interface MergeSuggestion {
  suggested_master_lcic: string
  total_records: number
  different_lcic_count: number
  birth_date: string
  familybook: string
  prov_code: string
  name_variants: string[]
  lao_name_variants: string[]
  genders: string[]
  lcic_groups: LcicGroup[]
}

interface MergeResponse {
  query: Record<string, any>
  suggestions_found: number
  suggestions: MergeSuggestion[]
  total_matching_records: number
}

interface SearchParams {
  name?: string
  birth_date?: string
  familybook?: string
  prov_code?: string
  passport?: string
  bnk_code?: string
}

export const useLcicMerge = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBase || config.public.strapi?.url || ''
  
  const loading = ref(false)
  const error = ref<string | null>(null)
  const mergeData = ref<MergeResponse | null>(null)

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
      console.error('LCIC API Error:', error)
      throw error
    }
  }

  const searchMergeCandidates = async (params: SearchParams) => {
    loading.value = true
    error.value = null
    mergeData.value = null

    try {
      // Build query params
      const queryParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value && value.toString().trim()) {
          queryParams.append(key, value.toString().trim())
        }
      })

      if (!queryParams.toString()) {
        throw new Error('Please provide at least one search parameter')
      }

      const response = await fetchApi(`api/merges/suggest-merge?${queryParams}`, {
        method: 'GET'
      }) as MergeResponse

      mergeData.value = response
    } catch (err: any) {
      error.value = err?.data?.error || err?.message || 'Failed to fetch merge candidates'
      console.error('LCIC Merge Search Error:', err)
    } finally {
      loading.value = false
    }
  }

  const clearResults = () => {
    mergeData.value = null
    error.value = null
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    mergeData: readonly(mergeData),
    searchMergeCandidates,
    clearResults
  }
}