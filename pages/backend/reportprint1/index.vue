<template>
  <v-container>
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
          <v-col cols="8"  class="text-center">
            <div>
              <v-row align="center">
                <v-col cols="auto">
                  <v-img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQguq0YjU42M_ijrBwnE9IpgFAFeMZQCDDJVi3yrfOCog&s"
                    width="70"
                  ></v-img>
                </v-col>
                <v-col>
                  <div class="row-content text-start float-left">
                    <h4>ບໍລິສັດ ຂໍ້ມູນຂ່າວສານສິນເຊື່ອເເຫ່ງ ສປປ ລາວ</h4>
                    <hr>
                    <h4>Lao Credit Information Company</h4>
                  </div>
                </v-col>
              </v-row>
            </div>
          </v-col>
          <v-col cole="12"  class="text-end mt-4">
            <div class=""  v-if="enterpriseInfo">
              <p>ລະຫັດວິສາຫະກິດ: <b>{{ enterpriseInfo.EnterpriseID }}</b></p>
              
              <p>ລະຫັດຂສລ: <b>{{ enterpriseInfo.LCICID}}</b></p>
            </div>
            <div class="" v-if="user">
              <p>ຜູ້ສອບຖາມຂໍ້ມູນ: <b> {{ user.nameE }}</b> ຈາກທະນາຄານ: <b>{{ user.MID?.code }}</b></p>
            </div>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <div class="text-center">
              <h3 class="text-md mt-5">
                <b>ບົດລາຍງານສິນເຊື່ອຄົບຖວ້ນ(ສໍາລັບນິຕິບຸກຄົນ)</b>
              </h3>
            </div>
          </v-col>
        </v-row>
        <v-col cols="12"  class="mt-5">
         
          <v-col cols="12">
            <v-row>

          
          <v-col cols="12" >
            <v-row justify="center  justify-space-between" >
              <v-col cols="12" >
                <v-row class="ml-2">
                  
                  <p v-if="enterpriseInfo"><b>  Kyc No:</b> {{ enterpriseInfo.investmentAmount }},</p>
                  <p v-if="enterpriseInfo" class="ml-5"><b>  ຊື່ບໍລິສັດພາສາລາວ:</b> {{ enterpriseInfo.eneterpriseNameEnglish }} </p> <br>
                </v-row>
                <v-row>
                   <p v-if="enterpriseInfo" class="ml-5"><b>  ຊື່ຜູ້ຈັດການທົ່ວໄປ:</b> --- </p>
                </v-row>
              </v-col>
            </v-row>
          </v-col>

         </v-row>
          </v-col>
        </v-col>
      </section></v-col
    >
    <v-col cols="12">
      <p ><b> - ຂໍ້ມູນທົວໄປຜູ້ກູ້</b></p>
     <v-row class="mt-2">
      <v-col cols="4" v-if="enterpriseInfo" >
        <p><b>ຊື່ວິສາຫະກິດ:</b> {{ enterpriseInfo.enterpriseNameLao }}</p>
        <p><b>ຊື່ວິສາຫະກິດ:</b> {{ enterpriseInfo.regisStrationOfficeType }}</p>
        <p><b>ເລກທີ:</b> {{ enterpriseInfo.EnterpriseID }}</p>
      </v-col>
      <v-col cols="4" v-if="enterpriseInfo">
<p><b>ວັນທີອອກໃບທະບຽນ:</b> {{ enterpriseInfo.regisDate.slice(0, -18) }}</p>
<p><b>ທີ່ຕັ້ງວິສາຫະກິດ:</b> {{ enterpriseInfo.enLocation }}</p>
<p><b>ພາສວນເສດຖະກິດ:</b> --</p>
      </v-col>
      <v-col cols="4" v-if="enterpriseInfo">
        <p><b >ທຶນຈົດທະບຽນ:</b> {{ enterpriseInfo.investmentAmount }}</p>
        <p><b>ທຶນຈົດທະບຽນ:</b> --</p>
        <p><b>ຊື່ເຈົ້າຂອງວິສາຫະກິດ:</b> --</p>
      </v-col>
     </v-row>

    </v-col>
    <v-col cols="12" >
      <p><b>- ລວມວົງເງິນກູ້ທີ່ເຄື່ອນໄຫວທັງໝົດ</b></p>
      <v-table class="mt-5 elevation-1 v-data-table1" >
  <thead>
    <tr style="font-size: 90%;  " class="text-bold">
  
      <th><b>ສະມາຊິກ</b></th>
      <th><b> ລະຫັດເງິນກູ້</b></th>
      <th><b>ມືເປີດ</b></th>
      <th>ວົງເງິນກູ້</th>
      <th>ຍອດເງິນເຫຼືອ</th>
      <th>ສະກຸນເງິນ</th>
      <th>ຈຳນວນວັນຄ້າງຈ່າຍ</th>
      <th>ປະເພດ</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="(item, index) in tableData" :key="index">
      <td>{{ item.bnk_code }}</td>
      <td>{{ item.loan_id }}</td>
      <td>{{ item.lon_open_date.slice(0, -15) }}</td>
      <td>{{ item.lon_credit_line.slice(0, -3) }}</td>
      <td>{{ item.lon_outstanding_balance.slice(0, -3) }}</td>
      
      <td>{{ item.lon_currency_code }}</td>
      <td>{{ item.lon_no_days_slow }}</td>
      <td>{{ item.lon_class }}</td>

 
    </tr>
    
  </tbody>
</v-table>

  
    </v-col>
    <p><b>- ຂໍ້ມູນປະຫວັດການເຂົ້າຄົ້ນຫາ</b></p>
    <v-table>
      <thead>
        <tr>
          <th>ລຳດັບ</th>
          <th>ວັນເດືອນທີ່ຄົ້ນຫາ</th>
          <th>ຜູ້ຄົ້ນຫາ</th>
          <th>ເຫດຜົນການຄົ້ນຫາ</th>
          <th>ປະເພດເງິນກູ້</th>
        </tr>
      </thead>
      <tbody>
        <tr  v-for="(item, index) in search_history" :key="index">
          
          <!-- {{item}} -->
          <td> {{ index + 1 }}</td>
<<<<<<< HEAD
          <td>{{ item.date }}</td>
=======
          <td>{{ item.id }}</td>
>>>>>>> 7a6a73f4385a12dae435ab5762d85d2ece83ccaa
          <td>{{ item.bnk_code }}</td>
          <td>{{ item.lon_purpose }}</td>
          
          <td>--</td>
          
          
        </tr>
      </tbody>
    </v-table>
    <p><b>-ລາຍລະອຽດຂໍ້ມູນເງິນກູ້</b></p>
    
    <v-col cols="12">
      <v-row>
        <v-col cols="12">
          <v-row>
            <v-col
             
              class="mt-2"
              v-for="(item, index) in loan_detail_active"
              :key="index"
            >
              <div
                class="ml-1 rounded-lg"
                style="border: 1px solid #1565c0; padding: 10px"
              >

                <div>
                  
                  <p>
                    <b>- ຂໍ້ມູນລາຍລະອຽດເງິນກູ້ບວ້ງທີ {{ index + 1 }}</b>
                  </p>
                  <v-col cols="12">
                    <v-row>
                      <v-col cols="4" md="4" >
                        <p> <b>ລະຫັດເງິນກູ້: </b>{{ item.id }}</p>
                        <p> <b>ມື້ເປິດເງິນກູ້: </b>{{ item.lon_open_date.slice(0, -10) }}</p>
                        <p> <b>ມື້ໝົດສັນຍາເງິນກູ້ເງິນກູ້: </b>{{ item.lon_expiry_date }}</p>
                      </v-col>
                      <v-col cols="4" md="4">
                        <p> <b>ໄລຍະການກູ້ຢືມ:</b> {{ item.lon_term }}</p>
                        <p> <b>ວົງເງິນໃນອານຸມັດ:</b> {{ item.lon_credit_line.toLocaleString() }} {{  item.lon_currency_code }}</p>
                        <p> <b>ອັດຕາດອກເບ້ຍ:</b> {{ item.lon_int_rate }}</p>
                      </v-col>
                      <v-col cols="4" md="4">
                        <p><b>ຍອດເງິນເຫຼືອຕົ້ນທຶນ:</b> {{ Number(item.lon_outstanding_balance).toLocaleString() }} {{  item.lon_currency_code }}</p>
                        <p><b>ເຫດຜົນຫການສິ້ນສຸດໜີ້:</b> -- </p>

                      </v-col>
                    </v-row>

                  </v-col>

                  <hr
                    color="indigo"
                    model-value="100"
                    rounded
                  ></hr>

                  <v-col cols="12">
                    <p v-if="item.collateral_history.length">
                      <b>- ຂໍ້ມູນຫຼັກຊັບຄໍ້າປະກັນ</b>
                    </p>
                    <v-row>
                      <v-col
                        v-for="(collateral, index) in item.collateral_history"
                        class="mt-2"
                        
                        style="font-size: 80%"
                        :cols="getCols(item.collateral_history ? item.collateral_history.length : 1)"
                      >
                        <div
                          style="border: #1565c0 1px solid; padding: 10px"
                          class="rounded-lg"
                        >
                          <v-col cols="12">
                            <div
                              v-if="
                                collateral.col_type === 'C2.1' ||
                                collateral.col_type === 'c2.1'
                              "
                            >
                              <p>
                                ລົງຂໍ້ມູນວັນທີ:
                                <b>{{
                                  collateral.collateral_info.insert_date
                                }}</b>
                              </p>
                              <p>ປະເພດຫຼັກຊັບ:<b>ດີນ</b></p>

                              <p>
                                ເລກທີໃບຕາດິນ:<b>{{
                                  collateral.related_record.land_no
                                }}</b>
                              </p>
                              <p>
                                ເລກທີແຜ່ນທີຶ:<b>{{
                                  collateral.related_record.land_map_no
                                }}</b>
                              </p>
                              <p>
                                ເນື້ອທີ:<b>{{
                                  collateral.related_record.col_area
                                }}</b>
                              </p>
                            </div>
                            <div
                              v-else-if="
                                collateral.col_type === 'C2.2' ||
                                collateral.col_type === 'c2.2'
                              "
                            >
                              <p>
                                ລົງຂໍ້ມູນວັນທີ:
                                <b>{{
                                  collateral.collateral_info.insert_date
                                }}</b>
                              </p>
                              <p>ປະເພດຫຼັກຊັບ:<b>ເອກະສານມີຄ່າ</b></p>

                              <p>
                                ເລກເຈົ້າຂອງບັນຊີ:<b>{{
                                  collateral.related_record.account_no
                                }}</b>
                              </p>
                              <p>
                                ປະເພດບັນຊີ:<b>{{
                                  collateral.related_record.account_type
                                }}</b>
                              </p>
                              <p>
                                ມູນຄ່າ:<b>{{
                                  collateral.related_record.value
                                }}</b>
                              </p>
                            </div>
                            <div
                              v-else-if="
                                collateral.col_type === 'C2.3' ||
                                collateral.col_type === 'c2.3'
                              "
                            >
                              <p>
                                ລົງຂໍ້ມູນວັນທີ:
                                <b>{{
                                  collateral.collateral_info.insert_date
                                }}</b>
                              </p>
                              <p>ປະເພດຫຼັກຊັບ:<b>ເຄື່ອງຈັກ</b></p>

                              <p>
                                ປະເພດເຄື່ອງຈັກ:<b>{{
                                  collateral.related_record.machine_type
                                }}</b>
                              </p>
                              <p>
                                ເລກທີເຄື່ອງຈັກ:<b>{{
                                  collateral.related_record.machine_no
                                }}</b>
                              </p>
                              <p>
                                ມູນຄ່າ:<b>{{
                                  collateral.related_record.value
                                }}</b>
                              </p>
                            </div>
                            <div
                              v-else-if="
                                collateral.col_type === 'C2.4' ||
                                collateral.col_type === 'c2.4'
                              "
                            >
                              <p>
                                ລົງຂໍ້ມູນວັນທີ:
                                <b>{{
                                  collateral.collateral_info.insert_date
                                }}</b>
                              </p>
                              <p>ປະເພດຫຼັກຊັບ:<b>ໂຄງການ</b></p>

                              <p>
                                ຊື່ໂຄງການ:<b>{{
                                  collateral.related_record.project_number
                                }}</b>
                              </p>
                              <p>
                                ເລກທີໂຄງການ:<b>{{
                                  collateral.related_record.machine_type
                                }}</b>
                              </p>
                              <p>
                                ມູນຄ່າ:<b>{{
                                  collateral.related_record.value
                                }}</b>
                              </p>
                            </div>
                            <div
                              v-else-if="
                                collateral.col_type === 'C2.5' ||
                                collateral.col_type === 'c2.5'
                              "
                            >
                              <p>
                                ລົງຂໍ້ມູນວັນທີ:
                                <b>{{
                                  collateral.collateral_info.insert_date
                                }}</b>
                              </p>
                              <p>ປະເພດຫຼັກຊັບ:<b>ຍານພາຫະນະ</b></p>

                              <p>
                                ເລກທະບຽນພາຫະນະ:<b>{{
                                  collateral.related_record.plate_number
                                }}</b>
                              </p>
                              <p>
                                ເລກຈັກ:<b>{{
                                  collateral.related_record.engine_number
                                }}</b>
                              </p>
                              <p>
                                ມູນຄ່າ:<b>{{
                                  collateral.related_record.value
                                }}</b>
                              </p>
                            </div>
                            <div
                              v-else-if="
                                collateral.col_type === 'C2.6' ||
                                collateral.col_type === 'c2.6'
                              "
                            >
                              <p>
                                ລົງຂໍ້ມູນວັນທີ:
                                <b>{{
                                  collateral.collateral_info.insert_date
                                }}</b>
                              </p>
                              <p>ປະເພດຫຼັກຊັບ:<b>ບຸກຄົນຄໍ້າ</b></p>

                              <p>
                                ເລກບັດປະຈຳຕົວຂອງຜູ້ຄໍ້າປະກັນ:<b>{{
                                  collateral.related_record.gua_national_id
                                }}</b>
                              </p>
                              <p>
                                ຊື່ແທ້:<b>{{
                                  collateral.related_record.gua_lao_name
                                }}</b>
                              </p>
                              <p>
                                ມູນຄ່າ:<b>{{
                                  collateral.related_record.value
                                }}</b>
                              </p>
                            </div>
                            <div
                              v-else-if="
                                collateral.col_type === 'C2.7' ||
                                collateral.col_type === 'c2.7'
                              "
                            >
                              <p>
                                ລົງຂໍ້ມູນວັນທີ:
                                <b>{{
                                  collateral.collateral_info.insert_date
                                }}</b>
                              </p>
                              <p>ປະເພດຫຼັກຊັບ:<b>ຄໍາ</b></p>

                              <p>
                                ລະຫັດຂອງຫຼັກຊັບຄໍ້າປະກັນ:<b>{{
                                  collateral.related_record.col_id
                                }}</b>
                              </p>
                              <p>
                                ນໍ້າໜັກ:<b>{{
                                  collateral.related_record.weight
                                }}</b>
                              </p>
                              <p>
                                ມູນຄ່າ:<b>{{
                                  collateral.related_record.value
                                }}</b>
                              </p>
                            </div>
                            <div
                              v-else-if="
                                collateral.col_type === 'C2.7' ||
                                collateral.col_type === 'c2.7'
                              "
                            >
                              <p>
                                ລົງຂໍ້ມູນວັນທີ:
                                <b>{{
                                  collateral.collateral_info.insert_date
                                }}</b>
                              </p>
                              <p>ປະເພດຫຼັກຊັບ:<b>ຄໍາ</b></p>

                              <p>
                                ລະຫັດຂອງຫຼັກຊັບຄໍ້າປະກັນ:<b>{{
                                  collateral.related_record.col_id
                                }}</b>
                              </p>
                              <p>
                                ລະຫັດວິສາຫະກິດ:<b>{{
                                  collateral.related_record.gua_enterprise_code
                                }}</b>
                              </p>
                              <p>
                                ມູນຄ່າ:<b>{{
                                  collateral.related_record.value
                                }}</b>
                              </p>
                            </div>
                          </v-col>
                        </div>
                      </v-col>
                    </v-row>
                  </v-col>
                </div>
                <div>
                  <hr v-if="item.collateral_history.length"
                    color="indigo"
                    model-value="100"
                    rounded
                  ></hr>
                  <p v-if="item.lon_class_history.length">
                    <b>- ປະຫວັດການຊຳລະ</b>
                  </p>
                  <v-table>
                    <thead>
                      <tr>
                        <th>No.</th>
                        <th>Period</th>
                        <th>Credit Line</th>
                        <th>Outstanding Balance</th>
                        <th>Loan Days Slow</th>
                        <th>Loan Currency Code</th>
                        <th>Loan Class</th>
                        <th>Loan Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item , index) in item.lon_class_history">
                        <td>{{index +1}}</td>
                        <td>{{ item.period.slice(0, 2) + '-' + item.period.slice(2) }}</td>
                        <td>{{Number( item.lon_credit_line).toLocaleString() }}</td>
                        <td>{{Number( item.lon_outstanding_balance).toLocaleString() }}</td>
                        <td>{{ item.lon_no_days_slow }}</td>
                        <td>{{ item.lon_currency_code }}</td>
                        <td>{{ item.lon_class }}</td>
                        <td>{{ item.lon_status }}</td>

                      </tr>
                    </tbody>
                  </v-table>
                  <!-- <v-data-table
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
                  </v-data-table> -->
                </div>
              </div></v-col
            >
          </v-row>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <div style="border: #1565c0 1px solid; padding: 10px" class="bg-blue-darken-4 rounded-lg">
<v-col cols="12">
  <v-row>
    <v-col cols="6" >

<p> <v-icon icon="mdi-map-marker" style="font-size: 120%; color: red;"></v-icon> 2nd Floor, Lao Security Exchange Building Phonthan  Village, </p><p class="ml-5">Xaysettha District, Vientiane Capital</p>

    </v-col>
    <v-col cols="6"><p> <v-icon icon="mdi-phone" style="font-size: 100%;color: #1565c0;" class="mr-2"></v-icon>  Telephone: (856)-21-25429</p>
<p> <v-icon icon=" mdi-email-outline" style="font-size: 100%;" class="mr-2"></v-icon>  Email: info@lcic.com.la</p></v-col>
    
  </v-row>
</v-col>
          </div>
        </v-col>
      </v-row>
    </v-col></v-container>
</template>

<script lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

export default {
  methods: {
    getCols(length) {
      switch (length) {
        case 1:
          return 12;
        case 2:
          return 6;
        case 3:
          return 4;
        case 4:
          return 3;

        default:
          return 3;
      }
    },
    getCols1(length) {
      switch (length) {
        case 1:
          return 6;
        case 2:
          return 6;
        case 3:
          return 4;
        case 4:
          return 2;

        default:
          return 2;
      }
    },
  },

  setup() {
    const tableData = ref([]);
    const loan_detail_inactive = ref([]);
    const loan_detail_active = ref([]);
    const search_history = ref([]);
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
      // { title: "Loan Update Date", value: "lon_update_date" },
      { title: "Loan Status", value: "lon_status" },
    ]);
   
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

      fetchData(enterpriseID, lcicID);
    });

    const fetchData = async (enterpriseID: string, lcicID: string) => {
      try {
        const config = useRuntimeConfig();
        const response = await fetch(
          `${config.public.strapi.url}api/report/?EnterpriseID=${enterpriseID}&LCICID=${lcicID}`
        );
        if (response.ok) {
          const data = await response.json();
          tableData.value = data.loan_info;
          loan_detail_inactive.value = data.inactive_loans;
          loan_detail_active.value = data.active_loans;
          search_history.value = data.search_history;

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

      return subHeaders_collteral.value; 
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
      search_history,
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
    padding: 5px 10% 0 10%;
    background: fixed;
    background-image: fixed;
    font-size: 10pt !important;
  }
  h1, h2, h3, h4, h5, h6 {
      font-size: 12pt !important;
    }
    p, div, span, table {
      font-size: 10pt !important;
    }
.table {
  font-size: pt !important;
}
  .main-content {
    width: 210mm;
    height: 297mm;
    padding: 15px 3% 0 3%;
  }
  .v-data-table1 {
      font-size: 11pt !important;
    }

  .button {
    display: none;
  }
  /* div {
    page-break-inside: avoid;
    page-break-before: auto;
    page-break-after: auto;
  } */
  tr {
    page-break-inside: avoid;
    page-break-after: auto;
  }
  thead {
    display: table-header-group;
  }
  tfoot {
    display: table-footer-group;
  }
  .div.v-data-table__wrapper::-webkit-scrollbar {
      display: none;
    }
    .div.v-data-table__wrapper {
      -ms-overflow-style: none;  
      scrollbar-width: none;  
    }
}
</style>
