<template>
  <!-- Header with Back Button -->
  <v-card class="header-card mb-2" elevation="0">
    <div class="d-flex align-center justify-space-between">
      <div class="d-flex align-center">
        <v-btn 
          icon 
          variant="flat" 
          @click="goBack" 
          class="back-btn mr-4"
          color="rgba(255,255,255,0.2)"
        >
          <v-icon size="24">mdi-arrow-left</v-icon>
        </v-btn>
        <div>
          <h1 class="text-h5 font-weight-bold mb-1">{{ getGroupTitle() }}</h1>
          <p class="text-body-2 mb-0 opacity-90">Credit Report Detail</p>
        </div>
      </div>
      
      <!-- Export & Print Buttons -->
      <div class="d-flex gap-2">
        <v-btn
          @click="exportToExcel"
          color="success"
          variant="elevated"
          prepend-icon="mdi-microsoft-excel"
          :loading="exporting"
          class="export-btn"
        >
          Export Excel
        </v-btn>
        <v-btn
          @click="printReport"
          color="primary"
          variant="elevated"
          prepend-icon="mdi-printer"
          class="print-btn"
        >
          Print
        </v-btn>
      </div>
    </div>
  </v-card>

  <!-- Filter Summary Card -->
  <v-card class="filter-card" elevation="0">
    <div class="pa-5">
      <div class="d-flex align-center mb-1">
        <v-icon class="filter-icon mr-2" size="24">mdi-filter-variant</v-icon>
        <h3 class="text-h6 font-weight-bold mb-0">ຕົວກອງທີ່ເລືອກ</h3>
        <v-progress-circular
          v-if="loading"
          indeterminate
          color="primary"
          size="20"
          width="2"
          class="ml-3"
        ></v-progress-circular>
      </div>
      <div class="d-flex flex-wrap gap-3">
        <v-chip class="filter-chip" size="default" variant="flat">
          <v-icon start size="18">mdi-bank</v-icon>
          <span class="font-weight-medium">{{ displayBnkCode }}</span>
        </v-chip>
        <v-chip class="filter-chip" size="default" variant="flat">
          <v-icon start size="18">mdi-calendar</v-icon>
          <span class="font-weight-medium">{{ getFilterDateDisplay() }}</span>
        </v-chip>
      </div>
    </div>
  </v-card>

  <!-- Data Table Card -->
  <v-card class="data-table-card" elevation="0" id="printable-area">
    <v-card-title class="table-header pa-2">
      <div class="d-flex align-center justify-space-between w-100">
        <div class="d-flex align-center">
          <v-icon class="mr-3" size="28" color="#2233a1">mdi-table-large</v-icon>
          <span class="text-h6 font-weight-bold">ລາຍລະອຽດການເຂົ້າຄົ້ນຫາບົດລາຍງານ</span>
        </div>
        <v-chip class="count-chip" size="large" variant="flat">
          <v-icon start size="20">mdi-file-document-multiple</v-icon>
          <span class="font-weight-bold">{{ reportData.length }} ລາຍການ</span>
        </v-chip>
      </div>
    </v-card-title>

    <v-divider class="divider-line"></v-divider>

    <!-- Skeleton Loading -->
    <div v-if="loading && reportData.length === 0" class="pa-6">
      <v-skeleton-loader
        v-for="i in 8"
        :key="i"
        type="table-row"
        class="mb-2"
      ></v-skeleton-loader>
    </div>

    <!-- Data Table -->
    <v-data-table
      v-else
      :headers="dynamicHeaders"
      :items="reportData"
      :items-per-page="10"
      :loading="loading"
      class="custom-table elevation-0"
      hover
    >
      <template v-slot:item.no="{ index }">
        <span class="index-number">{{ index + 1 }}</span>
      </template>

      <template v-for="field in visibleFields" v-slot:[`item.${field}`]="{ item }">
        <span :style="getFieldStyle(field, item[field])" class="table-cell-content">
          <template v-if="field === 'chg_code'">
            <v-chip size="small" class="chg-chip" variant="flat">
              {{ item.chg_lao_type || item.chg_code }}
            </v-chip>
          </template>
          <template v-else-if="field === 'customer_name'">
            <div class="d-flex align-center customer-name-cell">
              <v-icon size="16" class="mr-1" :color="item.cusType === 'A1' ? '#2196F3' : '#4CAF50'">
                {{ item.cusType === 'A1' ? 'mdi-account' : 'mdi-domain' }}
              </v-icon>
              <span :class="item.customer_name === '-' ? 'text-grey' : 'customer-name-text'">
                {{ item.customer_name }}
              </span>
            </div>
          </template>
          <template v-else-if="field === 'cusType'">
            <v-chip 
              size="small" 
              :color="item.cusType === 'A1' ? 'blue' : 'green'" 
              style="font-weight: 600;"
            >
              {{ item.cusType_lao }}
            </v-chip>
          </template>
          <template v-else-if="field === 'user_sys_id'">
            <div class="d-flex align-center">
              <v-icon size="16" class="mr-1">mdi-account</v-icon>
              {{ item.username || item.user_sys_id }}
            </div>
          </template>
          <template v-else-if="field === 'rec_insert_date'">
            <div class="date-cell">
              <v-icon size="16" class="mr-1" color="#F57C00">mdi-clock-outline</v-icon>
              {{ formatRecInsertDate(item[field]) }}
            </div>
          </template>
          <template v-else-if="field === 'lon_purpose_display'">
            <div class="loan-purpose-cell">
              <!-- <v-icon size="16" class="mr-1" color="#2931a5">mdi-cash-multiple</v-icon> -->
              {{ item.lon_purpose_display }}
            </div>
          </template>
          <template v-else>{{ item[field] }}</template>
        </span>
      </template>

      <template v-slot:no-data>
        <div class="no-data-container text-center pa-12">
          <v-icon size="80" color="grey-lighten-1">mdi-database-off-outline</v-icon>
          <p class="text-h5 font-weight-medium mt-6 mb-2">ບໍ່ມີຂໍ້ມູນ</p>
          <p class="text-body-1 text-medium-emphasis">No data available for the selected filters</p>
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import axios from "axios";
import { useRoute, useRouter, useRuntimeConfig } from "#imports";
import { useUserUID } from '~/composables/useUserUID';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();

const apiDetailURL = `${config.public.strapi.url}api/request-charge-detail/`;
const apiChargeMatrixURL = `${config.public.strapi.url}api/charge-matrix/`;
const apiUserURL = `${config.public.strapi.url}api/user/`;
const apiMemberURL = `${config.public.strapi.url}api/memberinfo/`;
const apiCatalogURL = `${config.public.strapi.url}api/catalog-cats/`;

const { userData, UID } = useUserUID();
const currentBnkCode = computed(() => userData.value.MID?.id || '');
const currentUID = computed(() => UID.value || null);

const loading = ref(false);
const exporting = ref(false);
const reportData = ref([]);
const dynamicHeaders = ref([]);
const filterParams = ref({
  group: '',
  bnk_code: '',
  detail_bnk_code: '',
  date_filter_type: '',
  date_filter_value: '',
  start_date: '',
  end_date: ''
});

const displayBnkCode = computed(() => {
  const found = reportData.value[0];
  return found?.bank_full_display || `${filterParams.value.detail_bnk_code || currentBnkCode.value}`;
});

const visibleFields = [
  "bnk_code",
  "LCIC_code",
  "customer_name",
  "chg_code",
  "cusType",
  "rec_reference_code",
  "lon_purpose_display",
  "user_sys_id",
  "rec_insert_date"
];

const getCusTypeLao = (cusType) => {
  const cusTypeMap = {
    'A1': 'ບຸກຄົນ',
    'A2': 'ນິຕິບຸກຄົນ'
  };
  return cusTypeMap[cusType] || cusType;
};

const getLoanPurposeDisplay = (loanPurposeCode, catalogMap) => {
  if (!loanPurposeCode) return '-';
  const catalog = catalogMap[loanPurposeCode];
  if (catalog) {
    return `${catalog.cat_lao_name} - ${catalog.cat_value}`;
  }
  return loanPurposeCode;
};

const getCustomerName = (item) => {
  if (!item.customer_detail) return '-';
  
  const cusType = item.cusType;
  const detail = item.customer_detail;
  
  if (cusType === 'A2') {
    return detail.enterpriseNameLao || detail.eneterpriseNameEnglish || '-';
  } 
  else if (cusType === 'A1') {
    if (detail.ind_lao_name || detail.ind_lao_surname) {
      const laoName = detail.ind_lao_name || '';
      const laoSurname = detail.ind_lao_surname || '';
      return `${laoName} ${laoSurname}`.trim();
    }
    else {
      const engName = detail.ind_name || '';
      const engSurname = detail.ind_surname || '';
      return `${engName} ${engSurname}`.trim() || '-';
    }
  }
  
  return '-';
};

// ✅ Export to Excel with Phetsarath OT Font
const exportToExcel = async () => {
  exporting.value = true;
  try {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([]);

    // Row 1-2: Logo + Company Info
    XLSX.utils.sheet_add_aoa(ws, [
      ['ບໍລິສັດຂໍ້ມູນຂ່າວສານສິນເຊື່ອແຫ່ງ ສປປ ລາວ'],
      ['Lao Credit Information Company'],
      []
    ], { origin: 'A1' });

    // Row 4: Report Title
    XLSX.utils.sheet_add_aoa(ws, [[getGroupTitle()]], { origin: 'A4' });
    
    // Row 5-8: Filter Info
    XLSX.utils.sheet_add_aoa(ws, [
      [`ທະນາຄານ: ${displayBnkCode.value}`],
      [`ພິມວັນທີ່: ${getFilterDateDisplay()}`],
      [`ຈຳນວນລາຍການ: ${reportData.value.length}`],
      []
    ], { origin: 'A5' });

    // Prepare data
    const excelData = reportData.value.map((item, index) => ({
      'NO': index + 1,
      'ລະຫັດທະນາຄານ': item.bnk_code,
      'ລະຫັດລູກຄ້າ': item.LCIC_code,
      'ຊື່ລູກຄ້າ': item.customer_name,
      'ປະເພດຄ່າທຳນຽມ': item.chg_lao_type || item.chg_code,
      'ປະເພດລູກຄ້າ': item.cusType_lao,
      'ເລກທີ່ອ້າງອີງ': item.rec_reference_code,
      'ຈຸດປະສົງສິນເຊື່ອ': item.lon_purpose_display,
      'ຜູ້ບັນທຶກ': item.username || item.user_sys_id,
      'ວັນທີ່ບັນທຶກ': formatRecInsertDate(item.rec_insert_date)
    }));

    // Row 10: Table data
    XLSX.utils.sheet_add_json(ws, excelData, { origin: 'A10' });

    // Merge cells
    ws['!merges'] = [
      { s: { r: 0, c: 1 }, e: { r: 0, c: 9 } }, // Company Lao
      { s: { r: 1, c: 1 }, e: { r: 1, c: 9 } }, // Company Eng
      { s: { r: 3, c: 0 }, e: { r: 3, c: 9 } }, // Title
      { s: { r: 7, c: 0 }, e: { r: 7, c: 9 } }  // Warning
    ];

    // Column widths - BALANCED
    ws['!cols'] = [
      { wch: 5 },  // NO
      { wch: 12 }, // ລະຫັດທະນາຄານ
      { wch: 16 }, // ລະຫັດລູກຄ້າ
      { wch: 25 }, // ຊື່ລູກຄ້າ
      { wch: 16 }, // ປະເພດຄ່າທຳນຽມ
      { wch: 11 }, // ປະເພດລູກຄ້າ
      { wch: 18 }, // ເລກທີ່ອ້າງອີງ
      { wch: 20 }, // ຈຸດປະສົງສິນເຊື່ອ
      { wch: 14 }, // ຜູ້ບັນທຶກ
      { wch: 20 }  // ວັນທີ່ບັນທຶກ
    ];

    // ========== STYLING ==========

    // Company Lao (B1)
    ws['B1'] = ws['B1'] || { t: 's', v: 'ບໍລິສັດຂໍ້ມູນຂ່າວສານສິນເຊື່ອແຫ່ງ ສປປ ລາວ' };
    ws['B1'].s = {
      font: { bold: true, sz: 13, color: { rgb: "2931A5" }, name: "Phetsarath OT" },
      alignment: { horizontal: "left", vertical: "center" }
    };

    // Company Eng (B2)
    ws['B2'] = ws['B2'] || { t: 's', v: 'Lao Credit Information Company' };
    ws['B2'].s = {
      font: { bold: true, sz: 11, color: { rgb: "2931A5" }, name: "Arial" },
      alignment: { horizontal: "left", vertical: "center" }
    };

    // Title (A4)
    ws['A4'] = ws['A4'] || { t: 's', v: getGroupTitle() };
    ws['A4'].s = {
      font: { bold: true, sz: 15, color: { rgb: "2931A5" }, name: "Phetsarath OT" },
      alignment: { horizontal: "center", vertical: "center" },
      fill: { fgColor: { rgb: "E8EAF6" } }
    };

    // Filter cells (A5:A7)
    for (let i = 5; i <= 7; i++) {
      const cell = `A${i}`;
      if (ws[cell]) {
        ws[cell].s = {
          font: { bold: true, sz: 10, name: "Phetsarath OT" },
          fill: { fgColor: { rgb: "F5F5F5" } },
          alignment: { horizontal: "left", vertical: "center" }
        };
      }
    }

    // Warning (A8)
    if (ws['A8']) {
      ws['A8'].s = {
        font: { italic: true, sz: 9, name: "Phetsarath OT", color: { rgb: "666666" } },
        fill: { fgColor: { rgb: "FFF9E6" } },
        alignment: { horizontal: "center", vertical: "center" }
      };
    }

    // Header row (Row 10)
    const headerCols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    headerCols.forEach(col => {
      const cell = `${col}10`;
      if (!ws[cell]) ws[cell] = { t: 's', v: '' };
      ws[cell].s = {
        font: { bold: true, sz: 10, name: "Phetsarath OT", color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "2931A5" } },
        alignment: { horizontal: "center", vertical: "center", wrapText: true },
        border: {
          top: { style: "thin", color: { rgb: "FFFFFF" } },
          bottom: { style: "thin", color: { rgb: "FFFFFF" } },
          left: { style: "thin", color: { rgb: "FFFFFF" } },
          right: { style: "thin", color: { rgb: "FFFFFF" } }
        }
      };
    });

    // Data rows (starting from row 11)
    for (let i = 0; i < excelData.length; i++) {
      headerCols.forEach(col => {
        const cell = `${col}${11 + i}`;
        if (!ws[cell]) ws[cell] = { t: 's', v: '' };
        
        ws[cell].s = {
          font: { sz: 10, name: "Phetsarath OT" },
          alignment: { 
            horizontal: col === 'D' ? "left" : "center",
            vertical: "center",
            wrapText: true 
          },
          border: {
            top: { style: "thin", color: { rgb: "DDDDDD" } },
            bottom: { style: "thin", color: { rgb: "DDDDDD" } },
            left: { style: "thin", color: { rgb: "DDDDDD" } },
            right: { style: "thin", color: { rgb: "DDDDDD" } }
          }
        };
      });
    }

    // Row heights
    ws['!rows'] = [
      { hpt: 60 },  // Row 1 (bigger for logo)
      { hpt: 26 },  // Row 2
      { hpt: 10 },  // Row 3
      { hpt: 32 },  // Row 4
      { hpt: 22 },  // Row 5
      { hpt: 22 },  // Row 6
      { hpt: 22 },  // Row 7
      { hpt: 24 },  // Row 8
      { hpt: 10 },  // Row 9
      { hpt: 28 }   // Row 10
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'ລາຍລະອຽດການເຂົ້າຄົ້ນຫາບົດລາຍງານ');

    const date = new Date().toISOString().split('T')[0];
    const bankCode = filterParams.value.detail_bnk_code || currentBnkCode.value;
    const filename = `${getGroupTitle()}_${bankCode}_${date}.xlsx`;

    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(data, filename);
  } catch (error) {
    console.error('❌ Error:', error);
    alert('ເກີດຂໍ້ຜິດພາດໃນການ Export Excel');
  } finally {
    exporting.value = false;
  }
};

// ✅ Print with Auto-Print & Smaller Button
const printReport = () => {
  const printContent = document.getElementById('printable-area');
  if (!printContent) return;

  const printWindow = window.open('', '_blank');
  
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${getGroupTitle()} - Print</title>
      <link href="https://fonts.googleapis.com/css2?family=Phetsarath+OT&display=swap" rel="stylesheet">
      <style>
        @page {
          size: A4 portrait;
          margin: 12mm;
        }
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Phetsarath OT', sans-serif;
          padding: 15px;
          color: #333;
          font-size: 10px;
        }
        
        .print-button-container {
          text-align: center;
          margin-bottom: 15px;
          padding: 10px;
          background: #f0f0f0;
          border-radius: 6px;
        }
        
        .print-btn {
          background: #2931a5;
          color: white;
          padding: 8px 20px;
          border: none;
          border-radius: 5px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'Phetsarath OT', sans-serif;
          transition: all 0.2s ease;
        }
        
        .print-btn:hover {
          background: #1e2587;
          transform: scale(1.02);
        }
        
        .header-section {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 18px;
          padding-bottom: 12px;
          border-bottom: 3px solid #2931a5;
        }
        
        .header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .logo-placeholder {
          width: 70px;
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          border-radius: 6px;
          overflow: hidden;
        }
        
        .logo-placeholder img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        
        .company-info {
          text-align: left;
        }
        
        .company-name-lao {
          font-size: 14px;
          font-weight: bold;
          color: #2931a5;
          margin-bottom: 2px;
        }
        
        .company-name-eng {
          font-size: 11px;
          font-weight: 600;
          color: #2931a5;
        }
        
        .report-title {
          text-align: center;
          margin: 15px 0;
        }
        
        h1 {
          color: #2931a5;
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 6px;
        }
        
        .sub-title {
          font-size: 12px;
          color: #666;
          margin-top: 4px;
        }
        
        .filter-info {
          background: #f8f9fa;
          padding: 10px 15px;
          border-radius: 5px;
          margin-bottom: 15px;
          border-left: 3px solid #2931a5;
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
        }
        
        .filter-item {
          margin: 4px 0;
          font-size: 10px;
        }
        
        .filter-item strong {
          color: #2931a5;
          font-weight: 600;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 9px;
          margin-top: 12px;
        }
        
        th {
          background: #2931a5;
          color: white;
          padding: 8px 5px;
          text-align: center;
          font-weight: 600;
          border: none;
          font-size: 9px;
        }
        
        td {
          padding: 6px 5px;
          border: none;
          text-align: center;
          vertical-align: middle;
        }
        
        tr:nth-child(even) {
          background: #f9f9f9;
        }
        
        .customer-col {
          text-align: left !important;
          max-width: 160px;
          word-wrap: break-word;
        }
        
        .footer {
          margin-top: 25px;
          padding-top: 12px;
          border-top: 2px solid #e0e0e0;
          text-align: center;
          font-size: 9px;
          color: #666;
        }
        
        @media print {
          body {
            padding: 0;
          }
          
          .print-button-container {
            display: none !important;
          }
          
          table {
            page-break-inside: auto;
          }
          
          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
          
          thead {
            display: table-header-group;
          }
        }
      </style>
    </head>
    <body>
      <div class="print-button-container">
        <button class="print-btn" onclick="window.print()">
          🖨️ ພິມບົດລາຍງານ
        </button>
      </div>

      <div class="header-section">
        <div class="header-left">
          <div class="logo-placeholder">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQguq0YjU42M_ijrBwnE9IpgFAFeMZQCDDJVi3yrfOCog&s" alt="Company Logo" />
          </div>
          <div class="company-info">
            <div class="company-name-lao">ບໍລິສັດຂໍ້ມູນຂ່າວສານສິນເຊື່ອແຫ່ງ ສປປ ລາວ</div>
            <div class="company-name-eng">Lao Credit Information Company</div>
          </div>
        </div>
      </div>
      
      <div class="report-title">
        <h1>ລາຍລະອຽດການເຂົ້າຄົ້ນຫາບົດລາຍງານ</h1>
        <div class="sub-title">${getGroupTitle()}</div>
      </div>
      
      <div class="filter-info">
        <div class="filter-item"><strong>ທະນາຄານ:</strong> ${displayBnkCode.value}</div>
        <div class="filter-item"><strong>ວັນທີ່:</strong> ${getFilterDateDisplay()}</div>
        <div class="filter-item"><strong>ຈຳນວນລາຍການ:</strong> ${reportData.value.length} ລາຍການ</div>
        <div class="filter-item"><strong>ວັນທີ່ພິມ:</strong> ${new Date().toLocaleDateString('lo-LA', { 
          day: '2-digit',
          month: '2-digit', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}</div>
      </div>
      
      <table>
        <thead>
          <tr>
            <th style="width: 3%;">NO</th>
            <th style="width: 5%;">ລະຫັດທະນາຄານ</th>
            <th style="width: 11%;">ລະຫັດລູກຄ້າ</th>
            <th style="width: 18%;">ຊື່ລູກຄ້າ</th>
            <th style="width: 11%;">ປະເພດຄ່າທຳນຽມ</th>
            <th style="width: 9%;">ປະເພດລູກຄ້າ</th>
            <th style="width: 11%;">ເລກທີ່ອ້າງອີງ</th>
            <th style="width: 12%;">ຈຸດປະສົງສິນເຊື່ອ</th>
            <th style="width: 8%;">ຜູ້ບັນທຶກ</th>
            <th style="width: 18%;">ວັນທີ່ບັນທຶກ</th>
          </tr>
        </thead>
        <tbody>
          ${reportData.value.map((item, index) => `
            <tr>
              <td>${index + 1}</td>
              <td>${item.bnk_code}</td>
              <td>${item.LCIC_code}</td>
              <td class="customer-col">${item.customer_name}</td>
              <td>${item.chg_lao_type || item.chg_code}</td>
              <td>${item.cusType_lao}</td>
              <td>${item.rec_reference_code}</td>
              <td>${item.lon_purpose_display}</td>
              <td>${item.username || item.user_sys_id}</td>
              <td>${formatRecInsertDate(item.rec_insert_date)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div class="footer">
        <p style="margin-bottom: 6px; font-size: 10px;"><strong>ເອກະສານບົດລາຍງານນີ້ເຂົ້ານຳໃຊ້ໃນວຽກງານສິນເຊື່ອເທົ່ານັ້ນ</strong></p>
        <p style="font-size: 9px; color: #999;">This document is for credit work purposes only</p>
      </div>
    </body>
    </html>
  `);

  printWindow.document.close();
  
  // Auto-print after content loads
  setTimeout(() => {
    printWindow.focus();
    printWindow.print();
  }, 600);
};

const getFilterParams = () => {
  filterParams.value = {
    group: route.query.group || '',
    bnk_code: currentBnkCode.value,
    detail_bnk_code: route.query.detail_bnk_code || '',
    date_filter_type: route.query.date_filter_type || '',
    date_filter_value: route.query.date_filter_value || '',
    start_date: route.query.start_date || '',
    end_date: route.query.end_date || ''
  };
};

const getGroupTitle = () => {
  const titles = {
    'group1': 'ບົດລາຍງານສິນເຊື່ອ',
    'group2': 'ບົດລາຍງານຄະແນນສິນເຊື່ອ',
    'group3': 'ບົດລາຍງານສາທາລະນູປະໂພກ'
  };
  return titles[filterParams.value.group] || 'Report Detail';
};

const getFilterDateDisplay = () => {
  const type = filterParams.value.date_filter_type;
  const value = filterParams.value.date_filter_value;
  const start = filterParams.value.start_date;
  const end = filterParams.value.end_date;

  if (type === 'range' && start && end) {
    return `${start} - ${end}`;
  }

  switch (type) {
    case 'year': return `ປີ: ${value}`;
    case 'month': return `ເດືອນ: ${value}`;
    case 'day': return `ວັນທີ່: ${value}`;
    default: return value || 'N/A';
  }
};

const formatRecInsertDate = (value) => {
  if (!value) return '-';
  return value.substring(0, 19).replace('T', ', ');
};

const getFieldStyle = (field, value) => {
  let style = { fontWeight: 'normal', color: '#000' };
  if (field === 'chg_code') style = { color: '#2931a5', fontWeight: '600' };
  else if (field === 'cusType') style = { color: '#388E3C', fontWeight: '600' };
  else if (field === 'customer_name') style = { color: '#000', fontWeight: '500' };
  else if (field === 'rec_insert_date') style = { color: '#F57C00', fontWeight: '500' };
  else if (field === 'lon_purpose_display') style = { color: '#000', fontWeight: '500' };
  return style;
};

const fetchDetailData = async () => {
  loading.value = true;
  try {
    const params = {
      bnk_code: filterParams.value.bnk_code,
      detail_bnk_code: filterParams.value.detail_bnk_code,
      group: filterParams.value.group,
      date_filter_type: filterParams.value.date_filter_type
    };

    if (filterParams.value.date_filter_type === 'range') {
      params.start_date = filterParams.value.start_date;
      params.end_date = filterParams.value.end_date;
    } else {
      params.date_filter_value = filterParams.value.date_filter_value;
    }

    const { data } = await axios.get(apiDetailURL, { params });
    let results = data.results || [];

    // Fetch Catalog Data for Loan Purpose (ct_type = "LPR")
    const { data: catalogData } = await axios.get(apiCatalogURL);
    const catalogList = catalogData.results || catalogData.data || catalogData || [];
    const loanPurposeCatalog = catalogList.filter(item => item.ct_type === 'LPR');
    
    const catalogMap = {};
    loanPurposeCatalog.forEach(item => {
      if (item.cat_value) {
        catalogMap[item.cat_value] = {
          cat_lao_name: item.cat_lao_name || item.cat_name || '',
          cat_value: item.cat_value
        };
      }
    });

    const { data: memberData } = await axios.get(apiMemberURL);
    const banks = memberData.data || memberData.results || memberData || [];

    const bankMap = {};
    banks.forEach(b => {
      bankMap[b.bnk_code] = {
        nameL: b.nameL || b.name || '-',
        code: b.code || '',
        bnk_code: b.bnk_code
      };
    });

    const { data: matrixData } = await axios.get(apiChargeMatrixURL);
    const matrixMap = {};
    (matrixData.results || matrixData || []).forEach(item => {
      if (item.chg_code) matrixMap[item.chg_code] = item.chg_lao_type;
    });

    const { data: userData } = await axios.get(apiUserURL);
    const userMap = {};
    (userData.results || userData || []).forEach(u => {
      if (u.user_id || u.UID) userMap[u.UID] = u.username;
    });

    reportData.value = results.map(r => {
      const bank = bankMap[r.bnk_code] || {};
      return {
        ...r,
        chg_lao_type: matrixMap[r.chg_code] || r.chg_code,
        username: userMap[r.user_sys_id.split('-')[0]] || r.user_sys_id,
        bank_display: bank.code ? `${bank.code}-${bank.bnk_code}` : r.bnk_code,
        bank_full_display: bank.nameL ? `${bank.nameL} - (${bank.code}-${bank.bnk_code})` : r.bnk_code,
        customer_name: getCustomerName(r),
        cusType_lao: getCusTypeLao(r.cusType),
        lon_purpose_display: getLoanPurposeDisplay(r.lon_purpose, catalogMap)
      };
    });

    dynamicHeaders.value = [
      { title: 'NO', key: 'no', align: 'center', sortable: false },
      { title: 'ລະຫັດທະນາຄານ', key: 'bnk_code', align: 'center' },
      { title: 'ລະຫັດລູກຄ້າ', key: 'LCIC_code', align: 'start' },
      { title: 'ຊື່ລູກຄ້າ', key: 'customer_name', align: 'center', cellAlign: 'start' },
      { title: 'ປະເພດຄ່າທຳນຽມ', key: 'chg_code', align: 'center', cellAlign: 'start' },
      { title: 'ປະເພດລູກຄ້າ', key: 'cusType', align: 'center' },
      { title: 'ເລກທີ່ອ້າງອີງ', key: 'rec_reference_code', align: 'start' },
      { title: 'ຈຸດປະສົງສິນເຊື່ອ', key: 'lon_purpose_display', align: 'start' },
      { title: 'ຜູ້ບັນທຶກ', key: 'user_sys_id', align: 'start' },
      { title: 'ວັນທີ່ບັນທຶກ', key: 'rec_insert_date', align: 'center' }
    ];
  } catch (err) {
    console.error('❌ Error fetching detail data:', err);
    if (err.response?.status === 400) {
      alert(err.response.data.error || 'Error: Missing detail_bnk_code');
      goBack();
    }
    reportData.value = [];
  } finally {
    loading.value = false;
  }
};

const goBack = () => {
  if (filterParams.value.detail_bnk_code) {
    const { detail_bnk_code, ...restQuery } = route.query;
    router.push({
      path: route.path,
      query: restQuery
    });
  } else {
    router.push({
      path: route.path,
      query: {}
    });
  }
};

watch(() => route.query, () => {
  getFilterParams();
  fetchDetailData();
}, { immediate: true });

onMounted(() => {
  getFilterParams();
  fetchDetailData();
});
</script>

<style scoped>
.header-card {
  border-radius: 16px;
  background: linear-gradient(135deg, #2931a5 0%, #2233a1 100%);
  padding: 20px 25px !important;
  color: white;
  box-shadow: 0 4px 20px rgba(41, 49, 165, 0.4) !important;
}

.back-btn {
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.3) !important;
  transform: translateX(-4px);
}

.export-btn, .print-btn {
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.export-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
}

.print-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.4);
}

.filter-card {
  border-radius: 16px;
  background: white;
  border: 2px solid #e8eaf6;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06) !important;
  transition: all 0.3s ease;
}

.filter-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1) !important;
  transform: translateY(-2px);
}

.filter-icon {
  color: #2931a5;
}

.filter-chip {
  background: linear-gradient(135deg, #e8eaf6 0%, #c5cae9 100%) !important;
  color: #2931a5 !important;
  padding: 8px 16px;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.filter-chip:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(41, 49, 165, 0.25);
}

.data-table-card {
  border-radius: 16px;
  background: white;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08) !important;
  overflow: hidden;
}

.customer-name-cell {
  text-align: left !important;
  justify-content: flex-start !important;
}

.customer-name-text {
  color: #000 !important;
  font-weight: 500;
}

.loan-purpose-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000;
  font-weight: 500;
}

.table-header {
  background: linear-gradient(135deg, #F5F5F5 0%, #FAFAFA 100%);
  border-bottom: 3px solid #2931a5;
}

.divider-line {
  border-color: #E0E0E0;
  border-width: 2px;
}

.count-chip {
  background: linear-gradient(135deg, #225f97 0%, #2326b9 100%) !important;
  color: white !important;
  padding: 8px 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
}

.custom-table {
  font-size: 0.95rem;
}

.custom-table :deep(th) {
  background: #2931a5 !important;
  color: white !important;
  font-weight: 500 !important;
  font-size: 0.800rem !important;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 10px 14px !important;
  border-bottom: 2px solid #2233a1 !important;
}

.custom-table :deep(td) {
  padding: 14px !important;
  border-bottom: 1px solid #F5F5F5 !important;
}

.custom-table :deep(tr:hover) {
  background: linear-gradient(135deg, #F8F9FA 0%, #e8eaf6 100%) !important;
}

.custom-table :deep(td[data-column="customer_name"]) {
  text-align: left !important;
}

.custom-table :deep(.v-data-table__td:has(.customer-name-cell)) {
  text-align: left !important;
}

.index-number {
  display: inline-block;
  background: linear-gradient(135deg, #e8eaf6 0%, #c5cae9 100%);
  color: #2931a5;
  font-weight: 700;
  padding: 6px 14px;
  border-radius: 10px;
  font-size: 0.9rem;
  box-shadow: 0 2px 6px rgba(41, 49, 165, 0.15);
}

.table-cell-content {
  display: inline-block;
  line-height: 1.6;
}

.chg-chip {
  background: linear-gradient(135deg, #e8eaf6 0%, #c5cae9 100%) !important;
  color: #2931a5 !important;
  font-weight: 600 !important;
  border-radius: 8px;
}

.custype-chip {
  font-weight: 600 !important;
  border-radius: 8px;
  color: white !important;
}

.date-cell {
  display: flex;
  align-items: center;
  color: #000;
  font-weight: 500;
}

.text-grey {
  color: #9E9E9E !important;
  font-style: italic;
}

.no-data-container {
  background: linear-gradient(135deg, #FAFAFA 0%, #F5F5F5 100%);
  border-radius: 12px;
  margin: 24px;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

@media print {
  .header-card,
  .filter-card,
  .export-btn,
  .print-btn,
  .back-btn {
    display: none !important;
  }
  
  .data-table-card {
    box-shadow: none !important;
    border: 1px solid #ddd;
  }
}

@media (max-width: 960px) {
  .header-card {
    padding: 16px 20px !important;
  }

  .header-card h1 {
    font-size: 1.5rem !important;
  }
  
  .header-card .d-flex:first-child {
    flex-direction: column;
    align-items: flex-start !important;
  }
  
  .export-btn, .print-btn {
    font-size: 0.85rem;
    padding: 8px 12px;
  }

  .d-flex.gap-3 {
    gap: 8px !important;
  }

  .filter-chip {
    font-size: 0.85rem;
  }

  .table-header {
    flex-direction: column;
    align-items: flex-start !important;
  }

  .count-chip {
    margin-top: 12px;
  }
}

@media (max-width: 600px) {
  .custom-table :deep(th),
  .custom-table :deep(td) {
    padding: 12px 8px !important;
    font-size: 0.85rem !important;
  }
  
  .export-btn span,
  .print-btn span {
    display: none;
  }
}
</style>