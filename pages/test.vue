<template>
  <div class="data-management-container">
    <!-- Header Section with Statistics -->
    <div class="header-section">
      <div class="page-title">
        <v-icon size="32" color="primary" class="mr-3">mdi-image-multiple</v-icon>
        <h1 class="text-h4 font-weight-bold">ລະບົບຈັດການຮູບພາບຫຼັກຊັບ</h1>
      </div>
      
      <!-- Statistics Cards -->
      <v-row class="stats-row mt-6">
        <v-col cols="12" sm="6" md="3">
          <v-card class="stat-card total-card" elevation="2">
            <v-card-text class="text-center">
              <v-icon size="40" class="mb-2">mdi-image-multiple</v-icon>
              <div class="stat-number">{{ statusStats.total }}</div>
              <div class="stat-label">ຈຳນວນທັງໝົດ</div>
            </v-card-text>
          </v-card>
        </v-col>
        
        <v-col cols="12" sm="6" md="3">
          <v-card class="stat-card success-card" elevation="2">
            <v-card-text class="text-center">
              <v-icon size="40" class="mb-2">mdi-check-circle</v-icon>
              <div class="stat-number">{{ statusStats.confirmed }}</div>
              <div class="stat-label">ກວດສອບແລ້ວ</div>
            </v-card-text>
          </v-card>
        </v-col>
        
        <v-col cols="12" sm="6" md="3">
          <v-card class="stat-card warning-card" elevation="2">
            <v-card-text class="text-center">
              <v-icon size="40" class="mb-2">mdi-clock-outline</v-icon>
              <div class="stat-number">{{ statusStats.pending }}</div>
              <div class="stat-label">ລໍຖ້າກວດສອບ</div>
            </v-card-text>
          </v-card>
        </v-col>
        
        <v-col cols="12" sm="6" md="3">
          <v-card class="stat-card info-card" elevation="2">
            <v-card-text class="text-center">
              <v-icon size="40" class="mb-2">mdi-bank</v-icon>
              <div class="stat-number">{{ uniqueUserIds.length }}</div>
              <div class="stat-label">ທະນາຄານ</div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Filter Section -->
    <v-card class="filter-card ma-4" elevation="3" v-if="user && user.MID.id === '01'">
      <v-card-title class="filter-title">
        <v-icon class="mr-2">mdi-filter</v-icon>
        ການກັ່ນຕອງຂໍ້ມູນ
      </v-card-title>
      
      <v-card-text>
        <!-- ແຖວທີ 1: ທະນາຄານ ແລະ ປະເພດການຄົ້ນຫາ -->
        <v-row align="center">
          <v-col cols="12" md="4">
            <v-autocomplete
              v-model="userIDfilter"
              :items="memberData"
              :item-title="displayMemberInfo"
              item-value="bnk_code"
              label="ເລືອກລະຫັດທະນາຄານ"
              prepend-inner-icon="mdi-bank-circle-outline"
              variant="outlined"
              density="compact"
              clearable
            >
              <template v-slot:item="{ item, props }">
                <v-list-item
                  v-bind="props"
                  :title="`${item.raw.bnk_code}-${item.raw.code}-${item.raw.nameL}`"
                >
                  <template v-slot:prepend>
                    <v-avatar size="small" color="primary">
                      <v-icon>mdi-bank-circle-outline</v-icon>
                    </v-avatar>
                  </template>
                </v-list-item>
              </template>
            </v-autocomplete>
          </v-col>

          <v-col cols="12" md="2">
            <v-autocomplete
              :items="typeFilter"
              v-model="selectTypeFilter"
              prepend-inner-icon="mdi-call-merge"
              label="ປະເພດການຄົ້ນຫາ"
              density="compact"
              variant="outlined"
              item-title="title"
              item-value="value"
            >
              <template v-slot:item="{ item, props }">
                <v-list-item v-bind="props">
                  <template v-slot:prepend>
                    <v-avatar size="small" color="primary">
                      <v-icon>mdi-call-merge</v-icon>
                    </v-avatar>
                  </template>
                </v-list-item>
              </template>
            </v-autocomplete>
          </v-col>

          <v-col cols="12" md="3">
            <v-btn
              color="success"
              @click="refreshData"
              variant="outlined"
              block
              prepend-icon="mdi-refresh"
            >
              ໂຫຼດຂໍ້ມູນໃໝ່
            </v-btn>
          </v-col>

          <v-col cols="12" md="3">
            <v-btn
              color="secondary"
              @click="clearFilter"
              variant="elevated"
              block
              prepend-icon="mdi-filter-remove"
            >
              ລຶບ Filter
            </v-btn>
          </v-col>
        </v-row>

        <!-- ແຖວທີ 2: Filter ຕາມເວລາ (datetime) -->
        <v-row v-if="selectTypeFilter === 'datetime'" class="mt-2">
          <v-col cols="12" md="4">
            <v-autocomplete
              v-model="selectYear"
              :items="DataYears"
              item-title="DataYears"
              item-value="DataYears"
              variant="outlined"
              density="compact"
              label="ເລືອກຕາມປີ"
              prepend-inner-icon="mdi-calendar"
              clearable
            ></v-autocomplete>
          </v-col>

          <v-col cols="12" md="4">
            <v-autocomplete
              v-model="selectMonth"
              :items="MonthDate"
              item-title="MonthDate"
              item-value="MonthDate"
              variant="outlined"
              density="compact"
              label="ເລືອກຕາມເດືອນ"
              prepend-inner-icon="mdi-calendar-month"
              clearable
            ></v-autocomplete>
          </v-col>

          <v-col cols="12" md="4">
            <v-autocomplete
              v-model="selectDay"
              :items="DayData"
              item-title="DayData"
              item-value="DayData"
              variant="outlined"
              density="compact"
              label="ເລືອກຕາມວັນ"
              prepend-inner-icon="mdi-calendar-today"
              clearable
            ></v-autocomplete>
          </v-col>
        </v-row>

        <!-- ແຖວທີ 3: Filter ຕາມຊ່ວງເວລາ (date range) -->
        <v-row v-if="selectTypeFilter === 'date'" class="mt-2" align="center">
          <v-col cols="12" md="5">
            <v-text-field
              clearable
              v-model="selectStartDate"
              label="ມື້ເລີ່ມຕົ້ນ"
              type="date"
              variant="outlined"
              density="compact"
              prepend-inner-icon="mdi-calendar-start"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="2" class="text-center">
            <v-icon size="32" color="primary">mdi-arrow-right-bold</v-icon>
          </v-col>

          <v-col cols="12" md="5">
            <v-text-field
              clearable
              v-model="selectEndDate"
              label="ມື້ສຶ້ນສຸດ"
              type="date"
              variant="outlined"
              density="compact"
              prepend-inner-icon="mdi-calendar-end"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Data Table -->
    <v-card class="data-table-card ma-4" elevation="3">
      <v-data-table
        :headers="headers"
        :items="filteredItems"
        :loading="collateral.isLoading"
        :items-per-page="15"
        class="modern-table"
        loading-text="ກຳລັງໂຫຼດຂໍ້ມູນ..."
        no-data-text="ບໍ່ມີຂໍ້ມູນ"
        :items-per-page-options="[10, 15, 25, 50]"
        show-current-page
      >
        <template v-slot:top>
          <v-toolbar flat class="table-toolbar">
            <v-toolbar-title class="text-h6 font-weight-bold">
              <v-icon class="mr-2">mdi-table</v-icon>
              ລາຍການຮູບພາບຫຼັກຊັບ
            </v-toolbar-title>
          </v-toolbar>
        </template>

        <template v-slot:item.id="{ item }">
          <v-chip color="primary" size="small" variant="flat">
            #{{ item.id }}
          </v-chip>
        </template>

        <template v-slot:item.user="{ item }">
          <div class="bank-info">
            <v-chip color="secondary" size="small" variant="outlined">
              <v-icon size="16" class="mr-1">mdi-bank</v-icon>
              {{ mappedItems.find(m => m.id === item.id)?.bankNameL || item.user }}
            </v-chip>
          </div>
        </template>

        <template v-slot:item.filename="{ item }">
          <div class="file-info-container">
            <div class="file-preview">
              <v-avatar size="50" rounded>
                <v-img :src="`${config.public.strapi.url}${item.pathfile}`" cover>
                  <template v-slot:placeholder>
                    <v-progress-circular indeterminate></v-progress-circular>
                  </template>
                </v-img>
              </v-avatar>
            </div>
            <div class="file-details ml-3">
              <div class="file-name text-subtitle-2">
                <v-icon size="16" color="primary" class="mr-1">mdi-file-image</v-icon>
                {{ item.filename.slice(0, 25) }}{{ item.filename.length > 25 ? '...' : '' }}
              </div>
              <div class="file-path text-caption text-grey">
                {{ getShortPath(item.pathfile) }}
              </div>
            </div>
          </div>
        </template>

        <template v-slot:item.status="{ item }">
          <div class="status-container">
            <template v-if="item.status === '1'">
              <v-chip color="warning" prepend-icon="mdi-clock-outline" variant="elevated" size="small">
                ຍັງບໍ່ທັນກວດສອບ
              </v-chip>
            </template>
            <template v-else>
              <v-chip color="success" prepend-icon="mdi-check-circle" variant="elevated" size="small">
                ກວດສອບແລ້ວ
              </v-chip>
            </template>
          </div>
        </template>

        <template v-slot:item.actions="{ item }">
          <div class="action-buttons">
            <v-btn 
              @click="goToTest1(item.pathfile, item.id, item.status)" 
              color="primary" 
              size="small" 
              prepend-icon="mdi-pencil"
              variant="elevated"
            >
              ບັນທຶກຂໍ້ມູນ
            </v-btn>
          </div>
        </template>

        <template v-slot:loading>
          <v-skeleton-loader
            v-for="n in 10"
            :key="n"
            type="table-row-divider"
            class="mx-auto"
          ></v-skeleton-loader>
        </template>

        <template v-slot:no-data>
          <div class="no-data-container">
            <v-icon size="80" color="grey-lighten-1">mdi-image-off-outline</v-icon>
            <h3 class="text-h6 mt-4 text-grey-darken-1">ບໍ່ມີຂໍ້ມູນຮູບພາບ</h3>
            <p class="text-body-2 text-grey">ລອງປ່ຽນການກັ່ນຕອງ ຫຼື ໂຫຼດຂໍ້ມູນໃໝ່</p>
            <v-btn color="primary" class="mt-4" @click="refreshData" prepend-icon="mdi-refresh">
              ໂຫຼດຂໍ້ມູນໃໝ່
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Summary Footer -->
    <v-row class="mt-4 mx-4" v-if="filteredItems.length > 0">
      <v-col cols="12">
        <v-card variant="outlined" class="summary-footer">
          <v-card-text class="d-flex justify-space-between align-center">
            <div class="d-flex align-center gap-4">
              <v-icon color="info">mdi-information</v-icon>
              <span class="text-body-2 font-weight-medium">
                ສະແດງຜົນ <span class="text-primary font-weight-bold">{{ filteredItems.length }}</span> 
                ຈາກທັງໝົດ <span class="text-primary font-weight-bold">{{ statusStats.total }}</span> ລາຍການ
              </span>
            </div>
            <v-chip color="success" variant="flat">
              <v-icon size="16" class="mr-1">mdi-check</v-icon>
              ອັບເດດລ່າສຸດ
            </v-chip>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import { useI18n } from "vue-i18n";
import { CollateralStore } from "@/stores/collaterals";
import { MemberStore } from "@/stores/memberinfo";
import dayjs from "dayjs";

interface User {
  MID: {
    id: string;
  };
}

interface CollateralItem {
  id: number;
  user: string;
  filename: string;
  pathfile: string;
  status: string;
  insertdate?: string;
}

definePageMeta({
  layout: "backend",
});

useHead({
  title: "ລະບົບຈັດການຮູບພາບຫຼັກຊັບ - Collateral Management",
  meta: [
    { name: "keywords", content: "Collateral, Images, Report, Nuxt 3, Backend" },
    { name: "Description", content: "ລະບົບຈັດການຮູບພາບຫຼັກຊັບ - IT Genius Engineering" },
  ],
});

const user = ref<User | null>(null);

// Filter refs
const userIDfilter = ref("");
const selectTypeFilter = ref("datetime");
const selectYear = ref("");
const selectMonth = ref("");
const selectDay = ref("");
const selectStartDate = ref("");
const selectEndDate = ref("");

const { t } = useI18n();
const router = useRouter();
const config = useRuntimeConfig();

// Initialize Pinia stores
const collateral = CollateralStore();
const memberStore = MemberStore();

// Type filter options
const typeFilter = [
  { title: "ເລືອກຕາມ ປີ, ເດືອນ, ວັນ", value: "datetime" },
  { title: "ເລືອກຕາມຊວງເວລາ", value: "date" },
];

const memberName = computed(() => {
  const data = memberStore.respons_data_query;
  if (Array.isArray(data)) {
    return data;
  }
  if (data && typeof data === "object") {
    return [data];
  }
  return [];
});

// Member data for filter
const memberData = computed(() => {
  const data = memberStore.respons_data_query;
  if (Array.isArray(data)) {
    return data;
  }
  if (data && typeof data === "object") {
    return [data];
  }
  return [];
});

// ດຶງຂໍ້ມູນຈາກ CollateralStore
const collaterals = computed(() => {
  const data = collateral.response_data_collateral_list;
  if (Array.isArray(data)) {
    return data;
  }
  if (data && typeof data === "object") {
    return [data];
  }
  return [];
});

// ຂໍ້ມູນທັງໝົດສຳລັບດຶງປີ/ເດືອນ/ວັນ
const collateralsAll = computed(() => {
  const data = collateral.response_data_collateral_list_all;
  if (Array.isArray(data)) {
    return data;
  }
  if (data && typeof data === "object") {
    return [data];
  }
  return [];
});

// ດຶງປີທີ່ມີ
const DataYears = computed(() => {
  const yearSet = new Set();
  collateralsAll.value.forEach((item) => {
    if (item.insertdate) {
      yearSet.add(dayjs(item.insertdate).format("YYYY"));
    }
  });
  return Array.from(yearSet);
});

// ດຶງເດືອນທີ່ມີ
const MonthDate = computed(() => {
  const monthSet = new Set();
  collateralsAll.value.forEach((item) => {
    if (item.insertdate) {
      monthSet.add(dayjs(item.insertdate).format("MM"));
    }
  });
  return Array.from(monthSet);
});

// ດຶງວັນທີ່ມີ
const DayData = computed(() => {
  const daySet = new Set();
  collateralsAll.value.forEach((item) => {
    if (item.insertdate) {
      daySet.add(dayjs(item.insertdate).format("DD"));
    }
  });
  return Array.from(daySet);
});

const headers = computed(() => [
  { title: "ລຳດັບ", value: "id", width: "100px", align: "center" },
  { title: "ທະນາຄານ", value: "user", width: "200px" },
  { title: "ຂໍ້ມູນໄຟລ໌", value: "filename", width: "350px" },
  { title: "ສະຖານະ", value: "status", width: "180px", align: "center" },
  { title: "ຈັດການ", value: "actions", width: "150px", sortable: false, align: "center" },
]);

const filteredItems = computed(() => {
  return collaterals.value;
});

const uniqueUserIds = computed(() => {
  return [...new Set(collaterals.value.map((item) => item.user))];
});

const statusStats = computed(() => {
  const stats = {
    total: collaterals.value.length,
    pending: collaterals.value.filter(item => item.status === '1').length,
    confirmed: collaterals.value.filter(item => item.status === '0').length,
  };
  return stats;
});

const mappedItems = computed(() => {
  return collaterals.value.map((item) => {
    const memberInfo = memberName.value.find(
      (member) => member.bnk_code === item.user
    );

    return {
      ...item,
      memberInfo: memberInfo || null,
      bankNameL: memberInfo?.nameL || item.user,
      bankNameE: memberInfo?.nameE || "Unknown Bank",
      bankCode: memberInfo?.code || item.user,
    };
  });
});

// Display member info function
const displayMemberInfo = (item: any) => {
  if (!item || !item.bnk_code || !item.code || !item.nameL) return "ທັງໝົດ";
  return `${item.bnk_code}-${item.code}-${item.nameL}`;
};

const clearFilter = () => {
  userIDfilter.value = "";
  selectYear.value = "";
  selectMonth.value = "";
  selectDay.value = "";
  selectStartDate.value = "";
  selectEndDate.value = "";
  
  // Reset filter in store
  collateral.filter_data.query.user_id = "";
  collateral.filter_data.query.year = "";
  collateral.filter_data.query.month = "";
  collateral.filter_data.query.day = "";
  collateral.filter_data.query.start_date = "";
  collateral.filter_data.query.end_date = "";
  
  refreshData();
};

const getShortPath = (path: string) => {
  if (!path) return "";
  const parts = path.split("/");
  return parts.length > 3 ? `.../${parts.slice(-2).join("/")}` : path;
};

const refreshData = async () => {
  const userID = user.value?.MID?.id;
  if (userID) {
    collateral.isLoading = true;
    try {
      collateral.filter_data.query.current_user_id = userID;
      await collateral.GetdsatCollateral();
      
      Swal.fire({
        icon: "success",
        title: "ສຳເລັດ",
        text: "ໂຫຼດຂໍ້ມູນໃໝ່ສຳເລັດແລ້ວ",
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "ຜິດພາດ",
        text: "ບໍ່ສາມາດໂຫຼດຂໍ້ມູນໃໝ່ໄດ້",
      });
    } finally {
      collateral.isLoading = false;
    }
  }
};

const goToTest1 = (imagePath: string, id: number, status: number) => {
  router.push({
    name: "formcollaterals",
    query: { image: imagePath, id: id, status: status },
  });
};

// Watch user_ID ເພື່ອດຶງຂໍ້ມູນອັດຕະໂນມັດ
const user_ID = computed(() => user.value?.MID?.id);

watch(
  user_ID,
  async (newValue) => {
    if (!newValue) return;

    collateral.isLoading = true;
    try {
      collateral.filter_data.query.current_user_id = newValue;
      await collateral.GetdsatCollateral();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "ຜິດພາດ",
        text: `ບໍ່ສາມາດໃຊ້ filter ຕາມ user_id ເນື່ອງຈາກ ${error}`,
      });
    } finally {
      collateral.isLoading = false;
    }
  },
  { immediate: true }
);

// Watch filters
watch(userIDfilter, async (newValue) => {
  collateral.isLoading = true;
  try {
    collateral.filter_data.query.user_id = newValue;
    await collateral.GetdsatCollateral();
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "ຜິດພາດ",
      text: `ບໍ່ສາມາດໃຊ້ filter ຕາມທະນາຄານເນື່ອງຈາກ ${error}`,
    });
  } finally {
    collateral.isLoading = false;
  }
});

watch(selectYear, async (newValue) => {
  collateral.isLoading = true;
  try {
    collateral.filter_data.query.year = newValue;
    await collateral.GetdsatCollateral();
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "ຜິດພາດ",
      text: `ບໍ່ສາມາດໃຊ້ filter ຕາມປີເນື່ອງຈາກ ${error}`,
    });
  } finally {
    collateral.isLoading = false;
  }
});

watch(selectMonth, async (newValue) => {
  collateral.isLoading = true;
  try {
    collateral.filter_data.query.month = newValue;
    await collateral.GetdsatCollateral();
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "ຜິດພາດ",
      text: `ບໍ່ສາມາດໃຊ້ filter ຕາມເດືອນເນື່ອງຈາກ ${error}`,
    });
  } finally {
    collateral.isLoading = false;
  }
});

watch(selectDay, async (newValue) => {
  collateral.isLoading = true;
  try {
    collateral.filter_data.query.day = newValue;
    await collateral.GetdsatCollateral();
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "ຜິດພາດ",
      text: `ບໍ່ສາມາດໃຊ້ filter ຕາມວັນເນື່ອງຈາກ ${error}`,
    });
  } finally {
    collateral.isLoading = false;
  }
});

watch(selectStartDate, async (newValue) => {
  collateral.isLoading = true;
  try {
    collateral.filter_data.query.start_date = newValue;
    await collateral.GetdsatCollateral();
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "ຜິດພາດ",
      text: `ບໍ່ສາມາດໃຊ້ filter ຕາມວັນເລີ່ມເນື່ອງຈາກ ${error}`,
    });
  } finally {
    collateral.isLoading = false;
  }
});

watch(selectEndDate, async (newValue) => {
  collateral.isLoading = true;
  try {
    collateral.filter_data.query.end_date = newValue;
    await collateral.GetdsatCollateral();
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "ຜິດພາດ",
      text: `ບໍ່ສາມາດໃຊ້ filter ຕາມວັນສຶ້ນສຸດເນື່ອງຈາກ ${error}`,
    });
  } finally {
    collateral.isLoading = false;
  }
});

onMounted(async () => {
  try {
    // Load member info first
    await memberStore.getMemberInfo();
    
    // Load all collaterals for year/month/day data
    await collateral.GetdsatCollateralall();
    
    // Load user data
    const userData = localStorage.getItem("user_data");
    if (userData) {
      try {
        user.value = JSON.parse(userData);
        console.log("User data:", user.value);
      } catch (error) {
        console.error("Error parsing user_data:", error);
      }
    } else {
      console.error("No user data found.");
    }
  } catch (error) {
    console.error("Error in onMounted:", error);
  }
});
</script>

<style scoped>
.data-management-container {
  min-height: 100vh;
  padding: 20px 0;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.header-section {
  padding: 24px;
  margin: 0 16px 20px 16px;
  border-radius: 16px;
  background: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.page-title {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.page-title h1 {
  background: linear-gradient(45deg, #1976d2, #42a5f5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stats-row {
  margin-top: 24px;
}

.stat-card {
  transition: all 0.3s ease;
  border-radius: 16px;
  cursor: pointer;
  height: 100%;
}

.stat-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
}

.stat-card .v-card-text {
  padding: 24px;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 800;
  line-height: 1;
  margin: 12px 0 8px 0;
}

.stat-label {
  font-size: 0.9rem;
  font-weight: 500;
  opacity: 0.9;
  margin-top: 8px;
}

.total-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.success-card {
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  color: white;
}

.warning-card {
  background: linear-gradient(135deg, #ff9800 0%, #f57400 100%);
  color: white;
}

.info-card {
  background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
  color: white;
}

.filter-card {
  border-radius: 16px;
  background: white;
  overflow: hidden;
}

.filter-title {
  background: linear-gradient(135deg, #1976d2, #42a5f5);
  color: white;
  padding: 16px 24px;
  font-size: 1.1rem;
  font-weight: 600;
}

.data-table-card {
  border-radius: 16px;
  background: white;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.table-toolbar {
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  border-bottom: 2px solid #dee2e6;
}

.modern-table {
  background: transparent;
}

.modern-table :deep(.v-data-table__wrapper) {
  border-radius: 0;
}

.modern-table :deep(thead) {
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
}

.modern-table :deep(th) {
  font-weight: 700;
  color: #1976d2;
  border: none;
  padding: 16px 12px;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
}

.modern-table :deep(td) {
  border: none;
  padding: 16px 12px;
}

.modern-table :deep(tbody tr) {
  transition: all 0.2s ease;
}

.modern-table :deep(tbody tr:hover) {
  background: linear-gradient(135deg, rgba(25, 118, 210, 0.05), rgba(66, 165, 245, 0.05));
  transform: scale(1.01);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.file-info-container {
  display: flex;
  align-items: center;
}

.file-preview {
  flex-shrink: 0;
}

.file-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.file-name {
  font-weight: 600;
  color: #2c3e50;
  display: flex;
  align-items: center;
}

.file-path {
  color: #6c757d;
  font-size: 0.75rem;
}

.bank-info {
  display: flex;
  align-items: center;
}

.status-container {
  display: flex;
  justify-content: center;
}

.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
}

.no-data-container {
  text-align: center;
  padding: 64px 24px;
}

.summary-footer {
  border-radius: 12px;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
}

.gap-4 {
  gap: 16px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .data-management-container {
    padding: 10px 0;
  }

  .header-section {
    margin: 0 8px 10px 8px;
    padding: 16px;
    border-radius: 12px;
  }

  .page-title h1 {
    font-size: 1.5rem;
  }

  .stat-card {
    margin-bottom: 12px;
  }

  .stat-card .v-card-text {
    padding: 16px;
  }

  .stat-number {
    font-size: 2rem;
  }

  .stat-label {
    font-size: 0.8rem;
  }

  .action-buttons {
    flex-direction: column;
    gap: 4px;
  }

  .modern-table :deep(td) {
    padding: 12px 8px;
    font-size: 0.875rem;
  }

  .file-info-container {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}

/* Animation classes */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active {
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Loading skeleton */
.v-skeleton-loader {
  background: transparent;
}

/* Scrollbar styling */
:deep(.v-data-table__wrapper) {
  scrollbar-width: thin;
  scrollbar-color: #1976d2 #f1f1f1;
}

:deep(.v-data-table__wrapper::-webkit-scrollbar) {
  height: 8px;
  width: 8px;
}

:deep(.v-data-table__wrapper::-webkit-scrollbar-track) {
  background: #f1f1f1;
  border-radius: 4px;
}

:deep(.v-data-table__wrapper::-webkit-scrollbar-thumb) {
  background: #1976d2;
  border-radius: 4px;
}

:deep(.v-data-table__wrapper::-webkit-scrollbar-thumb:hover) {
  background: #1565c0;
}

/* Chip styling */
.v-chip {
  font-weight: 600;
  letter-spacing: 0.3px;
}

/* Button styling */
.v-btn {
  text-transform: none;
  font-weight: 600;
  letter-spacing: 0.3px;
}

/* Card elevation on hover */
.filter-card:hover,
.data-table-card:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  transition: box-shadow 0.3s ease;
}
</style>