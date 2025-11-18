// composables/useCustomerMatching.ts
import { ref, computed } from 'vue'

interface MatchingCandidate {
  id: number
  source_ind_sys_id: number
  target_ind_sys_id: number
  similarity_score: number
  status: string
  match_details: Record<string, number>
  created_at: string
  reviewed_at: string | null
  reviewed_by: string | null
  source_record: CustomerRecord
  target_record: CustomerRecord
}

interface CustomerRecord {
  name: string
  lao_name: string
  birth_date: string | null
  gender: string
  national_id: string
  passport: string
  family_book: string
  bank: string
  segment: string
  lcic_id: string
  ind_sys_id?: number
  ind_name?: string
  ind_surname?: string
  ind_lao_name?: string
  ind_lao_surname?: string
  ind_birth_date?: string
  ind_national_id?: string
  ind_passport?: string
  ind_familybook?: string
  bnk_code?: string
}

interface Statistics {
  matching_candidates: {
    total: number
    pending: number
    approved: number
    rejected: number
    auto_matched: number
    avg_score: number
    pending_percentage: number
  }
  scores: {
    average: number
    maximum: number
    minimum: number
  }
  customers: {
    total_merged_customers: number
    total_merged_records: number
    total_unmerged_records: number
    merge_ratio: number
  }
  operations: {
    total_merges: number
    total_unmerges: number
  }
  recent_activity: {
    reviews_last_7_days: number
    merges_last_7_days: number
  }
  top_reviewers: Array<{ reviewed_by: string; count: number }>
}

interface Message {
  text: string
  type: 'success' | 'error' | 'info'
}

export const useCustomerMatching = () => {
  const api = useMatchingApi()

  // State
  const statistics = ref<Statistics | null>(null)
  const candidates = ref<MatchingCandidate[]>([])
  const currentPage = ref(1)
  const totalPages = ref(1)
  const totalCount = ref(0)
  const statusFilter = ref('PENDING')
  const minScoreFilter = ref<number | null>(null)
  const message = ref<Message | null>(null)
  const loading = ref(false)
  const submitting = ref(false)
  const findingMatches = ref(false)

  // Helper functions
  const showMessage = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    message.value = { text, type }
    setTimeout(() => {
      message.value = null
    }, 5000)
  }

  const clearMessage = () => {
    message.value = null
  }

  // Load statistics
  const loadStatistics = async () => {
    try {
      const response = await api.getStatistics()
      if (response.success) {
        statistics.value = response.statistics
      }
    } catch (error: any) {
      console.error('Error loading statistics:', error)
      showMessage(error?.data?.error || 'Failed to load statistics', 'error')
    }
  }

  // Load candidates
  const loadCandidates = async (page: number = 1) => {
    loading.value = true
    try {
      const params: any = {
        page,
        page_size: 20,
        status: statusFilter.value,
      }

      if (minScoreFilter.value !== null) {
        params.min_score = minScoreFilter.value
      }

      const response = await api.listMatchingCandidates(params)
      
      // Handle paginated response
      if (response.results) {
        candidates.value = response.results.map((c: any) => ({
          id: c.id,
          source_ind_sys_id: c.source_ind_sys_id,
          target_ind_sys_id: c.target_ind_sys_id,
          similarity_score: c.similarity_score,
          status: c.status,
          match_details: c.match_details,
          created_at: c.created_at,
          reviewed_at: c.reviewed_at,
          reviewed_by: c.reviewed_by,
          source_record: c.source_record,
          target_record: c.target_record,
          source: c.source_record, // For backwards compatibility with template
          target: c.target_record, // For backwards compatibility with template
        }))
        
        totalCount.value = response.count
        currentPage.value = page
        totalPages.value = Math.ceil(response.count / 20)
      }
    } catch (error: any) {
      console.error('Error loading candidates:', error)
      showMessage(error?.data?.error || 'Failed to load candidates', 'error')
      candidates.value = []
    } finally {
      loading.value = false
    }
  }

  // Find new matches
  const findNewMatches = async (params: {
    min_score: number
    limit: number
    save_to_db?: boolean
  }) => {
    findingMatches.value = true
    try {
      const response = await api.findMatchingCandidates({
        limit: params.limit,
        min_score: params.min_score,
        save: params.save_to_db !== false,
      })

      if (response.success) {
        showMessage(
          `Found ${response.candidates_found} candidates, saved ${response.candidates_saved}`,
          'success'
        )
        await loadCandidates(1)
        await loadStatistics()
      }
    } catch (error: any) {
      console.error('Error finding matches:', error)
      showMessage(error?.data?.error || 'Failed to find matches', 'error')
    } finally {
      findingMatches.value = false
    }
  }

  // Review candidate
  const reviewCandidate = async (data: {
    candidate_id: number
    action: 'approve' | 'reject'
    notes?: string
  }) => {
    submitting.value = true
    try {
      const response = await api.reviewCandidate({
        candidate_id: data.candidate_id,
        action: data.action,
        notes: data.notes,
        merge_reason: data.action === 'approve' ? data.notes : undefined,
      })

      if (response.success) {
        showMessage(
          data.action === 'approve'
            ? `Approved and merged successfully! LCIC ID: ${response.lcic_id}`
            : 'Rejected successfully',
          'success'
        )
        await loadCandidates(currentPage.value)
        await loadStatistics()
      }
    } catch (error: any) {
      console.error('Error reviewing candidate:', error)
      showMessage(error?.data?.error || 'Failed to review candidate', 'error')
    } finally {
      submitting.value = false
    }
  }

  // Change filter
  const changeFilter = async (status?: string, minScore?: number) => {
    if (status !== undefined) {
      statusFilter.value = status
    }
    if (minScore !== undefined) {
      minScoreFilter.value = minScore
    }
    await loadCandidates(1)
  }

  // Go to page
  const goToPage = async (page: number) => {
    await loadCandidates(page)
  }

  // Initialize
  const initialize = async () => {
    await Promise.all([loadStatistics(), loadCandidates(1)])
  }

  // Helper functions for UI
  const getScoreColor = (score: number): string => {
    if (score >= 90) return 'excellent'
    if (score >= 80) return 'good'
    if (score >= 70) return 'medium'
    return 'low'
  }

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'PENDING':
        return 'warning'
      case 'APPROVED':
        return 'success'
      case 'REJECTED':
        return 'danger'
      case 'AUTO_MATCHED':
        return 'info'
      default:
        return 'secondary'
    }
  }

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'N/A'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return 'Invalid Date'
    }
  }

  return {
    // State
    statistics,
    candidates,
    currentPage,
    totalPages,
    totalCount,
    statusFilter,
    minScoreFilter,
    message,
    loading,
    submitting,
    findingMatches,

    // Methods
    loadStatistics,
    loadCandidates,
    findNewMatches,
    reviewCandidate,
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