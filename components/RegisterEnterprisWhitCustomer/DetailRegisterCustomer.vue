<script lang="ts" setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2";
import { useEnterprisInfo } from "~/stores/enterpris_member";
import { MemberStore } from "@/stores/memberinfo";
import { useUserData } from "~/composables/useUserData";

const route = useRoute();
const router = useRouter();
const id = route.query.id_file as string;

const EnterprisStore = useEnterprisInfo();
const memberinfoStore = MemberStore();

const request = EnterprisStore.form_company_info_customer_mact_lcic;
const reques = EnterprisStore.check_enterprise;
const { userId } = useUserData();

// ========== ຂໍ້ມູນຫຼັກທີ່ໂຫຼດມາ (ປອດໄພ 100%) ==========
const detailItem = computed(() => {
  const raw = EnterprisStore.respons_data_detail_companymapping;
  const data = Array.isArray(raw) ? raw : raw ? [raw] : [];
  return data[0] || {}; // ຖ້າຍັງບໍ່ມີຂໍ້ມູນ → ສົ່ງ object ຫວ່າງ
});

// ສ້າງ object ທີ່ປອດໄພທັງໝົດ (ປ້ອງກັນ undefined ທຸກ field)
const detail = computed(() => ({
  com_enterprise_code: detailItem.value.com_enterprise_code ?? "",
  com_lao_name: detailItem.value.com_lao_name ?? "",
  com_name: detailItem.value.com_name ?? "",
  com_registration_place_issue: detailItem.value.com_registration_place_issue ?? "",
  com_category: detailItem.value.com_category ?? "",
  com_regulatory_capital: detailItem.value.com_regulatory_capital ?? "",
  com_tax_no: detailItem.value.com_tax_no ?? "",
  com_registration_date: detailItem.value.com_registration_date ?? "",
  com_regulatory_capital_unit: detailItem.value.com_regulatory_capital_unit ?? "",
  segment: detailItem.value.segment ?? "",
  com_lao_name_code: detailItem.value.com_lao_name_code ?? "",
  LCIC_code: detailItem.value.LCIC_code ?? "",
  bnk_code: detailItem.value.bnk_code ?? "",
  branchcode: detailItem.value.branchcode ?? "",
  customerid: detailItem.value.customerid ?? "",
  enterprise_code: detailItem.value.enterprise_code ?? "",
}));

// ========== ຂໍ້ມູນສະມາຊິກ ==========
const memberData = computed(() => {
  const data = memberinfoStore.respons_data_query;
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") return [data];
  return [];
});

const displayMember = (item: any) => {
  if (!item) return "ທັງໝົດ";
  return `${item.bnk_code || ""} - ${item.code || ""} - ${item.nameL || ""}`;
};

// ========== ຕົວເລືອກຕ່າງໆ ==========
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

const loading = ref(false);
const enterpreise = ref("");

// ========== Watchers ==========
watch(
  () => route.query.enterpris,
  (val) => {
    if (val) {
      enterpreise.value = val as string;
      request.com_enterprise_code = val as string;
      request.enterprise_code = val as string;
    }
  },
  { immediate: true }
);

watch(
  () => userId.value,
  (val) => {
    if (val) {
      request.bnk_code = val as string;
      request.mm_by = val as string;
    }
  },
  { immediate: true }
);

// ========== ສົ່ງຟອມ ==========
const submit = async () => {
  if (!enterpreise.value?.trim()) {
    Swal.fire({ icon: "warning", title: "ກະລຸນາປ້ອນລະຫັດວິສາຫະກິດ" });
    return;
  }
  if (!request.bnk_code?.trim()) {
    Swal.fire({ icon: "warning", title: "ກະລຸນາເລືອກສະມາຊິກ" });
    return;
  }

  loading.value = true;
  try {
    request.enterprise_code = enterpreise.value;
    request.com_enterprise_code = enterpreise.value;
    request.mm_status = request.mm_status || "P";
    request.status = request.status || "1";

    await EnterprisStore.CreateMactCustomer();
    router.go(-1);
  } catch (err: any) {
    console.error(err);
    Swal.fire({ icon: "error", title: "ເກີດຂໍ້ຜິດພາດ", text: err.message || "ບໍ່ສາມາດບັນທຶກໄດ້" });
  } finally {
    loading.value = false;
  }
};

// ========== ໂຫຼດຂໍ້ມູນເມື່ອເປີດໜ້າ ==========
onMounted(() => {
  if (id) {
    EnterprisStore.GetDetailDataCompanyMaping(id);
  }
  memberinfoStore.getMemberInfo();
});
</script>

<template>
  <v-sheet class="flex-wrap mx-auto px-4" elevation="4" rounded>
    <div class="pa-4">
      <h3>ລາຍລະອຽດ ພູກລະຫັດລູກຄ້າ ກັບ ລະຫັດ ຂສລ</h3>
    </div>
  </v-sheet>

  <v-sheet class="flex-wrap mx-auto px-4 mt-4" elevation="4" rounded>
    <v-form @submit.prevent="submit">
      <v-col cols="12">
        <!-- Row 1 -->
        <v-row>
          <v-col cols="4">
            <v-text-field
              :model-value="detail.com_enterprise_code"
              label="ລະຫັດວິສາຫະກິດ"
              density="compact"
              variant="outlined"
              readonly
              hide-details
            />
          </v-col>
          <v-col cols="4">
            <v-text-field
              :model-value="detail.com_lao_name"
              label="ຊື່ວິສາຫະກິດ (ລາວ) *"
              density="compact"
              variant="outlined"
              readonly
              hide-details
            />
          </v-col>
          <v-col cols="4">
            <v-text-field
              :model-value="detail.com_name"
              label="ຊື່ວິສາຫະກິດ (ອັງກິດ)"
              density="compact"
              variant="outlined"
              readonly
              hide-details
            />
          </v-col>
        </v-row>

        <!-- Row 2 -->
        <v-row>
          <v-col cols="4">
            <v-autocomplete
              :model-value="detail.com_registration_place_issue"
              :items="regisStationOfficeCodes"
              item-title="title"
              item-value="id"
              label="ຫ້ອງການຂຶ້ນທະບຽນ *"
              density="compact"
              variant="outlined"
              readonly
              hide-details
            />
          </v-col>
          <v-col cols="4">
            <v-autocomplete
              :model-value="detail.com_category"
              :items="enLegalStratures"
              item-title="title"
              item-value="id"
              label="ຮູບແບບວິສາຫະກິດ *"
              density="compact"
              variant="outlined"
              readonly
              hide-details
            />
          </v-col>
          <v-col cols="4">
            <v-text-field
              :model-value="detail.com_regulatory_capital"
              label="ທຶນຈົດທະບຽນ *"
              density="compact"
              variant="outlined"
              readonly
              hide-details
            />
          </v-col>
        </v-row>

        <!-- Row 3 -->
        <v-row>
          <v-col cols="4">
            <v-text-field
              :model-value="detail.com_tax_no"
              label="ເລກທີໃບທະບຽນ"
              density="compact"
              variant="outlined"
              readonly
              hide-details
            />
          </v-col>
          <v-col cols="4">
            <v-text-field
              :model-value="detail.com_registration_date"
              label="ລົງວັນທີ"
              type="date"
              density="compact"
              variant="outlined"
              readonly
              hide-details
            />
          </v-col>
          <v-col cols="4">
            <v-autocomplete
              :model-value="detail.com_regulatory_capital_unit"
              :items="investmentCurrencys"
              item-title="title"
              item-value="id"
              label="ສະກຸນເງິນ *"
              density="compact"
              variant="outlined"
              readonly
              hide-details
            />
          </v-col>
        </v-row>

        <!-- Row 4 -->
        <v-row>
          <v-col cols="4">
            <v-autocomplete
              :model-value="detail.segment"
              :items="segments"
              item-title="title"
              item-value="id"
              label="ປະເພດເງິນກູ້"
              density="compact"
              variant="outlined"
              readonly
              hide-details
            />
          </v-col>
          <v-col cols="4">
            <v-text-field
              :model-value="detail.com_lao_name_code"
              label="ລະຫັດຊື່ລາວ"
              density="compact"
              variant="outlined"
              readonly
              hide-details
            />
          </v-col>
          <v-col cols="4">
            <v-text-field
              :model-value="detail.LCIC_code"
              label="ລະຫັດ LCIC"
              density="compact"
              variant="outlined"
              readonly
              hide-details
            />
          </v-col>
        </v-row>

        <!-- Row 5 -->
        <v-row>
          <v-col cols="4">
            <v-autocomplete
              :model-value="detail.bnk_code"
              :items="memberData"
              :item-title="displayMember"
              item-value="bnk_code"
              label="ສະມາຊິກທີ່ປ້ອນ *"
              density="compact"
              variant="outlined"
              readonly
              hide-details
            >
              <template v-slot:item="{ item, props }">
                <v-list-item v-bind="props" :title="displayMember(item.raw)">
                  <template v-slot:prepend>
                    <v-avatar size="small" color="primary">
                      <v-icon size="small">mdi-bank</v-icon>
                    </v-avatar>
                  </template>
                </v-list-item>
              </template>
            </v-autocomplete>
          </v-col>
          <v-col cols="4">
            <v-text-field
              :model-value="detail.branchcode"
              label="ລະຫັດສາຂາ"
              density="compact"
              variant="outlined"
              readonly
              hide-details
            />
          </v-col>
          <v-col cols="4">
            <v-text-field
              :model-value="detail.customerid"
              label="ລະຫັດລູກຄ້າ"
              density="compact"
              variant="outlined"
              readonly
              hide-details
            />
          </v-col>
        </v-row>

        <!-- ໝາຍເຫດ -->
        <v-row>
          <v-col cols="12">
            <v-textarea
              v-model="request.mm_comment"
              label="ໝາຍເຫດ"
              density="compact"
              variant="outlined"
              rows="3"
              hide-details
            />
          </v-col>
        </v-row>

        <!-- ປຸ່ມ -->
        <v-row class="mt-6">
          <v-col cols="12" class="d-flex justify-center gap-4">
            <v-btn
              v-if="userId === '01'"
              color="red"
              variant="flat"
              size="large"
              :loading="loading"
              @click="router.go(-1)"
            >
              ຍົກເລີກ
            </v-btn>
            <v-btn
              v-if="userId === '01'"
              color="green"
              variant="flat"
              size="large"
              type="submit"
              :loading="loading"
            >
              ບັນທຶກ
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-form>
  </v-sheet>
</template>




<style scoped>
.v-btn { text-transform: none; }
</style>