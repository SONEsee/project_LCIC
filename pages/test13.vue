<template>
  <div>
    <v-btn color="primary" @click="openCreateDialog = true" class="mb-4">
      Create Bank
    </v-btn>

    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      timeout="3000"
    >
      {{ snackbar.message }}
      <template v-slot:actions>
        <v-btn
          color="white"
          variant="text"
          @click="snackbar.show = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>


    <!-- Data Table -->
    <v-data-table
      :headers="headers"
      :items="banks"
      item-value="bnk_sys_id"
      class="elevation-1"
    >
      <template v-slot:item.bnk_images="{ item }">
        <v-img
          :src="getImageUrl(item.bnk_images_url)"
          max-height="50"
          max-width="50"
          class="ma-2"
        />
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon
          small
          class="mr-2"
          @click="editBank(item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          small
          @click="deleteBank(item.bnk_sys_id)"
        >
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>

    <!-- Create Bank Dialog -->
    <v-dialog v-model="openCreateDialog" max-width="600">
      <v-card>
        <v-card-title>Create Bank</v-card-title>
        <v-card-text>
          <v-form ref="createFormRef" @submit.prevent>
            <v-text-field
              v-model="form.bnk_code"
              label="Bank Code"
              :rules="[v => !!v || 'Bank Code is required']"
              required
            />
            <v-text-field
              v-model="form.bnk_short_form"
              label="Short Form"
              :rules="[v => !!v || 'Short Form is required']"
              required
            />
            <v-text-field
              v-model="form.bnk_name"
              label="Bank Name"
              :rules="[v => !!v || 'Bank Name is required']"
              required
            />
            <v-textarea
              v-model="form.bnk_lao_name"
              label="Lao Name"
              :rules="[v => !!v || 'Lao Name is required']"
              required
            />
            <v-text-field
              v-model="form.bnk_insert_date"
              label="Insert Date"
              type="date"
            />
            <v-text-field
              v-model="form.bnk_type"
              label="Bank Type"
              type="number"
              :rules="[v => !!v || 'Bank Type is required']"
              required
            />
            <v-file-input
              v-model="form.bnk_images"
              label="Bank Image"
              accept="image/*"
              prepend-icon="mdi-camera"
              clearable
              show-size
              :rules="[
                v => !v || (Array.isArray(v) && v[0] && v[0].size < 5000000) || 'Image size should be less than 5 MB'
              ]"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="closeCreateDialog">Cancel</v-btn>
          <v-btn color="primary" @click="createBank">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Edit Bank Dialog -->
    <v-dialog v-model="openEditDialog" max-width="600">
      <v-card>
        <v-card-title>Edit Bank</v-card-title>
        <v-card-text>
          <v-form ref="editFormRef" @submit.prevent>
            <v-text-field
              v-model="editForm.bnk_code"
              label="Bank Code"
              :rules="[v => !!v || 'Bank Code is required']"
              required
            />
            <v-text-field
              v-model="editForm.bnk_short_form"
              label="Short Form"
              :rules="[v => !!v || 'Short Form is required']"
              required
            />
            <v-text-field
              v-model="editForm.bnk_name"
              label="Bank Name"
              :rules="[v => !!v || 'Bank Name is required']"
              required
            />
            <v-textarea
              v-model="editForm.bnk_lao_name"
              label="Lao Name"
              :rules="[v => !!v || 'Lao Name is required']"
              required
            />
            <v-text-field
              v-model="editForm.bnk_insert_date"
              label="Insert Date"
              type="date"
            />
            <v-text-field
              v-model="editForm.bnk_type"
              label="Bank Type"
              type="number"
              :rules="[v => !!v || 'Bank Type is required']"
              required
            />
            <v-file-input
              v-model="editForm.bnk_images"
              label="Bank Image"
              accept="image/*"
              prepend-icon="mdi-camera"
              clearable
              show-size
              :rules="[
                v => !v || (Array.isArray(v) && v[0] && v[0].size < 5000000) || 'Image size should be less than 5 MB'
              ]"
              @update:modelValue="onBankImageUpdate"
            />
            <v-img
              v-if="editForm.bnk_images_url && !editForm.bnk_images"
              :src="editForm.bnk_images_url"
              max-height="100"
              class="mt-2"
            />
            <v-img
              v-if="editForm.bnk_images"
              :src="createObjectURL(editForm.bnk_images[0])"
              max-height="100"
              class="mt-2"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="openEditDialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="updateBank">Update</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const banks = ref([])
const headers = [
  { title: 'Bank Code', value: 'bnk_code' },
  { title: 'Short Form', value: 'bnk_short_form' },
  { title: 'Bank Name', value: 'bnk_name' },
  { title: 'Lao Name', value: 'bnk_lao_name' },
  { title: 'Insert Date', value: 'bnk_insert_date' },
  { title: 'Bank Type', value: 'bnk_type' },
  { title: 'Image', value: 'bnk_images' },
  { title: 'Actions', value: 'actions', sortable: false },
]

const form = ref({
  bnk_code: '',
  bnk_short_form: '',
  bnk_name: '',
  bnk_lao_name: '',
  bnk_insert_date: '',
  bnk_type: '',
  bnk_images: null
})
const editForm = ref({})
const openCreateDialog = ref(false)
const openEditDialog = ref(false)
const editingBankId = ref(null)
const createFormRef = ref(null)
const editFormRef = ref(null)

// Base URL for images
const BASE_URL = 'http://192.168.45.55:8000'
const snackbar = ref({
  show: false,
  message: '',
  color: 'success'  // success, error, etc.
})
const getImageUrl = (path) => {
  if (!path) return '/default-avatar.png'
  return path.startsWith('http') ? path : `${BASE_URL}${path}`
}

const createObjectURL = (file) => {
  return file ? URL.createObjectURL(file) : ''
}

const fetchBanks = async () => {
  try {
    const response = await fetch('http://192.168.45.55:8000/api/banks/', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    })
    const data = await response.json()
    banks.value = Array.isArray(data) 
      ? data.map(bank => ({ ...bank, id: bank.bnk_sys_id }))
      : []
    console.log('Banks:', banks.value)
  } catch (error) {
    console.error('Error fetching banks:', error)
  }
}
const createBank = async () => {
  if (!createFormRef.value.validate()) return

  const formData = new FormData()
  console.log('Form before FormData:', form.value)
  Object.keys(form.value).forEach(key => {
    if (key === 'bnk_images' && form.value[key]) {
      console.log('Bank image:', form.value[key])
      if (Array.isArray(form.value[key]) && form.value[key][0] instanceof File) {
        formData.append(key, form.value[key][0])
      } else if (form.value[key] instanceof File) {
        formData.append(key, form.value[key])
      } else {
        console.warn('Bank image is not a valid File:', form.value[key])
      }
    } else if (form.value[key] && key !== 'bnk_images') {
      formData.append(key, form.value[key])
    }
  })

  for (let [key, value] of formData.entries()) {
    console.log(`FormData: ${key} =`, value)
  }

  try {
    const response = await fetch('http://192.168.45.55:8000/api/banks/', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    })
    const data = await response.json()
    console.log('Create bank response:', data)
    if (response.ok) {
      await fetchBanks()
      form.value = {
        bnk_code: '',
        bnk_short_form: '',
        bnk_name: '',
        bnk_lao_name: '',
        bnk_insert_date: '',
        bnk_type: '',
        bnk_images: null
      }
      openCreateDialog.value = false
      snackbar.value = {
        show: true,
        message: 'Bank created successfully!',
        color: 'success'
      }
    } else {
      console.error('Create bank error:', data)
      if (data.error && data.error.includes('already exists')) {
        snackbar.value = {
          show: true,
          message: data.error,
          color: 'error'
        }
      } else {
        snackbar.value = {
          show: true,
          message: data.error || 'Failed to create bank',
          color: 'error'
        }
      }
    }
  } catch (error) {
    console.error('Error creating bank:', error)
    snackbar.value = {
      show: true,
      message: 'An error occurred while creating the bank',
      color: 'error'
    }
  }
}

const closeCreateDialog = () => {
  openCreateDialog.value = false
  form.value = {
    bnk_code: '',
    bnk_short_form: '',
    bnk_name: '',
    bnk_lao_name: '',
    bnk_insert_date: '',
    bnk_type: '',
    bnk_images: null
  }
  createFormRef.value.resetValidation()
}

const editBank = (bank) => {
  console.log('Editing bank:', bank)
  if (!bank.bnk_sys_id) {
    console.error('Bank ID is missing:', bank)
    alert('Cannot edit bank: ID is missing')
    return
  }
  editingBankId.value = bank.bnk_sys_id
  editForm.value = {
    bnk_code: bank.bnk_code,
    bnk_short_form: bank.bnk_short_form,
    bnk_name: bank.bnk_name,
    bnk_lao_name: bank.bnk_lao_name,
    bnk_insert_date: bank.bnk_insert_date,
    bnk_type: bank.bnk_type,
    bnk_images: null,
    bnk_images_url: bank.bnk_images_url
  }
  console.log('Initial editForm:', editForm.value)
  openEditDialog.value = true
}

const onBankImageUpdate = (value) => {
  console.log('Bank image updated:', value)
  editForm.value.bnk_images = value ? [...value] : null
}

const updateBank = async () => {
  if (!editFormRef.value.validate()) return
  if (!editingBankId.value) {
    alert('Error: Bank ID is missing')
    return
  }

  const formData = new FormData()
  console.log('Edit form before FormData:', editForm.value)
  Object.keys(editForm.value).forEach(key => {
    if (key === 'bnk_images' && editForm.value[key]) {
      console.log('Bank image:', editForm.value[key])
      if (Array.isArray(editForm.value[key]) && editForm.value[key][0] instanceof File) {
        formData.append(key, editForm.value[key][0])
      } else if (editForm.value[key] instanceof File) {
        formData.append(key, editForm.value[key])
      } else {
        console.warn('Bank image is not a valid File:', editForm.value[key])
      }
    } else if (key !== 'bnk_images_url' && editForm.value[key]) {
      formData.append(key, editForm.value[key])
    }
  })

  for (let [key, value] of formData.entries()) {
    console.log(`FormData: ${key} =`, value)
  }

  if (![...formData.entries()].length) {
    alert('No changes detected. Please modify at least one field or upload a new image.')
    return
  }

  try {
    const response = await fetch(`http://192.168.45.55:8000/api/banks/${editingBankId.value}/`, {
      method: 'PUT',
      body: formData,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    })
    const data = await response.json()
    console.log('Update bank response:', data)
    if (response.ok) {
      await fetchBanks()
      openEditDialog.value = false
      editForm.value = {}
    } else {
      console.error('Update bank error:', data)
      alert('Error: ' + (data.error || 'Failed to update bank'))
    }
  } catch (error) {
    console.error('Error updating bank:', error)
    alert('An error occurred while updating the bank')
  }
}

const deleteBank = async (id) => {
  try {
    const response = await fetch(`http://192.168.45.55:8000/api/banks/${id}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    })
    if (response.ok) {
      await fetchBanks()
    } else {
      const data = await response.json()
      alert('Error: ' + (data.error || 'Failed to delete bank'))
    }
  } catch (error) {
    console.error('Error deleting bank:', error)
    alert('An error occurred while deleting the bank')
  }
}

onMounted(fetchBanks)
</script>