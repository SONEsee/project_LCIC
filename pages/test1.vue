<!-- <template>
  <div>
    <h1>Roles</h1>
    <v-container>
      <v-row>
        <v-col>
          <v-table>
            <thead>
              <tr>
                <th>Sidebar Item</th>
                <th v-for="role in roles" :key="role.id">{{ role.name }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in sidebarItems" :key="item.id">
                <td>{{ item.name }}</td>
                <td v-for="role in roles" :key="role.id">
                  <v-checkbox
                    v-model="selectedSidebarItems"
                    :value="{ roleId: role.id, itemId: item.id }"
                    :label="item.name"
                  ></v-checkbox>
                </td>
                <td>
                  <ul>
                    <li
                      v-for="subItem in item.sidebarSubItems"
                      :key="subItem.id"
                    >
                      {{ subItem.name }}
                      <v-checkbox
                        v-model="selectedSidebarSubItems"
                        :value="{
                          roleId: role.id,
                          itemId: item.id,
                          subItemId: subItem.id,
                        }"
                        :label="subItem.name"
                      ></v-checkbox>
                    </li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-col>
      </v-row>
      <v-btn @click="submitForm" color="primary">Submit</v-btn>
    </v-container>
  </div>
</template>

<script>
import { reactive, onMounted, toRefs } from "vue";
definePageMeta({
  // middleware:['auth'],
  layout: "backend",
});

export default {
  setup() {
    const state = reactive({
      roles: [],
      sidebarItems: [],
      selectedSidebarItems: [],
      selectedSidebarSubItems: [],
    });

    const fetchRoles = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/roles/");
        const data = await response.json();
        state.roles = data;
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    const fetchSidebarItems = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/sidebar-items/"
        );
        const data = await response.json();
        state.sidebarItems = data;
      } catch (error) {
        console.error("Error fetching sidebar items:", error);
      }
    };

    // const submitForm = async () => {
    //   // const userData = localStorage.getItem('user_data');
    //   // const user = userData ? JSON.parse(userData) : null;
    //   // const userGID = user ? user.GID : null;

    //   const formData = {

    //     selectedSidebarItems: state.selectedSidebarItems,
    //     selectedSidebarSubItems: state.selectedSidebarSubItems
    //   };

    //   try {
    //     const response = await fetch('http://127.0.0.1:8000/api/assign-role/', {
    //       method: 'POST',
    //       headers: { 'Content-Type': 'application/json' },
    //       body: JSON.stringify(formData)
    //     });
    //     const result = await response.json();
    //     console.log('Role assigned successfully:', result);
    //   } catch (error) {
    //     console.error('Error submitting form:', error);
    //   }
    // };

    const submitForm = async () => {
      // Object to hold the roles and their corresponding sidebar items/sub-items
      const formDataList = [];

      // Create a structure to group sidebar items and sub-items by role
      const roleItems = {};

      // Process selected sidebar items
      state.selectedSidebarItems.forEach(({ roleId, itemId }) => {
        if (!roleItems[roleId]) {
          roleItems[roleId] = {
            role_id: roleId,
            sidebar_items: [],
            sidebar_sub_items: [],
          };
        }
        roleItems[roleId].sidebar_items.push(itemId);
      });

      // Process selected sidebar sub-items
      state.selectedSidebarSubItems.forEach(({ roleId, subItemId }) => {
        if (!roleItems[roleId]) {
          roleItems[roleId] = {
            role_id: roleId,
            sidebar_items: [],
            sidebar_sub_items: [],
          };
        }
        roleItems[roleId].sidebar_sub_items.push(subItemId);
      });

      // Convert the roleItems object to an array of formData for each role
      for (const roleId in roleItems) {
        formDataList.push(roleItems[roleId]);
      }

      // Send the POST requests for each role
      for (const formData of formDataList) {
        try {
          const response = await fetch(
            "http://127.0.0.1:8000/api/assign-role/",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(formData),
            }
          );
          const result = await response.json();
          console.log("Role assigned successfully:", result);
        } catch (error) {
          console.error("Error assigning role:", error);
        }
      }
    };

    onMounted(() => {
      fetchRoles();
      fetchSidebarItems();
    });

    return {
      ...toRefs(state),
      submitForm,
    };
  },
};
</script>

<style scoped>
table {
  border-collapse: collapse;
  width: 100%;
}

th,
td {
  border: 1px solid #ddd;
  padding: 10px;
}

th {
  background-color: #f0f0f0;
}

td {
  background-color: #fff;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

li:last-child {
  border-bottom: none;
}
</style> -->

<script lang="ts" setup>
const { locale, setLocale } = useI18n();
</script>

<template>
  <div>
    <v-btn color="primary" @click="setLocale(locale === 'en' ? 'lo' : 'en')">
      {{ locale }}</v-btn
    >
    {{ $t("hello") }}
  </div>
</template>
