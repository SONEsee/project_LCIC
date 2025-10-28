<template>
  <div class="member-edit-container">
    <!-- Header -->
    <div class="header-section">
      <div class="d-flex align-center">
        <v-icon color="white" large class="mr-2">mdi-account-edit</v-icon>
        <span class="text-h5 font-weight-bold" style="color: white;">ແກ້ໄຂຂໍ້ມູນສະມາຊິກ</span>
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
              alt="Member Image"
              cover
            >
              <template v-slot:placeholder>
                <v-icon size="100" color="grey lighten-1">mdi-account-circle</v-icon>
              </template>
            </v-img>
          </v-avatar>
          <v-file-input
            label="ຮູບພາບສະມາຊິກ"
            v-model="form.mImage"
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
          <!-- Badge แสดงว่ามีรูปใหม่ -->
          <v-chip 
            v-if="hasNewImage" 
            color="success" 
            size="small" 
            class="mt-2"
          >
            <v-icon start size="small">mdi-image-check</v-icon>
            ຮູບໃໝ່
          </v-chip>
        </v-col>

        <!-- Right Side: Form Fields -->
        <v-col cols="12" md="9">
          <v-form ref="formRef" v-model="formValid" lazy-validation>
            <v-row dense no-gutters>
              <!-- Code -->
              <v-col cols="6">
                <v-text-field
                  label="ລະຫັດ (Code)"
                  v-model="form.code"
                  outlined
                  density="compact"
                  color="blue lighten-2"
                  clearable
                  :rules="[v => !!v || 'ກະລຸນາປ້ອນລະຫັດ']"
                />
              </v-col>

              <!-- Bank Code -->
              <v-col cols="6">
                <v-text-field
                  label="ລະຫັດທະນາຄານ (Bank Code)"
                  v-model="form.bnk_code"
                  outlined
                  density="compact"
                  color="blue lighten-2"
                  clearable
                />
              </v-col>

              <!-- Member Type -->
              <v-col cols="6">
                <v-select
                  v-model="form.memberType"
                  :items="memberTypes"
                  item-title="nameL"
                  item-value="id"
                  label="ປະເພດສະມາຊິກ"
                  clearable
                  outlined
                  density="compact"
                  color="indigo lighten-2"
                  @update:modelValue="onMemberTypeChange"
                />
              </v-col>

              <!-- Registration Date -->
              <v-col cols="6">
                <v-text-field
                  label="ວັນທີ່ລົງທະບຽນ"
                  v-model="form.dateRegis"
                  type="date"
                  outlined
                  density="compact"
                  color="blue lighten-2"
                  clearable
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
                />
              </v-col>

              <!-- Name English -->
              <v-col cols="6">
                <v-text-field
                  label="ຊື່ (ພາສາອັງກິດ)"
                  v-model="form.nameE"
                  outlined
                  density="compact"
                  color="cyan lighten-2"
                  clearable
                />
              </v-col>

              <!-- Description Lao -->
              <v-col cols="12">
                <v-textarea
                  label="ຄຳອະທິບາຍ (ພາສາລາວ)"
                  v-model="form.descL"
                  outlined
                  density="compact"
                  color="cyan lighten-2"
                  rows="2"
                  clearable
                />
              </v-col>

              <!-- Description English -->
              <v-col cols="12">
                <v-textarea
                  label="ຄຳອະທິບາຍ (ພາສາອັງກິດ)"
                  v-model="form.descE"
                  outlined
                  density="compact"
                  color="cyan lighten-2"
                  rows="2"
                  clearable
                />
              </v-col>

              <!-- Street Info Lao -->
              <v-col cols="6">
                <v-text-field
                  label="ຂໍ້ມູນຖະໜົນ (ພາສາລາວ)"
                  v-model="form.streetInfoL"
                  outlined
                  density="compact"
                  color="light-blue lighten-2"
                  clearable
                />
              </v-col>

              <!-- Street Info English -->
              <v-col cols="6">
                <v-text-field
                  label="ຂໍ້ມູນຖະໜົນ (ພາສາອັງກິດ)"
                  v-model="form.streetInfoE"
                  outlined
                  density="compact"
                  color="light-blue lighten-2"
                  clearable
                />
              </v-col>

              <!-- Province (Dropdown) -->
              <v-col cols="4">
                <v-select
                  v-model="form.provInfo"
                  :items="provinces"
                  item-title="nameL"
                  item-value="id"
                  label="ແຂວງ"
                  clearable
                  outlined
                  density="compact"
                  color="indigo lighten-2"
                  @update:modelValue="onProvinceChange"
                />
              </v-col>

              <!-- District (Autocomplete with Search) -->
              <v-col cols="4">
                <v-autocomplete
                  v-model="form.districtInfo"
                  :items="districts"
                  item-title="nameL"
                  item-value="id"
                  label="ເມືອງ"
                  clearable
                  outlined
                  density="compact"
                  color="indigo lighten-2"
                  v-model:search="districtSearch"
                  @update:search="onDistrictSearch"
                  :loading="districtLoading"
                  @update:modelValue="onDistrictChange"
                  no-filter
                  placeholder="ພິມເພື່ອຄົ້ນຫາເມືອງ..."
                >
                  <template v-slot:no-data>
                    <v-list-item>
                      <v-list-item-title>
                        {{ districtSearch ? 'ບໍ່ພົບຂໍ້ມູນເມືອງ' : 'ກະລຸນາພິມເພື່ອຄົ້ນຫາ' }}
                      </v-list-item-title>
                    </v-list-item>
                  </template>
                </v-autocomplete>
              </v-col>

              <!-- Village (Autocomplete with Search) -->
              <v-col cols="4">
                <v-autocomplete
                  v-model="form.villageInfo"
                  :items="villages"
                  item-title="nameL"
                  item-value="id"
                  label="ບ້ານ"
                  clearable
                  outlined
                  density="compact"
                  color="indigo lighten-2"
                  v-model:search="villageSearch"
                  @update:search="onVillageSearch"
                  :loading="villageLoading"
                  no-filter
                  placeholder="ພິມເພື່ອຄົ້ນຫາບ້ານ..."
                >
                  <template v-slot:no-data>
                    <v-list-item>
                      <v-list-item-title>
                        {{ villageSearch ? 'ບໍ່ພົບຂໍ້ມູນບ້ານ' : 'ກະລຸນາພິມເພື່ອຄົ້ນຫາ' }}
                      </v-list-item-title>
                    </v-list-item>
                  </template>
                </v-autocomplete>
              </v-col>

              <!-- Published -->
              <v-col cols="6">
                <v-switch
                  label="ເຜີຍແຜ່"
                  v-model="form.published"
                  color="green"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-col>
      </v-row>
    </div>

    <!-- Footer -->
    <div class="footer-section">
      <v-btn text color="grey darken-1" rounded @click="$emit('close')">ຍົກເລີກ</v-btn>
      <v-btn color="blue darken-2" rounded :disabled="!formValid" @click="showConfirmDialog = true">
        <v-icon left>mdi-content-save</v-icon> ອັບເດດສະມາຊິກ
      </v-btn>
    </div>

    <!-- 🔔 Confirm Dialog -->
    <v-dialog v-model="showConfirmDialog" max-width="450" persistent>
      <v-card class="confirm-dialog-card" elevation="8">
        <!-- Header -->
        <v-card-title class="confirm-dialog-header pa-4">
          <div class="d-flex align-center">
            <div class="confirm-icon-wrapper">
              <v-icon size="28" color="white">mdi-alert-circle-outline</v-icon>
            </div>
            <div class="ml-3">
              <h2 class="text-h5 font-weight-bold text-white mb-1">ຢືນຢັນການແກ້ໄຂຂໍ້ມູນ</h2>
              <p class="text-body-2 text-white opacity-90 mb-0">ກະລຸນາກວດສອບຂໍ້ມູນກ່ອນບັນທຶກ</p>
            </div>
          </div>
        </v-card-title>

        <!-- Content -->
        <v-card-text class="pa-4">
          <div class="text-center mb-3">
            <v-avatar size="100" class="mb-3 position-relative">
              <v-img 
                v-if="imagePreview" 
                :src="imagePreview" 
                cover 
              />
              <v-icon v-else size="100" color="grey">mdi-account-circle</v-icon>
              <!-- Badge for new image -->
              <v-chip
                v-if="hasNewImage"
                color="success"
                size="x-small"
                class="position-absolute"
                style="top: 0; right: 0;"
              >
                ໃໝ່
              </v-chip>
            </v-avatar>
          </div>

          <div class="member-confirm-box pa-3 mb-3">
            <v-row dense>
              <v-col cols="12" class="mb-2">
                <div class="d-flex align-center">
                  <v-icon size="20" color="primary" class="mr-2">mdi-code-tags</v-icon>
                  <span class="text-body-2 text-grey-darken-1 mr-2">ຕົວຫຍໍ້:</span>
                  <span class="font-weight-bold">{{ form.code || '-' }}</span>
                </div>
              </v-col>
              <v-col cols="12" class="mb-2">
                <div class="d-flex align-center">
                  <v-icon size="20" color="info" class="mr-2">mdi-bank</v-icon>
                  <span class="text-body-2 text-grey-darken-1 mr-2">ລະຫັດທະນາຄານ:</span>
                  <span class="font-weight-bold">{{ form.bnk_code || '-' }}</span>
                </div>
              </v-col>
              <v-col cols="12" class="mb-2">
                <div class="d-flex align-center">
                  <v-icon size="20" color="success" class="mr-2">mdi-text</v-icon>
                  <span class="text-body-2 text-grey-darken-1 mr-2">ຊື່ (ລາວ):</span>
                  <span class="font-weight-bold">{{ form.nameL || '-' }}</span>
                </div>
              </v-col>
              <v-col cols="12" class="mb-2">
                <div class="d-flex align-center">
                  <v-icon size="20" color="warning" class="mr-2">mdi-text-box</v-icon>
                  <span class="text-body-2 text-grey-darken-1 mr-2">ຊື່ (ອັງກິດ):</span>
                  <span class="font-weight-bold">{{ form.nameE || '-' }}</span>
                </div>
              </v-col>
              <v-col cols="12" v-if="hasNewImage">
                <div class="d-flex align-center">
                  <v-icon size="20" color="purple" class="mr-2">mdi-image-check</v-icon>
                  <span class="text-body-2 text-grey-darken-1 mr-2">ສະຖານະຮູບ:</span>
                  <span class="font-weight-bold text-success">ມີຮູບພາບໃໝ່</span>
                </div>
              </v-col>
            </v-row>
          </div>

          <p class="text-center text-body-1 mb-0">
            ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການອັບເດດຂໍ້ມູນສະມາຊິກນີ້?
          </p>
        </v-card-text>

        <!-- Actions -->
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
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';

const props = defineProps({
  memberData: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['close', 'updated']);
const formRef = ref(null);
const formValid = ref(false);
const imagePreview = ref('');
const originalImageUrl = ref('');
const hasNewImage = ref(false);
const showConfirmDialog = ref(false);
const updating = ref(false);

const form = ref({
  id: null,
  code: '',
  bnk_code: '',
  bnk_type: null,
  nameL: '',
  nameE: '',
  descL: '',
  descE: '',
  streetInfoL: '',
  streetInfoE: '',
  memberType: null,
  villageInfo: null,
  districtInfo: null,
  provInfo: null,
  mImage: null,
  published: true,
  dateRegis: null,
});

const memberTypes = ref([]);
const provinces = ref([]);
const districts = ref([]);
const villages = ref([]);

// Search states
const districtSearch = ref('');
const villageSearch = ref('');
const districtLoading = ref(false);
const villageLoading = ref(false);

// Debounce timers
let districtTimeout = null;
let villageTimeout = null;

// API URLs
const config = useRuntimeConfig();
const apiMemberURL = `${config.public.strapi.url}api/member_list/`;
const apiMemberTypeURL = `${config.public.strapi.url}api/membertypes/`;
const apiProvinceURL = `${config.public.strapi.url}api/provinfos/`;
const apiDistrictURL = `${config.public.strapi.url}api/districtinfos/`;
const apiVillageURL = `${config.public.strapi.url}api/villageinfos/`;

// Handle image change and preview
const onImageChange = () => {
  const file = form.value.mImage;
  
  console.log('📸 Image changed (Edit):', file);
  
  if (file && file instanceof File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target.result;
      hasNewImage.value = true;
      console.log('✅ New image preview set');
    };
    reader.readAsDataURL(file);
  } else {
    imagePreview.value = originalImageUrl.value;
    hasNewImage.value = false;
    console.log('⚠️ No valid file selected, reverting to original');
  }
};

// Fetch member types
const fetchMemberTypes = async () => {
  try {
    const res = await axios.get(apiMemberTypeURL);
    memberTypes.value = res.data.results || res.data;
  } catch (err) {
    console.error('❌ Error fetching member types:', err);
  }
};

// Fetch provinces
const fetchProvinces = async () => {
  try {
    const res = await axios.get(apiProvinceURL);
    provinces.value = res.data.results || res.data;
  } catch (err) {
    console.error('❌ Error fetching provinces:', err);
  }
};

// Search districts with debounce
const onDistrictSearch = (searchValue) => {
  if (districtTimeout) clearTimeout(districtTimeout);
  if (!searchValue || searchValue.trim() === '') {
    if (!form.value.districtInfo) districts.value = [];
    return;
  }
  districtLoading.value = true;
  districtTimeout = setTimeout(async () => {
    try {
      const url = `${apiDistrictURL}?search=${encodeURIComponent(searchValue.trim())}`;
      const res = await axios.get(url);
      districts.value = res.data.results || res.data;
    } catch (err) {
      console.error('❌ Error searching districts:', err);
      districts.value = [];
    } finally {
      districtLoading.value = false;
    }
  }, 500);
};

// Search villages with debounce
const onVillageSearch = (searchValue) => {
  if (villageTimeout) clearTimeout(villageTimeout);
  if (!searchValue || searchValue.trim() === '') {
    if (!form.value.villageInfo) villages.value = [];
    return;
  }
  villageLoading.value = true;
  villageTimeout = setTimeout(async () => {
    try {
      const url = `${apiVillageURL}?search=${encodeURIComponent(searchValue.trim())}`;
      const res = await axios.get(url);
      villages.value = res.data.results || res.data;
    } catch (err) {
      console.error('❌ Error searching villages:', err);
      villages.value = [];
    } finally {
      villageLoading.value = false;
    }
  }, 500);
};

// Handle province change
const onProvinceChange = () => {
  form.value.districtInfo = null;
  form.value.villageInfo = null;
  districts.value = [];
  villages.value = [];
  districtSearch.value = '';
  villageSearch.value = '';
};

// Handle district change
const onDistrictChange = () => {
  form.value.villageInfo = null;
  villages.value = [];
  villageSearch.value = '';
};

// Handle member type change
const onMemberTypeChange = (memberTypeId) => {
  if (memberTypeId === 1) {
    form.value.bnk_type = 1;
  } else if (memberTypeId) {
    form.value.bnk_type = 2;
  } else {
    form.value.bnk_type = null;
  }
};

// Confirm and update member
const confirmUpdate = async () => {
  await updateMember();
};

// Update member
const updateMember = async () => {
  if (!formValid.value) {
    alert('⚠️ ກະລຸນາກອກຂໍ້ມູນໃຫ້ຄົບຖ້ວນ!');
    showConfirmDialog.value = false;
    return;
  }

  updating.value = true;
  const formData = new FormData();
  
  for (const key in form.value) {
    if (key === 'id') continue;
    const value = form.value[key];
    
    if (value === null || value === '') {
      if (key !== 'published') continue;
    }
    
    if (key === 'mImage') {
      if (value && value instanceof File) {
        formData.append('mImage', value);
      }
    } else {
      formData.append(key, value);
    }
  }

  try {
    await axios.put(`${apiMemberURL}${form.value.id}/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    
    showConfirmDialog.value = false;
    emit('updated');
    emit('close');
  } catch (err) {
    console.error('❌ Error updating member:', err);
    let errorMsg = 'ເກີດຂໍ້ຜິດພາດໃນການອັບເດດ!';
    if (err.response?.data) {
      if (typeof err.response.data === 'object') {
        errorMsg = JSON.stringify(err.response.data, null, 2);
      } else {
        errorMsg = err.response.data;
      }
    }
    alert('❌ ' + errorMsg);
    showConfirmDialog.value = false;
  } finally {
    updating.value = false;
  }
};

// Load existing location data
const loadExistingLocationData = async () => {
  if (props.memberData.districtInfo) {
    districts.value = [props.memberData.districtInfo];
    districtSearch.value = props.memberData.districtInfo.nameL || '';
  }
  if (props.memberData.villageInfo) {
    villages.value = [props.memberData.villageInfo];
    villageSearch.value = props.memberData.villageInfo.nameL || '';
  }
};

// Initialize form
const initializeForm = async () => {
  form.value = {
    id: props.memberData.id,
    code: props.memberData.code || '',
    bnk_code: props.memberData.bnk_code || '',
    bnk_type: props.memberData.bnk_type || null,
    nameL: props.memberData.nameL || '',
    nameE: props.memberData.nameE || '',
    descL: props.memberData.descL || '',
    descE: props.memberData.descE || '',
    streetInfoL: props.memberData.streetInfoL || '',
    streetInfoE: props.memberData.streetInfoE || '',
    memberType: props.memberData.memberType?.id || null,
    villageInfo: props.memberData.villageInfo?.id || null,
    districtInfo: props.memberData.districtInfo?.id || null,
    provInfo: props.memberData.provInfo?.id || null,
    mImage: null,
    published: props.memberData.published ?? true,
    dateRegis: props.memberData.dateRegis ? new Date(props.memberData.dateRegis).toISOString().split('T')[0] : null,
  };

  if (props.memberData.mImage_url) {
    originalImageUrl.value = props.memberData.mImage_url;
    imagePreview.value = props.memberData.mImage_url;
  } else if (props.memberData.mImage) {
    originalImageUrl.value = props.memberData.mImage;
    imagePreview.value = props.memberData.mImage;
  } else {
    originalImageUrl.value = '';
    imagePreview.value = '';
  }
  
  hasNewImage.value = false;
  await loadExistingLocationData();
};

// Clear form
const clearForm = () => {
  initializeForm();
  formRef.value?.resetValidation();
};

onMounted(async () => {
  await Promise.all([fetchMemberTypes(), fetchProvinces()]);
  await initializeForm();
});

watch(() => props.memberData, async () => {
  await initializeForm();
}, { deep: true });
</script>

<style scoped>
.member-edit-container {
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

.v-text-field, .v-select, .v-textarea, .v-file-input, .v-autocomplete {
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
.v-textarea :deep(.v-label),
.v-file-input :deep(.v-label),
.v-autocomplete :deep(.v-label),
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

.member-confirm-box {
  background: #f5f5f5;
  border-radius: 12px;
  border-left: 4px solid #1565c0;
}

.position-relative {
  position: relative;
}

.position-absolute {
  position: absolute;
}
</style>