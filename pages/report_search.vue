<script setup lang="ts">
definePageMeta({
  middleware: "auth",
  layout: "backend",
});

const route = useRoute();

// ตรวจสอบว่าอยู่หน้าไหน จาก query params
const isDetailPage = computed(() => {
  return route.query.group !== undefined;
});
</script>

<template>
  <div>
    <!-- แสดง detail ถ้ามี query params -->
    <ReportSearchCreditReportDetails v-if="isDetailPage" />
    
    <!-- แสดง list ถ้าไม่มี query params -->
    <ReportSearchListSearch v-else />
  </div>
</template>