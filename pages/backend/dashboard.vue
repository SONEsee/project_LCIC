<script setup lang="ts">
import CongratulationCard from "@/components/dashboardComponents/modern/congratulation-card/CongratulationCard.vue";
import RevenueUpdates from "@/components/dashboardComponents/modern/revenue-updates/RevenueUpdates.vue";
import MonthlyEarnings from "@/components/dashboardComponents/modern/monthly-earnings/MonthlyEarnings.vue";
import TotalSales from "@/components/dashboardComponents/modern/total-sales/TotalSales.vue";
import Test from "@/components/dashboardComponents/modern/test/index.vue";
import axios from "axios";
import { ref, onMounted } from "vue";
import Member from "~/components/dashboardComponents/Member/MemberAcunt/Member.vue";

import LoanCoun from "~/components/dashboardComponents/Member/LoanCoun/LoanCoun.vue";

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
// const Getdata = async () => {
//   try {
//     const config = useRuntimeConfig();
//     const res = await axios.get(
//       `${config.public.strapi.url}api/dashboard/loan-count-by-month/?bnk_code=${bnk_code}`
//     );
//     if (res.status === 200) {
//       item.value = res.data;
//       console.log("success");
//     }
//   } catch (error) {}
// };
// onMounted(Getdata);
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
  <div v-if="user_id !== '01'">
    <v-col cols="12">
      <v-card height="20vh" style="border: 2px #1a237e solid">
       
        <v-row>
          <v-col cols="12" md="4">
            <v-card
              class="mb-3 ml-3 mr-3 mt-3"
              height=""
              style="border: 2px #1a237e solid"
            >
              <Member />
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card
              width="100%"
              class="mb-3 ml-3 mr-3 mt-3"
              height=""
              style="border: 2px #1a237e solid"
            >
              <LazyDashboardComponentsMemberFeeCountFee />
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card
              width="100%"
              class=" mr-3 mb-3 mt-3"
              height=""
              style="border: 2px #1a237e solid"
            >
              <LoanCoun />
            </v-card>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
    <v-col cols="12">
      <v-row>
        <v-col cols="12" md="6">
          <v-card height="500" style="border: 2px #1a237e solid">
            <v-container>
              <div>
                <DashboardComponentsMemberLoanCount />
              </div>
            </v-container>
          </v-card>
        </v-col>

        <v-col cols="12" md="6">
          <div>
            <v-card height="500" style="border: 2px #1a237e solid">
              <v-container>
                <DashboardComponentsMemberSearch />
              </v-container>
            </v-card>
          </div>
        </v-col>
        <v-col cols="12" md="6">
          <v-card
            height="500"
            style="border: 2px #1a237e solid"
            class="d-flex justify-center align-center"
          >
            <v-container>
            <DashboardComponentsMemberSearchGrapf />
            </v-container>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card
            height="500"
            style="border: 2px #1a237e solid"
            class="d-flex justify-center align-center"
          >
            <v-container>
              <p>
                <AnimationRobot />
              </p>
              <p class="d-flex justify-center align-center mt-10">
                ກຳລັງພັດທະນາ....
              </p></v-container
            >
          </v-card>
        </v-col>
      </v-row>
    </v-col>
  </div>
  <v-col cols="12" v-if="user_id === '01'">
    <v-row>
      <v-col cols="12" md="6">
        <v-card height="500" style="border: 2px #1a237e solid">
          <v-container>
            <TotalSales class="d-flex justify-center align-center" />
          </v-container>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card height="500" style="border: 2px #1a237e solid">
          <v-container> <RevenueUpdates /></v-container>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card height="500" style="border: 2px #1a237e solid">
          <v-container> <CongratulationCard /></v-container>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card height="500" style="border: 2px #1a237e solid">
          <v-container> <MonthlyEarnings /></v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-col>
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
    rgba(79, 107, 12, 0.8) 0%,
    rgba(158, 223, 8, 0.3) 100%
  );
  border-radius: 50%;
  animation: smoke 1.5s infinite;
}

/* Position smoke particles in a spread pattern */
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

/* Add some margin to the text below */
.mt-16 {
  margin-top: 16px;
}
</style>
