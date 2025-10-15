<script setup lang="ts">
import { useLoanStore } from "~/stores/loan";
import { MemberStore } from "@/stores/memberinfo";
import { useMemberInfo } from "@/composables/memberInfo";
import dayjs from "dayjs";
const header = [
    { title: 'ລຳດັບ', value: 'id', align: 'start' },
    { title: 'ລະຫັດ ຂສລ', value: 'LCIC_code' },
    { title: 'ລະຫັດ ວິສາຫະກິດ', value: 'com_enterprise_code' },
    { title: 'ສະມາຊິກ', value: 'bnk_code' },
    { title: 'ສາຂາ', value: 'branch_id' },
    { title: 'ລະຫັດເງິນກູ້', value: 'loan_id' },
    { title: 'ລະຫັດສະມາຊິກ', value: 'customer_id' },
    { title: 'Actions', value: 'actions', sortable: false },
] as any
const LoanStore = useLoanStore();
const reques = LoanStore.data_fiter.query
async function onChang (value:number){
reques.page = value
await LoanStore.getDataLoan()

}
async function onSelect (value:number){
    reques.page_size = value
    await LoanStore.getDataLoan()
}
const memberinfoStore = MemberStore();
const { mapMemberInfo, getMemberName, getMemberDetails } = useMemberInfo();
const route = useRoute();
const dispustId = (route.query.id_dispust as string) || "";

const disputese = computed(() => {
  const data = LoanStore.respons_data_loan_list?.disputes.items;
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") return [data];
  return [];
});
const file = ref<File | null>(null);
const files = ref<File[]>([]);

const handleChange = (newFiles: File[]) => {
  console.log("Files changed:", newFiles);
};

const handleError = (message: string) => {
  console.error("Error:", message);
};
onMounted(() => {
  LoanStore.data_fiter.query.id_file = dispustId;
  LoanStore.getDataLoan();
  memberinfoStore.getMemberInfo();
});
</script>
<template>
  <v-card height="60" class="d-flex align-center pa-4" outlined>
    <h3 style="color: #1a237e">ຈັດການແກ້ໄຂຂໍ້ມູນທີ່ເກິດ Dispust</h3>
  </v-card>

  <v-row>
    <!-- <pre>{{ disputese }}</pre> -->
    <v-col cols="12" md="6">
      <VFileUpload
        v-model="file"
        label="ອັບໂຫຼດເອຫະສານຢັງ້ຢືນ"
        accept=".image,.png,.pdf,.doc,.docx,.xls,.xlsx"
        :max-size="5 * 1024 * 1024"
        show-size
        @change="handleChange"
        @error="handleError"
      />
    </v-col>
    <v-col cols="12" md="6" class="d-flex flex-column">
      <div class="flex-grow-1 d-flex align-center justify-center">
        <v-icon color="warning" class="mr-2">mdi-chat-alert</v-icon>
        <p style="color: #1a237e">
          ທ່ານຕອ້ງໄດ້ຕິດຂັດເອກະສານທາງການເພື່ອຢັ້ງຢືນວ່າຂໍ້ມູນທີ່ທ່ານນຳສົ່ງມານີ້ເປັນຂໍ້ມູນທີ່ຖືກ
          ແລະ ເພື່ອແຈ້ງໃຫ້ທາງ LCIC ອັບເດດໃຫ້
        </p>
      </div>
      <div class="flex-grow-1 d-flex align-center justify-sm-space-between">
       
        <v-chip color="success">{{
          mapMemberInfo(disputese[0]?.bnk_code)
        }}</v-chip>
        <v-chip color="primary">{{
          dayjs(disputese[0]?.period).format("MM/YYYY")
        }}</v-chip>

      </div>

      <div class="flex-grow-1 d-flex align-end justify-start">
        <v-btn color="primary" @click="">
          <v-icon start>mdi-upload</v-icon>
          ຢັ້ງຢືນການປຽ່ນແປງ
        </v-btn>
      </div>
    </v-col>
  </v-row>
  <v-data-table :items="disputese" class="bg-with" :headers="header"
  :items-per-page="reques.page_size"
  >
  <template v-slot:item.id="{item ,index}">
    {{ (reques.page - 1)*reques.page_size + index + 1 }}
  </template>
    <template v-slot:bottom>
        <GloBalTablePaginations 
        :page="LoanStore.data_fiter.query.page"
        :totalpage="LoanStore.respons_data_loan_list?.disputes.total_pages || 0"
        :limit="LoanStore.data_fiter.query.page_size"
        @onChang="onChang"
        @onSelect="onSelect"
        />
    </template>
  </v-data-table>
</template>
