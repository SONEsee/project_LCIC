<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import Swal from "sweetalert2";
import { useFeesStore } from "~/stores/fee";
import { LoCationStore } from "~/stores/location";

const location = LoCationStore();
const feestore = useFeesStore();
const consentGiven = ref(false); // ເພີ່ມຕົວແປນີ້

const dataLocation = computed(()=>{
  const data = location.respons_data_location;
  if(Array.isArray(data)){
    return data
  }
  if(data && typeof data==="object"){
    return [data]
  }
  return []
})

const dataFee = computed(() => {
  const data = feestore.response_data_fee;
  let processedData = [];

  if (Array.isArray(data)) {
    processedData = data;
  } else if (data && typeof data === "object") {
    processedData = [data];
  } else {
    return [];
  }

  return processedData.filter((item) => item.chg_code === "FCR");
});

interface EnterpriseInfoResponse {
  enterprise_info: EnterpriseInfo[];
  investor_names: any[];
  total_found: number;
  debug_info: DebugInfo;
}

interface DebugInfo {
  total_raw_records: number;
  unique_records_returned: number;
  search_criteria: SearchCriteria;
}

interface SearchCriteria {
  LCIC_code: string;
  EnterpriseID: string;
}

interface EnterpriseInfo {
   LCICID:                    number;
    EnterpriseID:              string;
    enterpriseNameLao:         string;
    eneterpriseNameEnglish:    string;
    regisCertificateNumber:    string;
    regisDate:                 string;
    enLocation:                string;
    regisStrationOfficeType:   string;
    regisStationOfficeCode:    string;
    enLegalStrature:           string;
    foreigninvestorFlag:       string;
    investmentAmount:          number;
    status:                    number;
    investmentCurrency:        string;
    representativeNationality: string;
    LastUpdate:                string;
    CancellationDate:          string;
    InsertDate:                string;
    UpdateDate:                string;
    LCIC_code:                 string;
    id_file:                   null;
    locationInfo:              LocationInfo;
    provinceName:              string;
    districtName:              string;
    villageName:               string;
    fullLocation:              string;
}
interface LocationInfo {
    Province_Name: string;
    District_Name: string;
    Village_Name:  string;
    Prov_ID:       string;
    Dstr_ID:       string;
    Vill_ID:       string;
}
definePageMeta({
  layout: "backend",
});

useHead({
  title: "Search Results",
  meta: [
    {
      name: "keywords",
      content: "Enterprise Search Results, Nuxt 3, Backend",
    },
    {
      name: "Description",
      content: "Enterprise Search Results, IT Genius Engineering",
    },
  ],
});

const route = useRoute();

const enterpriseData = ref<EnterpriseInfo[]>([]);

const investorNames = ref<any[]>([]);
const loading = ref(true);
const details = ref(false);
const catalogID = ref(route.query.CatalogID || "");

const formatAmount = (amount: any) => {
  if (!amount || amount === 0) return "-";
  return new Intl.NumberFormat("lo-LA").format(amount);
};

const fetchData = async () => {
  const { LCIC_code, EnterpriseID, CatalogID } = route.query;

  if (!LCIC_code && !EnterpriseID) {
    Swal.fire({
      icon: "warning",
      title: "ຂໍ້ມູນບໍ່ຄົບຖ້ວນ",
      text: "ບໍ່ມີລະຫັດການຄົ້ນຫາ",
      confirmButtonText: "ຕົກລົງ",
    });
    loading.value = false;
    return;
  }

  try {
    const config = useRuntimeConfig();
    const token = localStorage.getItem("access_token");

    console.log("Fetching data with params:", {
      LCIC_code,
      EnterpriseID,
      CatalogID,
    });

    const res = await fetch(
      `${config.public.strapi.url}api/api/v1/enterprise-info/search/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          LCIC_code: LCIC_code || "",
          EnterpriseID: EnterpriseID || "",
          CatalogID: CatalogID || "",
        }),
      }
    );

    if (res.ok) {
      const result = await res.json();
      console.log("API Response:", result);

      if (result.enterprise_info && Array.isArray(result.enterprise_info)) {
        enterpriseData.value = result.enterprise_info;
        investorNames.value = result.investor_names || [];

        console.log("Enterprise data:", enterpriseData.value);
        console.log("Investor names:", investorNames.value);
      } else {
        if (Array.isArray(result)) {
          enterpriseData.value = result;
        } else {
          console.warn("Unexpected response format:", result);
          enterpriseData.value = [];
        }
        investorNames.value = [];
      }
    } else if (res.status === 401) {
      const newToken = await refreshAccessToken();
      if (newToken) {
        const retryRes = await fetch(
          `${config.public.strapi.url}api/api/v1/enterprise-info/search/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${newToken}`,
            },
            body: JSON.stringify({
              LCIC_code: LCIC_code || "",
              EnterpriseID: EnterpriseID || "",
              CatalogID: CatalogID || "",
            }),
          }
        );

        if (retryRes.ok) {
          const result = await retryRes.json();
          if (result.enterprise_info && Array.isArray(result.enterprise_info)) {
            enterpriseData.value = result.enterprise_info;
            investorNames.value = result.investor_names || [];
          } else {
            enterpriseData.value = Array.isArray(result) ? result : [];
            investorNames.value = [];
          }
        } else {
          const errorResult = await retryRes.json();
          throw new Error(
            errorResult.error || "Error fetching data after token refresh"
          );
        }
      }
    } else {
      const errorResult = await res.json();
      throw new Error(errorResult.error || `HTTP error! status: ${res.status}`);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    Swal.fire({
      icon: "error",
      title: "ເກີດຂໍ້ຜິດພາດ",
      text: "ການດືງຂໍ້ມູນຜິດພາດ, ກະລຸນາລອງໃໝ່ອີກຄັ້ງ",
      confirmButtonText: "ຕົກລົງ",
    });
    enterpriseData.value = [];
    investorNames.value = [];
  } finally {
    loading.value = false;
  }
};

const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refresh_token");
  if (!refreshToken) {
    Swal.fire({
      icon: "error",
      title: "Session Expired",
      text: "Your session has expired. Please log in again.",
      confirmButtonText: "OK",
    });
    await navigateTo("/");
    return null;
  }

  try {
    const config = useRuntimeConfig();
    const response = await fetch(
      `${config.public.strapi.url}api/token/refresh/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: refreshToken }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("access_token", data.access);
      return data.access;
    } else {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      await navigateTo("/");
      return null;
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
    return null;
  }
};

const showDetails = (item: EnterpriseInfo) => {
  // ກວດສອບວ່າໄດ້ຢືນຢັນການອະນຸຍາດແລ້ວຫຼືຍັງ
  if (!consentGiven.value) {
    Swal.fire({
      icon: "warning",
      title: "ກະລຸນາຢືນຢັນ",
      text: "ກະລຸນາຢືນຢັນການໄດ້ຮັບອະນຸຍາດກ່ອນດຳເນີນການ",
      confirmButtonText: "ຕົກລົງ",
    });
    return;
  }

  const { CatalogID } = route.query;
  const feeAmount = dataFee.value.length > 0 ? dataFee.value[0].chg_amount : null;

  Swal.fire({
    icon: "info",
    iconColor: "blue",
    text: "ທ່ານຕ້ອງການດຳເນີນການຕໍ່ບໍ?",
    showCancelButton: true,
    confirmButtonColor: "#004D40",
    confirmButtonText: "ຢືນຢັນ",
    cancelButtonColor: "#d33",
    cancelButtonText: "ຍົກເລີກ",
    color: "black",
    title: `<strong>ທ່ານຕ້ອງການພິມບົດລາຍງານນີ້ແທ້ບໍ?</strong>`,
    html: `
      <div style="text-align: left; padding: 10px;">
       <p><strong>ລະຫັດ ຂສລ:</strong> ${item.LCIC_code}</p>
        <p><strong>ລະຫັດວິສາຫະກິດ:</strong> ${item.EnterpriseID}</p>
        <p><strong>ຊື່ບໍລິສັດພາສາລາວ:</strong> ${
          item.enterpriseNameLao || "ບໍ່ມີຂໍ້ມູນ"
        }</p>
        <p><strong>ຊື່ບໍລິສັດພາສາອັງກິດ:</strong> ${
          item.eneterpriseNameEnglish || "ບໍ່ມີຂໍ້ມູນ"
        }</p>
        <p><strong>ທີ່ຢູ່:</strong> ${item.fullLocation || "ບໍ່ມີຂໍ້ມູນທີ່ຢູ່"}</p>
        <p><strong>ທຶນຈົົດທະບຽນ:</strong> ${
          item.investmentAmount 
            ? new Intl.NumberFormat("lo-LA").format(item.investmentAmount) + " " + (item.investmentCurrency || "")
            : "ບໍ່ມີຂໍ້ມູນ"
        }</p>
      
      </div>
    `,
  }).then((result) => {
    if (result.isConfirmed) {
      console.log("Selected item:", item);
      console.log("CatalogID:", CatalogID);

      insertSearchLog(item)
        .then(() => {
          const printUrl = `/backend/reportprint1?EnterpriseID=${item.EnterpriseID}&LCIC_code=${item.LCIC_code}&CatalogID=${CatalogID}`;
          window.location.href = printUrl;
        })
        .catch((error) => {
          console.error("Error inserting search log:", error);
          Swal.fire({
            icon: "warning",
            title: "ແຈ້ງເຕືອນ",
            text: "ບໍ່ສາມາດບັນທຶກ log ໄດ້ ແຕ່ຈະດຳເນີນການຕໍ່",
            confirmButtonText: "ຕົກລົງ",
          });

          const printUrl = `/backend/reportprint1?EnterpriseID=${item.EnterpriseID}&LCIC_code=${item.LCIC_code}&CatalogID=${CatalogID}`;
          window.location.href = printUrl;
        });
    }
  });
};

const insertSearchLog = async (item: EnterpriseInfo) => {
  try {
    const { CatalogID } = route.query;
    const token = localStorage.getItem("access_token");
    const config = useRuntimeConfig();

    console.log("Inserting search log with data:", {
      EnterpriseID: item.EnterpriseID,
      LCIC_code: item.LCIC_code,
      CatalogID: CatalogID,
    });

    const response = await fetch(
      `${config.public.strapi.url}api/insert_searchlog/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          EnterpriseID: item.EnterpriseID,
          LCIC_code: item.LCIC_code,
          CatalogID: CatalogID,
        }),
      }
    );
  // <p><strong>ຖ້າຢືນຢັນເອົາບົດລາຍງານນີ້ແມ່ນຈະໄດ້ເສຍຄ່າທຳນຽມ:</strong> ${
  //         feeAmount
  //           ? new Intl.NumberFormat("lo-LA").format(feeAmount) + " ກີບ"
  //           : "ບໍ່ມີຂໍ້ມູນ"
  //       }</p>
    if (!response.ok) {
      throw new Error(`Failed to insert search log: ${response.status}`);
    }

    const data = await response.json();
    console.log("Search log inserted successfully:", data);
    return data;
  } catch (error) {
    console.error("Error inserting search log:", error);
    throw error;
  }
};

const truncateText = (text: string | null | undefined, maxLength: number): string => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

const getLocationTooltip = (locationInfo: LocationInfo | null): string => {
  if (!locationInfo) return "ບໍ່ມີຂໍ້ມູນທີ່ຢູ່";
  
  return `
    ບ້ານ: ${locationInfo.Village_Name}
    ເມືອງ: ${locationInfo.District_Name}
    ແຂວງ: ${locationInfo.Province_Name}
    ລະຫັດ: ${locationInfo.Prov_ID}-${locationInfo.Dstr_ID}-${locationInfo.Vill_ID}
  `;
};

const getInvestmentTooltip = (item:any): string => {
  return `
    ຈຳນວນເງີນ: ${formatAmount(item.investmentAmount)}
    ສະກຸນເງີນ: ${item.investmentCurrency || 'ບໍ່ລະບຸ'}
    ນັກລົງທຶນຕ່າງປະເທດ: ${item.foreigninvestorFlag ? 'ມີ' : 'ບໍ່ມີ'}
    ໂຄງສ້າງກົດໝາຍ: ${item.enLegalStrature || 'ບໍ່ລະບຸ'}
  `;
};

const enterpriseDataWithLocation = computed(() => {
  if (!enterpriseData.value || enterpriseData.value.length === 0) {
    return [];
  }

  return enterpriseData.value.map(enterprise => {
    const matchedLocation = dataLocation.value.find(location => 
      location.ID.toString() === enterprise.enLocation
    );

    return {
      ...enterprise,
      locationInfo: matchedLocation ? {
        Province_Name: matchedLocation.Province_Name,
        District_Name: matchedLocation.District_Name,
        Village_Name: matchedLocation.Village_Name,
        Prov_ID: matchedLocation.Prov_ID,
        Dstr_ID: matchedLocation.Dstr_ID,
        Vill_ID: matchedLocation.Vill_ID
      } : null,
      provinceName: matchedLocation?.Province_Name || 'ບໍ່ມີຂໍ້ມູນ',
      districtName: matchedLocation?.District_Name || 'ບໍ່ມີຂໍ້ມູນ',
      villageName: matchedLocation?.Village_Name || 'ບໍ່ມີຂໍ້ມູນ',
      fullLocation: matchedLocation 
        ? `ບ້ານ ${matchedLocation.Village_Name}, ເມືອງ ${matchedLocation.District_Name}, ແຂວງ ${matchedLocation.Province_Name}`
        : 'ບໍ່ມີຂໍ້ມູນທີ່ຢູ່'
    };
  });
});

onMounted(() => {
  location.GetLocation()
  fetchData();
  feestore.Getdata();
});
</script>

<template>
  <div>
    <v-container>
      <v-card class="bg-indigo-lighten-5 text-start">
        <div class="text-center">
          <p class="main-title">ບົດລາຍງານສິນເຊືອຄົບຖວ້ນ ນິຕິບຸກຄົນ</p>
        </div>

        <div v-if="loading" class="loading-container">
          <p class="loading-text">ກຳລັງໂຫຼດ.........</p>
        </div>

        <div v-else>
          <div v-if="enterpriseData && enterpriseData.length > 0">
            <v-col cols="12">
              <v-row>
                <v-col
                  cols="12"
                  md="6"
                  v-for="item in enterpriseDataWithLocation"
                  :key="item.LCIC_code"
                  class="text-start mt-3 mp-3"
                >
                  <p class="text-red info-line">
                    ລະຫັດຂສລ:
                    <b class="ml-1 mr-3 info-value">{{ item.LCIC_code }}</b>
                    ລະຫັດວິສາຫະກິດ:
                    <b class="ml-1 mr-3 info-value">{{ item.EnterpriseID }}</b>
                  </p>
                </v-col>
              </v-row>
            </v-col>

            <v-table class="data-table">
              <thead>
                <tr>
                  <th><p>ລະຫັດ ຂສລ</p></th>
                  <th><p>ລະຫັດວິສາຫະກິດ</p></th>
                  <th><p>ຊື່ບໍລິສັດ(ພາສາລາວ)</p></th>
                  <th><p>ຊື່ບໍລິສັດ(ພາສາອັງກິດ)</p></th>
                  <th><p>ທີ່ຢູ່ເປັນ(ພາສາລາວ)</p></th>
                  <th><p>ທຶນຈົົດທະບຽນ</p></th>
                  <th><p>ລາຍລະອຽດ</p></th>
                </tr>
              </thead>
              <tbody class="text-end">
                <tr v-for="item in enterpriseDataWithLocation" :key="item.LCIC_code">
                  <td>
                    <v-tooltip location="bottom">
                      <template v-slot:activator="{ props }">
                        <p class="table-data tooltip-text" v-bind="props">
                          {{ item.LCIC_code }}
                        </p>
                      </template>
                      <span>ລະຫັດ ຂສລ: {{ item.LCIC_code }}</span>
                    </v-tooltip>
                  </td>

                  <td>
                    <v-tooltip location="bottom">
                      <template v-slot:activator="{ props }">
                        <p class="table-data tooltip-text" v-bind="props">
                          {{ item.EnterpriseID }}
                        </p>
                      </template>
                      <span>ລະຫັດວິສາຫະກິດ: {{ item.EnterpriseID }}</span>
                    </v-tooltip>
                  </td>

                  <td>
                    <v-tooltip location="bottom" :disabled="!item.enterpriseNameLao || item.enterpriseNameLao.length <= 30">
                      <template v-slot:activator="{ props }">
                        <p class="table-data tooltip-text" v-bind="props">
                          {{ truncateText(item.enterpriseNameLao, 30) || "-" }}
                        </p>
                      </template>
                      <span>{{ item.enterpriseNameLao }}</span>
                    </v-tooltip>
                  </td>

                  <td>
                    <v-tooltip location="bottom" :disabled="!item.eneterpriseNameEnglish || item.eneterpriseNameEnglish.length <= 30">
                      <template v-slot:activator="{ props }">
                        <p class="table-data tooltip-text" v-bind="props">
                          {{ truncateText(item.eneterpriseNameEnglish, 30) || "-" }}
                        </p>
                      </template>
                      <span>{{ item.eneterpriseNameEnglish }}</span>
                    </v-tooltip>
                  </td>

                  <td>
                    <v-tooltip location="bottom" max-width="300">
                      <template v-slot:activator="{ props }">
                        <p class="table-data tooltip-text" v-bind="props">
                          {{ truncateText(item.fullLocation, 25) || "-" }}
                        </p>
                      </template>
                      <div v-if="item.locationInfo">
                        <div><strong>ທີ່ຢູ່ເຕັມ:</strong></div>
                        <div>• ບ້ານ: {{ item.locationInfo.Village_Name }}</div>
                        <div>• ເມືອງ: {{ item.locationInfo.District_Name }}</div>
                        <div>• ແຂວງ: {{ item.locationInfo.Province_Name }}</div>
                        <div class="mt-2">
                          <strong>ລະຫັດພູມສາດ:</strong><br>
                          ແຂວງ: {{ item.locationInfo.Prov_ID }}, 
                          ເມືອງ: {{ item.locationInfo.Dstr_ID }}, 
                          ບ້ານ: {{ item.locationInfo.Vill_ID }}
                        </div>
                      </div>
                      <div v-else>ບໍ່ມີຂໍ້ມູນທີ່ຢູ່</div>
                    </v-tooltip>
                  </td>

                  <td>
                    <v-tooltip location="bottom">
                      <template v-slot:activator="{ props }">
                        <p class="table-data tooltip-text" v-bind="props">
                          {{ formatAmount(item.investmentAmount) }}
                        </p>
                      </template>
                      <div>
                        <div><strong>ລາຍລະອຽດການລົງທຶນ:</strong></div>
                        <div>• ຈຳນວນ: {{ formatAmount(item.investmentAmount) }}</div>
                        <div>• ສະກຸນເງີນ: {{ item.investmentCurrency || 'ບໍ່ລະບຸ' }}</div>
                        <div>• ນັກລົງທຶນຕ່າງປະເທດ: {{ item.foreigninvestorFlag ? 'ມີ' : 'ບໍ່ມີ' }}</div>
                      </div>
                    </v-tooltip>
                  </td>

                  <td>
                    <v-tooltip location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          class="bg-light-blue-darken-4 select-btn"
                          @click="showDetails(item)"
                          size="small"
                          v-bind="props"
                          :disabled="!consentGiven"
                        >
                          ເລືອກ
                        </v-btn>
                      </template>
                      <span>{{ consentGiven ? 'ກົດເພື່ອເບິ່ງລາຍລະອຽດ ແລະ ພິມບົດລາຍງານ' : 'ກະລຸນາຢືນຢັນການອະນຸຍາດກ່ອນ' }}</span>
                    </v-tooltip>
                  </td>
                </tr>
              </tbody>
            </v-table>

            
            <div class="consent-section">
              <v-card class="consent-card" elevation="2">
                <v-card-text>
                  <div class="d-flex align-start">
                    <v-checkbox
                      v-model="consentGiven"
                      color="primary"
                      class="consent-checkbox"
                    ></v-checkbox>
                    <div class="consent-text">
                      <div class="consent-title">
                        <v-icon color="warning" class="mr-2">mdi-shield-check</v-icon>
                        <strong>ຢືນຢັນການໄດ້ຮັບອານຸຍາດແລະຢີນຍອມຈາກເຈົ້າຂອງຂໍ້ມູນ</strong>
                      </div>
                      <p class="consent-description">
                        ຂ້າພະເຈົ້າຢືນຢັນວ່າໄດ້ຮັບການຍິນຍອມເປີດເຜີຍຂໍ້ມູນຈາກເຈົ້າຂອງຂໍ້ມູນແລ້ວ 
                        ແລະ ຮັບຮູ້ວ່າການນໍາໃຊ້ຂໍ້ມູນນີ້ຈະເປັນໄປຕາມກົດໝາຍທີ່ກ່ຽວຂ້ອງ
                      </p>
                       <p class="fee-info">
                        ຖ້າຢືນຢັນເອົາບົດລາຍງານນີ້ແມ່ນຈະໄດ້ເສຍຄ່າທຳນຽມ: 
                        <b class="fee-amount">
                          {{ dataFee.length > 0 && dataFee[0].chg_amount 
                            ? new Intl.NumberFormat("lo-LA").format(dataFee[0].chg_amount) + " ກີບ"
                            : "ກຳລັງໂຫຼດຂໍ້ມູນຄ່າທຳນຽມ..." }}
                        </b>
                      </p>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </div>

            <div
              v-if="investorNames && investorNames.length > 0"
              class="investor-section"
            >
              <h3 class="investor-title">ນັກລົງທຶນທີ່ກ່ຽວຂ້ອງ:</h3>
              <v-tooltip
                v-for="(name, index) in investorNames"
                :key="index"
                location="bottom"
              >
                <template v-slot:activator="{ props }">
                  <v-chip
                    class="ma-1 investor-chip"
                    color="primary"
                    variant="outlined"
                    v-bind="props"
                  >
                    {{ truncateText(name, 20) }}
                  </v-chip>
                </template>
                <span>{{ name }}</span>
              </v-tooltip>
            </div>
          </div>

          <div v-else class="no-data-container">
            <v-icon size="64" color="grey">mdi-database-search</v-icon>
            <p class="no-data-text">ບໍ່ພົບຂໍ້ມູນທີ່ຕ້ອງການ</p>
            <p class="no-data-subtitle">ກະລຸນາກວດສອບລະຫັດທີ່ໃສ່ເຂົ້າມາ</p>
          </div>
        </div>
      </v-card>
    </v-container>
  </div>
</template>

<style scoped>
/* Import Lao fonts */
@import url("https://fonts.googleapis.com/css2?family=Noto+Sans+Lao:wght@400;500;600;700&display=swap");

/* Global font setting */
* {
  font-family: "Noto Sans Lao", "Phetsarath OT", sans-serif;
}

/* Title styling */
.main-title {
  font-size: 24px;
  font-weight: 600;
  color: #1a237e;
  margin-top: 40px;
  margin-bottom: 30px;
}

/* Loading */
.loading-container {
  text-align: center;
  padding: 40px;
}

.loading-text {
  font-size: 18px;
  color: #666;
}

/* Info line styling */
.info-line {
  font-size: 14px;
  color: #d32f2f;
}

.info-value {
  color: black !important;
  font-weight: 600;
}

/* Table styling */
.data-table {
  margin-top: 20px;
  border-radius: 8px;
  overflow: hidden;
}

.table-data {
  font-size: 13px;
  color: #333;
  text-align: center;
  padding: 6px;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Tooltip text styling */
.tooltip-text {
  cursor: help;
  border-bottom: 1px dotted #666;
}

.tooltip-text:hover {
  background-color: #f5f5f5;
}

.select-btn {
  font-size: 12px;
  min-width: 60px;
}

.select-btn:disabled {
  opacity: 0.5;
}

/* Consent section styling */
.consent-section {
  margin: 20px 0;
}

.consent-card {
  background: linear-gradient(135deg, #fff3cd 0%, #fef9e7 100%);
  border: 1px solid #ffeaa7;
  border-radius: 12px;
}

.consent-checkbox {
  flex-shrink: 0;
  margin-top: -5px;
}

.consent-text {
  flex: 1;
  margin-left: 10px;
}

.consent-title {
  display: flex;
  align-items: center;
  color: #856404;
  font-size: 16px;
  margin-bottom: 8px;
}

.consent-description {
  color: #856404;
  line-height: 1.6;
  margin: 0;
  font-size: 14px;
}

/* Investor section */
.investor-section {
  margin-top: 30px;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.investor-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
}

.investor-chip {
  font-size: 12px;
  cursor: help;
}

/* No data styling */
.no-data-container {
  text-align: center;
  padding: 60px 20px;
}

.no-data-text {
  font-size: 18px;
  color: #666;
  margin-top: 16px;
  margin-bottom: 8px;
}

.no-data-subtitle {
  font-size: 14px;
  color: #999;
}

@media (max-width: 768px) {
  .table-data {
    font-size: 12px;
    max-width: 100px;
  }

  .main-title {
    font-size: 20px;
  }

  .consent-text {
    margin-left: 5px;
  }

  .consent-title {
    font-size: 14px;
  }

  .consent-description {
    font-size: 13px;
  }
}
</style>