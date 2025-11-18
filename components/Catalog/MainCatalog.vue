<template>
  <!-- Header -->
  <v-card class="mb-2 header-card" elevation="0">
    <v-card-text class="pa-4">
      <v-row class="align-center">
        <v-col cols="12" md="6" class="d-flex align-center">
          <div class="icon-wrapper mr-2">
            <v-icon size="32" color="white">mdi-view-list</v-icon>
          </div>
          <div>
            <h5 class="text-h5 font-weight-bold mb-1">ການຈັດການຕົວປ່ຽນຫຼັກ</h5>
            <p class="text-subtitle-2 text-grey-lighten-3 mb-0">
              Manage all catalog data from API
            </p>
          </div>
        </v-col>

        <v-col cols="12" md="6" class="d-flex justify-end">
          <v-btn
            color="primary"
            size="large"
            class="mr-2"
            prepend-icon="mdi-plus"
            @click="openAddDialog"
          >
            ເພີ່ມໂຕປ່ຽນຫຼັກ
          </v-btn>

          <v-btn
            color="#3D5AFE"
            size="large"
            prepend-icon="mdi-plus"
            @click="goToSubcatalog"
          >
            ເພີ່ມໂຕປ່ຽນຍ່ອຍ
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>

  <!-- Filter -->
<v-card class="mb-2 filter-card" elevation="2">
  <v-card-text class="pa-4">
    <v-row>
      <v-col cols="12" md="5">
        <v-text-field
          class="same-height"
          v-model="filterType"
          label="ຄົ້ນຫາຕາມ Type"
          clearable
          prepend-inner-icon="mdi-filter"
          variant="outlined"
          @keyup.enter="applyFilters"
        />
      </v-col>

      <v-col cols="12" md="5">
        <v-text-field
          class="same-height"
          v-model="filterName"
          label="ຄົ້ນຫາຕາມຊື່ (ລາວ ຫຼື ອັງກິດ)"
          clearable
          prepend-inner-icon="mdi-alphabetical"
          variant="outlined"
          @keyup.enter="applyFilters"
        />
      </v-col>

      <v-col cols="12" md="2" class="d-flex align-center">
        <v-btn
          class="same-height"
          block
          color="primary"
          prepend-icon="mdi-magnify"
          @click="applyFilters"
        >
          ຄົ້ນຫາ
        </v-btn>
      </v-col>
    </v-row>
  </v-card-text>
</v-card>

  <!-- Table -->
  <v-card elevation="2" class="table-card">
    <v-card-text class="pa-0">
      <v-data-table
        :headers="headers"
        :items="paginatedCatalogs"
        :loading="loading"
        class="elevation-0 modern-table old-thead-style"
        hide-default-footer
      >
        <!-- No -->
        <template v-slot:header.no>
          <div style="width: 40px;">ລຳດັບ</div>
        </template>

        <template v-slot:item.no="{ item }">
          <div style="width: 40px; text-align: center;">
            {{ item.no }}
          </div>
        </template>

        <!-- Status -->
        <template v-slot:item.cat_status="{ item }">
          <v-chip size="small" variant="tonal" :color="item.cat_status ? 'green' : 'red'">
            {{ item.cat_status ? "Active" : "Inactive" }}
          </v-chip>
        </template>

        <!-- Actions -->
        <template v-slot:item.actions="{ item }">
          <v-btn icon size="small" color="blue" variant="tonal" @click="openEditDialog(item)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon size="small" color="red" variant="tonal" @click="openDeleteDialog(item)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>

        <template v-slot:loading>
          <v-skeleton-loader type="table-row@5" />
        </template>
      </v-data-table>

      <!-- Pagination Footer -->
      <v-divider></v-divider>

      <div class="pa-4" v-if="totalCatalogs > 0">
        <v-row class="align-center">
          <v-col cols="12" md="4">
            <div class="text-body-2 text-grey-darken-1">
              Showing <b>{{ paginationStart }}</b> - <b>{{ paginationEnd }}</b> of
              <b>{{ totalCatalogs }}</b> records
            </div>
          </v-col>

          <v-col cols="12" md="8" class="d-flex justify-end gap-4 align-center">
            <div class="d-flex align-center gap-2">
              <span>Rows:</span>
              <v-select
                v-model="itemsPerPage"
                :items="rowsPerPageOptions"
                density="compact"
                variant="outlined"
                hide-details
                style="width: 90px"
                @update:model-value="handleItemsPerPageChange"
              />
            </div>

            <v-pagination
              v-model="currentPage"
              :length="totalPages"
              :total-visible="6"
              size="small"
              rounded="circle"
            />
          </v-col>
        </v-row>
      </div>
    </v-card-text>
  </v-card>

  <!-- Add/Edit Dialog -->
  <v-dialog v-model="showFormDialog" max-width="500">
    <v-card>
      <v-card-title>
        <v-icon color="primary" class="mr-2">{{ editingCatalog ? "mdi-pencil" : "mdi-plus" }}</v-icon>
        {{ editingCatalog ? "ແກ້ໄຂໂຕປ່ຽນຫຼັກ" : "ເພີ່ມໂຕປ່ຽນຫຼັກ" }}
      </v-card-title>

      <v-card-text>
        <v-form ref="catalogFormRef">
          <v-text-field v-model="form.cat_type" label="Type" outlined dense required />
          <v-text-field v-model="form.cat_name" label="ຊື່ອັງກິດ" outlined dense required />
          <v-text-field v-model="form.cat_lao_name" label="ຊື່ລາວ" outlined dense required />

          <v-switch
            :model-value="form.cat_status === 1"
            inset
            :label="form.cat_status === 1 ? 'Active' : 'Inactive'"
            @update:model-value="val => form.cat_status = val ? 1 : 0"
          />

          <v-textarea v-model="form.cat_detail" label="Detail" outlined dense />
        </v-form>
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn color="grey" text @click="closeFormDialog">ຍົກເລີກ</v-btn>
        <v-btn color="primary" :loading="saving" @click="saveCatalog">
          {{ editingCatalog ? "ບັນທຶກ" : "ເພີ່ມໂຕປ່ຽນຫຼັກ" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Delete Dialog -->
  <v-dialog v-model="showDeleteDialog" max-width="450" persistent>
    <v-card elevation="8" class="delete-dialog-card">
      <v-card-title class="delete-dialog-header pa-4">
        <div class="d-flex align-center">
          <v-icon color="white" class="mr-2">mdi-alert</v-icon>
          <h2 class="text-h6 font-weight-bold text-white mb-0">ຢືນຢັນການລົບ</h2>
        </div>
      </v-card-title>

      <v-card-text class="pa-4 text-center">
        ທ່ານແນ່ໃຈບໍ່ວ່າຈະລົບ <b>{{ catalogToDelete?.cat_name }}</b> ?
      </v-card-text>

      <v-card-actions class="pa-4 pt-0 justify-end">
        <v-btn color="grey" variant="text" @click="showDeleteDialog = false">ຍົກເລີກ</v-btn>
        <v-btn color="red" variant="flat" :loading="deleting" @click="confirmDelete">ລົບ</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
const router = useRouter()

const goToSubcatalog = () => {
  router.push('/subcatalog')
}
const config = useRuntimeConfig();
const apiUrl = `${config.public.STRAPI_URL}api/maincatalog/`;

const catalogs = ref([]);
const loading = ref(false);

const filterType = ref("");
const filterName = ref("");

// Dialog
const showFormDialog = ref(false);
const showDeleteDialog = ref(false);

const deleting = ref(false);
const saving = ref(false);

const catalogToDelete = ref(null);
const editingCatalog = ref(null);

const form = ref({
  cat_type: "",
  cat_name: "",
  cat_lao_name: "",
  cat_status: 1,
  cat_detail: "",
});

// Table header
const headers = [
  { title: "ລຳດັບ", key: "no", sortable: false },
  // { title: "ID", key: "cat_id" },
  { title: "Type", key: "cat_type" },
  { title: "ຊື່ອັງກິດ", key: "cat_name" },
  { title: "ຊື່ລາວ", key: "cat_lao_name" },
  { title: "Status", key: "cat_status" },
  { title: "Detail", key: "cat_detail" },
  { title: "Actions", key: "actions" },
];

// Pagination
const currentPage = ref(1);
const itemsPerPage = ref(10);
const rowsPerPageOptions = [5, 10, 25, 50, 100];

const totalCatalogs = computed(() => catalogs.value.length);
const totalPages = computed(() => Math.max(1, Math.ceil(totalCatalogs.value / itemsPerPage.value)));

const paginatedCatalogs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return catalogs.value.slice(start, start + itemsPerPage.value).map((item, i) => ({
    ...item,
    no: start + i + 1,
  }));
});

const paginationStart = computed(() => (totalCatalogs.value ? (currentPage.value - 1) * itemsPerPage.value + 1 : 0));
const paginationEnd = computed(() => Math.min(currentPage.value * itemsPerPage.value, totalCatalogs.value));

const handleItemsPerPageChange = () => { currentPage.value = 1; };

// Normalize
const normalize = (txt) =>
  txt?.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") || "";

const fetchCatalogs = async () => {
  loading.value = true;
  try {
    const res = await axios.get(apiUrl);
    let data = res.data.results || res.data.data || res.data;

    if (filterType.value) {
      const f = normalize(filterType.value);
      data = data.filter((d) => normalize(d.cat_type).includes(f));
    }

    if (filterName.value) {
      const f = normalize(filterName.value);
      data = data.filter(
        (d) => normalize(d.cat_name).includes(f) || normalize(d.cat_lao_name).includes(f)
      );
    }

    catalogs.value = Array.isArray(data) ? data : [data];
  } catch (e) {
    console.error(e);
    catalogs.value = [];
  } finally {
    loading.value = false;
  }
};

const applyFilters = () => fetchCatalogs();

// Add
const openAddDialog = () => {
  editingCatalog.value = null;
  form.value = {
    cat_type: "",
    cat_name: "",
    cat_lao_name: "",
    cat_status: 1,
    cat_detail: "",
  };
  showFormDialog.value = true;
};

// Edit
const openEditDialog = (item) => {
  editingCatalog.value = item;
  form.value = { ...item };
  showFormDialog.value = true;
};

// Save
const saveCatalog = async () => {
  saving.value = true;
  try {
    if (editingCatalog.value) {
      await axios.put(`${apiUrl}${editingCatalog.value.cat_id}/`, form.value);
    } else {
      await axios.post(apiUrl, form.value);
    }
    showFormDialog.value = false;
    fetchCatalogs();
  } catch (e) {
    console.error(e);
  } finally {
    saving.value = false;
  }
};

// Delete
const openDeleteDialog = (item) => {
  catalogToDelete.value = item;
  showDeleteDialog.value = true;
};

const confirmDelete = async () => {
  deleting.value = true;
  try {
    await axios.delete(`${apiUrl}${catalogToDelete.value.cat_id}/`);
    catalogs.value = catalogs.value.filter((d) => d.cat_id !== catalogToDelete.value.cat_id);
    showDeleteDialog.value = false;
  } catch (e) {
    console.error(e);
  } finally {
    deleting.value = false;
  }
};
onMounted(fetchCatalogs);
const closeFormDialog = () => {
  showFormDialog.value = false;
};
</script>

<style scoped>
/* Header card */
.header-card {
  background: linear-gradient(135deg, #3f51b5, #283593);
  border-radius: 16px;
  color: white;
}

/* Icon */
.icon-wrapper {
  background: rgba(255, 255, 255, 0.2);
  padding: 12px;
  border-radius: 12px;
}

/* Cards */
.filter-card,
.table-card {
  border-radius: 16px;
  border: 1px solid #e0e0e0;
}

/* ====== OLD THEAD STYLE (เปลี่ยนตรงนี้ให้เป็นแบบเก่า 100%) ====== */
/* ปรับให้ใช้สีพื้นเดียว (ไม่ใช่ gradient), ตัวหนา, ขนาดฟอนต์เท่าเดิม, ขอบมุมบน */
.modern-table.old-thead-style :deep(thead th) {
  background-color: #3f51b5 !important; /* สีหัวตารางแบบดั้งเดิม */
  color: #ffffff !important;
  font-size: 13px !important;
  font-weight: 700 !important;
  letter-spacing: 0.6px !important;
  padding: 12px !important;
  border-bottom: 2px solid rgba(0,0,0,0.08) !important;
  vertical-align: middle !important;
}

/* มุมมนแบบหัวตารางเหมือนของเก่า */
.modern-table.old-thead-style :deep(thead tr:first-child th:first-child) {
  border-top-left-radius: 12px;
  padding-left: 22px !important;
}
.modern-table.old-thead-style :deep(thead tr:first-child th:last-child) {
  border-top-right-radius: 12px;
  padding-right: 22px !important;
}

/* ถ้าอยากให้มีเส้นแบ่งชัดเจนระหว่างหัวกับเนื้อ */
.modern-table.old-thead-style :deep(thead th) {
  box-shadow: inset 0 -1px 0 rgba(255,255,255,0.06);
}

/* tbody ปรับให้เข้ากัน (ฟอนต์, padding) */
.modern-table :deep(tbody td) {
  font-size: 12px !important;
  color: #333 !important;
  padding-top: 12px !important;
  padding-bottom: 12px !important;
}

/* Pagination item ปรับให้เข้ากับธีมเก่า */
:deep(.v-pagination__item--is-active) {
  color: #000000 !important;
}

/* Delete dialog header เก็บแบบเดิม */
.delete-dialog-header {
  background: linear-gradient(135deg, #d32f2f, #c62828);
  color: white;
}
.same-height {
  height: 48px !important; 
}
/* จบ style */
</style>
