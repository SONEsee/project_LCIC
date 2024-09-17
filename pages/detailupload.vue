<template>
  <v-card>
    <v-col cols="12">
      <v-row>
        <v-col cols="12" md="10">
          <div class="pa-4">
            <p class="ml-3">
              <b style="color: #01579b">- ລາຍລະອຽດການອັບໂຫຼດຂໍ້ມູນ</b>
            </p>

            <!-- <div >
          <template v-for="(uploadfile, index) in uploadfile" :key="index" >
            <p>ຊື່ເອກະສານ: <b>{{ uploadfile.fileName }}</b>    </p>
            
          </template>
  
        </div> -->

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
                    >{{ combinedData[0].period[0]
                    }}{{ combinedData[0].period[1] }} /
                    {{ combinedData[0].period[2] }}{{ combinedData[0].period[3]
                    }}{{ combinedData[0].period[4]
                    }}{{ combinedData[0].period[5] }}</b
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
              </tr>
            </thead>
          </v-table>

          <v-data-table :items="dataedit" :headers="headers">
            <template v-slot:top> </template>
            <template v-slot:item="{ item }">
              <tr>
                <!-- <td>{{ item.id }}</td> -->
                <td>{{ item.id_file }}</td>
                <td class="text-center">{{ item.lcicID }}</td>
                <td></td>
                <td></td>
                <td>{{ item.com_enterprise_code }}</td>
                <td>{{ item.customer_id }}</td>
                <!-- <td>{{ item.branch_id }}</td> -->
                <!-- <td>{{ item.period }}</td> -->
                <!-- <td>{{ item.bnk_code }}</td> -->
              </tr>
            </template>
          </v-data-table>
          <!-- <v-data-table
  :headers="headers"
  :items="combinedData"
  :items-per-page="15"
>

  <template v-slot:header>
    <thead>
      <tr>
        <th>ID</th>
        <th>ID File</th>
      </tr>
    </thead>
  </template>

  <template v-slot:item="{ item }">
    <tr>
      <td>{{ item.id }}</td>
      <td>{{ item.id_file }}</td>
    </tr>
  </template>
</v-data-table> -->
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
              <!-- <v-data-table :items="filteredBDataIsDamaged" :headers="headers">
                <template v-slot:header>
                  <tr style="color: black; background-color: blue"></tr>
                </template>
                <template v-slot:item="{ item }">
                  <tr>
                    <td>{{ item.id }}</td>
                    <td>{{ item.id_file }}</td>
                    <td>{{ item.lcicID }}</td>
                    <td style="color: brown">{{ item.com_enterprise_code }}</td>
                    <td>{{ item.customer_id }}</td>
                    <td>{{ item.branch_id }}</td>
                    <td style="color: green">{{ item.lcicID_get }}</td>

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
              </v-data-table> -->
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

              <v-data-table :items="filteredBDataIsDamaged" :headers="headers">
                

                <template v-slot:item="{ item }">
                  <tr>
                    <!-- <td>{{ item.id }}</td> -->
                    <td>{{ item.id }}</td>
                    <td>{{ item.lcicid }}</td>
                    <td></td>
                    <td></td>
                    <td style="color: brown;">{{ item.com_enterprise_code }}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td class="text-center">{{ item.customer_id }}</td>
                    <td></td>
                    <td></td>
                    <!-- <td>{{ item.branch_id }}</td> -->
                    <td style="color: green" class="text-center">
                      {{ item.lcicID_get }}
                    </td>

                    <td style="color: crimson" class="text-center">
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
              <v-btn @click="exportToJson" class="bg-red"
                ><v-icon icon="mdi-code-json" class="mr-2"></v-icon> Export
                JSON</v-btn
              >
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
              <v-data-table
                :items="filteredBDataIsDamagedLcicIDError01"
                :headers="headers"
              >
                <template v-slot:header>
                  <tr style="color: black; background-color: blue"></tr>
                </template>
                <template v-slot:item="{ item }">
                  <tr>
                    <!-- <td>{{ item.id }}</td> -->
                    <td>{{ item.id }}</td>
                    <td style="color: brown" class="text-center">
                      {{ item.lcicID }}
                    </td>
                    <td></td>
                    <td></td>
                    <td>{{ item.com_enterprise_code }}</td>
                    <td></td>
                    <td></td>
                    <td>{{ item.customer_id }}</td>

                    <!-- <td>{{ item.branch_id }}</td> -->
                    <td style="color: green" class="text-center">
                      {{ item.lcicID_get }}
                    </td>
                    <td style="color: crimson" class="text-center">
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
              <!-- <v-data-table
                :items="filteredBDataIsDamagedLcicIDError33"
                :headers="headers"
              >
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
                    <td style="color: red">
                      ຂໍ້ມູນທີ່ມີ LCICID ແລະ com_enterprise_code_error ຜິດ ຫຼື
                      ບໍ່ມີ
                    </td>
                  </tr>
                </template>
              </v-data-table> -->
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
              <v-data-table
                :items="filteredBDataIsDamagedLcicIDError33"
                :headers="headers"
              >
                <template v-slot:item="{ item }">
                  <tr>
                    <!-- <td>{{ item.id }}</td> -->
                    <td>{{ item.id }}</td>
                    <td></td>
                    <td class="text-center">{{ item.lcicid }}</td>
                    <td></td>
                    <td></td>
                    <td class="text-center">{{ item.com_enterprise_code }}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td class="text-center">{{ item.customer_id }}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    
                    <!-- <td style="color: green">{{ item.lcicID_get }}</td> -->
                    <td style="color: crimson"><p>ຂໍ້ມູນຜິດ ຫຼື ບໍ່ມີ</p></td>

                    <!-- <td style="color: crimson">
                      {{
                        item.lcicID_error === "10"
                          ? "com_enterprise_code ບໍຖືກ"
                          : item.lcicID_error === "13"
                          ? "com_enterprise_code ວ່າງ"
                          : item.item.lcicID_error
                      }}
                    </td> -->
                  </tr>
                </template>
              </v-data-table>
            </v-window-item>
            <v-window-item value="two-five">
              <h3>
                ຂໍ້ມູນທີ່ມີ bnk_code, branch_id, customer_id, loan_id ແຕ່ມີ
                LCICID ແລະ com_enterprise_code ບໍ່ຖືກ
              </h3>
              <v-table>
                <thead>
                  <tr>
                    <th>id_file</th>
                    <th>lcicID</th>
                    <th>com_enterprise_code</th>
                    <th>customer_id</th>
                    <th>branch_id</th>
                    <td></td>
                  </tr>
                </thead>
              </v-table>
              <v-data-table :items="disputese" :headers="headers">
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
        </v-window-item>

        <v-window-item value="three">
          <h1>
            ຂໍ້ມູນທີ່ອັບໂຫຼດສົມບຸນ ເປັນຂໍ້ມູນທີ່ຜ່ານການກວດສອບ ແລະ
            ຖືກບັນທຶກລົງຖານຂໍ້ມູນແລ້ວ
          </h1>
          <v-data-table :items="b1Monthly" :headers="headers">
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

    // const combinedData = computed(() => {
    //   return [...bDataIsDamaged.value, ...dataedit.value];

    // });
    const combinedData = computed(() => {
      return [...(bDataIsDamaged.value || []), ...(dataedit.value || [])].map(
        (item) => {
          return {
            // id: item?.id || null,
            id_file: item?.id_file || null,
            lcicid: item?.lcicID || null,
            com_enterprise_code: item?.com_enterprise_code || null,
            customer_id: item?.customer_id || null,
            branch_id: item?.branch_id || null,
            period: item?.period || null,
            bnk_code: item?.bnk_code || null,
          };
        }
      );
    });

    const b1WithStatusCustomer1 = computed(() => {
      const filtered = b1.value.filter((item) => item.status_customer == 1);
      console.log("Filtered B1 data:", filtered);
      return filtered;
    });

    // const filteredBDataIsDamaged = computed(() => {
    //   return bDataIsDamaged.value.filter(
    //     (item) => item.lcicID_error === "10" || item.lcicID_error === "13"
    //   );
    // });

    const filteredBDataIsDamaged = computed(() => {
      return bDataIsDamaged.value
        .filter(
          (item) => item.lcicID_error === "10" || item.lcicID_error === "13"
        )
        .map((item) => ({
          id: item?.id || null,
          lcicid: item?.lcicID || null,
          com_enterprise_code: item?.com_enterprise_code || null,
          customer_id: item?.customer_id || null,
          branch_id: item?.branch_id || null,
          lcicID_error: item?.lcicID_error || null,
          lcicID_get: item?.lcicID_get || null,
        }));
    });

    const filteredBDataIsDamagedLcicIDError01 = computed(() => {
      return bDataIsDamaged.value.filter(
        (item) => item.lcicID_error === "01" || item.lcicID_error === "31"
      );
    });

    const filteredBDataIsDamagedLcicIDError33 = computed(() => {
      return bDataIsDamaged.value
        .filter((item) => item.lcicID_error === "33")
        .map((item) => ({
          id: item?.id || null,
          lcicid: item?.lcicID || null,
          com_enterprise_code: item?.com_enterprise_code || null,
          customer_id: item?.customer_id || null,
          branch_id: item?.branch_id || null,
          lcicID_error: item?.lcicID_error || null,
          lcicID_get: item?.lcicID_get || null,

        }));
    });

    //     const exportToJson = () => {
    //   const dataToExport = {
    //     filteredBDataIsDamagedLcicIDError01: filteredBDataIsDamagedLcicIDError01.value,

    const exportToJson = () => {
      // ສຳຣອງຂໍ້ມູນໃສ່ໃນຕົວແປ dataToExport
      const dataToExport = filteredBDataIsDamagedLcicIDError01.value.map(
        (item) => {
          // ສຳເນົາຄ່າ lcicID_get ໄປໃສ່ lcicID ແລ້ວລົບ lcicID_get ອອກ
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
