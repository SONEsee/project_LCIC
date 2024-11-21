<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { getSidebarItems } from './sidebarItems';

interface User {
  username: string;
}

const { t } = useI18n();
const user = ref<User | null>(null);

// ເຮັດໃຫ້ sidebarMenu ປ່ຽນທັນທີເມື່ອປ່ຽນພາສາ
const sidebarMenu = computed(() => getSidebarItems(t));

onMounted(() => {
  const userData = localStorage.getItem('user_data');
  if (userData) {
    user.value = JSON.parse(userData);
  }
});
</script>

<template>
  <div>
    <div class="scrollnavbar">
      <div class="profile"> 
        <!-- Profile section here -->
      </div>
      <v-list class="pa-4">
        <template v-for="(item, i) in sidebarMenu" :key="i">
          <v-list-item
            :to="item.to"
            rounded="lg"
            class="mb-1"
            :class="{ 'active-item': $route.path === item.to }"
          >
            <template v-slot:prepend>
              <v-icon :icon="item.icon" style="color: #304FFE;"></v-icon>
            </template>
            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item>
        </template>
      </v-list>
    </div>
  </div>
</template>

<style scoped>
.profile-name {
  font-size: 18px;
}
.active-item {
  background-color: #1A237E !important; 
  color: white !important;
}
</style>
