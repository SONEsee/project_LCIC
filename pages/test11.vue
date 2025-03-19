<template>
    <v-container>
    <h1 class="text-blue">Utilities Report</h1>
      <!-- References Section -->
      <v-row>
        <v-col cols="2">
          <div class="p-4 bg-gray-200 rounded-lg">
            
            <h4 class="font-weight-black">Consumer Name:</h4>
            <p class="font-weight-black">Enquiry Number: </p>
            <p class="font-weight-black">Province: </p>
            <p class="font-weight-black">Issue Date and Time:</p>


          </div>
        </v-col>
        <v-col cols="6">
          <div class="p-4 bg-gray-200 rounded-lg">
            
            <h4 class="font-weight-black">{{ customerData?.Name || 'N/A' }}</h4>
            <p>{{ referenceData?.[0] || 'N/A' }}</p>
            <p>{{ referenceData?.[1] || 'N/A'}}</p>
            <p>{{ referenceData?.[2] || 'N/A' }}</p>
          </div>
        </v-col>
        <v-col cols="4" class="text-right">
          <div class="p-4 bg-gray-200 rounded-lg">
            <img src="#" alt="Logo" /> <!-- Replace with actual logo path -->
            <h4 >Credit Information</h4>
          </div>
        </v-col>
      </v-row>
  
      <hr>
      <h2 class="text-blue">Consumer Information</h2>
      <!-- Consumer Data Section -->
      <v-row>
        <!-- 8 -->
        <v-col cols="2">
          <div class="p-4 bg-gray-200 rounded-lg">
            <v-col>
              <p class="font-weight-black">Consumer ID: </p>
              <p class="font-weight-black">Company_name: </p>
              <p class="font-weight-black">Name:</p>
              <p class="font-weight-black">Surname:</p>
            </v-col>
          </div>
        </v-col>
        <v-col cols="2">
          <div class="p-4 bg-gray-200 rounded-lg">
        
            <v-col >
              <p >{{ customerData?.Customer_ID || 'N/A' }}</p>
              <p >{{ customerData?.Company_name || 'N/A' }}</p>
              <p >{{ customerData?.Name || 'N/A' }}</p>
              <p >{{ customerData?.Surname || 'N/A' }}</p>
            </v-col>
          </div>
        </v-col>
<!-- 8 -->


        <v-col cols="2">
          <div class="p-4 bg-gray-200 rounded-lg">
            <v-col>
              <p class="font-weight-black">Address: </p>
              <p class="font-weight-black">District_ID: </p>
              <p class="font-weight-black">Tel:</p>
              <p class="font-weight-black">Email:</p>
            </v-col>
          </div>
        </v-col>

        <v-col cols="2">
          <div class="p-4 bg-gray-200 rounded-lg">
        
            <v-col>
              <p >{{ customerData?.Address || 'N/A' }}</p>
              <p >{{ customerData?.Dustrict_ID || 'N/A' }}</p>
              <p >{{ customerData?.Tel || 'N/A' }}</p>
              <p >{{ customerData?.Email || 'N/A' }}</p>
            </v-col>
          </div>
        </v-col>

      </v-row>
  
      <hr>
  
     <!-- Bill Payment Data Table (Horizontal) -->
      <h2 class="text-blue">Payment Data</h2>                                                                                          
    <v-row>
      <v-col>
        <v-table dense>
          <thead>
            <tr>
              <th></th> <!-- Empty cell for row labels -->
              <th v-for="bill in billData" :key="'month-' + bill.BillID">
                {{ bill.InvoiceMonth }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>Invoice Number</th>
              <td v-for="bill in billData" :key="'invoice-' + bill.BillID">
                {{ bill.InvoiceNo }}
              </td>
            </tr>
            <tr>
              <th>Payment ID</th>
              <td v-for="bill in billData" :key="'payment-' + bill.BillID">
                {{ bill.Payment_ID }}
              </td>
            </tr>
            <tr>
              <th>Outstanding Balance</th>
              <td v-for="bill in billData" :key="'outstanding-' + bill.BillID">
                {{ bill.Outstanding }}
              </td>
            </tr>
            <tr>
              <th>Bill Amount</th>
              <td v-for="bill in billData" :key="'bill-' + bill.BillID">
                {{ bill.Bill_Amount }}
              </td>
            </tr>
            <tr>
              <th>Status</th>
              <td v-for="bill in billData" :key="'status-' + bill.BillID">
                {{ bill.Debt_Amount > 0 ? 'Unpaid' : 'Paid' }}
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
    </v-container>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  
  
  const referenceData = ref(null)
  const customerData = ref(null)
  const billData = ref([])
  const config = useRuntimeConfig()
  
  const fetchUtilityReport = async () => {
    try {

        const token = localStorage.getItem('access_token') 
            if (!token) {
            throw new Error('No access token found')
        }
        const response = await axios.get('http://192.168.45.56:8000/api/utility-report/?water=10120879', {
            headers: {
                Authorization: `Bearer ${token}` 
            }
        })
      const data = response.data
      referenceData.value = data.reference_data
      console.log(data.reference_data)
      customerData.value = data.customer[0] 
      billData.value = data.bill
    } catch (error) {
      console.error('Error fetching utility report:', error)
    }
  }
  
 
  onMounted(() => {
    fetchUtilityReport()
  })
  </script>
  
  <style scoped>
  
  </style>