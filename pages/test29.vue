<template>
  <div class="container">
    <div class="header">
      <h1> Unmerge ລູກຄ້າ</h1>
      <p class="subtitle">ເເຍກລູກຄ້າທີ່ຊໍ້າ</p>
    </div>

    <!-- Statistics Card -->
    <div class="stats-card" v-if="customerGroups.length > 0">
      <div class="stat-item">
        <span class="stat-label">Total Groups:</span>
        <span class="stat-value">{{ totalGroups }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Selected for Unmerge:</span>
        <span class="stat-value">{{ selectedCount }}</span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Loading customer data...</p>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="error-message">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
      </svg>
      <span>{{ error }}</span>
      <button @click="error = null" class="close-btn">×</button>
    </div>

    <!-- Success Message -->
    <div v-if="successMessage" class="success-message">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
      </svg>
      <span>{{ successMessage }}</span>
      <button @click="successMessage = ''" class="close-btn">×</button>
    </div>

    <!-- Customer Groups -->
    <div v-if="!loading && customerGroups.length > 0" class="groups-container">
      <div v-for="group in customerGroups" :key="group.lcic_id" class="group-card">
        <div class="group-header">
          <div class="group-title">
            <h3>LCIC ID: {{ group.lcic_id }}</h3>
            <span class="badge">{{ group.count }} Customers</span>
          </div>
          <button 
            @click="selectAllInGroup(group)" 
            class="btn-secondary"
            :disabled="group.customers.every(c => c.selected)"
          >
            {{ group.customers.every(c => c.selected) ? 'All Selected' : 'Select All' }}
          </button>
        </div>

        <div class="customers-table">
          <table>
            <thead>
              <tr>
                <th width="50">Select</th>
                <th width="80">Master</th>
                <th>Name</th>
                <th>Customer ID</th>
                <th>Bank Code</th>
                <th>National ID</th>
                <th>Birth Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="customer in group.customers" 
                :key="customer.ind_sys_id"
                :class="{ 'selected-row': customer.selected, 'master-row': customer.is_master }"
              >
                <td>
                  <input 
                    type="checkbox" 
                    v-model="customer.selected"
                    :disabled="customer.is_master && group.customers.filter(c => !c.selected).length === 1"
                    class="checkbox"
                  />
                </td>
                <td>
                  <span v-if="customer.is_master" class="master-badge">Master</span>
                </td>
                <td class="customer-name">{{ customer.display_name }}</td>
                <td>{{ customer.customerid }}</td>
                <td>{{ customer.bnk_code }}</td>
                <td>{{ customer.ind_national_id }}</td>
                <td>{{ customer.ind_birth_date }}</td>
                <td>
                  <span class="status-badge" :class="`status-${customer.mm_status?.toLowerCase()}`">
                    {{ customer.mm_status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && customerGroups.length === 0" class="empty-state">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
      </svg>
      <h3>No Duplicate Groups Found</h3>
      <p>All customers have unique LCIC IDs</p>
    </div>

    <!-- Actions Bar -->
    <div v-if="customerGroups.length > 0" class="actions-bar">
      <div class="pagination">
        <button 
          @click="changePage(currentPage - 1)" 
          :disabled="currentPage === 1"
          class="btn-pagination"
        >
          Previous
        </button>
        <span class="page-info">
          Page {{ currentPage }} of {{ totalPages }}
        </span>
        <button 
          @click="changePage(currentPage + 1)" 
          :disabled="currentPage === totalPages"
          class="btn-pagination"
        >
          Next
        </button>
      </div>

      <div class="action-buttons">
        <button 
          @click="clearSelection" 
          class="btn-secondary"
          :disabled="selectedCount === 0"
        >
          Clear Selection
        </button>
        <button 
          @click="confirmUnmerge" 
          class="btn-primary"
          :disabled="selectedCount === 0 || loading"
        >
          Unmerge Selected ({{ selectedCount }})
        </button>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div v-if="showConfirmModal" class="modal-overlay" @click="showConfirmModal = false">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>Confirm Unmerge</h3>
          <button @click="showConfirmModal = false" class="close-btn">×</button>
        </div>
        <div class="modal-body">
          <p>You are about to unmerge <strong>{{ selectedCount }}</strong> customer(s) from their LCIC groups.</p>
          <p>This action will:</p>
          <ul>
            <li>Remove the LCIC ID from selected customers</li>
            <li>Mark them as "UNMERGED" status</li>
            <li>Create audit log entries</li>
          </ul>
          <p class="warning">⚠️ This action cannot be undone automatically.</p>
        </div>
        <div class="modal-footer">
          <button @click="showConfirmModal = false" class="btn-secondary">Cancel</button>
          <button @click="performUnmerge" class="btn-danger" :disabled="loading">
            {{ loading ? 'Processing...' : 'Confirm Unmerge' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCustomerUnmerge } from '~/composables/useCustomerUnmerge'
definePageMeta({
  middleware: 'auth',
  layout: 'backend',
})
// Define types
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

// Composable
const { loading, error, fetchGroupedCustomers, unmergeCustomers } = useCustomerUnmerge()

// State
const customerGroups = ref<CustomerGroup[]>([])
const currentPage = ref(1)
const pageSize = ref(50)
const totalGroups = ref(0)
const totalPages = ref(0)
const showConfirmModal = ref(false)
const successMessage = ref('')

// Computed
const selectedCount = computed(() => {
  return customerGroups.value.reduce((total, group) => {
    return total + group.customers.filter(c => c.selected).length
  }, 0)
})

// Methods
const loadCustomers = async () => {
  try {
    const response = await fetchGroupedCustomers(currentPage.value, pageSize.value)
    
    // Add selected property to each customer
    customerGroups.value = response.results.map(group => ({
      ...group,
      customers: group.customers.map(customer => ({
        ...customer,
        selected: false
      }))
    }))
    
    totalGroups.value = response.total
    totalPages.value = response.total_pages
  } catch (err) {
    console.error('Failed to load customers:', err)
  }
}

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    loadCustomers()
  }
}

const selectAllInGroup = (group: CustomerGroup) => {
  const allSelected = group.customers.every(c => c.selected)
  group.customers.forEach(customer => {
    customer.selected = !allSelected
  })
}

const clearSelection = () => {
  customerGroups.value.forEach(group => {
    group.customers.forEach(customer => {
      customer.selected = false
    })
  })
}

const confirmUnmerge = () => {
  if (selectedCount.value === 0) {
    error.value = 'Please select at least one customer to unmerge'
    return
  }
  showConfirmModal.value = true
}

const performUnmerge = async () => {
  try {
    // Build unmerge list
    const unmergeList = customerGroups.value
      .map(group => ({
        lcic_id: group.lcic_id,
        ind_sys_ids: group.customers
          .filter(c => c.selected)
          .map(c => c.ind_sys_id)
      }))
      .filter(item => item.ind_sys_ids.length > 0)

    if (unmergeList.length === 0) {
      error.value = 'No customers selected for unmerge'
      return
    }

    // Perform unmerge
    const response = await unmergeCustomers({ unmerge_list: unmergeList })
    
    // Success handling
    showConfirmModal.value = false
    successMessage.value = response.message || 'Customers unmerged successfully'
    
    // Reload data
    await loadCustomers()
    
    // Clear success message after 5 seconds
    setTimeout(() => {
      successMessage.value = ''
    }, 5000)
    
  } catch (err) {
    showConfirmModal.value = false
    console.error('Unmerge failed:', err)
  }
}

// Lifecycle
onMounted(() => {
  loadCustomers()
})
</script>

<style scoped>
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

.header {
  margin-bottom: 2rem;
}

.header h1 {
  font-size: 2rem;
  font-weight: 600;
  color: #1a202c;
  margin: 0 0 0.5rem 0;
}

.subtitle {
  color: #718096;
  font-size: 1rem;
  margin: 0;
}

.stats-card {
  display: flex;
  gap: 2rem;
  background: #f7fafc;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  border: 1px solid #e2e8f0;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-label {
  color: #718096;
  font-size: 0.875rem;
  font-weight: 500;
}

.stat-value {
  color: #2d3748;
  font-size: 1.5rem;
  font-weight: 600;
}

.loading-container {
  text-align: center;
  padding: 4rem 2rem;
}

.spinner {
  width: 40px;
  height: 40px;
  margin: 0 auto 1rem;
  border: 4px solid #e2e8f0;
  border-top-color: #3182ce;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-message,
.success-message {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-size: 0.9375rem;
}

.error-message {
  background: #fed7d7;
  color: #c53030;
  border: 1px solid #fc8181;
}

.success-message {
  background: #c6f6d5;
  color: #22543d;
  border: 1px solid #68d391;
}

.close-btn {
  margin-left: auto;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: inherit;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
}

.close-btn:hover {
  opacity: 1;
}

.groups-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.group-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}

.group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  background: #f7fafc;
  border-bottom: 1px solid #e2e8f0;
}

.group-title {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.group-title h3 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #2d3748;
}

.badge {
  background: #edf2f7;
  color: #4a5568;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
}

.customers-table {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #f7fafc;
}

th {
  padding: 0.75rem 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.875rem;
  color: #4a5568;
  border-bottom: 1px solid #e2e8f0;
}

td {
  padding: 1rem;
  border-bottom: 1px solid #f7fafc;
  font-size: 0.9375rem;
  color: #2d3748;
}

tbody tr:hover {
  background: #f7fafc;
}

.selected-row {
  background: #ebf8ff !important;
}

.master-row {
  background: #fef5e7;
}

.checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.checkbox:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.master-badge {
  background: #fbbf24;
  color: #78350f;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.customer-name {
  font-weight: 500;
}

.status-badge {
  padding: 0.25rem 0.625rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-active {
  background: #c6f6d5;
  color: #22543d;
}

.status-unmerged {
  background: #fed7d7;
  color: #c53030;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #718096;
}

.empty-state svg {
  margin: 0 auto 1rem;
  opacity: 0.5;
}

.empty-state h3 {
  margin: 0 0 0.5rem 0;
  color: #4a5568;
}

.actions-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  position: sticky;
  bottom: 1rem;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
}

.pagination {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.page-info {
  color: #4a5568;
  font-size: 0.9375rem;
  font-weight: 500;
}

.action-buttons {
  display: flex;
  gap: 0.75rem;
}

.btn-primary,
.btn-secondary,
.btn-danger,
.btn-pagination {
  padding: 0.625rem 1.25rem;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-primary {
  background: #3182ce;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #2c5aa0;
}

.btn-secondary {
  background: #edf2f7;
  color: #4a5568;
}

.btn-secondary:hover:not(:disabled) {
  background: #e2e8f0;
}

.btn-danger {
  background: #e53e3e;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #c53030;
}

.btn-pagination {
  background: #edf2f7;
  color: #4a5568;
  padding: 0.5rem 1rem;
}

.btn-pagination:hover:not(:disabled) {
  background: #e2e8f0;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

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
}

.modal {
  background: white;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
}

.modal-body {
  padding: 1.5rem;
}

.modal-body p {
  margin: 0 0 1rem 0;
  color: #4a5568;
  line-height: 1.6;
}

.modal-body ul {
  margin: 0 0 1rem 1.5rem;
  color: #4a5568;
}

.modal-body li {
  margin-bottom: 0.5rem;
}

.warning {
  color: #c53030;
  font-weight: 500;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }

  .actions-bar {
    flex-direction: column;
    gap: 1rem;
  }

  .pagination,
  .action-buttons {
    width: 100%;
    justify-content: center;
  }

  table {
    font-size: 0.875rem;
  }

  th, td {
    padding: 0.5rem;
  }
}
</style>