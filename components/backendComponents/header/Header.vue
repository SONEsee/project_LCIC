<script setup lang="ts">
import { useRouter, useCookie } from "nuxt/app";
import { onMounted, onBeforeUnmount, ref, computed } from "vue";
import { User } from "@/types/user";
import { message, notification } from "./headerItems";

const config = useRuntimeConfig();
const router = useRouter();
const notifications = ref(notification);
const messages = ref(message);
const timeout = ref<number | null>(null);
const user = ref<User | null>(null);
const { locale, setLocale } = useI18n();

// ✅ เพิ่ม state สำหรับจัดการ error ของรูปภาพ
const imageError = ref(false);
const imageErrorLarge = ref(false);

// ✅ API endpoint
const apiLogout = `${config.public.strapi.url}api/logout_update/`;

// ✅ Computed สำหรับ URL รูปโปรไฟล์
const profileImageUrl = computed(() => {
  if (!user.value?.profile_image) {
    return '';
  }

  const imagePath = user.value.profile_image;
  
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  const baseUrl = config.public.strapi.url.endsWith('/') 
    ? config.public.strapi.url.slice(0, -1) 
    : config.public.strapi.url;
  
  return `${baseUrl}/media${cleanPath}`;
});

// ✅ ฟังก์ชัน Logout พร้อม remark
const performLogout = (logoutType: string) => {
  const access_token = localStorage.getItem("access_token");
  const refresh_token = localStorage.getItem("refresh_token");

  let remarks = "";
  switch (logoutType) {
    case "manual":
      remarks = "Logout - Manual logout by user";
      break;
    case "auto":
      remarks = "Logout - Auto logout (30 minutes inactivity)";
      break;
    default:
      remarks = "Logout - Unknown";
  }

  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("bank_filter_search");
  localStorage.removeItem("user_data");
  
  const token = useCookie("access_token");
  token.value = null;

  if (access_token) {
    fetch(apiLogout, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${access_token}`
      },
      body: JSON.stringify({
        refresh_token: refresh_token,
        remarks: remarks
      })
    }).catch(() => {});
  }

  // ✅ Redirect ไปหน้า login
  router.push({ path: "/" });
};

// ✅ Manual Logout
const signOut = () => {
  performLogout("manual");
};

// ✅ Auto Logout
const autoLogout = () => {
  performLogout("auto");
};

// ✅ Reset timeout
const resetTimeout = () => {
  if (timeout.value) {
    clearTimeout(timeout.value);
  }
  timeout.value = setTimeout(autoLogout, 30 * 60 * 1000);
};

const events = ["mousemove", "click", "keydown"];

const setupInactivityTimer = () => {
  resetTimeout();
  events.forEach((event) => {
    window.addEventListener(event, resetTimeout);
  });
};

// ✅ ฟังก์ชันไปหน้า User Profile
const goToProfile = () => {
  // router.push({ path: "/profile_edit" });
};

onMounted(() => {
  const userData = localStorage.getItem("user_data");
  if (userData) {
    user.value = JSON.parse(userData);
    imageError.value = false;
    imageErrorLarge.value = false;
    console.log('✅ User data:', user.value);
    console.log('✅ Profile image path:', user.value?.profile_image);
    console.log('✅ Profile image URL:', profileImageUrl.value);
  }
  
  setupInactivityTimer();
  
});

onBeforeUnmount(() => {
  
  events.forEach((event) => {
    window.removeEventListener(event, resetTimeout);
  });
  if (timeout.value) {
    clearTimeout(timeout.value);
  }
});
</script>

<template>
  <v-menu anchor="bottom end" origin="auto" min-width="380">
    <template v-slot:activator="{ props }">
      <div class="d-flex align-center">
        <!-- ✅ ปุ่มเปลี่ยนภาษา -->
        <v-tooltip text="ປ່ຽນພາສາ" location="bottom">
          <template v-slot:activator="{ props: tooltipProps }">
            <v-btn
              icon
              class="mx-3"
              color="white"
              v-bind="tooltipProps"
              @click="setLocale(locale === 'en' ? 'lo' : 'en')"
            >
              <img
                v-if="locale === 'en'"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Flag_of_the_United_Kingdom_%281-2%29.svg/800px-Flag_of_the_United_Kingdom_%281-2%29.svg.png"
                style="width: 24px; height: 24px"
              />
              <img
                v-else
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Flag_of_Laos.svg/1200px-Flag_of_Laos.svg.png"
                alt="Laos Flag"
                style="width: 24px; height: 24px"
              />
            </v-btn>
          </template>
        </v-tooltip>

        <!-- ✅ ปุ่มโปรไฟล์เล็ก -->
        <v-btn icon variant="text" class="mx-2" v-bind="props">
          <v-badge
            dot
            color="success"
            location="bottom right"
            offset-x="2"
            offset-y="2"
          >
            <div 
              style="
                width: 40px; 
                height: 40px; 
                border: 2px solid #e3f2fd; 
                border-radius: 50%; 
                overflow: hidden;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #f5f5f5;
              "
            >
              <img
                v-if="user && profileImageUrl && !imageError"
                :src="profileImageUrl"
                alt="profile"
                style="width: 100%; height: 100%; object-fit: cover; display: block;"
                @error="imageError = true"
              />
              <v-icon 
                v-else
                icon="mdi-account-circle" 
                size="32" 
                color="#2931a5"
              ></v-icon>
            </div>
          </v-badge>
        </v-btn>
      </div>
    </template>

    <!-- ✅ Social Media Style Menu -->
    <v-card 
      class="mx-auto" 
      elevation="16" 
      rounded="xl"
      style="width: 280px;"
    >
      <!-- Cover Photo -->
      <div 
        style="
          height: 80px;
          background: linear-gradient(135deg, #2931a5 0%, #2233a1 50%, #6366f1 100%);
          position: relative;
        "
      >
        <!-- Pattern Overlay -->
        <div style="position: absolute; inset: 0; background-image: url('data:image/svg+xml,%3Csvg width=&quot;100&quot; height=&quot;100&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cdefs%3E%3Cpattern id=&quot;grid&quot; width=&quot;20&quot; height=&quot;20&quot; patternUnits=&quot;userSpaceOnUse&quot;%3E%3Ccircle cx=&quot;10&quot; cy=&quot;10&quot; r=&quot;1&quot; fill=&quot;white&quot; opacity=&quot;0.3&quot;/%3E%3C/pattern%3E%3C/defs%3E%3Crect width=&quot;100&quot; height=&quot;100&quot; fill=&quot;url(%23grid)&quot;/%3E%3C/svg%3E'); opacity: 0.5;"></div>
      </div>

      <!-- Profile Section -->
      <div class="px-5 pb-4" style="margin-top: -40px; position: relative;" v-if="user">
        <div class="text-center">
          <!-- Profile Picture with Ring -->
          <div style="display: inline-block; position: relative;">
            <div 
              style="
                width: 90px; 
                height: 90px; 
                border-radius: 50%; 
                padding: 4px; 
                background: linear-gradient(135deg, #2931a5, #6366f1, #8b5cf6);
                animation: rotate 3s linear infinite;
              "
            >
              <div
                style="
                  width: 100%;
                  height: 100%;
                  border-radius: 50%;
                  padding: 3px;
                  background: white;
                "
              >
                <div
                  style="
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #f5f5f5;
                  "
                >
                  <img
                    v-if="profileImageUrl && !imageErrorLarge"
                    :src="profileImageUrl"
                    alt="User Profile"
                    style="width: 100%; height: 100%; object-fit: cover; display: block;"
                    @error="imageErrorLarge = true"
                  />
                  <v-icon 
                    v-else
                    icon="mdi-account-circle" 
                    size="62" 
                    color="#2931a5"
                  ></v-icon>
                </div>
              </div>
            </div>
            <!-- Verified Badge -->
            <div 
              style="
                position: absolute; 
                bottom: 0; 
                right: 0; 
                width: 28px; 
                height: 28px; 
                background: #2931a5; 
                border: 3px solid white; 
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
              "
            >
              <v-icon icon="mdi-check" color="white" size="16"></v-icon>
            </div>
          </div>

          <!-- User Info -->
          <h3 class="text-h5 font-weight-bold mt-3 mb-1" style="color: #1a1a1a;">
            {{ user.username }}
          </h3>
          
          <p class="text-body-2 text-grey-darken-1 mb-2">
            {{ user.nameL }} {{ user.surnameL }}
          </p>

          <!-- Stats Row -->
          <div class="d-flex justify-center gap-4 my-4">
            <div class="text-center">
              <div class="text-h7 font-weight-bold" style="color: #2931a5;">{{ user.MID?.code }}{{ user.MID?.id ? ' - ' + user.MID.id : '' }}</div>
              <div class="text-caption text-grey">ລະຫັດ</div>
            </div>
            <v-divider vertical></v-divider>
            <div class="text-center">
              <div class="text-h7 font-weight-bold text-success">ກຳລັງໃຊ້ງານ</div>
              <div class="text-caption text-grey">ສະຖານະ</div>
            </div>
          </div>

          <!-- Action Buttons Row -->
          <div class="d-flex gap-2 ml-6">
            <v-btn
              @click="goToProfile()"
              variant="flat"
              color="#2931a5"
              class="flex-1 text-subtitle-2"
              size="large"
              style="border-radius: 12px; font-weight: 600; width: 140px;"
            >
              <v-icon icon="mdi-account-edit" class="mr-2" size="25"></v-icon>
              ແກ້ໄຂໂປຣໄຟລ໌
            </v-btn>
            <v-btn
              icon
              @click="goToProfile()"
              variant="outlined"
              color="#2931a5"
              size="large"
              style="border-radius: 12px; border-width: 2px; width: 40px;"
            >
              <v-icon icon="mdi-star-shooting" size="20"></v-icon>
            </v-btn>
          </div>
        </div>
      </div>

      <!-- Menu Options -->
      <v-list class="py-2 ml-8">
        <v-divider></v-divider>
        <v-list-item class="px-5" @click="signOut()">
          <template v-slot:prepend>
            <v-avatar color="red-lighten-5" size="40">
              <v-icon icon="mdi-logout" color="error" size="25"></v-icon>
            </v-avatar>
          </template>
          <v-list-item-title class="font-weight-medium text-error">ອອກຈາກລະບົບ</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<style scoped>
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.gap-2 {
  gap: 8px;
}

.gap-4 {
  gap: 16px;
}

.v-list-item {
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.v-list-item:hover {
  background-color: rgba(41, 49, 165, 0.05);
}
</style>