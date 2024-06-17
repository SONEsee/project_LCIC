<template>
  <div>
    <v-container>
      <v-card class="bg-indigo-lighten-5 text-start">
        <div class="text-center">
          <p style="font-size: 20px" class="mt-10">ລາຍລະອຽດນິຕິບຸກຄົນ</p>
        </div>
        <div v-if="loading"><p>ກຳລັງໂຫຼດ.........</p></div>
        <div v-else>
          <div v-if="data && data.length">
            <div v-for="item in data" :key="item.LCICID">
              <p><strong>ລະຫັດ ຂສລ:</strong> {{ item.LCICID }}</p>
              <p>
                <strong>ຊື່ວິສາຫະກິດ (ລາວ):</strong>
                {{ item.enterpriseNameLao }}
              </p>
              <p>
                <strong>ຊື່ວິສາຫະກິດ (ອັງກິດ):</strong>
                {{ item.eneterpriseNameEnglish }}
              </p>
              <!-- Add other fields here -->
            </div>
          </div>
          <div v-else>
            <p>ບໍ່ພົບຂໍ້ມູນ</p>
          </div>
        </div>
      </v-card>
    </v-container>
  </div>
  <div>
    <v-container>
      <v-card class="bg-indigo-lighten-5 text-start">
        <div class="text-center">
          <p style="font-size: 20px" class="mt-10">ລາຍລະອຽດນິຕິບຸກຄົນ</p>
        </div>
        <div v-if="loading"><p>ກຳລັງໂຫຼດ.........</p></div>
        <div v-else>
          <div v-if="data && data.length">
            <!-- <div v-for="item in data" :key="item.LCICID">
              <p><strong>ລະຫັດ ຂສລ:</strong> {{ item.LCICID }}</p>
              <p><strong>ຊື່ວິສາຫະກິດ (ລາວ):</strong> {{ item.enterpriseNameLao }}</p>
              <p><strong>ຊື່ວິສາຫະກິດ (ອັງກິດ):</strong> {{ item.eneterpriseNameEnglish }}</p>
             
            </div> -->
            <v-col cols="12">
              <v-row>
                <v-col cols="12" md="6"
                  ><h1>ລາຍການລູກຄ້າທີ່ໄດ້ຜ່ານການສອບຖາມ:</h1></v-col
                >
                <v-col
                  cols="12"
                  md="6"
                  v-for="item in data"
                  :key="item.LCICID"
                  class="text-end mt-3 mp-3"
                  ><p class="text-red">
                    ລະຫັດວິສາຫະກິດ:
                    <b class="ml-1 mr-3" style="color: black">{{
                      item.EnterpriseID
                    }}</b>
                    ລະຫັດຂສລ:
                    <b class="ml-1 mr-3" style="color: black">{{
                      item.LCICID
                    }}</b>
                  </p></v-col
                >
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
                <tr v-for="item in data" :key="item.LCICID">
                  <td>
                    <p>{{ item.EnterpriseID }}</p>
                  </td>
                  <!-- console.log(item.enLocation) -->
                  <td>
                    <p>{{ item.enterpriseNameLao }}</p>
                  </td>
                  <td>
                    <p>{{ item.eneterpriseNameEnglish }}</p>
                  </td>

                  <td>
                    <p>{{ item.enLocation }}</p>
                  </td>
                  <td>
                    <p>{{ item.enLocation }}</p>
                  </td>
                  <td>
                    <p>{{ item.investmentAmount }}</p>
                  </td>
                  <td>
                    <p>{{ item.foreigninvestorFlag }}</p>
                  </td>
                  <td>
                    <p>{{ item.enLegalStrature }}</p>
                  </td>
                  <td><v-btn class="bg-light-blue-darken-4"> ເລືອກ </v-btn></td>
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
      content: "Report Nuxt 3,  IT Genius Engineering",
    },
  ],
});
const route = useRoute();
const data = ref([]);
const loading = ref(true);

const fetchData = async () => {
  const { LCICID, EnterpriseID } = route.query;

  try {
    const res = await fetch(
      "http://127.0.0.1:35729/api/api/v1/enterprise-info/search/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          LCICID: LCICID,
          EnterpriseID: EnterpriseID,
        }),
      }
    );

    const result = await res.json();

    if (res.ok) {
      data.value = result;
    } else {
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
      text: "ເກີດຂໍ້ຜິດພາດໃນການດືງຂໍ້ມູນ, ລອງໃໝ່ອີກຄັ້ງ",
      confirmButtonText: "ຕົກລົງ",
    });
  } finally {
    loading.value = false;
  }
};

onMounted(fetchData);
</script>
