<template>
    <section class="pa-3" id="main-content">
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
  
            <div style="font-family: Noto Sans Lao;">
                <div class="text-center " style="background-color:#0517b9; color:#ECF0F1; font-family: Noto Sans Lao;" >
              
                  <p>Distribution of Loan Class by Province by Bank</p>
                </div>
                <div>
                 <div>
                  <ReportPoum />
                </div>
                  <div style="background-color:#0517b9; color: #ECF0F1;" class="text-center mt-5">
              <p style="font-family: Noto Sans Lao;">Loan Class by Loan Province for BCEL
              Based on Active Loans as reported in February 2024</p>
                  </div>
                </div>
              <v-col cols="12">
                <v-row>
                  <v-col cols="12">
                    <v-table>
                      <thead>
                        <tr style="font-family: 'Times New Roman', Times, serif;">
                          <th ></th>
                          <th style="background-color: #0517b9; color: #ECF0F1;" class="text-center">A</th>
                          <th style="background-color: #0517b9; color: #ECF0F1;" class="text-center">B</th>
                          <th style="background-color: #0517b9; color: #ECF0F1;" class="text-center">C</th>
                          <th style="background-color: #0517b9; color: #ECF0F1;" class="text-center">D</th>
                          <th style="background-color: #0517b9; color: #ECF0F1;" class="text-center">E</th>
                          <th style="background-color: #0517b9; color: #ECF0F1;" class="text-center">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(item,index) in items " :key="index" class="text-center" style="font-family: 'Times New Roman', Times, serif;">
                          <td> {{ item.name }} </td>
                          <td>{{ item.a }}</td>
                          <td>{{ item.b }}</td>
                          <td>{{ item.c }}</td>
                          <td>{{ item.d }}</td>
                          <td>{{ item.e }}</td>
                          <td>{{ item.total }}</td>
                        </tr>
                      </tbody>
                      <tr style="font-family: 'Times New Roman', Times, serif;">
                        
                          <th style="background-color: #0517b9; color: #ECF0F1;" class="text-center">Total</th>
                          <th style="background-color: #0517b9; color: #ECF0F1;" class="text-center">33455</th>
                          <th style="background-color: #0517b9; color: #ECF0F1;" class="text-center">7799</th>
                          <th style="background-color: #0517b9; color: #ECF0F1;" class="text-center">8765</th>
                          <th style="background-color: #0517b9; color: #ECF0F1;" class="text-center">76778</th>
                          <th style="background-color: #0517b9; color: #ECF0F1;" class="text-center">5578</th>
                          <th style="background-color: #0517b9; color: #ECF0F1;" class="text-center">36768</th>
                        </tr>
                    </v-table>
                  </v-col>
                </v-row>
                
              </v-col>
              
              
              
              </div>

          </v-col>
        </v-container>
      </div>
    </section>
  </template>
  
  <script lang="ts">
  import { defineComponent } from "vue";
  export default defineComponent({
    setup() {
      const items = ref([
        {
          name: "Agricultural",
          a: "676",
          b: "0",
          c: "1",
          d: "0",
          e: "3",
          total: "71",
        },
        {
          name: "Agricultural",
          a: "676",
          b: "0",
          c: "1",
          d: "0",
          e: "3",
          total: "71",
        },
        {
          name: "Agricultural",
          a: "676",
          b: "0",
          c: "1",
          d: "0",
          e: "3",
          total: "71",
        },
        {
          name: "Agricultural",
          a: "676",
          b: "0",
          c: "1",
          d: "0",
          e: "3",
          total: "71",
        },
        {
          name: "Agricultural",
          a: "676",
          b: "0",
          c: "1",
          d: "0",
          e: "3",
          total: "71",
        },
        {
          name: "Agricultural",
          a: "676",
          b: "0",
          c: "1",
          d: "0",
          e: "3",
          total: "71",
        },
        {
          name: "Agricultural",
          a: "676",
          b: "0",
          c: "1",
          d: "0",
          e: "3",
          total: "71",
        },
        {
          name: "Agricultural",
          a: "676",
          b: "0",
          c: "1",
          d: "0",
          e: "3",
          total: "71",
        },
        {
          name: "Agricultural",
          a: "676",
          b: "0",
          c: "1",
          d: "0",
          e: "3",
          total: "71",
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
  