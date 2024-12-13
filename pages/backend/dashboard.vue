<script setup lang="ts">
import CongratulationCard from "@/components/dashboardComponents/modern/congratulation-card/CongratulationCard.vue";
import RevenueUpdates from "@/components/dashboardComponents/modern/revenue-updates/RevenueUpdates.vue";
import MonthlyEarnings from "@/components/dashboardComponents/modern/monthly-earnings/MonthlyEarnings.vue";
import TotalSales from "@/components/dashboardComponents/modern/total-sales/TotalSales.vue";
import Test from "@/components/dashboardComponents/modern/test/index.vue";
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
  <v-col cols="12">
    <v-row>
      <v-col cols="12" md="6">
        <v-card height="500" style="border: 2px #1a237e solid">
          <v-container>
            <TotalSales class="d-flex justify-center align-center" />
<!-- <Test/> -->
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
  <!-- <v-row class="bg-indigo-lighten-5">
    <v-col cols="12" sm="12" lg="5">
      <TotalSales />
      <CongratulationCard />
    </v-col>
    <v-col cols="12" sm="12" lg="7">
      <v-row>
        <RevenueUpdates />

        <v-col lg="12">
          <MonthlyEarnings />
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12" sm="12" lg="4">
      <div class="mt-7"></div>
    </v-col>

    <v-col cols="12" lg="4"> </v-col>
  </v-row> -->
</template>
