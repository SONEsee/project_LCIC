<template>

    <div>
        <v-btn class="button" to="../report">
          <v-icon icon="mdi-arrow-left" style="font-size: 150%"></v-icon>
        </v-btn>
      </div>
      <div class="text-end mt-5 button">
        <v-btn @click="print" class="bg-indigo-accent-4"
          ><v-icon icon="mdi-printer-outline"></v-icon> ພີມ</v-btn
        >
      </div>
    <div>
        <v-container>
          <v-col cols="12">
            <v-row>
              <v-col cols="6">
                <v-row>
                  <v-col cols="2">
                    <div class="d-flex align-center mt-2">
                      <v-img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQguq0YjU42M_ijrBwnE9IpgFAFeMZQCDDJVi3yrfOCog&s"
                        width="100"
                      ></v-img></div
                  ></v-col>
                  <v-col cols="10">
                    <div class="mt-" style="font-size: 16px">
                      <p>ບໍລິສັດ ຂໍ້ມູນຂ່າວສານສິນເຊືອ ແຫ່ງ ສປປລາວ</p>
                      <v-progress-linear
                        color="#212121"
                        :model-value="60"
                        rounded
                      ></v-progress-linear>
                      <p>Lao Credit Information Company</p>
                    </div>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
  

            <div style="font-family: Noto Sans Lao">
                <div
                  class="text-center"
                  style="
                    background-color: #0517b9;
                    color: #ecf0f1;
                    font-family: Noto Sans Lao;
                  "
                >
                  <p>Portfolio Analysis Total Loan Value per Loan Class</p>
                </div>
                <div>
                  <div>
                    <ReportPoum />
                  </div>
                  <div
                    style="background-color: #0517b9; color: #ecf0f1"
                    class="text-center mt-5"
                  >
                    <p style="font-family: Noto Sans Lao">
                      Loan Class for ALL BANKS Based on Active Loans as reported by all
                      banks for the month of February 2024
                    </p>
                  </div>
                </div>
                <v-col cols="12">
                  <v-row>
                    <v-col cols="12" class="mt-10">
                      <p>Strictly Confidential - for BOL internal use only</p>
                      <v-table>
                        <thead>
                          <tr style="font-family: 'Times New Roman', Times, serif">
                            <th class="text-end" style="font-size: 70%">
                              <p>amount are converted in '000's LAK</p>
                            </th>
            
                            <th
                              style="background-color: #0517b9; color: #ecf0f1"
                              class="text-center"
                            >
                              <p>D</p>
                              <p>Doubtful</p>
                            </th>
                            <th
                              style="background-color: #0517b9; color: #ecf0f1"
                              class="text-center"
                            >
                              <p>E</p>
                              <p>Loss / Write off</p>
                            </th>
                            <th
                              style="background-color: #0517b9; color: #ecf0f1"
                              class="text-center"
                            >
                              <p>C2</p>
                            </th>
                            <th
                              style="background-color: #0517b9; color: #ecf0f1"
                              class="text-center"
                            >
                              Total
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="(item, index) in items"
                            :key="index"
                            class="text-center"
                            style="font-family: 'Times New Roman', Times, serif"
                          >
                            <td>{{ item.name }}</td>
                            <td>{{ item.d }}</td>
                            <td>{{ item.e }}</td>
                            <td>{{ item.c2 }}</td>
                            <td>{{ item.total }}</td>
                          </tr>
                          <tr style="font-family: 'Times New Roman', Times, serif">
                            <th
                              style="background-color: #85c1e9; color: #ecf0f1"
                              class="pl-13"
                            >
                              Required Provision
                            </th>
            
                            <th
                              style="background-color: #85c1e9; color: #ecf0f1"
                              class="text-center"
                            >
                              <p>2.633.214,82</p>
                            </th>
                            <th
                              style="background-color: #85c1e9; color: #ecf0f1"
                              class="text-center"
                            >
                              <p>149.242.246,91</p>
                            </th>
                            <th
                              style="background-color: #85c1e9; color: #ecf0f1"
                              class="text-center"
                            >
                              <p>80.000,01</p>
                            </th>
                            <th
                              style="background-color: #85c1e9; color: #ecf0f1"
                              class="text-center"
                            >
                              151.955.461,74
                            </th>
                          </tr>
                        </tbody>
                      </v-table>
                    </v-col>
                  </v-row>
                </v-col>
                <div class="text-center">
                  <p style="font-size: 50%">
                    Disclaimer: The information compiled was based on the availability of
                    data as received by LCIC from the banks for the specified period.
                  </p>
                </div>
              </div>
          </v-col>
        </v-container>
      </div>

  </template>
  
  <script lang="ts">
  import { defineComponent } from "vue";
  export default defineComponent({
    setup() {
        const items = ref([
      {
        name: "Value of all Active Loans",
        d: "13.166.074,10",
        e: "298.484.493,82",
        c2: "80.000,01",
        total: "311.730.567,93",
      },
    ]);
      return {
        items,
      };
    },
    methods: {
      print() {
        window.print();
      },
    },
  });
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
  