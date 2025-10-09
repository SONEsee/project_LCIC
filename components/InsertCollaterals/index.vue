<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import axios from "@/helpers/axios";
import Swal from "sweetalert2";
import { CollateralStore } from "@/stores/collaterals";
import { MemberStore } from "@/stores/memberinfo";
import { useMemberInfo } from "@/composables/memberInfo";
import dayjs from "dayjs";
const { mapMemberInfo, getMemberName, getMemberDetails } = useMemberInfo();
const files = ref<File[]>([]);
const enterpriseCode = ref("");
const collaterals = ref([]);
const user = ref<any | null>(null);
const search = ref("");
const isLoading = ref(false);
const collateral = CollateralStore();
const imagepath = ref("");
const userIDfileter = ref("");
const selecTypeFileter = ref("datetime");
const selectUser = ref("");
const selecYears = ref("");
const selecMonth = ref("");
const selectDay = ref("");
const selectStartDate = ref("");
const selectEndDate = ref("");
const memberStore = MemberStore();

const memberData = computed(() => {
  const data = memberStore.respons_data_query;
  if (Array.isArray(data)) {
    return data;
  }
  if (data && typeof data === "object") {
    return [data];
  }
  return [];
});

const DataYears = computed(() => {
  const data = collateral.response_data_collateral_list_all;
  let MapData = [];
  if (Array.isArray(data)) {
    MapData = data;
  } else if (data && typeof data === "object") {
    MapData = [data];
  } else {
    return [];
  }
  const YearUnicque = new Set();
  MapData.forEach((item) => {
    if (item.insertdate) {
      YearUnicque.add(dayjs(item.insertdate).format("YYYY"));
    }
  });
  return Array.from(YearUnicque.values());
});
const MonthDate = computed(() => {
  const data = collateral.response_data_collateral_list_all;
  let DataMap = [];
  if (Array.isArray(data)) {
    DataMap = data;
  } else if (data && typeof data === "object") {
    DataMap = [data];
  } else {
    return [];
  }
  const uniqueMonth = new Set();
  DataMap.forEach((item) => {
    if (item.insertdate) {
      uniqueMonth.add(dayjs(item.insertdate).format("MM"));
    }
  });
  return Array.from(uniqueMonth.values());
});
const DayData = computed(() => {
  const data = collateral.response_data_collateral_list_all;
  let MapData = [];
  if (Array.isArray(data)) {
    MapData = data;
  } else if (data && typeof data === "object") {
    MapData = [data];
  } else {
    return [];
  }
  const uniqueDay = new Set();
  MapData.forEach((item) => {
    if (item.insertdate) {
      uniqueDay.add(dayjs(item.insertdate).format("DD"));
    }
  });
  return Array.from(uniqueDay.values());
});
const userString = localStorage.getItem("user_data");
user.value = userString ? JSON.parse(userString) : null;

const user_ID = computed(() => user.value?.MID?.id);

watch(
  user_ID,
  async (newValue) => {
    if (!newValue) return;

    collateral.isLoading = true;
    try {
      collateral.filter_data.query.current_user_id = newValue;
      await collateral.GetdsatCollateral();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "ຜິດພາດ",
        text: `ບໍ່ສາມາດໃຊ້ filter ຕາມ user_id ເນື່ອງຈາກ ${error}`,
      });
    } finally {
      collateral.isLoading = false;
    }
  },
  { immediate: true }
);
watch(selecYears, async (newValue) => {
  collateral.isLoading = true;
  try {
    collateral.filter_data.query.year = newValue;
    collateral.GetdsatCollateral();
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "ຜິດພາດ",
      text: `ບໍ່ສາມາດໃຊ້ filter ຕາມ year ເນື່ອງຈາກ ${error}`,
    });
  }
});
watch(selecMonth, async (newValue) => {
  collateral.isLoading = true;
  try {
    collateral.filter_data.query.month = newValue;
    collateral.GetdsatCollateral();
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "ຜິດພາດ",
      text: `ບໍ່ສາມາດໃຊ້ filter ຕາມ year ເນື່ອງຈາກ ${error}`,
    });
  }
});
watch(selectDay, async (newValue) => {
  collateral.isLoading = true;
  try {
    collateral.filter_data.query.day = newValue;
    collateral.GetdsatCollateral();
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "ຜິດພາດ",
      text: `ບໍ່ສາມາດໃຊ້ filter ຕາມ year ເນື່ອງຈາກ ${error}`,
    });
  }
});
watch(selectEndDate, async (newValue) => {
  collateral.isLoading = true;
  try {
    collateral.filter_data.query.end_date = newValue;
    collateral.GetdsatCollateral();
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "ຜິດພາດ",
      text: `ບໍ່ສາມາດໃຊ້ filter ຕາມ year ເນື່ອງຈາກ ${error}`,
    });
  }
});
watch(selectStartDate, async (newValue) => {
  collateral.isLoading = true;
  try {
    collateral.filter_data.query.start_date = newValue;
    collateral.GetdsatCollateral();
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "ຜິດພາດ",
      text: `ບໍ່ສາມາດໃຊ້ filter ຕາມ year ເນື່ອງຈາກ ${error}`,
    });
  }
});
watch(userIDfileter, async (newValue) => {
  collateral.isLoading = true;
  try {
    collateral.filter_data.query.user_id = newValue;
    await collateral.GetdsatCollateral();
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "ຜິດພາດ",
      text: `ບໍ່ສາມາດໃຊ້ fileter ຕາມ user_id ເນືອ້ງຈາກ ${error}`,
    });
  } finally {
    collateral.isLoading = false;
  }
});
const typeFilter = [
  { title: "ເລືອກຕາມ ປີ, ເດືອນ, ວັນ", value: "datetime" },
  { title: "ເລືອກຕາມຊວງເວລາ", value: "date" },
];
const header = [
  { title: "ລະຫັດ", value: "id" },
  { title: "ສະມາຊິກ", value: "user" },
  { title: "ຮູບ", value: "filename", align: "center" },
  { title: "ສະຖານະ", value: "status" },
  { title: "ວັນທີນຳສົ່ງ", value: "insertdate" },
  { title: "ລາຍລະອຽດ", value: "action" },
] as any;
const collateralData = computed(() => {
  const data = collateral.response_data_collateral_list;
  if (Array.isArray(data)) {
    return data;
  }
  if (data && typeof data === "object") {
    return [data];
  }
  return [];
});
const checkEnterpriseCode = async () => {
  try {
    const config = useRuntimeConfig();
    isLoading.value = true;
    const response = await axios.post(
      `${config.public.strapi.url}api/search/${encodeURIComponent(
        enterpriseCode.value
      )}/`
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
  } catch (error: any) {
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
  } catch (error: any) {
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
    collaterals.value =
      userID === "01"
        ? response.data
        : response.data.filter((item: any) => item.user === userID);
  } catch (error) {
    console.error("Error fetching collaterals:", error);
  }
};
const disPlay = (item: any) => {
  if (!item || !item.bnk_code || !item.code || !item.nameL) return "ທັງໝົດ";
  return `${item.bnk_code}-${item.code}-${item.nameL}`;
};
const router = useRouter();
const goToTest1 = (imagePath: string, id: number, status: number) => {
  router.push({
    name: "formcollaterals",
    query: { image: imagePath, id: id, status: status },
  });
};
onMounted(() => {
  collateral.GetdsatCollateralall();
  imagepath.value = axios.defaults.baseURL || "";
  console.log("Base URL:", imagepath.value);
  memberStore.getMemberInfo();
  collateral.GetdsatCollateral();
  const userData = localStorage.getItem("user_data");
  if (userData) {
    user.value = JSON.parse(userData);
  }

  if (user.value?.MID?.id) {
    fetchCollaterals();
  }
});
const user_id = computed(() => user.value?.MID?.id || "");
console.log("user_id", user_id);
const filteredItems = computed(() =>
  collaterals.value.filter((item: any) =>
    item.user?.toLowerCase().includes(search.value.toLowerCase())
  )
);

const uniqueUserIds = computed(() => [
  ...new Set(filteredItems.value.map((item: any) => item.user)),
]);
</script>
<template>
  <div class="pa-4">
    <!-- <pre>{{ DayData }}</pre> -->
    <h2>{{ $t("Uploadtheenterpriseregistrationform") }}</h2>
    <v-col cols="12">
      <v-row>
       
      
      
        <v-col cols="12" md="4" v-if="user && user.MID.id === '01'">
          <v-autocomplete
            prepend-inner-icon="mdi-bank-circle-outline"
            variant="outlined"
            
            density="compact"
            v-model="userIDfileter"
            label="ໃສ່ລະຫັດທະນາຄານເພື່ຶອຄົ້ນຫາ"
            :items="memberData"
            :item-title="disPlay"
            item-value="bnk_code"
            clearable
          >
            <template v-slot:item="{ item, props }">
              <v-list-item
                v-bind="props"
                :title="`${item.raw.bnk_code}-${item.raw.code}-${item.raw.nameL}`"
              >
                <template v-slot:prepend>
                  <v-avatar size="small" color="primary">
                    <v-icon>mdi-bank-circle-outline</v-icon>
                  </v-avatar>
                </template>
              </v-list-item>
            </template>
          </v-autocomplete>
        </v-col>
        <v-col cols="12" md="2">
          <v-autocomplete
            :items="typeFilter"
            v-model="selecTypeFileter"
            prepend-inner-icon="mdi-call-merge"
            label="ເລືອກປະເພດການຄົ້ນຫາ"
            density="compact"
            variant="outlined"
            item-title="title"
            item-value="value"
          >
            <template v-slot:item="{ item, props }">
              <v-list-item v-bind="props">
                <template v-slot:prepend>
                  <v-avatar size="small" color="primary">
                    <v-icon>mdi-call-merge</v-icon>
                  </v-avatar>
                </template>
              </v-list-item>
            </template>
          </v-autocomplete>
        </v-col>
        <v-col cols="12" md="6" v-if="selecTypeFileter === 'datetime'">
          <v-row>
            <v-col cols="12" md="4">
              <v-autocomplete
                v-model="selecYears"
                :items="DataYears"
                item-title="DataYears"
                item-value="DataYears"
                variant="outlined"
                density="compact"
                label="ເລືອກຕາມປີ"
                clearable
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" md="4">
              <v-autocomplete
              
                v-model="selecMonth"
                :items="MonthDate"
                item-title="MonthDate"
                item-value="MonthDate"
                variant="outlined"
                density="compact"
                label="ເລືອກຕາມເດືອນ"
                clearable
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" md="4">
              <v-autocomplete
              v-model="selectDay"
              :items="DayData"
              item-title="DayData"
              item-value="DayData"
                variant="outlined"
                density="compact"
                label="ເລືອກຕາມວັນ"
                clearable
              ></v-autocomplete>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" md="6" v-if="selecTypeFileter === 'date'">
          <v-row>
            <v-col cols="12" md="5">
              <v-text-field
               clearable
              v-model="selectStartDate"
              label="ມື້່ເລີ່ມ"
              type="date"
                variant="outlined"
                density="compact"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="2" class="d-flex justify-center">
              <span class="mt-2">ຫາ</span>
            </v-col>
            <v-col cols="12" md="5">
              <v-text-field
               clearable
              v-model="selectEndDate"
              label="ມື້່ສຶ້ນສຸດ"
              type="date"
                variant="outlined"
                density="compact"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-col>
  </div>
  <pre>{{ collateralData }}</pre>
  
  <v-data-table :items="collateralData" :headers="header">
    <template v-slot:item.user="{ item }">
      {{ mapMemberInfo(item.user) }}
    </template>
    <template v-slot:item.filename="{ item }" class="text-center">
      <div class="text-center">
        <div class="image-preview-container">
          <v-avatar>
            <img
              :src="`${imagepath}/media/${item.pathfile}`"
              alt=""
              width="40"
              class="thumbnail"
            />
          </v-avatar>

          <div class="image-popup">
            <img :src="`${imagepath}/media/${item.pathfile}`" alt="" />
          </div>
        </div>

        <p>
          <v-chip variant="flat" size="small" color="green-lighten-4">
            {{ item.filename.slice(0, 10)
            }}{{ item.filename.length > 10 ? "..." : "" }}
          </v-chip>
        </p>
      </div>
    </template>
    <template v-slot:item.insertdate="{ item }">
      {{ dayjs(item.insertdate).format("DD/MM/YYYY") }}
    </template>
    <template v-slot:item.action="{ item }">
          <div class="action-buttons">
            <v-btn 
              @click="goToTest1(item.pathfile, item.id, item.status)" 
              color="primary" 
              size="small" 
              prepend-icon="mdi-pencil"
              variant="elevated"
            >
              ບັນທຶກຂໍ້ມູນ
            </v-btn>
          </div>
        </template>
    <template v-slot:item.status="{ item }">
      <div v-if="item.status === '1'">
        <p class="text-warning">ຍັງບໍ່ທັນກວດສອບ</p>
      </div>
      <div v-else>
        <span class="text-success">ຖືກກວດສອບແລ້ວ</span>
      </div>
    </template>
  </v-data-table>
  <!-- <v-data-table :items="filteredItems">
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
              >{{ $t("viewimage") }}</v-btn
            >
          </td>
        </tr>
      </tbody>
    </v-data-table> -->
</template>
<style scoped>
.image-preview-container {
  position: relative;
  display: inline-block;
}

.thumbnail {
  cursor: pointer;
}

.image-popup {
  display: none;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  background: white;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.image-popup img {
  width: 300px;
  height: auto;
  border-radius: 4px;
}

.image-preview-container:hover .image-popup {
  display: block;
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}
</style>
