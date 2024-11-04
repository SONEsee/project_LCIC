<template>
  <div class="image-background">
    <VCol cols="12" md="12" align="center" justify="center">
      <VRow no-gutters align="center" justify="center">
        <VCol cols="12" md="3" class="pa-3 bg-indigo-darken-4 rounded-xl mb-15 ml- " >
          <v-container>
          <VForm
            @submit.prevent="submit"
            class="mt-7 rounded-lg bg-indigo-darken-4 "
          >
            <div class="mt-1 text-start rounded-lg">
              <label class="label" for="username">ຊື່ຜູ້ໃຊ້ງານ</label>
              <VTextField
                v-model="username"
                :rules="[ruleRequired]"
                
                id="username"
                name="username"
                type="text"
                class="rounded-lg"
                variant="outlined"
                style="border-radius: 1px;"
              />
            </div>
            <div class="mt-1 text-start rounded-lg" >
              <label class="label" for="password">ລະຫັດຜ່ານ</label>
              <VTextField
                v-model="password"
                :rules="[ruleRequired, rulePassLen]"
              
                id="password"
                name="password"
                type="password"
              />
              <!--   prepend-inner-icon="fluent:password-20-regular" prepend-inner-icon="mdi-account-outline"  -->
            </div>
            <div class="mt-5">
              <VBtn
                prepend-icon="mdi-login"
                type="submit"
            
                class="login-button"
                >ເຂົ້າສູ່ລະບົບ</VBtn
              >
            </div>
          </VForm></v-container>
          <p class="text-center mt-4">
           
          </p>
        </VCol>
      </VRow>
    </VCol>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: "Sign In",
  meta: [
    { name: "description", content: "Sign In Nuxt 3, IT Genius Engineering" },
    { name: "keywords", content: "Sign In, Nuxt 3, Learning Nuxt 3" },
  ],
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


<<<<<<< HEAD
<!-- <template>
	<VContainer fluid class="fill-height pa-0">
	  <VRow no-gutters align="center" justify="center" class="fill-height">
		<VCol class="hidden-sm-and-down fill-height" md="6" lg="6">
		  <VImg
			src="https://gallery.yopriceville.com/var/albums/Abstract/Aqua_Blue.jpg?m=1629740799"
			cover
			class="h-100 rounded-xl rounded-ts-0 rounded-bs-0 d-flex align-center justify-center"
		  >
			<div class="text-center w-50 text-white mx-auto">
			  <img src="../assets/images/logo1.png" alt="" style="width: 200px;" />
			  <h1 class="mb-4">ຍິນດີຕ້ອນຮັບເຂົ້າສູ່ລະບົບ LCIC.</h1>
			  <p>ບໍລິສັດ ຂໍ້ມູນຂ່າວສານສິນເຊື່ອແຫ່ງ ສປປ ລາວ!</p>
			</div>
		  </VImg>
		</VCol>
		<VCol cols="12" md="6" lg="6" sm="6">
		  <VRow no-gutters align="center" justify="center">
			<VCol cols="12" md="6" class="pa-3">
			  <h1>ເຂົ້າ​ສູ່​ລະ​ບົບ</h1>
			  <p style="font-family: Noto Sans Lao;">ໃສ່ຊື່ຜູ້ໃຊ້ ແລະລະຫັດຜ່ານຂອງທ່ານເພື່ອເຂົ້າສູ່ລະບົບ.</p>
  
			  <VForm @submit.prevent="submit" class="mt-7">
				<div class="mt-1">
				  <label class="label text-grey-darken-2" for="username">ຊື່ຜູ້ໃຊ້ງານ</label>
				  <VTextField
					v-model="username"
					:rules="[ruleRequired]"
					prepend-inner-icon="fluent:mail-24-regular"
					id="username"
					name="username"
					type="text"
				  />
				</div>
				<div class="mt-1">
				  <label class="label text-grey-darken-2" for="password">ລະຫັດຜ່ານ</label>
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
				  <VBtn type="submit" block min-height="44" class="gradient primary">Sign In</VBtn>
				</div>
			  </VForm>
			  <p class="text-center mt-10">
				<span>ຍັງບໍ່ທັນເປັນສະມາຊິກບໍ?
				  <NuxtLink to="/signup" style="font-family: Noto Sans Lao;text-decoration: none;">ລົງທະບຽນທີ່ນີ້</NuxtLink>
				</span>
			  </p>
			</VCol>
		  </VRow>
		</VCol>
	  </VRow>
	</VContainer>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  
  const username = ref('');
  const password = ref('');
  const router = useRouter();
  
  const ruleRequired = (v: string) => !!v || 'This field is required';
  const rulePassLen = (v: string) => v.length >= 6 || 'Password must be at least 6 characters long';
  
  const submit = async () => {
	try {
    const config = useRuntimeConfig();
	  const { data, error } = await useFetch(`${config.public.strapi.url}api/login/`, {
		method: 'POST',
		body: {
		  username: username.value,
		  password: password.value,
		},
	  });
  
	  if (error.value) {
		throw new Error(error.value.message);
	  }
  
	  // Save tokens and UserID to LocalStorage
	  localStorage.setItem('access_token', data.value.access);
	  localStorage.setItem('refresh_token', data.value.refresh);
	//   localStorage.setItem('user_id', data.value.user.UID); // Store UserID from the response
	  localStorage.setItem('user_data', JSON.stringify(data.value.user));
  
	  // Redirect to the dashboard or another protected page
	  router.push('/backend/dashboard');
	} catch (err) {
	  alert('Login failed. Please check your credentials.');
	  console.error('Login error:', err);
	}
  };
  </script> -->
=======
@media (max-width: 768px) {
  .image-background {
    background-image: none;
    background-color: #f5f5f5; 
  }
}
</style>
>>>>>>> 7a6a73f4385a12dae435ab5762d85d2ece83ccaa
