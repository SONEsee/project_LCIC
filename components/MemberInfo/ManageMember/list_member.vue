<template>
  <!-- Member List -->
  <div v-if="!showAddForm && !showEditForm">
    <!-- Header with gradient -->
    <v-card class="mb-2 header-card" elevation="0">
      <v-card-text class="pa-4">
        <v-row class="align-center">
          <v-col cols="12" md="6" class="d-flex align-center">
            <div class="icon-wrapper mr-2">
              <v-icon size="28" color="white">mdi-account-group</v-icon>
            </div>
            <div>
              <h2 class="text-h5 font-weight-bold mb-1">ການຈັດການສະມາຊິກ</h2>
              <p class="text-subtitle-2 text-grey-darken-1 mb-0">
                Manage all members in the system
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
              class="add-member-btn"
            >
              ເພີ່ມສະມາຊິກໃໝ່
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
            v-if="filterSearch || filterMemberType"
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
          <!-- Search Box -->
          <v-col cols="12" md="6">
            <v-text-field
              v-model="filterSearch"
              label="ຄົ້ນຫາຕາມຕົວຫຍໍ້, ລະຫັດທະນາຄານ, ຫຼື ຊື່"
              variant="outlined"
              density="comfortable"
              clearable
              prepend-inner-icon="mdi-magnify"
              placeholder="ປ້ອນລະຫັດ, ລະຫັດທະນາຄານ, ຫຼື ຊື່ເພື່ອຄົ້ນຫາ..."
              @keyup.enter="applyFilters"
              hide-details
            />
          </v-col>

          <!-- Member Type Filter -->
          <v-col cols="12" md="4">
            <v-select
              v-model="filterMemberType"
              :items="memberTypes"
              item-title="nameL"
              item-value="id"
              label="ປະເພດສະມາຊິກ"
              variant="outlined"
              density="comfortable"
              clearable
              prepend-inner-icon="mdi-account-multiple"
              placeholder="ເລືອກປະເພດສະມາຊິກ..."
              hide-details
              @update:model-value="applyFilters"
            >
              <template v-slot:item="{ props, item }">
                <v-list-item v-bind="props">
                  <template v-slot:prepend>
                    <v-icon color="primary">mdi-tag</v-icon>
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
        <v-row v-if="filterSearch || filterMemberType" class="mt-2">
          <v-col cols="12">
            <div class="d-flex align-center flex-wrap gap-2">
              <span class="text-caption text-grey-darken-1">ຕົວກອງທີ່ໃຊ້:</span>
              <v-chip
                v-if="filterSearch"
                color="primary"
                variant="flat"
                size="small"
                closable
                @click:close="filterSearch = ''; applyFilters()"
              >
                <v-icon start size="small">mdi-magnify</v-icon>
                {{ filterSearch }}
              </v-chip>
              <v-chip
                v-if="filterMemberType"
                color="info"
                variant="flat"
                size="small"
                closable
                @click:close="filterMemberType = null; applyFilters()"
              >
                <v-icon start size="small">mdi-account-multiple</v-icon>
                {{ getMemberTypeName(filterMemberType) }}
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
          :items="paginatedMembers"
          item-value="id"
          hide-default-footer
          class="elevation-0 modern-table"
          :loading="loading"
          :items-per-page="paginatedMembers.length"
        >
          <template v-slot:item.no="{ item }">
            <span class="font-weight-medium text-grey-darken-2">{{ item.no }}</span>
          </template>

          <template v-slot:item.mImage="{ item }">
            <v-avatar size="45" class="my-2">
              <v-img v-if="item.mImage" :src="getImageUrl(item.mImage)" cover />
              <v-icon v-else color="grey">mdi-account-circle</v-icon>
            </v-avatar>
          </template>

          <template v-slot:item.code="{ item }">
            <v-chip color="#040ea0" variant="tonal" size="small">
              {{ item.code }}
            </v-chip>
          </template>

          <template v-slot:item.bnk_code="{ item }">
            <v-chip color="primary" variant="outlined" size="small">
              {{ item.bnk_code }}
            </v-chip>
          </template>

          <template v-slot:item.memberType="{ item }">
            <v-chip v-if="item.memberType" color="info" variant="tonal" size="small">
              {{ item.memberType.nameL }}
            </v-chip>
            <span v-else class="text-grey">-</span>
          </template>

          <template v-slot:item.published="{ item }">
            <v-chip 
              :color="item.published ? 'success' : 'error'" 
              variant="tonal" 
              size="small"
            >
              {{ item.published ? 'ເຜີຍແຜ່' : 'ບໍ່ເຜີຍແຜ່' }}
            </v-chip>
          </template>

          <template v-slot:item.dateRegis="{ item }">
            <span class="text-body-2">{{ formatDate(item.dateRegis) }}</span>
          </template>

          <template v-slot:item.actions="{ item }">
            <div class="d-flex gap-2">
              <v-btn
                icon
                size="small"
                color="blue"
                variant="tonal"
                @click="editMember(item)"
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
        <div class="pa-4" v-if="totalMembers > 0">
          <v-row class="align-center">
            <v-col cols="12" md="4" class="text-center text-md-left">
              <div class="text-body-2 text-grey-darken-1">
                Showing 
                <span class="font-weight-bold" style="color: #040ea0">{{ paginationStart }}</span> - 
                <span class="font-weight-bold" style="color: #040ea0">{{ paginationEnd }}</span> of 
                <span class="font-weight-bold" style="color: #040ea0">{{ totalMembers }}</span> records
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
        <div v-if="!loading && totalMembers === 0" class="pa-8 text-center">
          <v-icon size="64" color="grey-lighten-1">mdi-account-off</v-icon>
          <p class="text-h6 text-grey-darken-1 mt-4">No members found</p>
          <p class="text-body-2 text-grey">Try adjusting your filters or add a new member</p>
        </div>
      </v-card-text>
    </v-card>
  </div>

  <!-- Add Member Form -->
  <div v-else-if="showAddForm">
    <add-member-form @close="showAddForm = false" @saved="onMemberSaved" />
  </div>

  <!-- Edit Member Form -->
  <div v-else-if="showEditForm">
    <edit-member-form
      :memberData="selectedMember"
      @close="closeEditForm"
      @updated="onMemberUpdated"
    />
  </div>

  <!-- 🗑️ Delete Confirmation Dialog -->
  <v-dialog v-model="showDeleteDialog" max-width="400" persistent>
    <v-card class="delete-dialog-card" elevation="8">
      <!-- Header -->
      <v-card-title class="delete-dialog-header pa-2">
        <div class="d-flex align-center">
          <div class="delete-icon-wrapper">
            <v-icon size="25" color="white">mdi-alert-circle-outline</v-icon>
          </div>
          <div class="ml-4">
            <h2 class="text-h5 font-weight-bold text-white mb-1">ຢືນຢັນການລົບ</h2>
            <p class="text-body-2 text-white opacity-90 mb-0">ກະລຸນາກວດສອບຂໍ້ມູນກ່ອນລົບ</p>
          </div>
        </div>
      </v-card-title>

      <!-- Content -->
      <v-card-text class="pa-4">
        <div class="text-center mb-2">
          <v-avatar size="80" class="mb-3">
            <v-img 
              v-if="memberToDelete?.mImage" 
              :src="getImageUrl(memberToDelete.mImage)" 
              cover 
            />
            <v-icon v-else size="80" color="grey">mdi-account-circle</v-icon>
          </v-avatar>
        </div>

        <div class="member-info-box pa-2 mb-2">
          <v-row dense>
            <v-col cols="12" class="mb-2">
              <div class="d-flex align-center">
                <v-icon size="20" color="primary" class="mr-2">mdi-code-tags</v-icon>
                <span class="text-body-2 text-grey-darken-1 mr-2">ຕົວຫຍໍ້:</span>
                <span class="font-weight-bold">{{ memberToDelete?.code }}</span>
              </div>
            </v-col>
            <v-col cols="12" class="mb-2">
              <div class="d-flex align-center">
                <v-icon size="20" color="info" class="mr-2">mdi-bank</v-icon>
                <span class="text-body-2 text-grey-darken-1 mr-2">ລະຫັດທະນາຄານ:</span>
                <span class="font-weight-bold">{{ memberToDelete?.bnk_code }}</span>
              </div>
            </v-col>
            <v-col cols="12" class="mb-2">
              <div class="d-flex align-center">
                <v-icon size="20" color="success" class="mr-2">mdi-text</v-icon>
                <span class="text-body-2 text-grey-darken-1 mr-2">ຊື່ (ລາວ):</span>
                <span class="font-weight-bold">{{ memberToDelete?.nameL }}</span>
              </div>
            </v-col>
            <v-col cols="12">
              <div class="d-flex align-center">
                <v-icon size="20" color="warning" class="mr-2">mdi-text-box</v-icon>
                <span class="text-body-2 text-grey-darken-1 mr-2">ຊື່ (ອັງກິດ):</span>
                <span class="font-weight-bold">{{ memberToDelete?.nameE }}</span>
              </div>
            </v-col>
          </v-row>
        </div>
      </v-card-text>

      <!-- Actions -->
      <v-card-actions class="pa-6 pt-0">
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
      <span>ລົບສະມາຊິກສຳເລັດ!</span>
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
import AddMemberForm from "./add_member.vue";
import EditMemberForm from "./edit_member.vue";

const showAddForm = ref(false);
const showEditForm = ref(false);
const members = ref([]);
const allMembers = ref([]);
const selectedMember = ref(null);
const loading = ref(true);
const error = ref("");

const filterSearch = ref("");
const filterMemberType = ref(null);

const memberTypes = ref([]);

// Delete Dialog States
const showDeleteDialog = ref(false);
const memberToDelete = ref(null);
const deleting = ref(false);
const showSuccessSnackbar = ref(false);
const showErrorSnackbar = ref(false);
const errorMessage = ref("");

const headers = [
  { title: "ລຳດັບ", key: "no", sortable: false, width: "80px" },
  { title: "ຮູບພາບ", key: "mImage", sortable: false, width: "100px" },
  { title: "ອັກສອນຫຍໍ້", key: "code", sortable: true },
  { title: "ລະຫັດທະນາຄານ", key: "bnk_code", sortable: true },
  { title: "ຊື່ (ລາວ)", key: "nameL", sortable: true },
  { title: "ຊື່ (ອັງກິດ)", key: "nameE", sortable: true },
  { title: "ປະເພດ", key: "memberType", sortable: true },
  { title: "ສະຖານະ", key: "published", sortable: true },
  { title: "ວັນທີລົງທະບຽນ", key: "dateRegis", sortable: true },
  { title: "ເຫດການ", key: "actions", sortable: false, align: "center" },
];

const config = useRuntimeConfig();
const apiURL = `${config.public.strapi.url}api/member_list/`;
const apiTypeURL = `${config.public.strapi.url}api/membertypes/`;

const currentPage = ref(1);
const itemsPerPage = ref(10);
const rowsPerPageOptions = [10, 25, 50, 100];

const totalMembers = computed(() => allMembers.value.length);

const totalPages = computed(() => {
  return Math.ceil(totalMembers.value / itemsPerPage.value) || 1;
});

const paginatedMembers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return allMembers.value.slice(start, end).map((member, index) => ({
    ...member,
    no: start + index + 1,
  }));
});

const paginationStart = computed(() => {
  if (totalMembers.value === 0) return 0;
  return (currentPage.value - 1) * itemsPerPage.value + 1;
});

const paginationEnd = computed(() => {
  const end = currentPage.value * itemsPerPage.value;
  return Math.min(end, totalMembers.value);
});

watch([showAddForm, showEditForm], ([newShowAdd, newShowEdit], [oldShowAdd, oldShowEdit]) => {
  // เมื่อปิดฟอร์ม Add หรือ Edit (กลับมาหน้ารายการ)
  if ((oldShowAdd && !newShowAdd) || (oldShowEdit && !newShowEdit)) {
    console.log('🔄 Returning to list - Refreshing data...');
    fetchMembers(); // Refresh ข้อมูลอัตโนมัติ
  }
});

watch(totalPages, (newTotalPages) => {
  if (currentPage.value > newTotalPages) {
    currentPage.value = Math.max(1, newTotalPages);
  }
});

const handleItemsPerPageChange = () => {
  currentPage.value = 1;
};

const fetchMemberTypes = async () => {
  try {
    const res = await axios.get(apiTypeURL);
    memberTypes.value = res.data.results || res.data;
  } catch (err) {
    console.error("Error fetching member types:", err);
  }
};

const getMemberTypeName = (typeId) => {
  const type = memberTypes.value.find(t => t.id === typeId);
  return type ? type.nameL : '';
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  } catch {
    return dateString;
  }
};

const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  return `${config.public.strapi.url}${imagePath}`;
};

const fetchMembers = async () => {
  loading.value = true;
  try {
    let url = apiURL;
    const params = [];
    
    if (filterSearch.value) {
      params.push(`search=${encodeURIComponent(filterSearch.value)}`);
    }
    
    if (filterMemberType.value) {
      params.push(`member_type=${filterMemberType.value}`);
    }
    
    if (params.length) url += "?" + params.join("&");

    console.log('🔍 Fetching URL:', url);

    const res = await axios.get(url);
    allMembers.value = res.data.results || res.data;
    currentPage.value = 1;
  } catch (err) {
    console.error(err);
    error.value = "Cannot load member info.";
  } finally {
    loading.value = false;
  }
};

const applyFilters = () => {
  fetchMembers();
};

const clearFilter = () => {
  filterSearch.value = "";
  filterMemberType.value = null;
  fetchMembers();
};

// Open Delete Dialog
const openDeleteDialog = (member) => {
  memberToDelete.value = { ...member };
  showDeleteDialog.value = true;
};

// Close Delete Dialog
const closeDeleteDialog = () => {
  showDeleteDialog.value = false;
  memberToDelete.value = null;
};

// Confirm Delete
const confirmDelete = async () => {
  if (!memberToDelete.value) return;
  
  deleting.value = true;
  try {
    await axios.delete(`${apiURL}${memberToDelete.value.id}/`);
    
    // Remove from list
    const indexToRemove = allMembers.value.findIndex((m) => m.id === memberToDelete.value.id);
    if (indexToRemove !== -1) {
      allMembers.value.splice(indexToRemove, 1);
    }
    
    // Adjust page if needed
    if (paginatedMembers.value.length === 0 && currentPage.value > 1) {
      currentPage.value = currentPage.value - 1;
    }
    
    // Show success message
    showSuccessSnackbar.value = true;
    closeDeleteDialog();
  } catch (err) {
    console.error('Delete error:', err);
    errorMessage.value = err.response?.data?.message || 'ເກີດຂໍ້ຜິດພາດໃນການລົບສະມາຊິກ!';
    showErrorSnackbar.value = true;
  } finally {
    deleting.value = false;
  }
};

const editMember = (member) => {
  selectedMember.value = member;
  showEditForm.value = true;
};

const closeEditForm = () => {
  showEditForm.value = false;
  selectedMember.value = null;
};

const onMemberUpdated = () => {
  fetchMembers();
  showEditForm.value = false;
};

const onMemberSaved = () => {
  fetchMembers();
  showAddForm.value = false;
};

onMounted(async () => {
  await Promise.all([fetchMembers(), fetchMemberTypes()]);
});
</script>

<style scoped>
.member-management-container {
  background: #2761b8;
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

.add-member-btn {
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

.member-info-box {
  background: #f5f5f5;
  border-radius: 12px;
  border-left: 4px solid #2931a5;
}
</style>