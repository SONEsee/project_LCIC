<script setup lang="ts">
import { MemberStore } from "@/stores/memberinfo";
const memberStore = MemberStore();
const memberData = computed(()=>{
    const data = memberStore.respons_data_query;
    if(Array.isArray(data)){
        return data
    }
    if(data && typeof data){
        return [data]
    }
    return []
})
const displayMember =  (item:any)=>{
if(!item || !item.bnk_code || !item.code || !item.nameL) return "ທັງໝົດ";
return `${item.bnk_code}-${item.code}-${item.nameL}`
}
onMounted(()=>{
    memberStore.getMemberInfo()
})
</script>
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
      :items="memberData"
      :item-title="displayMember"
      item-value="bnk_code"
        label="ເລືອກຕາມສະມາຊິກ"
        density="compact"
        variant="outlined"
      >
      <template v-slot:item="{item, props}">
        <v-list-item v-bind="props" :title="`${item.raw.bnk_code}-${item.raw.code}-${item.raw.nameL}`"></v-list-item>
      </template>
    </v-autocomplete>
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
          :elevation="12"
          :height="100"
          :width="200"
          rounded
        >
          <v-row no-gutters class="align-center">
            <v-col cols="12" class="">
              <h3 class="text-h5 mb-1">5,298</h3>
              <p class="text-caption mb-0">ຈຳນວນລາຍການທັງໝົດ</p>
            </v-col>
          </v-row>
        </v-sheet>
      </v-col>
      <v-col cols="12" md="2">
        <v-sheet
          class="d-flex justify-center align-center text-center"
          :elevation="12"
          :height="100"
          :width="200"
          rounded
        >
          <v-row no-gutters class="align-center">
            <v-col cols="12" class="">
              <h3 class="text-h5 mb-1">5,298</h3>
              <p class="text-caption mb-0">ສຳເລັດ</p>
            </v-col>
          </v-row>
        </v-sheet>
      </v-col>
      <v-col cols="12" md="2">
        <v-sheet
          class="d-flex justify-center align-center text-center"
          :elevation="12"
          :height="100"
          :width="200"
          rounded
        >
          <v-row no-gutters class="align-center">
            <v-col cols="12" class="">
              <h3 class="text-h5 mb-1">5,298</h3>
              <p class="text-caption mb-0">ກຳລັງດຳດນີນການ</p>
            </v-col>
          </v-row>
        </v-sheet>
      </v-col>
      <v-col cols="12" md="2">
        <v-sheet
          class="d-flex justify-center align-center text-center"
          :elevation="12"
          :height="100"
          :width="200"
          rounded
        >
          <v-row no-gutters class="align-center">
            <v-col cols="12" class="">
              <h3 class="text-h5 mb-1">5,298</h3>
              <p class="text-caption mb-0">ປະຕິເສດ</p>
            </v-col>
          </v-row>
        </v-sheet>
      </v-col>
      <v-col cols="12" md="2">
        <v-sheet
          class="d-flex justify-center align-center text-center"
          :elevation="12"
          :height="100"
          :width="200"
          rounded
        >
          <v-row no-gutters class="align-center">
            <v-col cols="12" class="">
              <h3 class="text-h5 mb-1">5,298</h3>
              <p class="text-caption mb-0">ອັດຕາສຳເລັດ</p>
            </v-col>
          </v-row>
        </v-sheet>
      </v-col>
      <v-col cols="12" md="2">
        <v-sheet
          class="d-flex justify-center align-center text-center"
          :elevation="12"
          :height="100"
          :width="200"
          rounded
        >
          <v-row no-gutters class="align-center">
            <v-col cols="12" class="">
              <h3 class="text-h5 mb-1">5,298/0</h3>
              <p class="text-caption mb-0">JSON/XML</p>
            </v-col>
          </v-row>
        </v-sheet>
      </v-col>
    </v-row>
  </v-sheet>

  <v-sheet :elevation="9" rounded>
    <div class="pa-4 rounded-lg mt-4" style="border: 1px solid #e0f2f1">
      <v-row no-gutters class="align-center">
        <v-col cols="12" md="6" class="mb-2 mb-md-0">
          <h3 class="text-h6">ລາຍການຟາຍທີ່ອັບໂຫຼດ</h3>
        </v-col>
        <v-col cols="12" md="6" class="d-flex justify-end">
          <v-text-field
            style="max-width: 300px"
            density="compact"
            variant="outlined"
            prepend-inner-icon="mdi-magnify"
            placeholder="ຄົ້ນຫາຟາຍ..."
            clearable
            hide-details
          ></v-text-field>
        </v-col>
      </v-row>
    </div>
    <v-data-table></v-data-table>
  </v-sheet>
</template>
