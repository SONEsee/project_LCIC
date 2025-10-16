<script setup lang="ts">
import { useRequesDispustStore } from "~/stores/requesdispust";
const DispustStore = useRequesDispustStore();
const dataDispust = computed(() => {
  const data = DispustStore.response_dispust_data_edit;
  if (Array.isArray(data)) {
    return data;
  }
  if (data && typeof data === "object") {
    return [data];
  }
  return [];
});
async function onSelectionChange(params:number) {
    requese.page_size = params
    await DispustStore.getDataDispustEdit();
}
async function onPagechange(params:number) {
    requese.page = params
    await DispustStore.getDataDispustEdit();
}
const requese = DispustStore.data_edit_filter.query;
const rout = useRoute();
const id_dispust = rout.query.dispust_confirm as string;
onMounted(() => {
  DispustStore.data_edit_filter.query.confirm_dispust_id = id_dispust;
  DispustStore.getDataDispustEdit();
});
</script>
<template>
  <!-- <pre>{{ dataDispust[0].disputes }}</pre> -->
  <v-data-table
    :items="dataDispust[0].disputes"
    :items-per-page="requese.page_size"
  >
    <template v-slot:bottom>
      <GloBalTablePaginations
        :page="requese.page"
        :limit="requese.page_size"
        :totalpage="
          DispustStore.response_dispust_data_edit?.pagination.total_pages
        "
        @onPagechange="onPagechange"
        @onSelectionChange="onSelectionChange"
      />
    </template>
  </v-data-table>
</template>
