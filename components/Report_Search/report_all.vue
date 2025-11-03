<template>
  <!-- Header -->
  <v-card class="header-card mb-2" elevation="0">
    <div class="d-flex align-center justify-space-between">
      <div class="d-flex align-center">
        <v-btn 
          icon 
          variant="flat" 
          @click="goBack" 
          class="back-btn mr-4"
          color="rgba(255,255,255,0.2)"
        >
          <v-icon size="24">mdi-arrow-left</v-icon>
        </v-btn>
        <div>
          <h1 class="text-h5 font-weight-bold mb-1">{{ getGroupTitle() }}</h1>
          <p class="text-body-2 mb-0 opacity-90">Summary by Bank</p>
        </div>
      </div>
    </div>
  </v-card>

<v-card class="filter-card mb-2" elevation="3">
  <!-- Filter Header -->
  <div class="filter-header pa-2">
    <div class="d-flex align-center justify-space-between">
      <div class="d-flex align-center">
        <div class="filter-icon-wrapper mr-3">
          <v-icon size="28" color="primary">mdi-filter-variant</v-icon>
        </div>
        <div>
          <h2 class="text-h6 font-weight-bold">ຕົວກອງຂໍ້ມູນ</h2>
          <p class="text-caption mb-0 text-medium-emphasis">Filter & Search Options</p>
        </div>
      </div>

      <!-- ปุ่มล้างตัวกรอง (ขวาสุด) -->
      <v-btn
        color="error"
        variant="tonal"
        size="small"
        prepend-icon="mdi-refresh"
        @click="showAllBanks"
        :disabled="filterParams.bnk_code === '01'"
        class="clear-btn"
      >
        ລ້າງຕົວກອງ
      </v-btn>
    </div>
  </div>

  <!-- Filter Body: เลือกธนาคาร + วันที่ -->
  <div class="pa-4 pt-0" >
    <div class="d-flex align-center flex-wrap gap-4">
      <!-- เลือกธนาคาร -->
      <v-select
        v-model="filterParams.bnk_code"
        :items="bankOptions"
        item-title="displayName"
        item-value="bnk_code"
        label="ເລືອກສະມາຊິກ"
        dense
        outlined
        clearable
        class="bank-select"
        style="min-width: 200px; max-width: 500px;"
        @update:model-value="handleBankSelect"
      ></v-select>

      <!-- ชิปวันที่ -->
      <v-chip class="filter-chip ml-10" size="default" variant="flat" color="primary">
        <v-icon start size="18" >mdi-calendar</v-icon>
        <span class="font-weight-medium">{{ getFilterDateDisplay() }}</span>
      </v-chip>
    </div>
  </div>
</v-card>

  <!-- Loading State -->
  <v-card v-if="loading" class="loading-card pa-12 text-center" elevation="0">
    <v-progress-circular 
      indeterminate 
      color="primary" 
      size="80" 
      width="6"
      class="mb-6"
    ></v-progress-circular>
    <p class="text-h6 font-weight-medium">ກຳລັງໂຫຼດຂໍ້ມູນ...</p>
    <p class="text-body-1 text-medium-emphasis mt-2">Please wait</p>
  </v-card>

  <!-- Data Table -->
  <v-card v-else class="data-table-card" elevation="0">
    <v-card-title class="table-header pa-2">
      <div class="d-flex align-center justify-space-between w-100">
        <div class="d-flex align-center">
          <v-icon class="mr-3" size="28" color="#2233a1">mdi-bank-outline</v-icon>
          <span class="text-h6 font-weight-bold">ສະຫຼຸບຕາມທະນາຄານ</span>
        </div>
        <v-chip class="count-chip" size="large" variant="flat">
          <v-icon start size="20" class="ml-1">mdi-bank-outline</v-icon>
          <span class="font-weight-bold">{{ reportData.length }} ທະນາຄານ</span>
        </v-chip>
      </div>
    </v-card-title>

    <v-divider class="divider-line"></v-divider>

    <v-data-table
      :headers="headers"
      :items="reportData"
      :items-per-page="10"
      class="custom-table elevation-0"
      hover
    >
      <template v-slot:item.no="{ index }">
        <span class="index-number">{{ index + 1 }}</span>
      </template>

      <template v-slot:item.bnk_code="{ item }">
        <v-chip size="small" class="bank-chip" variant="flat">
          {{ item.bnk_code }}
        </v-chip>
      </template>

      <template v-slot:item.bank_name="{ item }">
        <div class="d-flex align-center">
          <v-icon size="18" class="mr-2" color="primary">mdi-bank</v-icon>
          <span class="font-weight-medium">{{ item.bank_name }}</span>
        </div>
      </template>

      <template v-slot:item.total="{ item }">
        <v-chip color="#2326b9" size="small" variant="flat">
          <span class="font-weight-bold">{{ item.total }}</span>
        </v-chip>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-btn
          color="primary"
          variant="tonal"
          size="small"
          @click="viewDetails(item.bnk_code)"
          prepend-icon="mdi-eye"
        >
          ເບິ່ງລາຍລະອຽດ
        </v-btn>
      </template>

      <template v-slot:no-data>
        <div class="no-data-container text-center pa-12">
          <v-icon size="80" color="grey-lighten-1">mdi-database-off-outline</v-icon>
          <p class="text-h5 font-weight-medium mt-6 mb-2">ບໍ່ມີຂໍ້ມູນ</p>
          <p class="text-body-1 text-medium-emphasis">No data available</p>
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import { useRoute, useRouter, useRuntimeConfig } from "#imports";

const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();

const apiReportAllURL = `${config.public.strapi.url}api/request-charge-report-all/`;
const apiMemberURL = `${config.public.strapi.url}api/memberinfo/`;

const loading = ref(false);
const rawReportData = ref([]); // ข้อมูลดิบจาก backend
const filterParams = ref({
  group: '',
  bnk_code: '',
  date_filter_type: '',
  date_filter_value: ''
});

// กรองข้อมูลที่ frontend
const reportData = computed(() => {
  if (!filterParams.value.bnk_code || filterParams.value.bnk_code === '01') {
    return rawReportData.value;
  }
  return rawReportData.value.filter(item => item.bnk_code === filterParams.value.bnk_code);
});

const headers = [
  { title: 'ລຳດັບ', key: 'no', align: 'center', sortable: false },
  { title: 'ລະຫັດທະນາຄານ', key: 'bnk_code', align: 'center' },
  { title: 'ຊື່ທະນາຄານ', key: 'bank_name', align: 'start' },
  { title: 'ຈຳນວນທັງໝົດ', key: 'total', align: 'center' },
  { title: 'ການດຳເນີນການ', key: 'actions', align: 'center', sortable: false }
];

// สำหรับ v-select
const bankOptions = ref([]);

// โหลด bankOptions
const fetchBankOptions = async () => {
  try {
    const { data: memberData } = await axios.get(apiMemberURL);
    const banks = memberData.data || memberData.results || memberData || [];
    bankOptions.value = banks.map(b => ({
      bnk_code: b.bnk_code,
      displayName: `${b.nameL || b.name} (${b.bnk_code})`
    }));
  } catch (err) {
    console.error('Error fetching bank options:', err);
  }
};

const getFilterParams = () => {
  filterParams.value = {
    group: route.query.group || '',
    bnk_code: route.query.bnk_code || '',
    date_filter_type: route.query.date_filter_type || '',
    date_filter_value: route.query.date_filter_value || ''
  };
};

const getGroupTitle = () => {
  const titles = {
    'group1': 'ບົດລາຍງານສິນເຊື່ອ',
    'group2': 'ບົດລາຍງານຄະແນນສິນເຊື່ອ',
    'group3': 'ບົດລາຍງານສາທາລະນູປະໂພກ'
  };
  return titles[filterParams.value.group] || 'Report Summary';
};

const handleBankSelect = (value) => {
  // ถ้ากด Clear → value จะเป็น null หรือ undefined
  if (!value) {
    filterParams.value.bnk_code = '01'; // ตั้งเป็น 01
  }
  // ไม่ต้องทำอะไรเพิ่ม → computed จะอัปเดตเอง
};

const getFilterDateDisplay = () => {
  const type = filterParams.value.date_filter_type;
  const value = filterParams.value.date_filter_value;
  switch (type) {
    case 'year': return `Year: ${value}`;
    case 'month': return `Month: ${value}`;
    case 'day': return `Date: ${value}`;
    default: return value;
  }
};

// ดึงข้อมูลด้วย bnk_code=01 เสมอ
const fetchReportAllData = async () => {
  loading.value = true;
  try {
    const params = {
      bnk_code: '01',  // ต้องส่ง 01 เท่านั้น
      group: filterParams.value.group,
      date_filter_type: filterParams.value.date_filter_type,
      date_filter_value: filterParams.value.date_filter_value
    };

    const { data } = await axios.get(apiReportAllURL, { params });
    
    const { data: memberData } = await axios.get(apiMemberURL);
    const banks = memberData.data || memberData.results || memberData || [];
    const bankMap = {};
    banks.forEach(b => {
      bankMap[b.bnk_code] = b.nameL || b.name || b.bnk_code;
    });

    // เก็บข้อมูลดิบ
    rawReportData.value = (data.results || []).map(item => ({
      bnk_code: item.bnk_code,
      bank_name: bankMap[item.bnk_code] || `ທະນາຄານ ${item.bnk_code}`,
      total: item.total
    }));

  } catch (err) {
    console.error('Error fetching report all:', err);
    rawReportData.value = [];
  } finally {
    loading.value = false;
  }
};

// เมื่อเปลี่ยน select → ไม่ต้อง fetch ใหม่ → computed กรองให้
const onBankChange = () => {
  // ไม่ต้องทำอะไร → computed จะอัปเดตเอง
};

// ปุ่มแสดงทั้งหมด
const showAllBanks = () => {
  filterParams.value.bnk_code = '01'; // ตั้งเป็น 01 → แสดงทั้งหมด
  // ไม่ต้อง fetch ใหม่ → computed ใช้ rawData เดิม
};

const viewDetails = (detail_bnk_code) => {
  router.push({
    path: route.path,
    query: { ...route.query, detail_bnk_code }
  });
};

const goBack = () => {
  router.push({ path: route.path, query: {} });
};

onMounted(async () => {
  getFilterParams();
  await fetchBankOptions();

  if (filterParams.value.bnk_code !== "01") {
    console.error('Access denied: Only admin can access report_all');
    goBack();
    return;
  }
  
  fetchReportAllData();
});
</script>

<style scoped>
.header-card {
  border-radius: 16px;
  background: linear-gradient(135deg, #2931a5 0%, #2233a1 100%);
  padding: 24px 32px !important;
  color: white;
  box-shadow: 0 4px 20px rgba(41, 49, 165, 0.4) !important;
}

.back-btn {
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.3) !important;
  transform: translateX(-4px);
}

.filter-card {
  border-radius: 16px;
  background: white;
  border: 2px solid #e8eaf6;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06) !important;
}

.filter-icon {
  color: #2931a5;
}

.filter-chip {
  background: linear-gradient(135deg, #e8eaf6 0%, #c5cae9 100%) !important;
  color: #2931a5 !important;
  padding: 8px 16px;
  border-radius: 12px;
}

.loading-card {
  border-radius: 16px;
  background: white;
  border: 2px dashed #E0E0E0;
}

.data-table-card {
  border-radius: 16px;
  background: white;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08) !important;
  overflow: hidden;
}

.table-header {
  background: linear-gradient(135deg, #F5F5F5 0%, #FAFAFA 100%);
  border-bottom: 3px solid #2931a5;
}

.count-chip {
  background: linear-gradient(135deg, #225f97 0%, #2326b9 100%) !important;
  color: white !important;
  padding: 8px 20px;
  border-radius: 12px;
}

.custom-table :deep(th) {
  background: #2931a5 !important;
  color: white !important;
  font-weight: 800 !important;
  font-size: 0.875rem !important;
  text-transform: uppercase;
  padding: 16px !important;
}

.custom-table :deep(td) {
  padding: 16px !important;
  border-bottom: 1px solid #F5F5F5 !important;
}

.custom-table :deep(tr:hover) {
  background: linear-gradient(135deg, #F8F9FA 0%, #e8eaf6 100%) !important;
}

.index-number {
  display: inline-block;
  background: linear-gradient(135deg, #e8eaf6 0%, #c5cae9 100%);
  color: #2931a5;
  font-weight: 700;
  padding: 8px 16px;
  border-radius: 10px;
}

.bank-chip {
  background: linear-gradient(135deg, #e8eaf6 0%, #c5cae9 100%) !important;
  color: #2931a5 !important;
  font-weight: 600 !important;
}


</style>