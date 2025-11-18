// composables/useCustomerUnmerge.ts
import { ref } from 'vue'

interface Customer {
  ind_sys_id: number
  display_name: string
  customerid: string
  bnk_code: string
  ind_national_id: string
  ind_birth_date: string
  is_master: boolean
  mm_status: string
  selected?: boolean
}

interface CustomerGroup {
  lcic_id: string
  count: number
  customers: Customer[]
}

interface ListResponse {
  total: number
  page: number
  page_size: number
  total_pages: number
  results: CustomerGroup[]
}

interface UnmergeRequest {
  unmerge_list: Array<{
    lcic_id: string
    ind_sys_ids: number[]
  }>
}

export const useCustomerUnmerge = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBase || 'http://192.168.45.55:8000/api'

  const loading = ref(false)
  const error = ref<string | null>(null)

  // Helper function for API calls with error handling
  const fetchApi = async (endpoint: string, options: any = {}) => {
    try {
      const token = useCookie('access_token')
      
      if (!token.value) {
        throw new Error('Authentication required')
      }

      const response = await $fetch(`${baseURL}${endpoint}`, {
        ...options,
        headers: {
          'Authorization': `Bearer ${token.value}`,
          'Content-Type': 'application/json',
          ...options.headers,
        },
      })
      
      return response
    } catch (err: any) {
      console.error('API Error:', err)
      
      // Handle specific error cases
      if (err.status === 401) {
        throw new Error('Session expired. Please login again.')
      } else if (err.status === 403) {
        throw new Error('You do not have permission to perform this action.')
      } else if (err.status === 500) {
        throw new Error('Server error. Please try again later.')
      }
      
      throw err
    }
  }

  // Fetch grouped customers
  const fetchGroupedCustomers = async (page: number = 1, pageSize: number = 50): Promise<ListResponse> => {
    loading.value = true
    error.value = null

    try {
      const response = await fetchApi(
        `/api/customer-unmerge/list_grouped/?page=${page}&page_size=${pageSize}`,
        { method: 'GET' }
      )
      
      return response as ListResponse
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch customers'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Unmerge selected customers
  const unmergeCustomers = async (unmergeData: UnmergeRequest) => {
    loading.value = true
    error.value = null

    try {
      // Validate input
      if (!unmergeData.unmerge_list || unmergeData.unmerge_list.length === 0) {
        throw new Error('No customers selected for unmerge')
      }

      const response = await fetchApi('/api/customer-unmerge/unmerge/', {
        method: 'POST',
        body: JSON.stringify(unmergeData),
      })
      
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to unmerge customers'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    fetchGroupedCustomers,
    unmergeCustomers,
  }
}