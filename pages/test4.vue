<template>
  <v-data-table-server
    v-model:items-per-page="itemsPerPage"
    :headers="headers"
    :items="data"
    :items-length="totalItems"
    :loading="loading"
    item-value="name"
    @update:options="loadItems"
  ></v-data-table-server>
  <div>
    <div v-if="error">
      <p>Error: {{ error }}</p>
    </div>
    <div v-else-if="data && data.length === 0">
      <p>No data available.</p>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue'
import Swal from 'sweetalert2'

definePageMeta({
  middleware: 'auth',
  layout: 'backend',
})

export default {
  setup() {
    const data = ref([])
    const error = ref(null)
    const loading = ref(false)
    const itemsPerPage = ref(10)
    const totalItems = ref(0)
    const apiUrl = `http://202.137.141.244:3000/v3/api/loans/allbillmonth/102024`
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6IlUyRnNkR1ZrWDErdE9ja29vVDV0NXdqWlBqTzhVc0V1ZnR2QytPUXp3Z2ljWkFPdkhNUkNqdzh0NUhOSENBRVZsVXVNWHBrc1RudUFxaUE3R0VtVExRSTZMaWNTVUlaN1BMb0xGOVczMWtjWnFoQmxFUThHVUFwSFpNS0NDVjN1RURhWDJSSjFwZDNqaFRGc2lmdUF3Zz09IiwiaWF0IjoxNzA5MDEwNjU0fQ.mhmfUuasPQnAtxTQmwIyofClMuOAKVKZloNskpG9fHo'
    const fetchData = async (page = 1, perPage = 10) => {
  loading.value = true
  try {
   
    const response = await fetch(`${apiUrl}?page=${page}&perPage=${perPage}`, {
      headers: {
        'Auth': `${token}`,
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`)
    }

  
    const jsonData = await response.json()
    data.value = jsonData.message || []
    totalItems.value = jsonData.totalItems || data.value.length 

    if (!data.value.length) {
      console.log("No items returned from API")
    }
  } catch (err) {
    error.value = err.message
    Swal.fire('Error', error.value, 'error')
  } finally {
    loading.value = false
  }
}

 
    onMounted(() => fetchData())

   
    const loadItems = ({ page, itemsPerPage }) => {
      fetchData(page, itemsPerPage)
    }

    return { data, error, loading, itemsPerPage, totalItems, loadItems }
  },
}
</script>

<style scoped>

</style>
