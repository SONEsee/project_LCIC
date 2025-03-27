<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import { useUtilityStore } from "@/stores/utility";
const respons = useUtilityStore();
const res = computed(() => respons.respons_query_data_utility);
const utility = computed(() => respons.respons_query_data_customer);
const billData = computed(() => respons.respons_query_data_bill);
const referenceData = computed(() => respons.respons_query_data_reference);

onMounted(() => {
  respons.Getdata();
});

const formatNumber = (value) => {
  if (value === undefined || value === null) return "0";
  return new Intl.NumberFormat('lo-LA').format(value);
};

const getPaymentStatus = (bill) => {
  return bill.Debt_Amount == 0 ? "ຈ່າຍແລ້ວ" : "ຍັງບໍ່ຈ່າຍ";
};

const printReport = () => {
  window.print();
};
</script>

<template>
  <section class="report-container">
    <!-- Print button - will not show when printing -->
    <div class="no-print ">
      <v-btn color="primary" @click="printReport">
        <v-icon>mdi-printer</v-icon> ພິມບົດລາຍງານ
      </v-btn>
    </div>

    <!-- Report header -->
    <div class="report-header">
      <div class="header-left">
        <h3>ທະນາຄານ ແຫ່ງ ສປປ ລາວ</h3>
        <p>ບໍລີສັດ ຂໍ້ມູນຂາວສານສິນເຊື່ອແຫ່ງ ສປປ ລາວ</p>
      </div>
      <div class="header-center">
        <h2>ບົດລາຍງານ</h2>
        <h3>ສາທາລະນູປະໂພກ</h3>
      </div>
      <div class="header-right" v-if="referenceData">
        <p>ເລກທີ: <span class="reference-number">{{ referenceData?.[0] || "ຍັງບໍ່ມີຂໍ້ມູນໃສ່" }}</span></p>
        <p>ນະຄອນຫຼວງວຽງຈັນ, ວັນທີ: {{ referenceData?.[2] || "N/A" }}</p>
      </div>
    </div>

    <!-- Customer information -->
    <div class="customer-info" v-for="item in utility" :key="item.Customer_ID">
      <div class="info-row">
        <div class="info-col">
          <p>ຊື່ລູກຄ້າ: <b>{{ item.Name }}</b></p>
        </div>
        <div class="info-col">
          <p>Enquiry Number: <b>{{ referenceData?.[0] || "N/A" }}</b></p>
        </div>
        <div class="info-col">
          <p>Customer ID: <b>{{ referenceData?.[1] || "N/A" }}</b></p>
        </div>
      </div>
    </div>

    <!-- Customer details box -->
    <div class="customer-details-box">
      <div class="details-row" v-for="item in utility" :key="item.Customer_ID">
        <div class="details-col">
          <p>ລະຫັດລູກຄ້າ: <b>{{ item.Customer_ID }}</b></p>
          <p v-if="item.Company_name">
            ຊື່ບໍລິສັດ: <b>{{ item.Company_name }}</b>
          </p>
        </div>
        <div class="details-col">
          <p>ເບີ້ໂທ: <b>{{ item.Tel }}</b></p>
          <p>ເມວ: <b>{{ item.Email || "N/A" }}</b></p>
        </div>
        <div class="details-col">
          <p>ທີ່ຢູ່: <b>{{ item.Address }}</b></p>
        </div>
      </div>
    </div>

    <!-- Payment information -->
    <div class="payment-info">
      <h3>ຂໍ້ມູນການຊຳລະ</h3>
      <table class="payment-table">
        <thead>
          <tr>
            <th class="first-col"></th>
            <th v-for="bill in billData" :key="'month-' + bill.BillID">
              {{ bill.InvoiceMonth }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th class="first-col">ເລກທີ ໃບບິນ</th>
            <td v-for="bill in billData" :key="'invoice-' + bill.BillID">
              {{ bill.InvoiceNo }}
            </td>
          </tr>
          <tr>
            <th class="first-col">ລະຫັດການຊຳລະ</th>
            <td v-for="bill in billData" :key="'payment-' + bill.BillID">
              {{ bill.Payment_ID }}
            </td>
          </tr>
          <tr>
            <th class="first-col">ຍອດເຫຼືອ</th>
            <td v-for="bill in billData" :key="'outstanding-' + bill.BillID">
              {{ formatNumber(bill.Outstanding) }}
            </td>
          </tr>
          <tr>
            <th class="first-col">ຈຳນວນເງິນທັງໝົດ</th>
            <td v-for="bill in billData" :key="'bill-' + bill.BillID">
              {{ formatNumber(bill.Bill_Amount) }}
            </td>
          </tr>
          <tr>
            <th class="first-col">ສະຖານະ</th>
            <td v-for="bill in billData" :key="'status-' + bill.BillID" 
                :class="getPaymentStatus(bill) === 'ຈ່າຍແລ້ວ' ? 'paid-status' : 'unpaid-status'">
              {{ getPaymentStatus(bill) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Signature section -->
    <div class="signature-section">
      <div class="signature-block">
        <p>ພະນັກງານລາຍງານ</p>
        <div class="signature-line"></div>
        <p>ວັນທີ: _______________</p>
      </div>
      <div class="signature-block">
        <p>ຫົວໜ້າໜ່ວຍງານ</p>
        <div class="signature-line"></div>
        <p>ວັນທີ: _______________</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* General styles */
.report-container {
  font-family: 'Phetsarath OT', 'Saysettha OT', Arial, sans-serif;
  max-width: 210mm; /* A4 width */
  min-height: 297mm; /* A4 height */
  margin: 0 auto;
  padding: 20mm 15mm;
  background-color: white;
  box-sizing: border-box;
  position: relative;
}

/* Print button */
.print-button-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 999;
}

/* Header styles */
.report-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.header-left, .header-right {
  flex: 1;
}

.header-center {
  flex: 1;
  text-align: center;
}

.header-center h2 {
  font-size: 20px;
  margin: 0 0 5px 0;
}

.header-center h3 {
  font-size: 18px;
  margin: 0;
}

.header-left h3 {
  font-size: 16px;
  margin: 0 0 5px 0;
}

.header-left p, .header-right p {
  margin: 5px 0;
}

.header-right {
  text-align: right;
}

.reference-number {
  color: #1565c0;
  font-weight: bold;
}

/* Customer info */
.customer-info {
  margin: 20px 0;
}

.info-row {
  display: flex;
  flex-wrap: wrap;
}

.info-col {
  flex: 1;
  min-width: 200px;
}

/* Customer details box */
.customer-details-box {
  border: 1px solid #1565c0;
  border-radius: 8px;
  padding: 15px;
  margin: 20px 0;
}

.details-row {
  display: flex;
  flex-wrap: wrap;
}

.details-col {
  flex: 1;
  min-width: 200px;
}

/* Payment table */
.payment-info {
  margin: 30px 0;
}

.payment-info h3 {
  margin-bottom: 10px;
  color: #1565c0;
}

.payment-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.payment-table th, .payment-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}

.payment-table th {
  background-color: #f2f2f2;
}

.first-col {
  text-align: left;
  width: 150px;
}

/* Status styling */
.paid-status {
  color: green;
  font-weight: bold;
}

.unpaid-status {
  color: red;
  font-weight: bold;
}

/* Signature section */
.signature-section {
  display: flex;
  justify-content: space-between;
  margin-top: 100px;
}

.signature-block {
  text-align: center;
  width: 200px;
}

.signature-line {
  margin: 50px 0 10px 0;
  border-bottom: 1px solid #000;
}

/* Print specific styles */
@media print {
  .no-print {
    display: none !important;
  }
  
  .report-container {
    padding: 0;
    margin: 0;
    width: 210mm;
    height: 297mm;
  }
  
  body {
    margin: 0;
    padding: 0;
  }
  
  @page {
    size: A4;
    margin: 15mm;
  }
}
</style>