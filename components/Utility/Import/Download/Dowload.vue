<template>
  <v-row class="justify-center">
    <v-col cols="12" sm="6" md="4" lg="3">
      <v-card class="d-flex flex-column fill-height" elevation="3">
        <v-card-title class="text-h6 mt-5 text-center"
          >ບິນ ນໍ້າປະປາ</v-card-title
        >
        <v-card-text class="">
          <v-text-field
            density="compact"
            v-model="month"
            label="ປ້ອນຂໍ້ມູນ ເດືອນປີ (MMYYYY)"
            variant="outlined"
            clearable
            prepend-icon="mdi-calendar"
            placeholder="MM-YYYY"
            @keypress="onlyMonthYear"
            @blur="validateMonthYear"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn block color="primary" :disabled="!month" @click="downloadJSON">
            ດາວໂຫລດ ບິນນໍ້າປະປາ
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>

    <v-col cols="12" sm="6" md="4" lg="3">
      <v-card class="d-flex flex-column fill-height" elevation="3">
        <v-card-title class="text-h6 text-center mt-5"
          >ລູກຄ້າ ນໍ້າປະປາ</v-card-title
        >
        <v-card-text class="flex-grow-1">
          <v-text-field
            density="compact"
            v-model="customerMonth"
            label="ປ້ອນຂໍ້ມູນ ເດືອນປີ (MMYYYY)"
            variant="outlined"
            clearable
            prepend-icon="mdi-calendar"
            placeholder="MM-YYYY"
            @keypress="onlyMonthYear"
            @blur="validateCustomerMonthYear(customerMonth)"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn
            block
            color="info"
            :disabled="!customerMonth"
            @click="downloadCustomerInfo"
          >
            ດາວໂຫລດ ລູກຄ້ານໍ້າປະປາ
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>

    <v-col cols="12" sm="6" md="4" lg="3">
      <v-card-actions>
        <v-btn v-if="step > 1" color="primary" variant="flat" @click="step--">
          ດາວໂຫຼດເທື່ອລະເມືອງ
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn v-if="step < 2" color="primary" variant="flat" @click="step++">
          ດາວໂຫຼດຂໍ້ມູນໄຟຟ້າຫຼາຍເມືອງພອ້ມກັນ
        </v-btn>
      </v-card-actions>

      <v-window v-model="step">
        <v-window-item :value="1">
          <v-card class="" elevation="">
            <v-card-text>
              <v-card-title class="text-center">ບິນ ໄຟຟ້າ</v-card-title>
              <v-card-text>
                <v-select
                  density="compact"
                  variant="outlined"
                  v-model="selectedProvince"
                  :items="provinces"
                  item-title="pro_name"
                  item-value="pro_id"
                  label="Select Province"
                  outlined
                  dense
                ></v-select>
                <v-select
                  density="compact"
                  variant="outlined"
                  v-model="selectedDistrict"
                  :items="districts"
                  item-title="dis_name"
                  item-value="dis_id"
                  label="Select District"
                  outlined
                  dense
                  :disabled="!selectedProvince"
                ></v-select>
                <v-text-field
                  density="compact"
                  v-model="dateRequest"
                  label="ປ້ອນຂໍ້ມູນ ປີເດືອນ (YYYYMM)"
                  variant="outlined"
                  clearable
                  prepend-icon="mdi-calendar"
                  placeholder="YYYYMM"
                />
                <v-text-field
                  density="compact"
                  v-model="page"
                  label="Page"
                  type="number"
                  variant="outlined"
                  clearable
                  prepend-icon="mdi-book-open"
                />
                <v-text-field
                  density="compact"
                  v-model="limit"
                  label="Limit"
                  type="number"
                  variant="outlined"
                  clearable
                  prepend-icon="mdi-format-list-numbered"
                />
              </v-card-text>
              <v-card-actions>
                <v-btn
                  block
                  color="success"
                  class="mt-2"
                  :disabled="
                    !selectedProvince || !selectedDistrict || !dateRequest
                  "
                  @click="downloadJSONWithParams"
                >
                  ດາວໂຫລດ ບິນໄຟຟ້າ
                </v-btn>
              </v-card-actions>
            </v-card-text>
          </v-card>
        </v-window-item>

        <v-window-item :value="2">
          <v-card-text>
            <AutoDownload />
          </v-card-text>
        </v-window-item>
      </v-window>
    </v-col>

    <!-- Electric Customers Card -->
    <v-col cols="12" sm="6" md="4" lg="3">
      <v-card class="d-flex flex-column fill-height" elevation="3">
        <v-card-title class="text-h6 mt-5 text-center"
          >ລູກຄ້າ ໄຟຟ້າ</v-card-title
        >
        <v-card-text class="flex-grow-1">
          <!-- <v-text-field v-model="cus_province_code" label="ລະຫັດຂວາງ" variant="outlined" clearable prepend-icon="mdi-map-marker" />
            <v-text-field v-model="cus_district_code" label="ລະຫັດເມືອງ" variant="outlined" clearable prepend-icon="mdi-map-marker-radius" /> -->
          <v-select
            density="compact"
            variant="outlined"
            v-model="cus_selectedProvince"
            :items="cus_provinces"
            item-title="pro_name"
            item-value="pro_id"
            label="Select Province"
            outlined
            dense
          ></v-select>
          <v-select
            density="compact"
            variant="outlined"
            v-model="cus_selectedDistrict"
            :items="cus_districts"
            item-title="dis_name"
            item-value="dis_id"
            label="Select District"
            outlined
            dense
            :disabled="!cus_selectedProvince"
          ></v-select>
          <v-text-field
            density="compact"
            v-model="cus_dateRequest"
            label="ປ້ອນຂໍ້ມູນ ປີເດືອນ (YYYYMM)"
            variant="outlined"
            clearable
            prepend-icon="mdi-calendar"
            placeholder="YYYYMM"
          />
          <v-text-field
            density="compact"
            v-model="cus_page"
            label="Page"
            type="number"
            variant="outlined"
            clearable
            prepend-icon="mdi-book-open"
          />
          <v-text-field
            density="compact"
            v-model="cus_limit"
            label="Limit"
            type="number"
            variant="outlined"
            clearable
            prepend-icon="mdi-format-list-numbered"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn
            block
            color="success"
            class="mt-2"
            :disabled="
              !cus_selectedProvince || !cus_selectedDistrict || !cus_dateRequest
            "
            @click="downloadCusJSONWithParams"
          >
            ດາວໂຫລດ ລູກຄ້າໄຟຟ້າ
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import Swal from "sweetalert2";
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import AutoDownload from "./AutoDownload.vue";

definePageMeta({
  middleware: "auth",
  layout: "backend",
});
const step = ref(1);

useHead({
  title: "Manage Users",
});

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6IlUyRnNkR1ZrWDErdE9ja29vVDV0NXdqWlBqTzhVc0V1ZnR2QytPUXp3Z2ljWkFPdkhNUkNqdzh0NUhOSENBRVZsVXVNWHBrc1RudUFxaUE3R0VtVExRSTZMaWNTVUlaN1BMb0xGOVczMWtjWnFoQmxFUThHVUFwSFpNS0NDVjN1RURhWDJSSjFwZDNqaFRGc2lmdUF3Zz09IiwiaWF0IjoxNzA5MDEwNjU0fQ.mhmfUuasPQnAtxTQmwIyofClMuOAKVKZloNskpG9fHo";
const month = ref("");
// EDL_BILL
const customerMonth = ref("");
// const province_code = ref('');
// const district_code = ref('');
const dateRequest = ref("");
const page = ref("");
const limit = ref("");
// EDL_Customer
const cus_province_code = ref("");
const cus_district_code = ref("");
const cus_dateRequest = ref("");
const cus_page = ref("");
const cus_limit = ref("");

const provinces = ref([]); // Store list of provinces
const districts = ref([]); // Store list of districts
const selectedProvince = ref(""); // Selected province
const selectedDistrict = ref(""); // Selected district

const cus_provinces = ref([]); // Store list of provinces
const cus_districts = ref([]); // Store list of districts
const cus_selectedProvince = ref(""); // Selected province
const cus_selectedDistrict = ref(""); // Selected district
const config = useRuntimeConfig();
// Fetch all provinces on component mount
const fetchProvinces = async () => {
  try {
    console.log("Fetching provinces..."); // Log before fetch
    const { data } = await useFetch(
      `${config.public.strapi.url}api/province-edl/`
    );
    provinces.value = data.value || [];
    console.log("Provinces fetched:", provinces.value); // Log after fetch

    // If you want to see the raw API response:
    console.log("Raw API response:", data.value);
  } catch (error) {
    console.error("Error fetching provinces:", error);
  }
};

// Fetch districts when province changes
const fetchDistricts = async (pro_id) => {
  try {
    console.log("Fetching districts for province:", pro_id); // Log province ID
    if (!pro_id) {
      districts.value = [];
      console.log("No province selected, cleared districts");
      return;
    }
    const { data } = await useFetch(
      `${config.public.strapi.url}api/province-district/${pro_id}/`
    );
    districts.value = data.value?.districts || [];
    console.log("Districts fetched:", districts.value); // Log after fetch

    // If you want to see the raw API response:
    console.log("Raw districts API response:", data.value);
  } catch (error) {
    console.error("Error fetching districts:", error);
  }
};

const fetchCusProvinces = async () => {
  try {
    console.log("Fetching Cus provinces..."); // Log before fetch
    const { data } = await useFetch(
      `${config.public.strapi.url}api/province-edl/`
    );
    cus_provinces.value = data.value || [];
    console.log("Cus Provinces fetched:", cus_provinces.value); // Log after fetch

    // If you want to see the raw API response:
    console.log("Raw API response:", data.value);
  } catch (error) {
    console.error("Error fetching Cus provinces:", error);
  }
};
// Fetch districts when province changes
const fetchCusDistricts = async (pro_id) => {
  try {
    console.log("Fetching Cus districts for province:", pro_id); // Log province ID
    if (!pro_id) {
      cus_districts.value = [];
      console.log("No Cus province selected, cleared districts");
      return;
    }
    const { data } = await useFetch(
      `${config.public.strapi.url}api/province-district/${pro_id}/`
    );
    cus_districts.value = data.value?.districts || [];
    console.log("Cus Districts fetched:", cus_districts.value); // Log after fetch

    // If you want to see the raw API response:
    console.log("Raw Cus districts API response:", data.value);
  } catch (error) {
    console.error("Error Cus fetching districts:", error);
  }
};

watch(cus_selectedProvince, (newProvince) => {
  console.log("Cus Province changed to:", newProvince); // Log province change
  fetchCusDistricts(newProvince);
});
watch(cus_districts, (newDistricts) => {
  console.log("Cus Districts updated:", newDistricts);
});

// Initial fetch
console.log("Initializing component...");
fetchProvinces();

watch(selectedProvince, (newProvince) => {
  console.log("Province changed to:", newProvince); // Log province change
  fetchDistricts(newProvince);
});
watch(districts, (newDistricts) => {
  console.log("Districts updated:", newDistricts);
});

// Initial fetch
console.log("Initializing component...");
fetchCusProvinces();

// const provinces = ref([]) // Store list of provinces
// const districts = ref([])  // Store list of districts
// const selectedProvince = ref('') // Selected province
// const selectedDistrict = ref('') // Selected district

// // Fetch all provinces on component mount
// const fetchProvinces = async () => {
//   try {
//     const { data } = await useFetch('http://192.168.45.56:8000/api/province-edl/')
//     provinces.value = data.value || []
//   } catch (error) {
//     console.error('Error fetching provinces:', error)
//   }
// }

// // Fetch districts when province changes
// const fetchDistricts = async (pro_id) => {
//   try {
//     if (!pro_id) {
//       districts.value = []
//       return
//     }
//     const { data } = await useFetch(`http://192.168.45.56:8000/api/province-district/${pro_id}/`)
//     districts.value = data.value?.districts || []
//   } catch (error) {
//     console.error('Error fetching districts:', error)
//   }
// }

// watch(selectedProvince, (newProvince) => {
//   fetchDistricts(newProvince)
// })
// fetchProvinces()

const fetchAndDownload = async (url, filename) => {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Auth: `${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Failed to fetch data");

    const data = await response.json();
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    Swal.fire({
      title: "Success!",
      text: `${filename} downloaded successfully.`,
      icon: "success",
      confirmButtonColor: "#3085d6",
    });
  } catch (error) {
    console.error("Error:", error);
    Swal.fire({
      title: "Error!",
      text: "Failed to download data. Please try again.",
      icon: "error",
      confirmButtonColor: "#d33",
    });
  }
};

const fetchAndDownloadEDL = async (url, filename) => {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Failed to fetch data");

    const data = await response.json();
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    Swal.fire({
      title: "Success!",
      text: `${filename} downloaded successfully.`,
      icon: "success",
      confirmButtonColor: "#3085d6",
    });
  } catch (error) {
    console.error("Error:", error);
    Swal.fire({
      title: "Error!",
      text: "Failed to download data. Please try again.",
      icon: "error",
      confirmButtonColor: "#d33",
    });
  }
};

const onlyMonthYear = (event) => {
  const regex = /^[0-9/-]*$/;
  if (!regex.test(event.key)) {
    event.preventDefault();
  }
};

const validateMonthYear = () => {
  const pattern = /^(0[1-9]|1[0-2])\d{4}$/;
  if (!pattern.test(month.value)) {
    Swal.fire({
      title: "Invalid Format!",
      text: "Please enter a valid month in MMYYYY format (e.g., 122024).",
      icon: "warning",
      confirmButtonColor: "#d33",
    });
    month.value = "";
  }
};
const validateCustomerMonthYear = () => {
  const pattern = /^(0[1-9]|1[0-2])\d{4}$/;
  if (!pattern.test(customerMonth.value)) {
    Swal.fire({
      title: "Invalid Format!",
      text: "Please enter a valid month in YYYYMM format (e.g., 202412).",
      icon: "warning",
      confirmButtonColor: "#d33",
    });
    customerMonth.value = "";
  }
};
// const validateMonthYear = (monthValue) => {
//   const pattern = /^(0[1-9]|1[0-2])\d{4}$/;
//   if (!pattern.test(monthValue.value)) {
//     Swal.fire({
//       title: "Invalid Format!",
//       text: "Please enter a valid month in MM-YYYY format (e.g., 08-2023).",
//       icon: "warning",
//       confirmButtonColor: "#d33",
//     });
//     monthValue.value = "";
//   }
// };

const downloadJSON = () => {
  if (!month.value) return;
  const apiUrl = `http://202.137.141.244:3000/v3/api/loans/allbillmonth/${month.value}`;
  fetchAndDownload(apiUrl, `water-bill-${month.value}.json`);
};

const downloadJSONWithParams = () => {
  if (!selectedProvince.value || !selectedDistrict.value || !dateRequest.value)
    return;
  const apiUrl = `https://edl-inside-api.edl.com.la/api_v1/wattmonitor-bol/billing-svc/billing/getpaymenthistory?province_code=${
    selectedProvince.value
  }&district_code=${selectedDistrict.value}&dateRequest=${
    dateRequest.value
  }&page=${page.value || 1}&limit=${limit.value || 10}`;
  fetchAndDownloadEDL(
    apiUrl,
    `electric-bill-${selectedProvince.value}-${selectedDistrict.value}-${dateRequest.value}.json`
  );
};

// const downloadJSONWithParams = () => {
//   if (!selectedProvince.value || !selectedDistrict.value || !dateRequest.value) {
//     console.error('Missing required fields');
//     return;
//   }

//   const apiUrl = `https://edl-inside-api.edl.com.la/api_v1/wattmonitor-bol/billing-svc/billing/getpaymenthistory?province_code=${selectedProvince.value}&district_code=${selectedDistrict.value}&dateRequest=${dateRequest.value}&page=${page.value || 1}&limit=${limit.value || 10}`;

//   fetchAndDownloadEDL(apiUrl, `electric-bill-${selectedProvince.value}-${selectedDistrict.value}-${dateRequest.value}.json`);
// };

const downloadCusJSONWithParams = () => {
  if (
    !cus_selectedProvince.value ||
    !cus_selectedDistrict.value ||
    !cus_dateRequest.value
  )
    return;
  const apiUrl = `https://edl-inside-api.edl.com.la/api_v1/wattmonitor-bol/billing-svc/billing/getCustomerInfo?province_code=${
    cus_selectedProvince.value
  }&district_code=${cus_selectedDistrict.value}&dateRequest=${
    cus_dateRequest.value
  }&page=${cus_page.value || 1}&limit=${cus_limit.value || 10}`;
  fetchAndDownloadEDL(
    apiUrl,
    `electric-bill-${cus_selectedProvince.value}-${cus_selectedDistrict.value}-${cus_dateRequest.value}.json`
  );
};

const downloadCustomerInfo = () => {
  if (!customerMonth.value) return;
  const apiUrl = `http://202.137.141.244:3000/v3/api/loans/newconnection/${customerMonth.value}`;
  fetchAndDownload(apiUrl, `customer-info-${customerMonth.value}.json`);
};
</script>

<style>
.v-container {
  background-color: #f8f9fa;
}

.v-card {
  border-radius: 12px;
}
</style>
