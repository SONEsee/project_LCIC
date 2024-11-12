<template>
  <div class="filter-container">
    <v-row>
      <!-- Bank filter (fetched from API) -->
      <v-col cols="12" md="3">
        <v-combobox
          v-model="selectedBank"
          :items="formattedBanks"
          label="ສະມາຊິກ"
          dense
          outlined
          hide-details
          item-value="id"
          item-title="title"
          class="custom-select"
          return-object
          @change="logSelectedBank"
        />
      </v-col>

      <!-- From Date filter -->
      <v-col cols="12" md="2">
        <v-text-field
          v-model="fromDate"
          label="ຈາກ"
          type="date"
          dense
          outlined
          class="custom-select"
        />
      </v-col>

      <!-- To Date filter -->
      <v-col cols="12" md="2">
        <v-text-field
          v-model="toDate"
          label="ຫາ"
          type="date"
          dense
          outlined
          class="custom-select"
        />
      </v-col>

      <!-- Month filter -->
      <v-col cols="12" md="2">
        <v-select
          v-model="selectedMonth"
          :items="months"
          label="ເດືອນ"
          dense
          outlined
          hide-details
          class="custom-select"
        />
      </v-col>

      <!-- Year filter -->
      <v-col cols="12" md="2">
        <v-combobox
          v-model="selectedYear"
          :items="years"
          label="ປິ"
          dense
          outlined
          hide-details
          class="custom-select"
        />
      </v-col>

      <!-- Apply Filter button -->
      <v-col cols="12" md="1">
        <v-btn color="primary" class="text-right" @click="applyFilters" dense>
          ຄົ້ນຫາ
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import ReportFilter from '@/types/search';

export default {
  data() {
    return {
      selectedBank: null as ReportFilter | null,
      selectedMonth: null,
      selectedYear: null,
      fromDate: '', 
      toDate: '', 
      banks: [] as ReportFilter[],
      months: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'], 
      years: this.getYears(),
    };
  },
  computed: {
    formattedBanks() {
      return this.banks.map(bank => ({
        id: bank.id,
        bnk_code: bank.bnk_code,
        title: `${bank.bnk_code} - ${bank.code} - ${bank.nameL}`,
      }));
    },
  },
  methods: {
    async fetchBanks() {
      try {
        const config = useRuntimeConfig();
        const response = await fetch(`${config.public.strapi.url}api/memberinfo/`);
        const data = await response.json();
        this.banks = data; 
      } catch (error) {
        console.error('Error fetching banks:', error);
      }
    },

    getYears() {
      const currentYear = new Date().getFullYear();
      const startYear = currentYear - 12;
      const years = [];

      for (let year = currentYear; year >= startYear; year--) {
        years.push(year);
      }

      return years;
    },

    logSelectedBank() {
      console.log('Selected Bank:', this.selectedBank);
    },

    applyFilters() {
      const filters = {
        bank: this.selectedBank?.bnk_code || null,
        month: this.selectedMonth,
        year: this.selectedYear,
        fromDate: this.fromDate,
        toDate: this.toDate,
      };
      const bnk_name = {
        bank: this.selectedBank,
      };
      console.log('Applied filters:', filters);
      this.$emit('handfilter-applied', bnk_name); 
      this.$emit('filter-applied', filters);

      this.selectedBank = null; 
      this.selectedMonth = null; 
      this.selectedYear = null; 
      this.fromDate = ''; 
      this.toDate = ''; 
    },

    setDefaultDates() {
      const today = new Date();
      const formattedDate = today.toISOString().split('T')[0]; // Formats to YYYY-MM-DD
      this.fromDate = formattedDate;
      this.toDate = formattedDate;
    },
  },

  mounted() {
    this.setDefaultDates(); // Set default dates to today
    this.fetchBanks();
  },
};
</script>

  
  <style scoped>
  /* Custom styles for the select fields */
  .custom-select {
    height: 40px !important; /* Make the height thinner */
    border-radius: 10px !important; /* Set border-radius */
  }
  
  .custom-select .v-input__control {
    border-bottom: none !important; /* Remove border-bottom */
  }
  
  .custom-select .v-input {
    padding: 0 !important; /* Remove extra padding */
  }
  
  .custom-select .v-field {
    height: 40px !important; /* Make the field height thinner */
    border-radius: 10px !important; /* Set border radius */
    border-color: transparent !important; /* Remove bottom border color */
  }
  
  .custom-select .v-field--outlined {
    border: 1px solid #ccc !important; /* Optional: add a subtle border */
    border-radius: 10px !important;
  }
  
  .filter-container {
    margin: 10px 0;
    margin-top: 1%;
    border-radius: 12px;
    padding: 25px;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border: 1px solid #ddd;
  }
  
  .text-right {
    width: 100%;
  }
  </style>
  