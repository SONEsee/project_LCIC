<script setup lang="ts">
import { useTelecom } from "@/stores/telecom";
const telecomStore = useTelecom();
const reques = telecomStore.form_insert_json;
import { useUserData } from "~/composables/useUserData";
const { user, userId, isAdmin, isLoggedIn } = useUserData();

const selectTelecom = ref("");
const req = telecomStore.query_limit;

// Filter States
const filterTelecom = ref("");
const filterPeriod = ref("");

const header = [
  { title: "ໄອດີ", value: "TID", align: "center" },
  { title: "ຊື່ໄຟລ໌", value: "fileName" },
  { title: "ເຄືອຂ່າຍ", value: "telecomType", align: "center" },
  { title: "ຂະໜາດໄຟລ໌", value: "fileSize", align: "center" },
  { title: "ວັນທີອັບໂຫຼດ", value: "period", align: "center" },
];

const typeTelecom = [
  { title: "ເບສ", value: "best", color: "primary" },
  { title: "ອີທີແອລ", value: "etl", color: "info" },
  { title: "ລາວໂທລະຄົມ", value: "laotelecom", color: "error" },
  { title: "ຢູນິເທວ", value: "unitel", color: "warning" },
];

// ສ້າງລາຍການເດືອນຈາກຂໍ້ມູນ
const periodOptions = computed(() => {
  const data = telecomStore.respons_data_tecom_file_list?.results || [];
  const periods = new Set(data.map(item  => item.period).filter(Boolean));
  return Array.from(periods).sort().reverse().map(period => ({
    title: formatPeriod(period),
    value: period
  }));
});

// ຟັງຊັ່ນ Filter ຂໍ້ມູນ
const telecomData = computed(() => {
  let data = telecomStore.respons_data_tecom_file_list?.results || [];
  
  if (Array.isArray(data)) {
    // Filter ຕາມເຄືອຂ່າຍ
    if (filterTelecom.value) {
      data = data.filter(item => (item as any).telecomType === filterTelecom.value);
    }
    
    // Filter ຕາມເດືອນ
    if (filterPeriod.value) {
      data = data.filter(item  => (item as any).period === filterPeriod.value);
    }
    
    return data;
  }
  
  if (data && typeof data === "object") {
    return [data];
  }
  
  return [];
});

// ນັບຈຳນວນຫຼັງ Filter
const filteredCount = computed(() => telecomData.value.length);

// Validate ກ່ອນສົ່ງ
const isFormValid = computed(() => {
  return reques.file !== null && selectTelecom.value !== "";
});

// ຫາສີຂອງເຄືອຂ່າຍ
const getTelecomColor = (type: string) => {
  const found = typeTelecom.find(t => t.value === type);
  return found?.color || "grey";
};

// ຫາຊື່ເຄືອຂ່າຍ
const getTelecomName = (type: string) => {
  const found = typeTelecom.find(t => t.value === type);
  return found?.title || type;
};

// Format ເດືອນ/ປີ
const formatPeriod = (period: string) => {
  if (!period || period.length !== 6) return period;
  const month = period.substring(4, 6);
  const year = period.substring(0, 4);
  return `${month}/${year}`;
};

// ລ້າງ Filter
const clearFilters = () => {
  filterTelecom.value = "";
  filterPeriod.value = "";
};

// ກວດສອບວ່າມີ Filter ບໍ່
const hasActiveFilters = computed(() => {
  return filterTelecom.value !== "" || filterPeriod.value !== "";
});

async function onChangPage(value: number) {
  req.page = value;
  await telecomStore.GetdataTelecom();
}

async function onSelectPage(value: number) {
  req.limit = value;
  req.page = 1;
  await telecomStore.GetdataTelecom();
}

const submitform = async () => {
  if (!isFormValid.value) {
    await Swal.fire({
      icon: "warning",
      title: "ແຈ້ງເຕືອນ",
      text: "ກະລຸນາຕື່ມຂໍ້ມູນໃຫ້ຄົບຖ້ວນ",
      confirmButtonText: "ຕົກລົງ",
    });
    return;
  }

  telecomStore.form_insert_json.user_id = userId.value;
  telecomStore.form_insert_json.telecomType = selectTelecom.value;
  const success = await telecomStore.CreateCustomer();
  
  if (success) {
    reques.file = null;
    selectTelecom.value = "";
  }
};

onMounted(() => {
  telecomStore.GetdataTelecom();
});
</script>

<template>
  <div class="drag-drop-wrapper">
  
</div>
  <div class="pa-6">
    <!-- Header Section -->
    <v-row class="mb-6">
      <v-col cols="4">
        <div class="d-flex align-center">
          <v-icon size="32" color="primary" class="mr-3">mdi-cloud-upload</v-icon>
          <div>
            <h2 class=" font-weight-bold">ອັບໂຫຼດໄຟລ໌ Telecom</h2>
            <p>Telecom Upload System</p>
          </div>
        </div>
      </v-col>
      <v-col cols="8">
        <v-form @submit.prevent="submitform">
          <v-row align="center">
            <v-file-input
              v-model="reques.file"
                label="ລາກໄຟລ໌ມາວາງບ່ອນນີ້ ຫຼື ຄລິກເພື່ອເລືອກ"
                prepend-icon=""
                accept=".json"
                density="compact"
                hide-details
                class="drag-drop-input"
              >
                <template v-slot:prepend-inner>
                  <div class="upload-icon-wrapper">
                    <v-icon size="40" color="primary" class="mb-2">
                      mdi-cloud-upload-outline
                    </v-icon>
                  </div>
                </template>
                
                <template v-slot:selection="{ fileNames }">
                  <div class="selected-file">
                    <v-icon color="success" class="mr-2">mdi-check-circle</v-icon>
                    <span class="text-body-2 font-weight-medium">{{ fileNames[0] }}</span>
                  </div>
                </template>
              </v-file-input>
                        <!-- Telecom Type -->
            <v-col cols="12" md="4">
              <v-autocomplete
                v-model="selectTelecom"
                :items="typeTelecom"
                item-title="title"
                item-value="value"
                variant="outlined"
                density="compact"
                placeholder="ເລືອກເຄືອຂ່າຍ"
                prepend-inner-icon="mdi-cellphone-wireless"
                hide-details
              >
                <template v-slot:item="{ props, item }">
                  <v-list-item v-bind="props">
                    <template v-slot:prepend>
                      <v-icon :color="item.raw.color">
                        mdi-access-point
                      </v-icon>
                    </template>
                  </v-list-item>
                </template>
              </v-autocomplete>
            </v-col>

            <!-- Buttons -->
            <v-col cols="8" md="3" class="d-flex gap-2">
              <v-btn
                variant="outlined"
                color="grey"
                icon="mdi-refresh"
                size="small"
                @click="reques.file = null; selectTelecom = ''"
              ></v-btn>
              <v-btn
                type="submit"
                color="primary"
                prepend-icon="mdi-upload"
                :disabled="!isFormValid"
                :loading="telecomStore.isLoading"
              >
                ອັບໂຫຼດ
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-col>
    </v-row>
    <!-- Filter Section -->
      <v-card-text class="pa-4 bg-grey-lighten-5">
        <v-row align="center">
          <v-col cols="12" md="4">
            <v-autocomplete
              v-model="filterTelecom"
              :items="typeTelecom"
              item-title="title"
              item-value="value"
              variant="outlined"
              density="compact"
              placeholder="ກອງຕາມເຄືອຂ່າຍ"
              prepend-inner-icon="mdi-filter"
              clearable
              hide-details
            >
              <template v-slot:item="{ props, item }">
                <v-list-item v-bind="props">
                  <template v-slot:prepend>
                    <v-icon :color="item.raw.color">
                      mdi-access-point
                    </v-icon>
                  </template>
                </v-list-item>
              </template>
            </v-autocomplete>
          </v-col>

          <v-col cols="12" md="4">
            <v-autocomplete
              v-model="filterPeriod"
              :items="periodOptions"
              item-title="title"
              item-value="value"
              variant="outlined"
              density="compact"
              placeholder="ກອງຕາມເດືອນ/ປີ"
              prepend-inner-icon="mdi-calendar-month"
              clearable
              hide-details
            />
          </v-col>

          <v-col cols="12" md="4">
            <v-btn
              v-if="hasActiveFilters"
              color="error"
              variant="outlined"
              prepend-icon="mdi-filter-off"
              @click="clearFilters"
              block
            >
              ລ້າງຕົວກອງ
            </v-btn>
            <div v-else class="text-center text-caption text-grey">
              <v-icon size="small" class="mr-1">mdi-information</v-icon>
              ເລືອກຕົວກອງເພື່ອຄົ້ນຫາ
            </div>
          </v-col>
        </v-row>

        <!-- Filter Status -->
        <v-row v-if="hasActiveFilters" class="mt-2">
          <v-col cols="12">
            <div class="d-flex align-center flex-wrap gap-2">
              <span class="text-caption text-grey">ກຳລັງກອງ:</span>
              
              <v-chip
                v-if="filterTelecom"
                size="small"
                :color="getTelecomColor(filterTelecom)"
                variant="flat"
                closable
                @click:close="filterTelecom = ''"
              >
                <v-icon size="small" class="mr-1">mdi-access-point</v-icon>
                {{ getTelecomName(filterTelecom) }}
              </v-chip>

              <v-chip
                v-if="filterPeriod"
                size="small"
                color="blue-grey"
                variant="flat"
                closable
                @click:close="filterPeriod = ''"
              >
                <v-icon size="small" class="mr-1">mdi-calendar-month</v-icon>
                {{ formatPeriod(filterPeriod) }}
              </v-chip>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    <!-- Data Table Card -->
    <v-card class="elevation-2" rounded="lg">
      <v-card-title class="d-flex align-center pa-6 bg-grey-lighten-4">
        <v-icon size="28" color="primary" class="mr-3">mdi-table</v-icon>
        <span class="text-h6 font-weight-bold">ລາຍການໄຟລ໌ທີ່ອັບໂຫຼດ</span>
        <v-spacer></v-spacer>
        <v-chip 
          color="primary" 
          variant="flat"
          prepend-icon="mdi-file-document-multiple"
        >
          {{ filteredCount }} / {{ telecomStore.respons_data_tecom_file_list?.total || 0 }} ໄຟລ໌
        </v-chip>
      </v-card-title>
      <v-card-text class="pa-0">
        <v-data-table
          :items="telecomData"
          :headers="header"
          :items-per-page="req.limit"
          :loading="telecomStore.isLoading"
          loading-text="ກຳລັງໂຫຼດຂໍ້ມູນ..."
          no-data-text="ບໍ່ມີຂໍ້ມູນທີ່ຕົງກັບເງື່ອນໄຂການຄົ້ນຫາ"
          hover
          class="elevation-0"
        >
          <!-- TID -->
          <template v-slot:item.TID="{ item }">
            <v-chip size="small" color="primary" variant="tonal">
              #{{ item.TID }}
            </v-chip>
          </template>

          <!-- fileName -->
          <template v-slot:item.fileName="{ item }">
            <div class="d-flex align-center">
              <v-icon size="small" color="blue-grey" class="mr-2">
                mdi-file-document
              </v-icon>
              <span class="text-body-2">{{ item.fileName }}</span>
            </div>
          </template>

          <!-- telecomType -->
          <template v-slot:item.telecomType="{ item }">
            <v-chip 
              :color="getTelecomColor(item.telecomType)"
              variant="flat"
              size="small"
            >
              {{ getTelecomName(item.telecomType) }}
            </v-chip>
          </template>

          <!-- fileSize -->
          <template v-slot:item.fileSize="{ item }">
            <span class="text-caption font-weight-medium">
              {{ item.fileSize }}
            </span>
          </template>

          <!-- period -->
          <template v-slot:item.period="{ item }">
            <v-chip 
              size="small" 
              variant="outlined" 
              color="blue-grey"
              prepend-icon="mdi-calendar"
            >
              {{ formatPeriod(item.period) }}
            </v-chip>
          </template>

          <!-- Pagination -->
          <template v-slot:bottom>
            <div class="pa-4 bg-grey-lighten-5">
              <GloBalTablePaginations
                :limit="telecomStore.query_limit.limit"
                :page="telecomStore.query_limit.page"
                :totalpage="telecomStore.respons_data_tecom_file_list?.total_pages"
                @onSelectionChange="onSelectPage"
                @onPagechange="onChangPage"
              />
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<style scoped>
.gap-2 {
  gap: 8px;
}

.v-card {
  transition: all 0.3s ease;
}

.v-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !important;
}

:deep(.v-data-table tbody tr:hover) {
  background-color: rgba(var(--v-theme-primary), 0.05) !important;
}

.drag-drop-input :deep(.v-field) {
  min-height: 12px;
  border: 2px dashed #667eea;
  border-radius: 10px;
  background: linear-gradient(135deg, #f8f9ff 0%, #fff 100%);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.drag-drop-input :deep(.v-field__input) {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.drag-drop-input :deep(.v-field__prepend-inner) {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding-top: 20px;
}

</style>