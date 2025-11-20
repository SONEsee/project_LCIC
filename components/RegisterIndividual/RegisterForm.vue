<template>
  <div class="confirm-customer-page">
    <div class="page-header">
      <div>
        <h1>ຢືນຢັນລູກຄ້າທະນາຄານ</h1>
        <p class="subtitle">ກວດສອບ ແລະ ຢືນຢັນການລົງທະບຽນລູກຄ້າ</p>
      </div>
      <div class="header-actions">
        <button @click="navigateTo('/register/register-customer')" class="btn-register">
          <span class="icon">📝</span>
          ລົງທະບຽນລູກຄ້າ
        </button>
        <div v-if="userData" class="user-info">
          <div class="user-avatar">
            <img v-if="userData.profile_image" :src="userData.profile_image" alt="Profile" />
            <span v-else>{{ userData.nameE?.charAt(0) || 'A' }}</span>
          </div>
          <div class="user-details">
            <div class="user-name">{{ userData.nameL || userData.nameE }}</div>
            <div class="user-role">{{ isAdmin ? 'ຜູ້ບໍລິຫານ' : 'ສະມາຊິກ' }} ({{ userBankCode }})</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filter Section -->
    <div class="filter-section">
      <div class="filter-header">
        <h3>🔍 ຕົວກອງ</h3>
        <button @click="showFilters = !showFilters" class="btn-toggle">
          {{ showFilters ? 'ເຊື່ອງ' : 'ສະແດງ' }}
        </button>
      </div>

      <div v-if="showFilters" class="filter-grid">
        <!-- Admin only: Bank Code filter -->
        <div v-if="isAdmin" class="filter-group">
          <label>ລະຫັດທະນາຄານ</label>
          <input v-model="filters.bnk_code" type="text" placeholder="ເຊັ່ນ: 01" @input="applyFilters" />
        </div>

        <div class="filter-group">
          <label>ສະຖານະ</label>
          <select v-model="filters.status" @change="applyFilters">
            <option value="">ທັງໝົດ</option>
            <option value="MATCHED">ກົງກັນ</option>
            <option value="NEW RECORD">ບັນທຶກໃໝ່</option>
            <option value="pending">ລໍຖ້າ</option>
          </select>
        </div>

        <div class="filter-group">
          <label>ການຢືນຢັນ</label>
          <select v-model="filters.confirmed" @change="applyFilters">
            <option value="">ທັງໝົດ</option>
            <option value="true">ຢືນຢັນແລ້ວ</option>
            <option value="false">ລໍຖ້າຢືນຢັນ</option>
          </select>
        </div>

        <div class="filter-group">
          <label>ຈາກວັນທີ</label>
          <input type="date" v-model="filters.dateFrom" @change="applyFilters" />
        </div>

        <div class="filter-group">
          <label>ຫາວັນທີ</label>
          <input type="date" v-model="filters.dateTo" @change="applyFilters" />
        </div>

        <div class="filter-group">
          <label>ຄົ້ນຫາ</label>
          <input v-model="filters.search" type="text" placeholder="ຊື່, ລະຫັດ..." @input="applyFilters" />
        </div>
      </div>

      <div class="filter-actions">
        <button @click="resetFilters" class="btn-secondary">🔄 ລ້າງ</button>
        <button @click="loadCustomers" class="btn-secondary">↻ ໂຫຼດຄືນ</button>
      </div>
    </div>

    <!-- Statistics -->
    <div class="statistics-section">
      <div class="stat-card total">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24"><path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M9,17H7V10H9V17M13,17H11V7H13V17M17,17H15V13H17V17Z"/></svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ statistics.total }}</div>
        </div>
      </div>
      <div class="stat-card pending">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24"><path d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z"/></svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ statistics.pending }}</div>
        </div>
      </div>
      <div class="stat-card confirmed">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24"><path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ statistics.confirmed }}</div>
        </div>
      </div>
      <div v-if="isAdmin" class="stat-card selected">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24"><path d="M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1Z"/></svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ selectedCustomers.length }}</div>
        </div>
      </div>
    </div>

    <!-- Bulk Actions - Admin Only -->
    <div v-if="isAdmin && selectedCustomers.length > 0" class="bulk-actions">
      <div class="bulk-info">
        <strong>{{ selectedCustomers.length }}</strong> ເລືອກແລ້ວ
      </div>
      <div class="bulk-buttons">
        <button @click="selectedCustomers = []" class="btn-secondary">ຍົກເລີກ</button>
        <button @click="confirmSelected" :disabled="isConfirming" class="btn-primary">
          {{ isConfirming ? 'ກຳລັງຢືນຢັນ...' : 'ຢືນຢັນທີ່ເລືອກ' }}
        </button>
      </div>
    </div>

    <!-- Customer List -->
    <div class="customer-list-section">
      <div class="list-header">
        <h3>ລາຍການລູກຄ້າ</h3>
      </div>

      <div v-if="isLoading" class="loading-state">
        <div class="spinner"></div>
        <p>ກຳລັງໂຫຼດ...</p>
      </div>

      <div v-else-if="filteredCustomers.length === 0" class="empty-state">
        <div class="empty-icon">📭</div>
        <p>ບໍ່ມີຂໍ້ມູນ</p>
      </div>

      <div v-else class="customer-table-wrapper">
        <table class="customer-table">
          <thead>
            <tr>
              <th v-if="isAdmin" class="col-select">
                <input type="checkbox" @change="toggleSelectAll" :checked="isAllSelected" />
              </th>
              <th>ລະຫັດລູກຄ້າ</th>
              <th>ທະນາຄານ</th>
              <th>LCIC ID</th>
              <th>ຊື່</th>
              <th>ກຸ່ມ</th>
              <th>ສະຖານະ</th>
              <th>ວັນທີສົ່ງ</th>
              <th>ຢືນຢັນ</th>
              <th>ການດຳເນີນການ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="customer in paginatedCustomers" :key="customer.ind_sys_id">
              <td v-if="isAdmin" class="col-select">
                <input 
                  type="checkbox" 
                  :checked="selectedCustomers.includes(customer.ind_sys_id)"
                  @change="toggleSelect(customer.ind_sys_id)"
                  :disabled="customer.confirmed"
                />
              </td>
              
              <!-- Customer ID - Editable -->
              <td>
                <div v-if="editingCustomerId === customer.ind_sys_id" class="edit-inline">
                  <input 
                    v-model="newCustomerId"
                    type="text"
                    placeholder="ລະຫັດ"
                    class="edit-input"
                    @keyup.enter="saveCustomerId(customer)"
                    @keyup.esc="cancelEdit"
                  />
                  <button @click="saveCustomerId(customer)" class="btn-save">✓</button>
                  <button @click="cancelEdit" class="btn-cancel">✕</button>
                </div>
                <div v-else class="editable-cell">
                  <code>{{ customer.customer_id || '-' }}</code>
                  <button 
                    v-if="canEditCustomer(customer) && customer.confirmed && !customer.customer_id"
                    @click="startEditCustomerId(customer)"
                    class="btn-edit"
                    title="ແກ້ໄຂ"
                  >
                    ✏️
                  </button>
                </div>
              </td>

              <td>{{ customer.bnk_code }}</td>
              <td><code>{{ customer.lcic_id || '-' }}</code></td>
              <td>
                <div>{{ customer.ind_name }} {{ customer.ind_surname }}</div>
                <div class="lao-name">{{ customer.ind_lao_name }} {{ customer.ind_lao_surname }}</div>
              </td>

              <!-- Segment - Editable -->
              <td>
                <div v-if="editingSegment === customer.ind_sys_id" class="edit-inline">
                  <select 
                    v-model="newSegment"
                    class="edit-select"
                    @keyup.enter="saveSegment(customer)"
                    @keyup.esc="cancelEdit"
                  >
                    <option value="A1">A1</option>
                    <option value="A3">A3</option>
                  </select>
                  <button @click="saveSegment(customer)" class="btn-save">✓</button>
                  <button @click="cancelEdit" class="btn-cancel">✕</button>
                </div>
                <div v-else class="editable-cell">
                  <span class="segment-badge">{{ customer.segment || '-' }}</span>
                  <button 
                    v-if="canEditCustomer(customer)"
                    @click="startEditSegment(customer)"
                    class="btn-edit"
                    title="ແກ້ໄຂ"
                  >
                    ✏️
                  </button>
                </div>
              </td>

              <td>
                <span :class="['status-badge', getStatusClass(customer.status)]">
                  {{ customer.status || 'ລໍຖ້າ' }}
                </span>
              </td>
              <td>{{ formatDate(customer.uploaded_at || customer.insert_date) }}</td>
              <td>
                <span v-if="customer.confirmed" class="confirmed-badge">✓ ແລ້ວ</span>
                <span v-else class="pending-badge">⏳ ລໍຖ້າ</span>
              </td>
              <td>
                <button @click="viewDetails(customer)" class="btn-action" title="ລາຍລະອຽດ">👁</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="pagination">
        <button @click="currentPage--" :disabled="currentPage === 1" class="btn-pagination">← ກ່ອນໜ້າ</button>
        <div class="page-info">ໜ້າ {{ currentPage }} / {{ totalPages }}</div>
        <button @click="currentPage++" :disabled="currentPage === totalPages" class="btn-pagination">ຖັດໄປ →</button>
      </div>
    </div>

    <!-- Detail Modal -->
    <div v-if="selectedDetail" class="modal-overlay" @click="closeDetailModal">
      <div class="modal-content-wide" @click.stop>
        <div class="modal-header">
          <h3>ລາຍລະອຽດລູກຄ້າ</h3>
          <button @click="closeDetailModal" class="btn-close">✕</button>
        </div>

        <div class="modal-body-split">
          <div class="info-column">
            <div class="info-block">
              <h4>📋 ຂໍ້ມູນພື້ນຖານ</h4>
              <div class="info-row">
                <span class="label">ລະຫັດລູກຄ້າ:</span>
                <code>{{ selectedDetail.customer_id || '-' }}</code>
              </div>
              <div class="info-row">
                <span class="label">LCIC ID:</span>
                <code class="highlight">{{ selectedDetail.lcic_id || '-' }}</code>
              </div>
              <div class="info-row">
                <span class="label">ທະນາຄານ:</span>
                <span>{{ selectedDetail.bnk_code }}</span>
              </div>
              <div class="info-row">
                <span class="label">ສາຂາ:</span>
                <span>{{ selectedDetail.bank_branch || '-' }}</span>
              </div>
              <div class="info-row">
                <span class="label">ກຸ່ມ:</span>
                <span>{{ selectedDetail.segment || '-' }}</span>
              </div>
              <div class="info-row">
                <span class="label">ສະຖານະ:</span>
                <span :class="['status-badge', getStatusClass(selectedDetail.status)]">
                  {{ selectedDetail.status || 'ລໍຖ້າ' }}
                </span>
              </div>
            </div>

            <div class="info-block">
              <h4>👤 ຂໍ້ມູນສ່ວນຕົວ</h4>
              <div class="info-row">
                <span class="label">ຊື່ (EN):</span>
                <strong>{{ selectedDetail.ind_name }} {{ selectedDetail.ind_surname }}</strong>
              </div>
              <div class="info-row">
                <span class="label">ຊື່ (ລາວ):</span>
                <strong class="lao-text">{{ selectedDetail.ind_lao_name }} {{ selectedDetail.ind_lao_surname }}</strong>
              </div>
              <div class="info-row">
                <span class="label">ວັນເກີດ:</span>
                <span>{{ formatDate(selectedDetail.ind_birth_date) || '-' }}</span>
              </div>
            </div>

            <div class="info-block">
              <h4>🆔 ເອກະສານຢືນຢັນ</h4>
              <div v-if="selectedDetail.ind_national_id" class="info-row">
                <span class="label">ບັດປະຈຳຕົວ:</span>
                <code>{{ selectedDetail.ind_national_id }}</code>
              </div>
              <div v-if="selectedDetail.ind_passport" class="info-row">
                <span class="label">ໜັງສືຜ່ານແດນ:</span>
                <code>{{ selectedDetail.ind_passport }}</code>
              </div>
              <div v-if="selectedDetail.ind_familybook" class="info-row">
                <span class="label">ສຳມະໂນຄົວ:</span>
                <code>{{ selectedDetail.ind_familybook }}</code>
              </div>
            </div>

            <div class="info-block">
              <h4>📤 ຂໍ້ມູນການສົ່ງ</h4>
              <div class="info-row">
                <span class="label">ສົ່ງໂດຍ:</span>
                <span>{{ selectedDetail.uploaded_by || selectedDetail.insert_by }}</span>
              </div>
              <div class="info-row">
                <span class="label">ສົ່ງເມື່ອ:</span>
                <span>{{ formatDate(selectedDetail.uploaded_at || selectedDetail.insert_date) }}</span>
              </div>
              <div class="info-row">
                <span class="label">ຢືນຢັນ:</span>
                <span v-if="selectedDetail.confirmed" class="confirmed-badge">✓ ແລ້ວ</span>
                <span v-else class="pending-badge">⏳ ລໍຖ້າ</span>
              </div>
            </div>
          </div>

          <div class="document-column">
            <h4>📄 ເອກະສານຢັ້ງຢືນ</h4>
            
            <div v-if="selectedDetail.document_file" class="document-viewer">
              <div v-if="isPDF(selectedDetail.document_file)">
                <div class="pdf-info">
                  <span>📄 PDF</span>
                  <a :href="selectedDetail.document_file" target="_blank" class="btn-link">ເປີດແທັບໃໝ່</a>
                </div>
                <iframe :src="selectedDetail.document_file" class="pdf-frame"></iframe>
              </div>

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

              <div class="doc-footer">
                <a :href="selectedDetail.document_file" download class="btn-secondary">💾 ດາວໂຫຼດ</a>
              </div>
            </div>

            <div v-else class="no-document">
              <div class="empty-icon">📭</div>
              <p>ບໍ່ມີເອກະສານ</p>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="closeDetailModal" class="btn-secondary">ປິດ</button>
          <button 
            v-if="isAdmin && !selectedDetail.confirmed" 
            @click="confirmSingle(selectedDetail.ind_sys_id)" 
            class="btn-primary"
          >
            ✓ ຢືນຢັນລູກຄ້າ
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

const { getAllCustomers, confirmCustomers, updateCustomerID, updateCustomerSegment } = useCustomerRegistration();

// State
const userData = ref<any>(null);
const userGID = ref<number>(0);
const userBankCode = ref<string>('');
const isAdmin = ref(false);
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
  dateFrom: '',
  dateTo: '',
  search: ''
});

const currentPage = ref(1);
const itemsPerPage = ref(20);
const notification = ref<any>(null);

// Editing state
const editingCustomerId = ref<number | null>(null);
const newCustomerId = ref('');
const editingSegment = ref<number | null>(null);
const newSegment = ref('');

// Computed
const statistics = computed(() => ({
  total: filteredCustomers.value.length,
  pending: filteredCustomers.value.filter(c => !c.confirmed).length,
  confirmed: filteredCustomers.value.filter(c => c.confirmed).length
}));

const totalPages = computed(() => Math.ceil(filteredCustomers.value.length / itemsPerPage.value));

const paginatedCustomers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filteredCustomers.value.slice(start, start + itemsPerPage.value);
});

const isAllSelected = computed(() => {
  const unconfirmed = paginatedCustomers.value.filter(c => !c.confirmed);
  if (unconfirmed.length === 0) return false;
  return unconfirmed.every(c => selectedCustomers.value.includes(c.ind_sys_id));
});

// Methods
const showNotification = (message: string, type: string = 'info') => {
  notification.value = { message, type };
  setTimeout(() => notification.value = null, 5000);
};

const canEditCustomer = (customer: any): boolean => {
  if (isAdmin.value) return true;
  return customer.bnk_code === userBankCode.value;
};

const loadCustomers = async () => {
  isLoading.value = true;
  try {
    const data = await getAllCustomers();
    
    // Normalize confirmed field
    customers.value = data.map((record: any) => ({
      ...record,
      confirmed: record.confirmed !== undefined 
        ? record.confirmed 
        : (record.is_confirmed === true || record.is_confirmed === 't' || record.is_confirmed === 1)
    }));
    
    applyFilters();
    showNotification('ໂຫຼດຂໍ້ມູນສຳເລັດ', 'success');
  } catch (error: any) {
    showNotification(error.message || 'ໂຫຼດບໍ່ສຳເລັດ', 'error');
  } finally {
    isLoading.value = false;
  }
};

const applyFilters = () => {
  let result = [...customers.value];
  
  // Member: filter by own bank only
  if (!isAdmin.value) {
    result = result.filter(c => c.bnk_code === userBankCode.value);
  }
  
  if (filters.value.bnk_code) {
    result = result.filter(c => c.bnk_code?.includes(filters.value.bnk_code));
  }
  if (filters.value.status) {
    result = result.filter(c => c.status === filters.value.status);
  }
  if (filters.value.confirmed !== '') {
    const isConfirmed = filters.value.confirmed === 'true';
    result = result.filter(c => c.confirmed === isConfirmed);
  }
  if (filters.value.dateFrom) {
    const fromDate = new Date(filters.value.dateFrom);
    result = result.filter(c => {
      const recordDate = new Date(c.uploaded_at || c.insert_date);
      return recordDate >= fromDate;
    });
  }
  if (filters.value.dateTo) {
    const toDate = new Date(filters.value.dateTo);
    toDate.setHours(23, 59, 59);
    result = result.filter(c => {
      const recordDate = new Date(c.uploaded_at || c.insert_date);
      return recordDate <= toDate;
    });
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
  filters.value = { bnk_code: '', status: '', confirmed: '', dateFrom: '', dateTo: '', search: '' };
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
    .filter(c => !c.confirmed)
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
    showNotification(`ຢືນຢັນ ${selectedCustomers.value.length} ລູກຄ້າສຳເລັດ!`, 'success');
    selectedCustomers.value = [];
    await loadCustomers();
  } catch (error: any) {
    showNotification(error.message || 'ຢືນຢັນບໍ່ສຳເລັດ', 'error');
  } finally {
    isConfirming.value = false;
  }
};

const confirmSingle = async (id: number) => {
  isConfirming.value = true;
  try {
    await confirmCustomers([id]);
    showNotification('ຢືນຢັນລູກຄ້າສຳເລັດ!', 'success');
    await loadCustomers();
    closeDetailModal();
  } catch (error: any) {
    showNotification(error.message || 'ຢືນຢັນບໍ່ສຳເລັດ', 'error');
  } finally {
    isConfirming.value = false;
  }
};

// Customer ID editing
const startEditCustomerId = (customer: any) => {
  editingCustomerId.value = customer.ind_sys_id;
  newCustomerId.value = customer.customer_id || '';
};

const saveCustomerId = async (customer: any) => {
  if (!newCustomerId.value || newCustomerId.value.trim() === '') {
    showNotification('ກະລຸນາປ້ອນລະຫັດລູກຄ້າ', 'error');
    return;
  }

  try {
    await updateCustomerID(customer.ind_sys_id, newCustomerId.value.trim());
    showNotification('ອັບເດດລະຫັດລູກຄ້າສຳເລັດ!', 'success');
    await loadCustomers();
    cancelEdit();
  } catch (error: any) {
    showNotification(error.message || 'ອັບເດດບໍ່ສຳເລັດ', 'error');
  }
};

// Segment editing
const startEditSegment = (customer: any) => {
  editingSegment.value = customer.ind_sys_id;
  newSegment.value = customer.segment || 'A3';
};

const saveSegment = async (customer: any) => {
  if (!newSegment.value) {
    showNotification('ກະລຸນາເລືອກກຸ່ມລູກຄ້າ', 'error');
    return;
  }

  try {
    await updateCustomerSegment(customer.ind_sys_id, newSegment.value);
    showNotification('ອັບເດດກຸ່ມລູກຄ້າສຳເລັດ!', 'success');
    await loadCustomers();
    cancelEdit();
  } catch (error: any) {
    showNotification(error.message || 'ອັບເດດບໍ່ສຳເລັດ', 'error');
  }
};

const cancelEdit = () => {
  editingCustomerId.value = null;
  editingSegment.value = null;
  newCustomerId.value = '';
  newSegment.value = '';
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
  return new Date(dateStr).toLocaleString('lo-LA', {
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
    userBankCode.value = userData.value?.MID?.id || '';
    isAdmin.value = userGID.value >= 1 && userGID.value <= 5;
    
    if (userGID.value < 1 || userGID.value > 7) {
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
  flex-wrap: wrap;
  gap: 1rem;
}

.page-header h1 {
  font-size: 2rem;
  color: #1a1a1a;
  margin: 0 0 0.5rem 0;
}

.subtitle { color: #666; font-size: 0.95rem; margin: 0; }

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-register {
  padding: 0.75rem 1.5rem;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
}

.btn-register:hover {
  background: #059669;
  transform: translateY(-1px);
}

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

/* Statistics - MDI Icons */
.statistics-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: all 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.stat-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon svg {
  width: 100%;
  height: 100%;
}

.stat-card.total .stat-icon svg { fill: #6366f1; }
.stat-card.pending .stat-icon svg { fill: #f59e0b; }
.stat-card.confirmed .stat-icon svg { fill: #10b981; }
.stat-card.selected .stat-icon svg { fill: #8b5cf6; }

.stat-value { 
  font-size: 2.5rem; 
  font-weight: 700;
  line-height: 1;
}

.stat-card.total { border-top: 4px solid #6366f1; }
.stat-card.pending { border-top: 4px solid #f59e0b; }
.stat-card.confirmed { border-top: 4px solid #10b981; }
.stat-card.selected { border-top: 4px solid #8b5cf6; }

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

/* Editable cells */
.editable-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-edit {
  padding: 0.25rem 0.5rem;
  background: #e0f2fe;
  border: 1px solid #bae6fd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  opacity: 0;
  transition: all 0.2s;
}

.customer-table tbody tr:hover .btn-edit {
  opacity: 1;
}

.btn-edit:hover {
  background: #bae6fd;
}

.edit-inline {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.edit-input,
.edit-select {
  padding: 0.375rem 0.5rem;
  border: 2px solid #4299e1;
  border-radius: 4px;
  font-size: 0.875rem;
  min-width: 120px;
}

.edit-input:focus,
.edit-select:focus {
  outline: none;
  border-color: #3182ce;
}

.btn-save {
  padding: 0.375rem 0.625rem;
  background: #48bb78;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
}

.btn-save:hover {
  background: #38a169;
}

.btn-cancel {
  padding: 0.375rem 0.625rem;
  background: #f56565;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
}

.btn-cancel:hover {
  background: #e53e3e;
}

.segment-badge {
  padding: 0.25rem 0.625rem;
  background: #e0e7ff;
  color: #3730a3;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
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

/* Modal */
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

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .header-actions {
    width: 100%;
    flex-direction: column;
  }
  
  .user-info {
    width: 100%;
  }
}
</style>