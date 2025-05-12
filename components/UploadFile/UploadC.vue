<template>
  <!-- <p class="ml-3 text-primary"> {{ $t("uploadsecuritiesdata")}}</p> -->
  <!-- <div v-if="user">
    {{ user.MID.id }}
  </div> -->
  <v-container>
    <v-col cols="12" density="compact">
      <v-row density="compact">
        <v-col cols="12" md="5" density="compact" v-if="user && user.MID.id !== '01'">
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
          <v-btn @click="uploadFile" color="primary" v-if="user && user.MID.id !== '01'">ອັບໂຫຼດຟາຍ</v-btn>
        </v-col>
        <v-col cols="12" md="4">
          <v-autocomplete
            variant="outlined"
            v-if="user && user.MID.id === '01'"
            density="compact"
            width=""
            v-model="search"
            label="ໃສ່ລະຫັດທະນາຄານເພື່ອຄົ້ນຫາ"
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
      :headers="headers"
      :items="filteredItems"
      class="elevation-1"
    >
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

      <template v-slot:item.path="{ item }">
        <a :href="getFullPath(item.path)" target="_blank">{{
          getFileName(item.path)
        }}</a>
      </template>

      <template v-slot:item.percentage="{ item }">
        <span :style="{ color: getPercentageColor(item.percentage) }"
          >{{ item.percentage.toFixed(2) }}%</span
        >
      </template>
      <template v-slot:item.user_id="{ item }">
        <p
          :href="getFullPath(item.user_id)"
          target="_blank"
          v-if="user && user.MID.id === '01'"
        >
          {{ getFileName(item.user_id) }}
        </p>
      </template>
      <template v-slot:item.statussubmit="{ item }">
        <v-chip :color="getStatusColor(item.statussubmit)" dark>{{
          getStatusText(item.statussubmit)
        }}</v-chip>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn @click="viewDetails(item)" color="info">{{
          $t("detail")
        }}</v-btn>
      </template>
      <template v-slot:no-data>
        <v-alert type="info" :value="true">{{ $t("noinformation") }}</v-alert>
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
  setup() {
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

    const file = ref<File | null>(null);
    const user = ref<User | null>(null);
    const items = ref([]);
    const search = ref("");
    const headers = ref([
      { title: "ໄອດີ", value: "CID" },
      { title: "ຊື່ພາດ", value: "path" },
      { title: "ລະຫັດທະນາຄານ", value: "user_id" },
      { title: "ສະຖານະ", value: "statussubmit" },
      { title: "ວັນທີອັບໂຫຼດ", value: "percentage" },
      { title: "Actions", value: "actions", sortable: false },
    ]);

    onMounted(async () => {
      try {
        // ດຶງຂໍ້ມູນເພື່ອປະຕິບັດ
        await fetchData();

        // ດຶງຂໍ້ມູນຜູ້ໃຊ້ຈາກ localStorage
        const userData = localStorage.getItem("user_data");
        console.log("User data:", userData);

        if (userData) {
          try {
            // ແປໄພເປັນ JSON ເພື່ອໃຊ້ງານ
            user.value = JSON.parse(userData);
            console.log("Parsed user data:", user.value);

            // ດຶງ MID ຈາກ user.value
            const MID = user.value.MID;

            // ກວດສອບວ່າ MID ແລະ MID.id ມີຄ່າຫຼືບໍ່
            if (MID && MID.id) {
              // ຕື່ມ '0' ດ້ານໜ້າຖ້າຄ່າ MID.id ນ້ອຍກວ່າ 10
              const paddedMID = MID.id.toString().padStart(2, "0");
              console.log("Padded MID.id:", paddedMID);

              // ດຶງຂໍ້ມູນຕາມ UserID ໃຊ້ MID.id
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
    // const fetchDataByUserID = async (userID: String) => {
    //   try {
    //     const config = useRuntimeConfig();
    //     const url = `${config.public.strapi.url}api/api/upload-filesc2/?user_id=${userID}`;
    //     const response = await fetch(url);
    //     console.log("Response:", response);

    //     if (!response.ok) {
    //       throw new Error("Network response was not ok");
    //     }

    //     const data = await response.json();
    //     console.log("Data for user:", data);

    //     items.value = data.map((item:String) => ({
    //       ...item,
    //       FID: item.CID,
    //       status: "ສຳເລັດການນຳສົ່ງຂໍ້ມູນ",
    //       confirmed: false,
    //     }));
    //     sortItemsByUploadDate();
    //   } catch (error) {
    //     console.error("Failed to fetch data:", error);
    //   }
    // };
    const fetchDataByUserID = async (userID: String) => {
      try {
        const config = useRuntimeConfig();
        let url = `${config.public.strapi.url}api/api/upload-filesc2/`;

        // ຖ້າ userID ເທົ່າກັບ 01 ສະແດງຂໍ້ມູນທັງໝົດ
        if (userID === "01") {
          url += "?all=true";
        } else {
          url += `?user_id=${userID}`;
        }

        const response = await fetch(url);
        console.log("Response:", response);

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        console.log("Data for user:", data);

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

    const fetchData = async (userID: string) => {
      const config = useRuntimeConfig();
      let url = `${config.public.strapi.url}api/api/upload-filesc2/`;

      // ກວດສອບ userID ເພື່ອຕັ້ງ URL ທີ່ຈະດຶງຂໍ້ມູນ
      if (userID !== "01") {
        url += `?user_id=${userID}`;
      }

      try {
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        console.log("Data fetched:", data);

        items.value = data.map((item: any) => ({
          ...item,
          FID: item.CID,
          status: "ສຳເລັດການນຳສົ່ງຂໍ້ມູນ",
          confirmed: false,
        }));

        sortItemsByUploadDate();
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    // const fetchData = async (userID: string) => {
    //   const config = useRuntimeConfig();
    //   try {
    //     const response = await fetch(
    //       `${config.public.strapi.url}api/api/upload-filesc2/`
    //     );
    //     if (!response.ok) {
    //       throw new Error("Network response was not ok");
    //     }
    //     const data = await response.json();
    //     console.log("data", data);
    //     items.value = data.map((item: any) => ({
    //       ...item,
    //       CID: item.CID,
    //       status: "ສຳເລັດການນຳສົ່ງຂໍ້ມູນ",
    //       confirmed: false,
    //     }));
    //     sortItemsByUploadDate();
    //   } catch (error) {
    //     console.error("Failed to fetch data:", error);
    //   }
    // };

    //     const fetchData = async (userID: string) => {
    //   const config = useRuntimeConfig();
    //   try {
    //     const response = await fetch(
    //       `${config.public.strapi.url}api/api/upload-filesc2/`
    //     );
    //     if (!response.ok) {
    //       throw new Error("Network response was not ok");
    //     }
    //     const data = await response.json();
    //     console.log("e")

    //     const filteredData = userID === "01"
    //       ? data

    //       : data.filter((item: any) => item.userID === userID);

    //     console.log("data", filteredData);

    //     items.value = filteredData.map((item: any) => ({
    //       ...item,
    //       CID: item.CID,
    //       status: "ສຳເລັດການນຳສົ່ງຂໍ້ມູນ",
    //       confirmed: false,
    //     }));
    //     sortItemsByUploadDate();
    //   } catch (error) {
    //     console.error("Failed to fetch data:", error);
    //   }
    // };

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

      const newItem = {
        fileName: file.value.name,
        fileSize: file.value.size,
        path: "",
        insertDate: new Date().toLocaleString(),
        updateDate: new Date().toLocaleString(),
        status: "ກຳລັງນຳສົ່ງຂໍ້ມູນ",
      };
      items.value.push(newItem);

      try {
        const config = useRuntimeConfig();
        const response = await axios.post(
          `${config.public.strapi.url}api/upload-filesC/`,

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
          `${config.public.strapi.url}api/api/upload-filesc2/`
        );
        const data = await response2.json();
        items.value = data.map((item: any) => ({
          ...item,
          CID: item.CID,
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
        } else if (error.response && error.response.status === 404) {
          Swal.fire({
            icon: "warning",
            title: "ມີຊືຟາຍຊໍ້າກັນ",
            text: "ຊື່ຟາຍນີ້ມີຢູ່ໃນລະບົບແລ້ວ ກາລຸນາກວດຄືນໃໝ່",
          });
        } else if (error.response && error.response.status === 406) {
          Swal.fire({
            icon: "error",
            title: "ອັບໂຫຼດລົ້ມເຫຼວ",
            text: "ຮູບແບບຂໍ້ມູນຂອງ period ຢູ່ໃນຖານຂໍ້ມູນບໍ່ຖືກຮູບແບບ",
          });
        } else if (error.response && error.response.status === 408) {
          Swal.fire({
            icon: "error",
            title: "ການອັບໂຫຼດລົ້ມເຫຼວ",
            text: "ທ່ານບໍ່ສາມາດອັບໂຫຼດຂໍ້ມູນຍອ້ນຫຼັງໄດ້",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "ການອັບໂຫຼດລົ້ມເຫລວ",
            text: "ກາລຸນາກວດສອບຄືນ",
          });
        }
      }
    };

    const router = useRouter();

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
        const config = useRuntimeConfig();
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
        case "5":
          return "#827717";
        case "4":
          return "#827717";
        case "0":
        case "default":
          return "blue";
      }
    };

    const getStatusText = (statussubmit: string) => {
      console.log("completed", statussubmit);
      switch (statussubmit) {
        case "Pending":
          return "ກຳລັງນຳສົ່ຂໍ້ມູນ";
        case "1":
          return "ສຳເລັດການນຳສົ່ງຂໍ້ມູນ";
        case "2":
          return "ປະຕິເສດ";
        case "5":
          return "ຂໍ້ມູນຖືກອັນໂຫຼດ";
        case "4":
          return "ກຳລັງຖືກອັນໂຫຼດ..";
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
      file,
      user,
      search,
      items,
      headers,
      getFullPath,
      getPercentageColor,
      viewDetails,
      getStatusColor,
      getStatusText,
      getFileName,
      filteredItems,
      uniqueUserIds,
    };
  },
});
</script>
