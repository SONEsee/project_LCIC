<template>
  <div class="customer-register-page">
    <div class="page-header">
      <div>
        <h1>ລົງທະບຽນລູກຄ້າທະນາຄານ</h1>
        <p class="subtitle">ເພີ່ມລູກຄ້າດ້ວຍຕົນເອງ ຫຼື ອັບໂຫຼດເປັນກຸ່ມ</p>
      </div>
      <div v-if="userData" class="user-info">
        <div class="user-avatar">
          <img v-if="userData.profile_image" :src="userData.profile_image" alt="Profile" />
          <span v-else>{{ userData.nameE?.charAt(0) || 'U' }}</span>
        </div>
        <div class="user-details">
          <div class="user-name">{{ userData.nameL || userData.nameE }}</div>
          <div class="user-role">{{ userData.GID?.nameL || 'ສະມາຊິກ' }}</div>
          <div class="user-bank">ລະຫັດທະນາຄານ: {{ userBankCode }}</div>
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
        ປ້ອນດ້ວຍມື
      </button>
      <button 
        :class="['tab-btn', { active: activeTab === 'batch' }]"
        @click="activeTab = 'batch'"
      >
        <span class="icon">📁</span>
        ອັບໂຫຼດກຸ່ມ
      </button>
      <button 
        :class="['tab-btn', { active: activeTab === 'history' }]"
        @click="loadHistory"
      >
        <span class="icon">📊</span>
        ລາຍການສົ່ງຂອງຂ້ອຍ
      </button>
    </div>

    <!-- Manual Input Form -->
    <div v-if="activeTab === 'manual'" class="tab-content">
      <form @submit.prevent="submitManualForm" class="manual-form">
        <div class="three-column-layout">
          <!-- COLUMN 1: Basic Information -->
          <div class="column-panel">
            <div class="form-section">
              <h3>ຂໍ້ມູນພື້ນຖານ</h3>
              
              <div class="form-group">
                <label for="custype">ປະເພດລູກຄ້າ <span class="required">*</span></label>
                <select id="custype" v-model="manualForm.custype" required>
                  <option value="">ເລືອກປະເພດ</option>
                  <option value="IND">ບຸກຄົນ</option>
                </select>
              </div>

              <div class="form-group">
                <label for="segment">ກຸ່ມລູກຄ້າ <span class="required">*</span></label>
                <select id="segment" v-model="manualForm.segment" required>
                  <option value="">ເລືອກກຸ່ມ</option>
                  <option value="A1">A1</option>
                  <option value="A3">A3</option>
                </select>
              </div>

              <div class="form-group">
                <label for="bnk_code">ລະຫັດທະນາຄານ</label>
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
                <label for="bank_branch">ສາຂາທະນາຄານ</label>
                <input 
                  id="bank_branch" 
                  v-model="manualForm.bank_branch" 
                  type="text"
                  placeholder="ສໍານັກງານໃຫຍ່"
                />
              </div>

              <div class="form-group">
                <label for="customer_id">ລະຫັດລູກຄ້າ</label>
                <input 
                  id="customer_id" 
                  v-model="manualForm.customer_id" 
                  type="text"
                  placeholder="ສ້າງອັດຕະໂນມັດ"
                  disabled
                  readonly
                  class="readonly-input"
                />
              </div>
            </div>
          </div>

          <!-- COLUMN 2: Verification Documents -->
          <div class="column-panel">
            <div class="form-section">
              <h3>ເອກະສານຢັ້ງຢືນ <span class="required">*</span></h3>
              <p class="section-hint">ເລືອກປະເພດເອກະສານຢ່າງໜ້ອຍ 1 ປະເພດ ແລະ ແນບໄຟລ໌</p>

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
                    <span class="document-title">ບັດປະຈໍາຕົວ</span>
                  </label>
                </div>
                
                <div v-if="documentTypes.national_id.enabled" class="document-content">
                  <div class="form-group">
                    <label for="ind_national_id">ເລກບັດປະຈໍາຕົວ <span class="required">*</span></label>
                    <input 
                      id="ind_national_id" 
                      v-model="manualForm.ind_national_id" 
                      type="text"
                      placeholder="0010398-02"
                      required
                    />
                  </div>

                  <div class="form-group">
                    <label for="ind_national_id_date">ວັນອອກບັດ</label>
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
                      <span v-if="!documentTypes.national_id.file" class="file-text">ແນບເອກະສານ *</span>
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
                    <span class="document-title">ໜັງສືຜ່ານແດນ</span>
                  </label>
                </div>
                
                <div v-if="documentTypes.passport.enabled" class="document-content">
                  <div class="form-group">
                    <label for="ind_passport">ເລກໜັງສືຜ່ານແດນ <span class="required">*</span></label>
                    <input 
                      id="ind_passport" 
                      v-model="manualForm.ind_passport" 
                      type="text"
                      placeholder="P123456"
                      required
                    />
                  </div>

                  <div class="form-group">
                    <label for="ind_passport_date">ວັນອອກບັດ</label>
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
                      <span v-if="!documentTypes.passport.file" class="file-text">ແນບເອກະສານ *</span>
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
                    <span class="document-title">ສຳມະໂນຄົວ</span>
                  </label>
                </div>
                
                <div v-if="documentTypes.familybook.enabled" class="document-content">
                  <div class="form-group">
                    <label for="ind_familybook">ເລກສຳມະໂນຄົວ <span class="required">*</span></label>
                    <input 
                      id="ind_familybook" 
                      v-model="manualForm.ind_familybook" 
                      type="text"
                      placeholder="109"
                      required
                    />
                  </div>

                  <div class="form-group">
                    <label for="ind_familybook_prov_code">ລະຫັດແຂວງ</label>
                    <input 
                      id="ind_familybook_prov_code" 
                      v-model="manualForm.ind_familybook_prov_code" 
                      type="text"
                      placeholder="VTE"
                    />
                  </div>

                  <div class="form-group">
                    <label for="ind_familybook_date">ວັນອອກບັດ</label>
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
                      <span v-if="!documentTypes.familybook.file" class="file-text">ແນບເອກະສານ *</span>
                      <span v-else class="file-text success">✓ {{ documentTypes.familybook.file.name }}</span>
                    </label>
                  </div>
                </div>
              </div>

              <div v-if="!hasAnyDocumentSelected" class="validation-hint error">
                ກະລຸນາເລືອກປະເພດເອກະສານຢ່າງໜ້ອຍ 1 ປະເພດ
              </div>
            </div>
          </div>

          <!-- COLUMN 3: Name Information -->
          <div class="column-panel">
            <div class="form-section">
              <h3>ຂໍ້ມູນຊື່</h3>

              <div class="form-group">
                <label for="ind_name">ຊື່ (ພາສາອັງກິດ) <span class="required">*</span></label>
                <input 
                  id="ind_name" 
                  v-model="manualForm.ind_name" 
                  type="text"
                  placeholder="Khampaseuth"
                  required
                />
              </div>

              <div class="form-group">
                <label for="ind_surname">ນາມສະກຸນ (ພາສາອັງກິດ) <span class="required">*</span></label>
                <input 
                  id="ind_surname" 
                  v-model="manualForm.ind_surname" 
                  type="text"
                  placeholder="Xanghomvilay"
                  required
                />
              </div>

              <div class="form-group">
                <label for="ind_lao_name">ຊື່ (ພາສາລາວ)</label>
                <input 
                  id="ind_lao_name" 
                  v-model="manualForm.ind_lao_name" 
                  type="text"
                  placeholder="ຄຳປະເສີດ"
                />
              </div>

              <div class="form-group">
                <label for="ind_lao_surname">ນາມສະກຸນ (ພາສາລາວ)</label>
                <input 
                  id="ind_lao_surname" 
                  v-model="manualForm.ind_lao_surname" 
                  type="text"
                  placeholder="ຊ່າງໂຮມວິໄລ"
                />
              </div>

              <div class="form-group">
                <label for="ind_birth_date">ວັນເດືອນປີເກີດ</label>
                <input 
                  id="ind_birth_date" 
                  v-model="manualForm.ind_birth_date" 
                  type="date"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" @click="resetManualForm" class="btn-secondary">
            ລ້າງຟອມ
          </button>
          <button 
            type="submit" 
            :disabled="isSubmitting || !isManualFormValid" 
            class="btn-primary"
          >
            {{ isSubmitting ? 'ກຳລັງສົ່ງ...' : 'ສົ່ງຂໍ້ມູນລູກຄ້າ' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Batch Upload -->
    <div v-if="activeTab === 'batch'" class="tab-content">
      <div class="batch-upload-section">
        <div class="upload-instructions">
          <h3>📋 ຄຳແນະນຳການອັບໂຫຼດກຸ່ມ</h3>
          <ol>
            <li>ດາວໂຫຼດໄຟລ໌ແມ່ແບບ</li>
            <li>ຕື່ມຂໍ້ມູນລູກຄ້າ</li>
            <li>ອັບໂຫຼດໄຟລ໌ JSON</li>
            <li>ແນບເອກະສານຢັ້ງຢືນສໍາລັບແຕ່ລະລູກຄ້າ</li>
            <li>ສົ່ງທຸກລາຍການ</li>
          </ol>
          <button @click="downloadTemplate" class="btn-secondary">
            <span class="icon">⬇️</span>
            ດາວໂຫຼດແມ່ແບບ
          </button>
        </div>

        <div v-if="!batchValidatedData" class="file-upload-area large">
          <input 
            id="batch-file" 
            type="file" 
            ref="batchFileInput"
            @change="handleBatchFileSelect"
            accept=".json"
          />
          <label for="batch-file" class="file-upload-label">
            <span class="icon">📁</span>
            <span v-if="!batchFile">ເລືອກໄຟລ໌ກຸ່ມ (JSON)</span>
            <span v-else class="file-name">{{ batchFile.name }}</span>
          </label>
          <p class="file-hint">ຮັບພຽງ: JSON (ສູງສຸດ 10MB)</p>
        </div>

        <button 
          v-if="batchFile && !batchValidatedData" 
          @click="processBatchFile" 
          :disabled="isProcessing"
          class="btn-primary"
        >
          {{ isProcessing ? 'ກຳລັງກວດສອບ...' : 'ກວດສອບໄຟລ໌' }}
        </button>

        <!-- Batch Results -->
        <div v-if="batchValidatedData" class="batch-results">
          <div class="results-summary">
            <div class="summary-header">
              <h3>✅ ກວດສອບສຳເລັດ</h3>
              <p class="summary-text">ແນບເອກະສານຢັ້ງຢືນສໍາລັບແຕ່ລະລູກຄ້າ</p>
            </div>
            <div class="summary-cards">
              <div class="summary-card total">
                <div class="card-value">{{ batchValidatedData.total_processed }}</div>
                <div class="card-label">ທັງໝົດ</div>
              </div>
              <div class="summary-card matched">
                <div class="card-value">{{ batchValidatedData.valid_count }}</div>
                <div class="card-label">ຖືກຕ້ອງ</div>
              </div>
              <div class="summary-card new">
                <div class="card-value">{{ batchValidatedData.error_count }}</div>
                <div class="card-label">ຜິດພາດ</div>
              </div>
              <div class="summary-card documents">
                <div class="card-value">
                  {{ Object.keys(batchDocuments).length }} / {{ batchValidatedData.customers?.length || 0 }}
                </div>
                <div class="card-label">ແນບແລ້ວ</div>
              </div>
            </div>
          </div>

          <div class="customer-list">
            <h4>ລາຍການລູກຄ້າ - ແນບເອກະສານ</h4>
            
            <div class="customer-cards">
              <div 
                v-for="(customer, index) in batchValidatedData.customers" 
                :key="index"
                class="customer-card"
                :class="{ 'has-document': batchDocuments[customer.index] }"
              >
                <div class="card-header">
                  <div class="customer-info">
                    <h5>{{ customer.customer_data.ind_name }} {{ customer.customer_data.ind_surname }}</h5>
                    <div class="info-row">
                      <span class="info-label">ລະຫັດທະນາຄານ:</span>
                      <span class="info-value">{{ customer.bnk_code }}</span>
                    </div>
                    
                    <div class="info-row">
                      <span class="info-label">ມີເອກະສານ:</span>
                      <div class="doc-badges">
                        <span v-if="customer.available_docs.includes('national_id')" class="doc-badge">
                          🆔 ບັດປະຈຳຕົວ
                        </span>
                        <span v-if="customer.available_docs.includes('passport')" class="doc-badge">
                          🛂 ໜັງສືຜ່ານແດນ
                        </span>
                        <span v-if="customer.available_docs.includes('familybook')" class="doc-badge">
                          📕 ສຳມະໂນຄົວ
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="card-body">
                  <div class="document-upload-zone">
                    <input 
                      :id="`batch-doc-${customer.index}`"
                      type="file" 
                      @change="(e) => handleBatchDocumentUpload(customer.index, e)"
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                    <label :for="`batch-doc-${customer.index}`" class="upload-zone-label">
                      <div v-if="!batchDocuments[customer.index]" class="upload-prompt">
                        <span class="upload-icon">📎</span>
                        <span class="upload-text">ກົດເພື່ອແນບເອກະສານ</span>
                        <span class="upload-hint">PDF, JPG, PNG (ສູງສຸດ 5MB)</span>
                      </div>
                      <div v-else class="upload-success">
                        <span class="success-icon">✓</span>
                        <span class="success-text">{{ batchDocuments[customer.index].name }}</span>
                        <span class="change-link">ກົດເພື່ອປ່ຽນ</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="batchValidatedData.errors && batchValidatedData.errors.length > 0" class="validation-errors">
            <h4>⚠️ ຂໍ້ຜິດພາດ</h4>
            <ul>
              <li v-for="(error, idx) in batchValidatedData.errors" :key="idx">{{ error }}</li>
            </ul>
          </div>

          <div class="batch-actions">
            <button @click="resetBatchUpload" class="btn-secondary">
              <span class="icon">🔄</span>
              ອັບໂຫຼດກຸ່ມໃໝ່
            </button>
            <button 
              @click="finalizeBatchSubmit" 
              :disabled="!allBatchDocumentsAttached || isSubmitting"
              class="btn-primary"
            >
              {{ isSubmitting ? 'ກຳລັງສົ່ງ...' : `ສົ່ງທັງໝົດ (${Object.keys(batchDocuments).length}/${batchValidatedData.customers?.length || 0})` }}
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
            <h3>ລາຍການສົ່ງຂອງຂ້ອຍ</h3>
            <p class="history-subtitle">ລູກຄ້າທີ່ລໍຖ້າການຢັ້ງຢືນຈາກຜູ້ບໍລິຫານ</p>
          </div>
          <button @click="loadHistory" class="btn-secondary" :disabled="isLoadingHistory">
            <span class="icon">🔄</span>
            {{ isLoadingHistory ? 'ກຳລັງໂຫຼດ...' : 'ໂຫຼດຄືນ' }}
          </button>
        </div>

        <!-- History Filters -->
        <div class="history-filters">
          <div class="filter-row">
            <div class="filter-group">
              <label>ສະຖານະ</label>
              <select v-model="historyFilters.status" @change="applyHistoryFilters">
                <option value="">ທັງໝົດ</option>
                <option value="pending">ລໍຖ້າ</option>
                <option value="MATCHED">ກົງກັນ</option>
                <option value="NEW RECORD">ບັນທຶກໃໝ່</option>
                <option value="approved">ອະນຸມັດ</option>
                <option value="rejected">ປະຕິເສດ</option>
              </select>
            </div>

            <div class="filter-group">
              <label>ການຢັ້ງຢືນ</label>
              <select v-model="historyFilters.confirmed" @change="applyHistoryFilters">
                <option value="">ທັງໝົດ</option>
                <option value="true">ຢັ້ງຢືນແລ້ວ</option>
                <option value="false">ລໍຖ້າຢັ້ງຢືນ</option>
              </select>
            </div>

            <div class="filter-group">
              <label>ຈາກວັນທີ</label>
              <input type="date" v-model="historyFilters.dateFrom" @change="applyHistoryFilters" />
            </div>

            <div class="filter-group">
              <label>ຫາວັນທີ</label>
              <input type="date" v-model="historyFilters.dateTo" @change="applyHistoryFilters" />
            </div>

            <div class="filter-group">
              <label>ຄົ້ນຫາ</label>
              <input 
                type="text" 
                v-model="historyFilters.search" 
                placeholder="ລະຫັດ, ຊື່..."
                @input="applyHistoryFilters"
              />
            </div>
          </div>

          <div class="filter-actions">
            <button @click="resetHistoryFilters" class="btn-secondary-small">
              ລ້າງຕົວກອງ
            </button>
          </div>
        </div>

        <div v-if="isLoadingHistory" class="loading-state">
          <div class="spinner"></div>
          <p>ກຳລັງໂຫຼດຂໍ້ມູນ...</p>
        </div>

        <div v-else-if="filteredHistory.length === 0" class="empty-state">
          <span class="empty-icon">📋</span>
          <p>ບໍ່ມີລາຍການ</p>
          <p class="empty-hint">ລູກຄ້າທີ່ລົງທະບຽນຈະປາກົດຢູ່ບ່ອນນີ້</p>
        </div>

        <div v-else>
          <!-- Statistics Cards -->
          <div class="stats-cards" v-if="historyStats">
            <div class="stat-card pending">
              <div class="stat-value">{{ historyStats.pending }}</div>
              <div class="stat-label">ລໍຖ້າ</div>
            </div>
            <div class="stat-card approved">
              <div class="stat-value">{{ historyStats.confirmed }}</div>
              <div class="stat-label">ຢັ້ງຢືນແລ້ວ</div>
            </div>
            <div class="stat-card total">
              <div class="stat-value">{{ historyStats.total }}</div>
              <div class="stat-label">ທັງໝົດ</div>
            </div>
          </div>

          <!-- History Table -->
          <div class="history-table">
            <table>
              <thead>
                <tr>
                  <th>ລະຫັດລູກຄ້າ</th>
                  <th>ຊື່</th>
                  <th>ເລກບັດປະຈຳຕົວ</th>
                  <th>ລະຫັດທະນາຄານ</th>
                  <th>LCIC ID</th>
                  <th>ສະຖານະ</th>
                  <th>ສົ່ງເມື່ອ</th>
                  <th>ຢັ້ງຢືນ</th>
                  <th>ເອກະສານ</th>
                  <th>ການດຳເນີນການ</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="record in filteredHistory" :key="record.ind_sys_id">
                  <td>
                    <!-- Editable Customer ID -->
                    <div v-if="editingCustomerId === record.ind_sys_id" class="edit-customer-id">
                      <input 
                        v-model="newCustomerId"
                        type="text"
                        placeholder="ປ້ອນລະຫັດລູກຄ້າ"
                        class="edit-input"
                        @keyup.enter="saveCustomerId(record)"
                        @keyup.esc="cancelEdit"
                      />
                      <button @click="saveCustomerId(record)" class="btn-save" title="ບັນທຶກ">✓</button>
                      <button @click="cancelEdit" class="btn-cancel" title="ຍົກເລີກ">✕</button>
                    </div>
                    <div v-else class="customer-id-cell">
                      <code>{{ record.customer_id || '-' }}</code>
                        <button 
                          v-if="record.is_confirmed && !record.customer_id"
                          @click="startEditCustomerId(record)"
                          class="btn-edit-id"
                          title="ແກ້ໄຂລະຫັດລູກຄ້າ (ຄັ້ງດຽວເທົ່ານັ້ນ)"
                        >
                          ✏️
                        </button>
                    </div>
                  </td>
                  <td>{{ record.ind_name }} {{ record.ind_surname }}</td>
                  <td><code>{{ record.ind_national_id || '-' }}</code></td>
                  <td>{{ record.bnk_code }}</td>
                  <td><code>{{ record.lcic_id || '-' }}</code></td>
                  <td>
                    <span :class="['status-badge', getStatusClass(record.status)]">
                      {{ record.status }}
                    </span>
                  </td>
                  <td>{{ formatDate(record.uploaded_at || record.insert_date) }}</td>
                    <td>
                      <span v-if="record.is_confirmed" class="confirmed-badge">✓ ແລ້ວ</span>
                      <span v-else class="pending-badge">⏳ ລໍຖ້າ</span>
                    </td>
                  <td>
                    <a v-if="record.document_file" :href="record.document_file" target="_blank" class="btn-link">
                      ເບິ່ງ
                    </a>
                    <span v-else class="text-muted">ບໍ່ມີ</span>
                  </td>
                  <td>
                    <button @click="viewHistoryDetail(record)" class="btn-action view" title="ລາຍລະອຽດ">
                      👁
                    </button>
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
definePageMeta({
  middleware: 'auth',
  layout: 'backend',
});

// Composables
const { 
  registerManualCustomer, 
  validateBatchFile, 
  finalizeBatchUpload, 
  getMyCustomers, 
  updateCustomerID,
  parseUploadedFile 
} = useCustomerRegistration();

// User data
const userData = ref<any>(null);
const userGID = ref<number>(0);
const userBankCode = ref<string>('');
const isMember = ref(false);

// State
const activeTab = ref<'manual' | 'batch' | 'history'>('manual');
const isSubmitting = ref(false);
const isProcessing = ref(false);
const isLoadingHistory = ref(false);

// Manual Form State (removed description field)
const manualForm = ref({
  custype: '',
  segment: '',
  bnk_code: '',
  bank_branch: '',
  customer_id: '',
  ind_national_id: '',
  ind_national_id_date: '',
  ind_passport: '',
  ind_passport_date: '',
  ind_familybook: '',
  ind_familybook_prov_code: '',
  ind_familybook_date: '',
  ind_birth_date: '',
  ind_name: '',
  ind_surname: '',
  ind_lao_name: '',
  ind_lao_surname: ''
});

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
const batchValidatedData = ref<any>(null);
const batchDocuments = ref<Record<number, File>>({});

// History
const uploadHistory = ref<any[]>([]);
const filteredHistory = ref<any[]>([]);
watch(filteredHistory, (newVal) => {
  console.log('📋 Filtered History Updated:', newVal.length, 'records');
}, { immediate: true });
const historyStats = ref<any>(null);

// History Filters
const historyFilters = ref({
  status: '',
  confirmed: '',
  dateFrom: '',
  dateTo: '',
  search: ''
});

// Customer ID Editing
const editingCustomerId = ref<number | null>(null);
const newCustomerId = ref('');

// Notification
const notification = ref<any>(null);

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
  const form = manualForm.value;
  const hasRequired = form.custype && form.segment && form.ind_name && form.ind_surname;
  const hasValidDocs = hasAnyDocumentSelected.value && hasAllRequiredDocuments.value;
  return hasRequired && hasValidDocs;
});

const allBatchDocumentsAttached = computed(() => {
  if (!batchValidatedData.value) return false;
  const totalRecords = batchValidatedData.value.customers?.length || 0;
  const attachedCount = Object.keys(batchDocuments.value).length;
  return attachedCount === totalRecords;
});

// Methods
const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  notification.value = { message, type };
  setTimeout(() => notification.value = null, 5000);
};

const handleDocumentTypeToggle = (docType: string) => {
  if (!documentTypes.value[docType].enabled) {
    documentTypes.value[docType].file = null;
    if (docType === 'national_id') {
      manualForm.value.ind_national_id = '';
      manualForm.value.ind_national_id_date = '';
    } else if (docType === 'passport') {
      manualForm.value.ind_passport = '';
      manualForm.value.ind_passport_date = '';
    } else if (docType === 'familybook') {
      manualForm.value.ind_familybook = '';
      manualForm.value.ind_familybook_prov_code = '';
      manualForm.value.ind_familybook_date = '';
    }
  }
};

const handleDocumentUpload = (docType: string, event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    if (file.size > 5 * 1024 * 1024) {
      showNotification('ຂະໜາດໄຟລ໌ຕ້ອງນ້ອຍກວ່າ 5MB', 'error');
      target.value = '';
      return;
    }
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      showNotification('ຮັບພຽງ PDF, JPG, PNG ເທົ່ານັ້ນ', 'error');
      target.value = '';
      return;
    }
    documentTypes.value[docType].file = file;
  }
};

const submitManualForm = async () => {
  if (!isManualFormValid.value) {
    showNotification('ກະລຸນາຕື່ມຂໍ້ມູນໃຫ້ຄົບຖ້ວນ', 'error');
    return;
  }

  isSubmitting.value = true;

  try {
    const formData = { ...manualForm.value };
    formData.bnk_code = userBankCode.value;
    
    const dateFields = ['ind_national_id_date', 'ind_passport_date', 'ind_familybook_date', 'ind_birth_date'];
    dateFields.forEach(field => {
      if (formData[field]) {
        formData[field] = new Date(formData[field]).toISOString().split('T')[0];
      }
    });

    const documents = Object.entries(documentTypes.value)
      .filter(([_, doc]) => doc.enabled && doc.file)
      .map(([type, doc]) => ({ type, file: doc.file! }));
    
    await registerManualCustomer(formData, documents);
    
    showNotification('ລົງທະບຽນລູກຄ້າສຳເລັດ!', 'success');
    resetManualForm();
    activeTab.value = 'history';
    await loadHistory();
  } catch (error: any) {
    showNotification(error.message || 'ລົງທະບຽນບໍ່ສຳເລັດ', 'error');
  } finally {
    isSubmitting.value = false;
  }
};

const resetManualForm = () => {
  manualForm.value = {
    custype: '',
    segment: '',
    bnk_code: '',
    bank_branch: '',
    customer_id: '',
    ind_national_id: '',
    ind_national_id_date: '',
    ind_passport: '',
    ind_passport_date: '',
    ind_familybook: '',
    ind_familybook_prov_code: '',
    ind_familybook_date: '',
    ind_birth_date: '',
    ind_name: '',
    ind_surname: '',
    ind_lao_name: '',
    ind_lao_surname: ''
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
      showNotification('ຂະໜາດໄຟລ໌ຕ້ອງນ້ອຍກວ່າ 10MB', 'error');
      target.value = '';
      return;
    }
    if (!file.name.endsWith('.json')) {
      showNotification('ຮັບພຽງໄຟລ໌ JSON ເທົ່ານັ້ນ', 'error');
      target.value = '';
      return;
    }
    batchFile.value = file;
  }
};

const processBatchFile = async () => {
  if (!batchFile.value) return;
  if (!userBankCode.value) {
    showNotification('ບໍ່ພົບລະຫັດທະນາຄານ', 'error');
    return;
  }

  isProcessing.value = true;

  try {
    const result = await validateBatchFile(batchFile.value, userBankCode.value);
    if (!result.success) {
      throw new Error(result.error || 'ກວດສອບບໍ່ສຳເລັດ');
    }
    batchValidatedData.value = result;
    showNotification(`ກວດສອບແລ້ວ ${result.valid_count} ລູກຄ້າ`, 'success');
  } catch (error: any) {
    showNotification(error.message || 'ກວດສອບບໍ່ສຳເລັດ', 'error');
    batchValidatedData.value = null;
  } finally {
    isProcessing.value = false;
  }
};

const handleBatchDocumentUpload = (index: number, event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    if (file.size > 5 * 1024 * 1024) {
      showNotification('ຂະໜາດໄຟລ໌ຕ້ອງນ້ອຍກວ່າ 5MB', 'error');
      target.value = '';
      return;
    }
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      showNotification('ຮັບພຽງ PDF, JPG, PNG ເທົ່ານັ້ນ', 'error');
      target.value = '';
      return;
    }
    batchDocuments.value[index] = file;
  }
};

const finalizeBatchSubmit = async () => {
  if (!allBatchDocumentsAttached.value) {
    showNotification('ກະລຸນາແນບເອກະສານສຳລັບລູກຄ້າທຸກຄົນ', 'error');
    return;
  }

  isSubmitting.value = true;

  try {
    const customersData = batchValidatedData.value.customers;
    await finalizeBatchUpload(customersData, batchDocuments.value);
    
    showNotification('ສົ່ງຂໍ້ມູນສຳເລັດ!', 'success');
    activeTab.value = 'history';
    await loadHistory();
    resetBatchUpload();
  } catch (error: any) {
    showNotification(error.message || 'ສົ່ງບໍ່ສຳເລັດ', 'error');
  } finally {
    isSubmitting.value = false;
  }
};

const resetBatchUpload = () => {
  batchFile.value = null;
  batchValidatedData.value = null;
  batchDocuments.value = {};
  if (batchFileInput.value) {
    batchFileInput.value.value = '';
  }
};

const downloadTemplate = () => {
  const template = [
    {
      custype: "IND",
      segment: "A3",
      ind_name: "Khampaseuth",
      ind_surname: "Xanghomvilay",
      ind_national_id: "0010398-02",
      ind_national_id_date: "2002-08-21",
      ind_passport: null,
      ind_passport_date: null,
      ind_familybook: "109",
      ind_familybook_prov_code: "VTE",
      ind_familybook_date: "2002-08-21",
      bank_branch: "Head Office",
      ind_birth_date: "1984-01-22",
      ind_lao_name: "ຄຳປະເສີດ",
      ind_lao_surname: "ຊ່າງໂຮມວິໄລ"
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
  showNotification('ດາວໂຫຼດແມ່ແບບສຳເລັດ', 'info');
};

// History Methods
const loadHistory = async () => {
  isLoadingHistory.value = true;
  activeTab.value = 'history';
  
  try {
    const response = await getMyCustomers();
    console.log('📥 Raw API Response:', response);
    
    uploadHistory.value = response.map((record: any) => {
      const isConfirmedValue = record.confirmed !== undefined 
        ? record.confirmed 
        : (record.is_confirmed === true || record.is_confirmed === 't' || record.is_confirmed === 1);
      
      return {
        ...record,
        is_confirmed: isConfirmedValue
      };
    });
    
    applyHistoryFilters();
    showNotification('ໂຫຼດຂໍ້ມູນສຳເລັດ', 'success');
  } catch (error: any) {
    console.error('❌ Load error:', error);
    showNotification(error.message || 'ໂຫຼດບໍ່ສຳເລັດ', 'error');
  } finally {
    isLoadingHistory.value = false;
  }
};

const applyHistoryFilters = () => {
  let result = [...uploadHistory.value];
  
  if (historyFilters.value.status) {
    result = result.filter(r => r.status?.toLowerCase() === historyFilters.value.status.toLowerCase());
  }
  
  if (historyFilters.value.confirmed !== '') {
    const isConfirmed = historyFilters.value.confirmed === 'true';
    result = result.filter(r => r.is_confirmed === isConfirmed);
  }
  if (historyFilters.value.dateFrom) {
    const fromDate = new Date(historyFilters.value.dateFrom);
    result = result.filter(r => {
      const recordDate = new Date(r.uploaded_at || r.insert_date);
      return recordDate >= fromDate;
    });
  }
  
  if (historyFilters.value.dateTo) {
    const toDate = new Date(historyFilters.value.dateTo);
    toDate.setHours(23, 59, 59);
    result = result.filter(r => {
      const recordDate = new Date(r.uploaded_at || r.insert_date);
      return recordDate <= toDate;
    });
  }
  
  if (historyFilters.value.search) {
    const term = historyFilters.value.search.toLowerCase();
    result = result.filter(r => 
      r.customer_id?.toLowerCase().includes(term) ||
      r.ind_name?.toLowerCase().includes(term) ||
      r.ind_surname?.toLowerCase().includes(term) ||
      r.ind_national_id?.toLowerCase().includes(term)
    );
  }
  
  filteredHistory.value = result;
  
  historyStats.value = {
    total: result.length,
    pending: result.filter(r => !r.is_confirmed).length,
    confirmed: result.filter(r => r.is_confirmed).length
  };
};

const resetHistoryFilters = () => {
  historyFilters.value = {
    status: '',
    confirmed: '',
    dateFrom: '',
    dateTo: '',
    search: ''
  };
  applyHistoryFilters();
};

const startEditCustomerId = (record: any) => {
  editingCustomerId.value = record.ind_sys_id;
  newCustomerId.value = '';
};

const cancelEdit = () => {
  editingCustomerId.value = null;
  newCustomerId.value = '';
};

const saveCustomerId = async (record: any) => {
  if (!newCustomerId.value || newCustomerId.value.trim() === '') {
    showNotification('ກະລຸນາປ້ອນລະຫັດລູກຄ້າ', 'error');
    return;
  }

  try {
    await updateCustomerID(record.ind_sys_id, newCustomerId.value.trim());
    showNotification('ອັບເດດລະຫັດລູກຄ້າສຳເລັດ!', 'success');
    await loadHistory();
    cancelEdit();
  } catch (error: any) {
    showNotification(error.message || 'ອັບເດດບໍ່ສຳເລັດ', 'error');
  }
};

const viewHistoryDetail = (record: any) => {
  showNotification('ກຳລັງພັດທະນາ', 'info');
};

const getStatusClass = (status: string): string => {
  const statusLower = status?.toLowerCase() || '';
  if (statusLower.includes('match')) return 'matched';
  if (statusLower.includes('new')) return 'new';
  if (statusLower.includes('pending')) return 'pending';
  return 'default';
};

const formatDate = (dateStr?: string): string => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleString('lo-LA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Initialize user data
onMounted(() => {
  try {
    const userDataStr = localStorage.getItem('user_data');
    
    if (userDataStr) {
      userData.value = JSON.parse(userDataStr);
      userGID.value = userData.value?.GID?.GID || 0;
      userBankCode.value = userData.value?.MID?.id || '';
      isMember.value = userGID.value >= 6 && userGID.value <= 7;
      
      if (manualForm.value) {
        manualForm.value.bnk_code = userBankCode.value;
      }
      
      if (!userBankCode.value) {
        console.error('❌ ບໍ່ພົບລະຫັດທະນາຄານ (MID.id)');
      }
    }
  } catch (error) {
    console.error('ໂຫຼດຂໍ້ມູນຜູ້ໃຊ້ບໍ່ສຳເລັດ:', error);
  }
});
watch(filteredHistory, (newVal) => {
  console.log('👁️ Filtered History Changed:', newVal);
  newVal.forEach((record, index) => {
    console.log(`  ${index + 1}.`, {
      ind_sys_id: record.ind_sys_id,
      customer_id: record.customer_id,
      is_confirmed: record.is_confirmed,
      should_show_edit: record.is_confirmed && !record.customer_id
    });
  });
}, { deep: true });
</script>

<style scoped>
* { box-sizing: border-box; }

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

/* Tab Navigation */
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

/* Three Column Layout */
.three-column-layout {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.column-panel {
  display: flex;
  flex-direction: column;
}

/* Form Sections */
.form-section {
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  height: 100%;
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
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #cbd5e0;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.2s;
  background: white;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}

.form-group input.readonly-input {
  background: #edf2f7;
  color: #718096;
  cursor: not-allowed;
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

/* File Upload */
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
.batch-upload-section {
  max-width: 100%;
}

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

.summary-card.total { background: #4299e1; }
.summary-card.matched { background: #48bb78; }
.summary-card.new { background: #9f7aea; }
.summary-card.documents { background: #ed8936; }

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

.doc-badges {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.doc-badge {
  background: #e6f7ff;
  color: #1890ff;
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

.validation-errors {
  background: #fff5f5;
  border: 2px solid #feb2b2;
  border-radius: 10px;
  padding: 1.5rem;
  margin-top: 1.5rem;
}

.validation-errors h4 {
  color: #c53030;
  margin: 0 0 1rem 0;
}

.validation-errors ul {
  margin: 0;
  padding-left: 1.5rem;
}

.validation-errors li {
  color: #742a2a;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
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

/* History Filters */
.history-filters {
  background: #f9fafb;
  padding: 1.5rem;
  border-radius: 10px;
  margin-bottom: 1.5rem;
  border: 1px solid #e5e7eb;
}

.filter-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #374151;
}

.filter-group input,
.filter-group select {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
}

.filter-group input:focus,
.filter-group select:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}

.filter-actions {
  display: flex;
  justify-content: flex-end;
}

.btn-secondary-small {
  padding: 0.5rem 1rem;
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary-small:hover {
  background: #f3f4f6;
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

.stat-card.pending { background: #ed8936; }
.stat-card.approved { background: #48bb78; }
.stat-card.total { background: #4299e1; }

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

code {
  background: #f3f4f6;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.85rem;
}

.status-badge {
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
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

.status-badge.pending {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.default {
  background: #f3f4f6;
  color: #374151;
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

/* Customer ID Edit */
.customer-id-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-edit-id {
  padding: 0.25rem 0.5rem;
  background: #e0f2fe;
  border: 1px solid #bae6fd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.btn-edit-id:hover {
  background: #bae6fd;
}

.edit-customer-id {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.edit-input {
  padding: 0.375rem 0.5rem;
  border: 2px solid #4299e1;
  border-radius: 4px;
  font-size: 0.875rem;
  min-width: 120px;
}

.edit-input:focus {
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

.btn-link {
  color: #4299e1;
  text-decoration: none;
  font-size: 0.875rem;
}

.btn-link:hover {
  text-decoration: underline;
}

.text-muted {
  color: #a0aec0;
  font-size: 0.8rem;
}

.btn-action.view {
  background: #e0e7ff;
  color: #3730a3;
  padding: 0.4rem 0.6rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
}

.btn-action.view:hover {
  background: #c7d2fe;
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
@media (max-width: 1400px) {
  .three-column-layout {
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

  .summary-cards,
  .stats-cards {
    grid-template-columns: 1fr;
  }

  .filter-row {
    grid-template-columns: 1fr;
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