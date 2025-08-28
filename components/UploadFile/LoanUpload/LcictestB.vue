<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";
import { useRuntimeConfig } from "#app";
import { MemberStore } from "@/stores/memberinfo";
import dayjs from "dayjs";

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

definePageMeta({
  layout: "backend",
});

useHead({
  title: "ຂໍ້ມູນການນຳສົ່ງ - Submit Data",
  meta: [
    { name: "keywords", content: "Report, Nuxt 3, Backend, Data Management" },
    {
      name: "Description",
      content: "ລະບົບຈັດການຂໍ້ມູນການນຳສົ່ງ - IT Genius Engineering",
    },
  ],
});

interface ItemData {
  FID: string;
  fileName: string;
  path: string;
  statussubmit: string;
  percentage: number;
  status: string;
  confirmed: boolean;
  insertDate: string;
  user_id: string;
}

const search = ref("");
const dateFilter = ref("");
const file = ref<File | null>(null);
const items = ref<ItemData[]>([]);
const user = ref<any>({});
const router = useRouter();
const config = useRuntimeConfig();
const loading = ref(false);
const dialogUpload = ref(false);

const FILTER_STORAGE_KEY = "bank_filter_search";
const DATE_FILTER_STORAGE_KEY = "bank_date_filter";

const headers = ref([
  { title: "ໄອດີ", value: "FID", width: "80px", align: "center" },
  { title: "ຊື່ໄຟລ໌", value: "path", width: "200px" },
  { title: "ທະນາຄານ", value: "user_id", width: "150px" },
  // { title: "ຂະໜາດ", value: "fileSize", width: "100px", align: "center" },
  { title: "ສະຖານະ", value: "statussubmit", width: "150px", align: "center" },
  { title: "ຄວາມຖືກຕ້ອງ", value: "percentage", width: "80px", align: "center" },
  // { title: "ວັນທີ່ອັບໂຫຼດ", value: "insertDate", width: "120px", align: "center" },
  {
    title: "ຈັດການ",
    value: "actions",
    width: "200px",
    sortable: false,
    align: "start",
  },
]);

const filteredItems = computed(() => {
  let filtered = items.value;

  if (search.value && search.value.trim() !== "") {
    const searchTerm = search.value.toLowerCase().trim();
    filtered = filtered.filter((item) => {
      const bankInfo = mapitem.value.find((mi) => mi.FID === item.FID);
      return (
        item.user_id.toLowerCase().includes(searchTerm) ||
        bankInfo?.bankNameL?.toLowerCase().includes(searchTerm) ||
        bankInfo?.bankNameE?.toLowerCase().includes(searchTerm)
      );
    });
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
  return [...new Set(items.value.map((item) => item.user_id))];
});

const uniqueDates = computed(() => {
  const dates = items.value
    .map((item) => dayjs(item.insertDate).format("YYYY-MM-DD"))
    .filter((date, index, self) => self.indexOf(date) === index)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  return dates;
});

const statusStats = computed(() => {
  const stats = {
    total: items.value.length,
    confirmed: items.value.filter((item) => item.statussubmit === "0").length,
    pending: items.value.filter((item) => item.statussubmit === "1").length,
    rejected: items.value.filter((item) => item.statussubmit === "2").length,
    uploading: items.value.filter((item) => item.statussubmit === "3").length,
    unloading: items.value.filter((item) => item.statussubmit === "4").length,
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

    if (dateFilter.value) {
      localStorage.setItem(DATE_FILTER_STORAGE_KEY, dateFilter.value);
    } else {
      localStorage.removeItem(DATE_FILTER_STORAGE_KEY);
    }
  } catch (error) {
    console.error("Failed to save filter to localStorage:", error);
  }
};

const loadFilterFromStorage = () => {
  try {
    const savedFilter = localStorage.getItem(FILTER_STORAGE_KEY);
    const savedDateFilter = localStorage.getItem(DATE_FILTER_STORAGE_KEY);

    if (savedFilter) {
      search.value = savedFilter;
    }

    if (savedDateFilter) {
      dateFilter.value = savedDateFilter;
    }
  } catch (error) {
    console.error("Failed to load filter from localStorage:", error);
  }
};

const clearFilter = () => {
  search.value = "";
  dateFilter.value = "";
  localStorage.removeItem(FILTER_STORAGE_KEY);
  localStorage.removeItem(DATE_FILTER_STORAGE_KEY);
};

const isUserUploading = (user_id: string) => {
  return items.value.some(
    (item) =>
      (item.user_id === user_id && item.statussubmit === "3") ||
      (item.user_id === user_id && item.statussubmit === "4")
  );
};

const isUserUnloading = (user_id: string) => {
  return items.value.some(
    (item) =>
      (item.user_id === user_id && item.statussubmit === "4") ||
      (item.user_id === user_id && item.statussubmit === "3")
  );
};

const fetchData = async () => {
  loading.value = true;
  try {
    const response = await fetch(
      `${config.public.strapi.url}api/upload-files2/`
    );

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status}`);
    }

    const data = await response.json();

    items.value = data
      .filter((item: any) =>
        ["1", "3", "0", "2", "4", "5"].includes(item.statussubmit)
      )
      .map((item: any) => ({
        ...item,
        FID: item.FID,
        status: "ສຳເລັດການນຳສົ່ງຂໍ້ມູນ",
        confirmed: false,
        fileSize: item.fileSize || 0,
      }));

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

const fetchDataByUserID = async (paddedMID: string) => {
  try {
    console.log("Fetching data for user ID:", paddedMID);
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};

const sortItemsByUploadDate = () => {
  items.value.sort(
    (a, b) =>
      new Date(b.insertDate).getTime() - new Date(a.insertDate).getTime()
  );
};

const onFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    file.value = target.files[0];
  }
};

const uploadFile = async () => {
  if (!file.value) {
    Swal.fire({
      icon: "warning",
      title: "ບໍ່ໄດ້ເລືອກໄຟລ໌",
      text: "ກະລຸນາເລືອກໄຟລ໌ກ່ອນ",
    });
    return;
  }

  try {
    const formData = new FormData();
    formData.append("file", file.value);
    formData.append("title", file.value.name);

    const newItem = {
      fileName: file.value.name,
      fileSize: file.value.size,
      path: "",
      insertDate: new Date().toLocaleString(),
      updateDate: new Date().toLocaleString(),
      status: "ກຳລັງນຳສົ່ງຂໍ້ມູນ",
      confirmed: false,
    } as any;

    items.value.push(newItem);

    const response = await axios.post(
      `${config.public.strapi.url}api/upload-files/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000,
      }
    );

    const updatedItem = items.value.find(
      (item) => item.fileName === file.value!.name
    );

    if (updatedItem) {
      updatedItem.status = "ການນຳສົ່ງຂໍ້ມູນສຳເລັດແລ້ວ";
      updatedItem.path = response.data.path;
    }

    Swal.fire({
      icon: "success",
      title: "ສຳເລັດ",
      text: "ສຳເລັດການນຳສົ່ງຂໍ້ມູນແລ້ວ",
    });

    dialogUpload.value = false;
    file.value = null;
    await fetchData();
  } catch (error) {
    console.error("Upload failed:", error);

    const updatedItem = items.value.find(
      (item) => item.fileName === file.value!.name
    );

    if (updatedItem) {
      updatedItem.status = "ການນຳສົ່ງບໍ່ສົມບູນ";
    }

    Swal.fire({
      icon: "error",
      title: "ການອັບໂຫຼດລົ້ມເຫລວ",
      text: "ລົ້ມເຫລວໃນການອັບໂຫຼດໄຟລ໌",
    });
  }
};

const viewDetails = async (item: ItemData) => {
  if (!item.FID) {
    Swal.fire({
      icon: "error",
      title: "ລົ້ມເຫລວ",
      text: "ບໍມີຂໍ້ມູນທີ່ກົງກັບ FID ນີ້",
    });
    return;
  }

  try {
    const response = await axios.get(
      `${config.public.strapi.url}api/api/productinfo3/`,
      {
        params: { FID: item.FID },
        timeout: 10000,
      }
    );

    const data = response.data;

    router.push({
      name: "detailupload",
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

const unloadUpload = async (item: ItemData) => {
  try {
    const result = await Swal.fire({
      title: "ຢືນຢັນການອັນໂຫຼດ",
      text: "ທ່ານແນ່ໃຈຫຼືບໍ່ທີ່ຕ້ອງການອັນໂຫຼດຂໍ້ມູນນີ້?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ff9800",
      cancelButtonColor: "#d33",
      confirmButtonText: "ແນ່ໃຈ, ອັນໂຫຼດ!",
      cancelButtonText: "ຍົກເລີກ",
    });

    if (!result.isConfirmed) {
      return;
    }

    const updateResponse = await axios.post(
      `${config.public.strapi.url}api/api/unload_statussubmit/`,
      `FID=${item.FID}`
    );

    if (updateResponse.data.status !== "success") {
      item.statussubmit = "1";
      return Swal.fire("ລົ້ມເຫລວ!", "ບໍ່ສາມາດອັບເດດສະຖານະໄດ້", "error");
    }

    const params = new URLSearchParams();
    params.append("FID", item.FID);

    const response = await axios.post(
      `${config.public.strapi.url}api/unload-upload/`,
      params
    );

    Swal.close();

    if (response.data.status === "success") {
      await Swal.fire("ສຳເລັດ!", "ການອັນໂຫຼດຂໍ້ມູນໄດ້ສຳເລັດແລ້ວ.", "success");
      window.location.reload();
    } else {
      Swal.fire(
        "ລົ້ມເຫລວ!",
        response.data.message || "ການອັນໂຫຼດຂໍ້ມູນລົ້ມເຫລວ.",
        "error"
      );
    }
  } catch (error) {
    console.error("Failed to unload upload:", error);
    const updateResponse = await axios.post(
      `${config.public.strapi.url}api/api/error_statussubmit/`,
      `FID=${item.FID}`
    );
  }
};

const confirmAction = async (item: ItemData) => {
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

  item.statussubmit = "3";
  try {
    const config = useRuntimeConfig();
    const updateResponse = await axios.post(
      `${config.public.strapi.url}api/api/update-statussubmit/`,
      `FID=${item.FID}`
    );

    if (updateResponse.data.status !== "success") {
      item.statussubmit = "1";
      return Swal.fire("ລົ້ມເຫລວ!", "ບໍ່ສາມາດອັບເດດສະຖານະໄດ້", "error");
    }
  } catch (error) {
    console.error("Failed to update status:", error);
    item.statussubmit = "1";
    return Swal.fire("ຜິດພາດ!", "ການອັບເດດລົ້ມເຫລວ.", "error");
  }

  try {
    const params = new URLSearchParams();
    params.append("FID", item.FID);

    const confirmResponse = await axios.post(
      `${config.public.strapi.url}api/confirm_upload/`,
      params
    );

    if (confirmResponse.data.status === "success") {
      const confirmedItem = items.value.find((i) => i.FID === item.FID);
      if (confirmedItem) {
        confirmedItem.confirmed = true;
        confirmedItem.statussubmit = "0";
      }

      await Swal.fire("ຢືນຢັນສຳເລັດ!", "ການອັບໂຫຼດໄດ້ຖືກຢືນຢັນ.", "success");
      window.location.reload();
    } else {
      item.statussubmit = "1";
      Swal.fire("ລົ້ມເຫລວ!", "ການຢືນຢັນລົ້ມເຫລວ.", "error");
    }
  } catch (error) {
    console.error("Failed to confirm upload:", error);
    item.statussubmit = "1";
    Swal.fire("ຜິດພາດ!", "ການຢືນຢັນລົ້ມເຫລວ. ກະລຸນາລອງໃໝ່.", "error");
  }
};

const getPercentageColor = (percentage: number) => {
  if (percentage > 50) return "error";
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

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

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

onMounted(async () => {
  try {
    loadFilterFromStorage();
    await memberSore.getMemberInfo();
    await fetchData();

    const userData = localStorage.getItem("user_data");
    if (userData) {
      try {
        user.value = JSON.parse(userData);
        if (user.value.MID && user.value.MID.id) {
          const paddedMID = user.value.MID.id.toString().padStart(2, "0");
          await fetchDataByUserID(paddedMID);
        }
      } catch (parseError) {
        console.error("Error parsing user data:", parseError);
      }
    }
  } catch (error) {
    console.error("Error in onMounted:", error);
  }
});
</script>

<template>
  <div class="data-management-container">
    <div class="header-section">
      <div class="text-h5">ກວດສອບແລະຢືນຢັນຂໍ້ມູນເງິນກູ້</div>

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
              <div class="stat-label">ປະຕິເສດ</div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="2">
          <v-card class="stat-card info-card" elevation="2">
            <v-card-text class="text-center">
              <v-icon size="24" class="mb-2">mdi-upload</v-icon>
              <div class="stat-number">{{ statusStats.uploading }}</div>
              <div class="stat-label">ກຳລັງອັບໂຫຼດ</div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="2">
          <v-card class="stat-card unload-card" elevation="2">
            <v-card-text class="text-center">
              <v-icon size="24" class="mb-2">mdi-download</v-icon>
              <div class="stat-number">{{ statusStats.unloading }}</div>
              <div class="stat-label">ກຳລັງອັນໂຫຼດ</div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <v-card class="filter-card ma-4" elevation="3">
      <v-card-title class="filter-title mb-2">
        <v-icon class="mr-2">mdi-filter</v-icon>
        ການກັ່ນຕອງຂໍ້ມູນ
      </v-card-title>

      <v-card-text>
        <v-row align="center">
          <v-col cols="12" md="3">
            <v-select
              v-model="dateFilter"
              :items="uniqueDates"
              label="ເລືອກວັນທີ່"
              prepend-inner-icon="mdi-calendar"
              variant="outlined"
              density="compact"
              clearable
              @update:model-value="saveFilterToStorage"
            >
              <template v-slot:item="{ props, item }">
                <v-list-item v-bind="props">
                  <template v-slot:title>
                    {{ dayjs(item.value).format("DD/MM/YYYY") }}
                  </template>
                </v-list-item>
              </template>

              <template v-slot:selection="{ item }">
                {{ dayjs(item.value).format("DD/MM/YYYY") }}
              </template>
            </v-select>
          </v-col>

          <v-col cols="12" md="6">
            <v-autocomplete
              v-model="search"
              :items="mapitemWithMemberOnly"
              item-value="user_id"
              item-title="bankNameL"
              label="ເລືອກທະນາຄານ"
              prepend-inner-icon="mdi-bank"
              variant="outlined"
              density="compact"
              clearable
              @update:model-value="saveFilterToStorage"
            >
              <template v-slot:item="{ props, item }">
                <v-list-item v-bind="props">
                  <template v-slot:title>
                    <div class="d-flex justify-space-between align-center">
                      <span class="font-weight-medium">{{
                        item.raw.bankNameL
                      }}</span>
                      <v-chip size="small" color="primary">{{
                        item.raw.user_id
                      }}</v-chip>
                    </div>
                  </template>
                  <template v-slot:subtitle>
                    {{ item.raw.bankNameE }}
                  </template>
                </v-list-item>
              </template>
            </v-autocomplete>
          </v-col>

          <v-col cols="12" md="2">
            <v-btn
              color="secondary"
              @click="clearFilter"
              :disabled="!search && !dateFilter"
              variant="outlined"
              block
              prepend-icon="mdi-filter-remove"
            >
              ລຶບ Filter
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

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
        <template v-slot:item.FID="{ item }">
          <v-chip color="primary" size="small" variant="outlined">
            {{ item.FID }}
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
            <div class="bank-name">
              {{
                mapitem.find((m) => m.FID === item.FID)?.bankNameL ||
                item.user_id
              }}
            </div>
            <div class="bank-code">
              <v-chip size="x-small" color="secondary" variant="outlined">
                {{ item.user_id }}
              </v-chip>
            </div>
          </div>
        </template>

        <!-- <template v-slot:item.fileSize="{ item }">
          <v-chip 
            :color="item.fileSize > 10000000 ? 'warning' : 'success'" 
            size="small" 
            variant="outlined"
          >
            {{ formatFileSize(item.fileSize || 0) }}
          </v-chip>
        </template> -->

        <template v-slot:item.percentage="{ item }">
          <div class="percentage-container">
            <v-progress-circular
              :model-value="item.percentage"
              :color="getPercentageColor(item.percentage)"
              size="40"
              width="4"
            >
              <span class="percentage-text">
                {{ item.percentage.toFixed(1) }}%
              </span>
            </v-progress-circular>
          </div>
        </template>

        <template v-slot:item.insertDate="{ item }">
          <div class="date-info">
            <div class="date">
              {{ dayjs(item.insertDate).format("DD/MM/YYYY") }}
            </div>
            <div class="time">{{ dayjs(item.insertDate).format("HH:mm") }}</div>
          </div>
        </template>

        <template v-slot:item.statussubmit="{ item }">
          <div class="status-container">
            <template v-if="item.statussubmit === '3'">
              <v-chip
                color="info"
                prepend-icon="mdi-loading"
                variant="elevated"
              >
                <template v-slot:prepend>
                  <v-progress-circular
                    size="16"
                    width="2"
                    color="white"
                    indeterminate
                  ></v-progress-circular>
                </template>
                ກຳລັງອັບໂຫຼດ
              </v-chip>
            </template>

            <template
              v-else-if="item.statussubmit === '0' && item.percentage <= 50"
            >
              <v-chip
                color="success"
                prepend-icon="mdi-check-circle"
                variant="elevated"
              >
                ຢືນຢັນສຳເລັດ
              </v-chip>
            </template>

            <template v-else-if="item.statussubmit === '2'">
              <v-chip
                color="error"
                prepend-icon="mdi-close-circle"
                variant="elevated"
              >
                ປະຕິເສດ
              </v-chip>
            </template>

            <template v-else-if="item.statussubmit === '4'">
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

            <template v-else-if="item.statussubmit === '5'">
              <v-chip
                color="secondary"
                prepend-icon="mdi-download"
                variant="elevated"
              >
                ອັນໂຫຼດແລ້ວ
              </v-chip>
            </template>

            <template v-else-if="item.percentage > 50">
              <v-chip
                color="error"
                prepend-icon="mdi-alert-circle"
                variant="elevated"
              >
                ຂໍ້ຜິດພາດສູງ
              </v-chip>
            </template>

            <template v-else>
              <v-btn
                @click="confirmAction(item)"
                color="success"
                :disabled="isUserUploading(item.user_id)"
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
          <div class="action-buttons">
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

            <template
              v-if="item.statussubmit === '0' || item.statussubmit === '2'"
            >
              <v-btn
                @click="unloadUpload(item)"
                color="warning"
                :disabled="isUserUnloading(item.user_id)"
                size="small"
                prepend-icon="mdi-download"
                variant="outlined"
              >
                ອັນໂຫຼດ
              </v-btn>
            </template>

            <template v-else-if="item.statussubmit === '4'">
              <v-chip color="warning" size="small" variant="outlined">
                <template v-slot:prepend>
                  <v-progress-circular
                    size="12"
                    width="2"
                    color="orange"
                    indeterminate
                  ></v-progress-circular>
                </template>
                ກຳລັງອັນໂຫຼດ
              </v-chip>
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
            </template>
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
            <v-icon size="64" color="grey-lighten-1">mdi-file-outline</v-icon>
            <h3 class="text-h6 mt-4 text-grey-darken-1">ບໍ່ມີຂໍ້ມູນ</h3>
            <p class="text-body-2 text-grey-darken-1">
              ລອງປ່ຽນການກັ່ນຕອງ ຫຼື ອັບໂຫຼດຂໍ້ມູນໃໝ່
            </p>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Upload Dialog -->
    <v-dialog v-model="dialogUpload" max-width="500px" persistent>
      <v-card class="upload-dialog">
        <v-card-title class="upload-dialog-title">
          <v-icon class="mr-2">mdi-cloud-upload</v-icon>
          ອັບໂຫຼດໄຟລ໌ໃໝ່
        </v-card-title>

        <v-card-text>
          <v-file-input
            v-model="file"
            label="ເລືອກໄຟລ໌"
            prepend-icon="mdi-paperclip"
            variant="outlined"
            show-size
            accept=".json,.csv,.xlsx,.xls"
            @change="onFileChange"
          >
            <template v-slot:selection="{ fileNames }">
              <template v-for="fileName in fileNames" :key="fileName">
                <v-chip size="small" color="primary" class="me-2">
                  {{ fileName }}
                </v-chip>
              </template>
            </template>
          </v-file-input>

          <v-alert
            type="info"
            variant="tonal"
            class="mt-4"
            prepend-icon="mdi-information"
          >
            ສາມາດອັບໂຫຼດໄຟລ໌ປະເພດ: JSON, CSV, Excel
          </v-alert>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="outlined" @click="dialogUpload = false">
            ຍົກເລີກ
          </v-btn>
          <v-btn
            color="primary"
            variant="elevated"
            @click="uploadFile"
            :disabled="!file"
            prepend-icon="mdi-upload"
          >
            ອັບໂຫຼດ
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
