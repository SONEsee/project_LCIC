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
const fireworkButton = ref<HTMLElement | null>(null);

// ✅ เพิ่ม state สำหรับจัดการ error ของรูปภาพ
const imageError = ref(false);
const imageErrorLarge = ref(false);

// ✅ เพิ่ม state สำหรับ firework animation
const showFirework = ref(false);

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

// ✅ ฟังก์ชันสำหรับเล่น firework animation
const triggerFirework = () => {
  console.log('🎆 Firework triggered!');
  console.log('Before:', showFirework.value);
  showFirework.value = true;
  console.log('After:', showFirework.value);
  
  // สร้าง firework particles แบบ manual ด้วย JavaScript
  if (fireworkButton.value) {
    const rect = fireworkButton.value.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    console.log('Button position:', centerX, centerY);
    
    // สร้าง 8 particles
    const colors = [
      { bg: 'radial-gradient(circle, #ffd700, #ff8c00)', shadow: '#ffd700', name: '1' },
      { bg: 'radial-gradient(circle, #ff6b6b, #ee5a6f)', shadow: '#ff6b6b', name: '2' },
      { bg: 'radial-gradient(circle, #4ecdc4, #00d2d3)', shadow: '#4ecdc4', name: '3' },
      { bg: 'radial-gradient(circle, #a855f7, #c56cf0)', shadow: '#a855f7', name: '4' },
      { bg: 'radial-gradient(circle, #ff9f43, #ffa502)', shadow: '#ff9f43', name: '5' },
      { bg: 'radial-gradient(circle, #ee5a6f, #ff6348)', shadow: '#ee5a6f', name: '6' },
      { bg: 'radial-gradient(circle, #00d2d3, #1dd1a1)', shadow: '#00d2d3', name: '7' },
      { bg: 'radial-gradient(circle, #c56cf0, #d63031)', shadow: '#c56cf0', name: '8' }
    ];
    
    colors.forEach((color, i) => {
      // Delay แต่ละ particle เล็กน้อยเพื่อให้ดูเป็นธรรมชาติ
      setTimeout(() => {
        const particle = document.createElement('div');
        particle.className = `firework-particle-manual`;
        particle.style.cssText = `
          position: fixed;
          left: ${centerX}px;
          top: ${centerY}px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: ${color.bg};
          box-shadow: 0 0 15px ${color.shadow}, 0 0 30px ${color.shadow};
          pointer-events: none;
          z-index: 999999;
          margin-left: -4px;
          margin-top: -4px;
        `;
        
        document.body.appendChild(particle);
        console.log(`Particle ${i + 1} created at`, centerX, centerY);
        
        // Animation - ใช้ bezier curve ที่นุ่มนวล
        const angle = (i * 45) * Math.PI / 180;
        const distance = 70; // เพิ่มระยะทางเล็กน้อย
        const endX = centerX + Math.cos(angle) * distance;
        const endY = centerY + Math.sin(angle) * distance;
        
        // เพิ่ม trail effect - สร้าง particle เล็กตามหลัง
        for (let j = 0; j < 3; j++) {
          setTimeout(() => {
            const trail = document.createElement('div');
            trail.style.cssText = `
              position: fixed;
              left: ${centerX}px;
              top: ${centerY}px;
              width: 4px;
              height: 4px;
              border-radius: 50%;
              background: ${color.bg};
              box-shadow: 0 0 10px ${color.shadow};
              pointer-events: none;
              z-index: 999998;
              margin-left: -2px;
              margin-top: -2px;
            `;
            
            document.body.appendChild(trail);
            
            const trailDistance = distance * (0.3 + j * 0.2);
            const trailEndX = centerX + Math.cos(angle) * trailDistance;
            const trailEndY = centerY + Math.sin(angle) * trailDistance;
            
            trail.animate([
              { 
                left: `${centerX}px`, 
                top: `${centerY}px`,
                opacity: 0.6,
                transform: 'scale(1)'
              },
              { 
                left: `${trailEndX}px`, 
                top: `${trailEndY}px`,
                opacity: 0,
                transform: 'scale(0.2)'
              }
            ], {
              duration: 800,
              easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              delay: 50
            });
            
            setTimeout(() => trail.remove(), 900);
          }, j * 30);
        }
        
        // Main particle animation
        particle.animate([
          { 
            left: `${centerX}px`, 
            top: `${centerY}px`,
            opacity: 1,
            transform: 'scale(0.5)'
          },
          { 
            left: `${centerX + Math.cos(angle) * (distance * 0.3)}px`, 
            top: `${centerY + Math.sin(angle) * (distance * 0.3)}px`,
            opacity: 1,
            transform: 'scale(1.2)',
            offset: 0.3
          },
          { 
            left: `${endX}px`, 
            top: `${endY}px`,
            opacity: 0,
            transform: 'scale(0.3)'
          }
        ], {
          duration: 1200,
          easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });
        
        // ลบ particle หลังจาก animation เสร็จ
        setTimeout(() => {
          particle.remove();
          console.log(`Particle ${i + 1} removed`);
        }, 1300);
      }, i * 25); // Stagger effect - แต่ละ particle ออกห่างกัน 25ms
    });
  }
  
  setTimeout(() => {
    showFirework.value = false;
    console.log('Firework ended');
  }, 1500);
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
      style="width: 280px;  overflow: hidden;"
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
      <div class="px-5 pb-4" style="margin-top: -40px; position: relative; overflow: visible;" v-if="user">
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
              <div class="text-caption text-grey">ລະຫັດທະນາຄານ</div>
            </div>
            <v-divider vertical></v-divider>
            <div class="text-center">
              <div class="text-h7 font-weight-bold " style="color: #268055;">{{ user.GID?.nameL }}</div>
              <div class="text-caption text-grey">ສິດການນຳໃຊ້</div>
            </div>
          </div>

          <!-- Action Buttons Row -->
          <div class="d-flex gap-2 ml-6" style="position: relative; overflow: visible;">
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
            
            <!-- ✅ Wrapper สำหรับปุ่ม + firework -->
            <div style="position: relative; display: inline-block; z-index: 1000;" ref="fireworkButton">
              <v-btn
                icon
                variant="outlined"
                color="#2931a5"
                size="large"
                class="firework-btn"
                style="border-radius: 12px; border-width: 2px; width: 40px;"
                @click.stop="triggerFirework"
                :class="{ 'btn-burst': showFirework }"
              >
                <v-icon icon=" mdi-gift" size="20"></v-icon>
              </v-btn>
            </div>
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

/* ✅ Firework Button Styles */
.firework-btn {
  position: relative;
  transition: all 0.2s ease;
}

/* ✅ Button Burst Animation - นุ่มนวลขึ้น */
.btn-burst {
  animation: btnBurst 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
}

@keyframes btnBurst {
  0% { transform: scale(1) rotate(0deg); }
  30% { transform: scale(1.15) rotate(-8deg); }
  50% { transform: scale(0.98) rotate(8deg); }
  70% { transform: scale(1.05) rotate(-3deg); }
  100% { transform: scale(1) rotate(0deg); }
}

/* ✅ Firework Fade Transition */
.firework-fade-enter-active,
.firework-fade-leave-active {
  transition: opacity 0.3s ease;
}

.firework-fade-enter-from,
.firework-fade-leave-to {
  opacity: 0;
}

/* ✅ Firework Container - วางนอกปุ่ม */
.firework-outer {
  position: fixed !important;
  top: 50% !important;
  left: 50% !important;
  width: 1px;
  height: 1px;
  pointer-events: none;
  z-index: 999999 !important;
  transform: translate(-50%, -50%);
}

/* ✅ Firework Particles ที่สร้างด้วย JavaScript */
.firework-particle {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  z-index: 999999;
  margin-left: -5px;
  margin-top: -5px;
}

.firework-particle-1 { 
  background: radial-gradient(circle, #ffd700, #ff8c00);
  box-shadow: 0 0 20px #ffd700, 0 0 40px #ffd700, 0 0 60px #ff8c00;
  animation: explode1 0.9s ease-out forwards;
}

.firework-particle-2 { 
  background: radial-gradient(circle, #ff6b6b, #ee5a6f);
  box-shadow: 0 0 20px #ff6b6b, 0 0 40px #ff6b6b, 0 0 60px #ee5a6f;
  animation: explode2 0.9s ease-out forwards;
}

.firework-particle-3 { 
  background: radial-gradient(circle, #4ecdc4, #00d2d3);
  box-shadow: 0 0 20px #4ecdc4, 0 0 40px #4ecdc4, 0 0 60px #00d2d3;
  animation: explode3 0.9s ease-out forwards;
}

.firework-particle-4 { 
  background: radial-gradient(circle, #a855f7, #c56cf0);
  box-shadow: 0 0 20px #a855f7, 0 0 40px #a855f7, 0 0 60px #c56cf0;
  animation: explode4 0.9s ease-out forwards;
}

.firework-particle-5 { 
  background: radial-gradient(circle, #ff9f43, #ffa502);
  box-shadow: 0 0 20px #ff9f43, 0 0 40px #ff9f43, 0 0 60px #ffa502;
  animation: explode5 0.9s ease-out forwards;
}

.firework-particle-6 { 
  background: radial-gradient(circle, #ee5a6f, #ff6348);
  box-shadow: 0 0 20px #ee5a6f, 0 0 40px #ee5a6f, 0 0 60px #ff6348;
  animation: explode6 0.9s ease-out forwards;
}

.firework-particle-7 { 
  background: radial-gradient(circle, #00d2d3, #1dd1a1);
  box-shadow: 0 0 20px #00d2d3, 0 0 40px #00d2d3, 0 0 60px #1dd1a1;
  animation: explode7 0.9s ease-out forwards;
}

.firework-particle-8 { 
  background: radial-gradient(circle, #c56cf0, #d63031);
  box-shadow: 0 0 20px #c56cf0, 0 0 40px #c56cf0, 0 0 60px #d63031;
  animation: explode8 0.9s ease-out forwards;
}

/* ✅ Explosion Animations - 8 ทิศทาง */
@keyframes explode1 {
  0% { transform: translate(0, 0) scale(1); opacity: 1; }
  100% { transform: translate(50px, 0) scale(0.3); opacity: 0; }
}

@keyframes explode2 {
  0% { transform: translate(0, 0) scale(1); opacity: 1; }
  100% { transform: translate(35px, -35px) scale(0.3); opacity: 0; }
}

@keyframes explode3 {
  0% { transform: translate(0, 0) scale(1); opacity: 1; }
  100% { transform: translate(0, -50px) scale(0.3); opacity: 0; }
}

@keyframes explode4 {
  0% { transform: translate(0, 0) scale(1); opacity: 1; }
  100% { transform: translate(-35px, -35px) scale(0.3); opacity: 0; }
}

@keyframes explode5 {
  0% { transform: translate(0, 0) scale(1); opacity: 1; }
  100% { transform: translate(-50px, 0) scale(0.3); opacity: 0; }
}

@keyframes explode6 {
  0% { transform: translate(0, 0) scale(1); opacity: 1; }
  100% { transform: translate(-35px, 35px) scale(0.3); opacity: 0; }
}

@keyframes explode7 {
  0% { transform: translate(0, 0) scale(1); opacity: 1; }
  100% { transform: translate(0, 50px) scale(0.3); opacity: 0; }
}

@keyframes explode8 {
  0% { transform: translate(0, 0) scale(1); opacity: 1; }
  100% { transform: translate(35px, 35px) scale(0.3); opacity: 0; }
}
</style>