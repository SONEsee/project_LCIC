<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import lcic from "@/pages/insertcollaterals.vue";

const tab = ref<any>(null);
const TAB_STORAGE_KEY = "selected_tab_storage";


const saveTabToStorage = (selectedTab: string) => {
  try {
    localStorage.setItem(TAB_STORAGE_KEY, selectedTab);
    console.log("Saved tab to storage:", selectedTab);
  } catch (error) {
    console.error("Failed to save tab to localStorage:", error);
  }
};


const loadTabFromStorage = () => {
  try {
    const savedTab = localStorage.getItem(TAB_STORAGE_KEY);
    if (savedTab) {
      tab.value = savedTab;
      console.log("Loaded tab from storage:", savedTab);
    } else {
    
      tab.value = "one";
    }
  } catch (error) {
    console.error("Failed to load tab from localStorage:", error);
   
    tab.value = "one";
  }
};





watch(tab, (newTab) => {
  if (newTab) {
    saveTabToStorage(newTab);
  }
});

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


onMounted(() => {
  loadTabFromStorage();
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