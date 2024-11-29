<template>
    <v-container>
      <v-data-table :items="filteredItems" :headers="headers">
        <template v-slot:top>
          <v-text-field
            v-if="user && user.MID.id === '01'"
            density="compact"
            width="50%"
            v-model="search"
            class="pa-2"
            label="ໃສ່ລະຫັດທະນາຄານ"
          ></v-text-field>
        </template>
        <template v-slot:item="{ item }">
          <tr>
            <td>{{ item.id }}</td>
            <td>{{ item.user }}</td>
            <td>{{ item.filename }}</td>
            <td>{{ item.pathfile }}</td>
            <td>
              <template v-if="item.status === '1'">
                <!-- <v-btn small @click="confirmImage(item.id)" class="bg-success">
                  {{ $t("confirm") }}
                </v-btn> -->
                <p style="color: #e65100">ຍັງບໍ່ທັນກວດສອບ</p>
              </template>
              <template v-else>
                <p style="color: blue">ກວດສອບແລ້ວ</p>
              </template>
            </td>
            <td>
              <v-btn
                small
                @click="goToTest1(item.pathfile, item.id, item.status)"
                class="bg-indigo-darken-4"
              >
                {{ $t("saveenterprice") }}
              </v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-container>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, onMounted, computed } from "vue";
  import { useRouter } from "vue-router";
  import axios from "axios";
  import Swal from "sweetalert2";
  import { useI18n } from "vue-i18n";
  
  export default defineComponent({
    user: "SingleColumnSearchTable",
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
          { name: "keywords", content: "Report, Nuxt 3, Backend" },
          {
            name: "Description",
            content: "Report Nuxt 3, IT Genius Engineering",
          },
        ],
      });
  
      const { t } = useI18n();
      const router = useRouter();
      const collaterals = ref([]);
      const user = ref<User | null>(null);
      const headers = computed(() => [
        { title: t("no:") },
        { title: "ລະຫັດທະນາຄານ" },
        { title: t("imagename") },
        { title: t("imageaddress") },
        { title: t("confirm") },
        { title: t("detail") },
      ]);
  
      onMounted(() => {
        const userData = localStorage.getItem("user_data");
        if (userData) {
          try {
            user.value = JSON.parse(userData);
            console.log("User data:", user.value);
            const userID = user.value?.MID?.id;
            if (userID) fetchCollaterals(userID);
          } catch (error) {
            console.error("Error parsing user_data:", error);
          }
        } else {
          console.error("No user data found.");
        }
      });
  
      const fetchCollaterals = async (userID: string) => {
        try {
          const config = useRuntimeConfig();
          const response = await axios.get(
            `${config.public.strapi.url}api/api/get_collaterals/`
          );
  
          if (Array.isArray(response.data)) {
            if (userID === "01") {
              collaterals.value = response.data.filter(
                (collateral) => collateral.status === "1"
              );
            } else {
              collaterals.value = response.data.filter(
                (collateral) =>
                  collateral.status === "1" && collateral.user === userID
              );
            }
            console.log("Filtered collaterals:", collaterals.value);
          } else {
            console.error("Invalid response data format. Expected an array.");
          }
        } catch (error) {
          console.error(
            "Error fetching collaterals:",
            error.response ? error.response.data : error.message
          );
        }
      };
  
      const filteredItems = computed(() =>
        search.value
          ? collaterals.value.filter((item: any) =>
              item.user?.toLowerCase().includes(search.value.toLowerCase())
            )
          : collaterals.value
      );
  
      const goToTest1 = (imagePath: string, id: number, status: number) => {
        router.push({
          name: "formcollaterals",
          query: { image: imagePath, id: id, status: status },
        });
      };
  
      const confirmImage = async (id: number) => {
        try {
          const config = useRuntimeConfig();
          const csrfResponse = await axios.get(
            `${config.public.strapi.url}api/api/get_csrf_token/`
          );
          const csrfToken = csrfResponse.data.csrfToken;
  
          await axios.post(
            `${config.public.strapi.url}api/api/confirm_image/${id}/`,
            {},
            {
              headers: {
                "X-CSRFToken": csrfToken,
                "Content-Type": "application/json",
              },
            }
          );
  
          Swal.fire({
            title: "ເຮັດສຳເລັດ!",
            text: "ການຢືນຢັນຮູບພາບສຳເລັດແລ້ວ.",
            icon: "success",
            confirmButtonText: "OK",
          }).then(() => {
            const userID = user.value?.MID?.id;
            if (userID) fetchCollaterals(userID);
          });
        } catch (error) {
          console.error(
            "Error confirming image:",
            error.response ? error.response.data : error.message
          );
        }
      };
  
      return {
        collaterals,
        headers,
        goToTest1,
        confirmImage,
        user,
        filteredItems,
        search,
      };
    },
  });
  </script>
  