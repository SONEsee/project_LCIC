<script setup lang="ts">
definePageMeta({
    middleware:"auth",
    layout:"backend"
})
useHead({
    title:"Member Info Create"
})
</script>
<template>
    <MemberInfoCreateMemberInfo />
</template>