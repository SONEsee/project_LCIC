
<template>
  <div class="search-container">
    <v-container class="fill-height">
      <v-row justify="center" align="center">
        <v-col cols="12" sm="8" md="6" lg="5">
          <v-card class="search-card" elevation="8">
            <!-- Header -->
            <v-card-title class="header-section">
              <div class="text-center w-100">
                <v-icon class="header-icon" size="40">mdi-magnify</v-icon>
                <h2 class="header-title">{{ title }}</h2>
                <p class="header-subtitle">ເລືອກບໍລິການທີ່ຕ້ອງການຄົ້ນຫາ</p>
              </div>
            </v-card-title>

            <v-divider></v-divider>

            <!-- Form Content -->
            <v-card-text class="pa-6">
              <v-form ref="formRef" v-model="isFormValid" @submit.prevent="handleSearch">
                
                <!-- Service Selection -->
                <div class="service-selection mb-6">
                  <h3 class="selection-title mb-4">ເລືອກປະເພດບໍລິການ</h3>
                  
                  <v-row>
                    <v-col cols="12" sm="4">
                      <v-card 
                        :class="['service-card', { 'selected': electronic }]"
                        @click="toggleService('electronic')"
                        hover
                      >
                        <v-card-text class="text-center pa-4">
                          <v-icon 
                            :color="electronic ? 'primary' : 'grey'" 
                            size="32"
                            class="mb-2"
                          >
                            mdi-flash
                          </v-icon>
                          <div class="service-label">ໄຟຟ້າ</div>
                          <v-checkbox-btn 
                            v-model="electronic" 
                            class="service-checkbox"
                            hide-details
                          ></v-checkbox-btn>
                        </v-card-text>
                      </v-card>
                    </v-col>

                    <v-col cols="12" sm="4">
                      <v-card 
                        :class="['service-card', { 'selected': water }]"
                        @click="toggleService('water')"
                        hover
                      >
                        <v-card-text class="text-center pa-4">
                          <v-icon 
                            :color="water ? 'primary' : 'grey'" 
                            size="32"
                            class="mb-2"
                          >
                            mdi-water
                          </v-icon>
                          <div class="service-label">ນໍ້າປະປາ</div>
                          <v-checkbox-btn 
                            v-model="water" 
                            class="service-checkbox"
                            hide-details
                          ></v-checkbox-btn>
                        </v-card-text>
                      </v-card>
                    </v-col>

                    <v-col cols="12" sm="4">
                      <v-card 
                        :class="['service-card', { 'selected': telecom }]"
                        @click="toggleService('telecom')"
                        hover
                      >
                        <v-card-text class="text-center pa-4">
                          <v-icon 
                            :color="telecom ? 'primary' : 'grey'" 
                            size="32"
                            class="mb-2"
                          >
                            mdi-phone
                          </v-icon>
                          <div class="service-label">ໂທລະຄົມ</div>
                          <v-checkbox-btn 
                            v-model="telecom" 
                            class="service-checkbox"
                            hide-details
                          ></v-checkbox-btn>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                </div>

                <v-divider class="my-6"></v-divider>

                <!-- Input Fields -->
                <div class="input-section">
                  <h3 class="selection-title mb-4">ປ້ອນຂໍ້ມູນ</h3>
                  
                  <v-slide-y-transition group>
                    <div v-if="electronic" key="electronic" class="mb-4">
                      <v-text-field
                        v-model="electronicId"
                        label="ລະຫັດເລກກົງເຕີໄຟຟ້າ"
                        prepend-inner-icon="mdi-flash"
                        variant="outlined"
                        :rules="electronic ? [rules.required, rules.numbersOnly] : []"
                        placeholder="ປ້ອນລະຫັດເລກກົງເຕີໄຟຟ້າ"
                        counter="10"
                        maxlength="10"
                        class="input-field"
                      ></v-text-field>
                    </div>

                    <div v-if="water" key="water" class="mb-4">
                      <v-text-field
                        v-model="waterId"
                        label="ລະຫັດເລກກົງເຕີນໍ້າ"
                        prepend-inner-icon="mdi-water"
                        variant="outlined"
                        :rules="water ? [rules.required, rules.numbersOnly] : []"
                        placeholder="ປ້ອນລະຫັດເລກກົງເຕີນໍ້າ"
                        counter="10"
                        maxlength="10"
                        class="input-field"
                      ></v-text-field>
                    </div>

                    <div v-if="telecom" key="telecom" class="mb-4">
                      <v-text-field
                        v-model="telecomId"
                        label="ເບີໂທລະສັບ"
                        prepend-inner-icon="mdi-phone"
                        variant="outlined"
                        :rules="telecom ? [rules.required, rules.phoneNumber] : []"
                        placeholder="ປ້ອນເບີໂທລະສັບ"
                        counter="11"
                        maxlength="11"
                        class="input-field"
                      ></v-text-field>
                    </div>
                  </v-slide-y-transition>

                  <v-alert
                    v-if="!hasSelectedService"
                    type="info"
                    variant="tonal"
                    class="mb-4"
                  >
                    ກະລຸນາເລືອກບໍລິການຢ່າງນ້ອຍ 1 ປະເພດ
                  </v-alert>
                </div>

                <!-- Action Button -->
                <div class="action-section mt-6">
                  <v-btn
                    type="submit"
                    color="primary"
                    size="large"
                    block
                    :disabled="!canSearch"
                    :loading="isLoading"
                    class="search-button"
                  >
                    <v-icon left class="mr-2">mdi-magnify</v-icon>
                    ຄົ້ນຫາ
                  </v-btn>
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
import { ref, computed } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

// Router for navigation
const router = useRouter()

// Page title
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

// Check authentication before making API calls
const checkAuth = () => {
  const token = localStorage.getItem('access_token')
  if (!token) {
    Swal.fire({
      icon: 'warning',
      title: 'ກະລຸນາເຂົ້າສູ່ລະບົບ',
      text: 'ທ່ານຕ້ອງເຂົ້າສູ່ລະບົບກ່ອນເພື່ອດຳເນີນການຕໍ່',
      confirmButtonText: 'ເຂົ້າສູ່ລະຬົບ',
      confirmButtonColor: '#1e40af'
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
        : error.response?.data?.error || 'ເກີດຂໍ້ຜິດພາດໃນການເຊື່ອມຕໍ່ລະຬົບໄຟຟ້າ',
      type: 'electric'
    }
  }
}

const fetchTelecomReport = async (customerId: string) => {
  try {
    // TODO: Replace with actual telecom API endpoint
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

const handleSearch = async () => {
  if (!formRef.value?.validate()) return
  
  // Check authentication first
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
    
    // Make API calls for selected services
    if (water.value && waterId.value) {
      searchPromises.push(fetchWaterReport(waterId.value))
    }
    
    if (electronic.value && electronicId.value) {
      searchPromises.push(fetchElectricReport(electronicId.value))
    }
    
    if (telecom.value && telecomId.value) {
      searchPromises.push(fetchTelecomReport(telecomId.value))
    }
    
    // Wait for all API calls to complete
    const results = await Promise.all(searchPromises)
    
    // Process results
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
    
    // Check if we have at least one successful result
    const hasSuccessfulResults = searchResults.water || searchResults.electric || searchResults.telecom
    
    if (hasSuccessfulResults) {
      // Store results in sessionStorage for the report page
      sessionStorage.setItem('utilitySearchResults', JSON.stringify(searchResults))
      sessionStorage.setItem('searchCriteria', JSON.stringify({
        water: water.value ? waterId.value : null,
        electric: electronic.value ? electronicId.value : null,
        telecom: telecom.value ? telecomId.value : null
      }))
      
      // Navigate to report page
      await router.push('reportutility/report_utilities')
    } else {
      // Show SweetAlert2 popup for no data found
      await Swal.fire({
        icon: 'info',
        title: 'ບໍ່ພົບຂໍ້ມູນ',
        html: searchResults.errors.map(e => e.message).join('<br>'),
        confirmButtonText: 'ຕົກລົງ',
        confirmButtonColor: '#1e40af'
      })
    }
    
  } catch (error) {
    console.error('Search error:', error)
    // Show SweetAlert2 popup for unexpected errors
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

// Clear form when service is unchecked
const clearInputs = () => {
  if (!electronic.value) electronicId.value = ''
  if (!water.value) waterId.value = ''
  if (!telecom.value) telecomId.value = ''
}

// Watch for service changes to clear inputs
import { watch } from 'vue'
watch([electronic, water, telecom], clearInputs)
</script>

<style scoped>
.search-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 2rem 0;
}

.search-card {
  border-radius: 12px !important;
  background: #ffffff;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.header-section {
  background: #1e40af;
  color: white;
  padding: 2rem 1.5rem;
  border-radius: 12px 12px 0 0 !important;
}

.header-icon {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  padding: 0.5rem;
  margin-bottom: 1rem;
}

.header-title {
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.header-subtitle {
  font-size: 1rem;
  opacity: 0.9;
  margin-bottom: 0;
}

.selection-title {
  color: #1e40af;
  font-size: 1.2rem;
  font-weight: 600;
}

.service-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid #e5e7eb;
  border-radius: 8px !important;
  position: relative;
  background: #f9fafb;
}

.service-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #9ca3af;
}

.service-card.selected {
  border-color: #1e40af;
  background: #eff6ff;
}

.service-label {
  font-size: 1rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.service-checkbox {
  position: absolute;
  top: 8px;
  right: 8px;
}

.input-field {
  margin-bottom: 1rem;
}

.input-field :deep(.v-field) {
  border-radius: 8px;
  background: #ffffff;
}

.input-field :deep(.v-field--focused) {
  box-shadow: 0 0 0 2px rgba(30, 64, 175, 0.2);
}

.search-button {
  border-radius: 8px !important;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  text-transform: none;
  background: #1e40af !important;
  box-shadow: 0 2px 8px rgba(30, 64, 175, 0.3);
}

.search-button:hover {
  background: #1d4ed8 !important;
  box-shadow: 0 4px 12px rgba(30, 64, 175, 0.4);
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .search-container {
    padding: 1rem 0;
  }
  
  .header-section {
    padding: 1.5rem 1rem;
  }
  
  .header-title {
    font-size: 1.5rem;
  }
  
  .service-card {
    margin-bottom: 1rem;
  }
}

/* Animation for smooth transitions */
.v-slide-y-transition-enter-active,
.v-slide-y-transition-leave-active {
  transition: all 0.3s ease;
}

.v-slide-y-transition-ear-from {
  opacity: 0;
  transform: translateY(-15px);
}

.v-slide-y-transition-leave-to {
  opacity: 0;
  transform: translateY(-15px);
}

/* Additional styling for alerts */
.v-alert.v-alert--variant-tonal {
  background: #eff6ff !important;
  border: 1px solid #bfdbfe !important;
  color: #1e40af !important;
}
</style>