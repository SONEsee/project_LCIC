<script setup lang="ts">
import lcic from "@/pages/insertcollaterals.vue";
const tab = ref(null);
definePageMeta({
  layout: "backend",
});

useHead({
  title: "Submit",
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
</script>

<template>
  <v-tabs v-model="tab" fixed-tabs color="primary" stacked>
    <v-tab value="one">ກວດສອບຂໍ້ມູນເງິນກູ້</v-tab>
    <v-tab value="two">ກວດຂໍ້ມູນຫຼັກຊັບ</v-tab>
    <v-tab value="three">ອອກລະຫັດ ຂສລ</v-tab>
  </v-tabs>
  <v-window v-model="tab">
    <v-window-item value="one">
      <UploadFileLoanUploadLcictestB />
    </v-window-item>
    <v-window-item value="two">
      <UploadFileLoanUploadLcictestC />
    </v-window-item>
    <v-window-item value="three">
      <lcic />
    </v-window-item>
  </v-window>
</template>
