<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from "axios";

const router = useRouter();
const config = useRuntimeConfig();

// ⭐ Config API URL (ใช้ config จาก Nuxt)
const apiCreditScoreURL = `${config.public.strapi.url}api/credit-score/calculate/`;

// ข้อมูลพื้นฐาน
const lcicID = ref("");
const enquiryReference = ref("");  // ⭐ จะเป็น rec_reference_code
const recSysId = ref("");  // ⭐ เพิ่มตัวแปรนี้สำหรับ rec_sys_id
const reportDate = ref("");
const loading = ref(false);
const error = ref("");

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

// ⭐ คะแนนเงื่อนไข - ใช้ชื่อตรงกับ API
const conditionalScores = ref({
  gender: 0,
  province: 0,
  marital_status: 0,
  age: 0,
  registration_year: 0,
  loan_purpose: 0,
  loan_term: 0,
  credit_line: 0,
  inquiries: 0,
  overdue_days: 0,
  collateral_type: 0,
  collateral_value: 0,
  outstanding_balance: 0
});

// ⭐ คะแนนสินเชื่อ (ใช้จาก API โดยตรง ไม่คำนวณเอง)
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

// ฟังก์ชันกลับหน้าก่อนหน้า
const goBack = () => {
  router.back();
};

// ฟังก์ชันพิมพ์
const printReport = () => {
  window.print();
};

// ⭐ ฟังก์ชันเรียก API (ใช้ axios)
const fetchCreditScore = async (lcic_id: string) => {
  loading.value = true;
  error.value = "";
  
  try {
    const response = await axios.get(apiCreditScoreURL, {
      params: {
        lcic_id: lcic_id
      }
    });
    
    // ตรวจสอบ response
    if (response.data && response.data.success && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(response.data.error || 'ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນ');
    }
  } catch (err: any) {
    console.error('Error fetching credit score:', err);
    
    // Handle axios error
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

// ⭐ ฟังก์ชันแปลงข้อมูลจาก API มาเป็น Format ที่ใช้ใน Frontend
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
  

  // ⭐ 2. คะแนนเงื่อนไข - ดึงจาก individual_scores
  const individualScores = apiData.final_score_calculation?.calculation_details?.individual_scores || {};
  
  conditionalScores.value = {
    gender: individualScores.gender || 0,
    province: individualScores.province || 0,
    marital_status: individualScores.marital_status || 0,
    age: individualScores.age || 0,
    registration_year: individualScores.registration_year || 0,
    loan_purpose: individualScores.loan_purpose || 0,
    loan_term: individualScores.loan_term || 0,
    credit_line: individualScores.credit_line || 0,
    inquiries: individualScores.inquiries || 0,
    overdue_days: individualScores.overdue_days || 0,
    collateral_type: individualScores.collateral_type || 0,
    collateral_value: individualScores.collateral_value || 0,
    outstanding_balance: individualScores.outstanding_balance || 0
  };
  
  // ⭐ 3. คะแนนสินเชื่อ - ใช้ final_credit_score จาก API โดยตรง (ไม่คำนวณใน Frontend)
  creditScore.value = apiData.final_credit_score || 0;
  
  // ⭐ 4. ข้อมูลสินเชื่อ - กรองเฉพาะ ACTIVE เท่านั้น
  const loanSummary = apiData.loan_summary;
  const allLoans = loanSummary.loans_detail || [];
  
  // กรองเฉพาะสินเชื่อที่มีสถานะ ACTIVE
// ในฟังก์ชัน mapApiDataToFrontend, ส่วน loans
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
    // เพิ่มการ map collaterals ให้ครบถ้วน
    collaterals: (loan.collaterals || []).map((col: any) => ({
      col_type: col.col_type || "",
      col_type_name_eng: col.col_type_name_eng || "",  // ⭐ เพิ่มบรรทัดนี้
      col_type_name_lao: col.col_type_name_lao || "",  // ⭐ เพิ่มบรรทัดนี้
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
  
// ⭐ 5. ธนาคารที่มี Active - แสดงชื่อเต็ม
  const activeLoans = allLoans.filter((l: any) => l.loan_status === 'ACTIVE');
  
  // สร้าง array ของชื่อธนาคาร
  const bankDisplays = activeLoans.map((l: any) => {
    if (l.bank_info && l.bank_info.display_code) {
      return `${l.bank_info.code}`;
    }
    return l.bnk_code || '';
  });
  
  // เอาชื่อที่ไม่ซ้ำกัน
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

// โหลดข้อมูลจาก sessionStorage และเรียก API
// โหลดข้อมูลจาก sessionStorage และเรียก API
onMounted(async () => {
  const storedLcicID = sessionStorage.getItem("lcic_id");
  
  if (!storedLcicID) {
    error.value = "ບໍ່ພົບຂໍ້ມູນ ";
    lcicID.value = "ບໍ່ພົບຂໍ້ມູນ ";
    return;
  }
  
  lcicID.value = storedLcicID;
  
  // ⭐ ดึงข้อມูล scoring_data จาก sessionStorage
  const scoringDataStr = sessionStorage.getItem("scoring_data");
  if (scoringDataStr) {
    try {
      const scoringData = JSON.parse(scoringDataStr);
      
      // ตั้งค่า enquiryReference จาก rec_reference_code
      if (scoringData.rec_reference_code) {
        enquiryReference.value = scoringData.rec_reference_code;
      }
      
      // ตั้งค่า recSysId จาก rec_sys_id
      if (scoringData.rec_sys_id) {
        recSysId.value = scoringData.rec_sys_id.toString();
      }
      
      // ⭐ ตั้งค่า reportDate จาก rec_insert_date
      if (scoringData.rec_insert_date) {
        reportDate.value = scoringData.rec_insert_date;
      }
      
    } catch (e) {
      console.error("Error parsing scoring data:", e);
    }
  }
  
  // ถ้าไม่มีข้อมูลจาก API ให้สร้างค่า default
  if (!enquiryReference.value) {
    enquiryReference.value = `REF${new Date().getFullYear()}-${storedLcicID.slice(-6)}`;
  }
  
  // ⭐ ถ้าไม่มี reportDate จาก API ให้ใช้วันที่ปัจจุบัน
  if (!reportDate.value) {
    const today = new Date();
    reportDate.value = today.toLocaleDateString('lo-LA', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    });
  }
  
  // เรียก API
  try {
    const apiData = await fetchCreditScore(storedLcicID);
    mapApiDataToFrontend(apiData);
  } catch (err) {
    console.error('Failed to load credit score:', err);
  }
});

// ฟังก์ชันแปลงชื่อ
function getScoreLabel(key: string): string {
  const labels: Record<string, string> = {
    gender: 'ເພດ',
    province: 'ທີ່ຢູ່',
    marital_status: 'ສະຖານະພາບ',
    age: 'ອາຍຸ',
    registration_year: 'ວັນທີມີຂໍ້ມູນໃນຖານ',
    loan_purpose: 'ເປົ້າໝາຍເງິນກູ້',
    loan_term: 'ໄລຍະການກູ້ຢືມ',
    credit_line: 'ວົງເງິນສິນເຊື່ອ',
    inquiries: 'ຈຳນວນສອບຖາມ',
    overdue_days: 'ວັນທີຄ້າງຊຳລະ',
    collateral_type: 'ປະເພດຫຼັກຊັບ',
    collateral_value: 'ມູນຄ່າຫຼັກຊັບທຽບຍອດເຫຼືອໜີ້',
    outstanding_balance: 'ຄະແນນຍອດເຫຼືອໜີ້'
  };
  return labels[key] || key;
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
      
        <!-- ปุ่ม Back และ Print - ไม่พิมพ์ -->
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

      <!-- ⭐ แสดง Skeleton Loader เมื่อกำลังโหลด -->
      <v-card v-if="loading" flat class="report-container">
        <v-skeleton-loader
          type="article, table, table"
        ></v-skeleton-loader>
      </v-card>

      <!-- Report Container (แสดงเมื่อโหลดเสร็จ) -->
      <v-card v-else-if="!loading && !error" flat class="report-container">
        <v-col cols="8" class="text-center">
          <div>
            <v-row align="center">
              <v-col cols="auto">
                <v-img
                  src="/images/logo1.png"
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

        <!-- Logo และหัวข้อ -->
        <div class="text-center pa-2 header-section">
            <v-img
                src="/images/national_symbol.png"
                width="100"
                style="margin: 0 auto;"
            ></v-img>
          <h3 class="text-h6">ສາທາລະນະລັດ ປະຊາທິປະໄຕ ປະຊາຊົນລາວ</h3>
          <h3 class="text-h6">ສັນຕິພາບ ເອກະລາດ ປະຊາທິປະໄຕ ເອກະພາບ ວັດທະນະຖາວອນ</h3>
          <div class="my-2">======00000======</div>
        </div>

        <!-- ข้อมูลเอกสาร -->
        <div class="document-info-wrapper px-4 mb-2">
          <div class="document-info-flex">
            <div class="document-info-left">
              <strong>ທະນາຄານແຫ່ງ ສປປ ລາວ</strong><br>
              ບໍລິສັດຂໍ້ມູນຂ່າວສານສິນເຊື່ອແຫ່ງ ສປປ ລາວ
            </div>
            <div class="document-info-right">
              <strong>ເລກທີ:</strong> {{ recSysId }}/ຂສລ<br>
              <strong>ນະຄອນຫຼວງວຽງຈັນ, ວັນທີ:</strong> {{ reportDate }}
            </div>
          </div>
        </div>

        <!-- ชื่อรายงาน -->
        <div class="text-center mb-2 pa-6 report-title">
          <h2 class="text-h5 font-weight-bold">ບົດລາຍງານການໃຫ້ຄະແນນສິນເຊື່ອ</h2>
          <p class="text-subtitle-1">(ສຳລັບບຸກຄົນ)</p>
        </div>

        <v-divider class="my-2"></v-divider>

        <!-- ข้อมูลอ้างอิง -->
        <v-card flat class=" text-center pa-3 mb-2 reference-info-card ml-6" color="grey-lighten-4">
          <div class="reference-info-flex">
            <div class="reference-info-item">
              <strong>ເລກອ້າງອິງ:</strong> {{ enquiryReference }}
            </div>
            <div class="reference-info-item">
              <strong>LCIC ID:</strong> {{ lcicID }}
            </div>
          </div>
        </v-card>

        <!-- ข้อมูลส่วนบุคคล -->
        <v-card flat class="pa-3 mb-2 personal-info-section">
          <h3 class="text-h7 mb-2 font-weight-bold section-title">
                <v-icon >mdi-dot</v-icon>
                ຂໍ້ມູນສ່ວນບຸກຄົນ
          </h3>
          <v-row dense class="personal-info-grid">
            <v-col cols="12" md="6" lg="4" class="info-column">
              <div class="info-row">
                <span class="font-weight-bold">ບັດປະຈຳຕົວ:</span>
                <span>{{ personalInfo.nationalID }}</span>
              </div>
            </v-col>
            <v-col cols="12" md="6" lg="4" class="info-column">
              <div class="info-row">
                <span class="font-weight-bold">ສຳມະໂນຄົວ:</span>
                <span>{{ personalInfo.familyBook }}</span>
              </div>
            </v-col>
            <v-col cols="12" md="6" lg="4" class="info-column">
              <div class="info-row">
                <span class="font-weight-bold">ໜັງສືຜ່ານແດນ:</span>
                <span>{{ personalInfo.passport }}</span>
              </div>
            </v-col>
            <v-col cols="12" md="6" lg="4" class="info-column">
              <div class="info-row">
                <span class="font-weight-bold">ສັນຊາດ:</span>
                <span>{{ personalInfo.nationality }}</span>
              </div>
            </v-col>
            <v-col cols="12" md="6" lg="4" class="info-column">
              <div class="info-row">
                <span class="font-weight-bold">ຊື່ພາສາລາວ:</span>
                <span>{{ personalInfo.laoName }}</span>
              </div>
            </v-col>
            <v-col cols="12" md="6" lg="4" class="info-column">
              <div class="info-row">
                <span class="font-weight-bold">ນາມສະກຸນພາສາລາວ:</span>
                <span>{{ personalInfo.laoSurname }}</span>
              </div>
            </v-col>
            <v-col cols="12" md="6" lg="4" class="info-column">
              <div class="info-row">
                <span class="font-weight-bold">ຊື່ພາສາອັງກິດ:</span>
                <span>{{ personalInfo.engName }}</span>
              </div>
            </v-col>
            <v-col cols="12" md="6" lg="4" class="info-column">
              <div class="info-row">
                <span class="font-weight-bold">ນາມສະກຸນພາສາອັງກິດ:</span>
                <span>{{ personalInfo.engSurname }}</span>
              </div>
            </v-col>
            <v-col cols="12" md="6" lg="4" class="info-column">
              <div class="info-row">
                <span class="font-weight-bold">ວັນເດືອນປີເກີດ:</span>
                <span>{{ personalInfo.birthDate }}</span>
              </div>
            </v-col>
          </v-row>
        </v-card>

        <!-- เงื่อนไขการให้คะแนน -->
        <v-card flat class="pa-3  conditional-scores-section" color="blue-lighten-5">
          <h3 class="text-h7 mb-1 font-weight-bold section-title">
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

        <!-- Credit Risk Score -->
        <v-card flat class="pa-3 mb-2 credit-score-section">
          <h3 class="text-h7 mb-2 font-weight-bold section-title">
            <v-icon>mdi-dot</v-icon>
            Credit Risk Score
        </h3>
          <div class="text-center mb-2">
            <p class="text-subtitle-1 font-weight-bold">ຄະແນນສິນເຊື່ອຂອງທ່ານແມ່ນ</p>
          </div>
          
          <!-- ⭐ คะแนนขนาดใหญ่ - ใช้จาก API โดยตรง -->
          <div class="score-display mx-auto mb-3" :style="{ backgroundColor: scoreColor }">
            <span class="score-number">{{ creditScore }}</span>
          </div>

          <!-- แถบสี -->
          <div class="score-bar-container mb-2">
            <div class="score-bar poor">Poor: ອ່ອນ: 350-579</div>
            <div class="score-bar medium">Medium: ປານກາງ: 580-669</div>
            <div class="score-bar good">Good: ດີ: 670-739</div>
            <div class="score-bar very-good">Very good: ດີຫຼາຍ: 740-799</div>
            <div class="score-bar extra">Extra: ພິເສດ: 800-850</div>
          </div>
        </v-card>

        <!-- Score Factors -->
        <v-card flat class="pa-3 mb-2 score-factors-section">
          <h3 class="text-h7 mb-2 font-weight-bold section-title">
            <v-icon>mdi-dot</v-icon>
            SCORE FACTORS
        </h3>
          <div class="mb-2 text-body-2">
            <p>1. Your Credit Line greater than outstanding amount.</p>
            <p>2. You have 30-60 days overdue.</p>
            <p>3. but your collateral value is larger than the outstanding loan.</p>
          </div>

          <v-table density="compact" class="factors-table">
            <thead class="factors-table-header">
              <tr>
                <th class="text-center font-weight-bold">Area</th>
                <th class="text-center font-weight-bold">Amount owned</th>
                <th class="text-center font-weight-bold">Payment History</th>
                <th class="text-center font-weight-bold">Length of Credit History</th>
                <th class="text-center font-weight-bold">New Inquiries</th>
                <th class="text-center font-weight-bold">Credit Mix</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="text-center font-weight-bold">Weight(%)</td>
                <td class="text-center font-weight-bold">35%</td>
                <td class="text-center font-weight-bold">30%</td>
                <td class="text-center font-weight-bold">15%</td>
                <td class="text-center font-weight-bold">10%</td>
                <td class="text-center font-weight-bold">10%</td>
              </tr>
            </tbody>
          </v-table>
        </v-card>

        <!-- Financial Overview -->
        <v-card flat class="pa-3 mb-2">
          <h3 class="text-h7 mb-2 font-weight-bold section-title">
            <v-icon>mdi-dot</v-icon>
            FINANCIAL OVERVIEW
        </h3>
          
          <!-- Active Accounts -->
          <div class="mb-1 font-weight-bold">
            <strong>Active Accounts With:</strong> {{ activeBanks }}
          </div>

          <!-- ວົງເງິນລວມ: + ตาราง 2 คอลัมน์ จัดกึ่งกลาง กระชับ -->
          <div class="d-flex align-center gap-1">
            <strong>ວົງເງິນລວມ:</strong>
            <div class="mini-table-center ml-4">
              <v-table density="compact" class="compact-center-table">
                <thead>
                  <tr>
                    <th>ສະກຸນ</th>
                    <th>ວົງເງິນ</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(line, index) in overallCreditLines" :key="index">
                    <td>{{ line.currency }}</td>
                    <td>{{ line.amount }}</td>
                  </tr>
                </tbody>
              </v-table>
            </div>
          </div>
        </v-card>

        <!-- ⭐ ตารางสินเชื่อ (แสดงเฉพาะ ACTIVE เท่านั้น) -->
        <v-card flat class="pa-3 mb-2">
          <h3 class="text-h7 mb-2 font-weight-bold section-title">
            <v-icon>mdi-dot</v-icon>
            ລາຍລະອຽດສິນເຊື່ອ (ACTIVE)
          </h3>
          
          <!-- ถ้าไม่มีสินเชื่อ ACTIVE -->
          <v-alert v-if="loans.length === 0" type="info" variant="tonal" density="compact">
            <v-icon size="small">mdi-information</v-icon>
            ບໍ່ມີສິນເຊື່ອທີ່ມີສະຖານະ ACTIVE
          </v-alert>

          <!-- Loop ผ่านแต่ละสินเชื่อ ACTIVE -->
          <div v-else v-for="(loan, loanIndex) in loans" :key="loanIndex" class="mb-4">
            <!-- ตารางสินเชื่อหลัก -->
            <v-table density="compact" class="mb-2">
              <thead class="bg-blue-lighten-4">
                <tr>
                  <th class="text-center">ທະນາຄານ</th>
                  <th class="text-center">ຈຸດປະສົງ</th>
                  <th class="text-center">ວົງເງິນສິນເຊື່ອ</th>
                  <th class="text-center">ຍອດເຫຼືອໜີ້</th>
                  <th class="text-center">ສະກຸນເງິນ</th>
                  <th class="text-center">ວັນທີຄ້າງຊຳລະ</th>
                  <th class="text-center">ປະເພດສິນເຊື່ອ</th>
                  <th class="text-center">ໄລຍະ</th>
                  <th class="text-center">ສະຖານະ</th>
                </tr>
              </thead>
              <tbody>
                <tr class="bg-blue-lighten-5">
                  <td class="text-center ">{{ loan.code_display }}</td>
                  <td class="text-center">{{ loan.purpose }}</td>
                  <td class="text-center">{{ loan.creditLine }}</td>
                  <td class="text-center">{{ loan.outstanding }}</td>
                  <td class="text-center">{{ loan.currency }}</td>
                  <td class="text-center">{{ loan.daysSlow }}</td>
                  <td class="text-center">{{ loan.loanType }}</td>
                  <td class="text-center">{{ loan.loanTerm }}</td>
                  <!-- <td class="text-center"><v-chip color="#35A646"size="small"variant="flat">
                      {{ loan.status }}</v-chip></td> -->
                  <td class="text-center" >{{ loan.status }}</td>
                </tr>
              </tbody>
            </v-table>

            <!-- ⭐ ปรับส่วน Sub-table หลักประกัน -->
            <div v-if="loan.collaterals && loan.collaterals.length > 0" class="ml-8 mb-2">
                <v-card flat color="grey-lighten-5" class="pa-2">
                <div class="d-flex align-center mb-2">
                    <v-icon size="small" class="mr-2" color="#4472ad">mdi-shield-check</v-icon>
                    <strong class="text-subtitle-2" >
                    ຫຼັກຊັບຄ້ຳປະກັນ ({{ loan.collateral_count }} ລາຍການ)
                    </strong>
                </div>
                
                <v-table density="compact" class="collateral-table">
                    <thead class="collateral-table-header">
                    <tr>
                        <th class="text-white " style="width: 40%;">ປະເພດຫຼັກຊັບ</th>

                        <th class="text-white text-center"style="width: 15%;">ມູນຄ່າ</th>
                        <th class="text-white text-center"style="width: 10%;">ໜ່ວຍ</th>
                        <th class="text-white text-center"style="width: 20%;">ສະຖານະ</th>

                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(collateral, colIndex) in loan.collaterals" :key="colIndex" class="collateral-row">
                        <td style="width: 40%;">
                        <v-chip size="small" >
                            {{ collateral.col_type_name_lao || collateral.col_type_name_eng }}
                        </v-chip>
                        </td>
                        <td class="text-center" style="width: 15%;">{{ formatNumber(collateral.value) }}</td>
                        <td class="text-center" style="width: 10%;">{{ collateral.value_unit || '-' }}</td>
                        <!-- <td class="text-center"><v-chip size="x-small" color="#35A646"variant="flat">
                            {{ collateral.status }}</v-chip></td> -->
                        <td class="text-center" style="width: 20%;">{{ collateral.status || '-'}}</td>
                    </tr>
                    </tbody>
                </v-table>
                </v-card>
            </div>

            <!-- Divider ระหว่างสินเชื่อ -->
            <!-- <v-divider v-if="loanIndex < loans.length - 1" class="my-3"></v-divider> -->
          </div>
        </v-card>

        <!-- หมายเหตุ -->
        <v-alert 
          type="warning" 
          color="red"
          variant="tonal" 
          class="mx-4 mb-2 "
        >
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
        <v-img 
            src="" 
            max-width="150"
            class="mx-auto"
        />
        </div>
      </v-card>
    </v-container>
  </div>
</template>

<style scoped>
/* === คงทุกอย่างเหมือนเดิม ยกเว้นสีตารางที่ขอ === */
/* ⭐ ปรับแต่ง CSS สำหรับตารางหลักประกัน */
.collateral-table { 
  font-size: 12px !important; 
  background: white; 
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

/* Header ตารางหลักประกัน - ใช้สีน้ำเงินเข้มเหมือนตารางอื่น */
.collateral-table-header {
  background-color: #4472ad !important;
}

.collateral-table-header th {
  color: white !important;
  font-weight: 500 !important;
  font-size: 11px !important;
  padding: 6px 8px !important;
  vertical-align: middle !important;
}

.collateral-table tbody tr {
  transition: background-color 0.2s ease;
}

.collateral-table tbody tr:hover {
  background-color: #f0f4ff !important; /* สีฟ้าอ่อนเมื่อ hover */
}

.collateral-row td {
  font-size: 11px !important; 
  padding: 6px 8px !important; 
  vertical-align: middle !important;
  border-bottom: 1px solid #f0f0f0;
  font-weight: bold !important;
}

/* ปรับสีข้อความ */
.text-success { 
  color: #2e7d32 !important; 
  font-weight: 600 !important;
}

.text-grey { 
  color: #9e9e9e !important; 
}

/* ปรับ v-chip ในตาราง */
.collateral-table .v-chip {
  font-weight: 500;
}
/* Footer contact info */
.footer-contact {
  color: white;
  font-size: 16px;
  line-height: 1.6;
  font-weight: 500 !important;
}

.report-footer {
  background: #0a1e77;
}
/* === ตารางวงเงินรวม 2 คอลัมน์ จัดกึ่งกลาง กระชับสุด ๆ === */
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
  font-size: 13px !important;
  width: 200px !important;
}

.compact-center-table th,
.compact-center-table td {
  padding: 3px 8px !important;
  text-align: center !important;
  vertical-align: middle !important;
  white-space: nowrap;
  font-weight: 500 !important;
}

.compact-center-table th {
  background-color: #0a1e77 !important;
  color: white !important;
  font-weight: bold !important;
  font-size: 13px !important;
}

.compact-center-table td {
  background-color: #f8f9fa;
  font-size: 13px !important;
  font-weight: bold !important;
}

/* ลดช่องว่างระหว่างข้อความกับตาราง */
.d-flex.gap-1 {
  gap: 4px !important;
  align-items: center !important;
}

/* --- เปลี่ยนสีเฉพาะ 3 ตาราง --- */
.mini-table-header,
.factors-table-header,
.bg-blue-lighten-4 {
  background-color: #0a1e77 !important;
}

.mini-table-header th,
.factors-table-header th,
.bg-blue-lighten-4 th {
  color: white !important;
  font-weight: bold !important;
}

/* แถวรองของ Loan Table */
.bg-blue-lighten-5 {
  background-color: #e6e8f5 !important; /* สีอ่อนรองรับ #0b1d70 */
  color: #000 !important;
}

/* --- ส่วนอื่น ๆ คงเดิมทั้งหมด --- */
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

.section-title { font-size: 16px; }

.document-info-wrapper { margin-bottom: 8px; }
.document-info-flex { display: flex; justify-content: space-between; align-items: flex-start; gap: 20px; }
.document-info-left, .document-info-right { flex: 1; font-size: 14px; }
.document-info-right { text-align: right; }

.reference-info-card { padding: 5px !important; }
.reference-info-flex { display: flex; justify-content: space-between; align-items: center; gap: 20px; }
.reference-info-item { flex: 1; font-size: 14px; }

.mini-table {
  max-width: 400px !important;
  width: 400px !important;
  margin: 0;
}
.mini-table td { padding: 8px !important; font-size: 13px !important; font-weight: bold !important; }

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
  border-bottom: 1px solid #e0e0e0;
}

.score-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 16px;
  background: white;
  border-radius: 4px;
  /* margin-bottom: 2px; */
}
.score-label { font-weight: 600; }
.score-value { font-weight: bold; color: #000000; }

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
.score-bar.poor { background-color: #FF0000; flex: 300; }
.score-bar.medium { background-color: #FFA500; flex: 300; }
.score-bar.good { background-color: #FFFF00; flex: 300; color: #333; }
.score-bar.very-good { background-color: #9ACD32; flex: 300; }
.score-bar.extra { background-color: #228B22; flex: 300; }
.collateral-table { font-size: 12px !important; background: white; }
.collateral-table th, .collateral-table td { font-size: 11px !important; padding: 4px 8px !important; }
.text-success { color: #2e7d32 !important; }
.text-grey { color: #9e9e9e !important; }

/* ... โค้ดเดิมทั้งหมด ... */

/* วางตรงนี้ ก่อน @media print */
table,
.v-table,
.factors-table,
.collateral-table,
.mini-table,
.report-container table {

  border: 1px solid #ccc !important;
  border-radius: 4px !important;

}

table th, table td,
.v-table th, .v-table td,
.factors-table th, .factors-table td,
.collateral-table th, .collateral-table td,
.mini-table th, .mini-table td,
.report-container table th,
.report-container table td {
  border: none !important;
}

/* (คัดลอกจากโค้ดเดิมของคุณมาแบบไม่แตะเลย) */
@media print {
  .no-print {
    display: none !important;
  }
  
  .report-wrapper {
    background: white;
    padding: 0;
  }
  
  .report-container {
    box-shadow: none;
    max-width: 100%;
    margin: 0;
  }

  @page {
    size: A4;
    margin: 8mm;
  }

  body {
    margin: 0;
    padding: 0;
    font-size: 10pt !important;
  }

  .section-title {
    font-size: 12pt !important;
    margin-bottom: 2px !important;
  }

  .header-section {
    padding: 4px !important;
  }

  .header-section h3 {
    font-size: 12pt !important;
    margin-bottom: 1px !important;
  }

  .header-section p {
    font-size: 9pt !important;
    margin-bottom: 1px !important;
  }

  .header-section .my-2 {
    margin: 1px 0 !important;
    font-size: 9pt !important;
  }

  .report-title {
    margin-bottom: 2px !important;
  }

  .report-title h2 {
    font-size: 13pt !important;
    margin-bottom: 1px !important;
  }

  .report-title p {
    font-size: 10pt !important;
  }

  .document-info-wrapper {
    margin-bottom: 2px !important;
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
    font-size: 10pt !important;
    line-height: 1.2 !important;
    page-break-inside: avoid !important;
  }

  .reference-info-card {
    padding: 3px !important;
    margin-bottom: 2px !important;
    page-break-inside: avoid !important;
  }

  .reference-info-flex {
    display: flex !important;
    flex-direction: row !important;
    justify-content: space-between !important;
    page-break-inside: avoid !important;
  }

  .reference-info-item {
    font-size: 10pt !important;
    line-height: 1.2 !important;
  }

  .personal-info-section {
    padding: 3px !important;
    margin-bottom: 2px !important;
  }

  .personal-info-section .personal-info-grid {
    display: grid !important;
    grid-template-columns: repeat(3, 1fr) !important;
    gap: 2px !important;
    column-gap: 4px !important;
  }

  .personal-info-section .info-column {
    width: 100% !important;
    padding: 0px !important;
  }

  .personal-info-section .info-row {
    padding: 2px 0 !important;
    font-size: 10pt !important;
    display: flex !important;
    justify-content: space-between !important;
    border-bottom: 1px solid #e0e0e0 !important;
  }

  .personal-info-section .info-row span {
    font-size: 10pt !important;
  }

  .conditional-scores-section {
    padding: 3px !important;
    margin-bottom: 2px !important;
  }

  .conditional-scores-section .scores-grid {
    display: grid !important;
    grid-template-columns: repeat(3, 1fr) !important;
    gap: 2px !important;
    column-gap: 4px !important;
  }

  .conditional-scores-section .score-column {
    width: 100% !important;
    padding: 0px !important;
  }

  .conditional-scores-section .score-item {
    padding: 2px 4px !important;
    margin-bottom: 2px !important;
    font-size: 10pt !important;
  }

  .conditional-scores-section .score-label,
  .conditional-scores-section .score-value {
    font-size: 10pt !important;
  }

  .credit-score-section {
    page-break-inside: avoid;
    padding: 3px !important;
    margin-bottom: 2px !important;
  }

  .credit-score-section .text-subtitle-1 {
    font-size: 10pt !important;
    margin-bottom: 2px !important;
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
    height: 25px !important;
    margin-bottom: 4px !important;
  }

  .score-bar {
    font-size: 8pt !important;
    padding: 1px !important;
  }

  .score-factors-section {
    page-break-inside: avoid;
    padding: 3px !important;
    margin-bottom: 2px !important;
  }

  .score-factors-section .text-body-2,
  .score-factors-section p {
    font-size: 9pt !important;
    margin-bottom: 1px !important;
  }

  .factors-table {
    font-size: 9pt !important;
  }

  .factors-table th,
  .factors-table td {
    padding: 2px !important;
    font-size: 9pt !important;
  }

  p, div, span, strong {
    font-size: 10pt !important;
  }

  table {
    font-size: 10pt !important;
  }

  thead {
    display: table-header-group;
  }

  tr {
    page-break-inside: avoid;
  }

  th, td {
    padding: 2px !important;
    font-size: 9pt !important;
  }

  .mini-table th,
  .mini-table td {
    font-size: 9pt !important;
    padding: 2px !important;
  }

  v-card,
  .v-card {
    page-break-inside: avoid;
    box-shadow: none !important;
    padding: 3px !important;
    margin-bottom: 2px !important;
  }

  .collateral-table {
    font-size: 9pt !important;
    margin-top: 2px !important;
  }

  .collateral-table th,
  .collateral-table td {
    font-size: 8pt !important;
    padding: 1px 2px !important;
  }

  .pa-3 {
    padding: 3px !important;
  }

  .pa-4 {
    padding: 3px !important;
  }

  .mb-2 {
    margin-bottom: 2px !important;
  }

  .mb-4 {
    margin-bottom: 3px !important;
  }

  .my-2 {
    margin-top: 2px !important;
    margin-bottom: 2px !important;
  }

  .my-3 {
    margin-top: 2px !important;
    margin-bottom: 2px !important;
  }

  .mx-4 {
    margin-left: 4px !important;
    margin-right: 4px !important;
  }

  .px-4 {
    padding-left: 4px !important;
    padding-right: 4px !important;
  }

  .ml-8 {
    margin-left: 8px !important;
  }

  .v-alert {
    font-size: 9pt !important;
    padding: 3px !important;
    margin: 3px !important;
  }

  .v-divider {
    margin: 2px 0 !important;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .action-buttons {
    flex-direction: column;
    gap: 10px;
  }

  .action-buttons .v-btn {
    width: 100%;
  }

  .score-display {
    width: 100%;
    max-width: 380px;
    height: 150px;
  }

  .score-number {
    font-size: 70px;
  }
    .footer-contact {
    font-size: 9pt !important;
    margin-bottom: 2px !important;
    color: white !important;
  }
  
  .collateral-table {
    font-size: 9pt !important;
    margin-top: 2px !important;
  }

  .collateral-table th,
  .collateral-table td {
    font-size: 8pt !important;
    padding: 2px 4px !important;
  }
  
  .collateral-row td {
    padding: 2px 4px !important;
  }
}
</style> 