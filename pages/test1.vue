<!-- <template>
  <v-container>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-card class="pa-3">
        <v-card-title>
          <span class="headline">ອັບໂຫລດໄຟລ໌ JSON ແລະ XML ເທົ່ານັ້ນ</span>
        </v-card-title>
        <v-card-text>
          <v-file-input
            v-model="files"
            :rules="fileRules"
            accept=".json,.xml"
            color="deep-purple-accent-4"
            label="ເລືອກໄຟລ໌ທີ່ທ່ານຕ້ອງການທີ່ຈະອັບໂຫລດ"
            placeholder="ເລືອກໄຟລ໌ທີ່ທ່ານຕ້ອງການທີ່ຈະອັບໂຫລດ"
            prepend-icon="mdi-paperclip"
            variant="outlined"
            counter
            multiple
          >
            <template v-slot:selection="{ fileNames }">
              <template v-for="(fileName, index) in fileNames" :key="fileName">
                <v-chip
                  v-if="index < 2"
                  class="me-2"
                  color="deep-purple-accent-4"
                  size="small"
                  label
                >
                  {{ fileName }}
                </v-chip>
                <span
                  v-else-if="index === 2"
                  class="text-overline text-grey-darken-3 mx-2"
                >
                  +{{ files.length - 2 }} File
                </span>
              </template>
            </template>
          </v-file-input>
        </v-card-text>
        <v-card-actions>
          <v-btn
            @click="uploadFiles"
            :disabled="!valid"
            color="white"
            class="bg-deep-purple-darken-1"
          >ອັບໂຫລດ File</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
    <v-card class="mt-3">
      <v-card-title>
        <span class="headline">ລາຍການທີ່ອັບໂດ</span>
      </v-card-title>
      <v-data-table :headers="headers" :items="uploadedFiles" item-key="name">
        <template v-slot:item.actions="{ item }">
          <v-icon small @click="editFile(item)">mdi-pencil</v-icon>
          <v-icon small @click="deleteFile(item)">mdi-delete</v-icon>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';

export default defineComponent({

  
  data() {
    definePageMeta({
  layout: "backend",
});

useHead({
  title: "Search",
  meta: [
    {
      name: "keywords",
      content: "Report, Nuxt 3, Backend",
    },
    {
      name: "Description",
      content: "Report Nuxt 3, IT Genius Engineering",
    },
  ],
});

    return {
      valid: true,
      files: [] as File[],
      uploadedFiles: [] as any[],
      message: '',
      error: '',
      headers: [
        { text: 'File Name', value: 'name' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      fileRules: [
        (v: File[]) => !!v || 'File is required',
        (v: File[]) => v.length <= 5 || 'You can upload up to 5 files at a time',
      ],
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
        this.uploadedFiles = response.data.uploadedFiles; 
        this.message = response.data.message;
        Swal.fire({
          title: 'ສຳເລັດ',
          text: this.message,
          icon: 'success',
          confirmButtonText: 'ຕົກລົງ'
        });
      } catch (error) {
        this.error = error.response?.data?.error || 'ການອັບໂຫຼດຂໍ້ມູນເກີດມີຂໍ້ຜິດພາດ.';
        Swal.fire({
          title: 'ເກີດຂໍ້ຜິດພາດ',
          text: this.error,
          icon: 'error',
          confirmButtonText: 'ຕົກລົງ'
        });
      }
    },
    editFile(item: any) {
      // Edit file logic
    },
    deleteFile(item: any) {
      // Delete file logic
    }
  }
});
</script> -->


<template>
  <v-container>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-card class="pa-3">
        <v-card-title>
          <span class="headline">ອັບໂຫລດໄຟລ໌ JSON ແລະ XML ເທົ່ານັ້ນ</span>
        </v-card-title>
        <v-card-text>
          <v-file-input
            v-model="files"
            :rules="fileRules"
            accept=".json,.xml"
            color="deep-purple-accent-4"
            label="ເລືອກໄຟລ໌ທີ່ທ່ານຕ້ອງການທີ່ຈະອັບໂຫລດ"
            placeholder="ເລືອກໄຟລ໌ທີ່ທ່ານຕ້ອງການທີ່ຈະອັບໂຫລດ"
            prepend-icon="mdi-paperclip"
            variant="outlined"
            counter
            multiple
          >
            <template v-slot:selection="{ fileNames }">
              <template v-for="(fileName, index) in fileNames" :key="fileName">
                <v-chip
                  v-if="index < 2"
                  class="me-2"
                  color="deep-purple-accent-4"
                  size="small"
                  label
                >
                  {{ fileName }}
                </v-chip>
                <span
                  v-else-if="index === 2"
                  class="text-overline text-grey-darken-3 mx-2"
                >
                  +{{ files.length - 2 }} File
                </span>
              </template>
            </template>
          </v-file-input>
        </v-card-text>
        <v-card-actions>
          <v-btn
            @click="uploadFiles"
            :disabled="!valid || files.length === 0"
            color="white"
            class="bg-deep-purple-darken-1"
          >ອັບໂຫລດ File</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
    <v-card class="mt-3">
      <v-card-title>
        <span class="headline">ລາຍການທີ່ອັບໂດ</span>
      </v-card-title>
      <v-data-table :headers="headers" :items="uploadedFiles" item-key="name">
        <template v-slot:item.actions="{ item }">
          <v-icon small @click="editFile(item)">mdi-pencil</v-icon>
          <v-icon small @click="deleteFile(item)">mdi-delete</v-icon>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';

export default defineComponent({
  data() {
    definePageMeta({
      layout: "backend",
    });

    useHead({
      title: "Search",
      meta: [
        {
          name: "keywords",
          content: "Report, Nuxt 3, Backend",
        },
        {
          name: "Description",
          content: "Report Nuxt 3, IT Genius Engineering",
        },
      ],
    });

    return {
      valid: true,
      files: [] as File[],
      uploadedFiles: [] as any[],
      message: '',
      error: '',
      headers: [
        { text: 'File Name', value: 'name' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      fileRules: [
        (v: File[]) => !!v || 'File is required',
        (v: File[]) => v.length <= 5 || 'You can upload up to 5 files at a time',
      ],
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
        this.uploadedFiles = response.data.uploadedFiles; 
        this.message = response.data.message;
        Swal.fire({
          title: 'ສຳເລັດ',
          text: this.message,
          icon: 'success',
          confirmButtonText: 'ຕົກລົງ'
        });
      } catch (error) {
        this.error = error.response?.data?.error || 'ການອັບໂຫຼດຂໍ້ມູນເກີດມີຂໍ້ຜິດພາດ.';
        Swal.fire({
          title: 'ເກີດຂໍ້ຜິດພາດ',
          text: this.error,
          icon: 'error',
          confirmButtonText: 'ຕົກລົງ'
        });
      }
    },
    editFile(item: any) {
      // Edit file logic
    },
    deleteFile(item: any) {
      // Delete file logic
    }
  }
});
</script>
