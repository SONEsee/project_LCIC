<script setup lang="ts">
import Report_login from '~/components/Report_Login/report_login.vue';

definePageMeta({
  middleware: "auth",
  layout: "backend",
});

</script>
<template>
  <Report_login/>
</template>