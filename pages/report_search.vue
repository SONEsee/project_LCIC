<script setup lang="ts">
import { useUserUID } from '~/composables/useUserUID';

definePageMeta({
  middleware: "auth",
  layout: "backend",
});

const route = useRoute();
const { userData } = useUserUID();

const currentMidId = computed(() => userData.value?.MID?.id || '');

const isAdmin = computed(() => currentMidId.value === '01');

const showDetail = computed(() => {
  return route.query.group !== undefined && 
         (route.query.detail_bnk_code !== undefined || !isAdmin.value);
});


const showList = computed(() => {
  return route.query.group === undefined || 
         (isAdmin.value && route.query.detail_bnk_code === undefined);
});
</script>

<template>
  <div>
    <ReportSearchCreditReportDetails v-if="showDetail" />
    
    <ReportSearchListSearch v-else-if="showList" />
  </div>
</template>