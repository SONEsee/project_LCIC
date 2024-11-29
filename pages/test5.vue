<script lang="ts" setup>
import { ref, onMounted } from "vue";
const datafetch = ref<any[]>([]);
const error = ref<string | null>(null);
const isloading = ref<boolean>(false);

const fetchdata = async () => {
  isloading.value = true; 
  error.value = null; 

  try {
    const response = await fetch(
      `http://192.168.45.54:35729/api/api/get_collaterals/`
    );
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    datafetch.value = await response.json();

    const config = useRuntimeConfig();
    datafetch.value = datafetch.value.map((item: any) => ({
      ...item,
      fullImagePath: `${config.public.strapi.url}collaterals/${item.pathfile}`,
    }));

    console.log("Fetched data:", datafetch.value);
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
  <div v-if="isloading">ກຳລັງໂຫຼດ.....</div>
  <div v-if="error">{{ error }}</div>
  <div v-else>
    <div v-for="(data, index) in datafetch" :key="index">
      {{ data }}
    </div>
    <v-col cols="12">
      <v-row>
        <v-col cols="4" v-for="(data, index) in datafetch" :key="index">
          <v-card text-title="test">
            <p>{{ index + 1 }}</p>
            <p>{{ data.id }} {{ data.pathfile }}</p>
            <p>{{ data.status }}</p>
            <img :src="data.fullImagePath" alt="" />
          </v-card>
        </v-col>
      </v-row>
    </v-col>
  </div>
</template>
