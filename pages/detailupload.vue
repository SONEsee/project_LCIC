<template>
  <v-card>
    <v-col cols="12">
      <v-row>
        <v-col cols="12" md="10">
          <div class="pa-4">
            <p class="ml-3">
              <b style="color: #01579b">- ລາຍລະອຽດການອັບໂຫຼດຂໍ້ມູນ</b>
            </p>

            <div
              :items="combinedData"
              :headers="headers"
              class="ml-5"
              style="color: black"
            >
              <template v-if="combinedData.length > 0">
                <v-col cols="12">
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-row>
                        <v-col cols="12"
                          ><p>
                            ລາຍການຂໍ້ມູນທີ່ອັບໂຫຼດທັງໝົດ:
                            <b> {{ combinedData.length }}</b> ລາຍການ
                          </p></v-col
                        >
                        <v-col cols="12" md="6"></v-col>
                      </v-row>
                    </v-col>
                    <v-col cols="12" md="6" class="text-end">
                      <p>
                        ປະຈຳເດືອນ:
                        <b
                          >{{ combinedData[0].period[0]
                          }}{{ combinedData[0].period[1]
                          }}{{ combinedData[0].period[2]
                          }}{{ combinedData[0].period[3] }}/
                          {{ combinedData[0].period[4]
                          }}{{ combinedData[0].period[5] }}</b
                        >
                      </p>
                      <p>
                        ຂອງທະນາຄານ: <b>{{ combinedData[0].bnk_code }}</b
                        >, ສາຂາ: <b>{{ combinedData[0].branch_id }}</b>
                      </p>
                    </v-col>
                  </v-row>
                </v-col>
              </template>
            </div>
          </div>
        </v-col>
        <v-col cols="12" md="2" class="mt-5">
          <div :items="uploadfile" :headers="headers" style="color: black">
            <template v-if="uploadfile.length">
              <p>
                ຊື່ເອກະສານ: <b>{{ uploadfile[0].fileName }}</b>
              </p>
            </template>
          </div>
        </v-col>
      </v-row>
    </v-col>

    <v-tabs v-model="tab" fixed-tabs color="primary" stacked>
      <v-tab value="one">ຂໍ້ມູນທີ່ອັບໂຫຼດທັງໝົດ</v-tab>
      <v-tab value="two">ຂໍ້ມູນທີ່ບໍ່ຖືກຕອ້ງ</v-tab>
      <v-tab value="three">ຂໍ້ມູນທີ່ອັບໂຫຼດສົມບູນ</v-tab>
    </v-tabs>
    <v-card-text>
      <v-window v-model="tab">
        <v-window-item value="one">
          <h1>ຂໍ້ມູນທີ່ອັບໂຫຼດທັງໝົດ</h1>

          <v-data-table
            :items="dataedit"
            :headers="headers"
            density="compact"
            items-per-page="20"
          >
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
            <template v-slot:header.bnk_code>
              <th style="color: #0d47a1">bnk_code</th>
            </template>
            <template v-slot:header.customer_id>
              <th style="color: #0d47a1">customer_id</th>
            </template>
            <template v-slot:header.branch_id>
              <th style="color: #0d47a1">branch_id</th>
            </template>
            <template v-slot:header.loan_id>
              <th style="color: #0d47a1">Loan_id</th>
            </template>
            <template v-slot:header.col_id>
              <th style="color: #0d47a1">Col_id</th>
            </template>

            <template v-slot:item="{ item, index }">
              <tr>
                <td>{{ index + 1 }}</td>
                <td>{{ item.lcicID }}</td>
                <td>{{ item.com_enterprise_code }}</td>
                <td>{{ item.bnk_code }}</td>
                <td>{{ item.customer_id }}</td>
                <td>{{ item.branch_id }}</td>
                <td>{{ item.loan_id }}</td>
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
              <h3>ຂໍ້ມູນທີ່ບໍ່ມີ ແລະ ຜິດ Enterprise Code</h3>

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

              <v-data-table
                :items="filteredBDataIsDamaged"
                :headers="headers2"
                density="compact"
              >
                <template v-slot:header.id>
                  <th style="color: #0d47a1">ID</th>
                </template>
                <template v-slot:header.lcicID>
                  <th style="color: #0d47a1">LcicID</th>
                </template>
                <template v-slot:header.com_enterprise_code>
                  <th style="color: #0d47a1">Com_Enterprise_Code</th>
                </template>
                <template v-slot:header.bnk_code>
                  <th style="color: #0d47a1">bnk_code</th>
                </template>
                <template v-slot:header.customer_id>
                  <th style="color: #0d47a1">customer_id</th>
                </template>
                <template v-slot:header.branch_id>
                  <th style="color: #0d47a1">branch_id</th>
                </template>
                <template v-slot:header.loan_id>
                  <th style="color: #0d47a1">Loan_id</th>
                </template>
                <template v-slot:header.lcicID_get>
                  <th style="color: #0d47a1">com_enterprise_code</th>
                </template>
                <template v-slot:header.status>
                  <th style="color: #0d47a1">Status</th>
                </template>

                <template v-slot:item="{ item, index }">
                  <tr>
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.lcicid }}</td>
                    <td style="color: brown">{{ item.com_enterprise_code }}</td>
                    <td>{{ item.bnk_code }}</td>

                    <td>{{ item.customer_id }}</td>

                    <td>{{ item.branch_id }}</td>
                    <td>{{ item.loan_id }}</td>

                    <td style="color: green">
                      {{ item.lcicID_get }}
                    </td>
                    <td style="color: crimson">
                      {{
                        item.lcicID_error === "10"
                          ? "com_enterprise_code ບໍຖືກ"
                          : item.lcicID_error === "13"
                          ? "com_enterprise_code ວ່າງ"
                          : item.item.lcicID_error
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
              <v-col cols="12" class="mt-6">
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

              <v-data-table
                :items="filteredBDataIsDamagedLcicIDError01"
                :headers="headers3"
                density="compact"
              >
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
                <template v-slot:header.bnk_code>
                  <th style="color: #0d47a1">bnk_code</th>
                </template>
                <template v-slot:header.customer_id>
                  <th style="color: #0d47a1">customer_id</th>
                </template>
                <template v-slot:header.branch_id>
                  <th style="color: #0d47a1">branch_id</th>
                </template>
                <template v-slot:header.loan_id>
                  <th style="color: #0d47a1">Loan_id</th>
                </template>
                <template v-slot:header.lcicID_get>
                  <th style="color: #0d47a1">LcicID</th>
                </template>
                <template v-slot:header.status>
                  <th style="color: #0d47a1">Status</th>
                </template>
                <template v-slot:item="{ item, index }">
                  <tr>
                    <td>{{ index + 1 }}</td>
                    <td style="color: brown">
                      {{ item.LCIC_code }}
                    </td>
                    <td>{{ item.com_enterprise_code }}</td>
                    <td>{{ item.bnk_code }}</td>
                    <td>{{ item.branch_id }}</td>
                    <td>{{ item.customer_id }}</td>
                    <td>{{ item.loan_id }}</td>
                    <td style="color: green">
                      {{ item.lcicID_get }}
                    </td>
                    <td style="color: crimson">
                      {{
                        item.lcicID_error === "01"
                          ? "lcicID ບໍຖືກ"
                          : item.lcicID_error === "31"
                          ? "lcicID ວ່າງ"
                          : item.item.lcicID_error
                      }}
                    </td>
                  </tr>
                </template>
              </v-data-table>
            </v-window-item>
            <v-window-item value="two-three">
              <h3>
                ຂໍ້ມູນທີ່ມີ LCICID ແລະ com_enterprise_code_error ຜິດ ຫຼື ບໍ່ມີ
              </h3>

              <v-data-table
                :items="filteredBDataIsDamagedLcicIDError33"
                :headers="headers4"
                density="compact"
              >
                <template v-slot:header.id>
                  <th style="color: #0d47a1">ID</th>
                </template>
                <template v-slot:header.lcicID>
                  <th style="color: #0d47a1">LcicID</th>
                </template>
                <template v-slot:header.com_enterprise_code>
                  <th style="color: #0d47a1">Com_Enterprise_Code</th>
                </template>
                <template v-slot:header.bnk_code>
                  <th style="color: #0d47a1">bnk_code</th>
                </template>
                <template v-slot:header.customer_id>
                  <th style="color: #0d47a1">customer_id</th>
                </template>
                <template v-slot:header.branch_id>
                  <th style="color: #0d47a1">branch_id</th>
                </template>
                <template v-slot:header.loan_id>
                  <th style="color: #0d47a1">Loan_id</th>
                </template>

                <template v-slot:header.status>
                  <th style="color: #0d47a1">Status</th>
                </template>
                <template v-slot:item="{ item, index }">
                  <tr>
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.lcicid }}</td>
                    <td>{{ item.com_enterprise_code }}</td>
                    <td>{{ item.bnk_code }}</td>
                    <td>{{ item.branch_id }}</td>
                    <td>{{ item.customer_id }}</td>

                    <td>{{ item.loan_id }}</td>
                    <td style="color: crimson"><p>ຂໍ້ມູນຜິດ ຫຼື ບໍ່ມີ</p></td>
                  </tr>
                </template>
              </v-data-table>
            </v-window-item>
            <v-window-item value="two-five">
              <h3>
                ຂໍ້ມູນທີ່ມີ bnk_code, branch_id, customer_id, loan_id ແຕ່ມີ
                LCICID ແລະ com_enterprise_code ບໍ່ຖືກ
              </h3>

              <v-data-table
                :items="disputese"
                :headers="headers5"
                density="compact"
              >
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
                <template v-slot:header.bnk_code>
                  <th style="color: #0d47a1">bnk_code</th>
                </template>
                <template v-slot:header.customer_id>
                  <th style="color: #0d47a1">customer_id</th>
                </template>
                <template v-slot:header.branch_id>
                  <th style="color: #0d47a1">branch_id</th>
                </template>
                <template v-slot:header.loan_id>
                  <th style="color: #0d47a1">Loan_id</th>
                </template>
                <template v-slot:item="{ item, index }">
                  <tr>
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.lcicID }}</td>
                    <td>{{ item.com_enterprise_code }}</td>
                    <td>{{ item.bnk_code }}</td>
                    <td>{{ item.branch_id }}</td>
                    <td>{{ item.customer_id }}</td>

                    <td>{{ item.loan_id }}</td>
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
          <v-data-table
            :items="b1Monthly"
            :headers="headers5"
            density="compact"
          >
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
            <template v-slot:header.bnk_code>
              <th style="color: #0d47a1">bnk_code</th>
            </template>
            <template v-slot:header.customer_id>
              <th style="color: #0d47a1">customer_id</th>
            </template>
            <template v-slot:header.branch_id>
              <th style="color: #0d47a1">branch_id</th>
            </template>
            <template v-slot:header.loan_id>
              <th style="color: #0d47a1">Loan_id</th>
            </template>

            <template v-slot:item="{ item, index }">
              <tr>
                <td>{{ index + 1 }}</td>
                <td>{{ item.lcicID }}</td>
                <td>{{ item.com_enterprise_code }}</td>
                <td>{{ item.bnk_code }}</td>
                <td>{{ item.branch_id }}</td>
                <td>{{ item.customer_id }}</td>

                <td>{{ item.loan_id }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-window-item>
      </v-window>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { Icon } from "~~/.nuxt/components";

export default defineComponent({
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
    const dataedit = ref<any[]>([]);
    const bDataIsDamaged = ref<any[]>([]);
    const b1Monthly = ref<any[]>([]);
    const b1 = ref<any[]>([]);
    const disputese = ref<any[]>([]);
    const uploadfile = ref<any[]>([]);
    const route = useRoute();

    const headers = [
      { title: "id", value: "id" },
      { title: "lcicID", value: "lcicID" },
      { title: "com_enterprise_code", value: "com_enterprise_code" },
      { title: "bnk_code", value: "bnk_code" },
      { title: "customer_id", value: "customer_id" },
      { title: "branch_id", value: "branch_id" },
      { title: "loan_id", value: "loan_id" },
    ];

    const headers2 = [
      { title: "id", value: "id" },
      { title: "lcicID", value: "lcicID" },
      { title: "com_enterprise_code", value: "com_enterprise_code" },
      { title: "bnk_code", value: "bnk_code" },
      { title: "branch_id", value: "branch_id" },
      { title: "customer_id", value: "customer_id" },
      { title: "loan_id", value: "loan_id" },
      { title: "com_enterprise_code", value: "lcicID_get" },
      { title: "satus", value: "status" },
    ];
    const headers3 = [
      { title: "id", value: "id" },
      { title: "lcicID", value: "lcicID" },
      { title: "com_enterprise_code", value: "com_enterprise_code" },
      { title: "bnk_code", value: "bnk_code" },
      { title: "branch_id", value: "branch_id" },
      { title: "customer_id", value: "customer_id" },
      { title: "loan_id", value: "loan_id" },
      { title: "com_enterprise_code", value: "lcicID_get" },
      { title: "satus", value: "status" },
    ];
    const headers4 = [
      { title: "id", value: "id" },
      { title: "lcicID", value: "lcicID" },
      { title: "com_enterprise_code", value: "com_enterprise_code" },
      { title: "bnk_code", value: "bnk_code" },
      { title: "branch_id", value: "branch_id" },
      { title: "customer_id", value: "customer_id" },
      { title: "loan_id", value: "loan_id" },

      { title: "satus", value: "status" },
    ];
    const headers5 = [
      { title: "id", value: "id" },
      { title: "lcicID", value: "lcicID" },
      { title: "com_enterprise_code", value: "com_enterprise_code" },
      { title: "bnk_code", value: "bnk_code" },
      { title: "branch_id", value: "branch_id" },
      { title: "customer_id", value: "customer_id" },
      { title: "loan_id", value: "loan_id" },
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
        dataedit.value = parsedData.data_edit || [];
        bDataIsDamaged.value = parsedData.B_Data_is_damaged || [];
        b1Monthly.value = parsedData.B1_Monthly || [];
        b1.value = parsedData.B1 || [];
        disputese.value = parsedData.disputes || [];
        uploadfile.value = parsedData.uploadfile || [];
        console.log("Data from query:", uploadfile.value);

        console.log("b1 data before filtering:", b1.value);
        console.log("dispute data before filtering:", disputese.value);
      }
    });

    // });
    const combinedData = computed(() => {
      return [...(bDataIsDamaged.value || []), ...(dataedit.value || [])];
    });

    const b1WithStatusCustomer1 = computed(() => {
      const filtered = b1.value.filter((item) => item.status_customer == 1);
      console.log("Filtered B1 data:", filtered);
      return filtered;
    });

    const filteredBDataIsDamaged = computed(() => {
      return bDataIsDamaged.value.filter(
        (item) => item.lcicID_error === "10" || item.lcicID_error === "13"
      );
    });

    const filteredBDataIsDamagedLcicIDError01 = computed(() => {
      return bDataIsDamaged.value.filter(
        (item) => item.lcicID_error === "01" || item.lcicID_error === "31"
      );
    });

    const filteredBDataIsDamagedLcicIDError33 = computed(() => {
      return bDataIsDamaged.value.filter((item) => item.lcicID_error === "33");
    });

    const exportToJson = () => {
      const dataToExport = filteredBDataIsDamagedLcicIDError01.value.map(
        (item) => {
          const {
            lcicID_get,
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
            lcicID: lcicID_get,
          };
        }
      );

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
      dataedit,
      bDataIsDamaged,
      b1Monthly,
      headers,

      headers2,
      headers3,
      headers4,
      headers5,
      headers6,
      combinedData,
      b1WithStatusCustomer1,
      filteredBDataIsDamaged,
      filteredBDataIsDamagedLcicIDError01,
      filteredBDataIsDamagedLcicIDError33,
      b1,
      disputese,
      uploadfile,
      exportToJson,
    };
  },
});
</script>
