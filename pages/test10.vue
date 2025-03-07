<template>
  <v-container>
    <v-row class="justify-center">
      <!-- Water Bill Card -->
      <v-col cols="12" sm="6" md="4" lg="3">
        <v-card class="pa-5 d-flex flex-column fill-height" elevation="3">
          <v-card-title class="text-h6 text-center">ບິນ ນໍ້າປະປາ</v-card-title>
          <v-card-text class="flex-grow-1">
            <v-text-field 
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

      <!-- Customer Info Card -->
      <v-col cols="12" sm="6" md="4" lg="3">
        <v-card class="pa-5 d-flex flex-column fill-height" elevation="3">
          <v-card-title class="text-h6 text-center">ລູກຄ້າ ນໍ້າປະປາ</v-card-title>
          <v-card-text class="flex-grow-1">
            <v-text-field 
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
            <v-btn block color="info" :disabled="!customerMonth" @click="downloadCustomerInfo">
              ດາວໂຫລດ ລູກຄ້ານໍ້າປະປາ
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <!-- Electric Bill Card -->
      <v-col cols="12" sm="6" md="4" lg="3">
        <v-card class="pa-5 d-flex flex-column fill-height" elevation="3">
          <v-card-title class="text-h6 text-center">ບິນ ໄຟຟ້າ</v-card-title>
          <v-card-text class="flex-grow-1">
            <v-text-field v-model="province_code" label="ລະຫັດຂວາງ" variant="outlined" clearable prepend-icon="mdi-map-marker" />
            <v-text-field v-model="district_code" label="ລະຫັດເມືອງ" variant="outlined" clearable prepend-icon="mdi-map-marker-radius" />
            <v-text-field v-model="dateRequest" label="ປ້ອນຂໍ້ມູນ ປີເດືອນ (YYYYMM)" variant="outlined" clearable prepend-icon="mdi-calendar" placeholder="YYYYMM" />
            <v-text-field v-model="page" label="Page" type="number" variant="outlined" clearable prepend-icon="mdi-book-open" />
            <v-text-field v-model="limit" label="Limit" type="number" variant="outlined" clearable prepend-icon="mdi-format-list-numbered" />
          </v-card-text>
          <v-card-actions>
            <v-btn block color="success" class="mt-2" :disabled="!province_code || !district_code || !dateRequest" @click="downloadJSONWithParams">
              ດາວໂຫລດ ລູກຄ້າໄຟຟ້າ
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <!-- Electric Customers Card -->
      <v-col cols="12" sm="6" md="4" lg="3">
        <v-card class="pa-5 d-flex flex-column fill-height" elevation="3">
          <v-card-title class="text-h6 text-center">ລູກຄ້າ ໄຟຟ້າ</v-card-title>
          <v-card-text class="flex-grow-1">
            <v-text-field v-model="cus_province_code" label="ລະຫັດຂວາງ" variant="outlined" clearable prepend-icon="mdi-map-marker" />
            <v-text-field v-model="cus_district_code" label="ລະຫັດເມືອງ" variant="outlined" clearable prepend-icon="mdi-map-marker-radius" />
            <v-text-field v-model="cus_dateRequest" label="ປ້ອນຂໍ້ມູນ ປີເດືອນ (YYYYMM)" variant="outlined" clearable prepend-icon="mdi-calendar" placeholder="YYYYMM" />
            <v-text-field v-model="cus_page" label="Page" type="number" variant="outlined" clearable prepend-icon="mdi-book-open" />
            <v-text-field v-model="cus_limit" label="Limit" type="number" variant="outlined" clearable prepend-icon="mdi-format-list-numbered" />
          </v-card-text>
          <v-card-actions>
            <v-btn block color="success" class="mt-2" :disabled="!cus_province_code || !cus_district_code || !cus_dateRequest" @click="downloadCusJSONWithParams">
              ດາວໂຫລດ ລູກຄ້າໄຟຟ້າ
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import Swal from 'sweetalert2';
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

definePageMeta({
  middleware: "auth",
  layout: "backend",
});

useHead({
  title: "Manage Users",
});

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6IlUyRnNkR1ZrWDErdE9ja29vVDV0NXdqWlBqTzhVc0V1ZnR2QytPUXp3Z2ljWkFPdkhNUkNqdzh0NUhOSENBRVZsVXVNWHBrc1RudUFxaUE3R0VtVExRSTZMaWNTVUlaN1BMb0xGOVczMWtjWnFoQmxFUThHVUFwSFpNS0NDVjN1RURhWDJSSjFwZDNqaFRGc2lmdUF3Zz09IiwiaWF0IjoxNzA5MDEwNjU0fQ.mhmfUuasPQnAtxTQmwIyofClMuOAKVKZloNskpG9fHo';
const month = ref('');
// EDL_BILL
const customerMonth = ref('');
const province_code = ref('');
const district_code = ref('');
const dateRequest = ref('');
const page = ref('');
const limit = ref('');
// EDL_Customer
const cus_province_code = ref('');
const cus_district_code = ref('');
const cus_dateRequest = ref('');
const cus_page = ref('');
const cus_limit = ref('');



const fetchAndDownload = async (url, filename) => {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Auth': `${token}`,
        'Content-Type': 'application/json',
      },
    });

    
    if (!response.ok) throw new Error('Failed to fetch data');

    const data = await response.json();
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });

    const link = document.createElement('a');
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
    console.error('Error:', error);
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
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    
    if (!response.ok) throw new Error('Failed to fetch data');

    const data = await response.json();
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });

    const link = document.createElement('a');
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
    console.error('Error:', error);
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
  if (!province_code.value || !district_code.value || !dateRequest.value) return;
  const apiUrl = `https://edl-inside-api.edl.com.la/api_v1/wattmonitor-bol/billing-svc/billing/getpaymenthistory?province_code=${province_code.value}&district_code=${district_code.value}&dateRequest=${dateRequest.value}&page=${page.value || 1}&limit=${limit.value || 10}`;
  fetchAndDownloadEDL(apiUrl, `electric-bill-${province_code.value}-${district_code.value}-${dateRequest.value}.json`);
};

const downloadCusJSONWithParams = () => {
  if (!cus_province_code.value || !cus_district_code.value || !cus_dateRequest.value) return;
  const apiUrl = `https://edl-inside-api.edl.com.la/api_v1/wattmonitor-bol/billing-svc/billing/getCustomerInfo?province_code=${cus_province_code.value}&district_code=${cus_district_code.value}&dateRequest=${cus_dateRequest.value}&page=${cus_page.value || 1}&limit=${cus_limit.value || 10}`;
  fetchAndDownloadEDL(apiUrl, `electric-bill-${cus_province_code.value}-${cus_district_code.value}-${cus_dateRequest.value}.json`);
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
