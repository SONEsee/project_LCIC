<template>
  <!-- User List -->
  <div v-if="!showAddForm && !showEditForm">
    <!-- Header with gradient -->
    <v-card class="mb-2 header-card" elevation="0">
      <v-card-text class="pa-4">
        <v-row class="align-center">
          <v-col cols="12" md="6" class="d-flex align-center">
            <div class="icon-wrapper mr-2">
              <v-icon size="32" color="white">mdi-account-group</v-icon>
            </div>
            <div>
              <h2 class="text-h4 font-weight-bold mb-1">ການຈັດການຜູ້ໃຊ້</h2>
              <p class="text-subtitle-2 text-grey-darken-1 mb-0">
                Manage all users in the system
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
              class="add-user-btn"
            >
              ເພີ່ມຜູ້ໃຊ້ໃໝ່
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- 🔍 Filter Section with Clear button -->
    <v-card class="mb-2 filter-card" elevation="2">
      <v-card-text class="pa-4">
        <div class="d-flex align-center justify-space-between mb-4">
          <div class="d-flex align-center">
            <v-icon color="primary" class="mr-2">mdi-filter-variant</v-icon>
            <h3 class="text-h6 font-weight-bold">ການຄົ້ນຫາ</h3>
          </div>
          <v-btn
            v-if="filterUsername || filterBnkCode"
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
          <!-- Username Search -->
          <v-col cols="12" md="6">
            <v-text-field
              v-model="filterUsername"
              label="ຄົ້ນຫາຕາມຊື່ຜູ້ໃຊ້"
              variant="outlined"
              density="comfortable"
              clearable
              prepend-inner-icon="mdi-account-search"
              placeholder="ປ້ອນຊື່ຜູ້ໃຊ້ເພື່ອຄົ້ນຫາ..."
              @keyup.enter="applyFilters"
              hide-details
            />
          </v-col>

          <!-- Bank Filter -->
          <v-col cols="12" md="4">
            <v-select
              v-model="filterBnkCode"
              :items="bankList"
              item-title="display_name"
              item-value="bnk_code"
              label="ເລືອກສະມາຊິກ"
              variant="outlined"
              density="comfortable"
              clearable
              prepend-inner-icon="mdi-bank"
              :loading="loadingBanks"
              placeholder="ເລືອກສະມາຊິກ..."
              hide-details
              @update:model-value="applyFilters"
            >
              <template v-slot:item="{ props, item }">
                <v-list-item v-bind="props">
                  <template v-slot:prepend>
                    <v-icon color="primary">mdi-bank</v-icon>
                  </template>
                </v-list-item>
              </template>
            </v-select>
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
        <v-row v-if="filterUsername || filterBnkCode" class="mt-2">
          <v-col cols="12">
            <div class="d-flex align-center flex-wrap gap-2">
              <span class="text-caption text-grey-darken-1">ຕົວກອງທີ່ໃຊ້:</span>
              <v-chip
                v-if="filterUsername"
                color="primary"
                variant="flat"
                size="small"
                closable
                @click:close="filterUsername = ''; applyFilters()"
              >
                <v-icon start size="small">mdi-account-search</v-icon>
                {{ filterUsername }}
              </v-chip>
              <v-chip
                v-if="filterBnkCode"
                color="info"
                variant="flat"
                size="small"
                closable
                @click:close="filterBnkCode = ''; applyFilters()"
              >
                <v-icon start size="small">mdi-bank</v-icon>
                {{ getBankDisplay(filterBnkCode) }}
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
          :items="paginatedUsers"
          item-value="UID"
          hide-default-footer
          class="elevation-0 modern-table"
          :loading="loading"
          :items-per-page="paginatedUsers.length"
        >
          <template v-slot:item.no="{ item }">
            <span class="font-weight-medium text-grey-darken-2">{{ item.no }}</span>
          </template>

          <template v-slot:item.profile_image="{ item }">
            <v-avatar size="45" class="my-2">
              <v-img v-if="item.profile_image" :src="getImageUrl(item.profile_image)" cover />
              <v-icon v-else color="grey">mdi-account-circle</v-icon>
            </v-avatar>
          </template>

          <template v-slot:item.username="{ item }">
            <div class="d-flex align-center">
              <span class="font-weight-medium">{{ item.username }}</span>
            </div>
          </template>

          <template v-slot:item.bnk_code="{ item }">
            <v-chip color="#040ea0" variant="tonal" size="small">
              {{ getBankDisplay(item.bnk_code) }}
            </v-chip>
          </template>

          <template v-slot:item.last_login="{ item }">
            <span class="text-body-2">{{ formatDate(item.last_login) }}</span>
          </template>

          <template v-slot:item.is_active="{ item }">
            <v-chip 
              :color="item.is_active === 't' || item.is_active === true ? 'success' : 'error'" 
              variant="tonal" 
              size="small"
            >
              {{ item.is_active === 't' || item.is_active === true ? 'ເຄື່ອນໄຫວ' : 'ບໍ່ເຄື່ອນໄຫວ' }}
            </v-chip>
          </template>

          <template v-slot:item.actions="{ item }">
            <div class="d-flex gap-2">
              <v-btn
                icon
                size="small"
                color="blue"
                variant="tonal"
                @click="editUser(item)"
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
        <div class="pa-4" v-if="totalUsers > 0">
          <v-row class="align-center">
            <v-col cols="12" md="4" class="text-center text-md-left">
              <div class="text-body-2 text-grey-darken-1">
                Showing 
                <span class="font-weight-bold" style="color: #040ea0">{{ paginationStart }}</span> - 
                <span class="font-weight-bold" style="color: #040ea0">{{ paginationEnd }}</span> of 
                <span class="font-weight-bold" style="color: #040ea0">{{ totalUsers }}</span> records
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
        <div v-if="!loading && totalUsers === 0" class="pa-8 text-center">
          <v-icon size="64" color="grey-lighten-1">mdi-account-off</v-icon>
          <p class="text-h6 text-grey-darken-1 mt-4">No users found</p>
          <p class="text-body-2 text-grey">Try adjusting your filters or add a new user</p>
        </div>
      </v-card-text>
    </v-card>
  </div>

  <!-- Add User Form -->
  <div v-else-if="showAddForm">
    <AddUserForm @close="showAddForm = false" @saved="onUserSaved" />
  </div>

  <!-- Edit User Form -->
  <div v-else-if="showEditForm">
    <EditUserForm
      :userData="selectedUser"
      @close="closeEditForm"
      @updated="onUserUpdated"
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
        <div class="text-center mb-3">
          <v-avatar size="100" class="mb-3">
            <v-img 
              v-if="userToDelete?.profile_image" 
              :src="getImageUrl(userToDelete.profile_image)" 
              cover 
            />
            <v-icon v-else size="100" color="grey">mdi-account-circle</v-icon>
          </v-avatar>
        </div>

        <div class="user-info-box pa-3 mb-3">
          <v-row dense>
            <v-col cols="12" class="mb-2">
              <div class="d-flex align-center">
                <v-icon size="20" color="primary" class="mr-2">mdi-account</v-icon>
                <span class="text-body-2 text-grey-darken-1 mr-2">ຊື່ຜູ້ໃຊ້:</span>
                <span class="font-weight-bold">{{ userToDelete?.username || '-' }}</span>
              </div>
            </v-col>
            <v-col cols="12" class="mb-2">
              <div class="d-flex align-center">
                <v-icon size="20" color="success" class="mr-2">mdi-text</v-icon>
                <span class="text-body-2 text-grey-darken-1 mr-2">ຊື່ເຕັມ (ລາວ):</span>
                <span class="font-weight-bold">{{ userToDelete?.fullNameL || '-' }}</span>
              </div>
            </v-col>
            <v-col cols="12" class="mb-2">
              <div class="d-flex align-center">
                <v-icon size="20" color="info" class="mr-2">mdi-text-box</v-icon>
                <span class="text-body-2 text-grey-darken-1 mr-2">ຊື່ເຕັມ (ອັງກິດ):</span>
                <span class="font-weight-bold">{{ userToDelete?.fullNameE || '-' }}</span>
              </div>
            </v-col>
            <v-col cols="12" v-if="userToDelete?.memberFullName">
              <div class="d-flex align-center">
                <v-icon size="20" color="warning" class="mr-2">mdi-bank</v-icon>
                <span class="text-body-2 text-grey-darken-1 mr-2">ສະມາຊິກ:</span>
                <span class="font-weight-bold">{{ userToDelete?.memberFullName }}</span>
              </div>
            </v-col>
          </v-row>
        </div>

        <p class="text-center text-body-1 mb-0">
          ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລົບຜູ້ໃຊ້ນີ້?
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
      <span>ລົບຜູ້ໃຊ້ສຳເລັດ!</span>
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
import AddUserForm from "./add_user.vue";
import EditUserForm from "./edit_user.vue";

const showAddForm = ref(false);
const showEditForm = ref(false);
const users = ref([]);
const allUsers = ref([]);
const selectedUser = ref(null);
const loading = ref(true);
const error = ref("");

const filterUsername = ref("");
const filterBnkCode = ref("");

const bankList = ref([]);
const bankMap = ref({});
const loadingBanks = ref(false);

// Delete Dialog States
const showDeleteDialog = ref(false);
const userToDelete = ref(null);
const deleting = ref(false);
const showSuccessSnackbar = ref(false);
const showErrorSnackbar = ref(false);
const errorMessage = ref("");

const headers = [
  { title: "ລຳດັບ", key: "no", sortable: false, width: "80px" },
  { title: "ຮູບພາບ", key: "profile_image", sortable: false, width: "100px" },
  { title: "ຊື່ຜູ້ໃຊ້", key: "username", sortable: true },
  { title: "ຊື່ສະມາຊິກ", key: "bnk_code", sortable: true },
  { title: "ຊື່ (ພາສາລາວ)", key: "fullNameL", sortable: true },
  { title: "ຊື່ (ພາສາອັງກິດ)", key: "fullNameE", sortable: true },
  { title: "ເຂົ້າສູ່ລະບົບຄັ້ງລ່າສຸດ", key: "last_login", sortable: true },
  { title: "ສະຖານະ", key: "is_active", sortable: true },
  { title: "ເຫດການ", key: "actions", sortable: false, align: "center" },
];

const config = useRuntimeConfig();
const apiURL = `${config.public.strapi.url}api/user/`;
const apiMemberURL = `${config.public.strapi.url}api/memberinfo/`;

const currentPage = ref(1);
const itemsPerPage = ref(10);
const rowsPerPageOptions = [10, 25, 50, 100];

const totalUsers = computed(() => allUsers.value.length);

const totalPages = computed(() => {
  return Math.ceil(totalUsers.value / itemsPerPage.value) || 1;
});

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return allUsers.value.slice(start, end).map((user, index) => ({
    ...user,
    no: start + index + 1,
    fullNameL: `${user.nameL || ''} ${user.surnameL || ''}`.trim() || '-',
    fullNameE: `${user.nameE || ''} ${user.surnameE || ''}`.trim() || '-',
  }));
});

const paginationStart = computed(() => {
  if (totalUsers.value === 0) return 0;
  return (currentPage.value - 1) * itemsPerPage.value + 1;
});

const paginationEnd = computed(() => {
  const end = currentPage.value * itemsPerPage.value;
  return Math.min(end, totalUsers.value);
});

watch(totalPages, (newTotalPages) => {
  if (currentPage.value > newTotalPages) {
    currentPage.value = Math.max(1, newTotalPages);
  }
});

const handleItemsPerPageChange = () => {
  currentPage.value = 1;
};

const fetchBankList = async () => {
  loadingBanks.value = true;
  try {
    const res = await axios.get(apiMemberURL);
    const banks = res.data.results || res.data;
    
    bankList.value = banks.map((m) => ({
      display_name: `${m.nameL} (${m.code || m.bnk_code}-${m.bnk_code})`,
      bnk_code: m.bnk_code,
    }));
    
    bankMap.value = banks.reduce((acc, m) => {
      acc[m.bnk_code] = {
        code: m.code || m.bnk_code,
        nameL: m.nameL,
        bnk_code: m.bnk_code,
        // Store full member info for delete dialog
        fullName: m.nameL || '-'
      };
      return acc;
    }, {});
  } catch (err) {
    console.error("Error fetching bank list:", err);
  } finally {
    loadingBanks.value = false;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateString;
  }
};

const getBankDisplay = (bnk_code) => {
  const bank = bankMap.value[bnk_code];
  if (bank && bank.code) {
    return `${bank.code} - ${bank.bnk_code}`;
  }
  return bnk_code || '-';
};

// Get full member name for delete dialog
const getMemberFullName = (bnk_code) => {
  const bank = bankMap.value[bnk_code];
  if (bank) {
    return `${bank.fullName} (${bank.code || bank.bnk_code}-${bank.bnk_code})`;
  }
  return bnk_code || '-';
};

const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  return `${config.public.strapi.url}${imagePath}`;
};

const fetchUsers = async () => {
  loading.value = true;
  try {
    let url = apiURL;
    const params = [];
    if (filterBnkCode.value) params.push(`bnk_code=${filterBnkCode.value}`);
    if (filterUsername.value) params.push(`username=${filterUsername.value}`);
    if (params.length) url += "?" + params.join("&");

    const res = await axios.get(url);
    allUsers.value = res.data.results || res.data;
    currentPage.value = 1;
  } catch (err) {
    console.error(err);
    error.value = "Cannot load user info.";
  } finally {
    loading.value = false;
  }
};

const applyFilters = () => {
  fetchUsers();
};

const clearFilter = () => {
  filterUsername.value = "";
  filterBnkCode.value = "";
  fetchUsers();
};

// Open Delete Dialog with member full name
const openDeleteDialog = (user) => {
  userToDelete.value = {
    ...user,
    fullNameL: `${user.nameL || ''} ${user.surnameL || ''}`.trim() || '-',
    fullNameE: `${user.nameE || ''} ${user.surnameE || ''}`.trim() || '-',
    memberFullName: getMemberFullName(user.bnk_code) // Add member full name
  };
  showDeleteDialog.value = true;
};

// Close Delete Dialog
const closeDeleteDialog = () => {
  showDeleteDialog.value = false;
  userToDelete.value = null;
};

// Confirm Delete
const confirmDelete = async () => {
  if (!userToDelete.value) return;
  
  deleting.value = true;
  try {
    await axios.delete(`${apiURL}${userToDelete.value.UID}/`);
    
    // Remove from list
    const indexToRemove = allUsers.value.findIndex((u) => u.UID === userToDelete.value.UID);
    if (indexToRemove !== -1) {
      allUsers.value.splice(indexToRemove, 1);
    }
    
    // Adjust page if needed
    if (paginatedUsers.value.length === 0 && currentPage.value > 1) {
      currentPage.value = currentPage.value - 1;
    }
    
    // Show success message
    showSuccessSnackbar.value = true;
    closeDeleteDialog();
  } catch (err) {
    console.error('Delete error:', err);
    errorMessage.value = err.response?.data?.message || 'ເກີດຂໍ້ຜິດພາດໃນການລົບຜູ້ໃຊ້!';
    showErrorSnackbar.value = true;
    closeDeleteDialog();
  } finally {
    deleting.value = false;
  }
};

const editUser = (user) => {
  selectedUser.value = user;
  showEditForm.value = true;
};

const closeEditForm = () => {
  showEditForm.value = false;
  selectedUser.value = null;
};

const onUserUpdated = () => {
  fetchUsers();
  showEditForm.value = false;
};

onMounted(async () => {
  await Promise.all([fetchUsers(), fetchBankList()]);
});

const onUserSaved = () => {
  fetchUsers();
  showAddForm.value = false;
};
</script>

<style scoped>
.user-management-container {
  background: #f5f7fa;
  min-height: 100vh;
}

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

.add-user-btn {
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
  background: #0711a0 !important;
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

.user-info-box {
  background: #f5f5f5;
  border-radius: 12px;
  border-left: 4px solid #d32f2f;
}
</style>