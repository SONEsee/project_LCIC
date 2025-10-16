<template>
  <div class="search-container">
    <v-container class="fill-height">
      <v-row justify="center" align="center">
        <v-col cols="12" sm="10" md="8" lg="7" xl="6">
          <v-card class="search-card" elevation="12">
            <!-- Header -->
            <v-card-title class="header-section">
              <div class="text-center w-100">
                <div class="icon-wrapper">
                  <v-icon class="header-icon" size="48">mdi-magnify</v-icon>
                </div>
                <h1 class="header-title">{{ title }}</h1>
                <p class="header-subtitle">ເລືອກບໍລິການທີ່ຕ້ອງການຄົ້ນຫາ ແລະ ປ້ອນຂໍ້ມູນລູກຄ້າ</p>
              </div>
            </v-card-title>

            <v-divider class="divider-primary"></v-divider>

            <!-- Form Content -->
            <v-card-text class="pa-6 pa-sm-8">
              <v-form ref="formRef" v-model="isFormValid" @submit.prevent="handleSearch">
                
                <!-- Service Selection -->
                <div class="service-selection mb-8">
                  <div class="section-header mb-5">
                    <v-icon color="primary" class="mr-2">mdi-view-grid</v-icon>
                    <h3 class="selection-title">ເລືອກປະເພດບໍລິການ</h3>
                  </div>
                  
                  <v-row>
                    <v-col cols="12" sm="4">
                      <v-card 
                        :class="['service-card', { 'selected': electronic, 'pulse': electronic }]"
                        @click="toggleService('electronic')"
                        hover
                        :ripple="true"
                      >
                        <v-card-text class="text-center pa-5">
                          <div class="icon-container mb-3">
                            <v-icon 
                              :color="electronic ? 'primary' : 'grey-darken-1'" 
                              size="40"
                            >
                              mdi-flash
                            </v-icon>
                          </div>
                          <div class="service-label" :class="{ 'label-active': electronic }">
                            ໄຟຟ້າ
                          </div>
                          <div class="service-sublabel">Electric Service</div>
                          <div class="checkbox-container">
                            <v-checkbox-btn 
                              v-model="electronic" 
                              color="primary"
                              hide-details
                            ></v-checkbox-btn>
                          </div>
                        </v-card-text>
                      </v-card>
                    </v-col>

                    <v-col cols="12" sm="4">
                      <v-card 
                        :class="['service-card', { 'selected': water, 'pulse': water }]"
                        @click="toggleService('water')"
                        hover
                        :ripple="true"
                      >
                        <v-card-text class="text-center pa-5">
                          <div class="icon-container mb-3">
                            <v-icon 
                              :color="water ? 'primary' : 'grey-darken-1'" 
                              size="40"
                            >
                              mdi-water
                            </v-icon>
                          </div>
                          <div class="service-label" :class="{ 'label-active': water }">
                            ນໍ້າປະປາ
                          </div>
                          <div class="service-sublabel">Water Service</div>
                          <div class="checkbox-container">
                            <v-checkbox-btn 
                              v-model="water" 
                              color="primary"
                              hide-details
                            ></v-checkbox-btn>
                          </div>
                        </v-card-text>
                      </v-card>
                    </v-col>

                    <v-col cols="12" sm="4">
                      <v-card 
                        :class="['service-card', { 'selected': telecom, 'pulse': telecom }]"
                        @click="toggleService('telecom')"
                        hover
                        :ripple="true"
                      >
                        <v-card-text class="text-center pa-5">
                          <div class="icon-container mb-3">
                            <v-icon 
                              :color="telecom ? 'primary' : 'grey-darken-1'" 
                              size="40"
                            >
                              mdi-phone
                            </v-icon>
                          </div>
                          <div class="service-label" :class="{ 'label-active': telecom }">
                            ໂທລະຄົມ
                          </div>
                          <div class="service-sublabel">Telecom Service</div>
                          <div class="checkbox-container">
                            <v-checkbox-btn 
                              v-model="telecom" 
                              color="primary"
                              hide-details
                            ></v-checkbox-btn>
                          </div>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                </div>

                <v-divider class="my-8"></v-divider>

                <!-- Input Fields -->
                <div class="input-section">
                  <div class="section-header mb-5">
                    <v-icon color="primary" class="mr-2">mdi-form-textbox</v-icon>
                    <h3 class="selection-title">ປ້ອນຂໍ້ມູນລູກຄ້າ</h3>
                  </div>
                  
                  <v-slide-y-transition group>
                    <div v-if="electronic" key="electronic" class="mb-5">
                      <v-text-field
                        v-model="electronicId"
                        label="ລະຫັດເລກກົງເຕີໄຟຟ້າ"
                        prepend-inner-icon="mdi-flash"
                        variant="outlined"
                        color="primary"
                        :rules="electronic ? [rules.required, rules.numbersOnly] : []"
                        placeholder="ປ້ອນລະຫັດເລກກົງເຕີໄຟຟ້າ"
                        counter="10"
                        maxlength="10"
                        class="input-field"
                        hint="ປ້ອນລະຫັດ 10 ຫຼັກ"
                        persistent-hint
                      >
                        <template v-slot:append-inner>
                          <v-icon v-if="electronicId && /^\d+$/.test(electronicId)" color="success">
                            mdi-check-circle
                          </v-icon>
                        </template>
                      </v-text-field>
                    </div>

                    <div v-if="water" key="water" class="mb-5">
                      <v-text-field
                        v-model="waterId"
                        label="ລະຫັດເລກກົງເຕີນໍ້າ"
                        prepend-inner-icon="mdi-water"
                        variant="outlined"
                        color="primary"
                        :rules="water ? [rules.required, rules.numbersOnly] : []"
                        placeholder="ປ້ອນລະຫັດເລກກົງເຕີນໍ້າ"
                        counter="10"
                        maxlength="10"
                        class="input-field"
                        hint="ປ້ອນລະຫັດ 10 ຫຼັກ"
                        persistent-hint
                      >
                        <template v-slot:append-inner>
                          <v-icon v-if="waterId && /^\d+$/.test(waterId)" color="success">
                            mdi-check-circle
                          </v-icon>
                        </template>
                      </v-text-field>
                    </div>

                    <div v-if="telecom" key="telecom" class="mb-5">
                      <v-text-field
                        v-model="telecomId"
                        label="ເບີໂທລະສັບ"
                        prepend-inner-icon="mdi-phone"
                        variant="outlined"
                        color="primary"
                        :rules="telecom ? [rules.required, rules.phoneNumber] : []"
                        placeholder="ປ້ອນເບີໂທລະສັບ"
                        counter="11"
                        maxlength="11"
                        class="input-field"
                        hint="ປ້ອນເບີໂທລະສັບ 8-11 ຫຼັກ"
                        persistent-hint
                      >
                        <template v-slot:append-inner>
                          <v-icon v-if="telecomId && rules.phoneNumber(telecomId) === true" color="success">
                            mdi-check-circle
                          </v-icon>
                        </template>
                      </v-text-field>
                    </div>
                  </v-slide-y-transition>

                  <v-alert
                    v-if="!hasSelectedService"
                    type="info"
                    variant="tonal"
                    prominent
                    class="mb-4 info-alert"
                  >
                    <v-icon class="mr-2">mdi-information</v-icon>
                    <strong>ກະລຸນາເລືອກບໍລິການຢ່າງນ້ອຍ 1 ປະເພດ</strong>
                    <div class="text-caption mt-1">ເລືອກບໍລິການທີ່ທ່ານຕ້ອງການຄົ້ນຫາຂ້າງເທິງ</div>
                  </v-alert>
                </div>

                <!-- Action Button -->
                <div class="action-section mt-8">
                  <v-btn
                    type="submit"
                    color="primary"
                    size="x-large"
                    block
                    :disabled="!canSearch"
                    :loading="isLoading"
                    class="search-button"
                    elevation="4"
                  >
                    <v-icon left class="mr-2" size="24">mdi-magnify</v-icon>
                    <span class="button-text">ຄົ້ນຫາຂໍ້ມູນ</span>
                  </v-btn>
                  
                  <div class="text-center mt-4 helper-text">
                    <v-icon size="16" class="mr-1">mdi-shield-check</v-icon>
                    ຂໍ້ມູນຂອງທ່ານຈະຖືກປົກປ້ອງດ້ວຍຄວາມປອດໄພສູງສຸດ
                  </div>
                </div>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

const router = useRouter()
const title = 'ລາຍການຄົ້ນຫາ'

// Form reference
const formRef = ref()
const isFormValid = ref(false)
const isLoading = ref(false)

// Service selections
const electronic = ref(false)
const water = ref(false)
const telecom = ref(false)

// Input values
const electronicId = ref('')
const waterId = ref('')
const telecomId = ref('')

// Check authentication
const checkAuth = () => {
  const token = localStorage.getItem('access_token')
  if (!token) {
    Swal.fire({
      icon: 'warning',
      title: 'ກະລຸນາເຂົ້າສູ່ລະບົບ',
      text: 'ທ່ານຕ້ອງເຂົ້າສູ່ລະບົບກ່ອນເພື່ອດຳເນີນການຕໍ່',
      confirmButtonText: 'ເຂົ້າສູ່ລະບົບ',
      confirmButtonColor: '#1e40af',
      allowOutsideClick: false
    }).then((result) => {
      if (result.isConfirmed) {
        router.push('/auth/login')
      }
    })
    return false
  }
  return true
}

// Validation rules
const rules = {
  required: (value: string) => !!value || 'ກະລຸນາປ້ອນຂໍ້ມູນ',
  numbersOnly: (value: string) => /^\d+$/.test(value) || 'ກະລຸນາປ້ອນຕົວເລກເທົ່ານັ້ນ',
  phoneNumber: (value: string) => {
    if (!value) return 'ກະລຸນາປ້ອນເບີໂທລະສັບ'
    if (!/^\d+$/.test(value)) return 'ກະລຸນາປ້ອນຕົວເລກເທົ່ານັ້ນ'
    if (value.length < 8 || value.length > 11) return 'ເບີໂທລະສັບຕ້ອງມີ 8-11 ຫຼັກ'
    return true
  }
}

// Computed properties
const hasSelectedService = computed(() => electronic.value || water.value || telecom.value)

const canSearch = computed(() => {
  if (!hasSelectedService.value) return false
  
  if (electronic.value && !electronicId.value) return false
  if (water.value && !waterId.value) return false
  if (telecom.value && !telecomId.value) return false
  
  return isFormValid.value
})

// Methods
const toggleService = (service: string) => {
  if (service === 'electronic') electronic.value = !electronic.value
  if (service === 'water') water.value = !water.value
  if (service === 'telecom') telecom.value = !telecom.value
}

const fetchWaterReport = async (customerId: string) => {
  try {
    const config = useRuntimeConfig();
    const token = localStorage.getItem("access_token");
    const response = await axios.get(
      `${config.public.strapi.url}api/utility-report/`,
      { 
        params: { water: customerId },
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    );
    
    if (!response.data || Object.keys(response.data).length === 0) {
      return {
        success: false,
        error: 'ບໍ່ພົບຂໍ້ມູນສຳລັບລະຫັດນໍ້າປະປານີ້',
        type: 'water'
      }
    }
    
    return {
      success: true,
      data: response.data,
      type: 'water'
    }
  } catch (error) {
    console.error('Water API Error:', error)
    return {
      success: false,
      error: error.response?.status === 404 
        ? 'ບໍ່ພົບຂໍ້ມູນສຳລັບລະຫັດນໍ້າປະປານີ້'
        : error.response?.data?.error || 'ເກີດຂໍ້ຜິດພາດໃນການເຊື່ອມຕໍ່ລະບົບນໍ້າປະປາ',
      type: 'water'
    }
  }
}

const fetchElectricReport = async (customerId: string) => {
  try {
    const config = useRuntimeConfig();
    const token = localStorage.getItem("access_token");
    const response = await axios.get(
      `${config.public.strapi.url}api/edl-report/`,
      { 
        params: { edl: customerId },
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    );
    
    if (!response.data || Object.keys(response.data).length === 0) {
      return {
        success: false,
        error: 'ບໍ່ພົບຂໍ້ມູນສຳລັບລະຫັດໄຟຟ້ານີ້',
        type: 'electric'
      }
    }
    
    return {
      success: true,
      data: response.data,
      type: 'electric'
    }
  } catch (error) {
    console.error('Electric API Error:', error)
    return {
      success: false,
      error: error.response?.status === 404 
        ? 'ບໍ່ພົບຂໍ້ມູນສຳລັບລະຫັດໄຟຟ້ານີ້'
        : error.response?.data?.error || 'ເກີດຂໍ້ຜິດພາດໃນການເຊື່ອມຕໍ່ລະບົບໄຟຟ້າ',
      type: 'electric'
    }
  }
}

const fetchTelecomReport = async (customerId: string) => {
  try {
    console.log('Telecom API not implemented yet')
    return {
      success: false,
      error: 'ລະບົບໂທລະຄົມຍັງບໍ່ສາມາດໃຊ້ໄດ້',
      type: 'telecom'
    }
  } catch (error) {
    return {
      success: false,
      error: 'ເກີດຂໍ້ຜິດພາດໃນການເຊື່ອມຕໍ່ລະບົບໂທລະຄົມ',
      type: 'telecom'
    }
  }
}

// Confirmation dialog with checkbox
const showConfirmationDialog = async () => {
  const result = await Swal.fire({
    title: '<strong>ຢືນຢັນການເຂົ້າເບິ່ງຂໍ້ມູນ</strong>',
    icon: 'warning',
    html: `
      <div style="text-align: left; padding: 20px 10px;">
        <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
          <p style="margin: 0; color: #856404; font-size: 14px;">
            <i class="mdi mdi-alert" style="font-size: 18px; vertical-align: middle;"></i>
            <strong>ກະລຸນາອ່ານຢ່າງລະອຽດ</strong>
          </p>
        </div>
        
        <div style="margin-bottom: 20px;">
          <label style="display: flex; align-items: start; cursor: pointer; padding: 15px; border: 2px solid #e5e7eb; border-radius: 8px; background: #f9fafb; transition: all 0.3s;" id="confirmLabel">
            <input 
              type="checkbox" 
              id="confirmCheckbox" 
              style="margin-right: 12px; margin-top: 3px; width: 18px; height: 18px; cursor: pointer;"
            />
            <span style="font-size: 15px; line-height: 1.6; color: #1f2937;">
              <strong style="color: #1e40af;">ຂ້າພະເຈົ້າຂໍຢືນຢັນວ່າ:</strong><br/>
              ໄດ້ຮັບການອະນຸຍາດຈາກລູກຄ້າໃນການສອບຖາມຂໍ້ມູນ
            </span>
          </label>
        </div>
        
        <div style="background: #f3f4f6; padding: 12px; border-radius: 6px; font-size: 13px; color: #6b7280;">
          <i class="mdi mdi-information" style="font-size: 16px; vertical-align: middle; color: #1e40af;"></i>
          ການເຂົ້າເບິ່ງຂໍ້ມູນລູກຄ້າຕ້ອງໄດ້ຮັບອະນຸຍາດເທົ່ານັ້ນ
        </div>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: '<i class="mdi mdi-check"></i> ຢືນຢັນ ແລະ ດຳເນີນການຕໍ່',
    cancelButtonText: '<i class="mdi mdi-close"></i> ຍົກເລີກ',
    confirmButtonColor: '#1e40af',
    cancelButtonColor: '#6b7280',
    allowOutsideClick: false,
    allowEscapeKey: false,
    customClass: {
      popup: 'swal-wide',
      confirmButton: 'swal-confirm-btn',
      cancelButton: 'swal-cancel-btn'
    },
    didOpen: () => {
      const checkbox = document.getElementById('confirmCheckbox') as HTMLInputElement
      const confirmButton = Swal.getConfirmButton()
      const label = document.getElementById('confirmLabel')
      
      if (confirmButton) {
        confirmButton.disabled = true
        confirmButton.style.opacity = '0.5'
        confirmButton.style.cursor = 'not-allowed'
      }
      
      if (checkbox && label) {
        checkbox.addEventListener('change', () => {
          if (confirmButton) {
            confirmButton.disabled = !checkbox.checked
            confirmButton.style.opacity = checkbox.checked ? '1' : '0.5'
            confirmButton.style.cursor = checkbox.checked ? 'pointer' : 'not-allowed'
          }
          
          if (checkbox.checked) {
            label.style.borderColor = '#1e40af'
            label.style.background = '#eff6ff'
          } else {
            label.style.borderColor = '#e5e7eb'
            label.style.background = '#f9fafb'
          }
        })
      }
    },
    preConfirm: () => {
      const checkbox = document.getElementById('confirmCheckbox') as HTMLInputElement
      if (!checkbox?.checked) {
        Swal.showValidationMessage('ກະລຸນາຢືນຢັນການອະນຸຍາດກ່ອນ')
        return false
      }
      return true
    }
  })
  
  return result.isConfirmed
}

const handleSearch = async () => {
  if (!formRef.value?.validate()) return
  
  if (!checkAuth()) return
  
  isLoading.value = true
  
  try {
    const searchPromises = []
    const searchResults = {
      water: null,
      electric: null,
      telecom: null,
      hasErrors: false,
      errors: []
    }
    
    if (water.value && waterId.value) {
      searchPromises.push(fetchWaterReport(waterId.value))
    }
    
    if (electronic.value && electronicId.value) {
      searchPromises.push(fetchElectricReport(electronicId.value))
    }
    
    if (telecom.value && telecomId.value) {
      searchPromises.push(fetchTelecomReport(telecomId.value))
    }
    
    const results = await Promise.all(searchPromises)
    
    results.forEach(result => {
      if (result.success) {
        searchResults[result.type] = result.data
      } else {
        searchResults.hasErrors = true
        searchResults.errors.push({
          type: result.type,
          message: result.error
        })
      }
    })
    
    const hasSuccessfulResults = searchResults.water || searchResults.electric || searchResults.telecom
    
    if (hasSuccessfulResults) {
      // Show confirmation dialog before navigating
      const confirmed = await showConfirmationDialog()
      
      if (confirmed) {
        sessionStorage.setItem('utilitySearchResults', JSON.stringify(searchResults))
        sessionStorage.setItem('searchCriteria', JSON.stringify({
          water: water.value ? waterId.value : null,
          electric: electronic.value ? electronicId.value : null,
          telecom: telecom.value ? telecomId.value : null
        }))
        
        await Swal.fire({
          icon: 'success',
          title: 'ສຳເລັດ!',
          text: 'ກຳລັງນຳທ່ານໄປຫາໜ້າລາຍງານ...',
          timer: 1500,
          showConfirmButton: false,
          timerProgressBar: true
        })
        
        await router.push('reportutility/report_utilities')
      }
    } else {
      await Swal.fire({
        icon: 'info',
        title: 'ບໍ່ພົບຂໍ້ມູນ',
        html: `
          <div style="text-align: left; padding: 10px;">
            ${searchResults.errors.map(e => `
              <div style="padding: 8px; margin: 5px 0; background: #fef2f2; border-left: 3px solid #ef4444; border-radius: 4px;">
                <strong>${e.type === 'water' ? 'ນໍ້າປະປາ' : e.type === 'electric' ? 'ໄຟຟ້າ' : 'ໂທລະຄົມ'}:</strong> ${e.message}
              </div>
            `).join('')}
          </div>
        `,
        confirmButtonText: 'ຕົກລົງ',
        confirmButtonColor: '#1e40af'
      })
    }
    
  } catch (error) {
    console.error('Search error:', error)
    await Swal.fire({
      icon: 'error',
      title: 'ເກີດຂໍ້ຜິດພາດ',
      text: error.response?.data?.message || 'ເກີດຂໍ້ຜິດພາດທີ່ບໍ່ຄາດຄິດ ກະລຸນາລອງໃໝ່ອີກຄັ້ງ',
      confirmButtonText: 'ຕົກລົງ',
      confirmButtonColor: '#1e40af'
    })
  } finally {
    isLoading.value = false
  }
}

const clearInputs = () => {
  if (!electronic.value) electronicId.value = ''
  if (!water.value) waterId.value = ''
  if (!telecom.value) telecomId.value = ''
}

watch([electronic, water, telecom], clearInputs)
</script>

<style scoped>
.search-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #dbeafe 100%);
  padding: 2.5rem 1rem;
}

.search-card {
  border-radius: 16px !important;
  background: #ffffff;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.header-section {
  background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
  color: white;
  padding: 2.5rem 1.5rem;
  position: relative;
  overflow: hidden;
}

.header-section::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  animation: pulse 15s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.1); opacity: 0.3; }
}

.icon-wrapper {
  display: inline-block;
  margin-bottom: 1rem;
}

.header-icon {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  padding: 1rem;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.header-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.header-subtitle {
  font-size: 1.05rem;
  opacity: 0.95;
  margin-bottom: 0;
  font-weight: 400;
}

.divider-primary {
  height: 3px;
  background: linear-gradient(90deg, #1e40af 0%, #3b82f6 50%, #1e40af 100%);
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}

.selection-title {
  color: #1e40af;
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
}

.service-card {
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2.5px solid #e5e7eb;
  border-radius: 12px !important;
  position: relative;
  background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%);
  height: 100%;
}

.service-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(30, 64, 175, 0.15);
  border-color: #93c5fd;
}

.service-card.selected {
  border-color: #1e40af;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  box-shadow: 0 8px 16px rgba(30, 64, 175, 0.2);
}

.service-card.pulse.selected {
  animation: cardPulse 2s ease-in-out infinite;
}

@keyframes cardPulse {
  0%, 100% { box-shadow: 0 8px 16px rgba(30, 64, 175, 0.2); }
  50% { box-shadow: 0 12px 24px rgba(30, 64, 175, 0.35); }
}

.icon-container {
  background: rgba(30, 64, 175, 0.05);
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  transition: all 0.3s ease;
}

.service-card.selected .icon-container {
  background: rgba(30, 64, 175, 0.1);
  transform: scale(1.1);
}

.service-label {
  font-size: 1.1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.25rem;
  transition: color 0.3s ease;
}

.service-label.label-active {
  color: #1e40af;
}

.service-sublabel {
  font-size: 0.85rem;
  color: #6b7280;
  font-weight: 400;
}

.checkbox-container {
  position: absolute;
  top: 12px;
  right: 12px;
}

.input-field :deep(.v-field) {
  border-radius: 10px;
  background: #ffffff;
  border: 2px solid #e5e7eb;
  transition: all 0.3s ease;
}

.input-field :deep(.v-field:hover) {
  border-color: #bfdbfe;
}

.input-field :deep(.v-field--focused) {
  border-color: #1e40af;
  box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.1);
}

.info-alert {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%) !important;
  border: 2px solid #93c5fd !important;
  border-radius: 10px !important;
  color: #1e40af !important;
}

.search-button {
  border-radius: 12px !important;
  padding: 1.5rem 2rem !important;
  font-size: 1.15rem !important;
  font-weight: 700 !important;
  text-transform: none !important;
  background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%) !important;
  box-shadow: 0 4px 14px rgba(30, 64, 175, 0.4) !important;
  transition: all 0.3s ease !important;
  letter-spacing: 0.3px;
}

.search-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%) !important;
  box-shadow: 0 6px 20px rgba(30, 64, 175, 0.5) !important;
  transform: translateY(-2px);
}

.search-button:active:not(:disabled) {
  transform: translateY(0);
}

.button-text {
  font-size: 1.15rem;
  font-weight: 700;
}

.helper-text {
  color: #6b7280;
  font-size: 0.9rem;
  font-weight: 500;
}

/* SweetAlert2 Custom Styles */
:global(.swal-wide) {
  width: 600px !important;
  max-width: 90% !important;
  border-radius: 16px !important;
}

:global(.swal-confirm-btn) {
  border-radius: 8px !important;
  padding: 12px 32px !important;
  font-weight: 600 !important;
  font-size: 15px !important;
}

:global(.swal-cancel-btn) {
  border-radius: 8px !important;
  padding: 12px 32px !important;
  font-weight: 600 !important;
  font-size: 15px !important;
}

/* Responsive */
@media (max-width: 600px) {
  .search-container {
    padding: 1.5rem 0.5rem;
  }
  
  .header-section {
    padding: 2rem 1rem;
  }
  
  .header-title {
    font-size: 1.6rem;
  }
  
  .header-subtitle {
    font-size: 0.95rem;
  }
  
  .service-card {
    margin-bottom: 1rem;
  }
  
  .icon-container {
    width: 70px;
    height: 70px;
  }
  
  .search-card {
    border-radius: 12px !important;
  }
  
  :global(.swal-wide) {
    width: 95% !important;
  }
}

/* Animations */
.v-slide-y-transition-enter-active,
.v-slide-y-transition-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.v-slide-y-transition-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.v-slide-y-transition-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>