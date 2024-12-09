<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useSidebar } from "./sidebarItems"; // Import the useSidebar composable

interface User {
  username: string;
  GID: { GID: number }; // Adjusted structure for nested GID
}

// Reactive references
const user = ref<User | null>(null);
const sidebarItems = ref([]); // Initialize sidebarItems as an empty array

// Fetch Sidebar Items
onMounted(async () => {
  const fetchedItems = await useSidebar(); // Await the sidebar fetching logic
  sidebarItems.value = fetchedItems.value || []; // Populate the reactive sidebarItems
  console.log("Sidebar Items fetched:", sidebarItems.value);
});

// Fetch user data from localStorage
onMounted(() => {
  const userData = localStorage.getItem("user_data");
  if (userData) {
    user.value = JSON.parse(userData);
    console.log("User fetched:", user.value);
    console.log("User GID:", user.value?.GID?.GID); // Log nested GID
  }
});

// Filter sidebar items based on the user's nested GID
const filteredSidebarItems = computed(() => {
  if (!user.value || !user.value.GID) return []; // Return an empty array if user or GID is not available
  const userGID = user.value.GID.GID; // Access the nested GID
  return sidebarItems.value.filter((item) => item.roles.includes(userGID));
});
</script>

<template>
  <div>
    <div class="scrollnavbar">
      <div class="profile">
        <!-- Add profile-related content if needed -->
      </div>
      <v-list class="pa-4">
        <!-- Check if filteredSidebarItems has items -->
        <template v-if="filteredSidebarItems.length > 0">
          <template v-for="(item, i) in filteredSidebarItems" :key="i">
            <v-list-item
              :to="item.url"
              rounded="lg"
              class="mb-1"
              :class="{ 'active-item': $route.path === item.url }"
            >
              <template v-slot:prepend>
                <v-icon :icon="item.icon" style="color: #304FFE;"></v-icon>
              </template>
              <v-list-item-title v-text="item.name"></v-list-item-title>
            </v-list-item>
          </template>
        </template>

        <!-- Fallback if no sidebar items are available -->
        <template v-else>
          <v-list-item>
            <v-list-item-title>No items available</v-list-item-title>
          </v-list-item>
        </template>
      </v-list>
    </div>
  </div>
</template>
