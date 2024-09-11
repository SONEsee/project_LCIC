<script setup lang="ts">
import sidebarItems from "./sidebarItems";
const sidebarMenu = ref(sidebarItems);
const user = ref<User | null>(null);

onMounted(() => {
  const userData = localStorage.getItem('user_data');
  if (userData) {
    user.value = JSON.parse(userData);
    console.log('User data:', user.value);
  }
});

</script>

<template>
  <div>
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
        <div class="profile-name text-center" v-if="user">
          <h3 style="color: aliceblue;">{{ user.username }}</h3>
        </div>
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

.active-item {
  background-color: #1565C0 !important; 
  color: white !important;
}
</style>
