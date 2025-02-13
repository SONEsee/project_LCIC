<template>
  <!-- <div>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>
      <div v-if="data">
        <v-row>
            
          <v-col cols="12"
            ><div>
              <h2>ຄ່າທຳນຽມປີ: {{ data.year }}</h2>
            </div></v-col
          >
          <v-col cols="12">
            <div class="d-flex justify-center align-center">
              <v-icon
                icon="mdi-cash-multiple"
                size="50"
                color="blue"
              ></v-icon></div></v-col
        ></v-row>
         ປີ: {{ data.year }} | ຄ່າທຳນຽມ: {{ formatNumber(data.total_fee) }} ກີບ 
      </div>
    </div>
  </div> -->
  <v-container>
  
  <div v-if="data">
    <h3>ຄ່າທຳນຽມປີ:{{ data.year }}</h3>
    <div class="d-flex justify-center align-center">
      <v-icon icon="mdi-cash-multiple" size="60" color="#0D47A1"></v-icon>
      <h3 class="ml-2">{{ formatNumber(data.total_fee) }} ກີບ </h3>
    </div>
    </div
><div v-else>
    <div style="height: 12vh;" class="text-center">
      
        <LazyAnimationRobot :item="['someString']"  />
      <p class="mt-3">  ຍັງບໍ່ມີຂໍ້ມູນ</p>

    </div>
</div>
</v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";

interface FeeItem {
  year: number;
  total_fee: number;
}

const config = useRuntimeConfig();
const data = ref<FeeItem>();
const loading = ref(false);
const error = ref<string | null>(null);

const User = localStorage.getItem("user_data") || "{}";
const bnk_code = JSON.parse(User).MID?.id ?? "";

const formatNumber = (num: number) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const Getdata = async () => {
  loading.value = true;
  error.value = null;

  try {
    const res = await axios.get(
      `${config.public.strapi.url}api/dashboard/fee_count-by-date/?bnk_code=${bnk_code}`
    );
    if (res.status === 200 && Array.isArray(res.data)) {
      const sortedData = res.data.sort((a, b) => a.year - b.year);
      data.value = sortedData[sortedData.length - 1];
    }
  } catch (err) {
    console.error(err);
    error.value = "ບໍ່ສາມາດດຶງຂໍ້ມູນໄດ້";
  } finally {
    loading.value = false;
  }
};

onMounted(Getdata);
</script>
