<template>
  <div>
    <ManageUserAddUser />
  </div>
  <v-container class="elevation-4">
    
      <h3>Personal Name</h3>
      <v-row no-gutters>
        <v-col cols="12" md="4">
          <v-sheet class="ma-2">
            <v-text-field
              v-model="form.firstnameLao"
              label="Firstname Lao"
            ></v-text-field>
          </v-sheet>
        </v-col>
        <v-col cols="12" md="4">
          <v-sheet class="ma-2">
            <v-text-field
              v-model="form.surnameLao"
              label="Surname Lao"
            ></v-text-field>
          </v-sheet>
        </v-col>
      
      
        <v-col cols="12" md="4">
          <v-sheet class="ma-2">
            <v-text-field
              v-model="form.firstnameEng"
              label="Firstname English"
            ></v-text-field>
          </v-sheet>
        </v-col>
        <v-col cols="12" md="4">
          <v-sheet class="ma-2">
            <v-text-field
              v-model="form.surnameEng"
              label="Surname English"
            ></v-text-field>
          </v-sheet>
        </v-col>
      
    

    <!-- <v-responsive width="100%"></v-responsive> -->

  
      <!-- <h3>Member Info</h3> -->
      
        <v-col cols="12" md="4">
          <v-sheet class="ma-2">
            <v-text-field
              v-model="form.username"
              label="Username"
            ></v-text-field>
          </v-sheet>
        </v-col>
        <v-col cols="12" md="4">
          <v-sheet class="ma-2">
            <!-- <v-text-field v-model="form.member" label="Member"></v-text-field> -->
            <v-combobox
              v-model="form.selectedBank"
              :items="banks"
              item-title="code"
              item-value="id"
              label="Bank"
              outlined
              return-object
            ></v-combobox>
          </v-sheet>
        </v-col>
        <v-col cols="12" md="4">
          <v-sheet class="ma-2">
            <v-text-field
              v-model="form.groupUser"
              label="GroupUser"
            ></v-text-field>
          </v-sheet>
        </v-col>
     


   
      <!-- <h3>Password</h3> -->
      
        <v-col cols="12" md="4">
          <v-sheet class="ma-2">
            <v-text-field
              v-model="form.password"
              label="Password"
              type="password"
            ></v-text-field>
          </v-sheet>
        </v-col>
        <v-col cols="12" md="4">
          <v-sheet class="ma-2">
            <v-text-field
              v-model="form.confirmPassword"
              label="Confirm Password"
              type="password"
            ></v-text-field>
          </v-sheet>
        </v-col>
      
        <div>
        <h1>ການອັບໂຫຼດຮູບພາບ</h1>
        <div v-if="user">
          {{ user.MID.id }}
        </div>
        <v-col cols="12">
          <v-file-input
            v-model="files"
            :show-size="1000"
            color="deep-purple-accent-4"
            label="ອັບໂຫຼດຮູບພາບ"
            placeholder="Select your files"
            prepend-icon="mdi-camera"
            variant="outlined"
            counter
            multiple
          >
            <template v-slot:selection="{ fileNames }">
              <template v-for="(fileName, index) in fileNames" :key="fileName">
                <v-chip
                  v-if="index < 2"
                  class="me-2"
                  color="deep-purple-accent-4"
                  size="small"
                  label
                >
                  {{ fileName }}
                </v-chip>
  
                <span
                  v-else-if="index === 2"
                  class="text-overline text-grey-darken-3 mx-2"
                >
                  +{{ files.length - 2 }} ຮູບ(s)
                </span>
              </template>
            </template>
          </v-file-input>
          <v-btn color="primary" @click="uploadFiles" class="ml-9">ອັບໂຫຼດ</v-btn>
        </v-col>
      </div>

    <v-btn @click="submitForm">Create User</v-btn></v-row>
  </v-container>
</template>

<script lang="ts">
import { ref } from "vue";
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
      content: "Order Nuxt 3,  IT Genius Engineering",
    },
  ],
});
const files = ref<File[]>([]);
      const collaterals = ref([]);
      const user = ref<User | null>(null);




      
      const uploadFiles = async () => {
        const formData = new FormData();
  
        files.value.forEach((file) => {
          formData.append("image", file);
        });
  
        if (user.value && user.value.MID) {
          
          formData.append("user_mid_id", user.value.MID.id);
        }
  
        try {
          const config = useRuntimeConfig();
          const response = await axios.post(
            `${config.public.strapi.url}api/api/upload_image/`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );
          console.log(response.data);
          await Swal.fire({
            title: "ສຳເລັດ!",
            text: "ອັບໂຫຼດຮູບພາບສຳເລັດແລ້ວ!",
            icon: "success",
            confirmButtonText: "OK",
          }).then(() => {
            location.reload();
          });
          fetchCollaterals();
        } catch (error) {
          console.error(error.response ? error.response.data : error.message);
          Swal.fire({
            title: "ຜິດພາດ!",
            text: error.response ? error.response.data : error.message,
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      };
  
export default {
  setup() {
    const form = ref({
      firstnameLao: "",
      surnameLao: "",
      firstnameEng: "",
      surnameEng: "",
      username: "",
      selectedBank: null,
      groupUser: "",
      password: "",
      confirmPassword: "",
    });

    const banks = ref([]);
    const selectdBank = ref(null);
    const submitForm = async () => {
      const config = useRuntimeConfig();
      const response = await fetch(`${config.public.strapi.url}api/create_user/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nameL: form.value.firstnameLao,
          surnameL: form.value.surnameLao,
          nameE: form.value.firstnameEng,
          surnameE: form.value.surnameEng,
          username: form.value.username,
          MID: form.value.selectedBank.id,
          GID: form.value.groupUser,
          password: form.value.password,
          confirmPassword: form.value.confirmPassword,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create user");
      } else {
        const data = await response.json();
        console.log("User created successfully:", data);
        // You can show a success notification or redirect the user here
      }
    };

    const fetchBanks = async () => {
      try {
        const config = useRuntimeConfig();
        const response = await fetch(`${config.public.strapi.url}api/memberinfo/`);
        const data = await response.json();
        banks.value = data;
      } catch (error) {
        console.error("Error fetching banks:", error);
      }
    };

    // Fetch bank data when component is mounted
    onMounted(() => {
      fetchBanks();
    });

    return { form, submitForm, banks, files,
        uploadFiles,
        collaterals,
        
        user, };
  },
};
</script>
