<template>
  <v-container>
    <div>
      <h2>{{ $t("Uploadtheenterpriseregistrationform") }}</h2>
      <!-- <div v-if="user">
          {{ user.MID.id }}
        </div> -->
      <v-col cols="12">
        <v-row>
          <v-col cols="12" md="5">
            <v-file-input
            density="compact"
              v-model="files"
              :show-size="1000"
              color="deep-purple-accent-4"
              :label="$t('imageupload')"
              placeholder="Select your files"
              prepend-icon="mdi-camera"
              variant="outlined"
              counter
              multiple
            >
              <template v-slot:selection="{ fileNames }">
                <template
                  v-for="(fileName, index) in fileNames"
                  :key="fileName"
                >
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
          </v-col>
          <v-col md="2" cols="12">
            <div class=" d-flex ">
               <v-btn color="primary" @click="uploadFiles" class="">{{
              $t("uploads")
            }}</v-btn>
            </div>
           </v-col
          >
          <v-col cols="12" md="4">
            <v-autocomplete
          variant="outlined"
          v-if="user && user.MID.id === '01'"
          density="compact"
          width=""
          v-model="search"
          class=""
          label="ໃສ່ລະຫັດທະນາຄານເພື່ຶອຄົ້ນຫາ"
          :items="uniqueUserIds.map((user) => ({ title: user, value: user }))"
          item-text="title"
          item-value="value"
        />
          </v-col>
        </v-row>
      </v-col>
    </div>
    
    <v-data-table >
      <template v-slot:top>
        <!-- <v-text-field
          v-if="user && user.MID.id === '01'"
          density="compact"
          width="50%"
          v-model="search"
          class="pa-2"
          label="ໃສ່ລະຫັດທະນາຄານ"
        ></v-text-field> -->
    
      </template>
      <thead>
        <tr class="bg-indigo-lighten-1">
          <th>{{ $t("no:") }}</th>
          <th>{{ $t("imagename") }}</th>
          <th v-if="user && user.MID.id === '01'">ລະຫັດທະນາຄານ</th>
          <th>{{ $t("imageaddress") }}</th>
          <th>{{ $t("status") }}</th>

          <th>{{ $t("detail") }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="collateral in filteredItems" :key="collateral.id">
          <td>{{ collateral.id }}</td>
          <td>{{ collateral.filename }}</td>
          <td v-if="user && user.MID.id === '01'">{{ collateral.user }}</td>
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
              >{{ $t("viewimage") }}</v-btn
            >
          </td>
        </tr>
      </tbody>
    </v-data-table>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import axios from "axios";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";

export default defineComponent({
  user_id: "SingleColumnSearchTable",
  data() {
    return {
      search: "" as string,
    };
  },
  methods: {
    onSearch(): void {
      this.$emit("searchQuery", this.search);
    },
  },
  setup() {
    const search = ref("");
    definePageMeta({
      layout: "backend",
      middleware: ["auth"],
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

    // const fetchCollaterals = async (userID: string) => {
    //   try {
    //     const config = useRuntimeConfig();
    //     const response = await axios.get(
    //       `${config.public.strapi.url}api/api/get_collaterals/`
    //     );

    //     // ຟິວເອົາຂໍ້ມູນຕາມ userID
    //     collaterals.value = response.data.filter((item: any) => item.user === userID);
    //     console.log("Filtered Collaterals:", collaterals.value);
    //   } catch (error) {
    //     console.error(error.response ? error.response.data : error.message);
    //   }
    // };

    const fetchCollaterals = async (userID: string) => {
      try {
        const config = useRuntimeConfig();
        const response = await axios.get(
          `${config.public.strapi.url}api/api/get_collaterals/`
        );

        // ກວດສອບ userID ເພື່ອຈັດການຂໍ້ມູນ
        collaterals.value =
          userID === "01"
            ? response.data // ຖ້າ userID === "01", ສະແດງຂໍ້ມູນທັງໝົດ
            : response.data.filter((item: any) => item.user === userID); // ຖ້າບໍ່ແມ່ນ "01", ຟິວເອົາຂໍ້ມູນທີ່ກໍານົດ

        console.log("Collaterals:", collaterals.value);
      } catch (error) {
        console.error(
          "Error fetching collaterals:",
          error.response?.data || error.message
        );
      }
    };

    const filteredItems = computed(() =>
      collaterals.value.filter((item: any) =>
        item.user?.toLowerCase().includes(search.value.toLowerCase())
      )
    );
    console.log("user", filteredItems);
    const uniqueUserIds = computed(() => {
      return [...new Set(filteredItems.value.map((item) => item.user))];
    });
    // const fetchCollaterals = async (userID: string) => {
    //   try {
    //     const config = useRuntimeConfig();
    //     const response = await axios.get(
    //       `${config.public.strapi.url}api/api/get_collaterals/`
    //     );
    //     if (userID === "01") {
    //       collaterals.value = response.data;
    //     } else {
    //       collaterals.value = response.data.filter(
    //         (item: any) => item.user === userID
    //       );
    //     }
    //     console.log("Collaterals:", collaterals.value);
    //   } catch (error) {
    //     console.error(error.response ? error.response.data : error.message);
    //   }
    // };
    // const filteredItems = computed(() =>
    //   items.value.filter((item) =>
    //     item.user.toLowerCase().includes(search.value.toLowerCase())
    //   )
    // );

    return {
      files,
      uploadFiles,
      collaterals,
      viewImage,
      confirmImage,
      user,
      search,
      filteredItems,
      uniqueUserIds,
    };
  },
});
</script>
