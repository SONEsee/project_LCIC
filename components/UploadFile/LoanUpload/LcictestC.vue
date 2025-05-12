<template>
  <v-autocomplete
    variant="outlined"
    density="compact"
    width="30%"
    v-model="search"
    class=""
    label="ໃສ່ລະຫັດທະນາຄານ"
    :items="uniqueUserIds.map((user) => ({ title: user, value: user }))"
    item-text="title"
    item-value="value"
  />
  <v-data-table
    :headers="headers"
    :items="filteredItems"
    class="elevation-1  justify-start"
    :items-per-page="12"
  >
    <template v-slot:top> </template>

    <template v-slot:item.path="{ item }">
      <a :href="getFullPath(item.path)" target="_blank">{{
        getFileName(item.path)
      }}</a>
    </template>
    <template v-slot:item.percentage="{ item }" class="text-start">
      <span
        :style="{ color: getPercentageColor(item.percentage) }"
        class="text-start"
        ><p class="text-center">{{ item.percentage.toFixed(2) }}%</p></span
      >
    </template>
    <template
      :custom-filter="filterOnlyCapsText"
      :search="search"
      v-slot:item.user_id="{ item }"
    >
      <p :href="getFullPath(item.user_id)" target="_blank">
        {{ getFileName(item.user_id) }}
      </p>
    </template>
    <template v-slot:item.status="{ item }">
      <v-chip :color="getStatusColor(item.status)" dark>{{
        item.status
      }}</v-chip>
    </template>
    <template v-slot:item.fileSize="{ item }">
      <span v-if="Number(item.fileSize) / 1024 / 1024 < 1">
        {{ (Number(item.fileSize) / 1024).toFixed(2) }} KB
      </span>
      <span v-else>
        {{ (Number(item.fileSize) / 1024 / 1024).toFixed(2) }} MB
      </span>
    </template>
    <template v-slot:item.statussubmit="{ item }">
      <div class="d-flex align-center">
        <template v-if="item.statussubmit === '0' && item.percentage <= 60">
          <span style="color: green">ຢືນຢັນສຳເລັດແລ້ວ</span>
        </template>
        <template v-if="item.statussubmit === '3' && item.percentage <= 60">
          <span class="text-green"
            >ກຳລັງຢືນຢັນຂໍ້ມູນເຂົ້າຖານຂໍ້ມູນ
            <v-progress-circular
              :size="20"
              color="primary"
              indeterminate
            ></v-progress-circular
          ></span>
        </template>
        <template v-if="item.statussubmit === '4' && item.percentage <= 60">
          <span class="text-warning"
            >ກຳລັງອັນໂຫຼດຂໍ້ມູນ
            <v-progress-circular
              :size="20"
              color="warning"
              indeterminate
            ></v-progress-circular
          ></span>
        </template>
        <template v-if="item.statussubmit === '2'">
          <span style="color: red">ຂໍ້ຜິດພາດສູງເກີນກຳນົດ</span>
        </template>
        <template
          v-else-if="item.statussubmit === '1' || item.statussubmit === '5'"
        >
          <v-btn
            @click="handleConfirmAction(item)"
            color="success"
            :disabled="isUserIdProcessing(item.user_id)"
          >
            ຢືນຢັນ
          </v-btn>
        </template>
      </div>
    </template>
    <template v-slot:item.actions="{ item }">
      <div>
        <v-btn @click="viewDetails(item)" color="info" class="ml-10"
          >ເບິ່ງລາຍລະອຽດ</v-btn
        >
        <v-btn
          v-if="item.statussubmit === '0'"
          @click="uploadDataButton(item)"
          color="#FF6D00"
          class="ml-2"
          :disabled="isUserIdProcessing(item.user_id)"
        >
          ອັນໂຫຼດ
        </v-btn>

        <span v-if="item.statussubmit === '5'">
          <v-chip color="warning">ອັນໂຫຼດຂໍ້ມູນອອກແລ້ວ</v-chip>
        </span>
      </div>
    </template>
    <template v-slot:no-data>
      <v-alert type="info" :value="true">ບໍ່ມີຂໍ້ມູນ</v-alert>
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";
import Cookies from "js-cookie";
import { useRuntimeConfig } from "#app";
import { ValidateResponse } from "~/types";

definePageMeta({
  layout: "backend",
});

useHead({
  title: "Upload File",
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

const search = ref("");
const file = ref<File | null>(null);
const items = ref<ValidateResponse.items[]>([]);
const router = useRouter();
const config = useRuntimeConfig();

const headers = ref([
  { title: "ໄອດີ", value: "CID" },
  { title: "ຊື່ພາດ", value: "path" },
  { title: "ລະຫັດທະນາຄານ", value: "user_id" },
  { title: "ຂະໜາດຟາຍ", value: "fileSize" },
  { title: "ສະຖານະການຢືນຢັນ", value: "statussubmit" },
  { title: "ວັນທີອັບໂຫຼດ", value: "percentage" },
  { title: "Actions", value: "actions", sortable: false },
]);

onMounted(async () => {
  await fetchData();
});

const fetchData = async () => {
  try {
    const response = await axios.get(
      `${config.public.strapi.url}api/api/upload-filesc2/`
    );

    console.log("API Response:", response.data);

    const data = Array.isArray(response.data)
      ? response.data
      : response.data.data
      ? response.data.data
      : [];

    items.value = data.map((item: any) => {
      console.log("Processing item:", item);

      const itemCID = item.CID || item.id_file || item.id || null;

      if (!itemCID) {
        console.warn("Item missing CID:", item);
      }

      return {
        ...item,
        CID: itemCID,
        status: "ສຳເລັດການນຳສົ່ງຂໍ້ມູນ",
        confirmed: item.confirmed || false,
        statussubmit: item.statussubmit || "1",
      };
    });

    console.log("Processed items:", items.value);
    sortItemsByUploadDate();
  } catch (error) {
    console.error("Failed to fetch data:", error);

    Swal.fire({
      title: "ຜິດພາດ!",
      text: "ບໍ່ສາມາດດຶງຂໍ້ມູນໄດ້. ກະລຸນາລອງໃໝ່ອີກຄັ້ງ.",
      icon: "error",
    });
  }
};

const filteredItems = computed(() =>
  items.value.filter(
    (item) =>
      item.user_id.toLowerCase().includes(search.value.toLowerCase()) &&
      (item.statussubmit === "0" ||
        item.statussubmit === "1" ||
        item.statussubmit === "2" ||
        item.statussubmit === "3" ||
        item.statussubmit === "4" ||
        item.statussubmit === "5")
  )
);

const uniqueUserIds = computed(() => {
  return [...new Set(filteredItems.value.map((item) => item.user_id))];
});

const isUserIdProcessing = (userId: string) => {
  return items.value.some(
    (item) =>
      (item.user_id === userId && item.statussubmit === "3") ||
      (item.user_id === userId && item.statussubmit === "4")
  );
};

const handleConfirmAction = (item: any) => {
  if (isUserIdProcessing(item.user_id)) {
    Swal.fire({
      title: "ບໍ່ສາມາດດຳເນີນການໄດ້",
      text: "ບໍ່ສາມາດຢືນຢັນໄດ້ເນື່ອງຈາກມີລາຍການກຳລັງປະມວນຜົນຢູ່ໃນທະນາຄານດຽວກັນ",
      icon: "warning",
    });
    return;
  }

  confirmAction(item);
};

const sortItemsByUploadDate = () => {
  items.value.sort(
    (a: any, b: any) =>
      new Date(b.insertDate).getTime() - new Date(a.insertDate).getTime()
  );
};

const viewDetails = async (item: any) => {
  if (!item.CID) {
    Swal.fire({
      icon: "error",
      title: "ລົ້ມເຫລວ",
      text: "ບໍມີຂໍ້ມູນທີ່ກົງກັບ CID ນີ້",
    });
    return;
  }

  try {
    const response = await axios.get(
      `${config.public.strapi.url}api/api/productinfoc3/`,
      {
        params: {
          CID: item.CID,
        },
      }
    );

    const data = response.data;
    router.push({
      name: "detailupload_c",
      query: { data: JSON.stringify(data) },
    });
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "ລົ້ມເຫລວ",
      text: "ການດຶງຂໍ້ມູນລົ້ມເຫລວ",
    });
  }
};

const confirmAction = async (item: any) => {
  Swal.fire({
    title: "ຢືນຢັນການດຳເນີນການ",
    text: "ທ່ານແນ່ໃຈຫຼືບໍ່ທີ່ຢືນຢັນການອັບໂຫຼດນີ້?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "ແນ່ໃຈ, ຢືນຢັນ!",
    cancelButtonText: "ຍົກເລີກ",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        if (isUserIdProcessing(item.user_id)) {
          Swal.fire({
            title: "ບໍ່ສາມາດດຳເນີນການໄດ້",
            text: "ບໍ່ສາມາດຢືນຢັນໄດ້ເນື່ອງຈາກມີລາຍການກຳລັງປະມວນຜົນຢູ່ໃນທະນາຄານດຽວກັນ",
            icon: "warning",
          });
          return;
        }

        const response1 = await axios.post(
          `${config.public.strapi.url}api/api/update-statussubmitc/`,
          `CID=${item.CID}`
        );

        if (response1.data.status === "success") {
          const confirmedItem = items.value.find(
            (i) => i.fileName === item.fileName
          );
          if (confirmedItem) {
            confirmedItem.confirmed = true;
            confirmedItem.statussubmit = "0";
          }
        }
        const params = new URLSearchParams();
        const csrfToken = Cookies.get("csrftoken");
        params.append("CID", item.CID);

        const response = await axios.post(
          `${config.public.strapi.url}api/confirm_uploadc/`,
          params,
          {
            headers: {
              "X-CSRFToken": csrfToken,
            },
          }
        );

        if (response.data.status === "success") {
          const confirmedItem = items.value.find(
            (i) => i.fileName === item.fileName
          );
          if (confirmedItem) {
            confirmedItem.confirmed = true;
            confirmedItem.statussubmit = "0";
          }

          Swal.fire("ຢືນຢັນສຳເລັດ!", "ການອັບໂຫຼດໄດ້ຖືກຢືນຢັນ.", "success").then(
            () => {
              location.reload();
            }
          );
        } else {
          Swal.fire("ລົ້ມເຫລວ!", "ການຢືນຢັນການອັບໂຫຼດລົ້ມເຫລວ.", "error");
        }
      } catch (error: any) {
        console.error("Failed to confirm upload:", error);
        if (error.response && error.response.status === 408) {
          Swal.fire(
            "ຜິດພາດ!",
            "ບໍ່ສາມາດຢືນຢັນໄດ້ເນື່ອງຈາກ period ຂອງໄຟລ໌ນ້ອຍກວ່າ period ທີ່ມີຢູ່ແລ້ວ.",
            "error"
          );
        } else {
          Swal.fire(
            "ຜິດພາດ!",
            "ມີຄວາມຜິດພາດເກີດຂຶ້ນໃນຂະນະທີ່ຢືນຢັນການອັບໂຫຼດ.",
            "error"
          );
        }
      }
    }
  });
};

const uploadDataButton = async (item: any) => {
  try {
    if (isUserIdProcessing(item.user_id)) {
      Swal.fire({
        title: "ບໍ່ສາມາດດຳເນີນການໄດ້",
        text: "ບໍ່ສາມາດອັບໂຫຼດໄດ້ເນື່ອງຈາກມີລາຍການກຳລັງປະມວນຜົນຢູ່ໃນທະນາຄານດຽວກັນ",
        icon: "warning",
      });
      return;
    }

    Swal.fire({
      title: "ຢືນຢັນການອັບໂຫຼດຂໍ້ມູນ",
      text: "ທ່ານແນ່ໃຈບໍ່ທີ່ຈະອັບໂຫຼດຂໍ້ມູນນີ້ແບບອັດຕະໂນມັດ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ແນ່ໃຈ, ອັບໂຫຼດເລີຍ!",
      cancelButtonText: "ຍົກເລີກ",
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (isUserIdProcessing(item.user_id)) {
          Swal.fire({
            title: "ບໍ່ສາມາດດຳເນີນການໄດ້",
            text: "ບໍ່ສາມາດອັບໂຫຼດໄດ້ເນື່ອງຈາກມີລາຍການກຳລັງປະມວນຜົນຢູ່ໃນທະນາຄານດຽວກັນ",
            icon: "warning",
          });
          return;
        }

        const response1 = await axios.post(
          `${config.public.strapi.url}api/api/unload-statussubmitc/`,
          `CID=${item.CID}`
        );

        if (response1.data.status === "success") {
          const confirmedItem = items.value.find(
            (i) => i.fileName === item.fileName
          );
          if (confirmedItem) {
            confirmedItem.confirmed = true;
            confirmedItem.statussubmit = "0";
          }
        }
        const uploadingItem = items.value.find((i) => i.CID === item.CID);
        if (uploadingItem) {
          uploadingItem.statussubmit = "3";
        }

        const params = new URLSearchParams();
        const csrfToken = Cookies.get("csrftoken");
        params.append("CID", item.CID);

        try {
          const response = await axios.post(
            `${config.public.strapi.url}api/unload_uploadc/`,
            params,
            {
              headers: {
                "X-CSRFToken": csrfToken,
                "Content-Type": "application/x-www-form-urlencoded",
              },
            }
          );

          console.log("Response from upload:", response.data);

          if (response.data.status === "success") {
            const successItem = items.value.find((i) => i.CID === item.CID);
            if (successItem) {
              successItem.statussubmit = "0";
            }

            Swal.fire({
              title: "ສຳເລັດ!",
              text: `ອັບໂຫຼດຂໍ້ມູນສຳເລັດ. ຈຳນວນລາຍການທີ່ປະມວນຜົນ: ${response.data.processed_count}`,
              icon: "success",
            }).then(() => {
              fetchData();
            });
          } else if (response.data.status === "warning") {
            Swal.fire({
              title: "ສຳເລັດແຕ່ມີຄຳເຕືອນ",
              text: response.data.message,
              icon: "warning",
              html: `
                <div>
                  <p>${response.data.message}</p>
                  <p>ຈຳນວນລາຍການທີ່ປະມວນຜົນສຳເລັດ: ${
                    response.data.processed_count
                  }</p>
                  ${
                    response.data.errors && response.data.errors.length
                      ? `
                    <p>ລາຍລະອຽດຄຳເຕືອນ:</p>
                    <ul style="text-align: left; max-height: 200px; overflow-y: auto; margin-top: 10px;">
                      ${response.data.errors
                        .map((error: any) => `<li>${error}</li>`)
                        .join("")}
                    </ul>
                  `
                      : ""
                  }
                </div>
              `,
            }).then(() => {
              fetchData();
            });
          } else {
            const failedItem = items.value.find((i) => i.CID === item.CID);
            if (failedItem) {
              failedItem.statussubmit = "1";
            }

            Swal.fire({
              title: "ບໍ່ສຳເລັດ!",
              text: response.data.message || "ການອັບໂຫຼດຂໍ້ມູນບໍ່ສຳເລັດ",
              icon: "error",
            });
          }
        } catch (error: any) {
          console.error("Failed to upload data:", error);

          const errorItem = items.value.find((i) => i.CID === item.CID);
          if (errorItem) {
            errorItem.statussubmit = "1";
          }

          const errorMessage =
            error.response?.data?.message ||
            "ການອັບໂຫຼດຂໍ້ມູນລົ້ມເຫຼວ, ກະລຸນາລອງໃໝ່";

          Swal.fire({
            title: "ຜິດພາດ!",
            text: errorMessage,
            icon: "error",
          });
        }
      }
    });
  } catch (error: any) {
    console.error("Failed to confirm upload:", error);
    if (error.response && error.response.status === 406) {
      Swal.fire(
        "ຜິດພາດ!",
        "ບໍ່ສາມາດຢືນຢັນໄດ້ເນື່ອງຈາກ period ຂອງໄຟລ໌ນ້ອຍກວ່າ period ທີ່ມີຢູ່ແລ້ວ.",
        "error"
      );
    } else {
      Swal.fire(
        "ຜິດພາດ!",
        "ມີຄວາມຜິດພາດເກີດຂຶ້ນໃນຂະນະທີ່ຢືນຢັນການອັບໂຫຼດ.",
        "error"
      );
    }
  }
};

const getPercentageColor = (percentage: number) => {
  if (percentage > 15) {
    return "red";
  } else if (percentage <= 15) {
    return "green";
  } else {
    return "black";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "ກຳລັງນຳສົ່ງຂໍ້ມູນ":
      return "blue";
    case "ການນຳສົ່ງຂໍ້ມູນສຳເລັດແລ້ວ":
      return "green";
    case "ການນຳສົ່ງບໍ່ສົມບູນ":
      return "red";
    default:
      return "black";
  }
};

const getFullPath = (path: string) =>
  `${config.public.strapi.url}media/${path}`;

const getFileName = (path: string) => {
  const parts = path.split("/");
  return parts[parts.length - 1];
};

const onSearch = () => {
  emit("searchQuery", search.value);
};

const emit = defineEmits(["searchQuery"]);

defineExpose({
  onSearch,
});
</script>

<style scoped>
.d-flex {
  display: flex;
  align-items: center;
}
</style>
