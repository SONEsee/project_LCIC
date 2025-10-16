<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

import { MemberStore } from "@/stores/memberinfo";
import { useMemberInfo } from "@/composables/memberInfo";
import { useRoute } from "vue-router";
import { CollateralStore } from "@/stores/collaterals";
import dayjs from "dayjs";
const memberinfoStore = MemberStore();
const collateralStore = CollateralStore();
const { mapMemberInfo, getMemberName, getMemberDetails } = useMemberInfo();
const request = collateralStore.query_data_detail.query;
const route = useRoute();
const CID = route.query.CID as string | undefined;
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
definePageMeta({
  layout: "backend",
  middleware: ["auth"],
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

const cidData = ref<any>(null);

const options = [
  "ທັງໝົດ",
  "ອາຄານ + ທີ່ດິນ",
  "ເອກະສານມີຄ່າ",
  "ເຄື່ອງຈັກ ແລະ ອຸປະກອນຕ່າງໆ",
  "ໂຄງການ",
  "ຍານພາຫະນະ",
  "ຜູ້ຄ້ຳປະກັນ",
  "GOLD AND SILVER",
  "ບໍລິສັດຄໍ່າປະກັນ",
] as const;

const selectedOption = ref<any>("ທັງໝົດ");

const handleKeyDown = (event: KeyboardEvent) => {
  const key = event.key.toLowerCase();
  const keyMap: Record<string, number> = {
    a: 0,
    b: 1,
    c: 2,
    d: 3,
    e: 4,
    f: 5,
    g: 6,
    h: 7,
    i: 8,
  };

  const index = keyMap[key];
  if (index !== undefined && options[index]) {
    selectedOption.value = options[index];
  }
};

onMounted(() => {
  memberinfoStore.getMemberInfo();
  collateralStore.query_data_detail.query.CID = CID || "";
  collateralStore.GetdataCollateralDetail();
  const data = route.query.data;
  if (typeof data === "string") {
    try {
      cidData.value = JSON.parse(data);
    } catch (error) {
      console.error("Failed to parse data:", error);
    }
  } else if (Array.isArray(data)) {
    cidData.value = JSON.parse(JSON.stringify(data));
    console.log("Parsed data:", cidData.value);
  }

  document.addEventListener("keydown", handleKeyDown);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeyDown);
});
</script>
<template>
  <v-col cols="12">
    <v-row
      >
      

      <v-col cols="12" md="12">
        <template v-if="selectedOption === options[0]">
          <upload-file-detail-upload-file-to-tal :cidData="cidData" />
        </template>
        <div v-if="selectedOption === options[1]">
          <UploadFileDetailUploadFileColRealEstates :cidData="cidData" />
        </div>
        <div v-if="selectedOption === options[2]">
          <UploadFileDetailUploadFileColMoneyMia :cidData="cidData" />
        </div>
        <div v-if="selectedOption === options[3]">
          <UploadFileDetailUploadFileColEquipmentEqi :cidData="cidData" />
        </div>
        <div v-if="selectedOption === options[4]">
          <UploadFileDetailUploadFileColProjectPrj :cidData="cidData" />
        </div>
        <div v-if="selectedOption === options[5]">
          <UploadFileDetailUploadFileColVechicleVeh :cidData="cidData" />
        </div>
        <div v-if="selectedOption === options[6]">
          <UploadFileDetailUploadFileColGuarantorGua :cidData="cidData" />
        </div>
        <div v-if="selectedOption === options[7]">
          <UploadFileDetailUploadFileColGoldsilverGold :cidData="cidData" />
        </div>
        <div v-if="selectedOption === options[8]">
          <UploadFileDetailUploadFileColGuarantorCom :cidData="cidData" />
        </div>
      </v-col>
    </v-row>
  </v-col>
</template>
