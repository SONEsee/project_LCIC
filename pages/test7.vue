
<script setup lang="ts">
import { useUserProfile } from './test7sc';
console.log(useUserProfile)

const { userProfiles } = useUserProfile();
console.log(userProfiles.value)
</script>
<template>
  <div>
    <h1 class="profile-name">Profiles</h1>
    <div
      v-for="(profile, index) in userProfiles"
      :key="index"
      class="profile"
    >
      {{ profile}}
     
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
