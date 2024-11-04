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
            variant="outlined"
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
            variant="outlined"
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
            variant="outlined"
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
  
  export default {
    data() {
      return {
        selectedBank: null,
        selectedMonth: null,
        selectedYear: null,
        fromDate: null,
        toDate: null,
        banks: [], // Use an array instead of ref([]) for simplicity
        months: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'], // Example months
        years: this.getYears(), // Dynamically generate the years array
      };
    },
    computed: {
  formattedBanks() {
    return this.banks.map(bank => ({
      id: bank.id,
      bnk_code: bank.bnk_code,  // Ensure bnk_code is part of the object
      title: `${bank.bnk_code} - ${bank.code} - ${bank.nameL}`,
    }));
  },
},

    methods: {
      // Method to fetch banks from API
      async fetchBanks() {
        try {
          const config = useRuntimeConfig();
          const response = await fetch(`${config.public.strapi.url}api/memberinfo/`);
          const data = await response.json();
          this.banks = data; // Assign directly to banks
        } catch (error) {
          console.error('Error fetching banks:', error);
        }
      },
  
      // Method to generate an array with the current year and 12 years before
      getYears() {
        const currentYear = new Date().getFullYear(); // Get the current year
        const startYear = currentYear - 12; // Calculate the start year
        const years = [];
  
        for (let year = currentYear; year >= startYear; year--) {
          years.push(year); // Add each year to the array
        }
  
        return years; // Return the dynamically created years array
      },
  
      // Emit the selected bank to the parent component
      logSelectedBank() {
        console.log('Selected Bank:', this.selectedBank);
      },
  
      applyFilters() {
  // console.log('Selected Bank before applying filters:', this.selectedBank.title);
  const filters = {
    bank: this.selectedBank?.bnk_code || null,
    // bank: this.selectedBank === "all_bank" ? "all_bank" : this.selectedBank?.bnk_code,
    month: this.selectedMonth,
    year: this.selectedYear,
    fromDate: this.fromDate,
    toDate: this.toDate,
  };
  const bnk_name = {
    bank:this.selectedBank,
  }
  console.log('Applied filters:', filters);
  this.$emit('handfilter-applied', bnk_name); 
  this.$emit('filter-applied', filters);

  this.selectedBank = null; // Resets the bank filter
  this.selectedMonth = null; // Resets the month filter
  this.selectedYear = null; // Resets the year filter
  this.fromDate = null; // Resets the from date
  this.toDate = null; // Resets the to date

}

    },
    // Fetch the banks when the component is mounted
    async mounted() {
      await this.fetchBanks();
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
  