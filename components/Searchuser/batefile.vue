<template>
  <div>
    <v-col>
      <v-row>
        <v-col cols="12" md="5">
          <v-file-input
            type="file"
            accept=".json"
            @change="handleFileUpload"
            variant="outlined"
            density="compact"
            width="100%"
        />
      </v-col>
        <v-col cols="12" md="1"
          ><v-btn @click="uploadFile" class="bg-primary">ອັບໂຫຼດ</v-btn></v-col
        >
      </v-row>
    </v-col>
    <div v-if="isloading" class="d-flex justify-center align-center">
      <p>ກຳລັງໂຫຼດ....</p>
    </div>
    <div v-if="error">ເກິດຂໍ້ຜິດພາດບໍ່ສາມາດດຶງຂໍ້ມູນໄດ້</div>
    <div v-else>
      <v-data-table
        :items="dataget"
        item-key="name"
        items-per-page="10"
        :headers="header"
      >
        <template v-slot:item.total="{ item }">
          <v-chip color="primary" text-color="white">{{
            Number(item.searchtrue) + Number(item.searchfals)
          }}</v-chip>
        </template>
        <template v-slot:item.index="{ index, item }">
          <p>{{ item.index }}</p>
        </template>
        <template v-slot:item.searchtrue="{ item }">
          <a :href="`../saerchtrue?id=${item.id}`">
            <v-chip color="success" text-color="white">{{
              item.searchtrue
            }}</v-chip></a
          >
        </template>
        <template v-slot:item.searchfals="{ item }">
          <a :href="`../fals?id=${item.id}`">
            <v-chip color="error" text-color="white">{{
              item.searchfals
            }}</v-chip>
          </a>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface User {
  username: string;
  id: string;
  GID: { GID: number };
  MID: { MID: string; id: string };
  UID: string
}
import Swal from "sweetalert2";
import { ref, onMounted } from "vue";


    const user = ref<User | null>(null);
    const dataget = ref<any[]>([]);
    const isloading = ref<boolean>(false);
    const error = ref<string | null>(null);
    const datafetch = async () => {
      isloading.value = true;
      error.value = null;
      try {
        const config = useRuntimeConfig();
        const respons = await fetch(
          `${config.public.strapi.url}api/api/search-files/`
        );
        if (!respons.ok) {
          throw new Error(`Error:${respons.statusText}`);
        }
        dataget.value = await respons.json();
      } catch (err: unknown) {
        error.value =
          err instanceof Error ? err.message : "An unexpected error occurred";
      } finally {
        isloading.value = false;
      }
    };
    onMounted(datafetch);
    const userData = localStorage.getItem("user_data");
    console.log('data user ', userData);

    if (userData) {
      user.value = JSON.parse(userData);
      const user_id = user.value?.MID.id;
      const user_mid = user.value?.UID;
      const user_gid = user.value?.GID.GID;
      console.log('GID',user_gid)
      console.log('UID' , user_mid);
      console.log('user_id' , user_id);
    }

    const file = ref<File | null>(null);
    const results = ref<any[]>([]);
    const header = ref([
      { title: "ລຳດັບ", value: "id" },
      { title: "ມື້ສົ່ງ", value: "insertDate" },
      { title: "ຊື່ຟາຍ", value: "fileName" },
      { title: "ຈຳນວນຄົ້ນຫາທັງໝົດ", value: "total" },
      { title: "ຄົ້ນຫາພົບ", value: "searchtrue" },
      { title: "ຄົ້ນຫາບໍ່ພົບ", value: "searchfals" },
    ]);

    const handleFileUpload = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.files?.length) {
        file.value = target.files[0];
      }
    };
    const uploadFile = async () => {
  if (!file.value) {
    Swal.fire({
      icon: "warning",
      title: "ກະລຸນາເລືອກໄຟລ໌ກ່ອນ",
    });
    return;
  }

  if (!user.value?.MID.id) {
    Swal.fire({
      icon: "error",
      title: "ບໍ່ພົບ User ID",
    });
    return;
  }

  const formData = new FormData();
  formData.append("file", file.value);
  formData.append("user_id", user.value.MID.id);
  formData.append("UID", user.value.UID)
  
 

  try {
    const config = useRuntimeConfig();
    
    
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${config.public.strapi.url}api/api/upload-json/`,
      {
        method: "POST",
        body: formData,
        
      }
    );
    if (!response.ok) {
      throw new Error("Upload failed.");
    }
    const data = await response.json();
    results.value = data.results || [];
    datafetch(); 

   
    Swal.fire({
      icon: "success",
      title: "ອັບໂຫຼດສຳເລັດ!",
      confirmButtonText: "ຕົກລົງ",
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    Swal.fire({
      icon: "error",
      title: "ມີຂໍ້ຜິດພາດ",
      text: "ກະລຸນາລອງໃໝ່.",
    });
  }
};
    
   
</script>
