<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import lcic from "@/pages/insertcollaterals.vue";

const tab = ref<any>(null);


const getUserStorageKey = (baseKey: string) => {
  try {
    const userData = localStorage.getItem("user_data");
    if (userData) {
      const user = JSON.parse(userData);
      const userId = user.MID?.id || 'unknown';
      return `${baseKey}_user_${userId}`;
    }
    return baseKey; 
  } catch (error) {
    console.error("Failed to get user ID for storage key:", error);
    return baseKey;
  }
};


const saveTabToStorage = (selectedTab: string) => {
  try {
    const storageKey = getUserStorageKey("selected_tab_storage");
    localStorage.setItem(storageKey, selectedTab);

    sessionStorage.setItem(storageKey, selectedTab);
    console.log("Saved tab to storage:", selectedTab, "with key:", storageKey);
  } catch (error) {
    console.error("Failed to save tab to storage:", error);
  }
};


const loadTabFromStorage = () => {
  try {
    const storageKey = getUserStorageKey("selected_tab_storage");
    
  
    let savedTab = sessionStorage.getItem(storageKey);
    
   
    if (!savedTab) {
      savedTab = localStorage.getItem(storageKey);
     
      if (savedTab) {
        sessionStorage.setItem(storageKey, savedTab);
      }
    }
    
    if (savedTab) {
      tab.value = savedTab;
      console.log("Loaded tab from storage:", savedTab, "with key:", storageKey);
    } else {
    
      tab.value = "one";
    }
  } catch (error) {
    console.error("Failed to load tab from localStorage:", error);
  
    tab.value = "one";
  }
};


const clearTabStorage = () => {
  try {
    const storageKey = getUserStorageKey("selected_tab_storage");
    localStorage.removeItem(storageKey);
    sessionStorage.removeItem(storageKey);
    console.log("Tab storage cleared for key:", storageKey);
  } catch (error) {
    console.error("Failed to clear tab storage:", error);
  }
};


const validateUserStorage = () => {
  try {
    const currentUserData = localStorage.getItem("user_data");
    const lastUserData = localStorage.getItem("last_logged_user_tab");
    
    if (currentUserData !== lastUserData) {
      console.log("User changed, clearing old tab storage...");
      
      // ລືຂໍ້ມູນ tab ທີ່ກ່ຽວຂ້ອງກັບ users ອື່ນ
      Object.keys(localStorage).forEach(key => {
        if (key.includes('selected_tab_storage_user_')) {
          const currentUserKey = getUserStorageKey("selected_tab_storage");
          if (key !== currentUserKey) {
            localStorage.removeItem(key);
          }
        }
      });
      
      Object.keys(sessionStorage).forEach(key => {
        if (key.includes('selected_tab_storage_user_')) {
          const currentUserKey = getUserStorageKey("selected_tab_storage");
          if (key !== currentUserKey) {
            sessionStorage.removeItem(key);
          }
        }
      });
      
    
      if (currentUserData) {
        localStorage.setItem("last_logged_user_tab", currentUserData);
      }
    }
  } catch (error) {
    console.error("Failed to validate user storage:", error);
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

// ເມື່ອໂຫຼດໜ້າ ໃຫ້ກວດສອບ user ແລະໂຫຼດແຖບທີ່ເກັບໄວ້
onMounted(() => {
  validateUserStorage();
  loadTabFromStorage();
});
</script>

<template>
  <v-tabs v-model="tab" fixed-tabs color="primary" stacked>
    <v-tab value="one">ກວດສອບຂໍ້ມູນເງິນກູ້</v-tab>
    <v-tab value="two">ກວດຂໍ້ມູນຫຼັກຊັບ</v-tab>
    <!-- <v-tab value="three">ອອກລະຫັດ ຂສລ</v-tab> -->
  </v-tabs>
  <v-window v-model="tab">
    <v-window-item value="one">
      <UploadFileLoanUploadLcictestB />
    </v-window-item>
    <v-window-item value="two">
      <UploadFileLoanUploadLcictestC />
    </v-window-item>
    <!-- <v-window-item value="three">
      <lcic />
    </v-window-item> -->
  </v-window>
</template>