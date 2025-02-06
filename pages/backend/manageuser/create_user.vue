<template>
  <div>
    <ManageUserAddUser />
  </div>
  <v-container class="elevation-4">
    <h3>ອອກ User ນໍາໃຊ້ລະບົບ</h3>
    <v-row no-gutters>
      <!-- ຊື່ ແລະ ນາມສະກຸນ -->
      <v-col cols="12" md="4">
        <v-sheet class="ma-2">
          <v-text-field
            v-model="form.firstnameLao"
            label="ຊື່ພາສາລາວ"
            outlined
            dense
          ></v-text-field>
        </v-sheet>
      </v-col>
      <v-col cols="12" md="4">
        <v-sheet class="ma-2">
          <v-text-field
            v-model="form.surnameLao"
            label="ນາມສະກຸນພາສາລາວ"
            outlined
            dense
          ></v-text-field>
        </v-sheet>
      </v-col>
      <v-col cols="12" md="4">
        <v-sheet class="ma-2">
          <v-text-field
            v-model="form.firstnameEng"
            label="ຊື່ອັງກິດ"
            outlined
            dense
          ></v-text-field>
        </v-sheet>
      </v-col>
      <v-col cols="12" md="4">
        <v-sheet class="ma-2">
          <v-text-field
            v-model="form.surnameEng"
            label="ນາມສະກຸນພາສາອັງກິດ"
            outlined
            dense
          ></v-text-field>
        </v-sheet>
      </v-col>
      <v-col cols="12" md="4">
        <v-sheet class="ma-2">
          <v-text-field
            v-model="form.username"
            label="ຊື່ຜູ້ນຳໃຊ້"
            outlined
            dense
          ></v-text-field>
        </v-sheet>
      </v-col>

      
      <v-col cols="12" md="4">
        <v-sheet class="ma-2">
          <v-autocomplete
            v-model="form.selectedBank"
            :items="banks"
            item-title="code"
            item-value="bnk_code"
            label="ເລືອກຊືສະມາຊິກ"
            variant="outlined"
            outlined
            dense
            @update:model-value="fetchBranches"
          ></v-autocomplete>
        </v-sheet>
      </v-col>

      <!-- Branch Dropdown -->
      <v-col cols="12" md="4">
        <v-sheet class="ma-2">
          <v-autocomplete
            v-model="form.selectedBranch"
            :items="branches"
            item-title="branch_name"
            item-value="id"
            label="ເລືອກສາຂາ"
            variant="outlined"
            outlined
            dense
            :disabled="!form.selectedBank"
          ></v-autocomplete>
        </v-sheet>
      </v-col>

      <!-- ກຸ່ມຜູ້ໃຊ້ງານ -->
      <v-col cols="12" md="4">
        <v-sheet class="ma-2">
          <v-text-field
            v-model="form.groupUser"
            label="ກຸ່ມຜູ້ໃຊ້ງານ"
            outlined
            dense
          ></v-text-field>
        </v-sheet>
      </v-col>

      <!-- ລະຫັດຜ່ານ -->
      <v-col cols="12" md="4">
        <v-sheet class="ma-2">
          <v-text-field
            v-model="form.password"
            label="ລະຫັດຜ່ານ"
            type="password"
            outlined
            dense
          ></v-text-field>
        </v-sheet>
      </v-col>
      <v-col cols="12" md="4">
        <v-sheet class="ma-2">
          <v-text-field
            v-model="form.confirmPassword"
            label="ຢືນຢັນລະຫັດຜ່ານ"
            type="password"
            outlined
            dense
          ></v-text-field>
        </v-sheet>
      </v-col>

      <!-- ປຸ່ມສ້າງຜູ້ໃຊ້ງານ -->
      <v-col cols="12">
        <v-btn @click="submitForm" class="bg-blue-darken-4">
          ສ້າງຜູ້ໃຊ້ງານ
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { ref, onMounted } from "vue";
import Swal from "sweetalert2";
import axios from "axios";

definePageMeta({
  middleware: ["auth"],
  layout: "backend",
});

useHead({
  title: "AddUser",
  meta: [
    {
      name: "keywords",
      content: "Order, Nuxt 3, Backend",
    },
    {
      name: "Description",
      content: "Order Nuxt 3, IT Genius Engineering",
    },
  ],
});

export default {
  setup() {
    const form = ref({
      firstnameLao: "",
      surnameLao: "",
      firstnameEng: "",
      surnameEng: "",
      username: "",
      selectedBank: null,
      selectedBranch: null,
      groupUser: "",
      password: "",
      confirmPassword: "",
    });

    const banks = ref([]);
    const branches = ref([]);

    // Submit Form
    const submitForm = async () => {
      if (!validateForm()) {
        return;
      }

      try {
        const config = useRuntimeConfig();
        const response = await axios.post(
          `${config.public.strapi.url}api/create_user/`,
          {
            nameL: form.value.firstnameLao,
            surnameL: form.value.surnameLao,
            nameE: form.value.firstnameEng,
            surnameE: form.value.surnameEng,
            username: form.value.username,
            MID: form.value.selectedBank?.id,
            GID: form.value.groupUser,
            bnk_code: form.value.selectedBank?.bnk_code,
            branch_id: form.value.selectedBranch?.id,
            password: form.value.password,
            confirmPassword: form.value.confirmPassword,
          }
        );

        if (response.status === 200) {
          await Swal.fire({
            title: "Success!",
            text: "User created successfully.",
            icon: "success",
            confirmButtonText: "OK",
          });
        }
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: error.response ? error.response.data.message : error.message,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    };

    // Validate Form
    const validateForm = () => {
      if (
        !form.value.firstnameLao ||
        !form.value.surnameLao ||
        !form.value.username ||
        !form.value.password ||
        !form.value.confirmPassword
      ) {
        Swal.fire({
          title: "Error!",
          text: "Please fill in all required fields.",
          icon: "error",
          confirmButtonText: "OK",
        });
        return false;
      }

      if (form.value.password !== form.value.confirmPassword) {
        Swal.fire({
          title: "Error!",
          text: "Passwords do not match.",
          icon: "error",
          confirmButtonText: "OK",
        });
        return false;
      }

      return true;
    };

    // Fetch Banks
    const fetchBanks = async () => {
      try {
        const config = useRuntimeConfig();
        const response = await axios.get(
          `${config.public.strapi.url}api/memberinfo/`
        );
        banks.value = response.data;
      } catch (error) {
        console.error("Error fetching banks:", error);
      }
    };

    // Fetch Branches based on selected bank
    const fetchBranches = async (bankCode) => {
      if (!bankCode) {
        branches.value = [];
        return;
      }
      try {
        const config = useRuntimeConfig();
        const response = await fetch(
          `${config.public.strapi.url}api/branches/?bnk_code=${bankCode}`
        );
        branches.value = await response.json();
        console.log("Branches:", branches.value);
      } catch (error) {
        console.error("Error fetching branches:", error);
      }
    };

    // Fetch data on component mount
    onMounted(() => {
      fetchBanks();
    });

    return {
      form,
      submitForm,
      banks,
      branches,
      fetchBranches,
    };
  },
};
</script>
