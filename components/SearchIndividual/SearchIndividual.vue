<script setup lang="ts">
import { IndividualStore } from "~/stores/searchindividual";
import { useUserData } from "~/composables/useUserData";
import Swal from "sweetalert2";

const individualStore = IndividualStore();
const { user, userId, isAdmin, isLoggedIn, userid } = useUserData();

const saerchCustomerID = ref("");
const searchLcicID = ref("");
const lcicSearchInput = ref("");
const customerSearchInput = ref("");
const showDebug = ref(true);

const bankDataMessage = ref("");
const showBankMessage = ref(false);

// ສຳລັບສະແດງຊື່ລູກຄ້າຈາກ LCIC ID
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
      
      // ສະແດງຊື່ໃນສ່ວນຂອງ LCIC ດ້ວຍ
      displayedLcicName.value = `${selectedItem.ind_lao_name || ''} ${selectedItem.ind_lao_surname || ''} ${selectedItem.ind_name || ''} ${selectedItem.ind_surname || ''}`.trim();
      showLcicName.value = true;
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
  if (!searchLcicID.value && !saerchCustomerID.value) {
    Swal.fire({
      icon: "warning",
      text: "ກະລຸນາປ້ອນຂໍ້ມູນເພື່ອຄົ້ນຫາ",
      title: "ແຈ້ງເຕືອນ",
    });
    return;
  }
  goPath(`/backend/individual/detailsearch/?customer_id=${saerchCustomerID.value}&&lcic_id=${searchLcicID.value}`)
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

// ============================================
// ແກ້ໄຂບັນຫາ PASTE: ໃຊ້ watch ແທນ @input
// ============================================
// watch(lcicSearchInput, (newValue) => {
//   searchLcicID.value = newValue;
  
//   showBankMessage.value = false;
//   bankDataMessage.value = "";
//   showLcicName.value = false;
//   displayedLcicName.value = "";

//   if (newValue && newValue.length > 0) {
//     debounceSearch(async () => {
//       await performAPISearch();
      
//       // ຫຼັງຈາກຄົ້ນຫາແລ້ວ ກວດສອບແລະເຕີມ customerid ອັດຕະໂນມັດ
//       const matchedItem = dataReques.value.find(
//         (item) =>
//           (item.lcic_id?.toString() === newValue || 
//            item.lcic_id?.toString().includes(newValue)) &&
//           item.bnk_code === userId.value
//       );

//       if (matchedItem) {
//         // ສະແດງຊື່ລູກຄ້າ
//         displayedLcicName.value = `${matchedItem.ind_lao_name || ''} ${matchedItem.ind_lao_surname || ''} ${matchedItem.ind_name || ''} ${matchedItem.ind_surname || ''}`.trim();
//         showLcicName.value = true;
        
//         // ເຕີມ customerid ອັດຕະໂນມັດ
//         if (matchedItem.customerid) {
//           saerchCustomerID.value = matchedItem.customerid;
//           customerSearchInput.value = matchedItem.customerid;
//           showBankMessage.value = false;
//           bankDataMessage.value = "";
//           console.log("Auto-filled customer ID:", matchedItem.customerid);
//         }
//       } else {
//         // ຖ້າບໍ່ພົບຂໍ້ມູນທີ່ມີ bnk_code ກົງກັນ
//         const anyMatch = dataReques.value.find(
//           (item) =>
//             item.lcic_id?.toString() === newValue ||
//             item.lcic_id?.toString().includes(newValue)
//         );
        
//         if (anyMatch) {
//           // ສະແດງຊື່ລູກຄ້າຖ້າເຈົ້າຂໍ້ມູນຈາກທະນາຄານອື່ນ
//           displayedLcicName.value = `${anyMatch.ind_lao_name || ''} ${anyMatch.ind_lao_surname || ''} ${anyMatch.ind_name || ''} ${anyMatch.ind_surname || ''}`.trim();
//           showLcicName.value = true;
          
//           if (anyMatch.bnk_code !== userId.value) {
//             saerchCustomerID.value = "";
//             customerSearchInput.value = "";
//             showBankMessage.value = true;
//             bankDataMessage.value = "ຍັງບໍ່ທັນມີຂໍ້ມູນໃນທະນາຄານຂອງທ່ານ";
//           }
//         }
//       }
//     }, 500);
//   } else {
//     // ຖ້າລຶບຂໍ້ມູນໃນຊ່ອງ LCIC ກໍໃຫ້ລຶບທຸກຢ່າງ
//     saerchCustomerID.value = "";
//     customerSearchInput.value = "";
//     displayedLcicName.value = "";
//     showLcicName.value = false;
//   }
// });
watch(lcicSearchInput, (newValue) => {
  searchLcicID.value = newValue;
  
  showBankMessage.value = false;
  bankDataMessage.value = "";
  showLcicName.value = false;
  displayedLcicName.value = "";

  if (newValue && newValue.length > 0) {
    debounceSearch(async () => {
      await performAPISearch();
      
      // ✅ ແກ້ໄຂ: ໃຊ້ startsWith ແທນ ===
      const matchedItem = dataReques.value.find(
        (item) =>
          item.lcic_id?.toString().startsWith(newValue) &&
          item.bnk_code === userId.value
      );

      if (matchedItem) {
        displayedLcicName.value = `${matchedItem.ind_lao_name || ''} ${matchedItem.ind_lao_surname || ''} ${matchedItem.ind_name || ''} ${matchedItem.ind_surname || ''}`.trim();
        showLcicName.value = true;
        
        if (matchedItem.customerid) {
          saerchCustomerID.value = matchedItem.customerid;
          customerSearchInput.value = matchedItem.customerid;
          showBankMessage.value = false;
          bankDataMessage.value = "";
          console.log("Auto-filled customer ID:", matchedItem.customerid);
        }
      } else {
        const anyMatch = dataReques.value.find(
          (item) => item.lcic_id?.toString().startsWith(newValue)
        );
        
        if (anyMatch) {
          displayedLcicName.value = `${anyMatch.ind_lao_name || ''} ${anyMatch.ind_lao_surname || ''} ${anyMatch.ind_name || ''} ${anyMatch.ind_surname || ''}`.trim();
          showLcicName.value = true;
          
          if (anyMatch.bnk_code !== userId.value) {
            saerchCustomerID.value = "";
            customerSearchInput.value = "";
            showBankMessage.value = true;
            bankDataMessage.value = "ຍັງບໍ່ທັນມີຂໍ້ມູນໃນທະນາຄານຂອງທ່ານ";
          }
        }
      }
    }, 500);
  } else {
    saerchCustomerID.value = "";
    customerSearchInput.value = "";
    displayedLcicName.value = "";
    showLcicName.value = false;
  }
});
// ລຶບ watch ເດີມຂອງ searchLcicID ອອກເພາະໃຊ້ watch lcicSearchInput ແທນແລ້ວ

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

const displayCustomer = ((item:any)=>{
    if(!item || !item.ind_surname || !item.ind_lao_name || item.ind_lao_surname) return "";
    return `${item.ind_lao_name} ${item.ind_lao_surname} ${item.ind_name} ${item.ind_surname}`
})
</script>

<template>
  <div class="search-container">
    <div class="header-section">
      <div class="header-content">
        <div class="icon-wrapper">
          <v-icon size="48" color="white">mdi-account-search</v-icon>
        </div>
        <div class="title-section">
          <h1 class="page-title">ຄົ້ນຫາຂໍ້ມູນບຸກຄົນ</h1>
          <p class="page-subtitle">ຄົ້ນຫາດ້ວຍລະຫັດ LCIC ຫຼື ລະຫັດລູກຄ້າ</p>
        </div>
      </div>
    </div>

    <div class="search-form">
      <v-card class="search-card" elevation="0">
        <v-card-text class="pa-6">
          <v-container fluid>
            <v-row>
              
              <v-col cols="12" md="6">
                <div class="input-group">
                  <label class="input-label">
                    <v-icon size="18" class="mr-2">mdi-card-account-details</v-icon>
                    ລະຫັດ LCIC
                  </label>
                  <!-- ແກ້ໄຂ: ລຶບ @input ອອກ ໃຊ້ watch ແທນ -->
                  <v-text-field
                    v-model="lcicSearchInput"
                    density="comfortable"
                    clearable
                    variant="outlined"
                    :loading="individualStore.reques_query.isLoading"
                    placeholder="ປ້ອນລະຫັດ LCIC"
                    prepend-inner-icon="mdi-magnify"
                    class="search-input"
                    color="primary"
                    rounded
                  ></v-text-field>
                  
                  <!-- ສະແດງຊື່ລູກຄ້າຢູ່ດ້ານລຸ່ມ text-field -->
                  <v-slide-y-transition>
                    <div v-if="showLcicName && displayedLcicName" class="customer-name-display">
                      <v-icon size="16" color="primary" class="mr-1">mdi-account-circle</v-icon>
                      <span class="customer-name-text">{{ displayedLcicName }}</span>
                    </div>
                  </v-slide-y-transition>
                </div>
              </v-col>

              
              <v-col cols="12" md="6">
                <div class="input-group">
                  <label class="input-label">
                    <v-icon size="18" class="mr-2">mdi-account-card-details</v-icon>
                    ລະຫັດລູກຄ້າ
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
                    class="search-input"
                    color="primary"
                    rounded
                  >
                    <template v-slot:item="{ props, item }">
                      <v-list-item
                        v-bind="props"
                        class="search-item"
                        rounded
                      >
                        <template v-slot:prepend>
                          <v-avatar color="secondary" size="36" class="mr-3">
                            <v-icon color="white" size="18">mdi-account-card-details</v-icon>
                          </v-avatar>
                        </template>
                        
                        <v-list-item-subtitle class="text-caption">
                          {{ item.raw.ind_lao_name }} {{ item.raw.ind_lao_surname }} {{ item.raw.ind_name }} {{ item.raw.ind_surname }}
                        </v-list-item-subtitle>
                      </v-list-item>
                    </template>
                  </v-autocomplete>

                
                  <v-slide-y-transition>
                    <v-alert
                      v-if="showBankMessage"
                      type="info"
                      density="compact"
                      variant="tonal"
                      class="mt-3 info-alert"
                      closable
                      @click:close="showBankMessage = false"
                      rounded
                    >
                      <template v-slot:prepend>
                        <v-icon>mdi-information-outline</v-icon>
                      </template>
                      {{ bankDataMessage }}
                    </v-alert>
                  </v-slide-y-transition>
                </div>
              </v-col>

              
              <v-col cols="12">
                <div class="button-group">
                  <v-btn
                    color="primary"
                    size="large"
                    :loading="individualStore.reques_query.isLoading"
                    @click="performSearch"
                    class="search-btn"
                    
                    elevation="2"
                  >
                    <v-icon left>mdi-magnify</v-icon>
                    ຄົ້ນຫາ
                  </v-btn>
                  <v-btn
                    color="grey-lighten-1"
                    size="large"
                    @click="clearSearch"
                    class="clear-btn"
                    
                    variant="outlined"
                  >
                    <v-icon left>mdi-refresh</v-icon>
                    ລ້າງຂໍ້ມູນ
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
.search-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 80vh;
}

.header-section {
  text-align: center;
  margin-bottom: 32px;
}

.header-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.icon-wrapper {
  background: linear-gradient(135deg, #07165a 0%, #281192 100%);
  padding: 16px;
  border-radius: 50%;
  box-shadow: 0 8px 32px rgba(4, 19, 85, 0.3);
}

.title-section {
  text-align: center;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
  letter-spacing: -0.5px;
}

.page-subtitle {
  font-size: 16px;
  color: #64748b;
  margin: 0;
  font-weight: 400;
}

.search-form {
  margin-bottom: 24px;
}

.search-card {
  border-radius: 20px !important;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95) !important;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1) !important;
}

.input-group {
  margin-bottom: 8px;
}

.input-label {
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 12px;
  letter-spacing: 0.25px;
}

.search-input :deep(.v-field) {
  border-radius: 12px !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.search-input :deep(.v-field):hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.search-input :deep(.v-field--focused) {
  box-shadow: 0 4px 20px rgba(9, 28, 116, 0.25) !important;
}

.search-item {
  border-radius: 12px !important;
  margin: 4px 8px;
  transition: all 0.2s ease;
}

.search-item:hover {
  background-color: rgba(102, 126, 234, 0.08) !important;
  transform: translateX(4px);
}

.button-group {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 16px;
}

.search-btn {
  min-width: 140px;
  height: 48px;
  font-weight: 500;
  letter-spacing: 0.5px;
  background: linear-gradient(135deg, #667eea 0%, #0712a5 100%) !important;
  color: white !important;
  transition: all 0.3s ease;
}

.search-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(52, 4, 187, 0.4) !important;
}

.clear-btn {
  min-width: 140px;
  height: 48px;
  font-weight: 500;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.clear-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.info-alert {
  border-radius: 12px !important;
  border-left: 4px solid #2196f3;
}

/* ສະໄຕລ์ສຳລັບສະແດງຊື່ລູກຄ້າ */
.customer-name-display {
  display: flex;
  align-items: center;
  margin-top: 8px;
  padding: 10px 16px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%);
  border-radius: 10px;
  border-left: 3px solid #667eea;
  animation: slideIn 0.3s ease-out;
}

.customer-name-text {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  letter-spacing: 0.25px;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .search-container {
    padding: 16px;
  }
  
  .search-card {
    margin: 0 -8px;
  }
  
  .button-group {
    flex-direction: column;
    gap: 12px;
  }
  
  .search-btn, .clear-btn {
    width: 100%;
  }
  
  .page-title {
    font-size: 24px;
  }
  
  .page-subtitle {
    font-size: 14px;
  }
  
  .customer-name-display {
    padding: 8px 12px;
  }
  
  .customer-name-text {
    font-size: 13px;
  }
}


@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.search-input :deep(.v-progress-linear) {
  border-radius: 12px;
}


* {
  transition: all 0.2s ease;
}


:deep(.v-list) {
  scrollbar-width: thin;
  scrollbar-color: #e2e8f0 transparent;
}

:deep(.v-list)::-webkit-scrollbar {
  width: 6px;
}

:deep(.v-list)::-webkit-scrollbar-track {
  background: transparent;
}

:deep(.v-list)::-webkit-scrollbar-thumb {
  background-color: #e2e8f0;
  border-radius: 6px;
}

:deep(.v-list)::-webkit-scrollbar-thumb:hover {
  background-color: #cbd5e1;
}
</style>