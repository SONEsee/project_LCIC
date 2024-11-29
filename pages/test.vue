<template>
  <p class="ml-3 text-primary"> * ອັບໂຫຼດຂໍ້ມູນຫຼັກຊັບ</p>
  <v-container>
    <v-file-input
      variant="outlined"
      prepend-icon="mdi-paperclip"
      label="ອັບໂຫຼດ JSON และ XML ເທົ່ານັ້ນ"
      accept=".json, .xml"
      @change="onFileChange"
      outlined
    ></v-file-input>
    <v-btn @click="uploadFile" color="primary">ອັບໂຫຼດຟາຍ</v-btn>
<v-table class="mt-4">
  <thead>
    <tr style="background-color: #5C6BC0; color: aliceblue;" >
      <td><b>ID</b></td>
      <td><b>file Name</b></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      
      
      <td class="text-center ml-2"><b>status</b></td>
      <td class="mr-5"><b>percentage</b></td>
      <td><b>action</b>  </td>

    </tr>
  </thead>
</v-table>
    <v-data-table :headers="headers" :items="items" class="elevation-1">
     
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
      <template v-slot:item.statussubmit="{ item }">
        <v-chip :color="getStatusColor(item.statussubmit)" dark>{{
          getStatusText(item.statussubmit)
        }}</v-chip>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn @click="viewDetails(item)" color="info">ເບິ່ງລາຍລະອຽດ</v-btn>
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
    const items = ref([]);
    const headers = ref([
      { text: "ໄອດີ", value: "FID" },
      { text: "ຊື່ພາດ", value: "path" },
      { text: "ສະຖານະ", value: "statussubmit" },
      { text: "ວັນທີອັບໂຫຼດ", value: "percentage" },
      { text: "Actions", value: "actions", sortable: false },
      
    ]);
   
    

    // onMounted(async () => {
    //   try {
    //     const response = await fetch(
    //       "http://127.0.0.1:35729/api/api/upload-files2/"
    //     );
    //     if (!response.ok) {
    //       throw new Error("Network response was not ok");
    //     }
    //     const data = await response.json();
    //     items.value = data.map((item: any) => ({
    //       ...item,
    //       FID: item.FID,
    //     }));
    //   } catch (error) {
    //     console.error("Failed to fetch data:", error);
    //   }
    // });
    onMounted(async () => {
      await fetchData();
    });




    

    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:35729/api/api/upload-filesc2/"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        items.value = data.map((item: any) => ({
          ...item,
          CID: item.CID,
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
        const response = await axios.post(
          "http://127.0.0.1:35729/api/upload-filesC/",
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
          "http://127.0.0.1:35729/api/api/upload-filesc2/"
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

        Swal.fire({
          icon: "error",
          title: "ການອັບໂຫຼດລົ້ມເຫລວ",
          text: "ມີການສໍ້າກັນຂອງຊື້ໄຟລ໌",
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
        const response = await axios.get(
          "http://127.0.0.1:35729/api/api/productinfo3/",
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

    const getFullPath = (path: string) => {
      const baseUrl = "http://127.0.0.1:35729/";
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
        case "0":
        case "default":
          return "blue";
      }
    };

    const getStatusText = (statussubmit: string) => {
      switch (statussubmit) {
        case "Pending":
          return "ກຳລັງນຳສົ່ຂໍ້ມູນ";
        case "1":
          return "ສຳເລັດການນຳສົ່ງຂໍ້ມູນ";
        case "2":
          return "ປະຕິເສດ";
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
      items,
      headers,
      getFullPath,
      getPercentageColor,
      viewDetails,
      getStatusColor,
      getStatusText,
      getFileName,
    };
  },
});
</script>
