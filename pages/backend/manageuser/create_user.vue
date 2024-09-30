<template>
    <div>
      <ManageUserAddUser/>
    </div>
    <v-container class="elevation-4">
      <div>
        <h3>Personal Name</h3>
        <v-row no-gutters>
          <v-col>
            <v-sheet class=" ma-2">
              <v-text-field v-model="form.firstnameLao" label="Firstname Lao"></v-text-field>
            </v-sheet>
          </v-col>
          <v-col>
            <v-sheet class="ma-2">
              <v-text-field v-model="form.surnameLao" label="Surname Lao"></v-text-field>
            </v-sheet>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col>
            <v-sheet class=" ma-2">
              <v-text-field v-model="form.firstnameEng" label="Firstname English"></v-text-field>
            </v-sheet>
          </v-col>
          <v-col>
            <v-sheet class="ma-2">
              <v-text-field v-model="form.surnameEng" label="Surname English"></v-text-field>
            </v-sheet>
          </v-col>
        </v-row>
      </div>
  
      <v-responsive width="100%"></v-responsive>
  
      <div>
        <h3>Member Info</h3>
        <v-row no-gutters>
          <v-col>
            <v-sheet class=" ma-2">
              <v-text-field v-model="form.username" label="Username"></v-text-field>
            </v-sheet>
          </v-col>
          <v-col>
            <v-sheet class=" ma-2">
              <!-- <v-text-field v-model="form.member" label="Member"></v-text-field> -->
              <v-combobox v-model="form.selectedBank" :items="banks" item-title="bnk_short_form" item-value="bnk_sys_id" label="Bank" outlined return-object></v-combobox>
            </v-sheet>
          </v-col>
          <v-col>
            <v-sheet class=" ma-2">
              <v-text-field v-model="form.groupUser" label="GroupUser"></v-text-field>
            </v-sheet>
          </v-col>
        </v-row>
      </div>
  
      <div>
        <h3>Password</h3>
        <v-row no-gutters>
          <v-col>
            <v-sheet class=" ma-2">
              <v-text-field v-model="form.password" label="Password" type="password"></v-text-field>
            </v-sheet>
          </v-col>
          <v-col>
            <v-sheet class="ma-2">
              <v-text-field v-model="form.confirmPassword" label="Confirm Password" type="password"></v-text-field>
            </v-sheet>
          </v-col>
        </v-row>
      </div>
  
      <v-btn @click="submitForm">Create User</v-btn>
    </v-container>
  </template>
  
  <script lang="ts">
  import { ref } from 'vue';
  definePageMeta({
    middleware:['auth'],
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
  
  
  export default {
    setup() {
      const form = ref({
        firstnameLao: '',
        surnameLao: '',
        firstnameEng: '',
        surnameEng: '',
        username: '',
        selectedBank: null,
        groupUser: '',
        password: '',
        confirmPassword: ''
      });
  

      const banks = ref([]);
      const selectdBank = ref(null);
      const submitForm = async () => {

          const response = await fetch('http://127.0.0.1:8000/api/create_user/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              nameL: form.value.firstnameLao,
              surnameL: form.value.surnameLao,
              nameE: form.value.firstnameEng,
              surnameE: form.value.surnameEng,
              username: form.value.username,
              MID: form.value.selectedBank.bnk_sys_id, 
              GID: form.value.groupUser,
              password: form.value.password,
              confirmPassword: form.value.confirmPassword
            }),
          });
  
          if (!response.ok) {
            throw new Error('Failed to create user');
          }
        else{
            const data = await response.json();
            console.log('User created successfully:', data);
          // You can show a success notification or redirect the user here
        }


  
      
    };

    const fetchBanks = async () => {
        try {
          const response = await fetch('http://127.0.0.1:8000/api/bank/');
          const data = await response.json();
          banks.value = data;  // Assign the fetched banks to the banks array
          console.log("Fetched Banks:", banks.value);
        } catch (error) {
          console.error('Error fetching banks:', error);
        }
      };
  
      // Fetch bank data when component is mounted
      onMounted(() => {
        fetchBanks();
      });

          

          return { form, submitForm, banks };
}
        };
  
      
  </script>
  