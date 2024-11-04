<template>
  <div>
    <!-- <ChargeReportFilter/> -->
    <ChargeReport />
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  layout: "backend",
  middleware: "auth",
});
useHead({
  title: "Chage Report",
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
