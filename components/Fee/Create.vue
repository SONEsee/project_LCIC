<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useFeesStore } from "~/stores/fee";
import Swal from "sweetalert2";
const feecreate = useFeesStore();
const valid = ref(false);
const form = ref<HTMLFormElement | null>(null);

const req = feecreate.form_create_data;
const reset = async () => {
  req.chg_code = "";
  req.chg_lao_type = "";
  req.chg_type = "";
  req.chg_desc = "";
  req.chg_lao_desc = "";
  req.chg_amount = 0;
  req.chg_unit = "";
};

const Submit = async () => {
  if (
    !req.chg_code ||
    !req.chg_lao_type ||
    !req.chg_type ||
    !req.chg_desc ||
    !req.chg_lao_desc ||
    !req.chg_amount ||
    !req.chg_unit
  ) {
    Swal.fire({
      icon: "warning",
      title: "ຂໍ້ຜິດພາດ",
      text: "ກະລຸນາປ້ອນຂໍ້ມູນທຸກຢາງ!",
      confirmButtonText: "ຕົກລົງ",
    });
    return;
  }

  if (!(await form.value?.validate())) {
    valid.value = false;
    Swal.fire({
      icon: "error",
      title: "ມີຂໍ້ຜິດພາດ",
      text: "ກວດການປ້ອນຂໍ້ມູນຄືນ",
      confirmButtonText: "ຕົກລົງ",
    });
    return;
  }

  valid.value = true;
  try {
    await feecreate.createFee();
    const notification = await Swal.fire({
      icon: "success",
      title: "ສໍາເລັດ",
      text: "ບັນທຶກຂໍ້ມູນສໍາເລັດ!",
      confirmButtonText: "ຕົກລົງ",
    });

    if (notification.isConfirmed) {
      window.location.href = "/backend/fee";
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "ເກີດຂໍ້ຜິດພາດ",
      text: "ບໍ່ສາມາດສົ່ງຂໍ້ມູນໄດ້",
      confirmButtonText: "ຕົກລົງ",
    });
  }
};

const title = "ສ້າງຂໍ້ມູນຄ່າທຳນຽມ";
</script>
<template>
  <v-container>
    <h3>{{ title }}</h3>
    <v-divider></v-divider>
    <v-container>
      <v-form ref="form" @submit.prevent="Submit">
        <v-col cols="12">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                :rules="[(v) => !!v || 'ກະລຸນາໃສ່ຂໍ້ມູນ']"
                required
                label="ອັກສອນຫຍໍ້"
                variant="outlined"
                v-model="req.chg_code"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                :rules="[(v) => !!v || 'ກະລຸນາໃສ່ຂໍ້ມູນ']"
                label="ຊື່ພາສາລາວ"
                variant="outlined"
                v-model="req.chg_lao_type"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                :rules="[(v) => !!v || 'ກະລຸນາໃສ່ຂໍ້ມູນ']"
                label="ຊື່ພາສາອັງກິດ"
                variant="outlined"
                v-model="req.chg_type"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                :rules="[(v) => !!v || 'ກະລຸນາໃສ່ຂໍ້ມູນ']"
                label="ລາຍລະອຽດພາສາລາວ"
                variant="outlined"
                v-model="req.chg_desc"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                :rules="[(v) => !!v || 'ກະລຸນາໃສ່ຂໍ້ມູນ']"
                label="ລາຍລະອຽດພາສາອັງກິດ"
                variant="outlined"
                v-model="req.chg_lao_desc"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                :rules="[(v) => !!v || 'ກະລຸນາໃສ່ຂໍ້ມູນ']"
                required
                label="ມູນຄ່າ"
                type="number"
                variant="outlined"
                v-model="req.chg_amount"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                :rules="[(v) => !!v || 'ກະລຸນາໃສ່ຂໍ້ມູນ']"
                label="ສະກຸນເງິນ"
                variant="outlined"
                v-model="req.chg_unit"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-col>
        <div class="d-flex justify-center">
          <v-btn type="submit" color="primary" width="15vh" class="mr-4"
            >ບັນທືກຂໍ້ມູນ</v-btn
          >
          <v-btn type="reset" color="error" width="15vh"> ຍົກເລີກ</v-btn>
        </div>
      </v-form>
    </v-container>
  </v-container>
</template>
