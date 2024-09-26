<script setup lang="ts">
import { message, notification, profile } from "./headerItems";
import { User } from "@/types/user";
import { ref, onMounted } from 'vue';
import { useRouter, useCookie } from 'nuxt/app';

const href = ref(undefined);
const messages = ref(message);
const notifications = ref(notification);
const userprofile = ref(profile);

// Define user with the type User or null (in case it's not loaded yet)
const user = ref<User | null>(null);

onMounted(() => {
  const userData = localStorage.getItem('user_data');
  if (userData) {
    user.value = JSON.parse(userData);
    console.log('User data:', user.value);
  }
});

// sign out method
const signOut = () => {
  const token = useCookie("access_token");

  // Remove token from cookie
  token.value = null;

  // Redirect to login page
  useRouter().push({ path: "/" });
};
</script>

<template>
  <v-menu anchor="bottom end" origin="auto" min-width="300" style="background-color: red;">
    <template v-slot:activator="{ props }">
      <div class="d-flex">
        <!-- User Profile -->
        <v-btn icon class="mx-3">
          <v-avatar size="35">
            <img
              src="https://img.freepik.com/free-photo/abstract-autumn-beauty-multi-colored-leaf-vein-pattern-generated-by-ai_188544-9871.jpg?size=626&ext=jpg&ga=GA1.1.2082370165.1716249600&semt=ais_user"
              width="35"
              alt="sone"
            />
          </v-avatar>

          <v-menu activator="parent">
            <v-list class="pa-6" elevation="10" rounded="lg">
              <h4 class="font-weight-medium fs-18">ໂປຟາຍຂອງຂອ້ຍ</h4>
              <div class="d-flex align-center my-4" v-if="user">
                <img
                  src="https://img.freepik.com/free-photo/abstract-autumn-beauty-multi-colored-leaf-vein-pattern-generated-by-ai_188544-9871.jpg?size=626&ext=jpg&ga=GA1.1.2082370165.1716249600&semt=ais_user"
                  alt="Sone SEEDAVANH"
                  class="rounded-circle"
                  width="100"
                  height="100"
                />
                <div class="ml-4">
                  <h4 class="font-weight-medium fs-18">{{ user.username }}</h4>
                  <span class="subtitle-2 font-weight-light">{{ user.MID?.code }}</span>
                  <div class="d-flex align-center">
                    <v-icon
                      icon="mdi-email-outline"
                      class="d-flex grey--text"
                      size="16"
                    ></v-icon>
                    <span class="subtitle-2 font-weight-light ml-1">sone@gmail.com</span>
                  </div>
                </div>
              </div>
              <v-list-item
                class="pa-3 mb-2"
                v-for="(item, index) in userprofile"
                :key="index"
                :value="index"
                :title="item.title"
                :subtitle="item.desc"
              >
                <template v-slot:prepend>
                  <v-btn
                    :color="item.color"
                    variant="tonal"
                    icon
                    elevation="0"
                    class="mr-3"
                  >
                    <v-icon :icon="item.icon" size="24"></v-icon>
                  </v-btn>
                </template>
              </v-list-item>
              <v-btn block color="secondary" variant="tonal" class="mt-4 py-4" @click="signOut()">
                ອອກຈາກລະບົບ
              </v-btn>
            </v-list>
          </v-menu>
        </v-btn>
      </div>
    </template>
  </v-menu>
</template>
