<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useLoanStore } from "~/stores/loan";
import { MemberStore } from "@/stores/memberinfo";
import { useMemberInfo } from "@/composables/memberInfo";
import dayjs from "dayjs";
import { useUserData } from "~/composables/useUserData";
import { useUserInfo } from "@/composables/useUserInfo";

const {
  userData,
  mapUserInfo,
  getUserFullName,
  getUsername,
  getUserBankName,
  getUserPermission,
  isUserActive,
  getUserDetails,
  getUserInitials,
  loadUsers,
} = useUserInfo();
const { user, userId, isAdmin, isLoggedIn,userid } = useUserData();
const header = [
  { title: "ເລືອກ", value: "checkbox", align: "center" },
  { title: "ລຳດັບ", value: "id",  },
  { title: "ລະຫັດ ຂສລ", value: "LCIC_code" },
  { title: "ລະຫັດ ວິສາຫະກິດ", value: "com_enterprise_code" },
  { title: "ສະມາຊິກ", value: "bnk_code" },
  { title: "ສາຂາ", value: "branch_id" },
  { title: "ລະຫັດເງິນກູ້", value: "loan_id" },
  { title: "ລະຫັດສະມາຊິກ", value: "customer_id" },
  // { title: "Actions", value: "actions", sortable: false },
] as any;

const LoanStore = useLoanStore();
const memberinfoStore = MemberStore();
const { mapMemberInfo } = useMemberInfo();
const route = useRoute();
const selecData = ref<any>([]);
const reques = LoanStore.data_fiter.query;
const dispustId = (route.query.id_dispust as string) || "";

const file = ref<File | null>(null);
const isUploading = ref(false);

const disputese = computed(() => {
  const data = LoanStore.respons_data_loan_list?.disputes.items;
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") return [data];
  return [];
});

const isAllSelected = computed({
  get: () => {
    if (disputese.value.length === 0) return false;
    return disputese.value.every((item) => selecData.value.includes(item.id));
  },
  set: (value: boolean) => {
    if (value) {
      selecData.value = disputese.value.map((item) => item.id);
    } else {
      selecData.value = [];
    }
  },
});

const selectedCount = computed(() => selecData.value.length);

const isReadyToSubmit = computed(() => {
  return file.value && selectedCount.value > 0;
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
};

const confirmUpload = async () => {
  if (!file.value) {
    console.warn("ກະລຸນາເລືອກໄຟລ໌ກ່ອນ");
    return;
  }

  if (selecData.value.length === 0) {
    console.warn("ກະລຸນາເລືອກລາຍການກ່ອນ");
    return;
  }

  isUploading.value = true;

  try {
    LoanStore.form_create_dispust.file = file.value;
    LoanStore.form_create_dispust.dispute_ids = selecData.value;
    LoanStore.form_create_dispust.id_dispust = dispustId;
    LoanStore.form_create_dispust.user_id = userId.value;
    LoanStore.form_create_dispust.user_insert =String(userid.value);

    await LoanStore.createDispust();

    file.value = null;
    selecData.value = [];
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
  loadUsers();
});
</script>

<template>
  <v-card height="60" class="d-flex align-center pa-4 mb-4" outlined>
    <h3 style="color: #1a237e">ຈັດການແກ້ໄຂຂໍ້ມູນທີ່ເກິດ Dispute</h3>
  </v-card>

  <v-row class="mb-4">
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

    <v-col cols="12" md="6" class="d-flex flex-column ga-3">
      <v-alert color="warning" variant="tonal" density="compact">
        <div class="d-flex align-center">
          <v-icon class="mr-2 ml-2">mdi-chat</v-icon>
          <span class="text-body-2">
            ທ່ານຕ້ອງໄດ້ຕິດຂັດເອກະສານທາງການເພື່ອຢັ້ງຢືນວ່າຂໍ້ມູນທີ່ທ່ານນຳສົ່ງມານີ້ເປັນຂໍ້ມູນທີ່ຖືກຕ້ອງ
            ແລະ ເພື່ອແຈ້ງໃຫ້ທາງ LCIC ອັບເດດໃຫ້
          </span>
        </div>
      </v-alert>

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

      <div class="d-flex align-end justify-start mt-auto">
        <v-btn
          color="primary"
          :loading="isUploading"
          :disabled="!isReadyToSubmit"
          @click="confirmUpload"
          size="large"
        >
          <v-icon start>mdi-check-circle</v-icon>
          ຢັ້ງຢືນການປ່ຽນແປງ
          <v-badge
            v-if="selectedCount > 0"
            :content="selectedCount"
            color="error"
            inline
            class="ml-2"
          />
        </v-btn>
      </div>
    </v-col>
      <v-data-table
    density="compact"
    :items="disputese"
    :headers="header"
    :items-per-page="reques.page_size"
    :loading="LoanStore.isLoading"
    class="elevation-1 "
  >
  <template v-slot:header.id="{column}" class="">
   <b style="color: blue;"> {{ column.title }}</b>
  </template>
  <template v-slot:header.LCIC_code="{column}" class="">
   <b style="color: blue;"> {{ column.title }}</b>
  </template>
  <template v-slot:header.com_enterprise_code="{column}" class="">
   <b style="color: blue;"> {{ column.title }}</b>
  </template>
  <template v-slot:header.bnk_code="{column}" class="">
   <b style="color: blue;"> {{ column.title }}</b>
  </template>
  <template v-slot:header.branch_id="{column}" class="">
   <b style="color: blue;"> {{ column.title }}</b>
  </template>
  <template v-slot:header.loan_id="{column}" class="">
   <b style="color: blue;"> {{ column.title }}</b>
  </template>
  <template v-slot:header.customer_id="{column}" class="">
   <b style="color: blue;"> {{ column.title }}</b>
  </template>
    <template v-slot:item.checkbox="{ item }">
      <v-checkbox
        class="compact-checkbox d-flex justify-center align-center"
        size="x-small"
        v-model="selecData"
        :value="item.id"
        :aria-label="`Select row for ${item.LCIC_code}`"
        @click.stop
      ></v-checkbox>
    </template>

    <template v-slot:header.checkbox>
      <v-checkbox
        class="compact-checkbox d-flex justify-center align-center"
        size="x-small"
        v-model="isAllSelected"
        :indeterminate="selectedCount > 0 && selectedCount < disputese.length"
        aria-label="Select all rows"
        @click.stop
      ></v-checkbox>
    </template>

    <template v-slot:item.id="{ item, index }">
      {{ (reques.page - 1) * reques.page_size + index + 1 }}
    </template>

    <template v-slot:item.LCIC_code="{ item }">
      <v-chip size="small" color="primary" variant="flat">
        {{ item.LCIC_code }}
      </v-chip>
    </template>

    <template v-slot:item.bnk_code="{ item }">
      <v-chip size="small" color="success">
        {{ mapMemberInfo(item.bnk_code) }}
      </v-chip>
    </template>

    <template v-slot:item.actions="{ item }">
      <v-btn size="small" color="info" variant="outlined">
        <v-icon start size="18">mdi-eye</v-icon>
        ເບິ່ງ
      </v-btn>
    </template>

    <template v-slot:bottom>
      <GloBalTablePaginations
        :page="LoanStore.data_fiter.query.page"
        :totalpage="LoanStore.respons_data_loan_list?.disputes.total_pages || 0"
        :limit="LoanStore.data_fiter.query.page_size"
        @onSelectionChange="onSelect"
        @onPagechange="onChang"
      />
    </template>

    <template v-slot:no-data>
      <v-alert type="info" variant="tonal" class="ma-4">
        <v-icon start>mdi-information</v-icon>
        ບໍ່ມີຂໍ້ມູນ Dispute
      </v-alert>
    </template>
  </v-data-table>
  </v-row>

  <!-- <pre>{{ selecData }}</pre> -->


</template>

<style scoped>
.compact-checkbox :deep(.v-selection-control) {
  --v-selection-control-size: 20px;
}

.compact-checkbox :deep(.v-icon) {
  font-size: 20px !important;
}
</style>
