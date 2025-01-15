<template>
    <div>
      <h2 class="head-user">ລາຍງານຄ່າທໍານຽມ</h2>
  
      <ChargeReportFilter
        @handfilter-applied="handleFilterApplied"
        @filter-applied="fetchChargeReport"
      />
      <div class="table-summary border-md">
        <v-row class="justify-space-between align-center" style="height: 60px;">
          <v-col class="text-center">
            <p v-if="selectedBank" class="text-highlight"> ສະມາຊິກ : {{ selectedBank.title }}</p>
            <p v-else class="text-highlight">ສະມາຊິກ: ທັງໝົດ</p>
          </v-col>      
          <v-col class="text-center">
            <p class="text-highlight">ຄ່າທໍານຽມທັງໝົດ : {{ totalChargeAmount }} ກີບ</p>
          </v-col>
          <v-col class="text-center">
            <p class="text-highlight">ຈໍານວນທັງໝົດ : {{ totalRecordCount }} </p>
          </v-col>
        </v-row>
      </div>
  
      <div class="table-data">
        <v-data-table
          :headers="headers"
          :items="summary"
          class="elevation-1"
        >
        <template v-slot:header.bnk_code="{ column }" >
            <p style="color: #01579B;">{{ column.title }}</p>
          </template>
        <template v-slot:header.bank_name="{ column }" >
            <p style="color: #01579B;">{{ column.title }}</p>
          </template>
        <template v-slot:header.total_records="{ column }" >
            <p style="color: #01579B;">{{ column.title }}</p>
          </template>
        <template v-slot:header.total_chg_amount="{ column }" >
            <p style="color: #01579B;">{{ column.title }}</p>
          </template>
        <template v-slot:header.actions="{ column }" >
            <p style="color: #01579B;">{{ column.title }}</p>
          </template>

       
          <template v-slot:item.total_chg_amount="{ item }">
            {{ formatCurrency(item.total_chg_amount) }}
          </template>
          <template v-slot:item.actions="{ item }">
            <a :href="generateLink(item.bnk_code)">
              <v-btn color="primary">ລາຍລະອຽດ</v-btn>
            </a>
          </template>
        </v-data-table>
      </div>
    </div>
  </template>
  
  <script lang="ts">
//   import ReportFilter from '@/components/ReportFilter.vue';
  import { ref, computed } from 'vue';
  import Swal from 'sweetalert2';
  
  definePageMeta({
    middleware: 'auth',
    layout: 'backend',
  });
  
  export default {
    // components: {
    //   ReportFilter,
    // },
    data() {
      return {
        summary: [],
        selectedBankName: '',
        selectedBank: null,
        showFilter: false,
        filters: {}, // Store filter values here
        headers: [
          { title: 'ລະຫັດທນຄ', value: 'bnk_code' },
          { title: 'ຊື່ທະນາຄານ', value: 'bank_name' },
          { title: 'ຈໍານວນການຄົ້ນຫາ', value: 'total_records' },
          { title: 'ຄ່າທໍານຽມທັງໝົດ', value: 'total_chg_amount' },
          { title: 'Actions', value: 'actions', sortable: false },
        ],
      };
    },
    computed: {
      totalChargeAmount() {
        const total = this.summary.reduce((sum, item) => sum + (item.total_chg_amount || 0), 0);
        return new Intl.NumberFormat('en-US', {
          style: 'decimal',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(total);
      },
      totalRecordCount() {
        return this.summary.length;
      },
    },
    async mounted() {
      await this.fetchCharge();
    },
    methods: {
      handleFilterApplied(bnk_name) {
        this.selectedBank = bnk_name.bank || null;
        console.log('Selected Bank in test3.vue:', this.selectedBank);
      },  
      // generateLink(bankCode) {
      //   // Generate the dynamic link based on current filter values
      //   const { month, year, fromDate, toDate } = this.filters;
      //   return `/chargedetai?bank=${bankCode}&month=${month ?? ''}&year=${year ?? ''}&fromDate=${fromDate ?? ''}&toDate=${toDate ?? ''}`;
      // },
      generateLink(bankCode) {
  const { month, year, fromDate, toDate } = this.filters || {};
  return `/chargedetail?bank=${bankCode}&month=${month || ''}&year=${year || ''}&fromDate=${fromDate || ''}&toDate=${toDate || ''}`;
},
      async fetchCharge() {
        try {
          const config = useRuntimeConfig();
          const response = await fetch(`${config.public.strapi.url}api/charge_report/summary/`);
          if (!response.ok) throw new Error('Network response was not ok');
  
          const data = await response.json();
          this.summary = data.summary || [];
        } catch (error) {
          console.error('Error fetching charge reports:', error);
          Swal.fire('Error', 'Failed to fetch charge reports', 'error');
        }
      },
      async fetchChargeReport(filters) {
        try {
          this.filters = filters;  // Save filters to data property
  
          const { bank, month, year, fromDate, toDate } = filters;
          const config = useRuntimeConfig();
          const url = new URL(`${config.public.strapi.url}api/charge_report/summary/`);
          if (bank) url.searchParams.append('bank', bank);
          if (month) url.searchParams.append('month', month);
          if (year) url.searchParams.append('year', year);
          if (fromDate) url.searchParams.append('fromDate', fromDate);
          if (toDate) url.searchParams.append('toDate', toDate);
  
          const response = await fetch(url.toString());
          if (!response.ok) throw new Error('Network response was not ok');
  
          const data = await response.json();
          this.summary = data.summary;
          console.log("-------->", this.summary);
        } catch (error) {
          console.error('Error fetching charge reports:', error);
        }
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