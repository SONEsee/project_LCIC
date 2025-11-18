<template>
  <div class="matching-container">
    <!-- Message Banner -->
    <transition name="slide-down">
      <div v-if="message" :class="['message-banner', `message-${message.type}`]">
        <span class="message-icon">
          {{ message.type === 'success' ? '✓' : message.type === 'error' ? '✗' : 'ℹ' }}
        </span>
        <span class="message-text">{{ message.text }}</span>
        <button class="message-close" @click="clearMessage">×</button>
      </div>
    </transition>

    <!-- Header -->
    <header class="page-header">
      <div class="header-content">
        <h1 class="page-title">
          <span class="icon">🔍</span>
          ຄົ້ນຫາຂໍ້ມູນລູກຄ້າທີ່ອາດຊໍ້າກັນ Individual_IBK (Auto)
        </h1>
        <p class="page-subtitle">ກວດສອບຂໍ້ມູນລູກຄ້າກ່ອນ Match ເຂົ້າກັນ</p>
      </div>
      <button class="btn btn-primary" @click="showFindModal = true">
        <span class="icon">✨</span>
        ຄົ້ນຫາ Match ໃໝ່
      </button>
    </header>

    <!-- Statistics Cards -->
    <section v-if="statistics" class="statistics-grid">
      <div class="stat-card">
        <div class="stat-icon pending">📋</div>
        <div class="stat-content">
          <div class="stat-value">{{ statistics.matching_candidates.pending || 0 }}</div>
          <div class="stat-label">ລໍຖ້າກວດສອບ</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon success">✅</div>
        <div class="stat-content">
          <div class="stat-value">{{ statistics.matching_candidates.approved || 0 }}</div>
          <div class="stat-label">ຢືນຢັນສໍາເລັດ</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon danger">❌</div>
        <div class="stat-content">
          <div class="stat-value">{{ statistics.matching_candidates.rejected || 0 }}</div>
          <div class="stat-label">ປ່ອຍວ່າງ</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon info">📊</div>
        <div class="stat-content">
          <div class="stat-value">{{ formatScore(statistics.scores.average) }}%</div>
          <div class="stat-label">ຄະເເນນສະເລ່ຍ</div>
        </div>
      </div>
    </section>

    <!-- Filters -->
    <section class="filters-section">
      <div class="filter-group">
        <label for="status-filter">ສະຖານະ:</label>
        <select
          id="status-filter"
          v-model="statusFilter"
          class="filter-select"
          @change="changeFilter(statusFilter)"
        >
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="AUTO_MATCHED">Auto Matched</option>
        </select>
      </div>

      <div class="filter-group">
        <label for="score-filter">Min Score:</label>
        <input
          id="score-filter"
          v-model.number="minScoreFilter"
          type="number"
          min="0"
          max="100"
          class="filter-input"
          placeholder="e.g., 70"
        />
      </div>

      <button class="btn btn-secondary" @click="applyFilters">
        <span class="icon">🔍</span>
        Apply Filters
      </button>

      <button class="btn btn-secondary" @click="resetFilters">
        <span class="icon">🔄</span>
        Reset
      </button>
    </section>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading matches...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="candidates.length === 0" class="empty-state">
      <div class="empty-icon">📭</div>
      <h3>No Matches Found</h3>
      <p>Try adjusting your filters or finding new matches</p>
    </div>

    <!-- Candidates List -->
    <section v-else class="candidates-list">
      <div
        v-for="candidate in candidates"
        :key="candidate.id"
        class="match-card"
      >
        <!-- Match Header -->
        <div class="match-header">
          <div class="match-info">
            <span class="match-id">Match #{{ candidate.id }}</span>
            <span :class="['status-badge', getStatusColor(candidate.status)]">
              {{ candidate.status }}
            </span>
          </div>
          <div :class="['match-score', getScoreColor(candidate.similarity_score)]">
            {{ candidate.similarity_score.toFixed(1) }}%
          </div>
        </div>

        <!-- Customer Comparison -->
        <div class="comparison-grid">
          <!-- Customer A -->
          <div class="customer-card">
            <div class="customer-header">
              <span class="customer-label">Customer A</span>
              <span class="customer-id">ID: {{ candidate.source_ind_sys_id }}</span>
            </div>
            <div class="customer-details">
              <div class="detail-row">
                <span class="detail-label">LCIC ID:</span>
                <span class="detail-value">{{ candidate.source_record.lcic_id || 'N/A' }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Name:</span>
                <span class="detail-value">{{ candidate.source_record.name }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Lao Name:</span>
                <span class="detail-value">{{ candidate.source_record.lao_name }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">National ID:</span>
                <span class="detail-value">{{ candidate.source_record.national_id || 'N/A' }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Passport:</span>
                <span class="detail-value">{{ candidate.source_record.passport || 'N/A' }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Family Book:</span>
                <span class="detail-value">{{ candidate.source_record.family_book || 'N/A' }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Birth Date:</span>
                <span class="detail-value">{{ formatDate(candidate.source_record.birth_date) }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Bank:</span>
                <span class="detail-value">{{ candidate.source_record.bank || 'N/A' }}</span>
              </div>
            </div>
          </div>

          <!-- Customer B -->
          <div class="customer-card">
            <div class="customer-header">
              <span class="customer-label">Customer B</span>
              <span class="customer-id">ID: {{ candidate.target_ind_sys_id }}</span>
            </div>
            <div class="customer-details">
              <div class="detail-row">
                <span class="detail-label">LCIC ID:</span>
                <span class="detail-value">{{ candidate.target_record.lcic_id || 'N/A' }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Name:</span>
                <span class="detail-value">{{ candidate.target_record.name }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Lao Name:</span>
                <span class="detail-value">{{ candidate.target_record.lao_name }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">National ID:</span>
                <span class="detail-value">{{ candidate.target_record.national_id || 'N/A' }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Passport:</span>
                <span class="detail-value">{{ candidate.target_record.passport || 'N/A' }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Family Book:</span>
                <span class="detail-value">{{ candidate.target_record.family_book || 'N/A' }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Birth Date:</span>
                <span class="detail-value">{{ formatDate(candidate.target_record.birth_date) }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Bank:</span>
                <span class="detail-value">{{ candidate.target_record.bank || 'N/A' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Match Breakdown -->
        <div v-if="candidate.match_details" class="match-breakdown">
          <h4>Match Breakdown</h4>
          <div class="breakdown-grid">
            <div
              v-for="(value, key) in candidate.match_details"
              :key="key"
              class="breakdown-item"
            >
              <span class="breakdown-label">{{ formatKey(key) }}</span>
              <div class="breakdown-bar">
                <div
                  class="breakdown-fill"
                  :style="{ width: `${value}%` }"
                  :class="getScoreColor(value)"
                ></div>
              </div>
              <span class="breakdown-value">{{ value.toFixed(1) }}%</span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div v-if="candidate.status === 'PENDING'" class="match-actions">
          <button
            class="btn btn-success"
            :disabled="submitting"
            @click="handleReview(candidate.id, 'approve')"
          >
            <span class="icon">✓</span>
            Approve & Merge
          </button>
          <button
            class="btn btn-danger"
            :disabled="submitting"
            @click="handleReview(candidate.id, 'reject')"
          >
            <span class="icon">✗</span>
            Reject
          </button>
        </div>

        <!-- Reviewed Info -->
        <div v-else class="reviewed-info">
          <span class="reviewed-text">
            Reviewed by {{ candidate.reviewed_by }} on {{ formatDate(candidate.reviewed_at) }}
          </span>
        </div>
      </div>
    </section>

    <!-- Pagination -->
    <section v-if="totalPages > 1" class="pagination">
      <button
        class="btn btn-secondary"
        :disabled="currentPage === 1"
        @click="goToPage(currentPage - 1)"
      >
        Previous
      </button>
      <span class="page-info">
        Page {{ currentPage }} of {{ totalPages }} ({{ totalCount }} total)
      </span>
      <button
        class="btn btn-secondary"
        :disabled="currentPage === totalPages"
        @click="goToPage(currentPage + 1)"
      >
        Next
      </button>
    </section>

    <!-- Find Matches Modal -->
    <div v-if="showFindModal" class="modal-overlay" @click.self="showFindModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Find New Matches</h2>
          <button class="btn-close" @click="showFindModal = false">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="modal-score">Minimum Score (0-100):</label>
            <input
              id="modal-score"
              v-model.number="findParams.min_score"
              type="number"
              min="0"
              max="100"
              class="form-input"
            />
            <small class="form-help">Recommended: 70 or higher</small>
          </div>
          <div class="form-group">
            <label for="modal-limit">Maximum Records to Process:</label>
            <input
              id="modal-limit"
              v-model.number="findParams.limit"
              type="number"
              min="100"
              max="10000"
              step="100"
              class="form-input"
            />
            <small class="form-help">Process up to this many records</small>
          </div>
          <p class="modal-note">
            ⚠️ This may take a few moments depending on the number of records.
          </p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="showFindModal = false">
            Cancel
          </button>
          <button
            class="btn btn-primary"
            :disabled="findingMatches"
            @click="handleFindMatches"
          >
            <span v-if="findingMatches" class="spinner-small"></span>
            <span v-else class="icon">🔍</span>
            {{ findingMatches ? 'Processing...' : 'Find Matches' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
definePageMeta({
  middleware: 'auth',
  layout: 'backend',
})
// Composable
const {
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
  loadCandidates,
  findNewMatches,
  reviewCandidate,
  changeFilter,
  goToPage,
  clearMessage,
  initialize,
  getScoreColor,
  getStatusColor,
  formatDate,
} = useCustomerMatching()

// Local state
const showFindModal = ref(false)
const findParams = ref({
  min_score: 70,
  limit: 1000,
  save_to_db: true,
})

// Handlers
const handleReview = async (candidateId: number, action: 'approve' | 'reject') => {
  const notes = prompt(
    action === 'approve'
      ? 'Add notes for this merge (optional):'
      : 'Reason for rejection:'
  )
  
  if (notes === null && action === 'reject') return

  await reviewCandidate({
    candidate_id: candidateId,
    action,
    notes: notes || '',
  })
}

const handleFindMatches = async () => {
  await findNewMatches(findParams.value)
  showFindModal.value = false
}

const applyFilters = async () => {
  await changeFilter(statusFilter.value, minScoreFilter.value || undefined)
}

const resetFilters = async () => {
  statusFilter.value = 'PENDING'
  minScoreFilter.value = null
  await loadCandidates(1)
}

// Helpers
const formatScore = (score?: number): string => {
  return score ? score.toFixed(1) : '0.0'
}

const formatKey = (key: string): string => {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase())
}

// Lifecycle
onMounted(() => {
  initialize()
})
</script>

<style scoped>
/* Base styles */
.matching-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

/* Message Banner */
.message-banner {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  min-width: 300px;
  max-width: 500px;
}

.message-success {
  background: #10b981;
  color: white;
}

.message-error {
  background: #ef4444;
  color: white;
}

.message-info {
  background: #3b82f6;
  color: white;
}

.message-icon {
  font-size: 1.25rem;
  font-weight: bold;
}

.message-text {
  flex: 1;
}

.message-close {
  background: none;
  border: none;
  color: inherit;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from {
  transform: translateY(-100%);
  opacity: 0;
}

.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

/* Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #e5e7eb;
}

.header-content {
  flex: 1;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.page-subtitle {
  font-size: 1rem;
  color: #6b7280;
  margin: 0;
}

/* Statistics Grid */
.statistics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  font-size: 2.5rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

.stat-icon.pending {
  background: #fef3c7;
}

.stat-icon.success {
  background: #d1fae5;
}

.stat-icon.danger {
  background: #fee2e2;
}

.stat-icon.info {
  background: #dbeafe;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  line-height: 1;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

/* Filters */
.filters-section {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-group label {
  font-weight: 500;
  color: #374151;
  white-space: nowrap;
}

.filter-select,
.filter-input {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  min-width: 150px;
}

.filter-input {
  min-width: 100px;
}

/* Loading State */
.loading-state,
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.spinner {
  border: 3px solid #f3f4f6;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.5rem;
  color: #111827;
  margin: 0 0 0.5rem 0;
}

.empty-state p {
  color: #6b7280;
}

/* Candidates List */
.candidates-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.match-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.match-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.match-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.match-id {
  font-weight: 600;
  color: #374151;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.warning {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.success {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.danger {
  background: #fee2e2;
  color: #991b1b;
}

.status-badge.info {
  background: #dbeafe;
  color: #1e40af;
}

.match-score {
  font-size: 1.5rem;
  font-weight: 700;
  padding: 0.5rem 1rem;
  border-radius: 8px;
}

.match-score.excellent {
  background: #d1fae5;
  color: #065f46;
}

.match-score.good {
  background: #dbeafe;
  color: #1e40af;
}

.match-score.medium {
  background: #fef3c7;
  color: #92400e;
}

.match-score.low {
  background: #fee2e2;
  color: #991b1b;
}

/* Comparison Grid */
.comparison-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  padding: 1.5rem;
}

.customer-card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.customer-header {
  background: #f9fafb;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e5e7eb;
}

.customer-label {
  font-weight: 600;
  color: #374151;
}

.customer-id {
  font-size: 0.875rem;
  color: #6b7280;
}

.customer-details {
  padding: 1rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f3f4f6;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-weight: 500;
  color: #6b7280;
  font-size: 0.875rem;
}

.detail-value {
  font-weight: 500;
  color: #111827;
  font-size: 0.875rem;
  text-align: right;
}

/* Match Breakdown */
.match-breakdown {
  padding: 1.5rem;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
}

.match-breakdown h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 1rem 0;
}

.breakdown-grid {
  display: grid;
  gap: 1rem;
}

.breakdown-item {
  display: grid;
  grid-template-columns: 150px 1fr 80px;
  align-items: center;
  gap: 1rem;
}

.breakdown-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.breakdown-bar {
  background: #e5e7eb;
  border-radius: 9999px;
  height: 8px;
  overflow: hidden;
}

.breakdown-fill {
  height: 100%;
  border-radius: 9999px;
  transition: width 0.3s ease;
}

.breakdown-fill.excellent {
  background: #10b981;
}

.breakdown-fill.good {
  background: #3b82f6;
}

.breakdown-fill.medium {
  background: #f59e0b;
}

.breakdown-fill.low {
  background: #ef4444;
}

.breakdown-value {
  text-align: right;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

/* Actions */
.match-actions {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
  background: white;
}

.reviewed-info {
  padding: 1rem 1.5rem;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
  text-align: center;
}

.reviewed-text {
  font-size: 0.875rem;
  color: #6b7280;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  margin-top: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.page-info {
  font-size: 0.875rem;
  color: #6b7280;
}

/* Buttons */
.btn {
  padding: 0.625rem 1.25rem;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.875rem;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
}

.btn-secondary {
  background: #6b7280;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: #4b5563;
}

.btn-success {
  background: #10b981;
  color: white;
  flex: 1;
}

.btn-success:hover:not(:disabled) {
  background: #059669;
}

.btn-danger {
  background: #ef4444;
  color: white;
  flex: 1;
}

.btn-danger:hover:not(:disabled) {
  background: #dc2626;
}

.icon {
  font-size: 1rem;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.btn-close {
  background: none;
  border: none;
  font-size: 2rem;
  color: #6b7280;
  cursor: pointer;
  line-height: 1;
  padding: 0;
}

.modal-body {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.form-input {
  width: 100%;
  padding: 0.625rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
}

.form-help {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: #6b7280;
}

.modal-note {
  background: #fef3c7;
  color: #92400e;
  padding: 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  margin: 0;
}

.modal-footer {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.modal-footer .btn {
  flex: 1;
}

.spinner-small {
  display: inline-block;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;
}

/* Responsive */
@media (max-width: 768px) {
  .matching-container {
    padding: 1rem;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .statistics-grid {
    grid-template-columns: 1fr;
  }

  .filters-section {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-group {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-select,
  .filter-input {
    width: 100%;
  }

  .comparison-grid {
    grid-template-columns: 1fr;
  }

  .breakdown-item {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  .breakdown-bar {
    order: 2;
  }

  .breakdown-value {
    order: 3;
    text-align: left;
  }

  .match-actions {
    flex-direction: column;
  }

  .pagination {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>