<template>
  <div class="text-primary">
    <h2 class="head-user">ລາຍງານຄ່າທໍານຽມ</h2>

    <div class="table-summary border-md">
      <v-row class="justify-space-between align-center" style="height: 60px;">
        <v-col class="text-center">
          <p v-if="bankName" class="text-highlight"> ສະມາຊິກ : {{  bankName }}</p>
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
        :items="charge"
        class="elevation-1"
      >
      <template v-slot:header.bnk_code="{ column }" >
          <p style="color: #01579B;">{{ column.title }}</p>
        </template>
      <template v-slot:header.LCIC_ID="{ column }" >
          <p style="color: #01579B;">{{ column.title }}</p>
        </template>
      <template v-slot:header.chg_code="{ column }" >
          <p style="color: #01579B;">{{ column.title }}</p>
        </template>
      <template v-slot:header.user_sys_id="{ column }" >
          <p style="color: #01579B;">{{ column.title }}</p>
        </template>
      <template v-slot:header.chg_amount="{ column }" >
          <p style="color: #01579B;">{{ column.title }}</p>
        </template>
      <template v-slot:header.rec_insert_date="{ column }" >
          <p style="color: #01579B;">{{ column.title }}</p>
        </template>
        <template v-slot:item.rec_insert_date="{ item }">
          {{ formatDate(item.rec_insert_date) }}
        </template>
        <template v-slot:item.chg_code="{ item }">
          {{ getChargeDescription(item.chg_code) }}
        </template>
        <template v-slot:item.chg_amount="{ item }">
          {{ formatCurrency(item.chg_amount) }}
        </template>
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
      charge: [],
      selectedBank: null,
      bankInfo: { title: 'ທະນາຄານ', value: 'bnk_code' },
      headers: [
        { title: 'ທະນາຄານ', value: 'bnk_code' },
        { title: 'ຊື່ຜູ້ຖືກຖາມ', value: 'LCIC_ID' },
        { title: 'ຊື່ບົດລາຍງານ', value: 'chg_code' },
        { title: 'ລະຫັດຜູ້ນໍາໃຊ້', value: 'user_sys_id' },
        { title: 'ຄ່າທໍານຽມ', value: 'chg_amount' },
        { title: 'ວັນທີ', value: 'rec_insert_date' },
      ],
    };
  },
  computed: {
    totalChargeAmount() {
      const total = this.charge.reduce((sum, item) => sum + (item.chg_amount || 0), 0);
      return new Intl.NumberFormat('en-US', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(total);
    },  
    bankName() {
      // Check if charge and bnk_code exist before accessing
      return this.charge[this.bankInfo.value] ? this.charge[this.bankInfo.value] : null;
    },
    totalRecordCount() {
      return this.charge.length;
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
        const url = new URL(`${config.public.strapi.url}api/charge_report/`);

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

        // Update charge only if the API response contains charge data
        if (data && data.charge) {
          this.charge = data.charge;
        } else {
          console.warn('No charge data found in response:', data);
          this.charge = []; 
        }
      } catch (error) {
        console.error('Error fetching charge reports:', error);
      }
    },

    formatDate(dateStr: string): string {
      const date = new Date(dateStr);
      return date.toLocaleDateString();
    },
    getChargeDescription(chg_code) {
      switch (chg_code) {
        case 'FCR':
          return 'ບົດລາຍງານສິນເຊື່ອຄົບຖ້ວນສໍາລັບນິຕິບຸກຄົນ';
        case 'FCRFI':
          return 'ບົດລາຍງານສິນເຊື່ອຄົບຖ້ວນສໍາລັບນິຕິບຸກຄົນ';
        default:
          return chg_code; 
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
