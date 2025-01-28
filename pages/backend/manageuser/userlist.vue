<template>
  <div class="">
    <h2 class="head-user">ການຈັດການຜູ້ນໍາໃຊ້ລະບົບ</h2>
    <v-card class="">
      <v-tabs
        v-model="tab"
        class="d-flex justify-center align-center"
        fixed-tabs
      >
        <v-tab value="one">ກຳນົດສິດນຳໃຊ້ລະບົບ</v-tab>
        <v-tab value="two">ການອອກ User</v-tab>
      </v-tabs>

      <v-window v-model="tab">
        <v-window-item value="one"> <ManageUserModeration /> </v-window-item>
        <v-window-item value="two">
          <v-row>
            <v-col cols="12" md="6">
              <v-sheet class="pa-2 ma-2">
                <SearchFilter @searchQuery="filterUsers" />
              </v-sheet>

              <v-sheet class="pa-2 ma-2">
                <v-select
                v-model="selectedMember"
                :items="members"
                item-title="code" 
                item-value="id"
                label="Select Member"
                placeholder="Choose a member"
                outlined
              ></v-select>
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
              <v-data-table
                :items="filteredUsers"
                :headers="headers"
                items-per-page="12"
                class="bg-grey-lighten-5 rounded-table"
              >
                <template v-slot:item.profile="{ item }">
                  <v-avatar>
                    <v-img
                      alt="John"
                      src="https://cdn.vuetifyjs.com/images/john.jpg"
                    ></v-img>
                  </v-avatar>
                </template>
                <template v-slot:item.status="{ item }">
                  <p v-if="item.is_active" class="custom-box">Active</p>
                  <p v-else>Inactive</p>
                </template>
                <template v-slot:item.action="{ item }">
                  <div class="d-flex justify-end">
                    <NuxtLink :to="`../manageuser/edit_user?UID=${item.UID}`">
                      <v-icon icon="mdi-pencil" class="mr-2"></v-icon>
                    </NuxtLink>

                    <v-icon
                      icon="mdi-delete-outline"
                      style="color: red"
                      @click="deleteUser(item.UID)"
                    ></v-icon>
                  </div>
                </template>
              </v-data-table>
            </div>
          </v-card>
        </v-window-item>
      </v-window></v-card
    >
  </div>
</template>

<style>
.table-responsive {
  overflow-x: auto;
}
.bg-header {
  background-color: rgba(218, 218, 218, 0.719);
  font-size: 100%;
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
.icon-user {
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
  border: 1px solid #009400ff; /* Dark green border */
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
const tab = ref(null);
// import SearchFilter from '@/components/SearchFilter.vue';
import modo from "@/pages/backend/moderation/index.vue";
import Swal from "sweetalert2";
definePageMeta({
  middleware: "auth",
  layout: "backend",
});

useHead({
  title: "Manage Users",
});
const headers = [
  // { title: "ລະຫັດຜູ້ນຳໃຊ້", value: "UID" },
  { title: "ລະຫັດທນຄ", value: "bnk_code" },
  { title: "ສະມາຊິກ", value: "bnk_name" },
  { title: "ຊື່ຜູ້ນຳໃຊ້", value: "username" },
  { title: "ສິດທິນຳໃຊ້", value: "Permission" },
  { title: "ເຂົ້ານຳໃຊ້ລະບົບ", value: "last_login" },
  { title: "ຮູບໂປຣຟາຍ", value: "profile" },
  { title: "ສະຖານະ", value: "status" },
  { title: "ລາຍລະອຽດ", value: "action" },
];
const members = ref([]);
const selectedMember = ref(null);
export default {
  data(): { users: any[]; filteredUsers: any[] } {
    return {
      users: [],
      filteredUsers: [],
      headers,
      tab,
      modo,
      members,
    };
  },
  // components: {
  //   SearchFilter,
  // },
  async mounted(): Promise<void> {
    await this.fetchUsers(); // Fetch users on mount
    await this.fetchMembers();
  },
  methods: {
    async fetchUsers(): Promise<void> {
      try {
        const config = useRuntimeConfig();
        const response = await fetch(
          `${config.public.strapi.url}api/userList/`
        );
        const data = await response.json();
        this.users = data.all_user;
        this.filteredUsers = data.all_user;
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },
    async fetchMembers(): Promise<void> {
      try {
        const config = useRuntimeConfig();
        const response = await fetch(`${config.public.strapi.url}api/memberinfo/`);
        if (!response.ok) {
          throw new Error(`API Error: ${response.statusText}`);
        }
        const data = await response.json();
        // Assuming the response is an array of members
        members.value = data;

        console.log("===========> Members",members.value);
        
      } catch (error) {                               
        console.error('Error fetching members:', error);
      }
    },

    filterUsers(searchQuery: string): void {
      this.filteredUsers = this.users.filter((user) =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
    },

    async deleteUser(UID: number): Promise<void> {
      try {
        const confirmDelete = await Swal.fire({
          title: "Confirm deletion",
          text: `Are you sure you want to delete user with UID ${UID}?`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, delete user",
          cancelButtonText: "No, cancel",
        });

        if (confirmDelete.isConfirmed) {
          const config = useRuntimeConfig();
          const response = await fetch(
            `${config.public.strapi.url}api/delete_user/${UID}/`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (response.ok) {
            Swal.fire({
              title: "User deleted",
              text: `User with UID ${UID} deleted successfully.`,
              icon: "success",
            });
            await this.fetchUsers();
          } else {
            const errorData = await response.json();
            Swal.fire({
              title: "Error deleting user",
              text: errorData,
              icon: "error",
            });
          }
        }
      } catch (error) {
        Swal.fire({
          title: "Error deleting user",
          text: error,
          icon: "error",
        });
      }
    },
  },
};
</script>
