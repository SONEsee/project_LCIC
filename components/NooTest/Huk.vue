<template>
    <v-data-table
      :headers="headers"
      :items="items"
      item-key="id"
      items-per-page="10"
      :loading="loading"
      no-data-text="ไม่พบข้อมูล"
    ></v-data-table>
  </template>
  
  <script lang="ts">
  import { defineComponent } from "vue";
  import axios from "axios";
  
  interface Item {
    id: number;
    filename: string;
    image: string;
    pathfile: string;
    status: string;
    user: string;
  }
  
  interface Header {
    text: string;
    value: string;
  }
  
  export default defineComponent({
    data() {
      return {
        items: [] as Item[],
        headers: [
          { title: "ດຳລັບ", value: "id" },
          { title: "ຊື່ໄຟລ໌", value: "filename" },
          { title: "ພາສ", value: "pathfile" },
          { title: "ສະຖານະ", value: "status" },
          { title: "ຜູ້ໃຊ້", value: "user" },
        ] as Header[],
        loading: false as boolean,
        errorMessage: "" as string,
      };
    },
    mounted() {
      this.fetchData();
    },
    methods: {
      async fetchData(): Promise<void> {
        this.loading = true;
        this.errorMessage = "";
  
        try {
          const config = useRuntimeConfig();
          const response = await axios.get(
            `${config.public.strapi.url}api/api/get_collaterals/`
          );
          this.items = response.data as Item[];
        } catch (error: any) {
          this.errorMessage =
            "ไม่สามารถดึงข้อมูลได้: " + (error.message || "Unknown error");
        } finally {
          this.loading = false;
        }
      },
    },
  });
  </script>
  
  <style>
  .error {
    color: red;
    font-weight: bold;
  }
  </style>
  