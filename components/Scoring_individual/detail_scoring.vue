<script setup lang="ts">
import { IndividualStore } from "~/stores/scoring_ind";
import { useFeesStore } from "~/stores/fee";
import { useUserData } from "~/composables/useUserData";
import Swal from "sweetalert2";
const selecCheckbox = ref("");
const feestore = useFeesStore();
const rout = useRoute();
const lcicID = rout.query.lcic_id as string;
const TypeID = rout.query.typesearch as string;
const { userId } = useUserData();

// const dataFee = computed(() => {
//   const data = feestore.response_data_fee;
//   let processedData = [];

//   if (Array.isArray(data)) {
//     processedData = data;
//   } else if (data && typeof data === "object") {
//     processedData = [data];
//   } else {
//     return [];
//   }

//   return processedData.filter((item) => item.chg_code === "SCR");
// });

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

  const targetChgCode = userId.value?.length === 2 ? "SCR" : "SCRFI";
  
  return processedData.filter((item) => item.chg_code === targetChgCode);
});

const individualStore = IndividualStore();
const dataIndividual = computed(() => {
  const data = individualStore.respons_data_reques_search;
  if (Array.isArray(data)) {
    return data;
  }
  if (data && typeof data === "object") {
    return [data];
  }
  return [];
});

const confirmInsert = async () => {
  try {
    const noticonfirm = await Swal.fire({
      icon: "warning",
      title: "ຄຳເຕື່ອນ",
      text: "ທ່ານຕອ້ງການ ຄົ້ນຫາບົດລາຍງານນີ້ແທ້ຫຼືບໍ",
      showConfirmButton: true,
      confirmButtonText: "ຕົກລົງ",
      showCancelButton: true,
      cancelButtonText: "ຍົກເລີກ",
    });
    
    if (noticonfirm.isConfirmed) {
      const success = await individualStore.CreatInsertLog();
      
      if (success) {
        sessionStorage.setItem("lcic_id", lcicID);
        
        setTimeout(() => {
          goPath("/scoring/reports/scoring_report");
        }, 500);
      }
    }
  } catch (error) {
    // Handle error silently or show user-friendly message
  }
};

onMounted(() => {
  individualStore.reques_mapsearch.query.lcic_id = lcicID;
  individualStore.from_insert_logserch.lcic_id = lcicID;
  individualStore.from_insert_logserch.CatalogID = TypeID;
  individualStore.saerchMapIndividual();
  feestore.Getdata();
});
</script>

<template>
  <div class="search-details-container">
    <div class="header-section">
      <v-icon size="32" color="#1a2a5e" class="mb-4 mt-2"
        >mdi-account-search</v-icon
      >
      <h1 class="page-title">ລາຍລະອຽດຂໍ້ມູນທີ່ຄົ້ນຫາ</h1>
      <p class="page-subtitle">ຜົນການຄົ້ນຫາຂໍ້ມູນບຸກຄົນ</p>
    </div>

    <v-card class="data-card mb-6" elevation="2">
      <v-card-title class="card-title">
        <v-icon class="mr-2" color="#f5f7fa">mdi-table</v-icon>
        ຂໍ້ມູນບຸກຄົນ
      </v-card-title>

      <v-card-text class="pa-0">
        <v-table class="modern-table">
          <thead style="color: blue">
            <tr class="table-header">
              <th class="table-header-cell">ລະຫັດ ຂສລ</th>
              <th class="table-header-cell">ຊື່ພາສາລາວ</th>
              <th class="table-header-cell">ນາມສະກຸນພາສາລາວ</th>
              <th class="table-header-cell">ຊື່ພາສາອັງກິດ</th>
              <th class="table-header-cell">ນາມສະກຸນພາສາອັງກິດ</th>
              <th class="table-header-cell">ວັນເດືອນປີເກີດ</th>
              <th class="table-header-cell">ເລກທີບັດປະຈຳຕົວ</th>
              <th class="table-header-cell">ເລກທີປື້ມສຳມະໂນຄົວ</th>
              <th class="table-header-cell">ເລກທີປື້ມຜ່ານແດນ</th>
              <th class="table-header-cell">ລາຍລະອຽດ</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in dataIndividual"
              :key="index"
              class="table-row"
            >
              <td class="table-cell">{{ item.lcic_id }}</td>
              <td class="table-cell">{{ item.ind_lao_name }}</td>
              <td class="table-cell">{{ item.ind_lao_surname }}</td>
              <td class="table-cell">{{ item.ind_name }}</td>
              <td class="table-cell">{{ item.ind_surname }}</td>
              <td class="table-cell">{{ item.ind_birth_date }}</td>
              <td class="table-cell">{{ item.ind_national_id }}</td>
              <td class="table-cell">{{ item.ind_familybook }}</td>
              <td class="table-cell">{{ item.ind_passport }}</td>
              <td class="table-cell">
                <v-btn
                  color="primary"
                  :disabled="selecCheckbox !== '1'"
                  @click="confirmInsert"
                  >ເລືອກ</v-btn
                >
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
    </v-card>

    <v-sheet :elevation="10" :height="100" color="orange-lighten-4" rounded>
      <v-row>
        <v-col cols="12" md="1">
          <v-checkbox class="pa-2" value="1" v-model="selecCheckbox">
          </v-checkbox>
        </v-col>
        <v-col cols="12" md="11">
          <h4><b>ຢືນຢັນການໄດ້ຮັບອານຸຍາດແລະຢີນຍອມຈາກເຈົ້າຂອງຂໍ້ມູນ</b></h4>
          <p>
            ຂ້າພະເຈົ້າຢືນຢັນວ່າໄດ້ຮັບການຍິນຍອມເປີດເຜີຍຂໍ້ມູນຈາກເຈົ້າຂອງຂໍ້ມູນແລ້ວ
            ແລະ ຮັບຮູ້ວ່າການນໍາໃຊ້ຂໍ້ມູນນີ້ຈະເປັນໄປຕາມກົດໝາຍທີ່ກ່ຽວຂ້ອງ
          </p>
          <p style="color: red">
            ຖ້າຢືນຢັນເອົາບົດລາຍງານນີ້ແມ່ນຈະໄດ້ເສຍຄ່າທຳນຽມ:
            <b style="color: black">{{ dataFee[0]?.chg_amount }} </b> ກີບ
          </p>
        </v-col>
      </v-row>
    </v-sheet>
  </div>
</template>

<style scoped>
.search-details-container {
  min-height: 85vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 0rem 0;
}

/* ===== HEADER SECTION - MODERNIZED ===== */
.header-section {
  text-align: center;
  margin-bottom: 1rem;
  padding: 2rem 0;
  position: relative;
  animation: fadeInDown 0.8s ease-out;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.header-section .v-icon {
  background: linear-gradient(135deg, rgba(18, 36, 116, 0.2) 0%, rgba(9, 3, 92, 0.15) 100%);
  padding: 24px;
  border-radius: 50%;
  backdrop-filter: blur(20px);
  box-shadow: 
    0 8px 32px rgba(18, 36, 116, 0.3),
    0 0 0 8px rgba(18, 36, 116, 0.1),
    0 0 0 16px rgba(18, 36, 116, 0.05),
    inset 0 1px 2px rgba(255, 255, 255, 0.5);
  border: 2px solid rgba(18, 36, 116, 0.3);
  animation: pulse-float 3s ease-in-out infinite;
  position: relative;
}

.header-section .v-icon::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 140%;
  height: 140%;
  background: radial-gradient(circle, rgba(18, 36, 116, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: ripple 2s ease-out infinite;
  pointer-events: none;
}

.header-section .v-icon::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 180%;
  height: 180%;
  border: 2px solid rgba(18, 36, 116, 0.2);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: ripple 2s ease-out 0.5s infinite;
  pointer-events: none;
}

@keyframes pulse-float {
  0%, 100% {
    transform: translateY(0) scale(1);
    box-shadow: 
      0 8px 32px rgba(18, 36, 116, 0.3),
      0 0 0 8px rgba(18, 36, 116, 0.1),
      0 0 0 16px rgba(18, 36, 116, 0.05);
  }
  50% {
    transform: translateY(-10px) scale(1.08);
    box-shadow: 
      0 16px 48px rgba(18, 36, 116, 0.4),
      0 0 0 12px rgba(18, 36, 116, 0.15),
      0 0 0 24px rgba(18, 36, 116, 0.08);
  }
}

@keyframes ripple {
  0% {
    opacity: 0.8;
    transform: translate(-50%, -50%) scale(0.8);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(1.5);
  }
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  text-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.1),
    0 4px 16px rgba(18, 36, 116, 0.15);
  letter-spacing: 0.5px;
  background: linear-gradient(180deg, #1a2a5e 0%, #2c3e50 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: titleGlow 3s ease-in-out infinite alternate;
  position: relative;
}

.page-title::after {
  content: '';
  position: absolute;
  bottom: -12px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 3px;
  background: linear-gradient(90deg, transparent, #122474, transparent);
  border-radius: 2px;
  animation: lineExpand 2s ease-in-out infinite;
}

@keyframes titleGlow {
  0%, 100% {
    text-shadow: 
      0 2px 4px rgba(0, 0, 0, 0.1),
      0 4px 16px rgba(18, 36, 116, 0.15);
  }
  50% {
    text-shadow: 
      0 2px 4px rgba(0, 0, 0, 0.1),
      0 4px 16px rgba(18, 36, 116, 0.3),
      0 0 40px rgba(18, 36, 116, 0.2);
  }
}

@keyframes lineExpand {
  0%, 100% {
    width: 80px;
    opacity: 0.8;
  }
  50% {
    width: 120px;
    opacity: 1;
  }
}

.page-subtitle {
  font-size: 1.1rem;
  color: #5d699e;
  margin: 0;
  margin-top: 1.5rem;
  font-weight: 400;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  animation: subtitleFade 1s ease-out 0.3s both;
  letter-spacing: 0.3px;
}

@keyframes subtitleFade {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
/* ===== END HEADER SECTION ===== */

.data-card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

.card-title {
  background: linear-gradient(135deg, #122474 0%, #09035c 100%);
  color: white;
  font-size: 1.25rem;
  font-weight: 600;
  padding: 1.5rem;
}

.modern-table {
  background: transparent;
}

.table-header {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.table-header-cell {
  font-weight: 600;
  color: #495057;
  padding: 1rem;
  border-bottom: 2px solid #dee2e6;
  font-size: 0.9rem;
  white-space: nowrap;
}

.table-row:hover {
  background: rgba(102, 126, 234, 0.05);
  transition: background-color 0.3s ease;
}

.table-cell {
  padding: 1rem;
  color: #495057;
  border-bottom: 1px solid #f1f3f4;
  white-space: nowrap;
}

.confirmation-card {
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.confirmation-checkbox {
  transform: scale(1.2);
}

.confirmation-title {
  color: #2c3e50;
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
}

.confirmation-text {
  color: #5a6c7d;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 0;
}

.fee-alert {
  border-radius: 12px;
  background: rgba(255, 193, 7, 0.1);
  border: 1px solid rgba(255, 193, 7, 0.3);
}

.fee-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.fee-label {
  font-size: 0.95rem;
  color: #6c757d;
}

.fee-amount {
  font-size: 1.25rem;
  font-weight: bold;
  color: #fd7e14;
}

.action-buttons {
  text-align: center;
  padding: 1rem 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .page-title {
    font-size: 1.5rem;
  }

  .page-subtitle {
    font-size: 1rem;
  }

  .table-header-cell,
  .table-cell {
    padding: 0.75rem 0.5rem;
    font-size: 0.85rem;
  }

  .confirmation-title {
    font-size: 1.1rem;
  }

  .action-buttons {
    text-align: center;
  }

  .action-buttons .v-btn {
    margin: 0.5rem;
    width: 100%;
    max-width: 200px;
  }
}

/* Animation */
.data-card,
.confirmation-card {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
