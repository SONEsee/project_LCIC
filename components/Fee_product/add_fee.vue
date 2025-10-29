<template>
  <div class="fee-add-container">
    <!-- Header -->
    <div class="header-section">
      <div class="d-flex align-center">
        <v-icon color="white" large class="mr-2">mdi-cash-plus</v-icon>
        <span class="text-h5 font-weight-bold" style="color: white;">ເພີ່ມຄ່າທຳນຽມໃໝ່</span>
      </div>
      <v-btn color="orange darken-1" rounded class="text-white" @click="clearForm">
        <v-icon left>mdi-broom</v-icon> ລ້າງຂໍ້ມູນ
      </v-btn>
    </div>

    <!-- Form Body -->
    <div class="form-body">
      <v-form ref="formRef" v-model="formValid" lazy-validation>
        <v-row>
          <!-- Charge Code -->
          <v-col cols="12" md="6">
            <v-text-field
              label="ລະຫັດຄ່າທຳນຽມ"
              v-model="form.chg_code"
              outlined
              density="comfortable"
              color="blue lighten-2"
              clearable
              prepend-inner-icon="mdi-identifier"
              :rules="[v => !!v || 'ກະລຸນາປ້ອນລະຫັດຄ່າທຳນຽມ']"
            />
          </v-col>

                    <!-- Charge Amount -->
          <v-col cols="12" md="6">
            <v-text-field
              label="ຈຳນວນເງິນ"
              v-model.number="form.chg_amount"
              type="number"
              outlined
              density="comfortable"
              color="green lighten-2"
              clearable
              prepend-inner-icon="mdi-currency-usd"
              :rules="[
                v => v !== null && v !== '' || 'ກະລຸນາປ້ອນຈຳນວນເງິນ',
                v => v >= 0 || 'ຈຳນວນເງິນຕ້ອງບໍ່ຕ່ຳກວ່າ 0'
              ]"
            />
          </v-col>

        <!-- Charge Type (Lao) -->
          <v-col cols="12" md="6">
            <v-text-field
              label="ຊື່ຄ່າທຳນຽມ (ລາວ)"
              v-model="form.chg_lao_type"
              outlined
              density="comfortable"
              color="cyan lighten-2"
              clearable
              prepend-inner-icon="mdi-tag-text-outline"
              :rules="[v => !!v || 'ກະລຸນາປ້ອນຊື່ຄ່າທຳນຽມພາສາລາວ']"
            />
          </v-col>

          <!-- Charge Type (English) -->
          <v-col cols="12" md="6">
            <v-text-field
              label="ຊື່ຄ່າທຳນຽມ (ອັງກິດ)"
              v-model="form.chg_type"
              outlined
              density="comfortable"
              color="blue lighten-2"
              clearable
              prepend-inner-icon="mdi-tag-text"
              :rules="[v => !!v || 'ກະລຸນາປ້ອນຊື່ຄ່າທຳນຽມ']"
            />
          </v-col>



          <!-- Charge Description (Lao) -->
          <v-col cols="12" md="6">
            <v-text-field
              label="ລາຍລະອຽດ (ລາວ)"
              v-model="form.chg_lao_desc"
              outlined
              density="comfortable"
              color="teal lighten-2"
              clearable
              prepend-inner-icon="mdi-text-box-outline"
              :rules="[v => !!v || 'ກະລຸນາປ້ອນລາຍລະອຽດພາສາລາວ']"
            />
          </v-col>

          <!-- Charge Description (English) -->
          <v-col cols="12" md="6">
            <v-text-field
              label="ລາຍລະອຽດ (ອັງກິດ)"
              v-model="form.chg_desc"
              outlined
              density="comfortable"
              color="light-blue lighten-2"
              clearable
              prepend-inner-icon="mdi-text-box"
              :rules="[v => !!v || 'ກະລຸນາປ້ອນລາຍລະອຽດ']"
            />
          </v-col>
          <!-- Charge Unit -->
          <!-- <v-col cols="12" md="6">
            <v-text-field
              label="ຫົວໜ່ວຍ"
              v-model="form.chg_unit"
              outlined
              density="comfortable"
              color="purple lighten-2"
              clearable
              prepend-inner-icon="mdi-scale-balance"
              placeholder="ເຊັ່ນ: LAK, USD, %"
              :rules="[v => !!v || 'ກະລຸນາປ້ອນຫົວໜ່ວຍ']"
            />
          </v-col> -->
        </v-row>
      </v-form>
    </div>

    <!-- Footer -->
    <div class="footer-section">
      <v-btn color="grey darken-1" rounded @click="$emit('close')">ຍົກເລີກ</v-btn>
      <v-btn color="#2233a1" rounded :disabled="!formValid" @click="showConfirmDialog = true">
        <v-icon left>mdi-content-save</v-icon> ບັນທຶກຄ່າທຳນຽມ
      </v-btn>
    </div>

    <!-- Confirm Dialog -->
    <v-dialog v-model="showConfirmDialog" max-width="500" persistent>
      <v-card class="confirm-dialog-card" elevation="8">
        <!-- Header -->
        <v-card-title class="confirm-dialog-header pa-4">
          <div class="d-flex align-center">
            <div class="confirm-icon-wrapper">
              <v-icon size="28" color="white">mdi-alert-circle-outline</v-icon>
            </div>
            <div class="ml-3">
              <h2 class="text-h5 font-weight-bold text-white mb-1">ຢືນຢັນການເພີ່ມຂໍ້ມູນ</h2>
              <p class="text-body-2 text-white opacity-90 mb-0">ກະລຸນາກວດສອບຂໍ້ມູນກ່ອນບັນທຶກ</p>
            </div>
          </div>
        </v-card-title>

        <!-- Content -->
        <v-card-text class="pa-4">
          <div class="fee-confirm-box pa-3 mb-3">
            <v-row dense>
              <v-col cols="12" class="mb-2">
                <div class="d-flex align-center">
                  <v-icon size="20" color="primary" class="mr-2">mdi-identifier</v-icon>
                  <span class="text-body-2 text-grey-darken-1 mr-2">ລະຫັດ:</span>
                  <span class="font-weight-bold">{{ form.chg_code }}</span>
                </div>
              </v-col>
              <v-col cols="12" class="mb-2">
                <div class="d-flex align-center">
                  <v-icon size="20" color="success" class="mr-2">mdi-tag-text</v-icon>
                  <span class="text-body-2 text-grey-darken-1 mr-2">ປະເພດ (ລາວ):</span>
                  <span class="font-weight-bold">{{ form.chg_lao_type }}</span>
                </div>
              </v-col>
              <v-col cols="12" class="mb-2">
                <div class="d-flex align-center">
                  <v-icon size="20" color="info" class="mr-2">mdi-text-box</v-icon>
                  <span class="text-body-2 text-grey-darken-1 mr-2">ລາຍລະອຽດ (ລາວ):</span>
                  <span class="font-weight-bold">{{ form.chg_lao_desc }}</span>
                </div>
              </v-col>
              <v-col cols="12">
                <div class="d-flex align-center">
                  <v-icon size="20" color="warning" class="mr-2">mdi-currency-usd</v-icon>
                  <span class="text-body-2 text-grey-darken-1 mr-2">ຈຳນວນເງິນ:</span>
                  <span class="font-weight-bold text-success">{{ formatAmount(form.chg_amount) }} {{ form.chg_unit }}</span>
                </div>
              </v-col>
            </v-row>
          </div>

          <p class="text-center text-body-1 mb-0">
            ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການເພີ່ມຄ່າທຳນຽມນີ້?
          </p>
        </v-card-text>

        <!-- Actions -->
        <v-card-actions class="pa-4 pt-0">
          <v-btn
            color="grey-darken-1"
            variant="text"
            size="large"
            @click="showConfirmDialog = false"
            :disabled="saving"
            class="flex-grow-1"
          >
            <v-icon left>mdi-close</v-icon>
            ຍົກເລີກ
          </v-btn>
          <v-btn
            color="#2233a1"
            variant="flat"
            size="large"
            @click="confirmSaveFee"
            :loading="saving"
            class="flex-grow-1"
          >
            <v-icon left>mdi-check</v-icon>
            ຢືນຢັນ
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const emit = defineEmits(['saved', 'close']);
const formRef = ref(null);
const formValid = ref(false);
const showConfirmDialog = ref(false);
const saving = ref(false);

const form = ref({
  chg_code: '',
  chg_type: '',
  chg_lao_type: '',
  chg_desc: '',
  chg_lao_desc: '',
  chg_amount: null,
  chg_unit: 'LAK',
});

// API URL
const config = useRuntimeConfig();
const apiFeeURL = `${config.public.strapi.url}api/charge-matrix/`;

// Format amount with thousand separator
const formatAmount = (amount) => {
  if (amount === null || amount === undefined) return '0';
  return parseFloat(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

// Confirm and save fee
const confirmSaveFee = async () => {
  await saveFee();
};

// Save fee
const saveFee = async () => {
  if (!formValid.value) {
    return;
  }

  saving.value = true;

  try {
    const response = await axios.post(apiFeeURL, form.value);
    
    console.log('✅ Response:', response.data);
    showConfirmDialog.value = false;
    emit('saved', response.data);
    emit('close');
  } catch (err) {
    console.error('❌ Error adding fee:', err);
    console.error('Error response:', err.response?.data);
    showConfirmDialog.value = false;
  } finally {
    saving.value = false;
  }
};

// Clear form
const clearForm = () => {
  form.value = {
    chg_code: '',
    chg_type: '',
    chg_lao_type: '',
    chg_desc: '',
    chg_lao_desc: '',
    chg_amount: null,
    chg_unit: 'LAK',
  };
  formRef.value?.resetValidation();
};
</script>

<style scoped>
.fee-add-container {
  width: 100%;
  background: #f5f5f5;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.header-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: linear-gradient(135deg, #2931a5 0%, #2233a1 100%);
  color: white;
}

.form-body {
  padding: 24px;
  background: white;
}

.footer-section {
  display: flex;
  justify-content: center;
  gap: 12px;
  padding: 16px;
  background: #f5f5f5;
  border-top: 1px solid #e0e0e0;
}

.v-btn {
  min-width: 120px;
  font-weight: 500;
}

/* Confirm Dialog Styles */
.confirm-dialog-card {
  border-radius: 16px !important;
  overflow: hidden;
}

.confirm-dialog-header {
  background: linear-gradient(135deg, #2931a5 0%, #2233a1 100%);
}

.confirm-icon-wrapper {
  background: rgba(255, 255, 255, 0.2);
  padding: 12px;
  border-radius: 12px;
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.fee-confirm-box {
  background: #f5f5f5;
  border-radius: 12px;
  border-left: 4px solid #2233a1;
}
</style>