<template>
  <div>
    <v-container>
      <v-card class="bg-indigo-lighten-5 text-start">
        <div class="text-center">
          <p style="font-size: 20px" class="mt-10">ຄົ້ນຫານິຕິບຸກຄົນ</p>
        </div>

        <div class="d-flex justify-center mt-10">
          <v-col cols="12">
            <v-row>
              <v-col cols="12" md="3"></v-col>
              <v-col cols="12" md="6">
                <v-card class="mb-13">
                  <v-form @submit.prevent="submit" class="mt-7">
                    <v-container>
                      <div class="mt-1">
                        <label class="label text-grey-darken-2" for="idcompany">
                          <p>ລະຫັດວິສາຫະກິດ*</p>
                        </label>
                        <v-text-field
                          v-model="id2"
                          :rules="[ruleRequired]"
                          prepend-inner-icon="fluent:password-20-regular"
                          id="idcompany"
                          name="idcompany"
                          type="number"
                          placeholder="ປອ້ນລະຫັດວິສາຫະກິດ....."
                        />
                      </div>
                      <div class="mt-1">
                        <label class="label text-grey-darken-2" for="idLCIC">
                          <p>ລະຫັດ ຂສລ*</p>
                        </label>
                        <v-text-field
                          v-model="id1"
                          :rules="[ruleRequired]"
                          prepend-inner-icon="fluent:password-20-regular"
                          id="idLCIC"
                          name="idLCIC"
                          type="number"
                          placeholder="ປອ້ນລະຫັດ ຂສລ....."
                        />
                      </div>
                      <div class="mt-5">
                        <v-btn
                          type="submit"
                          block
                          min-height="44"
                          class="gradient primary"
                        >
                          ຄົ້ນຫາ
                        </v-btn>
                      </div>
                    </v-container>
                  </v-form>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </div>
        <div v-if="loading"><p>ກຳລັງໂຫຼດ.........</p></div>
      </v-card>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
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
const id1 = ref<string>("");
const id2 = ref<string>("");
const loading = ref<boolean>(false);

const ruleRequired = (v: any) => !!v || "Required.";

const submit = async () => {
  if (id1.value && id2.value) {
    loading.value = true;
    Swal.fire({
      title: "ກະລຸນາລໍຖ້າ",
      text: "ກຳລັງດາວໂຫຼດຂໍ້ມູນ...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch("http://127.0.0.1:35729/api/api/v1/enterprise-info/search/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          LCICID: id1.value,
          EnterpriseID: id2.value,
        }),
      });

      const data = await res.json();

      if (res.ok && data.length > 0) {
        Swal.close();
        // Redirect to the new data display page
        window.location.href = `/backend/datasearch?LCICID=${id1.value}&EnterpriseID=${id2.value}`;
      
      } else {
        Swal.fire({
          icon: "error",
          title: "ບໍ່ພົບຂໍ້ມູນ",
          text: "ຂໍອະໄພ, ບໍ່ພົບຂໍ້ມູນທີ່ຕ້ອງການ",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "ການດືງຂໍ້ມູນຜິດພາດ, ລອງໃໝ່ອີກຄັ້ງ",
        confirmButtonText: "ຕົກລົງ"
      });
    } finally {
      loading.value = false;
    }
  } else {
    Swal.fire({
      icon: "error",
      title: "ເກີດຂໍ້ຜິດພາດໃນການຄົ້ນຫາ",
      text: "ກາລຸນາໃສ່ ID ໃຫ້ຄົບທັງສອງ ID.",
      confirmButtonText: "ຕົກລົງ"
    });
  }
};
</script>

<style scoped>
input {
  margin: 5px;
}

button {
  margin: 10px;
}

h2 {
  margin-top: 20px;
}
</style>
