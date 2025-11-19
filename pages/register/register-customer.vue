<template>
 <RegisterIndividualConfirmForm />
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
  layout: 'backend',
});
</script>