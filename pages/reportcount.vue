<template>
    <div>
      <h2 class="head-user">ລາຍງານການຄົ້ນຫາ</h2>
  
      <div class="table-summary border-md">
        <v-row class="justify-space-between align-center" style="height: 60px;">
          <v-col class="text-center">
            <p v-if="bankName" class="text-highlight"> ສະມາຊິກ : {{   }}</p>
            <p v-else class="text-highlight">ສະມາຊິກ: ທັງໝົດ</p>
          </v-col>      
          <v-col class="text-center">
            <p class="text-highlight">ຈໍານວນການຄົ້ນຫາທັງໝົດ : {{  }} </p>
          </v-col>
          <v-col class="text-center">
            <p class="text-highlight">ຈໍານວນພິມບົດລາຍງານທັງໝົດ : {{ totalRecordCount }} </p>
          </v-col>
        </v-row>
      </div>
  
      <div class="table-data">
        <v-data-table
          :headers="headers"
          :items="request_charge"
          class="elevation-1"
        >
        </v-data-table>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import Swal from 'sweetalert2';
  import { useRoute } from 'vue-router';
  
  definePageMeta({
    middleware: 'auth',
    layout: 'backend',
  });
  
  export default {
    data() {
      return {
        request_charge: [],
        selectedBank: null,
        bankInfo: { title: 'ທະນາຄານ', value: 'bnk_code' },
        headers: [
          { title: 'ລະຫັດ', value: 'rec_charge_ID' },
          { title: 'ລະຫັດຜຸ້ໃຊ້', value: 'sys_usr' },
          { title: 'ຊື່ທະນາຄານ', value: 'bnk_code' },
          { title: 'ຄົ້ນຫາ', value: 'lcic_id' },
          { title: 'ວັນທີ່', value: 'rec_insert_date' },
        ],
      };
    },
    computed: {
      totalRecordCount() {
        return this.request_charge.length;
      },
    },
    async mounted(): Promise<void> {
      await this.fetchChargeReportFromQueryParams();
    },
    methods: {
      async fetchChargeReportFromQueryParams() {
        const route = useRoute();
        const filters = {
          bank: route.query.bank,
          month: route.query.month,
          year: route.query.year,
          fromDate: route.query.fromDate,
          toDate: route.query.toDate,
        };
  
        console.log("Query Params",{
          bank: route.query.bank,
          month: route.query.month,
          year: route.query.year,
          fromDate: route.query.fromDate,
          toDate: route.query.toDate,
        });
        
        await this.fetchChargeReport(filters);
      },
  
      async fetchChargeReport(filters) {
    try {
      const { bank, month, year, fromDate, toDate } = filters;
      const config = useRuntimeConfig();
      
      // Construct the API URL with query parameters
      const url = new URL(`${config.public.strapi.url}api/log_report/detail/`);
  
      // Append query parameters only if they are not 'null' or invalid
      if (bank) url.searchParams.append('bank', bank ?? '');
      if (month && month !== 'null') url.searchParams.append('month', month ?? ''); // Ensure it's not 'null'
      if (year && year !== 'null') {
          url.searchParams.append('year', year ?? '');
      } else {
          console.log("Year is invalid:", year);
      }
  
      if (fromDate && fromDate !== 'null') {
          url.searchParams.append('fromDate', fromDate ?? '');
      } else {
          console.log("From Date is invalid:", fromDate);
      }       
      
      if (toDate && toDate !== 'null') {
          url.searchParams.append('toDate', toDate ?? '');
      } else {
          console.log("To Date is invalid:", toDate);
      }
  
      const response = await fetch(url.toString());
      const data = await response.json();
  
      console.log("Final API Call:", url.toString()); // Final API URL
      console.log("Raw API Response:", data); // Log raw data
      console.log("From Date:", fromDate);
      console.log("To Date:", toDate);
      try {
          const response = await fetch(url);
          const data = await response.json();
          console.log("API Response:", data);
      } catch (error) {
          console.error("Error fetching data:", error);
      }
  
      if (data && data.request_charge) {
        this.request_charge = data.request_charge;
      } else {
        console.warn('No charge data found in response:', data);
        this.request_charge = []; // Set to empty array if data.charge is missing
      }
    } catch (error) {
      console.error('Error fetching charge reports:', error);
    }
  },
      formatDate(dateStr: string): string {
        const date = new Date(dateStr);
        return date.toLocaleDateString();
      },
      
      formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(amount);
      },
    },
  };
  </script>
  
  <style scoped>
  .table-data {
    margin-top: 1%;
    border-radius: 15px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
  
  .table-summary {
    margin-top: 1%;
    border-radius: 12px;
    padding: 10px;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .border-md {
    border: 1px solid #ddd;
    padding: 10px;
    border-radius: 10px;
  }
  
  .text-center {
    text-align: center;
  }
  .text-highlight{
    font-weight: bold;
  
  }
  
  .header-hightlight{
    background-color: rgb(212, 232, 255);
  }
  </style>
  
  