<script setup lang="ts">
definePageMeta({
    layout: "backend",
    middleware: ["auth"],
});
useHead({
    title: "ລາຍລະອຽດຂໍ້ມູນສະມາຊິກ",
    meta: [
        {
            name: "description",
            content: "ຂໍ້ມູນສະມາຊິກ",
        },
    ],
});
</script>
<template>
    <LazyMemberInfoDetailMember/>
</template>