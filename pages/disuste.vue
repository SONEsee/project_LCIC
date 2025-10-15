<script setup lang="ts">
definePageMeta({
  layout: "backend",
  middleware: ["auth"],
});
</script>
<template>
    <div class="p-4">
        <DispustLoan/>
    </div>
</template>