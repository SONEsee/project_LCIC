<template>
  <v-card>
    <v-col cols="12">
      <v-row>
        <v-col cols="12" md="8">
          <v-card>
            <div class="border">
              <div class="text-center mt-5 ml-5 mb-5 mr-5">
                <v-container>
                  <img
                    width="100%"
                    height="100%"
                    :src="fullImagePath"
                    alt="Uploaded Image"
                  />
                </v-container>
                <h2 class="text-center">ເອກະສານອັບໂຫຼດ</h2>
              </div>
            </div>
          </v-card>
        </v-col>
        
        <v-col cols="12" md="4">
          <div class="border d-flex align-center justify-center" style="height: 100px">
            <p style="font-size: 200%">ລົງຂໍ້ມູນວິສາຫະກິດ</p>
          </div>
          
          <v-card>
            <div>
              <v-col cols="12">
                <v-row>
                  <v-sheet class="mx-auto" max-width="">
                    <v-form validate-on="submit lazy" @submit.prevent="submit">
                      <v-col cols="12">
                        <v-row>
                          <v-div cols="12" class="d-flex justify-center mt-5" style="margin-bottom: 8px; width: 100%">
                            <v-text-field
                              v-model="EnterpriseID"
                              :rules="rules"
                              label="ລະຫັດວິສາຫະກິດ"
                              variant="outlined"
                              persistent-hint
                            ></v-text-field>
                          </v-div>
                          
                          <v-div cols="12" style="margin-bottom: 8px; width: 100%">
                            <v-text-field
                              v-model="enterpriseNameLao"
                              :rules="rules"
                              label="ຊື່ວິສາຫະກິດ (ພາສາລາວ)"
                              variant="outlined"
                              persistent-hint
                            ></v-text-field>
                          </v-div>
                          
                          <v-div cols="12" style="margin-bottom: 8px; width: 100%">
                            <v-text-field
                              v-model="eneterpriseNameEnglish"
                              :rules="rules"
                              label="ຊື່ວິສາຫະກິດ (ພາສາອັງກິດ)"
                              variant="outlined"
                              persistent-hint
                            ></v-text-field>
                          </v-div>
                          
                          <div cols="12" style="width: 100%">
                            <v-text-field
                              v-model="regisCertificateNumber"
                              :rules="rules"
                              label="ເລກທີ"
                              variant="outlined"
                              persistent-hint
                            ></v-text-field>
                          </div>
                          
                          <div cols="12" style="width: 100%">
                            <v-text-field
                              v-model="regisDate"
                              :rules="rules"
                              type="date"
                              label="ລົງວັນທີ"
                              variant="outlined"
                              persistent-hint
                            ></v-text-field>
                          </div>
                          
                          <div cols="12" style="width: 100%">
                            <v-autocomplete
                              v-model="enLocation"
                              :items="villages"
                              item-text="title"
                              item-value="id"
                              label="ກະລຸນາເລືອກບ້ານ"
                              variant="outlined"
                              @update:model-value="handleVillageSelect"
                            ></v-autocomplete>
                          </div>
                          
                          <div cols="12" style="margin-bottom: 8px; width: 100%">
                            <v-autocomplete
                              v-model="regisStrationOfficeType"
                              :items="regisStrationOfficeTypes"
                              item-text="title"
                              item-value="id"
                              :rules="rules"
                              label="ລະຫັດຫ້ອງການຂຶ້ນທະບຽນ"
                              variant="outlined"
                              persistent-hint
                            ></v-autocomplete>
                          </div>
                          
                          <div cols="12" style="margin-bottom: 8px; width: 100%">
                            <v-autocomplete
                              v-model="regisStationOfficeCode"
                              :items="regisStationOfficeCodes"
                              item-text="title"
                              item-value="id"
                              :rules="rules"
                              label="ຂັ້ນຫ້ອງການຂຶ້ນທະບຽນ"
                              variant="outlined"
                              persistent-hint
                            ></v-autocomplete>
                          </div>
                          
                          <div cols="12" style="margin-bottom: 8px; width: 100%">
                            <v-select
                              v-model="enLegalStrature"
                              :rules="rules"
                              :items="enLegalStratures"
                              item-text="title"
                              item-value="id"
                              label="ຮູບແບບວິສາຫະກິດ"
                              variant="outlined"
                              persistent-hint
                            ></v-select>
                          </div>
                          
                          <div cols="12" style="margin-bottom: 8px; width: 100%">
                            <v-select
                              v-model="foreigninvestorFlag"
                              :items="foreigninvestorFlags"
                              item-text="title"
                              item-value="id"
                              :rules="rules"
                              label="Foreigninvestor Flag"
                              variant="outlined"
                              persistent-hint
                            ></v-select>
                          </div>
                          
                          <div cols="12" style="margin-bottom: 8px; width: 100%">
                            <v-text-field
                              v-model="investmentAmount"
                              type="text"
                              label="ທຶນຈົດທະບຽນ"
                              variant="outlined"
                              @input="formatNumber"
                              persistent-hint
                            ></v-text-field>
                          </div>
                          
                          <div cols="12" style="margin-bottom: 8px; width: 100%">
                            <v-autocomplete
                              v-model="investmentCurrency"
                              :items="investmentCurrencys"
                              item-text="title"
                              item-value="id"
                              :rules="rules"
                              label="Investment Currency"
                              variant="outlined"
                              persistent-hint
                            ></v-autocomplete>
                          </div>
                          
                          <div cols="12" style="margin-bottom: 8px; width: 100%">
                            <v-autocomplete
                              v-model="representativeNationality"
                              :items="representativeNationalitys"
                              item-text="title"
                              item-value="id"
                              :rules="rules"
                              label="Representative Nationality"
                              variant="outlined"
                              persistent-hint
                            ></v-autocomplete>
                          </div>
                        </v-row>
                      </v-col>
                      
                      <v-vol class="text-center">
                        <v-row>
                          <v-col cols="6" md="6">
                            <v-btn
                              style="width: 100px"
                              :loading="loading"
                              class="bg-green"
                              text="ບັນທຶກ"
                              type="submit"
                              block
                              :disabled="!isFormValid"
                            ></v-btn>
                          </v-col>
                          <v-col cols="6" md="6">
                            <v-btn
                              style="width: 100px"
                              :loading="loading"
                              class="bg-red"
                              text="ຍົກເລີກ"
                              type="reset"
                              @click="goback"
                              block
                            ></v-btn>
                          </v-col>
                        </v-row>
                      </v-vol>
                    </v-form>
                  </v-sheet>
                </v-row>
              </v-col>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
  </v-card>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2";
import axios from "axios";
import Cookies from "js-cookie";

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

// Refs
const loading = ref(false);
const EnterpriseID = ref("");
const LCICID = ref("");
const enterpriseNameLao = ref("");
const eneterpriseNameEnglish = ref("");
const regisCertificateNumber = ref("");
const regisDate = ref("");
const enLocation = ref("");
const villageName = ref("");
const regisStrationOfficeType = ref("");
const regisStationOfficeCode = ref(1);
const enLegalStrature = ref(1);
const foreigninvestorFlag = ref(1);
const investmentAmount = ref("");
const investmentCurrency = ref(1);
const representativeNationality = ref(1);

const selectedVillage = ref(null);
const selectedVillageName = ref("");
const villages = ref([]);
const title = ref("");

const route = useRoute();
const goback = () => {
  router.go(-1);
};
const router = useRouter();
const config = useRuntimeConfig();

// Data Arrays
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
  { id: "M", title: "ການລົງທຶນປະສົມ" },
  { id: "F", title: "ການລົງທຶນຈາກຕ່າງປະເທດ" },
  { id: "L", title: "ການລົງທຶນພາຍໃນ" },
  { id: "NM", title: "ການລົງທຶນຈາກບໍລິສັດຂ້າມຊາດ" },
  { id: "R", title: "ການລົງທຶນຈາກພາກພື້ນອາຊີ" },
  { id: "I", title: "ການລົງທຶນຈາກການຈັດຕັ້ງຂອງສາກົນ" },
  { id: "S", title: "ການລົງທຶນຈາກລັດຖະບານຕ່າງປະເທດ" },
  { id: "P", title: "ການລົງທຶນລະຫວ່າງລັດ, ເອກກະຊົນ ແລະ ຕ່າງປະເທດ" },
];

const investmentCurrencys = [
  { id: "LAK", title: "LAK" },
  { id: "THB", title: "THB" },
  { id: "JPY", title: "JPY" },
  { id: "USD", title: "USD" },
  { id: "EUR", title: "EUR" },
  { id: "CNY", title: "CNY" },
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

// Validation Rules
const rules = [(v: string) => !!v || "Required."];

// Computed
const isFormValid = computed(() => {
  return EnterpriseID.value.trim() !== "" && LCICID.value.trim() !== "";
});

const fullImagePath = computed(() => {
  return `${config.public.strapi.url}media/${route.query.image}?id=${route.query.id}`;
});

// Functions
const formatNumber = (): void => {
  const rawNumber = investmentAmount.value.replace(/,/g, "");
  if (!isNaN(Number(rawNumber))) {
    investmentAmount.value = Number(rawNumber).toLocaleString();
  }
};

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
  }
};

const handleVillageSelect = (value: number) => {
  const selected = villages.value.find((village: any) => village.id === value);
  if (selected) {
    selectedVillageName.value = selected.Village_Name;
    enLocation.value = selected.Village_Name;
    title.value = `${selected.District_Name} ${selected.Province_Name}`;
  }
};

const fetchLastLCICID = async () => {
  try {
    const response = await axios.get<{ last_lcicid: string }>(
      `${config.public.strapi.url}api/api/last-lcicid/`
    );
    LCICID.value = (parseInt(response.data.last_lcicid) + 1).toString();
  } catch (error) {
    console.error("Error fetching last LCICID:", error);
  }
};

const updateCollateralStatus = async (id: number) => {
  try {
    const csrfResponse = await axios.get(
      `${config.public.strapi.url}api/api/get_csrf_token/`
    );
    const csrfToken = csrfResponse.data.csrfToken;

    await axios.post(
      `${config.public.strapi.url}api/api/confirm_image/${id}/`,
      {},
      {
        headers: {
          "X-CSRFToken": csrfToken,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: any) {
    console.error(error.response ? error.response.data : error.message);
  }
};

const submit = async () => {
  const result = await Swal.fire({
    title: "ຢືນຢັນການບັນທຶກ?",
    text: "ເຈົ້າຕ້ອງການບັນທຶກຂໍ້ມູນນີ້ແທ້ຫຼືບໍ?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "ບັນທຶກ",
    cancelButtonText: "ຍົກເລີກ",
  });

  if (result.isConfirmed) {
    loading.value = true;
    try {
      const csrfToken = Cookies.get("csrftoken");

      // ກວດສອບວ່າມີ collateral_id ຫຼືບໍ່
      const collateralId = Number(route.query.id);
      if (!collateralId || isNaN(collateralId)) {
        throw new Error("ບໍ່ພົບ Collateral ID");
      }

      console.log("Collateral ID:", collateralId); // Debug

      let regisDateFormatted = null;
      if (regisDate.value) {
        const dateObject = new Date(regisDate.value);
        if (!isNaN(dateObject.getTime())) {
          regisDateFormatted = dateObject.toISOString();
        } else {
          throw new Error("Invalid date format for regisDate");
        }
      }

      const investmentAmountFormatted = Number(investmentAmount.value.replace(/,/g, ""));

      // ສົ່ງຂໍ້ມູນພ້ອມ collateral_id
      const response = await axios.post(
        `${config.public.strapi.url}api/api/enterprise-info/`,
        {
          collateral_id: collateralId, // ສົ່ງ collateral_id ໄປດ້ວຍ
          enterpriseNameLao: enterpriseNameLao.value,
          eneterpriseNameEnglish: eneterpriseNameEnglish.value,
          enLegalStrature: enLegalStrature.value,
          foreigninvestorFlag: foreigninvestorFlag.value,
          investmentAmount: investmentAmountFormatted,
          investmentCurrency: investmentCurrency.value,
          representativeNationality: representativeNationality.value,
          regisCertificateNumber: regisCertificateNumber.value,
          regisDate: regisDateFormatted,
          enLocation: enLocation.value,
          regisStationOfficeCode: regisStationOfficeCode.value,
          regisStrationOfficeType: regisStrationOfficeType.value,
          EnterpriseID: EnterpriseID.value,
          LCICID: LCICID.value,
        },
        {
          headers: {
            "X-CSRFToken": csrfToken || "",
          },
        }
      );

      // Debug: ເບິ່ງ response ທັງໝົດ
      console.log("Response:", response);
      console.log("Response data:", response.data);
      console.log("Response status:", response.status);

      // ກວດສອບ response status code ກ່ອນ
      if (response.status === 201 || response.status === 200) {
        // ກວດສອບ response.data.status (ຖ້າມີ)
        if (response.data.status && response.data.status !== 'success') {
          throw new Error(response.data.message || "Backend return error status");
        }

        await Swal.fire({
          title: "ສຳເລັດ!",
          html: `
            <p>ສ້າງຂໍ້ມູນວິສາຫະກິດສຳເລັດແລ້ວ!</p>
            ${response.data.data ? `
              <p><strong>Enterprise ID:</strong> ${response.data.data.enterprise?.id || 'N/A'}</p>
              <p><strong>Collateral LCIC_reques:</strong> ${response.data.data.lcic_reques || 'N/A'}</p>
            ` : ''}
          `,
          icon: "success",
          confirmButtonText: "OK",
        });

        // Update collateral status (ຖ້າຍັງຕ້ອງການ)
        try {
          await updateCollateralStatus(collateralId);
        } catch (statusError) {
          console.error("Error updating collateral status:", statusError);
         
        }
        setTimeout(() => {
          goback()
        },500);
        
        ;
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
      
    } catch (error: any) {
      console.error("Error creating enterprise info:", error);
      console.error("Error response:", error.response);
      
      // ດຶງ error message ຈາກຫຼາຍແຫຼ່ງ
      let errorMessage = "ລົ້ມເຫຼວໃນການສ້າງຂໍ້ມູນວິສາຫະກິດ";
      
      if (error.response) {
        // ມີ response ຈາກ server
        console.log("Error response data:", error.response.data);
        errorMessage = error.response.data?.message 
          || error.response.data?.detail
          || JSON.stringify(error.response.data)
          || `Server error: ${error.response.status}`;
      } else if (error.message) {
        // Error message ທີ່ເຮົາ throw ເອງ
        errorMessage = error.message;
      }
      
      Swal.fire({
        title: "ຜິດພາດ!",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      loading.value = false;
    }
  }
};

// Lifecycle
onMounted(() => {
  fetchVillages();
  fetchLastLCICID();
});
</script>