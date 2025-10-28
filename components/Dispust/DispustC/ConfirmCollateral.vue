<script setup lang="ts">
import { useRequesDispustStore } from "~/stores/requesdispust";
import axios from "~/helpers/axios";
import { useUserData } from "~/composables/useUserData";
import { ref, computed, onMounted, watch } from "vue";
import { useMemberInfo } from "@/composables/memberInfo";
import { MemberStore } from "~/stores/memberinfo";
import {useDipustCallateralStore} from "@/stores/colleteraluploaddata"
import dayjs from "dayjs";
import { useLoanStore } from "~/stores/loan";
import Swal from "sweetalert2";
const LoanStore = useDipustCallateralStore();
const { mapMemberInfo, getMemberName, getMemberDetails } = useMemberInfo();
const selecData = ref<any>([]);

const config = useRuntimeConfig();
const memberinfoStore = MemberStore();
const { user, userId, isAdmin, isLoggedIn, userid } = useUserData();
const DispustStore = useDipustCallateralStore();
const imagepath = ref("");
const showPdfViewer = ref(false);
const pdfUrl = ref("");
const isLoading = ref(false);
const isFallbackMode = ref(false);
const pdfObjectUrl = ref("");
const viewerType = ref("iframe");
const selectAll = ref(false);

const useEmbedViewer = computed(() => viewerType.value === "embed");
const useObjectViewer = computed(() => viewerType.value === "object");
const getAPIHost = (): string => {
  try {
    const config = useRuntimeConfig();
    if (config?.public?.apiBase) {
      return config.public.apiBase;
    }
    if (config?.public?.strapi?.url) {
      return config.public.strapi.url;
    }
  } catch (e) {
    console.warn("Cannot access runtimeConfig:", e);
  }

  if (axios.defaults.baseURL) {
    return axios.defaults.baseURL;
  }

  if (imagepath.value) {
    return imagepath.value;
  }

  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return config.public.strapi.url;
};

// ✅ ແກ້ໄຂ: ຮອງຮັບທັງ array ໃຫຍ່ ແລະ nested disputes
const dataDispust = computed(() => {
  const data = DispustStore.respons_data_detail_confirm_dispust;
  
  // ກໍລະນີທີ່ 1: ຂໍ້ມູນເປັນ array ໃຫຍ່ໂດຍກົງ
  if (Array.isArray(data) && data.length > 0) {
    return data;
  }
  
  // ກໍລະນີທີ່ 2: ຂໍ້ມູນຢູ່ພາຍໃນ disputes property
  const dataDispust = computed(() => {
  const data = DispustStore.respons_data_detail_confirm_dispust;
  return Array.isArray(data) ? data : data ? [data] : [];
});
  if (data && typeof data === "object") {
    return [data];
  }
  return [];
});

const dispustData = computed(() => {
  const data = DispustStore.respons_data_dispust_allert;
  return Array.isArray(data) ? data : data ? [data] : [];
});

const fileUrl = computed(() => {
  if (!dispustData.value.length || !dispustData.value[0]?.image_url) return "";

  let imageUrl = dispustData.value[0]?.image_url || "";

  if (imageUrl.startsWith("//")) {
    const apiHost = getAPIHost();
    imageUrl = apiHost + imageUrl.substring(1);
    return imageUrl;
  }

  if (imageUrl.startsWith("/")) {
    if (!imagepath.value) {
      const apiHost = getAPIHost();
      return `${apiHost}${imageUrl}`;
    }

    const base = imagepath.value.endsWith("/")
      ? imagepath.value.slice(0, -1)
      : imagepath.value;
    return `${base}${imageUrl}`;
  }

  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  const apiHost = getAPIHost();
  return `${apiHost}/${imageUrl}`;
});

const hearder = [
  { title: "ເລືອກທັງໝົດ", value: "checkbox", align: "center" },
  { title: "ລຳດັບ", value: "index" },
  { title: "ລະຫັດ ຂສລ", value: "LCIC_code" },
  { title: "ລະຫັດວີສາຫະກິດ", value: "com_enterprise_code" },
  { title: "ສະມາຊິກ", value: "bnk_code" },
  { title: "ເດືອນປີ", value: "period" },
  { title: "ລະຫັດເງິນກູ້", value: "loan_id" },
  { title: "ລະຫັດລູກຄ້າ", value: "customer_id" },
] as any;

const fileType = computed(() => {
  if (!fileUrl.value) return "";
  const extension = fileUrl.value.split(".").pop()?.toLowerCase();
  return extension || "";
});

const isPdf = computed(() => {
  return fileType.value === "pdf";
});

const requese = DispustStore.data_edit_filter.query;
const rout = useRoute();
const id_dispust = rout.query.dispust_confirm as string;

const selectedCount = computed(() => selecData.value.length);

const canSubmit = computed(() => selectedCount.value > 0);

// ແກ້ໄຂ: ກັ່ນຕອງລາຍການທີ່ສາມາດເລືອກໄດ້
const availableItems = computed(() => {
  return dataDispust.value.filter(
    (item: any) => item.status !== "2"
  ) || [];
});

const canSelectAll = computed(() => {
  return availableItems.value.length > 0;
});

// ✅ ແກ້ໄຂຫຼັກ: ປ່ຽນເງື່ອນໄຂໃຫ້ຖືກຕ້ອງ
const toggleSelectAll = () => {
  console.log('toggleSelectAll called, selectAll.value:', selectAll.value);
  console.log('availableItems:', availableItems.value);
  
  if (!selectAll.value) {
    // ຖ້າກຳລັງຈະຍົກເລີກ (selectAll ກາຍເປັນ false) -> ລຶບທັງໝົດ
    selecData.value = [];
    console.log('Cleared all selections');
  } else {
    // ຖ້າກຳລັງຈະເລືອກທັງໝົດ (selectAll ກາຍເປັນ true) -> ເລືອກທັງໝົດ
    // ✅ ແກ້: ໃຊ້ 'id' ແທນ 'id_dispust'
    const allAvailableIds = availableItems.value.map((item: any) => item.id);
    selecData.value = [...allAvailableIds];
    console.log('Selected all:', allAvailableIds);
  }
};

// ✅ ແກ້ໄຂ: Watch ເພື່ອອັບເດດ selectAll ໃຫ້ຖືກຕ້ອງ
watch(selecData, (newVal) => {
  const totalAvailableItems = availableItems.value.length;
  if (totalAvailableItems === 0) {
    selectAll.value = false;
  } else {
    selectAll.value = newVal.length === totalAvailableItems;
  }
}, { deep: true });

async function onSelectionChange(params: number) {
  requese.page_size = params;
  await DispustStore.getDataDispustEdit();
}

async function onPagechange(params: number) {
  requese.page = params;
  await DispustStore.getDataDispustEdit();
}

const isUploading = ref(false);

const confirmupload = async () => {
  if (selecData.value.length === 0) {
    Swal.fire({
      icon: "warning",
      title: "ກະລຸນາເລືອກລາຍການ",
      text: "ກະລຸນາເລືອກລາຍການຢ່າງໜ້ອຍ 1 ລາຍການກ່ອນ",
    });
    return;
  }

  const result = await Swal.fire({
    icon: "question",
    title: "ຢືນຢັນການດຳເນີນການ",
    text: `ທ່ານຕ້ອງການປະມວນຜົນ ${selecData.value.length} ລາຍການແມ່ນບໍ່?`,
    showCancelButton: true,
    confirmButtonText: "ຢືນຢັນ",
    cancelButtonText: "ຍົກເລີກ",
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
  });

  if (!result.isConfirmed) {
    return;
  }

  isUploading.value = true;

  try {
    LoanStore.from_confirm_dispust.is_disputed_list = selecData.value;
    LoanStore.update_status.user_update = userid.value

    await LoanStore.confirmDitpust();
    await LoanStore.UpdateStatus(id_dispust)

    selecData.value = [];
    selectAll.value = false; // ✅ ເພີ່ມ: Reset selectAll ຫຼັງບັນທຶກສຳເລັດ
    goPreviousPath();
  } catch (error) {
    console.error("Error:", error);
  } finally {
    isUploading.value = false;
  }
};

function openPdfViewer() {
  if (isPdf.value && fileUrl.value) {
    pdfUrl.value = "";
    showPdfViewer.value = true;

    setTimeout(() => {
      try {
        pdfUrl.value = fileUrl.value;

        if (viewerType.value === "iframe") {
          console.log("Using iframe PDF viewer");
        } else if (viewerType.value === "embed") {
          console.log("Using embed PDF viewer");
        } else if (viewerType.value === "object") {
          console.log("Using object PDF viewer");
        }
      } catch (error) {
        console.error("Error setting PDF URL:", error);
        pdfUrl.value = fileUrl.value;
      }
    }, 300);
  }
}

function closePdfViewer() {
  showPdfViewer.value = false;

  if (pdfObjectUrl.value) {
    URL.revokeObjectURL(pdfObjectUrl.value);
    pdfObjectUrl.value = "";
  }
}

watch(fileUrl, (newUrl) => {
  if (newUrl && isPdf.value) {
    pdfUrl.value = newUrl;
  }
});

onMounted(() => {
  
  
  memberinfoStore.getMemberInfo();
  imagepath.value = axios.defaults.baseURL || "";

  if (userId.value) {
    DispustStore.data_filter_dispust.query.bnk_code = userId.value;
  }

  if (id_dispust) {
    DispustStore.data_edit_filter.query.confirm_dispust_id = id_dispust;
    DispustStore.data_filter_dispust.query.id_disput_loan = id_dispust;
  }

  isLoading.value = true;
  Promise.all([
    DispustStore.getDataDispust(),
    DispustStore.getDataDispustEdit(),
    DispustStore.getDataDispust(),
  ]).finally(() => {
    isLoading.value = false;

    if (
      dispustData.value.length &&
      dispustData.value[0]?.image_url &&
      isPdf.value
    ) {
      console.log("PDF URL:", fileUrl.value);
    }
  });
});
</script>

<template>
  <div class="dispute-container">
    <div v-if="isLoading" class="loading-container">
      <v-progress-circular indeterminate color="primary" size="50" />
      <p class="loading-text">ກຳລັງໂຫຼດຂໍ້ມູນ...</p>
    </div>

    <template v-else>
      <v-card v-if="fileUrl" class="file-card elevation-2 mb-6">
        <v-card-title class="file-card-header">
          <div class="d-flex align-center justify-space-between w-100">
            <div class="d-flex align-center">
              <v-icon color="blue-darken-1" class="mr-2"
                >mdi-file-document-outline</v-icon
              >
              <span class="text-h6">ເອກະສານແນບ</span>
            </div>
            <v-chip
              size="small"
              color="blue-grey-lighten-4"
              class="file-type-chip"
            >
              <v-icon start size="small">mdi-file</v-icon>
              {{ fileType.toUpperCase() }}
            </v-chip>
          </div>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="pa-6">
          <div v-if="!isPdf" class="image-preview-wrapper">
            <img :src="fileUrl" alt="Dispute Image" class="preview-image" />
          </div>

          <div v-else class="pdf-preview-wrapper">
            <div class="pdf-info-section">
              <v-icon size="80" color="red-darken-1">mdi-file-pdf-box</v-icon>
              <p class="pdf-filename mt-4">
                {{
                  dispustData[0]?.image_url
                    ?.split("/")
                    .pop() || "Document.pdf"
                }}
              </p>
              <div class="pdf-actions mt-6">
                <v-btn
                  color="blue-darken-1"
                  variant="flat"
                  prepend-icon="mdi-eye"
                  @click="openPdfViewer"
                >
                  ເປີດເອກະສານ
                </v-btn>
                <v-btn
                  color="blue-grey"
                  variant="outlined"
                  prepend-icon="mdi-download"
                  :href="fileUrl"
                  target="_blank"
                  download
                >
                  ດາວໂຫຼດ
                </v-btn>
              </div>
            </div>
          </div>
        </v-card-text>
      </v-card>

      <!-- PDF Viewer Dialog -->
      <v-dialog v-model="showPdfViewer" fullscreen>
        <v-card>
          <v-toolbar color="blue-darken-1" dark>
            <v-toolbar-title>ເອກະສານ PDF</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="closePdfViewer">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>

          <div class="pdf-container">
            <div v-if="!pdfUrl" class="pdf-loading">
              <v-progress-circular indeterminate color="primary" size="50" />
              <p>ກຳລັງໂຫຼດເອກະສານ...</p>
            </div>

            <iframe
              v-else-if="!useEmbedViewer && !useObjectViewer"
              :src="pdfUrl"
              style="width: 100%; height: 100%; border: none"
            ></iframe>

            <embed
              v-else-if="useEmbedViewer"
              :src="pdfUrl"
              type="application/pdf"
              style="width: 100%; height: 100%"
            />

            <object
              v-else-if="useObjectViewer"
              :data="pdfUrl"
              type="application/pdf"
              style="width: 100%; height: 100%"
            >
              <p>
                ບໍ່ສາມາດສະແດງ PDF ໄດ້.
                <a :href="pdfUrl" target="_blank">ກົດທີ່ນີ້ເພື່ອດາວໂຫຼດ</a>
              </p>
            </object>
          </div>
        </v-card>
      </v-dialog>

      <!-- Data Table Card -->
      <v-card class="data-table-card elevation-2">
        <div class="action-bar">
          <div class="d-flex align-center justify-space-between w-100">
            <div class="d-flex align-center gap-3">
             
              <div>
              
                <p class="text-caption text-grey-darken-1 ma-0">
                  ເລືອກແລ້ວ: {{ selectedCount }} ລາຍການ
                </p>
              </div>
            </div>

            <div class="d-flex gap-2">
              <v-btn
                color="success"
                variant="flat"
                prepend-icon="mdi-check-circle"
                :disabled="!canSubmit"
                :loading="isUploading"
                @click="confirmupload"
              >
                ຢືນຢັນການດຳເນີນການ
              </v-btn>
            </div>
          </div>
        </div>

        <v-divider></v-divider>

        <v-data-table
          :headers="hearder"
          :items="dataDispust"
          :items-per-page="requese.page_size"
          density="compact"
          class="custom-table"
          hover
        >
          <template v-slot:header.checkbox>
            <v-checkbox
              v-model="selectAll"
              @update:model-value="toggleSelectAll"
              hide-details
              density="compact"
              color="blue-darken-1"
              :disabled="!canSelectAll"
            />
          </template>

          <template v-slot:item.checkbox="{ item }">
            <v-checkbox
              v-if="(item as any).status === '1'"
              v-model="selecData"
              :value="(item as any).id"
              hide-details
              density="compact"
              color="blue-darken-1"
              @click.stop
            />
            <v-tooltip text="ກວດສອບແລະບັນທືກສຳເລັດແລ້ວ">
              <template v-slot:activator="{ props }">
                <v-chip
                  color="success"
                  v-bind="props"
                  v-if="(item as any).status === '2'"
                >
                  ສຳເລັດ
                </v-chip>
              </template>
            </v-tooltip>
          </template>

          <template v-slot:item.index="{ item, index }">
            <v-chip size="small" color="grey-lighten-3">
              {{ (requese.page - 1) * requese.page_size + index + 1 }}
            </v-chip>
          </template>

          <template v-slot:item.bnk_code="{ item }">
            <span class="font-weight-medium">
              {{ mapMemberInfo((item as any).bnk_code || "") }}
            </span>
          </template>

          <template v-slot:item.period="{ item }">
            <v-chip size="small" color="blue-lighten-5" variant="flat">
              <v-icon start size="small">mdi-calendar-month</v-icon>
              {{ dayjs((item as any).period || "").format("YYYY-MM") }}
            </v-chip>
          </template>

          <template v-slot:bottom>
            <GloBalTablePaginations
              :page="requese.page"
              :limit="requese.page_size"
              :totalpage="
                DispustStore.pagination?.total_pages
                   || 0
              "
              @onPagechange="onPagechange"
              @onSelectionChange="onSelectionChange"
            />
          </template>

          <template v-slot:no-data>
            <div class="no-data-wrapper">
              <v-icon size="64" color="grey-lighten-1"
                >mdi-file-document-alert-outline</v-icon
              >
              <p class="text-h6 mt-4 text-grey-darken-1">
                ບໍ່ມີຂໍ້ມູນການໂຕ້ແຍ້ງທີ່ຈະສະແດງ
              </p>
            </div>
          </template>
        </v-data-table>
      </v-card>
    </template>
  </div>
</template>

<style scoped>
.dispute-container {
  padding: 24px;
  background: linear-gradient(to bottom, #f8f9fa 0%, #ffffff 100%);
  min-height: 100vh;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 16px;
}

.loading-text {
  font-size: 1.1rem;
  color: #5f6368;
  margin: 0;
}

.file-card {
  border-radius: 12px !important;
  overflow: hidden;
  background: white;
  transition: all 0.3s ease;
}

.file-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
}

.file-card-header {
  background: linear-gradient(135deg, #e3f2fd 0%, #f5f5f5 100%);
  padding: 20px 24px !important;
}

.file-type-chip {
  font-weight: 600;
  letter-spacing: 0.5px;
}

.image-preview-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fafafa;
  border-radius: 8px;
  padding: 16px;
}

.preview-image {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.pdf-preview-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

.pdf-info-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  background: linear-gradient(135deg, #fff5f5 0%, #fafafa 100%);
  border-radius: 12px;
  border: 2px dashed #e0e0e0;
  transition: all 0.3s ease;
}

.pdf-info-section:hover {
  border-color: #1976d2;
  transform: translateY(-2px);
}

.pdf-filename {
  font-size: 1rem;
  color: #424242;
  text-align: center;
  max-width: 400px;
  word-break: break-word;
  font-weight: 500;
}

.pdf-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

/* PDF Dialog */
.pdf-container {
  height: calc(100vh - 64px);
  width: 100%;
  background: #f5f5f5;
  position: relative;
}

.pdf-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.pdf-loading p {
  color: #5f6368;
  font-size: 1rem;
}

/* ສ່ວນຕາຕະລາງ */
.data-table-card {
  border-radius: 12px !important;
  overflow: hidden;
  background: white;
}

.action-bar {
  background: linear-gradient(135deg, #e8f5e9 0%, #f5f5f5 100%);
  padding: 20px 24px !important;
}

.custom-table {
  background: transparent;
}

.custom-table :deep(thead) {
  background: #fafafa;
}

.custom-table :deep(thead th) {
  font-weight: 600 !important;
  color: #424242 !important;
  border-bottom: 2px solid #e0e0e0 !important;
  padding: 16px 12px !important;
}

.custom-table :deep(tbody tr) {
  transition: all 0.2s ease;
}

.custom-table :deep(tbody tr:hover) {
  background: #f8f9fa !important;
}

.custom-table :deep(tbody td) {
  padding: 14px 12px !important;
  color: #616161;
}

.no-data-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 24px;
  background: linear-gradient(135deg, #fafafa 0%, #ffffff 100%);
}

/* Responsive */
@media (max-width: 960px) {
  .dispute-container {
    padding: 16px;
  }

  .action-bar {
    padding: 16px !important;
  }

  .action-bar > div {
    flex-direction: column;
    gap: 12px !important;
  }

  .pdf-info-section {
    padding: 24px;
  }

  .pdf-actions {
    flex-direction: column;
    width: 100%;
  }

  .pdf-actions .v-btn {
    width: 100%;
  }
}

@media (max-width: 600px) {
  .file-card-header,
  .action-bar {
    padding: 16px !important;
  }

  .custom-table :deep(thead th),
  .custom-table :deep(tbody td) {
    padding: 10px 8px !important;
    font-size: 0.875rem;
  }
}

/* Animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.file-card,
.data-table-card {
  animation: fadeIn 0.5s ease-out;
}
</style>