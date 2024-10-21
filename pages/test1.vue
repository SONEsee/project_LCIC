<template>
  <div style="border: 1px solid brown;" id="0">
    <v-col>
      <v-row>
        <v-col cols="12">
          <v-autocomplete
            v-model="selectedVillage"
            :items="villages"
            item-text="title"
            item-value="id"
            label="ກະລຸນາເລືອກບ້ານ"
            @input="handleVillageSelect"
          ></v-autocomplete>
        </v-col>
      </v-row>
    </v-col>

    <h1>ບ້ານທີ່ເລືອກ: {{ selectedVillageName }}</h1>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";

const selectedVillage = ref(null);
const selectedVillageName = ref("");
const villages = ref([]);
const title = ref(""); 


const fetchVillages = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:35729/api/filter_villages/");
    villages.value = response.data.map(village => ({
      ...village,
      title: `ແຂວງ: ${village.Province_Name} - ເມືອງ: ${village.District_Name} - ບ້ານ ${village.Village_Name}`
    }));

    console.log("Fetched villages:", JSON.parse(JSON.stringify(villages.value)));
  } catch (error) {
    console.error("Error fetching villages:", error);
  }
};


onMounted(fetchVillages);

const handleVillageSelect = (value: number) => {
  const selected = villages.value.find(village => village.id === value);
  if (selected) {
    selectedVillageName.value = selected.Village_Name;
    title.value = ` ${selected.District_Name} ${selected.Province_Name}  `;
  }
  console.log("Selected village ID:", value);
  console.log("Selected village name:", selectedVillageName.value);
  console.log("Selected province and district:", title.value);
};
</script>
