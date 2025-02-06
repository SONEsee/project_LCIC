<script setup lang="ts">

import axios from "axios";
import { ref, onMounted } from "vue";
interface Props {
  item: any[];
}

defineProps<Props>();


interface User {
  MID?: {
    id: string;
  };
}
const item = ref([]);
const userData = localStorage.getItem("user_data") || "{}";
const user = JSON.parse(userData) as User;
const user_id = user?.MID?.id ?? "";
const bnk_code = user?.MID?.id ?? "";
const Getdata = async () => {
  try {
    const config = useRuntimeConfig();
    const res = await axios.get(
      `${config.public.strapi.url}api/dashboard/loan-count-by-month/?bnk_code=${bnk_code}`
    );
    if (res.status === 200) {
      item.value = res.data;
      console.log("success");
    }
  } catch (error) {}
};
onMounted(Getdata);
console.log("user", user_id);
definePageMeta({
  layout: "backend",
  middleware: ["auth"],
});

useHead({
  title: "Dashboard",
  meta: [
    {
      name: "keywords",
      content: "Dashboard, Nuxt 3, Backend",
    },
    {
      name: "Description",
      content: "Dashboard Nuxt 3,  IT Genius Engineering",
    },
  ],
});
</script>

<template>
  <div class="text-center position-relative">
    <div class="rocket-container">
      <div class="smoke-container">
        <div v-for="n in 8" :key="n" class="smoke-particle"></div>
      </div>
      <img
        src="@/public/images/robott1.png"
        alt=""
        size="64"
        width="64"
        class="rocket-image"
      />
      <div class="flame"></div>
    </div>
  </div>
</template>
<style scoped>
.rocket-container {
  position: relative;
  display: inline-block;
  animation: pre-launch 0.5s infinite;
}

.rocket-image {
  position: relative;
  z-index: 2;
}

.flame {
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 30px;
  background: linear-gradient(to bottom, #ff5722, #ff9800);
  clip-path: polygon(50% 100%, 0 0, 100% 0);
  animation: flame 0.2s infinite alternate;
}

.smoke-container {
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 60px;
  z-index: 1;
}

.smoke-particle {
  position: absolute;
  bottom: 0;
  width: 12px;
  height: 12px;
  background: radial-gradient(
    circle,
    rgba(86, 114, 19, 0.8) 0%,
    rgba(158, 223, 8, 0.3) 100%
  );
  border-radius: 50%;
  animation: smoke 1.5s infinite;
}


.smoke-particle:nth-child(1) {
  left: 30%;
  animation-delay: 0.1s;
}
.smoke-particle:nth-child(2) {
  left: 40%;
  animation-delay: 0.2s;
}
.smoke-particle:nth-child(3) {
  left: 45%;
  animation-delay: 0.3s;
}
.smoke-particle:nth-child(4) {
  left: 50%;
  animation-delay: 0.4s;
}
.smoke-particle:nth-child(5) {
  left: 55%;
  animation-delay: 0.5s;
}
.smoke-particle:nth-child(6) {
  left: 60%;
  animation-delay: 0.6s;
}
.smoke-particle:nth-child(7) {
  left: 70%;
  animation-delay: 0.7s;
}
.smoke-particle:nth-child(8) {
  left: 80%;
  animation-delay: 0.8s;
}

@keyframes pre-launch {
  0% {
    transform: translateY(0);
  }
  25% {
    transform: translateY(2px);
  }
  50% {
    transform: translateY(0);
  }
  75% {
    transform: translateY(-2px);
  }
  100% {
    transform: translateY(0);
  }
}

@keyframes flame {
  from {
    height: 30px;
    opacity: 0.8;
  }
  to {
    height: 35px;
    opacity: 1;
  }
}

@keyframes smoke {
  0% {
    transform: scale(1) translateY(0);
    opacity: 0.8;
  }
  50% {
    transform: scale(2) translateY(-20px) translateX(10px);
    opacity: 0.4;
  }
  100% {
    transform: scale(3) translateY(-40px) translateX(-10px);
    opacity: 0;
  }
}


.mt-16 {
  margin-top: 16px;
}
</style>
