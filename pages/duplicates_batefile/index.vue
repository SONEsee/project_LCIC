<template>
 
    <SearchuserDuplicates />
 
</template>
<script lang="ts" setup>
definePageMeta({
  title: " duplicates",
  layout: "backend",
  middleware: ["auth"],
});
useHead({
  title: "Duplicates",
});
</script>
