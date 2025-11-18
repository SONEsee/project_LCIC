<template>
  <div class="merged-customers-container">
    <!-- Page Header -->
    <header class="page-header">
      <div class="header-content">
        <h1 class="page-title">
          <span class="icon">🔗</span>
          ຂໍ້ມູນລູກຄ້າທີ່ຖືກລວມ 
        </h1>
        <p class="page-subtitle">View and filter all customers with merge history</p>
      </div>
      <button class="btn btn-primary" @click="refreshData" :disabled="loading">
        <span v-if="loading" class="spinner-small"></span>
        <span v-else class="icon">🔄</span>
        {{ loading ? 'Loading...' : 'Refresh' }}
      </button>
    </header>

    <!-- Statistics Cards -->
    <section v-if="statistics" class="statistics-grid">
      <div class="stat-card">
        <div class="stat-icon">🔗</div>
        <div class="stat-content">
          <div class="stat-value">{{ statistics.total_merge_operations }}</div>
          <div class="stat-label">Total Merges</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">👥</div>
        <div class="stat-content">
          <div class="stat-value">{{ statistics.total_merged_customers }}</div>
          <div class="stat-label">Merged Customers</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">🆔</div>
        <div class="stat-content">
          <div class="stat-value">{{ statistics.total_active_identifiers }}</div>
          <div class="stat-label">Active Identifiers</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">📊</div>
        <div class="stat-content">
          <div class="stat-value">{{ statistics.customers_with_multiple_ids }}</div>
          <div class="stat-label">Multiple IDs</div>
        </div>
      </div>
    </section>

    <!-- Filters Section -->
    <section class="filters-section">
      <div class="filters-header">
        <h3>Filters</h3>
        <button 
          v-if="hasActiveFilters" 
          class="btn btn-link" 
          @click="clearFilters"
        >
          Clear All Filters
        </button>
      </div>

      <div class="filters-grid">
        <!-- Search -->
        <div class="filter-group">
          <label for="search-filter">Search:</label>
          <input
            id="search-filter"
            v-model="filters.search"
            type="text"
            class="filter-input"
            placeholder="Name, LCIC ID, National ID..."
          />
        </div>

        <!-- Performed By -->
        <div class="filter-group">
          <label for="performed-by-filter">Merged By:</label>
          <input
            id="performed-by-filter"
            v-model="filters.performed_by"
            type="text"
            class="filter-input"
            placeholder="Username..."
          />
        </div>

        <!-- Date From -->
        <div class="filter-group">
          <label for="date-from-filter">Date From:</label>
          <input
            id="date-from-filter"
            v-model="filters.date_from"
            type="date"
            class="filter-input"
          />
        </div>

        <!-- Date To -->
        <div class="filter-group">
          <label for="date-to-filter">Date To:</label>
          <input
            id="date-to-filter"
            v-model="filters.date_to"
            type="date"
            class="filter-input"
          />
        </div>

        <!-- Identifier Type -->
        <div class="filter-group">
          <label for="identifier-type-filter">Identifier Type:</label>
          <select
            id="identifier-type-filter"
            v-model="filters.identifier_type"
            class="filter-select"
          >
            <option value="">All Types</option>
            <option value="NATIONAL_ID">National ID</option>
            <option value="PASSPORT">Passport</option>
            <option value="FAMILY_BOOK">Family Book</option>
          </select>
        </div>

        <!-- Sort By -->
        <div class="filter-group">
          <label for="sort-by-filter">Sort By:</label>
          <select
            id="sort-by-filter"
            v-model="filters.sort_by"
            class="filter-select"
          >
            <option value="merge_date">Merge Date</option>
            <option value="name">Name</option>
            <option value="lcic_id">LCIC ID</option>
          </select>
        </div>

        <!-- Sort Order -->
        <div class="filter-group">
          <label for="sort-order-filter">Order:</label>
          <select
            id="sort-order-filter"
            v-model="filters.sort_order"
            class="filter-select"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>

        <!-- Multiple IDs -->
        <div class="filter-group checkbox-group">
          <label class="checkbox-label">
            <input type="checkbox" v-model="filters.has_multiple_ids" />
            Only show customers with multiple identifiers
          </label>
        </div>
      </div>

      <div class="filters-actions">
        <button class="btn btn-primary" @click="applyFilters">
          <span class="icon">🔍</span>
          Apply Filters
        </button>
      </div>
    </section>

    <!-- Active Filters Display -->
    <section v-if="hasActiveFilters" class="active-filters">
      <div class="active-filters-header">
        <strong>Active Filters:</strong>
      </div>
      <div class="filter-tags">
        <span v-if="filters.search" class="filter-tag">
          Search: {{ filters.search }}
          <button @click="filters.search = ''; applyFilters()">×</button>
        </span>
        <span v-if="filters.performed_by" class="filter-tag">
          User: {{ filters.performed_by }}
          <button @click="filters.performed_by = ''; applyFilters()">×</button>
        </span>
        <span v-if="filters.date_from" class="filter-tag">
          From: {{ filters.date_from }}
          <button @click="filters.date_from = ''; applyFilters()">×</button>
        </span>
        <span v-if="filters.date_to" class="filter-tag">
          To: {{ filters.date_to }}
          <button @click="filters.date_to = ''; applyFilters()">×</button>
        </span>
        <span v-if="filters.identifier_type" class="filter-tag">
          Type: {{ filters.identifier_type }}
          <button @click="filters.identifier_type = ''; applyFilters()">×</button>
        </span>
        <span v-if="filters.has_multiple_ids" class="filter-tag">
          Multiple IDs
          <button @click="filters.has_multiple_ids = false; applyFilters()">×</button>
        </span>
      </div>
    </section>

    <!-- Loading State -->
    <div v-if="loading && customers.length === 0" class="loading-state">
      <div class="spinner"></div>
      <p>Loading merged customers...</p>
    </div>

    <!-- Results Section -->
    <section v-else-if="customers.length > 0" class="results-section">
      <div class="results-header">
        <h2>
          Showing {{ customers.length }} of {{ totalCount }} merged customers
        </h2>
      </div>

      <!-- Customers Grid -->
      <div class="customers-grid">
        <div
          v-for="customer in customers"
          :key="customer.lcic_id"
          class="customer-card"
          @click="viewCustomerDetails(customer.lcic_id)"
        >
          <div class="customer-card-header">
            <div class="customer-info">
              <h3 class="customer-name">{{ customer.name }}</h3>
              <p class="customer-lao-name">{{ customer.lao_name }}</p>
              <span class="lcic-badge">{{ customer.lcic_id }}</span>
            </div>
            <div class="merge-count-badge">
              {{ customer.total_merges }} {{ customer.total_merges === 1 ? 'merge' : 'merges' }}
            </div>
          </div>

          <div class="customer-card-body">
            <div class="info-row">
              <span class="label">Birth Date:</span>
              <span class="value">{{ formatDate(customer.birth_date) }}</span>
            </div>
            <div class="info-row">
              <span class="label">National ID:</span>
              <span class="value">{{ customer.national_id || 'N/A' }}</span>
            </div>
            <div class="info-row">
              <span class="label">Passport:</span>
              <span class="value">{{ customer.passport || 'N/A' }}</span>
            </div>
            <div class="info-row">
              <span class="label">Family Book:</span>
              <span class="value">{{ customer.family_book || 'N/A' }}</span>
            </div>
          </div>

          <div class="customer-card-footer">
            <div class="identifier-summary">
              <span class="id-count">
                <strong>{{ customer.total_identifiers }}</strong> identifiers
              </span>
              <span class="id-breakdown">
                ({{ customer.identifier_counts.national_ids }} IDs, 
                {{ customer.identifier_counts.passports }} Passports, 
                {{ customer.identifier_counts.family_books }} Books)
              </span>
            </div>
            
            <div v-if="customer.latest_merge" class="latest-merge-info">
              <small>
                Latest: {{ formatDateTime(customer.latest_merge.performed_at) }} by 
                <strong>{{ customer.latest_merge.performed_by }}</strong>
              </small>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="pagination">
        <button
          class="btn btn-secondary"
          :disabled="currentPage === 1 || loading"
          @click="goToPage(currentPage - 1)"
        >
          Previous
        </button>
        <span class="page-info">
          Page {{ currentPage }} of {{ totalPages }}
        </span>
        <button
          class="btn btn-secondary"
          :disabled="currentPage === totalPages || loading"
          @click="goToPage(currentPage + 1)"
        >
          Next
        </button>
      </div>
    </section>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <div class="empty-icon">✨</div>
      <h3>No Merged Customers Found</h3>
      <p v-if="hasActiveFilters">
        No customers match your current filters. Try adjusting the filters.
      </p>
      <p v-else>
        No merge operations have been performed yet.
      </p>
    </div>

    <!-- Customer Details Modal (reuse from previous component) -->
    <div v-if="showDetailsModal" class="modal-overlay" @click.self="closeDetailsModal">
      <div class="modal-content large-modal">
        <div class="modal-header">
          <h2>Customer Merge Details</h2>
          <button class="btn-close" @click="closeDetailsModal">×</button>
        </div>

        <div v-if="loadingDetails" class="modal-loading">
          <div class="spinner"></div>
          <p>Loading customer details...</p>
        </div>

        <div v-else-if="customerDetails" class="modal-body">
          <!-- Reuse the detailed view from customer-merge-page.vue -->
          <!-- Summary Grid -->
          <div class="summary-grid">
            <div class="summary-card">
              <div class="summary-icon">👤</div>
              <div class="summary-content">
                <div class="summary-label">Customer</div>
                <div class="summary-value">{{ customerDetails.customer.name }}</div>
              </div>
            </div>

            <div class="summary-card">
              <div class="summary-icon">🆔</div>
              <div class="summary-content">
                <div class="summary-label">LCIC ID</div>
                <div class="summary-value">{{ customerDetails.customer.lcic_id }}</div>
              </div>
            </div>

            <div class="summary-card">
              <div class="summary-icon">📋</div>
              <div class="summary-content">
                <div class="summary-label">Total Identifiers</div>
                <div class="summary-value">{{ customerDetails.summary.total_identifiers }}</div>
              </div>
            </div>

            <div class="summary-card merged">
              <div class="summary-icon">🔗</div>
              <div class="summary-content">
                <div class="summary-label">Total Merges</div>
                <div class="summary-value">{{ customerDetails.summary.total_merges }}</div>
              </div>
            </div>
          </div>

          <!-- Rest of customer details - identifiers, merge history, etc. -->
          <!-- Copy from customer-merge-page.vue -->
          <div class="details-section">
            <h3 class="section-title">All Linked Identifiers</h3>
            <!-- Show identifiers here -->
            <p v-if="customerDetails.summary.total_identifiers === 0">
              No identifiers found.
            </p>
          </div>

          <div class="details-section">
            <h3 class="section-title">Merge History</h3>
            <div v-if="customerDetails.merge_history.length > 0" class="merge-timeline">
              <div
                v-for="(merge, index) in customerDetails.merge_history"
                :key="merge.id"
                class="merge-event"
              >
                <div class="merge-event-icon">{{ index + 1 }}</div>
                <div class="merge-event-content">
                  <div class="merge-event-header">
                    <h4>{{ merge.action }}</h4>
                    <span class="merge-event-date">{{ formatDateTime(merge.performed_at) }}</span>
                  </div>
                  <div class="merge-event-details">
                    <div><strong>By:</strong> {{ merge.performed_by }}</div>
                    <div><strong>Reason:</strong> {{ merge.reason }}</div>
                    <div><strong>Records:</strong> {{ merge.merged_ind_sys_ids.join(', ') }}</div>
                  </div>
                </div>
              </div>
            </div>
            <p v-else>No merge history found.</p>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeDetailsModal">Close</button>
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
const api = useCustomerMergeApi()

// State
const customers = ref<any[]>([])
const statistics = ref<any>(null)
const loading = ref(false)
const currentPage = ref(1)
const totalPages = ref(1)
const totalCount = ref(0)

const showDetailsModal = ref(false)
const loadingDetails = ref(false)
const customerDetails = ref<any>(null)

// Filters
const filters = ref({
  search: '',
  performed_by: '',
  date_from: '',
  date_to: '',
  identifier_type: '',
  sort_by: 'merge_date',
  sort_order: 'desc',
  has_multiple_ids: false,
})

// Computed
const hasActiveFilters = computed(() => {
  return !!(
    filters.value.search ||
    filters.value.performed_by ||
    filters.value.date_from ||
    filters.value.date_to ||
    filters.value.identifier_type ||
    filters.value.has_multiple_ids
  )
})

// Helpers
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

const formatDateTime = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return dateString
  }
}

// Load data
const loadStatistics = async () => {
  try {
    const response = await api.getMergeStatistics()
    if (response.success) {
      statistics.value = response.statistics
    }
  } catch (error: any) {
    console.error('Error loading statistics:', error)
  }
}

const loadCustomers = async (page: number = 1) => {
  loading.value = true
  try {
    const params: any = {
      page,
      page_size: 20,
      ...filters.value,
    }

    // Remove empty filters
    Object.keys(params).forEach(key => {
      if (params[key] === '' || params[key] === null || params[key] === undefined) {
        delete params[key]
      }
    })

    const response = await api.listMergedCustomers(params)

    if (response.success) {
      customers.value = response.results
      totalCount.value = response.total_count
      currentPage.value = response.page
      totalPages.value = response.total_pages
    }
  } catch (error: any) {
    console.error('Error loading customers:', error)
  } finally {
    loading.value = false
  }
}

const refreshData = async () => {
  await Promise.all([loadStatistics(), loadCustomers(1)])
}

// Filter actions
const applyFilters = async () => {
  await loadCustomers(1)
}

const clearFilters = () => {
  filters.value = {
    search: '',
    performed_by: '',
    date_from: '',
    date_to: '',
    identifier_type: '',
    sort_by: 'merge_date',
    sort_order: 'desc',
    has_multiple_ids: false,
  }
  applyFilters()
}

const goToPage = async (page: number) => {
  await loadCustomers(page)
}

// Customer details
const viewCustomerDetails = async (lcicId: string) => {
  showDetailsModal.value = true
  loadingDetails.value = true
  customerDetails.value = null

  try {
    const response = await api.getCustomerMergeInfo(lcicId)
    if (response.success) {
      customerDetails.value = response
    }
  } catch (error: any) {
    console.error('Error loading customer details:', error)
  } finally {
    loadingDetails.value = false
  }
}

const closeDetailsModal = () => {
  showDetailsModal.value = false
  customerDetails.value = null
}

// Lifecycle
onMounted(async () => {
  await refreshData()
})
</script>

<style scoped>
/* Reuse styles from customer-merge-page.vue with additions */
.merged-customers-container {
  max-width: 1600px;
  margin: 0 auto;
  padding: 2rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #e5e7eb;
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
  background: #f3f4f6;
  border-radius: 12px;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

/* Filters Section */
.filters-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.filters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.filters-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.filter-input,
.filter-select {
  padding: 0.625rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
}

.checkbox-group {
  justify-content: center;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.filters-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

/* Active Filters */
.active-filters {
  background: #f9fafb;
  border-radius: 8px;
  padding: 1rem 1.5rem;
  margin-bottom: 2rem;
}

.active-filters-header {
  margin-bottom: 0.75rem;
  color: #374151;
}

.filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.filter-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 9999px;
  font-size: 0.875rem;
  color: #374151;
}

.filter-tag button {
  background: none;
  border: none;
  color: #6b7280;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.filter-tag button:hover {
  color: #ef4444;
}

/* Customers Grid */
.customers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.customer-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid #10b981;
}

.customer-card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.customer-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.customer-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.25rem 0;
}

.customer-lao-name {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 0.5rem 0;
}

.lcic-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: #dbeafe;
  color: #1e40af;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  font-family: monospace;
}

.merge-count-badge {
  padding: 0.25rem 0.75rem;
  background: #10b981;
  color: white;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.customer-card-body {
  margin-bottom: 1rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  font-size: 0.875rem;
}

.info-row .label {
  color: #6b7280;
  font-weight: 500;
}

.info-row .value {
  color: #111827;
}

.customer-card-footer {
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.identifier-summary {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.latest-merge-info {
  font-size: 0.75rem;
  color: #6b7280;
}

/* Common Styles */
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

.btn-link {
  background: none;
  color: #3b82f6;
  padding: 0;
}

.btn-link:hover {
  color: #2563eb;
  text-decoration: underline;
}

.icon {
  font-size: 1rem;
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

.spinner-small {
  display: inline-block;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
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

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.page-info {
  font-size: 0.875rem;
  color: #6b7280;
}

/* Modal Styles - Copy from customer-merge-page.vue */
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
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.large-modal {
  max-width: 1200px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h2 {
  font-size: 1.5rem;
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
  padding: 0;
}

.modal-loading {
  padding: 4rem 2rem;
  text-align: center;
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.summary-card {
  background: #f9fafb;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  gap: 1rem;
  align-items: center;
}

.summary-card.merged {
  background: #d1fae5;
}

.summary-icon {
  font-size: 2rem;
}

.summary-label {
  font-size: 0.75rem;
  color: #6b7280;
  text-transform: uppercase;
  font-weight: 600;
}

.summary-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
}

.details-section {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e5e7eb;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1rem 0;
}

.merge-timeline {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.merge-event {
  display: flex;
  gap: 1rem;
}

.merge-event-icon {
  width: 32px;
  height: 32px;
  background: #3b82f6;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
}

.merge-event-content {
  flex: 1;
  background: #f9fafb;
  padding: 1rem;
  border-radius: 8px;
}

.merge-event-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.merge-event-header h4 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
}

.merge-event-date {
  font-size: 0.813rem;
  color: #6b7280;
}

.merge-event-details {
  font-size: 0.875rem;
  color: #374151;
}

.merge-event-details div {
  margin-bottom: 0.25rem;
}

/* Responsive */
@media (max-width: 768px) {
  .merged-customers-container {
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

  .filters-grid {
    grid-template-columns: 1fr;
  }

  .customers-grid {
    grid-template-columns: 1fr;
  }
}
</style>