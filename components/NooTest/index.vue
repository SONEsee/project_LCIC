<template>
  <div>
    <v-col cols="12">
      <v-card-title class="d-flex align-center pe-2">
    <v-icon icon="mdi-video-input-component"></v-icon> &nbsp;
    Find a Graphics Card
    
    <v-spacer></v-spacer>
    
    <v-text-field
      v-model="search"
      density="compact"
      label="Search"
      prepend-inner-icon="mdi-magnify"
      variant="solo-filled"
      flat
      hide-details
      single-line
    ></v-text-field>
    <v-autocomplete
      density="compact"
      variant="solo-filled"
      flat
      hide-details
      single-line
      label="Autocomplete"
      :items="user"
      @input="UserSelect"
    ></v-autocomplete>
  </v-card-title>

      <v-divider></v-divider>

      <v-data-table :headers="headers" 
          :items="files"
          :items-per-page="5"
          :search="search"
          class="elevation-1"
        >
        <template v-slot:[`item.fullImagePath`]="{ item }">
          <img
            v-if="item.fullImagePath"
            :src="item.fullImagePath"
            alt="File Image"
            class="table-image"
          />
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-btn color="primary" @click="viewFile(item)">View</v-btn>
        </template>
      </v-data-table>

      <p v-if="files.length === 0">ບໍ່ມີຂໍ້ມູນໃຫ້ສະແດງ</p>
    </v-col>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useI18n } from "vue-i18n";

const {t} = useI18n();
const files = ref([]);
const user = ref([]);
const search = ref("");
const headers = computed(() =>[
  { title: "ຊື່ໄອດີ", value: "id" }, 
  { title: "ຊື່ໄຟລ໌", value: "filename" }, 
  { title: "ຮູບພາບ", value: "fullImagePath", sortable: false }, 
  { title: "ສະຖານະ", value: "status" }, 
  { title: "ຜູ້ໃຊ້", value: "user" }, 
  { title: "ການດຳເນີນການ", value: "actions", sortable: false }, 
]);

const fetchUser = async () => {
      try {
        const config = useRuntimeConfig();
        const response = await axios.get(
          `${config.public.strapi.url}api/filter_user/`
        );
        user.value = response.data.map((user) => ({
          ...user,
          title: `ຜູ້ໃຊ້:${user}`,
          id: user.ID,
        }));

        console.log(
          "Fetched user:",
          JSON.parse(JSON.stringify(user.value))
        );
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    onMounted(fetchUser);

const UserSelect = (value: number) => {
  const selected = user.value.find((user) => user.id === value);
  if (selected) {
    selectedUser.value = selected.User;
    enLocation.value = selected.User;

    title.value = ` ${selected.User} `;
  }
  console.log("Selected user ID:", value);

};
const fetchFiles = async () => {
  try {
    const config = useRuntimeConfig();
    const baseURL = config.public.strapi.url;

    const response = await axios.get(`${baseURL}api/api/get_collaterals/`);

    files.value = response.data.map((item: any) => ({
      ...item,
      fullImagePath: `${baseURL}collaterals/${item.pathfile}`,
    }));

    console.log("Fetched data:", files.value);
  } catch (error) {
    console.error("Error fetching files:", error);
  }
};

const viewFile = (item: any) => {
  alert(`Viewing file: ${item.filename}`);
};

onMounted(() => {
  fetchFiles();

});

definePageMeta({
  layout: "backend",
});

useHead({
  title: "Collect Files",
  meta: [
    {
      name: "keywords",
      content: "Order, Nuxt 3, Backend",
    },
    {
      name: "description",
      content: "Order Nuxt 3, IT Genius Engineering",
    },
  ],
});
</script>

<style>
.table-image {
  width: 80px;
  height: auto;
  border-radius: 8px;
}
</style>
