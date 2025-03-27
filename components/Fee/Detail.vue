<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useFeesStore } from "~/stores/fee";
import { useRoute } from "vue-router";

const route = useRoute();
const store = useFeesStore();
const id = computed(() => {
  const paramId = route.query.id;
  return paramId ? Number(paramId) : null;
});

const feeDetail = computed(() => store.response_detail_data);
const formattedAmount = computed(() => {
  return feeDetail.value?.chg_amount
    ? Number(feeDetail.value.chg_amount).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : "0.00";
});

onMounted(() => {
  if (id.value !== null && !isNaN(id.value) && id.value > 0) {
    store.Getdetail(id.value);
  } else {
    console.error("Invalid ID:", id.value);
  }
});

const title = "ລາຍລະອຽດຂໍ້ມູນຄ່າທຳນຽມ";
</script>

<template>
    <v-container>
  <h3>{{ title }}</h3>
  <v-divider></v-divider>
  <v-container v-if="feeDetail">
    <v-col cols="12">
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            label="ອັກສອນຫຍໍ້"
            variant="outlined"
            readonly
            v-model="feeDetail.chg_code"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            label="ຊື່ພາສາລາວ"
            variant="outlined"
            v-model="feeDetail.chg_lao_type"
            readonly
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            label="ຊື່ພາສາອັງກິດ"
            variant="outlined"
            v-model="feeDetail.chg_type"
            readonly
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
          
            label="ລາຍລະອຽດພາສາລາວ"
            variant="outlined"
            v-model="feeDetail.chg_lao_desc"
            readonly
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            label="ລາຍລະອຽດພາສາອັງກິດ"
            variant="outlined"
            v-model="feeDetail.chg_desc"
            readonly
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            label="ມູນຄ່າ"
            variant="outlined"
            readonly
            v-model="formattedAmount"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            label="ສະກຸນເງິນ"
            variant="outlined"
            v-model="feeDetail.chg_unit"
            readonly
          ></v-text-field>
        </v-col>
      </v-row>
    </v-col>
  </v-container>
  <v-container v-else>
    <p>ກຳລັງໂຫຼດຂໍ້ມູນ...</p>
  </v-container></v-container>
</template>
