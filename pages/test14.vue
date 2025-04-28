<template>
  <v-container class="pa-6" style="max-width: 600px;">
    <h1 class="text-h5 font-weight-bold mb-6 text-center">Download Payment History</h1>

    <!-- Form Card -->
    <v-expand-transition>
      <v-card v-show="!isLoadingProvinces" class="mb-8 pa-6" elevation="2" rounded="lg">
        <v-form @submit.prevent="handleSubmit" ref="form" v-model="valid">
          <v-row>
            <v-col cols="12">
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-select
                    v-model="form.province_code"
                    :items="provinces"
                    item-title="displayText"
                    item-value="pro_id"
                    label="Province"
                    placeholder="Select a province"
                    :disabled="isLoadingProvinces"
                    :loading="isLoadingProvinces"
                    variant="outlined"
                    density="compact"
                    :rules="[v => !!v || 'Province is required']"
                    v-bind="attrs"
                    v-on="on"
                  />

                  
                </template>
                <span>Select a province</span>
              </v-tooltip>
              <v-progress-circular
                v-if="isLoadingProvinces"
                indeterminate
                color="primary"
                size="24"
                class="mt-2"
              ></v-progress-circular>
              <p v-if="!isLoadingProvinces && provinces.length === 0" class="text-caption error--text mt-2">
                No provinces available. Please check the API.
              </p>
            </v-col>

            <v-col cols="12">
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="form.dateRequest"
                    label="Date (YYYYMM)"
                    placeholder="e.g., 202503"
                    outlined
                    dense
                    :rules="[v => isValidDateRequest(v) || 'Invalid date format (YYYYMM)']"
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <span>Enter date in YYYYMM format</span>
              </v-tooltip>
            </v-col>

            <v-col cols="12" sm="6">
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model.number="form.page"
                    type="number"
                    label="Page"
                    outlined
                    dense
                    :rules="[v => v >= 1 || 'Page must be at least 1']"
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <span>Page number for pagination</span>
              </v-tooltip>
            </v-col>

            <v-col cols="12" sm="6">
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model.number="form.limit"
                    type="number"
                    label="Limit"
                    outlined
                    dense
                    :rules="[v => v >= 1 || 'Limit must be at least 1']"
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <span>Number of records per page</span>
              </v-tooltip>
            </v-col>

            <v-col cols="12">
              <v-btn
                type="submit"
                color="purple"
                :loading="isLoading"
                :disabled="isLoading || isLoadingProvinces || !valid"
                block
                large
                class="pulse-button white--text"
              >
                <v-icon left v-if="isLoading">mdi-loading</v-icon>
                {{ isLoading ? 'Downloading...' : 'Download Files' }}
              </v-btn>
            </v-col>
          </v-row>

          <!-- Progress Bar -->
          <v-row v-if="isLoading && results.length">
            <v-col cols="12">
              <v-progress-linear
                :value="(results.length / totalDistricts) * 100"
                color="blue"
                height="10"
                rounded
                class="mt-4"
              ></v-progress-linear>
              <p class="text-caption mt-2">Downloaded {{ results.length }} of {{ totalDistricts }} files</p>
            </v-col>
          </v-row>
        </v-form>
      </v-card>
    </v-expand-transition>

    <!-- Error Message -->
    <v-slide-y-transition>
      <v-alert
        v-if="error"
        type="error"
        icon="mdi-alert-circle"
        class="mt-4"
        dismissible
        @input="error = ''"
      >
        {{ error }}
      </v-alert>
    </v-slide-y-transition>

    <!-- Results Table -->
    <v-expand-transition>
      <v-card v-if="results.length" class="mt-8 pa-6" elevation="2" rounded="lg">
        <h2 class="text-h6 font-weight-bold mb-4">Download Results</h2>
        <v-data-table
          :headers="headers"
          :items="results"
          :items-per-page="-1"
          hide-default-footer
          class="elevation-0"
        >
          <template v-slot:item.status="{ item }">
            <span :class="item.status === 'success' ? 'success--text' : 'error--text'">
              {{ item.status.charAt(0).toUpperCase() + item.status.slice(1) }}
            </span>
          </template>
          <template v-slot:item.error="{ item }">
            {{ item.error || '-' }}
          </template>
        </v-data-table>
      </v-card>
    </v-expand-transition>
  </v-container>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'

// Form data
const form = ref({
  province_code: '',
  dateRequest: '202503',
  page: 1,
  limit: 10000
})

// State
const valid = ref(false)
const isLoading = ref(false)
const isLoadingProvinces = ref(true)
const error = ref('')
const results = ref([])
const provinces = ref([])
const provinceDistricts = ref([])
const totalDistricts = ref(0)

// Table headers
const headers = [
  { text: 'Filename', value: 'filename', sortable: true },
  { text: 'Status', value: 'status', sortable: true },
  { text: 'Details', value: 'error', sortable: false }
]

// API base URL
const API_BASE_URL = 'https://edl-inside-api.edl.com.la/api_v1/wattmonitor-bol/billing-svc'

// Function to validate dateRequest format (YYYYMM)
const isValidDateRequest = (dateRequest) => {
  const regex = /^\d{4}(0[1-9]|1[0-2])$/
  return regex.test(dateRequest)
}

// Function to download file
const downloadFile = (data, filename) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Fetch provinces and districts on mount
onMounted(async () => {
  try {
    const response = await axios.get(`http://192.168.45.56:8000/api/province-edldetail/`)
    provinceDistricts.value = response.data

    // Log the response to debug
    console.log('API Response:', response.data)

    // Extract unique provinces and ensure displayText is set
    const uniqueProvinces = []
    const seenProIds = new Set()
    for (const item of response.data) {
      if (!seenProIds.has(item.pro_id)) {
        seenProIds.add(item.pro_id)
        uniqueProvinces.push({
          pro_id: String(item.pro_id),
          pro_name: String(item.pro_name),
          displayText: `${String(item.pro_name)} (${String(item.pro_id)})`
        })
      }
    }
    provinces.value = [...uniqueProvinces.sort((a, b) => a.pro_id.localeCompare(b.pro_id))]

    // Log provinces to debug
    console.log('Provinces:', provinces.value)

    // If no provinces are found, set an error
    if (!provinces.value.length) {
      error.value = 'No provinces found from the API.'
    }
  } catch (err) {
    error.value = 'Failed to load provinces: ' + (err.message || 'Unknown error')
    console.error('Error fetching provinces:', err)
  } finally {
    isLoadingProvinces.value = false
  }
})

// Watch provinces to debug rendering
watch(provinces, (newProvinces) => {
  console.log('Provinces updated:', newProvinces)
})

// Form submission handler
const handleSubmit = async () => {
  error.value = ''
  results.value = []
  isLoading.value = true

  try {
    // Validate dateRequest
    if (!isValidDateRequest(form.value.dateRequest)) {
      throw new Error('Invalid date format. Use YYYYMM (e.g., 202503)')
    }

    // Log the selected province_code for debugging
    console.log('Selected province_code:', form.value.province_code)

    // Get districts for the selected province
    const districts = provinceDistricts.value
      .filter(item => String(item.pro_id) === String(form.value.province_code))
      .sort((a, b) => a.dis_id.localeCompare(b.dis_id))

    if (!districts.length) {
      throw new Error(`No districts found for province code ${form.value.province_code}`)
    }

    totalDistricts.value = districts.length

    // Loop through each district and download data
    for (const district of districts) {
      const district_code = district.dis_id
      const filename = `electric-bill-${form.value.province_code}-${district_code}-${form.value.dateRequest}.json`

      try {
        const response = await axios.get(`${API_BASE_URL}/billing/getpaymenthistory`, {
          params: {
            province_code: form.value.province_code,
            district_code: district_code,
            dateRequest: form.value.dateRequest,
            page: form.value.page,
            limit: form.value.limit
          },
          responseType: 'json'
        })

        // Trigger download
        downloadFile(response.data, filename)

        results.value.push({
          filename,
          status: 'success',
          error: ''
        })
      } catch (err) {
        results.value.push({
          filename,
          status: 'failed',
          error: err.message || 'Failed to download'
        })
      }
    }
  } catch (err) {
    error.value = err.message || 'An error occurred while processing the request'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* Vuetify animations */
.v-expand-transition-enter-active,
.v-expand-transition-leave-active {
  transition: all 0.5s ease;
}
.v-expand-transition-enter-from,
.v-expand-transition-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.v-slide-y-transition-enter-active {
  transition: all 0.3s ease;
}
.v-slide-y-transition-leave-active {
  transition: all 0.2s ease;
}
.v-slide-y-transition-enter-from,
.v-slide-y-transition-leave-to {
  transform: translateY(20px);
  opacity: 0;
}

.pulse-button:hover:not([disabled]) {
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

/* Custom styles to match the screenshot */
.v-text-field--outlined fieldset {
  border-color: #FF5252 !important;
}

.v-btn {
  background-color: #AB47BC !important;
}
</style>