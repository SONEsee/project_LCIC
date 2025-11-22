<script setup lang="ts">
import { useEnterprisInfo } from "~/stores/enterpris_member";
import { useUserData } from "~/composables/useUserData";
import axios from "~/helpers/axios";
import Swal from "sweetalert2";

interface Village {
  ID: number;
  Prov_ID: string;
  Province_Name: string;
  Dstr_ID: string;
  District_Name: string;
  Vill_ID: string;
  Village_Name: string;
  title: string;
  id: number;
}

const selecVivage = ref("");
const config = useRuntimeConfig();
const villages = ref<Village[]>([]);
const { user, userId, isAdmin, isLoggedIn } = useUserData();
const enterprisStore = useEnterprisInfo();
const rout = useRoute();
const enterprisfile = rout.query.enterprisfile as string;

const dataEnterpris = computed(() => {
  const data = enterprisStore.respon_data_detail_enterprise;
  if (Array.isArray(data)) {
    return data;
  }
  if (data && typeof data === "object") {
    return [data];
  }
  return [];
});
const fetchVillages = async () => {
  try {
    const response = await axios.get(
      `${config.public.strapi.url}api/filter_villages/`
    );
    villages.value = response.data.map((village: any) => ({
      ...village,
      title: `ແຂວງ:${village.Province_Name}-ເມືອງ:${village.District_Name}-ບ້ານ${village.Village_Name}`,
      id: village.ID,
    }));
  } catch (error) {
    console.error("Error fetching villages:", error);
    Swal.fire({
      title: "ຜິດພາດ!",
      text: "ບໍ່ສາມາດໂຫຼດຂໍ້ມູນບ້ານໄດ້",
      icon: "error",
      confirmButtonText: "OK",
    });
  }
};
watch(selecVivage, async (newValue) => {});

console.log("id vilage:", selecVivage);
const enterprisData = computed(() => {
  const data = enterprisStore.respons_data_list_file?.results;
  if (Array.isArray(data)) {
    return data;
  }
  if (data && typeof data === "object") {
    return [data];
  }
  return [];
});
const regisStrationOfficeTypes = [
  { id: "01", title: "ນະຄອນຫຼວງວຽງຈັນ" },
  { id: "10", title: "ວຽງຈັນ" },
  { id: "11", title: "ບໍລິຄຳໄຊ" },
  { id: "12", title: "ຄຳມ່ວນ" },
  { id: "13", title: "ສະຫວັນນະເຂດ" },
  { id: "14", title: "ສາລະວັນ" },
  { id: "15", title: "ເຊກອງ" },
  { id: "16", title: "ຈຳປາສັກ" },
  { id: "17", title: "ອັດຕະປື" },
  { id: "18", title: "ໄຊສົມບູນ" },
  { id: "02", title: "ຜົ້ງສາລີ" },
  { id: "03", title: "ຫຼວງນ້ຳທາ" },
  { id: "04", title: "ອຸດົມໄຊ" },
  { id: "05", title: "ບໍ່ແກ້ວ" },
  { id: "06", title: "ຫຼວງພະບາງ" },
  { id: "07", title: "ຫົວພັນ" },
  { id: "08", title: "ໄຊຍະບູລີ" },
  { id: "09", title: "ຊຽງຂວາງ" },
];

const enLegalStratures = [
  { id: 411, title: "ວິສາຫະກິດ ສ່ວນບຸກຄົນ" },
  { id: 422, title: "ວິສາຫະກິດ ຮຸ້ນສ່ວນສາກົນ" },
  { id: 432, title: "ວິສາຫະກິດ ຮຸ້ນສ່ວນ ຈຳກັດ" },
  { id: 442, title: "ບໍລິສັດ ຈຳກັດ" },
  { id: 451, title: "ບໍລິສັດ ຈຳກັດຜູ້ດຽວ" },
  { id: 469, title: "ບໍລິສັດ ມະຫາຊົນ" },
  { id: 479, title: "ບໍລິສັດ ລັດ" },
  { id: 485, title: "ບໍລິສັດ ປະສົມ" },
  { id: 499, title: "ວິສາຫະກິດລວມໝູ່" },
];

const regisStationOfficeCodes = [
  { id: 1, title: "ຫ້ອງການຂຶ້ນທະບຽນວິສາຫະກິດຂັ້ນສູງກາງ" },
  { id: 2, title: "ຫ້ອງການຂຶ້ນທະບຽນວິສາຫະກິດຂັ້ນແຂວງ" },
  { id: 3, title: "ຫ້ອງການຂຶ້ນທະບຽນວິສາຫະກິດຂັ້ນເມືອງ" },
  { id: 4, title: "ຫ້ອງການສົ່ງເສີມ ແລະ ຄຸ້ມຄອງການລົງທຶນ" },
  { id: 5, title: "ຫ້ອງການເຂດເສດຖະກິດພິເສດ" },
  { id: 6, title: "ຫ້ອງການອຸດສາຫະກຳ ແລະ ການຄ້າ" },
];

const foreigninvestorFlags = [
  { id: "L", title: "ການລົງທຶນພາຍໃນ" },
  { id: "F", title: "ການລົງທຶນຈາກຕ່າງປະເທດ" },
  { id: "M", title: "ການລົງທຶນປະສົມ" },
  { id: "NM", title: "ການລົງທຶນຈາກບໍລິສັດຂ້າມຊາດ" },
  { id: "R", title: "ການລົງທຶນຈາກພາກພື້ນອາຊີ" },
  { id: "I", title: "ການລົງທຶນຈາກການຈັດຕັ້ງຂອງສາກົນ" },
  { id: "S", title: "ການລົງທຶນຈາກລັດຖະບານຕ່າງປະເທດ" },
  { id: "P", title: "ການລົງທຶນລະຫວ່າງລັດ, ເອກກະຊົນ ແລະ ຕ່າງປະເທດ" },
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

const representativeNationalitys = [
  { id: "LA", title: "Laos" },
  { id: "TH", title: "Thailand" },
  { id: "VN", title: "Vietnam" },
  { id: "CN", title: "China" },
  { id: "US", title: "United States" },
  { id: "JP", title: "Japan" },
  { id: "KR", title: "South Korea" },
  { id: "SG", title: "Singapore" },
  { id: "MY", title: "Malaysia" },
  { id: "FR", title: "France" },
  { id: "DE", title: "Germany" },
  { id: "GB", title: "United Kingdom" },
];
const hasData = computed(() => dataEnterpris.value.length > 0);
const currentData = computed(() => dataEnterpris.value[0] || {});
const displayLocation = (item: any) => {
  if (!item?.Province_Name || !item?.District_Name || !item?.Village_Name) {
    return "ກະລຸນາເລືອກບ້ານ";
  }
  return `ແຂວງ: ${item.Province_Name} - ເມືອງ: ${item.District_Name} - ບ້ານ: ${item.Village_Name}`;
};

const selectedVillageDisplay = computed(() => {
  if (!currentData.value?.enLocation) {
    return "ກະລຸນາເລືອກບ້ານ";
  }
  const locationId = Number(currentData.value.enLocation);
  const village = villages.value.find((v) => v.id === locationId);

  return village ? village.title : "ບໍ່ພົບຂໍ້ມູນບ້ານ";
});

const selecprovineRegister = computed(() => {
  if (!currentData.value?.regisStrationOfficeType) {
    return "ບໍ່ພົບຂໍ້ມູນ";
  }

  const provinceId = currentData.value?.regisStrationOfficeType;
  const province = regisStrationOfficeTypes.find((p) => p.id === provinceId);

  return province ? province.title : "ບໍ່ພົບຂໍ້ມູນ";
});

const registerCode = computed(() => {
  if (!currentData.value?.regisStationOfficeCode) {
    return "ບໍ່ມີຂໍ້ມູນ";
  }
  const codeID = Number(currentData.value?.regisStationOfficeCode);
  const registerCode = regisStationOfficeCodes.find((p) => p.id === codeID);
  return registerCode ? registerCode.title : "ບໍ່ມີຂໍ້ມູນ";
});

const SelectenLegalStrature = computed(() => {
  if (!currentData.value?.enLegalStrature) {
    return "ບໍມີ";
  }
  const enLegalStratureId = Number(currentData?.value.enLegalStrature);
  const enLegalStratureDetail = enLegalStratures.find(
    (p) => p.id === enLegalStratureId
  );
  return enLegalStratureDetail ? enLegalStratureDetail.title : "ບໍ່ມີ";
});
const TypeforeigninvestorFlag = computed(() => {
  if (!currentData.value?.foreigninvestorFlag) {
    return "ບໍ່ມີ";
  }
  const foreigninvestorFlagID = currentData.value?.foreigninvestorFlag;
  const foreigninvestorFlagDetail = foreigninvestorFlags.find(
    (p) => p.id === foreigninvestorFlagID
  );
  return foreigninvestorFlagDetail ? foreigninvestorFlagDetail.title : "ບໍ່ມີ";
});
const selecrepresentativeNationalitys = computed(() => {
  if (!currentData.value.representativeNationality) {
    return "ບໍ່ມີ";
  }
  const representativeNationalitysId =
    currentData.value.representativeNationality;
  const representativeNationalitysDetail = representativeNationalitys.find(
    (p) => p.id === representativeNationalitysId
  );
  return representativeNationalitysDetail
    ? representativeNationalitysDetail.title
    : "ບໍ່ມີ";
});

const reject = async () => {
  try {
    enterprisStore.form_reject.rejected_by = userId.value;
    enterprisStore.form_reject.collateral_id = enterprisfile;

    await enterprisStore.Reject();
    enterprisStore.Reject();
  } catch (error) {}
};
const Approve = async () => {
  try {
    enterprisStore.form_aprove.approved_by = userId.value;
    enterprisStore.form_aprove.collateral_id = enterprisfile;

    await enterprisStore.Approve();
  } catch (error) {}
};
onMounted(() => {
  fetchVillages();
  enterprisStore.query.bank_id = userId.value;
  enterprisStore.query_enterprise_id.id_file = enterprisfile;
  enterprisStore.query.id = enterprisfile;
  enterprisStore.GetdataListFileEnterpris();
  enterprisStore.GetdataDetailEnterprisID();
});
</script>

<template>
  <div class="pa-6">
    <v-card v-if="!hasData" class="mx-auto" max-width="600" elevation="0">
      <v-card-text class="text-center pa-8">
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
          width="6"
        ></v-progress-circular>
        <p class="text-h6 mt-4 text-grey-darken-1">ກຳລັງໂຫຼດຂໍ້ມູນ...</p>
      </v-card-text>
    </v-card>

    <v-row v-else dense>
      <v-col cols="12" md="6">
        <v-card elevation="2" class="rounded-lg" height="100%">
          <v-card-title class="text-primary pa-4">
            <v-icon start size="small">mdi-file-image</v-icon>
            ເອກະສານອ້າງອີງ
          </v-card-title>

          <v-card-text class="pa-4">
            <div
              v-if="enterprisData.length > 0 && enterprisData[0]?.image"
              class="document-preview"
            >
              <v-img :src="enterprisData[0].image" class="rounded-lg" cover>
                <template v-slot:placeholder>
                  <div class="d-flex align-center justify-center fill-height">
                    <v-progress-circular
                      color="primary"
                      indeterminate
                    ></v-progress-circular>
                  </div>
                </template>
              </v-img>

              <div class="mt-3 text-center">
                <v-btn
                  variant="outlined"
                  color="primary"
                  size="small"
                  prepend-icon="mdi-magnify-plus"
                  @click="() => {}"
                >
                  ຂະຫຍາຍ
                </v-btn>
              </div>
            </div>

            <v-alert
              v-else
              type="info"
              variant="tonal"
              icon="mdi-information"
              class="ma-0"
            >
              ບໍ່ມີເອກະສານອ້າງອີງ
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card elevation="2" class="rounded-lg">
          <v-card-title class="text-primary">
            <v-icon start size="small">mdi-office-building</v-icon>
            ຂໍ້ມູນວິສາຫະກິດ
          </v-card-title>

          <v-card-text class="pa-4">
            <v-form class="">
              <v-row dense>
                <v-col cols="12">
                  <div class="text-subtitle-2 text-primary mb-2">
                    <v-icon size="small" class="mr-1">mdi-information</v-icon>
                    ຂໍ້ມູນພື້ນຖານ
                  </div>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="currentData.EnterpriseID"
                    label="ເລກທະບຽນວິສາຫະກິດ"
                    variant="outlined"
                    density="comfortable"
                    hide-details="auto"
                    prepend-inner-icon="mdi-identifier"
                    readonly
                    class="mb-2"
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="currentData.enterpriseNameLao"
                    label="ຊື່ວິສາຫະກິດ (ລາວ)"
                    variant="outlined"
                    density="comfortable"
                    hide-details="auto"
                    prepend-inner-icon="mdi-domain"
                    readonly
                    class="mb-2"
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="currentData.eneterpriseNameEnglish"
                    label="ຊື່ວິສາຫະກິດ (ອັງກິດ)"
                    variant="outlined"
                    density="comfortable"
                    hide-details="auto"
                    prepend-inner-icon="mdi-translate"
                    readonly
                    class="mb-2"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" class="mt-4">
                  <v-divider></v-divider>
                  <div class="text-subtitle-2 text-primary mb-2 mt-4">
                    <v-icon size="small" class="mr-1">mdi-file-document</v-icon>
                    ຂໍ້ມູນການຂຶ້ນທະບຽນ
                  </div>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="currentData.regisCertificateNumber"
                    label="ເລກທີ"
                    variant="outlined"
                    density="comfortable"
                    hide-details="auto"
                    prepend-inner-icon="mdi-numeric"
                    readonly
                    class="mb-2"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="currentData.regisDate"
                    label="ລົງວັນທີ"
                    variant="outlined"
                    density="comfortable"
                    hide-details="auto"
                    prepend-inner-icon="mdi-calendar"
                    readonly
                    class="mb-2"
                  ></v-text-field>
                </v-col>
                <!-- <pre>{{ villages }}</pre> -->
                <v-col cols="12">
                  <v-text-field
                    :model-value="selectedVillageDisplay"
                    label="ສະຖານທີ່ຕັ້ງ"
                    variant="outlined"
                    density="comfortable"
                    hide-details="auto"
                    prepend-inner-icon="mdi-map-marker"
                    readonly
                    class="mb-2"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="selecprovineRegister"
                    label="ແຂວງຂຶ້ນທະບຽນ"
                    variant="outlined"
                    density="comfortable"
                    hide-details="auto"
                    prepend-inner-icon="mdi-office-building-marker"
                    readonly
                    class="mb-2"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="registerCode"
                    label="ຂັ້ນຫ້ອງການຂຶ້ນທະບຽນ"
                    variant="outlined"
                    density="comfortable"
                    hide-details="auto"
                    prepend-inner-icon="mdi-office-building"
                    readonly
                    class="mb-2"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" class="mt-4">
                  <v-divider></v-divider>
                  <div class="text-subtitle-2 text-primary mb-2 mt-4">
                    <v-icon size="small" class="mr-1">mdi-cash-multiple</v-icon>
                    ຂໍ້ມູນການລົງທຶນ
                  </div>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="SelectenLegalStrature"
                    label="ຮູບແບບວິສາຫະກິດ"
                    variant="outlined"
                    density="comfortable"
                    hide-details="auto"
                    prepend-inner-icon="mdi-briefcase"
                    readonly
                    class="mb-2"
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="TypeforeigninvestorFlag"
                    label="ປະເພດການລົງທຶນ"
                    variant="outlined"
                    density="comfortable"
                    hide-details="auto"
                    prepend-inner-icon="mdi-flag"
                    readonly
                    class="mb-2"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="8">
                  <v-text-field
                    v-model="currentData.investmentAmount"
                    label="ທຶນຈົດທະບຽນ"
                    variant="outlined"
                    density="compact"
                    hide-details="auto"
                    prepend-inner-icon="mdi-currency-usd"
                    readonly
                    class="mb-2"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="4">
                  <v-text-field
                    v-model="currentData.investmentCurrency"
                    label="ສະກຸນເງິນ"
                    variant="outlined"
                    density="comfortable"
                    hide-details="auto"
                    readonly
                    class="mb-2"
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="selecrepresentativeNationalitys"
                    label="ສັນຊາດເຈົ້າຂອງ"
                    variant="outlined"
                    density="comfortable"
                    hide-details="auto"
                    prepend-inner-icon="mdi-earth"
                    readonly
                    class="mb-2"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-if="userId === '01'"
                    v-model="enterprisStore.form_reject.reason"
                    label="ເຫດຜົນຂອງການ Reject"
                    variant="solo"
                    density="compact"
                    hide-details="auto"
                    class="mb-2"
                  ></v-text-field>
                </v-col>
              </v-row>
              <!-- <pre> {{ currentData }}</pre>
              <pre>{{ enterprisData }}</pre> -->
              <div
                class="w-100 d-flex justify-center"
                v-if="enterprisData[0].status === '1'"
              >
                <v-btn
                  color="primary"
                  class="mr-4"
                  @click="Approve"
                  v-if="userId === '01'"
                  >ບັນທືກ</v-btn
                >
                <v-btn color="error" @click="reject" v-if="userId === '01'"
                  >Reject</v-btn
                >
              </div>
              <div
                class="w-100 d-flex justify-center"
                v-if="enterprisData[0]?.status === '3'"
              >
                <v-alert type="error"> ຖືກ Reject ແລ້ວ </v-alert>
              </div>
              <div
                class="w-100 d-flex justify-center"
                v-if="enterprisData[0]?.status === '0'"
              >
                <v-alert type="success"> ຖືກບັນທືກສຳເລັດແລ້ວ </v-alert>
              </div>
              <div
                class="w-100 d-flex justify-center"
                v-if="enterprisData[0]?.status === '4'"
              >
                <v-alert type="success"> ຖືກ Merg ສຳເລັດແລ້ວ </v-alert>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>
.document-preview {
  position: relative;
}

.v-card-title {
  font-weight: 600;
}

.v-text-field :deep(.v-field) {
  background-color: #f5f5f5;
}

.v-text-field :deep(.v-field--disabled) {
  opacity: 1;
}
</style>
