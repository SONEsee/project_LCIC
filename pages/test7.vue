
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

const userProfiles = ref([]); 

onMounted(async () => {
  try {
    const response = await axios.get('http://127.0.0.1:35729/api/api/get_login3/');
    userProfiles.value = response.data;
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
  }
});
</script>

<template>
  <div>
    <h1 class="profile-name">Profiles</h1>
    <div v-for="(profile, index) in userProfiles" :key="index" class="profile">
      <p>Name: {{ profile.customer_id}}</p>
      <p>Name: {{ profile.collateral_insert_date}}</p>
      <p>Name: {{ profile.customer_id}}</p>
      <p>Name: {{ profile.customer_id}}</p>
     
    </div>
  </div>
</template>

<style scoped>
.profile-name {
  font-size: 18px;
}
.profile {
  margin-bottom: 10px;
}
</style>
