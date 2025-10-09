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
    <v-tab value="one">ດາວໂຫຼດຂໍ້ມູນ ສາທາລະນຸປະໂພກ</v-tab>
    <v-tab value="two">ນໍາສົ່ງຂໍ້ມູນ ສາທາລະນຸປະໂພກ</v-tab>
    <v-tab value="three">ນໍາສົ່ງຂໍ້ມູນ API EDL</v-tab>
    <v-tab value="four">ນໍາສົ່ງຂໍ້ມູນ API Water</v-tab>
    <v-tab value="five">ລາຍງານການນໍາສົ່ງ API EDL</v-tab>
    <v-tab value="six">ລາຍງານການນໍາສົ່ງ API Water</v-tab>
  </v-tabs>
  <v-card-text>
    <v-window v-model="tab">
      <v-window-item value="one">
        <UtilityImportDownloadDowload />
      </v-window-item>
      <v-window-item value="two">
        <UtilityExportUpload />
      </v-window-item>
      <v-window-item value="three">
        <UtilityUtilityapiUtilityAPIEdl />
      </v-window-item>
      <v-window-item value="four">
        <UtilityUtilityapiUtilityAPIWater />
      </v-window-item>
      <v-window-item value="five">
        <UtilityUtilityapiUtilityAPIEdlReport />
      </v-window-item>
      <v-window-item value="six">
        <UtilityUtilityapiUtilityAPIWaterReport />
      </v-window-item>
    </v-window>
  </v-card-text>
</template>
