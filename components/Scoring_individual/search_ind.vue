<script setup lang="ts">
import { IndividualStore } from "~/stores/scoring_ind";
import { useUserData } from "~/composables/useUserData";
import Swal from "sweetalert2";
import { MemberStore } from "@/stores/memberinfo";
import { useMemberInfo } from "@/composables/memberInfo";

const { mapMemberInfo, getMemberName, getMemberDetails, getMemberCode } =
  useMemberInfo();
const individualStore = IndividualStore();
const { user, userId, isAdmin, isLoggedIn, userid } = useUserData();
const hasSearched = ref(false);
const isSearching = ref(false);
const memberStore = MemberStore();
const saerchCustomerID = ref("");
const searchLcicID = ref("");
const lcicSearchInput = ref("");
const customerSearchInput = ref("");
const showDebug = ref(true);
const categories = ref<any[]>([]);

interface Category {
  cat_sys_id: string;
  cat_name: string;
}

const bankDataMessage = ref("");
const showBankMessage = ref(false);
const lcicNotFound = ref(false);

const isSearchDisabled = computed(() => {
  const noCatalog = !individualStore.from_insert_logserch.CatalogID;
  const searchedButNotFound = lcicNotFound.value && lcicSearchInput.value;
  
  return noCatalog || searchedButNotFound;
});

const TypeSearch = computed(() => {
  const data = individualStore.type_search_response;
  if (Array.isArray(data)) {
    return data;
  }
  if (data && typeof data === "object") {
    return [data];
  }
  return [];
});

const displayedLcicName = ref("");
const showLcicName = ref(false);

const debounceTimer = ref<NodeJS.Timeout | null>(null);

const debounceSearch = (callback: () => void, delay: number = 300) => {
  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value);
  }
  debounceTimer.value = setTimeout(callback, delay);
};

const onCustomerSelect = (lcicId: string) => {
  if (lcicId) {
    searchLcicID.value = lcicId;
    lcicSearchInput.value = lcicId;

    const selectedItem = filteredCustomerSuggestions.value.find(
      (item) => item.lcic_id === lcicId
    );
    if (selectedItem) {
      saerchCustomerID.value = selectedItem.customerid;
      customerSearchInput.value = selectedItem.customerid;

      displayedLcicName.value = `${selectedItem.ind_lao_name || ""} ${
        selectedItem.ind_lao_surname || ""
      } ${selectedItem.ind_name || ""} ${
        selectedItem.ind_surname || ""
      }`.trim();
      showLcicName.value = true;
      lcicNotFound.value = false;
    }

    showBankMessage.value = false;
    bankDataMessage.value = "";

    performSearchWithLcicId(lcicId);
  }
};

const performSearchWithLcicId = async (lcicId: string) => {
  individualStore.reques_query.isLoading = true;
  try {
    individualStore.reques_query.query.lcic_id = lcicId;
    individualStore.reques_query.query.customerid = "";
    await individualStore.saerchListIndividual();
  } catch (error) {
    console.error("Search with LCIC ID error:", error);
    Swal.fire({
      icon: "error",
      text: "ບໍ່ສາມາດດຶງຂໍ້ມູນໄດ້",
      title: "ຜິດພາດ",
    });
  } finally {
    individualStore.reques_query.isLoading = false;
  }
};

const onCustomerSearchChange = (value: string) => {
  customerSearchInput.value = value;
  saerchCustomerID.value = value;

  showBankMessage.value = false;
  bankDataMessage.value = "";

  if (value && value.length > 0) {
    debounceSearch(() => {
      performAPISearch();
    });
  }
};

const performAPISearch = async () => {
  individualStore.reques_query.isLoading = true;
  try {
    individualStore.reques_query.query.customerid = "";
    individualStore.reques_query.query.lcic_id = "";

    if (lcicSearchInput.value) {
      individualStore.reques_query.query.lcic_id = lcicSearchInput.value;
    }
    if (customerSearchInput.value) {
      individualStore.reques_query.query.customerid = customerSearchInput.value;
    }

    await individualStore.saerchListIndividual();
  } catch (error) {
    console.error("Search error:", error);
    Swal.fire({
      icon: "error",
      text: "ບໍ່ສາມາດດຶງຂໍ້ມູນໄດ້",
      title: "ຜິດພາດ",
    });
  } finally {
    individualStore.reques_query.isLoading = false;
  }
};

const filteredCustomerSuggestions = computed(() => {
  if (!customerSearchInput.value || customerSearchInput.value.length < 1)
    return [];

  return dataReques.value
    .filter(
      (item) =>
        item.customerid?.toString().includes(customerSearchInput.value) ||
        item.ind_lao_name
          ?.toLowerCase()
          .includes(customerSearchInput.value.toLowerCase())
    )
    .slice(0, 10)
    .map((item) => ({
      ...item,
      display_text: `${item.ind_lao_name} (${item.customerid})`,
    }));
});

const dataReques = computed(() => {
  const data = individualStore.respons_data_reques;
  if (Array.isArray(data)) {
    return data;
  }
  if (data && typeof data === "object") {
    return [data];
  }
  return [];
});

const performSearch = async () => {
  if (!searchLcicID.value && !saerchCustomerID.value && !individualStore.from_insert_logserch.CatalogID) {
    Swal.fire({
      icon: "warning",
      text: "ກະລຸນາປ້ອນຂໍ້ມູນເພື່ອຄົ້ນຫາ",
      title: "ແຈ້ງເຕືອນ",
    });
    return;
  }
  if (!individualStore.from_insert_logserch.CatalogID) {
    Swal.fire({
      icon: "warning",
      text: "ກະລຸນາເລືອກຈຸດປະສົງການກູ້ຢືມ",
      title: "ແຈ້ງເຕືອນ",
    });
    return;
  }
  
  if (lcicNotFound.value) {
    Swal.fire({
      icon: "warning",
      text: "ບໍ່ພົບລະຫັດ ຂສລ ນີ້ ກະລຸນາກວດສອບອີກຄັ້ງ",
      title: "ແຈ້ງເຕືອນ",
    });
    return;
  }
  
  goPath(
    `/scoring/detail_scoring/?customer_id=${saerchCustomerID.value}&&lcic_id=${searchLcicID.value}&&typesearch=${individualStore.from_insert_logserch.CatalogID}`
  );
  await performAPISearch();
};

const clearSearch = () => {
  saerchCustomerID.value = "";
  searchLcicID.value = "";
  lcicSearchInput.value = "";
  customerSearchInput.value = "";

  showBankMessage.value = false;
  bankDataMessage.value = "";

  showLcicName.value = false;
  displayedLcicName.value = "";
  
  hasSearched.value = false;
  isSearching.value = false;
  lcicNotFound.value = false;
  individualStore.from_insert_logserch.CatalogID = "";

  individualStore.reques_query.query.customerid = "";
  individualStore.reques_query.query.lcic_id = "";
  individualStore.saerchListIndividual();
};

const selectItem = (item: any) => {
  console.log("Selected item from result list:", item);

  Swal.fire({
    icon: "info",
    text: `ເລືອກຈາກລາຍການຜົນການຄົ້ນຫາ: ${
      item.results?.ind_lao_name || item.ind_lao_name
    }`,
    title: "ເລືອກຈາກຜົນການຄົ້ນຫາ",
    showCancelButton: true,
    confirmButtonText: "ເບິ່ງລາຍລະອຽດ",
    cancelButtonText: "ປິດ",
  }).then((result) => {
    if (result.isConfirmed) {
      console.log("View details for:", item);
    }
  });
};

watch(lcicSearchInput, (newValue) => {
  searchLcicID.value = newValue;

  showBankMessage.value = false;
  bankDataMessage.value = "";
  showLcicName.value = false;
  displayedLcicName.value = "";
  lcicNotFound.value = false;

  if (newValue && newValue.length > 0) {
    hasSearched.value = true;
    isSearching.value = true;
    
    debounceSearch(async () => {
      const originalBnkCode = individualStore.reques_query.query.bnk_code;
      
      individualStore.reques_query.query.lcic_id = newValue;
      individualStore.reques_query.query.customerid = "";
      individualStore.reques_query.query.bnk_code = "";
      
      await individualStore.saerchListIndividual();
      
      individualStore.reques_query.query.bnk_code = originalBnkCode;

      const matchedItem = dataReques.value.find(
        (item) =>
          item.lcic_id?.toString().startsWith(newValue) &&
          item.bnk_code === userId.value
      );

      if (matchedItem) {
        displayedLcicName.value = `${matchedItem.ind_lao_name || ""} ${
          matchedItem.ind_lao_surname || ""
        } ${matchedItem.ind_name || ""} ${
          matchedItem.ind_surname || ""
        }`.trim();
        showLcicName.value = true;
        lcicNotFound.value = false;

        if (matchedItem.customerid) {
          saerchCustomerID.value = matchedItem.customerid;
          customerSearchInput.value = matchedItem.customerid;
          showBankMessage.value = false;
          bankDataMessage.value = "";
        }
      } else {
        const anyMatch = dataReques.value.find((item) =>
          item.lcic_id?.toString().startsWith(newValue)
        );

        if (anyMatch) {
          displayedLcicName.value = `${anyMatch.ind_lao_name || ""} ${
            anyMatch.ind_lao_surname || ""
          } ${anyMatch.ind_name || ""} ${anyMatch.ind_surname || ""}`.trim();
          showLcicName.value = true;
          lcicNotFound.value = false;

          if (anyMatch.bnk_code !== userId.value) {
            saerchCustomerID.value = "";
            customerSearchInput.value = "";
            showBankMessage.value = true;
          }
        } else {
          lcicNotFound.value = true;
          showLcicName.value = false;
          displayedLcicName.value = "";
        }
      }
      
      isSearching.value = false;
    }, 500);
  } else {
    hasSearched.value = false;
    isSearching.value = false;
    lcicNotFound.value = false;
    
    saerchCustomerID.value = "";
    customerSearchInput.value = "";
    displayedLcicName.value = "";
    showLcicName.value = false;
  }
});

watch(saerchCustomerID, async (newValue) => {
  if (newValue && newValue !== customerSearchInput.value) {
    individualStore.reques_query.isLoading = true;
    try {
      individualStore.reques_query.query.customerid = newValue;
      individualStore.reques_query.query.lcic_id = "";
      await individualStore.saerchListIndividual();
    } catch (error) {
      console.error("Customer search error:", error);
      Swal.fire({
        icon: "error",
        text: "ບໍ່ສາມາດດຶງຂໍ້ມູນໄດ້",
        title: "ຜິດພາດ",
      });
    } finally {
      individualStore.reques_query.isLoading = false;
    }
  }
});

const displayCustomer = (item: any) => {
  if (!item || !item.ind_surname || !item.ind_lao_name || item.ind_lao_surname)
    return "";
  return `${item.ind_lao_name} ${item.ind_lao_surname} ${item.ind_name} ${item.ind_surname}`;
};

// ⭐ แก้ไข onMounted
onMounted(async () => {
  // ⭐ เพิ่มส่วนนี้ - Clear session เมื่อกลับมาหน้า Search
  const fromDetail = sessionStorage.getItem("from_detail_page");
  if (!fromDetail) {
    // ถ้าไม่ได้มาจากปุ่ม Back ปกติ ให้ clear
    sessionStorage.removeItem('lcic_id');
    sessionStorage.removeItem('scoring_data');
  }
  // ลบ flag ทิ้ง
  sessionStorage.removeItem("from_detail_page");
  
  // ... โค้ดเดิม ...
  const config = useRuntimeConfig();
  const token = localStorage.getItem("access_token");

  const response = await fetch(`${config.public.strapi.url}api/catalog-cats/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.ok) {
    const data = await response.json();
    categories.value = data.filter((item: any) => item.ct_type === "LPR");
  } else {
    console.error("Failed to fetch categories:", response.statusText);
  }
  
  memberStore.getMemberInfo();
  individualStore.getTypeSearch();
  individualStore.reques_query.query.bnk_code = userId.value;
});
</script>

<template>
  <!-- Template ไม่เปลี่ยนแปลง -->
  <div class="search-container">
    <div class="header-section">
      <div class="header-content">
        <div class="icon-wrapper">
          <div class="icon-bg-animation"></div>
          <v-icon size="48" color="white" class="header-icon">mdi-finance</v-icon>
        </div>
        <div class="title-section">
          <h1 class="page-title">ຄົ້ນຫາຄະແນນສິນເຊື່ອບຸກຄົນ</h1>
          <p class="page-subtitle">ຄົ້ນຫາດ້ວຍລະຫັດ LCIC ຫຼື ລະຫັດລູກຄ້າ</p>
        </div>
      </div>
    </div>

    <div class="search-form">
      <v-card class="search-card" elevation="0">
        <v-card-text class="pa-4">
          <v-container fluid>
            <v-row>
              <v-col cols="12" md="6">
                <div class="input-group">
                  <label class="input-label">
                    <div class="label-icon-wrapper">
                      <v-icon size="18">mdi-shield-account</v-icon>
                    </div>
                    <span>ລະຫັດ LCIC</span>
                  </label>
                  
                  <v-text-field
                    v-model="lcicSearchInput"
                    density="comfortable"
                    clearable
                    variant="outlined"
                    :loading="individualStore.reques_query.isLoading"
                    placeholder="ປ້ອນລະຫັດ LCIC"
                    prepend-inner-icon="mdi-magnify"
                    class="search-input modern-input"
                    color="primary"
                    rounded
                  ></v-text-field>
                  
                  <v-fade-transition>
                    <p
                      class="ml-2 error-message"
                      v-if="lcicNotFound && lcicSearchInput && !isSearching && !individualStore.reques_query.isLoading"
                    >
                      <v-icon size="16" color="error" class="mr-1">mdi-alert-circle</v-icon>
                      <strong>ບໍ່ພົບລະຫັດ ຂສລ ນີ້</strong>
                    </p>
                  </v-fade-transition>

                  <v-slide-y-transition>
                    <div
                      v-if="showLcicName && displayedLcicName"
                      class="customer-name-display"
                    >
                      <div class="name-badge">
                        <v-icon size="16" color="primary" class="mr-1">mdi-account-check</v-icon>
                        <span class="customer-name-text">{{ displayedLcicName }}</span>
                      </div>
                    </div>
                  </v-slide-y-transition>
                </div>
              </v-col>

              <v-col cols="12" md="6">
                <div class="input-group">
                  <label class="input-label">
                    <div class="label-icon-wrapper">
                      <v-icon size="18">mdi-badge-account</v-icon>
                    </div>
                    <span>ລະຫັດລູກຄ້າ</span>
                  </label>
                  <v-autocomplete
                    v-model="saerchCustomerID"
                    :items="filteredCustomerSuggestions"
                    :search="customerSearchInput"
                    @update:search="onCustomerSearchChange"
                    @update:model-value="onCustomerSelect"
                    item-title="customerid"
                    item-value="lcic_id"
                    density="comfortable"
                    clearable
                    variant="outlined"
                    :loading="individualStore.reques_query.isLoading"
                    hide-no-data
                    placeholder="ລະຫັດລູກຄ້າ"
                    prepend-inner-icon="mdi-magnify"
                    class="search-input modern-input"
                    color="primary"
                    rounded
                  >
                    <template v-slot:item="{ props, item }">
                      <v-list-item
                        v-bind="props"
                        :title="`ລະຫັດ ຂສລ:${item.raw.lcic_id},ສະມາຊິກ${getMemberCode(item.raw.bnk_code)} ສາຂາ ${item.raw.branchcode}`"
                        class="search-item"
                        rounded
                      >
                        <template v-slot:prepend>
                          <v-avatar color="secondary" size="36" class="mr-3 item-avatar">
                            <v-icon color="white" size="18">mdi-credit-card-check</v-icon>
                          </v-avatar>
                        </template>
                      </v-list-item>
                    </template>
                  </v-autocomplete>
                </div>
              </v-col>

              <v-col cols="12">
                <div class="input-group">
                  <label class="input-label">
                    <div class="label-icon-wrapper">
                      <v-icon size="18">mdi-chart-box</v-icon>
                    </div>
                    <span>ຈຸດປະສົງການກູ້ຢືມ</span>
                  </label>
                  <v-autocomplete
                    v-model="individualStore.from_insert_logserch.CatalogID"
                    :items="categories"
                    item-title="cat_lao_name"
                    item-value="cat_value"
                    variant="outlined"
                    label="ຈຸດປະສົງ"
                    density="comfortable"
                    class="search-input modern-input"
                    color="primary"
                    rounded
                  >
                    <template v-slot:item="{item, props}">
                      <v-list-item 
                        v-bind="props" 
                        :title="`${(item as any).raw.cat_lao_name}(${item.raw.cat_name})`"
                        class="search-item"
                      ></v-list-item>
                    </template>
                  </v-autocomplete>
                </div>
              </v-col>

              <v-col cols="12">
                <div class="button-group">
                  <v-btn
                    color="primary"
                    size="large"
                    :loading="individualStore.reques_query.isLoading"
                    @click="performSearch"
                    class="search-btn modern-btn"
                    elevation="0"
                    :disabled="!!isSearchDisabled"
                  >
                    <v-icon left class="mr-2">mdi-database-search</v-icon>
                    <span class="btn-text">ຄົ້ນຫາ</span>
                    <div class="btn-shine"></div>
                  </v-btn>
                  <v-btn
                    color="grey-lighten-1"
                    size="large"
                    @click="clearSearch"
                    class="clear-btn modern-btn"
                    variant="outlined"
                  >
                    <v-icon left class="mr-2">mdi-refresh</v-icon>
                    <span class="btn-text">ລ້າງຂໍ້ມູນ</span>
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<style scoped>
/* CSS เดิมทั้งหมด + เพิ่ม icon ใน error message */
.error-message {
  display: flex;
  align-items: center;
  color: #f50b0b;
  font-size: 14px;
  font-weight: 500;
  animation: fadeInSlide 0.3s ease-out, shake 0.3s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

@keyframes fadeInSlide {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Disabled Button State */
.search-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

.search-btn:disabled:hover {
  transform: none !important;
  box-shadow: none !important;
}
/* Container & Background */
.error-message {
  color: #f50b0b;
  font-size: 14px;
  font-weight: 500;
  animation: fadeInSlide 0.3s ease-out;
}

.register-link {
  color: #2563eb;
  cursor: pointer;
  text-decoration: underline;
  transition: all 0.2s ease;
}

.register-link:hover {
  color: #1d4ed8;
  text-decoration: none;
}
@keyframes fadeInSlide {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.search-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
  border-radius: 2%;
  background: linear-gradient(135deg, #2038a1 0%, #5772ca 100%);
  min-height: 80vh;
  position: relative;
  overflow: hidden;
}

.search-container::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%);
  animation: rotate 30s linear infinite;
}

@keyframes rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Header Section */
.header-section {
  text-align: center;
  margin-bottom: 25px;
  position: relative;
  z-index: 1;
}

.header-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.icon-wrapper {
  background: linear-gradient(135deg, #1e3a8a 0%, #1e1b4b 100%);
  padding: 15px;
  border-radius: 50%;
  box-shadow: 0 12px 40px rgba(9, 3, 92, 0.6),
              0 0 0 8px rgba(255, 255, 255, 0.1),
              0 0 0 16px rgba(255, 255, 255, 0.05),
              0 0 60px rgba(18, 36, 116, 0.4);
  position: relative;
  overflow: hidden;
}

.icon-bg-animation {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
  transform: translate(-50%, -50%);
  animation: pulse-icon 2s ease-in-out infinite;
}

@keyframes pulse-icon {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.5;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.3);
    opacity: 0;
  }
}

.header-icon {
  position: relative;
  z-index: 1;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.title-section {
  text-align: center;
}

.page-title {
  font-size: 25px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 8px;
  letter-spacing: -0.5px;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.3),
               0 2px 4px rgba(0, 0, 0, 0.2);
}

.page-subtitle {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  font-weight: 400;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

/* Search Card */
.search-form {
  margin-bottom: 24px;
  position: relative;
  z-index: 1;
}

.search-card {
  border-radius: 24px !important;
  border: 2px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(20px);
  background: rgba(255, 255, 255, 0.98) !important;
  box-shadow: 0 24px 60px rgba(9, 3, 92, 0.4),
              0 0 0 1px rgba(255, 255, 255, 0.5) inset,
              0 8px 32px rgba(18, 36, 116, 0.3) !important;
  overflow: hidden;
}

.search-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(18, 36, 116, 0.6), transparent);
  animation: scan 3s ease-in-out infinite;
}

@keyframes scan {
  0% { left: -100%; }
  100% { left: 100%; }
}

/* Input Groups */
.input-group {
  margin-bottom: 8px;
}

.input-label {
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 10px;
  letter-spacing: 0.3px;
}

.label-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 25px;
  background: linear-gradient(135deg, #122474 0%, #09035c 100%);
  border-radius: 8px;
  margin-right: 8px;
  box-shadow: 0 2px 8px rgba(18, 36, 116, 0.3),
              0 0 12px rgba(9, 3, 92, 0.2);
}

.label-icon-wrapper .v-icon {
  color: white !important;
  margin: 0 !important;
}

/* Modern Inputs */
.modern-input :deep(.v-field) {
  border-radius: 14px !important;
  border: 2px solid #e2e8f0 !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: #ffffff;
}

.modern-input :deep(.v-field):hover {
  border-color: #cbd5e1 !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-1px);
}

.modern-input :deep(.v-field--focused) {
  border-color: #122474 !important;
  box-shadow: 0 0 0 4px rgba(18, 36, 116, 0.15),
              0 4px 16px rgba(9, 3, 92, 0.25) !important;
  transform: translateY(-1px);
}

.modern-input :deep(.v-field__input) {
  font-weight: 500;
}

.modern-input :deep(.v-progress-linear) {
  border-radius: 12px;
}

.modern-input :deep(.v-field--focused .v-icon) {
  color: #122474 !important;
}

/* Search Item */
.search-item {
  border-radius: 12px !important;
  margin: 4px 8px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid transparent;
}

.search-item:hover {
  background: linear-gradient(135deg, rgba(18, 36, 116, 0.08) 0%, rgba(9, 3, 92, 0.08) 100%) !important;
  border-color: rgba(18, 36, 116, 0.2);
  transform: translateX(4px);
  box-shadow: 0 2px 8px rgba(18, 36, 116, 0.15);
}

.item-avatar {
  background: linear-gradient(135deg, #122474 0%, #09035c 100%) !important;
  box-shadow: 0 2px 8px rgba(18, 36, 116, 0.3);
}

/* Customer Name Display */
.customer-name-display {
  margin-top: 8px;
  animation: slideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.name-badge {
  display: flex;
  align-items: center;
  padding: 12px 10px;
  background: linear-gradient(135deg, rgba(18, 36, 116, 0.1) 0%, rgba(9, 3, 92, 0.1) 100%);
  border-radius: 12px;
  border-left: 4px solid #122474;
  box-shadow: 0 2px 8px rgba(18, 36, 116, 0.15);
}

.customer-name-text {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  letter-spacing: 0.3px;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Buttons */
.button-group {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 5px;
}

.modern-btn {
  min-width: 120px;
  height: 40px;
  font-weight: 600;
  letter-spacing: 0.5px;
  border-radius: 12px !important;
  text-transform: none;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.search-btn {
  background: linear-gradient(135deg, #122474 0%, #09035c 100%) !important;
  color: white !important;
  box-shadow: 0 4px 16px rgba(18, 36, 116, 0.5),
              0 0 20px rgba(9, 3, 92, 0.3) !important;
}

.search-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 28px rgba(18, 36, 116, 0.6),
              0 0 30px rgba(9, 3, 92, 0.4) !important;
}

.search-btn:active {
  transform: translateY(-1px);
}

.btn-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shine 3s ease-in-out infinite;
}

@keyframes shine {
  0% { left: -100%; }
  20%, 100% { left: 100%; }
}

.clear-btn {
  background: white !important;
  border: 2px solid #e2e8f0 !important;
  color: #64748b !important;
}

.clear-btn:hover {
  border-color: #cbd5e1 !important;
  background: #f8fafc !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.btn-text {
  position: relative;
  z-index: 1;
}

/* Scrollbar Styling */
:deep(.v-list) {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
}

:deep(.v-list)::-webkit-scrollbar {
  width: 6px;
}

:deep(.v-list)::-webkit-scrollbar-track {
  background: transparent;
}

:deep(.v-list)::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #cbd5e1, #94a3b8);
  border-radius: 6px;
}

:deep(.v-list)::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #94a3b8, #64748b);
}

/* Responsive Design */
@media (max-width: 768px) {
  .search-container {
    padding: 16px;
  }

  .search-card {
    margin: 0 -8px;
    border-radius: 20px !important;
  }

  .button-group {
    flex-direction: column;
    gap: 12px;
  }

  .modern-btn {
    width: 100%;
  }

  .page-title {
    font-size: 24px;
  }

  .page-subtitle {
    font-size: 14px;
  }

  .customer-name-display {
    padding: 0;
  }

  .name-badge {
    padding: 10px 14px;
  }

  .customer-name-text {
    font-size: 13px;
  }
}

/* Smooth Transitions */
* {
  transition: all 0.2s ease;
}
</style>
