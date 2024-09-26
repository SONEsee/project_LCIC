<template>
  <div>
    <h1>Collateral Update Form</h1>
    <form @submit.prevent="submitForm">
      <div>
        <label for="bnk_id">Bank ID:</label>
        <input v-model="form.bnk_id" type="text" id="bnk_id" required />
      </div>

      <div>
        <label for="branch_id">Branch ID:</label>
        <input v-model="form.branch_id" type="text" id="branch_id" required />
      </div>

      <div>
        <label for="file_name">File Name:</label>
        <input v-model="form.file_name" type="text" id="file_name" required />
      </div>

      <div>
        <label for="file_path">File Path:</label>
        <input v-model="form.file_path" type="text" id="file_path" required />
      </div>

      <div>
        <label for="user">User:</label>
        <input v-model="form.user" type="text" id="user" required />
      </div>

      <div>
        <label for="image">Image:</label>
        <input @change="handleImageUpload" type="file" id="image" />
      </div>

      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import axios from "axios";

export default defineComponent({
  name: "CollateralUpdateForm",
  setup() {
    const form = ref({
      bnk_id: "",
      branch_id: "",
      file_name: "",
      file_path: "",
      user: "",
      image: null as File | null,
    });
    function getCookie(name: string) {
      let cookieValue = null;
      if (document.cookie && document.cookie !== "") {
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          if (cookie.substring(0, name.length + 1) === name + "=") {
            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
            break;
          }
        }
      }
      return cookieValue;
    }

    const handleImageUpload = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        form.value.image = target.files[0];
      }
    };

    const submitForm = async () => {
      const formData = new FormData();
      formData.append("bnk_id", form.value.bnk_id);
      formData.append("branch_id", form.value.branch_id);
      formData.append("file_name", form.value.file_name);
      formData.append("file_path", form.value.file_path);
      formData.append("user", form.value.user);
      if (form.value.image) {
        formData.append("image", form.value.image);
      }

      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/api/collateral_update_view/",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("Form submitted successfully", response.data);
      } catch (error) {
        console.error("There was an error submitting the form", error);
      }
    };

    return {
      form,
      handleImageUpload,
      submitForm,
      getCookie,
    };
  },
});
</script>

<style scoped>
/* Add any required styles here */
</style>
