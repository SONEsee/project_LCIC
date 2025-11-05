<template>
  <!-- Modern Header with Gradient -->
  <v-card class="mb-2 pa-3 header-card" elevation="8" rounded="lg">
    <div class="d-flex align-center justify-space-between flex-wrap">
      <div>
        <h1 class="text-h4 font-weight-bold mb-2 "style="color: white !important;">
          🧾 ປະຫວັດການເຂົ້າລະບົບ
        </h1>
        <p class="text-subtitle-1 white--text mb-0 ml-6 opacity-90" style="color: white !important;">
          User Access Logs & Activity Monitoring
        </p>
      </div>
      <div class="d-flex gap-3 mt-2 mt-md-0 flex-wrap">
        <v-chip color="white" large class="px-4 elevation-2">
          <v-icon left color="primary">mdi-database</v-icon>
          <span class="font-weight-bold">{{ filteredLogs.length }} Records</span>
        </v-chip>
        <v-chip color="success" large class="px-4 elevation-2 pulse-animation">
          <v-icon left color="white">mdi-account-check</v-icon>
          <span class="font-weight-bold white--text">{{ activeUsersCount }} Online</span>
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
          ລ້າງ
        </v-btn>
      </div>
    </div>

    <v-divider></v-divider>

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
        </v-col>

        <!-- Bank Filter -->
        <v-col cols="12" md="5" sm="4">
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
          <span class="text-caption font-weight-bold mr-2">ການກອງທີ່ໃຊ້ງານ:</span>
          <v-chip size="small" color="primary" variant="flat">
            <v-icon start size="18">mdi-calendar</v-icon>
            {{ getCurrentFilterDisplay() }}
          </v-chip>
          <v-chip v-if="selectedBankFilter !== '01'" size="small" color="info" variant="flat" closable @click:close="selectedBankFilter = '01'; applyFilters()">
            <v-icon start size="18">mdi-bank</v-icon>
            {{ getBankDisplayName(selectedBankFilter) }}
          </v-chip>
          <v-chip v-if="statusFilter !== 'all'" size="small" :color="statusFilter === 'online' ? 'success' : 'grey'" variant="flat">
            <v-icon start size="18">{{ statusFilter === 'online' ? 'mdi-account-check' : 'mdi-account-off' }}</v-icon>
            {{ statusFilter === 'online' ? 'Online' : 'Offline' }}
          </v-chip>
        </div>
      </div>
    </div>
  </v-card>

  <!-- Enhanced Table Card -->
  <v-card elevation="4" rounded="lg" class="table-card">
    <v-data-table
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
            <v-icon small class="mr-1">mdi-account</v-icon>
            ຊື່ຜູ້ໃຊ້
          </th>
          <th class="text-center font-weight-bold" style="width: 120px;">
            <v-icon small class="mr-1">mdi-bank</v-icon>
            ລະຫັດທະນາຄານ
          </th>
          <th class="text-center font-weight-bold" style="width: 150px;">
            <v-icon small class="mr-1">mdi-login</v-icon>
            ເວລາເຂົ້າໃຊ້ງານ
          </th>
          <th class="text-center font-weight-bold" style="width: 150px;">
            <v-icon small class="mr-1">mdi-logout</v-icon>
            ເວລາອອກຈາກລະບົບ
          </th>
          <th class="text-center font-weight-bold" style="width: 130px;">
            <v-icon small class="mr-1">mdi-ip-network</v-icon>
            IP Address
          </th>
          <th class="text-center font-weight-bold" style="width: 180px;">
            <v-icon small class="mr-1">mdi-note-text</v-icon>
            ເຫດການ
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
            <div class="d-flex align-center justify-center">
              <v-avatar size="36" :color="item.logout_time ? 'grey' : 'primary'" class="mr-2">
                <span class="white--text font-weight-bold text-caption">
                  {{ getInitials(item.user?.username) }}
                </span>
              </v-avatar>
              <span class="font-weight-medium">
                {{ item.user?.username || '-' }}
              </span>
            </div>
          </td>

          <td class="text-center">
            <v-chip small color="info" outlined class="font-weight-medium">
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
                <span class="white--text font-weight-bold">Active Now</span>
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

// API Endpoints
const apiAccessLogs = `${config.public.strapi.url}api/access-logs/`;
const apiMemberURL = `${config.public.strapi.url}api/memberinfo/`;

// State
const logs = ref([]);
const loading = ref(false);
const search = ref("");
const bankOptions = ref([]);
const bankMap = ref({});

// Date Filters
const dateFilterType = ref("day");
const filterYear = ref("");
const filterYearMonth = ref("");
const filterDate = ref("");
const startDate = ref("");
const endDate = ref("");
const selectedYear = ref("");
const selectedMonth = ref("");

// Other Filters
const selectedBankFilter = ref("01");
const statusFilter = ref("all");

const dateTypeOptions = [
  { title: 'ປີ', value: 'year' },
  { title: 'ເດືອນ', value: 'month' },
  { title: 'ວັນທີ່', value: 'day' }
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

// Helper: Get today's date
const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return { year: String(year), yearMonth: `${year}-${month}`, fullDate: `${year}-${month}-${day}` };
};

// Initialize default date
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

// Year controls
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

// Get date filter value based on type
const getDateFilterValue = () => {
  switch (dateFilterType.value) {
    case 'year': return filterYear.value;
    case 'month': return filterYearMonth.value;
    case 'day': return filterDate.value;
    case 'range': return `${startDate.value} to ${endDate.value}`;
    default: return filterDate.value;
  }
};

// Display current filter
const getCurrentFilterDisplay = () => {
  switch (dateFilterType.value) {
    case 'year': return `ປີ: ${filterYear.value}`;
    case 'month': return `ເດືອນ: ${filterYearMonth.value}`;
    case 'day': return `ວັນທີ່: ${filterDate.value}`;
    default: return getDateFilterValue();
  }
};

// Check if any filters are active
const hasActiveFilters = computed(() => {
  return selectedBankFilter.value !== null || statusFilter.value !== 'all';
});

// Get bank display name
const getBankDisplayName = (bnkCode) => {
  const bank = bankOptions.value.find(b => b.bnk_code === bnkCode);
  return bank ? bank.displayName : bnkCode;
};

// Get bank code display (code-bnk_code)
const getBankCodeDisplay = (bnkCode) => {
  if (!bnkCode) return '-';
  const bank = bankMap.value[bnkCode];
  if (bank && bank.code) {
    return `${bank.code}-${bnkCode}`;
  }
  return bnkCode;
};

// Get initials for avatar
const getInitials = (username) => {
  if (!username) return "?";
  return username.substring(0, 2).toUpperCase();
};

// Format date
const formatDate = (datetime) => {
  if (!datetime) return "-";
  const date = new Date(datetime);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

// Format time
const formatTime = (datetime) => {
  if (!datetime) return "";
  const date = new Date(datetime);
  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

// Check if date matches filter
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
    default:
      return true;
  }
};

// Load logs from backend
const loadLogs = async () => {
  loading.value = true;
  try {
    const token = localStorage.getItem("access_token");
    const res = await axios.get(apiAccessLogs, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    logs.value = res.data;
  } catch (error) {
    console.error("Error loading access logs:", error);
  } finally {
    loading.value = false;
  }
};

// Fetch bank options
const fetchBankOptions = async () => {
  try {
    const response = await axios.get(apiMemberURL);
    const banks = response.data?.data || response.data?.results || response.data || [];
    
    // สร้าง bankMap สำหรับการแสดงผล
    bankMap.value = {};
    banks.forEach(b => {
      bankMap.value[b.bnk_code] = {
        code: b.code || '',
        name: b.nameL || b.name || ''
      };
    });
    
    // เพิ่ม "01 - ທັງໝົດ" เป็นตัวเลือกแรก
    bankOptions.value = [
      ...banks.map(b => ({
        bnk_code: b.bnk_code,
        displayName: `${b.nameL || b.name} (${b.code}-${b.bnk_code})`
      }))
    ];
  } catch (error) {
    console.error("Error fetching bank options:", error);
  }
};

// Filtered logs with all filters applied
const filteredLogs = computed(() => {
  let filtered = logs.value;

  // Date filter
  filtered = filtered.filter(log => matchesDateFilter(log.login_time));

  // Bank filter
  if (selectedBankFilter.value && selectedBankFilter.value !== '01') {
    filtered = filtered.filter(log => log.bnk_code === selectedBankFilter.value);
  }

  // Status filter
  if (statusFilter.value === 'online') {
    filtered = filtered.filter(log => !log.logout_time);
  } else if (statusFilter.value === 'offline') {
    filtered = filtered.filter(log => log.logout_time);
  }

  // Search filter
  const term = search.value.toLowerCase();
  if (term) {
    filtered = filtered.filter((log) => {
      const user = log.user || {};
      return (
        user.username?.toLowerCase().includes(term) ||
        user.nameL?.toLowerCase().includes(term) ||
        user.surnameL?.toLowerCase().includes(term) ||
        log.bnk_code?.toLowerCase().includes(term)
      );
    });
  }

  return filtered;
});

// Calculate active users
const activeUsersCount = computed(() => {
  return filteredLogs.value.filter(log => !log.logout_time).length;
});

// Apply filters (called when filter changes)
const applyFilters = () => {
  // Filters are automatically applied through computed property
};

// Clear all filters
const clearFilters = () => {
  dateFilterType.value = "day";
  initializeDefaultDate();
  selectedBankFilter.value = "01";
  statusFilter.value = "all";
  search.value = "";
};

// On date type change
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

.opacity-90 {
  opacity: 0.9;
}

.gap-3 {
  gap: 12px;
}

.filter-card {
  border-left: 4px solid #2931a5;
}

.filter-header {
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
}

.filter-label {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #2931a5;
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

.date-filter-container {
  min-height: 70px;
}

.active-filters {
  background: #f5f7fa;
  padding: 12px;
  border-radius: 8px;
}

.search-field {
  background-color: white;
  border-radius: 8px;
}

.table-card {
  overflow: visible !important;
  height: auto !important;
}

.modern-table {
  border-radius: 12px;
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

.active-user-row {
  background-color: #f0fdf4 !important;
}

.active-user-row:hover {
  background-color: #dcfce7 !important;
}

.table-row td {
  padding: 16px !important;
  border-bottom: 1px solid #e9ecef !important;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(76, 175, 80, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
  }
}

.pulse-animation {
  animation: pulse 2s infinite;
}

.pulse-chip {
  animation: pulse 2s infinite;
}

@media (max-width: 960px) {
  .header-card {
    padding: 16px !important;
  }
  
  .header-card h1 {
    font-size: 1.5rem !important;
  }
  
  .gap-3 {
    width: 100%;
    justify-content: space-between;
  }
}
</style>