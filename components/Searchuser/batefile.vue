<template>
  <v-container>
    <v-col cols="12">
      <v-row>
        <v-col cols="12">
          <div>
            <v-file-input
              label="File input"
              prepend-icon="mdi-camera"
              variant="outlined"
              v-model="selectedFile"
              accept=".png, .jpg, .jpeg"
            ></v-file-input>
            <v-btn class="bg-blue-darken-4" @click="uploadFile">
              ອັບໂຫຼດ
            </v-btn>
          </div>
        </v-col>
        <v-col cols="12">
          <v-data-table :items="data" :headers="headers" class="elevation-1">
            <!-- <template v-slot:item.namelao="{ item }">
              <NuxtLink to="../test1" class=" mr-1" small @click="editItem(item)" >
                {{ item.namelao }}
              </NuxtLink>
            </template> -->
            <template v-slot:item.nameln="{ item }">
              <NuxtLink to="../saerchtrue" class=" mr-1" small  style="color: green;">
                {{ item.nameln }}
              </NuxtLink>
            </template>
            <template v-slot:item.locationln="{ item }">
              <NuxtLink to="../fals" class=" mr-1" small  style="color: red;">
                {{ item.locationln }}
              </NuxtLink>
            </template>
            <!-- <template v-slot:item.actions="{ item }">
              <v-btn class="bg-green mr-1" small @click="editItem(item)">
                ເປີດ
              </v-btn>
              <v-btn class="bg-red" small @click="deleteItem(item)">
                ລົບ
              </v-btn>
            </template> -->
          </v-data-table>
        </v-col>
      </v-row>
    </v-col>
  </v-container>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const data = ref([
  {
    id: 1,
    name: "2024-10-15",
    age: "18",
    enterprisename: "test",
    namelao: "15",
    nameln: "14",
    locationln: "1",
    nameenterprise: "test",
    manager: "test",
    talaphone: "91862481",
  },
  {
    id: 2,
    name: "2024-10-15",
    age: "18",
    enterprisename: "test",
    namelao: "14",
    nameln: "14",
    locationln: "0",
    nameenterprise: "test",
    manager: "test",
    talaphone: "91862481",
  },
  {
    id: 3,
    name: "2024-10-15",
    age: "18",
    enterprisename: "test",
    namelao: "200",
    nameln: "150",
    locationln: "50",
    nameenterprise: "test",
    manager: "test",
    talaphone: "91862481",
  },
]);

const headers = ref([
  { title: "ລຳດັບ", value: "id" },
  { title: "ມື້ສົ່ງ", value: "name" },
  { title: "ຊື່ວິສາຫະຫິດ", value: "enterprisename" },
  { title: "ຈຳນວນທັງໝົດ", value: "namelao" },
  { title: "ຄົ້ນຫາພົບ", value: "nameln" },
  { title: "ຄົ້ນຫາບໍ່ພົບ", value: "locationln" },
//   { title: "Actions", value: "actions", sortable: false },
]);

const selectedFile = ref<File | null>(null);

const uploadFile = () => {
  if (!selectedFile.value) {
    alert("Please select a file to upload!");
    return;
  }

  console.log("Uploading file:", selectedFile.value.name);
  selectedFile.value = null;
};

const editItem = (item1: any) => {
  alert(`Editing item: ${item1.name}`);
};

const deleteItem = (item: any) => {
  const index = data.value.findIndex((d) => d.id === item.id);
  if (index !== -1) {
    data.value.splice(index, 1);
    alert(`Deleted item: ${item.name}`);
  }
};
const link = (item: any) => {

}
</script>

<style scoped>
.bg-blue-darken-4 {
  background-color: #1e88e5;
  color: white;
}
.bg-green {
  background-color: #4caf50;
  color: white;
}
.bg-red {
  background-color: #e53935;
  color: white;
}
</style>
