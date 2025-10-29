<script setup lang="ts"></script>
<template>
  <div class="pa-4 rounded-lg" style="border: 1px #e0f2f1 solid">
    <h3 style="color: blue">
      <v-icon class="mr-3">mdi-account-tie-outline</v-icon
      >ການອັບໂຫຼດຂໍ້ມູນເງິນກູ້(ບຸກຄົນ)
    </h3>
  </div>
  <v-row>
    <v-col cols="12" md="3">
      <v-autocomplete
        label="ເລືອກຕາມສະມາຊິກ"
        density="compact"
        variant="outlined"
      ></v-autocomplete>
    </v-col>
    <v-col cols="12" md="3">
      <v-autocomplete
        label="ເລືອກຕາມງວດທີ່ສົ່ງ"
        density="compact"
        variant="outlined"
      ></v-autocomplete>
    </v-col>
    <v-col cols="12" md="3">
      <v-autocomplete
        label="ເລືອກຕາມປະເພດໄຟລ"
        density="compact"
        variant="outlined"
      ></v-autocomplete>
    </v-col>
    <v-col cols="12" md="3">
      <v-autocomplete
        label="ເລືອກຕາມສະຖານະ"
        density="compact"
        variant="outlined"
      ></v-autocomplete>
    </v-col>
  </v-row>
  <v-sheet
    class="d-flex flex-wrap pa-2 align-center"
    :elevation="10"
    :height="120"
    flat
    color=""
    rounded
  >
    <v-row>
      <v-col cols="12" md="2">
        <v-sheet 
  class="d-flex justify-center align-center text-center"
  color="#BBDEFB"
  :elevation="12"
  :height="100"
  :width="200"
  rounded
>
  <v-row no-gutters class=" align-center">
    <v-col cols="12" class="">
      <h3 class="text-h5 mb-1">5,298</h3>
      <p class="text-caption mb-0">ຈຳນວນລາຍການທັງໝົດ</p>
    </v-col>
  </v-row>
</v-sheet>
      </v-col>
      <v-col cols="12" md="2">
        <v-sheet :elevation="12" :height="100" :width="200" rounded></v-sheet>
      </v-col>
    </v-row>
  </v-sheet>
  
</template>
