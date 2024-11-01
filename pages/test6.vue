<template >

    <v-col cols="12">
        <v-row>
            <v-col cols="12" md="5">
                <TotalSales/>
            </v-col>
            <v-col cols="12" md="4">
                <div class="mt-7">
                <test/></div>
            </v-col>
            <v-col cols="12" md="3">
                <div class="mt-7">
                <test3/></div>
            </v-col>
            <v-col cols="12" md="5">
                <div class="mt-7">
                <test2/></div>
            </v-col>
        </v-row>
    </v-col>

</template>
<script setup leng="ts">
import TotalSales from "@/components/dashboardComponents/modern/total-sales/TotalSales.vue"
import test from "@/components/dashboardComponents/modern/monthly-earnings/MonthlyEarnings.vue"
import test2 from "@/components/dashboardComponents/modern/revenue-updates/RevenueUpdates.vue"
import test3 from "@/components/dashboardComponents/modern/congratulation-card/CongratulationCard.vue"
definePageMeta({
    layout: "backend",
    middleware: ["auth"],
  })

  useHead({
    title: 'Dashboard',
    meta: [
      { 
        name: 'keywords', 
        content: 'Dashboard, Nuxt 3, Backend'
      },
      {
        name: 'Description',
        content: 'Dashboard Nuxt 3,  IT Genius Engineering'
      }
    ]
  })
</script>
