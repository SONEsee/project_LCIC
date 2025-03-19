<template>
  <div class="border py-2 my-2 rounded-lg">
    <h2 class="mx-4">ໜ້າຕ່າງການຈັດການຜູ້ນໍາໃຊ້</h2>
    <v-btn
          :to="'backend/manageuser/create_user'"
          color="indigo-darken-4" 
          elevation="2"
          >
          <v-icon left class="pr-1">mdi-plus-circle</v-icon>
        ເພື່ມຜູ້ນໍາໃຊ້
    </v-btn>
    <!-- Search and Sort -->
    <div class="filter-container mb-2 pt-4">
      <!-- <div class="search-box">
        <span class="mdi mdi-magnify search-icon"></span>
        <input
          id="search"
          v-model="searchQuery"
          @input="applySearchFilter"
          type="text"
          placeholder="ຄົ້ນຫາ"
        />
      </div> -->

      <div class="search-dropdown-container">
        <!-- Search Box -->
        <div class="search-box">
          <span class="mdi mdi-magnify search-icon"></span>
          <input
            id="search"
            v-model="searchQuery"
            @input="applySearchFilter"
            type="text"
            placeholder="ຄົ້ນຫາ"
          />
        </div>

        <!-- Dropdown -->
        <div class="sort-box">
          <label for="sort_by" class="mx-2">Sort By:</label>
          <select id="sort_by" v-model="selectedSort" @change="fetchUserCounts">
            <option value="user_count">ຜູ້ໃຊ້ງານ ໜ້ອຍ</option>
            <option value="-user_count">ຜູ້ໃຊ້ງານ ຫຼາຍ</option>
            <option value="bnk_code">ທະນາຄານ ໜ້ອຍ</option>
            <option value="-bnk_code">ທະນາຄານ ຫຼາຍ</option>
          </select>
        </div>




      </div>
    </div>

    <hr class="ma-2">

    <!-- Table -->
    <table class="styled-table">
      <thead>
        <tr>
          <th
            v-for="header in headers"
            :key="header.value"
            :class="{ sortable: header.sortable !== false }"
          >
            {{ header.title }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(bank, index) in filteredUserCounts"
          :key="index"
        >
          <td>
            {{ bank.bnk_code }} - {{ bank.member_code }} - {{ bank.member_nameL }}
          </td>
          <td>{{ bank.user_count }}</td>
          <td>
            <v-btn
              @click="viewDetail(bank.bnk_code)"
              class="custom-button pa-1"
              color="white"
              small
            >
              <v-icon left>mdi-eye</v-icon>
            </v-btn>
          </td>
        </tr>
        <tr v-if="filteredUserCounts.length === 0">
          <td colspan="3" class="no-results">No results found</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
definePageMeta({
  middleware: "auth",
  layout: "backend",
});

useHead({
  title: "Manage Users",
});

// Headers for the table
const headers = [
  { title: "ທະນາຄານ", value: "bnk_code - member_code - member_nameL" },
  { title: "ຈໍານວນຜູ້ໃຊ້ງານ", value: "user_count" },
  { title: "ເຫດການ", value: "actions", sortable: false },
];

// Reactive variables
const userCounts = ref([]);
const searchQuery = ref("");
const selectedSort = ref("user_count");
const router = useRouter();

// Computed property for filtering
const filteredUserCounts = computed(() => {
  const search = searchQuery.value.toLowerCase();
  return userCounts.value.filter((bank) => {
    const memberNameL = bank.member_nameL?.toLowerCase() ?? "";
    const memberCode = bank.member_code?.toLowerCase() ?? "";
    const bankCode = bank.bnk_code?.toLowerCase() ?? "";

    return (
      memberNameL.includes(search) ||
      memberCode.includes(search) ||
      bankCode.includes(search)
    );
  });
});

// Fetch user data
const fetchUserCounts = async () => {
  try {
    const config = useRuntimeConfig();
    const response = await axios.get(
      `${config.public.strapi.url}api/distinct-bnk-codes/`,
      { params: { sort_by: selectedSort.value } }
    );
    userCounts.value = response.data;
  } catch (error) {
    console.error("Error fetching user count data:", error);
  }
};

// View detail handler
const viewDetail = (bnk_code) => {
  const detailUrl = `test7/?bnk_code=${bnk_code}`;
  router.push(detailUrl);
};

// On mounted
onMounted(fetchUserCounts);
</script>


<style>
.styled-table {
  border-collapse: collapse;
  width: 100%;
  background-color: #ffffff; /* Light blue */
  border: 1px solid #d3d3d3;
}

.styled-table th {
  background-color: #f3f3f3; /* Sky blue */
  color: rgb(138, 138, 138);
  padding: 12px;
  text-align: left;
  font-weight: bold;
}

.styled-table td {
  padding: 10px;
  border: 1px solid #d3d3d3;
}

.styled-table tr:hover {
  background-color: #e6f7ff; 
}

.no-results {
  text-align: center;
  color: #888;
}


.search-dropdown-container {
  display: flex;
  align-items: center;
  justify-content: space-between; 
  margin-bottom: 16px; 
}

/* Search Box */
.search-box {
  position: relative;
  flex: 1; 
  margin-right: 16px;
}

.search-box input {
  width: 100%;
  height: 48px;
  padding: 12px 16px 12px 48px; 
  border: 1px solid #d1d5db; 
  border-radius: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); 
  font-size: 16px;
  color: #374151; /* Dark gray */
  background-color: #f9fafb;
  outline: none;
}

.search-box input:focus {
  border-color: #003dc0;
  box-shadow: 0 2px 6px rgba(56, 178, 172, 0.3);
}

.search-box .search-icon {
  position: absolute;
  top: 50%;
  left: 16px;
  transform: translateY(-50%);
  font-size: 20px;
  color: #003dc0;
}

/* Dropdown */
.sort-box {
  flex-shrink: 0; /* Prevent shrinking */
}

.sort-box label {
  margin-right: 8px; /* Space between label and select */
  font-size: 16px;
  color: #374151;
}

.sort-box select {
  height: 48px;
  padding: 8px 16px;
  border: 1px solid #d1d5db; /* Light gray */
  border-radius: 8px;
  background-color: #ffffff;
  font-size: 16px;
  color: #374151; /* Dark gray */
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.sort-box select:focus {
  border-color: #003dc0; /* Teal color on focus */
  box-shadow: 0 2px 6px rgba(0, 85, 196, 0.3); /* Teal shadow */
}

</style>
