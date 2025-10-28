<script setup lang="ts">
import { IndividualStore } from "~/stores/searchindividual";
import { useFeesStore } from "~/stores/fee";
import Swal from "sweetalert2";
const selecCheckbox = ref("")
const feestore = useFeesStore();
const rout = useRoute();
const lcicID = rout.query.lcic_id as string;

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
const confirmInsert = async ()=>{
    try {
         const noticonfirm = await Swal.fire({
                icon:"warning",
                title:"ຄຳເຕື່ອນ",
                text:"ທ່ານຕອ້ງການ ຄົ້ນຫາບົດລາຍງານນີ້ແທ້ຫຼືບໍ",
                showConfirmButton:true,
                confirmButtonText:"ຕົກລົງ",
                showCancelButton:true,
                cancelButtonText:"ຍົກເລີກ"
                
            });if(noticonfirm.isConfirmed){
                
                await individualStore.CreatInsertLog();
                // goPath(`/test1`)
            }
    } catch (error) {
        
    }
}
onMounted(() => {
  individualStore.reques_mapsearch.query.lcic_id = lcicID;
  individualStore.from_insert_logserch.lcic_id = lcicID
  individualStore.saerchMapIndividual();
  feestore.Getdata();
});
</script>

<template>
  <div class="search-details-container">
    <div class="header-section">
      <v-icon size="32" color="primary" class="mb-2 mt-4">mdi-account-search</v-icon>
      <h1 class="page-title">ລາຍລະອຽດຂໍ້ມູນຄົ້ນຫາ</h1>
      <p class="page-subtitle">ຜົນການຄົ້ນຫາຂໍ້ມູນບຸກຄົນ</p>
    </div>

    <v-card class="data-card mb-6" elevation="2">
      <v-card-title class="card-title">
        <v-icon class="mr-2" color="primary">mdi-table</v-icon>
        ຂໍ້ມູນບຸກຄົນ
      </v-card-title>

      <v-card-text class="pa-0">
        <v-table class="modern-table">
          <thead style="color: blue;">
            <tr class="table-header" >
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
              <td class="table-cell"><v-btn color="primary" :disabled="selecCheckbox !=='1'" @click="confirmInsert">ເລືອກ</v-btn></td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
    </v-card>

    <v-sheet :elevation="10" :height="100" color="orange-lighten-4" rounded>
      <v-row>
        <v-col cols="12" md="1">
          <v-checkbox class="pa-2" value="1" v-model="selecCheckbox"> </v-checkbox>
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
    <!-- <v-card class="confirmation-card" elevation="2">
        <v-card-text class="pa-6">
          <v-row align="center">
            <v-col cols="12" md="1" class="text-center">
              <v-checkbox 
                color="primary" 
                size="large"
                class="confirmation-checkbox"
              ></v-checkbox>
            </v-col>
            <v-col cols="12" md="11">
              <div class="confirmation-content">
                <h3 class="confirmation-title">
                  <v-icon class="mr-2" color="primary">mdi-shield-check</v-icon>
                  ຢືນຢັນການໄດ້ຮັບອານຸຍາດແລະຢີນຍອມຈາກເຈົ້າຂອງຂໍ້ມູນ
                </h3>
                <p class="confirmation-text">
                  ຂ້າພະເຈົ້າຢືນຢັນວ່າໄດ້ຮັບການຍິນຍອມເປີດເຜີຍຂໍ້ມູນຈາກເຈົ້າຂອງຂໍ້ມູນແລ້ວ
                  ແລະ ຮັບຮູ້ວ່າການນໍາໃຊ້ຂໍ້ມູນນີ້ຈະເປັນໄປຕາມກົດໝາຍທີ່ກ່ຽວຂ້ອງ
                </p>
                
                <v-alert 
                  type="warning" 
                  variant="tonal" 
                  class="fee-alert mt-4"
                  prepend-icon="mdi-currency-usd"
                >
                  <div class="fee-content">
                    <span class="fee-label">ຄ່າທຳນຽມສຳຫລັບບົດລາຍງານນີ້:</span>
                    <span class="fee-amount">{{ dataFee[0]?.chg_amount || 0 }} ກີບ</span>
                  </div>
                </v-alert>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card> -->

    <!-- <div class="action-buttons mt-6">
        <v-btn 
          color="primary" 
          size="large" 
          variant="elevated"
          prepend-icon="mdi-check"
          class="mr-4"
        >
          ຢືນຢັນ
        </v-btn>
        <v-btn 
          color="grey" 
          size="large" 
          variant="outlined"
          prepend-icon="mdi-arrow-left"
        >
          ກັບຄືນ
        </v-btn>
      </div>
    -->
  </div>
</template>

<style scoped>
.search-details-container {
  min-height: 90vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 0rem 0;
}

.header-section {
  text-align: center;
  margin-bottom: 1rem;
  padding: 0rem 0;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 400;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.page-subtitle {
  font-size: 1.1rem;
  color: #7f8c8d;
  margin: 0;
}

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
    font-size: 2rem;
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
