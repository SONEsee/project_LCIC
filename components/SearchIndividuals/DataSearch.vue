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
  <div>
    <v-container>
      <v-card class="bg-indigo-lighten-5 text-start">
        <div class="text-center">
          <p style="font-size: 20px" class="mt-10">ຄົ້ນຫານິຕິບຸກຄົນ</p>
        </div>

        <div class="d-flex justify-center mt-10">
          <v-col cols="12">
            <v-row>
              <v-col cols="12" md="auto">
                <div style="font-size: 18px">
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
                  <v-table style="width: 2700px">
                    <thead style="font-size: 14px">
                      <tr>
                        <th>ປະເພດບົດລາຍງານ</th>
                        <th>ລາຍລະອຽດ</th>
                        <th class="text-end"><p>ຄ່າທຳນຽມ</p></th>
                      </tr>
                    </thead>
                    <tbody style="font-size: 12px">
                      <tr>
                        <td>ບໍລິສັດ ແດນຊິນ ຄຸດຄົ້ນກໍ່ສ້າງ ຈຳກັດຜູ້ດຽວ</td>
                        <td>DENGXIN STONE MINING.SOLE.CO.,LTD</td>
                        <td class="text-end" style="color: red">
                          <p>300002125</p>
                        </td>
                      </tr>
                    </tbody>
                  </v-table>
                </v-card>

                <div
                  class="text-center bg-indigo-lighten-5 d-flex align-center"
                >
                  <Alert />
                </div>
              </v-col>
            </v-row>
          </v-col>
        </div>
      </v-card>
    </v-container>
  </div>
</template>

<style scoped></style>
