<template>
  <div class="profile-edit-container">
    <!-- Header -->
    <div class="header-section">
      <div class="d-flex align-center">
        <v-icon color="white" large class="mr-2">mdi-account-circle</v-icon>
        <span class="text-h5 font-weight-bold" style="color: white;">ແກ້ໄຂໂປຣໄຟລ໌ຂອງຂ້ອຍ</span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-section">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      <p class="mt-4">ກຳລັງໂຫລດຂໍ້ມູນ...</p>
    </div>

    <!-- Form Body -->
    <div v-else class="form-body">
      <v-row dense no-gutters>
        <!-- Left Side: Image Preview -->
        <v-col cols="12" md="4" class="d-flex flex-column align-center justify-start pt-4">
          <v-avatar size="180" class="mb-3 profile-avatar">
            <v-img 
              :src="imagePreview" 
              alt="Profile Image"
              cover
            >
              <template v-slot:placeholder>
                <v-icon size="120" color="grey lighten-1">mdi-account-circle</v-icon>
              </template>
            </v-img>
          </v-avatar>
          <v-file-input
            label="ປ່ຽນຮູບໂປຣໄຟລ໌"
            v-model="form.profile_image"
            accept="image/*"
            outlined
            density="compact"
            color="blue lighten-2"
            clearable
            @change="onImageChange"
            @click:clear="clearImage"
            hide-details
            class="mt-2"
            style="width: 100%; max-width: 250px;"
            prepend-icon="mdi-camera"
          />
        </v-col>

        <!-- Right Side: Form Fields -->
        <v-col cols="12" md="8">
          <v-form ref="formRef" v-model="formValid" lazy-validation>
            <v-row dense no-gutters>
              <!-- Username (Read-only) -->
              <v-col cols="12" class="mb-2">
                <v-text-field
                  label="ຊື່ຜູ້ໃຊ້"
                  v-model="form.username"
                  outlined
                  density="compact"
                  readonly
                  prepend-inner-icon="mdi-account"
                  color="grey"
                  variant="outlined"
                  bg-color="grey-lighten-4"
                />
              </v-col>

              <!-- Bank Code (Read-only) -->
              <v-col cols="6" class="mb-2">
                <v-text-field
                  label="ລະຫັດສະມາຊິກ"
                  v-model="userBankCode"
                  outlined
                  density="compact"
                  readonly
                  prepend-inner-icon="mdi-bank"
                  color="grey"
                  bg-color="grey-lighten-4"
                />
              </v-col>

              <!-- Branch ID (Read-only) -->
              <v-col cols="6" class="mb-2">
                <v-text-field
                  label="ລະຫັດສາຂາ"
                  v-model="form.branch_id"
                  outlined
                  density="compact"
                  readonly
                  prepend-inner-icon="mdi-office-building"
                  color="grey"
                  bg-color="grey-lighten-4"
                />
              </v-col>

              <!-- Divider -->
              <v-col cols="12" class="my-3">
                <v-divider></v-divider>
                <p class="text-center text-caption text-grey mt-2">ຂໍ້ມູນທີ່ສາມາດແກ້ໄຂໄດ້</p>
              </v-col>

              <!-- New Password (Editable) -->
              <v-col cols="12" class="mb-2">
                <v-text-field
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  label="ລະຫັດຜ່ານໃໝ່"
                  outlined
                  density="compact"
                  color="blue lighten-2"
                  placeholder="ປ່ອຍວ່າງໄວ້ຖ້າບໍ່ຕ້ອງການປ່ຽນ"
                  clearable
                  prepend-inner-icon="mdi-lock"
                  :rules="passwordRules"
                >
                  <template #append-inner>
                    <v-btn 
                      icon 
                      size="small"
                      @click="togglePassword" 
                      :title="showPassword ? 'ເຊື່ອງລະຫັດ' : 'ສະແດງລະຫັດ'"
                    >
                      <v-icon size="small">{{ showPassword ? 'mdi-eye-off' : 'mdi-eye' }}</v-icon>
                    </v-btn>
                  </template>
                </v-text-field>
              </v-col>

              <!-- Name Lao (Editable) -->
              <v-col cols="6" class="mb-2">
                <v-text-field
                  label="ຊື່ (ພາສາລາວ)"
                  v-model="form.nameL"
                  outlined
                  density="compact"
                  color="cyan lighten-2"
                  clearable
                  prepend-inner-icon="mdi-pencil"
                  :rules="[v => !!v || 'ກະລຸນາປ້ອນຊື່']"
                />
              </v-col>

              <!-- Surname Lao (Editable) -->
              <v-col cols="6" class="mb-2">
                <v-text-field
                  label="ນາມສະກຸນ (ພາສາລາວ)"
                  v-model="form.surnameL"
                  outlined
                  density="compact"
                  color="cyan lighten-2"
                  clearable
                  prepend-inner-icon="mdi-pencil"
                  :rules="[v => !!v || 'ກະລຸນາປ້ອນນາມສະກຸນ']"
                />
              </v-col>

              <!-- Name English (Editable) -->
              <v-col cols="6" class="mb-2">
                <v-text-field
                  label="ຊື່ (ພາສາອັງກິດ)"
                  v-model="form.nameE"
                  outlined
                  density="compact"
                  color="light-blue lighten-2"
                  clearable
                  prepend-inner-icon="mdi-pencil"
                />
              </v-col>

              <!-- Surname English (Editable) -->
              <v-col cols="6" class="mb-2">
                <v-text-field
                  label="ນາມສະກຸນ (ພາສາອັງກິດ)"
                  v-model="form.surnameE"
                  outlined
                  density="compact"
                  color="light-blue lighten-2"
                  clearable
                  prepend-inner-icon="mdi-pencil"
                />
              </v-col>

              <!-- Info Card -->
              <v-col cols="12" class="mt-3">
                <v-alert
                  type="info"
                  variant="tonal"
                  density="compact"
                  icon="mdi-information"
                >
                  <small>ຂໍ້ມູນອື່ນໆ ເຊັ່ນ: ຊື່ຜູ້ໃຊ້, ລະຫັດສະມາຊິກ, ໜ້າທີ່ ບໍ່ສາມາດແກ້ໄຂດ້ວຍຕົວເອງໄດ້</small>
                </v-alert>
              </v-col>
            </v-row>
          </v-form>
        </v-col>
      </v-row>
    </div>

    <!-- Footer -->
    <div class="footer-section" v-if="!loading">
      <v-btn 
        color="blue darken-2" 
        rounded 
        size="large"
        :disabled="!formValid || !hasChanges" 
        @click="showConfirmDialog = true"
        class="update-btn"
      >
        <v-icon left>mdi-content-save</v-icon> ອັບເດດໂປຣໄຟລ໌
      </v-btn>
    </div>

    <!-- Confirm Dialog -->
    <v-dialog v-model="showConfirmDialog" max-width="500" persistent>
      <v-card class="confirm-dialog-card" elevation="12">
        <v-card-title class="confirm-dialog-header pa-4">
          <div class="d-flex align-center">
            <div class="confirm-icon-wrapper">
              <v-icon size="32" color="white">mdi-shield-check</v-icon>
            </div>
            <div class="ml-3">
              <h2 class="text-h5 font-weight-bold text-white mb-1">ຢືນຢັນການອັບເດດ</h2>
              <p class="text-body-2 text-white opacity-90 mb-0">ກະລຸນາກວດສອບຂໍ້ມູນກ່ອນບັນທຶກ</p>
            </div>
          </div>
        </v-card-title>

        <v-card-text class="pa-5">
          <div class="text-center mb-4">
            <v-avatar size="120" class="mb-3">
              <v-img 
                v-if="imagePreview" 
                :src="imagePreview" 
                cover 
              />
              <v-icon v-else size="120" color="grey">mdi-account-circle</v-icon>
            </v-avatar>
          </div>

          <div class="user-confirm-box pa-4 mb-4">
            <v-row dense>
              <v-col cols="12" class="mb-2">
                <div class="d-flex align-center">
                  <v-icon size="20" color="primary" class="mr-2">mdi-account</v-icon>
                  <span class="text-body-2 text-grey-darken-1 mr-2">ຊື່ຜູ້ໃຊ້:</span>
                  <span class="font-weight-bold">{{ form.username }}</span>
                </div>
              </v-col>
              <v-col cols="12" class="mb-2">
                <div class="d-flex align-center">
                  <v-icon size="20" color="success" class="mr-2">mdi-account-details</v-icon>
                  <span class="text-body-2 text-grey-darken-1 mr-2">ຊື່-ນາມສະກຸນ (ລາວ):</span>
                  <span class="font-weight-bold">{{ form.nameL }} {{ form.surnameL }}</span>
                </div>
              </v-col>
              <v-col cols="12" class="mb-2" v-if="form.nameE || form.surnameE">
                <div class="d-flex align-center">
                  <v-icon size="20" color="info" class="mr-2">mdi-account-details-outline</v-icon>
                  <span class="text-body-2 text-grey-darken-1 mr-2">ຊື່-ນາມສະກຸນ (Eng):</span>
                  <span class="font-weight-bold">{{ form.nameE }} {{ form.surnameE }}</span>
                </div>
              </v-col>
              <v-col cols="12" v-if="form.password && form.password.trim() !== ''">
                <div class="d-flex align-center">
                  <v-icon size="20" color="error" class="mr-2">mdi-lock-reset</v-icon>
                  <span class="text-body-2 text-grey-darken-1 mr-2">ລະຫັດຜ່ານ:</span>
                  <span class="font-weight-bold text-error">ຈະຖືກປ່ຽນແປງ</span>
                </div>
              </v-col>
            </v-row>
          </div>

          <p class="text-center text-body-1 mb-0 font-weight-medium">
            ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການອັບເດດໂປຣໄຟລ໌?
          </p>
        </v-card-text>

        <v-card-actions class="pa-4 pt-0">
          <v-btn
            color="grey-darken-1"
            variant="text"
            size="large"
            @click="showConfirmDialog = false"
            :disabled="updating"
            class="flex-grow-1"
          >
            <v-icon left>mdi-close</v-icon>
            ຍົກເລີກ
          </v-btn>
          <v-btn
            color="#1565c0"
            variant="flat"
            size="large"
            @click="confirmUpdate"
            :loading="updating"
            class="flex-grow-1"
          >
            <v-icon left>mdi-check</v-icon>
            ຢືນຢັນ
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Success Snackbar -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
      location="top"
    >
      {{ snackbar.message }}
      <template v-slot:actions>
        <v-btn
          color="white"
          variant="text"
          @click="snackbar.show = false"
        >
          ປິດ
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: "auth",
  layout: "backend",
});

import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useUserUID } from '~/composables/useUserUID';

const { userData, UID: currentUID } = useUserUID();
const config = useRuntimeConfig();
const apiUserURL = `${config.public.strapi.url}api/user/`;

const formRef = ref(null);
const formValid = ref(false);
const loading = ref(true);
const showPassword = ref(false);
const showConfirmDialog = ref(false);
const updating = ref(false);
const imagePreview = ref('');
const originalImageUrl = ref('');
const originalData = ref(null);

const form = ref({
  UID: null,
  username: '',
  password: '',
  nameL: '',
  surnameL: '',
  nameE: '',
  surnameE: '',
  bnk_code: '',
  branch_id: '',
  profile_image: null,
});

const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
});

// Password validation rules
const passwordRules = [
  v => !v || v.length === 0 || v.length >= 6 || 'ລະຫັດຜ່ານຕ້ອງມີຢ່າງໜ້ອຍ 6 ຕົວອັກສອນ',
];

// Computed: Bank Code display
const userBankCode = computed(() => {
  return userData.value?.MID?.code || form.value.bnk_code || '-';
});

// Check if there are any changes
const hasChanges = computed(() => {
  if (!originalData.value) return false;
  
  return (
    form.value.nameL !== originalData.value.nameL ||
    form.value.surnameL !== originalData.value.surnameL ||
    form.value.nameE !== originalData.value.nameE ||
    form.value.surnameE !== originalData.value.surnameE ||
    form.value.profile_image !== null ||
    (form.value.password && form.value.password.trim() !== '')
  );
});

// Toggle password visibility
const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

// Handle image change
const onImageChange = (event) => {
  const file = form.value.profile_image;
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

// Clear image
const clearImage = () => {
  form.value.profile_image = null;
  imagePreview.value = originalImageUrl.value || '';
};

// Fetch current user data
const fetchUserData = async () => {
  if (!currentUID.value) {
    showSnackbar('ບໍ່ພົບຂໍ້ມູນຜູ້ໃຊ້', 'error');
    return;
  }

  loading.value = true;
  try {
    const response = await axios.get(`${apiUserURL}${currentUID.value}/`);
    const data = response.data;
    
    form.value = {
      UID: data.UID,
      username: data.username || '',
      password: '',
      nameL: data.nameL || '',
      surnameL: data.surnameL || '',
      nameE: data.nameE || '',
      surnameE: data.surnameE || '',
      bnk_code: data.bnk_code || '',
      branch_id: data.branch_id || '',
      profile_image: null,
    };

    // Store original data for comparison
    originalData.value = {
      nameL: data.nameL || '',
      surnameL: data.surnameL || '',
      nameE: data.nameE || '',
      surnameE: data.surnameE || '',
    };

    // Set image preview
    if (data.profile_image) {
      originalImageUrl.value = data.profile_image;
      imagePreview.value = data.profile_image;
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    showSnackbar('ເກີດຂໍ້ຜິດພາດໃນການໂຫລດຂໍ້ມູນ', 'error');
  } finally {
    loading.value = false;
  }
};

// Confirm and update user
const confirmUpdate = async () => {
  if (!formValid.value) return;

  updating.value = true;
  const formData = new FormData();

  // Only append changed fields
  if (form.value.password && form.value.password.trim() !== '') {
    formData.append('password', form.value.password);
  }
  
  if (form.value.nameL !== originalData.value.nameL) {
    formData.append('nameL', form.value.nameL);
  }
  
  if (form.value.surnameL !== originalData.value.surnameL) {
    formData.append('surnameL', form.value.surnameL);
  }
  
  if (form.value.nameE !== originalData.value.nameE) {
    formData.append('nameE', form.value.nameE || '');
  }
  
  if (form.value.surnameE !== originalData.value.surnameE) {
    formData.append('surnameE', form.value.surnameE || '');
  }

  if (form.value.profile_image) {
    formData.append('profile_image', form.value.profile_image);
  }

  try {
    const response = await axios.put(
      `${apiUserURL}${form.value.UID}/`, 
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );

    showSnackbar('ອັບເດດໂປຣໄຟລ໌ສຳເລັດ!', 'success');
    showConfirmDialog.value = false;
    
    // Update localStorage if needed
    if (userData.value) {
      userData.value.nameL = form.value.nameL;
      userData.value.surnameL = form.value.surnameL;
      userData.value.nameE = form.value.nameE;
      userData.value.surnameE = form.value.surnameE;
      if (response.data.user?.profile_image) {
        userData.value.profile_image = response.data.user.profile_image;
      }
      localStorage.setItem('user_data', JSON.stringify(userData.value));
    }

    // Reload data
    await fetchUserData();
    form.value.password = ''; // Clear password field
  } catch (error) {
    console.error('Error updating profile:', error);
    showSnackbar(
      error.response?.data?.message || 'ເກີດຂໍ້ຜິດພາດໃນການອັບເດດ', 
      'error'
    );
  } finally {
    updating.value = false;
  }
};

// Show snackbar helper
const showSnackbar = (message, color = 'success') => {
  snackbar.value = {
    show: true,
    message,
    color
  };
};

onMounted(async () => {
  await fetchUserData();
});
</script>

<style scoped>
.profile-edit-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  background: #f5f5f5;
  border-radius: 16px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.header-section {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, #1e38ce 0%, #150aac 100%);
  color: white;
}

.loading-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  background: white;
}

.form-body {
  padding: 30px;
  background: white;
}

.footer-section {
  display: flex;
  justify-content: center;
  padding: 20px;
  background: #f5f5f5;
  border-top: 2px solid #e0e0e0;
}

.profile-avatar {
  border: 5px solid #1565c0;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
}

.profile-avatar:hover {
  transform: scale(1.05);
}

.update-btn {
  min-width: 200px;
  font-weight: 600;
  box-shadow: 0 4px 8px rgba(21, 101, 192, 0.3);
}

.v-text-field :deep(.v-field--disabled) {
  opacity: 0.7;
}

/* Confirm Dialog Styles */
.confirm-dialog-card {
  border-radius: 20px !important;
  overflow: hidden;
}

.confirm-dialog-header {
  background: linear-gradient(135deg, #1e38ce 0%, #150aac 100%);
}

.confirm-icon-wrapper {
  background: rgba(255, 255, 255, 0.25);
  padding: 14px;
  border-radius: 16px;
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-confirm-box {
  background: linear-gradient(135deg, #f5f5f5 0%, #e8eaf6 100%);
  border-radius: 12px;
  border-left: 5px solid #1565c0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.v-row {
  margin: 0 !important;
}

.v-col {
  padding: 6px !important;
}

@media (max-width: 960px) {
  .profile-edit-container {
    border-radius: 0;
  }
  
  .form-body {
    padding: 20px 15px;
  }
}
</style>