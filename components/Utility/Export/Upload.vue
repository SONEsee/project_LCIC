<template>
  <v-container>
    <div>
      <h2>ສາທາລະນຸປະໂພກ</h2>
    </div>
    <div class="">
      <v-row class="mt-4">
        <v-col cols="3">
          <v-text-field
            v-model="searchQuery"
            label="ຄົ້ນຫາຕາມຊື່ຟາຍ"
            variant="outlined"
            density="compact"
            class="custom-shadow"
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-select
            v-model="selectedMonth"
            :items="months"
            label="ເລືອກເດືອນ"
            variant="outlined"
            density="compact"
            class="custom-shadow"
            clearable
          ></v-select>
        </v-col>
        <v-col cols="3">
          <v-select
            v-model="selectedStatus"
            :items="statuses"
            label="ເລືອກສະຖານະ"
            variant="outlined"
            density="compact"
            class="custom-shadow"
          ></v-select>
        </v-col>
        <v-col cols="2">
          <v-select
            v-model="selectedYear"
            :items="years"
            label="ເລືອກປີທີອັບໂຫລດ"
            variant="outlined"
            density="compact"
            class="custom-shadow"
            type="number"
            clearable
          ></v-select>
        </v-col>
        <v-col cols="1">
          <v-btn color="primary" block @click="fetchFiles">
            <v-icon left icon="mdi-magnify"></v-icon> ຄົ້ນຫາ
          </v-btn>
        </v-col>
      </v-row>

      <!-- Tabs -->
      <v-tabs
        v-model="activeTab"
        fixed-tabs
        color="primary"
        stacked
        class="mb-4"
      >
        <v-tab value="water">ນໍ້າປະປາ</v-tab>
        <v-tab value="electric">ໄຟຟ້າ</v-tab>
        <v-tab value="telecom">ໂທລະຄົມ</v-tab>
      </v-tabs>

      <!-- Water Tab -->
      <v-window v-model="activeTab">
        <v-window-item value="water">
          <v-file-input
            v-model="waterUploadedFiles"
            label="ອັບໂຫລດຂໍ້ມູນນໍ້າປະປາ (JSON)"
            multiple
            show-size
            accept=".json"
            variant="outlined"
            prepend-icon="mdi-upload"
            class="custom-shadow mid-item"
            @change="handleWaterFileUpload"
          ></v-file-input>
          <v-alert
            v-if="waterUploadError"
            type="error"
            dismissible
            class="mt-2"
          >
            {{ waterUploadError }}
          </v-alert>
          <h3>ອັບໂຫລດຂໍ້ມູນນໍ້າປະປາ</h3>
          <v-table
            v-if="filteredWaterFiles.length > 0"
            class="mt-4 border-sm rounded-lg table-u"
          >
            <thead>
              <tr>
                <th>ລະຫັດຟາຍ</th>
                <th>ຊື່ຟາຍອັບໂຫລດ</th>
                <th>ວັນທີອັບໂຫລດ</th>
                <th>ສະຖານະ</th>
                <th>ເຫດການ</th>
                <th>ດໍາເນີນການ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(file, index) in filteredWaterFiles" :key="index">
                <td>{{ file.id }}</td>
                <td>{{ file.file_name }}</td>
                <td>{{ formatDate(file.insertDate) }}</td>
                <td>
                  <v-chip
                    :color="file.status === 'Approved' ? 'green' : 'orange'"
                  >
                    {{ file.status }}
                  </v-chip>
                </td>
                <td>
                  <v-btn
                    color="red"
                    icon
                    @click="deleteWaterFile(file.id)"
                    class="mr-2"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                  <v-btn
                    color="green"
                    icon
                    @click="confirmWaterFile(file.id)"
                    :disabled="
                      file.status === 'Approved' || isWaterProcessing[file.id]
                    "
                  >
                    <v-icon>mdi-check</v-icon>
                  </v-btn>
                </td>
                <td>
                  <div
                    v-if="waterFileProgress[file.id] !== undefined"
                    class="progress-container"
                  >
                    <v-progress-linear
                      :model-value="waterFileProgress[file.id]"
                      color="blue"
                      height="20"
                      rounded
                      striped
                      :active="waterFileProgress[file.id] < 100"
                      bg-color="grey-lighten-2"
                    >
                      <template v-slot:default="{ value }">
                        <span class="progress-text"
                          >{{ Math.round(value) }}%</span
                        >
                      </template>
                    </v-progress-linear>
                    <v-progress-circular
                      v-if="waterFileProgress[file.id] < 100"
                      indeterminate
                      color="blue"
                      size="24"
                      width="3"
                      class="loading-overlay"
                    ></v-progress-circular>
                  </div>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-window-item>

        <!-- Electric Tab -->
        <v-window-item value="electric">
          <v-file-input
            v-model="electricUploadedFiles"
            label="ອັບໂຫລດຂໍ້ມູນໄຟຟ້າ (JSON)"
            multiple
            show-size
            accept=".json"
            variant="outlined"
            prepend-icon="mdi-upload"
            class="custom-shadow mid-item"
            @change="handleElectricFileUpload"
          ></v-file-input>
          <v-alert
            v-if="electricUploadError"
            type="error"
            dismissible
            class="mt-2"
          >
            {{ electricUploadError }}
          </v-alert>
          <h3>ອັບໂຫລດຂໍ້ມູນໄຟຟ້າ</h3>
          <v-table
            v-if="filteredElectricFiles.length > 0"
            class="mt-4 border-sm rounded-lg table-u"
          >
            <thead>
              <tr>
                <th>ລະຫັດຟາຍ</th>
                <th>ຊື່ຟາຍອັບໂຫລດ</th>
                <th>ວັນທີອັບໂຫລດ</th>
                <th>ສະຖານະ</th>
                <th>ເຫດການ</th>
                <th>ດໍາເນີນການ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(file, index) in filteredElectricFiles" :key="index">
                <td>{{ file.id }}</td>
                <td>{{ file.file_name }}</td>
                <td>{{ formatDate(file.insertDate) }}</td>
                <td>
                  <v-chip
                    :color="file.status === 'Approved' ? 'green' : 'orange'"
                  >
                    {{ file.status }}
                  </v-chip>
                </td>
                <td>
                  <v-btn
                    color="red"
                    icon
                    @click="deleteElectricFile(file.id)"
                    class="mr-2"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                  <v-btn
                    color="green"
                    icon
                    @click="confirmElectricFile(file.id)"
                    :disabled="
                      file.status === 'Approved' ||
                      isElectricProcessing[file.id]
                    "
                  >
                    <v-icon>mdi-check</v-icon>
                  </v-btn>
                </td>
                <td>
                  <div
                    v-if="electricFileProgress[file.id] !== undefined"
                    class="progress-container"
                  >
                    <v-progress-linear
                      :model-value="electricFileProgress[file.id]"
                      color="blue"
                      height="20"
                      rounded
                      striped
                      :active="electricFileProgress[file.id] < 100"
                      bg-color="grey-lighten-2"
                    >
                      <template v-slot:default="{ value }">
                        <span class="progress-text"
                          >{{ Math.round(value) }}%</span
                        >
                      </template>
                    </v-progress-linear>
                    <v-progress-circular
                      v-if="electricFileProgress[file.id] < 100"
                      indeterminate
                      color="blue"
                      size="24"
                      width="3"
                      class="loading-overlay"
                    ></v-progress-circular>
                  </div>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-window-item>

        <!-- Telecom Tab (Placeholder) -->
        <v-window-item value="telecom">
          <h3>ອັບໂຫລດໂທລະຄົມ</h3>
          <p>ກໍາລັງປັບປຸງລະບົບ</p>
        </v-window-item>
      </v-window>
    </div>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";

definePageMeta({
  middleware: "auth",
  layout: "backend",
});

useHead({
  title: "Manage Users",
});

const config = useRuntimeConfig();
const WATER_API_URL = `${config.public.strapi.url}api/water-api/upload-json/`;
const ELECTRIC_API_URL = `${config.public.strapi.url}api/electric-api/upload-json/`;
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

const waterUploadedFiles = ref(null);
const electricUploadedFiles = ref(null);
const waterFiles = ref([]);
const electricFiles = ref([]);
const searchQuery = ref("");
const selectedMonth = ref("");
const selectedStatus = ref("");
const selectedYear = ref(null);
const waterFileProgress = ref({});
const electricFileProgress = ref({});
const isWaterProcessing = ref({});
const isElectricProcessing = ref({});
const waterUploadError = ref(null);
const electricUploadError = ref(null);
const activeTab = ref("water");

// Dropdown Options with Clear Option
const months = [
  "",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const statuses = ["Pending", "Approved", "Rejected"];
const years = [
  null,
  ...Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i),
];

// Fetch Water Files
const fetchWaterFiles = async () => {
  try {
    const response = await axios.get(WATER_API_URL);
    waterFiles.value = response.data || [];
    console.log("Water files fetched:", waterFiles.value);
  } catch (error) {
    console.error(
      "Error fetching water files:",
      error.response?.data || error.message
    );
  }
};

// Fetch Electric Files
const fetchElectricFiles = async () => {
  try {
    const response = await axios.get(ELECTRIC_API_URL);
    electricFiles.value = response.data || [];
    console.log("Electric files fetched:", electricFiles.value);
  } catch (error) {
    console.error(
      "Error fetching electric files:",
      error.response?.data || error.message
    );
  }
};

// Fetch All Files
const fetchFiles = async () => {
  await Promise.all([fetchWaterFiles(), fetchElectricFiles()]);
};

// Parse Filename for Month and Year
const parseFileName = (fileName) => {
  const match = fileName.match(/^(water|electric)-bill-(\d{2})(\d{4})\.json$/i);
  if (match) {
    const monthNum = parseInt(match[2], 10) - 1; // 0-based index for months array
    const year = parseInt(match[3], 10);
    return { month: months[monthNum + 1], year }; // +1 to skip ''
  }
  return null;
};

// Get Month and Year from Filename for Filtering
const getFileMonthYear = (fileName) => {
  const match = fileName.match(/^(water|electric)-bill-(\d{2})(\d{4})\.json$/i);
  if (match) {
    return { month: parseInt(match[2], 10), year: parseInt(match[3], 10) };
  }
  return null;
};

// Handle Water File Upload with Filtering
const handleWaterFileUpload = async () => {
  if (!waterUploadedFiles.value || waterUploadedFiles.value.length === 0)
    return;

  const invalidFiles = waterUploadedFiles.value.filter(
    (file) => !file.name.toLowerCase().startsWith("water-bill")
  );
  if (invalidFiles.length > 0) {
    waterUploadError.value =
      'Only files starting with "water-bill" are allowed in the Water tab.';
    waterUploadedFiles.value = null;
    return;
  }

  const formData = new FormData();
  waterUploadedFiles.value.forEach((file) => {
    formData.append("file_path", file);
    const parsed = parseFileName(file.name);
    if (parsed) {
      selectedMonth.value = parsed.month;
      selectedYear.value = parsed.year;
      console.log(
        `Set filters from ${file.name}: Month=${parsed.month}, Year=${parsed.year}`
      );
    }
  });
  formData.append("user_upload", "admin");

  try {
    waterUploadError.value = null;
    await axios.post(WATER_API_URL, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    waterUploadedFiles.value = null;
    await fetchWaterFiles();
  } catch (error) {
    waterUploadError.value =
      error.response?.data?.error || "Water upload failed";
    console.error(
      "Error uploading water file:",
      error.response?.data || error.message
    );
  }
};

// Handle Electric File Upload with Filtering
const handleElectricFileUpload = async () => {
  if (!electricUploadedFiles.value || electricUploadedFiles.value.length === 0)
    return;

  const invalidFiles = electricUploadedFiles.value.filter(
    (file) => !file.name.toLowerCase().startsWith("electric-bill")
  );
  if (invalidFiles.length > 0) {
    electricUploadError.value =
      'Only files starting with "electric-bill" are allowed in the Electric tab.';
    electricUploadedFiles.value = null;
    return;
  }

  const formData = new FormData();
  electricUploadedFiles.value.forEach((file) => {
    formData.append("file_path", file);
    const parsed = parseFileName(file.name);
    if (parsed) {
      selectedMonth.value = parsed.month;
      selectedYear.value = parsed.year;
      console.log(
        `Set filters from ${file.name}: Month=${parsed.month}, Year=${parsed.year}`
      );
    }
  });
  formData.append("user_upload", "admin");

  try {
    electricUploadError.value = null;
    await axios.post(ELECTRIC_API_URL, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    electricUploadedFiles.value = null;
    await fetchElectricFiles();
  } catch (error) {
    electricUploadError.value =
      error.response?.data?.error || "Electric upload failed";
    console.error(
      "Error uploading electric file:",
      error.response?.data || error.message
    );
  }
};

// Confirm Water File
const confirmWaterFile = async (fileId) => {
  try {
    isWaterProcessing.value[fileId] = true;
    console.log(`Starting confirmation for water file ${fileId}`);
    const patchResponse = await axios.patch(`${WATER_API_URL}${fileId}/`, {
      status: "Approved",
    });
    console.log(
      `Water File ${fileId} approved with response:`,
      patchResponse.data
    );
    pollWaterProgress(fileId);
  } catch (error) {
    console.error(
      "Error confirming water file:",
      error.response?.data || error.message
    );
    isWaterProcessing.value[fileId] = false;
  }
};

// Confirm Electric File
const confirmElectricFile = async (fileId) => {
  try {
    isElectricProcessing.value[fileId] = true;
    console.log(`Starting confirmation for electric file ${fileId}`);
    const patchResponse = await axios.patch(`${ELECTRIC_API_URL}${fileId}/`, {
      status: "Approved",
    });
    console.log(
      `Electric File ${fileId} approved with response:`,
      patchResponse.data
    );
    pollElectricProgress(fileId);
  } catch (error) {
    console.error(
      "Error confirming electric file:",
      error.response?.data || error.message
    );
    isElectricProcessing.value[fileId] = false;
  }
};

// Poll Water Progress
const pollWaterProgress = async (fileId) => {
  console.log(`Starting polling for water file ${fileId}`);
  waterFileProgress.value[fileId] = 0;
  const interval = setInterval(async () => {
    console.log("Water Interval tick");
    try {
      const response = await axios.get(`${WATER_API_URL}${fileId}/progress/`);
      console.log("Water Raw response:", response.data);
      const { progress, total, completed, error } = response.data;
      if (error) {
        console.error("Water Progress error:", error);
        clearInterval(interval);
        delete waterFileProgress.value[fileId];
        isWaterProcessing.value[fileId] = false;
        return;
      }
      waterFileProgress.value[fileId] = progress;
      console.log(
        `Water Progress for ${fileId}: ${progress}% of ${total} items`
      );
      if (completed || progress >= 100) {
        console.log(`Water File ${fileId} processing complete`);
        clearInterval(interval);
        setTimeout(() => {
          delete waterFileProgress.value[fileId];
          isWaterProcessing.value[fileId] = false;
          fetchWaterFiles();
        }, 2000);
      }
    } catch (error) {
      console.error(
        "Water Polling error:",
        error.response?.data || error.message
      );
      clearInterval(interval);
      delete waterFileProgress.value[fileId];
      isWaterProcessing.value[fileId] = false;
    }
  }, 500);
};

const pollElectricProgress = async (fileId) => {
  console.log(`Starting polling for electric file ${fileId}`);
  electricFileProgress.value[fileId] = 0;
  const interval = setInterval(async () => {
    console.log("Electric Interval tick");
    try {
      const response = await axios.get(
        `${ELECTRIC_API_URL}${fileId}/progress/`
      );
      console.log("Electric Raw response:", response.data);
      const { progress, total, completed, error } = response.data;
      if (error) {
        console.error("Electric Progress error:", error);
        clearInterval(interval);
        delete electricFileProgress.value[fileId];
        isElectricProcessing.value[fileId] = false;
        return;
      }
      electricFileProgress.value[fileId] = progress;
      console.log(
        `Electric Progress for ${fileId}: ${progress}% of ${total} items`
      );
      if (completed || progress >= 100) {
        console.log(`Electric File ${fileId} processing complete`);
        clearInterval(interval);
        setTimeout(() => {
          delete electricFileProgress.value[fileId];
          isElectricProcessing.value[fileId] = false;
          fetchElectricFiles();
        }, 2000);
      }
    } catch (error) {
      console.error(
        "Electric Polling error:",
        error.response?.data || error.message
      );
      clearInterval(interval);
      delete electricFileProgress.value[fileId];
      isElectricProcessing.value[fileId] = false;
    }
  }, 500);
};

// Delete Water File
const deleteWaterFile = async (fileId) => {
  try {
    await axios.delete(`${WATER_API_URL}${fileId}/`);
    await fetchWaterFiles();
  } catch (error) {
    console.error(
      "Error deleting water file:",
      error.response?.data || error.message
    );
  }
};

// Delete Electric File
const deleteElectricFile = async (fileId) => {
  try {
    await axios.delete(`${ELECTRIC_API_URL}${fileId}/`);
    await fetchElectricFiles();
  } catch (error) {
    console.error(
      "Error deleting electric file:",
      error.response?.data || error.message
    );
  }
};

// Format Date
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString();
};

// Filter Water Files
const filteredWaterFiles = computed(() => {
  return waterFiles.value.filter((file) => {
    const matchesSearch =
      searchQuery.value === "" ||
      file.file_name.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesStatus =
      selectedStatus.value === "" || file.status === selectedStatus.value;
    const matchesYear =
      selectedYear.value === null ||
      new Date(file.insertDate).getFullYear() === selectedYear.value;
    const fileDate = getFileMonthYear(file.file_name);
    const matchesMonth =
      selectedMonth.value === "" ||
      (fileDate && fileDate.month === months.indexOf(selectedMonth.value));
    return matchesSearch && matchesStatus && matchesYear && matchesMonth;
  });
});

// Filter Electric Files
const filteredElectricFiles = computed(() => {
  return electricFiles.value.filter((file) => {
    const matchesSearch =
      searchQuery.value === "" ||
      file.file_name.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesStatus =
      selectedStatus.value === "" || file.status === selectedStatus.value;
    const matchesYear =
      selectedYear.value === null ||
      new Date(file.insertDate).getFullYear() === selectedYear.value;
    const fileDate = getFileMonthYear(file.file_name);
    const matchesMonth =
      selectedMonth.value === "" ||
      (fileDate && fileDate.month === months.indexOf(selectedMonth.value));
    return matchesSearch && matchesStatus && matchesYear && matchesMonth;
  });
});

// Fetch files on component mount
onMounted(fetchFiles);
</script>

<style scoped>
.progress-container {
  position: relative;
  width: 100%;
  min-width: 150px;
}
.progress-text {
  color: white;
  font-weight: bold;
  font-size: 12px;
}
.loading-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.custom-shadow {
  border-radius: 8px;
}
.table-u {
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
}
.mid-item {
  padding-top: 30px;
  padding-bottom: 30px;
}
</style>
