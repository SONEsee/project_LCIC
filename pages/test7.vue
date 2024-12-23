<template>
  <div>
    <v-col>
      <v-row>
        <v-col cols="12" md="5"
          ><v-file-input
            type="file"
            accept=".json"
            @change="handleFileUpload"
            variant="outlined"
            density="compact"
            width="100%"
        /></v-col>
        <v-col cols="12" md="1"
          ><v-btn @click="uploadFile" class="bg-primary">ອັບໂຫຼດ</v-btn></v-col
        >
      </v-row>
    </v-col>
    <div v-if="isloading" class="d-flex justify-center align-center">
      <p>ກຳລັງໂຫຼດ....</p>
    </div>
    <div v-if="error">ເກິດຂໍ້ຜິດພາດບໍ່ສາມາດດຶງຂໍ້ມູນໄດ້</div>
    <div v-else>
      <v-data-table
        :items="dataget"
        item-key="name"
        items-per-page="10"
        :headers="header"
      >
        <template v-slot:item.total="{ item }">
          <v-chip color="primary" text-color="white">{{
            Number(item.searchtrue) + Number(item.searchfals)
          }}</v-chip>
        </template>
        <template v-slot:item.index="{ index, item }">
          <p>{{ item.index }}</p>
        </template>
        <template v-slot:item.searchtrue="{ item }">
          <a :href="`/test5?id=${item.id}`">
            <v-chip color="success" text-color="white">{{
              item.searchtrue
            }}</v-chip></a
          >
        </template>
        <template v-slot:item.searchfals="{ item }">
  <a :href="`/test6?id=${item.id}`">
    <v-chip color="error" text-color="white">{{
      item.searchfals
    }}</v-chip>
  </a>
</template>


      </v-data-table>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from "vue";

export default {
  setup() {
    const dataget = ref<any[]>([]);
    const isloading = ref<boolean>(false);
    const error = ref<string | null>(null);
    const datafetch = async () => {
      isloading.value = true;
      error.value = null;
      try {
        const config = useRuntimeConfig();
        const respons = await fetch(
          `${config.public.strapi.url}api/api/search-files/`
        );
        if (!respons.ok) {
          throw new Error(`Error:${respons.statusText}`);
        }
        dataget.value = await respons.json();
      } catch (err: unknown) {
        error.value =
          err instanceof Error ? err.message : "An unexpected error occurred";
      } finally {
        isloading.value = false;
      }
    };
    onMounted(datafetch);

    const file = ref<File | null>(null);
    const results = ref<any[]>([]);
    const header = ref([
      { title: "ລຳດັບ", value: "id" },
      { title: "ມື້ສົ່ງ", value: "insertDate" },
      { title: "ຊື່ຟາຍ", value: "fileName" },
      { title: "ຈຳນວນຄົ້ນຫາທັງໝົດ", value: "total" },
      { title: "ຄົ້ນຫາພົບ", value: "searchtrue" },
      { title: "ຄົ້ນຫາບໍ່ພົບ", value: "searchfals" },
    ]);

    const handleFileUpload = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.files?.length) {
        file.value = target.files[0];
      }
    };

    const uploadFile = async () => {
      if (!file.value) {
        alert("Please select a file first.");
        return;
      }

      const formData = new FormData();
      formData.append("file", file.value);

      try {
        const config = useRuntimeConfig();
        const response = await fetch(
          `${config.public.strapi.url}api/api/upload-json/`,
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await response.json();
        results.value = data.results || [];
      } catch (error) {
        console.error("Error uploading file:", error);
        alert("Upload failed. Please try again.");
      }
    };

    return {
      handleFileUpload,
      uploadFile,
      results,
      header,
      isloading,
      error,
      datafetch,
      dataget,
    };
  },
};
</script>
