<template>
    <v-container>
      <h1>ຂໍ້ມູນລູກຄ້າ</h1>
  
      <v-data-table
        :headers="headers"
        :items="customers"
        :loading="loading"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>ຕາຕະລາງຂໍ້ມູນລູກຄ້າ</v-toolbar-title>
  
            <v-divider class="mx-4" inset vertical></v-divider>
          </v-toolbar>
        </template>
      </v-data-table>
    </v-container>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, onMounted } from "vue";
  
  interface Customer {
    id: number;
    mm_ind_sys_id: string;
    bnk_code: string;
    branchcode: string;
    customerid: string;
    ind_birth_date: string;
    ind_lao_name: string;
    ind_lao_surname: string;
    ind_insert_date: string;
    ind_update_dat: string;
  }
  
  export default defineComponent({
    setup() {
      const customers = ref<Customer[]>([]);
      const headers = ref([
        { text: "ໄອດີ", value: "id" },
        { text: "ລະຫັດເງິນກູ້", value: "mm_ind_sys_id" },
        { text: "ລະຫັດທະນາຄານ", value: "bnk_code" },
        { text: "ລະຫັດສາຂາ", value: "branchcode" },
        { text: "ລະຫັດລູກຄ້າ", value: "customerid" },
        { text: "ວັນເດືອນປີເກີດ", value: "ind_birth_date" },
        { text: "ຊື່", value: "ind_lao_name" },
        { text: "ນາມສະກຸນ", value: "ind_lao_surname" },
        { text: "ວັນທີສົ່ງ", value: "ind_insert_date" },
        { text: "ວັນທີແກ້ໄຂ", value: "ind_update_date" },
      ]);
      const loading = ref(true);
  
      onMounted(async () => {
        try {
          const response = await fetch(`http://127.0.0.1:35729/api/customers/`);
          customers.value = await response.json();
        } catch (error) {
          console.error("ເກີດຂໍ້ຜິດພາດໃນການໂຫຼດຂໍ້ມູນ:", error);
        } finally {
          loading.value = false;
        }
      });
  
      return {
        customers,
        headers,
        loading,
      };
    },
  });
  </script>
  
  <style scoped>
  /* Add any necessary styles here */
  </style>
  