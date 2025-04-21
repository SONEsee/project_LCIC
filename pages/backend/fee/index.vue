<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
  layout: "backend",
});

useHead({
  title: "AddUser",
  meta: [
    {
      name: "keywords",
      content: "Order, Nuxt 3, Backend",
    },
    {
      name: "Description",
      content: "Order Nuxt 3, IT Genius Engineering",
    },
  ],
});
</script>
<template>
    <Fee />
</template>