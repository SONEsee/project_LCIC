<template>
  <div>
    <h1>Upload JSON File</h1>
    <form @submit.prevent="handleFileUpload">
      <input type="file" @change="handleFileChange" />
      <button type="submit">Upload</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { uploadFile } from '@/services/uploadService';

export default defineComponent({
  data() {
    return {
      file: null as File | null,
    };
  },
  methods: {
    handleFileChange(event: Event) {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        this.file = target.files[0];
      }
    },
    async handleFileUpload() {
      if (!this.file) return;

      const formData = new FormData();
      formData.append('file', this.file);
      formData.append('name', this.file.name);

      try {
        await uploadFile(formData);
        alert('File uploaded successfully');
      } catch (error) {
        alert(`Failed to upload file: ${error.message}`);
      }
    },
  },
});
</script>

<style scoped>
/* Add some styles if needed */
</style>
