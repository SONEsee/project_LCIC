<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { useUtilityStore } from "@/stores/utility";
import VueApexCharts from "vue3-apexcharts";

const utilityStore = useUtilityStore();

const utilityData = computed(() => utilityStore.respons_query_data_utility);
const customerData = computed(() => utilityStore.respons_query_data_customer);
const referenceData = computed(() => utilityStore.respons_query_data_reference);

const billData = computed(() => {
  const bills = utilityStore.respons_query_data_bill || [];
  return [...bills]
    .sort((a, b) => b.InvoiceMonth.localeCompare(a.InvoiceMonth))
    .slice(0, 12);
});

const series = computed(() => [
  {
    name: "ຍອດຍົກມາ",
    group: "amount",
    data: billData.value.map((bill) => Number(bill.Outstanding) || 0),
  },
  {
    name: "ລວມເງິນທີ່ຕອ້ງຈ່າຍ",
    group: "amount",
    data: billData.value.map((bill) => Number(bill.Bill_Amount) || 0),
  },
  {
    name: "ຈຳນວນເງິນທີ່ຈ່າຍ",
    group: "amount",
    data: billData.value.map((bill) => Number(bill.Basic_Tax) || 0),
  },
]);

const chartOptions = computed(() => ({
  chart: {
    type: "bar",
    height: 480,
    stacked: false,
    fontFamily: "'Noto Sans Lao', sans-serif",
    background: "#f8f9fa",
    toolbar: {
      show: true,
      tools: {
        download: true,
        selection: false,
        zoom: false,
        zoomin: false,
        zoomout: false,
        pan: false,
        reset: false,
      },
    },
    parentHeightOffset: 0,
    sparkline: {
      enabled: false,
    },
  },
  stroke: {
    width: 1,
    colors: ["#fff"],
  },
  dataLabels: {
    enabled: true,
    offsetY: -20,
    style: {
      colors: ["#000000"],
      fontSize: "50%",
      fontWeight: "bold",
      fontFamily: "'Noto Sans Lao', sans-serif",
    },
    formatter: (val: number) => {
      return new Intl.NumberFormat("en-US").format(val);
    },
    rotation: 0,
    textAnchor: "middle",
    dropShadow: {
      enabled: true,
      left: 0,
      top: 0,
      opacity: 0.1,
      blur: 1,
    },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "100%",
      borderRadius: 8,
      dataLabels: {
        position: "top",
      },
    },
  },
  xaxis: {
    categories: billData.value.map((bill) => bill.InvoiceMonth),
    labels: {
      rotate: -45,
      style: {
        fontSize: "12px",
        fontFamily: "'Noto Sans Lao', sans-serif",
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  fill: {
    opacity: 0.9,
    type: "gradient",
    gradient: {
      shade: "light",
      type: "vertical",
      shadeIntensity: 0.2,
      opacityFrom: 0.85,
      opacityTo: 1,
    },
  },
  colors: ["#4361ee", "#3bc37d", "#fb8c00"],
  yaxis: {
    labels: {
      formatter: (val: number) => new Intl.NumberFormat("en-US").format(val),
      style: {
        fontFamily: "'Noto Sans Lao', sans-serif",
      },
    },
  },
  legend: {
    position: "top",
    horizontalAlign: "start",
    fontFamily: "'Noto Sans Lao', sans-serif",
    fontSize: "14px",
    markers: {
      width: 12,
      height: 12,
      radius: 6,
    },
  },
  tooltip: {
    y: {
      formatter: (val: number) => new Intl.NumberFormat("en-US").format(val),
    },
    style: {
      fontFamily: "'Noto Sans Lao', sans-serif",
    },
  },
  grid: {
    borderColor: "#f1f1f1",
    row: {
      colors: ["transparent", "transparent"],
    },
  },
}));

onMounted(() => {
  utilityStore.Getdata();
});

const formatNumber = (value: number | string | null | undefined): string => {
  return value == null
    ? "0"
    : new Intl.NumberFormat("en-US").format(Number(value));
};

const getPaymentStatus = (bill: any): string => {
  return bill.Debt_Amount === "0" ? "Y" : "N";
};

const printReport = () => {
  window.print();
};
</script>

<template>
  

  <div class="report-page">
    <div class="header">
      <h2>ບົດລາຍງານນໍ້າປະປາ</h2>
      <button class="print-button" @click="printReport">
        <span class="icon">🖨️</span> ພິມບົດລາຍງານ
      </button>
    </div>

    <div class="">
      <v-row>
        <v-col cols="12">
          <div class="text-center logo-section">
            <h3>ບົດລາຍງານ</h3>
            <p>ສາທານຸປະໂພກ</p>
          </div>
        </v-col>

        <v-col cols="6" md="6">
          <v-row density="comfortable" align="center">
            <v-col cols="2"></v-col>
            <p class="">ທະນາຄານ ແຫ່ງ ສປປ ລາວ</p>
          </v-row>

          <div class="company-info">
            <v-row align="center" density="comfortable">
              <v-col cols="auto">
                <v-img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQguq0YjU42M_ijrBwnE9IpgFAFeMZQCDDJVi3yrfOCog&s"
                  width="70"
                  class="company-logo"
                ></v-img>
              </v-col>
              <v-col>
                <div class="">
                  <p>ບໍລິສັດ ຂໍ້ມູນຂ່າວສານສິນເຊືອ ແຫ່ງ ສປປ ລາວ</p>
                  <hr class="company-divider" style="width: 70%;" />
                  <p>Lao Credit Information Company</p>
                </div>
              </v-col>
            </v-row>
          </div>
        </v-col>
        <v-col cols="6" md="6">
          <div v-if="utilityData" class="reference-info">
            <p>ເລກທີ: LIC</p>
            <p>
              ນະຄອນຫຼວງວຽງຈັນ ວັນທີ: <b>{{ referenceData?.[2] || "N/A" }}</b>
            </p>
          </div>
        </v-col>
      </v-row>
    </div>

    <div class="customer-info-card">
      <h2 class="section-title">ຂໍ້ມູນລູກຄ້າ</h2>
      <div v-for="item in customerData" class="customer-details">
        <v-row>
          <v-col cols="4" md="4">
            <div>
              <p>
                ອ້າງອີງການສອບຖາມ: <b> {{ referenceData?.[0] }}</b>
              </p>
            </div>
            <div class="info-group">
              <p class="">
                ລະຫັດລູກຄ້າ: <b>{{ item.Customer_ID }}</b>
              </p>
            </div>

            <div class="info-group">
              <p class="">ຊື່ລູຄ້າ: {{ item.Name }}{{ item.Surname }}</p>
            </div>
            <div></div>
          </v-col>
          <v-col cols="4" md="4">
            <div class="info-group">
              <p class="">
                ທີ່ຢູ່ລູກຄ້າ: ແຂວງ
                <b>{{ item.Province_ID }}</b> ເມືອງ
                <b>{{ item.Dustrict_ID }}</b>
              </p>
            </div>
            <div class="">
              <p>
                ບ້ານ: <b>{{ item.Address }}</b>
              </p>
              <p v-if="item.Passport">
                ພາດປອດ: <b>{{ item.Passport }}</b>
              </p>
            </div>
          </v-col>
          <v-col cols="4" md="4">
            <div class="info-group">
              <p class="">
                ເບີ້ໂທ: <b class="">{{ item.Tel }}</b>
              </p>
            </div>
            <div class="info-group">
              <p class="">
                ອີເມວ: <b class="">{{ item.Email }}</b>
              </p>
            </div>
          </v-col>
        </v-row>
      </div>
    </div>

    <div class="report-container">
      <div class="print-header">
        <h2>ຂໍ້ມູນ 12 ເດືອນຍອ້ນຫຼັງ</h2>
        <p>Print Date: {{ new Date().toLocaleDateString("en-US") }}</p>
      </div>
      <div class="table-container" v-if="billData.length">
        <table class="bill-table">
          <thead>
            <tr>
              <th class="first-col"></th>
              <th
                v-for="bill in billData"
                :key="`month-${bill.BillID}`"
                class="month-header"
              >
                {{ bill.InvoiceMonth }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th class="first-col">ເລກທີບິນ</th>
              <td v-for="bill in billData" :key="`invoice-${bill.BillID}`">
                {{ bill.InvoiceNo || "-" }}
              </td>
            </tr>
            <tr>
              <th class="first-col">ເລກທີການຊຳລະ</th>
              <td v-for="bill in billData" :key="`payment-${bill.BillID}`">
                {{ bill.Payment_ID || "-" }}
              </td>
            </tr>
            <tr>
              <th class="first-col">ຍອດຍົກມາ</th>
              <td
                v-for="bill in billData"
                :key="`outstanding-${bill.BillID}`"
                class="amount-cell"
              >
                {{ formatNumber(bill.Outstanding) }}
              </td>
            </tr>
            <tr>
              <th class="first-col">ເງິນໃນເດືອນ+ອາກອນ</th>
              <td
                v-for="bill in billData"
                :key="`tax-${bill.BillID}`"
                class="amount-cell"
              >
                {{ formatNumber(bill.Basic_Tax) }}
              </td>
            </tr>
            <tr>
              <th class="first-col">ລວມເງິນໃນເດືອນ</th>
              <td
                v-for="bill in billData"
                :key="`bill-${bill.BillID}`"
                class="amount-cell total-amount"
              >
                {{ formatNumber(bill.Bill_Amount) }}
              </td>
            </tr>
            <tr>
              <th class="first-col">ສະຖານະ</th>
              <td
                v-for="bill in billData"
                :key="`status-${bill.BillID}`"
                :class="
                  getPaymentStatus(bill) === 'Paid'
                    ? 'paid-status'
                    : 'unpaid-status'
                "
              >
                {{ getPaymentStatus(bill) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="no-data">ບໍ່ມີຂໍ້ມູນ</div>

      <div class="chart-container">
        <h3 class="chart-title">
          ກຣາບສະແດງການຊຳລະຄ່ານໍ້າປະປາ 12 ເດືອນຍອ້ນຫຼັງ
        </h3>
        <apexchart
          width="90%"
          height="500"
          type="bar"
          :options="chartOptions"
          :series="series"
          class="bill-chart"
        ></apexchart>
      </div>

      <div class="print-footer">
        <p>Printed by: LIC System</p>
        <p>© {{ new Date().getFullYear() }} Lao Credit Information Company</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Noto+Sans+Lao:wght@300;400;500;600;700&display=swap");

.report-page {
  font-family: "Noto Sans Lao", sans-serif;
  color: #333;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 15px 0;
  border-bottom: 2px solid #f0f0f0;
}

.header h2 {
  font-size: 28px;
  color: #2c3e50;
  font-weight: 600;
  margin: 0;
}

.print-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background-color: #4361ee;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.print-button:hover {
  background-color: #3a56d4;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.print-button:active {
  transform: translateY(0);
}

.print-button .icon {
  font-size: 18px;
}

.logo-section {
  margin-bottom: 20px;
}

.country-name {
  font-size: 18px;
  font-weight: 600;
  margin: 10px 0 5px;
}

.country-motto {
  font-size: 16px;
  color: #555;
  margin: 0;
}

.bank-title {
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
  margin-top: 0;
}

.company-info {
  margin-top: 10px;
}

.company-name h4 {
  margin: 5px 0;
  font-size: 18px;
  color: #2c3e50;
}

.company-divider {
  margin: 10px 0;
  border: 0;
  border-top: 1px solid #ddd;
}

.reference-info {
  text-align: right;
  padding: 10px;
  font-size: 16px;
}

.customer-info-card {
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  margin: 20px 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-left: 5px solid #4361ee;
}

.section-title {
  font-size: 22px;
  color: #2c3e50;
  margin-top: 0;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0f0f0;
}

.customer-details {
  margin-top: 15px;
}

.info-group {
  margin-bottom: 12px;
  display: flex;
  align-items: baseline;
}

.info-label {
  font-weight: 300;
  color: #555;
  margin: 0;
  margin-right: 8px;
  min-width: 100px;
}

.info-value {
  font-weight: 400;
  color: #2c3e50;
  margin: 0;
}

.report-container {
  max-width: 100%;
  margin: 20px auto;
  padding: 25px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.table-container {
  overflow-x: auto;
  margin: 20px 0;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.bill-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  background-color: white;
}

.bill-table th,
.bill-table td {
  padding: 12px;
  text-align: center;
  border: 1px solid #e0e0e0;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.bill-table th {
  background-color: #f8f9fa;
}

.month-header {
  background-color: #eef2ff !important;
  color: #4361ee;
  font-weight: 500;
}

.first-col {
  background-color: #f8f9fa;
  font-weight: 600;
  text-align: left;
  width: 180px;
  color: #2c3e50;
}

.amount-cell {
  text-align: right;
  font-family: "Noto Sans Lao", sans-serif;
}

.total-amount {
  font-weight: 700;
  color: #2c3e50;
}

.paid-status {
  background-color: #e8f5e9;
  color: #2e7d32;
  font-weight: 600;
}

.unpaid-status {
  background-color: #ffebee;
  color: #c62828;
  font-weight: 600;
}

.no-data {
  text-align: center;
  padding: 30px;
  color: #666;
  font-size: 18px;
  background-color: #f9f9f9;
  border-radius: 8px;
  margin: 20px 0;
}

.chart-container {
  margin-top: 40px;
  padding: 20px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.chart-title {
  font-size: 20px;
  color: #2c3e50;
  margin-top: 0;
  margin-bottom: 20px;
  text-align: center;
  font-weight: 600;
}

.bill-chart {
  margin-top: 20px;
}

.print-header,
.print-footer {
  display: none;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }

  .info-group {
    flex-direction: column;
  }

  .info-label {
    margin-bottom: 4px;
  }
}

@page {
  size: A4 portrait;
  margin: 10mm;
}

@media print {
  .report-page {
    margin: 0;
    max-width: 100%;
  }

  .report-container {
    margin: 0;
    padding: 0;
    box-shadow: none;
    max-width: 100%;
  }

  .header,
  .document-header {
    display: none;
  }

  .print-header {
    display: block;
    text-align: center;
    margin-bottom: 20px;
  }

  .print-header h2 {
    font-size: 18pt;
    margin-bottom: 5px;
  }

  .print-header p {
    font-size: 10pt;
    color: #666;
  }

  .customer-info-card {
    box-shadow: none;
    border-left: none;
    border: 1px solid #ddd;
    page-break-inside: avoid;
  }

  .chart-container {
    box-shadow: none;
    page-break-inside: avoid;
  }

  .table-container {
    box-shadow: none;
    page-break-inside: avoid;
  }

  .print-footer {
    display: block;
    text-align: center;
    margin-top: 30px;
    font-size: 10pt;
    color: #666;
    page-break-inside: avoid;
  }

  .bill-table {
    width: 100%;
    table-layout: fixed;
  }

  .bill-table th,
  .bill-table td {
    font-size: 8pt;
    padding: 4px;
  }

  .first-col {
    width: 80px;
  }

  .bill-table th:not(.first-col),
  .bill-table td:not(.first-col) {
    width: calc((180m - 80px) / 12);
  }

  html,
  body {
    width: 210mm;
    height: 297mm;
    padding: 1;
    margin: 0;
  }

  tr {
    page-break-inside: avoid;
  }

  thead {
    display: table-header-group;
  }
}
</style>
