
<script setup lang="ts">
import { ref, computed } from 'vue';

interface Props {
  modelValue?: File | File[] | null;
  multiple?: boolean;
  accept?: string;
  maxSize?: number; 
  label?: string;
  placeholder?: string;
  variant?: 'outlined' | 'filled' | 'underlined' | 'plain' | 'solo';
  disabled?: boolean;
  clearable?: boolean;
  showSize?: boolean;
  chips?: boolean;
  color?: string;
}

const props = withDefaults(defineProps<Props>(), {
  multiple: false,
  variant: 'outlined',
  disabled: false,
  clearable: true,
  showSize: true,
  chips: false,
  color: 'primary'
});

const emit = defineEmits<{
  'update:modelValue': [value: File | File[] | null];
  'change': [files: File[]];
  'error': [message: string];
}>();

const fileInput = ref<HTMLInputElement | null>(null);
const files = ref<File[]>([]);
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

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  processFiles(target.files);
};

const handleDrop = (event: DragEvent) => {
  isDragging.value = false;
  processFiles(event.dataTransfer?.files);
};

const processFiles = (fileList: FileList | null | undefined) => {
  if (!fileList) return;

  const newFiles = Array.from(fileList);
  
  
  if (props.maxSize) {
    const oversized = newFiles.filter(f => f.size > props.maxSize!);
    if (oversized.length > 0) {
      emit('error', `ໄຟລ໌ບາງອັນມີຂະໜາດໃຫຍ່ເກີນ ${formatFileSize(props.maxSize)}`);
      return;
    }
  }

  if (props.multiple) {
    files.value = [...files.value, ...newFiles];
    emit('update:modelValue', files.value);
  } else {
    files.value = [newFiles[0]];
    emit('update:modelValue', newFiles[0]);
  }
  
  emit('change', newFiles);
};

const removeFile = (index: number) => {
  files.value.splice(index, 1);
  
  if (props.multiple) {
    emit('update:modelValue', files.value);
  } else {
    emit('update:modelValue', files.value.length > 0 ? files.value[0] : null);
  }
};

const clearFiles = () => {
  files.value = [];
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
  <div class="v-file-upload">
    
    <div
      class="drop-zone"
      :class="{ 
        'dragging': isDragging,
        'disabled': disabled 
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
        :accept="accept"
        :disabled="disabled"
        @change="handleFileSelect"
        style="display: none"
      />

      <div class="upload-content" v-if="fileList.length === 0">
        <v-icon size="48" :color="color">mdi-cloud-upload</v-icon>
        <p class="text-h6 mt-2">{{ label || 'ລາກໄຟລ໌ມາວາງທີ່ນີ້' }}</p>
        <p class="text-caption">{{ placeholder || 'ຫຼື ກົດເພື່ອເລືອກໄຟລ໌' }}</p>
      </div>

      
      <div v-else class="file-list">
        <v-chip
          v-for="(file, index) in fileList"
          :key="index"
          :color="color"
          closable
          @click:close="removeFile(index)"
          class="ma-1"
        >
          <v-icon start>mdi-file</v-icon>
          {{ file.name }}
          <span v-if="showSize" class="ml-2 text-caption">
            ({{ formatFileSize(file.size) }})
          </span>
        </v-chip>
      </div>
    </div>

    
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
.v-file-upload {
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

.file-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}
</style>