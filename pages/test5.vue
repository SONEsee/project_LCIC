<template>
  <section
    style="min-height: 100vh"
    class="d-flex flex-wrap align-center justify-center"
  >
    <v-form
      style="min-width: 40%"
      class="d-flex justify-center align-center"
      ref="form"
      v-model:validate="validate"
      @submit.prevent="SubmitForm"
    >
      <v-row>
        <v-col cols="12">
          <v-text-field
            density="compact"
            v-model="name"
            label="Username"
            :rules="[rules.required, rules.minLength]"
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            density="compact"
            v-model="email"
            label="Email"
            :rules="[rules.required, rules.email]"
          ></v-text-field>
        </v-col>
        <div class="d-flex justify-center w-100">
          <v-btn class="mr-2" color="primary" type="submit">ບັນທຶກ</v-btn>
          <v-btn class="ml-2" color="error" @click="ResetForm">ຍົກເລີກ</v-btn>
        </div>
      </v-row>
    </v-form>
  </section>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const form = ref();
const validate = ref(false);
const name = ref(null);
const email = ref(null);

const rules = {
  required: (value: string) => !!value || "ຂໍ້ມູນນີ້ຈຳເປັນ",
  email: (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || "Email ບໍ່ຖືກຕ້ອງ",
  minLength: (value: string) =>
    value?.length >= 3 || "ຂໍ້ມູນຕ້ອງມີຢ່າງໜ້ອຍ 3 ຕົວອັກສອນ",
};

const SubmitForm = async () => {
  try {
    const { valid } = await form.value.validate();
    if (valid) {
      console.log("Form is valid:", { name: name.value, email: email.value });
    } else {
      console.log("Form is invalid.");
    }
  } catch (e) {
    console.error(e);
  }
};

const ResetForm = () => {
  name.value = null;
  email.value = null;
};
</script>
