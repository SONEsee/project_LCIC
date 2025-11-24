<template>
  <!-- Fee List -->
  <div v-if="!showAddForm && !showEditForm">
    <!-- Header with gradient -->
    <v-card class="mb-2 header-card" elevation="0">
      <v-card-text class="pa-4">
        <v-row class="align-center">
          <v-col cols="12" md="6" class="d-flex align-center">
            <div class="icon-wrapper mr-2">
              <v-icon size="32" color="white">mdi-cash-multiple</v-icon>
            </div>
            <div>
              <h2 class="text-h5 font-weight-bold mb-1">ການຈັດການຄ່າທຳນຽມ</h2>
              <p class="text-subtitle-2  mb-0">
                Manage all fees and charges in the system
              </p>
            </div>
          </v-col>
          <v-col cols="12" md="6" class="d-flex justify-end">
            <v-btn
              color="#3D5AFE"
              size="large"
              elevation="2"
              @click="showAddForm = true"
              prepend-icon="mdi-plus-circle"
              class="add-fee-btn"
            >
              ເພີ່ມຄ່າທຳນຽມໃໝ່
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- 🔍 Filter Section -->
    <v-card class="mb-2 filter-card" elevation="2">
      <v-card-text class="pa-4">
        <div class="d-flex align-center justify-space-between mb-4">
          <div class="d-flex align-center">
            <v-icon color="primary" class="mr-2">mdi-filter-variant</v-icon>
            <h3 class="text-h6 font-weight-bold">ການຄົ້ນຫາ</h3>
          </div>
          <v-btn
            v-if="filterCode || filterType"
            color="error"
            variant="tonal"
            size="small"
            @click="clearFilter"
            prepend-icon="mdi-filter-off"
          >
            ລ້າງການຄົ້ນຫາ
          </v-btn>
        </div>
        <v-row>
          <!-- Code Search -->
          <v-col cols="12" md="5">
            <v-text-field
              v-model="filterCode"
              label="ຄົ້ນຫາຕາມລະຫັດ"
              variant="outlined"
              density="comfortable"
              clearable
              prepend-inner-icon="mdi-identifier"
              placeholder="ປ້ອນລະຫັດຄ່າທຳນຽມ..."
              @keyup.enter="applyFilters"
              hide-details
            />
          </v-col>

          <!-- Type Search -->
          <v-col cols="12" md="5">
            <v-text-field
              v-model="filterType"
              label="ຄົ້ນຫາຕາມປະເພດ"
              variant="outlined"
              density="comfortable"
              clearable
              prepend-inner-icon="mdi-tag-text"
              placeholder="ປ້ອນປະເພດຄ່າທຳນຽມ..."
              @keyup.enter="applyFilters"
              hide-details
            />
          </v-col>

          <!-- Search Button -->
          <v-col cols="12" md="2" class="d-flex align-center">
            <v-btn
              color="#3D5AFE"
              @click="applyFilters"
              prepend-icon="mdi-magnify"
              elevation="1"
              block
              size="large"
            >
              ຄົ້ນຫາ
            </v-btn>
          </v-col>
        </v-row>

        <!-- Active Filters Display -->
        <v-row v-if="filterCode || filterType" class="mt-2">
          <v-col cols="12">
            <div class="d-flex align-center flex-wrap gap-2">
              <span class="text-caption text-grey-darken-1">ຕົວກອງທີ່ໃຊ້:</span>
              <v-chip
                v-if="filterCode"
                color="primary"
                variant="flat"
                size="small"
                closable
                @click:close="filterCode = ''; applyFilters()"
              >
                <v-icon start size="small">mdi-identifier</v-icon>
                {{ filterCode }}
              </v-chip>
              <v-chip
                v-if="filterType"
                color="info"
                variant="flat"
                size="small"
                closable
                @click:close="filterType = ''; applyFilters()"
              >
                <v-icon start size="small">mdi-tag-text</v-icon>
                {{ filterType }}
              </v-chip>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Table Card -->
    <v-card elevation="2" class="table-card">
      <v-card-text class="pa-0">
        <v-data-table
          :headers="headers"
          :items="paginatedFees"
          item-value="chg_sys_id"
          hide-default-footer
          class="elevation-0 modern-table"
          :loading="loading"
          :items-per-page="paginatedFees.length"
        >
          <template v-slot:item.no="{ item }">
            <span class="font-weight-medium text-grey-darken-2">{{ item.no }}</span>
          </template>

          <template v-slot:item.chg_code="{ item }">
            <v-chip color="#040ea0" variant="tonal" size="small">
              {{ item.chg_code }}
            </v-chip>
          </template>

          <template v-slot:item.chg_lao_type="{ item }">
            <div>
              <div class="font-weight-medium">{{ item.chg_lao_type }}</div>
            </div>
          </template>

          <template v-slot:item.chg_type="{ item }">
            <div>
              <div class="text-body-2">{{ item.chg_type }}</div>
            </div>
          </template>

          <template v-slot:item.chg_amount="{ item }">
            <div class="d-flex align-center">
              <span class="font-weight-bold " style="color: #040ea0">{{ formatAmount(item.chg_amount) }}</span>
              <v-chip color="#040ea0" variant="tonal" size="x-small" class="ml-2">
                {{ item.chg_unit }}
              </v-chip>
            </div>
          </template>

          <template v-slot:item.actions="{ item }">
            <div class="d-flex gap-2">
              <v-btn
                icon
                size="small"
                color="blue"
                variant="tonal"
                @click="editFee(item)"
              >
                <v-icon size="18">mdi-pencil</v-icon>
                <v-tooltip activator="parent" location="top">ແກ້ໄຂ</v-tooltip>
              </v-btn>
              <v-btn
                icon
                size="small"
                color="red"
                variant="tonal"
                @click="openDeleteDialog(item)"
              >
                <v-icon size="18">mdi-delete</v-icon>
                <v-tooltip activator="parent" location="top">ລົບ</v-tooltip>
              </v-btn>
            </div>
          </template>

          <template v-slot:loading>
            <v-skeleton-loader type="table-row@5"></v-skeleton-loader>
          </template>
        </v-data-table>

        <!-- Smooth Pagination Footer -->
        <v-divider></v-divider>
        <div class="pa-4" v-if="totalFees > 0">
          <v-row class="align-center">
            <v-col cols="12" md="4" class="text-center text-md-left">
              <div class="text-body-2 text-grey-darken-1">
                Showing 
                <span class="font-weight-bold" style="color: #040ea0">{{ paginationStart }}</span> - 
                <span class="font-weight-bold" style="color: #040ea0">{{ paginationEnd }}</span> of 
                <span class="font-weight-bold" style="color: #040ea0">{{ totalFees }}</span> records
              </div>
            </v-col>
            <v-col cols="12" md="8" class="d-flex justify-center justify-md-end align-center flex-wrap gap-4">
              <div class="d-flex align-center gap-2">
                <span class="text-body-2 text-grey-darken-1">Rows:</span>
                <v-select
                  v-model="itemsPerPage"
                  :items="rowsPerPageOptions"
                  density="compact"
                  variant="outlined"
                  hide-details
                  style="width: 90px"
                  @update:model-value="handleItemsPerPageChange"
                ></v-select>
              </div>
              <v-pagination
                v-model="currentPage"
                :length="totalPages"
                :total-visible="6"
                size="small"
                rounded="circle"
              ></v-pagination>
            </v-col>
          </v-row>
        </div>

        <!-- Empty state -->
        <div v-if="!loading && totalFees === 0" class="pa-8 text-center">
          <v-icon size="64" color="grey-lighten-1">mdi-cash-remove</v-icon>
          <p class="text-h6 text-grey-darken-1 mt-4">No fees found</p>
          <p class="text-body-2 text-grey">Try adjusting your filters or add a new fee</p>
        </div>
      </v-card-text>
    </v-card>
  </div>

  <!-- Add Fee Form -->
  <div v-else-if="showAddForm">
    <AddFeeForm @close="showAddForm = false" @saved="onFeeSaved" />
  </div>

  <!-- Edit Fee Form -->
  <div v-else-if="showEditForm">
    <EditFeeForm
      :feeData="selectedFee"
      @close="closeEditForm"
      @updated="onFeeUpdated"
    />
  </div>

  <!-- 🗑️ Delete Confirmation Dialog -->
  <v-dialog v-model="showDeleteDialog" max-width="450" persistent>
    <v-card class="delete-dialog-card" elevation="8">
      <!-- Header -->
      <v-card-title class="delete-dialog-header pa-4">
        <div class="d-flex align-center">
          <div class="delete-icon-wrapper">
            <v-icon size="28" color="white">mdi-alert-circle-outline</v-icon>
          </div>
          <div class="ml-3">
            <h2 class="text-h5 font-weight-bold text-white mb-1">ຢືນຢັນການລົບ</h2>
            <p class="text-body-2 text-white opacity-90 mb-0">ກະລຸນາກວດສອບຂໍ້ມູນກ່ອນລົບ</p>
          </div>
        </div>
      </v-card-title>

      <!-- Content -->
      <v-card-text class="pa-4">
        <div class="fee-info-box pa-3 mb-3">
          <v-row dense>
            <v-col cols="12" class="mb-2">
              <div class="d-flex align-center">
                <v-icon size="20" color="primary" class="mr-2">mdi-identifier</v-icon>
                <span class="text-body-2 text-grey-darken-1 mr-2">ລະຫັດ:</span>
                <span class="font-weight-bold">{{ feeToDelete?.chg_code }}</span>
              </div>
            </v-col>
            <v-col cols="12" class="mb-2">
              <div class="d-flex align-center">
                <v-icon size="20" color="success" class="mr-2">mdi-tag-text</v-icon>
                <span class="text-body-2 text-grey-darken-1 mr-2">ປະເພດ:</span>
                <span class="font-weight-bold">{{ feeToDelete?.chg_lao_type }}</span>
              </div>
            </v-col>
            <v-col cols="12">
              <div class="d-flex align-center">
                <v-icon size="20" color="warning" class="mr-2">mdi-currency-usd</v-icon>
                <span class="text-body-2 text-grey-darken-1 mr-2">ຈຳນວນເງິນ:</span>
                <span class="font-weight-bold text-success">
                  {{ formatAmount(feeToDelete?.chg_amount) }} {{ feeToDelete?.chg_unit }}
                </span>
              </div>
            </v-col>
          </v-row>
        </div>

        <p class="text-center text-body-1 mb-0">
          ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລົບຄ່າທຳນຽມນີ້?
        </p>
      </v-card-text>

      <!-- Actions -->
      <v-card-actions class="pa-4 pt-0">
        <v-btn
          color="grey-darken-1"
          variant="text"
          size="large"
          @click="closeDeleteDialog"
          :disabled="deleting"
          class="flex-grow-1"
        >
          <v-icon left>mdi-close</v-icon>
          ຍົກເລີກ
        </v-btn>
        <v-btn
          color="#d32f2f"
          variant="flat"
          size="large"
          @click="confirmDelete"
          :loading="deleting"
          class="flex-grow-1"
        >
          <v-icon left>mdi-delete</v-icon>
          ຢືນຢັນການລົບ
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Success Snackbar -->
  <v-snackbar
    v-model="showSuccessSnackbar"
    color="success"
    location="top"
    :timeout="3000"
  >
    <div class="d-flex align-center">
      <v-icon class="mr-2">mdi-check-circle</v-icon>
      <span>{{ successMessage }}</span>
    </div>
  </v-snackbar>

  <!-- Error Snackbar -->
  <v-snackbar
    v-model="showErrorSnackbar"
    color="error"
    location="top"
    :timeout="3000"
  >
    <div class="d-flex align-center">
      <v-icon class="mr-2">mdi-alert-circle</v-icon>
      <span>{{ errorMessage }}</span>
    </div>
  </v-snackbar>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import axios from "axios";
import AddFeeForm from "./add_fee.vue";
import EditFeeForm from "./edit_fee.vue";

const showAddForm = ref(false);
const showEditForm = ref(false);
const fees = ref([]);
const allFees = ref([]);
const selectedFee = ref(null);
const loading = ref(true);
const error = ref("");

const filterCode = ref("");
const filterType = ref("");

// Delete Dialog States
const showDeleteDialog = ref(false);
const feeToDelete = ref(null);
const deleting = ref(false);
const showSuccessSnackbar = ref(false);
const showErrorSnackbar = ref(false);
const successMessage = ref("");
const errorMessage = ref("");

const headers = [
  { title: "ລຳດັບ", key: "no", sortable: false, width: "80px" },
  { title: "ລະຫັດ", key: "chg_code", sortable: true },
  { title: "ຊື່ພາສາລາວ", key: "chg_lao_type", sortable: true },
  { title: "ຊື່ພາສາລາວ", key: "chg_type", sortable: true },
  { title: "ຈຳນວນເງິນ", key: "chg_amount", sortable: true },
  { title: "ເຫດການ", key: "actions", sortable: false, align: "center", width: "120px" },
];

const config = useRuntimeConfig();
const apiFeeURL = `${config.public.strapi.url}api/charge-matrix/`;

const currentPage = ref(1);
const itemsPerPage = ref(10);
const rowsPerPageOptions = [10, 25, 50, 100];

const totalFees = computed(() => allFees.value.length);

const totalPages = computed(() => {
  return Math.ceil(totalFees.value / itemsPerPage.value) || 1;
});

const paginatedFees = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return allFees.value.slice(start, end).map((fee, index) => ({
    ...fee,
    no: start + index + 1,
  }));
});

const paginationStart = computed(() => {
  if (totalFees.value === 0) return 0;
  return (currentPage.value - 1) * itemsPerPage.value + 1;
});

const paginationEnd = computed(() => {
  const end = currentPage.value * itemsPerPage.value;
  return Math.min(end, totalFees.value);
});

watch(totalPages, (newTotalPages) => {
  if (currentPage.value > newTotalPages) {
    currentPage.value = Math.max(1, newTotalPages);
  }
});

const handleItemsPerPageChange = () => {
  currentPage.value = 1;
};

// Format amount with thousand separator
const formatAmount = (amount) => {
  if (amount === null || amount === undefined) return '0.00';
  return parseFloat(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

const fetchFees = async () => {
  loading.value = true;
  try {
    const res = await axios.get(apiFeeURL);
    let feesList = res.data.results || res.data;

    // Apply filters
    if (filterCode.value) {
      feesList = feesList.filter(f => 
        f.chg_code.toLowerCase().includes(filterCode.value.toLowerCase())
      );
    }
    if (filterType.value) {
      feesList = feesList.filter(f => 
        f.chg_type.toLowerCase().includes(filterType.value.toLowerCase()) ||
        f.chg_lao_type.toLowerCase().includes(filterType.value.toLowerCase())
      );
    }

    allFees.value = feesList;
    currentPage.value = 1;
  } catch (err) {
    console.error(err);
    error.value = "Cannot load fee info.";
    errorMessage.value = "ບໍ່ສາມາດໂຫຼດຂໍ້ມູນຄ່າທຳນຽມໄດ້";
    showErrorSnackbar.value = true;
  } finally {
    loading.value = false;
  }
};

const applyFilters = () => {
  fetchFees();
};

const clearFilter = () => {
  filterCode.value = "";
  filterType.value = "";
  fetchFees();
};

// Open Delete Dialog
const openDeleteDialog = (fee) => {
  feeToDelete.value = { ...fee };
  showDeleteDialog.value = true;
};

// Close Delete Dialog
const closeDeleteDialog = () => {
  showDeleteDialog.value = false;
  feeToDelete.value = null;
};

// Confirm Delete
const confirmDelete = async () => {
  if (!feeToDelete.value) return;
  
  deleting.value = true;
  try {
    await axios.delete(`${apiFeeURL}${feeToDelete.value.chg_sys_id}/`);
    
    // Remove from list
    const indexToRemove = allFees.value.findIndex((f) => f.chg_sys_id === feeToDelete.value.chg_sys_id);
    if (indexToRemove !== -1) {
      allFees.value.splice(indexToRemove, 1);
    }
    
    // Adjust page if needed
    if (paginatedFees.value.length === 0 && currentPage.value > 1) {
      currentPage.value = currentPage.value - 1;
    }
    
    // Show success message
    successMessage.value = "ລົບຄ່າທຳນຽມສຳເລັດ!";
    showSuccessSnackbar.value = true;
    closeDeleteDialog();
  } catch (err) {
    console.error('Delete error:', err);
    errorMessage.value = err.response?.data?.message || 'ເກີດຂໍ້ຜິດພາດໃນການລົບຄ່າທຳນຽມ!';
    showErrorSnackbar.value = true;
    closeDeleteDialog();
  } finally {
    deleting.value = false;
  }
};

const editFee = (fee) => {
  selectedFee.value = fee;
  showEditForm.value = true;
};

const closeEditForm = () => {
  showEditForm.value = false;
  selectedFee.value = null;
};

const onFeeUpdated = () => {
  fetchFees();
  showEditForm.value = false;
  successMessage.value = "ອັບເດດຄ່າທຳນຽມສຳເລັດ!";
  showSuccessSnackbar.value = true;
};

const onFeeSaved = () => {
  fetchFees();
  showAddForm.value = false;
  successMessage.value = "ເພີ່ມຄ່າທຳນຽມສຳເລັດ!";
  showSuccessSnackbar.value = true;
};

onMounted(() => {
  fetchFees();
});
</script>

<style scoped>
.header-card {
  background: linear-gradient(135deg, #2931a5 0%, #2233a1 100%);
  color: white;
  border-radius: 16px !important;
}

.icon-wrapper {
  background: rgba(255, 255, 255, 0.2);
  padding: 12px;
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.filter-card {
  border-radius: 16px !important;
  border: 1px solid #e0e0e0;
}

.table-card {
  border-radius: 16px !important;
  border: 1px solid #e0e0e0;
  overflow: hidden;
}

.add-fee-btn {
  text-transform: none;
  letter-spacing: 0;
  border-radius: 8px;
}

.modern-table :deep(thead) {
  background: linear-gradient(135deg, #2931a5 0%, #2233a1 100%);
  color: white;
}

.modern-table :deep(thead tr) {
  height: 50px;
}

.modern-table :deep(th) {
  font-weight: 600 !important;
  color: white !important;
  text-transform: uppercase;
  font-size: 13px !important;
  letter-spacing: 0.5px;
  padding: 0 14px !important;
}

.modern-table :deep(tbody tr:hover) {
  background: #f8f9fa !important;
  transition: background-color 0.2s ease;
}

.modern-table :deep(td) {
  padding: 16px !important;
}

:deep(.v-pagination__item) {
  border-radius: 8px;
  transition: all 0.2s ease;
}

:deep(.v-pagination__item--is-active) {
  background: #1565c0 !important;
  color: white;
}

:deep(.v-pagination__item:hover) {
  transform: translateY(-2px);
}

/* Delete Dialog Styles */
.delete-dialog-card {
  border-radius: 16px !important;
  overflow: hidden;
}

.delete-dialog-header {
  background: linear-gradient(135deg, #d32f2f 0%, #c62828 100%);
}

.delete-icon-wrapper {
  background: rgba(255, 255, 255, 0.2);
  padding: 12px;
  border-radius: 12px;
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.fee-info-box {
  background: #f5f5f5;
  border-radius: 12px;
  border-left: 4px solid #d32f2f;
}
</style>