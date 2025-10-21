
<script setup lang="ts">
import { useRequesDispustStore } from "~/stores/requesdispust";
import axios from "~/helpers/axios";
import { useUserData } from "~/composables/useUserData";
import { ref, computed, onMounted, watch } from "vue";
const config = useRuntimeConfig()
const { user, userId, isAdmin, isLoggedIn } = useUserData();
const DispustStore = useRequesDispustStore();
const imagepath = ref("");
const showPdfViewer = ref(false);
const pdfUrl = ref("");
const isLoading = ref(false);
const isFallbackMode = ref(false);
const pdfObjectUrl = ref("");
const viewerType = ref("iframe"); 
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
    console.warn('Cannot access runtimeConfig:', e);
  }
  

  if (axios.defaults.baseURL) {
    return axios.defaults.baseURL;
  }
  
 
  if (imagepath.value) {
    return imagepath.value;
  }
  

  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  

  return config.public.strapi.url;
};
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
  

  let imageUrl = dispustData.value[0]?.image_url || "";
  
 
  if (imageUrl.startsWith('//')) {
    const apiHost = getAPIHost();
    imageUrl = apiHost + imageUrl.substring(1);
    return imageUrl;
  }
  
 
  if (imageUrl.startsWith('/')) {
    
    if (!imagepath.value) {
      const apiHost = getAPIHost();
      return `${apiHost}${imageUrl}`;
    }
    
  
    const base = (imagepath.value.endsWith('/')) 
      ? imagepath.value.slice(0, -1) 
      : imagepath.value;
    return `${base}${imageUrl}`;
  }
  

  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  

  const apiHost = getAPIHost();
  return `${apiHost}/${imageUrl}`;
});
const hearder = [
  {title:"ລຳດັບ", value:"index"},
  {title:"ລະຫັດ ຂສລ", value:"LCIC_code"},
]
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

async function onSelectionChange(params: number) {
  requese.page_size = params;
  await DispustStore.getDataDispustEdit();
}

async function onPagechange(params: number) {
  requese.page = params;
  await DispustStore.getDataDispustEdit();
}

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
        console.error('Error setting PDF URL:', error);
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
    DispustStore.getDataDispustEdit(),
    DispustStore.getDataDispust()
  ]).finally(() => {
    isLoading.value = false;
    
 
    if (dispustData.value.length && dispustData.value[0]?.image_url && isPdf.value) {
      console.log('PDF URL:', fileUrl.value);
    }
  });
});
</script>

<template>
  <div class="dispute-container ">
    <div v-if="isLoading" class="loading-container">
      <v-progress-circular indeterminate color="primary" />
      <span class="ml-3">ກຳລັງໂຫຼດຂໍ້ມູນ...</span>
    </div >

    <template v-else class="">
     <div class="d-flex justify-center align-center " >
      <div v-if="fileUrl" class="file-preview-container ">
        <div class="file-header">
          <h3>ຟາຍເອກະສານ</h3>
          <span class="file-type">{{ fileType.toUpperCase() }}</span>
        </div>
        
   
        <div v-if="!isPdf" class="image-preview-container">
          <img 
            :src="fileUrl" 
            alt="Dispute Image"
            class="preview-image"
          />
        </div>
        
     
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
      </div>
     
      <GloBalGlobalFilePreview
        v-if="fileUrl"
        :src="dispustData[0]?.image_url || ''"
        size="medium"
        show-preview
        show-file-name
        @click="isPdf && openPdfViewer()"
      />
      
     
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
      <pre>{{ dataDispust[0]?.disputes }}</pre>
     
      <v-data-table
    
      density="compact"
        v-if="dataDispust.length && dataDispust[0]?.disputes"
        :items="dataDispust[0]?.disputes"
        :items-per-page="requese.page_size"
        class="mt-4"
      >
 
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
  min-height: 100px;
}

.file-preview-container {
  margin-bottom: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 16px;
  max-width: 70%;
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




