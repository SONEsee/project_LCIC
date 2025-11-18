<template>
  <div class="confirm-customer-page">
    <div class="page-header">
      <div>
        <h1>Confirm Bank Customers</h1>
        <p class="subtitle">Review and confirm customer registrations from all banks</p>
      </div>
      <div v-if="userData" class="user-info">
        <div class="user-avatar">
          <img v-if="userData.profile_image" :src="userData.profile_image" alt="Profile" />
          <span v-else>{{ userData.nameE?.charAt(0) || 'A' }}</span>
        </div>
        <div class="user-details">
          <div class="user-name">{{ userData.nameL || userData.nameE }}</div>
          <div class="user-role">Admin (GID: {{ userGID }})</div>
        </div>
      </div>
    </div>

    <!-- Filter Section -->
    <div class="filter-section">
      <div class="filter-header">
        <h3>🔍 Filters</h3>
        <button @click="toggleFilters" class="btn-toggle">
          {{ showFilters ? 'Hide' : 'Show' }} Filters
        </button>
      </div>

      <div v-if="showFilters" class="filter-grid">
        <div class="filter-group">
          <label for="filter-bank">Bank Code</label>
          <input 
            id="filter-bank" 
            v-model="filters.bnk_code" 
            type="text"
            placeholder="e.g., 17"
            @input="applyFilters"
          />
        </div>

        <div class="filter-group">
          <label for="filter-status">Status</label>
          <select id="filter-status" v-model="filters.status" @change="applyFilters">
            <option value="">All</option>
            <option value="MATCHED">Matched</option>
            <option value="MATCHED (BATCH)">Matched (Batch)</option>
            <option value="NEW RECORD">New Record</option>
          </select>
        </div>

        <div class="filter-group">
          <label for="filter-confirmed">Confirmation Status</label>
          <select id="filter-confirmed" v-model="filters.confirmed" @change="applyFilters">
            <option value="">All</option>
            <option value="true">Confirmed</option>
            <option value="false">Pending</option>
          </select>
        </div>

        <div class="filter-group">
          <label for="filter-date-from">Date From</label>
          <input 
            id="filter-date-from" 
            v-model="filters.date_from" 
            type="date"
            @change="applyFilters"
          />
        </div>

        <div class="filter-group">
          <label for="filter-date-to">Date To</label>
          <input 
            id="filter-date-to" 
            v-model="filters.date_to" 
            type="date"
            @change="applyFilters"
          />
        </div>

        <div class="filter-group">
          <label for="filter-search">Search</label>
          <input 
            id="filter-search" 
            v-model="filters.search" 
            type="text"
            placeholder="Customer ID, LCIC ID..."
            @input="debouncedSearch"
          />
        </div>
      </div>

      <div class="filter-actions">
        <button @click="resetFilters" class="btn-secondary">
          <span class="icon">🔄</span>
          Reset Filters
        </button>
        <button @click="loadCustomers" class="btn-secondary">
          <span class="icon">↻</span>
          Refresh Data
        </button>
      </div>
    </div>

    <!-- Statistics Summary -->
    <div class="statistics-section">
      <div class="stat-card total">
        <div class="stat-icon">📊</div>
        <div class="stat-content">
          <div class="stat-value">{{ statistics.total }}</div>
          <div class="stat-label">Total Registrations</div>
        </div>
      </div>

      <div class="stat-card pending">
        <div class="stat-icon">⏳</div>
        <div class="stat-content">
          <div class="stat-value">{{ statistics.pending }}</div>
          <div class="stat-label">Pending Confirmation</div>
        </div>
      </div>

      <div class="stat-card confirmed">
        <div class="stat-icon">✓</div>
        <div class="stat-content">
          <div class="stat-value">{{ statistics.confirmed }}</div>
          <div class="stat-label">Confirmed</div>
        </div>
      </div>

      <div class="stat-card selected">
        <div class="stat-icon">☑</div>
        <div class="stat-content">
          <div class="stat-value">{{ selectedCustomers.length }}</div>
          <div class="stat-label">Selected</div>
        </div>
      </div>
    </div>

    <!-- Bulk Actions -->
    <div v-if="selectedCustomers.length > 0" class="bulk-actions">
      <div class="bulk-info">
        <strong>{{ selectedCustomers.length }}</strong> customer(s) selected
      </div>
      <div class="bulk-buttons">
        <button @click="deselectAll" class="btn-secondary">
          Deselect All
        </button>
        <button @click="confirmSelected" :disabled="isConfirming" class="btn-primary">
          {{ isConfirming ? 'Confirming...' : 'Confirm Selected' }}
        </button>
      </div>
    </div>

    <!-- Customer List -->
    <div class="customer-list-section">
      <div class="list-header">
        <h3>Customer Registrations</h3>
        <div class="list-controls">
          <label class="checkbox-label">
            <input 
              type="checkbox" 
              :checked="isAllSelected"
              @change="toggleSelectAll"
            />
            Select All (Page)
          </label>
        </div>
      </div>

      <div v-if="isLoading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading customer data...</p>
      </div>

      <div v-else-if="filteredCustomers.length === 0" class="empty-state">
        <div class="empty-icon">📭</div>
        <p>No customers found</p>
        <button @click="resetFilters" class="btn-secondary">
          Clear Filters
        </button>
      </div>

      <div v-else class="customer-table-wrapper">
        <table class="customer-table">
          <thead>
            <tr>
              <th class="col-select">
                <input 
                  type="checkbox" 
                  :checked="isAllSelected"
                  @change="toggleSelectAll"
                />
              </th>
              <th>Customer ID</th>
              <th>Bank</th>
              <th>Branch</th>
              <th>LCIC ID</th>
              <th>Name</th>
              <th>Status</th>
              <th>Match %</th>
              <th>Uploaded By</th>
              <th>Uploaded At</th>
              <th>Document</th>
              <th>Confirmed</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="customer in paginatedCustomers" :key="customer.ind_sys_id"
              :class="{ 'row-selected': isSelected(customer.ind_sys_id!) }"
            >
              <td class="col-select">
                <input 
                  type="checkbox" 
                  :checked="isSelected(customer.ind_sys_id)"
                  @change="toggleSelect(customer.ind_sys_id)"
                  :disabled="customer.confirmed"
                />
              </td>
              <td>
                <code class="customer-id">{{ customer.customer_id }}</code>
              </td>
              <td>{{ customer.bnk_code }}</td>
              <td>{{ customer.bank_branch || '-' }}</td>
              <td>
                <code class="lcic-id">{{ customer.lcic_id }}</code>
              </td>
              <td>
                <div class="name-cell">
                  <div>{{ customer.full_name_en }} </div>
                  <div class="lao-name">{{ customer.full_name_la }}</div>
                </div>
              </td>
              <td>
                <span :class="['status-badge', getStatusClass(customer.status)]">
                  {{ customer.status }}
                </span>
              </td>
              <td>
                <div class="match-percent">
                  {{ customer.match_percent }}%
                  <div v-if="customer.match_percent > 0" class="progress-bar">
                    <div 
                      class="progress-fill" 
                      :style="{ width: customer.match_percent + '%' }"
                    ></div>
                  </div>
                </div>
              </td>
              <td>{{ customer.uploaded_by || '-' }}</td>
              <td>
                <div class="date-cell">
                  {{ formatDate(customer.uploaded_at) }}
                </div>
              </td>
              <td>
                <a 
                  v-if="customer.document_file" 
                  :href="customer.document_file" 
                  target="_blank"
                  class="btn-link"
                >
                  📄 View
                </a>
                <span v-else class="text-muted">No doc</span>
              </td>
              <td>
                <span v-if="customer.confirmed" class="confirmed-badge">
                  ✓ {{ formatDate(customer.confirmed_at) }}
                </span>
                <span v-else class="pending-badge">
                  ⏳ Pending
                </span>
              </td>
              <td>
                <div class="action-buttons">
                  <button 
                    v-if="!customer.confirmed"
                    @click="confirmSingle(customer.ind_sys_id!)"
                    class="btn-action confirm"
                    title="Confirm"
                  >
                    ✓
                  </button>
                  <button 
                    @click="viewDetails(customer)"
                    class="btn-action view"
                    title="View Details"
                  >
                    👁
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="pagination">
        <button 
          @click="currentPage--" 
          :disabled="currentPage === 1"
          class="btn-pagination"
        >
          ← Previous
        </button>
        
        <div class="page-info">
          Page {{ currentPage }} of {{ totalPages }}
          ({{ filteredCustomers.length }} total)
        </div>

        <button 
          @click="currentPage++" 
          :disabled="currentPage === totalPages"
          class="btn-pagination"
        >
          Next →
        </button>
      </div>
    </div>

    <!-- Detail Modal -->
    <div v-if="selectedDetail" class="modal-overlay" @click="closeDetailModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Customer Details</h3>
          <button @click="closeDetailModal" class="btn-close">✕</button>
        </div>

        <div class="modal-body">
          <div class="detail-grid">
            <div class="detail-section">
              <h4>Basic Information</h4>
              <div class="detail-row">
                <span class="detail-label">Customer ID:</span>
                <span class="detail-value"><code>{{ selectedDetail.customer_id }}</code></span>
              </div>
              <div class="detail-row">
                <span class="detail-label">LCIC ID:</span>
                <span class="detail-value"><code>{{ selectedDetail.lcic_id }}</code></span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Bank Code:</span>
                <span class="detail-value">{{ selectedDetail.bnk_code }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Branch:</span>
                <span class="detail-value">{{ selectedDetail.branch_id_code }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Status:</span>
                <span :class="['status-badge', getStatusClass(selectedDetail.status)]">
                  {{ selectedDetail.status }}
                </span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Match Percent:</span>
                <span class="detail-value">{{ selectedDetail.match_percent }}%</span>
              </div>
            </div>

            <div class="detail-section">
              <h4>Personal Information</h4>
              <div class="detail-row">
                <span class="detail-label">Name (EN):</span>
                <span class="detail-value">{{ selectedDetail.ind_name }} {{ selectedDetail.ind_surname }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Name (LAO):</span>
                <span class="detail-value">{{ selectedDetail.ind_lao_name }} {{ selectedDetail.ind_lao_surname }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">National ID:</span>
                <span class="detail-value">{{ selectedDetail.ind_national_id || '-' }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Passport:</span>
                <span class="detail-value">{{ selectedDetail.ind_passport || '-' }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Birth Date:</span>
                <span class="detail-value">{{ formatDate(selectedDetail.ind_birth_date) }}</span>
              </div>
            </div>

            <div class="detail-section">
              <h4>Upload Information</h4>
              <div class="detail-row">
                <span class="detail-label">Uploaded By:</span>
                <span class="detail-value">{{ selectedDetail.uploaded_by }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Uploaded At:</span>
                <span class="detail-value">{{ formatDate(selectedDetail.uploaded_at) }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Confirmed:</span>
                <span v-if="selectedDetail.confirmed" class="confirmed-badge">
                  ✓ Yes ({{ formatDate(selectedDetail.confirmed_at) }})
                </span>
                <span v-else class="pending-badge">⏳ Pending</span>
              </div>
              <div v-if="selectedDetail.confirmed_by" class="detail-row">
                <span class="detail-label">Confirmed By:</span>
                <span class="detail-value">{{ selectedDetail.confirmed_by }}</span>
              </div>
            </div>

            <div v-if="selectedDetail.field_scores" class="detail-section full-width">
              <h4>Field Matching Scores</h4>
              <div class="score-grid">
                <div 
                  v-for="(score, field) in selectedDetail.field_scores" 
                  :key="field"
                  class="score-item"
                >
                  <span class="score-label">{{ formatFieldName(field) }}</span>
                  <div class="score-bar">
                    <div 
                      class="score-fill" 
                      :style="{ 
                        width: score + '%',
                        background: getScoreColor(score)
                      }"
                    ></div>
                  </div>
                  <span class="score-value">{{ score }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="closeDetailModal" class="btn-secondary">
            Close
          </button>
          <button 
            v-if="!selectedDetail.confirmed"
            @click="confirmSingle(selectedDetail.id!)"
            class="btn-primary"
          >
            Confirm Customer
          </button>
        </div>
      </div>
    </div>

    <!-- Toast Notifications -->
    <div v-if="notification" :class="['notification', notification.type]">
      {{ notification.message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UploadedCustomer, FilterOptions } from '~/types/customer';
// Composables
const { getAllCustomers, confirmCustomers } = useCustomerRegistration();

// Check if user is admin
const userGID = ref<number>(0);
const isAdmin = ref(false);
const userData = ref<any>(null);

onMounted(async () => {
  // Get user data from localStorage
  const userDataStr = localStorage.getItem('user_data');
  
  if (!userDataStr) {
    await navigateTo('/login');
    return;
  }
  
  try {
    userData.value = JSON.parse(userDataStr);
    userGID.value = userData.value?.GID?.GID || 0;
    
    // Check if user is admin (GID 1-5 are admin, 6-7 are member)
    isAdmin.value = userGID.value >= 1 && userGID.value <= 5;
    
    if (!isAdmin.value) {
      await navigateTo('/unauthorized');
      return;
    }
    
    await loadCustomers();
  } catch (error) {
    console.error('Failed to parse user data:', error);
    await navigateTo('/login');
  }
});

// State
const customers = ref<UploadedCustomer[]>([]);
const filteredCustomers = ref<UploadedCustomer[]>([]);
const selectedCustomers = ref<number[]>([]);
const isLoading = ref(false);
const isConfirming = ref(false);
const showFilters = ref(true);
const selectedDetail = ref<UploadedCustomer | null>(null);

// Filters
const filters = ref<FilterOptions>({
  bnk_code: '',
  status: '',
  date_from: '',
  date_to: '',
  confirmed: '',
  search: ''
});

// Pagination
const currentPage = ref(1);
const itemsPerPage = ref(20);

// Notification
const notification = ref<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

// Computed
const statistics = computed(() => {
  return {
    total: customers.value.length,
    pending: customers.value.filter(c => !c.confirmed).length,
    confirmed: customers.value.filter(c => c.confirmed).length
  };
});

const totalPages = computed(() => {
  return Math.ceil(filteredCustomers.value.length / itemsPerPage.value);
});

const paginatedCustomers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredCustomers.value.slice(start, end);
});

const isAllSelected = computed(() => {
  const unconfirmedOnPage = paginatedCustomers.value.filter(c => !c.confirmed);
  if (unconfirmedOnPage.length === 0) return false;
  return unconfirmedOnPage.every(c => selectedCustomers.value.includes(c.id!));
});

// Methods
const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  notification.value = { message, type };
  setTimeout(() => {
    notification.value = null;
  }, 5000);
};

const loadCustomers = async () => {
  isLoading.value = true;
  
  try {
    customers.value = await getAllCustomers();
    applyFilters();
    showNotification('Customer data loaded successfully', 'success');
  } catch (error: any) {
    showNotification(error.message || 'Failed to load customers', 'error');
  } finally {
    isLoading.value = false;
  }
};

const applyFilters = () => {
  let result = [...customers.value];
  
  // Filter by bank code
  if (filters.value.bnk_code) {
    result = result.filter(c => 
      c.bnk_code?.toLowerCase().includes(filters.value.bnk_code!.toLowerCase())
    );
  }
  
  // Filter by status
  if (filters.value.status) {
    result = result.filter(c => c.status === filters.value.status);
  }
  
  // Filter by confirmation status
  if (filters.value.confirmed !== '') {
    const isConfirmed = filters.value.confirmed === 'true';
    result = result.filter(c => c.confirmed === isConfirmed);
  }
  
  // Filter by date range
  if (filters.value.date_from) {
    const fromDate = new Date(filters.value.date_from);
    result = result.filter(c => {
      if (!c.uploaded_at) return false;
      return new Date(c.uploaded_at) >= fromDate;
    });
  }
  
  if (filters.value.date_to) {
    const toDate = new Date(filters.value.date_to);
    toDate.setHours(23, 59, 59);
    result = result.filter(c => {
      if (!c.uploaded_at) return false;
      return new Date(c.uploaded_at) <= toDate;
    });
  }
  
  // Search filter
  if (filters.value.search) {
    const searchTerm = filters.value.search.toLowerCase();
    result = result.filter(c => 
      c.customer_id?.toLowerCase().includes(searchTerm) ||
      c.lcic_id?.toLowerCase().includes(searchTerm) ||
      c.ind_name?.toLowerCase().includes(searchTerm) ||
      c.ind_surname?.toLowerCase().includes(searchTerm) ||
      c.uploaded_by?.toLowerCase().includes(searchTerm)
    );
  }
  
  filteredCustomers.value = result;
  currentPage.value = 1; // Reset to first page
};

const resetFilters = () => {
  filters.value = {
    bnk_code: '',
    status: '',
    date_from: '',
    date_to: '',
    confirmed: '',
    search: ''
  };
  applyFilters();
};

const toggleFilters = () => {
  showFilters.value = !showFilters.value;
};

// Debounced search
let searchTimeout: NodeJS.Timeout;
const debouncedSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    applyFilters();
  }, 300);
};

const isSelected = (ind_sys_id: number): boolean => {
  return selectedCustomers.value.includes(ind_sys_id)
}

const toggleSelect = (ind_sys_id: number) => {
  if (selectedCustomers.value.includes(ind_sys_id)) {
    selectedCustomers.value = selectedCustomers.value.filter(id => id !== ind_sys_id)
  } else {
    selectedCustomers.value.push(ind_sys_id)
  }
}

const toggleSelectAll = () => {
  const unconfirmedOnPage = paginatedCustomers.value
    .filter(c => !c.confirmed)
    .map(c => c.ind_sys_id!)

  if (isAllSelected.value) {
    selectedCustomers.value = selectedCustomers.value.filter(
      id => !unconfirmedOnPage.includes(id)
    )
  } else {
    unconfirmedOnPage.forEach(id => {
      if (!selectedCustomers.value.includes(id)) {
        selectedCustomers.value.push(id)
      }
    })
  }
}

const deselectAll = () => {
  selectedCustomers.value = [];
};
const confirmSelected = async () => {
  if (selectedCustomers.value.length === 0) {
    showNotification('Please select customers', 'error')
    return
  }

  isConfirming.value = true

  try {
    console.log('Confirming IDs:', selectedCustomers.value)
    
    await confirmCustomers(selectedCustomers.value)
    
    showNotification(`Confirmed ${selectedCustomers.value.length} customers!`, 'success')
    selectedCustomers.value = []
    await loadCustomers()
    
  } catch (error: any) {
    console.error('Confirmation error:', error)
    
    // Handle specific error cases
    if (error?.status === 409 || error?.statusCode === 409) {
      showNotification('Some records are already confirmed. Refreshing...', 'info')
      await loadCustomers()
      selectedCustomers.value = []
    } else if (error?.status === 404 || error?.statusCode === 404) {
      showNotification('No pending records found to confirm', 'warning')
      await loadCustomers()
    } else {
      showNotification(error.message || 'Failed to confirm customers', 'error')
    }
  } finally {
    isConfirming.value = false
  }
}
const confirmSingle = async (id: number) => {
  isConfirming.value = true
  
  try {
    await confirmCustomers([id])
    showNotification('Customer confirmed successfully', 'success')
    
    await loadCustomers()
    if (selectedDetail.value?.ind_sys_id === id) {
      closeDetailModal()
    }
  } catch (error: any) {
    console.error('Single confirmation error:', error)
    
    if (error?.status === 409 || error?.statusCode === 409) {
      showNotification('This record is already confirmed', 'info')
      await loadCustomers()
    } else {
      showNotification(error.message || 'Failed to confirm customer', 'error')
    }
  } finally {
    isConfirming.value = false
  }
}

// Detail Modal
const viewDetails = (customer: UploadedCustomer) => {
  selectedDetail.value = customer;
};

const closeDetailModal = () => {
  selectedDetail.value = null;
};

// Utilities
const getStatusClass = (status: string): string => {
  if (status === 'MATCHED' || status === 'MATCHED (BATCH)') return 'matched';
  if (status === 'NEW RECORD') return 'new';
  return 'default';
};

const formatDate = (dateStr?: string): string => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatFieldName = (field: string): string => {
  return field
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
};

const getScoreColor = (score: number): string => {
  if (score >= 90) return '#10b981';
  if (score >= 70) return '#f59e0b';
  return '#ef4444';
};
</script>

<style scoped>
.confirm-customer-page {
  max-width: 1600px;
  margin: 0 auto;
  padding: 2rem;
}

.page-header {
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-header h1 {
  font-size: 2rem;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #666;
  font-size: 1rem;
}

/* User Info */
.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: white;
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1.25rem;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.user-name {
  font-weight: 600;
  color: #1a1a1a;
  font-size: 0.95rem;
}

.user-role {
  font-size: 0.8rem;
  color: #6b7280;
}

/* Filter Section */
.filter-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.filter-header h3 {
  font-size: 1.25rem;
  color: #1a1a1a;
}

.btn-toggle {
  padding: 0.5rem 1rem;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.3s;
}

.btn-toggle:hover {
  background: #e5e7eb;
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.filter-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #374151;
  font-weight: 500;
  font-size: 0.875rem;
}

.filter-group input,
.filter-group select {
  width: 100%;
  padding: 0.625rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  transition: border-color 0.3s;
}

.filter-group input:focus,
.filter-group select:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.filter-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

/* Statistics */
.statistics-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.stat-icon {
  font-size: 2.5rem;
  opacity: 0.8;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
}

.stat-card.total { border-left: 4px solid #6366f1; }
.stat-card.pending { border-left: 4px solid #f59e0b; }
.stat-card.confirmed { border-left: 4px solid #10b981; }
.stat-card.selected { border-left: 4px solid #8b5cf6; }

/* Bulk Actions */
.bulk-actions {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.bulk-info {
  font-size: 1rem;
}

.bulk-buttons {
  display: flex;
  gap: 1rem;
}

/* Customer List */
.customer-list-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e5e7eb;
}

.list-header h3 {
  font-size: 1.25rem;
  color: #1a1a1a;
}

.list-controls {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  color: #374151;
}

.checkbox-label input[type="checkbox"] {
  cursor: pointer;
  width: 18px;
  height: 18px;
}

/* Table */
.customer-table-wrapper {
  overflow-x: auto;
}

.customer-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.customer-table thead {
  background: #f9fafb;
  position: sticky;
  top: 0;
  z-index: 10;
}

.customer-table th {
  padding: 0.875rem 0.75rem;
  text-align: left;
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  border-bottom: 2px solid #e5e7eb;
}

.customer-table td {
  padding: 1rem 0.75rem;
  border-bottom: 1px solid #e5e7eb;
  vertical-align: middle;
}

.customer-table tbody tr {
  transition: background-color 0.2s;
}

.customer-table tbody tr:hover {
  background: #f9fafb;
}

.customer-table tbody tr.row-selected {
  background: #eff6ff;
}

.col-select {
  width: 40px;
  text-align: center;
}

.col-select input[type="checkbox"] {
  cursor: pointer;
  width: 18px;
  height: 18px;
}

code.customer-id,
code.lcic-id {
  background: #f3f4f6;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 0.8rem;
}

.name-cell {
  min-width: 150px;
}

.lao-name {
  font-size: 0.8rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

.match-percent {
  min-width: 80px;
}

.progress-bar {
  width: 60px;
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  margin-top: 0.25rem;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #059669);
  transition: width 0.3s;
}

.date-cell {
  min-width: 120px;
  font-size: 0.8rem;
}

/* Status Badges */
.status-badge {
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  display: inline-block;
  white-space: nowrap;
}

.status-badge.matched {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.new {
  background: #dbeafe;
  color: #1e40af;
}

.confirmed-badge {
  color: #059669;
  font-weight: 500;
  font-size: 0.8rem;
}

.pending-badge {
  color: #d97706;
  font-weight: 500;
  font-size: 0.8rem;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn-action {
  padding: 0.4rem 0.6rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.3s;
}

.btn-action.confirm {
  background: #d1fae5;
  color: #065f46;
}

.btn-action.confirm:hover {
  background: #a7f3d0;
}

.btn-action.view {
  background: #e0e7ff;
  color: #3730a3;
}

.btn-action.view:hover {
  background: #c7d2fe;
}

/* Buttons */
.btn-primary {
  padding: 0.75rem 1.5rem;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary:hover:not(:disabled) {
  background: #1d4ed8;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.btn-primary:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.btn-secondary {
  padding: 0.75rem 1.5rem;
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-secondary:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.btn-link {
  color: #2563eb;
  text-decoration: none;
  font-size: 0.875rem;
}

.btn-link:hover {
  text-decoration: underline;
}

.text-muted {
  color: #9ca3af;
  font-size: 0.8rem;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.btn-pagination {
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.3s;
}

.btn-pagination:hover:not(:disabled) {
  background: #f9fafb;
  border-color: #2563eb;
  color: #2563eb;
}

.btn-pagination:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  color: #6b7280;
  font-size: 0.875rem;
}

/* Loading & Empty States */
.loading-state {
  text-align: center;
  padding: 4rem 2rem;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #e5e7eb;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #6b7280;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
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
  max-width: 900px;
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

.modal-header h3 {
  font-size: 1.5rem;
  color: #1a1a1a;
}

.btn-close {
  width: 32px;
  height: 32px;
  border: none;
  background: #f3f4f6;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.25rem;
  color: #6b7280;
  transition: all 0.3s;
}

.btn-close:hover {
  background: #e5e7eb;
  color: #374151;
}

.modal-body {
  padding: 1.5rem;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.detail-section {
  background: #f9fafb;
  padding: 1rem;
  border-radius: 8px;
}

.detail-section.full-width {
  grid-column: 1 / -1;
}

.detail-section h4 {
  font-size: 1rem;
  color: #1a1a1a;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e5e7eb;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e5e7eb;
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
  color: #1a1a1a;
  font-size: 0.875rem;
}

.score-grid {
  display: grid;
  gap: 0.75rem;
}

.score-item {
  display: grid;
  grid-template-columns: 150px 1fr 60px;
  align-items: center;
  gap: 1rem;
}

.score-label {
  font-size: 0.875rem;
  color: #374151;
}

.score-bar {
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.score-fill {
  height: 100%;
  transition: width 0.3s;
}

.score-value {
  text-align: right;
  font-weight: 600;
  font-size: 0.875rem;
}

.modal-footer {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

/* Notifications */
.notification {
  position: fixed;
  top: 2rem;
  right: 2rem;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 2000;
  animation: slideIn 0.3s ease-out;
}

.notification.success {
  background: #d1fae5;
  color: #065f46;
  border-left: 4px solid #059669;
}

.notification.error {
  background: #fee2e2;
  color: #991b1b;
  border-left: 4px solid #dc2626;
}

.notification.info {
  background: #dbeafe;
  color: #1e40af;
  border-left: 4px solid #2563eb;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .user-info {
    width: 100%;
  }

  .filter-grid {
    grid-template-columns: 1fr;
  }

  .statistics-section {
    grid-template-columns: 1fr;
  }

  .bulk-actions {
    flex-direction: column;
    gap: 1rem;
  }

  .customer-table {
    font-size: 0.75rem;
  }

  .customer-table th,
  .customer-table td {
    padding: 0.5rem 0.25rem;
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }

  .score-item {
    grid-template-columns: 100px 1fr 50px;
    gap: 0.5rem;
  }
}
</style>