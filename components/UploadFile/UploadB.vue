<template>
  <v-container>
    <v-col cols="12">
      <v-row>
        <v-col cols="12" md="5" v-if="user && user.MID.id !== '01'">
          <v-file-input
            v-if="user && user.MID.id !== '01'"
            density="compact"
            variant="outlined"
            prepend-icon="mdi-paperclip"
            :label="$t('uploadjson')"
            accept=".json, .xml"
            @change="onFileChange"
            outlined
          ></v-file-input>
        </v-col>
        <v-col cols="12" md="2" v-if="user && user.MID.id !== '01'">
          <v-btn
            @click="uploadFile"
            color="primary"
            v-if="user && user.MID.id !== '01'"
            >{{ $t("upload") }}</v-btn
          >
        </v-col>
        <v-col cols="12" md="4">
          <v-autocomplete
            variant="outlined"
            v-if="user && user.MID.id === '01'"
            density="compact"
            width=""
            v-model="search"
            class=""
            label="ໃສ່ລະຫັດທະນາຄານ"
            :items="
              uniqueUserIds.map((user_id) => ({
                title: user_id,
                value: user_id,
              }))
            "
            item-text="title"
            item-value="value"
          />
        </v-col>
      </v-row>
    </v-col>

    <v-data-table
      item-value="name"
      :headers="headers"
      :items="filteredItems"
      class="custom-header elevation-1"
    >
      <template v-slot:top> </template>
      <template v-slot:header.FID class="">
        <th style="color: #0d47a1">{{ $t("id") }}</th>
      </template>
      <template v-slot:header.path>
        <th style="color: #0d47a1">{{ $t("pathname") }}</th>
      </template>
      <template v-slot:header.user_id>
        <th style="color: #0d47a1" v-if="user && user.MID.id === '01'">
          ລະຫັດທະນາຄານ
        </th>
      </template>
      <template v-slot:header.fileSize>
        <th style="color: #0d47a1" v-if="user && user.MID.id === '01'">
          ຂະໜາດຟາຍ
        </th>
      </template>
      <template v-slot:header.statussubmit>
        <th style="color: #0d47a1">{{ $t("status") }}</th>
      </template>
      <template v-slot:header.percentage>
        <th style="color: #0d47a1">{{ $t("percentage") }}</th>
      </template>

      <template v-slot:header.actions>
        <th style="color: #0d47a1">Actions</th>
      </template>

      <template v-slot:item.path="{ item }">
        <a :href="getFullPath(item.path)" target="_blank">{{
          getFileName(item.path)
        }}</a>
      </template>

      <template
        :custom-filter="filterOnlyCapsText"
        :search="search"
        v-slot:item.user_id="{ item }"
      >
        <p
          :href="getFullPath(item.user_id)"
          target="_blank"
          v-if="user && user.MID.id === '01'"
        >
          {{ getFileName(item.user_id) }}
        </p>
      </template>

      <template v-slot:item.percentage="{ item }">
        <span :style="{ color: getPercentageColor(item.percentage) }"
          >{{ item.percentage.toFixed(2) }}%</span
        >
      </template>

      <template v-slot:item.statussubmit="{ item }">
       
        <v-chip v-if="item.statussubmit === 'Pending'" class="text-green darken-2">
          ກຳລັງນຳສົ່ຂໍ້ມູນ
          <v-progress-circular
            :size="20"
            color="primary"
            indeterminate
          ></v-progress-circular>
        </v-chip>
        <v-chip v-if="item.statussubmit === '1' || item.statussubmit ==='3' " class="text-primary darken-2">
          ນຳສົ່ຂໍ້ມູນສຳເລັດ
        </v-chip>
        <v-chip v-if="item.statussubmit === '2'" class="text-error darken-2">
          ປະຕິເສດ
        </v-chip>
        <v-chip v-if="item.statussubmit === '5'" class="text-lime-darken-4 darken-2">
          ຂໍ້ມູນຖືກອັນໂຫຼດ
        </v-chip>
        <v-chip v-if="item.statussubmit === '4'" class="text-lime-darken-4 darken-2">
          ຂໍ້ມູນຖືກອັນໂຫຼດ
        </v-chip>
        <v-chip v-if="item.statussubmit === '0'" class="text-success darken-2">
          ສໍາເລັດການໂຫຼດ
        </v-chip>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-btn @click="viewDetails(item)" color="#304FFE">{{
          $t("detail")
        }}</v-btn>
      </template>

      <template v-slot:no-data>
        <v-alert type="info" :value="true">{{ $t("detail") }}</v-alert>
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
    interface User {
      MID: {
        id: string;
        name: string;
        email: string;
        phone: string;
        role: string;
      };
    }
    interface itemdata {
      FID: string;
      fileName: string;
      status: string;
      path: string;
    }
    const user = ref<User | null>(null);
    const file = ref<File | null>(null);
    const items = ref<itemdata[]>([]);
    const fetchbank = ref<any[]>([]);
    const isloading = ref<boolean>(false);
    const error = ref<string | null>;
    const headers = ref([
      { title: "ໄອດີ", value: "FID" },
      { title: "ຊື່ພາດ", value: "path" },
      { title: "ລະຫັດທະນາຄານ", value: "user_id" },
      { title: "ຂະໜາດຟາຍ", value: "fileSize" },

      { title: "ສະຖານະ", value: "statussubmit" },
      { title: "ວັນທີອັບໂຫຼດ", value: "percentage" },
      { title: "Actions", value: "actions", sortable: false },
    ]);

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

    const fetchDataByUserID = async (userID: string): Promise<void> => {
      try {
        const config = useRuntimeConfig();

        const url =
          userID === "01"
            ? `${config.public.strapi.url}api/upload-files2/`
            : `${config.public.strapi.url}api/upload-files2/?user_id=${userID}`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Failed to fetch data from the server.");
        }

        const data = await response.json();

        items.value = data.map((item: any) => ({
          ...item,
          FID: item.FID,
          fileName: item.fileName,
          path: item.path,
          user_id: item.user_id,
          statussubmit: item.statussubmit,
          percentage: item.percentage || 0,
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

    console.log("Unique User IDs:", uniqueUserIds.value);

    // const fetchDataByUserID = async (userID: String) => {
    //   try {
    //     const config = useRuntimeConfig();

    //     const url =
    //       userID === "01"
    //         ? `${config.public.strapi.url}api/upload-files2/`
    //         : `${config.public.strapi.url}api/upload-files2/?user_id=${userID}`;

    //     const response = await fetch(url);
    //     console.log("Response:", response);
    //     console.log("user", userID);

    //     if (!response.ok) {
    //       throw new Error("Network response was not ok");
    //     }

    //     const data = await response.json();
    //     console.log("Data for user:", data);

    //     items.value = data.map((item: String) => ({
    //       ...item,
    //       FID: item.FID,
    //       status: "ສຳເລັດການນຳສົ່ງຂໍ້ມູນ",
    //       confirmed: false,
    //     }));
    //     sortItemsByUploadDate();
    //   } catch (error) {
    //     console.error("Failed to fetch data:", error);
    //   }
    // };
    // const filter = computed(() => fetchDataByUserID)

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
        items.value = data.map((item: any) => ({
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

      if (user.value) {
        let userId = user.value.MID.id;

        if (userId < 10) {
          userId = "" + userId;
        }

        formData.append("user_id", userId);
        console.log("Formatted User ID:", userId);
      } else {
        Swal.fire({
          icon: "warning",
          title: "ຂໍ້ມູນຜູ້ໃຊ້ບໍ່ສາມາດສົ່ງໄດ້",
          text: "ກະລຸນາກວດສອບຂໍ້ມູນຜູ້ໃຊ້",
        });
        return;
      }
      const filteredItems = computed(() =>
        items.value.filter((item) =>
          item.name.toLowerCase().includes(search.value.toLowerCase())
        )
      );
      const newItem = {
        fileName: file.value.name,
        fileSize: file.value.size,
        path: "",
        insertDate: new Date().toLocaleString(),
        updateDate: new Date().toLocaleString(),
        status: "ກຳລັງນຳສົ່ງຂໍ້ມູນ",
      };
      items.value.push(newItem);
      const config = useRuntimeConfig();
      try {
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
          `${config.public.strapi.url}api/upload-files2/`
        );

        const data = await response2.json();
        items.value = data.map((item: any) => ({
          ...item,
          FID: item.FID,
        }));
      } catch (error) {
        console.error(error);

        const updatedItem = items.value.find(
          (item) => item.fileName === file.value!.name
        );
        if (updatedItem) {
          updatedItem.status = "ການນຳສົ່ງບໍ່ສົມບູນ";
        }

        if (error.response && error.response.status === 401) {
          Swal.fire({
            icon: "error",
            title: "ການນຳສົ່ງບໍ່ສົມບູນ",
            text: "ຂໍ້ມູນບໍ່ຖືກກັບທະນາຄານ ກາລຸນາກວດສອບຄືນ",
          });
        } else if (error.response && error.response.status === 402) {
          Swal.fire({
            icon: "error",
            title: "ການນຳສົ່ງບໍ່ສົມບູນ",
            text: "ບໍ່ມີຂໍ້ມູນ Bnk_code ກາລຸນາກວດຄືນໃຫມ່",
          });
        } else if (error.response && error.response.status === 403) {
          Swal.fire({
            icon: "error",
            title: "ການນຳສົ່ງບໍ່ສົມບູນ",
            text: "ຊື່ໄຟລ໌ຂອງທ່ານມີການສໍ້າກັນ ກາລຸນາກວດຄືນໃຫມ່",
          });
        } else if (error.response && error.response.status === 404) {
          Swal.fire({
            icon: "error",
            title: "ການນຳສົ່ງບໍ່ສົມບູນ",
            text: "ຮູບແບບຂອງ period ຢູ່ໃນຖານຂໍ້ມູນບໍ່ຖືກຕ້ອງ",
          });
        } else if (error.response && error.response.status === 405) {
          Swal.fire({
            icon: "error",
            title: "ການນຳສົ່ງບໍ່ສົມບູນ",
            text: "ທ່ານບໍ່ສາມາດອັບໂຫຼດຂໍ້ມູນຍອ້ນຫຼັງໄດ້ ກາລຸນາກວດຄືນໃຫມ່",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "ການອັບໂຫຼດລົ້ມເຫລວ",
            text: "ບໍ່ສາມາດອັບໂຫຼດຂໍ້ມູນການນຳສົ່ງຂໍ້ມູນບໍ່ສົມບູນ",
          });
        }
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
      const config = useRuntimeConfig();
      try {
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
          text: "ລົ້ມເຫລວໃນການສະແດບຂໍ້ມູນ",
        });
      }
    };
    const config = useRuntimeConfig();
    const getFullPath = (path: string) => {
      const baseUrl = `${config.public.strapi.url}media/`;
      return `${baseUrl}${path}`;
    };

    const getFileName = (path: string) => {
      const parts = path.split("/");
      return parts[parts.length - 1];
    };

    const getStatusColor = (statussubmit: string) => {
      switch (statussubmit) {
        case "Pending":
          return "orange";
        case "1":
          return "green";
        case "2":
          return "red";
        case "4":
          return "#827717";
        case "5":
          return "#827717";
        case "0":
        case "default":
          return "blue";
      }
    };

    const getStatusText = (statussubmit: string) => {
      switch (statussubmit) {
        case "Pending":
          return "ກຳລັງນຳສົ່ງຂໍ້ມູນ";
        case "1":
          return "ສຳເລັດການນຳສົ່ງຂໍ້ມູນ";
        case "2":
          return "ປະຕິເສດ";
        case "4":
          return "ຂໍ້ມູນກຳລັງຖືກອັນໂຫຼດ";
        case "5":
          return "ຂໍ້ມູນຖືກອັນໂຫຼດ";
        case "0":
        case "default":
          return "ສຳເລັດການໂຫຼດ";
      }
    };

    const getPercentageColor = (percentage: string) => {
      const percentageValue = parseFloat(percentage);

      if (percentageValue >= 15) {
        return "red";
      } else if (percentageValue < 15) {
        return "green";
      }
      return "black";
    };

    return {
      onFileChange,
      uploadFile,
      user,
      file,
      items,
      headers,
      getFullPath,
      getPercentageColor,
      viewDetails,
      getStatusColor,
      getStatusText,
      getFileName,
      fetchDataByUserID,
      search,
      filterOnlyCapsText,
      filteredItems,
      uniqueUserIds,
    };
  },
});
</script>
<style scoped>
.v-progress-circular {
  margin: 1rem;
}
</style>
