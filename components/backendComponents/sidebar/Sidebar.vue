<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useSidebar } from "./sidebarItems"; // Import the useSidebar composable

interface User {
  username: string;
  GID: { GID: number }; 
}


const user = ref<User | null>(null);
const sidebarItems = ref([]); 

onMounted(async () => {
  const fetchedItems = await useSidebar(); // Await the sidebar fetching logic
  sidebarItems.value = fetchedItems.value || []; // Populate the reactive sidebarItems
 
});


onMounted(() => {
  const userData = localStorage.getItem("user_data");
  if (userData) {
    user.value = JSON.parse(userData);
    
  }
});


const filteredSidebarItems = computed(() => {
  if (!user.value || !user.value.GID) return [];
  const userGID = user.value.GID.GID; 
  return sidebarItems.value.filter((item) => item.roles.includes(userGID));
});
</script>

<template>
  <div>
    <div class="scrollnavbar">
      <div class="profile">
      
      </div>
      <v-list class="pa-4">
      
        <template v-if="filteredSidebarItems.length > 0">
          <template v-for="(item, i) in filteredSidebarItems" :key="i">
            <v-list-item
              :to="item.url"
              rounded="lg"
              class="mb-1"
              :class="{ 'active-item': $route.path === item.url } "
              :style="{
                
              }"
            >
              <template v-slot:prepend >
                <v-icon :icon="item.icon" style="color: #304FFE;" class="hover-icon"></v-icon>
              </template>
              <!-- <v-list-item-title v-text="item.name"></v-list-item-title> -->
              <v-list-item-title>{{ $t(item.name) }}</v-list-item-title>
            </v-list-item>
          </template>
        </template>

   
        <template v-else>
          <v-list-item>
            <v-list-item-title>No items available</v-list-item-title>
          </v-list-item>
        </template>
      </v-list>
    </div>
  </div>
</template>
<!-- <style>
.hover-icon {
  color: #304FFE;
  transition: color 0.3s;
}

.hover-icon:hover {
  color: #FF6F00;
}
</style> -->
