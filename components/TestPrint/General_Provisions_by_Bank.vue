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
                  <p>General Provisions by Bank</p>
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
                      General Provisions for BCEL Based on Active Loans as reported in
                      February 2024
                    </p>
                  </div>
                </div>
                <v-col cols="12">
                  <v-row>
                    <v-col cols="12">
                      <v-table class="mt-15">
                        <thead>
                          <tr style="font-family: 'Times New Roman', Times, serif">
                            <th class="">
                              Value of all Active Loans amount are converted in '000's LAK
                            </th>
                            <th class="text-end">
                              <p>29.523.654.356,26</p>
                            </th>
                          </tr>
                        </thead>
                      </v-table>
                      <v-table class="mt-10">
                        <tbody>
                          <tr
                            v-for="item in desserts"
                            :key="item.name"
                            style="font-family: 'Times New Roman', Times, serif"
                          >
                            <td style="background-color: #85c1e9">{{ item.name }}</td>
                            <td class="text-end">{{ item.namber }}</td>
                          </tr>
                        </tbody>
                      </v-table>
                    </v-col>
                  </v-row>
                </v-col>
            
                <div class="text-center mt-15">
                  <p style="font-size: 70%">
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
         const desserts = ref([
      { name: "0.5% of Total Active Loans", namber: "147.618.271,78" },
      { name: "0.1% of Total Active Loans", namber: "147.618.271,78" },
      { name: "0.2% of Total Active Loans", namber: "147.618.271,78" },
    ]);
    return {
      desserts,
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
  