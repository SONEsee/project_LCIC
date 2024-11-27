<template>
  <div>
    <v-col cols="12">
        <v-card-title class="d-flex align-center pe-2">
          <v-icon icon="mdi-video-input-component"></v-icon> &nbsp;
          Find a Graphics Card
    
          <v-spacer></v-spacer>
    
          <v-text-field
            v-model="search"
            density="compact"
            label="Search"
            prepend-inner-icon="mdi-magnify"
            variant="solo-filled"
            flat
            hide-details
            single-line
          ></v-text-field>
        </v-card-title>
    
        <v-divider></v-divider>
        <v-data-table
          v-model:search="search"
          :filter-keys="['filename']"
          :items="items"
        >
        <v-table>
          <thead>
            <tr>
              <th>ໄອດີ</th>
              <th>ຊື່ໄຟລ໌</th>
              <th>ຮູບພາບ</th>
              <th>ສະຖານະ</th>
              <th>ຜູ້ໃຊ້</th>
              <th>ການດຳເນີນການ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(data, index) in files" :key="index">
              <td>{{ data.id }}</td>
              <td>{{ data.filename }}</td>
              <td>
                <img
                  v-if="data.fullImagePath"
                  :src="data.fullImagePath"
                  alt="File Image"
                  class="table-image"
                />
              </td>
              <td>{{ data.status }}</td>
              <td>{{ data.user }}</td>
              <td>
                <v-btn color="primary" @click="viewFile(data)">View</v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-data-table>  
    </v-col>
    <p v-if="files.length === 0">ບໍ່ມີຂໍ້ມູນໃຫ້ສະແດງ</p>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const files = ref([]);


const fetchFiles = async () => {
  try {
    const config = useRuntimeConfig();
    const baseURL = config.public.strapi.url;

    const response = await axios.get(`${baseURL}api/api/get_collaterals/`);

    files.value = response.data.map((item: any) => ({
      ...item,
      fullImagePath: `${baseURL}collaterals/${item.pathfile}`,
    }));

    console.log("Fetched data:", files.value);
  } catch (error) {
    console.error("Error fetching files:", error);
  }
};

onMounted(() => {
  fetchFiles();
});

definePageMeta({
  layout: "backend",
});

useHead({
  title: "Collect Files",
  meta: [
    {
      name: "keywords",
      content: "Order, Nuxt 3, Backend",
    },
    {
      name: "description",
      content: "Order Nuxt 3, IT Genius Engineering",
    },
  ],
});
</script>

<style>
.table-image {
  width: 80px;
  height: auto;
  border-radius: 8px;
}
</style>
