<template>
  <div>
    <h3>ຂໍ້ມູນສໍ້າກັນ</h3>
    <div v-if="processedResults.length > 0" style="width: 100%;">
      <p>ລາຍການທີ່ສໍ້າ {{ processedResults.length }} ລາຍການ.</p>
      <v-data-table
        :items="processedResults"
        :headers="header"
        item-key="id"
      >
        <template v-slot:item.duplicates="{ item }">
          <div v-if="item.duplicates">
            <p>LCIC ID: {{ JSON.parse(item.duplicates).lcicID }}</p>
            <p>Enterprise Code: {{ JSON.parse(item.duplicates).com_enterprise_code }}</p>
          </div>
        </template>
        <template v-slot:item.created_at="{ item }">
          <p v-if="item.created_at">{{ new Date(item.created_at).toLocaleDateString() }}</p>
          <p v-else>N/A</p>
        </template>
      </v-data-table>
    </div>
    <div v-else>
      <p>No duplicates found.</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, toRaw } from "vue";
import { useRoute } from "vue-router";

interface Result {
  id: number;
  lcicID: string | null;
  com_enterprise_code: string | null;
  status: string | null;
  enterpriseNameLao: string | null;
  investmentCurrency: string | null;
  created_at: string | null;
  duplicates: string | null;
}

const route = useRoute();
const id = ref(route.query.id as string);
const results = ref<Result[]>([]);
definePageMeta({
  layout: "backend",
  middleware: ["auth"],
});

useHead({
  title: "bate file",
  meta: [
    {
      name: "keywords",
      content: "Report, Nuxt 3, Backend",
    },
    {
      name: "Description",
      content: "Report Nuxt 3, IT Genius Engineering",
    },
  ],
});

const header = ref([
  { title: "ລຳດັບ", value: "id" },
  { title: "LCIC ID", value: "lcicID" },
  { title: "Enterprise Code", value: "com_enterprise_code" },
  { title: "ມື້ຄົ້ນຫາ", value: "created_at" },
  { title: "ຂໍ້ມູນທີ່ສໍ້າກັນ", value: "duplicates" },
]);

const processedResults = computed(() =>
  results.value.filter((item) => item.status === "Not Found")
);

const fetchResults = async () => {
  try {
    console.log("Route query ID:", id.value);
    const config = useRuntimeConfig();
    const response = await fetch(
      `${config.public.strapi.url}api/api/get-search-results/${id.value}/`
    );

    const data = await response.json();
    console.log("Data:", data);

    if (data.results && Array.isArray(data.results)) {
      results.value = data.results;
      console.log("Processed results:", toRaw(results.value));
    } else {
      console.warn("Unexpected response format:", data);
      results.value = [];
    }
  } catch (error) {
    console.error("Error fetching results:", error);
  }
};

onMounted(fetchResults);
</script>