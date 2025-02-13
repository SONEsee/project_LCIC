<template>
    <v-container>

  <div v-if="item">
    <h3>ການນຳສົ່ງຂໍ້ມູນພາຍໃນປີ:{{ item.year }}</h3>
    <div class="d-flex justify-center align-center">
      <v-icon icon="mdi-file-document-check-outline" size="60" color="#0D47A1"></v-icon>
      <h3 class="ml-2">{{ formatNumber(item.loan_count) }} ລາຍການ </h3>
    </div>
    </div
>
<div v-else>
    <div style="height: 12vh;" class="text-center">
      
        <LazyAnimationRobot :item="['someString']"  />
      <p class="mt-3">  ຍັງບໍ່ມີຂໍ້ມູນ</p>

    </div>
</div>
</v-container>

</template>
<script setup lang="ts">
defineProps<{
  item: string 
}>()
import { ref, onMounted } from "vue";
import axios from "axios";
const yourArrayData = "ກຳລັງພັດທະນາ....";
const formatNumber = (number: number)=>{
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
interface LoanCount {
    year:       string;
    loan_count: number;
}
const User = localStorage.getItem("user_data") || "{}";
const bnk_code = JSON.parse(User).MID?.id ?? "";
const item = ref<LoanCount>();
const config = useRuntimeConfig();

const Getdata = async ()=>{
    try {
        const res = await axios.get(`${config.public.strapi.url}api/dashboard/loan-count-by-month/?bnk_code=${bnk_code}`);
        if (res.status === 200 && Array.isArray(res.data)) {
            const sortedData = res.data.sort((a,b)=>a.year - b.year);
            item.value = sortedData[sortedData.length - 1];
            
        }
    } catch (error) {
        console.log(error);
    }
}
onMounted(Getdata);
</script>