<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import { useUtilityStore } from "@/stores/utility";
const respons = useUtilityStore();
const res = computed(() => respons.respons_query_data_utility);
const utility = computed(() => respons.respons_query_data_customer);
const billData = computed(() => respons.respons_query_data_bill);
const referenceData = computed(() => respons.respons_query_data_reference);
onMounted(() => {
  respons.Getdata();
});
</script>
<template>
  <section style="height: 100vh" class="justify-center align-center">
    <v-col cols="12">
        <v-row>
            <v-col cols="12" md="4">
                <div>
                    <p>ທະນາຄານ ແຫ່ງ ສປປ ລາວ</p>
                    <p>ບໍລີສັດ ຂໍ້ມູນຂາວສານສິນເຊື່ອແຫ່ງ ສປປ ລາວ</p>
                </div>
            </v-col>
            <v-col cols="12" md="4">
                <div class="text-center"> 
                    <p>ບົດລາຍງານ</p>
                    <p>ສາທາລະນູປະໂພກ</p>
                </div>
            </v-col>
            <v-col cols="12" md="4">
                <div class="text-end"v-if="referenceData" >

                    <p>ເລກທີ: <b style="color: red;">ຍັງບໍ່ມີຂໍ້ມູນໃສ່</b></p>
                    <p >ນະຄອນຫຼວງວຽງຈັນ, ວັນທີ:{{  referenceData?.[2] || 'N/A' }}</p>
                    
                </div>
            </v-col>
            <v-col cols="12" >
                <v-row v-for="item in utility">
                   
                    <v-col cols="12" md="4"><p>ຊື່ລູກຄ້າ: <b>{{ item.Name  }}</b></p></v-col>
                    <v-col cols="12" md="4"><p>Enquiry Number: <b>{{  referenceData?.[0] || 'N/A' }}</b></p></v-col>
                    <v-col cols="12" md="4"><p>Province: <b>{{  referenceData?.[1] || 'N/A' }}</b></p></v-col>
                </v-row>
            </v-col>
        </v-row>
    </v-col>
   <div style="border: 1px #1565C0 solid ;">
<v-col cols="12">
    <v-row>
        <v-col cols="12" md="6">test</v-col>
        <v-col cols="12" md="6">test</v-col>
    </v-row>
</v-col>
   </div>
    
      <div >
        {{ referenceData }}
      </div>
   
   <!-- <div v-for="item in billData">
    {{ item.Bill_Amount }}
   </div> -->
  </section>
</template>
