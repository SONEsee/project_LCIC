<script setup lang="ts">
import Telecom from '~/components/Telecom/Telecom.vue';

definePageMeta({
  layout: 'backend',
  middleware: ['auth'],
})
</script>
<template>
    <Telecom />
</template>