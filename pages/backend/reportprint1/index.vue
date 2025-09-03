<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { LoCationStore } from "~/stores/location";
import { LocationStore } from "~/stores/locationService";
const location = LoCationStore();
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
interface LonClassHistory {
  id: number;
  id_file: string;
  lcicID: string;
  period: string;
  product_type: string;
  com_enterprise_code: string;
  segmentType: string;
  bnk_code: string;
  customer_id: string;
  branch_id: string;
  lon_sys_id: string;
  loan_id: string;
  lon_open_date: string;
  lon_exp_date: string;
  lon_ext_date: null;
  lon_int_rate: number;
  lon_purpose_code: string;
  lon_credit_line: number;
  lon_currency_code: string;
  lon_outstanding_balance: number;
  lon_account_no: string;
  lon_no_days_slow: number;
  lon_class: string;
  lon_type: string;
  lon_term: string;
  lon_status: string;
  lon_insert_date: string;
  lon_update_date: null;
  lon_applied_date: null;
  user_id: string;
  is_disputed: number;
  LCIC_code: string;
  status_data: string;
  lon_expiry_date:string;
}

interface CollateralInfo {
  insert_date: string;
  col_id: string;
  col_type: string;
  [key: string]: any;
}

interface RelatedRecord {
  col_id: string;
  col_type: string;
  col_value?: number;
  land_no?: string;
  land_map_no?: string;
  col_area?: string;
  account_no?: string;
  account_type?: string;
  value?: number;
  machine_no?: string;
  machine_type?: string;
  project_number?: string;
  ministry?: string;
  plate_number?: string;
  engine_number?: string;
  gua_national_id?: string;
  gua_lao_name?: string;
  weight?: number;
  unit?: string;
  lon_expiry_date:string;
  gua_enterprise_code?: string;
  [key: string]: any;
}

interface CollateralHistory {
  col_type: string;
  collateral_info: CollateralInfo;
  related_record: RelatedRecord;
}

interface LoanDetail {
  id: string;
  lon_update_date: null;
  bank: string;
  lon_insert_date: string;
  lon_credit_line: number;
  lon_outstanding_balance: number;
  lon_currency_code: string;
  lon_no_days_slow: number;
  lon_class: string;
  period: string;
  lon_open_date: string;
  lon_exp_date: string;
  lon_ext_date: null;
  lon_int_rate: number;
  lon_purpose_code: string;
  lon_account_no: string;
  lon_status: string;
  lon_type: string;
  lon_term: string;
  is_disputed: number;
  lon_applied_date: null;
  lon_class_history: LonClassHistory[];
  collateral_history: CollateralHistory[];
  lon_expiry_date:string;
}

interface LocationResponse {
  LCICID: number;
  EnterpriseID: string;
  enterpriseNameLao: string;
  eneterpriseNameEnglish: string;
  regisCertificateNumber: string;
  regisDate: string;
  enLocation: string;
  regisStrationOfficeType: string;
  regisStationOfficeCode: string;
  enLegalStrature: string;
  foreigninvestorFlag: string;
  investmentAmount: number;
  status: number;
  investmentCurrency: string;
  representativeNationality: string;
  LastUpdate: string;
  CancellationDate: string;
  InsertDate: string;
  UpdateDate: string;
  LCIC_code: string;
  lon_expiry_date:string;
  id_file: null;
}

interface SearchHistoryItem {
  id: string;
  bnk_code: string;
  lon_purpose: string;
  [key: string]: any;
}

interface TableDataItem {
  bnk_code: string;
  loan_id: string;
  lon_open_date: string;
  lon_credit_line: number;
  lon_outstanding_balance: number;
  lon_currency_code: string;
  lon_expiry_date:string;
  lon_no_days_slow: number;
  lon_class: string;
  [key: string]: any;
}

interface UserData {
  nameE: string;
  MID: {
    code: string;
  };
  [key: string]: any;
}

interface HeaderItem {
  title: string;
  value: string;
}


const tableData = ref<TableDataItem[]>([]);
const loan_detail_inactive = ref<LoanDetail[]>([]);
const loan_detail_active = ref<LoanDetail[]>([]);
const search_history = ref<SearchHistoryItem[]>([]);
const user = ref<UserData | null>(null);
const enterpriseInfo = ref<LocationResponse | null>(null);
const invesInfo = ref<any>(null);
const loading = ref<boolean>(false);
const error = ref<string | null>(null);

const headers = ref<HeaderItem[]>([
  { title: "ສະມາຊິກ", value: "bnk_code" },
  { title: "Loan ID", value: "loan_id" },
  { title: "Loan Open Date", value: "lon_open_date" },
  { title: "Loan Credit Line", value: "lon_credit_line" },
  { title: "Outstanding Balance", value: "lon_outstanding_balance" },
  { title: "Loan Currency Code", value: "lon_currency_code" },
  { title: "Number of Days Slow", value: "lon_no_days_slow" },
  { title: "Loan Class", value: "lon_class" },
  { title: "Loan Status", value: "lon_status" },
]);

const mainHeaders = ref<HeaderItem[]>([
  { title: "ສະມາຊິກ", value: "bank" },
  { title: "Loan ID", value: "id" },
  { title: "Loan Open Date", value: "lon_open_date" },
  { title: "Loan Expiry Date", value: "lon_expiry_date" },
  { title: "Loan Credit Line", value: "lon_credit_line" },
  { title: "Outstanding Balance", value: "lon_outstanding_balance" },
  { title: "Currency Code", value: "lon_currency_code" },
  { title: "Loan Interest Rate", value: "lon_int_rate" },
  { title: "Loan Purpose Code", value: "lon_purpose_code" },
  { title: "Number of Days Slow", value: "lon_no_days_slow" },
  { title: "Loan Class", value: "lon_class" },
  { title: "Loan Type", value: "lon_type" },
  { title: "Loan Term", value: "lon_term" },
  { title: "Loan Status", value: "lon_status" },
]);

const subHeaders = ref<HeaderItem[]>([
  { title: "Period", value: "period" },
  { title: "Credit Line", value: "lon_credit_line" },
  { title: "Outstanding Balance", value: "lon_outstanding_balance" },
  { title: "Number of Days Slow", value: "lon_no_days_slow" },
  { title: "Currency Code", value: "lon_currency_code" },
  { title: "Loan Class", value: "lon_class" },
  { title: "Loan Status", value: "lon_status" },
]);

const subHeaders_collteral = ref<HeaderItem[]>([
  { title: "col_id", value: "col_id" },
  { title: "col_type", value: "col_type" },
  { title: "colleteral_info", value: "related_record.col_value" },
]);

const realEstateHeaders = ref<HeaderItem[]>([
  { title: "Collateral ID", value: "related_record.col_id" },
  { title: "Collateral Type", value: "related_record.col_type" },
  { title: "Land No", value: "related_record.land_no" },
  { title: "Land Map Number", value: "related_record.land_map_no" },
  { title: "Value", value: "related_record.col_value" },
]);

const moneyMiaHeaders = ref<HeaderItem[]>([
  { title: "Collateral ID", value: "related_record.col_id" },
  { title: "Collateral Type", value: "related_record.col_type" },
  { title: "Account No", value: "related_record.account_no" },
  { title: "Account Type", value: "related_record.account_type" },
  { title: "Value", value: "related_record.value" },
]);

const equipmentHeaders = ref<HeaderItem[]>([
  { title: "Collateral ID", value: "related_record.col_id" },
  { title: "Collateral Type", value: "related_record.col_type" },
  { title: "Machine No", value: "related_record.machine_no" },
  { title: "Machine Type", value: "related_record.machine_type" },
  { title: "Value", value: "related_record.value" },
]);

const projectHeaders = ref<HeaderItem[]>([
  { title: "Collateral ID", value: "related_record.col_id" },
  { title: "Collateral Type", value: "related_record.col_type" },
  { title: "Ministry Name", value: "related_record.ministry" },
  { title: "Project No", value: "related_record.project_number" },
  { title: "Value", value: "related_record.value" },
]);

const vehicleHeaders = ref<HeaderItem[]>([
  { title: "Collateral ID", value: "related_record.col_id" },
  { title: "Collateral Type", value: "related_record.col_type" },
  { title: "Plate No", value: "related_record.plate_number" },
  { title: "Engine No", value: "related_record.engine_number" },
  { title: "Value", value: "related_record.value" },
]);

const guarantorHeaders = ref<HeaderItem[]>([
  { title: "Collateral ID", value: "related_record.col_id" },
  { title: "Collateral Type", value: "related_record.col_type" },
  { title: "National ID", value: "related_record.national_id" },
  { title: "Guarantor Name", value: "related_record.surname_english" },
  { title: "Value", value: "related_record.value" },
]);

const goldsilverHeaders = ref<HeaderItem[]>([
  { title: "Collateral ID", value: "related_record.col_id" },
  { title: "Collateral Type", value: "related_record.col_type" },
  { title: "Weight", value: "related_record.weight" },
  { title: "Unit", value: "related_record.unit" },
  { title: "Value", value: "related_record.value" },
]);


const totalCreditLine = computed(() => {
  return tableData.value.reduce((sum, item) => sum + (item.lon_credit_line || 0), 0);
});

const totalOutstandingBalance = computed(() => {
  return tableData.value.reduce((sum, item) => sum + (item.lon_outstanding_balance || 0), 0);
});

const formattedRegistrationDate = computed(() => {
  if (!enterpriseInfo.value?.regisDate) return '--';
  return formatDate(enterpriseInfo.value.regisDate);
});

const recentSearchHistory = computed(() => {
  return search_history.value.slice(-12);
});


const formatAmount = (amount: number | null | undefined): string => {
  if (!amount || amount === 0) return "-";
  return new Intl.NumberFormat("lo-LA").format(amount);
};

const formatDate = (dateString: string): string => {
  if (!dateString) return '--';
  try {
   
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
    
      return dateString.slice(0, 10);
    }
    return date.toLocaleDateString('lo-LA');
  } catch (error) {
    return dateString.slice(0, 10);
  }
};

const formatPeriod = (period: string): string => {
  if (!period || period.length < 6) return period;
  return period.slice(0, 4) + '-' + period.slice(4);
};

const getCollateralTypeName = (colType: string): string => {
  const types: { [key: string]: string } = {
    'c2.1': 'ດີນ',
    'C2.1': 'ດີນ',
    'c2.2': 'ເອກະສານມີຄ່າ',
    'C2.2': 'ເອກະສານມີຄ່າ',
    'c2.3': 'ເຄື່ອງຈັກ',
    'C2.3': 'ເຄື່ອງຈັກ',
    'c2.4': 'ໂຄງການ',
    'C2.4': 'ໂຄງການ',
    'c2.5': 'ຍານພາຫະນະ',
    'C2.5': 'ຍານພາຫະນະ',
    'c2.6': 'ບຸກຄົນຄໍ້າ',
    'C2.6': 'ບຸກຄົນຄໍ້າ',
    'c2.7': 'ຄໍາ/ເງີນ',
    'C2.7': 'ຄໍາ/ເງີນ',
  };
  return types[colType] || colType;
};


const getCols = (length: number): number => {
  switch (length) {
    case 1:
      return 12;
    case 2:
      return 6;
    case 3:
      return 4;
    case 4:
      return 3;
    default:
      return 3;
  }
};

const getCols1 = (length: number): number => {
  switch (length) {
    case 1:
      return 6;
    case 2:
      return 6;
    case 3:
      return 4;
    case 4:
      return 2;
    default:
      return 2;
  }
};

const getCollateralHeaders = (col_type: string): HeaderItem[] => {
  switch (col_type.toLowerCase()) {
    case "c2.1":
      return realEstateHeaders.value;
    case "c2.2":
      return moneyMiaHeaders.value;
    case "c2.3":
      return equipmentHeaders.value;
    case "c2.4":
      return projectHeaders.value;
    case "c2.5":
      return vehicleHeaders.value;
    case "c2.6":
      return guarantorHeaders.value;
    case "c2.7":
      return goldsilverHeaders.value;
    default:
      return subHeaders_collteral.value;
  }
};


const fetchData = async (enterpriseID: string, LCIC_code: string): Promise<void> => {
  if (!enterpriseID || !LCIC_code) {
    error.value = "ຂາດຂໍ້ມູນ EnterpriseID ຫຼື LCIC_code";
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    const config = useRuntimeConfig();
    const response = await fetch(
      `${config.public.strapi.url}api/report/?EnterpriseID=${enterpriseID}&LCIC_code=${LCIC_code}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
  
    tableData.value = Array.isArray(data.loan_info) ? data.loan_info : [];
    loan_detail_inactive.value = Array.isArray(data.inactive_loans) ? data.inactive_loans : [];
    loan_detail_active.value = Array.isArray(data.active_loans) ? data.active_loans : [];
    search_history.value = Array.isArray(data.search_history) ? data.search_history : [];
    
    console.log("Search history:", search_history.value);


    if (data.enterprise_info) {
      if (Array.isArray(data.enterprise_info) && data.enterprise_info.length > 0) {
        enterpriseInfo.value = data.enterprise_info[0] as LocationResponse;
      } else if (typeof data.enterprise_info === 'object') {
        enterpriseInfo.value = data.enterprise_info as LocationResponse;
      }
    }

 
    if (data.inves_info) {
      if (Array.isArray(data.inves_info) && data.inves_info.length > 0) {
        invesInfo.value = data.inves_info[0];
      } else {
        invesInfo.value = data.inves_info;
      }
    }

    console.log("Fetched enterprise_info:", enterpriseInfo.value);
    console.log("Fetched inves_info:", invesInfo.value);
    console.log("Fetched loan_detail:", loan_detail_active.value);
    
  } catch (err) {
    console.error("Error occurred while fetching data:", err);
    error.value = err instanceof Error ? err.message : "ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນ";
  } finally {
    loading.value = false;
  }
};


const print = (): void => {
  window.print();
};

const goBack = (): void => {
  window.history.back();
};


const route = useRoute();

onMounted(async () => {
  const enterpriseID = route.query.EnterpriseID as string;
  const LCIC_code = route.query.LCIC_code as string;
  location.GetLocation()
  

  try {
    const userData = localStorage.getItem("user_data");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      user.value = parsedUser;
      console.log("User data:", user.value);
    }
  } catch (err) {
    console.error("Error parsing user data:", err);
  }

  
  await fetchData(enterpriseID, LCIC_code);
});

const enterpriseLocation = computed(() => {
  if (!enterpriseInfo.value?.enLocation || !dataLocation.value.length) {
    return null;
  }

 
  const locationId = parseInt(enterpriseInfo.value.enLocation);
  
 
  const location = dataLocation.value.find(loc => loc.ID === locationId);
  
  return location || null;
});


const fullAddress = computed(() => {
  const location = enterpriseLocation.value;
  if (!location) {
    return enterpriseInfo.value?.enLocation ? `Location ID: ${enterpriseInfo.value.enLocation}` : '--';
  }

 
  return `${location.Village_Name}, ${location.District_Name}, ${location.Province_Name}`;
});


const addressComponents = computed(() => {
  const location = enterpriseLocation.value;
  if (!location) {
    return {
      village: '--',
      district: '--',
      province: '--',
      full: enterpriseInfo.value?.enLocation ? `Location ID: ${enterpriseInfo.value.enLocation}` : '--'
    };
  }

  return {
    village: location.Village_Name || '--',
    district: location.District_Name || '--', 
    province: location.Province_Name || '--',
    full: `ບ້ານ ${location.Village_Name}, ເມືອງ ${location.District_Name}, ແຂວງ ${location.Province_Name}`,
    locationId: location.ID,
    provId: location.Prov_ID,
    dstrId: location.Dstr_ID,
    villId: location.Vill_ID
  };
});


const debugLocationMapping = () => {
  console.log('Enterprise enLocation:', enterpriseInfo.value?.enLocation);
  console.log('Available locations:', dataLocation.value);
  console.log('Matched location:', enterpriseLocation.value);
  console.log('Full address:', fullAddress.value);
};
</script>
<template>
  
  <v-container><div 
    class="rounded-lg"
  :style="{
    border:'1px #2979FF solid'
    
  }">
    
  <pre>{{ addressComponents }}</pre>
    <v-col cols="12">
      <section class="pa-5" id="main-content">
        <div>
          <v-btn class="button" to="../backend/searchuser">
            <v-icon icon="mdi-arrow-left" style="font-size: 150%"></v-icon>
          </v-btn>
        </div>
        <div class="text-end mt-5 button">
          <v-btn @click="print" class="bg-indigo-accent-4">
            <v-icon icon="mdi-printer-outline"></v-icon> ພີມ
          </v-btn>
        </div>

        <v-row>
          <v-col cols="8"  class="text-center">
            <div>
              <v-row align="center">
                <v-col cols="auto">
                  <v-img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQguq0YjU42M_ijrBwnE9IpgFAFeMZQCDDJVi3yrfOCog&s"
                    width="70"
                  ></v-img>
                </v-col>
                <v-col>
                  <div class="row-content text-start float-left">
                    <h4>ບໍລິສັດ ຂໍ້ມູນຂ່າວສານສິນເຊື່ອເເຫ່ງ ສປປ ລາວ</h4>
                    <hr>
                    <h4>Lao Credit Information Company</h4>
                  </div>
                </v-col>
              </v-row>
            </div>
          </v-col>
          <v-col cole="12"  class="text-end mt-4">
            <div class=""  v-if="enterpriseInfo">
              <p>ລະຫັດວິສາຫະກິດ: <b>{{ enterpriseInfo.EnterpriseID }}</b></p>
              
              <p>ລະຫັດຂສລ: <b>{{ enterpriseInfo.LCIC_code}}</b></p>
            </div>
            <div class="" v-if="user">
              <p style="">ຜູ້ສອບຖາມ: <b> {{ user.nameE }}</b> ຈາກທະນາຄານ: <b>{{ user.MID?.code }}</b></p>
            </div>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <div class="text-center">
              <h3 class="text-md mt-5">
                <b>ບົດລາຍງານສິນເຊື່ອຄົບຖວ້ນ(ສໍາລັບນິຕິບຸກຄົນ)</b>
              </h3>
            </div>
          </v-col>
        </v-row>
      
      </section></v-col
    >
    <v-col cols="12">
<div class="rounded-lg"

>


      <p ><b> - ຂໍ້ມູນທົວໄປຜູ້ກູ້</b></p>
      <div :style="{
        border:'1px #2979FF solid'
      }"
      class="rounded-lg">
     <v-row class="mt-2 mb-1 ml-1 mr-1">
      <v-col cols="4" v-if="enterpriseInfo" >
        <!-- {{ enterpriseInfo }} -->
        <p><b>ຊື່ວິສາຫະກິດ:</b> {{ enterpriseInfo.enterpriseNameLao }}</p>
        <!-- <p><b>ຊື່ວິສາຫະກິດ:</b> {{ enterpriseInfo.regisStrationOfficeType }}</p> -->
        <p><b>ເລກທີ:</b>---------</p>
      </v-col>
      <v-col cols="4" v-if="enterpriseInfo">
<p><b>ວັນທີອອກໃບທະບຽນ:</b> {{ enterpriseInfo.regisDate.slice(0, -18) }}</p>
<p><b>ທີ່ຕັ້ງວິສາຫະກິດ:</b> {{ enterpriseInfo.enLocation }}</p>
<p><b>ພາກສວນເສດຖະກິດ:</b> --</p>
      </v-col>
      <v-col cols="4" v-if="enterpriseInfo">
        <p><b >ທຶນຈົດທະບຽນ:</b> {{Number( enterpriseInfo.investmentAmount).toLocaleString() }} <b v-if="enterpriseInfo.investmentCurrency">{{ enterpriseInfo.investmentCurrency }}</b></p>
      
        <p><b>ຊື່ເຈົ້າຂອງວິສາຫະກິດ:</b> --</p>
      </v-col>
     </v-row></div>
</div>


    </v-col>


<p><b>- ຂໍ້ມູນປະຫວັດການເຂົ້າຄົ້ນຫາ</b></p>
<div
class="rounded-lg"
 :style="{
  border:'1px #2979FF solid'
}">
    <v-table>
      <thead>
        <tr>
          <th>ລຳດັບ</th>
          <th>ວັນເດືອນທີ່ຄົ້ນຫາ</th>
          <th>ຜູ້ຄົ້ນຫາ</th>
          <th>ເຫດຜົນການຄົ້ນຫາ</th>
          <th>ປະເພດເງິນກູ້</th>
        </tr>
      </thead>
      <tbody>
    <tr v-for="(item, index) in search_history.slice(-12)" :key="index">
    
        <td>{{ index + 1 }}</td>
        <td>{{ item.id.slice(0, -11) }}</td>
        <td>{{ item.bnk_code }}</td>
        <td>{{ item.lon_purpose }}</td>
        <td>--</td>
    </tr>
</tbody>
    </v-table></div>
    <v-col cols="12" >
      <p><b>- ລວມວົງເງິນກູ້ທີ່ເຄື່ອນໄຫວທັງໝົດ</b></p>
      <v-table class="mt-5 elevation-1 v-data-table1 rouded-lg"  :style="{
        border:'1px #2979FF solid'
      }">
  <thead 
  
  >
    <tr style="font-size: 90%;  " class="text-bold" >
  
      <th ><b>ສະມາຊິກ</b></th>
      <th><b> ລະຫັດເງິນກູ້</b></th>
      <th><b>ມືເປີດ</b></th>
      <th>ວົງເງິນກູ້</th>
      <th>ຍອດເງິນເຫຼືອ</th>
      <th>ສະກຸນເງິນ</th>
      <th>ຈຳນວນວັນຄ້າງຈ່າຍ</th>
      <th>ປະເພດ</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="(item, index) in tableData" :key="index">
      <td>{{ item.bnk_code }}</td>
      <td>{{ item.loan_id }}</td>
      <td>{{ item.lon_open_date.slice(0, -15) }}</td>
      <td>{{Number( item.lon_credit_line).toLocaleString() }}</td>
      <td>{{Number( item.lon_outstanding_balance).toLocaleString() }}</td>
      
      <td>{{ item.lon_currency_code }}</td>
      <td>{{ item.lon_no_days_slow }}</td>
      <td>{{ item.lon_class }}</td>

 
    </tr>
    
  </tbody>
</v-table>

  
    </v-col>






    
    <p><b>-ລາຍລະອຽດຂໍ້ມູນເງິນກູ້</b></p>
    
    <v-col cols="12">
      <v-row>
        <v-col cols="12">
          <v-row>
            <v-col
             
              class="mt-2"
              v-for="(item, index) in loan_detail_active"
              :key="index"
            >
              <div
                class="ml-1 rounded-lg"
                style="border: 1px solid #1565c0; padding: 10px"
              >

                <div>
                  
                  <p>
                    <b>- ຂໍ້ມູນລາຍລະອຽດເງິນກູ້ບວ້ງທີ {{ index + 1 }}</b>
                  </p>
                  <v-col cols="12">
                    <v-row>
                      <v-col cols="4" md="4" >
                        <!-- {{ item }} -->
                        <p> <b>ລະຫັດເງິນກູ້: </b>{{ item.id }}</p>
                        <p> <b>ມື້ເປິດເງິນກູ້: </b>{{ item.lon_open_date.slice(0, -10) }}</p>
                        <p> <b>ມື້ໝົດສັນຍາເງິນກູ້ເງິນກູ້: </b>{{ item.lon_expiry_date }}</p>
                      </v-col>
                      <v-col cols="4" md="4">
                        <p> <b>ໄລຍະການກູ້ຢືມ:</b> {{ item.lon_term }}</p>
                        <p> <b>ວົງເງິນໃນອານຸມັດ:</b> {{ item.lon_credit_line.toLocaleString() }} {{  item.lon_currency_code }}</p>
                        <p> <b>ອັດຕາດອກເບ້ຍ:</b> {{ item.lon_int_rate }}</p>
                      </v-col>
                      <v-col cols="4" md="4">
                        <p><b>ຍອດເງິນເຫຼືອຕົ້ນທຶນ:</b> {{ Number(item.lon_outstanding_balance).toLocaleString() }} {{  item.lon_currency_code }}</p>
                        <p><b>ເຫດຜົນຫການສິ້ນສຸດໜີ້:</b> -- </p>

                      </v-col>
                    </v-row>

                  </v-col>

                  <hr
                    color="indigo"
                    model-value="100"
                    rounded
                  ></hr>

                  <v-col cols="12">
                    <p v-if="item.collateral_history.length">
                      <b>- ຂໍ້ມູນຫຼັກຊັບຄໍ້າປະກັນ</b>
                    </p>
                    <v-row>
                      <v-col
                        v-for="(collateral, index) in item.collateral_history"
                        class="mt-2"
                        
                        style="font-size: 80%"
                        :cols="getCols(item.collateral_history ? item.collateral_history.length : 1)"
                      >
                        <div
                          style="border: #1565c0 1px solid; padding: 10px"
                          class="rounded-lg"
                        >
                          <v-col cols="12">
                            <div
                              v-if="
                                collateral.col_type === 'C2.1' ||
                                collateral.col_type === 'c2.1'
                              "
                            >
                              <p>
                                ລົງຂໍ້ມູນວັນທີ:
                                <b>{{
                                  new Date(collateral.collateral_info.insert_date).toLocaleDateString()
                                }}</b>
                              </p>
                              <p>ປະເພດຫຼັກຊັບ:<b>ດີນ</b></p>

                              <p>
                                ເລກທີໃບຕາດິນ:<b>{{
                                  collateral.related_record.land_no
                                }}</b>
                              </p>
                              <p>
                                ເລກທີແຜ່ນທີຶ:<b>{{
                                  collateral.related_record.land_map_no
                                }}</b>
                              </p>
                              <p>
                                ເນື້ອທີ:<b>{{
                                  collateral.related_record.col_area
                                }}</b>
                              </p>
                            </div>
                            <div
                              v-else-if="
                                collateral.col_type === 'C2.2' ||
                                collateral.col_type === 'c2.2'
                              "
                            >
                              <p>
                                ລົງຂໍ້ມູນວັນທີ:
                                <b>{{
                                  new Date(collateral.collateral_info.insert_date).toLocaleDateString()
                                }}</b>
                              </p>
                              <p>ປະເພດຫຼັກຊັບ:<b>ເອກະສານມີຄ່າ</b></p>

                              <p>
                                ເລກເຈົ້າຂອງບັນຊີ:<b>{{
                                  collateral.related_record.account_no
                                }}</b>
                              </p>
                              <p>
                                ປະເພດບັນຊີ:<b>{{
                                  collateral.related_record.account_type
                                }}</b>
                              </p>
                              <p>
                                ມູນຄ່າ:<b>{{
                                  collateral.related_record.value
                                }}</b>
                              </p>
                            </div>
                            <div
                              v-else-if="
                                collateral.col_type === 'C2.3' ||
                                collateral.col_type === 'c2.3'
                              "
                            >
                              <p>
                                ລົງຂໍ້ມູນວັນທີ:
                                <b>{{
                                  new Date(collateral.collateral_info.insert_date).toLocaleDateString()
                                }}</b>
                              </p>
                              <p>ປະເພດຫຼັກຊັບ:<b>ເຄື່ອງຈັກ</b></p>

                              <p>
                                ປະເພດເຄື່ອງຈັກ:<b>{{
                                  collateral.related_record.machine_type
                                }}</b>
                              </p>
                              <p>
                                ເລກທີເຄື່ອງຈັກ:<b>{{
                                  collateral.related_record.machine_no
                                }}</b>
                              </p>
                              <p>
                                ມູນຄ່າ:<b>{{
                                  collateral.related_record.value
                                }}</b>
                              </p>
                            </div>
                            <div
                              v-else-if="
                                collateral.col_type === 'C2.4' ||
                                collateral.col_type === 'c2.4'
                              "
                            >
                              <p>
                                ລົງຂໍ້ມູນວັນທີ:
                                <b>{{
                                  new Date(collateral.collateral_info.insert_date).toLocaleDateString()
                                }}</b>
                              </p>
                              <p>ປະເພດຫຼັກຊັບ:<b>ໂຄງການ</b></p>

                              <p>
                                ຊື່ໂຄງການ:<b>{{
                                  collateral.related_record.project_number
                                }}</b>
                              </p>
                              <p>
                                ເລກທີໂຄງການ:<b>{{
                                  collateral.related_record.machine_type
                                }}</b>
                              </p>
                              <p>
                                ມູນຄ່າ:<b>{{
                                  collateral.related_record.value
                                }}</b>
                              </p>
                            </div>
                            <div
                              v-else-if="
                                collateral.col_type === 'C2.5' ||
                                collateral.col_type === 'c2.5'
                              "
                            >
                              <p>
                                ລົງຂໍ້ມູນວັນທີ:
                                <b>{{
                                  new Date(collateral.collateral_info.insert_date).toLocaleDateString()
                                }}</b>
                              </p>
                              <p>ປະເພດຫຼັກຊັບ:<b>ຍານພາຫະນະ</b></p>

                              <p>
                                ເລກທະບຽນພາຫະນະ:<b>{{
                                  collateral.related_record.plate_number
                                }}</b>
                              </p>
                              <p>
                                ເລກຈັກ:<b>{{
                                  collateral.related_record.engine_number
                                }}</b>
                              </p>
                              <p>
                                ມູນຄ່າ:<b>{{
                                  collateral.related_record.value
                                }}</b>
                              </p>
                            </div>
                            <div
                              v-else-if="
                                collateral.col_type === 'C2.6' ||
                                collateral.col_type === 'c2.6'
                              "
                            >
                              <p>
                                ລົງຂໍ້ມູນວັນທີ:
                                <b>{{
                                  new Date(collateral.collateral_info.insert_date).toLocaleDateString()
                                }}</b>
                              </p>
                              <p>ປະເພດຫຼັກຊັບ:<b>ບຸກຄົນຄໍ້າ</b></p>

                              <p>
                                ເລກບັດປະຈຳຕົວຂອງຜູ້ຄໍ້າປະກັນ:<b>{{
                                  collateral.related_record.gua_national_id
                                }}</b>
                              </p>
                              <p>
                                ຊື່ແທ້:<b>{{
                                  collateral.related_record.gua_lao_name
                                }}</b>
                              </p>
                              <p>
                                ມູນຄ່າ:<b>{{
                                  collateral.related_record.value
                                }}</b>
                              </p>
                            </div>
                            <div
                              v-else-if="
                                collateral.col_type === 'C2.7' ||
                                collateral.col_type === 'c2.7'
                              "
                            >
                              <p>
                                ລົງຂໍ້ມູນວັນທີ:
                                <b>{{
                                  new Date(collateral.collateral_info.insert_date).toLocaleDateString()
                                }}</b>
                              </p>
                              <p>ປະເພດຫຼັກຊັບ:<b>ຄໍາ</b></p>

                              <p>
                                ລະຫັດຂອງຫຼັກຊັບຄໍ້າປະກັນ:<b>{{
                                  collateral.related_record.col_id
                                }}</b>
                              </p>
                              <p>
                                ນໍ້າໜັກ:<b>{{
                                  collateral.related_record.weight
                                }}</b>
                              </p>
                              <p>
                                ມູນຄ່າ:<b>{{
                                  collateral.related_record.value
                                }}</b>
                              </p>
                            </div>
                            <div
                              v-else-if="
                                collateral.col_type === 'C2.7' ||
                                collateral.col_type === 'c2.7'
                              "
                            >
                              <p>
                                ລົງຂໍ້ມູນວັນທີ:
                                <b>
                                  {{
                                    new Date(collateral.collateral_info.insert_date).toLocaleDateString()
                                  }}
                                </b>
                              </p>
                              <p>ປະເພດຫຼັກຊັບ:<b>ຄໍາ</b></p>

                              <p>
                                ລະຫັດຂອງຫຼັກຊັບຄໍ້າປະກັນ:<b>{{
                                  collateral.related_record.col_id
                                }}</b>
                              </p>
                              <p>
                                ລະຫັດວິສາຫະກິດ:<b>{{
                                  collateral.related_record.gua_enterprise_code
                                }}</b>
                              </p>
                              <p>
                                ມູນຄ່າ:<b>{{
                                  collateral.related_record.value
                                }}</b>
                              </p>
                            </div>
                          </v-col>
                        </div>
                      </v-col>
                    </v-row>
                  </v-col>
                </div>
                <div>
                  <hr v-if="item.collateral_history.length"
                    color="indigo"
                    model-value="100"
                    rounded
                  ></hr>
                  <p v-if="item.lon_class_history.length">
                    <b>- ປະຫວັດການຊຳລະ</b>
                  </p>
                  <v-table>
                    <thead>
                      <tr>
                        <th>ລຳດັບ.</th>
                        <th>ເດືອນ ,ວັນ</th>
                        <th>ວົງເງິນກູ້</th>
                        <th>ຍອດຍັງເຫຼືອ</th>
                        <th>ຈຳນວນວັນຈ່າຍຊ້າ</th>
                        <th>ສະກຸນເງິນ</th>
                        <th>ປະເພດເງິນກູ້</th>
                        <th>ສະຖານະ</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(items  , index)  in item.lon_class_history">
                        <td>{{index +1}}</td>
                        <td>{{ items.period.slice(0, 4) + '-' + item.period.slice(4) }}</td>
                        <td>{{Number( items.lon_credit_line).toLocaleString() }}</td>
                        <td>{{Number( items.lon_outstanding_balance).toLocaleString() }}</td>
                        <td>{{ items.lon_no_days_slow }}</td>
                        <td>{{ items.lon_currency_code }}</td>
                        <td>{{ items.lon_class }}</td>
                        <td>{{ items.lon_status }}</td>

                      </tr>
                    </tbody>
                  </v-table>
                  <!-- <v-data-table
                    v-if="
                      item.lon_class_history &&
                      item.lon_class_history.length > 0
                    "
                    :headers="subHeaders"
                    :items="item.lon_class_history"
                    class="elevation-0 custom-header-color"
                    hide-default-footer
                    dense
                  >
                    <template v-slot:header.period>
                      <th class="white--text">Period</th>
                    </template>
                    <template v-slot:header.lon_credit_line>
                      <th class="white--text">Credit Line</th>
                    </template>
                    <template v-slot:header.lon_outstanding_balance>
                      <th class="white--text">Outstanding Balance</th>
                    </template>
                    <template v-slot:header.lon_no_days_slow>
                      <th class="white--text">Outstanding Balance</th>
                    </template>
                    <template v-slot:header.lon_currency_code>
                      <th class="white--text">Outstanding Balance</th>
                    </template>
                    <template v-slot:header.lon_class>
                      <th class="white--text">Outstanding Balance</th>
                    </template>
                    <template v-slot:header.lon_status>
                      <th class="white--text">Outstanding Balance</th>
                    </template>
                  </v-data-table> -->
                </div>
              </div></v-col
            >
          </v-row>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" class="text-">
          <div style="border: #1565c0 1px solid; padding: 10px" class="bg-blue-darken-4 rounded-lg">
<v-col cols="12">
  <v-row>
    <v-col cols="6" >

<p> <v-icon icon="mdi-map-marker" style="font-size: 120%; color: red;"></v-icon> 2nd Floor, Lao Security Exchange Building Phonthan  Village, </p><p class="ml-5">Xaysettha District, Vientiane Capital</p>

    </v-col>
    <v-col cols="6"><p> <v-icon icon="mdi-phone" style="font-size: 100%;color: #1565c0;" class="mr-2"></v-icon>  Telephone: (856)-21-25429</p>
<p> <v-icon icon=" mdi-email-outline" style="font-size: 100%;" class="mr-2"></v-icon>  Email: info@lcic.com.la</p></v-col>
    
  </v-row>
</v-col>
          </div>
        </v-col>
      </v-row>
    </v-col></div></v-container>
</template>
<style scoped>
@page {
  size: A4 portrait;
  margin: 0;

  @bottom-center {
    width: 100%;
    content: element(footer);
  }
}

@media print {
  html,
  body {
    width: 210mm;
    height: 297mm;
    padding: 4px 10% 0 10%;
    background: fixed;
    background-image: fixed;
    font-size: 10pt !important;
  }
  h1, h2, h3, h4, h5, h6 {
      font-size: 11pt !important;
    }
    p, div, span, table {
      font-size: 10pt !important;
    }
.table {
  font-size: pt !important;
}
  .main-content {
    width: 210mm;
    height: 297mm;
    padding: 15px 3% 0 3%;
  }
  .v-data-table1 {
      font-size: 11pt !important;
    }

  .button {
    display: none;
  }
  /* div {
    page-break-inside: avoid;
    page-break-before: auto;
    page-break-after: auto;
  } */
  tr {
    page-break-inside: avoid;
    page-break-after: auto;
  }
  thead {
    display: table-header-group;
  }
  tfoot {
    display: table-footer-group;
  }
  .div.v-data-table__wrapper::-webkit-scrollbar {
      display: none;
    }
    .div.v-data-table__wrapper {
      -ms-overflow-style: none;  
      scrollbar-width: none;  
    }
}
</style>
