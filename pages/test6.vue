<template>
  <v-container>
    <v-col cols="12">
      <v-row>
        <v-col cols="12"></v-col>
      </v-row>
    </v-col>
    <v-file-input
      v-model="files"
      :show-size="1000"
      color="deep-purple-accent-4"
      label="File input"
      placeholder="Select your files"
      prepend-icon="mdi-camera"
      variant="outlined"
      counter
      multiple
      @change="uploadFiles"
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
            +{{ files.length - 2 }} File(s)
          </span>
        </template>
      </template>
    </v-file-input>
    <v-btn color="primary" @click="uploadFiles">Upload</v-btn>
    <v-row>
      <v-col v-for="collateral in collaterals" :key="collateral.id" cols="12" md="4">
        <v-card >
          <v-img :src="`http://192.168.45.56:8000/${collateral.image}`" aspect-ratio="1.75"></v-img>
          <v-card-title>{{ collateral.filename }}</v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import axios from "axios";

export default defineComponent({
  setup() {
    const files = ref<File[]>([]);
    const collaterals = ref([]);  

    const uploadFiles = async () => {
      const formData = new FormData();

      files.value.forEach((file) => {
        formData.append("image", file); 
      });

      try {
        const response = await axios.post(
          "http://192.168.45.56:8000/api/api/upload_image/",  
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        console.log(response.data);
      } catch (error) {
        console.error(error.response ? error.response.data : error.message);
      }
    };

    const fetchCollaterals = async () => {
      try {
        const response = await axios.get('http://192.168.45.56:8000/api/api/get_collaterals/');
        collaterals.value = response.data;
      } catch (error) {
        console.error(error.response ? error.response.data : error.message);
      }
    };

    onMounted(() => {
      fetchCollaterals();
    });

    return {
      files,
      uploadFiles,
      collaterals  
    };
  },
});

</script>
