<!-- —
<script setup lang="ts">
import { ref } from "vue";
import { format } from "date-fns";
import Swal from "sweetalert2";

const data = ref({
  radios: "one",
});

definePageMeta({
  layout: "backend",
});

useHead({
  title: "Report",
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
const date = ref(new Date());
const { $swal } = useNuxtApp();
const idcompany = ref("");
const idLCIC = ref("");
const { ruleidcompany, rulePassLen, ruleRequired } = useFormRules();
const submit = async () => {
  if (
    ruleRequired(idcompany.value) == true &&
    rulePassLen(idcompany.value) == true &&
    ruleidcompany(idLCIC.value) == true
  ) {
    const idcompany = "123456";
    const idLCIC = "123456";
    if (idcompany != null) {
      $swal.fire({
        icon: "error",
        title: "ການຄົ້ນຫາຂອງທ່ານລົ້ມເຫຼວ",
        text: "ກະລຸນາກວດເບິ່ງລະຫັດການຄົ້ນຫາຂອງທ່ານ",
        confirmButtonText: "ປິດໜ້າຕ່າງ",
      });
    }
    //   else {
    //     const
    //   }
  }
};
</script>

<template>
  <div>
    <v-container>
      <v-card class="bg-indigo-lighten-5 text-start">
        <div class="text-center">
          <p style="font-size: 20px" class="mt-10">ຄົ້ນຫາບຸກຄົນ</p>
        </div>

        <div class="d-flex justify-center mt-10">
          <v-col cols="12">
            <v-row>
              <v-col cols="12" md="3"></v-col>
              <v-col cols="12" md="6">
                <v-card width="" class="mb-13">
               
                  <VForm @submit.prevent="submit" class="mt-7">
                    <v-container>
                      <div class="mt-1">
                        <label class="label text-grey-darken-2" for="idcompany"
                          ><p>ເລກບັດປະຈຳໂຕ*</p></label
                        >
                        <VTextField
                          v-model="idcompany"
                          :rules="[ruleRequired]"
                          prepend-inner-icon="fluent:password-20-regular"
                          id="idcompany"
                          name="idcompany"
                          type="number"
                          placeholder="ປອ້ນລະຫັດວິສາຫະກິດ....."
                        />
                      </div>
                      <div class="mt-1">
                        <label class="label text-grey-darken-2" for="idLCIC"
                          ><p>ລະຫັດ ຂສລ*</p></label
                        >
                        <VTextField
                          v-model="idLCIC"
                          :rules="[ruleRequired]"
                          prepend-inner-icon="fluent:password-20-regular"
                          id="idLCIC"
                          name="idcompany"
                          type="number"
                          placeholder="ປອ້ນລະຫັດ ຂສລ....."
                        />
                      </div>
                      <div class="mt-5">
                        <VBtn
                          type="submit"
                          block
                          min-height="44"
                          class="gradient primary"
                          to="../backend/searchindividuals"
                          >ຄົ້ນຫາ</VBtn
                        >
                      </div>
                    </v-container></VForm
                  ></v-card
                >
              </v-col>
            </v-row>
          </v-col>
        </div>
      </v-card>
    </v-container>
  </div>
</template>

<style scoped></style>
 -->


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
                          v-model="id1"
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
                          v-model="id2"
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
definePageMeta({
  layout: "backend",
});
useHead({
  title: "Sign In",
  meta: [
    {
      name: "description",
      content: "Sign In Nuxt 3, IT Genius Engineering",
    },
    {
      name: "keywords",
      content: "Sign In, Nuxt 3, Learning Nuxt 3",
    },
  ],
});

import { ref } from "vue";
import Swal from "sweetalert2";

const id1 = ref<string>("");
const id2 = ref<string>("");
const result1 = ref<any>(null);
const result2 = ref<any>(null);
const loading = ref<boolean>(false);

const search = async () => {
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
    const [res1, res2] = await Promise.all([
      fetch(`http://localhost:3000/api/v1/report/${id1.value}`).then((res) => res.json()),
      fetch(`http://localhost:3000/api/v1/report/${id2.value}`).then((res) => res.json()),
    ]);
    result1.value = res1;
    result2.value = res2;
    Swal.close();
  } catch (error) {
    console.error("Error fetching data: " + error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "There was an error fetching the data.",
      confirmButtonText: "OK"
    });
  } finally {
    loading.value = false;
  }
};

const ruleRequired = (v: any) => !!v || "Required.";

const submit = async () => {
  if (id1.value && id2.value) {
    await search();
    if (result1.value && result2.value) {
      // Redirect if data is successfully fetched
      window.location.href = "../backend/datasearch";
    }
  } else {
    Swal.fire({
      icon: "error",
      title: "ເກີດຂໍ້ຜິດພາດໃນການຄົ້ນຫາ",
      text: "ກາລຸນາໃສ່ ID ໃຫ້ຄົບທັງສອງ.",
      confirmButtonText: "OK"
    });
  }
}
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
