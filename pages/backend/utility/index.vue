<script setup lang="ts">
const tab = ref(null);

definePageMeta({
  layout: "backend",
  middleware: ["auth"],
});

useHead({
  title: "Upload File",
  meta: [
    { name: "keywords", content: "Report, Nuxt 3, Backend" },
    {
      name: "Description",
      content: "Report Nuxt 3, IT Genius Engineering",
    },
  ],
});
</script>
<template>
  <v-tabs v-model="tab" fixed-tabs stacked>
    <v-tab value="one">ດາວໂຫຼດ json file</v-tab>
    <v-tab value="two">ອັບໂຫຼດຂໍ້ມູນເຂົ້າ Database</v-tab>
  </v-tabs>
  <v-card-text>
    <v-window v-model="tab">
      <v-window-item value="one">
        <UtilityImportDownloadDowload />
      </v-window-item>
      <v-window-item value="two">
        <UtilityExportUpload />
      </v-window-item>
    </v-window>
  </v-card-text>
</template>
