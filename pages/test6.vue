
<script setup lang="ts">
import { ref, onMounted } from "vue";

const datafetch = ref<any[]>([]);
const isloading = ref<boolean>(false);
const error = ref<string | null>(null);
const fetchdata = async () => {
  isloading.value = true;
  error.value = null;

  try {
    const response = await fetch(
      `http://192.168.45.54:35729/api/api/get_collaterals/`
    );

    if (!response.ok) {
      throw new Error(`Error:${response.statusText}`);
    }

    datafetch.value = await response.json();
  } catch (err: unknown) {
    error.value =
      err instanceof Error ? err.message : "An unexpected error occurred";
  } finally {
    isloading.value = false;
  }
};
onMounted(fetchdata);
</script>

<template>
<div v-if=" isloading"> ກຳລັງໂຫຼດ..... </div>
<div v-if="error">{{ error }}</div>
<div v-else>
  <div v-for="(item , index) in datafetch" >
    {{ item }}
    <img :src="`http://192.168.45.54:35729/collaterals/${item.pathfile}`" alt="Collateral Image" />
  </div>
</div>
</template>
