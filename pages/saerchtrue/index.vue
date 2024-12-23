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
    const route = useRoute();
    const id = ref(route.query.id as string);
    const results = ref<Result[]>([]);

    const header = ref([
      { title: "ID", value: "id" },
      { title: "LCIC ID", value: "lcicID" },
      { title: "Enterprise Code", value: "com_enterprise_code" },
      { title: "Enterprise Name (Lao)", value: "enterpriseNameLao" },
      { title: "Investment Currency", value: "investmentCurrency" },
      { title: "Created At", value: "created_at" },
      { title: "Status", value: "status" },
      { title: "action", value: "action" },
    ]);

    const processedResults = computed(() =>
      // results.value.map((item) => ({

      //   ...item,
      //   enterpriseNameLao: item.enterpriseNameLao || "N/A",
      //   investmentCurrency: item.investmentCurrency || "N/A",
      //   created_at: item.created_at || "N/A",
      // }))
      results.value.filter((item) => item.status === "Found")
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
  <v-data-table
    v-if="processedResults.some((item) => item.status === 'Found')"
    :items="processedResults"
    :headers="header"
    item-key="id"
    items-per-page="10"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat color="">
        <v-toolbar-title
          ><p >ການຄົ້ນຫາທີ່ພົບຂໍ້ມູນໃນຖານຂໍ້ມູນຂອງ ຂສລ</p></v-toolbar-title
        >
        <v-btn class="bg-primary"> ເປີດທັງໝົດ </v-btn>
      </v-toolbar>
    </template>
    <template v-slot:item.action="{ item }">
      <v-btn class="bg-primary">ເປີດ</v-btn>
    </template>
    <template v-slot:item.status="{ item }">
      <v-chip color="success" v-if="item.status === 'Found'"
        ><p>ເປີດແລ້ວ</p></v-chip
      >
      <v-chip color="primary" v-if="item.status === 'Not Found'"
        ><p>ຍັງບໍ່ທັນເປີດ</p></v-chip
      >
    </template>
  </v-data-table>

  <div v-else>No items with status "Found" available.</div>
</template>
