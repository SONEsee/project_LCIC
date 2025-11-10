<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// ข้อมูลพื้นฐาน
const lcicID = ref("");
const enquiryReference = ref("");
const reportDate = ref("");

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

// คะแนนเงื่อนไข
const conditionalScores = ref({
  gender: 0,
  address: 0,
  maritalStatus: 0,
  age: 0,
  registrationDate: 0,
  loanPurpose: 0,
  loanTerm: 0,
  creditLine: 0,
  inquiries: 0,
  overdueDays: 0,
  collateralType: 0,
  collateralValue: 0,
  outstandingBalance: 0
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

// ฟังก์ชันกลับหน้าก่อนหน้า
const goBack = () => {
  router.back();
};

// ฟังก์ชันพิมพ์
const printReport = () => {
  window.print();
};

// โหลดข้อมูลจาก sessionStorage
onMounted(() => {
  const storedLcicID = sessionStorage.getItem("lcic_id");
  lcicID.value = storedLcicID || "ບໍ່ພົບຂໍ້ມູນ lcic_id";
  
  const today = new Date();
  reportDate.value = today.toLocaleDateString('lo-LA', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit' 
  });

  loadMockData();
});

// ตัวอย่างข้อมูล Mock
const loadMockData = () => {
  enquiryReference.value = "REF2024-001234";
  
  personalInfo.value = {
    nationalID: "1234567890123",
    familyBook: "FB12345",
    passport: "P1234567",
    nationality: "ລາວ",
    laoName: "ທົດສອບ",
    laoSurname: "ລາຍງານ",
    engName: "Test",
    engSurname: "Report",
    birthDate: "01/01/1990",
    age: 34,
    gender: "ຊາຍ",
    civilStatus: "ແຕ່ງງານແລ້ວ",
    address: "ນະຄອນຫຼວງວຽງຈັນ"
  };

  conditionalScores.value = {
    gender: 5,
    address: 8,
    maritalStatus: 10,
    age: 15,
    registrationDate: 20,
    loanPurpose: 12,
    loanTerm: 10,
    creditLine: 18,
    inquiries: 8,
    overdueDays: 25,
    collateralType: 15,
    collateralValue: 20,
    outstandingBalance: 15
  };

  creditScore.value = 720;
  activeBanks.value = "BCEL, LDB, APB";

  overallCreditLines.value = [
    { currency: "LAK", amount: "500,000,000" },
    { currency: "USD", amount: "50,000" },
    { currency: "THB", amount: "100,000" }
  ];

  loans.value = [
    {
      bank: "BCEL",
      purpose: "ສ້າງບ້ານ",
      creditLine: "200,000,000",
      outstanding: "150,000,000",
      currency: "LAK",
      daysSlow: 0,
      loanType: "ສິນເຊື່ອທົ່ວໄປ",
      loanTerm: "5 ປີ",
      status: "ACTIVE"
    }
  ];
};

// ฟังก์ชันแปลงชื่อ
function getScoreLabel(key: string): string {
  const labels: Record<string, string> = {
    gender: 'ເພດ',
    address: 'ທີ່ຢູ່',
    maritalStatus: 'ສະຖານະພາບ',
    age: 'ອາຍຸ',
    registrationDate: 'ວັນທີມີຂໍ້ມູນໃນຖານ',
    loanPurpose: 'ເປົ້າໝາຍເງິນກູ້',
    loanTerm: 'ໄລຍະການກູ້ຢືມ',
    creditLine: 'ວົງເງິນສິນເຊື່ອ',
    inquiries: 'ຈຳນວນສອບຖາມ',
    overdueDays: 'ວັນທີຄ້າງຊຳລະ',
    collateralType: 'ປະເພດຫຼັກຊັບ',
    collateralValue: 'ມູນຄ່າຫຼັກຊັບທຽບຍອດເຫຼືອໜີ້',
    outstandingBalance: 'ຄະແນນຍອດເຫຼືອໜີ້'
  };
  return labels[key] || key;
}
</script>

<template>
  <div class="report-wrapper">
    <v-container fluid class="pa-0">
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

      <!-- Report Container -->
      <v-card flat class="report-container">
        <v-col cols="8" class="text-center">
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
        <!-- Logo และหัวข้อ -->
        <div class="text-center pa-4 header-section">
          <!-- <v-img 
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQguq0YjU42M_ijrBwnE9IpgFAFeMZQCDDJVi3yrfOCog&s" 
            max-width="75"
            class="mx-auto mb-2"
          /> -->
          <h3 class="text-h6">ສາທາລະນະລັດ ປະຊາທິປະໄຕ ປະຊາຊົນລາວ</h3>
          <p class="text-subtitle-2">ສັນຕິພາບ ເອກະລາດ ປະຊາທິປະໄຕ ເອກະພາບ ວັດທະນະຖາວອນ</p>
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
              <strong>ເລກທີ:</strong> {{ enquiryReference }}/ສຂສ<br>
              <strong>ວຽງຈັນ, ວັນທີ:</strong> {{ reportDate }}
            </div>
          </div>
        </div>

        <!-- ชื่อรายงาน -->
        <div class="text-center mb-2 report-title">
          <h2 class="text-h5 font-weight-bold">ບົດລາຍງານການໃຫ້ຄະແນນສິນເຊື່ອ</h2>
          <p class="text-subtitle-1">(ສຳລັບບຸກຄົນ)</p>
        </div>

        <v-divider class="my-2"></v-divider>

        <!-- ข้อมูลอ้างอิง -->
        <v-card flat class="pa-3 mb-2 reference-info-card" color="grey-lighten-4">
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
          <h3 class="text-h6 mb-2 font-weight-bold section-title">ຂໍ້ມູນສ່ວນບຸກຄົນ</h3>
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
                <span>{{ personalInfo.birthDate }} ({{ personalInfo.age }} ປີ)</span>
              </div>
            </v-col>
          </v-row>
        </v-card>

        <!-- เงื่อนไขการให้คะแนน -->
        <v-card flat class="pa-3 mb-2 conditional-scores-section" color="blue-lighten-5">
          <h3 class="text-h6 mb-2 font-weight-bold section-title">ເງື່ອນໄຂການໃຫ້ຄະແນນ</h3>
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
          <h3 class="text-h6 mb-2 font-weight-bold section-title">Credit Risk Score</h3>
          <div class="text-center mb-2">
            <p class="text-subtitle-1">ຄະແນນສິນເຊື່ອຂອງທ່ານແມ່ນ</p>
          </div>
          
          <!-- คะแนนขนาดใหญ่ -->
          <div class="score-display mx-auto mb-2" :style="{ backgroundColor: scoreColor }">
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
          <h3 class="text-h6 mb-2 font-weight-bold section-title">SCORE FACTORS</h3>
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
                <td class="text-center">Weight(%)</td>
                <td class="text-center">35%</td>
                <td class="text-center">30%</td>
                <td class="text-center">15%</td>
                <td class="text-center">10%</td>
                <td class="text-center">10%</td>
              </tr>
            </tbody>
          </v-table>
        </v-card>

        <!-- Financial Overview -->
        <v-card flat class="pa-3 mb-2">
          <h3 class="text-h6 mb-2 font-weight-bold section-title">FINANCIAL OVERVIEW</h3>
          
          <div class="mb-2">
            <strong>Active Accounts With:</strong> {{ activeBanks }}
          </div>

          <div>
            <strong class="mb-1 d-block">ວົງເງິນລວມ:</strong>
            <v-table density="compact" class="mini-table">
              <thead class="mini-table-header">
                <tr>
                  <th class="text-center">ສະກຸນເງິນ</th>
                  <th class="text-right">ວົງເງິນລວມແຕ່ລະສະກຸນ</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(line, index) in overallCreditLines" :key="index">
                  <td class="text-center">{{ line.currency }}</td>
                  <td class="text-right">{{ line.amount }}</td>
                </tr>
              </tbody>
            </v-table>
          </div>
        </v-card>

        <!-- ตารางสินเชื่อ -->
        <v-card flat class="pa-3 mb-2">
          <v-table>
            <thead class="bg-blue-lighten-4">
              <tr>
                <th class="text-center">ທະນາຄານ</th>
                <th class="text-center">ຈຸດປະສົງ</th>
                <th class="text-right">ວົງເງິນສິນເຊື່ອ</th>
                <th class="text-right">ຍອດເຫຼືອໜີ້</th>
                <th class="text-center">ສະກຸນເງິນ</th>
                <th class="text-right">ວັນທີຄ້າງຊຳລະ</th>
                <th class="text-center">ປະເພດສິນເຊື່ອ</th>
                <th class="text-center">ໄລຍະ</th>
                <th class="text-center">ສະຖານະ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(loan, index) in loans" :key="index" class="bg-blue-lighten-5">
                <td class="text-center">{{ loan.bank }}</td>
                <td>{{ loan.purpose }}</td>
                <td class="text-right">{{ loan.creditLine }}</td>
                <td class="text-right">{{ loan.outstanding }}</td>
                <td class="text-center">{{ loan.currency }}</td>
                <td class="text-right">{{ loan.daysSlow }}</td>
                <td>{{ loan.loanType }}</td>
                <td>{{ loan.loanTerm }}</td>
                <td class="text-center">{{ loan.status }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-card>

        <!-- หมายเหตุ -->
        <v-alert 
          type="warning" 
          variant="tonal" 
          class="mx-4 mb-2"
        >
          <strong>ຫມາຍເຫດ:</strong> ຂໍ້ມູນນີ້ແມ່ນນຳໃຊ້ເຂົ້າໃນວຽກງານພິຈາລະນາສິນເຊື່ອເທົ່ານັ້ນ.
        </v-alert>

        <!-- Footer -->
        <div class="report-footer pa-3 text-center">
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
}

/* ข้อมูลเอกสาร - Flex Layout */
.document-info-wrapper {
  margin-bottom: 8px;
}

.document-info-flex {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
}

.document-info-left {
  flex: 1;
  font-size: 14px;
}

.document-info-right {
  flex: 1;
  text-align: right;
  font-size: 14px;
}

/* ข้อมูลอ้างอิง - Flex Layout */
.reference-info-card {
  padding: 12px !important;
}

.reference-info-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.reference-info-item {
  flex: 1;
  font-size: 14px;
}

/* Mini Table Styles */
.mini-table {
  max-width: 400px !important;
  width: 400px !important;
  margin: 0;
}

.mini-table-header {
  background-color: #0b1d70 !important;
}

.mini-table th {
  color: #ffffffff !important;
  font-weight: bold !important;
}

.mini-table td {
  padding: 8px !important;
  font-size: 13px !important;
}

/* Score Factors Table Header Color */
.factors-table-header {
  background-color: #0b1d70 !important;
}

.factors-table-header th {
  color: #ffffffff !important;
  font-weight: bold !important;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #e0e0e0;
}

.score-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  background: white;
  border-radius: 4px;
  margin-bottom: 8px;
}

.score-label {
  font-weight: 500;
}

.score-value {
  font-weight: bold;
  color: #0b1d70;
}

.score-display {
  width: 525px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.score-number {
  font-size: 100px;
  font-weight: bold;
  color: white;
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
  color: white;
  font-size: 12px;
  font-weight: bold;
  text-align: center;
  padding: 4px;
}

.score-bar.poor {
  background-color: #FF0000;
  flex: 400;
}

.score-bar.medium {
  background-color: #FFA500;
  flex: 350;
}

.score-bar.good {
  background-color: #FFFF00;
  flex: 300;
  color: #333;
}

.score-bar.very-good {
  background-color: #9ACD32;
  flex: 250;
}

.score-bar.extra {
  background-color: #228B22;
  flex: 200;
}

.report-footer {
  background: linear-gradient(135deg, #07165a 0%, #281192 100%);
}

/* Print styles สำหรับ A4 - 3 columns, font 12pt, header 14pt */
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

  /* A4 size */
  @page {
    size: A4;
    margin: 10mm;
  }

  body {
    margin: 0;
    padding: 0;
    font-size: 12pt !important;
  }

  /* Header Section - Font 14pt */
  .section-title {
    font-size: 14pt !important;
    margin-bottom: 4px !important;
  }

  .header-section h3 {
    font-size: 14pt !important;
    margin-bottom: 2px !important;
  }

  .header-section p {
    font-size: 10pt !important;
    margin-bottom: 2px !important;
  }

  .header-section .my-2 {
    margin: 2px 0 !important;
    font-size: 10pt !important;
  }

  .report-title h2 {
    font-size: 14pt !important;
  }

  .report-title p {
    font-size: 12pt !important;
  }

  /* Document Info - Font 12pt, same line */
  .document-info-wrapper {
    margin-bottom: 3px !important;
    padding: 0 8px !important;
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
    font-size: 12pt !important;
    line-height: 1.3 !important;
    page-break-inside: avoid !important;
  }

  /* Reference Info - Font 12pt, same line */
  .reference-info-card {
    padding: 6px !important;
    margin-bottom: 3px !important;
    page-break-inside: avoid !important;
  }

  .reference-info-flex {
    display: flex !important;
    flex-direction: row !important;
    justify-content: space-between !important;
    page-break-inside: avoid !important;
  }

  .reference-info-item {
    font-size: 12pt !important;
    line-height: 1.3 !important;
  }

  /* Personal Info - 3 columns, Font 12pt */
  .personal-info-section {
    padding: 6px !important;
    margin-bottom: 3px !important;
  }

  .personal-info-section .personal-info-grid {
    display: grid !important;
    grid-template-columns: repeat(3, 1fr) !important;
    gap: 4px !important;
    column-gap: 8px !important;
  }

  .personal-info-section .info-column {
    width: 100% !important;
    padding: 1px !important;
  }

  .personal-info-section .info-row {
    padding: 3px 0 !important;
    font-size: 12pt !important;
    display: flex !important;
    justify-content: space-between !important;
    border-bottom: 1px solid #e0e0e0 !important;
  }

  .personal-info-section .info-row span {
    font-size: 12pt !important;
  }

  /* Conditional Scores - 3 columns, Font 12pt */
  .conditional-scores-section {
    padding: 6px !important;
    margin-bottom: 3px !important;
  }

  .conditional-scores-section .scores-grid {
    display: grid !important;
    grid-template-columns: repeat(3, 1fr) !important;
    gap: 4px !important;
    column-gap: 8px !important;
  }

  .conditional-scores-section .score-column {
    width: 100% !important;
    padding: 1px !important;
  }

  .conditional-scores-section .score-item {
    padding: 4px 8px !important;
    margin-bottom: 3px !important;
    font-size: 12pt !important;
  }

  .conditional-scores-section .score-label,
  .conditional-scores-section .score-value {
    font-size: 12pt !important;
  }

  /* Credit Score Display */
  .credit-score-section {
    page-break-inside: avoid;
    padding: 6px !important;
  }

  .credit-score-section .text-subtitle-1 {
    font-size: 12pt !important;
  }

  .score-display {
    width: 350px !important;
    height: 130px !important;
  }

  .score-number {
    font-size: 60px !important;
  }

  .score-bar-container {
    height: 30px !important;
  }

  .score-bar {
    font-size: 10pt !important;
    padding: 2px !important;
  }

  /* Score Factors */
  .score-factors-section {
    page-break-inside: avoid;
    padding: 6px !important;
  }

  .score-factors-section .text-body-2,
  .score-factors-section p {
    font-size: 12pt !important;
    margin-bottom: 2px !important;
  }

  .factors-table {
    font-size: 12pt !important;
  }

  .factors-table th,
  .factors-table td {
    padding: 4px !important;
    font-size: 11pt !important;
  }

  /* General Text - Font 12pt */
  p, div, span, strong {
    font-size: 12pt !important;
  }

  /* Tables - Font 12pt */
  table {
    font-size: 12pt !important;
  }

  thead {
    display: table-header-group;
  }

  tr {
    page-break-inside: avoid;
  }

  th, td {
    padding: 4px !important;
    font-size: 11pt !important;
  }

  /* Mini Table */
  .mini-table th,
  .mini-table td {
    font-size: 11pt !important;
  }

  /* Cards */
  v-card,
  .v-card {
    page-break-inside: avoid;
    box-shadow: none !important;
    padding: 6px !important;
    margin-bottom: 3px !important;
  }

  /* Spacing Adjustments */
  .pa-3 {
    padding: 6px !important;
  }

  .mb-2 {
    margin-bottom: 3px !important;
  }

  .mb-4 {
    margin-bottom: 6px !important;
  }

  /* Alert */
  .v-alert {
    font-size: 12pt !important;
    padding: 6px !important;
    margin: 6px !important;
  }
}

/* Responsive สำหรับหน้าจอเล็ก */
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
    max-width: 400px;
    height: 180px;
  }

  .score-number {
    font-size: 70px;
  }
}
</style>