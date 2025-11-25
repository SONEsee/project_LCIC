<script setup lang="ts">
definePageMeta({
    middleware:["auth"],
    layout:"backend"
})
</script>
<template>
    <div class="pa-4">
        <MergMactEnterpriseMerg/>
    </div>
</template>