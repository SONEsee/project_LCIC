<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

import { useManageUser } from "@/stores/manage";
const store = useManageUser();
const res = computed(() => store.response_query_data || []);
onMounted(() => {
  store.Getdata();
  console.log("Response data:", res.value);
});
</script>
<template>
  <v-data-table :items="res" item-key="name" items-per-page="5"> </v-data-table>
</template>
