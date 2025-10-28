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

const debounceTimer = ref<NodeJS.Timeout | null>(null);

const debounceSearch = (callback: () => void, delay: number = 300) => {
  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value);
  }
  debounceTimer.value = setTimeout(callback, delay);
};

const onLcicSelect = (value: string) => {
  if (value) {
    console.log("LCIC selected from autocomplete:", value);
    searchLcicID.value = value;
    lcicSearchInput.value = value;

    saerchCustomerID.value = "";
    customerSearchInput.value = "";

    performSearchWithLcicId(value);
  }
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
    }

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

// Search input handlers
const onLcicSearchChange = (value: string) => {
  lcicSearchInput.value = value;
  if (value && value.length > 0) {
    debounceSearch(() => {
      performAPISearch();
    });
  }
};

const onCustomerSearchChange = (value: string) => {
  customerSearchInput.value = value;
  // Keep the search term in the input field for Customer ID
  saerchCustomerID.value = value;

  if (value && value.length > 0) {
    debounceSearch(() => {
      performAPISearch();
    });
  }
};

// API search function
const performAPISearch = async () => {
  individualStore.reques_query.isLoading = true;
  try {
    // Clear previous queries
    individualStore.reques_query.query.customerid = "";
    individualStore.reques_query.query.lcic_id = "";

    // Set search parameters based on input
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

// Computed properties for filtered suggestions
const filteredLcicSuggestions = computed(() => {
  if (!lcicSearchInput.value || lcicSearchInput.value.length < 1) return [];

  return dataReques.value
    .filter(
      (item) =>
        item.lcic_id?.toString().includes(lcicSearchInput.value) ||
        item.ind_lao_name
          ?.toLowerCase()
          .includes(lcicSearchInput.value.toLowerCase())
    )
    .slice(0, 10) // Limit to 10 suggestions
    .map((item) => ({
      ...item,
      display_text: `${item.ind_lao_name} (${item.lcic_id})`,
    }));
});

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
    .slice(0, 10) // Limit to 10 suggestions
    .map((item) => ({
      ...item,
      display_text: `${item.ind_lao_name} (${item.customerid})`,
    }));
});

// Data processing
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

// Action functions
const performSearch = async () => {
  if (!searchLcicID.value && !saerchCustomerID.value) {
    Swal.fire({
      icon: "warning",
      text: "ກະລຸນາປ້ອນຂໍ້ມູນເພື່ອຄົ້ນຫາ",
      title: "ແຈ້ງເຕືອນ",
    });
    return;
  }

  await performAPISearch();
};

const clearSearch = () => {
  saerchCustomerID.value = "";
  searchLcicID.value = "";
  lcicSearchInput.value = "";
  customerSearchInput.value = "";

  // Reset to initial state
  individualStore.reques_query.query.customerid = "";
  individualStore.reques_query.query.lcic_id = "";
  individualStore.saerchListIndividual();
};

// Updated selectItem function for result list clicks (not autocomplete)
const selectItem = (item: any) => {
  console.log("Selected item from result list:", item);

  // This is for clicking on items in the search results list
  // Different behavior than autocomplete selection
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
      // Add your logic for viewing details here
      console.log("View details for:", item);
    }
  });
};

// Watchers for selected values
watch(searchLcicID, async (newValue) => {
  if (newValue && newValue !== lcicSearchInput.value) {
    individualStore.reques_query.isLoading = true;
    try {
      individualStore.reques_query.query.lcic_id = newValue;
      individualStore.reques_query.query.customerid = ""; // Clear other search
      await individualStore.saerchListIndividual();
    } catch (error) {
      console.error("LCIC search error:", error);
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

watch(saerchCustomerID, async (newValue) => {
  if (newValue && newValue !== customerSearchInput.value) {
    individualStore.reques_query.isLoading = true;
    try {
      individualStore.reques_query.query.customerid = newValue;
      individualStore.reques_query.query.lcic_id = ""; // Clear other search
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


onMounted(() => {
  individualStore.reques_query.query.bnk_code = userId.value;
  individualStore.saerchListIndividual();
});
</script>

<template>
  <div class="d-flex justify-center align-center">
    <v-sheet
      class="pa-4"
      :elevation="11"
      :height="400"
      :width="600"
      border
      rounded
    >
      <v-row>
        <v-col cols="12">
          <div class="pa-4">
            <h3>ຄົນຫາເອົາບົດລາຍງານບຸກຄົນ</h3>
          </div>
        </v-col>

        <v-col cols="12">
          <v-autocomplete
            v-model="searchLcicID"
            :items="filteredLcicSuggestions"
            :search="lcicSearchInput"
            @update:search="onLcicSearchChange"
            @update:model-value="onLcicSelect"
            item-title="lcic_id"
            item-value="lcic_id"
            density="compact"
            clearable
            label="ລະຫັດ ຂສລ"
            variant="outlined"
            :loading="individualStore.reques_query.isLoading"
            hide-no-data
            placeholder="ພິມເພື່ອຄົ້ນຫາ..."
            prepend-inner-icon="mdi-magnify"
          >
            <template v-slot:item="{ props, item }">
              <v-list-item
                v-bind="props"
                :title="item.raw.ind_lao_name"
                :subtitle="`LCIC ID: ${item.raw.lcic_id}`"
              >
                <template v-slot:prepend>
                  <v-avatar color="primary" size="small">
                    <v-icon>mdi-account</v-icon>
                  </v-avatar>
                </template>
              </v-list-item>
            </template>
          </v-autocomplete>
        </v-col>

        <v-col cols="12">
          <v-autocomplete
            v-model="saerchCustomerID"
            :items="filteredCustomerSuggestions"
            :search="customerSearchInput"
            @update:search="onCustomerSearchChange"
            @update:model-value="onCustomerSelect"
            item-title="customerid"
            item-value="lcic_id"
            density="compact"
            clearable
            label="ລະຫັດລູກຄ້າ"
            variant="outlined"
            :loading="individualStore.reques_query.isLoading"
            hide-no-data
            placeholder="ພິມເພື່ອຄົ້ນຫາ..."
            prepend-inner-icon="mdi-magnify"
          >
            <template v-slot:item="{ props, item }">
              <v-list-item
                v-bind="props"
                :title="item.raw.ind_lao_name"
                :subtitle="`Customer ID: ${item.raw.customerid}`"
              >
                <template v-slot:prepend>
                  <v-avatar color="secondary" size="small">
                    <v-icon>mdi-account-card-details</v-icon>
                  </v-avatar>
                </template>
              </v-list-item>
            </template>
          </v-autocomplete>
        </v-col>

        <v-col cols="12" class="text-center">
          <v-btn
            color="primary"
            width="40%"
            class="mr-2"
            :loading="individualStore.reques_query.isLoading"
            @click="performSearch"
          >
            <v-icon left>mdi-magnify</v-icon>
            ຄົ້ນຫາ
          </v-btn>
          <v-btn color="error" width="40%" @click="clearSearch">
            <v-icon left>mdi-close</v-icon>
            ຍົກເລີກ
          </v-btn>
        </v-col>
      </v-row>
    </v-sheet>
  </div>
</template>



<style scoped>
.v-list-item {
  transition: all 0.2s ease;
}

.v-list-item:hover {
  transform: translateX(4px);
}

.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: #e0e0e0 transparent;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: #e0e0e0;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background-color: #bdbdbd;
}
</style>
