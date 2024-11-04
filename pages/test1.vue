<template>
  <div style="border: 1px solid brown;" id="0">
    <v-col>
      <v-row>
        <v-col cols="12">
          <v-autocomplete
            v-model="selectedVillage"
            :items="villages"
            item-text="title"
            item-value="id"
            label="ກະລຸນາເລືອກບ້ານ"
            @input="handleVillageSelect"
          ></v-autocomplete>
        </v-col>
      </v-row>
    </v-col>

    <h1>ບ້ານທີ່ເລືອກ: {{ selectedVillageName }}</h1>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";

const selectedVillage = ref(null);
const selectedVillageName = ref("");
const villages = ref([]);
const title = ref(""); 

<<<<<<< HEAD
    const fetchRoles = async () => {
      try {
        const response = await fetch('http://127.0.0.1:35729/api/roles/');
        const data = await response.json();
        state.roles = data;
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    const fetchSidebarItems = async () => {
      try {
        const response = await fetch('http://127.0.0.1:35729/api/sidebar-items/');
        const data = await response.json();
        state.sidebarItems = data;
      } catch (error) {
        console.error("Error fetching sidebar items:", error);
      }
    };
=======

const fetchVillages = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:35729/api/filter_villages/");
    villages.value = response.data.map(village => ({
      ...village,
      title: `ແຂວງ: ${village.Province_Name} - ເມືອງ: ${village.District_Name} - ບ້ານ ${village.Village_Name}`
    }));
>>>>>>> 7a6a73f4385a12dae435ab5762d85d2ece83ccaa

    console.log("Fetched villages:", JSON.parse(JSON.stringify(villages.value)));
  } catch (error) {
    console.error("Error fetching villages:", error);
  }
};


onMounted(fetchVillages);

<<<<<<< HEAD
    //   try {
    //     const response = await fetch('http://127.0.0.1:35729/api/assign-role/', {
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
=======
const handleVillageSelect = (value: number) => {
  const selected = villages.value.find(village => village.id === value);
  if (selected) {
    selectedVillageName.value = selected.Village_Name;
    title.value = ` ${selected.District_Name} ${selected.Province_Name}  `;
  }
  console.log("Selected village ID:", value);
  console.log("Selected village name:", selectedVillageName.value);
  console.log("Selected province and district:", title.value);
>>>>>>> 7a6a73f4385a12dae435ab5762d85d2ece83ccaa
};
</script>
