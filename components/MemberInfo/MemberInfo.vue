<script setup lang="ts">
import { MemberStore } from "~/stores/memberinfo";
const memberinfoStore = MemberStore();

const header = [
  { title: "ລຳດັບ", value: "index" },
  { title: "ຊື່ພາສາລາວ", value: "nameL" },
  { title: "ຊື່ພາສາອັງກິດ", value: "nameE" },
  { title: "ຊື່ຫຍໍ້", value: "code" },
  { title: "ລະຫັດ", value: "bnk_code" },
  { title: "ທີ່ຕັ້ງ", value: "streetInfoL" },
  { title: "ຈັດການ", value: "action" },
];

const tableItems = computed(() => {
  const data = memberinfoStore.respons_data_query;
  if (!data) return [];
  return Array.isArray(data) ? data : [data];
});

onMounted(() => {
  memberinfoStore.getMemberInfo();
});
</script>

<template>
  <div class="pa-3">
    <v-col cols="12">
      <v-row>
        <v-col cols="12" md="6"
          ><h4 class="d-flex justify-start">
            <b>ຈັດການຂໍ້ມູນສະມາຊິກ</b>
          </h4></v-col
        >
        <v-col cols="12" md="6">
          <v-btn
            :loading="memberinfoStore.loading"
            class="float-end"
            color="primary"
            text="ເພີ່ມຂໍ້ມູນສະມາຊິກ"
            prepend-icon="mdi-plus"
            @click="() => $router.push('/backend/memberinfo/create')"
          />
        </v-col>
      </v-row>
    </v-col>
    <v-divider></v-divider>
    <v-data-table
      :items="tableItems"
      :headers="header"
      :loading="memberinfoStore.loading"
    >
      <template v-slot:item.index="{ index }">
        {{ index + 1 }}
      </template>
      <template v-slot:item.action="{ item }">
        <span class="d-flex">
          <v-btn class="text-primary small" icon="mdi-eye" small flat @click="$router.push(`/backend/memberinfo/detail/?id=${item.id}`)" />
          <v-btn class="text-info small" icon="mdi-pencil" small flat />
          <v-btn class="text-error small" icon="mdi-delete" small flat
        /></span>
      </template>
    </v-data-table>
  </div>
</template>
