<template>
    <div class="flex justify-end mb-4">
      <button
        @click="addSidebarItem"
        class="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
      >
        Add Sidebar Item
      </button>
    </div>
  <div class="p-4">
    <!-- Table -->
    <table class="modern-table">
      <thead>
        <tr>
          <th>ໜ້າຕ່າງ</th>
          <th
            v-for="role in roles"
            :key="role.id"
          >
            {{ role.name }}
          </th>
          <th>
            ຈັດການໜ້າຕ່າງ
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, rowIndex) in sidebarItems"
          :key="item.id"
        >
          <td class="item-name">{{ item.name }}</td>
          <td
            v-for="role in roles"
            :key="role.id"
          >
            <input
              type="checkbox"
              v-model="matrixSelections[rowIndex][role.id]"
              @change="() => onCheckboxChange(rowIndex, role.id)"
              class="form-checkbox"
            />
          </td>
          <td class="border border-gray-400 px-4 py-2">
            <button
              @click="editItem(item)"
              class="px-2 py-1 bg-green-500 rounded hover:bg-green-600 mr-2"
            >
              Edit
            </button>
            <button
              @click="deleteItem(item.id)"
              class="px-2 py-1 bg-red-500 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
            
    <!-- Save Changes Button -->
    <div class="mt-4">
      <button
        :disabled="!modified"
        @click="saveChanges"
        class="save-button"
      >
        Save Changes
      </button>
    </div>

    <!-- Debugging Output (Optional) -->
    <!-- <div class="mt-4">
      <h2 class="text-lg font-bold">Matrix Selections:</h2>
      <pre>{{ matrixSelections }}</pre>
    </div> -->
  </div>
  
</template>



<script lang="ts" setup>

import { ref, onMounted } from 'vue';
import axios from 'axios';

import Swal from "sweetalert2";
definePageMeta({
  middleware: "auth",
  layout: "backend",
});
// Define API endpoints
const rolesApi = "http://192.168.45.55:8000/api/roles/";
const sidebarItemsApi = "http://192.168.45.55:8000/api/sidebar-items/";
const updateSidebarApi = "http://192.168.45.55:8000/api/create_sidebar/"; // Use item ID for updates

// State variables
const roles = ref([]); // Headers
const sidebarItems = ref([]); // Rows
const matrixSelections = ref([]); // Checkbox states
const modified = ref(false); // Track changes

// Fetch data from APIs
const fetchData = async () => {
  try {
    // Fetch roles (headers)
    const rolesResponse = await axios.get(rolesApi);
    roles.value = rolesResponse.data;

    // Fetch sidebar items (rows)
    const sidebarResponse = await axios.get(sidebarItemsApi);
    sidebarItems.value = sidebarResponse.data;

    // Initialize matrixSelections
    initializeMatrix();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const initializeMatrix = () => {
  matrixSelections.value = sidebarItems.value.map((item) => {
    // Create a row object for each sidebar item
    const roleRow = {};
    roles.value.forEach((role) => {
      // Ensure each role is initialized as either `true` or `false`
      roleRow[role.id] = item.roles.includes(role.id);
    });
    return roleRow;
  });
};

const onCheckboxChange = async (rowIndex, roleId) => {
  console.log("rowIndex:", rowIndex, "roleId:", roleId); // Debugging log
  if (
    !matrixSelections.value[rowIndex] || // Ensure the row exists
    typeof matrixSelections.value[rowIndex][roleId] === 'undefined' // Ensure the role exists
  ) {
    console.error(`Invalid rowIndex (${rowIndex}) or roleId (${roleId}).`);
    return;
  }

  modified.value = true;

  // Find the sidebar item being updated
  const item = sidebarItems.value[rowIndex];

  // Update the roles array based on the checkbox state
  const isChecked = matrixSelections.value[rowIndex][roleId];
  if (isChecked) {
    // Add the roleId if it's checked
    if (!item.roles.includes(roleId)) {
      item.roles.push(roleId);
    }
  } else {
    // Remove the roleId if it's unchecked
    const roleIndex = item.roles.indexOf(roleId);
    if (roleIndex !== -1) {
      item.roles.splice(roleIndex, 1);
    }
  }

  // Prepare the payload as per the required format
  const payload = {
    item_type: "sidebar_item",
    name: item.name,
    url: item.url,
    roles: item.roles,
  };

  console.log("Sending Payload:", payload);

  // Send the updated data to the API
  try {
    const response = await axios.put(`${updateSidebarApi}${item.id}/`, payload);
    console.log("Updated Successfully:", response.data);
  } catch (error) {
    if (error.response) {
      console.error("API Error Response:", error.response.data);
    } else {
      console.error("Network or Other Error:", error.message);
    }
  }
};


// const showEditModal = ref(false); // Controls the visibility of the modal
// const currentEditItem = ref({ name: "", url: "", id: null }); // Tracks the item being edited

const addSidebarItem = async () => {
  const { value: formValues } = await Swal.fire({
    title: "Add Sidebar Item",
    html: `
      <div class="mb-4">
        <label class="block text-sm font-bold mb-2">Name</label>
        <input
          id="name-input"
          type="text"
          class="swal2-input"
          placeholder="Enter item name"
        />
      </div>
      <div class="mb-4">
        <label class="block text-sm font-bold mb-2">Icon</label>
        <input
          id="icon-input"
          type="text"
          class="swal2-input"
          placeholder="Enter icon name"
        />
      </div>
      <div class="mb-4">
        <label class="block text-sm font-bold mb-2">URL</label>
        <input
          id="url-input"
          type="text"
          class="swal2-input"
          placeholder="Enter item URL"
        />
      </div>
      <div class="mb-4">
        <label class="block text-sm font-bold mb-2">Roles (Comma-separated IDs)</label>
        <input
          id="roles-input"
          type="text"
          class="swal2-input"
          placeholder="e.g., 1,3"
        />
      </div>
    `,
    focusConfirm: false,
    preConfirm: () => {
      const name = (document.getElementById("name-input") as HTMLInputElement).value;
      const icon = (document.getElementById("icon-input") as HTMLInputElement).value;
      const url = (document.getElementById("url-input") as HTMLInputElement).value;
      const rolesInput = (document.getElementById("roles-input") as HTMLInputElement).value;

      if (!name || !url || !rolesInput) {
        Swal.showValidationMessage("All fields are required!");
        return null;
      }

      const roles = rolesInput
        .split(",")
        .map((role) => parseInt(role.trim()))
        .filter((role) => !isNaN(role)); // Parse and validate roles array

      if (roles.length === 0) {
        Swal.showValidationMessage("Roles must include at least one valid ID!");
        return null;
      }

      return { name, icon, url, roles };
    },
    showCancelButton: true,
    confirmButtonText: "Add",
    cancelButtonText: "Cancel",
    customClass: {
      popup: "rounded-lg",
      confirmButton: "bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded",
      cancelButton: "bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded",
    },
  });

  if (formValues) {
    const payload = {
      item_type: "sidebar_item",
      name: formValues.name,
      icon: formValues.icon,
      url: formValues.url,
      roles: formValues.roles,
    };

    try {
      const response = await axios.post("http://192.168.45.55:8000/api/create_sidebar/", payload);
      console.log("Created Successfully:", response.data);

      // Add the new item to the sidebarItems array
      sidebarItems.value.push(response.data);

      Swal.fire("Success!", "Sidebar item added successfully!", "success");
    } catch (error) {
      Swal.fire(
        "Error",
        error.response ? error.response.data : "Something went wrong!",
        "error"
      );
    }
  }
};

const editItem = async (item) => {
  const { value: formValues } = await Swal.fire({
    title: "Edit Sidebar Item",
    html: `
      <div class="mb-4">
        <label class="block text-sm font-bold mb-2">Name</label>
        <input
          id="name-input"
          type="text"
          class="swal2-input"
          value="${item.name}"
          placeholder="Enter item name"
        />
      </div>
      <div class="mb-4">
        <label class="block text-sm font-bold mb-2">URL</label>
        <input
          id="url-input"
          type="text"
          class="swal2-input"
          value="${item.url}"
          placeholder="Enter item URL"
        />
      </div>
    `,
    focusConfirm: false,
    preConfirm: () => {
      const name = (document.getElementById("name-input") as HTMLInputElement).value;
      const url = (document.getElementById("url-input") as HTMLInputElement).value;
      if (!name || !url) {
        Swal.showValidationMessage("Both Name and URL are required!");
        return null;
      }
      return { name, url };
    },
    showCancelButton: true,
    confirmButtonText: "Save",
    cancelButtonText: "Cancel",
    customClass: {
      popup: "rounded-lg",
      confirmButton: "bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded",
      cancelButton: "bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded",
    },
  });

  if (formValues) {
    // Send the updated data to the API
    const payload = {
      item_type: "sidebar_item",
      name: formValues.name,
      url: formValues.url,
      roles: item.roles, // Preserve the roles
    };

    try {
      const response = await axios.put(`${updateSidebarApi}${item.id}/`, payload);
      console.log("Updated Successfully:", response.data);

      // Update the sidebarItems array with the new data
      const index = sidebarItems.value.findIndex((sidebarItem) => sidebarItem.id === item.id);
      if (index !== -1) {
        sidebarItems.value[index] = { ...item, ...formValues };
      }
      Swal.fire("Success!", "Sidebar item updated successfully!", "success");
    } catch (error) {
      Swal.fire(
        "Error",
        error.response ? error.response.data : "Something went wrong!",
        "error"
      );
    }
  }
};

// Save the updated values and send to the API
const saveEdit = async () => {
  const payload = {
    item_type: "sidebar_item",
    name: currentEditItem.value.name,
    url: currentEditItem.value.url,
    roles: currentEditItem.value.roles, // Preserve the roles
  };

  try {
    const response = await axios.put(`${updateSidebarApi}${currentEditItem.value.id}/`, payload);
    console.log("Updated Successfully:", response.data);

    // Update the sidebarItems array with the new data
    const index = sidebarItems.value.findIndex((item) => item.id === currentEditItem.value.id);
    if (index !== -1) {
      sidebarItems.value[index] = { ...currentEditItem.value };
    }

    showEditModal.value = false; // Close the modal
  } catch (error) {
    console.error("Error updating item:", error.response ? error.response.data : error.message);
  }
};

// Close the edit modal
const closeEditModal = () => {
  showEditModal.value = false;
};

const deleteItem = async (id) => {
  try {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });
    if (confirm.isConfirmed) {
      await axios.delete(`${updateSidebarApi}${id}/?item_type=sidebar_item`);
      sidebarItems.value = sidebarItems.value.filter(item => item.id !== id);
      Swal.fire("Deleted!", "Your item has been deleted.", "success");
    }
  } catch (error) {
    console.error("Error deleting item:", error);
    Swal.fire("Error!", "Could not delete the item.", "error");
  }
};

// // Save changes (optional batch saving)
// const saveChanges = async () => {
//   try {
//     console.log("Saving all changes:", matrixSelections.value);

//     // Simulate bulk save if needed
//     for (const [rowIndex, item] of sidebarItems.value.entries()) {
//       await axios.put(`${updateSidebarApi}${item.id}/`, {
//         id: item.id,
//         name: item.name,
//         url: item.url,
//         roles: item.roles,
//       });
//     }

//     alert("Changes saved successfully!");
//     modified.value = false;
//   } catch (error) {
//     console.error("Error saving changes:", error);
//   }
// };



// Fetch data when component is mounted
onMounted(fetchData);

</script>

<style scoped>

/* Modal Background */
.fixed {
  z-index: 50;
}

/* Modal Container */
.bg-white {
  max-width: 500px;
}
.modern-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  font-family: 'Arial', sans-serif;
}

.modern-table th,
.modern-table td {
  padding: 12px 15px;
  text-align:left;
  border: 1px solid #e0e0e0;
}

.modern-table thead {
  background-color: #2c3e50;
  color: white;
}

.modern-table tbody tr {
  transition: background-color 0.3s;
}

.modern-table tbody tr:hover {
  background-color: #f1f1f1;
}

.item-name {
  font-weight: bold;
  color: #34495e;
}

.form-checkbox {
  cursor: pointer;
}

.save-button {
  padding: 10px 15px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.save-button:hover {
  background-color: #2980b9;
}

.save-button:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}
</style>