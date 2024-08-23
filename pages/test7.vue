<script setup lang="ts">

import { ref, onMounted } from 'vue';
import axios from 'axios';

const userProfile = ref({});

onMounted(async () => {
  try {
    const response = await axios.get('http://127.0.0.1:35729/api/api/user-profile/');
    userProfile.value = response.data;
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
  }
});

</script>

<template>
  <div>
    <!-- ---------------------------------------------- -->
    <!---Navigation -->
    <!-- ---------------------------------------------- -->
    <div class="scrollnavbar">
      <div class="profile"> 
        <div class="profile-pic">
          <v-avatar size="45">
            <img
              src="https://img.freepik.com/free-photo/abstract-autumn-beauty-multi-colored-leaf-vein-pattern-generated-by-ai_188544-9871.jpg?size=626&ext=jpg&ga=GA1.1.2082370165.1716249600&semt=ais_user"
              width="50"
              alt="sone"
            />
          </v-avatar>
        </div>
        <div class="profile-name">
          <h3 style="color: aliceblue;">
            {{ userProfile.nameL }} {{ userProfile.surnameL }}
          </h3>
        </div>
      </div>
      <v-list class="pa-4">
        <template v-for="(item, i) in sidebarMenu" :key="i">
          <v-list-item :to="item.to" rounded="lg" class="mb-1">
            <template v-slot:prepend>
              <v-icon :icon="item.icon"></v-icon>
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
</style>
