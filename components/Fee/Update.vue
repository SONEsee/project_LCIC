<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useFeesStore } from "~/stores/fee";
import { useRoute } from "vue-router";
import Swal from "sweetalert2";

const valid = ref(false);
const form = ref<HTMLFormElement | null>(null);
const route = useRoute();
const store = useFeesStore();
const id = computed(() => {
  const paramId = route.query.id;
  return paramId ? Number(paramId) : null;
});

const feeDetail = computed(() => store.response_detail_data);

const formattedAmount = computed({
  get: () => {
    return feeDetail.value?.chg_amount
      ? Number(feeDetail.value.chg_amount).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : "0.00";
  },
  set: (val) => {
    if (feeDetail.value) {
      feeDetail.value.chg_amount = parseFloat(val.replace(/,/g, "")) || 0;
    }
  },
});

onMounted(() => {
  if (id.value !== null && !isNaN(id.value) && id.value > 0) {
    store.Getdetail(id.value);
  } else {
    console.error("Invalid ID:", id.value);
  }
});

const Submit = async () => {
  valid.value = true;

  try {
    const { valid } = await form.value?.validate();
    console.log("Form Validation:", valid);

    if (!id.value) throw new Error("Invalid ID");

    console.log("Data to send:", feeDetail.value);
    await store.update(id.value);
    console.log("Update Response:", store.update);

    const notification = await Swal.fire({
      icon: "success",
      title: "ສໍາເລັດ",
      text: "ອັບເດດຂໍ້ມູນສໍາເລັດ!",
      confirmButtonText: "ຕົກລົງ",
    });

    if (notification.isConfirmed) {
      window.location.href = "/backend/fee";
    }
  } catch (error) {
    console.error("Error updating fee:", error);
  }
};

const title = "ລາຍລະອຽດຂໍ້ມູນຄ່າທຳນຽມ";
</script>

<template>
  <v-container>
    <h3>{{ title }}</h3>
    <v-divider></v-divider>
    <v-container v-if="feeDetail">
      <v-form @submit.prevent="Submit" ref="form" v-model:valid="valid">
        <v-col cols="12">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                label="ອັກສອນຫຍໍ້"
                variant="outlined"
                v-model="feeDetail.chg_code"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="ຊື່ພາສາລາວ"
                variant="outlined"
                v-model="feeDetail.chg_lao_type"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="ຊື່ພາສາອັງກິດ"
                variant="outlined"
                v-model="feeDetail.chg_type"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="ລາຍລະອຽດພາສາລາວ"
                variant="outlined"
                v-model="feeDetail.chg_lao_desc"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="ລາຍລະອຽດພາສາອັງກິດ"
                variant="outlined"
                v-model="feeDetail.chg_desc"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="ມູນຄ່າ"
                variant="outlined"
                v-model="formattedAmount"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="ສະກຸນເງິນ"
                variant="outlined"
                v-model="feeDetail.chg_unit"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-col>
        <div class="d-flex justify-center">
        <v-btn color="primary" type="submit" width="20vh">ອັບເດດ</v-btn></div>
      </v-form>
    </v-container>
    <v-container v-else>
      <p>ກຳລັງໂຫຼດຂໍ້ມູນ...</p>
    </v-container>
  </v-container>
</template>
