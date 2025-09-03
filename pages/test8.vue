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

          <!-- Results Section (placeholder) -->
          <v-card v-if="searchResults.length > 0" class="mt-6" elevation="4">
            <v-card-title>
              <v-icon class="mr-2">mdi-format-list-bulleted</v-icon>
              ຜົນການຄົ້ນຫາ
            </v-card-title>
            <v-card-text>
              <v-list>
                <v-list-item
                  v-for="(result, index) in searchResults"
                  :key="index"
                  class="result-item"
                >
                  <template v-slot:prepend>
                    <v-icon :color="result.type === 'electronic' ? 'amber' : result.type === 'water' ? 'blue' : 'green'">
                      {{ result.type === 'electronic' ? 'mdi-flash' : result.type === 'water' ? 'mdi-water' : 'mdi-phone' }}
                    </v-icon>
                  </template>
                  
                  <v-list-item-title>{{ result.customerName }}</v-list-item-title>
                  <v-list-item-subtitle>{{ result.customerId }} - {{ result.serviceType }}</v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

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

// Results
const searchResults = ref([])

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

const handleSearch = async () => {
  if (!formRef.value?.validate()) return
  
  isLoading.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Mock results - replace with actual API call
    const mockResults = []
    
    if (electronic.value) {
      mockResults.push({
        type: 'electronic',
        customerId: electronicId.value,
        customerName: 'ທ້າວ ວັນນະ ວົງສະວັດ',
        serviceType: 'ໄຟຟ້າ'
      })
    }
    
    if (water.value) {
      mockResults.push({
        type: 'water',
        customerId: waterId.value,
        customerName: 'ນາງ ສີລີ ພົງສະວັດ',
        serviceType: 'ນໍ້າປະປາ'
      })
    }
    
    if (telecom.value) {
      mockResults.push({
        type: 'telecom',
        customerId: telecomId.value,
        customerName: 'ທ້າວ ບູນມີ ສິນໄຊ',
        serviceType: 'ໂທລະຄົມ'
      })
    }
    
    searchResults.value = mockResults
    
  } catch (error) {
    console.error('Search error:', error)
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 0;
}

.search-card {
  border-radius: 16px !important;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
}

.header-section {
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
  color: white;
  padding: 2rem 1.5rem;
  border-radius: 16px 16px 0 0 !important;
}

.header-icon {
  background: rgba(255, 255, 255, 0.2);
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
  color: #1976d2;
  font-size: 1.2rem;
  font-weight: 600;
}

.service-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  border-radius: 12px !important;
  position: relative;
  background: rgba(248, 249, 250, 0.8);
}

.service-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1) !important;
}

.service-card.selected {
  border-color: #1976d2;
  background: rgba(25, 118, 210, 0.05);
}

.service-label {
  font-size: 1rem;
  font-weight: 500;
  color: #333;
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
  border-radius: 12px;
}

.search-button {
  border-radius: 12px !important;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  text-transform: none;
  box-shadow: 0 4px 15px rgba(25, 118, 210, 0.3);
}

.search-button:hover {
  box-shadow: 0 6px 20px rgba(25, 118, 210, 0.4);
}

.result-item {
  border-radius: 8px;
  margin-bottom: 0.5rem;
  background: rgba(248, 249, 250, 0.5);
}

.result-item:hover {
  background: rgba(25, 118, 210, 0.05);
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

.v-slide-y-transition-enter-from {
  opacity: 0;
  transform: translateY(-15px);
}

.v-slide-y-transition-leave-to {
  opacity: 0;
  transform: translateY(-15px);
}
</style>