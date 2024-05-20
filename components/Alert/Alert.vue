<template>
  <v-col cols="12">
    <v-banner class="text-center bg-indigo-lighten-5 d-flex justify-center">
      <template v-slot:actions>
        <v-dialog
          v-model="dialog"
          max-width="800"
          class="text-center bg-indigo-lighten-5"
        >
          <template v-slot:activator="{ props }">
            <v-btn
              class="text-none bg-light-blue-darken-4"
              width="200"
              variant="outlined"
              v-bind="props"
            >
              ໄປຕໍ່
            </v-btn>
          </template>

          <v-card class="d-flex justify-end">
            <v-card-text class="bg-indigo-lighten-5 d-flex justify-center">
              <v-list-subheader class="text-high-emphasis">
                <div class="d-flex justify-center">
                  <v-icon
                    icon="mdi-alert-outline"
                    style="font-size: 90px"
                    color="#FF6F00"
                  ></v-icon>
                </div>
                <div class="text-center mt-6">
                  <p style="font-size: 130%">
                    ທ່ານຕອ້ງການສະແດງ ບົດລາຍງານນີ້ ຫຼື ບໍ່?...
                  </p>
                </div>
                <div style="font-size: 150%" class="mt-8 text-start">
                  <p>ລາຍລະອຽດບົດລາຍງານ</p>
                </div>
                <div style="font-size: 100%">
                  <v-container>
                    <v-col cols="12">
                      <v-row class="text-start" style="font-size: 140%">
                        <v-col cols="6">ຊື່ພາສາລາວ</v-col>
                        <v-col cols="6"
                          >ບໍລິສັດແດນ ຂຸດຄົ້ນຫີນກໍ່ສ້າງ ຈຳກັດຜູ້ດຽວ</v-col
                        >
                        <v-col cols="6">ຊື່ອັງກິດ</v-col>
                        <v-col cols="6">DENGXIN STONE MINING SOLECO.,LTD</v-col>
                        <v-col cols="6">ປະເພດບົດລາຍງານ</v-col>
                        <v-col cols="6"
                          >ບົດລາຍງານສີນເຊື່ອຄົບຖວ້ນ ນິຕິບຸກຄົນ</v-col
                        >
                      </v-row>
                    </v-col></v-container
                  >
                </div>
              </v-list-subheader>
            </v-card-text>

            <v-card-actions class="justify-center px-6 py-3">
              <v-btn
                class="flex-grow-1 text-none bg-deep-orange-accent-4 mr-3"
                variant="plain"
                @click="dialog = false"
              >
                ຍົກເລີກ
              </v-btn>

              <v-btn
                class="text-white flex-grow-1 text-none"
                color="blue-darken-4"
                variant="flat"
                @click="dialog = false"
                to="/backend/reportcompany"
              >
                ຢືນຢັນ
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-btn
          width="200"
          class="text-none ms-4 text-white bg-blue-grey-darken-4"
          variant="flat"
        >
          ກັບຄືນ
        </v-btn>
      </template>
    </v-banner></v-col
  >
</template>
<script>
export default {
  data: () => ({
    dialog: false,
    advertising: true,
    performance: true,
  }),
};
</script>
