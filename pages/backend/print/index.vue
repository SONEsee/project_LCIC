<template>
  <v-col cols="12">
    <section class="pa-5" id="main-content">
      <div>
        <v-btn class="button" to="../backend/searchuser">
          <v-icon icon="mdi-arrow-left" style="font-size: 150%"></v-icon>
        </v-btn>
      </div>
      <div class="text-end mt-5 button">
        <v-btn @click="print" class="bg-indigo-accent-4">
          <v-icon icon="mdi-printer-outline"></v-icon> ພີມ
        </v-btn>
      </div>

      <v-row>
        <v-col cols="6" md="6" lg="6" xl="6" class="text-center">
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
        <v-col cole="6" md="6" lg="6" xl="6" class="text-end">
          <div class="float-right row-content text-start">
            <p class="no-margin">Lao Credit Information Company</p>
            <p class="no-margin">2nd Floor, Lao Security Exchange Building</p>
            <p class="no-margin">
              Phonthan Village, Xaysettha District, Vientiane Capital
            </p>
            <p class="no-margin">Telephone: (856)-21-25429</p>
            <p class="no-margin">Email: info@lcic.com.la</p>
          </div>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <div class="text-center">
            <h3 class="text-md">ບົດລາຍງານສິນເຊື່ອຄົບຖວ້ນ(ສໍາລັບນິຕິບຸກຄົນ)</h3>
          </div>
        </v-col>
      </v-row>

      <v-col cols="12" style="font-size: 1.2vw">
        <v-row justify="center justify-space-between">
          <v-col cols="3">
            ອ້າງອີງການສອບຖາມ <br />
            ---
          </v-col>
          <v-col cols="3">
            <div v-if="enterpriseInfo">
              <p>ລະຫັດວິສາຫະກິດ</p>
              <b
                ><p style="font-size: 100%">
                  {{ enterpriseInfo.EnterpriseID }}
                </p></b
              >
            </div>
          </v-col>
          <v-col cols="2">
            <div v-if="enterpriseInfo">
              ລະຫັດຂສລ <br />
              <b
                ><p style="font-size: 100%">{{ enterpriseInfo.LCICID }}</p></b
              >
            </div>
          </v-col>
          <v-col cols="2">
            <div v-if="enterpriseInfo">
              ປະເພດເງິນກູ້ <br />
              <b><p style="font-size: 100%">---</p></b>
            </div>
          </v-col>
          <v-col cols="2">
            <div v-if="enterpriseInfo">
              ຜູ້ສອບຖາມຂໍ້ມູນ <br />
              <b
                ><p style="font-size: 100%">{{ user.MID?.code }}</p></b
              >
            </div>
          </v-col>
        </v-row>
        <v-col cols="12" style="font-size: 1vw">
          <v-row justify="center  justify-space-between" v-for="(item, index) in fetData ">
            <v-col cols="3">
              ຂໍ້ມູນທີ່ຜ່ານມາ <br />
              ---
            </v-col>
            <v-col cols="3">
              ຊື່ບໍລິສັດພາສາລາວ <br />
              ---
            </v-col>
            <v-col cols="2">
              ຊື່ບໍລິສັດພາສາອັງກິດ <br />
              ---
            </v-col>
            <v-col cols="2">
              ຊື່ຜູ້ຈັດການທົ່ວໄປ <br />
              ---
            </v-col>
            <v-col cols="2">
              ປະເພດທຸລະກິດ <br />
              ---
            </v-col>
          </v-row>
        </v-col>
      </v-col>

      <v-row>
        <v-col cols="12" style="font-size: 1vw">
          <div class="row-content">ລວມວົງເງິນກູ້ທີ່ເຄື່ອນໄຫວທັງໝົດ</div>
          <v-data-table
            :headers="headers"
            :items="tableData"
            class="elevation-1"
            :items-per-page="-1"
            hide-default-footer
            style="font-size: 1vw"
          >
            <template v-slot:item.id="{ item }" style="font-size: 1.5vw">
              {{ item.id }}
            </template>
            <template v-slot:item.bank="{ item }" style="font-size: 1.5vw">
              {{ item.bank }}
            </template>
            <template
              v-slot:item.lon_insert_date="{ item }"
              style="font-size: 1.5vw"
            >
              {{ item.lon_insert_date }}
            </template>
            <template
              v-slot:item.lon_outstanding_balance="{ item }"
              style="font-size: 1.5vw"
            >
              {{ item.lon_outstanding_balance }}
            </template>
            <template
              v-slot:item.lon_currency_code="{ item }"
              style="font-size: 1.5vw"
            >
              {{ item.lon_currency_code }}
            </template>
            <template v-slot:item.lon_class="{ item }" style="font-size: 1.5vw">
              {{ item.lon_class }}
            </template>
            <template
              v-slot:item.lon_class_history="{ item }"
              style="font-size: 1.5vw"
            >
              {{ item.lon_class_history }}
            </template>
          </v-data-table>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <div class="row-content">ລາຍລະອຽດວົງເງິນກູ້</div>
          <v-data-table
            :headers="mainHeaders"
            :items="loan_detail_active"
            item-value="id"
            class="elevation-1"
            style="font-size: 12pt"
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

              <tr
                v-if="
                  item.collateral_history && item.collateral_history.length > 0
                "
              >
                
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
                
              </tr>

              <tr>
                <td colspan="100%">
                  <v-data-table
                    v-if="
                      item.lon_class_history &&
                      item.lon_class_history.length > 0
                    "
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
    </section></v-col
  >
</template>

<script lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

export default {
  setup() {
    const tableData = ref([]);
    const loan_detail_inactive = ref([]);
    const loan_detail_active = ref([]);
    const user = ref({});
    const enterpriseInfo = ref(null);
    const invesInfo = ref(null);
    const headers = ref([
      { title: "ສະມາຊິກ", value: "bnk_code" },
      { title: "Loan ID", value: "loan_id" },
      { title: "Loan Open Date", value: "lon_open_date" },
      { title: "Loan Credit Line", value: "lon_credit_line" },
      { title: "Outstanding Balance", value: "lon_outstanding_balance" },
      { title: "Loan Currency Code", value: "lon_currency_code" },
      { title: "Number of Days Slow", value: "lon_no_days_slow" },
      { title: "Loan Class", value: "lon_class" },
      { title: "Loan Update Date", value: "lon_update_date" },
      { title: "Loan Status", value: "lon_status" },
    ]);
    // B1
    const mainHeaders = ref([
      { title: "ສະມາຊິກ", value: "bank" },
      { title: "Loan ID", value: "id" },
      { title: "Loan Open Date", value: "lon_open_date" },
      { title: "Loan Expiry Date", value: "lon_expiry_date" },
      { title: "Loan Credit Line", value: "lon_credit_line" },
      { title: "Outstanding Balance", value: "lon_outstanding_balance" },
      { title: "Currency Code", value: "lon_currency_code" },
      { title: "Loan Interest Rate", value: "lon_int_rate" },
      { title: "Loan Purpose Code", value: "lon_purpose_code" },
      { title: "Number of Days Slow", value: "lon_no_days_slow" },
      { title: "Loan Class", value: "lon_class" },
      { title: "Loan Type", value: "lon_type" },
      { title: "Loan Term", value: "lon_term" },
      { title: "Loan Status", value: "lon_status" },
    ]);
    const subHeaders = ref([
      { title: "Period", value: "period" },
      { title: "Credit Line", value: "lon_credit_line" },
      { title: "Outstanding Balance", value: "lon_outstanding_balance" },
      { title: "Number of Days Slow", value: "lon_no_days_slow" },
      { title: "Currency Code", value: "lon_currency_code" },
      { title: "Loan Class", value: "lon_class" },
      { title: "Loan Status", value: "lon_status" },
    ]);
    const subHeaders_collteral = ref([
      { title: "col_id", value: "col_id" },
      { title: "col_type", value: "col_type" },
      { title: "colleteral_info", value: "related_record.col_value" },
    ]);

    const realEstateHeaders = ref([
      { title: "Collateral ID", value: "related_record.col_id" },
      { title: "Collateral Type", value: "related_record.col_type" },
      { title: "Land No", value: "related_record.land_no" },
      { title: "Land Map Number", value: "related_record.land_map_no" },
      { title: "Value", value: "related_record.col_value" },
    ]);
    const moneyMiaHeaders = ref([
      { title: "Collateral ID", value: "related_record.col_id" },
      { title: "Collateral Type", value: "related_record.col_type" },
      { title: "Account No", value: "related_record.account_no" },
      { title: "Account Type", value: "related_record.account_type" },
      { title: "Value", value: "related_record.value" },
    ]);
    const equipmentHeaders = ref([
      { title: "Collateral ID", value: "related_record.col_id" },
      { title: "Collateral Type", value: "related_record.col_type" },
      { title: "Machine No", value: "related_record.machine_no" },
      { title: "Machine Type", value: "related_record.machine_type" },
      { title: "Value", value: "related_record.value" },
    ]);
    const projectHeaders = ref([
      { title: "Collateral ID", value: "related_record.col_id" },
      { title: "Collateral Type", value: "related_record.col_type" },
      { title: "Ministry Name", value: "related_record.ministry" },
      { title: "Project No", value: "related_record.project_number" },
      { title: "Value", value: "related_record.value" },
    ]);
    const vehicleHeaders = ref([
      { title: "Collateral ID", value: "related_record.col_id" },
      { title: "Collateral Type", value: "related_record.col_type" },
      { title: "Plate No", value: "related_record.plate_number" },
      { title: "Engine No", value: "related_record.engine_number" },
      { title: "Value", value: "related_record.value" },
    ]);
    const guarantorHeaders = ref([
      { title: "Collateral ID", value: "related_record.col_id" },
      { title: "Collateral Type", value: "related_record.col_type" },
      { title: "National ID", value: "related_record.national_id" },
      { title: "Guarantor Name", value: "related_record.surname_english" },
      { title: "Value", value: "related_record.value" },
    ]);
    const goldsilverHeaders = ref([
      { title: "Collateral ID", value: "related_record.col_id" },
      { title: "Collateral Type", value: "related_record.col_type" },
      { title: "Weight", value: "related_record.weight" },
      { title: "Unit", value: "related_record.unit" },
      { title: "Value", value: "related_record.value" },
    ]);

    const route = useRoute();

    onMounted(() => {
      const enterpriseID = route.query.EnterpriseID as string;
      const lcicID = route.query.LCICID as string;
      const userData = localStorage.getItem("user_data");
      if (userData) {
        user.value = JSON.parse(userData);
        console.log("User data:", user.value);
      }

<<<<<<< HEAD
      fetchData(enterpriseID, lcicID);
    });

    const fetchData = async (enterpriseID: string, lcicID: string) => {
      try {
        const config = useRuntimeConfig();
        const response = await fetch(
          `${config.public.strapi.url}api/report/?EnterpriseID=${enterpriseID}&LCICID=${lcicID}`
        );
=======
      fetchData(enterpriseID, lcicID)
    })
    const config = useRuntimeConfig();
    const fetchData = async (enterpriseID: string, lcicID: string) => {
      try {
        const response = await fetch(`${config.public.strapi.url}api/report/?EnterpriseID=${enterpriseID}&LCICID=${lcicID}`)
>>>>>>> 8b48fd2a1696bc13a6659c284560aa69db42d491
        if (response.ok) {
          const data = await response.json();
          tableData.value = data.loan_info;
          loan_detail_inactive.value = data.inactive_loans;
          loan_detail_active.value = data.active_loans;

          enterpriseInfo.value = data.enterprise_info;
          invesInfo.value = data.inves_info;

          if (data.enterprise_info.length > 0) {
            enterpriseInfo.value = data.enterprise_info[0];
          }

          if (data.inves_info.length > 0) {
            invesInfo.value = data.inves_info[0];
          }

          console.log("Fetched enterprise_info:", enterpriseInfo.value);
          console.log("Fetched inves_info:", invesInfo.value);
          console.log("Fetched loan_detail:", loan_detail_active.value);
        } else {
          console.error("Error fetching data:", response.statusText);
        }
      } catch (error) {
        console.error("Error occurred while fetching data:", error);
      }
    };
    const getCollateralHeaders = (col_type) => {
      if (col_type === "c2.1") {
        return realEstateHeaders.value;
      } else if (col_type === "c2.2") {
        return moneyMiaHeaders.value;
      } else if (col_type === "c2.3") {
        return equipmentHeaders.value;
      } else if (col_type === "c2.4") {
        return projectHeaders.value;
      } else if (col_type === "c2.5") {
        return vehicleHeaders.value;
      } else if (col_type === "c2.6") {
        return guarantorHeaders.value;
      } else if (col_type === "c2.7") {
        return goldsilverHeaders.value;
      }

      return subHeaders_collteral.value; // Default headers if no match
    };

    const print = () => {
      window.print();
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
      print,
    };
  },
};
</script>

<style scoped>
@page {
  size: A4 portrait;
  margin: 0;

  @bottom-center {
    width: 100%;
    content: element(footer);
  }
}

@media print {
  html,
  body {
    width: 210mm;
    height: 297mm;
    padding: 10px 15% 0 15%;
    background: fixed;
    background-image: fixed;
  }

  .main-content {
    width: 210mm;
    height: 297mm;
    padding: 10px 3% 0 3%;
  }

  .button {
    display: none;
  }
}
</style>
