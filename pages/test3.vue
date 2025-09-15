<script setup lang="ts">
import { useReeportFCRStore } from "~/stores/reportfcr";
import { onMounted, computed, ref } from "vue";
import { useRoute } from "vue-router";
import dayjs from "dayjs";

const route = useRoute();
const EnterpriseID = (route.query.EnterpriseID as string) || "";
const LCIC_code = (route.query.LCIC_code as string) || "";
const CatalogID = (route.query.CatalogID as string) || "";
const store = useReeportFCRStore();
const batchItems = ref<any[]>([]);
const isBatchMode = ref(false);
const currentBatchIndex = ref(0);
const isProcessing = ref(false);

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search);
  
  // ກວດສອບ parameter reports ໃໝ່
  const reportsParam = urlParams.get('reports');
  
  if (reportsParam) {
    try {
      const reports = JSON.parse(decodeURIComponent(reportsParam));
      if (Array.isArray(reports) && reports.length > 0) {
        batchItems.value = reports.map(item => ({
          enterpriseId: item.EnterpriseID,
          lcicCode: item.LCIC_code,
          catalogId: item.CatalogID
        }));
        isBatchMode.value = true;
        loadBatchItem(0);
        return;
      }
    } catch (error) {
      console.error("Error parsing reports parameter:", error);
    }
  }
  
  // ກວດສອບ parameter items[] ແບບເກົ່າ (backward compatibility)
  const itemsParam = urlParams.getAll('items[]');
  
  if (itemsParam && itemsParam.length > 0) {
    try {
      const items = itemsParam.map(item => JSON.parse(decodeURIComponent(item)));
      batchItems.value = items;
      isBatchMode.value = true;
      if (items.length > 0) {
        loadBatchItem(0);
      }
      return;
    } catch (error) {
      console.error("Error parsing items parameter:", error);
    }
  }
  
  // ຖ້າບໍ່ມີ batch parameters, ໃຊ້ single report mode
  if (EnterpriseID && LCIC_code && CatalogID) {
    store.GetdataReportFCR(EnterpriseID, LCIC_code, CatalogID);
  }
});

const loadBatchItem = async (index: number) => {
  if (index >= batchItems.value.length) return;
  
  isProcessing.value = true;
  currentBatchIndex.value = index;
  
  const item = batchItems.value[index];
  try {
    await store.GetdataReportFCR(
      item.enterpriseId, 
      item.lcicCode, 
      item.catalogId
    );
  } catch (error) {
    console.error(`Error loading batch item ${index}:`, error);
  } finally {
    isProcessing.value = false;
  }
};

const prevBatchItem = () => {
  if (currentBatchIndex.value > 0) {
    loadBatchItem(currentBatchIndex.value - 1);
  }
};

const nextBatchItem = () => {
  if (currentBatchIndex.value < batchItems.value.length - 1) {
    loadBatchItem(currentBatchIndex.value + 1);
  }
};

const printCurrent = () => {
  window.print();
};

const printAll = async () => {
  for (let i = 0; i < batchItems.value.length; i++) {
    await loadBatchItem(i);
    await new Promise(resolve => setTimeout(resolve, 500));
    window.print();
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
};

const activeloan = computed(() => {
  return store.respon_data_activeloan;
});

const history = computed(() => {
  return store.respon_data_searchhistory;
});

const enterprisinfo = computed(() => {
  return store.respon_data_enterprisinfo;
});

const loaninfo = computed(() => {
  return store.respon_data_loaninfo;
});

const lon_history = computed(() => {
  return store.respons_lon_class_history;
});

const user = localStorage.getItem("user_data")
  ? JSON.parse(localStorage.getItem("user_data") as string)
  : null;

const getCols = (length: number) => {
  if (length === 1) return 12;
  if (length === 2) return 6;
  if (length === 3) return 4;
  if (length === 4) return 3;
  if (length === 5) return 2;
};

const print = () => {
  window.print();
};

const batchProgress = computed(() => {
  if (batchItems.value.length === 0) return 0;
  return Math.round(((currentBatchIndex.value + 1) / batchItems.value.length) * 100);
});

// ຄິດໄລ່ຂໍ້ມູນສຳລັບ batch mode
const currentReportInfo = computed(() => {
  if (!isBatchMode.value || batchItems.value.length === 0) return null;
  
  const current = batchItems.value[currentBatchIndex.value];
  return {
    enterpriseId: current.enterpriseId,
    lcicCode: current.lcicCode,
    catalogId: current.catalogId,
    position: currentBatchIndex.value + 1,
    total: batchItems.value.length
  };
});
</script>

<template>
  <v-container>
    <div
      class="rounded-lg"
      :style="{
        border: '1px #2979FF solid',
      }"
    >
      <v-col cols="12">
        <section class="pa-5" id="main-content">
          <div>
            <v-btn class="button" to="../backend/searchuser">
              <v-icon icon="mdi-arrow-left" style="font-size: 150%"></v-icon>
            </v-btn>
          </div>
          
          <!-- ສະແດງຂໍ້ມູນ batch mode ຖ້າມີ -->
          <div v-if="isBatchMode && currentReportInfo" class="mb-4 pa-3 bg-blue-lighten-5 rounded">
            <div class="d-flex justify-between align-center mb-2">
              <h4 class="text-primary">ລາຍງານແບບກຸ່ມ</h4>
              <v-chip color="primary" variant="outlined">
                {{ currentReportInfo.position }} / {{ currentReportInfo.total }}
              </v-chip>
            </div>
            
            <v-progress-linear
              :model-value="batchProgress"
              color="primary"
              height="6"
              rounded
              class="mb-2"
            ></v-progress-linear>
            
            <div class="d-flex justify-between">
              <v-btn
                @click="prevBatchItem"
                :disabled="currentBatchIndex === 0 || isProcessing"
                variant="outlined"
                size="small"
              >
                <v-icon icon="mdi-arrow-left"></v-icon>
                ກັບຄືນ
              </v-btn>
              
              <div class="d-flex gap-2">
                <v-btn
                  @click="printCurrent"
                  color="primary"
                  variant="outlined"
                  size="small"
                >
                  <v-icon icon="mdi-printer"></v-icon>
                  ພີມໜ້ານີ້
                </v-btn>
                
                <v-btn
                  @click="printAll"
                  color="success"
                  variant="outlined"
                  size="small"
                >
                  <v-icon icon="mdi-printer-multiple"></v-icon>
                  ພີມທັງໝົດ
                </v-btn>
              </div>
              
              <v-btn
                @click="nextBatchItem"
                :disabled="currentBatchIndex === batchItems.length - 1 || isProcessing"
                variant="outlined"
                size="small"
              >
                ໄປຕໍ່
                <v-icon icon="mdi-arrow-right"></v-icon>
              </v-btn>
            </div>
          </div>

          <div class="text-end mt-5 button" v-if="!isBatchMode">
            <v-btn @click="print" class="bg-indigo-accent-4">
              <v-icon icon="mdi-printer-outline"></v-icon> ພີມ
            </v-btn>
          </div>

          <v-row>
            <v-col cols="8" class="text-center">
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
                      <hr />
                      <h4>Lao Credit Information Company</h4>
                    </div>
                  </v-col>
                </v-row>
              </div>
            </v-col>
            <v-col cole="12" class="text-end mt-4">
              <div class="" v-if="enterprisinfo && enterprisinfo.length > 0">
                <p>
                  ລະຫັດວິສາຫະກິດ: <b>{{ enterprisinfo[0].EnterpriseID }}</b>
                </p>
                <p>
                  ລະຫັດຂສລ: <b>{{ enterprisinfo[0].LCIC_code }}</b>
                </p>
              </div>
              <div class="" v-if="user">
                <p style="font-size: ">
                  ຜູ້ສອບຖາມ: <b> {{ user.nameE }}</b> ຈາກທະນາຄານ:
                  <b>{{ user.MID?.code }}</b>
                </p>
              </div>
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <div class="text-center">
                <h3 class="text-md mt-5">
                  <b>ບົດລາຍງານສິນເຊື່ອຄົບຖວ້ນ(ສໍາລັບນິຕິບຸກຄົນ)</b>
                </h3>
                <div v-if="isBatchMode && currentReportInfo" class="mt-2">
                  <v-chip color="info" variant="outlined" size="small">
                    ລາຍງານທີ່ {{ currentReportInfo.position }} ຈາກທັງໝົດ {{ currentReportInfo.total }} ລາຍງານ
                  </v-chip>
                </div>
              </div>
            </v-col>
          </v-row>
        </section>
      </v-col>

      <!-- ສ່ວນທີ່ເຫຼືອຂອງລາຍງານ - ຄືເກົ່າ -->
      <v-col cols="12">
        <div class="rounded-lg">
          <p><b> - ຂໍ້ມູນທົວໄປຜູ້ກູ້</b></p>
          <div
            :style="{
              border: '1px #2979FF solid',
            }"
            class="rounded-lg"
          >
            <v-row class="mt-2 mb-1 ml-1 mr-1">
              <v-col cols="4" v-if="enterprisinfo && enterprisinfo.length > 0">
                <p>
                  <b>ຊື່ວິສາຫະກິດ:</b> {{ enterprisinfo[0].enterpriseNameLao }}
                </p>
                <p><b>ເລກທີ:</b>---------</p>
              </v-col>
              <v-col cols="4" v-if="enterprisinfo && enterprisinfo.length > 0">
                <p>
                  <b>ວັນທີອອກໃບທະບຽນ:</b>
                  {{ enterprisinfo[0].regisDate.slice(0, -18) }}
                </p>
                <p>
                  <b>ທີ່ຕັ້ງວິສາຫະກິດ:</b> {{ enterprisinfo[0].enLocation }}
                </p>
                <p><b>ພາກສວນເສດຖະກິດ:</b> --</p>
              </v-col>
              <v-col cols="4" v-if="enterprisinfo && enterprisinfo.length > 0">
                <p>
                  <b>ທຶນຈົດທະບຽນ:</b>
                  {{
                    Number(enterprisinfo[0].investmentAmount).toLocaleString()
                  }}
                  <b v-if="enterprisinfo[0].investmentCurrency">{{
                    enterprisinfo[0].investmentCurrency
                  }}</b>
                </p>
                <p><b>ຊື່ເຈົ້າຂອງວິສາຫະກິດ:</b> --</p>
              </v-col>
            </v-row>
          </div>
        </div>
      </v-col>

      <p><b>- ຂໍ້ມູນປະຫວັດການເຂົ້າຄົ້ນຫາ</b></p>
      <div
        class="rounded-lg"
        :style="{
          border: '1px #2979FF solid',
        }"
      >
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
            <tr v-for="(item, index) in history?.slice(-12) || []">
              <td>{{ index + 1 }}</td>
              <td>
                {{
                  item?.id instanceof Date
                    ? item.id.toISOString().slice(0, 10)
                    : item?.id
                    ? String(item.id).slice(0, -11)
                    : "–"
                }}
              </td>
              <td>{{ item?.bnk_code || "–" }}</td>
              <td>{{ item?.lon_purpose || "–" }}</td>
              <td>--</td>
            </tr>
          </tbody>
        </v-table>
      </div>

      <v-col cols="12">
        <p><b>- ລວມວົງເງິນກູ້ທີ່ເຄື່ອນໄຫວທັງໝົດ</b></p>
        <v-table
          class="mt-5 elevation-1 v-data-table1 rouded-lg"
          :style="{
            border: '1px #2979FF solid',
          }"
        >
          <thead>
            <tr style="font-size: 90%" class="text-bold">
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
            <tr v-for="(item, index) in loaninfo" :key="index">
              <td>{{ item.bnk_code }}</td>
              <td>{{ item.loan_id }}</td>
              <td>{{
                  (new Date(item.lon_open_date)).toLocaleString('en-GB', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                  })
                }}</td>
              <td>{{ Number(item.lon_credit_line).toLocaleString() }}</td>
              <td>
                {{ Number(item.lon_outstanding_balance).toLocaleString() }}
              </td>
              <td>{{ item.lon_currency_code }}</td>
              <td>{{ item.lon_no_days_slow }}</td>
              <td>{{ item.lon_class }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-col>

      <p><b>-ລາຍລະອຽດຂໍ້ມູນເງິນກູ້</b></p>
      
      <v-col cols="12">
        <v-row>
          <v-col cols="12">
            <v-row>
              <v-col
                class="mt-2"
                v-for="(item, index) in activeloan"
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
                          <p> <b>ມື້ເປິດເງິນກູ້: </b>{{dayjs( item.lon_open_date).format("YYYY-MM-DD")}}</p>
                          <p> <b>ມື້ໝົດສັນຍາເງິນກູ້ເງິນກູ້: </b> {{ dayjs(item.lon_exp_date).format("YYYY-MM-DD") }}</p>
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

                    <hr color="indigo" model-value="100" rounded></hr>

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
                                    new Date(collateral.collateral_info.insert_date).toLocaleDateString()
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
                                    new Date(collateral.collateral_info.insert_date).toLocaleDateString()
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
                                    new Date(collateral.collateral_info.insert_date).toLocaleDateString()
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
                                    new Date(collateral.collateral_info.insert_date).toLocaleDateString()
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
                                    new Date(collateral.collateral_info.insert_date).toLocaleDateString()
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
                                    new Date(collateral.collateral_info.insert_date).toLocaleDateString()
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
                                    new Date(collateral.collateral_info.insert_date).toLocaleDateString()
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
                                  collateral.col_type === 'C2.8' ||
                                  collateral.col_type === 'c2.8'
                                "
                              >
                                <p>
                                  ລົງຂໍ້ມູນວັນທີ:
                                  <b>
                                    {{
                                      new Date(collateral.collateral_info.insert_date).toLocaleDateString()
                                    }}
                                  </b>
                                </p>
                                <p>ປະເພດຫຼັກຊັບ:<b>ວິສາຫະກິດຄໍ້າປະກັນ</b></p>
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
                            <th>ລຳດັບ.</th>
                            <th>ເດືອນ ,ວັນ</th>
                            <th>ວົງເງິນກູ້</th>
                            <th>ຍອດຍັງເຫຼືອ</th>
                            <th>ຈຳນວນວັນຈ່າຍຊ້າ</th>
                            <th>ສະກຸນເງິນ</th>
                            <th>ປະເພດເງິນກູ້</th>
                            <th>ສະຖານະ</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(item , index) in lon_history">
                            <td>{{index +1}}</td>
                            <td>{{ item.period.slice(0, 4) + '-' + item.period.slice(4) }}</td>
                            <td>{{Number( item.lon_credit_line).toLocaleString() }}</td>
                            <td>{{Number( item.lon_outstanding_balance).toLocaleString() }}</td>
                            <td>{{ item.lon_no_days_slow }}</td>
                            <td>{{ item.lon_currency_code }}</td>
                            <td>{{ item.lon_class }}</td>
                            <td>{{ item.lon_status }}</td>
                          </tr>
                        </tbody>
                      </v-table>
                    </div>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" class="text-">
            <div style="border: #1565c0 1px solid; padding: 10px" class="bg-blue-darken-4 rounded-lg">
              <v-col cols="12">
                <v-row>
                  <v-col cols="6" >
                    <p> <v-icon icon="mdi-map-marker" style="font-size: 120%; color: red;"></v-icon> 2nd Floor, Lao Security Exchange Building Phonthan  Village, </p><p class="ml-5">Xaysettha District, Vientiane Capital</p>
                  </v-col>
                  <v-col cols="6" >
                    <p> <v-icon icon="mdi-phone" style="font-size: 100%;color: #1565c0;" class="mr-2"></v-icon>  Telephone: (856)-21-25429</p>
                    <p> <v-icon icon=" mdi-email-outline" style="font-size: 100%;" class="mr-2"></v-icon>  Email: info@lcic.com.la</p>
                  </v-col>
                </v-row>
              </v-col>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </div>
  </v-container>
</template>

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
    padding: 4px 10% 0 10%;
    background: fixed;
    background-image: fixed;
    font-size: 10pt !important;
  }
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-size: 11pt !important;
  }
  p,
  div,
  span,
  table {
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
  
  /* ເຊື່ອງສ່ວນ batch navigation ເວລາພີມ */
  .bg-blue-lighten-5 {
    display: none !important;
  }
  
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
