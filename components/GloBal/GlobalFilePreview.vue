
<script setup lang="ts">
import { ref, computed } from 'vue';
import { useImagePath } from '@/composables/useImagePath';
import axios from '~/helpers/axios';
interface Props {
  src: string;
  alt?: string;
  size?: 'small' | 'medium' | 'large';
  showPreview?: boolean;
  showFileName?: boolean;
  hoverPreview?: boolean; 
}

const props = withDefaults(defineProps<Props>(), {
  alt: 'File',
  size: 'medium',
  showPreview: true,
  showFileName: true,
  hoverPreview: true
});

const { getFileUrl, getFileType, getFileIcon, getFileColor, isImage, isPdf } = useImagePath();

const showDialog = ref(false);
const showHoverPreview = ref(false);
const imageError = ref(false);
const hoverTimeout = ref<NodeJS.Timeout | null>(null);

const fileUrl = computed(() => getFileUrl(props.src));
const fileType = computed(() => getFileType(props.src));
const fileIcon = computed(() => getFileIcon(props.src));
const fileColor = computed(() => getFileColor(props.src));
const fileName = computed(() => {
  const name = props.src.split('/').pop() || 'file';
  try {
    return decodeURIComponent(name);
  } catch {
    return name;
  }
});

const avatarSize = computed(() => {
  switch (props.size) {
    case 'small': return 32;
    case 'medium': return 40;
    case 'large': return 64;
    default: return 40;
  }
});

const handleImageError = () => {
  imageError.value = true;
};


const handleMouseEnter = () => {
  if (props.hoverPreview && (isImage(props.src) || isPdf(props.src))) {
   
    hoverTimeout.value = setTimeout(() => {
      showHoverPreview.value = true;
    }, 300);
  }
};

const handleMouseLeave = () => {
  
  if (hoverTimeout.value) {
    clearTimeout(hoverTimeout.value);
    hoverTimeout.value = null;
  }
  showHoverPreview.value = false;
};

const openPreview = (event: Event) => {
  event.preventDefault();
  event.stopPropagation();
  
  if (props.showPreview) {
    showDialog.value = true;
  }
};

const openInNewTab = (event?: Event) => {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  window.open(fileUrl.value, '_blank', 'noopener,noreferrer');
};

const downloadFile = async (event?: Event) => {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  
  try {
    const response = await fetch(fileUrl.value);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName.value;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Download failed:', error);
    openInNewTab();
  }
};
</script>

<template>
  <div class="file-preview-wrapper">
   
    <div 
      class="file-preview-container d-flex align-center" 
      @click.prevent="openPreview"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      role="button"
      tabindex="0"
    >
     
      <template v-if="isImage(src) && !imageError">
        <v-avatar :size="avatarSize" class="file-avatar">
          <v-img
            :src="fileUrl"
            :alt="alt"
            cover
            @error="handleImageError"
          >
            <template v-slot:placeholder>
              <div class="d-flex align-center justify-center fill-height">
                <v-progress-circular size="20" indeterminate color="grey" />
              </div>
            </template>
          </v-img>
        </v-avatar>
      </template>

     
      <template v-else-if="isPdf(src)">
        <div 
          class="pdf-badge"
          :style="{ 
            width: avatarSize + 'px', 
            height: avatarSize + 'px' 
          }"
        >
          <span class="pdf-text">PDF</span>
        </div>
      </template>

    
      <template v-else>
        <v-avatar :size="avatarSize" color="grey-lighten-3">
          <v-icon :color="fileColor" :size="avatarSize - 10">
            {{ fileIcon }}
          </v-icon>
        </v-avatar>
      </template>

     
      <span 
        v-if="showFileName" 
        class="file-name text-body-2 ml-2"
        :title="fileName"
      >
        {{ fileName }}
      </span>

      
      <Transition name="fade-scale">
        <div 
          v-if="showHoverPreview" 
          class="hover-preview-popup"
          @click.stop
        >
          <v-card class="preview-card" elevation="12">
        
            <div class="preview-header pa-2 d-flex justify-space-between align-center">
              <span class="text-caption font-weight-medium">{{ fileName }}</span>
              <div class="d-flex gap-1">
                <v-btn
                  icon
                  size="x-small"
                  variant="text"
                  @click.stop="openInNewTab"
                  title="ເປີດໃນແຖບໃໝ່"
                >
                  <v-icon size="16">mdi-open-in-new</v-icon>
                </v-btn>
                <v-btn
                  icon
                  size="x-small"
                  variant="text"
                  @click.stop="openPreview"
                  title="ເບິ່ງເຕັມຈໍ"
                >
                  <v-icon size="16">mdi-fullscreen</v-icon>
                </v-btn>
              </div>
            </div>

            <v-divider />

            <!-- Preview Content -->
            <div class="preview-content">
              <!-- ຮູບພາບ -->
              <template v-if="isImage(src)">
                <v-img
                  :src="fileUrl"
                  :alt="alt"
                  max-height="400"
                  max-width="500"
                  contain
                >
                  <template v-slot:placeholder>
                    <div class="d-flex align-center justify-center fill-height">
                      <v-progress-circular indeterminate color="primary" />
                    </div>
                  </template>
                  <template v-slot:error>
                    <div class="text-center pa-4">
                      <v-icon size="48" color="error">mdi-image-broken</v-icon>
                      <p class="text-caption mt-2">ບໍ່ສາມາດໂຫຼດຮູບໄດ້</p>
                    </div>
                  </template>
                </v-img>
              </template>

              <!-- PDF Preview -->
              <template v-else-if="isPdf(src)">
                <div class="pdf-preview-container">
                  <iframe
                    :src="fileUrl + '#view=FitH'"
                    class="pdf-preview-frame"
                    frameborder="0"
                    sandbox="allow-same-origin"
                  />
                  <div class="pdf-overlay">
                    <v-btn
                      color="primary"
                      @click.stop="openPreview"
                    >
                      <v-icon start>mdi-file-pdf-box</v-icon>
                      ເປີດ PDF
                    </v-btn>
                  </div>
                </div>
              </template>
            </div>
          </v-card>
        </div>
      </Transition>
    </div>

    <!-- Full Screen Dialog (ເກົ່າ) -->
    <v-dialog 
      v-model="showDialog" 
      max-width="1200px"
      scrollable
    >
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center bg-grey-lighten-4">
          <div class="d-flex align-center">
            <v-icon :color="fileColor" class="mr-2">{{ fileIcon }}</v-icon>
            <span class="text-h6">{{ fileName }}</span>
          </div>
          <div>
            <v-btn
              icon
              variant="text"
              size="small"
              @click.prevent="openInNewTab"
              title="ເປີດໃນແຖບໃໝ່"
            >
              <v-icon>mdi-open-in-new</v-icon>
            </v-btn>
            <v-btn
              icon
              variant="text"
              size="small"
              @click.prevent="downloadFile"
              title="ດາວໂຫຼດ"
            >
              <v-icon>mdi-download</v-icon>
            </v-btn>
            <v-btn
              icon
              variant="text"
              size="small"
              @click="showDialog = false"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>
        </v-card-title>

        <v-divider />

        <v-card-text class="pa-0" style="height: 80vh; overflow: auto;">
          <!-- ສະແດງຮູບພາບ -->
          <div v-if="isImage(src)" class="image-preview-container">
            <v-img
              :src="fileUrl"
              :alt="alt"
              contain
              max-height="75vh"
            >
              <template v-slot:placeholder>
                <div class="d-flex align-center justify-center fill-height">
                  <v-progress-circular indeterminate color="primary" />
                </div>
              </template>
            </v-img>
          </div>

          <!-- ສະແດງ PDF -->
          <div v-else-if="isPdf(src)" class="pdf-container">
            <iframe
              :src="fileUrl"
              class="pdf-viewer"
              frameborder="0"
              sandbox="allow-same-origin allow-scripts"
            />
          </div>

          <!-- ສະແດງໄຟລ໌ອື່ນໆ -->
          <div v-else class="document-preview">
            <v-icon size="100" :color="fileColor">{{ fileIcon }}</v-icon>
            <p class="text-h6 mt-4">{{ fileName }}</p>
            <div class="d-flex gap-2 mt-4">
              <v-btn color="primary" @click.prevent="openInNewTab">
                <v-icon start>mdi-open-in-new</v-icon>
                ເປີດໄຟລ໌
              </v-btn>
              <v-btn color="secondary" @click.prevent="downloadFile">
                <v-icon start>mdi-download</v-icon>
                ດາວໂຫຼດ
              </v-btn>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.file-preview-wrapper {
  display: inline-block;
  position: relative;
}

.file-preview-container {
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 8px;
  padding: 4px;
  position: relative;
}

.file-preview-container:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.file-avatar {
  border: 1px solid #e0e0e0;
}

.pdf-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #e53935 0%, #c62828 100%);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.pdf-text {
  color: white;
  font-weight: bold;
  font-size: 12px;
  letter-spacing: 1px;
}

.file-name {
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #424242;
}


.hover-preview-popup {
  position: fixed;
  z-index: 9999;
  pointer-events: auto;
  
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.preview-card {
  max-width: 550px;
  max-height: 500px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3) !important;
}

.preview-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.preview-content {
  padding: 0;
  background: #fafafa;
  max-height: 450px;
  overflow: auto;
}

.pdf-preview-container {
  position: relative;
  width: 500px;
  height: 400px;
  background: #525659;
}

.pdf-preview-frame {
  width: 100%;
  height: 100%;
  border: none;
  opacity: 0.5;
  filter: blur(2px);
}

.pdf-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(2px);
}


.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-scale-enter-from {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.9);
}

.fade-scale-leave-to {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.95);
}


.image-preview-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background: #fafafa;
  padding: 20px;
}

.pdf-container {
  width: 100%;
  height: 100%;
  background: #525659;
}

.pdf-viewer {
  width: 100%;
  height: 100%;
  border: none;
}

.document-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  padding: 40px;
}

.gap-1 {
  gap: 4px;
}

.gap-2 {
  gap: 8px;
}
</style>