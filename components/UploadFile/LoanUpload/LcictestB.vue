<template>
  <v-container>
    <v-autocomplete
      variant="outlined"
      density="compact"
      width="50%"
      v-model="search"
      class="pa-2"
      label="ໃສ່ລະຫັດທະນາຄານ"
      :items="uniqueUserIds.map((user_id) => ({ title: user_id, value: user_id }))"
      item-text="title"
      item-value="value"
    />
    <v-data-table
      :headers="headers"
      :items="filteredItems"
      class="elevation-1"
      :items-per-page="12"
      :search="search"
      :custom-filter="filterOnlyCapsText"
    >
      <template v-slot:item.path="{ item }">
        <a :href="getFullPath(item.path)" target="_blank">{{ getFileName(item.path) }}</a>
      </template>

      <template v-slot:item.percentage="{ item }">
        <span :style="{ color: getPercentageColor(item.percentage) }">
          <p class="text-center">{{ item.percentage.toFixed(2) }}%</p>
        </span>
      </template>

      <template v-slot:item.user_id="{ item }">
        <p>{{ item.user_id }}</p>
      </template>

      <template v-slot:item.status="{ item }">
        <v-chip :color="getStatusColor(item.status)" dark>{{ item.status }}</v-chip>
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
            <v-btn @click="confirmAction(item)" color="success">ຢືນຢັນ</v-btn>
          </template>
        </div>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-btn @click="viewDetails(item)" color="info" class="ml-10">ເບິ່ງລາຍລະອຽດ</v-btn>
      </template>

      <template v-slot:no-data>
        <v-alert type="info" :value="true">ບໍ່ມີຂໍ້ມູນ</v-alert>
      </template>
    </v-data-table>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";
import axios from "axios";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "SingleColumnSearchTable",
  setup() {
    const search = ref("");
    const items = ref<ItemData[]>([]);
    const router = useRouter();

   
    interface ItemData {
      FID: string;
      fileName: string;
      path: string;
      statussubmit: string;
      percentage: number;
      status: string;
      confirmed: boolean;
      insertDate: string;
      user_id: string;
    }

  
    const headers = ref([
      { title: "ໄອດີ", value: "FID" },
      { title: "ຊື່ພາດ", value: "path" },
      { title: "ລະຫັດທະນາຄານ", value: "user_id" },
      { title: "ສະຖານະການຢືນຢັນ", value: "statussubmit" },
      { title: "ເປີເຊັນຄວາມຖືກຕອ້ງ", value: "percentage" },
      { title: "Actions", value: "actions", sortable: false },
    ]);

  
    onMounted(async () => {
      try {
        await fetchData();
      } catch (error) {
        console.error("Error in onMounted:", error);
      }
    });

 
    const fetchData = async () => {
      try {
        const config = useRuntimeConfig();
        const response = await fetch(`${config.public.strapi.url}api/upload-files2/`);
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();

        items.value = data
          .filter((item: ItemData) => ["0", "1", "2"].includes(item.statussubmit))
          .map((item: ItemData) => ({
            ...item,
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

    const uniqueUserIds = computed(() =>
      [...new Set(items.value.map((item) => item.user_id))]
    );

  
    const sortItemsByUploadDate = () => {
      items.value.sort(
        (a, b) => new Date(b.insertDate).getTime() - new Date(a.insertDate).getTime()
      );
    };

  
    const uploadFile = async (file: File) => {
      if (!file) {
        Swal.fire({
          icon: "warning",
          title: "ບໍ່ໄດ້ເລືອກໄຟລ໌",
          text: "ກະລຸນາເລືອກໄຟລ໌ກ່ອນ",
        });
        return;
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", file.name);

      const newItem: ItemData = {
        FID: "",
        fileName: file.name,
        path: "",
        statussubmit: "1",
        percentage: 0,
        status: "ກຳລັງນຳສົ່ງຂໍ້ມູນ",
        confirmed: false,
        insertDate: new Date().toISOString(),
        user_id: "",
      };
      items.value.push(newItem);

      try {
        const config = useRuntimeConfig();
        const response = await axios.post(
          `${config.public.strapi.url}api/upload-files/`,
          formData
        );

        const updatedItem = items.value.find((item) => item.fileName === file.name);
        if (updatedItem) {
          updatedItem.status = "ການນຳສົ່ງຂໍ້ມູນສຳເລັດແລ້ວ";
          updatedItem.path = response.data.path;
        }

        Swal.fire({
          icon: "success",
          title: "ສຳເລັດ",
          text: "ການອັບໂຫຼດສຳເລັດແລ້ວ",
        });

        await fetchData(); 
      } catch (error) {
        console.error("Upload failed:", error);
        const updatedItem = items.value.find((item) => item.fileName === file.name);
        if (updatedItem) updatedItem.status = "ການນຳສົ່ງບໍ່ສົມບູນ";

        Swal.fire({
          icon: "error",
          title: "ລົ້ມເຫລວ",
          text: "ການອັບໂຫຼດລົ້ມເຫລວ",
        });
      }
    };


    const viewDetails = async (item: ItemData) => {
      if (!item.FID) {
        Swal.fire({
          icon: "error",
          title: "ລົ້ມເຫລວ",
          text: "ບໍ່ມີຂໍ້ມູນທີ່ກົງກັບ FID",
        });
        return;
      }

      try {
        const config = useRuntimeConfig();
        const response = await axios.get(
          `${config.public.strapi.url}api/productinfo3/`,
          { params: { FID: item.FID } }
        );

        router.push({
          name: "detailupload",
          query: { data: JSON.stringify(response.data) },
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "ລົ້ມເຫລວ",
          text: "ການດຶງຂໍ້ມູນລົ້ມເຫລວ",
        });
      }
    };

   
    const confirmAction = async (item: ItemData) => {
      const result = await Swal.fire({
        title: "ຢືນຢັນການດຳເນີນການ",
        text: "ທ່ານແນ່ໃຈບໍ່ທີ່ຈະຢືນຢັນ?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "ແນ່ໃຈ",
        cancelButtonText: "ຍົກເລີກ",
      });

      if (result.isConfirmed) {
        try {
          const config = useRuntimeConfig();
          const params = new URLSearchParams({ FID: item.FID });
          const response = await axios.post(
            `${config.public.strapi.url}api/confirm_upload/`,
            params
          );

          if (response.data.status === "success") {
            const confirmedItem = items.value.find((i) => i.FID === item.FID);
            if (confirmedItem) {
              confirmedItem.confirmed = true;
              confirmedItem.statussubmit = "0";
            }
            Swal.fire("ສຳເລັດ!", "ການຢືນຢັນສຳເລັດ.", "success").then(() => {
              location.reload();
            });
          } else {
            Swal.fire("ລົ້ມເຫລວ!", "ການຢືນຢັນລົ້ມເຫລວ.", "error");
          }
        } catch (error) {
          console.error("Confirm failed:", error);
          Swal.fire("ຜິດພາດ!", "ການຢືນຢັນຜິດພາດ.", "error");
        }
      }
    };

    // Utility functions
    const getPercentageColor = (percentage: number) => {
      if (percentage > 50) return "red";
      if (percentage <= 15) return "green";
      return "black";
    };

    const getStatusColor = (status: string) => {
      switch (status) {
        case "ກຳລັງນຳສົ່ງຂໍ້ມູນ": return "blue";
        case "ການນຳສົ່ງຂໍ້ມູນສຳເລັດແລ້ວ": return "green";
        case "ການນຳສົ່ງບໍ່ສົມບູນ": return "red";
        default: return "black";
      }
    };

    const getFullPath = (path: string) => {
      const config = useRuntimeConfig();
      return `${config.public.strapi.url}media/${path}`;
    };

    const getFileName = (path: string) => {
      const parts = path.split("/");
      return parts[parts.length - 1];
    };

    const filterOnlyCapsText = (value: string | null, query: string | null): boolean => {
      return (
        value !== null &&
        query !== null &&
        typeof value === "string" &&
        value.toUpperCase().includes(query.toUpperCase())
      );
    };

    return {
      search,
      headers,
      items,
      filteredItems,
      uniqueUserIds,
      uploadFile,
      viewDetails,
      confirmAction,
      getPercentageColor,
      getStatusColor,
      getFullPath,
      getFileName,
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
.v-progress-circular {
  margin: 1rem;
}
</style>