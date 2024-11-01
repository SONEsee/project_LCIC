Then add code —
<script setup lang="ts">
import TheActivityTimeline from "@/components/dashboardComponents/analyticaldash/activity-timeline/TheActivityTimeline.vue"
definePageMeta({
  layout: "backend",
});

useHead({
  title: "Collect fees",
  meta: [
    {
      name: "keywords",
      content: "Order, Nuxt 3, Backend",
    },
    {
      name: "Description",
      content: "Order Nuxt 3,  IT Genius Engineering",
    },
  ],
});
</script>

<template >
  
 
    <TheActivityTimeline />

</template>

<style scoped></style>
