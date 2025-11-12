<template>
  <div class="matching-container">
    <!-- Message Banner (replaces toast) -->
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
          Customer Matching Dashboard
        </h1>
        <p class="page-subtitle">Review and manage duplicate customer records</p>
      </div>
      <button class="btn btn-primary" @click="showFindModal = true">
        <span class="icon">✨</span>
        Find New Matches
      </button>
    </header>

    <!-- Statistics Cards -->
    <section class="statistics-grid">
      <div class="stat-card">
        <div class="stat-icon pending">📋</div>
        <div class="stat-content">
          <div class="stat-value">{{ statistics?.matching_candidates.pending || 0 }}</div>
          <div class="stat-label">Pending Reviews</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon success">✅</div>
        <div class="stat-content">
          <div class="stat-value">{{ statistics?.matching_candidates.approved || 0 }}</div>
          <div class="stat-label">Approved</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon danger">❌</div>
        <div class="stat-content">
          <div class="stat-value">{{ statistics?.matching_candidates.rejected || 0 }}</div>
          <div class="stat-label">Rejected</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon info">📊</div>
        <div class="stat-content">
          <div class="stat-value">{{ formatScore(statistics?.matching_candidates.avg_score) }}%</div>
          <div class="stat-label">Average Score</div>
        </div>
      </div>
    </section>

    <!-- Filters -->
    <section class="filters-section">
      <div class="filter-group">
        <label for="status-filter">Status:</label>
        <select
          id="status-filter"
          v-model="statusFilter"
          class="filter-select"
          @change="changeFilter(statusFilter)"
        >
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
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
          @change="changeFilter(undefined, minScoreFilter)"
        />
      </div>

      <button class="btn btn-secondary" @click="loadCandidates(1)">
        <span class="icon">🔄</span>
        Refresh
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
              <span class="customer-id">ID: {{ candidate.source.ind_sys_id }}</span>
            </div>
            <div class="customer-details">
              <div class="detail-row">
                <span class="detail-label">LCIC ID:</span>
                <span class="detail-value">{{ candidate.source.lcic_id || 'N/A' }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Name:</span>
                <span class="detail-value">
                  {{ candidate.source.ind_name }} {{ candidate.source.ind_surname }}
                </span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Lao Name:</span>
                <span class="detail-value">
                  {{ candidate.source.ind_lao_name }} {{ candidate.source.ind_lao_surname }}
                </span>
              </div>
              <div class="detail-row">
                <span class="detail-label">National ID:</span>
                <span class="detail-value">{{ candidate.source.ind_national_id || 'N/A' }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Passport:</span>
                <span class="detail-value">{{ candidate.source.ind_passport || 'N/A' }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Family Book:</span>
                <span class="detail-value">{{ candidate.source.ind_familybook || 'N/A' }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Birth Date:</span>
                <span class="detail-value">{{ formatDate(candidate.source.ind_birth_date) }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Bank:</span>
                <span class="detail-value">{{ candidate.source.bnk_code || 'N/A' }}</span>
              </div>
            </div>
          </div>

          <!-- Customer B -->
          <div class="customer-card">
            <div class="customer-header">
              <span class="customer-label">Customer B</span>
              <span class="customer-id">ID: {{ candidate.target.ind_sys_id }}</span>
            </div>
            <div class="customer-details">
              <div class="detail-row">
                <span class="detail-label">LCIC ID:</span>
                <span class="detail-value">{{ candidate.target.lcic_id || 'N/A' }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Name:</span>
                <span class="detail-value">
                  {{ candidate.target.ind_name }} {{ candidate.target.ind_surname }}
                </span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Lao Name:</span>
                <span class="detail-value">
                  {{ candidate.target.ind_lao_name }} {{ candidate.target.ind_lao_surname }}
                </span>
              </div>
              <div class="detail-row">
                <span class="detail-label">National ID:</span>
                <span class="detail-value">{{ candidate.target.ind_national_id || 'N/A' }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Passport:</span>
                <span class="detail-value">{{ candidate.target.ind_passport || 'N/A' }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Family Book:</span>
                <span class="detail-value">{{ candidate.target.ind_familybook || 'N/A' }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Birth Date:</span>
                <span class="detail-value">{{ formatDate(candidate.target.ind_birth_date) }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Bank:</span>
                <span class="detail-value">{{ candidate.target.bnk_code || 'N/A' }}</span>
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
            <span v-else>🔍</span>
            {{ findingMatches ? 'Processing...' : 'Find Matches' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

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

// Meta
definePageMeta({
  layout: 'default',
})

useHead({
  title: 'Customer Matching Dashboard',
})
</script>

<style scoped>
/* Message Banner */
.message-banner {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  max-width: 400px;
  font-size: 0.875rem;
  font-weight: 500;
}

.message-success {
  background: #d1fae5;
  color: #065f46;
  border-left: 4px solid #10b981;
}

.message-error {
  background: #fee2e2;
  color: #991b1b;
  border-left: 4px solid #ef4444;
}

.message-info {
  background: #dbeafe;
  color: #1e40af;
  border-left: 4px solid #3b82f6;
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
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.message-close:hover {
  opacity: 1;
}

/* Slide down animation */
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

/* Container */
.matching-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.header-content {
  flex: 1;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.page-subtitle {
  font-size: 1rem;
  color: #718096;
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
  background: #fff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
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
  color: #1a202c;
  line-height: 1;
}

.stat-label {
  font-size: 0.875rem;
  color: #718096;
  margin-top: 0.25rem;
}

/* Filters */
.filters-section {
  display: flex;
  gap: 1rem;
  align-items: flex-end;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #4a5568;
}

.filter-select,
.filter-input {
  padding: 0.625rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
  background: #fff;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.filter-select:focus,
.filter-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.filter-input {
  width: 100px;
}

/* Buttons */
.btn {
  padding: 0.625rem 1.25rem;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: #3b82f6;
  color: #fff;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
}

.btn-secondary:hover:not(:disabled) {
  background: #e5e7eb;
}

.btn-success {
  background: #10b981;
  color: #fff;
}

.btn-success:hover:not(:disabled) {
  background: #059669;
}

.btn-danger {
  background: #ef4444;
  color: #fff;
}

.btn-danger:hover:not(:disabled) {
  background: #dc2626;
}

/* Loading & Empty States */
.loading-state,
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #e2e8f0;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.5rem;
  color: #1a202c;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #718096;
}

/* Match Cards */
.candidates-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.match-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: box-shadow 0.2s;
}

.match-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.match-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  background: #f9fafb;
  border-bottom: 1px solid #e2e8f0;
}

.match-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.match-id {
  font-weight: 600;
  color: #1a202c;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
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

.match-score {
  font-size: 1.75rem;
  font-weight: 700;
  padding: 0.5rem 1rem;
  border-radius: 999px;
  border: 3px solid;
}

.match-score.high {
  color: #059669;
  border-color: #059669;
  background: #d1fae5;
}

.match-score.medium {
  color: #d97706;
  border-color: #d97706;
  background: #fef3c7;
}

.match-score.low {
  color: #dc2626;
  border-color: #dc2626;
  background: #fee2e2;
}

/* Customer Comparison */
.comparison-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  padding: 1.5rem;
}

.customer-card {
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}

.customer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: #f9fafb;
  border-bottom: 2px solid #e2e8f0;
}

.customer-label {
  font-weight: 700;
  color: #1a202c;
}

.customer-id {
  font-size: 0.875rem;
  color: #718096;
}

.customer-details {
  padding: 1rem;
}

.detail-row {
  display: flex;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f3f4f6;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  flex: 0 0 120px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #718096;
}

.detail-value {
  flex: 1;
  font-size: 0.875rem;
  color: #1a202c;
}

/* Match Breakdown */
.match-breakdown {
  padding: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.match-breakdown h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 1rem;
}

.breakdown-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.breakdown-item {
  display: grid;
  grid-template-columns: 120px 1fr 60px;
  align-items: center;
  gap: 1rem;
}

.breakdown-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #4a5568;
}

.breakdown-bar {
  height: 24px;
  background: #e2e8f0;
  border-radius: 999px;
  overflow: hidden;
}

.breakdown-fill {
  height: 100%;
  transition: width 0.3s;
  border-radius: 999px;
}

.breakdown-fill.high {
  background: linear-gradient(90deg, #10b981, #059669);
}

.breakdown-fill.medium {
  background: linear-gradient(90deg, #f59e0b, #d97706);
}

.breakdown-fill.low {
  background: linear-gradient(90deg, #ef4444, #dc2626);
}

.breakdown-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1a202c;
  text-align: right;
}

/* Actions */
.match-actions {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.match-actions .btn {
  flex: 1;
}

.reviewed-info {
  padding: 1rem 1.5rem;
  background: #f9fafb;
  border-top: 1px solid #e2e8f0;
}

.reviewed-text {
  font-size: 0.875rem;
  color: #718096;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding: 1.5rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.page-info {
  font-size: 0.875rem;
  color: #4a5568;
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
  background: #fff;
  border-radius: 12px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0;
}

.btn-close {
  background: none;
  border: none;
  font-size: 2rem;
  color: #718096;
  cursor: pointer;
  line-height: 1;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background 0.2s;
}

.btn-close:hover {
  background: #f3f4f6;
}

.modal-body {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 0.5rem;
}

.form-input {
  width: 100%;
  padding: 0.625rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.modal-note {
  font-size: 0.875rem;
  color: #718096;
  padding: 0.75rem;
  background: #fef3c7;
  border-radius: 6px;
  border-left: 3px solid #f59e0b;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.spinner-small {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

/* Icons */
.icon {
  display: inline-block;
}

/* Responsive */
@media (max-width: 768px) {
  .matching-container {
    padding: 1rem;
  }

  .page-header {
    flex-direction: column;
    gap: 1rem;
  }

  .statistics-grid {
    grid-template-columns: 1fr;
  }

  .filters-section {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-input {
    width: 100%;
  }

  .comparison-grid {
    grid-template-columns: 1fr;
  }

  .match-actions {
    flex-direction: column;
  }

  .breakdown-item {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  .breakdown-label,
  .breakdown-value {
    text-align: left;
  }

  .message-banner {
    left: 20px;
    right: 20px;
    max-width: none;
  }
}
</style>