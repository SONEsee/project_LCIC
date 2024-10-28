<template>
  <v-container>
    <div>
      <h1>ການອັບໂຫຼດຮູບພາບ</h1>
      <div v-if="user">
        {{ user.MID.id }}
      </div>
      <v-col cols="12">
        <v-file-input
          v-model="files"
          :show-size="1000"
          color="deep-purple-accent-4"
          label="ອັບໂຫຼດຮູບພາບ"
          placeholder="Select your files"
          prepend-icon="mdi-camera"
          variant="outlined"
          counter
          multiple
        >
          <template v-slot:selection="{ fileNames }">
            <template v-for="(fileName, index) in fileNames" :key="fileName">
              <v-chip
                v-if="index < 2"
                class="me-2"
                color="deep-purple-accent-4"
                size="small"
                label
              >
                {{ fileName }}
              </v-chip>

              <span
                v-else-if="index === 2"
                class="text-overline text-grey-darken-3 mx-2"
              >
                +{{ files.length - 2 }} ຮູບ(s)
              </span>
            </template>
          </template>
        </v-file-input>
        <v-btn color="primary" @click="uploadFiles" class="ml-9">ອັບໂຫຼດ</v-btn>
      </v-col>
    </div>

    <v-table class="mt-5">
      <thead>
        <tr class="bg-indigo-lighten-1">
          <th>ລຳດັບ</th>
          <th>ຊື່ຮູບພາບ</th>
          <th>ທີ່ຢູ່ຮູບພາບ</th>
          <th>ສະຖານະ</th>
          
          <th>ລາຍລະອຽດ</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="collateral in collaterals" :key="collateral.id">
          <td>{{ collateral.id }}</td>
          <td>{{ collateral.filename }}</td>
          <td>{{ collateral.pathfile }}</td>
          <!-- <td>{{ collateral.status }}</td> -->
        
          <td>
            <div v-if="collateral.status === '1'">
             <p class="text-warning">ອັບໂຫຼດສຳເລັດ</p>
            </div>

            <div v-else>
              <span class="text-success">ຖືກກວດສອບແລ້ວ</span>
            </div>
          </td>
          <td>
            <v-btn
              small
              @click="viewImage(collateral.pathfile)"
              class="bg-indigo-darken-4"
              >ເບິ່ງຮູບພາບອັບໂຫຼດ</v-btn
            >
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import axios from "axios";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";

export default defineComponent({
  setup() {
    definePageMeta({
      layout: "backend",
    });

    useHead({
      title: "Upload Image",
      meta: [
        {
          name: "keywords",
          content: "Report, Nuxt 3, Backend",
        },
        {
          name: "Description",
          content: "Report Nuxt 3, IT Genius Engineering",
        },
      ],
    });

    const files = ref<File[]>([]);
    const collaterals = ref([]);
    const user = ref<User | null>(null);
    const uploadFiles = async () => {
      const formData = new FormData();

      files.value.forEach((file) => {
        formData.append("image", file);
      });

      if (user.value && user.value.MID) {
        
        formData.append("user_mid_id", user.value.MID.id);
      }

      try {
        const config = useRuntimeConfig();
        const response = await axios.post(
          `${config.public.strapi.url}api/api/upload_image/`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        console.log(response.data);
        await Swal.fire({
          title: "ສຳເລັດ!",
          text: "ອັບໂຫຼດຮູບພາບສຳເລັດແລ້ວ!",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          location.reload();
        });
        fetchCollaterals();
      } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        Swal.fire({
          title: "ຜິດພາດ!",
          text: error.response ? error.response.data : error.message,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    };

    const userID1 = user.value?.MID.id;



    const viewImage = (imagePath: string, id: string) => {
      const config = useRuntimeConfig();
      const fullPath = `${config.public.strapi.url}collaterals/${imagePath}?id=${id}`;
      window.open(fullPath, "_blank");
      console.log("id image", id);
    };

    const confirmImage = async (id: number) => {
      try {
        const config = useRuntimeConfig();
        const response = await axios.post(
          `${config.public.strapi.url}api/api/confirm_image/${id}/`
        );
        console.log(response.data);
        await Swal.fire({
          title: "ສຳເລັດ!",
          text: "ຢືນຢັນຮູບພາບສຳເລັດແລ້ວ!",
          icon: "success",
          confirmButtonText: "OK",
        });
        fetchCollaterals();
      } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        Swal.fire({
          title: "ຜິດພາດ!",
          text: error.response ? error.response.data : error.message,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    };

    onMounted(() => {
  const userData = localStorage.getItem("user_data");
  if (userData) {
    user.value = JSON.parse(userData);
    console.log("User data:", user.value);
  }
  
  const userID = user.value?.MID?.id;
  console.log("User ID:", userID);

  // ກວດສອບວ່າ userID ໄດ້ສົ່ງໄປຫາ fetchCollaterals ຢ່າງຖືກຕ້ອງ
  if (userID) {
    fetchCollaterals(userID);
  } else {
    console.error("User ID is undefined");
  }
});

const fetchCollaterals = async (userID: string) => {
  try {
    const config = useRuntimeConfig();
    const response = await axios.get(
      `${config.public.strapi.url}api/api/get_collaterals/`
    );

    // ຟິວເອົາຂໍ້ມູນຕາມ userID
    collaterals.value = response.data.filter((item: any) => item.user === userID);
    console.log("Filtered Collaterals:", collaterals.value);
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
  }
};



    return {
      files,
      uploadFiles,
      collaterals,
      viewImage,
      confirmImage,
      user,
    };
  },
});
</script>
