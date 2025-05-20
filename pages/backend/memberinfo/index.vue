<script setup lang="ts">
  definePageMeta({
    middleware: "auth",
    layout: "backend",
  });
  
  useHead({
    title: "Member Info",
  });
</script>
<template>
    <MemberInfo />
</template>