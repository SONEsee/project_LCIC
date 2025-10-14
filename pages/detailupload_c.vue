<template>
  <v-col cols="12">
    <v-row
      ><v-col cols="12">
        <v-row>
          <v-col cols="12">
            <div>
              <UploadFileDetailData :cidData="cidData" />
            </div>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" md="4">
        <v-select
          v-model="selectedOption"
          :items="options"
          density="compact"
          label="ເລືອກປະເພດຂໍ້ມູນຫຼັກຊັບ"
          variant="outlined"
        ></v-select>
      </v-col>

      <v-col cols="12" md="12">
        <template v-if="selectedOption === options[0]">
          <upload-file-detail-upload-file-to-tal :cidData="cidData" />
        </template>
        <div v-if="selectedOption === options[1]">
          <UploadFileDetailUploadFileColRealEstates :cidData="cidData" />
        </div>
        <div v-if="selectedOption === options[2]">
          <UploadFileDetailUploadFileColMoneyMia :cidData="cidData" />
        </div>
        <div v-if="selectedOption === options[3]">
          <UploadFileDetailUploadFileColEquipmentEqi :cidData="cidData" />
        </div>
        <div v-if="selectedOption === options[4]">
          <UploadFileDetailUploadFileColProjectPrj :cidData="cidData" />
        </div>
        <div v-if="selectedOption === options[5]">
          <UploadFileDetailUploadFileColVechicleVeh :cidData="cidData" />
        </div>
        <div v-if="selectedOption === options[6]">
          <UploadFileDetailUploadFileColGuarantorGua :cidData="cidData" />
        </div>
        <div v-if="selectedOption === options[7]">
          <UploadFileDetailUploadFileColGoldsilverGold :cidData="cidData" />
        </div>
        <div v-if="selectedOption === options[8]">
          <UploadFileDetailUploadFileColGuarantorCom :cidData="cidData" />
        </div>
      </v-col>
    </v-row>
  </v-col>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";

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

const route = useRoute();
const cidData = ref<any>(null);

const options = [
  "ທັງໝົດ",
  "ອາຄານ + ທີ່ດິນ",
  "ເອກະສານມີຄ່າ",
  "ເຄື່ອງຈັກ ແລະ ອຸປະກອນຕ່າງໆ",
  "ໂຄງການ",
  "ຍານພາຫະນະ",
  "ຜູ້ຄ້ຳປະກັນ",
  "GOLD AND SILVER",
  "ບໍລິສັດຄໍ່າປະກັນ",
] as const;

const selectedOption = ref<any>("ທັງໝົດ");

const handleKeyDown = (event: KeyboardEvent) => {
  const key = event.key.toLowerCase();
  const keyMap: Record<string, number> = {
    a: 0,
    b: 1,
    c: 2,
    d: 3,
    e: 4,
    f: 5,
    g: 6,
    h: 7,
    i: 8,
  };

  const index = keyMap[key];
  if (index !== undefined && options[index]) {
    selectedOption.value = options[index];
  }
};

onMounted(() => {
  
  const data = route.query.data;
  if (typeof data === "string") {
    try {
      cidData.value = JSON.parse(data);
    } catch (error) {
      console.error("Failed to parse data:", error);
    }
  } else if (Array.isArray(data)) {
    cidData.value = JSON.parse(JSON.stringify(data));
    console.log("Parsed data:", cidData.value);
  }

 
  document.addEventListener("keydown", handleKeyDown);
});


onUnmounted(() => {
  document.removeEventListener("keydown", handleKeyDown);
});
</script>
