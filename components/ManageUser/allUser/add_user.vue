<template>
  <div class="user-add-container">
    <!-- Header -->
    <div class="header-section">
      <div class="d-flex align-center">
        <v-icon color="white" large class="mr-2">mdi-account-plus</v-icon>
        <span class="text-h5 font-weight-bold" style="color: white;">ເພີ່ມຜູ້ໃຊ້ໃໝ່</span>
      </div>
      <v-btn color="orange darken-1" rounded class="text-white" @click="clearForm">
        <v-icon left>mdi-broom</v-icon> ລ້າງຂໍ້ມູນ
      </v-btn>
    </div>

    <!-- Form Body with Image Preview -->
    <div class="form-body">
      <v-row dense no-gutters>
        <!-- Left Side: Image Preview -->
        <v-col cols="12" md="3" class="d-flex flex-column align-center justify-start pt-4">
          <v-avatar size="150" class="mb-3">
            <v-img 
              :src="imagePreview" 
              alt="Profile Image"
              cover
            >
              <template v-slot:placeholder>
                <v-icon size="100" color="grey lighten-1">mdi-account-circle</v-icon>
              </template>
            </v-img>
          </v-avatar>
          <v-file-input
            label="ຮູບໂປຣໄຟລ໌ (ທາງເລືອກ)"
            v-model="form.profile_image"
            accept="image/*"
            outlined
            density="compact"
            color="blue lighten-2"
            clearable
            @change="onImageChange"
            hide-details
            class="mt-2"
            style="width: 100%; max-width: 200px;"
          />
        </v-col>

        <!-- Right Side: Form Fields -->
        <v-col cols="12" md="9">
          <v-form ref="formRef" v-model="formValid" lazy-validation>
            <v-row dense no-gutters>
              <!-- Username -->
              <v-col cols="6">
                <v-text-field
                  label="ຊື່ຜູ້ໃຊ້"
                  v-model="form.username"
                  outlined
                  density="compact"
                  color="blue lighten-2"
                  clearable
                  :rules="[v => !!v || 'ກະລຸນາປ້ອນຊື່ຜູ້ໃຊ້']"
                />
              </v-col>

              <!-- Password -->
              <v-col cols="6">
                <v-text-field
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  label="ລະຫັດຜ່ານ"
                  outlined
                  density="compact"
                  color="blue lighten-2"
                  clearable
                  :rules="[v => !!v || 'ກະລຸນາປ້ອນລະຫັດຜ່ານ']"
                >
                  <template #append-inner>
                    <v-btn 
                      icon 
                      size="small"
                      @click="togglePassword" 
                      :title="showPassword ? 'Hide password' : 'Show password'"
                    >
                      <v-icon size="small">{{ showPassword ? 'mdi-eye-off' : 'mdi-eye' }}</v-icon>
                    </v-btn>
                  </template>
                </v-text-field>
              </v-col>

              <!-- Select Member -->
              <v-col cols="8">
                <v-select
                  v-model="form.bnk_code"
                  :items="members"
                  item-title="display_name"
                  item-value="bnk_code"
                  label="ເລືອກຊື່ສະມາຊິກ"
                  clearable
                  outlined
                  density="compact"
                  color="indigo lighten-2"
                  @update:modelValue="updateMID"
                />
              </v-col>

              <!-- Branch ID -->
              <v-col cols="4">
                <v-text-field
                  label="ລະຫັດສາຂາ"
                  v-model="form.branch_id"
                  outlined
                  density="compact"
                  color="teal lighten-2"
                  clearable
                />
              </v-col>

              <!-- Select Group -->
              <v-col cols="12">
                <v-select
                  v-model="form.GID"
                  :items="groups"
                  item-title="nameL"
                  item-value="GID"
                  label="ເລືອກໜ້າທີ່ຜູ້ນຳໃຊ້"
                  clearable
                  outlined
                  density="compact"
                  color="light-blue lighten-2"
                />
              </v-col>

              <!-- Name Lao -->
              <v-col cols="6">
                <v-text-field
                  label="ຊື່ (ພາສາລາວ)"
                  v-model="form.nameL"
                  outlined
                  density="compact"
                  color="cyan lighten-2"
                  clearable
                  :rules="[v => !!v || 'ກະລຸນາປ້ອນຊື່']"
                />
              </v-col>

              <!-- Surname Lao -->
              <v-col cols="6">
                <v-text-field
                  label="ນາມສະກຸນ (ພາສາລາວ)"
                  v-model="form.surnameL"
                  outlined
                  density="compact"
                  color="cyan lighten-2"
                  clearable
                  :rules="[v => !!v || 'ກະລຸນາປ້ອນນາມສະກຸນ']"
                />
              </v-col>

              <!-- Name English -->
              <v-col cols="6">
                <v-text-field
                  label="ຊື່ (ພາສາອັງກິດ)"
                  v-model="form.nameE"
                  outlined
                  density="compact"
                  color="light-blue lighten-2"
                  clearable
                />
              </v-col>

              <!-- Surname English -->
              <v-col cols="6">
                <v-text-field
                  label="ນາມສະກຸນ (ພາສາອັງກິດ)"
                  v-model="form.surnameE"
                  outlined
                  density="compact"
                  color="light-blue lighten-2"
                  clearable
                />
              </v-col>

              <!-- Active Switch -->
              <v-col cols="6">
                <v-switch
                  label="ອະນຸຍາດນຳໃຊ້"
                  v-model="form.is_active"
                  color="green"
                />
              </v-col>

              <!-- Staff Switch -->
              <v-col cols="6">
                <v-switch
                  label="ຜູ້ຮັບຜິດຊອບ"
                  v-model="form.is_staff"
                  color="purple"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-col>
      </v-row>
    </div>

    <!-- Footer -->
    <div class="footer-section">
      <v-btn color="grey darken-1" rounded @click="$emit('close')">ຍົກເລີກ</v-btn>
      <v-btn color="blue darken-2" rounded :disabled="!formValid" @click="showConfirmDialog = true">
        <v-icon left>mdi-content-save</v-icon> ບັນທຶກຜູ້ໃຊ້
      </v-btn>
    </div>

    <!-- 🔔 Improved Confirm Dialog -->
    <v-dialog v-model="showConfirmDialog" max-width="450" persistent>
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
          <div class="text-center mb-3">
            <v-avatar size="100" class="mb-3">
              <v-img 
                v-if="imagePreview" 
                :src="imagePreview" 
                cover 
              />
              <v-icon v-else size="100" color="grey">mdi-account-circle</v-icon>
            </v-avatar>
          </div>

          <div class="user-confirm-box pa-3 mb-3">
            <v-row dense>
              <v-col cols="12" class="mb-2">
                <div class="d-flex align-center">
                  <v-icon size="20" color="primary" class="mr-2">mdi-account</v-icon>
                  <span class="text-body-2 text-grey-darken-1 mr-2">ຊື່ຜູ້ໃຊ້:</span>
                  <span class="font-weight-bold">{{ form.username || '-' }}</span>
                </div>
              </v-col>
              <v-col cols="12" class="mb-2" v-if="form.bnk_code">
                <div class="d-flex align-center">
                  <v-icon size="20" color="warning" class="mr-2">mdi-bank</v-icon>
                  <span class="text-body-2 text-grey-darken-1 mr-2">ສະມາຊິກ:</span>
                  <span class="font-weight-bold">{{ getMemberDisplay(form.bnk_code) }}</span>
                </div>
              </v-col>
              <v-col cols="12" v-if="form.GID">
                <div class="d-flex align-center">
                  <v-icon size="20" color="purple" class="mr-2">mdi-shield-account</v-icon>
                  <span class="text-body-2 text-grey-darken-1 mr-2">ໜ້າທີ່:</span>
                  <span class="font-weight-bold">{{ getGroupDisplay(form.GID) }}</span>
                </div>
              </v-col>
            </v-row>
          </div>

          <p class="text-center text-body-1 mb-0">
            ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການເພີ່ມຜູ້ໃຊ້ນີ້?
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
            color="#1565c0"
            variant="flat"
            size="large"
            @click="confirmSaveUser"
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
import CryptoJS from 'crypto-js';

const emit = defineEmits(['saved', 'close']);
const formRef = ref(null);
const formValid = ref(false);
const imagePreview = ref('');
const showPassword = ref(false);
const showConfirmDialog = ref(false);
const saving = ref(false);

const form = ref({
  username: '',
  password: '',
  nameL: '',
  surnameL: '',
  nameE: '',
  surnameE: '',
  bnk_code: '',
  branch_id: '',
  MID: null,
  GID: null,
  profile_image: null,
  is_active: true,
  is_staff: false,
});

const members = ref([]);
const groups = ref([]);

// API URLs
const config = useRuntimeConfig();
const apiMemberURL = `${config.public.strapi.url}api/memberinfo/`;
const apiGroupURL = `${config.public.strapi.url}api/usergroup_list/`;
const apiUserURL = `${config.public.strapi.url}api/user/`;

// Handle image change and preview
const onImageChange = () => {
  const file = form.value.profile_image;
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  } else {
    imagePreview.value = '';
  }
};

// Toggle password visibility
const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

// Fetch members
const fetchMembers = async () => {
  try {
    const res = await axios.get(apiMemberURL);
    members.value = res.data.map(m => ({
      id: m.id || m.MID,
      bnk_code: m.bnk_code,
      display_name: `${m.nameL} (${m.code || m.bnk_code}-${m.bnk_code})`,
    }));
  } catch (err) {
    console.error('Error fetching members:', err);
  }
};

// Fetch groups
const fetchGroups = async () => {
  try {
    const res = await axios.get(apiGroupURL);
    groups.value = res.data;
  } catch (err) {
    console.error('Error fetching groups:', err);
  }
};

// Get member display name
const getMemberDisplay = (bnk_code) => {
  const member = members.value.find(m => m.bnk_code === bnk_code);
  return member ? member.display_name : bnk_code;
};

// Get group display name
const getGroupDisplay = (gid) => {
  const group = groups.value.find(g => g.GID === gid);
  return group ? group.nameL : '-';
};

// Update MID when bank code is selected
const updateMID = (selectedCode) => {
  const selected = members.value.find(m => m.bnk_code === selectedCode);
  form.value.MID = selected ? selected.id : null;
  console.log('Selected bank code:', selectedCode, '→ MID (memberInfo id):', form.value.MID);
};

// Confirm and save user
const confirmSaveUser = async () => {
  await saveUser();
};

// Save user
const saveUser = async () => {
  if (!formValid.value) {
    alert('⚠️ ກະລຸນາກອກຂໍ້ມູນໃຫ້ຄົບຖ້ວນ!');
    showConfirmDialog.value = false;
    return;
  }

  saving.value = true;

  const formData = new FormData();
  
  const hashedPassword = CryptoJS.MD5(form.value.password).toString();
  
  for (const key in form.value) {
    const value = form.value[key];
    
    // Skip null or empty values except for switches
    if (value === null || value === '') {
      if (key !== 'is_active' && key !== 'is_staff') continue;
    }
    
    // Handle image file - only add if exists
    if (key === 'profile_image') {
      if (value) {
        formData.append('profile_image', value);
      }
    }
    // Handle password
    else if (key === 'password') {
      formData.append('password', hashedPassword);
    }
    // Handle all other fields
    else {
      formData.append(key, value);
    }
  }

  console.log('📤 Sending user data:');
  for (let pair of formData.entries()) {
    console.log(pair[0] + ': ' + pair[1]);
  }

  try {
    const response = await axios.post(apiUserURL, formData, {
      headers: { 
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log('✅ Response:', response.data);
    showConfirmDialog.value = false;
    emit('saved', response.data);
    emit('close');
  } catch (err) {
    console.error('❌ Error adding user:', err);
    console.error('Error response:', err.response?.data);
    
    let errorMsg = 'ເກີດຂໍ້ຜິດພາດໃນການເພີ່ມຜູ້ໃຊ້!';
    if (err.response?.data) {
      if (err.response.data.errors) {
        errorMsg = JSON.stringify(err.response.data.errors, null, 2);
      } else if (typeof err.response.data === 'object') {
        errorMsg = JSON.stringify(err.response.data, null, 2);
      } else {
        errorMsg = err.response.data;
      }
    }
    alert('❌ ' + errorMsg);
    showConfirmDialog.value = false;
  } finally {
    saving.value = false;
  }
};

// Clear form
const clearForm = () => {
  form.value = {
    username: '',
    password: '',
    nameL: '',
    surnameL: '',
    nameE: '',
    surnameE: '',
    bnk_code: '',
    branch_id: '',
    MID: null,
    GID: null,
    profile_image: null,
    is_active: true,
    is_staff: false,
  };
  imagePreview.value = '';
  showPassword.value = false;
  formRef.value?.resetValidation();
};

// Load initial data
onMounted(async () => {
  await Promise.all([
    fetchMembers(),
    fetchGroups(),
  ]);
});
</script>

<style scoped>
.user-add-container {
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
  background: linear-gradient(135deg, #1e38ce 0%, #150aac 100%);
  color: white;
}

.header-section .text-h5 {
  color: white !important;
}

.form-body {
  padding: 20px;
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

.v-row {
  margin: 0 !important;
}

.v-col {
  padding: 4px !important;
}

.v-text-field, .v-select, .v-file-input {
  margin-bottom: 0 !important;
  padding-top: 0 !important;
}

.v-switch {
  margin: 0 !important;
  padding: 0 !important;
  line-height: 1 !important;
}

.v-text-field :deep(.v-label),
.v-select :deep(.v-label),
.v-file-input :deep(.v-label),
.v-switch :deep(.v-label) {
  font-size: 0.85rem !important;
}

.v-avatar {
  border: 4px solid #1565c0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.v-btn {
  min-width: 100px;
  font-weight: 500;
}

/* Improved Confirm Dialog Styles */
.confirm-dialog-card {
  border-radius: 16px !important;
  overflow: hidden;
}

.confirm-dialog-header {
  background: linear-gradient(135deg, #1565c0 0%, #0d47a1 100%);
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

.user-confirm-box {
  background: #f5f5f5;
  border-radius: 12px;
  border-left: 4px solid #1565c0;
}
</style>