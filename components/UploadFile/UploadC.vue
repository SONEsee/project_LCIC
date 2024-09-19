<template>
    <p class="ml-3 text-primary"> * ອັບໂຫຼດຂໍ້ມູນຫຼັກຊັບ</p>
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
        <template v-slot:item.status_upload="{ item }">
          <v-chip :color="getStatusColor(item.status_upload)" dark>{{
            getStatusText(item.status_upload)
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
      const user = ref<User | null>(null);
      const items = ref([]);
      const headers = ref([
        { text: "ໄອດີ", value: "CID" },
        { text: "ຊື່ພາດ", value: "path" },
        { text: "ສະຖານະ", value: "status_upload" },
        { text: "ວັນທີອັບໂຫຼດ", value: "percentage" },
        { text: "Actions", value: "actions", sortable: false },
        
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
              // await fetchDataByUserID(paddedMID);
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
        if (user.value) {
          let userId = user.value.MID.id;
          if (userId < 10) {
            userId = "0" + userId;
          }
          formData.append("user_id", userId);
          console.log("Formatted User ID:", userId);
        } else {
          Swal.fire({
            icon: "warning",
          title: "ຂໍ້ມູນຜູ້ໃຊ້ບໍ່ສາມາດສົ່ງໄດ້",
          text: "ກະລຸນາກວດສອບຂໍ້ມູນຜູ້ໃຊ້",
        }
        );
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
          if (error.response && error.response.status === 405) {
          Swal.fire({
            icon: "error",
            title: "ການນຳສົ່ງບໍ່ສົມບູນ",
            text: "ຂໍ້ມູນບໍ່ຖືກກັບທະນາຄານ ກາລຸນາກວດສອບຄືນ",
          });
        } else if(error.response && error.response.status === 404) {
          Swal.fire({
            icon: "warning",
            title: "ມີຊືຟາຍຊໍ້າກັນ",
            text: "ຊື່ຟາຍນີ້ມີຢູ່ໃນລະບົບແລ້ວ ກາລຸນາກວດຄືນໃໝ່",
          })
        } else if(error.response && error.response.status === 406) {
          Swal.fire({
            icon: "error",
            title: "ອັບໂຫຼດລົ້ມເຫຼວ",
            text: "ຮູບແບບຂໍ້ມູນຂອງ period ຢູ່ໃນຖານຂໍ້ມູນບໍ່ຖືກຮູບແບບ",
          })
        } else if(error.response && error.response.status === 407) {
          Swal.fire({
            icon: "error",
            title: "ການອັບໂຫຼດລົ້ມເຫຼວ",
            text: "ທ່ານບໍ່ສາມາດອັບໂຫຼດຂໍ້ມູນຍອ້ນຫຼັງໄດ້",
          })
        }else{
          Swal.fire({
            icon: "error",
            title: "ການອັບໂຫຼດລົ້ມເຫລວ",
            text: "ກາລຸນາກວດສອບຄືນ",
          });
        }
          // Swal.fire({
          //   icon: "error",
          //   title: "ການອັບໂຫຼດລົ້ມເຫລວ",
          //   text: "ມີການສໍ້າກັນຂອງຊື້ໄຟລ໌",
          // });
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
          const response = await axios.get(
            "http://127.0.0.1:35729/api/api/productinfoc3/",
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



  
      const getFullPath = (path: string) => {
        const baseUrl = "http://127.0.0.1:35729/";
        return `${baseUrl}${path}`;
      };
  
      const getFileName = (path: string) => {
        const parts = path.split("/");
        return parts[parts.length - 1];
      };
  
      const getStatusColor = (status_upload: string) => {
        switch (status_upload) {
          case "in_progress":
            return "orange";
          case "completed":
            return "green";
          case "failed":
            return "red";
          case "0":
          case "default":
            return "blue";
        }
      };
  
      const getStatusText = (status_upload: string) => {
        switch (status_upload) {
          case "in_progress":
            return "ກຳລັງນຳສົ່ຂໍ້ມູນ";
          case "completed":
            return "ສຳເລັດການນຳສົ່ງຂໍ້ມູນ";
          case "failed":
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
        user,
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
  