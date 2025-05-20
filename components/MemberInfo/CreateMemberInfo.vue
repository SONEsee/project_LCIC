<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { LocationStore } from "~/stores/locationService";
import type { LochalUserData } from "~/types";
import { MemberStore } from "~/stores/memberinfo";
import Swal from "sweetalert2";

const memberStore = MemberStore();
const req = memberStore.create_data_form;
const locationStore = LocationStore();

const rules = {
  required: (v: string) => !!v || "ຈຳເປັນຕ້ອງປ້ອນຂໍ້ມູນນີ້",
  minLength: (v: string) => v.length >= 3 || "ຕ້ອງມີຢ່າງໜ້ອຍ 3 ຕົວອັກສອນ",
  emailRules: (v: string) => /.+@.+\..+/.test(v) || "ອີເມວບໍ່ຖືກຕ້ອງ",
};

const form = ref<any>(null);
const visible = ref(false);
const isLoading = computed(() => memberStore.loading || locationStore.loading);

const selectedProvince = ref<LochalUserData.Province | null>(null);
const selectedDistrict = ref<LochalUserData.District | null>(null);
const selectedVillage = ref<LochalUserData.Village | null>(null);

const isFormValid = ref(false);

onMounted(async () => {
  await locationStore.getProvinces();

  if (req.provinceinfo_id) {
    try {
      const foundProvince = locationStore.province.find(
        (p) => p.id === req.provinceinfo_id
      );
      if (foundProvince) {
        selectedProvince.value = foundProvince;
        await onProvinceChange();

        if (req.districtinfo_id) {
          const foundDistrict = locationStore.district.find(
            (d) => d.id === req.districtinfo_id
          );
          if (foundDistrict) {
            selectedDistrict.value = foundDistrict;
            await onDistrictChange();

            if (req.villageinfo_id) {
              const foundVillage = locationStore.village.find(
                (v) => v.id === req.villageinfo_id
              );
              if (foundVillage) {
                selectedVillage.value = foundVillage;
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Error loading location data:", error);
    }
  }
});

const onProvinceChange = async () => {
  selectedDistrict.value = null;
  selectedVillage.value = null;
  req.districtinfo_id = "";
  req.villageinfo_id = "";

  if (selectedProvince.value) {
    req.provinceinfo_id = selectedProvince.value.id;

    await locationStore.getDistrictsByProvince(selectedProvince.value.id);
  } else {
    req.provinceinfo_id = "";
  }
};

const onDistrictChange = async () => {
  selectedVillage.value = null;
  req.villageinfo_id = "";

  if (selectedDistrict.value && selectedProvince.value) {
    req.districtinfo_id = selectedDistrict.value.id;

    await locationStore.getVillagesByDistrict(
      selectedProvince.value.id,
      selectedDistrict.value.id
    );
  } else {
    req.districtinfo_id = "";
  }
};

const onVillageChange = () => {
  if (selectedVillage.value) {
    req.villageinfo_id = selectedVillage.value.id;
  } else {
    req.villageinfo_id = "";
  }
};

const toggleVisible = () => {
  visible.value = !visible.value;
};

const submitForm = async () => {
  const { valid } = await form.value.validate();
  console.log("Form validation result:", valid);

  if (!valid) {
    Swal.fire({
      icon: "error",
      title: "ມີຂໍ້ຜິດພາດ",
      text: "ກະລຸນາກວດສອບຂໍ້ມູນໃຫ້ຄົບຖ້ວນ",
      confirmButtonText: "ຕົກລົງ",
    });
    return;
  }

  if (!req.slug || !req.bnk_code || !req.nameL || !req.nameE) {
    Swal.fire({
      icon: "warning",
      title: "ຂໍ້ມູນບໍ່ຄົບຖ້ວນ",
      text: "ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບຖ້ວນ",
      confirmButtonText: "ຕົກລົງ",
    });
    return;
  }

  if (!req.provinceinfo_id || !req.districtinfo_id || !req.villageinfo_id) {
    Swal.fire({
      icon: "warning",
      title: "ຂໍ້ມູນສະຖານທີ່ບໍ່ຄົບຖ້ວນ",
      text: "ກະລຸນາເລືອກແຂວງ, ເມືອງ, ແລະ ບ້ານ",
      confirmButtonText: "ຕົກລົງ",
    });
    return;
  }

  try {
    const confirmResult = await Swal.fire({
      title: "ຢືນຢັນການບັນທຶກ",
      text: "ທ່ານຕ້ອງການບັນທຶກຂໍ້ມູນສະມາຊິກນີ້ແທ້ບໍ່?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "ບັນທຶກ",
      cancelButtonText: "ຍົກເລີກ",
    });

    if (!confirmResult.isConfirmed) {
      return;
    }

    await memberStore.createMember();

    const notification = await Swal.fire({
      icon: "success",
      title: "ສຳເລັດ",
      text: "ບັນທຶກຂໍ້ມູນສຳເລັດແລ້ວ!",
      confirmButtonText: "ຕົກລົງ",
    });

    if (notification.isConfirmed) {
      window.location.href = "/backend/memberinfo";
    }
  } catch (error) {
    console.error("Error submitting form:", error);

    Swal.fire({
      icon: "error",
      title: "ເກີດຂໍ້ຜິດພາດ",
      text: "ບໍ່ສາມາດບັນທຶກຂໍ້ມູນໄດ້ ກະລຸນາລອງໃໝ່ອີກຄັ້ງ",
      confirmButtonText: "ຕົກລົງ",
    });
  }
};

const goBack = () => {
  window.location.href = "/backend/member";
};
</script>

<template>
  <div class="pa-4">
    <div class="d-flex align-center mb-3">
      <h3 class="text-h5 font-weight-bold">ສ້າງຂໍ້ມູນສະມາຊິກໃໝ່</h3>
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        variant="text"
        prepend-icon="mdi-arrow-left"
        @click="goBack"
      >
        ກັບຄືນ
      </v-btn>
    </div>

    <v-divider class="mb-6"></v-divider>

    <v-form ref="form" @submit.prevent="submitForm" v-model="isFormValid">
      <v-card class="mb-6" variant="outlined">
        <v-card-title class="bg-primary-lighten-3">
          ຂໍ້ມູນວິສາຫະກິດ
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="req.nameL"
                label="ຊື່ວິສາຫະກິດພາສາລາວ"
                variant="outlined"
                :rules="[rules.required, rules.minLength]"
                required
                density="comfortable"
                placeholder="ກະລຸນາປ້ອນຊື່ວິສາຫະກິດພາສາລາວ"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field
                v-model="req.nameE"
                label="ຊື່ວິສາຫະກິດພາສາອັງກິດ"
                variant="outlined"
                :rules="[rules.required]"
                required
                density="comfortable"
                placeholder="ກະລຸນາປ້ອນຊື່ວິສາຫະກິດພາສາອັງກິດ"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field
                v-model="req.bnk_code"
                label="ລະຫັດບັນຊີ"
                variant="outlined"
                :rules="[rules.required]"
                required
                density="comfortable"
                placeholder="ກະລຸນາປ້ອນລະຫັດບັນຊີ"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field
                v-model="req.slug"
                label="ຊື່ເປັນທາງການ"
                variant="outlined"
                :rules="[rules.required]"
                required
                density="comfortable"
                placeholder="ກະລຸນາປ້ອນຊື່ເປັນທາງການ"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field
                v-model="req.descL"
                label="ລາຍລະອຽດພາສາລາວ"
                variant="outlined"
                :rules="[rules.required]"
                required
                density="comfortable"
                placeholder="ກະລຸນາປ້ອນລາຍລະອຽດພາສາລາວ"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field
                v-model="req.descE"
                label="ລາຍລະອຽດພາສາອັງກິດ"
                variant="outlined"
                :rules="[rules.required]"
                required
                density="comfortable"
                placeholder="ກະລຸນາປ້ອນລາຍລະອຽດພາສາອັງກິດ"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6">
              <v-select
                v-model="req.published"
                label="ສະຖານະການເຜີຍແຜ່"
                variant="outlined"
                :items="[
                  { title: 'ເຜີຍແຜ່', value: '1' },
                  { title: 'ບໍ່ເຜີຍແຜ່', value: '0' },
                ]"
                item-title="title"
                item-value="value"
                :rules="[rules.required]"
                required
                density="comfortable"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6">
              <v-select
                v-model="req.published"
                label="ປະເພດ"
                variant="outlined"
                :items="[
                  { title: 'ທະນາຄານ', value: '1' },
                  { title: 'ສະຖາບັນ', value: '2' },
                ]"
                item-title="title"
                item-value="value"
                :rules="[rules.required]"
                required
                density="comfortable"
              ></v-select>
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field
                v-model="req.code"
                label="ລະຫັດ"
                variant="outlined"
                :rules="[rules.required]"
                required
                density="comfortable"
                placeholder="ກະລຸນາປ້ອນລະຫັດ"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="req.streetInfoL"
                label="ຢູ່ເສັ້ນທາງພາສາລາວ"
                variant="outlined"
                :rules="[rules.required]"
                required
                density="comfortable"
                placeholder="ກະລຸນາປ້ອນລະຫັດ"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="req.streetInfoE"
                label="ຢູ່ເສັ້ນທາງພາສາອັງກິດ"
                variant="outlined"
                :rules="[rules.required]"
                required
                density="comfortable"
                placeholder="ກະລຸນາປ້ອນລະຫັດ"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-select
                v-model="req.bnk_type"
                label="ປະເພດການດຳເນີນການ"
                variant="outlined"
                :items="[
                  { title: 'ທະນາຄານ', value: '1' },
                  { title: 'ສະຖາບັນ', value: '2' },
                ]"
                item-title="title"
                item-value="value"
                :rules="[rules.required]"
                required
                density="comfortable"
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="4">
              <v-autocomplete
                v-model="selectedProvince"
                label="ເລືອກແຂວງ"
                :items="locationStore.province"
                item-title="name"
                item-value="id"
                variant="outlined"
                :loading="locationStore.loading"
                :rules="[rules.required]"
                @update:model-value="onProvinceChange"
                return-object
                required
                density="comfortable"
                placeholder="ກະລຸນາເລືອກແຂວງ"
              ></v-autocomplete>
            </v-col>

            <v-col cols="12" sm="4">
              <v-autocomplete
                v-model="selectedDistrict"
                label="ເລືອກເມືອງ"
                :items="locationStore.district"
                item-title="name"
                item-value="id"
                variant="outlined"
                :loading="locationStore.loading"
                :rules="[rules.required]"
                @update:model-value="onDistrictChange"
                return-object
                :disabled="!selectedProvince"
                required
                density="comfortable"
                placeholder="ກະລຸນາເລືອກເມືອງ"
                persistent-placeholder
              ></v-autocomplete>
            </v-col>

            <v-col cols="12" sm="4">
              <!-- ເລືອກບ້ານ -->
              <v-autocomplete
                v-model="selectedVillage"
                label="ເລືອກບ້ານ"
                :items="locationStore.village"
                item-title="name"
                item-value="id"
                variant="outlined"
                :loading="locationStore.loading"
                :rules="[rules.required]"
                @update:model-value="onVillageChange"
                return-object
                :disabled="!selectedDistrict"
                required
                density="comfortable"
                placeholder="ກະລຸນາເລືອກບ້ານ"
                persistent-placeholder
              ></v-autocomplete>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <div class="d-flex gap-2 justify-end mt-4">
        <v-btn color="error" variant="outlined" @click="goBack">
          ຍົກເລີກ
        </v-btn>
        <v-btn
          color="primary"
          type="submit"
          :loading="isLoading"
          :disabled="!isFormValid"
        >
          ບັນທຶກຂໍ້ມູນ
        </v-btn>
      </div>
    </v-form>
  </div>
</template>

<style scoped>
.bg-primary-lighten-3 {
  background-color: rgb(var(--v-theme-primary), 0.15);
  font-weight: 500;
}
</style>
