<script lang="ts">
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
}

export default {
  setup() {
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
      { title: "ID", value: "id" },
      { title: "LCIC ID", value: "lcicID" },
      { title: "Enterprise Code", value: "com_enterprise_code" },
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

    return {
      processedResults,
      header,
    };
  },
};
</script>

<template>
  <div class="d-flex justify-end align-center mr-3 mt-3">
    <v-btn class="bg-error"
      >export <v-icon icon="mdi-cloud-braces" class="ml-2"></v-icon>
    </v-btn>
  </div>
  <v-data-table
    v-if="processedResults.some((item) => item.status === 'Not Found')"
    :items="processedResults"
    :headers="header"
    item-key="id"
    items-per-page="10"
    class="elevation-1"
  />
  <div v-else>No items with status "Found" available.</div>
</template>
