<!-- <script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
export default{
const datafetch = ref<any[]>([]);
const error = ref<string | null>(null);
const isloading = ref<boolean>(false);
const search = ref<string>("");

const config = {
  public: {
    strapi: { url: "http://192.168.45.54:35729/" },
  },
};

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

    const rawData = await response.json();

    datafetch.value = rawData.map((item: any) => ({
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

const filteredData = computed(() =>
  datafetch.value.filter((item) =>
    item.id.toString().includes(search.value)
  )
);

return {
  datafetch,
  error,
  isloading,
  search,
  filteredData,
};}
</script>


<template>
  <div>
    <div v-if="isloading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>
      <input v-model="search" placeholder="Search..." />
      <ul>
        <li v-for="item in datafetch" :key="item.id">
          <img :src="item.fullImagePath" alt="Collateral Image" />
          <p>{{ item.id }}</p>
        </li>
      </ul>
    </div>
  </div>
</template> -->
<template>

</template>