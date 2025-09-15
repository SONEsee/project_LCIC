<!-- pages/users/CreateUser.vue -->
<template>
  <v-container fluid class="pa-4">
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8">
        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-h3 font-weight-bold text--primary mb-2">Create New User</h1>
          <p class="text-subtitle-1 text--secondary">Fill in the details to create a new user account</p>
        </div>

        <!-- Main Form Card -->
        <v-card elevation="4" class="pa-6">
          <v-form ref="formRef" @submit.prevent="handleSubmit">
            <!-- Success/Error Messages -->
            <v-alert
              v-if="successMessage"
              type="success"
              dismissible
              class="mb-4"
              @input="successMessage = ''"
            >
              {{ successMessage }}
            </v-alert>

            <v-alert
              v-if="errorMessage"
              type="error"
              dismissible
              class="mb-4"
              @input="errorMessage = ''"
            >
              {{ errorMessage }}
            </v-alert>

            <!-- Basic Information Section -->
            <v-card outlined class="mb-6">
              <v-card-title class="text-h6 primary--text">
                <v-icon left color="primary">mdi-account-circle</v-icon>
                Basic Information
              </v-card-title>
              <v-card-text>
                <v-row>
                  <!-- Username -->
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="form.username"
                      label="Username"
                      required
                      outlined
                      dense
                      prepend-inner-icon="mdi-account"
                      :error-messages="errors.username"
                      :rules="[rules.required, rules.username]"
                      placeholder="Enter username"
                      @input="clearError('username')"
                    />
                  </v-col>

                  <!-- Profile Image -->
                  <v-col cols="12" md="6">
                    <v-file-input
                      v-model="form.profile_image"
                      label="Profile Image"
                      outlined
                      dense
                      prepend-inner-icon="mdi-camera"
                      accept="image/jpeg,image/jpg,image/png,image/gif"
                      :error-messages="errors.profile_image"
                      show-size
                      placeholder="Select profile image"
                      @change="handleFileChange"
                    />
                    <div class="text-caption text--secondary">
                      Max size: 5MB. Formats: JPEG, PNG, GIF
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- Personal Details Section -->
            <v-card outlined class="mb-6">
              <v-card-title class="text-h6 primary--text">
                <v-icon left color="primary">mdi-account-details</v-icon>
                Personal Details
              </v-card-title>
              <v-card-text>
                <v-row>
                  <!-- Local Name -->
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="form.nameL"
                      label="First Name (Local)"
                      required
                      outlined
                      dense
                      prepend-inner-icon="mdi-account-box"
                      :error-messages="errors.nameL"
                      :rules="[rules.required, rules.nameLocal]"
                      placeholder="Enter first name"
                      @input="clearError('nameL')"
                    />
                  </v-col>

                  <!-- Local Surname -->
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="form.surnameL"
                      label="Last Name (Local)"
                      required
                      outlined
                      dense
                      prepend-inner-icon="mdi-account-box-outline"
                      :error-messages="errors.surnameL"
                      :rules="[rules.required, rules.nameLocal]"
                      placeholder="Enter last name"
                      @input="clearError('surnameL')"
                    />
                  </v-col>

                  <!-- English Name -->
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="form.nameE"
                      label="First Name (English)"
                      outlined
                      dense
                      prepend-inner-icon="mdi-account-box"
                      :error-messages="errors.nameE"
                      :rules="[rules.nameEnglish]"
                      placeholder="Enter English first name"
                      @input="clearError('nameE')"
                    />
                  </v-col>

                  <!-- English Surname -->
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="form.surnameE"
                      label="Last Name (English)"
                      outlined
                      dense
                      prepend-inner-icon="mdi-account-box-outline"
                      :error-messages="errors.surnameE"
                      :rules="[rules.nameEnglish]"
                      placeholder="Enter English last name"
                      @input="clearError('surnameE')"
                    />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- Bank & Organization Section -->
            <v-card outlined class="mb-6">
              <v-card-title class="text-h6 primary--text">
                <v-icon left color="primary">mdi-bank</v-icon>
                Bank & Organization
              </v-card-title>
              <v-card-text>
                <v-row>
                  <!-- Member Info - FIXED for Vuetify 3 -->
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="form.MID"
                      label="Member Info"
                      outlined
                      dense
                      prepend-inner-icon="mdi-account-group"
                      :items="memberInfoOptions"
                      :error-messages="errors.MID"
                      item-title="nameL"
                      item-value="id"
                      placeholder="Select member info"
                      @update:modelValue="onMemberChange"
                      @input="clearError('MID')"
                    >
                      <!-- Custom display for both dropdown items and selected value -->
                      <template #item="{ item, props }">
                        <v-list-item v-bind="props">
                          <v-list-item-title>
                            {{ item.raw.bnk_code }} - {{ item.raw.code }} - {{ item.raw.nameL }}
                          </v-list-item-title>
                        </v-list-item>
                      </template>
                      
                      <!-- Custom display for selected value -->
                      <!-- <template #selection="{ item }">
                        {{ item.raw.bnk_code }} - {{ item.raw.code }} - {{ item.raw.nameL }}
                      </template> -->
                    </v-select>
                  </v-col>

                  <!-- User Group -->
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="form.GID"
                      label="User Group"
                      outlined
                      dense
                      prepend-inner-icon="mdi-account-multiple"
                      :items="userGroupOptions"
                      :error-messages="errors.GID"
                      item-title="nameL"
                      item-value="GID"
                      placeholder="Select user group"
                      @input="clearError('GID')"
                    />
                  </v-col>

                  <!-- Bank Code -->
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="form.bnk_code"
                      label="Bank Code"
                      outlined
                      dense
                      prepend-inner-icon="mdi-bank"
                      :error-messages="errors.bnk_code"
                      :readonly="!!form.MID"
                      :rules="[rules.bankCode]"
                      placeholder="Enter bank code"
                      @input="clearError('bnk_code')"
                    />
                    <div v-if="form.MID" class="text-caption text--secondary">
                      Auto-filled from selected member info
                    </div>
                  </v-col>

                  <!-- Branch ID -->
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="form.branch_id"
                      label="Branch ID"
                      outlined
                      dense
                      prepend-inner-icon="mdi-source-branch"
                      :error-messages="errors.branch_id"
                      :rules="[rules.branchId]"
                      placeholder="Enter branch ID"
                      @input="clearError('branch_id')"
                    />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- Security Section -->
            <v-card outlined class="mb-6">
              <v-card-title class="text-h6 primary--text">
                <v-icon left color="primary">mdi-shield-lock</v-icon>
                Security
              </v-card-title>
              <v-card-text>
                <v-row>
                  <!-- Password -->
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="form.password"
                      label="Password"
                      required
                      outlined
                      dense
                      prepend-inner-icon="mdi-lock"
                      :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="showPassword ? 'text' : 'password'"
                      :error-messages="errors.password"
                      :rules="[rules.required, rules.password]"
                      placeholder="Enter password (min 8 characters)"
                      @click:append="showPassword = !showPassword"
                      @input="clearError('password')"
                    />
                  </v-col>

                  <!-- Confirm Password -->
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="form.confirm_password"
                      label="Confirm Password"
                      required
                      outlined
                      dense
                      prepend-inner-icon="mdi-lock-check"
                      :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="showConfirmPassword ? 'text' : 'password'"
                      :error-messages="errors.confirm_password"
                      :rules="[rules.required, rules.passwordMatch]"
                      placeholder="Confirm password"
                      @click:append="showConfirmPassword = !showConfirmPassword"
                      @input="clearError('confirm_password')"
                    />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- Status Section -->
            <v-card outlined class="mb-6">
              <v-card-title class="text-h6 primary--text">
                <v-icon left color="primary">mdi-account-check</v-icon>
                Status
              </v-card-title>
              <v-card-text>
                <v-switch
                  v-model="form.is_active"
                  label="Active User"
                  color="primary"
                  inset
                />
              </v-card-text>
            </v-card>

            <!-- Action Buttons -->
            <v-card-actions class="justify-end pa-4">
              <v-btn
                outlined
                color="grey"
                @click="resetForm"
                :disabled="loading"
                class="mr-4"
              >
                <v-icon left>mdi-refresh</v-icon>
                Reset
              </v-btn>
              
              <v-btn
                type="submit"
                color="primary"
                :loading="loading"
                :disabled="loading || !canSubmit"
                elevation="2"
              >
                <v-icon left>mdi-account-plus</v-icon>
                Create User
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

// Page meta
definePageMeta({
  title: 'Create User',
  middleware: 'auth'
})

// Router
const router = useRouter()

// Runtime config
const config = useRuntimeConfig()

// Reactive state
const form = ref({
  username: '',
  password: '',
  confirm_password: '',
  nameL: '',
  surnameL: '',
  nameE: '',
  surnameE: '',
  MID: '',
  GID: '',
  branch_id: '',
  bnk_code: '',
  profile_image: null,
  is_active: true
})

const errors = ref({})
const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const memberInfoOptions = ref([])
const userGroupOptions = ref([])
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const formRef = ref(null)

// Rate limiting
const submitAttempts = ref(0)
const lastSubmitTime = ref(0)

// Computed
const apiUrl = computed(() => config.public.strapi?.url || 'http://localhost:8000/')

const canSubmit = computed(() => {
  const now = Date.now()
  const timeSinceLastSubmit = now - lastSubmitTime.value
  
  // Reset attempts after 1 minute
  if (timeSinceLastSubmit > 60000) {
    submitAttempts.value = 0
  }
  
  // Allow max 5 attempts per minute
  return submitAttempts.value < 5
})

// Validation rules
const rules = {
  required: (value) => !!value || 'This field is required',
  username: (value) => {
    if (!value) return 'Username is required'
    if (value.length < 3) return 'Username must be at least 3 characters'
    if (!/^[a-zA-Z0-9_-]+$/.test(value)) return 'Username can only contain letters, numbers, underscore and hyphen'
    return true
  },
  password: (value) => {
    if (!value) return 'Password is required'
    if (value.length < 8) return 'Password must be at least 8 characters'
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
      return 'Password must contain uppercase, lowercase and number'
    }
    return true
  },
  passwordMatch: (value) => value === form.value.password || 'Passwords do not match',
  nameLocal: (value) => {
    if (!value) return 'This field is required'
    if (!/^[a-zA-Zก-๙\s'-]+$/.test(value)) return 'Invalid characters in name'
    return true
  },
  nameEnglish: (value) => {
    if (!value) return true // Optional field
    if (!/^[a-zA-Z\s'-]+$/.test(value)) return 'Only English characters allowed'
    return true
  },
  bankCode: (value) => {
    if (!value) return true // Optional field
    if (!/^[A-Z0-9]+$/.test(value)) return 'Invalid bank code format'
    return true
  },
  branchId: (value) => {
    if (!value) return true // Optional field
    if (!/^[A-Z0-9-]+$/.test(value)) return 'Invalid branch ID format'
    return true
  }
}

// Security utilities
const sanitizeInput = (value) => {
  if (typeof value !== 'string') return value
  return value.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
}

const getAuthHeaders = () => {
  const token = localStorage.getItem("access_token")
  if (!token) {
    throw new Error('No authentication token found')
  }
  return { 
    Authorization: `Bearer ${token}`,
    'X-Requested-With': 'XMLHttpRequest'
  }
}

// Methods
const clearError = (field) => {
  if (errors.value[field]) {
    delete errors.value[field]
  }
}

const fetchDropdownData = async () => {
  try {
    const headers = getAuthHeaders()
    
    // Parallel fetch for better performance
    const [memberResponse, groupResponse] = await Promise.all([
      axios.get(`${apiUrl.value}api/memberinfo/`, { 
        headers,
        timeout: 10000 
      }),
      axios.get(`${apiUrl.value}api/user-groups/`, { 
        headers,
        timeout: 10000 
      })
    ])
    
    // Safe data extraction with fallbacks
    memberInfoOptions.value = memberResponse.data?.data || memberResponse.data || []
    userGroupOptions.value = groupResponse.data?.data || groupResponse.data || []
    
    // Debug logging only in development
    if (import.meta.env.DEV) {
      console.log("Member Info Options:", memberInfoOptions.value)
      console.log("User Group Options:", userGroupOptions.value)
    }
    
  } catch (error) {
    console.error('Error fetching dropdown data:', error)
    
    // Check for auth errors first
    if (error.response?.status === 401) {
      await Swal.fire({
        icon: 'warning',
        title: 'Session Expired',
        text: 'Please login again.',
        confirmButtonColor: '#1976d2'
      })
      localStorage.removeItem('access_token')
      router.push('/login')
      return
    }
    
    await Swal.fire({
      icon: 'error',
      title: 'Loading Error',
      text: 'Failed to load form options. Please refresh the page.',
      confirmButtonColor: '#1976d2'
    })
  }
}

const onMemberChange = () => {
  if (form.value.MID) {
    const selectedMember = memberInfoOptions.value.find(
      m => m.id === form.value.MID || m.id == form.value.MID
    )
    if (selectedMember?.bnk_code) {
      form.value.bnk_code = selectedMember.bnk_code
    }
  } else {
    form.value.bnk_code = ''
  }
  clearError('MID')
}

const handleFileChange = () => {
  const file = form.value.profile_image
  if (file) {
    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      errors.value.profile_image = ['File size must be less than 5MB']
      form.value.profile_image = null
      Swal.fire({
        icon: 'error',
        title: 'File Too Large',
        text: 'Please select a file smaller than 5MB.',
        confirmButtonColor: '#1976d2'
      })
      return
    }
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      errors.value.profile_image = ['Only JPEG, PNG and GIF files are allowed']
      form.value.profile_image = null
      Swal.fire({
        icon: 'error',
        title: 'Invalid File Type',
        text: 'Please select a JPEG, PNG, or GIF image file.',
        confirmButtonColor: '#1976d2'
      })
      return
    }
    
    clearError('profile_image')
  }
}

const validateForm = () => {
  const formErrors = {}
  
  // Username validation
  const username = sanitizeInput(form.value.username)
  if (!username) {
    formErrors.username = ['Username is required']
  } else if (username.length < 3) {
    formErrors.username = ['Username must be at least 3 characters']
  } else if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    formErrors.username = ['Username can only contain letters, numbers, underscore and hyphen']
  }
  
  // Password validation
  if (!form.value.password) {
    formErrors.password = ['Password is required']
  } else if (form.value.password.length < 8) {
    formErrors.password = ['Password must be at least 8 characters']
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.value.password)) {
    formErrors.password = ['Password must contain uppercase, lowercase and number']
  }
  
  // Password confirmation
  if (!form.value.confirm_password) {
    formErrors.confirm_password = ['Password confirmation is required']
  } else if (form.value.password !== form.value.confirm_password) {
    formErrors.confirm_password = ['Passwords do not match']
  }
  
  // Name validation with XSS prevention
  const nameL = sanitizeInput(form.value.nameL)
  const surnameL = sanitizeInput(form.value.surnameL)
  
  if (!nameL) {
    formErrors.nameL = ['First name is required']
  } else if (!/^[a-zA-Zก-๙\s'-]+$/.test(nameL)) {
    formErrors.nameL = ['Invalid characters in name']
  }
  
  if (!surnameL) {
    formErrors.surnameL = ['Last name is required']
  } else if (!/^[a-zA-Zก-๙\s'-]+$/.test(surnameL)) {
    formErrors.surnameL = ['Invalid characters in surname']
  }
  
  // Optional English names validation
  if (form.value.nameE && !/^[a-zA-Z\s'-]+$/.test(form.value.nameE)) {
    formErrors.nameE = ['Only English characters allowed']
  }
  
  if (form.value.surnameE && !/^[a-zA-Z\s'-]+$/.test(form.value.surnameE)) {
    formErrors.surnameE = ['Only English characters allowed']
  }
  
  errors.value = formErrors
  return Object.keys(formErrors).length === 0
}

const handleSubmit = async () => {
  // Rate limiting check
  if (!canSubmit.value) {
    await Swal.fire({
      icon: 'warning',
      title: 'Too Many Attempts',
      text: 'Please wait a moment before trying again.',
      confirmButtonColor: '#1976d2'
    })
    return
  }
  
  // Update rate limiting
  submitAttempts.value++
  lastSubmitTime.value = Date.now()
  
  // Clear previous messages
  successMessage.value = ''
  errorMessage.value = ''
  
  // Validate Vuetify form
  const { valid } = await formRef.value.validate()
  
  // Additional custom validation
  if (!validateForm() || !valid) {
    await Swal.fire({
      icon: 'error',
      title: 'Validation Error',
      text: 'Please fix the validation errors before submitting.',
      confirmButtonColor: '#1976d2'
    })
    return
  }
  
  loading.value = true
  
  try {
    // Prepare form data
    const formData = new FormData()
    
    // Sanitize text inputs before sending
    const sanitizedData = {
      username: sanitizeInput(form.value.username),
      password: form.value.password, // Don't sanitize password
      nameL: sanitizeInput(form.value.nameL),
      surnameL: sanitizeInput(form.value.surnameL),
      nameE: sanitizeInput(form.value.nameE),
      surnameE: sanitizeInput(form.value.surnameE),
      MID: form.value.MID,
      GID: form.value.GID,
      branch_id: sanitizeInput(form.value.branch_id),
      bnk_code: sanitizeInput(form.value.bnk_code),
      is_active: form.value.is_active
    }
    
    // Append sanitized data
    Object.entries(sanitizedData).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        formData.append(key, value)
      }
    })
    
    // Handle file upload securely
    if (form.value.profile_image) {
      const file = form.value.profile_image
      const validTypes = ['image/jpeg', 'image/png', 'image/gif']
      const maxSize = 5 * 1024 * 1024 // 5MB
      
      if (!validTypes.includes(file.type) || file.size > maxSize) {
        throw new Error('Invalid file')
      }
      
      formData.append('profile_image', file)
    }
    
    // Get auth headers
    const headers = {
      ...getAuthHeaders(),
      'Content-Type': 'multipart/form-data'
    }
    
    // Make API request with timeout
    const response = await axios.post(
      `${apiUrl.value}api/users/`,
      formData,
      { 
        headers,
        timeout: 30000, // 30 second timeout
        validateStatus: status => status < 500
      }
    )
    
    if (response.data.success) {
      // Reset rate limiting on success
      submitAttempts.value = 0
      
      // Success notification
      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: response.data.message || 'User created successfully!',
        confirmButtonColor: '#1976d2',
        timer: 2000,
        timerProgressBar: true
      })
      
      resetForm()
      
      // Redirect to user list
      router.push('/users')
    } else {
      throw new Error(response.data.message || 'Failed to create user')
    }
    
  } catch (error) {
    console.error('Error creating user:', error)
    
    let errorMsg = 'Failed to create user. Please try again.'
    let validationErrors = {}
    
    if (error.response?.data) {
      if (error.response.data.errors) {
        validationErrors = error.response.data.errors
        errors.value = validationErrors
      }
      errorMsg = error.response.data.message || errorMsg
    } else if (error.message) {
      errorMsg = error.message
    }
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      await Swal.fire({
        icon: 'warning',
        title: 'Session Expired',
        text: 'Your session has expired. Please login again.',
        confirmButtonColor: '#1976d2'
      })
      localStorage.removeItem('access_token')
      router.push('/login')
      return
    }
    
    // Show error notification
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: errorMsg,
      confirmButtonColor: '#1976d2'
    })
    
    errorMessage.value = errorMsg
    
  } finally {
    loading.value = false
  }
}

const resetForm = async () => {
  // Reset Vuetify form validation
  if (formRef.value) {
    formRef.value.resetValidation()
  }
  
  // Reset form to initial state
  Object.assign(form.value, {
    username: '',
    password: '',
    confirm_password: '',
    nameL: '',
    surnameL: '',
    nameE: '',
    surnameE: '',
    MID: '',
    GID: '',
    branch_id: '',
    bnk_code: '',
    profile_image: null,
    is_active: true
  })
  
  // Clear errors and messages
  errors.value = {}
  successMessage.value = ''
  errorMessage.value = ''
  
  await Swal.fire({
    icon: 'info',
    title: 'Form Reset',
    text: 'All fields have been cleared.',
    confirmButtonColor: '#1976d2',
    timer: 1500,
    timerProgressBar: true
  })
}

// Lifecycle hooks
onMounted(async () => {
  await fetchDropdownData()
})

// SEO Head
useHead({
  title: 'Create User - User Management',
  meta: [
    { name: 'description', content: 'Create a new user account with comprehensive validation and security features.' }
  ]
})
</script>

<style scoped>
/* Custom styles for clean UI */
.v-card {
  border-radius: 12px !important;
}

.v-card--outlined {
  border: 1px solid rgba(0, 0, 0, 0.12) !important;
}

.v-text-field--outlined,
.v-select--outlined,
.v-file-input--outlined {
  border-radius: 8px !important;
}

/* Button styling */
.v-btn {
  border-radius: 8px !important;
  text-transform: none !important;
  font-weight: 500 !important;
}

/* Card section styling */
.v-card-title {
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  margin-bottom: 16px !important;
}

/* Alert styling */
.v-alert {
  border-radius: 8px !important;
}

/* Switch styling */
.v-input--switch {
  margin-top: 8px;
}

/* Responsive spacing */
@media (max-width: 960px) {
  .v-container {
    padding: 8px !important;
  }
  
  .v-card {
    margin-bottom: 16px;
  }
}

/* Focus styles */
.v-text-field--outlined.v-input--is-focused .v-input__control .v-input__slot,
.v-select--outlined.v-input--is-focused .v-input__control .v-input__slot {
  border-color: #1976d2 !important;
  border-width: 2px !important;
}

/* Loading state */
.v-btn--loading {
  pointer-events: none;
}

/* Icon styling */
.v-icon {
  font-size: 20px;
}

/* Text styling */
.text-h3 {
  color: #1976d2 !important;
}

.text-subtitle-1 {
  color: #666 !important;
}

/* Form validation styling */
.v-messages__message {
  color: #d32f2f !important;
}

.error--text {
  color: #d32f2f !important;
}

/* Success styling */
.success--text {
  color: #388e3c !important;
}

/* Primary color customization */
.primary--text {
  color: #1976d2 !important;
}

.v-btn.primary {
  background-color: #1976d2 !important;
  color: white !important;
}

.v-btn.primary:hover {
  background-color: #1565c0 !important;
}

/* Smooth transitions */
* {
  transition: all 0.3s ease;
}
</style>