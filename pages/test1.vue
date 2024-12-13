

<script lang="ts" setup>
import { ref, onMounted } from "vue";
const datafetch = ref<any[]>([]);
const error = ref<string | null>(null);
const isloading = ref<boolean>(false);
const fetdata = async () => {
  isloading.value = true;
  error.value = null;
  try {
    const respons = await fetch(
      `http://192.168.45.54:35729/api/api/get_collaterals/`
    );
    if (!respons.ok) {
      throw new Error(`Error: ${respons.statusText}`);
    }
    datafetch.value = await respons.json();
  } catch (
    err: unknown
   
  ) {
    error.value =
      err instanceof Error ? err.message : "An unexpected error occurred";
  } finally {
isloading.value = false
  }
};
onMounted(fetdata)
</script>
<template>
<div v-if="isloading">ກຳລັງອັບໂຫຼດ .....</div>
<div v-if="error" class="text-red"> ບໍ່ສາມາດດືງຂໍ້ມູນໄດ້ </div>
<div v-else>
  <div v-for="(index , item) in datafetch" :key="index">
    {{ index }}
    <v-card>
      <title>hi sone seedavanh </title>
      <img :src="`http://192.168.45.54:35729/collaterals/${index.pathfile}`" alt="">
    </v-card>
  </div>
</div>
</template>
