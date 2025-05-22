<script setup lang="ts">
import { useRoute } from "#app";
import { useUserManageStore } from "~/stores/usermanage";
const useStore = useUserManageStore();
definePageMeta({
  middleware: ["auth"],
  layout: "backend",
});

const route = useRoute();
const id = Number(
  Array.isArray(route.query.id) ? route.query.id[0] : route.query.id
);
onMounted(() => {
  useStore.getDetailUser(id);
});
</script>
<template>
  <UserTestDetail />
</template>
