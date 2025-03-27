<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useFeesStore } from "~/stores/fee";
import Swal from "sweetalert2";
const feestore = useFeesStore();
const res = computed(() => feestore.response_data_fee || []);
const header = [
  { title: "ID", value: "chg_sys_id" },
  { title: "ອັກສອນຫຍໍ້", value: "chg_code" },
  { title: "ຊື່ເຕັມ", value: "chg_type" },
  { title: "ປະເພດບົດລາຍງານ", value: "chg_lao_type" },
  //   { title: 'ລາຍລະອຽດອັງກິດ', value: 'chg_desc' },
  //   { title: 'ລາຍລະອຽດພາສາລາວ', value: 'chg_lao_desc' },
  { title: "ມູນຄ່າ", value: "chg_amount" },
  { title: "ຫົວໜວ່ຍ", value: "chg_unit" },
  { title: "ຈັດການ", value: "action" },
];
const deletefee = async (id: number) => {
  const confirmation = await Swal.fire({
    title: "ຢືນຢັນ",
    text: "ຕອ້ງການລົບຂໍ້ມູນນີ້ແທ້ບໍ?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "ຕົກລົງ",
    cancelButtonText: "ຍົກເລີກ",
  });

  if (confirmation.isConfirmed) {
    await feestore.delete(id);
    await feestore.Getdata();
  }
};
onMounted(() => {
  feestore.Getdata();
});
</script>

<template>
  <div class=" d-flex justify-end">
    <v-btn @click="$router.push('/backend/fee/create')" prepend-icon="mdi-plus" color="primary">
      ເພີ່ມຂໍ້ມູນຄ່າທຳນຽມ
    </v-btn>
  </div>
  <v-data-table :items="res" :headers="header">
    <template v-slot:item.chg_sys_id="{ item }">
      {{ item.chg_sys_id }}
    </template>
    <template v-slot:item.action="{ item }">
      <v-btn
        class="text-primary small"
        icon="mdi-eye"
        small
        flat
        @click="$router.push(`/backend/fee/detail/?id=${item.chg_sys_id}`)"
      />
      <v-btn class="text-info small" icon="mdi-pen" small flat
       @click="$router.push(`/backend/fee/update/?id=${item.chg_sys_id}`)"
       />
      <v-btn class="text-error small" icon="mdi-delete" small flat  @click="deletefee(item.chg_sys_id)"/>
    </template>
  </v-data-table>
</template>
