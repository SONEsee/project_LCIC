<template>
  <!-- Header -->
  <v-card class="header-card mb-2" elevation="3" color="primary" dark>
    <div class="d-flex align-center">
      <v-icon size="28" class="mr-3">mdi-file-chart</v-icon>
      <div>
        <h1 class="text-h5 font-weight-bold">ລາຍງານການຄົ້ນຫາ</h1>
        <p class="text-caption mb-0">Report Search LCIC</p>
      </div>
    </div>
  </v-card>

  <!-- Filter Section -->
  <v-card class="filter-card mb-2" elevation="2">
    <div class="filter-header">
      <div class="d-flex align-center justify-space-between">
        <div class="d-flex align-center">
          <v-icon size="24" color="primary" class="mr-2">mdi-filter-variant</v-icon>
          <span class="text-subtitle-1 font-weight-bold">ຕົວກອງຂໍ້ມູນ</span>
        </div>
        <v-btn
          color="error"
          variant="text"
          size="small"
          prepend-icon="mdi-refresh"
          @click="clearFilters"
        >
          ລ້າງ
        </v-btn>
      </div>
    </div>

    <v-divider class="my-1"></v-divider>

    <!-- Filter Row 1: Date Filters -->
    <div class="filter-row mb-2">
      <!-- Date Type Selector -->
      <div class="filter-item">
        <label class="filter-label">
          <v-icon size="16">mdi-calendar-clock</v-icon>
          ປະເພດ
        </label>
        <v-select
          v-model="dateFilterType"
          :items="dateTypeOptions"
          density="compact"
          variant="outlined"
          hide-details
          @update:model-value="onDateTypeChange"
        ></v-select>
      </div>

      <!-- Year Filter -->
      <div v-if="dateFilterType === 'year'" class="filter-item">
        <label class="filter-label">
          <v-icon size="16">mdi-calendar</v-icon>
          ປີ
        </label>
        <v-text-field
          v-model="filterYear"
          type="number"
          density="compact"
          variant="outlined"
          placeholder="2025"
          hide-details
          @update:model-value="fetchAllData"
        ></v-text-field>
      </div>

      <!-- Month Filter -->
      <div v-if="dateFilterType === 'month'" class="filter-item-wide">
        <label class="filter-label">
          <v-icon size="16">mdi-calendar-month</v-icon>
          ເດືອນ-ປີ
        </label>
        <div class="month-year-selector">
          <v-select
            v-model="selectedMonth"
            :items="monthOptions"
            item-title="label"
            item-value="value"
            density="compact"
            variant="outlined"
            hide-details
            @update:model-value="updateYearMonth"
          ></v-select>
          <div class="year-control">
            <v-text-field
              v-model="selectedYear"
              type="number"
              density="compact"
              variant="outlined"
              hide-details
              readonly
            ></v-text-field>
            <div class="year-arrows">
              <v-btn icon size="x-small" variant="text" @click="changeYear(1)">
                <v-icon size="16">mdi-chevron-up</v-icon>
              </v-btn>
              <v-btn icon size="x-small" variant="text" @click="changeYear(-1)">
                <v-icon size="16">mdi-chevron-down</v-icon>
              </v-btn>
            </div>
          </div>
        </div>
      </div>

      <!-- Day Filter -->
      <div v-if="dateFilterType === 'day'" class="filter-item">
        <label class="filter-label">
          <v-icon size="16">mdi-calendar-today</v-icon>
          ວັນທີ່
        </label>
        <v-text-field
          v-model="filterDate"
          type="date"
          density="compact"
          variant="outlined"
          hide-details
          @update:model-value="fetchAllData"
        ></v-text-field>
      </div>

      <!-- Date Range Filter -->
      <div v-if="dateFilterType === 'range'" class="filter-item-wide">
        <label class="filter-label">
          <v-icon size="16">mdi-calendar-range</v-icon>
          ຊ່ວງວັນທີ່
        </label>
        <div class="date-range">
          <v-text-field
            v-model="startDate"
            type="date"
            density="compact"
            variant="outlined"
            hide-details
            placeholder="ເລີ່ມ"
            @update:model-value="fetchAllData"
          ></v-text-field>
          <span class="mx-2">ຫາ</span>
          <v-text-field
            v-model="endDate"
            type="date"
            density="compact"
            variant="outlined"
            hide-details
            placeholder="ສິ້ນສຸດ"
            @update:model-value="fetchAllData"
          ></v-text-field>
        </div>
      </div>

      <!-- Bank Filter (Admin only, shown when group is selected) -->
      <div v-if="isAdmin && selectedGroup" class="filter-item-wide">
        <label class="filter-label">
          <v-icon size="16">mdi-bank</v-icon>
          ເລືອກທະນາຄານ
        </label>
        <v-select
          v-model="selectedBankFilter"
          :items="bankOptions"
          item-title="displayName"
          item-value="bnk_code"
          density="compact"
          variant="outlined"
          hide-details
          placeholder="ທັງໝົດ"
          @update:model-value="onBankFilterChange"
        >
          <template v-slot:prepend-inner>
            <v-icon size="18" color="primary">mdi-filter</v-icon>
          </template>
        </v-select>
      </div>
    </div>

    <!-- Filter Row 2: User & Bank Info -->
    <div class="info-row">
      <v-chip size="small" color="primary" variant="flat">
        <v-icon start size="18">mdi-account</v-icon>
        {{ currentUsername }}
      </v-chip>
      <v-chip size="small" color="primary" variant="flat">
        <v-icon start size="18">mdi-bank</v-icon>
        {{ bankDisplayName }}
      </v-chip>
      <v-chip size="small" color="primary" variant="flat">
        <v-icon start size="18">mdi-calendar</v-icon>
        {{ getCurrentFilterDisplay() }}
      </v-chip>
    </div>
  </v-card>

  <!-- Summary Boxes -->
  <v-row class="mb-2">
    <v-col cols="12" md="4">
      <v-card 
        class="box-card clickable-card" 
        :class="{ 'box-active': selectedGroup === 'group1' }"
        color="#e3f2fd" 
        elevation="2" 
        @click="selectGroup('group1')"
      >
        <div class="text-center pa-2">
          <v-icon size="30" color="primary" class="mb-2">mdi-file-document-multiple</v-icon>
          <div class="text-subtitle-4 font-weight-bold mb-1">ບົດລາຍງານສິນເຊື່ອ</div>
          <div class="text-h4 font-weight-bold text-primary">{{ summary.group1 }}</div>
          <v-icon v-if="selectedGroup === 'group1'" class="mt-2" size="20" color="primary">mdi-check-circle</v-icon>
        </div>
      </v-card>
    </v-col>

    <v-col cols="12" md="4">
      <v-card 
        class="box-card clickable-card" 
        :class="{ 'box-active': selectedGroup === 'group2' }"
        color="#e8f5e9" 
        elevation="2" 
        @click="selectGroup('group2')"
      >
        <div class="text-center pa-2">
          <v-icon size="30" color="success" class="mb-2">mdi-chart-line</v-icon>
          <div class="text-subtitle-4 font-weight-bold mb-1">ບົດລາຍງານຄະແນນສິນເຊື່ອ</div>
          <div class="text-h4 font-weight-bold text-success">{{ summary.group2 }}</div>
          <v-icon v-if="selectedGroup === 'group2'" class="mt-2" size="20" color="success">mdi-check-circle</v-icon>
        </div>
      </v-card>
    </v-col>

    <v-col cols="12" md="4">
      <v-card 
        class="box-card clickable-card" 
        :class="{ 'box-active': selectedGroup === 'group3' }"
        color="#fff3e0" 
        elevation="2" 
        @click="selectGroup('group3')"
      >
        <div class="text-center pa-2">
          <v-icon size="30" color="orange" class="mb-2">mdi-water</v-icon>
          <div class="text-subtitle-4 font-weight-bold mb-1">ບົດລາຍງານສາທາລະນູປະໂພກ</div>
          <div class="text-h4 font-weight-bold text-orange">{{ summary.group3 }}</div>
          <v-icon v-if="selectedGroup === 'group3'" class="mt-2" size="20" color="orange">mdi-check-circle</v-icon>
        </div>
      </v-card>
    </v-col>
  </v-row>

  <!-- Bank Report Table (Admin only) -->
  <v-card v-if="isAdmin && selectedGroup" class="data-table-card" elevation="2">
    <v-card-title class="table-header pa-3">
      <div class="d-flex align-center justify-space-between w-100">
        <div class="d-flex align-center">
          <v-icon class="mr-2" size="24" color="#2233a1">mdi-bank-outline</v-icon>
          <div>
            <span class="text-subtitle-4 font-weight-bold">{{ getGroupTitle(selectedGroup) }}</span>
            <p class="text-caption mb-0">ສະຫຼຸບຕາມທະນາຄານ</p>
          </div>
          <v-progress-circular
            v-if="loadingBankReport"
            indeterminate
            color="primary"
            size="18"
            width="2"
            class="ml-2"
          ></v-progress-circular>
        </div>
        <v-chip size="small" color="primary" variant="flat">
          {{ filteredBankReportData.length }} ທະນາຄານ
        </v-chip>
      </div>
    </v-card-title>

    <v-divider></v-divider>

    <div v-if="loadingBankReport && bankReportData.length === 0" class="pa-4">
      <v-skeleton-loader
        v-for="i in 5"
        :key="i"
        type="table-row"
        class="mb-1"
      ></v-skeleton-loader>
    </div>

    <v-data-table
      v-else
      :headers="bankHeaders"
      :items="filteredBankReportData"
      :items-per-page="10"
      :loading="loadingBankReport"
      class="custom-table"
      hover
      density="compact"
    >
      <template v-slot:item.no="{ index }">
        <span class="index-number">{{ index + 1 }}</span>
      </template>

      <template v-slot:item.bnk_code="{ item }">
        <v-chip size="small" class="bank-chip">
          {{ item.code }} - {{ item.bnk_code }}
        </v-chip>
      </template>

      <template v-slot:item.bank_name="{ item }">
        <div class="d-flex align-center">
          <v-icon size="16" class="mr-1" color="primary">mdi-bank</v-icon>
          <span>{{ item.bank_name }}</span>
        </div>
      </template>

      <template v-slot:item.total="{ item }">
        <v-chip color="#2326b9" size="small">
          {{ item.total }}
        </v-chip>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-btn
          color="primary"
          variant="tonal"
          size="small"
          @click="viewBankDetails(item.bnk_code)"
        >
          <v-icon size="16" class="mr-1">mdi-eye</v-icon>
          ເບິ່ງ
        </v-btn>
      </template>

      <template v-slot:no-data>
        <div class="text-center pa-8">
          <v-icon size="60" color="grey">mdi-database-off-outline</v-icon>
          <p class="text-subtitle-1 mt-3">ບໍ່ມີຂໍ້ມູນ</p>
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { useRuntimeConfig, useRouter, useRoute } from "#imports";
import { useUserUID } from '~/composables/useUserUID';

const router = useRouter();
const route = useRoute();
const config = useRuntimeConfig();
const apiChargeURL = `${config.public.strapi.url}api/request-charge-summary/`;
const apiReportAllURL = `${config.public.strapi.url}api/request-charge-report-all/`;
const apiMemberURL = `${config.public.strapi.url}api/memberinfo/`;

const { userData, UID } = useUserUID();

const currentUsername = computed(() => userData.value.username || 'N/A');
const currentBnkCode = computed(() => userData.value.MID?.id || '');
const currentUID = computed(() => UID.value || null);
const isAdmin = computed(() => currentBnkCode.value === "01");

const bankDisplayName = ref('Loading...');
const summary = ref({ group1: 0, group2: 0, group3: 0 });

// Date Filters
const dateFilterType = ref("day");
const filterYear = ref("");
const filterYearMonth = ref("");
const filterDate = ref("");
const startDate = ref("");
const endDate = ref("");

const selectedYear = ref("");
const selectedMonth = ref("");

// Bank Filter
const selectedGroup = ref("group1"); // ✅ เริ่มต้นที่ group1
const bankReportData = ref([]);
const loadingBankReport = ref(false);
const selectedBankFilter = ref("01"); // ✅ เริ่มต้นที่ "01" (ทั้งหมด)
const bankOptions = ref([]);

const dateTypeOptions = [
  { title: 'ປີ', value: 'year' },
  { title: 'ເດືອນ', value: 'month' },
  { title: 'ວັນທີ່', value: 'day' },
  { title: 'ຊ່ວງວັນທີ່', value: 'range' }
];

const monthOptions = [
  { value: '01', label: 'ມັງກອນ' },
  { value: '02', label: 'ກຸມພາ' },
  { value: '03', label: 'ມີນາ' },
  { value: '04', label: 'ເມສາ' },
  { value: '05', label: 'ພຶດສະພາ' },
  { value: '06', label: 'ມິຖຸນາ' },
  { value: '07', label: 'ກໍລະກົດ' },
  { value: '08', label: 'ສິງຫາ' },
  { value: '09', label: 'ກັນຍາ' },
  { value: '10', label: 'ຕຸລາ' },
  { value: '11', label: 'ພະຈິກ' },
  { value: '12', label: 'ທັນວາ' }
];

const bankHeaders = [
  { title: 'ລຳດັບ', key: 'no', align: 'center', sortable: false },
  { title: 'ລະຫັດ', key: 'bnk_code', align: 'center' },
  { title: 'ຊື່ທະນາຄານ', key: 'bank_name', align: 'start' },
  { title: 'ຈຳນວນ', key: 'total', align: 'center' },
  { title: 'ການດຳເນີນການ', key: 'actions', align: 'center', sortable: false }
];

// Filtered Bank Report Data
const filteredBankReportData = computed(() => {
  if (!selectedBankFilter.value || selectedBankFilter.value === "01") {
    return bankReportData.value; // ✅ แสดงทั้งหมดเมื่อเป็น "01"
  }
  return bankReportData.value.filter(item => item.bnk_code === selectedBankFilter.value);
});

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
  startDate.value = today.fullDate;
  endDate.value = today.fullDate;
  
  selectedYear.value = today.year;
  selectedMonth.value = String(today.yearMonth.split('-')[1]);
};

const changeYear = (increment) => {
  const currentYear = parseInt(selectedYear.value);
  selectedYear.value = String(currentYear + increment);
  updateYearMonth();
};

const updateYearMonth = () => {
  if (selectedYear.value && selectedMonth.value) {
    filterYearMonth.value = `${selectedYear.value}-${selectedMonth.value}`;
    fetchAllData();
  }
};

const getDateFilterValue = () => {
  switch (dateFilterType.value) {
    case 'year': return filterYear.value;
    case 'month': return filterYearMonth.value;
    case 'day': return filterDate.value;
    case 'range': return `${startDate.value} to ${endDate.value}`;
    default: return filterDate.value;
  }
};

const getCurrentFilterDisplay = () => {
  switch (dateFilterType.value) {
    case 'year': return `ປີ: ${filterYear.value}`;
    case 'month': return `ເດືອນ: ${filterYearMonth.value}`;
    case 'day': return `ວັນທີ່: ${filterDate.value}`;
    case 'range': return `${startDate.value} - ${endDate.value}`;
    default: return getDateFilterValue();
  }
};

const onDateTypeChange = () => {
  // ✅ ไม่ต้อง reset selectedGroup เพราะเราต้องการให้มันแสดงอยู่
  selectedBankFilter.value = "01"; // ✅ reset เป็น "01"
  fetchAllData();
};

const onBankFilterChange = () => {
  // Filter happens in computed property
};

const clearFilters = () => {
  dateFilterType.value = "day";
  initializeDefaultDate();
  selectedGroup.value = "group1"; // ✅ กลับไปที่ group1
  selectedBankFilter.value = "01"; // ✅ กลับไปที่ "01"
  fetchAllData();
};

const fetchBankName = async () => {
  try {
    if (!currentBnkCode.value) {
      bankDisplayName.value = 'ທະນາຄານບໍ່ລະບຸ';
      return;
    }

    const response = await axios.get(apiMemberURL);
    const banks = response.data?.data || response.data?.results || response.data || [];
    
    const currentBank = banks.find(b => 
      String(b.bnk_code).trim() === String(currentBnkCode.value).trim()
    );
    
    if (currentBank) {
      const nameL = currentBank.nameL || currentBank.name || 'ທະນາຄານບໍ່ລະບຸ';
      const code = currentBank.code || '';
      const bnkCode = currentBank.bnk_code || '';
      
      if (code && bnkCode) {
        bankDisplayName.value = `${nameL} (${code}-${bnkCode})`;
      } else if (bnkCode) {
        bankDisplayName.value = `${nameL} (${bnkCode})`;
      } else {
        bankDisplayName.value = nameL;
      }
    } else {
      bankDisplayName.value = `ທະນາຄານ ${currentBnkCode.value}`;
    }
    
  } catch (error) {
    console.error("Error fetching bank name:", error);
    bankDisplayName.value = 'ທະນາຄານບໍ່ລະບຸ';
  }
};

const fetchBankOptions = async () => {
  try {
    const { data: memberData } = await axios.get(apiMemberURL);
    const banks = memberData.data || memberData.results || memberData || [];
    
    // ✅ เพิ่มตัวเลือก "ທັງໝົດ" ที่ด้านบนสุด
    bankOptions.value = [
      ...banks.map(b => ({
        bnk_code: b.bnk_code,
        displayName: `${b.nameL || b.name} (${b.code}-${b.bnk_code})`
      }))
    ];
  } catch (err) {
    console.error('Error fetching bank options:', err);
  }
};

const fetchSummary = async () => {
  try {
    const params = {
      bnk_code: currentBnkCode.value,
      date_filter_type: dateFilterType.value
    };

    if (dateFilterType.value === 'range') {
      params.start_date = startDate.value;
      params.end_date = endDate.value;
    } else {
      params.date_filter_value = getDateFilterValue();
    }

    const { data } = await axios.get(apiChargeURL, { params });
    summary.value = {
      group1: data.group1 || 0,
      group2: data.group2 || 0,
      group3: data.group3 || 0
    };
  } catch (error) {
    console.error("Error fetching summary:", error);
  }
};

const fetchBankReport = async () => {
  if (!isAdmin.value || !selectedGroup.value) return;
  
  loadingBankReport.value = true;
  try {
    const params = {
      bnk_code: '01',
      group: selectedGroup.value,
      date_filter_type: dateFilterType.value
    };

    if (dateFilterType.value === 'range') {
      params.start_date = startDate.value;
      params.end_date = endDate.value;
    } else {
      params.date_filter_value = getDateFilterValue();
    }

    const { data } = await axios.get(apiReportAllURL, { params });
    
    const { data: memberData } = await axios.get(apiMemberURL);
    const banks = memberData.data || memberData.results || memberData || [];

    const bankMap = {};
    banks.forEach(b => {
      bankMap[b.bnk_code] = {
        name: b.nameL || b.name || b.bnk_code,
        code: b.code || '',
        bnk_code: b.bnk_code
      };
    });

    bankReportData.value = (data.results || []).map(item => ({
      bnk_code: item.bnk_code,
      bank_name: bankMap[item.bnk_code]?.name || `ທະນາຄານ ${item.bnk_code}`,
      code: bankMap[item.bnk_code]?.code || '',
      total: item.total
    }));

  } catch (err) {
    console.error('Error fetching bank report:', err);
    bankReportData.value = [];
  } finally {
    loadingBankReport.value = false;
  }
};

const fetchAllData = async () => {
  await fetchSummary();
  // ✅ ถ้าเป็น Admin และมี selectedGroup → อัปเดตตาราง
  // เมื่อเปลี่ยน Date Filter → จะ reload ตารางของ Group ที่เลือกอยู่
  if (isAdmin.value && selectedGroup.value) {
    await fetchBankReport();
  }
};

const selectGroup = (groupType) => {
  if (!isAdmin.value) {
    const params = {
      group: groupType,
      bnk_code: currentBnkCode.value,
      date_filter_type: dateFilterType.value
    };

    if (dateFilterType.value === 'range') {
      params.start_date = startDate.value;
      params.end_date = endDate.value;
    } else {
      params.date_filter_value = getDateFilterValue();
    }

    router.push({ path: route.path, query: params });
  } else {
    selectedGroup.value = groupType;
    selectedBankFilter.value = "01"; // ✅ reset เป็น "01" เมื่อเปลี่ยน group
    fetchBankReport();
  }
};

const viewBankDetails = (detail_bnk_code) => {
  const params = {
    group: selectedGroup.value,
    bnk_code: currentBnkCode.value,
    date_filter_type: dateFilterType.value,
    detail_bnk_code
  };

  if (dateFilterType.value === 'range') {
    params.start_date = startDate.value;
    params.end_date = endDate.value;
  } else {
    params.date_filter_value = getDateFilterValue();
  }

  router.push({ path: route.path, query: params });
};

const getGroupTitle = (group) => {
  const titles = {
    'group1': 'ບົດລາຍງານສິນເຊື່ອ',
    'group2': 'ບົດລາຍງານຄະແນນສິນເຊື່ອ',
    'group3': 'ບົດລາຍງານສາທາລະນູປະໂພກ'
  };
  return titles[group] || 'Report';
};

onMounted(async () => {
  initializeDefaultDate();
  await fetchBankName();
  await fetchBankOptions();
  await fetchSummary();
  
  // ✅ ถ้าเป็น Admin → โหลด Group 1 ทันที (แสดงตารางอัตโนมัติ)
  if (isAdmin.value) {
    await fetchBankReport(); // selectedGroup = "group1" อยู่แล้ว จาก ref
  }
});
</script>

<style scoped>
.header-card {
  border-radius: 8px;
  background: linear-gradient(135deg, #2931a5 0%, #2233a1 100%);
  padding: 12px 16px !important;
}

.filter-card {
  border-radius: 8px;
  padding: 12px 16px !important;
}

.filter-header {
  margin-bottom: 8px;
}

.filter-row {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-item {
  flex: 0 0 auto;
  min-width: 140px;
}

.filter-item-wide {
  flex: 1 1 auto;
  min-width: 200px;
  max-width: 400px;
}

.filter-label {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.7);
  margin-bottom: 4px;
}

.month-year-selector {
  display: flex;
  gap: 8px;
}

.year-control {
  position: relative;
  width: 100px;
}

.year-arrows {
  position: absolute;
  right: 2px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
}

.date-range {
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  padding-top: 5px;
  border-top: 1px solid #e0e0e0;
}

.box-card {
  border-radius: 10px;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  border: 3px solid transparent;
}

.box-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.12) !important;
}

/* ✅ Active state - แสดงว่ากำลังเลือก Group นี้อยู่ */
.box-active {
  border-color: #2931a5 !important;
  box-shadow: 0 8px 24px rgba(41, 49, 165, 0.3) !important;
}

.data-table-card {
  border-radius: 8px;
  overflow: hidden;
}

.table-header {
  background: linear-gradient(135deg, #f5f5f5 0%, #fafafa 100%);
  border-bottom: 2px solid #2931a5;
}

.custom-table :deep(th) {
  background: #2931a5 !important;
  color: white !important;
  font-weight: 700 !important;
  font-size: 0.8rem !important;
  padding: 12px !important;
}

.custom-table :deep(td) {
  padding: 10px !important;
  font-size: 0.875rem;
}

.custom-table :deep(tr:hover) {
  background: #f5f7fa !important;
}

.index-number {
  display: inline-block;
  background: #e8eaf6;
  color: #2931a5;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 0.875rem;
}

.bank-chip {
  background: #e8eaf6 !important;
  color: #2931a5 !important;
  font-weight: 600 !important;
}

@media (max-width: 960px) {
  .filter-row {
    flex-direction: column;
    align-items: stretch;
  }
  .filter-item, .filter-item-wide {
    width: 100%;
    max-width: 100%;
  }
}
</style>