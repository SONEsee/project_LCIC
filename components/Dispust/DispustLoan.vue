<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useLoanStore } from "~/stores/loan";
import { MemberStore } from "@/stores/memberinfo";
import { useMemberInfo } from "@/composables/memberInfo";
import dayjs from "dayjs";

const header = [
  { title: "ລຳດັບ", value: "id", align: "start" },
  { title: "ລະຫັດ ຂສລ", value: "LCIC_code" },
  { title: "ລະຫັດ ວິສາຫະກິດ", value: "com_enterprise_code" },
  { title: "ສະມາຊິກ", value: "bnk_code" },
  { title: "ສາຂາ", value: "branch_id" },
  { title: "ລະຫັດເງິນກູ້", value: "loan_id" },
  { title: "ລະຫັດສະມາຊິກ", value: "customer_id" },
  { title: "Actions", value: "actions", sortable: false },
] as any;

const LoanStore = useLoanStore();
const memberinfoStore = MemberStore();
const { mapMemberInfo } = useMemberInfo();
const route = useRoute();

const reques = LoanStore.data_fiter.query;
const dispustId = (route.query.id_dispust as string) || "";

// File upload
const file = ref<File | null>(null);
const isUploading = ref(false);

const disputese = computed(() => {
  const data = LoanStore.respons_data_loan_list?.disputes.items;
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") return [data];
  return [];
});

async function onChang(value: number) {
  reques.page = value;
  await LoanStore.getDataLoan();
}

async function onSelect(value: number) {
  reques.page_size = value;
  await LoanStore.getDataLoan();
}

const handleChange = (newFiles: File[]) => {
  console.log("Files changed:", newFiles);
};

const handleError = (message: string) => {
  console.error("Error:", message);
  // ສາມາດເພີ່ມ Swal alert ໄດ້
};

const confirmUpload = async () => {
  if (!file.value) {
    // ສະແດງ warning
    console.warn("ກະລຸນາເລືອກໄຟລ໌ກ່ອນ");
    return;
  }

  isUploading.value = true;
  
  try {
    // Logic ການອັບໂຫຼດຂອງເຈົ້າ
    const formData = new FormData();
    formData.append('file', file.value);
    formData.append('id_dispust', dispustId);
    
    // await axios.post('/api/upload-dispute', formData);
    
    console.log("Upload success");
  } catch (error) {
    console.error("Upload failed:", error);
  } finally {
    isUploading.value = false;
  }
};

onMounted(() => {
  LoanStore.data_fiter.query.id_file = dispustId;
  LoanStore.getDataLoan();
  memberinfoStore.getMemberInfo();
});
</script>

<template>
  <v-card height="60" class="d-flex align-center pa-4 mb-4" outlined>
    <h3 style="color: #1a237e">ຈັດການແກ້ໄຂຂໍ້ມູນທີ່ເກິດ Dispute</h3>
  </v-card>

  <v-row class="mb-4">
    <!-- File Upload Section -->
    <v-col cols="12" md="6">
      <VFileUpload
        v-model="file"
        label="ອັບໂຫຼດເອກະສານຢັ້ງຢືນ"
        accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx"
        :max-size="5 * 1024 * 1024"
        show-size
        @change="handleChange"
        @error="handleError"
      />
    </v-col>

    <!-- Info Section -->
    <v-col cols="12" md="6" class="d-flex flex-column ga-3">
      <!-- Warning Message -->
      <v-alert type="warning" variant="tonal" density="compact">
        <div class="d-flex align-center">
          <v-icon class="mr-2">mdi-alert-circle</v-icon>
          <span class="text-body-2">
            ທ່ານຕ້ອງໄດ້ຕິດຂັດເອກະສານທາງການເພື່ອຢັ້ງຢືນວ່າຂໍ້ມູນທີ່ທ່ານນຳສົ່ງມານີ້ເປັນຂໍ້ມູນທີ່ຖືກຕ້ອງ
            ແລະ ເພື່ອແຈ້ງໃຫ້ທາງ LCIC ອັບເດດໃຫ້
          </span>
        </div>
      </v-alert>

      <!-- Info Chips -->
      <div class="d-flex align-center ga-2 flex-wrap">
        <v-chip 
          v-if="disputese.length > 0" 
          color="success" 
          prepend-icon="mdi-bank"
        >
          {{ mapMemberInfo(disputese[0]?.bnk_code) }}
        </v-chip>
        
        <v-chip 
          v-if="disputese.length > 0 && disputese[0]?.period" 
          color="primary"
          prepend-icon="mdi-calendar"
        >
          {{ dayjs(disputese[0]?.period).format("MM/YYYY") }}
        </v-chip>

        <v-chip 
          v-if="disputese.length > 0" 
          color="info"
          prepend-icon="mdi-file-document"
        >
          {{ disputese.length }} ລາຍການ
        </v-chip>
      </div>

      <!-- Submit Button -->
      <div class="d-flex align-end justify-start mt-auto">
        <v-btn 
          color="primary" 
          :loading="isUploading"
          :disabled="!file"
          @click="confirmUpload"
          size="large"
        >
          <v-icon start>mdi-check-circle</v-icon>
          ຢັ້ງຢືນການປ່ຽນແປງ
        </v-btn>
      </div>
    </v-col>
  </v-row>

  <!-- Data Table -->
  <v-data-table
    :items="disputese"
    :headers="header"
    :items-per-page="reques.page_size"
    class="elevation-1"
  >
    <!-- Row Number -->
    <template v-slot:item.id="{ item, index }">
      {{ (reques.page - 1) * reques.page_size + index + 1 }}
    </template>

    <!-- LCIC Code -->
    <template v-slot:item.LCIC_code="{ item }">
      <v-chip size="small" color="primary" variant="flat">
        {{ item.LCIC_code }}
      </v-chip>
    </template>

    <!-- Bank Code -->
    <template v-slot:item.bnk_code="{ item }">
      <v-chip size="small" color="success">
        {{ mapMemberInfo(item.bnk_code) }}
      </v-chip>
    </template>

    <!-- Actions -->
    <template v-slot:item.actions="{ item }">
      <v-btn
        size="small"
        color="info"
        variant="outlined"
        
      >
        <v-icon start size="18">mdi-eye</v-icon>
        ເບິ່ງ
      </v-btn>
    </template>

    <!-- Pagination -->
    <template v-slot:bottom>
      <GloBalTablePaginations
        :page="LoanStore.data_fiter.query.page"
        :totalpage="LoanStore.respons_data_loan_list?.disputes.total_pages || 0"
        :limit="LoanStore.data_fiter.query.page_size"
        @onSelectionChange="onSelect"
        @onPagechange="onChang"
      />
    </template>

    <!-- No Data -->
    <template v-slot:no-data>
      <v-alert type="info" variant="tonal" class="ma-4">
        <v-icon start>mdi-information</v-icon>
        ບໍ່ມີຂໍ້ມູນ Dispute
      </v-alert>
    </template>
  </v-data-table>
</template>

<style scoped>
.ga-2 {
  gap: 8px;
}

.ga-3 {
  gap: 12px;
}
</style>