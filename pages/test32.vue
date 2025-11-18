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
        <button @click="showFilters = !showFilters" class="btn-toggle">
          {{ showFilters ? 'Hide' : 'Show' }} Filters
        </button>
      </div>

      <div v-if="showFilters" class="filter-grid">
        <div class="filter-group">
          <label>Bank Code</label>
          <input v-model="filters.bnk_code" type="text" placeholder="e.g., 17" @input="applyFilters" />
        </div>

        <div class="filter-group">
          <label>Status</label>
          <select v-model="filters.status" @change="applyFilters">
            <option value="">All</option>
            <option value="MATCHED">Matched</option>
            <option value="NEW RECORD">New Record</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        <div class="filter-group">
          <label>Confirmation Status</label>
          <select v-model="filters.confirmed" @change="applyFilters">
            <option value="">All</option>
            <option value="true">Confirmed</option>
            <option value="false">Pending</option>
          </select>
        </div>

        <div class="filter-group">
          <label>Search</label>
          <input v-model="filters.search" type="text" placeholder="Name, ID..." @input="applyFilters" />
        </div>
      </div>

      <div class="filter-actions">
        <button @click="resetFilters" class="btn-secondary">🔄 Reset</button>
        <button @click="loadCustomers" class="btn-secondary">↻ Refresh</button>
      </div>
    </div>

    <!-- Statistics -->
    <div class="statistics-section">
      <div class="stat-card total">
        <div class="stat-icon">📊</div>
        <div class="stat-content">
          <div class="stat-value">{{ statistics.total }}</div>
          <div class="stat-label">Total</div>
        </div>
      </div>
      <div class="stat-card pending">
        <div class="stat-icon">⏳</div>
        <div class="stat-content">
          <div class="stat-value">{{ statistics.pending }}</div>
          <div class="stat-label">Pending</div>
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
        <button @click="selectedCustomers = []" class="btn-secondary">Deselect All</button>
        <button @click="confirmSelected" :disabled="isConfirming" class="btn-primary">
          {{ isConfirming ? 'Confirming...' : 'Confirm Selected' }}
        </button>
      </div>
    </div>

    <!-- Customer List -->
    <div class="customer-list-section">
      <div class="list-header">
        <h3>Customer Registrations</h3>
      </div>

      <div v-if="isLoading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading...</p>
      </div>

      <div v-else-if="filteredCustomers.length === 0" class="empty-state">
        <div class="empty-icon">📭</div>
        <p>No customers found</p>
      </div>

      <div v-else class="customer-table-wrapper">
        <table class="customer-table">
          <thead>
            <tr>
              <th class="col-select">
                <input type="checkbox" @change="toggleSelectAll" :checked="isAllSelected" />
              </th>
              <th>Customer ID</th>
              <th>Bank</th>
              <th>LCIC ID</th>
              <th>Name</th>
              <th>Status</th>
              <th>Uploaded At</th>
              <th>Confirmed</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="customer in paginatedCustomers" :key="customer.ind_sys_id">
              <td class="col-select">
                <input 
                  type="checkbox" 
                  :checked="selectedCustomers.includes(customer.ind_sys_id)"
                  @change="toggleSelect(customer.ind_sys_id)"
                  :disabled="customer.confirmed"
                />
              </td>
              <td><code>{{ customer.customer_id || '-' }}</code></td>
              <td>{{ customer.bnk_code }}</td>
              <td><code>{{ customer.lcic_id || 'Pending' }}</code></td>
              <td>
                <div>{{ customer.ind_name }} {{ customer.ind_surname }}</div>
                <div class="lao-name">{{ customer.ind_lao_name }} {{ customer.ind_lao_surname }}</div>
              </td>
              <td>
                <span :class="['status-badge', getStatusClass(customer.status)]">
                  {{ customer.status || 'pending' }}
                </span>
              </td>
              <td>{{ formatDate(customer.uploaded_at || customer.insert_date) }}</td>
              <td>
                <span v-if="customer.confirmed" class="confirmed-badge">✓ Yes</span>
                <span v-else class="pending-badge">⏳ Pending</span>
              </td>
              <td>
                <button @click="viewDetails(customer)" class="btn-action" title="View Details">👁</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="pagination">
        <button @click="currentPage--" :disabled="currentPage === 1" class="btn-pagination">← Previous</button>
        <div class="page-info">Page {{ currentPage }} of {{ totalPages }}</div>
        <button @click="currentPage++" :disabled="currentPage === totalPages" class="btn-pagination">Next →</button>
      </div>
    </div>

    <!-- Detail Modal - FIXED SIDE BY SIDE -->
    <div v-if="selectedDetail" class="modal-overlay" @click="closeDetailModal">
      <div class="modal-content-wide" @click.stop>
        <div class="modal-header">
          <h3>Customer Verification Details</h3>
          <button @click="closeDetailModal" class="btn-close">✕</button>
        </div>

        <div class="modal-body-split">
          <!-- LEFT: Customer Info -->
          <div class="info-column">
            <div class="info-block">
              <h4>📋 Basic Information</h4>
              <div class="info-row">
                <span class="label">Customer ID:</span>
                <code>{{ selectedDetail.customer_id || '-' }}</code>
              </div>
              <div class="info-row">
                <span class="label">LCIC ID:</span>
                <code class="highlight">{{ selectedDetail.lcic_id || 'Pending' }}</code>
              </div>
              <div class="info-row">
                <span class="label">Bank Code:</span>
                <span>{{ selectedDetail.bnk_code }}</span>
              </div>
              <div class="info-row">
                <span class="label">Branch:</span>
                <span>{{ selectedDetail.bank_branch || '-' }}</span>
              </div>
              <div class="info-row">
                <span class="label">Status:</span>
                <span :class="['status-badge', getStatusClass(selectedDetail.status)]">
                  {{ selectedDetail.status || 'pending' }}
                </span>
              </div>
            </div>

            <div class="info-block">
              <h4>👤 Personal Information</h4>
              <div class="info-row">
                <span class="label">Name (EN):</span>
                <strong>{{ selectedDetail.ind_name }} {{ selectedDetail.ind_surname }}</strong>
              </div>
              <div class="info-row">
                <span class="label">Name (Lao):</span>
                <strong class="lao-text">{{ selectedDetail.ind_lao_name }} {{ selectedDetail.ind_lao_surname }}</strong>
              </div>
              <div class="info-row">
                <span class="label">Birth Date:</span>
                <span>{{ formatDate(selectedDetail.ind_birth_date) || '-' }}</span>
              </div>
            </div>

            <div class="info-block">
              <h4>🆔 Identity Documents</h4>
              <div v-if="selectedDetail.ind_national_id" class="info-row">
                <span class="label">National ID:</span>
                <code>{{ selectedDetail.ind_national_id }}</code>
              </div>
              <div v-if="selectedDetail.ind_passport" class="info-row">
                <span class="label">Passport:</span>
                <code>{{ selectedDetail.ind_passport }}</code>
              </div>
              <div v-if="selectedDetail.ind_familybook" class="info-row">
                <span class="label">Family Book:</span>
                <code>{{ selectedDetail.ind_familybook }}</code>
              </div>
            </div>

            <div class="info-block">
              <h4>📤 Upload Information</h4>
              <div class="info-row">
                <span class="label">Uploaded By:</span>
                <span>{{ selectedDetail.uploaded_by || selectedDetail.insert_by }}</span>
              </div>
              <div class="info-row">
                <span class="label">Uploaded At:</span>
                <span>{{ formatDate(selectedDetail.uploaded_at || selectedDetail.insert_date) }}</span>
              </div>
              <div class="info-row">
                <span class="label">Confirmed:</span>
                <span v-if="selectedDetail.confirmed" class="confirmed-badge">✓ Yes</span>
                <span v-else class="pending-badge">⏳ Pending</span>
              </div>
            </div>
          </div>

          <!-- RIGHT: Document Viewer -->
          <div class="document-column">
            <h4>📄 Verification Document</h4>
            
            <div v-if="selectedDetail.document_file" class="document-viewer">
              <!-- PDF Viewer -->
              <div v-if="isPDF(selectedDetail.document_file)">
                <div class="pdf-info">
                  <span>📄 PDF Document</span>
                  <a :href="selectedDetail.document_file" target="_blank" class="btn-link">Open in New Tab</a>
                </div>
                <iframe :src="selectedDetail.document_file" class="pdf-frame"></iframe>
              </div>

              <!-- Image Viewer -->
              <div v-else-if="isImage(selectedDetail.document_file)" class="image-viewer">
                <div class="zoom-controls">
                  <button @click="zoomIn" class="btn-zoom">🔍+</button>
                  <button @click="zoomOut" class="btn-zoom">🔍-</button>
                  <button @click="resetZoom" class="btn-zoom">↻</button>
                  <a :href="selectedDetail.document_file" target="_blank" class="btn-zoom">⛶</a>
                </div>
                <div class="image-container">
                  <img 
                    :src="selectedDetail.document_file" 
                    alt="Document"
                    :style="{ transform: `scale(${imageZoom})` }"
                    @click="toggleZoom"
                  />
                </div>
              </div>

              <!-- Download Button -->
              <div class="doc-footer">
                <a :href="selectedDetail.document_file" download class="btn-secondary">💾 Download</a>
              </div>
            </div>

            <div v-else class="no-document">
              <div class="empty-icon">📭</div>
              <p>No document attached</p>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="closeDetailModal" class="btn-secondary">Close</button>
          <button v-if="!selectedDetail.confirmed" @click="confirmSingle(selectedDetail.ind_sys_id)" class="btn-primary">
            ✓ Confirm Customer
          </button>
        </div>
      </div>
    </div>

    <!-- Notification -->
    <div v-if="notification" :class="['notification', notification.type]">
      {{ notification.message }}
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
  layout: 'backend',
});

const { getAllCustomers, confirmCustomers } = useCustomerRegistration();

// State
const userData = ref<any>(null);
const userGID = ref<number>(0);
const customers = ref<any[]>([]);
const filteredCustomers = ref<any[]>([]);
const selectedCustomers = ref<number[]>([]);
const isLoading = ref(false);
const isConfirming = ref(false);
const showFilters = ref(true);
const selectedDetail = ref<any>(null);
const imageZoom = ref(1);

const filters = ref({
  bnk_code: '',
  status: '',
  confirmed: '',
  search: ''
});

const currentPage = ref(1);
const itemsPerPage = ref(20);
const notification = ref<any>(null);

// Computed
const statistics = computed(() => ({
  total: customers.value.length,
  pending: customers.value.filter(c => !c.confirmed && !c.is_confirmed).length,
  confirmed: customers.value.filter(c => c.confirmed || c.is_confirmed).length
}));

const totalPages = computed(() => Math.ceil(filteredCustomers.value.length / itemsPerPage.value));

const paginatedCustomers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filteredCustomers.value.slice(start, start + itemsPerPage.value);
});

const isAllSelected = computed(() => {
  const unconfirmed = paginatedCustomers.value.filter(c => !c.confirmed && !c.is_confirmed);
  if (unconfirmed.length === 0) return false;
  return unconfirmed.every(c => selectedCustomers.value.includes(c.ind_sys_id));
});

// Methods
const showNotification = (message: string, type: string = 'info') => {
  notification.value = { message, type };
  setTimeout(() => notification.value = null, 5000);
};

const loadCustomers = async () => {
  isLoading.value = true;
  try {
    const data = await getAllCustomers();
    customers.value = data;
    applyFilters();
    showNotification('Data loaded', 'success');
  } catch (error: any) {
    showNotification(error.message || 'Failed to load', 'error');
  } finally {
    isLoading.value = false;
  }
};

const applyFilters = () => {
  let result = [...customers.value];
  
  if (filters.value.bnk_code) {
    result = result.filter(c => c.bnk_code?.includes(filters.value.bnk_code));
  }
  if (filters.value.status) {
    result = result.filter(c => c.status === filters.value.status);
  }
  if (filters.value.confirmed !== '') {
    const isConfirmed = filters.value.confirmed === 'true';
    result = result.filter(c => (c.confirmed || c.is_confirmed) === isConfirmed);
  }
  if (filters.value.search) {
    const term = filters.value.search.toLowerCase();
    result = result.filter(c => 
      c.customer_id?.toLowerCase().includes(term) ||
      c.ind_name?.toLowerCase().includes(term) ||
      c.ind_surname?.toLowerCase().includes(term)
    );
  }
  
  filteredCustomers.value = result;
  currentPage.value = 1;
};

const resetFilters = () => {
  filters.value = { bnk_code: '', status: '', confirmed: '', search: '' };
  applyFilters();
};

const toggleSelect = (id: number) => {
  const index = selectedCustomers.value.indexOf(id);
  if (index > -1) {
    selectedCustomers.value.splice(index, 1);
  } else {
    selectedCustomers.value.push(id);
  }
};

const toggleSelectAll = () => {
  const unconfirmed = paginatedCustomers.value
    .filter(c => !c.confirmed && !c.is_confirmed)
    .map(c => c.ind_sys_id);
  
  if (isAllSelected.value) {
    selectedCustomers.value = selectedCustomers.value.filter(id => !unconfirmed.includes(id));
  } else {
    unconfirmed.forEach(id => {
      if (!selectedCustomers.value.includes(id)) {
        selectedCustomers.value.push(id);
      }
    });
  }
};

const confirmSelected = async () => {
  if (selectedCustomers.value.length === 0) return;
  isConfirming.value = true;
  try {
    await confirmCustomers(selectedCustomers.value);
    showNotification(`Confirmed ${selectedCustomers.value.length} customers!`, 'success');
    selectedCustomers.value = [];
    await loadCustomers();
  } catch (error: any) {
    showNotification(error.message || 'Failed to confirm', 'error');
  } finally {
    isConfirming.value = false;
  }
};

const confirmSingle = async (id: number) => {
  isConfirming.value = true;
  try {
    await confirmCustomers([id]);
    showNotification('Customer confirmed!', 'success');
    await loadCustomers();
    closeDetailModal();
  } catch (error: any) {
    showNotification(error.message || 'Failed', 'error');
  } finally {
    isConfirming.value = false;
  }
};

const viewDetails = (customer: any) => {
  selectedDetail.value = customer;
  imageZoom.value = 1;
};

const closeDetailModal = () => {
  selectedDetail.value = null;
  imageZoom.value = 1;
};

const isPDF = (url: string) => url?.toLowerCase().includes('.pdf');
const isImage = (url: string) => {
  const exts = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  return exts.some(ext => url?.toLowerCase().includes(ext));
};

const zoomIn = () => { if (imageZoom.value < 3) imageZoom.value += 0.25; };
const zoomOut = () => { if (imageZoom.value > 0.5) imageZoom.value -= 0.25; };
const resetZoom = () => { imageZoom.value = 1; };
const toggleZoom = () => { imageZoom.value = imageZoom.value === 1 ? 2 : 1; };

const getStatusClass = (status: string) => {
  if (!status) return 'default';
  const s = status.toLowerCase();
  if (s.includes('match')) return 'matched';
  if (s.includes('new')) return 'new';
  return 'default';
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

// Init
onMounted(async () => {
  const userDataStr = localStorage.getItem('user_data');
  if (!userDataStr) {
    await navigateTo('/login');
    return;
  }
  
  try {
    userData.value = JSON.parse(userDataStr);
    userGID.value = userData.value?.GID?.GID || 0;
    
    if (userGID.value < 1 || userGID.value > 5) {
      await navigateTo('/unauthorized');
      return;
    }
    
    await loadCustomers();
  } catch (error) {
    await navigateTo('/login');
  }
});
</script>

<style scoped>
* { box-sizing: border-box; }

.confirm-customer-page {
  max-width: 1600px;
  margin: 0 auto;
  padding: 2rem;
  background: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 2rem;
  color: #1a1a1a;
  margin: 0 0 0.5rem 0;
}

.subtitle { color: #666; font-size: 0.95rem; margin: 0; }

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: white;
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #3b82f6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1.25rem;
  overflow: hidden;
}

.user-avatar img { width: 100%; height: 100%; object-fit: cover; }
.user-name { font-weight: 600; color: #1a1a1a; }
.user-role { font-size: 0.8rem; color: #666; }

/* Filters */
.filter-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.filter-header h3 { font-size: 1.25rem; margin: 0; }

.btn-toggle {
  padding: 0.5rem 1rem;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
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
}

.filter-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
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
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.stat-icon { font-size: 2.5rem; }
.stat-value { font-size: 2rem; font-weight: 700; }
.stat-label { font-size: 0.875rem; color: #6b7280; }

.stat-card.total { border-left: 4px solid #6366f1; }
.stat-card.pending { border-left: 4px solid #f59e0b; }
.stat-card.confirmed { border-left: 4px solid #10b981; }
.stat-card.selected { border-left: 4px solid #8b5cf6; }

/* Bulk Actions */
.bulk-actions {
  background: #3b82f6;
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.bulk-buttons { display: flex; gap: 1rem; }

/* Customer List */
.customer-list-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.list-header {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e5e7eb;
}

.list-header h3 { font-size: 1.25rem; margin: 0; }

.customer-table-wrapper { overflow-x: auto; }

.customer-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.customer-table thead {
  background: #f9fafb;
}

.customer-table th {
  padding: 0.875rem 0.75rem;
  text-align: left;
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
  font-size: 0.75rem;
  border-bottom: 2px solid #e5e7eb;
}

.customer-table td {
  padding: 1rem 0.75rem;
  border-bottom: 1px solid #e5e7eb;
}

.customer-table tbody tr:hover {
  background: #f9fafb;
}

.col-select { width: 40px; text-align: center; }

code {
  background: #f3f4f6;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.85rem;
}

.lao-name {
  font-size: 0.8rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

.status-badge {
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  display: inline-block;
}

.status-badge.matched {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.new {
  background: #dbeafe;
  color: #1e40af;
}

.status-badge.default {
  background: #fef3c7;
  color: #92400e;
}

.confirmed-badge {
  color: #059669;
  font-weight: 500;
}

.pending-badge {
  color: #d97706;
  font-weight: 500;
}

.btn-action {
  padding: 0.4rem 0.6rem;
  background: #e0e7ff;
  color: #3730a3;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.btn-action:hover {
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
}

.btn-primary:hover:not(:disabled) {
  background: #1d4ed8;
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
}

.btn-secondary:hover {
  background: #f9fafb;
}

.btn-link {
  color: #2563eb;
  text-decoration: none;
  font-size: 0.875rem;
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
}

.btn-pagination:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  color: #6b7280;
  font-size: 0.875rem;
}

/* Loading & Empty */
.loading-state, .empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #6b7280;
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

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

/* Modal - FIXED SIDE BY SIDE */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content-wide {
  background: white;
  border-radius: 16px;
  max-width: 1400px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px rgba(0,0,0,0.3);
  overflow: hidden;
}

.modal-header {
  padding: 1.5rem 2rem;
  background: #3b82f6;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  font-size: 1.5rem;
  margin: 0;
  font-weight: 600;
}

.btn-close {
  width: 36px;
  height: 36px;
  border: none;
  background: rgba(255,255,255,0.2);
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.25rem;
  color: white;
}

.btn-close:hover {
  background: rgba(255,255,255,0.3);
}

/* FIXED SPLIT LAYOUT */
.modal-body-split {
  display: grid;
  grid-template-columns: 500px 1fr;
  flex: 1;
  overflow: hidden;
}

.info-column {
  padding: 2rem;
  overflow-y: auto;
  background: #f9fafb;
  border-right: 2px solid #e5e7eb;
}

.document-column {
  padding: 2rem;
  overflow-y: auto;
  background: white;
  display: flex;
  flex-direction: column;
}

.document-column h4 {
  margin: 0 0 1.5rem 0;
  font-size: 1.1rem;
  color: #1a1a1a;
}

/* Info Blocks */
.info-block {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.info-block h4 {
  font-size: 1rem;
  color: #1a1a1a;
  margin: 0 0 1rem 0;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #e5e7eb;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f3f4f6;
  gap: 1rem;
}

.info-row:last-child {
  border-bottom: none;
}

.info-row .label {
  font-size: 0.8rem;
  color: #6b7280;
  font-weight: 600;
  min-width: 120px;
}

.info-row code.highlight {
  background: #3b82f6;
  color: white;
  padding: 0.375rem 0.75rem;
  font-weight: 600;
}

.lao-text {
  font-size: 1.05rem;
  line-height: 1.5;
}

/* Document Viewer */
.document-viewer {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.pdf-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.pdf-frame {
  flex: 1;
  width: 100%;
  min-height: 500px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
}

.image-viewer {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.zoom-controls {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 8px;
}

.btn-zoom {
  padding: 0.5rem 0.75rem;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  text-decoration: none;
  color: #374151;
}

.btn-zoom:hover {
  background: #f3f4f6;
}

.image-container {
  flex: 1;
  overflow: auto;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  background: #f9fafb;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-container img {
  max-width: 100%;
  height: auto;
  cursor: zoom-in;
  transition: transform 0.3s;
}

.doc-footer {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
  text-align: center;
}

.no-document {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
}

.modal-footer {
  padding: 1.5rem 2rem;
  background: #f9fafb;
  border-top: 2px solid #e5e7eb;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

/* Notification */
.notification {
  position: fixed;
  top: 2rem;
  right: 2rem;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  z-index: 2000;
  animation: slideIn 0.3s;
}

.notification.success {
  background: #d1fae5;
  color: #065f46;
}

.notification.error {
  background: #fee2e2;
  color: #991b1b;
}

@keyframes slideIn {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

/* Responsive */
@media (max-width: 1024px) {
  .modal-body-split {
    grid-template-columns: 1fr;
  }
  
  .info-column {
    border-right: none;
    border-bottom: 2px solid #e5e7eb;
    max-height: 50vh;
  }
}
</style>