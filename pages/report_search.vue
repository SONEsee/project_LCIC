<script setup lang="ts">
import { useUserUID } from '~/composables/useUserUID';

definePageMeta({
  middleware: "auth",
  layout: "backend",
});

const route = useRoute();
const { userData } = useUserUID();

// ✅ ดึง MID.id จาก userData
const currentMidId = computed(() => userData.value?.MID?.id || '');

// ✅ ตรวจสอบว่าเป็น Admin หรือไม่
const isAdmin = computed(() => currentMidId.value === '01');

// ✅ ตรวจสอบว่าอยู่หน้าไหน
const showReportAll = computed(() => {
  // แสดง ReportAll ถ้า:
  // 1. เป็น admin (MID.id = "01")
  // 2. มี group query
  // 3. ยังไม่มี detail_bnk_code (ยังไม่ได้เลือกธนาคาร)
  return isAdmin.value && 
         route.query.group !== undefined && 
         route.query.detail_bnk_code === undefined;
});

const showDetail = computed(() => {
  // แสดง Detail ถ้า:
  // 1. ไม่ใช่ admin (user ธรรมดา) และมี group
  // 2. หรือเป็น admin แต่มี detail_bnk_code แล้ว
  return (route.query.group !== undefined && !isAdmin.value) || 
         (route.query.group !== undefined && route.query.detail_bnk_code !== undefined);
});

const showList = computed(() => {
  // แสดง List ถ้าไม่มี query params
  return route.query.group === undefined;
});
</script>

<template>
  <div>
    <!-- 1️⃣ แสดง ReportAll (สำหรับ Admin เท่านั้น) -->
    <ReportSearchReportAll v-if="showReportAll" />
    
    <!-- 2️⃣ แสดง Detail (สำหรับ User ธรรมดา หรือ Admin ที่เลือกธนาคารแล้ว) -->
    <ReportSearchCreditReportDetails v-else-if="showDetail" />
    
    <!-- 3️⃣ แสดง List (หน้าแรก) -->
    <ReportSearchListSearch v-else-if="showList" />
  </div>
</template>