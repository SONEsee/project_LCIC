<template>
    <v-container>
      <v-data-table :headers="headers" :items="items" class="elevation-1" :items-per-page="12">
        <template v-slot:top>
          <v-toolbar flat>
            <v-divider class="mx-4" inset vertical></v-divider>
          </v-toolbar>
        </template>
        <!-- <template v-slot:item.path="{ item }">
          <a :href="getFullPath(item.path)" target="_blank">{{ item.path }}</a>
        </template> -->
        <template v-slot:item.path="{ item }">
          <a :href="getFullPath(item.path)" target="_blank">{{ getFileName(item.path) }}</a>
        </template>
        <template v-slot:item.percentage="{ item }" class="text-start">
          <span :style="{ color: getPercentageColor(item.percentage) }" class="text-start"><p class="text-center">{{ item.percentage.toFixed(2) }}%</p></span>
        </template>
        <template v-slot:item.status="{ item }">
          <v-chip :color="getStatusColor(item.status)" dark>{{ item.status }}</v-chip>
        </template>
        <template v-slot:item.statussubmit="{ item }" >
          <div class="d-flex align-center">
            <template v-if="item.statussubmit === '0' && item.percentage <= 60">
              <span style="color: green;">ຢືນຢັນສຳເລັດແລ້ວ</span>
            </template>
            <template v-else-if="item.percentage > 60">
              <span style="color: red;">ຂໍ້ຜິດພາດສູງເກີນກຳນົດ</span>
            </template>
            <template v-else>
              <v-btn @click="confirmAction(item)" color="success">
                ຢືນຢັນ
              </v-btn>
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
  import { defineComponent, ref, onMounted } from 'vue';
  import axios from 'axios';
  import Swal from 'sweetalert2';
  import { useRouter } from 'vue-router';
  import Cookies from 'js-cookie';
  
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
        { text: 'ໄອດີ', value: 'CID' },
        { text: 'ຊື່ພາດ', value: 'path' },
        
        { text: 'ສະຖານະການຢືນຢັນ', value: 'statussubmit' },{ text: 'ວັນທີອັບໂຫຼດ', value: 'percentage' },
        { text: 'Actions', value: 'actions', sortable: false },
      ]);
  
      // onMounted(async () => {
      //   try {
      //     const response = await fetch('http://127.0.0.1:35729/api/api/upload-files2/');
      //     if (!response.ok) {
      //       throw new Error('Network response was not ok');
      //     }
      //     const data = await response.json();
      //     items.value = data.map((item: any) => ({
      //       ...item,
      //       CID: item.FID,
      //       status: 'ສຳເລັດການນຳສົ່ງຂໍ້ມູນ',
      //       confirmed: false,
      //     }));
      //   } catch (error) {
      //     console.error('Failed to fetch data:', error);
      //   }
      // });
  
      onMounted(async () => {
        await fetchData();
      });
  
      const fetchData = async () => {
        try {
          const response = await fetch('http://127.0.0.1:35729/api/api/upload-filesc2/');
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          items.value = data.map((item: any) => ({
            ...item,
            CID: item.CID,
            status: 'ສຳເລັດການນຳສົ່ງຂໍ້ມູນ',
            confirmed: false,
          }));
          sortItemsByUploadDate();
        } catch (error) {
          console.error('Failed to fetch data:', error);
        }
      };
  
  
      const sortItemsByUploadDate = () => {
        items.value.sort((a: any, b: any) => new Date(b.insertDate).getTime() - new Date(a.insertDate).getTime());
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
            icon: 'warning',
            title: 'ບໍ່ໄດ້ເລືອກໄຟລ໌',
            text: 'ກະລຸນາເລືອກໄຟລ໌ກ່ອນ',
          });
          return;
        }
  
        const formData = new FormData();
        formData.append('file', file.value);
        formData.append('title', file.value.name);
  
        const newItem = {
          fileName: file.value.name,
          fileSize: file.value.size,
          path: '',
          insertDate: new Date().toLocaleString(),
          updateDate: new Date().toLocaleString(),
          status: 'ກຳລັງນຳສົ່ງຂໍ້ມູນ',
          confirmed: false,
        };
        items.value.push(newItem);
  
        try {
          const response = await axios.post('http://127.0.0.1:35729/api/upload-files/', formData);
  
          const updatedItem = items.value.find(item => item.fileName === file.value!.name);
          if (updatedItem) {
            updatedItem.status = 'ການນຳສົ່ງຂໍ້ມູນສຳເລັດແລ້ວ';
            updatedItem.path = response.data.path;
          }
  
          Swal.fire({
            icon: 'success',
            title: 'ສຳເລັດການນຳສົ່ງຂໍ້ມູນ',
            text: 'ສຳເລັດການນຳສົ່ງຂໍ້ມູນສຳເລັດແລ້ວ',
          });
  
          const response2 = await fetch('http://127.0.0.1:35729/api/api/upload-filesc2/');
          const data = await response2.json();
          items.value = data.map((item: any) => ({
            ...item,
            CID: item.CID,
            status: 'ສຳເລັດການນຳສົ່ງຂໍ້ມູນ',
            confirmed: false,
          }));
        } catch (error) {
          console.error(error);
  
          const updatedItem = items.value.find(item => item.fileName === file.value!.name);
          if (updatedItem) {
            updatedItem.status = 'ການນຳສົ່ງບໍ່ສົມບູນ';
          }
  
          Swal.fire({
            icon: 'error',
            title: 'ການອັບໂຫຼດລົ້ມເຫລວ',
            text: 'ລົ້ມເຫລວໃນການອັບໂຫຼດໄຟລ໌',
          });
        }
      };
  
      const router = useRouter();
  
      const viewDetails = async (item: any) => {
        if (!item.CID) {
          Swal.fire({
            icon: 'error',
            title: 'ລົ້ມເຫລວ',
            text: 'ບໍມີຂໍ້ມູນທີ່ກົງກັບ CID ນີ້',
          });
          return;
        }
  
        try {
          const response = await axios.get('http://127.0.0.1:35729/api/api/productinfoc3/', {
            params: {
              CID: item.CID,
            },
          });
  
          const data = response.data;
          router.push({ name: 'detailupload_c', query: { data: JSON.stringify(data) } });
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'ລົ້ມເຫລວ',
            text: 'ການດຶງຂໍ້ມູນລົ້ມເຫລວ',
          });
        }
      };
  
      const confirmAction = async (item: any) => {
        Swal.fire({
          title: 'ຢືນຢັນການດຳເນີນການ',
          text: 'ທ່ານແນ່ໃຈຫຼືບໍ່ທີ່ຢືນຢັນການອັບໂຫຼດນີ້?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'ແນ່ໃຈ, ຢືນຢັນ!',
          cancelButtonText: 'ຍົກເລີກ',
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              const params = new URLSearchParams();
              const csrfToken = Cookies.get('csrftoken');
              params.append('CID', item.CID);
  
              const response = await axios.post('http://127.0.0.1:35729/api/confirm_uploadc/', params, {
            headers: {
                'X-CSRFToken': csrfToken, // ເພີ່ມ CSRF Token ເຂົ້າໄປໃນ header
            },
        });
  
              if (response.data.status === 'success') {
                const confirmedItem = items.value.find(i => i.fileName === item.fileName);
                if (confirmedItem) {
                  confirmedItem.confirmed = true;
                  confirmedItem.statussubmit = "0";
                }
  
                Swal.fire('ຢືນຢັນສຳເລັດ!', 'ການອັບໂຫຼດໄດ້ຖືກຢືນຢັນ.', 'success').then(() => {
          
          location.reload();
        });
              } else {
                Swal.fire('ລົ້ມເຫລວ!', 'ການຢືນຢັນການອັບໂຫຼດລົ້ມເຫລວ.', 'error');
              }
            } catch (error) {
              console.error('Failed to confirm upload:', error);
              Swal.fire('ຜິດພາດ!', 'ມີຄວາມຜິດພາດເກີດຂຶ້ນໃນຂະນະທີ່ຢືນຢັນການອັບໂຫຼດ.', 'error');
            }
          }
        });
  
        const response = await axios.post('http://127.0.0.1:35729/api/api/update-statussubmitc/', `CID=${item.CID}`);
  
        if (response.data.status === 'success') {
          const confirmedItem = items.value.find(i => i.fileName === item.fileName);
          if (confirmedItem) {
            confirmedItem.confirmed = true;
            confirmedItem.statussubmit = "0";
          }
        }
      };
      const getPercentageColor = (percentage: number) => {
        if (percentage > 15) {
          return 'red';
        } else if (percentage <= 15) {
          return 'green';
        } else {
          return 'black';
        }
      };
  
      const getStatusColor = (status: string) => {
        switch (status) {
          case 'ກຳລັງນຳສົ່ງຂໍ້ມູນ':
            return 'blue';
          case 'ການນຳສົ່ງຂໍ້ມູນສຳເລັດແລ້ວ':
            return 'green';
          case 'ການນຳສົ່ງບໍ່ສົມບູນ':
            return 'red';
          default:
            return 'black';
        }
      };
  
      // const getFullPath = (path: string) => {
      //   return `http://127.0.0.1:35729/media/${path}`;
      // };
      const getFullPath = (path: string) => `http://127.0.0.1:35729/${path}`;
  
  const getFileName = (path: string) => {
    const parts = path.split('/');
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
  