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
                <p class="header-subtitle">ຄົ້ນຫາຂໍ້ມູນລູກຄ້າດ້ວຍລະບົບອັດສະລິຍະ</p>
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
                    <!-- Electric Service Fields -->
                    <div v-if="electronic" key="electronic" class="mb-6 service-input-group">
                      <div class="input-group-header mb-3">
                        <v-icon color="primary" size="20">mdi-flash</v-icon>
                        <span class="input-group-title">ຂໍ້ມູນໄຟຟ້າ</span>
                      </div>
                      
                      <!-- Info Alert for Search Methods -->
                      <v-alert
                        type="info"
                        variant="tonal"
                        density="compact"
                        class="mb-4"
                      >
                        <div class="text-caption">
                          <v-icon size="18" class="mr-1">mdi-information</v-icon>
                          <strong>ວິທີການຄົ້ນຫາ:</strong>
                          <div class="mt-1">
                            • ຄົ້ນຫາດ່ວນ: ບໍ່ຕ້ອງເລືອກແຂວງ (ຄົ້ນຫາທົ່ວລະບົບ)
                          </div>
                          <div>
                            • ຄົ້ນຫາດ້ວຍລະຫັດ: ຕ້ອງເລືອກແຂວງກ່ອນ
                          </div>
                        </div>
                      </v-alert>

                      <!-- Quick Search - No Province Required -->
                      <v-autocomplete
                        v-model="selectedElectricCustomer"
                        v-model:search="electricSearchQuery"
                        :items="electricSearchResults"
                        :loading="electricSearchLoading"
                        item-title="display"
                        item-value="Customer_ID"
                        label="ຄົ້ນຫາລູກຄ້າດ່ວນ (ຊື່, ລະຫັດ, ບໍລິສັດ)"
                        variant="outlined"
                        color="primary"
                        clearable
                        no-filter
                        class="input-field mb-4"
                        hint="ຄົ້ນຫາທົ່ວລະບົບ - ບໍ່ຕ້ອງເລືອກແຂວງ"
                        persistent-hint
                        @update:search="debouncedElectricSearch"
                      >
                        <template v-slot:prepend-inner>
                          <v-icon color="primary">mdi-account-search</v-icon>
                        </template>
                        <template v-slot:no-data>
                          <v-list-item>
                            <v-list-item-title class="text-caption">
                              {{ electricSearchQuery ? 'ບໍ່ພົບຂໍ້ມູນ' : 'ພິມເພື່ອຄົ້ນຫາ...' }}
                            </v-list-item-title>
                          </v-list-item>
                        </template>
                        <template v-slot:item="{ props, item }">
                          <v-list-item v-bind="props">
                            <template v-slot:prepend>
                              <v-icon color="primary">mdi-account</v-icon>
                            </template>
                            <template v-slot:subtitle>
                              <div class="text-caption">
                                <span class="text-grey">ລະຫັດ:</span> {{ item.raw.Customer_ID }}
                                <span class="ml-2 text-grey">ແຂວງ:</span> {{ item.raw.province_name }}
                              </div>
                            </template>
                          </v-list-item>
                        </template>
                      </v-autocomplete>

                      <div class="text-center my-3 text-caption text-grey">
                        <v-divider></v-divider>
                        <span class="px-3 bg-white" style="position: relative; top: -12px;">ຫຼື</span>
                      </div>

                      <!-- Province Selection - Required for Manual Entry -->
                      <v-autocomplete
                        v-model="electricProvince"
                        :items="provinces"
                        item-title="name"
                        item-value="id"
                        label="ເລືອກແຂວງ *"
                        variant="outlined"
                        color="primary"
                        clearable
                        :disabled="!!selectedElectricCustomer"
                        class="input-field mb-4"
                        :hint="selectedElectricCustomer ? 'ຍົກເລີກການຄົ້ນຫາດ່ວນເພື່ອປ່ຽນແຂວງ' : 'ເລືອກແຂວງເພື່ອຄົ້ນຫາດ້ວຍລະຫັດ'"
                        persistent-hint
                        :rules="electronic && !selectedElectricCustomer ? [rules.required] : []"
                      >
                        <template v-slot:prepend-inner>
                          <v-icon :color="electricProvince ? 'primary' : 'grey'">
                            mdi-map-marker
                          </v-icon>
                        </template>
                      </v-autocomplete>

                      <!-- Meter ID Input - Requires Province -->
                      <v-text-field
                        v-model="electronicId"
                        label="ລະຫັດເລກກົງເຕີໄຟຟ້າ *"
                        variant="outlined"
                        color="primary"
                        :disabled="!electricProvince && !selectedElectricCustomer"
                        :rules="electronic && !selectedElectricCustomer ? [rules.required, rules.numbersOnly, rules.meterLength] : []"
                        placeholder="ປ້ອນລະຫັດເລກກົງເຕີໄຟຟ້າ"
                        counter="10"
                        maxlength="10"
                        class="input-field"
                        :hint="!electricProvince && !selectedElectricCustomer ? 'ເລືອກແຂວງກ່ອນ ຫຼື ໃຊ້ການຄົ້ນຫາດ່ວນ' : 'ປ້ອນຕົວເລກ 10 ຫຼັກ'"
                        persistent-hint
                        @input="handleElectricIdInput"
                      >
                        <template v-slot:prepend-inner>
                          <v-icon :color="electronicId && (electricProvince || selectedElectricCustomer) ? 'primary' : 'grey'">
                            mdi-flash
                          </v-icon>
                        </template>
                        <template v-slot:append-inner>
                          <v-icon v-if="electronicId && rules.meterLength(electronicId) === true" color="success">
                            mdi-check-circle
                          </v-icon>
                        </template>
                      </v-text-field>
                    </div>

                    <!-- Water Service Fields -->
                    <div v-if="water" key="water" class="mb-6 service-input-group">
                      <div class="input-group-header mb-3">
                        <v-icon color="primary" size="20">mdi-water</v-icon>
                        <span class="input-group-title">ຂໍ້ມູນນໍ້າປະປາ</span>
                      </div>
                      
                      <!-- Info Alert for Search Methods -->
                      <v-alert
                        type="info"
                        variant="tonal"
                        density="compact"
                        class="mb-4"
                      >
                        <div class="text-caption">
                          <v-icon size="18" class="mr-1">mdi-information</v-icon>
                          <strong>ວິທີການຄົ້ນຫາ:</strong>
                          <div class="mt-1">
                            • ຄົ້ນຫາດ່ວນ: ບໍ່ຕ້ອງເລືອກແຂວງ (ຄົ້ນຫາທົ່ວລະບົບ)
                          </div>
                          <div>
                            • ຄົ້ນຫາດ້ວຍລະຫັດ: ຕ້ອງເລືອກແຂວງກ່ອນ
                          </div>
                        </div>
                      </v-alert>

                      <!-- Quick Search - No Province Required -->
                      <v-autocomplete
                        v-model="selectedWaterCustomer"
                        v-model:search="waterSearchQuery"
                        :items="waterSearchResults"
                        :loading="waterSearchLoading"
                        item-title="display"
                        item-value="Customer_ID"
                        label="ຄົ້ນຫາລູກຄ້າດ່ວນ (ຊື່, ລະຫັດ, ບໍລິສັດ)"
                        variant="outlined"
                        color="primary"
                        clearable
                        no-filter
                        class="input-field mb-4"
                        hint="ຄົ້ນຫາທົ່ວລະບົບ - ບໍ່ຕ້ອງເລືອກແຂວງ"
                        persistent-hint
                        @update:search="debouncedWaterSearch"
                      >
                        <template v-slot:prepend-inner>
                          <v-icon color="primary">mdi-account-search</v-icon>
                        </template>
                        <template v-slot:no-data>
                          <v-list-item>
                            <v-list-item-title class="text-caption">
                              {{ waterSearchQuery ? 'ບໍ່ພົບຂໍ້ມູນ' : 'ພິມເພື່ອຄົ້ນຫາ...' }}
                            </v-list-item-title>
                          </v-list-item>
                        </template>
                        <template v-slot:item="{ props, item }">
                          <v-list-item v-bind="props">
                            <template v-slot:prepend>
                              <v-icon color="primary">mdi-account</v-icon>
                            </template>
                            <template v-slot:subtitle>
                              <div class="text-caption">
                                <span class="text-grey">ລະຫັດ:</span> {{ item.raw.Customer_ID }}
                                <span class="ml-2 text-grey">ແຂວງ:</span> {{ item.raw.province_name }}
                              </div>
                            </template>
                          </v-list-item>
                        </template>
                      </v-autocomplete>

                      <div class="text-center my-3 text-caption text-grey">
                        <v-divider></v-divider>
                        <span class="px-3 bg-white" style="position: relative; top: -12px;">ຫຼື</span>
                      </div>

                      <!-- Province Selection - Required for Manual Entry -->
                      <v-autocomplete
                        v-model="waterProvince"
                        :items="provinces"
                        item-title="name"
                        item-value="id"
                        label="ເລືອກແຂວງ *"
                        variant="outlined"
                        color="primary"
                        clearable
                        :disabled="!!selectedWaterCustomer"
                        class="input-field mb-4"
                        :hint="selectedWaterCustomer ? 'ຍົກເລີກການຄົ້ນຫາດ່ວນເພື່ອປ່ຽນແຂວງ' : 'ເລືອກແຂວງເພື່ອຄົ້ນຫາດ້ວຍລະຫັດ'"
                        persistent-hint
                        :rules="water && !selectedWaterCustomer ? [rules.required] : []"
                      >
                        <template v-slot:prepend-inner>
                          <v-icon :color="waterProvince ? 'primary' : 'grey'">
                            mdi-map-marker
                          </v-icon>
                        </template>
                      </v-autocomplete>

                      <!-- Meter ID Input - Requires Province -->
                      <v-text-field
                        v-model="waterId"
                        label="ລະຫັດເລກກົງເຕີນໍ້າ *"
                        variant="outlined"
                        color="primary"
                        :disabled="!waterProvince && !selectedWaterCustomer"
                        :rules="water && !selectedWaterCustomer ? [rules.required, rules.numbersOnly, rules.meterLength] : []"
                        placeholder="ປ້ອນລະຫັດເລກກົງເຕີນໍ້າ"
                        counter="10"
                        maxlength="10"
                        class="input-field"
                        :hint="!waterProvince && !selectedWaterCustomer ? 'ເລືອກແຂວງກ່ອນ ຫຼື ໃຊ້ການຄົ້ນຫາດ່ວນ' : 'ປ້ອນຕົວເລກ 10 ຫຼັກ'"
                        persistent-hint
                        @input="handleWaterIdInput"
                      >
                        <template v-slot:prepend-inner>
                          <v-icon :color="waterId && (waterProvince || selectedWaterCustomer) ? 'primary' : 'grey'">
                            mdi-water
                          </v-icon>
                        </template>
                        <template v-slot:append-inner>
                          <v-icon v-if="waterId && rules.meterLength(waterId) === true" color="success">
                            mdi-check-circle
                          </v-icon>
                        </template>
                      </v-text-field>
                    </div>

                    <!-- Telecom Service Fields -->
                    <div v-if="telecom" key="telecom" class="mb-6 service-input-group">
                      <div class="input-group-header mb-3">
                        <v-icon color="primary" size="20">mdi-phone</v-icon>
                        <span class="input-group-title">ຂໍ້ມູນໂທລະຄົມ</span>
                      </div>
                      
                      <!-- Province Selection -->
                      <v-autocomplete
                        v-model="telecomProvince"
                        :items="provinces"
                        item-title="name"
                        item-value="id"
                        label="ເລືອກແຂວງ *"
                        variant="outlined"
                        color="primary"
                        clearable
                        class="input-field mb-4"
                        hint="ເລືອກແຂວງເພື່ອເລີ່ມຕົ້ນ"
                        persistent-hint
                        :rules="telecom ? [rules.required] : []"
                      >
                        <template v-slot:prepend-inner>
                          <v-icon :color="telecomProvince ? 'primary' : 'grey'">
                            mdi-map-marker
                          </v-icon>
                        </template>
                      </v-autocomplete>

                      <!-- Phone Number Input -->
                      <v-text-field
                        v-model="telecomId"
                        label="ເບີໂທລະສັບ *"
                        variant="outlined"
                        color="primary"
                        :disabled="!telecomProvince"
                        :rules="telecom ? [rules.required, rules.phoneNumber] : []"
                        placeholder="ປ້ອນເບີໂທລະສັບ"
                        counter="11"
                        maxlength="11"
                        class="input-field"
                        :hint="!telecomProvince ? 'ເລືອກແຂວງກ່ອນເພື່ອປ້ອນເບີໂທ' : 'ປ້ອນເບີໂທລະສັບ 8-11 ຫຼັກ'"
                        persistent-hint
                        @input="handleTelecomIdInput"
                      >
                        <template v-slot:prepend-inner>
                          <v-icon :color="telecomId && telecomProvince ? 'primary' : 'grey'">
                            mdi-phone
                          </v-icon>
                        </template>
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
import { ref, computed, watch, onMounted } from 'vue'
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

// Province selections - No default for electric/water when using quick search
const electricProvince = ref(null)
const waterProvince = ref(null)
const telecomProvince = ref('1')

// Quick search states
const electricSearchQuery = ref('')
const waterSearchQuery = ref('')
const electricSearchResults = ref([])
const waterSearchResults = ref([])
const electricSearchLoading = ref(false)
const waterSearchLoading = ref(false)
const selectedElectricCustomer = ref(null)
const selectedWaterCustomer = ref(null)

// Customer info for confirmation dialog
const customerInfo = ref({
  electric: null,
  water: null,
  telecom: null
})

// Debounce timers
let electricSearchTimer = null
let waterSearchTimer = null

// Provinces data
const provinces = ref([
  { id: '01', name: 'ນະຄອນຫຼວງວຽງຈັນ' },
  { id: '02', name: 'ຜົ້ງສາລີ' },
  { id: '03', name: 'ຫຼວງນໍ້າທາ' },
  { id: '04', name: 'ອຸດົມໄຊ' },
  { id: '05', name: 'ບໍ່ແກ້ວ' },
  { id: '06', name: 'ຫຼວງພະບາງ' },
  { id: '07', name: 'ຫົວພັນ' },
  { id: '08', name: 'ໄຊຍະບູລີ' },
  { id: '09', name: 'ຊຽງຂວາງ' },
  { id: '10', name: 'ວຽງຈັນ' },
  { id: '11', name: 'ບໍລິຄໍາໄຊ' },
  { id: '12', name: 'ຄໍາມ່ວນ' },
  { id: '13', name: 'ສະຫວັນນະເຂດ' },
  { id: '14', name: 'ສາລະວັນ' },
  { id: '15', name: 'ເຊກອງ' },
  { id: '16', name: 'ຈໍາປາສັກ' },
  { id: '17', name: 'ອັດຕະປື' },
  { id: '18', name: 'ໄຊສົມບູນ' }
])

// Clear session on mount
onMounted(() => {
  sessionStorage.removeItem('utilitySearchResults')
  sessionStorage.removeItem('searchCriteria')
  sessionStorage.removeItem('reportAccessed')
})

// Watch for customer selection - when quick search is used, store province from customer data
watch(selectedElectricCustomer, (newVal, oldVal) => {
  if (newVal && newVal !== oldVal) {
    // User selected from quick search
    electronicId.value = newVal
    
    // Store customer info and get province_id from the selected customer
    const customer = electricSearchResults.value.find(c => c.Customer_ID === newVal)
    if (customer) {
      customerInfo.value.electric = customer
      // Store the province_id from the customer data for API call
      electricProvince.value = customer.province_id
    }
  } else if (!newVal && oldVal) {
    // User cleared quick search, allow manual entry
    electronicId.value = ''
    electricProvince.value = null
    customerInfo.value.electric = null
  }
})

watch(selectedWaterCustomer, (newVal, oldVal) => {
  if (newVal && newVal !== oldVal) {
    // User selected from quick search
    waterId.value = newVal
    
    // Store customer info and get province_id from the selected customer
    const customer = waterSearchResults.value.find(c => c.Customer_ID === newVal)
    if (customer) {
      customerInfo.value.water = customer
      // Store the province_id from the customer data for API call
      waterProvince.value = customer.province_id
    }
  } else if (!newVal && oldVal) {
    // User cleared quick search, allow manual entry
    waterId.value = ''
    waterProvince.value = null
    customerInfo.value.water = null
  }
})

// Input handlers to enforce numbers only
const handleElectricIdInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  const value = input.value
  const sanitized = value.replace(/\D/g, '')
  electronicId.value = sanitized
}

const handleWaterIdInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  const value = input.value
  const sanitized = value.replace(/\D/g, '')
  waterId.value = sanitized
}

const handleTelecomIdInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  const value = input.value
  const sanitized = value.replace(/\D/g, '')
  telecomId.value = sanitized
}

// Debounced search functions
const debouncedElectricSearch = (query: string) => {
  if (electricSearchTimer) {
    clearTimeout(electricSearchTimer)
  }
  
  if (!query || query.length < 2) {
    electricSearchResults.value = []
    return
  }
  
  electricSearchLoading.value = true
  electricSearchTimer = setTimeout(async () => {
    await searchElectricCustomers(query)
  }, 500)
}

const debouncedWaterSearch = (query: string) => {
  if (waterSearchTimer) {
    clearTimeout(waterSearchTimer)
  }
  
  if (!query || query.length < 2) {
    waterSearchResults.value = []
    return
  }
  
  waterSearchLoading.value = true
  waterSearchTimer = setTimeout(async () => {
    await searchWaterCustomers(query)
  }, 500)
}

// Search customer functions - Quick search doesn't send province (searches all)
const searchElectricCustomers = async (query: string) => {
  try {
    const config = useRuntimeConfig()
    const token = localStorage.getItem('access_token')
    
    // Quick search - search across all provinces (no province_id parameter)
    const params = {
      query: query,
      limit: 100
    }
    
    const response = await axios.get(
      `${config.public.strapi.url}api/edl-customer-search/`,
      {
        params,
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    
    electricSearchResults.value = response.data.map(customer => ({
      ...customer,
      display: `${customer.Name} ${customer.Surname || ''} ${customer.Company_name ? `(${customer.Company_name})` : ''}`.trim()
    }))
  } catch (error) {
    console.error('Electric customer search error:', error)
    electricSearchResults.value = []
  } finally {
    electricSearchLoading.value = false
  }
}

const searchWaterCustomers = async (query: string) => {
  try {
    const config = useRuntimeConfig()
    const token = localStorage.getItem('access_token')
    
    // Quick search - search across all provinces (no province_id parameter)
    const params = {
      query: query,
      limit: 100
    }
    
    const response = await axios.get(
      `${config.public.strapi.url}api/water-customer-search/`,
      {
        params,
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    
    waterSearchResults.value = response.data.map(customer => ({
      ...customer,
      display: `${customer.Name} ${customer.Surname || ''} ${customer.Company_name ? `(${customer.Company_name})` : ''}`.trim()
    }))
  } catch (error) {
    console.error('Water customer search error:', error)
    waterSearchResults.value = []
  } finally {
    waterSearchLoading.value = false
  }
}

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

// Enhanced validation rules
const rules = {
  required: (value: string) => !!value || 'ກະລຸນາປ້ອນຂໍ້ມູນ',
  numbersOnly: (value: string) => {
    if (!value) return true
    return /^\d+$/.test(value) || 'ກະລຸນາປ້ອນຕົວເລກເທົ່ານັ້ນ (0-9)'
  },
  meterLength: (value: string) => {
    if (!value) return true
    if (!/^\d+$/.test(value)) return 'ກະລຸນາປ້ອນຕົວເລກເທົ່ານັ້ນ'
    // if (value.length !== 10) return 'ລະຫັດຕ້ອງມີ 10 ຫຼັກເທົ່ານັ້ນ'
    return true
  },
  phoneNumber: (value: string) => {
    if (!value) return 'ກະລຸນາປ້ອນເບີໂທລະສັບ'
    if (!/^\d+$/.test(value)) return 'ກະລຸນາປ້ອນຕົວເລກເທົ່ານັ້ນ'
    // if (value.length < 8 || value.length > 11) return 'ເບີໂທລະສັບຕ້ອງມີ 8-11 ຫຼັກ'
    return true
  }
}

// Computed properties
const hasSelectedService = computed(() => electronic.value || water.value || telecom.value)

const canSearch = computed(() => {
  if (!hasSelectedService.value) return false
  
  // Check electric service
  if (electronic.value) {
    // Need valid customer ID and province (province is set either by manual selection or from quick search)
    if (!electronicId.value || !electricProvince.value) 
    console.log('DEBUG: Missing values:', {
        electronicId: electronicId.value,
        electricProvince: electricProvince.value,
        selectedCustomer: selectedElectricCustomer.value
      });
    return false
    if (!selectedElectricCustomer.value !== true) return false
  }
  
  // Check water service
  if (water.value) {
    // Need valid customer ID and province (province is set either by manual selection or from quick search)
    if (!waterId.value || !waterProvince.value) return false
    if (!selectedWaterCustomer.value && rules.meterLength(waterId.value) !== true) return false
  }
  
  // Check telecom service
  if (telecom.value) {
    if (!telecomProvince.value || !telecomId.value) return false
    if (rules.phoneNumber(telecomId.value) !== true) return false
  }
  
  return isFormValid.value
})

// Methods
const toggleService = (service: string) => {
  if (service === 'electronic') {
    electronic.value = !electronic.value
  }
  if (service === 'water') {
    water.value = !water.value
  }
  if (service === 'telecom') {
    telecom.value = !telecom.value
    if (telecom.value && !telecomProvince.value) {
      telecomProvince.value = '1'
    }
  }
}

// Fetch report functions - NOW INCLUDE province_id parameter
const fetchWaterReport = async (customerId: string, provinceId: string) => {
  try {
    const config = useRuntimeConfig()
    const token = localStorage.getItem('access_token')
    
    // IMPORTANT: Include province_id when fetching report
    const params = {
      water: customerId,
      province_id: provinceId
    }
    
    const response = await axios.get(
      `${config.public.strapi.url}api/utility-report/`,
      { 
        params,
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    
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
      type: 'water',
      customerInfo: customerInfo.value.water
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

const fetchElectricReport = async (customerId: string, provinceId: string) => {
  try {
    const config = useRuntimeConfig()
    const token = localStorage.getItem('access_token')
    
    // IMPORTANT: Include province_id when fetching report
    const params = {
      edl: customerId,
      province_id: provinceId
    }
    
    const response = await axios.get(
      `${config.public.strapi.url}api/edl-report/`,
      { 
        params,
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    
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
      type: 'electric',
      customerInfo: customerInfo.value.electric
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

const fetchTelecomReport = async (customerId: string, provinceId: string) => {
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

// Show error alert for not found services
const showNotFoundAlert = async (errors: any[]) => {
  const errorMessages = errors.map(e => {
    const serviceName = e.type === 'water' ? 'ນໍ້າປະປາ' : 
                       e.type === 'electric' ? 'ໄຟຟ້າ' : 'ໂທລະຄົມ'
    const icon = e.type === 'water' ? 'mdi-water' : 
                 e.type === 'electric' ? 'mdi-flash' : 'mdi-phone'
    
    return `
      <div style="padding: 12px; margin: 8px 0; background: #fef2f2; border-left: 4px solid #ef4444; border-radius: 6px; text-align: left;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <i class="${icon}" style="color: #ef4444; font-size: 20px;"></i>
          <strong style="color: #991b1b;">${serviceName}:</strong>
        </div>
        <div style="margin-top: 4px; color: #7f1d1d; font-size: 14px;">
          ${e.message}
        </div>
      </div>
    `
  }).join('')
  
  const result = await Swal.fire({
    icon: 'warning',
    title: 'ບາງບໍລິການບໍ່ພົບຂໍ້ມູນ',
    html: `
      <div style="text-align: left; padding: 10px;">
        <p style="margin-bottom: 15px; color: #6b7280;">
          ລະບົບພົບຂໍ້ມູນບາງສ່ວນ ແຕ່ບາງບໍລິການບໍ່ພົບຂໍ້ມູນ:
        </p>
        ${errorMessages}
        <div style="margin-top: 20px; padding: 12px; background: #eff6ff; border-radius: 6px; border-left: 4px solid #2563eb;">
          <p style="margin: 0; color: #1e40af; font-size: 14px;">
            <strong>ທ່ານຕ້ອງການດຳເນີນການຕໍ່ກັບຂໍ້ມູນທີ່ພົບບໍ?</strong>
          </p>
        </div>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: 'ດຳເນີນການຕໍ່',
    cancelButtonText: 'ຍົກເລີກ',
    confirmButtonColor: '#1e40af',
    cancelButtonColor: '#6b7280',
    width: '600px'
  })
  
  return result.isConfirmed
}

// Enhanced confirmation dialog with customer info
const showConfirmationDialog = async (searchResults: any) => {
  let customerInfoHtml = '<div style="margin-bottom: 20px;">'
  
  if (searchResults.electric) {
    const customer = customerInfo.value.electric || {}
    const provinceName = provinces.value.find(p => p.id === electricProvince.value)?.name || customer.province_name || 'ບໍ່ລະບຸ'
    
    customerInfoHtml += `
      <div style="padding: 12px; margin-bottom: 10px; background: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 6px;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
          <i class="mdi mdi-flash" style="color: #1e40af; font-size: 20px;"></i>
          <strong style="color: #1e40af;">ໄຟຟ້າ</strong>
        </div>
        <div style="font-size: 13px; color: #1f2937; line-height: 1.6;">
          <div><strong>ລະຫັດ:</strong> ${electronicId.value}</div>
          ${customer.Name ? `<div><strong>ຊື່:</strong> ${customer.Name} ${customer.Surname || ''}</div>` : ''}
          ${customer.Company_name ? `<div><strong>ບໍລິສັດ:</strong> ${customer.Company_name}</div>` : ''}
          <div><strong>ແຂວງ:</strong> ${provinceName}</div>
        </div>
      </div>
    `
  }
  
  if (searchResults.water) {
    const customer = customerInfo.value.water || {}
    const provinceName = provinces.value.find(p => p.id === waterProvince.value)?.name || customer.province_name || 'ບໍ່ລະບຸ'
    
    customerInfoHtml += `
      <div style="padding: 12px; margin-bottom: 10px; background: #f0fdfa; border-left: 4px solid #14b8a6; border-radius: 6px;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
          <i class="mdi mdi-water" style="color: #0d9488; font-size: 20px;"></i>
          <strong style="color: #0d9488;">ນໍ້າປະປາ</strong>
        </div>
        <div style="font-size: 13px; color: #1f2937; line-height: 1.6;">
          <div><strong>ລະຫັດ:</strong> ${waterId.value}</div>
          ${customer.Name ? `<div><strong>ຊື່:</strong> ${customer.Name} ${customer.Surname || ''}</div>` : ''}
          ${customer.Company_name ? `<div><strong>ບໍລິສັດ:</strong> ${customer.Company_name}</div>` : ''}
          <div><strong>ແຂວງ:</strong> ${provinceName}</div>
        </div>
      </div>
    `
  }
  
  if (searchResults.telecom) {
    const provinceName = provinces.value.find(p => p.id === telecomProvince.value)?.name || 'ບໍ່ລະບຸ'
    
    customerInfoHtml += `
      <div style="padding: 12px; background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 6px;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
          <i class="mdi mdi-phone" style="color: #d97706; font-size: 20px;"></i>
          <strong style="color: #d97706;">ໂທລະຄົມ</strong>
        </div>
        <div style="font-size: 13px; color: #1f2937;">
          <div><strong>ເບີໂທ:</strong> ${telecomId.value}</div>
          <div><strong>ແຂວງ:</strong> ${provinceName}</div>
        </div>
      </div>
    `
  }
  
  customerInfoHtml += '</div>'
  
  const result = await Swal.fire({
    title: '<strong>ຢືນຢັນການເຂົ້າເບິ່ງຂໍ້ມູນ</strong>',
    icon: 'warning',
    html: `
      <div style="text-align: left; padding: 20px 10px;">
        <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
          <p style="margin: 0; color: #856404; font-size: 14px;">
            <strong>ກະລຸນາອ່ານຢ່າງລະອຽດ</strong>
          </p>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h4 style="color: #1e40af; margin-bottom: 10px;">ຂໍ້ມູນລູກຄ້າທີ່ຈະເຂົ້າເບິ່ງ:</h4>
          ${customerInfoHtml}
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
          ການເຂົ້າເບິ່ງຂໍ້ມູນລູກຄ້າຕ້ອງໄດ້ຮັບອະນຸຍາດເທົ່ານັ້ນ
        </div>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: 'ຢືນຢັນ ແລະ ດຳເນີນການຕໍ່',
    cancelButtonText: 'ຍົກເລີກ',
    confirmButtonColor: '#1e40af',
    cancelButtonColor: '#6b7280',
    allowOutsideClick: false,
    allowEscapeKey: false,
    width: '700px',
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
    
    // IMPORTANT: Pass province_id to fetch functions
    if (water.value && waterId.value && waterProvince.value) {
      searchPromises.push(fetchWaterReport(waterId.value, waterProvince.value))
    }
    
    if (electronic.value && electronicId.value && electricProvince.value) {
      searchPromises.push(fetchElectricReport(electronicId.value, electricProvince.value))
    }
    
    if (telecom.value && telecomId.value && telecomProvince.value) {
      searchPromises.push(fetchTelecomReport(telecomId.value, telecomProvince.value))
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
    
    if (!hasSuccessfulResults) {
      await Swal.fire({
        icon: 'error',
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
      return
    }
    
    if (searchResults.hasErrors) {
      const shouldContinue = await showNotFoundAlert(searchResults.errors)
      if (!shouldContinue) {
        return
      }
    }
    
    const confirmed = await showConfirmationDialog(searchResults)
    
    if (confirmed) {
      sessionStorage.setItem('utilitySearchResults', JSON.stringify(searchResults))
      sessionStorage.setItem('searchCriteria', JSON.stringify({
        water: water.value ? { id: waterId.value, province: waterProvince.value } : null,
        electric: electronic.value ? { id: electronicId.value, province: electricProvince.value } : null,
        telecom: telecom.value ? { id: telecomId.value, province: telecomProvince.value } : null
      }))
      sessionStorage.setItem('reportAccessed', 'true')
      
      await Swal.fire({
        icon: 'success',
        title: 'ສຳເລັດ!',
        text: 'ກຳລັງນຳທ່ານໄປຫາໜ້າລາຍງານ...',
        timer: 1500,
        showConfirmButton: false,
        timerProgressBar: true
      })
      
      await router.push('/test21')
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
  if (!electronic.value) {
    electronicId.value = ''
    electricProvince.value = null
    selectedElectricCustomer.value = null
    electricSearchQuery.value = ''
    electricSearchResults.value = []
    customerInfo.value.electric = null
  }
  if (!water.value) {
    waterId.value = ''
    waterProvince.value = null
    selectedWaterCustomer.value = null
    waterSearchQuery.value = ''
    waterSearchResults.value = []
    customerInfo.value.water = null
  }
  if (!telecom.value) {
    telecomId.value = ''
    telecomProvince.value = null
    customerInfo.value.telecom = null
  }
}

watch([electronic, water, telecom], clearInputs)
</script>

<style scoped>
/* Same styles as before - keeping it minimal and clean */
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

.service-input-group {
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.input-group-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #e2e8f0;
}

.input-group-title {
  font-size: 1.05rem;
  font-weight: 600;
  color: #1e40af;
}

.input-field :deep(.v-field) {
  border-radius: 10px;
  background: #ffffff;
  border: 2px solid #e5e7eb;
  transition: all 0.3s ease;
}

.input-field :deep(.v-field:hover:not(.v-field--disabled)) {
  border-color: #bfdbfe;
}

.input-field :deep(.v-field--focused) {
  border-color: #1e40af;
  box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.1);
}

.input-field :deep(.v-field--disabled) {
  background: #f3f4f6;
  opacity: 0.7;
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

.button-text {
  font-size: 1.15rem;
  font-weight: 700;
}

.helper-text {
  color: #6b7280;
  font-size: 0.9rem;
  font-weight: 500;
}

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
  
  .service-input-group {
    padding: 1rem;
  }
}

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