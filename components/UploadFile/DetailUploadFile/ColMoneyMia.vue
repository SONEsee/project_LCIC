<template>
  <v-card>
    <!-- <v-col cols="12">
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
                    <p>
                      ປະຈຳເດືອນ:
                      <b
                        >{{ combinedData[0].period[5]
                        }}{{ combinedData[0].period[6] }} /
                        {{ combinedData[0].period[7] }}{{ combinedData[0].period[8]
                        }}{{ combinedData[0].period[9]
                        }}{{ combinedData[0].period[10] }}</b
                      >
                    </p>
                    <p>
                      ຂອງທະນາຄານ: <b>{{ combinedData[0].bnk_code }}</b
                      >, ສາຂາ: <b>{{ combinedData[0].branch_id }}</b>
                    </p>
                    <p>
                      ລາຍການຂໍ້ມູນທີ່ອັບໂຫຼດທັງໝົດ:
                      <b> {{ combinedData.length }}</b> ລາຍການ
                    </p>
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
        </v-col> -->
    <div>
      {{ cidData }}
    </div>
    <v-tabs v-model="tab" fixed-tabs color="primary" stacked>
      <v-tab value="one">ຂໍ້ມູນທີ່ອັບໂຫຼດທັງໝົດ</v-tab>
      <v-tab value="two">ຂໍ້ມູນທີ່ບໍ່ຖືກຕອ້ງ</v-tab>
      <v-tab value="three">ຂໍ້ມູນທີ່ອັບໂຫຼດສົມບູນ</v-tab>
    </v-tabs>
    <v-card-text>
      <v-window v-model="tab">
        <v-window-item value="one">
          <h3>ຂໍ້ມູນທີ່ອັບໂຫຼດທັງໝົດຂອງ: <b> ເງິນໃນບັນຊີ/ເອກະສານມີຄ່າ.</b></h3>
          <v-table>
            <thead>
              <tr style="background-color: #5c6bc0; color: aliceblue">
                <td>ID</td>
                <td></td>
                <td class="text-center">LCICID</td>
                <td></td>
                <td class="text-center">enterprise_code</td>
                <td></td>
                <td>customer_id</td>
                <td>collateral_type</td>
              </tr>
            </thead>
          </v-table>

          <v-data-table :items="combinedData" :headers="headers">
            <template v-slot:top> </template>
            <template v-slot:item="{ item }">
              <tr>
                <td>{{ item.id}}</td>
                <td class="text-center">{{ item.lcicID }}</td>
                <td></td>
                <td></td>
                <td>{{ item.com_enterprise_code }}</td>
                <td>{{ item.bank_customer_ID }}</td>
                <td>{{ item.loan_id }}</td>
                <td>{{ item.collateral_type }}</td>
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
              <h3>
                ຂໍ້ມູນ <b> ເງິນໃນບັນຊີ/ເອກະສານມີຄ່າ.</b> ທີ່ບໍ່ມີ ແລະ ຜິດ
                Enterprise Code
              </h3>

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
              <v-table>
                <thead>
                  <tr style="background-color: #5c6bc0; color: aliceblue">
                    <td>ID</td>
                    <td>LCICID</td>
                    <td>enterprise_code</td>
                    <td>customer_id</td>
                    <td>enterprise_code</td>
                    <td>status</td>
                  </tr>
                </thead>
              </v-table>

              <v-data-table :items="enterpriseodeerror" :headers="headers">
                <template v-slot:item="{ item }">
                  <tr>
                    <td>{{ item.id }}</td>
                    <td>{{ item.lcicid }}</td>
                    <td></td>
                    <td></td>
                    <td style="color: brown">{{ item.com_enterprise_code }}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td class="text-center">{{ item.bank_customer_ID }}</td>
                    <td></td>
                    <td></td>

                    <td style="color: green" class="text-center">
                      {{ item.datamatch }}
                    </td>

                    <td style="color: crimson" class="text-center">
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
              <v-btn @click="exportToJson" class="bg-red"
                ><v-icon icon="mdi-code-json" class="mr-2"></v-icon> Export
                JSON</v-btn
              >
              <h3 class="mt-5">
                ຂໍ້ມູນ <b> ເງິນໃນບັນຊີ/ເອກະສານມີຄ່າ.</b>ບໍຖືກ ແລະບໍ່ມີ LcicID
              </h3>
              :
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
              <v-table>
                <thead>
                  <tr style="background-color: #5c6bc0; color: aliceblue">
                    <th>ID</th>
                    <th></th>
                    <th>LCICID</th>
                    <th>com_enterprise_code</th>
                    <th>customer_id</th>

                    <th>lcicID</th>
                    <th>status</th>
                  </tr>
                </thead>
              </v-table>
              <v-data-table :items="lcicerror" :headers="headers">
                <template v-slot:header>
                  <tr style="color: black; background-color: blue"></tr>
                </template>
                <template v-slot:item="{ item }">
                  <tr>
                    <td>{{ item.id }}</td>
                    <td style="color: brown" class="text-center">
                      {{ item.lcicid }}
                    </td>
                    <td></td>
                    <td></td>
                    <td>{{ item.com_enterprise_code }}</td>
                    <td></td>
                    <td></td>
                    <td>{{ item.bank_customer_ID }}</td>

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
                ຂໍ້ມູນ <b> ເງິນໃນບັນຊີ/ເອກະສານມີຄ່າ.</b> ທີ່ມີ LCICID ແລະ
                com_enterprise_code_error ຜິດ ຫຼື ບໍ່ມີ
              </h3>

              <v-table>
                <thead>
                  <tr style="background-color: #5c6bc0; color: aliceblue">
                    <th>ID</th>
                    <th></th>
                    <th>LCICID</th>
                    <th>com_enterprise_code</th>
                    <th>customer_id</th>

                    <th>status</th>
                  </tr>
                </thead>
              </v-table>
              <v-data-table :items="lcicenterpriseerror" :headers="headers">
                <template v-slot:item="{ item }">
                  <tr>
                    <td>{{ item.id }}</td>
                    <td></td>
                    <td class="text-center">{{ item.lcicid }}</td>
                    <td></td>
                    <td></td>
                    <td class="text-center">{{ item.com_enterprise_code }}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td class="text-center">{{ item.bank_customer_ID }}</td>
                    <td></td>
                    <td></td>
                    <td></td>

                    <td style="color: crimson" class="text-center">
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
                ຂໍ້ມູນ <b> ເງິນໃນບັນຊີ/ເອກະສານມີຄ່າ.</b>ທີ່ມີ bnk_code,
                branch_id, customer_id, loan_id ແຕ່ມີ LCICID ແລະ
                com_enterprise_code ບໍ່ຖືກ
              </h3>

              <v-data-table :items="Cdisputes" :header="headers">
                <template v-slot:header>
                  <tr style="color: black; background-color: blue"></tr>
                </template>
                <template v-slot:item="{ item }">
                  <tr>
                    <td>{{ item.id }}</td>
                    <td>{{ item.lcicid }}</td>
                    <td>{{ item.com_enterprise_code }}</td>
                    <td>{{ item.bank_customer_ID }}</td>
                    <td>{{ item.branch_id_code }}</td>
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
              <v-data-table :items="money" :header="headers">
                <template v-slot:header>
                  <tr style="color: black; background-color: blue"></tr>
                </template>
                <template v-slot:item="{ item }">
                  <tr>
                    <td>{{ item.id_file }}</td>
                    <td>{{ item.lcicID }}</td>
                    <td>{{ item.com_enterprise_code }}</td>
                    <td>{{ item.customer_id }}</td>
                    <td>{{ item.branch_id }}</td>
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
    const c1 = ref<any[]>([]);
    const disputese = ref<any[]>([]);

    const route = useRoute();
    const cidData = ref(null);

    const headers = [
      { text: "id_file", value: "id_file" },
      { text: "lcicID", value: "lcicID" },
      { text: "com_enterprise_code", value: "com_enterprise_code" },
      { text: "customer_id", value: "customer_id" },
      { text: "branch_id", value: "branch_id" },
      { text: "lcicID_error", value: "lcicID_error" },
    ];

    onMounted(() => {
      const queryData = route.query.data as string;
      if (queryData) {
        const parsedData = JSON.parse(queryData);
        cerror.value = parsedData.C_error || [];
        colrealestates.value = parsedData.col_money_mia || [];
        c1.value = parsedData.C1 || [];
        disputese.value = parsedData.C1_disptes || [];
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
        (item) =>item.col_type === "C2.2" ||item.col_type === "c2.2"
      );

      return [...filteredCerror, ...(colrealestates.value || [])].map(
        (item) => {
          return {
            id: item?.id || null,
            lcicID: item?.lcicID || null,
            com_enterprise_code: item?.com_enterprise_code || null,
            bank_customer_ID: item?.bank_customer_ID || null,
            branch_id: item?.branch_id || null,
            collateral_type: item?.collateral_type || null,
            bnk_code: item?.bnk_code || null,
          };
        }
      );
    });

    const Cdisputes = computed(() => {
      const filteredCerror = (disputese.value || []).filter(
        (item) =>item.col_type === "C2.2" ||item.col_type === "c2.2"
      );

      return [...filteredCerror, ...colrealestates.value].map((item) => {
        return {
          id: item?.id || null,
          lcicid: item?.lcicID || null,
          com_enterprise_code: item?.com_enterprise_code || null,
          bank_customer_ID: item?.bank_customer_ID || null,

          branch_id_code: item?.branch_id_code || null,
        };
      });
    });

    const money = computed(() => {
      const filteredCerror = (c1.value || []).filter(
        (item) =>item.col_type === "C2.2" ||item.col_type === "c2.2"
      );

      return [...filteredCerror, ...colrealestates.value].map((item) => {
        return {
          id_file: item?.id_file || null,
          lcicid: item?.lcicID || null,
          com_enterprise_code: item?.com_enterprise_code || null,
          bank_customer_ID: item?.bank_customer_ID || null,

          branch_id_code: item?.branch_id_code || null,
        };
      });
    });

    console.log("soneeeeeeee", combinedData.value);

    const enterpriseodeerror = computed(() => {
      return cerror.value
        .filter(
          (item) =>
            (item.collateral_status === "31" ||
              item.collateral_status === "10") &&
           item.col_type === "C2.2" ||item.col_type === "c2.2"
        )
        .map((item) => ({
          id: item?.id || null,
          lcicid: item?.lcicID || null,
          com_enterprise_code: item?.com_enterprise_code || null,
          bank_customer_ID: item?.bank_customer_ID || null,
          branch_id: item?.branch_id || null,
          collateral_status: item?.collateral_status || null,
          datamatch: item?.datamatch || null,
        }));
    });

    const lcicerror = computed(() => {
      return cerror.value
        .filter(
          (item) =>
            (item.collateral_status === "13" ||
              item.collateral_status === "01") &&
           item.col_type === "C2.2" ||item.col_type === "c2.2"
        )
        .map((item) => ({
          id: item?.id || null,
          lcicid: item?.lcicID || null,
          com_enterprise_code: item?.com_enterprise_code || null,
          bank_customer_ID: item?.bank_customer_ID || null,
          branch_id: item?.branch_id || null,
          collateral_status: item?.collateral_status || null,
          datamatch: item?.datamatch || null,
        }));
    });
    const lcicenterpriseerror = computed(() => {
      return cerror.value
        .filter(
          (item) =>
            (item.collateral_status === "11" ||
              item.collateral_status === "33" ||
              item.collateral_status === "30" ||
              item.collateral_status === "44" ||
              item.collateral_status === "03") &&
           item.col_type === "C2.2" ||item.col_type === "c2.2"
        )
        .map((item) => ({
          id: item?.id || null,
          lcicid: item?.lcicID || null,
          com_enterprise_code: item?.com_enterprise_code || null,
          bank_customer_ID: item?.bank_customer_ID || null,
          branch_id: item?.branch_id || null,
          collateral_status: item?.collateral_status || null,
        }));
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
      combinedData,
      enterpriseodeerror,
      lcicerror,
      lcicenterpriseerror,
      Cdisputes,
      money,

      exportToJson,
      cidData,
    };
  },
});
</script>
