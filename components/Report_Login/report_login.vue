<template>
  <!-- Modern Header with Gradient -->
  <v-card class="mb-2 pa-3 header-card" elevation="8" rounded="lg">
    <div class="d-flex align-center justify-space-between flex-wrap">
      <div>
        <h1 class="text-h5 font-weight-bold mb-2 "style="color: white !important;">
          🧾 ປະຫວັດການເຂົ້າລະບົບ
        </h1>
        <p class="text-subtitle-2 white--text mb-0 ml-6 opacity-90" style="color: white !important;">
          User Access Logs & Activity Monitoring
        </p>
      </div>
      <div class="d-flex gap-3 mt-2 mt-md-0 flex-wrap">
        <v-chip large class="px-5 elevation-2 online-chip-header">
          <div class="online-indicator"></div>
          <v-icon left size="20">mdi-account-check</v-icon>
          <span class="font-weight-bold">{{ uniqueActiveUsersCount }} Online</span>
        </v-chip>
      </div>
    </div>
  </v-card>

  <!-- Advanced Filter Card -->
  <v-card class="mb-2 filter-card" elevation="4" rounded="lg">
    <div class="filter-header pa-3">
      <div class="d-flex align-center justify-space-between">
        <div class="d-flex align-center">
          <v-icon size="24" color="primary" class="mr-2">mdi-filter-variant</v-icon>
          <span class="text-h6 font-weight-bold">ຕົວກອງຂໍ້ມູນ (Filters)</span>
        </div>
        <v-btn color="error" variant="text" size="small" @click="clearFilters">
          <v-icon left>mdi-refresh</v-icon>
          ລ້າງຕົວກອງ
        </v-btn>
      </div>
    </div>

    <v-divider></v-divider>

    <!-- Filter Row 1: Date & Bank Filters -->
<!-- Filter Row 1: Date & Bank Filters -->
<div class="filter-content pa-3">
  <v-row>
    <!-- Date Type Selector -->
    <v-col cols="12" md="2" sm="3">
      <label class="filter-label">
        <v-icon size="16">mdi-calendar-clock</v-icon>
        ປະເພດວັນທີ່
      </label>
      <v-select
        v-model="dateFilterType"
        :items="dateTypeOptions"
        density="compact"
        variant="outlined"
        hide-details
        @update:model-value="onDateTypeChange"
        style="min-width: 120px;"
      ></v-select>
    </v-col>

    <!-- Date Filter Container with Fixed Width -->
    <v-col cols="12" md="3" sm="5" class="date-filter-container">
      <!-- Year Filter -->
      <div v-if="dateFilterType === 'year'">
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
          @update:model-value="applyFilters"
          style="max-width: 150px;"
        ></v-text-field>
      </div>

      <!-- Month Filter -->
      <div v-if="dateFilterType === 'month'">
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
            style="min-width: 120px;"
          ></v-select>
          <div class="year-control">
            <v-text-field
              v-model="selectedYear"
              type="number"
              density="compact"
              variant="outlined"
              hide-details
              readonly
              style="width: 100px;"
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
      <div v-if="dateFilterType === 'day'">
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
          @update:model-value="applyFilters"
          style="max-width: 200px;"
        ></v-text-field>
      </div>

      <!-- Date Range Filter (NEW) -->
      <div v-if="dateFilterType === 'range'">
        <label class="filter-label">
          <v-icon size="16">mdi-calendar-range</v-icon>
          ຊ່ວງວັນທີ່
        </label>
        <div class="d-flex gap-2 align-center">
          <v-text-field
            v-model="startDate"
            type="date"
            density="compact"
            variant="outlined"
            hide-details
            @update:model-value="applyFilters"
            style="max-width: 150px;"
          ></v-text-field>
          <span>-</span>
          <v-text-field
            v-model="endDate"
            type="date"
            density="compact"
            variant="outlined"
            hide-details
            @update:model-value="applyFilters"
            style="max-width: 150px;"
          ></v-text-field>
        </div>
      </div>
    </v-col>

    <!-- Bank Filter -->
    <v-col cols="12" md="3" sm="4">
      <label class="filter-label">
        <v-icon size="16">mdi-bank</v-icon>
        ທະນາຄານ
      </label>
      <v-select
        v-model="selectedBankFilter"
        :items="bankOptions"
        item-title="displayName"
        item-value="bnk_code"
        density="compact"
        variant="outlined"
        hide-details
        clearable
        placeholder="ທັງໝົດ"
        @update:model-value="applyFilters"
        style="max-width: 400px;"
      >
        <template v-slot:prepend-inner>
          <v-icon size="18" color="primary">mdi-filter</v-icon>
        </template>
      </v-select>
    </v-col>

    <!-- Username Search Filter (NEW) -->
    <v-col cols="12" md="2" sm="6">
      <label class="filter-label">
        <v-icon size="16">mdi-account-search</v-icon>
        ຄົ້ນຫາຊື່ຜູ້ໃຊ້
      </label>
      <v-text-field
        v-model="usernameSearch"
        density="compact"
        variant="outlined"
        hide-details
        clearable
        placeholder="ກະລຸນາປ້ອນຊື່ຜູ້ໃຊ້..."
        @update:model-value="applyFilters"
        style="max-width: 250px;"
      >
        <template v-slot:prepend-inner>
          <v-icon size="18" color="primary">mdi-magnify</v-icon>
        </template>
      </v-text-field>
    </v-col>

    <!-- Status Filter -->
    <v-col cols="12" md="2" sm="12">
      <label class="filter-label">
        <v-icon size="16">mdi-account-check</v-icon>
        ສະຖານະ
      </label>
      <v-select
        v-model="statusFilter"
        :items="statusOptions"
        density="compact"
        variant="outlined"
        hide-details
        @update:model-value="applyFilters"
        style="min-width: 150px;"
      >
        <template v-slot:prepend-inner>
          <v-icon size="18" color="primary">mdi-filter</v-icon>
        </template>
      </v-select>
    </v-col>
  </v-row>

  <!-- Active Filters Display -->
  <div v-if="hasActiveFilters" class="active-filters">
    <v-divider class="mb-1"></v-divider>
    <div class="d-flex align-center flex-wrap gap-2">
      <span class="text-caption font-weight-bold mr-2">ຕົວກອງທີ່ເລືອກ:</span>
      <v-chip size="small" color="primary" variant="flat">
        <v-icon start size="18">mdi-calendar</v-icon>
        {{ getCurrentFilterDisplay() }}
      </v-chip>
      <v-chip v-if="selectedBankFilter !== null" size="small" color="info" variant="flat" closable @click:close="selectedBankFilter = null; applyFilters()">
        <v-icon start size="18">mdi-bank</v-icon>
        {{ getBankDisplayName(selectedBankFilter) }}
      </v-chip>
      <v-chip v-if="usernameSearch" size="small" color="secondary" variant="flat" closable @click:close="usernameSearch = ''; applyFilters()">
        <v-icon start size="18">mdi-account</v-icon>
        {{ usernameSearch }}
      </v-chip>
      <v-chip v-if="statusFilter !== 'all'" size="small" :color="statusFilter === 'online' ? 'success' : 'grey'" variant="flat">
        <v-icon start size="18">{{ statusFilter === 'online' ? 'mdi-account-check' : 'mdi-account-off' }}</v-icon>
        {{ statusFilter === 'online' ? 'Online' : 'Offline' }}
      </v-chip>
    </div>
  </div>
</div>

  </v-card>

<!-- Total Records Display -->
  <div class="mb-3 d-flex justify-space-between align-center">
    <div class="d-flex align-center">
      <v-icon size="28" color="#2931a5" class="mr-2=">mdi-chart-box-outline</v-icon>
      <h2 class="text-h6 font-weight-bold" style="color: #2931a5;">
        ສະລຸບລາຍງານການເຂົ້າໃຊ້ລະບົບ
      </h2>
    </div>
    <v-chip class="px-4 py-4 elevation-3 records-chip">
      <v-icon left size="20" class="mr-1">mdi-database</v-icon>
      <span class="font-weight-bold text-subtitle-1">{{ filteredLogs.length }}</span>
      <span class="ml-1 text-caption opacity-90">ລາຍການທັງໝົດ</span>
    </v-chip>
  </div>

  <!-- Enhanced Table Card -->
  <v-card elevation="4" rounded="lg" class="table-card">
    <v-data-table
    :headers="headers"
    :items="filteredLogs"
    :loading="loading"
    :items-per-page="10"
    class="modern-table"
    >
      <!-- Custom Loading -->
      <template #loading>
        <v-skeleton-loader type="table-row@5"></v-skeleton-loader>
      </template>

      <!-- Custom Headers -->
      <template #headers>
        <tr class="table-header">
          <th class="text-center font-weight-bold" style="width: 60px;">ລຳດັບ.</th>
          <th class="text-center font-weight-bold" style="width: 100px;">
            <v-icon small class="mr-1" size="20">mdi-account</v-icon>
            ຊື່ຜູ້ໃຊ້
          </th>
          <th class="text-center font-weight-bold" style="width: 120px;">
            <v-icon small class="mr-1" size="20">mdi-bank</v-icon>
            ລະຫັດທະນາຄານ
          </th>
          <th class="text-center font-weight-bold" style="width: 150px;">
            <v-icon small class="mr-1" size="20">mdi-login</v-icon>
            ເວລາເຂົ້າໃຊ້ງານ
          </th>
          <th class="text-center font-weight-bold" style="width: 150px;">
            <v-icon small class="mr-1" size="20">mdi-logout</v-icon>
            ເວລາອອກຈາກລະບົບ
          </th>
          <th class="text-center font-weight-bold" style="width: 130px;">
            <v-icon small class="mr-1" size="20">mdi-ip-network</v-icon>
            IP Address
          </th>
          <th class="text-center font-weight-bold" style="width: 180px;">
            <v-icon small class="mr-1" size="20">mdi-note-text</v-icon>
            ລາຍລະອຽດ
          </th>
        </tr>
      </template>

      <!-- Custom Table Body -->
      <template #item="{ item, index }">
        <tr class="table-row" :class="{ 'active-user-row': !item.logout_time }">
          <td class="text-center">
            <v-chip small class="font-weight-bold" color="grey lighten-3">
              {{ index + 1 }}
            </v-chip>
          </td>

          <td class="text-center">
            <div class="d-flex align-left justify-left">
              <v-avatar size="36" :color="item.logout_time ? 'grey' : 'primary'" class="mr-2">
                <v-img 
                    v-if="item.user?.profile_image" 
                    :src="getProfileImageUrl(item.user.profile_image)"
                    cover
                ></v-img>
                <span v-else class="white--text font-weight-bold text-caption">
                    {{ getInitials(item.user?.username) }}
                </span>
                </v-avatar>
              <span class="font-weight-medium">
                {{ item.user?.username || '-' }}
              </span>
            </div>
          </td>

          <td class="text-center">
            <v-chip small color="info" outlined class="font-weight-medium ">
              <v-icon x-small left>mdi-bank</v-icon>
              {{ getBankCodeDisplay(item.bnk_code) }}
            </v-chip>
          </td>

          <td class="text-center">
            <div class="d-flex align-center justify-center">
              <v-icon small color="success" class="mr-2">mdi-login-variant</v-icon>
              <div>
                <div class="text-body-2 font-weight-medium">{{ formatDate(item.login_time) }}</div>
                <div class="text-caption grey--text">{{ formatTime(item.login_time) }}</div>
              </div>
            </div>
          </td>

          <td class="text-center">
            <div v-if="item.logout_time" class="d-flex align-center justify-center">
              <v-icon small color="error" class="mr-2">mdi-logout-variant</v-icon>
              <div>
                <div class="text-body-2 font-weight-medium">{{ formatDate(item.logout_time) }}</div>
                <div class="text-caption grey--text">{{ formatTime(item.logout_time) }}</div>
              </div>
            </div>
            <div v-else class="d-flex justify-center">
              <v-chip small color="success" class="pulse-chip">
                <v-icon x-small left>mdi-circle</v-icon>
                <span class="white--text font-weight-bold">Online</span>
              </v-chip>
            </div>
          </td>

          <td class="text-center">
            <v-chip small outlined color="primary">
              <v-icon x-small left>mdi-ip</v-icon>
              {{ item.ip_address || '-' }}
            </v-chip>
          </td>

          <td class="text-center">
            <span class="text-caption grey--text text--darken-1">
              {{ item.remarks || '-' }}
            </span>
          </td>
        </tr>
      </template>

      <!-- No Data State -->
      <template #no-data>
        <div class="text-center pa-8">
          <v-icon size="64" color="grey lighten-1">mdi-database-off</v-icon>
          <p class="text-h6 grey--text mt-2">ບໍ່ມີຂໍ້ມູນ</p>
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
const config = useRuntimeConfig();

const apiAccessLogs = `${config.public.strapi.url}api/access-logs/`;
const apiMemberURL = `${config.public.strapi.url}api/memberinfo/`;

const logs = ref([]);
const loading = ref(false);
const search = ref("");
const bankOptions = ref([]);
const bankMap = ref({});

const dateFilterType = ref("day");
const filterYear = ref("");
const filterYearMonth = ref("");
const filterDate = ref("");
const startDate = ref("");
const endDate = ref("");
const usernameSearch = ref("");
const selectedYear = ref("");
const selectedMonth = ref("");

const selectedBankFilter = ref(null); 
const statusFilter = ref("all");

const headers = [
  { title: 'ລຳດັບ.', key: 'index', align: 'center', sortable: false },
  { title: 'ຊື່ຜູ້ໃຊ້', key: 'user.username', align: 'center' },
  { title: 'ລະຫັດທະນາຄານ', key: 'bnk_code', align: 'center' },
  { title: 'ເວລາເຂົ້າໃຊ້ງານ', key: 'login_time', align: 'center' },
  { title: 'ເວລາອອກຈາກລະບົບ', key: 'logout_time', align: 'center' },
  { title: 'IP Address', key: 'ip_address', align: 'center' },
  { title: 'ເຫດການ', key: 'remarks', align: 'center' }
];

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

const statusOptions = [
  { title: 'ທັງໝົດ', value: 'all' },
  { title: '🟢 Online', value: 'online' },
  { title: '⚫ Offline', value: 'offline' }
];

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

const getProfileImageUrl = (profileImage) => {
  if (!profileImage) return '';
  if (profileImage.startsWith('http')) return profileImage;

  // ลบ /api/ และ / ท้ายทั้งหมดออก
  const baseUrl = config.public.strapi.url
    .replace('/api/', '')
    .replace('/api', '')
    .replace(/\/+$/, ''); // ลบ / ท้ายทั้งหมด
  
  console.log('Base URL:', baseUrl);
  console.log('Profile Image URL:', `${baseUrl}${profileImage}`);
  
  return `${baseUrl}${profileImage}`;
};

const changeYear = (increment) => {
  const currentYear = parseInt(selectedYear.value);
  selectedYear.value = String(currentYear + increment);
  updateYearMonth();
};

const updateYearMonth = () => {
  if (selectedYear.value && selectedMonth.value) {
    filterYearMonth.value = `${selectedYear.value}-${selectedMonth.value}`;
    applyFilters();
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
    default: return getDateFilterValue();
  }
};

const hasActiveFilters = computed(() => {
  // เช็ค date filter
  let hasDateFilter = false;
  if (dateFilterType.value === 'year' && filterYear.value) {
    hasDateFilter = true;
  } else if (dateFilterType.value === 'month' && filterYearMonth.value) {
    hasDateFilter = true;
  } else if (dateFilterType.value === 'day' && filterDate.value) {
    hasDateFilter = true;
  } else if (dateFilterType.value === 'range' && startDate.value && endDate.value) {
    hasDateFilter = true;
  }
  
  return hasDateFilter ||
         selectedBankFilter.value !== null || 
         statusFilter.value !== 'all' || 
         usernameSearch.value !== '';
});

const getBankDisplayName = (bnkCode) => {
  if (bnkCode === null || bnkCode === undefined) return 'ທັງໝົດ';
  const bank = bankOptions.value.find(b => b.bnk_code === bnkCode);
  return bank ? bank.displayName : bnkCode;
};

const getBankCodeDisplay = (bnkCode) => {
  if (!bnkCode) return '-';
  const bank = bankMap.value[bnkCode];
  if (bank && bank.code) {
    return `${bank.code}-${bnkCode}`;
  }
  return bnkCode;
};

const getInitials = (username) => {
  if (!username) return "?";
  return username.substring(0, 2).toUpperCase();
};

const formatDate = (datetime) => {
  if (!datetime) return "-";
  const date = new Date(datetime);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatTime = (datetime) => {
  if (!datetime) return "";
  const date = new Date(datetime);
  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

const matchesDateFilter = (loginTime) => {
  if (!loginTime) return false;
  const loginDate = new Date(loginTime);
  
  switch (dateFilterType.value) {
    case 'year':
      return loginDate.getFullYear() === parseInt(filterYear.value);
    case 'month':
      const [year, month] = filterYearMonth.value.split('-');
      return loginDate.getFullYear() === parseInt(year) && 
             (loginDate.getMonth() + 1) === parseInt(month);
    case 'day':
      return loginDate.toISOString().split('T')[0] === filterDate.value;
    case 'range':
      if (!startDate.value || !endDate.value) return true;
      const start = new Date(startDate.value);
      const end = new Date(endDate.value);
      end.setHours(23, 59, 59, 999); // รวมถึงวันสุดท้าย
      return loginDate >= start && loginDate <= end;
    default:
      return true;
  }
};

const loadLogs = async () => {
  loading.value = true;
  try {
    const token = localStorage.getItem("access_token");
    const res = await axios.get(apiAccessLogs, {
      headers: { Authorization: `Bearer ${token}` },
    });
    logs.value = res.data;
  } catch (error) {
    console.error("Error loading access logs:", error);
  } finally {
    loading.value = false;
  }
};

const fetchBankOptions = async () => {
  try {
    const response = await axios.get(apiMemberURL);
    const banks = response.data?.data || response.data?.results || response.data || [];
    
    bankMap.value = {};
    banks.forEach(b => {
      bankMap.value[b.bnk_code] = {
        code: b.code || '',
        name: b.nameL || b.name || ''
      };
    });
    
    // เพิ่มตัวเลือก "ທັງໝົດ" ที่ด้านบน
    bankOptions.value = [
      { bnk_code: null, displayName: '📊 ທັງໝົດ (All Banks)' },
      ...banks.map(b => ({
        bnk_code: b.bnk_code,
        displayName: `${b.nameL || b.name} (${b.code}-${b.bnk_code})`
      }))
    ];
  } catch (error) {
    console.error("Error fetching bank options:", error);
  }
};

// ปรับ filteredLogs
const filteredLogs = computed(() => {
  let filtered = logs.value;
  filtered = filtered.filter(log => matchesDateFilter(log.login_time));
  
  // Bank filter
  if (selectedBankFilter.value !== null && selectedBankFilter.value !== undefined) {
    filtered = filtered.filter(log => log.bnk_code === selectedBankFilter.value);
  }
  
  // Username search filter (NEW)
  if (usernameSearch.value) {
    const searchTerm = usernameSearch.value.toLowerCase();
    filtered = filtered.filter(log => 
      log.user?.username?.toLowerCase().includes(searchTerm)
    );
  }
  
  if (statusFilter.value === 'online') {
    filtered = filtered.filter(log => !log.logout_time);
  } else if (statusFilter.value === 'offline') {
    filtered = filtered.filter(log => log.logout_time);
  }
  
  return filtered;
});

const uniqueActiveUsersCount = computed(() => {
  const activeUsers = filteredLogs.value.filter(log => !log.logout_time);
  const uniqueUIDs = new Set();
  activeUsers.forEach(log => {
    if (log.user && log.user.UID) {
      uniqueUIDs.add(log.user.UID);
    }
  });
  return uniqueUIDs.size;
});

const applyFilters = () => {};

// ปรับ clearFilters
const clearFilters = () => {
  dateFilterType.value = "day";
  initializeDefaultDate();
  selectedBankFilter.value = null;
  statusFilter.value = "all";
  search.value = "";
  usernameSearch.value = ""; // เพิ่มบรรทัดนี้
};
const onDateTypeChange = () => {
  applyFilters();
};

onMounted(async () => {
  initializeDefaultDate();
  await fetchBankOptions();
  await loadLogs();
});
</script>

<style scoped>
.header-card {
  background: linear-gradient(135deg, #2931a5 0%, #2233a1 100%);
}
.opacity-90 { opacity: 0.9; }
.gap-3 { gap: 12px; }
.filter-card { border-left: 4px solid #2931a5; }
.filter-header { background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%); }
.filter-label {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #2931a5;
  margin-bottom: 4px;
}
.month-year-selector { display: flex; gap: 8px; }
.year-control { position: relative; width: 100px; }
.year-arrows {
  position: absolute;
  right: 2px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
}
.date-filter-container { min-height: 70px; }
.active-filters {
  background: #f5f7fa;
  padding: 12px;
  border-radius: 8px;
}
.table-card { overflow: visible !important; height: auto !important; }
.modern-table { border-radius: 12px; }
.modern-table :deep(.v-table__wrapper) {
  overflow-x: visible !important;
  overflow-y: visible !important;
  height: auto !important;
}
.table-header th {
  background: linear-gradient(135deg, #2931a5 0%, #2233a1 100%) !important;
  color: white !important;
  font-size: 0.875rem !important;
  padding: 18px 16px !important;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.table-row {
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
}
.table-row:hover {
  background-color: #f8f9fa !important;
  transform: translateX(2px);
  border-left: 3px solid #2931a5;
  box-shadow: 0 2px 12px rgba(41, 49, 165, 0.15);
}
.active-user-row { background-color: #f0fdf4 !important; }
.active-user-row:hover { background-color: #dcfce7 !important; }
.table-row td {
  padding: 16px !important;
  border-bottom: 1px solid #e9ecef !important;
}
@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7); }
  70% { box-shadow: 0 0 0 6px rgba(76, 175, 80, 0); }
  100% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0); }
}
.pulse-chip { animation: pulse 2s infinite; }
.online-chip-header {
  position: relative;
  background: rgba(255, 255, 255, 0.25) !important;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3) !important;
  color: white !important;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}
.online-chip-header:hover {
  background: rgba(255, 255, 255, 0.35) !important;
  border-color: rgba(255, 255, 255, 0.5) !important;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}
.online-indicator {
  width: 10px;
  height: 10px;
  background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
  border-radius: 50%;
  animation: blink 1.5s infinite;
  box-shadow: 0 0 12px rgba(74, 222, 128, 0.8), 0 0 24px rgba(74, 222, 128, 0.4);
}
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}
.records-chip {
  background: white !important;
  border: 2px solid #2931a5 !important;
  color: #2931a5 !important;
  transition: all 0.3s ease;
}
.records-chip:hover {
  background: linear-gradient(135deg, #2931a5 0%, #2233a1 100%) !important;
  color: white !important;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(41, 49, 165, 0.3);
}
.records-chip:hover .v-icon {
  color: white !important;
}
@media (max-width: 960px) {
  .header-card { padding: 16px !important; }
  .header-card h1 { font-size: 1.5rem !important; }
  .gap-3 { width: 100%; justify-content: space-between; }
}
</style>