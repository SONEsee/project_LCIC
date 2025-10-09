<template>
  <v-row class="justify-center">
    <!-- Water Bill Card -->
    <v-col cols="12" sm="6" md="4" lg="3">
      <v-card class="d-flex flex-column fill-height" elevation="3">
        <v-card-title class="text-h6 mt-5 text-center">
          ບິນ ນໍ້າປະປາ
        </v-card-title>
        <v-card-text>
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
          <v-btn 
            block 
            color="primary" 
            :disabled="!month" 
            @click="downloadJSON"
            :loading="loading.waterBill"
          >
            ດາວໂຫລດ ບິນນໍ້າປະປາ
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>

    <!-- Water Customer Card -->
    <v-col cols="12" sm="6" md="4" lg="3">
      <v-card class="d-flex flex-column fill-height" elevation="3">
        <v-card-title class="text-h6 text-center mt-5">
          ລູກຄ້າ ນໍ້າປະປາ
        </v-card-title>
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
            @blur="validateCustomerMonthYear"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn
            block
            color="info"
            :disabled="!customerMonth"
            @click="downloadCustomerInfo"
            :loading="loading.waterCustomer"
          >
            ດາວໂຫລດ ລູກຄ້ານໍ້າປະປາ
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>

    <!-- Electric Bill Card -->
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
          <v-card elevation="3">
            <v-card-title class="text-center text-h6 mt-3">
              ບິນ ໄຟຟ້າ
            </v-card-title>
            <v-card-text>
              <v-select
                density="compact"
                variant="outlined"
                v-model="selectedProvince"
                :items="provinces"
                item-title="pro_name"
                item-value="pro_id"
                label="ເລືອກແຂວງ"
                outlined
                dense
              />
              <v-select
                density="compact"
                variant="outlined"
                v-model="selectedDistrict"
                :items="districts"
                item-title="dis_name"
                item-value="dis_id"
                label="ເລືອກເມືອງ"
                outlined
                dense
                :disabled="!selectedProvince"
              />
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
                label="ໜ້າ"
                type="number"
                variant="outlined"
                clearable
                prepend-icon="mdi-book-open"
              />
              <v-text-field
                density="compact"
                v-model="limit"
                label="ຈຳນວນ"
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
                :disabled="!selectedProvince || !selectedDistrict || !dateRequest"
                @click="downloadJSONWithParams"
                :loading="loading.electricBill"
              >
                ດາວໂຫລດ ບິນໄຟຟ້າ
              </v-btn>
            </v-card-actions>
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
        <v-card-title class="text-h6 mt-5 text-center">
          ລູກຄ້າ ໄຟຟ້າ
        </v-card-title>
        <v-card-text class="flex-grow-1">
          <v-select
            density="compact"
            variant="outlined"
            v-model="cus_selectedProvince"
            :items="cus_provinces"
            item-title="pro_name"
            item-value="pro_id"
            label="ເລືອກແຂວງ"
            outlined
            dense
          />
          <v-select
            density="compact"
            variant="outlined"
            v-model="cus_selectedDistrict"
            :items="cus_districts"
            item-title="dis_name"
            item-value="dis_id"
            label="ເລືອກເມືອງ"
            outlined
            dense
            :disabled="!cus_selectedProvince"
          />
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
            label="ໜ້າ"
            type="number"
            variant="outlined"
            clearable
            prepend-icon="mdi-book-open"
          />
          <v-text-field
            density="compact"
            v-model="cus_limit"
            label="ຈຳນວນ"
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
            :disabled="!cus_selectedProvince || !cus_selectedDistrict || !cus_dateRequest"
            @click="downloadCusJSONWithParams"
            :loading="loading.electricCustomer"
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
import { ref, watch } from "vue";
import AutoDownload from "./AutoDownload.vue";

definePageMeta({
  middleware: "auth",
  layout: "backend",
});

useHead({
  title: "Manage Downloads",
});

// ============ CONFIGURATION ============
const config = useRuntimeConfig();
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6IlUyRnNkR1ZrWDErdE9ja29vVDV0NXdqWlBqTzhVc0V1ZnR2QytPUXp3Z2ljWkFPdkhNUkNqdzh0NUhOSENBRVZsVXVNWHBrc1RudUFxaUE3R0VtVExRSTZMaWNTVUlaN1BMb0xGOVczMWtjWnFoQmxFUThHVUFwSFpNS0NDVjN1RURhWDJSSjFwZDNqaFRGc2lmdUF3Zz09IiwiaWF0IjoxNzA5MDEwNjU0fQ.mhmfUuasPQnAtxTQmwIyofClMuOAKVKZloNskpG9fHo";

// ============ STATE ============
const step = ref(1);
const loading = ref({
  waterBill: false,
  waterCustomer: false,
  electricBill: false,
  electricCustomer: false
});

// Water Bill & Customer
const month = ref("");
const customerMonth = ref("");

// Electric Bill
const provinces = ref([]);
const districts = ref([]);
const selectedProvince = ref("");
const selectedDistrict = ref("");
const dateRequest = ref("");
const page = ref("");
const limit = ref("");

// Electric Customer
const cus_provinces = ref([]);
const cus_districts = ref([]);
const cus_selectedProvince = ref("");
const cus_selectedDistrict = ref("");
const cus_dateRequest = ref("");
const cus_page = ref("");
const cus_limit = ref("");

// ============ DATA MAPPING FUNCTIONS ============
const mapCustomerDataForImport = (apiData) => {
  const currentDate = new Date().toISOString();
  
  return apiData.map(customer => ({
    ID: customer.NO || null,
    Customer_ID: customer.CUSTOMER_ID || null,
    Company_Name: customer.COMPANY_NAME || null,
    Given_Name: customer.NAME || null,
    Family_Name: customer.SURNAME || null,
    ID_NO: customer.NATIONAL_ID || null,
    Passport_No: customer.PASSPORT || null,
    AddressInfo: customer.ADDRESS || null,
    DistrictID: customer.DISTRICT_ID || null,
    ProvinceID: customer.PROVINCE_ID || null,
    Tel_No: customer.TEL || null,
    Email_No: customer.EMAIL || null,
    Supply_Type: customer.CONSUMER_TYPE || null,
    InsertDate: customer.REGISTER_DATE ? new Date(customer.REGISTER_DATE).toISOString() : currentDate,
    UpdateDate: currentDate,
    UserID: null
  }));
};

// ============ FETCH FUNCTIONS ============
const fetchProvinces = async () => {
  try {
    const { data } = await useFetch(`${config.public.strapi.url}api/province-edl/`);
    provinces.value = data.value || [];
  } catch (error) {
    console.error("Error fetching provinces:", error);
    Swal.fire({
      title: "ຜິດພາດ!",
      text: "ບໍ່ສາມາດດຶງຂໍ້ມູນແຂວງໄດ້",
      icon: "error",
      confirmButtonColor: "#d33",
    });
  }
};

const fetchDistricts = async (pro_id) => {
  try {
    if (!pro_id) {
      districts.value = [];
      return;
    }
    const { data } = await useFetch(`${config.public.strapi.url}api/province-district/${pro_id}/`);
    districts.value = data.value?.districts || [];
  } catch (error) {
    console.error("Error fetching districts:", error);
  }
};

const fetchCusProvinces = async () => {
  try {
    const { data } = await useFetch(`${config.public.strapi.url}api/province-edl/`);
    cus_provinces.value = data.value || [];
  } catch (error) {
    console.error("Error fetching customer provinces:", error);
  }
};

const fetchCusDistricts = async (pro_id) => {
  try {
    if (!pro_id) {
      cus_districts.value = [];
      return;
    }
    const { data } = await useFetch(`${config.public.strapi.url}api/province-district/${pro_id}/`);
    cus_districts.value = data.value?.districts || [];
  } catch (error) {
    console.error("Error fetching customer districts:", error);
  }
};

// ============ DOWNLOAD FUNCTIONS ============
const fetchAndDownload = async (url, filename, loadingKey) => {
  try {
    loading.value[loadingKey] = true;
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Auth: token,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);

    Swal.fire({
      title: "ສຳເລັດ!",
      text: `ດາວໂຫລດ ${filename} ສຳເລັດແລ້ວ`,
      icon: "success",
      confirmButtonColor: "#3085d6",
      timer: 3000
    });
  } catch (error) {
    console.error("Error:", error);
    Swal.fire({
      title: "ຜິດພາດ!",
      text: "ບໍ່ສາມາດດາວໂຫລດຂໍ້ມູນໄດ້",
      icon: "error",
      confirmButtonColor: "#d33",
    });
  } finally {
    loading.value[loadingKey] = false;
  }
};

const fetchAndDownloadMapped = async (url, filename, mapFunction, loadingKey) => {
  try {
    loading.value[loadingKey] = true;
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Auth: token,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    let data = result.message || result.data || result;
    
    if (mapFunction && Array.isArray(data)) {
      data = mapFunction(data);
    }
    
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);

    Swal.fire({
      title: "ສຳເລັດ!",
      text: `ດາວໂຫລດ ${filename} ສຳເລັດແລ້ວ (${data.length} ລາຍການ)`,
      icon: "success",
      confirmButtonColor: "#3085d6",
      timer: 3000
    });
  } catch (error) {
    console.error("Download error:", error);
    Swal.fire({
      title: "ຜິດພາດ!",
      text: error.message || "ບໍ່ສາມາດດາວໂຫລດຂໍ້ມູນໄດ້",
      icon: "error",
      confirmButtonColor: "#d33",
    });
  } finally {
    loading.value[loadingKey] = false;
  }
};

const fetchAndDownloadEDL = async (url, filename, loadingKey) => {
  try {
    loading.value[loadingKey] = true;
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);

    Swal.fire({
      title: "ສຳເລັດ!",
      text: `ດາວໂຫລດ ${filename} ສຳເລັດແລ້ວ`,
      icon: "success",
      confirmButtonColor: "#3085d6",
      timer: 3000
    });
  } catch (error) {
    console.error("Error:", error);
    Swal.fire({
      title: "ຜິດພາດ!",
      text: "ບໍ່ສາມາດດາວໂຫລດຂໍ້ມູນໄດ້",
      icon: "error",
      confirmButtonColor: "#d33",
    });
  } finally {
    loading.value[loadingKey] = false;
  }
};

// ============ VALIDATION FUNCTIONS ============
const onlyMonthYear = (event) => {
  const regex = /^[0-9/-]*$/;
  if (!regex.test(event.key)) {
    event.preventDefault();
  }
};

const validateMonthYear = () => {
  const pattern = /^(0[1-9]|1[0-2])\d{4}$/;
  if (month.value && !pattern.test(month.value)) {
    Swal.fire({
      title: "ຮູບແບບບໍ່ຖືກຕ້ອງ!",
      text: "ກະລຸນາປ້ອນເດືອນປີໃນຮູບແບບ MMYYYY (ຕົວຢ່າງ: 122024)",
      icon: "warning",
      confirmButtonColor: "#d33",
    });
    month.value = "";
  }
};

const validateCustomerMonthYear = () => {
  const pattern = /^(0[1-9]|1[0-2])\d{4}$/;
  if (customerMonth.value && !pattern.test(customerMonth.value)) {
    Swal.fire({
      title: "ຮູບແບບບໍ່ຖືກຕ້ອງ!",
      text: "ກະລຸນາປ້ອນເດືອນປີໃນຮູບແບບ MMYYYY (ຕົວຢ່າງ: 122024)",
      icon: "warning",
      confirmButtonColor: "#d33",
    });
    customerMonth.value = "";
  }
};

// ============ ACTION FUNCTIONS ============
const downloadJSON = () => {
  if (!month.value) return;
  const apiUrl = `http://202.137.141.244:3000/v3/api/loans/allbillmonth/${month.value}`;
  fetchAndDownload(apiUrl, `water-bill-${month.value}.json`, 'waterBill');
};

const downloadCustomerInfo = () => {
  if (!customerMonth.value) return;
  const apiUrl = `http://202.137.141.244:3000/v3/api/loans/newconnection/${customerMonth.value}`;
  fetchAndDownloadMapped(
    apiUrl, 
    `water-customers-${customerMonth.value}.json`,
    mapCustomerDataForImport,
    'waterCustomer'
  );
};

const downloadJSONWithParams = () => {
  if (!selectedProvince.value || !selectedDistrict.value || !dateRequest.value) return;
  
  const apiUrl = `https://edl-inside-api.edl.com.la/api_v1/wattmonitor-bol/billing-svc/billing/getpaymenthistory?province_code=${selectedProvince.value}&district_code=${selectedDistrict.value}&dateRequest=${dateRequest.value}&page=${page.value || 1}&limit=${limit.value || 10}`;
  
  fetchAndDownloadEDL(
    apiUrl,
    `electric-bill-${selectedProvince.value}-${selectedDistrict.value}-${dateRequest.value}.json`,
    'electricBill'
  );
};

const downloadCusJSONWithParams = () => {
  if (!cus_selectedProvince.value || !cus_selectedDistrict.value || !cus_dateRequest.value) return;
  
  const apiUrl = `https://edl-inside-api.edl.com.la/api_v1/wattmonitor-bol/billing-svc/billing/getCustomerInfo?province_code=${cus_selectedProvince.value}&district_code=${cus_selectedDistrict.value}&dateRequest=${cus_dateRequest.value}&page=${cus_page.value || 1}&limit=${cus_limit.value || 10}`;
  
  fetchAndDownloadEDL(
    apiUrl,
    `electric-customer-${cus_selectedProvince.value}-${cus_selectedDistrict.value}-${cus_dateRequest.value}.json`,
    'electricCustomer'
  );
};

// ============ WATCHERS ============
watch(selectedProvince, (newProvince) => {
  fetchDistricts(newProvince);
  selectedDistrict.value = "";
});

watch(cus_selectedProvince, (newProvince) => {
  fetchCusDistricts(newProvince);
  cus_selectedDistrict.value = "";
});

// ============ INITIALIZATION ============
fetchProvinces();
fetchCusProvinces();
</script>

<style scoped>
.v-container {
  background-color: #f8f9fa;
}

.v-card {
  border-radius: 12px;
  transition: transform 0.2s ease-in-out;
}

.v-card:hover {
  transform: translateY(-2px);
}
</style>