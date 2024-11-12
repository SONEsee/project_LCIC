<template>
  <div>
    <ManageUserAddUser />
  </div>
  <v-container class="elevation-4">
    <div>
      <h3>Personal Name</h3>
      <v-row no-gutters>
        <v-col>
          <v-sheet class="ma-2">
            <v-text-field
              v-model="form.firstnameLao"
              label="Firstname Lao"
            ></v-text-field>
          </v-sheet>
        </v-col>
        <v-col>
          <v-sheet class="ma-2">
            <v-text-field
              v-model="form.surnameLao"
              label="Surname Lao"
            ></v-text-field>
          </v-sheet>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <v-sheet class="ma-2">
            <v-text-field
              v-model="form.firstnameEng"
              label="Firstname English"
            ></v-text-field>
          </v-sheet>
        </v-col>
        <v-col>
          <v-sheet class="ma-2">
            <v-text-field
              v-model="form.surnameEng"
              label="Surname English"
            ></v-text-field>
          </v-sheet>
        </v-col>
      </v-row>
    </div>

    <v-responsive width="100%"></v-responsive>

    <div>
      <h3>Member Info</h3>
      <v-row no-gutters>
        <v-col>
          <v-sheet class="ma-2">
            <v-text-field
              v-model="form.username"
              label="Username"
            ></v-text-field>
          </v-sheet>
        </v-col>
        <v-col>
          <v-sheet class="ma-2">
            <v-combobox
              v-model="form.selectedBank"
              :items="banks"
              item-title="code"
              item-value="id"
              label="Bank"
               variant="outlined"

              return-object
            ></v-combobox>
          </v-sheet>
        </v-col>
        <v-col>
          <v-sheet class="ma-2">
            <v-text-field
              v-model="form.groupUser"
              label="GroupUser"
            ></v-text-field>
          </v-sheet>
        </v-col>
      </v-row>
    </div>

    <div>
      <h3>Password</h3>
      <v-row no-gutters>
        <v-col>
          <v-sheet class="ma-2">
            <v-text-field
              v-model="form.password"
              label="Password"
              type="password"
            ></v-text-field>
          </v-sheet>
        </v-col>
        <v-col>
          <v-sheet class="ma-2">
            <v-text-field
              v-model="form.confirmPassword"
              label="Confirm Password"
              type="password"
            ></v-text-field>
          </v-sheet>
        </v-col>
      </v-row>
    </div>

    <v-btn @click="submitForm">Update User</v-btn>
  </v-container>
</template>

<script lang="ts">
import Swal from "sweetalert2";
definePageMeta({
  middleware: ["auth"],
  layout: "backend",
});

import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

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
    const route = useRoute(); // Access route parameters
    const UID = route.query.UID; // Get UID from the URL

    // Function to fetch user data for editing
    const fetchUserData = async (UID) => {
      try {
        const config = useRuntimeConfig();
        const response = await fetch(
          `${config.public.strapi.url}api/get_user/${UID}/`
        );
        const data = await response.json();
        form.value.firstnameLao = data.nameL;
        form.value.surnameLao = data.surnameL;
        form.value.firstnameEng = data.nameE;
        form.value.surnameEng = data.surnameE;
        form.value.username = data.username;
        form.value.selectedBank = data.MID; // Assuming MID contains bank info
        form.value.groupUser = data.GID; // Assuming GID contains group info
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    // Function to fetch available banks
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

    // Function to submit form for updating user
    const submitForm = async () => {
      try {
        const config = useRuntimeConfig();
        const response = await fetch(
          `${config.public.strapi.url}api/update_user/${UID}/`,
          {
            method: "PUT",
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
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update user");
        } else {
          const data = await response.json();
          console.log("User updated successfully:", data);

        
          Swal.fire({
            icon: "success",
            title: "Update Successful",
            text: "User has been updated successfully!",
            confirmButtonText: "OK",
          });
        }
      } catch (error) {
        console.error("Error updating user:", error);
        // Optional: You can also show an error alert using SweetAlert2
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: error.message,
        });
      }
    };

    // Fetch user data and banks when component is mounted
    onMounted(() => {
      fetchUserData(UID);
      fetchBanks();
    });

    return { form, submitForm, banks };
  },
};
</script>
