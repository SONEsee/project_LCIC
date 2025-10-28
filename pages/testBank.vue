<script setup lang="ts">
definePageMeta({
  middleware: "auth",
  layout: "backend",
});

</script>
<template>
  <MemberInfoManageMemberListMember/>
</template>