<template>
  <div></div>
  <div v-if="user">
    {{ user.MID.id }}
  </div>

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

    <v-data-table
      :headers="headers"
      :items="items"
      class="custom-header elevation-1"
    >
      <template v-slot:header.FID>
        <th style="color: #0d47a1">ໄອດີ</th>
      </template>
      <template v-slot:header.path>
        <th style="color: #0d47a1">ຊື່ພາດ</th>
      </template>
      <template v-slot:header.statussubmit>
        <th style="color: #0d47a1">ສະຖານະ</th>
      </template>
      <template v-slot:header.percentage>
        <th style="color: #0d47a1">ສວນຕ່າງຂໍ້ມູນຜິດພາດ</th>
      </template>

      <template v-slot:header.actions>
        <th style="color: #0d47a1">Actions</th>
      </template>

      
<<<<<<< HEAD
  
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
            "http://127.0.0.1:35729/api/api/upload-files2/"
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
=======
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

    const user = ref<User | null>(null);
    const file = ref<File | null>(null);
    const items = ref([]);
    const headers = ref([
      { title: "ໄອດີ", value: "FID" },
      { title: "ຊື່ພາດ", value: "path" },
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
>>>>>>> 7a6a73f4385a12dae435ab5762d85d2ece83ccaa
          }
        }
      } catch (error) {
        console.error("Error in onMounted:", error);
      }
    });

    const fetchDataByUserID = async (userID: String) => {
      try {
        const config = useRuntimeConfig();
        const url = `${config.public.strapi.url}api/upload-files2/?user_id=${userID}`;
        const response = await fetch(url);
        console.log("Response:", response);

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        console.log("Data for user:", data);

        items.value = data.map((item:String) => ({
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
            "http://127.0.0.1:35729/api/upload-files/",
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
            icon: "error",
            title: "ການນຳສົ່ງບໍ່ສົມບູນ",
            text: "ຂໍ້ມູນບໍ່ຖືກກັບທະນາຄານ ກາລຸນາກວດສອບຄືນ",
          });
  
          const response2 = await fetch(
            "http://127.0.0.1:35729/api/api/upload-files2/"
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
  
          Swal.fire({
            icon: "error",
            title: "ການອັບໂຫຼດລົ້ມເຫລວ",
            text: "ບໍ່ສາມາດອັບໂຫຼດຂໍ້ມູນການນຳສົ່ງຂໍ້ມູນບໍ່ສົມບູນ",
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
    };
  },
});
</script>
