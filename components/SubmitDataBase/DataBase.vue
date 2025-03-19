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
        <v-col cols="12" md="1">
          <v-btn @click="uploadFile" class="bg-primary">ອັບໂຫຼດ</v-btn>
        </v-col>
        <v-col cols="12" md="2"></v-col>
        <v-col cols="12" md="4">
          <div v-if="user?.MID.id === '01'" class="mb-4">
            <v-autocomplete
              v-model="selectedUserId"
              :items="userIds"
              label="ຄົ້ນຫາຕາມສະມາຊິກດວ້ຍລະຫັດ"
              variant="outlined"
              density="compact"
              width="100%"
            />
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
        :items="filedata"
        :headers="header"
        :items-per-page="itemsPerPage"
        :page="currentPage"
        :items-length="totalItems"
        :loading="isloading"
        @update:page="handlePageChange"
      >
        <!-- <template v-slot:bottom>
            <div class="d-flex align-center justify-end pt-6">
              <span class="mr-4 text-caption">
                ຫນ້າ {{ currentPage }} ຈາກ {{ Math.ceil(totalItems/itemsPerPage) }}
              </span>
              <v-pagination
                v-model="currentPage"
                :length="Math.ceil(totalItems/itemsPerPage)"
                :total-visible="5"
                @update:model-value="handlePageChange"
                :show-first-last="true"
              ></v-pagination>
            </div>
          </template> -->
        <template v-slot:item.id="{ item, index }">
          {{ index + 1 }}
          <!-- <p>{{ (currentPage - 1) * itemsPerPage + index + 3 }}</p> -->
        </template>
        <template v-slot:item.updatedate="{ item }">
          <div v-if="item.updatedate">
            <v-chip v-if="item.updatedate" color="warning" text-color="white">
              {{ item.updatedate }}
            </v-chip>
          </div>
          <div v-else>
            <v-chip text-color="white">
              <p>ກຳລັງດາວໂຫຼດຂໍ້ມູນ....</p>
            </v-chip>
          </div>
        </template>
        <template v-slot:item.insertdate="{ item }">
          {{ new Date(item.insertdate).toLocaleString() }}
        </template>
        <template v-slot:item.crete="{ item }">
          <div v-if="item.crete">
            <v-chip v-if="item.crete" color="success" text-color="white">
              {{ item.crete }}
            </v-chip>
          </div>
          <div v-else>
            <v-chip text-color="white">
              <p>ກຳລັງດາວໂຫຼດຂໍ້ມູນ....</p>
            </v-chip>
          </div>
        </template>
        <template v-slot:item.total="{ item }">
          <div v-if="item.crete">
            <a :href="`../data/total/?id=${ item.id }`">
              
              <v-chip v-if="item.crete" color="info" text-color="white">
                {{ Number(item.crete) + Number(item.updatedate) }}
              </v-chip></a>
          </div>
          <div v-else>
            <v-chip text-color="white">
              <p>ກຳລັງດາວໂຫຼດຂໍ້ມູນ....</p>
            </v-chip>
          </div>
        </template>
        <template v-slot:item.status="{ item }">
          <div v-if="item.status">
            <v-chip
              v-if="item.status == 'Processing'"
              color="warning"
              text-color="white"
            >
              <p>ກຳລັງດຳເນີນການອັບໂຫຼດ</p>
            </v-chip>
            <v-chip
              v-if="item.status == 'Completed'"
              color="success"
              text-color="white"
            >
              <p>ອັບໂຫຼດສຳເລັດ</p>
            </v-chip>
          </div>
        </template>
        <template v-slot:header.user_id style="color: green">
          <p v-if="user?.MID.id === '01'">ລະຫັດສະມາຊິກ</p>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import axios from "axios";
import Swal from "sweetalert2";
import { ref, onMounted, watch, computed } from "vue";
import { DataModel, FileDataModel } from "@/types";

const userID = localStorage.getItem("user_data");
console.log("user", userID);

interface User {
  username: string;
  id: string;
  GID: { GID: number };
  MID: { MID: string; id: string };
  UID: string;
}

const user = ref<User | null>(null);

const selectedUserId = ref<string | null>(null);
const userIds = ref<string[]>([]);
const getdata = ref<DataModel.DataModel[]>([]);
const isloading = ref<boolean>(false);
const error = ref<string | null>(null);
const itemsPerPage = ref<number>(10);
const totalItems = ref<number>(0);
const currentPage = ref<number>(1);
const filedata = ref<FileDataModel.DataRespons[]>([]);
const File = async () => {
  isloading.value = true;
  error.value = null;
  try {
    const config = useRuntimeConfig();
    const res = await axios.get<FileDataModel.DataRespons[]>(
      `${config.public.strapi.url}/api/api/get-all-upload-files/`
    );
    if (res.status === 200) {
      filedata.value = res.data;
      console.log("filedata", filedata.value);
    }
  } catch (error) {}
};
onMounted(async () => {
  await File();
});
const Getdata = async (page = 4) => {
  isloading.value = true;
  error.value = null;
  try {
    const config = useRuntimeConfig();
    const limit = itemsPerPage.value;

    const res = await axios.get(
      `${config.public.strapi.url}api/api/get-enterprise-info/`,
      {
        params: {
          limit,
          page,
        },
      }
    );

    if (res.status === 200 && res.data && Array.isArray(res.data.data)) {
      getdata.value = res.data.data;
      totalItems.value = res.data.total_count || 1;
      console.log("data", getdata.value);
      console.log("total", totalItems.value);
    } else {
      throw new Error("Unexpected response format");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    isloading.value = false;
  }
};

const handlePageChange = async (page: number) => {
  if (page !== currentPage.value && page === 2) {
    currentPage.value = page;

    await Getdata(page);
  }
};

watch(currentPage, (newPage) => {
  if (newPage > 1) {
    Getdata(newPage);
  }
});

onMounted(async () => {
  await Getdata();
});

const userData = localStorage.getItem("user_data");
console.log("data user ", userData);

if (userData) {
  user.value = JSON.parse(userData);
  const user_id = user.value?.MID.id;
  const user_mid = user.value?.UID;
  const user_gid = user.value?.GID.GID;
  console.log("GID", user_gid);
  console.log("UID", user_mid);
  console.log("user_id", user_id);
}

const file = ref<File | null>(null);
const results = ref<any[]>([]);
const header = ref([
  { title: "ລຳດັບ", value: "id" },
  { title: "ຊື່ຟາຍ", value: "file_name" },
  { title: "ມື້ອັບໂຫຼດ", value: "insertdate" },
  { title: "ຂໍ້ມູນອັບໂຫຼດທັງໝົດ", value: "total" },
  { title: "ຈຳນວນຂໍ້ມູນຖືກອັບເດດ", value: "updatedate" },
  { title: "ຈຳນວນຂໍ້ມູນຖືກສັ້າງ", value: "crete" },
  { title: "ສະຖານະ", value: "status" },
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
      `${config.public.strapi.url}api/upload-enterprise-info/`,
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
