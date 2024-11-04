<template >

    <v-col cols="12">
        <v-row>
            <v-col cols="12" md="5">
                <TotalSales/>
            </v-col>
            <v-col cols="12" md="4">
                <div class="mt-7">
                <test/></div>
            </v-col>
            <v-col cols="12" md="3">
                <div class="mt-7">
                <test3/></div>
            </v-col>
            <v-col cols="12" md="5">
                <div class="mt-7">
                <test2/></div>
            </v-col>
        </v-row>
    </v-col>

<<<<<<< HEAD
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
          <v-img :src="`http://127.0.0.1:35729/${collateral.image}`" aspect-ratio="1.75"></v-img>
          <v-card-title>{{ collateral.filename }}</v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
=======
>>>>>>> 7a6a73f4385a12dae435ab5762d85d2ece83ccaa
</template>
<script setup leng="ts">
import TotalSales from "@/components/dashboardComponents/modern/total-sales/TotalSales.vue"
import test from "@/components/dashboardComponents/modern/monthly-earnings/MonthlyEarnings.vue"
import test2 from "@/components/dashboardComponents/modern/revenue-updates/RevenueUpdates.vue"
import test3 from "@/components/dashboardComponents/modern/congratulation-card/CongratulationCard.vue"
definePageMeta({
    layout: "backend",
    middleware: ["auth"],
  })

<<<<<<< HEAD
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
          "http://127.0.0.1:35729/api/api/upload_image/",  
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
        const response = await axios.get('http://127.0.0.1:35729/api/api/get_collaterals/');
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

=======
  useHead({
    title: 'Dashboard',
    meta: [
      { 
        name: 'keywords', 
        content: 'Dashboard, Nuxt 3, Backend'
      },
      {
        name: 'Description',
        content: 'Dashboard Nuxt 3,  IT Genius Engineering'
      }
    ]
  })
>>>>>>> 7a6a73f4385a12dae435ab5762d85d2ece83ccaa
</script>
