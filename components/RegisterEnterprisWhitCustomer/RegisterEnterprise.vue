<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2";
import axios from "axios";
import Cookies from "js-cookie";
import { useUserData } from "~/composables/useUserData";

// Composables
const { user, userId, isAdmin, isLoggedIn } = useUserData();
const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();

// Page Meta
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

// Refs - Form Fields
const files = ref<File[]>([]);
const loading = ref(false);
const EnterpriseID = ref("");
const LCICID = ref("");
const enterpriseNameLao = ref("");
const eneterpriseNameEnglish = ref("");
const regisCertificateNumber = ref("");
const regisDate = ref("");
const enLocation = ref<any>("");
const villageName = ref("");
const regisStrationOfficeType = ref("");
const regisStationOfficeCode = ref(1);
const enLegalStrature = ref(1);
const foreigninvestorFlag = ref("L");
const investmentAmount = ref("");
const investmentCurrency = ref("LAK");
const representativeNationality = ref("LA");

// Refs - Other
const selectedVillage = ref(null);
const selectedVillageName = ref("");
const villages = ref([]);
const title = ref("");

// Data Arrays - Dropdowns
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

// Validation Rules
const rules = [(v: string) => !!v || "Required."];

// Computed Properties
const isFormValid = computed(() => {
  return (
    EnterpriseID.value.trim() !== "" &&
    LCICID.value.trim() !== "" &&
    enterpriseNameLao.value.trim() !== ""
  );
});

const fullImagePath = computed(() => {
  return `${config.public.strapi.url}media/${route.query.image}?id=${route.query.id}`;
});

// Functions - Navigation
const goback = () => {
  router.go(-1);
};

// Functions - Formatting
const formatNumber = (): void => {
  const rawNumber = investmentAmount.value.replace(/,/g, "");
  if (!isNaN(Number(rawNumber)) && rawNumber !== "") {
    investmentAmount.value = Number(rawNumber).toLocaleString();
  }
};

// Functions - Display
const displayLocation = (item: any) => {
  if (!item?.Province_Name || !item?.District_Name || !item?.Village_Name) {
    return "ກະລຸນາເລືອກບ້ານ";
  }
  return `ແຂວງ: ${item.Province_Name} - ເມືອງ: ${item.District_Name} - ບ້ານ: ${item.Village_Name}`;
};

// Functions - API Calls
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

const fetchLastLCICID = async () => {
  try {
    const response = await axios.get<{ last_lcicid: string }>(
      `${config.public.strapi.url}api/api/last-lcicid/`
    );
    LCICID.value = (parseInt(response.data.last_lcicid) + 1)
      .toString()
      .padStart(6, "0");
  } catch (error) {
    console.error("Error fetching last LCICID:", error);
  }
};

const checkEnterpriseCode = async (): Promise<boolean> => {
  try {
    const response = await axios.post(
      `${config.public.strapi.url}api/search/${encodeURIComponent(
        EnterpriseID.value
      )}/`
    );

    if (response.status === 200) {
      await Swal.fire({
        title: "ແຈ້ງເຕືອນ!",
        text: "ລະຫັດວິສາຫະກິດນີ້ມີຢູ່ໃນຖານຂໍ້ມູນແລ້ວ",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return true;
    }
    return false;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return false;
    }
    console.error("Error checking enterprise code:", error);
    await Swal.fire({
      title: "ຜິດພາດ!",
      text: "ເກີດຂໍ້ຜິດພາດໃນການກວດສອບລະຫັດວິສາຫະກິດ",
      icon: "error",
      confirmButtonText: "OK",
    });
    return true;
  }
};

const uploadFiles = async () => {
  if (!files.value || files.value.length === 0) {
    return;
  }

  try {
    const formData = new FormData();

    files.value.forEach((file) => {
      formData.append("image", file);
    });

    formData.append("user_mid_id", userId.value);
    formData.append("enterprise_code", EnterpriseID.value);

    const response = await axios.post(
      `${config.public.strapi.url}api/api/upload_image/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("Upload success:", response.data);
  } catch (error: any) {
    console.error("Error uploading files:", error);
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "ເກີດຂໍ້ຜິດພາດໃນການອັບໂຫຼດຟາຍ"
    );
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
    console.error("Error updating collateral status:", error);
    throw error;
  }
};

// Functions - Form Submit
const submit = async () => {
  // Validation
  if (!isFormValid.value) {
    await Swal.fire({
      title: "ແຈ້ງເຕືອນ!",
      text: "ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບຖ້ວນ",
      icon: "warning",
      confirmButtonText: "OK",
    });
    return;
  }

  const result = await Swal.fire({
    title: "ຢືນຢັນການບັນທຶກ?",
    text: "ເຈົ້າຕ້ອງການບັນທຶກຂໍ້ມູນນີ້ແທ້ຫຼືບໍ?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "ບັນທຶກ",
    cancelButtonText: "ຍົກເລີກ",
  });

  if (!result.isConfirmed) {
    return;
  }

  loading.value = true;

  try {
    // Check if enterprise code exists
    const exists = await checkEnterpriseCode();
    if (exists) {
      loading.value = false;
      return;
    }

   
    

    // Upload files first
    try {
      await uploadFiles();
    } catch (uploadError: any) {
      throw new Error(`ການອັບໂຫຼດຟາຍລົ້ມເຫຼວ: ${uploadError.message}`);
    }

    // Format registration date
    let regisDateFormatted = null;
    if (regisDate.value) {
      const dateObject = new Date(regisDate.value);
      if (!isNaN(dateObject.getTime())) {
        regisDateFormatted = dateObject.toISOString();
      } else {
        throw new Error("ຮູບແບບວັນທີບໍ່ຖືກຕ້ອງ");
      }
    }

    // Format investment amount
    const investmentAmountFormatted = investmentAmount.value
      ? Number(investmentAmount.value.replace(/,/g, ""))
      : 0;

    // Get CSRF token
    const csrfToken = Cookies.get("csrftoken");

    // Create enterprise info
    const response = await axios.post(
      `${config.public.strapi.url}api/api/enterprise-info/`,
      {
        
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

    // Check response status
    if (response.status === 201 || response.status === 200) {
      if (response.data.status && response.data.status !== "success") {
        throw new Error(
          response.data.message || "Backend returned error status"
        );
      }

      // Update collateral status
      try {
        
      } catch (statusError) {
        console.error("Warning: Failed to update collateral status");
      }

      // Show success message
      await Swal.fire({
        title: "ສຳເລັດ!",
        html: `
          <p>ສ້າງຂໍ້ມູນວິສາຫະກິດສຳເລັດແລ້ວ!</p>
          ${
            response.data.data
              ? `
            <p><strong>Enterprise ID:</strong> ${
              response.data.data.enterprise?.id || "N/A"
            }</p>
            <p><strong>LCIC Request:</strong> ${
              response.data.data.lcic_reques || "N/A"
            }</p>
          `
              : ""
          }
        `,
        icon: "success",
        confirmButtonText: "OK",
      });

      // Go back after short delay
      setTimeout(() => {
        goback();
      }, 500);
    } else {
      throw new Error(`Unexpected response status: ${response.status}`);
    }
  } catch (error: any) {
    console.error("Error creating enterprise info:", error);

    let errorMessage = "ລົ້ມເຫຼວໃນການສ້າງຂໍ້ມູນວິສາຫະກິດ";

    if (error.response) {
      errorMessage =
        error.response.data?.message ||
        error.response.data?.detail ||
        JSON.stringify(error.response.data) ||
        `Server error: ${error.response.status}`;
    } else if (error.message) {
      errorMessage = error.message;
    }

    await Swal.fire({
      title: "ຜິດພາດ!",
      text: errorMessage,
      icon: "error",
      confirmButtonText: "OK",
    });
  } finally {
    loading.value = false;
  }
};

// Lifecycle Hooks
onMounted(() => {
  fetchVillages();
  fetchLastLCICID();
});
</script>

<template>
  <v-row>
    <v-col cols="12" md="5">
      <v-sheet
        height=""
        width="100%"
        rounded
        :elevation="3"
        class="pa-4 border-info"
        flat
        color="grey-lighten-5"
        border="dotted thin info lg"
      >
        <v-form @submit.prevent="submit">
          <v-text-field
            v-model="EnterpriseID"
            :rules="rules"
            label="ລະຫັດວິສາຫະກິດ *"
            variant="outlined"
            hide-details="auto"
            density="compact"
            class="mb-3"
          ></v-text-field>

          <v-text-field
            v-model="LCICID"
            label="LCIC ID"
            variant="outlined"
            hide-details="auto"
            density="compact"
            class="mb-3"
            readonly
            bg-color="grey-lighten-3"
          ></v-text-field>

          <v-text-field
            v-model="enterpriseNameLao"
            :rules="rules"
            label="ຊື່ວິສາຫະກິດ (ພາສາລາວ) *"
            variant="outlined"
            hide-details="auto"
            density="compact"
            class="mb-3"
          ></v-text-field>

          <v-text-field
            v-model="eneterpriseNameEnglish"
            label="ຊື່ວິສາຫະກິດ (ພາສາອັງກິດ)"
            variant="outlined"
            hide-details="auto"
            density="compact"
            class="mb-3"
          ></v-text-field>

          <v-text-field
            v-model="regisCertificateNumber"
            label="ເລກທີໃບທະບຽນ"
            variant="outlined"
            hide-details="auto"
            density="compact"
            class="mb-3"
          ></v-text-field>

          <v-text-field
            v-model="regisDate"
            label="ລົງວັນທີ"
            variant="outlined"
            hide-details="auto"
            density="compact"
            type="date"
            class="mb-3"
          ></v-text-field>

          <v-autocomplete
            v-model="enLocation"
            :items="villages"
            :item-title="displayLocation"
            item-value="id"
            label="ສະຖານທີ່ຕັ້ງ (ບ້ານ)"
            variant="outlined"
            hide-details="auto"
            density="compact"
            clearable
            class="mb-3"
          ></v-autocomplete>

          <v-autocomplete
            v-model="regisStrationOfficeType"
            :items="regisStrationOfficeTypes"
            label="ແຂວງຂຶ້ນທະບຽນ"
            item-title="title"
            item-value="id"
            variant="outlined"
            hide-details="auto"
            density="compact"
            clearable
            class="mb-3"
          ></v-autocomplete>

          <v-autocomplete
            v-model="regisStationOfficeCode"
            :items="regisStationOfficeCodes"
            label="ຂັ້ນຫ້ອງການຂຶ້ນທະບຽນ"
            item-title="title"
            item-value="id"
            variant="outlined"
            hide-details="auto"
            density="compact"
            class="mb-3"
          ></v-autocomplete>

          <v-autocomplete
            v-model="enLegalStrature"
            :items="enLegalStratures"
            label="ຮູບແບບວິສາຫະກິດ"
            item-title="title"
            item-value="id"
            variant="outlined"
            hide-details="auto"
            density="compact"
            class="mb-3"
          ></v-autocomplete>

          <v-autocomplete
            v-model="foreigninvestorFlag"
            :items="foreigninvestorFlags"
            label="ປະເພດການລົງທຶນ"
            item-title="title"
            item-value="id"
            variant="outlined"
            hide-details="auto"
            density="compact"
            class="mb-3"
          ></v-autocomplete>

          <v-text-field
            v-model="investmentAmount"
            label="ທຶນຈົດທະບຽນ"
            @input="formatNumber"
            variant="outlined"
            hide-details="auto"
            density="compact"
            class="mb-3"
          ></v-text-field>

          <v-autocomplete
            v-model="investmentCurrency"
            :items="investmentCurrencys"
            label="ສະກຸນເງິນ"
            item-title="title"
            item-value="id"
            variant="outlined"
            hide-details="auto"
            density="compact"
            class="mb-3"
          ></v-autocomplete>

          <v-autocomplete
            v-model="representativeNationality"
            :items="representativeNationalitys"
            label="ສັນຊາດເຈົ້າຂອງ"
            item-title="title"
            item-value="id"
            variant="outlined"
            hide-details="auto"
            density="compact"
            class="mb-4"
          ></v-autocomplete>

          <v-btn
            :loading="loading"
            :disabled="!isFormValid"
            class="bg-green text-white"
            text="ບັນທຶກ"
            type="submit"
            block
            size="large"
          ></v-btn>
        </v-form>
      </v-sheet>
    </v-col>

    <v-col cols="12" md="7">
      <v-sheet
        :elevation="3"
        height=""
        width="100%"
        rounded
        class="pa-4 border-info"
        flat
        color="grey-lighten-5"
        border="dotted thin info lg"
      >
        <GloBalUploadImageFile
          v-model="files"
          label="ເລືອກຮູບເອກະສານຢັ້ງຢືນ"
          :max-size="2 * 1024 * 1024"
        />
      </v-sheet>
    </v-col>
  </v-row>
</template>

<style scoped>
.v-btn {
  text-transform: none;
}
</style>