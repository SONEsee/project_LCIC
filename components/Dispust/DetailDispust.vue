// ຟັງຊັນສຳລັບປ່ຽນວິທີການສະແດງ PDF
function changeViewer(type) {
  viewerType.value = type;
  console.log(`Switched to ${type} viewer`);
}.pdf-viewer-controls {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(255, 255, 255, 0.8);
  padding: 8px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 10;
}// ແປງຈາກພັດທະນາທ້ອງຖິ່ນໄປຫາພັດທະນາຕົວຈິງ
function getAPIHost() {
  // ຖ້າຮູ້ host ທີ່ແນ່ນອນຂອງ API, ສາມາດກຳນົດໄດ້ທີ່ນີ້
  const hosts = {
    'localhost:3001': 'http://127.0.0.1:8000',  // ພັດທະນາທ້ອງຖິ່ນ
    'localhost': 'http://127.0.0.1:8000',      // ສຳຮອງ
    'dev.example.com': 'https://api.dev.example.com', // ທົດສອບ
    'www.example.com': 'https://api.example.com',    // ຕົວຈິງ
    // ເພີ່ມ host ອື່ນໆຕາມຕ້ອງການ
  };
  
  if (typeof window !== 'undefined' && window.location && window.location.host) {
    const currentHost = window.location.host;
    if (hosts[currentHost]) {
      return hosts[currentHost];
    }
  }
  
  // ຄ່າເລີ່ມຕົ້ນຖ້າບໍ່ມີການກຳນົດ
  return 'http://127.0.0.1:8000';
}.pdf-object {
  width: 100%;
  height: 100%;
}

.pdf-fallback-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 24px;
  text-align: center;
  line-height: 1.5;
}

.pdf-fallback-message a {
  display: inline-block;
  margin-top: 16px;
  color: #1976d2;
  text-decoration: none;
  padding: 8px 16px;
  background-color: #e3f2fd;
  border-radius: 4px;
  font-weight: 500;
}<script setup lang="ts">
import { useRequesDispustStore } from "~/stores/requesdispust";
import axios from "~/helpers/axios";
import { useUserData } from "~/composables/useUserData";
import { ref, computed, onMounted, watch } from "vue";

const { user, userId, isAdmin, isLoggedIn } = useUserData();
const DispustStore = useRequesDispustStore();
const imagepath = ref("");
const showPdfViewer = ref(false);
const pdfUrl = ref("");
const isLoading = ref(false);
const isFallbackMode = ref(false);
const pdfObjectUrl = ref("");
const viewerType = ref("iframe"); // ເລີ່ມຕົ້ນໃຊ້ iframe viewer
const useEmbedViewer = computed(() => viewerType.value === "embed");
const useObjectViewer = computed(() => viewerType.value === "object");

// ປັບປຸງການຈັດການຂໍ້ມູນໃຫ້ມີຄວາມສອດຄ່ອງກັນ
const dataDispust = computed(() => {
  const data = DispustStore.response_dispust_data_edit;
  return Array.isArray(data) ? data : data ? [data] : [];
});

const dispustData = computed(() => {
  const data = DispustStore.response_data_dispust?.items;
  return Array.isArray(data) ? data : data ? [data] : [];
});

const fileUrl = computed(() => {
  if (!dispustData.value.length || !dispustData.value[0]?.image_url) return "";
  
  // ແນ່ໃຈວ່າ URL ຖືກຕ້ອງສຳລັບຟາຍທີ່ມີອັກຂະລະພິເສດ
  let imageUrl = dispustData.value[0]?.image_url || "";
  
  // ເຮັດໃຫ້ຄາດເດົາວ່າກຳລັງຊີ້ໄປທີ່ host ເດຽວກັນຖ້າໃຊ້ path ເລີ່ມຕົ້ນດ້ວຍ //
  if (imageUrl.startsWith('//')) {
    const apiHost = getAPIHost();
    imageUrl = apiHost + imageUrl.substring(1);
    return imageUrl;
  }
  
  // ຖ້າ URL ເລີ່ມຕົ້ນດ້ວຍ / ແລ້ວໃຫ້ໃຊ້ baseURL
  if (imageUrl.startsWith('/')) {
    // ຖ້າ imagepath ວ່າງເປົ່າ, ໃຫ້ໃຊ້ API host
    if (!imagepath.value) {
      const apiHost = getAPIHost();
      return `${apiHost}${imageUrl}`;
    }
    
    // ແນ່ໃຈວ່າ baseURL ບໍ່ມີ / ຢູ່ທ້າຍ
    const base = (imagepath.value.endsWith('/')) 
      ? imagepath.value.slice(0, -1) 
      : imagepath.value;
    return `${base}${imageUrl}`;
  }
  
  // ຖ້າເປັນ URL ທີ່ສົມບູນແລ້ວ
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // ຖ້າບໍ່ມີການລະບຸ scheme, ໃຫ້ເພີ່ມ API host
  const apiHost = getAPIHost();
  return `${apiHost}/${imageUrl}`;
});

const fileType = computed(() => {
  if (!fileUrl.value) return "";
  const extension = fileUrl.value.split('.').pop()?.toLowerCase();
  return extension || "";
});

const isPdf = computed(() => {
  return fileType.value === 'pdf';
});

const requese = DispustStore.data_edit_filter.query;
const rout = useRoute();
const id_dispust = rout.query.dispust_confirm as string;

// ຟັງຊັນສຳລັບການປ່ຽນຈຳນວນລາຍການຕໍ່ໜ້າ
async function onSelectionChange(params: number) {
  requese.page_size = params;
  await DispustStore.getDataDispustEdit();
}

// ຟັງຊັນສຳລັບການປ່ຽນໜ້າ
async function onPagechange(params: number) {
  requese.page = params;
  await DispustStore.getDataDispustEdit();
}

// ຟັງຊັນເປີດຟາຍ PDF ແບບປອດໄພ
function openPdfViewer() {
  if (isPdf.value && fileUrl.value) {
    pdfUrl.value = ""; // ລ້າງຄ່າ pdfUrl ກ່ອນ ເພື່ອໃຫ້ loading ສະແດງ
    showPdfViewer.value = true;
    
    // ລົງທະບຽນການຮ້ອງຂໍ PDF ດ້ວຍການໃຊ້ timeout ເພື່ອໃຫ້ dialog ສະແດງກ່ອນ
    setTimeout(() => {
      try {
        // ເປີດ PDF ໂດຍກົງໂດຍບໍ່ໃຊ້ fetch API
        // ວິທີນີ້ຈະຫຼີກລ່ຽງບັນຫາ CORS ແລະ postMessage
        pdfUrl.value = fileUrl.value;
        
        // ທົດລອງວິທີການເບິ່ງຕ່າງໆຕາມລຳດັບ
        // ຈົນກວ່າຈະພົບວິທີທີ່ເຮັດວຽກໄດ້
        if (viewerType.value === "iframe") {
          console.log("Using iframe PDF viewer");
        } else if (viewerType.value === "embed") {
          console.log("Using embed PDF viewer");
        } else if (viewerType.value === "object") {
          console.log("Using object PDF viewer");
        }
      } catch (error) {
        console.error('Error setting PDF URL:', error);
        pdfUrl.value = fileUrl.value;
      }
    }, 300);
  }
}

// ຟັງຊັນປິດຟາຍ PDF ແລະ ທຳຄວາມສະອາດຊັບພະຍາກອນ
function closePdfViewer() {
  showPdfViewer.value = false;
  
  // ທຳຄວາມສະອາດ object URL ເພື່ອປ້ອງກັນການຮົ່ວໄຫຼຂອງໜ່ວຍຄວາມຈຳ
  if (pdfObjectUrl.value) {
    URL.revokeObjectURL(pdfObjectUrl.value);
    pdfObjectUrl.value = "";
  }
}

// ຕິດຕາມການປ່ຽນແປງຂອງ fileUrl
watch(fileUrl, (newUrl) => {
  if (newUrl && isPdf.value) {
    pdfUrl.value = newUrl;
  }
});

onMounted(() => {
  imagepath.value = axios.defaults.baseURL || "";
  
  // ກຳນົດຄ່າເລີ່ມຕົ້ນສຳລັບການຄົ້ນຫາຂໍ້ມູນ
  if (userId.value) {
    DispustStore.data_filter_dispust.query.bnk_code = userId.value;
  }
  
  if (id_dispust) {
    DispustStore.data_edit_filter.query.confirm_dispust_id = id_dispust;
    DispustStore.data_filter_dispust.query.id_disput_loan = id_dispust;
  }
  
  // ດຶງຂໍ້ມູນເມື່ອ component ຖືກ mount
  isLoading.value = true;
  Promise.all([
    DispustStore.getDataDispustEdit(),
    DispustStore.getDataDispust()
  ]).finally(() => {
    isLoading.value = false;
    
    // ທົດສອບວ່າສາມາດເຂົ້າເຖິງໄຟລ໌ໄດ້ຫຼືບໍ່
    if (dispustData.value.length && dispustData.value[0]?.image_url && isPdf.value) {
      console.log('PDF URL:', fileUrl.value);
    }
  });
});
</script>

<template>
  <div class="dispute-container">
    <div v-if="isLoading" class="loading-container">
      <v-progress-circular indeterminate color="primary" />
      <span class="ml-3">ກຳລັງໂຫຼດຂໍ້ມູນ...</span>
    </div>

    <template v-else>
      <!-- ສ່ວນສະແດງຟາຍ (ຮູບພາບ ຫຼື PDF) -->
      <div v-if="fileUrl" class="file-preview-container">
        <div class="file-header">
          <h3>ຟາຍເອກະສານ</h3>
          <span class="file-type">{{ fileType.toUpperCase() }}</span>
        </div>
        
        <!-- ສະແດງຮູບພາບຖ້າບໍ່ແມ່ນ PDF -->
        <div v-if="!isPdf" class="image-preview-container">
          <img 
            :src="fileUrl" 
            alt="Dispute Image"
            class="preview-image"
          />
        </div>
        
        <!-- ສະແດງປຸ່ມເປີດ PDF ຖ້າເປັນຟາຍ PDF -->
        <div v-else class="pdf-preview-container">
          <div class="pdf-icon">
            <v-icon size="64">mdi-file-pdf-box</v-icon>
          </div>
          <span class="pdf-filename">
            {{ dispustData[0]?.image_url?.split('/').pop()?.replace(/%E0%B8%/g, '') || 'ເອກະສານ PDF' }}
          </span>
          <div class="pdf-actions mt-3">
            <v-btn 
              color="primary" 
              class="mr-2" 
              @click="openPdfViewer"
            >
              <v-icon left>mdi-eye</v-icon>
              ເປີດເບິ່ງເອກະສານ
            </v-btn>
            <v-btn 
              color="secondary" 
              :href="fileUrl" 
              target="_blank"
              download
            >
              <v-icon left>mdi-download</v-icon>
              ດາວໂຫຼດ
            </v-btn>
          </div>
        </div>
      </div>
      
      <!-- ໃຊ້ component GloBalGlobalFilePreview ສຳລັບການສະແດງຟາຍ -->
      <GloBalGlobalFilePreview
        v-if="fileUrl"
        :src="dispustData[0]?.image_url || ''"
        size="medium"
        show-preview
        show-file-name
        @click="isPdf && openPdfViewer()"
      />
      
      <!-- PDF Viewer Modal -->
      <v-dialog
        v-model="showPdfViewer"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
      >
        <v-card>
          <v-toolbar dark color="primary">
            <v-btn icon dark @click="closePdfViewer">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>
              {{ dispustData[0]?.image_url?.split('/').pop()?.replace(/%E0%B8%/g, '') || 'ເອກະສານ PDF' }}
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn 
              icon 
              dark 
              :href="pdfUrl" 
              target="_blank" 
              title="ດາວໂຫຼດ"
              download
            >
              <v-icon>mdi-download</v-icon>
            </v-btn>
            <v-btn 
              icon 
              dark 
              :href="pdfUrl" 
              target="_blank" 
              title="ເປີດໃນແຖບໃໝ່"
              rel="noopener noreferrer"
            >
              <v-icon>mdi-open-in-new</v-icon>
            </v-btn>
          </v-toolbar>
          
          <div class="pdf-container">
            <iframe 
              :src="pdfUrl" 
              width="100%" 
              height="100%" 
              frameborder="0"
              sandbox="allow-scripts allow-same-origin allow-forms"
              title="PDF Viewer"
              type="application/pdf"
              v-if="pdfUrl"
            ></iframe>
            <div v-else class="pdf-loading">
              <v-progress-circular indeterminate color="primary" />
              <span class="ml-3">ກຳລັງໂຫຼດເອກະສານ PDF...</span>
            </div>
          </div>
        </v-card>
      </v-dialog>
      
      <!-- ຕາຕະລາງສຳລັບສະແດງຂໍ້ມູນການໂຕ້ແຍ້ງ -->
      <v-data-table
        v-if="dataDispust.length && dataDispust[0]?.disputes"
        :items="dataDispust[0]?.disputes"
        :items-per-page="requese.page_size"
        class="mt-4"
      >
        <!-- ສະແດງຂໍ້ມູນຢູ່ສ່ວນລຸ່ມຂອງຕາຕະລາງ -->
        <template v-slot:bottom>
          <GloBalTablePaginations
            :page="requese.page"
            :limit="requese.page_size"
            :totalpage="DispustStore.response_dispust_data_edit?.pagination.total_pages || 0"
            @onPagechange="onPagechange"
            @onSelectionChange="onSelectionChange"
          />
        </template>
      </v-data-table>
      
      <!-- ສະແດງຂໍ້ຄວາມເມື່ອບໍ່ມີຂໍ້ມູນ -->
      <div v-if="!dataDispust.length || !dataDispust[0]?.disputes" class="no-data-message">
        ບໍ່ມີຂໍ້ມູນການໂຕ້ແຍ້ງທີ່ຈະສະແດງ
      </div>
    </template>
  </div>
</template>

<style scoped>
.dispute-container {
  padding: 16px;
}

.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}

.file-preview-container {
  margin-bottom: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 16px;
  max-width: 100%;
}

.file-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.file-type {
  background-color: #f0f0f0;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: bold;
}

.image-preview-container {
  max-width: 100%;
  overflow: hidden;
}

.preview-image {
  max-width: 100%;
  height: auto;
}

.pdf-preview-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.pdf-icon {
  color: #d32f2f;
  margin-bottom: 16px;
}

.pdf-filename {
  font-size: 0.9rem;
  color: #555;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 16px;
  text-align: center;
}

.pdf-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}

.pdf-container {
  height: calc(100vh - 64px);
  width: 100%;
  overflow: hidden;
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
  justify-content: center;
  padding: 24px;
}

.no-data-message {
  padding: 24px;
  text-align: center;
  color: #666;
  background-color: #f9f9f9;
  border-radius: 4px;
  border: 1px dashed #ddd;
  margin-top: 16px;
}
</style>