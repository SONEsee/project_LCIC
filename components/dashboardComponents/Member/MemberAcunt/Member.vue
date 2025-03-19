<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
const User = localStorage.getItem("user_data") || "{}";
console.log("user get localstorate",User)
interface User {
  MID?: {
    id: string;
  };
}
interface DataRespons {
    bnk_code:   string;
    user_count: number;
}
const member =  JSON.parse(User).MID?.code ?? "";
console.log("member",member)
const bnk_code = JSON.parse(User).MID?.id ?? "";
const item = ref<DataRespons>();
const Getdata = async () => {
  try {
    const config = useRuntimeConfig();
    const res = await axios.get(
      `${config.public.strapi.url}api/dashboard/bank-user/?bnk_code=${bnk_code}`
    );
    if (res.status === 200) {
      console.log("status success");
      item.value = res.data;
      console.log(item.value);
    }
  } catch (error) {
    console.log(error);
  }
};
onMounted(Getdata);
</script>
<template>
  <v-container>
  
    <div v-if="item">
      <h3>ຈຳນວນຜູ້ໃຊງານສຳຫຼັບ:{{ member }}</h3>
      <div class="d-flex justify-center align-center">
        <v-icon icon="mdi-account-group" size="60" color="#0D47A1"></v-icon>
        <h1 class="ml-2">{{ item.user_count }}</h1>user
      </div></div
  >
  <div v-else>
    <div style="height: 12vh;" class="text-center">
      
        <LazyAnimationRobot :item="['someString']"  />
      <p class="mt-3">  ຍັງບໍ່ມີຂໍ້ມູນ</p>

    </div>
</div>
  </v-container>
</template>
