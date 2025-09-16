<script lang="ts" setup>
import axios from "axios";
import Swal from "sweetalert2";
import { ref, computed, onMounted } from "vue";
import { MemberStore } from "@/stores/memberinfo";
import { useBastFileStore } from "~/stores/batfile";
import { useMemberInfo } from "@/composables/memberInfo";

const batefileStore = useBastFileStore();

const batefileData = computed(() => {
  const data = batefileStore.respons_data_batefile;
  if (Array.isArray(data)) {
    return data;
  }
  if (data && typeof data === "object") {
    return [data];
  }
  return [];
});

const memberinfoStore = MemberStore();
// const dataMemberInfon = computed(() => {
//   const data = memberinfoStore.respons_data_query;
//   if (Array.isArray(data)) {
//     return data;
//   }
//   if (data && typeof data === "object") {
//     return [data];
//   }
//   return [];
// });
const dataMemberInfon = computed(() => {
  const data = memberinfoStore.respons_data_query;
  let result = [] as any[];

  if (Array.isArray(data)) {
    result = data;
  } else if (data && typeof data === "object") {
    result = [data];
  }
  return result.sort((a, b) => {
    if (a.bnk_code && b.bnk_code) {
      return parseInt(a.bnk_code) - parseInt(b.bnk_code);
    }
    return 0;
  });
});
const { mapMemberInfo, getMemberName, getMemberDetails } = useMemberInfo();

interface User {
  username: string;
  id: string;
  GID: { GID: number };
  MID: { MID: string; id: string };
  UID: string;
}

const user = ref<User | null>(null);
const dataget = ref<any[]>([]);
const isloading = ref<boolean>(false);
const error = ref<string | null>(null);
const searchQuery = ref<string>("");
const selectedUserId = ref<string | null>(null);
const userIds = ref<string[]>([]);

const initializeUser = () => {
  try {
    const userData = localStorage.getItem("user_data");
    console.log("data user ", userData);

    if (userData) {
      user.value = JSON.parse(userData);
      const user_id = user.value?.MID?.id;
      const user_mid = user.value?.UID;
      const user_gid = user.value?.GID?.GID;

      console.log("GID", user_gid);
      console.log("UID", user_mid);
      console.log("user_id", user_id);

      return user_id;
    }
  } catch (error) {
    console.error("Error parsing user data:", error);
  }
  return null;
};

const filteredData = computed(() => {
  if (user.value?.MID.id === "01" && selectedUserId.value) {
    return dataget.value.filter((item) =>
      item.user_id.includes(selectedUserId.value)
    );
  }
  return dataget.value;
});

const datafetch = async () => {
  isloading.value = true;
  error.value = null;
  try {
    const config = useRuntimeConfig();
    const userData = localStorage.getItem("user_data");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      const user_id = String(parsedUser?.MID?.id);

      let url = `${config.public.strapi.url}api/api/search-files/`;

      if (user_id === "01") {
        if (selectedUserId.value) {
          url += `?user_id=01&filter_user_id=${selectedUserId.value}`;
        } else {
          url += `?user_id=01`;
        }
      } else {
        url += `?user_id=${user_id}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      dataget.value = await response.json();
      userIds.value = [...new Set(dataget.value.map((item) => item.user_id))];
      console.log(dataget.value);
    } else {
      throw new Error("User data not found in localStorage");
    }
  } catch (err: unknown) {
    error.value =
      err instanceof Error ? err.message : "An unexpected error occurred";
  } finally {
    isloading.value = false;
  }
};

onMounted(() => {
  const userId = initializeUser();

  if (userId) {
    batefileStore.filter_data_userid.filter_user.user_id = String(userId);
  }
  datafetch();
  memberinfoStore.getMemberInfo();
  batefileStore.getData();
});

watch(selectedUserId, () => {
  if (user.value?.MID.id === "01") {
    datafetch();
  }
});

const file = ref<File | null>(null);
const results = ref<any[]>([]);
const header = ref([
  { title: "ລຳດັບ", value: "id" },
  { title: "ລະຫັດສະມາຊິກ", value: "user_id" },
  { title: "ຊື່ຟາຍ", value: "fileName" },
  { title: "ຈຳນວນຄົ້ນຫາທັງໝົດ", value: "total" },
  { title: "ຄົ້ນຫາພົບ", value: "searchtrue" },
  { title: "ຂໍ້ມູນສໍ້າກັນ", value: "count_duplicates" },
  { title: "ຄົ້ນຫາບໍ່ພົບ", value: "searchfals" },
  { title: "ມື້ສົ່ງ", value: "insertDate" },
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
  formData.append("UID", user.value.UID);

  try {
    const config = useRuntimeConfig();

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

    Swal.fire({
      icon: "success",
      title: "ອັບໂຫຼດສຳເລັດ!",
      confirmButtonText: "ຕົກລົງ",
      preConfirm: () => {
        return new Promise((resolve) => {
          resolve(true);
        });
      },
    }).then((result) => {
      if (result.isConfirmed) {
        results.value.forEach((item) => {
          if (item.status === "Found") {
            insertSearchLog(item);
          }
        });

        datafetch();
      }
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

const insertSearchLog = async (item: any) => {
  try {
    const token = localStorage.getItem("access_token");
    const config = useRuntimeConfig();
    const response = await fetch(
      `${config.public.strapi.url}api/insert_searchlog/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          EnterpriseID: item.com_enterprise_code,
          LCIC_code: item.LCIC_code,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to insert search log");
    }

    const data = await response.json();
    console.log("Search log inserted:", data);
  } catch (error) {
    console.error("Error inserting search log:", error);
  }
};
const getDisplayText = (item: any) => {
  return `${item.bnk_code}-${item.code}-${item.nameL}`;
};
</script>
<template>
  <div>
    <!-- <pre>{{ dataMemberInfon }}</pre> -->
    <v-col>
      <v-row>
        <v-col cols="12" md="5" v-if="user?.MID.id !== '01'">
          <v-file-input
            type="file"
            accept=".json"
            @change="handleFileUpload"
            variant="outlined"
            density="compact"
            width="100%"
          />
        </v-col>
        <v-col cols="12" md="1" v-if="user?.MID.id !== '01'">
          <v-btn @click="uploadFile" class="bg-primary">ອັບໂຫຼດ</v-btn>
        </v-col>
        <v-col cols="12" md="2" v-if="user?.MID.id !== '01'"> </v-col>
        <v-col cols="12" md="4">
          <div v-if="user?.MID.id === '01'" class="mb-4">
            <v-autocomplete
              v-model="selectedUserId"
              :items="dataMemberInfon"
              label="ຄົ້ນຫາຕາມສະມາຊິກດວ້ຍລະຫັດ"
              variant="outlined"
              density="compact"
              width="100%"
              :item-title="getDisplayText"
              item-value="bnk_code"
              clearable
            >
              <template v-slot:item="{ props, item }">
                <v-list-item
                  v-bind="props"
                  :title="`${item.raw.bnk_code}-${item.raw.code}-${item.raw.nameL}`"
                ></v-list-item>
              </template>
            </v-autocomplete>
          </div>
        </v-col>
      </v-row>
    </v-col>
    <div v-if="isloading" class="d-flex justify-center align-center">
      <p>ກຳລັງໂຫຼດ....</p>
    </div>
    <div v-if="error">ເກິດຂໍ້ຜິດພາດບໍ່ສາມາດດຶງຂໍ້ມູນໄດ້</div>
    <div v-else>
      <v-data-table
        :items="filteredData"
        item-key="name"
        items-per-page="10"
        :headers="header"
      >
        <!-- const header = ref([
  { title: "ລຳດັບ", value: "id" },
  { title: "ລະຫັດສະມາຊິກ", value: "user_id" },
  { title: "ຊື່ຟາຍ", value: "fileName" },
  { title: "ຈຳນວນຄົ້ນຫາທັງໝົດ", value: "total" },
  { title: "ຄົ້ນຫາພົບ", value: "searchtrue" },
  { title: "ຂໍ້ມູນສໍ້າກັນ", value: "count_duplicates" },
  { title: "ຄົ້ນຫາບໍ່ພົບ", value: "searchfals" },
  { title: "ມື້ສົ່ງ", value: "insertDate" },
]); -->
        <template v-slot:header.id="{ column }">
          <b style="color: blue">{{ column.title }}</b>
        </template>
        <template v-slot:header.user_id="{ column }">
          <b style="color: blue">{{ column.title }}</b>
        </template>
        <template v-slot:header.fileName="{ column }">
          <b style="color: blue">{{ column.title }}</b>
        </template>
        <template v-slot:header.total="{ column }">
          <b style="color: blue">{{ column.title }}</b>
        </template>
        <template v-slot:header.searchtrue="{ column }">
          <b style="color: green">{{ column.title }}</b>
        </template>
        <template v-slot:header.searchfals="{ column }">
          <b style="color: red">{{ column.title }}</b>
        </template>
        <template v-slot:header.count_duplicates="{ column }">
          <b style="color: orange">{{ column.title }}</b>
        </template>
        <template v-slot:header.insertDate="{ column }">
          <b style="color: blue">{{ column.title }}</b>
        </template>
        <template v-slot:item.user_id="{ item }">
          {{ mapMemberInfo(item.user_id) }}
        </template>
        <template v-slot:item.total="{ item }">
          <v-chip color="primary" text-color="white">{{
            Number(item.searchtrue) +
            Number(item.searchfals) +
            Number(item.count_duplicates)
          }}</v-chip>
        </template>
        <template v-slot:item.count_duplicates="{ item }">
          <v-tooltip text="ຄລິກເພື່ອເບິ່ງລາຍການຄົ້ນຫາທີ່ຂໍ້ມູນສໍ້າກັນ"
            ><template v-slot:activator="{ props }">
              <a :href="`../duplicates_batefile/?id=${item.id}`">
                <v-chip color="warning" text-color="white" v-bind="props">
                  {{ item.count_duplicates }}
                </v-chip></a
              ></template
            ></v-tooltip
          >
        </template>
        <template v-slot:item.insertDate="{ item }">
          {{ new Date(item.insertDate).toLocaleDateString() }}
        </template>
        <!-- <template v-slot:item.user_id="{ item }">
          <p v-if="user?.MID.id === '01'">{{ item.user_id }}</p>
        </template> -->
        <template v-slot:item.index="{ index, item }">
          <p>{{ item.index }}</p>
        </template>
        <template v-slot:item.searchtrue="{ item }">
          <v-tooltip text="ຄລິກເພື່ອເບິ່ງລາຍການທີ່ຄົ້ນຫາພົບ">
            <template v-slot:activator="{ props }">
              <a :href="`../saerchtrue?id=${item.id}`">
                <v-chip color="success" text-color="white" v-bind="props">{{
                  item.searchtrue
                }}</v-chip></a
              ></template
            ></v-tooltip
          >
        </template>
        <template v-slot:item.searchfals="{ item }">
          <v-tooltip text="ຄລິກເພື່ອເບິ່ງລາຍການທີ່ຄົ້ນບໍ່ພົບ ">
            <template v-slot:activator="{ props }">
              <a :href="`../fals?id=${item.id}`">
                <v-chip color="error" text-color="white" v-bind="props">{{
                  item.searchfals
                }}</v-chip>
              </a>
            </template>
          </v-tooltip>
        </template>
        <!-- <template v-slot:header.user_id style="color: green">
          <p v-if="user?.MID.id === '01'">ລະຫັດສະມາຊິກ</p>
        </template> -->
      </v-data-table>
    </div>
  </div>
</template>
