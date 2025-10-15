<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { CollateralStore } from "@/stores/collaterals";
import { MemberStore } from "@/stores/memberinfo";
import { useMemberInfo } from "@/composables/memberInfo";
import dayjs from "dayjs";
import Swal from "sweetalert2";
const memberinfoStore = MemberStore();
const collateralStore = CollateralStore();
const selectType = ref("");
const { mapMemberInfo, getMemberName, getMemberDetails } = useMemberInfo();
const request = collateralStore.query_data_detail.query;
const route = useRoute();
const CID = route.query.CID as string | undefined;

async function onPagechange(page: number) {
  request.page = page;
  await collateralStore.GetdataCollateralDetail();
}

async function onSelectionChange(page_size: number) {
  request.page_size = page_size;
  await collateralStore.GetdataCollateralDetail();
}
watch(selectType, async (newValue) => {
  collateralStore.isLoading = true;
  try {
    collateralStore.query_data_detail.query.col_type = newValue;
    await collateralStore.GetdataCollateralDetail();
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "ຜິດພາດ",
      text: "ບໍ່ສາມາດດືງຂໍ້ມູນຕາມ ປະເພດຫຼັກຊັບໄດ້.",
    });
  } finally {
    collateralStore.isLoading = false;
  }
});
const combinedData = computed(() => {
  const errorItems =
    collateralStore.response_data_collateral_detail?.C_error?.items;
  const cdlItems = collateralStore.response_data_collateral_detail?.CDL?.items;

  const errorArray = Array.isArray(errorItems) ? errorItems : [];
  const cdlArray = Array.isArray(cdlItems)
    ? cdlItems.map((item) => ({
        ...item,
        LCIC_code: item.c1,
        com_enterprise_code: item.c2,
        user_id: item.c3,
        bank_customer_ID: item.c4,
        branch_id_code: item.c5,
        loan_id: item.c6,
        col_id: item.c7,
      }))
    : [];

  return [...errorArray, ...cdlArray];
});

interface Props {
  cidData?: any;
}

const props = defineProps<Props>();

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

const tab = ref("one");
const subTab = ref("two-one");

const headers1 = [
  { title: "ລຳດັບ", value: "id" },
  { title: "ລະຫັດຂສລ", value: "LCIC_code", key: "LCIC_code_or_c1" },
  {
    title: "ລະຫັດວິສາຫະກິດ",
    value: "com_enterprise_code",
    key: "com_enterprise_code_or_c2",
  },
  { title: "ສະມາຊຶກ", value: "user_id", key: "user_id_or_c3" },
  { title: "ສາຂາ", value: "branch_id_code", key: "branch_id_code_or_c5" },
  { title: "ລະຫັດເງິນກູ້", value: "loan_id", key: "loan_id_or_c6" },
  { title: "ລະຫັດຫຼັກຊັບ", value: "col_id", key: "col_id_or_c7" },
  { title: "ປະເພດຫຼັກຊັບ", value: "col_type" },
];

const headers2 = [
  { title: "ID", value: "id" },
  { title: "LCIC_code", value: "LCIC_code" },
  { title: "Com_Enterprise_Code", value: "com_enterprise_code" },
  { title: "Bank_customer_ID", value: "bank_customer_ID" },
  { title: "Branch_id_Code", value: "branch_id_code" },
  { title: "Loan_id", value: "loan_id" },
  { title: "Col_id", value: "col_id" },
  { title: "com_enterprise_code", value: "datamatch" },
  { title: "status", value: "collateral_status" },
];

const headers3 = [
  { title: "ID", value: "id" },
  { title: "LCIC_code", value: "LCIC_code" },
  { title: "Com_Enterprise_Code", value: "com_enterprise_code" },
  { title: "Bank_customer_ID", value: "bank_customer_ID" },
  { title: "Branch_id_Code", value: "branch_id_code" },
  { title: "Loan_id", value: "loan_id" },
  { title: "Col_id", value: "col_id" },
  { title: "LCIC_code", value: "datamatch" },
  { title: "status", value: "collateral_status" },
];

const headers4 = [
  { title: "ID", value: "id" },
  { title: "LCIC_code", value: "LCIC_code" },
  { title: "Com_Enterprise_Code", value: "com_enterprise_code" },
  { title: "Bank_customer_ID", value: "bank_customer_ID" },
  { title: "Branch_id_Code", value: "branch_id_code" },
  { title: "Loan_id", value: "loan_id" },
  { title: "Col_id", value: "col_id" },
  { title: "status", value: "collateral_status" },
];

const headers5 = [
  { title: "ID", value: "id" },
  { title: "LCIC_code", value: "LCIC_code" },
  { title: "Com_Enterprise_Code", value: "com_enterprise_code" },
  { title: "Bank_customer_ID", value: "bank_customer_ID" },
  { title: "Branch_id_Code", value: "branch_id_code" },
  { title: "Loan_id", value: "loan_id" },
  { title: "Col_id", value: "col_id" },
];

const headers6 = [
  { title: "ID", value: "id" },
  { title: "LCIC_code", value: "LCIC_code" },
  { title: "Com_Enterprise_Code", value: "com_enterprise_code" },
  { title: "Bank_customer_ID", value: "bank_customer_ID" },
  { title: "Branch_id_Code", value: "branch_id_code" },
  { title: "Loan_id", value: "loan_id" },
  { title: "Col_id", value: "col_id" },
];
const TypeCollateral = [
  { title: "ທັງໝົດ", value: "" },
  { title: "ອາຄານ + ທີ່ດິນ", value: "C2.1" },
  { title: "ເອກະສານມີຄ່າ", value: "C2.2" },
  { title: "ເຄື່ອງຈັກ ແລະ ອຸປະກອນຕ່າງໆ", value: "C2.3" },
  { title: "ໂຄງການ", value: "C2.4" },
  { title: "ຍານພາຫະນະ", value: "C2.5" },
  { title: "ຜູ້ຄ້ຳປະກັນ", value: "C2.6" },
  { title: "ຄຳ ແລະ ເງິນ", value: "C2.7" },
  { title: "ບໍລິສັດຄໍ່າປະກັນ", value: "C2.8" },
];
const enterpriseodeerror = computed(() => {
  const data = collateralStore.response_data_collateral_detail?.C_error?.items;
  let dataMap: any[] = [];

  if (Array.isArray(data)) {
    dataMap = data;
  } else if (data && typeof data === "object") {
    dataMap = [data];
  } else {
    dataMap = [];
  }

  return dataMap.filter(
    (item) => item.collateral_status === "31" || item.collateral_status === "10"
  );
});

const lcicerror = computed(() => {
  const data = collateralStore.response_data_collateral_detail?.C_error?.items;
  let dataMap: any[] = [];

  if (Array.isArray(data)) {
    dataMap = data;
  } else if (data && typeof data === "object") {
    dataMap = [data];
  } else {
    dataMap = [];
  }

  return dataMap.filter(
    (item) => item.collateral_status === "13" || item.collateral_status === "01"
  );
});

const lcicenterpriseerror = computed(() => {
  const data = collateralStore.response_data_collateral_detail?.C_error?.items;
  let dataMap: any[] = [];

  if (Array.isArray(data)) {
    dataMap = data;
  } else if (data && typeof data === "object") {
    dataMap = [data];
  } else {
    dataMap = [];
  }

  return dataMap.filter(
    (item) =>
      item.collateral_status === "11" ||
      item.collateral_status === "33" ||
      item.collateral_status === "30" ||
      item.collateral_status === "44" ||
      item.collateral_status === "03"
  );
});

const Cdisputes = computed(() => {
  const data =
    collateralStore.response_data_collateral_detail?.C1_disptes?.items;
  let dataMap: any[] = [];

  if (Array.isArray(data)) {
    dataMap = data;
  } else if (data && typeof data === "object") {
    dataMap = [data];
  } else {
    dataMap = [];
  }

  return dataMap;
});

const t1 = computed(() => {
  const data = collateralStore.response_data_collateral_detail?.C1?.items;
  let dataMap: any[] = [];

  if (Array.isArray(data)) {
    dataMap = data;
  } else if (data && typeof data === "object") {
    dataMap = [data];
  } else {
    dataMap = [];
  }

  return dataMap;
});

const exportToJson = () => {
  const dataToExport = lcicerror.value.map((item) => {
    const {
      datamatch,
      com_enterprise_code_get,
      id_file,
      id,
      period,
      com_enterprise_code_error,
      LCIC_code_error,
      filteredBDataIsDamagedLCIC_codeError01,
      ...rest
    } = item;
    return {
      ...rest,
      LCIC_code: datamatch,
    };
  });

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
  collateralStore.query_data_detail.query.CID = CID || "";
  collateralStore.GetdataCollateralDetail();
});
</script>
<template>
  <v-card>
    <v-row>
      <v-col cols="12" md="4">
        <v-autocomplete
        class="mt-2"
        prepend-inner-icon="mdi-format-list-bulleted-type"
          clearable
          :items="TypeCollateral"
          v-model="selectType"
          density="compact"
          label="ເລືອກປະເພດຂໍ້ມູນຫຼັກຊັບ"
          variant="outlined"
        >
          <template v-slot:item="{ item, props }">
            <v-list-item
              v-bind="props"
              :title="`${item.raw.title} - ${item.raw.value}`"
            >
              <template v-slot:prepend>
                <v-avatar size="small" color="primary">
                  <v-icon>mdi-format-list-bulleted-type</v-icon>
                </v-avatar>
              </template></v-list-item
            >
          </template>
        </v-autocomplete>
        <v-chip color="primary">ຈຳນວນທັງໝົດ: <b>{{ combinedData.length }}</b> ລາຍການ</v-chip>
        
      </v-col>
      <v-col cols="12" md="8" class="d-flex align-center justify-end">
        <div class="text-end">
          <p>
            ສະມາຊິກ:
            <b>{{ mapMemberInfo(combinedData[0]?.user_id ?? "ບໍ່ມີ") }}</b>
          </p>
          <p>
            ນຳສົ່ງປະຈຳເດືອນ:
            <b>{{ dayjs(combinedData[0]?.period).format("MM/YYYY") }}</b>
          </p>
        </div>
      </v-col>
    </v-row>
    <v-tabs v-model="tab" fixed-tabs color="primary" stacked>
      <v-tab value="one">ຂໍ້ມູນທີ່ອັບໂຫຼດທັງໝົດ</v-tab>
      <v-tab value="two">ຂໍ້ມູນທີ່ບໍ່ຖືກຕອ້ງ</v-tab>
      <v-tab value="three">ຂໍ້ມູນທີ່ອັບໂຫຼດສົມບູນ</v-tab>
    </v-tabs>
    <v-card-text>
      <v-window v-model="tab">
        <v-window-item value="one">
          <h3 style="color: dodgerblue"># ຂໍ້ມູນທີ່ອັບໂຫຼດທັງໝົດ</h3>
          <!-- <p>
            - ມີທັງໝົດ:
            <b>{{
              Number(
                collateralStore.response_data_collateral_detail_count?.total_cdl
              ) +
              Number(
                collateralStore.response_data_collateral_detail_count
                  ?.total_errors
              )
            }}</b>
            ລາຍການ
          </p> -->

          <v-data-table
            :items-per-page="request.page_size"
            class="text-no-wrap"
            :loading="collateralStore.isLoading"
            :items="combinedData"
            :headers="headers1"
            density="compact"
          >
            <template v-slot:header.id="{ column }">
              <th style="color: #0d47a1">{{ column.title }}</th>
            </template>
            <template v-slot:header.LCIC_code_or_c1="{ column }">
              <th style="color: #0d47a1">{{ column.title }}</th>
            </template>
            <template v-slot:header.com_enterprise_code_or_c2="{ column }">
              <th style="color: #0d47a1">{{ column.title }}</th>
            </template>
            <template v-slot:header.user_id_or_c3="{ column }">
              <th style="color: #0d47a1">{{ column.title }}</th>
            </template>
            <template v-slot:header.branch_id_code_or_c5="{ column }">
              <th style="color: #0d47a1">{{ column.title }}</th>
            </template>
            <template v-slot:header.loan_id_or_c6="{ column }">
              <th style="color: #0d47a1">{{ column.title }}</th>
            </template>
            <template v-slot:header.col_id_or_c7="{ column }">
              <th style="color: #0d47a1">{{ column.title }}</th>
            </template>
            <template v-slot:header.col_type="{ column }">
              <th style="color: #0d47a1">{{ column.title }}</th>
            </template>

            <template v-slot:item.id="{ item, index }">
              {{ (request.page - 1) * request.page_size + index + 1 }}
            </template>

            <template v-slot:item.LCIC_code="{ item }">
              <v-chip color="primary" size="small" variant="flat">
                {{ item.LCIC_code || (item as any).c1 || "-" }}
              </v-chip>
            </template>

            <template v-slot:item.com_enterprise_code="{ item }">
              <v-chip color="info" size="small" variant="flat">
                {{ item.com_enterprise_code || (item as any).c2 || "-" }}
              </v-chip>
            </template>

            <template v-slot:item.user_id="{ item }">
              <v-chip size="small" color="success">
                {{ mapMemberInfo(item.user_id || (item as any).c3) }}
              </v-chip>
            </template>

            <template v-slot:item.branch_id_code="{ item }">
              {{ item.branch_id_code || (item as any).c5 || "-" }}
            </template>

            <template v-slot:item.loan_id="{ item }">
              {{ item.loan_id || (item as any).c6 || "-" }}
            </template>

            <template v-slot:item.col_id="{ item }">
              {{ item.col_id || (item as any).c7 || "-" }}
            </template>

            <template v-slot:item.col_type="{ item }">
              <v-chip
                :color="(item as any).collateral_status ? 'error' : 'success'"
                size="small"
              >
                {{ item.col_type }}
              </v-chip>
            </template>

            <template v-slot:bottom>
              <glo-bal-table-paginations
                :page="collateralStore.query_data_detail.query.page"
                :limit="collateralStore.query_data_detail.query.page_size"
                :totalpage="
                  collateralStore.response_data_collateral_detail?.CDL
                    .total_pages
                "
                @onPagechange="onPagechange"
                @onSelectionChange="onSelectionChange"
              />
            </template>
          </v-data-table>
        </v-window-item>

        <v-window-item value="two">
          <v-tabs v-model="subTab" fixed-tabs color="secondary">
            <v-tab value="two-one"
              >ລະຫັດວິສາຫະກິດບໍ່ຖືກຕ້ອງ
              <v-chip
                class="ml-2"
                size="x-small"
                style="background: #fecaca; color: #991b1b; font-weight: 600"
              >
                {{ enterpriseodeerror.length }}
              </v-chip>
            </v-tab>
            <v-tab value="two-two"
              >ລະຫັດ ຂສລ ບໍ່ຖືກຕອ້ງ
              <v-chip
                class="ml-2"
                size="x-small"
                style="background: #fecaca; color: #991b1b; font-weight: 600"
              >
                {{ lcicerror.length }}
              </v-chip></v-tab
            >
            <v-tab value="two-three"
              >ລະຫັດວິສາຫະກິດ ແລະ ລະຫັດ ຂສລ ບໍ່ຖືກຕອ້ງ
              <v-chip
                class="ml-2"
                size="x-small"
                style="background: #fecaca; color: #991b1b; font-weight: 600"
              >
                {{ lcicenterpriseerror.length }}
              </v-chip></v-tab
            >
            <v-tab value="two-five"
              >ຂໍ້ມູນເກີດ dispust
              <v-chip
                class="ml-2"
                size="x-small"
                style="background: #fecaca; color: #991b1b; font-weight: 600"
              >
                {{ Cdisputes.length }}
              </v-chip></v-tab
            >
          </v-tabs>
          <v-window v-model="subTab">
            <v-window-item value="two-one">
              <h3 style="color: dodgerblue">
                # ຂໍ້ມູນທີ່ບໍ່ມີ ແລະ ຜິດ Enterprise Code
              </h3>
              <p>
                - ມີທັງໝົດ: <b>{{ enterpriseodeerror.length }}</b> ລາຍການ
              </p>

              <v-col cols="12">
                <v-row>
                  <v-col cols="6" class="text-center">
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
                        >ຂໍ້ມູນໃນຖານ ຂສລ</span
                      >
                    </div>
                  </v-col>
                </v-row>
              </v-col>

              <v-data-table
              :loading="collateralStore.isLoading"
                :items-per-page="request.page_size"
                :items="enterpriseodeerror"
                :headers="headers2"
                density="compact"
              >
                <template v-slot:header.id>
                  <th style="color: #0d47a1">ລຳດັບ</th>
                </template>
                <template v-slot:header.LCIC_code>
                  <th style="color: #0d47a1">ລະຫັດ ຂສລ</th>
                </template>
                <template v-slot:header.com_enterprise_code>
                  <th style="color: #0d47a1">ລະຫັດວິສາຫະກິດ</th>
                </template>
                <template v-slot:header.bank_customer_ID>
                  <th style="color: #0d47a1">ລະຫັດລູກຄ້າ</th>
                </template>
                <template v-slot:header.branch_id_code>
                  <th style="color: #0d47a1">ລະຫັດສາຂາ</th>
                </template>
                <template v-slot:header.loan_id>
                  <th style="color: #0d47a1">ລະກັດເງິນກູ້</th>
                </template>
                <template v-slot:header.col_id>
                  <th style="color: #0d47a1">ລະຫັດຫຼັກຊັບ</th>
                </template>
                <template v-slot:header.datamatch>
                  <th style="color: #0d47a1">ລະຫັດວິສາຫະກິດໃນຖານຂໍ້ມູນ ຂສລ</th>
                </template>
                <template v-slot:header.collateral_status>
                  <th style="color: #0d47a1">ສະຖານະ</th>
                </template>
                <template v-slot:item.id="{ item, index }">
                  {{ (request.page - 1) * request.page_size + index + 1 }}
                </template>
                <template v-slot:item.com_enterprise_code="{ item }">
                  <v-chip v-if="item.com_enterprise_code === ''" color="error"
                    >ບໍ່ມີ</v-chip
                  >
                  <v-chip v-else color="warning"
                    >ບໍຖືກ ({{ item.com_enterprise_code }})</v-chip
                  >
                </template>
                <template v-slot:item.datamatch="{item}">
                  <v-chip color="primary" size="small" variant="flat">
                    {{ item.datamatch ?? "-" }}
                  </v-chip>
                </template>
                <template v-slot:item.collateral_status="{ item }">
                  <v-chip color="error" size="small">{{
                    item.collateral_status === "31"
                      ? "ລະຫັດວິສາຫະກີດ ບໍຖືກ"
                      : item.collateral_status === "10"
                      ? "ລະຫັດວິສາຫະກີດ ວ່າງ"
                      : item.collateral_status
                  }}</v-chip>
                </template>
                <template v-slot:bottom>
                  <glo-bal-table-paginations
                    :page="collateralStore.query_data_detail.query.page"
                    :limit="collateralStore.query_data_detail.query.page_size"
                    :totalpage="
                      collateralStore.response_data_collateral_detail?.C_error
                        .total_pages
                    "
                    @onPagechange="onPagechange"
                    @onSelectionChange="onSelectionChange"
                  />
                </template>
              </v-data-table>
            </v-window-item>

            <v-window-item value="two-two">
              <h3 style="color: dodgerblue"># ຂໍ້ມູນທີ່ບໍ່ມີ LCIC_code</h3>
              <p>
                - ມີທັງໝົດ: <b>{{ lcicerror.length }}</b> ລາຍການ
              </p>

              <v-fab
                @click="exportToJson"
                icon="mdi-cloud-braces"
                class="mt-5 mb-5 d-flex justify-end mr-6"
                color="red-lighten-1"
              >
              </v-fab>

              <v-col cols="12">
                <v-row>
                  <v-col cols="8" class="text-center">
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
                        >ຂໍ້ມູນໃນຖານຂໍ້ມູນ ຂສລ</span
                      >
                    </div>
                  </v-col>
                </v-row>
              </v-col>

              <v-data-table
              :loading="collateralStore.isLoading"
                :items-per-page="request.page_size"
                :items="lcicerror"
                :headers="headers3"
                density="compact"
              >
                <template v-slot:header.id>
                  <th style="color: #0d47a1">ລຳດັບ</th>
                </template>
                <template v-slot:header.LCIC_code>
                  <th style="color: #0d47a1">ລະຫັດ ຂສລ</th>
                </template>
                <template v-slot:header.com_enterprise_code>
                  <th style="color: #0d47a1">ລະຫັດວິສາຫະກິດ</th>
                </template>
                <template v-slot:header.bank_customer_ID>
                  <th style="color: #0d47a1">ລະຫັດລູກຄ້າ</th>
                </template>
                <template v-slot:header.branch_id_code>
                  <th style="color: #0d47a1">ລະຫັດສາຂາ</th>
                </template>
                <template v-slot:header.loan_id>
                  <th style="color: #0d47a1">ລະກັດເງິນກູ້</th>
                </template>
                <template v-slot:header.col_id>
                  <th style="color: #0d47a1">ລະຫັດຫຼັກຊັບ</th>
                </template>
                <template v-slot:header.datamatch>
                  <th style="color: #0d47a1">ລະຫັດ ຂສລ ໃນຖານຂໍ້ມູນ ຂສລ</th>
                </template>
                <template v-slot:header.collateral_status>
                  <th style="color: #0d47a1">ສະຖານະ</th>
                </template>
                <template v-slot:item.id="{ item, index }">
                  {{ (request.page - 1) * request.page_size + index + 1 }}
                </template>
                <template v-slot:item.LCIC_code="{ item }">
                  <v-chip v-if="item.LCIC_code ===''" color="error"
                    >ບໍ່ມີ</v-chip
                  >
                  <v-chip v-else color="warning">ບໍ່ຖືກ{{ item.LCIC_code }}</v-chip>
                </template>
                <template v-slot:item.datamatch="{ item }">
                  <v-chip color="success" size="small">{{
                    item.datamatch
                  }}</v-chip>
                </template>
                <template v-slot:item.collateral_status="{ item }">
                  <v-chip color="error" size="small">{{
                    item.collateral_status === "13"
                      ? "LCIC_code ບໍຖືກ"
                      : item.collateral_status === "01"
                      ? "LCIC_code ວ່າງ"
                      : item.collateral_status
                  }}</v-chip>
                </template>
                <template v-slot:bottom>
                  <glo-bal-table-paginations
                    :page="collateralStore.query_data_detail.query.page"
                    :limit="collateralStore.query_data_detail.query.page_size"
                    :totalpage="
                      collateralStore.response_data_collateral_detail?.C_error
                        .total_pages
                    "
                    @onPagechange="onPagechange"
                    @onSelectionChange="onSelectionChange"
                  />
                </template>
              </v-data-table>
            </v-window-item>

           
            <v-window-item value="two-three">
              <h3 style="color: dodgerblue">
                # ຂໍ້ມູນທີ່ມີ LCIC_code ແລະ com_enterprise_code_error ຜິດ ຫຼື
                ບໍ່ມີ
              </h3>
              <p>
                - ມີທັງໝົດ: <b>{{ lcicenterpriseerror.length }}</b> ລາຍການ
              </p>

              <v-data-table
              :loading="collateralStore.isLoading"
                :items-per-page="request.page_size"
                :items="lcicenterpriseerror"
                :headers="headers4"
                density="compact"
              >
                <template v-slot:header.id>
                  <th style="color: #0d47a1">ລຳດັບ</th>
                </template>
                <template v-slot:header.LCIC_code>
                  <th style="color: #0d47a1">ລະຫັດ ຂສລ</th>
                </template>
                <template v-slot:header.com_enterprise_code>
                  <th style="color: #0d47a1">ລະຫັດວິສາຫະກິດ</th>
                </template>
                <template v-slot:header.bank_customer_ID>
                  <th style="color: #0d47a1">ລະຫັດລູກຄ້າ</th>
                </template>
                <template v-slot:header.branch_id_code>
                  <th style="color: #0d47a1">ລະຫັດສາຂາ</th>
                </template>
                <template v-slot:header.loan_id>
                  <th style="color: #0d47a1">ລະກັດເງິນກູ້</th>
                </template>
                <template v-slot:header.col_id>
                  <th style="color: #0d47a1">ລະຫັດຫຼັກຊັບ</th>
                </template>
               
                <template v-slot:header.collateral_status>
                  <th style="color: #0d47a1">ສະຖານະ</th>
                </template>
                <template v-slot:item.id="{ item, index }">
                  {{ (request.page - 1) * request.page_size + index + 1 }}
                </template>
                <template v-slot:item.LCIC_code="{ item }">
                  <v-chip
                    :color="item.LCIC_code === '' ? 'error' : 'warning'"
                    size="small"
                  >
                    {{ item.LCIC_code || "ບໍ່ມີ" }}
                  </v-chip>
                </template>
                <template v-slot:item.com_enterprise_code="{ item }">
                  <v-chip
                    :color="
                      item.com_enterprise_code === '' ? 'error' : 'warning'
                    "
                    size="small"
                  >
                    {{ item.com_enterprise_code || "ບໍ່ມີ" }}
                  </v-chip>
                </template>
                <template v-slot:item.collateral_status="{ item }">
                  <v-chip color="error" size="small">{{
                    item.collateral_status === "11"
                      ? "LCIC_code ແລະ com_enterprise_code ບໍຖືກ"
                      : item.collateral_status === "33"
                      ? "LCIC_code ແລະ com_enterprise_code ວ່າງ"
                      : item.collateral_status === "44"
                      ? "LCIC_code"
                      : item.collateral_status === "55"
                      ? "LCIC_code ແລະ com_enterprise_code ບໍ່ແມັດກັນ"
                      : item.collateral_status === "30"
                      ? "LCIC_code ບໍ່ຖືກ ແລະ com_enterprise_code ວ່າງ"
                      : item.collateral_status === "03"
                      ? "LCIC_code ວ່າງ ແລະ com_enterprise_code ບໍ່ຖືກ"
                      : item.collateral_status
                  }}</v-chip>
                </template>
                <template v-slot:bottom>
                  <glo-bal-table-paginations
                    :page="collateralStore.query_data_detail.query.page"
                    :limit="collateralStore.query_data_detail.query.page_size"
                    :totalpage="
                      collateralStore.response_data_collateral_detail?.C_error
                        .total_pages
                    "
                    @onPagechange="onPagechange"
                    @onSelectionChange="onSelectionChange"
                  />
                </template>
              </v-data-table>
            </v-window-item>

            <!-- SUB TAB 4: error disputes -->
            <v-window-item value="two-five">
              <h3 style="color: dodgerblue">
                # ຂໍ້ມູນທີ່ມີ bnk_code, branch_id, customer_id, loan_id ແຕ່ມີ
                LCIC_code ແລະ com_enterprise_code ບໍ່ຖືກ
              </h3>
              <p>
                - ມີທັງໝົດ: <b>{{ Cdisputes.length }}</b> ລາຍການ
              </p>

              <v-data-table
              :loading="collateralStore.isLoading"
                :items-per-page="request.page_size"
                :items="Cdisputes"
                :headers="headers5"
                density="compact"
              >
                 <template v-slot:header.id>
                  <th style="color: #0d47a1">ລຳດັບ</th>
                </template>
                <template v-slot:header.LCIC_code>
                  <th style="color: #0d47a1">ລະຫັດ ຂສລ</th>
                </template>
                <template v-slot:header.com_enterprise_code>
                  <th style="color: #0d47a1">ລະຫັດວິສາຫະກິດ</th>
                </template>
                <template v-slot:header.bank_customer_ID>
                  <th style="color: #0d47a1">ລະຫັດລູກຄ້າ</th>
                </template>
                <template v-slot:header.branch_id_code>
                  <th style="color: #0d47a1">ລະຫັດສາຂາ</th>
                </template>
                <template v-slot:header.loan_id>
                  <th style="color: #0d47a1">ລະກັດເງິນກູ້</th>
                </template>
                <template v-slot:header.col_id>
                  <th style="color: #0d47a1">ລະຫັດຫຼັກຊັບ</th>
                </template>
               
                
                <template v-slot:item.id="{ item, index }">
                  {{ (request.page - 1) * request.page_size + index + 1 }}
                </template>
                <template v-slot:item.LCIC_code="{ item }">
                  <v-chip color="warning" size="small">{{
                    item.LCIC_code
                  }}</v-chip>
                </template>
                <template v-slot:item.com_enterprise_code="{ item }">
                  <v-chip color="warning" size="small">{{
                    item.com_enterprise_code
                  }}</v-chip>
                </template>
                <template v-slot:bottom>
                  <glo-bal-table-paginations
                    :page="collateralStore.query_data_detail.query.page"
                    :limit="collateralStore.query_data_detail.query.page_size"
                    :totalpage="
                      collateralStore.response_data_collateral_detail
                        ?.C1_disptes?.total_pages || 1
                    "
                    @onPagechange="onPagechange"
                    @onSelectionChange="onSelectionChange"
                  />
                </template>
              </v-data-table>
            </v-window-item>
          </v-window>
        </v-window-item>

        
        <v-window-item value="three">
          <h3 style="color: dodgerblue"># ຂໍ້ມູນທີ່ອັບໂຫຼດສົມບູນ</h3>
          <p>ເປັນຂໍ້ມູນທີ່ຜ່ານການກວດສອບ ແລະ ຖືກບັນທຶກລົງຖານຂໍ້ມູນແລ້ວ</p>
          <p>
            - ມີທັງໝົດ: <b>{{ t1.length }}</b> ລາຍການ
          </p>

          <v-data-table
            :items-per-page="request.page_size"
            :items="t1"
            :headers="headers6"
            density="compact"
          >
            <template v-slot:header.id>
              <th style="color: #0d47a1">ID</th>
            </template>
            <template v-slot:header.LCIC_code>
              <th style="color: #0d47a1">LCIC_code</th>
            </template>
            <template v-slot:header.com_enterprise_code>
              <th style="color: #0d47a1">Com_Enterprise_Code</th>
            </template>
            <template v-slot:header.bank_customer_ID>
              <th style="color: #0d47a1">Bank_customer_ID</th>
            </template>
            <template v-slot:header.branch_id_code>
              <th style="color: #0d47a1">Branch_id_Code</th>
            </template>
            <template v-slot:header.loan_id>
              <th style="color: #0d47a1">Loan_id</th>
            </template>
            <template v-slot:header.col_id>
              <th style="color: #0d47a1">Col_id</th>
            </template>
            <template v-slot:item.id="{ item, index }">
              {{ (request.page - 1) * request.page_size + index + 1 }}
            </template>
            <template v-slot:item.LCIC_code="{ item }">
              <v-chip color="success" size="small">{{ item.LCIC_code }}</v-chip>
            </template>
            <template v-slot:item.com_enterprise_code="{ item }">
              <v-chip color="success" size="small">{{
                item.com_enterprise_code
              }}</v-chip>
            </template>
            <template v-slot:bottom>
              <glo-bal-table-paginations
                :page="collateralStore.query_data_detail.query.page"
                :limit="collateralStore.query_data_detail.query.page_size"
                :totalpage="
                  collateralStore.response_data_collateral_detail?.C1
                    ?.total_pages || 1
                "
                @onPagechange="onPagechange"
                @onSelectionChange="onSelectionChange"
              />
            </template>
          </v-data-table>
        </v-window-item>
      </v-window>
    </v-card-text>
  </v-card>
</template>
