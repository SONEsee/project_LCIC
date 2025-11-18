<template>
  <div class="customer-register-page">
    <div class="page-header">
      <div>
        <h1>Register Bank Customers</h1>
        <p class="subtitle">Add customers manually or upload batch file</p>
      </div>
      <div v-if="userData" class="user-info">
        <div class="user-avatar">
          <img v-if="userData.profile_image" :src="userData.profile_image" alt="Profile" />
          <span v-else>{{ userData.nameE?.charAt(0) || 'U' }}</span>
        </div>
        <div class="user-details">
          <div class="user-name">{{ userData.nameL || userData.nameE }}</div>
          <div class="user-role">{{ userData.GID?.nameL || 'Member' }}</div>
          <div class="user-bank">Bank Code: {{ userBankCode }}</div>
        </div>
      </div>
    </div>

    <!-- Tab Navigation -->
    <div class="tab-navigation">
      <button 
        :class="['tab-btn', { active: activeTab === 'manual' }]"
        @click="activeTab = 'manual'"
      >
        <span class="icon">📝</span>
        Manual Input
      </button>
      <button 
        :class="['tab-btn', { active: activeTab === 'batch' }]"
        @click="activeTab = 'batch'"
      >
        <span class="icon">📁</span>
        Batch Upload
      </button>
      <button 
        :class="['tab-btn', { active: activeTab === 'history' }]"
        @click="loadHistory"
      >
        <span class="icon">📊</span>
        My Submissions
      </button>
    </div>

    <!-- Manual Input Form -->
    <div v-if="activeTab === 'manual'" class="tab-content">
      <form @submit.prevent="submitManualForm" class="manual-form">
        <div class="two-column-layout">
          <!-- LEFT SIDE: Customer Information -->
          <div class="left-panel">
            <div class="form-section">
              <h3>Basic Information</h3>
              
              <div class="form-group">
                <label for="custype">Customer Type <span class="required">*</span></label>
                <select id="custype" v-model="manualForm.Custype" required>
                  <option value="">Select Type</option>
                  <option value="IND">Individual</option>
                  <option value="COR">Corporate</option>
                </select>
              </div>

              <div class="form-group">
                <label for="segment">Segment <span class="required">*</span></label>
                <select id="segment" v-model="manualForm.segment" required>
                  <option value="">Select Segment</option>
                  <option value="A1">A1</option>
                  <option value="A2">A2</option>
                  <option value="A3">A3</option>
                </select>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="bnk_code">Bank Code</label>
                  <input 
                    id="bnk_code" 
                    v-model="userBankCode" 
                    type="text" 
                    readonly
                    disabled
                    class="readonly-input"
                  />
                </div>

                <div class="form-group">
                  <label for="branch_id_code">Branch Code <span class="required">*</span></label>
                  <input 
                    id="branch_id_code" 
                    v-model="manualForm.branch_id_code" 
                    type="text" 
                    required
                    placeholder="e.g., 010"
                  />
                </div>
              </div>
            </div>

            <div class="form-section">
              <h3>Name Information</h3>

              <div class="form-row">
                <div class="form-group">
                  <label for="ind_name">First Name (English) <span class="required">*</span></label>
                  <input 
                    id="ind_name" 
                    v-model="manualForm.ind_name" 
                    type="text"
                    placeholder="Khampaseuth"
                    required
                  />
                </div>

                <div class="form-group">
                  <label for="ind_surname">Last Name (English) <span class="required">*</span></label>
                  <input 
                    id="ind_surname" 
                    v-model="manualForm.ind_surname" 
                    type="text"
                    placeholder="Xanghomvilay"
                    required
                  />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="ind_lao_name">First Name (Lao)</label>
                  <input 
                    id="ind_lao_name" 
                    v-model="manualForm.ind_lao_name" 
                    type="text"
                    placeholder="ຄຳປະເສີດ"
                  />
                </div>

                <div class="form-group">
                  <label for="ind_lao_surname">Last Name (Lao)</label>
                  <input 
                    id="ind_lao_surname" 
                    v-model="manualForm.ind_lao_surname" 
                    type="text"
                    placeholder="ຊ່າງໂຮມວິໄລ"
                  />
                </div>
              </div>

              <div class="form-group">
                <label for="ind_birth_date">Birth Date</label>
                <input 
                  id="ind_birth_date" 
                  v-model="manualForm.ind_birth_date" 
                  type="date"
                />
              </div>
            </div>
          </div>

          <!-- RIGHT SIDE: Verification Documents -->
          <div class="right-panel">
            <div class="form-section">
              <h3>Verification Documents <span class="required">*</span></h3>
              <p class="section-hint">Select at least one document type and attach the file</p>

              <!-- National ID -->
              <div class="document-group">
                <div class="document-header">
                  <label class="checkbox-label">
                    <input 
                      type="checkbox" 
                      v-model="documentTypes.national_id.enabled"
                      @change="handleDocumentTypeToggle('national_id')"
                    />
                    <span class="checkbox-custom"></span>
                    <span class="document-title">National ID</span>
                  </label>
                </div>
                
                <div v-if="documentTypes.national_id.enabled" class="document-content">
                  <div class="form-group">
                    <label for="ind_national_id">ID Number <span class="required">*</span></label>
                    <input 
                      id="ind_national_id" 
                      v-model="manualForm.ind_national_id" 
                      type="text"
                      placeholder="0010398-02"
                      required
                    />
                  </div>

                  <div class="form-group">
                    <label for="ind_national_id_date">Issue Date</label>
                    <input 
                      id="ind_national_id_date" 
                      v-model="manualForm.ind_national_id_date" 
                      type="date"
                    />
                  </div>

                  <div class="file-upload-compact">
                    <input 
                      :id="`file-national-id`"
                      type="file" 
                      @change="(e) => handleDocumentUpload('national_id', e)"
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                    <label :for="`file-national-id`" class="file-label">
                      <span class="file-icon">📎</span>
                      <span v-if="!documentTypes.national_id.file" class="file-text">Attach Document *</span>
                      <span v-else class="file-text success">✓ {{ documentTypes.national_id.file.name }}</span>
                    </label>
                  </div>
                </div>
              </div>

              <!-- Passport -->
              <div class="document-group">
                <div class="document-header">
                  <label class="checkbox-label">
                    <input 
                      type="checkbox" 
                      v-model="documentTypes.passport.enabled"
                      @change="handleDocumentTypeToggle('passport')"
                    />
                    <span class="checkbox-custom"></span>
                    <span class="document-title">Passport</span>
                  </label>
                </div>
                
                <div v-if="documentTypes.passport.enabled" class="document-content">
                  <div class="form-group">
                    <label for="ind_passport">Passport Number <span class="required">*</span></label>
                    <input 
                      id="ind_passport" 
                      v-model="manualForm.ind_passport" 
                      type="text"
                      placeholder="P123456"
                      required
                    />
                  </div>

                  <div class="form-group">
                    <label for="ind_passport_date">Issue Date</label>
                    <input 
                      id="ind_passport_date" 
                      v-model="manualForm.ind_passport_date" 
                      type="date"
                    />
                  </div>

                  <div class="file-upload-compact">
                    <input 
                      :id="`file-passport`"
                      type="file" 
                      @change="(e) => handleDocumentUpload('passport', e)"
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                    <label :for="`file-passport`" class="file-label">
                      <span class="file-icon">📎</span>
                      <span v-if="!documentTypes.passport.file" class="file-text">Attach Document *</span>
                      <span v-else class="file-text success">✓ {{ documentTypes.passport.file.name }}</span>
                    </label>
                  </div>
                </div>
              </div>

              <!-- Family Book -->
              <div class="document-group">
                <div class="document-header">
                  <label class="checkbox-label">
                    <input 
                      type="checkbox" 
                      v-model="documentTypes.familybook.enabled"
                      @change="handleDocumentTypeToggle('familybook')"
                    />
                    <span class="checkbox-custom"></span>
                    <span class="document-title">Family Book</span>
                  </label>
                </div>
                
                <div v-if="documentTypes.familybook.enabled" class="document-content">
                  <div class="form-group">
                    <label for="ind_familybook">Family Book Number <span class="required">*</span></label>
                    <input 
                      id="ind_familybook" 
                      v-model="manualForm.ind_familybook" 
                      type="text"
                      placeholder="109"
                      required
                    />
                  </div>

                  <div class="form-group">
                    <label for="ind_familybook_prov_code">Province Code</label>
                    <input 
                      id="ind_familybook_prov_code" 
                      v-model="manualForm.ind_familybook_prov_code" 
                      type="text"
                      placeholder="VTE"
                    />
                  </div>

                  <div class="form-group">
                    <label for="ind_familybook_date">Issue Date</label>
                    <input 
                      id="ind_familybook_date" 
                      v-model="manualForm.ind_familybook_date" 
                      type="date"
                    />
                  </div>

                  <div class="file-upload-compact">
                    <input 
                      :id="`file-familybook`"
                      type="file" 
                      @change="(e) => handleDocumentUpload('familybook', e)"
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                    <label :for="`file-familybook`" class="file-label">
                      <span class="file-icon">📎</span>
                      <span v-if="!documentTypes.familybook.file" class="file-text">Attach Document *</span>
                      <span v-else class="file-text success">✓ {{ documentTypes.familybook.file.name }}</span>
                    </label>
                  </div>
                </div>
              </div>

              <div v-if="!hasAnyDocumentSelected" class="validation-hint error">
                Please select at least one document type
              </div>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" @click="resetManualForm" class="btn-secondary">
            Reset Form
          </button>
          <button 
            type="submit" 
            :disabled="isSubmitting || !isManualFormValid" 
            class="btn-primary"
          >
            {{ isSubmitting ? 'Submitting...' : 'Submit Customer' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Batch Upload -->
    <div v-if="activeTab === 'batch'" class="tab-content">
      <div class="batch-upload-section">
        <div class="upload-instructions">
          <h3>📋 Batch Upload Instructions</h3>
          <ol>
            <li>Download the template file</li>
            <li>Fill in customer information</li>
            <li>Upload the JSON file</li>
            <li>Attach verification documents for each customer</li>
            <li>Submit all records</li>
          </ol>
          <button @click="downloadTemplate" class="btn-secondary">
            <span class="icon">⬇️</span>
            Download Template
          </button>
        </div>

        <div v-if="!batchResults" class="file-upload-area large">
          <input 
            id="batch-file" 
            type="file" 
            ref="batchFileInput"
            @change="handleBatchFileSelect"
            accept=".json"
          />
          <label for="batch-file" class="file-upload-label">
            <span class="icon">📁</span>
            <span v-if="!batchFile">Choose Batch File (JSON)</span>
            <span v-else class="file-name">{{ batchFile.name }}</span>
          </label>
          <p class="file-hint">Accepted format: JSON (Max 10MB)</p>
        </div>

        <button 
          v-if="batchFile && !batchResults" 
          @click="processBatchFile" 
          :disabled="isProcessing"
          class="btn-primary"
        >
          {{ isProcessing ? 'Processing...' : 'Process Batch File' }}
        </button>

        <!-- Batch Results with Document Upload -->
        <div v-if="batchResults" class="batch-results">
          <div class="results-summary">
            <div class="summary-header">
              <h3>📊 Processing Complete</h3>
              <p class="summary-text">Review customers and attach required documents</p>
            </div>
            <div class="summary-cards">
              <div class="summary-card total">
                <div class="card-value">{{ batchResults.total_processed }}</div>
                <div class="card-label">Total Records</div>
              </div>
              <div class="summary-card matched">
                <div class="card-value">{{ batchResults.matched }}</div>
                <div class="card-label">Matched</div>
              </div>
              <div class="summary-card new">
                <div class="card-value">{{ batchResults.new_records }}</div>
                <div class="card-label">New Records</div>
              </div>
              <div class="summary-card documents">
                <div class="card-value">
                  {{ Object.keys(batchDocuments).length }} / {{ batchResults.details.length }}
                </div>
                <div class="card-label">Documents Attached</div>
              </div>
            </div>
          </div>

          <div class="customer-list">
            <h4>Customer List - Attach Documents</h4>
            
            <div class="customer-cards">
              <div 
                v-for="(detail, index) in batchResults.details" 
                :key="index"
                class="customer-card"
                :class="{ 'has-document': batchDocuments[index] }"
              >
                <div class="card-header">
                  <div class="customer-info">
                    <h5>{{ detail.customer_id || `Customer ${index + 1}` }}</h5>
                    <div class="info-row">
                      <span class="info-label">Bank Code:</span>
                      <span class="info-value">{{ detail.bnk_code }}</span>
                    </div>
                    <div class="info-row">
                      <span class="info-label">LCIC ID:</span>
                      <code class="lcic-code">{{ detail.lcic_id }}</code>
                    </div>
                  </div>
                  <div class="card-badges">
                    <span :class="['status-badge', getStatusClass(detail.status)]">
                      {{ detail.status }}
                    </span>
                    <span class="match-badge">{{ detail.match_percent }}% Match</span>
                  </div>
                </div>

                <div class="card-body">
                  <div class="document-upload-zone">
                    <input 
                      :id="`batch-doc-${index}`"
                      type="file" 
                      @change="(e) => handleBatchDocumentUpload(index, e)"
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                    <label :for="`batch-doc-${index}`" class="upload-zone-label">
                      <div v-if="!batchDocuments[index]" class="upload-prompt">
                        <span class="upload-icon">📎</span>
                        <span class="upload-text">Click to attach document</span>
                        <span class="upload-hint">PDF, JPG, PNG (Max 5MB)</span>
                      </div>
                      <div v-else class="upload-success">
                        <span class="success-icon">✓</span>
                        <span class="success-text">{{ batchDocuments[index].name }}</span>
                        <span class="change-link">Click to change</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="batch-actions">
            <button @click="resetBatchUpload" class="btn-secondary">
              <span class="icon">🔄</span>
              Upload Another Batch
            </button>
            <button 
              @click="finalizeBatchSubmit" 
              :disabled="!allBatchDocumentsAttached || isSubmitting"
              class="btn-primary"
            >
              {{ isSubmitting ? 'Submitting...' : `Submit All (${Object.keys(batchDocuments).length}/${batchResults.details.length})` }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Upload History -->
    <div v-if="activeTab === 'history'" class="tab-content">
      <div class="history-section">
        <div class="history-header">
          <div>
            <h3>My Submissions</h3>
            <p class="history-subtitle">Customers waiting for admin confirmation</p>
          </div>
          <button @click="loadHistory" class="btn-secondary" :disabled="isLoadingHistory">
            <span class="icon">🔄</span>
            {{ isLoadingHistory ? 'Loading...' : 'Refresh' }}
          </button>
        </div>

        <div v-if="isLoadingHistory" class="loading-state">
          <div class="spinner"></div>
          <p>Loading submissions...</p>
        </div>

        <div v-else-if="uploadHistory.length === 0" class="empty-state">
          <span class="empty-icon">📋</span>
          <p>No submissions found</p>
          <p class="empty-hint">Your registered customers will appear here</p>
        </div>

        <div v-else>
          <!-- Statistics Cards -->
          <div class="stats-cards" v-if="historyStats">
            <div class="stat-card pending">
              <div class="stat-value">{{ historyStats.pending }}</div>
              <div class="stat-label">Pending Review</div>
            </div>
            <div class="stat-card approved">
              <div class="stat-value">{{ historyStats.approved }}</div>
              <div class="stat-label">Approved</div>
            </div>
            <div class="stat-card rejected">
              <div class="stat-value">{{ historyStats.rejected }}</div>
              <div class="stat-label">Rejected</div>
            </div>
            <div class="stat-card total">
              <div class="stat-value">{{ historyStats.total }}</div>
              <div class="stat-label">Total</div>
            </div>
          </div>

          <!-- History Table -->
          <div class="history-table">
            <table>
              <thead>
                <tr>
                  <th>Customer ID</th>
                  <th>Name</th>
                  <th>National ID</th>
                  <th>Bank Code</th>
                  <th>Status</th>
                  <th>Submitted</th>
                  <th>Document</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="record in uploadHistory" :key="record.ind_sys_id">
                  <td>{{ record.customer_id }}</td>
                  <td>{{ record.ind_name }} {{ record.ind_surname }}</td>
                  <td><code>{{ record.ind_national_id }}</code></td>
                  <td>{{ record.bnk_code }}</td>
                  <td>
                    <span :class="['status-badge', getStatusClass(record.status)]">
                      {{ record.status }}
                    </span>
                  </td>
                  <td>{{ formatDate(record.uploaded_at) }}</td>
                  <td>
                    <a v-if="record.document_file" :href="record.document_file" target="_blank" class="btn-link">
                      View
                    </a>
                    <span v-else class="text-muted">No document</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notifications -->
    <transition name="slide-fade">
      <div v-if="notification" :class="['notification', notification.type]">
        <span class="notification-icon">
          {{ notification.type === 'success' ? '✓' : notification.type === 'error' ? '✕' : 'ℹ' }}
        </span>
        <span class="notification-message">{{ notification.message }}</span>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import type { CustomerRecord, RegisterResponse, UploadedCustomer } from '~/types/customer';

definePageMeta({
  middleware: 'auth',
  layout: 'backend',
}); 

// Composables
const { registerManualCustomer, registerBatchCustomers, getMyCustomers, parseUploadedFile } = useCustomerRegistration();

// User data
const userData = ref<any>(null);
const userGID = ref<number>(0);
const userBankCode = ref<string>('');
const isMember = ref(false);

// Initialize user data
onMounted(() => {
  try {
    const userDataStr = localStorage.getItem('user_data');
    
    if (userDataStr) {
      userData.value = JSON.parse(userDataStr);
      userGID.value = userData.value?.GID?.GID || 0;
      userBankCode.value = userData.value?.bnk_code || userData.value?.bank_code || '';
      isMember.value = userGID.value >= 6 && userGID.value <= 7;
      
      if (!isMember.value && userGID.value !== 0) {
        console.warn('Admin users should use the confirm page');
      }
    }
  } catch (error) {
    console.error('Failed to load user data:', error);
  }
});

// State
const activeTab = ref<'manual' | 'batch' | 'history'>('manual');
const isSubmitting = ref(false);
const isProcessing = ref(false);
const isLoadingHistory = ref(false);

// Manual Form State
const manualForm = ref<CustomerRecord>({
  Custype: '',
  segment: '',
  bnk_code: '',
  customer_ID: '',
  branch_id_code: '',
  ind_national_id: '',
  ind_national_id_date: null,
  ind_passport: '',
  ind_passport_date: null,
  ind_familybook: '',
  ind_familybook_prov_code: '',
  ind_familybook_date: null,
  ind_birth_date: null,
  ind_name: '',
  ind_surname: '',
  ind_lao_name: '',
  ind_lao_surname: '',
  verify_document: ''
});

// Document Types State
interface DocumentType {
  enabled: boolean;
  file: File | null;
}

const documentTypes = ref<Record<string, DocumentType>>({
  national_id: { enabled: false, file: null },
  passport: { enabled: false, file: null },
  familybook: { enabled: false, file: null }
});

// Batch Upload State
const batchFile = ref<File | null>(null);
const batchFileInput = ref<HTMLInputElement | null>(null);
const batchResults = ref<RegisterResponse | null>(null);
const batchDocuments = ref<Record<number, File>>({});

// History
const uploadHistory = ref<UploadedCustomer[]>([]);
const historyStats = ref<any>(null);

// Notification
const notification = ref<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

// Computed
const hasAnyDocumentSelected = computed(() => {
  return Object.values(documentTypes.value).some(doc => doc.enabled);
});

const hasAllRequiredDocuments = computed(() => {
  return Object.entries(documentTypes.value).every(([key, doc]) => {
    if (!doc.enabled) return true;
    return doc.file !== null;
  });
});

const isManualFormValid = computed(() => {
  return hasAnyDocumentSelected.value && 
         hasAllRequiredDocuments.value &&
         manualForm.value.Custype &&
         manualForm.value.segment &&
         manualForm.value.branch_id_code &&
         manualForm.value.ind_name &&
         manualForm.value.ind_surname;
});

const allBatchDocumentsAttached = computed(() => {
  if (!batchResults.value) return false;
  const totalRecords = batchResults.value.details.length;
  const attachedCount = Object.keys(batchDocuments.value).length;
  return attachedCount === totalRecords;
});

// Methods
const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  notification.value = { message, type };
  setTimeout(() => {
    notification.value = null;
  }, 5000);
};

const handleDocumentTypeToggle = (docType: string) => {
  if (!documentTypes.value[docType].enabled) {
    documentTypes.value[docType].file = null;
    
    if (docType === 'national_id') {
      manualForm.value.ind_national_id = '';
      manualForm.value.ind_national_id_date = null;
    } else if (docType === 'passport') {
      manualForm.value.ind_passport = '';
      manualForm.value.ind_passport_date = null;
    } else if (docType === 'familybook') {
      manualForm.value.ind_familybook = '';
      manualForm.value.ind_familybook_prov_code = '';
      manualForm.value.ind_familybook_date = null;
    }
  }
};

const handleDocumentUpload = (docType: string, event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    
    if (file.size > 5 * 1024 * 1024) {
      showNotification('File size must be less than 5MB', 'error');
      target.value = '';
      return;
    }
    
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      showNotification('Only PDF, JPG, and PNG files are allowed', 'error');
      target.value = '';
      return;
    }
    
    documentTypes.value[docType].file = file;
  }
};

const submitManualForm = async () => {
  if (!isManualFormValid.value) {
    showNotification('Please complete all required fields and attach documents', 'error');
    return;
  }

  isSubmitting.value = true;

  try {
    const formData = { ...manualForm.value };
    formData.bnk_code = userBankCode.value;
    
    if (formData.ind_national_id_date) {
      formData.ind_national_id_date = new Date(formData.ind_national_id_date).toISOString();
    }
    if (formData.ind_passport_date) {
      formData.ind_passport_date = new Date(formData.ind_passport_date).toISOString();
    }
    if (formData.ind_familybook_date) {
      formData.ind_familybook_date = new Date(formData.ind_familybook_date).toISOString();
    }
    if (formData.ind_birth_date) {
      formData.ind_birth_date = new Date(formData.ind_birth_date).toISOString();
    }

    const documents = Object.entries(documentTypes.value)
      .filter(([_, doc]) => doc.enabled && doc.file)
      .map(([type, doc]) => ({ type, file: doc.file! }));
    
    await registerManualCustomer(formData, documents);
    
    showNotification('Customer registered successfully! Waiting for admin confirmation.', 'success');
    resetManualForm();
    
    activeTab.value = 'history';
    await loadHistory();
  } catch (error: any) {
    showNotification(error.message || 'Failed to register customer', 'error');
  } finally {
    isSubmitting.value = false;
  }
};

const resetManualForm = () => {
  manualForm.value = {
    Custype: '',
    segment: '',
    bnk_code: '',
    customer_ID: '',
    branch_id_code: '',
    ind_national_id: '',
    ind_national_id_date: null,
    ind_passport: '',
    ind_passport_date: null,
    ind_familybook: '',
    ind_familybook_prov_code: '',
    ind_familybook_date: null,
    ind_birth_date: null,
    ind_name: '',
    ind_surname: '',
    ind_lao_name: '',
    ind_lao_surname: '',
    verify_document: ''
  };
  
  Object.keys(documentTypes.value).forEach(key => {
    documentTypes.value[key] = { enabled: false, file: null };
  });
};

const handleBatchFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    
    if (file.size > 10 * 1024 * 1024) {
      showNotification('File size must be less than 10MB', 'error');
      target.value = '';
      return;
    }
    
    if (!file.name.endsWith('.json')) {
      showNotification('Only JSON files are accepted', 'error');
      target.value = '';
      return;
    }
    
    batchFile.value = file;
  }
};

const processBatchFile = async () => {
  if (!batchFile.value) return;

  isProcessing.value = true;

  try {
    const customers = await parseUploadedFile(batchFile.value);
    
    if (!Array.isArray(customers) || customers.length === 0) {
      throw new Error('Invalid file format or empty customer list');
    }
    
    const result = await registerBatchCustomers(customers, userBankCode.value, batchDocuments.value);
    
    batchResults.value = result;
    showNotification(`Successfully processed ${result.total_processed} customers`, 'success');
  } catch (error: any) {
    showNotification(error.message || 'Failed to process batch file', 'error');
    batchResults.value = null;
  } finally {
    isProcessing.value = false;
  }
};

const handleBatchDocumentUpload = (index: number, event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    
    if (file.size > 5 * 1024 * 1024) {
      showNotification('File size must be less than 5MB', 'error');
      target.value = '';
      return;
    }
    
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      showNotification('Only PDF, JPG, and PNG files are allowed', 'error');
      target.value = '';
      return;
    }
    
    batchDocuments.value[index] = file;
  }
};

const finalizeBatchSubmit = async () => {
  if (!allBatchDocumentsAttached.value) {
    showNotification('Please attach documents for all customers before submitting', 'error');
    return;
  }

  isSubmitting.value = true;

  try {
    showNotification('Batch submission completed! Waiting for admin confirmation.', 'success');
    
    activeTab.value = 'history';
    await loadHistory();
    
    resetBatchUpload();
  } catch (error: any) {
    showNotification(error.message || 'Failed to submit batch', 'error');
  } finally {
    isSubmitting.value = false;
  }
};

const resetBatchUpload = () => {
  batchFile.value = null;
  batchResults.value = null;
  batchDocuments.value = {};
  if (batchFileInput.value) {
    batchFileInput.value.value = '';
  }
};

const downloadTemplate = () => {
  const template = [
    {
      Custype: "IND",
      segment: "A3",
      customer_ID: "EXAMPLE-001",
      branch_id_code: "010",
      ind_national_id: "0010398-02",
      ind_national_id_date: null,
      ind_passport: null,
      ind_passport_date: null,
      ind_familybook: "109",
      ind_familybook_prov_code: "VTE",
      ind_familybook_date: "2002-08-21T00:00:00.000Z",
      ind_birth_date: "1984-01-22T00:00:00.000Z",
      ind_name: "Example",
      ind_surname: "Customer",
      ind_lao_name: "ຕົວຢ່າງ",
      ind_lao_surname: "ລູກຄ້າ"
    }
  ];
  
  const dataStr = JSON.stringify(template, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'customer_template.json';
  link.click();
  URL.revokeObjectURL(url);
};

const loadHistory = async () => {
  isLoadingHistory.value = true;
  activeTab.value = 'history';
  
  try {
    const response: any = await getMyCustomers();
    uploadHistory.value = response;
    
    historyStats.value = {
      total: response.length,
      pending: response.filter((r: any) => r.status === 'pending').length,
      approved: response.filter((r: any) => r.status === 'approved').length,
      rejected: response.filter((r: any) => r.status === 'rejected').length
    };
  } catch (error: any) {
    showNotification(error.message || 'Failed to load submissions', 'error');
  } finally {
    isLoadingHistory.value = false;
  }
};

const getStatusClass = (status: string): string => {
  const statusLower = status?.toLowerCase() || '';
  if (statusLower.includes('pending')) return 'pending';
  if (statusLower.includes('approved')) return 'approved';
  if (statusLower.includes('rejected')) return 'rejected';
  if (statusLower.includes('matched')) return 'matched';
  if (statusLower.includes('new')) return 'new';
  return 'default';
};

const formatDate = (dateStr?: string): string => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.customer-register-page {
  max-width: 1600px;
  margin: 0 auto;
  padding: 2rem;
  background: #f5f7fa;
  min-height: 100vh;
}

/* Page Header */
.page-header {
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.page-header h1 {
  font-size: 2rem;
  color: #1a202c;
  margin: 0 0 0.5rem 0;
  font-weight: 700;
}

.subtitle {
  color: #718096;
  font-size: 0.95rem;
  margin: 0;
}

/* User Info */
.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: white;
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  background: #4299e1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1.25rem;
  flex-shrink: 0;
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
  color: #1a202c;
  font-size: 0.95rem;
}

.user-role {
  font-size: 0.8rem;
  color: #718096;
}

.user-bank {
  font-size: 0.8rem;
  color: #4299e1;
  font-weight: 600;
}

/* Tab Navigation - Minimal Colors */
.tab-navigation {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  background: white;
  padding: 0.5rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.tab-btn {
  flex: 1;
  padding: 0.875rem 1.5rem;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95rem;
  color: #718096;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 500;
}

.tab-btn:hover {
  color: #2d3748;
  background: #f7fafc;
}

.tab-btn.active {
  color: white;
  background: #4299e1;
  font-weight: 600;
}

.tab-content {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Two Column Layout */
.two-column-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.left-panel,
.right-panel {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Form Sections */
.form-section {
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
}

.form-section h3 {
  font-size: 1.1rem;
  color: #2d3748;
  margin: 0 0 1.25rem 0;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #cbd5e0;
  font-weight: 600;
}

.section-hint {
  font-size: 0.875rem;
  color: #718096;
  margin: -0.5rem 0 1rem 0;
}

/* Form Groups */
.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #4a5568;
  font-weight: 500;
  font-size: 0.9rem;
}

.required {
  color: #e53e3e;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #cbd5e0;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.2s;
  background: white;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}

.form-group input.readonly-input {
  background: #edf2f7;
  color: #718096;
  cursor: not-allowed;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

/* Document Groups */
.document-group {
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 1rem;
  transition: all 0.2s;
}

.document-group:hover {
  border-color: #cbd5e0;
}

.document-header {
  margin-bottom: 0.75rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  user-select: none;
}

.checkbox-label input[type="checkbox"] {
  display: none;
}

.checkbox-custom {
  width: 22px;
  height: 22px;
  border: 2px solid #cbd5e0;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
}

.checkbox-label input[type="checkbox"]:checked + .checkbox-custom {
  background: #4299e1;
  border-color: #4299e1;
}

.checkbox-label input[type="checkbox"]:checked + .checkbox-custom::after {
  content: '✓';
  color: white;
  font-size: 14px;
  font-weight: bold;
}

.document-title {
  font-weight: 600;
  color: #2d3748;
  font-size: 1rem;
}

.document-content {
  padding-top: 0.75rem;
  border-top: 1px solid #e2e8f0;
  margin-top: 0.75rem;
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* File Upload Compact */
.file-upload-compact {
  margin-top: 0.75rem;
}

.file-upload-compact input[type="file"] {
  display: none;
}

.file-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  background: #f7fafc;
  border: 2px dashed #cbd5e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.file-label:hover {
  background: #edf2f7;
  border-color: #4299e1;
}

.file-icon {
  font-size: 1.25rem;
}

.file-text {
  font-size: 0.9rem;
  color: #4a5568;
  font-weight: 500;
}

.file-text.success {
  color: #38a169;
}

.validation-hint {
  margin-top: 1rem;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.875rem;
  text-align: center;
}

.validation-hint.error {
  background: #fff5f5;
  color: #c53030;
  border: 1px solid #feb2b2;
}

/* Buttons */
.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 1.5rem;
  border-top: 2px solid #e2e8f0;
}

.btn-primary {
  padding: 0.875rem 2rem;
  background: #4299e1;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover:not(:disabled) {
  background: #3182ce;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(66, 153, 225, 0.3);
}

.btn-primary:disabled {
  background: #a0aec0;
  cursor: not-allowed;
  box-shadow: none;
}

.btn-secondary {
  padding: 0.875rem 2rem;
  background: white;
  color: #4a5568;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-secondary:hover {
  background: #f7fafc;
  border-color: #cbd5e0;
}

/* Batch Upload */
.upload-instructions {
  background: #ebf8ff;
  padding: 1.5rem;
  border-radius: 10px;
  margin-bottom: 2rem;
  border-left: 4px solid #4299e1;
}

.upload-instructions h3 {
  color: #2c5282;
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
}

.upload-instructions ol {
  margin: 1rem 0;
  padding-left: 1.5rem;
}

.upload-instructions li {
  margin-bottom: 0.5rem;
  color: #2c5282;
  font-size: 0.95rem;
}

.file-upload-area {
  margin: 1.5rem 0;
}

.file-upload-area input[type="file"] {
  display: none;
}

.file-upload-label {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2.5rem;
  border: 3px dashed #cbd5e0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  background: #f7fafc;
}

.file-upload-label:hover {
  border-color: #4299e1;
  background: #edf2f7;
}

.file-upload-area.large .file-upload-label {
  padding: 3.5rem;
}

.file-name {
  color: #4299e1;
  font-weight: 600;
}

.file-hint {
  margin-top: 0.75rem;
  font-size: 0.875rem;
  color: #718096;
  text-align: center;
}

/* Batch Results */
.batch-results {
  margin-top: 2rem;
}

.results-summary {
  margin-bottom: 2rem;
}

.summary-header {
  margin-bottom: 1.5rem;
}

.summary-header h3 {
  margin: 0 0 0.5rem 0;
  color: #2d3748;
  font-size: 1.5rem;
}

.summary-text {
  margin: 0;
  color: #718096;
  font-size: 0.95rem;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.summary-card {
  padding: 1.5rem;
  border-radius: 10px;
  text-align: center;
  color: white;
}

.summary-card.total {
  background: #4299e1;
}

.summary-card.matched {
  background: #48bb78;
}

.summary-card.new {
  background: #9f7aea;
}

.summary-card.documents {
  background: #ed8936;
}

.card-value {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  line-height: 1;
}

.card-label {
  font-size: 0.875rem;
  opacity: 0.95;
  font-weight: 500;
}

/* Customer Cards */
.customer-list {
  margin-top: 2rem;
}

.customer-list h4 {
  margin: 0 0 1.5rem 0;
  color: #2d3748;
  font-size: 1.25rem;
}

.customer-cards {
  display: grid;
  gap: 1.5rem;
}

.customer-card {
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  padding: 1.5rem;
  transition: all 0.2s;
}

.customer-card:hover {
  border-color: #cbd5e0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.customer-card.has-document {
  border-color: #48bb78;
  background: linear-gradient(to right, #f0fff4 0%, white 100%);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.customer-info h5 {
  margin: 0 0 0.75rem 0;
  color: #2d3748;
  font-size: 1.1rem;
}

.info-row {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.info-label {
  color: #718096;
  font-weight: 500;
}

.info-value {
  color: #2d3748;
  font-weight: 600;
}

.lcic-code {
  background: #edf2f7;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  color: #2d3748;
}

.card-badges {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-end;
}

.status-badge {
  padding: 0.375rem 0.875rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-badge.pending {
  background: #feebc8;
  color: #7c2d12;
}

.status-badge.approved {
  background: #c6f6d5;
  color: #22543d;
}

.status-badge.rejected {
  background: #fed7d7;
  color: #742a2a;
}

.status-badge.matched {
  background: #c6f6d5;
  color: #22543d;
}

.status-badge.new {
  background: #bee3f8;
  color: #2c5282;
}

.match-badge {
  background: #feebc8;
  color: #7c2d12;
  padding: 0.25rem 0.625rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.card-body {
  margin-top: 1rem;
}

/* Document Upload Zone */
.document-upload-zone input[type="file"] {
  display: none;
}

.upload-zone-label {
  display: block;
  padding: 2rem;
  border: 2px dashed #cbd5e0;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  background: #f7fafc;
}

.upload-zone-label:hover {
  border-color: #4299e1;
  background: #edf2f7;
}

.upload-prompt,
.upload-success {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.upload-icon {
  font-size: 2rem;
}

.upload-text {
  color: #4a5568;
  font-weight: 600;
  font-size: 0.95rem;
}

.upload-hint {
  color: #718096;
  font-size: 0.8rem;
}

.success-icon {
  font-size: 2rem;
  color: #38a169;
}

.success-text {
  color: #2d3748;
  font-weight: 600;
  word-break: break-all;
}

.change-link {
  color: #4299e1;
  font-size: 0.8rem;
}

.batch-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #e2e8f0;
}

/* History Section */
.history-section {
  max-width: 100%;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.history-header h3 {
  margin: 0 0 0.5rem 0;
  color: #2d3748;
  font-size: 1.5rem;
}

.history-subtitle {
  margin: 0;
  color: #718096;
  font-size: 0.9rem;
}

/* Statistics Cards */
.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  padding: 1.5rem;
  border-radius: 10px;
  text-align: center;
  color: white;
}

.stat-card.pending {
  background: #ed8936;
}

.stat-card.approved {
  background: #48bb78;
}

.stat-card.rejected {
  background: #f56565;
}

.stat-card.total {
  background: #4299e1;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.875rem;
  opacity: 0.95;
  font-weight: 500;
}

.loading-state {
  text-align: center;
  padding: 4rem;
  color: #718096;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top-color: #4299e1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 4rem;
  color: #a0aec0;
}

.empty-icon {
  font-size: 4rem;
  display: block;
  margin-bottom: 1rem;
}

.empty-hint {
  font-size: 0.875rem;
  color: #cbd5e0;
  margin-top: 0.5rem;
}

/* Tables */
.history-table {
  margin-top: 1.5rem;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

thead {
  background: #4299e1;
}

th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: white;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

td {
  padding: 1rem;
  border-top: 1px solid #e2e8f0;
  color: #4a5568;
}

tbody tr {
  transition: background 0.2s;
}

tbody tr:hover {
  background: #f7fafc;
}

.btn-link {
  color: #4299e1;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.875rem;
}

.btn-link:hover {
  text-decoration: underline;
}

.text-muted {
  color: #a0aec0;
  font-size: 0.875rem;
}

/* Notifications */
.notification {
  position: fixed;
  top: 2rem;
  right: 2rem;
  padding: 1rem 1.5rem;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 300px;
  max-width: 500px;
}

.notification.success {
  background: #48bb78;
  color: white;
}

.notification.error {
  background: #f56565;
  color: white;
}

.notification.info {
  background: #4299e1;
  color: white;
}

.notification-icon {
  font-size: 1.5rem;
  font-weight: bold;
}

.notification-message {
  flex: 1;
  font-weight: 500;
}

.slide-fade-enter-active {
  animation: slideIn 0.3s ease-out;
}

.slide-fade-leave-active {
  animation: slideOut 0.3s ease-in;
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

@keyframes slideOut {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

/* Responsive */
@media (max-width: 1200px) {
  .two-column-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .customer-register-page {
    padding: 1rem;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .user-info {
    width: 100%;
  }

  .tab-navigation {
    flex-direction: column;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .summary-cards,
  .stats-cards {
    grid-template-columns: 1fr;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .card-badges {
    align-items: flex-start;
    margin-top: 1rem;
  }

  table {
    font-size: 0.875rem;
  }

  th, td {
    padding: 0.75rem 0.5rem;
  }

  .notification {
    left: 1rem;
    right: 1rem;
    min-width: auto;
  }
}
</style>