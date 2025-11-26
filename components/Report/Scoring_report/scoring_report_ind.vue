<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter, onBeforeRouteLeave } from 'vue-router';
import axios from "axios";
import { useUserUID } from '~/composables/useUserUID';

const router = useRouter();
const config = useRuntimeConfig();

// ⭐ Config API URL
const apiCreditScoreURL = `${config.public.strapi.url}api/credit-score-ind/calculate/`;
const apiChargeScoreFactorsURL = `${config.public.strapi.url}api/charge-score-factors/`;

// ข้อมูลพื้นฐาน
const lcicID = ref("");
const enquiryReference = ref("");
const recSysId = ref("");
const reportDate = ref("");
const loading = ref(false);
const error = ref("");
const { userData, UID } = useUserUID();
const showScoreFactors = ref(false);
const showPaymentDialog = ref(false);
// ⭐ เพิ่ม ref สำหรับเช็คว่า charge แล้วหรือยัง
const hasChargedScoreFactors = ref(false);
const isChargingScoreFactors = ref(false);

// ⭐ เพิ่ม scoreBreakdown
const scoreBreakdown = ref<any>({});

// ข้อมูลส่วนตัว
const personalInfo = ref({
  nationalID: "",
  familyBook: "",
  passport: "",
  nationality: "",
  laoName: "",
  laoSurname: "",
  engName: "",
  engSurname: "",
  birthDate: "",
  age: 0,
  gender: "",
  civilStatus: "",
  address: ""
});

// ⭐ คะแนนเงื่อนไข - ใช้ชื่อตรงกับ Backend
const conditionalScores = ref({
  province: 0,
  marital_status: 0,
  age: 0,
  registration_year: 0,
  loan_purpose: 0,
  loan_term: 0,
  credit_line: 0,
  inquiries: 0,
  overdue_class: 0,  // ⭐ แก้จาก overdue_days เป็น overdue_class
  collateral_type: 0,
  collateral_value: 0,
  outstanding_balance: 0
});

// คะแนนสินเชื่อ
const creditScore = ref(0);

// ข้อมูลสินเชื่อ
const loans = ref<any[]>([]);

// ธนาคารที่มีบัญชี Active
const activeBanks = ref("");

// วงเงินรวมแต่ละสกุลเงิน
const overallCreditLines = ref<any[]>([]);

// คำนวณสีและระดับคะแนน
const scoreColor = computed(() => {
  const score = creditScore.value;
  if (score >= 800) return '#228B22';
  if (score >= 740) return '#9ACD32';
  if (score >= 670) return '#FFFF00';
  if (score >= 580) return '#FFA500';
  return '#FF0000';
});

const scoreLevel = computed(() => {
  const score = creditScore.value;
  if (score >= 800) return 'Extra: ພິເສດ';
  if (score >= 740) return 'Very good: ດີຫຼາຍ';
  if (score >= 670) return 'Good: ດີ';
  if (score >= 580) return 'Medium: ປານກາງ';
  return 'Poor: ອ່ອນ';
});

// ⭐ แก้ไข clearSessionData เพื่อลบข้อมูล charge ด้วย
const clearSessionData = () => {
  const storedLcicID = sessionStorage.getItem("lcic_id");
  
  sessionStorage.removeItem("lcic_id");
  sessionStorage.removeItem("scoring_data");
  sessionStorage.removeItem("from_detail_page");
  
  // ⭐ ลบสถานะ charge ด้วย
  if (storedLcicID) {
    sessionStorage.removeItem(`score_factors_charged_${storedLcicID}`);
  }
};

// ⭐ แก้ไขฟังก์ชัน goBack
const goBack = () => {
  // Clear session ก่อนกลับ
  clearSessionData();
  
  // ⭐ ใช้ replace แทน push - ลบหน้า Report ออกจากประวัติ
  router.replace("/scoring/scoring_individual");
};

// ฟังก์ชันพิมพ์
const printReport = () => {
  window.print();
};

// ⭐ ฟังก์ชันเรียก API
const fetchCreditScore = async (lcic_id: string) => {
  loading.value = true;
  error.value = "";
  
  try {
    const response = await axios.get(apiCreditScoreURL, {
      params: {
        lcic_id: lcic_id
      }
    });
    
    if (response.data && response.data.success && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(response.data.error || 'ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນ');
    }
  } catch (err: any) {
    console.error('Error fetching credit score:', err);
    
    if (err.response) {
      error.value = err.response.data?.message || err.response.data?.error || `Error: ${err.response.status}`;
    } else if (err.request) {
      error.value = 'ບໍ່ສາມາດເຊື່ອມຕໍ່ກັບເຊີບເວີໄດ້';
    } else {
      error.value = err.message || 'ເກີດຂໍ້ຜິດພາດ';
    }
    
    throw err;
  } finally {
    loading.value = false;
  }
};

// ⭐ ฟังก์ชันเรียก API เพื่อ charge - แบบง่าย
const chargeScoreFactors = async () => {
  isChargingScoreFactors.value = true;
  
  try {
    console.log('Calling charge API...');
    console.log('lcic_id:', lcicID.value);
    console.log('user_uid:', UID.value);
    console.log('bank_code:', userData.value?.MID?.id);
    
    const response = await axios.post(apiChargeScoreFactorsURL, {
      lcic_id: lcicID.value,
      user_uid: UID.value,
      bank_code: userData.value?.MID?.id
    });
    
    console.log('Response:', response.data);
    
    if (response.data && response.data.success) {
      sessionStorage.setItem(`score_factors_charged_${lcicID.value}`, 'true');
      hasChargedScoreFactors.value = true;
      
      console.log('Charge success!');
      return true;
    } else {
      throw new Error(response.data.error || 'Failed to create charge');
    }
  } catch (err: any) {
    console.error('Error:', err);
    
    let errorMessage = 'ເກີດຂໍ້ຜິດພາດໃນການຊຳລະເງິນ';
    
    if (err.response) {
      console.error('Response error:', err.response.data);
      errorMessage = err.response.data?.error || err.response.data?.message || errorMessage;
    } else if (err.request) {
      console.error('No response from server');
      errorMessage = 'ບໍ່ສາມາດເຊື່ອມຕໍ່ກັບເຊີບເວີໄດ້';
    } else {
      console.error('Error:', err.message);
      errorMessage = err.message || errorMessage;
    }
    
    error.value = errorMessage;
    return false;
  } finally {
    isChargingScoreFactors.value = false;
  }
};

// ⭐ ฟังก์ชันแปลงข้อมูลจาก API
const mapApiDataToFrontend = (apiData: any) => {
  // 1. ข้อมูลส่วนตัว
  const customerInfo = apiData.customer_info;
  personalInfo.value = {
    nationalID: customerInfo.national_id || "",
    familyBook: customerInfo.familybook || "",
    passport: customerInfo.passport || "",
    nationality: customerInfo.nationality || "",
    laoName: customerInfo.lao_name || "",
    laoSurname: customerInfo.lao_surname || "",
    engName: customerInfo.name || "",
    engSurname: customerInfo.surname || "",
    birthDate: customerInfo.birth_date || "",
    age: customerInfo.age || 0,
    gender: customerInfo.gender || "",
    civilStatus: customerInfo.civil_status || "",
    address: `${customerInfo.familybook_prov_code || ""}`
  };
  
  // ⭐ แยกออกมาต่างหาก - ไม่ใช่ property ของ personalInfo
  scoreBreakdown.value = apiData.score_breakdown || {};
  
  // ⭐ 2. คะแนนเงื่อนไข - ตรงกับ Backend
  const individualScores = apiData.final_score_calculation?.calculation_details?.individual_scores || {};
  
  conditionalScores.value = {
    province: individualScores.province || 0,
    marital_status: individualScores.marital_status || 0,
    age: individualScores.age || 0,
    registration_year: individualScores.registration_year || 0,
    loan_purpose: individualScores.loan_purpose || 0,
    loan_term: individualScores.loan_term || 0,
    credit_line: individualScores.credit_line || 0,
    inquiries: individualScores.inquiries || 0,
    overdue_class: individualScores.overdue_class || 0,  // ⭐ แก้ชื่อให้ตรงกับ Backend
    collateral_type: individualScores.collateral_type || 0,
    collateral_value: individualScores.collateral_value || 0,
    outstanding_balance: individualScores.outstanding_balance || 0
  };
  
  // ⭐ 3. คะแนนสินเชื่อ
  creditScore.value = apiData.final_credit_score || 0;
  
  // ⭐ 4. ข้อมูลสินเชื่อ
  const loanSummary = apiData.loan_summary;
  const allLoans = loanSummary.loans_detail || [];
  
  loans.value = allLoans
    .filter((loan: any) => loan.loan_status === 'ACTIVE')
    .map((loan: any) => ({
      bank: loan.bnk_code || "",
      bank_display: loan.bank_info?.display_code || loan.bnk_code || "",
      code_display: loan.bank_info?.code || "",
      purpose: loan.loan_purpose || "",
      creditLine: formatNumber(loan.credit_line || 0),
      outstanding: formatNumber(loan.outstanding_balance || 0),
      currency: loan.currency || "",
      daysSlow: loan.days_slow || 0,
      loanType: loan.loan_type || "",
      loanTerm: loan.loan_term || "",
      status: loan.loan_status || "",
      collaterals: (loan.collaterals || []).map((col: any) => ({
        col_type: col.col_type || "",
        col_type_name_eng: col.col_type_name_eng || "",
        col_type_name_lao: col.col_type_name_lao || "",
        col_id: col.col_id || "",
        description: col.description || "",
        value: col.value || 0,
        value_unit: col.value_unit || "",
        status: col.status || "",
        owner: col.owner || ""
      })),
      collateral_count: loan.collateral_count || 0,
      total_collateral_value: loan.total_collateral_value || 0
    }));
  
  // ⭐ 5. ธนาคารที่มี Active
  const activeLoans = allLoans.filter((l: any) => l.loan_status === 'ACTIVE');
  
  const bankDisplays = activeLoans.map((l: any) => {
    if (l.bank_info && l.bank_info.display_code) {
      return `${l.bank_info.code}`;
    }
    return l.bnk_code || '';
  });
  
  const uniqueBankDisplays = [...new Set(bankDisplays)];
  activeBanks.value = uniqueBankDisplays.join(", ");
  
  // ⭐ 6. วงเงินรวมแต่ละสกุลเงิน
  const creditLinesByCurrency: any = {};
  activeLoans.forEach((loan: any) => {
    const currency = loan.currency || 'LAK';
    if (!creditLinesByCurrency[currency]) {
      creditLinesByCurrency[currency] = 0;
    }
    creditLinesByCurrency[currency] += loan.credit_line || 0;
  });
  
  overallCreditLines.value = Object.entries(creditLinesByCurrency).map(([currency, amount]) => ({
    currency,
    amount: formatNumber(amount as number)
  }));
};

// ฟังก์ชันจัดรูปแบบตัวเลข
const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};

// ⭐ แก้ไข onMounted - เช็คว่าเคย charge ไปแล้วหรือยัง
onMounted(async () => {
  sessionStorage.removeItem("from_detail_page");
  const storedLcicID = sessionStorage.getItem("lcic_id");
  
  if (!storedLcicID) {
    error.value = "ບໍ່ພົບຂໍ້ມູນ";
    lcicID.value = "ບໍ່ພົບຂໍ້ມູນ";
    return;
  }
  
  lcicID.value = storedLcicID;
  
  // ⭐ เช็คว่าเคย charge score factors ไปแล้วหรือยัง (สำหรับ lcic_id นี้)
  const scoreFactorsCharged = sessionStorage.getItem(`score_factors_charged_${storedLcicID}`);
  if (scoreFactorsCharged === 'true') {
    hasChargedScoreFactors.value = true;
  }
  
  // ... rest of existing onMounted code
  const scoringDataStr = sessionStorage.getItem("scoring_data");
  if (scoringDataStr) {
    try {
      const scoringData = JSON.parse(scoringDataStr);
      
      if (scoringData.rec_reference_code) {
        enquiryReference.value = scoringData.rec_reference_code;
      }
      
      if (scoringData.rec_sys_id) {
        recSysId.value = scoringData.rec_sys_id.toString();
      }
      
      if (scoringData.rec_insert_date) {
        reportDate.value = scoringData.rec_insert_date;
      }
    } catch (e) {
      console.error("Error parsing scoring data:", e);
    }
  }
  
  if (!enquiryReference.value) {
    enquiryReference.value = `REF${new Date().getFullYear()}-${storedLcicID.slice(-6)}`;
  }
  
  if (!reportDate.value) {
    const today = new Date();
    reportDate.value = today.toLocaleDateString('lo-LA', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    });
  }
  
  try {
    const apiData = await fetchCreditScore(storedLcicID);
    mapApiDataToFrontend(apiData);
  } catch (err) {
    console.error('Failed to load credit score:', err);
  }
});

// ⭐ เพิ่ม onUnmounted (เพิ่มหลัง onMounted)
onUnmounted(() => {
  clearSessionData();
});

// ⭐ ฟังก์ชันแปลงชื่อ - เพิ่ม overdue_class
function getScoreLabel(key: string): string {
  const labels: Record<string, string> = {
    province: 'ທີ່ຢູ່',
    marital_status: 'ສະຖານະພາບ',
    age: 'ອາຍຸ',
    registration_year: 'ວັນທີມີຂໍ້ມູນໃນຖານ',
    loan_purpose: 'ເປົ້າໝາຍເງິນກູ້',
    loan_term: 'ໄລຍະການກູ້ຢືມ',
    credit_line: 'ວົງເງິນສິນເຊື່ອ',
    inquiries: 'ຈຳນວນສອບຖາມ',
    overdue_class: 'ວັນທີຄ້າງຊຳລະ',  // ⭐ แก้ชื่อ
    collateral_type: 'ປະເພດຫຼັກຊັບ',
    collateral_value: 'ມູນຄ່າຫຼັກຊັບທຽບຍອດເຫຼືອໜີ້',
    outstanding_balance: 'ຄະແນນຍອດເຫຼືອໜີ້'
  };
  return labels[key] || key;
}

// ⭐ แก้ไขฟังก์ชัน handleToggleScoreFactors
const handleToggleScoreFactors = async () => {
  if (!showScoreFactors.value) {
    // ถ้ายังไม่เปิด
    
    // ⭐ เช็คว่าเคย charge ไปแล้วหรือยัง
    if (hasChargedScoreFactors.value) {
      // เคย charge แล้ว → แสดง details เลย
      showScoreFactors.value = true;
    } else {
      // ยังไม่เคย charge → แสดง payment dialog
      showPaymentDialog.value = true;
    }
  } else {
    // ถ้าเปิดอยู่แล้ว → ซ่อน
    showScoreFactors.value = false;
  }
};

// ⭐ แก้ไขฟังก์ชัน confirmPayment
const confirmPayment = async () => {
  showPaymentDialog.value = false;
  
  // เรียก API เพื่อ charge
  const success = await chargeScoreFactors();
  
  if (success) {
    // charge สำเร็จ → แสดง details
    showScoreFactors.value = true;
  } else {
    // charge ไม่สำเร็จ → แสดง error (error.value ถูกตั้งค่าใน chargeScoreFactors แล้ว)
    showScoreFactors.value = false;
  }
};

// ⭐ ฟังก์ชันยกเลิก
const cancelPayment = () => {
  showPaymentDialog.value = false;
};

// ⭐ ฟังก์ชันดึง details - แบบ Simplified
function getScoreDetails(key: string): { 
  weight: number; 
  formula: string;
  details: any;
} {
  const breakdown = scoreBreakdown.value[key];
  
  // ถ้าไม่มีข้อมูล return ค่าว่าง
  if (!breakdown || !breakdown.details) {
    return { 
      weight: 0, 
      formula: '-', 
      details: { 
        att_name: '-', 
        att_value: 0, 
        att_weight: 0 
      } 
    };
  }
  
  const details = breakdown.details;
  
  // ⭐ ดึงข้อมูลโดยตรงจาก details (รองรับทุกกรณี)
  const attValue = details.att_value || 0;
  const attWeight = details.att_weight || 0;
  const attName = details.att_name || details.selected_col_type || '-';
  const strategy = details.strategy || '';
  
  // สร้าง formula
  let formula = `${attValue}`;
  if (strategy) {
    formula += ` (${strategy})`;
  }
  
  return {
    weight: attWeight,
    formula: formula,
    details: {
      att_name: attName,
      att_value: attValue,
      att_weight: attWeight
    }
  };
}
</script>

<template>
  <div class="report-wrapper">
    <v-container fluid class="pa-0">
      <!-- Error Alert -->
      <v-alert
        v-if="error"
        type="error"
        variant="tonal"
        closable
        class="mb-4"
      >
        <strong>ເກີດຂໍ້ຜິດພາດ:</strong> {{ error }}
      </v-alert>
      
      <!-- ปุ่ม Back และ Print -->
      <div class="action-buttons no-print mb-4">
        <v-btn
          color="grey-darken-2"
          variant="flat"
          @click="goBack"
          prepend-icon="mdi-arrow-left"
          size="large"
          class="mr-3"
        >
          ກັບຄືນ
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          @click="printReport"
          prepend-icon="mdi-printer"
          size="large"
        >
          ພິມລາຍງານ
        </v-btn>
      </div>

      <!-- Skeleton Loader -->
      <v-card v-if="loading" flat class="report-container">
        <v-skeleton-loader type="article, table, table"></v-skeleton-loader>
      </v-card>

      <!-- Report Container -->
      <v-card v-else-if="!loading && !error" flat class="report-container">
        <!-- ข้อมูลเอกสาร -->
        <div class="document-info-wrapper px-4 mb-2">
          <v-row>
            <v-col cols="8" class="text-center">
              <div>
                <v-row align="center">
                  <v-col cols="auto">
                    <v-img src="/images/logo1.png" width="70"></v-img>
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
            
            <v-col cols="4" class="text-end mt-4">
              <div>
                <p><strong>ລະຫັດຂສລ:</strong> {{ lcicID }}</p>
                <p>ຜູ້ສອບຖາມ: <b>{{ userData?.username }}</b> ຈາກທະນາຄານ: <b>{{ userData?.MID?.code }}</b></p>
              </div>
            </v-col>
          </v-row>
        </div>

        <!-- ชื่อรายงาน -->
        <div class="text-center pa-7 report-title">
          <h2 class="text-h5 font-weight-bold">ບົດລາຍງານການໃຫ້ຄະແນນສິນເຊື່ອ</h2>
          <p class="text-subtitle-1">(ສຳລັບບຸກຄົນ)</p>
        </div>

        <!-- ข้อมูลส่วนบุคคล -->
        <v-card flat class="pa-3 mb-2 personal-info-section">
          <h3 class="text-h6 mb-2 font-weight-bold section-title">
            <v-icon>mdi-dot</v-icon>
            ຂໍ້ມູນສ່ວນບຸກຄົນ
          </h3>
          <v-row dense class="personal-info-grid ml-2">
            <v-col cols="12" md="6" lg="4" class="info-column">
              <div class="info-row">
                <span>ຊື່ພາສາລາວ: <span class="font-weight-bold">{{ personalInfo.laoName }}</span></span>
              </div>
            </v-col>
            <v-col cols="12" md="6" lg="4" class="info-column">
              <div class="info-row">
                <span>ນາມສະກຸນພາສາລາວ: <span class="font-weight-bold">{{ personalInfo.laoSurname }}</span></span>
              </div>
            </v-col>
            <v-col cols="12" md="6" lg="4" class="info-column">
              <div class="info-row">
                <span>ຊື່ພາສາອັງກິດ: <span class="font-weight-bold">{{ personalInfo.engName }}</span></span>
              </div>
            </v-col>
            <v-col cols="12" md="6" lg="4" class="info-column">
              <div class="info-row">
                <span>ນາມສະກຸນພາສາອັງກິດ: <span class="font-weight-bold">{{ personalInfo.engSurname }}</span></span>
              </div>
            </v-col>
            <v-col cols="12" md="6" lg="4" class="info-column">
              <div class="info-row">
                <span>ເພດ: <span class="font-weight-bold">
                {{ personalInfo.gender === 'M' ? 'ຊາຍ' : personalInfo.gender === 'F' ? 'ຍິງ' : personalInfo.gender }}
                </span></span>
              </div>
            </v-col>
            <v-col cols="12" md="6" lg="4" class="info-column">
              <div class="info-row">
                <span>ວັນເດືອນປີເກີດ: <span class="font-weight-bold">{{ personalInfo.birthDate }}</span></span>
              </div>
            </v-col>
            <v-col cols="12" md="6" lg="4" class="info-column">
              <div class="info-row">
                <span>ສັນຊາດ: <span class="font-weight-bold">{{ personalInfo.nationality }}</span></span>
              </div>
            </v-col>
            <v-col cols="12" md="6" lg="4" class="info-column">
              <div class="info-row">
                <span>ບັດປະຈຳຕົວ: <span class="font-weight-bold">{{ personalInfo.nationalID }}</span></span>
              </div>
            </v-col>
            <v-col cols="12" md="6" lg="4" class="info-column">
              <div class="info-row">
                <span>ສຳມະໂນຄົວ: <span class="font-weight-bold">{{ personalInfo.familyBook }}</span></span>
              </div>
            </v-col>
            <v-col cols="12" md="6" lg="4" class="info-column">
              <div class="info-row">
                <span>ໜັງສືຜ່ານແດນ: <span class="font-weight-bold">{{ personalInfo.passport }}</span></span>
              </div>
            </v-col>
          </v-row>
        </v-card>

        <!-- Credit Risk Score -->
        <v-card flat class="pa-3 mb-2 credit-score-section">
          <h3 class="text-h6 mb-2 font-weight-bold section-title">
            <v-icon>mdi-dot</v-icon>
            Credit Risk Score
          </h3>
          <div class="text-center mb-2">
            <p class="text-subtitle-1 font-weight-bold">ຄະແນນສິນເຊື່ອຂອງທ່ານແມ່ນ</p>
          </div>
          
          <div class="score-display mx-auto mb-3" :style="{ backgroundColor: scoreColor }">
            <span class="score-number">{{ creditScore }}</span>
          </div>

          <div class="score-bar-container mb-2">
            <div class="score-bar poor">Poor: ອ່ອນ: 300-579</div>
            <div class="score-bar medium">Medium: ປານກາງ: 580-669</div>
            <div class="score-bar good">Good: ດີ: 670-739</div>
            <div class="score-bar very-good">Very good: ດີຫຼາຍ: 740-799</div>
            <div class="score-bar extra">Extra: ພິເສດ: 800-1000</div>
          </div>
        </v-card>

        <!-- เงื่อนไขการให้คะแนน -->
        <v-card flat class="pa-3 conditional-scores-section text-black" style="background-color: #a3c0f7 !important; ">
          <h3 class="text-h6 mb-1 font-weight-bold section-title">
            <v-icon>mdi-dot</v-icon>
            ເງື່ອນໄຂການໃຫ້ຄະແນນ
          </h3>
          <v-row dense class="scores-grid">
            <v-col cols="12" md="6" lg="4" class="score-column" v-for="(value, key) in conditionalScores" :key="key">
              <div class="score-item">
                <span class="score-label">{{ getScoreLabel(key) }}:</span>
                <span class="score-value">{{ value }}</span>
              </div>
            </v-col>
          </v-row>
        </v-card>

  <!-- Score Factors Section -->
  <v-card flat class="pa-2 mb-2 score-factors-section">
        <div class="score-factors-header">
            <h3 class="text-h6 mb-2 font-weight-bold section-title">
            <v-icon>mdi-dot</v-icon>
            SCORE FACTORS
            </h3>
            
            <!-- ปุ่ม Toggle -->
          <v-btn
            size="small"
            :color="showScoreFactors ? 'primary' : 'grey'"
            variant="tonal"
            @click="handleToggleScoreFactors"
            :loading="isChargingScoreFactors"
            :disabled="isChargingScoreFactors"
            class="no-print toggle-button"
          >
            <v-icon size="small" class="mr-1">
              {{ showScoreFactors ? 'mdi-eye-off' : 'mdi-eye' }}
            </v-icon>
            {{ showScoreFactors ? 'Hide Details' : 'Show Details' }}
          </v-btn>
        </div>

    <v-expand-transition>
      <div v-show="showScoreFactors" class="dashboard-grid-wrapper">
        <v-row dense class="dashboard-grid">

          <!-- ========== GROUP 2: Payment History (31%) ========== -->
          <v-col cols="12" lg="2-4" md="4" sm="6" class="pa-1">
            <v-card class="dashboard-card group-2-dashboard" elevation="3">
              <div class="dashboard-header">
                <v-icon size="small">mdi-history</v-icon>
                <div class="dashboard-header-text">
                  <div class="dashboard-title">Payment History</div>
                  <div class="dashboard-weight">31%</div>
                </div>
              </div>
              
              <v-card-text class="pa-2">
                <!-- Overdue Days -->
                <div class="dashboard-item">
                  <div class="dashboard-item-label">
                    <v-icon size="small">mdi-dot</v-icon>{{ getScoreLabel('overdue_class') }}
                  </div>
                  <!-- <div class="dashboard-item-attr ml-2">
                    {{ getScoreDetails('overdue_class').details?.att_name || '-' }}
                  </div> -->
                  <div class="dashboard-metrics">
                    <!-- ⭐ Value Chip -->
                    <div class="metric-chip value-chip">
                      <span class="metric-chip-label">V:</span>
                      <span class="metric-chip-value">{{ getScoreDetails('overdue_class').details?.att_value || 0 }}</span>
                    </div>
                    <!-- ⭐ Weight Chip -->
                    <div class="metric-chip weight-chip">
                      <span class="metric-chip-label">W:</span>
                      <span class="metric-chip-value">{{ getScoreDetails('overdue_class').details?.att_weight || 0 }}%</span>
                    </div>
                  </div>
                </div>
                
                <v-divider class="my-1"></v-divider>
                
                <!-- Registration Year -->
                <div class="dashboard-item">
                  <div class="dashboard-item-label">
                    <v-icon size="small">mdi-dot</v-icon>{{ getScoreLabel('registration_year') }}
                  </div>
                  <!-- <div class="dashboard-item-attr ml-2">
                    {{ getScoreDetails('registration_year').details?.att_name || '-' }}
                  </div> -->
                  <div class="dashboard-metrics">
                    <div class="metric-chip value-chip">
                      <span class="metric-chip-label">V:</span>
                      <span class="metric-chip-value">{{ getScoreDetails('registration_year').details?.att_value || 0 }}</span>
                    </div>
                    <div class="metric-chip weight-chip">
                      <span class="metric-chip-label">W:</span>
                      <span class="metric-chip-value">{{ getScoreDetails('registration_year').details?.att_weight || 0 }}%</span>
                    </div>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- ========== GROUP 1: Amount Owned (30%) ========== -->
          <v-col cols="12" lg="2-4" md="4" sm="6" class="pa-1">
            <v-card class="dashboard-card group-1-dashboard" elevation="3">
              <div class="dashboard-header">
                <v-icon size="small">mdi-wallet</v-icon>
                <div class="dashboard-header-text">
                  <div class="dashboard-title">Amount Owned</div>
                  <div class="dashboard-weight">30%</div>
                </div>
              </div>
              
              <v-card-text class="pa-2">
                <!-- Credit Line -->
                <div class="dashboard-item mb-2">
                  <div class="dashboard-item-label">
                    <v-icon size="small">mdi-dot</v-icon>{{ getScoreLabel('credit_line') }}
                  </div>
                  <!-- <div class="dashboard-item-attr ml-2">
                    {{ getScoreDetails('credit_line').details?.att_name || '-' }}
                  </div> -->
                  <div class="dashboard-metrics">
                    <div class="metric-chip value-chip">
                      <span class="metric-chip-label">V:</span>
                      <span class="metric-chip-value">{{ getScoreDetails('credit_line').details?.att_value || 0 }}</span>
                    </div>
                    <div class="metric-chip weight-chip">
                      <span class="metric-chip-label">W:</span>
                      <span class="metric-chip-value">{{ getScoreDetails('credit_line').details?.att_weight || 0 }}%</span>
                    </div>
                  </div>
                </div>
                
                <v-divider class="my-1"></v-divider>
                
                <!-- Outstanding Balance -->
                <div class="dashboard-item">
                  <div class="dashboard-item-label">
                    <v-icon size="small">mdi-dot</v-icon>{{ getScoreLabel('outstanding_balance') }}
                  </div>
                  <!-- <div class="dashboard-item-attr ml-2">
                    {{ getScoreDetails('outstanding_balance').details?.att_name || '-' }}
                  </div> -->
                  <div class="dashboard-metrics">
                    <div class="metric-chip value-chip">
                      <span class="metric-chip-label">V:</span>
                      <span class="metric-chip-value">{{ getScoreDetails('outstanding_balance').details?.att_value || 0 }}</span>
                    </div>
                    <div class="metric-chip weight-chip">
                      <span class="metric-chip-label">W:</span>
                      <span class="metric-chip-value">{{ getScoreDetails('outstanding_balance').details?.att_weight || 0 }}%</span>
                    </div>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- ========== GROUP 3: Inquiries & Purpose (15%) ========== -->
          <v-col cols="12" lg="2-4" md="4" sm="6" class="pa-1">
            <v-card class="dashboard-card group-3-dashboard" elevation="3">
              <div class="dashboard-header">
                <v-icon size="small">mdi-calendar-clock</v-icon>
                <div class="dashboard-header-text">
                  <div class="dashboard-title">Inquiries & Purpose</div>
                  <div class="dashboard-weight">15%</div>
                </div>
              </div>
              
              <v-card-text class="pa-2">
                <!-- Inquiries -->
                <div class="dashboard-item">
                  <div class="dashboard-item-label">
                    <v-icon size="small">mdi-dot</v-icon>{{ getScoreLabel('inquiries') }}
                  </div>
                  <!-- <div class="dashboard-item-attr ml-2">
                    {{ getScoreDetails('inquiries').details?.att_name || '-' }}
                  </div> -->
                  <div class="dashboard-metrics">
                    <div class="metric-chip value-chip">
                      <span class="metric-chip-label">V:</span>
                      <span class="metric-chip-value">{{ getScoreDetails('inquiries').details?.att_value || 0 }}</span>
                    </div>
                    <div class="metric-chip weight-chip">
                      <span class="metric-chip-label">W:</span>
                      <span class="metric-chip-value">{{ getScoreDetails('inquiries').details?.att_weight || 0 }}%</span>
                    </div>
                  </div>
                </div>
                
                <v-divider class="my-1"></v-divider>

                <!-- Loan Purpose -->
                <div class="dashboard-item mb-2">
                  <div class="dashboard-item-label">
                    <v-icon size="small">mdi-dot</v-icon>{{ getScoreLabel('loan_purpose') }}
                  </div>
                  <!-- <div class="dashboard-item-attr ml-2">
                    {{ getScoreDetails('loan_purpose').details?.att_name || '-' }}
                  </div> -->
                  <div class="dashboard-metrics">
                    <div class="metric-chip value-chip">
                      <span class="metric-chip-label">V:</span>
                      <span class="metric-chip-value">{{ getScoreDetails('loan_purpose').details?.att_value || 0 }}</span>
                    </div>
                    <div class="metric-chip weight-chip">
                      <span class="metric-chip-label">W:</span>
                      <span class="metric-chip-value">{{ getScoreDetails('loan_purpose').details?.att_weight || 0 }}%</span>
                    </div>
                  </div>
                </div>
                
                <v-divider class="my-1"></v-divider>
                
                <!-- Loan Term -->
                <div class="dashboard-item mb-2">
                  <div class="dashboard-item-label">
                    <v-icon size="small">mdi-dot</v-icon>{{ getScoreLabel('loan_term') }}
                  </div>
                  <!-- <div class="dashboard-item-attr ml-2">
                    {{ getScoreDetails('loan_term').details?.att_name || '-' }}
                  </div> -->
                  <div class="dashboard-metrics">
                    <div class="metric-chip value-chip">
                      <span class="metric-chip-label">V:</span>
                      <span class="metric-chip-value">{{ getScoreDetails('loan_term').details?.att_value || 0 }}</span>
                    </div>
                    <div class="metric-chip weight-chip">
                      <span class="metric-chip-label">W:</span>
                      <span class="metric-chip-value">{{ getScoreDetails('loan_term').details?.att_weight || 0 }}%</span>
                    </div>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- ========== GROUP 4: Collateral (10%) ========== -->
          <v-col cols="12" lg="2-4" md="6" sm="6" class="pa-1">
            <v-card class="dashboard-card group-4-dashboard" elevation="3">
              <div class="dashboard-header">
                <v-icon size="small">mdi-magnify</v-icon>
                <div class="dashboard-header-text">
                  <div class="dashboard-title">Collateral</div>
                  <div class="dashboard-weight">10%</div>
                </div>
              </div>
              
              <v-card-text class="pa-2">
                <!-- Collateral Value -->
                <div class="dashboard-item mb-2">
                  <div class="dashboard-item-label">
                    <v-icon size="small">mdi-dot</v-icon>{{ getScoreLabel('collateral_value') }}
                  </div>
                  <!-- <div class="dashboard-item-attr ml-2">
                    {{ getScoreDetails('collateral_value').details?.att_name || '-' }}
                  </div> -->
                  <div class="dashboard-metrics">
                    <div class="metric-chip value-chip">
                      <span class="metric-chip-label">V:</span>
                      <span class="metric-chip-value">{{ getScoreDetails('collateral_value').details?.att_value || 0 }}</span>
                    </div>
                    <div class="metric-chip weight-chip">
                      <span class="metric-chip-label">W:</span>
                      <span class="metric-chip-value">{{ getScoreDetails('collateral_value').details?.att_weight || 0 }}%</span>
                    </div>
                  </div>
                </div>
                
                <v-divider class="my-1"></v-divider>
                
                <!-- Collateral Type -->
                <div class="dashboard-item mb-2">
                  <div class="dashboard-item-label">
                    <v-icon size="small">mdi-dot</v-icon>{{ getScoreLabel('collateral_type') }}
                  </div>
                  <!-- <div class="dashboard-item-attr ml-2">
                    {{ getScoreDetails('collateral_type').details?.att_name || '-' }}
                  </div> -->
                  <div class="dashboard-metrics">
                    <div class="metric-chip value-chip">
                      <span class="metric-chip-label">V:</span>
                      <span class="metric-chip-value">{{ getScoreDetails('collateral_type').details?.att_value || 0 }}</span>
                    </div>
                    <div class="metric-chip weight-chip">
                      <span class="metric-chip-label">W:</span>
                      <span class="metric-chip-value">{{ getScoreDetails('collateral_type').details?.att_weight || 0 }}%</span>
                    </div>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- ========== GROUP 5: Personal Info (14%) ========== -->
          <v-col cols="12" lg="2-4" md="6" sm="6" class="pa-1">
            <v-card class="dashboard-card group-5-dashboard" elevation="3">
              <div class="dashboard-header">
                <v-icon size="small">mdi-account-group</v-icon>
                <div class="dashboard-header-text">
                  <div class="dashboard-title">Personal Info</div>
                  <div class="dashboard-weight">14%</div>
                </div>
              </div>
              
              <v-card-text class="pa-2">
                <!-- Age -->
                <div class="dashboard-item mb-2">
                  <div class="dashboard-item-label">
                    <v-icon size="small">mdi-dot</v-icon>{{ getScoreLabel('age') }}
                  </div>
                  <!-- <div class="dashboard-item-attr ml-2">
                    {{ getScoreDetails('age').details?.att_name || '-' }}
                  </div> -->
                  <div class="dashboard-metrics">
                    <div class="metric-chip value-chip">
                      <span class="metric-chip-label">V:</span>
                      <span class="metric-chip-value">{{ getScoreDetails('age').details?.att_value || 0 }}</span>
                    </div>
                    <div class="metric-chip weight-chip">
                      <span class="metric-chip-label">W:</span>
                      <span class="metric-chip-value">{{ getScoreDetails('age').details?.att_weight || 0 }}%</span>
                    </div>
                  </div>
                </div>
                
                <v-divider class="my-1"></v-divider>
                
                <!-- Marital Status -->
                <div class="dashboard-item mb-2">
                  <div class="dashboard-item-label">
                    <v-icon size="small">mdi-dot</v-icon>{{ getScoreLabel('marital_status') }}
                  </div>
                  <!-- <div class="dashboard-item-attr ml-2">
                    {{ getScoreDetails('marital_status').details?.att_name || '-' }}
                  </div> -->
                  <div class="dashboard-metrics">
                    <div class="metric-chip value-chip">
                      <span class="metric-chip-label">V:</span>
                      <span class="metric-chip-value">{{ getScoreDetails('marital_status').details?.att_value || 0 }}</span>
                    </div>
                    <div class="metric-chip weight-chip">
                      <span class="metric-chip-label">W:</span>
                      <span class="metric-chip-value">{{ getScoreDetails('marital_status').details?.att_weight || 0 }}%</span>
                    </div>
                  </div>
                </div>
                
                <v-divider class="my-1"></v-divider>
                
                <!-- Province -->
                <div class="dashboard-item">
                  <div class="dashboard-item-label">
                    <v-icon size="small">mdi-dot</v-icon>{{ getScoreLabel('province') }}
                  </div>
                  <!-- <div class="dashboard-item-attr ml-2">
                    {{ getScoreDetails('province').details?.att_name || '-' }}
                  </div> -->
                  <div class="dashboard-metrics">
                    <div class="metric-chip value-chip">
                      <span class="metric-chip-label">V:</span>
                      <span class="metric-chip-value">{{ getScoreDetails('province').details?.att_value || 0 }}</span>
                    </div>
                    <div class="metric-chip weight-chip">
                      <span class="metric-chip-label">W:</span>
                      <span class="metric-chip-value">{{ getScoreDetails('province').details?.att_weight || 0 }}%</span>
                    </div>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        
        <!-- Summary Notes -->
        <div class="mb-2 pa-2 text-body-2 font-weight-bold">
          <p>1. Your Credit Line greater than outstanding amount.</p>
          <p>2. You have 30-60 days overdue.</p>
          <p>3. but your collateral value is larger than the outstanding loan.</p>
        </div>
      </div>
    </v-expand-transition>
  </v-card>

        <!-- Financial Overview -->
        <v-card flat class="pa-2 mb-2">
          <h3 class="text-h6 mb-2 font-weight-bold section-title">
            <v-icon>mdi-dot</v-icon>
            FINANCIAL OVERVIEW
          </h3>
          
          <div class="mb-3 ml-7">
            <strong>Active Accounts With: {{ activeBanks }}</strong>
          </div>

          <!-- ⭐ ວົງເງິນລວມ: แถวแรกอยู่บรรทัดเดียวกัน -->
        <div class="ml-7">
        <div class="credit-lines-container">
            <strong class="credit-lines-label">ວົງເງິນລວມ:</strong>
            <div class="credit-lines-badges">
            <div 
                v-for="(line, index) in overallCreditLines" 
                :key="index" 
                class="currency-badge"
            >
                <span class="badge-amount">{{ line.amount }}</span>
                <span class="badge-currency">{{ line.currency }}</span>
            </div>
            </div>
        </div>
        </div>
        </v-card>

        <!-- ລາຍລະອຽດສິນເຊື່ອ -->
        <v-card flat class="pa-3 mb-2">
          <h3 class="text-h6 mb-2 font-weight-bold section-title">
            <v-icon>mdi-dot</v-icon>
            ລາຍລະອຽດສິນເຊື່ອ ແລະ ຫຼັກຊັບຄ້ຳປະກັນ (ACTIVE)
          </h3>
          
          <v-alert v-if="loans.length === 0" type="info" variant="tonal" density="compact">
            <v-icon size="small">mdi-information</v-icon>
            ບໍ່ມີສິນເຊື່ອທີ່ມີສະຖານະ ACTIVE
          </v-alert>

          <div v-else v-for="(loan, loanIndex) in loans" :key="loanIndex" class="loan-collateral-wrapper">
            <div class="box-layout-container">
              <div class="box-header-row">
                <div class="box-header loan-header">
                  <v-icon size="small" class="mr-2">mdi-bank</v-icon>
                  <strong>ລາຍລະອຽດສິນເຊື່ອ</strong>
                </div>
                <div class="box-header collateral-header">
                  <v-icon size="small" class="mr-2">mdi-shield-check</v-icon>
                  <strong>ຫຼັກຊັບຄ້ຳປະກັນ ({{ loan.collateral_count }} ລາຍການ)</strong>
                </div>
              </div>

              <div class="box-content-row">
                <div class="loan-box">
                  <div class="loan-info-row">
                    <span class="info-label">ທະນາຄານ:</span>
                    <span class="info-value">{{ loan.code_display }}</span>
                  </div>
                  <div class="loan-info-row">
                    <span class="info-label">ວົງເງິນສິນເຊື່ອ:</span>
                    <span class="info-value">{{ loan.creditLine }} {{ loan.currency }}</span>
                  </div>
                  <div class="loan-info-row">
                    <span class="info-label">ຍອດເຫຼືອໜີ້:</span>
                    <span class="info-value">{{ loan.outstanding }} {{ loan.currency }}</span>
                  </div>
                    <div class="loan-info-row">
                    <span class="info-label">ຈຸດປະສົງ:</span>
                    <span class="info-value">{{ loan.purpose }}</span>
                  </div>
                  <div class="loan-info-row">
                    <span class="info-label">ວັນທີຄ້າງຊຳລະ:</span>
                    <span class="info-value">{{ loan.daysSlow }}</span>
                  </div>
                  <div class="loan-info-row">
                    <span class="info-label">ປະເພດສິນເຊື່ອ:</span>
                    <span class="info-value">{{ loan.loanType }}</span>
                  </div>
                  <div class="loan-info-row">
                    <span class="info-label">ໄລຍະ:</span>
                    <span class="info-value">{{ loan.loanTerm }}</span>
                  </div>
                  <div class="loan-info-row">
                    <span class="info-label">ສະຖານະ:</span>
                    <span class="info-value">{{ loan.status }}</span>
                  </div>
                </div>

                <div class="collateral-grid">
                  <div 
                    v-for="(collateral, colIndex) in loan.collaterals" 
                    :key="colIndex" 
                    class="collateral-box"
                  >
                    <div class="collateral-info-row">
                      <span class="col-label">ປະເພດ: </span>
                      <span class="col-value font-weight-bold ml-5">{{ collateral.col_type_name_lao || collateral.col_type_name_eng }}</span>
                    </div>
                    <div class="collateral-info-row">
                      <span class="col-label">ມູນຄ່າ:</span>
                      <span class="col-value">{{ formatNumber(collateral.value) }} {{ collateral.value_unit || '-' }}</span>
                    </div>
                    <div class="collateral-info-row">
                      <span class="col-label">ສະຖານະ:</span>
                      <span class="col-value col-status">{{ collateral.status || '-' }}</span>
                    </div>
                  </div>
                  
                  <div v-if="loan.collaterals.length === 0" class="no-collateral">
                    <v-icon size="large" color="grey">mdi-shield-off-outline</v-icon>
                    <p class="text-grey">ບໍ່ມີຫຼັກຊັບຄ້ຳປະກັນ</p>
                  </div>
                </div>
              </div>
            </div>

            <v-divider v-if="loanIndex < loans.length - 1" class="my-4 separator-line"></v-divider>
          </div>
        </v-card>

        <!-- หมายเหตุ -->
        <v-alert type="warning" color="red" variant="tonal" class="mx-4 mb-2">
          <strong>ຫມາຍເຫດ:</strong> ຂໍ້ມູນນີ້ແມ່ນນຳໃຊ້ເຂົ້າໃນວຽກງານພິຈາລະນາສິນເຊື່ອເທົ່ານັ້ນ.
        </v-alert>

        <!-- Footer -->
        <div class="report-footer pa-3 text-center">
          <div class="footer-contact mb-2">
            <strong>ບໍລິສັດຂໍ້ມູນຂ່າວສານສິນເຊື່ອແຫ່ງ ສປປລາວ, ຖະໜົນ T4, ບ້ານ ໂພນທັນ, ເມືອງ ໄຊເສດຖາ, ນະຄອນຫຼວງວຽງຈັນ</strong>
          </div>
          <div class="footer-contact mb-2">
            <strong>ໂທລະສັບ (856)-21-254292, (021) 216529, Email: LCIC@BoL.Gov.La</strong>
          </div>
          <v-img src="" max-width="150" class="mx-auto" />
        </div>
      </v-card>
            <!-- Payment Dialog -->
      <v-dialog v-model="showPaymentDialog" max-width="500px">
      <v-card>
          <v-card-title class="text-h5 bg-warning pa-4">
          <v-icon size="large" class="mr-2">mdi-alert-circle</v-icon>
          ແຈ້ງເຕືອນການຊຳລະເງິນ
          </v-card-title>
          
          <v-card-text class="pa-6">
          <div class="text-center mb-4">
              <v-icon size="80" color="warning">mdi-lock-outline</v-icon>
          </div>
          
          <div class="text-h6 text-center mb-4">
              ເນື້ອຫານີ້ຕ້ອງຊຳລະເງິນເພື່ອເບິ່ງລາຍລະອຽດ
          </div>
          
          <v-alert type="info" variant="tonal" class="mb-4">
              <div class="text-center">
              <div class="text-h5 font-weight-bold mb-2">5,000 LAK</div>
              <div class="text-body-2">ເພື່ອເບິ່ງລາຍລະອຽດ Score Factors ທັງໝົດ</div>
              </div>
          </v-alert>
          
          <div class="text-body-2 text-grey-darken-1">
              <p class="mb-2">ທ່ານຈະໄດ້ຮັບ:</p>
              <ul class="ml-4">
              <li>ການຄຳນວນແບບລະອຽດ</li>
              <li>ຄຳແນະນຳການປັບປຸງຄະແນນ</li>
              </ul>
          </div>
          </v-card-text>
          
          <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn
              color="grey"
              variant="text"
              @click="cancelPayment"
          >
              ຍົກເລີກ
          </v-btn>
          <v-btn
              color="success"
              variant="flat"
              @click="confirmPayment"
              prepend-icon="mdi-check-circle"
          >
              ຢືນຢັນການຊຳລະເງິນ
          </v-btn>
          </v-card-actions>
      </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>

<style scoped>
/* ============================================
   OPTION 4: 5 COLUMNS DASHBOARD DESIGN
   ============================================ */

/* Custom 5-column grid */
@media (min-width: 1280px) {
  .v-col-lg-2-4 {
    flex: 0 0 20% !important;
    max-width: 20% !important;
  }
}

.dashboard-grid {
  margin: 0 !important;
}

.dashboard-card {
  border-radius: 8px !important;
  overflow: hidden;
  height: 100%;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.dashboard-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.12) !important;
}

.dashboard-header {
  padding: 5px 10px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.dashboard-header-text {
  flex: 1;
}

.dashboard-title {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.3px;
  line-height: 1;
}

.dashboard-weight {
  font-size: 18px;
  font-weight: 900;
  margin-top: 2px;
  line-height: 1;
}

/* Group Colors */
.group-1-dashboard {
  border-color: #f59e0b;
}

.group-1-dashboard .dashboard-header {
  background: linear-gradient(135deg, #f59e0b 0%, #fb923c 100%);
}

.group-2-dashboard {
  border-color: #10b981;
}

.group-2-dashboard .dashboard-header {
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
}

.group-3-dashboard {
  border-color: #3b82f6;
}

.group-3-dashboard .dashboard-header {
  background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
}

.group-4-dashboard {
  border-color: #ec4899;
}

.group-4-dashboard .dashboard-header {
  background: linear-gradient(135deg, #ec4899 0%, #f472b6 100%);
}

.group-5-dashboard {
  border-color: #8b5cf6;
}

.group-5-dashboard .dashboard-header {
  background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
}

/* Dashboard Items */
.dashboard-item {
  padding: 6px 0;
}

.dashboard-item-label {
  font-size: 12px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 4px;
  line-height: 1.3;
}

.dashboard-item-attr {
  font-size: 11px;
  margin-bottom: 4px;
  min-height: 20px;
  display: flex;
  align-items: center;
  line-height: 1.3;
}

.dashboard-metrics {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.metric-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 11px;
  transition: all 0.2s;
  line-height: 1.3;
  font-weight: 600;
}

.metric-chip:hover {
  transform: scale(1.05);
}

.value-chip {
  border: 1px solid #a52944;

}

.weight-chip {
  border: 1px solid #4ca529;

}

.metric-chip-label {
  font-weight: 700;
  font-size: 10px;
}

.metric-chip-value {
  font-weight: 800;
  font-size: 12px;
}

/* เพิ่มใน section ที่ไม่ใช่ @media print */

.score-factors-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.toggle-button {
  flex-shrink: 0;
}

/* ⭐ Credit Lines Container - แถวแรกอยู่บรรทัดเดียวกัน */
.credit-lines-container {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 10px;
}

.credit-lines-label {
  flex-shrink: 0;
  font-size: 14px;
  font-weight: bold;
  line-height: 32px; /* ให้สูงเท่า badge */
  margin-right: 4px;
}

.credit-lines-badges {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.currency-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  background: white;
  border: 1px solid #2931a5;
  color: #2931a5;
  width: fit-content;
}

.currency-badge:hover {
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.badge-currency {
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.5px;
}

.badge-amount {
  font-weight: 600;
  font-size: 14px;
}

/* ============================================
   🎯 ส่วนที่ 1: CSS สำหรับหน้าจอปกติ (NOT PRINT)
   ============================================ */

/* ========== ⭐ UPDATED BOX LAYOUT ========== */
.loan-collateral-wrapper {
  margin-bottom: 24px;
}

.box-layout-container {
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
  background: white;
}

/* Header Row - มีสีพื้นหลังเท่านั้น */
.box-header-row {
  display: grid;
  grid-template-columns: 1fr 3fr;
  border-bottom: 1px solid #ccc;
}

.box-header {
  padding: 10px 12px;
  display: flex;
  align-items: center;
  justify-content: flex-start; /* ⭐ เพิ่มบรรทัดนี้ - ชิดซ้าย */
  font-size: 14px;
  font-weight: bold;
  color: white;
}

.loan-header {
  background: #0a1e77;
  border-right: 1px solid #ccc;
  justify-content: flex-start !important; /* ⭐ บังคับชิดซ้าย */
}

.collateral-header {
  background: #0a1e77;
  justify-content: flex-start !important; /* ⭐ บังคับชิดซ้าย */
}

/* Content Row - ⭐ ลดความสูงลง */
.box-content-row {
  display: grid;
  grid-template-columns: 1fr 3fr;
  min-height: 120px;
}

/* Left: Loan Box - ไม่มี design */
.loan-box {
  padding: 12px;
  border-right: 1px solid #ccc;
  background: white;
}

.loan-info-row {
  display: flex;
  justify-content: space-between;
  padding: 2px 0;
  margin-bottom: 1px;
  background: white;
  border: none;
  border-radius: 0;
}

.info-label {
  font-weight: 500;
  color: #000000;
  font-size: 13px;
}

.info-value {
  font-weight: bold;
  color: #000;
  font-size: 13px;
}

/* Right: Collateral Grid - ไม่มี design */
.collateral-grid {
  padding: 12px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  align-content: start;
}

.collateral-box {
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 8px;
}

.collateral-info-row {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
  font-size: 12px;
}

.collateral-info-row:last-child {
  border-bottom: none;
}

.col-label {
  font-weight: 500;
  color: #000000;
}

.col-value {
  font-weight: bold;
  color: #000;
}

.col-status {
  color: #000000;
  font-weight: 400;
}

/* ⭐ จัด no-collateral ให้อยู่กึ่งกลางแนวตั้งและแนวนอน */
.no-collateral {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 120px;
  padding: 20px;
  color: #999;
}

.no-collateral p {
  margin-top: 8px;
  font-size: 13px;
}

.separator-line {
  border-color: #ccc !important;
  border-width: 1px !important;
}

/* ========== END UPDATED BOX LAYOUT ========== */

/* === ส่วนอื่นๆ (คงเดิม) === */
.footer-contact {
  color: white;
  font-size: 16px;
  line-height: 1.6;
  font-weight: 500 !important;
}

.report-footer {
  background: #0a1e77;
}

.report-wrapper {
  background-color: #f5f5f5;
  min-height: 100vh;
  padding: 20px;
}

.action-buttons {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.report-container {
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.section-title { 
  font-size: 16px;
  margin: 1; 
}

.document-info-wrapper { 
  margin-top: 40px;
  margin-bottom: 8px; 
}

.document-info-flex { 
  display: flex; 
  justify-content: space-between; 
  align-items: flex-start; 
  gap: 20px; 
}

.document-info-left, 
.document-info-right { 
  flex: 1; 
  font-size: 14px; 
}

.document-info-right { 
  text-align: right; 
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
  border-bottom: 1px solid #e0e0e0;
  font-weight: 500;
}

.score-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 16px;
  background: white;
  border-radius: 4px;
}

.score-label { 
  font-weight: 500; 
}

.score-value { 
  font-weight: bold; 
  color: #000000; 
}

.score-display {
  width: 400px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.score-number {
  font-size: 80px;
  font-weight: bold;
  color: #000;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.score-bar-container {
  display: flex;
  width: 100%;
  height: 40px;
  border-radius: 4px;
  overflow: hidden;
}

.score-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000;
  font-size: 12px;
  font-weight: bold;
  text-align: center;
  padding: 4px;
}

.score-bar.poor { 
  background-color: #FF0000; 
  flex: 300; 
}

.score-bar.medium { 
  background-color: #FFA500; 
  flex: 300; 
}

.score-bar.good { 
  background-color: #FFFF00; 
  flex: 300; 
  color: #333; 
}

.score-bar.very-good { 
  background-color: #9ACD32; 
  flex: 300; 
}

.score-bar.extra { 
  background-color: #228B22; 
  flex: 300; 
}

.factors-table {
  font-size: 12px !important;
  line-height: 1.3 !important;
}

.factors-table-header {
  background-color: #0a1e77 !important;
}

.factors-table-header th {
  color: white !important;
  font-weight: bold !important;
  font-size: 12px !important;
  padding: 6px 8px !important;
  line-height: 1.3 !important;
  height: 36px !important;
}

.factors-table tbody td {
  font-size: 12px !important;
  padding: 6px 8px !important;
  line-height: 1.3 !important;
  height: 34px !important;
}

.mini-table-center {
  display: inline-block;
  vertical-align: middle;
  line-height: 1;
}

.compact-center-table {
  display: inline-table !important;
  margin: 0 !important;
  border: 1px solid #ccc;
  border-radius: 4px;
  overflow: hidden;
  font-size: 12px !important;
  width: 220px !important;
  line-height: 1.3 !important;
}

.compact-center-table th,
.compact-center-table td {
  padding: 6px 8px !important;
  text-align: center !important;
  vertical-align: middle !important;
  white-space: nowrap;
  font-weight: 500 !important;
  line-height: 1.3 !important;
}

.compact-center-table th {
  background-color: #0a1e77 !important;
  color: white !important;
  font-weight: bold !important;
  font-size: 12px !important;
  height: 32px !important;
}

.compact-center-table td {
  background-color: #f8f9fa;
  font-size: 12px !important;
  font-weight: bold !important;
  height: 30px !important;
}

.d-flex.gap-1 {
  gap: 4px !important;
  align-items: center !important;
}

table,
.v-table,
.factors-table,
.report-container table {
  border: 1px solid #ccc !important;
  border-radius: 4px !important;
}

table th, table td,
.v-table th, .v-table td,
.factors-table th, .factors-table td,
.report-container table th,
.report-container table td {
  border: none !important;
}

/* ============================================
   🖨️ ส่วนที่ 2: CSS สำหรับการพิมพ์ (PRINT)
   ============================================ */
@media print {
  /* ⭐ ลบ border/background ทั้งหมดที่อาจรั่วออกมา */
  * {
    box-shadow: none !important;
    outline: none !important;
  }
  
  html, body {
    margin: 0 !important;
    padding: 0 !important;
    background: white !important;
    border: none !important;
    outline: none !important;
    font-size: 9pt !important;
    line-height: 1.3 !important;
  }

  .v-application,
  .v-main,
  .v-main__wrap,
  .v-application__wrap {
    background: white !important;
    border: none !important;
    box-shadow: none !important;
    outline: none !important;
  }

  @page {
    size: A4;
    margin: 10mm;
  }

  .no-print {
    display: none !important;
  }
  
  .report-wrapper {
    background: white !important;
    padding: 0 !important;
    margin: 0 !important;
    border: none !important;
    box-shadow: none !important;
  }
  
  .report-container {
    box-shadow: none !important;
    max-width: 100% !important;
    margin: 0 !important;
    border: none !important;
    background: white !important;
  }

  /* ========== PRINT: BOX LAYOUT ========== */
  
  /* ⭐ ให้ loan wrapper แบ่งหน้าได้ตามธรรมชาติ */
  .loan-collateral-wrapper {
    page-break-inside: auto; /* เปลี่ยนจาก avoid เป็น auto */
    margin-bottom: 8px;
  }

  /* ⭐ ให้ box container แบ่งหน้าได้ */
  .box-layout-container {
    border: 0.5px solid #a3a0a0;
    border-radius: 6px;
    overflow: hidden;
    page-break-inside: auto; /* อนุญาตให้แบ่งหน้าได้ */
  }

  /* HEADER ROW (Print) */
  .box-header-row {
    display: grid;
    grid-template-columns: 1fr 3fr;
    border-bottom: 0.5px solid #a3a0a0;
    page-break-after: avoid; /* ป้องกัน header แยกจาก content */
  }

  .box-header {
    padding: 4px 6px;
    font-size: 8pt !important;
    display: flex;
    align-items: center;
    justify-content: flex-start !important;
  }

  .loan-header {
    background: #0a1e77 !important;
    color: white !important;
    border-right: 0.5px solid #a3a0a0;
    justify-content: flex-start !important;
  }

  .collateral-header {
    background: #0a1e77 !important;
    color: white !important;
    justify-content: flex-start !important;
  }

  /* CONTENT ROW (Print) */
  .box-content-row {
    display: grid;
    grid-template-columns: 1fr 3fr;
    min-height: auto;
    page-break-inside: auto; /* อนุญาตให้แบ่งหน้าได้ */
  }

  /* LOAN BOX (Print) - ป้องกันแยกครึ่ง */
  .loan-box {
    padding: 4px;
    border-right: 0.5px solid #a3a0a0;
    background: white;
    page-break-inside: avoid; /* ป้องกัน loan info แยกครึ่ง */
  }

  .loan-info-row {
    padding: 1px 3px;
    margin-bottom: 1px;
    font-size: 6pt !important;
    line-height: 1.2;
    background: white;
    border: none;
  }

  .info-label {
    font-size: 7pt !important;
    font-weight: 500;
  }

  .info-value {
    font-size: 7pt !important;
    font-weight: bold;
  }

  /* COLLATERAL GRID (Print) - อนุญาตให้แบ่งหน้าได้ */
  .collateral-grid {
    padding: 4px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 4px;
    page-break-inside: auto; /* ⭐ อนุญาตให้แบ่งหน้าได้ */
  }

  /* COLLATERAL BOX - ป้องกันแต่ละกล่องแยกครึ่ง */
  .collateral-box {
    border: 0.5px solid #a3a0a0;
    border-radius: 4px;
    padding: 4px;
    page-break-inside: avoid; /* ⭐ ป้องกัน collateral box แต่ละอันแยกครึ่ง */
    background: white;
  }

  .collateral-info-row {
    padding: 2px 0;
    font-size: 7pt !important;
    line-height: 1.2;
  }

  .col-label,
  .col-value {
    font-size: 7pt !important;
  }

  /* ⭐ จัด no-collateral กึ่งกลางในโหมด print */
  .no-collateral {
    grid-column: 1 / -1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 8px;
    font-size: 7pt !important;
    min-height: 50px;
  }

  .separator-line {
    margin: 4px 0 !important;
    border-width: 1px !important;
  }

  /* ========== END PRINT BOX LAYOUT ========== */

  /* ========== ส่วนอื่นๆ - Print Styles ========== */
  
  .section-title {
    font-size: 9pt !important;
    margin-bottom: 3px !important;
    line-height: 1.3 !important;
  }

  .header-section {
    padding: 4px !important;
  }

  .header-section h3 {
    font-size: 10pt !important;
    margin-bottom: 2px !important;
    line-height: 1.3 !important;
  }

  .header-section p {
    font-size: 9pt !important;
    margin-bottom: 2px !important;
    line-height: 1.3 !important;
  }

  .header-section .my-2 {
    margin: 2px 0 !important;
    font-size: 9pt !important;
  }

  .report-title {
    margin-bottom: 3px !important;
    padding: 4px !important;
  }

  .report-title h2 {
    font-size: 11pt !important;
    margin-bottom: 2px !important;
    line-height: 1.3 !important;
  }

  .report-title p {
    font-size: 9pt !important;
    line-height: 1.3 !important;
  }

  .document-info-wrapper {
    margin-top: 0px !important;
    margin-bottom: 3px !important;
    padding: 0 4px !important;
    page-break-inside: avoid !important;
  }

  .document-info-flex {
    display: flex !important;
    flex-direction: row !important;
    justify-content: space-between !important;
    align-items: flex-start !important;
    page-break-inside: avoid !important;
  }

  .document-info-left,
  .document-info-right {
    font-size: 9pt !important;
    line-height: 1.3 !important;
    page-break-inside: avoid !important;
  }

  .personal-info-section {
    padding: 4px !important;
    margin-bottom: 3px !important;
    page-break-inside: avoid;
  }

  .personal-info-section .personal-info-grid {
    display: grid !important;
    padding: 10px !important;
    grid-template-columns: repeat(3, 1fr) !important;
    gap: 3px !important;
    column-gap: 5px !important;
  }

  .personal-info-section .info-column {
    width: 100% !important;
    padding: 0px !important;
  }

  .personal-info-section .info-row {
    padding: 2px 0 !important;
    font-size: 9pt !important;
    display: flex !important;
    justify-content: space-between !important;
    border-bottom: 1px solid #e0e0e0 !important;
    line-height: 1.3 !important;
  }

  .personal-info-section .info-row span {
    font-size: 9pt !important;
  }

  .conditional-scores-section {
    padding: 4px !important;
    margin-bottom: 3px !important;
    page-break-inside: avoid;
  }

  .conditional-scores-section .scores-grid {
    display: grid !important;
    padding: 13px !important;
    grid-template-columns: repeat(3, 1fr) !important;
    gap: 3px !important;
    column-gap: 5px !important;
    border-bottom: 1px solid #ddd;
  }

  .conditional-scores-section .score-column {
    width: 100% !important;
    padding: 0px !important;
  }

  .conditional-scores-section .score-item {
    padding: 3px 5px !important;
    margin-bottom: 2px !important;
    font-size: 8pt !important;
    line-height: 1.3 !important;
    border: 1px solid #ddd;
  }

  .conditional-scores-section .score-label,
  .conditional-scores-section .score-value {
    font-size: 8pt !important;
  }

  .credit-score-section {
    page-break-inside: avoid;
    padding: 4px !important;
    margin-bottom: 3px !important;
  }

  .credit-score-section .text-subtitle-1 {
    font-size: 8pt !important;
    margin-bottom: 3px !important;
    line-height: 1.3 !important;
  }

  .score-display {
    width: 300px !important;
    height: 100px !important;
    margin-bottom: 4px !important;
  }

  .score-number {
    font-size: 50px !important;
  }

  .score-bar-container {
    height: 28px !important;
    margin-bottom: 4px !important;
  }

  .score-bar {
    font-size: 8pt !important;
    padding: 2px !important;
    line-height: 1.2 !important;
    border-bottom: 1px solid #ddd;
  }

  .score-factors-section {
    page-break-inside: avoid;
    padding: 4px !important;
    margin-bottom: 3px !important;
  }

  .score-factors-section .text-body-2,
  .score-factors-section p {
    font-size: 8pt !important;
    margin-bottom: 1px !important;
    line-height: 1.3 !important;
  }

  .factors-table {
    font-size: 9pt !important;
    line-height: 1.3 !important;
    page-break-inside: avoid;
  }

  .factors-table-header th {
    padding: 3px 5px !important;
    font-size: 7pt !important;
    line-height: 1.3 !important;
    height: 18px !important;
    background-color: #0a1e77 !important;
    color: white !important;
  }

  .factors-table tbody td {
    padding: 3px 5px !important;
    font-size: 7pt !important;
    line-height: 1.3 !important;
    height: 18px !important;
  }

  .compact-center-table {
    font-size: 8pt !important;
    width: 180px !important;
    line-height: 1.3 !important;
    page-break-inside: avoid;
  }

  .compact-center-table th {
    padding: 3px 5px !important;
    font-size: 8pt !important;
    line-height: 1.3 !important;
    height: 20px !important;
    background-color: #0a1e77 !important;
    color: white !important;
  }

  .compact-center-table td {
    padding: 3px 5px !important;
    font-size: 8pt !important;
    line-height: 1.3 !important;
    height: 18px !important;
  }

  .mini-table-center {
    line-height: 1.3 !important;
  }

  .d-flex.gap-1 strong {
    font-size: 8pt !important;
  }

  /* === Global Print Styles === */
  p, div, span, strong {
    font-size: 9pt !important;
    line-height: 1.3 !important;
  }

  table {
    font-size: 9pt !important;
    line-height: 1.3 !important;
    page-break-inside: avoid;
  }

  thead {
    display: table-header-group;
  }

  tr {
    page-break-inside: avoid;
  }

  th, td {
    font-size: 9pt !important;
    line-height: 1.3 !important;
  }

  v-card,
  .v-card {
    page-break-inside: auto; /* ⭐ เปลี่ยนเป็น auto */
    box-shadow: none !important;
    padding: 4px !important;
    margin-bottom: 3px !important;
    border: none !important;
    background: white !important;
  }

  .pa-3 {
    padding: 4px !important;
  }

  .pa-4 {
    padding: 4px !important;
  }

  .mb-2 {
    margin-bottom: 3px !important;
  }

  .mb-4 {
    margin-bottom: 4px !important;
  }

  .my-2 {
    margin-top: 3px !important;
    margin-bottom: 3px !important;
  }

  .my-3 {
    margin-top: 3px !important;
    margin-bottom: 3px !important;
  }

  .my-4 {
    margin-top: 4px !important;
    margin-bottom: 4px !important;
  }

  .mx-4 {
    margin-left: 5px !important;
    margin-right: 5px !important;
  }

  .px-4 {
    padding-left: 5px !important;
    padding-right: 5px !important;
  }

  .v-alert {
    font-size: 9pt !important;
    padding: 3px !important;
    margin: 3px !important;
    line-height: 1.3 !important;
  }

  .v-divider {
    margin: 3px 0 !important;
  }

  .report-footer {
    background: #0a1e77 !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .footer-contact {
    font-size: 9pt !important;
    line-height: 1.4 !important;
  }

  .credit-lines-container {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }

  .credit-lines-label {
    font-size: 9pt !important;
    line-height: 20px !important;
  }

  .credit-lines-badges {
    gap: 4px;
  }

  .currency-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 3px 14px;
    border-radius: 15px;
    font-size: 8px;
    font-weight: 500;
    box-shadow: none !important;
    background: white !important;
    border: 1px solid #696a70 !important;
    color: #000000 !important;
    margin-bottom: 4px !important;
  }

  .badge-currency {
    font-weight: 600;
    font-size: 8px;
    letter-spacing: 0.5px;
  }

  .badge-amount {
    font-weight: 600;
    font-size: 8px;
  }

 /* new */
  .v-col-lg-2-4 {
    flex: 0 0 20% !important;
    max-width: 20% !important;
  }

  .dashboard-grid {
    margin: 0 !important;
  }

  .dashboard-card {
    page-break-inside: avoid;
    margin-bottom: 4px;
    box-shadow: none !important;
    border: 0.5px solid #ddd !important;
  }

  .dashboard-card:hover {
    transform: none;
    box-shadow: none !important;
  }

  .dashboard-header {
    padding: 4px 6px !important;
  }

  .dashboard-title {
    font-size: 6pt !important;
  }

  .dashboard-weight {
    font-size: 7pt !important;
  }

  .dashboard-item {
    padding: 3px 0 !important;
  }

  .dashboard-item-label {
    font-size: 6pt !important;
  }

  .dashboard-item-attr {
    font-size: 7pt !important;
    min-height: auto !important;
    margin-bottom: 3px !important;
  }

  .dashboard-metrics {
    gap: 2px !important;
  }

  .metric-chip {
    padding: 2px 5px !important;
    font-size: 6pt !important;
  }

  .metric-chip:hover {
    transform: none;
  }

  .metric-chip-label {
    font-size: 6pt !important;
  }

  .metric-chip-value {
    font-size: 6pt !important;
  }
}
</style>