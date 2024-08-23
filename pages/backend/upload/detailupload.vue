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
         <h3>test</h3>
          <v-data-table :items="combinedData" :headers="headers">
    <template v-slot:header>
      <thead>
        <tr style="color: black; background-color: blue">
          <th>
            <p>test</p>
          </th>
          <th>
            <p>test</p>
          </th>
          <th>
            <p>test</p>
          </th>
          <th>
            <p>test</p>
          </th>
          <th>
            <p>test</p>
          </th>
          <th>
            <p>test</p>
          </th>
        </tr>
      </thead>
    </template>
    <template v-slot:item="{ item }">
      <tr>
        <td>{{ item.id }}</td>
        <td>{{ item.id_file }}</td>
        <td>{{ item.lcicID }}</td>
        <td>{{ item.com_enterprise_code }}</td>
        <td>{{ item.customer_id }}</td>
        <td>{{ item.branch_id }}</td>
        <td
          :style="{
            color:
              item.lcicID_error === '0'
                ? 'red'
                : item.lcicID_error === '11'
                ? 'red'
                : '',
          }"
        >
          {{
            item.lcicID_error === "0"
              ? "LCICID ແລະ com_enterprise_code_error ບໍ່ມີ"
              : item.lcicID_error === "11"
              ? "LCICID ແລະ com_enterprise_code_error ຜິດ"
              : item.lcicID_error
          }}
        </td>
        <td
          :style="{
            color: item.com_enterprise_code_error === '04' ? 'red' : '',
          }"
        >
          {{
            item.com_enterprise_code_error === " "
              ? "com_enterprise_code_errorວບໍຖືກ"
              : item.com_enterprise_code_error === "04"
              ? "com_enterprise_code_errorວ່າງ"
              : item.com_enterprise_code_error
          }}
        </td>
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
              <h3>ຂໍ້ມູນບໍ່ມີ ຫຼື ຜິດ Enterprise Code</h3>
              <v-data-table :items="filteredBDataIsDamaged" :headers="headers">
                <template v-slot:header>
                  <tr style="color: black; background-color: blue">
                    <th>
                      <p>{{ headers[0].text }}</p>
                    </th>
                    <th>
                      <p>{{ headers[1].text }}</p>
                    </th>
                    <th>
                      <p>{{ headers[2].text }}</p>
                    </th>
                    <th>
                      <p>{{ headers[3].text }}</p>
                    </th>
                    <th>
                      <p>{{ headers[4].text }}</p>
                    </th>
                    <th>
                      <p>{{ headers[5].text }}</p>
                    </th>
                  </tr>
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
                        item.lcicID_error === "13"
                          ? "com_enterprise_code_error ບໍ່ມີ"
                          : item.lcicID_error === "10"
                          ? "com_enterprise_code_error ຜິດ"
                          : item.lcicID_error
                      }}
                    </td>
                  </tr>
                </template>
              </v-data-table>
            </v-window-item>
            <v-window-item value="two-two">
              <h1>ຂໍ້ມູນລູກທີ່ LCICID ຜິດ ຫຼື ບໍ່ມີ</h1>
              <v-data-table
                :items="filteredBDataIsDamagedLcicIDError01"
                :headers="headers"
              >
                <template v-slot:header>
                  <tr style="color: black; background-color: blue">
                    <th>
                      <p>{{ headers[0].text }}</p>
                    </th>
                    <th>
                      <p>{{ headers[1].text }}</p>
                    </th>
                    <th>
                      <p>{{ headers[2].text }}</p>
                    </th>
                    <th>
                      <p>{{ headers[3].text }}</p>
                    </th>
                    <th>
                      <p>{{ headers[4].text }}</p>
                    </th>
                    <th>
                      <p>{{ headers[5].text }}</p>
                    </th>
                  </tr>
                </template>
                <template v-slot:item="{ item }">
                  <tr>
                    <td>{{ item.id_file }}</td>
                    <td style="color: brown">{{ item.lcicID }}</td>
                    <td>{{ item.com_enterprise_code }}</td>
                    <td>{{ item.customer_id }}</td>
                    <td>{{ item.branch_id }}</td>
                    <td style="color: green">{{ item.lcicID_get }}</td>
                    <td style="color: red">
                      ຂໍ້ມູນລູກຄ້າໃໝ່ໃໝ່ທີ່ຜິດ ຫຼື ບໍ່ມີ LCICID
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
                :headers="headers"
              >
                <template v-slot:header>
                  <tr style="color: black; background-color: blue">
                    <th>
                      <p>{{ headers[0].text }}</p>
                    </th>
                    <th>
                      <p>{{ headers[1].text }}</p>
                    </th>
                    <th>
                      <p>{{ headers[2].text }}</p>
                    </th>
                    <th>
                      <p>{{ headers[3].text }}</p>
                    </th>
                    <th>
                      <p>{{ headers[4].text }}</p>
                    </th>
                    <th>
                      <p>{{ headers[5].text }}</p>
                    </th>
                  </tr>
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
              </v-data-table>
            </v-window-item>
            <v-window-item value="two-five">
              <h3>
                ຂໍ້ມູນທີ່ມີ bnk_code, branch_id, customer_id, loan_id ແຕ່ມີ
                LCICID ແລະ com_enterprise_code ບໍ່ຖືກ
              </h3>
              <v-data-table :items="disputese" :headers="headers">
                <template v-slot:header>
                  <tr style="color: black; background-color: blue">
                    <th>
                      <p>{{ headers[0].text }}</p>
                    </th>
                    <th>
                      <p>{{ headers[1].text }}</p>
                    </th>
                    <th>
                      <p>{{ headers[2].text }}</p>
                    </th>
                    <th>
                      <p>{{ headers[3].text }}</p>
                    </th>
                    <th>
                      <p>{{ headers[4].text }}</p>
                    </th>
                    <th>
                      <p>{{ headers[5].text }}</p>
                    </th>
                  </tr>
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
        <!-- <v-window-item value="two-four">
            <h1>ຂໍ້ມູນທີ່ປັບປຸງຂໍ້ມູນ</h1>
            <v-data-table :items="disputese" :headers="headers">
              <template v-slot:header>
                <tr style="color: black; background-color: blue">
                  <th><p>{{ headers[0].text }}</p></th>
                  <th><p>{{ headers[1].text }}</p></th>
                  <th><p>{{ headers[2].text }}</p></th>
                  <th><p>{{ headers[3].text }}</p></th>
                  <th><p>{{ headers[4].text }}</p></th>
                  <th><p>{{ headers[5].text }}</p></th>
                </tr>
              </template>
              <template v-slot:item="{ item }">
                <tr>
                  <td>{{ item.id_file }}</td>
                  <td>{{ item.lcicID }}</td>
                  <td>{{ item.com_enterprise_code }}</td>
                  <td>{{ item.customer_id }}</td>
                  <td>{{ item.branch_id }}</td>
                  <td style="color: red">ຂໍ້ມູນທີ່ມີ LCICID ແລະ com_enterprise_code_error ຜິດ ຫຼື ບໍ່ມີ</td>
                </tr>
              </template>
            </v-data-table>
          </v-window-item> -->
        <v-window-item value="three">
          <h1>
            ຂໍ້ມູນທີ່ອັບໂຫຼດສົມບຸນ ເປັນຂໍ້ມູນທີ່ຜ່ານການກວດສອບ ແລະ
            ຖືກບັນທຶກລົງຖານຂໍ້ມູນແລ້ວ
          </h1>
          <v-data-table :items="b1Monthly" :headers="headers">
            <template v-slot:header>
              <tr style="color: black; background-color: blue">
                <th>
                  <p>{{ headers[0].text }}</p>
                </th>
                <th>
                  <p>{{ headers[1].text }}</p>
                </th>
                <th>
                  <p>{{ headers[2].text }}</p>
                </th>
                <th>
                  <p>{{ headers[3].text }}</p>
                </th>
                <th>
                  <p>{{ headers[4].text }}</p>
                </th>
                <th>
                  <p>{{ headers[5].text }}</p>
                </th>
              </tr>
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

export default defineComponent({
  setup() {
    definePageMeta({
      layout: "backend",
      middleware: ["auth"],
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

    const combinedData = computed(() => {
      return [...bDataIsDamaged.value, ...dataedit.value];
    });

    const b1WithStatusCustomer1 = computed(() => {
      const filtered = b1.value.filter((item) => item.status_customer == 1);
      console.log("Filtered B1 data:", filtered);
      return filtered;
    });

    const filteredBDataIsDamaged = computed(() => {
      return bDataIsDamaged.value.filter((item) => item.lcicID_error === "10");
    });

    const filteredBDataIsDamagedLcicIDError01 = computed(() => {
      return bDataIsDamaged.value.filter((item) => item.lcicID_error === "10");
    });

    const filteredBDataIsDamagedLcicIDError33 = computed(() => {
      return bDataIsDamaged.value.filter((item) => item.lcicID_error === "33");
    });

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
    };
  },
});
</script>
