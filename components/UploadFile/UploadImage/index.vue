<template>
  <v-container>
    <div>
      <h2>{{ $t("Uploadtheenterpriseregistrationform") }}</h2>
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
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field 
              density="compact"
              label="ປອ້ນລະຫັດວິສາຫະກິດ"
              v-model="enterpriseCode"
            ></v-text-field>
          </v-col>
          <v-col md="2" cols="12">
            <div class="d-flex">
              <v-btn color="primary" @click="handleUpload" :loading="isLoading">
                {{ $t("uploads") }}
              </v-btn>
            </div>
          </v-col>
          <v-col cols="12" md="4">
            <v-autocomplete
              variant="outlined"
              v-if="user && user.MID.id === '01'"
              density="compact"
              v-model="search"
              label="ໃສ່ລະຫັດທະນາຄານເພື່ຶອຄົ້ນຫາ"
              :items="uniqueUserIds.map((user) => ({ title: user, value: user }))"
              item-text="title"
              item-value="value"
            />
          </v-col>
        </v-row>
      </v-col>
    </div>
    
    <v-data-table :items="filteredItems">
      <template v-slot:top></template>
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
            >{{ $t("viewimage") }}</v-btn>
          </td>
        </tr>
      </tbody>
    </v-data-table>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";
import axios from "axios";
import Swal from "sweetalert2";

export default defineComponent({
  setup() {
    const files = ref<File[]>([]);
    const enterpriseCode = ref("");
    const collaterals = ref([]);
    const user = ref<User | null>(null);
    const search = ref("");
    const isLoading = ref(false);

    const checkEnterpriseCode = async () => {
  try {
    const config = useRuntimeConfig();
    isLoading.value = true;
    const response = await axios.post(
      `${config.public.strapi.url}api/search/${encodeURIComponent(enterpriseCode.value)}/`
    );

    if (response.status === 200) {
      await Swal.fire({
        title: "ແຈ້ງເຕືອນ!",
        text: "ມີຂໍ້ມູນຢູ່ໃນຖານຂໍ້ມູນແລ້ວ",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return true;
    }
    return false;
  } catch (error) {
    if (error.response?.status === 404) {
      return false;
    }
    console.error("Error checking enterprise code:", error);
    await Swal.fire({
      title: "ຜິດພາດ!",
      text: "ເກີດຂໍ້ຜິດພາດໃນການກວດສອບລະຫັດວິສາຫະກິດ",
      icon: "error",
      confirmButtonText: "OK",
    });
    return true;
  } finally {
    isLoading.value = false;
  }
};




    
    const handleUpload = async () => {
      if (!enterpriseCode.value) {
        await Swal.fire({
          title: "ແຈ້ງເຕືອນ!",
          text: "ກະລຸນາປ້ອນລະຫັດວິສາຫະກິດ",
          icon: "warning",
          confirmButtonText: "OK",
        });
        return;
      }

      if (!files.value || files.value.length === 0) {
        await Swal.fire({
          title: "ແຈ້ງເຕືອນ!",
          text: "ກະລຸນາເລືອກຮູບພາບ",
          icon: "warning",
          confirmButtonText: "OK",
        });
        return;
      }

      const exists = await checkEnterpriseCode();
      if (exists) {
        return;
      }

      await uploadFiles();
    };

    const uploadFiles = async () => {
      try {
        isLoading.value = true;
        const formData = new FormData();

        files.value.forEach((file) => {
          formData.append("image", file);
        });

        if (user.value && user.value.MID) {
          formData.append("user_mid_id", user.value.MID.id);
        }
        
        formData.append("enterprise_code", enterpriseCode.value);

        const config = useRuntimeConfig();
        const response = await axios.post(
          `${config.public.strapi.url}api/api/upload_image/`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        
        await Swal.fire({
          title: "ສຳເລັດ!",
          text: "ອັບໂຫຼດຮູບພາບສຳເລັດແລ້ວ!",
          icon: "success",
          confirmButtonText: "OK",
        });
        
        await fetchCollaterals();
        files.value = [];
        enterpriseCode.value = "";
      } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        await Swal.fire({
          title: "ຜິດພາດ!",
          text: error.response ? error.response.data : error.message,
          icon: "error",
          confirmButtonText: "OK",
        });
      } finally {
        isLoading.value = false;
      }
    };

    const viewImage = (imagePath: string) => {
      const config = useRuntimeConfig();
      const fullPath = `${config.public.strapi.url}media/${imagePath}`;
      window.open(fullPath, "_blank");
    };

    const fetchCollaterals = async () => {
      try {
        const config = useRuntimeConfig();
        const response = await axios.get(
          `${config.public.strapi.url}api/api/get_collaterals/`
        );
        
        const userID = user.value?.MID?.id;
        collaterals.value = userID === "01" 
          ? response.data 
          : response.data.filter((item: any) => item.user === userID);
      } catch (error) {
        console.error("Error fetching collaterals:", error);
      }
    };

    onMounted(() => {
      const userData = localStorage.getItem("user_data");
      if (userData) {
        user.value = JSON.parse(userData);
      }
      
      if (user.value?.MID?.id) {
        fetchCollaterals();
      }
    });

    const filteredItems = computed(() =>
      collaterals.value.filter((item: any) =>
        item.user?.toLowerCase().includes(search.value.toLowerCase())
      )
    );

    const uniqueUserIds = computed(() => 
      [...new Set(filteredItems.value.map((item) => item.user))]
    );

    return {
      files,
      enterpriseCode,
      collaterals,
      user,
      search,
      isLoading,
      handleUpload,
      viewImage,
      filteredItems,
      uniqueUserIds,
    };
  },
});
</script>