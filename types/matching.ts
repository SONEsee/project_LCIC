// types/matching.ts

export interface CustomerRecord {
  ind_sys_id: number
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

export interface MatchingCandidate {
  id: number
  source_ind_sys_id: number
  target_ind_sys_id: number
  similarity_score: number
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'AUTO_MATCHED'
  match_details: Record<string, number>
  created_at: string
  reviewed_at: string | null
  reviewed_by: string | null
  notes?: string
  source_record: CustomerRecord
  target_record: CustomerRecord
  // For backwards compatibility
  source?: CustomerRecord
  target?: CustomerRecord
}

export interface Statistics {
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
  top_reviewers: Array<{
    reviewed_by: string
    count: number
  }>
}

export interface MergedCustomer {
  lcic_id: string
  mm_ind_sys_id: string
  name: string
  lao_name: string
  birth_date: string | null
  primary_national_id: string
  primary_passport: string
  primary_family_book: string
  identifiers: Identifier[]
  identifier_count: number
  source_records: SourceRecord[]
  source_record_count: number
  last_merge: {
    performed_by: string
    performed_at: string
    reason: string
  } | null
}

export interface Identifier {
  identifier_type: string
  identifier_value: string
  identifier_date: string | null
  province_code: string | null
  is_active: boolean
  created_at: string
  created_by: string
  notes: string
}

export interface SourceRecord {
  ind_sys_id: number
  bank_code: string
  branch_code: string
  customer_id: string
  segment: string
  name: string
  birth_date: string | null
  gender: string
  national_id: string
  passport: string
  family_book: string
  mm_status: string
  mm_action_date: string | null
  mm_by: string
  inserted_at: string | null
}

export interface CustomerDetails {
  customer: {
    lcic_id: string
    mm_ind_sys_id: string
    name: string
    lao_name: string
    birth_date: string | null
    primary_national_id: string
    primary_passport: string
    primary_family_book: string
  }
  identifiers: Identifier[]
  source_records: SourceRecord[]
  merge_history: MergeHistoryItem[]
}

export interface MergeHistoryItem {
  action: 'MERGE' | 'UNMERGE'
  performed_by: string
  performed_at: string
  reason: string
  merged_ind_sys_ids: number[]
  merged_data: any
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface FindMatchesParams {
  limit?: number
  min_score?: number
  save?: boolean
}

export interface ListCandidatesParams {
  status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'AUTO_MATCHED'
  min_score?: number
  max_score?: number
  page?: number
  page_size?: number
}

export interface ReviewCandidateParams {
  candidate_id: number
  action: 'approve' | 'reject'
  notes?: string
  merge_reason?: string
}

export interface ManualMergeParams {
  ind_sys_ids: number[]
  master_record_id?: number
  reason: string
}

export interface UnmergeParams {
  ind_sys_id: number
  reason: string
}