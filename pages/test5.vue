<template>
  <div>
    <v-col cols="12">
      
      <v-row>
        <v-col
          cols="12"
          md="4"
          v-for="(data, index) in files"
          :key="index"
          class="card"
        >
          <img
            v-if="data.fullImagePath"
            :src="data.fullImagePath"
            alt="File Image"
            class="card-image"
          />
          <h3>ຊື່ໄຟລ໌: {{ data.filename }}</h3>
          <p><strong>ໄອດີ:</strong> {{ data.id }}</p>
          <p><strong>ສະຖານະ:</strong> {{ data.status }}</p>
          <p><strong>ຜູ້ໃຊ້:</strong> {{ data.user }}</p>
          <v-btn class="bg-green">View</v-btn>
        </v-col>
      </v-row>
    </v-col>

    <p v-if="files.length === 0">ไม่มีข้อมูลไฟล์ให้แสดง</p>
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
.card-container {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  padding: 16px;
}

.card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 100%;
}

.card-image {
  width: 100%;
  max-width: 200px;
  height: auto;
  border-radius: 8px;
  margin-bottom: 16px;
}

.card h3 {
  margin: 8px 0;
}

.card p {
  margin: 4px 0;
}

@media (max-width: 768px) {
  .card-container {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}
</style>
