<template>
  <v-col cols="12">
    <v-row><v-col cols="12">
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
      </v-col>
     
    </v-row>
  </v-col>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import {
  UploadFileDetailUploadFileColMoneyMia,
  UploadFileDetailUploadFileColRealEstates,
} from "~~/.nuxt/components";

export default defineComponent({
  setup() {
    const route = useRoute();
    const cidData = ref(null);

    onMounted(() => {
      const data = route.query.data;
      if (typeof data === "string") {
        cidData.value = JSON.parse(data);
      } else if (Array.isArray(data)) {
        cidData.value = JSON.parse(JSON.stringify(data));
        console.log("feegerger", cidData.value);
      }
    });

    definePageMeta({
      layout: "backend",
      middleware: ["auth"]
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
    const options = [
      "ທັງໝົດ",
      "ອາຄານ + ທີ່ດິນ",
      "ເອກະສານມີຄ່າ",
      "ເຄື່ອງຈັກ ແລະ ອຸປະກອນຕ່າງໆ",
      "ໂຄງການ",
      "ຍານພາຫະນະ",
      "ຜູ້​ຄ້ຳປະກັນ",
      "GOLD AND SILVER",
    ] as string[];

    const selectedOption = ref<string>("ທັງໝົດ");

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key.toLowerCase()) {
        case "a":
          selectedOption.value = options[0];
          break;
        case "b":
          selectedOption.value = options[1];
          break;
        case "c":
          selectedOption.value = options[2];
          break;
        case "d":
          selectedOption.value = options[3];
          break;
        case "e":
          selectedOption.value = options[4];
          break;
        case "f":
          selectedOption.value = options[5];
          break;
        case "g":
          selectedOption.value = options[6];
          break;
        case "h":
          selectedOption.value = options[7];
          break;
      }
    };

    onMounted(() => {
      document.addEventListener("keydown", handleKeyDown);
    });

    return {
      options,
      selectedOption,
      cidData,
      handleKeyDown,
    };
  },
});
</script>
