<!-- <script setup lang="ts">
import { IndividualCollateralStore } from '~/stores/collateral_individual';
const IndividualStore = IndividualCollateralStore()

</script>
<template>

</template> -->


<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { LoCationStore } from "~/stores/location";
import { LocationStore } from "~/stores/locationService";
import { useInvestorInfoStore } from "~/stores/investorinfo";
import { MemberStore} from "@/stores/memberinfo"
import { useMemberInfo } from "@/composables/memberInfo";
import { IndividualCollateralStore } from '~/stores/collateral_individual';
const IndividualStore = IndividualCollateralStore()
const investorStore = useInvestorInfoStore();
const { mapMemberInfo, getMemberName, getMemberDetails } = useMemberInfo();
const route = useRoute();
const Lcic_id = route.query.lcicID as string;
const type_id =route.query.type as string;
import dayjs from "dayjs";
const memberinfoStore = MemberStore();
const investorData = computed(()=>{
  const data = investorStore.response_data_investor;
  if(Array.isArray(data)){
    return data
  }
  if(data && typeof data ==="object"){
    return [data]
  }
  return []
})
const dataMemberInfon = computed(()=>{
  const data = memberinfoStore.respons_data_query;
  if(Array.isArray(data)){
    return data
  }
  if(data && typeof data==="object"){
    return [data]
  }
  return []
})
const loadin  = false;
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

interface LocationMapRespons {
    village:    string;
    district:   string;
    province:   string;
    full:       string;
    locationId: number;
    provId:     string;
    dstrId:     string;
    villId:     string;
}
// const tableData = ref<TableDataItem[]>([]);
const tableData = computed(()=>{
  const data = IndividualStore.report_individual_full_credit?.loan_info
  if(Array.isArray(data)){
    return data
  }
  if(data && typeof data){
    return [data]
  }
  return[]
})
const loan_detail_inactive = computed(()=>{
  const data = IndividualStore.report_individual_full_credit?.active_loans
  if(Array.isArray(data)){
    return data
  }
  if(data && typeof data){
    return [data]
  }
  return[]
})
const loan_detail_active = computed(()=>{
  const data = IndividualStore.report_individual_full_credit?.active_loans
  if(Array.isArray(data)){
    return data
  }
  if(data && typeof data){
    return [data]
  }
  return[]
})
const collateral_history = computed(()=>{
  const data = IndividualStore.report_individual_full_credit?.active_loans.collateral_history
  if(Array.isArray(data)){
    return data
  }
  if(data && typeof data){
    return [data]
  }
  return[]
})
const search_history = computed(()=>{
  const data = IndividualStore.report_individual_full_credit?.search_history
  if(Array.isArray(data)){
    return data
  }
  if(data && typeof data){
    return [data]
  }
  return[]
})
const enterpriseInfo = computed(()=>{
  const data = IndividualStore.report_individual_full_credit?.enterprise_info
  if(Array.isArray(data)){
    return data
  }
  if(data && typeof data){
    return [data]
  }
  return[]
})

// const loan_detail_inactive = ref<LoanDetail[]>([]);
// const loan_detail_active = ref<LoanDetail[]>([]);
// const search_history = ref<SearchHistoryItem[]>([]);
// const enterpriseInfo = ref<LocationResponse | null>(null);

const user = ref<UserData | null>(null);

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
  return tableData.value.reduce((sum, item) => {
    const creditLine = Number(item.lon_credit_line) || 0;
    return sum + creditLine;
  }, 0);
});

const totalOutstandingBalance = computed(() => {
return tableData.value.reduce((sum, item) => {
    const creditLine = Number(item.lon_outstanding_balance) || 0;
    return sum + creditLine;
  }, 0);
  // return tableData.value.reduce((sum, item) => sum + (item.lon_outstanding_balance || 0), 0);
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
    
  
    // tableData.value = Array.isArray(data.loan_info) ? data.loan_info : [];
    // loan_detail_inactive.value = Array.isArray(data.inactive_loans) ? data.inactive_loans : [];
    // loan_detail_active.value = Array.isArray(data.active_loans) ? data.active_loans : [];
    // search_history.value = Array.isArray(data.search_history) ? data.search_history : [];
    
    console.log("Search history:", search_history.value);


    if (data.enterprise_info) {
      if (Array.isArray(data.enterprise_info) && data.enterprise_info.length > 0) {
       
      } else if (typeof data.enterprise_info === 'object') {
        
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




onMounted(async () => {
  IndividualStore.report_query_individual.lcic_id = Lcic_id
  IndividualStore.report_query_individual.CatalogID = type_id
  IndividualStore.GetReportIndividual();
  
  const enterpriseID = route.query.EnterpriseID as string;
  const LCIC_code = route.query.LCIC_code as string;
  location.GetLocation()
  memberinfoStore.getMemberInfo();
investorStore.filter_enterprise.filter.q = enterpriseID 
investorStore.getDataInvestor()
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


const mapdatInfo1 = (memberinfo:string)=>{
  if(!memberinfo || !Array.isArray(dataMemberInfon.value)) return "-";
  const foundItem = dataMemberInfon.value.find((item)=> item.bnk_code === memberinfo);
  return foundItem ? `${foundItem.bnk_code}-${foundItem.code}` : memberinfo;
}


</script>
<template>
  
  <v-container><div 
    class="rounded-lg"
  :style="{
    border:'1px #2979FF solid'
    
  }">

  <!-- <pre>{{ enterpriseInfo }}</pre> -->
  <!-- <pre>{{ search_history }}</pre> -->
   <!-- <pre>{{ loan_detail_active }}</pre> -->
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
             
              
              <p>ລະຫັດຂສລ: <b>{{ enterpriseInfo[0]?.lcic_id}}</b></p>
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
                <b>ບົດລາຍງານສິນເຊື່ອຄົບຖວ້ນ</b>
              </h3>
              <h3><b>(ສໍາລັບບຸກຄົນ)</b></h3>
            </div>
          </v-col>
        </v-row>
      
      </section></v-col
    >
    <v-col cols="12">
<div class="rounded-lg"

>


      <p ><b> - ຂໍ້ມູນທົ່ວໄປ</b></p>
      <div :style="{
        border:'1px #2979FF solid'
      }"
      class="rounded-lg">
     <v-row class="mt-2 mb-1 ml-1 mr-1">
      <v-col cols="12" v-if="enterpriseInfo" >
        <div class="d-flex flex-wrap">
  <p style="width: 25%;">ຊື່(ລາວ): <b>{{ enterpriseInfo[0]?.ind_lao_name ?? 'ບໍ່ໄດ້ລະບຸ'}}</b></p>
  <p style="width: 25%;">ນາມສະກຸນ(ລາວ): <b>{{ enterpriseInfo[0]?.ind_lao_surname ?? 'ບໍ່ໄດ້ລະບຸ'}}</b></p>
  <p style="width: 25%;">ຊື່(ອັງກິດ): <b>{{ enterpriseInfo[0]?.ind_name ?? 'ບໍ່ໄດ້ລະບຸ'}}</b></p>
  <p style="width: 25%;">ນາມສະກຸນ(ອັງກິດ): <b>{{ enterpriseInfo[0]?.ind_surname ?? 'ບໍ່ໄດ້ລະບຸ'}}</b></p>
  <p style="width: 25%;">ວັນເດືອນປິເກີດ: <b>{{ dayjs(enterpriseInfo[0]?.ind_birth_date).format('DD-MM-YYYY') ?? 'ບໍ່ໄດ້ລະບຸ' }}</b></p>
  <p style="width: 25%;">ເລກບັດປະຈຳຕົວ: <b>{{ enterpriseInfo[0]?.ind_national_id ?? 'ບໍ່ໄດ້ລະບຸ' }}</b></p>
  <p style="width: 25%;">ເລກບັດຜ່ານແດນ: <b>{{ enterpriseInfo[0]?.ind_passport ?? 'ບໍ່ໄດ້ລະບຸ' }}</b></p>
  <p style="width: 25%;">ເລກປື້ມສຳມະໂນຄົວ: <b>{{ enterpriseInfo[0]?.ind_familybook ?? 'ບໍ່ໄດ້ລະບຸ' }}</b></p>
</div>
     
      </v-col>
      
   
     </v-row></div>
</div>


    </v-col>


<p><b>- ຂໍ້ມູນປະຫວັດການເຂົ້າຄົ້ນຫາ: {{ search_history.length }} ຄັ້ງ</b></p>
<div
class="rounded-lg ml-2 mb-1 mr-2"
 :style="{
  border:'1px #2979FF solid'
}">
    <v-table density="compact" :loading="loading">
      <thead class="text-center">
        <tr >
          <th>ລ/ດ</th>
          <th>ສະມາຊິກ</th>
          
          
          <th>ເປົ້າໝາຍເງິນກູ້</th>
          <th>ປະເພດເງິນກູ້</th>
          <th>ວັນທີຄົ້ນຫາ</th>
        </tr>
      </thead>
      <tbody >
    <tr v-for="(item, index) in search_history.slice(-12)" :key="index">
    
        <td>{{ index + 1 }}</td>
        <td>{{ mapdatInfo1(item.bnk_code) }}</td>
        
        
        <td>--</td>
        <td>{{ item.lon_purpose }}</td>
        <!-- <td>{{ item.id.slice(0, -11) }}</td> -->
        <td>{{ dayjs(item.id).format("DD/MM/YYYY-HH:mm:ss") }}</td>
    </tr>
</tbody>
    </v-table>
  
  </div>


    <v-col cols="12" class="loan-summary-section">
  <p><b>- ລວມວົງເງິນກູ້ທີ່ເຄື່ອນໄຫວທັງໝົດ: {{ tableData.length }} ບວ້ງ</b></p>
  <v-table class="mt-5 elevation-1 v-data-table1 rouded-lg"  :style="{
    border:'1px #2979FF solid'
  }" density="compact">
<thead>
  <tr style="font-size: 90%; " class="text-bold" >
<th class="text-center"><b>ລ/ດ</b></th>
    <th class="text-center"><b>ສະມາຊິກ</b></th>
    <th class="text-center"><b> ລະຫັດເງິນກູ້</b></th>
    <!-- <th class="text-center"><b>ມືເປີດ</b></th> -->
    <th class="text-end"><b>ວົງເງິນກູ້</b></th>
    <th class="text-end"><b>ຍອດເງິນເຫຼືອ</b></th>
    <th class="text-center"><b>ສະກຸນເງິນ</b></th>
    <th class="text-center"><b>ຈ/ນ ວັນຄ້າງ</b></th>
    <th class="text-center"><b>ຈັດຊັ້ນ</b></th>
  </tr>
</thead>
<tbody >
  <tr v-for="(item, index) in tableData" :key="index" >
    <td class="text-center">{{ index+1 }}</td>
    <td class="text-center">{{ mapdatInfo1(item.bnk_code) }}</td>
    <td class="text-center">{{ item.loan_id }}</td>
    <!-- <td class="text-end">{{ item.lon_open_date.slice(0, -15) }}</td> -->
    <td class="text-end">{{Number( item.lon_credit_line).toLocaleString() }}</td>
    <td class="text-end">{{Number( item.lon_outstanding_balance).toLocaleString() }}</td>
    
    <td class="text-center">{{ item.lon_currency_code }}</td>
    <td class="text-center">{{ item.lon_no_days_slow }}</td>
    <td class="text-center">{{ item.lon_class }}</td>

  </tr>
  
</tbody>
</v-table>
</v-col>
    <p><b>-ລາຍລະອຽດຂໍ້ມູນເງິນກູ້</b></p>
    <v-col cols="12" >
      <v-row>
        <v-col cols="12">
          <v-row>
            <v-col
            cols="12"
             
              class="mt-1"
              v-for="(item, index) in loan_detail_active"
              :key="index"
            >
              <div
                class="ml-1 rounded-lg"
                style="border: 1px solid #1565c0; padding: 10px" 
              >

                <div>
                  
                  <p>
                    <b>- ຂໍ້ມູນລາຍລະອຽດເງິນກູ້ບ້ວງທີ {{ index + 1 }}</b>
                  </p>
                  <!-- <v-col cols="12">
                    <v-row>
                      <v-col cols="4" md="4" >
                        
                        <p> <b>ລະຫັດເງິນກູ້: </b>{{ item.id }}</p>
                        <p> <b>ຍອດເຫຼືອດອກເບ້ຍ: </b>----</p>
                        
                        <p> <b>ມື້ໝົດສັນຍາ: </b>{{ item.lon_expiry_date }}</p>
                        <p><b>ເຫດຜົນຫການສິ້ນສຸດໜີ້:</b> -- </p>
                      </v-col>
                      <v-col cols="4" md="4">
                        <p> <b>ວົງເງິນໃນອານຸມັດ:</b> {{ item.lon_credit_line.toLocaleString() }} {{  item.lon_currency_code }}</p>
                        <p> <b>ອັດຕາດອກເບ້ຍ:</b> {{ item.lon_int_rate }} %</p>
                        <p> <b>ມື້ໝົດຂອງມື້ຕໍ່ສັນຍາ:</b> {{ dayjs(item.lon_ext_date).format("DD-MM-YYYY") }}</p>
                        
                        
                       
                      </v-col>
                      <v-col cols="4" md="4">
                        <p><b>ຍອດເງິນເຫຼືອຕົ້ນທຶນ:</b> {{ Number(item.lon_outstanding_balance).toLocaleString() }} {{  item.lon_currency_code }}</p>
                        <p> <b>ມື້ເປິດສັນຍາ </b>{{ item.lon_open_date.slice(0, -10) }}</p>
                        <p> <b>ໄລຍະການກູ້ຢືມ:</b> {{ item.lon_term }}</p>
                        

                      </v-col>
                    </v-row>

                  </v-col> -->

                  <hr
                    color="indigo"
                    model-value="100"
                    rounded
                  ></hr>

                  
                </div>
                <div>
                 

                  <v-row>
                    <v-col cols="4">
                                        <v-col cols="12">
                    <v-row>
                      <v-col cols="12" md="12" >
                        
                        <!-- <pre>{{ item }}</pre> -->
                        <p><b>ສະມາຊິກ: </b>{{ mapMemberInfo(item.bank) }}</p>
                        <p><b>ສາຂາ:</b>----</p>
                        <p> <b>ລະຫັດເງິນກູ້: </b>{{ item.id }}</p>
                         <p> <b>ວົງເງິນໃນອານຸມັດ:</b> {{ item.lon_credit_line.toLocaleString() }} {{  item.lon_currency_code }}</p>
                        <p><b>ຍອດເງິນເຫຼືອຕົ້ນທຶນ:</b> {{ Number(item.lon_outstanding_balance).toLocaleString() }} {{  item.lon_currency_code }}</p>
                        <p> <b>ຍອດເຫຼືອດອກເບ້ຍ: </b>----</p>
                        <p> <b>ອັດຕາດອກເບ້ຍ:</b> {{ item.lon_int_rate }} %</p>
                       <p> <b>ມື້ເປິດສັນຍາ </b>{{ item.lon_open_date.slice(0, -10) }}</p> 
                       <p> <b>ມື້ໝົດສັນຍາ: </b>{{ item.lon_exp_date }}</p>
                       <p> <b>ມື້ໝົດຂອງມື້ຕໍ່ສັນຍາ:</b> {{ dayjs(item.lon_ext_date).format("DD-MM-YYYY") }}</p>
                        <p> <b>ໄລຍະການກູ້ຢືມ:</b> {{ item.lon_term }}</p>
                        <p><b>ຈຸດປະສົງການກູ້ຢືມ:</b> {{ item.lon_purpose_code }}</p>
                        <p><b>ເຫດຜົນຫການສິ້ນສຸດໜີ້:</b> -- </p>

                      </v-col>
                    </v-row>

                  </v-col>
                    </v-col>
                    <v-col cols="8">
                      <div style="border: 1px solid blue; " class="rounded-lg mt-2 pa-4">
                    <p v-if="item.lon_class_history.length">
                    <b>- ປະຫວັດການເຄື່ອນໄຫວ່: {{ item.lon_class_history.length }} ເດືອນ</b>
                  </p>

                  <v-table density="compact" class="text-end text-no-warp " style="font-size: 80%;">
                    <thead>
                      <tr>
                        <!-- <th class="text-center"><b>ລຳດັບ.</b></th> -->
                        <th class="text-center"><b>ເດືອນ </b></th>
                        <th class="text-end"><b>ວົງເງິນກູ້</b></th>
                        <th class="text-end"><b>ຍອດຍັງເຫຼືອ</b></th>
                        <th class="text-center"><b>ຈ/ນ ວັນຄ້າງ</b></th>
                        <!-- <th>ສະກຸນເງິນ</th> -->
                        <th class="text-center"><b>ຈັດຊັ້ນ</b></th>
                        <th class="text-center"><b>ສະຖານະ</b></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(items  , index)  in item.lon_class_history">
                        
                        <!-- <td class="text-center">{{index +1}}</td> -->
                        <td class="text-center">{{ dayjs(items.period).format("YYYY-MM") }}</td>
                        <td>{{Number( items.lon_credit_line).toLocaleString() }}</td>
                        <td>{{Number( items.lon_outstanding_balance).toLocaleString() }}</td>
                        <td class="text-center">{{ items.lon_no_days_slow }}</td>
                        <!-- <td>{{ items.lon_currency_code }}</td> -->
                        <td class="text-center">{{ items.lon_class }}</td>
                        <td class="text-center">{{ items.lon_status }}</td>

                      </tr>
                    </tbody>
                  </v-table>  </div>
                    </v-col>
                  </v-row> 
                  <hr v-if="item.collateral_history.length"
                    color="indigo"
                    model-value="100"
                    rounded
                    class="mb-2 mt-2"
                  ></hr>
                  <v-col cols="12">
                    <p v-if="item.collateral_history.length">
                      <b>- ຂໍ້ມູນຫຼັກຊັບຄໍ້າປະກັນ</b>
                    </p>
                    <v-row>
                      <v-col
                        v-for="(collateral, index) in item.collateral_history"
                        class="mt-1"
                        
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
    </v-col>
    </div></v-container>
</template>
<style scoped>
/* A4 Page Setup - ການຕັ້ງຄ່າໜ້າກະດາດ A4 */
@page {
  size: A4 portrait;
  margin: 15mm 8mm 20mm 8mm; 
  
  @top-center {
    content: "ບົດລາຍງານສິນເຊື່ອຄົບຖ້ວນ - B LCIC";
    font-size: 10pt;
    font-weight: bold;
    color: #1565c0;
  }
  
  @bottom-center {
    content: "ໜ້າ " counter(page) " ຈາກ " counter(pages);
    font-size: 8pt;
    color: #666;
  }
  
  @bottom-left {
    content: "ບໍລິສັດ ຂໍ້ມູນຂ່າວສານສິນເຊື່ອແຫ່ງ ສປປ ລາວ";
    font-size: 7pt;
    color: #888;
  }
  
  @bottom-right {
    content: "www.lcic.com.la";
    font-size: 7pt;
    color: #888;
  }
}

/* Print Styles - ສະໄຕລ໌ສຳລັບການພິມ */
@media print {
  * {
    -webkit-print-color-adjust: exact !important;
  
    print-color-adjust: exact !important;
  }
  
  html, body {
    width: 210mm !important;
    height: 297mm !important;
    background: white !important;
    font-family: "Noto Sans Lao", Arial, sans-serif !important;
    font-size: 9pt !important;
    line-height: 1.2 !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow: visible !important;
  }
  
  /* Container Setup - ການຕັ້ງຄ່າ Container */
  .v-application {
    background: white !important;
    font-size: 9pt !important;
  }
  
  .v-container {
    width: 100% !important;
    max-width: 100% !important;
    padding: 0 !important;
    margin: 0 !important;
  }
  
  /* Typography - ການຈັດແບ່ງຂໍ້ຄວາມ */
  h1 { font-size: 14pt !important; margin: 6mm 0 3mm 0 !important; }
  h2 { font-size: 12pt !important; margin: 5mm 0 2mm 0 !important; }
  h3 { font-size: 11pt !important; margin: 4mm 0 2mm 0 !important; }
  h4 { font-size: 10pt !important; margin: 3mm 0 2mm 0 !important; }
  
  p { 
    font-size: 9pt !important; 
    line-height: 1.2 !important; 
    margin: 1mm 0 !important; 
  }
  
  /* Headers and Important Text */
  b, strong { 
    font-weight: 600 !important; 
    font-size: 9pt !important; 
  }
  
  /* Hide Print Buttons */
  .button,
  .v-btn,
  .no-print {
    display: none !important;
  }
  
  /* Company Header Section */
  .company-header {
    page-break-after: avoid !important;
    margin-bottom: 4mm !important;
  }
  
  .company-header h4 {
    font-size: 10pt !important;
    margin: 1mm 0 !important;
  }
  
  /* Enterprise Info Section */
  .enterprise-info {
    /* page-break-inside: avoid !important; */
    margin-bottom: 4mm !important;
    border: 1px solid #1565c0 !important;
    padding: 3mm !important;
  }
  
  /* Tables - ຕາຕະລາງ */
  .v-table,
  table {
    width: 100% !important;
    border-collapse: collapse !important;
    font-size: 8pt !important;
    margin: 2mm 0 !important;
    page-break-inside: auto !important;
  }
  
  .v-table th,
  .v-table td,
  th, td {
    border: 1px solid #333 !important;
    padding: 1mm 2mm !important;
    font-size: 7pt !important;
    line-height: 1.1 !important;
    vertical-align: top !important;
    word-wrap: break-word !important;
  }
  
  .v-table th,
  th {
    background-color: #f0f0f0 !important;
    font-weight: 600 !important;
    text-align: center !important;
  }
  
  /* Search History Table */
  .search-history-table {
    /* page-break-inside: avoid !important; */
    margin-bottom: 4mm !important;
  }
  
  /* Loan Summary Table */
  .loan-summary-section {
    /* page-break-inside: avoid !important; */
    margin-bottom: 5mm !important;
  }
  
  .loan-summary-section .v-table th,
  .loan-summary-section .v-table td {
    font-size: 6pt !important;
    padding: 0.5mm 1mm !important;
  }
  
  /* Loan Details Section */
  .loan-detail-item {
    /* page-break-inside: avoid !important; */
    border: 1px solid #1565c0 !important;
    padding: 3mm !important;
    margin-bottom: 4mm !important;
  }
  
  /* Break large loan details if necessary */
  .loan-detail-large {
    page-break-inside: auto !important;
  }
  
  /* Collateral Section */
  .collateral-section {
    border: 1px solid #1565c0 !important;
    padding: 2mm !important;
    margin: 1mm 0 !important;
    font-size: 7pt !important;
  }
  
  .collateral-section p {
    font-size: 7pt !important;
    margin: 0.5mm 0 !important;
  }
  
  /* Payment History Table */
  .payment-history {
    border: 1px solid #1565c0 !important;
    padding: 2mm !important;
    margin-top: 2mm !important;
  }
  
  .payment-history .v-table th,
  .payment-history .v-table td {
    font-size: 6pt !important;
    padding: 0.5mm 1mm !important;
  }
  
  /* Grid Layout Adjustments */
  .v-row {
    margin: 0 !important;
  }
  
  .v-col {
    padding: 0 1mm !important;
  }
  
  /* Responsive Columns for Print */
  .print-col-4 { width: 33.33% !important; float: left !important; }
  .print-col-6 { width: 50% !important; float: left !important; }
  .print-col-8 { width: 66.66% !important; float: left !important; }
  .print-col-12 { width: 100% !important; clear: both !important; }
  
  /* Footer Section */
  .footer-section {
    background-color: #f5f5f5 !important;
    border: 1px solid #1565c0 !important;
    padding: 3mm !important;
    margin-top: 5mm !important;
    /* page-break-inside: avoid !important; */
  }
  
  .footer-section p {
    font-size: 7pt !important;
    margin: 0.5mm 0 !important;
  }
  
  /* Icons in Print */
  .v-icon {
    font-size: 8pt !important;
  }
  
  /* Page Break Controls */
  .page-break-before { page-break-before: always !important; }
  .page-break-after { page-break-after: always !important; }
  .page-break-avoid { page-break-inside: avoid !important; }
  .page-break-auto { page-break-inside: auto !important; }
  
  /* Prevent Orphans and Widows */
  p, li {
    orphans: 2 !important;
    widows: 2 !important;
  }
  
  /* Headers should not break from content */
  h1, h2, h3, h4, h5, h6 {
    page-break-after: avoid !important;
    orphans: 2 !important;
  }
  
  /* Table Headers */
  thead {
    display: table-header-group !important;
  }
  
  tfoot {
    display: table-footer-group !important;
  }
  
  tr {
    page-break-inside: avoid !important;
    page-break-after: auto !important;
  }
  
  /* Remove Vuetify default styles that interfere with printing */
  .v-data-table__wrapper {
    overflow: visible !important;
  }
  
  /* Ensure borders print correctly */
  .border-print {
    border: 1px solid #000 !important;
  }
  
  /* Number formatting */
  .text-end {
    text-align: right !important;
  }
  
  .text-center {
    text-align: center !important;
  }
  
  /* Specific adjustments for long content */
  .long-content {
    font-size: 7pt !important;
    line-height: 1.1 !important;
  }
  
  /* Hide scrollbars */
  ::-webkit-scrollbar {
    display: none !important;
  }
  
  /* Print-specific utility classes */
  .print-small { font-size: 6pt !important; }
  .print-medium { font-size: 8pt !important; }
  .print-large { font-size: 10pt !important; }
  
  /* Margin utilities for print */
  .print-mb-1 { margin-bottom: 1mm !important; }
  .print-mb-2 { margin-bottom: 2mm !important; }
  .print-mb-3 { margin-bottom: 3mm !important; }
  .print-mt-1 { margin-top: 1mm !important; }
  .print-mt-2 { margin-top: 2mm !important; }
  .print-mt-3 { margin-top: 3mm !important; }
}

/* Screen Styles - ສະໄຕລ໌ສຳລັບໜ້າຈໍ */
@media screen {
  .report-container {
    max-width: 210mm;
    margin: 0 auto;
    background: white;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    padding: 15mm;
  }
  
  /* Print preview styles */
  .print-preview {
    width: 210mm;
    min-height: 297mm;
    background: white;
    margin: 20px auto;
    box-shadow: 0 0 20px rgba(0,0,0,0.1);
    padding: 15mm;
  }
}</style>