<template>
  <div class="cleanup-container">
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
          <span class="icon">🧹</span>
          ກວດສອບແລະລວມຂໍ້ມູນຊໍ້າ
        </h1>
        <p class="page-subtitle"> Merge ລູກຄ້າ</p>
      </div>
      <button class="btn btn-primary" @click="loadDuplicates">
        <span class="icon">🔄</span>
        Refresh
      </button>
    </header>

    <!-- Statistics -->
    <section v-if="statistics" class="statistics-grid">
      <div class="stat-card">
        <div class="stat-icon total">📊</div>
        <div class="stat-content">
          <div class="stat-value">{{ statistics.total_records }}</div>
          <div class="stat-label">ລາຍການທັງໝົດ</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon warning">⚠️</div>
        <div class="stat-content">
          <div class="stat-value">{{ statistics.duplicate_groups }}</div>
          <div class="stat-label">Duplicate Groups</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon danger">🔴</div>
        <div class="stat-content">
          <div class="stat-value">{{ statistics.total_duplicates }}</div>
          <div class="stat-label">Total Duplicates</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon success">✨</div>
        <div class="stat-content">
          <div class="stat-value">{{ statistics.potential_savings }}</div>
          <div class="stat-label">Can Be Cleaned</div>
        </div>
      </div>
    </section>

    <!-- Filters -->
    <section class="filters-section">
      <div class="filter-group">
        <label for="search-filter">Search:</label>
        <input
          id="search-filter"
          v-model="searchTerm"
          type="text"
          class="filter-input"
          placeholder="Name, LCIC ID, National ID..."
          @keyup.enter="applyFilters"
        />
      </div>

      <div class="filter-group">
        <label for="similarity-filter">Min Similarity:</label>
        <input
          id="similarity-filter"
          v-model.number="minSimilarity"
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
        <span class="icon">↺</span>
        Reset
      </button>
    </section>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading duplicate records...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="duplicateGroups.length === 0" class="empty-state">
      <div class="empty-icon">✨</div>
      <h3>No Duplicates Found</h3>
      <p>All records are clean or no matches found with current filters</p>
    </div>

    <!-- Duplicate Groups List -->
    <section v-else class="groups-list">
      <div
        v-for="(group, groupIndex) in duplicateGroups"
        :key="group.group_id"
        class="group-card"
      >
        <!-- Group Header -->
        <div class="group-header">
          <div class="group-info">
            <h3 class="group-title">
              <span class="icon">👥</span>
              Duplicate Group #{{ groupIndex + 1 }}
            </h3>
            <span class="duplicate-count">
              {{ group.duplicate_count + 1 }} records
            </span>
            <span class="similarity-badge">
              {{ group.avg_similarity.toFixed(1) }}% similar
            </span>
          </div>
          <button
            v-if="getSelectedInGroup(group).length >= 2"
            class="btn btn-success btn-sm"
            :disabled="merging"
            @click="showMergeModal(group)"
          >
            <span class="icon">🔗</span>
            Merge Selected ({{ getSelectedInGroup(group).length }})
          </button>
        </div>

        <!-- Combined Identifiers Preview -->
        <div class="combined-preview">
          <div class="preview-item">
            <strong>National IDs:</strong>
            <span>{{ group.combined_identifiers.national_ids.join(', ') || 'None' }}</span>
          </div>
          <div class="preview-item">
            <strong>Passports:</strong>
            <span>{{ group.combined_identifiers.passports.join(', ') || 'None' }}</span>
          </div>
          <div class="preview-item">
            <strong>Family Books:</strong>
            <span>{{ group.combined_identifiers.family_books.join(', ') || 'None' }}</span>
          </div>
        </div>

        <!-- Records Table -->
        <div class="records-table">
          <table>
            <thead>
              <tr>
                <th width="40">
                  <input
                    type="checkbox"
                    :checked="isGroupFullySelected(group)"
                    @change="toggleGroupSelection(group)"
                  />
                </th>
                <th width="60">Master</th>
                <th>Name</th>
                <th>Lao Name</th>
                <th>Birth Date</th>
                <th>National ID</th>
                <th>Passport</th>
                <th>Family Book</th>
                <th>LCIC ID</th>
              </tr>
            </thead>
            <tbody>
              <!-- Master Record -->
              <tr class="master-row">
                <td>
                  <input
                    type="checkbox"
                    :value="group.master_record.ind_sys_id"
                    v-model="selectedRecords"
                  />
                </td>
                <td>
                  <input
                    type="radio"
                    :name="`master_${group.group_id}`"
                    :value="group.master_record.ind_sys_id"
                    :checked="getMasterForGroup(group) === group.master_record.ind_sys_id"
                    @change="setMasterForGroup(group, group.master_record.ind_sys_id)"
                  />
                </td>
                <td class="name-cell">
                  <span class="badge master-badge">MASTER</span>
                  {{ group.master_record.name }}
                </td>
                <td>{{ group.master_record.lao_name }}</td>
                <td>{{ formatDate(group.master_record.birth_date) }}</td>
                <td>{{ group.master_record.national_id || 'N/A' }}</td>
                <td>{{ group.master_record.passport || 'N/A' }}</td>
                <td>{{ group.master_record.family_book || 'N/A' }}</td>
                <td class="lcic-cell">{{ group.master_record.lcic_id }}</td>
              </tr>

              <!-- Duplicate Records -->
              <tr
                v-for="record in group.duplicate_records"
                :key="record.ind_sys_id"
                class="duplicate-row"
              >
                <td>
                  <input
                    type="checkbox"
                    :value="record.ind_sys_id"
                    v-model="selectedRecords"
                  />
                </td>
                <td>
                  <input
                    type="radio"
                    :name="`master_${group.group_id}`"
                    :value="record.ind_sys_id"
                    :checked="getMasterForGroup(group) === record.ind_sys_id"
                    @change="setMasterForGroup(group, record.ind_sys_id)"
                  />
                </td>
                <td class="name-cell">
                  <span class="badge duplicate-badge">DUPLICATE</span>
                  {{ record.name }}
                </td>
                <td>{{ record.lao_name }}</td>
                <td>{{ formatDate(record.birth_date) }}</td>
                <td>{{ record.national_id || 'N/A' }}</td>
                <td>{{ record.passport || 'N/A' }}</td>
                <td>{{ record.family_book || 'N/A' }}</td>
                <td class="lcic-cell">{{ record.lcic_id }}</td>
              </tr>
            </tbody>
          </table>
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
        Page {{ currentPage }} of {{ totalPages }}
      </span>
      <button
        class="btn btn-secondary"
        :disabled="currentPage === totalPages"
        @click="goToPage(currentPage + 1)"
      >
        Next
      </button>
    </section>

    <!-- Merge Confirmation Modal -->
    <div v-if="showMergeConfirm" class="modal-overlay" @click.self="showMergeConfirm = false">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Confirm Merge</h2>
          <button class="btn-close" @click="showMergeConfirm = false">×</button>
        </div>
        <div class="modal-body">
          <p class="modal-warning">
            ⚠️ You are about to merge {{ pendingMerge.ind_sys_ids.length }} records into one.
          </p>
          <div class="merge-details">
            <h4>Records to merge:</h4>
            <ul>
              <li v-for="id in pendingMerge.ind_sys_ids" :key="id">
                IND_SYS_ID: {{ id }}
                <span v-if="id === pendingMerge.master_ind_sys_id" class="master-label">
                  (Master)
                </span>
              </li>
            </ul>
            <h4>Combined Identifiers:</h4>
            <div class="identifier-list">
              <div v-if="pendingMerge.combined_identifiers?.national_ids?.length">
                <strong>National IDs:</strong>
                {{ pendingMerge.combined_identifiers.national_ids.join(', ') }}
              </div>
              <div v-if="pendingMerge.combined_identifiers?.passports?.length">
                <strong>Passports:</strong>
                {{ pendingMerge.combined_identifiers.passports.join(', ') }}
              </div>
              <div v-if="pendingMerge.combined_identifiers?.family_books?.length">
                <strong>Family Books:</strong>
                {{ pendingMerge.combined_identifiers.family_books.join(', ') }}
              </div>
            </div>
          </div>
          <div class="form-group">
            <label for="merge-reason">Reason for merge:</label>
            <textarea
              id="merge-reason"
              v-model="mergeReason"
              class="form-textarea"
              rows="3"
              placeholder="e.g., Manual verification - same person with different records"
            ></textarea>
          </div>
          <p class="modal-note">
            This action will delete duplicate records and keep only the master record with all combined identifiers.
          </p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="showMergeConfirm = false">
            Cancel
          </button>
          <button
            class="btn btn-danger"
            :disabled="merging || !mergeReason"
            @click="confirmMerge"
          >
            <span v-if="merging" class="spinner-small"></span>
            <span v-else class="icon">🔗</span>
            {{ merging ? 'Merging...' : 'Confirm Merge' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
definePageMeta({
  middleware: 'auth',
  layout: 'backend',
})
// Types
interface DuplicateGroup {
  group_id: string
  master_record: any
  duplicate_records: any[]
  duplicate_count: number
  avg_similarity: number
  combined_identifiers: {
    national_ids: string[]
    passports: string[]
    family_books: string[]
  }
  all_ind_sys_ids: number[]
}

// Composable
const api = useCleanupApi()

// State
const duplicateGroups = ref<DuplicateGroup[]>([])
const statistics = ref<any>(null)
const selectedRecords = ref<number[]>([])
const masterRecords = ref<Record<string, number>>({}) // group_id -> master_ind_sys_id
const currentPage = ref(1)
const totalPages = ref(1)
const totalCount = ref(0)
const searchTerm = ref('')
const minSimilarity = ref(70)
const loading = ref(false)
const merging = ref(false)
const showMergeConfirm = ref(false)
const pendingMerge = ref<any>({})
const mergeReason = ref('')
const message = ref<any>(null)

// Helpers
const showMessage = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
  message.value = { text, type }
  setTimeout(() => {
    message.value = null
  }, 5000)
}

const clearMessage = () => {
  message.value = null
}

const formatDate = (dateString: string | null): string => {
  if (!dateString) return 'N/A'
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return dateString
  }
}

// Load data
const loadStatistics = async () => {
  try {
    const response = await api.getCleanupStatistics()
    if (response.success) {
      statistics.value = response.statistics
    }
  } catch (error: any) {
    console.error('Error loading statistics:', error)
  }
}

const loadDuplicates = async (page: number = 1) => {
  loading.value = true
  try {
    const params: any = {
      page,
      page_size: 10,
      min_similarity: minSimilarity.value,
    }

    if (searchTerm.value) {
      params.search = searchTerm.value
    }

    const response = await api.listDuplicateInfoRecords(params)
    
    if (response.results) {
      duplicateGroups.value = response.results
      totalCount.value = response.count
      currentPage.value = page
      totalPages.value = Math.ceil(response.count / 10)
      
      // Initialize master records for each group
      response.results.forEach((group: DuplicateGroup) => {
        if (!masterRecords.value[group.group_id]) {
          masterRecords.value[group.group_id] = group.master_record.ind_sys_id
        }
      })
    }
  } catch (error: any) {
    console.error('Error loading duplicates:', error)
    showMessage(error?.data?.error || 'Failed to load duplicates', 'error')
  } finally {
    loading.value = false
  }
}

// Selection management
const getSelectedInGroup = (group: DuplicateGroup) => {
  return group.all_ind_sys_ids.filter(id => selectedRecords.value.includes(id))
}

const isGroupFullySelected = (group: DuplicateGroup) => {
  return group.all_ind_sys_ids.every(id => selectedRecords.value.includes(id))
}

const toggleGroupSelection = (group: DuplicateGroup) => {
  if (isGroupFullySelected(group)) {
    // Deselect all in group
    selectedRecords.value = selectedRecords.value.filter(
      id => !group.all_ind_sys_ids.includes(id)
    )
  } else {
    // Select all in group
    const newSelections = group.all_ind_sys_ids.filter(
      id => !selectedRecords.value.includes(id)
    )
    selectedRecords.value.push(...newSelections)
  }
}

const getMasterForGroup = (group: DuplicateGroup): number => {
  return masterRecords.value[group.group_id] || group.master_record.ind_sys_id
}

const setMasterForGroup = (group: DuplicateGroup, indSysId: number) => {
  masterRecords.value[group.group_id] = indSysId
}

// Merge operations
const showMergeModal = (group: DuplicateGroup) => {
  const selectedInGroup = getSelectedInGroup(group)
  
  if (selectedInGroup.length < 2) {
    showMessage('Please select at least 2 records to merge', 'error')
    return
  }

  pendingMerge.value = {
    ind_sys_ids: selectedInGroup,
    master_ind_sys_id: getMasterForGroup(group),
    combined_identifiers: group.combined_identifiers,
  }
  
  mergeReason.value = ''
  showMergeConfirm.value = true
}

const confirmMerge = async () => {
  if (!mergeReason.value) {
    showMessage('Please provide a reason for merge', 'error')
    return
  }

  merging.value = true
  try {
    const response = await api.mergeInfoRecords({
      ind_sys_ids: pendingMerge.value.ind_sys_ids,
      master_ind_sys_id: pendingMerge.value.master_ind_sys_id,
      reason: mergeReason.value,
    })

    if (response.success) {
      showMessage(
        `Successfully merged ${response.merged_count} records into LCIC ID: ${response.master_lcic_id}`,
        'success'
      )
      
      // Clear selections
      selectedRecords.value = selectedRecords.value.filter(
        id => !pendingMerge.value.ind_sys_ids.includes(id)
      )
      
      // Reload data
      await Promise.all([loadDuplicates(currentPage.value), loadStatistics()])
      
      showMergeConfirm.value = false
    }
  } catch (error: any) {
    console.error('Error merging records:', error)
    showMessage(error?.data?.error || 'Failed to merge records', 'error')
  } finally {
    merging.value = false
  }
}

// Filters
const applyFilters = async () => {
  await loadDuplicates(1)
}

const resetFilters = async () => {
  searchTerm.value = ''
  minSimilarity.value = 70
  await loadDuplicates(1)
}

const goToPage = async (page: number) => {
  await loadDuplicates(page)
}

// Lifecycle
onMounted(async () => {
  await Promise.all([loadStatistics(), loadDuplicates(1)])
})
</script>

<style scoped>
/* Base styles - reuse from matching dashboard */
.cleanup-container {
  max-width: 1600px;
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

.message-success { background: #10b981; color: white; }
.message-error { background: #ef4444; color: white; }
.message-info { background: #3b82f6; color: white; }

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

.slide-down-enter-from,
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

.stat-icon.total { background: #dbeafe; }
.stat-icon.warning { background: #fef3c7; }
.stat-icon.danger { background: #fee2e2; }
.stat-icon.success { background: #d1fae5; }

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

.filter-input {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  min-width: 200px;
}

/* Loading & Empty States */
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
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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

/* Group Card */
.groups-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.group-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.group-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.group-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.duplicate-count {
  padding: 0.25rem 0.75rem;
  background: #fef3c7;
  color: #92400e;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
}

.similarity-badge {
  padding: 0.25rem 0.75rem;
  background: #dbeafe;
  color: #1e40af;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
}

/* Combined Preview */
.combined-preview {
  padding: 1rem 1.5rem;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.preview-item {
  font-size: 0.875rem;
}

.preview-item strong {
  color: #374151;
  margin-right: 0.5rem;
}

.preview-item span {
  color: #6b7280;
}

/* Records Table */
.records-table {
  overflow-x: auto;
}

.records-table table {
  width: 100%;
  border-collapse: collapse;
}

.records-table th {
  background: #f9fafb;
  padding: 0.75rem;
  text-align: left;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
}

.records-table td {
  padding: 0.75rem;
  border-bottom: 1px solid #f3f4f6;
  font-size: 0.875rem;
  color: #111827;
}

.master-row {
  background: #f0fdf4;
}

.duplicate-row:hover {
  background: #f9fafb;
}

.name-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.badge {
  padding: 0.125rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.master-badge {
  background: #10b981;
  color: white;
}

.duplicate-badge {
  background: #f59e0b;
  color: white;
}

.lcic-cell {
  font-family: monospace;
  font-size: 0.75rem;
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

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.813rem;
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
}

.btn-success:hover:not(:disabled) {
  background: #059669;
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #dc2626;
}

.icon {
  font-size: 1rem;
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
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
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

.modal-warning {
  background: #fef3c7;
  color: #92400e;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
}

.merge-details {
  margin: 1rem 0;
}

.merge-details h4 {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin: 1rem 0 0.5rem 0;
}

.merge-details ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.merge-details li {
  padding: 0.5rem;
  background: #f9fafb;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.master-label {
  background: #10b981;
  color: white;
  padding: 0.125rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  margin-left: 0.5rem;
}

.identifier-list {
  background: #f9fafb;
  padding: 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
}

.identifier-list > div {
  margin-bottom: 0.5rem;
}

.identifier-list strong {
  color: #374151;
}

.form-group {
  margin: 1rem 0;
}

.form-group label {
  display: block;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.form-textarea {
  width: 100%;
  padding: 0.625rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  font-family: inherit;
  resize: vertical;
}

.modal-note {
  background: #fee2e2;
  color: #991b1b;
  padding: 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  margin: 1rem 0 0 0;
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
  .cleanup-container {
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

  .filter-input {
    width: 100%;
  }

  .records-table {
    font-size: 0.75rem;
  }

  .records-table th,
  .records-table td {
    padding: 0.5rem;
  }
}
</style>