
<template>
  <section class="pa-3" id="main-content">
    <div>
      <v-btn class="button" to="../backend/searchuser">
        <v-icon icon="mdi-arrow-left" style="font-size: 150%;"></v-icon>
      </v-btn>
    </div>
    <div class="text-end mt-5 button">
      <v-btn @click="print" class="bg-indigo-accent-4"
        ><v-icon icon="mdi-printer-outline"></v-icon> ພີມ</v-btn
      >
    </div>

    <div>
      <v-container>
        <v-col cols="12">
          <v-row>
            <v-col cols="6">
              <v-row>
                <v-col cols="2">
                  <div class="d-flex align-center mt-2">
                    <v-img
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQguq0YjU42M_ijrBwnE9IpgFAFeMZQCDDJVi3yrfOCog&s"
                      width="100"
                    ></v-img></div
                ></v-col>
                <v-col cols="10">
                  <div class="mt- " style="font-size: 16px">
                    <p>ບໍລິສັດ ຂໍ້ມູນຂ່າວສານສິນເຊືອ ແຫ່ງ ສປປລາວ</p>
                    <v-progress-linear
                      color="#212121"
                      :model-value="60"
                      rounded
                    ></v-progress-linear>
                    <p>Lao Credit Information Company</p>
                  </div>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12">
              <div
                class="text-center bg-indigo-accent-4"
                style="border-radius: 4px"
              >
                <p>ບົດລາຍງານສິນເຊືອຄົຍຖວ້ນ(ນິຕິບຸກຄົນ)</p>
              </div>

              <v-row class="mt-4" style="font-size: 80%">
                <v-col cols="6">
                  <p class="">
                    <v-row>
                      <v-col cols="5">
                        <p><b>ອ້າງອີງການສອບຖາມ:</b></p>
                      </v-col>
                      <v-col cols="7">
                        <p>FCRFI-0-1-200623-9141739</p>
                      </v-col>
                    </v-row>
                  </p>

                  <p class="">
                    <v-row>
                      <v-col cols="5">
                        <p><b>ລະຫັດວິສາຫະກິດ:</b></p>
                      </v-col>
                      <v-col cols="7">
                        <p>300002125</p>
                      </v-col>
                    </v-row>
                  </p>
                  <p class="">
                    <v-row>
                      <v-col cols="5">
                        <p><b>ລະຫັດ ຂສລ:</b></p>
                      </v-col>
                      <v-col cols="7">
                        <p>1750</p>
                      </v-col>
                    </v-row>
                  </p>
                  <p class="">
                    <v-row>
                      <v-col cols="5">
                        <p><b>ປະເພດຂໍ້ມູນ:</b></p>
                      </v-col>
                      <v-col cols="7">
                        <p>test</p>
                      </v-col>
                    </v-row>
                  </p>
                  <p class="">
                    <v-row>
                      <v-col cols="5">
                        <p><b>ປະເພດພະລິກຕະພັນ:</b></p>
                      </v-col>
                      <v-col cols="7">
                        <p>ບົດລາຍງານສິນເຊືອຄົຍຖວ້ນ ນິຕິບຸກຄົນ</p>
                      </v-col>
                    </v-row>
                  </p>
                </v-col>

                <v-col cols="6">
                  <p class="">
                    <v-row>
                      <v-col cols="5">
                        <p><b>ຂໍ້ມູນທີ່ຜ່ານມາ:</b></p>
                      </v-col>
                      <v-col cols="7">
                        <p>15</p>
                      </v-col>
                    </v-row>
                  </p>
                  <p class="">
                    <v-row>
                      <v-col cols="5">
                        <p><b>ຂໍ້ມູນທືີ່ຄົ້ນພົບ:</b></p>
                      </v-col>
                      <v-col cols="7">
                        <p>test</p>
                      </v-col>
                    </v-row>
                  </p>
                  <p class="">
                    <v-row>
                      <v-col cols="5">
                        <p><b>ຊື່ບໍລິສັດພາສາລາວ:</b></p>
                      </v-col>
                      <v-col cols="7">
                        <p>test</p>
                      </v-col>
                    </v-row>
                  </p>
                  <p class="">
                    <v-row>
                      <v-col cols="5">
                        <p><b>ຊື່ບໍລິສັດພາສາອັງກິດ:</b></p>
                      </v-col>
                      <v-col cols="7">
                        <p>test</p>
                      </v-col>
                    </v-row>
                  </p>
                  <p class="">
                    <v-row>
                      <v-col cols="5">
                        <p><b>ຊື່ບໍລິສັດພາສາອັງກິດ:</b></p>
                      </v-col>
                      <v-col cols="7">
                        <p>test</p>
                      </v-col>
                    </v-row>
                  </p>
                  <p class="">
                    <v-row>
                      <v-col cols="5">
                        <p><b>ຜູ້ຈັດການທົວໄປພາສາລາວ:</b></p>
                      </v-col>
                      <v-col cols="7">
                        <p>test</p>
                      </v-col>
                    </v-row>
                  </p>
                  <p class="">
                    <v-row>
                      <v-col cols="5">
                        <p><b>ຜູ້ຈັດການທົວໄປພາສາອັງກິດ:</b></p>
                      </v-col>
                      <v-col cols="7">
                        <p>test</p>
                      </v-col>
                    </v-row>
                  </p>
                  <p class="">
                    <v-row>
                      <v-col cols="5">
                        <p><b>ລະຫັດວິສາຫະກິດ:</b></p>
                      </v-col>
                      <v-col cols="7">
                        <p>1750</p>
                      </v-col>
                    </v-row>
                  </p>
                  <p class="">
                    <v-row>
                      <v-col cols="5">
                        <p><b>ປະເພດທຸລະກິດ:</b></p>
                      </v-col>
                      <v-col cols="7">
                        <p>test</p>
                      </v-col>
                    </v-row>
                  </p>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <div class="bg-indigo-accent-4" style="border-radius: 4px">
            <p class="ml-3">ລາຍລະອຽດຂອງຂໍ່ມູນທີ່ຜ່ານມາ</p>
          </div>
          <v-table style="font-size: 80%">
            <thead>
              <tr>
                <th><p>ຊື່ທະນາຄານ</p></th>
                <th><p>ຊື່ບໍລິສັດພາສາອັງກິດ</p></th>
                <th><p>ຊື່ບໍລິສັດພາສາລາວ</p></th>
                <th><p>ປະເພດຂໍ້ມູນ</p></th>
                <th><p>ປະເພດພະລິກຕະພັນ</p></th>
                <th><p>ວັນທີເດືອນປີ</p></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><p>#</p></td>
                <td><p>#</p></td>
                <td><p>#</p></td>
                <td><p>#</p></td>
                <td><p>#</p></td>
                <td><p>#</p></td>
              </tr>
            </tbody>
          </v-table>
          <div class="bg-indigo-accent-4" style="border-radius: 4px">
            <p class="ml-3">ລາຍລະອຽດກຽວກັບວົງເງິນກູ້</p>
          </div>
          <v-table style="font-size: 80%">
            <thead>
              <tr>
                <th><p>ສະມາຊິກ</p></th>
                <th><p>ລະຫັດຂອງເງິນກູ້</p></th>
                <th><p>ວັນທີເຊັນສັນຍາ</p></th>
                <th><p>ວົງເງິນອານຸມັດກູ້</p></th>
                <th><p>ຍອດເຫຼືອໜີ້</p></th>
                <th><p>ສະກຸນເງິນ</p></th>
                <th><p>ຈໍານວນທີ່ຊຳລະຊ້າ</p></th>
                <th><p>ປະຫວັດການຈັດຊັ້ນໜີ້ 12 ເດືອນນັບຈາກເດືອນປະຈຸບັນ</p></th>
                <th><p>ວັນທີລ່າສຸດ</p></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><p>#</p></td>
                <td><p>#</p></td>
                <td><p>#</p></td>
                <td><p>#</p></td>
                <td><p>#</p></td>
                <td><p>#</p></td>
                <td><p>#</p></td>
                <td><p>#</p></td>
                <td><p>#</p></td>
              </tr>
            </tbody>
          </v-table>
          <div class="bg-indigo-accent-4" style="border-radius: 4px">
            <p class="ml-3">ລາຍລະອຽດກຽວກັບວົງເງິນກູ້ຂອງ</p>
          </div>
          <v-table style="font-size: 80%">
            <thead>
              <tr>
                <th><p>ສະມາຊິກ</p></th>
                <th><p>ລະຫັດຂອງເງິນກູ້</p></th>
                <th><p>ວັນທີເຊັນສັນຍາ</p></th>
                <th><p>ວົງເງິນອານຸມັດກູ້</p></th>
                <th><p>ຍອດເຫຼືອໜີ້</p></th>
                <th><p>ສະກຸນເງິນ</p></th>
                <th><p>ຈໍານວນທີ່ຊຳລະຊ້າ</p></th>
                <th><p>ປະຫວັດການຈັດຊັ້ນໜີ້ 12 ເດືອນນັບຈາກເດືອນປະຈຸບັນ</p></th>
                <th><p>ວັນທີລ່າສຸດ</p></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><p>#</p></td>
                <td><p>#</p></td>
                <td><p>#</p></td>
                <td><p>#</p></td>
                <td><p>#</p></td>
                <td><p>#</p></td>
                <td><p>#</p></td>
                <td><p>#</p></td>
                <td><p>#</p></td>
              </tr>
            </tbody>
          </v-table>
          <div class="">
            <p style="font-size: 80%">
              ລະຫັດສິນເຊືຶອໄດ້ສະແດງໃຫ້ເຫັ່ນລາຍລະອຽດກ່ຽວກັບວົງເງິນກູ້ ແລະ
              ແນວໂນມການຊໍາລະ ຂອງທຸກສິນເຊື້ອ ແລະ ວົງເງິນກູ້
              ສະແດງໃຫ້ເຫັ່ນຈຳນວນທີ່ມືຊຳຳລະຊ້າ ແລະ ການຈັດປະເພດວົງເງິນກູ້ ແລະ
              ແນວໂນ້ມການຊຳລະໄລຍະເວລາ 12 ເດືອນຜ່ານມາ
            </p>
          </div>
          <div class="text-center mt-10">
            <p>
              *ໝາຍເຫດ: ຂໍ້ມູນນີ້ແມ່ນນໍາໃຊ້ໃນວຽກງານພິຈາລະນາສິນເຊື່ອເທົ່ານັ້ນ.
            </p>
          </div>
        </v-col>
      </v-container>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  methods: {
    print() {
      window.print();
    },
  },
});
</script>

<style scoped>
@page {
  size: A4 portrait;
  margin: 0;

  @bottom-center {
    width: 100%;
    content: element(footer);
  }
}

@media print {
  html,
  body {
    width: 210mm;
    height: 297mm;
    padding: 10px 15% 0 15%;
    background: fixed;
    background-image: fixed;
  }

  .main-content {
    width: 210mm;
    height: 297mm;
    padding: 10px 3% 0 3%;
  }

  .button {
    display: none;
  }
}
</style>
