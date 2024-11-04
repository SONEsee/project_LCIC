<script setup lang="ts">

    definePageMeta({
      layout: "backend",
<<<<<<< HEAD
      middleware: "auth",
=======
      middleware:["auth"]
>>>>>>> 7a6a73f4385a12dae435ab5762d85d2ece83ccaa
    });

    useHead({
      title: "image uplod",
      
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
<<<<<<< HEAD

    const files = ref<File[]>([]);
    const collaterals = ref([]);

    const uploadFiles = async () => {
      const formData = new FormData();

      files.value.forEach((file) => {
        formData.append("image", file);
      });

      try {
        const config = useRuntimeConfig();
        const response = await axios.post(
          `${config.public.strapi.url}api/api/upload_image/`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        console.log(response.data);
        await Swal.fire({
          title: "ສຳເລັດ!",
          text: "ອັບໂຫຼດຮູບພາບສຳເລັດແລ້ວ!",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          location.reload();
        });
        fetchCollaterals();
      } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        Swal.fire({
          title: "ຜິດພາດ!",
          text: error.response ? error.response.data : error.message,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    };

    const fetchCollaterals = async () => {
      try {
        const config = useRuntimeConfig();
        const response = await axios.get(
          `${config.public.strapi.url}api/api/get_collaterals/`
        );
        collaterals.value = response.data;
      } catch (error) {
        console.error(error.response ? error.response.data : error.message);
      }
    };

    const viewImage = (imagePath: string, id: string) => {
      const config = useRuntimeConfig();
      const fullPath = `${config.public.strapi.url}collaterals/${imagePath}?id=${id}`;
      window.open(fullPath, "_blank");
      console.log("id image", id);
    };

    const confirmImage = async (id: number) => {
      try {
        const config = useRuntimeConfig();
        const response = await axios.post(
          `${config.public.strapi.url}api/api/confirm_image/${id}/`
        );
        console.log(response.data);
        await Swal.fire({
          title: "ສຳເລັດ!",
          text: "ຢືນຢັນຮູບພາບສຳເລັດແລ້ວ!",
          icon: "success",
          confirmButtonText: "OK",
        });
        fetchCollaterals();
      } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        Swal.fire({
          title: "ຜິດພາດ!",
          text: error.response ? error.response.data : error.message,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    };

    onMounted(() => {
      fetchCollaterals();
    });

    return {
      files,
      uploadFiles,
      collaterals,
      viewImage,
      confirmImage,
    };
  },
});
=======
>>>>>>> 7a6a73f4385a12dae435ab5762d85d2ece83ccaa
</script>

<template>
<UploadFileUploadImage/>
</template>