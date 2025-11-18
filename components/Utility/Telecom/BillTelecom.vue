<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useBillTelecom } from '~/stores/billtelecom';

const telecomStore = useBillTelecom();

// ຟອມອັບໂຫຼດ
const reques = ref({
  file: null as File | null
});

// ກວດສອບວ່າຟອມຄົບຖ້ວນບໍ່
const isFormValid = computed(() => {
  return reques.value.file !== null;
});

// ສົ່ງຟອມ
const submitform = async () => {
  if (!reques.value.file) return;
  
  // ເອົາຂໍ້ມູນຈາກຟອມໃສ່ store
  telecomStore.form_insert_json.file = reques.value.file;
  telecomStore.form_insert_json.user_id = "1"; // ປ່ຽນຕາມຄວາມເໝາະສົມ
  telecomStore.form_insert_json.period = "202411"; // ປ່ຽນຕາມຄວາມເໝາະສົມ
  
  // ເອີ້ນ action ອັບໂຫຼດ
  await telecomStore.CreateBill();
  
  // ລ້າງຟອມຫຼັງອັບໂຫຼດສຳເລັດ
  reques.value.file = null;
};

const header = ref([
  { title: 'ລຳດັບ', key: 'TB_ID', align: 'center' },
  { title: 'ເລກບິນ', key: 'BillID', align: 'start' },
  { title: 'ລະຫັດລູກຄ້າ', key: 'Customer_ID', align: 'start' },
  { title: 'ເລກໃບແຈ້ງໜີ້', key: 'InvoiceNo', align: 'start' },
  { title: 'ຄ່າພື້ນຖານ', key: 'Basic_Tax', align: 'end' },
  { title: 'ຍອດບິນ', key: 'Bill_Amount', align: 'end' },
  { title: 'ຍອດໜີ້', key: 'Debt_Amount', align: 'end' },
  { title: 'ເດືອນ/ປີ', key: 'InvoiceMonth', align: 'center' },
]);

const telecomData = computed(() => {
  return telecomStore.respons_data_billtelecom_list?.results || [];
});

const totalPages = computed(() => {
  const count = telecomStore.respons_data_billtelecom_list?.count || 0;
  return Math.ceil(count / telecomStore.query_list.limit);
});

const formatCurrency = (value: string | number) => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return new Intl.NumberFormat('lo-LA', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num);
};

const formatMonth = (month: string) => {
  if (!month || month.length !== 6) return month;
  const m = month.substring(0, 2);
  const y = month.substring(2);
  return `${m}/${y}`;
};

const onSelectPage = (limit: number) => {
  telecomStore.query_list.limit = limit;
  telecomStore.query_list.page = 1;
  telecomStore.GetdataBillTelecom();
};

const onChangPage = (page: number) => {
  telecomStore.query_list.page = page;
  telecomStore.GetdataBillTelecom();
};

onMounted(() => {
  telecomStore.GetdataBillTelecom();
});
</script>

<template>
  <div class="pa-6">
    <!-- ຟອມອັບໂຫຼດ -->
    <v-card class="mb-6 elevation-2" rounded="lg">
      <v-card-text class="pa-4">
        <v-form @submit.prevent="submitform">
          <v-row align="center">
            <!-- File Upload -->
            <v-col cols="12" md="9">
              <v-file-input
                v-model="reques.file"
                accept=".json"
                label="ເລືອກໄຟລ໌ JSON"
                prepend-icon="mdi-file-document-outline"
                density="compact"
                hide-details
                :rules="[(v: any) => !!v || 'ກະລຸນາເລືອກໄຟລ໌']"
              />
            </v-col>

            <!-- ປຸ່ມອັບໂຫຼດ -->
            <v-col cols="12" md="3">
              <v-btn
                type="submit"
                color="primary"
                prepend-icon="mdi-upload"
                :disabled="!isFormValid"
                :loading="telecomStore.isLoading"
                block
              >
                ອັບໂຫຼດ
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>

    <!-- ຕາຕະລາງຂໍ້ມູນ -->
    <v-card class="elevation-2" rounded="lg">
      <v-card-text class="pa-0">
        <v-data-table
          :items="telecomData"
          :headers="header"
          :items-per-page="telecomStore.query_list.limit"
          :loading="telecomStore.isLoading"
          loading-text="ກຳລັງໂຫຼດຂໍ້ມູນ..."
          no-data-text="ບໍ່ມີຂໍ້ມູນ"
          hover
          class="elevation-0"
          hide-default-footer
        >
          <template v-slot:item.TB_ID="{ item }">
            <v-chip size="small" color="primary" variant="tonal">
              #{{ item.TB_ID }}
            </v-chip>
          </template>

          <template v-slot:item.BillID="{ item }">
            <div class="d-flex align-center">
              <v-icon size="small" color="blue-grey" class="mr-2">
                mdi-file-document-outline
              </v-icon>
              <span class="text-body-2 font-weight-medium">{{ item.BillID }}</span>
            </div>
          </template>

          <template v-slot:item.Basic_Tax="{ item }">
            <span class="text-body-2 font-weight-medium text-primary">
              {{ formatCurrency(item.Basic_Tax) }}
            </span>
          </template>

          <template v-slot:item.Bill_Amount="{ item }">
            <span 
              class="text-body-2 font-weight-medium"
              :class="parseFloat(item.Bill_Amount) < 0 ? 'text-error' : 'text-success'"
            >
              {{ formatCurrency(item.Bill_Amount) }}
            </span>
          </template>

          <template v-slot:item.Debt_Amount="{ item }">
            <span 
              class="text-body-2 font-weight-medium"
              :class="parseFloat(item.Debt_Amount) < 0 ? 'text-error' : 'text-success'"
            >
              {{ formatCurrency(item.Debt_Amount) }}
            </span>
          </template>

          <template v-slot:item.InvoiceMonth="{ item }">
            <v-chip size="small" variant="outlined" color="blue-grey">
              {{ formatMonth(item.InvoiceMonth) }}
            </v-chip>
          </template>

          <template v-slot:bottom>
            <div class="pa-4 bg-grey-lighten-5">
              <GloBalTablePaginations
                :limit="telecomStore.query_list.limit"
                :page="telecomStore.query_list.page"
                :totalpage="totalPages"
                @onSelectionChange="onSelectPage"
                @onPagechange="onChangPage"
              />
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<style scoped>
.v-card {
  transition: all 0.3s ease;
}

.v-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !important;
}

:deep(.v-data-table tbody tr:hover) {
  background-color: rgba(var(--v-theme-primary), 0.05) !important;
}
</style>