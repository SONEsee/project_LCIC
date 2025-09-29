<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";
import Cookies from "js-cookie";
import { useRuntimeConfig } from "#app";
import { ValidateResponse } from "~/types";
import dayjs from "dayjs";
import { MemberStore } from "@/stores/memberinfo";
import { useMemberInfo } from "@/composables/memberInfo";
import { useUploadFile } from "~/stores/uploadfile";

const { mapMemberInfo, getMemberName, getMemberDetails } = useMemberInfo();
const memberinfoStore = MemberStore();
const UplodafileStore = useUploadFile();
const getUserStorageKey = (baseKey: string) => {
  try {
    const userData = localStorage.getItem("user_data");
    if (userData) {
      const user = JSON.parse(userData);
      const userId = user.MID?.id || "unknown";
      return `${baseKey}_user_${userId}`;
    }
    return baseKey; // fallback
  } catch (error) {
    console.error("Failed to get user ID for storage key:", error);
    return baseKey;
  }
};
const period = computed(() => {
  const data = UplodafileStore.respose_uploadfile_c;
  let mapData = [];
  if (Array.isArray(data)) {
    mapData = data;
  } else if (data && typeof data === "object") {
    mapData = [data];
  } else {
    return [];
  }
  const uniquePeriods = new Map();

  mapData.forEach((item) => {
    if (item.period) {
      uniquePeriods.set(item.period, item);
    }
  });
  return Array.from(uniquePeriods.values());
});

const dataMemberInfon = computed(() => {
  const data = memberinfoStore.respons_data_query;
  if (Array.isArray(data)) {
    return data;
  }
  if (data && typeof data === "object") {
    return [data];
  }
  return [];
});

const displayMemberInfo = (name: any) => {
  if (!name || !name.bnk_code || !name.code || !name.nameL) return "ທັງໝົດ";
  return `${name.bnk_code} - ${name.code} - ${name.nameL}`;
};

definePageMeta({
  layout: "backend",
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

// Type definitions
interface User {
  MID: {
    id: number | string;
  };
}

interface FileItem {
  CID?: string;
  fileName: string;
  path: string;
  user_id: string;
  fileSize?: number;
  statussubmit: string;
  percentage: number;
  period?: string;
  period_formatted?: string;
  FileType?: string;
  insertDate?: string;
  updateDate?: string;
  status: string;
  status_display?: string;
  confirmed: boolean;
}

interface MemberInfo {
  bnk_code: string;
  nameL: string;
}

interface Period {
  period: string;
}

interface Statistics {
  summary: {
    total_files: number;
    successful_uploads: number;
    pending_uploads: number;
    rejected_uploads: number;
    success_rate: number;
  };
  file_types: {
    json_files: number;
    xml_files: number;
  };
}

interface ApiResponse {
  count: number;
  results: FileItem[];
  summary: any;
  filters_applied: any;
}

const user = ref<User | null>(null);
const items = ref<FileItem[]>([]);
const searchQuery = ref("");
const isLoading = ref(false);
const itemsPerPage = ref(25);
const statistics = ref<Statistics | null>(null);
const apiResponse = ref<ApiResponse | null>(null);

const filters = ref({
  user_id: "",
  period: "",
  file_type: "",
  status: "",
});

const statusOptions = ref([
  { title: "ສຳເລັດການໂຫຼດ", value: "0" },
  { title: "ລໍຖ້າການຢືນຢັນ", value: "1" },
  { title: "ປະຕິເສດ", value: "2" },
  { title: "ກຳລັງອັບໂຫຼດ", value: "3" },
  { title: "ກຳລັງຖືກອັນໂຫຼດ", value: "4" },
  { title: "ຂໍ້ມູນຖືກອັນໂຫຼດ", value: "5" },
  // { title: "ກຳລັງນຳສົ່ງຂໍ້ມູນ", value: "Pending" },
]);

const headers = computed(() => {
  const baseHeaders = [
    { title: "ໄອດີ", value: "CID" },
    { title: "ໄລຍະເວລາ", value: "period" },
    { title: "ຊື່ໄຟລ໌", value: "fileName" },
    { title: "ຂະໜາດຟາຍ", value: "fileSize" },
    
    // { title: "ປະເພດ", value: "FileType" },
    { title: "ສະຖານະການຢືນຢັນ", value: "statussubmit" },
    { title: "ເປີເຊັນຄວາມຖືກຕ້ອງ", value: "percentage" },
    { title: "ການດຳເນີນການ", value: "actions", sortable: false },
  ];

  if (user.value && user.value.MID.id === "01") {
    baseHeaders.splice(1, 0, { title: "ລະຫັດທະນາຄານ", value: "user_id" });
  }

  return baseHeaders;
});

const router = useRouter();
const config = useRuntimeConfig();

const FILTER_STORAGE_KEY = "credit_filters_data";
const saveFiltersToStorage = () => {
  try {
    const filtersToSave = {
      user_id: filters.value.user_id || "",
      period: filters.value.period || "",
      file_type: filters.value.file_type || "",
      status: filters.value.status || "",
    };

    const hasActiveFilters = Object.values(filtersToSave).some(
      (value) => value !== ""
    );
    const storageKey = getUserStorageKey("credit_filters_data");

    if (hasActiveFilters) {
      localStorage.setItem(storageKey, JSON.stringify(filtersToSave));
      // ເກັບໃນ sessionStorage ດ້ວຍເພື່ອຄວາມໄວ
      sessionStorage.setItem(storageKey, JSON.stringify(filtersToSave));
    } else {
      localStorage.removeItem(storageKey);
      sessionStorage.removeItem(storageKey);
    }
  } catch (error) {
    console.error("Failed to save credit filters to localStorage:", error);
  }
};

const loadFiltersFromStorage = () => {
  try {
    const storageKey = getUserStorageKey("credit_filters_data");

    // ພະຍາຍາມໂຫຼດຈາກ sessionStorage ກ່ອນ (ໄວກວ່າ)
    let savedFilters = sessionStorage.getItem(storageKey);

    // ຖ້າບໍ່ມີໃນ sessionStorage ໃຫ້ໂຫຼດຈາກ localStorage
    if (!savedFilters) {
      savedFilters = localStorage.getItem(storageKey);
      // ຖ້າພົບໃນ localStorage ໃຫ້ copy ໄປ sessionStorage
      if (savedFilters) {
        sessionStorage.setItem(storageKey, savedFilters);
      }
    }

    if (savedFilters) {
      const parsedFilters = JSON.parse(savedFilters);

      // ກຳນົດຄ່າຟິວເຕີ້ທັງໝົດ
      filters.value = {
        user_id: parsedFilters.user_id || "",
        period: parsedFilters.period || "",
        file_type: parsedFilters.file_type || "",
        status: parsedFilters.status || "",
      };

      console.log("Loaded credit filters from storage:", filters.value);
    }
  } catch (error) {
    console.error("Failed to load credit filters from localStorage:", error);
  }
};
const filteredItems = computed(() =>
  items.value.filter((item) =>
    item.user_id.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
);

const saveFilterToStorage = () => {
  try {
    if (filters.value.user_id) {
      localStorage.setItem(FILTER_STORAGE_KEY, filters.value.user_id);
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
      filters.value.user_id = savedFilter;
    }
  } catch (error) {
    console.error("Failed to load filter from localStorage:", error);
  }
};

const clearFilter = () => {
  filters.value = {
    user_id: "",
    period: "",
    file_type: "",
    status: "",
  };

  try {
    const storageKey = getUserStorageKey("credit_filters_data");
    localStorage.removeItem(storageKey);
    sessionStorage.removeItem(storageKey);
  } catch (error) {
    console.error("Failed to remove credit filters from localStorage:", error);
  }

  fetchFilteredData();
};

const isUserIdProcessing = (userId: string) => {
  return items.value.some(
    (item) =>
      (item.user_id === userId && item.statussubmit === "3") ||
      (item.user_id === userId && item.statussubmit === "4")
  );
};

const fetchDataByUserID = async (userID: string) => {
  try {
    isLoading.value = true;
    let url = `${config.public.strapi.url}api/api/upload-filesc2/`;

    const params = new URLSearchParams();
    params.append("request_user_id", userID);

    if (filters.value.user_id && userID === "01") {
      params.append("user_id", filters.value.user_id);
    }
    if (filters.value.period) {
      params.append("period", filters.value.period);
    }
    if (filters.value.file_type) {
      params.append("file_type", filters.value.file_type);
    }
    if (filters.value.status) {
      params.append("status", filters.value.status);
    }

    console.log("Fetching data from:", `${url}?${params.toString()}`);

    const response = await fetch(`${url}?${params.toString()}`);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log("Data for user:", data);

    if (data.results) {
      apiResponse.value = data;
      items.value = data.results.map((item: any) => ({
        ...item,
        CID: item.CID || item.id_file || item.id || null,
        status: "ສຳເລັດການນຳສົ່ງຂໍ້ມູນ",
        confirmed: false,
      }));

      if (data.summary) {
        statistics.value = {
          summary: {
            total_files: data.summary.total_files || 0,
            successful_uploads: data.summary.status_breakdown?.["1"] || 0,
            pending_uploads: data.summary.status_breakdown?.["Pending"] || 0,
            rejected_uploads: data.summary.status_breakdown?.["2"] || 0,
            success_rate: calculateSuccessRate(data.summary.status_breakdown),
          },
          file_types: {
            json_files: data.summary.json_files || 0,
            xml_files: data.summary.xml_files || 0,
          },
        };
      }
    } else {
      items.value = data.map((item: any) => ({
        ...item,
        CID: item.CID || item.id_file || item.id || null,
        status: "ສຳເລັດການນຳສົ່ງຂໍ້ມູນ",
        confirmed: false,
      }));
    }

    sortItemsByUploadDate();
  } catch (error) {
    console.error("Failed to fetch data:", error);
    Swal.fire({
      icon: "error",
      title: "ຜິດພາດ",
      text: "ບໍ່ສາມາດດຶງຂໍ້ມູນໄດ້",
    });
  } finally {
    isLoading.value = false;
  }
};
const clearFiltersOnLogout = () => {
  try {
    const storageKey = getUserStorageKey("credit_filters_data");
    localStorage.removeItem(storageKey);
    sessionStorage.removeItem(storageKey);
    console.log("Credit filters cleared on logout");
  } catch (error) {
    console.error("Failed to clear credit filters on logout:", error);
  }
};
const validateUserStorage = () => {
  try {
    const currentUserData = localStorage.getItem("user_data");
    const lastUserData = localStorage.getItem("last_logged_user_credit");

    if (currentUserData !== lastUserData) {
      console.log("User changed, clearing old credit filters storage...");

      // ລືຂໍ້ມູນ filters ທີ່ກ່ຽວຂ້ອງກັບ users ອື່ນ
      Object.keys(localStorage).forEach((key) => {
        if (key.includes("credit_filters_data_user_")) {
          const currentUserKey = getUserStorageKey("credit_filters_data");
          if (key !== currentUserKey) {
            localStorage.removeItem(key);
          }
        }
      });

      Object.keys(sessionStorage).forEach((key) => {
        if (key.includes("credit_filters_data_user_")) {
          const currentUserKey = getUserStorageKey("credit_filters_data");
          if (key !== currentUserKey) {
            sessionStorage.removeItem(key);
          }
        }
      });

      // ເກັບຂໍ້ມູນ user ປັດຈຸບັນ
      if (currentUserData) {
        localStorage.setItem("last_logged_user_credit", currentUserData);
      }
    }
  } catch (error) {
    console.error("Failed to validate user storage:", error);
  }
};
const fetchFilteredData = async () => {
  if (user.value?.MID?.id) {
    const paddedMID = user.value.MID.id.toString().padStart(2, "0");
    await fetchDataByUserID(paddedMID);

    saveFiltersToStorage();
  }
};

const refreshData = async () => {
  filters.value = {
    user_id: "",
    period: "",
    file_type: "",
    status: "",
  };
  if (user.value?.MID?.id) {
    const paddedMID = user.value.MID.id.toString().padStart(2, "0");
    await fetchDataByUserID(paddedMID);
  }
};

const calculateSuccessRate = (statusBreakdown: any): number => {
  if (!statusBreakdown) return 0;

  const total = Object.values(statusBreakdown).reduce(
    (sum: number, count: any) => sum + (count || 0),
    0
  );
  const successful = (statusBreakdown["1"] || 0) + (statusBreakdown["0"] || 0);

  return total > 0 ? Math.round((successful / total) * 100) : 0;
};

const sortItemsByUploadDate = () => {
  items.value.sort(
    (a: FileItem, b: FileItem) =>
      new Date(b.insertDate || "").getTime() -
      new Date(a.insertDate || "").getTime()
  );
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

  item.statussubmit = "0";
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
    await fetchFilteredData();
    if (response1.data.status !== "success") {
      item.statussubmit = "1";
      return Swal.fire("ລົ້ມເຫຼວ!", "ບໍ່ສາມາດອັບເດດສະຖານະໄດ້", "error");
    }
  } catch (error) {
    console.error("Failed to update status:", error);
    item.statussubmit = "1";
    return Swal.fire("ຜິດພາດ!", "ການອັບເດດລົ້ມເຫຼວ.", "error");
  }

  try {
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
      const confirmedItem = items.value.find((i) => i.CID === item.CID);
      if (confirmedItem) {
        confirmedItem.confirmed = true;
        confirmedItem.statussubmit = "0";
      }

      await Swal.fire("ຢືນຢັນສຳເລັດ!", "ການອັບໂຫຼດໄດ້ຖືກຢືນຢັນ.", "success");
      await fetchFilteredData();
    } else {
      item.statussubmit = "1";
      Swal.fire("ລົ້ມເຫລວ!", "ການຢືນຢັນການອັບໂຫຼດລົ້ມເຫລວ.", "error");
    }
  } catch (error: any) {
    console.error("Failed to confirm upload:", error);
    item.statussubmit = "1";
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

    const response1 = await axios.post(
      `${config.public.strapi.url}api/api/unload-statussubmitc/`,
      `CID=${item.CID}`
    );
    fetchDataByUserID;
    viewDetails;
    if (response1.data.status !== "success") {
      return Swal.fire("ລົ້ມເຫຼວ!", "ບໍ່ສາມາດອັບເດດສະຖານະໄດ້", "error");
    }

    const params = new URLSearchParams();
    params.append("CID", item.CID);

    const response = await axios.post(
      `${config.public.strapi.url}api/unload_uploadc/`,
      params
    );

    if (response.data.status === "success") {
      await Swal.fire("ສຳເລັດ!", "ການອັນໂຫຼດຂໍ້ມູນໄດ້ສຳເລັດແລ້ວ.", "success");
      await fetchFilteredData();
    } else {
      Swal.fire(
        "ລົ້ມເຫຼວ!",
        response.data.message || "ການອັນໂຫຼດຂໍ້ມູນລົ້ມເຫຼວ.",
        "error"
      );
    }
  } catch (error: any) {
    console.error("Failed to upload data:", error);

    const errorMessage =
      error.response?.data?.message || "ການອັບໂຫຼດຂໍ້ມູນລົ້ມເຫຼວ, ກະລຸນາລອງໃໝ່";

    Swal.fire({
      title: "ຜິດພາດ!",
      text: errorMessage,
      icon: "error",
    });
  }
};

const getFullPath = (path: string) => {
  const baseUrl = `${config.public.strapi.url}media/`;
  return `${baseUrl}${path}`;
};

const getFileName = (path: string) => {
  const parts = path.split("/");
  return parts[parts.length - 1];
};

const truncateFileName = (fileName: string, maxLength: number) => {
  if (fileName.length <= maxLength) return fileName;
  const extension = fileName.split(".").pop();
  const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf("."));
  const truncatedName = nameWithoutExt.substring(
    0,
    maxLength - extension!.length - 4
  );
  return `${truncatedName}...${extension}`;
};

const getPercentageColor = (percentage: number) => {
  if (percentage >= 15) {
    return "red";
  } else if (percentage < 15) {
    return "green";
  }
  return "black";
};

const displayFilter = (item: MemberInfo) => {
  return `${item.bnk_code} - ${item.nameL}`;
};

const montDisplay = (item: Period) => {
  return dayjs(item.period).format("YYYY-MM");
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

onMounted(async () => {
  try {
    UplodafileStore.getDataUplodC();
    memberinfoStore.getMemberInfo();

    const userData = localStorage.getItem("user_data");
    console.log("User data:", userData);

    if (userData) {
      try {
        user.value = JSON.parse(userData);
        console.log("Parsed user data:", user.value);

        // ກວດສອບການປ່ຽນ user
        validateUserStorage();

        // ໂຫຼດຟິວເຕີ້ທັງໝົດຈາກ localStorage ກ່ອນ
        loadFiltersFromStorage();

        const MID = user.value?.MID;
        if (MID && MID.id) {
          const paddedMID = MID.id.toString().padStart(2, "0");
          console.log("Padded MID.id:", paddedMID);

          // ຖ້າມີຟິວເຕີ້ທີ່ເກັບໄວ້ ໃຫ້ fetch ຂໍ້ມູນດ້ວຍຟິວເຕີ້
          const hasActiveFilters = Object.values(filters.value).some(
            (value) => value !== ""
          );
          if (hasActiveFilters) {
            await fetchFilteredData();
          } else {
            await fetchDataByUserID(paddedMID);
          }
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  } catch (error) {
    console.error("Error in onMounted:", error);
  }
});

watch(
  () => filters.value,
  (newFilters) => {
    // ເກັບຟິວເຕີ້ທຸກຄັ້ງທີ່ມີການປ່ຽນແປງ
    saveFiltersToStorage();
  },
  { deep: true }
);
</script>

<template>
  <v-col cols="12">
    <!-- Filters Section -->
    <v-row class="mb-4">
      <v-col cols="12" md="3">
        <v-autocomplete
          variant="outlined"
          density="compact"
          v-model="filters.user_id"
          label="ໃສ່ລະຫັດທະນາຄານ"
          :items="dataMemberInfon"
          item-value="bnk_code"
          :item-title="displayMemberInfo"
          clearable
          @update:model-value="fetchFilteredData"
        >
          <template v-slot:item="{ props, item }">
            <v-list-item
              v-bind="props"
              :title="`${item.raw.bnk_code} - ${item.raw.nameL}`"
            ></v-list-item>
          </template>
        </v-autocomplete>
      </v-col>
      <v-col cols="12" md="2">
        <v-autocomplete
          variant="outlined"
          density="compact"
          v-model="filters.period"
          label="ເລືອກໄລຍະເວລາ"
          :items="period"
          :item-title="montDisplay"
          item-value="period"
          clearable
          @update:model-value="fetchFilteredData"
        >
          <template v-slot:item="{ props, item }">
            <v-list-item
              v-bind="props"
              :title="`${dayjs(item.raw.period).format('YYYY-MM')}`"
            ></v-list-item>
          </template>
        </v-autocomplete>
      </v-col>
      <v-col cols="12" md="2">
        <v-select
          variant="outlined"
          density="compact"
          v-model="filters.file_type"
          label="ປະເພດໄຟລ໌"
          :items="[
            { title: 'JSON', value: 'json' },
            { title: 'XML', value: 'xml' },
          ]"
          clearable
          @update:model-value="fetchFilteredData"
        />
      </v-col>
      <v-col cols="12" md="3">
        <v-select
          variant="outlined"
          density="compact"
          v-model="filters.status"
          label="ສະຖານະ"
          :items="statusOptions"
          clearable
          @update:model-value="fetchFilteredData"
        />
      </v-col>
      <v-col cols="12" md="2">
        <v-btn
          @click="clearFilter"
          color="success"
          icon="mdi-refresh"
          variant="outlined"
          class="mr-2"
        ></v-btn>
        <v-btn
          @click="clearFilter"
          color="secondary"
          :disabled="
            !filters.user_id &&
            !filters.period &&
            !filters.file_type &&
            !filters.status
          "
        >
          ເຄຍ Filter
        </v-btn>
      </v-col>
    </v-row>

    <!-- Statistics Section -->
    <v-row class="mb-4">
      <v-col cols="12" md="2">
        <v-card color="primary" variant="tonal">
          <v-card-text class="text-center">
            <div class="text-h6">{{ statusStats.total }}</div>
            <div class="text-caption">ຈຳນວນທັງໝົດ</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="2">
        <v-card color="success" variant="tonal">
          <v-card-text class="text-center">
            <div class="text-h6">{{ statusStats.confirmed }}</div>
            <div class="text-caption">ຢືນຢັນແລ້ວ</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="2">
        <v-card color="warning" variant="tonal">
          <v-card-text class="text-center">
            <div class="text-h6">{{ statusStats.pending }}</div>
            <div class="text-caption">ລໍຖ້າ</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="2">
        <v-card color="error" variant="tonal">
          <v-card-text class="text-center">
            <div class="text-h6">{{ statusStats.rejected }}</div>
            <div class="text-caption">ຂໍ້ຜິດພາດສູງ</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="2">
        <v-card color="info" variant="tonal">
          <v-card-text class="text-center">
            <div class="text-h6">{{ statusStats.processing }}</div>
            <div class="text-caption">ກຳລັງປະມວນຜົນ</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="2">
        <v-card color="secondary" variant="tonal">
          <v-card-text class="text-center">
            <div class="text-h6">{{ statusStats.unloaded }}</div>
            <div class="text-caption">ອັນໂຫຼດແລ້ວ</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-col>

  <!-- Data Table Section -->
  <v-data-table
    item-value="CID"
    :headers="headers"
    :items="items"
    :loading="isLoading"
    class="custom-header elevation-1 text-no-wrap"
    :items-per-page="itemsPerPage"
    :search="searchQuery"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>ກວດສອບແລະຢືນຢັນຂໍ້ມູນຫຼັກຊັບ</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="searchQuery"
          append-icon="mdi-magnify"
          label="ຄົ້ນຫາ..."
          single-line
          hide-details
          density="compact"
          style="max-width: 300px"
        ></v-text-field>
      </v-toolbar>
    </template>

    <template v-slot:header.CID>
      <th style="color: #0d47a1">ໄອດີ</th>
    </template>
    <template v-slot:header.fileName>
      <th style="color: #0d47a1">ຊື່ໄຟລ໌</th>
    </template>
    <template v-slot:header.user_id>
      <th style="color: #0d47a1" v-if="user && user.MID.id === '01'">
        ລະຫັດທະນາຄານ
      </th>
    </template>
    <template v-slot:header.fileSize>
      <th style="color: #0d47a1">ຂະໜາດຟາຍ</th>
    </template>
    <template v-slot:header.period>
      <th style="color: #0d47a1">ໄລຍະເວລາ</th>
    </template>
    <template v-slot:header.FileType>
      <th style="color: #0d47a1">ປະເພດ</th>
    </template>
    <template v-slot:header.statussubmit>
      <th style="color: #0d47a1">ສະຖານະການຢືນຢັນ</th>
    </template>
    <template v-slot:header.percentage>
      <th style="color: #0d47a1">ເປີເຊັນຄວາມຖືກຕ້ອງ</th>
    </template>
    <template v-slot:header.actions>
      <th style="color: #0d47a1">ການດຳເນີນການ</th>
    </template>

    <template v-slot:item.fileName="{ item }">
      <v-tooltip :text="`ກົດເພື່ອເບິ່ງເນື້ອຫາຂອງຟາຍ: ${item.fileName}`">
        <template v-slot:activator="{ props }">
          <div class="d-flex align-center" v-bind="props">
            <v-icon
              :icon="
                item.FileType === 'json' ? 'mdi-code-json' : 'mdi-file-xml'
              "
              :color="item.FileType === 'json' ? 'blue' : 'orange'"
              class="mr-2"
            ></v-icon>
            <a
              :href="getFullPath(item.path)"
              target="_blank"
              class="text-decoration-none"
            >
              {{ truncateFileName(item.fileName, 20) }}
            </a>
          </div>
        </template>
      </v-tooltip>
    </template>

    <template
      v-slot:item.user_id="{ item }"
      v-if="user && user.MID.id === '01'"
    >
      <v-chip color="primary" size="small">
        {{ mapMemberInfo(item.user_id) }}
      </v-chip>
    </template>

    <template v-slot:item.fileSize="{ item }">
      <span class="text-body-2">
        {{ formatFileSize(item.fileSize || 0) }}
      </span>
    </template>

    <template v-slot:item.period="{ item }">
      <v-chip color="secondary" size="small" v-if="item.period">
        {{ dayjs(item.period_formatted || item.period).format("YYYY-MM") }}
      </v-chip>
      <span v-else class="text-grey">-</span>
    </template>

    <template v-slot:item.percentage="{ item }">
      <div class="d-flex align-center">
        <v-progress-linear
          :model-value="item.percentage"
          :color="getPercentageColor(item.percentage)"
          height="6"
          class="mr-2"
          style="min-width: 80px"
        ></v-progress-linear>
        <span
          :style="{ color: getPercentageColor(item.percentage) }"
          class="text-caption"
        >
          {{ item.percentage?.toFixed(1) }}%
        </span>
      </div>
    </template>

    <template v-slot:item.statussubmit="{ item }">
      <div class="d-flex align-center">
        <template
          v-if="item.statussubmit === '0' && (item.percentage || 0) <= 60"
        >
          <v-chip color="success" size="small">
            <v-icon icon="mdi-check-circle" size="16" class="mr-1"></v-icon>
            ຢືນຢັນສຳເລັດ
          </v-chip>
        </template>

        <template
          v-else-if="item.statussubmit === '3' && (item.percentage || 0) <= 60"
        >
          <v-chip color="info" size="small">
            <v-progress-circular
              size="16"
              color="white"
              indeterminate
              class="mr-1"
            ></v-progress-circular>
            ກຳລັງຢືນຢັນ
          </v-chip>
        </template>

        <template
          v-else-if="item.statussubmit === '4' && (item.percentage || 0) <= 60"
        >
          <v-chip color="warning" size="small">
            <v-progress-circular
              size="16"
              color="white"
              indeterminate
              class="mr-1"
            ></v-progress-circular>
            ກຳລັງອັນໂຫຼດ
          </v-chip>
        </template>

        <template v-else-if="item.statussubmit === '2'">
          <v-chip color="error" size="small">
            <v-icon icon="mdi-alert-circle" size="16" class="mr-1"></v-icon>
            ຂໍ້ຜິດພາດສູງ
          </v-chip>
        </template>

        <template
          v-else-if="item.statussubmit === '1' || item.statussubmit === '5'"
        >
          <v-btn
            @click="confirmAction(item)"
            color="success"
            :disabled="isUserIdProcessing(item.user_id)"
            size="small"
            prepend-icon="mdi-check"
            variant="elevated"
          >
            ຢືນຢັນ
          </v-btn>
        </template>

        <template v-else-if="item.percentage > 60">
          <v-chip color="error" size="small">
            <v-icon icon="mdi-alert" size="16" class="mr-1"></v-icon>
            ຂໍ້ຜິດພາດສູງເກີນກຳນົດ
          </v-chip>
        </template>
      </div>
    </template>

    <template v-slot:item.actions="{ item }">
      <div class="d-flex gap-2">
        <v-btn
          @click="viewDetails(item)"
          color="primary"
          size="small"
          variant="outlined"
        >
          <v-icon icon="mdi-eye" size="16" class="mr-1"></v-icon>
          ລາຍລະອຽດ
        </v-btn>

        <template v-if="item.statussubmit === '0'">
          <v-btn
            @click="uploadDataButton(item)"
            color="warning"
            :disabled="isUserIdProcessing(item.user_id)"
            size="small"
            variant="outlined"
          >
            <v-icon icon="mdi-download" size="16" class="mr-1"></v-icon>
            ອັນໂຫຼດ
          </v-btn>
        </template>

        <template v-else-if="item.statussubmit === '5'">
          <v-chip color="grey" size="small">
            <v-icon icon="mdi-cloud-download" size="16" class="mr-1"></v-icon>
            ອັນໂຫຼດແລ້ວ
          </v-chip>
        </template>
      </div>
    </template>

    <template v-slot:no-data>
      <v-alert type="info" class="ma-4">
        <v-icon icon="mdi-information" class="mr-2"></v-icon>
        ບໍ່ມີຂໍ້ມູນທີ່ກົງກັບເງື່ອນໄຂການຄົ້ນຫາ
      </v-alert>
    </template>

    <template v-slot:loading>
      <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
    </template>
  </v-data-table>

  <!-- Pagination Info -->
  <v-row class="mt-4" v-if="apiResponse">
    <v-col cols="12">
      <v-card variant="outlined">
        <v-card-text class="d-flex justify-space-between align-center">
          <span class="text-body-2">
            ສະແດງຜົນ {{ items.length }} ຈາກທັງໝົດ {{ apiResponse.count }} ລາຍການ
          </span>
          <div class="d-flex align-center gap-4">
            <v-select
              v-model="itemsPerPage"
              :items="[10, 25, 50, 100]"
              label="ຈຳນວນຕໍ່ໜ້າ"
              density="compact"
              style="width: 120px"
              variant="outlined"
            ></v-select>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped>
.custom-header {
  background-color: #f5f5f5;
}

.text-no-wrap {
  white-space: nowrap;
}

.v-data-table .v-data-table-header th {
  font-weight: bold;
  background-color: #fafafa;
}

.v-chip {
  font-weight: 500;
}

.v-progress-linear {
  border-radius: 4px;
}

.d-flex {
  display: flex;
  align-items: center;
}

.gap-2 {
  gap: 8px;
}
</style>
