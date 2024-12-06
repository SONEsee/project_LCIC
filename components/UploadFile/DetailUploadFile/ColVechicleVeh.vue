<template>
    <v-card>

      <v-tabs v-model="tab" fixed-tabs color="primary" stacked>
        <v-tab value="one">ຂໍ້ມູນທີ່ອັບໂຫຼດທັງໝົດ</v-tab>
        <v-tab value="two">ຂໍ້ມູນທີ່ບໍ່ຖືກຕອ້ງ</v-tab>
        <v-tab value="three">ຂໍ້ມູນທີ່ອັບໂຫຼດສົມບູນ</v-tab>
      </v-tabs>
      <v-card-text>
        <v-window v-model="tab">
          <v-window-item value="one">
            <h3>ຂໍ້ມູນທີ່ອັບໂຫຼດທັງໝົດຂອງ: <b>ຍານພາຫະນະ.</b> </h3>
         
  
            <v-data-table :items="combinedData" :headers="headers1" density="compact">
            <template v-slot:top> </template>
            <template v-slot:header.id>
              <th style="color: #0d47a1">ID</th>
            </template>
            <template v-slot:header.lcicID>
              <th style="color: #0d47a1">LcicID</th>
            </template>
            <template v-slot:header.com_enterprise_code>
              <th style="color: #0d47a1">Com_Enterprise_Code</th>
            </template>
            <template v-slot:header.bank_customer_ID>
              <th style="color: #0d47a1">Bank_customer_ID</th>
            </template>
            <template v-slot:header.branch_id_code>
              <th style="color: #0d47a1">Branch_id_Code</th>
            </template>
            <template v-slot:header.loan_id>
              <th style="color: #0d47a1">Loan_id</th>
            </template>
            <template v-slot:header.col_id>
              <th style="color: #0d47a1">Col_id</th>
            </template>
            <template v-slot:header.account_no>
              <th style="color: #0d47a1">Account_no</th>
            </template>
            <template v-slot:item="{ item, index }">
              <tr>
                <td>{{ index + 1 }}</td>
                <td >{{ item.lcicID }}</td>
                <td>{{ item.com_enterprise_code }}</td>
                <td>{{ item.bank_customer_ID }}</td>
                <td>{{ item.branch_id_code }}</td>
                <td>{{ item.loan_id }}</td>
                <td>{{ item.col_id }}</td>
                <!-- <td>{{ item.loan_id }}</td> -->
                <td>{{ item.account_no }}</td>
              </tr>
            </template>
          </v-data-table>
          </v-window-item>
  
          <v-window-item value="two">
            <v-tabs v-model="subTab" fixed-tabs color="secondary">
              <v-tab value="two-one"> Enterprise Code Error</v-tab>
              <v-tab value="two-two">ບໍ່ມີ LCICID</v-tab>
              <v-tab value="two-three"> LCICID com_enterprise_code error </v-tab>
              <v-tab value="two-five">error </v-tab>
            </v-tabs>
            <v-window v-model="subTab">
              <v-window-item value="two-one">
                <h3>ຂໍ້ມູນ <b> ຍານພາຫະນະ.</b> ທີ່ບໍ່ມີ ແລະ ຜິດ Enterprise Code </h3>
  
                <v-col cols="12">
                  <v-row>
                    <v-col cols="6" class="text-center">
                      <v-toolbar class="text-center bg-indigo-lighten-3">
                        <v-col cols="12">
                          <v-row>
                            <v-col cols="4"></v-col>
                            <v-col cols="4">
                              <v-divider class="text-center" inset vertical>
                                <div class="text-center">
                                  <p><b>ຂໍ້ມູນອັບໂຫຼດຂອງສະມາຊິກ</b></p>
                                </div>
                              </v-divider>
                            </v-col>
                            <v-col cols="4"></v-col>
                          </v-row>
                        </v-col>
                      </v-toolbar>
                    </v-col>
                    <v-col cols="6">
                      <v-toolbar flat class="text-center bg-indigo-lighten-4">
                        <v-col cols="12">
                          <v-row>
                            <v-col cols="4"></v-col>
                            <v-col cols="4">
                              <v-divider class="text-center" inset vertical>
                                <div class="text-center">
                                  <p><b>ຂໍ້ມູນອັບຈາກ LCICDB</b></p>
                                </div>
                              </v-divider>
                            </v-col>
                            <v-col cols="4"></v-col>
                          </v-row>
                        </v-col>
                      </v-toolbar>
                    </v-col>
                  </v-row>
                </v-col>
               
                <v-data-table :items="enterpriseodeerror" :headers="headers2" density="compact">
                <template v-slot:header.id>
                  <th style="color: #0d47a1">ID</th>
                </template>
                <template v-slot:header.lcicID>
                  <th style="color: #0d47a1">LcicID</th>
                </template>
                <template v-slot:header.com_enterprise_code>
                  <th style="color: #0d47a1">Com_Enterprise_Code</th>
                </template>
                <template v-slot:header.bank_customer_ID>
                  <th style="color: #0d47a1">Bank_customer_ID</th>
                </template>
                <template v-slot:header.branch_id_code>
                  <th style="color: #0d47a1">Branch_id_Code</th>
                </template>
                <template v-slot:header.loan_id>
                  <th style="color: #0d47a1">Loan_id</th>
                </template>
                <template v-slot:header.col_id>
                  <th style="color: #0d47a1">Col_id</th>
                </template>
                <template v-slot:header.datamatch>
                  <th style="color: #0d47a1">com_enterprise_code</th>
                </template>
                <template v-slot:header.collateral_status>
                  <th style="color: #0d47a1">status</th>
                </template>
                <template v-slot:item="{ item,index }">
                  <tr>
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.lcicid }}</td>

                    <td style="color: brown">{{ item.com_enterprise_code }}</td>

                    <td >{{ item.bank_customer_ID }}</td>
                    <td >{{ item.branch_id_code }}</td>
                    <td >{{ item.loan_id }}</td>
                    <td >{{ item.col_id }}</td>

                    <td style="color: green" >
                      {{ item.datamatch }}
                    </td>

                    <td style="color: crimson" >
                      {{
                        item.collateral_status === "31"
                          ? "com_enterprise_code ບໍຖືກ"
                          : item.collateral_status === "10"
                          ? "com_enterprise_code ວ່າງ"
                          : item.collateral_status
                      }}
                    </td>
                  </tr>
                </template>
              </v-data-table>
              </v-window-item>
              <v-window-item value="two-two">
                <v-fab
                @click="exportToJson"
                icon="mdi-cloud-braces"
                class="mt-5 d-flex justify-end mr-6"
             
                color="red-lighten-1"
              >
              </v-fab>
                <h3 class="mt-5">ຂໍ້ມູນ <b> ຍານພາຫະນະ.</b>ບໍຖືກ ແລະບໍ່ມີ LcicID </h3>:
                <v-col cols="12">
                  <v-row>
                    <v-col cols="8" class="text-center">
                      <v-toolbar class="text-center bg-indigo-lighten-3">
                        <v-col cols="12">
                          <v-row>
                            <v-col cols="4"></v-col>
                            <v-col cols="4">
                              <v-divider class="text-center" inset vertical>
                                <div class="text-center">
                                  <p><b>ຂໍ້ມູນອັບໂຫຼດຂອງສະມາຊິກ</b></p>
                                </div>
                              </v-divider>
                            </v-col>
                            <v-col cols="4"></v-col>
                          </v-row>
                        </v-col>
                      </v-toolbar>
                    </v-col>
                    <v-col cols="4">
                      <v-toolbar flat class="text-center bg-indigo-lighten-4">
                        <v-col cols="12">
                          <v-row>
                            <v-col cols="4"></v-col>
                            <v-col cols="4">
                              <v-divider class="text-center" inset vertical>
                                <div class="text-center">
                                  <p><b>ຂໍ້ມູນຈາກ DB ຂອງ LCIC</b></p>
                                </div>
                              </v-divider>
                            </v-col>
                            <v-col cols="4"></v-col>
                          </v-row>
                        </v-col>
                      </v-toolbar>
                    </v-col>
                  </v-row>
                </v-col>
                
                <v-data-table :items="lcicerror" :headers="headers3" density="compact">
                <template v-slot:header>
                  <tr style="color: black; background-color: blue"></tr>
                </template>
                <template v-slot:header.id>
                  <th style="color: #0d47a1">ID</th>
                </template>
                <template v-slot:header.lcicID>
                  <th style="color: #0d47a1">LcicID</th>
                </template>
                <template v-slot:header.com_enterprise_code>
                  <th style="color: #0d47a1">Com_Enterprise_Code</th>
                </template>
                <template v-slot:header.bank_customer_ID>
                  <th style="color: #0d47a1">Bank_customer_ID</th>
                </template>
                <template v-slot:header.branch_id_code>
                  <th style="color: #0d47a1">Branch_id_Code</th>
                </template>
                <template v-slot:header.loan_id>
                  <th style="color: #0d47a1">Loan_id</th>
                </template>
                <template v-slot:header.col_id>
                  <th style="color: #0d47a1">Col_id</th>
                </template>
                <template v-slot:header.datamatch>
                  <th style="color: #0d47a1">LcicID</th>
                </template>
                <template v-slot:header.collateral_status>
                  <th style="color: #0d47a1">status</th>
                </template>
                <template v-slot:item="{ item, index }">
                  <tr>
                    <td>{{ index + 1 }}</td>
                    <td style="color: brown" class="text-center">
                      {{ item.lcicid }}
                    </td>

                    <td>{{ item.com_enterprise_code }}</td>

                    <td>{{ item.bank_customer_ID }}</td>
                    <td>{{ item.branch_id_code}}</td>
                    <td>{{ item.loan_id}}</td>
                    <td>{{ item.col_id}}</td>

                    <td style="color: green" class="text-center">
                      {{ item.datamatch }}
                    </td>
                    <td style="color: crimson" class="text-center">
                      {{
                        item.collateral_status === "13"
                          ? "lcicID ບໍຖືກ"
                          : item.collateral_status === "01"
                          ? "lcicID ວ່າງ"
                          : item.item.collateral_status
                      }}
                    </td>
                  </tr>
                </template>
              </v-data-table>
              </v-window-item>
              <v-window-item value="two-three">
                <h3>
                  ຂໍ້ມູນ <b> ຍານພາຫະນະ.</b> ທີ່ມີ LCICID ແລະ com_enterprise_code_error ຜິດ ຫຼື ບໍ່ມີ
                </h3>
  
               
                <v-data-table :items="lcicenterpriseerror" :headers="headers4" density="compact">
                <template v-slot:header.id>
              <th style="color: #0d47a1">ID</th>
            </template>
            <template v-slot:header.lcicID>
              <th style="color: #0d47a1">LcicID</th>
            </template>
            <template v-slot:header.com_enterprise_code>
              <th style="color: #0d47a1">Com_Enterprise_Code</th>
            </template>
            <template v-slot:header.bank_customer_ID>
              <th style="color: #0d47a1">Bank_customer_ID</th>
            </template>
            <template v-slot:header.branch_id_code>
              <th style="color: #0d47a1">Branch_id_Code</th>
            </template>
            <template v-slot:header.loan_id>
              <th style="color: #0d47a1">Loan_id</th>
            </template>
            <template v-slot:header.col_id>
              <th style="color: #0d47a1">Col_id</th>
            </template>
            <template v-slot:header.collateral_status>
              <th style="color: #0d47a1">status</th>
            </template>
                <template v-slot:item="{ item, index }">
                  <tr>
                    <td>{{ index + 1 }}</td>
                    
                    <td >{{ item.lcicid }}</td>
                    
                    <td >{{ item.com_enterprise_code }}</td>
                   
                    <td >{{ item.bank_customer_ID }}</td>
                    <td >{{ item.branch_id_code }}</td>
                    <td >{{ item.loan_id }}</td>
                    <td >{{ item.col_id}}</td>
                    

                    <td style="color: crimson" >
                      {{
                        item.collateral_status === "11"
                          ? "lcicID ແລະ com_enterprise_code ບໍຖືກ"
                          : item.collateral_status === "33"
                          ? "lcicID ແລະ com_enterprise_code ວ່າງ"
                          : item.collateral_status === "44"
                          ? "lcicID ແລະ com_enterprise_code ບໍ່ແມັດກັນ "
                          : item.collateral_status === "30"
                          ? "lcicIDບໍ່ຖືກ ແລະ com_enterprise_code ວ່າງ"
                          : item.collateral_status === "03"
                          ? "lcicIDວ່າງ ແລະ com_enterprise_code ບໍ່ຖືກ"
                          : item.item.collateral_status
                      }}
                    </td>
                  </tr>
                </template>
              </v-data-table>
              </v-window-item>
              <v-window-item value="two-five">
                <h3>
                  ຂໍ້ມູນ <b> ຍານພາຫະນະ.</b>ທີ່ມີ bnk_code, branch_id, customer_id, loan_id ແຕ່ມີ
                  LCICID ແລະ com_enterprise_code ບໍ່ຖືກ
                </h3>
                
                <v-data-table :items="Cdisputes" :headers="headers5" density="compact">
                <template v-slot:header>
                  <tr style="color: black; background-color: blue"></tr>
                </template>
                <template v-slot:header.id>
              <th style="color: #0d47a1">ID</th>
            </template>
            <template v-slot:header.lcicID>
              <th style="color: #0d47a1">LcicID</th>
            </template>
            <template v-slot:header.com_enterprise_code>
              <th style="color: #0d47a1">Com_Enterprise_Code</th>
            </template>
            <template v-slot:header.bank_customer_ID>
              <th style="color: #0d47a1">Bank_customer_ID</th>
            </template>
            <template v-slot:header.branch_id_code>
              <th style="color: #0d47a1">Branch_id_Code</th>
            </template>
            <template v-slot:header.loan_id>
              <th style="color: #0d47a1">Loan_id</th>
            </template>
            <template v-slot:header.col_id>
              <th style="color: #0d47a1">Col_id</th>
            </template>
            
                <template v-slot:item="{ item,index }">
                  <tr>
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.lcicid }}</td>
                    <td>{{ item.com_enterprise_code }}</td>
                    <td>{{ item.bank_customer_ID }}</td>
                    <td>{{ item.branch_id_code }}</td>
                    <td>{{ item.loan_id }}</td>
                    <td>{{ item.col_id }}</td>
                  </tr>
                </template>
              </v-data-table>
              </v-window-item>
            </v-window>
          </v-window-item>
  
          <v-window-item value="three">
              <h1>
                ຂໍ້ມູນທີ່ອັບໂຫຼດສົມບຸນ ເປັນຂໍ້ມູນທີ່ຜ່ານການກວດສອບ ແລະ
                ຖືກບັນທຶກລົງຖານຂໍ້ມູນແລ້ວ
              </h1>
              <v-data-table :items="veh" :headers="headers6" density="compact">
            <template v-slot:header.id>
              <th style="color: #0d47a1">ID</th>
            </template>
            <template v-slot:header.lcicID>
              <th style="color: #0d47a1">LcicID</th>
            </template>
            <template v-slot:header.com_enterprise_code>
              <th style="color: #0d47a1">Com_Enterprise_Code</th>
            </template>
            <template v-slot:header.bank_customer_ID>
              <th style="color: #0d47a1">Bank_customer_ID</th>
            </template>
            <template v-slot:header.branch_id_code>
              <th style="color: #0d47a1">Branch_id_Code</th>
            </template>
            <template v-slot:header.loan_id>
              <th style="color: #0d47a1">Loan_id</th>
            </template>
            <template v-slot:header.col_id>
              <th style="color: #0d47a1">Col_id</th>
            </template>
           
            <template v-slot:item="{ item,index }">
              <tr>
                <td>{{ index + 1 }}</td>
                <td>{{ item.lcicID }}</td>
                <td>{{ item.com_enterprise_code }}</td>
                <td>{{ item.bank_customer_ID}}</td>
                <td>{{ item.branch_id_code }}</td>
                <td>{{ item.loan_id }}</td>
                <td>{{ item.col_id}}</td>
              </tr>
            </template>
          </v-data-table>
            </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, onMounted, computed, PropType } from "vue";
  import { useRoute } from "vue-router";
  import { Icon } from "~~/.nuxt/components";
  
  export default defineComponent({
    props: {
      cidData: {
        type: Object as PropType<any>,
        required: true,
      },
    },
    setup() {
      definePageMeta({
        layout: "backend",
      });
  
      useHead({
        title: "Upload File",
        meta: [
          { name: "keywords", content: "Report, Nuxt 3, Backend" },
          {
            name: "Description",
            content: "Report Nuxt 3, IT Genius Engineering",
          },
        ],
      });
  
      const tab = ref("one");
      const subTab = ref("two-one");
      const cerror = ref<any[]>([]);
      const colrealestates = ref<any[]>([]);
      const disputese = ref<any[]>([]);
      const c1 = ref<any[]>([]);
  
      const route = useRoute();
      const cidData = ref(null);
  
      const headers = [
      { title: "id_file", value: "id_file" },
      { title: "lcicID", value: "lcicID" },
      { title: "com_enterprise_code", value: "com_enterprise_code" },
      { title: "customer_id", value: "customer_id" },
      { title: "branch_id", value: "branch_id" },
      { title: "lcicID_error", value: "lcicID_error" },
    ];
    const headers1 = [
      { title: "id", value: "id" },
      { title: "lcicID", value: "lcicID" },
      { title: "com_enterprise_code", value: "com_enterprise_code" },
      { title: "bank_customer_ID", value: "bank_customer_ID" },
      { title: "branch_id_code", value: "branch_id_code" },
      { title: "loan_id", value: "loan_id" },
      { title: "col_id", value: "col_id" },
      { title: "account_no", value: "account_no" },
    ];
    const headers2 = [
      { title: "id", value: "id" },
      { title: "lcicID", value: "lcicID" },
      { title: "com_enterprise_code", value: "com_enterprise_code" },
      { title: "bank_customer_ID", value: "bank_customer_ID" },
      { title: "branch_id_code", value: "branch_id_code" },
      { title: "loan_id", value: "loan_id" },
      { title: "col_id", value: "col_id" },
      { title: "com_enterprise_code", value: "datamatch" },
      { title: "satus", value: "collateral_status" },
    ];
    const headers3 = [
      { title: "id", value: "id" },
      { title: "lcicID", value: "lcicID" },
      { title: "com_enterprise_code", value: "com_enterprise_code" },
      { title: "bank_customer_ID", value: "bank_customer_ID" },
      { title: "branch_id_code", value: "branch_id_code" },
      { title: "loan_id", value: "loan_id" },
      { title: "col_id", value: "col_id" },
      { title: "LcicID", value: "datamatch" },
      { title: "satus", value: "collateral_status" },
    ];
    const headers4 = [
      { title: "id", value: "id" },
      { title: "lcicID", value: "lcicID" },
      { title: "com_enterprise_code", value: "com_enterprise_code" },
      { title: "bank_customer_ID", value: "bank_customer_ID" },
      { title: "branch_id_code", value: "branch_id_code" },
      { title: "loan_id", value: "loan_id" },
      { title: "col_id", value: "col_id" },
      
      { title: "satus", value: "collateral_status" },
    ];
    const headers5 = [
      { title: "id", value: "id" },
      { title: "lcicID", value: "lcicID" },
      { title: "com_enterprise_code", value: "com_enterprise_code" },
      { title: "bank_customer_ID", value: "bank_customer_ID" },
      { title: "branch_id_code", value: "branch_id_code" },
      { title: "loan_id", value: "loan_id" },
      { title: "col_id", value: "col_id" },
      
      
    ];
    const headers6 = [
      { title: "id", value: "id" },
      { title: "lcicID", value: "lcicID" },
      { title: "com_enterprise_code", value: "com_enterprise_code" },
      { title: "bank_customer_ID", value: "bank_customer_ID" },
      { title: "branch_id_code", value: "branch_id_code" },
      { title: "loan_id", value: "loan_id" },
      { title: "col_id", value: "col_id" },
      
      
    ];
  
      onMounted(() => {
        const queryData = route.query.data as string;
        if (queryData) {
          const parsedData = JSON.parse(queryData);
          cerror.value = parsedData.C_error || [];
          colrealestates.value = parsedData.col_vechicle_veh || [];
          disputese.value = parsedData.C1_disptes || [];
          c1.value = parsedData.C1 || [];
        
        }
        // const data = route.query.data;
        // if (typeof data === 'string') {
        //   cidData.value = JSON.parse(data);
        // } else if (Array.isArray(data)) {
        //   cidData.value = JSON.parse(JSON.stringify(data));
        // }
      });
  
      const combinedData = computed(() => {
        const filteredCerror = (cerror.value || []).filter(
          (item) =>item.col_type === "C2.5" ||item.col_type === "c2.5"
        );
  
        return [...filteredCerror, ...(colrealestates.value || [])]
      });

      const Cdisputes = computed(() => {
      const filteredCerror = (disputese.value || []).filter(
        (item) =>item.col_type === "C2.5" ||item.col_type === "c2.5"
      );

      return [...filteredCerror, ...colrealestates.value]
    });

    const veh = computed(() => {
      const filteredCerror = (c1.value || []).filter(
        (item) =>item.col_type === "C2.5" ||item.col_type === "c2.5"
      );

      return [...filteredCerror, ...colrealestates.value]
    });
  
      console.log("soneeeeeeee", combinedData.value);
  
      const enterpriseodeerror = computed(() => {
        return cerror.value
          .filter(
            (item) =>
              (item.collateral_status === "31" ||
                item.collateral_status === "10") &&
             item.col_type === "C2.5" ||item.col_type === "c2.5"
          )
          
      });
  
      const lcicerror = computed(() => {
        return cerror.value
          .filter(
            (item) =>
             ( item.collateral_status === "13" ||item.collateral_status === "01") &&item.col_type === "C2.5" ||item.col_type === "c2.5"
          )
          
      });
      const lcicenterpriseerror = computed(() => {
        return cerror.value
          .filter(
            (item) =>
             ( item.collateral_status === "11" ||
              item.collateral_status === "33" ||
              item.collateral_status === "30" ||
              item.collateral_status === "44" ||
              item.collateral_status === "03" )&&
               item.col_type === "C2.5" ||item.col_type === "c2.5"
          )
         
      });
  
      const exportToJson = () => {
        const dataToExport = cerror.value.map((item) => {
          const {
            datamatch,
            com_enterprise_code_get,
            id_file,
            id,
            period,
            com_enterprise_code_error,
            lcicID_error,
            filteredBDataIsDamagedLcicIDError01,
            ...rest
          } = item;
          return {
            ...rest,
            lcicID: datamatch,
          };
        });
  
        const jsonStr = JSON.stringify(dataToExport, null, 2);
        const blob = new Blob([jsonStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "LCIC request.json";
        link.click();
        URL.revokeObjectURL(url);
      };
  
      return {
        tab,
        subTab,
  
        headers,
      headers1,
      headers2,
      headers3,
      headers4,
      headers5,
      headers6,
        combinedData,
        enterpriseodeerror,
        lcicerror,
        lcicenterpriseerror,
        Cdisputes,
        veh,
  
        exportToJson,
        cidData,
      };
    },
  });
  </script>
  