<template>
  <v-container>
    <div class="align-center ga-2 mb-4">
      <v-col cols="12">
        <v-row>
          <v-col cols="12" md="6">
            <v-row>
              <v-col cols="12" md="10">
                <v-autocomplete
                  variant="outlined"
                  density="compact"
                  width="90%"
                  v-model="search"
                  class="pa-2"
                  label="ໃສ່ລະຫັດທະນາຄານ"
                  :items="
                    uniqueUserIds.map((user_id) => ({
                      title: user_id,
                      value: user_id,
                    }))
                  "
                  item-value="value"
                  @update:model-value="saveFilterToStorage"
                />
              </v-col>

              <v-col cols="12" md="2">
                <v-btn
                  color="secondary"
                  @click="clearFilter"
                  :disabled="!search"
                  class="ml-2 mt-2"
                >
                  ເຄຍ Filter
                </v-btn></v-col
              >
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </div>

    <v-data-table
      :headers="headers"
      :items="filteredItems"
      class="elevation-1"
      :items-per-page="12"
    >
      <template v-slot:top> </template>

      <template v-slot:item.path="{ item }">
        <a :href="getFullPath(item.path)" target="_blank">
          {{ getFileName(item.path) }}
        </a>
      </template>

      <template v-slot:item.percentage="{ item }">
        <span
          :style="{ color: getPercentageColor(item.percentage) }"
          class="text-center"
        >
          {{ item.percentage.toFixed(2) }}%
        </span>
      </template>

      <template v-slot:item.user_id="{ item }">
        <p>{{ getFileName(item.user_id) }}</p>
      </template>

      <template v-slot:item.status="{ item }">
        <v-chip :color="getStatusColor(item.status)" dark>
          {{ item.status }}
        </v-chip>
      </template>

      <template v-slot:item.statussubmit="{ item }">
        <div class="d-flex align-center">
          <template v-if="item.statussubmit === '3'">
            <span class="text-amber-darken-4">
              ກຳລັງອັບໂຫຼດ
              <v-progress-circular
                :size="20"
                color="primary"
                indeterminate
              ></v-progress-circular>
            </span>
          </template>
          <template
            v-else-if="item.statussubmit === '0' && item.percentage <= 50"
          >
            <span class="text-green">ຢືນຢັນສຳເລັດແລ້ວ</span>
          </template>
          <template v-else-if="item.statussubmit === '2'">
            <span class="text-red">ປະຕິເສດ</span>
          </template>
          <template v-else-if="item.statussubmit === '4'">
            <span class="text-red"
              >ກຳລັງອັນໂຫຼດຂໍ້ມູນອອກ
              <v-progress-circular
                :size="20"
                color="primary"
                indeterminate
              ></v-progress-circular
            ></span>
          </template>
          <template v-else-if="item.percentage > 50">
            <span class="text-red">ຂໍ້ຜິດພາດສູງເກີນກຳນົດ</span>
          </template>
          <template v-else>
            <v-btn
              @click="confirmAction(item)"
              color="success"
              :disabled="isUserUploading(item.user_id)"
            >
              ຢືນຢັນ
            </v-btn>
          </template>
        </div>
      </template>

      <template v-slot:item.actions="{ item }">
        <div class="d-flex gap-2">
          <v-btn @click="viewDetails(item)" color="info"> ເບິ່ງລາຍລະອຽດ </v-btn>
          <template
            v-if="item.statussubmit === '0' || item.statussubmit === '2'"
          >
            <v-btn
              @click="unloadUpload(item)"
              color="warning"
              :disabled="isUserUnloading(item.user_id)"
            >
              ອັນໂຫຼດ
            </v-btn></template
          >
          <template v-else-if="item.statussubmit === '4'">
            <span class="text-red"
              >ກຳລັງອັນໂຫຼດຂໍ້ມູນອອກ
              <v-progress-circular
                :size="20"
                color="primary"
                indeterminate
              ></v-progress-circular
            ></span>
          </template>
          <template v-else-if="item.statussubmit === '5'">
            <span class="text-warning">ຂໍ້ມູນຖືກອັນໂຫຼດອອກແລ້ວ </span>
          </template>
        </div>
      </template>

      <template v-slot:no-data>
        <v-alert type="info" :value="true">ບໍ່ມີຂໍ້ມູນ</v-alert>
      </template>
    </v-data-table>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";
import { useRuntimeConfig } from "#app";

definePageMeta({
  layout: "backend",
});

useHead({
  title: "Submit",
  meta: [
    { name: "keywords", content: "Report, Nuxt 3, Backend" },
    { name: "Description", content: "Report Nuxt 3, IT Genius Engineering" },
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
const file = ref<File | null>(null);
const items = ref<ItemData[]>([]);
const user = ref<any>({});
const router = useRouter();
const config = useRuntimeConfig();

// Key ສຳລັບບັນທຶກໃນ localStorage
const FILTER_STORAGE_KEY = "bank_filter_search";

const headers = ref([
  { title: "ໄອດີ", value: "FID" },
  { title: "ຊື່ພາດ", value: "path" },
  { title: "ລະຫັດທະນາຄານ", value: "user_id" },
  { title: "ຂະໜາດຟາຍ", value: "fileSize" },
  { title: "ສະຖານະການຢືນຢັນ", value: "statussubmit" },
  { title: "ເປີເຊັນຄວາມຖືກຕອ້ງ", value: "percentage" },
  { title: "Actions", value: "actions", sortable: false },
]);

const filteredItems = computed(() =>
  items.value.filter((item) =>
    item.user_id.toLowerCase().includes(search.value.toLowerCase())
  )
);

const uniqueUserIds = computed(() => {
  return [...new Set(items.value.map((item) => item.user_id))];
});

// ຟັງຊັນບັນທຶກການຟິວເຕີ້ໃສ່ localStorage
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

// ຟັງຊັນໂຫຼດການຟິວເຕີ້ຈາກ localStorage
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

// ຟັງຊັນເຄຍການຟິວເຕີ້
const clearFilter = () => {
  search.value = "";
  localStorage.removeItem(FILTER_STORAGE_KEY);
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
      }));

    sortItemsByUploadDate();
  } catch (error) {
    console.error("Failed to fetch data:", error);
    Swal.fire({
      icon: "error",
      title: "ຜິດພາດ",
      text: "ບໍ່ສາມາດດຶງຂໍ້ມູນໄດ້. ກະລຸນາລອງໃໝ່ອີກຄັ້ງ.",
    });
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

    const result = await Swal.fire({
      title: "ຜິດພາດ",
      text: "ບໍ່ສາມາດອັນໂຫຼດຂໍ້ມູນໄດ້ . ກະລຸນາລອງໃໝ່.",
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: "#ff9800",
      confirmButtonText: "ຕົກລົງ",
    });
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
  if (percentage > 50) {
    return "red";
  } else if (percentage <= 15) {
    return "green";
  } else {
    return "black";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "ກຳລັງນຳສົ່ງຂໍ້ມູນ":
      return "blue";
    case "ການນຳສົ່ງຂໍ້ມູນສຳເລັດແລ້ວ":
      return "green";
    case "ການນຳສົ່ງບໍ່ສົມບູນ":
      return "red";
    default:
      return "black";
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

onMounted(async () => {
  try {
    loadFilterFromStorage();

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

<style scoped>
.d-flex {
  display: flex;
  align-items: center;
}

.gap-2 {
  gap: 8px;
}

.text-center {
  text-align: center;
  display: block;
}

.text-red {
  color: red;
}

.text-green {
  color: green;
}

.text-amber-darken-4 {
  color: #ff6f00;
}

.ga-2 {
  gap: 8px;
}
</style>
