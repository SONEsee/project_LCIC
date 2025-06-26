<script setup lang="ts">
import { ref } from "vue";
import { useUserManageStore } from "~/stores/usermanage";
import { MemberStore } from "~/stores/memberinfo";
const memberinfoStore = MemberStore();
const res = computed(() => {
  if (Array.isArray(memberinfoStore.respons_data_query)) {
    return memberinfoStore.respons_data_query;
  } else if (
    memberinfoStore.respons_data_query &&
    typeof memberinfoStore.respons_data_query === "object"
  ) {
    return [memberinfoStore.respons_data_query];
  } else {
    return [];
  }
});
console.log("res", res.value);

const userStore = useUserManageStore();
const roles = computed<any[]>(() => {
  const rawData = userStore.respons_role_data;

  return rawData ? (Array.isArray(rawData) ? rawData : [rawData]) : [];
});
const req = computed(() => userStore.form_create_data);
const visible = ref(false);
const form = ref();
const toggleVisibility = () => {
  visible.value = !visible.value;
};
onMounted(() => {
  userStore.Getrole();
  memberinfoStore.getMemberInfo();
});
const handleLogin = async () => {
  try {
    const { valid } = await form.value.validate();
    if (valid) {
      await userStore.createUser();
    }
  } catch (error) {
    console.error(error);
  }
};
</script>
<template>
 
  <v-container>
    <v-form
      style="width: 100%"
      ref="form"
      class="text-center"
      @submit.prevent="handleLogin"
    >
      <v-col cols="12">
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              class="rounded-lg"
              id="username"
              v-model="req.username"
              label="ກະລຸນາປ້ອນຊື່ຜູ້ໃຊ້ງານ"
              density="compact"
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              class="rounded-lg text-start"
              v-model="req.nameL"
              @click:append-inner="toggleVisibility"
              :rules="[(v: string) => !!v || 'ກະລຸນາໃສ່ຂໍ້ມູນ']"
              label="ຊື່ພາສາລາວ"
              density="compact"
              variant="outlined"
            ></v-text-field
          ></v-col>
          <v-col cols="12" md="4">
            <v-text-field
              class="rounded-lg text-start"
              v-model="req.nameE"
              @click:append-inner="toggleVisibility"
              :rules="[(v: string) => !!v || 'ກະລຸນາໃສ່ຂໍ້ມູນ']"
              label="ຊື່ພາສາອັງກິດ"
              density="compact"
              variant="outlined"
            ></v-text-field
          ></v-col>
          <v-col cols="12" md="4">
            <v-text-field
              class="rounded-lg text-start"
              v-model="req.surnameL"
              @click:append-inner="toggleVisibility"
              :rules="[(v: string) => !!v || 'ກະລຸນາໃສ່ຂໍ້ມູນ']"
              label="ນາມສະກຸນພາສາລາວ"
              density="compact"
              variant="outlined"
            ></v-text-field
          ></v-col>
          <v-col cols="12" md="4">
            <v-text-field
              class="rounded-lg text-start"
              v-model="req.surnameE"
              @click:append-inner="toggleVisibility"
              :rules="[(v: string) => !!v || 'ກະລຸນາໃສ່ຂໍ້ມູນ']"
              label="ນາມສະກຸນພາສາອັງກິດ"
              density="compact"
              variant="outlined"
            ></v-text-field
          ></v-col>
          <v-col cols="12" md="4">
            <v-autocomplete
              v-model="req.MID"
              density="compact"
              variant="outlined"
              label="ເລືອກ bnk_code"
              :items="res"
              item-title="nameL"
              item-value="bnk_code"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="4">
            <v-autocomplete
              v-model="req.bnk_code"
              density="compact"
              variant="outlined"
              label="ເລືອກ ອັກສອນຫຍໍ້"
              :items="res"
              item-title="code"
              item-value="bnk_code"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="4">
            <v-autocomplete
              v-model="req.GID"
              density="compact"
              variant="outlined"
              label="ເລືອກ ສິດເຂົ້ານຳໃຊ້"
              :items="roles"
              item-title="name"
              item-value="id"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="4">
            <v-file-input
              v-model="req.profile_image"
              density="compact"
              variant="outlined"
              label="File input"
              prepend-icon="mdi-camera"
            ></v-file-input>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              class="rounded-lg text-start"
              v-model="req.password"
              @click:append-inner="toggleVisibility"
              :rules="[(v: string) => !!v || 'ກະລຸນາໃສ່ຂໍ້ມູນ']"
              label="ລະຫັດຜ່ານ"
              density="compact"
              variant="outlined"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-col>

      <v-btn class="mt-4 rounded-lg" color="primary" type="submit" flat>
        ບັນທືກ
      </v-btn>
      <v-btn
        class="mt-4 ml-2 rounded-lg"
        color="error"
        @click="$router.push('/backend/manageuser/userlist')"
        flat
      >
        ຍົກເລີກ
      </v-btn>
    </v-form></v-container
  >
</template>
