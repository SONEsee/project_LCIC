<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { useLoanStore } from "~/stores/loan";
import { MemberStore } from "@/stores/memberinfo";
import { useMemberInfo } from "@/composables/memberInfo";


interface LoanItem {
  id?: number;
  LCIC_code?: string;
  com_enterprise_code?: string;
  bnk_code?: string;
  branch_id?: string;
  customer_id?: string;
  loan_id?: string;
  lcicID_get?: string;
  lcicID_error?: string;
  period?: string;
  [key: string]: any;
}


const memberinfoStore = MemberStore();
const { mapMemberInfo } = useMemberInfo();
const LoanStore = useLoanStore();
const route = useRoute();


definePageMeta({
  layout: "backend",
});

useHead({
  title: "Upload File - ລາຍລະອຽດການອັບໂຫຼດຂໍ້ມູນ",
  meta: [
    { name: "keywords", content: "Report, Nuxt 3, Backend, LCIC" },
    { name: "Description", content: "ລາຍງານການອັບໂຫຼດຂໍ້ມູນເຂົ້າລະບົບ LCIC" },
  ],
});


const tab = ref("one");
const subTab = ref("two-one");
const page = ref(1);
const itemsPerPage = ref(20);
const bDataIsDamaged = ref<LoanItem[]>([]);
const b1Monthly = ref<LoanItem[]>([]);
const b1 = ref<LoanItem[]>([]);
const uploadfile = ref<any[]>([]);


const baseHeaders = [
  { title: "ລຳດັບ", value: "id", width: "80px" },
  { title: "ລະຫັດ ຂສລ", value: "LCIC_code", width: "150px" },
  { title: "ລະຫັດວິສາຫະກິດ", value: "com_enterprise_code", width: "180px" },
  { title: "ທະນາຄານ", value: "bnk_code", width: "150px" },
  { title: "ລະຫັດສາຂາ", value: "branch_id", width: "120px" },
  { title: "ລະຫັດລູກຄ້າ", value: "customer_id", width: "150px" },
  { title: "ລະຫັດເງິນກູ້", value: "loan_id", width: "150px" },
];

const headers = baseHeaders;

const headers2 = [
  ...baseHeaders,
  { title: "ລະຫັດວິສາຫະກິດ (LCIC DB)", value: "lcicID_get", width: "180px" },
  { title: "ສະຖານະ", value: "lcicID_error", width: "200px" },
];

const headers3 = [
  ...baseHeaders,
  { title: "ລະຫັດ ຂສລ (LCIC DB)", value: "lcicID_get", width: "180px" },
  { title: "ສະຖານະ", value: "lcicID_error", width: "200px" },
];


const normalizeData = (data: any): LoanItem[] => {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") return [data];
  return [];
};

const dataedit = computed((): LoanItem[] => {
  return normalizeData(LoanStore.respons_data_loan_list?.data_edit);
});

const combinedData = computed((): LoanItem[] => {
  const damaged = normalizeData(
    LoanStore.respons_data_loan_list?.b_data_damaged
  );
  const edited = normalizeData(LoanStore.respons_data_loan_list?.data_edit);
  return [...damaged, ...edited];
});

const filteredBDataIsDamaged = computed((): LoanItem[] => {
  const data = normalizeData(LoanStore.respons_data_loan_list?.b_data_damaged);
  return data.filter(
    (item) => item.lcicID_error === "10" || item.lcicID_error === "13"
  );
});

const filteredBDataIsDamagedLcicIDError01 = computed((): LoanItem[] => {
  const data = normalizeData(LoanStore.respons_data_loan_list?.b_data_damaged);
  return data.filter(
    (item) => item.lcicID_error === "01" || item.lcicID_error === "31"
  );
});

const filteredBDataIsDamagedLcicIDError33 = computed((): LoanItem[] => {
  const data = normalizeData(LoanStore.respons_data_loan_list?.b_data_damaged);
  return data.filter((item) => item.lcicID_error === "33");
});

const disputese = computed((): LoanItem[] => {
  return normalizeData(LoanStore.respons_data_loan_list?.data_edit);
});


const totalUploaded = computed(() => combinedData.value.length);
const totalErrors = computed(
  () =>
    filteredBDataIsDamaged.value.length +
    filteredBDataIsDamagedLcicIDError01.value.length +
    filteredBDataIsDamagedLcicIDError33.value.length
);
const totalSuccess = computed(() => b1Monthly.value.length);


const exportToJson = () => {
  const dataToExport = filteredBDataIsDamagedLcicIDError01.value.map((item) => {
    const {
      lcicID_get,
      com_enterprise_code_get,
      id_file,
      id,
      period,
      com_enterprise_code_error,
      lcicID_error,
      ...rest
    } = item;
    return {
      ...rest,
      lcicID: lcicID_get,
    };
  });

  const jsonStr = JSON.stringify(dataToExport, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `LCIC_request_${new Date().toISOString().split("T")[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
};

const getErrorMessage = (errorCode: string): string => {
  const errorMessages: Record<string, string> = {
    "10": "ລະຫັດວິສາຫະກິດບໍ່ຖືກຕ້ອງ",
    "13": "ບໍ່ມີລະຫັດວິສາຫະກິດ",
    "01": "LCIC ID ບໍ່ຖືກຕ້ອງ",
    "31": "LCIC ID ວ່າງ",
    "33": "ຂໍ້ມູນຜິດພາດ",
  };
  return errorMessages[errorCode] || errorCode;
};

const getErrorColor = (errorCode: string): string => {
  return errorCode === "13" || errorCode === "31" ? "error" : "warning";
};


onMounted(() => {
  memberinfoStore.getMemberInfo();
  const code = route.query.code as string;
  if (code) {
    LoanStore.data_fiter.query.id_file = code;
    LoanStore.getDataLoan();
  }

  const queryData = route.query.data as string;
  if (queryData) {
    try {
      const parsedData = JSON.parse(queryData);
      bDataIsDamaged.value = parsedData.B_Data_is_damaged || [];
      b1Monthly.value = parsedData.B1_Monthly || [];
      b1.value = parsedData.B1 || [];
      uploadfile.value = parsedData.uploadfile || [];
    } catch (error) {
      console.error("Error parsing query data:", error);
    }
  }
});
</script>

<template>
  
 
    <v-card class="mb-6 elevation-3" rounded="lg">
      <v-card-title >
        <v-row align="center">
          <v-col cols="12" md="8">
            <div class="d-flex align-center">
              <v-icon size="32" class="mr-3">mdi-file-upload</v-icon>
              <div>
                <h2 class="">
                  ລາຍລະອຽດການອັບໂຫຼດຂໍ້ມູນເງິນກູ້
                </h2>
                <p class="text-subtitle-2 mt-1 ">
                  ລະບົບຈັດການຂໍ້ມູນເຂົ້າສູ່ LCIC
                </p>
              </div>
            </div>
          </v-col>
          <v-col cols="12" md="4" class="text-md-end">
            <v-chip
              v-if="uploadfile.length"
              color="white"
              text-color="primary"
              size="large"
              prepend-icon="mdi-file-document"
            >
              {{ uploadfile[0].fileName }}
            </v-chip>
          </v-col>
        </v-row>
      </v-card-title>

    
      <v-card-text class="pa-6">
        <v-row v-if="combinedData.length > 0">
          <v-col cols="12" md="3">
            <v-card class="" color="blue-lighten-5" flat>
             
              <v-card-text class="text-center">
                 <v-icon size="40" color="blue-darken-2">mdi-database</v-icon>
              <h3 class="text-h4 font-weight-bold mt-2">
                  {{ totalUploaded }}
                </h3>
               <p class="text-body-2 text-blue-darken-2">ທັງໝົດ</p> 
                
                
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="3">
            <v-card class="" color="success-lighten-5" flat>
              <v-card-text class="text-center">
                <v-icon size="40" color="success">mdi-check-circle</v-icon>
                <h3 class="text-h4 font-weight-bold mt-2">
                  {{ totalSuccess }}
                </h3>
                <p class="text-body-2 text-success">ສຳເລັດ</p>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="3">
            <v-card class="" color="error-lighten-5" flat>
              <v-card-text class="text-center">
                <v-icon size="40" color="error">mdi-alert-circle</v-icon>
                <h3 class="text-h4 font-weight-bold mt-2">{{ totalErrors }}</h3>
                <p class="text-body-2 text-error">ຜິດພາດ</p>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="3">
            <v-card class="" color="amber-lighten-5" flat>
              <v-card-text class="text-center">
                <v-icon size="40" color="amber-darken-2">mdi-calendar</v-icon>
                <h3 class="text-h6 font-weight-bold mt-2">
                  {{ combinedData[0].period?.substring(0, 4) }}/{{
                    combinedData[0].period?.substring(4, 6)
                  }}
                </h3>
                <p class="text-body-2 text-amber-darken-2">ປະຈຳເດືອນ</p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

  
    <v-card class="elevation-3" rounded="lg">
      <v-tabs
        v-model="tab"
        bg-color="primary"
        color="white"
        grow
        class="tabs-custom"
      >
        <v-tab value="one" class="font-weight-bold">
          <v-icon start>mdi-database-check</v-icon>
          ຂໍ້ມູນທີ່ອັບໂຫຼດທັງໝົດ
        </v-tab>
        <v-tab value="two" class="font-weight-bold">
          <v-icon start>mdi-alert</v-icon>
          ຂໍ້ມູນທີ່ບໍ່ຖືກຕ້ອງ
        </v-tab>
        <v-tab value="three" class="font-weight-bold">
          <v-icon start>mdi-check-all</v-icon>
          ຂໍ້ມູນສົມບູນ
        </v-tab>
      </v-tabs>

      <v-card-text class="pa-6">
        <v-window v-model="tab">
          <!-- Tab 1: All Data -->
          <v-window-item value="one">
            <v-card flat class="mb-4" color="blue-lighten-5" rounded="lg">
              <v-card-text>
                <v-icon color="blue-darken-2" class="mr-2"
                  >mdi-information</v-icon
                >
                <span class="font-weight-bold text-blue-darken-2">
                  ຂໍ້ມູນທັງໝົດທີ່ອັບໂຫຼດເຂົ້າລະບົບ
                </span>
              </v-card-text>
            </v-card>

            <v-data-table
              :loading="LoanStore.isLoading"
              :items="dataedit"
              :headers="headers"
              density="comfortable"
              v-model:page="page"
              v-model:items-per-page="itemsPerPage"
              class="elevation-1 rounded-lg custom-table"
              :items-per-page-options="[10, 20, 50, 100]"
            >
              <template v-slot:item.id="{ index }">
                <v-chip size="small" color="blue-grey-lighten-4">
                  {{ (page - 1) * itemsPerPage + index + 1 }}
                </v-chip>
              </template>

              <template v-slot:item.bnk_code="{ item }">
                <v-chip size="small" color="info" variant="flat">
                  {{ mapMemberInfo(item.bnk_code ?? "") }}
                </v-chip>
              </template>

              <template v-slot:item.LCIC_code="{ item }">
                <v-chip size="small" color="primary" variant="tonal">
                  {{ item.LCIC_code }}
                </v-chip>
              </template>

              <template v-slot:item.com_enterprise_code="{ item }">
                <v-chip size="small" color="success" variant="tonal">
                  {{ item.com_enterprise_code }}
                </v-chip>
              </template>
            </v-data-table>
          </v-window-item>

          <!-- Tab 2: Error Data -->
          <v-window-item value="two">
            <v-tabs v-model="subTab" bg-color="grey-lighten-4" color="error">
              <v-tab value="two-one">
                <v-icon start size="small">mdi-alert-circle</v-icon>
                Enterprise Code Error
              </v-tab>
              <v-tab value="two-two">
                <v-icon start size="small">mdi-alert-octagon</v-icon>
                ບໍ່ມີ LCIC ID
              </v-tab>
              <v-tab value="two-three">
                <v-icon start size="small">mdi-alert-box</v-icon>
                LCIC ID Error
              </v-tab>
            </v-tabs>

            <v-window v-model="subTab" class="mt-6">
              <!-- Sub Tab 1 -->
              <v-window-item value="two-one">
                <v-alert
                  type="warning"
                  variant="tonal"
                  class="mb-4"
                  prominent
                  icon="mdi-alert"
                >
                  <v-alert-title class="text-h6">
                    ຂໍ້ມູນທີ່ບໍ່ມີ ແລະ ຜິດ Enterprise Code
                  </v-alert-title>
                  <div>
                    ພົບຂໍ້ມູນທີ່ມີບັນຫາ:
                    {{ filteredBDataIsDamaged.length }} ລາຍການ
                  </div>
                </v-alert>

                <v-data-table
                  :items="filteredBDataIsDamaged"
                  :headers="headers2"
                  density="comfortable"
                  v-model:page="page"
                  v-model:items-per-page="itemsPerPage"
                  class="elevation-1 rounded-lg custom-table"
                >
                  <template v-slot:item.id="{ index }">
                    <v-chip size="small" color="grey-lighten-2">
                      {{ (page - 1) * itemsPerPage + index + 1 }}
                    </v-chip>
                  </template>

                  <template v-slot:item.LCIC_code="{ item }">
                    <v-chip size="small" color="primary" variant="tonal">
                      {{ item.LCIC_code }}
                    </v-chip>
                  </template>

                  <template v-slot:item.com_enterprise_code="{ item }">
                    <v-chip
                      size="small"
                      :color="
                        item.com_enterprise_code === '' ? 'error' : 'warning'
                      "
                      variant="flat"
                    >
                      {{ item.com_enterprise_code || "ບໍ່ມີ" }}
                    </v-chip>
                  </template>

                  <template v-slot:item.bnk_code="{ item }">
                    <v-chip size="small" color="info" variant="flat">
                      {{ mapMemberInfo(item.bnk_code ?? "") }}
                    </v-chip>
                  </template>

                  <template v-slot:item.lcicID_get="{ item }">
                    <v-chip size="small" color="success" variant="tonal">
                      {{ item.lcicID_get }}
                    </v-chip>
                  </template>

                  <template v-slot:item.lcicID_error="{ item }">
                    <v-chip
                      size="small"
                      :color="getErrorColor(item.lcicID_error || '')"
                      variant="flat"
                    >
                      <v-icon start size="small">mdi-alert</v-icon>
                      {{ getErrorMessage(item.lcicID_error ?? "") }}
                    </v-chip>
                  </template>
                </v-data-table>
              </v-window-item>

              <!-- Sub Tab 2 -->
              <v-window-item value="two-two">
                <div class="d-flex justify-space-between align-center mb-4">
                  <v-alert
                    type="error"
                    variant="tonal"
                    class="flex-grow-1"
                    prominent
                  >
                    <v-alert-title class="text-h6">
                      ຂໍ້ມູນທີ່ບໍ່ມີ LCIC ID
                    </v-alert-title>
                    <div>
                      ພົບຂໍ້ມູນທີ່ມີບັນຫາ:
                      {{ filteredBDataIsDamagedLcicIDError01.length }} ລາຍການ
                    </div>
                  </v-alert>

                  <v-btn
                    @click="exportToJson"
                    color="error"
                    size="large"
                    class="ml-4"
                    prepend-icon="mdi-download"
                  >
                    Export JSON
                  </v-btn>
                </div>

                <v-data-table
                  :items="filteredBDataIsDamagedLcicIDError01"
                  :headers="headers3"
                  density="comfortable"
                  v-model:page="page"
                  v-model:items-per-page="itemsPerPage"
                  class="elevation-1 rounded-lg custom-table"
                >
                  <template v-slot:item.id="{ index }">
                    <v-chip size="small" color="grey-lighten-2">
                      {{ (page - 1) * itemsPerPage + index + 1 }}
                    </v-chip>
                  </template>

                  <template v-slot:item.LCIC_code="{ item }">
                    <v-chip size="small" color="error" variant="tonal">
                      {{ item.LCIC_code }}
                    </v-chip>
                  </template>

                  <template v-slot:item.bnk_code="{ item }">
                    <v-chip size="small" color="info" variant="flat">
                      {{ mapMemberInfo(item.bnk_code ?? "") }}
                    </v-chip>
                  </template>

                  <template v-slot:item.lcicID_get="{ item }">
                    <v-chip size="small" color="success" variant="tonal">
                      {{ item.lcicID_get }}
                    </v-chip>
                  </template>

                  <template v-slot:item.lcicID_error="{ item }">
                    <v-chip
                      size="small"
                      :color="getErrorColor(item.lcicID_error || '')"
                      variant="flat"
                    >
                      <v-icon start size="small">mdi-alert</v-icon>
                      {{ getErrorMessage(item.lcicID_error ?? "") }}
                    </v-chip>
                  </template>
                </v-data-table>
              </v-window-item>

              <!-- Sub Tab 3 -->
              <v-window-item value="two-three">
                <v-alert type="warning" variant="tonal" class="mb-4" prominent>
                  <v-alert-title class="text-h6">
                    ຂໍ້ມູນທີ່ມີ LCIC ID ແຕ່ມີບັນຫາ
                  </v-alert-title>
                  <div>
                    ພົບຂໍ້ມູນທີ່ມີບັນຫາ:
                    {{ filteredBDataIsDamagedLcicIDError33.length }} ລາຍການ
                  </div>
                </v-alert>

                <v-data-table
                  :items="filteredBDataIsDamagedLcicIDError33"
                  :headers="headers"
                  density="comfortable"
                  class="elevation-1 rounded-lg custom-table"
                >
                  <template v-slot:item.id="{ index }">
                    <v-chip size="small" color="grey-lighten-2">
                      {{ index + 1 }}
                    </v-chip>
                  </template>

                  <template v-slot:item.LCIC_code="{ item }">
                    <v-chip size="small" color="warning" variant="tonal">
                      {{ item.LCIC_code }}
                    </v-chip>
                  </template>

                  <template v-slot:item.bnk_code="{ item }">
                    <v-chip size="small" color="info" variant="flat">
                      {{ mapMemberInfo(item.bnk_code ?? "") }}
                    </v-chip>
                  </template>
                </v-data-table>
              </v-window-item>
            </v-window>
          </v-window-item>

          <!-- Tab 3: Success Data -->
          <v-window-item value="three">
            <v-alert
              type="success"
              variant="tonal"
              class="mb-4"
              prominent
              icon="mdi-check-circle"
            >
              <v-alert-title class="text-h6">
                ຂໍ້ມູນທີ່ອັບໂຫຼດສຳເລັດ
              </v-alert-title>
              <div>
                ຂໍ້ມູນທີ່ຜ່ານການກວດສອບ ແລະ ຖືກບັນທຶກລົງຖານຂໍ້ມູນແລ້ວ:
                {{ b1Monthly.length }} ລາຍການ
              </div>
            </v-alert>

            <v-data-table
              :items="b1Monthly"
              :headers="headers"
              density="comfortable"
              class="elevation-1 rounded-lg custom-table"
            >
              <template v-slot:item.id="{ index }">
                <v-chip size="small" color="success-lighten-4">
                  {{ index + 1 }}
                </v-chip>
              </template>

              <template v-slot:item.LCIC_code="{ item }">
                <v-chip size="small" color="success" variant="tonal">
                  {{ item.LCIC_code }}
                </v-chip>
              </template>

              <template v-slot:item.com_enterprise_code="{ item }">
                <v-chip size="small" color="success" variant="tonal">
                  {{ item.com_enterprise_code }}
                </v-chip>
              </template>

              <template v-slot:item.bnk_code="{ item }">
                <v-chip size="small" color="info" variant="flat">
                  {{ mapMemberInfo(item.bnk_code ?? "") }}
                </v-chip>
              </template>
            </v-data-table>
          </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>
 
</template>

<style scoped>
.bg-gradient-primary {
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
}

.stat-card {
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.tabs-custom :deep(.v-tab) {
  text-transform: none;
  letter-spacing: 0;
}

.custom-table {
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.custom-table :deep(thead) {
  background-color: #f5f5f5;
}

.custom-table :deep(th) {
  font-weight: 600 !important;
  color: #1976d2 !important;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
}

.custom-table :deep(tbody tr:hover) {
  background-color: #f8f9fa !important;
}

.custom-table :deep(.v-data-table__td) {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05) !important;
}
</style>
