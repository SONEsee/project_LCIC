<template>
  
  <div>
    <input type="file" ref="fileInput" @change="handleFileChange" multiple>
    <button @click="uploadFiles">Upload Files</button>
    <div v-if="message">{{ message }}</div>
    <div v-if="error">{{ error }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';

export default defineComponent({
  data() {
    return {
      files: [] as File[],
      message: '',
      error: '',
    };
  },
  methods: {
    handleFileChange(event: Event) {
      const target = event.target as HTMLInputElement;
      if (target.files) {
        this.files = Array.from(target.files);
      }
    },
    async uploadFiles() {
      try {
        const formData = new FormData();
        this.files.forEach(file => {
          formData.append('files', file);
        });
        const response = await axios.post('http://127.0.0.1:35729/api/upload_files/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        this.message = response.data.message;
        this.error = '';
      } catch (error) {
        this.error = error.response?.data?.error || 'Error uploading files.';
        this.message = '';
      }
    }
  }
});
</script>
