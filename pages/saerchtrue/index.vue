<template>
  <v-container>
    <v-col cols="12">
      <v-row>
        <v-col cols="12"> </v-col>
        <v-col cols="12">
          <div class="d-flex justify-end">
            <v-btn class="bg-green mr-5">ເປິດທັງໝົດ</v-btn>
          </div>
          <v-data-table :items="data" :headers="headers" class="elevation-1"
          
          
          >
            
            <!-- <template v-slot:item.namelao="{ item }">
                <NuxtLink to="../test1" class=" mr-1" small @click="editItem(item)" >
                  {{ item.namelao }}
                </NuxtLink>
              </template> -->
            <!-- <template v-slot:item.nameln="{ item }">
                <NuxtLink to="../saerchtrue" class=" mr-1" small  style="color: green;">
                  {{ item.nameln }}
                </NuxtLink>
              </template>
              <template v-slot:item.locationln="{ item }">
                <NuxtLink to="../test1" class=" mr-1" small  style="color: red;">
                  {{ item.locationln }}
                </NuxtLink>
              </template> -->
            <template v-slot:item.id="{ item, index }">
              {{ index + 1 }}
            </template>
            <template v-slot:item.actions="{ item }">
              <v-btn class="bg-green mr-1" small @click="editItem(item)">
                ເປີດ
              </v-btn>
              <!-- <v-btn class="bg-red" small @click="deleteItem(item)">
                ລົບ
              </v-btn> -->
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-col>
  </v-container>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "backend",
});

useHead({
  title: "Collect fees",
  meta: [
    {
      name: "keywords",
      content: "Order, Nuxt 3, Backend",
    },
    {
      name: "Description",
      content: "Order Nuxt 3,  IT Genius Engineering",
    },
  ],
});
import { ref } from "vue";

const data = ref([
  {
    id: 1,
    name: "Sone",
    age: "18",
    enterprisename: "test",
    namelao: "test",
    nameln: "test",
    locationln: "test",
    nameenterprise: "test",
    manager: "test",
    talaphone: "91862481",
  },
  {
    id: 1,
    name: "Sone",
    age: "18",
    enterprisename: "test",
    namelao: "test",
    nameln: "test",
    locationln: "test",
    nameenterprise: "test",
    manager: "test",
    talaphone: "91862481",
  },
  {
    id: 1,
    name: "Sone",
    age: "18",
    enterprisename: "test",
    namelao: "test",
    nameln: "test",
    locationln: "test",
    nameenterprise: "test",
    manager: "test",
    talaphone: "91862481",
  },
  {
    id: 1,
    name: "Sone",
    age: "18",
    enterprisename: "test",
    namelao: "test",
    nameln: "test",
    locationln: "test",
    nameenterprise: "test",
    manager: "test",
    talaphone: "91862481",
  },
  {
    id: 1,
    name: "Sone",
    age: "18",
    enterprisename: "test",
    namelao: "test",
    nameln: "test",
    locationln: "test",
    nameenterprise: "test",
    manager: "test",
    talaphone: "91862481",
  },
  {
    id: 1,
    name: "Sone",
    age: "18",
    enterprisename: "test",
    namelao: "test",
    nameln: "test",
    locationln: "test",
    nameenterprise: "test",
    manager: "test",
    talaphone: "91862481",
  },
  {
    id: 1,
    name: "Sone",
    age: "18",
    enterprisename: "test",
    namelao: "test",
    nameln: "test",
    locationln: "test",
    nameenterprise: "test",
    manager: "test",
    talaphone: "91862481",
  },
  {
    id: 1,
    name: "Sone",
    age: "18",
    enterprisename: "test",
    namelao: "test",
    nameln: "test",
    locationln: "test",
    nameenterprise: "test",
    manager: "test",
    talaphone: "91862481",
  },
  {
    id: 1,
    name: "Sone",
    age: "18",
    enterprisename: "test",
    namelao: "test",
    nameln: "test",
    locationln: "test",
    nameenterprise: "test",
    manager: "test",
    talaphone: "91862481",
  },
  {
    id: 1,
    name: "Sone",
    age: "18",
    enterprisename: "test",
    namelao: "test",
    nameln: "test",
    locationln: "test",
    nameenterprise: "test",
    manager: "test",
    talaphone: "91862481",
  },
  {
    id: 1,
    name: "Sone",
    age: "18",
    enterprisename: "test",
    namelao: "test",
    nameln: "test",
    locationln: "test",
    nameenterprise: "test",
    manager: "test",
    talaphone: "91862481",
  },
  {
    id: 1,
    name: "Sone",
    age: "18",
    enterprisename: "test",
    namelao: "test",
    nameln: "test",
    locationln: "test",
    nameenterprise: "test",
    manager: "test",
    talaphone: "91862481",
  },
  {
    id: 1,
    name: "Sone",
    age: "18",
    enterprisename: "test",
    namelao: "test",
    nameln: "test",
    locationln: "test",
    nameenterprise: "test",
    manager: "test",
    talaphone: "91862481",
  },
]);

const headers = ref([
  { title: "ລຳດັບ", value: "id" },
  { title: "ລະຫັດ ຂສລ", value: "namelao" },
  { title: "ລະຫັດວິສາຫະກິດ", value: "enterprisename" },
  { title: "ຊື່ວິສາຫະກິດ", value: "name" },
  { title: "ຊື່ເຈົ້າຂອງບໍລິສັດ", value: "nameln" },
  { title: "ຊື່ຜູ້ຈັດການ", value: "locationln" },
  { title: "Actions", value: "actions", sortable: false },
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
const link = (item: any) => {};
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
