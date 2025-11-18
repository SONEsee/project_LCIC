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
            <h5 class="text-h5 font-weight-bold mb-1">ການຈັດການຕົວປ່ຽນຍ່ອຍ</h5>
            <p class="text-subtitle-2 text-grey-lighten-3 mb-0">
              Manage all sub catalog data from API
            </p>
          </div>
        </v-col>

        <v-col cols="12" md="6" class="d-flex justify-end">
          <v-btn color="primary" size="large" class="mr-2" prepend-icon="mdi-plus" @click="openAddDialog">
            ເພີ່ມໂຕປ່ຽນຍ່ອຍ
          </v-btn>
          <v-btn
            color="#3D5AFE"
            size="large"
            prepend-icon="mdi-plus"
            @click="goToSubcatalog"
          >
            ເພີ່ມໂຕປ່ຽນຫຼັກ
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
        <template v-slot:header.no>
          <div style="width: 60px;">ລຳດັບ</div>
        </template>

        <template v-slot:item.no="{ item }">
          <div style="width: 60px; text-align: center;">
            {{ item.no }}
          </div>
        </template>

        <template v-slot:item.cat_status="{ item }">
          <v-chip size="small" :color="item.cat_status ? 'green' : 'red'" variant="tonal">
            {{ item.cat_status ? "Active" : "Inactive" }}
          </v-chip>
        </template>

        <template v-slot:item.cat_is_default="{ item }">
          <v-chip size="small" :color="item.cat_is_default ? 'blue' : 'grey'" variant="tonal">
            {{ item.cat_is_default ? "Default" : "Normal" }}
          </v-chip>
        </template>

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

      <!-- Pagination -->
      <v-divider></v-divider>
      <div class="pa-4" v-if="totalCatalogs > 0">
        <v-row class="align-center">
          <v-col cols="12" md="4">
            <div class="text-body-2 text-grey-darken-1">
              Showing <b>{{ paginationStart }}</b> - <b>{{ paginationEnd }}</b>
              of <b>{{ totalCatalogs }}</b> records
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

            <v-pagination v-model="currentPage" :length="totalPages" :total-visible="6" size="small" rounded="circle" />
          </v-col>
        </v-row>
      </div>
    </v-card-text>
  </v-card>

  <!-- Add/Edit Dialog -->
  <v-dialog v-model="showFormDialog" max-width="520">
    <v-card>
      <v-card-title>
        <v-icon color="primary" class="mr-2">{{ editingCatalog ? "mdi-pencil" : "mdi-plus" }}</v-icon>
        {{ editingCatalog ? "ແກ້ໄຂໂຕປ່ຽນຍ່ອຍ" : "ເພີ່ມໂຕປ່ຽນຍ່ອຍ" }}
      </v-card-title>

      <v-card-text>
        <v-form>

          <!-- FIXED v-select -->
          <v-select
            v-model="form.ct_type"
            :items="typeOptions"
            item-title="title"
            item-value="value"
            label="ເລືອກ Type"
            dense
            outlined
            prepend-inner-icon="mdi-menu-down"
            :disabled="editingCatalog !== null"
            required
          />

          <v-text-field v-model="form.cat_name" label="ຊື່ອັງກິດ" dense outlined required />
          <v-text-field v-model="form.cat_lao_name" label="ຊື່ລາວ" dense outlined required />
          <v-text-field v-model="form.cat_value" label="Value" dense outlined />
          <v-text-field v-model="form.cat_sort_order" type="number" label="Sort Order" dense outlined />
          <v-text-field v-model="form.cat_group" type="number" label="Group" dense outlined />

          <!-- Switch int fix -->
          <v-switch
            v-model="form.cat_is_default"
            :true-value="1"
            :false-value="0"
            inset
            :label="form.cat_is_default ? 'Default' : 'Normal'"
          />

          <v-switch
            v-model="form.cat_status"
            :true-value="1"
            :false-value="0"
            inset
            :label="form.cat_status ? 'Active' : 'Inactive'"
          />

        </v-form>
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn color="grey" variant="text" @click="closeFormDialog">ຍົກເລີກ</v-btn>
        <v-btn color="primary" :loading="saving" @click="saveCatalog">
          {{ editingCatalog ? "ບັນທຶກ" : "ເພີ່ມໃໝ່" }}
        </v-btn>
      </v-card-actions>

    </v-card>
  </v-dialog>

  <!-- Delete -->
  <v-dialog v-model="showDeleteDialog" max-width="450" persistent>
    <v-card elevation="8" class="delete-dialog-card">

      <v-card-title class="delete-dialog-header pa-4">
        <v-icon class="mr-2" color="white">mdi-alert</v-icon>
        <span class="text-white">ຢືນຢັນການລົບ</span>
      </v-card-title>

      <v-card-text class="pa-4 text-center">
        ຈະລົບ <b>{{ catalogToDelete?.cat_name }}</b> ແທ້ບໍ?
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

const router = useRouter();
const goToSubcatalog = () => router.push("/maincatalog");

const config = useRuntimeConfig();
const apiUrl = `${config.public.STRAPI_URL}api/subcatalog/`;

/* Data */
const catalogs = ref([]);
const loading = ref(false);

/* Type Options */
const typeOptions = ref([]);

/* Filters */
const filterType = ref("");
const filterName = ref("");

/* Dialogs */
const showFormDialog = ref(false);
const showDeleteDialog = ref(false);
const saving = ref(false);
const deleting = ref(false);

const editingCatalog = ref(null);
const catalogToDelete = ref(null);

/* Form Model */
const form = ref({
  ct_type: "",
  cat_name: "",
  cat_lao_name: "",
  cat_value: "",
  cat_is_default: 0,
  cat_sort_order: 0,
  cat_group: 0,
  cat_status: 1,
});

/* Load type list */
const fetchTypeOptions = async () => {
  try {
    const res = await axios.get(`${config.public.STRAPI_URL}api/maincatalog/`);
    const data = res.data.results || res.data.data || res.data;

    typeOptions.value = data.map((item) => ({
      title: `${item.cat_name} (${item.cat_type})`,
      value: item.cat_type,
    }));
  } catch (e) {
    console.error("TYPE LOAD ERROR:", e);
  }
};

/* Headers */
const headers = [
  { title: "ລຳດັບ", key: "no", sortable: false },
  { title: "Type", key: "ct_type" },
  { title: "ຊື່ອັງກິດ", key: "cat_name" },
  { title: "ຊື່ລາວ", key: "cat_lao_name" },
  { title: "Value", key: "cat_value" },
  { title: "Default", key: "cat_is_default" },
  { title: "Sort", key: "cat_sort_order", sortable: false },
  { title: "Group", key: "cat_group", sortable: false },
  { title: "Status", key: "cat_status" },
  { title: "Actions", key: "actions" },
];

/* Pagination */
const currentPage = ref(1);
const itemsPerPage = ref(10);
const rowsPerPageOptions = [5, 10, 25, 50, 100];

const totalCatalogs = computed(() => catalogs.value.length);
const totalPages = computed(() => Math.ceil(totalCatalogs.value / itemsPerPage.value));

const paginatedCatalogs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return catalogs.value.slice(start, start + itemsPerPage.value).map((item, i) => ({
    ...item,
    no: start + i + 1,
  }));
});

/* Normalize */
const normalize = (txt) =>
  txt?.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") || "";

/* Fetch */
const fetchCatalogs = async () => {
  loading.value = true;
  try {
    const res = await axios.get(apiUrl);
    let data = res.data.results || res.data.data || res.data;

    if (filterType.value) {
      const f = normalize(filterType.value);
      data = data.filter((d) => normalize(d.ct_type).includes(f));
    }

    if (filterName.value) {
      const f = normalize(filterName.value);
      data = data.filter(
        (d) =>
          normalize(d.cat_name).includes(f) ||
          normalize(d.cat_lao_name).includes(f)
      );
    }

    catalogs.value = Array.isArray(data) ? data : [data];
  } catch (e) {
    console.error("FETCH ERROR:", e);
  } finally {
    loading.value = false;
  }
};

const applyFilters = () => fetchCatalogs();

/* Add */
const openAddDialog = () => {
  editingCatalog.value = null;
  form.value = {
    ct_type: "",
    cat_name: "",
    cat_lao_name: "",
    cat_value: "",
    cat_is_default: 0,
    cat_sort_order: 0,
    cat_group: 0,
    cat_status: 1,
  };
  showFormDialog.value = true;
};

/* Edit */
const openEditDialog = (item) => {
  editingCatalog.value = item;

  form.value = {
    ct_type: item.ct_type,
    cat_name: item.cat_name,
    cat_lao_name: item.cat_lao_name,
    cat_value: item.cat_value,
    cat_is_default: item.cat_is_default,
    cat_sort_order: item.cat_sort_order,
    cat_group: item.cat_group,
    cat_status: item.cat_status,
  };

  showFormDialog.value = true;
};

/* Save */
const saveCatalog = async () => {
  saving.value = true;
  try {
    const payload = {
      ct_type: form.value.ct_type,
      cat_name: form.value.cat_name,
      cat_lao_name: form.value.cat_lao_name,
      cat_value: form.value.cat_value,
      cat_is_default: Number(form.value.cat_is_default),
      cat_sort_order: Number(form.value.cat_sort_order),
      cat_group: Number(form.value.cat_group),
      cat_status: Number(form.value.cat_status),
    };

    if (editingCatalog.value) {
      await axios.put(`${apiUrl}${editingCatalog.value.cat_sys_id}/`, payload);
    } else {
      await axios.post(apiUrl, payload);
    }

    showFormDialog.value = false;
    fetchCatalogs();
  } catch (e) {
    console.error("SAVE ERROR:", e.response?.data || e);
  } finally {
    saving.value = false;
  }
};

/* Delete */
const openDeleteDialog = (item) => {
  catalogToDelete.value = item;
  showDeleteDialog.value = true;
};

const confirmDelete = async () => {
  deleting.value = true;
  try {
    await axios.delete(`${apiUrl}${catalogToDelete.value.cat_sys_id}/`);
    catalogs.value = catalogs.value.filter(
      (d) => d.cat_sys_id !== catalogToDelete.value.cat_sys_id
    );
    showDeleteDialog.value = false;
  } catch (e) {
    console.error("DELETE ERROR:", e);
  } finally {
    deleting.value = false;
  }
};

const closeFormDialog = () => (showFormDialog.value = false);

/* Init */
onMounted(() => {
  fetchCatalogs();
  fetchTypeOptions();
});
</script>

<style scoped>
.header-card {
  background: linear-gradient(135deg, #3f51b5, #283593);
  border-radius: 16px;
  color: white;
}

.icon-wrapper {
  background: rgba(255, 255, 255, 0.2);
  padding: 12px;
  border-radius: 12px;
}

.filter-card,
.table-card {
  border-radius: 16px;
  border: 1px solid #e0e0e0;
}

.modern-table.old-thead-style :deep(thead th) {
  background-color: #3f51b5 !important;
  color: #ffffff !important;
  font-size: 15px;
  font-weight: 700;
  padding: 14px 18px;
}

.same-height {
  height: 48px !important;
}

.delete-dialog-header {
  background: linear-gradient(135deg, #d32f2f, #c62828);
  color: white;
}
</style>
