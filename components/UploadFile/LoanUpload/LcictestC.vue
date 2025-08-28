<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";
import Cookies from "js-cookie";
import { useRuntimeConfig } from "#app";
import { ValidateResponse } from "~/types";
import dayjs from "dayjs";
import { MemberStore } from "@/stores/memberinfo";
const dateFilter = ref("");
definePageMeta({
  layout: "backend",
});
const memberSore = MemberStore();
const memberName = computed(() => {
  const data = memberSore.respons_data_query;
  if (Array.isArray(data)) {
    return data;
  }
  if (data && typeof data === "object") {
    return [data];
  }
  return [];
});
useHead({
  title: "ຂໍ້ມູນເຄຣດິດ - Credit Data",
  meta: [
    {
      name: "keywords",
      content: "Credit, Report, Nuxt 3, Backend, Data Management",
    },
    {
      name: "Description",
      content: "ລະບົບຈັດການຂໍ້ມູນເຄຣດິດ - IT Genius Engineering",
    },
  ],
});

const search = ref("");
const file = ref<File | null>(null);
const items = ref<ValidateResponse.items[]>([]);
const router = useRouter();
const config = useRuntimeConfig();
const loading = ref(false);

const FILTER_STORAGE_KEY = "credit_filter_search";
const mapitem = computed(() => {
  return items.value.map((item) => {
    const memberInfo = memberName.value.find(
      (member) => member.bnk_code === item.user_id
    );

    return {
      ...item,
      memberInfo: memberInfo || null,
      bankNameL: memberInfo?.nameL || "ບໍ່ພົບຂໍ້ມູນທະນາຄານ",
      bankNameE: memberInfo?.nameE || "Bank not found",
      bankCode: memberInfo?.code || "N/A",
    };
  });
});
const headers = ref([
  { title: "ໄອດີ", value: "CID", width: "80px", align: "center" },
  { title: "ຊື່ໄຟລ໌", value: "path", width: "200px" },
  { title: "ລະຫັດທະນາຄານ", value: "user_id", width: "150px" },
  { title: "ຂະໜາດ", value: "fileSize", width: "100px", align: "center" },
  { title: "ສະຖານະ", value: "statussubmit", width: "150px", align: "center" },
  {
    title: "ຄວາມຖືກຕ້ອງ",
    value: "percentage",
    width: "120px",
    align: "center",
  },
  // {
  //   title: "ວັນທີ່ອັບໂຫຼດ",
  //   value: "insertDate",
  //   width: "120px",
  //   align: "center",
  // },
  {
    title: "ຈັດການ",
    value: "actions",
    width: "200px",
    sortable: false,
    align: "center",
  },
]);
const mapitemWithMemberOnly = computed(() => {
  const mappedItems = items.value
    .map((item) => {
      const memberInfo = memberName.value.find(
        (member) => member.bnk_code === item.user_id
      );
      if (!memberInfo) return null;
      return {
        ...item,
        memberInfo,
        bankNameL: memberInfo.nameL,
        bankNameE: memberInfo.nameE,
        bankCode: memberInfo.code,
      };
    })
    .filter((item) => item !== null);
  const uniqueItems = mappedItems.filter(
    (item, index, self) =>
      index === self.findIndex((i) => i.user_id === item.user_id)
  );
  return uniqueItems;
});
const filteredItems = computed(() => {
  let filtered = items.value.filter(
    (item) =>
      item.statussubmit === "0" ||
      item.statussubmit === "1" ||
      item.statussubmit === "2" ||
      item.statussubmit === "3" ||
      item.statussubmit === "4" ||
      item.statussubmit === "5"
  );

  if (search.value && search.value.trim() !== "") {
    const searchTerm = search.value.toLowerCase().trim();
    filtered = filtered.filter(
      (item) => {
        const bankInfo = mapitem.value.find((mi) => mi.CID === item.CID);
        return (
          item.user_id.toLowerCase().includes(searchTerm) ||
          bankInfo?.bankNameL?.toLowerCase().includes(searchTerm) ||
          bankInfo?.bankNameE?.toLowerCase().includes(searchTerm)
        );
      }

      // item.user_id.toLowerCase().includes(searchTerm)
    );
  }
  if (dateFilter.value) {
    filtered = filtered.filter((item) => {
      const itemDate = dayjs(item.insertDate).format("YYYY-MM-DD");
      return itemDate === dateFilter.value;
    });
  }

  return filtered;
});

const uniqueUserIds = computed(() => {
  return [...new Set(filteredItems.value.map((item) => item.user_id))];
});

const statusStats = computed(() => {
  const stats = {
    total: items.value.length,
    confirmed: items.value.filter((item) => item.statussubmit === "0").length,
    pending: items.value.filter(
      (item) => item.statussubmit === "1" || item.statussubmit === "5"
    ).length,
    rejected: items.value.filter((item) => item.statussubmit === "2").length,
    processing: items.value.filter(
      (item) => item.statussubmit === "3" || item.statussubmit === "4"
    ).length,
    unloaded: items.value.filter((item) => item.statussubmit === "5").length,
  };
  return stats;
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

const isUserIdProcessing = (userId: string) => {
  return items.value.some(
    (item) =>
      (item.user_id === userId && item.statussubmit === "3") ||
      (item.user_id === userId && item.statussubmit === "4")
  );
};

const fetchData = async () => {
  loading.value = true;
  try {
    const response = await axios.get(
      `${config.public.strapi.url}api/api/upload-filesc2/`
    );

    console.log("API Response:", response.data);

    const data = Array.isArray(response.data)
      ? response.data
      : response.data.data
      ? response.data.data
      : [];

    items.value = data.map((item: any) => {
      console.log("Processing item:", item);

      const itemCID = item.CID || item.id_file || item.id || null;

      if (!itemCID) {
        console.warn("Item missing CID:", item);
      }

      return {
        ...item,
        CID: itemCID,
        status: "ສຳເລັດການນຳສົ່ງຂໍ້ມູນ",
        confirmed: item.confirmed || false,
        statussubmit: item.statussubmit || "1",
        fileSize: item.fileSize || 0,
      };
    });

    console.log("Processed items:", items.value);
    sortItemsByUploadDate();
  } catch (error) {
    console.error("Failed to fetch data:", error);
    Swal.fire({
      icon: "error",
      title: "ຜິດພາດ",
      text: "ບໍ່ສາມາດດຶງຂໍ້ມູນໄດ້. ກະລຸນາລອງໃໝ່ອີກຄັ້ງ.",
    });
  } finally {
    loading.value = false;
  }
};

const sortItemsByUploadDate = () => {
  items.value.sort(
    (a: any, b: any) =>
      new Date(b.insertDate || 0).getTime() -
      new Date(a.insertDate || 0).getTime()
  );
};

const handleConfirmAction = (item: any) => {
  if (isUserIdProcessing(item.user_id)) {
    Swal.fire({
      title: "ບໍ່ສາມາດດຳເນີນການໄດ້",
      text: "ບໍ່ສາມາດຢືນຢັນໄດ້ເນື່ອງຈາກມີລາຍການກຳລັງປະມວນຜົນຢູ່ໃນທະນາຄານດຽວກັນ",
      icon: "warning",
    });
    return;
  }

  confirmAction(item);
};

const viewDetails = async (item: any) => {
  if (!item.CID) {
    Swal.fire({
      icon: "error",
      title: "ລົ້ມເຫລວ",
      text: "ບໍມີຂໍ້ມູນທີ່ກົງກັບ CID ນີ້",
    });
    return;
  }

  try {
    const response = await axios.get(
      `${config.public.strapi.url}api/api/productinfoc3/`,
      {
        params: {
          CID: item.CID,
        },
        timeout: 10000,
      }
    );

    const data = response.data;
    router.push({
      name: "detailupload_c",
      query: { data: JSON.stringify(data) },
    });
  } catch (error) {
    console.error("Failed to fetch details:", error);
    Swal.fire({
      icon: "error",
      title: "ລົ້ມເຫລວ",
      text: "ການດຶງຂໍ້ມູນລົ້ມເຫລວ",
    });
  }
};

const confirmAction = async (item: any) => {
  const result = await Swal.fire({
    title: "ຢືນຢັນການດຳເນີນການ",
    text: "ທ່ານແນ່ໃຈຫຼືບໍ່ທີ່ຢືນຢັນການອັບໂຫຼດນີ້?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "ແນ່ໃຈ, ຢືນຢັນ!",
    cancelButtonText: "ຍົກເລີກ",
  });

  if (!result.isConfirmed) {
    return;
  }

  try {
    if (isUserIdProcessing(item.user_id)) {
      Swal.fire({
        title: "ບໍ່ສາມາດດຳເນີນການໄດ້",
        text: "ບໍ່ສາມາດຢືນຢັນໄດ້ເນື່ອງຈາກມີລາຍການກຳລັງປະມວນຜົນຢູ່ໃນທະນາຄານດຽວກັນ",
        icon: "warning",
      });
      return;
    }

    const response1 = await axios.post(
      `${config.public.strapi.url}api/api/update-statussubmitc/`,
      `CID=${item.CID}`
    );

    if (response1.data.status === "success") {
      const confirmedItem = items.value.find(
        (i) => i.fileName === item.fileName
      );
      if (confirmedItem) {
        confirmedItem.confirmed = true;
        confirmedItem.statussubmit = "0";
      }
    }

    const params = new URLSearchParams();
    const csrfToken = Cookies.get("csrftoken");
    params.append("CID", item.CID);

    const response = await axios.post(
      `${config.public.strapi.url}api/confirm_uploadc/`,
      params,
      {
        headers: {
          "X-CSRFToken": csrfToken,
        },
      }
    );

    if (response.data.status === "success") {
      const confirmedItem = items.value.find(
        (i) => i.fileName === item.fileName
      );
      if (confirmedItem) {
        confirmedItem.confirmed = true;
        confirmedItem.statussubmit = "0";
      }

      await Swal.fire("ຢືນຢັນສຳເລັດ!", "ການອັບໂຫຼດໄດ້ຖືກຢືນຢັນ.", "success");
      window.location.reload();
    } else {
      Swal.fire("ລົ້ມເຫລວ!", "ການຢືນຢັນການອັບໂຫຼດລົ້ມເຫລວ.", "error");
    }
  } catch (error: any) {
    console.error("Failed to confirm upload:", error);
    if (error.response && error.response.status === 408) {
      Swal.fire(
        "ຜິດພາດ!",
        "ບໍ່ສາມາດຢືນຢັນໄດ້ເນື່ອງຈາກ period ຂອງໄຟລ໌ນ້ອຍກວ່າ period ທີ່ມີຢູ່ແລ້ວ.",
        "error"
      );
    } else {
      Swal.fire(
        "ຜິດພາດ!",
        "ມີຄວາມຜິດພາດເກີດຂຶ້ນໃນຂະນະທີ່ຢືນຢັນການອັບໂຫຼດ.",
        "error"
      );
    }
  }
};

const uploadDataButton = async (item: any) => {
  try {
    if (isUserIdProcessing(item.user_id)) {
      Swal.fire({
        title: "ບໍ່ສາມາດດຳເນີນການໄດ້",
        text: "ບໍ່ສາມາດອັບໂຫຼດໄດ້ເນື່ອງຈາກມີລາຍການກຳລັງປະມວນຜົນຢູ່ໃນທະນາຄານດຽວກັນ",
        icon: "warning",
      });
      return;
    }

    const result = await Swal.fire({
      title: "ຢືນຢັນການອັບໂຫຼດຂໍ້ມູນ",
      text: "ທ່ານແນ່ໃຈບໍ່ທີ່ຈະອັບໂຫຼດຂໍ້ມູນນີ້ແບບອັດຕະໂນມັດ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ແນ່ໃຈ, ອັບໂຫຼດເລີຍ!",
      cancelButtonText: "ຍົກເລີກ",
    });

    if (!result.isConfirmed) {
      return;
    }

    if (isUserIdProcessing(item.user_id)) {
      Swal.fire({
        title: "ບໍ່ສາມາດດຳເນີນການໄດ້",
        text: "ບໍ່ສາມາດອັບໂຫຼດໄດ້ເນື່ອງຈາກມີລາຍການກຳລັງປະມວນຜົນຢູ່ໃນທະນາຄານດຽວກັນ",
        icon: "warning",
      });
      return;
    }

    const response1 = await axios.post(
      `${config.public.strapi.url}api/api/unload-statussubmitc/`,
      `CID=${item.CID}`
    );

    if (response1.data.status === "success") {
      const confirmedItem = items.value.find(
        (i) => i.fileName === item.fileName
      );
      if (confirmedItem) {
        confirmedItem.confirmed = true;
        confirmedItem.statussubmit = "0";
      }
    }

    const uploadingItem = items.value.find((i) => i.CID === item.CID);
    if (uploadingItem) {
      uploadingItem.statussubmit = "3";
    }

    const params = new URLSearchParams();
    const csrfToken = Cookies.get("csrftoken");
    params.append("CID", item.CID);

    const response = await axios.post(
      `${config.public.strapi.url}api/unload_uploadc/`,
      params,
      {
        headers: {
          "X-CSRFToken": csrfToken,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    console.log("Response from upload:", response.data);

    if (response.data.status === "success") {
      const successItem = items.value.find((i) => i.CID === item.CID);
      if (successItem) {
        successItem.statussubmit = "0";
      }

      Swal.fire({
        title: "ສຳເລັດ!",
        text: `ອັບໂຫຼດຂໍ້ມູນສຳເລັດ. ຈຳນວນລາຍການທີ່ປະມວນຜົນ: ${response.data.processed_count}`,
        icon: "success",
      }).then(() => {
        fetchData();
      });
    } else if (response.data.status === "warning") {
      Swal.fire({
        title: "ສຳເລັດແຕ່ມີຄຳເຕືອນ",
        text: response.data.message,
        icon: "warning",
        html: `
          <div>
            <p>${response.data.message}</p>
            <p>ຈຳນວນລາຍການທີ່ປະມວນຜົນສຳເລັດ: ${
              response.data.processed_count
            }</p>
            ${
              response.data.errors && response.data.errors.length
                ? `
              <p>ລາຍລະອຽດຄຳເຕືອນ:</p>
              <ul style="text-align: left; max-height: 200px; overflow-y: auto; margin-top: 10px;">
                ${response.data.errors
                  .map((error: any) => `<li>${error}</li>`)
                  .join("")}
              </ul>
            `
                : ""
            }
          </div>
        `,
      }).then(() => {
        fetchData();
      });
    } else {
      const failedItem = items.value.find((i) => i.CID === item.CID);
      if (failedItem) {
        failedItem.statussubmit = "1";
      }

      Swal.fire({
        title: "ບໍ່ສຳເລັດ!",
        text: response.data.message || "ການອັບໂຫຼດຂໍ້ມູນບໍ່ສຳເລັດ",
        icon: "error",
      });
    }
  } catch (error: any) {
    console.error("Failed to upload data:", error);

    const errorItem = items.value.find((i) => i.CID === item.CID);
    if (errorItem) {
      errorItem.statussubmit = "1";
    }

    const errorMessage =
      error.response?.data?.message || "ການອັບໂຫຼດຂໍ້ມູນລົ້ມເຫຼວ, ກະລຸນາລອງໃໝ່";

    Swal.fire({
      title: "ຜິດພາດ!",
      text: errorMessage,
      icon: "error",
    });
  }
};

const getPercentageColor = (percentage: number) => {
  if (percentage > 15) return "error";
  if (percentage <= 15) return "success";
  return "warning";
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "ກຳລັງນຳສົ່ງຂໍ້ມູນ":
      return "info";
    case "ການນຳສົ່ງຂໍ້ມູນສຳເລັດແລ້ວ":
      return "success";
    case "ການນຳສົ່ງບໍ່ສົມບູນ":
      return "error";
    default:
      return "default";
  }
};

const getFullPath = (path: string) => {
  if (!path) return "";
  return `${config.public.strapi.url}media/${path}`;
};

const getFileName = (path: string) => {
  if (!path) return "";
  const parts = path.split("/");
  return parts[parts.length - 1];
};

const formatFileSize = (fileSize: string | number) => {
  const bytes = Number(fileSize);
  if (bytes === 0) return "0 B";

  if (bytes / 1024 / 1024 < 1) {
    return `${(bytes / 1024).toFixed(2)} KB`;
  } else {
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  }
};
const uniqueDates = computed(() => {
  const data = items.value
    .map((item) => dayjs(item.insertDate).format("YYYY-MM-DD"))
    .filter((date, index, self) => self.indexOf(date) === index)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  return data;
});
const onSearch = () => {
  emit("searchQuery", search.value);
};

const emit = defineEmits(["searchQuery"]);

onMounted(async () => {
  loadFilterFromStorage();
  memberSore.getMemberInfo();
  await fetchData();
});

defineExpose({
  onSearch,
});
</script>
<template>
  <div class="data-management-container">
    <div class="text-h5">ກວດສອບແລະຢືນຢັນຂໍ້ມູນຫຼັກຊັບ</div>
    <!-- Header Section -->
    <div class="header-section">
      <!-- <pre>{{ uniqueDates }}</pre> -->
      <!-- <pre>{{ mapitemWithMemberOnly }}</pre> -->

      <!-- Statistics Cards -->
      <v-row class="stats-row mt-6">
        <v-col cols="12" sm="6" md="2">
          <v-card class="stat-card total-card" elevation="2">
            <v-card-text class="text-center">
              <v-icon size="24" class="mb-2">mdi-file-multiple</v-icon>
              <div class="stat-number">{{ statusStats.total }}</div>
              <div class="stat-label">ທັງໝົດ</div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="2">
          <v-card class="stat-card success-card" elevation="2">
            <v-card-text class="text-center">
              <v-icon size="24" class="mb-2">mdi-check-circle</v-icon>
              <div class="stat-number">{{ statusStats.confirmed }}</div>
              <div class="stat-label">ຢືນຢັນແລ້ວ</div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="2">
          <v-card class="stat-card warning-card" elevation="2">
            <v-card-text class="text-center">
              <v-icon size="24" class="mb-2">mdi-clock-outline</v-icon>
              <div class="stat-number">{{ statusStats.pending }}</div>
              <div class="stat-label">ລໍຖ້າ</div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="2">
          <v-card class="stat-card error-card" elevation="2">
            <v-card-text class="text-center">
              <v-icon size="24" class="mb-2">mdi-close-circle</v-icon>
              <div class="stat-number">{{ statusStats.rejected }}</div>
              <div class="stat-label">ຂໍ້ຜິດພາດສູງ</div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="2">
          <v-card class="stat-card info-card" elevation="2">
            <v-card-text class="text-center">
              <v-icon size="25" class="mb-2">mdi-upload</v-icon>
              <div class="stat-number">{{ statusStats.processing }}</div>
              <div class="stat-label">ກຳລັງປະມວນຜົນ</div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="2">
          <v-card class="stat-card unload-card" elevation="2">
            <v-card-text class="text-center">
              <v-icon size="25" class="mb-2">mdi-download</v-icon>
              <div class="stat-number">{{ statusStats.unloaded }}</div>
              <div class="stat-label">ອັນໂຫຼດແລ້ວ</div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Filter Section -->
    <v-card class="filter-card ma-4" elevation="3">
      <v-card-title class="filter-title mb-3">
        <v-icon class="mr-2">mdi-filter</v-icon>
        ການກັ່ນຕອງຂໍ້ມູນ
      </v-card-title>
      <!-- {{ uniqueDates }} -->
      <v-card-text>
        <v-row align="center">
          <v-col cols="12" md="4">
            <v-autocomplete
              v-model="dateFilter"
              :items="uniqueDates"
              label="ເລືອກວັນທີ"
              prepend-inner-icon="mdi-bank"
              variant="outlined"
              density="compact"
              clearable
              @update:model-value="saveFilterToStorage"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-autocomplete
              v-model="search"
              :items="mapitemWithMemberOnly"
              item-title="bankNameL"
              item-value="user_id"
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

          <!-- <v-col cols="12" md="3">
            <v-btn
              color="primary"
              @click="fetchData"
              variant="elevated"
              block
              prepend-icon="mdi-refresh"
            >
              ໂຫຼດຂໍ້ມູນໃໝ່
            </v-btn>
          </v-col> -->
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
        class="modern-table text-no-wrap"
        loading-text="ກຳລັງໂຫຼດຂໍ້ມູນ..."
        no-data-text="ບໍ່ມີຂໍ້ມູນ"
        :items-per-page-options="[10, 15, 25, 50]"
        show-current-page
      >
        <template v-slot:item.CID="{ item }">
          <v-chip color="primary" size="small" variant="outlined">
            {{ item.CID }}
          </v-chip>
        </template>

        <template v-slot:item.path="{ item }">
          <div class="file-info">
            <v-icon size="16" class="mr-2" color="primary"
              >mdi-file-document</v-icon
            >
            <a
              :href="getFullPath(item.path)"
              target="_blank"
              class="file-link"
              v-if="item.path"
            >
              {{ getFileName(item.path) }}
            </a>
            <span v-else class="text-grey">ບໍ່ມີໄຟລ໌</span>
          </div>
        </template>

        <template v-slot:item.user_id="{ item }">
          <div class="bank-info">
            <div class="bank-name">{{ item.user_id }}</div>
            <v-chip size="x-small" color="secondary" variant="outlined">
               {{
                mapitem.find((m) => m.CID === item.CID)?.bankNameL ||
                item.user_id
              }}
            </v-chip>
          </div>
        </template>

        <template v-slot:item.fileSize="{ item }">
          <v-chip
            :color="Number(item.fileSize) > 10000000 ? 'warning' : 'success'"
            size="small"
            variant="outlined"
          >
            {{ formatFileSize(item.fileSize) }}
          </v-chip>
        </template>

        <template v-slot:item.percentage="{ item }">
          <div class="percentage-container">
            <v-progress-circular
              :model-value="item.percentage || 0"
              :color="getPercentageColor(item.percentage || 0)"
              size="40"
              width="2"
            >
              <span class="percentage-text">
                {{ (item.percentage || 0).toFixed(0) }}%
              </span>
            </v-progress-circular>
          </div>
        </template>

        <template v-slot:item.insertDate="{ item }">
          <div class="date-info" v-if="item.insertDate">
            <div class="date">
              {{ dayjs(item.insertDate).format("DD/MM/YYYY") }}
            </div>
            <div class="time">{{ dayjs(item.insertDate).format("HH:mm") }}</div>
          </div>
          <span v-else class="text-grey">ບໍ່ມີວັນທີ່</span>
        </template>

        <template v-slot:item.statussubmit="{ item }">
          <div class="status-container">
            <template
              v-if="item.statussubmit === '0' && (item.percentage || 0) <= 60"
            >
              <v-chip
                color="success"
                prepend-icon="mdi-check-circle"
                variant="elevated"
              >
                ຢືນຢັນສຳເລັດ
              </v-chip>
            </template>

            <template
              v-else-if="
                item.statussubmit === '3' && (item.percentage || 0) <= 60
              "
            >
              <v-chip color="info" variant="elevated">
                <template v-slot:prepend>
                  <v-progress-circular
                    size="16"
                    width="2"
                    color="white"
                    indeterminate
                  ></v-progress-circular>
                </template>
                ກຳລັງຢືນຢັນ
              </v-chip>
            </template>

            <template
              v-else-if="
                item.statussubmit === '4' && (item.percentage || 0) <= 60
              "
            >
              <v-chip color="warning" variant="elevated">
                <template v-slot:prepend>
                  <v-progress-circular
                    size="16"
                    width="2"
                    color="white"
                    indeterminate
                  ></v-progress-circular>
                </template>
                ກຳລັງອັນໂຫຼດ
              </v-chip>
            </template>

            <template v-else-if="item.statussubmit === '2'">
              <v-chip
                color="error"
                prepend-icon="mdi-alert-circle"
                variant="elevated"
              >
                ຂໍ້ຜິດພາດສູງ
              </v-chip>
            </template>

            <template
              v-else-if="item.statussubmit === '1' || item.statussubmit === '5'"
            >
              <v-btn
                @click="handleConfirmAction(item)"
                color="success"
                :disabled="isUserIdProcessing(item.user_id)"
                size="small"
                prepend-icon="mdi-check"
                variant="elevated"
              >
                ຢືນຢັນ
              </v-btn>
            </template>
          </div>
        </template>

        <template v-slot:item.actions="{ item }">
          <div class="action-buttons d-flex">
            <span>
              <v-btn
                @click="viewDetails(item)"
                color="info"
                size="small"
                prepend-icon="mdi-eye"
                variant="outlined"
                class="mr-1"
              >
                ລາຍລະອຽດ
              </v-btn>

              <template v-if="item.statussubmit === '0'">
                <v-btn
                  @click="uploadDataButton(item)"
                  color="warning"
                  :disabled="isUserIdProcessing(item.user_id)"
                  size="small"
                  prepend-icon="mdi-download"
                  variant="outlined"
                >
                  ອັນໂຫຼດ
                </v-btn>
              </template>

              <template v-else-if="item.statussubmit === '5'">
                <v-chip
                  color="secondary"
                  size="small"
                  prepend-icon="mdi-check"
                  variant="outlined"
                >
                  ອັນໂຫຼດແລ້ວ
                </v-chip>
              </template></span
            >
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
            <v-icon size="64" color="grey-lighten-1"
              >mdi-credit-card-outline</v-icon
            >
            <h3 class="text-h6 mt-4 text-grey-darken-1">ບໍ່ມີຂໍ້ມູນເຄຣດິດ</h3>
            <p class="text-body-2 text-grey-darken-1">
              ລອງປ່ຽນການກັ່ນຕອງ ຫຼື ໂຫຼດຂໍ້ມູນໃໝ່
            </p>
          </div>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

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
