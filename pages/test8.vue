<template>
  <v-container>
    <v-row justify="space-between" class="mb-4">
      <v-col cols="12" md="6">
        <h1 class="text-h5 font-weight-bold">User Management</h1>
      </v-col>
      <v-col cols="12" md="6" class="text-right">
        <v-btn color="primary" @click="openCreateDialog = true">
          <v-icon left>mdi-account-plus</v-icon>
          Create User
        </v-btn>
      </v-col>
    </v-row>

    <v-data-table
      :headers="headers"
      :items="users"
      item-value="id"
      class="elevation-1"
    >
      
      <template #item.profile_image="{ item }">
        <v-avatar size="40">
          <v-img
            :src="
              item.profile_image
                ? getImageUrl(item.profile_image)
                : '/default-avatar.png'
            "
            alt="Profile"
          />
        </v-avatar>
      </template>

      <template #item.actions="{ item }">
        <v-icon color="primary" class="mr-2" @click="editUser(item)"
          >mdi-pencil</v-icon
        >
        <v-icon color="red" @click="deleteUser(item.id)">mdi-delete</v-icon>
      </template>
    </v-data-table>

    <v-dialog v-model="openCreateDialog" max-width="900">
      <v-card>
        <v-card-title>ສ້າງຜູ້ໃຊ້ງານ</v-card-title>
        <v-card-text>
          <v-form ref="form" @submit.prevent="submit">
            <v-row>
              <v-col cols="12" md></v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="3">
            <v-autocomplete
              density="compact"
              label="ເລືອກທະນາຄານ"
              :items="bnk"
              item-title="bnk_short_form"
              item-value="id"
              variant="outlined"
            >
              <template v-slot:item="{ props, item }">
                <v-list-item
                  v-bind="props"
                  :subtitle="item.raw.bnk_code"
                  :title="item.raw.bnk_short_form"
                ></v-list-item>
              </template>
            </v-autocomplete></v-col>
            <v-col cols="12" md="3">
            <v-text-field
            density="compact"
              v-model="req.branch_code"
              label="Branch Code"
              :rules="[(v) => !!v || 'Branch Code is required']"
              required
            /></v-col>
            <v-col cols="12" md="3">
            <v-text-field
            density="compact"
              v-model="req.username"
              label="Username"
              :rules="[(v) => !!v || 'Username is required']"
              required
            /></v-col><v-col cols="12" md="3">
            <v-text-field
            density="compact"
              v-model="req.password"
              label="Password"
              type="password"
              :rules="[(v) => !!v || 'Password is required']"
              required
            /></v-col>
            <v-col cols="12" md="3">
            <v-text-field

            density="compact"
              v-model="req.nameL"
              label="Local First Name"
              :rules="[(v) => !!v || 'Local First Name is required']"
              required
            /></v-col>
            <v-col cols="12" md="3">
            <v-text-field
            density="compact"
              v-model="req.nameE"
              label="English First Name"
              :rules="[(v) => !!v || 'English First Name is required']"
              required
            /></v-col>
            <v-col cols="12" md="3">
            <v-text-field
            density="compact"
              v-model="req.surnameL"
              label="Local Last Name"
              :rules="[(v) => !!v || 'Local Last Name is required']"
              required
            /></v-col>
            <v-col cols="12" md="3">
            <v-text-field
            density="compact"
              v-model="req.surnameE"
              label="English Last Name"
              :rules="[(v) => !!v || 'English Last Name is required']"
              required
            /> </v-col>
            <v-col cols="12" md="3">
            <v-text-field
            density="compact"
              v-model="req.roles"
              label="Roles"
              :rules="[(v) => !!v || 'Roles is required']"
              required
            /></v-col>
            <v-file-input
              v-model="req.profile_image"
              label="Profile Image"
              accept="image/*"
              prepend-icon="mdi-camera"
              :rules="[
                (v) =>
                  !v ||
                  (Array.isArray(v) && v[0] && v[0].size < 5000000) ||
                  'Image size should be less than 5 MB',
              ]"
            />
          </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="closeCreateDialog">Cancel</v-btn>
          <v-btn color="primary" type="submit">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="openEditDialog" max-width="600">
      <v-card>
        <v-card-title>Edit User</v-card-title>
        <v-card-text>
          <v-form ref="editFormRef" @submit.prevent>
            <v-text-field
              v-model="editForm.bnk_code"
              label="Bank Code"
              :rules="[(v) => !!v || 'Bank Code is required']"
              required
            />
            <v-text-field
              v-model="editForm.branch_code"
              label="Branch Code"
              :rules="[(v) => !!v || 'Branch Code is required']"
              required
            />
            <v-text-field
              v-model="editForm.nameL"
              label="Local First Name"
              :rules="[(v) => !!v || 'Local First Name is required']"
              required
            />
            <v-text-field
              v-model="editForm.nameE"
              label="English First Name"
              :rules="[(v) => !!v || 'English First Name is required']"
              required
            />
            <v-text-field
              v-model="editForm.surnameL"
              label="Local Last Name"
              :rules="[(v) => !!v || 'Local Last Name is required']"
              required
            />
            <v-text-field
              v-model="editForm.surnameE"
              label="English Last Name"
              :rules="[(v) => !!v || 'English Last Name is required']"
              required
            />
            <v-text-field
              v-model="editForm.roles"
              label="Roles"
              :rules="[(v) => !!v || 'Roles is required']"
              required
            />
            <v-file-input
              v-model="editForm.profile_image"
              label="Profile Image"
              accept="image/*"
              prepend-icon="mdi-camera"
              clearable
              show-size
              :rules="[
                (v) =>
                  !v ||
                  (Array.isArray(v) && v[0] && v[0].size < 5000000) ||
                  'Image size should be less than 5 MB',
              ]"
              @update:modelValue="onProfileImageUpdate"
            />
            <v-img
              v-if="editForm.profile_image_url && !editForm.profile_image"
              :src="editForm.profile_image_url"
              max-height="100"
              class="mt-2"
            />
            <v-img
              v-if="editForm.profile_image"
              :src="createObjectURL(editForm.profile_image[0])"
              max-height="100"
              class="mt-2"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="openEditDialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="updateUser">Update</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import Swal from "sweetalert2";
import { ref, onMounted, computed } from "vue";
import { useUserManageStore } from "~/stores/usermanage";
const manageStore = useUserManageStore();
const valid = ref(false);
const form = ref<HTMLFormElement | null>(null);
const req = manageStore.form_create_data;
const submit =async () => {
  if (
    !req.bnk_code ||
    !req.branch_code ||
    !req.username ||
    !req.password ||
    !req.nameL ||
    !req.nameE ||
    !req.surnameL ||
    !req.surnameE ||
    !req.roles
  ) {
    Swal.fire({
      icon: "warning",
      title: "ຂໍ້ຜິດພາດ",
      text: "ກະລຸນາປ້ອນຂໍ້ມູນທຸກຢາງ!",
      confirmButtonText: "ຕົກລົງ",
    });
    return;
  }
  if (!(await form.value?.validate())) {
    valid.value = false;
    Swal.fire({
      icon: "error",
      title: "ມີຂໍ້ຜິດພາດ",
      text: "ກວດການປ້ອນຂໍ້ມູນຄືນ",
      confirmButtonText: "ຕົກລົງ",
    });
    return;
  }
  valid.value = true;
  await manageStore.createUser();
  const notification = await Swal.fire({
    icon: "success",
    title: "ສໍາເລັດ",
    text: "ບັນທຶກຂໍ້ມູນສໍາເລັດ!",
    confirmButtonText: "ຕົກລົງ",
  });
  if(notification.isConfirmed){
    await manageStore.createUser();
  }
  
};
const bnk = computed(() => manageStore.respons_data_bnk);
console.log("Bank:", bnk.value);
onMounted(() => {
  manageStore.Getbak();
});
const config = useRuntimeConfig();
const users = ref([]);
const headers = [
  { title: "Bank Code", value: "bnk_code" },
  { title: "Username", value: "username" },
  { title: "Name", value: "nameE" },
  { title: "Roles", value: "roles" },
  { title: "Profile Image", value: "profile_image" },
  { title: "Actions", value: "actions", sortable: false },
];

// const form = ref({
//   bnk_code: "",
//   branch_code: "",
//   username: "",
//   password: "",
//   nameL: "",
//   nameE: "",
//   surnameL: "",
//   surnameE: "",
//   roles: "",
//   profile_image: null,
// });
const editForm = ref({});
const openCreateDialog = ref(false);
const openEditDialog = ref(false);
const editingUserId = ref(null);
const createFormRef = ref(null);
const editFormRef = ref(null);

const BASE_URL = `${config.public.strapi.url}`;

const getImageUrl = (path) => {
  if (!path) return "/default-avatar.png";
  return path.startsWith("http") ? path : `${BASE_URL}${path}`;
};

// Create object URL for previewing new image
const createObjectURL = (file) => {
  return file ? URL.createObjectURL(file) : "";
};

const fetchUsers = async () => {
  try {
    const response = await fetch(
      `${config.public.strapi.url}api/sys-list-user/`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );
    const data = await response.json();
    users.value = Array.isArray(data)
      ? data.map((user) => ({ ...user, id: user.id || user.pk }))
      : data.users
      ? data.users.map((user) => ({ ...user, id: user.id || user.pk }))
      : [];
    console.log("Users:", users.value);
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

const createUser = async () => {

//   if (!createFormRef.value.validate()) return;

//   const formData = new FormData();
//   console.log("Form before FormData:", form.value);
//   Object.keys(form.value).forEach((key) => {
//     if (key === "profile_image" && form.value[key]) {
//       console.log("Profile image:", form.value[key]);
//       if (
//         Array.isArray(form.value[key]) &&
//         form.value[key][0] instanceof File
//       ) {
//         formData.append(key, form.value[key][0]);
//       } else if (form.value[key] instanceof File) {
//         formData.append(key, form.value[key]);
//       } else {
//         console.warn("Profile image is not a valid File:", form.value[key]);
//       }
//     } else if (form.value[key] && key !== "profile_image") {
//       formData.append(key, form.value[key]);
//     }
//   });

//   for (let [key, value] of formData.entries()) {
//     console.log(`FormData: ${key} =`, value);
//   }

//   try {
//     const response = await fetch(
//       `${config.public.strapi.url}api/sys-add-user/`,
//       {
//         method: "POST",
//         body: formData,
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("access_token")}`,
//         },
//       }
//     );
//     const data = await response.json();
//     console.log("Create user response:", data);
//     if (response.ok) {
//       await fetchUsers();
//       form.value = {
//         bnk_code: "",
//         branch_code: "",
//         username: "",
//         password: "",
//         nameL: "",
//         nameE: "",
//         surnameL: "",
//         surnameE: "",
//         roles: "",
//         profile_image: null,
//       };
//       openCreateDialog.value = false;
//     } else {
//       console.error("Create user error:", data);
//       alert("Error: " + (data.error || "Failed to create user"));
//     }
//   } catch (error) {
//     console.error("Error creating user:", error);
//     alert("An error occurred while creating the user");
//   }
// };

// const closeCreateDialog = () => {
//   openCreateDialog.value = false;
//   form.value = {
//     bnk_code: "",
//     branch_code: "",
//     username: "",
//     password: "",
//     nameL: "",
//     nameE: "",
//     surnameL: "",
//     surnameE: "",
//     roles: "",
//     profile_image: null,
//   };
//   createFormRef.value.resetValidation();
};

const editUser = (user) => {
  console.log("Editing user:", user);
  if (!user.id) {
    console.error("User ID is missing:", user);
    alert("Cannot edit user: ID is missing");
    return;
  }
  editingUserId.value = user.id;
  editForm.value = {
    bnk_code: user.bnk_code,
    branch_code: user.branch_code,
    nameL: user.nameL,
    nameE: user.nameE,
    surnameL: user.surnameL,
    surnameE: user.surnameE,
    roles: user.roles,
    profile_image: null,
    profile_image_url: user.profile_image,
  };
  console.log("Initial editForm:", editForm.value); // Debug: Check initial form state
  openEditDialog.value = true;
};

const onProfileImageUpdate = (value) => {
  console.log("Profile image updated:", value); // Debug: Check v-file-input value
  editForm.value.profile_image = value ? [...value] : null; // Force reactivity
};

const updateUser = async () => {
  if (!editFormRef.value.validate()) return;
  if (!editingUserId.value) {
    alert("Error: User ID is missing");
    return;
  }

  const formData = new FormData();
  console.log("Edit form before FormData:", editForm.value); // Debug: Check form state
  Object.keys(editForm.value).forEach((key) => {
    if (key === "profile_image" && editForm.value[key]) {
      console.log("Profile image:", editForm.value[key]); // Debug: Check profile_image
      if (
        Array.isArray(editForm.value[key]) &&
        editForm.value[key][0] instanceof File
      ) {
        formData.append(key, editForm.value[key][0]);
      } else if (editForm.value[key] instanceof File) {
        formData.append(key, editForm.value[key]);
      } else {
        console.warn("Profile image is not a valid File:", editForm.value[key]);
      }
    } else if (key !== "profile_image_url" && editForm.value[key]) {
      formData.append(key, editForm.value[key]);
    }
  });

  // Debug: Log FormData contents
  for (let [key, value] of formData.entries()) {
    console.log(`FormData: ${key} =`, value);
  }

  // If no fields are included, warn the user
  if (![...formData.entries()].length) {
    alert(
      "No changes detected. Please modify at least one field or upload a new image."
    );
    return;
  }

  try {
    const response = await fetch(
      `${config.public.strapi.url}api/sys-detail-user/${editingUserId.value}/`,
      {
        method: "PUT",
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );
    const data = await response.json();
    console.log("Update user response:", data); // Debug: Check API response
    if (response.ok) {
      await fetchUsers();
      openEditDialog.value = false;
      editForm.value = {}; // Reset edit form
    } else {
      console.error("Update user error:", data);
      alert("Error: " + (data.error || "Failed to update user"));
    }
  } catch (error) {
    console.error("Error updating user:", error);
    alert("An error occurred while updating the user");
  }
};

const deleteUser = async (id) => {
  try {
    const response = await fetch(
      `${config.public.strapi.url}api/sys-detail-user/${id}/`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );
    if (response.ok) {
      await fetchUsers();
    } else {
      const data = await response.json();
      alert("Error: " + (data.error || "Failed to delete user"));
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    alert("An error occurred while deleting the user");
  }
};

onMounted(fetchUsers);
</script>
