<template>
  <div class="image-background">
    <VCol cols="12" md="12" align="center" justify="center">
      <VRow no-gutters align="center" justify="center">
        <VCol cols="12" md="3" class="pa-3 bg-indigo-darken-4 rounded-lg mb-15 ml- " >
          <VForm
            @submit.prevent="submit"
            class="mt-7 rounded-lg bg-indigo-darken-4 "
          >
            <div class="mt-1 text-start">
              <label class="label" for="username">ຊື່ຜູ້ໃຊ້ງານ</label>
              <VTextField
                v-model="username"
                :rules="[ruleRequired]"
                prepend-inner-icon="mdi-account-outline"
                id="username"
                name="username"
                type="text"
                class="rounded-lg"
              />
            </div>
            <div class="mt-1 text-start">
              <label class="label" for="password">ລະຫັດຜ່ານ</label>
              <VTextField
                v-model="password"
                :rules="[ruleRequired, rulePassLen]"
                prepend-inner-icon="fluent:password-20-regular" 
                id="password"
                name="password"
                type="password"
              />
            </div>
            <div class="mt-5">
              <VBtn
                prepend-icon="mdi-login"
                type="submit"
            
                class="login-button"
                >ເຂົ້າສູ່ລະບົບ</VBtn
              >
            </div>
          </VForm>
          <p class="text-center mt-4">
            <!-- <span
              >ຍັງບໍ່ທັນເປັນສະມາຊິກບໍ?
              <NuxtLink to="/signup" class="signup-link"
                >ລົງທະບຽນທີ່ນີ້</NuxtLink
              ></span
            > -->
          </p>
        </VCol>
      </VRow>
    </VCol>
  </div>
</template>

<<<<<<< HEAD
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
          "http://127.0.0.1:35729/api/collateral_update_view/",
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
=======
<script setup lang="ts">
useHead({
  title: "Sign In",
  meta: [
    { name: "description", content: "Sign In Nuxt 3, IT Genius Engineering" },
    { name: "keywords", content: "Sign In, Nuxt 3, Learning Nuxt 3" },
  ],
>>>>>>> 7a6a73f4385a12dae435ab5762d85d2ece83ccaa
});

const { $swal } = useNuxtApp();
const username = ref("");
const password = ref("");
const { ruleRequired, rulePassLen } = useFormRules();
const router = useRouter();

const submit = async () => {
  try {
    if (ruleRequired(username.value) && rulePassLen(password.value)) {
      const config = useRuntimeConfig();
      const { data } = await useFetch(`${config.public.strapi.url}api/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.value,
          password: password.value,
        }),
      });

      if (data.value?.access && data.value?.refresh) {
        localStorage.setItem("access_token", data.value.access);
        localStorage.setItem("refresh_token", data.value.refresh);
        localStorage.setItem("user_data", JSON.stringify(data.value.user));

        $swal
          .fire({
            title: "ກຳລັງເຂົ້າສູ່ລະບົບ",
            html: "ກາລຸນາລໍຖ້າອີກ <b></b> ວິນາທີ",
            timer: 3000,
            timerProgressBar: true,
            didOpen: () => {
              $swal.showLoading();
              const interval = setInterval(() => {
                const b = $swal.getHtmlContainer()?.querySelector("b");
                if (b)
                  b.textContent = `${Math.round($swal.getTimerLeft() / 1000)}`;
              }, 100);
            },
          })
          .then(() => router.push("/backend/dashboard"));
      } else {
        $swal.fire({
          icon: "error",
          title: "ບໍ່ສາມາດເຂົ້າສູ່ລະບົບໄດ້",
          text: "ຂໍ້ມູນຜູ້ໃຊ້ງານ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ.",
        });
      }
    }
  } catch (err) {
    console.error("Login error:", err);
    $swal.fire({
      icon: "error",
      title: "Login Failed",
      text: "An unexpected error occurred. Please try again.",
    });
  }
};
</script>

<style scoped>
.image-background {
  background-image: url("@/assets/images/login/login.png");
  background-size: cover;
  background-position: center;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.image-background::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.login-button {
  background-color: #FFFFFF;
  color: #000000;
}

.signup-link {
  color: #e8eef0;
  font-family: "Noto Sans Lao";
}


@media (max-width: 768px) {
  .image-background {
    background-image: none;
    background-color: #f5f5f5; 
  }
}
</style>
