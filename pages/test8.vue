<template>
  <div>
    <h3>ຜູ້ນຳໃຊ້</h3>
    <table class="styled-table">
      <thead>
        <tr class="head-th">
          <th>ຊື່ທະນາຄານ</th>
          <th>ຊື່ຜູ້ນຳໃຊ້</th>
          <th>ຊື່ ເເລະ ນາມສະກຸນ</th>
          <th>ສີດນໍາໃຊ້</th>
          <th>ເຂົ້າສູ່ລະບົບຄັ້ງສຸດທ້າຍ</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) in userDetails" :key="index" class="body-row">
          <td>{{ user.bnk_code }} - {{ user.bnk_form }} - {{ user.bnk_name }}  </td>
          <td>{{ user.username }}</td>
          <td>{{ user.nameL }} {{ user.surnameL }}</td>
          <td>{{ user.Permission }}</td>
          <td>{{ user.last_login }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
definePageMeta({
  middleware: "auth",
  layout: "backend",
});

useHead({
  title: "Manage Users",
});
const userDetails = ref([]); // Store user data

const route = useRoute(); // Access route parameters

const fetchUserDetails = async () => {
  try {
    // Get parameters from the URL
    const bnk_code = route.query.bnk_code || "";
    const branch_id = route.query.branch_id || "";

    // Build the API URL
    let apiUrl = `http://192.168.45.56:8000/api/distinct-bnk-codes/?bnk_code=${bnk_code}`;
    if (branch_id) {
      apiUrl += `&branch_id=${branch_id}`;
    }

    // Fetch data from the API
    const response = await $fetch(apiUrl);

    if (response) {
      userDetails.value = response; // Assign response data
      console.log("Fetched user details:", userDetails.value);
    } else {
      console.error("Failed to fetch user details.");
    }
  } catch (error) {
    console.error("Error fetching user details:", error);
  }
};

// Fetch data when the component is mounted
onMounted(fetchUserDetails);
</script>

<style>
.styled-table {
  width: 100%;
  margin: 20px 0;
  font-size: 14px;
  text-align: left;
  border-collapse: separate;
  border-spacing: 0;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.styled-table th {
  background-color: #f4f4f4;
  padding: 12px;
  font-weight: bold;
  color: gray;
}

.styled-table tbody tr {
  background-color: #fff;
  transition: background-color 0.3s;
}

.styled-table tbody tr:hover {
  background-color: #f9f9f9;
}

.styled-table tbody td {
  padding: 12px;
  border: none;
  vertical-align: middle;
}

.head-th {
  font-style: normal !important;
  font-size: 15px !important;
  color: gray;
}

.body-row {
  border: none;
  color: black;
}

.styled-table tbody tr + tr {
  margin-top: 10px;
}
</style>
