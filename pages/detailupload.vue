<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { useLoanStore } from "~/stores/loan";
import { MemberStore } from "@/stores/memberinfo";
import { useMemberInfo } from "@/composables/memberInfo";

const memberinfoStore = MemberStore();
const { mapMemberInfo, getMemberName, getMemberDetails } = useMemberInfo();

definePageMeta({
  layout: "backend",
});

useHead({
  title: "Upload File",
  meta: [
    { name: "keywords", content: "Report, Nuxt 3, Backend" },
    {
      name: "Description",
      content: "Report Nuxt 3, IT Genius Engineering",
    },
  ],
});

const LoanStore = useLoanStore();
const reques = LoanStore.data_fiter.query;
async function onSelectonChange(value: number) {
  reques.page_size = value;
  await LoanStore.getDataLoan();
}
async function onPagechange(value: number) {
  reques.page = value;
  await LoanStore.getDataLoan();
}
const tab = ref("one");
const subTab = ref("two-one");

const bDataIsDamaged = ref<any[]>([]);
const b1 = ref<any[]>([]);
const uploadfile = ref<any[]>([]);
const route = useRoute();

const combinedData = computed(() => {
  const data = LoanStore.respons_data_loan_list?.b_data_damaged.items;
  const mapdata = LoanStore.respons_data_loan_list?.data_edit.items;
  const dataArray = Array.isArray(data) ? data : [];
  const mapdataArray = Array.isArray(mapdata) ? mapdata : [];
  return [...dataArray, ...mapdataArray];
});

const dataedit = computed(() => {
  const data = LoanStore.respons_data_loan_list?.data_edit.items;
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") return [data];
  return [];
});

const disputese = computed(() => {
  const data = LoanStore.respons_data_loan_list?.disputes.items;
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") return [data];
  return [];
});

const b1Monthly = computed(() => {
  const data = LoanStore.respons_data_loan_list?.b1_monthly.items;
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") return [data];
  return [];
});

const headers = [
  { title: "ລຳດັບ", value: "id" },
  { title: "ລະຫັດ ຂສລ", value: "LCIC_code" },
  { title: "ລະຫັດວິສາຫະກິດ", value: "com_enterprise_code" },
  { title: "ທະນາຄານ", value: "bnk_code" },
  { title: "ລະຫັດສາຂາ", value: "branch_id" },
  { title: "ລະຫັດລູກຄ່າ", value: "customer_id" },
  { title: "ລະຫັດເງິນກູ້", value: "loan_id" },
];

const headers2 = [
  { title: "ລຳດັບ", value: "id" },
  { title: "ລະຫັດ ຂສລ", value: "LCIC_code" },
  { title: "ລະຫັດວິສາຫະກິດ", value: "com_enterprise_code" },
  { title: "ທະນາຄານ", value: "bnk_code" },
  { title: "ລະຫັດສາຂາ", value: "branch_id" },
  { title: "ລະຫັດລູກຄ່າ", value: "customer_id" },
  { title: "ລະຫັດເງິນກູ້", value: "loan_id" },
  { title: "ລະຫັດວິສາຫະກິດ(ໃນຖານຂໍ້ມູນ ຂສລ)", value: "lcicID_get" },
  { title: "ສະຖານະ", value: "lcicID_error" },
];

const headers3 = [
  { title: "ລຳດັບ", value: "id" },
  { title: "ລະຫັດ ຂສລ", value: "LCIC_code" },
  { title: "ລະຫັດວິສາຫະກິດ", value: "com_enterprise_code" },
  { title: "ທະນາຄານ", value: "bnk_code" },
  { title: "ລະຫັດສາຂາ", value: "branch_id" },
  { title: "ລະຫັດລູກຄ່າ", value: "customer_id" },
  { title: "ລະຫັດເງິນກູ້", value: "loan_id" },
  { title: "ລະຫັດ ຂສລ(ໃນຖານຂໍ້ມູນ ຂສລ)", value: "lcicID_get" },
  { title: "ສະຖານະ", value: "lcicID_error" },
];

const headers4 = [
  { title: "ລຳດັບ", value: "id" },
  { title: "ລະຫັດ ຂສລ", value: "LCIC_code" },
  { title: "ລະຫັດວິສາຫະກິດ", value: "com_enterprise_code" },
  { title: "ທະນາຄານ", value: "bnk_code" },
  { title: "ລະຫັດສາຂາ", value: "branch_id" },
  { title: "ລະຫັດລູກຄ່າ", value: "customer_id" },
  { title: "ລະຫັດເງິນກູ້", value: "loan_id" },
  { title: "ສະຖານະ", value: "lcicID_error" },
];

const headers5 = [
  { title: "ລຳດັບ", value: "id" },
  { title: "ລະຫັດ ຂສລ", value: "LCIC_code" },
  { title: "ລະຫັດວິສາຫະກິດ", value: "com_enterprise_code" },
  { title: "ທະນາຄານ", value: "bnk_code" },
  { title: "ລະຫັດສາຂາ", value: "branch_id" },
  { title: "ລະຫັດລູກຄ່າ", value: "customer_id" },
  { title: "ລະຫັດເງິນກູ້", value: "loan_id" },
];

const code = route.query.code as string;

const filteredBDataIsDamaged = computed(() => {
  const data = LoanStore.respons_data_loan_list?.b_data_damaged.items;
  let DataMap = [] as any;
  if (Array.isArray(data)) {
    DataMap = data;
  } else if (data && typeof data === "object") {
    DataMap = [data];
  }
  return DataMap.filter(
    (item: any) => item.lcicID_error === "10" || item.lcicID_error === "13"
  );
});

const filteredBDataIsDamagedLcicIDError01 = computed(() => {
  const data = LoanStore.respons_data_loan_list?.b_data_damaged.items;
  let DataMap = [] as any;
  if (Array.isArray(data)) {
    DataMap = data;
  } else if (data && typeof data === "object") {
    DataMap = [data];
  }
  return DataMap.filter(
    (item: any) => item.lcicID_error === "01" || item.lcicID_error === "31"
  );
});

const filteredBDataIsDamagedLcicIDError33 = computed(() => {
  const data = LoanStore.respons_data_loan_list?.b_data_damaged.items;
  let DataMap = [] as any;
  if (Array.isArray(data)) {
    DataMap = data;
  } else if (data && typeof data === "object") {
    DataMap = [data];
  }
  return DataMap.filter(
    (item: any) => item.lcicID_error === "33" || item.lcicID_error === "11"
  );
});

const exportToJson = () => {
  const dataToExport = filteredBDataIsDamagedLcicIDError01.value.map(
    (item: any) => {
      const {
        lcicID_get,
        com_enterprise_code_get,
        id_file,
        id,
        period,
        com_enterprise_code_error,
        lcicID_error,
        filteredBDataIsDamagedLcicIDError01,
        ...rest
      } = item;
      return {
        ...rest,
        lcicID: lcicID_get,
      };
    }
  );

  const jsonStr = JSON.stringify(dataToExport, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "LCIC request.json";
  link.click();
  URL.revokeObjectURL(url);
};



onMounted(() => {
  memberinfoStore.getMemberInfo();
  LoanStore.data_fiter.query.id_file = code;
  LoanStore.getDataLoan();
  const queryData = route.query.data as string;
  if (queryData) {
    const parsedData = JSON.parse(queryData);
    bDataIsDamaged.value = parsedData.B_Data_is_damaged || [];
    b1.value = parsedData.B1 || [];
    uploadfile.value = parsedData.uploadfile || [];
  }
});
</script>

<template>
  <div
    class="pa-6"
    style="
      background: linear-gradient(to bottom, #f8f9fa 0%, #ffffff 100%);
      min-height: 100vh;
    "
  >
    <v-card
      elevation="0"
      class="mb-6"
      style="
        border-radius: 16px;
        border: 1px solid #e3e8ef;
        background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
      "
    >
      <v-card-text class="pa-6">
        <v-row align="center">
          <v-col cols="12" md="8">
            <div class="d-flex align-center mb-4">
              <v-icon color="#667eea" size="28" class="mr-3"
                >mdi-cloud-upload</v-icon
              >
              <h2 style="color: #1e293b; font-weight: 600; font-size: 22px">
                ລາຍລະອຽດການອັບໂຫຼດຂໍ້ມູນ
              </h2>
            </div>
            <div class="d-flex align-center">
              <v-chip
                color="#667eea"
                variant="flat"
                size="large"
                class="px-6"
                style="font-size: 16px; font-weight: 600; border-radius: 12px"
              >
                {{
                  Number(
                    LoanStore.respons_data_loan_list?.data_edit.total_items
                  ) +
                    Number(
                      LoanStore.respons_data_loan_list?.b_data_damaged
                        .total_items
                    ) || 0
                }}
              </v-chip>
              <span class="ml-3" style="color: #64748b; font-size: 15px"
                >ລາຍການທັງໝົດ</span
              >
            </div>
          </v-col>
          <v-col
            cols="12"
            md="4"
            class="text-md-end"
            v-if="combinedData.length > 0"
          >
            <div class="mb-2">
              <span style="color: #64748b; font-size: 14px">ທະນາຄານ: </span>
              <span style="color: #1e293b; font-weight: 600">{{
                mapMemberInfo(combinedData[0].bnk_code)
              }}</span>
            </div>
            <div>
              <span style="color: #64748b; font-size: 14px">ປະຈຳເດືອນ: </span>
              <span style="color: #1e293b; font-weight: 600">
                {{ combinedData[0].period[0] }}{{ combinedData[0].period[1]
                }}{{ combinedData[0].period[2]
                }}{{ combinedData[0].period[3] }}/{{ combinedData[0].period[4]
                }}{{ combinedData[0].period[5] }}
              </span>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-card
      elevation="0"
      style="border-radius: 16px; border: 1px solid #e3e8ef"
    >
      <v-tabs
        align-tabs="center"
        v-model="tab"
        color="#667eea"
        height="64"
        class="px-4"
        style="border-bottom: 1px solid #e3e8ef"
        flat
      >
        <v-tab
          value="one"
          style="
            font-size: 15px;
            font-weight: 500;
            text-transform: none;
            border-radius: 8px 8px 0 0;
          "
        >
          <v-icon size="20" class="mr-2"> mdi-database-outline</v-icon>
          ຂໍ້ມູນທັງໝົດ
        </v-tab>
        <v-tab
          value="two"
          style="
            font-size: 15px;
            font-weight: 500;
            text-transform: none;
            border-radius: 8px 8px 0 0;
          "
        >
          <v-icon size="20" class="mr-2">mdi-alert-circle</v-icon>
          ຂໍ້ມູນບໍ່ຖືກຕ້ອງ
        </v-tab>
        <v-tab
          value="three"
          style="
            font-size: 15px;
            font-weight: 500;
            text-transform: none;
            border-radius: 8px 8px 0 0;
          "
        >
          <v-icon size="20" class="mr-2">mdi-check-circle</v-icon>
          ອັບໂຫຼດສຳເລັດ
        </v-tab>
      </v-tabs>

      <v-card-text class="pa-6">
        <v-window v-model="tab">
          <!-- Tab 1: All Data -->
          <v-window-item value="one">
            <div class="mb-4">
              <h3 style="color: #1e293b; font-weight: 600; font-size: 18px">
                ຂໍ້ມູນທີ່ອັບໂຫຼດທັງໝົດ
              </h3>
            </div>
            <v-data-table
              :loading="LoanStore.isLoading"
              :items="dataedit"
              :headers="headers"
              density="comfortable"
              :items-per-page="reques.page_size"
        
              class="elevation-0"
              style="
                border: 1px solid #e3e8ef;
                border-radius: 12px;
                overflow: hidden;
              "
            >
              <template v-slot:top> </template>
              <template v-slot:header.id="{ column }">
                <th style="color: #0d47a1">{{ column.title }}</th>
              </template>
              <template v-slot:header.LCIC_code="{ column }">
                <th style="color: #0d47a1">{{ column.title }}</th>
              </template>
              <template v-slot:header.com_enterprise_code="{ column }">
                <th style="color: #0d47a1">{{ column.title }}</th>
              </template>
              <template v-slot:header.bnk_code="{ column }">
                <th style="color: #0d47a1">{{ column.title }}</th>
              </template>
              <template v-slot:header.customer_id="{ column }">
                <th style="color: #0d47a1">{{ column.title }}</th>
              </template>
              <template v-slot:header.branch_id="{ column }">
                <th style="color: #0d47a1">{{ column.title }}</th>
              </template>
              <template v-slot:header.loan_id="{ column }">
                <th style="color: #0d47a1">{{ column.title }}</th>
              </template>
              <template v-slot:header.col_id="{ column }">
                <th style="color: #0d47a1">{{ column.title }}</th>
              </template>
              <template v-slot:item.id="{ index }">
                <span style="color: #64748b">{{
                  (reques.page - 1) * reques.page_size + index + 1
                }}</span>
              </template>
              <template v-slot:item.bnk_code="{ item }">
                <span style="color: #1e293b">{{
                  mapMemberInfo(item.bnk_code)
                }}</span>
              </template>
              <template v-slot:item.LCIC_code="{ item }">
                <v-chip
                  variant="flat"
                  size="small"
                  style="
                    background: #dbeafe;
                    color: #1e40af;
                    border-radius: 8px;
                    font-weight: 500;
                  "
                >
                  {{ item.LCIC_code }}
                </v-chip>
              </template>
              <template v-slot:item.com_enterprise_code="{ item }">
                <v-chip
                  variant="flat"
                  size="small"
                  style="
                    background: #ddd6fe;
                    color: #6d28d9;
                    border-radius: 8px;
                    font-weight: 500;
                  "
                >
                  {{ item.com_enterprise_code }}
                </v-chip>
              </template>
              <template v-slot:bottom>
                <GloBalTablePaginations
                  :page="reques.page"
                  :limit="reques.page_size"
                  :totalpage="
                    LoanStore.respons_data_loan_list?.data_edit.total_pages || 1
                  "
                  @onSelectionChange="onSelectonChange"
                  @onPagechange="onPagechange"
                />
              </template>
            </v-data-table>
          </v-window-item>

          <v-window-item value="two">
            <v-tabs
              align-tabs="center"
              v-model="subTab"
              color="#f59e0b"
              height="56"
              class="mb-4"
              style="border-radius: 12px; background: #fef3c7; padding: 8px"
            >
              <v-tab
                value="two-one"
                style="
                  font-size: 14px;
                  text-transform: none;
                  border-radius: 8px;
                "
              >
                <v-icon size="18" class="mr-2">mdi-alert</v-icon>
                ວິສາຫະກິດບໍ່ຖືກ
                <v-chip
                  class="ml-2"
                  size="x-small"
                  style="background: #fecaca; color: #991b1b; font-weight: 600"
                >
                  {{ filteredBDataIsDamaged.length }}
                </v-chip>
              </v-tab>
              <v-tab
                value="two-two"
                style="
                  font-size: 14px;
                  text-transform: none;
                  border-radius: 8px;
                "
              >
                <v-icon size="18" class="mr-2">mdi-alert</v-icon>
                ຂສລບໍ່ຖືກ
                <v-chip
                  class="ml-2"
                  size="x-small"
                  style="background: #fecaca; color: #991b1b; font-weight: 600"
                >
                  {{ filteredBDataIsDamagedLcicIDError01.length }}
                </v-chip>
              </v-tab>
              <v-tab
                value="two-three"
                style="
                  font-size: 14px;
                  text-transform: none;
                  border-radius: 8px;
                "
              >
                <v-icon size="18" class="mr-2">mdi-alert-octagon</v-icon>
                ທັງສອງບໍ່ຖືກ
                <v-chip
                  class="ml-2"
                  size="x-small"
                  style="background: #fecaca; color: #991b1b; font-weight: 600"
                >
                  {{ filteredBDataIsDamagedLcicIDError33.length }}
                </v-chip>
              </v-tab>
              <v-tab
                value="two-five"
                style="
                  font-size: 14px;
                  text-transform: none;
                  border-radius: 8px;
                "
              >
                <v-icon size="18" class="mr-2">mdi-help-circle</v-icon>
                Disputes
                <v-chip
                  class="ml-2"
                  size="x-small"
                  style="background: #fecaca; color: #991b1b; font-weight: 600"
                >
                  {{ disputese.length }}
                </v-chip>
              </v-tab>
            </v-tabs>

            <v-window v-model="subTab">
              <v-window-item value="two-one">
                <div class="mb-4">
                  <h4 style="color: #1e293b; font-weight: 600">
                    ລະຫັດວິສາຫະກິດບໍ່ຖືກຕ້ອງ ຫຼື ບໍ່ມີ
                  </h4>
                </div>

                <v-row class="mb-3">
                  <v-col cols="6">
                    <div
                      class="pa-3 text-center"
                      style="
                        background: #e0e7ff;
                        border-radius: 10px;
                        border-left: 4px solid #6366f1;
                      "
                    >
                      <span
                        style="
                          color: #4338ca;
                          font-weight: 600;
                          font-size: 14px;
                        "
                        >ຂໍ້ມູນສະມາຊິກ</span
                      >
                    </div>
                  </v-col>
                  <v-col cols="6">
                    <div
                      class="pa-3 text-center"
                      style="
                        background: #fef3c7;
                        border-radius: 10px;
                        border-left: 4px solid #f59e0b;
                      "
                    >
                      <span
                        style="
                          color: #92400e;
                          font-weight: 600;
                          font-size: 14px;
                        "
                        >ຂໍ້ມູນ LCIC DB</span
                      >
                    </div>
                  </v-col>
                </v-row>

                <v-data-table
                  :items="filteredBDataIsDamaged"
                  :headers="headers2"
                  density="comfortable"
                 
                 :items-per-page="reques.page_size"
                  class="elevation-0"
                  style="
                    border: 1px solid #e3e8ef;
                    border-radius: 12px;
                    overflow: hidden;
                  "
                >
                  <template v-slot:header.id="{ column }">
                    <span style="color: #0d47a1; font-weight: bold">{{
                      column.title
                    }}</span>
                  </template>
                  <template v-slot:header.LCIC_code="{ column }">
                    <span style="color: #0d47a1; font-weight: bold">{{
                      column.title
                    }}</span>
                  </template>
                  <template v-slot:header.com_enterprise_code="{ column }">
                    <span style="color: #0d47a1; font-weight: bold">{{
                      column.title
                    }}</span>
                  </template>
                  <template v-slot:header.bnk_code="{ column }">
                    <span style="color: #0d47a1; font-weight: bold">{{
                      column.title
                    }}</span>
                  </template>
                  <template v-slot:header.customer_id="{ column }">
                    <span style="color: #0d47a1; font-weight: bold">{{
                      column.title
                    }}</span>
                  </template>
                  <template v-slot:header.branch_id="{ column }">
                    <span style="color: #0d47a1; font-weight: bold">{{
                      column.title
                    }}</span>
                  </template>
                  <template v-slot:header.loan_id="{ column }">
                    <span style="color: #0d47a1; font-weight: bold">{{
                      column.title
                    }}</span>
                  </template>
                  <template v-slot:header.lcicID_get="{ column }">
                    <span style="color: #0d47a1; font-weight: bold">{{
                      column.title
                    }}</span>
                  </template>
                  <template v-slot:header.lcicID_error="{ column }">
                    <span style="color: #0d47a1; font-weight: bold">{{
                      column.title
                    }}</span>
                  </template>
                  <template v-slot:item.id="{ index }">
                   <span style="color: #64748b">{{
                  (reques.page - 1) * reques.page_size + index + 1
                }}</span>
                  </template>
                  <template v-slot:item.LCIC_code="{ item }">
                    <v-chip
                      variant="flat"
                      size="small"
                      style="
                        background: #dbeafe;
                        color: #1e40af;
                        border-radius: 8px;
                      "
                    >
                      {{ (item as any).LCIC_code }}
                    </v-chip>
                  </template>
                  <template v-slot:item.com_enterprise_code="{ item }">
                    <v-chip
                      variant="flat"
                      size="small"
                      v-if="(item as any).com_enterprise_code === ''"
                      style="
                        background: #fee2e2;
                        color: #991b1b;
                        border-radius: 8px;
                      "
                    >
                      ບໍ່ມີ
                    </v-chip>
                    <v-chip
                      variant="flat"
                      size="small"
                      v-else
                      style="
                        background: #fed7aa;
                        color: #9a3412;
                        border-radius: 8px;
                      "
                    >
                      ບໍ່ຖືກ
                    </v-chip>
                  </template>
                  <template v-slot:item.lcicID_error="{ item }">
                    <v-chip
                      variant="flat"
                      size="small"
                      v-if="(item as any).lcicID_error === '13'"
                      style="
                        background: #fee2e2;
                        color: #991b1b;
                        border-radius: 8px;
                      "
                    >
                      ບໍ່ມີລະຫັດວິສາຫະກິດ
                    </v-chip>
                    <v-chip
                      variant="flat"
                      size="small"
                      v-else
                      style="
                        background: #fed7aa;
                        color: #9a3412;
                        border-radius: 8px;
                      "
                    >
                      ບໍ່ຖືກຕ້ອງ
                    </v-chip>
                  </template>
                  <template v-slot:item.bnk_code="{ item }">
                    <v-chip
                      variant="flat"
                      size="small"
                      style="
                        background: #e0e7ff;
                        color: #3730a3;
                        border-radius: 8px;
                      "
                    >
                      {{ mapMemberInfo((item as any).bnk_code) }}
                    </v-chip>
                  </template>
                  <template v-slot:item.lcicID_get="{ item }">
                    <v-chip
                      variant="flat"
                      size="small"
                      style="
                        background: #d1fae5;
                        color: #065f46;
                        border-radius: 8px;
                      "
                    >
                      {{ (item as any).lcicID_get }}
                    </v-chip>
                  </template>
                  <template v-slot:bottom>
                <GloBalTablePaginations
                  :page="reques.page"
                  :limit="reques.page_size"
                  :totalpage="
                    LoanStore.respons_data_loan_list?.b_data_damaged.total_pages || 1
                  "
                  @onSelectionChange="onSelectonChange"
                  @onPagechange="onPagechange"
                />
              </template>
                </v-data-table>
              </v-window-item>

              <!-- Sub Tab 2: LCIC ID Error -->
              <v-window-item value="two-two">
                <div class="d-flex justify-space-between align-center mb-4">
                  <h4 style="color: #1e293b; font-weight: 600">
                    ລະຫັດ ຂສລ ບໍ່ຖືກຕ້ອງ ຫຼື ບໍ່ມີ
                  </h4>
                  <v-btn
                    @click="exportToJson"
                    prepend-icon="mdi-download"
                    color="#f59e0b"
                    variant="flat"
                    style="
                      border-radius: 10px;
                      text-transform: none;
                      font-weight: 500;
                    "
                  >
                    Export JSON
                  </v-btn>
                </div>

                <!-- Source Labels -->
                <v-row class="mb-3">
                  <v-col cols="8">
                    <div
                      class="pa-3 text-center"
                      style="
                        background: #e0e7ff;
                        border-radius: 10px;
                        border-left: 4px solid #6366f1;
                      "
                    >
                      <span
                        style="
                          color: #4338ca;
                          font-weight: 600;
                          font-size: 14px;
                        "
                        >ຂໍ້ມູນສະມາຊິກ</span
                      >
                    </div>
                  </v-col>
                  <v-col cols="4">
                    <div
                      class="pa-3 text-center"
                      style="
                        background: #fef3c7;
                        border-radius: 10px;
                        border-left: 4px solid #f59e0b;
                      "
                    >
                      <span
                        style="
                          color: #92400e;
                          font-weight: 600;
                          font-size: 14px;
                        "
                        >LCIC DB</span
                      >
                    </div>
                  </v-col>
                </v-row>

                <v-data-table
                  :items="filteredBDataIsDamagedLcicIDError01"
                  :headers="headers3"
                  density="comfortable"
                  
                  :items-per-page="reques.page_size"
                  class="elevation-0"
                  style="
                    border: 1px solid #e3e8ef;
                    border-radius: 12px;
                    overflow: hidden;
                  "
                >
                  <template v-slot:header.id="{ column }">
                    <th style="color: #0d47a1">{{ column.title }}</th>
                  </template>
                  <template v-slot:header.LCIC_code="{ column }">
                    <th style="color: #0d47a1">{{ column.title }}</th>
                  </template>
                  <template v-slot:header.com_enterprise_code="{ column }">
                    <th style="color: #0d47a1">{{ column.title }}</th>
                  </template>
                  <template v-slot:header.bnk_code="{ column }">
                    <th style="color: #0d47a1">{{ column.title }}</th>
                  </template>
                  <template v-slot:header.customer_id="{ column }">
                    <th style="color: #0d47a1">{{ column.title }}</th>
                  </template>
                  <template v-slot:header.branch_id="{ column }">
                    <th style="color: #0d47a1">{{ column.title }}</th>
                  </template>
                  <template v-slot:header.loan_id="{ column }">
                    <th style="color: #0d47a1">{{ column.title }}</th>
                  </template>
                  <template v-slot:header.lcicID_get="{ column }">
                    <th style="color: #0d47a1">{{ column.title }}</th>
                  </template>
                  <template v-slot:header.lcicID_error="{ column }">
                    <th style="color: #0d47a1">{{ column.title }}</th>
                  </template>
                  <template v-slot:item.id="{ index }">
                  <span style="color: #64748b">{{
                  (reques.page - 1) * reques.page_size + index + 1
                }}</span>
                  </template>
                  <template v-slot:item.LCIC_code="{ item }">
                    <v-chip
                      v-if="(item as any).LCIC_code===''"
                      variant="flat"
                      size="small"
                      style="
                        background: #fee2e2;
                        color: #991b1b;
                        border-radius: 8px;
                      "
                    >
                      ບໍ່ມີ
                    </v-chip>
                    <v-chip
                      v-else
                      variant="flat"
                      size="small"
                      style="
                        background: #fed7aa;
                        color: #9a3412;
                        border-radius: 8px;
                      "
                    >
                      {{ (item as any).LCIC_code }}
                    </v-chip>
                  </template>
                  <template v-slot:item.com_enterprise_code="{ item }">
                    <v-chip
                      variant="flat"
                      size="small"
                      style="
                        background: #ddd6fe;
                        color: #6d28d9;
                        border-radius: 8px;
                      "
                    >
                      {{ (item as any).com_enterprise_code }}
                    </v-chip>
                  </template>
                  <template v-slot:item.bnk_code="{ item }">
                    <v-chip
                      variant="flat"
                      size="small"
                      style="
                        background: #e0e7ff;
                        color: #3730a3;
                        border-radius: 8px;
                      "
                    >
                      {{ mapMemberInfo((item as any).bnk_code) }}
                    </v-chip>
                  </template>
                  <template v-slot:item.lcicID_error="{ item }">
                    <v-chip
                      v-if="(item as any).lcicID_error==='01'"
                      variant="flat"
                      size="small"
                      style="
                        background: #fed7aa;
                        color: #9a3412;
                        border-radius: 8px;
                      "
                    >
                      ບໍ່ຖືກຕ້ອງ
                    </v-chip>
                    <v-chip
                      v-else
                      variant="flat"
                      size="small"
                      style="
                        background: #fee2e2;
                        color: #991b1b;
                        border-radius: 8px;
                      "
                    >
                      ບໍ່ມີ
                    </v-chip>
                  </template>
                  <template v-slot:bottom>
                <GloBalTablePaginations
                  :page="reques.page"
                  :limit="reques.page_size"
                  :totalpage="
                    LoanStore.respons_data_loan_list?.b_data_damaged.total_pages || 1
                  "
                  @onSelectionChange="onSelectonChange"
                  @onPagechange="onPagechange"
                />
              </template>
                </v-data-table>
              </v-window-item>

              <!-- Sub Tab 3: Both Error -->
              <v-window-item value="two-three">
                <div class="mb-4">
                  <h4 style="color: #1e293b; font-weight: 600">
                    ລະຫັດວິສາຫະກິດ ແລະ ຂສລ ທັງສອງບໍ່ຖືກຕ້ອງ
                  </h4>
                </div>

                <v-data-table
                  :items="filteredBDataIsDamagedLcicIDError33"
                  :headers="headers4"
                  density="comfortable"
                
                  :items-per-page="reques.page_size"
                  class="elevation-0"
                  style="
                    border: 1px solid #e3e8ef;
                    border-radius: 12px;
                    overflow: hidden;
                  "
                >
                  <template v-slot:header.id="{ column }">
                    <th style="color: #0d47a1">{{ column.title }}</th>
                  </template>
                  <template v-slot:header.LCIC_code="{ column }">
                    <th style="color: #0d47a1">{{ column.title }}</th>
                  </template>
                  <template v-slot:header.com_enterprise_code="{ column }">
                    <th style="color: #0d47a1">{{ column.title }}</th>
                  </template>
                  <template v-slot:header.bnk_code="{ column }">
                    <th style="color: #0d47a1">{{ column.title }}</th>
                  </template>
                  <template v-slot:header.customer_id="{ column }">
                    <th style="color: #0d47a1">{{ column.title }}</th>
                  </template>
                  <template v-slot:header.branch_id="{ column }">
                    <th style="color: #0d47a1">{{ column.title }}</th>
                  </template>
                  <template v-slot:header.loan_id="{ column }">
                    <th style="color: #0d47a1">{{ column.title }}</th>
                  </template>

                  <template v-slot:header.lcicID_error="{ column }">
                    <th style="color: #0d47a1">{{ column.title }}</th>
                  </template>
                  <template v-slot:item.id="{ index }">
                    <span style="color: #64748b">{{
                  (reques.page - 1) * reques.page_size + index + 1
                }}</span>
                  </template>
                  <template v-slot:item.LCIC_code="{ item }">
                    <v-chip
                      v-if="(item as any).LCIC_code===''"
                      size="small"
                      variant="flat"
                      style="
                        background: #fee2e2;
                        color: #991b1b;
                        border-radius: 8px;
                      "
                    >
                      ບໍ່ມີ
                    </v-chip>
                    <v-chip
                      v-else
                      size="small"
                      variant="flat"
                      style="
                        background: #fed7aa;
                        color: #9a3412;
                        border-radius: 8px;
                      "
                    >
                      ບໍ່ຖືກ ({{ (item as any).LCIC_code }})
                    </v-chip>
                  </template>
                  <template v-slot:item.com_enterprise_code="{ item }">
                    <v-chip
                      v-if="(item as any).com_enterprise_code===''"
                      size="small"
                      variant="flat"
                      style="
                        background: #fee2e2;
                        color: #991b1b;
                        border-radius: 8px;
                      "
                    >
                      ບໍ່ມີ
                    </v-chip>
                    <v-chip
                      v-else
                      size="small"
                      variant="flat"
                      style="
                        background: #fed7aa;
                        color: #9a3412;
                        border-radius: 8px;
                      "
                    >
                      ບໍ່ຖືກ ({{ (item as any).com_enterprise_code }})
                    </v-chip>
                  </template>
                  <template v-slot:item.bnk_code="{ item }">
                    <v-chip
                      variant="flat"
                      size="small"
                      style="
                        background: #e0e7ff;
                        color: #3730a3;
                        border-radius: 8px;
                      "
                    >
                      {{ mapMemberInfo((item as any).bnk_code) }}
                    </v-chip>
                  </template>
                  <template v-slot:item.lcicID_error="{ item }">
                    <v-chip
                      variant="flat"
                      size="small"
                      style="
                        background: #fee2e2;
                        color: #991b1b;
                        border-radius: 8px;
                      "
                    >
                      ທັງສອງບໍ່ຖືກ
                    </v-chip>
                  </template>
                  <template v-slot:bottom>
                <GloBalTablePaginations
                  :page="reques.page"
                  :limit="reques.page_size"
                  :totalpage="
                    LoanStore.respons_data_loan_list?.b_data_damaged.total_pages || 1
                  "
                  @onSelectionChange="onSelectonChange"
                  @onPagechange="onPagechange"
                />
              </template>
                </v-data-table>
              </v-window-item>

              <!-- Sub Tab 5: Disputes -->
              <v-window-item value="two-five">
                <div class="mb-4">
                  <h4 style="color: #1e293b; font-weight: 600">
                    ຂໍ້ມູນທີ່ເກີດ Dispute
                  </h4>
                  <p style="color: #64748b; font-size: 14px; margin-top: 8px">
                    ຂໍ້ມູນທີ່ມີຄວາມຂັດແຍ່ງລະຫວ່າງ LCIC ID ແລະ Enterprise Code
                  </p>
                </div>

                <v-data-table
                  :items="disputese"
                  :headers="headers5"
                  density="comfortable"
                 
                  :items-per-page="reques.page_size"
                  class="elevation-0"
                  style="
                    border: 1px solid #e3e8ef;
                    border-radius: 12px;
                    overflow: hidden;
                  "
                >
                  <template v-slot:header.id="{ column }">
                    <th style="color: #0d47a1">{{ column.title }}</th>
                  </template>
                  <template v-slot:header.LCIC_code="{ column }">
                    <th style="color: #0d47a1">{{ column.title }}</th>
                  </template>
                  <template v-slot:header.com_enterprise_code="{ column }">
                    <th style="color: #0d47a1">{{ column.title }}</th>
                  </template>
                  <template v-slot:header.bnk_code="{ column }">
                    <th style="color: #0d47a1">{{ column.title }}</th>
                  </template>
                  <template v-slot:header.customer_id="{ column }">
                    <th style="color: #0d47a1">{{ column.title }}</th>
                  </template>
                  <template v-slot:header.branch_id="{ column }">
                    <th style="color: #0d47a1">{{ column.title }}</th>
                  </template>
                  <template v-slot:header.loan_id="{ column }">
                    <th style="color: #0d47a1">{{ column.title }}</th>
                  </template>
                  <template v-slot:item.id="{ index }">
                    <span style="color: #64748b">{{
                  (reques.page - 1) * reques.page_size + index + 1
                }}</span>
                  </template>
                  <template v-slot:item.bnk_code="{ item }">
                    <v-chip
                      variant="flat"
                      size="small"
                      style="
                        background: #e0e7ff;
                        color: #3730a3;
                        border-radius: 8px;
                      "
                    >
                      {{ mapMemberInfo((item as any).bnk_code) }}
                    </v-chip>
                  </template>
                  <template v-slot:bottom>
                <GloBalTablePaginations
                  :page="reques.page"
                  :limit="reques.page_size"
                  :totalpage="
                    LoanStore.respons_data_loan_list?.disputes.total_pages || 1
                  "
                  @onSelectionChange="onSelectonChange"
                  @onPagechange="onPagechange"
                />
              </template>
                </v-data-table>
              </v-window-item>
            </v-window>
          </v-window-item>

          <v-window-item value="three">
            <div class="mb-4">
              <div class="d-flex align-center">
                <v-icon color="#10b981" size="24" class="mr-2"
                  >mdi-check-circle</v-icon
                >
                <h3 style="color: #1e293b; font-weight: 600; font-size: 18px">
                  ຂໍ້ມູນອັບໂຫຼດສຳເລັດ
                </h3>
              </div>
              <p style="color: #64748b; font-size: 14px; margin-top: 8px">
                ຂໍ້ມູນທີ່ຜ່ານການກວດສອບແລ້ວ ແລະ ບັນທຶກລົງຖານຂໍ້ມູນສຳເລັດ
              </p>
            </div>

            <v-data-table
              :items="b1Monthly"
              :headers="headers5"
              density="comfortable"
              
              :items-per-page="reques.page_size"
              class="elevation-0"
              style="
                border: 1px solid #e3e8ef;
                border-radius: 12px;
                overflow: hidden;
              "
            >
              <template v-slot:header.id="{ column }">
                <th style="color: #0d47a1">{{ column.title }}</th>
              </template>
              <template v-slot:header.LCIC_code="{ column }">
                <th style="color: #0d47a1">{{ column.title }}</th>
              </template>
              <template v-slot:header.com_enterprise_code="{ column }">
                <th style="color: #0d47a1">{{ column.title }}</th>
              </template>
              <template v-slot:header.bnk_code="{ column }">
                <th style="color: #0d47a1">{{ column.title }}</th>
              </template>
              <template v-slot:header.customer_id="{ column }">
                <th style="color: #0d47a1">{{ column.title }}</th>
              </template>
              <template v-slot:header.branch_id="{ column }">
                <th style="color: #0d47a1">{{ column.title }}</th>
              </template>
              <template v-slot:header.loan_id="{ column }">
                <th style="color: #0d47a1">{{ column.title }}</th>
              </template>
              <template v-slot:item.id="{ index }">
                <span style="color: #64748b">{{
                  (reques.page - 1) * reques.page_size + index + 1
                }}</span>
              </template>
              <template v-slot:item.bnk_code="{ item }">
                <v-chip
                  variant="flat"
                  size="small"
                  style="
                    background: #d1fae5;
                    color: #065f46;
                    border-radius: 8px;
                    font-weight: 500;
                  "
                >
                  {{ mapMemberInfo(item.bnk_code) }}
                </v-chip>
              </template>
              <template v-slot:bottom>
                <GloBalTablePaginations
                  :page="reques.page"
                  :limit="reques.page_size"
                  :totalpage="
                    LoanStore.respons_data_loan_list?.b1_monthly.total_pages || 1
                  "
                  @onSelectionChange="onSelectonChange"
                  @onPagechange="onPagechange"
                />
              </template>
            </v-data-table>
          </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>
  </div>
</template>
