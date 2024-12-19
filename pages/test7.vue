<template>
  <div>
    <v-col>
      <v-row>
        <v-col cols="12" md="5"
          ><v-file-input
            type="file"
            accept=".json"
            @change="handleFileUpload"
            variant="outlined"
            density="compact"
            width="100%"
        /></v-col>
        <v-col cols="12" md="1"
          ><v-btn @click="uploadFile" class="bg-primary">ອັບໂຫຼດ</v-btn></v-col
        >
      </v-row>
    </v-col>
    <div v-if="results.length">
      <h3>Results</h3>
      <table>
        <thead>
          <tr>
            <th>lcicID</th>
            <th>com_enterprise_code</th>
            <th>Status</th>
            <th>Enterprise Name</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(result, index) in results" :key="index">
            <td>{{ result.lcicID }}</td>
            <td>{{ result.com_enterprise_code }}</td>
            <td>{{ result.status }}</td>
            <td>{{ result.enterpriseNameLao || "N/A" }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from "vue";

export default {
  setup() {
    const file = ref<File | null>(null);
    const results = ref<any[]>([]);

    const handleFileUpload = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.files?.length) {
        file.value = target.files[0];
      }
    };

    const uploadFile = async () => {
      if (!file.value) {
        alert("Please select a file first.");
        return;
      }

      const formData = new FormData();
      formData.append("file", file.value);

      try {
        const response = await fetch(
          "http://192.168.45.54:35729/api/api/upload-json/",
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await response.json();
        results.value = data.results || [];
      } catch (error) {
        console.error("Error uploading file:", error);
        alert("Upload failed. Please try again.");
      }
    };

    return { handleFileUpload, uploadFile, results };
  },
};
</script>
