<template>
  <div class="lcic-merge-container">
    <header class="page-header">
      <h1>LCIC Merge Candidate Suggestions</h1>
      <p class="subtitle">Find and merge duplicate individual records</p>
    </header>

    <!-- Search Form -->
    <section class="search-section">
      <form @submit.prevent="handleSearch" class="search-form">
        <div class="form-grid">
          <div class="form-group">
            <label for="name">Name</label>
            <input
              id="name"
              v-model="searchParams.name"
              type="text"
              placeholder="Enter name..."
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="birth_date">Birth Date</label>
            <input
              id="birth_date"
              v-model="searchParams.birth_date"
              type="date"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="familybook">Family Book</label>
            <input
              id="familybook"
              v-model="searchParams.familybook"
              type="text"
              placeholder="Family book number"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="prov_code">Province Code</label>
            <input
              id="prov_code"
              v-model="searchParams.prov_code"
              type="text"
              placeholder="e.g. NKL, XYL"
              maxlength="3"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="passport">Passport</label>
            <input
              id="passport"
              v-model="searchParams.passport"
              type="text"
              placeholder="Passport number"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="bnk_code">Bank Code</label>
            <input
              id="bnk_code"
              v-model="searchParams.bnk_code"
              type="text"
              placeholder="e.g. 415, 10"
              class="form-input"
            />
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary" :disabled="loading">
            <span v-if="loading">Searching...</span>
            <span v-else>Search Candidates</span>
          </button>
          <button type="button" @click="handleClear" class="btn btn-secondary">
            Clear
          </button>
        </div>
      </form>
    </section>

    <!-- Error Display -->
    <div v-if="error" class="error-message">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
      </svg>
      {{ error }}
    </div>

    <!-- Results Section -->
    <section v-if="mergeData" class="results-section">
      <div class="results-header">
        <h2>Search Results</h2>
        <div class="results-stats">
          <span class="stat-badge">{{ mergeData.suggestions_found }} Merge Groups</span>
          <span class="stat-badge">{{ mergeData.total_matching_records }} Total Records</span>
        </div>
      </div>

      <!-- No Results -->
      <div v-if="mergeData.suggestions_found === 0" class="no-results">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
        <p>No merge candidates found with the given criteria</p>
      </div>

      <!-- Suggestions List -->
      <div v-else class="suggestions-list">
        <article 
          v-for="(suggestion, idx) in mergeData.suggestions" 
          :key="idx"
          class="suggestion-card"
        >
          <header class="card-header">
            <div class="master-lcic">
              <span class="label">Suggested Master LCIC:</span>
              <span class="lcic-id">{{ suggestion.suggested_master_lcic }}</span>
            </div>
            <div class="merge-stats">
              <span class="records-count">{{ suggestion.total_records }} records</span>
              <span class="lcic-count">{{ suggestion.different_lcic_count }} LCICs</span>
            </div>
          </header>

          <div class="card-body">
            <!-- Individual Details -->
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Birth Date:</span>
                <span class="info-value">{{ formatDate(suggestion.birth_date) }}</span>
              </div>
              <div class="info-item" v-if="suggestion.familybook">
                <span class="info-label">Family Book:</span>
                <span class="info-value">{{ suggestion.familybook }}</span>
              </div>
              <div class="info-item" v-if="suggestion.prov_code">
                <span class="info-label">Province:</span>
                <span class="info-value">{{ suggestion.prov_code }}</span>
              </div>
              <div class="info-item" v-if="suggestion.genders.length > 0">
                <span class="info-label">Gender:</span>
                <span class="info-value">{{ suggestion.genders.join(', ') }}</span>
              </div>
            </div>

            <!-- Name Variants -->
            <div class="variants-section" v-if="suggestion.name_variants.length > 0">
              <h4>Name Variants</h4>
              <div class="variants-list">
                <span v-for="name in suggestion.name_variants" :key="name" class="variant-tag">
                  {{ name }}
                </span>
              </div>
            </div>

            <!-- LCIC Groups -->
            <div class="lcic-groups">
              <h4>LCIC Groups to Merge</h4>
              <div class="groups-table">
                <div 
                  v-for="group in suggestion.lcic_groups" 
                  :key="group.lcic_id"
                  class="group-row"
                  :class="{ 'is-master': group.lcic_id === suggestion.suggested_master_lcic }"
                >
                  <div class="group-header">
                    <span class="group-lcic">
                      {{ group.lcic_id }}
                      <span v-if="group.lcic_id === suggestion.suggested_master_lcic" class="master-badge">
                        MASTER
                      </span>
                    </span>
                    <span class="group-stats">
                      {{ group.count }} record(s) | Banks: {{ group.bnk_codes.join(', ') }}
                    </span>
                  </div>
                  <div class="group-samples">
                    <div v-for="sample in group.sample" :key="sample.ind_sys_id" class="sample-item">
                      <span class="sample-id">#{{ sample.ind_sys_id }}</span>
                      <span class="sample-name">{{ sample.name }}</span>
                      <span class="sample-bank">Bank: {{ sample.bnk_code }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useLcicMerge } from '~/composables/useLcicMerge'

// Page meta
definePageMeta({
  title: 'LCIC Merge Candidates',
  middleware: 'auth'
})

// Composable
const { loading, error, mergeData, searchMergeCandidates, clearResults } = useLcicMerge()

// Search parameters
const searchParams = reactive({
  name: '',
  birth_date: '',
  familybook: '',
  prov_code: '',
  passport: '',
  bnk_code: ''
})

// Handle search
const handleSearch = async () => {
  await searchMergeCandidates(searchParams)
}

// Clear form and results
const handleClear = () => {
  Object.keys(searchParams).forEach(key => {
    searchParams[key as keyof typeof searchParams] = ''
  })
  clearResults()
}

// Format date
const formatDate = (dateStr: string) => {
  if (!dateStr) return 'N/A'
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch {
    return dateStr
  }
}
</script>

<style scoped>
/* Container */
.lcic-merge-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

/* Header */
.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #6b7280;
  font-size: 1rem;
}

/* Search Section */
.search-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.search-form {
  width: 100%;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.form-input {
  padding: 0.625rem 0.875rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: all 0.2s;
  background: white;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input::placeholder {
  color: #9ca3af;
}

.form-actions {
  display: flex;
  gap: 1rem;
}

/* Buttons */
.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.875rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
  transform: translateY(-1px);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

/* Error Message */
.error-message {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.error-message svg {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

/* Results Section */
.results-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f3f4f6;
}

.results-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a1a1a;
}

.results-stats {
  display: flex;
  gap: 1rem;
}

.stat-badge {
  padding: 0.375rem 0.75rem;
  background: #eff6ff;
  color: #1e40af;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
}

/* No Results */
.no-results {
  text-align: center;
  padding: 3rem;
  color: #6b7280;
}

.no-results svg {
  width: 64px;
  height: 64px;
  margin: 0 auto 1rem;
  stroke-width: 1.5;
}

/* Suggestions List */
.suggestions-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.suggestion-card {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.2s;
}

.suggestion-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.card-header {
  background: #f9fafb;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e5e7eb;
}

.master-lcic {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.master-lcic .label {
  font-size: 0.875rem;
  color: #6b7280;
}

.lcic-id {
  font-family: 'Monaco', 'Courier New', monospace;
  font-weight: 600;
  color: #1e40af;
  background: #dbeafe;
  padding: 0.25rem 0.625rem;
  border-radius: 4px;
}

.merge-stats {
  display: flex;
  gap: 1rem;
}

.records-count,
.lcic-count {
  font-size: 0.875rem;
  color: #374151;
  font-weight: 500;
}

.card-body {
  padding: 1.5rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.info-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.info-value {
  font-size: 0.875rem;
  color: #1a1a1a;
  font-weight: 500;
}

/* Variants Section */
.variants-section {
  margin-bottom: 1.5rem;
}

.variants-section h4 {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.75rem;
}

.variants-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.variant-tag {
  padding: 0.375rem 0.75rem;
  background: #f3f4f6;
  color: #374151;
  border-radius: 6px;
  font-size: 0.875rem;
  border: 1px solid #e5e7eb;
}

/* LCIC Groups */
.lcic-groups h4 {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1rem;
}

.groups-table {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.group-row {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.group-row.is-master {
  border-color: #3b82f6;
  box-shadow: 0 0 0 1px #3b82f6;
}

.group-header {
  padding: 0.75rem 1rem;
  background: #f9fafb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e5e7eb;
}

.group-lcic {
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 0.875rem;
  font-weight: 500;
  color: #1a1a1a;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.master-badge {
  background: #3b82f6;
  color: white;
  padding: 0.125rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
}

.group-stats {
  font-size: 0.8125rem;
  color: #6b7280;
}

.group-samples {
  padding: 0.75rem 1rem;
  background: white;
}

.sample-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.375rem 0;
  font-size: 0.8125rem;
}

.sample-id {
  color: #9ca3af;
  font-family: 'Monaco', 'Courier New', monospace;
  min-width: 80px;
}

.sample-name {
  flex: 1;
  color: #374151;
  font-weight: 500;
}

.sample-bank {
  color: #6b7280;
  font-size: 0.75rem;
  background: #f9fafb;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

/* Responsive */
@media (max-width: 768px) {
  .lcic-merge-container {
    padding: 1rem;
  }

  .search-section,
  .results-section {
    padding: 1rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .results-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .group-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>