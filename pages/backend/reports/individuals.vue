<script setup lang="ts">
definePageMeta({
    layout:"default",
    middleware: ["auth"],
});
const robotItems = ref([
  
  { id: 2, name: 'Robot 2' },
]);
</script>
<template>
    <div class="pa-4">
        <ReportIndividualReport />
        
    </div>
</template>