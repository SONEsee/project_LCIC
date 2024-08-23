<!-- <template>
    <v-container>
      <div>
        <h1>ການອັບໂຫຼດຮູບພາບ</h1>
        <v-col cols="12">
          <v-file-input
            v-model="files"
            :show-size="1000"
            color="deep-purple-accent-4"
            label="ອັບໂຫຼດຮູບພາບ"
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
          <v-btn color="primary" @click="uploadFiles" class="ml-9">ອັບໂຫຼດ</v-btn>
        </v-col>
      </div>
  
      <v-table class=" mt-5">
        <thead>
          <tr class="bg-indigo-lighten-1">
            <th>ລຳດັບ</th>
            <th>ຊື່ຮູບພາບ</th>
            <th>ທີ່ຢູ່ຮູບພາບ</th>
            <th>ສະຖານະ</th>
            <th>ລາຍລະອຽດ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="collateral in collaterals" :key="collateral.id">
            <td>{{ collateral.id }}</td>
            <td>{{ collateral.filename }}</td>
            <td>{{ collateral.pathfile }}</td>
            <td>
              <div v-if="collateral.status === 1">
                <v-btn small @click="confirmImage(collateral.id)" class="bg-green darken-4">ຢືນຢັນ</v-btn>
              </div>
              <div v-else>
                <span class="text-success">ອັບໂຫຼດສຳເລັດ</span>
              </div>
            </td>
            <td>
              <v-btn small @click="viewImage(collateral.pathfile)" class="bg-indigo-darken-4">ເບິ່ງຮູບພາບອັບໂຫຼດ</v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-container>
  </template>
  
  
  <script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import axios from "axios";

export default defineComponent({
  setup() {
    definePageMeta({
      layout: "backend",
    });

    useHead({
      title: "Upload Image",
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

    const files = ref<File[]>([]);
    const collaterals = ref([]);

    const uploadFiles = async () => {
      const formData = new FormData();

      files.value.forEach((file) => {
        formData.append("image", file);
      });

      try {
        const response = await axios.post(
          "http://127.0.0.1:35729/api/api/upload_image/",
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        console.log(response.data);
        fetchCollaterals(); 
      } catch (error) {
        console.error(error.response ? error.response.data : error.message);
      }
    };

    const fetchCollaterals = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:35729/api/api/get_collaterals/');
        collaterals.value = response.data;
      } catch (error) {
        console.error(error.response ? error.response.data : error.message);
      }
    };

    const viewImage = (imagePath: string) => {
      const fullPath = `http://127.0.0.1:35729/${imagePath}`;
      window.open(fullPath, '_blank');
    };

    const confirmImage = async (id: number) => {
      try {
        const response = await axios.post(`http://127.0.0.1:35729/api/api/confirm_image/${id}/`);
        console.log(response.data);
        fetchCollaterals(); 
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
      collaterals,
      viewImage,
      confirmImage,
    };
  },
});
</script> -->
<template>
    <v-container>
      <div>
        <h1>ການອັບໂຫຼດຮູບພາບ</h1>
        <v-col cols="12">
          <v-file-input
            v-model="files"
            :show-size="1000"
            color="deep-purple-accent-4"
            label="ອັບໂຫຼດຮູບພາບ"
            placeholder="Select your files"
            prepend-icon="mdi-camera"
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
                  +{{ files.length - 2 }} ຮູບ(s)
                </span>
              </template>
            </template>
          </v-file-input>
          <v-btn color="primary" @click="uploadFiles" class="ml-9">ອັບໂຫຼດ</v-btn>
        </v-col>
      </div>
  
      <v-table class=" mt-5">
        <thead>
          <tr class="bg-indigo-lighten-1">
            <th>ລຳດັບ</th>
            <th>ຊື່ຮູບພາບ</th>
            <th>ທີ່ຢູ່ຮູບພາບ</th>
            <th>ສະຖານະ</th>
            <th>ລາຍລະອຽດ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="collateral in collaterals" :key="collateral.id">
            <td>{{ collateral.id }}</td>
            <td>{{ collateral.filename }}</td>
            <td>{{ collateral.pathfile }}</td>
            <td>
              <div v-if="collateral.status === 1">
                <v-btn small @click="confirmImage(collateral.id)" class="bg-green darken-4">ຢືນຢັນ</v-btn>
              </div>
              <div v-else>
                <span class="text-success">ອັບໂຫຼດສຳເລັດ</span>
              </div>
            </td>
            <td>
              <v-btn small @click="viewImage(collateral.pathfile)" class="bg-indigo-darken-4">ເບິ່ງຮູບພາບອັບໂຫຼດ</v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-container>
  </template>
  
<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import axios from "axios";
import Swal from "sweetalert2";

export default defineComponent({
  setup() {
    definePageMeta({
      layout: "backend",
    });

    useHead({
      title: "Upload Image",
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

    const files = ref<File[]>([]);
    const collaterals = ref([]);

    const uploadFiles = async () => {
      const formData = new FormData();

      files.value.forEach((file) => {
        formData.append("image", file);
      });

      try {
        const response = await axios.post(
          "http://127.0.0.1:35729/api/api/upload_image/",
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        console.log(response.data);
        await Swal.fire({
          title: "ສຳເລັດ!",
          text: "ອັບໂຫຼດຮູບພາບສຳເລັດແລ້ວ!",
          icon: "success",
          confirmButtonText: "OK",
          
        }).then(() => {
  // ຄຳສັ່ງສຳຫຼັບການລີເຟດໜ້າຈໍ
  location.reload(); // ລີເຟດໜ້າຈໍ
});
        fetchCollaterals(); // Refresh the list after successful upload
      } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        Swal.fire({
          title: "ຜິດພາດ!",
          text: error.response ? error.response.data : error.message,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    };

    const fetchCollaterals = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:35729/api/api/get_collaterals/');
        collaterals.value = response.data;
      } catch (error) {
        console.error(error.response ? error.response.data : error.message);
      }
    };

    const viewImage = (imagePath: string, id: string) => {
      const fullPath = `http://127.0.0.1:35729/${imagePath}?id=${id}`;
      window.open(fullPath, '_blank');
      console.log("id image", id);
    };

    const confirmImage = async (id: number) => {
      try {
        const response = await axios.post(`http://127.0.0.1:35729/api/api/confirm_image/${id}/`);
        console.log(response.data);
        await Swal.fire({
          title: "ສຳເລັດ!",
          text: "ຢືນຢັນຮູບພາບສຳເລັດແລ້ວ!",
          icon: "success",
          confirmButtonText: "OK",
          
        });
        fetchCollaterals(); // Refresh the list after confirmation
      } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        Swal.fire({
          title: "ຜິດພາດ!",
          text: error.response ? error.response.data : error.message,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    };

    onMounted(() => {
      fetchCollaterals();
    });

    return {
      files,
      uploadFiles,
      collaterals,
      viewImage,
      confirmImage,
    };
  },
});
</script>
