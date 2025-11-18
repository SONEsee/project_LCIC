<script setup lang="ts">
import { ref, computed, watch } from 'vue';

interface Props {
  modelValue?: File | File[] | null;
  multiple?: boolean;
  maxSize?: number; 
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  clearable?: boolean;
  showSize?: boolean;
  color?: string;
  maxWidth?: number;
  maxHeight?: number;
}

const props = withDefaults(defineProps<Props>(), {
  multiple: false,
  disabled: false,
  clearable: true,
  showSize: true,
  color: 'primary',
  maxWidth: 200,
  maxHeight: 200
});

const emit = defineEmits<{
  'update:modelValue': [value: File | File[] | null];
  'change': [files: File[]];
  'error': [message: string];
}>();

const fileInput = ref<HTMLInputElement | null>(null);
const files = ref<File[]>([]);
const imagePreviews = ref<string[]>([]);
const isDragging = ref(false);

const fileList = computed(() => {
  if (props.multiple) {
    return files.value;
  }
  return files.value.length > 0 ? [files.value[0]] : [];
});

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

const createImagePreview = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target?.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const handleFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  await processFiles(target.files);
};

const handleDrop = async (event: DragEvent) => {
  isDragging.value = false;
  await processFiles(event.dataTransfer?.files);
};

const processFiles = async (fileList: FileList | null | undefined) => {
  if (!fileList) return;

  const newFiles = Array.from(fileList);
  
  
  const imageFiles = newFiles.filter(f => f.type.startsWith('image/'));
  if (imageFiles.length !== newFiles.length) {
    emit('error', 'ກະລຸນາເລືອກສະເພາະໄຟລ໌ຮູບພາບເທົ່ານັ້ນ');
    return;
  }
  
  
  if (props.maxSize) {
    const oversized = newFiles.filter(f => f.size > props.maxSize!);
    if (oversized.length > 0) {
      emit('error', `ໄຟລ໌ບາງອັນມີຂະໜາດໃຫຍ່ເກີນ ${formatFileSize(props.maxSize)}`);
      return;
    }
  }

 
  const newPreviews = await Promise.all(
    imageFiles.map(file => createImagePreview(file))
  );

  if (props.multiple) {
    files.value = [...files.value, ...imageFiles];
    imagePreviews.value = [...imagePreviews.value, ...newPreviews];
    emit('update:modelValue', files.value);
  } else {
    files.value = [imageFiles[0]];
    imagePreviews.value = [newPreviews[0]];
    emit('update:modelValue', imageFiles[0]);
  }
  
  emit('change', imageFiles);
};

const removeFile = (index: number) => {
  files.value.splice(index, 1);
  imagePreviews.value.splice(index, 1);
  
  if (props.multiple) {
    emit('update:modelValue', files.value);
  } else {
    emit('update:modelValue', files.value.length > 0 ? files.value[0] : null);
  }
};

const clearFiles = () => {
  files.value = [];
  imagePreviews.value = [];
  emit('update:modelValue', null);
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

const openFileDialog = () => {
  fileInput.value?.click();
};

defineExpose({
  clearFiles,
  openFileDialog
});
</script>

<template>
  <div class="v-image-upload">
    
    <div
      class="drop-zone"
      :class="{ 
        'dragging': isDragging,
        'disabled': disabled,
        'has-images': fileList.length > 0
      }"
      @drop.prevent="handleDrop"
      @dragover.prevent="isDragging = true"
      @dragleave="isDragging = false"
      @click="openFileDialog"
    >
      <input
        ref="fileInput"
        type="file"
        :multiple="multiple"
        accept="image/*"
        :disabled="disabled"
        @change="handleFileSelect"
        style="display: none"
      />

     
      <div class="upload-content" v-if="fileList.length === 0">
        <v-icon size="48" :color="color">mdi-image-plus</v-icon>
        <p class="text-h6 mt-2">{{ label || 'ເລືອກຮູບພາບ' }}</p>
        <p class="text-caption">{{ placeholder || 'ລາກຮູບມາວາງທີ່ນີ້ ຫຼື ກົດເພື່ອເລືອກ' }}</p>
      </div>

      
      <div v-else class="image-preview-container">
        <div 
          v-for="(preview, index) in imagePreviews"
          :key="index"
          class="image-preview-item"
        >
          <div class="image-wrapper">
            <img 
              :src="preview" 
              :alt="fileList[index].name"
            />
            <div class="image-overlay">
              <v-btn
                icon
                size="small"
                color="error"
                @click.stop="removeFile(index)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </div>
          </div>
          
          <div class="image-info">
            <p class="text-caption text-truncate">{{ fileList[index].name }}</p>
            <p v-if="showSize" class="text-caption text-grey">
              {{ formatFileSize(fileList[index].size) }}
            </p>
          </div>
        </div>
        
        
        <div 
          v-if="multiple" 
          class="add-more-button"
          @click.stop="openFileDialog"
        >
          <v-icon size="32" :color="color">mdi-plus-circle</v-icon>
          <p class="text-caption mt-1">ເພີ່ມຮູບ</p>
        </div>
      </div>
    </div>

    <!-- Clear All Button -->
    <v-btn
      v-if="clearable && fileList.length > 0"
      @click.stop="clearFiles"
      color="error"
      variant="text"
      size="small"
      class="mt-2"
    >
      <v-icon start>mdi-delete</v-icon>
      ລຶບທັງໝົດ
    </v-btn>
  </div>
</template>

<style scoped>
.v-image-upload {
  width: 100%;
}

.drop-zone {
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 40px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #fafafa;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.drop-zone.has-images {
  padding: 20px;
  min-height: 400px;
}

.drop-zone:hover:not(.disabled) {
  border-color: #1976d2;
  background-color: #f5f5f5;
}

.drop-zone.dragging {
  border-color: #1976d2;
  background-color: #e3f2fd;
  transform: scale(1.02);
}

.drop-zone.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.upload-content {
  pointer-events: none;
}

.image-preview-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
  width: 100%;
}

.image-preview-container:has(.image-preview-item:only-child) {
  display: block;
}

.image-preview-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.image-preview-container:has(.image-preview-item:only-child) .image-preview-item {
  width: 100%;
}

.image-wrapper {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.2s;
  width: 100%;
  max-height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
}

.image-wrapper:hover {
  transform: scale(1.02);
}

.image-wrapper img {
  display: block;
  width: 100%;
  height: auto;
  max-height: 500px;
  object-fit: contain;
}

.image-preview-container:not(:has(.add-more-button)) .image-wrapper img {
  max-width: 100%;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
}

.image-wrapper:hover .image-overlay {
  opacity: 1;
}

.image-info {
  max-width: 200px;
  text-align: center;
}

.image-preview-container:has(.image-preview-item:only-child) .image-info {
  max-width: 100%;
}

.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.add-more-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 20px;
  min-width: 120px;
  min-height: 120px;
  cursor: pointer;
  transition: all 0.2s;
}

.add-more-button:hover {
  border-color: #1976d2;
  background-color: #f5f5f5;
}
</style>