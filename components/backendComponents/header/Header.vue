<script setup lang="ts">
import { useRouter, useCookie } from "nuxt/app";
import { onMounted, ref, watch } from "vue";
import { User } from "@/types/user";
import { message, notification, profile } from "./headerItems";

const router = useRouter();
const href = ref(undefined);
const notifications = ref(notification);
const messages = ref(message);
const timeout = ref<number | null>(null);
const userprofile = ref(profile);
const user = ref<User | null>(null);
const { locale, setLocale } = useI18n();

const signOut = () => {
  localStorage.removeItem("access_token");
  const token = useCookie("access_token");

  localStorage.removeItem('bank_filter_search');
  localStorage.removeItem('user_data');
  token.value = null;
  router.push({ path: "/" });
};

const resetTimeout = () => {
  if (timeout.value) {
    clearTimeout(timeout.value);
  }
  timeout.value = setTimeout(signOut, 30 * 60 * 1000);
};

const events = ["mousemove", "click", "keydown"];

const setupInactivityTimer = () => {
  resetTimeout();
  events.forEach((event) => {
    window.addEventListener(event, resetTimeout);
  });
};

onMounted(() => {
  const userData = localStorage.getItem("user_data");
  if (userData) {
    user.value = JSON.parse(userData);
  }
  console.log(userData, "usertest");
  const image = localStorage.getItem("profile_image");

  
  const usertest = localStorage.getItem("user");
  if (usertest) {
    user.value = JSON.parse(usertest);
    console.log(user.value, "user");
  }

  setupInactivityTimer();
});
</script>

<template>
  <v-menu anchor="bottom end" origin="auto" min-width="300">
    <template v-slot:activator="{ props }">
      <div class="d-flex">
        <v-btn
          icon
          class="mx-3"
          color="white"
          @click="setLocale(locale === 'en' ? 'lo' : 'en')"
        >
          <img
            v-if="locale === 'en'"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Flag_of_the_United_Kingdom_%281-2%29.svg/800px-Flag_of_the_United_Kingdom_%281-2%29.svg.png"
            style="width: 24px; height: 24px"
          />
          <img
            v-else-if="locale === 'en'"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Flag_of_the_United_Kingdom_%281-2%29.svg/800px-Flag_of_the_United_Kingdom_%281-2%29.svg.png"
            alt="Laos Flag"
            style="width: 24px; height: 24px"
          />
          <img
            v-else
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Flag_of_Laos.svg/1200px-Flag_of_Laos.svg.png"
            alt="Laos Flag"
            style="width: 24px; height: 24px"
          />
        </v-btn>

        <v-btn icon class="mx-3">
          <v-avatar size="35" v-if="user">
            <img
              :src="user.profile_image"
              width="35"
              alt="sone"
            />
          </v-avatar>

          <v-menu activator="parent">
            <v-list class="pa-6" elevation="10" rounded="lg">
              <h4 class="font-weight-medium fs-18">ໂປຟາຍຂອງຂອ້ຍ</h4>
              <div class="d-flex align-center my-4" v-if="user">
                <img
                  :src="user.profile_image"
                  alt="Sone SEEDAVANH"
                  class="rounded-circle"
                  width="100"
                  height="100"
                />
                <div class="ml-4">
                  <h4 class="font-weight-medium fs-18">{{ user.username }}</h4>
                  <span class="subtitle-2 font-weight-light">{{
                    user.MID?.code
                  }}</span>
                  <div class="d-flex align-center">
                    <v-icon
                      icon="mdi-email-outline"
                      class="d-flex grey--text"
                      size="16"
                    ></v-icon>
                    <span class="subtitle-2 font-weight-light ml-1"
                      >sone@gmail.com</span
                    >
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
              <v-btn
                block
                color="secondary"
                variant="tonal"
                class="mt-4 py-4"
                @click="signOut()"
              >
                ອອກຈາກລະບົບ
              </v-btn>
            </v-list>
          </v-menu>
        </v-btn>
      </div>
    </template>
  </v-menu>
</template>
