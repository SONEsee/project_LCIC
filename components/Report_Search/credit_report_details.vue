<template>
  <!-- Header with Back Button -->
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
          <p class="text-body-2 mb-0 opacity-90">Credit Report Detail</p>
        </div>
      </div>
    </div>
  </v-card>

  <!-- Filter Summary Card -->
  <v-card class="filter-card mb-2" elevation="0">
    <div class="pa-5">
      <div class="d-flex align-center mb-2">
        <v-icon class="filter-icon mr-2" size="24">mdi-filter-variant</v-icon>
        <h3 class="text-h6 font-weight-bold mb-0">ຕົວກອງທີ່ເລືອກ</h3>
        <v-progress-circular
          v-if="loading"
          indeterminate
          color="primary"
          size="20"
          width="2"
          class="ml-3"
        ></v-progress-circular>
      </div>
      <div class="d-flex flex-wrap gap-3">
        <v-chip class="filter-chip" size="default" variant="flat">
          <v-icon start size="18">mdi-bank</v-icon>
          <span class="font-weight-medium">{{ displayBnkCode }}</span>
        </v-chip>
        <v-chip class="filter-chip" size="default" variant="flat">
          <v-icon start size="18">mdi-calendar</v-icon>
          <span class="font-weight-medium">{{ getFilterDateDisplay() }}</span>
        </v-chip>
      </div>
    </div>
  </v-card>

  <!-- Data Table Card -->
  <v-card class="data-table-card" elevation="0">
    <v-card-title class="table-header pa-2">
      <div class="d-flex align-center justify-space-between w-100">
        <div class="d-flex align-center">
          <v-icon class="mr-3" size="28" color="#2233a1">mdi-table-large</v-icon>
          <span class="text-h6 font-weight-bold">ລາຍລະອຽດບົດລາຍງານ</span>
        </div>
        <v-chip class="count-chip" size="large" variant="flat">
          <v-icon start size="20">mdi-file-document-multiple</v-icon>
          <span class="font-weight-bold">{{ reportData.length }} ລາຍການ</span>
        </v-chip>
      </div>
    </v-card-title>

    <v-divider class="divider-line"></v-divider>

    <!-- Skeleton Loading -->
    <div v-if="loading && reportData.length === 0" class="pa-6">
      <v-skeleton-loader
        v-for="i in 8"
        :key="i"
        type="table-row"
        class="mb-2"
      ></v-skeleton-loader>
    </div>

    <!-- Data Table -->
    <v-data-table
      v-else
      :headers="dynamicHeaders"
      :items="reportData"
      :items-per-page="10"
      :loading="loading"
      class="custom-table elevation-0"
      hover
    >
      <template v-slot:item.no="{ index }">
        <span class="index-number">{{ index + 1 }}</span>
      </template>

      <template v-for="field in visibleFields" v-slot:[`item.${field}`]="{ item }">
        <span :style="getFieldStyle(field, item[field])" class="table-cell-content">
          <template v-if="field === 'chg_code'">
            <v-chip size="small" class="chg-chip" variant="flat">
              {{ item.chg_lao_type || item.chg_code }}
            </v-chip>
          </template>
          <template v-else-if="field === 'user_sys_id'">
            <div class="d-flex align-center">
              <v-icon size="16" class="mr-1">mdi-account</v-icon>
              {{ item.username || item.user_sys_id }}
            </div>
          </template>
          <template v-else-if="field === 'rec_insert_date'">
            <div class="date-cell">
              <v-icon size="16" class="mr-1">mdi-clock-outline</v-icon>
              {{ formatRecInsertDate(item[field]) }}
            </div>
          </template>
          <template v-else>{{ item[field] }}</template>
        </span>
      </template>

      <template v-slot:no-data>
        <div class="no-data-container text-center pa-12">
          <v-icon size="80" color="grey-lighten-1">mdi-database-off-outline</v-icon>
          <p class="text-h5 font-weight-medium mt-6 mb-2">ບໍ່ມີຂໍ້ມູນ</p>
          <p class="text-body-1 text-medium-emphasis">No data available for the selected filters</p>
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import axios from "axios";
import { useRoute, useRouter, useRuntimeConfig } from "#imports";
import { useUserUID } from '~/composables/useUserUID';

const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();

const apiDetailURL = `${config.public.strapi.url}api/request-charge-detail/`;
const apiChargeMatrixURL = `${config.public.strapi.url}api/charge-matrix/`;
const apiUserURL = `${config.public.strapi.url}api/user/`;
const apiMemberURL = `${config.public.strapi.url}api/memberinfo/`;

const { userData, UID } = useUserUID();
const currentBnkCode = computed(() => userData.value.MID?.id || '');
const currentUID = computed(() => UID.value || null);

const loading = ref(false);
const reportData = ref([]);
const dynamicHeaders = ref([]);
const filterParams = ref({
  group: '',
  bnk_code: '',
  detail_bnk_code: '',
  date_filter_type: '',
  date_filter_value: '',
  start_date: '', // ✅ เพิ่ม
  end_date: ''    // ✅ เพิ่ม
});

const displayBnkCode = computed(() => {
  const found = reportData.value[0];
  return found?.bank_full_display || `${filterParams.value.detail_bnk_code || currentBnkCode.value}`;
});

const visibleFields = [
  "bnk_code",
  "LCIC_code",
  "chg_code",
  "cusType",
  "rec_reference_code",
  "lon_purpose",
  "user_sys_id",
  "rec_insert_date"
];

const getFilterParams = () => {
  filterParams.value = {
    group: route.query.group || '',
    bnk_code: currentBnkCode.value,
    detail_bnk_code: route.query.detail_bnk_code || '',
    date_filter_type: route.query.date_filter_type || '',
    date_filter_value: route.query.date_filter_value || '',
    start_date: route.query.start_date || '', // ✅ เพิ่ม
    end_date: route.query.end_date || ''       // ✅ เพิ่ม
  };
};

const getGroupTitle = () => {
  const titles = {
    'group1': 'ບົດລາຍງານສິນເຊື່ອ',
    'group2': 'ບົດລາຍງານຄະແນນສິນເຊື່ອ',
    'group3': 'ບົດລາຍງານສາທາລະນູປະໂພກ'
  };
  return titles[filterParams.value.group] || 'Report Detail';
};

const getFilterDateDisplay = () => {
  const type = filterParams.value.date_filter_type;
  const value = filterParams.value.date_filter_value;
  const start = filterParams.value.start_date;
  const end = filterParams.value.end_date;

  // ✅ รองรับ Date Range
  if (type === 'range' && start && end) {
    return `${start} - ${end}`;
  }

  switch (type) {
    case 'year': return `ປີ: ${value}`;
    case 'month': return `ເດືອນ: ${value}`;
    case 'day': return `ວັນທີ່: ${value}`;
    default: return value || 'N/A';
  }
};

const formatRecInsertDate = (value) => {
  if (!value) return '-';
  return value.substring(0, 19).replace('T', ', ');
};

const getFieldStyle = (field, value) => {
  let style = { fontWeight: 'normal', color: '#000' };
  if (field === 'chg_code') style = { color: '#2931a5', fontWeight: '600' };
  else if (field === 'cusType') style = { color: '#388E3C', fontWeight: '600' };
  else if (field === 'rec_insert_date') style = { color: '#F57C00', fontWeight: '500' };
  return style;
};

const fetchDetailData = async () => {
  loading.value = true;
  try {
    const params = {
      bnk_code: filterParams.value.bnk_code,
      detail_bnk_code: filterParams.value.detail_bnk_code,
      group: filterParams.value.group,
      date_filter_type: filterParams.value.date_filter_type
    };

    // ✅ รองรับ Date Range
    if (filterParams.value.date_filter_type === 'range') {
      params.start_date = filterParams.value.start_date;
      params.end_date = filterParams.value.end_date;
    } else {
      params.date_filter_value = filterParams.value.date_filter_value;
    }

    const { data } = await axios.get(apiDetailURL, { params });
    let results = data.results || [];

    // ดึงข้อมูล memberinfo
    const { data: memberData } = await axios.get(apiMemberURL);
    const banks = memberData.data || memberData.results || memberData || [];

    const bankMap = {};
    banks.forEach(b => {
      bankMap[b.bnk_code] = {
        nameL: b.nameL || b.name || '-',
        code: b.code || '',
        bnk_code: b.bnk_code
      };
    });

    // ดึงข้อมูล chg_lao_type
    const { data: matrixData } = await axios.get(apiChargeMatrixURL);
    const matrixMap = {};
    (matrixData.results || matrixData || []).forEach(item => {
      if (item.chg_code) matrixMap[item.chg_code] = item.chg_lao_type;
    });

    // ดึงข้อมูล user
    const { data: userData } = await axios.get(apiUserURL);
    const userMap = {};
    (userData.results || userData || []).forEach(u => {
      if (u.user_id || u.UID) userMap[u.UID] = u.username;
    });

    // รวมข้อมูล
    reportData.value = results.map(r => {
      const bank = bankMap[r.bnk_code] || {};
      return {
        ...r,
        chg_lao_type: matrixMap[r.chg_code] || r.chg_code,
        username: userMap[r.user_sys_id.split('-')[0]] || r.user_sys_id,
        bank_display: bank.code ? `${bank.code}-${bank.bnk_code}` : r.bnk_code,
        bank_full_display: bank.nameL ? `${bank.nameL} - (${bank.code}-${bank.bnk_code})` : r.bnk_code
      };
    });

    // หัวตาราง
    dynamicHeaders.value = [
      { title: 'NO', key: 'no', align: 'center', sortable: false },
      { title: 'ລະຫັດທະນາຄານ', key: 'bnk_code', align: 'center' },
      { title: 'ລະຫັດລູກຄ້າ', key: 'LCIC_code', align: 'start' },
      { title: 'ປະເພດຄ່າທຳນຽມ', key: 'chg_code', align: 'start' },
      { title: 'ປະເພດລູກຄ້າ', key: 'cusType', align: 'center' },
      { title: 'ເລກທີ່ອ້າງອີງ', key: 'rec_reference_code', align: 'start' },
      { title: 'ຈຸດປະສົງສິນເຊື່ອ', key: 'lon_purpose', align: 'start' },
      { title: 'ຜູ້ບັນທຶກ', key: 'user_sys_id', align: 'start' },
      { title: 'ວັນທີ່ບັນທຶກ', key: 'rec_insert_date', align: 'center' }
    ];
  } catch (err) {
    console.error('❌ Error fetching detail data:', err);
    if (err.response?.status === 400) {
      alert(err.response.data.error || 'Error: Missing detail_bnk_code');
      goBack();
    }
    reportData.value = [];
  } finally {
    loading.value = false;
  }
};

const goBack = () => {
  if (filterParams.value.detail_bnk_code) {
    const { detail_bnk_code, ...restQuery } = route.query;
    router.push({
      path: route.path,
      query: restQuery
    });
  } else {
    router.push({
      path: route.path,
      query: {}
    });
  }
};

watch(() => route.query, () => {
  getFilterParams();
  fetchDetailData();
}, { immediate: true });

onMounted(() => {
  getFilterParams();
  fetchDetailData();
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
  transition: all 0.3s ease;
}

.filter-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1) !important;
  transform: translateY(-2px);
}

.filter-icon {
  color: #2931a5;
}

.filter-chip {
  background: linear-gradient(135deg, #e8eaf6 0%, #c5cae9 100%) !important;
  color: #2931a5 !important;
  padding: 8px 16px;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.filter-chip:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(41, 49, 165, 0.25);
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

.divider-line {
  border-color: #E0E0E0;
  border-width: 2px;
}

.count-chip {
  background: linear-gradient(135deg, #225f97 0%, #2326b9 100%) !important;
  color: white !important;
  padding: 8px 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
}

.custom-table {
  font-size: 0.95rem;
}

.custom-table :deep(th) {
  background: #2931a5 !important;
  color: white !important;
  font-weight: 500 !important;
  font-size: 0.800rem !important;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 10px 14px !important;
  border-bottom: 2px solid #2233a1 !important;
}

.custom-table :deep(td) {
  padding: 14px !important;
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
  padding: 6px 14px;
  border-radius: 10px;
  font-size: 0.9rem;
  box-shadow: 0 2px 6px rgba(41, 49, 165, 0.15);
}

.table-cell-content {
  display: inline-block;
  line-height: 1.6;
}

.chg-chip {
  background: linear-gradient(135deg, #e8eaf6 0%, #c5cae9 100%) !important;
  color: #2931a5 !important;
  font-weight: 600 !important;
  border-radius: 8px;
}

.date-cell {
  display: flex;
  align-items: center;
  color: #F57C00;
  font-weight: 500;
}

.no-data-container {
  background: linear-gradient(135deg, #FAFAFA 0%, #F5F5F5 100%);
  border-radius: 12px;
  margin: 24px;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

@media (max-width: 960px) {
  .header-card {
    padding: 16px 20px !important;
  }

  .header-card h1 {
    font-size: 1.5rem !important;
  }

  .d-flex.gap-3 {
    gap: 8px !important;
  }

  .filter-chip {
    font-size: 0.85rem;
  }

  .table-header {
    flex-direction: column;
    align-items: flex-start !important;
  }

  .count-chip {
    margin-top: 12px;
  }
}

@media (max-width: 600px) {
  .custom-table :deep(th),
  .custom-table :deep(td) {
    padding: 12px 8px !important;
    font-size: 0.85rem !important;
  }
}
</style>