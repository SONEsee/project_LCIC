<template>
  <div>
    <div class="justify-center align-center d-flex">
      <v-tabs v-model="tab">
        <v-tab value="one">ຄົ້ນຫາເປັນລາຍການ</v-tab>
        <v-tab value="two">ຄົ້ນຫາແບບ bate file</v-tab>
      </v-tabs>
    </div>

    <v-window v-model="tab">
      <v-window-item value="one">
        <v-card>
          <v-card-text>
            <searchuser />
          </v-card-text>
        </v-card>
      </v-window-item>

      <v-window-item value="two">
        <v-card>
          <v-card-title>ຄົ້ນຫາບົດລາຍງານແບບ bastfile</v-card-title>
          <v-card-text>
            <searchuser-batefile/>
          </v-card-text>
        </v-card>
      </v-window-item>
    </v-window>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";

const STORAGE_KEY = "search_tab_selected";


const tab = ref(
  process.client ? sessionStorage.getItem(STORAGE_KEY) || "one" : "one"
);


watch(tab, (newValue) => {
  if (process.client) {
    sessionStorage.setItem(STORAGE_KEY, newValue);
  }
});

definePageMeta({
  layout: "backend",
});

useHead({
  title: "Upload File",
  meta: [
    {
      name: "keywords",
      content: "Report, Nuxt 3, Backend",
    },
    {
      name: "description",
      content: "Report Nuxt 3, IT Genius Engineering",
    },
  ],
});
</script>