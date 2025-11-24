<script lang="ts" setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2";
import axios from "axios";
import { useUserData } from "~/composables/useUserData";
import { useEnterprisInfo } from "~/stores/enterpris_member";
import { MemberStore } from "@/stores/memberinfo";

const memberinfoStore = MemberStore();
const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();

const memberData = computed(() => {
  const data = memberinfoStore.respons_data_query;
  if (Array.isArray(data)) {
    return data;
  }
  if (data && typeof data === "object") {
    return [data];
  }
  return [];
});

const EnterprisStore = useEnterprisInfo();
const request = EnterprisStore.form_company_info_customer_mact_lcic;
const reques = EnterprisStore.check_enterprise;
const { user, userId, isAdmin, isLoggedIn } = useUserData();

definePageMeta({
  layout: "backend",
});

useHead({
  title: "Upload File",
  meta: [
    { name: "keywords", content: "Report, Nuxt 3, Backend" },
    { name: "Description", content: "Report Nuxt 3, IT Genius Engineering" },
  ],
});

const loading = ref(false);
const enterpreise = ref("");

const regisStationOfficeCodes = [
  { id: "1", title: "ຫ້ອງການຂຶ້ນທະບຽນວິສາຫະກິດຂັ້ນສູງກາງ" },
  { id: "2", title: "ຫ້ອງການຂຶ້ນທະບຽນວິສາຫະກິດຂັ້ນແຂວງ" },
  { id: "3", title: "ຫ້ອງການຂຶ້ນທະບຽນວິສາຫະກິດຂັ້ນເມືອງ" },
  { id: "4", title: "ຫ້ອງການສົ່ງເສີມ ແລະ ຄຸ້ມຄອງການລົງທຶນ" },
  { id: "5", title: "ຫ້ອງການເຂດເສດຖະກິດພິເສດ" },
  { id: "6", title: "ຫ້ອງການອຸດສາຫະກຳ ແລະ ການຄ້າ" },
];

const enLegalStratures = [
  { id: "411", title: "ວິສາຫະກິດ ສ່ວນບຸກຄົນ" },
  { id: "422", title: "ວິສາຫະກິດ ຮຸ້ນສ່ວນສາກົນ" },
  { id: "432", title: "ວິສາຫະກິດ ຮຸ້ນສ່ວນ ຈຳກັດ" },
  { id: "442", title: "ບໍລິສັດ ຈຳກັດ" },
  { id: "451", title: "ບໍລິສັດ ຈຳກັດຜູ້ດຽວ" },
  { id: "469", title: "ບໍລິສັດ ມະຫາຊົນ" },
  { id: "479", title: "ບໍລິສັດ ລັດ" },
  { id: "485", title: "ບໍລິສັດ ປະສົມ" },
  { id: "499", title: "ວິສາຫະກິດລວມໝູ່" },
];

const investmentCurrencys = [
  { id: "LAK", title: "LAK" },
  { id: "USD", title: "USD" },
  { id: "THB", title: "THB" },
  { id: "EUR", title: "EUR" },
  { id: "CNY", title: "CNY" },
  { id: "JPY", title: "JPY" },
  { id: "SGD", title: "SGD" },
  { id: "MYR", title: "MYR" },
  { id: "VND", title: "VND" },
  { id: "KRW", title: "KRW" },
];

const segments = [
  { id: "A2", title: "ວິສາຫະກິດ" },
  { id: "A1", title: "ບຸກຄົນ" },
 
];

const statusOptions = [
  { id: "1", title: "ໃຊ້ງານ (Active)" },
  { id: "0", title: "ບໍ່ໃຊ້ງານ (Inactive)" },
];

const mmStatusOptions = [
  { id: "P", title: "ລໍຖ້າອະນຸມັດ (Pending)" },
  { id: "A", title: "ອະນຸມັດແລ້ວ (Approved)" },
  { id: "R", title: "ປະຕິເສດ (Rejected)" },
];

const formatNumber = (): void => {
  const rawNumber = request.com_regulatory_capital?.replace(/,/g, "") || "";
  if (!isNaN(Number(rawNumber)) && rawNumber !== "") {
    request.com_regulatory_capital = Number(rawNumber).toLocaleString();
  }
};

const formatDateToISO = (dateStr: string): string => {
  if (!dateStr) return "";
  try {
    const parts = dateStr.split(" ")[0].split("/");
    if (parts.length === 3) {
      const month = parts[0].padStart(2, "0");
      const day = parts[1].padStart(2, "0");
      const year = parts[2];
      return `${year}-${month}-${day}`;
    }
    return "";
  } catch (error) {
    return "";
  }
};

const displayMember = (item: any) => {
  if (!item || !item.nameL || !item.bnk_code || !item.code) {
    return "ທັງໝົດ";
  }
  return `${item.bnk_code} - ${item.code} - ${item.nameL}`;
};

const datareturn = computed(() => {
  const data = EnterprisStore.respon_data_check_enterprise?.data;
  if (Array.isArray(data)) {
    return data;
  }
  if (data && typeof data === "object") {
    return [data];
  }
  return [];
});

watch(datareturn, async (newData) => {
  if (!newData?.[0]) return;

  const item = newData[0];
  const form = EnterprisStore.form_company_info_customer_mact_lcic;

  form.com_enterprise_code = item.EnterpriseID || "";
  form.enterprise_code = item.EnterpriseID || ""; 
  form.com_lao_name = item.enterpriseNameLao || "";
  form.com_name = item.eneterpriseNameEnglish || "";
  form.com_tax_no = item.regisCertificateNumber || "";

  form.com_registration_date = formatDateToISO(item.regisDate) || "";
  form.com_registration_place_issue = item.regisStationOfficeCode || "";

  form.com_category = item.enLegalStrature || "";

  form.com_regulatory_capital = item.investmentAmount
    ? Number(item.investmentAmount).toLocaleString()
    : "";
  form.com_regulatory_capital_unit = item.investmentCurrency || "";

  form.LCIC_code = item.LCIC_code || "";

  form.status = item.status !== undefined ? String(item.status) : "";
});

watch(enterpreise, async (newValue) => {
  if (newValue && newValue.trim() !== "") {
    reques.EnterpriseID = newValue;
    await EnterprisStore.SeachEnterprisList();
  }
});

watch(
  () => route.query.id_file,
  (newValue) => {
    if (newValue) {
      request.com_enterprise_code = newValue as string;
      request.enterprise_code = newValue as string; 
      enterpreise.value = newValue as string;
    }
  },
  { immediate: true }
);

watch(
  () => userId.value,
  (newValue) => {
    if (newValue) {
      request.bnk_code = newValue as string;
      request.mm_by = newValue as string;
    }
  },
  { immediate: true }
);

const submit = async () => {

  if (!enterpreise.value ) {
    await Swal.fire({
      icon: "warning",
      title: "ກະລຸນາປ້ອນຂໍ້ມູນ",
      text: "ກະລຸນາປ້ອນລະຫັດວິສາຫະກິດ",
    });
    return;
  }

  if (!request.bnk_code || request.bnk_code.trim() === "") {
    await Swal.fire({
      icon: "warning",
      title: "ກະລຸນາປ້ອນຂໍ້ມູນ1111",
      text: "ກະລຸນາເລືອກສະມາຊິກ",
    });
    return;
  }

  loading.value = true;
  try {
 
    request.enterprise_code = enterpreise.value;
    request.com_enterprise_code = enterpreise.value;

    
    if (!request.mm_status) {
      request.mm_status = "P"; 
    }

   
    if (!request.status) {
      request.status = "1"; 
    }

    await EnterprisStore.CreateMactCustomer();
    router.go(-1);
  } catch (error: any) {
    console.error("Error submitting form:", error);
    
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  memberinfoStore.getMemberInfo();
});
</script>

<template>
  <v-sheet class="flex-wrap mx-auto px-4" elevation="4" rounded>
    <div class="pa-4">
      <h3>ພູກລະຫັດລູກຄ້າ ກັບ ລະຫັດ ຂສລ</h3>
    </div>
  </v-sheet>

  <v-sheet class="flex-wrap mx-auto px-4 mt-4" elevation="4" rounded>
    <v-form @submit.prevent="submit">
      <v-col cols="12">
        <v-row>
          <v-col cols="4">
            <v-text-field
              v-model="enterpreise"
              class="mb-4"
              density="compact"
              label="ລະຫັດວິສາຫະກິດ (ຄົ້ນຫາ) *"
              variant="outlined"
              hide-details
              clearable
              required
            ></v-text-field>
          </v-col>

          <v-col cols="4">
            <v-text-field
              v-model="request.com_lao_name"
              class="mb-4"
              density="compact"
              label="ຊື່ວິສາຫະກິດ (ລາວ) *"
              variant="outlined"
              hide-details
              clearable
              required
            ></v-text-field>
          </v-col>

          <v-col cols="4">
            <v-text-field
              v-model="request.com_name"
              class="mb-4"
              density="compact"
              label="ຊື່ວິສາຫະກິດ (ອັງກິດ)"
              variant="outlined"
              hide-details
              clearable
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="4">
            <v-autocomplete
              v-model="request.com_registration_place_issue"
              :items="regisStationOfficeCodes"
              class="mb-4"
              density="compact"
              label="ຫ້ອງການຂຶ້ນທະບຽນ *"
              item-title="title"
              item-value="id"
              variant="outlined"
              hide-details
              clearable
            ></v-autocomplete>
          </v-col>

          <v-col cols="4">
            <v-autocomplete
              v-model="request.com_category"
              :items="enLegalStratures"
              class="mb-4"
              density="compact"
              label="ຮູບແບບວິສາຫະກິດ *"
              item-title="title"
              item-value="id"
              variant="outlined"
              hide-details
              clearable
            ></v-autocomplete>
          </v-col>

          <v-col cols="4">
            <v-text-field
              v-model="request.com_regulatory_capital"
              @input="formatNumber"
              class="mb-4"
              density="compact"
              label="ທຶນຈົດທະບຽນ *"
              variant="outlined"
              hide-details
              clearable
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="4">
            <v-text-field
              v-model="request.com_tax_no"
              class="mb-4"
              density="compact"
              label="ເລກທີໃບທະບຽນ"
              variant="outlined"
              hide-details
              clearable
            ></v-text-field>
          </v-col>

          <v-col cols="4">
            <v-text-field
              v-model="request.com_registration_date"
              class="mb-4"
              density="compact"
              label="ລົງວັນທີ"
              variant="outlined"
              hide-details
              type="date"
              clearable
            ></v-text-field>
          </v-col>

          <v-col cols="4">
            <v-autocomplete
              v-model="request.com_regulatory_capital_unit"
              :items="investmentCurrencys"
              class="mb-4"
              density="compact"
              label="ສະກຸນເງິນ *"
              item-title="title"
              item-value="id"
              variant="outlined"
              hide-details
              clearable
            ></v-autocomplete>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="4">
            <v-autocomplete
              v-model="request.segment"
              :items="segments"
              class="mb-4"
              density="compact"
              label="ປະເພດເງິນກູ້"
              item-title="title"
              item-value="id"
              variant="outlined"
              hide-details
              clearable
            ></v-autocomplete>
          </v-col>

          <v-col cols="4">
            <v-text-field
              v-model="request.com_lao_name_code"
              class="mb-4"
              density="compact"
              label="ລະຫັດຊື່ລາວ"
              variant="outlined"
              hide-details
              clearable
            ></v-text-field>
          </v-col>

          <v-col cols="4">
            <v-text-field
              v-model="request.LCIC_code"
              class="mb-4"
              density="compact"
              label="ລະຫັດ LCIC"
              variant="outlined"
              hide-details
              clearable
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="4">
            <v-autocomplete
              v-model="request.bnk_code"
              :items="memberData"
              class="mb-4"
              density="compact"
              label="ສະມາຊິກທີ່ປ້ອນ *"
              :item-title="displayMember"
              item-value="bnk_code"
              variant="outlined"
              hide-details
              clearable
              required
            >
              <template v-slot:item="{ item, props }">
                <v-list-item
                  v-bind="props"
                  :title="`${item.raw.bnk_code} - ${item.raw.code} - ${item.raw.nameL}`"
                >
                  <template v-slot:prepend>
                    <v-avatar size="small" variant="flat" color="primary">
                      <v-icon size="small">mdi-user</v-icon>
                    </v-avatar>
                  </template>
                </v-list-item>
              </template>
            </v-autocomplete>
          </v-col>

          <v-col cols="4">
            <v-text-field
              v-model="request.branchcode"
              class="mb-4"
              density="compact"
              label="ລະຫັດສາຂາ"
              variant="outlined"
              hide-details
              clearable
            ></v-text-field>
          </v-col>

          <v-col cols="4">
            <v-text-field
              v-model="request.customerid"
              class="mb-4"
              density="compact"
              label="ລະຫັດລູກຄ້າ"
              variant="outlined"
              hide-details
              clearable
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <!-- <v-col cols="4">
            <v-autocomplete
              v-model="request.mm_status"
              :items="mmStatusOptions"
              class="mb-4"
              density="compact"
              label="ສະຖານະການອະນຸມັດ"
              item-title="title"
              item-value="id"
              variant="outlined"
              hide-details
              clearable
            ></v-autocomplete>
          </v-col> -->

          <!-- <v-col cols="4">
            <v-autocomplete
              v-model="request.status"
              :items="statusOptions"
              class="mb-4"
              density="compact"
              label="ສະຖານະ"
              item-title="title"
              item-value="id"
              variant="outlined"
              hide-details
              clearable
            ></v-autocomplete>
          </v-col> -->
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-textarea
              v-model="request.mm_comment"
              class="mb-4"
              density="compact"
              label="ໝາຍເຫດ"
              variant="outlined"
              hide-details
              rows="3"
              clearable
            ></v-textarea>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" class="d-flex justify-center">
           
            <v-btn
              :loading="loading"
              class="bg-red text-white mr-4"
              text="ຍົກເລີກ"
              @click="goPreviousPath()"
              size="large"
            ></v-btn> <v-btn
              :loading="loading"
              class="bg-green text-white"
              text="ບັນທຶກ"
              type="submit"
              size="large"
            ></v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-form>
  </v-sheet>
</template>

<style scoped>
.v-btn {
  text-transform: none;
}
</style>