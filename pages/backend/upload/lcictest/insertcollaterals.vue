<!-- <template>
  <v-container>
    <v-data-table :items="collaterals" :headers="headers">
      <template v-slot:item="{ item }">
        <tr>
          <td>{{ item.id }}</td>
          <td>{{ item.filename }}</td>
          <td>{{ item.pathfile }}</td>
          <td>
            <v-btn
              small
              @click="confirmImage(item.id)"
              class="bg-success"
            >
              ຢືນຢັນ
            </v-btn>
          </td>
          <td>
            <v-btn
              small
              @click="goToTest1(item.pathfile)"
              class="bg-indigo-darken-4"
            >
              ເບິ່ງຮູບພາບອັບໂຫຼດ
            </v-btn>
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useRouter } from 'vue-router';
import axios from "axios";
import Cookies from 'js-cookie';

export default defineComponent({
  setup() {
    const router = useRouter();
    const collaterals = ref([]);
    const headers = ref([
      { text: "ລຳດັບ", value: "id" },
      { text: "ຊື່ຮູບພາບ", value: "filename" },
      { text: "ທີ່ຢູ່ຮູບພາບ", value: "pathfile" },
      { text: "ຢືນຢັນ", value: "confirm" },
      { text: "ລາຍລະອຽດ", value: "actions" },
    ]);

    const fetchCollaterals = async () => {
      try {
        const response = await axios.get(
          "http://192.168.45.56:8000/api/api/get_collaterals/"
        );
        collaterals.value = response.data;
      } catch (error) {
        console.error(error.response ? error.response.data : error.message);
      }
    };

    const goToTest1 = (imagePath: string) => {
      router.push({ name: 'test', query: { image: imagePath } });
    };




    
    const confirmImage = async (id: number) => {
  try {
    // Fetch CSRF token
    const csrfResponse = await axios.get('http://192.168.45.56:8000/api/api/get_csrf_token/');
    const csrfToken = csrfResponse.data.csrfToken;

    // Send POST request with CSRF token
    await axios.post(
      `http://192.168.45.56:8000/api/api/confirm_image/${id}/`,
      {},
      {
        headers: {
          'X-CSRFToken': csrfToken,
          'Content-Type': 'application/json',
        },
      }
    );

    await fetchCollaterals(); // Fetch the updated collaterals after confirming
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
  }
};


    onMounted(() => {
      fetchCollaterals();
    });

    return {
      collaterals,
      headers,
      goToTest1,
      confirmImage,
    };
  },
});
</script> -->

<template>
  <v-container>
    <v-data-table :items="collaterals" :header="headers">
      <template v-slot:item="{ item }">
        <tr>
          <td>{{ item.id }}</td>
          <td>{{ item.filename }}</td>
          <td>{{ item.pathfile }}</td>

          <td>
            <v-btn
              small
              @click="goToTest1(item.pathfile, item.id)"
              class="bg-indigo-darken-4"
            >
         ສາຫະກິດ
            </v-btn>
          </td>
          <td>
            <!-- <v-btn small @click="confirmImage(item.id)" class="bg-success">
              ຢືນຢັນ
            </v-btn> -->
            <P style="color: blue;">ຍັງບໍ່ທັນກວດສອບ</P>
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import Swal from "sweetalert2"; 

export default defineComponent({
  setup() {
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

    const router = useRouter();
    const collaterals = ref([]);
    const headers = ref([
      { text: "ລຳດັບ", value: "id" },
      { text: "ຊື່ຮູບພາບ", value: "filename" },
      { text: "ທີ່ຢູ່ຮູບພາບ", value: "pathfile" },
      { text: "ຢືນຢັນ", value: "confirm" },
      { text: "ລາຍລະອຽດ", value: "actions" },
    ]);

    const fetchCollaterals = async () => {
  try {
    const config = useRuntimeConfig();
    const response = await axios.get(
      `${config.public.strapi.url}api/api/get_collaterals/`
    );

    console.log(response.data); 

    // ກອງຂໍ້ມູນຕາມ status
    collaterals.value = response.data.filter(collateral => collateral.status === '1');
    console.log(collaterals.value);

  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
  }
  console.log("status = 1", collaterals.value);
};


    const goToTest1 = (imagePath: string, id: number, status: number) => {
      router.push({
        name: "formcollaterals",
        query: { image: imagePath, id: Number(id), status: Number(status) },
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
          fetchCollaterals();
        });
      } catch (error) {
        console.error(error.response ? error.response.data : error.message);
      }
    };

    onMounted(() => {
      fetchCollaterals();
    });

    return {
      collaterals,
      headers,
      goToTest1,
      confirmImage,
    };
  },
});
</script>
