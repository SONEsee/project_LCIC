<script setup lang="ts">
import { useReeportFCRStore } from '~/stores/reportfcr';
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const EnterpriseID = ref(route.query.EnterpriseID as string);
const LCIC_code = ref(route.query.LCIC_code as string);
const CatalogID = ref(route.query.CatalogID as string);

const store = useReeportFCRStore();

// Fetch data when component mounts
onMounted(() => {
  if (EnterpriseID.value && LCIC_code.value && CatalogID.value) {
    store.GetdataReportFCR(EnterpriseID.value, LCIC_code.value, CatalogID.value);
  }
});

const activeLoans = computed(() => store.respon_data_activeloan);
const enterpriseInfo = computed(() => store.respon_data_enterprisinfo);
const investmentInfo = computed(() => store.respon_data_invesinfo);
const searchHistory = computed(() => store.respon_data_searchhistory);
const loanInfo = computed(() => store.respon_data_loaninfo);
</script>

<template>
 test {{ activeLoans }}
  {{ enterpriseInfo }}
  {{ investmentInfo }}
  {{ searchHistory }}
  {{ loanInfo }}
  <div class="report-container">
    <!-- Loading and error states -->
    <div v-if="store.loading" class="loading-state">
      Loading data...
    </div>
    <div v-else-if="store.error" class="error-state">
      Error loading data. Please try again.
    </div>
    
    <!-- Data display when loaded successfully -->
    <div v-else class="data-content">
      <!-- Enterprise Information -->
      <section v-if="enterpriseInfo && enterpriseInfo.length" class="data-section">
        <h2>Enterprise Information</h2>
        <div v-for="(item, index) in enterpriseInfo" :key="'enterprise-'+index" class="data-item">
          <div><strong>Name (ຊື່):</strong> {{ item.enterpriseNameLao }}</div>
          <div><strong>Name (English):</strong> {{ item.eneterpriseNameEnglish }}</div>
          <div><strong>Registration #:</strong> {{ item.regisCertificateNumber }}</div>
          <div><strong>Registration Date:</strong> {{ item.regisDate }}</div>
          <div><strong>Status:</strong> {{ item.status }}</div>
        </div>
      </section>

      <!-- Active Loans -->
      <section v-if="activeLoans && activeLoans.length" class="data-section">
        <h2>Active Loans</h2>
        <div v-for="(loan, index) in activeLoans" :key="'loan-'+index" class="data-item">
          <div><strong>Bank:</strong> {{ loan.bank }}</div>
          <div><strong>Account #:</strong> {{ loan.lon_account_no }}</div>
          <div><strong>Credit Line:</strong> {{ loan.lon_credit_line }} {{ loan.lon_currency_code }}</div>
          <div><strong>Outstanding Balance:</strong> {{ loan.lon_outstanding_balance }} {{ loan.lon_currency_code }}</div>
          <div><strong>Open Date:</strong> {{ new Date(loan.lon_open_date).toLocaleDateString() }}</div>
          <div><strong>Expiration Date:</strong> {{ new Date(loan.lon_exp_date).toLocaleDateString() }}</div>
          <div><strong>Status:</strong> {{ loan.lon_status }}</div>
          <div><strong>Class:</strong> {{ loan.lon_class }}</div>
        </div>
      </section>

      <!-- Investment Information -->
      <section v-if="investmentInfo && investmentInfo.length" class="data-section">
        <h2>Investor Information</h2>
        <div v-for="(investor, index) in investmentInfo" :key="'investor-'+index" class="data-item">
          <div><strong>Name:</strong> {{ investor.investorName }}</div>
          <div><strong>Nationality:</strong> {{ investor.investorNationality }}</div>
          <div><strong>Ownership:</strong> {{ investor.investorOwnerPercentage }}%</div>
          <div><strong>Contact:</strong> {{ investor.investorMobile }}</div>
        </div>
      </section>

      <!-- Search History -->
      <section v-if="searchHistory && searchHistory.length" class="data-section">
        <h2>Search History</h2>
        <div v-for="(history, index) in searchHistory" :key="'history-'+index" class="data-item">
          <div><strong>Date:</strong> {{ new Date(history.id).toLocaleDateString() }}</div>
          <div><strong>Bank Code:</strong> {{ history.bnk_code }}</div>
          <div><strong>Purpose:</strong> {{ history.lon_purpose }}</div>
        </div>
      </section>

      <!-- Loan Information -->
      <section v-if="loanInfo && loanInfo.length" class="data-section">
        <h2>Loan History</h2>
        <div v-for="(loan, index) in loanInfo" :key="'loaninfo-'+index" class="data-item">
          <div><strong>Bank Code:</strong> {{ loan.bnk_code }}</div>
          <div><strong>Loan Type:</strong> {{ loan.lon_type }}</div>
          <div><strong>Credit Line:</strong> {{ loan.lon_credit_line }} {{ loan.lon_currency_code }}</div>
          <div><strong>Outstanding Balance:</strong> {{ loan.lon_outstanding_balance }} {{ loan.lon_currency_code }}</div>
          <div><strong>Class:</strong> {{ loan.lon_class }}</div>
          <div><strong>Status:</strong> {{ loan.lon_status }}</div>
        </div>
      </section>

      <!-- No data message -->
      <div v-if="!activeLoans?.length && !enterpriseInfo?.length && !investmentInfo?.length && !searchHistory?.length && !loanInfo?.length" class="no-data">
        No data available for this enterprise.
      </div>
    </div>
  </div>
</template>

<style scoped>
.report-container {
  padding: 20px;
  font-family: 'Phetsarath OT', Arial, sans-serif;
}

.loading-state, .error-state {
  text-align: center;
  padding: 40px;
  font-size: 18px;
}

.data-section {
  margin-bottom: 30px;
  padding: 15px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.data-section h2 {
  color: #0066cc;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
  margin-bottom: 15px;
}

.data-item {
  margin-bottom: 15px;
  padding: 10px;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.no-data {
  text-align: center;
  padding: 40px;
  color: #666;
  font-style: italic;
}
</style>