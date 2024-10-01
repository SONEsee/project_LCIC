<template class="">
    <div class="">
      <h2>All Users</h2>
  
  
    </div>
    <v-row>
        <v-col>
          <v-sheet class="pa-2 ma-2">
            User Member
          </v-sheet>
        </v-col>
  
        <v-spacer></v-spacer>
  
        <v-col>
          <v-sheet class="pa-2 ma-2">
            <RouterLink to="../manageuser/create_user"><v-icon icon="mdi-plus-circle" color="blue-darken-4 float-right mr-5" class="ml-2"></v-icon></RouterLink>
          </v-sheet>
        </v-col>
      </v-row>
  
    <v-card class="mx-auto my-4" elevation="4" rounded>
      <v-data-table :items="users" class="bg-grey-lighten-5 rounded-table">
        <thead>
          <tr>
            <th>UID</th>
            <th>Username</th>
            <th>NameL</th>
            <th>NameE</th>
            <th>SurnameL</th>
            <th>SurnameE</th>
            <th>Active</th>
            <th>Operation</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.UID">
            <td>{{ user.UID }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.nameL }}</td>
            <td>{{ user.nameE }}</td>
            <td>{{ user.surnameL }}</td>
            <td>{{ user.surnameE }}</td>
            <td>
              <v-btn
                v-if="user.is_active" color="green" dark small rounded>Active</v-btn>
              <v-btn
                v-else
                color="red"
                dark
                small
                rounded
              >Inactive</v-btn>
            </td>
            <td>
                <!-- <nuxt-link :to="`../manageuser/edituser/${user.UID}`">
                <v-icon icon="mdi-pencil-box" color="blue-darken-4" class="mr-2"></v-icon>
                </nuxt-link> -->
                <nuxt-link :to="`../manageuser/edit_user?UID=${user.UID}`">
              <v-icon icon="mdi-pencil-box" color="blue-darken-4" class="mr-2"></v-icon>
            </nuxt-link>
               <v-btn icon="mdi-delete" color="red-darken-4" class="ml-2" @click="deleteUser(user.UID)"></v-btn>
            </td>
          </tr>
        </tbody>
      </v-data-table>
    </v-card>
  </template>
  
  <style scoped>
  .rounded-table {
    border-radius: 8px; /* Adjust the border radius as needed */
    overflow: hidden;   /* Ensures the table corners are rounded */
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Adds a drop shadow */
  }
  </style>
  
  
  <script lang="ts">
import Swal from 'sweetalert2';
  definePageMeta({
    middleware: 'auth',
    layout: "backend",
  });
  
  useHead({
    title: "Collect fees",
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
  data(): {
    users: any[],  // Array to store the user list
  } {
    return {
      users: [],
    };
  },
  
  async mounted(): Promise<void> {
    // Fetch users when the component mounts
    await this.fetchUsers();
  },

  methods: {
    // Method to fetch the user list
    async fetchUsers(): Promise<void> {
      try {
        const config = useRuntimeConfig();
        const response = await fetch(`${config.public.strapi.url}api/userList/`);
        const data = await response.json();
        this.users = data.all_user;
        console.log(this.users);  // Check the fetched users
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    },

    // Method to delete a user
    async deleteUser(UID: number): Promise<void> {
  try {
    const confirmDelete = await Swal.fire({
      title: 'Confirm deletion',
      text: `Are you sure you want to delete user with UID ${UID}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete user',
      cancelButtonText: 'No, cancel',
    });

    if (confirmDelete.isConfirmed) {
      const config = useRuntimeConfig();
      const response = await fetch(`${config.public.strapi.url}api/delete_user/${UID}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        Swal.fire({
          title: 'User deleted',
          text: `User with UID ${UID} deleted successfully.`,
          icon: 'success',
        });
        await this.fetchUsers();  // Re-fetch users after successful deletion
      } else {
        try {
          const errorData = await response.json();
          Swal.fire({
            title: 'Error deleting user',
            text: errorData,
            icon: 'error',
          });
        } catch (error) {
          Swal.fire({
            title: 'Error deleting user',
            text: 'Failed to parse error response.',
            icon: 'error',
          });
        }
      }
    }
  } catch (error) {
    Swal.fire({
      title: 'Error deleting user',
      text: error,
      icon: 'error',
    });
  }
},
    }
    };


  
  </script>