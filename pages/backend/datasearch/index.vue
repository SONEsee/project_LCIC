—
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
  <div style="height: 600px;" class="d-flex align-center">
    <v-container>

      <v-card class="bg-indigo-lighten-5 text-start ">
        <div class="text-center">
          <p style="font-size: 20px" class="mt-10">ຄົ້ນຫານິຕິບຸກຄົນ</p>
        </div>

        <div class="d-flex justify-center mt-10">
          <v-col cols="12">
            <v-row>
              <v-col cols="12" md="auto">
                <div style="font-size: 18px;">
                  <b> ລາຍການທີ່ຄົ້ນຫາໄດ້ດັ່ງນີ້:</b> 
                </div>
                <div class="text-end">
                  <p>
                    <b style="color: red">ລະຫັດວິສາຫະກິດ:</b
                    ><b class="mr-3 ml-2">300002125</b
                    ><b style="color: red">ລະຫັດ ຂສລ:</b
                    ><b class="mr-3 ml-2">1750</b>
                  </p>
                </div>
                <v-card width="" class="mb-16">
                  <v-table>
                    <thead style="font-size: 70%">
                      <tr>
                        <th>ຊື່ບໍລິສັດ(ພາສາລາວ)</th>
                        <th>ຊື່ບໍລິສັດ(ພາສາອັງກິດ)</th>
                        <th>ລະຫັດວິສາຫະກິດ</th>
                        <th>ທີ່ຢູ່ເປັນ(ພາສາອັງກິດ)</th>
                        <th>ທີ່ຢູ່ເປັນ(ພາສາລາວ)</th>
                        <th>ຜູຖືຫຸ້ນລາຍໄຫ່ຍ/ເຈົ້າຂອງບໍລິສັດ</th>
                        <th>ຜູ້ຈັດການທົວໄປ</th>
                        <th>ໝາຍເລກໂທລະສັບ</th>
                        <th>ລາຍລະອຽດ</th>
                      </tr>
                    </thead>
                    <tbody style="font-size: 60%">
                      <tr>
                        <td>ບໍລິສັດ ແດນຊິນ ຄຸດຄົ້ນກໍ່ສ້າງ ຈຳກັດຜູ້ດຽວ</td>
                        <td>DENGXIN STONE MINING.SOLE.CO.,LTD</td>
                        <td>300002125</td>
                        <td>MI YING</td>
                        <td>MI YING</td>
                        <td>MI YING</td>
                        <td>MI YING</td>
                        <td>020 2299488</td>
                        <td>
                        <nuxt-link to="../backend/reportsearch"><v-btn class="bg-light-blue-darken-4">ເລືອກ</v-btn></nuxt-link>  
                        </td>
                      </tr>
                    </tbody>
                  </v-table>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </div>
      </v-card>
    </v-container>
  </div>
</template>

<style scoped></style>

<!-- <script setup lang="ts">
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

// sweetalert2
const { $swal } = useNuxtApp();

// create const for useCookie()
const token = useCookie("token", {
  maxAge: 60 * 60, // 1 hour
  // expires: new Date(Date.now() + 60 * 60 * 24 * 7), // 1 week
});

// ref const for email and password
const email = ref("");
const password = ref("");

// useFormRules() for email and password
const { ruleEmail, rulePassLen, ruleRequired } = useFormRules();

// useRoute() for redirect
const router = useRouter();

// submit form
const submit = async () => {
  // console.log(ruleEmail(email.value))

  // check form is valid
  if (
    ruleRequired(email.value) == true &&
    ruleEmail(email.value) == true &&
    rulePassLen(password.value) == true
  ) {
    // console.log(email.value, password.value)

    // useRuntimeConfig() for get env
    const config = useRuntimeConfig();
    const STRAPI_URL: string = config.strapi.url;

    // login strapi with usefetch()
    const { data, error } = await useFetch(`${STRAPI_URL}/auth/local`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        identifier: email.value,
        password: password.value,
      }),
    });

    // check error
    if (error.value != null) {
      // error

      if (error.value.status === 400) {
        // console.log('Login failed! Please check your email and password.')
        $swal.fire({
          icon: "error",
          title: "ເຂົ້າສູ່ລະບົບລົ້ມເຫລວ",
          text: "ກະລຸນາກວດເບິ່ງອີເມວ ແລະລະຫັດຜ່ານຂອງທ່ານ.",
          confirmButtonText: "ປິດໜ້າຕ່າງ",
        });
      } else {
        console.log("Request failed:", error.value.message);
      }
    } else {
      // success

      let timerInterval: any;
      $swal
        .fire({
          title: "ເຂົ້າສູ່ລະບົບ",
          html: "ກະລຸນາລໍຖ້າຈັກໜ່ອຍ <b></b> ວິນາທີ",
          timer: 3000,
          timerProgressBar: true,
          didOpen: () => {
            $swal.showLoading();
            timerInterval = setInterval(() => {
              const content = $swal.getHtmlContainer();
              if (content) {
                const b = content.querySelector("b");
                if (b) {
                  b.textContent = $swal.getTimerLeft() / 1000;
                }
              }
            }, 100);
          },
          willClose: () => {
            clearInterval(timerInterval);
          },
        })
        .then(async (result: any) => {
          if (result.dismiss === $swal.DismissReason.timer) {
            // set token to cookie
            token.value = (data as { value: { jwt: string } }).value.jwt;

            // redirect to dashboard
            await router.push({ path: "/backend/dashboard" });
          }
        });
    }
  }
};
</script>

<template>
  <VContainer fluid class="fill-height pa-0">
    <v-card>
      <VRow no-gutters align="center" justify="center" class="fill-height">
        <VCol cols="12" md="6" lg="6" sm="6">
          <VRow no-gutters align="center" justify="center">
            <VCol cols="12" md="112" class="pa-8">
              <h1>ບຸກຄົນ</h1>

              <VForm @submit.prevent="submit" class="mt-7">
                <div class="mt-1">
                  <label class="label text-grey-darken-2" for="email"
                    ><p>ລະຫັດວິສາຫະກິດ</p></label
                  >
                  <VTextField
                    v-model="email"
                    :rules="[ruleRequired, ruleEmail]"
                    prepend-inner-icon="fluent:mail-24-regular"
                    id="email"
                    name="email"
                    type="email"
                  />
                </div>
                <div class="mt-1">
                  <label class="label text-grey-darken-2" for="password"
                    >Password</label
                  >
                  <VTextField
                    v-model="password"
                    :rules="[ruleRequired, rulePassLen]"
                    prepend-inner-icon="fluent:password-20-regular"
                    id="password"
                    name="password"
                    type="password"
                  />
                </div>
                <div class="mt-5">
                  <VBtn
                    type="submit"
                    block
                    min-height="44"
                    class="gradient primary"
                    >ຄົ້ນຫາ</VBtn
                  >
                </div>
              </VForm>
            </VCol>
          </VRow>
        </VCol>
      </VRow></v-card
    >
  </VContainer>
</template>

<style scoped></style> -->
