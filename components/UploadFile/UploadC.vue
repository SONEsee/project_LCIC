<script lang="ts" setup>
import { useMemberInfo } from "@/composables/memberInfo";
import { MemberStore } from "@/stores/memberinfo";
import {useUploadFile} from "@/stores/uploadfile"
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";
import dayjs from "dayjs";
const { mapMemberInfo, getMemberName, getMemberDetails } = useMemberInfo();
const memberinfoStore = MemberStore();
const UplodafileStore = useUploadFile();
const period = computed(()=>{
  const data = UplodafileStore.respose_uploadfile_c;
  let mapData = [];
  if(Array.isArray(data)){
    mapData = data;
  }else if(data && typeof data ==="object"){
    mapData = [data]
  }else{
    return []
  }
  const uniquePeriods = new Map();

  mapData.forEach((item)=>{
    if(item.period){
      uniquePeriods.set(item.period, item);
    }
  });
  return Array.from(uniquePeriods.values());
})
// const period = computed(()=>{
// const data = UplodafileStore.respose_uploadfile_c;
// if(Array.isArray(data)){
//   return data
// }
// if(data && typeof data==="object"){
//   return [data]
// }
// return []
// })
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
  title: "Upload File",
  meta: [
    {
      name: "keywords",
      content: "Report, Nuxt 3, Backend",
    },
    {
      name: "Description",
      content: "Report Nuxt 3, IT Genius Engineering",
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
  FID?: string;
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
  dispuste:string
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

const file = ref<File | null>(null);
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

// const dataMemberInfon = ref<MemberInfo[]>([]);
// const period = ref<Period[]>([]);

const statusOptions = ref([
  { title: "ສຳເລັດການໂຫຼດ", value: "0" },
  { title: "ນຳສົ່ງຂໍ້ມູນສຳເລັດ", value: "1" },
  { title: "ປະຕິເສດ", value: "2" },
  // { title: "ກຳລັງອັບໂຫຼດ", value: "3" },
  // { title: "ກຳລັງຖືກອັນໂຫຼດ", value: "4" },
  { title: "ຂໍ້ມູນຖືກອັນໂຫຼດ", value: "5" },
  { title: "ກຳລັງນຳສົ່ງຂໍ້ມູນ", value: "Pending" },
]);

const headers = computed(() => {
  const baseHeaders = [
    { title: "ໄອດີ", value: "CID" },
    { title: "ໄລຍະເວລາ", value: "period" },
    { title: "ຊື່ໄຟລ໌", value: "fileName" },
    { title: "ຂະໜາດຟາຍ", value: "fileSize" },
    { title: "ຂໍ້ມູນ Dispust", value: "dispuste" },
    
    { title: "ປະເພດ", value: "FileType" },
    { title: "ສະຖານະ", value: "statussubmit" },
    { title: "ອັດຕາສ່ວນ", value: "percentage" },
    { title: "ການດຳເນີນການ", value: "actions", sortable: false },
  ];

  if (user.value && user.value.MID.id === "01") {
    baseHeaders.splice(1, 0, { title: "ລະຫັດທະນາຄານ", value: "user_id" });
  }

  return baseHeaders;
});

const router = useRouter();
const config = useRuntimeConfig();

const filteredItems = computed(() =>
  items.value.filter((item) =>
    item.user_id.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
);

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

    const response = await fetch(`${url}?${params.toString()}`);
    console.log("Response:", response);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log("Data for user:", data);

    if (data.results) {
      apiResponse.value = data;
      items.value = data.results.map((item: any) => ({
        ...item,
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

const fetchData = async (userID: string) => {
  let url = `${config.public.strapi.url}api/api/upload-filesc2/`;

  if (userID !== "01") {
    url += `?user_id=${userID}`;
  }

  try {
    isLoading.value = true;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log("Data fetched:", data);

    items.value = data.map((item: any) => ({
      ...item,
      FID: item.CID,
      status: "ສຳເລັດການນຳສົ່ງຂໍ້ມູນ",
      confirmed: false,
    }));

    sortItemsByUploadDate();
  } catch (error) {
    console.error("Failed to fetch data:", error);
  } finally {
    isLoading.value = false;
  }
};

const fetchFilteredData = async () => {
  if (user.value?.MID?.id) {
    const paddedMID = user.value.MID.id.toString().padStart(2, "0");
    await fetchDataByUserID(paddedMID);
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
  const successful = (statusBreakdown["1"] || 0) + (statusBreakdown["3"] || 0);

  return total > 0 ? Math.round((successful / total) * 100) : 0;
};

const sortItemsByUploadDate = () => {
  items.value.sort(
    (a: FileItem, b: FileItem) =>
      new Date(b.insertDate || "").getTime() -
      new Date(a.insertDate || "").getTime()
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

  const formData = new FormData();
  formData.append("file", file.value);
  formData.append("title", file.value.name);

  // if (user.value) {
  //   let userId = user.value.MID.id.toString();
  //   if (Number(user.value.MID.id) < 10) {
  //     userId = "0" + userId;
  //   }
  //   formData.append("user_id", userId);
  //   console.log("Formatted User ID:", userId);
  // } 
  if (user.value) {
  // ແປງເປັນ number ກ່ອນ, ແລ້ວຈຶ່ງ format
  const userIdNumber = parseInt(user.value.MID.id.toString());
  const userId = userIdNumber.toString().padStart(2, '0');
  
  formData.append("user_id", userId);
  console.log("Original MID.id:", user.value.MID.id);
  console.log("Parsed number:", userIdNumber);
  console.log("Formatted User ID:", userId);
}
  else {
    Swal.fire({
      icon: "warning",
      title: "ຂໍ້ມູນຜູ້ໃຊ້ບໍ່ສາມາດສົ່ງໄດ້",
      text: "ກະລຸນາກວດສອບຂໍ້ມູນຜູ້ໃຊ້",
    });
    return;
  }

  try {
    isLoading.value = true;
    const response = await axios.post(
      `${config.public.strapi.url}api/upload-filesC/`,
      formData
    );

    Swal.fire({
      icon: "success",
      title: "ສຳເລັດການນຳສົ່ງຂໍ້ມູນ",
      text: "ສຳເລັດການນຳສົ່ງຂໍ້ມູນສຳເລັດແລ້ວ",
    });
    if (user.value?.MID?.id) {
      const paddedMID = user.value.MID.id.toString().padStart(2, "0");
      await fetchDataByUserID(paddedMID);
    }
    file.value = null;
  } catch (error: any) {
    console.error(error);

    if (error.response && error.response.status === 401) {
      Swal.fire({
        icon: "error",
        title: "ການນຳສົ່ງບໍ່ສົມບູນ",
        text: "ຂໍ້ມູນບໍ່ຖືກກັບທະນາຄານ ກາລຸນາກວດສອບຄືນ",
      });
    } else if (error.response && error.response.status === 404) {
      Swal.fire({
        icon: "warning",
        title: "ມີຊືຟາຍຊໍ້າກັນ",
        text: "ຊື່ຟາຍນີ້ມີຢູ່ໃນລະບົບແລ້ວ ກາລຸນາກວດຄືນໃໝ່",
      });
    } else if (error.response && error.response.status === 406) {
      Swal.fire({
        icon: "error",
        title: "ອັບໂຫຼດລົ້ມເຫຼວ",
        text: "ຮູບແບບຂໍ້ມູນຂອງ period ຢູ່ໃນຖານຂໍ້ມູນບໍ່ຖືກຮູບແບບ",
      });
    } else if (error.response && error.response.status === 408) {
      Swal.fire({
        icon: "error",
        title: "ການອັບໂຫຼດລົ້ມເຫຼວ",
        text: "ທ່ານບໍ່ສາມາດອັບໂຫຼດຂໍ້ມູນຍອ້ນຫຼັງໄດ້",
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "ການອັບໂຫຼດລົ້ມເຫລວ",
        text: "ກາລຸນາກວດສອບຄືນ",
      });
    }
  } finally {
    isLoading.value = false;
  }
};

const viewDetails = async (item: FileItem) => {
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
      }
    );

    const data = response.data;
    router.push({
      name: "detailupload_c",
      query: { data: JSON.stringify(data) },
    });
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "ລົ້ມເຫລວ",
      text: "ລົ້ມເຫລວໃນການສະແດງຂໍ້ມູນ",
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

const getStatusColor = (statussubmit: string) => {
  switch (statussubmit) {
    case "Pending":
      return "orange";
    case "1":
    case "3":
      return "green";
    case "2":
      return "red";
    case "5":
    case "4":
      return "#827717";
    case "0":
      return "blue";
    default:
      return "grey";
  }
};

const getStatusText = (statussubmit: string) => {
  switch (statussubmit) {
    case "Pending":
      return "ກຳລັງນຳສົ່ຂໍ້ມູນ";
    case "1":
    case "3":
      return "ສຳເລັດການນຳສົ່ງຂໍ້ມູນ";
    case "2":
      return "ປະຕິເສດ";
    case "5":
      return "ຂໍ້ມູນຖືກອັນໂຫຼດ";
    case "4":
      return "ກຳລັງຖືກອັນໂຫຼດ..";
    case "0":
      return "ສຳເລັດການໂຫຼດ";
    default:
      return "ບໍ່ຮູ້ສະຖານະ";
  }
};

const getPercentageColor = (percentage: number) => {
  if (percentage >= 15) {
    return "red";
  } else if (percentage < 15) {
    return "green";
  }
  return "black";
};

// Display functions for autocomplete
const displayFilter = (item: MemberInfo) => {
  return `${item.bnk_code} - ${item.nameL}`;
};

const montDisplay = (item: Period) => {
  return dayjs(item.period).format("YYYY-MM");
};



onMounted(async () => {
  try {
    const userData = localStorage.getItem("user_data");
    console.log("User data:", userData);
UplodafileStore.getDataUplodC();
    if (userData) {
      try {
        user.value = JSON.parse(userData);
        console.log("Parsed user data:", user.value);

        const MID = user.value?.MID;
        if (MID && MID.id) {
          const paddedMID = MID.id.toString().padStart(2, "0");
          console.log("Padded MID.id:", paddedMID);
          await fetchDataByUserID(paddedMID);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  } catch (error) {
    console.error("Error in onMounted:", error);
  }
});
</script>
<template>
  <v-col cols="12">
    <v-row class="mb-4">
      <v-col cols="12" md="3" v-if="user && user.MID.id !== '01'">
        <v-file-input
          density="compact"
          variant="outlined"
          prepend-icon="mdi-paperclip"
          :label="$t('uploadjson')"
          accept=".json, .xml"
          @change="onFileChange"
          outlined
        ></v-file-input>
      </v-col>
      <v-col cols="12" md="2" v-if="user && user.MID.id !== '01'">
        <v-btn @click="uploadFile" color="primary">{{ $t("upload") }}</v-btn>
      </v-col>
      <v-col cols="12" md="3" v-if="user && user.MID.id === '01'">
        <!-- <pre>{{ dataMemberInfon }}</pre> -->
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
      <v-col cols="12" md="2" v-if="user && user.MID.id !== '01'">
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
      <v-col cols="12" md="2" v-if="user && user.MID.id === '01'">
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
      <v-col cols="12" md="2" v-if="user && user.MID.id !== '01'">
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
      <v-col cols="12" md="3" v-if="user && user.MID.id === '01'">
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
      <v-col cols="12" md="1">
        <v-btn
          @click="refreshData"
          color="success"
          icon="mdi-refresh"
          variant="outlined"
        ></v-btn>
      </v-col>
    </v-row>
    <v-row class="mb-4" v-if="statistics">
      <v-col cols="12" md="2">
        <v-card color="primary" variant="tonal">
          <v-card-text class="text-center">
            <div class="text-h6">{{ statistics.summary.total_files }}</div>
            <div class="text-caption">ຈຳນວນທັງໝົດ</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="2">
        <v-card color="success" variant="tonal">
          <v-card-text class="text-center">
            <div class="text-h6">
              {{ statistics.summary.successful_uploads }}
            </div>
            <div class="text-caption">ສຳເລັດ</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="2">
        <v-card color="warning" variant="tonal">
          <v-card-text class="text-center">
            <div class="text-h6">{{ statistics.summary.pending_uploads }}</div>
            <div class="text-caption">ກຳລັງດຳເນີນການ</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="2">
        <v-card color="error" variant="tonal">
          <v-card-text class="text-center">
            <div class="text-h6">{{ statistics.summary.rejected_uploads }}</div>
            <div class="text-caption">ປະຕິເສດ</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="2">
        <v-card color="info" variant="tonal">
          <v-card-text class="text-center">
            <div class="text-h6">{{ statistics.summary.success_rate }}%</div>
            <div class="text-caption">ອັດຕາສຳເລັດ</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="2">
        <v-card color="secondary" variant="tonal">
          <v-card-text class="text-center">
            <div class="text-h6">
              {{ statistics.file_types.json_files }}/{{
                statistics.file_types.xml_files
              }}
            </div>
            <div class="text-caption">JSON/XML</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-col>
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
        <v-toolbar-title>ລາຍການຟາຍອັບໂຫຼດຫຼັກຊັບ</v-toolbar-title>
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
      <th style="color: #0d47a1">{{ $t("id") }}</th>
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
      <th style="color: #0d47a1">{{ $t("status") }}</th>
    </template>
    <template v-slot:header.percentage>
      <th style="color: #0d47a1">{{ $t("percentage") }}</th>
    </template>
    <template v-slot:header.dispuste="{column}">
      <th style="color: #0d47a1">{{ column.title }}</th>
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
        <span v-if="Number(item.fileSize) / 1024 / 1024 < 1">
          {{ (Number(item.fileSize) / 1024).toFixed(2) }} KB
        </span>
        <span v-else>
          {{ (Number(item.fileSize) / 1024 / 1024).toFixed(2) }} MB
        </span>
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
     <template v-slot:item.dispuste="{ item }">
      <v-fab
        variant="outlined"
        size="small"
        @click="goPath(`../dispustc/?id_dispust=${item.CID}`)"
        v-if="item.dispuste !== null && item.dispuste !== '0'"
        color="warning"
      >
        {{ item.dispuste }}
      </v-fab>
      <v-chip v-else color="success" size="small"> ບໍ່ມີ </v-chip>
    </template>
    <template v-slot:item.statussubmit="{ item }">
      <v-chip
        v-if="item.statussubmit === 'Pending'"
        color="warning"
        size="small"
      >
        <v-progress-circular
          size="16"
          color="white"
          indeterminate
          class="mr-1"
        ></v-progress-circular>
        ກຳລັງນຳສົ່ງຂໍ້ມູນ
      </v-chip>
      <v-chip
        v-else-if="item.statussubmit === '1' || item.statussubmit === '3'"
        color="success"
        size="small"
      >
        <v-icon icon="mdi-check" size="16" class="mr-1"></v-icon>
        ນຳສົ່ງຂໍ້ມູນສຳເລັດ
      </v-chip>
      <v-chip v-else-if="item.statussubmit === '2'" color="error" size="small">
        <v-icon icon="mdi-close" size="16" class="mr-1"></v-icon>
        ປະຕິເສດ
      </v-chip>
      <v-chip
        v-else-if="item.statussubmit === '5' || item.statussubmit === '4'"
        color="info"
        size="small"
      >
        <v-icon icon="mdi-cloud-upload" size="16" class="mr-1"></v-icon>
        ຂໍ້ມູນຖືກອັນໂຫຼດ
      </v-chip>
      <v-chip
        v-else-if="item.statussubmit === '0'"
        color="primary"
        size="small"
      >
        <v-icon icon="mdi-check-all" size="16" class="mr-1"></v-icon>
        ສຳເລັດການໂຫຼດ
      </v-chip>
      <v-chip v-else color="grey" size="small">
        {{ item.status_display || "ບໍ່ຮູ້ສະຖານະ" }}
      </v-chip>
    </template>
    <template v-slot:item.actions="{ item }">
      <div class="d-flex gap-2">
        <v-btn
          @click="goPath(`../detailupload_c?CID=${item.CID}`)"
          color="primary"
          size="small"
          variant="outlined"
        >
          <v-icon icon="mdi-eye" size="16" class="mr-1"></v-icon>
          {{ $t("detail") }}
        </v-btn>
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
</style>
