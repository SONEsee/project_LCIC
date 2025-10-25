<template>
  <div class="user-form">
    <h2>Create User</h2>

    <form @submit.prevent="submitForm">
      <input v-model="form.username" placeholder="Username" required />
      <input type="password" v-model="form.password" placeholder="Password" required />
      <input type="password" v-model="form.confirm_password" placeholder="Confirm Password" required />
      <input v-model="form.nameL" placeholder="Name (L)" />
      <input v-model="form.surnameL" placeholder="Surname (L)" />
      <input v-model="form.nameE" placeholder="Name (E)" />
      <input v-model="form.surnameE" placeholder="Surname (E)" />

      <select v-model="form.MID">
        <option v-for="m in members" :key="m.id" :value="m.id">
          {{ m.bnk_code }} - {{ m.code }} - {{ m.nameL }}
        </option>
      </select>

      <select v-model="form.GID">
        <option v-for="r in roles" :key="r.id" :value="r.id">{{ r.id }} - {{ r.name }}</option>
      </select>

      <input type="file" @change="handleFileUpload" />

      <button type="submit">Create</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useUserApi } from "~/composables/useUserApi";

const { createUser } = useUserApi();
const form = ref({
  username: "",
  password: "",
  confirm_password: "",
  nameL: "",
  surnameL: "",
  nameE: "",
  surnameE: "",
  MID: "",
  GID: "",
  branch_id: "",
  profile_image: null,
});

const members = ref([]);
const roles = ref([]);

const handleFileUpload = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (file) form.value.profile_image = file;
};

const submitForm = async () => {
  try {
    const res = await createUser(form.value);
    console.log("✅ Success:", res);
  } catch (err) {
    console.error("❌ Error creating user:", err);
  }
};

onMounted(async () => {
  const config = useRuntimeConfig();
  const apiUrl = config.public.strapi.url;
  const token = useCookie("accessToken").value;

  const headers = { Authorization: `Bearer ${token}` };

  members.value = await $fetch(`${apiUrl}memberinfo/`, { headers });
  roles.value = await $fetch(`${apiUrl}roles/`, { headers });
});
</script>


<style scoped src="~/assets/css/user-form.css"></style>
