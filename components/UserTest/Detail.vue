<script setup lang="ts">
import { computed, ref } from "vue";
import { useUserManageStore } from "~/stores/usermanage";

const useStore = useUserManageStore();
const res = computed(() => {
  return useStore.respons_user_data_detail;
});
</script>

<template>
  <v-col cols="12">
    <v-row>
      <v-col cols="12" md="3" class="text-center d-flex-align-center">
        <v-avatar style="border: 1px solid green" size="200">
          <img
            :width="151"
            v-if="res?.profile_image"
            :src="`${$config.public.strapi.url}${res?.profile_image}`"
            alt="User Image"
          />
          <div v-else>
          <v-icon size="60">mdi-account-circle </v-icon>  <br>
          <p>ບໍ່ມີຮູບໂປຟາຍ</p>
        </div>
         
        </v-avatar>
      </v-col>
      <v-col cols="12" md="9">
        <v-row>
          <v-col cols="12" md="4">
            <p>ຊື່ພາສາລາວ</p>
            <v-text-field :value="res?.nameL" density="compact" readonly>
            </v-text-field>
            <p>ນາມສະກຸນພາສາລາວ</p>
            <v-text-field :value="res?.surnameL" density="compact" readonly>
            </v-text-field>
            <p>ສິດການນຳໃຊ້ລະບົບ</p>
            <v-text-field :value="res?.GID.nameL" density="compact" readonly>
            </v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <p>ຊື່ພາອັງກິດ</p>
            <v-text-field :value="res?.surnameE" density="compact" readonly>
            </v-text-field>
            <p>ນາມສະກຸນພາສາອັງກິດ</p>
            <v-text-field :value="res?.surnameE" density="compact" readonly>
            </v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <p>ຊື່ຜູ້ໃຊ້ງານ</p>
            <v-text-field :value="res?.username" density="compact" readonly>
            </v-text-field>
            <p>ສັງກັດຢູ່</p>
            <v-text-field :value="res?.MID.nameL" density="compact" readonly>
            </v-text-field> </v-col
        ></v-row>
      </v-col>
    </v-row>
  </v-col>
</template>
