


<template>
  <div >
    <v-container>
      <v-card class="bg-indigo-lighten-5 text-start ">
        <div class="text-center">
          <p style="font-size: 20px" class="mt-10">ລາຍລະອຽດນິຕິບຸກຄົນ</p>
        </div>
        <div v-if="loading"><p>ກຳລັງໂຫຼດ.........</p></div>
        <div v-else>
          <div v-if="data && data.length">
            <v-col cols="12">
              <v-row>
                <v-col cols="12" md="6">
                  <h1>ລາຍການລູກຄ້າທີ່ໄດ້ຜ່ານການສອບຖາມ: -----</h1>
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                  v-for="item in data"
                  :key="item.LCIC_code"
                  class="text-end mt-3 mp-3"
                >
                  <p class="text-red">ລະຫັດຂສລ:
                    <b class="ml-1 mr-3" style="color: black">{{ item.LCIC_code }}</b>
                    ລະຫັດວິສາຫະກິດ:
                    <b class="ml-1 mr-3" style="color: black">{{ item.EnterpriseID }}</b>
                
                  </p>
                </v-col>
              </v-row>
            </v-col>
            <v-table>
              <thead>
                <tr>
                  <th><p>ລະຫັດວິສາຫະກິດ</p></th>
                  <th><p>ຊື່ບໍລິສັດ(ພາສາລາວ)</p></th>
                  <th><p>ຊື່ບໍລິສັດ(ພາສາອັງກິດ)</p></th>
                  <th><p>ທີ່ຢູ່ເປັນພາສາອັງກິດ</p></th>
                  <th><p>ທີ່ຢູ່ເປັນ(ພາສາລາວ)</p></th>
                  <th><p>ທີ່ທໍາອິດຂອງຜູ້ຖືຮຸ້ນລາຍໃຫຍ່/ເຈົ້າຂອງບໍລິສັດ</p></th>
                  <th><p>ຜູ້ຈັດການທົ່ວໄປ</p></th>
                  <th><p>ໝາຍເລກໂທລະສັບ</p></th>
                  <th><p>ລາຍລະອຽດ</p></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in data" :key="item.LCIC_code">
                  <td><p>{{ item.EnterpriseID }}</p></td>
                  <td><p>{{ item.enterpriseNameLao }}</p></td>
                  <td><p>{{ item.eneterpriseNameEnglish }}</p></td>
                  <td><p>{{ item.enLocation }}</p></td>
                  <td><p>{{ item.enLocation }}</p></td>
                  <td><p>{{ item.investmentAmount }}</p></td>
                  <td><p>{{ item.foreigninvestorFlag }}</p></td>
                  <td><p>{{ item.enLegalStrature }}</p></td>
                  <td><v-btn class="bg-light-blue-darken-4" @click="showDetails(item)">ເລືອກ</v-btn></td>
                </tr>
              </tbody>
            </v-table>
          </div>
          <div v-else>
            <p>ບໍ່ພົບຂໍ້ມູນ</p>
          </div>
        </div>
      </v-card>
    </v-container>
    <v-container>
      <v-card>
        <div class="ml-2 mt-2">
          <h2>ປະເພດບົດລາຍງານ:</h2>
          <productinfo/>
        </div>
      </v-card>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import Swal from "sweetalert2";

definePageMeta({
  layout: "backend",
});

useHead({
  title: "Search",
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

const route = useRoute();
const data = ref([]);
const loading = ref(true);
const details = ref(false);
const catalogID = ref(route.query.CatalogID || '');


const fetchData = async () => {
  const { LCIC_code, EnterpriseID, CatalogID } = route.query;

  try {
    const config = useRuntimeConfig();
    const token = localStorage.getItem('access_token');
    const res = await fetch(`${config.public.strapi.url}api/api/v1/enterprise-info/search/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          LCIC_code: LCIC_code,
          EnterpriseID: EnterpriseID,
          CatalogID: CatalogID
        }),
      }
    );

    if (res.ok) {
      const result = await res.json();
      data.value = result;

     
    } else if (res.status === 401) {
     
      const config = useRuntimeConfig();
      const newToken = await refreshAccessToken();
      if (newToken) {
       
        const retryRes = await fetch(`${config.public.strapi.url}api/v1/enterprise-info/search/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${newToken}`,
            },
            body: JSON.stringify({
              LCIC_code: LCIC_code,
              EnterpriseID: EnterpriseID,
              CatalogID:CatalogID
            }),
          }
        );

        const result = await retryRes.json();
        if (retryRes.ok) {
          data.value = result;
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: result.error || "Error fetching data",
            confirmButtonText: "OK",
          });
        }
      }
    } else {
      const result = await res.json();
      Swal.fire({
        icon: "error",
        title: "Error",
        text: result.error || "Error fetching data",
        confirmButtonText: "OK",
      });
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "An error occurred while fetching data. Please try again.",
      confirmButtonText: "OK",
    });
  } finally {
    loading.value = false;
  }
};


const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refresh_token');
  if (!refreshToken) {
    Swal.fire({
      icon: "error",
      title: "Session Expired",
      text: "Your session has expired. Please log in again.",
      confirmButtonText: "OK",
    });
    window.location.href = '/'; 
    return;
  }

  try {
    const config = useRuntimeConfig();
    const response = await fetch(`${config.public.strapi.url}api/token/refresh/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      
      localStorage.setItem('access_token', data.access);
      Swal.fire({
        icon: "success",
        title: "Session Extended",
        text: "Your session has been refreshed.",
        confirmButtonText: "OK",
      });
      
      window.location.href = '/backend/dashboard'; 
      return data.access; 
    } else {
      
      Swal.fire({
        icon: "error",
        title: "Session Expired",
        text: "Your session has expired. Please log in again.",
        confirmButtonText: "OK",
      });
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/'; 
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "An error occurred while refreshing the token.",
      confirmButtonText: "OK",
    });
  }
};

const showDetails = (item: any) => {
  const { LCIC_code, EnterpriseID, CatalogID } = route.query;
  Swal.fire({
    icon: "info",
    iconColor:'blue',
    text: "ທ່ານຕ້ອງການດຳເນີນການຕໍ່ບໍ?",
    showCancelButton: true,
    confirmButtonColor: "#004D40", 
    confirmButtonText: "ຢືນຢັນ",
    cancelButtonColor: "#d33", 
    cancelButtonText: "ຍົກເລີກ",
    background: "#80D8FF", 
    color: "black", 
    title: `<strong>ທ່ານຕອ້ງການບົດລາຍງານນີ້ແທ້ບໍ?</strong>`,
    htຍml: `
      <div>
        <p><strong>ຊື່ບໍລິສັດພາສາລາວ:</strong> ${item.enterpriseNameLao}</p>
        <p><strong>ຊື່ບໍລິສັດພາສາອັງກິດ:</strong> ${item.eneterpriseNameEnglish}</p>
       
      </div>
    `,
    preConfirm: () => {
      return new Promise((resolve) => {
        resolve(true);
      });
    }
  }).then((result) => {
    if (result.isConfirmed) {
     
      console.log("Item details:", item);
      console.log("CatalogID:", item.CatalogID); 
      insertSearchLog(item).then(() => {
        
        const printUrl = `../backend/reportprint1?EnterpriseID=${item.EnterpriseID}&LCIC_code=${item.LCIC_code}&CatalogID=${CatalogID}`;
        window.location.href = printUrl;
      }).catch(error => {
        console.error("Error inserting search log:", error);
      });
    }
  });
};


const insertSearchLog = async (item: any) => {
  try {
    const { LCIC_code, EnterpriseID, CatalogID } = route.query;
    const token = localStorage.getItem('access_token');
    const config = useRuntimeConfig();
    const response = await fetch(`${config.public.strapi.url}api/insert_searchlog/`, { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        EnterpriseID: item.EnterpriseID,
        LCIC_code: item.LCIC_code,
        CatalogID:CatalogID
        
      })
    });

    if (!response.ok) {
      throw new Error('Failed to insert search log');
    }

    const data = await response.json();
    console.log('Search log inserted:', data);
  } catch (error) {
    console.error('Error inserting search log:', error);
  }
};

onMounted(fetchData);
</script>

