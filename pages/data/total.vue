<template>
  <section style="height: 100vh" class="d-flex justify-center align-center">
    <div class="d-flex justify-center align-center">
      <DataTotal />
    </div>
  </section>
</template>
<script setup lang="ts">
definePageMeta({
  middleware: "auth",
  layout: "backend",
});
useHead({
  title: "total",
});
</script>
