<template>
    <div>
      <h2 class="head-user">ລາຍງານການຄົ້ນຫາ</h2>
  
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
            <p class="text-highlight">ຈໍານວນການຄົ້ນຫາທັງໝົດ : {{ totalRecordCountSearchLog }}</p>  
          </v-col>
          <v-col class="text-center">
            <p class="text-highlight">ຈໍານວນພິມບົດລາຍງານທັງໝົດ : {{ totalRecordCountChargeLog }} </p>
          </v-col>
        </v-row>
      </div>
  
      <div class="table-data">
        <v-data-table
          :headers="headers"
          :items="charge_report"
          class="elevation-1"
        >
          <template v-slot:item.searchlog_count="{ item }">
            <a :href="generateLinkSearchLog(item.bnk_code)">
              <v-btn color="primary">{{ item.searchlog_count }}</v-btn>
            </a>
          </template>
          <template v-slot:item.request_log="{ item }">
            <a :href="generateLinkRequestCharge(item.bnk_code)">
              <v-btn color="primary">{{ item.request_log }}</v-btn>
            </a>
          </template>
        </v-data-table>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  
  import { ref, computed } from 'vue';
  import Swal from 'sweetalert2';
  
  definePageMeta({
    middleware: 'auth',
    layout: 'backend',
  });
  
  export default {
    components: {
    //   ReportFilter,
    },
    data() {
      return {
        charge_report: [],
        searchlog:[],
        selectedBankName: '',
        selectedBank: null,
        showFilter: false,
        filters: {}, // Store filter values here
        headers: [
          { title: 'ລະຫັດທນຄ', value: 'bnk_code' },
          { title: 'ຊື່ທະນາຄານ', value: 'Bank_short_form' },
          { title: 'ຈໍານວນການຄົ້ນຫາ', value: 'searchlog_count' },
          { title: 'ຈໍານວນພິມບົດລາຍງານ', value: 'request_log' },
        ],
      };
    },
    computed: {
  
      totalRecordCountSearchLog() {
      const chargeReport = this.charge_report; 
      if (!Array.isArray(chargeReport)) return 0;
      
      const total = chargeReport.reduce((sum, item) => sum + (item.searchlog_count || 0), 0);
      return total;
    },
  
      totalRecordCountChargeLog() {
        const chargeReport = this.charge_report; 
        if (!Array.isArray(chargeReport)) return 0;
        
        const total = chargeReport.reduce((sum, item) => sum + (item.request_log || 0), 0);
        return total;
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
      generateLinkSearchLog(bankCode) {
        // Generate the dynamic link based on current filter values
        const { month, year, fromDate, toDate } = this.filters;
        return `/countsearch?bank=${bankCode}&month=${month ?? ''}&year=${year ?? ''}&fromDate=${fromDate ?? ''}&toDate=${toDate ?? ''}`;
      },
      generateLinkRequestCharge(bankCode) {
        // Generate the dynamic link based on current filter values
        const { month, year, fromDate, toDate } = this.filters;
        return `/reportcount?bank=${bankCode}&month=${month ?? ''}&year=${year ?? ''}&fromDate=${fromDate ?? ''}&toDate=${toDate ?? ''}`;
      },
      async fetchCharge() {
        try {
          const config = useRuntimeConfig();
          const response = await fetch(`${config.public.strapi.url}api/log_report/`);
          if (!response.ok) throw new Error('Network response was not ok');
  
          const data = await response.json();
          this.charge_report = data.charge_report || [];
          this.searchlog = data.searchlog || [];
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
          const url = new URL(`${config.public.strapi.url}api/log_report/`);
          if (bank) url.searchParams.append('bank', bank);
          if (month) url.searchParams.append('month', month);
          if (year) url.searchParams.append('year', year);
          if (fromDate) url.searchParams.append('fromDate', fromDate);
          if (toDate) url.searchParams.append('toDate', toDate);
  
          const response = await fetch(url.toString());
          if (!response.ok) throw new Error('Network response was not ok');
  
          const data = await response.json();
          this.charge_report = data.charge_report;
          console.log("-------->", this.charge_report);
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
  