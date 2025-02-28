<script setup lang="ts">
import { useDisplay } from "vuetify";
import Sidebar from "~/components/backendComponents/sidebar/Sidebar.vue";
import Header from "~/components/backendComponents/header/Header.vue";
import { ref, onMounted } from "vue";
import { useTheme } from "vuetify";


const theme = useTheme();


const currentTheme = ref<"light" | "dark">("light");


onMounted(() => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light" || savedTheme === "dark") {
    currentTheme.value = savedTheme;
    theme.global.name.value = savedTheme; 
  } else {
   
    currentTheme.value = "light";
    theme.global.name.value = "light";
    localStorage.setItem("theme", "light");
  }
});


function onClick() {
  currentTheme.value = currentTheme.value === "light" ? "dark" : "light";
  theme.global.name.value = currentTheme.value; 
  localStorage.setItem("theme", currentTheme.value); 
}

const drawer = ref(undefined || true);
const { mdAndUp, mdAndDown } = useDisplay();
</script>
<template>
  <div>
    <v-app :theme="theme">
      
      <!-- ---------------------------------------------- -->
      <!---Header -->
      <!-- ---------------------------------------------- -->
      <v-app-bar elevation="0" class="bg-indigo-darken-4">
        <div class="pe-5">
          <NuxtLink to="/backend/dashboard" class="d-flex brand">
            <img
              :width="60"
              aspect-ratio="16/9"
              cover
              src="../assets/images/logo1.png"
              class="hidden-sm-and-down"
            />
          </NuxtLink>
        </div>
        <v-app-bar-nav-icon class="" @click="drawer = !drawer" />
        <v-spacer />
        <v-btn
    :prepend-icon="currentTheme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
    slim
    @click="onClick"
  ></v-btn>
        <!-- ---------------------------------------------- -->
        <!-- User Profile -->
        <!-- ---------------------------------------------- -->
        <Header />
      </v-app-bar>
      <v-main>
        <!-- ---------------------------------------------- -->
        <!---Sidebar -->
        <!-- ---------------------------------------------- -->
        <v-navigation-drawer
          left
          :permanent="mdAndUp"
          elevation="10"
          app
          :temporary="mdAndDown"
          v-model="drawer"
          expand-on-hover
        >
          <Sidebar />
        </v-navigation-drawer>
        <v-container fluid class="page-wrapper">
          <slot />
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>

<style scoped>
.brand {
  font-size: 20px;
  color: #fff;
  padding-left: 20px;
  text-decoration: none;
  font-weight: bold;
}
</style>
