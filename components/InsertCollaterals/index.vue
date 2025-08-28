<template>
  <div class="data-management-container">
    <!-- Header Section -->
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
              <v-icon size="24" class="mb-2">mdi-image-multiple</v-icon>
              <div class="stat-number">{{ statusStats.total }}</div>
              <div class="stat-label">ທັງໝົດ</div>
            </v-card-text>
          </v-card>
        </v-col>
        
        <v-col cols="12" sm="6" md="3">
          <v-card class="stat-card warning-card" elevation="2">
            <v-card-text class="text-center">
              <v-icon size="24" class="mb-2">mdi-clock-outline</v-icon>
              <div class="stat-number">{{ statusStats.pending }}</div>
              <div class="stat-label">ລໍຖ້າກວດສອບ</div>
            </v-card-text>
          </v-card>
        </v-col>
        
        <v-col cols="12" sm="6" md="3">
          <v-card class="stat-card success-card" elevation="2">
            <v-card-text class="text-center">
              <v-icon size="24" class="mb-2">mdi-check-circle</v-icon>
              <div class="stat-number">{{ statusStats.confirmed }}</div>
              <div class="stat-label">ກວດສອບແລ້ວ</div>
            </v-card-text>
          </v-card>
        </v-col>
        
        <v-col cols="12" sm="6" md="3">
          <v-card class="stat-card info-card" elevation="2">
            <v-card-text class="text-center">
              <v-icon size="24" class="mb-2">mdi-bank</v-icon>
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
        <v-row align="center">
          <v-col cols="12" md="6">
            <v-autocomplete
              v-model="search"
              :items="uniqueUserIds.map((user) => ({ title: user, value: user }))"
              item-title="title"
              item-value="value"
              label="ເລືອກລະຫັດທະນາຄານ"
              prepend-inner-icon="mdi-bank"
              variant="outlined"
              density="compact"
              clearable
              @update:model-value="saveFilterToStorage"
            />
          </v-col>

          <v-col cols="12" md="3">
            <v-btn
              color="secondary"
              @click="clearFilter"
              :disabled="!search"
              variant="outlined"
              block
              prepend-icon="mdi-filter-remove"
            >
              ລຶບ Filter
            </v-btn>
          </v-col>

          <v-col cols="12" md="3">
            <v-btn
              color="primary"
              @click="refreshData"
              variant="elevated"
              block
              prepend-icon="mdi-refresh"
            >
              ໂຫຼດຂໍ້ມູນໃໝ່
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Data Table -->
    <v-card class="data-table-card ma-4" elevation="3">
      <v-data-table
        :headers="headers"
        :items="filteredItems"
        :loading="loading"
        :items-per-page="15"
        class="modern-table"
        loading-text="ກຳລັງໂຫຼດຂໍ້ມູນ..."
        no-data-text="ບໍ່ມີຂໍ້ມູນ"
        :items-per-page-options="[10, 15, 25, 50]"
        show-current-page
      >
        <template v-slot:item.id="{ item }">
          <v-chip color="primary" size="small" variant="outlined">
            {{ item.id }}
          </v-chip>
        </template>

        <template v-slot:item.user="{ item }">
          <div class="bank-info">
            <div class="bank-name">
              {{ mappedItems.find(m => m.id === item.id)?.bankNameL || item.user }}
            </div>
            <!-- <v-chip size="x-small" color="secondary" variant="outlined">
              {{ item.user }}
            </v-chip> -->
          </div>
        </template>

        <template v-slot:item.filename="{ item }">
          <div class="file-info">
            <v-icon size="16" class="mr-2" color="primary">mdi-file-image</v-icon>
            <!-- <span class="file-name">{{ item.filename }}</span> -->
             <img :src="`${config.public.strapi.url}${item.pathfile}`" alt="">
          </div>
        </template>

        <template v-slot:item.pathfile="{ item }">
          <div class="path-info">
            <v-icon size="16" class="mr-2" color="info">mdi-folder</v-icon>
            <span class="path-text">{{ getShortPath(item.pathfile) }}</span>
          </div>
        </template>

        <template v-slot:item.status="{ item }">
          <div class="status-container">
            <template v-if="item.status === '1'">
              <v-chip color="warning" prepend-icon="mdi-clock-outline" variant="elevated">
                ຍັງບໍ່ທັນກວດສອບ
              </v-chip>
            </template>
            <template v-else>
              <v-chip color="success" prepend-icon="mdi-check-circle" variant="elevated">
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
              {{ $t("saveenterprice") || "ບັນທຶກຂໍ້ມູນ" }}
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
            <v-icon size="64" color="grey-lighten-1">mdi-image-off</v-icon>
            <h3 class="text-h6 mt-4 text-grey-darken-1">ບໍ່ມີຂໍ້ມູນຮູບພາບ</h3>
            <p class="text-body-2 text-grey-darken-1">ລອງປ່ຽນການກັ່ນຕອງ ຫຼື ໂຫຼດຂໍ້ມູນໃໝ່</p>
          </div>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import Swal from "sweetalert2";
import { useI18n } from "vue-i18n";
import { MemberStore } from "@/stores/memberinfo";

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

const search = ref("");
const loading = ref(false);
const collaterals = ref<CollateralItem[]>([]);
const user = ref<User | null>(null);

const FILTER_STORAGE_KEY = "collateral_filter_search";

const { t } = useI18n();
const router = useRouter();
const config = useRuntimeConfig();

// Initialize Pinia store inside component
const memberStore = MemberStore();
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

const headers = computed(() => [
  { title: "ລຳດັບ", value: "id", width: "80px", align: "center" },
  { title: "ທະນາຄານ", value: "user", width: "150px" },
  { title: "ຊື່ຮູບພາບ", value: "filename", width: "200px" },
  { title: "ທີ່ຢູ່ໄຟລ໌", value: "pathfile", width: "250px" },
  { title: "ສະຖານະ", value: "status", width: "150px", align: "center" },
  { title: "ຈັດການ", value: "actions", width: "150px", sortable: false, align: "center" },
]);

const filteredItems = computed(() => {
  let filtered = collaterals.value;
  
  if (search.value && search.value.trim() !== "") {
    const searchTerm = search.value.toLowerCase().trim();
    filtered = filtered.filter((item) =>
      item.user?.toLowerCase().includes(searchTerm)
    );
  }
  
  return filtered;
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

const saveFilterToStorage = () => {
  try {
    if (search.value) {
      localStorage.setItem(FILTER_STORAGE_KEY, search.value);
    } else {
      localStorage.removeItem(FILTER_STORAGE_KEY);
    }
  } catch (error) {
    console.error("Failed to save filter to localStorage:", error);
  }
};

const loadFilterFromStorage = () => {
  try {
    const savedFilter = localStorage.getItem(FILTER_STORAGE_KEY);
    if (savedFilter) {
      search.value = savedFilter;
    }
  } catch (error) {
    console.error("Failed to load filter from localStorage:", error);
  }
};

const clearFilter = () => {
  search.value = "";
  localStorage.removeItem(FILTER_STORAGE_KEY);
};

const getShortPath = (path: string) => {
  if (!path) return "";
  const parts = path.split("/");
  return parts.length > 3 ? `.../${parts.slice(-2).join("/")}` : path;
};

const fetchCollaterals = async (userID: string) => {
  loading.value = true;
  try {
    const response = await axios.get(
      `${config.public.strapi.url}api/api/get_collaterals/`
    );

    if (Array.isArray(response.data)) {
      if (userID === "01") {
        collaterals.value = response.data.filter(
          (collateral) => collateral.status === "1"
        );
      } else {
        collaterals.value = response.data.filter(
          (collateral) =>
            collateral.status === "1" && collateral.user === userID
        );
      }
      console.log("Filtered collaterals:", collaterals.value);
    } else {
      console.error("Invalid response data format. Expected an array.");
    }
  } catch (error: any) {
    console.error(
      "Error fetching collaterals:",
      error.response ? error.response.data : error.message
    );
    
    Swal.fire({
      icon: "error",
      title: "ຜິດພາດ",
      text: "ບໍ່ສາມາດດຶງຂໍ້ມູນໄດ້. ກະລຸນາລອງໃໝ່ອີກຄັ້ງ.",
    });
  } finally {
    loading.value = false;
  }
};

const refreshData = () => {
  const userID = user.value?.MID?.id;
  if (userID) fetchCollaterals(userID);
};

const goToTest1 = (imagePath: string, id: number, status: number) => {
  router.push({
    name: "formcollaterals",
    query: { image: imagePath, id: id, status: status },
  });
};

const confirmImage = async (id: number) => {
  try {
    const csrfResponse = await axios.get(
      `${config.public.strapi.url}api/api/get_csrf_token/`
    );
    const csrfToken = csrfResponse.data.csrfToken;

    await axios.post(
      `${config.public.strapi.url}api/api/confirm_image/${id}/`,
      {},
      {
        headers: {
          "X-CSRFToken": csrfToken,
          "Content-Type": "application/json",
        },
      }
    );

    Swal.fire({
      title: "ເຮັດສຳເລັດ!",
      text: "ການຢືນຢັນຮູບພາບສຳເລັດແລ້ວ.",
      icon: "success",
      confirmButtonText: "OK",
    }).then(() => {
      const userID = user.value?.MID?.id;
      if (userID) fetchCollaterals(userID);
    });
  } catch (error: any) {
    console.error(
      "Error confirming image:",
      error.response ? error.response.data : error.message
    );
  }
};

onMounted(async () => {
  try {
    loadFilterFromStorage();
    
    // Load member info first
    await memberStore.getMemberInfo();
    
    // Then load user data and fetch collaterals
    const userData = localStorage.getItem("user_data");
    if (userData) {
      try {
        user.value = JSON.parse(userData);
        console.log("User data:", user.value);
        const userID = user.value?.MID?.id;
        if (userID) await fetchCollaterals(userID);
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
  /* background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); */
  min-height: 100vh;
  padding: 20px 0;
}

.header-section {
  padding: 24px;
  margin: 0 16px 20px 16px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.page-title {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
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
  border-radius: 12px;
  cursor: pointer;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(204, 200, 200, 0.15);
}

.stat-number {
  font-size: 2rem;
  font-weight: bold;
  line-height: 1;
}

.stat-label {
  font-size: 0.875rem;
  opacity: 0.8;
  margin-top: 4px;
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

.error-card {
  background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
  color: white;
}

.info-card {
  background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
  color: white;
}

.unload-card {
  background: linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%);
  color: white;
}

/* .filter-card {
  border-radius: 12px;
  background: white;
} */

.filter-title {
  background: linear-gradient(135deg, #1976d2, #42a5f5);
  color: white;
  border-radius: 12px 12px 0 0;
}

.data-table-card {
  border-radius: 12px;

  overflow: hidden;
}

.modern-table {
  background: transparent;
}

.modern-table :deep(.v-data-table__wrapper) {
  border-radius: 0;
}

.modern-table :deep(th) {
  font-weight: 600;
  color: #495057;
  border: none;
}

.modern-table :deep(td) {
  border: none;
  padding: 16px 12px;
}

.modern-table :deep(tr:hover) {
  background: rgba(219, 226, 238, 0.884);
}

.file-info {
  display: flex;
  align-items: center;
}

.file-link {
  text-decoration: none;
  color: #1976d2;
  font-weight: 500;
  transition: color 0.2s;
}

.file-link:hover {
  color: #1565c0;
  text-decoration: underline;
}

.bank-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.bank-name {
  font-weight: 500;
  color: #2c3e50;
}

.bank-code {
  font-size: 0.75rem;
}

.percentage-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.percentage-text {
  font-size: 0.75rem;
  font-weight: bold;
}

.date-info {
  text-align: center;
}

.date {
  font-weight: 500;
  color: #2c3e50;
}

.time {
  font-size: 0.75rem;
  color: #6c757d;
  margin-top: 2px;
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
  padding: 48px 24px;
}

.upload-dialog {
  border-radius: 12px;
}

.upload-dialog-title {
  background: linear-gradient(135deg, #1976d2, #42a5f5);
  color: white;
}

/* Responsive Design */
@media (max-width: 768px) {
  .data-management-container {
    padding: 10px 0;
  }

  .header-section {
    margin: 0 8px 10px 8px;
    padding: 16px;
  }

  .page-title h1 {
    font-size: 1.5rem;
  }

  .stat-card {
    margin-bottom: 8px;
  }

  .action-buttons {
    flex-direction: column;
    gap: 4px;
  }

  .modern-table :deep(td) {
    padding: 8px 4px;
    font-size: 0.875rem;
  }
}

/* Dark mode support */
/* @media (prefers-color-scheme: dark) {
  .data-management-container {
    background: linear-gradient(135deg, #9c9898 0%, #2d3748 100%);
  }
  
  .header-section,
  .filter-card,
  .data-table-card {
    background: #bbc2cf;
    color: white;
  }
  
  .modern-table :deep(th) {
    background: linear-gradient(135deg, #4a5568, #2d3748);
    color: white;
  }
  
  .modern-table :deep(tr:hover) {
    background: rgba(98, 102, 104, 0.925);
  }
} */

/* Animation classes */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
