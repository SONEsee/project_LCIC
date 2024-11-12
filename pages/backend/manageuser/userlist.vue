<template>
  <div class="">
    <h2 class="head-user">ການຈັດການຜູ້ນໍາໃຊ້ລະບົບ</h2>

    <v-row>
      <v-col cols="12" md="6">
        <v-sheet class="pa-2 ma-2">
          <SearchFilter @searchQuery="filterUsers" />
        </v-sheet>
      </v-col>
      <v-col cols="12" md="6" class="d-flex justify-end">
        <v-sheet class="pa-2 ma-2">
          <v-btn
            :to="'../manageuser/create_user'"
            color="indigo-darken-4"
            elevation="2"
          >
            <v-icon left class="pr-1">mdi-plus-circle</v-icon>
            ເພື່ມຜູ້ນໍາໃຊ້
          </v-btn>
        </v-sheet>
      </v-col>
    </v-row>

    <v-card class="mx-auto my-4" elevation="4" rounded>
    <div class="table-responsive">
      <v-data-table :items="filteredUsers" class="bg-grey-lighten-5 rounded-table">
        <!-- Table Header -->
        <thead class="blue darken-4">
          <tr class="bg-header wrap-text custom-width-name">
            <th>ລະຫັດຜູ້ນໍາໃຊ້</th>
            <th>ລະຫັດທນຄ</th>
            <th>ຊື່ຜູ້ນໍາໃຊ້</th>
            <th class="wrap-text custom-width-name">ຊື່</th>
            <th class="">ນາມສະກຸນ</th>
            <th>ສິດຜູ້ນໍາໃຊ້</th>
            <th>ສະມາຊິກ</th>
            
            <th>ເຂົ້າລະບົບ</th>
            <th>ສະຖານະ</th>
            <th>ເຫດການ</th>
          </tr>
        </thead>

        <!-- Table Body -->
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.UID" class="">
            <td>{{ user.UID }}</td>
            <td class="">{{ user.bnk_code }}</td>
            <td class="wrap-text custom-width-name">{{ user.bnk_name }}</td>
            <td class="">{{ user.username }}</td>
            <td class="wrap-text custom-width-name">{{ user.Permission }}</td>
            <td class="wrap-text custom-width-name">{{ user.nameL }} {{ user.surnameL }}</td>
            <td class="wrap-text custom-width-name">{{ user.nameE }} {{ user.surnameE }}</td>
            <td class="wrap-text custom-width-name">{{ user.last_login }}</td>
            <td>
              <p v-if="user.is_active" class="custom-box">Active</p>
              <p v-else>Inactive</p>
            </td>
            <td class="action-icons">
              <!-- Edit Icon -->
              <NuxtLink :to="`../manageuser/edit_user?UID=${user.UID}`">
                <Icon name="uil:edit" class="icon-user" />
              </NuxtLink>

              <!-- Delete Icon -->
              <Icon 
                name="uil:trash" 
                @click="deleteUser(user.UID)" 
                class="icon-user ml-2"
                style="cursor: pointer; color: red;" 
              />
            </td>
          </tr>
        </tbody>
      </v-data-table>
    </div>
  </v-card>

  </div>
</template>

<style>
.table-responsive {
  overflow-x: auto;
}
.bg-header{
  background-color: rgba(218, 218, 218, 0.719);
  font-size:100%;
}
.wrap-text {
  white-space: normal; /* Allow text to wrap */
  word-wrap: break-word; /* Break long words if necessary */
  max-width: 150px; /* Set a maximum width for the column */
}
.rounded-table {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.head-user {
  font-weight: bold;
}
.icon-user{
  display: inline-block;
  font-size: 20px;
}

.action-icons {
  display: flex;
  align-items: center;
  gap: 8px; /* Adjust space between icons */
}
.custom-box {
  width: 100%;
  background-color: #ccffcc; /* Light green background */
  color: #32cd32; /* Lemon green text */
  border: 1px solid #009400FF; /* Dark green border */
  border-radius: 10px; /* Rounded corners */
  padding: 3px; /* Padding inside the box */
  font-size: 10px; /* Text size */
  text-align: center; /* Center align the text */
}
.custom-width-name {
  width: 30%; /* Adjust the width as needed */
  white-space: nowrap; /* Prevents text from wrapping */
  overflow: hidden; /* Ensures the overflow is hidden */
  text-overflow: ellipsis; /* Adds ellipsis (...) to clipped text */
}


.custom-width-surname {
  width: 30%; /* Adjust the width as needed */
  white-space: nowrap; /* Prevents text from wrapping */
  overflow: hidden; /* Ensures the overflow is hidden */
  text-overflow: ellipsis; /* Adds ellipsis (...) to clipped text */

}
</style>



<script lang="ts">
// import SearchFilter from '@/components/SearchFilter.vue';

import Swal from 'sweetalert2';
definePageMeta({
  middleware: 'auth',
  layout: 'backend',
});

export default {
  data(): { users: any[], filteredUsers: any[] } {
    return {
      users: [], // Original users list
      filteredUsers: [], // Filtered users list
    };
  },
  // components: {
  //   SearchFilter,
  // },
  async mounted(): Promise<void> {
    await this.fetchUsers(); // Fetch users on mount
  },
  methods: {
    // Method to fetch the user list
    async fetchUsers(): Promise<void> {
      try {
        const config = useRuntimeConfig();
        const response = await fetch(`${config.public.strapi.url}api/userList/`);
        const data = await response.json();
        this.users = data.all_user;
        this.filteredUsers = data.all_user; // Initially, all users are shown
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    },
    // Method to filter users based on search query
    filterUsers(searchQuery: string): void {
      this.filteredUsers = this.users.filter((user) =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
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
            await this.fetchUsers(); // Re-fetch users after successful deletion
          } else {
            const errorData = await response.json();
            Swal.fire({
              title: 'Error deleting user',
              text: errorData,
              icon: 'error',
            });
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
  },
};
</script>
