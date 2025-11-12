// composables/useCustomerMatching.ts
import type { Ref } from 'vue'

export interface MatchDetails {
  national_id?: number
  passport?: number
  family_book?: number
  birth_date?: number
  name?: number
  lao_name?: number
}

export interface CustomerRecord {
  ind_sys_id: number
  lcic_id?: string
  ind_name?: string
  ind_surname?: string
  ind_lao_name?: string
  ind_lao_surname?: string
  ind_national_id?: string
  ind_passport?: string
  ind_familybook?: string
  ind_birth_date?: string
  bnk_code?: string
}

export interface Candidate {
  id: number
  similarity_score: number
  match_details: MatchDetails
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'AUTO_MATCHED'
  created_at?: string
  reviewed_by?: string
  reviewed_at?: string
  source: CustomerRecord
  target: CustomerRecord
}

export interface Statistics {
  total_bank_records: number
  normalized_records: number
  matching_candidates: {
    total: number
    pending: number
    approved: number
    rejected: number
    avg_score: number
  }
  merge_operations: {
    total_merges: number
    total_unmerges: number
  }
}

export interface FindMatchesParams {
  min_score: number
  limit: number
  save_to_db: boolean
}

export interface ReviewParams {
  candidate_id: number
  action: 'approve' | 'reject'
  notes?: string
}

export interface MergeParams {
  source_ids: number[]
  master_record_id?: number
  reason?: string
}

export function useCustomerMatching() {
  const runtimeConfig = useRuntimeConfig()
  const apiBase = `${runtimeConfig.public.apiBase}/api`

  // State
  const statistics: Ref<Statistics | null> = ref(null)
  const candidates: Ref<Candidate[]> = ref([])
  const currentPage: Ref<number> = ref(1)
  const totalPages: Ref<number> = ref(1)
  const totalCount: Ref<number> = ref(0)
  const pageSize: Ref<number> = ref(20)
  
  // UI State
  const loading: Ref<boolean> = ref(false)
  const submitting: Ref<boolean> = ref(false)
  const findingMatches: Ref<boolean> = ref(false)
  
  // Message state (replaces toast)
  const message: Ref<{ type: 'success' | 'error' | 'info'; text: string } | null> = ref(null)
  
  // Filters
  const statusFilter: Ref<'PENDING' | 'APPROVED' | 'REJECTED'> = ref('PENDING')
  const minScoreFilter: Ref<number> = ref(60)

  // Get auth token
  const getToken = (): string | null => {
    if (process.client) {
      return localStorage.getItem('access_token')
    }
    return null
  }

  /**
   * Show message (replaces toast)
   */
  const showMessage = (type: 'success' | 'error' | 'info', text: string) => {
    message.value = { type, text }
    console.log(`[${type.toUpperCase()}]`, text)
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      message.value = null
    }, 5000)
  }

  /**
   * Fetch wrapper with auth
   */
  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const token = getToken()
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${apiBase}${url}`, {
      ...options,
      headers,
    })

    // Handle auth errors
    if (response.status === 401) {
      showMessage('error', 'Session expired. Please login again.')
      if (process.client) {
        localStorage.removeItem('access_token')
        window.location.href = '/login'
      }
      throw new Error('Unauthorized')
    }

    if (response.status === 403) {
      showMessage('error', 'Access denied. Insufficient permissions.')
      throw new Error('Forbidden')
    }

    if (!response.ok && response.status >= 500) {
      showMessage('error', 'Server error. Please try again later.')
      throw new Error('Server Error')
    }

    return response
  }

  /**
   * Load statistics from API
   */
  const loadStatistics = async (): Promise<void> => {
    try {
      const response = await fetchWithAuth('/statistics/')
      const data = await response.json()
      
      if (data.success) {
        statistics.value = data.statistics
      } else {
        showMessage('error', 'Failed to load statistics')
      }
    } catch (error) {
      console.error('Error loading statistics:', error)
      showMessage('error', 'Error loading statistics')
    }
  }

  /**
   * Load matching candidates with pagination
   */
  const loadCandidates = async (page: number = 1): Promise<void> => {
    loading.value = true
    currentPage.value = page

    try {
      const params = new URLSearchParams({
        status: statusFilter.value,
        page: page.toString(),
        page_size: pageSize.value.toString(),
        min_score: minScoreFilter.value.toString(),
      })

      const response = await fetchWithAuth(`/candidates/?${params}`)
      const data = await response.json()

      if (data.success) {
        candidates.value = data.candidates
        totalPages.value = data.total_pages
        totalCount.value = data.total_count
      } else {
        candidates.value = []
        showMessage('error', data.error || 'Failed to load candidates')
      }
    } catch (error) {
      console.error('Error loading candidates:', error)
      candidates.value = []
      showMessage('error', 'Error loading candidates')
    } finally {
      loading.value = false
    }
  }

  /**
   * Find new matching candidates
   */
  const findNewMatches = async (params: FindMatchesParams): Promise<void> => {
    findingMatches.value = true

    try {
      const response = await fetchWithAuth('/find-candidates/', {
        method: 'POST',
        body: JSON.stringify(params),
      })

      const data = await response.json()

      if (data.success) {
        showMessage(
          'success',
          `Found ${data.total_found} matches. Saved ${data.saved_to_db} to database.`
        )
        // Reload candidates and statistics
        await Promise.all([
          loadCandidates(1),
          loadStatistics(),
        ])
      } else {
        showMessage('error', data.error || 'Failed to find matches')
      }
    } catch (error: any) {
      console.error('Error finding matches:', error)
      showMessage('error', 'Error finding matches')
    } finally {
      findingMatches.value = false
    }
  }

  /**
   * Review a candidate (approve or reject)
   */
  const reviewCandidate = async (params: ReviewParams): Promise<void> => {
    submitting.value = true

    try {
      const response = await fetchWithAuth('/review/', {
        method: 'POST',
        body: JSON.stringify(params),
      })

      const data = await response.json()

      if (data.success) {
        const action = params.action === 'approve' ? 'approved' : 'rejected'
        showMessage('success', `Match ${action} successfully`)
        
        // Reload current page and statistics
        await Promise.all([
          loadCandidates(currentPage.value),
          loadStatistics(),
        ])
      } else {
        showMessage('error', data.error || 'Failed to review candidate')
      }
    } catch (error: any) {
      console.error('Error reviewing candidate:', error)
      showMessage('error', 'Error reviewing candidate')
    } finally {
      submitting.value = false
    }
  }

  /**
   * Manually merge customers
   */
  const mergeCustomers = async (params: MergeParams): Promise<void> => {
    submitting.value = true

    try {
      const response = await fetchWithAuth('/merge/', {
        method: 'POST',
        body: JSON.stringify(params),
      })

      const data = await response.json()

      if (data.success) {
        showMessage('success', `Merged ${data.result.merged_count} customers successfully`)
        
        // Reload data
        await Promise.all([
          loadCandidates(currentPage.value),
          loadStatistics(),
        ])
      } else {
        showMessage('error', data.error || 'Failed to merge customers')
      }
    } catch (error: any) {
      console.error('Error merging customers:', error)
      showMessage('error', 'Error merging customers')
    } finally {
      submitting.value = false
    }
  }

  /**
   * Change filter and reload
   */
  const changeFilter = async (
    status?: 'PENDING' | 'APPROVED' | 'REJECTED',
    minScore?: number
  ): Promise<void> => {
    if (status !== undefined) {
      statusFilter.value = status
    }
    if (minScore !== undefined) {
      minScoreFilter.value = minScore
    }
    await loadCandidates(1)
  }

  /**
   * Go to specific page
   */
  const goToPage = async (page: number): Promise<void> => {
    if (page >= 1 && page <= totalPages.value) {
      await loadCandidates(page)
    }
  }

  /**
   * Clear message
   */
  const clearMessage = () => {
    message.value = null
  }

  /**
   * Initialize - load initial data
   */
  const initialize = async (): Promise<void> => {
    await Promise.all([
      loadStatistics(),
      loadCandidates(1),
    ])
  }

  /**
   * Get score color class
   */
  const getScoreColor = (score: number): string => {
    if (score >= 85) return 'high'
    if (score >= 70) return 'medium'
    return 'low'
  }

  /**
   * Get status badge color
   */
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'PENDING':
        return 'warning'
      case 'APPROVED':
      case 'AUTO_MATCHED':
        return 'success'
      case 'REJECTED':
        return 'danger'
      default:
        return 'info'
    }
  }

  /**
   * Format date
   */
  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  }

  return {
    // State
    statistics,
    candidates,
    currentPage,
    totalPages,
    totalCount,
    pageSize,
    statusFilter,
    minScoreFilter,
    message,
    
    // UI State
    loading,
    submitting,
    findingMatches,
    
    // Methods
    loadStatistics,
    loadCandidates,
    findNewMatches,
    reviewCandidate,
    mergeCustomers,
    changeFilter,
    goToPage,
    clearMessage,
    initialize,
    
    // Helpers
    getScoreColor,
    getStatusColor,
    formatDate,
  }
}