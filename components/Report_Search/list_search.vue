<template>
  <!-- Header -->
  <v-card class="header-card mb-5" elevation="3" color="primary" dark>
    <div class="d-flex align-center justify-space-between">
      <div class="d-flex align-center">
        <v-icon size="32" class="mr-3">mdi-file-chart</v-icon>
        <div>
          <h1 class="text-h5 font-weight-bold">ລາຍງານການຄົ້ນຫາ</h1>
          <p class="text-body-2 mb-0 mt-1">Report Search LCIC</p>
        </div>
      </div>
      <!-- <div class="text-right">
        <div class="text-caption">Selected Bank Code</div>
        <div class="text-h6 font-weight-bold">{{ selectedBank }}</div>
      </div> -->
    </div>
  </v-card>

  <!-- Filter Section - อยู่ใน 1 บรรทัด -->
  <v-card class="filter-card mb-6" elevation="3">
    <!-- Filter Header -->
    <div class="filter-header mb-3">
      <div class="d-flex align-center justify-space-between">
        <div class="d-flex align-center">
          <div class="filter-icon-wrapper mr-3">
            <v-icon size="28" color="primary">mdi-filter-variant</v-icon>
          </div>
          <div>
            <h2 class="text-h6 font-weight-bold ">ຕົວກອງຂໍ້ມູນ</h2>
            <p class="text-caption mb-0">Filter & Search Options</p>
          </div>
        </div>
        <v-btn
          color="error"
          variant="tonal"
          size="small"
          prepend-icon="mdi-refresh"
          @click="clearFilters"
          class="clear-btn"
        >
          ລ້າງຕົວກອງ
        </v-btn>
      </div>
    </div>

    <!-- Filter Controls - 1 บรรทัด -->
    <div class="d-flex align-start flex-wrap gap-4 pa-2">
      
      <!-- Bank Selection -->
      <div style="min-width: 500px;">
        <label class="filter-label d-block mb-1">
          <v-icon size="18" class="ml-2 mr-2">mdi-bank</v-icon>
          ເລືອກທະນາຄານ (Bank)
        </label>
        <v-select
          v-model="selectedBank"
          :items="bankList"
          item-title="display_name"
          item-value="bnk_code"
          variant="outlined"
          density="compact"
          hide-details
          @update:model-value="fetchSummary"
          class="mb-2"
        >
          <template v-slot:prepend-inner>
            <v-icon color="primary" size="20">mdi-bank-outline</v-icon>
          </template>
        </v-select>
      </div>
      
        <div style="min-width: 200px;"></div>
      <!-- Date Filter Type -->
      <div style="min-width: 250px;">
        <label class="filter-label d-block mb-1">
          <v-icon size="18" class="mr-2">mdi-calendar-clock</v-icon>
          ປະເພດການຄົ້ນຫາ (Search Type)
        </label>
        <v-btn-toggle
          v-model="dateFilterType"
          color="primary"
          variant="outlined"
          divided
          mandatory
          class="date-type-toggle mb-2"
          @update:model-value="onDateTypeChange"
        >
          <v-btn value="year" size="small" >
            <v-icon class="mr-1" size="18" >mdi-calendar</v-icon>ປີ
          </v-btn>
          <v-btn value="month" size="small">
            <v-icon class="mr-1" size="18">mdi-calendar-month</v-icon>ເດືອນ
          </v-btn>
          <v-btn value="day" size="small">
            <v-icon class="mr-1" size="18">mdi-calendar-today</v-icon>ວັນທີ່
          </v-btn>
        </v-btn-toggle>
      </div>

      <!-- Date Value Input - อยู่ใน 1 บรรทัด -->
      <div style="min-width: 150px;">
        <label class="filter-label d-block mb-1">
          <v-icon size="18" class="mr-2">mdi-calendar-search</v-icon>
          ເລືອກວັນທີ່ (Select Date)
        </label>
        <div class="d-flex align-center gap-2">
          <!-- Year -->
          <v-text-field
            v-if="dateFilterType === 'year'"
            v-model="filterYear"
            variant="outlined"
            density="compact"
            type="number"
            placeholder="2025"
            hide-details
            @update:model-value="fetchSummary"
            style="width: 120px;"
            class="date-field"
          >
            <template v-slot:prepend-inner>
              <v-icon color="primary" size="20">mdi-calendar-blank</v-icon>
            </template>
          </v-text-field>

          <!-- Month -->
          <v-text-field
            v-if="dateFilterType === 'month'"
            v-model="filterYearMonth"
            variant="outlined"
            density="compact"
            type="month"
            hide-details
            @update:model-value="fetchSummary"
            style="width: 160px;"
            class="date-field"
          >
            <template v-slot:prepend-inner>
              <v-icon color="primary" size="20">mdi-calendar-month-outline</v-icon>
            </template>
          </v-text-field>

          <!-- Day -->
          <v-text-field
            v-if="dateFilterType === 'day'"
            v-model="filterDate"
            variant="outlined"
            density="compact"
            type="date"
            hide-details
            @update:model-value="fetchSummary"
            style="width: 180px;"
            class="date-field"
          >
            <template v-slot:prepend-inner>
              <v-icon color="primary" size="20">mdi-calendar-check</v-icon>
            </template>
          </v-text-field>
        </div>
      </div>

    </div>

    <!-- Active Filters -->
    <!-- <v-divider class="my-4"></v-divider> -->
    <div class="active-filters ">
      <p class="text-caption text-medium-emphasis mb-2">
        <v-icon size="14" class="ml-2 mr-1">mdi-filter-check</v-icon>
        ຕົວກອງທີ່ເລືອກ (Active Filters)
      </p>
      <div class="d-flex flex-wrap gap-2 ml-2">
        <v-chip color="#2233a1" size="small" variant="flat">
          <v-icon start size="20">mdi-bank</v-icon>
          {{ selectedBank }}
        </v-chip>
        <v-chip color="#2233a1" size="small" variant="flat">
          <v-icon start size="20">mdi-calendar</v-icon>
          {{ getCurrentFilterDisplay() }}
        </v-chip>
      </div>
    </div>
  </v-card>

  <!-- Summary Boxes -->
  <v-row>
    <v-col cols="12" md="4">
      <v-card class="box-card d-flex align-center justify-center clickable-card" color="#e3f2fd" elevation="2" @click="goToDetail('group1')">
        <div class="text-center">
          <v-icon size="40" color="primary" class="mb-2">mdi-file-document-multiple</v-icon>
          <h3 class="mb-1 font-weight-bold">ບົດລາຍງານສິນເຊື່ອ</h3>
          <div class="text-h4 font-weight-bold text-primary">{{ summary.group1 }}</div>
          <v-icon class="mt-2" size="20" color="primary">mdi-arrow-right-circle</v-icon>
        </div>
      </v-card>
    </v-col>

    <v-col cols="12" md="4">
      <v-card class="box-card d-flex align-center justify-center clickable-card" color="#e8f5e9" elevation="2" @click="goToDetail('group2')">
        <div class="text-center">
          <v-icon size="40" color="success" class="mb-2">mdi-chart-line</v-icon>
          <h3 class="mb-1 font-weight-bold">ບົດລາຍງານຄະແນນສິນເຊື່ອ</h3>
          <div class="text-h4 font-weight-bold text-success">{{ summary.group2 }}</div>
          <v-icon class="mt-2" size="20" color="success">mdi-arrow-right-circle</v-icon>
        </div>
      </v-card>
    </v-col>

    <v-col cols="12" md="4">
      <v-card class="box-card d-flex align-center justify-center clickable-card" color="#fff3e0" elevation="2" @click="goToDetail('group3')">
        <div class="text-center">
          <v-icon size="40" color="orange" class="mb-2">mdi-water</v-icon>
          <h3 class="mb-1 font-weight-bold">ບົດລາຍງານສາທາລະນູປະໂພກ</h3>
          <div class="text-h4 font-weight-bold text-orange">{{ summary.group3 }}</div>
          <v-icon class="mt-2" size="20" color="orange">mdi-arrow-right-circle</v-icon>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRuntimeConfig, navigateTo } from "#imports";
import { useRouter } from '#imports';

const router = useRouter();

const config = useRuntimeConfig();
const apiChargeURL = `${config.public.strapi.url}api/request-charge-summary/`;
const apiMemberURL = `${config.public.strapi.url}api/memberinfo/`;

// State
const selectedBank = ref("01");
const bankList = ref([]);
const summary = ref({ group1: 0, group2: 0, group3: 0 });

// Date Filter
const dateFilterType = ref("day");
const filterYear = ref("");
const filterYearMonth = ref("");
const filterDate = ref("");

const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return { year: String(year), yearMonth: `${year}-${month}`, fullDate: `${year}-${month}-${day}` };
};

const initializeDefaultDate = () => {
  const today = getTodayDate();
  filterYear.value = today.year;
  filterYearMonth.value = today.yearMonth;
  filterDate.value = today.fullDate;
};

const getDateFilterValue = () => {
  switch (dateFilterType.value) {
    case 'year': return filterYear.value;
    case 'month': return filterYearMonth.value;
    case 'day': return filterDate.value;
    default: return filterDate.value;
  }
};

const getCurrentFilterDisplay = () => {
  const val = getDateFilterValue();
  switch (dateFilterType.value) {
    case 'year': return `Year: ${val}`;
    case 'month': return `Month: ${val}`;
    case 'day': return `Date: ${val}`;
    default: return val;
  }
};

const onDateTypeChange = () => fetchSummary();
const clearFilters = () => {
  selectedBank.value = "01";
  dateFilterType.value = "day";
  initializeDefaultDate();
  fetchSummary();
};

const fetchBanks = async () => {
  try {
    const { data } = await axios.get(apiMemberURL);
    const banks = data.data || data;
    bankList.value = banks.map(m => ({
      display_name: `${m.nameL} (${m.bnk_code})`,
      bnk_code: m.bnk_code,
    }));
  } catch (error) {
    console.error("Error fetching banks:", error);
  }
};

const fetchSummary = async () => {
  try {
    const params = {
      bnk_code: selectedBank.value,
      date_filter_type: dateFilterType.value,
      date_filter_value: getDateFilterValue()
    };
    const { data } = await axios.get(apiChargeURL, { params });
    summary.value = { group1: data.group1 || 0, group2: data.group2 || 0, group3: data.group3 || 0 };
  } catch (error) {
    console.error("Error fetching summary:", error);
  }
};

// เปลี่ยนจาก navigateTo เป็น router.push
const goToDetail = (groupType) => {
  router.push({
    path: '/report_search',  // ใช้ path เดิม
    query: {
      group: groupType,
      bnk_code: selectedBank.value,
      date_filter_type: dateFilterType.value,
      date_filter_value: getDateFilterValue()
    }
  });
};

onMounted(async () => {
  initializeDefaultDate();
  await fetchBanks();
  await fetchSummary();
});
</script>

<style scoped>
.charge-matrix-container {
  max-width: 1200px;
  margin: auto;
  padding: 0 16px;
}

.header-card {
  border-radius: 12px;
  background: linear-gradient(135deg, #2931a5 0%, #2233a1 100%);
  padding: 16px !important;
}

.filter-card {
  border-radius: 12px;
  padding: 16px !important;
}

.box-card {
  min-height: 200px;
  border-radius: 14px;
  transition: all 0.3s ease;
  padding: 20px !important;
}

.clickable-card {
  cursor: pointer;
}

.clickable-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 10px 24px rgba(0,0,0,0.15) !important;
}

h1 { font-size: 2rem !important; line-height: 1.2; }
h2 { font-size: 1.5rem !important; }
h3 { font-size: 1.25rem !important; }

.filter-label {
  font-size: 0.9375rem;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.78);
}

/* เพิ่ม space หลังไอคอน */
.date-field :deep(.v-field__prepend-inner) {
  padding-right: 8px !important;
}

.date-field :deep(input) {
  padding-left: 4px !important;
}

/* Responsive */
@media (max-width: 960px) {
  .d-flex.gap-4 {
    flex-direction: column;
    align-items: stretch !important;
  }
  .d-flex.gap-4 > div {
    min-width: 100% !important;
  }
}
</style>