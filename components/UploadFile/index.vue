<!-- <script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import { useUserData } from "~/composables/useUserData";
const { user, userId, isAdmin, isLoggedIn } = useUserData();

definePageMeta({
  layout: "backend",
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

const tab = ref("one");
const subTab = ref("two-one");
</script>
<template>
 
 <h3 class="text-primary ml-3">{{ $t("upload") }}</h3>
  <v-tabs v-model="tab" fixed-tabs color="primary" stacked density="compact">
    <v-tab value="one">{{ $t("loaninformation") }} </v-tab>
    <v-tab value="three">{{ $t("uploadsecuritiesdata") }}</v-tab>
  </v-tabs>

  <v-window v-model="tab">
    <v-window-item value="one">
      <div v-if="userId!=='01'">
        <UploadFileUploadB />
      </div>
      <div v-if="userId==='01'">
        <UploadFileLoanUploadLcictestB />
      </div>
      
    </v-window-item>

    <v-window-item value="three">
      <div v-if="userId!=='01'">
        <UploadFileUploadC />
      </div>
      <div v-if="userId==='01'">
        <UploadFileLoanUploadLcictestC />
      </div>
      
    </v-window-item>
  </v-window>
</template>



 -->
<script lang="ts" setup>
import { ref, onMounted, computed, watch } from "vue";
import { useUserData } from "~/composables/useUserData";

const { user, userId, isAdmin, isLoggedIn } = useUserData();

definePageMeta({
  layout: "backend",
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

const tab = ref("one");
const subTab = ref("two-one");


const getUserStorageKey = (baseKey: string) => {
  try {
    const id = userId.value || 'unknown';
    return `${baseKey}_user_${id}`;
  } catch (error) {
    console.error("Failed to get user ID for storage key:", error);
    return baseKey;
  }
};


const saveTabToStorage = (selectedTab: string) => {
  try {
    const storageKey = getUserStorageKey("upload_tab_storage");
    localStorage.setItem(storageKey, selectedTab);
    sessionStorage.setItem(storageKey, selectedTab);
    console.log("✅ Saved tab:", selectedTab);
  } catch (error) {
    console.error("❌ Failed to save tab:", error);
  }
};


const saveSubTabToStorage = (selectedSubTab: string) => {
  try {
    const storageKey = getUserStorageKey("upload_subtab_storage");
    localStorage.setItem(storageKey, selectedSubTab);
    sessionStorage.setItem(storageKey, selectedSubTab);
    console.log("✅ Saved sub-tab:", selectedSubTab);
  } catch (error) {
    console.error("❌ Failed to save sub-tab:", error);
  }
};


const loadTabFromStorage = () => {
  try {
    const storageKey = getUserStorageKey("upload_tab_storage");
    

    let savedTab = sessionStorage.getItem(storageKey) || 
                   localStorage.getItem(storageKey);
    
    if (savedTab) {
      tab.value = savedTab;
      console.log("✅ Loaded tab:", savedTab);
      
     
      if (!sessionStorage.getItem(storageKey)) {
        sessionStorage.setItem(storageKey, savedTab);
      }
    } else {
      tab.value = "one";
    }
  } catch (error) {
    console.error("❌ Failed to load tab:", error);
    tab.value = "one";
  }
};


const loadSubTabFromStorage = () => {
  try {
    const storageKey = getUserStorageKey("upload_subtab_storage");
    
    let savedSubTab = sessionStorage.getItem(storageKey) || 
                      localStorage.getItem(storageKey);
    
    if (savedSubTab) {
      subTab.value = savedSubTab;
      console.log("✅ Loaded sub-tab:", savedSubTab);
      
      if (!sessionStorage.getItem(storageKey)) {
        sessionStorage.setItem(storageKey, savedSubTab);
      }
    } else {
      subTab.value = "two-one"; 
    }
  } catch (error) {
    console.error("❌ Failed to load sub-tab:", error);
    subTab.value = "two-one";
  }
};


const validateUserStorage = () => {
  try {
    const currentUserId = userId.value;
    const lastUserId = localStorage.getItem("last_upload_user_id");
    
    if (currentUserId !== lastUserId) {
      console.log("🔄 User changed, cleaning old tabs...");
      
    
      ['localStorage', 'sessionStorage'].forEach(storageType => {
        const storage = storageType === 'localStorage' ? localStorage : sessionStorage;
        
        Object.keys(storage).forEach(key => {
          if (key.includes('upload_tab_storage_user_') || 
              key.includes('upload_subtab_storage_user_')) {
            const currentTabKey = getUserStorageKey("upload_tab_storage");
            const currentSubTabKey = getUserStorageKey("upload_subtab_storage");
            
            if (key !== currentTabKey && key !== currentSubTabKey) {
              storage.removeItem(key);
            }
          }
        });
      });
      
     
      if (currentUserId) {
        localStorage.setItem("last_upload_user_id", currentUserId);
      }
    }
  } catch (error) {
    console.error("❌ Failed to validate user storage:", error);
  }
};


watch(tab, (newTab) => {
  if (newTab) {
    saveTabToStorage(newTab);
  }
});


watch(subTab, (newSubTab) => {
  if (newSubTab) {
    saveSubTabToStorage(newSubTab);
  }
});


watch(userId, (newUserId, oldUserId) => {
  if (newUserId !== oldUserId && newUserId) {
    validateUserStorage();
    loadTabFromStorage();
    loadSubTabFromStorage();
  }
});


onMounted(() => {
  if (userId.value) {
    validateUserStorage();
    loadTabFromStorage();
    loadSubTabFromStorage();
  }
});
</script>

<template>
  <h3 class="text-primary ml-3">{{ $t("upload") }}</h3>
  
  <v-tabs v-model="tab" fixed-tabs color="primary" stacked density="compact">
    <v-tab value="one">
      
      {{ $t("loaninformation") }}
    </v-tab>
    <v-tab value="three">
     
      {{ $t("uploadsecuritiesdata") }}
    </v-tab>
  </v-tabs>

  <v-window v-model="tab">
    <v-window-item value="one">
      
      <div v-if="!isAdmin">
        <UploadFileUploadB />
      </div>
      
      
      <div v-if="isAdmin">
        <UploadFileLoanUploadLcictestB />
      </div>
    </v-window-item>

    <v-window-item value="three">
    
      <div v-if="!isAdmin">
        <UploadFileUploadC />
      </div>
      
      
      <div v-if="isAdmin">
        <UploadFileLoanUploadLcictestC />
      </div>
    </v-window-item>
  </v-window>
</template>