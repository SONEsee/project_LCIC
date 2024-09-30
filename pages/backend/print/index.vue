<template>
   <section class="pa-5" id="main-content">
     <div>
       <v-btn class="button" to="../backend/searchuser">
         <v-icon icon="mdi-arrow-left" style="font-size: 150%;"></v-icon>
       </v-btn>
     </div>
     <div class="text-end mt-5 button">
       <v-btn @click="print" class="bg-indigo-accent-4">
         <v-icon icon="mdi-printer-outline"></v-icon> ພີມ
       </v-btn>
     </div>
 
     <!-- Header -->
     <v-row>
       <v-col>
         <div>
           <v-row align="center">
             <v-col cols="auto">
               <v-img
                 src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQguq0YjU42M_ijrBwnE9IpgFAFeMZQCDDJVi3yrfOCog&s"
                 width="70"
               ></v-img>
             </v-col>
             <v-col>
               <div class="row-content text-center float-left">
                 <h4>ບໍລິສັດ ຂໍ້ມູນຂ່າວສານສິນເຊື່ອເເຫ່ງ ສປປ ລາວ</h4>
                 <h4>Lao Credit Information Company</h4>
               </div>
             </v-col>
           </v-row>
         </div>
       </v-col>
       <v-col>
         <div class="float-right row-content">
          <p class="no-margin">Lao Credit Information Company</p>
          <p class="no-margin">2nd Floor, Lao Security Exchange Building</p>
          <p class="no-margin">Phonthan Village, Xaysettha District, Vientiane Capital</p>
          <p class="no-margin">Telephone: (856)-21-25429</p>
          <p class="no-margin">Email: info@lcic.com.la</p>
         </div>
       </v-col>
     </v-row>
 
     <v-row>
       <v-col>
         <div class="text-center">
           <h3 class="text-md">
             ບົດລາຍງານສິນເຊື່ອຄົບຖວ້ນ(ສໍາລັບນິຕິບຸກຄົນ)
           </h3>
         </div>
       </v-col>
     </v-row>
 
     <!-- References -->
     <!-- <v-row>
       <v-col>
         <div>
           <ul class="text-start">
             <li>ອ້າງອີງການສອບຖາມ:</li>
             <li>ລະຫັດວິສາຫະກິດ:</li>
             <li>ລະຫັດຂສລ:</li>
             <li>ປະເພດເງິນກູ້:</li>
             <li>ຜູ້ສອບຖາມຂໍ້ມູນ:</li>
           </ul>
         </div>
       </v-col>
 
       <v-col>
         <div v-if="enterpriseInfo">
           <ul class="text-start">
             <li>: </li>
             <li>: {{ enterpriseInfo.EnterpriseID }}</li>
             <li>: {{ enterpriseInfo.LCICID }}</li>
             <li>: </li>
             <li>: {{ user.MID?.code }}</li>
           </ul>
         </div>
       </v-col>
 
       <v-col>
         <div>
           <ul class="text-start">
             <li>ຂໍ້ມູນທີ່ຜ່ານມາ:</li>
             <li>ຊື່ບໍລິສັດພາສາລາວ:</li>
             <li>ຊື່ບໍລິສັດພາສາອັງກິດ:</li>
             <li>ຊື່ຜູ້ຈັດການທົ່ວໄປ:</li>
             <li>ປະເພດທຸລະກິດ:</li>
           </ul>
         </div>
       </v-col>
 
       <v-col>
         <div v-if="enterpriseInfo">
           <ul class="text-start">
             <li>: </li>
             <li>: {{ enterpriseInfo.enterpriseNameLao }}</li>
             <li>: {{ enterpriseInfo.eneterpriseNameEnglish }}</li>
             <li>: {{ invesInfo.investorName }}</li>
             <li>: </li>
           </ul>
         </div>
       </v-col>
     </v-row> -->

  <v-row justify="center justify-space-between" >
    <v-col cols="12" sm="4" md="3" lg="2" xl="2">
      ອ້າງອີງການສອບຖາມ <br>
      ---

   </v-col>
    <v-col cols="12" sm="4" md="3" lg="2" xl="2">
     <div v-if="enterpriseInfo">
      ລະຫັດວິສາຫະກິດ <br>
      <b><p class="blue--text">{{ enterpriseInfo.EnterpriseID }}</p></b>
     </div>
   </v-col>
    <v-col cols="12" sm="4" md="3" lg="2" xl="2">
      <div v-if="enterpriseInfo">
      ລະຫັດຂສລ <br>
      <b><p class="blue--text">{{ enterpriseInfo.LCICID }}</p></b>
      </div>
   </v-col>
    <v-col cols="12" sm="4" md="3" lg="2" xl="2">
      <div v-if="enterpriseInfo">
      ປະເພດເງິນກູ້ <br>
      <b><p class="blue--text">---</p></b>
      </div>
   </v-col>
    <v-col cols="12" sm="4" md="3" lg="2" xl="2">
      <div v-if="enterpriseInfo">
      ຜູ້ສອບຖາມຂໍ້ມູນ <br>
      <b><p class="blue--text">{{ user.MID?.code }}</p></b>
      </div>
   </v-col>
  </v-row>

  <v-row justify="center  justify-space-between">
    <v-col cols="12" sm="4" md="3" lg="2" xl="2">
      ຂໍ້ມູນທີ່ຜ່ານມາ <br>
      ---

   </v-col>
    <v-col cols="12" sm="4" md="3" lg="2" xl="2">
      ຊື່ບໍລິສັດພາສາລາວ <br>
      ---
   </v-col>
    <v-col cols="12" sm="4" md="3" lg="2" xl="2">
      ຊື່ບໍລິສັດພາສາອັງກິດ <br>
      ---
   </v-col>
    <v-col cols="12" sm="4" md="3" lg="2" xl="2">
      ຊື່ຜູ້ຈັດການທົ່ວໄປ <br>
      ---
   </v-col>
    <v-col cols="12" sm="4" md="3" lg="2" xl="2">
      ປະເພດທຸລະກິດ <br>
      ---
   </v-col>
  </v-row>

     <!-- Loan Summary -->
     <v-row>
       <v-col>
         <div class="row-content">
           ລວມວົງເງິນກູ້ທີ່ເຄື່ອນໄຫວທັງໝົດ
         </div>
         <v-data-table
           :headers="headers"
           :items="tableData"
           class="elevation-1"
           :items-per-page="-1"
           hide-default-footer
         >
           <template v-slot:item.id="{ item }">
             {{ item.id }}
           </template>
           <template v-slot:item.bank="{ item }">
             {{ item.bank }}
           </template>
           <template v-slot:item.lon_insert_date="{ item }">
             {{ item.lon_insert_date }}
           </template>
           <template v-slot:item.lon_outstanding_balance="{ item }">
             {{ item.lon_outstanding_balance }}
           </template>
           <template v-slot:item.lon_currency_code="{ item }">
             {{ item.lon_currency_code }}
           </template>
           <template v-slot:item.lon_class="{ item }">
             {{ item.lon_class }}
           </template>
           <template v-slot:item.lon_class_history="{ item }">
             {{ item.lon_class_history }}
           </template>
         </v-data-table>
       </v-col>
     </v-row>
 
     <!-- Loan Detail With Collateral Info -->
     <v-row>
       <v-col>
         <div class="row-content">ລາຍລະອຽດວົງເງິນກູ້</div>
         <v-data-table
           :headers="mainHeaders"
           :items="loan_detail_active"
           item-value="id"
           class="elevation-1"
         >
           <template v-slot:item="{ item }">
             <tr>
               <td class="header-h">{{ item.bank }}</td>
               <td class="header-h">{{ item.id }}</td>
               <td class="header-h">{{ item.lon_open_date }}</td>
               <td class="header-h">{{ item.lon_expiry_date }}</td>
               <td class="header-h">{{ item.lon_credit_line }}</td>
               <td class="header-h">{{ item.lon_outstanding_balance }}</td>
               <td class="header-h">{{ item.lon_currency_code }}</td>
               <td class="header-h">{{ item.lon_int_rate }}</td>
               <td class="header-h">{{ item.lon_purpose_code }}</td>
               <td class="header-h">{{ item.lon_no_days_slow }}</td>
               <td class="header-h">{{ item.lon_class }}</td>
               <td class="header-h">{{ item.lon_type }}</td>
               <td class="header-h">{{ item.lon_term }}</td>
               <td class="header-h">{{ item.lon_status }}</td>
             </tr>

             <tr v-if="item.collateral_history && item.collateral_history.length > 0">
            <td colspan="100%">
              <v-data-table
                v-for="(collateral, index) in item.collateral_history"
                :key="index"
                :headers="getCollateralHeaders(collateral.col_type)" 
                :items="[collateral]"
                class="elevation-0 header-background"
                hide-default-footer
                dense
              >
                <template v-slot:item.col_id>
                  <td>{{ collateral.col_id }}</td>
                </template>
                <template v-slot:item.col_type>
                  <td>{{ collateral.col_type }}</td>
                </template>
                <template v-slot:item.related_record.col_value>
                  <td>{{ collateral.related_record.col_value }}</td>
                </template>
              </v-data-table>
            </td>
          </tr>

        
             <tr>
               <td colspan="100%">
                 <!-- <v-data-table
                   v-if="item.lon_class_history && item.lon_class_history.length > 0"
                   :headers="subHeaders"
                   :items="item.lon_class_history"
                   class="elevation-0 header_color"
                   hide-default-footer
                   dense
                 >
                   <template v-slot:header.period>
                     <th class="white--text">Period</th>
                   </template>
                   <template v-slot:header.lon_credit_line>
                     <th class="white--text">Credit Line</th>
                   </template>
                   <template v-slot:header.lon_outstanding_balance>
                     <th class="white--text">Outstanding Balance</th>
                   </template>
                   
                 </v-data-table> -->
                 <v-data-table
  v-if="item.lon_class_history && item.lon_class_history.length > 0"
  :headers="subHeaders"
  :items="item.lon_class_history"
  class="elevation-0 custom-header-color"
  hide-default-footer
  dense
>
  <template v-slot:header.period>
    <th class="white--text">Period</th>
  </template>
  <template v-slot:header.lon_credit_line>
    <th class="white--text">Credit Line</th>
  </template>
  <template v-slot:header.lon_outstanding_balance>
    <th class="white--text">Outstanding Balance</th>
  </template>
  <template v-slot:header.lon_no_days_slow>
    <th class="white--text">Outstanding Balance</th>
  </template>
  <template v-slot:header.lon_currency_code>
    <th class="white--text">Outstanding Balance</th>
  </template>
  <template v-slot:header.lon_class>
    <th class="white--text">Outstanding Balance</th>
  </template>
  <template v-slot:header.lon_status>
    <th class="white--text">Outstanding Balance</th>
  </template>
</v-data-table>


               </td>
             </tr>
           </template>
         </v-data-table>
       </v-col>
     </v-row>
   </section>
 </template>
 
 <script lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

export default {
  setup() {
    const tableData = ref([]);
    const loan_detail_inactive = ref([]);
    const loan_detail_active = ref([]);
    const user = ref({});
    const enterpriseInfo = ref(null) // Add ref for enterprise_info
    const invesInfo = ref(null) // Add ref for inves_info
    const headers = ref([
      { title: 'ສະມາຊິກ', value: 'bnk_code' },
      { title: 'Loan ID', value: 'loan_id' },
      { title: 'Loan Open Date', value: 'lon_open_date' },
      { title: 'Loan Credit Line', value: 'lon_credit_line' },
      { title: 'Outstanding Balance', value: 'lon_outstanding_balance' },
      { title: 'Loan Currency Code', value: 'lon_currency_code' },
      { title: 'Number of Days Slow', value: 'lon_no_days_slow' },
      { title: 'Loan Class', value: 'lon_class' },
      { title: 'Loan Update Date', value: 'lon_update_date' },
      { title: 'Loan Status', value: 'lon_status' },
    ])
// B1
    const mainHeaders = ref([
      { title: 'ສະມາຊິກ', value: 'bank'  },
      { title: 'Loan ID', value: 'id' },
      { title: 'Loan Open Date', value: 'lon_open_date' },
      { title: 'Loan Expiry Date', value: 'lon_expiry_date' }, 
      { title: 'Loan Credit Line', value: 'lon_credit_line' },
      { title: 'Outstanding Balance', value: 'lon_outstanding_balance'},
      { title: 'Currency Code', value: 'lon_currency_code'},
      { title: 'Loan Interest Rate', value: 'lon_int_rate'},
      { title: 'Loan Purpose Code', value: 'lon_purpose_code'},
      { title: 'Number of Days Slow', value: 'lon_no_days_slow'},
      { title: 'Loan Class', value: 'lon_class'},
      { title: 'Loan Type', value: 'lon_type'},
      { title: 'Loan Term', value: 'lon_term'},
      { title: 'Loan Status', value: 'lon_status'}
    ])
    const subHeaders = ref([
      { title: 'Period', value: 'period' },
      { title: 'Credit Line', value: 'lon_credit_line' },
      { title: 'Outstanding Balance', value: 'lon_outstanding_balance'},
      { title: 'Number of Days Slow', value: 'lon_no_days_slow'},
      { title: 'Currency Code', value: 'lon_currency_code'},
      { title: 'Loan Class', value: 'lon_class'},
      { title: 'Loan Status', value: 'lon_status'},
      
   ])
   const subHeaders_collteral = ref([
      {title : 'col_id', value: 'col_id'},
      {title : 'col_type', value: 'col_type'},
      {title : 'colleteral_info', value: 'related_record.col_value'},
   ])
// Add Header of Collateral_Type
   const realEstateHeaders = ref([
      { title: 'Collateral ID', value: 'related_record.col_id' },
      { title: 'Collateral Type', value: 'related_record.col_type' },
      { title: 'Land No', value: 'related_record.land_no' },
      { title: 'Land Map Number', value: 'related_record.land_map_no' },
      { title: 'Value', value: 'related_record.col_value' },

    ]);
    const moneyMiaHeaders = ref([
      { title: 'Collateral ID', value: 'related_record.col_id' },
      { title: 'Collateral Type', value: 'related_record.col_type' },
      { title: 'Account No', value: 'related_record.account_no' },
      { title: 'Account Type', value: 'related_record.account_type' },
      { title: 'Value', value: 'related_record.value' },
    ]);
    const equipmentHeaders = ref([
      { title: 'Collateral ID', value: 'related_record.col_id' },
      { title: 'Collateral Type', value: 'related_record.col_type' },
      { title: 'Machine No', value: 'related_record.machine_no' },
      { title: 'Machine Type', value: 'related_record.machine_type' },
      { title: 'Value', value: 'related_record.value' },
    ]);
    const projectHeaders = ref([
      { title: 'Collateral ID', value: 'related_record.col_id' },
      { title: 'Collateral Type', value: 'related_record.col_type' },
      { title: 'Ministry Name', value: 'related_record.ministry' },
      { title: 'Project No', value: 'related_record.project_number' },
      { title: 'Value', value: 'related_record.value' },
    ]);
    const vehicleHeaders = ref([
      { title: 'Collateral ID', value: 'related_record.col_id' },
      { title: 'Collateral Type', value: 'related_record.col_type' },
      { title: 'Plate No', value: 'related_record.plate_number' },
      { title: 'Engine No', value: 'related_record.engine_number' },
      { title: 'Value', value: 'related_record.value' },
    ]);
    const guarantorHeaders = ref([
      { title: 'Collateral ID', value: 'related_record.col_id' },
      { title: 'Collateral Type', value: 'related_record.col_type' },
      { title: 'National ID', value: 'related_record.national_id' },
      { title: 'Guarantor Name', value: 'related_record.surname_english' },
      { title: 'Value', value: 'related_record.value' },
    ]);
    const goldsilverHeaders = ref([
      { title: 'Collateral ID', value: 'related_record.col_id' },
      { title: 'Collateral Type', value: 'related_record.col_type' },
      { title: 'Weight', value: 'related_record.weight' },
      { title: 'Unit', value: 'related_record.unit' },
      { title: 'Value', value: 'related_record.value' },
    ]);
   //  const guarantor_comHeaders = ref([
   //    { title: 'Collateral ID', value: 'related_record.col_id' },
   //    { title: 'Collateral Type', value: 'related_record.col_type' },
   //    { title: 'Land No', value: 'related_record.weight' },
   //    { title: 'Land Map Number', value: 'related_record.unit' },
   //    { title: 'Land Value', value: 'related_record.value' },
   //  ]);

    const route = useRoute()
    
    onMounted(() => {
      const enterpriseID = route.query.EnterpriseID as string
      const lcicID = route.query.LCICID as string
      const userData = localStorage.getItem('user_data');
      if (userData) {
         user.value = JSON.parse(userData);
         console.log('User data:', user.value)
      }

      fetchData(enterpriseID, lcicID)
    })

    const fetchData = async (enterpriseID: string, lcicID: string) => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/report/?EnterpriseID=${enterpriseID}&LCICID=${lcicID}`)
        if (response.ok) {
          const data = await response.json()
          tableData.value = data.loan_info
          loan_detail_inactive.value = data.inactive_loans
          loan_detail_active.value = data.active_loans

          // Store enterprise_info and inves_info
          enterpriseInfo.value = data.enterprise_info
          invesInfo.value = data.inves_info

          if (data.enterprise_info.length > 0) {
            enterpriseInfo.value = data.enterprise_info[0]
            }

          if (data.inves_info.length > 0) {
            invesInfo.value = data.inves_info[0]
           } 

          console.log('Fetched enterprise_info:', enterpriseInfo.value)
          console.log('Fetched inves_info:', invesInfo.value)
          console.log('Fetched loan_detail:', loan_detail_active.value)
        } else {
          console.error('Error fetching data:', response.statusText)
        }
      } catch (error) {
        console.error('Error occurred while fetching data:', error)
      }
    };
    const getCollateralHeaders = (col_type) => {
      if (col_type === 'c2.1') {
        return realEstateHeaders.value;
      } else if (col_type === 'c2.2') {
        return moneyMiaHeaders.value;
      } else if (col_type === 'c2.3') {
        return equipmentHeaders.value;
      } else if (col_type === 'c2.4') {
        return projectHeaders.value;
      } else if (col_type === 'c2.5') {
        return vehicleHeaders.value;
      } else if (col_type === 'c2.6') {
        return guarantorHeaders.value;
      } else if (col_type === 'c2.7') {
        return goldsilverHeaders.value;
      }
      
      return subHeaders_collteral.value; // Default headers if no match
    };

    const print = () => {
      window.print(); // Trigger browser print
    };

    return {
      headers,
      tableData,
      enterpriseInfo,
      invesInfo,
      user,
      loan_detail_inactive,
      loan_detail_active,
      mainHeaders,
      subHeaders,
      subHeaders_collteral,
      getCollateralHeaders,
      print
    }
  },
}

</script>
 
 <style scoped>
 #main-content {
   padding: 20px;
 }
 
 .button {
   margin-bottom: 20px;
 }
 
 .row-content {
   margin-bottom: 15px;
 }
 
 /* Print styles */
 @media print {
   .button {
     display: none;
   }
 
   #main-content {
     padding: 0;
   }
 
   .header-h {
     font-size: smaller;
   }
 
   .text-center {
     font-size: larger;
   }
 
   .text-start {
     font-size: smaller;
   }
 }
 /* .header-background th {
  background-color: #0e008b ;
  color: #ffffff;
} */
/* .header-h {
  background-color: #0031a9 ;
  color: #ffffff; 
} */
.re-m{
   margin:0px !important;
   padding: 0px !important;
}
.header_color th{
   background-color: #0e008b;
}
.blue-header{
  background-color: #0e008b; /* Blue color */
}
.custom-header-color .v-data-table-header th {
  background-color: #2196F3; /* Blue color */
  color: white; /* Text color white for contrast */
}
.header-background {
   color: black !important;
   font-size: bold !important;
}
.no-margin {
  margin-top: 0;
  margin-bottom: 0;
  line-height: 14px;
  font-size:12px;
}

 </style>
 