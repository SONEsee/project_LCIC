<template>
  <v-data-table-server
    v-model:items-per-page="itemsPerPage"
    :headers="headers"
    :items="data"
    :items-length="totalItems"
    :loading="loading"
    item-value="name"
    @update:options="loadItems"
  ></v-data-table-server>
  <div>
    <div v-if="error">
      <p>Error: {{ error }}</p>
    </div>
    <div v-else-if="data && data.length === 0">
      <p>No data available.</p>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue'
import Swal from 'sweetalert2'

definePageMeta({
  middleware: 'auth',
  layout: 'backend',
})

export default {
  setup() {
    const data = ref([])
    const error = ref(null)
    const loading = ref(false)
    const itemsPerPage = ref(10)
    const totalItems = ref(0)
    const apiUrl = `http://202.137.141.244:3000/v3/api/loans/allbillmonth/102024`
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6IlUyRnNkR1ZrWDErdE9ja29vVDV0NXdqWlBqTzhVc0V1ZnR2QytPUXp3Z2ljWkFPdkhNUkNqdzh0NUhOSENBRVZsVXVNWHBrc1RudUFxaUE3R0VtVExRSTZMaWNTVUlaN1BMb0xGOVczMWtjWnFoQmxFUThHVUFwSFpNS0NDVjN1RURhWDJSSjFwZDNqaFRGc2lmdUF3Zz09IiwiaWF0IjoxNzA5MDEwNjU0fQ.mhmfUuasPQnAtxTQmwIyofClMuOAKVKZloNskpG9fHo'
    const fetchData = async (page = 1, perPage = 10) => {
  loading.value = true
  try {
   
    const response = await fetch(`${apiUrl}?page=${page}&perPage=${perPage}`, {
      headers: {
        'Auth': `${token}`,
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`)
    }

  
    const jsonData = await response.json()
    data.value = jsonData.message || []
    totalItems.value = jsonData.totalItems || data.value.length 

<<<<<<< HEAD
    // onMounted(async () => {
    //   try {
    //     const response = await fetch('http://127.0.0.1:35729/api/api/upload-files2/');
    //     if (!response.ok) {
    //       throw new Error('Network response was not ok');
    //     }
    //     const data = await response.json();
    //     items.value = data.map((item: any) => ({
    //       ...item,
    //       FID: item.FID,
    //       status: 'ສຳເລັດການນຳສົ່ງຂໍ້ມູນ',
    //       confirmed: false,
    //     }));
    //   } catch (error) {
    //     console.error('Failed to fetch data:', error);
    //   }
    // });

    
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:35729/api/api/upload-files2/');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        items.value = data.map((item: any) => ({
          ...item,
          FID: item.FID,
          status: 'ສຳເລັດການນຳສົ່ງຂໍ້ມູນ',
          confirmed: false,
        }));
        sortItemsByUploadDate();
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
=======
    if (!data.value.length) {
      console.log("No items returned from API")
    }
  } catch (err) {
    error.value = err.message
    Swal.fire('Error', error.value, 'error')
  } finally {
    loading.value = false
  }
}

 
    onMounted(() => fetchData())
>>>>>>> 7a6a73f4385a12dae435ab5762d85d2ece83ccaa

   
    const loadItems = ({ page, itemsPerPage }) => {
      fetchData(page, itemsPerPage)
    }

<<<<<<< HEAD
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

        const response2 = await fetch('http://127.0.0.1:35729/api/api/upload-files2/');
        const data = await response2.json();
        items.value = data.map((item: any) => ({
          ...item,
          FID: item.FID,
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
      if (!item.FID) {
        Swal.fire({
          icon: 'error',
          title: 'ລົ້ມເຫລວ',
          text: 'ບໍມີຂໍ້ມູນທີ່ກົງກັບ FID ນີ້',
        });
        return;
      }

      try {
        const response = await axios.get('http://127.0.0.1:35729/api/api/productinfo3/', {
          params: {
            FID: item.FID,
          },
        });

        const data = response.data;
        router.push({ name: 'test5', query: { data: JSON.stringify(data) } });
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
            params.append('FID', item.FID);

            const response = await axios.post('http://127.0.0.1:35729/api/confirm_upload/', params);

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

      const response = await axios.post('http://127.0.0.1:35729/api/api/update-statussubmit/', `FID=${item.FID}`);

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
=======
    return { data, error, loading, itemsPerPage, totalItems, loadItems }
>>>>>>> 7a6a73f4385a12dae435ab5762d85d2ece83ccaa
  },
}
</script>

<style scoped>

</style>
