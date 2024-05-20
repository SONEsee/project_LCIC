Then add code —
<script setup lang="ts">
import SearchIndividuals from "@/components/SearchIndividuals/Search.vue"
import Search from "~~/components/SearchIndividuals/Search.vue";
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

<template>
  
    <Search />
 
</template>

<style scoped></style>
