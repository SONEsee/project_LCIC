
<script setup lang="ts">

	useHead({
		title: 'Sign In',
		meta: [
		{ 
			name: 'description', 
			content: 'Sign In Nuxt 3, IT Genius Engineering' 
		},
		{
			name: 'keywords',
			content: 'Sign In, Nuxt 3, Learning Nuxt 3'
		},
		],
	})

	// sweetalert2
	const { $swal } = useNuxtApp()

	// create const for useCookie()
	const token = useCookie('token', {
		maxAge: 60 * 60, // 1 hour
		// expires: new Date(Date.now() + 60 * 60 * 24 * 7), // 1 week
	})

	// ref const for username and password
	const username = ref('')
	const password = ref('')

	// useFormRules() for username and password
	const { ruleRequired, rulePassLen } = useFormRules()

	// useRoute() for redirect
	const router = useRouter()

	// submit form
	const submit = async () => {

		// check form is valid
		if (ruleRequired(username.value) == true && rulePassLen(password.value) == true) {

			// useRuntimeConfig() for get env
			const config = useRuntimeConfig()
			const STRAPI_URL: string = config.strapi.url

			// login strapi with usefetch()
			const { data, error } = await useFetch(`${STRAPI_URL}/login/`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					"username": username.value,
					"password": password.value
				}),
			})

			// check error
			if (error.value != null) { // error
				
				if(error.value.status === 400){
					$swal.fire({
						icon: 'error',
						title: 'Login Failed',
						text: 'Please check your username and password.',
						confirmButtonText: 'Close'
					})
				}else{
					console.log('Request failed:', error.value.message)
				}

			}else{ // success

				let timerInterval: any
				$swal.fire({
					title: 'ກຳລັງເຂົ້າສູ່ລະບົບ',
					html: 'ກາລຸນາລໍຖ້າອີກ <b></b> ວິນາທີ',
					timer: 3000,
					timerProgressBar: true,
					didOpen: () => {
						$swal.showLoading()
						timerInterval = setInterval(() => {
						const content = $swal.getHtmlContainer()
						if (content) {
							const b = content.querySelector('b')
							if (b) {
								b.textContent = $swal.getTimerLeft() / 1000
							}
						}
						}, 100)
					},
					willClose: () => {
						clearInterval(timerInterval)
					}
				}).then(async (result: any) => {
					if(result.dismiss === $swal.DismissReason.timer) {

						// set token to cookie
						token.value = (data as { value: { jwt: string } }).value.jwt

						// redirect to dashboard
						await router.push({path:'/backend/dashboard'})
					}
				})

			}

		}

	}
</script>

<template>
	<VContainer fluid class="fill-height pa-0">
		<VRow no-gutters align="center" justify="center" class="fill-height">
            <VCol class="hidden-sm-and-down fill-height" md="6" lg="6">
				<VImg
					src="https://gallery.yopriceville.com/var/albums/Abstract/Aqua_Blue.jpg?m=1629740799"
					cover
					class="h-100 rounded-xl rounded-ts-0 rounded-bs-0 d-flex align-center justify-center"
				>
					<div class="text-center w-50 text-white mx-auto">
						<img src="../assets/images/logo1.png" alt="" style="width: 200px;">
						<h1 class="mb-4">ຍິນດີຕ້ອນຮັບເຂົ້າສູ່ລະບົບ LCIC.</h1>
						<p>
							ບໍລິສັດ ຂໍ້ມູນຂ່າວສານສິນເຊື່ອແຫ່ງ ສປປ ລາວ!
						</p>
					</div>
				</VImg>
			</VCol>
			<VCol cols="12" md="6" lg="6" sm="6">
				<VRow no-gutters align="center" justify="center">
					<VCol cols="12" md="6" class="pa-3">
						<h1>
ເຂົ້າ​ສູ່​ລະ​ບົບ</h1>
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
							<span
								>ຍັງບໍ່ທັນເປັນສະມາຊິກບໍ ?
								<NuxtLink to="/signup"
									style="font-family: Noto Sans Lao;text-decoration: none;">ລົງທະບຽນທີ່ນີ້</NuxtLink
								></span
							>
						</p>
					</VCol>
				</VRow>
			</VCol>
		</VRow>
	</VContainer>
</template>
