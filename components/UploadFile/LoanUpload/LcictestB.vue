<template>
  <v-container>
    <v-autocomplete
      variant="outlined"
      density="compact"
      width="50%"
      v-model="search"
      class="pa-2"
      label="ໃສ່ລະຫັດທະນາຄານ"
      :items="
        uniqueUserIds.map((user_id) => ({ title: user_id, value: user_id }))
      "
      item-text="title"
      item-value="value"
    />
    <v-data-table
      :headers="headers"
      :items="filteredItems"
      class="elevation-1"
      :items-per-page="12"
    >
      <template v-slot:top>
        <!-- <v-toolbar flat>
          <v-divider class="mx-4" inset vertical></v-divider>
        </v-toolbar> -->
      </template>
      <!-- <template v-slot:item.path="{ item }">
          <a :href="getFullPath(item.path)" target="_blank">{{ item.path }}</a>
        </template> -->
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
      <template v-slot:item.statussubmit="{ item }">
        <div class="d-flex align-center">
          <template v-if="item.statussubmit === '0' && item.percentage <= 50">
            <span style="color: green">ຢືນຢັນສຳເລັດແລ້ວ</span>
          </template>
          <template v-else-if="item.statussubmit === '2'">
            <span style="color: red">ປະຕິເສດ</span>
          </template>
          <template v-else-if="item.percentage > 50">
            <span style="color: red">ຂໍ້ຜິດພາດສູງເກີນກຳນົດ</span>
          </template>
          <template v-else>
            <v-btn @click="confirmAction(item)" color="success"> ຢືນຢັນ </v-btn>
          </template>
        </div>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn @click="viewDetails(item)" color="info" class="ml-10"
          >ເບິ່ງລາຍລະອຽດ</v-btn
        >
      </template>
      <template v-slot:no-data>
        <v-alert type="info" :value="true">ບໍ່ມີຂໍ້ມູນ</v-alert>
      </template>
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
    });

    useHead({
      title: "Submit",
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
    interface ItemData {
      FID: string;
      fileName: string;
      path: string;
      statussubmit: string;
      percentage: number;
      status: string;
      confirmed: boolean;
      insertDate: string;
    }
    interface Item {
      FID: string;
      fileName: string;
      statussubmit: string;
      path?: string;
      confirmed: boolean;
      status: string;
      insertDate: string;
      updateDate: string;
    }

    const file = ref<File | null>(null);
    const items = ref<ItemData[]>([]);

    const headers = ref([
      { title: "ໄອດີ", value: "FID" },
      { title: "ຊື່ພາດ", value: "path" },
      { title: "ລະຫັດທະນາຄານ", value: "user_id" },

      { title: "ສະຖານະການຢືນຢັນ", value: "statussubmit" },
      { title: "ເປີເຊັນຄວາມຖືກຕອ້ງ", value: "percentage" },
      { title: "Actions", value: "actions", sortable: false },
    ]);

    // onMounted(async () => {
    //   await fetchData();
    // });
    onMounted(async () => {
      try {
        await fetchData();

        const userData = localStorage.getItem("user_data");
        console.log("User data:", userData);

        if (userData) {
          try {
            user.value = JSON.parse(userData);
            console.log("Parsed user data:", user.value);

            const MID = user.value.MID;

            if (MID && MID.id) {
              const paddedMID = MID.id.toString().padStart(2, "0");
              console.log("Padded MID.id:", paddedMID);

              await fetchDataByUserID(paddedMID);
            }
          } catch (error) {
            console.error("Error parsing user data:", error);
          }
        }
      } catch (error) {
        console.error("Error in onMounted:", error);
      }
    });
    const fetchData = async () => {
      try {
        const config = useRuntimeConfig();
        const response = await fetch(
          `${config.public.strapi.url}api/upload-files2/`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        items.value = data
          .filter(
            (item: Item) =>
              item.statussubmit === "1" ||
              item.statussubmit === "0" ||
              item.statussubmit === "2"
          )
          .map((item: Item) => ({
            ...item,
            FID: item.FID,
            status: "ສຳເລັດການນຳສົ່ງຂໍ້ມູນ",
            confirmed: false,
          }));

        sortItemsByUploadDate();
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    const filteredItems = computed(() =>
      items.value.filter((item) =>
        item.user_id.toLowerCase().includes(search.value.toLowerCase())
      )
    );
    const uniqueUserIds = computed(() => {
      return [...new Set(filteredItems.value.map((item) => item.user_id))];
    });

    const sortItemsByUploadDate = () => {
      items.value.sort(
        (a: any, b: any) =>
          new Date(b.insertDate).getTime() - new Date(a.insertDate).getTime()
      );
    };

    const onFileChange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        file.value = target.files[0];
      }
    };

    const uploadFile = async () => {
      if (!file.value) {
        Swal.fire({
          icon: "warning",
          title: "ບໍ່ໄດ້ເລືອກໄຟລ໌",
          text: "ກະລຸນາເລືອກໄຟລ໌ກ່ອນ",
        });
        return;
      }

      const formData = new FormData();
      formData.append("file", file.value);
      formData.append("title", file.value.name);

      const newItem = {
        fileName: file.value.name,
        fileSize: file.value.size,
        path: "",
        insertDate: new Date().toLocaleString(),
        updateDate: new Date().toLocaleString(),
        status: "ກຳລັງນຳສົ່ງຂໍ້ມູນ",
        confirmed: false,
      };
      items.value.push(newItem);

      try {
        const config = useRuntimeConfig();
        const response = await axios.post(
          `${config.public.strapi.url}api/upload-files/`,
          formData
        );

        const updatedItem = items.value.find(
          (item) => item.fileName === file.value!.name
        );
        if (updatedItem) {
          updatedItem.status = "ການນຳສົ່ງຂໍ້ມູນສຳເລັດແລ້ວ";
          updatedItem.path = response.data.path;
        }

        Swal.fire({
          icon: "success",
          title: "ສຳເລັດການນຳສົ່ງຂໍ້ມູນ",
          text: "ສຳເລັດການນຳສົ່ງຂໍ້ມູນສຳເລັດແລ້ວ",
        });

        const response2 = await fetch(
          `${config.public.strapi.url}api/api/upload-files2/`
        );
        const data = await response2.json();
        items.value = data.map((item: any) => ({
          ...item,
          FID: item.FID,
          fileName: item.fileName,
          path: item.path,
          user_id: item.user_id,
          status: "ສຳເລັດການນຳສົ່ງຂໍ້ມູນ",
          confirmed: false,
        }));
      } catch (error) {
        console.error(error);

        const updatedItem = items.value.find(
          (item) => item.fileName === file.value!.name
        );
        if (updatedItem) {
          updatedItem.status = "ການນຳສົ່ງບໍ່ສົມບູນ";
        }

        Swal.fire({
          icon: "error",
          title: "ການອັບໂຫຼດລົ້ມເຫລວ",
          text: "ລົ້ມເຫລວໃນການອັບໂຫຼດໄຟລ໌",
        });
      }
    };

    const router = useRouter();

    const viewDetails = async (item: any) => {
      if (!item.FID) {
        Swal.fire({
          icon: "error",
          title: "ລົ້ມເຫລວ",
          text: "ບໍມີຂໍ້ມູນທີ່ກົງກັບ FID ນີ້",
        });
        return;
      }

      try {
        const config = useRuntimeConfig();
        const response = await axios.get(
          `${config.public.strapi.url}api/api/productinfo3/`,
          {
            params: {
              FID: item.FID,
            },
          }
        );

        const data = response.data;
        router.push({
          name: "detailupload",
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
            const params = new URLSearchParams();
            const config = useRuntimeConfig();
            params.append("FID", item.FID);

            const response = await axios.post(
              `${config.public.strapi.url}api/confirm_upload/`,
              params
            );

            if (response.data.status === "success") {
              const confirmedItem = items.value.find(
                (i) => i.fileName === item.fileName
              );
              if (confirmedItem) {
                confirmedItem.confirmed = true;
                confirmedItem.statussubmit = "0";
              }

              Swal.fire(
                "ຢືນຢັນສຳເລັດ!",
                "ການອັບໂຫຼດໄດ້ຖືກຢືນຢັນ.",
                "success"
              ).then(() => {
                location.reload();
              });
            } else {
              Swal.fire("ລົ້ມເຫລວ!", "ການຢືນຢັນການອັບໂຫຼດລົ້ມເຫລວ.", "error");
            }
          } catch (error) {
            console.error("Failed to confirm upload:", error);

            Swal.fire(
              "ຜິດພາດ!",
              "ທ່ານບໍ່ສາມາດຢືນຢັນການອັບໂຫຼດຂໍ້ມູນຍອ້ນຫຼັງໄດ້.",
              "error"
            ).then(() => {
              location.reload();
            });
          }
        }
      });

      const response = await axios.post(
        `${config.public.strapi.url}api/api/update-statussubmit/`,
        `FID=${item.FID}`
      );

      if (response.data.status === "success") {
        const confirmedItem = items.value.find(
          (i) => i.fileName === item.fileName
        );
        if (confirmedItem) {
          confirmedItem.confirmed = true;
          confirmedItem.statussubmit = "0";
        }
      } else {
      }
    };

    const getPercentageColor = (percentage: number) => {
      if (percentage > 1) {
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

    // const getFullPath = (path: string) => {
    //   return `http://127.0.0.1:35729/media/${path}`;
    // };
    const config = useRuntimeConfig();
    const getFullPath = (path: string) => `${config.public.strapi.url}media/${path}`;
    const filterOnlyCapsText = (
      value: string | null,
      query: string | null
    ): boolean => {
      return (
        value !== null &&
        query !== null &&
        typeof value === "string" &&
        value.toUpperCase().includes(query)
      );
    };

    const getFileName = (path: string) => {
      const parts = path.split("/");
      return parts[parts.length - 1];
    };
    return {
      file,
      headers,
      items,
      onFileChange,
      uploadFile,
      viewDetails,
      confirmAction,
      getPercentageColor,
      getStatusColor,
      getFullPath,
      getFileName,
      filteredItems,
      search,
      uniqueUserIds,
      filterOnlyCapsText,
    };
  },
});
</script>

<style scoped>
.d-flex {
  display: flex;
  align-items: center;
}
</style>
