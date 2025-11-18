<script setup lang="ts">
definePageMeta({
    layout:"backend",
    middleware:["auth"]
})
</script>
<template>
    <div class="pa-4">
        <CatalogMainCatalog/>
    </div>
</template>