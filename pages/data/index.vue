<script setup lang="ts">
definePageMeta({
  layout: "backend",
  middleware: ["auth"],
});
</script>
<template>
  <div>
    <SubmitDataBase />
  </div>
</template>
