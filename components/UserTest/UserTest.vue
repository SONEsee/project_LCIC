<script setup lang="ts">
import { useUserManageStore } from "~/stores/usermanage";
import { ref, computed } from "vue";

const useStore = useUserManageStore();
const searchQuery = ref("");
const isSearching = ref(false);

const originalData = computed(() => {
  return useStore.respons_user_data || [];
});

const filteredData = computed(() => {
  if (!isSearching.value) return originalData.value;

  return originalData.value.filter(
    (item) =>
      item.UID.toString().includes(searchQuery.value) ||
      item.nameL.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const res = computed(() => {
  return isSearching.value ? filteredData.value : originalData.value;
});
onMounted(() => {
  useStore.Getdata();
});

const performSearch = () => {
  isSearching.value = true;
};

const clearSearch = () => {
  searchQuery.value = "";
  isSearching.value = false;
};
const header = [
  {
    title: "ລະຫັດ",
    value: "UID",
  },
  {
    title: "ຊື່ຜູ້ໃຊ້ງານ",
    value: "username",
  },
  {
    title: "ຊື່ພາສາລາວ",
    value: "nameL",
  },
  {
    title: "ນາມສະກຸນພາສາລາວ",
    value: "surnameL",
  },
  {
    title: "ຊື່ພາສາອັງກິດ",
    value: "nameE",
  },
  {
    title: "ນາມສະກຸນພາສາອັງກິດ",
    value: "surnameE",
  },
  {
    title: "ຮູບໂປຟາຍ",
    value: "profile_image",
  },
  {
    title: "ຈັດການ",
    value: "actoin",
  },
];
onMounted(() => {
  useStore.Getdata();
});
const handleDelete = (id: number) => {
  useStore.deleteUser(id);
  useStore.Getdata();
};
</script>
<template>
  <v-container>
    <v-col cols="12">
      <v-row>
        <v-col cols="12" md="8">
          <v-row>
            <v-col cols="12" md="8"
              ><v-text-field
                v-model="searchQuery"
                label="ຄົ້ນຫາຈາກ ລະຫັດ ຫຼື ຊື່"
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                clearable
                density="compact"
                @keyup.enter="performSearch"
              ></v-text-field
            ></v-col>
            <v-col cols="12" md="2" class="d-flex justify-end">
              <v-btn color="primary" class="mr-2" @click="performSearch">
                ຄົ້ນຫາ </v-btn
              ><v-btn color="secondary" variant="outlined" @click="clearSearch">
                ລ້າງ
              </v-btn></v-col
            >
          </v-row> </v-col
        ><v-col cols="12" md="4">
          <div class="d-flex justify-end">
            <v-btn
              @click="$router.push('/backend/manageuser/create_user')"
              prepend-icon="mdi-plus"
              color="primary"
            >
              ເພີ່ມຂໍ້ມູນຜູ້ໃຊ້
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-col>

    <v-data-table :items="res || []" :headers="header" class="text-no-wrap">
      <template v-slot:item.actoin="{ item }">
        <v-span>
          <v-btn
            icon="mdi-eye"
            class="text-primary"
            flat
            small
            @click="$router.push(`/backend/user/detail?id=${item.UID}`)" />
          <v-btn
            icon="mdi-pen"
            class="text-info"
            flat
            small
            @click="$router.push(`/backend/user/edit?id=${item.UID}`)" />
          <v-btn
            icon="mdi-delete"
            class="text-error"
            flat
            small
            @click="handleDelete(item.UID)"
        /></v-span>
      </template>
      <template v-slot:item.profile_image="{ item }">
        <div v-if="item.profile_image">
          <v-avatar size="50">
            <v-img
              :src="`${$config.public.strapi.url}${item.profile_image}`"
              width="50"
              height="50"
              class="rounded-circle"
          /></v-avatar>
        </div>
        <div v-else>
          <v-icon size="50">mdi-account-circle-outline</v-icon>
        </div>
      </template>
    </v-data-table>
  </v-container>
</template>
